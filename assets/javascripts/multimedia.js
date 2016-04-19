'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.Multimedia = function(callback, profilesOut){

  	if (profilesOut) {
  		var _profiles = profilesOut; 
  		Pard.ProfileManager.deleteMultimedia(_profiles);
  	}
  	else {
  		var _profiles = Pard.CachedProfiles;
  		Pard.ProfileManager.deleteMultimedia();
  	}

		Pard.ProfileManager.deleteMultimedia(_profiles);

  	window.fbAsyncInit = function() {
	    //Heroku
	    FB.init({appId: '196330040742409', status: true, cookie: true, xfbml: true});
	    
	    //Local
   		//FB.init({appId: '282340465430456', status: true, cookie: true, xfbml: true});
		}
	  

	  var _done = [];
	  var _links = [];

	  var _managers = {
	    'profile': Pard.ProfileManager.addProfileMultimedia,
	    'production': Pard.ProfileManager.addProductionMultimedia
	  }

	  _profiles.forEach(function(profile){
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

	    if(profile.productions){
	      profile.productions.forEach(function(production){
	        if(production.photos){
	          production.photos.forEach(function(photo){
	            _links.push({
	              media: {
	                url: photo,
	                provider: 'cloudinary',
	                type: 'image'
	              },
	              id: production.production_id,
	              elementClass: 'production'
	            });
	          });
	        }

	        if(production.links){
	          Object.keys(production.links).map(function(index){
	            _links.push({
	              media: production.links[index],
	              id: production.production_id,
	              elementClass: 'production'
	            });
	          });
	        }
	      });
	    }
	  });


	  var _cloudinary = function(link, id, elementClass, profiles){

	    var _img = $.cloudinary.image(link['url'],
	      { format: 'jpg', width: 350	, effect: 'saturation:50' });
	    if (profiles) _managers[elementClass](_img[0], link['type'], id, profiles);
	    else{
	    	_managers[elementClass](_img[0], link['type'], id);
	    }

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
	  var _oembed = function(link, id, elementClass, profiles){
	    $.getJSON("https://noembed.com/embed?callback=?",
	      {"format": "json", "url": link['url']}, function (data) {      	      	
	       	if (!('error' in data)){
	      		var _media = data.html;
		       	if(link['provider'] == 'flickr'){
			      	var _src = '';
			      	data.html.split('"').forEach(function(string){
			      		if(string.match('https://noembed.com/i/')) _src = string.replace('https://noembed.com/i/','');
			      	});
		        	_media = $('<a>').append($('<img>').attr('src',_src)).attr({'href': link['url'], 'data-flickr-embed':'true', 'target':'_blank'});
		        	_media.addClass('flickr-embed-image-iframe');
			     	}
		        if (profiles) _managers[elementClass](_media, link['type'], id, profiles);
		        else{_managers[elementClass](_media, link['type'], id);}
	      		_done.push(link);
	      		_display();
	      	}
	    });
	  }

	  var _spotify = function(link, id, elementClass, profiles){
	    var audio_id = link['url'].split('/').pop();
	    var _spotifyMedia = $('<iframe>').attr({'src': 'https://embed.spotify.com/?uri=spotify:track:' + audio_id, 'frameborder': '0', 'allowtransparency': 'true'}).css('height','5rem');
	    if (profiles) _managers[elementClass](_spotifyMedia, link['type'], id, profiles);
	    else{
	    	_managers[elementClass](_spotifyMedia, link['type'], id);
	    }
	    _done.push(link);
	    _display();
	  }

	  var _facebook = function(link, id, elementClass, profiles){
		    var _facebookMedia = $('<div>').addClass('fb-post').attr('data-href', link['url']);
	 	    if (link['type'] == 'image'){
	 	    	if ($(window).width() > 400) { 
	 	    		_facebookMedia.attr('data-width', '350');
	 	    	}
	 	    	else{
	 	    		_facebookMedia = $('<div>').addClass('images-title-box').append($('<a>').attr({'href': link['url'], target:'_blank'}).text('Imagen de facebook')).css({'font-size':'12px', 'text-align': 'center'});
	 	    	}
	 	    }
		    if (link['type'] == 'video') {
		    	if ($(window).width() > 1024) {
			    	_facebookMedia.attr('data-width', '718'); //It won't go below 350
		  		}
		  		if ($(window).width() > 640) {
		  			var _videoWidth = $(window).width()-254;
		  			_facebookMedia.attr({'data-width': _videoWidth}); //It won't go below 350
		  		}
		  		if ($(window).width() > 400) { 
		  			var _videoWidth = $(window).width()-52;
	 	    		_facebookMedia.attr('data-width', _videoWidth);
	 	    	}
	 	    	else{
	 	    		_facebookMedia = $('<div>').addClass('images-title-box').append($('<a>').attr({'href': link['url'], target:'_blank'}).text('Vídeo de facebook')).css({'font-size':'12px', 'text-align': 'center'});
	 	    	}
		  	}
		  if (profiles) _managers[elementClass](_facebookMedia, link['type'], id, profiles);
		  else{
		  	_managers[elementClass](_facebookMedia, link['type'], id);
		  }
	    _done.push(link);
	    _display();
	  }

	  var _instagram = function(link, id, elementClass, profiles){
	  	var _createdWidget = $('<div>');
	    var _instagramphoto = $('<a>').attr('href', link['url']);
	    var _instagramMedia = $('<blockquote>').addClass('instagram-media').append(_instagramphoto);
	    _createdWidget.append(_instagramMedia);
	    if (profiles) _managers[elementClass](_createdWidget, link['type'], id, profiles);
	    else{
	    	_managers[elementClass](_createdWidget, link['type'], id);
	    }
	    _done.push(link);
	    _display();
	  }

	  var _pinterest = function(link, id, elementClass, profiles){
	  	var _createdWidget = $('<div>');
	    if ($(window).width() > 290) {
	    	var _pinterestMedia = $('<a>').attr({'data-pin-do':"embedPin" ,'href': link['url'], 'data-pin-width': 'medium'});
	    }
	    else{
	    	var _pinterestMedia = $('<a>').attr({'data-pin-do':"embedPin" ,'href': link['url'], 'data-pin-width': 'small'});
	    }
	    _createdWidget.append(_pinterestMedia);
	    if (profiles) _managers[elementClass](_createdWidget, link['type'], id, profiles);
	    else{ _managers[elementClass](_createdWidget, link['type'], id);}
	    _done.push(link);
	    _display();
	  }

	  var _vine = function(link, id, elementClass, profiles){
	    if(link['url'].split('/').pop() != 'embed' && link['url'].split('/').pop() != 'simple') {
	    	link['url'] += '/embed/simple';
	    }
	    if (link['url'].split('/').pop() != 'simple'){
	    	link['url'] += '/simple';
	    }
	    var _vineMedia = $('<iframe>').attr('src', link['url']);
	     if (profiles)_managers[elementClass](_vineMedia, link['type'], id, profiles);
	     else{
	     	_managers[elementClass](_vineMedia, link['type'], id);
	     }
	    _done.push(link);
	    _display();
	  }



	  var _bandCamp = function(link, id, elementClass, profiles){
	    //_bandCampiframe = '<iframe style="border: 0; width: 100%; height: 120px;" src="https://bandcamp.com/EmbeddedPlayer/album=1364804381/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/track=1928405551/transparent=true/" seamless><a href="http://6ixtoys.bandcamp.com/album/6ix-toys">6ix Toys by 6ix Toys</a></iframe>'
	    var _bandCamp_url = '';
	    link['url'].split('"').forEach(function(string){
	      if(string.match('EmbeddedPlayer')){
	        var _bandCampMedia = $('<div>').html(link['url']);
	      	if(string.match('large') && !(string.match('small'))){
 						_bandCampMedia.addClass('large-bandcamp-audio-player')
 					};
	        if (profiles) _managers[elementClass](_bandCampMedia, link['type'], id, profiles);
	        else{
	        	_managers[elementClass](_bandCampMedia, link['type'], id);
	        }
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

	  if (profilesOut)  _providers[link['media']['provider']](link['media'], link['id'], link['elementClass'], profilesOut);
	  else{
	  	_providers[link['media']['provider']](link['media'], link['id'], link['elementClass']);
	  }
	  });

  }



   ns.Widgets.MultimediaManager = function(production){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Modifica o crea nuovo');
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Gestiona tus contenidos multimedia', function(){return Pard.Widgets.MultimediaManagerMessage(production)});

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.MultimediaManagerMessage = function(production){

    if (production.links){
      var _array = Object.keys(production['links']).map(function(key){return production['links'][key]});
      production['links'] = _array;
    };

    var _createdWidget = $('<div>');
    var _formContainer = $('<form>').addClass('popup-form');

    var _videoList = $('<ul>').addClass('clearfix');
    _videoList.append($('<li>').html('<strong>vídeos</strong> desde:  youtube, vimeo, vine, facebook'));

    var _imageList = $('<ul>').addClass('clearfix');
    _imageList.append($('<li>').html('<strong>imágenes</strong> desde: tu ordenador, instagram, flickr, pinterest, twitter, facebook'));

    var _audioList = $('<ul>').addClass('clearfix');
    _audioList.append($('<li>').html('<strong>audios</strong> desde: soundcloud, bandcamp, spotify'));
    
    var _message = $('<div>').append($('<p>').text('Puedes añadir:'),_videoList, _imageList, _audioList).addClass('message-form multimedia-manager-message');

    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
   
    if (production['type'] == 'space'){
      _submitForm['profile_id'] = production.profile_id;
    } 
    else{
      var profile_id = Pard.ProfileManager.getProfileId(production.production_id);
      _submitForm['production_id'] = production.production_id;
      _submitForm['profile_id'] = profile_id;
    }

    var _inputMultimedia = Pard.Widgets.InputMultimedia();
    _inputMultimedia.setVal(production['links']);
    var _inputMultimediaLabel = $('<label>').addClass('multimedia-manager-input-label').text('Materiales online');


    _formContainer.append($('<div>').addClass('links-MultimediaManager').append(_inputMultimediaLabel,_inputMultimedia.render()));

    var _thumbnail = $('<div>').addClass('file-upload-thumbnail');
    var _url = [];

    if(production.photos){
      production.photos.forEach(function(photo){
        _url.push(photo);
        var _container = $('<span>');
        var _previousPhoto = $.cloudinary.image(photo,
          { format: 'jpg', width: 50, height: 50,
            crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
        var _icon = $('<span>').addClass('material-icons').html('&#xE888').css({
          'position': 'relative',
          'bottom': '20px',
          'cursor': 'pointer'
        });

        _icon.on('click', function(){
          _url.splice(_url.indexOf(photo), 1);
          _photos.setUrl(_url);
          _container.empty();
        });

        _container.append(_previousPhoto, _icon);
        _thumbnail.append(_container);
      });
    }

    Object.keys(production).forEach(function(key){
      if(production[key]) _submitForm[key] = production[key];
    });

    var _folder = 'photos';
    var _photos = Pard.Widgets.Cloudinary(_folder, _thumbnail, _url, 3);
    var _photosLabel = $('<label>').addClass('multimedia-manager-input-label').text('Sube imágenes desde tu ordenador (maximo 3)');

     var _photosContainer = $('<div>').append(_photosLabel,_photos.render(), _thumbnail);

    _formContainer.append(_photosContainer);

    if (production['type'] == 'space'){
      var _send = function(photos, links){
      _submitForm['photos'] = photos;
      _submitForm['links'] = links;
      Pard.Backend.modifyProfile(_submitForm, Pard.Events.CreateProfile);
    }
    } 
    else
      {var _send = function(photos, links){
        _submitForm['photos'] = photos;
        _submitForm['links'] = links;
        Pard.Backend.modifyProduction(_submitForm, function(data){
          Pard.Events.ModifyMultimedia(data);
        });
      }
    }

    _createdWidget.append(_message, _formContainer, _submitBtnContainer.append(submitButton));

    var _closepopup = {};

    submitButton.on('click',function(){
      var _links = _inputMultimedia.getVal();
      _closepopup();

      if(_photos.dataLength() == false){
        _send(_url, _links);
      } 
      else{
        _photos.submit();
      }
    });
   
    _photos.render().bind('cloudinarydone', function(e, data){
      _url.push(data['result']['public_id']);
      if(_url.length >= _photos.dataLength()){
        var _links = _inputMultimedia.getVal();
        _send(_url, _links);
      } 
    });

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }

  ns.Widgets.MultimediaAccepted = function(){
    var _caller = $('<a>').text('Entradas aceptadas');
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Como añadir...', function(){return Pard.Widgets.MultimediaAcceptedMessage()});

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    } 
  }

  ns.Widgets.MultimediaAcceptedMessage = function(){
     var _createdWidget = $('<div>');

     var _list = $('<ul>').addClass('multimedia-accepted-list');

     var _item1 = $('<li>').html('...una imagen desde <strong>flickr, instagram, pinterest</strong> (un pin), <strong>twitter</strong> (un tweet) o un vídeo desde <strong>youtube, vimeo, vine</strong> o un audio desde <strong>soundcloud</strong>:')

     var _sublist1 = $('<ol>').addClass('multimedia-accepted-sublist').append(
     	$('<li>').text('abre la imagen, el vídeo o el audio en el sitio web correspondiente'),
     	$('<li>').text('copia su enlace directamete desde el navegador o desde la opción "compartir" (o "copiar enlace")'),
     	$('<li>').text('pegalo en el campo del formulario de orfheo'),
     	$('<li>').text('dale al botón para validar')
     	);

      var _item2 = $('<li>').html('...una imagen, un post o un vídeo publicado en <strong>facebook</strong>:')

      var _sublist2 = $('<ol>').addClass('multimedia-accepted-sublist').append(
     	$('<li>').text('pincha la fecha con la hora de publicación que aparece en la parte superior del post'),
     	$('<li>').text('copia entonces desde el navegador el enlace de la página que se abre'),
     	$('<li>').text('pegalo en el campo del formulario de orfheo'),
     	$('<li>').text('dale al botón para validar')
     	);

     	var _item3 = $('<li>').html('...un audio desde <strong>bandcamp</strong>:')

      var _sublist3 = $('<ol>').addClass('multimedia-accepted-sublist').append(
     	$('<li>').text('en la página de la canción pincha a "Share/Embed" (bajo la foto principal) y entonces a "Embed this album"'),
     	$('<li>').text('selecciona un estilo del lector musical'),
     	$('<li>').text('copia el codigo html desde el campo Embed que aparec en la esquina izquierda superior'),
     	$('<li>').text('pegalo en el campo del formulario de orfheo'),
     	$('<li>').text('dale al botón para validar')
     	);

     	var _item4 = $('<li>').html('...un audio desde <strong>spotify</strong>:')

      var _sublist4 = $('<ol>').addClass('multimedia-accepted-sublist').append(
     	$('<li>').text('selecciona una cancion de una playlist con el botón derecho del ratón'),
     	$('<li>').text('pincha a "Copy Song Link"'),
     	$('<li>').text('pega el contenido copiado en el formulario de orfheo'),
     	$('<li>').text('dale al botón para validar')
     	);

      var _finalMessage = $('<p>').text('Finalmente, considera que se pueden importar en orfheo solo contenidos multimedia declarados publicos en la web donde se han subido.').css({'margin-top':'1rem'});

     _list.append(_item1.append(_sublist1), _item2.append(_sublist2), _item3.append(_sublist3), _item4.append(_sublist4),_finalMessage);

     _createdWidget.append(_list);

     return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
      }
    }
  }

}(Pard || {}));