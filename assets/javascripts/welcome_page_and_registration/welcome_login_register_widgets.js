'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.Registration = function(event_id){

    var _createdWidget = $('<form>').attr('autocomplete','on');
    var _invalidInput = $('<div>').addClass('error-text');

    var _fields = {};

    var _emailLabel = Pard.Widgets.InputLabel('Email').render();
    var _confEmailLabel = $('<label>');
    var _passwdLabel = Pard.Widgets.InputLabel('Contraseña').render();    

    var regEx = /[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;
    var _labels = ['Tu correo', 'Confirma tu correo', 'Mínimo 8 caracteres'];
    var _types = ['text', 'text', 'password'];

    ['email', 'emailConf', 'password'].forEach(function(id, index){
      _fields[id] = Pard.Widgets.Input(_labels[index], _types[index]
      , function(){
        if (_invalidInput.text()) _checkInput();
        // _invalidInput.text('');
        }
      )}
    );

   var _checkPassword = function(){
        if(_fields['password'].getVal().length < 8){
          _fields['password'].addWarning();
          _invalidInput.text('La contraseña debe tener al menos 8 caracteres.');
        }
        else{
          _fields['password'].removeWarning();
          return true;
        }
    }

    var _checkEqual = function(){ 
        if (_fields['email'].getVal() != _fields['emailConf'].getVal()){
          _fields['emailConf'].addWarning();
          _invalidInput.text('Los campos de correo no coinciden.');
        }
        else{
          _fields['emailConf'].removeWarning();
          return _checkPassword(_invalidInput);
        }
    };

    var _checkInput = function(){
      if(!regEx.test(_fields['email'].getVal())){
        _fields['email'].addWarning();
        _invalidInput.text('El correo debe tener un formato válido.');
      }else{
        _fields['email'].removeWarning();
        _invalidInput.text('');
        return _checkEqual();
      }
    }

    _fields['button'] = Pard.Widgets.Button('Crea una cuenta');
    _fields['button'].setClass('signup-form-btn');

    Object.keys(_fields).map(function(field){
      _createdWidget.append(_fields[field].render());
    });

    _emailLabel.append(_fields['email'].render());
    _confEmailLabel.append(_fields['emailConf'].render())
    _passwdLabel.append(_fields['password'].render());

    var _initMex = $('<div>').append($('<p>').html('...hacerlo,  por supuesto,  <strong>es libre y gratuito :) </strong>')).addClass('register-form-init-mex');


    var _termsAndCondtions = $('<a>').text('condiciones generales');
    _termsAndCondtions.click(function(){
      Pard.Widgets.BigAlert('', Pard.Widgets.TermsAndConditionsMessage().render());
    })

    var _finalMex = $('<div>').append($('<p>').append('Al crear una cuenta, confirmas que estás de acuerdo con nuestras ', _termsAndCondtions, '.')).addClass('register-form-final-mex');

    _createdWidget.append(_initMex, _emailLabel, _confEmailLabel, _passwdLabel, _invalidInput, _fields['button'].render(), _finalMex);

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _fields['button'].render().on('click', function(){
          if (_checkInput()){
            if (event_id){
              Pard.Backend.register(
                _fields['email'].getVal(),
                _fields['password'].getVal(),
                event_id,
                Pard.Events.Register
              );
            } 
            else{
              Pard.Backend.register(
                _fields['email'].getVal(),
                _fields['password'].getVal(),
                '',
                Pard.Events.Register
              );
            }
          callback();
          }
          else {return false};
        })
      }
    }
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

    var _mex5_5  = '<p>Como prometido, ser parte de orfheo no tiene y no tendrá ningún coste para ningún usuario. Sin embargo, el mantenimiento online de una web de este tipo tiene un coste, así como la sostenibilidad de la vida las personas que trabajan diariamente en ello. Por lo tanto, lanzar una convocatoria y poder acceder a la relativa herramienta de gestión tiene un precio, que se decide juntos después de haber analizado el tipo de evento que se quiere organizar.</p>'

    var _part5_5 = $('<div>').append(_subtitle5_5, _mex5_5).addClass('conditions-par');


    var _subtitle6 = $('<h5>').text('Actualizaciones:').addClass('subtitle-conditions');

    var _mex6  = '<p>Nos reservamos el derecho de modificar, si necesario, las condiciones generales para adaptarlas a futuras novedades y asumimos el deber y el compromiso de informar de los cambios a todos los ciudadanos  de orfheo, previamente y con tiempo, para que puedan conocer las actualizaciones de antemano.  </p>'

    var _part6 = $('<div>').append(_subtitle6, _mex6).addClass('conditions-par');


    var _subtitle7 = $('<h5>').text('¡Muchas gracias!').addClass('subtitle-conditions');

    var _finalMex = $('<div>').html('<p> Si tienes preguntas o sugerencias  envía un correo electrónico a <a href="mailto:info@orfheo.org"> info@orfheo.org</a>.</p> <p> Gracias por leer hasta aquí. Esperamos que disfrutes dentro y fuera orfheo. </br> Tu participación al crear, mantener y mejorar este lugar es imprescindible. </p> <p> Apreciamos que te hayas tomado tu tiempo para informarte sobre el proyecto, y te agradecemos que contribuyas. Mediante lo que haces, estás ayudando a construir algo realmente importante, no sólamente una conexión de proyectos compartidos de manera colaborativa, sino también una vibrante comunidad enfocada en una muy noble meta. </p>')


    _createdWidget.append(_image, _web, _title, _lastModify, _part1,_part2, _part3, _part4, _part5, _part5_5, _part6, _subtitle7, _finalMex);

    return{
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
      }
    }
  
  }
 
 
  ns.Widgets.RecoveryMessage = function(){
    var _createdWidget = $('<div>');
    var regEx = /[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;

    var _emailLabel = Pard.Widgets.InputLabel('Email').render();
    var _email = Pard.Widgets.Input('', 'email');
    var _result = $('<div>').addClass('error-text');
    var _sendButton = Pard.Widgets.Button('Enviar');
    _sendButton.setClass('recoveryPasswd-popup-button');

    _emailLabel.append(_email.render());         
    
    _createdWidget.append(_emailLabel, _result, _sendButton.render());

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _sendButton.render().on('click', function(){
          _result.empty();
          if(!regEx.test(_email.getVal())) {
            _result.text('El email no es válido');
            _email.addWarning();
          }
          else {
            Pard.Backend.passwordRecovery(_email.getVal(), function(data){
              if (data['status'] == 'success'){
                Pard.Widgets.Alert('', 'Te hemos enviado un correo con las instrucciones para acceder a tu cuenta.');
                callback();
              }
              else {
                _result.text('El usuario no existe.');
              }
            });
          }
        })
      }
    }
  }


 ns.Widgets.Login = function(){

    var _createdWidget = $('<form>').addClass('input-login').attr({autocomplete:'on'});
    var _emailRecovery = $('<span>').addClass('passwdRecovery');
    var _caller = $('<a>').attr('href','#').text('¿Has olvidado la contraseña?');

    var _popup = Pard.Widgets.PopupCreator(_caller,'Recupera tu cuenta', function(){return Pard.Widgets.RecoveryMessage()});

    _emailRecovery.append(_popup.render());

    var _fields = {};

    var regEx = /[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;
    var _labels = ['Tu email', 'Contraseña'];
    var _types = ['email', 'password'];


    _types.forEach(function(id, index){
      _fields[id] = Pard.Widgets.Input(_labels[index], _types[index], function(){

        var _checkPassword = function(){
          if(_fields['password'].getVal().length >= 8) return true;
        }

        var _checkInput = function(){
          if(regEx.test(_fields['email'].getVal())) return _checkPassword();
        }

        if (_checkInput() == true){
          _fields['button'].enable();
        }else{
          _fields['button'].disable();
        }
      });
    });

    _fields['button'] = Pard.Widgets.Button('Entra', function(){
      _rememberMe.rememberMe();
      Pard.Backend.login(
        _fields['email'].getVal(),
        _fields['password'].getVal(),
        Pard.Events.Login
      );
    });

    _fields['button'].setClass('login-btn');
    _fields['email'].setClass('input-login-field');
    _fields['password'].setClass('input-login-field');

    var _rememberMe = Pard.Widgets.RememberMe(_fields['email'], _fields['password'], _fields['button']);

    var _emailField = _fields['email'].render().attr({name: 'email'});
    var _passwdField = _fields['password'].render().attr({name:'password'});
    var _btn = _fields['button'].render();

    // Object.keys(_fields).map(function(field){
    //   _createdWidget.append(_fields[field].render().attr({name: field}));
    // });

    _emailField.keypress(function (e) {
      var key = e.which;
      if(key == 13){
        _btn.click();
        return false;  
      }
    });   

    _passwdField.keypress(function (e) {
      var key = e.which;
      if(key == 13){
        _btn.click();
        return false;  
      }
    });   

    _createdWidget.append(_emailField, _passwdField, _btn);

    var _checkBox = _rememberMe.render();

    _createdWidget.append(_checkBox,_emailRecovery);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.RememberMe = function(emailField, passwdField, button){

    var _ckb = $('<input>').attr({type:'checkbox', value:'remember-me'}); 
    var _label = $('<label>').text('Recuérdame');
    var _createdWidget = $('<span>').append(_ckb,_label);
    _createdWidget.addClass('rememberMe-ckb');

    $(function() {
      if (localStorage.chkbx && localStorage.chkbx != '') {
          _ckb.attr('checked', 'checked');
          emailField.setVal(localStorage.usrname);
          passwdField.setVal(localStorage.pass);
          button.enable();
      } else {
          _ckb.removeAttr('checked');
          emailField.setVal('');
          passwdField.setVal('');
          button.disable();
      }
    });

    var _rememberMe = function(){
      if (_ckb.is(':checked')) {
            // save username and password
            localStorage.usrname = emailField.getVal();
            localStorage.pass = passwdField.getVal();
            localStorage.chkbx = _ckb.val();
        } else {
            localStorage.usrname = '';
            localStorage.pass = '';
            localStorage.chkbx = '';
        }
    }

    _ckb.click(function() {
      _rememberMe();
    });

    return {
      render: function(){
        return _createdWidget;      
      },
      rememberMe:function(){
        _rememberMe();
      }
    }
  }


   ns.Widgets.LoginEvent = function(event_id){

    var _createdWidget = $('<form>').addClass('input-login').attr({autocomplete:'on'});
    var _emailRecovery = $('<div>').addClass('passwdRecovery-eventLogin');
    var _caller = $('<a>').attr('href','#').text('¿Has olvidado la contraseña?');
    // var _caller = $('<a>').attr('href','#').text('Recupera contraseña');


    var _popup = Pard.Widgets.PopupCreator(_caller,'Recupera tu cuenta', function(){return Pard.Widgets.RecoveryMessage()});

    _emailRecovery.append(_popup.render());

    var _fields = {};

    var regEx = /[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;
    var _labels = ['Tu email', 'Contraseña'];
    var _types = ['email', 'password'];


    _types.forEach(function(id, index){
      _fields[id] = Pard.Widgets.Input(_labels[index], _types[index], function(){

        var _checkPassword = function(){
          if(_fields['password'].getVal().length >= 8) return true;
        }

        var _checkInput = function(){
          if(regEx.test(_fields['email'].getVal())) return _checkPassword();
        }

        if (_checkInput() == true){
          _fields['button'].enable();
        }else{
          _fields['button'].disable();
        }
      });
    });



    _fields['button'] = Pard.Widgets.Button('Entra', function(){
      _rememberMe.rememberMe();
      Pard.Backend.login(
        _fields['email'].getVal(),
        _fields['password'].getVal(),
        Pard.Events.Login
      );
    });

    _fields['button'].setClass('login-btn');
    _fields['email'].setClass('input-loginEvent-field');
    _fields['password'].setClass('input-loginEvent-field');

    var _rememberMe = Pard.Widgets.RememberMe(_fields['email'], _fields['password'], _fields['button']);

    Object.keys(_fields).map(function(field){
      _createdWidget.append(_fields[field].render().attr({name: field}));
    });

    // var _tools = $('<div>').addClass('login-header-tools');
    // _tools.append(_rememberMe.render(),_emailRecovery);

    _createdWidget.append(_emailRecovery);

    var _signUpContainer = $('<div>').addClass('signUpCont-eventLogin');
    var _signUpText = $('<h5>').text('Si no tienes una cuenta:').addClass('signUpText-eventLogin');
    var _signUpMessage =  Pard.Widgets.Registration(event_id);    
    var _caller = $('<button>').attr({type:'button'}).html('Crea una cuenta').addClass('signupButton-eventLogin');
    // _caller.click(function(){
    //   _signUpContainer.append(_signUpMessage.render().addClass('popup-form').css('margin-top', '1rem'));
    //   _caller.remove();
    // });
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Crea una cuenta...', function(){return _signUpMessage});
    var _signUpButton = _popup.render();

    _signUpContainer.append(_signUpText,_caller);
    _createdWidget.append(_signUpContainer);

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        callback();
      }
    }
  }


  ns.Widgets.SignUpButton = function(){
 
    var _signUpMessage =  Pard.Widgets.Registration();    
    var _caller = $('<button>').attr({type:'button'}).html('Únete');
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Empieza creando una cuenta...', function(){return _signUpMessage});

    var _signUpButton = _popup.render();
   
    return{
      render: function(){
        return _signUpButton;
      }
    }
  }


}(Pard || {}));

