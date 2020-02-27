/** Beneficiary */
angular.module('MetronicApp').controller("Beneficiary", function ($scope, $http, $timeout) {
    var CR = this;
    CR.sdata = { p: 1, pagefrom: ost_pagefrom };
    CR.data = {};
    CR.IsVisible = false;
    CR.get_districts = function (state_id, district_id) {
        CR.districts = [];
        CR.data.district = district_id ? district_id : '';
        if (!state_id) {
            return;
        }
        CR.all_districts.forEach(function (v) {
            if (v.state_id == state_id) {
                CR.districts.push(v);
            }
        })
    }
    CR.ShowHideActiveAdd = function () {
        if (CR.IsVisible == false) {
            CR.IsVisible = true;
        } else {
            CR.IsVisible = false;
            CR.data.active_state = '';
            CR.data.active_district = '';
            CR.data.active_address = '';
            CR.data.active_pin_code = '';
        }

    }
    CR.ShowHideGuardian = function () {
        if (CR.IsGuardianVisible == false) {
            CR.IsGuardianVisible = true;
        } else {
            CR.IsGuardianVisible = false;
            CR.data.guardian_name = '';
            CR.data.guardian_relation = '';
            CR.data.guardian_contact = '';
        }

    }

    CR.get_active_districts = function (state_id, district_id) {
        CR.active_districts = [];
        CR.data.active_district = district_id ? district_id : '';
        if (!state_id) {
            return;
        }
        CR.all_districts.forEach(function (v) {
            if (v.state_id == state_id) {
                CR.active_districts.push(v);
            }
        })
    }

    CR.open_form = function (dtl) {
        CR.districts = [];
        CR.active_districts = [];
        CR.IsVisible = false;
        CR.IsGuardianVisible = false;
        CR.gconfirm = false;
        CR.data.ti_chk = false;
        CR.data.ictc_chk = false;
        CR.data.rntcp_chk = false;
        CR.data.art_chk = false;
        if (dtl) {
            CR.get_districts(dtl.state);
            CR.get_active_districts(dtl.active_state);
            CR.gconfirm = true;
            if ((dtl.active_pin_code !== '' || dtl.active_address !== '') && !(dtl.active_pin_code === null || dtl.active_address === null)) {
                CR.IsVisible = true;
            }
            if(dtl.guardian_relation){
                CR.IsGuardianVisible = true;
            }
            
            dtl.ti_refer = dtl.ti_refer == '0' ? '' : dtl.ti_refer;
            dtl.ictc_refer = dtl.ictc_refer == '0' ? '' : dtl.ictc_refer;
            dtl.rntcp_refer = dtl.rntcp_refer == '0' ? '' : dtl.rntcp_refer;
            dtl.art_id = dtl.art_id == '0' ? '' : dtl.art_id;
            if(dtl.is_art == 'Y'){
                var t=dtl.patient_name;
                if(dtl.art_num!=''){
                    t=t+' [ART: '+dtl.art_num+']';
                }
                if(dtl.pre_art_num!=''){
                    t=t+' [PRE-ART: '+dtl.pre_art_num+']';
                }
                CR.create_mother_select2_dd({id:dtl.art_id, text:t});
            }else{
                CR.create_mother_select2_dd();
            }
            
        } else {
            CR.get_districts(CR.facdtl.state);
            CR.get_active_districts(CR.facdtl.state);
        }

        CR.data = dtl ? dtl : { visit_date: CR.today_date, gender: 'M', state: CR.facdtl.state, district: CR.facdtl.district_id, active_state: CR.facdtl.state, active_district: CR.facdtl.district_id, consent_filled: 'Y', tb_symptoms: 'N', status: 1, regular_partner: 'N', register_date: CR.today_date, transfer_out: 'N', is_transit: 'N', transit_start_date: CR.today_date,diagnosed_tb:'N',sti_treatment:'N',syphilis_tested:'N' };

        // if (CR.data.ti_refer > 0) {
        //     CR.data.ti_chk = true;
        // }
        // if (CR.data.ictc_refer > 0) {
        //     CR.data.ictc_chk = true;
        // }
        // if (CR.data.rntcp_refer > 0) {
        //     CR.data.rntcp_chk = true;
        // }
        // if (CR.data.art_refer > 0) {
        //     CR.data.art_chk = true;
        // }
        if ((CR.data.hiv_status == 'HIV I') || (CR.data.hiv_status == 'HIV II') || (CR.data.hiv_status == 'HIV I & II')) {
            CR.data.is_hiv = true;
        }

        hide_form_errors($("#frm"));
        showModal($("#formModal"), true);

        $timeout(function () {
            set_datepicker($(".dateInpt"));
            set_datepicker($(".dateInpt1"));
            set_monthyear($('.dateInpt2'));
            apply_select2($("#referral_id"));
            apply_select2($("#ti_refer"));
            apply_select2($("#ictc_refer"));
            apply_select2($("#rntcp_refer"));
            apply_select2($("#dsrc_refer"));
            apply_select2($("#art_id"));
        });

    }

    CR.create_mother_select2_dd=function(defaultdata){
        CR.data.patient_id='';
      //  console.log(CR.data.art_id);
        $timeout(function(){
            patient_select2_ajax($("#mother_dd"), API_URL+'ost/patient_search_dd/'+CR.data.art_id+'/', '', defaultdata);
        });
    }

    CR.calc_age = function () {
        var dt = new Date(CR.today_date);
        var a = moment(dt);
        var b = moment(new Date(CR.data.birth_date));

        var diffDuration = moment.duration(a.diff(b));

        CR.data.age_y = diffDuration.years();
        CR.data.age_m = diffDuration.months();
        CR.data.age_d = diffDuration.days();
    }

    CR.calc_dob = function () {
        var dt = new Date(CR.today_date);
        var bdate = moment(dt).subtract(getNumValue(CR.data.age_y), 'years').format('DD MMM YYYY');
        bdate = moment(new Date(bdate)).subtract(getNumValue(CR.data.age_m), 'months').format('DD MMM YYYY');
        bdate = moment(new Date(bdate)).subtract(getNumValue(CR.data.age_d), 'days').format('DD MMM YYYY');

        CR.data.birth_date = bdate;
    }

    CR.lists = function (p) {
        show_loader();
        CR.sdata.p = p ? p : 1;
        CR.sdata.stype = $("[name='stype']:checked").val();
        $http({ url: API_URL + 'ost/list_beneficiary', params: CR.sdata }).success(
            function (res) {
                CR.result = res.result;
                CR.page = res.page;
                //  CR.data.referred_from = 0;
            }
        ).error(function (res) { showHttpErr(res); });
    }

    CR.set_lists_order = function (orderby) {
        CR.sdata.orderby = orderby;
        CR.lists();
    }

    CR.clear_search = function () {
        CR.sdata = { p: 1, pagefrom: ost_pagefrom };
        CR.lists();
    }

    CR.open_gConfirmModal = function () {
        $timeout(function () {
            if ($("#gConfirmModal").length) {
                if (CR.data.age_y * 1 < 18) {
                    CR.gconfirm = false;
                } else {
                    CR.gconfirm = true;
                }
                if (!CR.gconfirm) {
                    $("#gConfirmModal").modal();
                }
            }
        });
    }

    CR.save = function () {
        if ($("#gConfirmModal").length) {
            if (!CR.gconfirm) {
                if (CR.data.age_y * 1 < 18) {
                    CR.gconfirm = false;
                } else {
                    CR.gconfirm = true;
                }
                if (!CR.gconfirm) {
                    $("#gConfirmModal").modal();
                    return;
                }
            }
        }


        var frm = $("#frm");
        hide_form_errors(frm);
        var formData = new FormData(frm[0]);
        show_loader();
        $http({ url: API_URL + 'ost/save_beneficiary', method: 'POST', data: formData, headers: { 'Content-Type': undefined } }).success(
            function (res) {
                if (res.success) {
                    show_alert_msg(res.msg);
                    CR.lists(CR.data.id ? CR.sdata.p : 1);
                    hideModal($("#formModal"));
                } else {
                    show_form_errors(res.errors, frm, true);
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function (res) { showHttpErr(res); });
    }

    CR.edit = function (id) {
        show_loader();
        $http({ url: API_URL + 'ost/beneficiary_detail/' + id }).success(
            function (res) {
                CR.open_form(res.dtl);
                $timeout(function () {
                    //     openOnOfFunction();                    
                });
            }
        ).error(function (res) { showHttpErr(res); });
    }

    CR.delete = function (id) {
        var callback = function () {
            show_loader();
            $http({ url: API_URL + 'ost/delete_beneficiary', method: 'POST', data: { id: id } }).success(
                function (res) {
                    if (res.success) {
                        show_alert_msg(res.msg);
                        var pg = CR.sdata.p;
                        if (CR.page.total == 1) {
                            pg = 1;
                        }
                        CR.lists(pg);
                    } else {
                        show_alert_msg(res.msg, 'E');
                    }
                }
            ).error(function (res) { showHttpErr(res); });
        }

        open_confirm_bootbox("Confirmation", "Are you sure to delete?", callback);
    }

    CR.delete_record = function (rob = '') {
        var callback = function () {
            show_loader();
            CR.adata = angular.copy(rob);

            $http({ url: API_URL + 'ost/delete_beneficiary', method: 'POST', data: CR.adata }).success(
                function (res) {
                    if (res.success) {
                        show_alert_msg(res.msg);
                        var pg = CR.sdata.p;
                        if (CR.page.total == 1) {
                            pg = 1;
                        }
                        $("#deleteModal").modal('hide');
                        CR.lists(pg);
                    } else {
                        show_alert_msg(res.msg, 'E');
                    }
                }
            ).error(function (res) { showHttpErr(res); });
        }

        open_confirm_bootbox("Confirmation", "Are you sure to delete the client : <strong>" + rob.client_name + "</strong> ?", callback);
    }

    CR.open_delete_form = function (rob) {
        CR.adata = angular.copy(rob);
        showModal($("#deleteModal"), true);
    }

    CR.viewDetail = function (id) {
        show_loader();
        $http({ url: API_URL + 'ost/beneficiary_detail/' + id + '/viewDtl' }).success(
            function (res) {
                var t = '';
                CR.pdtl = res.dtl;
                CR.clientStatus = CR.client_status[res.dtl.client_status];
                if(CR.pdtl.is_art == 'Y'){
                    var t=CR.pdtl.patient_name;
                    if(CR.pdtl.art_num!=''){
                        t=t+' [ART: '+CR.pdtl.art_num+']';
                    }
                    if(CR.pdtl.pre_art_num!=''){
                        t=t+' [PRE-ART: '+CR.pdtl.pre_art_num+']';
                    }
                }
                CR.pdtl.patient_details = t;
                $("#patDtlModal").modal();
            }
        ).error(function (res) { showHttpErr(res); });
    }

    CR.isChecked = function (item, rflag) {
        retval = false;
        selectedItems = '';
        if (rflag == 'adhoc_reason') {
            selectedItems = CR.flwupDtl.adhoc_reason;
        }
        else if (rflag == 'side_effects') {
            selectedItems = CR.flwupDtl.side_effects;
        }
        else if (rflag == 'drug') {
            selectedItems = CR.assmntDtl.drugs_used;
        }
        else if (rflag == 'complication') {
            selectedItems = CR.assmntDtl.drug_complications;
        }
        else if (rflag == 'skin') {
            selectedItems = CR.assmntDtl.skin;
        }

        if (selectedItems !== undefined) {
            item = item.toString();
            var items = selectedItems.split(',');
            retval = items.indexOf(item) != -1;
        }
        return retval;
    }

    CR.viewfollowupDtl = function (objD) {
        show_loader();
        $http({ url: API_URL + 'ost/view_followup_detail/' + objD.id }).success(
            function (res) {
                CR.drugs = res.drugs;
                CR.adhoc_reason = res.adhoc_reason;
                CR.side_effects = res.side_effects;
                CR.ost_status = res.ost_status;
                CR.flwupDtl = res.flwupDtl;
                $timeout(function () {
                    $("select").css({ "pointer-events": "none", "background": "#F5F5F5" });
                    $("input").css({ "pointer-events": "none", "background": "#F5F5F5" });
                    showModal($("#followupModal"), true);
                    $(':radio').click(function () {
                        this.checked = false;
                    });
                    $(':checkbox').click(function () {
                        this.checked = false;
                    });
                    hide_loader();
                });
            }
        ).error(function (res) { showHttpErr(res); });
    }

    CR.followupClose = function () {
        hideModal($("#followupModal"));
        $("select").css({ "pointer-events": "", "background": "#FFFFFF" });
        $("input").css({ "pointer-events": "", "background": "#FFFFFF" });
        $(':radio').click(function () {
            this.checked = true;
        });
        $(':checkbox').click(function () {
            this.checked = true;
        });
    }

    CR.viewAssessmentDtl = function (objD) {
        show_loader();
        $http({ url: API_URL + 'ost/view_assessment_detail/' + objD.id }).success(
            function (res) {
                CR.drugs = res.drugs;
                CR.skin = res.skin;
                CR.ost_status = res.ost_status;
                CR.complications = res.complications;
                CR.no_ost_reason = res.no_ost_reason;
                CR.assmntDtl = res.assmntDtl;
                $timeout(function () {
                    $("select").css({ "pointer-events": "none", "background": "#F5F5F5" });
                    $("input").css({ "pointer-events": "none", "background": "#F5F5F5" });
                    showModal($("#assessmentModal"), true);
                    $(':radio').click(function () {
                        this.checked = false;
                    });
                    $(':checkbox').click(function () {
                        this.checked = false;
                    });
                    hide_loader();
                });
            }
        ).error(function (res) { showHttpErr(res); });
    }

    CR.assessmentClose = function () {
        hideModal($("#assessmentModal"));
        $("select").css({ "pointer-events": "", "background": "#FFFFFF" });
        $("input").css({ "pointer-events": "", "background": "#FFFFFF" });
        $(':radio').click(function () {
            this.checked = true;
        });
        $(':checkbox').click(function () {
            this.checked = true;
        });
    }

    CR.init = function () {
        show_loader();
        $http({ url: API_URL + 'ost/init_beneficiary' }).success(
            function (res) {
                CR.states = res.states;
                CR.all_districts = res.districts;
                CR.today_date = res.today_date;
                CR.facdtl = res.facdtl;
                CR.client_status = res.client_status;
                CR.guardian_relations = res.guardian_relation;                
                $timeout(function () {
                    ngvisible();
                    set_numeric_input();
                    if (ost_action == 'add') {
                        CR.open_form();
                    }
                    if (ost_partner != '') {
                        CR.ost_partner = ost_partner;
                    }
                });
                CR.lists();
            }
        ).error(function (res) { showHttpErr(res); });
    }
    $timeout(CR.init, 0);
    //CR.init();
}).directive('slideToggle', function () {
    return {
        restrict: 'A',
        scope: {},
        controller: function ($scope) { },
        link: function (scope, element, attr) {
            element.bind('click', function () {
                //   console.log(attr.slideToggle); 
                var $slideBox = angular.element(attr.slideToggle);
                var slideDuration = parseInt(attr.slideToggleDuration, 10) || 100;
                $slideBox.stop().slideToggle(slideDuration);
                // $scope.IsVisible = true;
            });
        }
    };
});

/** Pending Assessment */
angular.module('MetronicApp').controller("PendingAssessment", function ($scope, $http, $timeout) {
    var CR = this;
    CR.sdata = { p: 1, ost_status: '', pagefrom: 'PA' };
    CR.data = {};

    CR.get_districts = function (state_id, district_id) {
        CR.districts = [];
        CR.data.district = district_id ? district_id : '';
        if (!state_id) {
            return;
        }
        CR.all_districts.forEach(function (v) {
            if (v.state_id == state_id) {
                CR.districts.push(v);
            }
        })
    }

    CR.get_active_districts = function (state_id, district_id) {
        CR.active_districts = [];
        CR.data.active_district = district_id ? district_id : '';
        if (!state_id) {
            return;
        }
        CR.all_districts.forEach(function (v) {
            if (v.state_id == state_id) {
                CR.active_districts.push(v);
            }
        })
    }

    CR.pre_test_detail = function (id) {
        show_loader();
        $http({ url: API_URL + 'ost/beneficiary_detail/' + id }).success(
            function (res) {
                CR.districts = [];
                CR.get_districts(res.dtl.state);
                CR.active_districts = [];
                CR.get_active_districts(res.dtl.state);
                CR.data = res.dtl;

                $timeout(function () {
                    set_datepicker($(".dateInpt"));
                    set_datepicker($(".dateInpt1"));
                    hide_form_errors($("#frm"));
                    showModal($("#dtlModal"), true);
                });

            }
        ).error(function (res) { showHttpErr(res); });
    }

    CR.open_assessment_form = function () {
        show_loader();
        $timeout(function () {
            set_numeric_input();
            set_datepicker($(".dateInpt"));
            hide_form_errors($("#assfrm"));
            showModal($("#assessmentDtlModal"), true);
            hide_loader();
        });
    }

    CR.takeAssessment = function (objD) {     //initiation_date
          
        CR.dtl = { clientId: objD.id, ostNo: objD.ost_no, clientName: objD.client_name, ostStatus: CR.ost_status[objD.ost_status],visit_date: objD.visit_date, register_date:objD.register_date,assess_date: objD.visit_date, initiation_date:objD.register_date };
      //  console.log(CR.dtl); 
        /** Default values */
        CR.data = { cyanosis: 'N', oedema: 'N', jaundice: 'N', clubbing: 'N', lymphadenopathy: 'N', ost_initiated: 'Y', inject_route: 'N', dependence: 'N', last_month_use: 'N', sharing_needles: '', last_needle_shared: '', sharing_para: '', last_para_shared: '', prev_abstinence: '', substitute_drug: '', id: 0, birth_date: objD.birth_date, no_ost_reason: '' };
        CR.open_assessment_form();
    }

    CR.edit = function (objD) {
        $http({ url: API_URL + 'ost/assessment_detail/' + objD.id }).success(
            function (res) { //console.log(res);
                CR.dtl = { clientId: objD.id, ostNo: objD.ost_no,register_date:objD.register_date, clientName: objD.client_name, ostStatus: CR.ost_status[objD.ost_status]};
                CR.data = res.assessmentDtl;
                CR.dtl.assess_date = res.assessmentDtl.assess_date ? res.assessmentDtl.assess_date : objD.visit_date;
                CR.dtl.initiation_date = res.assessmentDtl.initiation_date ? res.assessmentDtl.initiation_date : objD.register_date
         //       console.log(CR.dtl);
                CR.data.birth_date = objD.birth_date;
                CR.open_assessment_form();
            }
        ).error(function (res) { showHttpErr(res); });
    }

    CR.isChecked = function (item, rflag) {
        retval = false;
        selectedItems = '';
        if (rflag == 'skin') {
            selectedItems = CR.data.skin;
        } else if (rflag == 'drug') {
            selectedItems = CR.data.drugs_used;
        } else if (rflag == 'complication') {
            selectedItems = CR.data.drug_complications;
        }

        if (selectedItems !== undefined) {
            item = item.toString();
            var items = selectedItems.split(',');
            retval = items.indexOf(item) != -1;
        }
        return retval;
    }

    CR.save_assessment_detail = function () {
        var frm = $("#assfrm");
        hide_form_errors(frm);
        var formData = new FormData(frm[0]);
     //   console.log(formData);
        show_loader();
        $http({ url: API_URL + 'ost/save_assessment', method: 'POST', data: formData, headers: { 'Content-Type': undefined } }).success(
            function (res) {
                if (res.success) {
                    show_alert_msg(res.msg);
                    CR.lists(CR.data.id ? CR.sdata.p : 1);
                    hideModal($("#assessmentDtlModal"));
                } else {
                    show_form_errors(res.errors, frm, true);
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function (res) { showHttpErr(res); });
    }

    CR.viewDetail = function (id) {
        show_loader();
        $http({ url: API_URL + 'ost/beneficiary_detail/' + id }).success(
            function (res) {
                CR.pdtl = res.dtl;
                $("#patDtlModal").modal();
            }
        ).error(function (res) { showHttpErr(res); });
    }

    CR.calc_age = function () {
        var dt = new Date(CR.today_date);
        var a = moment(dt);
        var b = moment(new Date(CR.data.birth_date));
        var diffDuration = moment.duration(a.diff(b));
        CR.data.age_y = diffDuration.years();
        CR.data.years_use = (CR.data.age_y - CR.data.onset_age);
    }

    CR.calc_dob = function () {
        var dt = new Date(CR.today_date);
        var bdate = moment(dt).subtract(getNumValue(CR.data.age_y), 'years').format('DD MMM YYYY');
        bdate = moment(new Date(bdate)).subtract(getNumValue(CR.data.age_m), 'months').format('DD MMM YYYY');
        bdate = moment(new Date(bdate)).subtract(getNumValue(CR.data.age_d), 'days').format('DD MMM YYYY');

        CR.data.birth_date = bdate;
    }

    CR.save_pre_test_detail = function () {
        var frm = $("#frm");
        hide_form_errors(frm);
        var formData = new FormData(frm[0]);
        show_loader();
        $http({ url: API_URL + 'ost/save_beneficiary', method: 'POST', data: formData, headers: { 'Content-Type': undefined } }).success(
            function (res) {
                if (res.success) {
                    show_alert_msg(res.msg);
                    CR.lists(CR.data.id ? CR.sdata.p : 1);
                    hideModal($("#dtlModal"));
                } else {
                    show_form_errors(res.errors, frm, true);
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function (res) { showHttpErr(res); });
    }



    CR.clear_data = function () {
        CR.data = {};
    }

    CR.lists = function (p) {
        show_loader();
        CR.sdata.p = p ? p : 1;
        CR.sdata.stype = $("[name='stype']:checked").val();
        $http({ url: API_URL + 'ost/list_beneficiary', params: CR.sdata }).success(
            function (res) {
                CR.result = res.result;
                CR.page = res.page;
                $timeout(function () {
                    set_datepicker($(".dateInpt1"));
                });
            }
        ).error(function (res) { showHttpErr(res); });
    }

    CR.set_lists_order = function (orderby) {
        CR.sdata.orderby = orderby;
        CR.lists();
    }

    CR.clear_search = function () {
        CR.sdata = { p: 1, ost_status: '2', pagefrom: 'PA' };
        CR.lists();
    }

    CR.set_rcvd_datepicker = function (rob, i) {
        $(".rcvd_date" + i).attr('mindate', rob.test_date);
        var td = new Date(rob.test_date);
        var rd = new Date(rob.received_date);
        if (rd < td) {
            rob.received_date = rob.test_date;
        }

        $timeout(function () {
            set_datepicker($(".rcvd_date" + i));
        });
    }

    CR.add_to_post_list = function (rob) {
        show_loader();
        $http({ url: API_URL + 'ost/add_to_post_list', method: 'POST', data: { id: rob.id, test_date: rob.test_date, hiv_status: rob.hiv_status, hiv_status_tag: rob.hiv_status_tag, received_date: rob.received_date } }).success(
            function (res) {
                if (res.success) {
                    show_alert_msg(res.msg);
                    rob.ost_status = '3';
                } else {
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function (res) { showHttpErr(res); });
    }
    CR.remove_from_post_list = function (rob) {
        var callback = function () {
            show_loader();
            $http({ url: API_URL + 'ost/remove_from_post_list', method: 'POST', data: { id: rob.id } }).success(
                function (res) {
                    if (res.success) {
                        show_alert_msg(res.msg);
                        rob.ost_status = '2';
                    } else {
                        show_alert_msg(res.msg, 'E');
                    }
                }
            ).error(function (res) { showHttpErr(res); });
        }

        open_confirm_bootbox("Confirmation", "Are you sure to remove from post test list?", callback);
    }

    CR.init = function () {
        show_loader();
        $http({ url: API_URL + 'ost/init_assessment' }).success(
            function (res) {
                CR.states = res.states;
                CR.all_districts = res.districts;
                CR.today_date = res.today_date;
                CR.facdtl = res.facdtl;
                CR.drugs = res.drugs;
                CR.complications = res.complications;
                CR.skin = res.skin;
                CR.ost_status = res.ost_status;

                $timeout(function () {
                    ngvisible();
                });
                CR.lists();
            }
        ).error(function (res) { showHttpErr(res); });
    }
    $timeout(CR.init, 0);
});


/** Dispense */
angular.module('MetronicApp').controller("Dispense", function ($scope, $http, $timeout) {
    var CR = this;
    CR.sdata = { p: 1, pagefrom: 'Dispense', drug: 'B', batches: '0' };
    CR.data = {};
    CR.expcted = { totaldosage: 0 };
    CR.inactv = { totaldosage: 0 };
    CR.transitclient = { totaldosage: 0 };
    // CR.expcted.totaldosage = 0;
    // CR.inactv.totaldosage = 0;
    CR.get_districts = function (state_id, district_id) {
        CR.districts = [];
        CR.data.district = district_id ? district_id : '';
        if (!state_id) {
            return;
        }
        CR.all_districts.forEach(function (v) {
            if (v.state_id == state_id) {
                CR.districts.push(v);
            }
        })
    }


    CR.dispenseDrug = function (dtl) {
       // console.log(dtl);
        CR.data = dtl;
        tdosage = 0.00;
        dosemg2 = 0;
        dosemg04 = 0;
        dtl.forEach(function (v) {
            tdosage += parseFloat(v.tdosage);
            uom = v.uom;
            if (uom == 'mg') {
                dosemg2 = dosemg2 + parseFloat(v.dosemg2);
                dosemg04 = dosemg04 + parseFloat(v.dosemg04);
            }
        });
        if (uom == 'mg') {
            var dosdispStr = dosemg2 + " tablet of 2 mg. & " + dosemg04 + " tablet of 0.4 mg.";
            $('#displayDtl').text(dosdispStr);
        }
        CR.data.inventory_id = ''; //'40909';
        //  CR.get_batches(CR.data.inventory_id); CR.batches
        CR.data.batch_id = '';
        $timeout(CR.get_batches(CR.data.inventory_id), 0);

        choosenDrug = $('#choosen_drug option:selected').text();
        $('.un_pro_name').text(choosenDrug);
        showModal($("#DispenseModal"), true);
        $('.un_batch_del').click();
        $('.un_total_dosage').text(tdosage.toFixed(2) + " " + uom);
        $("#prodName option").prop('disabled', false);
        $('#saveDispense').attr("disabled", "disabled");
    }

    CR.CheckUncheckHeader = function (rObj = {}) {
        if (rObj.Selected) {
            CR.selectedClient = CR.selectedClient + 1;
            CR.expectedClientIds.push(rObj);
        } else {
            CR.selectedClient = CR.selectedClient - 1;
            CR.expectedClientIds.splice(CR.expectedClientIds.indexOf(rObj), 1);
        }
        CR.IsAllChecked = true;
        for (var i = 0; i < CR.expcted.result.length; i++) {
            if (!CR.expcted.result[i].Selected) {
                CR.IsAllChecked = false;
                break;
            }
        };

        $http.get('ost/session_refresh').then(function(r) { return true;});
    };

    CR.CheckUncheckAll = function () {
        CR.expectedClientIds = [];
        for (var i = 0; i < CR.expcted.result.length; i++) {
            CR.expcted.result[i].Selected = CR.IsAllChecked;
            if (CR.IsAllChecked == true) {
                CR.expectedClientIds.push(CR.expcted.result[i]);
                CR.selectedClient = CR.expcted.result.length;
            } else {
                CR.expectedClientIds.splice(CR.expectedClientIds.indexOf(CR.expcted.result[i]), 1);
                CR.selectedClient = 0;
            }
        }

        $http.get('ost/session_refresh').then(function(r) { return true;});
    };

    CR.CheckUncheckInactHeader = function (rObj = {}) {
        if (rObj.Selected) {
            CR.inactiveClient = CR.inactiveClient + 1;
            CR.inactiveClientIds.push(rObj);
        } else {
            CR.inactiveClient = CR.inactiveClient - 1;
            CR.inactiveClientIds.splice(CR.inactiveClientIds.indexOf(rObj), 1);
        }
        CR.IsAllInactChecked = true;
        for (var i = 0; i < CR.inactv.result.length; i++) {
            if (!CR.inactv.result[i].Selected) {
                CR.IsAllInactChecked = false;
                break;
            }
        };
        $http.get('ost/session_refresh').then(function(r) { return true;});
    };

    CR.CheckUncheckInactAll = function () {
        CR.inactiveClientIds = [];
        for (var i = 0; i < CR.inactv.result.length; i++) {
            CR.inactv.result[i].Selected = CR.IsAllInactChecked;
            if (CR.IsAllInactChecked == true) {
                CR.inactiveClientIds.push(CR.inactv.result[i]);
                CR.inactiveClient = CR.inactv.result.length;
            } else {
                CR.inactiveClientIds.splice(CR.inactiveClientIds.indexOf(CR.inactv.result[i]), 1);
                CR.inactiveClient = 0;
            }
        }

        $http.get('ost/session_refresh').then(function(r) { return true;});
    };

    CR.CheckUncheckTransitHeader = function (rObj = {}) {
        if (rObj.Selected) {
            CR.transitclnts = CR.transitclnts + 1;
            CR.transitclntsIds.push(rObj);
        } else {
            CR.transitclnts = CR.transitclnts - 1;
            CR.transitclntsIds.splice(CR.transitclntsIds.indexOf(rObj), 1);
        }
        CR.IsAllTransitChecked = true;
        for (var i = 0; i < CR.transitclient.result.length; i++) {
            if (!CR.transitclient.result[i].Selected) {
                CR.IsAllTransitChecked = false;
                break;
            }
        };
        $http.get('ost/session_refresh').then(function(r) { return true;});
    };

    CR.CheckUncheckTransitAll = function () {
        CR.transitclntsIds = [];
        for (var i = 0; i < CR.transitclient.result.length; i++) {
            CR.transitclient.result[i].Selected = CR.IsAllTransitChecked;
            if (CR.IsAllTransitChecked == true) {
                CR.transitclntsIds.push(CR.transitclient.result[i]);
                CR.transitclnts = CR.transitclient.result.length;
            } else {
                CR.transitclntsIds.splice(CR.transitclntsIds.indexOf(CR.transitclient.result[i]), 1);
                CR.transitclnts = 0;
            }
        }

        $http.get('ost/session_refresh').then(function(r) { return true;});
    };

    CR.lists = function (p) {
        show_loader();
        CR.selectedClient = 0;
        CR.inactiveClient = 0;
        CR.transitclnts = 0;
        CR.sdata.p = p ? p : 1;
        CR.sdata.stype = $("[name='stype']:checked").val();
        $http({ url: API_URL + 'ost/list_dispense', params: CR.sdata }).success(
            function (res) {
                CR.result = res.result;

                CR.medicines = res.medicines.result;
                CR.data.inventory_id = '';
                CR.data.batch_id = '';
                CR.data.avlqty = 0;
                CR.page = res.page;
                CR.expcted = res.expcted;
                CR.inactv = res.inactv;
                CR.transitclient = res.transitclient;
                CR.dispDone = res.dispDone;
                CR.expectedClientIds = [];
                CR.inactiveClientIds = [];
                CR.transitclntsIds = [];

                // CR.selectedClient = res.expcted.result.length;
                //    CR.inactiveClient = res.inactv.result.length;
                //  CR.IsAllChecked = true;
                //     CR.IsAllInactChecked = true;
                //  CR.CheckUncheckAll();
                //   CR.CheckUncheckInactAll();
                $('.un_batch_row').remove();
                //  $(".prodBatch option[value!='']").remove();
                $(".prodName option:selected").removeAttr('disabled');
                $(".prodBatch option:selected").removeAttr('disabled');
                $(".avl_qty").val(0);
                CR.IsAllChecked = false;
                CR.IsAllInactChecked = false;
            }
        ).error(function (res) { showHttpErr(res); });
    }

    CR.get_batches = function (inventory_id) {
        CR.data.inventory_id = inventory_id ? inventory_id : '';
        CR.data.batch_id = '';
        CR.data.avlqty = 0;
        if (!inventory_id) {
            return;
        }
        show_loader();
        $http({ url: API_URL + 'ost/get_batches/' + inventory_id, method: 'POST', data: CR.adata }).success(
            function (res) {
                if (res.success) {
                    CR.batches = res.batches;
                    if (CR.batches[0] != undefined) {
                        CR.data.batch_id = CR.batches[0].batch_id;
                        CR.data.avlqty = CR.batches[0].current_qty;
                    }
                } else {
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function (res) { showHttpErr(res); });
    }

    CR.set_lists_order = function (orderby) {
        CR.sdata.orderby = orderby;
        CR.lists();
    }

    CR.clear_search = function () {
        CR.sdata = { p: 1, pagefrom: 'Dispense', drug: 'B', batches: '0' };
        CR.expcted = { totaldosage: 0 };
        CR.inactv = { totaldosage: 0 };
        CR.transitclient = { totaldosage: 0 };
        CR.lists();
    }

    CR.unsetCheckList = function () {
        CR.expectedClientIds = [];
        CR.inactiveClientIds = [];
        CR.transitclntsIds = [];
        CR.IsAllChecked = false;
        CR.IsAllInactChecked = false;
        CR.CheckUncheckAll();
        CR.CheckUncheckInactAll();
    }

    CR.saveDispense = function () {
        show_loader();
        var frm = $("#dispfrm");        
        hide_form_errors(frm);
        var formData = new FormData(frm[0]);
        formData.append('date', CR.sdata.from_visit);
        show_loader();
        $http({ url: API_URL + 'ost/save_dispensation', method: 'POST', data: formData, headers: { 'Content-Type': undefined } }).success(
            function (res) {
                if (res.success) {
                    show_alert_msg(res.msg);
                    CR.lists(CR.data.id ? CR.sdata.p : 1);
                    hideModal($("#DispenseModal"));
                } else {
                    show_form_errors(res.errors, frm, true);
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function (res) { showHttpErr(res); });
    }

    CR.init = function () {
        show_loader();
        $http({ url: API_URL + 'ost/init_beneficiary' }).success(
            function (res) {
                CR.states = res.states;
                CR.all_districts = res.districts;
                CR.today_date = res.today_date;
                CR.facdtl = res.facdtl;    
                CR.guardian_relations = res.guardian_relation;            
                $timeout(function () {
                    ngvisible();
                    set_numeric_input();
                    if (ost_action == 'add') {
                        CR.open_form();
                    }
                    if (ost_partner != '') {
                        CR.ost_partner = ost_partner;
                    }
                });
                CR.lists();
            }
        ).error(function (res) { showHttpErr(res); });
    }
    $timeout(CR.init, 0);
});


/** Client Follow-up */
angular.module('MetronicApp').controller("clientFollowup", function ($scope, $http, $timeout) {
    var CR = this;
    CR.sdata = { p: 1, pagefrom: 'FOLLOW-UP' };
    CR.data = {};

    CR.get_districts = function (state_id, district_id) {
        CR.districts = [];
        CR.data.district = district_id ? district_id : '';
        if (!state_id) {
            return;
        }
        CR.all_districts.forEach(function (v) {
            if (v.state_id == state_id) {
                CR.districts.push(v);
            }
        })
    }

    CR.clear_data = function () {
        CR.data = {};
    }

    CR.set_lists_order = function (orderby) {
        CR.sdata.orderby = orderby;
        CR.lists();
    }

    CR.clear_search = function () {
        CR.sdata = { p: 1, pagefrom: 'FOLLOW-UP' };
        CR.lists();
    }

    CR.open_followup_form = function () {
        show_loader();
        if (CR.dtl.followup_count == null || CR.dtl.followup_count < 4) {
            var new_date = moment(CR.today_date, "DD MMM YYYY").add(14, 'days');
        } else {
            var new_date = moment(CR.today_date, "DD MMM YYYY").add(30, 'days');
        }
        var day = new_date.format('DD');
        var month = new_date.format('MMM');
        var year = new_date.format('YYYY');
        var someFormattedDate = day + ' ' + month + ' ' + year;

        CR.dtl.next_follow_up_date = someFormattedDate;
        $timeout(function () {
            set_numeric_input();
            set_datepicker($(".dateInpt1"));
            hide_form_errors($("#assfrm"));
            showModal($("#followupModal"), true);
            hide_loader();
        });
    }

    CR.recordRoutineFollowup = function (objD) {
        CR.dtl = objD;
        /** Default values */
        CR.data = { followuptype: 'R', is_side_effect: 'Y', pres_updated: 'Y' };
        CR.open_followup_form();
    }

    CR.recordAdhocFollowup = function (objD) {
        CR.dtl = objD;
        /** Default values */
        CR.data = { followuptype: 'A', is_side_effect: 'Y', pres_updated: 'Y' };
        CR.open_followup_form();
    }

    CR.save_followup_detail = function () {
        var frm = $("#flwfrm");
        hide_form_errors(frm);
        var formData = new FormData(frm[0]);
        show_loader();
        $http({ url: API_URL + 'ost/save_followup_detail', method: 'POST', data: formData, headers: { 'Content-Type': undefined } }).success(
            function (res) {
                if (res.success) {
                    show_alert_msg(res.msg);
                    CR.lists(CR.data.id ? CR.sdata.p : 1);
                    hideModal($("#followupModal"));
                } else {
                    show_form_errors(res.errors, frm, true);
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function (res) { showHttpErr(res); });
    }

    CR.isChecked = function (item, rflag) {
        retval = false;
        selectedItems = '';
        if (rflag == 'side_effects') {
            selectedItems = CR.data.side_effects;
        } else if (rflag == 'adhoc_reason') {
            selectedItems = CR.data.adhoc_reason;
        }

        if (selectedItems !== undefined) {
            item = item.toString();
            var items = selectedItems.split(',');
            retval = items.indexOf(item) != -1;
        }
        return retval;
    }

    CR.lists = function (p) {
        show_loader();
        CR.sdata.p = p ? p : 1;
        CR.sdata.stype = $("[name='stype']:checked").val();
        $http({ url: API_URL + 'ost/list_followup', params: CR.sdata }).success(
            function (res) {
                CR.result = res.result;
                CR.missed = res.missed;
                CR.page = res.page;
                $timeout(function () {
                    set_datepicker($(".dateInpt1"));
                });
            }
        ).error(function (res) { showHttpErr(res); });
    }

    CR.init = function () {
        show_loader();
        $http({ url: API_URL + 'ost/init_followup' }).success(
            function (res) {
                CR.states = res.states;
                CR.all_districts = res.districts;
                CR.today_date = res.today_date;
                CR.facdtl = res.facdtl;
                CR.drugs = res.drugs;
                CR.side_effects = res.side_effects;
                CR.adhoc_reason = res.adhoc_reason;
                $timeout(function () {
                    ngvisible();
                });
                CR.lists();
            }
        ).error(function (res) { showHttpErr(res); });
    }
    $timeout(CR.init, 0);
});

/** Client Transfer-out */
angular.module('MetronicApp').controller("clientTransferOut", function ($scope, $http, $timeout) {
    var CR = this;
    CR.sdata = { p: 1, pagefrom: 'TRANSFER-OUT' };
    CR.data = {};

    CR.get_districts = function (state_id, district_id) {
        CR.districts = [];
        CR.data.district = district_id ? district_id : '';
        if (!state_id) {
            return;
        }
        CR.all_districts.forEach(function (v) {
            if (v.state_id == state_id) {
                CR.districts.push(v);
            }
        })
    }

    CR.clear_data = function () {
        CR.data = {};
    }

    CR.set_lists_order = function (orderby) {
        CR.sdata.orderby = orderby;
        CR.lists();
    }

    CR.clear_search = function () {
        CR.sdata = { p: 1, pagefrom: 'TRANSFER-OUT' };
        CR.lists();
    }

    CR.accept_transfer_client = function (rob) {
        show_loader();
        CR.adata = angular.copy(rob);
        $('#new_ost_number').val('');
        $timeout(function () {
            set_numeric_input();
            hide_form_errors($("#trnfroutfrm"));
            showModal($("#transferOutModal"), true);
            hide_loader();
        });
    }


    CR.save_transfer_out_detail = function () {
        var frm = $("#trnfroutfrm");
        hide_form_errors(frm);
        var formData = new FormData(frm[0]);
        show_loader();
        $http({ url: API_URL + 'ost/save_transfer_out_detail', method: 'POST', data: formData, headers: { 'Content-Type': undefined } }).success(
            function (res) {
                if (res.success) {
                    show_alert_msg(res.msg);
                    CR.lists(CR.data.id ? CR.sdata.p : 1);
                    hideModal($("#transferOutModal"));
                } else {
                    show_form_errors(res.errors, frm, true);
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function (res) { showHttpErr(res); });
    }

    CR.viewDetail = function (id) {
        show_loader();
        $http({ url: API_URL + 'ost/beneficiary_detail/' + id + '/viewDtl' }).success(
            function (res) {
                CR.pdtl = res.dtl;               
                $("#patDtlModal").modal();                
            }            
        ).error(function (res) { showHttpErr(res); });
    }

    CR.lists = function (p) {
        show_loader();
        CR.sdata.p = p ? p : 1;
        CR.sdata.stype = $("[name='stype']:checked").val();
        $http({ url: API_URL + 'ost/list_beneficiary', params: CR.sdata }).success(
            function (res) {
                CR.result = res.result;
                CR.page = res.page;
                $timeout(function () {
                    set_datepicker($(".dateInpt1"));
                });
            }
        ).error(function (res) { showHttpErr(res); });
    }

    CR.init = function () {
        show_loader();
        $http({ url: API_URL + 'ost/init_beneficiary' }).success(
            function (res) {
                CR.states = res.states;
                CR.all_districts = res.districts;
                CR.today_date = res.today_date;
                CR.facdtl = res.facdtl;
                CR.drugs = res.drugs;
                CR.side_effects = res.side_effects;
                $timeout(function () {
                    ngvisible();
                });
                CR.lists();
            }
        ).error(function (res) { showHttpErr(res); });
    }
    $timeout(CR.init, 0);
});

angular.module('MetronicApp').controller("report", function ($scope, $http, $timeout) {
    var CR = this;
    CR.sdata = { p: 1, pagefrom: 'REPORT' };
    CR.data = {};

    CR.clear_data = function () {
        CR.data = {};
    }

    CR.clear_search = function () {
        CR.sdata = { p: 1, pagefrom: 'REPORT' };
        CR.lists();
    }

    CR.facility_level_report_details = function (p) {
        show_loader();
        CR.sdata.p = p ? p : 1;
        CR.sdata.stype = $("[name='stype']:checked").val();
        $http({ url: API_URL + 'ost/facility_level_report_details', params: CR.sdata }).success(
            function (res) {
                CR.sec1 = res['sec1'];
                CR.sec2 = res['sec2'];
                CR.sec3a = res['sec3a'];
                CR.sec3b = res['sec3b'];
                CR.sec3c = res['sec3c'];
                CR.sec3d = res['sec3d'];
                $timeout(function () {
                    set_datepicker($(".dateInpt"));
                });
            }
        ).error(function (res) { showHttpErr(res); });
    }

    CR.download_facility_level_report=function(){
        var url=API_URL+'ost/download_ost_monthly_report?'+$.param(CR.sdata);
        location.href=url;
    }


    CR.init = function () {
        show_loader();
        $http({ url: API_URL + 'ost/init_beneficiary' }).success(
            function (res) {
                CR.today_date = res.today_date;
                CR.facdtl = res.facdtl;
                $timeout(function () {
                    ngvisible();
                });
                CR.facility_level_report_details();
            }
        ).error(function (res) { showHttpErr(res); });
    }
    $timeout(CR.init, 0);
});

angular.module('MetronicApp').controller("dailyDispenceReport", function ($scope, $http, $timeout) {
    var CR = this;
    CR.sdata = { p: 1, pagefrom: 'REPORT' };
    CR.data = {};
    CR.total_count = 0;

    CR.dailyDosage = function(){
        show_loader();
        $http({ url: API_URL + 'ost/dosage_report', params: CR.sdata }).success(
            function (res) {
                CR.result = res;
                //CR.page = res.page;
                //CR.data.referred_from = 0;
            }
        ).error(function (res) { showHttpErr(res); });
    }
	  CR.excel_dailyDosage = function(){
        //show_loader();
        var url = API_URL+'ost/export_dosage_report?'+$.param(CR.sdata);
        location.href = url;
		//hide_loader();
    }
    /*CR.lists = function (p) {
        show_loader();
        CR.sdata.p = p ? p : 1;
        CR.sdata.stype = $("[name='stype']:checked").val();
        $http({ url: API_URL + 'ost/list_all_beneficiary', params: CR.sdata }).success(
            function (res) {
                CR.result = res;
  
            }
        ).error(function (res) { showHttpErr(res); });
    }*/

    CR.init = function () {
        show_loader();
        $http({ url: API_URL + 'ost/init_beneficiary' }).success(
            function (res) {
                CR.states = res.states;
                CR.all_districts = res.districts;
                CR.today_date = res.today_date;
                CR.facdtl = res.facdtl;
                $timeout(function () {
                    ngvisible();
                });
                //CR.lists();
            }
        ).error(function (res) { showHttpErr(res); });
    }
    $timeout(CR.init, 0);
});

/** Non Angular */
set_datepicker($(".dateInpt"));


$(document).on('click', '.un_add_batch_btn', function () {
    var $tr = $(this).closest('.batch_dtl_form_bx');
    var $clone = addProduct();
    $tr.before($clone);
    set_session_data();
    un_total_dosage = $('.un_total_dosage').text();
    if (un_total_dosage == '0.00') {
        $('#saveDispense').removeAttr('disabled');
    }
});

function addProduct() {
    rEl = $('.un_add_batch_btn').closest(".batch_dtl_form_bx");
    inventory_id = rEl.find('.prodName option:selected').val();
    pro_name = rEl.find('.prodName option:selected').text();
    prod_id = rEl.find('.prodName option:selected').attr('data-id');
    batch_no = rEl.find('.prodBatch option:selected').attr('data-batch');
    batch_id = rEl.find('.prodBatch option:selected').val();
    //  batch_no = rEl.find('.prodBatch option:selected').text();
    avl_qty = parseFloat(rEl.find('.avl_qty').val());
    disp_qty = rEl.find('.disp_qty').val();

    reqDosage = parseFloat($('.un_total_dosage').text());

    fillDosage = parseFloat($('#disp_qty').val());

    if (prodId == 44 || prodId == 103) {
        remDosage = reqDosage - fillDosageinmg;
    } else {
        remDosage = reqDosage - fillDosage;
    }
    filledDosage = fillDosageinmg ? fillDosageinmg : fillDosage;

    if (!pro_name || !batch_no || !avl_qty || !disp_qty || (filledDosage > reqDosage) || (fillDosage > avl_qty)) {
        return;
    }

    $('.un_total_dosage').text(remDosage.toFixed(2));

    el = '<tr class="vmid hmid un_batch_row">' +
        '<td>' + pro_name + '</td>' + '<td>' + batch_no + '</td>' + '<td>' + avl_qty + '</td>' + '<td>' + disp_qty + '</td>' + '<td><a href="javascript:void(0);"  class="text-danger un_batch_del"><i class="fa fa-remove"></i></a></td>' +
        '<input type="hidden" value="' + avl_qty + '" class="avlQty"><input type="hidden" value="' + disp_qty + '" class="disp_qty"><input type="hidden" value="' + filledDosage + '" class="filledDosage"><input type="hidden" class="batchId" value="' + batch_id + '"><input type="hidden" class="productId" value="' + prod_id + '"><input type="hidden" class="inventory_id" value="' + inventory_id + '">' +
        '</tr>';
    rEl.find('input').val('');
    $(".prodName option[value='']").attr('disabled', 'disabled');
    $(".prodName option:selected").attr('disabled', 'disabled');
    $(".prodBatch option:selected").attr('disabled', 'disabled');
    $(".avl_qty").val(0);
    return el;
}

$(document).on('change', '#prodBatch', function () {
    var avlqty = $(this).find(':selected').attr('data-qty');
    $('#prodBatch').parent('td').next().find('.avl_qty').val(avlqty);
});

$(document).on('click', ".un_batch_del", function (e) {
    e.preventDefault();
    reqDosage = $('.un_total_dosage').text();
    prntObj = $(this).parent().parent();
    fillDosage = prntObj.find('.filledDosage').val();

    remDosage = parseFloat(reqDosage) + parseFloat(fillDosage);
    $('.un_total_dosage').text(remDosage.toFixed(2));

    enableOption1 = prntObj.find('.inventory_id').val();
    $(".prodName option[value=" + enableOption1 + "]").removeAttr('disabled');

    enableOption = prntObj.find('.batchId').val();
    $(".prodBatch option[value=" + enableOption + "]").removeAttr('disabled');
    $(".prodBatch option[value!='']").removeAttr('selected');
    $(".prodBatch option[value='']").attr('selected', 'selected');

    $('#saveDispense').attr("disabled", "disabled");

    prntObj.remove();

    set_session_data();
});

function qtyComparison(objD) {
    reqDosage = parseFloat($('.un_total_dosage').text());
    fillDosage = parseFloat($(objD).val());
    avl_qty = parseFloat($('.avl_qty').val());

    prodId = $(objD).parent().parent().find(':selected').attr('data-id');
    if (prodId == 44) { // 2mg
        fillDosageinmg = parseFloat(fillDosage * 2).toFixed(2);
    } else if (prodId == 103) { //0.4mg
        fillDosageinmg = parseFloat(fillDosage * 0.4).toFixed(2);
    } else {
        fillDosageinmg = fillDosage;
    }

    if (fillDosage > avl_qty) {
        $('#spn_qty').text('Quantity is more than Available Quantity.');
        $('#spn_qty').show();
    } else if ((fillDosageinmg > reqDosage) && (prodId == 44 || prodId == 103)) {
        $('#spn_qty').text('Quantity is more than required Dosage.');
        $('#spn_qty').show();
    } else if ((fillDosage > reqDosage) && !(prodId == 44 || prodId == 103)) {
        $('#spn_qty').text('Quantity is more than required Dosage.');
        $('#spn_qty').show();
    }
    else {
        $('#spn_qty').hide();
    }
}

function set_session_data() {
    var data_arr = [];
    $(".un_batch_row").each(function () {
        p = $(this);
        data_arr.push({
            product_id: p.find('.productId').val(),
            batch_id: p.find('.batchId').val(),
            current_qty: p.find('.disp_qty').val(),
            available_qty: p.find('.avlQty').val()
        });
    });

    $.ajax({
        url: SITE_URL + "ost/store_data_in_session",
        method: 'post',
        data: { 'pros': data_arr, 'csrf_imsnaco': get_csrf_cookie() },
        success: function (res) {
            // console.log('res'+res);
        }
    });
}

function openOnOfFunction() {
    new DG.OnOffSwitchAuto({
        cls: '.custom-switch',
        textOn: "YES",
        height: 35,
        textOff: "NO",
        textSizeRatio: 0.35,
        listener: function (name, checked) {
            document.getElementById("listener-text-table").innerHTML = "Switch " + name + " changed value to " + checked;
        }
    });
}

//EOF