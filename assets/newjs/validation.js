function isEmail(email) {
	if(/^[a-zA-Z]([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email) == false)	
		return false;
	else 
		return true
}

function checkImageExt(filename) {
	var ext= /[^.]+$/.exec(filename);
	ext=ext.toString();
	ext=ext.toLowerCase();
	exts=new Array('jpg', 'jpeg', 'gif', 'png');
	if(exts.indexOf(ext)!=-1)
		return true;
		
	return false;
}

function checkFileExt(filename) {
	var ext= /[^.]+$/.exec(filename);
	ext=ext.toString();
	ext=ext.toLowerCase();
	exts=new Array('jpg', 'jpeg', 'gif', 'png', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf');
	if(exts.indexOf(ext)!=-1)
		return true;
		
	return false;
}

function check_image(ob){
	var obj=$(ob);
	var err=false;
	if(!checkImageExt(obj.val())){
		err=true;
		open_modal('defaultModal', 'Image Error!', 'Invalid image! Only .jpg, .png and .gif images are allowed.');
	}
	
	if(!err){
		var file=obj[0];
		var size=file.files[0].size/1024;
		if(size>1024){
			err=true;
			open_modal('defaultModal', 'Image Size Error!', "Can't upload! This image is larger than 1 MB");
		}
	}
	
	if(err){
		obj.val('');
	}
	return !err;
}

function check_file(ob){
	var obj=$(ob);
	var err=false;
	if(!checkFileExt(obj.val())){
		err=true;
		open_modal('defaultModal', 'File Error!', 'Invalid file! Only images (.jpg, .png, .gif), word, excel, pdf and ppt files are allowed.');
	}
	
	if(!err){
		var file=obj[0];
		var size=file.files[0].size/1024;
		if(size>2048){
			err=true;
			open_modal('defaultModal', 'File Size Error!', "Can't upload! This file is larger than 2 MB");
		}
	}
	
	if(err){
		obj.val('');
	}
	return !err;
}

function set_numeric_input(){
	/** Int **/
	$("html,body").find('[valid="int"]').each(function(){
        $(this).keydown(function(e){
            var allowed=false;
            if(e.ctrlKey === true && (e.keyCode==65 || e.keyCode==88 || e.keyCode==86))
                allowed=true;
            if($.inArray(e.keyCode, [8,9,37,38,39,40,46]) !== -1)
                allowed=true;
         
            if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105) && !allowed){
                e.preventDefault();
            }
        });
        
        $(this).change(function(e){
            $(this).val($(this).val().replace(/\D/g,''));
        });
    });
	
	/** Float **/
	$("html,body").find('[valid="num"]').each(function(){
        $(this).keydown(function(e){
            var allowed=false;
            if(e.ctrlKey === true && (e.keyCode==65 || e.keyCode==88 || e.keyCode==86))
                allowed=true;
            if($.inArray(e.keyCode, [8,9,37,38,39,40,46]) !== -1)
                allowed=true;
            
            if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105) && !allowed && e.keyCode!=190 && e.keyCode!=110){
                e.preventDefault();
            }
        });
        
        $(this).change(function(e){
            if($(this).val()){
                $(this).val(parseFloat($(this).val().replace(/[^\d.-]/g,'')));
			}
        });
    });
}

function show_form_errors(errors, frm, borderonly){
	if(typeof errors !='object'){
		return;
	}
	
	$.each(errors, function(k, v){
        if(borderonly){
            frm.find('[name="'+k+'"]').addClass('is-invalid');
        }else{
            frm.find('[name="'+k+'"]').after('<div class="invalid-feedback ferr">'+v+'</div>').addClass('is-invalid');
        }
	});
}

function hide_form_errors(frm){
	frm.find('.ferr').remove();
	frm.find('.is-invalid').removeClass('is-invalid');
}