/** VLoadBatches */
angular.module('MetronicApp').controller("VLoadBatch", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1};

    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        $http({url: API_URL+'psamples/list_vload_batches', params:CR.sdata}).success(
            function(res){
                CR.result=res.result;
                CR.page=res.page;
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.set_lists_order=function(orderby){
        CR.sdata.orderby=orderby;
        CR.lists();
    }

    CR.openBDN = function(id){
        show_loader();
        $http({url: API_URL+'psamples/vload_batch_dtl/'+id+'/F'}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.bdn=res.dtl;
                    showModal($("#bdnModal"), true);
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.open_add_sample=function(id){
        CR.filter_csample='';
        show_loader();
        $http({url: API_URL+'psamples/vload_batch_dtl/'+id+'/T/T'}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.open_form(res.dtl);
                    CR.csamples=res.csamples;
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.view_batch_dtl=function(id){
        show_loader();
        $http({url: API_URL+'psamples/vload_batch_dtl/'+id}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.bdtl=res.dtl;
                    CR.result_types=res.dtl.result_types;
                    showModal($("#bdtlModal"), true);
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.view_test_result=function(id){
        show_loader();
        $("#bdtlModal").addClass('hidden-print');
        $http({url: API_URL+'psamples/vload_test_dtl/'+id}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.test=res.dtl;
                    showModal($("#resultModal"), true);
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.view_trrf_dtl=function(id){
        show_loader();
        $("#bdtlModal").addClass('hidden-print');
        $http({url: API_URL+'psamples/vload_test_dtl/'+id}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.test=res.dtl;
                    $("#trrfModal").modal();
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.closeTrrf=function(){
        $("#bdtlModal").removeClass('hidden-print');
    }

    CR.patient_search=function(){
        if(!CR.psearchk){
            return;
        }
        show_loader();
        $http({url: API_URL+'psamples/patient_search', params:{k:CR.psearchk}}).success(
            function(res){
                CR.presult=res.result;
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.remove_csample=function(id){
        var callback=function(){
            if(id=='ALL'){
                var ids=[];
                CR.filtered_csamples.forEach(function(v){
                    ids.push(v.id);
                });
                ids=ids.join(",");
            }else{
                var ids=id;
            }
            show_loader();
            $http({url: API_URL+'psamples/vload_remove_samples', method:'POST', data:{ids:ids}}).success(
                function(res){
                    if(res.success){
                        CR.csamples=res.csamples;
                        show_alert_msg(res.msg);
                    }else{
                        show_alert_msg(res.msg, 'E');
                    }
                }
            );
        }

        open_confirm_bootbox("Confirm", "Are you sure to remove sample?", callback);
    }

    CR.pick_csample=function(rob){
        var flg=0;
        CR.data.test_results.forEach(function(v){
            if(rob.patient_id==v.patient_id){
                flg=1;
                return false;
            }
        });
        if(flg==1){
            rob.disabled=true;
            return;
        }

        var ob=angular.copy(rob);
        ob.id=rob.id;
        ob.barcode_no=angular.isDefined(rob.barcode_no)?rob.barcode_no:'';
        ob.test_type=angular.isDefined(rob.test_type)?rob.test_type:'';;
        CR.data.test_results.unshift(ob);
        rob.disabled=true;

        $timeout(function(){
            $("#added_samples_div").scrollTop(0);
            //$("#added_samples_div input").eq(0).focus();
        });
    }
    CR.pick_all_csample=function(){
        CR.filtered_csamples.forEach(function(v){
            CR.pick_csample(v);
        });
    }

    CR.unpick_csample=function(id, i){
        CR.data.test_results.splice(i,1);
        $.each(CR.csamples, function(j, v){
            if(id==v.id){
                CR.csamples[j].disabled=false;
                return false;
            }
        });
    }
    CR.unpick_all_csample=function(){
        CR.data.test_results=[];
        CR.csamples.forEach(function(v,i){
            CR.csamples[i].disabled=false;
        });
    }

    CR.clear_form_data=function(){
        CR.filter_csample='';
        CR.csamples=[];
        CR.data.test_results=[];
    }
    
    CR.data={lab_id:$("#labs_dd").val()};
    CR.open_form=function(dtl){
        var lab_id=$("#labs_dd").val();
        CR.data=dtl?dtl:{id:'', lab_id:lab_id, test_results:[]};
        hide_form_errors($("#frm"));
		showModal($("#formModal"), true);
    }
    CR.open_dispatch_sample=function(){
        CR.filter_csample='';
        show_loader();
        $http({url: API_URL+'psamples/vload_collected_samples'}).success(
            function(res){
                CR.csamples=res.csamples;
                CR.open_form();
            }
        );
    }
    CR.dispatch_vload_samples=function(status){
        var callback=function(status){
            var data={lab_id:CR.data.lab_id, test_results:JSON.stringify(CR.data.test_results)};
            //console.log(data);return;
            show_loader();
            $http({url: API_URL+'psamples/dispatch_vload_samples', method:'POST', data:data}).success(
                function(res){
                    if(res.success){
                        show_alert_msg(res.msg);
                        CR.lists(CR.sdata.p);
                        CR.clear_form_data();
                        hideModal($("#formModal"));
                        if (typeof res.order != 'undefined' && res.order){
                            $.each(res.order, function (k, v) {
                                CR.callMessAPI(v);
                            });
                        }
                    }else{
                        show_alert_msg(res.msg, 'E');
                    }
                }
            ).error(function(res){showHttpErr(res);});
        }

        if(!CR.data.lab_id){
            show_alert_msg("Please select laboratory!", "E");
            return;
        }

        var lab=$("#labs_dd option:selected").text();
        
        var ctitle="Dispatch Confirmation";
        var cmsg = '<table class="table"><tbody><tr class="active"><tr>'+
            '<td class="text-left bold warning">Dispatching To</td>'+
            '<td class="text-right bold warning">'+lab+'</td>'+
            '</tr><tr>'+
            '<td class="bold danger">No of Samples</td>'+
            '<td class="text-right bold danger">'+CR.data.test_results.length+'</td>'+
        '</tr></tbody></table>'+
        '<h3 class="text-center bold text-danger boot-head">Do you want to Continue?</h3>';
        open_confirm_bootbox(ctitle, cmsg, callback, status);
    }

    CR.callMessAPI = function (data) {
        var jsdata = JSON.stringify(data);
        $http({url: 'http://13.234.73.209:7676/mhlapi/sendTestOrder', method: 'POST', data: jsdata, headers: {'Content-Type': 'application/json'}}).success(
                function (res) {
                    
                }
        )
    }

    CR.res_ob={};
    CR.open_record_result=function(rob, batch_id){
        $(".resultdate").attr('mindate', rob.collection_date);
        CR.res_ob=rob;
        CR.res_ob.batch_id=batch_id;
        CR.resultdata={id:rob.id, result_type:'', result_value:'', is_error:'N', batch_id:batch_id, by_fac:'T', result_date:CR.curdate};
        $("#recordResultModal").modal();
        $timeout(function(){
            set_datepicker($(".resultdate"));
        });
    }
    CR.record_result=function(){
        show_loader();
        $http({url: API_URL+'psamples/vload_record_result', method:'POST', data:CR.resultdata}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    $("#recordResultModal").modal('hide');
                    CR.view_batch_dtl(CR.res_ob.batch_id);
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.calc_log_value=function(){
        var v=getNumValue(CR.resultdata.result_value);
        if(!v){
            CR.resultdata.log_value='';
            return;
        }
        CR.resultdata.log_value=Math.log10(v).toFixed(8);
    }
    CR.reverse_log_value=function(){
        var v=getNumValue(CR.resultdata.log_value);
        if(!v){
            CR.resultdata.result_value='';
            return;
        }
        CR.resultdata.result_value=Math.round(Math.pow(10, v));
    }
    
    CR.init=function(){
        CR.curdate=moment().format('DD MMM YYYY');
        if(vl_action=='dispatch'){
            CR.open_dispatch_sample();
        }
        set_numeric_input();
        $http({url:API_URL+'psamples/init_viral_load'}).success(
            function(res) {
                CR.result=res.result;
                CR.page=res.page;
                $timeout(function(){ngvisible();});
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.init();
});

/** DispatchedVLbatches */
angular.module('MetronicApp').controller("VLdipatchedBatch", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1};

    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        $http({url: API_URL+'psamples/list_dispatch_vls', params:CR.sdata}).success(
            function(res){
                CR.result=res.result;
                CR.page=res.page;
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.set_lists_order=function(orderby){
        CR.sdata.orderby=orderby;
        CR.lists();
    }
    CR.openBDN = function(id){
        show_loader();
        $http({url: API_URL+'psamples/vload_batch_dtl/'+id+'/F'}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.bdn=res.dtl;
                    showModal($("#bdnModal"), true);
                }
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.view_batch_dtl=function(id){
        show_loader();
        $http({url: API_URL+'psamples/vload_batch_dtl/'+id}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.bdtl=res.dtl;
                    showModal($("#bdtlModal"), true);
                }
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.view_test_result=function(id){
        show_loader();
        $("#bdtlModal").addClass('hidden-print');
        $http({url: API_URL+'psamples/vload_test_dtl/'+id}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.test=res.dtl;
                    showModal($("#resultModal"), true);
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.view_trrf_dtl=function(id){
        show_loader();
        $("#bdtlModal").addClass('hidden-print');
        $http({url: API_URL+'psamples/vload_test_dtl/'+id}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.test=res.dtl;
                    $("#trrfModal").modal();
                }
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.closeTrrf=function(){
        $("#bdtlModal").removeClass('hidden-print');
    }
    CR.open_receive_samples=function(id){
        CR.filter_pat='';
        $("#bdtlModal").modal('hide');

        if(!id){
            CR.rdtl=angular.copy(CR.bdtl);
            CR.set_chosen_sample_status(CR.rdtl);
            $("#recSampleModal").modal();
            $(".filter_pat").focus();
        }else{
            show_loader();
            $http({url: API_URL+'psamples/vload_batch_dtl/'+id}).success(
                function(res){
                    if(!angular.isDefined(res.dtl.id)){
                        show_alert_msg("Invalid Data!", 'E');
                    }else{
                        CR.rdtl=res.dtl;
                        CR.set_chosen_sample_status(CR.rdtl);
                        $("#recSampleModal").modal();
                        $(".filter_pat").focus();
                    }
                }
            ).error(function(res){showHttpErr(res);});
        }
    }
    CR.set_chosen_sample_status=function(ob){
        $.each(ob.test_results, function(i, v){
            ob.test_results[i].chosen_sample_status=(v.sample_status=='2'?'3':v.sample_status);
        });
    }
    CR.select_sample_status=function(rob, status){
        rob.chosen_sample_status=status;
        rob.reject_reason='0';
        rob.is_updating=true;
    }
    CR.confirm_set_sample_status_multi=function(){
        CR.recdata=[];
        var err=false;
        var rec=0; 
        var rej=0; 
        var nrec=0;
        CR.rdtl.test_results.forEach(function(v){
            if(v.result_status=='1'){
                if(v.chosen_sample_status=='5'){
                    if(v.reject_reason=='0'){
                        err=true;
                        show_alert_msg("Select reason for rejection", "E");
                        return false;
                    }
                    rej++;
                }else if(v.chosen_sample_status=='3'){
                    rec++;
                }else{
                    nrec++;
                }
                CR.recdata.push({id:v.id, sample_status:v.chosen_sample_status, reject_reason:v.reject_reason});
            }
        });
        if(err){
            return;
        }

        var ctitle='Receiving Samples';
        var cmsg = '<table class="table table-bordered"><tbody><tr class="active">'+
            '<th class="text-center">Total No of Samples </th>'+
            '<th class="text-center">Received</th>'+
            '<th class="text-center">Rejected</th>'+
            '<th class="text-center">Not Received</th>'+
        '</tr><tr>'+
            '<td class="text-center bold primary">'+(rec+rej+nrec)+'</td>'+
            '<td class="text-center bold success">'+(rec)+'</td>'+
            '<td class="text-center bold danger">'+(rej)+'</td>'+
            '<td class="text-center bold warning">'+(nrec)+'</td>'+
        '</tr></tbody></table>'+
        '<h3 class="text-center bold text-danger boot-head">Do you want to Continue?</h3>';
        
        open_confirm_bootbox(ctitle, cmsg, CR.set_sample_status_multi);
    }
    CR.set_sample_status_multi=function(){
        show_loader();
        $http({url: API_URL+'psamples/vload_set_sample_status_multi', method:'POST', data:{data:JSON.stringify(CR.recdata)}}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    $("#recSampleModal").modal('hide');
                    CR.view_batch_dtl(CR.rdtl.id);
                    CR.lists(CR.sdata.p);
                    //CR.rdtl.test_results=res.test_results;
                    //CR.set_chosen_sample_status(CR.rdtl);
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.sel_result_ob={};
    CR.set_sample_status=function(rob, status, reject_reason){
        reject_reason=reject_reason?reject_reason:'';
        show_loader();
        $http({url: API_URL+'psamples/vload_set_sample_status', method:'POST', data:{id:rob.id, sample_status:status, reject_reason:reject_reason}}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    rob.sample_status=status;
                    rob.reject_reason=reject_reason;
                    rob.reject_reason_text=res.reject_reason_text;
                    $("#rejectReasonModal").modal('hide');
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.open_reject_sample_status=function(rob){
        CR.sel_result_ob=rob;
        CR.reject_reason='';
        $("#rejectReasonModal").modal();
    }

    CR.init=function(){
        $http({url:API_URL+'psamples/init_dispatch_vl'}).success(
            function(res) {
                CR.result=res.result;
                CR.page=res.page;
                CR.reject_reasons=res.reject_reasons;
                
                $timeout(function(){ngvisible();});
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.init();
});

/** VLreceivedBatch */
angular.module('MetronicApp').controller("VLreceivedBatch", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1};
    CR.data={};

    $scope.set_result=function(res){
        CR.result=res.result;
        CR.page=res.page;
    }

    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        
        /*$http({url: API_URL+'psamples/list_received_vl_samples', params:CR.sdata}).success(
            function(res){
                CR.result=res.result;
                CR.page=res.page;
            }
        ).error(function(res){showHttpErr(res);});*/

        if(typeof ajx != "undefined"){
            ajx.abort();
        }
        ajx=$.ajax({
            url: API_URL+'psamples/list_received_vl_samples', 
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
    CR.openBDN=function(id){
        show_loader();
        $http({url: API_URL+'psamples/vload_batch_dtl/'+id+'/F'}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.bdn=res.dtl;
                    showModal($("#bdnModal"), true);
                }
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.view_batch_dtl=function(id){
        show_loader();
        $http({url: API_URL+'psamples/vload_batch_dtl/'+id}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.bdtl=res.dtl;
                    showModal($("#bdtlModal"), true);
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.view_test_result=function(id){
        show_loader();
        $("#bdtlModal").addClass('hidden-print');
        $http({url: API_URL+'psamples/vload_test_dtl/'+id}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.test=res.dtl;
                    showModal($("#resultModal"), true);
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.view_trrf_dtl=function(id){
        show_loader();
        $("#bdtlModal").addClass('hidden-print');
        $http({url: API_URL+'psamples/vload_test_dtl/'+id}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.test=res.dtl;
                    $("#trrfModal").modal();
                }
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.closeTrrf=function(){
        $("#bdtlModal").removeClass('hidden-print');
    }

    CR.res_ob={};
    CR.open_record_result=function(rob){
        $(".resultdate").attr('mindate', rob.collection_date);
        CR.res_ob=rob;
        CR.data={id:rob.id, result_type:'', result_value:'', is_error:'N', result_date:CR.curdate};
        $("#recordResultModal").modal();
        $timeout(function(){
            set_datepicker($(".resultdate"));
        });
    }
    CR.record_result=function(){
        show_loader();
        $http({url: API_URL+'psamples/vload_record_result', method:'POST', data:CR.data}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    CR.lists(CR.sdata.p);
                    $("#recordResultModal").modal('hide');
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.calc_log_value=function(){
        var v=getNumValue(CR.data.result_value);
        if(!v){
            CR.data.log_value='';
            return;
        }
        CR.data.log_value=Math.log10(v).toFixed(8);
    }
    CR.reverse_log_value=function(){
        var v=getNumValue(CR.data.log_value);
        if(!v){
            CR.data.result_value='';
            return;
        }
        CR.data.result_value=Math.round(Math.pow(10, v));
    }
    
    CR.init=function(){
        CR.curdate=moment().format('DD MMM YYYY');
        set_numeric_input();
        $http({url:API_URL+'psamples/init_received_vl'}).success(
            function(res) {
                CR.result=res.result;
                CR.page=res.page;
                CR.result_types=res.result_types;
                
                $timeout(function(){ngvisible();});
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.init();
});

/** VLtestApproval */
angular.module('MetronicApp').controller("VLtestApproval", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1};
    CR.pD = {};

    CR.lists=function(p){
        $(".allChk,.chk").prop('checked', false);
        vl_approval_btns_toggle();

        show_loader();
        CR.sdata.p=p?p:1;
        /*$http({url: API_URL+'psamples/list_vl_approval_results', params:CR.sdata}).success(
            function(res){
                CR.result=res.result;
                CR.page=res.page;
            }
        ).error(function(res){showHttpErr(res);});*/

        if(typeof ajx != "undefined"){
            ajx.abort();
        }
        ajx=$.ajax({
            url: API_URL+'psamples/list_vl_approval_results', 
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

    CR.openBDN=function(id){
        show_loader();
        $http({url: API_URL+'psamples/vload_batch_dtl/'+id+'/F'}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.bdn=res.dtl;
                    showModal($("#bdnModal"), true);
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.view_batch_dtl=function(id){
        show_loader();
        $http({url: API_URL+'psamples/vload_batch_dtl/'+id}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.bdtl=res.dtl;
                    showModal($("#bdtlModal"), true);
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.view_test_result=function(id){
        show_loader();
        $("#bdtlModal").addClass('hidden-print');
        $http({url: API_URL+'psamples/vload_test_dtl/'+id}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.test=res.dtl;
                    showModal($("#resultModal"), true);
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.view_trrf_dtl=function(id){
        show_loader();
        $("#bdtlModal").addClass('hidden-print');
        $http({url: API_URL+'psamples/vload_test_dtl/'+id}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.test=res.dtl;
                    $("#trrfModal").modal();
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.closeTrrf=function(){
        $("#bdtlModal").removeClass('hidden-print');
    }

    CR.set_result_status=function(status){
        var data={status:status, samples:""};
        var samples=[];
        $(".chk:checked").each(function(){
            samples.push($(this).val());
        });
        data.samples=samples.join(",");

        show_loader();
        $http({url: API_URL+'psamples/vl_set_result_status', method:'POST', data:data}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    CR.lists(CR.sdata.p);
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.confirm_set_result_status=function(status){
        var ctitle='', cmsg='', n=$(".chk:checked").length;
        switch(status){
            case 3:
                ctitle="Approval action on "+n+" result(s)";
                cmsg='Are you sure? You want to approve the selected test results?';
            break;
            case 4:
                ctitle="Rejection action on "+n+" result(s)";
                cmsg='Are you sure? You want to reject the selected test results?';
            break;
        }
        open_confirm_bootbox(ctitle, cmsg, CR.set_result_status, status);
    }

    CR.showPatDetails = function(data){
        $('.patDtlBox').removeClass('active');
        CR.pD = data;
        $timeout(function(){
            $('.patDtlBox').addClass('active');
        },100);
    }
    CR.closePatBox = function(){
        $('.patDtlBox').removeClass('active');
    }
    
    CR.res_ob={};
    CR.open_record_result=function(rob){
        $(".resultdate").attr('mindate', rob.collection_date);
        CR.res_ob=rob;
        var is_req='N';
        if(typeof rob.result_type_text != "undefined" && rob.result_type_text){
            if(rob.result_type_text.indexOf('Actual')!==-1){
                is_req='Y';
            }
        }
        CR.data={id:rob.id, result_type:rob.result_type+'|'+is_req, result_value:rob.result_value, is_error:rob.is_error, error_code:rob.error_code, result_date:rob.result_date};
        if(rob.result_type==0){
            CR.data.result_type='';
        }
        $("#recordResultModal").modal();
        $timeout(function(){
            set_datepicker($(".resultdate"));
        });
    }
    CR.record_result=function(){
        show_loader();
        $http({url: API_URL+'psamples/vload_record_result', method:'POST', data:CR.data}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    CR.lists(CR.sdata.p);
                    $("#recordResultModal").modal('hide');
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        );
    }
    CR.calc_log_value=function(){
        var v=getNumValue(CR.data.result_value);
        if(!v){
            CR.data.log_value='';
            return;
        }
        CR.data.log_value=Math.log10(v).toFixed(8);
    }
    CR.reverse_log_value=function(){
        var v=getNumValue(CR.data.log_value);
        if(!v){
            CR.data.result_value='';
            return;
        }
        CR.data.result_value=Math.round(Math.pow(10, v));
    }

    CR.init=function(){
        $http({url:API_URL+'psamples/init_result_approval_vl'}).success(
            function(res) {
                CR.result=res.result;
                CR.page=res.page;
                CR.result_types=res.result_types;
                
                $timeout(function(){ngvisible();});
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.init();
});

/** VLtestResult at VL lab*/
angular.module('MetronicApp').controller("VLtestResult", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1};
    CR.pD = {};

    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        /*$http({url: API_URL+'psamples/list_vl_test_results', params:CR.sdata}).success(
            function(res){
                CR.result=res.result;
                CR.page=res.page;
            }
        ).error(function(res){showHttpErr(res);});*/

        if(typeof ajx != "undefined"){
            ajx.abort();
        }
        ajx=$.ajax({
            url: API_URL+'psamples/list_vl_test_results', 
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
		location.href=API_URL+'psamples/export_list_vl_test_results?'+$.param(CR.sdata);
	}

    CR.openBDN=function(id){
        show_loader();
        $http({url: API_URL+'psamples/vload_batch_dtl/'+id+'/F'}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.bdn=res.dtl;
                    showModal($("#bdnModal"), true);
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.view_batch_dtl=function(id){
        show_loader();
        $http({url: API_URL+'psamples/vload_batch_dtl/'+id}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.bdtl=res.dtl;
                    showModal($("#bdtlModal"), true);
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.view_test_result=function(id){
        show_loader();
        $("#bdtlModal").addClass('hidden-print');
        $http({url: API_URL+'psamples/vload_test_dtl/'+id}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.test=res.dtl;
                    showModal($("#resultModal"), true);
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.view_trrf_dtl=function(id){
        show_loader();
        $("#bdtlModal").addClass('hidden-print');
        $http({url: API_URL+'psamples/vload_test_dtl/'+id}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.test=res.dtl;
                    $("#trrfModal").modal();
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.closeTrrf=function(){
        $("#bdtlModal").removeClass('hidden-print');
    }
    
    CR.showPatDetails = function(data){
        $('.patDtlBox').removeClass('active');
        CR.pD = data;
        $timeout(function(){
            $('.patDtlBox').addClass('active');
        },100);
    }
    CR.closePatBox = function(){
        $('.patDtlBox').removeClass('active');
    }
    
    CR.init=function(){
        $http({url:API_URL+'psamples/init_result_vl'}).success(
            function(res) {
                CR.result=res.result;
                CR.page=res.page;
                
                $timeout(function(){ngvisible();});
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.init();
});

/** VLtestResult at Facility */
angular.module('MetronicApp').controller("VLresultFac", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1};
    CR.pD = {};

    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        /*$http({url: API_URL+'psamples/list_vl_result_fac', params:CR.sdata}).success(
            function(res){
                CR.result=res.result;
                CR.page=res.page;
            }
        ).error(function(res){showHttpErr(res);});*/

        if(typeof ajx != "undefined"){
            ajx.abort();
        }
        ajx=$.ajax({
            url: API_URL+'psamples/list_vl_result_fac', 
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
		location.href=API_URL+'psamples/export_list_vl_result_fac?'+$.param(CR.sdata);
	}

    CR.openBDN=function(id){
        show_loader();
        $http({url: API_URL+'psamples/vload_batch_dtl/'+id+'/F'}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.bdn=res.dtl;
                    showModal($("#bdnModal"), true);
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.view_batch_dtl=function(id){
        show_loader();
        $http({url: API_URL+'psamples/vload_batch_dtl/'+id}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.bdtl=res.dtl;
                    showModal($("#bdtlModal"), true);
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.view_test_result=function(id){
        show_loader();
        $("#bdtlModal").addClass('hidden-print');
        $http({url: API_URL+'psamples/vload_test_dtl/'+id}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.test=res.dtl;
                    showModal($("#resultModal"), true);
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.view_trrf_dtl=function(id){
        show_loader();
        $("#bdtlModal").addClass('hidden-print');
        $http({url: API_URL+'psamples/vload_test_dtl/'+id}).success(
            function(res){
                if(!angular.isDefined(res.dtl.id)){
                    show_alert_msg("Invalid Data!", 'E');
                }else{
                    CR.test=res.dtl;
                    $("#trrfModal").modal();
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.closeTrrf=function(){
        $("#bdtlModal").removeClass('hidden-print');
    }
    
    CR.showPatDetails = function(data){
        $('.patDtlBox').removeClass('active');
        CR.pD = data;
        $timeout(function(){
            $('.patDtlBox').addClass('active');
        },100);
    }
    CR.closePatBox = function(){
        $('.patDtlBox').removeClass('active');
    }
    
    CR.init=function(){
        $http({url:API_URL+'psamples/init_vl_result_fac'}).success(
            function(res) {
                CR.result=res.result;
                CR.page=res.page;
                
                $timeout(function(){ngvisible();});
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.init();
});

/** Non Angular Code */
set_datepicker($(".dateInpt"));

function vl_approval_btns_toggle(){
    var n=$(".chk:checked").length;
    var el=' <span class="badge">'+n+'</span>';
    $(".actbtns button span").remove();
    if(n){
        $(".actbtns button").append(el);
        $(".actbtns button").prop('disabled', false);
    }else{
        $(".actbtns button").prop('disabled', true);
    }
}


//angular.element($("#emp_sal_pack_form")[0]).scope().init();
//EOF