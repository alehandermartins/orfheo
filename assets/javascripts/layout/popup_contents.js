'use strict';

(function(ns){
     
ns.Widgets = ns.Widgets || {};

  ns.Widgets.ContactInfo = function(_popup){

    var _outerContainer = $('<div>').addClass('vcenter-outer fullWidth');
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
    var _services = $('<li>').text(Pard.t.text('contact.servicesTab.tab')).click(function(){
      $('.selected').removeClass('selected');
      _services.addClass('selected');
      $('.shown').hide();
      _servicesCont.show().addClass('shown');
    }).addClass('selected');
    var _tecnicalSupport = $('<li>').text(Pard.t.text('contact.techTab.tab'))
    .click(function(){
      $('.selected').removeClass('selected');
      _tecnicalSupport.addClass('selected');
      $('.shown').hide();
      _tecnicalSupportCont.show().addClass('shown');
    });
    var _feedback = $('<li>').text(Pard.t.text('contact.feedBackTab.tab')).click(function(){
      $('.selected').removeClass('selected');
      _feedback.addClass('selected');
      $('.shown').hide();
      _feedbackCont.show().addClass('shown');
    });
    var _colaboration = $('<li>').text(Pard.t.text('contact.collaborateTab.tab')).click(function(){
      $('.selected').removeClass('selected');
      _colaboration.addClass('selected');
      $('.shown').hide();
      _colaborationCont.show().addClass('shown');
    });
    var _contact = $('<li>').text(Pard.t.text('contact.contactTab.tab')).click(function(){
      $('.selected').removeClass('selected');
      _contact.addClass('selected');
      $('.shown').hide();
      _contactCont.show().addClass('shown');
    });
    _menuContainer.append(_menu.append(
      _services, _tecnicalSupport, _feedback, _colaboration, 
      _contact));
    var _text = $('<div>').text(Pard.t.text('contact.logo')).addClass('textHeader-contactPopup');
    _header.append(_logo, _text, _menuContainer, _closeBtn);

    var _servicesCont = $('<div>')
      .addClass('shown services-contactInfo');
    var _tecnicalSupportCont = $('<div>')
      .hide()
      .addClass('tecnicalSupport-contactInfo');
    var _colaborationCont = $('<div>')
      .hide()
      .addClass('colaboration-contactInfo');
    var _contactCont = $('<div>')
      .hide()
      .addClass('contact-contactInfo');
    var _feedbackCont = $('<div>')
      .hide()
      .addClass('feedback-contactInfo');

    var _titleServ = $('<h5>').text(Pard.t.text('contact.servicesTab.title'));  
    _servicesCont.append(_titleServ);
     var _textColumn = $('<div>')
      .append(
        $('<p>').html(Pard.t.text('contact.servicesTab.mex1')),
        $('<h6>').append(Pard.t.text('contact.servicesTab.subtitle2')),
        $('<p>').text(Pard.t.text('contact.servicesTab.mex2')),
        $('<h6>').append(Pard.t.text('contact.servicesTab.subtitle3')),
        $('<p>').text(Pard.t.text('contact.servicesTab.mex3')),
        $('<h6>').append(Pard.t.text('contact.servicesTab.subtitle4')),
        $('<p>').text(Pard.t.text('contact.servicesTab.mex4'))
      )
      .addClass('half-col');
    var _formColumn = $('<div>').addClass('half-col');
    var _contactForm = Pard.Widgets.BusinessForm();
    var _textFormCol = $('<div>').append(
      $('<p>').html(Pard.t.text('contact.servicesTab.mex5', {link: '<a href="/services", target="_blank">' +  Pard.t.text('contact.servicesTab.servicesPage') + '</a>'})).css({'margin-bottom':'1.5rem'})
    );
    _formColumn.append(_textFormCol, _contactForm);
    _servicesCont.append(_textColumn, _formColumn);

    var _titleTecn = $('<h5>').text(Pard.t.text('contact.techTab.title'));  
    _tecnicalSupportCont.append(_titleTecn);
    var _textColumn = $('<div>').append($('<p>').text(Pard.t.text('contact.techTab.mex1')), $('<p>').text(Pard.t.text('contact.techTab.mex2')), $('<p>').text(':)')).addClass('half-col');
    var _formColumn = $('<div>').append(Pard.Widgets.TecnicalSupportForm()).addClass('half-col');
    _tecnicalSupportCont.append(_textColumn, _formColumn);

    var _titleContact = $('<h5>').text(Pard.t.text('contact.contactTab.title'));  
    _contactCont.append(_titleContact);
    var _textContact = $('<p>').html('<strong> orfheo </strong></br>Calle nuestra señora de la asunción, 4b</br>Valencia (' +  (Pard.t.text('contact.contactTab.country')) + ') 46020</br> (0034) 633 753 471</br> <a href="mailto:info@orfheo.org">info@orfheo.org</a></br><a href="https://www.facebook.com/orfheo.org", target="_blank">Facebook</a>').css({'text-align':'center'});

    _contactCont.append(_textContact);

    var _titleFeed = $('<h5>').text(Pard.t.text('contact.feedBackTab.title'));
    _feedbackCont.append(_titleFeed);
    var _textFeedColumn = $('<div>')
      .append(
        $('<p>').text(Pard.t.text('contact.feedBackTab.mex1')), 
        $('<p>').text(Pard.t.text('contact.feedBackTab.mex2')), 
        $('<p>').text(Pard.t.text('contact.feedBackTab.mex3'))
      ).addClass('half-col');

    var _formFeedColumn = $('<div>').append(Pard.Widgets.FeedbackForm()).addClass('half-col');
    _feedbackCont.append(_textFeedColumn, _formFeedColumn);

    var _colaborationCont = $('<div>').addClass('colaboration-contactInfo').hide();
    var _titleColab = $('<h5>').text(Pard.t.text('contact.collaborateTab.title'));  
    _colaborationCont.append(_titleColab);
    var _textColumnColab = $('<div>')
      .append(
        $('<p>').text(Pard.t.text('contact.collaborateTab.mex1')), 
        $('<p>').text(Pard.t.text('contact.collaborateTab.mex2')), 
        $('<p>').append(Pard.t.text('contact.collaborateTab.mex3'), $('<a>').attr('href','mailto:info@orfheo.org').text('info@orfheo.org'))
      )
      .addClass('half-col');
     var _listColumnCol = $('<div>')
       .append(
          $('<p>').text(Pard.t.text('contact.collaborateTab.mex4')).css('margin-bottom','0.5rem'),
          $('<ul>').append(
            $('<li>').html(Pard.t.text('contact.collaborateTab.mex5')),
            $('<li>').html(Pard.t.text('contact.collaborateTab.mex6')),
            $('<li>').html(Pard.t.text('contact.collaborateTab.mex7')),
            $('<li>').html(Pard.t.text('contact.collaborateTab.mex8')),
            $('<li>').html(Pard.t.text('contact.collaborateTab.mex9'))
          )
        )
       .addClass('half-col list-col');
     _colaborationCont.append(_textColumnColab, _listColumnCol);


    _sectionContainer.append(
      _servicesCont, _tecnicalSupportCont, _colaborationCont, _feedbackCont, 
      _contactCont
    );

    _popupContent.append(_header, _sectionContainer);
    _outerContainer.append(_container.append(_popupContent));

    return _outerContainer;
  }

  ns.Widgets.EventContact = function(profileName){
    var _createdWidget = $('<div>').addClass('eventContactPopup');
    var _itext = $('<div>').append(
      $('<p>').html(Pard.t.text('contact.eventContact.mex1'))
    );
    var _ftext = $('<div>').append(
      $('<p>').html(Pard.t.text('contact.eventContact.mex2', { link: '<a href="/services", target="_blank">' +  Pard.t.text('contact.servicesTab.servicesPage')+ '</a>'})))
        .css('margin-top','.5rem');
    var _contactForm = Pard.Widgets.BusinessForm(profileName);
    _createdWidget.append(_itext, _contactForm, _ftext);

    return _createdWidget;
  }


  ns.Widgets.ContactOrfheo = function(){
    var _createdWidget = $('<div>').addClass('eventContactPopup');
    var _textColumn = $('<div>').append($('<p>').text('Estamos siempre disponibles para proporcionarte ayuda técnica, consejos, responder a tus preguntas o darte información útil cuando más lo necesites.'), $('<p>').text('Envíanos un mensaje, te contestaremos enseguida :)'));
    var _form = Pard.Widgets.TecnicalSupportForm();
    var _formContainer = $('<div>').append(_form);
    _createdWidget.append(_textColumn, _formContainer);
    return _createdWidget;
  }

	ns.Widgets.CoockiesPolicy = function(){
	   var _createdWidget = $('<div>').append(
		$('<p>').text(Pard.t.text('popup.termsAndConditions.cookiesMex1')),
    $('<p>').text(Pard.t.text('popup.termsAndConditions.cookiesMex2')),
    $('<p>').text(Pard.t.text('popup.termsAndConditions.cookiesMex3')),
    $('<p>').text(Pard.t.text('popup.termsAndConditions.cookiesMex4'))
		);

		return _createdWidget;
	}

	ns.Widgets.TermsAndConditionsMessage = function(){
    var _createdWidget = $('<div>');

    var _image = $('<div>').addClass('orfheo-symbol-popup');
    var _web = $('<p>').text('orfheo.org').addClass('orfheo-web-popup');
    var _title = $('<h4>').text(Pard.t.text('popup.termsAndConditions.title')).addClass('title-project-info');
    var _lastModify = $('<div>').append($('<p>').text(Pard.t.text('popup.termsAndConditions.date')).addClass('conditions-lastModify')).addClass('conditions-par');
    var _part1 = $('<div>').html(Pard.t.text('popup.termsAndConditions.part1')).addClass('conditions-par');

    var _subtitle2 = $('<h5>').text(Pard.t.text('popup.termsAndConditions.subtitle2')).addClass('subtitle-conditions');
    var _mex2  = Pard.t.text('popup.termsAndConditions.subtitle2');
    var _part2 = $('<div>').append(_subtitle2, _mex2).addClass('conditions-par');

    var _subtitle3 = $('<h5>').text(Pard.t.text('popup.termsAndConditions.subtitle3')).addClass('subtitle-conditions');
    var _mex3  = Pard.t.text('popup.termsAndConditions.mex3');
    var _part3 = $('<div>').append(_subtitle3, _mex3).addClass('conditions-par');

    var _subtitle4 = $('<h5>').text(Pard.t.text('popup.termsAndConditions.subtitle4')).addClass('subtitle-conditions');
    var _mex4  = Pard.t.text('popup.termsAndConditions.mex4') 
    var _part4 = $('<div>').append(_subtitle4, _mex4).addClass('conditions-par');

    var _subtitle5 = $('<h5>').text(Pard.t.text('popup.termsAndConditions.subtitle5')).addClass('subtitle-conditions');
    var _mex5  = Pard.t.text('popup.termsAndConditions.mex5')
    var _part5 = $('<div>').append(_subtitle5, _mex5).addClass('conditions-par');

    var _subtitle5_5 = $('<h5>').text(Pard.t.text('popup.termsAndConditions.subtitle5_5')).addClass('subtitle-conditions');
    var _mex5_5  = Pard.t.text('popup.termsAndConditions.mex5_5');
    var _part5_5 = $('<div>').append(_subtitle5_5, _mex5_5).addClass('conditions-par');

    var _subtitle_coockies = $('<h5>').text(Pard.t.text('popup.termsAndConditions.cookies')).addClass('subtitle-conditions');
    var _mex_coockies  = $('<p>').append(Pard.t.text('popup.termsAndConditions.cookiesMex1'),'<br>',Pard.t.text('popup.termsAndConditions.cookiesMex2'),'<br>',Pard.t.text('popup.termsAndConditions.cookiesMex3'));
    var _part_coockies = $('<div>').append(_subtitle_coockies, _mex_coockies).addClass('conditions-par');


    var _subtitle6 = $('<h5>').text(Pard.t.text('popup.termsAndConditions.subtitle6')).addClass('subtitle-conditions');
    var _mex6  = $('<p>').append(Pard.t.text('popup.termsAndConditions.mex6'));
    var _part6 = $('<div>').append(_subtitle6, _mex6).addClass('conditions-par');

    var _subtitle7 = $('<h5>').text(Pard.t.text('popup.termsAndConditions.subtitle7')).addClass('subtitle-conditions');
    var _finalMex = $('<div>').html(Pard.t.text('popup.termsAndConditions.finalMex'))

    _createdWidget.append(_image, _web, _title, _lastModify, _part1,_part2, _part3, _part4, _part5, _part5_5, _part_coockies, _part6, _subtitle7, _finalMex);

    return{
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
      }
    }
  
  }
 
 

	ns.Widgets.LanguagesMessage = function (){
    var _createdWidget = $('<div>');

    var _es = $('<p>').append($('<div>').addClass(), 'Español castellano');
    _es.css('cursor', 'pointer');
    _es.on('click', function(){
      Pard.Options.setLanguage('es');
    });
    
    var _val = $('<p>').append($('<div>').addClass('valencian-flag'), 'Valencià - Català');
    _val.css('cursor', 'pointer');
    _val.on('click', function(){
      Pard.Options.setLanguage('ca');
    });
    var _en = $('<p>').append($('<div>').addClass('english-flag'), 'English');
    _en.css('cursor', 'pointer');
    _en.on('click', function(){
      Pard.Options.setLanguage('en');
    });

    var _ita = $('<p>').append($('<div>').addClass('italian-flag'), 'Italiano');
    _ita.css('cursor', 'pointer');
    _ita.on('click', function(){
      Pard.Options.setLanguage('it');
    });

    _createdWidget.append(_es, _val, _en, _ita);

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

    var _baseline = $('<h6>').html('Se pueden hacer más cosas juntos que por separado<br> ').addClass('orfheo-baseline-popup');

    var _message = $('<div>').html('<p> Bienvenido a orfheo, </p> <p> una sitio especial, que llega a ser realidad, y entonces comunidad, gracias a todos sus ciudadanos. Orfheo es una plataforma para artistas, actores culturales, desarrolladores, makers, creativos, trabajadores sociales... personas libres de estrictas categorías y esquemas. </p> <p> Hemos creado un mundo único, una web no sólo capaz de facilitar el trabajo de organización y gestión de una convocatoria, sino de dar valor a las propuestas de los creadores mas allá de un mero encuentro. </p> <p> Estás en tu comunidad artistica online, donde lanzar tu convocatoria es fácil, y desde donde puedes mostrar tus proyectos y encontrar otros, útiles tanto para ti como para otros festivales y eventos. </p> <p> Tienes a tu alcance una herramienta, un mecanismo de gestión cultural con el cual crear y organzar eventos, descubrir a través de perfiles, enlaces y conexiones, llevar a la realidad sueños y ideas. </p> <p> Orfheo es un lugar donde colores diferentes encuentran su unidad en la común saturación, donde todo color es luz y la única forma de verlo es observándolo en relación con su entorno. </p> <p> Creemos en el poder del compartir y luchamos para que nuevas fronteras meritocráticas de vida sean posibles en el ecosistema del trabajo</p> <p> Creemos que este pequeño mundo pueda servir para estimular creaciones juntos y como espacio de intercambio donde una cosa expone a otra con la misma idea con la cual se ha creado. </p> <p> Queremos dar la posibilidad de utilizar esta herramienta a todas las personas que lo deseen,  y que respeten unas mínimas condiciones generales.</p> <p> Nos gustaría compartir nuestros conocimientos y seguir desarrollando este proyecto que acaba de empezar, para que todos los ciudadanos de orfheo puedan seguir disfrutando de la comunidad. </p> <p> Saber escuchar es fundamental  para poder seguir adelante, eres libre de expresarte y comunicarnos tu punto de vista en cualquier momento. </p> <p> Te dejamos a ti imaginar un poco más lo necesario y el compartir con los demás experiencias inolvidables.</p>');

    var _part1 = $('<div>').append(_message);

    var _subtitle = $('<h5>').text('Los pilares').addClass('subtitle-project-info');

    var _part2 = $('<div>').append(_subtitle).addClass('part2-message-project-info');

    var _list1 = $('<div>').html('<p>COMPARTIR <ul><li>Saber más el uno del otro significa aprender unos de otros. </li> <li> Compartimos nuestro valor donde valor = (experiencias + conocimientos) x actitud. </li> <li> Compartimos nuestras ideas e inspiraciones creativas con el fin de crear/inspirar experiencias enriquecedoras. </li> <li> Piensa en la comunidad y la comunidad pensará en ti. </li> </ul></p>');

    var _list2 = $('<div>').html('<p>IDENTIDAD <ul><li>Defendemos el individuo como algo único, auténtico, un punto en el espacio. Valoramos el grupo, como en el círculo cromático,  en el cual se une y se define la identidad personal, un rasgo cultural, un matiz, un color. </li> <li> Desempeñamos un papel activo en el desarrollo de un mundo libre, que se innova gracias al pequeño esfuerzo colectivo de muchas personas. </li> </ul></p>');

    var _list3 = $('<div>').html('<p>INFORMACIÓN <ul><li>La necesidad de información es más fuerte que todas las fronteras. Nos gustaría facilitar el acceso en tantos más idiomas posibles.  </li> <li> Queremos que tengas acceso a la información en cualquier lugar y en cualquier momento. </li> <li> No queremos que busques sino que encuentres en orfheo lo que esperabas encontrar. </li> </ul></p>');

    var _list4 = $('<div>').html('<p>EXPERIENCIA <ul><li>Sal de la red: queremos dar la mejor experiencia posible a los usuarios por encima de nuestros proprios beneficios y objetivos internos, para que los procesos sean cada vez más rápidos, para que se pueda vivir en orfheo sólo el tiempo necesario y utilizar su información en la vida cotidiana. </li> <li> Pretendemos evolucionar hacia una interfaz y una estética limpia, clara y sencilla, utilizable por todos. </li> </ul></p>');

    var _list5 = $('<div>').html('<p>ECONOMÍA <ul><li>Se puede ganar dinero siendo honestos y cuidando y defendiendo la comunidad. Con esta intención queremos hacer sostenible económicamente este proyecto y las vidas de quienes trabajan en ello. </li> </ul></p>');

    var _list6  = $('<div>').html('<p>VISIÓN <ul><li>Creemos que afrontar un proyecto debería ser divertido y apasionante. Creemos que una cultura de trabajo adecuada promueve el talento y la creatividad.  Los logros del equipo, y los éxitos individuales contribuyen al éxito global. Tenemos  una visión creativa del trabajo, del ocio y de la vida. </li> <li> Todas las ideas interesantes que surgen en los más diferentes contextos se comentan, se analizan en profundidad y si hace falta se ponen en práctica con calidad.  </li> <li> Elegimos y construimos colaborativamente. Nuestra meta es la unidad, no la unanimidad. Tomamos decisiones con método, de forma genuina y utilizando el consenso. Tenemos discusiones abiertas, animadas por un procesos que llevan a acuerdos en un tiempo razonable. </li> <li> Nos fijamos objetivos que sabemos tal vez no poder alcanzar, porque estamos convencidos de que a lo largo del camino, los esfuerzos, por cumplirlos, nos llevarán a obtener resultados, quizás diferentes de los esperados, pero igualmente valiosos. </li> </ul></p>');

    var _list7 = $('<div>').html('<p>MISIÓN <ul><li>Nuestra misión es estimular nuevas posibilidades culturales creadas por conexiones. </li> </ul></p>');

     // var _thanks = $('<div>').html('<p> <strong>Gracias</strong> a Xavi para alumbrar el camino y a la gente de la Cova y la Devscola por su fundamental ayuda en el proceso.</p> ').css('margin-top','2rem');

    _part2.append(_list1, _list2, _list3, _list4, _list5, _list6, _list7).hide();

    var _readMore = $('<a>').text('Leer más...')
      .css({
        'text-align':'right',
        'font-size':'14px'
      })
      .click(function(){
        _readMore.remove();
        _part2.show();
      })

    _createdWidget.append(_image, _web, _baseline, _part1, _readMore,_part2);

    return {
      render: function(){ 
        return _createdWidget
      }
    }
  }

}(Pard || {}));