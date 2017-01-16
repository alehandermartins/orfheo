'use strict';


(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.UserInitSection = function(){
    var _section = $('<section>').addClass('welcomeSection-layout');
    var _myProfileDiv = $('<div>') .addClass('myprofileDiv');
    var _myprofileOuterCont = $('<div>').addClass('outerContainer-UserPage');
    // var _myprofileInnerCont = $('<div>').addClass('innerContainer-UserPage');
    var _myProfileContent = $('<div>').addClass('myProfilesContainer');
    var _myprofiles = Pard.CachedProfiles;
    if (_myprofiles.length > 0){
      _myprofiles.forEach(function(profile){
        var _cardContainer = $('<div>').addClass('card-container-WelcomePage');
        var _card = Pard.Widgets.CreateCard(profile).render();
        _card.css({
          // 'box-shadow': '0px 1px 3px 0px rgba(255, 255, 255,1)',
          'border':'1px solid rgba(255, 255, 255)'
        });
        _card.off('mouseenter mouseleave')
          .hover(
            function(){
              _card.css({
                'box-shadow': 'rgb(255, 255, 255) 0px 0px 6px 3px'
              });
            },
            function(){
              _card.css({
                'box-shadow':''
              });
            }
          );
        _myProfileContent.append(_cardContainer.append(_card.addClass('position-profileCard-login')));
      })
    }
    var _createProfileCard = Pard.Widgets.CreateProfileCard().render();
    _createProfileCard.off('mouseenter mouseleave')
     .hover(
          function(){
            _createProfileCard.css({
              'box-shadow': 'rgb(255, 255, 255) 0px 0px 3px 1px'
            });
          },
          function(){
            _createProfileCard.css({
              'box-shadow':''
            });
          }
        )
    _myProfileContent.append($('<div>').append(_createProfileCard).addClass('createProfileCard-userPage'));
    if (_myprofiles.length<5){
      _myprofileOuterCont.css({
        'padding-top': '-moz-calc((100vh - 250px - 60px)/2)',
        'padding-top': '-webkit-calc((100vh - 250px - 60px)/2))',
        'padding-top':'calc((100vh - 250px - 60px)/2)',
        'padding-bottom': '-moz-calc((100vh - 250px - 60px)/2)',
        'padding-bottom': '-webkit-calc((100vh - 250px - 60px)/2))',
        'padding-bottom':'calc((100vh - 250px - 60px)/2)'
      });
    }
    else if (_myprofiles.length<10){
      _myprofileOuterCont.css({
        'padding-top': '-moz-calc((100vh - 516px - 60px)/2)',
        'padding-top': '-webkit-calc((100vh - 516px - 60px)/2))',
        'padding-top':'calc((100vh - 516px - 60px)/2)',
        'padding-bottom': '-moz-calc((100vh - 516px - 60px)/2)',
        'padding-bottom': '-webkit-calc((100vh - 516px - 60px)/2))',
        'padding-bottom':'calc((100vh - 516px - 60px)/2)'
      });
    }
    _myProfileDiv.append(_myprofileOuterCont.append(_myProfileContent));

    var _littleTextDiv= $('<div>')
      .append(
        $('<div>').append(
          Pard.Widgets.Button('lanza una convocatoria en orfheo').render()
        ).addClass('welcomeSection-container')
      )
      .addClass('littleTextDiv');

    _section.append(_myProfileDiv, _littleTextDiv);

    return _section;

  }
  

  ns.Widgets.UserDropdownMenu = function(){     

    var _menu = $('<ul>').addClass('menu');

    var _logout = $('<li>').append(Pard.Widgets.Logout().render().attr('href','#/'));

    var _modifyPassword = $('<li>').append(Pard.Widgets.ModifyPassword().render().attr('href','#/'));

    var _deleteUserPopup;
    var _deleteUserMex = Pard.Widgets.DeleteUserMessage();
    var _deleteCaller = $('<a>').attr('href','#/').text('Elimina mi cuenta')
      .one('click', function(){
        _deleteUserPopup = Pard.Widgets.Popup();
        _deleteUserMex.setCallback(function(){_deleteUserPopup.close()});
        _deleteUserPopup.setContent('¿Estás seguro/a?',_deleteUserMex.render());
      })
      .click(function(){
        _deleteUserPopup.open();
      });
    var _deleteUser = $('<li>').append(_deleteCaller);

		_menu.append(_deleteUser, _modifyPassword,  _logout);
		var _menuContainer = $('<ul>').addClass('dropdown menu').attr({'data-dropdown-menu':true, 'data-disable-hover':true,'data-click-open':true});
		var _iconDropdownMenu = $('<li>').append(
      $('<a>').attr('href','#/').addClass('dropdownIconContainer')
        .append(
          $('<span>').html('&#xE5C5;').addClass('material-icons settings-icon-dropdown-menu')
        )
      ,_menu
    );

    _menuContainer.append(_iconDropdownMenu);

  	return {
  		render: function(){
  			return _menuContainer;
  		} 
  	}
  }


  ns.Widgets.DeleteUserMessage = function(){  
    
    var _createdWidget = $('<div>');
    var _message = $('<p>').text('Confirmando, todos tus datos serán eliminados de orfheo: se cancelarán todos tus perfiles y sus contenidos. Con ello, todas tus inscripciones en convocatorias serán borradas.');
    var _yesBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn confirm-delete-btn').text('Confirma');
    var _noBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn cancel-delete-btn').text('Anula');

    _yesBtn.click(function(){
      Pard.Backend.deleteUser(Pard.Events.DeleteUser);
    });

    var _buttonsContainer = $('<div>').addClass('yes-no-button-container');

    _createdWidget.append(_message,  _buttonsContainer.append(_noBtn, _yesBtn));

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _noBtn.click(function(){
          callback();
        });
        _yesBtn.click(function(){
          callback();
        });
      }
    }
  }
  

  ns.Widgets.UserEvents = function(){
    var _createdWidget = $('<div>');
    var _myProfilesId = Pard.CachedProfiles.map(function(profile){
      return profile.profile_id
    });
    Pard.Backend.events(function(data){   
      var events = data.events;
      events.forEach(function(event){
        var _myEvent = ($.inArray(event.profile_id, _myProfilesId))>-1;
        var _eventCardContainer = $('<div>').append($('<div>').append(Pard.Widgets.EventCard(event, _myEvent)).addClass('eventCard-container-userPage')).addClass('outer-eventCard-container-userPage');
        _createdWidget.prepend(_eventCardContainer);
      })
    });

    return{
      render: function(){
        return _createdWidget;
      }
    } 
  }


}(Pard || {}));
