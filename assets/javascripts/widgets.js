(function(ns){
  ns.Widgets = ns.Widgets || {};

  ns.Widgets.Button = function(label, callback){

    var _createdWidget = $('<button>').attr({type:'button'}).text(label).click(callback);

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
      if(callback) callback();
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
    
    var _createdWidget = $('<div>');
    var _button =  $('<a>').text(a_text);
    
    var _message =  $('<div>').addClass('very_fast reveal');

    var _popup = new Foundation.Reveal(_message);

    _button.on('click', function(){
      _popup.open();
    });

    _message.append(box_content);

    _createdWidget.append(_button, _message);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.MboxCallButton = function(button_label, box_content){
    
    var _createdWidget = $('<div>');
    var _button =  $('<button>').addClass('button').attr({type: 'button'}).text(button_label);
    
    var _message =  $('<div>').addClass('very_fast reveal');

    var _popup = new Foundation.Reveal(_message, {closeOnClick: false, animationIn: 'slide-in-down', animationOut: 'slide-out-up'});

    _button.on('click', function(){
      _popup.open();
    });

    _message.append(box_content);

    _createdWidget.append(_button, _message);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.MboxContent = function(title, content){

    var _createdWidget = $('<div>');
    var _header = $('<div>').addClass('row');
    var _title = $('<h3>').addClass('small-11 columns').text(title);
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



  ns.Widgets.MboxCloseButton = function(label, callback){

    var _createdWidget = $('<button>').addClass('button').attr({'data-close': '', type: 'button'}).text(label).click(callback);

    return {
      render: function(){
        return _createdWidget;
      },
      disable: function(){
        _createdWidget.attr('disabled',true);
      },
      enable: function(){
        _createdWidget.attr('disabled',false);
      }
    };
  }


 
}(Pard || {}));
