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

}

Pard.Users = function(profiles){

  var _whole = $('<div>').addClass('whole-container');
  var _header = Pard.Widgets.UserHeader();
  var _largeScreenMain = Pard.Widgets.UserMainLargeScreen(profiles.my_profiles, profiles.profiles).render();
  var _mediumScreenMain = Pard.Widgets.UserMainMediumSmallScreen(profiles.my_profiles, profiles.profiles);
  var _footer = Pard.Widgets.Footer();

  var _callGenerator = Pard.Widgets.Button('crea convocatoria', function(){
    Pard.Backend.createCall(console.log('created'));
  });

  _largeScreenMain.append(_callGenerator.render());

  $(_whole).append(_header.render(), _largeScreenMain, _mediumScreenMain.render(), _footer.render());

  $(document).ready( function(){
    if (profiles.my_profiles.length == 0) Pard.Widgets.CreateProfile().render().trigger('click');
  }); 

  $('body').append(_whole);
}

Pard.ProfileOld = function(profiles){

  PROFILES_MAP = {
    'artist': Pard.Widgets.ArtistProfile,
    'space': Pard.Widgets.SpaceProfile
  };

  var _profile = profiles[0];

  var _toUserPageWidget = Pard.Widgets.ToUserPage().render();
  var _myProfile = PROFILES_MAP[_profile.type](_profile, _profile.calls).render();
  var _header = Pard.Widgets.UserHeader();
  var _footer = Pard.Widgets.Footer();


  $('body').append(_header.render(), _toUserPageWidget, _myProfile, _footer.render());

};


Pard.Profile = function(profiles){

  PROFILES_MAP = {
    'artist': Pard.Widgets.ArtistProfileMain,
    // 'space': Pard.Widgets.SpaceProfile
  };

  var _whole = $('<div>').addClass('whole-container');

  var _main = PROFILES_MAP[profiles[0].type](profiles).render();
  // var _toUserPageWidget = Pard.Widgets.ToUserPage().render();
  // var _myProfile = PROFILES_MAP[profile.type](profile, proposals).render();
  var _header = Pard.Widgets.UserHeader();
  var _footer = Pard.Widgets.Footer();

  $(_whole).append(_header.render(), _main, _footer.render());

  $(document).ready( function(){
    if (!(profiles[0].proposals)) Pard.Widgets.CallButtonArtist(profiles[0]).render().trigger('click');
  }); 

  $('body').append(_whole);

};

