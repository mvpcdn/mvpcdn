/** Beneficiary */
angular.module('MetronicApp').controller("Beneficiary", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1, pagefrom:ictc_pagefrom};
    CR.data={};

    CR.get_districts=function(state_id, district_id){
        CR.districts=[];
        CR.data.district=district_id?district_id:'';
        if(!state_id){
            return;
        }
        CR.all_districts.forEach(function(v){
            if(v.state_id==state_id){
                CR.districts.push(v);
            }
        })
    }

    CR.create_mother_select2_dd=function(defaultdata){
        CR.data.mother_id='';
        $timeout(function(){
            patient_select2_ajax($("#mother_dd"), API_URL+'ictc/patient_search_dd/'+CR.data.mother_art+'/F', '', defaultdata);
        });
    }
    
    CR.open_form=function(dtl){
        CR.districts=[];
        if(dtl){
            CR.get_districts(dtl.state);
        }else{
            CR.get_districts(CR.facdtl.state);
        }
        if(!dtl){
            CR.gconfirm=false;
        }else{
            CR.gconfirm=true;
        }
        CR.data=dtl?dtl:{visit_date:CR.today_date, gender:'M', state:CR.facdtl.state, district:CR.facdtl.district_id, consent_filled:'Y', pregnent:'N', tb_symptoms:'N', syphilis_symptoms:'N', art_refer:'', dsrc_refer:'', rntcp_refer:'', dsrc_chk:false, rntcp_chk:false, mother_art:CR.def_art_refer};
        if(!CR.data.dsrc_refer){
            CR.data.dsrc_refer=CR.def_dsrc_refer;
        }else{
            CR.data.dsrc_chk=true;
        }
        if(!CR.data.rntcp_refer){
            CR.data.rntcp_refer=CR.def_rntcp_refer;
        }else{
            CR.data.rntcp_chk=true;
        }

        if(CR.sdata.pagefrom=='INFANT' && !dtl){
            CR.data.category='INFANT';
        }

        if(CR.data.pregnent=='Y' || CR.data.syphilis_symptoms=='Y'){
            CR.data.dsrc_chk=true;
        }
        if(CR.data.tb_symptoms=='Y'){
            CR.data.rntcp_chk=true;
        }

        if(!CR.data.art_refer){
            CR.data.art_refer=CR.def_art_refer;
        }
        
        hide_form_errors($("#frm"));
        showModal($("#formModal"), true);
        
        $timeout(function(){
            apply_select2($("#facs_dsrc"));
            apply_select2($("#facs_rntc"));
            apply_select2($("#facs_art_mother"));
            set_datepicker($(".dateInpt"));

            apply_select2($("#facs_art_dd_pre"), "Select ART");
        });

        if(dtl && dtl.category=='INFANT'){
            var t=dtl.mother_name;
            if(dtl.mother_art_num!=''){
                t=t+' [ART: '+dtl.mother_art_num+']';
            }
            if(dtl.mother_pre_art_num!=''){
                t=t+' [PRE-ART: '+dtl.mother_pre_art_num+']';
            }
            if(dtl.mother_regimen!=''){
                t=t+' [Regimen: '+dtl.mother_regimen+']';
            }
            CR.create_mother_select2_dd({id:dtl.mother_id, text:t});
        }else{
            CR.create_mother_select2_dd('');
        }

        if(typeof dtl!= "undefined"){
            if(dtl.drugs_habit){
                CR.data.drugshabit = {'used':false,'shared':false,'no':false,'rta':false}
                dtl.drugs_habit.forEach(function(v){
                    if(v=='Used'){
                        CR.data.drugshabit.used=true;
                    }
                    if(v=='Shared'){
                        CR.data.drugshabit.shared=true;
                    }
                    if(v=='No'){
                        CR.data.drugshabit.no=true;
                    }
                    if(v=='Refuse to answer'){
                        CR.data.drugshabit.rta=true;
                    }
                });
            }
            if(dtl.sex_partner_kind){
                CR.data.sex_kind = {'male':false,'female':false,'tg':false,'no':false,'rta':false}
                dtl.sex_partner_kind.forEach(function(v){
                    if(v=='Male'){
                        CR.data.sex_kind.male=true;
                    }
                    if(v=='Female'){
                        CR.data.sex_kind.female=true;
                    }
                    if(v=='TG'){
                        CR.data.sex_kind.tg=true;
                    }
                    if(v=='No Sexual partner'){
                        CR.data.sex_kind.no=true;
                    }
                    if(v=='Refuse to answer'){
                        CR.data.sex_kind.rta=true;
                    }
                })
            }
        }

        $('[name="pid_num"]').val('');
        $('[name="infant_num"]').val('');
    }

    CR.openRiskQuestions = function(){
        showModal($("#riskModal"), true);
    }

    CR.riskQuesClose = function(){
        hideModal($("#riskModal"));
    }

    CR.cat_change=function(){
        CR.data.pregnent='N';
        CR.data.dsrc_chk=false;
        CR.data.rntcp_chk=false;
        if(CR.data.category=='INFANT'){
            CR.data.tb_symptoms='N';
            CR.data.syphilis_symptoms='N';
        }
        if(CR.data.pregnent=='Y' || CR.data.syphilis_symptoms=='Y'){
            CR.data.dsrc_chk=true;
        }
        if(CR.data.tb_symptoms=='Y'){
            CR.data.rntcp_chk=true;
        }
    }
    CR.calc_category=function(){
        var noofmonths=(getNumValue(CR.data.age_y)*12)+getNumValue(CR.data.age_m)+(getNumValue(CR.data.age_d)/30);
        if(noofmonths<=24){
            CR.data.category='INFANT';
        }else if(noofmonths<=180){
            CR.data.category='PED';
        }else{
            CR.data.category='ADULT';
        }
        CR.cat_change();
    }
    CR.calc_age=function(){
        var dt=new Date(CR.today_date);
        var a=moment(dt);
        var b=moment(new Date(CR.data.birth_date));

        var diffDuration=moment.duration(a.diff(b));

        CR.data.age_y=diffDuration.years();
        CR.data.age_m=diffDuration.months();
        CR.data.age_d=diffDuration.days();
        CR.calc_category();
    }
    CR.calc_dob=function(){
        var dt=new Date(CR.today_date);
        var bdate=moment(dt).subtract(getNumValue(CR.data.age_y), 'years').format('DD MMM YYYY');
        bdate=moment(new Date(bdate)).subtract(getNumValue(CR.data.age_m), 'months').format('DD MMM YYYY');
        bdate=moment(new Date(bdate)).subtract(getNumValue(CR.data.age_d), 'days').format('DD MMM YYYY');

        CR.data.birth_date=bdate;
        CR.calc_category();
    }

    CR.lmp_date_change=function(){
        var dt=new Date(CR.today_date);
        var a=moment(dt);
        var b=moment(new Date(CR.data.lmp_date));
        var n=a.diff(b, 'days');
        CR.data.month_of_preg=(n/30).toFixed(1);
        CR.data.exp_del_date=b.add(280, 'days').format('DD MMM YYYY');
    }
    CR.month_of_preg_change=function(){
        var dt=new Date(CR.today_date);
        var a=moment(dt);

        if(CR.data.month_of_preg*1>9){
            CR.data.month_of_preg='9';
        }

        var nm=parseInt(CR.data.month_of_preg*1);
        var nd=(CR.data.month_of_preg*1-nm)*30;
        var c=a.subtract(nm, 'months').format('DD MMM YYYY');
        c=moment(new Date(c)).subtract(nd, 'days').format('DD MMM YYYY');
        CR.data.lmp_date=c;
        var b=moment(new Date(CR.data.lmp_date));
        CR.data.exp_del_date=b.add(280, 'days').format('DD MMM YYYY');
    }
    CR.exp_del_date_change=function(){
        var dt=new Date(CR.today_date);
        var a=moment(dt);
        var b=moment(new Date(CR.data.exp_del_date));
        CR.data.lmp_date=b.subtract(280, 'days').format('DD MMM YYYY');

        b=moment(new Date(CR.data.lmp_date));
        var n=a.diff(b, 'days');
        CR.data.month_of_preg=(n/30).toFixed(1);
    }

    CR.gravidaRange = function(){
        var input = [];
        for(var i=1; i<=30;i+=1){
            input.push(i);
        }
        return input;
    }

    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        CR.sdata.record_deleted=$("[name='record_deleted']:checked").val();
        CR.sdata.stype=$("[name='stype']:checked").val();
        $http({url: API_URL+'ictc/list_beneficiary', params:CR.sdata}).success(
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

    CR.clear_search=function(){
        CR.sdata={p:1, pagefrom:ictc_pagefrom};
        CR.lists();
    }

    CR.open_gConfirmModal=function(){
        $timeout(function(){
            if($("#gConfirmModal").length){
                if(CR.data.age_y*1<18){
                    CR.gconfirm=false;
                }else{
                    CR.gconfirm=true;
                }
                if(!CR.gconfirm){
                    $("#gConfirmModal").modal();
                }
            }
        });
    }

    CR.save=function(){
        if($("#gConfirmModal").length){
            if(!CR.gconfirm){
                if(CR.data.age_y*1<18){
                    CR.gconfirm=false;
                }else{
                    CR.gconfirm=true;
                }
                if(!CR.gconfirm){
                    $("#gConfirmModal").modal();
                    return;
                }
            }
        }


		var frm=$("#frm");
		hide_form_errors(frm);
        var formData=new FormData(frm[0]);
        //console.log(formData);return;
		show_loader();
		$http({url:API_URL+'ictc/save_beneficiary', method:'POST', data:formData, headers:{'Content-Type': undefined}}).success(
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
        $http({url: API_URL+'ictc/beneficiary_detail/'+id}).success(
            function(res){
                CR.open_form(res.dtl);
                $timeout(function(){
                    CR.lmp_date_change();
                });
            }
        ).error(function(res){showHttpErr(res);});
    }
    
    CR.delete=function(id){
        var callback=function(){
            show_loader();
            $http({url: API_URL+'ictc/delete_beneficiary', method:'POST', data:{id:id}}).success(
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

        open_confirm_bootbox("Confirmation", "Are you sure to delete?", callback);
    }

    CR.delete_record=function(){
        var callback=function(){
            show_loader();
            $http({url: API_URL+'ictc/delete_beneficiary', method:'POST', data:CR.adata}).success(
                function(res){
                    if(res.success){
                        show_alert_msg(res.msg);
                        var pg=CR.sdata.p;
                        if(CR.page.total==1){
                            pg=1;
                        }
                        $("#deleteModal").modal('hide');
                        CR.lists(pg);
                    }else{
                        show_alert_msg(res.msg, 'E');
                    }
                }
            ).error(function(res){showHttpErr(res);});
        }

        open_confirm_bootbox("Confirmation", "Are you sure to delete?", callback);
    }

    CR.open_delete_form=function(rob){
        CR.adata=angular.copy(rob);
        showModal($("#deleteModal"), true);
    }

    CR.open_relation_form=function(rob){
        CR.adata=angular.copy(rob);
        CR.create_relation_select2_dd();
        showModal($("#relationModal"), true);
    }

    CR.create_relation_select2_dd=function(defaultdata){
        CR.adata.relation_to='';
        $timeout(function(){
            benificiary_select2_ajax($("#relation_to"), API_URL+'ictc/benificiary_search_dd/', '', defaultdata);
        });
    }
    CR.add_relation=function(){
        var callback=function(){
            show_loader();
            $http({url: API_URL+'ictc/link_benificiary_relation', method:'POST', data:CR.adata}).success(
                function(res){
                    if(res.success){
                        show_alert_msg(res.msg);
                        var pg=CR.sdata.p;
                        if(CR.page.total==1){
                            pg=1;
                        }
                        $("#relationModal").modal('hide');
                        CR.lists(pg);
                    }else{
                        show_alert_msg(res.msg, 'E');
                    }
                }
            ).error(function(res){showHttpErr(res);});
        }

        open_confirm_bootbox("Confirmation", "Are you sure? You want to link this relation.", callback);
    }

    CR.viewDetail=function(id){
        show_loader();
        $http({url: API_URL+'ictc/beneficiary_detail/'+id}).success(
            function(res){
                CR.pdtl = res.dtl;
                //showModal($("#patDtlModal"), true);
                $("#patDtlModal").modal();
            }
        ).error(function(res){showHttpErr(res);});
    }
    
    CR.viewRiskAnswers = function(){
        showModal($("#riskDtlModal"), true);
    }
    
    CR.riskAnsClose = function(){
        hideModal($("#riskDtlModal"));
    }

    CR.recordPregnancy = function(rob){
        CR.pdata=angular.copy(rob);
        CR.new_lmpdate_change();
        showModal($("#pregnancyModal"), true);
    }
    CR.new_lmpdate_change=function(){
        var dt=new Date(CR.today_date);
        var a=moment(dt);
        var b=moment(new Date(CR.pdata.lmp_date));
        var n=a.diff(b, 'days');
        CR.pdata.month_of_preg=(n/30).toFixed(1);
        CR.pdata.exp_del_date=b.add(280, 'days').format('DD MMM YYYY');
    }
    CR.new_monthpreg_change=function(){
        var dt=new Date(CR.today_date);
        var a=moment(dt);

        if(CR.pdata.month_of_preg*1>9){
            CR.pdata.month_of_preg='9';
        }

        var nm=parseInt(CR.pdata.month_of_preg*1);
        var nd=(CR.pdata.month_of_preg*1-nm)*30;
        var c=a.subtract(nm, 'months').format('DD MMM YYYY');
        c=moment(new Date(c)).subtract(nd, 'days').format('DD MMM YYYY');
        CR.pdata.lmp_date=c;
        var b=moment(new Date(CR.pdata.lmp_date));
        CR.pdata.exp_del_date=b.add(280, 'days').format('DD MMM YYYY');
    }
    CR.new_expdeldate_change=function(){
        var dt=new Date(CR.today_date);
        var a=moment(dt);
        var b=moment(new Date(CR.pdata.exp_del_date));
        CR.pdata.lmp_date=b.subtract(280, 'days').format('DD MMM YYYY');

        b=moment(new Date(CR.pdata.lmp_date));
        var n=a.diff(b, 'days');
        CR.pdata.month_of_preg=(n/30).toFixed(1);
    }

    CR.add_pregnancy=function(){
        var callback=function(){
            show_loader();
            $http({url: API_URL+'ictc/add_new_pregnancy', method:'POST', data:CR.pdata}).success(
                function(res){
                    if(res.success){
                        show_alert_msg(res.msg);
                        var pg=CR.sdata.p;
                        if(CR.page.total==1){
                            pg=1;
                        }
                        $("#pregnancyModal").modal('hide');
                        $("#patDtlModal").modal('hide');
                        CR.lists(pg);
                    }else{
                        show_alert_msg(res.msg, 'E');
                    }
                }
            ).error(function(res){showHttpErr(res);});
        }

        open_confirm_bootbox("Confirmation", "Are you sure? You want to add new pregnancy details.", callback);
    }

    CR.update_id_prefix=function(){
        var y=moment(CR.data.visit_date).format("YY");
        CR.pid_prifix=CR.pid_prifix_noyr+y;
        CR.infant_prifix=CR.infant_prifix_noyr+y+'-';
    }

    CR.init=function(){
        show_loader();
        $http({url:API_URL+'ictc/init_beneficiary'}).success(
            function(res) {
                CR.states=res.states;
                CR.all_districts=res.districts;

                CR.def_art_refer=res.def_art_refer;
                CR.def_dsrc_refer=res.def_dsrc_refer;
                CR.def_rntcp_refer=res.def_rntcp_refer;
                CR.def_ti_refer=res.def_ti_refer;

                CR.today_date=res.today_date;
                CR.facdtl=res.facdtl;

                CR.pid_prifix=res.pid_prifix;
                CR.infant_prifix=res.infant_prifix;

                CR.pid_prifix_noyr      =res.pid_prifix_noyr;
                CR.infant_prifix_noyr   =res.infant_prifix_noyr;

                $timeout(function(){
                    ngvisible();
                    set_numeric_input();
                    if(ictc_action=='add'){
                        CR.open_form();
                    }
                    if(typeof ictc_partner != "undefined"){
                        if(ictc_partner!=''){
                            CR.ictc_partner=ictc_partner;
                        }
                    }          
                });
                CR.lists();
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.init();
});

/** PendingResults */
angular.module('MetronicApp').controller("PendingResults", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1, counseling_status:'2', pagefrom:'PR'};
    CR.data={};

    CR.get_districts=function(state_id, district_id){
        CR.districts=[];
        CR.data.district=district_id?district_id:'';
        if(!state_id){
            return;
        }
        CR.all_districts.forEach(function(v){
            if(v.state_id==state_id){
                CR.districts.push(v);
            }
        })
    }

    CR.create_mother_select2_dd=function(defaultdata){
        CR.data.mother_id='';
        $timeout(function(){
            patient_select2_ajax($("#mother_dd"), API_URL+'ictc/patient_search_dd/'+CR.data.mother_art+'/F', '', defaultdata);
        });
    }
   
    CR.pre_test_detail=function(id){
        show_loader();
        $http({url: API_URL+'ictc/beneficiary_detail/'+id}).success(
            function(res){
                CR.districts=[];
                CR.get_districts(res.dtl.state);
                CR.data=res.dtl;

                if(!CR.data.dsrc_refer){
                    CR.data.dsrc_refer=CR.def_dsrc_refer;
                    CR.data.dsrc_chk=false;
                }else{
                    CR.data.dsrc_chk=true;
                }
                if(!CR.data.rntcp_refer){
                    CR.data.rntcp_refer=CR.def_rntcp_refer;
                    CR.data.rntcp_chk=false;
                }else{
                    CR.data.rntcp_chk=true;
                }

                if(CR.data.pregnent=='Y' || CR.data.syphilis_symptoms=='Y'){
                    CR.data.dsrc_chk=true;
                }
                if(CR.data.tb_symptoms=='Y'){
                    CR.data.rntcp_chk=true;
                }
                if(CR.data.drugs_habit){
                    CR.data.drugshabit = {'used':false,'shared':false,'no':false,'rta':false}
                    CR.data.drugs_habit.forEach(function(v){
                        if(v=='Used'){
                            CR.data.drugshabit.used=true;
                        }
                        if(v=='Shared'){
                            CR.data.drugshabit.shared=true;
                        }
                        if(v=='No'){
                            CR.data.drugshabit.no=true;
                        }
                        if(v=='Refuse to answer'){
                            CR.data.drugshabit.rta=true;
                        }
                    })
                }
                if(CR.data.sex_partner_kind){
                    CR.data.sex_kind = {'male':false,'female':false,'tg':false,'no':false,'rta':false}
                    CR.data.sex_partner_kind.forEach(function(v){
                        if(v=='Male'){
                            CR.data.sex_kind.male=true;
                        }
                        if(v=='Female'){
                            CR.data.sex_kind.female=true;
                        }
                        if(v=='TG'){
                            CR.data.sex_kind.tg=true;
                        }
                        if(v=='No Sexual partner'){
                            CR.data.sex_kind.no=true;
                        }
                        if(v=='Refuse to answer'){
                            CR.data.sex_kind.rta=true;
                        }
                    })
                }
                        
                $timeout(function(){
                    set_datepicker($(".dateInpt"));
                    //$("#frm").find('input,select,textarea').prop('disabled', true);
                    apply_select2($("#facs_dsrc"));
                    apply_select2($("#facs_rntc"));
                    apply_select2($("#facs_art_mother"));

                    hide_form_errors($("#frm"));
                    showModal($("#dtlModal"), true);
                });

                if(CR.data.category=='INFANT'){
                    var t=CR.data.mother_name;
                    if(CR.data.mother_art_num!=''){
                        t=t+' [ART: '+CR.data.mother_art_num+']';
                    }
                    if(CR.data.mother_pre_art_num!=''){
                        t=t+' [PRE-ART: '+CR.data.mother_pre_art_num+']';
                    }
                    if(CR.data.mother_regimen!=''){
                        t=t+' [Regimen: '+CR.data.mother_regimen+']';
                    }
                    CR.create_mother_select2_dd({id:CR.data.mother_id, text:t});
                }else{
                    CR.create_mother_select2_dd('');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.viewDetail=function(id){
        show_loader();
        $http({url: API_URL+'ictc/beneficiary_detail/'+id}).success(
            function(res){
                CR.pdtl = res.dtl;
                //showModal($("#patDtlModal"), true);
                $("#patDtlModal").modal();
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.openRiskQuestions = function(){
        showModal($("#riskModal"), true);
    }

    CR.riskQuesClose = function(){
        hideModal($("#riskModal"));
    }

    CR.viewRiskAnswers = function(){
        showModal($("#riskDtlModal"), true);
    }
    
    CR.riskAnsClose = function(){
        hideModal($("#riskDtlModal"));
    }    
    CR.cat_change=function(){
        CR.data.pregnent='N';
        CR.data.dsrc_chk=false;
        CR.data.rntcp_chk=false;
        if(CR.data.category=='INFANT'){
            CR.data.tb_symptoms='N';
            CR.data.syphilis_symptoms='N';
        }
        if(CR.data.pregnent=='Y' || CR.data.syphilis_symptoms=='Y'){
            CR.data.dsrc_chk=true;
        }
        if(CR.data.tb_symptoms=='Y'){
            CR.data.rntcp_chk=true;
        }
    }
    CR.calc_category=function(){
        var noofmonths=(getNumValue(CR.data.age_y)*12)+getNumValue(CR.data.age_m)+(getNumValue(CR.data.age_d)/30);
        if(noofmonths<=24){
            CR.data.category='INFANT';
        }else if(noofmonths<=180){
            CR.data.category='PED';
        }else{
            CR.data.category='ADULT';
        }
        CR.cat_change();
    }
    CR.calc_age=function(){
        var dt=new Date(CR.today_date);
        var a=moment(dt);
        var b=moment(new Date(CR.data.birth_date));

        var diffDuration=moment.duration(a.diff(b));

        CR.data.age_y=diffDuration.years();
        CR.data.age_m=diffDuration.months();
        CR.data.age_d=diffDuration.months();
        CR.calc_category();
    }
    CR.calc_dob=function(){
        var dt=new Date(CR.today_date);
        var bdate=moment(dt).subtract(getNumValue(CR.data.age_y), 'years').format('DD MMM YYYY');
        bdate=moment(new Date(bdate)).subtract(getNumValue(CR.data.age_m), 'months').format('DD MMM YYYY');
        bdate=moment(new Date(bdate)).subtract(getNumValue(CR.data.age_d), 'days').format('DD MMM YYYY');

        CR.data.birth_date=bdate;
        CR.calc_category();
    }
    CR.save_pre_test_detail=function(){
		var frm=$("#frm");
		hide_form_errors(frm);
		var formData=new FormData(frm[0]);
		show_loader();
		$http({url:API_URL+'ictc/save_beneficiary', method:'POST', data:formData, headers:{'Content-Type': undefined}}).success(
			function(res) {
				if(res.success){
					show_alert_msg(res.msg);
					CR.lists(CR.data.id?CR.sdata.p:1);
					hideModal($("#dtlModal"));
				}else{
					show_form_errors(res.errors, frm, true);
					show_alert_msg(res.msg, 'E');
				}
			}
		).error(function(res){showHttpErr(res);});
    }

    CR.clear_data=function(){
        CR.data={};
    }

    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        CR.sdata.stype=$("[name='stype']:checked").val();
        $http({url: API_URL+'ictc/list_beneficiary', params:CR.sdata}).success(
            function(res){
                CR.result=res.result;
                CR.page=res.page;
                $timeout(function(){
                    set_datepicker($(".dateInpt1"));
                    //$('.sticky-tbl').scrollTop(0);
                });
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.set_lists_order=function(orderby){
        CR.sdata.orderby=orderby;
        CR.lists();
    }
    CR.clear_search=function(){
        CR.sdata={p:1, counseling_status:'2', pagefrom:'PR'};
        CR.lists();
    }

    CR.set_rcvd_datepicker=function(rob, i){
        $(".rcvd_date"+i).attr('mindate', rob.test_date);
        var td=new Date(rob.test_date);
        var rd=new Date(rob.received_date);
        if(rd<td){
            rob.received_date=rob.test_date;
        }

        $timeout(function(){
            set_datepicker($(".rcvd_date"+i));
        });
    }

    CR.add_to_post_list=function(rob){
        show_loader();
        $http({url: API_URL+'ictc/add_to_post_list', method:'POST', data:{id:rob.id, test_date:rob.test_date, hiv_status:rob.hiv_status, hiv_status_tag:rob.hiv_status_tag, received_date:rob.received_date}}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    rob.counseling_status='3';
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.remove_from_post_list=function(rob){
        var callback=function(){
            show_loader();
            $http({url: API_URL+'ictc/remove_from_post_list', method:'POST', data:{id:rob.id}}).success(
                function(res){
                    if(res.success){
                        show_alert_msg(res.msg);
                        rob.counseling_status='2';
                    }else{
                        show_alert_msg(res.msg, 'E');
                    }
                }
            ).error(function(res){showHttpErr(res);});
        }

        open_confirm_bootbox("Confirmation", "Are you sure to remove from post test list?", callback);
    }

    CR.init=function(){
        show_loader();
        $http({url:API_URL+'ictc/init_beneficiary'}).success(
            function(res) {
                CR.states=res.states;
                CR.all_districts=res.districts;

                CR.def_art_refer=res.def_art_refer;
                CR.def_dsrc_refer=res.def_dsrc_refer;
                CR.def_rntcp_refer=res.def_rntcp_refer;
                CR.def_ti_refer=res.def_ti_refer;

                CR.today_date=res.today_date;
                CR.facdtl=res.facdtl;

                $timeout(function(){ngvisible();});
                CR.lists();
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.init();
});

/** PendingPostTests */
angular.module('MetronicApp').controller("PendingPostTests", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1, counseling_status:'3'};
    CR.data={};

    CR.get_districts=function(state_id, district_id){
        CR.districts=[];
        CR.data.district=district_id?district_id:'';
        if(!state_id){
            return;
        }
        CR.all_districts.forEach(function(v){
            if(v.state_id==state_id){
                CR.districts.push(v);
            }
        })
    }
   
    CR.viewDetail=function(id){
        show_loader();
        $http({url: API_URL+'ictc/beneficiary_detail/'+id}).success(
            function(res){
                CR.pdtl = res.dtl;
                //showModal($("#patDtlModal"), true);
                $("#patDtlModal").modal();
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.viewRiskAnswers = function(){
        showModal($("#riskDtlModal"), true);
    }
    
    CR.riskAnsClose = function(){
        hideModal($("#riskDtlModal"));
    }   
    CR.create_mother_select2_dd=function(defaultdata){
        CR.data.mother_id='';
        $timeout(function(){
            patient_select2_ajax($("#mother_dd"), API_URL+'ictc/patient_search_dd/'+CR.data.mother_art+'/F', '', defaultdata);
        });
    }

    CR.open_post_test_form=function(id){
        CR.reload_after_close=false;
        show_loader();
        $http({url: API_URL+'ictc/beneficiary_detail/'+id}).success(
            function(res){
                show_loader();
                CR.districts=[];
                CR.get_districts(res.dtl.state);

                CR.data=res.dtl;

                if(typeof res.dtl!= "undefined"){
                    if(res.dtl.drugs_habit){
                        CR.data.drugshabit = {'used':false,'shared':false,'no':false,'rta':false}
                        res.dtl.drugs_habit.forEach(function(v){
                            if(v=='Used'){
                                CR.data.drugshabit.used=true;
                            }
                            if(v=='Shared'){
                                CR.data.drugshabit.shared=true;
                            }
                            if(v=='No'){
                                CR.data.drugshabit.no=true;
                            }
                            if(v=='Refuse to answer'){
                                CR.data.drugshabit.rta=true;
                            }
                        });
                    }
                    if(res.dtl.sex_partner_kind){
                        CR.data.sex_kind = {'male':false,'female':false,'tg':false,'no':false,'rta':false}
                        res.dtl.sex_partner_kind.forEach(function(v){
                            if(v=='Male'){
                                CR.data.sex_kind.male=true;
                            }
                            if(v=='Female'){
                                CR.data.sex_kind.female=true;
                            }
                            if(v=='TG'){
                                CR.data.sex_kind.tg=true;
                            }
                            if(v=='No Sexual partner'){
                                CR.data.sex_kind.no=true;
                            }
                            if(v=='Refuse to answer'){
                                CR.data.sex_kind.rta=true;
                            }
                        })
                    }
                }

                

                if(!CR.data.art_refer){
                    CR.data.art_refer=CR.def_art_refer;
                    CR.data.art_chk=false;
                }else{
                    CR.data.art_chk=true;
                }

                if(!CR.data.dsrc_refer){
                    CR.data.dsrc_refer=CR.def_dsrc_refer;
                    CR.data.dsrc_chk=false;
                }else{
                    CR.data.dsrc_chk=true;
                }

                if(!CR.data.rntcp_refer){
                    CR.data.rntcp_refer=CR.def_rntcp_refer;
                    CR.data.rntcp_chk=false;
                }else{
                    CR.data.rntcp_chk=true;
                }

                if(CR.data.hiv_status=='Positive'){
                    CR.data.art_chk=true;
                }

                if(!CR.data.ti_refer){
                    CR.data.ti_refer=CR.def_ti_refer;
                    CR.data.ti_chk=false;
                }else{
                    CR.data.ti_chk=true;
                }

                if(CR.data.pregnent=='Y' || CR.data.syphilis_symptoms=='Y'){
                    CR.data.dsrc_chk=true;
                }
                if(CR.data.tb_symptoms=='Y'){
                    CR.data.rntcp_chk=true;
                }

                if(CR.data.drugs_habit){
                    CR.data.drugs_habit.forEach(function(v){
                        if(v=='Used' || v=='Shared'){
                            CR.data.ti_chk=true;
                        }
                    })
                }

                if(CR.data.sex_partner_kind){
                    CR.data.sex_partner_kind.forEach(function(v){
                        if(CR.data.gender=='M' && (v=='Male' || v=='TG')){
                            CR.data.ti_chk=true;
                        }
                        if(CR.data.gender=='TS/TG' && (v=='Male' || v=='TG')){
                            CR.data.ti_chk=true;
                        }
                    })
                }

                if(CR.data.provided_sex && CR.data.provided_sex=='Yes'){
                    CR.data.ti_chk=true;
                }

                if(CR.data.sex_relation_outside && CR.data.sex_relation_outside=='Yes'){
                    if(CR.data.partner_status=='' || CR.data.partner_status=='No-Partner'){
                        CR.data.partner_status='No';
                        $('#noPartner').attr('disabled','disabled');
                    }
                }else{
                    $('#noPartner').removeAttr('disabled');
                }

                CR.data.partner_art_id=CR.def_art_refer;

                if(!CR.data.partner_hiv_status){
                    CR.data.partner_hiv_status='Indeterminate';
                }
                
                $timeout(function(){
                    //$("#frm").find('input,select,textarea').prop('disabled', true);
                    apply_select2($("#facs_dsrc"));
                    apply_select2($("#facs_rntc"));
                    
                    apply_select2($("#p_facs_art_dd"), 'Select Partner ART Center');
                    apply_select2($("#facs_art_dd"));
                    apply_select2($("#facs_rntc_dd"));
                    apply_select2($("#facs_dsrc_dd"));
                    apply_select2($("#facs_ti_dd"));

                    apply_select2($("#facs_art_mother"));

                    hide_form_errors($("#frm"));
                    set_datepicker($(".dateInpt"));

                    showModal($("#formModal"), true);
                    $('[href="#tab2"]').click();
                    if(!CR.data.follow_up_date){
                        CR.follow_up_date();
                    }
                    if(!CR.data.partner_follow_up){
                        CR.partner_follow_up();
                    }
                    hide_loader();
                });

                if(CR.data.category=='INFANT'){
                    var t=CR.data.mother_name;
                    if(CR.data.mother_art_num!=''){
                        t=t+' [ART: '+CR.data.mother_art_num+']';
                    }
                    if(CR.data.mother_pre_art_num!=''){
                        t=t+' [PRE-ART: '+CR.data.mother_pre_art_num+']';
                    }
                    if(CR.data.mother_regimen!=''){
                        t=t+' [Regimen: '+CR.data.mother_regimen+']';
                    }
                    CR.create_mother_select2_dd({id:CR.data.mother_id, text:t});
                }else{
                    CR.create_mother_select2_dd('');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.openRiskQuestions = function(){
        showModal($("#riskModal"), true);
    }

    CR.riskQuesClose = function(){
        hideModal($("#riskModal"));
    }
    
    CR.openRiskAnswers = function(){
        showModal($("#riskAnsModal"), true);
    }
    CR.riskAnsModClose = function(){
        hideModal($("#riskAnsModal"));
    }   
    
    CR.cat_change=function(){
        CR.data.pregnent='N';
        CR.data.dsrc_chk=false;
        CR.data.rntcp_chk=false;
        if(CR.data.category=='INFANT'){
            CR.data.tb_symptoms='N';
            CR.data.syphilis_symptoms='N';
        }
        if(CR.data.pregnent=='Y' || CR.data.syphilis_symptoms=='Y'){
            CR.data.dsrc_chk=true;
        }
        if(CR.data.tb_symptoms=='Y'){
            CR.data.rntcp_chk=true;
        }
    }
    CR.calc_category=function(){
        var noofmonths=(getNumValue(CR.data.age_y)*12)+getNumValue(CR.data.age_m)+(getNumValue(CR.data.age_d)/30);
        if(noofmonths<=24){
            CR.data.category='INFANT';
        }else if(noofmonths<=180){
            CR.data.category='PED';
        }else{
            CR.data.category='ADULT';
        }
        CR.cat_change();
    }
    CR.calc_age=function(){
        var dt=new Date(CR.today_date);
        var a=moment(dt);
        var b=moment(new Date(CR.data.birth_date));

        var diffDuration=moment.duration(a.diff(b));

        CR.data.age_y=diffDuration.years();
        CR.data.age_m=diffDuration.months();
        CR.data.age_d=diffDuration.months();
        CR.calc_category();
    }
    CR.calc_dob=function(){
        var dt=new Date(CR.today_date);
        var bdate=moment(dt).subtract(getNumValue(CR.data.age_y), 'years').format('DD MMM YYYY');
        bdate=moment(new Date(bdate)).subtract(getNumValue(CR.data.age_m), 'months').format('DD MMM YYYY');
        bdate=moment(new Date(bdate)).subtract(getNumValue(CR.data.age_d), 'days').format('DD MMM YYYY');

        CR.data.birth_date=bdate;
        CR.calc_category();
    }

    CR.lmp_date_change=function(){
        var dt=new Date(CR.today_date);
        var a=moment(dt);
        var b=moment(new Date(CR.data.lmp_date));
        var n=a.diff(b, 'days');
        CR.data.month_of_preg=(n/30).toFixed(1);
        CR.data.exp_del_date=b.add(280, 'days').format('DD MMM YYYY');
    }
    CR.month_of_preg_change=function(){
        var dt=new Date(CR.today_date);
        var a=moment(dt);

        if(CR.data.month_of_preg*1>9){
            CR.data.month_of_preg='9';
        }

        var nm=parseInt(CR.data.month_of_preg*1);
        var nd=(CR.data.month_of_preg*1-nm)*30;
        var c=a.subtract(nm, 'months').format('DD MMM YYYY');
        c=moment(new Date(c)).subtract(nd, 'days').format('DD MMM YYYY');
        CR.data.lmp_date=c;
        var b=moment(new Date(CR.data.lmp_date));
        CR.data.exp_del_date=b.add(280, 'days').format('DD MMM YYYY');
    }
    CR.exp_del_date_change=function(){
        var dt=new Date(CR.today_date);
        var a=moment(dt);
        var b=moment(new Date(CR.data.exp_del_date));
        CR.data.lmp_date=b.subtract(280, 'days').format('DD MMM YYYY');

        b=moment(new Date(CR.data.lmp_date));
        var n=a.diff(b, 'days');
        CR.data.month_of_preg=(n/30).toFixed(1);
    }

    CR.follow_up_date=function(){
        var dt=new Date(CR.today_date);
        var a=moment(dt);
        if(CR.data.hiv_status=='Indeterminate'){
            CR.data.follow_up_date=a.add(14, 'days').format('DD MMM YYYY');
        }else if(CR.data.hiv_status=='Negative'){
            CR.data.follow_up_date=a.add(90, 'days').format('DD MMM YYYY');
        }
    }

    CR.confirmHivChange = function(){
        open_confirm_bootbox("Confirmation", "Are you sure! You want to change the HIV Status of this Patient");
    }

    CR.setTestReceiving = function(){
        
    }

    CR.partner_follow_up=function(){
        var dt=new Date(CR.today_date);
        var a=moment(dt);
        if(CR.data.partner_status=='No'){
            if(CR.data.no_test_reason==143){
                CR.data.partner_follow_up='';
            }else{
                CR.data.partner_follow_up=a.add(15, 'days').format('DD MMM YYYY');
            }
        }
        if(CR.data.hiv_status=='Positive' && CR.data.partner_hiv_status=='Negative'){
            CR.data.partner_follow_up=a.add(90, 'days').format('DD MMM YYYY');
        }
    }

    CR.update_post_dsrc_dd=function(){
        $timeout(function(){
            $("#facs_dsrc_dd").change();
        });
    }
    CR.update_post_rntcp_dd=function(){
        $timeout(function(){
            $("#facs_rntc_dd").change();
        });
    }
    CR.set_rcvd_datepicker=function(){
        $(".rcvd_date").attr('mindate', CR.data.test_date);
        var td=new Date(CR.data.test_date);
        var rd=new Date(CR.data.received_date);
        if(rd<td){
            CR.data.received_date=CR.data.test_date;
        }
        $timeout(function(){
            set_datepicker($(".rcvd_date"));
        });
    }
    CR.save_pre_test_detail=function(){
		var frm=$("#frm");
		hide_form_errors(frm);
		var formData=new FormData(frm[0]);
		show_loader();
		$http({url:API_URL+'ictc/save_beneficiary', method:'POST', data:formData, headers:{'Content-Type': undefined}}).success(
			function(res) {
				if(res.success){
                    show_alert_msg(res.msg);
                    CR.reload_after_close=true;
				}else{
					show_form_errors(res.errors, frm, true);
					show_alert_msg(res.msg, 'E');
				}
			}
		).error(function(res){showHttpErr(res);});
    }

    CR.clear_data=function(){
        CR.data={};
        if(CR.reload_after_close){
            CR.lists(CR.sdata.p);
        }
    }

    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        CR.sdata.stype=$("[name='stype']:checked").val();
        $http({url: API_URL+'ictc/list_beneficiary', params:CR.sdata}).success(
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
    CR.clear_search=function(){
        CR.sdata={p:1, counseling_status:'3'};
        CR.lists();
    }

    CR.gravidaRange = function(){
        var input = [];
        for(var i=1; i<=30;i+=1){
            input.push(i);
        }
        return input;
    }

    CR.remove_from_post_list=function(id){
        var callback=function(){
            show_loader();
            $http({url: API_URL+'ictc/remove_from_post_list', method:'POST', data:{id:id}}).success(
                function(res){
                    if(res.success){
                        show_alert_msg(res.msg);
                        CR.lists(CR.sdata.p);
                    }else{
                        show_alert_msg(res.msg, 'E');
                    }
                }
            ).error(function(res){showHttpErr(res);});
        }

        open_confirm_bootbox("Confirmation", "Are you sure to remove from post test list?", callback);
    }
    
    CR.save_post_test=function(){
		var frm=$("#post_test_frm");
		hide_form_errors(frm);
		var formData=new FormData(frm[0]);
		show_loader();
		$http({url:API_URL+'ictc/save_post_test', method:'POST', data:formData, headers:{'Content-Type': undefined}}).success(
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

    CR.init=function(){
        show_loader();
        $http({url:API_URL+'ictc/init_beneficiary'}).success(
            function(res) {
                CR.states=res.states;
                CR.all_districts=res.districts;

                CR.def_art_refer=res.def_art_refer;
                CR.def_dsrc_refer=res.def_dsrc_refer;
                CR.def_rntcp_refer=res.def_rntcp_refer;
                CR.def_ti_refer=res.def_ti_refer;

                CR.today_date=res.today_date;
                CR.facdtl=res.facdtl;

                $timeout(function(){
                    ngvisible();
                    set_numeric_input();
                });
                CR.lists();
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.init();
});

/** ARTLinkage */
angular.module('MetronicApp').controller("ARTLinkage", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1, counseling_status:counseling_status, pagefrom:ictc_pagefrom};
    CR.data={};

    CR.get_districts=function(state_id, district_id){
        CR.districts=[];
        CR.data.district=district_id?district_id:'';
        if(!state_id){
            return;
        }
        CR.all_districts.forEach(function(v){
            if(v.state_id==state_id){
                CR.districts.push(v);
            }
        })
    }

    CR.viewDetail=function(id){
        show_loader();
        $http({url: API_URL+'ictc/beneficiary_detail/'+id}).success(
            function(res){
                CR.pdtl = res.dtl;
                //showModal($("#patDtlModal"), true);
                $("#patDtlModal").modal();
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.viewRiskAnswers = function(){
        showModal($("#riskDtlModal"), true);
    }
    
    CR.riskAnsClose = function(){
        hideModal($("#riskDtlModal"));
    }
    
    CR.create_mother_select2_dd=function(defaultdata){
        CR.data.mother_id='';
        $timeout(function(){
            patient_select2_ajax($("#mother_dd"), API_URL+'ictc/patient_search_dd/'+CR.data.mother_art+'/F', '', defaultdata);
        });
    }
   
    CR.pre_test_detail=function(id){
        show_loader();
        $http({url: API_URL+'ictc/beneficiary_detail/'+id}).success(
            function(res){
                CR.districts=[];
                CR.get_districts(res.dtl.state);
                CR.data=res.dtl;

                if(!CR.data.dsrc_refer){
                    CR.data.dsrc_refer=CR.def_dsrc_refer;
                    CR.data.dsrc_chk=false;
                }else{
                    CR.data.dsrc_chk=true;
                }
                if(!CR.data.rntcp_refer){
                    CR.data.rntcp_refer=CR.def_rntcp_refer;
                    CR.data.rntcp_chk=false;
                }else{
                    CR.data.rntcp_chk=true;
                }

                if(CR.data.pregnent=='Y' || CR.data.syphilis_symptoms=='Y'){
                    CR.data.dsrc_chk=true;
                }
                if(CR.data.tb_symptoms=='Y'){
                    CR.data.rntcp_chk=true;
                }
                
                $timeout(function(){
                    set_datepicker($(".dateInpt"));
                    $("#frm").find('input,select,textarea').prop('disabled', true);
                    apply_select2($("#facs_dsrc"));
                    apply_select2($("#facs_rntc"));
                    apply_select2($("#facs_art_mother"));

                    hide_form_errors($("#frm"));
                    showModal($("#dtlModal"), true);
                });

                if(CR.data.category=='INFANT'){
                    var t=CR.data.mother_name;
                    if(CR.data.mother_art_num!=''){
                        t=t+' [ART: '+CR.data.mother_art_num+']';
                    }
                    if(CR.data.mother_pre_art_num!=''){
                        t=t+' [PRE-ART: '+CR.data.mother_pre_art_num+']';
                    }
                    if(CR.data.mother_regimen!=''){
                        t=t+' [Regimen: '+CR.data.mother_regimen+']';
                    }
                    CR.create_mother_select2_dd({id:CR.data.mother_id, text:t});
                }else{
                    CR.create_mother_select2_dd('');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.cat_change=function(){
        CR.data.pregnent='N';
        CR.data.dsrc_chk=false;
        CR.data.rntcp_chk=false;
        if(CR.data.category=='INFANT'){
            CR.data.tb_symptoms='N';
            CR.data.syphilis_symptoms='N';
        }
        if(CR.data.pregnent=='Y' || CR.data.syphilis_symptoms=='Y'){
            CR.data.dsrc_chk=true;
        }
        if(CR.data.tb_symptoms=='Y'){
            CR.data.rntcp_chk=true;
        }
    }
    CR.calc_category=function(){
        var noofmonths=(getNumValue(CR.data.age_y)*12)+getNumValue(CR.data.age_m)+(getNumValue(CR.data.age_d)/30);
        if(noofmonths<=24){
            CR.data.category='INFANT';
        }else if(noofmonths<=180){
            CR.data.category='PED';
        }else{
            CR.data.category='ADULT';
        }
        CR.cat_change();
    }
    CR.calc_age=function(){
        var dt=new Date(CR.today_date);
        var a=moment(dt);
        var b=moment(new Date(CR.data.birth_date));

        var diffDuration=moment.duration(a.diff(b));

        CR.data.age_y=diffDuration.years();
        CR.data.age_m=diffDuration.months();
        CR.data.age_d=diffDuration.months();
        CR.calc_category();
    }
    CR.calc_dob=function(){
        var dt=new Date(CR.today_date);
        var bdate=moment(dt).subtract(getNumValue(CR.data.age_y), 'years').format('DD MMM YYYY');
        bdate=moment(new Date(bdate)).subtract(getNumValue(CR.data.age_m), 'months').format('DD MMM YYYY');
        bdate=moment(new Date(bdate)).subtract(getNumValue(CR.data.age_d), 'days').format('DD MMM YYYY');

        CR.data.birth_date=bdate;
        CR.calc_category();
    }
    CR.save_pre_test_detail=function(){
		var frm=$("#frm");
		hide_form_errors(frm);
		var formData=new FormData(frm[0]);
		show_loader();
		$http({url:API_URL+'ictc/save_beneficiary', method:'POST', data:formData, headers:{'Content-Type': undefined}}).success(
			function(res) {
				if(res.success){
					show_alert_msg(res.msg);
					CR.lists(CR.data.id?CR.sdata.p:1);
					hideModal($("#dtlModal"));
				}else{
					show_form_errors(res.errors, frm, true);
					show_alert_msg(res.msg, 'E');
				}
			}
		).error(function(res){showHttpErr(res);});
    }

    CR.clear_data=function(){
        CR.data={};
    }

    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        CR.sdata.stype=$("[name='stype']:checked").val();
        $http({url: API_URL+'ictc/list_beneficiary', params:CR.sdata}).success(
            function(res){
                CR.result=res.result;
                CR.page=res.page;
                $timeout(function(){
                    set_datepicker($(".dateInpt1"));
                    //$('.sticky-tbl').scrollTop(0);
                });
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.set_lists_order=function(orderby){
        CR.sdata.orderby=orderby;
        CR.lists();
    }
    CR.clear_search=function(){
        CR.sdata={p:1, counseling_status:counseling_status, pagefrom:ictc_pagefrom};
        CR.lists();
    }

    CR.set_rcvd_datepicker=function(rob, i){
        $(".rcvd_date"+i).attr('mindate', rob.test_date);
        var td=new Date(rob.test_date);
        var rd=new Date(rob.received_date);
        if(rd<td){
            rob.received_date=rob.test_date;
        }

        $timeout(function(){
            set_datepicker($(".rcvd_date"+i));
        });
    }

    CR.open_delivery_form=function(rob){
        CR.pdata=angular.copy(rob);
        CR.pdata.delivery_date=CR.pdata.exp_delivery_date;
        showModal($("#delOutcomeModal"), true);
        $timeout(function(){
            set_datepicker($(".dateInpt"));
        });
    }
    CR.recort_delivery_outcome=function(){
        show_loader();
        $http({url: API_URL+'ictc/recort_delivery_outcome', method:'POST', data:CR.pdata}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    $("#delOutcomeModal").modal('hide');
                    CR.lists(CR.sdata.p);
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.create_infant_select2_dd=function(defaultdata){
        CR.pdata.infant_id='';
        $timeout(function(){
            infant_select2_ajax($("#infantname"), API_URL+'ictc/infant_search_dd/', '', defaultdata);
        });
    }
    CR.open_infant_register_form=function(rob){
        CR.pdata=angular.copy(rob);
        CR.pdata.delivery_date=CR.pdata.delivery_date;
        showModal($("#infantRegModal"), true);
        $timeout(function(){
            set_datepicker($(".dateInpt"));
        });
        CR.create_infant_select2_dd();
    }
    CR.record_infant_reg=function(){
        show_loader();
        $http({url: API_URL+'ictc/record_infant_reg', method:'POST', data:CR.pdata}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    $("#infantRegModal").modal('hide');
                    CR.lists(CR.sdata.p);
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.open_accept_form=function(rob){
        CR.adata=angular.copy(rob);
        CR.adata.register_date=CR.today_date;
        CR.adata.ictc_id=CR.adata.fac_id;
        CR.adata.patient_status='1';
        showModal($("#acceptModal"), true);
        CR.selectP('N');
        CR.create_art_patient_select2_dd();
        $timeout(function(){
            set_datepicker($(".dateInpt"));
            if(CR.adata.ictc_name){
                apply_select2($("#ictc_center_dd"), CR.adata.ictc_name);
            }else{
                apply_select2($("#ictc_center_dd"), 'Select ICTC Center');
            }
        });
    }
    CR.accept_art_transfered=function(){
        show_loader();
        $http({url: API_URL+'ictc/accept_art_transfered', method:'POST', data:CR.adata}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    $("#acceptModal").modal('hide');
                    CR.lists(CR.sdata.p);
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.remove_from_art_reffered=function(id){
        var callback=function(){
            show_loader();
            $http({url: API_URL+'ictc/remove_from_art_reffered', method:'POST', data:{id:id}}).success(
                function(res){
                    if(res.success){
                        show_alert_msg(res.msg);
                        CR.lists(CR.sdata.p);
                    }else{
                        show_alert_msg(res.msg, 'E');
                    }
                }
            ).error(function(res){showHttpErr(res);});
        }

        open_confirm_bootbox("Confirmation", "Are you sure to remove from ART Reffered list?", callback);
    }

    CR.create_ictc_center_select2_dd=function(defaultdata){
        CR.adata.ictc_center_id='';
        $timeout(function(){
            ictc_center_select2_ajax($("#ictc_center_dd"), API_URL+'ictc/patient_search_dd', '', defaultdata);
        });
    }

    CR.create_art_patient_select2_dd=function(defaultdata){
        CR.adata.art_patient_id='';
        $timeout(function(){
            patient_select2_ajax($("#art_patient_dd"), API_URL+'ictc/patient_search_dd', '', defaultdata);
        });
    }

    CR.selectP = function(type){
        if(type=='O'){
            $('.oldPatient').show();
            $('.newPatient').hide();
            $('#newR').attr('checked', false);
            $('#oldR').attr('checked', true);
        }else{
            $('.newPatient').show();
            $('.oldPatient').hide();
            $('#newR').attr('checked', true);
            $('#oldR').attr('checked', false);
        }
    }
    CR.link_art_transfered=function(){
        show_loader();
        $http({url: API_URL+'ictc/link_art_transfered', method:'POST', data:CR.adata}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    $("#acceptModal").modal('hide');
                    CR.lists(CR.sdata.p);
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.init=function(){
        show_loader();
        $http({url:API_URL+'ictc/init_beneficiary'}).success(
            function(res) {
                CR.states=res.states;
                CR.all_districts=res.districts;

                CR.def_art_refer=res.def_art_refer;
                CR.def_dsrc_refer=res.def_dsrc_refer;
                CR.def_rntcp_refer=res.def_rntcp_refer;
                CR.def_ti_refer=res.def_ti_refer;

                CR.today_date=res.today_date;
                CR.facdtl=res.facdtl;

                $timeout(function(){ngvisible();});
                CR.lists();
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.init();
});

/** InfantDue */
angular.module('MetronicApp').controller("InfantDue", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1, counseling_status:counseling_status, pagefrom:ictc_pagefrom};
    CR.data={};

    CR.get_districts=function(state_id, district_id){
        CR.districts=[];
        CR.data.district=district_id?district_id:'';
        if(!state_id){
            return;
        }
        CR.all_districts.forEach(function(v){
            if(v.state_id==state_id){
                CR.districts.push(v);
            }
        })
    }

    CR.viewDetail=function(id){
        show_loader();
        $http({url: API_URL+'ictc/beneficiary_detail/'+id}).success(
            function(res){
                CR.pdtl = res.dtl;
                //showModal($("#patDtlModal"), true);
                $("#patDtlModal").modal();
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.viewRiskAnswers = function(){
        showModal($("#riskDtlModal"), true);
    }
    
    CR.riskAnsClose = function(){
        hideModal($("#riskDtlModal"));
    }
    
    CR.create_mother_select2_dd=function(defaultdata){
        CR.data.mother_id='';
        $timeout(function(){
            patient_select2_ajax($("#mother_dd"), API_URL+'ictc/patient_search_dd/'+CR.data.mother_art+'/F', '', defaultdata);
        });
    }
   
    CR.pre_test_detail=function(id){
        show_loader();
        $http({url: API_URL+'ictc/beneficiary_detail/'+id}).success(
            function(res){
                CR.districts=[];
                CR.get_districts(res.dtl.state);
                CR.data=res.dtl;

                if(!CR.data.dsrc_refer){
                    CR.data.dsrc_refer=CR.def_dsrc_refer;
                    CR.data.dsrc_chk=false;
                }else{
                    CR.data.dsrc_chk=true;
                }
                if(!CR.data.rntcp_refer){
                    CR.data.rntcp_refer=CR.def_rntcp_refer;
                    CR.data.rntcp_chk=false;
                }else{
                    CR.data.rntcp_chk=true;
                }

                if(CR.data.pregnent=='Y' || CR.data.syphilis_symptoms=='Y'){
                    CR.data.dsrc_chk=true;
                }
                if(CR.data.tb_symptoms=='Y'){
                    CR.data.rntcp_chk=true;
                }
                
                $timeout(function(){
                    set_datepicker($(".dateInpt"));
                    $("#frm").find('input,select,textarea').prop('disabled', true);
                    apply_select2($("#facs_dsrc"));
                    apply_select2($("#facs_rntc"));
                    apply_select2($("#facs_art_mother"));

                    hide_form_errors($("#frm"));
                    showModal($("#dtlModal"), true);
                });

                if(CR.data.category=='INFANT'){
                    var t=CR.data.mother_name;
                    if(CR.data.mother_art_num!=''){
                        t=t+' [ART: '+CR.data.mother_art_num+']';
                    }
                    if(CR.data.mother_pre_art_num!=''){
                        t=t+' [PRE-ART: '+CR.data.mother_pre_art_num+']';
                    }
                    if(CR.data.mother_regimen!=''){
                        t=t+' [Regimen: '+CR.data.mother_regimen+']';
                    }
                    CR.create_mother_select2_dd({id:CR.data.mother_id, text:t});
                }else{
                    CR.create_mother_select2_dd('');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.cat_change=function(){
        CR.data.pregnent='N';
        CR.data.dsrc_chk=false;
        CR.data.rntcp_chk=false;
        if(CR.data.category=='INFANT'){
            CR.data.tb_symptoms='N';
            CR.data.syphilis_symptoms='N';
        }
        if(CR.data.pregnent=='Y' || CR.data.syphilis_symptoms=='Y'){
            CR.data.dsrc_chk=true;
        }
        if(CR.data.tb_symptoms=='Y'){
            CR.data.rntcp_chk=true;
        }
    }
    CR.calc_category=function(){
        var noofmonths=(getNumValue(CR.data.age_y)*12)+getNumValue(CR.data.age_m)+(getNumValue(CR.data.age_d)/30);
        if(noofmonths<=24){
            CR.data.category='INFANT';
        }else if(noofmonths<=180){
            CR.data.category='PED';
        }else{
            CR.data.category='ADULT';
        }
        CR.cat_change();
    }
    CR.calc_age=function(){
        var dt=new Date(CR.today_date);
        var a=moment(dt);
        var b=moment(new Date(CR.data.birth_date));

        var diffDuration=moment.duration(a.diff(b));

        CR.data.age_y=diffDuration.years();
        CR.data.age_m=diffDuration.months();
        CR.data.age_d=diffDuration.months();
        CR.calc_category();
    }
    CR.calc_dob=function(){
        var dt=new Date(CR.today_date);
        var bdate=moment(dt).subtract(getNumValue(CR.data.age_y), 'years').format('DD MMM YYYY');
        bdate=moment(new Date(bdate)).subtract(getNumValue(CR.data.age_m), 'months').format('DD MMM YYYY');
        bdate=moment(new Date(bdate)).subtract(getNumValue(CR.data.age_d), 'days').format('DD MMM YYYY');

        CR.data.birth_date=bdate;
        CR.calc_category();
    }
    CR.save_pre_test_detail=function(){
		var frm=$("#frm");
		hide_form_errors(frm);
		var formData=new FormData(frm[0]);
		show_loader();
		$http({url:API_URL+'ictc/save_beneficiary', method:'POST', data:formData, headers:{'Content-Type': undefined}}).success(
			function(res) {
				if(res.success){
					show_alert_msg(res.msg);
					CR.lists(CR.data.id?CR.sdata.p:1);
					hideModal($("#dtlModal"));
				}else{
					show_form_errors(res.errors, frm, true);
					show_alert_msg(res.msg, 'E');
				}
			}
		).error(function(res){showHttpErr(res);});
    }

    CR.clear_data=function(){
        CR.data={};
    }

    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        CR.sdata.stype=$("[name='stype']:checked").val();
        $http({url: API_URL+'ictc/list_infant_due', params:CR.sdata}).success(
            function(res){
                CR.result=res.result;
                CR.page=res.page;
                $timeout(function(){
                    set_datepicker($(".dateInpt1"));
                    //$('.sticky-tbl').scrollTop(0);
                });
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.set_lists_order=function(orderby){
        CR.sdata.orderby=orderby;
        CR.lists();
    }
    CR.clear_search=function(){
        CR.sdata={p:1, counseling_status:counseling_status, pagefrom:ictc_pagefrom};
        CR.lists();
    }

    CR.set_rcvd_datepicker=function(rob, i){
        $(".rcvd_date"+i).attr('mindate', rob.test_date);
        var td=new Date(rob.test_date);
        var rd=new Date(rob.received_date);
        if(rd<td){
            rob.received_date=rob.test_date;
        }

        $timeout(function(){
            set_datepicker($(".rcvd_date"+i));
        });
    }

    CR.open_delivery_form=function(rob){
        CR.pdata=angular.copy(rob);
        CR.pdata.delivery_date=CR.pdata.exp_delivery_date;
        showModal($("#delOutcomeModal"), true);
        $timeout(function(){
            set_datepicker($(".dateInpt"));
        });
    }
    CR.recort_delivery_outcome=function(){
        show_loader();
        $http({url: API_URL+'ictc/recort_delivery_outcome', method:'POST', data:CR.pdata}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    $("#delOutcomeModal").modal('hide');
                    CR.lists(CR.sdata.p);
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.create_infant_select2_dd=function(defaultdata){
        CR.pdata.infant_id='';
        $timeout(function(){
            infant_select2_ajax($("#infantname"), API_URL+'ictc/infant_search_dd/', '', defaultdata);
        });
    }
    CR.open_infant_register_form=function(rob){
        CR.pdata=angular.copy(rob);
        CR.pdata.delivery_date=CR.pdata.delivery_date;
        showModal($("#infantRegModal"), true);
        $timeout(function(){
            set_datepicker($(".dateInpt"));
        });
        CR.create_infant_select2_dd();
    }
    CR.record_infant_reg=function(){
        show_loader();
        $http({url: API_URL+'ictc/record_infant_reg', method:'POST', data:CR.pdata}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    $("#infantRegModal").modal('hide');
                    CR.lists(CR.sdata.p);
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.open_accept_form=function(rob){
        CR.adata=angular.copy(rob);
        CR.adata.register_date=CR.today_date;
        CR.adata.patient_status='1';
        showModal($("#acceptModal"), true);
        CR.selectP('N');
        CR.create_art_patient_select2_dd();
        $timeout(function(){
            set_datepicker($(".dateInpt"));
        });
    }
    CR.accept_art_transfered=function(){
        show_loader();
        $http({url: API_URL+'ictc/accept_art_transfered', method:'POST', data:CR.adata}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    $("#acceptModal").modal('hide');
                    CR.lists(CR.sdata.p);
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.remove_from_art_reffered=function(id){
        var callback=function(){
            show_loader();
            $http({url: API_URL+'ictc/remove_from_art_reffered', method:'POST', data:{id:id}}).success(
                function(res){
                    if(res.success){
                        show_alert_msg(res.msg);
                        CR.lists(CR.sdata.p);
                    }else{
                        show_alert_msg(res.msg, 'E');
                    }
                }
            ).error(function(res){showHttpErr(res);});
        }

        open_confirm_bootbox("Confirmation", "Are you sure to remove from ART Reffered list?", callback);
    }

    CR.create_art_patient_select2_dd=function(defaultdata){
        CR.adata.art_patient_id='';
        $timeout(function(){
            patient_select2_ajax($("#art_patient_dd"), API_URL+'ictc/patient_search_dd', '', defaultdata);
        });
    }

    CR.selectP = function(type){
        if(type=='O'){
            $('.oldPatient').show();
            $('.newPatient').hide();
        }else{
            $('.newPatient').show();
            $('.oldPatient').hide();
        }
    }
    CR.link_art_transfered=function(){
        show_loader();
        $http({url: API_URL+'ictc/link_art_transfered', method:'POST', data:CR.adata}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                    $("#acceptModal").modal('hide');
                    CR.lists(CR.sdata.p);
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.init=function(){
        show_loader();
        $http({url:API_URL+'ictc/init_beneficiary'}).success(
            function(res) {
                CR.states=res.states;
                CR.all_districts=res.districts;

                CR.def_art_refer=res.def_art_refer;
                CR.def_dsrc_refer=res.def_dsrc_refer;
                CR.def_rntcp_refer=res.def_rntcp_refer;
                CR.def_ti_refer=res.def_ti_refer;

                CR.today_date=res.today_date;
                CR.facdtl=res.facdtl;

                $timeout(function(){ngvisible();});
                CR.lists();
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.init();
});

angular.module('MetronicApp').controller("ICTCdueList", function ($scope, $http, $timeout) {
    var CR=this;
    CR.sdata={p:1, counseling_status:counseling_status, pagefrom:ictc_pagefrom};
    CR.data={};

    CR.get_districts=function(state_id, district_id){
        CR.districts=[];
        CR.data.district=district_id?district_id:'';
        if(!state_id){
            return;
        }
        CR.all_districts.forEach(function(v){
            if(v.state_id==state_id){
                CR.districts.push(v);
            }
        })
    }

    CR.viewDetail=function(id){
        show_loader();
        $http({url: API_URL+'ictc/beneficiary_detail/'+id}).success(
            function(res){
                CR.pdtl = res.dtl;
                //showModal($("#patDtlModal"), true);
                $("#patDtlModal").modal();
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.viewRiskAnswers = function(){
        showModal($("#riskDtlModal"), true);
    }
    
    CR.riskAnsClose = function(){
        hideModal($("#riskDtlModal"));
    }    
    CR.create_mother_select2_dd=function(defaultdata){
        CR.data.mother_id='';
        $timeout(function(){
            patient_select2_ajax($("#mother_dd"), API_URL+'ictc/patient_search_dd/'+CR.data.mother_art+'/F', '', defaultdata);
        });
    }
   
    CR.pre_test_detail=function(id){
        show_loader();
        $http({url: API_URL+'ictc/beneficiary_detail/'+id}).success(
            function(res){
                CR.districts=[];
                CR.get_districts(res.dtl.state);
                CR.data=res.dtl;

                if(!CR.data.dsrc_refer){
                    CR.data.dsrc_refer=CR.def_dsrc_refer;
                    CR.data.dsrc_chk=false;
                }else{
                    CR.data.dsrc_chk=true;
                }
                if(!CR.data.rntcp_refer){
                    CR.data.rntcp_refer=CR.def_rntcp_refer;
                    CR.data.rntcp_chk=false;
                }else{
                    CR.data.rntcp_chk=true;
                }

                if(CR.data.pregnent=='Y' || CR.data.syphilis_symptoms=='Y'){
                    CR.data.dsrc_chk=true;
                }
                if(CR.data.tb_symptoms=='Y'){
                    CR.data.rntcp_chk=true;
                }
                
                $timeout(function(){
                    set_datepicker($(".dateInpt"));
                    $("#frm").find('input,select,textarea').prop('disabled', true);
                    apply_select2($("#facs_dsrc"));
                    apply_select2($("#facs_rntc"));
                    apply_select2($("#facs_art_mother"));

                    hide_form_errors($("#frm"));
                    showModal($("#dtlModal"), true);
                });

                if(CR.data.category=='INFANT'){
                    var t=CR.data.mother_name;
                    if(CR.data.mother_art_num!=''){
                        t=t+' [ART: '+CR.data.mother_art_num+']';
                    }
                    if(CR.data.mother_pre_art_num!=''){
                        t=t+' [PRE-ART: '+CR.data.mother_pre_art_num+']';
                    }
                    if(CR.data.mother_regimen!=''){
                        t=t+' [Regimen: '+CR.data.mother_regimen+']';
                    }
                    CR.create_mother_select2_dd({id:CR.data.mother_id, text:t});
                }else{
                    CR.create_mother_select2_dd('');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.cat_change=function(){
        CR.data.pregnent='N';
        CR.data.dsrc_chk=false;
        CR.data.rntcp_chk=false;
        if(CR.data.category=='INFANT'){
            CR.data.tb_symptoms='N';
            CR.data.syphilis_symptoms='N';
        }
        if(CR.data.pregnent=='Y' || CR.data.syphilis_symptoms=='Y'){
            CR.data.dsrc_chk=true;
        }
        if(CR.data.tb_symptoms=='Y'){
            CR.data.rntcp_chk=true;
        }
    }
    CR.calc_category=function(){
        var noofmonths=(getNumValue(CR.data.age_y)*12)+getNumValue(CR.data.age_m)+(getNumValue(CR.data.age_d)/30);
        if(noofmonths<=24){
            CR.data.category='INFANT';
        }else if(noofmonths<=180){
            CR.data.category='PED';
        }else{
            CR.data.category='ADULT';
        }
        CR.cat_change();
    }
    CR.calc_age=function(){
        var dt=new Date(CR.today_date);
        var a=moment(dt);
        var b=moment(new Date(CR.data.birth_date));

        var diffDuration=moment.duration(a.diff(b));

        CR.data.age_y=diffDuration.years();
        CR.data.age_m=diffDuration.months();
        CR.data.age_d=diffDuration.months();
        CR.calc_category();
    }
    CR.calc_dob=function(){
        var dt=new Date(CR.today_date);
        var bdate=moment(dt).subtract(getNumValue(CR.data.age_y), 'years').format('DD MMM YYYY');
        bdate=moment(new Date(bdate)).subtract(getNumValue(CR.data.age_m), 'months').format('DD MMM YYYY');
        bdate=moment(new Date(bdate)).subtract(getNumValue(CR.data.age_d), 'days').format('DD MMM YYYY');

        CR.data.birth_date=bdate;
        CR.calc_category();
    }

    CR.clear_data=function(){
        CR.data={};
    }

    CR.sendForTesting = function(id){
        var callback=function(){
            show_loader();
            $http({url: API_URL+'ictc/sendForReTesting/'+id, method:'POST', data:CR.adata}).success(
                function(res){
                    if(res.success){
                        show_alert_msg(res.msg);
                        CR.lists();
                    }else{
                        show_alert_msg(res.msg, 'E');
                    }
                }
            ).error(function(res){showHttpErr(res);});
        }

        open_confirm_bootbox("Confirmation", "Are you sure! You want to send this Beneficiary for Re-Testing for HIV?", callback);
    }

    CR.lists=function(p){
        show_loader();
        CR.sdata.p=p?p:1;
        CR.sdata.stype=$("[name='stype']:checked").val();
        $http({url: API_URL+'ictc/list_due_list', params:CR.sdata}).success(
            function(res){
                CR.result=res.result;
                CR.today=res.today;
                CR.tomrw=res.tomrw;
                CR.week=res.week;
                CR.search=res.search;
                CR.page=res.page;
                $timeout(function(){
                    set_datepicker($(".dateInpt1"));
                    //$('.sticky-tbl').scrollTop(0);
                });
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.set_lists_order=function(orderby){
        CR.sdata.orderby=orderby;
        CR.lists();
    }
    CR.clear_search=function(){
        CR.sdata={p:1, counseling_status:counseling_status, pagefrom:ictc_pagefrom};
        CR.lists();
    }

    CR.set_rcvd_datepicker=function(rob, i){
        $(".rcvd_date"+i).attr('mindate', rob.test_date);
        var td=new Date(rob.test_date);
        var rd=new Date(rob.received_date);
        if(rd<td){
            rob.received_date=rob.test_date;
        }

        $timeout(function(){
            set_datepicker($(".rcvd_date"+i));
        });
    }


    CR.init=function(){
        show_loader();
        $http({url:API_URL+'ictc/init_beneficiary'}).success(
            function(res) {
                CR.states=res.states;
                CR.all_districts=res.districts;

                CR.def_art_refer=res.def_art_refer;
                CR.def_dsrc_refer=res.def_dsrc_refer;
                CR.def_rntcp_refer=res.def_rntcp_refer;
                CR.def_ti_refer=res.def_ti_refer;

                CR.today_date=res.today_date;
                CR.facdtl=res.facdtl;

                $timeout(function(){ngvisible();});
                CR.lists();
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.init();
});


/** DefaultFacilities */
angular.module('MetronicApp').controller("DefaultFacilities", function ($scope, $http, $timeout) {
    var CR=this;
    CR.data={};

    CR.save=function(id){
        var data={
            facs_art:$("#facs_art").val(),
            facs_dsrc:$("#facs_dsrc").val(),
            facs_rntc:$("#facs_rntc").val(),
            facs_ti:$("#facs_ti").val(),
        };
        show_loader();
        $http({url: API_URL+'ictc/save_default_facs', method:'POST', data:data}).success(
            function(res){
                if(res.success){
                    show_alert_msg(res.msg);
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.init=function(){
        apply_select2($("#facs_art"));
        apply_select2($("#facs_dsrc"));
        apply_select2($("#facs_rntc"));
        apply_select2($("#facs_ti"));

        $timeout(function(){ngvisible();});
    }
    CR.init();
});


/** Non Angular */
set_datepicker($(".dateInpt"));

//angular.element($("#emp_sal_pack_form")[0]).scope().init();
//EOF