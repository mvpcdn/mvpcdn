/** CD4 Record Result */
angular.module('MetronicApp').controller("CD4RecordResult", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={};
    
    CR.lists=function(orderby){
        if(orderby){
            CR.sdata.orderby=orderby;
        }
        show_loader();
        $http({url: API_URL+'psamples/list_record_result_cd4', params:CR.sdata}).success(
            function(res){
                CR.result=res.result;
                CR.today_date=res.today_date;
                $timeout(function(){
                    set_datepicker($(".dateInpt1"));
                    set_numeric_input();
                    $(".test_date").each(function(){cd4_set_next_date($(this));})
                });
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.record_result=function(){
        var data=[];
        var err='', ccount_flg=0, goodc=0, badc=0; notreceivec=0;
        $(".samples_tbody tr").each(function(){
            var tr=$(this);
            var test_id=tr.attr('test_id');
            var art_num=tr.attr('art_num');
            var patient_status=tr.attr('patient_status');
            var patient_id=tr.attr('patient_id');
            var cur_count=tr.find('.cur_count').val();
            var test_date=tr.find('.test_date').val();
            var next_date=tr.find('.next_date').val();
            var sample_type=tr.find('.sampletype_dd').val();
            var preart=tr.find('.preart').text();

            if(cur_count || sample_type=='BAD' || sample_type=='NOT RECEIVED'){
                ccount_flg+=1;
                if(!(cur_count*1) && sample_type=='GOOD'){
                    err="Test count must be greater than Zero(0)! (Pre-ART: "+preart+")";
                    return false;
                }
                if(!test_date){
                    err="Test date required! (Pre-ART: "+preart+")";
                    return false;
                }
                if(!next_date){
                    err="Next appointment date required! (Pre-ART: "+preart+")";
                    return false;
                }
                if(!sample_type){
                    err="Sample type required! (Pre-ART: "+preart+")";
                    return false;
                }

                if(sample_type=='BAD'){
                    badc++;
                }
                else if(sample_type=='NOT RECEIVED'){
                    notreceivec++;
                }
                else{
                    goodc++;
                }

                data.push({test_id:test_id, cur_count:cur_count, test_date:test_date, next_date:next_date, sample_type:sample_type, preart:preart, art_num:art_num, patient_status:patient_status, patient_id:patient_id});
            }
        });
        if(!ccount_flg){
            bootbox_alert("<span class='text-danger'>Error!</span>", "Enter test count");
            return;
        }
        if(err){
            bootbox_alert("<span class='text-danger'>Error!</span>", err);
            return;
        }
        if(data.length==0){
            return;
        }
        
        var callback=function(){
            show_loader();
            $http({url: API_URL+'psamples/cd4_record_result', method:'POST', data:{data:JSON.stringify(data)}}).success(
                function(res){
                    if(res.success){
                        show_alert_msg(res.msg);
                        CR.lists();
                    }else{
                        show_alert_msg(res.msg, 'E');
                    }
                }
            ).error(function(res){showHttpErr(res);});
        }

        var ctitle='Record CD4 Result';
        var cmsg = '<table class="table table-bordered"><tbody><tr class="active">'+
            '<th class="text-center">Total No. of Result</th>'+
            '<th class="text-center">GOOD Samples</th>'+
            '<th class="text-center">BAD Samples</th>'+
            '<th class="text-center">Not Received</th>'+
        '</tr><tr class="danger">'+
            '<td class="text-center bold">'+(ccount_flg)+'</td>'+
            '<td class="text-center bold">'+(goodc)+'</td>'+
            '<td class="text-center bold">'+(badc)+'</td>'+
            '<td class="text-center bold">'+(notreceivec)+'</td>'+
        '</tr></tbody></table>'+
        '<h3 class="text-center bold text-danger boot-head">Are you sure?</h3>';

        open_confirm_bootbox(ctitle, cmsg, callback);
    }
    
    CR.init=function(){
        $timeout(function(){
            ngvisible();
        });
        CR.lists();
    }
    CR.init();
});

/** TestResultCD4 */
angular.module('MetronicApp').controller("TestResultCD4", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1, orderby:''};

    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;

        if(typeof ajx != "undefined"){
            ajx.abort();
        }
        ajx=$.ajax({
            url: API_URL+'psamples/list_cd4_result', 
            data:CR.sdata,
            success:function(res){
                hide_loader();
                $scope.$apply(function(){
                    CR.result=res.result;
                    CR.page=res.page;
                });
            }
        });
    }
    CR.set_lists_order=function(orderby){
        CR.sdata.orderby=orderby;
        CR.lists();
    }
    CR.export_lists=function(){
		location.href=API_URL+'psamples/export_list_cd4_result?'+$.param(CR.sdata);
	}
    
    CR.init=function(){
        $timeout(function(){
            ngvisible();
            set_datepicker($(".dateInpt"));
        });
        CR.lists();
    }
    CR.init();
});


/** Non Angular */
function cd4_set_next_date(ob){
    var dt=new Date(ob.val());
    var sdd=ob.closest('tr').find('.sampletype_dd');
    if(sdd.val()=='GOOD'){
        var nextdate=moment(dt).add(6, 'months').format('DD MMM YYYY');
    }else{
        var nextdate=moment(dt).format('DD MMM YYYY');
    }
    var obj=ob.closest('tr').find('.next_date');
    obj.val(nextdate);
}

//EOF