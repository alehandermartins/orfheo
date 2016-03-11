'use strict';

Pard.Welcome = function(profiles){

  var _header = Pard.Widgets.LoginHeader();
  
  var _main = Pard.Widgets.MainLayout(Pard.Widgets.LoginAside, Pard.Widgets.LoginSection, profiles);

  var _footer = Pard.Widgets.Footer();

  var _whole = $('<div>').addClass('whole-container');
  
  _whole.append(_header.render(), _main.render(), _footer.render());
  
  $('body').append(_whole);

}

Pard.Users = function(profiles){

  var _whole = $('<div>').addClass('whole-container');
  var _header = Pard.Widgets.UserHeader();

  var _main = Pard.Widgets.MainLayout(Pard.Widgets.UserAside, Pard.Widgets.UserSection,profiles);

  var _footer = Pard.Widgets.Footer();

  var _callGenerator = Pard.Widgets.Button('crea convocatoria', function(){
    Pard.Backend.createCall(console.log('created'));
  });

  $(_whole).append(_header.render(), _main.render(), _callGenerator.render(), _footer.render());

  $(document).ready( function(){
    if (profiles.my_profiles.length == 0) Pard.Widgets.CreateProfile().render().trigger('click');
  }); 

  $('body').append(_whole);
}

Pard.Profile = function(profiles){

  var _whole = $('<div>').addClass('whole-container');

  var _main = Pard.Widgets.MainLayout(Pard.Widgets.ProfileAside, Pard.Widgets.ProfileSection(profiles[0]['type']).render(), profiles);

  var _header = Pard.Widgets.UserHeader();
  var _footer = Pard.Widgets.Footer();

  $(_whole).append(_header.render(), _main.render(), _footer.render());

  var callButton = {
    artist: Pard.Widgets.CallButtonArtist,
    space: Pard.Widgets.CallSpaceButton
  }

  $(document).ready( function(){

  if (!(profiles[0].proposals)) callButton[profiles[0]['type']](profiles[0]).render().trigger('click');
  }); 

  $('body').append(_whole);

};

