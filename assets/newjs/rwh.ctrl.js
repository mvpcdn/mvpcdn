/** RWH */
angular.module('MetronicApp').controller("RWH", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1};
    CR.data={};
    
    CR.get_districts=function(state_id, district_id){
        CR.districts=[];
        CR.data.district_id=district_id?district_id:'';
        if(!state_id){
            return;
        }
        CR.all_districts.forEach(function(v){
            if(v.state_id==state_id){
                CR.districts.push(v);
            }
        })
    }

    CR.open_form=function(dtl){
        CR.districts=[];
        if(dtl){
            CR.get_districts(dtl.state);
        }
        CR.data=dtl?dtl:{status:'1', rwh_id:''};
        hide_form_errors($("#frm"));
        showModal($("#formModal"), true);
    }

    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        $http({url: API_URL+'rwh/lists', params:CR.sdata}).success(
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

    CR.save=function(){
		var frm=$("#frm");
		hide_form_errors(frm);
		var formData=new FormData(frm[0]);
		show_loader();
		$http({url:API_URL+'rwh/save', method:'POST', data:formData, headers:{'Content-Type': undefined}}).success(
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
        $http({url: API_URL+'rwh/detail/'+id}).success(
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
        $http({url: API_URL+'rwh/delete', method:'POST', data:{id:id}}).success(
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
        if(rwh_action=='create'){
            $timeout(function(){CR.open_form();});
        }

        CR.filtered_facs=[];
        $http({url:API_URL+'rwh/init'}).success(
            function(res) {
                CR.result=res.result;
                CR.page=res.page;
                
                CR.states=res.states;
                CR.all_districts=res.districts;
                CR.user_roles=res.user_roles;

                $timeout(function(){ngvisible();});
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.init();
});



//angular.element($("#emp_sal_pack_form")[0]).scope().init();
//EOF