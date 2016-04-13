'use strict';

Pard.CachedProfiles = {};
Pard.ProfileManager = {
  getProfile: function(profile_id, profiles){
    var _profile = {};
    if (!(profiles)) profiles = Pard.CachedProfiles['my_profiles'];
    profiles.forEach(function(profile){
      if(profile.profile_id == profile_id) _profile = profile;
    });
    return _profile;
  },
  // getProposal: function(proposal_id){
  //   var _proposal = {};
  //   Pard.CachedProfiles['my_profiles'].forEach(function(profile){
  //     if('proposals' in profile){
  //       profile.proposals.forEach(function(proposal){
  //         if(proposal.proposal_id == proposal_id) _proposal = proposal;
  //       });
  //     }
  //   });
  //   return _proposal;
  // },
  getProposal: function(proposal_id, profiles){
    var _proposal = {};
    if (!(profiles)) var profiles =  Pard.CachedProfiles['my_profiles'];
    profiles.forEach(function(profile){
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
  // addProposalMultimedia: function(data, type, proposal_id){
  //   var proposal = Pard.ProfileManager.getProposal(proposal_id);
  //   proposal[type] = proposal[type] || [];
  //   proposal[type].push(data);
  // },
  // addProfileMultimedia: function(data, type, profile_id){
  //   var profile = Pard.ProfileManager.getProfile(profile_id);
  //   profile[type] = profile[type] || [];
  //   profile[type].push(data);
  // },
   addProposalMultimedia: function(data, type, proposal_id, profiles){
    if (profiles) {
      var proposal = Pard.ProfileManager.getProposal(proposal_id, profiles);}
    else{
      var proposal = Pard.ProfileManager.getProposal(proposal_id);}
    proposal[type] = proposal[type] || [];
    proposal[type].push(data);
  },
  addProfileMultimedia: function(data, type, profile_id, profiles){
    if (profiles) var profile = Pard.ProfileManager.getProfile(profile_id, profiles);
    else{
      var profile = Pard.ProfileManager.getProfile(profile_id, profiles);
    }
    profile[type] = profile[type] || [];
    profile[type].push(data);
  },
  // deleteMultimedia: function(){
  //  var profiles = Pard.CachedProfiles['my_profiles']
  //   profiles.forEach(function(profile){
  //     if('video' in profile) delete(profile['video']);
  //     if('image' in profile) delete(profile['image']);
  //     if('audio' in profile) delete(profile['audio']);
  //     if('proposals' in profile){
  //       profile.proposals.forEach(function(proposal){
  //         if('video' in proposal) delete(proposal['video']);
  //         if('image' in proposal) delete(proposal['image']);
  //         if('audio' in proposal) delete(proposal['audio']);
  //       });
  //     }
  //   });
  // }
  deleteMultimedia: function(profiles){
    if (!(profiles)) var profiles = Pard.CachedProfiles['my_profiles']
    profiles.forEach(function(profile){
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
  var _header = Pard.Widgets.InsideHeader(Pard.Widgets.UserDropdownMenu().render());

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
    var _header = Pard.Widgets.ProfileHeader();
    var _main = Pard.Widgets.ProfileMainLayout(Pard.CachedProfiles['my_profiles']).render().attr({id: 'main-profile-page'});
    _whole.append(_header.render(), _main,  _footer.render());
    $(document).ready(function(){$(document).foundation()});
  }

  Pard.Widgets.Multimedia(_display);
  $('body').append(_whole);
 
};

Pard.Visitor = function(profilesOut){
  
  console.log(profilesOut);

  var _whole = $('<div>').addClass('whole-container');

  var _out = true;

  var _display = function(){
    var _footer = Pard.Widgets.Footer();      
    var _header = Pard.Widgets.ProfileHeader();
    var _main = Pard.Widgets.ProfileMainLayout(profilesOut, _out).render().attr({id: 'main-profile-page'});

    _whole.append(_header.render(), _main,  _footer.render());
     $(document).ready(function(){$(document).foundation()});
  } 

  Pard.Widgets.Multimedia(_display, profilesOut);
  $('body').append(_whole);

};


Pard.Outsider = function(profilesOut){

  var _whole = $('<div>').addClass('whole-container');

  var _out = true;
  var _notLogged = true;

  var _display = function(){
    var _footer = Pard.Widgets.Footer();      
    var _header = Pard.Widgets.LoginHeader();
    var _main = Pard.Widgets.ProfileMainLayout(profilesOut, _out, _notLogged).render().attr({id: 'main-profile-page'});

    _whole.append(_header.render(), _main,  _footer.render());
     $(document).ready(function(){$(document).foundation()});
  } 

  Pard.Widgets.Multimedia(_display, profilesOut);
  $('body').append(_whole);
};