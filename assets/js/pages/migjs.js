
function editrow(row) {
    $('#row_' + row).addClass('warning');
    $('#batch_qty_' + row).show();
    $('#save_' + row).show();
    $('#change_' + row).show();
    $('#qty_' + row).hide();
    $('#edit_' + row).hide();
}
function saverow(row) {
    $('#row_' + row).removeClass('warning');
    $('#batch_qty_' + row).hide();
    $('#save_' + row).hide();
    $('#change_' + row).hide();
    $('#qty_' + row).show();
    $('#edit_' + row).show();
}
$('.batch_qty').on("keyup paste", function() {
    var row = $(this).attr('key');
    var qty = $(this).val() != '' ? $(this).val() : 0;
    $('#qty_' + row).html(qty);
    setTimeout(function() {
        setTotal();
    }, 100); //Paste event doesn't work without setTimeout
});
function ckbatchqty() {
    $('.batch_qty').on("keyup paste", function() {
        var row = $(this).attr('key');
        var qty = $(this).val() != '' ? $(this).val() : 0;
        $('#qty_' + row).html(qty);
        setTimeout(function() {
            setTotal();
        }, 100); //Paste event doesn't work without setTimeout
    });
}
function setTotal() {
    qty_error = false;
    qty = 0;
    var currQty = $('#tot_qty').html();
    $(".batch_qty").each(function() {
        ob = $(this);
        qty = qty + getNumValue(ob.val());
    });
    $('#tot_qty').html(qty);
}
function addBatch(bid, bno, md, ed) {
    var row = $('#batch_detail').attr('key');
    var type = $('#batch_detail').attr('type');
    var batch = $('#batch_detail').attr('batch');
    var prod = $('#batch_detail').attr('prodname');
    if (type == 'change') {
        $('#batch_id_' + row).val(bid);
        $('#batchno_' + row).html(bno);
        $('#md_' + row).html(md);
        $('#ed_' + row).html(ed);
        $('#btselect_' + batch).removeClass('hidden');
    } else {
        $('#batch_detail').attr('batch', bid);
        var rowlen = $('.batchRow').length + 1;
        var trow = '<tr id="row_' + rowlen + '" class="batchRow warning">';
        trow += '<td>' + (rowlen + 1) + '.<input type="hidden" class="mig_id" value=""></td>';
        trow += '<td class="tdw350">' + prod + '<input type="hidden" class="batch_id" id="batch_id_' + rowlen + '" value="' + bid + '"</td>';
        trow += '<td class="tdw350"><span id="batchno_' + rowlen + '">' + bno + '</span><a id="change_' + rowlen + '" class="pull-right text-danger" href="javascript:void(0)" onclick="changeBatch(' + rowlen + ')">Change Batch</a></td>';
        trow += '<td id="ed_' + rowlen + '">' + ed + '</td>';
        trow += '<td class="tdw150"><span id="qty_' + rowlen + '" style="display:none;">0</span><input type="text" valid="int" class="form-control batch_qty" key="' + rowlen + '" id="batch_qty_' + rowlen + '" value=""></td>';
        trow += '<td class="text-center"><a href="javascript:void(0)" class="btn btn-danger btn-sm edit" id="edit_' + rowlen + '" onclick="editrow(' + rowlen + ')" style="display:none;"><i class="fa fa-edit"></i> &nbsp; EDIT STOCK</a><a href="javascript:void(0)" class="btn btn-success btn-sm save" id="save_' + rowlen + '" onclick="saverow(' + rowlen + ')"><i class="fa fa-save"></i> &nbsp; CONFIRM</a></td>';
        trow += '</tr>';
        $('#batchtab').append(trow);
        $('#batch_qty_' + rowlen).focus();
        ckbatchqty();
    }
    $('#btselect_' + bid).addClass('hidden');
    $('#nobatch').addClass('hidden');
    $('#batchtot').removeClass('hidden');
    $('#noStock').addClass('hidden');
    $('#migratebtn').removeClass('hidden');
    $('.popBox').hide();
    $('#overlay').hide();
}
function addNewBatch() {
    var ele = $('#batch_detail');
    ele.attr('type', 'add');
    showPopBox(ele);
}
function changeBatch(row) {
    var batch = $('#batch_id_' + row).val();
    var ele = $('#batch_detail');
    ele.attr('key', row);
    ele.attr('batch', batch);
    ele.attr('type', 'change');
    showPopBox(ele);
}
$('#goBackbtn').click(function() {
    showPopBox($('#closeMig'));
});
$('#noStock').click(function() {
    showPopBox($('#noStockMig'));
});
$('#migratebtn').click(function() {
    if ($('.save').is(":visible")) {
        showPopBox($('#saveMig'));
    } else {
        showPopBox($('#confirmMig'));
    }
});
$('#completeMig').click(function() {
    $(this).addClass('disabled');
    var pUrl = $(this).attr('pUrl');
    jsonObj = [];
    var prod = $('#batch_detail').attr('prod');
    $('.batchRow').each(function() {
        var data = {};
        var mig_id = $(this).find('.mig_id').val();
        var batch_id = $(this).find('.batch_id').val();
        var batch_qty = $(this).find('.batch_qty').val();
        data['product_id'] = prod;
        data['mig_id'] = mig_id;
        data['batch_id'] = batch_id;
        data['qty'] = batch_qty;
        jsonObj.push(data);
    });
    var jsonString = JSON.stringify(jsonObj);
    $.ajax({
        type: "POST",
        url: pUrl,
        data: {
            'csrf_imsnaco': get_csrf_cookie(),
            'prod': prod,
            'pdata': jsonString
        },
        dataType: "json",
        cache: false,
        success: function(data) {
            if (data.status == 'error') {
                $('#migErrMsg').removeClass('hidden');
                $('#migErrMsg').html(alertMess(data.message, data.status));
                $('#completeMig').removeClass('disabled');
                $('.popBox').hide();
                $('#overlay').hide();
            } else {
                window.location.replace(data.rUrl);
            }
        }
    });
    return false;
});
$('#noInvMig').click(function() {
    $(this).addClass('disabled');
    var pUrl = $(this).attr('pUrl');
    jsonObj = [];
    var prod = $('#batch_detail').attr('prod');
    var data = {};
    var batch_id = $('.batchList').attr('id');
    if (!batch_id) {
        batch_id = 1;
    }
    data['product_id'] = prod;
    data['mig_id'] = '';
    data['batch_id'] = batch_id;
    data['qty'] = 0;
    jsonObj.push(data);
    var jsonString = JSON.stringify(jsonObj);
    $.ajax({
        type: "POST",
        url: pUrl,
        data: {
            'csrf_imsnaco': get_csrf_cookie(),
            'prod': prod,
            'pdata': jsonString
        },
        dataType: "json",
        cache: false,
        success: function(data) {
            if (data.status == 'error') {
                $('#migErrMsg').removeClass('hidden');
                $('#migErrMsg').html(alertMess(data.message, data.status));
                $('#completeMig').removeClass('disabled');
                $('.popBox').hide();
                $('#overlay').hide();
            } else {
                window.location.replace(data.rUrl);
            }
        }
    });
    return false;
});

$('.closePopUp, .closePop').click(function() {
    $('.popBox').hide();
    $('#overlay').hide();
});
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

