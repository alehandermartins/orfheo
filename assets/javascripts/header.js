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


  
}(Pard || {}));