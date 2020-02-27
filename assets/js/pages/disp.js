/** Vars **/
var reg_pros = [];
var global_obj;
var is_return = false;
$(document).ready(function () {
    if ($("#return").length > 0)
        is_return = true;
});

/** Functions **/
function show_noti(msg, timeout) {
    $(".top-noti .msg").html(msg);
    if (timeout)
        $(".top-noti").show().delay(timeout).fadeOut(300);
    else
        $(".top-noti").show();
}

function hide_noti() {
    $(".top-noti").fadeOut(300);
}

function show_noti_err(msg, timeout) {
    $(".top-noti-err .msg").html(msg);
    if (timeout)
        $(".top-noti-err").show().delay(timeout).fadeOut(300);
    else
        $(".top-noti-err").show();
}

function hide_noti_err() {
    $(".top-noti-err").fadeOut(300);
}

function pro_auto_list() {
    var pros = [], added = [];
    $("#dis_pro_bx .pro_id").each(function () {
        added.push($(this).val());
    });

    $.each(fac_pros, function (k, v) {
        if ($.inArray(v.pro_id, added) === -1) {
            pros.push(v.pro_name_code);
        }
    });

    $("#sel_pro").auto_list(pros);
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

function add_days_to_app_date(ddate, ndays) {
    ndays = parseInt(ndays);
    var ndate = new Date(ddate);
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    var c = 0, i = 0, aflg = 1;
    if (ndays < 0) {
        ndays = ndays * -1;
        aflg = 2;
    }

    while (c < ndays) {
        if (aflg == 1)
            ndate.setDate(ndate.getDate() + 1);
        else
            ndate.setDate(ndate.getDate() - 1);

        if (!is_holiday(ndate.getDate(), ndate.getMonth() + 1, ndate.getFullYear(), ndate.getDay())) {
            c++;
        }

        i++;
        if (i > 365)
            break;
    }

    var dd = ndate.getDate();
    var mm = ndate.getMonth();
    var yy = ndate.getFullYear();
    dd = dd < 10 ? '0' + dd : dd;
    var sdate = dd + ' ' + getMonthName(mm) + ' ' + yy;

    var m1 = mm + 1;
    m1 = m1 < 10 ? '0' + m1 : m1;

    var newdate = {d1: '', d2: '', d3: sdate};
    newdate.d1 = yy + '-' + m1 + '-' + dd;
    newdate.d2 = dd + ' ' + getMonthName(mm) + ' (' + days[ndate.getDay()] + ')';

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

function dispense_date_setting() {
    /** Default **/
    $("#d30").prop('checked', true);
    var today = $("#today_date").val();
    var newdate = get_app_date(today, 30);
    $("#next_app_date").val(newdate);
    set_date_chart(newdate);
    /** /\ **/

    $(".ndays_bx input[type='radio']").off('click');
    $(".ndays_bx input[type='radio']").click(function () {
        n = $(this).val();
        newdate = get_app_date(today, n);
        $("#next_app_date").val(newdate);
        set_date_chart(newdate);
    });
}

function set_date_chart(ddate) {
    var app_dates = [];
    d = add_days_to_app_date(ddate, -3);
    app_dates.push(d.d1);
    $(".app_date_3").text(d.d2);
    $(".app_date_3").attr({d: d.d3, d1: d.d1});
    d = add_days_to_app_date(ddate, -2);
    app_dates.push(d.d1);
    $(".app_date_2").text(d.d2);
    $(".app_date_2").attr({d: d.d3, d1: d.d1});
    d = add_days_to_app_date(ddate, -1);
    app_dates.push(d.d1);
    $(".app_date_1").text(d.d2);
    $(".app_date_1").attr({d: d.d3, d1: d.d1});
    d = add_days_to_app_date(ddate, 0);
    app_dates.push(d.d1);
    $(".app_date").text(d.d2);
    $(".app_date").attr({d: d.d3, d1: d.d1});
    d = add_days_to_app_date(ddate, 1);
    app_dates.push(d.d1);
    $(".app_date1").text(d.d2);
    $(".app_date1").attr({d: d.d3, d1: d.d1});
    d = add_days_to_app_date(ddate, 2);
    app_dates.push(d.d1);
    $(".app_date2").text(d.d2);
    $(".app_date2").attr({d: d.d3, d1: d.d1});

    $(".app_dates_bx a").click(function (e) {
        e.preventDefault();
        ddate = $(this).attr('d');
        $("#next_app_date").val(ddate);
        $(".ndays_bx input[type='radio']").prop('checked', false);
    });

    $("#next_app_date").change(function () {
        $(".ndays_bx input[type='radio']").prop('checked', false);
    });

    var sub_fac_id = $("#sub_fac_id").val();
    if (!sub_fac_id)
        sub_fac_id = 0;

    $.ajax({
        url: SITE_URL + "disp/get_date_chart",
        method: 'POST',
        data: {app_dates: app_dates, sub_fac_id: sub_fac_id, csrf_imsnaco: get_csrf_cookie()},
        dataType: 'JSON',
        success: function (res) {
            if (!res)
                return;

            $(".app_dates_bx .npatients").each(function () {
                var ob = $(this);
                var d = ob.parent().find('.sel_date').attr('d1');
                ob.text('0');
                $.each(res, function (k, v) {
                    if (v.d == d)
                        ob.text(v.n);
                });
            });
        }
    });
}

/** Date settings end **/

function reset_form() {
    $("#next_app_date").val('');
    $("#d_patient").prop('checked', true);
    $("#side_effects").val('');
    if ($('.chosen').length) {
        $('#side_effects').chosen('destroy');
        $('.chosen').chosen({width: '600px', search_contains: true});
    }
    dispense_date_setting();
}

function hide_cols() {
    if ($(".history-bx .dispense_bx").length == 0) {
        $(".dis_pro_head th").eq(4).hide();
        $(".dis_pro_head th").eq(5).hide();
        $("#dis_pro_bx tr").each(function () {
            $(this).find('td').eq(4).hide();
            $(this).find('td').eq(5).hide();
        });
    } else {
        $(".dis_pro_head th").eq(4).show();
        $(".dis_pro_head th").eq(5).show();
    }
}

function generate_patient_detail(res) {
    if(res.patient_status == "8" || res.patient_status == "10" || res.patient_status == "11" ){
        show_noti_err("The patient status is "+res.status_name+". Please confirm before Dispensation", 10000);
    }
    var gender = res.gender;
    if (gender == 'M') {
        gender = "Male";
    } else if (gender == 'F') {
        gender = "Female";
    }
    var regimen = '';
    if (res.regimen_code) {
        regimen = res.regimen_code + "/" + res.regimen_name;
    }
    var pros = "&nbsp;";
    if (res.pro1) {
        pros = "(" + res.pro_name_code1 + ")";
    }
    if (res.pro2) {
        pros += " + (" + res.pro_name_code2 + ")";
    }
    if (res.pro3) {
        pros += " + (" + res.pro_name_code3 + ")";
    }
    if (res.pro4) {
        pros += " + (" + res.pro_name_code4 + ")";
    }

    reg_pros = [res.pid1, res.pid2, res.pid3, res.pid4];

    var purl = SITE_URL + 'patients/add/' + res.encoded_id;

    $("#patient_id").val(res.patient_id);
    $("#regimen_id").val(res.regimen);

    $("#pn").text(res.patient_name);
    $("#py").text(res.age);
    $("#pg").text(gender);
    if (res.status_name) {
        $("#p_status").html('<strong>' + res.status_name + '</strong>');
    } else {
        $("#p_status").text('<strong>NA</strong>');
    }

    if (res.art_num) {
        $("#art").html('<a target="_blank" class="bold" href="' + purl + '">' + res.art_num + '</a>');
    } else {
        $("#art").text('<strong>NA</strong>');
    }

    $("#bc").text(res.barcode ? 'Yes' : 'No');
    $("#rg").text(regimen ? regimen : 'NA');
    $("#reg_status").val(res.regimen_status);
    if (res.regimen_status == 2) {
        pros = '<span class="text-danger bold">This regimen is inactive</span>';
    }
    $("#rg_pro").html(pros);

    $("#weight_band_name").text(res.weight_band_name);
    $("#weight_band_id").text(res.weight_band);
    $("#patient_category").text(res.category);

    $("#last_date").text(res.last_date);
    $("#next_date").text(res.next_date);

    if (!regimen) {
        $("#reg_mode").prop('disabled', true);
    } else {
        $("#reg_mode").prop('disabled', false);
    }

    generate_dispense_history(res.history);
}

function get_pro_dtl(pro_id) {
    var p = 0;
    $.each(fac_pros, function (k, v) {
        if (v.pro_id == pro_id) {
            p = v;
            return false;
        }
    });

    if (p) {
        var pwb_id = getNumValue($("#weight_band_id").text());
        var pc = $.trim($("#patient_category").text());

        p.dosage = '';
        adult_dosage = '';
        $.each(pro_dosage, function (k, v) {
            if (v.product_id == pro_id) {
                if (pc == 'PED') {
                    if (v.weight_band == pwb_id && v.category == pc) {
                        dosage = v.dosage;
                        p.dosage = dosage ? dosage : '';
                        return false;
                    }
                } else {
                    if (v.category == pc) {
                        dosage = v.dosage;
                        p.dosage = dosage ? dosage : '';
                        return false;
                    }
                }

                if (v.category == 'ADULT' && adult_dosage == '') {
                    adult_dosage = v.dosage;
                }
            }
        });

        if (!p.dosage) {
            p.dosage = adult_dosage;
        }
    }

    return p;
}

function generate_dispense_history(history) {
    var hid = is_return ? 'el-hide' : '';
    el = '';
    $.each(history, function (k, v) {
        disp_date = v.group.dispence_date;
        dispence_type = v.group.dispence_type;
        el += '<div class="mb10 dispense_bx"><div class="form-control">' +
            '<div class="row mb10">' +
            '<div class="col-md-6">Visit Date: <strong>' + disp_date + '</strong></div>' +
            '<div class="col-md-6 text-right"><a href="" class="disp_again ' + hid + '">Dispense Again</a><input type="hidden" class="dispence_type" value="' + dispence_type + '"></div>' +
            '<div class="clearfix"></div>' +
            '</div>';

        el += '<table class="table table-bordered">' +
            '<tr class="hmid vmid">' +
            '<th>Product Dispensed</th><th>Remaining Pills</th><th>Adherence</th><th>Dispensed Qty</th>' +
            '</tr>';

        $.each(v.list, function (k1, v1) {
            var prodtl = get_pro_dtl(v1.pro_id);
            if (prodtl) {
                batch_id = prodtl.batch_id;
                batch_no = prodtl.batch_no;
                qty = prodtl.qty;
                expiry_date = prodtl.expiry_date;
                uom = prodtl.uom;
            } else {
                batch_id = 0;
                batch_no = '';
                qty = 0;
                expiry_date = '';
                uom = '';
            }

            if (is_return) {
                batch_id = v1.batch_id;
                batch_no = v1.batch_no;
            }

            var pro_name = v1.pro_name_code;

            if (!isNaN(v1.adherence))
                v1.adherence = v1.adherence + '%';
            el += '<tr class="hmid vmid disp_row">' +
                '<td><input type="hidden" class="pro_id" value="' + v1.pro_id + '"><span class="pro_name">' + pro_name + '</span><span class="uom hide">' + uom + '</span></td>' +
                '<td><span class="remain_qty">' + v1.remaining_qty + '</span></td>' +
                '<td><span class="adherence">' + v1.adherence + '</span></td>' +
                '<td><span class="given_qty">' + v1.given_qty + '</span><input type="hidden" class="batch_id" value="' + batch_id + '"><input type="hidden" class="qty" value="' + qty + '"><input type="hidden" class="batch_no" value="' + batch_no + '"><input type="hidden" class="expiry_date" value="' + expiry_date + '"></td>' +
                '</tr>';
        });
        el += '</table>';

        el += '</div></div>';
    });

    if (!el) {
        $("#repeat_disp").prop('disabled', true);
        el = '<div class="form-control"><div class="grey text-center">No history found.</div></div>';
    } else {
        $("#repeat_disp").prop('disabled', false);
    }

    $(".history-bx").html(el);

    /** **/
    $(".disp_again").click(function (e) {
        e.preventDefault();
        dispence_type = $(this).parent().find('.dispence_type').val();
        if ($("#reg_status").val() == '2') {
            dispence_type = 2;
        }

        $("#disp_type").val(dispence_type);
        el = '';

        $(this).closest('.dispense_bx').find('.disp_row').each(function () {
            var ob = $(this);
            pro_id = ob.find('.pro_id').val();
            pro_name = ob.find('.pro_name').text();
            uom = ob.find('.uom').text();
            batch_id = ob.find('.batch_id').val();
            qty = ob.find('.qty').val();
            batch_no = ob.find('.batch_no').val();
            expiry_date = ob.find('.expiry_date').val();
            adherence = 'NA';
            remain_qty = ob.find('.remain_qty').text();
            dosage = ob.find('.given_qty').text();

            if (isNaN(remain_qty))
                remain_qty = '';

            el += create_pro_row({
                pro_id: pro_id,
                pro_name_code: pro_name,
                uom: uom,
                batch_id: batch_id,
                qty: qty,
                batch_no: batch_no,
                expiry_date: expiry_date,
                adherence: adherence,
                remain_qty: remain_qty,
                dosage: dosage
            });
        });

        $("#dis_pro_bx").html(el);
        $("#disp_section").show();
        init_remove_pro_event();
        pro_auto_list();
        initUtilFunctions();
        reset_form();

        if (is_return) {
            $("#dis_pro_bx .return_qty").eq(0).focus();
        } else {
            check_for_not_available();
            $("#dis_pro_bx .remain_qty").eq(0).focus();
        }

        /** Bio **/
        captureFP();
    });

    $("#repeat_disp").click(function () {
        $(".dispense_bx .disp_again").eq(0).trigger('click');
    });

    /** IF Return **/
    if (is_return) {
        setTimeout(function () {
            $(".dispense_bx .disp_again").eq(0).trigger('click');
        }, 300);
    }
}

function check_for_not_available() {
    $("#dis_pro_bx .batch_id").each(function () {
        if (!$(this).val() || $(this).val() == 0) {
            var ob = $(this).parent();
            ob.html('<span class="text-danger na">Not Available</span>');
            ob.prev().html('<span class="text-danger na">Not Available</span>');
            ob.next().html('<span class="text-danger na">Not Available</span>');
            ob.parent().find('.disp_qty').val('').prop('disabled', true);
        }
    });
}

function init_remove_pro_event() {
    $(".rmpro.text-danger").click(function () {
        pro_id = $(this).parent().parent().find('.pro_id').val();
        $(this).parent().parent().remove();
        pro_auto_list();

        disp_type = $("#disp_type").val();
        if (disp_type == 1) {
            if ($.inArray(pro_id, reg_pros) != -1) {
                $("#disp_type").val('2');
            }
        }
    });

    qty_input_event();
    disable_remain_qty();
    change_batch_event();
}

function qty_input_event() {
    $("#dis_pro_bx .disp_qty").keyup(function () {
        ob = $(this);
        qty = getNumValue(ob.parent().parent().find('.qty').text());
        disp_qty = getNumValue(ob.val());
        ob.removeClass('red-bdr');
        if (disp_qty > qty) {
            ob.val(qty);
            ob.addClass('red-bdr');
        }
    });

    var last_given_qty = 0;
    var last_remain_qty = 0;
    var last_date = $.trim($("#last_date").text());
    var cur_date = $("#today_date").val();

    var oneDay = 24 * 60 * 60 * 1000;
    var firstDate = new Date(cur_date);
    var secondDate = new Date(last_date);
    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));

    var pwb_id = getNumValue($("#weight_band_id").text());
    var pc = $.trim($("#patient_category").text());


    $("#dis_pro_bx .return_qty, #dis_pro_bx .remain_qty").keyup(function () {
        ob = $(this);

        var rproid = ob.parent().parent().find('.pro_id').val();
        last_given_qty = getNumValue($(".history-bx .dispense_bx").eq(0).find('.pro_id[value="' + rproid + '"]').parent().parent().find('.given_qty').text());
        last_remain_qty = getNumValue($(".history-bx .dispense_bx").eq(0).find('.pro_id[value="' + rproid + '"]').parent().parent().find('.remain_qty').text());

        if (ob.hasClass('return_qty')) {
            qty = getNumValue(ob.parent().parent().find('.disp_qty').val());
        } else {
            qty = last_given_qty;
        }
        var remain_qty = getNumValue(ob.val());

        if (ob.hasClass('return_qty')) {
            if (remain_qty > qty) {
                ob.val(qty);
            }
            return;
        }

        if (remain_qty > (qty + last_remain_qty)) {
            ob.val(qty + last_remain_qty);
        }

        ob.parent().parent().find('.adherence').val('NA');
        remain_qty = getNumValue(ob.val());
        pro_id = getNumValue(ob.parent().parent().find('.pro_id').val());

        var dosage = 0;
        var adult_dosage = 0;
        $.each(pro_dosage, function (k, v) {
            if (v.product_id == pro_id) {
                if (pc == 'PED') {
                    if (v.weight_band == pwb_id && v.category == pc) {
                        dosage = getNumValue(v.dosage) / 30;
                        return false;
                    }
                } else {
                    if (v.category == pc) {
                        dosage = getNumValue(v.dosage) / 30;
                        return false;
                    }
                }

                if (v.category == 'ADULT' && adult_dosage == 0) {
                    adult_dosage = getNumValue(v.dosage) / 30;
                }
            }
        });

        if (!dosage) {
            dosage = adult_dosage;
        }

        var rqty = ob.val();
        if (isNaN(rqty)) {
            rqty = rqty.toUpperCase();
            ob.val(rqty);
            if (rqty == 'PNB') {
                ob.parent().parent().find('.adherence').val('PNB');
            } else {
                ob.parent().parent().find('.adherence').val('NA');
            }
        } else {
            if (last_given_qty && dosage && ob.val() !== '') {
                var actual_consumed = last_given_qty + last_remain_qty - remain_qty;
                var adherence = 0;
                if (diffDays == 0) {
                    adherence = 100;
                } else {
                    adherence = Math.round((actual_consumed / (dosage * diffDays)) * 100);
                }
                if (adherence > 100) {
                    adherence = 100;
                }
                if (adherence < 0) {
                    adherence = 0;
                }
                ob.parent().parent().find('.adherence').val(adherence);
            }
        }
    });
}

function disable_remain_qty() {
    if ($(".history-bx .dispense_bx").length == 0) {
        $("#dis_pro_bx .remain_qty").prop('disabled', true);
        return;
    }

    var hobj = $(".history-bx .dispense_bx").eq(0);

    $("#dis_pro_bx .pro_id").each(function () {
        var dproid = $(this).val();

        if (hobj.find('.pro_id[value="' + dproid + '"]').length == 0)
            $(this).parent().parent().find('.remain_qty').prop('disabled', true);
    });
}

function change_batch_event() {
    $("#dis_pro_bx .batch_no").click(function (e) {
        e.preventDefault();
        $(".change_batch_bx").remove();

        global_obj = $(this);
        batch_id = global_obj.attr('batch_id');
        pro_id = global_obj.attr('pro_id');

        $.fancybox({
            closeBtn: true,
            type: 'ajax',
            href: SITE_URL + "disp/pro_batches",
            helpers: {title: {type: 'inside', position: 'top'}},
            beforeShow: function (opt) {
                this.title = '<h2>Select Batch (Picking Batch with FIFO)</h2>';
            },
            beforeLoad: function () {
                this.ajax.method = 'POST';
                this.ajax.data = {pro_id: pro_id, batch_id: batch_id, csrf_imsnaco: get_csrf_cookie()}
            }
        });
    });
}


function create_pro_row(v) {
    if (!v || JSON.stringify(v) == '[]')
        return;

    if (!v.qty)
        v.qty = 0;

    v.dosage = getNumValue(v.dosage);
    v.dosage = v.dosage ? v.dosage : '';

    var pro_name = v.pro_name_code;

    if (is_return) {
        el = '<tr class="hmid vmid">' +
            '<td><input type="hidden" class="pro_id" value="' + v.pro_id + '"><span class="pro_name">' + pro_name + '</span><span class="lightGrey"> - ' + v.uom + '</span></td>' +
            '<td><input type="hidden" class="batch_id" value="' + v.batch_id + '"><a href="" class="batch_no" batch_id="' + v.batch_id + '" pro_id="' + v.pro_id + '">' + v.batch_no + '</a></td>' +
            '<td><span class="exp_date">' + v.expiry_date + '</span></td>' +
            '<td><input type="text" class="disp_qty text-center" valid="int" value="' + v.dosage + '" disabled="" maxlength="3"></td>' +
            '<td><input type="text" class="return_qty text-center" value="" valid="int" maxlength="3"></td>' +
            '</tr>';
    } else {
        el = '<tr class="hmid vmid">' +
            '<td><input type="hidden" class="pro_id" value="' + v.pro_id + '"><span class="pro_name">' + pro_name + '</span><span class="lightGrey"> - ' + v.uom + '</span></td>' +
            '<td><span class="qty">' + v.qty + '</span></td>' +
            '<td><input type="hidden" class="batch_id" value="' + v.batch_id + '"><a href="" class="batch_no" batch_id="' + v.batch_id + '" pro_id="' + v.pro_id + '">' + v.batch_no + '</a></td>' +
            '<td><span class="exp_date">' + v.expiry_date + '</span></td>' +
            '<td><input type="text" class="adherence text-center" disabled value=""></td>' +
            '<td><input type="text" class="remain_qty text-center" value="" valid="nospace" maxlength="3"></td>' +
            '<td><input type="text" class="disp_qty text-center" valid="int" value="' + v.dosage + '" maxlength="3"></td>' +
            '<td><span class="rmpro text-danger"><i class="fa fa-remove"></i></span></td>' +
            '</tr>';
    }

    return el;
}

function get_dispense_dtl() {
    dtl = {
        patient_id: 0,
        regimen_id: 0,
        disp_type: 1,
        next_date: '',
        proxy: 0,
        side_effects: '',
        success: 'T',
        pro: []
    };

    patient_id = getNumValue($("#patient_id").val());
    regimen_id = getNumValue($("#regimen_id").val());
    disp_type = getNumValue($("#disp_type").val());
    next_date = $("#next_app_date").val();

    if ($("#dis_pro_bx tr").length <= 0) {
        dtl.success = 'F';
        show_noti_err("Please add product for dispensation", 2000);
        $("#sel_pro").focus();
        return dtl;
    }

    if (!next_date) {
        dtl.success = 'F';
        show_noti_err("Please select next appointment date", 2000);
        return dtl;
    }

    if ($("#d_patient").prop('checked')) {
        proxy = 0;
    } else {
        proxy = 1;
    }

    side_effects = $("#side_effects").val();
    if (side_effects) {
        side_effects = side_effects.join(",");
    } else {
        side_effects = "";
    }

    dtl.patient_id = patient_id;
    dtl.regimen_id = regimen_id;
    dtl.disp_type = disp_type;
    dtl.next_date = next_date;
    dtl.proxy = proxy;
    dtl.side_effects = side_effects;

    var flg = 1, qtyflg = 1, rqtyflg = 1;
    $("#dis_pro_bx tr").each(function () {
        var ob = $(this);
        pro_id = ob.find('.pro_id').val();
        batch_id = getNumValue(ob.find('.batch_id').val());
        remain_qty = ob.find('.remain_qty').val();
        qty = getNumValue(ob.find('.qty').text());
        disp_qty = getNumValue(ob.find('.disp_qty').val());
        adherence = ob.find('.adherence').val();

        if (qty < disp_qty) {
            qtyflg = 2;
            ob.find('.disp_qty').focus();
            ob.find('.disp_qty').css('outline', '1px solid red');
            ob.find('.disp_qty').blur(function () {
                $(this).css('outline', '');
            });
            return false;
        }

        if (!disp_qty) {
            flg = 2;
            ob.find('.disp_qty').focus();
            ob.find('.disp_qty').css('outline', '1px solid red');
            ob.find('.disp_qty').blur(function () {
                $(this).css('outline', '');
            });
            return false;
        }

        if (ob.find('.remain_qty').prop('disabled') == false) {
            if (remain_qty === "" || (isNaN(remain_qty) && remain_qty != 'PNB')) {
                rqtyflg = 2;
                ob.find('.remain_qty').focus();
                ob.find('.remain_qty').css('outline', '1px solid red');
                ob.find('.remain_qty').blur(function () {
                    $(this).css('outline', '');
                });
                return false;
            }
        }

        dtl.pro.push({
            product_id: pro_id,
            batch_id: batch_id,
            given_qty: disp_qty,
            remaining_qty: remain_qty,
            adherence: adherence
        });
    });

    if (flg == 2) {
        dtl.success = 'F';
        show_noti_err("Dispense quantity can't be left blank or zero.", 2000);
        return dtl;
    }

    if (qtyflg == 2) {
        dtl.success = 'F';
        show_noti_err("Dispense quantity can't be greater than available quantity. Please change the batch or change the dispense quantity", 4000);
        return dtl;
    }

    if (rqtyflg == 2) {
        dtl.success = 'F';
        show_noti_err("Remaining qty must be a numeric value or 'PNB (Pills not brought)'", 4000);
        return dtl;
    }

    if ($("#art").text() == 'NA') {
        dtl.success = 'F';
        show_noti_err("Patient's ART No. is not available.", 2000);
        return dtl;
    }

    return dtl;
}

function get_patient_dtl(patient_id) {
    if (!patient_id)
        return;

    var sub_fac_id = $("#sub_fac_id").val();
    if (!sub_fac_id)
        sub_fac_id = 0;

    $("#patient_list_bx").hide();
    show_noti('Loading...');
    $.ajax({
        url: SITE_URL + "disp/patient_dtl",
        method: 'POST',
        data: {patient_id: patient_id, sub_fac_id: sub_fac_id, csrf_imsnaco: get_csrf_cookie()},
        dataType: 'JSON',
        success: function (res) {
            $("#code").removeClass('spin');
            if (JSON.stringify(res) != '[]') {
                generate_patient_detail(res);
                $("#disp_bx").show();

                if ($("#reg_status").val() == '2') {
                    $("#reg_mode").prop('disabled', true);
                }

                if ($("#repeat_disp").prop('disabled') == false) {
                    $("#repeat_disp").focus();
                }
                else if ($("#reg_mode").prop('disabled') == false) {
                    $("#reg_mode").focus();
                } else {
                    $("#presc_mode").focus();
                }
            } else {
                $("#disp_bx").hide();
            }

            $("#bar_update").hide();
            $("#bar_code").show();

            $("#disp_section").hide();
            hide_noti();
            hide_cols();
        }
    });
}

function get_patient_list(data) {
    if (!data.paging)
        $("#code").addClass('spin');
    $("#disp_bx").hide();

    var sub_fac_id = $("#sub_fac_id").val();
    if ($("#sub_fac_id").length > 0 && sub_fac_id) {
        data.sub_fac_id = sub_fac_id;
    }

    if ($("#return").length) {
        data.return = 1;
    }

    $.ajax({
        url: SITE_URL + "disp/patient_list",
        method: 'POST',
        data: data,
        success: function (res) {
            $("#code").removeClass('spin');
            $("#patient_list_bx").html(res);

            $("#search_p_form button").prop('disabled', false);

            if (res) {
                if ($(".p-lists tr").length == 1 && !data.paging) {
                    var ctext = $.trim(data.code.toLowerCase());
                    var tob = $(".p-lists tr").eq(0);
                    var pname = $.trim(tob.find('.pname').val().toLowerCase());
                    var preart = $.trim(tob.find('.preart').val().toLowerCase());
                    var art = $.trim(tob.find('.art').val().toLowerCase());
                    var barcode = $.trim(tob.find('.barcode').val().toLowerCase());
                    var id1 = $.trim(tob.find('.id1').val().toLowerCase());

                    if (ctext == pname || ctext == id1 || ctext == preart || ctext == art || ctext == barcode) {
                        tob.find('.add_patient').trigger('click');
                    } else {
                        $("#patient_list_bx").show();
                    }

                } else {
                    $("#patient_list_bx").show();
                }
            }
            else {
                $("#patient_list_bx").hide();
            }

            /** After list load **/
            if ($(".p-lists tr").length > 0) {
                $(".p-lists tr").eq(0).find('.add_patient').focus();
                $("#code").keypress(function (e) {
                    if (e.keyCode == 9) {
                        e.preventDefault();
                        $(".p-lists tr").eq(0).find('.add_patient').focus();
                    }
                });
            }

            $(".paging1 a").click(function (e) {
                e.preventDefault();
                var href = $(this).attr('href');
                var a = href.split("/");
                var pageno = a[a.length - 1];
                code = data.code;
                ps_type = data.ps_type;
                get_patient_list({
                    ps_type: ps_type,
                    code: code,
                    return: 0,
                    pageno: pageno,
                    paging: true,
                    csrf_imsnaco: get_csrf_cookie()
                });
            });
            /** **/
        }
    });
}

function select_pro_event() {
    $("#sel_pro").change(function () {
        var ob = $(this);
        setTimeout(function () {
            p = ob.val();
            $.each(fac_pros, function (k, v) {
                if (p == v.pro_name_code) {
                    pdtl = get_pro_dtl(v.pro_id);
                    if (pdtl) {
                        v.dosage = pdtl.dosage;
                    }
                    el = create_pro_row(v);
                    $("#dis_pro_bx").append(el);
                    hide_cols();
                    ob.val('');
                    init_remove_pro_event();
                    pro_auto_list();
                    $("#dis_pro_bx .disp_qty").last().focus();
                    initUtilFunctions();
                    return false;
                }
            });

        }, 200);
    });
}


/** Events **/
$(document).ready(function () {
    $("#code").focus(function () {
        $(this).select();
    });
    $("#code").mouseup(function (e) {
        e.preventDefault();
    });

    /** Get patient list by entering barcode/art etc. **/
    $("#search_p_form").submit(function (e) {
        e.preventDefault();
        if ($("#code").val() && $("#ps_type").val()) {
            var data = {code: '', ps_type: '', pageno: 1, csrf_imsnaco: get_csrf_cookie()}
            data.code = $.trim($("#code").val());
            data.ps_type = $.trim($("#ps_type").val());

            get_patient_list(data);
        }
    });

    $("#ps_type").change(function () {
        $("#search_p_form").submit();
    });

    $("#code").scannerDetection(function () {
        $("#search_p_form").submit();
    });

    $("#clear_btn").click(function () {
        $("#code").val('').focus();
        $("#patient_list_bx").hide();
        $("#disp_bx").hide();
    })
    /** \ **/

    /** Update barcode **/
    $("#update_bc").click(function (e) {
        e.preventDefault();
        $("#bar_update").show();
        $("#bar_code").hide();
        $("#bc_inpt").focus();

        $("#bc_save_btn").click(function () {
            ob = $(this);
            bc = $.trim($("#bc_inpt").val());
            if (!bc)
                return;
            pid = $("#patient_id").val();
            ob.text('Saving..');
            $.ajax({
                url: SITE_URL + "disp/update_barcode",
                method: 'POST',
                data: {barcode: bc, patient_id: pid, csrf_imsnaco: get_csrf_cookie()},
                success: function (res) {
                    if (res == 'T') {
                        $("#bc").text('Yes');
                        ob.text('Save');
                        $("#bc_inpt").val('');
                        $("#bar_update").hide();
                        $("#bar_code").show();
                    }
                    if (res == 'F') {
                        alert('This barcode has been used!');
                        ob.text('Save');
                    }
                }
            });
        });
    });

    $("#bc_inpt").keyup(function (e) {
        if (e.which == 13) {
            $("#bc_save_btn").trigger('click');
        }
    });

    $("#bc_cancel_btn").click(function () {
        $("#bar_update").hide();
        $("#bar_code").show();
        $("#bc_inpt").val('');
        $("#bc_save_btn").text('Save');
    });
    /** \ **/


    /** Update regimen **/
    $("#update_regimen").click(function (e) {
        e.preventDefault();
        $("#reg_update").show();
        $("#regi_men").hide();
        $("#reg_inpt").focus();

        $("#reg_save_btn").click(function () {
            ob = $(this);
            reg = $.trim($("#reg_inpt").val());
            if (!reg)
                return;
            pid = $("#patient_id").val();
            ob.text('Saving..');
            $.ajax({
                url: SITE_URL + "disp/update_regimen",
                method: 'POST',
                data: {regimen: reg, patient_id: pid, csrf_imsnaco: get_csrf_cookie()},
                dataType: 'JSON',
                success: function (res) {
                    if (res && res.success == 'T') {
                        ob.text('Save');
                        $("#reg_inpt").val('');
                        $("#reg_update").hide();
                        $("#regi_men").show();

                        var regimen = 'NA';
                        if (res.regimen_code) {
                            regimen = res.regimen_code + "/" + res.regimen_name;
                        }
                        var pros = "&nbsp;";
                        if (res.pro1) {
                            pros = "(" + res.pro_name_code1 + ")";
                        }
                        if (res.pro2) {
                            pros += " + (" + res.pro_name_code2 + ")";
                        }
                        if (res.pro3) {
                            pros += " + (" + res.pro_name_code3 + ")";
                        }
                        if (res.pro4) {
                            pros += " + (" + res.pro_name_code4 + ")";
                        }
                        $("#rg").text(regimen);
                        $("#rg_pro").html(pros);
                        $("#regimen_id").val(reg);

                        reg_pros = [res.pid1, res.pid2, res.pid3, res.pid4];

                        $("#reg_mode").prop('disabled', false);
                    }
                }
            });
        });
    });

    $("#reg_inpt").keyup(function (e) {
        if (e.which == 13) {
            $("#reg_save_btn").trigger('click');
        }
    });

    $("#reg_cancel_btn").click(function () {
        $("#reg_update").hide();
        $("#regi_men").show();
        $("#reg_inpt").val('');
        $("#reg_save_btn").text('Save');
    });
    /** \ **/


    /** Update weight band **/
    $("#update_wb").click(function (e) {
        e.preventDefault();
        $("#wb_update").show();
        $("#wb_bx").hide();
        $("#wb_inpt").focus();

        $("#wb_save_btn").click(function () {
            ob = $(this);
            wb = $.trim($("#wb_inpt").val());
            if (!wb)
                return;
            pid = $("#patient_id").val();
            ob.text('Saving..');
            $.ajax({
                url: SITE_URL + "disp/update_weight_band",
                method: 'POST',
                data: {weight_band: wb, patient_id: pid, csrf_imsnaco: get_csrf_cookie()},
                dataType: 'JSON',
                success: function (res) {
                    if (res && res.success == 'T') {
                        ob.text('Save');
                        $("#wb_inpt").val('');
                        $("#wb_update").hide();
                        $("#wb_bx").show();
                        $("#weight_band_name").text(res.weight_band_name);
                    }
                }
            });
        });
    });

    $("#wb_inpt").keyup(function (e) {
        if (e.which == 13) {
            $("#wb_save_btn").trigger('click');
        }
    });

    $("#wb_cancel_btn").click(function () {
        $("#wb_update").hide();
        $("#wb_bx").show();
        $("#wb_inpt").val('');
        $("#wb_save_btn").text('Save');
    });
    /** \ **/

    /** Regimen mode dispensation **/
    $("#reg_mode").click(function () {
        reg = $.trim($("#regimen_id").val());
        $("#disp_type").val('1');
        $("#dis_pro_bx").html('');
        $("#disp_section").hide();
        show_noti('Loading...');

        reset_form();

        var sub_fac_id = $("#sub_fac_id").val();
        if (!sub_fac_id)
            sub_fac_id = 0;

        $.ajax({
            url: SITE_URL + "disp/regimen_dtl",
            method: 'POST',
            data: {regimen_id: reg, sub_fac_id: sub_fac_id, csrf_imsnaco: get_csrf_cookie()},
            dataType: 'JSON',
            success: function (res) {
                if (res && res.success == 'T') {
                    el = '';
                    $.each(res.pro, function (k, v) {
                        pdtl = get_pro_dtl(v.pro_id);
                        if (pdtl) {
                            v.dosage = pdtl.dosage;
                        }
                        el += create_pro_row(v);
                    });

                    $("#dis_pro_bx").html(el);
                    check_for_not_available();
                    $("#disp_section").show();
                    init_remove_pro_event();
                    pro_auto_list();
                    initUtilFunctions();
                    $("#dis_pro_bx .disp_qty").eq(0).focus();
                    hide_cols();

                    /** Bio **/
                    captureFP();
                }
                hide_noti();
            }
        });
    });

    /** Prescription mode dispensation **/
    $("#presc_mode").click(function () {
        $("#disp_type").val('2');
        $("#dis_pro_bx").html('');
        pro_auto_list();
        $("#disp_section").show();
        $("#sel_pro").focus();
        hide_cols();
        reset_form();

        /** Bio **/
        captureFP();
    });


    /** Submit/Cancel Dispensation **/
    $("#confirm_disp").click(function () {
        var ob = $(this);
        var bio_img = $("#thumb_imp").val();
        var ISOTemplateBase64 = $("#ISOTemplateBase64").val();
        if ($("#dis_pro_bx .na").length > 0) {
            show_noti_err("Please remove 'Not Available' products.", 3000);
            return;
        }

        disp_dtl = get_dispense_dtl();
        if (disp_dtl.success == 'F') {
            //return;
        }

        show_noti('Saving.. Please wait..');
        ob.prop('disabled', true);

        var sub_fac_id = $("#sub_fac_id").val();
        if (!sub_fac_id)
            sub_fac_id = 0;

        $.ajax({
            url: SITE_URL + "disp/submit_dispensation",
            method: 'POST',
            dataType: 'JSON',
            data: {
                disp_dtl: disp_dtl,
                sub_fac_id: sub_fac_id,
                thumb_imp: bio_img,
                ISOTemplateBase64: ISOTemplateBase64,
                csrf_imsnaco: get_csrf_cookie()
            },
            success: function (res) {
                if( typeof res === 'undefined' || res === null ){
                    hide_noti();
                    boot_alert("Error", "No response found");
                    ob.prop('disabled', false);
                    return;
                }

                if (res.msg == "TRUE") {
                    show_noti('Dispensed successfuly', 5000);
                    $("#cancel_disp").trigger('click');
                } else {
                    hide_noti();
                    boot_alert("Error", res.msg);
                }

                fac_pros = res.fac_products;

                ob.prop('disabled', false);
            }
        });
    });

    $("#cancel_disp").click(function () {
        $("#disp_bx").hide();
        $("#code").focus().val('');
        $("#ps_type").val('CODE');
    });


    /** Tabs **/
    $("#sel_pro").keypress(function (e) {
        if (e.keyCode == 9) {
            var txt = $(".ac-list-bx .act").text();
            if (txt) {
                $(this).val(txt);
                $(this).trigger('change');
            }

            //e.preventDefault();
            //$(this).val('');
            $(".ac-list-bx").html('').hide();
            $("#confirm_disp").focus();
        }
    });


    /** Init **/
    $("#code").focus();
    select_pro_event();
    $(window).scrollTop(140);

    var pid_ = getNumValue($("#patient_id").val());
    if (pid_) {
        get_patient_dtl(pid_);
    }
});


/******************************************************************************************/


/** Transit and PEP dispensation **/
function get_tp_dispense_dtl() {
    dtl = {
        pname: '',
        pdob: '',
        pgender: '',
        part_num: '',
        pmobile: '',
        patient_type: '',
        disp_type: 2,
        success: 'T',
        pro: []
    };

    dtl.pname = $("#pname").val();
    dtl.pdob = $("#pdob").val();
    dtl.pgender = $("#pgender").val();
    dtl.part_num = $("#part_num").val();
    dtl.pmobile = $("#pmobile").val();
    dtl.patient_type = $(".ptype-radio-bx input:checked").val();

    var flg = 1;
    $("#dis_pro_bx tr").each(function () {
        var ob = $(this);
        pro_id = ob.find('.pro_id').val();
        batch_id = getNumValue(ob.find('.batch_id').val());
        disp_qty = getNumValue(ob.find('.disp_qty').val());

        if (!disp_qty) {
            flg = 2;
            ob.find('.disp_qty').focus();
            return false;
        }

        dtl.pro.push({product_id: pro_id, batch_id: batch_id, given_qty: disp_qty});
    });

    if (flg == 2) {
        dtl.success = 'F';
        show_noti_err("Dispense quantity can't be left blank or zero.", 2000);
        return dtl;
    }

    return dtl;
}

function submit_tp_dispensation() {
    if (!$("#pname").val()) {
        show_noti_err("Please enter patient name", 2000);
        $("#pname").focus();
        return;
    }

    if (!$("#pdob").val()) {
        show_noti_err("Please enter dob", 2000);
        $("#pdob").focus();
        return;
    }

    if (!$("#pgender").val()) {
        show_noti_err("Please select gender", 2000);
        $("#pgender").focus();
        return;
    }

    if ($("#dis_pro_bx tr").length == 0) {
        show_noti_err("Please add product for dispensation.", 3000);
        $("#sel_pro").focus();
        return;
    }

    var dtl = get_tp_dispense_dtl();
    if (dtl.success == 'F') {
        return;
    }

    show_noti('Saving.. Please wait..');
    $("#confirm_disp_tp").prop('disabled', true);

    var sub_fac_id = $("#sub_fac_id").val();
    if (!sub_fac_id)
        sub_fac_id = 0;

    var bio_img = $("#thumb_imp").val();
    var ISOTemplateBase64 = $("#ISOTemplateBase64").val();

    $.ajax({
        url: SITE_URL + "disp/submit_tp_dispensation",
        method: 'POST',
        dataType: 'JSON',
        data: {
            disp_dtl: dtl,
            sub_fac_id: sub_fac_id,
            thumb_imp: bio_img,
            ISOTemplateBase64: ISOTemplateBase64,
            csrf_imsnaco: get_csrf_cookie()
        },
        success: function (res) {
            if (res.msg == "TRUE") {
                show_noti('Dispensed successfuly', 5000);
                cancel_tp_dispensation();
            } else {
                hide_noti();
                boot_alert("Error", res.msg);
            }

            fac_pros = res.fac_products;
            pro_auto_list();

            $("#confirm_disp_tp").prop('disabled', false);
        }
    });
}

function cancel_tp_dispensation() {
    $("#pname,#pdob,#pgender,#pmobile,#part_num,#artcentres").val('');
    $("#dis_pro_bx").html('');
    $("#pname").focus();

    /** Bio **/
    captureFP();
}

function after_load_transit_pep_disp_page() {
    select_pro_event();
    pro_auto_list();
    hide_cols();
    $("#pname").focus();
    setDateToInputs();
    initUtilFunctions();

    $("#confirm_disp_tp").click(function () {
        submit_tp_dispensation();
    });

    $("#cancel_disp_tp").click(function () {
        cancel_tp_dispensation();
    });

    /** Bio **/
    captureFP();
}

$(document).ready(function () {
    $("#transit_pep_disp, #testbtn").click(function () {
        show_noti('Loading...');

        $.ajax({
            url: SITE_URL + "disp/transit_pep_dispensation",
            success: function (res) {
                $("#main_disp_bx").html(res);
                after_load_transit_pep_disp_page();
            }
        });
    });
});


/***************************************************************************************************/
/** Return from patient **/
function get_return_dtl() {
    dtl = {patient_id: 0, success: 'T', pro: []};
    patient_id = getNumValue($("#patient_id").val());

    if ($("#dis_pro_bx tr").length <= 0) {
        dtl.success = 'F';
        show_noti_err("There is no product for return", 2000);
        return dtl;
    }

    dtl.patient_id = patient_id;

    var flg = 1;
    $("#dis_pro_bx tr").each(function () {
        var ob = $(this);
        pro_id = ob.find('.pro_id').val();
        batch_id = getNumValue(ob.find('.batch_id').val());
        return_qty = getNumValue(ob.find('.return_qty').val());
        disp_qty = getNumValue(ob.find('.disp_qty').val());

        if (!return_qty) {
            flg = 2;
            ob.find('.return_qty').focus();
            return false;
        }

        dtl.pro.push({product_id: pro_id, batch_id: batch_id, given_qty: disp_qty, return_qty: return_qty});
    });

    if (flg == 2) {
        dtl.success = 'F';
        show_noti_err("Return quantity can't be left blank or zero.", 2000);
        return dtl;
    }

    return dtl;
}

/** Bio Thumb Impression **/
function captureFP() {
    $("#bio_img").attr('src', '');
    CallSGIFPGetData();
}

function CallSGIFPGetData() {
    var uri = "http://localhost:8000/SGIFPCapture";

    $.ajax({
        url: uri,
        type: 'post',
        dataType: 'json',
        success: function (res) {
            SuccessFunc(res);
        },
        error: function (textStatus, errorThrown) {
            ErrorFunc(textStatus);
        }
    });

    return;
}

function SuccessFunc(result) {
    if (result.ErrorCode == 0) {
        if (result != null && result.BMPBase64.length > 0) {
            $("#bio_img").attr('src', "data:image/bmp;base64," + result.BMPBase64);
            $("#thumb_imp").val(result.BMPBase64);
            $("#ISOTemplateBase64").val(result.ISOTemplateBase64);
            $(".capture_fp").text('Capture Again').show();
        }
    }
    else {
        //alert("Fingerprint Capture ErrorCode " + result.ErrorCode)
        $(".capture_fp").text('Capture Again').show();
    }
}

function ErrorFunc(status) {
    //alert("Check if SGIBIOSRV is running ");
}


/** Event **/
$(document).ready(function () {
    $("#cancel_return").click(function () {
        $("#disp_bx").hide();
        $("#code").focus().val('');
        $("#ps_type").val('CODE');
    });

    $("#confirm_return").click(function () {
        var ob = $(this);

        return_dtl = get_return_dtl();
        if (return_dtl.success == 'F')
            return;

        show_noti('Saving.. Please wait..');
        ob.prop('disabled', true);

        $.ajax({
            url: SITE_URL + "disp/submit_return",
            method: 'POST',
            data: {return_dtl: return_dtl, csrf_imsnaco: get_csrf_cookie()},
            success: function (res) {
                if (res == 'T') {
                    show_noti('Returned successfuly', 5000);
                    $("#cancel_return").trigger('click');
                }

                ob.prop('disabled', false);
            }
        });
    });
});