/** CmssData */
angular.module('MetronicApp').controller("CmssData", function ($http, $timeout) {
    var CR=this;
    CR.sdata={p:1};
    CR.sdata_po={};
    CR.sdata_store={};
    CR.data={};
    CR.tbl_cols=tbl_cols;

    CR.fetch_cmss_data=function(){
        show_loader();
        $http({url: API_URL+'cmss/fetch_cmss_data'}).success(
            function(res){
                //CR.lists();
                location.reload();
            }
        );
    }
    
    CR.lists=function(p){
        CR.sdata.p=p?p:1;
        show_loader();
        $http({url: API_URL+'cmss/cmss_data_list', params:CR.sdata}).success(
            function(res){
                CR.result=res.result;
                CR.page=res.page;
                $timeout(function(){
                    $("#tab1 .sticky-tbl").scrollTop(0);
                });
            }
        );
    }
    CR.set_lists_order=function(orderby){
        CR.sdata.orderby=orderby;
        CR.lists();
    }
    CR.export_lists=function(){
		location.href=API_URL+'cmss/export_cmss_data_list?'+$.param(CR.sdata);
    }

    CR.lists_store_wise=function(tab){
        if(tab){
            if(angular.isDefined(CR.store_tab)){
                return;
            }
            CR.store_tab=true;
        }
        show_loader();
        $http({url: API_URL+'cmss/cmss_data_list_store_wise'}).success(
            function(res){
                CR.result_store=res.result;
                $timeout(function(){
                    $("#tab2 .sticky-tbl").scrollTop(0);
                });
            }
        );
    }
    CR.export_lists_store_wise=function(){
		location.href=API_URL+'cmss/export_cmss_data_list_store_wise?'+$.param(CR.sdata_store);
    }
    CR.store_products_date_wise=function(rob, date_k){
        CR.filter_dw='';
        CR.date_k=date_k;
        show_loader();
        $http({url: API_URL+'cmss/cmss_data_list_store_date_wise/'+date_k, params:{store_id:rob.store_id, date:rob[date_k+'_earliest']}}).success(
            function(res){
                CR.result_dw=res.result;
                CR.dw_total=res.total;
                $("#dateWiseModal").modal();
                $timeout(function(){
                    $("#dateWiseModal .sticky-tbl").scrollTop(0);
                });
            }
        );
    }
    CR.store_products_batch_nd_po_wise=function(rob, grp){
        CR.filter_bp='';
        CR.grp=grp;
        show_loader();
        $http({url: API_URL+'cmss/cmss_data_list_store_batch_nd_po_wise/'+grp, method:'POST', data:{store_id:rob.store_id, drug_name:rob.drug_name}}).success(
            function(res){
                CR.result_bp=res.result;
                CR.bp_total=res.total;
                $("#bpWiseModal").modal();
                $timeout(function(){
                    $("#bpWiseModal .sticky-tbl").scrollTop(0);
                });
            }
        );
    }
    
    CR.lists_po_wise=function(tab){
        if(tab){
            if(angular.isDefined(CR.po_tab)){
                return;
            }
            CR.po_tab=true;
        }
        show_loader();
        $http({url: API_URL+'cmss/cmss_data_list_po_wise'}).success(
            function(res){
                CR.result_po=res.result;
                $timeout(function(){
                    $("#tab3 .sticky-tbl").scrollTop(0);
                });
            }
        );
    }
    CR.export_lists_po_wise=function(){
		location.href=API_URL+'cmss/export_cmss_data_list_po_wise?'+$.param(CR.sdata_po);
    }
    CR.show_po_items=function(po_no){
        CR.sel_po=po_no;
        CR.filter_po={};
        show_loader();
        $http({url: API_URL+'cmss/cmss_data_list', params:{po:po_no}}).success(
            function(res){
                CR.po_items=res.result;
                CR.po_total=res.total;
                $("#poItemsModal").modal();
                $timeout(function(){
                    $("#poItemsModal .sticky-tbl").scrollTop(0);
                });
            }
        );
    }

    CR.lists_warehouses=function(){
        show_loader();
        $http({url: API_URL+'cmss/cmss_warehouses'}).success(
            function(res){
                CR.warehouses=res.result;
                CR.warehouses.push({});
            }
        );
    }
    CR.add_warehouse=function(){
        CR.warehouses.push({});
        $timeout(function(){
            $(".whtblbx").scrollTop(10000);
        });
    }
    CR.remove_warehouse=function(i){
        CR.warehouses.splice(i,1);
    }
    CR.save_warehouse=function(){
        var frm=$("#whform");
		var formData=new FormData(frm[0]);
		show_loader();
		$http({url:API_URL+'cmss/save_warehouse', method:'POST', data:formData, headers:{'Content-Type': undefined}}).success(
			function(res) {
				if(res.success){
					CR.warehouses=res.result;
                    CR.warehouses.push({});
                    show_alert_msg(res.msg);
				}else{
					show_alert_msg(res.msg, 'E');
				}
			}
		);
    }
    CR.lists_sacs=function(){
        show_loader();
        $http({url: API_URL+'cmss/sacs'}).success(
            function(res){
                CR.sacs=res.sacs;
                CR.all_warehouses=res.warehouses;
            }
        );
    }
    CR.set_unmapped_warehouses=function(){
        CR.unmapped_warehouses=[];
        CR.all_warehouses.forEach(function(v){
            var ob={store_id:v.store_id, store_name:v.store_name, added:false};
            var flg=0;
            CR.sel_sacs.stores.forEach(function(v1){
                if(v.store_id==v1.store_id){
                    flg=1;
                }
            });
            if(flg==0){
                CR.unmapped_warehouses.push(ob);
            }
        });
    }
    CR.open_warehouse_map=function(rob){
        CR.sel_sacs=rob;
        CR.set_unmapped_warehouses();
        $("#mapWHModal").modal();
    }
    CR.pick_wh=function(store_id){
        show_loader();
        $http({url: API_URL+'cmss/add_store_to_sacs/'+store_id+'/'+CR.sel_sacs.loc_id}).success(
            function(res){
                if(res.success){
                    CR.sel_sacs.stores=res.stores;
                    CR.sel_sacs.no_of_stores=res.stores.length;
                    CR.set_unmapped_warehouses();
                    show_alert_msg(res.msg);
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        );
    }
    CR.remove_wh=function(id){
        show_loader();
        $http({url: API_URL+'cmss/remove_store_from_sacs/'+id+'/'+CR.sel_sacs.loc_id}).success(
            function(res){
                if(res.success){
                    CR.sel_sacs.stores=res.stores;
                    CR.sel_sacs.no_of_stores=res.stores.length;
                    CR.set_unmapped_warehouses();
                    show_alert_msg(res.msg);
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        );
    }
    
    CR.init=function(){
        $timeout(function(){ngvisible();});
        CR.lists();
    }
    CR.init();
});


//angular.element($("#emp_sal_pack_form")[0]).scope().init();
//EOF