'use strict';


(function(ns){

  ns.Widgets = ns.Widgets || {};


  ns.Widgets.UserHeader = function(){
    
    var _createdWidget = $('<header>').addClass('user-bar');
    var _topBar = $('<div>').addClass('top-bar pard-grid clearfix');
    var _container = $('<div>').addClass('pard-header-container');

    var _topContent = $('<div>').addClass('top-header-content');

    var _topBarTitle = $('<div>').addClass('left-user-header-content');
    _topBarTitle.html('<h3><strong>orfheo</strong></h3>');
   
    var _responsiveMenu = $('<div>').addClass('clearfix displayNone-for-large');

    var _elemOffCanvas = $('<span>').addClass('float-left');
    var _iconOffCanvas = $('<span>').addClass('menu-icon dark').attr({'data-toggle': 'offCanvas-navBar', 'close-on-click': true});
    _elemOffCanvas.append(_iconOffCanvas, ' Menu');

    _responsiveMenu.append(_elemOffCanvas);

    var _topBarRight = $('<div>').addClass('right-user-header-content');

    var _menu = $('<ul>').addClass('menu');
    var _logout = $('<li>').append(Pard.Widgets.Logout().render().attr('href','#'));
    var _modifyPassword = $('<li>').append(Pard.Widgets.ModifyPassword().render().attr('href','#'));
		_menu.append(_logout, _modifyPassword);
		var _menuContainer = $('<ul>').addClass('dropdown menu');
		var _iconDropdownMenu = $('<li>').append($('<a>').attr('href','#').append($('<span>').html('&#xE8B8;').addClass('material-icons')),_menu);

    _menuContainer.append(_iconDropdownMenu);
		new Foundation.DropdownMenu(_menuContainer,{disableHover:true,clickOpen:true});
    
    _topBarRight.append(_menuContainer);

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


  
  ns.Widgets.UserAside = function (profiles) {
    var myprofiles = profiles.my_profiles;
    var _createdWidget = $('<nav>').addClass('grid-aside');
    var _asideContent = $('<div>').addClass('aside-container');
    var _myprofiles = $('<div>');
    var _buttonContainer = $('<div>').addClass('create-profile-container');;
    var _createProfileBtn =  Pard.Widgets.CreateProfile().render();

    _createProfileBtn.addClass('create-profile-btn');  

    _myprofiles.append( Pard.Widgets.MyProfiles(myprofiles).render());
    _buttonContainer.append(_createProfileBtn); 
    
    _asideContent.append(_buttonContainer, _myprofiles);

    _createdWidget.append(_asideContent);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.UserSection = function (profiles, content) {

    content.empty();

    var profiles = profiles.profiles;
    var _content = content.addClass('grid-element-content');

    var _title = $('<div>').addClass('grid-section-contentTitle').html(' <h3> Explora los otros perfiles </h3>');
   
    var _searchEngine = Pard.Widgets.SearchEngine(profiles);

    _content.append(_title, _searchEngine.render())
    
    return{
      render: function(){
        return _content;
      }
    }
  }


}(Pard || {}));
