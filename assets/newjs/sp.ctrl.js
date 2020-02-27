/** LabTestDispReport */
angular.module('MetronicApp').controller("LabTestDispReport", function ($http, $timeout) {
    var cr=this;
    cr.sdata={p:1};
    
    cr.lists=function(p){
        if(!cr.sdata.sacs_id){
            show_alert_msg("SACS Required!", "E"); return;
        }
        if(!cr.sdata.from_date){
            show_alert_msg("From Date Required!", "E"); return;
        }
        if(!cr.sdata.to_date){
            show_alert_msg("From Date Required!", "E"); return;
        }
        cr.sdata.p=p?p:1;
        show_loader();
        $http({url: API_URL+'sp/lab_test_disp_report_list', params:cr.sdata}).success(
            function(res){
                cr.result=res.result;
                cr.page=res.page;
            }
        );
    }
    
    cr.export_lists=function(){
		location.href=API_URL+'sp/export_lab_test_disp_report_list?'+$.param(cr.sdata);
    }

    cr.download=function(){
        download_excel_from_table("rp_table", "lab_test_disp_report");
    }
    
    cr.init=function(){
        $timeout(function(){ngvisible();});
        //cr.lists();
    }
    cr.init();
});


//angular.element($("#id")[0]).scope().init();
//EOF