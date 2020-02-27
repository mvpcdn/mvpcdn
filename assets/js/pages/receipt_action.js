/** Functions **/
function show_hide_panels() {
    $(".action-btns").hide();
	$(".pro-list-bx").hide();
    if ($(".pro-match-q input:checked").length>0){
        $(".action-btns").show();
    }
    
    if ($(".pro-match-q input:checked").val() == 'Y'){
        $(".batch-match-q").show();
    }
    else{
        $(".batch-match-q").hide();
    }
    
    if ($(".pro-match-q input:checked").val() == 'Y' && $(".batch-match-q input:checked").val() == 'Y') {
        $(".pro-list-bx").show();
        $(".action-btns .btn").hide();
        $(".action-btns").find(".receive-btn, .cancel-btn").show();
        $(".remarks-lbl").removeClass('req');
    }
    
    else if ($(".pro-match-q input:checked").val() == 'N' && $(".batch-match-q input:checked").val() == 'N') {
        $(".action-btns .btn").hide();
        $(".action-btns").find(".return-supp-btn, .reject-btn, .cancel-btn").show();
        $(".remarks-lbl").addClass('req');
    }else if ($(".pro-match-q input:checked").val() == 'Y' && $(".batch-match-q input:checked").length<=0) {
        $(".action-btns").hide();
        $(".remarks-lbl").removeClass('req');
    }

    if ($(".pro-match-q input:checked").val() == 'N' || $(".batch-match-q input:checked").val() == 'N') {
        $(".action-btns .btn").hide();
        $(".action-btns").find(".return-supp-btn, .reject-btn, .cancel-btn").show();
        $(".remarks-lbl").addClass('req');
    }
}


function validate_receive_form(){
    n=$('.qty_received').filter(function(){return !$(this).val();}).length;   
    if(n>0) return 'Some received quantity field(s) are empty';

    return false;
}

function generate_receipt_detail(){
    var dtl={qty_match:'Y', is_damaged:'N', pro:[]};
    qty_match_flg=1;
    damaged_flg=0;
        
    $(".pro-bx").each(function(){
        ob=$(this);
        pro_id=ob.attr('pro-id');
        pro_arr={'pro_id':pro_id, 'batches':[]};
        
        ob.find('.pro_batch_id').each(function(){
            batch_id=$(this).val();
            pob=$(this).parent().parent();
            b={batch_id:batch_id, qty_match:'Y', exp_qty:'', rec_qty:'', damaged_qty:''};
            
            if(pob.find('.qty_exp').val()!=pob.find('.qty_received').val()){
                b.qty_match='N';
                qty_match_flg=0;
            }
            
            if(parseInt(pob.find('.qty_damaged').val()))
                damaged_flg=1;
            
            b.exp_qty=pob.find('.qty_exp').val();
            b.rec_qty=pob.find('.qty_received').val();
            b.damaged_qty=pob.find('.qty_damaged').val();
            pro_arr.batches.push(b);
        });
        
        dtl.pro.push(pro_arr);
    });
    
    if(qty_match_flg==0)
        dtl.qty_match='N';
    if(damaged_flg==1)
        dtl.is_damaged='Y';
    
    return dtl;
}

/** Events **/
$(".pro-match-q input, .batch-match-q input").change(function() {
    show_hide_panels();
});

$(".return-supp-btn").click(function(){
    var action=$(this).attr('action_url');
    var remarks=$.trim($("#rec_remarks").val());
    if(!remarks){
        $("#rec_remarks").addClass('red-bdr').focus();
        return;
    }else{
        $("#rec_remarks").removeClass('red-bdr');
    }
    
    bootbox.confirm({
        title: 'Please Confirm',
        message: "STN will be returned to supplier for correction. <br><br>Are you sure?",
        buttons: {
            'cancel': 	{label: 'Cancel'},
            'confirm': 	{label: 'Yes'}
        },
        callback: function(res){
            if(res==true){
                $("#receive_action_form").attr('action', action).submit();
            }
        }
    });
   
});

$(".receive-btn").click(function(){
    if(msg=validate_receive_form()){
        bootbox.alert({title:'Error', message: msg, buttons: {'ok': {label:'Close', className:'btn btn-danger'}}});
        return;
    }
    /** **/
    $(".goods-dtls-bx, .dtl-match-bx").hide();
    $("#rec_remarks").hide();
    $(".rec_remarks_text").html($("#rec_remarks").val()).show();
    
    $(".rec-ctrl").hide();
    $(".confirm-rec-ctrl, .confirm-rec-ctrl button").show();
    $(".qty_received, .qty_damaged").addClass("no-bdr");
});

$(".confirm-rec-btn").click(function(){
    receipt_detail=generate_receipt_detail();
    $("#receipt_detail").val(JSON.stringify(receipt_detail));
    var action=$(this).attr('action_url');
    $("#receive_action_form").attr('action', action).submit();
});

$(".back-rec-btn").click(function(){
    $(".goods-dtls-bx, .dtl-match-bx").show();
    $("#rec_remarks").show();
    $(".rec_remarks_text").html('').hide();
    
    $(".rec-ctrl").show();
    $(".confirm-rec-ctrl").hide();
    $(".qty_received, .qty_damaged").removeClass("no-bdr");
    $(window).scrollTop( $(document).height());
});

$(".qty_received").keyup(function(){
    p=$(this).parent().parent();
    eq=getNumValue(p.find('.qty_exp').val());
    rq=getNumValue($(this).val());
    if(rq>eq){
        $(this).val(eq);
        $(".rec-qty-err .alert").text("Received quantity can't be more than expected quantity.");
        $(".rec-qty-err").fadeIn().delay(2000).fadeOut('slow');
    }
    
    dm=getNumValue(p.find('.qty_damaged').val());
    if(dm>$(this).val()){
        p.find('.qty_damaged').val($(this).val());
    }
});


$(".qty_damaged").keyup(function(){
    p=$(this).parent().parent();
    eq=getNumValue(p.find('.qty_received').val());
    rq=getNumValue($(this).val());
    if(rq>eq){
        $(this).val(eq);
        $(".rec-qty-err .alert").text("Damaged quantity can't be more than received quantity.");
        $(".rec-qty-err").fadeIn().delay(2000).fadeOut('slow');
    }
});

/** Initialize **/
show_hide_panels();