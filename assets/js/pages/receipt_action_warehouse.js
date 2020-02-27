var change_batch_btn_obj;
var batch_no_error=false;

/** Functions **/
function validate_receive_form(){
    n=$('.qty_received').filter(function(){return !($(this).val() || $(this).val()===0);}).length;   
    if(n>0) return 'Some received quantity field(s) are empty';

    return false;
}

function generate_receipt_detail(){
    var dtl={qty_match:'Y', is_damaged:'N', pro:[]};
    var q_match=1;
    var damaged=0;
    $(".pro-bx").each(function(){
        var damaged_flg=0;
        
        ob=$(this);
        total_qty=getNumValue(ob.find('.total_qty').text());
        pro_id=ob.attr('pro-id');
        pro_arr={pro_id:pro_id, total_qty:0, git_qty:0, qty_match:'Y', is_damaged:'N', batches:[]};
        
        tq=0;
        ob.find('.pro_batch_id').each(function(){
            batch_id=$(this).val();
            pob=$(this).parent().parent();
            b={batch_id:batch_id, exp_qty:0, rec_qty:0, damaged_qty:0};
            
            if(parseInt(pob.find('.qty_damaged').val())){
                damaged_flg=1;
            }
            b.exp_qty=getNumValue(pob.find('.qty_exp').val());
            b.rec_qty=getNumValue(pob.find('.qty_received').val());
            b.damaged_qty=getNumValue(pob.find('.qty_damaged').val());
            
            pro_arr.batches.push(b);
            
            tq=tq+b.rec_qty;
        });
        
        pro_arr.total_qty=tq;
        if(total_qty!=tq){
            qty_match_flg=0;
            pro_arr.git_qty=total_qty-tq;
            pro_arr.qty_match='N';
            q_match=0;
        }
        
        if(damaged_flg==1){
            pro_arr.is_damaged='Y';
            damaged=1;
        }
        
        dtl.pro.push(pro_arr);
    });
    
    if(q_match==0)
        dtl.qty_match='N';
    if(damaged==1)
        dtl.is_damaged='Y';
    
    return dtl;
}

function init_qty_change_event(){
    $(".qty_received").keyup(function(){
        p=$(this).parent().parent();
        t=getNumValue(p.closest('.pro-bx').find('.total_qty').text());
        rq=0;
        p.parent().find('.qty_received').each(function(){
            rq=rq+getNumValue($(this).val());
        });

        if(rq>t){
            $(this).val(t-(rq-getNumValue($(this).val())));
            p.closest(".pro-bx").find(".rec-qty-err .alert").text("Received quantity can't be more than sent quantity.");
            p.closest(".pro-bx").find(".rec-qty-err").fadeIn().delay(2000).fadeOut('slow');
        }
        
        dm=getNumValue(p.find('.qty_damaged').val());
        if(dm>$(this).val()){
            p.find('.qty_damaged').val($(this).val());
        }
    });
}

function init_damaged_qty_change_event(){
    $(".qty_damaged").keyup(function(){
        var dq=getNumValue($(this).val());
        p=$(this).parent().parent();
        var q=getNumValue(p.find('.qty_received').val());
        if(dq>q){
            $(this).val(q);
             p.closest(".pro-bx").find(".rec-qty-err .alert").text("Damaged quantity can't be more than received quantity.");
             p.closest(".pro-bx").find(".rec-qty-err").fadeIn().delay(2000).fadeOut('slow');
        }
    });
}

/** Events **/
$(".receive-btn").click(function(){
    if(msg=validate_receive_form()){
        bootbox.alert({title:'Error', message: msg, buttons: {'ok': {label:'Close', className:'btn btn-danger'}}});
        return;
    }
    /** **/
    $("#rec_remarks").hide();
    $(".rec_remarks_text").html($("#rec_remarks").val()).show();
    
    $(".rec-ctrl").hide();
    $(".confirm-rec-ctrl").show();
    $(".qty_received, .qty_damaged").addClass("no-bdr");
    $(".sel-batch-bx").hide();
});

$(".confirm-rec-btn").click(function(){
    receipt_detail=generate_receipt_detail();
    $("#receipt_detail").val(JSON.stringify(receipt_detail));
    $("#receive_action_form").submit();
});

$(".back-rec-btn").click(function(){
    $("#rec_remarks").show();
    $(".rec_remarks_text").html('').hide();
    
    $(".rec-ctrl").show();
    $(".confirm-rec-ctrl").hide();
    $(".qty_received, .qty_damaged").removeClass("no-bdr");
    $(".sel-batch-bx").show();
    $(window).scrollTop( $(document).height());
});



 
$(".select_batch").click(function(){
    obj=$(this);
    url=obj.attr('url');
    dispatch_id=obj.attr('dispatch_id');
    pro_id=obj.attr('pro_id');
    batches=[];
    obj.parent().parent().find('.pro_batch_id').each(function(){
        batches.push($(this).val());
    });
    
    change_batch_btn_obj=obj;
    $.fancybox({
        href : url, 
        type : 'ajax',
        helpers: {title: {type: 'inside', position: 'top'}},
        title: '<h2>Select batch</h2>',
        ajax: {method: 'POST', data:{pro_id: pro_id, dispatch_id: dispatch_id, batches: batches, csrf_imsnaco: get_csrf_cookie()}}
    });
});

/** **/
function batchHandleAction(){
    $("#mdate").datepicker({
        dateFormat: "dd M yy",
        changeYear: true,
        changeMonth: true,
        onSelect: function(date) {
            $('#edate').datepicker('option', 'minDate', date);
            var md = $("#mdate").val();
            var xd = $("#edate").val();
            var mdate = new Date(md);
            var xdate = new Date(xd);
            if (xdate < mdate) {
                alert("Expity date must be greater than manufucturing date");
                $(this).val(date);
            }
        }
    });

    $("#edate").datepicker({
        dateFormat: "dd M yy",
        changeYear: true,
        changeMonth: true,
        onSelect: function(date) {
            var md = $("#mdate").val();
            var xd = $("#edate").val(); 
            var mdate = new Date(md);
            var xdate = new Date(xd);
            if (xdate < mdate) {
                alert("Expity date must be greater than manufucturing date");
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
        },
    });
    
    $("#batchno").on("keyup paste", function() {
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
}

/** Init **/
init_qty_change_event();
init_damaged_qty_change_event();