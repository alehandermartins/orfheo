'use strict';

(function(ns){

ns.Widgets = ns.Widgets || {};

	ns.Widgets.NavLoginHeader = function(){
    var _createdWidget = $('<header>').addClass('navLoginHeader');

    var _container = $('<div>').addClass('containerNavHeader');
    var _content = $('<div>').addClass('contentNavHeader');

    var _showHide = function(id_){
    	$('.visible').hide().removeClass('visible');
    	$('#'+id_).addClass('visible').show();
    }

    var _logo = $('<a>').append($('<div>').addClass('logoNavHeader')).attr('href','#')
    	.click(function(){
    		$('.selected').removeClass('selected');
    		_showHide('welcomeSection');
        if (_profilesSection) _profilesSection.deactivate();
    	});
    var _logoContainer = $('<div>').append(_logo).addClass('logoBtn-navHeader');

    var _rightContainer = $('<div>');
    if (Pard.UserStatus['status'] == 'outsider'){
      _rightContainer.addClass('loginContainer')
      var _loginInputs = $('<div>').append(Pard.Widgets.Login().render().addClass('login-container')).css({'width':'100%', 'height':'100%'});
     	
      var _loginText = $('<button>').attr({'type': 'button', 'data-toggle':'loginDropDown'}).text('Login ').addClass('loginText')
      	.click(function(){
      		if (_loginText.hasClass('clicked')) _loginText.removeClass('clicked');
      		else _loginText.addClass('clicked');
      	});

      var _loginWidget = $('<div>').append(_loginInputs).addClass('dropdown-pane container-loginNavHeader').attr({'id':'loginDropDown', 'data-dropdown':''});

      _rightContainer.append(_loginText, _loginWidget, Pard.Widgets.SignUpButton().render().addClass('signUp-welcomePage'));  
    }
    else if (Pard.UserStatus['status'] == 'owner'){
      _rightContainer.addClass('settingsContainer')
      var _settingsDropdown = Pard.Widgets.UserDropdownMenu().render()
        .addClass('settings-blackHeader')
      _rightContainer.append(_settingsDropdown);
    }

  	var _navMenuContainer = $('<div>').addClass('navMenuHeader-container');
  	var _navMenu = $('<ul>').addClass('navMenuHeader');
  	var _profilesSection;
    var _profilesBtn = $('<li>').append($('<a>').text('Perfiles').attr('href','#'))
      .one('click', function(){
        _profilesSection = Pard.Widgets.ProfilesWelcomeSection();
        $('#profilesSection').append(_profilesSection.render());
      })
  		.click(function(){
  			$('.selected').removeClass('selected');
  			_profilesBtn.addClass('selected');
  			_showHide('profilesSection');
        _profilesSection.activate();
  		});
  	var _eventsBtn = $('<li>').append($('<a>').text('Eventos').attr('href','#'))
      .one('click', function(){
        $('#eventsSection').append(Pard.Widgets.EventsWelcomeSection().render());
      })
  		.click(function(){
  			$('.selected').removeClass('selected');
  			_eventsBtn.addClass('selected');
  			_showHide('eventsSection');
        if (_profilesSection) _profilesSection.deactivate();
  		});
  	var _newsBtn = $('<li>').append($('<a>').text('Novedades').attr('href','#'))
     .one('click', function(){
        $('#newsSection').append(Pard.Widgets.NewsWelcomeSection().render());
      })
  		.click(function(){
  			$('.selected').removeClass('selected');
  			_newsBtn.addClass('selected');
  			_showHide('newsSection');
        if (_profilesSection) _profilesSection.deactivate();
  		});
  	_navMenuContainer.append(_navMenu.append(_profilesBtn, _eventsBtn, _newsBtn));

  	_logo.addClass('selected');
    _content.append(_logoContainer, _navMenuContainer, _rightContainer)
    _createdWidget.append(_container.append(_content));

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
    _elemOffCanvas.click(function(){$(window).scrollTop(0);});

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
