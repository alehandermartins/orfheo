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


  ns.Widgets.LoginHeader = function(){
    
    var _createdWidget = $('<header>').addClass('login-bar');
    var userStatus = Pard.UserStatus['status'];
   
    var _topBar = $('<div>').addClass('top-bar pard-grid clearfix');
    var _container = $('<div>').addClass('pard-header-container');
    
    var _topBarTitle = $('<div>').addClass('block-for-medium left-bar-content')
    var _logo = $('<div>').addClass('logo-header');
    _topBarTitle.append(_logo);
    _logo.click(function(){
      location.href = '/';
    });

     if (userStatus == 'outsider') {
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
    _elemOffCanvas.append(_iconOffCanvas, ' Descubre maś');

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
    
    var _descriptionFestival = 'El Benimaclet conFusión festival es un evento de expresión artística celebrado en el barrio valenciano de Benimaclet. Las representaciones, tanto en los puntos ubicados por las calles peatonales como en los espacios participantes, pretenden dar voz al alma artística de este barrio. Al mismo tiempo, el festival quiere ser una plataforma de encuentro y diálogo abierta a todas las personas, una posibilidad para quien quiera comunicar algo y un estímulo para quien esté dispuesto a escuchar.'; 
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
    var _callsInfoText = $('<p>').html('Se aceptan todo tipo de propuestas propias y originales de carácter artístico, con un fondo humano y que impulsen valores que fomenten la armonía y convivencia entre las personas (<a href= "http://beniconfusionfest.es/es/bases" target="_blank">bases de participación</a>).');
    // var _participation = $('<p>').append($('<a>').attr({'href': '#', 'target': '_blank' }).text('Bases de participación.'))
    var _signUpMessage =  Pard.Widgets.Registration();    
    var _caller = $('<button>').attr({type:'button'}).html('Apúntate').addClass('signUp-button-welcome-section');
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Empieza creando una cuenta', function(){return _signUpMessage});
    var _signUpButton = _popup.render().addClass('signUpButton-login-section');

    var _callsInfo = $('<div>').append(_callsInfoTitle, _callsInfoText);

    var _searchEngineText = $('<h6>').html('Conoce a los <strong>artistas y espacios</strong> que ya se han apuntado').addClass('searchEngine-text-welcome-page');
    var _searchEngine = Pard.Widgets.SearchEngine('');

    _callsBoxContent.append(_callsInfo,_signUpButton, _searchEngineText, _searchEngine.render());

    _content.append(_callsBoxContainer.append(_callsBoxContent));


    return{
      render: function(){
        return _content;
      }
    }
  }


  ns.Widgets.Footer = function(){

    var _createdWidget = $('<footer>').addClass('footer-bar');
    var userStatus = Pard.UserStatus['status'];

    if (userStatus == 'outsider') _createdWidget.addClass('footer-outsider');

    var _grid = $('<div>').addClass('pard-grid');
    var _container= $('<div>').addClass('pard-container-relative');
    var _leftContent = $('<div>').addClass('left-bar-content  footer-left');
    var _rightContent = $('<div>').addClass('right-bar-content footer-right');

    var _langMessage = Pard.Widgets.LanguagesMessage();
    var _langCaller = $('<a>').attr('href','#').html('Idiomas');
    // _languages.click(function(){Pard.Widgets.Alert('',_langMessage)});
    var _langPopup = Pard.Widgets.PopupCreator(_langCaller, '', function(){return _langMessage});
    var _languages = _langPopup.render();
    _languages.addClass('footer-text-link');

    var _termsAndConditionsCaller = $('<a>').attr('href','#').html('Condiciones generales');
    var _termsAndConditionsMessage = Pard.Widgets.TermsAndConditionsMessage();
    var _termsAndConditionsPopup = Pard.Widgets.PopupCreator(_termsAndConditionsCaller, '', function(){return _termsAndConditionsMessage});
    var _termsAndConditions = _termsAndConditionsPopup.render().addClass('footer-text-link');

    var _infoMessage =  Pard.Widgets.ProjectInfoMessage();    
    var _infoCaller = $('<a>').attr('href','#').html('Todo sobre el proyecto');
    var _infoPopup = Pard.Widgets.PopupCreator(_infoCaller, '', function(){return _infoMessage});
    var _information = _infoPopup.render().addClass('footer-text-link');

    _leftContent.append(_information, _termsAndConditions, _languages);

    var _project = $('<span>').text('orfheo proyecto comunitario');
    var _place = $('<span>').text('Benimaclet, Valencia 2016');

    _rightContent.append(_project, ' | ', _place);

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
    
    var _val = $('<p>').append($('<div>').addClass('valencian-flag'), 'Ho sentim, però per falta de temps i mitjans, esta web està disponible només en castellà. Esperem poder-la prompte traduir a més idiomes.');
    var _en = $('<p>').append($('<div>').addClass('english-flag'), 'We are sorry about this web being available only in Spanish. We hope to be able to extend it to other langages soon.');
    var _ita = $('<p>').append($('<div>').addClass('italian-flag'), 'Ci dispiace peró finora, per mancanza di tempo e mezzi, questa web é disponibile sólo in castellano. Speriamo poterla presto estendere a piú lingue.');

    _createdWidget.append(_val, _en, _ita);

    return {
      render: function(){ 
        return _createdWidget;
      },
      setCallback: function(callback){
        
      }
    }
  }

  ns.Widgets.ProjectInfoMessage = function (){
    var _createdWidget = $('<div>');

    var _image = $('<div>').addClass('orfheo-symbol-popup');

    var _web = $('<p>').text('orfheo.org').addClass('orfheo-web-popup');

    var _baseline = $('<h6>').html('La primera comunidad artístico-cultural </br> donde conocer proyectos, encontrarse y crear juntos</br> experiencias inolvidables').addClass('orfheo-baseline-popup');

    var _title = $('<h4>').text('Todo sobre el proyecto').addClass('title-project-info');
    var _message = $('<div>').html('<p> Hola, has encontrado un lugar que no estabas buscando. Bienvenido a orfheo! Queremos contarte por qué has llegado hasta aquí.</p> <p> A raíz de la experiencia vivida organizando el Benimaclet conFusión festival, algunos de nosotros, voluntarios, hemos tenido la posibilidad de reflexionar sobre los retos de un modelo cooperativo en relación con la difícil gestión de las muchas ofertas artístico-culturales que recoge el evento. </p> <p> Hemos pensado en lo que hacía falta, y lo hemos hecho. </p> <p> Estamos orgullosos de contar contigo porque orfheo, sin gente como tú, no es más que una voz, una llamada a la acción, que llega a ser realidad, y entonces comunidad, solamente gracias a todos sus ciudadanos. Una plataforma para artistas, actores culturales, desarrolladores, makers, creativos, trabajadores sociales... personas libres de estrictas categorías y esquemas. </p> <p> Hemos creado un mundo único, una web no sólo capaz de facilitar el trabajo de organización y gestión de una convocatoria, sino de dar valor a las propuestas de los creadores mas allá de un mero encuentro. </p> <p> Estás en tu comunidad online, donde lanzar una convocatoria artístico-cultural es fácil, y desde donde puedes mostrar tus proyectos y encontrar otros, útiles tanto para ti como para otros festivales y eventos. </p> <p> Es una herramienta, un mecanismo de gestión cultural donde descubrir a través de perfiles, enlaces y conexiones. </p> <p> Es un lugar donde colores diferentes encuentran su unidad en la común saturación, donde todo color es luz y la única forma de verlo es observándolo en relación con su entorno. </p> <p> Creemos en el poder del compartir y luchamos para que nuevas fronteras meritocráticas de vida sean posibles en el ecosistema del trabajo</p> <p> Creemos que este pequeño mundo pueda servir para estimular creaciones juntos y como espacio de intercambio donde una cosa expone a otra con la misma idea con la cual se ha creado. </p> <p> Queremos dar la posibilidad de utilizar esta herramienta a todas las personas que lo deseen,  y que respeten unas mínimas condiciones generales.</p> <p> Nos gustaría compartir nuestros conocimientos y seguir desarrollando este proyecto que acaba de empezar, para que todos los ciudadanos de orfheo puedan seguir disfrutando de la comunidad. </p> <p> Saber escuchar es fundamental  para poder seguir adelante, eres libre de expresarte y comunicarnos tu punto de vista en cualquier momento. </p> <p> Te dejamos a ti imaginar un poco más lo necesario y el compartir con los demás experiencias inolvidables.</p>');

    var _part1 = $('<div>').append(_title, _message);

    var _subtitle = $('<h5>').text('Los pilares').addClass('subtitle-project-info');

    var _part2 = $('<div>').append(_subtitle).addClass('part2-message-project-info');

    var _list1 = $('<div>').html('<p>COMPARTIR <ul><li>Saber más el uno del otro significa aprender unos de otros. </li> <li> Compartimos nuestro valor donde valor = (experiencias + conocimientos) x actitud. </li> <li> Compartimos nuestras ideas e inspiraciones creativas con el fin de crear/inspirar experiencias enriquecedoras. </li> <li> Piensa en la comunidad y la comunidad pensará en ti. </li> </ul></p>');

    var _list2 = $('<div>').html('<p>IDENTIDAD <ul><li>Defendemos el individuo como algo único, auténtico, un punto en el espacio. Valoramos el grupo, como en el círculo cromático,  en el cual se une y se define la identidad personal, un rasgo cultural, un matiz, un color. </li> <li> Desempeñamos un papel activo en el desarrollo de un mundo libre, que se innova gracias al pequeño esfuerzo colectivo de muchas personas. </li> </ul></p>');

    var _list3 = $('<div>').html('<p>INFORMACIÓN <ul><li>La necesidad de información es más fuerte que todas las fronteras. Nos gustaría facilitar el acceso en tantos más idiomas posibles.  </li> <li> Queremos que tengas acceso a la información en cualquier lugar y en cualquier momento. </li> <li> No queremos que busques sino que encuentres en orfheo lo que esperabas encontrar. </li> </ul></p>');

    var _list4 = $('<div>').html('<p>EXPERIENCIA <ul><li>Sal de la red: queremos dar la mejor experiencia posible a los usuarios por encima de nuestros proprios beneficios y objetivos internos, para que los procesos sean cada vez más rápidos, para que se pueda vivir en orfheo sólo el tiempo necesario y utilizar su información en la vida cotidiana. </li> <li> Pretendemos evolucionar hacia una interfaz y una estética limpia, clara y sencilla, utilizable por todos. </li> </ul></p>');

    var _list5 = $('<div>').html('<p>ECONOMÍA <ul><li>Se puede ganar dinero siendo honestos y cuidando y defendiendo la comunidad. Con esta intención queremos hacer sostenible económicamente este proyecto y las vidas de quienes trabajan en ello. </li> </ul></p>');

    var _list6  = $('<div>').html('<p>VISIÓN <ul><li>Creemos que afrontar un proyecto debería ser divertido y apasionante. Creemos que una cultura de trabajo adecuada promueve el talento y la creatividad.  Los logros del equipo, y los éxitos individuales contribuyen al éxito global. Tenemos  una visión creativa del trabajo, del ocio y de la vida. </li> <li> Todas las ideas interesantes que surgen en los más diferentes contextos se comentan, se analizan en profundidad y si hace falta se ponen en práctica con calidad.  </li> <li> Elegimos y construimos colaborativamente. Nuestra meta es la unidad, no la unanimidad. Tomamos decisiones con método, de forma genuina y utilizando el consenso. Tenemos discusiones abiertas, animadas por un procesos que llevan a acuerdos en un tiempo razonable. </li> <li> Nos fijamos objetivos que sabemos tal vez no poder alcanzar, porque estamos convencidos de que a lo largo del camino, los esfuerzos, por cumplirlos, nos llevarán a obtener resultados, quizás diferentes de los esperados, pero igualmente valiosos. </li> </ul></p>');

     var _list7 = $('<div>').html('<p>MISIÓN <ul><li>Nuestra misión es estimular nuevas posibilidades culturales creadas por conexiones. </li> </ul></p>');

     var _thanks = $('<div>').html('<p> <strong>Gracias</strong> a Xavi para alumbrar el camino y a la gente de la Cova y la Devscola por su fundamental ayuda en el proceso.</p> ').css('margin-top','2rem');

    _part2.append(_list1, _list2, _list3, _list4, _list5, _list6, _list7, _thanks);

    _createdWidget.append(_image, _web, _baseline, _part1, _part2);

    return {
      render: function(){ 
        return _createdWidget
      },
      setCallback: function(callback){
        
      }
    }
  }

}(Pard || {}));


