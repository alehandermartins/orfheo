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


  ns.Widgets.UserMainLargeScreen= function(profiles){
    var _createdWidget = $('<main>').addClass('pard-grid displayNone-for-mediumDown');
    
    var _aside = Pard.Widgets.LoginAside();
    var _gridSpacing = $('<div>').addClass('grid-spacing');
    var _section = Pard.Widgets.LoginSection(profiles);

    _createdWidget.append(_aside.render(), _gridSpacing, _section.render());

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.UserAside = function (myprofiles) {
    var _createdWidget = $('<nav>').addClass('grid-aside');
    var _asideContent = $('<div>').addClass('grid-aside-content');
    var _info = $('<div>').addClass('info');
    
    var _createProfileBtn =  Pard.Widgets.CreateProfile();   

    _info.append(Pard.Widgets.MyProfiles(myprofiles).render()) 
    
    _asideContent.append(_createProfileBtn.render(), _info);

    _createdWidget.append(_asideContent);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.UserSection = function (profiles) {
    var _createdWidget = $('<section>').addClass('grid-section');
    var _content = $('<div>').addClass('grid-element-content');
   
    var _searchEngine = Pard.Widgets.SearchEngine(profiles);

    _content.append(_searchEngine.render())
    _createdWidget.append(_content);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }


}(Pard || {}));
