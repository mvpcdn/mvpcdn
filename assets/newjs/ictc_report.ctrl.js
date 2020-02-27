angular.module('MetronicApp').controller("ICTCREPORT", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={};
    CR.rpdata={section:'i', data:{}};
    
    CR.generate=function(p){
        show_loader();
        $http({url: API_URL+'ictc_report/generate', params:CR.sdata}).success(
            function(res){
                location.reload();
            }
        );
    }

    CR.ictc_report=function(p){
        if(!CR.sdata.mm){
            show_alert_msg("Select Month", "E"); return;
        }
        show_loader();
        $http({url: API_URL+'ictc_report/ictc_report', params:CR.sdata}).success(
            function(res){
                CR.transmission_route=res.transmission_route;
                CR.education=res.education;
                CR.occupation=res.occupation;
                CR.marital_status=res.marital_status;
                CR.notest_reason=res.notest_reason;
                CR.tb_results=res.tb_results;
                CR.age_groups=res.age_groups;
                
                CR.ictc=res.ictc;
                CR.report=res.report;

                CR.sel_year=res.sel_year;
                CR.sel_month=res.sel_month;
            }
        );
    }

    CR.download_mpr=function(){
        //var url=API_URL+'ictc_report/ictc_report/EXCEL?'+$.param(CR.sdata);
        //location.href=url;
        
        CR.rpdata.fac_code=CR.ictc.fac_code;
        CR.rpdata.fac_name=CR.ictc.fac_name;
        CR.rpdata.yy=CR.sdata.yy;
        CR.rpdata.mm=CR.sdata.mm;
        CR.rpdata.rep_type=CR.rep_type;
        CR.rpdata.topheading=$.trim($(".rp_tophead").text());
        CR.rpdata.heading=$.trim($(".rp_head").text());
        CR.rpdata.subheading=$.trim($(".rp_subhead").text());
        CR.rpdata.section_title=$.trim($(".title_section_"+CR.rpdata.section).text());
        switch(CR.rpdata.section){
            case 'i': case 'ii': case 'iii': case 'ivb': case 'xva':
                CR.rpdata.data=table_data($("table.section_"+CR.rpdata.section));
            break;
            default:
                if(CR.rpdata.rep_type=='PW'){
                    CR.rpdata.data=table_data($("table.section_"+CR.rpdata.section));
                }else{
                    CR.rpdata.data=table_data_extended($("table.section_"+CR.rpdata.section));
                }
            break;
        }

        $("#rp_data").val(JSON.stringify(CR.rpdata));
        $("#rp_dwn_frm").attr('action', API_URL+'ictc_report/ictc_report_excel');
        $("#rp_dwn_frm").submit();
    }

    CR.init=function(){
        CR.ictc={};
        $timeout(function(){
            ngvisible();
            if(CR.sdata.fac_id){
                CR.ictc_report();
            }
        });
    }
    CR.init();
});

angular.module('MetronicApp').controller("ICTCREPORTCONS", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={};
    CR.rpdata={section:'i', data:{}};
    
    CR.generate=function(p){
        show_loader();
        $http({url: API_URL+'ictc_report/generate', params:CR.sdata}).success(
            function(res){
                location.reload();
            }
        );
    }

    CR.ictc_report=function(p){
        ['age_groups', 'transmission_route', 'education', 'occupation', 'marital_status', 'notest_reason', 'tb_results'].forEach(function(v){
            CR[v]=[];
        });


        if(!CR.sdata.mm){
            show_alert_msg("Select Month", "E"); return;
        }
        show_loader();
        $http({url: API_URL+'ictc_report/ictc_report_cons', params:CR.sdata}).success(
            function(res){
                CR.transmission_route=res.transmission_route;
                CR.education=res.education;
                CR.occupation=res.occupation;
                CR.marital_status=res.marital_status;
                CR.notest_reason=res.notest_reason;
                CR.tb_results=res.tb_results;
                CR.age_groups=res.age_groups;
                
                CR.ictc=res.ictc;
                CR.rep_level=res.rep_level;
                CR.report=res.report;

                CR.sel_year=res.sel_year;
                CR.sel_month=res.sel_month;
            }
        );
    }

    CR.download_mpr=function(){
        //var url=API_URL+'ictc_report/ictc_report/EXCEL?'+$.param(CR.sdata);
        //location.href=url;
        
        CR.rpdata.fac_code=CR.ictc.fac_code;
        CR.rpdata.fac_name=CR.ictc.fac_name;
        CR.rpdata.yy=CR.sdata.yy;
        CR.rpdata.mm=CR.sdata.mm;
        CR.rpdata.rep_type=CR.rep_type;
        CR.rpdata.topheading=$.trim($(".rp_tophead").text());
        CR.rpdata.heading=$.trim($(".rp_head").text());
        CR.rpdata.subheading=$.trim($(".rp_subhead").text());
        CR.rpdata.section_title=$.trim($(".title_section_"+CR.rpdata.section).text());
        switch(CR.rpdata.section){
            case 'i': case 'ii': case 'iii': case 'ivb': case 'xva':
                CR.rpdata.data=table_data($("table.section_"+CR.rpdata.section));
            break;
            default:
                if(CR.rpdata.rep_type=='PW'){
                    CR.rpdata.data=table_data($("table.section_"+CR.rpdata.section));
                }else{
                    CR.rpdata.data=table_data_extended($("table.section_"+CR.rpdata.section));
                }
            break;
        }

        $("#rp_data").val(JSON.stringify(CR.rpdata));
        $("#rp_dwn_frm").attr('action', API_URL+'ictc_report/ictc_report_excel');
        $("#rp_dwn_frm").submit();
    }

    CR.init=function(){
        CR.ictc={};
        $timeout(function(){
            ngvisible();
            if(CR.sdata.fac_id){
                CR.ictc_report();
            }
        });
    }
    CR.init();
});

/** Ictc Usage */
angular.module('MetronicApp').controller("IctcUsageReport", function ($http, $timeout) {
    var cr=this;
    cr.sdata={p:1};

    cr.get_districts=function(state_id){
        cr.districts=[];
        cr.all_districts.forEach(function(v){
            if(v.state_id==state_id){
                cr.districts.push(v);
            }
        });
    }
    
    cr.lists=function(p){
        if(!cr.sdata.state){
            show_alert_msg("Select State!", "E"); return;
        }
        cr.sdata.p=p?p:1;
        show_loader();
        $http({url: API_URL+'ictc_report/usage_list', params:cr.sdata}).success(
            function(res){
                cr.result=res.result;
                cr.total=res.total;
            }
        );
    }
    
    cr.download=function(){
        download_excel_from_table("rp_table", "ictc_usage_report");
    }
    
    cr.init=function(){
        cr.odr='fac_name';
        cr.data_keys={
            pw_positive:'PW POSITIVE',
            pw_negative:'PW NEGATIVE',
            pw_indeterminate:'PW INDETERMINATE',
            gc_positive:'GC POSITIVE',
            gc_negative:'GC NEGATIVE',
            gc_indeterminate:'GC INDETERMINATE',
            infant_positive:' INFANT POSITIVE',
            infant_negative:'INFANT NEGATIVE',
            infant_indeterminate:'INFANT INDETERMINATE',
            no_hiv_status:'NO STATUS',
            total:'TOTAL',
        };

        $timeout(function(){ngvisible();});
        show_loader();
        $http({url: API_URL+'ictc_report/init_usage'}).success(
            function(res){
                cr.states=res.states;
                cr.all_districts=res.districts;
            }
        );
    }
    cr.init();
});


/** Ictc Infants Lab Test Report */
angular.module('MetronicApp').controller("IctcInfantTestReport", function ($http, $timeout) {
    var cr=this;
    cr.sdata={test_type:test_type};

    cr.get_districts=function(state_id){
        cr.districts=[];
        cr.all_districts.forEach(function(v){
            if(v.state_id==state_id){
                cr.districts.push(v);
            }
        });
    }
    
    cr.lists=function(p){
        if(!cr.sdata.state){
            show_alert_msg("Select State!", "E"); return;
        }
        cr.sdata.p=p?p:1;
        show_loader();
        $http({url: API_URL+'ictc_report/infants_tests_list_ictc', params:cr.sdata}).success(
            function(res){
                cr.result=res.result;
                cr.total=res.total;
            }
        );
    }
    
    cr.download=function(){
        download_excel_from_table("rp_table", "ictc_infants_report_"+test_type);
    }
    
    cr.init=function(){
        cr.odr='fac_name';
        if(test_type=='DBS'){
            cr.data_keys={
                collected:'SAMPLES COLLECTED',
                dispatched:'SAMPLES DISPATCHED',
                received:'SAMPLES RECEIVED',
                result_recorded:'RESULT RECORDED',
                result_approved:'RESULT APPROVED',
                rejected:'SAMPLES REJECTED',
            };
        }else{
            cr.data_keys={
                collected:'SAMPLES COLLECTED',
                result_recorded:'RESULT RECORDED',
            };
        }

        $timeout(function(){ngvisible();});
        show_loader();
        $http({url: API_URL+'ictc_report/init_infants_tests'}).success(
            function(res){
                cr.states=res.states;
                cr.all_districts=res.districts;
            }
        );
    }
    cr.init();
});



/** Non Angular */
function table_data(tbl){
    var h=[];
    var d=[];
    tbl.find('thead tr th').each(function(){
        h.push($.trim($(this).text()));
    });
    tbl.find('tbody tr').each(function(){
        var rw=[];
        $(this).find('td,th').each(function(){
            rw.push($.trim($(this).text()));
        });
        d.push(rw);
    });
    return {h:h, d:d};
}

function table_data_extended(tbl){
    var left_head=$.trim(tbl.find('thead tr').eq(0).find('th').eq(1).text());
    var d=[];
    
    tbl.find('tbody tr').each(function(){
        var rw=[];
        $(this).find('td,th').each(function(){
            rw.push($.trim($(this).text()));
        });
        d.push(rw);
    });
    return {left_head:left_head, d:d};
}

//EOF