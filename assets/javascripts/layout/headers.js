'use strict';

(function(ns){

ns.Widgets = ns.Widgets || {};

	ns.Widgets.NavHeader = function(){
    var _createdWidget = $('<header>').addClass('orfheoHeader black fixed');

    var _container = $('<div>').addClass('pard-grid');
    var _content = $('<div>').addClass('contentHeader');

    var _showHide = function(id_){
    	$('.visible').hide().removeClass('visible');
    	$('#'+id_).addClass('visible').show();
    }

    var _logo = $('<a>').append($('<div>').addClass('logo-header')).attr('href','#')
    	.click(function(){
    		$('.selected').removeClass('selected');
    		_showHide('welcomeSection');
        // _init.addClass('selected');
        if (_profilesSection) _profilesSection.deactivate();
    	});
    var _logoContainer = $('<div>').append(_logo).addClass('logoBtn-navHeader');

    var _rightContainer = $('<div>');
    if (Pard.UserStatus['status'] == 'outsider'){
      _rightContainer.addClass('loginContainer')
      var _loginInputs = $('<div>').append(Pard.Widgets.Login().render().addClass('login-container')).css({'width':'100%', 'height':'100%'});
     	
      var _loginText = $('<button>').attr({'type': 'button', 'data-toggle':'loginDropDown'}).text('Login ').addClass('loginText')
      	.click(function(){
      		if (_loginText.hasClass('iconDropdown-clicked')) _loginText.removeClass('iconDropdown-clicked');
      		else _loginText.addClass('iconDropdown-clicked');
      	});

      var _loginWidget = $('<div>').append(_loginInputs).addClass('dropdown-pane container-loginNavHeader').attr({'id':'loginDropDown', 'data-dropdown':''});

      _rightContainer.append(_loginText, _loginWidget, Pard.Widgets.SignUpButton().render().addClass('signUp-welcomePage'));  
    }
    else if (Pard.UserStatus['status'] == 'owner'){
      var _rightMenu = $('<ul>').addClass('rightMenu-navHeader');
      var _init = $('<li>')
        .append($('<a>').attr('href','#')
          .text('Inicio')
          .click(function(){
            $('.selected').removeClass('selected');
            _init.addClass('selected');
            _showHide('welcomeSection');
            if (_profilesSection) _profilesSection.deactivate();
          })
        )
        .addClass('initText');
      var _settingsDropdown = $('<li>').addClass('settingsContainer')
        .append(Pard.Widgets.UserDropdownMenu().render()
          .addClass('settings-blackHeader')
        );
      _rightContainer.append(_rightMenu.append(_init, _settingsDropdown)).addClass('rightContent-insideNavMenu');
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

  // ns.Widgets.InnerHeader = function(){
  //   var _createdWidget = $('<header>').addClass('orfheoHeader');

  //   var _container = $('<div>').addClass('pard-grid');
  //   var _content = $('<div>').addClass('contentHeader');

  //   var _logo = $('<a>').append($('<div>').addClass('logoNavHeader')).attr('href','#')
  //     .click(function(){
  //       location.href = /users/;
  //     });
  //   var _logoContainer = $('<div>').append(_logo).addClass('logoBtn-navHeader');

  //   var _rightContainer = $('<div>');
  //   if (Pard.UserStatus['status'] == 'outsider'){
  //     _rightContainer.addClass('loginContainer')
  //     var _loginInputs = $('<div>').append(Pard.Widgets.Login().render().addClass('login-container')).css({'width':'100%', 'height':'100%'});
      
  //     var _loginText = $('<button>').attr({'type': 'button', 'data-toggle':'loginDropDown'}).text('Login ').addClass('loginText')
  //       .click(function(){
  //         if (_loginText.hasClass('iconDropdown-clicked')) _loginText.removeClass('iconDropdown-clicked');
  //         else _loginText.addClass('iconDropdown-clicked');
  //       });

  //     var _loginWidget = $('<div>').append(_loginInputs).addClass('dropdown-pane container-loginNavHeader').attr({'id':'loginDropDown', 'data-dropdown':''});

  //     _rightContainer.append(_loginText, _loginWidget, Pard.Widgets.SignUpButton().render().addClass('signUp-welcomePage'));  
  //   }
  //   else {
  //     var _rightMenu = $('<ul>').addClass('rightMenu-navHeader');
  //     var _init = $('<li>')
  //       .append($('<a>').attr('href','#')
  //         .text('Inicio')
  //         .click(function(){
  //           location.href = /users/;
  //         })
  //       )
  //       .addClass('initText');
  //     var _settingsDropdown = $('<li>').addClass('settingsContainer')
  //       .append(Pard.Widgets.UserDropdownMenu().render()
  //         .addClass('settings-blackHeader')
  //       );
  //     _rightContainer.append(_rightMenu.append(_init, _settingsDropdown)).addClass('rightContent-insideNavMenu');
  //   }

  //   _logo.addClass('selected');
  //   _content.append(_logoContainer, _rightContainer)
  //   _createdWidget.append(_container.append(_content));

  //   return {
  //     render : function(){
  //       return _createdWidget;
  //     }
  //   }
  // } 	


  ns.Widgets.LoginHeader = function(){
    
    var _createdWidget = $('<header>').addClass('orfheoHeader fixed');

    var userStatus = Pard.UserStatus['status'];
   
    var _topBar = $('<div>').addClass('pard-grid  clearfix');
    var _container = $('<div>').addClass('contentHeader');
    
    var _topBarTitle = $('<div>').addClass('block-for-medium left-bar-content')
    var _logo = $('<a>').attr({
      'href': '/'
    }).append($('<div>').addClass('logo-header'));
     var _logoContainer = $('<div>').append(_logo).addClass('logoBtn-navHeader');
    _topBarTitle.append(_logoContainer);
   
    var _responsiveMenu = $('<div>').addClass('clearfix displayNone-for-large');

    var _elemOffCanvas = $('<span>').addClass('menu-icon-header');
    var _iconOffCanvas = $('<span>').addClass('menu-icon dark');
    _elemOffCanvas.append(_iconOffCanvas, ' Descubre maś').attr({'data-toggle': 'offCanvas-navBar', 'close-on-click': true}).css('cursor','pointer');
    _elemOffCanvas.click(function(){$(window).scrollTop(0);});

    _responsiveMenu.append(_elemOffCanvas);

    var _menuLogin = $('<div>').attr('id','responsive-menu');
    var _topBarRight = $('<div>').addClass('top-bar-right menu right-bar-content');

    var _rightContainer = $('<div>');
    _rightContainer.addClass('loginContainer');
    var _loginInputs = $('<div>').append(Pard.Widgets.Login().render().addClass('login-container')).css({'width':'100%', 'height':'100%'});
    
    var _loginText = $('<button>').attr({'type': 'button', 'data-toggle':'loginDropDown'}).text('Login').addClass('loginText')
      .click(function(){
        if (_loginText.hasClass('iconDropdown-clicked')) _loginText.removeClass('iconDropdown-clicked');
        else _loginText.addClass('iconDropdown-clicked');
      });
    var _loginWidget = $('<div>').append(_loginInputs).addClass('dropdown-pane container-loginNavHeader').attr({'id':'loginDropDown', 'data-dropdown':''});
    _rightContainer.append(_loginText, _loginWidget, Pard.Widgets.SignUpButton().render().addClass('signUp-welcomePage'));  
        
    _topBarRight.append(_rightContainer);
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



  ns.Widgets.InsideHeader = function(menuContainer){
    var _createdWidget = $('<header>').addClass('user-bar');
    var _topBar = $('<div>').addClass('top-bar pard-grid clearfix');
    var _container = $('<div>').addClass('pard-header-container');

    var _topContent = $('<div>').addClass('top-header-content');

    var _topBarTitle = $('<div>').addClass('left-user-header-content');
    var _logo = $('<a>').attr({
      'href': '/'
    }).append($('<div>').addClass('logo-header inside-header-logo'));
    _topBarTitle.append(_logo);
    _logo.click(function(){
      location.href = /users/;
    });
   
    var _responsiveMenu = $('<div>').addClass('clearfix displayNone-for-large');

    var _elemOffCanvas = $('<span>').addClass('menu-icon-header');
    var _iconOffCanvas = $('<span>').addClass('menu-icon dark');
    _elemOffCanvas.append(_iconOffCanvas, ' Menu').attr({'data-toggle': 'offCanvas-navBar', 'close-on-click': true}).css('cursor','pointer');
    _elemOffCanvas.click(function(){$(window).scrollTop(0);});

    _responsiveMenu.append(_elemOffCanvas);

    var _topBarRight = $('<div>').addClass('right-user-header-content');

    _topBarRight.append(menuContainer);

    _topContent.append(_topBarTitle, _topBarRight);

    _container.append(_topContent, _responsiveMenu);
    _topBar.append(_container);
    _createdWidget.append(_topBar);

    return {
      render: function(){
        return _createdWidget;
      } 
    }
  }


}(Pard || {}));
