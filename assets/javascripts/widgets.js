'use strict';


(function(ns){
  ns.Widgets = ns.Widgets || {};


  ns.Widgets.Alert = function(title, content, callback){

    var _createdWidget = $('<div>').addClass('fast reveal full');    
    var _outerContainer = $('<div>').addClass('vcenter-outer');
    var _innerContainer = $('<div>').addClass('vcenter-inner');
    var _popupContent = $('<div>').addClass('alert-container-full');
    var _sectionContainer = $('<section>').addClass('popup-content').css('font-size','18px');
    var _header = $('<div>').addClass('row popup-header');
    var _title = $('<h4>').addClass('small-11 popup-title').text(title);
    var _closeBtn = $('<button>').addClass('close-button small-1 popup-close-btn').attr({type: 'button'});
    _closeBtn.append($('<span>').html('&times;'));

    var _popup = new Foundation.Reveal(_createdWidget, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});

    _closeBtn.click(function(){
      if (callback) callback();
      _popup.close();
    });
 
    _header.append(_title, _closeBtn);
    _sectionContainer.append(content);
    _popupContent.append(_header, _sectionContainer);
    _innerContainer.append(_popupContent);
    _createdWidget.append(_outerContainer.append(_innerContainer));

    $('body').append(_createdWidget);

    _popup.open();

  };


  ns.Widgets.PopupCreator = function(caller, title, message, contentClass){

    var _content = $('<div>').addClass('very-fast reveal full');

    var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});

    var _popupCaller = caller;


    _popupCaller.one('click', function(){
      $('body').append(_content);
    });

    _popupCaller.on('click', function(){
      _content.empty();
      var _message = Pard.Widgets.PopupContent(title, message(), contentClass);
      _message.setCallback(function(){_popup.close()});
      _content.append(_message.render());
      _popup.open();
    });

    return {
      render: function(){
        return _popupCaller;
      }
    }
  }



  ns.Widgets.PopupContent = function(title, content, contentClass){

    var _createdWidget = $('<div>').addClass('vcenter-outer');
    var _container = $('<div>').addClass('vcenter-inner');
    var _popupContent = $('<div>');
    if (contentClass){_popupContent.addClass(contentClass);}
    else{_popupContent.addClass('popup-container-full');}
    var _sectionContainer = $('<section>').addClass('popup-content');
    var _header = $('<div>').addClass('row popup-header');
    var _title = $('<h4>').addClass('small-11 popup-title').text(title);
    var _closeBtn = $('<button>').addClass('close-button small-1 ').attr({'data-close': '', type: 'button', 'aria-label': 'Close alert'});

    _closeBtn.append($('<span>').attr('aria-hidden', true).html('&times;'));

    _header.append(_title, _closeBtn);


    _sectionContainer.append(content.render());
    _popupContent.append(_header, _sectionContainer);
    _createdWidget.append(_container.append(_popupContent));
    
    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        content.setCallback(callback);
      }
    }
  }



  ns.Widgets.Dictionary = function(voice){

    var _recoverPasswd = function(text){
      var _messageContainer = $('<div>').append()
      var _message  = $('<div>').text(text).css({
        'font-size': '18px',
        'margin-bottom':'1rem'
      });

      
      var _emailRecovery = $('<div>');
      var _caller = $('<a>').attr('href','#').text('¿Has olvidado la contraseña?');

      var _popup = Pard.Widgets.PopupCreator(_caller,'Recupera tu cuenta', function(){return Pard.Widgets.RecoveryMessage()});

      _emailRecovery.append(_popup.render());

      _messageContainer.append(_message, _emailRecovery);

      return {
        render: function(){    
          return _messageContainer;
        },
        setCallback: function(callback){
          _caller.on('click',function(){callback()});
        }
      }
    }

    var _noExistingUser = function(){
      var _messageContainer = $('<div>').append()
      var _message  = $('<div>').text('¡No existe ningun usuario asociado con este correo!').css({
        'font-size': '18px',
        'margin-bottom':'1rem'
      });
      
      var _register = $('<div>');
      var _caller = $('<button>').attr({type:'button'}).html('Regístrate')

      
      var _popup = Pard.Widgets.PopupCreator(_caller, 'Regístrate para continuar', function(){return Pard.Widgets.Registration()});

      var _signUpButton = _popup.render();
      _signUpButton.addClass('signupButton-alert');
    
      _messageContainer.append(_message, _signUpButton);

      return {
        render: function(){
          return _messageContainer;
        },
        setCallback: function(callback){
          _caller.on('click',function(){callback()});
        }
      }
    }

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
      other: 'Otros',
      already_registered: function(){return _recoverPasswd('¡Usuario ya registrado!')},
      non_existing_user: function(){return _noExistingUser()},
      invalid_parameters: '<div>Los parámetros insertados no son validos!<br/> Por favor, revísalos.</div>',
      invalid_email: '<div>¡El correo no es correcto!<br/> Por favor, vuelve a intentar.</div>',
      incorrect_password: function(){return _recoverPasswd('¡Contraseña equivocada!')},
      not_validated_user:'Al registrate, te enviamos un correo electrónico con un enlace para activar tu cuenta. Controla también en la carpeta de spam.'
    }   

    return {
      render: function(){
        if (typeof _dictionary[voice] == 'function') return _dictionary[voice]();
        return _dictionary[voice];
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
      return (hex.charAt(0)=="#") ? hex.substring(1,7):hex;
    }

    var _red = parseInt((cutHex(hex)).substring(0,2),16);
    var _green = parseInt ((cutHex(hex)).substring(2,4),16);
    var _blue = parseInt((cutHex(hex)).substring(4,6),16);
    var _rgb =[_red, _green, _blue];
    var _lum = (_red / 255.0) * 0.3 + (_green / 255.0) * 0.59 + (_blue / 255.0) * 0.11;

    return {
      render: function(){
        return (_lum>0.35) ? 'black':'white';
      },
      rgb: function(){
        return _rgb;
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

  ns.Widgets.MainLayout = function(asideContent, sectionContent){

    var _main = $('<main>');

    var _offCanvasWrapper = $('<div>').addClass('off-canvas-wrapper');
    var _offCanvasInner = $('<div>').addClass('off-canvas-wrapper-inner').attr({'data-off-canvas-wrapper': ''});
    var _offCanvasAside = $('<div>').addClass('off-canvas-grid-aside position-left-grid-aside').attr({id: 'offCanvas-navBar', 'data-off-canvas': ''});

    var _offCanvasSection = $('<div>').addClass('off-canvas-content').attr({'data-off-canvas-content': ''});

    var _mainLarge = $('<section>').addClass('pard-grid');
    var _gridSpacing = $('<div>').addClass('grid-spacing');


    var _aside = $('<nav>').addClass('grid-aside');
    var _section = $('<section>').addClass('grid-section');
    var _sectionContainer = $('<div>');

    _offCanvasSection.append(sectionContent(_sectionContainer).render());

    _offCanvasAside.append(asideContent(_sectionContainer).render());

    _aside.append(_offCanvasAside);
    _section.append(_offCanvasSection);
    _offCanvasInner.append(_aside, _gridSpacing, _section);

    _mainLarge.append(_offCanvasWrapper.append(_offCanvasInner));
    _main.append(_mainLarge);

    return {
      render: function(){
        return _main;
      }
    }
  }

  ns.Widgets.Cloudinary = function(folder, thumbnail, _url, maxAmount){

    var _data = [];

    var _photo = $.cloudinary.unsigned_upload_tag(
      "kqtqeksl",
      {
        cloud_name: 'hxgvncv7u',
        folder: folder
      }
    );

    _photo.fileupload({
      multiple: true,
      replaceFileInput: false,
      add: function(e, data) {
        var uploadErrors = [];
        var acceptFileTypes = /^image\/(gif|jpe?g|png)$/i;
        _photo.val(null);

        if (_data.length + _url.length >= maxAmount){
          uploadErrors.push('Only three images allowed');
        }
        if(data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
            uploadErrors.push('Not an accepted file type');
        }
        if(data.originalFiles[0]['size'] > 1000000) {
            uploadErrors.push('Filesize is too big');
        }
        if(uploadErrors.length > 0) {
            alert(uploadErrors.join("\n"));
        } else {
          var reader = new FileReader(); // instance of the FileReader
          reader.readAsDataURL(data.originalFiles[0]); // read the local file

          _data.push(data);
          reader.onloadend = function(){ // set image data as background of div
            var _container = $('<span>');
            var _img = $('<img>').attr('src', this.result).css({'width':'50px', 'height': '50px'}).addClass('photo-form');
            var _icon = $('<span>').addClass('material-icons').html('&#xE888').css({
                position: 'relative',
                bottom: '20px',
                cursor: 'pointer'
            });

            _icon.on('click', function(){
              _data.splice(_data.indexOf(data), 1);
              _container.empty();
            });

            _container.append(_img, _icon);
            thumbnail.append(_container);
          }
        }
      }
    });

    return {
      render: function(){
        return _photo;
      },
      setUrl: function(url){
        _url = url;
      },
      submit: function(){
        _data.forEach(function(photo){
          photo.submit();
        });
      },
      dataLength: function(){
        return _data.length;
      }
    }
  }


}(Pard || {}));
