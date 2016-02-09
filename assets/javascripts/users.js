(function(ns){

  ns.Widgets.Logout = function(){

    _createdWidget = $('<div>');

    var _createdButton = Pard.Widgets.Button('Log out', function(){
      Pard.Backend.logout(
        Pard.Events.Logout
      );
    });

     _createdWidget.append(_createdButton.render());

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ModifyPassword = function(){

    _createdWidget = $('<div>');

    var _createdButton = Pard.Widgets.Button('Modify password', function(){
      Pard.Widgets.BootboxAlert('Introduce tu nueva contraseña', Pard.Widgets.ModifyPasswordMessage());
    });

    _createdWidget.append(_createdButton.render());

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.CreateProfile = function(){
    var _createdWidget = $('<div>');

    var _createdButton = Pard.Widgets.Button('Create Profile', function(){
      Pard.Widgets.BootboxAlert('Crea tu nuevo perfil', Pard.Widgets.CreateProfileMessage());
    });

    _createdWidget.append(_createdButton.render());

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ModifyPasswordMessage = function(){
    var _createdWidget = $('<div>');
    var _invalidInput = $('<div>');

    var _fields = {};

    var _labels = ['Contraseña', 'Confirma tu contraseña'];
    var _types = ['password', 'passwordConf'];

    _types.forEach(function(id, index){
      _fields[id] = Pard.Widgets.Input(_labels[index], 'password', function(){

        var _checkEqual = function(){
          if(_fields['password'].getVal() != _fields['passwordConf'].getVal()){
            _fields['passwordConf'].addWarning();
            _invalidInput.text('Las contraseñas no coinciden.');
          }else{
            _fields['passwordConf'].removeWarning();
            _invalidInput.empty();
            return true;
          }
        }

        var _checkInput = function(){
          if(_fields['password'].getVal().length < 8){
            _fields['password'].addWarning();
            _invalidInput.text('La contraseña debe tener al menos 8 caracteres.');
          }else{
            _fields['password'].removeWarning();
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

    _fields['button'] = Pard.Widgets.Button('Cambiar contraseña', function(){
      if((_fields['password'].getVal() == _fields['passwordConf'].getVal()) && _fields['password'].getVal().length >= 8){
        Pard.Backend.modifyPassword(_fields['password'].getVal(), function(data){
          if (data['status'] == 'success'){
            _invalidInput.text('Contraseña cambiada.');
          }
          else {
            _invalidInput.text(data.reason);
          }
        });
      }
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

  ns.Widgets.CreateProfileMessage = function(){
    _createdWidget = $('<div>');


    var _content = $('<div>');
    var _fields = {};

    var _names = ['Nombre artistico', 'Nombre espacio'];
    var _locations = ['Codigo postal', 'Direccion'];


    ['artist', 'space'].forEach(function(type, index){
       _fields[type] = $('<div>');
      var _invalidInput = $('<div>');
      var _name = Pard.Widgets.Input(_names[index], 'text');
      var _location = Pard.Widgets.Input(_locations[index], 'text');
      var _createButton = Pard.Widgets.Button('Crear!', function(){
        if(_name.getVal().length != 0 && _location.getVal().length != 0){
          Pard.Backend.createProfile(type, _name.getVal(), _location.getVal(), function(data){
            if (data['status'] == 'success'){
              _invalidInput.text('Perfil creado!');
            }
            else {
              _invalidInput.text(data.reason);
            }
          });
        }else{
          _invalidInput.text('Rellena ambos campos.');
        }
      });

      _fields[type].append(_name.render(), _location.render(), _createButton.render(), _invalidInput);
    });

    _artistButton = Pard.Widgets.Button('Artista', function(){
      _content.empty();
      _content.append(_fields['artist']);
    });

    _spaceButton = Pard.Widgets.Button('Espacio', function(){
      _content.empty();
      _content.append(_fields['space']);
    });

    _createdWidget.append(_artistButton.render(), _spaceButton.render(), _content);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

}(Pard || {}));
