$.cloudinary.config({ cloud_name: 'hxgvncv7u', api_key: '844974134959653'});

var Pard = {};

var DetectBrowser = function(){
	console.log(bowser);
	var _compatibleBrowsers = {
		firefox: '38',
		chrome: '42',
		chromium: '42',
		msie:'11',
		msedge:'11',
		safari: '9'
	}
	if($(window).width()>640 && (!(_compatibleBrowsers[bowser.name.toLowerCase()]) || bowser.version <_compatibleBrowsers[bowser.name.toLowerCase()])){
		var _closeButton = $('<button>').addClass('close-button closeBtn-browser-alert').attr({'type':'button','data-close':''}).append($('<span>').html('&times;').attr('aria-hidden','true'));
		var _alertText = $('<p>').html('Se ha detectado que estás utilizando una versión de '+bowser.name+' con la cual orfheo no ha sido testeado. No se excluyen problemas de incompatibilidad. </br>Para una mejor experiencia, se recomienda utilizar una versión reciente de Google Chrome o de Mozilla Firefox.').addClass('text-browser-alert');
		var _alerContainer = $('<div>').append($('<div>').append(_closeButton,_alertText).addClass('text-button-container-browser-alert')).addClass('browser-alert callout').attr('data-closable','');
		$('body').append(_alerContainer);
	}
}
DetectBrowser();


