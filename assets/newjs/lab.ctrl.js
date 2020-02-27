/** Laboratory */
angular.module('MetronicApp').controller("Laboratory", function ($scope, $http, $timeout) {
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
        CR.data=dtl?dtl:{status:'1', lab_id:''};
        hide_form_errors($("#frm"));
        showModal($("#formModal"), true);
    }

    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        $http({url: API_URL+'psamples/list_laboratories', params:CR.sdata}).success(
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
		$http({url:API_URL+'psamples/save_laboratory', method:'POST', data:formData, headers:{'Content-Type': undefined}}).success(
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
        $http({url: API_URL+'psamples/laboratory_detail/'+id}).success(
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
        $http({url: API_URL+'psamples/delete_laboratory', method:'POST', data:{id:id}}).success(
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

    CR.sel_lab_type='';
    CR.view_maping_facs=function(rob, show_unmapped){
        CR.show_unmapped=show_unmapped;
        CR.search_unmapped='';
        CR.search_mapped='';
        CR.sdata_unmapped={state_id:rob.state_id};
        CR.sel_lab=rob;
        CR.sel_lab_type=rob.lab_type;
        show_loader();
        $http({url: API_URL+'psamples/lab_maping_facs/'+rob.lab_id+'/'+rob.lab_type, params:CR.sdata_unmapped}).success(
            function(res){
                CR.unmapped_facs=res.unmapped_facs;
                CR.mapped_facs=res.mapped_facs;
                $("#mappedFacsModal").modal();

                $timeout(function(){$(".tbl-h1").scrollTop(0);});
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.list_unmapped_facs=function(){
        CR.search_unmapped='';
        show_loader();
        $http({url: API_URL+'psamples/lab_unmapped_facs/'+CR.sel_lab.lab_id+'/'+CR.sel_lab_type, params:CR.sdata_unmapped}).success(
            function(res){
                CR.unmapped_facs=res.unmapped_facs;
                $timeout(function(){$(".tbl-h1 .t1").scrollTop(0);});
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.list_mapped_facs=function(){
        CR.search_mapped='';
        show_loader();
        $http({url: API_URL+'psamples/lab_mapped_facs/'+CR.sel_lab.lab_id}).success(
            function(res){
                CR.mapped_facs=res.mapped_facs;
                $timeout(function(){$(".tbl-h1 .t2").scrollTop(0);});
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.pick_fac=function(fac_id, i){
        CR.search_mapped='';
        show_loader();
        $http({url: API_URL+'psamples/lab_pick_fac', method:'POST', data:{lab_id:CR.sel_lab.lab_id, fac_id:fac_id}}).success(
            function(res){
                if(res.success){
                    CR.unmapped_facs.splice(i,1);
                    show_alert_msg(res.msg);
                    CR.mapped_facs=res.mapped_facs;
                    CR.sel_lab.no_of_fac_mapped=CR.mapped_facs.length;
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.pick_fac_all=function(){
        var callback=function(){
            CR.search_mapped='';
            var fac_ids=[];
            CR.unmapped_facs.forEach(function(v){
                fac_ids.push(v.fac_id);
            });

            show_loader();
            $http({url: API_URL+'psamples/lab_pick_fac_all', method:'POST', data:{lab_id:CR.sel_lab.lab_id, fac_ids:fac_ids.join(",")}}).success(
                function(res){
                    if(res.success){
                        CR.unmapped_facs=[];
                        show_alert_msg(res.msg);
                        CR.mapped_facs=res.mapped_facs;
                        CR.sel_lab.no_of_fac_mapped=CR.mapped_facs.length;
                    }else{
                        show_alert_msg(res.msg, 'E');
                    }
                }
            ).error(function(res){showHttpErr(res);});
        }

        open_confirm_bootbox("Confirmation", "Are you sure? You want to map all listed facilities?", callback);
    }
    CR.unpick_fac=function(fac_id, i){
        var callback=function(arg){
            var fac_id=arg.fac_id, i=arg.i;
            CR.search_unmapped='';
            var fac_ids=[];
            if(!fac_id){
                CR.filtered_facs.forEach(function(v){
                    fac_ids.push(v.fac_id);
                });
            }
            
            show_loader();
            $http({url: API_URL+'psamples/lab_unpick_fac', method:'POST', data:{lab_id:CR.sel_lab.lab_id, fac_id:fac_id, fac_ids:fac_ids.join(",")},  params:CR.sdata_unmapped}).success(
                function(res){
                    if(res.success){
                        if(!fac_id){
                            CR.mapped_facs=res.mapped_facs;
                        }else{
                            CR.mapped_facs.splice(i,1);
                        }
                        show_alert_msg(res.msg);
                        CR.unmapped_facs=res.unmapped_facs;
                        CR.sel_lab.no_of_fac_mapped=CR.mapped_facs.length;
                    }else{
                        show_alert_msg(res.msg, 'E');
                    }
                }
            ).error(function(res){showHttpErr(res);});
        }

        var cmsg=fac_id?"Are you sure? You want to remove this Facility?":"Are you sure? You want to remove all showing Facilties?";
        open_confirm_bootbox("Confirmation", cmsg, callback, {fac_id:fac_id, i:i});
    }
    
    CR.init=function(){
        if(lab_action=='create'){
            $timeout(function(){CR.open_form();});
        }

        CR.filtered_facs=[];
        $http({url:API_URL+'psamples/init_laboratory'}).success(
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