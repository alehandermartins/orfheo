'use strict';

(function(ns){
  ns.Widgets = ns.Widgets || {};

   ns.Widgets.IconManager = function(icon_name){

    var _iconDictionary = {
      settings: {icon: '&#xE8B8;', className:'materials-icon'},
      space: {icon: '&#xE88A;', className: 'material-icons'},
      artist: {icon: '&#xE7FD;', className: 'material-icons'},
      organization: {icon:'&#xE7EF', className:'material-icons'},
      music: {icon: '&#xE405;', className: 'material-icons'},
      arts: {icon: '', className: 'icon-theatre'},
      expo: {icon: '&#xE3F4;', className: 'material-icons'},
      poetry: {icon: '', className: 'icon-book-open'},
      audiovisual: {icon: '&#xE04B;', className: 'material-icons'},
      street_art: {icon: '&#xE243;', className: 'material-icons'},
      workshop: {icon: '', className: 'fa fa-cubes'},
      other: {icon: '&#xE155;', className: 'material-icons'},
      gastronomy: {icon:'&#xE556;', className:'material-icons' },
      modify_section_content: {icon: '&#xE150;', className: 'material-icons'},
      modify:{icon: '&#xE150;', className: 'material-icons'},
      information: {icon: '&#xE061;', className: 'material-icons'},
      city_artist: {icon: '&#xE55F;', className: 'material-icons'},
      address_space: {icon: '&#xE55F;', className: 'material-icons'},
      my_web: {icon: '&#xE80B;', className: 'material-icons'},
      icon_social: {icon: '&#xE315;', className: 'material-icons'},
      proposals: {icon: '&#xE6DD;', className: 'material-icons'},
      visibility: {icon: '&#xE8F4;', className: 'material-icons'},
      export: {icon: '&#xE2C4', className: 'material-icons'},
      mailinglist: {icon: '&#xE0D0', className: 'material-icons'},
      search: {icon: '&#xE8B6', className: 'material-icons'},
      current_event: {icon: '&#xE3AF;', className: 'material-icons'},  
      // children: {icon: '&#xE903;', className: 'material-icons'},
      children: {icon: '&#xE63D;', className: 'material-icons'},
      baby:{icon: '&#xEB41;', className: 'material-icons'},
      duration: {icon: '&#xE425;', className: 'material-icons'},
      multimedia: {icon: '&#xE6C4;', className: 'material-icons'},
      flag: {icon: '&#xE153;', className: 'material-icons'},
      done: {icon: '&#xE876;', className: 'material-icons'},
      add_circle: {icon:'&#xE147;', className:'material-icons'},
      menu: {icon:'&#xE8EE;', className:'material-icons'},
      left_arrow_block: {icon:'&#xE5DC;', className:'material-icons'},
      right_arrow_block: {icon:'&#xE5DD;', className:'material-icons'},
      navigation_left: {icon:'&#xE408;', className:'material-icons'},
      navigation_right: {icon:'&#xE409;', className:'material-icons'},
      save: {icon:'&#xE161;', className:'material-icons'},
      clock: {icon:'&#xE192;', className:'material-icons'},
      location: {icon:'&#xE0C8;', className:'material-icons'},
      organizer: {icon:'&#xE43B;', className:'material-icons' },
      comments: {icon:'&#xE0B9;', className:'material-icons' },
      tools: {icon:'&#xE869;', className:'material-icons' },
      conditions: {icon:'&#xE873;', className:'material-icons' },
      delete: {icon:'&#xE872;', className:'material-icons' },
      time: {icon:'&#xE192;', className:'material-icons' },
      arrowDropDown: {icon:'&#xE5C5;', className:'material-icons' },
      arrowDropUp: {icon:'&#xE5C7;', className:'material-icons' },
      calendar: {icon:'&#xE916;', className:'material-icons' },
      sincro: {icon:'&#xE627;', className:'material-icons'},
      chat_bubble:{icon:'&#xE0CB;', className:'material-icons'},
      arrow_down:{icon:'&#xE313;', className:'material-icons'},
      arrow_up:{icon:'&#xE316;', className:'material-icons'},
      publish: {icon:'&#xE8CD;', className:'material-icons'},
      unpublish: {icon:'&#xE92A;', className:'material-icons'},
      tags:{icon: '&#xE54E;', className:'material-icons'},
      attention:{icon:'&#xE645;', className:'material-icons'},
      phone:{icon:'&#xE0CD;', className:'material-icons'},
      cache:{icon:'&#xE227;', className:'material-icons'},
      stage:{icon:'&#xE0C8;', className:'material-icons'},
      performer:{icon:'&#xE029;', className:'material-icons'},
      // calendar: {icon:'&#8250;', className:'fa fa-calendar'}, &#xE53B
      hide_right_list: {icon:'&#8250;', className:'fa fa-bars'},      
      hide_left_list: {icon:'&#8249;', className:'fa fa-bars'},
      circle_arrow_up: {icon:'', className:'fa fa-arrow-circle-up'},
      sort: {icon:'', className: 'fa fa-sort'},      
      chained: {icon:'', className: 'fa fa-link'},
      unchained: {icon:'', className: 'fa fa-chain-broken'},
      open_call: {icon:'', className: 'fa fa-bullhorn'},
      arrow_circle_right: {icon:'', className: 'fa fa-arrow-circle-right'},
      arrow_circle_left: {icon:'', className: 'fa fa-arrow-circle-left'},
      youtube: {icon: '', className: 'fa fa-youtube'},
      vimeo: {icon: '', className: 'fa fa-vimeo'},
      flickr: {icon: '', className: 'fa fa-flickr'},
      twitter: {icon: '', className: 'fa fa-twitter'},
      soundcloud: {icon: '', className: 'fa fa-soundcloud'},
      spotify: {icon: '', className: 'fa fa-spotify'},
      facebook: {icon: '', className: 'fa fa-facebook'},
      instagram: {icon: '', className: 'fa fa-instagram'},
      pinterest: {icon: '', className: 'fa fa-pinterest-p'},
      vine: {icon: '', className: 'fa fa-vine'},
      bandcamp: {icon: '', className: 'icon-bandcamp'}
    };

    var _createdWidget = $('<span>');
    if(_iconDictionary[icon_name]) _createdWidget.addClass(_iconDictionary[icon_name]['className']).html(_iconDictionary[icon_name]['icon']);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.Dictionary = function(voice){

    var _dictionary = {
      artist: Pard.t.text('type.artist'),
      space: Pard.t.text('type.space'),
      spaces: Pard.t.text('type.spaces'),
      organization: Pard.t.text('type.organization'),
      cultural_ass: Pard.t.text('categories.cultural_ass'),
      commercial: Pard.t.text('categories.commercial'),
      home: Pard.t.text('categories.home'),
      open_air: Pard.t.text('categories.open_air'),
      music: Pard.t.text('categories.music'),
      arts: Pard.t.text('categories.arts'),
      expo: Pard.t.text('categories.expo'),
      poetry: Pard.t.text('categories.poetry'),
      audiovisual: Pard.t.text('categories.audiovisual'),
      street_art: Pard.t.text('categories.street_art'),
      workshop: Pard.t.text('categories.workshop'),
      other: Pard.t.text('categories.other'),
      gastronomy: Pard.t.text('categories.gastronomy'),
      festival: Pard.t.text('categories.festival'),
      association: Pard.t.text('categories.association'), 
      ngo: Pard.t.text('categories.ngo'), 
      collective: Pard.t.text('categories.collective'),
      interprise: Pard.t.text('categories.interprise'), 
      institution: Pard.t.text('categories.institution'),
      federation: Pard.t.text('categories.federation'),
      foundation: Pard.t.text('categories.foundation'),
      all_public:Pard.t.text('widget.inputChildren.all_public'),
      baby: Pard.t.text('widget.inputChildren.baby'), 
      family:Pard.t.text('widget.inputChildren.family'), 
      young: Pard.t.text('widget.inputChildren.young'),  
      adults: Pard.t.text('widget.inputChildren.adults'),
      
      already_registered: function(){return Pard.Widgets.RecoverPasswdMessage('¡Usuario ya registrado!')},
      non_existing_user: function(){return Pard.Widgets.NoExistingUserMessage()},
      invalid_parameters: '<div>Los parámetros insertados no son validos!<br/> Por favor, revísalos.</div>',
      invalid_email: '<div>¡El correo no es correcto!<br/> Por favor, vuelve a intentar.</div>',
      incorrect_password: function(){return Pard.Widgets.RecoverPasswdMessage('¡Contraseña equivocada!')},
      invalid_password: '<div>¡Password no valida!</div>',
      not_validated_user:function(){return Pard.Widgets.NotValidatedUserMessage()},
      out_of_time_range: '<h4 style="margin-top:-1.2rem;">Convocatoria Cerrada</h4> <div>Tu propuesta no ha sido enviada.</div>',
      invalid_type: 'Tipo de perfil no valido.',
      existing_profile: 'Ya existe un perfil con este nombre. Escoge otro.',
      non_existing_profile: '<h4 style="margin-top:-1.2rem;">Error</h4> <div>¡Perfil no existente!</div>',
      non_existing_proposal: '<h4 style="margin-top:-1.2rem;">Error</h4> <div>¡Propuesta no existente!</div>',
       non_existing_production: '<h4 style="margin-top:-1.2rem;">Error</h4> <div>¡Producción artística no existente!</div>',
      invalid_category:'<h4 style="margin-top:-1.2rem;">Error</h4> <div>¡Categoría no valida!</div>',
      existing_call: '<h4 style="margin-top:-1.2rem;">Error</h4> <div>Convocatoria ya exitente.</div>',
      non_existing_call:'<h4 style="margin-top:-1.2rem;">Error</h4> <div>No existe esta convocatoria.</div>',
      you_dont_have_permission: '<h4 style="margin-top:-1.2rem;">Error</h4> <div>Perdiste la conexión...vuelve a logearte e inténtalo de nuevo.</div>',
      invalid_query: '<h4 style="margin-top:-1.2rem;">Error</h4> <div>Acción no valida.</div>',
      non_existing_event:'<h4 style="margin-top:-1.2rem;">Error</h4> <div>No existe este evento.</div>',
      existing_name: '<div>El nombre de perfil que has decidido ya existe. Por favor, escoge otro.</div>',
      
      'Artes Escénicas': 'arts',
      'Audiovisual': 'audiovisual',
      'Exposición':'expo',
      'Música': 'music',
      'Poesía': 'poetry',
      'Street Art': 'street_art',
      'Taller':'workshop',
      'Otros': 'other',
      'Gastronomía':'gastronomy',
      'Infantil':'children'
    }

    return {
      render: function(){
        if (_dictionary[voice]){
          if (typeof _dictionary[voice] == 'function') return _dictionary[voice]();
          return _dictionary[voice];
        }
        else{return voice;}
      }
    }
  }


  ns.Widgets.RecoverPasswdMessage = function(text){
      var _messageContainer = $('<div>');
      var _message  = $('<div>').text(text).css({
        'font-size': '18px',
        'margin-bottom':'1rem'
      });
      
      var _emailRecovery = $('<div>');
      var _caller = $('<a>').attr('href','#/').text(Pard.t.text('login.dropdown.recover'));

      var _popup;
      _caller
        .one('click', function(){
          _popup = Pard.Widgets.Popup();
        })
        .click(function(){
          var _recoveryMessage = Pard.Widgets.RecoveryMessage();
          _recoveryMessage.setCallback(function(){_popup.close()});
          _popup.setContent(Pard.t.text('popup.recover.title'), _recoveryMessage.render());
          _popup.open();
        });
      
      _emailRecovery.append(_caller);

      _messageContainer.append(_message, _emailRecovery);

      return {
        render: function(){    
          return _messageContainer;
        },
        setCallback: function(callback){
          _caller.on('click',function(){callback()});
        }
      }
    }

    ns.Widgets.NotValidatedUserMessage = function(){
      var _messageContainer = $('<div>'); 
      var _message = $('<div>').append($('<p>').html('<h4 style="margin-top:-1.2rem;">' + Pard.t.text('login.popup.notValidated') + '</h4><p>' + Pard.t.text('login.popup.notValidatedmex') + '</p>'));

      var _userRecovery = $('<div>').append($('<span>').html(Pard.t.text('login.popup.sendOther')));

      var _recoveryWidget = $('<div>');
      var regEx = /[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;

      var _email = Pard.Widgets.Input('', 'email');
      var _result = $('<div>').addClass('error-text');
      var _sendButton = Pard.Widgets.Button(Pard.t.text('login.popup.okbtn')).render();
      _sendButton.addClass('recoveryPasswd-popup-button');

      _sendButton.on('click', function(){
          _result.empty();
          if(!regEx.test(_email.getVal())) {
            _result.text(Pard.t.text('login.popup.notValidEmail'));
            _email.addWarning();
          }
          else {
            Pard.Backend.passwordRecovery(_email.getVal(), function(data){
              if (data['status'] == 'success'){
                Pard.Widgets.Alert('', Pard.t.text('login.popup.sent'));
              }
              else {
                _result.text(Pard.t.text('login.popup.nouser'));
              }
            });
          }
        });

      
      _recoveryWidget.append(_email.render(), _result, _sendButton);


      _userRecovery.append(_recoveryWidget);

      _messageContainer.append(_message, _userRecovery);

      return {
        render: function(){    
          return _messageContainer;
        },
        setCallback: function(callback){
          _sendButton.click(function(){callback()});
        }
      }
    }


  ns.Widgets.NoExistingUserMessage = function(){
      var _messageContainer = $('<div>');
      var _message  = $('<div>').text(Pard.t.text('login.popup.notExisting')).css({
        'font-size': '18px',
        'margin-bottom':'1rem'
      });
      
      var _register = $('<div>');
      var _registrationPopup;
      var _signUpButton = $('<button>').attr({type:'button'}).html(Pard.t.text('login.popup.registerbtn'))
        .one('click',function(){
          _registrationPopup = Pard.Widgets.Popup();
        })
        .click(function(){
          var _registrationMex = Pard.Widgets.Registration();
          _registrationMex.setCallback(function(){_registrationPopup.close()});
          _registrationPopup.setContent(Pard.t.text('signUp.popup.title'), _registrationMex.render());
          _registrationPopup.open();
        })
        .addClass('signupButton-alert');

      var _btnContainer = $('<div>').addClass('signupButton-alert-container');
    
      _messageContainer.append(_message, _btnContainer.append(_signUpButton));

      return {
        render: function(){
          return _messageContainer;
        },
        setCallback: function(callback){
          _signUpButton.on('click',function(){callback()});
        }
      }
    }


  ns.Widgets.AvailabilityDictionary = function(day){ 
    var _date = moment(new Date(day)).locale(Pard.UserInfo['lang']).format('dddd D MMMM');
    var _dateCapitalized = '';
    _date.split(' ').forEach(function(word){
      _dateCapitalized = _dateCapitalized + word.charAt(0).toUpperCase() + word.slice(1) + ' ';
    });
    return _dateCapitalized;
  }

}(Pard || {}));
