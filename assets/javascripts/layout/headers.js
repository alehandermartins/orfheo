'use strict';

(function(ns){

ns.Widgets = ns.Widgets || {};

  ns.Widgets.NavHeader = function(){

    var _createdWidget = $('<header>').addClass('orfheoHeader');
    var _innerHeaderContainer = $('<div>').addClass('innerWrapperDiv');
    var _upperContainer = $('<div>').addClass('upperContainerHeader fixed'); 
    var _upperContent = $('<div>').addClass('pard-grid contentHeader');
    var _lowerContainer = $('<div>').addClass('navBarHeader');
    var _navBarContainer = $('<div>').addClass('navBarContainer black');
    var _navBar = $('<div>').addClass('pard-grid');    

    var _showHide = function(id_){
      if (_lowerContainer.hasClass('fixedNavBar')){
        _lowerContainer.removeClass('fixedNavBar');
        $('main').css('margin-top','-1.5rem');
        _lowerContainer.css('display','block');
        _arrowUp.hide();
      }
      $('.visible').hide().removeClass('visible');
      $('#'+id_).addClass('visible').show();
    }

    $(window).scroll(function(){
      if($(window).scrollTop() == 0 && _lowerContainer.hasClass('fixedNavBar')){
        _lowerContainer.removeClass('fixedNavBar');
        $('main').css('margin-top','-1.5rem');
        _lowerContainer.css('display','block');
        _arrowUp.hide();
      }
    })

    var _semicircleTop = $('<div>').addClass('semiCircleHeaderTop');
    var _semicircleBottom = $('<div>').addClass('semiCircleHeaderBottom');

    var _arrowDown = $('<button>')
      .attr('type','button')
      .append(Pard.Widgets.IconManager('arrow_down').render())
      .addClass('showNavMenu-header')
      .click(function(){
        _lowerContainer.addClass('fixedNavBar');
        $('main').css('margin-top','4.5rem');
        _lowerContainer.css('display','none');
        _lowerContainer.slideDown(200);
        _arrowUp.show();
      });
    var _arrowUp = $('<button>')
      .attr('type','button')
      .append(Pard.Widgets.IconManager('arrow_up').render())
      .addClass('hideNavMenu-header')
      .click(function(){
        _lowerContainer.slideUp(200, function(){
          _lowerContainer.removeClass('fixedNavBar');
          $('main').css('margin-top','-1.5rem');
          _lowerContainer.css('display','block');
          _arrowUp.hide();
        });
      })
      .hide();
    var _logo = $('<a>').append($('<div>').addClass('logo-header')).attr('href','/');
    var _logoContainer = $('<div>').append(_logo).addClass('logoBtn-navHeader');

    var _rightContainer = $('<div>');

    var _navMenuContainer = $('<div>').addClass('navMenuHeader-container');
    var _navMenu = $('<ul>').addClass('navMenuHeader');
    var _welcomeBtnText = $('<button>').attr('type','button')
    var _welcomeBtn = $('<li>')
      .append(_welcomeBtnText)
      .click(function(){
        $(window).scrollTop(0); 
        $('.selected').removeClass('selected');
        _welcomeBtn.addClass('selected');
        _showHide('welcomeSection');
        if (_profilesSection) _profilesSection.deactivate();
      })
      .addClass('selected');
    var _profilesSection;
    var _profilesBtn = $('<li>')
      .append($('<button>').text('Perfiles').attr('type','button'))
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
    var _eventsBtn = $('<li>')
      .append($('<button>').text('Eventos').attr('type','button'))
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
    var _newsBtn = $('<li>')
      .append($('<button>').text('Novedades').attr('type','button'))
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
    _navMenuContainer.append(_navMenu.append(_welcomeBtn, _profilesBtn, _eventsBtn, _newsBtn));

    var _callBtn = $('<div>')
      .append($('<a>').attr('href','/services').text('Lanza tu convocatoria'))
      .addClass('makeCallBtn');

    var _semicircleBottomContainer =  $('<div>').addClass('semiCircleHeaderBottom-container');
    var _semicircleTopContainer = $('<div>').addClass('semiCircleHeaderTop-container fixed'); 

    _navBarContainer.append(_navBar)
    _upperContent.append(_logoContainer);
    _navBar.append(_navMenuContainer);
    _innerHeaderContainer.append(
      _upperContainer.append(
        $('<div>').append(_upperContent).addClass('black').css('height','3rem')
      ),
      _semicircleTopContainer.append(_semicircleTop, _arrowDown),
      _lowerContainer.append(
        _navBarContainer,
        _semicircleBottomContainer.append(_semicircleBottom, _arrowUp)
      )
    );

    _createdWidget.append(_innerHeaderContainer);

    if (Pard.UserStatus['status'] == 'outsider'){
      _welcomeBtnText.text('Welcome');
      _rightContainer.addClass('loginContainer');
      var _loginInputs = $('<div>').append(Pard.Widgets.Login().render().addClass('login-container')).css({'width':'100%', 'height':'100%'});
      var _loginText = $('<button>').attr({'type': 'button', 'data-toggle':'loginDropDown'}).text('Login').addClass('loginText')
        .append(Pard.Widgets.IconManager('arrowDropDown').render().addClass('arrowLoginDropdown'));
      var _loginWidget = $('<div>').append(_loginInputs).addClass('dropdown-pane container-loginNavHeader').attr({'id':'loginDropDown', 'data-dropdown':'', 'data-close-on-click':true});
      _rightContainer.append(_loginText, _loginWidget, Pard.Widgets.SignUpButton().render().addClass('signUpHeader-welcomePage')); 
      // _upperContent.append( _callBtn)
      $(document).on('show.zf.dropdown', function() {
        _loginText.addClass('iconDropdown-clicked');
      });
      $(document).on('hide.zf.dropdown', function(){
        _loginText.removeClass('iconDropdown-clicked');
      });
    }
    else if (Pard.UserStatus['status'] == 'owner'){
      _welcomeBtnText.text('Myhome');
      var _rightMenu = $('<ul>').addClass('rightMenu-navHeader');
      var _init = $('<li>')
        .append($('<a>').attr('href','/')
          .text('Inicio')
        )
        .addClass('initText');
      var _settingsDropdown = $('<li>')
        .append(Pard.Widgets.InsideDropdownMenu(true).render()
          .addClass('settings-blackHeader')
        );
      _rightContainer.append(_rightMenu.append(_init, _settingsDropdown)).addClass('rightContent-insideNavMenu');
    }

    _upperContent.append(_rightContainer);


    return {
      render : function(){
        return _createdWidget;
      }
    }
  }

  
  ns.Widgets.LoginHeader = function(){

    $(document).on('show.zf.dropdown', function() {
      _loginText.addClass('iconDropdown-clicked');
      $('header').css('overflow','visible');
    });
    $(document).on('hide.zf.dropdown', function(){
      _loginText.removeClass('iconDropdown-clicked');
      $('header').css('overflow','hidden');
    });   

    var _createdWidget = $('<header>').addClass('orfheoHeader');
    var _innerHeaderContainer = $('<div>').addClass('innerWrapperDiv');
    var _upperContainer = $('<div>').addClass('upperContainerHeader black fixed'); 
    var _upperContent = $('<div>').addClass('pard-grid contentHeader');  

    var _semicircleTop = $('<div>').addClass('semiCircleHeaderTop');
    var _logo = $('<a>').append($('<div>').addClass('logo-header')).attr('href','/');
    var _logoContainer = $('<div>').append(_logo).addClass('logoBtn-navHeader');

    var _responsiveMenu = $('<span>').addClass('clearfix displayNone-for-large');
    var _elemOffCanvas = $('<span>').addClass('menu-icon-header');
    var _iconOffCanvas = $('<span>').addClass('menu-icon');
    _elemOffCanvas.append(_iconOffCanvas).attr({'data-toggle': 'offCanvas-navBar', 'close-on-click': true}).css('cursor','pointer');
    _elemOffCanvas.click(function(){$(window).scrollTop(0);});
    _responsiveMenu.append(_elemOffCanvas);

    var _rightContainer = $('<div>');
    _rightContainer.addClass('loginContainer');
    var _loginInputs = $('<div>').append(Pard.Widgets.Login().render().addClass('login-container')).css({'width':'100%', 'height':'100%'});
    var _loginText = $('<button>').attr({'type': 'button', 'data-toggle':'loginDropDown'}).text('Login').addClass('loginText')
      .append(Pard.Widgets.IconManager('arrowDropDown').render().addClass('arrowLoginDropdown'));
    var _loginWidget = $('<div>').append(_loginInputs)
      .addClass('dropdown-pane container-loginNavHeader').attr({'id':'loginDropDown', 'data-dropdown':'', 'data-close-on-click':true});
    _rightContainer.append(
      _loginText, 
      _loginWidget, 
      Pard.Widgets.SignUpButton().render().addClass('signUpHeader-welcomePage')
    );  
    
    var _semicircleTopContainer =  $('<div>').addClass('semiCircleHeaderTop-container fixed');

    _upperContent.append(
      _logoContainer, 
      _responsiveMenu, 
      _rightContainer
    );
    _innerHeaderContainer.append(
      _upperContainer.append(_upperContent),
      _semicircleTopContainer.append(_semicircleTop)
    );
    _createdWidget.append(_innerHeaderContainer);

    return {
      render: function(){
        return _createdWidget;
      },
      positionRelative: function(){
        _upperContainer.removeClass('fixed');
        _semicircleTopContainer.removeClass('fixed').addClass('semicirclePositionRelative');
      }
    }
  }

  ns.Widgets.InsideHeader = function(){
    $(document).on('show.zf.dropdown', function() {
      _settingsDropdown.addClass('iconDropdown-clicked');
      $('header').css('overflow','visible');
    });
    $(document).on('hide.zf.dropdown', function(){
      _settingsDropdown.removeClass('iconDropdown-clicked');
      $('header').css('overflow','hidden');
    });   

    var _createdWidget = $('<header>').addClass('orfheoHeader');
    var _innerHeaderContainer = $('<div>').addClass('innerWrapperDiv');
    var _upperContainer = $('<div>').addClass('upperContainerHeader black'); 
    var _upperContent = $('<div>').addClass('pard-grid contentHeader');  

    var _semicircleTop = $('<div>').addClass('semiCircleHeaderTop');
    var _logo = $('<a>').append($('<div>').addClass('logo-header')).attr('href','/');
    var _logoContainer = $('<div>').append(_logo).addClass('logoBtn-navHeader');

    var _responsiveMenu = $('<span>').addClass('clearfix displayNone-for-large');
    var _elemOffCanvas = $('<span>').addClass('menu-icon-header');
    var _iconOffCanvas = $('<span>').addClass('menu-icon');
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
      .append(Pard.Widgets.InsideDropdownMenu().render());
    _rightContainer.append(_rightMenu.append(_init, _settingsDropdown)).addClass('rightContent-insideNavMenu');  
    
    var _semicircleTopContainer =  $('<div>').addClass('semiCircleHeaderTop-container semicirclePositionRelative');

    _upperContent.append(
      _logoContainer, 
      _responsiveMenu, 
      _rightContainer
    );
    _innerHeaderContainer.append(
      _upperContainer.append(_upperContent),
      _semicircleTopContainer.append(_semicircleTop)
    );
    _createdWidget.append(_innerHeaderContainer);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.InsideDropdownMenu = function(user){   

    $(document).on('show.zf.dropdown', function() {
      _iconDropdownMenu.addClass('iconDropdown-clicked');
    });
    $(document).on('hide.zf.dropdown', function(){
      _iconDropdownMenu.removeClass('iconDropdown-clicked');
      _eventManagerChoice.removeClass('showEventManagerChoice');
    });

    var _createdWidget = $('<div>');       

    var _menuContainer = $('<div>').addClass('dropdown-pane container-insideMenu').attr({'id':'insideMenuDropDown', 'data-close-on-click':true, 'data-dropdown':''});  
    var _menu = $('<ul>').addClass('dropdownHeaderMenu');

    var _menuProfiles = $('<ul>').addClass('dropdownMenu menuProfiles');
    var _menuEvents = $('<ul>').addClass('dropdownMenu menuEvents');
    var _menuSettings = $('<ul>').addClass('dropdownMenu menuSettings')
 
    var _logout = $('<li>').append(Pard.Widgets.Logout().render().attr('href','#/'));

    var _modifyCaller = Pard.Widgets.ModifyPassword().render()
      .attr('href','#/')
      .click(function(){
        _menuContainer.foundation('close');
      });
    var _modifyPassword = $('<li>').append(_modifyCaller);

    if (user){
      var _deleteUserPopup;
      var _deleteUserMex = Pard.Widgets.DeleteUserMessage();
      var _deleteCaller = $('<a>').attr('href','#/').text('Elimina mi cuenta')
        .one('click', function(){
          _deleteUserPopup = Pard.Widgets.Popup();
          _deleteUserMex.setCallback(function(){_deleteUserPopup.close()});
          _deleteUserPopup.setContent('¿Estás seguro/a?',_deleteUserMex.render());
        })
        .click(function(){
          _menuContainer.foundation('close');
          _deleteUserPopup.open();
        });
      var _deleteUser = $('<li>').append(_deleteCaller).appendTo(_menuSettings);
    }

    _menuSettings .append(_modifyPassword,  _logout);

    var _eventManagerChoice = $('<div>').addClass('eventMananagerChoice');

    Pard.Backend.header(function(data){
      if(data.status == 'success'){
        data.profiles.forEach(function(profile){
          var _circle = $('<div>').addClass('circleProfile-MenuHeader').css('background',profile.color);
          var _profileName = $('<span>').text(profile.name);
          _menuProfiles.append(
            $('<li>').append($('<a>').append(_circle, _profileName).attr('href','/profile?id='+profile.profile_id)))
            .click( function(){
                _menuContainer.foundation('close');
              }
            )
        });
        _menuProfiles.append($('<li>').addClass('separator'));
        data.events.forEach(function(event){
          // console.log(event)
          // var _img = $.cloudinary.image(event['img'], { format: 'jpg', width: 15, height: 20, crop: 'fill', effect: 'saturation:50' });
          var en = event.name;
          if (en.length>29) en = en.substring(0,27) + '...';
          var _eventName = $('<span>').text(en)
            .css({
              'border-left':'2px solid '+ event.color,
              'padding-left':'1rem'
            });
          var _callIcon = Pard.Widgets.IconManager('open_call').render().addClass('callIcon');
          var _toolIcon = Pard.Widgets.IconManager('tools').render().addClass('toolsIcon');  
          var _manageCallIcon = $('<span>').append(_callIcon, _toolIcon).addClass('manageCallIcon');
          _eventManagerChoice
            .append(
              $('<ul>').append(
              $('<li>').append($('<a>').append(Pard.Widgets.IconManager('proposals').render().addClass('eventIcon'), 'Evento').attr('href','/event?id='+event.event_id))
              .click( function(){
                  _eventManagerChoice.removeClass('showEventManagerChoice');
                  _menuContainer.foundation('close');
                }
              ),
              $('<li>').append($('<a>').append(_manageCallIcon, 'Manager').attr('href','/event_manager?id='+event.event_id))
              .click( function(){
                  _eventManagerChoice.removeClass('showEventManagerChoice');
                  _menuContainer.foundation('close');
                }
              )
            ))
            .hover(
              function(){
                _eventManagerChoice.addClass('isOver');
              },
              function () {
                _eventManagerChoice.removeClass('isOver showEventManagerChoice')
              }
            );
          _menuEvents.append(
            $('<li>').addClass("")
              .append(
                $('<a>')
                  .attr('href','#/')
                  .append(_eventName)
                  .hover(
                    function(){
                      _eventManagerChoice.addClass('showEventManagerChoice');
                    },
                    function(){
                      setTimeout(function(){
                        if (!(_eventManagerChoice.hasClass('isOver'))) _eventManagerChoice.removeClass('showEventManagerChoice');
                      },200)
                      
                    }
                  )
                  .click(function(){
                     if (!(_eventManagerChoice.hasClass('showEventManagerChoice'))) _eventManagerChoice.addClass('showEventManagerChoice');
                     else _eventManagerChoice.removeClass('showEventManagerChoice');
                  })
                  .css('cursor','default'),
                _eventManagerChoice
              )  
          )
        });
        _menuEvents.append($('<li>').addClass('separator'));
      }
      else{
        console.log('error')
      }
    });

    _menuContainer.append(_menu.append(
      $('<li>').append(_menuProfiles),
      $('<li>').append(_menuEvents),
      $('<li>').append(_menuSettings)
    ));

    var _iconDropdownMenu =  $('<button>')
      .addClass('settings-icon-dropdown-menu')
      .attr({'type': 'button', 'data-toggle':'insideMenuDropDown'})
      .append($('<span>').html('&#xE5C5;').addClass('material-icons'));

    _createdWidget.append(_iconDropdownMenu, _menuContainer);

    return {
      render: function(){
        return _createdWidget;
      } 
    }
  }


}(Pard || {}));
