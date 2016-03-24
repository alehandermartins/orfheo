'use strict';

Pard.CachedProfiles = {};
Pard.ProfileManager = {
  getProfile: function(profile_id){
    var _profile = {};
    Pard.CachedProfiles['my_profiles'].forEach(function(profile){
      if(profile.profile_id == profile_id) _profile = profile;
    });
    return _profile;
  },
  getProposal: function(proposal_id){
    var _proposal = {};
    Pard.CachedProfiles['my_profiles'].forEach(function(profile){
      if('proposals' in profile){
        profile.proposals.forEach(function(proposal){
          if(proposal.proposal_id == proposal_id) _proposal = proposal;
        });
      }
    });
    return _proposal;
  },
  getProfileId: function(proposal_id){
    var _profile_id = '';
    Pard.CachedProfiles['my_profiles'].forEach(function(profile){
      if('proposals' in profile){
        profile.proposals.forEach(function(proposal){
          if(proposal.proposal_id == proposal_id) _profile_id = profile.profile_id;
        });
      }
    });
    return _profile_id;
  },
  getUserId: function(){
    return Pard.CachedProfiles['my_profiles'][0].user_id;
  },
  modifyProduction: function(production){
    Pard.CachedProfiles['my_profiles'].forEach(function(profile){
      if('proposals' in profile){
        profile.proposals.forEach(function(proposal, index){
          if(proposal.proposal_id == production.proposal_id) profile.proposals[index] = production;
        });
      }
    });
  }
}

Pard.Welcome = function(profiles){

  Pard.CachedProfiles['profiles'] = profiles;

  var _header = Pard.Widgets.LoginHeader();
  var _main = Pard.Widgets.MainLayout(Pard.Widgets.LoginAside, Pard.Widgets.LoginSection);
  var _footer = Pard.Widgets.Footer();
  var _whole = $('<div>').addClass('whole-container');
  
  _whole.append(_header.render(), _main.render(), _footer.render());
  
  $('body').append(_whole);

}

Pard.Users = function(profiles){

  Pard.CachedProfiles['profiles'] = profiles.profiles;
  Pard.CachedProfiles['my_profiles'] = profiles.my_profiles;

  var _whole = $('<div>').addClass('whole-container');
  var _header = Pard.Widgets.UserHeader();

  var _main = Pard.Widgets.MainLayout(Pard.Widgets.UserAside, Pard.Widgets.UserSection);

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



  Pard.CachedProfiles['my_profiles'] = profiles;

  var _whole = $('<div>').addClass('whole-container');

  var _main = Pard.Widgets.MainLayout(Pard.Widgets.ProfileAside, Pard.Widgets.ProfileSection(profiles[0]['type']).render());

  var _header = Pard.Widgets.UserHeader();
  var _footer = Pard.Widgets.Footer();

  $(_whole).append(_header.render(), _main.render().attr({id: 'main-profile-page'}) , _footer.render());

  var callButton = {
    artist: Pard.Widgets.CallButtonArtist,
    space: Pard.Widgets.CallSpaceButton
  }

  $(document).ready( function(){

  window.fbAsyncInit = function() {
    FB.init({appId: '196330040742409', status: true, cookie: true, xfbml: true});
  }
  $.ajaxSetup({cache: true});
  $.getScript(document.location.protocol + '//connect.facebook.net/en_US/all.js');
  $.getScript(document.location.protocol + '//platform.instagram.com/en_US/embeds.js');
  $.getScript(document.location.protocol + '//assets.pinterest.com/js/pinit.js');

  if (!(profiles[0].proposals)) callButton[profiles[0]['type']](profiles[0]).render().trigger('click');
  }); 


  $('body').append(_whole);

};

