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
      // arts: {icon: '&#xE903;', className: 'material-icons'},
      // music: {icon: '', className: 'icon-note'},
      arts: {icon: '', className: 'icon-theatre'},
      expo: {icon: '&#xE3F4;', className: 'material-icons'},
      // poetry: {icon: '&#xE244;', className: 'material-icons'},
      poetry: {icon: '', className: 'icon-book-open'},
      audiovisual: {icon: '&#xE04B;', className: 'material-icons'},
      street_art: {icon: '&#xE243;', className: 'material-icons'},
      workshop: {icon: '', className: 'fa fa-cubes'},
      other: {icon: '&#xE155;', className: 'material-icons'},
      modify_section_content: {icon: '&#xE150;', className: 'material-icons'},
      information: {icon: '&#xE061;', className: 'material-icons'},
      city_artist: {icon: '&#xE55F;', className: 'material-icons'},
      address_space: {icon: '&#xE55F;', className: 'material-icons'},
      my_web: {icon: '&#xE80B;', className: 'material-icons'},
      icon_social: {icon: '&#xE315;', className: 'material-icons'},
      proposals: {icon: '&#xE6DD;', className: 'material-icons'},
      children: {icon: '&#xEB41;', className: 'material-icons'},
      duration: {icon: '&#xE425;', className: 'material-icons'},
      multimedia: {icon: '&#xE6C4;', className: 'material-icons'},
      
      open_call: {icon:'', className: 'fa fa-bullhorn'},

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
      bandcamp: {icon: '', className: 'icon-bandcamp'},
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
      artist: 'Artista',
      space: 'Espacio',
      organization: 'Organización',
      cultural_ass: 'Asociación Cultural',
      commercial: 'Local Comercial',
      home: 'Espacio Particular',
      music: 'Musica',
      arts: 'Artes Escénicas',
      expo: 'Exposición',
      poetry: 'Poesía',
      audiovisual: 'Audiovisual',
      street_art: 'Street Art',
      workshop: 'Taller',
      other: 'Otros',
      already_registered: function(){return Pard.Widgets.RecoverPasswdMessage('¡Usuario ya registrado!')},
      non_existing_user: function(){return Pard.Widgets.NoExistingUserMessage()},
      invalid_parameters: '<div>Los parámetros insertados no son validos!<br/> Por favor, revísalos.</div>',
      invalid_email: '<div>¡El correo no es correcto!<br/> Por favor, vuelve a intentar.</div>',
      incorrect_password: function(){return Pard.Widgets.RecoverPasswdMessage('¡Contraseña equivocada!')},
      not_validated_user:function(){return Pard.Widgets.NotValidatedUserMessage()},
      invalid_type: 'Tipo de perfil no valido.',
      existing_profile: 'Ya existe un perfil con este nombre. Escoge otro.',
      non_existing_profile: '<h4 style="margin-top:-1.2rem;">Error</h4> <div>¡Perfil no existente!</div>',
      non_existing_proposal: '<h4 style="margin-top:-1.2rem;">Error</h4> <div>¡Propuesta no existente!</div>',
       non_existing_production: '<h4 style="margin-top:-1.2rem;">Error</h4> <div>¡Producción artística no existente!</div>',
      invalid_category:'<h4 style="margin-top:-1.2rem;">Error</h4> <div>¡Categoría no valida!</div>',
      existing_call: '<h4 style="margin-top:-1.2rem;">Error</h4> <div>Convocatoria ya exitente.</div>',
      non_existing_call:'<h4 style="margin-top:-1.2rem;">Error</h4> <div>No existe esta convocatoria.</div>',
      you_dont_have_permission: '<h4 style="margin-top:-1.2rem;">Error</h4> <div>No tienes los permisos necesarios para está acción.</div>',
      invalid_query: '<h4 style="margin-top:-1.2rem;">Error</h4> <div>Acción no valida.</div>'
    }   
    

    return {
      render: function(){
        if (_dictionary[voice]){
          if (typeof _dictionary[voice] == 'function') return _dictionary[voice]();
          return _dictionary[voice];
        }
        else{return false;}
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
      var _caller = $('<a>').attr('href','#').text('¿Has olvidado la contraseña?');

      var _popup = Pard.Widgets.PopupCreator(_caller,'Recupera tu cuenta', function(){return Pard.Widgets.RecoveryMessage()});

      _emailRecovery.append(_popup.render());

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
      var _message = $('<div>').append($('<p>').html('<h4 style="margin-top:-1.2rem;">Usuario no validado</h4> <p>Al registrate, te enviamos un correo electrónico con un enlace para activar tu cuenta. Controla también en la carpeta de spam...</p>'));

      var _userRecovery = $('<div>').append($('<span>').html('...o vuelve a escribir aquí tu correo, y te enviamos otro.'));

      var _recoveryWidget = $('<div>');
      var regEx = /[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;

      var _email = Pard.Widgets.Input('', 'email');
      var _result = $('<div>').addClass('error-text');
      var _sendButton = Pard.Widgets.Button('Enviar').render();
      _sendButton.addClass('recoveryPasswd-popup-button');

      _sendButton.on('click', function(){
          _result.empty();
          if(!regEx.test(_email.getVal())) {
            _result.text('El email no es valido');
            _email.addWarning();
          }
          else {
            Pard.Backend.passwordRecovery(_email.getVal(), function(data){
              if (data['status'] == 'success'){
                Pard.Widgets.Alert('', 'Te hemos enviado un correo con las instrucciones para acceder a tu cuenta.');
              }
              else {
                _result.text('El usuario no existe.');
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
          // _caller.on('click',function(){callback()});
        }
      }
    }


  ns.Widgets.NoExistingUserMessage = function(){
      var _messageContainer = $('<div>');
      var _message  = $('<div>').text('¡No existe ningún usuario asociado con este correo!').css({
        'font-size': '18px',
        'margin-bottom':'1rem'
      });
      
      var _register = $('<div>');
      var _caller = $('<button>').attr({type:'button'}).html('Regístrate')

      
      var _popup = Pard.Widgets.PopupCreator(_caller, 'Regístrate para continuar', function(){return Pard.Widgets.Registration()});

      var _signUpButton = _popup.render();
      _signUpButton.addClass('signupButton-alert');

      var _btnContainer = $('<div>').addClass('signupButton-alert-container');
    
      _messageContainer.append(_message, _btnContainer.append(_signUpButton));

      return {
        render: function(){
          return _messageContainer;
        },
        setCallback: function(callback){
          _caller.on('click',function(){callback()});
        }
      }
    }


}(Pard || {}));
