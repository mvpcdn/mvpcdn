function ob(id) {
	var obj
	if(obj = document.getElementById(id))	
		return obj;
	else
		return false;
}

function isEmail(email) {
	if(/^[a-zA-Z]([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email) == false)	
		return false;
	else 
		return true;
}
function disp_error(error_message){
	return "<div class='alert alert-danger status-alert alert-dismissible fade in'>"+error_message+"<a href='#' class='close' data-dismiss='alert' aria-label='close'>×</a></div>";
}

function getExt(filename) {
	ext= /[^.]+$/.exec(filename);
	ext=ext.toString();
	ext=ext.toLowerCase();
	return ext;
}

function checkImageExt(filename) {
	ext= /[^.]+$/.exec(filename);
	ext=ext.toString();
	ext=ext.toLowerCase();
	exts=new Array('jpg', 'jpeg', 'gif', 'png');
	if(exts.indexOf(ext)!=-1)
            return true;
		
	return false;
}

function googleMap(Lat,Long,MapBoxId,Zoom,Icon,Title,MinZoom,MaxZoom) {
	/* key=AIzaSyD96BPnbuxiIt1SwcfX_ZP3I9C5vn5TBRI */
	/* include this javascript in your page */
	/* <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script> */
	
	Lat=Lat*1;
	Long=Long*1;
	Zoom=Zoom?Zoom:8;
	Icon=Icon?Icon:'';
	Title=Title?Title:'';
	MinZoom=MinZoom?MinZoom:'';
	MaxZoom=MaxZoom?MaxZoom:'';
	
	var latlng = new google.maps.LatLng(Lat,Long);
	
	var mapOptions = {
	  center: latlng,
	  zoom: Zoom,
	  minZoom: MinZoom,
	  maxZoom: MaxZoom,
	  
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mymap = new google.maps.Map(document.getElementById(MapBoxId),mapOptions);
	
	var marker = new google.maps.Marker({
		position:latlng,
		title:Title,
		icon:Icon,
		map:mymap
	});
	
	google.maps.event.addListenerOnce(mymap, "bounds_changed", function() {
		google.maps.event.trigger(mymap, "resize");
		mymap.setCenter(latlng);
	});
}

function streetView(Lat,Long,MapBoxId) {
	var latlng = new google.maps.LatLng(Lat,Long);
  
	var panoramaOptions = {
		position: latlng,
		pov: {
		  heading: 270,
		  pitch: 0
		},
		visible: true
	};
	var panorama = new google.maps.StreetViewPanorama(document.getElementById(MapBoxId), panoramaOptions);
}


function getDistance(lat1,lon1,lat2,lon2) {
	var R = 6371; // km
	var dLat = (lat2-lat1)*Math.PI / 180;
	var dLon = (lon2-lon1)*Math.PI / 180;
	var lt1 = lat1*Math.PI / 180;
	var lt2 = lat2*Math.PI / 180;
	
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lt1) * Math.cos(lt2);
			 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	return d;
}

function getMonthName(m){
	var Months	=	['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	return Months[m];
}

function getNumValue(v){
	v=$.trim(v);
	if(isNaN(v))
		v=0;
	return v*1;
}

function noOfDays(date1, date2){
	date1 = new Date(date1);
	date2 = new Date(date2);
	timeDiff = Math.abs(date2.getTime() - date1.getTime());
	diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
	if(isNaN(diffDays))
		return '';
	return diffDays;
}



/** Jquery dependent functions **/
function setNA() {
	$(".table td, div.form-control").each(function() {
		if(!$.trim($(this).html()))
			$(this).html('<span class="grey">N/A</span>');
	});
}

function ajaxFormData(options){
	var xhr = new XMLHttpRequest();
	xhr.addEventListener('progress', function(e) {
	var done = e.position || e.loaded, total = e.totalSize || e.total;
	}, false);
	if ( xhr.upload ) {
		xhr.upload.onprogress = function(e) {
			var done = e.position || e.loaded, total = e.totalSize || e.total;
			per=Math.round(Math.floor(done/total*1000)/10);
			if(options.progress)
				options.progress(per);
		};
	}
	xhr.onreadystatechange = function(e) {
		if(this.readyState==4 && this.status==200) {
			if(options.complete)
				options.complete(this.responseText);
		}
	};
	xhr.open('post', options.url, true);
	xhr.send(options.data);
}

/** 
//Example (How to use)
formData = new FormData(document.forms['formId']);
formData.append('file', document.getElementById('fileInput').files[0]); //If need
ajaxFormData({
	url:'upload.php',
	data:formData,
	progress: function(per){
	},
	complete: function(res){
	}
});
**/

function maxZIndex() {
	var z=0;
	jQuery('div,p,span,dd,a,table').each(function(){
		if(jQuery(this).css("zIndex") && !isNaN(jQuery(this).css("zIndex")))
		{
			if(jQuery(this).css("zIndex")>z)
				z=jQuery(this).css("zIndex");
		}
	});
	
	return z;
}

function setDateToInputs(el) {
    if(!el){
        el='.hasCal';
    }
    $=jQuery.noConflict();

    $('.hasCal').each(function() {
        ddate=$(this).val();
        yRange="1900:2030";
        yr=$(this).attr('year-range');
        if(yr){
            yRange=yr;
        }
        
        var maxdate=$(this).attr('maxdate');
        var mindate=$(this).attr('mindate');
        
        $(this).datepicker({
            dateFormat: "dd M yy",
            changeYear: true,
            changeMonth: true,
            yearRange: yRange,
        });
        
        if($(this).attr('noweekend')){
            $(this).datepicker( "option", "beforeShowDay", jQuery.datepicker.noWeekends);
        }
        if(maxdate && typeof maxdate !="undefined"){
           maxdate=new Date($(this).attr('maxdate'));
           $(this).datepicker( "option", "maxDate", maxdate);
        }
        if(mindate && typeof mindate !="undefined"){
           mindate=new Date($(this).attr('mindate'));
           $(this).datepicker( "option", "minDate", mindate);
        }
        $(this).datepicker("setDate", ddate);
    });
}

function showDialog(msg, title, isModal) {
	title	=title || '';
	isModal =isModal || false;
	
	$(".uiDialog007").remove();
	obj=$('<div class="uiDialog007" title="'+title+'"></div>').appendTo('body');
	
	obj.html(msg).dialog({
		drag: function(e, ui){
			ui.position.top -= $(window).scrollTop();
		},
		modal:isModal
	});
}

function closeDialog() {
	$(".uiDialog007").dialog( "close" );
}

function initUtilFunctions(){
    jQuery("html,body").find('[valid="int"]').each(function(){
        jQuery(this).keydown(function(e){
            allowed=false;
            if(e.ctrlKey === true && (e.keyCode==65 || e.keyCode==88 || e.keyCode==86))
                allowed=true;
            if($.inArray(e.keyCode, [8,9,37,38,39,40,46]) !== -1)
                allowed=true;
         
            if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105) && !allowed){
                e.preventDefault();
            }
        });
        
        jQuery(this).change(function(e){
            $(this).val($(this).val().replace(/\D/g,''));
        });
    });
    
    jQuery("html,body").find('[valid="float"]').each(function(){
        jQuery(this).keydown(function(e){
            allowed=false;
            if(e.ctrlKey === true && (e.keyCode==65 || e.keyCode==88 || e.keyCode==86))
                allowed=true;
            if($.inArray(e.keyCode, [8,9,37,38,39,40,46]) !== -1)
                allowed=true;
            
            if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105) && !allowed && e.keyCode!=190){
                e.preventDefault();
            }
        });
        
        jQuery(this).change(function(e){
            if($(this).val())
                $(this).val(parseFloat($(this).val().replace(/[^\d.-]/g,'')));
        });
    });
	
	jQuery("html,body").find('[valid="nospace"]').each(function(){
        jQuery(this).keydown(function(e){
            if (e.keyCode==32){
                e.preventDefault();
            }
        });
        
        jQuery(this).change(function(e){
            $(this).val($(this).val().replace(/\s/g,''));
        });
    });
}

$(document).ready(function(){
    /** Calling some functions **/
    setDateToInputs();

    /** Center **/
    jQuery.fn.center = function (notTopBtm) {
        if(this.css("position")!='relative' && this.css("position")!='fixed')
            this.css("position","absolute");

        $top=Math.max(0, ((jQuery(window).height() - this.outerHeight()) / 2) + jQuery(window).scrollTop());

        if(!notTopBtm)
            this.css("top", $top+"px");

        this.css("left", Math.max(0, ((jQuery(window).width() - this.outerWidth()) / 2) + jQuery(window).scrollLeft()) + "px");

        return this;
    }

    /** Init util functions **/
    initUtilFunctions();
});