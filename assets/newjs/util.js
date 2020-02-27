function getExt(filename) {
	var ext = /[^.]+$/.exec(filename);
	ext = ext.toString();
	ext = ext.toLowerCase();
	return ext;
}

function redirect(url) {
	location.href = url;
}

function getNumValue(v) {
	v = $.trim(v);
	if (isNaN(v))
		v = 0;
	return v * 1;
}

function ajaxFormData(options) {
	var xhr = new XMLHttpRequest();
	xhr.addEventListener('progress', function (e) {
		var done = e.position || e.loaded, total = e.totalSize || e.total;
	}, false);
	if (xhr.upload) {
		xhr.upload.onprogress = function (e) {
			var done = e.position || e.loaded, total = e.totalSize || e.total;
			per = Math.round(Math.floor(done / total * 1000) / 10);
			if (options.progress)
				options.progress(per);
		};
	}
	xhr.onreadystatechange = function (e) {
		if (this.readyState == 4 && this.status == 200) {
			if (options.complete)
				options.complete(this.responseText);
		}
	};
	xhr.open('post', options.url, true);
	xhr.send(options.data);

	/** 
	//(How to use)
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
}

function googleMap(Lat, Long, MapBoxId, Zoom, Icon, Title, MinZoom, MaxZoom) {
	/* key=AIzaSyD96BPnbuxiIt1SwcfX_ZP3I9C5vn5TBRI */
	/* include this javascript in your page */
	/* <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script> */

	Lat = Lat * 1;
	Long = Long * 1;
	Zoom = Zoom ? Zoom : 8;
	Icon = Icon ? Icon : '';
	Title = Title ? Title : '';
	MinZoom = MinZoom ? MinZoom : '';
	MaxZoom = MaxZoom ? MaxZoom : '';

	var latlng = new google.maps.LatLng(Lat, Long);

	var mapOptions = {
		center: latlng,
		zoom: Zoom,
		minZoom: MinZoom,
		maxZoom: MaxZoom,

		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mymap = new google.maps.Map(document.getElementById(MapBoxId), mapOptions);

	var marker = new google.maps.Marker({
		position: latlng,
		title: Title,
		icon: Icon,
		map: mymap
	});

	google.maps.event.addListenerOnce(mymap, "bounds_changed", function () {
		google.maps.event.trigger(mymap, "resize");
		mymap.setCenter(latlng);
	});

	//When map fully loaded
	google.maps.event.addListenerOnce(mymap, 'idle', function () {
		google.maps.event.trigger(mymap, "resize");
		mymap.setCenter(latlng);
	});
}

$.fn.monthYearPicker = function (options) {
	var maxdate = $(this).attr('maxdate');
	var mindate = $(this).attr('mindate');
	options = $.extend({
		dateFormat: "M yy",
		changeMonth: true,
		changeYear: true,
		//   stepMonths: 0,
		maxDate: maxdate,
		minDate: mindate,
		showButtonPanel: true,
		// showAnim: "",
		onClose: function (dateText, inst) {
			$(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
		}
	}, options);

	function hideDaysFromCalendar() {
		var thisCalendar = $(this);
		$('.ui-datepicker-calendar').detach();
	}
	$(this).datepicker(options).focus(hideDaysFromCalendar);
}

function set_monthyear(obj) {
	obj.monthYearPicker();
}

function set_datepicker(obj) {
	var ddate, uRange, yr;
	if (typeof obj == "undefined" || !obj) {
		obj = $('.hasCal');
	}

	obj.each(function () {
		var cob = $(this);
		ddate = cob.val();
		yRange = "1900:2050";
		yr = cob.attr('year-range');
		if (yr) {
			yRange = yr;
		}

		var maxdate = cob.attr('maxdate');
		var mindate = cob.attr('mindate');
		var callback = cob.attr('callback');


		cob.datepicker({
			dateFormat: "dd M yy",
			changeYear: true,
			changeMonth: true,
			yearRange: yRange,
			onSelect: function (date) {
				if ($("[ng-app]").length) {
					angular.element(cob).triggerHandler('input');
				}
				if (callback) {
					var fn = window[callback];
					fn(cob, date);
				}
			}
		});

		if (cob.attr('noweekend')) {
			cob.datepicker("option", "beforeShowDay", jQuery.datepicker.noWeekends);
		}
		if (maxdate && typeof maxdate != "undefined") {
			maxdate = new Date(cob.attr('maxdate'));
			cob.datepicker("option", "maxDate", maxdate);
		}
		if (mindate && typeof mindate != "undefined") {
			mindate = new Date(cob.attr('mindate'));
			cob.datepicker("option", "minDate", mindate);
		}

		cob.datepicker("setDate", ddate);
	});
}

function set_datetimepicker(obj) {
	var ddate, uRange, yr;
	if (typeof obj == "undefined" || !obj) {
		obj = $('.hasCal');
	}

	obj.each(function () {
		var cob = $(this);
		ddate = cob.val();
		yRange = "1900:2050";
		yr = cob.attr('year-range');
		if (yr) {
			yRange = yr;
		}

		var maxdate = cob.attr('maxdate');
		var mindate = cob.attr('mindate');

		cob.datetimepicker({
			dateFormat: "dd M yy",
			timeFormat: "hh:mm TT",
			changeYear: true,
			changeMonth: true,
			yearRange: yRange,
			onSelect: function (date) {
				if ($("[ng-app]").length) {
					angular.element(cob).triggerHandler('input');
				}
			}
		});

		if (cob.attr('noweekend')) {
			cob.datepicker("option", "beforeShowDay", jQuery.datepicker.noWeekends);
		}
		if (maxdate && typeof maxdate != "undefined") {
			maxdate = new Date(cob.attr('maxdate'));
			cob.datepicker("option", "maxDate", maxdate);
		}
		if (mindate && typeof mindate != "undefined") {
			mindate = new Date(cob.attr('mindate'));
			cob.datepicker("option", "minDate", mindate);
		}

		cob.datepicker("setDate", ddate);
	});
}

function set_page_links() {
	$("[page-link]").each(function () {
		var page_link = $(this).attr('page-link');
		$(this).css('cursor', 'pointer');
		$(this).click(function (e) {
			e.preventDefault();
			location.href = page_link;
		});
	});
}

function remove_empty_qs(formobj) {
	if (typeof formobj == "undefined" || !formobj) {
		formobj = $('.search_form');
	}
	formobj.find('input,select').each(function () {
		var ob = $(this);
		if (!ob.val()) {
			ob.removeAttr('name');
		}
	});
}

function set_tab_box() {
	$(".tabBox .tabBtns a").click(function (e) {
		e.preventDefault();
		var tabObj = $(this).closest('.tabBox');
		$(".tabBtns a", tabObj).removeClass('act');
		$(this).addClass('act');

		var index = $(this).index();
		$(".tabContentBx .tabContent", tabObj).hide();
		$(".tabContentBx .tabContent", tabObj).eq(index).show();
	});
}

function set_confirm_link() {
	$(".confirm").click(function (e) {
		e.preventDefault();
		var msg = $(this).attr("msg");
		msg = msg ? msg : 'Are you sure?';
		if (confirm(msg)) {
			var url = $(this).attr("href");
			location.href = url;
		}
	});
}

function set_fancybox() {
	/** Fancybox init **/
	if ($('.fancybox').length) {
		$('.fancybox').fancybox({ helpers: { overlay: { locked: false } } });
	}
	/** FancyBox Ajax **/
	$(".fancybox-ajax").each(function () {
		$(this).fancybox({
			closeBtn: true,
			type: 'ajax',
			helpers: { title: { type: 'inside', position: 'top' }, overlay: { locked: false } },
			beforeShow: function (opt) { this.title = $(this.element).attr('popup-title'); }
		});
	});
}

function set_tinymce(selector, height) {
	tinymce.EditorManager.execCommand('mceRemoveEditor', true, $(selector).attr('id'));

	height = height ? height : 300;
	tinymce.init({
		selector: selector,
		height: height,
		menubar: false,
		fontsize_formats: "8px 9px 10px 11px 12px 13px 14px 15px 16px 18px 20px 22px 24px 26px 28px 30px 36px 40px 50px",
		plugins: [
			'advlist autolink lists link image charmap print preview anchor',
			'searchreplace visualblocks code fullscreen',
			'insertdatetime media table contextmenu paste code', 'textcolor colorpicker'
		],

		//alignleft aligncenter alignright alignjustify
		toolbar: 'insert | styleselect | bold italic | fontselect fontsizeselect | forecolor backcolor | bullist numlist outdent indent | link unlink | image table | removeformat code | fullscreen',
		//content_css: '//www.tinymce.com/css/codepen.min.css',

		paste_auto_cleanup_on_paste: true,
		paste_remove_styles: true,
		paste_remove_styles_if_webkit: true,
		paste_strip_class_attributes: true,

		valid_elements: '*[*]',

		relative_urls: false,
		remove_script_host: false,
		convert_urls: true,
	});
}

function tinymce_insert_file_init() {
	$(".tinymce_insert_file").click(function () {
		var objid = $(this).attr('objid');
		if (objid) {
			tinymce.EditorManager.get(objid).focus();
		}

		/*$.fancybox({
			closeBtn: true,
			width: '80%',
			autoSize: false,
			type: 'ajax',
			href: 'files/lists',
			helpers: {title: {type: 'inside', position : 'top'}, overlay: {locked: false}},
			beforeShow : function(opt) {this.title='<h2>Select Image</h2>';}
		});*/

		show_loader();
		$.ajax({
			url: 'files/lists',
			success: function (res) {
				hide_loader();
				$("#tinyMceImgModal .modal-body").html(res);
				$("#tinyMceImgModal").modal();
			}
		});
	});
}

function open_modal(modal, title, msg) {
	if (title) {
		$("#" + modal + " .modal-title").html(title);
	}
	if (msg) {
		$("#" + modal + " .modal-body").html(msg);
	}

	$("#" + modal).modal();
}

function close_modal(modal) {
	$("#" + modal).modal('hide');
}

function image_preview(input, imgobj) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {
			imgobj.attr('src', e.target.result);
		}
		reader.readAsDataURL(input.files[0]);
	}
}

function show_alert_msg(msg, type, t) {
	t = t ? t : 4000;
	type = type ? type : 'S';
	var css = type == 'S' ? 'green' : 'red';
	var el = '<div class="alertmsg"><div class="' + css + '">' + msg + '</div></div>';
	$(".alertmsg").remove();
	$("body").prepend(el);
	$(".alertmsg").delay(t).fadeOut('slow');
}

function hide_alert_msg() {
	$(".alertmsg").remove();
}

function show_loader() {
	var el = '<div class="bodycover"></div><div class="ajaxloader"><i class="fa fa-spin fa-circle-o-notch"></i></div>';
	$(".bodycover,.ajaxloader").remove();
	$("body").prepend(el);
}

function hide_loader() {
	$(".bodycover,.ajaxloader").remove();
}


function apply_select2(obj, text) {
	if (!text) {
		text = 'Select';
	}

	if (obj.hasClass('select2-hidden-accessible')) {
		obj.select2('destroy');
	}
	$.fn.select2.defaults.set("theme", "bootstrap");
	obj.select2({ placeholder: text, allowClear: true });
}

function apply_select2_ajax(obj, url, text, defaultdata) {
	if (!text) {
		text = 'Select';
	}

	if (obj.hasClass('select2-hidden-accessible')) {
		obj.select2('destroy');
	}
	$.fn.select2.defaults.set("theme", "bootstrap");

	var select_ob = {
		placeholder: text,
		allowClear: true,
		minimumInputLength: 1,
		ajax: {
			url: url,
			dataType: 'json',
			type: "GET",
			data: function (term) {
				return { term: term };
			},
			processResults: function (data) {
				//Format of data should be: [{id:1, text:'item1'}, {id:2, text:'item2'}]
				return { results: data };
			}
		}
	};

	if (typeof defaultdata == "object") {
		select_ob.initSelection = function (element, callback) {
			obj.html('');
			obj.append('<option value="' + defaultdata.id + '" selected>' + defaultdata.text + '</option>');
			callback({ id: defaultdata.id, text: defaultdata.text });
		}
	}

	obj.select2(select_ob);
}

function showHttpErr(res) {
	show_alert_msg("Network error! Try again.", "E");
	hide_loader();
}

function showModal(obj, fullHeight) {
	if (fullHeight) {
		var h = $(window).outerHeight() - 155;
		obj.find(".modal-body").css({ 'overflow': 'Auto', 'max-height': h + 'px' });
	}
	obj.modal();
	obj.find(".modal-body").scrollTop(0);
}

function hideModal(obj) {
	obj.modal('hide');
	$('body').removeClass('modal-open');
	$('.modal-backdrop').remove();
}

//EOF