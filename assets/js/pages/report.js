/* 
 * Add this js in report.
 * Created By :- Amit Maan
 * Created Date :- 13-Aug-2015
 * Modified By :- Amit,
 * Modified Date :- 04-Sept-2015, .
 */
$(document).ready(function() {
    if($('.chosen').length){
        $('.chosen').chosen({search_contains: true});
    }
    if( $("#focus-table").length){
        $('html, body').animate({
            scrollTop: $("#focus-table").offset().top
        }, 200);
    }
    var date = $('#datetoday').val();
    if($(".dateInpt").length>0){
		$('#datetd').datepicker({
			dateFormat: "dd M yy", 
			changeYear: true,
                        changeMonth: true,
			maxDate:  '-1D',
//			maxDate:  0,
			onSelect: function(date){            
				$('#datefd').datepicker("option","maxDate",date); 
				$(this).change();	
			}
		});

		$("#datefd").datepicker({
			dateFormat: "dd M yy", 
			changeYear: true,
            changeMonth: true,
			maxDate:  0,
			onSelect: function(date){            
				$('#datetd').datepicker("option","minDate",date); 
				$(this).change();	
			}
		});
    }
	
    //use in daily inventory report
    if($("#datedailyinv").length>0){
        $("#datedailyinv").datepicker({
            dateFormat: "dd M yy",
            changeYear: true,
            changeMonth: true,
            maxDate: 0,
        });
    }
    //update month after change period in Stock Summary
    $("#periodId").on('change',function(){
        CreateMonth($(this).val(),'monthId');
    });
    $("#fac_dd, #sacs_dd").on('change',function(){
        if($("#periodId").length){
            createperiod($(this).val(),'periodId');
        }
    });
});


function excelexportPE(type,page){
    var attr = SITE_URL + "reports/"+page+"/1/"+type;
    var attrcurrent = SITE_URL + "reports/"+page+"/";
    jQuery('#form').attr('action',attr);
    jQuery('#form').attr('target','_blank');
    jQuery('#submit').trigger('click');
    //jQuery('#form').submit();
    jQuery('#form').attr('action',attrcurrent);
    jQuery('#form').attr('target','');
}

function pexcelexportPE(type,page){
    var attr = SITE_URL + "patients_report/"+page+"/1/"+type;
    var attrcurrent = SITE_URL + "patients_report/"+page+"/";
    jQuery('#searchForm').attr('action',attr);
    jQuery('#searchForm').attr('target','_blank');
    jQuery('#submit').trigger('click');
    //jQuery('#form').submit();
    jQuery('#searchForm').attr('action',attrcurrent);
    jQuery('#searchForm').attr('target','');

}

function CreateMonth(period,updateFId){
    if($('#sacs_dd').length){
        var loc=$('#sacs_dd').val();
        var loct='SACS';
    }else if($('#fac_dd').length){
        var loc=$('#fac_dd').val();
        var loct='FAC';
    }else{
        var loc=0;
        var loct='';
    }
    if(period){
        $('#'+updateFId).empty();
        $('#'+updateFId).append(new Option("Loading...", 0));
        $.ajax({
            type:"POST",
            url:SITE_URL + "reports/monthdd/",
            data:{
                'csrf_imsnaco': get_csrf_cookie(),
                dtl:{'key':period,'loc':loc,'loct':loct}
            },
            dataType: "json",
            cache: false,
            success: function(data) {
                $('#'+updateFId).empty();
                $.each(data, function(index, value) {
                    $('#'+updateFId).append(new Option(value, index));
                });
            }
        });
        /*switch(period){
            case 'ANL':
                var MonthNames = ["January - December"];
            break;
            case 'SAL':
                var MonthNames = ["January - June", "July - December"];
            break;
            case 'QAT':
                var MonthNames = ["January - March", "April - June", "July - September", "October - December"];
            break;
            case 'MON':
                var MonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            break;
        }
        $('#'+updateFId).empty();
        $.each(MonthNames, function(index, value) {
            $('#'+updateFId).append(new Option(value, index));
        });*/
    }
}

function createperiod(loc,updateFId){
    if($('#sacs_dd').length){
        var loct='SACS';
    }else if($('#fac_dd').length){
        var loct='FAC';
    }else{
        var loc=0;
        var loct='';
    }
    if(loct){
        $('#'+updateFId).empty();
        $('#'+updateFId).append(new Option("Loading...", 0));
        $.ajax({
            type:"POST",
            url:SITE_URL + "reports/rep_period/",
            data:{
                'csrf_imsnaco': get_csrf_cookie(),
                dtl:{'loc':loc,'loct':loct}
            },
            dataType: "json",
            cache: false,
            success: function(data) {
                $('#'+updateFId).empty();
                $.each(data.per, function(index, value) {
                    $('#'+updateFId).append(new Option(value, index));
                });
                /*$('#yeardd').empty();
                $.each(data.year, function(index, value) {
                    $('#yeardd').append(new Option(value, index));
                });*/
            }
        });
    }
}

function get_patient_list(data){
    $("#patient_dtl_bx").hide();
    if(!data.paging)
        $("#code").addClass('spin');
    
    $.ajax({
        url: SITE_URL+"patients_report/patient_list",
        method: 'POST',
        data: data,
        success: function(res){
            $("#code").removeClass('spin');
            $("#patient_list_bx").html(res);
            if(res){
                $(".sel_patient").click(function(e){
                    e.preventDefault();
                    get_patient_dtl($(this).attr('pid'));
                });
            
                if($(".p-lists li").length==1 && !data.paging){
                    $(".p-lists li").eq(0).find('a').trigger('click');
                }else{
                    $("#patient_list_bx").show();
                }
            }
            else{
                $("#patient_list_bx").hide();
            }
            
            /** After list load **/
            if($(".p-lists li").length>0){
                $(".p-lists li").eq(0).find('a').focus();
                $("#code").keypress(function(e){
                    if(e.keyCode==9){
                        e.preventDefault();
                        $(".p-lists li").eq(0).find('a').focus();
                    }
                });
            }
            
            $(".paging1 a").click(function(e){
               e.preventDefault();
               pageno=$.trim($(this).text());
               code=data.code;
               ps_type=data.ps_type;
               get_patient_list({code: code, pageno: pageno, paging:true, csrf_imsnaco: get_csrf_cookie()});
            });
            /** **/
        }
    });
}

function get_patient_dtl(patient_id){
    if(!patient_id)
        return;
    
    $.ajax({
        url: SITE_URL+"patients_report/patient_dtl",
        method: 'POST',
        data: {patient_id: patient_id, csrf_imsnaco: get_csrf_cookie()},
        success: function(res){
            $("#patient_list_bx").hide();
            $("#patient_dtl_bx").html(res);
            $("#patient_dtl_bx").show();
        }
    });
}

$(document).ready(function(){
   $("#search_p_form").submit(function(e){
        e.preventDefault();
        if($("#code").val()){
            var data={code:'', pageno:1, csrf_imsnaco: get_csrf_cookie()}
            data.code=$.trim($("#code").val());
            get_patient_list(data);
        }
    }); 
});
