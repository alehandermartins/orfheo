$.cloudinary.config({ cloud_name: 'hxgvncv7u', api_key: '844974134959653'});

var Pard = {};

var DetectBrowser = function(){
	console.log(bowser);
	console.log(bowser.name);
	console.log(bowser.version);
	var _compatibleBrowsers = {
		'firefox': '38',
		'chrome': '42',
		'chromium': '42',
		'internet explorer':'11',
		// 'msedge':'11',
		'safari': '9',
		'opera':'39'
	}
	if($(window).width()>640 && (!(_compatibleBrowsers[bowser.name.toLowerCase()]) || bowser.version <_compatibleBrowsers[bowser.name.toLowerCase()])){
		var _closeButton = $('<button>').addClass('close-button closeBtn-browser-alert').attr({'type':'button','data-close':''}).append($('<span>').html('&times;').attr('aria-hidden','true'));
		var _alertText = $('<p>').html('Se ha detectado que estás utilizando una versión de '+bowser.name+' con la cual orfheo no ha sido testeado. No se excluyen problemas de incompatibilidad. </br>Para una mejor experiencia, se recomienda utilizar una versión reciente de Google Chrome o de Mozilla Firefox.').addClass('text-browser-alert');
		var _alertContainer = $('<div>').append($('<div>').append(_closeButton,_alertText).addClass('text-button-container-browser-alert')).addClass('browser-alert callout').attr('data-closable','');
		$('body').prepend(_alertContainer);
	}
}
DetectBrowser();

var DetectTrackingProtection = function(){
	var canreach = false;
	$(function() {
	    $('<img/>')
	        .attr("src", "http://apps.facebook.com/favicon.ico")
	        .load(function(){canreach = true;})
	        .css("display", "none")
	        .appendTo(document.body);
	});
	$(window).load(function(){
		if (!(canreach)) { 	
		var _closeButton = $('<button>').addClass('close-button closeBtn-browser-alert').attr({'type':'button','data-close':''}).append($('<span>').html('&times;').attr('aria-hidden','true'));
		var _alertText = $('<p>').html('No se pueden cargar correctamente todos los contenidos de esta  página. Es muy probable que sea por tener habilitada la función de "tracking protection" del navegador. Para una mejor experiencia, se recomienda desactivarla.').addClass('text-browser-alert');
		var _alertContainer = $('<div>').append($('<div>').append(_closeButton,_alertText).addClass('text-button-container-browser-alert')).addClass('browser-alert callout').attr('data-closable','');
		$('body').prepend(_alertContainer);
		}
	})
}
DetectTrackingProtection();

