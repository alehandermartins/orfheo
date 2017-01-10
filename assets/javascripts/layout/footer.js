'use strict';

(function(ns){

     
ns.Widgets = ns.Widgets || {};  

  ns.Widgets.Footer = function(){

    $(document).on('closed.zf.reveal', '[data-reveal]', function() {
      if (!($('.reveal[aria-hidden="false"]').length)){
        $('html').removeClass('overflowHidden');
      }
    });
    $(document).on('open.zf.reveal', function(){
      $('html').addClass('overflowHidden');
    });

    var _createdWidget = $('<footer>').addClass('footer-bar');
    var userStatus = Pard.UserStatus['status'];

    if (userStatus == 'outsider') _createdWidget.addClass('footer-outsider');

    var _grid = $('<div>').addClass('pard-grid');
    var _container= $('<div>').addClass('pard-container-relative');
    var _leftContent = $('<div>').addClass('left-bar-content  footer-left');
    var _rightContent = $('<div>').addClass('right-bar-content footer-right');

    var _langPopup;
    var _languages = $('<a>').attr('href','#/')
      .html('Idiomas')
      .addClass('footer-text-link')
      .one('click',function(){
        var _langMessage = Pard.Widgets.LanguagesMessage().render();
        _langPopup = Pard.Widgets.Popup();
        _langPopup.setContent('', _langMessage);
      })
      .on('click', function(){
        _langPopup.open();
      });

    var _termsAndConditionsPopup;
    var _termsAndConditions = $('<a>').attr('href','#/')
      .html('Condiciones generales')
      .addClass('footer-text-link')
      .one('click',function(){
        var _termsAndConditionsMessage = Pard.Widgets.TermsAndConditionsMessage().render();
        _termsAndConditionsPopup = Pard.Widgets.Popup();
        _termsAndConditionsPopup.setContent('', _termsAndConditionsMessage);
      })
      .on('click',function(){
        _termsAndConditionsPopup.open();
      });

       
    var _infoPopup;
    var _information = $('<a>').attr('href','#/')
      .html('Todo sobre el proyecto')
      .addClass('footer-text-link')
      .one('click',function(){
        var _infoMessage =  Pard.Widgets.ProjectInfoMessage().render();
        _infoPopup = Pard.Widgets.Popup();
        _infoPopup.setContent('', _infoMessage);
      })
      .on('click',function(){
        _infoPopup.open();
      });

    _leftContent.append(_information, _termsAndConditions, _languages);

    // var _project = $('<span>').text('orfheo proyecto comunitario');
    // var _place = $('<span>').text('Benimaclet, Valencia 2016');
    var _content = $('<div>').addClass('very-fast reveal full');
   
    $(document).ready(function(){
      $('body').append(_content);
    });
    var _contactPopup
    var _contactaOrfheo = $('<span>').append($('<a>').text('contacta orfheo')
      .attr('href','#/'))
      .css({
        'font-size': '14px',
        'margin-top': '-0.2rem',
        'display': 'inline-block'
      })
      .one('click',function(){
        _contactPopup =  new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', multipleOpened:true});
        _content.append(Pard.Widgets.ContactInfo(_contactPopup));
      })
      .on('click',function(){
        _contactPopup.open();
      });

    // _rightContent.append(_project, ' | ', _place);
    _rightContent.append(_contactaOrfheo);

    _container.append(_leftContent,_rightContent);
    _grid.append(_container);
    _createdWidget.append(_grid);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.ContactInfo = function(_popup){

    var _outerContainer = $('<div>').addClass('vcenter-outer');
    var _container = $('<div>').addClass('vcenter-inner');
    var _popupContent = $('<div>');
    _popupContent.addClass('popup-container-full contactInfo-popup-bigalert'); 
    var _sectionContainer = $('<section>').addClass('popup-content');
   
    var _closeBtn = $('<button>').addClass('close-button small-1 ')
      .attr({'data-close': '', type: 'button', 'aria-label': 'Close alert'})
      .append($('<span>').attr('aria-hidden', true).html('&times;'));

    _closeBtn.click(function(){
      _popup.close();
    });

    var _header = $('<div>').addClass('header-contactInfo');
    var _logo = $('<div>').addClass('logoOrfheo-contactInfo');
    var _menuContainer = $('<div>').addClass('menu-centered');
    var _menu = $('<ul>').addClass('menu');
    var _tecnicalSupport = $('<li>').text('Soporte técnico').click(function(){
      $('.selected').removeClass('selected');
      _tecnicalSupport.addClass('selected');
      $('.shown').hide();
      _tecnicalSupportCont.show().addClass('shown');
    }).addClass('selected');
    var _colaboration = $('<li>').text('Colabora').click(function(){
      $('.selected').removeClass('selected');
      _colaboration.addClass('selected');
      $('.shown').hide();
      _colaborationCont.show().addClass('shown');
    });
    var _services = $('<li>').text('Servicios').click(function(){
      $('.selected').removeClass('selected');
      _services.addClass('selected');
      $('.shown').hide();
      _servicesCont.show().addClass('shown');
    });
    var _contact = $('<li>').text('Contacto').click(function(){
      $('.selected').removeClass('selected');
      _contact.addClass('selected');
      $('.shown').hide();
      _contactCont.show().addClass('shown');
    });
    var _feedback = $('<li>').text('Feedback').click(function(){
      $('.selected').removeClass('selected');
      _feedback.addClass('selected');
      $('.shown').hide();
      _feedbackCont.show().addClass('shown');
    });
    _menuContainer.append(_menu.append(_tecnicalSupport, _services, _colaboration, _feedback,  _contact));
    _header.append(_logo, _menuContainer, _closeBtn);

    var _tecnicalSupportCont = $('<div>').addClass('shown tecnicalSupport-contactInfo');
    var _colaborationCont = $('<div>').hide().addClass('colaboration-contactInfo');
    var _servicesCont = $('<div>').hide().addClass('services-contactInfo');
    var _contactCont = $('<div>').hide().addClass('contact-contactInfo');
    var _feedbackCont = $('<div>').hide().addClass('feedback-contactInfo');

    var _titleTecn = $('<h5>').text('¿Como podemos ayudarte?');  
    _tecnicalSupportCont.append(_titleTecn);
    var _textColumn = $('<div>').append($('<p>').text('Estamos aquí para proporcionarte ayuda técnica, consejos, responder a tus preguntas o darte información útil cuando más lo necesites.'), $('<p>').text('Te contestaremos enseguida.'), $('<p>').text(':)')).addClass('half-col');
    var _nameInput = Pard.Widgets.Input('Nombre*','text');
    var _emailInput = Pard.Widgets.Input('Email*','text');
    var _subjectInput = Pard.Widgets.Input('Asunto','text');
    var _profileInput = Pard.Widgets.Input('Nombre del perfil orfheo en cuestión', 'text');
    var _browserInput = Pard.Widgets.Input('Navegador que utilizas', 'text');
    var _mexInput = Pard.Widgets.TextArea('Mensaje*',6);
    var _submitBtn = Pard.Widgets.Button('Envía', function(){
      Pard.Backend.contact(_nameInput.getVal(), _emailInput.getVal(), _subjectInput.getVal(), _mexInput.getVal(), function(data){
        console.log(data);
        console.log(_nameInput.getVal());
        console.log(_mexInput.getVal());
      });
    });
    var _formColumn = $('<div>').append($('<form>').append(_nameInput.render(), _emailInput.render(), _subjectInput.render(), _profileInput.render(), _browserInput.render(), _mexInput.render()), _submitBtn.render()).addClass('half-col');
    _tecnicalSupportCont.append(_textColumn, _formColumn);

    var _titleColab = $('<h5>').text('¿Quieres ser parte?');  
    _colaborationCont.append(_titleColab);
    var _textColumnColab = $('<div>')
      .append(
        $('<p>').text('Nos gustaría compartir conocimientos y seguir desarrollando este proyecto para que todos los ciudadanos de orfheo puedan siempre disfrutar de la comunidad y para dar la posibilidad de utilizar esta herramienta a todas las personas que lo deseen.'), 
        $('<p>').text('Creemos que la inclusión inspira la innovación y por lo tanto siempre estamos abiertos a escuchar ideas para colaborar.'), 
        $('<p>').append('Contáctanos a ', $('<a>').attr('href','mailto:info@orfheo.org').text('info@orfheo.org'))
      )
      .addClass('half-col');
     var _listColumnCol = $('<div>')
       .append(
          $('<p>').text('Hay muchas formas de colaborar en orfheo:').css('margin-bottom','0.5rem'),
          $('<ul>').append(
            $('<li>').html('como partner: </br>si tienes un negocio y como nosotros crees que podemos hacer más cosas juntos que por separados, no dudes en enviarnos tu propuesta de alianza.'),
            $('<li>').html('como patrocinador: </br>gracias a ti, que quieres invertir y/o colaborar a través publicidad y patrocinio, podemos ofrecer la posibilidad de ayudar económicamente a los proyectos de la comunidad orfheo.'),
            $('<li>').html('como trabajador:</br>trabaja en orfheo como creativo, artista, diseñador, programador, community manager, gestor administrativo o comercial. Envianos informaciones sobre ti.'),
            $('<li>').html('como mecena: </br>apoya de forma generosa una realidad, porque crees en ella. Apoyar orfheo significa ser parte de un proyecto con el potencial de mejorar nuestro mundo.'),
            $('<li>').html('como voluntario: </br>contáctanos si quieres aprender a través del desarrollo de orfheo o si ya tienes conocimientos y te estimula ofrecer tu tiempo a una noble causa.')
          )
        )
       .addClass('half-col list-col');
     _colaborationCont.append(_textColumnColab, _listColumnCol);

    var _titleServ = $('<h5>').text('¿Qué puedes hacer con orfheo?');  
    _servicesCont.append(_titleServ);

    var _titleContact = $('<h5>').text('¡Aquí estamos!');  
    _contactCont.append(_titleContact);
    var _textContact = $('<p>').html('<strong> orfheo </strong></br>Calle nuestra señora de la asunción, 4b</br>Valencia (España) 46020</br> (0034) 633 753 471</br>info@orfheo.org').css({'text-align':'center'});
    // <a href="mailto:info@orfheo.org">info@orfheo.org</a></br><a href="https://www.facebook.com/orfheo.org", target="_blank">Facebook</a>'
    _contactCont.append(_textContact);

    var _titleFeed = $('<h5>').text('¿Que tal te parece orfheo?');
    _feedbackCont.append(_titleFeed);
    var _textFeedColumn = $('<div>')
      .append(
        $('<p>').text('Para poder mejorar es necesario ponerse en juego y ser cuestionados. Estaríamos encantados de saber que piensas de orfheo, que funcionalidades le faltan que te gustaría tener a tu alcance, que cambiarías, quitarías o añadirías... '), 
        $('<p>').text('Cualquier critica constructiva es bienvenida, nos ayudará a proporcionarte un servicio mejor.'), 
        $('<p>').text('¡Tu opinión es importante!')
      ).addClass('half-col');
    var _nameInput = Pard.Widgets.Input('Nombre*','text');
    var _emailInput = Pard.Widgets.Input('Email*','text');
    var _mexInput = Pard.Widgets.TextArea('Mensaje*',6);
    var _submitBtn = Pard.Widgets.Button('Envía', function(){
      Pard.Backend.contact(_nameInput.getVal(), _emailInput.getVal(), _mexInput.getVal(), function(data){
        console.log(data);
        console.log(_nameInput.getVal());
        console.log(_mexInput.getVal());
      });
    });
    var _formFeedColumn = $('<div>').append($('<form>').append(_nameInput.render(), _emailInput.render(), _mexInput.render()), _submitBtn.render()).addClass('half-col');
    _feedbackCont.append(_textFeedColumn, _formFeedColumn);


    _sectionContainer.append(_tecnicalSupportCont, _colaborationCont, _servicesCont, _contactCont, _feedbackCont);

    _popupContent.append(_header, _sectionContainer);
    _outerContainer.append(_container.append(_popupContent));

    return _outerContainer;
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
      }
    }
  }

}(Pard || {}));
