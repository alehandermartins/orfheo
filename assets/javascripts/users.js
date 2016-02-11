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


  ns.Widgets.ProfileForm = function(){

    var _form = {};
    var _selected = 'artist';

    _form['artist'] = Pard.Widgets.ArtistForm();
    _form['space'] = Pard.Widgets.SpaceForm();

    return {
      getForm: function(type){
        _selected = type;
        return _form[type].render();
      },
      getVal: function(){
        return _form[_selected].getVal();
      },
      filled: function(){
        var _event = true;
        var _formValue = _form[_selected].getVal();
        Object.keys(_formValue).forEach(function(key){
          if(_formValue[key] == '') _event = false;
        });
        return _event;
      }
    }
  }

  ns.Widgets.ArtistForm = function(){

    var _createdWidget = $('<div>');
    var _name = Pard.Widgets.Input('Nombre artistico', 'text');
    var _city = Pard.Widgets.Input('Ciudad', 'text');
    var _zipCode = Pard.Widgets.Input('Codigo postal', 'text');

    _createdWidget.append(_name.render(), _city.render(), _zipCode.render());

    return {
      render: function(){
        return _createdWidget;
      },
      getVal: function(){
        return {
          type: 'artist',
          name: _name.getVal(),
          city: _city.getVal(),
          zip_code: _zipCode.getVal()
        }
      }
    }
  }

  ns.Widgets.SpaceForm = function(){

    var _createdWidget = $('<div>');
    var _name = Pard.Widgets.Input('Nombre espacio', 'text');
    var _city = Pard.Widgets.Input('Ciudad', 'text');
    var _address = Pard.Widgets.Input('Direccion', 'text');
    var _zipCode = Pard.Widgets.Input('Codigo postal', 'text');
    var _category = $('<select>');

    var _labels = ['Asociacion Cultural', 'Local Comercial', 'Espacio Particular'];
    var _values = ['cultural_ass', 'commercial', 'home'];

    _values.forEach(function(value, index){
    _category.append($('<option>').text(_labels[index]).val(value));
    });

    _createdWidget.append(_name.render(), _city.render(), _address.render(), _zipCode.render(), _category);

    return {
      render: function(){
        return _createdWidget;
      },
      getVal: function(){
        return {
          type: 'space',
          name: _name.getVal(),
          city: _city.getVal(),
          address: _address.getVal(),
          zip_code: _zipCode.getVal(),
          category: _category.val()
        }
      }
    }
  }


  ns.Widgets.CreateProfileMessage = function(){
    _createdWidget = $('<div>');

    var _content = $('<div>');
    var _invalidInput = $('<div>');
    var _fields = {};

    var _profileForm = Pard.Widgets.ProfileForm();

    _artistButton = Pard.Widgets.Button('Artista', function(){
      _content.empty();
      _content.append(_profileForm.getForm('artist'));
    });

    _spaceButton = Pard.Widgets.Button('Espacio', function(){
      _content.empty();
      _content.append(_profileForm.getForm('space'));
    });

    _createdWidget.append(_artistButton.render(), _spaceButton.render(), _content, _invalidInput);

    return {
      render: function(){
        return _createdWidget;
      },
      callback: function(){
        if(_profileForm.filled() == true) Pard.Backend.createProfile(_profileForm.getVal(), Pard.Events.CreateProfile);
        else{
          return false;
        }
      }
    }
  }

  ns.Widgets.MyProfiles = function(){

    var _createdWidget = $('<div>');
    Pard.Backend.getProfiles(function(data){
      if (data.profiles.length == 0){
        Pard.Widgets.BootboxAlert('Crea tu nuevo perfil', Pard.Widgets.CreateProfileMessage());}
      else {
        data.profiles.forEach(function(profile){
          _createdWidget.append(Pard.Widgets.Button(profile['name'], function(){
            document.location = '/users/profiles/' + profile['name'];
          }).render());
        });
      }
    });

    return {
      render: function(){
        return _createdWidget;
      }
    }

  }



}(Pard || {}));
