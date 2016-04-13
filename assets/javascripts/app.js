'use strict';

Pard.CachedProfiles = {};
Pard.ProfileManager = {
  getProfile: function(profile_id, profilesOut){
    var _profile = {};
    if (profilesOut){ profiles = profilesOut}
    else{
     profiles = Pard.CachedProfiles['my_profiles'];
    }
    profiles.forEach(function(profile){
      if(profile.profile_id == profile_id) _profile = profile;
    });
    return _profile;
  },
 
  getProduction: function(production_id, profilesOut){
    var _production = {};
    if (profilesOut) var profiles = profilesOut;
    else{
     var profiles =  Pard.CachedProfiles['my_profiles'];
    }
    profiles.forEach(function(profile){
      if('productions' in profile){
        profile.productions.forEach(function(production){
          if(production.production_id == production_id) _production = production;
        });
      }
    });
    return _production;
  },
  getProfileId: function(production_id){
    var _profile_id = '';
    Pard.CachedProfiles['my_profiles'].forEach(function(profile){
      if('productions' in profile){
        profile.productions.forEach(function(production){
          if(production.production_id == production_id) _profile_id = profile.profile_id;
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
      if('productions' in profile){
        profile.productions.forEach(function(prod, index){
          if(prod.production_id == production.production_id){
            for(var field in production){
              prod[field] = production[field];
            }
          }
        });
      }
    });
  },  
  addProductionMultimedia: function(data, type, production_id, profilesOut){
    if (profilesOut) {
      var production = Pard.ProfileManager.getProduction(production_id, profilesOut);}
    else{
      var production = Pard.ProfileManager.getProduction(production_id);}
    production[type] = production[type] || [];
    production[type].push(data);
  },
  addProfileMultimedia: function(data, type, profile_id, profilesOut){
    if (profilesOut) var profile = Pard.ProfileManager.getProfile(profile_id, profilesOut);
    else{
      var profile = Pard.ProfileManager.getProfile(profile_id);
    }
    profile[type] = profile[type] || [];
    profile[type].push(data);
  },
  
  deleteMultimedia: function(profilesOut){

    if (profilesOut) var profiles = profilesOut;
      else{
        var profiles = Pard.CachedProfiles['my_profiles']
    }
    profiles.forEach(function(profile){
      if('video' in profile) delete(profile['video']);
      if('image' in profile) delete(profile['image']);
      if('audio' in profile) delete(profile['audio']);
      if('productions' in profile){
        profile.productions.forEach(function(production){
          if('video' in production) delete(production['video']);
          if('image' in production) delete(production['image']);
          if('audio' in production) delete(production['audio']);
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

  console.log(profiles);

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

  console.log(profilesOut)

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