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
      }
    };
  };

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

}(Pard || {}));
