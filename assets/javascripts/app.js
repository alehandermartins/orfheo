'use strict';

Pard.Welcome = function(profiles){

  var _header = Pard.Widgets.LoginHeader();
  var _largeScreenMain = Pard.Widgets.LoginMainLargeScreen(profiles);
  var _mediumScreenMain = Pard.Widgets.LoginMainMediumSmallScreen(profiles);
  var _footer = Pard.Widgets.Footer();

  var _whole = $('<div>').addClass('whole-container');
  
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

  _whole.append(_header.render(), _largeScreenMain.render(), _mediumScreenMain.render(), _footer.render());
  
  $('body').append(_whole);



  
  // $('body').append(_header.render(), _largeScreenMain.render(), _mediumScreenMain.render(), _footer.render());
  
  // $('#signUpBtn').sticky({topSpacing:20, widthFromWrapper:true});
         
}

Pard.Users = function(profiles){
  console.log(profiles);

  var _header = Pard.Widgets.UserHeader();
  
  var _largeScreenMain = Pard.Widgets.UserMainLargeScreen(profiles.my_profiles, profiles.profiles).render();
  var _mediumScreenMain = Pard.Widgets.UserMainMediumSmallScreen(profiles.my_profiles, profiles.profiles);
  var _footer = Pard.Widgets.Footer();


  // var _createProfile = Pard.Widgets.CreateProfile().render();
  // var _myProfiles = Pard.Widgets.MyProfiles(profiles);

  var _callGenerator = Pard.Widgets.Button('crea convocatoria', function(){
    Pard.Backend.createCall(console.log('created'));
  });

  _largeScreenMain.append(_callGenerator.render());

  // $('body').prepend(_header.render());
  // $('body').append(_createProfile, _myProfiles.render(), _callGenerator.render());

  $('body').append(_header.render(), _largeScreenMain, _mediumScreenMain.render(), _footer.render());
}

Pard.Profile = function(profile, proposals){

  PROFILES_MAP = {
    'artist': Pard.Widgets.ArtistProfile,
    'space': Pard.Widgets.SpaceProfile
  };

  var _toUserPageWidget = Pard.Widgets.ToUserPage().render();
  var _myProfile = PROFILES_MAP[profile.type](profile, proposals).render();
  var _header = Pard.Widgets.UserHeader();

  $('body').append(_header.render(), _toUserPageWidget, _myProfile);
};
