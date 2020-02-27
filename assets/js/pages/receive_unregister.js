function init_del_pro_event() {
    $(".del_un_pro").click(function(e) {
        e.preventDefault();
        $(this).parent().parent().remove();

        set_session_data();
        set_pro_auto_complete();
    });
}

function init_del_batch_event() {
    $(".un_batch_del").click(function(e) {
        e.preventDefault();
        $(this).parent().parent().remove();

        set_session_data();
    });
}

function init_add_batch_event() {
    $(".un_batch_tbl").each(function() {
        $(this).find(".un_add_batch_btn").click(function() {
            rEl = $(this).closest(".batch_dtl_form_bx");
            pro_name = rEl.find('.proname').val();
            batch_no = rEl.find('.un_batch_no').val();
            m_date = rEl.find('.un_m_date').val();
            e_date = rEl.find('.un_e_date').val();
            qty = rEl.find('.un_qty').val();
            damages = rEl.find('.un_damage').val();
            
            nobatch=rEl.find('.nobatch').val();

            if (!batch_no || !m_date || !e_date || !qty) {
                return;
            }
            
            if(nobatch==1)
                dis='style="visibility:hidden"';
            else
                dis='';

            /** Check batch **/
            err = false;
            bRows = $(this).closest(".un_batch_tbl");
            bRows.find('.un_batch_row').each(function() {
                batchno = $.trim($(this).find('td').eq(0).text());
                mdate = $.trim($(this).find('td').eq(1).text());
                edate = $.trim($(this).find('td').eq(2).text());
                if (batchno == batch_no && e_date != edate || (batchno == batch_no && e_date == edate && m_date == mdate)) {
                    err = true;
                    return false;
                }
            });
            if (err) {
                boot_alert("Alert", "This batch no. is already added.");
                return;
            }

            err = false;
            var source_batches = eval($("#batches").val());

            if (source_batches) {
                $.each(source_batches, function(k, v) {
                    if (batch_no == v.batch_no && pro_name == v.product_name && e_date != v.e_date) {
                        err = true;
                    }
                });
            }

            if (err) {
                boot_alert("Alert", "This batch no. for the same product already exists with different expiry date. Please adjust the date.");
                return;
            }
            /** \ **/

            el = '<tr class="vmid hmid un_batch_row" proname="' + pro_name + '">' +
                    '<td '+dis+'>' + batch_no + '</td>' + '<td '+dis+'>' + m_date + '</td>' + '<td '+dis+'>' + e_date + '</td>' + '<td>' + qty + '</td>' + '<td>' + damages + '</td>' + '<td><a href="#" class="text-danger un_batch_del"><i class="fa fa-remove"></i></a></td>' +
                    '</tr>';

            $(el).insertBefore(rEl);
            if(dis){
                rEl.find('.un_qty, .un_damage').val('');
            }else{
                rEl.find('input').val('');
            }
            init_del_batch_event();

            set_session_data();
        });
    });
}

function add_product_in_unregister(pro_name_code) {
    pro_name_code = $.trim(pro_name_code);
    if (!pro_name_code)
        return;
    var pro_name='';
    var is_batch='Y', temp_batch="", temp_batch_ar, dis, btntext, nobatch=0;
    
    var pro=[];
    $.each(all_pros, function(k,v){
        pro.push(v.pro_name_code); 
        if(v.pro_name_code==pro_name_code){
            pro_name=v.product_name;
            is_batch=v.is_batch_num;
            if(v.is_batch_num=='N')
                temp_batch=v.temp_batch;
            
            return false;
        }
    });
    
    if($.inArray(pro_name_code, pro) == -1)
        return;
    
    if(temp_batch){
        temp_batch_ar=temp_batch.split("|");
        dis='style="visibility:hidden"';
        btntext="Add Quantity";
        nobatch=1;
    }else{
        temp_batch_ar=['', '', '', ''];
        dis='';
        btntext="Add Batch";
    }

    el ='<div class="panel panel-success un_pro_bx">' +
            '<div class="panel-heading posRel"><a href="#" class="text-danger del_un_pro"><i class="fa fa-remove fa-2x"></i></a><h3 class="panel-title un_pro_name" pro="'+pro_name+'">' + pro_name_code + '</h3></div>' +
            '<table class="table table-striped un_batch_tbl">' +
                '<tr class="vmid hmid">' +
                    '<th '+dis+'>Batch No.</th>' + '<th '+dis+'>Manufacture Date</th>' + '<th '+dis+'>Expiry Date</th>' + '<th class="tdw150">Quantity</th>' + '<th class="tdw150">Damages</th>' + '<th></th>' +
                '</tr>' +
                '<tr class="vmid hmid batch_dtl_form_bx">' +
                    '<td '+dis+'><input type="hidden" class="proname" value="' + pro_name + '"><input type="hidden" class="nobatch" value="' + nobatch + '"><input type="text" class="un_batch_no" value="'+temp_batch_ar[1]+'"></td>' + 
                    '<td '+dis+'><input type="text" class="un_m_date hasCal dateInpt" readonly="true" maxdate="'+$("#max_manufac_date").val()+'" value="'+temp_batch_ar[2]+'"></td>' + 
                    '<td '+dis+'><input type="text" class="un_e_date hasCal dateInpt" readonly="true" mindate="'+$("#min_ex_date").val()+'" value="'+temp_batch_ar[3]+'"></td>' + 
                    '<td><input type="text" class="un_qty" valid="int"></td>' + 
                    '<td><input type="text" class="un_damage" valid="int"></td>' + 
                    '<td><button type="button" class="btn btn-sm btn-primary un_add_batch_btn">'+btntext+'</button></td>' +
                '</tr>' +
            '</table>' +
        '</div>';

    $(".un_products_bx").append(el);
    init_add_batch_event();
    init_del_pro_event();

    set_session_data();
    set_pro_auto_complete();

    setDateToInputs();
    initUtilFunctions();
}

function set_session_data() {
    var data_arr = [];
    $(".un_pro_bx").each(function() {
        p = $(this);
        var pros = {pro_name: '', nobatch: 0, un_batch_no:'', un_m_date:'', un_e_date:'', batches: []};
        pros.pro_name = p.find('.un_pro_name').attr('pro');
        pros.nobatch = p.find('.nobatch').val();
        pros.un_batch_no = p.find('.un_batch_no').val();
        pros.un_m_date = p.find('.un_m_date').val();
        pros.un_e_date = p.find('.un_e_date').val();

        p.find(".un_batch_row").each(function() {
            r = $(this);
            pros.batches.push({
                batch_no: r.find('td').eq(0).text(),
                m_date: r.find('td').eq(1).text(),
                e_date: r.find('td').eq(2).text(),
                qty: r.find('td').eq(3).text(),
                damages: r.find('td').eq(4).text()
            });
        });

        data_arr.push(pros);
    });

    $.ajax({
        url: SITE_URL + "receive/store_data_in_session",
        method: 'post',
        data: {'pros': data_arr, 'csrf_imsnaco': get_csrf_cookie()},
        success: function() {
        }
    });
}

/** Complete Receiving Submit **/

function complete_receiving() {
    var err = false;
    var source_batches = eval($("#batches").val());
    //console.log(JSON.stringify(source_batches));
    $(".un_batch_row").each(function() {
        ob = $(this);
        proname = $.trim(ob.attr('proname'));
        batchno = $.trim(ob.find('td').eq(0).text());
        mdate = $.trim(ob.find('td').eq(1).text());
        edate = $.trim(ob.find('td').eq(2).text());

        if (source_batches) {
            $.each(source_batches, function(k, v) {
                if (batchno == v.batch_no && proname == v.product_name && edate != v.e_date) {
                    if (mdate != v.m_date) {
                        err = true;
                        ob.addClass('danger');
                    }
                    if (edate != v.e_date) {
                        err = true;
                        ob.addClass('danger');
                    }
                }
            });
        }
    });

    if (err) {
        boot_alert("Alert", "Some batche(s) for the same product already exists with different expiry date. Please adjust the date.");
    }

    return !err;
}

function set_pro_auto_complete() {
    added = [];
    $(".un_pro_name").each(function() {
        added.push($.trim($(this).text()));
    });

    pros = [];
    $.each(all_pros, function(k,v){
        if($.inArray(v.pro_name_code, added) == -1)
            pros.push(v.pro_name_code);
    });
    $("#product_name").auto_list(pros);
}


$(document).ready(function() {
    set_pro_auto_complete();

    $("#product_name").change(function() {
        ob = $(this);
        setTimeout(function() {
            add_product_in_unregister(ob.val());
            ob.val('');
        }, 200);
    });

    $(".comp-receive-btn").click(function(e) {
        if ($(".un_batch_row").length <= 0) {
            e.preventDefault();
            boot_alert("Error", "Please click on 'Add Batch' before proceeding.<br><br>Please make sure that all details are added before proceeding to receive.");
        }
    });


    /** Init **/
    setDateToInputs();
    initUtilFunctions();
    init_del_pro_event();
    init_del_batch_event();
    init_add_batch_event();


    /** Source check **/
    sources = eval($("#sources").val());
    if (sources)
        $("#source_name").auto_list(sources);



    $("#source_name").on('change', function() {
        ob = $(this);
        $(".sub-receiving").prop('disabled', true);
        $("#source_id, #address, #state_dd, #district_dd, #city, #pincode").val('').prop('disabled', false);
        $("#district_dd option").not(':first').remove();

        setTimeout(function() {
            source_name = ob.val();
          
            $.ajax({
                url: SITE_URL + 'receive/unreg_source_detail',
                method: 'GET',
                data: {source_name: source_name, csrf_imsnaco: get_csrf_cookie()},
                dataType: 'JSON',
                success: function(res) {
                    $(".sub-receiving").prop('disabled', false);
                    if (res.length <= 0) {
                        return;
                    }

                    $("#source_id").val(parseInt(res.source_id));
                    $("#address").val(res.address);
                    $("#state_dd").val(res.state);
                    getDistricts(res.district_id);
                    $("#city").val(res.city);
                    $("#pincode").val(res.pincode);
                    $("#batches").val(JSON.stringify(res.batches));

                    $("#address, #state_dd, #district_dd, #city, #pincode").prop('disabled', true);
                }
            });

        }, 200);
    });
});