/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var batch_no_error = false;
$(document).ready(function() {
    //Adding Product GTINs
    $(".add-gtin").click(function(e) {
        e.preventDefault();
        var prod, gtin_no, prod_id, supp_id, gtin_post, ele_gtinbox, ele_gtinErrMess, ele_gtin_no, type;

        if ($(this).attr('prod') && $(this).attr('prod') != '') {
            prod = $(this).attr('prod');
            gtin_no = $('#gtin_no_' + prod).val();
            prod_id = $('#prod_id_' + prod).val();
            supp_id = $('#supp_id_' + prod).val();
            gtin_post = $('#gtin_post').val();
            ele_gtinbox = $('#gtinbox_' + prod + ' tbody');
            ele_gtinErrMess = $('#gtinErrorMess_' + prod);
            ele_gtin_no = $('#gtin_no_' + prod);
            type = 'dispatch';
        } else {
            gtin_no = $('#gtin_no').val();
            prod_id = $('#prod_id').val();
            supp_id = $('#supp_id').val();
            gtin_post = $('#gtin_post').val();
            ele_gtinbox = $('#gtinbox tbody');
            ele_gtinErrMess = $('#gtinErrorMess');
            ele_gtin_no = $('#gtin_no');
            type = 'status';
        }
        if (gtin_no !== '') {
            $.ajax({
                type: "POST",
                url: gtin_post,
                data: {
                    'csrf_imsnaco': get_csrf_cookie(),
                    'pd_id': prod_id,
                    'supp': supp_id,
                    'gtin_no': gtin_no,
                    'type': type
                },
                dataType: "json",
                cache: false,
                success: function(data) {
                    if (data.status == 'success') {
                        ele_gtinbox.html(data.result);
                        ele_gtinErrMess.show();
                        ele_gtinErrMess.html(alertMess(data.message, data.status));
                        ele_gtinErrMess.fadeOut(5000);
                        ele_gtin_no.val('');
                    } else {
                        ele_gtinErrMess.show();
                        ele_gtinErrMess.html(alertMess(data.message, data.status));
                        ele_gtin_no.val('');
                    }
                }
            });
            return false;
        } else {
            ele_gtinErrMess.show();
            ele_gtinErrMess.html(alertMess('GTIN Number should not be blank.', 'warning'));
        }
    });
    //Adding Packaging Norms
    $(".add-pnorm").click(function(e) {
        e.preventDefault();
        var prod, prod_id, supp_id, pnorm_post, pn_name, prim, p_qty, second, s_qty, tert, t_qty, ele_pnormbox, ele_pnormErrmess, ele_pnormInput, type;
        if ($(this).attr('prod') && $(this).attr('prod') != '') {
            prod = $(this).attr('prod');
            prod_id = $('#prod_id_' + prod).val();
            supp_id = $('#supp_id_' + prod).val();
            pnorm_post = $('#pnorm_post').val();

            pn_name = $('#pn_name_' + prod).val();
            prim = $('#prim_' + prod).val();
            p_qty = $('#p_qty_' + prod).val();
            second = $('#second_' + prod).val();
            s_qty = $('#s_qty_' + prod).val();
            tert = $('#tert_' + prod).val();
            t_qty = $('#t_qty_' + prod).val();

            type = 'dispatch';
            ele_pnormbox = $('#pnormbox_' + prod + ' tbody');
            ele_pnormErrmess = $('#pNormErrorMess_' + prod);
            ele_pnormInput = $('#pnormbox_' + prod + ' tfoot input[type="text"]');

        } else {
            prod_id = $('#prod_id').val();
            supp_id = $('#supp_id').val();
            pnorm_post = $('#pnorm_post').val();

            pn_name = $('#pn_name').val();
            prim = $('#prim').val();
            p_qty = $('#p_qty').val();
            second = $('#second').val();
            s_qty = $('#s_qty').val();
            tert = $('#tert').val();
            t_qty = $('#t_qty').val();

            type = 'dispatch';
            ele_pnormbox = $('#pnormbox tbody');
            ele_pnormErrmess = $('#pNormErrorMess');
            ele_pnormInput = $('#pnormbox tfoot input[type="text"]');
        }
        if (pn_name !== '') {
            $.ajax({
                type: "POST",
                url: pnorm_post,
                data: {
                    'csrf_imsnaco': get_csrf_cookie(),
                    'pd_id': prod_id,
                    'supp': supp_id,
                    'pn_name': pn_name,
                    'prim': prim,
                    'p_qty': p_qty,
                    'second': second,
                    's_qty': s_qty,
                    'tert': tert,
                    't_qty': t_qty,
                    'type': type
                },
                dataType: "json",
                cache: false,
                success: function(data) {
                    if (data.status == 'success') {
                        ele_pnormbox.html(data.result);
                        ele_pnormErrmess.show();
                        ele_pnormErrmess.html(alertMess(data.message, data.status));
                        ele_pnormErrmess.fadeOut(5000);
                        ele_pnormInput.val('');
                    } else {
                        ele_pnormErrmess.show();
                        ele_pnormErrmess.html(alertMess(data.message, data.status));
                        ele_pnormInput.val('');
                    }
                }
            });
            return false;
        } else {
            ele_pnormErrmess.show();
            ele_pnormErrmess.html(alertMess('Fields should not be blank.', 'warning'));
        }
    });
    //Batch Dates Action

    $("input[name='m_date']").datepicker({
        dateFormat: "dd M yy",
        changeYear: true,
        changeMonth: true,
        onSelect: function(date) {
            cp = $(this).attr('prod');
            $('#x_date' + cp).datepicker('option', 'minDate', date);
            var md = $("#m_date" + cp).val();
            var xd = $("#x_date" + cp).val();
            var mdate = new Date(md);
            var xdate = new Date(xd);
            if (xdate < mdate) {
                $('#batchErrorMess').show();
                $('#batchErrorMess').html(alertMess('Manufacture Date should be less than Expiry Date.', 'warning'));
                $(this).val(date);
            }
        }
    });

    $("input[name='x_date']").datepicker({
        dateFormat: "dd M yy",
        changeYear: true,
        changeMonth: true,
        onSelect: function(date) {
            cp = $(this).attr('prod');
            var md = $("#m_date" + cp).val();
            var xd = $("#x_date" + cp).val();
            var mdate = new Date(md);
            var xdate = new Date(xd);
            if (xdate < mdate) {
                $('#batchErrorMess').show();
                $('#batchErrorMess').html(alertMess('Expiry Date should be grater than Manufacturing Date.', 'warning'));
                $(this).val(date);

            } else {
                var xdt = xdate.getDate();
                var xmnth = xdate.getMonth();
                if (xmnth == 1) {
                    if (xdt < 28) {
                        xd = '28' + ' ' + getMonthName(xdate.getMonth()) + ' ' + xdate.getFullYear();
                    }
                } else {
                    if (xdt < 30) {
                        xd = '30' + ' ' + getMonthName(xdate.getMonth()) + ' ' + xdate.getFullYear();
                    }
                }
                $(this).val(xd);
            }
        }
    });
    $(".batch_no").on("keyup paste", function() {
        ob = $(this);
        setTimeout(function() {
            batch_no = ob.val();
            var allowed = /^[a-zA-Z0-9]+$/;
            batch_no_error = false;
            ob.parent().find(".invalid-chars").remove();

            if (batch_no && !allowed.test(batch_no)) {
                batch_no_error = true;
                ob.parent().append('<p class="text-danger invalid-chars">Only Alphabates and Digits allowed!</p>');
            }
        }, 100);
    });
    //Adding Batch number
    $(".add-batch").click(function(e) {
        e.preventDefault();
        var prod, prod_id, supp_id, batch_post, batch_no, m_date, x_date, type, ele_batchBox, ele_batchErrMess, ele_batchInput;
        if ($(this).attr('prod') && $(this).attr('prod') != '') {
            prod = $(this).attr('prod');
            prod_id = $('#prod_id_' + prod).val();
            supp_id = $('#supp_id_' + prod).val();
            batch_post = $('#batch_post').val();

            batch_no = $('#batch_no' + prod).val();
            m_date = $('#m_date' + prod).val();
            x_date = $('#x_date' + prod).val();

            type = 'dispatch';
            ele_batchBox = $('#batchbox_' + prod + ' tbody');
            ele_batchErrMess = $('#batchErrorMess_' + prod);
            ele_batchInput = $('#batchbox_' + prod + ' tfoot input[type="text"]');

        } else {
            prod='';
            prod_id = $('#prod_id').val();
            supp_id = $('#supp_id').val();
            batch_post = $('#batch_post').val();

            batch_no = $('#batch_no').val();
            m_date = $('#m_date').val();
            x_date = $('#x_date').val();

            type = 'status';
            ele_batchBox = $('#batchbox tbody');
            ele_batchErrMess = $('#batchErrorMess');
            ele_batchInput = $('#batchbox tfoot input[type="text"]');
        }
        if (batchValidate(prod)) {
            $.ajax({
                type: "POST",
                url: batch_post,
                data: {
                    'csrf_imsnaco': get_csrf_cookie(),
                    'pd_id': prod_id,
                    'supp': supp_id,
                    'batch_no': batch_no,
                    'm_date': m_date,
                    'x_date': x_date,
                    'type': type
                },
                dataType: "json",
                cache: false,
                success: function(data) {
                    if (data.status == 'success') {
                        ele_batchBox.html(data.result);
                        ele_batchErrMess.show();
                        ele_batchErrMess.html(alertMess(data.message, data.status));
                        ele_batchErrMess.fadeOut(5000);
                        ele_batchInput.val('');
                    } else {
                        ele_batchErrMess.show();
                        ele_batchErrMess.html(alertMess(data.message, data.status));
                        ele_batchInput.val('');
                    }
                }
            });
            return false;
        } else {
            ele_batchErrMess.show();
            ele_batchErrMess.html(alertMess('Batch number should be in Valid Format and Fields should not be blank.', 'error'));
            ele_batchErrMess.fadeOut(5000);
        }
    });
    $('input.disTo').click(function() {
        var prod = $(this).attr('prod');
        var type = $(this).val();
        if (type == 'FAC') {
            $('#facs_list_' + prod).removeClass('hidden');
            $('#sacs_list_' + prod).addClass('hidden');
        } else {
            $('#facs_list_' + prod).addClass('hidden');
            $('#sacs_list_' + prod).removeClass('hidden');
        }
    });

    $('.closePopUp').click(function() {
        $('.popBox').hide();
        $('#overlay').hide();
    });

    dateSelections();
    activeRemoveBatch();
    batchProdQty();
    $('.updateDisp').click(function() {
        $('#dtl_prodDisp').addClass('hidden');
        $('#dispProcess').removeClass('hidden');
        $('#proceedDisp').removeClass('hidden');
        $('#goBackBtn').removeClass('hidden');
        $('#completeProcess').addClass('hidden');
        $('#updateDispBtn').addClass('hidden');
    });
    $('#completeDisp').click(function() {
        $("#invoiceForm").submit();
    });
    $('#invoiceForm').validator().on('submit', function(e) {
        if (e.isDefaultPrevented()) {
            $('#invoiceErrMess').show();
            $('#invoiceErrMess').html(alertMess('Please check the errors below.', 'error'));
            $('#invoiceErrMess').fadeOut(4000);
        } else {
            var invNum = $('#invoice_no').val();
            var invdate = $('#invoice_date').val();
            var disDate = $('#dispatch_date').val();
            var delDate = $('#delivery_date').val();
            var trasName = $('#trans_name').val();
            var drivName = $('#driver_name').val();
            var drivMob = $('#driver_mob').val();
            var d_noa_id = $('#d_noa_id').val();
            var d_supp_id = $('#d_supp_id').val();
            var d_lot_no = $('#d_lot_no').val();
            var d_consignee = $('#d_consignee').val();
            var d_prods = $('#d_prods').val();
            var d_postURL = $('#d_postURL').val();
            $.ajax({
                type: "POST",
                url: d_postURL,
                data: {
                    'csrf_imsnaco': get_csrf_cookie(),
                    'invoice_no': invNum,
                    'invoice_date': invdate,
                    'dispatch_date': disDate,
                    'delivery_date': delDate,
                    'trans_name': trasName,
                    'driver_name': drivName,
                    'driver_mob': drivMob,
                    'd_noa_id': d_noa_id,
                    'd_supp_id': d_supp_id,
                    'd_lot_no': d_lot_no,
                    'd_consignee': d_consignee,
                    'd_prods': d_prods
                },
                dataType: "json",
                cache: false,
                success: function(data) {
                    if (data.status == 'warning') {
                        $('#invoiceErrMess').show();
                        $('#invoiceErrMess').html(alertMess(data.message, data.status));
                    } else if (data.status == 'error') {
                        $('#invoiceErrMess').html('');
                        $('#invoiceErrMess').show();
                        $.each(data.message, function(k, v) {
                            $('#invoiceErrMess').append(alertMess(v, data.status));
                        });
                    } else {
                        window.location.replace(data.rUrl);
                    }
                }
            });
            return false;
        }
    })

});
function proceedToDispatch() {
    $('#proceedDisp').on('click', function() {
        var prodData = $('#prodData').attr('prods');
        var jsonProd = [];
        validDispatch = false;
        if (prodData != '') {
            jsonProd = $.parseJSON(prodData);
            $('#dtl_prods>.panel>.panel-body').html('');
            $.each(jsonProd, function(k, v) {
                var pgtin = $('#gtin_id_' + v.pid).val();
                var pnorm = $('#pnorm_id_' + v.pid).val();
                if (validBatchDetail(v.pid) && validProdDetail(pgtin, pnorm, v.pid)) {

                    makeProductTab(v.pid);
                    validDispatch = true;
                } else {
                    validDispatch = false;
                }
            });
        } else {
            alert('Please Select product to dispatch');
            return false;
        }
        if (validDispatch) {
            $('#dtl_prodDisp').removeClass('hidden');
            $('#dispProcess').addClass('hidden');
            $('#proceedDisp').addClass('hidden');
            $('#goBackBtn').addClass('hidden');
            $('#completeProcess').removeClass('hidden');
            $('#updateDispBtn').removeClass('hidden');
        }
    });
}
function validProdDetail(gt, pn, pd) {
    if (gt == '' || pn == '') {
        $('#pDetailMess_' + pd).html(alertMess('Please Select the Product Details First', 'error'));
        $('#pDetailMess_' + pd).show(1000).fadeOut(6000);
        return false;
    } else {
        return true;
    }
}
function validBatchDetail(pd) {
    if ($('tr.batchRow_' + pd).length == 0) {
        $('#pBatchMess_' + pd).html(alertMess('Please Add Batch Details', 'error'));
        $('#pBatchMess_' + pd).show(1000).fadeOut(6000);
        return false;
    } else {
        var jsonDet = [];
        validBatchHandle = true;
        $('tr.batchRow_' + pd).each(function() {
            var detailArr = {};
            detailArr['batch_id'] = $(this).find('.batch_id_' + pd).val();
            if (isProdQuant(pd) && isBatchEmpty($(this), pd)) {
                detailArr['batch_no'] = $(this).find('td.bt_no').html();
                detailArr['batch_md'] = $(this).find('td.bt_md').html();
                detailArr['batch_ed'] = $(this).find('td.bt_ed').html();
                detailArr['batch_qty'] = $(this).find('input.batchQty').val();
                jsonDet.push(detailArr);
            } else {
                validBatchHandle = false;
            }
        });
        $('#prodDetail_' + pd).attr('pData', JSON.stringify(jsonDet));
        return validBatchHandle;
    }
}
function makeProductTab(pd) {
    var prodJson = $.parseJSON($('#d_prods').val());

    var gtin = $.parseJSON($('#prodDetail_' + pd).attr('gtin'));
    var norm = $.parseJSON($('#prodDetail_' + pd).attr('norm'));
    var lot = $('#consigneeData').attr('lot');
    var pname = $('#prodDetail_' + pd).attr('pname');
    var prodDet = $.parseJSON($('#prodDetail_' + pd).attr('pData'));
    var total = 0;
    var batch_dtl = [];
    var ele = '';
    ele = '<div class="panel panel-info">';
    ele += '<div class="panel-heading"><h3 class="panel-title bold">' + pname + '</h3></div>';
    ele += '<div class="panel-body"><table class="table table-bordered">';
    ele += '<tr><td>GTIN No.</td><td>' + gtin.num + '</td></tr>';
    ele += '<tr><td>Packaging Norm</td><td>' + norm.name + '</td></tr>';
    ele += '</table></div>';
    ele += '<table class="table"><thead><tr class="info"><th colspan="4">Batch Details</th></tr></thead>';
    ele += '<tbody><tr>';
    ele += '<th>Batch No.</th>';
    ele += '<th>Manufacture Date</th>';
    ele += '<th>Expiry Date</th>';
    ele += '<th>Quantity</th>';
    $.each(prodDet, function(k, v) {
        var batchArr = {};
        batchArr['batch_id'] = v.batch_id;
        batchArr['exp_qty'] = v.batch_qty;
        batch_dtl.push(batchArr);
        total = total + getNumValue(v.batch_qty);
        ele += '<tr>';
        ele += '<td>' + v.batch_no + '</td>';
        ele += '<td>' + v.batch_md + '</td>';
        ele += '<td>' + v.batch_ed + '</td>';
        ele += '<td>' + v.batch_qty + '</td>';
        ele += '</tr>';
    });
    ele += '</tr></tbody>';
    ele += '<tfoot><tr class="warning"><td colspan="2">&nbsp;</td><td>Total</td><td class="bold">' + total + '</td></tr></tfoot>';
    ele += '</table></div>';

    $.each(prodJson, function(k, p) {
        if (p.pid == pd) {
            prodJson[k].batch_dtl = batch_dtl;
            prodJson[k].qty = total;
            return false;
        }
    });
    $('#d_prods').val(JSON.stringify(prodJson));
    $('#dtl_lotno').html(lot);
    $('#dtl_prods>.panel>.panel-body').append(ele);
}
function isBatchEmpty(ele, pd) {
    if (ele.find('input.batchQty').val() == '') {
        $('#pBatchMess_' + pd).html(alertMess('Please fill the Quantity', 'error'));
        $('#pBatchMess_' + pd).show(1000).fadeOut(6000);
        return false;
    }
    return true;
}
function isProdQuant(pd) {
    if ($('#totProdQty_' + pd).hasClass('danger')) {
        $('#pBatchMess_' + pd).html(alertMess('Total Quantity can\'t be greater than pending Quantity', 'error'));
        $('#pBatchMess_' + pd).show(1000).fadeOut(6000);
        return false;
    }
    return true;
}
// Add Product Details
function addProduct(prod) {
    $('#prod_detail_box_' + prod).removeClass('hidden');
    $('#prod_action_' + prod).addClass('hidden');
    $('#prodData').attr('prods', addProdJson(prod));
    $('#d_prods').val(addProdJson(prod));
    if (checkProd()) {
        $('#proceedDisp').removeClass('hidden');
    } else {
        $('#proceedDisp').addClass('hidden');
    }
    $('#proceedDisp').unbind('click');
    proceedToDispatch();
}
function delProdDetail(prod) {
    $('#prod_detail_box_' + prod).addClass('hidden');
    $('#prod_action_' + prod).removeClass('hidden');
    $('#prodData').attr('prods', delProdJson(prod));
    $('#d_prods').val(delProdJson(prod));
    $('#prodDetail_' + prod).remove();
    if (checkProd()) {
        $('#proceedDisp').removeClass('hidden');
    } else {
        $('#proceedDisp').addClass('hidden');
    }
}
function getProds() {
    var prodData = $('#noaData').attr('products');
    var jsonProd = [];
    if (prodData != '') {
        jsonProd = $.parseJSON(prodData);
    }
    return jsonProd;
}
function checkProd() {
    var prodData = $('#prodData').attr('prods');
    var lot = $('#consigneeData').attr('lotno');
    if (prodData != '' && lot != '') {
        return true;
    }
    return false;
}
function addProdJson(prod) {
    var prodData = $('#d_prods').val();
    var jsonProd = [];
    var jsonArr = {};
    if (prodData != '') {
        jsonProd = $.parseJSON(prodData);
    }
    jsonArr['pid'] = prod;
    jsonArr['pnorm'] = '';
    jsonArr['gtin'] = '';
    jsonArr['qty'] = '';
    jsonArr['batch_dtl'] = '';
    jsonProd.push(jsonArr);
    return JSON.stringify(jsonProd);
}
function delProdJson(prod) {
    var prodData = $('#d_prods').val();
    var jsonProd = [];
    if (prodData != '') {
        jsonProd = $.parseJSON(prodData);
    }
    $.each(jsonProd, function(k, v) {
        if (v.pid == prod) {
            jsonProd.splice(k, 1);
            return false;
        }
    });
    return JSON.stringify(jsonProd);
}


//Add consignment Details
function addProdConsignee(post_url) {
    var disp = $('input[name="disTo"]:checked').val();
    var noa = $('#noaData').attr('noaid');
    var sacs = $('#sacs_data').val();
    var facs = $('#facs_data').val();
    if (disp == 'SACS' && sacs != '') {
        $.ajax({
            type: "POST",
            url: post_url,
            data: {
                'csrf_imsnaco': get_csrf_cookie(),
                'type': disp,
                'loc_id': sacs,
                'noa': noa
            },
            dataType: "json",
            cache: false,
            success: function(data) {
                if (data.status == 'success') {
                    var jsonConsign = [];
                    var jsonArr = {};
                    jsonArr['type'] = 'BILL';
                    jsonArr['is_ship'] = 'YES';
                    jsonArr['loc_type'] = 'SACS';
                    jsonArr['loc_id'] = sacs;
                    jsonConsign.push(jsonArr);
                    $('#d_consignee').val(JSON.stringify(jsonConsign));
                    $('#billToName').html(data.result.billName);
                    $('#billToAdd').html(data.result.billto);
                    $('#shipToName').html(data.result.shipName);
                    $('#shipToAdd').html(data.result.shipto);
                    $('#dtl_billToName').html(data.result.billName);
                    $('#dtl_billToAdd').html(data.result.billto);
                    $('#dtl_shipToName').html(data.result.shipName);
                    $('#dtl_shipToAdd').html(data.result.shipto);
                    $('#consigneeData').attr('locid', sacs);
                    $('#consigneeData').attr('dispto', disp);
                    $('#shipToCons').removeClass('hidden');
                    $('#consignee_dtl').addClass('hidden');
                    $('#billToSACS').removeClass('hidden');
                    $('#shipToCons').removeClass('hidden');
                    $('#dispatchErrMsg').show();
                    $('#dispatchErrMsg').html(alertMess(data.message, data.status));
                    $('#dispatchErrMsg').fadeOut(3000);
                    $('.prod_action').removeClass('hidden');
                } else {
                    $('#dispatchErrMsg').show();
                    $('#dispatchErrMsg').html(alertMess(data.message, data.status));
                    $('#sacs_data').val('');
                    $('#facs_data').val('');
                }
            }
        });
        return false;
    } else if (disp == 'FAC' && facs != '') {
        $.ajax({
            type: "POST",
            url: post_url,
            data: {
                'csrf_imsnaco': get_csrf_cookie(),
                'type': disp,
                'loc_id': facs,
                'noa': noa
            },
            dataType: "json",
            cache: false,
            success: function(data) {
                if (data.status == 'success') {
                    var jsonConsign = [];
                    var jsonArr = {};
                    jsonArr['type'] = 'BILL';
                    jsonArr['is_ship'] = 'NO';
                    jsonArr['loc_type'] = 'SACS';
                    jsonArr['loc_id'] = data.result.billto_id;
                    jsonConsign.push(jsonArr);
                    jsonArr['type'] = 'SHIP';
                    jsonArr['is_ship'] = 'YES';
                    jsonArr['loc_type'] = 'FACS';
                    jsonArr['loc_id'] = facs;
                    jsonConsign.push(jsonArr);
                    $('#d_consignee').val(JSON.stringify(jsonConsign));
                    $('#billToName').html(data.result.billName);
                    $('#billToAdd').html(data.result.billto);
                    $('#shipToName').html(data.result.shipName);
                    $('#shipToAdd').html(data.result.shipto);
                    $('#dtl_billToName').html(data.result.billName);
                    $('#dtl_billToAdd').html(data.result.billto);
                    $('#dtl_shipToName').html(data.result.shipName);
                    $('#dtl_shipToAdd').html(data.result.shipto);
                    $('#consigneeData').attr('locid', facs);
                    $('#consigneeData').attr('dispto', disp);
                    $('#shipToCons').removeClass('hidden');
                    $('#consignee_dtl').addClass('hidden');
                    $('#billToSACS').removeClass('hidden');
                    $('#shipToCons').removeClass('hidden');
                    $('.prod_action').removeClass('hidden');
                    $('#dispatchErrMsg').show();
                    $('#dispatchErrMsg').html(alertMess(data.message, data.status));
                    $('#dispatchErrMsg').fadeOut(3000);

                } else {
                    $('#dispatchErrMsg').show();
                    $('#dispatchErrMsg').html(alertMess(data.message, data.status));
                    $('#sacs_data').val('');
                    $('#facs_data').val('');
                }
            }
        });
        return false;
    } else {
        $('#dispatchErrMsg').removeClass('hidden');
        $('#dispatchErrMsg').html(alertMess('You should select one of the consignee from the dropdown.', 'warning'));
    }
}
function addProdLot(prod, post_url) {
    var disp = $('#consigneeData').attr('dispto');
    var noa = $('#noaData').attr('noaid');
    var lot = $('#lot_data_' + prod).val();
    var prods = getProds();
    var jsonProd = [];
    var jsonArr = {};
    $.each(prods, function(k, v) {
        jsonArr['pid'] = v.product_id;
        jsonProd.push(jsonArr);
        jsonArr = {};
    });
    prods = JSON.stringify(jsonProd);
    if (lot != '') {
        if (disp == 'SACS') {
            var sacs = $('#consigneeData').attr('locid');
            $.ajax({
                type: "POST",
                url: post_url,
                data: {
                    'csrf_imsnaco': get_csrf_cookie(),
                    'type': disp,
                    'loc_id': sacs,
                    'lot_id': lot,
                    'noa': noa,
                    'prods': prods
                },
                dataType: "json",
                cache: false,
                success: function(data) {
                    if (data.status == 'success') {
                        $.each(data.result, function(k, v) {
                            $('#lotNo_' + v.pro_id).html(v.lot_dtl.lotno);
                            $('#pendQty_' + v.pro_id).html(v.lot_dtl.qty);
                            $('#shipToCons_' + v.pro_id).removeClass('hidden');
                            $('#prod_detail_' + v.pro_id).removeClass('hidden');
                            $('#prod_batch_box_' + v.pro_id).removeClass('hidden');
                            $('#lot_dtl_' + v.pro_id).addClass('hidden');
                            $('#lotErrMsg_' + v.pro_id).show();
                            $('#lotErrMsg_' + v.pro_id).html(alertMess(data.message, data.status));
                            $('#lotErrMsg_' + v.pro_id).fadeOut(3000);
                            $('#consigneeData').attr('lotno', v.lot_dtl.lot);
                            $('#consigneeData').attr('lot', v.lot_dtl.lotno);
                            $('#d_lot_no').val(v.lot_dtl.lot);
                        });
                        $('#proceedDisp').removeClass('hidden');
                    } else {
                        $('#lotErrMsg_' + prod).show();
                        $('#lotErrMsg_' + prod).html(alertMess(data.message, data.status));
                        $('#lot_data_' + prod).val('');
                    }
                }
            });
            return false;
        } else if (disp == 'FAC') {
            var facs = $('#consigneeData').attr('locid');
            $.ajax({
                type: "POST",
                url: post_url,
                data: {
                    'csrf_imsnaco': get_csrf_cookie(),
                    'type': disp,
                    'loc_id': facs,
                    'lot_id': lot,
                    'noa': noa,
                    'prods': prods
                },
                dataType: "json",
                cache: false,
                success: function(data) {
                    if (data.status == 'success') {
                        $.each(data.result, function(k, v) {
                            $('#lotNo_' + v.pro_id).html(v.lot_dtl.lotno);
                            $('#pendQty_' + v.pro_id).html(v.lot_dtl.qty);
                            $('#shipToCons_' + v.pro_id).removeClass('hidden');
                            $('#prod_detail_' + v.pro_id).removeClass('hidden');
                            $('#prod_batch_box_' + v.pro_id).removeClass('hidden');
                            $('#lot_dtl_' + v.pro_id).addClass('hidden');
                            $('#lotErrMsg_' + v.pro_id).show();
                            $('#lotErrMsg_' + v.pro_id).html(alertMess(data.message, data.status));
                            $('#lotErrMsg_' + v.pro_id).fadeOut(3000);
                            $('#consigneeData').attr('lotno', v.lot_dtl.lot);
                            $('#consigneeData').attr('lot', v.lot_dtl.lotno);
                            $('#d_lot_no').val(v.lot_dtl.lot);
                        });
                        $('#proceedDisp').removeClass('hidden');
                    } else {
                        $('#lotErrMsg_' + prod).show();
                        $('#lotErrMsg_' + prod).html(alertMess(data.message, data.status));
                        $('#lot_data_' + prod).val('');
                    }
                }
            });
            return false;
        }
    } else {
        $('#lotErrMsg_' + prod).removeClass('hidden');
        $('#lotErrMsg_' + prod).html(alertMess('Lot Selection is must to proceed further.', 'warning'));
    }
}
function changeProdConsignee() {
    $('#billToSACS').addClass('hidden');
    $('#shipToCons').addClass('hidden');
    $('#consignee_dtl').removeClass('hidden');
}
function changeProdLot(prod) {
    $('#prod_batch_box_' + prod).addClass('hidden');
    $('#prod_detail_' + prod).addClass('hidden');
    $('#lot_dtl_' + prod).removeClass('hidden');
}
function selectGtin(prod) {
    var ele = $('#gtin_detail_' + prod);
    showPopBox(ele);
}
function addGtin(gid, gno, prod) {
    var prodJson = $.parseJSON($('#d_prods').val());
    $.each(prodJson, function(k, p) {
        if (p.pid == prod) {
            prodJson[k].gtin = gid;
            return false;
        }
    });
    $('#d_prods').val(JSON.stringify(prodJson));
    var jsonGtin = {};
    jsonGtin['gid'] = gid;
    jsonGtin['num'] = gno;
    var currGtin = $('#gtin_id_' + prod).val();
    $('#selectGtin_' + prod).removeClass('hidden');
    $('#gtin_' + prod).html(gno);
    $('#gtin_id_' + prod).val(gid);
    $('#gt' + prod + 'select_' + gid).addClass('hidden');
    $('#prodDetail_' + prod).attr('gtin', JSON.stringify(jsonGtin));
    if (currGtin != '') {
        $('#gt' + prod + 'select_' + currGtin).removeClass('hidden');
    }
    $('.popBox').hide();
    $('#overlay').hide();
}
function selectPNorm(prod) {
    var ele = $('#pnorm_detail_' + prod);
    showPopBox(ele);
}
function addPnorm(pid, pnm, prod) {
    var prodJson = $.parseJSON($('#d_prods').val());
    $.each(prodJson, function(k, p) {
        if (p.pid == prod) {
            prodJson[k].pnorm = pid;
            return false;
        }
    });
    $('#d_prods').val(JSON.stringify(prodJson));
    var jsonPnorm = {};
    jsonPnorm['pid'] = pid;
    jsonPnorm['name'] = pnm;
    var currPnorm = $('#pnorm_id_' + prod).val();
    $('#selectPNorm_' + prod).removeClass('hidden');
    $('#pnorm_' + prod).html(pnm);
    $('#pnorm_id_' + prod).val(pid);
    $('#pn' + prod + 'select_' + pid).addClass('hidden');
    $('#prodDetail_' + prod).attr('norm', JSON.stringify(jsonPnorm));
    if (currPnorm != '') {
        $('#pn' + prod + 'select_' + currPnorm).removeClass('hidden');
    }
    $('.popBox').hide();
    $('#overlay').hide();
}
function selectBatch(prod) {
    var ele = $('#batch_detail_' + prod);
    showPopBox(ele);
}
function activeRemoveBatch() {
    $(".remove-batch").click(function(e) {
        e.preventDefault();
        var prod = $(this).attr('prod');
        var pEl = $(this).parent().parent();
        var batch_id = pEl.find('.batch_id_' + prod).val();
        pEl.remove();
        $('#bt' + prod + 'select_' + batch_id).removeClass('hidden');
        setTotal(prod);
    });
}
function addBatch(bid, bno, md, ed, prod) {
    var trow = '<tr class="batchRow_' + prod + '"><input class="batch_id_' + prod + '" name="batch[' + prod + '][]" type="hidden" value="' + bid + '" /><td class="bt_no">' + bno + '</td><td class="bt_md">' + md + '</td><td class="bt_ed">' + ed + '</td><td><input type="text" name="batchQty[' + prod + '][]" class="form-control batchQty" valid="int" prod="' + prod + '" value="" /></td><td><a href="javascript:void(0)" class="remove-batch text-danger" prod="' + prod + '"><i class="fa fa-remove fa-2x"></i></a></td></tr>';
    $('#batchTab_' + prod).append(trow);
    $('#bt' + prod + 'select_' + bid).addClass('hidden');
    $('.popBox').hide();
    $('#overlay').hide();
    activeRemoveBatch();
    batchProdQty();
    initUtilFunctions();
}
function batchProdQty() {
    $('.batchQty').on("keyup paste", function() {
        prod = $(this).attr('prod');
        setTimeout(function() {
            setTotal(prod);
        }, 100); //Paste event doesn't work without setTimeout
    });
}
function setTotal(prod) {
    qty_error = false;
    qty = 0;
    var currQty = $('#pendQty_' + prod).html();
    $(".batchRow_" + prod).each(function() {
        ob = $(this);
        qty = qty + getNumValue(ob.find('input.batchQty').val())
    });
    $('#totProdQty_' + prod).html(qty);
    if (currQty >= qty) {
        $('#totProdQty_' + prod).removeClass('danger').addClass('success');
    } else {
        $('#totProdQty_' + prod).removeClass('success').addClass('danger');
    }
}

function showPopBox(ele) {
    var boxheight = ele.innerHeight();
    var boxwidth = ele.innerWidth();
    var winHeight = $(window).height();
    var winWidth = $(window).width();
    var topOffset = (winHeight - boxheight) / 2;
    var leftOffset = (winWidth - boxwidth) / 2;
    ele.css({"top": topOffset + "px", "left": leftOffset + "px", 'width': boxwidth + "px"});
    ele.show();
    $('#overlay').show();

}

function batchValidate(pd) {
    var error = false;
    if ($('#x_date' + pd).val() == '' || $('#m_date' + pd).val() == '' || batchNoValid(pd)) {
        error = true;
    }
    return !error;
}

function batchNoValid(pd) {
    var batch_err=true;
    var batch_no = $('#batch_no' + pd).val();
    var allowed = /^[a-zA-Z0-9]+$/;
    if (batch_no && allowed.test(batch_no)) {
        batch_err = false;
    }
    return batch_err;
}

function alertMess(mess, type) {
    var output;
    switch (type) {
        case 'warning':
            output = '<div class="alert alert-warning"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>Warning!</strong> ' + mess + '</div>';
            break;
        case 'error':
            output = '<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>Error!</strong> ' + mess + '</div>';
            break;
        case 'success':
            output = '<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>Success!</strong> ' + mess + '</div>';
            break;
    }
    return output;
}

function dateSelections() {
    $("#invoice_date").datepicker({
        dateFormat: "dd M yy",
        maxDate: 0,
        onSelect: function(date) {
            $('#dispatch_date').datepicker('option', 'minDate', date);
            $('#delivery_date').datepicker('option', 'minDate', date);
        }
    });
    $('#dispatch_date').datepicker({
        dateFormat: "dd M yy",
        minDate: '-7D',
        onSelect: function(date) {
            $('#delivery_date').datepicker('option', 'minDate', date);
        }
    });
    $('#delivery_date').datepicker({
        dateFormat: "dd M yy",
        minDate: '-7D'
    });
}
function getJsonKey(obj, key, val) {
    var out = 0;
    var key = 0;
    $.each(obj, function(k, v) {
        if (v.pid == val) {
            key = out;
        }
        out++;
    });
    return key;
}

