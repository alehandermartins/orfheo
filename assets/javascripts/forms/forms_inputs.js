'use strict';


(function(ns){
  ns.Widgets = ns.Widgets || {};

   ns.Widgets.Input = function(label, type, oninputcallback, onchangecallback){

    var _input = $('<input>').attr({'type':type, 'placeholder': label});

    _input.on('input',function(){
      _input.removeClass('warning');
      if(oninputcallback) oninputcallback();
    });
    _input.on('change', function(){
      if(onchangecallback) onchangecallback();
    });

    _input.on('focus', function(){
      if($(window).width()<1024){
        if ($('.reveal[aria-hidden="false"]').html()){
          var _distanceInputTop = _input.offset().top;
          var _popupOpened = _input.closest('.reveal[aria-hidden="false"]');
          var _scroolTop = _popupOpened.scrollTop();
          var _distanceToDo = _distanceInputTop + _scroolTop - 120; 
          _popupOpened.scrollTop(_distanceToDo);
        }
      }
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
      },
      setAttr: function(attribute, value){
        _input.attr(attribute,value);
      },
      disable: function(){
        _input.prop('disabled', true);
      }
    }
  };

  ns.Widgets.InputLabel = function(label){

    var _label = $('<label>').text(label);

    return{
      render: function(){
        return _label;
      },
      setClass: function(_class){
        _label.addClass(_class);
      }
    }
  };

  ns.Widgets.HelpText = function(label){

    var _helptext = $('<p>').addClass('help-text').html(label);

    return{
      render: function(){
        return _helptext;
      },
      setClass: function(_class){
        _helptext.addClass(_class);
      }
    }
  };


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
      _createdWidget.append($('<option>').append(labels[index]).val(value));
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
      addWarning: function(){
        _createdWidget.addClass('warning');
      },
      removeWarning: function(){
        _createdWidget.removeClass('warning');
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

  ns.Widgets.MultipleSelector = function(values, callback){

    var _createdWidget = $('<select>').attr("multiple", "multiple");
    values.forEach(function(value){
      _createdWidget.append($('<option>').text(value).val(value));
    });
    
    _createdWidget.on('change',function(){
        _createdWidget.next().find('.ms-choice').removeClass('warning');
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
      setVal: function(values){
        _createdWidget.multipleSelect("setSelects", values);
      },
      addWarning: function(){
        _createdWidget.next().find('.ms-choice').addClass('warning');
      },
      removeWarning: function(){
        _createdWidget.next().find('.ms-choice').removeClass('warning');
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


  ns.Widgets.MultipleDaysSelector = function(millisecValues, callback){
    var _createdWidget = $('<select>').attr("multiple", "multiple");
    var _arrayDays = [];
    millisecValues.forEach(function(value){
      var _newDate = new Date(parseInt(value));
      var _day = moment(_newDate).locale('es').format('dddd DD/MM/YYYY');
      _createdWidget.append($('<option>').text(_day).val(value));
      _arrayDays.push(moment(_newDate).locale('es').format('YYYY-MM-DD'));
    });
    
    _createdWidget.on('change',function(){
        _createdWidget.next().find('.ms-choice').removeClass('warning');
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
        if(_createdWidget.val()) {
          var _daysArray = [];
          _createdWidget.val().forEach(function(val){
            _daysArray.push(moment(new Date(parseInt(val))).locale('es').format('YYYY-MM-DD'));
          });
          return _daysArray;
        }
        else{
          return false;
        }
      },
      setVal: function(values){
        var _values = [];
        values.forEach(function(value){
          var _index = _arrayDays.indexOf(value);
          if (_index>-1) _values.push(millisecValues[_index]);
        });
        _createdWidget.multipleSelect("setSelects", _values);
      },
      addWarning: function(){
        _createdWidget.next().find('.ms-choice').addClass('warning');
      },
      removeWarning: function(){
        _createdWidget.next().find('.ms-choice').removeClass('warning');
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


  ns.Widgets.TextArea = function(label, Nrows){

    var _textarea = $('<textarea>').attr({placeholder: label})
    if (Nrows)_textarea.attr({'rows': parseInt(Nrows)});

    _textarea.on('input',function(){_textarea.removeClass('warning')});

    _textarea.on('focus', function(){
      if($(window).width()<1024){
        if ($('.reveal[aria-hidden="false"]').html()){
          var _distanceInputTop = _textarea.offset().top;
          var _popupOpened = _textarea.closest('.reveal[aria-hidden="false"]');
          var _scroolTop = _popupOpened.scrollTop();
          var _distanceToDo = _distanceInputTop + _scroolTop - 120; 
          _popupOpened.scrollTop(_distanceToDo);
          // var _scroolTop = $('.reveal[aria-hidden="false"]').scrollTop();
          // var _distanceToDo = _distanceInputTop + _scroolTop - 120; 
          // $('.reveal[aria-hidden="false"]').scrollTop(_distanceToDo);
        }
      }
    });

    return {
      render: function(){
        return _textarea;
      },
      getVal: function(){
        return _textarea.val();
      },
      setVal: function(value){
        _textarea.val(value);
      },
      addWarning: function(){
        _textarea.addClass('warning');
      },
      removeWarning: function(){
        _textarea.removeClass('warning');
      },
      setClass: function(_class){
        _textarea.addClass(_class);
      }, 
      setAttr: function(attribute, value){
        _textarea.attr(attribute,value);
      }
    }
  }


  ns.Widgets.TextAreaCounter = function(label, max, message){
    var _createdWidget = $('<div>');
    var _textarea = $('<textarea>').attr({placeholder: label, maxlength:80, rows: 1}).addClass('short_description-input');
    var _remainingCar = $('<span>').text(80).css({display: 'inline', 'font-weight':600});
    var _counter = $('<p>').append(message, _remainingCar,'.').addClass('help-text');
    _textarea.on('input',(function(){
    	_textarea.removeClass('warning');
    	_remainingCar.text(max - _textarea.val().length);
    }));

    _createdWidget.append(_textarea, _counter);

    return {
      render: function(){
        return _createdWidget;
      },
      getVal: function(){
      	return _textarea.val();
      },
      setVal: function(value){
        _textarea.val(value);
      }, 
      setAttr: function(attribute, value){
        _textarea.attr(attribute,value);
      }, 
      setClass: function(_class){
        _textarea.addClass(_class);
      },
      addWarning: function(){
        _textarea.addClass('warning');
      },
      removeWarning: function(){
        _textarea.removeClass('warning');
      },
    }
  }


  ns.Widgets.TextAreaEnriched = function(label, Nrows){
    console.log('TextAreaEnriched')
    var _createdWidget = $('<div>');
    var _textarea = $('<textarea>').attr({placeholder: label})
    if (Nrows)_textarea.attr({'rows': parseInt(Nrows)});

    _textarea.on('focus', function(){
      if($(window).width()<1024){
        if ($('.reveal[aria-hidden="false"]').html()){
          var _distanceInputTop = _textarea.offset().top;
          var _popupOpened = _textarea.closest('.reveal[aria-hidden="false"]');
          var _scroolTop = _popupOpened.scrollTop();
          var _distanceToDo = _distanceInputTop + _scroolTop - 120; 
          _popupOpened.scrollTop(_distanceToDo);
          // var _scroolTop = $('.reveal[aria-hidden="false"]').scrollTop();
          // var _distanceToDo = _distanceInputTop + _scroolTop - 120; 
          // $('.reveal[aria-hidden="false"]').scrollTop(_distanceToDo);
        }
      }
    });

    _createdWidget.append(_textarea).addClass('TextAreaEnrichedContainer');
    // _createdWidget.on('focus', function(){
    //   if (_textarea.trumbowyg('html')) _createdWidget.removeClass('warning');
    // });

    $.trumbowyg.svgPath = 'icons.svg';

    _textarea.trumbowyg({
      btns: [
        // ['viewHTML'],
        // ['formatting'],
         ['strong', 'em'],
        // ['superscript', 'subscript'],
        ['link'],
        // ['insertImage'],
        // 'btnGrp-justify',
        'btnGrp-lists',
        // ['horizontalRule'],
        // ['removeformat'],
        // ['fullscreen']
      ],
      autogrow: true
    });

    _textarea.on('tbwchange', function(){
      _createdWidget.removeClass('warning');
    });

    return {
      render: function(){
        return _createdWidget;
      },
      getVal: function(){
        return _textarea.trumbowyg('html');
      },
      setVal: function(value){
        console.log(value)
        _textarea.trumbowyg('html', value);
      },
      addWarning: function(){
        _createdWidget.addClass('warning');
      },
      removeWarning: function(){
        _createdWidget.removeClass('warning');
      },
      setClass: function(_class){
        _textarea.addClass(_class);
      }, 
      setAttr: function(attribute, value){
        _textarea.attr(attribute,value);
      }
    }
  }

 

  ns.Widgets.CheckBox = function(label, value){

    var _input = $('<input>').attr({ type: 'checkbox', 'value': value});
    var _label = $('<label>').html(label);
    _label.css('display','inline');
    var _createdWidget = $('<div>').append(_input,_label);

    _input.on('change', function(){(_input.removeClass('checkBox-warning'))});

    return {
      render: function(){
        return _createdWidget;
      },
      getVal: function(){
        return _input.is(":checked");
      },
      setVal: function(_val){
        if (_val && _val != 'false'){ _input.attr('checked', _val)};
        if (_val === false){_input.attr('checked', false)};     
      },
      addWarning: function(){
        _input.addClass('checkBox-warning');
      },
      removeWarning: function(){
        _input.removeClass('checkBox-warning');
      },
      labelToggle: function(){
        _label.css('cursor','pointer')
        _label.on('click', function(){
          _input.prop("checked", !_input.prop("checked"));
        });
      } 
    }
  }

  
}(Pard || {}));
