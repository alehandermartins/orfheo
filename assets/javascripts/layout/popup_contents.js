'use strict';

(function(ns){
     
ns.Widgets = ns.Widgets || {};

  ns.Widgets.ServicesInfo = function(_popup){

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
    var _text = $('<div>').text('S e r v i c i o  s').addClass('textHeader-contactPopup');
   
    _header.append(_logo, _text, _closeBtn);

    var _servicesCont = $('<div>').addClass('services-contactInfo'); 
    var _titleServ = $('<h5>').text('¿Qué te ofrece orfheo?');  
    _servicesCont.append(_titleServ);

    var _textColumn = $('<div>')
      .append(
        $('<p>').html('blablabla'),
        $('<h6>').append('Plataforma de gestión:'),
        $('<p>').text('')
      )
      .addClass('half-col');
    
    var _formColumn = $('<div>').addClass('half-col');
    var _contactForm = $('<div>').addClass('contactForm-container');
    var _form = $('<form>');
    var _nameInput = Pard.Widgets.Input('Nombre','text');
    var _emailInput = Pard.Widgets.Input('Email','text');
    var _subjectInput = Pard.Widgets.Input('Asunto*','text');
    var _mexInput = Pard.Widgets.TextArea('Mensaje',6);
    var _submitBtn = Pard.Widgets.Button('Envía', function(){
      Pard.Backend.contact(_nameInput.getVal(), _emailInput.getVal(), _subjectInput.getVal(), _mexInput.getVal(), function(data){
        console.log(data);
        console.log(_nameInput.getVal());
        console.log(_mexInput.getVal());
      });
    });
    _form.append(_nameInput.render(), _emailInput.render(), _subjectInput.render(), _mexInput.render());
    _contactForm.append(_form, _submitBtn.render().addClass('submit-button'));
    var _textFormCol = $('<div>').append($('<p>').text('buf buf buf'));
    _formColumn.append(_textFormCol, _contactForm);

    _servicesCont.append(_textColumn, _formColumn);
   
    _sectionContainer.append(_servicesCont);

    _popupContent.append(_header, _sectionContainer);
    _outerContainer.append(_container.append(_popupContent));

    return _outerContainer;
  }


  ns.Widgets.ColaborationInfo = function(_popup){
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
    var _text = $('<div>').text('C o l a b o r a').addClass('textHeader-contactPopup');
      
    _header.append(_logo, _closeBtn, _text);

    var _colaborationCont = $('<div>').addClass('colaboration-contactInfo');
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
            $('<li>').html('como trabajador:</br>trabaja en orfheo como creativo, artista, diseñador, programador, community manager, gestor administrativo o comercial. Envíanos información sobre ti.'),
            $('<li>').html('como mecenas: </br>apoya de forma generosa una realidad, porque crees en ella. Apoyar orfheo significa ser parte de un proyecto con el potencial de mejorar nuestro mundo.'),
            $('<li>').html('como voluntario: </br>contáctanos si quieres aprender a través del desarrollo de orfheo o si ya tienes conocimientos y te estimula ofrecer tu tiempo a una noble causa.')
          )
        )
       .addClass('half-col list-col');
     _colaborationCont.append(_textColumnColab, _listColumnCol);
   
    _sectionContainer.append(_colaborationCont);

    _popupContent.append(_header, _sectionContainer);
    _outerContainer.append(_container.append(_popupContent));

    return _outerContainer;
  }


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
    var _services = $('<li>').text('Servicios').click(function(){
      $('.selected').removeClass('selected');
      _services.addClass('selected');
      $('.shown').hide();
      _servicesCont.show().addClass('shown');
    }).addClass('selected');
    var _tecnicalSupport = $('<li>').text('Soporte técnico')
    .click(function(){
      $('.selected').removeClass('selected');
      _tecnicalSupport.addClass('selected');
      $('.shown').hide();
      _tecnicalSupportCont.show().addClass('shown');
    });
    var _feedback = $('<li>').text('Feedback').click(function(){
      $('.selected').removeClass('selected');
      _feedback.addClass('selected');
      $('.shown').hide();
      _feedbackCont.show().addClass('shown');
    });
    var _colaboration = $('<li>').text('Colabora').click(function(){
      $('.selected').removeClass('selected');
      _colaboration.addClass('selected');
      $('.shown').hide();
      _colaborationCont.show().addClass('shown');
    });
    var _contact = $('<li>').text('Contacto').click(function(){
      $('.selected').removeClass('selected');
      _contact.addClass('selected');
      $('.shown').hide();
      _contactCont.show().addClass('shown');
    });
    _menuContainer.append(_menu.append(
      _services, _tecnicalSupport, _feedback, _colaboration, 
      _contact));
    var _text = $('<div>').text('C o n t a c t a').addClass('textHeader-contactPopup');
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

    var _titleServ = $('<h5>').text('¿Qué te ofrece orfheo?');  
    _servicesCont.append(_titleServ);
     var _textColumn = $('<div>')
      .append(
        $('<p>').html('Orfheo pretende crear y dar valor a las comunidades culturales y los encuentros que realmente existen o pueden generarse en la vida real. Por eso, las posibilidades que ofrecemos se centran principalmente en apoyar, impulsar y facilitar la creación, difusión y sobretodo <strong> la gestión de procesos y grandes eventos participativos</strong>. En específico, con orfheo puedes aprovechar los siguientes servicios:'),
        $('<h6>').append('Plataforma de gestión:'),
        $('<p>').text('Una potente herramienta web innovativa que te permite lanzar tu convocatoria y gestionar todos los datos relativos con extrema facilidad y simplicidad. Podrás consultar, organizar, filtrar y modificar las propuestas recibidas así como podrás crear nuevas para insertarlas en tu programación. Hacer el programa de tu evento será tan facil como arrastrar tarjetas dentro de un calendario y sacar listados de correo para contactar con artistas y espacios te costará un solo click. Podrás publicar online un programa interactivo, actualizable en cada momento, que perfectamente se adapta a cualquier dispositivo móvil funcionando como la guía perfecta para tu público.'),
        $('<h6>').append('Asesoría creativa:'),
        $('<p>').text('El equipo de orfheo cuenta con profesionales con mucha experiencia en la organización y gestión de grandes eventos participativos. Podrás aprovechar de un seguimiento constante durante todo el proceso de preparación de tu evento y descubrir nuevas estrategias creativas focalizadas en sacar y lograr el máximo de tu comunidad cultural.'),
        $('<h6>').append('Conexión API:'),
        $('<p>').text('El servicio API te permite recibir y utilizar los datos relativos a tus eventos y convocatorias en tu aplicación para móviles o sito web. Cualquier cambio que hagas en orfheo se actualizará de forma automática y simultánea en todas las plataformas conectadas. Podrás disponer de toda tu información siempre actualizada, donde y cuando tú quieras.')
          // .css({'margin-bottom':'2rem'}),
      )
      .addClass('half-col');
    var _formColumn = $('<div>').addClass('half-col');
    var _contactForm = Pard.Widgets.ContactForm();
    var _textFormCol = $('<div>').append(
      // $('<h6>').append('Conexión API:'),
      // $('<p>').text('El servicio API te permite recibir y entonces utilizar los datos relativos a tus eventos y convocatorias en tu aplicación para móviles o sito web. Cualquier cambio que harás en orfheo se actualizará de forma automática y simultanea en todas las plataformas conectadas. Podrás disponer de todas tus informaciones siempre actualizada donde y cuando tu quieras.').css({'margin-bottom':'2rem'}),
      $('<p>').html('Para más información, consulta nuestra <a href="/services", target="_blank"> página de servicios </a> y contáctanos a través del siguiente formulario:').css({'margin-bottom':'1.5rem'})
    );
    _formColumn.append(_textFormCol, _contactForm);
    _servicesCont.append(_textColumn, _formColumn);

    var _titleTecn = $('<h5>').text('¿Cómo podemos ayudarte?');  
    _tecnicalSupportCont.append(_titleTecn);
    var _textColumn = $('<div>').append($('<p>').text('Estamos aquí para proporcionarte ayuda técnica, consejos, responder a tus preguntas o darte información útil cuando más lo necesites.'), $('<p>').text('Te contestaremos enseguida.'), $('<p>').text(':)')).addClass('half-col');
    var _nameInput = Pard.Widgets.Input('Nombre*','text');
    var _emailInput = Pard.Widgets.Input('Email*','text');
    var _subjectInput = Pard.Widgets.Input('Asunto','text');
    var _profileInput = Pard.Widgets.Input('Nombre del perfil orfheo en cuestión', 'text');
    var _browserInput = Pard.Widgets.Input('Navegador que utilizas', 'text');
    var _mexInput = Pard.Widgets.TextArea('Mensaje*',6);
    var _submitBtn = Pard.Widgets.Button('Envía', function(){
      Pard.Backend.techSupport(_nameInput.getVal(), _emailInput.getVal(), _subjectInput.getVal(), _profileInput.getVal(), _browserInput.getVal(), _mexInput.getVal(), function(data){
        console.log(data);
        console.log(_nameInput.getVal());
        console.log(_mexInput.getVal());
      });
    });
    var _formColumn = $('<div>').append($('<form>').append(_nameInput.render(), _emailInput.render(), _subjectInput.render(), _profileInput.render(), _browserInput.render(), _mexInput.render()), _submitBtn.render().addClass('submit-button')).addClass('half-col');
    _tecnicalSupportCont.append(_textColumn, _formColumn);

    var _titleContact = $('<h5>').text('¡Aquí estamos!');  
    _contactCont.append(_titleContact);
    var _textContact = $('<p>').html('<strong> orfheo </strong></br>Calle nuestra señora de la asunción, 4b</br>Valencia (España) 46020</br> (0034) 633 753 471</br> <a href="mailto:info@orfheo.org">info@orfheo.org</a></br><a href="https://www.facebook.com/orfheo.org", target="_blank">Facebook</a>').css({'text-align':'center'});

    _contactCont.append(_textContact);

    var _titleFeed = $('<h5>').text('¿Qué te parece orfheo?');
    _feedbackCont.append(_titleFeed);
    var _textFeedColumn = $('<div>')
      .append(
        $('<p>').text('Para poder mejorar es necesario ponerse en juego y ser cuestionados. Estaríamos encantados de saber que piensas de orfheo, qué funcionalidades le faltan y te gustaría tener a tu alcance, qué cambiarías, quitarías o añadirías... '), 
        $('<p>').text('Cualquier crítica constructiva es bienvenida, nos ayudará a proporcionarte un servicio mejor.'), 
        $('<p>').text('¡Tu opinión es importante!')
      ).addClass('half-col');
    var _nameInput = Pard.Widgets.Input('Nombre*','text');
    var _emailInput = Pard.Widgets.Input('Email*','text');
    var _mexInput = Pard.Widgets.TextArea('Mensaje*',6);
    var _submitBtn = Pard.Widgets.Button('Envía', function(){
      Pard.Backend.feedback(_nameInput.getVal(), _emailInput.getVal(), _mexInput.getVal(), function(data){
        console.log(data);
        console.log(_nameInput.getVal());
        console.log(_mexInput.getVal());
      });
    });
    var _formFeedColumn = $('<div>').append($('<form>').append(_nameInput.render(), _emailInput.render(), _mexInput.render()), _submitBtn.render().addClass('submit-button')).addClass('half-col');
    _feedbackCont.append(_textFeedColumn, _formFeedColumn);

    var _colaborationCont = $('<div>').addClass('colaboration-contactInfo').hide();
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
            $('<li>').html('como partner: </br>si tienes un negocio y como nosotros crees que podemos hacer más cosas juntos que por separado, no dudes en enviarnos tu propuesta de alianza.'),
            $('<li>').html('como patrocinador: </br>gracias a ti, que quieres invertir y/o colaborar a través de publicidad y patrocinio, podemos ofrecer la posibilidad de ayudar económicamente a los proyectos de la comunidad orfheo.'),
            $('<li>').html('como trabajador:</br>trabaja en orfheo como creativo, artista, diseñador, programador, community manager, gestor administrativo o comercial. Envíanos información sobre ti.'),
            $('<li>').html('como mecenas: </br>apoya de forma generosa una realidad, porque crees en ella. Apoyar orfheo significa ser parte de un proyecto con el potencial de mejorar nuestro mundo.'),
            $('<li>').html('como voluntario: </br>contáctanos si quieres aprender a través del desarrollo de orfheo o si ya tienes conocimientos y te estimula ofrecer tu tiempo a una noble causa.')
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


	ns.Widgets.CoockiesPolicy = function(){
	   var _createdWidget = $('<div>').append(
		$('<p>').text('Las cookies son un elemento informático, ampliamente usado en internet, que una página web instala en el navegador de quien la visita. Es decir, que cuando uno accede a una página web, esta envía información a Chrome, Firefox, Internet Explorer, Opera... y esta información se almacena en la memoria del mismo. La idea es que la página web pueda comprobar esa información en el futuro y utilizarla.'),
    $('<p>').text('Orfheo utiliza cookies con el único fin de mejorar la experiencia de navegación de sus usuarios. Por ejemplo, guarda localmente información para permitir un login más rápido y continuado, evitar la desconexión del sitio en caso de reinicio del servidor y recordar preferencias o elecciones durante todo el proceso de navegación.'),
    $('<p>').text('En general, por como se estructura internet hoy en día, las cookies son un elemento imprescindible. Por ley, toda web que las utiliza, está obligada a avisar a sus usuarios para que sepan lo que está ocurriendo. '),
    $('<p>').text('La misma información de este popup está también en el apartado de condiciones de uso de la web. En caso de modificación se avisará a los ciudadanos de orfheo con suficiente antelación.')
		);

		return _createdWidget;
	}


  ns.Widgets.ContactForm = function(){
    var _contactForm = $('<div>').addClass('contactForm-container');
    var _form = $('<form>');
    var _errorBox = $('<p>');
    var _errorBoxCont = $('<div>').append(_errorBox);
    var _nameInput = Pard.Widgets.Input('Nombre*','text');
    var _emailInput = Pard.Widgets.Input('Email*','text');
    var _phoneInput = Pard.Widgets.InputTelContactForm('Numero de teléfono','text');
    var _phoneDayAvailabilty = Pard.Widgets.MultipleSelector(
      ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']);
      _phoneDayAvailabilty.setOptions({
        placeholder: "Selecciona tu disponibilidad durante la semana",
        selectAllText: "Todos los días",
        countSelected: false,
        allSelected: "Disponible todos los días"
      });

    var _phonePeriodAvailabilty = Pard.Widgets.MultipleSelector(
      [' Mañana', 'Tarde']);
    _phonePeriodAvailabilty.setOptions({
        placeholder: "Selecciona tu disponibilidad durante el día",
        selectAllText: "Mañana y tarde",
        countSelected: false,
        allSelected: "Disponible mañana y tarde"
      });
    var _phoneDayAvailabilityCont  = $('<div>').append(_phoneDayAvailabilty.render()).hide().addClass('availabilityContainer');
    var _phonePeriodAvailabiltyCont = $('<div>').append(_phonePeriodAvailabilty.render()).hide().addClass('availabilityContainer');
    var _showHideAvailability = function(){
      if (_checkPhone.getVal() || _checkHangout.getVal()){
        _phoneDayAvailabilityCont.show();
        _phonePeriodAvailabiltyCont.show();
      }else{
        _phoneDayAvailabilty.deselectAll();
        _phonePeriodAvailabilty.deselectAll();
        _phoneDayAvailabilityCont.hide();
        _phonePeriodAvailabiltyCont.hide();
      }
    }
    var _projectWebInput = Pard.Widgets.Input('Enlace a web/redes sociales de tu proyecto','text');
    var _subjectInput = Pard.Widgets.Input('Asunto*','text');
    var _checkPhone = Pard.Widgets.CheckBox(
      'Quiero ser contactado por teléfono',
      'call_me_please', 
      function(){
      _showHideAvailability();
      }
    );
    var _checkHangout = Pard.Widgets.CheckBox(
      'Quiero una cita por Hangout/Skype',
      'hangout_me_please',
      function(){
        _showHideAvailability();
      }
    );
    var _mexInput = Pard.Widgets.TextArea('Mensaje*',6);
    var businessInputs = {
      'name': _nameInput,
      'email': _emailInput,
      'subject': _subjectInput,
      'contactPhone': _checkPhone,
      'contactHangout': _checkHangout,
      'phone': _phoneInput,
      'dayAvailabilty': _phoneDayAvailabilty,
      'periodAvailabilty': _phonePeriodAvailabilty,
      'message': _mexInput
    }
    var _submitBtn = Pard.Widgets.Button('Envía', function(){
      _errorBox.empty();
      var businessForm = {};
      for (var key in businessInputs){
        businessForm[key] = businessInputs[key].getVal();
      }
      // var businessForm = {
      //   name: _nameInput.getVal(),
      //   email: _emailInput.getVal(),
      //   subject: _subjectInput.getVal(),
      //   contactPhone: _checkPhone.getVal(),
      //   contactHangout: _checkHangout.getVal(),
      //   phone: _phoneInput.getVal(),
      //   dayAvailabilty: _phoneDayAvailabilty.getVal(),
      //   periodAvailabilty: _phonePeriodAvailabilty.getVal(),
      //   message: _mexInput.getVal()
      // }
      var filled = true;
      ['name', 'email','subject','message'].forEach(function(field){
        if (!(businessForm[field])){
          businessInputs[field].addWarning();
          filled = false;
        }
      });
      if (filled){
        console.log(businessForm);
        Pard.Backend.business(businessForm, function(data){
          console.log(data)
          if (data['status'] == 'success'){
            _submitBtn.disable();
            _submitBtn.setClass('disabled-button');
            _errorBox.empty().append(
              Pard.Widgets.IconManager('done').render().addClass('success-icon-check-messageSent'),
              $('<span>').text('Mensaje enviado correctamente. '),
              $('<span>').html('Gracias por contactar con nosotros.<br> Te contestaremos cuanto antes :)')
            ).removeClass('error-text');
          }
          else{
            _errorBox.empty().text('Mensaje no enviado: '+data.reason).addClass('error-text');
          }
        });
      }
      else{
        _errorBox.empty().text('Mensaje no enviado. Por favor, revisa los campos obligatorios').addClass('error-text');
      }
    });
    _form.append(
      _nameInput.render(), 
      _emailInput.render(), 
      _phoneInput.render(), 
      _checkPhone.render().addClass('checkBox-contactForm'),
      _checkHangout.render().addClass('checkBox-contactForm'),
      _phoneDayAvailabilityCont, 
      _phonePeriodAvailabiltyCont,
      _projectWebInput.render(),
      _subjectInput.render(), 
      _mexInput.render());
    _contactForm.append(_form, _submitBtn.render().addClass('submit-button'), _errorBox);

    

    return _contactForm;
  }


	ns.Widgets.TermsAndConditionsMessage = function(){
    var _createdWidget = $('<div>');

    var _image = $('<div>').addClass('orfheo-symbol-popup');

    var _web = $('<p>').text('orfheo.org').addClass('orfheo-web-popup');

    var _title = $('<h4>').text('Condiciones generales').addClass('title-project-info');

    var _lastModify = $('<div>').append($('<p>').text('Última actualización: 1 de Mayo 2016').addClass('conditions-lastModify')).addClass('conditions-par');
    
    var _part1 = $('<div>').html('<p> <strong>Te damos la bienvenida!</strong></p><p> <strong>Orfheo se basa en un principio potente: podemos hacer más cosas juntos que por separado.</strong></p><p>Son las personas como tú las que hacen posible que este lugar no solo exista, sino que también crezca y prospere. </br> Estas condiciones generales de uso explican el servicio y la relación entre los usuarios, los derechos y las responsabilidades recíprocas. </br> <strong> Ser parte de orfheo es gratuito </strong> y al hacerlo estás aceptando estas condiciones generales.</p>').addClass('conditions-par');


    var _subtitle2 = $('<h5>').text('Principios generales:').addClass('subtitle-conditions');
    var _mex2  = '<p>Orfheo no tiene normas firmes más allá de los principios generales enunciados aquí: <ul><li>Respeta a los ciudadanos de orfheo incluso cuando no estés de acuerdo con ellos. </li> <li> Comparte contenidos civilizadamente, evita los ataques personales y las generalizaciones asi como la publicación de enlaces o textos que puedan ser en sus contenidos ofensivos para la comunidad, racistas, sexistas, homófobos o que incitan a la violencia de cualquier tipo. </li> <li>  Actúa con buena fe, se abierto, acogedor e inclusivo.  </li> <li> Si no respetaras estos principios nos pondremos en contacto contigo para que nos puedas dar una explicación y juntos poder encontrar una solución. </li> </ul></p>'
    var _part2 = $('<div>').append(_subtitle2, _mex2).addClass('conditions-par');


    var _subtitle3 = $('<h5>').text('Nos comprometemos a:').addClass('subtitle-conditions');
    var _mex3  = '<p><ul><li>Describir cómo puede usarse o compartirse tu información en estas condiciones generales. </li> <li> Usar las medidas razonables para mantener tu información sensible segura.  </li> <li>  Hacer disponible y dejar fluir en la comunidad la información que decidas compartir.  </li> <li> Impulsar valores tales como la solidaridad, el sentido de comunidad, la meritocracia, la equidad, el respeto y la armonía con el entorno.  </li> <li> Respetar y defender la comunidad de orfheo. </li> <li> Escuchar y acoger cualquier tipo de sugerencia y crítica constructiva. </li></ul></p>'	
    var _part3 = $('<div>').append(_subtitle3, _mex3).addClass('conditions-par');


    var _subtitle4 = $('<h5>').text('Términos de uso y Privacidad:').addClass('subtitle-conditions');
    var _mex4  = '<p>Aquí te explicamos cómo recolectamos y compartimos tu información personal/datos/contenidos.<ul><li>Recolectamos muy poca información personal acerca de ti. </li> <li> No alquilamos ni vendemos tu información a terceros, es decir que no compartimos tus datos con terceras partes para propósitos de mercadeo.  </li> <li>  Cabe la posibilidad de que la información recogida en orfheo se comparta con terceros de acuerdo con nuestra ideología, cumpliendo con la ley y con la intención de traer beneficio a toda la comunidad.  </li> <li>Eres responsable de los contenidos que compartes y de sus medidas de privacidad.  </li> <li> Ocasionalmente te mandaremos correos electrónicos con respecto a información importante. </li> <li>  La calidad de los datos que nos proporcionas es útil para ti, para que podamos mejorar tu experiencia como usuario y poder desarrollar nuevas funciones, para que tu experiencia sea inolvidable. </li> <li> Todo lo que publicas en orfheo es público, puede ser visto y eventualmente usado por todo observador externo. </li> <li> Es posible que te pidamos nos proporciones información a través de una encuesta o retro-alimentación, pero nunca estarás obligado a participar en éstas. </li> <li> No necesitas crear una cuenta para explorar y visualizar cualquiera de los contenidos. </li> <li> Si creas una cuenta,  necesitas darnos sólo tu dirección de correo electrónico. </li> <li> Nadie es mas importante que nadie.  El orden de los resultados de búsqueda y los perfiles no se manipulan en ningún momento para que nadie ocupe una posición aventajada. </li> <li> Cualquier persona puede unirse y abandonar orfheo en cualquier momento.  Cancelando una cuenta, toda la información relacionada será borrada permanentemente.</li> </ul></p>'
    var _part4 = $('<div>').append(_subtitle4, _mex4).addClass('conditions-par');


    var _subtitle5 = $('<h5>').text('Publicidad:').addClass('subtitle-conditions');
    var _mex5  = '<p>Ahora mismo no hay ninguna forma de publicidad dentro de orfheo. En un futuro, no se excluye la presencia de publicidad no molesta, relacionada con el mundo artístico-cultural, que pueda proporcionar información útil y valiosa para los ciudadanos. Consideramos que la publicidad puede ser eficaz sin ser molesta. Excluimos la presencia de publicidad en forma de ventanas emergentes que pueden interferir con la visualización de los contenidos de orfheo. </p>'
    var _part5 = $('<div>').append(_subtitle5, _mex5).addClass('conditions-par');

    var _subtitle5_5 = $('<h5>').text('Sostenibilidad del proyecto:').addClass('subtitle-conditions');
    var _mex5_5  = '<p>Como prometido, ser parte de orfheo no tiene y no tendrá ningún coste para ningún usuario. Sin embargo, el mantenimiento online de una web de este tipo tiene un coste, así como la sostenibilidad de la vida de las personas que trabajan diariamente en ello. Por lo tanto, lanzar una convocatoria y poder acceder a la relativa herramienta de gestión tiene un precio, que se decide juntos después de haber analizado el tipo de evento que se quiere organizar.</p>'
    var _part5_5 = $('<div>').append(_subtitle5_5, _mex5_5).addClass('conditions-par');

    var _subtitle_coockies = $('<h5>').text('Política de cookies:').addClass('subtitle-conditions');
    var _mex_coockies  = '<p> Las cookies son un elemento informático, ampliamente usado en internet, que una página web instala en el navegador de quien la visita. Es decir, que cuando uno accede a una página web, esta envía información a Chrome, Firefox, Internet Explorer, Opera... y esta información se almacena en la memoria del mismo. La idea es que la página web pueda comprobar esa información en el futuro y utilizarla.</br> Orfheo utiliza coockies con el único fin de mejorar la experiencia de navegación de sus usuarios. Por ejemplo, guarda localmente informaciones para permitir un login más rápido y continuado, evitar la desconexión del sitio en caso de reinicio del servidor, recordar preferencias o elecciones durante todo el proceso de navegación. </br> En general, por como se estructura internet hoy en día, las coockies son un elemento imprescindible. Por ley, toda web que las utiliza, está obligada a avisar sus usuarios para que sepan lo que está ocurriendo. </p>'
    var _part_coockies = $('<div>').append(_subtitle_coockies, _mex_coockies).addClass('conditions-par');


    var _subtitle6 = $('<h5>').text('Actualizaciones:').addClass('subtitle-conditions');

    var _mex6  = '<p>Nos reservamos el derecho de modificar, si necesario, las condiciones generales para adaptarlas a futuras novedades y asumimos el deber y el compromiso de informar de los cambios a todos los ciudadanos  de orfheo, previamente y con tiempo, para que puedan conocer las actualizaciones de antemano.  </p>'

    var _part6 = $('<div>').append(_subtitle6, _mex6).addClass('conditions-par');


    var _subtitle7 = $('<h5>').text('¡Muchas gracias!').addClass('subtitle-conditions');

    var _finalMex = $('<div>').html('<p> Si tienes preguntas o sugerencias  envía un correo electrónico a <a href="mailto:info@orfheo.org"> info@orfheo.org</a>.</p> <p> Gracias por leer hasta aquí. Esperamos que disfrutes dentro y fuera orfheo. </br> Tu participación al crear, mantener y mejorar este lugar es imprescindible. </p> <p> Apreciamos que te hayas tomado tu tiempo para informarte sobre el proyecto, y te agradecemos que contribuyas. Mediante lo que haces, estás ayudando a construir algo realmente importante, no sólamente una conexión de proyectos compartidos de manera colaborativa, sino también una vibrante comunidad enfocada en una muy noble meta. </p>')


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

    // var _title = $('<h4>').text('Todo sobre el proyecto').addClass('title-project-info');
    var _message = $('<div>').html('<p> Bienvenido a orfheo, </p> <p> una sitio especial, que llega a ser realidad, y entonces comunidad, gracias a todos sus ciudadanos. Orfheo es una plataforma para artistas, actores culturales, desarrolladores, makers, creativos, trabajadores sociales... personas libres de estrictas categorías y esquemas. </p> <p> Hemos creado un mundo único, una web no sólo capaz de facilitar el trabajo de organización y gestión de una convocatoria, sino de dar valor a las propuestas de los creadores mas allá de un mero encuentro. </p> <p> Estás en tu comunidad artistica online, donde lanzar tu convocatoria es fácil, y desde donde puedes mostrar tus proyectos y encontrar otros, útiles tanto para ti como para otros festivales y eventos. </p> <p> Tienes a tu alcanze una herramienta, un mecanismo de gestión cultural con el cual crear y organzar eventos, descubrir a través de perfiles, enlaces y conexiones, llevar a la realidad sueños y ideas. </p> <p> Orfheo es un lugar donde colores diferentes encuentran su unidad en la común saturación, donde todo color es luz y la única forma de verlo es observándolo en relación con su entorno. </p> <p> Creemos en el poder del compartir y luchamos para que nuevas fronteras meritocráticas de vida sean posibles en el ecosistema del trabajo</p> <p> Creemos que este pequeño mundo pueda servir para estimular creaciones juntos y como espacio de intercambio donde una cosa expone a otra con la misma idea con la cual se ha creado. </p> <p> Queremos dar la posibilidad de utilizar esta herramienta a todas las personas que lo deseen,  y que respeten unas mínimas condiciones generales.</p> <p> Nos gustaría compartir nuestros conocimientos y seguir desarrollando este proyecto que acaba de empezar, para que todos los ciudadanos de orfheo puedan seguir disfrutando de la comunidad. </p> <p> Saber escuchar es fundamental  para poder seguir adelante, eres libre de expresarte y comunicarnos tu punto de vista en cualquier momento. </p> <p> Te dejamos a ti imaginar un poco más lo necesario y el compartir con los demás experiencias inolvidables.</p>');

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

    _part2.append(_list1, _list2, _list3, _list4, _list5, _list6, _list7);

    _createdWidget.append(_image, _web, _baseline, _part1, _part2);

    return {
      render: function(){ 
        return _createdWidget
      }
    }
  }

}(Pard || {}));