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


  ns.Widgets.PopupCreator = function(caller, title, message, contentClass, callback){

    var _content = $('<div>').addClass('very-fast reveal full');

    var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});

    var _popupCaller = caller;


    _popupCaller.one('click', function(){
      $('body').append(_content);
    });

    _popupCaller.on('click', function(){
      _content.empty();
      var _message = Pard.Widgets.PopupContent(title, message(), contentClass);
      _message.setCallback(function(){
        if (callback) callback();
        _popup.close();
      });
      _content.append(_message.render());
      _popup.open();
    });

    return {
      render: function(){
        return _popupCaller;
      }
    }
  }

  ns.Widgets.PopupForm = function(caller, title, form){

    var _content = $('<div>').addClass('very-fast reveal full');

    var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});

    var _popupCaller = caller;

    _popupCaller.one('click', function(){
      $('body').append(_content);
    });

    _popupCaller.on('click', function(){
      Pard.Backend.getForm(form, function(data){
        var message = {
          'create_artist': Pard.Widgets.ArtistForm,
          'create_space': Pard.Widgets.SpaceForm,
          'create_organization': Pard.Widgets.OrganizationForm
        }
        _content.empty();
        var _message = Pard.Widgets.PopupContent(title, message[form](data.form));
        _message.setCallback(function(){_popup.close()});
        _content.append(_message.render());
        _popup.open();
      });
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

    var _callback = {};

    _closeBtn.click(function(){
      _callback();
    });

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
        _callback = callback;
      }
    }
  }


  ns.Widgets.Sticker = function (elem, distanceFromHeader, stickyDistanceTop) {


    var _diffI = 1;
    var _distanceFromHeader = distanceFromHeader*(-1);
    var _mainCol = '';

    $(document).ready(function(){
    $('.whole-container').scroll(function(){
      // if ($(window).width() > 1024) {
        var _windowTop = $(elem).offset().top;
        var _headerTop = $('header').offset().top;
        var _fixedPosition = stickyDistanceTop;

        var _distanceFromWindow = _windowTop -_fixedPosition;
        // if (notLogged){
        //   if (_distanceFromWindow*_diffI<0){
        //     $(elem).css({position: 'fixed', 'top':'0', 'padding-top':stickyDistanceTop+'px', 'background': _mainCol[0]});
        //     _diffI = -1;
        //   }
        //   if (_headerTop>_distanceFromHeader){
        //       $(elem).css({'position':'', 'top':'', 'padding-top':'', background:''});
        //       _diffI = +1;
        //   }
        // }
        // else{
          if (_distanceFromWindow*_diffI<0)   {
            $(elem).css({position: 'fixed', 'top':stickyDistanceTop+'px'});
            _diffI = -1;
          }
          if (_headerTop>_distanceFromHeader){
              $(elem).css({'position':'', 'top':''});
              _diffI = +1;
          }
        // }
      // }
    });
  })
    // $( window ).resize(function() {
    //   $(elem).removeAttr('style');
    // })

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
      },
      rgba: function(_a){
        var _ra =  parseInt((1 - _a) * _rgb[0] + _a * 255);
        var _ga =  parseInt((1 - _a) * _rgb[1] + _a * 255);
        var _ba =  parseInt((1 - _a) * _rgb[2] + _a * 255);
        return [_ra, _ga, _ba];
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
          if(maxAmount == 4){ 
            Pard.Widgets.Alert('','Máximo cuatro imagenes.');
            uploadErrors.push('cuatro img');
          }
          if(maxAmount == 1) {
            Pard.Widgets.Alert('', 'Máximo una imagen.');
            uploadErrors.push('una img');
          }
        }
        if(data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
          Pard.Widgets.Alert('', 'Formatos aceptados: .gif, .jpeg, .jpg, .png');
          uploadErrors.push('no accepted');
        }
        if(data.originalFiles[0]['size'] > 500000) {
          Pard.Widgets.Alert('', 'El tamaño de las imágenes no puede ser superior a 500Kb. Puedes reducirlo en un momento utilizando, entre muchas otras,  <a href = "http://optimizilla.com/es/"  target="_blank">esta web</a>.');
          uploadErrors.push('tamaño max');
        }
        if(uploadErrors.length == 0){
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

    var _fakeButton = $('<button>').addClass('browse-btn').attr({type:'button'}).html('Sube una imagen');
    _fakeButton.on('click', function(){
      _photo.click();
    });

    // _fakeButton.css('margin-bottom', '15px');

    return {
      render: function(){
        return _fakeButton;
      },
      cloudinary: function(){
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

  ns.Widgets.FitInBox = function(textBox, max_width, max_height){
    var _container = $('<div>').css({
      'max-width': max_width+'px',
      'word-wrap': 'break-word'
    });

    textBox.css({
      'font-weight': 'bold'
    });

    $('body').append(_container.append((textBox)));
    var height = textBox.height();
    if ( parseInt(textBox.css('line-height')) < max_height){
      while (height > max_height){
        var _text = textBox.text();
        var _positionLastWord = _text.lastIndexOf(" ");
        _text = _text.substring(0, _positionLastWord);
        textBox.text(_text + '...');
        // if (textBox.height() == height){console.log('bb'); break; }
        height = textBox.height();
      }
    }

    textBox.removeAttr('style','font-weight');

    return{
      render: function(){
        return textBox;
      }
    }
  }

  
  ns.Widgets.CutString = function(string, numMaxCaracters){
    var _catString = string;

    if(string.length > numMaxCaracters) _catString = string.substr(0,numMaxCaracters -4)+'...';

    return _catString
  }


  ns.Widgets.ArtisticCategorySelect2 = function(){
    var _createdWidget = $('<div>').addClass('category-input');
    var _selector = $('<select>');

    var _searchTags = [];
    var _valuesCategories = ['music', 'arts', 'expo', 'poetry', 'audiovisual', 'street_art', 'workshop', 'other'];

    _valuesCategories.forEach(function(cat){
      _searchTags.push({id:cat, text:Pard.Widgets.Dictionary(cat).render()});
    });


    function formatResource (resource) {
      var _label = $('<span>').text(resource.text);
        var _icon = Pard.Widgets.IconManager(resource.id).render();
        _label.append(_icon);
        _icon.css({
          // position: 'relative',
          'margin-left': '0.5rem',
          'vertical-align':'middle'
          // top: '5px'
        });
      return _label;
    };

    _createdWidget.append(_selector);
    _selector.select2({
      data: _searchTags,
      templateResult: formatResource
      ,minimumResultsForSearch: Infinity
      ,templateSelection: formatResource
    });


    return {
      render: function(){
        return _createdWidget;
      },
      getData: function(){
        return _selector.select2('data');
      },
      setCallback: function(callback){
        _selector.on('select2:select', function(){callback()});
      }
    }
  }

  ns.Widgets.ArtisticCategoryFoundationSelector = function(categorySelectCallback){

    var _valuesCategories = ['music', 'arts', 'expo', 'poetry', 'audiovisual', 'street_art', 'workshop', 'other'];
    var _labelsCategories = [];

    _valuesCategories.forEach(function(cat){
      _labelsCategories.push(Pard.Widgets.Dictionary(cat).render());
    });

    var _createdWidget = Pard.Widgets.Selector(_labelsCategories, _valuesCategories, categorySelectCallback);

    _createdWidget.setClass('category-input');

    return {
      render: function(){
        return _createdWidget.render();
      }
    }
  }



}(Pard || {}));
