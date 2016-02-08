'use strict';

Pard.Welcome = function(){

  var _registrationWidget = Pard.Widgets.Registration().render();
  var _loginWidget = Pard.Widgets.Login().render();

  $("#section_layout").append(_registrationWidget, _loginWidget);
};

Pard.Users = function(){

  Pard.Widgets.CreateProfile();

  var _logoutWidget = Pard.Widgets.Logout().render();

  $("#section_layout").append(_logoutWidget);
};
