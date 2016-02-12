(function(ns){
  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ToUserPage = function(){

    _createdWidget = $('<div>');

      var _createdButton = Pard.Widgets.Button('Pagina de usuario', function(){
        document.location = '/users/'
      }).render()
  
     _createdWidget.append(_createdButton);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.HeaderProfile = function(){
  
    var _createdWidget = $('<div>');

    var _logoutWidget = Pard.Widgets.Logout().render();
    var _toUserPageWidget = Pard.Widgets.ToUserPage().render();

    _createdWidget.append(_logoutWidget, _toUserPageWidget);

    return {
      render: function(){
        return _createdWidget;
      }

    }
  }

  ns.Widgets.ArtistProfile = function(profile){
    var _createdWidget = $('<div>');

    ['name','city'].forEach( function(element, index) {
      var _newField = $('<div>').text(profile[element]);
      _createdWidget.append(_newField)
    });

  
    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

   ns.Widgets.SpaceProfile = function(profile){
    var _createdWidget = $('<div>');
    var _info = $('<div>');

    // var _name = $('<h3>').text(profile.name);
    // var _city = $('<h5>').text(profile.city);
    // var _address = $('<p>').text(profile.address);
    // var _category = $('<h5>').text(profile.category)

     ['name','city', 'address', 'category'].forEach( function(element, index) {
      var _newField = $('<div>').text(profile[element]);
      _info.append(_newField)
    });

    _modifyProfile = Pard.Widgets.ModifyProfile(profile).render();

    _createdWidget.append(_info, _modifyProfile)

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ModifyProfile = function(profile){

    var _createdWidget = $('<div>');

    var _createdButton = Pard.Widgets.Button('Modifica tu perfil', function(){
      Pard.Widgets.BootboxAlert('Modifica tus datos', Pard.Widgets.ModifyProfileMessage(profile));
          console.log('pippa');

    });

    _createdWidget.append(_createdButton.render());

    return {
      render: function(){
        return _createdWidget;
      }
    }

  }

  ns.Widgets.ModifyProfileMessage = function(profile){

    var _createdWidget = $('<div>');
    var _invalidInput = $('<div>');

    var _fields = {};

    /*var _labels = ['Nombre del espacio', 'Dirección','Ciudad', 'Codigo postal'];*/
    
    /*var _types = ['text','test','text','number']
    
    _labels.forEach(function(id, index){
      _colpulsoryImput[id] = Pard.Widgets.Input(_labels[index], 'text', function(){
         var _checkInput = function(){
          if(_fields['password'].getVal().length < 8){
            _fields['password'].addWarning();
            _invalidInput.text('La contraseña debe tener al menos 8 caracteres.');
          }else{
            _fields['password'].removeWarning();
            return _checkEqual();
          }
        }
      });*/
  
    var _spaceOriginalForm = Pard.Widgets.SpaceForm();

    _createdWidget.append(_spaceOriginalForm.setVal(profile));
  

    _createdWidget.append(_invalidInput);

    return {
      render: function(){
        return _createdWidget;
      }
    }

  }


}(Pard || {}));
