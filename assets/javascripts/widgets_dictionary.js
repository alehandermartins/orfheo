'use strict';

(function(ns){
  ns.Widgets = ns.Widgets || {};

   ns.Widgets.IconManager = function(icon_name){

    var _iconDictionary = {
      settings: {icon: '&#xE8B8;', className:'materials-icon'},
      space: {icon: '&#xE88A;', className: 'material-icons'},
      artist: {icon: '&#xE7FD;', className: 'material-icons'},
      music: {icon: '&#xE405;', className: 'material-icons'},
      arts: {icon: '&#xE903;', className: 'material-icons'},
      expo: {icon: '&#xE3F4;', className: 'material-icons'},
      poetry: {icon: '&#xE244;', className: 'material-icons'},
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
      calls: {icon: '', className: 'fa fa-spinner'},
      children: {icon: '&#xEB41;', className: 'material-icons'},
      duration: {icon: '&#xE425;', className: 'material-icons'},
      multimedia: {icon: '&#xE6C4;', className: 'material-icons'},
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
      bandcamp: {icon: 'bc', className: 'fa'},
    };

    var _createdWidget = $('<span>').addClass(_iconDictionary[icon_name]['className']).html(_iconDictionary[icon_name]['icon']);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

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
