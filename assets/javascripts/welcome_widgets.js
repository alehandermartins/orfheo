'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.LoginHeader = function(){
    
    var _createdWidget = $('<header>').addClass('login-bar');
    var _topBar = $('<div>').addClass('top-bar pard-grid clearfix');
    var _container = $('<div>').addClass('pard-header-container');

    
    var _topBarTitle = $('<div>').addClass('block-for-medium left-bar-content');
    _topBarTitle.html('<h3><strong>orfheo</strong></h3>');
   
    var _responsiveMenu = $('<div>').addClass('clearfix displayNone-for-large');

    var _elemResponsive = $('<span>').addClass('float-right').attr({'data-responsive-toggle':'responsive-menu', 'data-hide-for': 'large'}); 
    var _iconLogin = $('<span>').addClass('menu-icon dark');
    _iconLogin.attr('data-toggle','');
    _elemResponsive.append(_iconLogin,' Log In');

    var _elemOffCanvas = $('<span>').addClass('float-left');
    var _iconOffCanvas = $('<span>').addClass('menu-icon dark').attr({'data-toggle': 'offCanvas-navBar', 'close-on-click': true});
    _elemOffCanvas.append(_iconOffCanvas, ' Menu');

    _responsiveMenu.append(_elemResponsive, _elemOffCanvas);

    var _menuLogin = $('<div>').attr('id','responsive-menu');
    var _topBarRight = $('<div>').addClass('top-bar-right menu right-bar-content');
    var _inputLogin = Pard.Widgets.Login().render();
    
    _topBarRight.append(_inputLogin);
    _menuLogin.append(_topBarRight);

    _container.append(_topBarTitle, _responsiveMenu, _menuLogin);
    _topBar.append(_container);
    _createdWidget.append(_topBar);


  	return {
  		render: function(){
  			return _createdWidget;
  		} 
  	}
  }

  
  ns.Widgets.LoginAside = function () {
    var _asideContainer = $('<div>').addClass('aside-container');

    var _info = $('<div>').addClass('info grid-aside-content').text('orfheo es comunidad');

    Pard.Widgets.Sticker(_asideContainer, 100, 24);

    var _signUpMessage =  Pard.Widgets.Registration();    
    var _caller = $('<button>').attr({type:'button'}).html('Regístrate')
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Regístrate para continuar', function(){return _signUpMessage});

    var _signUpButton = _popup.render();
    _signUpButton.addClass('signupButton');

      _asideContainer.append(_signUpButton, _info);

    return{
      render: function(){
        return _asideContainer;
      }
    }
  }

  ns.Widgets.LoginSection = function (content) {

    content.empty();

    var _content = content.addClass('grid-element-content');
    var _title = $('<div>').addClass('grid-section-contentTitle').html(' <h3> Descubre </h3> <h4>los participantes a la convocatoria del</h4><h3>Benimaclet conFusión festival</h3>');
    var _searchEngine = Pard.Widgets.SearchEngine();

    _content.append(_title, _searchEngine.render())

    return{
      render: function(){
        return _content;
      }
    }
  }


  ns.Widgets.Footer = function(){

    var _createdWidget = $('<footer>').addClass('footer-bar');
    var _grid = $('<div>').addClass('pard-grid');
    var _container= $('<div>').addClass('pard-container-relative');
    var _leftContent = $('<div>').addClass('left-bar-content  footer-left').html('left');
    var _rightContent = $('<div>').addClass('right-bar-content footer-right').html('right');

    _container.append(_leftContent,_rightContent);
    _grid.append(_container);
    _createdWidget.append(_grid);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }
 

}(Pard || {}));


