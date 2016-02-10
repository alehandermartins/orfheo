'use strict';

Pard.Welcome = function(){

  var _registrationWidget = Pard.Widgets.Registration().render();
  var _loginWidget = Pard.Widgets.Login().render();

  $("#section_layout").append(_registrationWidget, _loginWidget);
};

Pard.Users = function(){

  var _logoutWidget = Pard.Widgets.Logout().render();
  var _modifyPasswordWidget = Pard.Widgets.ModifyPassword().render();
  var _createProfile = Pard.Widgets.CreateProfile().render();

  $("#section_layout").append(_logoutWidget, _modifyPasswordWidget, _createProfile);
};
