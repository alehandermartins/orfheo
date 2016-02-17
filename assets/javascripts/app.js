'use strict';

Pard.Welcome = function(){

  var _registrationWidget = Pard.Widgets.Registration().render();
  var _loginWidget = Pard.Widgets.Login().render();

  $("#section_layout").append(_registrationWidget, _loginWidget);
};

Pard.Users = function(profiles){

  var _header = Pard.Widgets.UserHeader().render();
  var _modifyPasswordWidget = Pard.Widgets.ModifyPassword().render();
  var _createProfile = Pard.Widgets.CreateProfile().render();
  var _myProfiles = Pard.Widgets.MyProfiles(profiles).render();

  var _callGenerator = Pard.Widgets.Button('crea convocatoria', function(){
    Pard.Backend.createCall(console.log('created'));
  });

  $('#header_layout').append(_header);
  $('#section_layout').append(_modifyPasswordWidget, _createProfile, _myProfiles, _callGenerator.render());
};

Pard.Profile = function(profile, proposals){

  PROFILES_MAP = {
    'artist': Pard.Widgets.ArtistProfile(profile, proposals).render(),
    'space': Pard.Widgets.SpaceProfile(profile, proposals).render()
  };

  
  var _myProfile = PROFILES_MAP[profile.type];
  var _header = Pard.Widgets.ProfileHeader().render();

  $('#header_layout').append(_header);
  $('#section_layout').append(_myProfile);
};
