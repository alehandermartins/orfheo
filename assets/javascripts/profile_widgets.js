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




}(Pard || {}));

