'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ProfileSectionHeader = function(sectionHeader, profile){

    sectionHeader.empty();

    var _photoContainer = $('<div>').addClass('section-profilePhoto-container');

    if('profile_picture' in profile && profile.profile_picture != null){
        var _photo = $.cloudinary.image(profile['profile_picture'][0],
          { format: 'jpg', width: 750, height: 220,
          crop: 'fill', effect: 'saturation:50' });
        _photoContainer.append(_photo);
    }
    else _photoContainer.css({'background-color': profile.color});

    sectionHeader.append(_photoContainer);
  
    // return {
    //   render: function(){
    //     return _headerProfileSection;
    //   }
    // }
  }

  ns.Widgets.ArtistSection = function(sectionHeader, sectionContent, profile_id) {
    
    profile_id = profile_id || Pard.CachedProfiles['my_profiles'][0].profile_id;
    var profile = Pard.ProfileManager.getProfile(profile_id);
   
    Pard.Widgets.ProfileSectionHeader(sectionHeader, profile);
    Pard.Widgets.ArtistSectionContent(sectionContent, profile); 

  }

  ns.Widgets.ArtistSectionContent = function(sectionContent, profile){

    sectionContent.empty();


    ['name','city', 'bio', 'personal_web'].forEach(function(element) {
      if(profile[element] != null) sectionContent.append( $('<div>').text(profile[element]));
    });



    // var _icon = $('<span>').addClass('fb_icon');
    // console.log(_icon);
    // _sectionContent.append(_icon);
    
    //Facebook posts and videos
    var _facebook = $('<div>').addClass('fb-post').attr('data-href', 'https://www.facebook.com/sesiondemicrosabiertos/photos/a.1633591080199483.1073741827.1633590566866201/1997144280510826/?type=3&theater');
    _facebook.css('width', '350'); //It won't go below 350
    sectionContent.append(_facebook);
    console.log(_facebook);

    //Instagram
    var _instagramphoto = $('<a>').attr('href', 'https://www.instagram.com/p/BDR_nV-oVRq/?taken-by=natgeo');
    var _instagram = $('<blockquote>').addClass('instagram-media').append(_instagramphoto);
    sectionContent.append(_instagram);

    //Pinterest
    var _pinterest = $('<a>').attr({'data-pin-do':"embedPin" ,'href': 'https://es.pinterest.com/pin/399764904401679797/'});
    sectionContent.append(_pinterest);

    //Vine
    var _vine_url = 'https://vine.co/v/iHTTDHz6Z2v';
    if(_vine_url.split('/').pop() != 'simple') _vine_url += '/embed/simple';
    var _vine = $('<iframe>').attr('src', _vine_url);
    sectionContent.append(_vine);

    //Youtube, Vimeo, Flickr and Twitter, SoundCloud
    var url = "https://www.youtube.com/watch?v=Hq7Ml2Gz62E";
    url = 'https://soundcloud.com/john-motherlesschild/mr-night-day';
    $.getJSON("https://noembed.com/embed?callback=?",
      {"format": "json", "url": url}, function (data) {
      sectionContent.append(data.html);
    });

    //Spotify
    var spotify_url = 'http://open.spotify.com/track/2TpxZ7JUBn3uw46aR7qd6V';
    var id = spotify_url.split('/').pop();
    var _spotify = $('<iframe>').attr({'src': 'https://embed.spotify.com/?uri=spotify:track:' + id, 'frameborder': '0', 'allowtransparency': 'true'});
    sectionContent.append(_spotify);

    //BandCamp
    var _bandCampiframe = '<iframe style="border: 0; width: 100%; height: 120px;" src="https://bandcamp.com/EmbeddedPlayer/album=1364804381/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/track=1928405551/transparent=true/" seamless><a href="http://6ixtoys.bandcamp.com/album/6ix-toys">6ix Toys by 6ix Toys</a></iframe>'
    var _bandCamp_url = '';
    _bandCampiframe.split('"').forEach(function(string){
      if(string.match('EmbeddedPlayer')) _bandCamp_url = string; 
    });
    var _bandCamp = $('<iframe>').attr({'style': 'border: 0; width: 100%; height: 120px;', 'src': _bandCamp_url});
    sectionContent.append(_bandCamp);

    var _modifyProfile = Pard.Widgets.ModifyProfile(profile);
    var _callButton = Pard.Widgets.CallButtonArtist(profile);
    var _myArtistCallProposals = Pard.Widgets.MyArtistCallProposals(profile.calls);

    sectionContent.append(_modifyProfile.render(), _myArtistCallProposals.render(), _callButton.render());

    $(document).ready(function(){if (!(profile.proposals)) _callButton.trigger('click')});

    // return{
    //   render: function(){
    //     return _sectionContainer;
    //   }
    // }
  }


  ns.Widgets.ArtistProductionSectionContent = function(proposal_id, sectionContent) {
    sectionContent.empty();
    sectionContent.append(Pard.Widgets.MyArtistProductionsContent(proposal_id).render(), Pard.Widgets.ModifyProduction(proposal_id, sectionContent).render(), Pard.Widgets.MultimediaManager(proposal_id, sectionContent).render());
  }

  ns.Widgets.MyArtistProductionsContent = function(proposal_id){

    var proposal = Pard.ProfileManager.getProposal(proposal_id);
    console.log(proposal);
    var _createdWidget = $('<div>');

    var _categoryFields = Pard.Forms.ArtistCall(proposal.category).productionFields();

    var _title = $('<div>').text('titulo: ' + proposal.title);
    var _description = $('<div>').text('descripción: ' + proposal.description);    
    var _shortDescription = $('<div>').text('descripción breve: ' + proposal.short_description);

    var _duration = $('<div>');
    var _children = $('<div>');
    var _multimediaContainer = $('<div>'); 

    if (proposal.duration){
      _duration.text('Duracción: ' + proposal.duration);
    };
    if (proposal.children){
      _children.text('Niños: ' + proposal.children);
    };
    if (proposal.links){
      var _linksArray = Object.keys(proposal['links']).map(function(key){return proposal['links'][key]});
      _linksArray.forEach(function(obj){
        var _webTitle = $('<div>').text('Titulo link: ' + obj['web_title']);
        var _link = $('<a>').attr({
          href: obj['link'],
          target: '_blank'
        }).text(obj['link']);
        var _multimediaElement = $('<div>').append(_webTitle, _link); 
        _multimediaContainer.append(_multimediaElement);
      }); 
    };

    if (proposal.photos){
      if('photos' in proposal && proposal.photos != null){
        proposal.photos.forEach(function(photo){
          var _photo = $.cloudinary.image(photo,
            { format: 'jpg', width: 50, height: 50,
              crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
          _createdWidget.append(_photo);
        });
      }
    }

    _createdWidget.append(_title, _description, _shortDescription, _duration, _children, _multimediaContainer);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


}(Pard || {}));
