'use strict';

(function(ns){
  ns.Widgets = ns.Widgets || {};

  ns.Widgets.Dictionary = function(voice){

    var _dictionary = {
      artist: 'Artista',
      space: 'Space',
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
      not_validated_user:'<h4 style="margin-top:-1.2rem;">Usuario no validado</h4> <div>Al registrate, te enviamos un correo electrónico con un enlace para activar tu cuenta. Controla también en la carpeta de spam.</div>',
      invalid_type: 'Tipo de perfil no valido.',
      existing_profile: 'Ya existe un perfil con este nombre. Ecoge otro.',
      non_existing_profile: '<h4 style="margin-top:-1.2rem;">Error</h4> <div>¡Perfil no existente!</div>',
      non_existing_proposal: '<h4 style="margin-top:-1.2rem;">Error</h4> <div>¡Propuesta no existente!</div>',
      invalid_category:'<h4 style="margin-top:-1.2rem;">Error</h4> <div>¡Categoría no valida!</div>',
      existing_call: '<h4 style="margin-top:-1.2rem;">Error</h4> <div>Convocatoria ya exitente.</div>',
      non_existing_call:'<h4 style="margin-top:-1.2rem;">Error</h4> <div>No existe esta convocatoria.</div>'
    }   
    

    return {
      render: function(){
        if (typeof _dictionary[voice] == 'function') return _dictionary[voice]();
        return _dictionary[voice];
      }
    }
  }



  ns.Widgets.RecoverPasswdMessage = function(text){
      var _messageContainer = $('<div>').append()
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


  ns.Widgets.NoExistingUserMessage = function(){
      var _messageContainer = $('<div>').append()
      var _message  = $('<div>').text('¡No existe ningun usuario asociado con este correo!').css({
        'font-size': '18px',
        'margin-bottom':'1rem'
      });
      
      var _register = $('<div>');
      var _caller = $('<button>').attr({type:'button'}).html('Regístrate')

      
      var _popup = Pard.Widgets.PopupCreator(_caller, 'Regístrate para continuar', function(){return Pard.Widgets.Registration()});

      var _signUpButton = _popup.render();
      _signUpButton.addClass('signupButton-alert');
    
      _messageContainer.append(_message, _signUpButton);

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