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
          if(proposal.proposal_id == production.proposal_id){
            for(var field in production){
              proposal[field] = production[field];
            }
          }
        });
      }
    });
  },
  addProposalMultimedia: function(data, type, proposal_id){
    var proposal = Pard.ProfileManager.getProposal(proposal_id);
    proposal[type] = proposal[type] || [];
    proposal[type].push(data);
  },
  addProfileMultimedia: function(data, type, profile_id){
    var profile = Pard.ProfileManager.getProfile(profile_id);
    profile[type] = profile[type] || [];
    profile[type].push(data);
  },
  deleteMultimedia: function(){
    Pard.CachedProfiles['my_profiles'].forEach(function(profile){
      if('video' in profile) delete(profile['video']);
      if('image' in profile) delete(profile['image']);
      if('audio' in profile) delete(profile['audio']);
      if('proposals' in profile){
        profile.proposals.forEach(function(proposal){
          if('video' in proposal) delete(proposal['video']);
          if('image' in proposal) delete(proposal['image']);
          if('audio' in proposal) delete(proposal['audio']);
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

  $(document).ready(function(){$(document).foundation()});


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

  $(document).ready(function(){$(document).foundation()});

}

Pard.Profile = function(profiles){

  Pard.CachedProfiles['my_profiles'] = profiles;

  var _whole = $('<div>').addClass('whole-container');

  var _display = function(){
    var _footer = Pard.Widgets.Footer();      
    var _header = Pard.Widgets.UserHeader();
    var _main = Pard.Widgets.ProfileMainLayout(Pard.CachedProfiles['my_profiles']).render().attr({id: 'main-profile-page'});
    _whole.append(_header.render(), _main,  _footer.render());
    var _rgb = Pard.Widgets.IconColor(Pard.CachedProfiles['my_profiles'][0]['color']).rgb();
    var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
    $('#main-profile-page').css({'background': _backColor});
    $(document).ready(function(){$(document).foundation()});
  }

  Pard.Widgets.Multimedia(_display);
  $('body').append(_whole);
};

Pard.Visitor = function(profiles){
  var visitor = $('<div>').text('inside view');
  $('body').append(visitor);
};

Pard.Outsider = function(profiles){
  var outsider = $('<div>').text('outside view');
  $('body').append(outsider);
};