(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.Registration = function(){

    var _createdWidget = $('<form>').attr('autocomplete','on');
    var _invalidInput = $('<div>').addClass('error-text');

    var _fields = {};

    var _emailLabel = Pard.Widgets.InputLabel('Email').render();
    var _passwdLabel = Pard.Widgets.InputLabel('Contraseña').render();    

    var regEx = /[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;
    var _labels = ['Tu correo', 'Confirma tu correo', 'Mínimo 8 caracteres'];
    var _types = ['email', 'email', 'password'];

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
        _invalidInput.text('El correo debe tener un formato valido.');
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

    _emailLabel.append(_fields['email'].render(), _fields['emailConf'].render());
    _passwdLabel.append(_fields['password'].render());

    var _initMex = $('<div>').append($('<p>').html('Con ello, tendrás acceso a tus datos de la convocatoria, podrás enviar más propuestas, enmandar las que has enviado, cambiar la información sobre ti para que el publico pueda conocerte...hacerlo,  <strong> por supuesto, es libre y gratuito :) </strong>')).addClass('register-form-init-mex');

    var _termsAndCondtions = $('<a>').attr('href','#').text('terminos y condiciones');
    var _termsAndCondtionsPopup = Pard.Widgets.PopupCreator(_termsAndCondtions,'Terminos y Condiciones', function(){return Pard.Widgets.TermsAndConditionsMessage()});
    var _finalMex = $('<div>').append($('<p>').append('Al crear una cuenta, confirmas que estás de acuerdo con nuestros ', _termsAndCondtionsPopup.render(), '.')).addClass('register-form-final-mex');

    _createdWidget.append(_initMex, _emailLabel, _passwdLabel, _invalidInput, _fields['button'].render(), _finalMex);

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _fields['button'].render().on('click', function(){
          if (_checkInput()){
            Pard.Backend.register(
              _fields['email'].getVal(),
              _fields['password'].getVal(),
              Pard.Events.Register
            );
          callback();
          }
          else {return false};
        })
      }
    }
  }


  ns.Widgets.TermsAndConditionsMessage = function(){
    var _createdWidget = $('div');

    return{
      render: function(){
        _createdWidget
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
            _result.text('El email no es valido');
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

    Object.keys(_fields).map(function(field){
      _createdWidget.append(_fields[field].render().attr({name: field}));
    });

    // var _tools = $('<div>').addClass('login-header-tools');
    // _tools.append(_rememberMe.render(),_emailRecovery);

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


}(Pard || {}));

