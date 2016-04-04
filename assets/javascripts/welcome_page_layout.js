'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.MainLayout = function(asideContent, sectionContent){

    var _main = $('<main>');

    var _offCanvasWrapper = $('<div>').addClass('off-canvas-wrapper');
    var _offCanvasInner = $('<div>').addClass('off-canvas-wrapper-inner').attr({'data-off-canvas-wrapper': ''});
    var _offCanvasAside = $('<div>').addClass('off-canvas-grid-aside position-left-grid-aside').attr({id: 'offCanvas-navBar', 'data-off-canvas': ''});

    var _offCanvasSection = $('<div>').addClass('off-canvas-content').attr({'data-off-canvas-content': ''});

    var _mainLarge = $('<section>').addClass('pard-grid');
    var _gridSpacing = $('<div>').addClass('grid-spacing');


    var _aside = $('<nav>').addClass('grid-aside');
    var _section = $('<section>').addClass('grid-section');
    var _sectionContainer = $('<div>');

    _offCanvasSection.append(sectionContent(_sectionContainer).render());

    _offCanvasAside.append(asideContent(_sectionContainer).render());

    _aside.append(_offCanvasAside);
    _section.append(_offCanvasSection);
    _offCanvasInner.append(_aside, _gridSpacing, _section);

    _mainLarge.append(_offCanvasWrapper.append(_offCanvasInner));
    _main.append(_mainLarge);

    return {
      render: function(){
        return _main;
      }
    }
  }


  ns.Widgets.LoginHeader = function(){
    
    var _createdWidget = $('<header>').addClass('login-bar');
    var _topBar = $('<div>').addClass('top-bar pard-grid clearfix');
    var _container = $('<div>').addClass('pard-header-container');

    
    var _topBarTitle = $('<div>').addClass('block-for-medium left-bar-content');
    _topBarTitle.html('<h3><strong>orfheo</strong></h3>');
   
    var _responsiveMenu = $('<div>').addClass('clearfix displayNone-for-large');

    var _elemResponsive = $('<span>').addClass('float-right').attr({'data-responsive-toggle':'responsive-menu', 'data-hide-for': 'medium'}); 
    var _iconLogin = $('<span>').addClass('menu-icon dark');
    _iconLogin.attr('data-toggle','');
    _elemResponsive.append(_iconLogin,' Log In');

    var _elemOffCanvas = $('<span>').addClass('menu-icon-header');
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
    var _photoContainer = $('<div>').addClass('section-profilePhoto-container').css({
        background: "url(<%= image_path 'cartel_reunion2016'%>)",
        width: '750px',
        height: '220px'
      });

    // var _title = $('<div>').addClass('grid-section-contentTitle').html(' <h3> Descubre </h3> <h4>los participantes a la convocatoria del</h4><h3>Benimaclet conFusión festival</h3>');


    var _title = $('<div>').addClass('title-profile-section-container').append($('<h3>').text('Benimaclet conFusión festival').addClass('text-title-profile-section'));

    var _infoText = $('<h5>').text('Convocatoria 2016 abierta');
    var _signUpMessage =  Pard.Widgets.Registration();    
    var _caller = $('<button>').attr({type:'button'}).html('¡Apúntate!');
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Regístrate para continuar', function(){return _signUpMessage});
    var _signUpButton = _popup.render().addClass('signUpButton-login-section');

    var _info = $('<div>').append(_infoText, _signUpButton);


    var _searchEngine = Pard.Widgets.SearchEngine();

    _content.append(_photoContainer,_title, _info, _searchEngine.render());

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


