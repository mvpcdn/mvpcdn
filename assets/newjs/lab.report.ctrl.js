/** DueList Report */
angular.module('MetronicApp').controller("DueList", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1, to_date:moment().format('DD MMM YYYY'), orderby:''};
    $("#pstatus_dd").val([1,2,7,12]);

    
    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        var ps=$("#pstatus_dd").val();
        CR.sdata.patient_status=ps?ps.join(','):'';
        $http({url: API_URL+'labreport/list_due', params:CR.sdata}).success(
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
        var ps=$("#pstatus_dd").val();
        CR.sdata.patient_status=ps?ps.join(','):'';
		location.href=API_URL+'labreport/export_list_due?'+$.param(CR.sdata);
	}
    
    CR.init=function(){
        $timeout(function(){
            ngvisible();
            set_datepicker($(".dateInpt"));
            apply_select2($("#pstatus_dd"), 'Patient Status (ALL)');
        });
        CR.lists();
    }
    CR.init();
});


/** VL Lab Monthly Report */
angular.module('MetronicApp').controller("VLLabMonthlyReport", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={};

    CR.vl_lab_monthly_report=function(){
        if(!CR.sdata.lab_id){
            show_alert_msg("Select Laboratory", "E"); return;
        }
        if(!CR.sdata.year){
            show_alert_msg("Select Year", "E"); return;
        }
        if(!CR.sdata.month){
            show_alert_msg("Select Month", "E"); return;
        }
        show_loader();
        $http({url: API_URL+'labreport/vl_lab_monthly_report', params:CR.sdata}).success(
            function(res){
                CR.lab=res.lab;
                CR.monthyear=res.monthyear;
                CR.no_of_days=res.no_of_days;
                CR.data=res.data;
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.download_vl_report=function(){
        var url=API_URL+'labreport/download_vl_report?'+$.param(CR.sdata);
        location.href=url;
    }
    CR.init=function(){
        $timeout(function(){
            ngvisible();
            //apply_select2($("#labs_dd"), 'Select Laboratory');
        });
    }
    CR.init();
});


/** VL ART Daily Report */
angular.module('MetronicApp').controller("VLARTDailyReport", function ($scope, $http, $timeout) {
    var CR=this;
    var curdate=moment().format('DD MMM YYYY');
    CR.sdata={from_date:curdate, to_date:curdate};
    CR.orderby="collection_date";

    CR.lists=function(){
        show_loader();
        $http({url: API_URL+'labreport/vl_art_daily_report', params:CR.sdata}).success(
            function(res){
                if(!res.success){
                    show_alert_msg(res.msg, 'E');
                    CR.data=null;
                    return;
                }
                CR.data=res.data;
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.set_list_order=function(orderby){
        CR.orderby=orderby;
    }
    CR.vl_art_daily_excel=function(){
        var url=API_URL+'labreport/vl_art_daily_excel?'+$.param(CR.sdata);
        location.href=url;
    }
    CR.init=function(){
        $timeout(function(){
            ngvisible();
            init_one_month_date_range();
            CR.lists();
        });
    }
    CR.init();
});


/** VL ART Rejection Report */
angular.module('MetronicApp').controller("VLARTRejectionReport", function ($scope, $http, $timeout) {
    var CR=this;
    var curdate=moment().format('DD MMM YYYY');
    CR.sdata={from_date:curdate, to_date:curdate};
    CR.orderby="collection_date";

    CR.lists=function(){
        show_loader();
        $http({url: API_URL+'labreport/vl_art_rejection_report', params:CR.sdata}).success(
            function(res){
                if(!res.success){
                    show_alert_msg(res.msg, 'E');
                    CR.data=null;
                    return;
                }
                CR.data=res.data;
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.set_list_order=function(orderby){
        CR.orderby=orderby;
    }
    
    CR.init=function(){
        $timeout(function(){
            ngvisible();
            init_one_month_date_range();
            CR.lists();
        });
    }
    CR.init();
});


/** VL ART National Report */
angular.module('MetronicApp').controller("VLARTNationalReport", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={};
    CR.orderby="collection_date";

    CR.lists=function(){
        show_loader();
        $http({url: API_URL+'labreport/vl_art_national_report', params:CR.sdata}).success(
            function(res){
                if(!res.success){
                    show_alert_msg(res.msg, 'E');
                    CR.data=null;
                    return;
                }
                CR.data=res.data;
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.set_list_order=function(orderby){
        CR.orderby=orderby;
    }
    
    CR.init=function(){
        $timeout(function(){
            ngvisible();
            CR.lists();
        });
    }
    CR.init();
});


/** VL LAB National Report */
angular.module('MetronicApp').controller("VLLABNationalReport", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={};
    CR.orderby="collection_date";

    CR.lists=function(){
        show_loader();
        $http({url: API_URL+'labreport/vl_lab_national_report', params:CR.sdata}).success(
            function(res){
                if(!res.success){
                    show_alert_msg(res.msg, 'E');
                    CR.data=null;
                    return;
                }
                CR.data=res.data;
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.set_list_order=function(orderby){
        CR.orderby=orderby;
    }
    
    CR.init=function(){
        $timeout(function(){
            ngvisible();
            CR.lists();
        });
    }
    CR.init();
});


/** Non Angular */
function init_one_month_date_range(){
    $("#datef").datepicker({
        dateFormat: "dd M yy",
        onSelect: function (date) {
            var newd = new Date(date);
            newd.setMonth(newd.getMonth() + 1);
            $('#datet').datepicker('option', 'minDate', date);
            $('#datet').datepicker('option', 'maxDate', newd);
            $(this).change();
            angular.element($("#datef")).triggerHandler('input');
        }
    });
    $('#datet').datepicker({
        dateFormat: "dd M yy",
        onSelect: function (date) {
            var newd = new Date(date);
            newd.setMonth(newd.getMonth() - 1);
            $('#datef').datepicker('option', 'minDate', newd);
            $('#datef').datepicker('option', 'maxDate', date);
            $(this).change();
            angular.element($("#datet")).triggerHandler('input');
        }
    });
}

//EOF