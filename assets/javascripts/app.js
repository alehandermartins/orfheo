'use strict';

Pard.Welcome = function(profiles){

  var _header = Pard.Widgets.LoginHeader().render();
  var _sectionLargeScreen = Pard.Widgets.LoginSectionLargeScreen(profiles).render();
  // var _registrationWidget = Pard.Widgets.Registration().render();

  $('body').prepend(_header);
  $('body').append(_sectionLargeScreen);
};

Pard.Users = function(profiles){

  var _header = Pard.Widgets.UserHeader().render();
  var _modifyPasswordWidget = Pard.Widgets.ModifyPassword().render();
  var _createProfile = Pard.Widgets.CreateProfile().render();
  var _myProfiles = Pard.Widgets.MyProfiles(profiles).render();

  var _callGenerator = Pard.Widgets.Button('crea convocatoria', function(){
    Pard.Backend.createCall(console.log('created'));
  });

  $('body').prepend(_header);
  $('body').append(_modifyPasswordWidget, _createProfile, _myProfiles, _callGenerator.render());
};

Pard.Profile = function(profile, proposals){

  PROFILES_MAP = {
    'artist': Pard.Widgets.ArtistProfile,
    'space': Pard.Widgets.SpaceProfile
  };

  
  var _myProfile = PROFILES_MAP[profile.type](profile, proposals).render();
  var _header = Pard.Widgets.ProfileHeader().render();

  $('body').append(_header, _myProfile);
};
