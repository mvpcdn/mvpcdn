angular.module('MetronicApp').controller("EmailMsg", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1};
    CR.data={};
    
    CR.open_form=function(dtl){
        CR.data=dtl?dtl:{type:'EMAIL'};
        hide_form_errors($("#frm"));
		showModal($("#formModal"), true);
    }

    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        $http({url: API_URL+'ctrl/list_email_msg', params:CR.sdata}).success(
            function(res){
                CR.result=res.result;
                CR.page=res.page;
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.send=function(){
		var frm=$("#frm");
		hide_form_errors(frm);
		var formData=new FormData(frm[0]);
		show_loader();
		$http({url:API_URL+'ctrl/send_email_msg_to_role_users', method:'POST', data:formData, headers:{'Content-Type': undefined}}).success(
			function(res) {
				if(res.success){
					show_alert_msg(res.msg);
					CR.lists(CR.data.id?CR.sdata.p:1);
					hideModal($("#formModal"));
				}else{
					show_form_errors(res.errors, frm, true);
					show_alert_msg(res.msg, 'E');
				}
			}
		).error(function(res){showHttpErr(res);});
    }
    
    CR.init=function(){
        CR.lists();
        $timeout(function(){ngvisible();});
    }
    CR.init();
});



//angular.element($("#emp_sal_pack_form")[0]).scope().init();
//EOF