/** User */
angular.module('MetronicApp').controller("User", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1};
    CR.data={};
    
    CR.open_form=function(dtl){
        CR.data=dtl?dtl:{status:'1'};
        hide_form_errors($("#frm"));
		showModal($("#formModal"), true);
    }

    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        $http({url: API_URL+'ctrl/list_users', params:CR.sdata}).success(
            function(res){
                CR.result=res.result;
                CR.page=res.page;
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.save=function(){
		var frm=$("#frm");
		hide_form_errors(frm);
		var formData=new FormData(frm[0]);
		show_loader();
		$http({url:API_URL+'ctrl/save_user', method:'POST', data:formData, headers:{'Content-Type': undefined}}).success(
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

    CR.edit=function(id){
        show_loader();
        $http({url: API_URL+'ctrl/user_detail/'+id}).success(
            function(res){
                CR.open_form(res.dtl);
            }
        ).error(function(res){showHttpErr(res);});
    }
    
    CR.delete=function(id){
        if(!confirm("Are you sure to delete?")){
            return;
        }
        show_loader();
        $http({url: API_URL+'ctrl/delete_user', method:'POST', data:{id:id}}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    var pg=CR.sdata.p;
                    if(CR.page.total==1){
                        pg=1;
                    }
                    CR.lists(pg);
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }
    
    CR.init=function(){
        $http({url:API_URL+'ctrl/init_users'}).success(
            function(res) {
                CR.result=res.result;
                CR.page=res.page;
                CR.level_name=res.level_name;
                CR.user_roles=res.user_roles;
                $timeout(function(){ngvisible();});
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.init();
});

//angular.element($("#emp_sal_pack_form")[0]).scope().init();
//EOF