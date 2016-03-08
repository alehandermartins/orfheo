(function(ns){
  ns.Widgets = ns.Widgets || {};

  ns.Widgets.Button = function(label, callback){

    var _createdWidget = $('<button>').addClass('pard-btn').attr({type:'button'}).html(label);
    if (callback) _createdWidget.click(callback);

    return {
      render: function(){
        return _createdWidget;
      },
      disable: function(){
        _createdWidget.attr('disabled',true);
      },
      enable: function(){
        _createdWidget.attr('disabled',false);
      },
      setClass: function(_class){
        _createdWidget.addClass(_class);
      }
    };
  };



  ns.Widgets.Selector = function(labels, values, callback){
    var _createdWidget = $('<select>');
    values.forEach(function(value, index){
      _createdWidget.append($('<option>').text(labels[index]).val(value));
    });
     _createdWidget.on('change',function(){
      if(callback) {
        var boundCallback = callback.bind(_createdWidget);
        boundCallback();
      };
    });

    return {
      render: function(){
        return _createdWidget;
      },
      getVal: function(){
        return _createdWidget.val();
      },
      setVal: function(value){
        _createdWidget.val(value);
      },
      setClass: function(_class){
        _createdWidget.addClass(_class);
      },
      enable: function(){
        _createdWidget.attr('disabled',false);
      },
      disable: function(){
        _createdWidget.attr('disabled',true);
      }
    }
  }


  ns.Widgets.TextArea = function(label){
    var _createdWidget = $('<div>');
    var _textarea = $('<textarea>').attr({placeholder: label});

    _createdWidget.append(_textarea);

    return {
      render: function(){
        return _createdWidget;
      },
      getVal: function(){
        return _textarea.val();
      },
      setVal: function(value){
        _textarea.val(value);
      }
    }
  }

  ns.Widgets.Input = function(label, type, callback){

    var _input = $('<input>').attr({'type':type, 'placeholder': label});

    _input.on('input',function(){
      if(callback) callback();
    });

    return{
      render: function(){
        return _input;
      },
      getVal: function(){
        return _input.val();
      },
      setVal: function(value){
        _input.val(value);
      },
      addWarning: function(){
        _input.addClass('warning');
      },
      removeWarning: function(){
        _input.removeClass('warning');
      },
      setClass: function(_class){
        _input.addClass(_class);
      }
    }
  };


  ns.Widgets.CheckBox = function(label, value){

    var _input = $('<input />').attr({ type: 'checkbox', 'value': value});
    var _label = $('<label>').html(label);
    var _createdWidget = $('<div>').append(_input,_label);

    return {
      render: function(){
        return _createdWidget;
      },
      getVal: function(){
        return _input.is(":checked");
      },
      setVal: function(_val){
        _input.attr('checked', _val);;
      }
    }
  }

  // ns.Widgets.BootboxAlert = function(label, message){
  //   bootbox.alert({
  //     title: label,
  //     message: message.render(),
  //     callback: function(){
  //       if(message.callback){
  //         if(message.callback() == false) return false;
  //       }
  //     }
  //   });
  // }

// ns.Widgets.MboxCallA = function(a_text, box_content){

//     var _createdWidget =  $('<a>').text(a_text);

//     var _message =  $('<div>').addClass('very-fast reveal small');

//     var _popup = new Foundation.Reveal(_message, {closeOnClick: false, animationIn: 'slide-in-down', animationOut: 'slide-out-up', multipleOpened:true});

//     _createdWidget.on('click', function(){
//       _popup.open();
//     });

//     _message.append(box_content);

//     $('body').append(_message);

//     return {
//       render: function(){
//         return _createdWidget;
//       }
//     }
//   }

  ns.Widgets.MboxCallButton = function(button_label, box_content){

    var _createdWidget =  $('<button>').addClass('pard-btn').attr({type: 'button'}).text(button_label);

    var _message =  $('<div>').addClass('very-fast reveal small');

    _message.append(box_content);

    var _popup = new Foundation.Reveal(_message, {closeOnClick: false, animationIn: 'slide-in-down', animationOut: 'slide-out-up'});

    _createdWidget.on('click', function(){
      _popup.open();
    });

    $('body').append(_message);

    return {
      render: function(){
        return _createdWidget;
      },
      setClass: function(_class){
        _createdWidget.addClass(_class);
      },
    }
  }

  ns.Widgets.MboxContent = function(title, content){

    var _createdWidget = $('<div>');
    var _header = $('<div>').addClass('row');
    var _title = $('<h4>').addClass('small-11 columns').text(title);
    var _closeBtn = $('<button>').addClass('close-button columns').attr({'data-close': '', type: 'button', 'aria-label': 'Close alert'});

    _closeBtn.append($('<span>').attr('aria-hidden', true).html('&times;'));

    _header.append(_title, _closeBtn);

    _createdWidget.append(_header, content);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

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

    $('body').scroll(function(){
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
    $( window ).resize(function() {
      $(elem).removeAttr('style');
    })

  }


  ns.Widgets.IconColor = function(h){

      var cutHex =function (h) {
        return (h.charAt(0)=="#") ? h.substring(1,7):h
      }

      var _red = parseInt((cutHex(h)).substring(0,2),16);
      var _green = parseInt ((cutHex(h)).substring(2,4),16);
      var _blue = parseInt((cutHex(h)).substring(4,6),16);
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



  // ns.Widgets.MboxCloseButton = function(label, callback){

  //   var _createdWidget = $('<button>').addClass('pard-btn').attr({'data-close': '', type: 'button'}).text(label);

  //   _createdWidget.click(function(){
  //     if(callback) callback();
  //   })

  //   return {
  //     render: function(){
  //       return _createdWidget;
  //     },
  //     disable: function(){
  //       _createdWidget.attr('disabled',true);
  //     },
  //     enable: function(){
  //       _createdWidget.attr('disabled',false);
  //     }
  //   };
  // }

  // ns.Widgets.ProfileButton = function(message){
  //   var _createdWidget =  $('<button>').addClass('pard-btn').attr({type: 'button'}).text('Crea un perfil');

  //   var _popup = new Foundation.Reveal(message.render(), {closeOnClick: false, animationIn: 'slide-in-down', animationOut: 'slide-out-up'});

  //   _createdWidget.on('click', function(){
  //     _popup.open();
  //   });

  //   message.setCallback(_popup.close());

  //   return {
  //     render: function(){
  //       return _createdWidget;
  //     },
  //     setClass: function(_class){
  //       _createdWidget.addClass(_class);
  //     }
  //   }
  // }

  // ns.Widgets.ProfileMessage = function(content, callback){

  //   var _message = $('<div>').addClass('very-fast reveal small');
  //   var _submitBtn = $('<button>').addClass('pard-btn').attr({type: 'button'}).text('btn');
  //   var _messageContent = content(_submitBtn);

  //   _message.append(_messageContent.render());

  //   $('body').append(_message);

  //   return {
  //     render: function(){
  //       return _message;
  //     },
  //     setCallback: function(popupclose){
  //       _submitBtn.on('click',function(){
  //         if(_messageContent.filled() == true) {
  //           callback(_messageContent.getVal(), Pard.Events.CreateProfile);
  //           popupclose();
  //         }
  //         else{console.log('No')}
  //       });
  //     }
  //   }
  // }


  //   ns.Widgets.CreateProfilePopup = function(){
  //   var _createdWidget =  $('<button>').addClass('pard-btn').attr({type: 'button'}).text('Crea un perfil');

  //   var _message = $('<div>').addClass('very-fast reveal small');

  //   var _popup = new Foundation.Reveal(_message, {closeOnClick: false, animationIn: 'slide-in-down', animationOut: 'slide-out-up'});

  //   var _submitBtn = $('<button>').addClass('pard-btn').attr({type: 'button'}).text('crea');


  //   var _content = $('<div>');
  //   var _btnContainer = $('<div>');
  //   console.log(_btnContainer.html()=='');
  //   var _invalidInput = $('<div>');
  //   var _fields = {};

  //   var _profileForm = Pard.Widgets.ProfileForm();

    // _submitBtn.on('click',function(){
    //     console.log('clicked')
    //     if(_profileForm.filled() == true){
    //       Pard.Backend.createProfile(_profileForm.getVal(), Pard.Events.CreateProfile);
    //       _popup.close();
    //     }
    //     else{console.log('No')}
    //   });

  //   _artistButton = Pard.Widgets.Button('Artista', function(){
  //     _content.empty();
  //     _content.append(_profileForm.getForm('artist'));
  //     if (_btnContainer.html() == '') _btnContainer.append(_submitBtn);
  //   });

  //   _spaceButton = Pard.Widgets.Button('Espacio', function(){
  //     _content.empty();
  //     _content.append(_profileForm.getForm('space'));
  //     if (_btnContainer.html() == '') _btnContainer.append(_submitBtn);
  //   });


  //   _message.append(_artistButton.render(), _spaceButton.render(), _content, _btnContainer, _invalidInput);

  //   _createdWidget.on('click', function(){
  //     _popup.open();
  //   });

  //   $('body').append(_message);

  //   return {
  //     render: function(){
  //       return _createdWidget;
  //     }
  //   }
  // }






  // ns.Widgets.PopupButton = function(btn_label, message){

  //   var _createdWidget =  $('<button>').addClass('pard-btn').attr({type: 'button'}).text(btn_label);

  //   var _popup = new Foundation.Reveal(message.render(), {closeOnClick: false, animationIn: 'slide-in-down', animationOut: 'slide-out-up'});

  //   _createdWidget.on('click', function(){
  //     _popup.open();
  //   });

  //   message.setCallback(_popup.close());

  //   return {
  //     render: function(){
  //       return _createdWidget;
  //     },
  //     setClass: function(_class){
  //       _createdWidget.addClass(_class);
  //     }
  //   }
  // }

  // ns.Widgets.PopupMessage = function(btn_label, content){

  //   var _message = $('<div>').addClass('very-fast reveal small');
  //   var _submitBtn = $('<button>').addClass('pard-btn').attr({type: 'button'}).html(btn_label);

  //   var _messageContent = content(_submitBtn);

  //   _message.append(_messageContent.render());

  //   // _message.append(content.render(), _submitBtn);

  //   $('body').append(_message);

  //   return {
  //     render: function(){
  //       return _message;
  //     },
  //     setCallback: function(callback){
  //       _messageContent.setCallback(callback);
  //     }
  //   }
  // }


}(Pard || {}));
