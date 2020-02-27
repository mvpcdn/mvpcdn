var dispatch_arr=[];
var dispatch_dtl = $("#dispatch_dtl").val();
if (dispatch_dtl)
    dispatch_arr = $.parseJSON(dispatch_dtl);

var noa_num_char_error = false;
var noa_exist_error = false;

var noa_status=$("#approved").val();

/** Functions **/
function init_remove_pro(){
    $(".rm-pro").click(function(e){
        e.preventDefault();
        pro_id=$(this).parent().parent().attr('pro_id');
        
        $.each(dispatch_arr, function(k, v){
            if(v.product_id==pro_id){
                dispatch_arr.splice(k, 1);
                return false;
            }
        });
        
        $(this).parent().parent().remove();
        //$("#product-dd").find('option[value="'+pro_id+'"]').show();
        $("#product-dd").find('option[value="'+pro_id+'"]').prop('disabled', false);
        apply_select2_delay($("#product-dd"), 'Select Product');
    });
}

function init_remove_sch(){
    $(".rm_sch").click(function(e){
        e.preventDefault();
        ob=$(this).parent().parent();
        sch_no=ob.find('.sch_no').val();
        pro_id=ob.closest('.contract_pro').attr('pro_id');
        
        $.each(dispatch_arr, function(k, v){
            if(v.product_id==pro_id){
                $.each(v.schedules, function(k1, v1){
                    if(v1.sch_no==sch_no){
                        dispatch_arr[k].schedules.splice(k1, 1);
                        return false;
                    }
                });
                return false;
            }
        });
        
        ob.parent().find('.sch_no_td select option[value="'+sch_no+'"]').show();
        
        $(this).parent().parent().remove();
    });
}

function init_dispatch_sch() {
    var pro_name, sch_no, allotment_date;
    jQuery(".dispatch_btn").each(function() {
        titlePos = jQuery(this).attr('title-pos');
        jQuery(this).fancybox({
            closeBtn: true,
            width: '100%',
            maxHeight: '600px',
            autoSize: false,
            autoScale: false,
            helpers: {
                title: {
                    type: 'inside',
                    position: titlePos
                }
            },
            beforeLoad: function() {
                ob = $(this.element).parent().parent();
                noa_id = $("#noa_id").val();

                pro_id = ob.closest('.contract_pro').attr('pro_id');
                pro_name = ob.closest('.contract_pro').attr('pro');
                sch_no = ob.find('.sch_no').val();
                pro_qty = ob.find('.qty').val();
                unit_price = ob.find('.unit_price').val();
                allotment_date = $("#allotment_date_inpt").val();
                
                if (!allotment_date) {
                    alert('Enter the allotment date first!');
                    return false;
                }

                this.ajax.method = 'POST';
                this.ajax.data = {'noa_id': noa_id, 'product_id': pro_id, 'sch_no':sch_no, 'product_qty': pro_qty, 'unit_price': unit_price, 'allotment_date': allotment_date, 'csrf_imsnaco': get_csrf_cookie()};
            },
            beforeShow: function(opt) {
                //this.title = $(this.element).attr('popup-title');
                this.title='<h2>'+pro_name+' - <span class="bg-warning">Allotment Date: '+allotment_date+'</span><span class="pull-right">Schedule No. : '+sch_no+'</span></h2>';
            }
        });
    });
}

function init_add_schedule(){
    $(".add_sch").click(function(){
        ob=$(this).parent().parent();
        sch_no=ob.find('.sch_no_td select').val();    qty=ob.find('.qty_inpt').val();    unit_price=ob.find('.unit_price_inpt').val();
        
        if(!sch_no){
            ob.find('.sch_no_td select').addClass('red-bdr');
        }else{
            ob.find('.sch_no_td select').removeClass('red-bdr');
        }
        
        if(!qty){
            ob.find('.qty_inpt').addClass('red-bdr');
        }else{
            ob.find('.qty_inpt').removeClass('red-bdr');
        }
        
        if(!unit_price){
            ob.find('.unit_price_inpt').addClass('red-bdr');
        }else{
            ob.find('.unit_price_inpt').removeClass('red-bdr');
        }
        
        if(sch_no && qty && unit_price){
            el='<tr class="pro_sch">'+
                    '<td><a href="#" class="rm_sch text-danger"><i class="fa fa-remove"></i></a></td>'+
                    '<td><input type="hidden" class="sch_no" value="'+sch_no+'">'+sch_no+'</td>'+
                    '<td><input type="text" class="qty" valid="int" maxlength="20" value="'+qty+'"></td>'+
                    '<td><input type="text" class="unit_price" valid="float" value="'+unit_price+'"></td>'+
                    '<td><a href="' + SITE_URL + 'contracts/dispatch" class="btn btn-sm btn-info btn-outline btn-block dispatch_btn" popup-title="<h2>Dispatch Schedule '+sch_no+'</h2>" title-pos="top" data-fancybox-type="ajax">Dispatch Schedule</a></td>'+
                '</tr>';
            $(el).insertBefore(ob);
            ob.find('input, select').val('');
            ob.find('.sch_no_td select option[value="'+sch_no+'"]').hide();
            init_remove_sch();
            init_dispatch_sch();
            initUtilFunctions();
        }
    });
}


function submitContract() {
    if (dispatch_arr.length > 0){
        $("#dispatch_dtl").val(JSON.stringify(dispatch_arr));
    }
    approval_status = $("#approved").val();
    
    /** validation **/
    
    if ($(".contract_pro").length <= 0) {boot_alert('Alert', 'Add at-least one product'); return false;}
    
    if(approval_status != 1 && approval_status != 5){
        err_flg=0; $(".contract_pro").each(function(){ if(($(this).find('.sch_no').length<=0)) err_flg=1; });
        if(err_flg==1){boot_alert('Alert', 'Please make sure that schedule is added for all projects'); return false;}
        
        if(!validate_qty()) {return false;}
    }
    
    if(noa_num_char_error)  {return false;}
    if(noa_exist_error)     {return false;}
    /** \ **/
    
    /** Create Contract Dtl Json **/
    $("#contract_pro").val(contract_pro());
    
    return true;
}

function contract_pro(){
    var contract_pro=[];
    $(".contract_pro").each(function(){
       pro_id=$(this).attr('pro_id');
       pro=$(this).attr('pro');
       var sch=[];
       $(this).find('.pro_sch').each(function(){
          sch_no=$(this).find('.sch_no').val();
          qty=$(this).find('.qty').val();
          unit_price=$(this).find('.unit_price').val();
          sch.push({sch_no: sch_no, qty: qty, unit_price: unit_price});
       });
       
       contract_pro.push({pro_id: pro_id, pro: pro, sch: sch});
    });
    
    return JSON.stringify(contract_pro);
}

function validate_qty() {
    nodispatch=0;
    qty_err=0;
    $(".contract_pro").each(function(){
       pro_id=$(this).attr('pro_id');
       $(this).find('.pro_sch').each(function(){
          sch_no=$(this).find('.sch_no').val();
          qty=$(this).find('.qty').val();
          q=get_sch_qty(sch_no, pro_id);
          if(q==0)      {nodispatch=1; return false;};
          if(q!=qty)    {qty_err=1; return false;};
       });
       
       if(nodispatch==1 || qty_err==1) {return false;}
    });
    
    if(nodispatch==1)   {boot_alert('Alert', "Please make sure that dispatch schecdule for all the product schedules has been generated."); return false;}
    if(qty_err==1)      {boot_alert('Alert', "Please recheck Total Quantity in distribution Schedule - It does not match with allotted quantity."); return false;}

    return true;
}

function get_sch_qty(sch_no, pro_id) {
    q = 0;
    $.each(dispatch_arr, function(k, v){
        if(v.product_id==pro_id){
            $.each(v.schedules, function(k1, v1){
                if(v1.sch_no==sch_no){
                    $.each(v1.sacs, function(k2, v2){
                        q=q + getNumValue(v2.qty1) + getNumValue(v2.qty2) + getNumValue(v2.qty3) + getNumValue(v2.qty4);
                    });
                    return false;
                }
            });
            return false;
        }
    });
    return q;
}

function change_status_alert(msg, approved, url){
    bootbox.confirm({
        title: 'Confirmation',
        message: msg,
        buttons: {
            'cancel': 	{label: 'Cancel'},
            'confirm': 	{label: 'Confirm'}
        },
        callback: function(res){
            if(res==true){
                if(approved==0){
                    location.href=url;
                }else{
                    $("#approved").val(approved);
                    $("#contract_form").submit();
                }
            }
        }
    });
}


/** Events **/
$(document).ready(function(){
    /** Check NOA Number **/
    $("#noa_num_inpt").on('keyup change', function() {
        noa_num = $(this).val();
        var allowed = /^[0-9a-zA-Z\.\/\\\-\(\)]+$/;

        noa_num_char_error = false;
        $("#noa_num .invalid-chars").remove();

        if (noa_num && !allowed.test(noa_num)) {
            noa_num_char_error = true;
            $("#noa_num").append('<p class="text-danger invalid-chars">Invalid character(s). Only alphabet, digits, forward slash(/), backward slash(\\), dash(-), round brackets() and dot(.) are allowed.</p>');
        }
    });

    $("#noa_num_inpt").change(function() {
        $("#noa_num_inpt").addClass('inpt-spin');
        noa_exist_error = false;
        $.ajax({
            method: 'POST',
            url: SITE_URL + "contracts/isNoaNumExists",
            data: {'noa_num': $("#noa_num_inpt").val(), 'noa_id': $("#noa_id").val(), 'csrf_imsnaco': get_csrf_cookie()},
            success: function(res) {
                if (res == 'T') {
                    $("#noa_num").append('<p class="text-danger noa-exist">This NOA Number already exists</p>');
                    noa_exist_error = true;
                }
                else
                    $("#noa_num .noa-exist").remove();

                $("#noa_num_inpt").removeClass('inpt-spin');
            }
        });
    });
    
    /** Add product **/
    $("#product-dd").change(function(){
        ob=$(this);
        if(!ob.val()) return;
        
        pro_id=ob.val();
        pro=ob.find('option:selected').text();
        
        el='<div class="panel panel-success contract_pro" pro_id="'+pro_id+'" pro="'+pro+'">'+
                '<div class="panel-heading posRel">'+
                    '<a href="#" class="text-danger rm-pro"><i class="fa fa-remove fa-2x"></i></a><h3 class="panel-title">'+pro+'</h3>'+
                '</div>'+
                '<div class="panel-body">'+
                    '<div class="table-responsive1">'+
                        '<table class="table table-bordered tablesm">'+
                            '<thead><tr class="active bold uc"><td class="tdw16"></td><td>Schedule No.</td><td>Quantity</td><td>Unit Price</td><td></td></tr></thead>'+
                            '<tbody>'+
                                '<tr>'+
                                    '<td></td>'+
                                    '<td class="sch_no_td">'+$('#roman_nums').html()+'</td>'+
                                    '<td><input type="text" class="qty_inpt" valid="int" maxlength="20"></td>'+
                                    '<td><input type="text" class="unit_price_inpt" valid="float" maxlength="10"></td>'+
                                    '<td><button type="button" class="btn btn-sm btn-success btn-outline btn-block add_sch"><i class="fa fa-plus"></i>&nbsp;Add Schedule</button></td>'+
                                '</tr>'+
                            '</tbody>'+
                        '</table>'+
                    '</div>'+
                '</div>'+
            '</div>';
        
        $(".contract-pro").append(el);
        //ob.find('option[value="'+pro_id+'"]').hide();
        ob.find('option[value="'+pro_id+'"]').prop('disabled', true);
        ob.val('');
        apply_select2_delay($("#product-dd"), 'Select Product');
        
        
        init_remove_pro();
        init_add_schedule();
        initUtilFunctions();
    });

    apply_select2_delay($("#product-dd"), 'Select Product');
    apply_select2_delay($("#supplier_id_dd"));
    
    /** \ **/
    
    //011 25271885
    
    /** Allotment date change **/
    $("#allotment_date_inpt").click(function() {
        allot_date = $(this).val();
        $(this).change(function() {
            //console.log(JSON.stringify(dispatch_arr));
            allot_date1 = $(this).val();
            if (allot_date) {
                allot_date = new Date(allot_date);
                allot_date1 = new Date(allot_date1);
                if (allot_date1 > allot_date)
                    n = noOfDays(allot_date, allot_date1);
                else {
                    n = noOfDays(allot_date1, allot_date) * -1;
                }
            }
            
            if(!allot_date)
                return;
            
            if (dispatch_arr.length <= 0)
                return;

            $.each(dispatch_arr, function(k1, v1) {
                $.each(v1.schedules, function(k, v) {
                    if (v.L1_sd) {
                        lot1_date = new Date(v.L1_sd); dt = new Date(); var dt1 = new Date(lot1_date); dt.setDate(dt1.getDate() + n);
                        newdate = dt.getDate() + ' ' + getMonthName(dt.getMonth()) + ' ' + dt.getFullYear(); v.L1_sd = newdate;
                    }

                    if (v.L1_ed) {
                        lot1_date = new Date(v.L1_ed); dt = new Date(); var dt1 = new Date(lot1_date); dt.setDate(dt1.getDate() + n);
                        newdate = dt.getDate() + ' ' + getMonthName(dt.getMonth()) + ' ' + dt.getFullYear(); v.L1_ed = newdate;
                    }

                    if (v.L2_sd) {
                        lot2_date = new Date(v.L2_sd); dt = new Date(); var dt1 = new Date(lot2_date); dt.setDate(dt1.getDate() + n);
                        newdate = dt.getDate() + ' ' + getMonthName(dt.getMonth()) + ' ' + dt.getFullYear(); v.L2_sd = newdate;
                    }

                    if (v.L2_ed) {
                        lot2_date = new Date(v.L2_ed); dt = new Date(); var dt1 = new Date(lot2_date); dt.setDate(dt1.getDate() + n);
                        newdate = dt.getDate() + ' ' + getMonthName(dt.getMonth()) + ' ' + dt.getFullYear(); v.L2_ed = newdate;
                    }

                    if (v.L3_sd) {
                        lot3_date = new Date(v.L3_sd); dt = new Date(); var dt1 = new Date(lot3_date); dt.setDate(dt1.getDate() + n);
                        newdate = dt.getDate() + ' ' + getMonthName(dt.getMonth()) + ' ' + dt.getFullYear(); v.L3_sd = newdate;
                    }

                    if (v.L3_ed) {
                        lot3_date = new Date(v.L3_ed); dt = new Date(); var dt1 = new Date(lot3_date); dt.setDate(dt1.getDate() + n);
                        newdate = dt.getDate() + ' ' + getMonthName(dt.getMonth()) + ' ' + dt.getFullYear(); v.L3_ed = newdate;
                    }

                    if (v.L4_sd) {
                        lot4_date = new Date(v.L4_sd); dt = new Date(); var dt1 = new Date(lot4_date); dt.setDate(dt1.getDate() + n);
                        newdate = dt.getDate() + ' ' + getMonthName(dt.getMonth()) + ' ' + dt.getFullYear(); v.L4_sd = newdate;
                    }

                    if (v.L4_ed) {
                        lot4_date = new Date(v.L4_ed); dt = new Date(); var dt1 = new Date(lot4_date); dt.setDate(dt1.getDate() + n);
                        newdate = dt.getDate() + ' ' + getMonthName(dt.getMonth()) + ' ' + dt.getFullYear(); v.L4_ed = newdate;
                    }
                });
            });
        });
    });
    /** \ **/
    
    
    
    /** Init **/
    init_remove_pro();
    init_remove_sch();
    init_dispatch_sch();
    init_add_schedule();
    
    $(".contract_pro").each(function(){
        ob=$(this);
        pro_id=ob.attr('pro_id');
        //$("#product-dd").find('option[value="'+pro_id+'"]').hide();
        $("#product-dd").find('option[value="'+pro_id+'"]').prop('disabled', false);
        ob.find('.pro_sch').each(function(){
            sch_no=$(this).find('.sch_no').val();
            ob.find('.sch_no_inpt option[value="'+sch_no+'"]').hide();
        });

        apply_select2_delay($("#product-dd"), 'Select Product');
    });
    
    
    /** Save/Draft contract **/
    $("#save_contract_btn").click(function() {
        appr_status = $("#noa_status").val();
        if (!appr_status || appr_status == 1)
            $("#approved").val("1");
        $("#contract_form").submit();
    });

    /** Submit contract **/
    $("#submit_contract_btn").click(function() {
        appr_status = $("#noa_status").val();
        if (!appr_status || appr_status == 1)
            $("#approved").val("2");
        $("#contract_form").submit();
    });
    
    $("#await_appr_btn").click(function() {
        change_status_alert("Are you sure you want to submit the contract?", 2);
    });
    
    $("#appr_btn").click(function() {
        change_status_alert("Are you sure you want to Approve the contract?", 3);
    });
    
    $("#close_btn").click(function() {
        change_status_alert("You are about to close the contract.<br>Supplier would not be able to make any further dispatches once the contract is closed.<br><br>Are you sure you want to proceed?", 4);
    });
    
    $("#reject_btn").click(function() {
        change_status_alert("Are you sure you want to Reject the contract?", 5);
    });
    
    $("#delete_btn").click(function(e) {
        e.preventDefault();
        var url=$(this).attr('href');
        change_status_alert("Are you sure you want to delete the contract?", 0, url);
    });

    /** **/
    if(noa_status==2 || noa_status==3){
        $(".rm-pro, .rm_sch").remove();
        $(".sch_no_td").parent().remove();
        
        $(".contract-pro table").each(function(){
            $(this).find('tr').each(function(){
                $(this).find('td').eq(0).remove();
            });
        });
    }
    
    /** Allotment Date **/
    var allot_date=$("#allotment_date_inpt").val();
    $("#allotment_date_inpt").datepicker({
        dateFormat: "dd M yy",
        changeYear: true,
        changeMonth: true,
        maxDate: 0
    });
    $("#allotment_date_inpt").datepicker( "setDate", allot_date);
});
