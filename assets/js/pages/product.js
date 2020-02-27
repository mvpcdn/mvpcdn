var batch_no_error = false;

$(document).ready(function() {
    $('#noa_data').change(function() {
        var noa = $(this).val();
        var prod = $('#prodDetail').attr('prodId');
        $.ajax({
            type: "POST",
            url: SITE_URL + 'dispatch/contractProdSchedule',
            data: {
                'csrf_imsnaco': get_csrf_cookie(),
                'pd_id': prod,
                'noa': noa
            },
            dataType: "json",
            cache: false,
            success: function(data) {
                $('#noaData').attr('noaid', noa);
                $('#d_noa_id').val(noa);
                $('#schedule_list').removeClass('hidden');
                $('#schedule_data').empty();
                $('#schedule_data').append(new Option('Select Schedule', ''));
                $.each(data.schedule, function(index, value) {
                    $('#schedule_data').append(new Option(value, index));
                });
            }
        });
        $(this).find('option').show();
        $(this).find('option[value="' + noa + '"]').hide();
    });


    $('#prod_data').change(function() {
        var prod = $(this).val();
        var noa = $('#noaData').attr('noaid');
        show_loader();
        $.ajax({
            type: "POST",
            url: SITE_URL + 'dispatch/contractProdSchedule',
            data: {
                'csrf_imsnaco': get_csrf_cookie(),
                'pd_id': prod,
                'noa': noa
            },
            dataType: "json",
            cache: false,
            success: function(data) {
                hide_loader();
                $('#prodDetail').attr('prodId', prod);
                $('#prodDetail').attr('ftype', data.ftype);
                $('#schedule_list').removeClass('hidden');
                $('#schedule_data').empty();
                $('#schedule_data').append(new Option('Select Schedule', ''));
                $.each(data.schedule, function(index, value) {
                    $('#schedule_data').append(new Option(value, index));
                });
            }
        });
        //$(this).find('option').show();
        //$(this).find('option[value="' + prod + '"]').hide();
        $(this).find('option').prop('disabled', false);
        $(this).find('option[value="' + prod + '"]').prop('disabled', true);
        apply_select2_delay($('#prod_data'), 'Select Product');
    });

    $('#schedule_data').change(function() {
        var schedule = $(this).val();
        var prod = $('#prodDetail').attr('prodId');
        var noa = $('#noaData').attr('noaid');
        $.ajax({
            type: "POST",
            url: SITE_URL + 'dispatch/contractScheduleDetail',
            data: {
                'csrf_imsnaco': get_csrf_cookie(),
                'sched_id': schedule,
                'pd_id': prod,
                'noa': noa
            },
            dataType: "json",
            cache: false,
            success: function(data) {
                if (data.status == 'success') {
                    $('#prodSchedData').removeClass('hidden');
                    $('#prodDetail').attr('prodId', data.result.product);
                    $('#prodDetail').attr('pname', data.result.prodName);
                    $('#prodDetail').attr('schedule', data.result.schedule);
                    $('#prodDetail').attr('isBatchMand', data.result.isBatch);
                    $('#d_schedule_no').val(data.result.schedule);
                    $('#d_schedule').val(schedule);
                    $('#prod_name').html(data.result.prodName);
                    $('#prod_name_tab').html(data.result.prodName);
                    $('#noaData').attr('noaid', data.result.noa_id);
                    $('#dtl_noaNum').html('NOA : ' + data.result.noa_num);
                    $('#noa_num_tab').html(data.result.noa_num);
                    $('#prod_schedule').html(data.result.schedule);
                    $('#prod_qty').html(data.result.prodQty);
                    $('#pend_qty').html(data.result.pendQty);
                    $('#prodSelection').addClass('hidden');
                    $('#lotSelection').removeClass('hidden');
                    $('#lot_data').empty();
                    $('#lot_data').append(new Option('Select Lot', ''));
                    $.each(data.lots, function(index, value) {
                        $('#lot_data').append(new Option(value, index));
                    });
//                    $('#consignee_dtl').removeClass('hidden');
                    $('#sacs_data').empty();
                    $('#sacs_data').append(new Option('Select SACS', ''));
                    $.each(data.sacsLoc, function(index, value) {
                        $('#sacs_data').append(new Option(value, index));
                    });
                    $('#lab_data').empty();
                    $('#lab_data').append(new Option('Select Laboratory', ''));
                    $.each(data.labsLoc, function(index, value) {
                        $('#lab_data').append(new Option(value, index));
                    });
                    addProduct(prod);
                    if (data.result.isBatch == 'N') {
                        $('#dispatch_qty_box').removeClass('hidden');
                        var bid = $('#tempBatch_' + prod).attr('batch');
                        var bno = $('#tempBatch_' + prod).attr('batchno');
                        var md = $('#tempBatch_' + prod).attr('bmd');
                        var ed = $('#tempBatch_' + prod).attr('bed');
                        addBatch(bid, bno, md, ed);
                    }

                } else {
                    $('#prodErrMsg').removeClass('hidden');
                    $('#prodErrMsg').html(alertMess(data.message, data.status));
                }
            }
        });
        $(this).find('option').show();
        $(this).find('option[value="' + schedule + '"]').hide();
    });
    $('#product_data').change(function() {
        var prod = $(this).val();
        if (prod != 0 && prod != '') {
            show_loader();
            $.ajax({
                type: "POST",
                url: SITE_URL + 'dispatch/productNoas',
                data: {
                    'csrf_imsnaco': get_csrf_cookie(),
                    'pd_id': prod
                },
                dataType: "json",
                cache: false,
                success: function(data) {
                    hide_loader();
                    $('#prodDetail').attr('prodId', prod);
                    $('#noas_list').removeClass('hidden');
                    $('#noa_detail').empty();
                    $('#noa_detail').append(new Option('Select NOA', ''));
                    $.each(data.noas, function(index, value) {
                        $('#noa_detail').append(new Option(value, index));
                    });
                    apply_select2_delay($('#noa_detail'), 'Select NOA');
                }
            });
            //$(this).find('option').show();
            //$(this).find('option[value="' + prod + '"]').hide();
            $(this).find('option').prop('disabled', false);
            $(this).find('option[value="' + prod + '"]').prop('disabled', true);
            apply_select2_delay($('#product_data'), 'Select Product');
        }
    });
    $('#noa_detail').change(function() {
        var noa = $(this).val();
        var prod = $('#prodDetail').attr('prodId');
        var sacs = $('#consigneeData').attr('sacsid');
        $.ajax({
            type: "POST",
            url: SITE_URL + 'dispatch/sacsScheduleDetail',
            data: {
                'csrf_imsnaco': get_csrf_cookie(),
                'sacs': sacs,
                'pd_id': prod,
                'noa': noa
            },
            dataType: "json",
            cache: false,
            success: function(data) {
                if (data.status == 'success') {
                    $('#noaData').attr('noaid', noa);
                    $('#d_noa_id').val(noa);
                    $('#prodSchedData').removeClass('hidden');
                    $('#prodDetail').attr('prodId', data.result.product);
                    $('#prodDetail').attr('isBatchMand', data.batchMand);
                    $('#prodDetail').attr('pname', data.result.prodName);
                    $('#prodDetail').attr('schedule', data.result.schedule);
                    $('#d_schedule_no').val(data.result.schedule);
                    $('#d_schedule').val(data.result.schedule_id);
                    $('#prod_name').html(data.result.prodName);
                    $('#prod_name_tab').html(data.result.prodName);
                    $('#noaData').attr('noaid', data.result.noa_id);
                    $('#dtl_noaNum').html('NOA : ' + data.result.noa_num);
                    $('#noa_num_tab').html(data.result.noa_num);
                    $('#prod_schedule').html(data.result.schedule);
                    $('#prod_qty').html(data.result.prodQty);
                    $('#pend_qty').html(data.result.pendQty);
                    $('#prodBatch').html(data.prodBatch);
                    $('#prodSelection').addClass('hidden');
                    $('#changeProdDetail').removeClass('hidden');

                    $('#lotSelection').removeClass('hidden');
                    $('#lot_data').empty();
                    $('#lot_data').append(new Option('Select Lot', ''));
                    $.each(data.lots, function(index, value) {
                        $('#lot_data').append(new Option(value, index));
                    });
                    addProduct(prod);
                    batchHandleAction();
                    if (data.batchMand == 'N') {
                        $('#dispatch_qty_box').removeClass('hidden');
                        var bid = $('#tempBatch_' + prod).attr('batch');
                        var bno = $('#tempBatch_' + prod).attr('batchno');
                        var md = $('#tempBatch_' + prod).attr('bmd');
                        var ed = $('#tempBatch_' + prod).attr('bed');
                        addBatch(bid, bno, md, ed);
                    }
                } else {
                    $('#prodErrMsg').removeClass('hidden');
                    $('#prodErrMsg').html(alertMess(data.message, data.status));
                }
            }
        });
        //$(this).find('option').show();
        //$(this).find('option[value="' + noa + '"]').hide();

        $(this).find('option').prop('disabled', false);
        $(this).find('option[value="' + noa + '"]').prop('disabled', true);
        apply_select2_delay($('#noa_detail'), 'Select NOA');
    });


    $('#sacs_data').change(function() {
        var sacs = $(this).val();
        var prod = $('#prodDetail').attr('prodId');
        var ftype = $('#prodDetail').attr('ftype');
        if (sacs != '') {
            $('#d_sacs_id').val(sacs);
            $('#d_consignee_type').val('SACS');

            show_loader();
            $.ajax({
                type: "POST",
                url: SITE_URL + 'common/getFacsList',
                data: {'location_id': sacs, 'ftype': ftype, 'prod_id': prod},
                dataType: "json",
                cache: false,
                success: function(data) {
                    hide_loader();
                    $('#facs_data').empty();
                    $('#facs_data').append(new Option('Select Facility', ''));
                    $.each(data.facs, function(index, value) {
                        $('#facs_data').append(new Option(value, index));
                    });
                    apply_select2_delay($("#facs_data"), 'Select Facility');
                }
            });
            get_rwh_dd_options(sacs);
        } else {
            $('#facs_data, #rwh_data').empty();
            $('#facs_data').append(new Option('Select Facility', ''));
            $('#rwh_data').append(new Option('Select Regional Warehouse', ''));
            apply_select2_delay($("#facs_data"), 'Select Facility');
            apply_select2_delay($("#rwh_data"), 'Select Regional Warehouse');
        }
    });
    $('#facs_data').change(function() {
        $('#rwh_data').val('');
        apply_select2_delay($("#rwh_data"), 'Select Regional Warehouse');
    });
    $('#rwh_data').change(function() {
        $('#facs_data').val('');
        apply_select2_delay($("#facs_data"), 'Select Facility');
    });

    $('#lab_data').change(function() {
        var lab = $(this).val();
        $('#d_sacs_id').val(lab);
        $('#d_consignee_type').val('LAB');
    });


    $('#lot_data').change(function() {
        var lot_no = $(this).val();
        var lot = '';
        if (lot_no != '') {
            lot = $(this).find('option[value="' + lot_no + '"]').html();
        }
        $('#consigneeData').attr('lotno', lot_no);
        $('#consigneeData').attr('lot', lot);
        $('#d_lot_no').val(lot_no);
        $('#lotErrMsg').addClass('hidden');
        var isBatch = $('#prodDetail').attr('isBatchMand');
        var isConsign = $('#consigneeData').attr('dispto');
        if (isBatch == 'Y' && isConsign != '') {
            $('#prod_detail_box').removeClass('hidden');
        } else {
            $('#prod_detail_box').addClass('hidden');
        }
        if (lot_no) {
            if ($('#billToSACS').hasClass('hidden')) {
                $('#consignee_dtl').removeClass('hidden');
            }
        } else {
            $('#consignee_dtl').addClass('hidden');
        }
        if (checkProd()) {
            $('#proceedDisp').removeClass('hidden');
        } else {
            $('#proceedDisp').addClass('hidden');
        }


    });

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
    batchHandleAction();

    $('input.disTo').click(function() {
        var type = $(this).val();
        $('#sacs_list,#facs_list,#rwh_list,#lab_list').addClass('hidden');
        switch(type){
            case 'SACS':
                $('#facs_data, #rwh_list').val('');
                apply_select2_delay($("#facs_data"), 'Select Facility');
                apply_select2_delay($("#rwh_data"), 'Select Regional Warehouse');
                $('#sacs_list').removeClass('hidden');
            break;
            case 'FAC':
                $('#sacs_list').removeClass('hidden');
                $('#facs_list').removeClass('hidden');
            break;
            case 'RWH':
                $('#sacs_list').removeClass('hidden');
                $('#rwh_list').removeClass('hidden');
            break;
            case 'LAB':
            apply_select2_delay($("#lab_data"), 'Select Laboratory');
            $('#lab_list').removeClass('hidden');
            break;
        }
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
    $('#completeDisp').on("click", function() {
        $(this).addClass('disabled');
        $("#invoiceForm").submit();
    });
    $('#invoiceForm').validator().on('submit', function(e) {
        if (e.isDefaultPrevented()) {
            $('#invoiceErrMess').show();
            $('#invoiceErrMess').html(alertMess('Please check the errors below.', 'error'));
            $('#invoiceErrMess').fadeOut(4000);
            $('#completeDisp').removeClass('disabled');
        } else {
            var invNum = $('#invoice_no').val();
            var invdate = $('#invoice_date').val();
            var disDate = $('#dispatch_date').val();
            var delDate = $('#delivery_date').val();
            var trasName = $('#trans_name').val();
            var drivName = $('#driver_name').val();
            var drivMob = $('#driver_mob').val();
            var remark = $('#remarks').val();
            var d_noa_id = $('#d_noa_id').val();
            var d_supp_id = $('#d_supp_id').val();
            var d_schedule_no = $('#d_schedule_no').val();
            var d_schedule = $('#d_schedule').val();
            var d_sacs_id = $('#d_sacs_id').val();
            var d_consignee_type = $('#d_consignee_type').val();
            var d_lot_no = $('#d_lot_no').val();
            var d_consignee = $('#d_consignee').val();
            var d_prods = $('#d_prods').val();
            var d_postURL = $('#d_postURL').val();
            $.ajax({
                type: "POST",
                url: d_postURL,
                data: {
                    'invoice_no': invNum,
                    'invoice_date': invdate,
                    'dispatch_date': disDate,
                    'delivery_date': delDate,
                    'trans_name': trasName,
                    'driver_name': drivName,
                    'driver_mob': drivMob,
                    'remarks': remark,
                    'd_noa_id': d_noa_id,
                    'd_supp_id': d_supp_id,
                    'd_schedule_no': d_schedule_no,
                    'd_schedule': d_schedule,
                    'd_sacs_id': d_sacs_id,
                    'd_consignee_type': d_consignee_type,
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
                        $('#completeDisp').removeClass('disabled');
                    } else if (data.status == 'error') {
                        $('#invoiceErrMess').html('');
                        $('#invoiceErrMess').show();
                        $.each(data.message, function(k, v) {
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
    });

    $('#resendDisp').click(function() {
        $(this).addClass('disabled');
        $("#stnUpdateForm").submit();
    });
    $('#stnUpdateForm').validator().on('submit', function(e) {
        if (e.isDefaultPrevented()) {
            $('#invoiceErrMess').show();
            $('#invoiceErrMess').html(alertMess('Please check the errors below.', 'error'));
            $('#invoiceErrMess').fadeOut(4000);
            $('#resendDisp').removeClass('disabled');
        } else {
            var receipt = $('#d_receipt_id').val();
            var stn = $('#d_stn_id').val();
            var remark = $('#remarks').val();
            var d_noa_id = $('#d_noa_id').val();
            var d_supp_id = $('#d_supp_id').val();
            var d_schedule_no = $('#d_schedule_no').val();
            var d_schedule = $('#d_schedule').val();
            var d_sacs_id = $('#d_sacs_id').val();
            var d_lot_no = $('#d_lot_no').val();
            var d_consignee = $('#d_consignee').val();
            var d_prods = $('#d_prods').val();
            var d_postURL = $('#d_postURL').val();
            $.ajax({
                type: "POST",
                url: d_postURL,
                data: {
                    'csrf_imsnaco': get_csrf_cookie(),
                    'remarks': remark,
                    'd_receipt_id': receipt,
                    'd_stn_id': stn,
                    'd_noa_id': d_noa_id,
                    'd_supp_id': d_supp_id,
                    'd_schedule_no': d_schedule_no,
                    'd_schedule': d_schedule,
                    'd_sacs_id': d_sacs_id,
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
                        $('#resendDisp').removeClass('disabled');
                    } else if (data.status == 'error') {
                        $('#invoiceErrMess').html('');
                        $('#invoiceErrMess').show();
                        $.each(data.message, function(k, v) {
                            $('#invoiceErrMess').append(alertMess(v, data.status));
                        });
                        $('#resendDisp').removeClass('disabled');
                    } else {
                        window.location.replace(data.rUrl);
                    }
                }
            });
            return false;
        }
    });
    $("#invoice_no").on("keyup paste", function() {
        ob = $(this);
        setTimeout(function() {
            invoice_no = ob.val();
            var allowed = /^[a-zA-Z0-9\-\/\\]+$/;
            invoice_no_error = false;
            ob.parent().find(".invalid-chars").remove();

            if (invoice_no && !allowed.test(invoice_no)) {
                invoice_no_error = true;
                ob.parent().append('<p class="text-danger invalid-chars">Only Alphabet, Digits, forward slash(/), backward slash(\) and dash(-) allowed!</p>');
            }
        }, 100);
    });

    apply_select2_delay($("#product_data"), 'Select Product');
    apply_select2_delay($("#prod_data"), 'Select Product');
    apply_select2_delay($("#sacs_data"), 'Select SACS');
    apply_select2_delay($("#facs_data"), 'Select Facility');
    apply_select2_delay($("#rwh_data"), 'Select Regional Warehouse');
});

/** Methods */
function get_rwh_dd_options(sacs_id){
    show_loader();
    $.ajax({
        url:SITE_URL+'rwh/all_lists/'+sacs_id,
        dataType:'JSON',
        success: function(res){
            hide_loader();
            $('#rwh_data').empty();
            $('#rwh_data').append(new Option('Select Regional Warehouse', ''));
            res.result.forEach(function(v,i){
                $('#rwh_data').append(new Option(v.name, v.rwh_id));
            });
            apply_select2_delay($("#rwh_data"), 'Select Regional Warehouse');
        }
    });
}

function batchHandleAction() {
    $("input[name='m_date']").datepicker({
        dateFormat: "dd M yy",
        changeYear: true,
        changeMonth: true,
        maxDate: 0,
        onSelect: function(date) {
            cp = $(this).attr('prod');
//            $('#x_date' + cp).datepicker('option', 'minDate', date);
            var md = $("#m_date" + cp).val();
            var xd = $("#x_date" + cp).val();
            var mdate = new Date(md);
            var xdate = new Date(xd);
            if (xdate < mdate) {
                $('#batchErrorMess').show();
                $('#batchErrorMess').html(alertMess('Manufacturing Date should be less than Expiry Date.', 'warning'));
                $(this).val(date);
            }
        }
    });

    $("input[name='x_date']").datepicker({
        dateFormat: "dd M yy",
        changeYear: true,
        changeMonth: true,
        minDate: 0,
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

//            } else {
//                var xdt = xdate.getDate();
//                var xmnth = xdate.getMonth();
//                if (xmnth == 1) {
//                    if (xdt < 28) {
//                        xd = '28' + ' ' + getMonthName(xdate.getMonth()) + ' ' + xdate.getFullYear();
//                    }
//                } else {
//                    if (xdt < 30) {
//                        xd = '30' + ' ' + getMonthName(xdate.getMonth()) + ' ' + xdate.getFullYear();
//                    }
//                }
//                $(this).val(xd);
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
        var prod, prod_id, supp_id, batch_post,self_life, batch_no, m_date, x_date, type, ele_batchBox, ele_batchErrMess, ele_batchInput;
        if ($(this).attr('prod') && $(this).attr('prod') != '') {
            prod = $(this).attr('prod');
            prod_id = $('#prodDetail').attr('prodId');
            supp_id = $('#prodData').attr('suppid');
            batch_post = $('#batch_post').val();
            self_life = $(this).attr('self_life');

            batch_no = $('#batch_no' + prod).val();
            m_date = $('#m_date' + prod).val();
            x_date = $('#x_date' + prod).val();

            type = 'dispatch';
            ele_batchBox = $('#batchbox_' + prod + ' tfoot');
            ele_batchErrMess = $('#batchErrorMess_' + prod);
            ele_batchInput = $('#batchbox_' + prod + ' tbody input[type="text"]');

        } else {
            prod = '';
            prod_id = $('#prodDetail').attr('prodId');
            supp_id = $('#prodData').attr('suppid');
            batch_post = $('#batch_post').val();
            self_life = $(this).attr('self_life');

            batch_no = $('#batch_no').val();
            m_date = $('#m_date').val();
            x_date = $('#x_date').val();

            type = 'status';
            ele_batchBox = $('#batchbox tfoot');
            ele_batchErrMess = $('#batchErrorMess');
            ele_batchInput = $('#batchbox tbody input[type="text"]');
        }
        if (batchValidate(prod)) {
            $.ajax({
                type: "POST",
                url: batch_post,
                data: {
                    'csrf_imsnaco': get_csrf_cookie(),
                    'pd_id': prod_id,
                    'supp': supp_id,
                    'self_life': self_life,
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

    $('.closePopUp').click(function() {
        $('.popBox').hide();
        $('#overlay').hide();
    });

}
function proceedToDispatch() {
    $('#proceedDisp').on('click', function() {
        var prod = $('#prodDetail').attr('prodId');
        var batchMand = $('#prodDetail').attr('isBatchMand');
        validDispatch = false;
        if (prod != '') {
            if (batchMand == 'Y') {
                $('#dtl_prods>.panel>table').html('');
                if (validBatchDetail() && validateLot()) {
                    makeProductTab(prod);
                    validDispatch = true;
                } else {
                    validDispatch = false;
                }
            } else {
                if ($('#dispatch_qty').val() != '') {
                    $('#dtl_prods>.panel>table').html('');
                    if (validBatchDetail() && validateLot()) {
                        makeTempBatchTab(prod);
                        validDispatch = true;
                    } else {
                        validDispatch = false;
                    }
                } else {
                    validDispatch = false;
                }
            }
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
function validateLot() {
    if ($('#lot_data').val() == '') {
        $('#lotErrMsg').removeClass('hidden');
        $('#lotErrMsg').html(alertMess('Please select Lot Schedule', 'error'));
        return false;
    }
    return true;
}
function validBatchDetail() {
    if ($('tr.batchRow').length == 0) {
        $('#pBatchMess').html(alertMess('Please Add Batch Details', 'error'));
        $('#pBatchMess').show(1000).fadeOut(6000);
        return false;
    } else {
        var jsonDet = [];
        validBatchHandle = true;
        $('tr.batchRow').each(function() {
            var detailArr = {};
            detailArr['batch_id'] = $(this).find('.batch_id').val();
            if (isProdQuant() && isBatchEmpty($(this))) {
                detailArr['batch_no'] = $(this).find('td.bt_no').html();
                detailArr['batch_md'] = $(this).find('td.bt_md').html();
                detailArr['batch_ed'] = $(this).find('td.bt_ed').html();
                detailArr['batch_qty'] = $(this).find('input.batchQty').val();
                jsonDet.push(detailArr);
            } else {
                validBatchHandle = false;
            }
        });
        $('#prodDetail').attr('pData', JSON.stringify(jsonDet));
        return validBatchHandle;
    }
}
function makeProductTab(pd) {
    var prodJson = $.parseJSON($('#d_prods').val());
//    var gtin = $.parseJSON($('#prodDetail_' + pd).attr('gtin'));
//    var norm = $.parseJSON($('#prodDetail_' + pd).attr('norm'));
    var lot = $('#consigneeData').attr('lot');
    var pname = $('#prodDetail').attr('pname');
    var schedule = $('#prodDetail').attr('schedule');
    var prodDet = $.parseJSON($('#prodDetail').attr('pData'));
    var total = 0;
    var batch_dtl = [];
    var ele = '';
    ele += '<thead>';
    ele += '<tr class="warning">';
    ele += '<th colspan="2">Schedule : ' + schedule + '</th>';
    ele += '<th colspan="2">' + lot + '</th>';
    ele += '</tr><tr class="active"><th colspan="4">Batch Details</th></tr>';
    ele += '</thead><tbody><tr>';
    ele += '<th>Batch No.</th>';
    ele += '<th>Manufacturing Date</th>';
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

    $.each(prodJson, function(k, p) {
        if (p.pid == pd) {
            prodJson[k].batch_dtl = batch_dtl;
            prodJson[k].qty = total;
            return false;
        }
    });
    $('#d_prods').val(JSON.stringify(prodJson));
    $('#dtl_prods>.panel>.panel-heading>h3').html(pname);
    $('#dtl_prods>.panel>table').append(ele);
}

function makeTempBatchTab(pd) {
    var prodJson = $.parseJSON($('#d_prods').val());
    var lot = $('#consigneeData').attr('lot');
    var pname = $('#prodDetail').attr('pname');
    var schedule = $('#prodDetail').attr('schedule');
    var prodDet = $.parseJSON($('#prodDetail').attr('pData'));
    var total = 0;
    var batch_dtl = [];
    var ele = '';
    ele += '<tr class="active">';
    ele += '<th>Product</th>';
    ele += '<th>Schedule</th>';
    ele += '<th>Lot Number</th>';
    ele += '<th>Quantity</th>';
    $.each(prodDet, function(k, v) {
        var batchArr = {};
        batchArr['batch_id'] = v.batch_id;
        batchArr['exp_qty'] = v.batch_qty;
        batch_dtl.push(batchArr);
        total = total + getNumValue(v.batch_qty);
    });
    ele += '</tr><tr>';
    ele += '<td>' + pname + '</td>';
    ele += '<td>' + schedule + '</td>';
    ele += '<td>' + lot + '</td>';
    ele += '<td>' + total + '</td>';
    ele += '</tr>';

    $.each(prodJson, function(k, p) {
        if (p.pid == pd) {
            prodJson[k].batch_dtl = batch_dtl;
            prodJson[k].qty = total;
            return false;
        }
    });
    $('#d_prods').val(JSON.stringify(prodJson));
    $('#dtl_prods>.panel>.panel-heading>h3').html('Product Details');
    $('#dtl_prods>.panel>table').append(ele);
}
function isBatchEmpty(ele) {
    if (ele.find('input.batchQty').val() == '' || ele.find('input.batchQty').val() == 0) {
        $('#pBatchMess').html(alertMess(' Please fill valid batch quantity', 'error'));
        $('#pBatchMess').show(1000).fadeOut(6000);
        return false;
    }
    return true;
}
function isProdQuant() {
    if ($('#totProdQty').hasClass('danger')) {
        $('#pBatchMess').html(alertMess('Total Quantity can\'t be greater than pending Quantity', 'error'));
        $('#pBatchMess').show(1000).fadeOut(6000);
        $('#tempBatchErrMsg').html(alertMess('Product Quantity can\'t be greater than pending Quantity', 'error'));
        $('#tempBatchErrMsg').show(1000).fadeOut(6000);
        return false;
    }
    return true;
}
// Add Product Details
function addProduct(prod) {
//    $('#prod_detail_box').removeClass('hidden');
//    $('#prod_action_' + prod).addClass('hidden');
    $('#prodData').attr('prods', addProdJson(prod));
    $('#d_prods').val(addProdJson(prod));
    $('#proceedDisp').unbind('click');
    proceedToDispatch();
}
function delProdDetail(prod) {
    $('#prod_detail_box').addClass('hidden');
    $('#batchTab tbody').html('');
    $('#totProdQty').html('0');
    //$('#prod_action_' + prod).removeClass('hidden');
    $('#prodData').attr('prods', delProdJson(prod));
    $('#d_prods').val(delProdJson(prod));
    $('#prodDetail_' + prod).remove();
    if (checkProd()) {
        $('#proceedDisp').removeClass('hidden');
    } else {
        $('#proceedDisp').addClass('hidden');
    }
    /*$('#facs_data').empty();
    $('#facs_data').append(new Option('Select Facility', ''));
    apply_select2_delay($('#facs_data'), 'Select Facility');*/
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
    var loc = $('#consigneeData').attr('locid');
    if (prodData != '' && lot != '' && loc != '') {
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
function addConsigneeOnly(post_url) {
    var disp = $('input[name="disTo"]:checked').val();
    var sacs = $('#sacs_data').val();
    var facs = $('#facs_data').val();
    var rwh = $('#rwh_data').val();
    var lab = $('#lab_data').val();

    if (disp == 'SACS' && sacs != '' && sacs != 0) {
        $.ajax({
            type: "POST",
            url: post_url,
            data: {'type': disp, 'loc_id': sacs},
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
                    $('#consigneeData').attr('sacsid', sacs);
                    $('#consigneeData').attr('locid', sacs);
                    $('#consigneeData').attr('dispto', disp);
                    $('#shipToCons').removeClass('hidden');
                    $('#consignee_dtl').addClass('hidden');
                    $('#billToSACS').removeClass('hidden');
                    $('#shipToCons').removeClass('hidden');
                    $('#prodDetailArea').removeClass('hidden');

                    $('#product_data').empty();
                    $('#product_data').append(new Option('Select Product', ''));
                    $.each(data.result.prods, function(index, value) {
                        $('#product_data').append(new Option(value, index));
                    });

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
            data: {'type': disp, 'loc_id': facs},
            dataType: "json",
            cache: false,
            success: function(data) {
                if (data.status == 'success') {
                    var jsonConsign = [];
                    var jsonBArr = {};
                    var jsonSArr = {};
                    jsonBArr['type'] = 'BILL';
                    jsonBArr['is_ship'] = 'NO';
                    jsonBArr['loc_type'] = 'SACS';
                    jsonBArr['loc_id'] = data.result.billto_id;
                    jsonConsign.push(jsonBArr);
                    jsonSArr['type'] = 'SHIP';
                    jsonSArr['is_ship'] = 'YES';
                    jsonSArr['loc_type'] = 'FAC';
                    jsonSArr['loc_id'] = facs;
                    jsonConsign.push(jsonSArr);
                    $('#d_consignee').val(JSON.stringify(jsonConsign));
                    $('#billToName').html(data.result.billName);
                    $('#billToAdd').html(data.result.billto);
                    $('#shipToName').html(data.result.shipName);
                    $('#shipToAdd').html(data.result.shipto);
                    $('#dtl_billToName').html(data.result.billName);
                    $('#dtl_billToAdd').html(data.result.billto);
                    $('#dtl_shipToName').html(data.result.shipName);
                    $('#dtl_shipToAdd').html(data.result.shipto);
                    $('#consigneeData').attr('sacsid', sacs);
                    $('#consigneeData').attr('locid', facs);
                    $('#consigneeData').attr('dispto', disp);
                    $('#shipToCons').removeClass('hidden');
                    $('#consignee_dtl').addClass('hidden');
                    $('#billToSACS').removeClass('hidden');
                    $('#shipToCons').removeClass('hidden');
                    $('#prodDetailArea').removeClass('hidden');

                    $('#product_data').empty();
                    $('#product_data').append(new Option('Select Product', ''));
                    $.each(data.result.prods, function(index, value) {
                        $('#product_data').append(new Option(value, index));
                    });

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
    }else if (disp == 'RWH' && rwh != '' && rwh != 0) {
        $.ajax({
            type: "POST",
            url: post_url,
            data: {'type': disp, 'loc_id': rwh},
            dataType: "json",
            cache: false,
            success: function(data) {
                if (data.status == 'success') {
                    var jsonConsign = [];
                    var jsonBArr = {};
                    var jsonSArr = {};
                    jsonBArr['type'] = 'BILL';
                    jsonBArr['is_ship'] = 'NO';
                    jsonBArr['loc_type'] = 'SACS';
                    jsonBArr['loc_id'] = data.result.billto_id;
                    jsonConsign.push(jsonBArr);
                    jsonSArr['type'] = 'SHIP';
                    jsonSArr['is_ship'] = 'YES';
                    jsonSArr['loc_type'] = 'RWH';
                    jsonSArr['loc_id'] = rwh;
                    jsonConsign.push(jsonSArr);
                    $('#d_consignee').val(JSON.stringify(jsonConsign));
                    $('#billToName').html(data.result.billName);
                    $('#billToAdd').html(data.result.billto);
                    $('#shipToName').html(data.result.shipName);
                    $('#shipToAdd').html(data.result.shipto);
                    $('#dtl_billToName').html(data.result.billName);
                    $('#dtl_billToAdd').html(data.result.billto);
                    $('#dtl_shipToName').html(data.result.shipName);
                    $('#dtl_shipToAdd').html(data.result.shipto);
                    $('#consigneeData').attr('sacsid', sacs);
                    $('#consigneeData').attr('locid', rwh);
                    $('#consigneeData').attr('dispto', disp);
                    $('#shipToCons').removeClass('hidden');
                    $('#consignee_dtl').addClass('hidden');
                    $('#billToSACS').removeClass('hidden');
                    $('#shipToCons').removeClass('hidden');
                    $('#prodDetailArea').removeClass('hidden');

                    $('#product_data').empty();
                    $('#product_data').append(new Option('Select Product', ''));
                    $.each(data.result.prods, function(index, value) {
                        $('#product_data').append(new Option(value, index));
                    });

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
    }else if (disp == 'LAB' && lab != '' && lab != 0) {
        $.ajax({
            type: "POST",
            url: post_url,
            data: {'type': disp, 'loc_id': lab},
            dataType: "json",
            cache: false,
            success: function(data) {
                if (data.status == 'success') {
                    var jsonConsign = [];
                    var jsonArr = {};
                    jsonArr['type'] = 'BILL';
                    jsonArr['is_ship'] = 'YES';
                    jsonArr['loc_type'] = 'LAB';
                    jsonArr['loc_id'] = lab;
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
                    $('#consigneeData').attr('sacsid', sacs);
                    $('#consigneeData').attr('locid', lab);
                    $('#consigneeData').attr('dispto', disp);
                    $('#shipToCons').removeClass('hidden');
                    $('#consignee_dtl').addClass('hidden');
                    $('#billToSACS').removeClass('hidden');
                    $('#shipToCons').removeClass('hidden');
                    $('#prodDetailArea').removeClass('hidden');

                    $('#product_data').empty();
                    $('#product_data').append(new Option('Select Product', ''));
                    $.each(data.result.prods, function(index, value) {
                        $('#product_data').append(new Option(value, index));
                    });

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

//Add consignment Details
function addProdConsignee(post_url) {
    var disp = $('input[name="disTo"]:checked').val();
    var noa = $('#noaData').attr('noaid');
    var sacs = $('#sacs_data').val();
    var facs = $('#facs_data').val();
    var rwh = $('#rwh_data').val();
    var lab = $('#lab_data').val();
    var isBatch = $('#prodDetail').attr('isBatchMand');
    if (disp == 'SACS' && sacs != '' && sacs != 0) {
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
                    $('#consigneeData').attr('sacsid', sacs);
                    $('#consigneeData').attr('locid', sacs);
                    $('#consigneeData').attr('dispto', disp);
                    $('#shipToCons').removeClass('hidden');
                    $('#consignee_dtl').addClass('hidden');
                    $('#billToSACS').removeClass('hidden');
                    $('#shipToCons').removeClass('hidden');
                    $('#dispatchErrMsg').show();
                    $('#dispatchErrMsg').html(alertMess(data.message, data.status));
                    $('#dispatchErrMsg').fadeOut(3000);
                    if (isBatch == 'Y') {
                        $('#prod_detail_box').removeClass('hidden');
                    }
                    if (checkProd()) {
                        $('#proceedDisp').removeClass('hidden');
                    } else {
                        $('#proceedDisp').addClass('hidden');
                    }
                } else {
                    $('#dispatchErrMsg').show();
                    $('#dispatchErrMsg').html(alertMess(data.message, data.status));
                    $('#sacs_data, #facs_data, #rwh_data').val('');
                    $('#sacs_data, #facs_data, #rwh_data').change();
                }
            }
        });
        return false;
    } else if (disp == 'LAB' && lab != '' && lab != 0) {
        $.ajax({
            type: "POST",
            url: post_url,
            data: {
                'csrf_imsnaco': get_csrf_cookie(),
                'type': disp,
                'loc_id': lab,
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
                    jsonArr['loc_type'] = 'LAB';
                    jsonArr['loc_id'] = lab;
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
                    $('#consigneeData').attr('sacsid', lab);
                    $('#consigneeData').attr('locid', lab);
                    $('#consigneeData').attr('dispto', disp);
                    $('#shipToCons').removeClass('hidden');
                    $('#consignee_dtl').addClass('hidden');
                    $('#billToSACS').removeClass('hidden');
                    $('#shipToCons').removeClass('hidden');
                    $('#dispatchErrMsg').show();
                    $('#dispatchErrMsg').html(alertMess(data.message, data.status));
                    $('#dispatchErrMsg').fadeOut(3000);
                    if (isBatch == 'Y') {
                        $('#prod_detail_box').removeClass('hidden');
                    }
                    if (checkProd()) {
                        $('#proceedDisp').removeClass('hidden');
                    } else {
                        $('#proceedDisp').addClass('hidden');
                    }
                } else {
                    $('#dispatchErrMsg').show();
                    $('#dispatchErrMsg').html(alertMess(data.message, data.status));
                    $('#sacs_data, #lab_data, #facs_data, #rwh_data').val('');
                    $('#sacs_data, #lab_data, #facs_data, #rwh_data').change();
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
                'loc_id': facs,
                'noa': noa
            },
            dataType: "json",
            cache: false,
            success: function(data) {
                if (data.status == 'success') {
                    var jsonConsign = [];
                    var jsonBArr = {};
                    var jsonSArr = {};
                    jsonBArr['type'] = 'BILL';
                    jsonBArr['is_ship'] = 'NO';
                    jsonBArr['loc_type'] = 'SACS';
                    jsonBArr['loc_id'] = data.result.billto_id;
                    jsonConsign.push(jsonBArr);
                    jsonSArr['type'] = 'SHIP';
                    jsonSArr['is_ship'] = 'YES';
                    jsonSArr['loc_type'] = 'FAC';
                    jsonSArr['loc_id'] = facs;
                    jsonConsign.push(jsonSArr);
                    $('#d_consignee').val(JSON.stringify(jsonConsign));
                    $('#billToName').html(data.result.billName);
                    $('#billToAdd').html(data.result.billto);
                    $('#shipToName').html(data.result.shipName);
                    $('#shipToAdd').html(data.result.shipto);
                    $('#dtl_billToName').html(data.result.billName);
                    $('#dtl_billToAdd').html(data.result.billto);
                    $('#dtl_shipToName').html(data.result.shipName);
                    $('#dtl_shipToAdd').html(data.result.shipto);
                    $('#consigneeData').attr('sacsid', sacs);
                    $('#consigneeData').attr('locid', facs);
                    $('#consigneeData').attr('dispto', disp);
                    $('#shipToCons').removeClass('hidden');
                    $('#consignee_dtl').addClass('hidden');
                    $('#billToSACS').removeClass('hidden');
                    $('#shipToCons').removeClass('hidden');
                    if (isBatch == 'Y') {
                        $('#prod_detail_box').removeClass('hidden');
                    }
                    if (checkProd()) {
                        $('#proceedDisp').removeClass('hidden');
                    } else {
                        $('#proceedDisp').addClass('hidden');
                    }

                    $('#dispatchErrMsg').show();
                    $('#dispatchErrMsg').html(alertMess(data.message, data.status));
                    $('#dispatchErrMsg').fadeOut(3000);

                } else {
                    $('#dispatchErrMsg').show();
                    $('#dispatchErrMsg').html(alertMess(data.message, data.status));
                    $('#sacs_data').val('');
                    $('#facs_data').val('');
                    $('#sacs_data, #facs_data').change();
                }
            }
        });
        return false;
    } else if (disp == 'RWH' && rwh != '' && rwh != 0) {
        $.ajax({
            type: "POST",
            url: post_url,
            data: {
                'csrf_imsnaco': get_csrf_cookie(),
                'type': disp,
                'loc_id': rwh,
                'noa': noa
            },
            dataType: "json",
            cache: false,
            success: function(data) {
                if (data.status == 'success') {
                    var jsonConsign = [];
                    var jsonBArr = {};
                    var jsonSArr = {};
                    jsonBArr['type'] = 'BILL';
                    jsonBArr['is_ship'] = 'NO';
                    jsonBArr['loc_type'] = 'SACS';
                    jsonBArr['loc_id'] = data.result.billto_id;
                    jsonConsign.push(jsonBArr);
                    jsonSArr['type'] = 'SHIP';
                    jsonSArr['is_ship'] = 'YES';
                    jsonSArr['loc_type'] = 'RWH';
                    jsonSArr['loc_id'] = rwh;
                    jsonConsign.push(jsonSArr);
                    $('#d_consignee').val(JSON.stringify(jsonConsign));
                    $('#billToName').html(data.result.billName);
                    $('#billToAdd').html(data.result.billto);
                    $('#shipToName').html(data.result.shipName);
                    $('#shipToAdd').html(data.result.shipto);
                    $('#dtl_billToName').html(data.result.billName);
                    $('#dtl_billToAdd').html(data.result.billto);
                    $('#dtl_shipToName').html(data.result.shipName);
                    $('#dtl_shipToAdd').html(data.result.shipto);
                    $('#consigneeData').attr('sacsid', sacs);
                    $('#consigneeData').attr('locid', rwh);
                    $('#consigneeData').attr('dispto', disp);
                    $('#shipToCons').removeClass('hidden');
                    $('#consignee_dtl').addClass('hidden');
                    $('#billToSACS').removeClass('hidden');
                    $('#shipToCons').removeClass('hidden');
                    if (isBatch == 'Y') {
                        $('#prod_detail_box').removeClass('hidden');
                    }
                    if (checkProd()) {
                        $('#proceedDisp').removeClass('hidden');
                    } else {
                        $('#proceedDisp').addClass('hidden');
                    }

                    $('#dispatchErrMsg').show();
                    $('#dispatchErrMsg').html(alertMess(data.message, data.status));
                    $('#dispatchErrMsg').fadeOut(3000);

                } else {
                    $('#dispatchErrMsg').show();
                    $('#dispatchErrMsg').html(alertMess(data.message, data.status));
                    $('#sacs_data').val('');
                    $('#rwh_data').val('');
                    $('#sacs_data, #rwh_data').change();
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
function changeProdSchedule() {
    $('#billToSACS').addClass('hidden');
    $('#shipToCons').addClass('hidden');
    $('#consignee_dtl').addClass('hidden');
    $('#prodSelection').removeClass('hidden');
    $('#lotSelection').addClass('hidden');
    $('#prodSchedData').addClass('hidden');
    var prod = $('#prodDetail').attr('prodId');
    delProdDetail(prod);
    $('#proceedDisp').addClass('hidden');

    $('#prod_data').find('option').prop('disabled', false);
    $('#prod_data').val('');
    apply_select2_delay($('#prod_data'), 'Select Product');
    
    $('#schedule_data').empty();
    $('#schedule_data').append(new Option('Select Schedule', ''));
}
function changeDispSchedule() {
    $('#prodSelection').removeClass('hidden');
    $('#lotSelection').addClass('hidden');
    $('#prodSchedData').addClass('hidden');
    $('#changeProdDetail').addClass('hidden');
    var prod = $('#prodDetail').attr('prodId');
    delProdDetail(prod);
    $('#proceedDisp').addClass('hidden');

    $('#product_data').find('option').prop('disabled', false);
    $('#noa_detail').empty();
    $('#noa_detail').append(new Option('Select NOA', ''));
    $('#product_data, #noa_detail').val('');
    apply_select2_delay($('#product_data'), 'Select Product');
    apply_select2_delay($('#noa_detail'), 'Select NOA');
}
function changeProdConsignee() {
    $('#billToSACS').addClass('hidden');
    $('#shipToCons').addClass('hidden');
    $('#consignee_dtl').removeClass('hidden');
}
function changeDispConsignee() {
    $('#billToSACS').addClass('hidden');
    $('#shipToCons').addClass('hidden');
    $('#consignee_dtl').removeClass('hidden');
    $('#prodDetailArea').addClass('hidden');
    $('#prodSchedData').addClass('hidden');
    $('#lotSelection').addClass('hidden');
    $('#prod_detail_box').addClass('hidden');
    $('#prodSelection').removeClass('hidden');
    $('#proceedDisp').addClass('hidden');
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
function selectBatch() {
    var prod = $('#prodDetail').attr('prodId');
    var ele = $('#batch_detail_' + prod);
    showPopBox(ele);
}
function activeRemoveBatch() {
    $(".remove-batch").click(function(e) {
        e.preventDefault();
        var prod = $(this).attr('prod');
        var pEl = $(this).parent().parent();
        var batch_id = pEl.find('#batch_id_' + prod).val();
        pEl.remove();
        $('#bt' + prod + 'select_' + batch_id).removeClass('hidden');
        setTotal(prod);
    });
}
function addBatch(bid, bno, md, ed) {
    var prod = $('#prodDetail').attr('prodId');
    var trow = '<tr class="batchRow"><input class="batch_id" id="batch_id_' + prod + '" name="batch[' + prod + '][]" prod="' + prod + '" type="hidden" value="' + bid + '" /><td class="bt_no">' + bno + '</td><td class="bt_md">' + md + '</td><td class="bt_ed">' + ed + '</td><td><input type="text" name="batchQty[' + prod + '][]" id="tempBatchQty_' + prod + '" class="form-control batchQty" valid="int" prod="' + prod + '" value="" /></td><td><a href="javascript:void(0)" class="remove-batch text-danger" prod="' + prod + '"><i class="fa fa-remove fa-2x"></i></a></td></tr>';
    $('#batchTab').prepend(trow);
    $('#bt' + prod + 'select_' + bid).addClass('hidden');
    $('#tempBatchQty_' + prod).focus();
    $('.popBox').hide();
    $('#overlay').hide();
    activeRemoveBatch();
    batchProdQty();
    tempbatchQty();
    initUtilFunctions();
}
function batchProdQty() {
    $('.batchQty').on("keyup paste", function() {
        var prod = $('#prodDetail').attr('prodId');
        setTimeout(function() {
            setTotal();
        }, 100); //Paste event doesn't work without setTimeout
    });
}
function tempbatchQty() {
    $('#dispatch_qty').on("keyup paste", function() {
        var prod = $('#prodDetail').attr('prodId');
        $('#tempBatchQty_' + prod).val($(this).val());
        setTimeout(function() {
            setTotal();
        }, 100); //Paste event doesn't work without setTimeout
    });
}
function setTotal() {
    qty_error = false;
    qty = 0;
    var currQty = $('#pend_qty').html();
    $(".batchRow").each(function() {
        ob = $(this);
        qty = qty + getNumValue(ob.find('input.batchQty').val())
    });
    $('#totProdQty').html(qty);
    if (currQty >= qty) {
        $('#totProdQty').removeClass('danger').addClass('success');
    } else {
        $('#totProdQty').removeClass('success').addClass('danger');
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
    var batch_err = true;
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
            $(this).change();
        }
    });
    $('#dispatch_date').datepicker({
        dateFormat: "dd M yy",
        minDate: '-7D',
        maxDate: '+7D',
        onSelect: function(date) {
            $('#delivery_date').datepicker('option', 'minDate', date);
            $(this).change();
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

//EOF