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

  	var _navMenuContainer = $('<div>').addClass('navMenuHeader-container');
  	var _navMenu = $('<ul>').addClass('navMenuHeader');
  	var _profilesSection;
    var _profilesBtn = $('<li>').append($('<button>').text('Perfiles').attr('type','button'))
      .one('click', function(){
        _profilesSection = Pard.Widgets.ProfilesWelcomeSection();
        $('#profilesSection').append(_profilesSection.render());
      })
  		.click(function(){
        $(window).scrollTop(0); 
  			$('.selected').removeClass('selected');
  			_profilesBtn.addClass('selected');
  			_showHide('profilesSection');
        _profilesSection.activate();
  		});
      // .css('width','52px');
  	var _eventsBtn = $('<li>').append($('<button>').text('Eventos').attr('type','button'))
      .one('click', function(){
        $('#eventsSection').append(Pard.Widgets.EventsWelcomeSection().render());
      })
  		.click(function(){
        $(window).scrollTop(0); 
  			$('.selected').removeClass('selected');
  			_eventsBtn.addClass('selected');
  			_showHide('eventsSection');
        if (_profilesSection) _profilesSection.deactivate();
  		});
      // .css('width','58px');
  	var _newsBtn = $('<li>').append($('<button>').text('Novedades').attr('type','button'))
     .one('click', function(){
        $('#newsSection').append(Pard.Widgets.NewsWelcomeSection().render());
      })
  		.click(function(){
        $(window).scrollTop(0); 
  			$('.selected').removeClass('selected');
  			_newsBtn.addClass('selected');
  			_showHide('newsSection');
        if (_profilesSection) _profilesSection.deactivate();
  		});
      // .css('width','79px');
  	_navMenuContainer.append(_navMenu.append(_profilesBtn, _eventsBtn, _newsBtn));

    var _callBtn = $('<button>').attr('type','button')
      .text('Lanza tu convocatoria')
      .addClass('makeCallBtn')

  	_logo.addClass('selected');
    _content.append(_logoContainer, _navMenuContainer);
    _createdWidget.append(_container.append(_content));

    if (Pard.UserStatus['status'] == 'outsider'){
      _rightContainer.addClass('loginContainer')
      var _loginInputs = $('<div>').append(Pard.Widgets.Login().render().addClass('login-container')).css({'width':'100%', 'height':'100%'});
      var _loginText = $('<button>').attr({'type': 'button', 'data-toggle':'loginDropDown'}).text('Login').addClass('loginText')
        .append(Pard.Widgets.IconManager('arrowDropDown').render().addClass('arrowLoginDropdown'));
      var _loginWidget = $('<div>').append(_loginInputs).addClass('dropdown-pane container-loginNavHeader').attr({'id':'loginDropDown', 'data-dropdown':'', 'data-close-on-click':true});
      _rightContainer.append(_loginText, _loginWidget, Pard.Widgets.SignUpButton().render().addClass('signUpHeader-welcomePage')); 
      _content.append( _callBtn)
      $(document).on('show.zf.dropdown', function() {
        _loginText.addClass('iconDropdown-clicked');
      });
      $(document).on('hide.zf.dropdown', function(){
        _loginText.removeClass('iconDropdown-clicked');
      });
    }
    else if (Pard.UserStatus['status'] == 'owner'){
      var _rightMenu = $('<ul>').addClass('rightMenu-navHeader');
      var _init = $('<li>')
        .append($('<a>').attr('href','/')
          .text('Inicio')
          // .click(function(){
          //   $('.selected').removeClass('selected');
          //   _init.addClass('selected');
          //   _showHide('welcomeSection');
          //   if (_profilesSection) _profilesSection.deactivate();
          // })
        )
        .addClass('initText');
      var _settingsDropdown = $('<li>')
        .append(Pard.Widgets.UserDropdownMenu().render()
          .addClass('settings-blackHeader')
        );
      _rightContainer.append(_rightMenu.append(_init, _settingsDropdown)).addClass('rightContent-insideNavMenu');
    }

    _content.append(_rightContainer);


    return {
      render : function(){
        return _createdWidget;
      }
    }
  }

  
  ns.Widgets.LoginHeader = function(){

    $(document).on('show.zf.dropdown', function() {
      _loginText.addClass('iconDropdown-clicked');
    });
    $(document).on('hide.zf.dropdown', function(){
      _loginText.removeClass('iconDropdown-clicked');
    });
    
    var _createdWidget = $('<header>').addClass('orfheoHeader fixed');

    var userStatus = Pard.UserStatus['status'];
   
    var _topBar = $('<div>').addClass('pard-grid  clearfix');
    var _container = $('<div>').addClass('contentHeader');
    
    var _topBarTitle = $('<div>')
    var _logo = $('<a>').attr({
      'href': '/'
    }).append($('<div>').addClass('logo-header'));
     var _logoContainer = $('<div>').append(_logo).addClass('logoBtn-navHeader');
    _topBarTitle.append(_logoContainer);
   
    var _responsiveMenu = $('<span>').addClass('clearfix displayNone-for-large');

    var _elemOffCanvas = $('<span>').addClass('menu-icon-header');
    var _iconOffCanvas = $('<span>').addClass('menu-icon dark');
    _elemOffCanvas.append(_iconOffCanvas).attr({'data-toggle': 'offCanvas-navBar', 'close-on-click': true}).css('cursor','pointer');
    _elemOffCanvas.click(function(){$(window).scrollTop(0);});

    _responsiveMenu.append(_elemOffCanvas);

    var _rightContainer = $('<div>');
    _rightContainer.addClass('loginContainer');
    var _loginInputs = $('<div>').append(Pard.Widgets.Login().render().addClass('login-container')).css({'width':'100%', 'height':'100%'});
    
    var _loginText = $('<button>').attr({'type': 'button', 'data-toggle':'loginDropDown'}).text('Login').addClass('loginText')
      .append(Pard.Widgets.IconManager('arrowDropDown').render().addClass('arrowLoginDropdown'));

    var _loginWidget = $('<div>').append(_loginInputs).addClass('dropdown-pane container-loginNavHeader').attr({'id':'loginDropDown', 'data-dropdown':'', 'data-close-on-click':true});
    _rightContainer.append(_loginText, _loginWidget, Pard.Widgets.SignUpButton().render().addClass('signUpHeader-welcomePage'));  
        
    _container.append(_topBarTitle, _responsiveMenu, _rightContainer);
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



  ns.Widgets.InsideHeader = function(){
    var _createdWidget = $('<header>').addClass('orfheoHeader');

    var userStatus = Pard.UserStatus['status'];
   
    var _topBar = $('<div>').addClass('pard-grid  clearfix');
    var _container = $('<div>').addClass('contentHeader');
    
    var _topBarTitle = $('<div>')
    var _logo = $('<a>').attr({
      'href': '/'
    }).append($('<div>').addClass('logo-header'));
     var _logoContainer = $('<div>').append(_logo).addClass('logoBtn-navHeader');
    _topBarTitle.append(_logoContainer);
   
    var _responsiveMenu = $('<div>').addClass('clearfix displayNone-for-large');

    var _elemOffCanvas = $('<span>').addClass('menu-icon-header');
    var _iconOffCanvas = $('<span>').addClass('menu-icon dark');
    _elemOffCanvas.append(_iconOffCanvas).attr({'data-toggle': 'offCanvas-navBar', 'close-on-click': true}).css('cursor','pointer');
    _elemOffCanvas.click(function(){$(window).scrollTop(0);});

    _responsiveMenu.append(_elemOffCanvas);

    var _rightContainer = $('<div>');
    var _rightMenu = $('<ul>').addClass('rightMenu-navHeader');
    var _init = $('<li>')
      .append($('<a>').attr('href','/')
        .text('Inicio')
        .click(function(){
          $('.selected').removeClass('selected');
          _init.addClass('selected');
          _showHide('welcomeSection');
          if (_profilesSection) _profilesSection.deactivate();
        })
      )
      .addClass('initText');
    var _settingsDropdown = $('<li>')
      .append(Pard.Widgets.ProfileDropdownMenu().render());
    _rightContainer.append(_rightMenu.append(_init, _settingsDropdown)).addClass('rightContent-insideNavMenu');

    _container.append(_topBarTitle, _responsiveMenu, _rightContainer);
    _topBar.append(_container);
    _createdWidget.append(_topBar);

    return {
      render: function(){
        return _createdWidget;
      } 
    }
  }


}(Pard || {}));
