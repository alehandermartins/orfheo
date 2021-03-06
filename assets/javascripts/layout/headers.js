'use strict';

(function(ns){

ns.Widgets = ns.Widgets || {};

  ns.Widgets.NavHeader = function(){

    var _createdWidget = $('<header>').addClass('orfheoHeader').addClass('page-section').attr('id','i');
    var _innerHeaderContainer = $('<div>').addClass('innerWrapperDiv');
    var _upperContainer = $('<div>').addClass('upperContainerHeader fixed'); 
    var _upperContent = $('<div>').addClass('pard-grid contentHeader');
    var _lowerContainer = $('<div>').addClass('navBarHeader');
    var _navBarContainer = $('<div>').addClass('navBarContainer black');
    var _navBar = $('<div>').addClass('pard-grid');

    var _uri = new URI(document.location);
    
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
    var _welcomeBtnText = $('<a>').attr('href','#')
    var _welcomeBtn = $('<li>')
      .append(_welcomeBtnText)
      .click(function(){
        $(window).scrollTop(0); 
        $('.selected').removeClass('selected');
        _welcomeBtn.addClass('selected');
        _showHide('welcomeSection');
        if (_profilesSection) _profilesSection.deactivate();
        $('#scroll-indicator-bullets').show();
      });
      // .addClass('selected');
    var _profilesSection;
    var _profilesBtn = $('<li>').attr('id','profilesBtn')
      .append($('<a>').text(Pard.t.text('header.profiles')).attr({'href':'#profiles'}))
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
        $('#scroll-indicator-bullets').hide();
      });
      // .css('width','52px');
    var _eventsBtn = $('<li>').attr('id','eventsBtn')
      .append($('<a>').text(Pard.t.text('header.events')).attr('href','#events'))
      .one('click', function(){
        $('#eventsSection').append(Pard.Widgets.EventsWelcomeSection().render());
      })
      .click(function(){
        $('.selected').removeClass('selected');
        $(window).scrollTop(0); 
        $('.selected').removeClass('selected');
        _eventsBtn.addClass('selected');
        _showHide('eventsSection');
        if (_profilesSection) _profilesSection.deactivate();
        $('#scroll-indicator-bullets').hide();
      });
      // .css('width','58px');
    var _newsBtn = $('<li>').attr('id','newsBtn')
      .append($('<a>').text(Pard.t.text('header.news')).attr('href','#news'))
     .one('click', function(){
        $('#newsSection').append(Pard.Widgets.NewsWelcomeSection().render());
      })
      .click(function(){
        $('.selected').removeClass('selected');
        _newsBtn.addClass('selected');
        _showHide('newsSection');
        if (_profilesSection) _profilesSection.deactivate();
        $('#scroll-indicator-bullets').hide();
      });
      // .css('width','79px');
    _navMenuContainer.append(_navMenu.append(_welcomeBtn, _profilesBtn, _eventsBtn, _newsBtn));

    var _callBtn = $('<div>')
      .append($('<a>').attr('href','/services').append(Pard.Widgets.IconManager('open_call').render().css('margin-right','.5rem'),Pard.t.text('header.callToAction')))
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
      _welcomeBtn.one('click',function(){
        $('#welcomeSection').append(Pard.Widgets.WelcomeSection());
        $(document).ready(function(){
          $('.page-section').scrollIndicatorBullets();
        });   
      })
      _welcomeBtnText.text('Welcome');
      _rightContainer.addClass('loginContainer');
      var _loginInputs = $('<div>')
        .append(Pard.Widgets.Login().render().addClass('login-container'))
        .css({'width':'100%', 'height':'100%'});
      var _loginText = $('<button>')
        .attr({'type': 'button', 'data-toggle':'loginDropDown'})
        .text('Login')
        .addClass('loginText')
        .append(Pard.Widgets.IconManager('arrowDropDown').render().addClass('arrowLoginDropdown'));
      var _loginWidget = $('<div>')
        .append(_loginInputs)
        .addClass('dropdown-pane container-loginNavHeader')
        .attr({'id':'loginDropDown', 'data-dropdown':'', 'data-close-on-click':true});
      _rightContainer.append(_loginText, _loginWidget, Pard.Widgets.SignUpButton().render().addClass('signUpHeader-welcomePage')); 
      _upperContent.append( _callBtn)
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
          .text(Pard.t.text('header.home'))
        )
        .addClass('initText');
      var _settingsDropdown = $('<li>')
        .append(Pard.Widgets.InsideDropdownMenu(true).render()
          .addClass('settings-blackHeader')
        );
      _rightContainer.append(_rightMenu.append(_init, _settingsDropdown)).addClass('rightContent-insideNavMenu');
    }

    _upperContent.append(_rightContainer);

    var _arraySections = ['#profiles','#events','#news'];

    if ($.inArray(_uri.hash(), _arraySections)>-1){
      $(document).ready(function(){
        $(_uri.hash()+'Btn').trigger('click');
      })
    }
    else{
      $(document).ready(function(){
        _welcomeBtn.trigger('click');
      })
    }

    return {
      render : function(){
        return _createdWidget;
      }
    }
  }

  
  ns.Widgets.LoginHeader = function(elementOffCanvas){

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
    var _loginText = $('<button>')
      .attr({'type': 'button', 'data-toggle':'loginDropDown'})
      .text('Login').addClass('loginText')
      .append(
        Pard.Widgets.IconManager('arrowDropDown').render().addClass('arrowLoginDropdown')
      );
    var _loginWidget = $('<div>').append(_loginInputs)
      .addClass('dropdown-pane container-loginNavHeader').attr({'id':'loginDropDown', 'data-dropdown':'', 'data-close-on-click':true});
    _rightContainer.append(
      _loginText, 
      _loginWidget, 
      Pard.Widgets.SignUpButton().render().addClass('signUpHeader-welcomePage')
    );  
    
    var _semicircleTopContainer =  $('<div>').addClass('semiCircleHeaderTop-container fixed');

    _upperContent.append( _logoContainer );
     if (elementOffCanvas)  _upperContent.append(_responsiveMenu);
     _upperContent.append(_rightContainer);
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

  ns.Widgets.InsideHeader = function(elementOffCanvas){
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
        .text(Pard.t.text('header.home'))
      )
      .addClass('initText');
    var _menuDropdown = Pard.Widgets.InsideDropdownMenu();
    Pard.Bus.on('reloadMenuHeaderDropdown', function(){
      _menuDropdown.reload();
    });
    var _settingsDropdown = $('<li>')
      .append(_menuDropdown.render());
    _rightContainer.append(_rightMenu.append(_init, _settingsDropdown)).addClass('rightContent-insideNavMenu');  
    
    var _semicircleTopContainer =  $('<div>').addClass('semiCircleHeaderTop-container semicirclePositionRelative');

    _upperContent.append(_logoContainer);
    if (elementOffCanvas)  _upperContent.append(_responsiveMenu)
    _upperContent.append(_rightContainer);
  
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

    var _eventManagerChoice = {};
    var _contactChoice = $('<div>');

    $(document).on('show.zf.dropdown', function() {
      _iconDropdownMenu.addClass('iconDropdown-clicked');
    });
    $(document).on('hide.zf.dropdown', function(){
      _iconDropdownMenu.removeClass('iconDropdown-clicked');
      for(var id in _eventManagerChoice){
        _eventManagerChoice[id].removeClass('showEventManagerChoice');
      }
      _contactChoice.removeClass('showEventManagerChoice');
    });

    var _createdWidget = $('<div>');       

    var _menuContainer = $('<div>').addClass('dropdown-pane container-insideMenu').attr({'id':'insideMenuDropDown', 'data-close-on-click':true, 'data-dropdown':''});  
    var _menu = $('<ul>').addClass('dropdownHeaderMenu');

    var _menuProfiles = $('<ul>').addClass('dropdownMenu menuProfiles');
    var _menuEvents = $('<ul>').addClass('dropdownMenu menuEvents');
    var _menuSettings = $('<ul>').addClass('dropdownMenu menuSettings')
    var _liProfiles = $('<li>');
    var _liEvents = $('<li>');

    var _logout = $('<li>').append(Pard.Widgets.Logout().render().attr('href','#/'));
    var _modifyCaller = Pard.Widgets.ModifyPassword().render()
      .attr('href','#/')
      .click(function(){
        _menuContainer.foundation('close');
      });
    var _modifyPassword = $('<li>').append(_modifyCaller);
    var _contact = $('<li>').append(
      $('<a>')
        .attr('href','#/')
        .append(Pard.t.text('header.insideDropdown.contact'))
        .hover(
          function(){
            _contactChoice.addClass('showEventManagerChoice');
          },
          function(){
            setTimeout(function(){
              if (!(_contactChoice.hasClass('isOver'))) _contactChoice.removeClass('showEventManagerChoice');
            },200)
            
          }
        )
        .click(function(){
           if (!(_contactChoice.hasClass('showEventManagerChoice'))) _contactChoice.addClass('showEventManagerChoice');
           else _contactChoice.removeClass('showEventManagerChoice');
        })
        .css('cursor','default'),
      _contactChoice
    )

    _contactChoice
      .addClass('eventMananagerChoice')
      .append(
        $('<ul>').append(
        $('<li>').append($('<a>').text('Facebook').attr({'href':'https://www.facebook.com/orfheo.org', 'target':'_blank'}))
        .click( function(){
          _contactChoice.removeClass('showEventManagerChoice');
          _menuContainer.foundation('close');
        }),
        $('<li>').append(
        $('<a>').text('Email').attr('href','#/'))
        .click( function(){
          var _contactPopup = Pard.Widgets.Popup();
          _contactPopup.setContent(Pard.t.text('contact.contactUs.title'), Pard.Widgets.ContactOrfheo());
          _contactPopup.setCallback(function(){
            setTimeout(function(){
              _contactPopup.destroy();
            }, 500);
          });
          _contactPopup.open();
          _contactChoice.removeClass('showEventManagerChoice');
          _menuContainer.foundation('close');
        })
      ))
      .hover(
        function(){
          _contactChoice.addClass('isOver');
        },
        function () {
          _contactChoice.removeClass('isOver showEventManagerChoice')
        }
      );    

    if (user){
      var _deleteUserPopup;
      var _deleteUserMex = Pard.Widgets.DeleteUserMessage();
      var _deleteCaller = $('<a>').attr('href','#/').text(Pard.t.text('header.insideDropdown.delete'))
        .one('click', function(){
          _deleteUserPopup = Pard.Widgets.Popup();
          _deleteUserMex.setCallback(function(){_deleteUserPopup.close()});
          _deleteUserPopup.setContent(Pard.t.text('popup.delete.title'),_deleteUserMex.render());
        })
        .click(function(){
          _menuContainer.foundation('close');
          _deleteUserPopup.open();
        });
      var _deleteUser = $('<li>').append(_deleteCaller).appendTo(_menuSettings);
    }

    _menuSettings.append(_modifyPassword, _contact,  _logout);

    var _loadProfielsEvents = function(){
      Pard.Backend.header(function(data){
        var _profileList = ''
        if(data.status == 'success'){
          data.profiles.forEach(function(profile){
            _profileList += profile.name+', '
            var _circle = $('<div>').addClass('circleProfile-MenuHeader').css('background',profile.color);
            var _profileNameTetx =  profile.name
            if (_profileNameTetx.length >28) _profileNameTetx = _profileNameTetx.substring(0,26) + '...'
            var _profileName = $('<span>').text(_profileNameTetx);
            _menuProfiles.append(
              $('<li>').append($('<a>').append(_circle, _profileName).attr('href','/profile?id='+profile.profile_id)))
              .click( function(){
                  _menuContainer.foundation('close');
                }
              )
          });
          _profileList = _profileList.substring(0, _profileList.length - 2);
          Pard.UserInfo['userProfiles'] = _profileList;
          var _profilesSeparator = $('<li>').addClass('separatorBold');
          _menuProfiles.append(_profilesSeparator);
          if(data.profiles.length>0) _liProfiles.show();
          else _liProfiles.hide();
          data.events.forEach(function(event){
            // console.log(event)
            // var _img = $.cloudinary.image(event['img'], { format: 'jpg', width: 15, height: 20, crop: 'fill', effect: 'saturation:50' });
            var en = event.name;
            if (en.length>28) en = en.substring(0,26) + '...';
            var _eventName = $('<span>').text(en)
              .css({
                'border-left':'2px solid '+ event.color,
                'padding-left':'1rem'
              });
            var _callIcon = Pard.Widgets.IconManager('open_call').render().addClass('callIcon');
            var _toolIcon = Pard.Widgets.IconManager('tools').render().addClass('toolsIcon');  
            var _manageCallIcon = $('<span>').append(_callIcon, _toolIcon).addClass('manageCallIcon');
            _eventManagerChoice[event.event_id] = $('<div>')
              .addClass('eventMananagerChoice')
              .append(
                $('<ul>').append(
                $('<li>').append($('<a>').append(Pard.Widgets.IconManager('proposals').render().addClass('eventIcon'), Pard.t.text('header.insideDropdown.event')).attr('href','/event?id='+event.event_id))
                .click( function(){
                    _eventManagerChoice[event.event_id].removeClass('showEventManagerChoice');
                    _menuContainer.foundation('close');
                  }
                ),
                $('<li>').append($('<a>').append(_manageCallIcon, 'Manager').attr('href','/event_manager?id='+event.event_id))
                .click( function(){
                    _eventManagerChoice[event.event_id].removeClass('showEventManagerChoice');
                    _menuContainer.foundation('close');
                  }
                )
              ))
              .hover(
                function(){
                  _eventManagerChoice[event.event_id].addClass('isOver');
                },
                function () {
                  _eventManagerChoice[event.event_id].removeClass('isOver showEventManagerChoice')
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
                        _eventManagerChoice[event.event_id].addClass('showEventManagerChoice');
                      },
                      function(){
                        setTimeout(function(){
                          if (!(_eventManagerChoice[event.event_id].hasClass('isOver'))) _eventManagerChoice[event.event_id].removeClass('showEventManagerChoice');
                        },50)
                        
                      }
                    )
                    .click(function(){
                       if (!(_eventManagerChoice[event.event_id].hasClass('showEventManagerChoice'))) _eventManagerChoice[event.event_id].addClass('showEventManagerChoice');
                       else _eventManagerChoice[event.event_id].removeClass('showEventManagerChoice');
                    })
                    .css('cursor','default'),
                  _eventManagerChoice[event.event_id]
                )  
            )
          });
          
          if(data.events.length>0){
            _profilesSeparator.removeClass('separatorBold').addClass('separator')
            _menuEvents.append($('<li>').addClass('separatorBold'));
            _liEvents.show();
          }
          else _liEvents.hide();
        }
        else{
          console.log('error')
        }
      });
    }

    _loadProfielsEvents();

    _menuContainer.append(_menu.append(
      _liProfiles.append(_menuProfiles),
      _liEvents.append(_menuEvents),
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
      },
      reload: function(){
        _menuProfiles.empty();
        _menuEvents.empty();
        _eventManagerChoice = {};
        _loadProfielsEvents();
      }
    }
  }


}(Pard || {}));
