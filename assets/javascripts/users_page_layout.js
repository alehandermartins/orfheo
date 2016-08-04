'use strict';


(function(ns){

  ns.Widgets = ns.Widgets || {};

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
    _elemOffCanvas.click(function(){$('.whole-container').scrollTop(0);});

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


  ns.Widgets.UserDropdownMenu = function(){     

    var _menu = $('<ul>').addClass('menu');

    var _logout = $('<li>').append(Pard.Widgets.Logout().render().attr('href','#'));

    var _modifyPassword = $('<li>').append(Pard.Widgets.ModifyPassword().render().attr('href','#'));

    var _dCaller = $('<a>').attr('href','#').text('Elimina mi cuenta');
    var _deleteCaller = Pard.Widgets.PopupCreator(_dCaller, '¿Estás seguro/a?', function(){return Pard.Widgets.DeleteUserMessage()});
    var _deleteUser = $('<li>').append(_deleteCaller.render());

		_menu.append(_deleteUser, _modifyPassword,  _logout);
		var _menuContainer = $('<ul>').addClass('dropdown menu').attr({'data-dropdown-menu':true, 'data-disable-hover':true,'data-click-open':true});
		var _iconDropdownMenu = $('<li>').append(
      $('<a>').attr('href','#').append(
        $('<span>').html('&#xE8B8;').addClass('material-icons settings-icon-dropdown-menu')
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
          callback()
        });
      }
    }
  }
  
  ns.Widgets.UserAside = function (sectionContainer) {

    var _createdWidget = $('<div>').addClass('aside-container');
    
    var _profiles = $('<div>').addClass('aside-user-nav-btn');
    _profiles.text('Tus perfiles');

    _profiles.click(function(){
      _contentShowHide('myprofiles-user-page');
      $(this).addClass('aside-user-nav-btn-selected');
    });
    var _myProfiles = $('<div>').attr('id', 'myprofiles-user-page').addClass('profiles-user-section-content');
    _myProfiles.append(Pard.Widgets.MyProfilesUserPage().render());
    var _contentShown = _myProfiles;
    _profiles.addClass('aside-user-nav-btn-selected');

    var _explore = $('<div>').addClass('aside-user-nav-btn');
    _explore.text('Explora');
    _explore.click(function(){
      _contentShowHide('explore-user-page');
      $(this).addClass('aside-user-nav-btn-selected');
    });
    _explore.one('click', function(){
    _exploreContent.append(Pard.Widgets.ExploreUserPage().render());      
    });
    var _exploreContent = $('<div>').attr('id', 'explore-user-page').addClass('profiles-user-section-content');
    _exploreContent.hide();

    var _news = $('<div>').addClass('aside-user-nav-btn');
    _news.text('Novedades');
    _news.click(function(){
      _contentShowHide('news-user-page');
      $(this).addClass('aside-user-nav-btn-selected');
    });
    _news.one('click', function(){
    _newsContent.append(Pard.Widgets.NewsUserPage().render());      
    });
    var _newsContent = $('<div>').attr('id', 'news-user-page');
    _newsContent.hide();


    var _contentShowHide = function(id_selected){
      $('.aside-user-nav-btn-selected').removeClass('aside-user-nav-btn-selected');
      _contentShown.hide();
      // var _selected = '#'+id_selected;
      _contentShown = $('#'+id_selected);
      _contentShown.show();

    }

    var _buttonContainer = $('<div>').addClass('create-profile-container');
    
    _buttonContainer.append(_profiles, _explore, _news);
    sectionContainer.append(_myProfiles, _exploreContent, _newsContent);
    _createdWidget.append(_buttonContainer);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.MyProfilesUserPage = function(){
    var _createdWidget = $('<div>').addClass('search-results').css('margin-top','0');

    var _myprofiles = Pard.CachedProfiles;

    if (_myprofiles.length > 0){
      _myprofiles.forEach(function(profile){
        var _profileContainer = $('<div>').addClass('card-container position-profileCard-login');
        _createdWidget.append(_profileContainer.append(Pard.Widgets.CreateCard(profile).render()));
      })
    }

    var _createProfileCardContainer = Pard.Widgets.CreateProfileCard();

    _createdWidget.append(_createProfileCardContainer.render().addClass('card-container').css('vertical-align','top'));

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ExploreUserPage = function(){

    var _createdWidget = $('<div>');
   
    var _searchEngine = Pard.Widgets.SearchEngine('main-welcome-page').render();

    var _searchTitle = $('<div>').addClass('orfheo-symbol-image-searchEngine');

    _createdWidget.append(_searchTitle, _searchEngine);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.NewsUserPage = function(){

    var _createdWidget = $('<div>');

    var _newsConFusionContainer = Pard.Widgets.ConFusionEndCall('16-06-2016');

    var _newsOrfheoContainer = Pard.Widgets.OrfheoFirstMessage('15-06-2016');

    _createdWidget.append(_newsConFusionContainer.render(), _newsOrfheoContainer.render());

    return{
      render: function(){
        return _createdWidget;
      }
    } 
  }  



  ns.Widgets.UserSection = function(content) {

    var _content = content.addClass('user-grid-element-content');
    
    return{
      render: function(){
        return _content;
      }
    }
  }


}(Pard || {}));
