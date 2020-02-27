/** Functions */
function ngvisible(){
    $(".ng-novisible").removeClass("ng-novisible");
    $("[autofocus]").focus();
}

function set_active_nav(){
    var cur_u = location.href;
    var cur_a = cur_u.split("?");
    cur_url = $.trim(cur_a[0]);
    $(".top-nav a").each(function() {
        if(!$(this).is('[href]')){
            return;
        }
        var navu = $(this).attr('href');
        var nav_a = navu.split("?");
        navurl = $.trim(nav_a[0]);
        
        if (cur_url.indexOf(navurl)!==-1) {
            $(this).addClass('act');
            var p = $(this).parent().parent().parent();
            p.find('> a').addClass("act");
        }
    });
}

function open_temp_password_modal(ob){
    var em = $(ob).attr('em');
    var uid = $(ob).attr('uid');
    var msg='<p>Temporary password will be sent to this email-id: <a href="">' + em + '</a></p>' + '<strong>Are you sure to reset password?</strong>';

    bootbox.confirm({
        title: 'Reset Password Confirmation',
        message: msg,
        buttons: {
            'cancel': {label: 'No'},
            'confirm': {label: 'Yes'}
        },
        callback: function (res) {
            if (res == true) {
                show_loader();

                $.ajax({
                    method: 'POST',
                    url: SITE_URL + "common/resetPassword",
                    data: {user_id: uid},
                    success: function (res) {
                        hide_loader();
                        if (res == 'T') {
                            show_alert_msg("Password reset successfully");
                        }
                    }
                });
            }
        }
    });
}

function open_confirm_bootbox(title, message, callback, callback_arg){
    bootbox.confirm({
        title: title,
        message: message,
        animate:false,
        buttons: {
            'cancel': {label: 'No'},
            'confirm': {label: 'Yes'}
        },
        callback: function (res) {
            if(res == true) {
                if(callback){
                    if(callback_arg){
                        callback(callback_arg);
                    }else{
                        callback();
                    }
                }
            }
        }
    });
}

function bootbox_alert(title, message, callback, callback_arg){
    bootbox.alert({
        //size: "small",
        title: title,
        message: message,
        animate:false,
        callback: function(){
            if(callback){
                if(callback_arg){
                    callback(callback_arg);
                }else{
                    callback();
                }
            }
        }
    })
}

function allChk(parentSelector){
	$(parentSelector).find(".allChk, .chk").prop('checked', $(parentSelector).find(".allChk").prop("checked"));
}
function chk(parentSelector){
	$(parentSelector).find(".allChk").prop('checked', $(parentSelector).find(".chk:checked").length==$(parentSelector).find(".chk").length);
}

function apply_select2_delay(obj, text){
    setTimeout(function(){
        apply_select2(obj, text)
    }, 200);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/** Multiselect checkbox */
function showMultiSelectCheckboxes(ob) {
    var obj=$(ob);
    var checkboxes=obj.parent().find(".checkboxes");
    $(".multiselect .checkboxes").not(checkboxes).hide();
    checkboxes.toggle();
}
function multiSelectChkChange(ob){
    var obj=$(ob);
    var title=obj.closest(".multiselect").find(".selectBox").attr('title');
    var c=obj.closest(".multiselect").find(".options [type='checkbox']:checked").length;
    title=c>0?(title+' ('+c+')'):title;
    obj.closest(".multiselect").find("select option:selected").text(title);

    obj.closest(".multiselect").find(".chkall [type='checkbox']").prop('checked', c==obj.closest(".multiselect").find(".options [type='checkbox']").length);

    var v=[];
    obj.closest(".multiselect").find(".options [type='checkbox']:checked").each(function(){
        v.push($(this).val());
    });
    obj.closest(".multiselect").find("select option:selected").attr('value', v.join("~"));
}
function multiSelectChkAll(ob){
    var obj=$(ob);
    obj.closest(".multiselect").find(".options [type='checkbox']").prop('checked', obj.prop('checked'));
    multiSelectChkChange(ob);
}
$(document).click(function(){
    $(".multiselect .checkboxes").hide();
});
$("body").on("click", ".multiselect", function(e){
    e.stopPropagation();
});
/** \ */

function patient_select2_ajax(obj, url, text, defaultdata) {
    if (!text) {
        text = 'Search By: Patient Name/ART/Pre ART';
    }
    if(obj.hasClass('select2-hidden-accessible')) {
        obj.select2('destroy');
    }
    $.fn.select2.defaults.set("theme", "bootstrap");

    var soptions={
        placeholder: text,
        allowClear: true,
        minimumInputLength: 1,
        ajax: {
            url: url,
            dataType: 'json',
            type: "GET",
            data: function (term) {
                return {term: term};
            },
            processResults: function (data) {
                return {
                    results: $.map(data, function (item) {
                        return {
                            id: item.patient_id,
                            text: item.patient_name,
                            art_num: item.art_num ? item.art_num : 'NA',
                            pre_art_num: item.pre_art_num ? item.pre_art_num : 'NA',
                            regimen: item.regimen ? item.regimen : 'NA',
                        }
                    })
                };
            }
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: function (data) {
            var temp = '<div id="fmu_select2_ajax_result">' +
                    "<div class='bold'>" + data.text + "</div>" +
                    "<div style='font-size:11px'>" +
                        "<div class='pull-left'>ART: <span class='text-danger'>" + data.art_num + "</span></div>" +
                        "<div class='pull-right'>Pre ART: <span class='text-danger'>" + data.pre_art_num + "</span></div>" +
                        "<div class='clearfix'></div>" +
                    "</div>" +
                    '</div>';

            return temp;
        },
        templateSelection: function (data) {
            var t=data.text;
            if(typeof data.art_num != "undefined"){
                if(data.art_num!='NA'){
                    t=t+' [ART: '+data.art_num+']';
                }
                if(data.pre_art_num!='NA'){
                    t=t+' [PRE-ART: '+data.pre_art_num+']';
                }
                if(data.regimen!='NA'){
                    t=t+' [Regimen: '+data.regimen+']';
                }
            }
            return t;
        },
    };

    obj.html('<option value="">Search By: Patient Name/ART/Pre ART</option>');
    if(defaultdata) {
        soptions.initSelection = function (element, callback) {
            obj.append('<option value="' + defaultdata.id + '" selected>' + defaultdata.text + '</option>');
			callback({id: defaultdata.id, text: defaultdata.text});
        }
    }

    obj.select2(soptions);
}

function benificiary_select2_ajax(obj, url, text, defaultdata) {
    if (!text) {
        text = 'Search By: Patient Name/PID';
    }
    if(obj.hasClass('select2-hidden-accessible')) {
        obj.select2('destroy');
    }
    $.fn.select2.defaults.set("theme", "bootstrap");

    var soptions={
        placeholder: text,
        allowClear: true,
        minimumInputLength: 1,
        ajax: {
            url: url,
            dataType: 'json',
            type: "GET",
            data: function (term) {
                return {term: term};
            },
            processResults: function (data) {
                return {
                    results: $.map(data, function (item) {
                        return {
                            id: item.counseling_id,
                            text: item.patient_name,
                            pid: item.pid,
                            gender: item.gender ? item.gender : 'NA',
                        }
                    })
                };
            }
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: function (data) {
            var temp = '<div id="fmu_select2_ajax_result">' +
                    "<div class='bold'>" + data.text + "</div>" +
                    "<div style='font-size:11px'>" +
                        "<div class='pull-left'>PID: <span class='bold'>" + data.pid + "</span></div>" +
                        "<div class='pull-right'>Gender: <span class='text-danger'>" + data.gender + "</span></div>" +
                        "<div class='clearfix'></div>" +
                    "</div>" +
                    '</div>';

            return temp;
        },
        templateSelection: function (data) {
            var t=data.text;
            if(typeof data.pid != "undefined"){
                if(data.pid!='NA'){
                    t=t+' [PID: '+data.pid+']';
                }
            }
            return t;
        },
    };

    obj.html('<option value="">Search By: Patient Name/PID</option>');
    if(defaultdata) {
        soptions.initSelection = function (element, callback) {
            obj.append('<option value="' + defaultdata.id + '" selected>' + defaultdata.text + '</option>');
			callback({id: defaultdata.id, text: defaultdata.text});
        }
    }

    obj.select2(soptions);
}
function infant_select2_ajax(obj, url, text, defaultdata) {
    if (!text) {
        text = 'Search By: Infant Name/PID';
    }
    if(obj.hasClass('select2-hidden-accessible')) {
        obj.select2('destroy');
    }
    $.fn.select2.defaults.set("theme", "bootstrap");

    var soptions={
        placeholder: text,
        allowClear: true,
        minimumInputLength: 1,
        ajax: {
            url: url,
            dataType: 'json',
            type: "GET",
            data: function (term) {
                return {term: term};
            },
            processResults: function (data) {
                return {
                    results: $.map(data, function (item) {
                        return {
                            id: item.counseling_id,
                            text: item.patient_name,
                            pid: item.pid,
                            infant_code: item.infant_code,
                            gender: item.gender ? item.gender : 'NA',
                        }
                    })
                };
            }
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: function (data) {
            var temp = '<div id="fmu_select2_ajax_result">' +
                    "<div class='bold'>" + data.text + "</div>" +
                    "<div style='font-size:11px'>" +
                        "<div class='pull-left'>PID: <span class='bold'>" + data.pid + "</span></div>" +
                        "<div class='pull-right'>Gender: <span class='text-danger'>" + data.gender + "</span></div>" +
                        "<div class='clearfix'></div>" +
                    "</div>" +
                    "<div style='font-size:11px'>" +
                        "<div class='pull-left'>Infant Code: <span class='bold'>" + data.infant_code + "</span></div>" +
                        "<div class='clearfix'></div>" +
                    "</div>" +
                    '</div>';

            return temp;
        },
        templateSelection: function (data) {
            var t=data.text;
            if(typeof data.pid != "undefined"){
                if(data.pid!='NA'){
                    t=t+' [PID: '+data.pid+']';
                }
            }
            return t;
        },
    };

    obj.html('<option value="">Search By: Patient Name/PID</option>');
    if(defaultdata) {
        soptions.initSelection = function (element, callback) {
            obj.append('<option value="' + defaultdata.id + '" selected>' + defaultdata.text + '</option>');
			callback({id: defaultdata.id, text: defaultdata.text});
        }
    }

    obj.select2(soptions);
}

/** On document ready load */
$(function(){
    set_active_nav();
    $("[autofocus]").focus();

    $.ajaxSetup({
        beforeSend: function(xhr, settings){
            var type='GET';
            if(typeof settings.method !== "undefined"){
                type=settings.method.toUpperCase();
            }else if(typeof settings.type !== "undefined"){
                type=settings.type.toUpperCase();
            }
            
            if(type=='POST'){
                settings.data = addCsrfInData(settings.data);
                return true;
            }
        },
        dataFilter: function(res){
            if(typeof res == "string"){
                if(res.indexOf('class="login-bx"')!==-1){
                    location.href=API_URL+'user/logout';
                }
            }

            return res;
        }
    });

    $("form").submit(function(e){
        $("[name='"+Csrf_token+"']").val(get_csrf_cookie());
    });

    $("body").on('click', '.sort-icons i', function(){
        var tr=$(this).closest('tr');
        tr.find('i').removeClass('dim');
        $(this).addClass('dim');
    });

    // $(document).ajaxSuccess(function( event, request, settings ) {
    //     console.log(request);
    // });
});

/** Modal Overlay **/
$(document).on('show.bs.modal', '.modal', function () {
    var zIndex = 1040 + (10 * $('.modal:visible').length);
    $(this).css('z-index', zIndex);
    setTimeout(function() {
        //$('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
    }, 0);
});

//EOF