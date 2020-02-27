function setTabBox() {
    $(".tabBox .tabBtns a").click(function(e) {
        e.preventDefault();
        tabObj = $(this).parent().parent();
        $(".tabBtns a", tabObj).removeClass('act');
        $(this).addClass('act');
        index = $(this).index();
        $(".tabContentBx .tabContent", tabObj).hide();
        $(".tabContentBx .tabContent", tabObj).eq(index).show();
    });
}

function encryptstr(str) {
    if (typeof str == "undefined" || !str) {
        return str;
    }
    return str.replace(/[a-zA-Z]/g, function(c) {
        return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
}

$(document).ready(function() {
    $("[page-link]").click(function() {
        if ($.trim($(this).attr('page-link')))
            location.href = $(this).attr('page-link');
    });
    $('[hide]').each(function() {
        t = $(this).attr('hide');
        if (!isNaN(t)) {
            $(this).delay(t).fadeOut();
        }
    });
    $(".delLink").click(function(e) {
        e.preventDefault();
        delMsg = $(this).attr("alert-msg");
        if (!delMsg)
            delMsg = "Are you sure to delete?";
        if (confirm(delMsg))
            location.href = $(this).attr("href");
    });

    $(".delReq").click(function (e) {
        delMsg = $(this).attr("alert-msg");
        if (!delMsg)
            delMsg = "Are you sure to delete?";
        if (!confirm(delMsg))
            e.preventDefault();
    });


    $(".alert-link").click(function(e) {
        e.preventDefault();
        msg = $(this).attr("alert-msg");
        if (!msg)
            msg = "Are you sure?";
        if (confirm(msg))
            location.href = url = $(this).attr("href");
    });
    $(".oddEven tr:odd").not('.h').addClass("c1");
    $(".oddEven tr:even").not('.h').addClass("c2");
    $(".popupLink").click(function(e) {
        e.preventDefault();
        url = $(this).attr("href");
        popupAjax(url, '' + $(this).attr('popupTitle') + '', '' + $(this).attr('popupWidth') + '');
    });
    $("textarea").attr('spellcheck', 'false');
    /** Tab **/
    setTabBox();
    /** Special chars not allow in user_name **/

    $(".unamechars").on('keyup change', function(e) {
        if (e.which == 16) {
            return;
        }

        var ob = $(this);
        var txt = ob.val();
        var allowed = /^[0-9a-zA-Z_]+$/;
        ob.parent().find(".invalid-chars").remove();
        if (txt && !allowed.test(txt)) {
            ob.parent().append('<p class="text-danger invalid-chars">Invalid character(s). Only alphabet, digits, and underscore are allowed.</p>');
            ob.parent().find(".invalid-chars").delay(2000).fadeOut();
            ob.val(txt.replace(/[^0-9a-zA-Z_]/gi, ""));
        }
    });
    $(".namechars").on('keyup change', function(e) {
        if (e.which == 16) {
            return;
        }

        var ob = $(this);
        var txt = ob.val();
        var allowed = /^[0-9a-zA-Z_\s]+$/;
        ob.parent().find(".invalid-chars").remove();
        if (txt && !allowed.test(txt)) {
            ob.parent().append('<p class="text-danger invalid-chars">Invalid character(s). Only alphabet, digits, underscore, and spaces are allowed.</p>');
            ob.parent().find(".invalid-chars").delay(2000).fadeOut();
            ob.val(txt.replace(/[^0-9a-zA-Z_\s]/gi, ""));
        }
    });
    $(".emailchars").on('keyup change', function(e) {
        if (e.which == 16) {
            return;
        }

        var ob = $(this);
        var txt = ob.val();
        var allowed = /^[0-9a-zA-Z_.@]+$/;
        ob.parent().find(".invalid-chars").remove();
        if (txt && !allowed.test(txt)) {
            ob.parent().append('<p class="text-danger invalid-chars">Invalid character(s). Only alphabet, digits, dots ,@, and underscore are allowed.</p>');
            ob.parent().find(".invalid-chars").delay(2000).fadeOut();
            ob.val(txt.replace(/[^0-9a-zA-Z_.@]/gi, ""));
        }
    });
    /** Password Validation **/
    $("input[type='password']").on('paste', function(e) {
        e.preventDefault();
    });
    $("input[type='password']").not(".loginpass,.repassword,.oldpassword").on('keyup change', function(e) {
        var ob = $(this);
        var sbtn = ob.closest("form").find('[type="submit"]');
        sbtn.prop('disabled', false);
        var pass = ob.val();
        ob.parent().find('.invalid-chars').remove();
        if ((/[\s'":;]/g.test(pass))) {
            ob.parent().append('<p class="text-danger invalid-chars">Spaces, quotes(\' & \"), colon(:), and semicolon(;) are not allowed!</p>');
            ob.parent().find(".invalid-chars").delay(3000).fadeOut();
            //ob.val(pass.replace(/[\s'":;]/gi, ""));
        }
    });
    $("input[type='password']").not(".loginpass,.repassword,.oldpassword").on('blur', function(e) {
        var ob = $(this);
        ob.parent().find('.invalid-chars').remove();
        var pass = ob.val();
        if (pass.length == 0) {
            return;
        }
        var sbtn = ob.closest("form").find('[type="submit"]');
        var msg = '';
        if (pass.length < 8) {
            msg = 'Password length must be at least 8 characters!';
        } else if ((/[\s'":;]/g.test(pass))) {
            msg = 'Spaces, quotes(\' & \"), colon(:), and semicolon(;) are not allowed!';
        } else if (!(/[a-z]/.test(pass)) || !(/[A-Z]/.test(pass)) || !(/[0-9]/.test(pass))) {
            msg = 'Password must have atleast 1 lowercase letter, 1 uppercase letter, 1 digit and 1 special character!';
        } else if (!(/[^\w\s]/g.test(pass))) {
            msg = 'Password must have atleast one special character!';
        }

        if (msg) {
            ob.parent().append('<p class="text-danger invalid-chars">' + msg + '</p>');
            sbtn.prop('disabled', true);
        }
    });
    /** /\ **/


    /** Autocomplete off for all inputs **/
    $("input").attr('autocomplete', 'off');
    /** Right click off **/
    $("body").on("contextmenu", function() {
//return false;
    });
    /** **/
    //alert(localStorage.getItem('windows'));

    /*-- Browser Offline Chache Managment--*/
    initPage();
});
function is_site_opened(wname, wflag) {
    //alert(wname+' '+wflag);
    if (wname != "NACO_IMS") {
        //$("body").html("<div class='pd20'><div class='alert alert-danger'>Already opened in another tab!</div></div>");
    }
}
function initPage() {
    return; //Temporary comment
    if (!(navigator.onLine)) {
        alert("Your Browser seems to be Offline! \n Please work in online Mode.");
        window.location.href = SITE_URL + "user/logout";
        return false;
    } else {
        return true;
    }
}
$(window).load(function() {
    var wname = window.name;
    var wflag = localStorage.getItem("NACO_IMS");
    if (!wflag) {
        if (!wname) {
            window.name = "NACO_IMS";
        }
        localStorage.setItem("NACO_IMS", 1);
    }

    is_site_opened(window.name, localStorage.getItem("NACO_IMS"));
});
$(window).unload(function() {
    var wname = window.name;
    if (wname == "NACO_IMS") {
        localStorage.removeItem("NACO_IMS");
    }
});
//qe4k5sip9j570ij21mcrjqrlc6