'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.Multimedia = function(callback){
  	var profiles = Pard.CachedProfiles['my_profiles'];
  	Pard.ProfileManager.deleteMultimedia();

  	window.fbAsyncInit = function() {
    //Heroku
    //FB.init({appId: '196330040742409', status: true, cookie: true, xfbml: true});
    
    //Local
    FB.init({appId: '282340465430456', status: true, cookie: true, xfbml: true});
	  }
	  

	  var _done = [];
	  var _links = [];

	  var _managers = {
	    'profile': Pard.ProfileManager.addProfileMultimedia,
	    'proposal': Pard.ProfileManager.addProposalMultimedia
	  }

	  profiles.forEach(function(profile){
	    if(profile.photos){
	      profile.photos.forEach(function(photo){
	        _links.push({
	          media: {
	            url: photo,
	            provider: 'cloudinary',
	            type: 'image'
	          },
	          id: profile.profile_id,
	          elementClass: 'profile'
	        });
	      });
	    }

	    if(profile.links){
	      Object.keys(profile.links).map(function(index){
	        _links.push({
	          media: profile.links[index],
	          id: profile.profile_id,
	          elementClass: 'profile'
	        });
	      });
	    }

	    if(profile.proposals){
	      profile.proposals.forEach(function(proposal){
	        if(proposal.photos){
	          proposal.photos.forEach(function(photo){
	            _links.push({
	              media: {
	                url: photo,
	                provider: 'cloudinary',
	                type: 'image'
	              },
	              id: proposal.proposal_id,
	              elementClass: 'proposal'
	            });
	          });
	        }

	        if(proposal.links){
	          Object.keys(proposal.links).map(function(index){
	            _links.push({
	              media: proposal.links[index],
	              id: proposal.proposal_id,
	              elementClass: 'proposal'
	            });
	          });
	        }
	      });
	    }
	  });


	  var _cloudinary = function(link, id, elementClass){
	  	// console.log(link.provider);
	    var _img = $.cloudinary.image(link['url'],
	      { format: 'jpg', width: 350	, effect: 'saturation:50' });
	    _managers[elementClass](_img[0], link['type'], id);
	    console.log($.cloudinary.url(link['url']));

	    if ($(window).width()>750){
		    var _popupImg = $.cloudinary.image(link['url'],{ format: 'jpg',  width: 750, effect: 'saturation:50' });

	    	var _createdWidget = $('<div>').addClass('fast reveal full');    
		    var _outerContainer = $('<div>').addClass('vcenter-outer');
		    var _innerContainer = $('<div>').addClass('vcenter-inner');
		    

		    var _closeBtn = $('<button>').addClass('close-button small-1 popup-close-btn').attr({type: 'button'});
		    _closeBtn.append($('<span>').html('&times;'));

		    var _popup = new Foundation.Reveal(_createdWidget, {animationIn: 'fade-in', animationOut: 'fade-out'});

		    _closeBtn.click(function(){
		      _popup.close();
		    });

		    var _popupContent = $('<div>').addClass('popup-photo-container').append(_popupImg,_closeBtn);

		    _innerContainer.append(_popupContent);
		    _createdWidget.append(_outerContainer.append(_innerContainer));

		    _img.one('mouseover', function(){
		    	$('body').append(_createdWidget)
		    });

		    _img.click(function(){
			    _popup.open();
		    });

		    _img.css({cursor:' pointer'});
		  }
	    _done.push(link);
	    _display();      
	  }

	  //Youtube, Vimeo, Flickr, Twitter, Soundcloud
	  var _oembed = function(link, id, elementClass){
	    $.getJSON("https://noembed.com/embed?callback=?",
	      {"format": "json", "url": link['url']}, function (data) {
	      _managers[elementClass](data.html, link['type'], id);
	      _done.push(link);
	      _display();
	    });
	  }

	  var _spotify = function(link, id, elementClass){
	    //spotify_url = 'http://open.spotify.com/track/2TpxZ7JUBn3uw46aR7qd6V';
	    var audio_id = link['url'].split('/').pop();
	    var _spotifyMedia = $('<iframe>').attr({'src': 'https://embed.spotify.com/?uri=spotify:track:' + audio_id, 'frameborder': '0', 'allowtransparency': 'true'});
	    _managers[elementClass](_spotifyMedia, link['type'], id);
	    _done.push(link);
	    _display();
	  }

	  var _facebook = function(link, id, elementClass){
	    var _facebookMedia = $('<div>').addClass('fb-post').attr('data-href', link['url']);
 	    if (link['type'] == 'image') _facebookMedia.attr('data-width', '350');
	    if (link['type'] == 'video') _facebookMedia.attr('data-width', '718'); //It won't go below 350
	    _managers[elementClass](_facebookMedia, link['type'], id);
	    _done.push(link);
	    _display();
	  }

	  var _instagram = function(link, id, elementClass){
	  	var _createdWidget = $('<div>');
	    var _instagramphoto = $('<a>').attr('href', link['url']);
	    var _instagramMedia = $('<blockquote>').addClass('instagram-media').append(_instagramphoto);
	    _createdWidget.append(_instagramMedia);
	    _managers[elementClass](_createdWidget, link['type'], id);
	    _done.push(link);
	    _display();
	  }

	  var _pinterest = function(link, id, elementClass){
	  	var _createdWidget = $('<div>');
	    var _pinterestMedia = $('<a>').attr({'data-pin-do':"embedPin" ,'href': link['url'], 'data-pin-width': 'medium'});
	    _createdWidget.append(_pinterestMedia);
	    _managers[elementClass](_createdWidget, link['type'], id);
	    _done.push(link);
	    _display();
	  }

	  var _vine = function(link, id, elementClass){
	    if(link['url'].split('/').pop() != 'embed' && link['url'].split('/').pop() != 'simple') {
	    	link['url'] += '/embed/simple';
	    }
	    if (link['url'].split('/').pop() != 'simple'){
	    	link['url'] += '/simple';
	    }
	    var _vineMedia = $('<iframe>').attr('src', link['url']);
	    _managers[elementClass](_vineMedia, link['type'], id);
	    _done.push(link);
	    _display();
	  }

	  var _bandCamp = function(link, id, elementClass){
	    //_bandCampiframe = '<iframe style="border: 0; width: 100%; height: 120px;" src="https://bandcamp.com/EmbeddedPlayer/album=1364804381/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/track=1928405551/transparent=true/" seamless><a href="http://6ixtoys.bandcamp.com/album/6ix-toys">6ix Toys by 6ix Toys</a></iframe>'
	    var _bandCamp_url = '';
	    link['url'].split('"').forEach(function(string){
	      if(string.match('EmbeddedPlayer')){
	        _bandCamp_url = string;
	        var _bandCampMedia = $('<iframe>').attr({'style': 'border: 0; width: 100%; height: 120px;', 'src': _bandCamp_url});
	        _managers[elementClass](_bandCampMedia, link['type'], id);
	      }
	    });
	    _done.push(link);
	    _display();
	  }

	  var _providers = {
	    'cloudinary': _cloudinary,
	    'youtube': _oembed,
	    'vimeo': _oembed,
	    'flickr': _oembed,
	    'twitter': _oembed,
	    'soundcloud': _oembed,
	    'spotify': _spotify,
	    'facebook': _facebook,
	    'instagram': _instagram,
	    'pinterest': _pinterest,
	    'vine': _vine,
	    'bandcamp': _bandCamp
	  }

	  var _display = function(){
	  	if (_done.length == _links.length){
	  		$.ajaxSetup({cache: true});
	  		$.getScript(document.location.protocol + '//connect.facebook.net/en_US/all.js');
	  		$.getScript(document.location.protocol + '//platform.instagram.com/en_US/embeds.js');
	  		$.getScript(document.location.protocol + '//assets.pinterest.com/js/pinit.js');
	  		$(document).ready(function(){
	  			callback();
	  		});
	  	}
	  }

	  if(_links.length == 0) _display();

	  _links.forEach(function(link){
	    _providers[link['media']['provider']](link['media'], link['id'], link['elementClass']);
	  });
  }

}(Pard || {}));