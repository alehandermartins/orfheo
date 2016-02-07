(function(ns){
	ns.Widgets = ns.Widgets || {};

  ns.Widgets.Button = function(label, callback){

    var _createdWidget = $('<button>').attr({type:'button'}).text(label).click(callback);

    return {
      render: function(){
        return _createdWidget;
      },
      disable: function(){
        _createdWidget.attr('disabled',true);
      },
      enable: function(){
        _createdWidget.attr('disabled',false);
      }
    };
  };

  ns.Widgets.Input = function(label, type, callback){

    var _input = $('<input>').attr({'type':type, 'placeholder': label});

    _input.on('input',function(){
      if(callback) callback();
    });

    return{
      render: function(){
        return _input;
      },
      getVal: function(){
        return _input.val();
      },
      addWarning: function(){
        _input.addClass('warning')
      },
      removeWarning: function(){
        _input.removeClass('warning')
      }
    }
  };

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

    var _fields = {};

    var regEx = /[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;
    var _labels = ['Tu email', 'Contraseña'];
    var _types = ['email', 'password'];

    _types.forEach(function(id, index){
      _fields[id] = Pard.Widgets.Input(_labels[index], _types[index], function(){

        var _checkPassword = function(){
          if(_fields['password'].getVal().length >= 8) return true
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

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.Logout = function(){

    var _createdWidget = Pard.Widgets.Button('log out', function(){
      Pard.Backend.logout(
        Pard.Events.Logout
      );
    }).render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

}(Pard || {}));
