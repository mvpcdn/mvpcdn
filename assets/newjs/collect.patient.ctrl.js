/** Collect Samples */
angular.module('MetronicApp').controller("PatientDetails", function ($scope, $http, $timeout) {
    var CR=this;
    CR.data={samples:[]};

    CR.clear_psearch=function(){
        CR.psearchk=''; 
        //CR.presult=[];
		CR.patient_search();
        $("[autofocus]").focus();
    }
	
	 CR.clear_vsearch=function(){
        CR.vsearchk=''; 
       // CR.vresult=[];
	   CR.visited_patient();
        $("[autofocus]").focus();
    }
	
	$scope.init = function(){
		CR.patient_search();
        CR.visited_patient();
       // CR.visitlist();
	}

    $scope.getTotal = function(){
        CR.visitlist();
    }

    // CR.visitlist = function(){
    //     console.log('new visiting');
    // }

    CR.patient_search=function(){
       /* if(!CR.psearchk){
            return;
        }
		*/
		//alert("Angularjs call function on page load");
        show_loader();
        $http({url: API_URL+'perception/patient_search', params:{k:CR.psearchk}}).success(
            function(res){
                CR.presult=res.result;

                $timeout(function(){
                    $("#plistbx").scrollTop(0);
                });
            }
        ).error(function(res){showHttpErr(res);});
    }

	CR.visited_patient=function(){
       /* if(!CR.psearchk){
            return;
        }
		*/
		//alert("Angularjs call function on page load");
        show_loader();
        $http({url: API_URL+'perception/patient_search', params:{k:CR.vsearchk,t:'visited'}}).success(
            function(res){
                CR.vresult=res.result;

                $timeout(function(){
                    $("#vlistbx").scrollTop(0);
                });
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.test='CD4';
    CR.pick_patient=function(rob){
        var flg=0;
        CR.data.samples.forEach(function(v){
            if(rob.patient_id==v.patient_id){
                flg=1;
                return false;
            }
        });
        if(flg==1){
            rob.disabled=true;
            return;
        }

        var ob=angular.copy(rob);
        ob.id='';
        ob.test=CR.test;
        ob.barcode_no='';
        ob.test_type=ob.test=='CD4'?'':'1';
        CR.data.samples.unshift(ob);
        rob.disabled=true;

        $timeout(function(){
            $("#added_samples_div").scrollTop(0);
            $("#added_samples_div .bcode").eq(0).focus();
        });
    }

    CR.unpick_patient=function(patient_id, i){
        CR.data.samples.splice(i,1);
        $.each(CR.presult, function(j, v){
            if(patient_id==v.patient_id){
                CR.presult[j].disabled=false;
                return false;
            }
        });
    }

    CR.change_test=function(rob){
        CR.test=rob.test;
        if(rob.test=='CD4'){
            rob.test_type='';
            rob.barcode_no='';
        }else{
            rob.test_type='1';
        }
    }

  
    CR.init=function(){
        CR.ddata={samples:[]};
        CR.curdate=moment().format('DD MMM YYYY');
        CR.minsdate=moment().subtract(3, "month").format('DD MMM YYYY');
        if(location.href.indexOf("collected_cd4_samples")!==-1){
            CR.list_collected_cd4_samples();
            apply_select2($("#nodal_dd"), "Select Nodal Center");
        }else{
            $timeout(function(){ngvisible();});
        }
    }
    CR.init();
});

/** Non Angular Script */

$("#next_app_date").change(function () {
    $(".ndays_bx input[type='radio']").prop('checked', false);
});

function dispense_date_setting() {    
    if(givenDays == 14){
        $("#d14").prop('checked', true);
    }
    else if(givenDays == 30){
        $("#d30").prop('checked', true);
    }
    else if(givenDays == 60){
        $("#d60").prop('checked', true);
    }
    else if(givenDays == 90){
        $("#d90").prop('checked', true);
    }

    var today = $("#today_date").val();
    var newdate = get_app_date(today, givenDays);
    $("#next_app_date").val(newdate);
   
    $(".ndays_bx input[type='radio']").off('click');
    $(".ndays_bx input[type='radio']").click(function () {
        n = $(this).val();
        newdate = get_app_date(today, n);
        $("#next_app_date").val(newdate);
    });
}

/** Date settings **/
function get_app_date(ddate, ndays) {
    ndays = parseInt(ndays);
    var ndate = new Date(ddate);

    ndate.setDate(ndate.getDate() + ndays);

    var c = true, i = 0;

    while (c === true) {
        if (is_holiday(ndate.getDate(), ndate.getMonth() + 1, ndate.getFullYear(), ndate.getDay())) {
            ndate.setDate(ndate.getDate() - 1);
        } else {
            c = false;
        }
        i++;

        if (i > 365)
            break;
    }

    var dd = ndate.getDate();
    var mm = ndate.getMonth();
    var yy = ndate.getFullYear();
    dd = dd < 10 ? '0' + dd : dd;
    var newdate = dd + ' ' + getMonthName(mm) + ' ' + yy;
    return newdate;
}

function is_holiday(d, m, y, wd) {
    flg = false;
    var holidays = $.parseJSON($("#holidays").val());
    if (wd == 0) {
        flg = true;
    } else {
        if (holidays) {
            $.each(holidays, function (k, v) {
                if (d == v.d && m == v.m && y == v.y) {
                    flg = true;
                    return false;
                }
            });
        }
    }

    return flg;
}

$('#newProdName').on('change', function() {
    if ($(this).val() == null) {
        $("#prodQty").text('--');
        return false;
    }
    var strVal = $(this).val().toString();
    var prod_id = Array();
    var prod_cod = Array();
    objArr = strVal.split(',');
    $.each(objArr, function(index, value) {
        strval = value.split('###');
        prod_id[index] = strval[0];
        prod_cod[index] = strval[1];
    });
    show_noti('Loading...');
    $.ajax({
        url: SITE_URL + "perception/checkAvailability",
        method: 'POST',
        data: {
            product_id: prod_id,
            product_code: prod_cod,
            csrf_imsnaco: get_csrf_cookie()
        },
        dataType: 'JSON',
        success: function(res) {
            var dataVal = '';
            $.each(res, function(k, v) {
                dataVal += v + ' , ';
            });
            var dataVal = dataVal.replace(/^ , | , $/g, '');
            $("#prodQty").text(dataVal);
            hide_noti();
        }
    });
});

var sideEffectArr = [];

    function multipleselect(obj) {
        var idd = $(obj).attr('id');
        var clsname = $('#bg_' + idd).attr('class');

        if ($('#bg_' + idd).hasClass('defaultImg')) {
            $('#bg_' + idd).removeClass('defaultImg').addClass('selectImg');
            sideEffectArr.push(idd);
        } else if ($('#bg_' + idd).hasClass('selectImg')) {
            $('#bg_' + idd).removeClass('selectImg').addClass('defaultImg');
            sideEffectArr = jQuery.grep(sideEffectArr, function(value) {
                return value != idd;
            });
        }
    }

    var OIArr = [];

    function multipleOI(obj) {
        var idd = $(obj).attr('id');
        var clsname = $('#oi_' + idd).attr('class');

        if ($('#oi_' + idd).hasClass('defaultOI')) {
            $('#oi_' + idd).removeClass('defaultOI').addClass('selectOI');
            OIArr.push(idd);
        } else if ($('#oi_' + idd).hasClass('selectOI')) {
            $('#oi_' + idd).removeClass('selectOI').addClass('defaultOI');
            OIArr = jQuery.grep(OIArr, function(value) {
                return value != idd;
            });
        }
    }

    function changeProd(obj) {
        if (obj.id == 'changeBtn') {
            $('#changeBtn').text('Confirm');
            $('#changeBtn').attr('id', 'confirmBtn');
            $('#changeBtn').attr('name', 'confirmBtn');
            $('#newProdDiv').show();
            $('#cancelBtn').show();
            $('#continueBtn').hide();
        } else if (obj.id == 'cancelBtn') {
            $('#confirmBtn').text('Change');
            $('#confirmBtn').attr('id', 'changeBtn');
            $('#confirmBtn').attr('name', 'changeBtn');
            $('#cancelBtn').hide();
            $('#newProdDiv').hide();
            $('#continueBtn').show();
        } else if (obj.id == 'confirmBtn') {
            saveData(obj.id);
        }
    }

    function show_noti(msg, timeout) {
        $(".top-noti .msg").html(msg);

        if (timeout != undefined) {
            $(".top-noti").show().delay(timeout).fadeOut(300);
        } else {
            $(".top-noti").show();
        }
    }

    function hide_noti() {
        $(".top-noti").fadeOut(300);
    }