'use strict';

Pard.Welcome = function(profiles){

  var _header = Pard.Widgets.LoginHeader();
  var _largeScreenMain = Pard.Widgets.LoginMainLargeScreen(profiles);
  var _mediumScreenMain = Pard.Widgets.LoginMainMediumSmallScreen(profiles);
  var _footer = Pard.Widgets.Footer()
  
  // if ($(window).width() > 1024) {
  //     _section.append(Pard.Widgets.LoginSectionLargeScreen(profiles).render())
  //   }
  // else{_section.append('medium')};

  // $( window ).resize(function() {
  //   if ($(window).width() > 1024) {
  //     _section.empty();
  //     _section.append(Pard.Widgets.LoginSectionLargeScreen(profiles).render());
  //   }
  //   else{
  //     _section.empty();
  //     _section.append('medium');
  //   }
  // });

  
  $('body').append(_header.render(), _largeScreenMain.render(), _mediumScreenMain.render(), _footer.render());
  
  // $('#signUpBtn').sticky({topSpacing:20, widthFromWrapper:true});
         
}

Pard.Users = function(myprofiles, profiles){

  var _header = Pard.Widgets.UserHeader();
  
  var _largeScreenMain = Pard.Widgets.LoginMainLargeScreen(myprofiles, profiles);
  var _mediumScreenMain = Pard.Widgets.LoginMainMediumSmallScreen(myprofiles, profiles);
  var _footer = Pard.Widgets.Footer()


  var _createProfile = Pard.Widgets.CreateProfile().render();
  var _myProfiles = Pard.Widgets.MyProfiles(profiles);

  var _callGenerator = Pard.Widgets.Button('crea convocatoria', function(){
    Pard.Backend.createCall(console.log('created'));
  });

  _largeScreenMain.append(_callGenerator);

  $('body').prepend(_header.render());
  $('body').append(_createProfile, _myProfiles.render(), _callGenerator.render());

  $('body').append(_header.render(), _largeScreenMain.render(), _mediumScreenMain.render(), _footer.render());

  $(document).ready( function(){
      if (profiles.length == 0) _createProfile.trigger('click');
    });
}

Pard.Profile = function(profile, proposals){

  PROFILES_MAP = {
    'artist': Pard.Widgets.ArtistProfile,
    'space': Pard.Widgets.SpaceProfile
  };

  
  var _myProfile = PROFILES_MAP[profile.type](profile, proposals).render();
  var _header = Pard.Widgets.ProfileHeader().render();

  $('body').append(_header, _myProfile);
};
