/** MPR Report */
angular.module('MetronicApp').controller("MPR", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={};
    
    CR.generate=function(p){
        show_loader();
        $http({url: API_URL+'mpr/generate', params:CR.sdata}).success(
            function(res){
                //CR.mpr_report();
                location.reload();
            }
        );
    }

    CR.mpr_report=function(p){
        if(!CR.sdata.mm){
            show_alert_msg("Select Month", "E"); return;
        }
        show_loader();
        $http({url: API_URL+'mpr/mpr_report', params:CR.sdata}).success(
            function(res){
                CR.risk_factors=res.risk_factors;
                CR.age_groups=res.age_groups;
                CR.cohort_months=res.cohort_months;
                
                CR.art=res.art;
                CR.mpr=res.mpr;
                CR.stock_summary=res.stock_summary;
                CR.labdata=res.labdata;

                CR.sel_year=res.sel_year;
                CR.sel_month=res.sel_month;

                $scope.ncol=CR.risk_factors.length+CR.age_groups.length+2;

                /** Manual Data */
                $timeout(function(){
                    $("#frm_tb_others input, #frm_oi_comorbidities input, #frm_alt_line input").val('');
                    if(res.tb_others_data.data){
                        $.each(res.tb_others_data.data, function(k, v){
                            $("#frm_tb_others input[name='"+k+"']").val(v);
                        });
                    }
                    if(res.oi_comorbidities_data.data){
                        $.each(res.oi_comorbidities_data.data, function(k, v){
                            $("#frm_oi_comorbidities input[name='"+k+"']").val(v);
                        });
                    }
                    if(res.alt_line_data.data){
                        $.each(res.alt_line_data.data, function(k, v){
                            $("#frm_alt_line input[name='"+k+"']").val(v);
                        });
                    }
                });
            }
        );
    }

    CR.download_mpr=function(){
        var url=API_URL+'mprexcel/download_excel?'+$.param(CR.sdata);
        location.href=url;
    }

    CR.save_art_dtl=function(){
        var formData=new FormData($("#frm_art")[0]);
        show_loader();
        $http({url:API_URL+'mpr/save_art_dtl', method:'POST', params:CR.sdata, data:formData, headers:{'Content-Type': undefined}}).success(
			function(res) {
				if(res.success){
					show_alert_msg(res.msg);
				}else{
					show_alert_msg(res.msg, 'E');
				}
			}
		);
    }

    CR.save_tb_others=function(){
        var formData=new FormData($("#frm_tb_others")[0]);
        show_loader();
        $http({url:API_URL+'mpr/save_tb_others', method:'POST', params:CR.sdata, data:formData, headers:{'Content-Type': undefined}}).success(
			function(res) {
				if(res.success){
					show_alert_msg(res.msg);
				}else{
					show_alert_msg(res.msg, 'E');
				}
			}
		);
    }
    CR.save_oi_comorbidities=function(){
        var formData=new FormData($("#frm_oi_comorbidities")[0]);
        show_loader();
        $http({url:API_URL+'mpr/save_oi_comorbidities', method:'POST', params:CR.sdata, data:formData, headers:{'Content-Type': undefined}}).success(
			function(res) {
				if(res.success){
					show_alert_msg(res.msg);
				}else{
					show_alert_msg(res.msg, 'E');
				}
			}
		);
    }
    CR.save_alt_line=function(){
        var formData=new FormData($("#frm_alt_line")[0]);
        show_loader();
        $http({url:API_URL+'mpr/save_alt_line', method:'POST', params:CR.sdata, data:formData, headers:{'Content-Type': undefined}}).success(
			function(res) {
				if(res.success){
					show_alert_msg(res.msg);
				}else{
					show_alert_msg(res.msg, 'E');
				}
			}
		);
    }

    CR.open_staff_form=function(dtl){
        CR.art_user=dtl?angular.copy(dtl):{};
        $("#artStaffModal").modal();
    }
    CR.save_art_staff=function(){
        var formData=new FormData($("#frm_art_staff")[0]);
        show_loader();
        $http({url:API_URL+'mpr/save_art_staff', method:'POST', params:CR.sdata, data:formData, headers:{'Content-Type': undefined}}).success(
			function(res) {
				if(res.success){
                    show_alert_msg(res.msg);
                    CR.art.staff_members=res.staff_members;
                    $("#artStaffModal").modal('hide');
				}else{
					show_alert_msg(res.msg, 'E');
				}
			}
		);
    }

    CR.open_link_art_form=function(dtl){
        CR.art_link=dtl?angular.copy(dtl):{fac_type:'2'};
        $('#linkArtModal').modal();
    }
    CR.save_link_art=function(){
        var formData=new FormData($("#frm_link_art")[0]);
        show_loader();
        $http({url:API_URL+'mpr/save_link_art', method:'POST', params:CR.sdata, data:formData, headers:{'Content-Type': undefined}}).success(
			function(res) {
				if(res.success){
                    show_alert_msg(res.msg);
                    CR.art.link_art=res.link_art;
                    $("#linkArtModal").modal('hide');
				}else{
					show_alert_msg(res.msg, 'E');
				}
			}
		);
    }
    
    CR.init=function(){
        CR.art_users_roles=art_users_roles;
        CR.art={};
        $timeout(function(){
            ngvisible();
            if(CR.sdata.fac_id){
                CR.mpr_report();
            }
        });
    }
    CR.init();
});

/** MPRConsolidate Report */
angular.module('MetronicApp').controller("MPRConsolidate", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={};
    CR.report_func='consolidated_art';
    
    CR.mpr_report=function(f){
        if(f){
            CR.report_func=f;
        }

        var arts=$("#art_dd").val();
        if(!arts){
            show_alert_msg("Select ART Center(s)", "E"); return;
        }
        if(!CR.sdata.mm){
            show_alert_msg("Select Month", "E"); return;
        }
        if($("#art_chkall").prop('checked')){
            arts='';
        }
        CR.sdata.arts=arts;

        show_loader();
        $http({url: API_URL+'mpr/'+CR.report_func, method:'POST', data:CR.sdata}).success(
            function(res){
                CR.report_success=true;
                CR.sel_year=res.sel_year;
                CR.sel_month=res.sel_month;
                show_loader();
                $timeout(function(){
                    if(CR.report_func=='consolidated_tb_others_data'){
                        $("#frm_tb_others input").val('');
                        if(res.tb_others_data){
                            $.each(res.tb_others_data, function(k, v){
                                $("#frm_tb_others input[name='"+k+"']").val(v);
                            });
                        }
                    }else if(CR.report_func=='consolidated_oi_comorbidities_data'){
                        $("#frm_oi_comorbidities input").val('');
                        if(res.oi_comorbidities_data){
                            $.each(res.oi_comorbidities_data, function(k, v){
                                $("#frm_oi_comorbidities input[name='"+k+"']").val(v);
                            });
                        }
                    }else if(CR.report_func=='consolidated_alt_line_data'){
                        $("#frm_alt_line input").val('');
                        if(res.alt_line_data){
                            $.each(res.alt_line_data, function(k, v){
                                $("#frm_alt_line input[name='"+k+"']").val(v);
                            });
                        }
                    }else{
                        $("#tab1").html(res.html);
                    }

                    hide_loader();
                });
            }
        );
    }

    CR.download_mpr=function(){
        if($("#art_chkall").prop('checked')){
            $("#arts").val('');
        }else{
            $("#arts").val($("#art_dd").val());
        }
        show_loader();
        $("#mpr_dwn_flg").val(new Date().getTime());
        CR.start_download_loader();
        $('#searchfrm').submit();
    }

    CR.start_download_loader=function(){
        if(getCookie('mpr_dwn_flg')!=$("#mpr_dwn_flg").val()){
            setTimeout(function(){
                CR.start_download_loader();
            }, 1000);
        }else{
            hide_loader();
        }
    }
    
    CR.init=function(){
        CR.art={};
        $timeout(function(){
            ngvisible();
        });
    }
    CR.init();
});

/** Cohort Report */
angular.module('MetronicApp').controller("Cohort", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={};

    CR.cohort_report=function(p){
        if(!CR.sdata.fac_id){
            return;
        }
        CR.sdata.from_date=$("#datef").val();
        CR.sdata.to_date=$("#datet").val();
        if(!CR.sdata.from_date || !CR.sdata.to_date){
            show_alert_msg("Select Date Range", "E"); return;
        }
        CR.sdata.riskfactors=$("#riskfactors_dd").val();
        CR.sdata.agegroups=$("#agegroups_dd").val();
        CR.sdata.gender=$("#gender_dd").val();

        show_loader();
        $http({url: API_URL+'mpr/cohort_report', params:CR.sdata}).success(
            function(res){
                CR.cohort_months=res.cohort_months;
                CR.cohort=res.cohort;

                CR.sel_from=res.sel_from;
                CR.sel_to=res.sel_to;

                $timeout(function(){
                    $(".sticky-tbl-div").scrollTop(0);
                });
            }
        );
    }

    CR.download=function(){
        download_excel_from_table("cohort_table", "cohort_report");
    }

    CR.reset_search=function(clr){
        if(!clr){
            CR.sdata={fac_id:def_fac_id, from_date:def_from_date, to_date:def_to_date};
        }else{
            CR.sdata.from_date='';
            CR.sdata.to_date='';
        }
        $('#datef').datepicker('option', 'minDate', null);
        $('#datef').datepicker('option', 'maxDate', null);
        $('#datet').datepicker('option', 'minDate', null);
        $('#datet').datepicker('option', 'maxDate', null);

        $timeout(function(){
            //set_datepicker($(".dateInpt"));
            $("#datef").datepicker({
                dateFormat: "dd M yy",
                maxDate: 0,
                changeYear: true,
                changeMonth: true,
                onSelect: function (date) {
                    var newd = new Date(date);
                    newd.setMonth(newd.getMonth() + 6);
                    $('#datet').datepicker('option', 'minDate', date);
                    $('#datet').datepicker('option', 'maxDate', newd);
                    $(this).change();
                }
            });
            $('#datet').datepicker({
                dateFormat: "dd M yy",
                maxDate: 0,
                changeYear: true,
                changeMonth: true,
                onSelect: function (date) {
                    var newd = new Date(date);
                    newd.setMonth(newd.getMonth() - 6);
                    $('#datef').datepicker('option', 'minDate', newd);
                    $('#datef').datepicker('option', 'maxDate', date);
                    $(this).change();
                }
            });
        
            $(".chkall").each(function(){
                var ob=$(this).find('input');
                ob.prop('checked', true);
                multiSelectChkAll(ob[0]);
            });
            if(clr){
                return;
            }

            ngvisible();
            CR.cohort_report();
        });
    }
    
    
    CR.init=function(){
        CR.genders={'M':'Male', 'F':'Female', 'TS/TG':'TS/TG'};
        CR.reset_search();
    }
    CR.init();
});

/** Cohort Consolidate Report */
angular.module('MetronicApp').controller("CohortConsolidate", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={};

    CR.cohort_report=function(p){
        var arts=$("#art_dd").val();
        if(!arts){
            show_alert_msg("Select ART Center(s)", "E"); return;
        }
        if($("#art_chkall").prop('checked')){
            arts='';
        }
        CR.sdata.arts=arts;

        CR.sdata.from_date=$("#datef").val();
        CR.sdata.to_date=$("#datet").val();
        if(!CR.sdata.from_date || !CR.sdata.to_date){
            show_alert_msg("Select Date Range", "E"); return;
        }
        CR.sdata.riskfactors=$("#riskfactors_dd").val();
        CR.sdata.agegroups=$("#agegroups_dd").val();
        CR.sdata.gender=$("#gender_dd").val();

        show_loader();
        $http({url: API_URL+'mpr/consolidate_cohort_report', method:'POST', data:CR.sdata}).success(
            function(res){
                CR.report_success=true;
                $("#cohort_report_div").html(res.html);
            }
        );
    }

    CR.download=function(){
        download_excel_from_table("cohort_table", "consolidated_cohort_report");
    }

    CR.reset_search=function(clr, dontcallajax){
        if(!clr){
            CR.sdata={from_date:def_from_date, to_date:def_to_date};
        }else{
            CR.sdata.from_date='';
            CR.sdata.to_date='';
        }
        $('#datef').datepicker('option', 'minDate', null);
        $('#datef').datepicker('option', 'maxDate', null);
        $('#datet').datepicker('option', 'minDate', null);
        $('#datet').datepicker('option', 'maxDate', null);

        $timeout(function(){
            //set_datepicker($(".dateInpt"));
            $("#datef").datepicker({
                dateFormat: "dd M yy",
                maxDate: 0,
                changeYear: true,
                changeMonth: true,
                onSelect: function (date) {
                    var newd = new Date(date);
                    newd.setMonth(newd.getMonth() + 6);
                    $('#datet').datepicker('option', 'minDate', date);
                    $('#datet').datepicker('option', 'maxDate', newd);
                    $(this).change();
                }
            });
            $('#datet').datepicker({
                dateFormat: "dd M yy",
                maxDate: 0,
                changeYear: true,
                changeMonth: true,
                onSelect: function (date) {
                    var newd = new Date(date);
                    newd.setMonth(newd.getMonth() - 6);
                    $('#datef').datepicker('option', 'minDate', newd);
                    $('#datef').datepicker('option', 'maxDate', date);
                    $(this).change();
                }
            });
        
            $(".chkall").not(".facschk").each(function(){
                var ob=$(this).find('input');
                ob.prop('checked', true);
                multiSelectChkAll(ob[0]);
            });
            if(clr){
                return;
            }

            ngvisible();
            if(!dontcallajax){
                CR.cohort_report();
            }
        });
    }
    
    
    CR.init=function(){
        CR.genders={'M':'Male', 'F':'Female', 'TS/TG':'TS/TG'};
        CR.reset_search(0, 1);
    }
    CR.init();
});

//EOF