$(document).ready(function () {
    apply_select2($("#product_data"), 'Select Product');

    $('#sacs_data').change(function () {
        var sacs = $(this).val();
        var ftype = $('#ftype_data').val();
        /*$.ajax({
            type: "POST",
            url: SITE_URL + 'common/getFacsList',
            data: {
                'csrf_imsnaco': get_csrf_cookie(),
                'location_id': sacs,
                'ftype': ftype
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
        });*/
        $.ajax({
            type: "POST",
            url: SITE_URL + 'common/getDistrictList',
            data: {
                'csrf_imsnaco': get_csrf_cookie(),
                'location_id': sacs
            },
            dataType: "json",
            cache: false,
            success: function (data) {
                $('#district_data').empty();
                $('#district_data').append(new Option('Select District', ''));
                $.each(data.district, function (index, value) {
                    $('#district_data').append(new Option(value, index));
                });
            }
        });
        $.ajax({
            type: "POST",
            url: SITE_URL + 'common/getRWHlist',
            data: {
                'csrf_imsnaco': get_csrf_cookie(),
                'location_id': sacs
            },
            dataType: "json",
            cache: false,
            success: function (data) {
                $('#rwhs_data').empty();
                $('#rwhs_data').append(new Option('Select Warehouse', ''));
                $.each(data.rwhs, function (index, value) {
                    $('#rwhs_data').append(new Option(value, index));
                });
                removeCurrentRWHs();
            }
        });
    });
    $('#district_data_rwh').change(function () {
        if ($('#sacs_data').length > 0) {
            var sacs = $('#sacs_data').val();
        } else {
            var sacs = $('#consigneeData').attr('myloc');
        }
        var dist = $(this).val();
        if (sacs != '' && sacs != 0) {
            $.ajax({
                type: "POST",
                url: SITE_URL + 'common/getRWHlist',
                data: {
                    'csrf_imsnaco': get_csrf_cookie(),
                    'district': dist,
                    'pd_id': 0,
                    'location_id': sacs
                },
                dataType: "json",
                cache: false,
                success: function (data) {
                    $('#rwhs_data').empty();
                    $('#rwhs_data').append(new Option('Select Warehouse', ''));
                    $.each(data.rwhs, function (index, value) {
                        $('#rwhs_data').append(new Option(value, index));
                    });
                    removeCurrentRWHs();
                }
            });
        }
    });
    $('#district_data').change(function () {
        if ($('#sacs_data').length > 0) {
            var sacs = $('#sacs_data').val();
        } else {
            var sacs = $('#consigneeData').attr('sacsid');
        }
        var loc_type = $('#consigneeData').attr('dispto');
        var purl = loc_type=='FAC'? SITE_URL + 'common/getFacsList':SITE_URL + 'common/getRWHlist';
        var ftype = loc_type=='FAC'?$('#ftype_data').val():0;
        var ftypeF = $('#ftype_data').val();//Code added by Ashish Jain for I118
        var dist = $(this).val();
        //BOF code by Ashish Jain for I118
        $.ajax({
            type: "POST",
            url: SITE_URL + 'common/getFacsList',
            data: {
                'csrf_imsnaco': get_csrf_cookie(),
                'location_id': sacs,
                'district':dist,
                'ftype': ftypeF
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
        //EOF code by Ashish Jain for I118
        if (sacs != '' && sacs != 0) {
            $.ajax({
                type: "POST",
                url: purl,
                data: {
                    'csrf_imsnaco': get_csrf_cookie(),
                    'district': dist,
                    'pd_id': 0,
                    'ftype': ftype,
                    'location_id': sacs
                },
                dataType: "json",
                cache: false,
                success: function (data) {
                    if(loc_type=='FAC'){
                        $('#facs_data').empty();
                        $('#facs_data').append(new Option('Select Facility', ''));
                        $.each(data.facs, function (index, value) {
                            $('#facs_data').append(new Option(value, index));
                        });
                        removeCurrentFacs();
                    }else{
                        $('#rwhs_data').empty();
                        $('#rwhs_data').append(new Option('Select Warehouse', ''));
                        $.each(data.rwhs, function (index, value) {
                            $('#rwhs_data').append(new Option(value, index));
                        });
                        removeCurrentRWHs();
                    }
                }
            });
        }
    });
    $('#ftype_data').change(function () {
        if ($('#sacs_data').length > 0) {
            var sacs = $('#sacs_data').val();
        } else {
            var sacs = $('#consigneeData').attr('sacsid');
        }
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
    $('#completeDisp').on("click", function () {
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
    removeCurrentSacs();
    removeCurrentFacs();
    dateSelections();
    /** Source check **/
    var sources = eval($("#sources").attr('sdata'));
    if (sources) {
        $("#source_name").auto_list(sources);
    }
    $("#source_name").on('change', function () {
        ob = $(this);
        $(".sub-receiving").prop('disabled', true);
        $("#source_id, #address, #state_dd, #district_dd, #city, #pincode").val('').prop('disabled', false);
        $("#district_dd option").not(':first').remove();

        setTimeout(function () {
            var source_name = ob.val();
            $.ajax({
                url: SITE_URL + 'receive/unreg_source_detail',
                method: 'POST',
                data: {source_name: source_name, csrf_imsnaco: get_csrf_cookie()},
                dataType: 'JSON',
                success: function (res) {
                    $(".sub-receiving").prop('disabled', false);
                    if (res.length <= 0) {
                        return;
                    }
                    $("#source_id").val(parseInt(res.source_id));
                    $("#address").val(res.address);
                    $("#state_dd").val(res.state);
                    getDistricts(res.district_id);
                    $("#city").val(res.city);
                    $("#pincode").val(res.pincode);
                    $("#batches").val(JSON.stringify(res.batches));

                    $("#address, #state_dd, #district_dd, #city, #pincode").prop('disabled', true);
                }
            });

        }, 200);
    });
    $(".sub-receiving").click(function () {
        $("#sub_receiving_form").submit();
    });

});

function addProductDisp() {
    var prod = $('#product_data').val();
    var sacs = $('#consigneeData').attr('myloc');
    var type = $('#consigneeData').attr('loc_type');
    if (prod != '') {
        $.ajax({
            type: "POST",
            url: SITE_URL + 'dispatch/inventoryDetails',
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
                    $('#prod_detail_box').prepend(addProductDetailBox(prod, data.result.product.prod_name));
                    $('#prodBatch').append(addProductBatchBox(prod, data.result.batch));
                    $('#prodsDetails').append(addProdsDetail(prod, data.result.product.prod_name));
                    $('#proceedDisp').removeClass('hidden');
                    addProduct(prod);
                    batchHandleAction();
                    $('#product_data option[value="' + prod+ '"]').prop('disabled', true);
                    apply_select2_delay($("#product_data"), 'Select Product');
                    $('#arrowBounce').hide();
                    $('.fixedButn').show();
                    $('#product_data').val('');
                    $('#product_data').change();
                } else {
                    $('#prodErrMsg').removeClass('hidden');
                    $('#prodErrMsg').html(alertMess(data.message, data.status));
                }
            }
        });
    }
}

function removeCurrentSacs() {
    var loc = $('#consigneeData').attr('myloc');
    $('#sacs_data').find('option[value="' + loc + '"]').hide();
}

function removeCurrentFacs() {
    var type = $('#consigneeData').attr('loc_type');
    var loc = $('#consigneeData').attr('myloc');
    if (type == 'FAC') {
        $('#facs_data').find('option[value="' + loc + '"]').hide();
    }
}
function removeCurrentRWHs() {
    var type = $('#consigneeData').attr('loc_type');
    var loc = $('#consigneeData').attr('myloc');
    if (type == 'RWH') {
        $('#rwhs_data').find('option[value="' + loc + '"]').hide();
    }
}

function batchHandleAction() {
    $('.closePopUp').click(function () {
        $('.popBox').hide();
        $('#overlay').hide();
    });
}

function selectFacilityNo(sUrl, mUrl) {
    var fac_no = $('#no_fac').val();
    if (fac_no == 1) {
        window.location.replace(sUrl);
    } else if (fac_no > 1) {
        window.location.replace(mUrl);
    }
}

//Add consignment Details
function addConsigneeOnly(post_url) {
    var disp = $('input[name="disTo"]:checked').val();
    var sacs = $('#sacs_data').val();
    var dist = $('#district_data').val();
    var ftype = $('#ftype_data').val();
    var facs = $('#facs_data').val();
    var rwhs = $('#rwhs_data').val();
    var labs = $('#lab_data').val();
    if (disp == 'SACS' && sacs != '' && sacs != 0) {
        $.ajax({
            type: "POST",
            url: post_url,
            data: {
                'csrf_imsnaco': get_csrf_cookie(),
                'type': disp,
                'dist_id': dist,
                'ftype': ftype,
                'loc_id': sacs
            },
            dataType: "json",
            cache: false,
            success: function (data) {
                if (data.status == 'success') {
                    var jsonConsign = [];
                    var jsonArr = {};
                    jsonArr['type'] = 'SACS';
                    jsonArr['sacs_loc_id'] = sacs;
                    jsonArr['loc_id'] = 0;
                    jsonArr['loc_name'] = data.result.shipName;
                    jsonArr['source_id'] = 0;
                    jsonConsign.push(jsonArr);
                    $('#d_consignee').val(JSON.stringify(jsonConsign));
                    $('#shipToName').html(data.result.shipName);
                    $('#shipToAdd').html(data.result.shipto);
                    $('#dtl_shipToName').html(data.result.shipName);
                    $('#dtl_shipToAdd').html(data.result.shipto);
                    $('#consigneeData').attr('sacsid', sacs);
                    $('#consigneeData').attr('locid', sacs);
                    $('#consigneeData').attr('dispto', disp);
                    $('#shipToCons').removeClass('hidden');
                    $('#consignee_dtl').addClass('hidden');
                    $('#prodDetailArea').removeClass('hidden');

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
    } else if (disp == 'LAB' && labs != '' && labs != 0) {
        $.ajax({
            type: "POST",
            url: post_url,
            data: {
                'csrf_imsnaco': get_csrf_cookie(),
                'type': disp,
                'dist_id': 0,
                'ftype': 0,
                'loc_id': labs
            },
            dataType: "json",
            cache: false,
            success: function (data) {
                if (data.status == 'success') {
                    var jsonConsign = [];
                    var jsonArr = {};
                    jsonArr['type'] = 'LAB';
                    jsonArr['sacs_loc_id'] = 0;
                    jsonArr['loc_id'] = labs;
                    jsonArr['loc_name'] = data.result.shipName;
                    jsonArr['source_id'] = 0;
                    jsonConsign.push(jsonArr);
                    $('#d_consignee').val(JSON.stringify(jsonConsign));
                    $('#shipToName').html(data.result.shipName);
                    $('#shipToAdd').html(data.result.shipto);
                    $('#dtl_shipToName').html(data.result.shipName);
                    $('#dtl_shipToAdd').html(data.result.shipto);
                    $('#consigneeData').attr('sacsid', labs);
                    $('#consigneeData').attr('locid', labs);
                    $('#consigneeData').attr('dispto', disp);
                    $('#shipToCons').removeClass('hidden');
                    $('#consignee_dtl').addClass('hidden');
                    $('#prodDetailArea').removeClass('hidden');

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
    } else if (disp == 'FAC' && facs != '' && facs != 0) {
        $.ajax({
            type: "POST",
            url: post_url,
            data: {
                'csrf_imsnaco': get_csrf_cookie(),
                'type': disp,
                'dist_id': dist,
                'ftype': ftype,
                'loc_id': facs
            },
            dataType: "json",
            cache: false,
            success: function (data) {
                if (data.status == 'success') {
                    var jsonConsign = [];
                    var jsonArr = {};
                    jsonArr['type'] = 'FAC';
                    jsonArr['sacs_loc_id'] = data.result.billto_id;
                    jsonArr['loc_id'] = facs;
                    jsonArr['loc_name'] = data.result.shipName;
                    jsonArr['source_id'] = 0;
                    jsonConsign.push(jsonArr);
                    $('#d_consignee').val(JSON.stringify(jsonConsign));
                    $('#shipToName').html(data.result.shipName);
                    $('#shipToAdd').html(data.result.shipto);
                    $('#dtl_shipToName').html(data.result.shipName);
                    $('#dtl_shipToAdd').html(data.result.shipto);
                    $('#consigneeData').attr('sacsid', sacs);
                    $('#consigneeData').attr('locid', facs);
                    $('#consigneeData').attr('dispto', disp);
                    $('#shipToCons').removeClass('hidden');
                    $('#consignee_dtl').addClass('hidden');
                    $('#prodDetailArea').removeClass('hidden');
                    listInventoryProds(data.result.ftype);
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
    } else if (disp == 'RWH' && rwhs != '' && rwhs != 0) {
        $.ajax({
            type: "POST",
            url: post_url,
            data: {
                'csrf_imsnaco': get_csrf_cookie(),
                'type': disp,
                'dist_id': dist,
                'ftype': 0,
                'loc_id': rwhs
            },
            dataType: "json",
            cache: false,
            success: function (data) {
                if (data.status == 'success') {
                    var jsonConsign = [];
                    var jsonArr = {};
                    jsonArr['type'] = 'RWH';
                    jsonArr['sacs_loc_id'] = data.result.billto_id;
                    jsonArr['loc_id'] = rwhs;
                    jsonArr['loc_name'] = data.result.shipName;
                    jsonArr['source_id'] = 0;
                    jsonConsign.push(jsonArr);
                    $('#d_consignee').val(JSON.stringify(jsonConsign));
                    $('#shipToName').html(data.result.shipName);
                    $('#shipToAdd').html(data.result.shipto);
                    $('#dtl_shipToName').html(data.result.shipName);
                    $('#dtl_shipToAdd').html(data.result.shipto);
                    $('#consigneeData').attr('sacsid', sacs);
                    $('#consigneeData').attr('locid', rwhs);
                    $('#consigneeData').attr('dispto', disp);
                    $('#shipToCons').removeClass('hidden');
                    $('#consignee_dtl').addClass('hidden');
                    $('#prodDetailArea').removeClass('hidden');
                    listInventoryProds(data.result.ftype);
                    $('#dispatchErrMsg').show();
                    $('#dispatchErrMsg').html(alertMess(data.message, data.status));
                    $('#dispatchErrMsg').fadeOut(3000);

                } else {
                    $('#dispatchErrMsg').show();
                    $('#dispatchErrMsg').html(alertMess(data.message, data.status));
                    $('#sacs_data').val('');
                    $('#facs_data').val('');
                    $('#rwhs_data').val('');
                }
            }
        });
        return false;
    } else {
        $('#dispatchErrMsg').removeClass('hidden');
        $('#dispatchErrMsg').html(alertMess('You should select one of the consignee from the dropdown.', 'warning'));
    }
}

function addConsignee(loc_type='FAC') {
    if(loc_type=='RWH'){
        var locID = $('#rwhs_data').val();
    }else{
        var locID = $('#facs_data').val();
    }
    var post_url = SITE_URL + 'dispatch/' + (loc_type=='FAC'? 'selectFacConsignee':'selectRWHConsignee');
    if (locID != '' && locID != 0) {
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
                    var jsonConsign = [];
                    var jsonArr = {};
                    jsonArr['type'] = loc_type;
                    jsonArr['sacs_loc_id'] = data.result.billto_id;
                    jsonArr['loc_id'] = locID;
                    jsonArr['loc_name'] = data.result.shipName;
                    jsonArr['source_id'] = 0;
                    jsonConsign.push(jsonArr);
                    $('#d_consignee').val(JSON.stringify(jsonConsign));
                    $('#shipToName').html(data.result.shipName);
                    $('#shipToAdd').html(data.result.shipto);
                    $('#dtl_shipToName').html(data.result.shipName);
                    $('#dtl_shipToAdd').html(data.result.shipto);
                    $('#consigneeData').attr('locid', locID);
                    $('#consigneeData').attr('dispto', loc_type);
                    $('#shipToCons').removeClass('hidden');
                    $('#consignee_dtl').addClass('hidden');
                    $('#prodDetailArea').removeClass('hidden');
                    if(loc_type=='RWH'){
                        listInventoryProds();
                    }else{
                        $('#prodData').attr('ftype', data.result.ftype);
                        listInventoryProds(data.result.ftype);
                    }
                    $('#dispatchErrMsg').show();
                    $('#dispatchErrMsg').html(alertMess(data.message, data.status));
                    $('#dispatchErrMsg').fadeOut(3000);

                } else {
                    $('#dispatchErrMsg').show();
                    $('#dispatchErrMsg').html(alertMess(data.message, data.status));
                    $('#sacs_data').val('');
                    $('#facs_data').val('');
                    $('#rwhs_data').val('');
                }
            }
        });
        return false;
    } else {
        $('#dispatchErrMsg').removeClass('hidden');
        var location = loc_type=='RWH'?'Warehouse':'Facility';
        $('#dispatchErrMsg').html(alertMess('You should select one of the '+location+' from the dropdown.', 'warning'));
    }
}

function listInventoryProds(ftype=0) {
    var sacs = $('#consigneeData').attr('myloc');
    var type = $('#consigneeData').attr('loc_type');
    $.ajax({
        type: "POST",
        url: SITE_URL + 'dispatch/inventoryProducts',
        data: {
            'csrf_imsnaco': get_csrf_cookie(),
            'loc_type': type,
            'ftype': ftype,
            'loc_id': sacs
        },
        dataType: "json",
        cache: false,
        success: function (data) {
            $('#product_data').empty();
            $('#product_data').append(new Option('Select Product', ''));
            $.each(data.prods, function (index, value) {
                $('#product_data').append(new Option(value, index));
            });
        }
    });
}

function changeDispConsignee() {
    $('#shipToCons').addClass('hidden');
    $('#consignee_dtl').removeClass('hidden');
    $('#prodDetailArea').addClass('hidden');
    $('#prodsDetails').html('');
    $('#prod_detail_box').html('');
    $('#prodBatch').html('');
    $('#prodSelection').removeClass('hidden');
    $('#proceedDisp').addClass('hidden');
    $('#product_data').find('option').show();
    $('#prodData').attr('prods', '');
    $('#d_prods').val('');

}

function addProductDetailBox(prod, prodName) {
    var panel = myPanel($('.prodlisting').length);
    var ele = '';
    ele += '<div class="panel panel-' + panel + ' prodlisting" id="prod_batch_box_' + prod + '">';
    ele += '<div class="panel-heading"><h3 class="panel-title bold">' + prodName + '<a href="javascript:void(0)" onclick="delProdDetail(\'' + prod + '\')" class="pull-right"><span class="label label-danger">Delete Product</span></a></h3></div>';
    ele += '<div class="panel-body"><div id="pBatchMess_' + prod + '" style="display:none;"></div><p class="text-right"><a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="selectBatch(\'' + prod + '\')">Select Batch</a></p></div>';
    ele += '<table class="table" id="batchTab_' + prod + '">';
    ele += '<thead><tr><th>Batch No</th><th>Manufacturing Date</th><th>Expiry Date</th><th>Current Qty</th><th>Dispatch Qty</th><th>Number of Boxes</th><th>Action</th></tr></thead>';
    ele += '<tbody></tbody>';
    ele += '<tfoot><tr><td colspan="4" class="text-right">Total</td><td class="bold" id="totProdQty_' + prod + '">0</td><td class="bold" id="totProdBox_' + prod + '">0</td><td></td></tr></tfoot>';
    ele += '</table>';
    ele += '</div>';
    return ele;
}

function addProductBatchBox(prod, batches) {
    var ele = '';
    ele += '<div class="popBox" id="batch_detail_' + prod + '">';
    ele += '<a href="javascript:void(0)" class="closePopUp"><i class="fa fa-times-circle fa-2x"></i></a>';
    ele += '<div class="panel panel-primary"><div class="panel-heading"><h3 class="panel-title bold">Product Batches List</h3></div>';
    ele += '<div class="panel-body"><div id="batchErrorMess_' + prod + '" style="display:none;"></div>';
    ele += '<div class="table-responsive">';
    ele += '<table class="table batchTable table-striped" id="batchbox_' + prod + '">';
    ele += '<thead><tr class="vmid active"><th class="tdw200">Batch Number</th><th class="tdw200">Manufacturing Date</th><th class="tdw200">Expiry Date</th><th class="tdw150">Quantity</th><th class="tdw150">Action</th></tr></thead>';
    ele += '<tfoot>' + batches + '</tfoot></table>';
    ele += '</div></div></div>';
    return ele;
}

function addProdsDetail(prod, prodName) {
    var ele = '';
    ele += '<span id="prodDetail_' + prod + '" prodId="' + prod + '" pname="' + prodName + '" pData=""></span>';
    return ele;
}

function selectBatch(prod) {
    var ele = $('#batch_detail_' + prod);
    showPopBox(ele);
}

function addBatch(prod, invid, bid, bno, md, ed, qty) {
    var trow = '<tr class="batchRow_' + prod + '"><input class="invent_id" name="batch[' + prod + '][]" type="hidden" value="' + invid + '" /><input class="batch_id" name="batch[' + prod + '][]" type="hidden" value="' + bid + '" /><input class="batch_qty" name="batch[' + prod + '][]" type="hidden" value="' + qty + '" /><td class="bt_no">' + bno + '</td><td class="bt_md">' + md + '</td><td class="bt_ed">' + ed + '</td><td class="bt_qty">' + qty + '</td><td><input type="text" name="batchQty[' + prod + '][]" id="tempBatchQty_' + prod + '" class="form-control batchQty" valid="int" prod="' + prod + '" value="" /></td>' +
        '<td><input type="text" name="batchBox[' + prod + '][]" id="tempBatchBox_' + prod + '" class="form-control batchBox" valid="int" prod="' + prod + '" value="" /></td>' +
        '<td><a href="javascript:void(0)" class="remove-batch text-danger" prod="' + prod + '"><i class="fa fa-remove fa-2x"></i></a></td></tr>';
    $('#batchTab_' + prod).prepend(trow);
    $('#bt' + prod + 'select_' + bid).addClass('hidden');
    $('#tempBatchQty_' + prod).focus();
    $('.popBox').hide();
    $('#overlay').hide();
    activeRemoveBatch();
    batchProdQty();
    initUtilFunctions();
}

function batchProdQty() {
    $('.batchQty, .batchBox').on("keyup paste", function () {
        var prod = $(this).attr('prod');
        var qty = getNumValue($(this).val());
        var pEl = $(this).parent().parent();
        var currQty = getNumValue(pEl.find('.batch_qty').val());
        if (qty >= currQty) {
            $(this).val(currQty);
        }
        setTimeout(function () {
            setTotal(prod);
        }, 100); //Paste event doesn't work without setTimeout
    });
}

function setTotal(prod) {
    qty_error = false;
    qty = 0;
    box = 0;
    $(".batchRow_" + prod).each(function () {
        ob = $(this);
        qty = qty + getNumValue(ob.find('input.batchQty').val());
        box = box + getNumValue(ob.find('input.batchBox').val());
    });
    $('#totProdQty_' + prod).html(qty);
    $('#totProdBox_' + prod).html(box);
}

function proceedToDispatch() {
    $('#proceedDisp').on('click', function () {
        var prodData = $('#prodData').attr('prods');
        var jsonProd = [];
        var validDispatch = false;
        if (prodData != '') {
            jsonProd = $.parseJSON(prodData);
            $('#dtl_prods>.panel>.panel-body').html('');
            $.each(jsonProd, function (k, v) {
                if (validBatchDetail(v.pid)) {
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
    jsonArr['box'] = '';
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
            detailArr['batch_id'] = $(this).find('.batch_id_' + pd).val();
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
        $('#prodDetail_' + pd).attr('pData', JSON.stringify(jsonDet));
        return validBatchHandle;
    }
}

function makeProductTab(pd) {
    var prodJson = $.parseJSON($('#d_prods').val());
    var pname = $('#prodDetail_' + pd).attr('pname');
    var prodDet = $.parseJSON($('#prodDetail_' + pd).attr('pData'));
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
    ele += '<tfoot><tr class="info"><td colspan="2">&nbsp;</td><td>Total</td><td class="bold">' + total + '</td><td class="bold">' + total_box + '</td></tr></tfoot>';
    ele += '</table></div>';

    $.each(prodJson, function (k, p) {
        if (p.pid == pd) {
            prodJson[k].batch_dtl = batch_dtl;
            prodJson[k].qty = total;
            prodJson[k].box = total_box;
            return false;
        }
    });
    $('#d_prods').val(JSON.stringify(prodJson));
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
        var pEl = $(this).parent().parent();
        var batch_id = pEl.find('.batch_id').val();
        pEl.remove();
        $('#bt' + prod + 'select_' + batch_id).removeClass('hidden');
        setTotal(prod);
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