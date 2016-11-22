$.cloudinary.config({ cloud_name: 'hxgvncv7u', api_key: '844974134959653'});

var Pard = {};

var DetectBrowser = function(){
	console.log(bowser.name);
	var _compatibleBrowsers = {
		'Firefox': 38,
		'Chrome': 42,
		'Chromium': 42,
		'Internet Explorer': 11,
		// 'msedge':'11',
		'Safari': 20,
		'Opera': 39
	}
	console.log(bowser.version);
	if($(window).width()>640 && (!(_compatibleBrowsers[bowser.name]) || bowser.version < _compatibleBrowsers[bowser.name])){
		var _closeButton = $('<button>').addClass('close-button closeBtn-browser-alert').attr({'type':'button','data-close':''}).append($('<span>').html('&times;').attr('aria-hidden','true'));
		var _alertText = $('<p>').html('Se ha detectado que estás utilizando una versión de '+bowser.name+' con la cual orfheo no ha sido testado. No se excluyen problemas de incompatibilidad. </br>Para una mejor experiencia, se recomienda utilizar una versión reciente de Google Chrome o en alternativa de Mozilla Firefox.').addClass('text-browser-alert');
		var _alertContainer = $('<div>').append($('<div>').append(_closeButton,_alertText).addClass('text-button-container-browser-alert')).addClass('browser-alert callout').attr('data-closable','');
		$('body').prepend(_alertContainer);
	}
}
DetectBrowser();

var DetectTrackingProtection = function(){
	var canreach = false;
	var _alertContainer = $('<div>');
	$('body').prepend(_alertContainer);
	$.wait(
    '', 
    function(){
       $('<img/>')
	        .attr("src", "http://apps.facebook.com/favicon.ico")
	        .load(function(){
	        	canreach = true; 
	        	_alertContainer.remove()
	        })
	        .css("display", "none")
	        .appendTo($('body'));
    }, 
    function(){
      $(window).load(function(){
        setTimeout(function(){	
        	if (!(canreach)) { 	
					var _closeButton = $('<button>').addClass('close-button closeBtn-browser-alert').attr({'type':'button','data-close':''}).append($('<span>').html('&times;').attr('aria-hidden','true'));
					var _alertText = $('<p>').html('No se pueden cargar correctamente todos los contenidos de esta  página. Es muy probable que sea por tener habilitada la función de "tracking protection" del navegador. Para una mejor experiencia, se recomienda desactivarla.').addClass('text-browser-alert');
					_alertContainer.append($('<div>').append(_closeButton,_alertText).addClass('text-button-container-browser-alert')).addClass('browser-alert callout').attr('data-closable','');
				}
				},1000)
 			});
    }
  );
}
DetectTrackingProtection();

