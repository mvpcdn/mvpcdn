angular.module('MetronicApp').controller("InventoryProducts", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1, orderby:''};
    
    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        $http({url: API_URL+'ctrl/list_inventory_products', params:CR.sdata}).success(
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
    CR.export_lists=function(){
		location.href=API_URL+'ctrl/export_list_inventory_products?'+$.param(CR.sdata);
	}
    
    CR.init=function(){
        $timeout(function(){
            ngvisible();
        });
        CR.lists();
    }
    CR.init();
});

//EOF