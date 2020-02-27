/* 
 * Js call for Stock adjust 
 */
$(document).ready(function() {
    $('.closePopUp').click(function() {
        $('.popBox').hide();
        $('#overlay').hide();
    });

    $('#updatedd').on('change', function() {
        var val = $(this).val();
        reasonUpdate(val);
    });

    var batch_no_error = false;
    $("#fac_adjust_qty").on("keyup paste", function() {
        ob = $(this);
        batch_no = ob.val();
        var allowed = /^[0-9]+$/;
        batch_no_error = false;
        ob.parent().find(".invalid-chars").remove();

        /*if (batch_no && !allowed.test(batch_no)) {
         batch_no_error = true;
         ob.parent().append('<p class="text-danger invalid-chars">Only Digits allowed!</p>');
         }*/
        if ((parseInt($('#fac_cur_stk').val()) < parseInt($('#fac_adjust_qty').val())) && batch_no_error == false && parseInt($('#updatedd').val()) != 1) {
            batch_no_error = true;
            ob.parent().append('<p class="text-danger invalid-chars">Quantity should be less than Current Stock</p>');
        }
        if ($('#updatedd').val() == '3') {
            $('#fac_adjust_qty').val($('#fac_cur_stk').val());
            ob.parent().find(".invalid-chars").remove();
        }

    });

    $('#confirmAdjust').click(function() {
        $(this).addClass('disabled');
        $("#stockAdjustForm").submit();
    });
    $('#stockAdjustForm').validator().on('submit', function(e) {
        if (e.isDefaultPrevented()) {
            $('#adjustErrMsg').show();
            $('#adjustErrMsg').html(alertMess('Please check the errors below.', 'error'));
            $('#adjustErrMsg').fadeOut(4000);
            $('#confirmAdjust').removeClass('disabled');
        } else {
            var adjustAction = $('#updatedd').val();
            var adjustReason = $('#adjust_reason').val();
            var adjustQty = $('#fac_adjust_qty').val();
            var inventory_id = $('#fac_inventory_id').val();
            var invent_detail_id = $('#fac_invent_detail_id').val();
            var fac_cur_stk = $('#fac_cur_stk1').val();
            var d_postURL = $('#d_postURL').val();
            var locfrom = $('#locfrom').val();
            var remark = $('#fac_remark').val();
            $.ajax({
                type: "POST",
                url: d_postURL,
                data: {
                    'csrf_imsnaco': get_csrf_cookie(),
                    'adjust_action': adjustAction,
                    'adjust_reason': adjustReason,
                    'adjust_qty': adjustQty,
                    'inventory_id': inventory_id,
                    'invent_detail': invent_detail_id,
                    'cur_stock': fac_cur_stk,
                    'locfrom': locfrom,
                    'remark': remark,
                },
                dataType: "json",
                cache: false,
                success: function(data) {
                    if (data.status == 'warning') {
                        $('#adjustErrMsg').show();
                        $('#adjustErrMsg').html(alertMess(data.message, data.status));
                        $('#confirmAdjust').removeClass('disabled');
                    } else if (data.status == 'error') {
                        $('#adjustErrMsg').html('');
                        $('#adjustErrMsg').show();
                        $.each(data.message, function(k, v) {
                            $('#adjustErrMsg').append(alertMess(v, data.status));
                        });
                        $('#confirmAdjust').removeClass('disabled');
                    } else {
                        window.location.replace(data.rUrl);
                    }
                }
            });
            return false;
        }
    });

    $("#fac_return_qty").on("keyup paste", function() {
        ob = $(this);
        ob.parent().find(".invalid-chars").remove();
        if (parseInt($('#fac_cur_stkR').val()) < parseInt($('#fac_return_qty').val())) {
            batch_no_error = true;
            ob.parent().append('<p class="text-danger invalid-chars">Quantity should be less than Current Stock</p>');
        }
    });
    $("#fac_adjust_qtyC").on("keyup paste", function() {
        ob = $(this);
        //batch_no = ob.val();
        var allowed = /^[0-9]+$/;
        batch_no_error = false;
        ob.parent().find(".invalid-chars").remove();
        if ((parseInt($('#fac_cur_stkC').val()) < parseInt($('#fac_adjust_qtyC').val())) && batch_no_error == false) {
            batch_no_error = true;
            ob.parent().append('<p class="text-danger invalid-chars">Quantity should be less than Current Stock</p>');
        }
    });
    $('#confirmConsume').click(function() {
        $(this).addClass('disabled');
        $("#stockConsumeForm").submit();
    });
    $('#stockConsumeForm').validator().on('submit', function(e) {
        if (e.isDefaultPrevented()) {
            $('#consumeErrMsg').show();
            $('#consumeErrMsg').html(alertMess('Please check the errors below.', 'error'));
            $('#consumeErrMsg').fadeOut(4000);
            $('#confirmConsume').removeClass('disabled');
        } else {
            var adjustAction = $('#updateddC').val();
            var adjustQty = $('#fac_adjust_qtyC').val();
            var inventory_id = $('#fac_inventory_idC').val();
            var invent_detail_id = $('#fac_invent_detail_idC').val();
            var fac_cur_stk = $('#fac_cur_stk1C').val();
            var d_postURL = $('#d_postURLC').val();
            var locfrom = $('#locfromC').val();
            var linkArt = $('#linkArt').val();
            var isLinkART = $('#isLinkArt').val();
            var isLab = $('#isLab').val();
            var remark = $('#fac_remarkC').val();
            $.ajax({
                type: "POST",
                url: d_postURL,
                data: {
                    'csrf_imsnaco': get_csrf_cookie(),
                    'adjust_action': adjustAction,
                    'adjust_qty': adjustQty,
                    'inventory_id': inventory_id,
                    'invent_detail': invent_detail_id,
                    'cur_stock': fac_cur_stk,
                    'locfrom': locfrom,
                    'linkArt': linkArt,
                    'isLinkART': isLinkART,
                    'isLab': isLab,
                    'remark': remark,
                },
                dataType: "json",
                cache: false,
                success: function(data) {
                    if (data.status == 'warning') {
                        $('#consumeErrMsg').show();
                        $('#consumeErrMsg').html(alertMess(data.message, data.status));
                        $('#confirmConsume').removeClass('disabled');
                    } else if (data.status == 'error') {
                        $('#consumeErrMsg').html('');
                        $('#consumeErrMsg').show();
                        $.each(data.message, function(k, v) {
                            $('#consumeErrMsg').append(alertMess(v, data.status));
                        });
                        $('#confirmConsume').removeClass('disabled');
                    } else {
                        window.location.replace(data.rUrl);
                    }
                }
            });
            return false;
        }
    });
    $('#confirmReturn').click(function() {
        $(this).addClass('disabled');
        $("#stockReturnForm").submit();
    });
    $('#stockReturnForm').validator().on('submit', function(e) {
        if (e.isDefaultPrevented()) {
            $('#returnErrMsg').show();
            $('#returnErrMsg').html(alertMess('Please check the errors below.', 'error'));
            $('#returnErrMsg').fadeOut(4000);
            $('#confirmReturn').removeClass('disabled');
        } else {
            var returnQty = $('#fac_return_qty').val();
            var inventory_id = $('#fac_inventory_idR').val();
            var invent_detail_id = $('#fac_invent_detail_idR').val();
            var fac_cur_stk = $('#fac_cur_stk1R').val();
            var d_postURL = $('#d_postURLR').val();
            var locfrom = $('#locfromR').val();
            var linkArt = $('#linkArt').val();
            var isLinkART = $('#isLinkArt').val();
            $.ajax({
                type: "POST",
                url: d_postURL,
                data: {
                    'csrf_imsnaco': get_csrf_cookie(),
                    'return_qty': returnQty,
                    'inventory_id': inventory_id,
                    'invent_detail': invent_detail_id,
                    'cur_stock': fac_cur_stk,
                    'locfrom': locfrom,
                    'linkArt': linkArt,
                    'isLinkART': isLinkART,
                },
                dataType: "json",
                cache: false,
                success: function(data) {
                    if (data.status == 'warning') {
                        $('#returnErrMsg').show();
                        $('#returnErrMsg').html(alertMess(data.message, data.status));
                        $('#confirmReturn').removeClass('disabled');
                    } else if (data.status == 'error') {
                        $('#returnErrMsg').html('');
                        $('#returnErrMsg').show();
                        $.each(data.message, function(k, v) {
                            $('#returnErrMsg').append(alertMess(v, data.status));
                        });
                        $('#confirmReturn').removeClass('disabled');
                    } else {
                        window.location.replace(data.rUrl);
                    }
                }
            });
            return false;
        }
    });

});

function reasonUpdate(val) {
    var i = 0;
    var selectedval = '';
    if (val) {
        $.ajax({
            type: "POST",
            url: SITE_URL + "product/ajax_batch_adjust_reason/",
            data: {id: val, csrf_imsnaco: get_csrf_cookie()},
            dataType: "json",
            cache: false,
            success: function(response) {
                $('#adjust_reason').empty();
                $('#adjust_reason').append(new Option('Select', ''));
                $.each(response.actiondd, function(index, value) {
                    $('#adjust_reason').append(new Option(value, index));
                    i++;
                    selectedval = index;
                });
                if (i == 1) {
                    $('#adjust_reason').val(selectedval);
                }
            }
        });
    } else {
        $('#adjust_reason').empty();
        $('#adjust_reason').append(new Option('Select', ''));
    }
}

function selectAdjust(batch, InventoryId, batchtype, calltype) {
    var i = 0;
    var selectedval = '';
    var ele = $('#adjustStock');
    if (batch) {
        $.ajax({
            type: "POST",
            url: SITE_URL + "product/ajax_batch_pro_adjust/",
            data: {id: batch, inventory_id: InventoryId, batchtype: batchtype, calltype: calltype, csrf_imsnaco: get_csrf_cookie()},
            dataType: "json",
            cache: false,
            success: function(response) {
                $('#fac_cur_stk').val(response.currentStock);
                $('#fac_cur_stk1').val(response.currentStock);
                $('#fac_inventory_id').val(InventoryId);
                $('#fac_invent_detail_id').val(batch);
                $('#adjust_reason').empty();
                $('#adjust_reason').append(new Option('Select', ''));
                $('#updatedd').empty();
                $('#updatedd').append(new Option('Select', ''));
                $.each(response.actiondd, function(index, value) {
                    $('#updatedd').append(new Option(value, index));
                    i++;
                    selectedval = index;
                });
                if (i == 1) {
                    $('#updatedd').val(selectedval);
                    reasonUpdate(selectedval);
                }
                if (batchtype == 'Expired') {
                    $('#fac_adjust_qty').val(response.currentStock);
                }
                showPopBox(ele);
            }
        });
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

function showConfirmpopup(action) {
    if (action == 'adjustbtn') {
        if ($('#updatedd').val() != '' && $('#adjust_reason').val() != '' && $('#fac_adjust_qty').val() != '') {
            $('.afteradjust').removeClass('hidden');
            $('.adjustbtn').addClass('hidden');
        }
    } else if (action == 'cancel') {
        $('.adjustbtn').removeClass('hidden');
        $('.afteradjust').addClass('hidden');
    } else if (action == 'consumebtn') {
        $('.afterconsume').removeClass('hidden');
        $('.consumebtn').addClass('hidden');
        $("#confirmConsume").removeAttr('disabled');
    } else if (action == 'consumecancel') {
        $('.afterconsume').addClass('hidden');
        $('.consumebtn').removeClass('hidden');
    } else if (action == 'returnbtn') {
        $('.afterReturn').removeClass('hidden');
        $('.returnbtn').addClass('hidden');
        $("#confirmReturn").removeAttr('disabled');
    } else if (action == 'returncancel') {
        $('.afterReturn').addClass('hidden');
        $('.returnbtn').removeClass('hidden');
    }
    return false;
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

function selectConsume(batch, InventoryId, batchtype, calltype) {
    var ele = $('#consumeStock');
    var linkArt = $('#isLinkArt').val();
    if (batch) {
        $.ajax({
            type: "POST",
            url: SITE_URL + "product/ajax_batch_pro_adjust/",
            data: {id: batch, inventory_id: InventoryId, batchtype: batchtype, calltype: calltype, linkArt: linkArt, csrf_imsnaco: get_csrf_cookie()},
            dataType: "json",
            cache: false,
            success: function(response) {
                $('#fac_cur_stkC').val(response.currentStock);
                $('#fac_cur_stk1C').val(response.currentStock);
                $('#fac_inventory_idC').val(InventoryId);
                $('#fac_invent_detail_idC').val(batch);
                $('#updateddC').empty();
                $('#updateddC').append(new Option('Select', ''));
                $.each(response.actiondd, function(index, value) {
                    $('#updateddC').append(new Option(value, index));
                });
                showPopBox(ele);
            }
        });
    }
}
function selectReturn(batch, InventoryId, currStock, calltype) {
    var ele = $('#returnStock');
    $('#fac_cur_stkR').val(currStock);
    $('#fac_cur_stk1R').val(currStock);
    $('#fac_inventory_idR').val(InventoryId);
    $('#fac_invent_detail_idR').val(batch);
    showPopBox(ele);
}

