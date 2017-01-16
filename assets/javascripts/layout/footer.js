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

    var _leftMenu = $('<ul>').addClass('leftFooter-menu');

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
      .html('Condiciones')
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
      .html('Proyecto')
      .addClass('footer-text-link')
      .one('click',function(){
        var _infoMessage =  Pard.Widgets.ProjectInfoMessage().render();
        _infoPopup = Pard.Widgets.Popup();
        _infoPopup.setContent('', _infoMessage);
      })
      .on('click',function(){
        _infoPopup.open();
      });

    _leftContent.append(_leftMenu.append($('<li>').append(_information), $('<li>').append(_termsAndConditions), $('<li>').append(_languages)));

    // var _project = $('<span>').text('orfheo proyecto comunitario');
    // var _place = $('<span>').text('Benimaclet, Valencia 2016');
    var _content = $('<div>').addClass('very-fast reveal full');
   
    $(document).ready(function(){
      $('body').append(_content);
    });

    var _rightMenu = $('<ul>').addClass('rightFooter-menu');

    var _contactPopup;
    var _contactInfo;
    var _contactaOrfheo = $('<li>').append($('<a>').text('Contacta')
      .attr('href','#/'))
      .one('click',function(){
        _contactPopup =  new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', multipleOpened:true});
        _contactInfo = Pard.Widgets.ContactInfo(_contactPopup);
      })
      .on('click',function(){
        _content.empty().append(_contactInfo);
        _contactPopup.open();
      });

    var _collabPopup;
    var _colabInfo;
    var _collabOrfheo = $('<li>').append($('<a>').text('Colabora')
      .attr('href','#/'))
      .one('click',function(){
        _collabPopup =  new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', multipleOpened:true});
        _colabInfo = Pard.Widgets.ColaborationInfo(_collabPopup);
      })
      .on('click',function(){
        _content.empty().append(_colabInfo);
        _collabPopup.open();
      });

    var _servicesPopup;
    var _servicesInfo;
    var _servicesOrfheo = $('<li>').append($('<a>').text('Servicios')
      .attr('href','#/'))
      .one('click',function(){
        _servicesPopup =  new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', multipleOpened:true});
        _servicesInfo = Pard.Widgets.ServicesInfo(_servicesPopup);
      })
      .on('click',function(){
        _content.empty().append(_servicesInfo);
        _servicesPopup.open();
      });

    // _rightContent.append(_project, ' | ', _place);
    _rightContent.append(_rightMenu.append(_servicesOrfheo, _collabOrfheo,_contactaOrfheo));

    _container.append(_leftContent,_rightContent);
    _grid.append(_container);
    _createdWidget.append(_grid);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

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
   
    _header.append(_logo, _closeBtn);

    var _servicesCont = $('<div>').addClass('services-contactInfo'); 
    var _titleServ = $('<h5>').text('¿Qué puedes hacer con orfheo?');  
    _servicesCont.append(_titleServ);

   
    _sectionContainer.append(_servicesCont);

    _popupContent.append(_header, _sectionContainer);
    _outerContainer.append(_container.append(_popupContent));

    return _outerContainer;
  }


  ns.Widgets.ColaborationInfo = function(){
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
   
    _header.append(_logo, _closeBtn);

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
            $('<li>').html('como trabajador:</br>trabaja en orfheo como creativo, artista, diseñador, programador, community manager, gestor administrativo o comercial. Envianos informaciones sobre ti.'),
            $('<li>').html('como mecena: </br>apoya de forma generosa una realidad, porque crees en ella. Apoyar orfheo significa ser parte de un proyecto con el potencial de mejorar nuestro mundo.'),
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
    var _tecnicalSupport = $('<li>').text('Soporte técnico').click(function(){
      $('.selected').removeClass('selected');
      _tecnicalSupport.addClass('selected');
      $('.shown').hide();
      _tecnicalSupportCont.show().addClass('shown');
    }).addClass('selected');
    // var _colaboration = $('<li>').text('Colabora').click(function(){
    //   $('.selected').removeClass('selected');
    //   _colaboration.addClass('selected');
    //   $('.shown').hide();
    //   _colaborationCont.show().addClass('shown');
    // });
    // var _services = $('<li>').text('Servicios').click(function(){
    //   $('.selected').removeClass('selected');
    //   _services.addClass('selected');
    //   $('.shown').hide();
    //   _servicesCont.show().addClass('shown');
    // });
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
    _menuContainer.append(_menu.append(_tecnicalSupport, _feedback,  _contact));
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

    // var _titleColab = $('<h5>').text('¿Quieres ser parte?');  
    // _colaborationCont.append(_titleColab);
    // var _textColumnColab = $('<div>')
    //   .append(
    //     $('<p>').text('Nos gustaría compartir conocimientos y seguir desarrollando este proyecto para que todos los ciudadanos de orfheo puedan siempre disfrutar de la comunidad y para dar la posibilidad de utilizar esta herramienta a todas las personas que lo deseen.'), 
    //     $('<p>').text('Creemos que la inclusión inspira la innovación y por lo tanto siempre estamos abiertos a escuchar ideas para colaborar.'), 
    //     $('<p>').append('Contáctanos a ', $('<a>').attr('href','mailto:info@orfheo.org').text('info@orfheo.org'))
    //   )
    //   .addClass('half-col');
    //  var _listColumnCol = $('<div>')
    //    .append(
    //       $('<p>').text('Hay muchas formas de colaborar en orfheo:').css('margin-bottom','0.5rem'),
    //       $('<ul>').append(
    //         $('<li>').html('como partner: </br>si tienes un negocio y como nosotros crees que podemos hacer más cosas juntos que por separados, no dudes en enviarnos tu propuesta de alianza.'),
    //         $('<li>').html('como patrocinador: </br>gracias a ti, que quieres invertir y/o colaborar a través publicidad y patrocinio, podemos ofrecer la posibilidad de ayudar económicamente a los proyectos de la comunidad orfheo.'),
    //         $('<li>').html('como trabajador:</br>trabaja en orfheo como creativo, artista, diseñador, programador, community manager, gestor administrativo o comercial. Envianos informaciones sobre ti.'),
    //         $('<li>').html('como mecena: </br>apoya de forma generosa una realidad, porque crees en ella. Apoyar orfheo significa ser parte de un proyecto con el potencial de mejorar nuestro mundo.'),
    //         $('<li>').html('como voluntario: </br>contáctanos si quieres aprender a través del desarrollo de orfheo o si ya tienes conocimientos y te estimula ofrecer tu tiempo a una noble causa.')
    //       )
    //     )
    //    .addClass('half-col list-col');
    //  _colaborationCont.append(_textColumnColab, _listColumnCol);

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


    _sectionContainer.append(_tecnicalSupportCont, _contactCont, _feedbackCont);

    _popupContent.append(_header, _sectionContainer);
    _outerContainer.append(_container.append(_popupContent));

    return _outerContainer;
  }


}(Pard || {}));
