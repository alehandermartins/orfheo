'use strict';

(function(ns){

ns.Widgets = ns.Widgets || {};

	ns.Widgets.NavLoginHeader = function(){
    var _createdWidget = $('<header>').addClass('navLoginHeader');

    var _container = $('<div>').addClass('containerNavHeader');
    var _content = $('<div>').addClass('contentNavHeader');

    var _showHide = function(id_){
    	$('.selected').removeClass('selected');
    	$('.visible').hide().removeClass('visible');
    	$('#'+id_).addClass('visible').show();
    }



    var _logo = $('<button>').append($('<div>').addClass('logoNavHeader')).attr('type','button')
    	.click(function(){
    		$('.selected').addClass('selected');
    		_showHide('welcomeSection');
    	});
    var _logoContainer = $('<div>').append(_logo).addClass('logoBtn-navHeader');

    var _signUpButtonContainer = $('<div>').append(Pard.Widgets.SignUpButton().render().addClass('signUp-welcomePage')).addClass('signUpBtn-container');
    var _loginContainer = $('<div>').addClass('loginContainer');
    var _loginInputs = $('<div>').append(Pard.Widgets.Login().render().addClass('login-container')).css({'width':'100%', 'height':'100%'});
   	
    var _loginText = $('<button>').attr({'type': 'button', 'data-toggle':'loginDropDown'}).text('Login ').addClass('loginText')
    	.click(function(){
    		if (_loginText.hasClass('clicked')) _loginText.removeClass('clicked');
    		else _loginText.addClass('clicked');
    	});
    var _loginWidget = $('<div>').append(_loginInputs).addClass('dropdown-pane container-loginNavHeader').attr({'id':'loginDropDown', 'data-dropdown':''});

    _loginContainer.append(_loginText, _loginWidget, Pard.Widgets.SignUpButton().render().addClass('signUp-welcomePage'));
   	// $(document).ready(function(){
    // var _login = new Foundation.Dropdown($('#loginDropDown'));
    // })

    // var _loginContainer = $('<div>').addClass('loginContainer');
    // var _loginInputs = $('<div>').append(Pard.Widgets.Login().render().addClass('login-container')).css({'width':'100%', 'height':'100%'});
    // var _loginWidget = $('<ul>').append(_loginInputs).addClass('container-loginNavHeader');
    // var _login = $('<ul>').addClass('dropdown menu').attr({'data-dropdown-menu':true, 'data-disable-hover':true,'data-click-open':true,  'data-close-on-click-inside':false, 'data-close-on-click':false});
    // var _loginText = $('<a>').attr({'href': '#'}).text('Login ').addClass('loginText')
    // 	.click(function(){
    // 		if (_loginText.hasClass('clicked')) _loginText.removeClass('clicked');
    // 		else _loginText.addClass('clicked');
    // 	});
    // _login.append($('<li>').append(_loginText, _loginWidget));
    // _loginContainer.append(_login, Pard.Widgets.SignUpButton().render().addClass('signUp-welcomePage'));

  	var _navMenuContainer = $('<div>').addClass('navMenuHeader-container');
  	var _navMenu = $('<ul>').addClass('navMenuHeader');
  	var _profilesBtn = $('<li>').append($('<a>').text('Perfiles').attr('href','#'))
  		.click(function(){
  			$('.selected').addClass('selected');
  			_showHide('profilesSection');
  		});
  	var _eventsBtn = $('<li>').append($('<a>').text('Eventos').attr('href','#'))
  		.click(function(){
  			$('.selected').addClass('selected');
  			_showHide('eventsSection');
  		});
  	var _newsBtn = $('<li>').append($('<a>').text('Novedades').attr('href','#'))
  		.click(function(){
  			$('.selected').addClass('selected');;
  			_showHide('newsSection');
  		});
  	_navMenuContainer.append(_navMenu.append(_profilesBtn, _eventsBtn, _newsBtn));

  	_logo.addClass('selected');
    _content.append(_logoContainer, _navMenuContainer, _loginContainer)
    _createdWidget.append(_container.append(_content));

    return {
      render : function(){
        return _createdWidget;
      }
    }
  }	

	ns.Widgets.NewLoginHeader = function(){
    var _createdWidget = $('<header>').addClass('loginHeader-AllPage full');

    var _container = $('<div>').addClass('container-header');
    var _content = $('<div>').addClass('content-loginSinUp-header');
    var _logo = $('<a>').attr({
      'href': '#'
    }).append($('<div>').addClass('logo-welcomePage'));
    var _logoBaseline = $('<div>').append($('<p>').text('your cultural community')).addClass('logoBaseline-welcomePage');
    var _signUpButtonContainer = $('<div>').append(Pard.Widgets.SignUpButton().render().addClass('signUp-welcomePage')).addClass('signUpBtn-container');
    var _loginContainer = $('<div>');
    var _loginText = $('<a>').attr({'href': '#'}).text('Login').addClass('loginText-welcomePage');
    var _loginInputs = $('<div>').append(Pard.Widgets.Login().render().addClass('login-container'));

    _loginText.click(function(){
      _loginText.remove();
      _loginContainer.append(_loginInputs);
    });
    _content.append(_logo, _logoBaseline, _signUpButtonContainer);

    var _loginWidget = $('<div>').append(_loginContainer, _loginText).addClass('container-loginHeader');

    _createdWidget.append(_container.append(_content), _loginWidget);

    return {
      render : function(){
        return _createdWidget;
      }
    }
  }

   ns.Widgets.LoginHeader = function(){
    
    var _createdWidget = $('<header>').addClass('login-bar outsider-header'
    );
    var userStatus = Pard.UserStatus['status'];
   
    var _topBar = $('<div>').addClass('top-bar pard-grid clearfix');
    var _container = $('<div>').addClass('pard-header-container');
    
    var _topBarTitle = $('<div>').addClass('block-for-medium left-bar-content')
    var _logo = $('<a>').attr({
      'href': '/'
    }).append($('<div>').addClass('logo-header'));
    _topBarTitle.append(_logo);

    if (userStatus == 'outsider') {
      var _registerBtnOut = Pard.Widgets.SignUpButton().render().attr({ id: 'register-outsider-header-button'});
      _topBarTitle.append(_registerBtnOut);
      _registerBtnOut.hide();
    }

    var _signUpButtonForSmall = Pard.Widgets.SignUpButton().render();
    _signUpButtonForSmall.addClass('signUpButtonForSmall');
    _topBarTitle.append(_signUpButtonForSmall)
   
    var _responsiveMenu = $('<div>').addClass('clearfix displayNone-for-large');

    var _elemResponsive = $('<span>').addClass('float-right').attr({'data-responsive-toggle':'responsive-menu', 'data-hide-for': 'medium'}); 
    var _iconLogin = $('<span>').addClass('menu-icon dark').css('margin-right','0.3rem');
    // _iconLogin.attr('data-toggle','');
    _elemResponsive.append($('<span>').append(_iconLogin,'Entra').attr('data-toggle','')).css('cursor','pointer');


    var _elemOffCanvas = $('<span>').addClass('menu-icon-header');
    var _iconOffCanvas = $('<span>').addClass('menu-icon dark');
    _elemOffCanvas.append(_iconOffCanvas, ' Descubre maś').attr({'data-toggle': 'offCanvas-navBar', 'close-on-click': true}).css('cursor','pointer');
    _elemOffCanvas.click(function(){$('.whole-container').scrollTop(0);});

    _responsiveMenu.append(_elemResponsive, _elemOffCanvas);

    var _menuLogin = $('<div>').attr('id','responsive-menu');
    var _topBarRight = $('<div>').addClass('top-bar-right menu right-bar-content');
    var _inputLogin = Pard.Widgets.Login().render();
    
    _topBarRight.append(_inputLogin);
    _menuLogin.append(_topBarRight);

    _container.append(_topBarTitle, _responsiveMenu, _menuLogin);
    _topBar.append(_container);
    _createdWidget.append(_topBar);

    return {
      render: function(){
        return _createdWidget;
      },
      showRegisterBtn: function(){
        _registerBtnOut.show();
      } 
    }
  }

}(Pard || {}));