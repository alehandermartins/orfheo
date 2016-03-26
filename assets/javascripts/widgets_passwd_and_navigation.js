'use strict';


(function(ns){
  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ModifyPassword = function(){

    var _createdButton = $('<a>').attr('href','#').text('Modificar contraseña');
    var _popup = Pard.Widgets.PopupCreator(_createdButton,  'Introduce una nueva contraseña', function(){return Pard.Widgets.ModifyPasswordMessage()});

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.ModifyPasswordMessage = function(){
    var _createdWidget = $('<div>');
    var _invalidInput = $('<div>').addClass('error-text');

    var _fields = {};

    var _labels = ['Contraseña', 'Confirma tu contraseña'];
    var _types = ['password', 'passwordConf'];

    _types.forEach(function(id, index){
      _fields[id] = Pard.Widgets.Input(_labels[index], 'password', '', function(){

        var _checkEqual = function(){
          if (_fields['passwordConf'].getVal()){
            if(_fields['password'].getVal() != _fields['passwordConf'].getVal()){
              _fields['passwordConf'].addWarning();
              _invalidInput.text('Las contraseñas no coinciden.');
            }
            else{
              _fields['passwordConf'].removeWarning();
              _invalidInput.empty();
              return true;
            }
          }  
        }

        var _checkInput = function(){
          if(_fields['password'].getVal().length < 8){
            _fields['password'].addWarning();
            _invalidInput.text('La contraseña debe tener al menos 8 caracteres.');
          }
          else{
            _fields['password'].removeWarning();
            _invalidInput.empty();
            return _checkEqual();
          }
        }

        if (_checkInput()){
          _fields['button'].enable();
        }
        else{
          _fields['button'].disable();
        }

      });
    });

    _fields['button'] = Pard.Widgets.Button('OK');
    _fields['button'].setClass('recoveryPasswd-popup-button');

     _fields['button'].disable();


    _types.forEach(function(field){
      _createdWidget.append(_fields[field].render());
    });

    _createdWidget.append(_invalidInput, _fields['button'].render());

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _fields['button'].render().on('click', function(){
          if((_fields['password'].getVal() == _fields['passwordConf'].getVal()) && _fields['password'].getVal().length >= 8){
            Pard.Backend.modifyPassword(_fields['password'].getVal(), function(data){
              if (data['status'] == 'success'){
                Pard.Widgets.Alert('', 'Contraseña cambiada.');
                callback();
              }
              else {
                _invalidInput.text(data.reason);
              }
            });
          }
        });
      }
    }
  }


  ns.Widgets.Logout = function(){

    var _logout = $('<a>').attr('href','#').text('Log out').click(function(){
      Pard.Backend.logout(
        Pard.Events.Logout
      );
    });

    var _createdWidget =_logout;

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  
  ns.Widgets.ToUserPageLink = function(){

      var _createdButton = $('<a>').attr('href','/users/').text('Pagina de usuario');

    return {
      render: function(){
        return _createdButton;
      }
    }
  }


 

  
  
}(Pard || {}));