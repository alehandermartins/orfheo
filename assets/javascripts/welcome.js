(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.Registration = function(){

    var _createdWidget = $('<form>');
    var _invalidInput = $('<div>');

    var _fields = {};

    var regEx = /[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;
    var _labels = ['Tu email', 'Confirma tu email', 'Contraseña'];
    var _types = ['email', 'email', 'password'];

    ['email', 'emailConf', 'password'].forEach(function(id, index){
      _fields[id] = Pard.Widgets.Input(_labels[index], _types[index], function(){

        var _checkPassword = function(){
          if(_fields['password'].getVal().length < 8){
            _fields['password'].addWarning();
            _invalidInput.text('La contraseña debe tener al menos 8 caracteres.');
          }else{
            _fields['password'].removeWarning();
            return true;
          }
        }

        var _checkEqual = function(){
          if(_fields['email'].getVal() != _fields['emailConf'].getVal()){
            _fields['emailConf'].addWarning();
            _invalidInput.text('Los campos de correo no coinciden.');
          }else{
            _fields['emailConf'].removeWarning();
            return _checkPassword();
          }
        }

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

        if (_checkInput() == true){
          _fields['button'].enable();
        }else{
          _fields['button'].disable();
        }
      });
    });

    _fields['button'] = Pard.Widgets.Button('join the community', function(){
      Pard.Backend.register(
        _fields['email'].getVal(),
        _fields['emailConf'].getVal(),
        Pard.Events.Register
      );
    });

    _fields['button'].disable();

    Object.keys(_fields).map(function(field){
      _createdWidget.append(_fields[field].render());
    });

    _createdWidget.append(_invalidInput);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.Login = function(){

    var _createdWidget = $('<form>');
    var _emailRecovery = Pard.Widgets.PasswordRecovery().render();

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

    _fields['button'] = Pard.Widgets.Button('log in', function(){
      Pard.Backend.login(
        _fields['email'].getVal(),
        _fields['password'].getVal(),
        Pard.Events.Login
      );
    });

    _fields['button'].disable();

    Object.keys(_fields).map(function(field){
      _createdWidget.append(_fields[field].render());
    });

    _createdWidget.append(_emailRecovery);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.PasswordRecovery = function(){
    var _createdWidget = $('<div>');
    var _message = Pard.Widgets.RecoveryMessage();

    var _emailLink = $('<a>').text('Olvidaste tu contraseña?').click(function(){
      _message.resetValues();
      bootbox.alert({
        title: 'Fogotten Password',
        message: _message.render()
      });
    });
    _createdWidget.append(_emailLink);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.RecoveryMessage = function(){
    var _createdWidget = $('<div>');
    var regEx = /[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;

    var _email = Pard.Widgets.Input('Tu email', 'email');
    var _result = $('<div>');
    var _sendButton = Pard.Widgets.Button('Enviar', function(){
      _result.empty();
      if(!regEx.test(_email.getVal())) _result.text('El email no es valido');
      else {
        Pard.Backend.passwordRecovery(_email.getVal(), function(data){
          if (data['status'] == 'success'){
            _result.text('Te hemos enviado un correo.');
          }
          else {
            _result.text('El usuario no existe.');
          }
        });
      }
    });

    _createdWidget.append(_email.render(), _sendButton.render(), _result);

    return {
      render: function(){
        return _createdWidget;
      },
      resetValues: function(){
        _result.empty();
        _email.setVal('');
      }
    }
  }
}(Pard || {}));
