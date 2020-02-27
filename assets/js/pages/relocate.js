/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function() {
    $('#approveRelocaton').click(function() {
        showPopBox($('#approve_detail'));
    });
    $('#rejectRelocaton').click(function() {
        if (validRemark()) {
            showPopBox($('#reject_detail'));
        }
    });
    $('.closePopUp, .cancelRelocate').click(function() {
        $('.popBox').hide();
        $('#overlay').hide();
    });
    $('.actionRequest').click(function() {
        var action = $(this).attr('action');
        var remark = $('#remarks').val();
        var dispatch_id = $('#stnData').attr('dispid');
        var loc_id = $('#stnData').attr('sendid');
        var consignee_id = $('#stnData').attr('consigneeid');
        var indent = $('#stnData').attr('indent');
        var ship=$('#stnData').attr('shipto');
        $.ajax({
            type: "POST",
            url: SITE_URL + 'dispatch/relocateRequestAction',
            data: {
                'csrf_imsnaco': get_csrf_cookie(),
                'disp': dispatch_id,
                'action': action,
                'loc': loc_id,
                'consignee': consignee_id,
                'indent_num':indent,
                'ship':ship,
                'remark': remark
            },
            dataType: "json",
            cache: false,
            success: function(data) {
                if (data.status == 'success') {
                    window.location.replace(data.rUrl);
                } else {
                    $('#remarkErrMsg').show();
                    $('#remarkErrMsg').html(alertMess(data.message, data.status));
                }
            }
        });
        return false;

    });
});

function validRemark() {
    if ($('#remarks').val() == '') {
        $('#remarkErrMsg').show();
        $('#remarkErrMsg').html(alertMess("Please provide some Remarks", "error"));
        $('#remarkErrMsg').fadeOut(4000);
        return false;
    }
    return true;
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


