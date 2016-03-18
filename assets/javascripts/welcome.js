(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.Registration = function(){

    var _createdWidget = $('<form>').attr('autocomplete','on');
    var _invalidInput = $('<div>').addClass('error-text');

    var _fields = {};

    var _emailLabel = Pard.Widgets.InputLabel('Email').render();
    var _passwdLabel = Pard.Widgets.InputLabel('Contraseña').render();    

    var regEx = /[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;
    var _labels = ['Tu correo', 'Confirma tu correo', 'Minimo 8 caracteres'];
    var _types = ['email', 'email', 'password'];

    // var _message = $('<h4>').text('Regístrate para continuar');

    // _fields['email'] = Pard.Widgets.Input(_labels[index], _types[index], '', _checkInput);
    // _fields['emailConf'] = Pard.Widgets.Input(_labels[index], _types[index], '', _checkInput);
    // _fields['password'] = ;

    ['email', 'emailConf', 'password'].forEach(function(id, index){
      _fields[id] = Pard.Widgets.Input(_labels[index], _types[index], '', function(){

        var _checkPassword = function(){
          if (_fields['password'].getVal()){    
            if(_fields['password'].getVal().length < 8){
              _fields['password'].addWarning();
              _invalidInput.text('La contraseña debe tener al menos 8 caracteres.');
            }else{
              _fields['password'].removeWarning();
              return true;
            }
          }
        }

        var _checkEqual = function(){ 
          if (_fields['emailConf'].getVal()){
            if (_fields['email'].getVal() != _fields['emailConf'].getVal()){
              _fields['emailConf'].addWarning();
              _invalidInput.text('Los campos de correo no coinciden.');
            }
            else{
              _fields['emailConf'].removeWarning();
              return _checkPassword();
            }
          }
        };

        var _checkInput = function(){
          if(_fields['email'].getVal()){
            if(!regEx.test(_fields['email'].getVal())){
              _fields['email'].addWarning();
              _invalidInput.text('El correo debe tener un formato valido.');
            }else{
              _fields['email'].removeWarning();
              _invalidInput.text('');
              return _checkEqual();
            }
          }
          else{
            _fields['email'].removeWarning();
            _invalidInput.empty();
          }
        }

        if (_checkInput() == true){
          _fields['button'].enable();
        }else{
          _fields['button'].disable();
        }
      });
    });

    _fields['button'] = Pard.Widgets.Button('Crea un cuenta');
    _fields['button'].setClass('signup-form-btn');

    _fields['button'].disable();

    Object.keys(_fields).map(function(field){
      _createdWidget.append(_fields[field].render());
    });

    _emailLabel.append(_fields['email'].render(), _fields['emailConf'].render());
    _passwdLabel.append(_fields['password'].render());

    _createdWidget.append(_emailLabel, _passwdLabel, _invalidInput, _fields['button'].render());

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _fields['button'].render().on('click', function(){
          Pard.Backend.register(
            _fields['email'].getVal(),
            _fields['emailConf'].getVal(),
            Pard.Events.Register
          )
        callback();
        })
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
                Pard.Widgets.Alert('Te hemos enviado un correo de confirma. Sigue su instricciones y accede a la convocatoria del conFusión.');
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

    var _createdWidget = $('<form>').addClass('input-login') .attr({autocomplete:'on'}) ;
    // .attr({autocomplete:'on',method: 'post', target: 'remember', action: '/content/blank'});
    var _emailRecovery = $('<div>').addClass('passwdRecovery');
    var _caller = $('<a>').attr('href','#').text('¿Has olvidado la contraseña?');

    // var _iframe = $('iframe').attr({id: 'remember', name: 'remember', src: '/content/blank'}).css({display: 'none'});

      _createdWidget.on('submit', function(){Pard.Backend.login(
        _fields['email'].getVal(),
        _fields['password'].getVal(),
        Pard.Events.Login
      )});

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

    // var _fakeSubmit = $('<button>').attr({type:'submit'}).css({display: 'none'}); 

    _fields['button'] = Pard.Widgets.Button('Log In', function(){
      Pard.Backend.login(
        _fields['email'].getVal(),
        _fields['password'].getVal(),
        Pard.Events.Login
      );
      // _fakeSubmit.trigger('click');
    });


// function forceAutoComplete() {
// var $forms = document.getElementsByTagName("FORM");
// for ( var i = 0; i < $forms.length; i++ ) {
// var $form = $forms[i];
// var $submit = document.createElement("INPUT");
// $submit.type = "submit";
// $form.appendChild($submit);
// $form.onsubmit = function(){return false}
// $submit.style.display = "none";
// $submit.click();
// }
// }


    _fields['button'].setClass('login-btn');
    _fields['button'].disable();

    Object.keys(_fields).map(function(field){
      _createdWidget.append(_fields[field].render().attr({name: field}));
    });

    _createdWidget.append(_emailRecovery);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

}(Pard || {}));

