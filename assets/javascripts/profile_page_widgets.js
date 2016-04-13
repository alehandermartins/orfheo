'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ProfileSectionHeader = function(sectionHeader, profile){
    sectionHeader.empty();

    var _photoContainer = $('<div>');

    if(profile.profile_picture){
      var _img = $.cloudinary.image(profile['profile_picture'][0],
      { format: 'jpg', width: 750, height: 220,
      crop: 'fill', effect: 'saturation:50' });
      _photoContainer.addClass('section-profilePhoto-container').append(_img);
    }
    else _photoContainer.css({'background-color': profile.color}).addClass('section-profilePhoto-container-noPhoto');

    sectionHeader.append(_photoContainer);

    
    if(profile['name'] != null) sectionHeader.append( $('<div>').addClass('title-profile-section-container').append($('<h3>').text(profile['name']).addClass('text-title-profile-section')));
 
  }


  ns.Widgets.ModifySectionContent = function (_modifyBtn, profileColor){
    var _createdWidget = $('<div>');
  
    var _iconColor = Pard.Widgets.IconColor(profileColor).render();

    _modifyBtn.css({color: _iconColor})


    var _triangle = $('<div>').addClass('modify-section-content-button-container');


    var _profileColorRgba = Pard.Widgets.IconColor(profileColor).rgba(0.2);

     _modifyBtn.hover(
      function(){
        _triangle.css({'border-top': '70px solid rgb('+_profileColorRgba[0]+','+_profileColorRgba[1]+','+_profileColorRgba[2]+')'});
      }, 
      function(){
        _triangle.css({'border-top': '70px solid'+profileColor});
      });

     _createdWidget.append(
      _triangle.css({'border-top': '70px solid'+profileColor}),
      _modifyBtn
    );

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.PrintWebsList = function(personal_webs_obj){

    var _createdWidget = $('<div>');
    var _webArray = Object.keys(personal_webs_obj).map(function(key){return personal_webs_obj[key]});
    var _socialIcons;
    var _personalWebs = $('<div>');
    var _socials = $('<span>');
   
    _webArray.forEach(function(elem){
      if (elem['provider'] != 'my_web'){
        var _iconSocial = Pard.Widgets.IconManager('icon_social').render().addClass('icon-in-box mySocials-icon-info-box');
        var _iconImg = Pard.Widgets.IconManager(elem['provider']).render();
        _iconImg.addClass('social-icon-fa')        
        var _iconA = $('<a>').attr({
          href: elem['url'],
          target: '_blank'            
        }).append(_iconImg);
        _socials.append(_iconA);
        _socialIcons = $('<div>').append($('<div>').addClass('information-contact-icon-column').append(_iconSocial), $('<p>').addClass('information-contact-text-column').append(_socials));
      }
      if (elem['provider'] == 'my_web'){
        var _iconLink = Pard.Widgets.IconManager('my_web').render();
        var _url = elem['url'];
        var _link = $('<a>').attr({
          href: elem['url'],
          target: '_blank'            
        }).css({
          'word-wrap': 'break-word',
        });
        ['http://', 'https://', 'www.'].forEach(function(string){
          if(_url.indexOf(string) > -1) {
            _url  = _url.substring(string.length);
          }
        })
        _link.text(_url);
       _personalWebs.append($('<div>').addClass('information-contact-icon-column').append(_iconLink), $('<p>').addClass('information-contact-text-column').append(_link));        
      }
    });
    
    if (_socialIcons)  _createdWidget.append(_socialIcons);
    if (_personalWebs.html()) _createdWidget.append(_personalWebs);

    return{
      render: function(){
        return _createdWidget;
      }
    } 
  } 

  ns.Widgets.MultimediaContent = function(production, out){

    var _multimediaContainer = Pard.Widgets.SectionBoxContainer('Contenidos multimedia', Pard.Widgets.IconManager('multimedia').render().addClass('multimedia-icon-title-box')).render();
    _multimediaContainer.addClass('multimedia-container section-box-container'); 

    if (!(out)){
      var _multiMediaManager = Pard.Widgets.MultimediaManager(production);
      _multimediaContainer.append(_multiMediaManager.render().addClass('manage-multimedia-btn'));
    }

    if(production.video){
      var _videoContainer = $('<div>').addClass('video-production-container')

      var _videoTitle = $('<div>').append($('<div>').addClass('video-title-box').append($('<h6>').text('Vídeos')));

      _multimediaContainer.append(_videoContainer);
      production.video.forEach(function(video){
        _videoContainer.prepend($('<div>').addClass('single-video-container').append(video))
      });
      _videoContainer.prepend(_videoTitle);
    };

    if(production.audio){
      var _audioContainer = $('<div>').addClass('image-production-container');
      var _audioTitle = $('<div>').addClass('single-image-container ').append($('<div>').addClass('single-image-content images-title-box').append($('<h6>').text('Audio')));
      _multimediaContainer.append(_audioContainer);
      production.audio.forEach(function(audio){
        _audioContainer.prepend($('<div>').addClass('single-image-container').append($('<div>').addClass('single-image-content').append(audio)));
      });
      _audioContainer.prepend(_audioTitle);

    }

    if(production.image){
      var _imageContainer = $('<div>').addClass('image-production-container');
      // var _imageTitle = $('<ul>').append($('<li>').append($('<h6>').text('Imágenes'))).addClass('image-audio-title');
      var _imageTitle = $('<div>').addClass('single-image-container').append($('<div>').addClass('single-image-content images-title-box').append($('<h6>').text('Imágenes')));      
      _multimediaContainer.append(_imageContainer);
      production.image.forEach(function(image){
        _imageContainer.append($('<div>').addClass('single-image-container').append($('<div>').addClass('single-image-content').append(image)));
      });
      _imageContainer.prepend(_imageTitle);
    }


    return{
      render: function(){
        return _multimediaContainer;
      }
    }
  }


// ns.Widgets.MultimediaManagerDictionary = function(production){

//   if (production.type == 'space') return Pard.Widgets.MultimediaSpaceManager(production);
//   return Pard.Widgets.MultimediaManager(production);

// }


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

    // var _videoProviders = ['youtube', 'vimeo', 'vine', 'facebook'];
    // var _imageProviders = ['tu ordenador', 'instagram', 'flickr', 'pinterest', 'twitter', 'facebook'];
    // var _audioProviders = ['soundcloud', 'bandcamp', 'spotify'];

    var _videoList = $('<ul>').addClass('clearfix');
    _videoList.append($('<li>').html('<strong>videos</strong> desde:  youtube, vimeo, vine, facebook'));
    // _videoProviders.forEach(function(element) {
    //   console.log(element);
    //   _videoList.append($('<li>').text(element));
    // });

    var _imageList = $('<ul>').addClass('clearfix');
    _imageList.append($('<li>').html('<strong>imágenes</strong> desde: tu ordenador, instagram, flickr, pinterest, twitter, facebook'));
    // _imageProviders.forEach(function(element) {
    //   _imageList.append($('<li>').text(element));
    // });

    var _audioList = $('<ul>').addClass('clearfix');
    _audioList.append($('<li>').html('<strong>audios</strong> desde:soundcloud, bandcamp, spotify'));
    // _audioProviders.forEach(function(element) {
    //   _audioList.append($('<li>').text(element));
    // });
    
    var _message = $('<div>').append($('<p>').text('Puedes añadir:'),_videoList, _imageList, _audioList).addClass('message-form multimedia-manager-message');

    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');

    var _invalidInput = $('<div>').addClass('not-filled-text');
    
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
    var _inputMultimediaLabel = $('<label>').addClass('multimedia-manager-input-label').text('Links a materiales online');


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


    _createdWidget.append(_message, _formContainer, _invalidInput, _submitBtnContainer.append(submitButton));

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
    var _caller = $('<a>').text('Enlaces permitidos');
    var _popup = Pard.Widgets.PopupCreator(_caller, '', function(){return Pard.Widgets.MultimediaAcceptedMessage()});

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    } 
  }

  ns.Widgets.MultimediaAcceptedMessage = function(){
     var _createdWidget = $('<div>');

     return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
      }
    }
  }


}(Pard || {}));

