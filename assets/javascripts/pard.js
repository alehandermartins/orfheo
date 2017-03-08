$.cloudinary.config({ cloud_name: 'hxgvncv7u', api_key: '844974134959653'});

var Pard = {}
Pard.UserInfo = {}

var DetectBrowser = function(){
	var _compatibleBrowsers = {
		'Firefox': 38,
		'Chrome': 42,
		'Chromium': 42,
		'Internet Explorer': 11,
		'Safari': 9,
		'Opera': 39
	}
	console.log(bowser.name + ' ' + bowser.version);
	Pard.UserInfo['browser'] = bowser.name + ' ' + bowser.version;
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

var Options = function(){
  var localStorageKey = 'orfheo'

  var defaultLang = navigator.language || navigator.userLanguage
  defaultLang = defaultLang.substring(0,2)
  if (!($.inArray(defaultLang, ['es','ca','it','en']))) defaultLang = 'es'

  // var defaultLang = 'es'

  if (!localStorage[localStorageKey]){
    localStorage[localStorageKey] = JSON.stringify({
      language: defaultLang, 
      cookies: false, 
      register: {}
    })
  }
  var orfheoStorage = JSON.parse(localStorage[localStorageKey])
  Pard.UserInfo['lang'] = orfheoStorage.language

  return {
    register: function(){
      return orfheoStorage.register
    },
    setRegister: function(info){
      orfheoStorage.register = info
      localStorage[localStorageKey] = JSON.stringify(orfheoStorage)
    },
    language: function(){
      return orfheoStorage.language
    },
    setLanguage: function(lang){
      orfheoStorage.language = lang
      localStorage[localStorageKey] = JSON.stringify(orfheoStorage)
      location.reload()
    },
    cookies: function(){
    	return orfheoStorage.cookies
    },
    setCookies: function(){
    	orfheoStorage.cookies = true
      localStorage[localStorageKey] = JSON.stringify(orfheoStorage)
    }
  }
}

Pard.Options = Options();

var CookieAlert = function(){

  var _alertContainer = $('<div>')
  $('body').prepend(_alertContainer)
  
  $(window).load(function(){

  	var cookies = Pard.Options.cookies()
  	if(cookies == false){
  		var _closeButton = $('<button>').addClass('close-button closeBtn-coockies-callout').attr({'type':'button','data-close':''}).append($('<span>').html('Acepta').attr('aria-hidden','true'))
      _closeButton.on('click', function(){
      	Pard.Options.setCookies()
      })
      var _coockiesPolicy = $('<a>').attr('href','#/')
      	.text('política de cookies')
      	.click(function(){
      	Pard.Widgets.BigAlert('Política de cookies', Pard.Widgets.CoockiesPolicy())
      })
      var _alertText = $('<p>').append('Para mejorar tu experiencia de navegación, orfheo almacena información en tu navegador en forma de pequeños elementos de texto llamados cookies. </br>Si aceptas o sigues navegando significa que estás de acuerdo con este aviso. Para más información puedes leer nuestra ', _coockiesPolicy,'.').addClass('text-browser-alert')
      _alertContainer.append($('<div>').append(_closeButton,_alertText).addClass('text-button-container-browser-alert')).addClass('coockies-callout').attr('data-closable','')
  	}
  })
}
DetectTrackingProtection();
CookieAlert();

String.prototype.capitalize = function() {
  return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};
