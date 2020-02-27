var product_id = $("#product_id").val();
var sch_no = $("#sch_no").val();
var product_qty = $("#product_qty").val();
var allotment_date = $("#allotment_date_inpt").val();
noa_status=$("#noa_status").val();

function lotsVisibility(flg) {
    $(".lotsSEDates td.dt-col").each(function(i) {
        if (i == 0)
            return true;
        dt = $(this).find('.lot_date').eq(0).val();
        if (flg == true)
            dt = $(this).is(":visible");

        if (!dt || dt == 0) {
            n = $(this).index();
            $(".dispatch-tbl tr").each(function(i) {
                $(this).find('th, td').eq(n).hide();
            });
        }
    });
}

function update_pro_lot_dates(){
    $.each(dispatch_arr, function(k, v){
        if(v.product_id==product_id){
            $.each(v.schedules, function(k1, v1){
                v1.L1_sd=$("#lot1_start_date").val();    v1.L1_ed=$("#lot1_end_date").val();
                v1.L2_sd=$("#lot2_start_date").val();    v1.L2_ed=$("#lot2_end_date").val();
                v1.L3_sd=$("#lot3_start_date").val();    v1.L3_ed=$("#lot3_end_date").val();
                v1.L4_sd=$("#lot4_start_date").val();    v1.L4_ed=$("#lot4_end_date").val();
            });
        }
    });
}

function getNextHiddenLotIndex() {
    n = -1;
    $(".lotsSEDates td.dt-col").each(function() {
        if (!$(this).is(":visible")) {
            n = $(this).index();
            return false;
        }
    });

    return n;
}

function tableWidth() {
    n = getNextHiddenLotIndex();

    switch (n) {
        case -1:
            $(".dispatch-tbl").css({'width': '100%'});
            break;
        case 2:
            $(".dispatch-tbl").css({'width': '50%'});
            break;
        case 3:
            $(".dispatch-tbl").css({'width': '65%'});
            break;
        case 4:
            $(".dispatch-tbl").css({'width': '85%'});
            break;
        default:
            $(".dispatch-tbl").css({'width': '50%'});
            break;
    }
}

function addLotBtnVisibility() {
    n = getNextHiddenLotIndex();
    if (n == -1)
        $(".add-lot-btn").hide();
    else
        $(".add-lot-btn").show();
}

function removeBtnVisibility() {
    n = getNextHiddenLotIndex();
    if (n == -1)
        n = 2;
    else
        n = n - 3;

    $(".remove-lot").hide();
    $(".remove-lot").eq(n).show();
}

function addLot() {
    n = getNextHiddenLotIndex();
    if (n > -1) {
        $(".dispatch-tbl tr").each(function(i) {
            $(this).find('th, td').eq(n).show();
        });
    }

    addLotBtnVisibility();
    removeBtnVisibility();
    tableWidth();
}

function removeLot() {
    n = getNextHiddenLotIndex();
    if (n == -1)
        n = 4;
    else
        n = n - 1;

    $(".dispatch-tbl tr").each(function(i) {
        $(this).find('th, td').eq(n).hide();
        $(this).find('td').eq(n).find('input').val('');
    });

    addLotBtnVisibility();
    removeBtnVisibility();
    tableWidth();
}

$(".add-lot-btn").click(function() {
    addLot();
});

$(".remove-lot").click(function(e) {
    e.preventDefault();
    removeLot();
    setTotal();
});


function activeRemoveDispatch() {
    $(".remove-dispatch").click(function(e) {
        e.preventDefault();
        pEl = $(this).parent().parent();

        consignee_type = pEl.find('.consignee_type').val();
        consignee_id = pEl.find('.consignee_id').val();
        //$('.sacs-dd option[value="' + sacs_id + '"]').show();
        if(consignee_type=='LAB'){
            $('.labs-dd option[value="' + consignee_id + '"]').prop('disabled', false);
            apply_select2_delay($(".labs-dd"), 'Select LAB');
        }else{
            $('.sacs-dd option[value="' + consignee_id + '"]').prop('disabled', false);
            apply_select2_delay($(".sacs-dd"), 'Select SACS');
        }
        pEl.remove();
        setTotal();

    });
}

function activeQtyChangeEvent() {
    $(".lot1_qty, .lot2_qty, .lot3_qty, .lot4_qty").on("keyup paste", function() {
        setTimeout(function() {
            setTotal();
        }, 100); //Paste event doesn't work without setTimeout
    });
}

function setTotal() {
    qty_error = false;

    $(".sacs-row").each(function() {
        ob = $(this);
        t = getNumValue(ob.find('.lot1_qty').val()) + getNumValue(ob.find('.lot2_qty').val()) + getNumValue(ob.find('.lot3_qty').val()) + getNumValue(ob.find('.lot4_qty').val());
        ob.find('.rtotal').html(t);
    });

    qty1 = qty2 = qty3 = qty4 = 0;
    $(".lot1_qty").each(function() {
        qty1 = qty1 + getNumValue($(this).val())
    });
    $(".lot2_qty").each(function() {
        qty2 = qty2 + getNumValue($(this).val())
    });
    $(".lot3_qty").each(function() {
        qty3 = qty3 + getNumValue($(this).val())
    });
    $(".lot4_qty").each(function() {
        qty4 = qty4 + getNumValue($(this).val())
    });

    $(".qty1_total").html(qty1);
    $(".qty2_total").html(qty2);
    $(".qty3_total").html(qty3);
    $(".qty4_total").html(qty4);

    total_qty = qty1 + qty2 + qty3 + qty4;
    $(".total_qty").html(total_qty);

    if (product_qty == total_qty) {
        $(".total_qty").removeClass('danger').addClass('success');
    }
    else {
        qty_error = true;
        $(".total_qty").removeClass('success').addClass('danger');
    }
}

function setNoOfDays() {
    $(".ndays").each(function() {
        var lot_date=$(this).parent().find('.lot_date').val();
        if(lot_date)
            ndays = noOfDays(allotment_date, lot_date);
        else
            ndays='';
        
        $(this).val(ndays);
    });
}

function getSacsList() {
    el = '';
    var sacs = $.parseJSON($("#sacs").val());
    var labs = $.parseJSON($("#labs").val());
    
    if (dispatch_arr && $.isArray(dispatch_arr)) {
        $.each(dispatch_arr, function(k, v) {
            if (v.product_id == product_id && $.isArray(v.schedules)) {
                $.each(v.schedules, function(i, dtl){
                    if(typeof dtl.L2_sd == "undefined" || !dtl.L2_sd){dtl.L2_sd='';} if(typeof dtl.L2_ed == "undefined" || !dtl.L2_ed){dtl.L2_ed='';}
                    if(typeof dtl.L3_sd == "undefined" || !dtl.L3_sd){dtl.L3_sd='';} if(typeof dtl.L3_ed == "undefined" || !dtl.L3_ed){dtl.L3_ed='';}
                    if(typeof dtl.L4_sd == "undefined" || !dtl.L4_sd){dtl.L4_sd='';} if(typeof dtl.L4_ed == "undefined" || !dtl.L4_ed){dtl.L4_ed='';}
                    
                    if(dtl.sch_no==sch_no){
                        $("#lot1_start_date").val(dtl.L1_sd);   $("#lot1_end_date").val(dtl.L1_ed);
                        $("#lot2_start_date").val(dtl.L2_sd);   $("#lot2_end_date").val(dtl.L2_ed);
                        $("#lot3_start_date").val(dtl.L3_sd);   $("#lot3_end_date").val(dtl.L3_ed);
                        $("#lot4_start_date").val(dtl.L4_sd);   $("#lot4_end_date").val(dtl.L4_ed);
                        
                        if($.isArray(dtl.sacs) && dtl.sacs.length > 0){
                            $.each(dtl.sacs, function(k, v) {
                                loc_type = v.consignee_type;
                                loc_name = loc_type=='SACS'?sacs[v.consignee_id]:labs[v.consignee_id];
                                el=el+'<tr class="sacs-row">' +
                                        '<td class="text-center">' +
                                            '<input type="hidden" class="consignee_type" value="' + loc_type + '"><input type="hidden" class="consignee_id" value="' + v.consignee_id + '">' + loc_name +
                                        '</td>' +
                                        '<td><input type="text" class="form-control lot1_qty" valid="int" value="' + v.qty1 + '" maxlength="10"><input type="hidden" class="lot1_dis" value="' + v.dis1 + '" ><input type="hidden" class="lot1_dil" value="' + v.dil1 + '" ></td>' +
                                        '<td><input type="text" class="form-control lot2_qty" valid="int" value="' + v.qty2 + '" maxlength="10"><input type="hidden" class="lot2_dis" value="' + v.dis2 + '" ><input type="hidden" class="lot2_dil" value="' + v.dil2 + '" ></td>' +
                                        '<td><input type="text" class="form-control lot3_qty" valid="int" value="' + v.qty3 + '" maxlength="10"><input type="hidden" class="lot3_dis" value="' + v.dis3 + '" ><input type="hidden" class="lot3_dil" value="' + v.dil3 + '" ></td>' +
                                        '<td><input type="text" class="form-control lot4_qty" valid="int" value="' + v.qty4 + '" maxlength="10"><input type="hidden" class="lot4_dis" value="' + v.dis4 + '" ><input type="hidden" class="lot4_dil" value="' + v.dil4 + '" ></td>' +
                                        '<td class="rtotal"></td>' +
                                        '<td class="text-center">' +
                                            '<a href="#" class="remove-dispatch text-danger"><i class="fa fa-trash"></i></a>' +
                                        '</td>' +
                                    '</tr>';
                            });
                        }
                        return false;
                    }
                });
                return false;
            }
        });
    }

    if (el) {
        $(el).insertBefore($("#total_row"));
        activeQtyChangeEvent();
    }
}

$(".add-sacs-dispatch-btn").click(function(e) {
    e.preventDefault();
//    var sacs_name;
    var loc_name;
    var loc_type = $("#consignee_type").val();

    pEl = $(this).parent().parent();
    if(loc_type=='SACS'){
        loc_id = $('.sacs-dd').val();
        loc_name = $('.sacs-dd > option:selected').text();
    }else if(loc_type=='LAB'){
        loc_id = $('.labs-dd').val();
        loc_name = $('.labs-dd > option:selected').text();
    }else{
        loc_id = $('.sacs-dd').val();
        loc_name = $('.sacs-dd > option:selected').text();
    }

    lot1_qty = pEl.find('.lot1-qty').val();
    lot2_qty = pEl.find('.lot2-qty').val();
    lot3_qty = pEl.find('.lot3-qty').val();
    lot4_qty = pEl.find('.lot4-qty').val();

    lot1_dis = pEl.find('.lot1-dis').val();
    lot2_dis = pEl.find('.lot2-dis').val();
    lot3_dis = pEl.find('.lot3-dis').val();
    lot4_dis = pEl.find('.lot4-dis').val();

    lot1_dil = pEl.find('.lot1-dil').val();
    lot2_dil = pEl.find('.lot2-dil').val();
    lot3_dil = pEl.find('.lot3-dil').val();
    lot4_dil = pEl.find('.lot4-dil').val();

    if (!loc_id || !lot1_qty){
        return;
    }

    lot1_qty_s = lot1_qty?lot1_qty:0;
    lot2_qty_s = lot2_qty?lot2_qty:0;
    lot3_qty_s = lot3_qty?lot3_qty:0;
    lot4_qty_s = lot4_qty?lot4_qty:0;

    lot1_dis_s = lot1_dis?lot1_dis:0;
    lot2_dis_s = lot2_dis?lot2_dis:0;
    lot3_dis_s = lot3_dis?lot3_dis:0;
    lot4_dis_s = lot4_dis?lot4_dis:0;

    lot1_dil_s = lot1_dil?lot1_dil:0;
    lot2_dil_s = lot2_dil?lot2_dil:0;
    lot3_dil_s = lot3_dil?lot3_dil:0;
    lot4_dil_s = lot4_dil?lot4_dil:0;

    el = '<tr class="sacs-row">' +
            '<td class="uc text-center bold">' +
                '<input type="hidden" class="consignee_type" value="' + loc_type + '"><input type="hidden" class="consignee_id" value="' + loc_id + '">' + loc_name +
            '</td>' +
            '<td><input type="text" class="form-control lot1_qty" valid="int" value="' + lot1_qty_s + '" maxlength="10"><input type="hidden" class="lot1_dis" value="' + lot1_dis_s + '"><input type="hidden" class="lot1_dil" value="' + lot1_dil_s + '"></td>' +
            '<td><input type="text" class="form-control lot2_qty" valid="int" value="' + lot2_qty_s + '" maxlength="10"><input type="hidden" class="lot2_dis" value="' + lot2_dis_s + '"><input type="hidden" class="lot2_dil" value="' + lot2_dil_s + '"></td>' +
            '<td><input type="text" class="form-control lot3_qty" valid="int" value="' + lot3_qty_s + '" maxlength="10"><input type="hidden" class="lot3_dis" value="' + lot3_dis_s + '"><input type="hidden" class="lot3_dil" value="' + lot3_dil_s + '"></td>' +
            '<td><input type="text" class="form-control lot4_qty" valid="int" value="' + lot4_qty_s + '" maxlength="10"><input type="hidden" class="lot4_dis" value="' + lot4_dis_s + '"><input type="hidden" class="lot4_dil" value="' + lot4_dil_s + '"></td>' +
            '<td class="rtotal"></td>' +
            '<td class="text-center">' +
            '<a href="#" class="remove-dispatch text-danger"><i class="fa fa-trash"></i></a>' +
            '</td>' +
            '</tr>';

    $(el).insertBefore($("#total_row"));
    
    lotsVisibility(true);

    activeRemoveDispatch();
    setTotal();
    activeQtyChangeEvent();
    initUtilFunctions();
    /** **/
    $('#consign-dd, .labs-dd, .sacs-dd, .lot1-qty, .lot2-qty, .lot3-qty, .lot4-qty').val('');
    //$('.sacs-dd option[value="' + sacs_id + '"]').hide();
    if(loc_type=='SACS'){
        $('.sacs-dd option[value="' + loc_id + '"]').prop('disabled', true);
        apply_select2_delay($(".sacs-dd"), 'Select SACS');
    }else{
        $('.labs-dd option[value="' + loc_id + '"]').prop('disabled', true);
        apply_select2_delay($(".labs-dd"), 'Select Labs');
    }
});


$(".save-sacs-dispatch-btn").click(function() {
    /** Validation **/
    var error = false;
    
    if((noa_status==2 || noa_status==3) && parseInt(product_qty) != parseInt($(".total_qty").text())){
        error = true; alert('Schedule can not be dispatched because quantity is mismatched'); return;
    }
    
    if ($(".consignee_id").length <= 0) {
        error = true; alert('Please add at least one Consignee Info'); return;
    }

    if (!$("#lot1_start_date").val() || !$("#lot1_end_date").val()) {
        error = true; alert('Please enter Lot1 start and last date'); return;
    }

    for (i = 2; i <= 4; i++) {
        if (($("#lot" + i + "_start_date").val() && !$("#lot" + i + "_end_date").val()) || (!$("#lot" + i + "_start_date").val() && $("#lot" + i + "_end_date").val())) {
            error = true; alert('Please enter Lot' + i + ' start and last date both'); return;
        }
        else if (!$("#lot" + i + "_start_date").val() || !$("#lot" + i + "_end_date").val()) {
            flg = 0;
            $(".lot" + i + "_qty").each(function() {
                if (getNumValue($(this).val())) {flg = 1; return false;}
            });

            if (flg == 1) {
                error = true; alert('Please enter Lot' + i + ' start and last date'); return;
            }
        }
        else if ($("#lot" + i + "_start_date").val() && $("#lot" + i + "_end_date").val()) {
            flg = 0;
            $(".lot" + i + "_qty").each(function() {
                if (getNumValue($(this).val())) { flg = 1; return false; }
            });

            if (flg == 0) {
                error = true; alert('Please enter Lot' + i + ' quantity'); return;
            }
        }
    }


    if (error)
        return;
    /** Validation end **/
    //dispatch_arr=[];
    
    L1_sd=$("#lot1_start_date").val();  L1_ed=$("#lot1_end_date").val();
    L2_sd=$("#lot2_start_date").val();  L2_ed=$("#lot2_end_date").val();
    L3_sd=$("#lot3_start_date").val();  L3_ed=$("#lot3_end_date").val();
    L4_sd=$("#lot4_start_date").val();  L4_ed=$("#lot4_end_date").val();
    
    //update_pro_lot_dates();
    
    var sacs=[];
    $(".consignee_id").each(function(i) {
        sacs.push({consignee_id: $(this).val(),consignee_type: $(".consignee_type").eq(i).val(), qty1: $(".lot1_qty").eq(i).val(), qty2: $(".lot2_qty").eq(i).val(), qty3: $(".lot3_qty").eq(i).val(), qty4: $(".lot4_qty").eq(i).val(), dis1: $(".lot1_dis").eq(i).val(), dis2: $(".lot2_dis").eq(i).val(), dis3: $(".lot3_dis").eq(i).val(), dis4: $(".lot4_dis").eq(i).val(), dil1: $(".lot1_dil").eq(i).val(), dil2: $(".lot2_dil").eq(i).val(), dil3: $(".lot3_dil").eq(i).val(), dil4: $(".lot4_dil").eq(i).val()});
    });
    
    var pro_arr={
        product_id: product_id,
        schedules: [{sch_no: sch_no, L1_sd: L1_sd, L1_ed: L1_ed, L2_sd: L2_sd, L2_ed: L2_ed, L3_sd: L3_sd, L3_ed: L3_ed, L4_sd: L4_sd, L4_ed: L4_ed, sacs: sacs}],
    }
    
    //document.title=dispatch_arr[0].schedules[0].sch_no;
    
    pflg=0;
    $.each(dispatch_arr, function(k, v){
        if(v.product_id==product_id){
            pflg=1;
            sflg=0;
            $.each(v.schedules, function(k1, v1){
                if(v1.sch_no==sch_no){
                    sflg=1; dispatch_arr[k].schedules[k1]=pro_arr.schedules[0]; return false;
                }
            });
            if(sflg==0)
                dispatch_arr[k].schedules.push(pro_arr.schedules[0]);
            
            return false;
        }
    });
    if(pflg==0)
        dispatch_arr.push(pro_arr);
    
    //console.log(JSON.stringify(dispatch_arr));
    $.fancybox.close();
});


function hide_sacs_added(){
    console.log('Hello');
    $.each(dispatch_arr, function(k, v) {
        if (v.product_id == product_id && $.isArray(v.schedules)) {
            $.each(v.schedules, function(i, dtl){
                if($.isArray(dtl.sacs) && dtl.sacs.length > 0){
                    $.each(dtl.sacs, function(k, v) {
                        if(v.consignee_type=='LAB'){
                            $('.labs-dd option[value="' + v.consignee_id + '"]').prop('disabled', true);
                        }else{
                            $('.sacs-dd option[value="' + v.consignee_id + '"]').prop('disabled', true);
                        }
                    });
                }
            });
            return false;
        }
    });
    apply_select2_delay($(".sacs-dd"), 'Select SACS');
    apply_select2_delay($(".labs-dd"), 'Select LAB');
}


/** Initialize **/
setDateToInputs();
getSacsList();
activeRemoveDispatch();
setTotal();
activeQtyChangeEvent();
initUtilFunctions();
lotsVisibility();

addLotBtnVisibility();
removeBtnVisibility();
tableWidth();

hide_sacs_added();

/** Lot date setting **/
var sd1, ed1, sd2, ed2, sd3, ed3, sd4, ed4;
sd1=$("#lot1_start_date").val();    ed1=$("#lot1_end_date").val();
sd2=$("#lot2_start_date").val();    ed2=$("#lot2_end_date").val();
sd3=$("#lot3_start_date").val();    ed3=$("#lot3_end_date").val();
sd5=$("#lot4_start_date").val();    ed4=$("#lot4_end_date").val();

function date_picker(el, mindate, maxdate){
    var d=el.val();
    el.prop('readonly', true);
    el.datepicker({dateFormat: "dd M yy", changeYear: true, changeMonth: true});
    if(mindate) {el.datepicker("option", "minDate", mindate);}
    if(maxdate) {el.datepicker("option", "maxDate", maxdate);}
    el.datepicker("setDate", d);
}

function set_date_minmax(el, mindate, maxdate){
    if(mindate) {el.datepicker("option", "minDate", mindate);}
    if(maxdate) {el.datepicker("option", "maxDate", maxdate);}
}

function convert_date_format(dt){
    var dd = dt.getDate(), mm = dt.getMonth(), yy = dt.getFullYear();  dd=dd<10?'0'+dd:dd;  
    var newdate = dd + ' '+ getMonthName(mm) + ' '+ yy;
    return newdate;
}

function update_minmax(el, d){
    if(!d) {return;}
    var dno=getNumValue(el.attr('dno'));
    if(dno<8){
        var dt=new Date(d);
        dt.setDate(dt.getDate()+1);
        set_date_minmax($("[dno='"+(dno+1)+"']"), dt);
    }
    set_enabled_lot_dates();
}

function date_select_event(el){
    el.datepicker("option", "onSelect", function(d){
        setNoOfDays();
        update_minmax(el, d);
    });
    
    update_minmax(el, el.val());
}

function calc_date(el){
    var dt_el=el.parent().find('.lot_date');
    var n=el.val();
    if(n=='') {
        dt_el.val('');
    }else{
        var dt=new Date(allotment_date);
        dt.setDate(dt.getDate()+getNumValue(n));
        dt_el.val(convert_date_format(dt));
    }
    update_minmax(dt_el, dt_el.val());
    
    setNoOfDays();
}

function set_enabled_lot_dates(){
    for(var i=2; i<=8; i++){
        var prev_d=$("[dno='"+(i-1)+"']").val();
        if(!prev_d){
            $("[dno='"+i+"'], [nno='"+i+"']").prop('disabled', true);
            $("[dno='"+i+"']").prop('readonly', false);
        }else{
            $("[dno='"+i+"'], [nno='"+i+"']").prop('disabled', false);
            $("[dno='"+i+"']").prop('readonly', true);
        }
    }
}

$(".ndays").change(function(){
    var nno=getNumValue($(this).attr('nno'));
    var n=$(this).val();
    
    if(nno>1){
        n1=getNumValue($("[nno='"+(nno-1)+"']").val());
        if(n!=''){
            if(n<=n1){
                n=getNumValue(n);
                $(this).val(n1+1);
            }
        }
    }
    calc_date($(this));
});

$(".ndays").keyup(function(){
    calc_date($(this));
});

$(".lot_date").each(function(){date_picker($(this), allotment_date);});
$(".lot_date").each(function(){date_select_event($(this));});
setNoOfDays();

if(noa_status==2 || noa_status==3){
    $(".remove-lot, .remove-dispatch").remove();
    $(".dt-col input").prop({disabled: true, readonly: false});
}else{
    set_enabled_lot_dates();
}

$("#consign-dd").change(function(){
    var type = $(this).val();
    $("#consignee_type").val(type);
    if(type!=''){
        $(".congn_list").hide();
        if(type=='SACS'){
            $("#sacs_list").show();
        }else if(type=='RWH'){
            $("#sacs_list").show();
            $("#rwh_list").show();
            var sacs_id = $('.sacs-dd').val();
            if(sacs_id){
                getRwhList(sacs_id);
            }
        }else if(type=='FAC'){
            $("#sacs_list").show();
            $("#facs_list").show();
            var sacs_id = $('.sacs-dd').val();
            if(sacs_id){
                getFacilityList(sacs_id);
            }
        }else if(type=='LAB'){
            $("#labs_list").show();
        }
    }else{
        $(".congn_list").hide();
    }
});

$('.sacs-dd').change(function(){
    var type = $("#consign-dd").val();
    if(type=="FAC"){
        getFacilityList($(this).val());
    }else if(type=="RWH"){
        getRwhList($(this).val());
    }
});

function getFacilityList(sacs_id, fac_type=""){
    $.ajax({
        type: "POST",
        url: SITE_URL + 'contracts/sacsFacilities',
        data: {
            'csrf_imsnaco': get_csrf_cookie(),
            'sacs_id': sacs_id,
            'ftype' : fac_type,
        },
        cache: false,
        success: function (data) {
            $('#facs_list').html(data);
            apply_select2_delay($(".facs-dd"), 'Select Facility');
            //                removeCurrentFacs();
        }
    });
}

function getRwhList(sacs_id){
    $.ajax({
        type: "POST",
        url: SITE_URL + 'contracts/sacsRegionalWH',
        data: {
            'csrf_imsnaco': get_csrf_cookie(),
            'sacs_id': sacs_id,
        },
        cache: false,
        success: function (data) {
            $('#rwh_list').html(data);
            apply_select2_delay($(".rwhs-dd"), 'Select Regional Warehouse');
            setTimeout(function(){ 
            }, 500);
            
            //                removeCurrentFacs();
        }
    });
}


/** */
apply_select2_delay($("#consign-dd"), 'Select Consignee Type');
apply_select2_delay($(".sacs-dd"), 'Select SACS');
apply_select2_delay($(".labs-dd"), 'Select Laboratory');

//EOF