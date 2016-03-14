'use strict';


(function(ns){
  ns.Widgets = ns.Widgets || {};

  
  ns.Widgets.Alert = function(title, content, callback){

    var _content = $('<div>').addClass('very-fast reveal tiny');

    var _header = $('<div>').addClass('row');
    var _title = $('<h4>').addClass('small-11 columns').text(title);
    var _closeBtn = $('<button>').addClass('close-button small-1 columns').attr({type: 'button'});
    _closeBtn.append($('<span>').html('&times;'));

    var _popup = new Foundation.Reveal(_content, {closeOnClick: false, animationIn: 'slide-in-down', animationOut: 'slide-out-up'});

    _closeBtn.click(function(){
      if (callback) callback();
      _popup.close();
    });

    _header.append(_title, _closeBtn);

    _content.append(_header, content);

    $('body').append(_content);

    _popup.open();

  };


  ns.Widgets.PopupCreator = function(caller, message){

    var _content = $('<div>').addClass('very-fast reveal small');

    _content.append(message.render());

    var _popup = new Foundation.Reveal(_content, {closeOnClick: false, animationIn: 'slide-in-down', animationOut: 'slide-out-up'});

    var _popupCaller = caller;
    _popupCaller.on('click', function(){
      _popup.open();
    });

    message.setCallback(function(){_popup.close()});

    $(document).ready($('body').append(_content));

    return {
      render: function(){
        return _popupCaller;
      }
    }
  }



  ns.Widgets.PopupContent = function(title, content){

    var _createdWidget = $('<div>');
    var _header = $('<div>').addClass('row');
    var _title = $('<h4>').addClass('small-11 columns').text(title);
    var _closeBtn = $('<button>').addClass('close-button small-1 columns').attr({'data-close': '', type: 'button', 'aria-label': 'Close alert'});

    _closeBtn.append($('<span>').attr('aria-hidden', true).html('&times;'));

    _header.append(_title, _closeBtn);

    _createdWidget.append(_header, content.render());

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        content.setCallback(callback);
      }
    }
  }

  ns.Widgets.BasicPopup = function(btnCall_label, submitBtn_label, content){

    var _createdWidget =  $('<button>').addClass('pard-btn').attr({type: 'button'}).html(btnCall_label);
    var _message = $('<div>').addClass('very-fast reveal small');
    var _submitBtn = $('<button>').addClass('pard-btn').attr({type: 'button'}).html(submitBtn_label);

    var _popup = new Foundation.Reveal(_message, {closeOnClick: false, animationIn: 'slide-in-down', animationOut: 'slide-out-up'});

    _createdWidget.on('click', function(){
      _popup.open();
    });

    var _messageContent = content(_submitBtn);

    _messageContent.setCallback(function(){_popup.close()});

    _message.append(_messageContent.render());

    $('body').append(_message);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.Dictionary = function(voice){

    var _dictionary = {
      artist: 'Artista',
      space: 'Space',
      cultural_ass: 'Asociación Cultural',
      commercial: 'Local Comercial',
      home: 'Espacio Particular',
      music: 'Musica',
      arts: 'Artes Escénicas',
      expo: 'Exposición',
      poetry: 'Poesía',
      audiovisual: 'Audiovisual',
      street_art: 'Street Art',
      workshop: 'Taller',
      other: 'Otros'
    }

    return {
      render: function(){
        return _dictionary[voice];
      }
    }
  }

  ns.Widgets.Cloudinary = function(maxAmount, folder){
    var _createdWidget = $('<div>');
    var _thumbnail = $('<span>').addClass('thumbnails');
    var _url = [];

    _cloudinary = $.cloudinary.unsigned_upload_tag(
      "kqtqeksl",
      {
        cloud_name: 'hxgvncv7u',
        folder: folder
      }
    );

    _cloudinary.fileupload({
      replaceFileInput: false,
      add: function(e, data) {
        var uploadErrors = [];
        var acceptFileTypes = /^image\/(gif|jpe?g|png)$/i;

        if (_url.length >= maxAmount){
          uploadErrors.push('Only one image allowed');
        }
        if(data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
            uploadErrors.push('Not an accepted file type');
        }
        if(data.originalFiles[0]['size'] > 100000) {
            uploadErrors.push('Filesize is too big');
        }
        if(uploadErrors.length > 0) {
            alert(uploadErrors.join("\n"));
        } else {
            data.submit();
        }
      }
    });

    _cloudinary.bind('cloudinarydone', function(e, data){
      console.log(data['result']['public_id']);
      _url.push(data['result']['public_id']);
      $('.thumbnails').append($.cloudinary.image(data.result.public_id,
        { format: 'jpg', width: 50, height: 50,
        crop: 'thumb', gravity: 'face', effect: 'saturation:50' })
      );
    });

    _createdWidget.append(_cloudinary, _thumbnail);

    //.bind('fileuploadchange', function() { $(this).hide()})

    // .bind('cloudinaryprogress', function(e, data){
    // $('.progress_bar').css('width',
    //   Math.round((data.loaded * 100.0) / data.total) + '%');
    // });
    return {
      render: function(){
        return _createdWidget;
      },
      get_url: function(){
        return _url;
      }
    }
  }


  ns.Widgets.Sticker = function (elem, distanceFromHeader, stickyDistanceTop) {

    var _diffI = 1;
    var _distanceFromHeader = distanceFromHeader*(-1);

    $(document).ready(function(){
    $('.whole-container').scroll(function(){

      if ($(window).width() > 1024) {
        var _windowTop = $(elem).offset().top;
        var _headerTop = $('header').offset().top;
        var _fixedPosition = stickyDistanceTop;

        var _distanceFromWindow = _windowTop -_fixedPosition;

        if (_distanceFromWindow*_diffI<0)   {
            $(elem).css({position: 'fixed', 'margin-top':_distanceFromHeader+'px'});
            _diffI = -1;
          }
        if (_headerTop>_distanceFromHeader){
            $(elem).removeAttr('style');
            _diffI = +1;
          }
      }
    });
  })
    $( window ).resize(function() {
      $(elem).removeAttr('style');
    })

  }


  ns.Widgets.IconColor = function(hex){

    var cutHex =function (hex) {
      return (hex.charAt(0)=="#") ? hex.substring(1,7):hex
    }

    var _red = parseInt((cutHex(hex)).substring(0,2),16);
    var _green = parseInt ((cutHex(hex)).substring(2,4),16);
    var _blue = parseInt((cutHex(hex)).substring(4,6),16);
    var _reg =[_red, _green, _blue];
    var _lum = (_red / 255.0) * 0.3 + (_green / 255.0) * 0.59 + (_blue / 255.0) * 0.11;

    return {
      render: function(){
        return (_lum>0.35) ? 'black':'white';
      },
      rgb: function(){
        return _rgb
      }
    }
  }

  ns.Widgets.ReorderArray = function(array, index){
    var _part = array.slice(index);
    var _rest = array.slice(0, index);
    return{
      render: function(){
        return _part.concat(_rest);
      }
    }
  }

  ns.Widgets.MainLayout = function(asideContent, sectionContent, profiles){

    var _main = $('<main>');

    var _offCanvasWrapper = $('<div>').addClass('off-canvas-wrapper');
    var _offCanvasInner = $('<div>').addClass('off-canvas-wrapper-inner').attr({'data-off-canvas-wrapper': ''});
    var _offCanvasAside = $('<div>').addClass('off-canvas-grid-aside position-left-grid-aside').attr({id: 'offCanvas-navBar', 'data-off-canvas': ''});

    var _offCanvasSection = $('<div>').addClass('off-canvas-content').attr({'data-off-canvas-content': ''});

    var _mainLarge = $('<section>').addClass('pard-grid');
    var _gridSpacing = $('<div>').addClass('grid-spacing');


    var _aside = $('<nav>').addClass('grid-aside');
    var _section = $('<section>').addClass('grid-section');
    var _sectionContent = $('<div>');

    _offCanvasSection.append(sectionContent(profiles, _sectionContent).render());

    _offCanvasAside.append(asideContent(profiles, _sectionContent).render());
   
    _aside.append(_offCanvasAside);
    _section.append(_offCanvasSection);    
    _offCanvasInner.append(_aside, _gridSpacing, _section);

    _mainLarge.append(_offCanvasWrapper.append(_offCanvasInner));
    _main.append(_mainLarge);

    return {
      render: function(){
        return _main
      }
    }
  }


}(Pard || {}));
