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
 


}(Pard || {}));

