$(document).ready(function() {
    $('#miniMasterForm').validator().on('submit', function(e) {
        if (e.isDefaultPrevented()) {
            $('#dataErrMess').show();
            $('#dataErrMess').html(alertMess('Please check the errors below.', 'error'));
            $('#dataErrMess').fadeOut(4000);
            $('#saveaction').removeClass('disabled');
        } else {
            jsonObj = {};
            $('.newval').each(function() {
                var key = $(this).attr('id');
                var value = $(this).val();
                jsonObj[key] = value;
            });
            var jsonString = JSON.stringify(jsonObj);
            var d_postURL = $('#postUrl').val();
            $.ajax({
                type: "POST",
                url: d_postURL,
                data: {
                    'csrf_imsnaco': get_csrf_cookie(),
                    pdata: jsonString,
                },
                dataType: "json",
                cache: false,
                success: function(data) {
                    if (data.status == 'warning') {
                        $('#dataErrMess').show();
                        $('#dataErrMess').html(alertMess(data.message, data.status));
                        $('#saveaction').removeClass('disabled');
                        $('#dataErrMess').fadeOut(4500);
                    } else if (data.status == 'error') {
                        $('#dataErrMess').html('');
                        $('#dataErrMess').show();
                        $.each(data.message, function(k, v) {
                            $('#dataErrMess').append(alertMess(v, data.status));
                        });
                        $('#saveaction').removeClass('disabled');
                    } else {
                        window.location.replace(data.rUrl);
                    }
                }
            });
            return false;
        }
    });
    $('#saveaction').on("click", function() {
        $(this).addClass('disabled');
        $("#miniMasterForm").submit();
    });
    $('.closePopUp, .closePop').click(function() {
        $('.popBox').hide();
        $('#overlay').hide();
    });
});
function addNewData(head) {
    $('#dataValueBox .panel-title').html(head);
    $('#dataValueBox').css('width', '25%');
    var ele = $('#dataValueBox');
    showPopBox(ele);
    $('.newval').val('');
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
