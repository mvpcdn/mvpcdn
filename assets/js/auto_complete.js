var _auto_inpt_obj;
var _auto_sugg_flag;
function auto_list_move_down(){
    n=$(".ac-list-bx .item").length;
    act_index=$(".ac-list-bx .item.act").index();
    $(".ac-list-bx .item").removeClass('act');
    $(".ac-list-bx .item").eq(act_index+1).addClass('act');
}

function auto_list_move_up(){
    n=$(".ac-list-bx .item").length;
    act_index=$(".ac-list-bx .item.act").index();
    $(".ac-list-bx .item").removeClass('act');
    $(".ac-list-bx .item").eq(act_index-1).addClass('act');
}

function filter_auto_list_result(res, key, start_with){
    result=[];
    if(key){
        t=res.length;
        for(i=0; i<t; i++){
            if(start_with){
                if(new RegExp('^'+key, 'i').test(res[i]))
                    result.push(res[i]);
            }
            else{
                if(new RegExp(key, 'i').test(res[i]))
                    result.push(res[i]);
            }
        }
    }

    return result.sort();
}

function auto_list_set_result(res, key){
    if(res && res.length>0){
        $(".ac-list-bx").show();
        el='';
        $.each(res, function(k, v){
            if(v)
                el=el+'<div class="item">'+v+'</div>';
        });

        $(".ac-list-bx").html(el);
        $(".ac-list-bx .item").mouseover(function(){
            $(".ac-list-bx .item").removeClass('act');
            $(this).addClass('act');
        });

        $(".ac-list-bx .item").click(function(){
            _auto_inpt_obj.val($(this).text());
            _auto_inpt_obj.trigger('change');
            $(".ac-list-bx").html('').hide();
        });

        up_key=38; down_key=40;
        _auto_inpt_obj.off('keydown');
        _auto_inpt_obj.on('keydown', function(e){
            switch(e.which){
                case up_key:
                    auto_list_move_up();
                break;

                case down_key:
                    auto_list_move_down();
                break;

                case 13:
                    var txt=$(".ac-list-bx .act").text();
                    _auto_inpt_obj.val(txt);
                    _auto_inpt_obj.trigger('change');
                    $(".ac-list-bx").html('').hide();
                break;
            }
        });
        
        /** Make bold matched string **/
        //$(".ac-list-bx .item").autoListwrapInTag({tag: 'strong', words: [key?key:'']});
    }
    else{
        $(".ac-list-bx").hide();
    }
}

$.fn.autoListwrapInTag = function(opts) {
  var tag = opts.tag || 'strong';
  var words = opts.words || [];
  var regex = RegExp(words.join('|'), 'i'); // case insensitive
  var replacement = '<'+ tag +'>$&</'+ tag +'>';

  return this.html(function() {
    return $(this).text().replace(regex, replacement);
  });
};

$.fn.auto_list=function(url_or_obj, css_class, start_with){
    if($(".ac-list-bx").length<=0){
        $("body").prepend('<div class="ac-list-bx"></div>');
    }

    keys_ignore=[0, 9, 13, 16, 17, 18, 20, 27, 35, 36, 37, 38, 39, 40]; //arrow, enter, shift, ctrl, alt etc. (Non typing chars)

    ob=$(this);
    ob.off('keyup focus');

    $(document).click(function(){
        $(".ac-list-bx").html('').hide();
    });

    ob.focus(function(){
        T=Math.round($(this).offset().top);
        L=Math.round($(this).offset().left);
        W=$(this).outerWidth()+'px';
        H=$(this).outerHeight();
        T=T+H+1;
        
        $(".ac-list-bx").attr('class', 'ac-list-bx');
        if(css_class){
            $(".ac-list-bx").attr('class', 'ac-list-bx '+css_class);
        }

        $(".ac-list-bx").html('').hide();
        $(".ac-list-bx").css({'left': L+'px', 'top': T+'px', 'width': W});
    });

    ob.on("keyup", function(e){
        if(keys_ignore.indexOf(e.which)!=-1)
            return;

        _auto_inpt_obj=$(this);
        key=_auto_inpt_obj.val();

        if(typeof url_or_obj =="string"){
            $.ajax({url: url_or_obj, method: 'GET', data: {'k': key}, dataType: 'JSON', success: function(res){auto_list_set_result(res, key);}});
        }
        else{
            auto_list_set_result(filter_auto_list_result(url_or_obj, key, start_with), key);
        }
    });
}

/**
//Ajax example (Result should be in json i.e. ["aa", "bbb", ...])
$(".inpt1").auto_list(SITE_URL+"common/test");

//Array example
var a=["Mango", "Gvava", "Manager", "Arabic", "Button", "Good", "Boxing", "Arise"];
$(".inpt2").auto_list(a, false, true);

//CSS
<style type="text/css">
.ac-list-bx			{position:absolute; z-index:1000; border:1px solid #ccc; background:#fff; max-height:300px; overflow:auto; display:none}
.ac-list-bx .item		{display:block; padding:4px 10px; cursor:pointer}
.ac-list-bx .item.act		{background:#e1e1e1}
</style>
**/