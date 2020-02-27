var product_id = $("#product_id").val();
var sch_no = $("#sch_no").val();
var product_qty = $("#product_qty").val();
var allotment_date = $("#allotment_date_inpt").val();
var ap=$("#ap").val();

function lotsVisibility(flg) {
    $(".lotsSEDates td.dt-col").each(function(i) {
        if (i == 0)
            return true;
        dt = $(this).find('span').eq(0).text();
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

function setTotal() {
    qty_error = false;

    $(".sacs-row").each(function() {
        ob = $(this);
        t = getNumValue(ob.find('.lot1_qty').text()) + getNumValue(ob.find('.lot2_qty').text()) + getNumValue(ob.find('.lot3_qty').text()) + getNumValue(ob.find('.lot4_qty').text());
        ob.find('.rtotal').html(t);
    });

    qty1 = qty2 = qty3 = qty4 = 0;
    $(".lot1_qty").each(function() {
        qty1 = qty1 + getNumValue($(this).text())
    });
    $(".lot2_qty").each(function() {
        qty2 = qty2 + getNumValue($(this).text())
    });
    $(".lot3_qty").each(function() {
        qty3 = qty3 + getNumValue($(this).text())
    });
    $(".lot4_qty").each(function() {
        qty4 = qty4 + getNumValue($(this).text())
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
                        $("#lot1_start_date").text(dtl.L1_sd);   $("#lot1_end_date").text(dtl.L1_ed);
                        $("#lot2_start_date").text(dtl.L2_sd);   $("#lot2_end_date").text(dtl.L2_ed);
                        $("#lot3_start_date").text(dtl.L3_sd);   $("#lot3_end_date").text(dtl.L3_ed);
                        $("#lot4_start_date").text(dtl.L4_sd);   $("#lot4_end_date").text(dtl.L4_ed);
                        
                        if($.isArray(dtl.sacs) && dtl.sacs.length > 0){
                            $.each(dtl.sacs, function(k, v) {
                                loc_type = v.consignee_type;
                                loc_name = loc_type=='SACS'?sacs[v.consignee_id]:labs[v.consignee_id];
                                el=el+'<tr class="sacs-row">' +
                                        '<td class="uc">' +
                                            '<input type="hidden" class="consignee_type" value="' + loc_type + '"><input type="hidden" class="consignee_id" value="' + v.consignee_id + '">' + loc_name +
                                        '</td>' +
                                        '<td class="text-center lot1_qty">'+ v.qty1 + '</td>' +
                                        '<td class="text-center lot2_qty">'+ v.qty2 + '</td>' +
                                        '<td class="text-center lot3_qty">'+ v.qty3 + '</td>' +
                                        '<td class="text-center lot4_qty">'+ v.qty4 + '</td>' +
                                        '<td class="rtotal"></td>' +
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
    }
}

/** Initialize **/
getSacsList();
setTotal();
lotsVisibility();
tableWidth();