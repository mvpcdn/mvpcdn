/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



$(document).ready(function() {
    $('#indentRequestForm').validator().on('submit', function(e) {
        if (e.isDefaultPrevented()) {
            $('#indentReqErr').show();
            $('#indentReqErr').html(alertMess('Please check the errors below.', 'error'));
            $('#indentReqErr').fadeOut(4000);
        } else {
            var productID = $('#productName').val();
            var requested_delivery_date = $('#requested_delivery_date').val();
            var indentReason = $('#indentReason').val();
            var qty_requested = $('#qty_requested').val();

            $.ajax({
                type: "POST",
                url: SITE_URL + 'fascinvproduct/savedetail',
                data: {
                    'csrf_imsnaco': get_csrf_cookie(),
                    'qty_requested': qty_requested,
                    'productID': productID,
                    'requested_delivery_date': requested_delivery_date,
                    'indentReason': indentReason
                },
                dataType: "json",
                cache: false,
                success: function(data) {
                    if (data.status == 'success') {
                        window.location.replace(data.rUrl);

                    } else if (data.status == 'error') {
                        $('#indentReqErr').html(alertMess(data.message, data.status));
                        $('#indentReqErr').removeClass('hidden');
                        $.each(data.message, function(k, v) {
                            $('#indentReqErr').append(alertMess(v, data.status));
                        });
                    } else {
                        window.location.replace(data.rUrl);
                    }
                }
            });
            return false;
        }
    }
    )
});

$(document).ready(function() {
    $("#requested_delivery_date").datepicker({
        dateFormat: "dd M yy",
        minDate: 0
    });
});


function load()
{
    //  alert($("#productName").val());
    if ($("#productName").val()) {

        $.ajax({
            type: 'POST',
            url: SITE_URL + 'fascinvproduct/productInventoryDetail',
            data: {'productID': $("#productName").val(), 'csrf_imsnaco': get_csrf_cookie()},
            dataType: "json",
            cache: false,
        }).done(function(data) {
            // show the response
            if (data.status == "success") {
                $("#balQuantity").text(data.stock[0].in_stock);
                $("#lastReqDate").text(data.lastData[0].created);
                $("#indentNumber").text(data.lastData[0].indent_num);
                $("#appQuantity").text(data.lastData[0].approved_qty);
                $('#product_name').text(data.productName);
                $('#hiddenform').show();
                $('#product_select').addClass('hidden');
            } else if (data.status == "nostock") {
                $('#product_name').text(data.productName);
                $("#balQuantity").text("0");
                $("#lastReqDate").text(data.lastData[0].created);
                $("#indentNumber").text(data.lastData[0].indent_num);
                $("#appQuantity").text(data.lastData[0].approved_qty);
                $('#hiddenform').show();
                $('#product_select').addClass('hidden');
            } else if (data.status == "nolastdata") {
                $('#product_name').text(data.productName);
                $("#balQuantity").text(data.stock[0].in_stock);
                $("#lastReqDate").text("N/A");
                $("#indentNumber").text("N/A");
                $("#appQuantity").text("N/A");
                $('#hiddenform').show();
                $('#product_select').addClass('hidden');
                $('#previousrecord').addClass('hidden');
                $('#norequest').removeClass('hidden');
            } else if (data.status == "nodata") {
                $('#product_name').text(data.productName);
                $("#balQuantity").text("0");
                $("#lastReqDate").text("N/A");
                $("#indentNumber").text("N/A");
                $("#appQuantity").text("N/A");
                $('#hiddenform').show();
                $('#product_select').addClass('hidden');
                $('#previousrecord').addClass('hidden');
                $('#norequest').removeClass('hidden');
            } else {
                $('#indentReqErr').removeClass('hidden');
                if (data.status == 'warning') {
                    $('#indentReqErr').html(alertMess(data.message, data.status));
                } else {
                    $('#indentReqErr').html('');
                    $.each(data.message, function(k, v) {
                        $('#indentReqErr').append(alertMess(v, data.status));
                    });
                }

            }
        }
        ).fail(function() {
            // just in case posting your form failed
            alert("Posting failed.");
        });


    } else {
        $('#hiddenform').hide();
    }

}

$("#productName").change(function() {
    load();
    if ($(this).val()) {
        $(this).prop('disabled', true);
    }
});

$(".change-pro").click(function() {
    $("#productName").prop('disabled', false);
    $('#product_select').removeClass('hidden');

});
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

