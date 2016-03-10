'use strict';



(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.MainLayout = function(asideContent, sectionContent, profiles){

    var _main = $('<main>');

    var _mainMediumDown = $('<section>').addClass('pard-grid displayNone-for-large');
    var _offCanvasWrapper = $('<div>').addClass('off-canvas-wrapper');
    var _offCanvasInner = $('<div>').addClass('off-canvas-wrapper-inner').attr({'data-off-canvas-wrapper': ''});
    var _offCanvasAside = $('<div>').addClass('off-canvas-grid-aside position-left-grid-aside').attr({id: 'offCanvas-navBar', 'data-off-canvas': ''});

    var _offCanvasSection = $('<div>').addClass('off-canvas-content').attr({'data-off-canvas-content': ''});

    var _mainLarge = $('<section>').addClass('pard-grid displayNone-for-mediumDown');
    var _gridSpacing = $('<div>').addClass('grid-spacing');


    var _aside = $('<nav>').addClass('grid-aside');
    var _section = $('<section>').addClass('grid-section');
    var _sectionContent = $('<div>');
    var _SectionContent = $('<div>');


    var _Aside = $('<nav>').addClass('grid-aside');
    var _Section = $('<section>').addClass('grid-section');;

    _sectionContent = sectionContent(profiles, _sectionContent).render()

    _section.append(sectionContent(profiles, _sectionContent).render());
    _aside.append(asideContent(profiles, _sectionContent).render());
    _Section.append(sectionContent(profiles, _SectionContent).render());
    _Aside.append(asideContent(profiles, _SectionContent).render());
    

    _offCanvasAside.append(_aside);
    _offCanvasSection.append(_section);    
    _offCanvasInner.append(_offCanvasAside, _offCanvasSection);
    _mainMediumDown.append(_offCanvasWrapper.append(_offCanvasInner));

    _mainLarge.append(_Aside, _gridSpacing, _Section);

    _main.append(_mainLarge, _mainMediumDown);

    return {
      render: function(){
        return _main
      }
    }
  }

//   ns.Widgets.MainLogin = function(profiles){

//     Pard.Widgets.MainLayout().appendAside(Pard.Widgets.LoginAside().render());

//     return {
//       render: function(){
//         return Pard.Widgets.MainLayout();
//       }
//     }
// }

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
    // var _createdWidget = $('<nav>').addClass('grid-aside');
    var _asideContainer = $('<div>').addClass('aside-container');

    

    var _info = $('<div>').addClass('info grid-aside-content').text('orfheo es comunidad');

    Pard.Widgets.Sticker(_asideContainer, 100, 24);

    var _signUpMessage =  Pard.Widgets.Registration();    
    var _caller = $('<button>').attr({type:'button'}).html('Regístrate')
    var _popup = Pard.Widgets.PopupCreator(_caller, Pard.Widgets.PopupContent('', _signUpMessage));

    var _signUpButton = _popup.render();
    _signUpButton.addClass('signupButton');

      _asideContainer.append(_signUpButton, _info);

    return{
      render: function(){
        return _asideContainer;
      }
    }
  }

  ns.Widgets.LoginSection = function (profiles, content) {

    content.empty();

    var _content = content.addClass('grid-element-content');
    var _title = $('<div>').addClass('grid-section-contentTitle').html(' <h3> Descubre </h3> <h4>los participantes a la convocatoria del</h4><h3>Benimaclet conFusión festival</h3>');
    var _searchEngine = Pard.Widgets.SearchEngine(profiles);




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


