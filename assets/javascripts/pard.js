$.cloudinary.config({ cloud_name: 'hxgvncv7u', api_key: '844974134959653'});

var Pard = {}
Pard.UserInfo = {}

String.prototype.capitalize = function() {
  return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}

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
		var _alertText = $('<p>').html(Pard.t.text('browserTests.version', {browser: bowser.name})).addClass('text-browser-alert');
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
					var _alertText = $('<p>').html(Pard.t.text('browserTests.tracking')).addClass('text-browser-alert');
					_alertContainer.append($('<div>').append(_closeButton,_alertText).addClass('text-button-container-browser-alert')).addClass('browser-alert callout').attr('data-closable','');
				}
				},1000)
 			});
    }
  );
}

var Options = function(){
  var localStorageKey = 'orfheo'
  // var defaultLang = navigator.language || navigator.userLanguage
  // if (!($.inArray(defaultLang, ['es','en']))) defaultLang = 'es'
  var defaultLang = 'es'

  if (!localStorage[localStorageKey]){
    localStorage[localStorageKey] = JSON.stringify({
      language: defaultLang, 
      cookies: false, 
      register: {}
    })
  }
  var orfheoStorage = JSON.parse(localStorage[localStorageKey])

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
      Pard.Backend.modifyLang(lang, function(){
        orfheoStorage.language = lang
        localStorage[localStorageKey] = JSON.stringify(orfheoStorage)
        location.reload()
      })
    },
    storeLanguage: function(lang){
      orfheoStorage.language = lang
      localStorage[localStorageKey] = JSON.stringify(orfheoStorage)
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
    console.log(Pard.Options.language());
  	if(cookies == false){
  		var _closeButton = $('<button>').addClass('close-button closeBtn-coockies-callout').attr({'type':'button','data-close':''}).append($('<span>').html(Pard.t.text('dictionary.accept').capitalize()).attr('aria-hidden','true'))
      _closeButton.on('click', function(){
      	Pard.Options.setCookies()
      })
      var _cookiesPolicy = $('<a>').attr('href','#/')
      	.text(Pard.t.text('cookiesPolicy.title'))
      	.click(function(){
      	Pard.Widgets.BigAlert(Pard.t.text('cookiesPolicy.title'), Pard.Widgets.CoockiesPolicy())
      })
      var _alertText = $('<p>').append(Pard.t.text('cookiesPolicy.mex'), _cookiesPolicy,'.').addClass('text-browser-alert')
      _alertContainer.append($('<div>').append(_closeButton,_alertText).addClass('text-button-container-browser-alert')).addClass('coockies-callout').attr('data-closable','')
  	}
  })
}
DetectTrackingProtection();
CookieAlert();