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
  getProfileFromProposal: function(proposal_id){
    var _profile = '';
    Pard.CachedProfiles['my_profiles'].forEach(function(profile){
      if (!(_profile) && 'proposals' in profile){
        profile.proposals.forEach(function(proposal){
          if(proposal.proposal_id == proposal_id) _profile = profile;
        });
      }
    });
    return _profile;
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
  },
  addMultimedia: function(data, type, proposal_id){
    var proposal = Pard.ProfileManager.getProposal(proposal_id);
    proposal[type] = [] || proposal[type];
    proposal[type].push(data);
  },
  addProfilePicture: function(data, type, profile_id){
    console.log(profile_id);
    var profile = Pard.ProfileManager.getProfile(profile_id);
    console.log(profile);
    profile[type] = data;
    console.log(profile);
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

Pard.CachedEmbeds = {};

Pard.Profile = function(profiles){

  Pard.CachedProfiles['my_profiles'] = profiles;

  var _whole = $('<div>').addClass('whole-container');

    // var callButton = {
    //   artist: Pard.Widgets.CallButtonArtist,
    //   space: Pard.Widgets.CallSpaceButton
    // }

    window.fbAsyncInit = function() {
      FB.init({appId: '196330040742409', status: true, cookie: true, xfbml: true});
    }
    $.ajaxSetup({cache: true});
    $.getScript(document.location.protocol + '//connect.facebook.net/en_US/all.js');
    $.getScript(document.location.protocol + '//platform.instagram.com/en_US/embeds.js');
    $.getScript(document.location.protocol + '//assets.pinterest.com/js/pinit.js');
 
    var _done = [];
    var _links = [];

    profiles.forEach(function(profile){
      if('proposals' in profile && profile.proposals != null){

        if('profile_picture' in profile && profile.profile_picture != null){
          _links.push({
            media: {
              url: profile.profile_picture[0],
              provider: 'cloudinary',
              type: 'profile_image'
            },
            id: profile.profile_id
          });
        }

        profile.proposals.forEach(function(proposal){
          if('links' in proposal && proposal.links != null){
            Object.keys(proposal.links).map(function(index){
              _links.push({
                media: proposal.links[index],
                id: proposal.proposal_id
              });
            });
          }
        });
      }
    });

    var _oembed = function(link, id){
      $.getJSON("https://noembed.com/embed?callback=?",
        {"format": "json", "url": link['url']}, function (data) {
        Pard.ProfileManager.addMultimedia(data.html, link['type'], id);
        _done.push(link);
        
        if (_done.length == _links.length){
          var _main = Pard.Widgets.ProfileMainLayout(Pard.CachedProfiles['my_profiles']);
          var _header = Pard.Widgets.UserHeader();
          var _footer = Pard.Widgets.Footer();
          $(_whole).append(_header.render(), _main.render().attr({id: 'main-profile-page'}) , _footer.render());
          $('body').append(_whole);
        }
      });
    }

    var _cloudinary = function(link, id){
      var _img = $.cloudinary.image(link['url'],
        { format: 'jpg', width: 750, height: 220,
        crop: 'fill', effect: 'saturation:50' });
      Pard.ProfileManager.addProfilePicture(_img, link['type'], id);
      _done.push(link);

      if (_done.length == _links.length){
        var _main = Pard.Widgets.ProfileMainLayout(Pard.CachedProfiles['my_profiles']);
        var _header = Pard.Widgets.UserHeader();
        var _footer = Pard.Widgets.Footer();
        $(_whole).append(_header.render(), _main.render().attr({id: 'main-profile-page'}) , _footer.render());
        $('body').append(_whole);
      }
    }

    

    var _providers = {
      'cloudinary': _cloudinary,
      'youtube': _oembed,
      'vimeo': _oembed,
      'flickr': _oembed,
      'twitter': _oembed,
      'soundcloud': _oembed
    }

    _links.forEach(function(link){
      _providers[link['media']['provider']](link['media'], link['id'])
    });


    
    //Facebook posts and videos
    var _facebook = $('<div>').addClass('fb-post').attr('data-href', 'https://www.facebook.com/sesiondemicrosabiertos/photos/a.1633591080199483.1073741827.1633590566866201/1997144280510826/?type=3&theater');
    _facebook.css('width', '350'); //It won't go below 350
    Pard.CachedEmbeds['facebook'] = _facebook;

    // //Instagram
    // var _instagramphoto = $('<a>').attr('href', 'https://www.instagram.com/p/BDR_nV-oVRq/?taken-by=natgeo');
    // var _instagram = $('<blockquote>').addClass('instagram-media').append(_instagramphoto);
    // _sectionContent.append(_instagram);

    // //Pinterest
    // var _pinterest = $('<a>').attr({'data-pin-do':"embedPin" ,'href': 'https://es.pinterest.com/pin/399764904401679797/'});
    // _sectionContent.append(_pinterest);

    // //Vine
    // var _vine_url = 'https://vine.co/v/iHTTDHz6Z2v';
    // if(_vine_url.split('/').pop() != 'simple') _vine_url += '/embed/simple';
    // var _vine = $('<iframe>').attr('src', _vine_url);
    // _sectionContent.append(_vine);

    // //Youtube, Vimeo, Flickr and Twitter, SoundCloud
    // var url = "https://www.youtube.com/watch?v=Hq7Ml2Gz62E";
    // url = 'https://soundcloud.com/john-motherlesschild/mr-night-day';
    // $.getJSON("https://noembed.com/embed?callback=?",
    //   {"format": "json", "url": url}, function (data) {
    //   _sectionContent.append(data.html);
    // });

    // //Spotify
    // var spotify_url = 'http://open.spotify.com/track/2TpxZ7JUBn3uw46aR7qd6V';
    // var id = spotify_url.split('/').pop();
    // var _spotify = $('<iframe>').attr({'src': 'https://embed.spotify.com/?uri=spotify:track:' + id, 'frameborder': '0', 'allowtransparency': 'true'});
    // _sectionContent.append(_spotify);

    // //BandCamp
    // var _bandCampiframe = '<iframe style="border: 0; width: 100%; height: 120px;" src="https://bandcamp.com/EmbeddedPlayer/album=1364804381/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/track=1928405551/transparent=true/" seamless><a href="http://6ixtoys.bandcamp.com/album/6ix-toys">6ix Toys by 6ix Toys</a></iframe>'
    // var _bandCamp_url = '';
    // _bandCampiframe.split('"').forEach(function(string){
    //   if(string.match('EmbeddedPlayer')) _bandCamp_url = string; 
    // });
    // var _bandCamp = $('<iframe>').attr({'style': 'border: 0; width: 100%; height: 120px;', 'src': _bandCamp_url});
    // _sectionContent.append(_bandCamp);
  // if (profiles[0].calls == false) callButton[profiles[0]['type']](profiles[0]).render().trigger('click');
 

  

};