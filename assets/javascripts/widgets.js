(function(ns){
  ns.Widgets = ns.Widgets || {};

  ns.Widgets.Button = function(label, callback){

    var _createdWidget = $('<button>').addClass('pard-btn').attr({type:'button'}).html(label).click(callback);

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

  ns.Widgets.BootboxAlert = function(label, message){
    bootbox.alert({
      title: label,
      message: message.render(),
      callback: function(){
        if(message.callback){
          if(message.callback() == false) return false;
        }
      }
    });
  }



ns.Widgets.MboxCallA = function(a_text, box_content){
    
    var _createdWidget =  $('<a>').text(a_text);
    
    var _message =  $('<div>').addClass('very-fast reveal small');

    var _popup = new Foundation.Reveal(_message, {closeOnClick: false, animationIn: 'slide-in-down', animationOut: 'slide-out-up', multipleOpened:true});

    _createdWidget.on('click', function(){
      _popup.open();
    });

    _message.append(box_content);

    $('body').append(_message);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

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

  



  ns.Widgets.PopupButton = function(btn_label, message){

    var _createdWidget =  $('<button>').addClass('pard-btn').attr({type: 'button'}).text(btn_label);   

    var _popup = new Foundation.Reveal(message.render(), {closeOnClick: false, animationIn: 'slide-in-down', animationOut: 'slide-out-up'});

    _createdWidget.on('click', function(){
      _popup.open();
    });

    message.setCallback(_popup.close());

    return {
      render: function(){
        return _createdWidget;
      },
      setClass: function(_class){
        _createdWidget.addClass(_class);
      }
    }
  }

  ns.Widgets.PopupMessage = function(btn_label, content){

    var _message = $('<div>').addClass('very-fast reveal small');
    var _submitBtn = $('<button>').addClass('pard-btn').attr({type: 'button'}).html(btn_label);

    var _messageContent = content(_submitBtn);
    
    _message.append(_messageContent.render());

    // _message.append(content.render(), _submitBtn);

    $('body').append(_message);

    return {
      render: function(){
        return _message;
      },
      setCallback: function(callback){
        _messageContent.setCallback(callback);
      }
    }
  }

  ns.Widgets.Popup = function(btnCall_label, submitBtn_label, content){

    var _createdWidget =  $('<button>').addClass('pard-btn').attr({type: 'button'}).html(btnCall_label); 
    var _message = $('<div>').addClass('very-fast reveal small');
    var _submitBtn = $('<button>').addClass('pard-btn').attr({type: 'button'}).html(submitBtn_label);

    var _popup = new Foundation.Reveal(_message, {closeOnClick: false, animationIn: 'slide-in-down', animationOut: 'slide-out-up'});

    _createdWidget.on('click', function(){
      _popup.open();
    });

    var _messageContent = content(_submitBtn);

    _messageContent.setCallback(_popup.close());
    
    _message.append(_messageContent.render());

    $('body').append(_message);

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _messageContent.setCallback(callback);
      }
    }

  }





 
}(Pard || {}));
