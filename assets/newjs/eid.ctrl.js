/** EIDBatches */
angular.module('MetronicApp').controller("EIDBatch", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1};

    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        $http({url: API_URL+'ictc/list_eid_batches', params:CR.sdata}).success(
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

    CR.openBDN=function(id){
        show_loader();
        $http({url: API_URL+'ictc/eid_batch_dtl/'+id+'/F'}).success(
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
        $http({url: API_URL+'ictc/eid_batch_dtl/'+id+'/T/T'}).success(
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
        $http({url: API_URL+'ictc/eid_batch_dtl/'+id}).success(
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
        $http({url: API_URL+'ictc/eid_test_dtl/'+id}).success(
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
        $http({url: API_URL+'ictc/eid_test_dtl/'+id}).success(
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

    CR.pick_csample=function(rob){
        var flg=0;
        CR.data.test_results.forEach(function(v){
            if(rob.id==v.id){
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
        $http({url: API_URL+'ictc/eid_collected_samples'}).success(
            function(res){
                CR.csamples=res.csamples;
                CR.open_form();
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.dispatch_eid_samples=function(status){
        var callback=function(status){
            var data={lab_id:CR.data.lab_id, bdn_no:CR.data.bdn_no, test_results:JSON.stringify(CR.data.test_results)};
            //console.log(data);return;
            show_loader();
            $http({url: API_URL+'ictc/dispatch_eid_samples', method:'POST', data:data}).success(
                function(res){
                    if(res.success){
                        show_alert_msg(res.msg);
                        CR.lists(CR.sdata.p);
                        CR.clear_form_data();
                        hideModal($("#formModal"));
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

    CR.res_ob={};
    CR.open_record_result=function(rob, batch_id){
        $(".resultdate").attr('mindate', rob.collection_date);
        CR.res_ob=rob;
        CR.res_ob.batch_id=batch_id;
        CR.resultdata={id:rob.id, result_value:'', batch_id:batch_id, by_fac:'T', result_date:CR.curdate};
        $("#recordResultModal").modal();
        $timeout(function(){
            set_datepicker($(".resultdate"));
            set_datepicker($(".next_follow_up"));
        });
    }
    CR.record_result=function(){
        show_loader();
        $http({url: API_URL+'ictc/eid_record_result', method:'POST', data:CR.resultdata}).success(
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
    
    CR.init=function(){
        CR.curdate=moment().format('DD MMM YYYY');
        if(eid_action=='dispatch'){
            CR.open_dispatch_sample();
        }
        set_numeric_input();
        $http({url:API_URL+'ictc/init_eid_batches'}).success(
            function(res) {
                CR.result=res.result;
                CR.page=res.page;

                $timeout(function(){ngvisible();});
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.init();
});

/** EIDDipatchedBatch */
angular.module('MetronicApp').controller("EIDDipatchedBatch", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1};

    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        $http({url: API_URL+'ictc/list_dispatch_eid', params:CR.sdata}).success(
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
    CR.openBDN=function(id){
        show_loader();
        $http({url: API_URL+'ictc/eid_batch_dtl/'+id+'/F'}).success(
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
        $http({url: API_URL+'ictc/eid_batch_dtl/'+id}).success(
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
        $http({url: API_URL+'ictc/eid_test_dtl/'+id}).success(
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
        $http({url: API_URL+'ictc/eid_test_dtl/'+id}).success(
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
            $http({url: API_URL+'ictc/eid_batch_dtl/'+id}).success(
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
        $http({url: API_URL+'ictc/eid_set_sample_status_multi', method:'POST', data:{data:JSON.stringify(CR.recdata)}}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    $("#recSampleModal").modal('hide');
                    CR.view_batch_dtl(CR.rdtl.id);
                    CR.lists(CR.sdata.p);
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
        $http({url:API_URL+'ictc/init_dispatch_eid'}).success(
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

/** EIDReceivedBatch */
angular.module('MetronicApp').controller("EIDReceivedBatch", function ($scope, $http, $timeout) {
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

        if(typeof ajx != "undefined"){
            ajx.abort();
        }
        ajx=$.ajax({
            url: API_URL+'ictc/list_received_eid_samples', 
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
        $http({url: API_URL+'ictc/eid_batch_dtl/'+id+'/F'}).success(
            function(res){
                if(!angular.isDefined(res.dtl)){
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
        $http({url: API_URL+'ictc/eid_batch_dtl/'+id}).success(
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
        $http({url: API_URL+'ictc/eid_test_dtl/'+id}).success(
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
        $http({url: API_URL+'ictc/eid_test_dtl/'+id}).success(
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
    CR.open_record_result=function(rob, batch_id){
        $(".resultdate").attr('mindate', rob.collection_date);
        CR.res_ob=rob;
        CR.res_ob.batch_id=batch_id;
        CR.resultdata={id:rob.id, result_value:'', batch_id:batch_id, result_date:CR.curdate};
        $("#recordResultModal").modal();
        $timeout(function(){
            set_datepicker($(".resultdate"));
            set_datepicker($(".next_follow_up"));
        });
    }
    CR.record_result=function(){
        show_loader();
        $http({url: API_URL+'ictc/eid_record_result', method:'POST', data:CR.resultdata}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    $("#recordResultModal").modal('hide');
                    CR.lists(CR.sdata.p);
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }
    
    CR.init=function(){
        CR.curdate=moment().format('DD MMM YYYY');
        set_numeric_input();
        $timeout(function(){ngvisible();});
        CR.lists();
    }
    CR.init();
});

/** EIDTestApproval */
angular.module('MetronicApp').controller("EIDTestApproval", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1};
    CR.pD = {};

    CR.lists=function(p){
        $(".allChk,.chk").prop('checked', false);
        eid_approval_btns_toggle();

        show_loader();
        CR.sdata.p=p?p:1;
        if(typeof ajx != "undefined"){
            ajx.abort();
        }
        ajx=$.ajax({
            url: API_URL+'ictc/list_eid_approval_results', 
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
        $http({url: API_URL+'ictc/eid_batch_dtl/'+id+'/F'}).success(
            function(res){
                if(!angular.isDefined(res.dtl)){
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
        $http({url: API_URL+'ictc/eid_batch_dtl/'+id}).success(
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
        $http({url: API_URL+'ictc/eid_test_dtl/'+id}).success(
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
        $http({url: API_URL+'ictc/eid_test_dtl/'+id}).success(
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
        $http({url: API_URL+'ictc/eid_set_result_status', method:'POST', data:data}).success(
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
    
    CR.init=function(){
        CR.curdate=moment().format('DD MMM YYYY');
        set_numeric_input();
        $timeout(function(){ngvisible();});
        CR.lists();
    }
    CR.init();
});

/** EIDTestResult */
angular.module('MetronicApp').controller("EIDTestResult", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1, pagefrom:pagefrom};
    CR.pD={};

    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        if(typeof ajx != "undefined"){
            ajx.abort();
        }
        ajx=$.ajax({
            url: API_URL+'ictc/list_eid_results', 
            data:CR.sdata,
            success:function(res){
                hide_loader();
                $scope.$apply(function(){
                    CR.result=res.result;
                    CR.page=res.page;
                    CR.LOC_TYPE=res.LOC_TYPE;
                });
            }
        });
    }
    CR.set_lists_order=function(orderby){
        CR.sdata.orderby=orderby;
        CR.lists();
    }
    CR.export_lists=function(){
		location.href=API_URL+'ictc/export_list_eid_results?'+$.param(CR.sdata);
	}

    CR.openBDN=function(id){
        show_loader();
        $http({url: API_URL+'ictc/eid_batch_dtl/'+id+'/F'}).success(
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
        $http({url: API_URL+'ictc/eid_batch_dtl/'+id}).success(
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
        $http({url: API_URL+'ictc/eid_test_dtl/'+id}).success(
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
        $http({url: API_URL+'ictc/eid_test_dtl/'+id}).success(
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

    CR.view_test_history=function(id,test_id){
        CR.vdata={art_refer:CR.def_art_refer, followup_date:'', id:id, test_result_id:test_id};
        $timeout(function(){
            $("#facs_art_dd_pre").change();
            set_datepicker($(".dateInpt"));
        });
        show_loader();
        $http({url: API_URL+'ictc/beneficiary_detail/'+id}).success(
            function(res){
                CR.pdtl=res.dtl;
                $("#testHistoryModal").modal();
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.refer_to_art=function(){
        show_loader();
        $http({url: API_URL+'ictc/refer_to_art', method:'POST', data:CR.vdata}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    $("#testHistoryModal").modal('hide');
                    CR.lists(CR.sdata.p);
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.set_follow_up_date=function(){
        show_loader();
        $http({url: API_URL+'ictc/set_follow_up_date', method:'POST', data:CR.vdata}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    $("#testHistoryModal").modal('hide');
                    //CR.lists(CR.sdata.p);
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.res_ob={};
    CR.open_record_result=function(rob, batch_id){
        $(".resultdate").attr('mindate', rob.collection_date);
        CR.res_ob=rob;
        CR.res_ob.batch_id=batch_id;
        CR.resultdata={id:rob.id, result_value:'', batch_id:batch_id, by_fac:'T', result_date:CR.curdate};
        $("#recordResultModal").modal();
        $timeout(function(){
            set_datepicker($(".resultdate"));
            set_datepicker($(".next_follow_up"));
        });
    }
    CR.record_result=function(){
        show_loader();
        $http({url: API_URL+'ictc/eid_record_result', method:'POST', data:CR.resultdata}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    $("#recordResultModal").modal('hide');
                    CR.lists(CR.sdata.p);
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }
    
    CR.init=function(){
        CR.curdate=moment().format('DD MMM YYYY');
        CR.def_art_refer=def_art_refer;
        $timeout(function(){
            ngvisible();
            apply_select2($("#facs_art_dd_pre"), "Select ART");
        });
        CR.lists();
    }
    CR.init();
});

/** Non Angular Code */
set_datepicker($(".dateInpt"));

function eid_approval_btns_toggle(){
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