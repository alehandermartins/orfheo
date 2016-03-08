(function(ns){

  ns.Widgets = ns.Widgets || {};


  ns.Widgets.UserHeader = function(){
    
    var _createdWidget = $('<header>').addClass('user-bar');
    var _topBar = $('<div>').addClass('top-bar pard-grid clearfix');
    var _container = $('<div>').addClass('pard-container-relative');

    var _topContent = $('<div>').addClass('top-header-content');

    var _topBarTitle = $('<div>').addClass('left-user-header-content');
    _topBarTitle.html('<h3><strong>orfheo</strong></h3>');
   
    var _responsiveMenu = $('<div>').addClass('clearfix displayNone-for-large');

    // var _elemResponsive = $('<span>').addClass('float-right').attr({'data-responsive-toggle':'responsive-menu', 'data-hide-for': 'large'}); 
    
    // var _iconLogin = $('<span>').addClass('menu-icon dark');
    // _iconLogin.attr('data-toggle','');
    // _elemResponsive.append(_iconLogin,' Log In');

    var _elemOffCanvas = $('<span>').addClass('float-left');
    var _iconOffCanvas = $('<span>').addClass('menu-icon dark').attr({'data-toggle': 'offCanvas-navBar', 'close-on-click': true});
    _elemOffCanvas.append(_iconOffCanvas, ' Menu');

    _responsiveMenu.append(_elemOffCanvas);

    // var _menuRightResponsive = $('<div>').attr('id','responsive-menu');
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

    // _menuRightResponsive.append(_topBarRight);

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
