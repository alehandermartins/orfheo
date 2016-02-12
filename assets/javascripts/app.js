'use strict';

Pard.Welcome = function(){

  var _registrationWidget = Pard.Widgets.Registration().render();
  var _loginWidget = Pard.Widgets.Login().render();

  $("#section_layout").append(_registrationWidget, _loginWidget);
};

Pard.Users = function(profiles){

  var _logoutWidget = Pard.Widgets.Logout().render();
  var _modifyPasswordWidget = Pard.Widgets.ModifyPassword().render();
  var _createProfile = Pard.Widgets.CreateProfile().render();
  var _myProfiles = Pard.Widgets.MyProfiles(profiles).render();

  $("#section_layout").append(_logoutWidget, _modifyPasswordWidget, _createProfile, _myProfiles);
};

Pard.Profile = function(profile){

  PROFILES_MAP = {
    'artist': Pard.Widgets.ArtistProfile(profile).render(),
    'space': Pard.Widgets.SpaceProfile(profile).render()
  };

  var _myProfile = PROFILES_MAP[profile.type];
  var _header = Pard.Widgets.HeaderProfile().render();

  $("#header_layout").append(_header);
  $("#section_layout").append(_myProfile);
};
