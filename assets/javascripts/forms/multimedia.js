'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.MultimediaScripts = function(callback){
    $.getScript('//connect.facebook.net/en_US/all.js').done(function(){
      $.getScript('//platform.instagram.com/en_US/embeds.js').done(function(){
        $.getScript("http://assets.pinterest.com/js/pinit_main.js").done(function(data){
          $(document).ready(function(){
            FB.init({appId: '196330040742409', status: true, cookie: true, xfbml: true});
            //FB.init({appId: '282340465430456', status: true, cookie: true, xfbml: true});
            if (callback) callback();
          });
        });
      });
    });
    
    // window.fbAsyncInit = function() {
    //   FB.init({
    //     appId      : '196330040742409',
    //     xfbml      : true,
    //     version    : 'v2.7'
    //   });
    
    //   // Get Embedded Video Player API Instance
    //   var my_video_player;
    //   FB.Event.subscribe('xfbml.ready', function(msg) {
    //     if (msg.type === 'video') {
    //       my_video_player = msg.instance;
    //     }
    //   });
    // };

    // (function(d, s, id){
    //    var js, fjs = d.getElementsByTagName(s)[0];
    //    if (d.getElementById(id)) {return;}
    //    js = d.createElement(s); js.id = id;
    //    js.src = "//connect.facebook.net/en_US/all.js";
    //    fjs.parentNode.insertBefore(js, fjs);
    //  }(document, 'script', 'facebook-jssdk'));
  }

  ns.Widgets.MultimediaContent = function(production, callback){

    var _multimediaContainer = Pard.Widgets.SectionBoxContainer(Pard.t.text('profile_page.multimedia'), Pard.Widgets.IconManager('multimedia').render().addClass('multimedia-icon-title-box')).render();
    _multimediaContainer.addClass('multimedia-container section-box-container'); 
    var userStatus = Pard.UserStatus['status'];

    if (userStatus == 'owner'){
      var _multiMediaManager = Pard.Widgets.MultimediaManager(production);
      _multimediaContainer.append(_multiMediaManager.render().addClass('manage-multimedia-btn'));
    }

    Pard.Widgets.MultimediaDisplay(production, function(multimedia){
      if(multimedia['video'] != false){
        var _outerVideocontainer = $('<div>');
        var _videoContainer = $('<div>').addClass('video-production-container')

        var _videoTitle = $('<div>').addClass('single-image-container ').append($('<div>').addClass('single-image-content images-title-box').append($('<h6>').text(Pard.t.text('profile_page.video'))));
        
        // var _videoTitle = $('<div>').append($('<div>').addClass('video-title-box').append($('<h6>').text('Vídeos')));

        _multimediaContainer.append(_outerVideocontainer);
        multimedia.video.forEach(function(video){
          _videoContainer.prepend($('<div>').addClass('single-video-container').append(video))
        });
        _outerVideocontainer.append(_videoTitle, _videoContainer);
      };

      if(multimedia.audio != false){

        var _outerAudiocontainer = $('<div>');
        var _audioContainer = $('<div>').addClass('image-production-container');
        var _audioTitle = $('<div>').addClass('single-image-container ').append($('<div>').addClass('single-image-content images-title-box').append($('<h6>').text(Pard.t.text('profile_page.audio'))));
        _multimediaContainer.append(_outerAudiocontainer);
        multimedia.audio.forEach(function(audio){
          _audioContainer.prepend($('<div>').addClass('single-image-container').append($('<div>').addClass('single-image-content').append(audio)));
        });
        _outerAudiocontainer.append(_audioTitle, _audioContainer);

      }

      if(multimedia.image != false){
        var _outerImagescontainer = $('<div>');
        var _imageContainer = $('<div>').addClass('image-production-container');
        var _imageTitle = $('<div>').addClass('single-image-container').append($('<div>').addClass('single-image-content images-title-box').append($('<h6>').text(Pard.t.text('profile_page.images'))));      
        _multimediaContainer.append(_outerImagescontainer);
        multimedia.image.forEach(function(image){
          _imageContainer.append($('<div>').addClass('single-image-container').append($('<div>').addClass('single-image-content').append(image)));
        });
        _outerImagescontainer.append(_imageTitle, _imageContainer);
      }
      $(document).ready(function(){
        FB.XFBML.parse();
        window.instgrm.Embeds.process();
      });
    });

    return{
      render: function(){
        return _multimediaContainer;
      }
    }
  }
 
   ns.Widgets.MultimediaDisplay = function(production, callback){
      var spinner = new Spinner();
      spinner.spin();
      $('body').append(spinner.el);
      var multimedia = {};
      ['image', 'video', 'audio'].forEach(function(type){
        multimedia[type] = [];
      });

      var _done = [];
      var _links = [];
      var _linksTriedToBeDone = 0;

      if(production.photos){
        production.photos.forEach(function(photo){
          _links.push({
            url: photo,
            provider: 'cloudinary',
            type: 'image'
          });
        });
      }

      if(production.links){
        Object.keys(production.links).map(function(index){
          _links.push(production.links[index]);
        });
      }

      var _cloudinary = function(link){

        var _img = $.cloudinary.image(
          link['url'],
          { format: 'jpg', width: 350 , effect: 'saturation:50' }
        );
        multimedia[link['type']].push(_img[0]);

        // if ($(window).width()>750){
        var _popupImg = $.cloudinary.image(
          link['url'],
          { format: 'jpg',  width: 750, effect: 'saturation:50' }
        );

        var _createdWidget = $('<div>').addClass('fast reveal full');    
        var _outerContainer = $('<div>').addClass('vcenter-outer');
        var _innerContainer = $('<div>').addClass('vcenter-inner');
        

        var _closeBtn = $('<button>').addClass('close-button small-1 popup-close-btn').attr({type: 'button'});
        _closeBtn.append($('<span>').html('&times;'));

        var _popup = new Foundation.Reveal(_createdWidget, {animationIn: 'fade-in', animationOut: 'fade-out', multipleOpened:true});

        _closeBtn.click(function(){
          _popup.close();
        });

        _createdWidget.click(function(e){
          if ($(e.target).hasClass('vcenter-inner')) {
            _popup.close();
          }
        })

        var _popupContent = $('<div>').addClass('popup-photo-container').append(_popupImg,_closeBtn);

        _innerContainer.append(_popupContent);
        _createdWidget.append(_outerContainer.append(_innerContainer));

        _img.one('mouseover', function(){
          $('body').append(_createdWidget)
        });

        _img.click(function(){
          _popup.open();
        });

        _img.css({cursor:'zoom-in'});
        // }
        _done.push(link);
         _linksTriedToBeDone +=1;
        _display();      
      }

      //Youtube, Vimeo, Flickr, Twitter, Soundcloud
      var _oembed = function(link){
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
              multimedia[link['type']].push(_media);
              _done.push(link);
               _linksTriedToBeDone +=1;
              _display();
            }
            else{
               _linksTriedToBeDone +=1;
               _display();
            }
        });
      }

      var _spotify = function(link){
        var audio_id = link['url'].split('/').pop();
        var _spotifyMedia = $('<iframe>').attr({'src': 'https://embed.spotify.com/?uri=spotify:track:' + audio_id, 'frameborder': '0', 'allowtransparency': 'true'}).css('height','5rem');
        multimedia[link['type']].push(_spotifyMedia);
        _done.push(link);
        _linksTriedToBeDone +=1;
        _display();
      }

      var _facebook = function(link){
        var _facebookMedia = $('<div>').addClass('fb-post').attr('data-href', link['url']);
        if (link['type'] == 'image'){
          if ($(window).width() > 400) { 
            _facebookMedia.attr({'data-width': '350'});
          }
          else{
            _facebookMedia = $('<div>').addClass('images-title-box').append($('<a>').attr({'href': link['url'], target:'_blank'}).text('Imagen de facebook')).css({'font-size':'12px', 'text-align': 'center'});
          }
        }
        if (link['type'] == 'video') {
          _facebookMedia = $('<div>').addClass('fb-video').attr('data-href', link['url']);
          if ($(window).width() > 1024) {
            _facebookMedia.attr({'data-width': '718', 'data-allowfullscreen':'true'}); 
          }
          else if ($(window).width() > 640) {
            var _videoWidth = $(window).width()-254;
            _facebookMedia.attr({'data-width': _videoWidth , 'data-allowfullscreen':'true'}); //It won't go below 350
          }
          else { 
            var _videoWidth = $(window).width()-52;
            _facebookMedia.attr({'data-width':_videoWidth, 'data-allowfullscreen':'true'});
          }
          // else{
          //   _facebookMedia = $('<div>').addClass('images-title-box').append($('<a>').attr({'href': link['url'], target:'_blank'}).text('Vídeo de facebook')).css({'font-size':'12px', 'text-align': 'center'});
          // }
        }
        multimedia[link['type']].push(_facebookMedia);
        _done.push(link);
        _linksTriedToBeDone +=1;
        _display();
      }

      var _instagram = function(link, id, elementClass, profiles){
        var _createdWidget = $('<div>');
        var _instagramphoto = $('<a>').attr('href', link['url']);
        var _instagramMedia = $('<blockquote>').addClass('instagram-media').append(_instagramphoto);
        _createdWidget.append(_instagramMedia);
        multimedia[link['type']].push(_instagramMedia);
        _done.push(link);
        _linksTriedToBeDone +=1;
        _display();
      }

      var _pinterest = function(link, id, elementClass, profiles){
        var _createdWidget = $('<div>');
        if ($(window).width() > 290) {
          var _pinterestMedia = $('<a>').attr({'data-pin-do':"embedPin", 'href': link['url'], 'data-pin-width': 'medium'});
        }
        else{
          var _pinterestMedia = $('<a>').attr({'data-pin-do':"embedPin",'href': link['url'], 'data-pin-width': 'small'});
        }
        _createdWidget.append(_pinterestMedia);
        multimedia[link['type']].push(_pinterestMedia);
        _done.push(link);
        _linksTriedToBeDone +=1;
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
        multimedia[link['type']].push(_vineMedia);
        _done.push(link);
        _linksTriedToBeDone +=1;
        _display();
      }



      var _bandCamp = function(link, id, elementClass, profiles){
        var _bandCamp_url = '';
        link['url'].split('"').forEach(function(string){
          if(string.match('EmbeddedPlayer')){
            var _bandCampMedia = $('<div>').html(link['url']);
            if(string.match('large') && !(string.match('small'))){
              _bandCampMedia.addClass('large-bandcamp-audio-player')
            };
            multimedia[link['type']].push(_bandCampMedia);
          }
        });
        _done.push(link);
        _linksTriedToBeDone +=1;
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
      // if (_done.length == _links.length)
      if (_linksTriedToBeDone == _links.length){  
        $.wait(
        '', 
        function(){
        callback(multimedia);
        },
        function(){
          spinner.stop();
        }
        );
      }
    }

    if(_links.length == 0)  spinner.stop();

    _links.forEach(function(link){
      _providers[link['provider']](link);
    });
   
  }


  ns.Widgets.MultimediaManager = function(production){
    var _popup;
    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html(Pard.t.text('widget.multimediaManager.btn'))
      .one('click', function(){
        _popup = Pard.Widgets.Popup();
      })
      .click(function(){
        var _multiMediaManagerPopupMex = Pard.Widgets.MultimediaManagerMessage(production);
        _multiMediaManagerPopupMex.setCallback(function(){_popup.close()});
        _popup.setContent(Pard.t.text('widget.multimediaManager.title'), _multiMediaManagerPopupMex.render());
        _popup.open();
      });

    return {
      render: function(){
        return _caller;
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
    _videoList.append($('<li>').html(Pard.t.text('widget.multimediaManager.videoList')));

    var _imageList = $('<ul>').addClass('clearfix');
    _imageList.append($('<li>').html(Pard.t.text('widget.multimediaManager.imageList')));

    var _audioList = $('<ul>').addClass('clearfix');
    _audioList.append($('<li>').html(Pard.t.text('widget.multimediaManager.audioList')));
    
    var _message = $('<div>').append($('<p>').text(Pard.t.text('widget.multimediaManager.mex')),_videoList, _imageList, _audioList).addClass('message-form multimedia-manager-message');

    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
   
    if (production['type'] == 'space' || production['type'] == 'organization'){
      _submitForm['profile_id'] = production.profile_id;
    } 
    else{
      var profile_id = Pard.ProfileManager.getProfileId(production.production_id);
      _submitForm['production_id'] = production.production_id;
      _submitForm['profile_id'] = profile_id;
    }

    var _inputMultimedia = Pard.Widgets.InputMultimedia();
    _inputMultimedia.setVal(production['links']);
    var _inputMultimediaLabel = $('<label>').addClass('multimedia-manager-input-label').text(Pard.t.text('createProfile.spaceForm.linksL'));

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
    var _photos = Pard.Widgets.Cloudinary(_folder, _thumbnail, _url, 4);
    var _photosLabel = $('<label>').addClass('multimedia-manager-input-label').text(Pard.t.text('widget.multimediaManager.photoL'));

     var _photosContainer = $('<div>').append(_photosLabel,_photos.render(), _thumbnail)
     _photosContainer.addClass('multimedia-manager-photos-container');

    _formContainer.append(_photosContainer);

    if (production['type'] == 'space' || production['type'] == 'organization'){
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
   
    _photos.cloudinary().bind('cloudinarydone', function(e, data){
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
    var _caller = $('<a>').text(Pard.t.text('widget.inputMultimedia.acepted'))
      .click(function(){
        Pard.Widgets.BigAlert(Pard.t.text('widget.inputMultimedia.popup.title'), Pard.Widgets.MultimediaAcceptedMessage().render());
      });
 
    return {
      render: function(){
        return _caller;
      }
    } 
  }

  ns.Widgets.MultimediaAcceptedMessage = function(){
     var _createdWidget = $('<div>');

     var _list = $('<ul>').addClass('multimedia-accepted-list');

     var _item1 = $('<li>').html(Pard.t.text('widget.inputMultimedia.popup.item1'))

     var _sublist1 = $('<ol>').addClass('multimedia-accepted-sublist').append(
     	$('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublist1_1')),
     	$('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublist1_2')),
     	$('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublist1_3')),
     	$('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublist1_4'))
     	);

     var _itemTwitter = $('<li>').html(Pard.t.text('widget.inputMultimedia.popup.itemTwitter'))

     var _sublistTwitter = $('<ol>').addClass('multimedia-accepted-sublist').append(
      $('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublistTwitter_1')),
      $('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublistTwitter_2')),
      $('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublistTwitter_3')),
      $('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublistTwitter_4')),
      $('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublistTwitter_5'))
      );

      

      var _item2 = $('<li>').html(Pard.t.text('widget.inputMultimedia.popup.item2'))

      var _sublist2 = $('<ol>').addClass('multimedia-accepted-sublist').append(
     	$('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublist2_1')),
     	$('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublist2_2')),
     	$('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublist2_3')),
     	$('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublist2_4'))
     	);

     	var _item3 = $('<li>').html(Pard.t.text('widget.inputMultimedia.popup.item3'))

      var _sublist3 = $('<ol>').addClass('multimedia-accepted-sublist').append(
     	$('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublist3_1')),
     	$('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublist3_2')),
     	$('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublist3_3')),
     	$('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublist3_4')),
     	$('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublist3_5'))
     	);

     	var _item4 = $('<li>').html(Pard.t.text('widget.inputMultimedia.popup.item4'))

      var _sublist4 = $('<ol>').addClass('multimedia-accepted-sublist').append(
     	$('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublist4_1')),
     	$('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublist4_2')),
     	$('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublist4_3')),
     	$('<li>').text(Pard.t.text('widget.inputMultimedia.popup.sublist4_4'))
     	);

      var _finalMessage = $('<p>').text(Pard.t.text('widget.inputMultimedia.popup.finalMex')).css({'margin-top':'1rem'});

     _list.append(_item1.append(_sublist1), _itemTwitter.append(_sublistTwitter), _item2.append(_sublist2), _item3.append(_sublist3), _item4.append(_sublist4));

     _createdWidget.append(_list,_finalMessage);

     return {
      render: function(){
        return _createdWidget;
      }
    }
  }

}(Pard || {}));