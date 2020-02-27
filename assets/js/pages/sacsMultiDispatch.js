$(document).ready(function () {
    $('#district_data').change(function () {
        var sacs = $('#consigneeData').attr('sacsid');
        var dist = $(this).val();
        var ftype = $('#ftype_data').val();
        var prod = $('#prod_data').val();
        if (sacs != '' && sacs != 0) {
            $.ajax({
                type: "POST",
                url: SITE_URL + 'common/getFacsList',
                data: {
                    'csrf_imsnaco': get_csrf_cookie(),
                    'district': dist,
                    'pd_id': prod,
                    'ftype': ftype,
                    'location_id': sacs
                },
                dataType: "json",
                cache: false,
                success: function (data) {
                    $('#facs_data').empty();
                    $('#facs_data').append(new Option('Select Facility', ''));
                    $.each(data.facs, function (index, value) {
                        $('#facs_data').append(new Option(value, index));
                    });
                    removeCurrentFacs();
                }
            });
        }
    });
    $('#ftype_data').change(function () {
        var sacs = $('#consigneeData').attr('sacsid');
        var dist = $('#district_data').val();
        var ftype = $(this).val();
        if (sacs != '' && sacs != 0) {
            $.ajax({
                type: "POST",
                url: SITE_URL + 'common/getFacsList',
                data: {
                    'csrf_imsnaco': get_csrf_cookie(),
                    'district': dist,
                    'ftype': ftype,
                    'location_id': sacs
                },
                dataType: "json",
                cache: false,
                success: function (data) {
                    $('#facs_data').empty();
                    $('#facs_data').append(new Option('Select Facility', ''));
                    $.each(data.facs, function (index, value) {
                        $('#facs_data').append(new Option(value, index));
                    });
                    removeCurrentFacs();
                }
            });
        }
    });
    $('.updateDisp').click(function () {
        $('#dtl_prodDisp').addClass('hidden');
        $('#dispProcess').removeClass('hidden');
        $('#proceedDisp').removeClass('hidden');
        $('#addmore').removeClass('hidden');
        $('#goBackBtn').removeClass('hidden');
        $('#completeProcess').addClass('hidden');
        $('#updateDispBtn').addClass('hidden');
    });
    $('#completeDisp').one("click", function () {
        $(this).addClass('disabled');
        $("#invoiceForm").submit();
    });
    $('#invoiceForm').validator().on('submit', function (e) {
        if (e.isDefaultPrevented()) {
            $('#invoiceErrMess').show();
            $('#invoiceErrMess').html(alertMess('Please check the errors below.', 'error'));
            $('#invoiceErrMess').fadeOut(4000);
            $('#completeDisp').removeClass('disabled');
        } else {
            var d_type = $('#d_type').val();
            var indentdate = $('#indent_date').val();
            var disDate = $('#dispatch_date').val();
            var delDate = $('#delivery_date').val();
            var trasName = $('#trans_name').val();
            var drivMob = $('#driver_mob').val();
            var awbNo = $('#driver_name').val();
            var remarks = $('#remarks').val();
            var d_consignee = $('#d_consignee').val();
            var d_prods = $('#d_prods').val();
            var d_postURL = $('#d_postURL').val();
            $.ajax({
                type: "POST",
                url: d_postURL,
                data: {
                    'csrf_imsnaco': get_csrf_cookie(),
                    'd_type': d_type,
                    'indent_date': indentdate,
                    'dispatch_date': disDate,
                    'delivery_date': delDate,
                    'trans_name': trasName,
                    'driver_mob': drivMob,
                    'awb_no': awbNo,
                    'remarks': remarks,
                    'd_consignee': d_consignee,
                    'd_prods': d_prods
                },
                dataType: "json",
                cache: false,
                success: function (data) {
                    if (data.status == 'warning') {
                        $('#invoiceErrMess').show();
                        $('#invoiceErrMess').html(alertMess(data.message, data.status));
                        $('#completeDisp').removeClass('disabled');
                    } else if (data.status == 'error') {
                        $('#invoiceErrMess').html('');
                        $('#invoiceErrMess').show();
                        $.each(data.message, function (k, v) {
                            $('#invoiceErrMess').append(alertMess(v, data.status));
                        });
                        $('#completeDisp').removeClass('disabled');
                    } else {
                        window.location.replace(data.rUrl);
                    }
                }
            });
            return false;
        }
    })

//Global Action
    dateSelections();
});

function addFacilityDisp(loc_type='FAC') {
    if(loc_type=='RWH'){
        var locID = $('#rwhs_data').val();
    }else{
        var locID = $('#facs_data').val();
    }
    var post_url = SITE_URL + 'dispatch/' + (loc_type=='FAC'? 'selectFacConsignee':'selectRWHConsignee');
    var facs = $('#facs_data').val();
    if (facs != '' && facs != 0) {
        $.ajax({
            type: "POST",
            url: post_url,
            data: {
                'csrf_imsnaco': get_csrf_cookie(),
                'loc_id': locID
            },
            dataType: "json",
            cache: false,
            success: function (data) {
                if (data.status == 'success') {
                    addConsignee(locID, data.result.shipName,loc_type);
                    $('#facs_detail_box').prepend(addConsigeeDetailBox(locID, data.result.shipName,loc_type));
                    $('#consDetails').append(addLocDetail(locID, data.result.shipName));
                    if(loc_type=='RWH'){
                        $('#rwhs_data').find('option[value="' + locID + '"]').hide();
                        $('#rwhs_data').val('');
                    }else{
                        $('#facs_data').find('option[value="' + locID + '"]').hide();
                        $('#facs_data').val('');
                    }
                    $('#proceedDisp').removeClass('hidden');
                    $('#arrowBounce').hide();
                    $('.fixedButn').show();
                } else {
                    $('#dispatchErrMsg').show();
                    $('#dispatchErrMsg').html(alertMess(data.message, data.status));
                    if(loc_type=='RWH'){
                        $('#rwhs_data').val('');
                    }else{
                        $('#facs_data').val('');
                    }
                 }
            }
        });

    } else {
        $('#dispatchErrMsg').removeClass('hidden');
        $('#dispatchErrMsg').html(alertMess('You should select one of the Consignee from the dropdown.', 'warning'));
    }
}

function removeCurrentFacs() {
    var facsData = $('#d_consignee').val();
    var jsonFacs = [];
    if (facsData != '') {
        jsonFacs = $.parseJSON(facsData);
    }
    $.each(jsonFacs, function (k, v) {
        $('#facs_data').find('option[value="' + v.loc_id + '"]').hide();
    });
}

function removeCurrentRwh() {
    var facsData = $('#d_consignee').val();
    var jsonFacs = [];
    if (facsData != '') {
        jsonFacs = $.parseJSON(facsData);
    }
    $.each(jsonFacs, function (k, v) {
        $('#rwhs_data').find('option[value="' + v.loc_id + '"]').hide();
    });
}

function addConsignee(locID, loc_name, loc_type) {
    $('#consigneeData').attr('cdata', addConsigJson(locID, loc_name, loc_type));
    $('#d_consignee').val(addConsigJson(locID, loc_name, loc_type));
    $('#proceedDisp').unbind('click');
    proceedToDispatch();
}

function delLocDetail(locID, loc_type) {
    $('#facsDetail_' + locID).remove();
    $('#consigneeData').attr('cdata', delLocJson(locID));
    $('#d_consignee').val(delLocJson(locID));
    if(loc_type=='RWH'){
        $('#rwhs_data').find('option[value="' + locID + '"]').show();
    }else{
        $('#facs_data').find('option[value="' + locID + '"]').show();
    }
}

function addConsigJson(locID, loc_name, loc_type) {
    var sacs = $('#consigneeData').attr('myloc');
    var facsData = $('#d_consignee').val();
    var jsonFacs = [];
    var jsonArr = {};
    if (facsData != '') {
        jsonFacs = $.parseJSON(facsData);
    }
    jsonArr['type'] = loc_type;
    jsonArr['sacs_loc_id'] = sacs;
    jsonArr['loc_id'] = locID;
    jsonArr['loc_name'] = loc_name;
    jsonArr['source_id'] = 0;
    jsonArr['qty'] = '';
    jsonArr['box'] = '';
    jsonArr['batch_dtl'] = '';
    jsonFacs.push(jsonArr);
    return JSON.stringify(jsonFacs);
}

function delLocJson(facs) {
    var facsData = $('#d_consignee').val();
    var jsonFacs = [];
    if (facsData != '') {
        jsonFacs = $.parseJSON(facsData);
    }
    $.each(jsonFacs, function (k, v) {
        if (v.loc_id == facs) {
            jsonFacs.splice(k, 1);
            return false;
        }
    });
    return JSON.stringify(jsonFacs);
}

function batchHandleAction() {
    $('.closePopUp').click(function () {
        $('.popBox').hide();
        $('#overlay').hide();
    });
}

//Add Product Details
function addDispProduct(post_url) {
    var prod = $('#prod_data').val();
    var sacs = $('#consigneeData').attr('myloc');
    var type = $('#consigneeData').attr('loc_type');
    if (prod != '') {
        $.ajax({
            type: "POST",
            url: post_url,
            data: {
                'csrf_imsnaco': get_csrf_cookie(),
                'pd_id': prod,
                'type': type,
                'loc': sacs
            },
            dataType: "json",
            cache: false,
            success: function (data) {
                if (data.status == 'success') {
                    $('#prodBatch').append(addProductBatchBox(data.result.batch));
                    $('#prod_name_tab').html(data.result.product.prod_name);
                    $('#prod_qty').html(data.result.product.toatl_qty);
                    $('#dtl_prodName').html(data.result.product.prod_name);
                    $('#prodData').attr('prods', prod);
                    $('#prodData').attr('ftype', data.result.ftype);
                    $('#d_prods').val(prod);
                    batchHandleAction();
                    $(this).find('option[value="' + prod + '"]').hide();
                    $('#consignee_dtl').removeClass('hidden');
                    $('#prodSchedData').removeClass('hidden');
                    $('#prodSelection').addClass('hidden');
                    listFtypesAndFacility(data.result.ftype);
                } else {
                    $('#prodErrMsg').removeClass('hidden');
                    $('#prodErrMsg').html(alertMess(data.message, data.status));
                }
            }
        });
    }

}

function listFtypesAndFacility(ftypes) {
    var sacs = $('#consigneeData').attr('myloc');
    var dist = $('#district_data').val();
    if (ftypes != '' || ftypes != 0) {
        $.ajax({
            type: "POST",
            url: SITE_URL + 'common/getFacsList',
            data: {
                'csrf_imsnaco': get_csrf_cookie(),
                'district': dist,
                'ftype': ftypes,
                'location_id': sacs
            },
            dataType: "json",
            cache: false,
            success: function (data) {
                $('#ftype_data').empty();
                $('#ftype_data').append(new Option('Select Facility Type', ''));
                $.each(data.ftype, function (index, value) {
                    $('#ftype_data').append(new Option(value, index));
                });
                $('#facs_data').empty();
                $('#facs_data').append(new Option('Select Facility', ''));
                $.each(data.facs, function (index, value) {
                    $('#facs_data').append(new Option(value, index));
                });
                removeCurrentFacs();
            }
        });
    }
}

function changeProdSchedule() {
    $('#consignee_dtl').addClass('hidden');
    $('#prodSelection').removeClass('hidden');
    $('#prodSchedData').addClass('hidden');
    $('#facs_detail_box').html('');
    $('#prodBatch').html('');
    $('#prodData').attr('prods', '');
    $('#prod_data').find('option').show();
    $('#facs_data').find('option').show();
    $('#d_prods').val('');
    $('#proceedDisp').addClass('hidden');

}

function addConsigeeDetailBox(locID, locName, loc_type) {
    var loc_name = loc_type=='RWH'?'Regional Warehouse':'Facility';
    var panel = myPanel($('.faclisting').length);
    var ele = '';
    ele += '<div class="panel panel-' + panel + ' faclisting" id="facsDetail_' + locID + '">';
    ele += '<div class="panel-heading"><h3 class="panel-title bold">' + locName + '<a href="javascript:void(0)" onclick="delLocDetail(\'' + locID + '\',\''+ loc_type + '\')" class="pull-right"><span class="label label-danger">Delete '+ loc_name +'</span></a></h3></div>';
    ele += '<div class="panel-body"><div id="pBatchMess_' + locID + '" style="display:none;"></div><p class="text-right"><a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="selectBatch(\'' + locID + '\')">Select Batch</a></p></div>';
    ele += '<table class="table" id="batchTab_' + locID + '">';
    ele += '<thead><tr><th>Batch No</th><th>Manufacturing Date</th><th>Expiry Date</th><th>Current Stock</th><th>Available</th><th>Dispatch Qty</th><th>Number of Boxes</th><th>Action</th></tr></thead>';
    ele += '<tbody></tbody>';
    ele += '<tfoot><tr><td colspan="5" class="text-right">Total</td><td class="bold" id="totProdQty_' + locID + '">0</td><td class="bold" id="totProdBox_' + locID + '">0</td><td></td></tr></tfoot>';
    ele += '</table>';
    ele += '</div>';
    return ele;
}

function addProductBatchBox(batches) {
    var ele = '';
    ele += '<div class="popBox" id="batch_detail" currFacs="">';
    ele += '<a href="javascript:void(0)" class="closePopUp"><i class="fa fa-times-circle fa-2x"></i></a>';
    ele += '<div class="panel panel-primary"><div class="panel-heading"><h3 class="panel-title bold">Product Batches List</h3></div>';
    ele += '<div class="panel-body"><div id="batchErrorMess" style="display:none;"></div>';
    ele += '<div class="table-responsive">';
    ele += '<table class="table batchTable" id="batchbox">';
    ele += '<thead><tr class="vmid active"><th class="tdw200">Batch Number</th><th class="tdw200">Manufacturing Date</th><th class="tdw200">Expiry Date</th><th class="tdw200">Quantity</th><th class="tdw150">Action</th></tr></thead>';
    ele += '<tfoot>' + batches + '</tfoot></table>';
    ele += '</div></div></div>';
    return ele;
}

function addLocDetail(locID, locName) {
    var ele = '';
    ele += '<span id="facsDetail_' + locID + '" facsId="' + locID + '" fname="' + locName + '" fData=""></span>';
    return ele;
}

function selectBatch(facs) {
    var ele = $('#batch_detail');
    showPopBox(ele);
    $('.batchBtn').removeClass('hidden');
    ele.attr('currFacs', facs);
    if ($('.batchRow_' + facs).length > 0) {
        $('.batchRow_' + facs).each(function () {
            var batch = $(this).find('.batch_id').val();
            $('#btselect_' + batch).addClass('hidden');
        });
    }
}

function addBatch(prod, invid, bid, bno, md, ed, qty) {
    var facs = $('#batch_detail').attr('currFacs');
    var batqty = batchQty(bid);
    var availQty = getNumValue(qty) - batqty;
    var trow = '<tr class="batchRow_' + facs + '"><input class="invent_id" name="batch[' + prod + '][]" type="hidden" value="' + invid + '" /><input class="batch_id" name="batch[' + prod + '][]" type="hidden" value="' + bid + '" /><input class="batch_qty" name="batch[' + prod + '][]" type="hidden" value="' + qty + '" /><td class="bt_no">' + bno + '</td><td class="bt_md">' + md + '</td><td class="bt_ed">' + ed + '</td><td class="bt_qty">' + qty + '</td><td class="avail_qty_' + bid + ' text-muted bold">' + availQty + '</td><td><input type="text" name="batchQty[' + prod + '][]" class="form-control batchQty qty_' + bid + '" valid="int" facs="' + facs + '" prod="' + prod + '" value="" /></td>' +
        '<td><input type="text" name="batchBox[' + prod + '][]" class="form-control batchBox box_' + bid + '" valid="int" facs="' + facs + '" prod="' + prod + '" value="" /></td>' +
        '<td><a href="javascript:void(0)" class="remove-batch text-danger" facs="' + facs + '" prod="' + prod + '"><i class="fa fa-remove fa-2x"></i></a></td></tr>';
    $('#batchTab_' + facs).append(trow);
    $('.batchBtn').removeClass('hidden');
    $('.popBox').hide();
    $('#overlay').hide();
    activeRemoveBatch();
    batchProdQty();
    initUtilFunctions();
}

function batchProdQty() {
    $('.batchQty, .batchBox').on("keyup paste", function () {
        var prod = $(this).attr('prod');
        var facs = $(this).attr('facs');
        var qty = getNumValue($(this).val());
        var pEl = $(this).parent().parent();
        var currQty = getNumValue(pEl.find('.batch_qty').val());
        var batch = pEl.find('.batch_id').val();
        var batqty = batchQty(batch);
        var elseQty = batqty - qty;
        var rQty = currQty - elseQty;
        if (qty >= rQty) {
            $(this).val(rQty);
            $('.avail_qty_' + batch).html(0);
        } else {
            $('.avail_qty_' + batch).html(currQty - batqty);
        }
        setTimeout(function () {
            setTotal(facs);
        }, 100); //Paste event doesn't work without setTimeout
    });
}

function batchQty(bt) {
    bt_error = false;
    var btQt = 0;
    $(".qty_" + bt).each(function () {
        btQt = btQt + getNumValue($(this).val());
    });
    return btQt;
}

function setTotal(facs) {
    qty_error = false;
    qty = 0;
    box = 0;
    $(".batchRow_" + facs).each(function () {
        ob = $(this);
        qty = qty + getNumValue(ob.find('input.batchQty').val());
        box = box + getNumValue(ob.find('input.batchBox').val());
    });
    $('#totProdQty_' + facs).html(qty);
    $('#totProdBox_' + facs).html(box);
}

function proceedToDispatch() {
    $('#proceedDisp').on('click', function () {
        var facsData = $('#consigneeData').attr('cdata');
        var jsonfacs = [];
        var validDispatch = false;
        if (facsData != '') {
            jsonfacs = $.parseJSON(facsData);
            $('#dtl_prods>.panel>.panel-body').html('');
            $.each(jsonfacs, function (k, v) {
                if (validBatchDetail(v.loc_id)) {
                    makeProductTab(v.loc_id);
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
            $('#addmore').addClass('hidden');
            $('#goBackBtn').addClass('hidden');
            $('#completeProcess').removeClass('hidden');
            $('#updateDispBtn').removeClass('hidden');
        }
    });
}

function addProduct(prod) {
    $('#prodData').attr('prods', addProdJson(prod));
    $('#d_prods').val(addProdJson(prod));
    $('#proceedDisp').unbind('click');
    proceedToDispatch();
}

function delProdDetail(prod) {
    $('#prodDetail_' + prod).remove();
    $('#prodData').attr('prods', delProdJson(prod));
    $('#d_prods').val(delProdJson(prod));
    $('#prod_batch_box_' + prod).remove();
    $('#batch_detail_' + prod).remove();
    $('#product_data').find('option[value="' + prod + '"]').show();
}

function addProdJson(prod) {
    var prodData = $('#d_prods').val();
    var jsonProd = [];
    var jsonArr = {};
    if (prodData != '') {
        jsonProd = $.parseJSON(prodData);
    }
    jsonArr['pid'] = prod;
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
    $.each(jsonProd, function (k, v) {
        if (v.pid == prod) {
            jsonProd.splice(k, 1);
            return false;
        }
    });
    return JSON.stringify(jsonProd);
}

function validBatchDetail(pd) {
    if ($('tr.batchRow_' + pd).length == 0) {
        $('#pBatchMess_' + pd).html(alertMess('Please Add Batch Details', 'error'));
        $('#pBatchMess_' + pd).show(1000).fadeOut(6000);
        return false;
    } else {
        var jsonDet = [];
        var validBatchHandle = true;
        $('tr.batchRow_' + pd).each(function () {
            var detailArr = {};
            if (isBatchEmpty($(this), pd)) {
                detailArr['invent_id'] = $(this).find('input.invent_id').val();
                detailArr['batch_id'] = $(this).find('input.batch_id').val();
                detailArr['batch_no'] = $(this).find('td.bt_no').html();
                detailArr['batch_md'] = $(this).find('td.bt_md').html();
                detailArr['batch_ed'] = $(this).find('td.bt_ed').html();
                detailArr['batch_qty'] = $(this).find('input.batchQty').val();
                detailArr['batch_box'] = $(this).find('input.batchBox').val();
                jsonDet.push(detailArr);
            } else {
                validBatchHandle = false;
                return false;
            }
        });
        $('#facsDetail_' + pd).attr('fData', JSON.stringify(jsonDet));
        return validBatchHandle;
    }
}

function makeProductTab(pd) {
    var facsJson = $.parseJSON($('#d_consignee').val());
    var pname = $('#facsDetail_' + pd).attr('fname');
    var prodDet = $.parseJSON($('#facsDetail_' + pd).attr('fData'));
    var total = 0;
    var total_box = 0;
    var batch_dtl = [];
    var ele = '';
    ele = '<div class="panel panel-info">';
    ele += '<div class="panel-heading"><h3 class="panel-title bold">' + pname + '</h3></div>';
    ele += '<table class="table"><tbody><tr>';
    ele += '<th>Batch No.</th>';
    ele += '<th>Manufacturing Date</th>';
    ele += '<th>Expiry Date</th>';
    ele += '<th>Quantity</th>';
    ele += '<th>Number of Boxes</th>';
    $.each(prodDet, function (k, v) {
        var batchArr = {};
        batchArr['invent_id'] = v.invent_id;
        batchArr['batch_id'] = v.batch_id;
        batchArr['exp_qty'] = v.batch_qty;
        batchArr['exp_box'] = v.batch_box;
        batch_dtl.push(batchArr);
        total = total + getNumValue(v.batch_qty);
        total_box = total_box + getNumValue(v.batch_box);
        ele += '<tr>';
        ele += '<td>' + v.batch_no + '</td>';
        ele += '<td>' + v.batch_md + '</td>';
        ele += '<td>' + v.batch_ed + '</td>';
        ele += '<td>' + v.batch_qty + '</td>';
        ele += '<td>' + v.batch_box + '</td>';
        ele += '</tr>';
    });
    ele += '</tr></tbody>';
    ele += '<tfoot><tr class="warning"><td colspan="2">&nbsp;</td><td>Total</td><td class="bold">' + total + '</td><td class="bold">' + total_box + '</td></tr></tfoot>';
    ele += '</table></div>';

    $.each(facsJson, function (k, p) {
        if (p.loc_id == pd) {
            facsJson[k].batch_dtl = batch_dtl;
            facsJson[k].qty = total;
            facsJson[k].box = total_box;
            return false;
        }
    });
    $('#d_consignee').val(JSON.stringify(facsJson));
    $('#dtl_prods>.panel>.panel-body').append(ele);
}

function isBatchEmpty(ele, pd) {
    if (ele.find('input.batchQty').val() == '' || ele.find('input.batchQty').val() == 0) {
        $('#pBatchMess_' + pd).html(alertMess(' Please fill valid batch quantity', 'error'));
        $('#pBatchMess_' + pd).show(1000).fadeOut(6000);
        return false;
    }
    else if (ele.find('input.batchBox').val() == '') {
        $('#pBatchMess_' + pd).html(alertMess(' Please fill valid box quantity', 'error'));
        $('#pBatchMess_' + pd).show(1000).fadeOut(6000);
        return false;
    }
    return true;
}

// Global Functions
function activeRemoveBatch() {
    $(".remove-batch").click(function (e) {
        e.preventDefault();
        var prod = $(this).attr('prod');
        var facs = $(this).attr('facs');
        var pEl = $(this).parent().parent();
        var currQty = getNumValue(pEl.find('.batch_qty').val());
        var qty = getNumValue(pEl.find('.batchQty').val());
        var batch = pEl.find('.batch_id').val();
        var batqty = batchQty(batch);
        var availQty = (currQty - batqty) + qty;
        $('.avail_qty_' + batch).html(availQty);
        pEl.remove();
        setTotal(facs);
    });
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
    $("#indent_date").datepicker({
        dateFormat: "dd M yy",
        maxDate: 0,
        onSelect: function (date) {
            $('#dispatch_date').datepicker('option', 'minDate', date);
            $('#delivery_date').datepicker('option', 'minDate', date);
            $(this).change();
        }
    });
    $('#dispatch_date').datepicker({
        dateFormat: "dd M yy",
        minDate: '-7D',
        maxDate: '+7D',
        onSelect: function (date) {
            $('#delivery_date').datepicker('option', 'minDate', date);
            $(this).change();
        }
    });
    $('#delivery_date').datepicker({
        dateFormat: "dd M yy",
        minDate: '-7D'
    });
}

function myPanel(length) {
    var panel = 'primary';
    if (length) {
        var mod = length % 3;
        switch (mod) {
            case 0:
                panel = 'primary';
                break;
            case 1:
                panel = 'success';
                break;
            case 2:
                panel = 'info';
                break;
        }
    }
    return panel;
}

function addmoreProd() {
//    $('#arrowBounce').show();
    $(document).scrollTop('50px');
}