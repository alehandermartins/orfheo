'use strict';


(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.InsideHeader = function(menuContainer){
    var _createdWidget = $('<header>').addClass('user-bar');
    var _topBar = $('<div>').addClass('top-bar pard-grid clearfix');
    var _container = $('<div>').addClass('pard-header-container');

    var _topContent = $('<div>').addClass('top-header-content');

    var _topBarTitle = $('<div>').addClass('left-user-header-content');
    var _logo = $('<div>').addClass('logo-header inside-header-logo');
    _topBarTitle.append(_logo);
    _logo.click(function(){
      location.href = /users/;
    });
   
    var _responsiveMenu = $('<div>').addClass('clearfix displayNone-for-large');

    var _elemOffCanvas = $('<span>').addClass('menu-icon-header');
    var _iconOffCanvas = $('<span>').addClass('menu-icon dark').attr({'data-toggle': 'offCanvas-navBar', 'close-on-click': true});
    _elemOffCanvas.append(_iconOffCanvas, ' Menu');

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
  
  ns.Widgets.UserAside = function () {
    var myprofiles = Pard.CachedProfiles;
    var myCalls = Pard.CachedCalls;

    var _createdWidget = $('<div>').addClass('aside-container');
    var _myprofiles = $('<div>');

    var _buttonContainer = $('<div>').addClass('create-profile-container');

    var _createProfileText = $('<p>').text('Crea un perfil').addClass('create-profile-text')
    var _createArtistBtn =  Pard.Widgets.CreateTypeProfile('artist').render();
    var _createSpaceBtn =  Pard.Widgets.CreateTypeProfile('space').render();
    var _createOrganizationBtn = Pard.Widgets.CreateTypeProfile('organization').render();

    _createArtistBtn.addClass('create-profile-btn');
    _createSpaceBtn.addClass('create-profile-btn');
    _createOrganizationBtn.addClass('create-profile-btn');  


    _buttonContainer.append(_createProfileText,_createArtistBtn, _createSpaceBtn); 
    

    _createdWidget.append(_buttonContainer);

    if (myprofiles.length > 0){
      var _myProfileText = $('<p>').text('Tus perfiles').addClass('myProfile-text');
      _myprofiles.append(Pard.Widgets.MyProfiles(myprofiles).render());
      _createdWidget.append(_myProfileText,_myprofiles);
    }

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.UserSection = function(content) {

    content.empty();

    var profiles = Pard.CachedProfiles['profiles'];
    var _content = content.addClass('grid-element-content user-section-content  ');

    var _title = $('<div>').addClass('grid-section-contentTitle').html(' <h4> Explora los otros perfiles </h4>');
   
    var _searchEngine = Pard.Widgets.SearchEngine('');

    _content.append(_title, _searchEngine.render());
    
    return{
      render: function(){
        return _content;
      }
    }
  }


}(Pard || {}));
