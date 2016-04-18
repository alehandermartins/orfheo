'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.MainLayout = function(asideContent, sectionContent){

    var _main = $('<main>').attr('id','main-welcome-page');

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


  ns.Widgets.LoginHeader = function(notLogged){
    
    var _createdWidget = $('<header>').addClass('login-bar');
   
    var _topBar = $('<div>').addClass('top-bar pard-grid clearfix');
    var _container = $('<div>').addClass('pard-header-container');

    
    var _topBarTitle = $('<div>').addClass('block-for-medium left-bar-content')
    var _logo = $('<div>').css({'cursor':'pointer'});
    _logo.html('<h3><strong>orfheo</strong></h3>');
    _topBarTitle.append(_logo);
    _logo.click(function(){
      location.href = '/';
    });

     if (notLogged) {
      _createdWidget.addClass('outsider-header');
      var _registerBtnOut = Pard.Widgets.SignUpButton().render().attr({ id: 'register-outsider-header-button'});

      _topBarTitle.append(_registerBtnOut);
      _registerBtnOut.hide();
    }
   
    var _responsiveMenu = $('<div>').addClass('clearfix displayNone-for-large');

    var _elemResponsive = $('<span>').addClass('float-right').attr({'data-responsive-toggle':'responsive-menu', 'data-hide-for': 'medium'}); 
    var _iconLogin = $('<span>').addClass('menu-icon dark').css('margin-right','0.3rem');
    _iconLogin.attr('data-toggle','');
    _elemResponsive.append(_iconLogin,'Entra');


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

    var _info = $('<div>').addClass('info grid-aside-content').append($('<p>').text('Entra en orfheo para apuntarte a la convocatoria'));

    Pard.Widgets.Sticker(_asideContainer, 95, 29);

    var _signUpButton = Pard.Widgets.SignUpButton().render();
    _signUpButton.addClass('signupButton');

      _asideContainer.append(_info.append(_signUpButton));

    return{
      render: function(){
        return _asideContainer;
      }
    }
  }



  ns.Widgets.LoginSection = function (content) {

    content.empty();

    $(document).ready(function(){$('#main-welcome-page').addClass('main-welcome-page')});

    var _content = content.addClass('grid-element-content welcome-page-section');

    var _photoContainer = $('<div>').addClass('welcome-img-section-header');

    var _title = $('<div>').addClass('title-profile-section-container').append($('<h3>').text('Benimaclet conFusión festival').addClass('text-title-profile-section'));

    _content.append(_photoContainer,_title);

    var _infoBoxContainer = Pard.Widgets.SectionBoxContainer('Información', Pard.Widgets.IconManager('information').render().addClass('info-icon-title-box')).render();
    var _infoContentBox = $('<div>').addClass('box-content');
    

    var _info = $('<div>').addClass('information-bio');  
    var _contact = $('<div>').addClass('information-contact');

    var _shortDescription = $('<p>').text('Festival libre de expresión gratuita - 15/16 Octubre 2016').addClass('short-description-text');  
    _info.append(_shortDescription)
    
    var _descriptionFestival = 'El Benimaclet conFusión festival es un evento de expresión artística celebrado en el barrio valenciano de Benimaclet. Las representaciones, tanto en los puntos ubicados por las calles peatonales como en los espacios participantes, pretenden dar voz al alma artística de este barrio. Al mismo tiempo, el festival quiere ser una plataforma de encuentro y diálogo abierta a todas las personas, una posibilidad para quien quiera comunicar algo y un estimulo para quien esté dispuesto a escuchar.'; 
      // Es un canal de difusión, defensa y práctica de valores tales como el sentido de comunidad, el compartir, la integración entre diversos, la libre expresión y la creatividad.
    

    var _description = $('<p>').text(_descriptionFestival);
    _info.append(_description);
  
    var _type = $('<p>').addClass('information-contact-text-column type-text-info-box').append($('<span>').text(Pard.Widgets.Dictionary('organization').render()));
    var _typeIcon = Pard.Widgets.IconManager('organization').render().addClass('information-contact-icon-column type-icon-info-box');

    _contact.append($('<div>').append(_typeIcon, _type));

    var _city = $('<div>').append(
      Pard.Widgets.IconManager('city_artist').render().addClass('information-contact-icon-column'), 
      $('<p>').addClass('information-contact-text-column').append(
        $('<a>').attr({
          href: 'http://maps.google.com/maps?q=valencia 46020',
          target: '_blank'
        }).text('Benimaclet (Valencia)')
      )
    );

    _contact.append(_city);

    
    var _personalWebs = {
      '0': {
        provider: 'facebook', 
       url: 'https://www.facebook.com/beniconfusionfest/'
      },
      '1': {
        provider: 'my_web', 
        url: 'http://beniconfusionfest.es'
      },
      '2': {
        provider: 'twitter', 
        url: 'https://twitter.com/conFusionFest?lang=es'
      },
      '3': {
        provider: 'instagram', 
        url: 'https://www.instagram.com/confusionfestival/'
      },
      '4': {
        provider: 'youtube', 
        url: 'https://www.youtube.com/channel/UCkAXyjiBR10dn0wFuh9JaSQ'
      }
    }; 

    
    _contact.append(Pard.Widgets.PrintWebsList(_personalWebs).render());


    _infoContentBox.append(_info, _contact);
    _infoBoxContainer.append(_infoContentBox);
    _content.append(_infoBoxContainer);

    var _callsBoxContainer = Pard.Widgets.SectionBoxContainer('Convocatoria 2016', Pard.Widgets.IconManager('open_call').render()).render();
    var _callsBoxContent = $('<div>').addClass('box-content');

    var _callsInfoTitle = $('<p>').text('Abierta hasta el 15 de Junio.').css('font-weight','bold');
    var _callsInfoText = $('<p>').text('Se aceptan todo tipo de propuestas propias y originales de carácter artístico, con un fondo humano y que impulsen valores que fomenten la armonía y convivencia entre las personas');
    var _signUpMessage =  Pard.Widgets.Registration();    
    var _caller = $('<button>').attr({type:'button'}).html('Apúntate').addClass('signUp-button-welcome-section');
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Regístrate para continuar', function(){return _signUpMessage});
    var _signUpButton = _popup.render().addClass('signUpButton-login-section');

    var _callsInfo = $('<div>').append(_callsInfoTitle, _callsInfoText);

    var _searchEngineText = $('<h6>').text('Conoce a los artistas y espacios que ya se han registrado').addClass('serachEngine-text-welcome-page');
    var _searchEngine = Pard.Widgets.SearchEngine('');

    _callsBoxContent.append(_callsInfo,_signUpButton, _searchEngineText, _searchEngine.render());

    _content.append(_callsBoxContainer.append(_callsBoxContent));


    return{
      render: function(){
        return _content;
      }
    }
  }


  ns.Widgets.Footer = function(notLogged){

    var _createdWidget = $('<footer>').addClass('footer-bar');

    if (notLogged) _createdWidget.css('position','fixed');

    var _grid = $('<div>').addClass('pard-grid');
    var _container= $('<div>').addClass('pard-container-relative');
    var _leftContent = $('<div>').addClass('left-bar-content  footer-left');
    var _rightContent = $('<div>').addClass('right-bar-content footer-right').html('right');

    var _languagesMessage =  Pard.Widgets.LanguagesMessage();    
    var _langCaller = $('<a>').html('Idiomas');
    var _langPopup = Pard.Widgets.PopupCreator(_langCaller, '', function(){return _languagesMessage});
    var _languages = _langPopup.render();

    var _infoMessage =  Pard.Widgets.ProjectInfoMessage();    
    var _infoCaller = $('<a>').html('Todo sobre orfheo');
    var _infoPopup = Pard.Widgets.PopupCreator(_infoCaller, '', function(){return _infoMessage});
    var _information = _infoPopup.render();

    _leftContent.append(_information, _languages);

    _container.append(_leftContent,_rightContent);
    _grid.append(_container);
    _createdWidget.append(_grid);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.LanguagesMessage = function (){
    var _createdWidget = $('<div>');
    return {
      render: function(){ 
        _createdWidget
      },
      setCallback: function(callback){

      }
    }
  }

  ns.Widgets.ProjectInfoMessage = function (){
    var _createdWidget = $('<div>');
    return {
      render: function(){ 
        _createdWidget
      },
      setCallback: function(callback){
        
      }
    }
  }

}(Pard || {}));


