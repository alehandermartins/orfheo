(function(ns){
	ns.Widgets = ns.Widgets || {};

  ns.Widgets.Button = function(label, callback){

    var _createdButton = $('<button>').attr({type:'button'}).text(label).click(callback);

    return {
      render: function(){
        return _createdButton;
      },
      disable: function(){
        _createdButton.attr('disabled',true);
      },
      enable: function(){
        _createdButton.attr('disabled',false);
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
    var regEx=/[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;
    var _fields = {};

    var _labels = ['Tu email', 'Confirma tu email', 'Contraseña'];
    var _types = ['email', 'email', 'password'];

    _fields['button'] = Pard.Widgets.Button('join the community', function(){
      Pard.Backend.register(
        _fields['email'].getVal(),
        _fields['emailConf'].getVal(),
        Pard.Events.Register
      );
    });

    _fields['button'].disable();

    ['email', 'emailConf', 'password'].forEach(function(id, index){
      _fields[id] = Pard.Widgets.Input(_labels[index], _types[index], function(){

        var _checkPassword = function(){
          if(_fields['password'].getVal().length < 8){
            _fields['password'].addWarning();
            _invalidInput.text('La contraseña debe tener al menos 8 caracteres.');
          }else{
            _fields['password'].removeWarning();
          }
        }

        var _checkEqual = function(){
          if(_fields['email'].getVal() != _fields['emailConf'].getVal()){
            _fields['emailConf'].addWarning();
            _invalidInput.text('Los campos de correo no coinciden.');
          }else{
          _fields['emailConf'].removeWarning();
          _checkPassword();
          }
        }

        var _checkInput = function(){
          if(!regEx.test(_fields['email'].getVal())){
            _fields['email'].addWarning();
            _invalidInput.text('El correo debe tener un formato valido.');
          }else{
            _fields['email'].removeWarning();
            _invalidInput.text('');
            _checkEqual();
          }
        }

      _checkInput();

      if(_fields['email'].getVal().length != 0 && _invalidInput.text().length == 0)_fields['button'].enable();
      if(_fields['email'].getVal().length == 0 || _invalidInput.text().length != 0) _fields['button'].disable();
      });
    });

    _createdWidget.append(
      _fields['email'].render(),
      _fields['emailConf'].render(),
      _fields['password'].render(),
      _invalidInput,
      _fields['button'].render()
    );

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

}(Pard || {}));
