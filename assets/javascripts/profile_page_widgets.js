'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};
  ns.Widgets.ModifySectionContent = function (_modifyBtn, profileColor){
    var _createdWidget = $('<div>');
    _modifyBtn.css({color: _iconColor})
  
    var _iconColor = Pard.Widgets.IconColor((profileColor)).render();

    var _triangle = $('<div>').addClass('modify-section-content-button-container');


    var _profileColorRgba = Pard.Widgets.IconColor((profileColor)).rgba(0.2);

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


  ns.Widgets.MultimediaContent = function(proposal){

     var _multimediaContainer = Pard.Widgets.SectionBoxContainer('Contenidos multimediales', Pard.Widgets.IconManager('multimedia').render().addClass('multimedia-icon-title-box')).render();
    _multimediaContainer.addClass('multimedia-container section-box-container'); 

    var _multiMediaManager = Pard.Widgets.MultimediaManager(proposal);

    _multimediaContainer.append(_multiMediaManager.render().addClass('manage-multimedia-btn'));

    if(proposal.video){
      var _videoContainer = $('<div>').addClass('video-production-container')

      var _videoTitle = $('<div>').append($('<div>').addClass('video-title-box').append($('<h6>').text('Vídeos')));

      _multimediaContainer.append(_videoContainer);
      proposal.video.forEach(function(video){
        _videoContainer.prepend($('<div>').addClass('single-video-container').append(video))
      });
      _videoContainer.prepend(_videoTitle);
    };


    if(proposal.audio){
      var _audioContainer = $('<div>').addClass('image-production-container');
      var _audioTitle = $('<div>').addClass('single-image-container ').append($('<div>').addClass('single-image-content images-title-box').append($('<h6>').text('Audio')));
      _multimediaContainer.append(_audioContainer);
      proposal.audio.forEach(function(audio){
        _audioContainer.prepend($('<div>').addClass('single-image-container').append($('<div>').addClass('single-image-content').append(audio)));
      });
      _audioContainer.prepend(_audioTitle);

    }
    

    if(proposal.image){
      var _imageContainer = $('<div>').addClass('image-production-container');
      // var _imageTitle = $('<ul>').append($('<li>').append($('<h6>').text('Imágenes'))).addClass('image-audio-title');
      var _imageTitle = $('<div>').addClass('single-image-container').append($('<div>').addClass('single-image-content images-title-box').append($('<h6>').text('Imágenes')));      
      _multimediaContainer.append(_imageContainer);
      proposal.image.forEach(function(image){
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


ns.Widgets.MultimediaManagerDictionary = function(proposal){

  if (proposal.type == 'space') return Pard.Widgets.MultimediaSpaceManager(proposal);
  return Pard.Widgets.MultimediaManager(proposal);

}


 ns.Widgets.MultimediaManager = function(proposal){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Modifica o crea nuovo');
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Gestiona tus contenidos multimediales', function(){return Pard.Widgets.MultimediaManagerMessage(proposal)});

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.MultimediaManagerMessage = function(proposal){

    if (proposal.links){
      var _array = Object.keys(proposal['links']).map(function(key){return proposal['links'][key]});
      proposal['links'] = _array;
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
    
    if (proposal['type'] == 'space'){
      _submitForm['profile_id'] = proposal.profile_id;
    } 
    else{
      var profile_id = Pard.ProfileManager.getProfileId(proposal.proposal_id);
      _submitForm['proposal_id'] = proposal.proposal_id;
      _submitForm['profile_id'] = profile_id;
    }

    var _thumbnail = $('<div>');
    var _url = [];

    if(proposal.photos){
      proposal.photos.forEach(function(photo){
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

    Object.keys(proposal).forEach(function(key){
      if(proposal[key]) _submitForm[key] = proposal[key];
    });

    var _folder = 'photos';
    var _photos = Pard.Widgets.Cloudinary(_folder, _thumbnail, _url, 3);

    var _photosContainer = $('<div>').append(_photos.render(), _thumbnail);

    _formContainer.append(_photosContainer);

    if (proposal['type'] == 'space'){
      var _send = function(photos, links){
      _submitForm['photos'] = photos;
      _submitForm['links'] = links;
      console.log(_submitForm);
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

   var _inputMultimedia = Pard.Widgets.InputMultimedia();
   _inputMultimedia.setVal(proposal['links']);
    _formContainer.append($('<div>').addClass('links-MultimediaManager').append(_inputMultimedia.render()));

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

  // ns.Widgets.MultimediaSpaceManager = function(profile){

  //   var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Añade un contenido multimedia');
  //   var _popup = Pard.Widgets.PopupCreator(_caller, 'Modifica tu producción', function(){return Pard.Widgets.MultimediaSpaceManagerMessage(profile)});

  //   var _createdWidget = _popup.render();

  //   return {
  //     render: function(){
  //       return _createdWidget;
  //     }
  //   }
  // }

  // ns.Widgets.MultimediaSpaceManagerMessage = function(profile){

  //   if (profile.links){
  //     var _array = Object.keys(profile['links']).map(function(key){return profile['links'][key]});
  //     profile['links'] = _array;
  //   };

  //   var _createdWidget = $('<div>');
  //   var _formContainer = $('<form>').addClass('popup-form');
  //   var _message = $('<div>').html(
  //     'Puedes añadir contenidos multimedía en forma de videos o imagenes desde youtube, vimeo, vine, facebook, pintarest, instagram, flickr... Copia y pega el enlace correspondiente y dale un titúlo.'
  //     ).addClass('message-form');

  //   var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');
  //   var _submitForm = {};
  //   var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
  //   var _invalidInput = $('<div>').addClass('not-filled-text');

  //   _submitForm['profile_id'] = profile.profile_id;

  //   var _thumbnail = $('<div>');
  //   var _url = [];

  //   if(profile.photos){
  //     profile.photos.forEach(function(photo){
  //       _url.push(photo);
  //       var _container = $('<span>');
  //       var _previousPhoto = $.cloudinary.image(photo,
  //         { format: 'jpg', width: 50, height: 50,
  //           crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
  //       console.log(_formContainer);
  //       var _icon = $('<span>').addClass('material-icons').html('&#xE888').css({
  //         'position': 'relative',
  //         'bottom': '20px',
  //         'cursor': 'pointer'
  //       });

  //       _icon.on('click', function(){
  //         _url.splice(_url.indexOf(photo), 1);
  //         _photos.setUrl(_url);
  //         _container.empty();
  //       });

  //       _container.append(_previousPhoto, _icon);
  //       _thumbnail.append(_container);
  //     });
  //   }

  //   Object.keys(profile).forEach(function(key){
  //     if(profile[key]) _submitForm[key] = profile[key];
  //   });

  //   var _folder = 'photos';
  //   var _photos = Pard.Widgets.Cloudinary(_folder, _thumbnail, _url, 3);

  //   var _photosContainer = $('<div>').append(_photos.render(), _thumbnail);

  //   _formContainer.append(_photosContainer);

  //   var _send = function(photos, links){
  //     _submitForm['photos'] = photos;
  //     _submitForm['links'] = links;
  //     console.log(_submitForm);
  //     Pard.Backend.modifyProfile(_submitForm, Pard.Events.CreateProfile);
  //   }

  //  var _inputMultimedia = Pard.Widgets.InputMultimedia();
  //  _inputMultimedia.setVal(profile['links']);
  //   _formContainer.append($('<div>').addClass('links-MultimediaManager').append(_inputMultimedia.render()));

  //   _createdWidget.append(_message, _formContainer, _invalidInput, _submitBtnContainer.append(submitButton));

  //   var _closepopup = {};

  //   submitButton.on('click',function(){
  //     var _links = _inputMultimedia.getVal();
  //     _closepopup();

  //     if(_photos.dataLength() == false){
  //       _send(_url, _links);
  //     } 
  //     else{
  //       _photos.submit();
  //     }
  //   });
   
  //   _photos.render().bind('cloudinarydone', function(e, data){
  //     _url.push(data['result']['public_id']);
  //     if(_url.length >= _photos.dataLength()){
  //       var _links = _inputMultimedia.getVal();
  //       _send(_url, _links);
  //     } 
  //   });

  //   return {
  //     render: function(){
  //       return _createdWidget;
  //     },
  //     setCallback: function(callback){
  //       _closepopup = callback;
  //     }
  //   }
  // }

 


}(Pard || {}));

