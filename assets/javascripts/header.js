(function(ns){
  ns.Widgets = ns.Widgets || {};

  
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


  ns.Widgets.ToUserPage = function(){

    _createdWidget = $('<div>');

      var _createdButton = $('<a>').attr('href','#').text('Pagina de usuario').click(function(){
        document.location = '/users/'
      });
  
     _createdWidget.append(_createdButton);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  
  ns.Widgets.UserHeaderOld = function(){
  
    var _createdWidget = $('<div>');

    var _logoutWidget = Pard.Widgets.Logout().render();

    _createdWidget.append(_logoutWidget);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  
  ns.Widgets.ProfileHeader = function(){
  
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