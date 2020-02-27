/** Functions **/
function show_noti(msg, timeout){
     $(".top-noti .msg").html(msg);
    if(timeout)
        $(".top-noti").show().delay(timeout).fadeOut(300);
    else
        $(".top-noti").show();
}
function hide_noti(){
    $(".top-noti").fadeOut(300);
}

function send_for_test(){
    var send_dtl={test_type:'', nodal_fac_name:'', patients:[]};
    send_dtl.test_type=$("[name='test_type']:checked").val();
    send_dtl.nodal_fac_name=$("#nodal_fac_name").val();
    $("tr[patient_id]").each(function(){
        var pid=$(this).attr('patient_id');
        if(pid)
            send_dtl.patients.push(pid);
    });
    
    if(send_dtl.patients.length==0)
        return;
    
    $("#send_for_test_btn").text('Sending...').prop('disabled', true);
    $.ajax({
        url: SITE_URL+"cd4/send_for_test",
        method: 'POST',
        data: {send_dtl: send_dtl, csrf_imsnaco: get_csrf_cookie()},
        success: function(res){
            if(res=='T'){
                show_noti('Successfully sent for testing', 4000);
                $("#clear_btn").click();
            }
        }
    });
}

function get_patient_list(data){
    if(!data.paging)
        $("#code").addClass('spin');
    
    $("#patients_list_bx").html('');
    
    $.ajax({
        url: SITE_URL+"cd4/patient_list",
        method: 'POST',
        data: data,
        success: function(res){
            $("#code").removeClass('spin');
            $("#patients_list_bx").html(res);
            $("#main_bx").show();
            
            $(".paging1 a").click(function(e){
               e.preventDefault();
               
               var href=$(this).attr('href');
               var a=href.split("/");
               var pageno=a[a.length-1];
               
               code=data.code;
               get_patient_list({code: code, pageno: pageno, paging:true, csrf_imsnaco: get_csrf_cookie()});
            });
            
            /** Disable added patients **/
            $("tr[patient_id]").each(function(){
                var pid=$(this).attr('patient_id');
                $("tr[pid='"+pid+"']").find('.add_patient').prop('disabled', true);
            });
        }
    });
}

function added_patient_show_hide(){
    if($("#add_patients_body tr").length>0){
        $("#send_form_bx, #added_patients_bx table").show();
    }else{
        $("#send_form_bx, #added_patients_bx table").hide();
    }
}

function add_patient(patient_id){
    var patient_n=1;
    var tr=$("tr[pid='"+patient_id+"']");
    var pname=tr.find('td').eq(0).text();
    var pre_art=tr.find('td').eq(3).text();
    var art=tr.find('td').eq(4).text();
    
    if($("tr[patient_id='"+patient_id+"']").length>0)
        return;
    
    if($(".patient_n").length)
        patient_n=patient_n+getNumValue($(".patient_n:last").text());
    
    el='<tr patient_id="'+patient_id+'"><td class="patient_n">'+patient_n+'</td><td>'+pname+'</td><td>'+pre_art+'</td><td>'+art+'</td><td><a href="#" class="text-danger rm-added"><i class="fa fa-remove"></i></a></td></tr>';
    $("#add_patients_body").append(el);
    tr.find('.add_patient').prop('disabled', true);
    added_patient_show_hide();
    
    $(".rm-added").click(function(e){
        e.preventDefault();
        var ob=$(this).parent().parent();
        var pid=ob.attr('patient_id');
        $("tr[pid='"+pid+"']").find('.add_patient').prop('disabled', false);
        ob.remove();
        added_patient_show_hide();
        
        $(".patient_n").each(function(i){
           $(this).text(i+1); 
        });
    });
}

function set_chk_checked(ob){
    if(parseInt(ob.find('.cur_count').val())>0 && ob.find('.next_date').val() && ob.find('.sample_type').val()=='GOOD')
        ob.find('.chk').prop('checked', true);
    else if(ob.find('.next_date').val() && ob.find('.sample_type').val()=='BAD')
        ob.find('.chk').prop('checked', true);
    else
        ob.find('.chk').prop('checked', false);
}

function calc_next_date(ob){
    var tr=ob.parent().parent();
    var test_date=ob.val();
    if(!test_date)
        test_date=$("#today_date").val();

    var ndate=new Date(test_date);
    ndate.setMonth(ndate.getMonth() + 6);
    
    var next_date="";

    var dd = ndate.getDate();
    var mm = ndate.getMonth();
    var yy = ndate.getFullYear();
    dd=dd<10?'0'+dd:dd;
    var next_date = dd + ' '+ getMonthName(mm) + ' '+ yy;
    tr.find('.next_date').val(next_date);
}

function set_next_date(obj){
    if(obj){
        calc_next_date(obj);
    }else{
        $(".test_date").each(function(){
            calc_next_date($(this));
        });
    }
}

/** Events **/
$(document).ready(function(){
    /** Get patient list by entering name/art etc. **/
    $("#search_p_form").submit(function(e){
        e.preventDefault();
        if($("#code").val()){
            added_patient_show_hide();
            var data={code:'', pageno:1, csrf_imsnaco: get_csrf_cookie()}
            data.code=$.trim($("#code").val());
            get_patient_list(data);
        }
    });
    
    /** Send for test **/
    $("#send_for_test_btn").click(function(){
        send_for_test();
    });
    
    /** Clear **/
    $("#clear_btn").click(function(){
        $("#code").val('').focus();
        $("#main_bx").hide();
        $("#patients_list_bx, #add_patients_body").html('');
        $("#send_for_test_btn").text('Send for Testing').prop('disabled', false);
        added_patient_show_hide();
    });
    
    /** **/
    $("#nodal_fac_name").auto_list(SITE_URL+"cd4/nodal_centers");
    $("#fac_name").auto_list(SITE_URL+"cd4/facilities");
    
    $("#cd4_search_form input").change(function(){
       $("#cd4_search_form").submit(); 
    });
    
    $(".chk").click(function(e){
        e.preventDefault();
    });
    
    $(".cur_count").keyup(function(){
        if(parseInt($(this).val())==0){
            $(this).val('');
            return;
        }
        var ob=$(this).parent().parent();
        set_chk_checked(ob);
    });
    
    $(".next_date").change(function(){
        var ob=$(this).parent().parent();
        setTimeout(function(){
            set_chk_checked(ob);
        }, 200);
    });
    
    $(".sample_type").change(function(){
        var ob=$(this).parent().parent();
        set_chk_checked(ob);
    });
    
    $(".test_date").change(function(){
        var ob=$(this);
        setTimeout(function(){
            set_next_date(ob);
        }, 200);
    });
    
    $(".alert").delay(4000).fadeOut();
    
    /** Init **/
    added_patient_show_hide();
    set_next_date();
});