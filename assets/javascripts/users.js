(function(ns){

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

  ns.Widgets.CreateProfile = function(){

    _createdWidget = $('<div>');

    var _content = $('<div>');
    var _fields = {};

    var _names = ['Nombre artistico', 'Nombre espacio'];
    var _locations = ['Codigo postal', 'Direccion'];

    ['artist', 'space'].forEach(function(type, index){
       _fields[type] = $('<div>');
      var _name = Pard.Widgets.Input(_names[index], 'text');
      var _location = Pard.Widgets.Input(_locations[index], 'text');
      _fields[type].append(_name.render(), _location.render());

    })

    _artistButton = Pard.Widgets.Button('Artista', function(){
      _content.empty();
      _content.append(_fields['artist']);
    });

    _spaceButton = Pard.Widgets.Button('Espacio', function(){
      _content.empty();
      _content.append(_fields['space']);
    });

    _createdWidget.append(_artistButton.render(), _spaceButton.render(), _content);

    bootbox.alert({
      title: 'Crea un nuevo perfil',
      message: _createdWidget,
    });
  }

}(Pard || {}));
