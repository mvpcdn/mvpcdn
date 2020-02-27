/** Transferred Out */
angular.module('MetronicApp').controller("TransferredOut", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1};

    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        CR.sdata.stype=$("[name='stype']:checked").val();
        $http({url: API_URL+'patients/list_transferred_outs', params:CR.sdata}).success(
            function(res){
                CR.result=res.result;
                CR.page=res.page;
            }
        );
    }
    CR.set_lists_order=function(orderby){
        CR.sdata.orderby=orderby;
        CR.lists();
    }
    CR.export_lists=function(){
        CR.sdata.stype=$("[name='stype']:checked").val();
		location.href=API_URL+'patients/list_transferred_outs/EXPORT?'+$.param(CR.sdata);
	}
    CR.clear_search=function(){
        CR.sdata={p:1};
        CR.lists();
    }
    
    CR.init=function(){
        /* show_loader();
        $http({url:API_URL+'ictc/init_beneficiary'}).success(
            function(res) {
                CR.lists();
            }
        ); */

        $timeout(function(){
            ngvisible();
            set_numeric_input();
            set_datepicker($(".dateInpt"));          
        });

        CR.lists();
    }
    CR.init();
});


//angular.element($("#emp_sal_pack_form")[0]).scope().init();
//EOF