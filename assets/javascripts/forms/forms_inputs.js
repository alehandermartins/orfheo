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

    if ($('#trumbowyg-icons').html()){}
    else{
    $('body').append($('<div>').css('display','none').attr('id','trumbowyg-icons')
      .append('<svg xmlns="http://www.w3.org/2000/svg"><symbol id="trumbowyg-blockquote" viewBox="0 0 72 72"><path d="M21.3 31.9h-.6c.8-1.2 1.9-2.2 3.4-3.2 2.1-1.4 5-2.7 9.2-3.3l-1.4-8.9c-4.7.7-8.5 2.1-11.7 4-2.4 1.4-4.3 3.1-5.8 4.9-2.3 2.7-3.7 5.7-4.5 8.5-.8 2.8-1 5.4-1 7.5 0 2.3.3 4 .4 4.8 0 .1.1.3.1.4 1.2 5.4 6.1 9.5 11.9 9.5 6.7 0 12.2-5.4 12.2-12.2s-5.5-12-12.2-12zM49.5 31.9h-.6c.8-1.2 1.9-2.2 3.4-3.2 2.1-1.4 5-2.7 9.2-3.3l-1.4-8.9c-4.7.7-8.5 2.1-11.7 4-2.4 1.4-4.3 3.1-5.8 4.9-2.3 2.7-3.7 5.7-4.5 8.5-.8 2.8-1 5.4-1 7.5 0 2.3.3 4 .4 4.8 0 .1.1.3.1.4 1.2 5.4 6.1 9.5 11.9 9.5 6.7 0 12.2-5.4 12.2-12.2s-5.5-12-12.2-12z"/></symbol><symbol id="trumbowyg-bold" viewBox="0 0 72 72"><path d="M51.1 37.8c-1.1-1.4-2.5-2.5-4.2-3.3 1.2-.8 2.1-1.8 2.8-3 1-1.6 1.5-3.5 1.5-5.3 0-2-.6-4-1.7-5.8-1.1-1.8-2.8-3.2-4.8-4.1-2-.9-4.6-1.3-7.8-1.3h-16v42h16.3c2.6 0 4.8-.2 6.7-.7 1.9-.5 3.4-1.2 4.7-2.1 1.3-1 2.4-2.4 3.2-4.1.9-1.7 1.3-3.6 1.3-5.7.2-2.5-.5-4.7-2-6.6zM40.8 50.2c-.6.1-1.8.2-3.4.2h-9V38.5h8.3c2.5 0 4.4.2 5.6.6 1.2.4 2 1 2.7 2 .6.9 1 2 1 3.3 0 1.1-.2 2.1-.7 2.9-.5.9-1 1.5-1.7 1.9-.8.4-1.7.8-2.8 1zm2.6-20.4c-.5.7-1.3 1.3-2.5 1.6-.8.3-2.5.4-4.8.4h-7.7V21.6h7.1c1.4 0 2.6 0 3.6.1s1.7.2 2.2.4c1 .3 1.7.8 2.2 1.7.5.9.8 1.8.8 3-.1 1.3-.4 2.2-.9 3z"/></symbol><symbol id="trumbowyg-close" viewBox="0 0 72 72"><path d="M57 20.5l-5.4-5.4-15.5 15.5-15.6-15.5-5.4 5.4L30.7 36 15.1 51.5l5.4 5.4 15.6-15.5 15.5 15.5 5.4-5.4L41.5 36z"/></symbol><symbol id="trumbowyg-create-link" viewBox="0 0 72 72"><path d="M31.1 48.9l-6.7 6.7c-.8.8-1.6.9-2.1.9s-1.4-.1-2.1-.9L15 50.4c-1.1-1.1-1.1-3.1 0-4.2l6.1-6.1.2-.2 6.5-6.5c-1.2-.6-2.5-.9-3.8-.9-2.3 0-4.6.9-6.3 2.6L11 41.8c-3.5 3.5-3.5 9.2 0 12.7l5.2 5.2c1.7 1.7 4 2.6 6.3 2.6s4.6-.9 6.3-2.6l6.7-6.7c2.5-2.6 3.1-6.7 1.5-10l-5.9 5.9zM38.7 22.5l6.7-6.7c.8-.8 1.6-.9 2.1-.9s1.4.1 2.1.9l5.2 5.2c1.1 1.1 1.1 3.1 0 4.2l-6.1 6.1-.2.2L42 38c1.2.6 2.5.9 3.8.9 2.3 0 4.6-.9 6.3-2.6l6.7-6.7c3.5-3.5 3.5-9.2 0-12.7l-5.2-5.2c-1.7-1.7-4-2.6-6.3-2.6s-4.6.9-6.3 2.6l-6.7 6.7c-2.7 2.7-3.3 6.9-1.7 10.2l6.1-6.1c0 .1 0 .1 0 0z"/><path d="M44.2 30.5c.2-.2.4-.6.4-.9 0-.3-.1-.6-.4-.9l-2.3-2.3c-.3-.2-.6-.4-.9-.4-.3 0-.6.1-.9.4L25.9 40.6c-.2.2-.4.6-.4.9 0 .3.1.6.4.9l2.3 2.3c.2.2.6.4.9.4.3 0 .6-.1.9-.4l14.2-14.2zM49.9 55.4h-8.5v-5h8.5v-8.9h5.2v8.9h8.5v5h-8.5v8.9h-5.2v-8.9z"/></symbol><symbol id="trumbowyg-del" viewBox="0 0 72 72"><path d="M45.8 45c0 1-.3 1.9-.9 2.8-.6.9-1.6 1.6-3 2.1s-3.1.8-5 .8c-2.1 0-4-.4-5.7-1.1-1.7-.7-2.9-1.7-3.6-2.7-.8-1.1-1.3-2.6-1.5-4.5l-.1-.8-6.7.6v.9c.1 2.8.9 5.4 2.3 7.6 1.5 2.3 3.5 4 6.1 5.1 2.6 1.1 5.7 1.6 9.4 1.6 2.9 0 5.6-.5 8-1.6 2.4-1.1 4.3-2.7 5.6-4.7 1.3-2 2-4.2 2-6.5 0-1.6-.3-3.1-.9-4.5l-.2-.6H44c0 .1 1.8 2.3 1.8 5.5zM29 28.9c-.8-.8-1.2-1.7-1.2-2.9 0-.7.1-1.3.4-1.9.3-.6.7-1.1 1.4-1.6.6-.5 1.4-.9 2.5-1.1 1.1-.3 2.4-.4 3.9-.4 2.9 0 5 .6 6.3 1.7 1.3 1.1 2.1 2.7 2.4 5.1l.1.9 6.8-.5v-.9c-.1-2.5-.8-4.7-2.1-6.7s-3.2-3.5-5.6-4.5c-2.4-1-5.1-1.5-8.1-1.5-2.8 0-5.3.5-7.6 1.4-2.3 1-4.2 2.4-5.4 4.3-1.2 1.9-1.9 3.9-1.9 6.1 0 1.7.4 3.4 1.2 4.9l.3.5h11.8c-2.3-.9-3.9-1.7-5.2-2.9zm13.3-6.2zM22.7 20.3zM13 34.1h46.1v3.4H13z"/></symbol><symbol id="trumbowyg-em" viewBox="0 0 72 72"><path d="M26 57l10.1-42h7.2L33.2 57H26z"/></symbol><symbol id="trumbowyg-fullscreen" viewBox="0 0 72 72"><path d="M25.2 7.1H7.1v17.7l6.7-6.5 10.5 10.5 4.5-4.5-10.4-10.5zM47.2 7.1l6.5 6.7-10.5 10.5 4.5 4.5 10.5-10.4 6.7 6.8V7.1zM47.7 43.2l-4.5 4.5 10.4 10.5-6.8 6.7h18.1V47.2l-6.7 6.5zM24.3 43.2L13.8 53.6l-6.7-6.8v18.1h17.7l-6.5-6.7 10.5-10.5z"/><path fill="currentColor" d="M10.7 28.8h18.1V11.2l-6.6 6.4L11.6 7.1l-4.5 4.5 10.5 10.5zM60.8 28.8l-6.4-6.6 10.5-10.6-4.5-4.5-10.5 10.5-6.7-6.9v18.1zM60.4 64.9l4.5-4.5-10.5-10.5 6.9-6.7H43.2v17.6l6.6-6.4zM11.6 64.9l10.5-10.5 6.7 6.9V43.2H11.1l6.5 6.6L7.1 60.4z"/></symbol><symbol id="trumbowyg-h1" viewBox="0 0 72 72"><path d="M6.4 14.9h7.4v16.7h19.1V14.9h7.4V57h-7.4V38H13.8v19H6.4V14.9zM47.8 22.5c1.4 0 2.8-.1 4.1-.4 1.3-.2 2.5-.6 3.6-1.2 1.1-.5 2-1.3 2.8-2.1.8-.9 1.3-1.9 1.5-3.2h5.5v41.2h-7.4v-29H47.8v-5.3z"/></symbol><symbol id="trumbowyg-h2" viewBox="0 0 72 72"><path d="M1.5 14.9h7.4v16.7H28V14.9h7.4V57H28V38H8.8v19H1.5V14.9zM70.2 56.9H42c0-3.4.9-6.4 2.5-9s3.8-4.8 6.6-6.7c1.3-1 2.7-1.9 4.2-2.9 1.5-.9 2.8-1.9 4-3 1.2-1.1 2.2-2.2 3-3.4.8-1.2 1.2-2.7 1.2-4.3 0-.7-.1-1.5-.3-2.4s-.5-1.6-1-2.4c-.5-.7-1.2-1.3-2.1-1.8-.9-.5-2.1-.7-3.5-.7-1.3 0-2.4.3-3.3.8s-1.6 1.3-2.1 2.2-.9 2-1.2 3.3c-.3 1.3-.4 2.6-.4 4.1h-6.7c0-2.3.3-4.4.9-6.3.6-1.9 1.5-3.6 2.7-5 1.2-1.4 2.7-2.5 4.4-3.3 1.7-.8 3.8-1.2 6.1-1.2 2.5 0 4.6.4 6.3 1.2 1.7.8 3.1 1.9 4.1 3.1 1 1.3 1.8 2.6 2.2 4.1.4 1.5.6 2.9.6 4.2 0 1.6-.3 3.1-.8 4.5-.5 1.3-1.2 2.6-2.1 3.7-.9 1.1-1.8 2.2-2.9 3.1-1.1.9-2.2 1.8-3.4 2.7-1.2.8-2.4 1.6-3.5 2.4-1.2.7-2.3 1.5-3.3 2.2-1 .7-1.9 1.5-2.6 2.3-.7.8-1.3 1.7-1.5 2.6h20.1v5.9z"/></symbol><symbol id="trumbowyg-h3" viewBox="0 0 72 72"><path d="M1.4 14.5h7.4v16.7h19.1V14.5h7.4v42.1h-7.4v-19H8.8v19H1.4V14.5zM53.1 32.4c1.1 0 2.2 0 3.3-.2 1.1-.2 2.1-.5 2.9-1 .9-.5 1.6-1.2 2.1-2 .5-.9.8-1.9.8-3.2 0-1.8-.6-3.2-1.8-4.2-1.2-1.1-2.7-1.6-4.6-1.6-1.2 0-2.2.2-3.1.7-.9.5-1.6 1.1-2.2 1.9-.6.8-1 1.7-1.3 2.7-.3 1-.4 2-.4 3.1h-6.7c.1-2 .5-3.9 1.1-5.6.7-1.7 1.6-3.2 2.7-4.4s2.6-2.2 4.2-2.9c1.6-.7 3.5-1.1 5.6-1.1 1.6 0 3.2.2 4.7.7 1.6.5 2.9 1.2 4.2 2.1 1.2.9 2.2 2.1 3 3.4.7 1.4 1.1 3 1.1 4.8 0 2.1-.5 3.9-1.4 5.4-.9 1.6-2.4 2.7-4.4 3.4v.1c2.4.5 4.2 1.6 5.5 3.5 1.3 1.9 2 4.1 2 6.8 0 2-.4 3.7-1.2 5.3-.8 1.6-1.8 2.9-3.2 3.9-1.3 1.1-2.9 1.9-4.7 2.5-1.8.6-3.6.9-5.6.9-2.4 0-4.5-.3-6.3-1s-3.3-1.7-4.5-2.9c-1.2-1.3-2.1-2.8-2.7-4.5-.6-1.8-1-3.7-1-5.9h6.7c-.1 2.5.5 4.6 1.9 6.3 1.3 1.7 3.3 2.5 5.9 2.5 2.2 0 4.1-.6 5.6-1.9 1.5-1.3 2.3-3.1 2.3-5.4 0-1.6-.3-2.9-.9-3.8-.6-.9-1.5-1.7-2.5-2.2-1-.5-2.2-.8-3.4-.9-1.3-.1-2.6-.2-3.9-.1v-5.2z"/></symbol><symbol id="trumbowyg-h4" viewBox="0 0 72 72"><path d="M1.5 14.9h7.4v16.7H28V14.9h7.4V57H28V38H8.9v19H1.5V14.9zM70.5 47.2h-5.3V57h-6.4v-9.8H41.2v-6.7l17.7-24.8h6.4v26.2h5.3v5.3zm-24.2-5.3h12.5V23.7h-.1L46.3 41.9z"/></symbol><symbol id="trumbowyg-horizontal-rule" viewBox="0 0 72 72"><path d="M9.1 32h54v8h-54z"/></symbol><symbol id="trumbowyg-insert-image" viewBox="0 0 72 72"><path d="M64 17v38H8V17h56m8-8H0v54h72V9z"/><path d="M17.5 22C15 22 13 24 13 26.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zM16 50h27L29.5 32zM36 36.2l8.9-8.5L60.2 50H45.9S35.6 35.9 36 36.2z"/></symbol><symbol id="trumbowyg-italic" viewBox="0 0 72 72"><path d="M26 57l10.1-42h7.2L33.2 57H26z"/></symbol><symbol id="trumbowyg-justify-center" viewBox="0 0 72 72"><path d="M9 14h54v8H9zM9 50h54v8H9zM18 32h36v8H18z"/></symbol><symbol id="trumbowyg-justify-full" viewBox="0 0 72 72"><path d="M9 14h54v8H9zM9 50h54v8H9zM9 32h54v8H9z"/></symbol><symbol id="trumbowyg-justify-left" viewBox="0 0 72 72"><path d="M9 14h54v8H9zM9 50h54v8H9zM9 32h36v8H9z"/></symbol><symbol id="trumbowyg-justify-right" viewBox="0 0 72 72"><path d="M9 14h54v8H9zM9 50h54v8H9zM27 32h36v8H27z"/></symbol><symbol id="trumbowyg-link" viewBox="0 0 72 72"><path d="M30.9 49.1l-6.7 6.7c-.8.8-1.6.9-2.1.9s-1.4-.1-2.1-.9l-5.2-5.2c-1.1-1.1-1.1-3.1 0-4.2l6.1-6.1.2-.2 6.5-6.5c-1.2-.6-2.5-.9-3.8-.9-2.3 0-4.6.9-6.3 2.6L10.8 42c-3.5 3.5-3.5 9.2 0 12.7l5.2 5.2c1.7 1.7 4 2.6 6.3 2.6s4.6-.9 6.3-2.6l6.7-6.7C38 50.5 38.6 46.3 37 43l-6.1 6.1zM38.5 22.7l6.7-6.7c.8-.8 1.6-.9 2.1-.9s1.4.1 2.1.9l5.2 5.2c1.1 1.1 1.1 3.1 0 4.2l-6.1 6.1-.2.2-6.5 6.5c1.2.6 2.5.9 3.8.9 2.3 0 4.6-.9 6.3-2.6l6.7-6.7c3.5-3.5 3.5-9.2 0-12.7l-5.2-5.2c-1.7-1.7-4-2.6-6.3-2.6s-4.6.9-6.3 2.6l-6.7 6.7c-2.7 2.7-3.3 6.9-1.7 10.2l6.1-6.1z"/><path d="M44.1 30.7c.2-.2.4-.6.4-.9 0-.3-.1-.6-.4-.9l-2.3-2.3c-.2-.2-.6-.4-.9-.4-.3 0-.6.1-.9.4L25.8 40.8c-.2.2-.4.6-.4.9 0 .3.1.6.4.9l2.3 2.3c.2.2.6.4.9.4.3 0 .6-.1.9-.4l14.2-14.2z"/></symbol><symbol id="trumbowyg-ordered-list" viewBox="0 0 72 72"><path d="M27 14h36v8H27zM27 50h36v8H27zM27 32h36v8H27zM11.8 15.8V22h1.8v-7.8h-1.5l-2.1 1 .3 1.3zM12.1 38.5l.7-.6c1.1-1 2.1-2.1 2.1-3.4 0-1.4-1-2.4-2.7-2.4-1.1 0-2 .4-2.6.8l.5 1.3c.4-.3 1-.6 1.7-.6.9 0 1.3.5 1.3 1.1 0 .9-.9 1.8-2.6 3.3l-1 .9V40H15v-1.5h-2.9zM13.3 53.9c1-.4 1.4-1 1.4-1.8 0-1.1-.9-1.9-2.6-1.9-1 0-1.9.3-2.4.6l.4 1.3c.3-.2 1-.5 1.6-.5.8 0 1.2.3 1.2.8 0 .7-.8.9-1.4.9h-.7v1.3h.7c.8 0 1.6.3 1.6 1.1 0 .6-.5 1-1.4 1-.7 0-1.5-.3-1.8-.5l-.4 1.4c.5.3 1.3.6 2.3.6 2 0 3.2-1 3.2-2.4 0-1.1-.8-1.8-1.7-1.9z"/></symbol><symbol id="trumbowyg-p" viewBox="0 0 72 72"><path d="M47.8 15.1H30.1c-4.7 0-8.5 3.7-8.5 8.4s3.7 8.4 8.4 8.4v25h7V19.8h3v37.1h4.1V19.8h3.7v-4.7z"/></symbol><symbol id="trumbowyg-redo" viewBox="0 0 72 72"><path d="M10.8 51.2c0-5.1 2.1-9.7 5.4-13.1 3.3-3.3 8-5.4 13.1-5.4H46v-12L61.3 36 45.9 51.3V39.1H29.3c-3.3 0-6.4 1.3-8.5 3.5-2.2 2.2-3.5 5.2-3.5 8.5h-6.5z"/></symbol><symbol id="trumbowyg-removeformat" viewBox="0 0 72 72"><path d="M58.2 54.6L52 48.5l3.6-3.6 6.1 6.1 6.4-6.4 3.8 3.8-6.4 6.4 6.1 6.1-3.6 3.6-6.1-6.1-6.4 6.4-3.7-3.8 6.4-6.4zM21.7 52.1H50V57H21.7zM18.8 15.2h34.1v6.4H39.5v24.2h-7.4V21.5H18.8v-6.3z"/></symbol><symbol id="trumbowyg-strikethrough" viewBox="0 0 72 72"><path d="M45.8 45c0 1-.3 1.9-.9 2.8-.6.9-1.6 1.6-3 2.1s-3.1.8-5 .8c-2.1 0-4-.4-5.7-1.1-1.7-.7-2.9-1.7-3.6-2.7-.8-1.1-1.3-2.6-1.5-4.5l-.1-.8-6.7.6v.9c.1 2.8.9 5.4 2.3 7.6 1.5 2.3 3.5 4 6.1 5.1 2.6 1.1 5.7 1.6 9.4 1.6 2.9 0 5.6-.5 8-1.6 2.4-1.1 4.3-2.7 5.6-4.7 1.3-2 2-4.2 2-6.5 0-1.6-.3-3.1-.9-4.5l-.2-.6H44c0 .1 1.8 2.3 1.8 5.5zM29 28.9c-.8-.8-1.2-1.7-1.2-2.9 0-.7.1-1.3.4-1.9.3-.6.7-1.1 1.4-1.6.6-.5 1.4-.9 2.5-1.1 1.1-.3 2.4-.4 3.9-.4 2.9 0 5 .6 6.3 1.7 1.3 1.1 2.1 2.7 2.4 5.1l.1.9 6.8-.5v-.9c-.1-2.5-.8-4.7-2.1-6.7s-3.2-3.5-5.6-4.5c-2.4-1-5.1-1.5-8.1-1.5-2.8 0-5.3.5-7.6 1.4-2.3 1-4.2 2.4-5.4 4.3-1.2 1.9-1.9 3.9-1.9 6.1 0 1.7.4 3.4 1.2 4.9l.3.5h11.8c-2.3-.9-3.9-1.7-5.2-2.9zm13.3-6.2zM22.7 20.3zM13 34.1h46.1v3.4H13z"/></symbol><symbol id="trumbowyg-strong" viewBox="0 0 72 72"><path d="M51.1 37.8c-1.1-1.4-2.5-2.5-4.2-3.3 1.2-.8 2.1-1.8 2.8-3 1-1.6 1.5-3.5 1.5-5.3 0-2-.6-4-1.7-5.8-1.1-1.8-2.8-3.2-4.8-4.1-2-.9-4.6-1.3-7.8-1.3h-16v42h16.3c2.6 0 4.8-.2 6.7-.7 1.9-.5 3.4-1.2 4.7-2.1 1.3-1 2.4-2.4 3.2-4.1.9-1.7 1.3-3.6 1.3-5.7.2-2.5-.5-4.7-2-6.6zM40.8 50.2c-.6.1-1.8.2-3.4.2h-9V38.5h8.3c2.5 0 4.4.2 5.6.6 1.2.4 2 1 2.7 2 .6.9 1 2 1 3.3 0 1.1-.2 2.1-.7 2.9-.5.9-1 1.5-1.7 1.9-.8.4-1.7.8-2.8 1zm2.6-20.4c-.5.7-1.3 1.3-2.5 1.6-.8.3-2.5.4-4.8.4h-7.7V21.6h7.1c1.4 0 2.6 0 3.6.1s1.7.2 2.2.4c1 .3 1.7.8 2.2 1.7.5.9.8 1.8.8 3-.1 1.3-.4 2.2-.9 3z"/></symbol><symbol id="trumbowyg-subscript" viewBox="0 0 72 72"><path d="M32 15h7.8L56 57.1h-7.9L44.3 46H27.4l-4 11.1h-7.6L32 15zm-2.5 25.4h12.9L36 22.3h-.2l-6.3 18.1zM58.7 59.9c.6-1.4 2-2.8 4.1-4.4 1.9-1.3 3.1-2.3 3.7-2.9.8-.9 1.3-1.9 1.3-3 0-.9-.2-1.6-.7-2.2-.5-.6-1.2-.9-2.1-.9-1.2 0-2.1.5-2.5 1.4-.3.5-.4 1.4-.5 2.5h-4c.1-1.8.4-3.2 1-4.3 1.1-2.1 3-3.1 5.8-3.1 2.2 0 3.9.6 5.2 1.8 1.3 1.2 1.9 2.8 1.9 4.8 0 1.5-.5 2.9-1.4 4.1-.6.8-1.6 1.7-3 2.6L66 57.7c-1 .7-1.7 1.2-2.1 1.6-.4.3-.7.7-1 1.1H72V64H57.8c0-1.5.3-2.8.9-4.1z"/></symbol><symbol id="trumbowyg-superscript" viewBox="0 0 72 72"><path d="M32 15h7.8L56 57.1h-7.9l-4-11.1H27.4l-4 11.1h-7.6L32 15zm-2.5 25.4h12.9L36 22.3h-.2l-6.3 18.1zM49.6 28.8c.5-1.1 1.6-2.3 3.4-3.6 1.5-1.1 2.5-1.9 3-2.4.7-.7 1-1.6 1-2.4 0-.7-.2-1.3-.6-1.8-.4-.5-1-.7-1.7-.7-1 0-1.7.4-2.1 1.1-.2.4-.3 1.1-.4 2.1H49c.1-1.5.3-2.6.8-3.5.9-1.7 2.5-2.6 4.8-2.6 1.8 0 3.2.5 4.3 1.5 1.1 1 1.6 2.3 1.6 4 0 1.3-.4 2.4-1.1 3.4-.5.7-1.3 1.4-2.4 2.2l-1.3 1c-.8.6-1.4 1-1.7 1.3-.3.3-.6.6-.8.9h7.4v3H48.8c0-1.3.3-2.4.8-3.5z"/></symbol><symbol id="trumbowyg-table" viewBox="0 0 72 72"><path d="M25.686 51.38v-6.347q0-.462-.297-.76-.298-.297-.761-.297H14.04q-.463 0-.761.297-.298.298-.298.76v6.346q0 .463.298.76.298.298.76.298h10.589q.463 0 .76-.298.298-.297.298-.76zm0-12.692v-6.346q0-.463-.297-.76-.298-.298-.761-.298H14.04q-.463 0-.761.298-.298.297-.298.76v6.346q0 .462.298.76.298.297.76.297h10.589q.463 0 .76-.297.298-.298.298-.76zm16.94 12.691v-6.346q0-.462-.297-.76-.298-.297-.761-.297H30.98q-.463 0-.76.297-.299.298-.299.76v6.346q0 .463.298.76.298.298.761.298h10.588q.463 0 .76-.298.299-.297.299-.76zm-16.94-25.383v-6.345q0-.463-.297-.76-.298-.298-.761-.298H14.04q-.463 0-.761.297-.298.298-.298.76v6.346q0 .463.298.76.298.298.76.298h10.589q.463 0 .76-.298.298-.297.298-.76zm16.94 12.692v-6.346q0-.463-.297-.76-.298-.298-.761-.298H30.98q-.463 0-.76.298-.299.297-.299.76v6.346q0 .462.298.76.298.297.761.297h10.588q.463 0 .76-.297.299-.298.299-.76zm16.94 12.691v-6.346q0-.462-.297-.76-.298-.297-.76-.297H47.92q-.463 0-.76.297-.298.298-.298.76v6.346q0 .463.297.76.298.298.761.298h10.588q.463 0 .761-.298.298-.297.298-.76zm-16.94-25.383v-6.345q0-.463-.297-.76-.298-.298-.761-.298H30.98q-.463 0-.76.297-.299.298-.299.76v6.346q0 .463.298.76.298.298.761.298h10.588q.463 0 .76-.298.299-.297.299-.76zm16.94 12.692v-6.346q0-.463-.297-.76-.298-.298-.76-.298H47.92q-.463 0-.76.298-.298.297-.298.76v6.346q0 .462.297.76.298.297.761.297h10.588q.463 0 .761-.297.298-.298.298-.76zm0-12.692v-6.345q0-.463-.297-.76-.298-.298-.76-.298H47.92q-.463 0-.76.297-.298.298-.298.76v6.346q0 .463.297.76.298.298.761.298h10.588q.463 0 .761-.298.298-.297.298-.76zm4.236-10.576v35.96q0 2.18-1.555 3.734-1.555 1.553-3.739 1.553H14.04q-2.184 0-3.739-1.553-1.555-1.553-1.555-3.735V15.42q0-2.181 1.555-3.735 1.555-1.553 3.739-1.553h44.468q2.184 0 3.739 1.553 1.555 1.554 1.555 3.735z"/></symbol><symbol id="trumbowyg-underline" viewBox="0 0 72 72"><path d="M36 35zM15.2 55.9h41.6V59H15.2zM21.1 13.9h6.4v21.2c0 1.2.1 2.5.2 3.7.1 1.3.5 2.4 1 3.4.6 1 1.4 1.8 2.6 2.5 1.1.6 2.7 1 4.8 1 2.1 0 3.7-.3 4.8-1 1.1-.6 2-1.5 2.6-2.5.6-1 .9-2.1 1-3.4.1-1.3.2-2.5.2-3.7V13.9H51v23.3c0 2.3-.4 4.4-1.1 6.1-.7 1.7-1.7 3.2-3 4.4-1.3 1.2-2.9 2-4.7 2.6-1.8.6-3.9.9-6.1.9-2.2 0-4.3-.3-6.1-.9-1.8-.6-3.4-1.5-4.7-2.6-1.3-1.2-2.3-2.6-3-4.4-.7-1.7-1.1-3.8-1.1-6.1V13.9z"/></symbol><symbol id="trumbowyg-undo" viewBox="0 0 72 72"><path d="M61.2 51.2c0-5.1-2.1-9.7-5.4-13.1-3.3-3.3-8-5.4-13.1-5.4H26.1v-12L10.8 36l15.3 15.3V39.1h16.7c3.3 0 6.4 1.3 8.5 3.5 2.2 2.2 3.5 5.2 3.5 8.5h6.4z"/></symbol><symbol id="trumbowyg-unlink" viewBox="0 0 72 72"><path d="M30.9 49.1l-6.7 6.7c-.8.8-1.6.9-2.1.9s-1.4-.1-2.1-.9l-5.2-5.2c-1.1-1.1-1.1-3.1 0-4.2l6.1-6.1.2-.2 6.5-6.5c-1.2-.6-2.5-.9-3.8-.9-2.3 0-4.6.9-6.3 2.6L10.8 42c-3.5 3.5-3.5 9.2 0 12.7l5.2 5.2c1.7 1.7 4 2.6 6.3 2.6s4.6-.9 6.3-2.6l6.7-6.7C38 50.5 38.6 46.3 37 43l-6.1 6.1zM38.5 22.7l6.7-6.7c.8-.8 1.6-.9 2.1-.9s1.4.1 2.1.9l5.2 5.2c1.1 1.1 1.1 3.1 0 4.2l-6.1 6.1-.2.2-6.5 6.5c1.2.6 2.5.9 3.8.9 2.3 0 4.6-.9 6.3-2.6l6.7-6.7c3.5-3.5 3.5-9.2 0-12.7l-5.2-5.2c-1.7-1.7-4-2.6-6.3-2.6s-4.6.9-6.3 2.6l-6.7 6.7c-2.7 2.7-3.3 6.9-1.7 10.2l6.1-6.1z"/><path d="M44.1 30.7c.2-.2.4-.6.4-.9 0-.3-.1-.6-.4-.9l-2.3-2.3c-.2-.2-.6-.4-.9-.4-.3 0-.6.1-.9.4L25.8 40.8c-.2.2-.4.6-.4.9 0 .3.1.6.4.9l2.3 2.3c.2.2.6.4.9.4.3 0 .6-.1.9-.4l14.2-14.2zM41.3 55.8v-5h22.2v5H41.3z"/></symbol><symbol id="trumbowyg-unordered-list" viewBox="0 0 72 72"><path d="M27 14h36v8H27zM27 50h36v8H27zM9 50h9v8H9zM9 32h9v8H9zM9 14h9v8H9zM27 32h36v8H27z"/></symbol><symbol id="trumbowyg-view-html" viewBox="0 0 72 72"><path fill="none" stroke="currentColor" stroke-width="8" stroke-miterlimit="10" d="M26.9 17.9L9 36.2 26.9 54M45 54l17.9-18.3L45 17.9"/></symbol><symbol id="trumbowyg-base64" viewBox="0 0 72 72"><path d="M64 17v38H8V17h56m8-8H0v54h72V9z"/><path d="M29.9 28.9c-.5-.5-1.1-.8-1.8-.8s-1.4.2-1.9.7c-.5.4-.9 1-1.2 1.6-.3.6-.5 1.3-.6 2.1-.1.7-.2 1.4-.2 1.9l.1.1c.6-.8 1.2-1.4 2-1.8.8-.4 1.7-.5 2.7-.5.9 0 1.8.2 2.6.6.8.4 1.6.9 2.2 1.5.6.6 1 1.3 1.2 2.2.3.8.4 1.6.4 2.5 0 1.1-.2 2.1-.5 3-.3.9-.8 1.7-1.5 2.4-.6.7-1.4 1.2-2.3 1.6-.9.4-1.9.6-3 .6-1.6 0-2.8-.3-3.9-.9-1-.6-1.8-1.4-2.5-2.4-.6-1-1-2.1-1.3-3.4-.2-1.3-.4-2.6-.4-3.9 0-1.3.1-2.6.4-3.8.3-1.3.8-2.4 1.4-3.5.7-1 1.5-1.9 2.5-2.5 1-.6 2.3-1 3.8-1 .9 0 1.7.1 2.5.4.8.3 1.4.6 2 1.1.6.5 1.1 1.1 1.4 1.8.4.7.6 1.5.7 2.5h-4c0-1-.3-1.6-.8-2.1zm-3.5 6.8c-.4.2-.8.5-1 .8-.3.4-.5.8-.6 1.2-.1.5-.2 1-.2 1.5s.1.9.2 1.4c.1.5.4.9.6 1.2.3.4.6.7 1 .9.4.2.9.3 1.4.3.5 0 1-.1 1.3-.3.4-.2.7-.5 1-.9.3-.4.5-.8.6-1.2.1-.5.2-.9.2-1.4 0-.5-.1-1-.2-1.4-.1-.5-.3-.9-.6-1.2-.3-.4-.6-.7-1-.9-.4-.2-.9-.3-1.4-.3-.4 0-.9.1-1.3.3zM36.3 41.3v-3.8l9-12.1H49v12.4h2.7v3.5H49v4.8h-4v-4.8h-8.7zM45 30.7l-5.3 7.2h5.4l-.1-7.2z"/></symbol><symbol id="trumbowyg-back-color" viewBox="0 0 72 72"><path d="M36.5 22.3l-6.3 18.1H43l-6.3-18.1z"/><path d="M9 8.9v54.2h54.1V8.9H9zm39.9 48.2L45 46H28.2l-3.9 11.1h-7.6L32.8 15h7.8l16.2 42.1h-7.9z"/></symbol><symbol id="trumbowyg-fore-color" viewBox="0 0 72 72"><path d="M32 15h7.8L56 57.1h-7.9l-4-11.1H27.4l-4 11.1h-7.6L32 15zm-2.5 25.4h12.9L36 22.3h-.2l-6.3 18.1z"/></symbol><symbol id="trumbowyg-emoji" viewBox="0 0 72 72"><path d="M36.05 9C21.09 9 8.949 21.141 8.949 36.101c0 14.96 12.141 27.101 27.101 27.101 14.96 0 27.101-12.141 27.101-27.101S51.01 9 36.05 9zm9.757 15.095c2.651 0 4.418 1.767 4.418 4.418s-1.767 4.418-4.418 4.418-4.418-1.767-4.418-4.418 1.767-4.418 4.418-4.418zm-19.479 0c2.651 0 4.418 1.767 4.418 4.418s-1.767 4.418-4.418 4.418-4.418-1.767-4.418-4.418 1.767-4.418 4.418-4.418zm9.722 30.436c-14.093 0-16.261-13.009-16.261-13.009h32.522S50.143 54.531 36.05 54.531z"/></symbol><symbol id="trumbowyg-insert-audio" viewBox="0 0 8 8"><path d="M3.344 0L2 2H0v4h2l1.344 2H4V0h-.656zM5 1v1c.152 0 .313.026.469.063H5.5c.86.215 1.5.995 1.5 1.938a1.99 1.99 0 0 1-2 2.001v1a2.988 2.988 0 0 0 3-3 2.988 2.988 0 0 0-3-3zm0 2v2l.25-.031C5.683 4.851 6 4.462 6 4c0-.446-.325-.819-.75-.938v-.031h-.031L5 3z"/></symbol><symbol id="trumbowyg-noembed" viewBox="0 0 72 72"><path d="M31.5 33.6V25l11 11-11 11v-8.8z"/><path d="M64 17v38H8V17h56m8-8H0v54h72V9z"/></symbol><symbol id="trumbowyg-preformatted" viewBox="0 0 72 72"><path d="M10.3 33.5c.4 0 .9-.1 1.5-.2s1.2-.3 1.8-.7c.6-.3 1.1-.8 1.5-1.3.4-.5.6-1.3.6-2.1V17.1c0-1.4.3-2.6.8-3.6s1.2-1.9 2-2.5c.8-.7 1.6-1.2 2.5-1.5.9-.3 1.6-.5 2.2-.5h5.3v5.3h-3.2c-.7 0-1.3.1-1.8.4-.4.3-.8.6-1 1-.2.4-.4.9-.4 1.3-.1.5-.1.9-.1 1.4v11.4c0 1.2-.2 2.1-.7 2.9-.5.8-1 1.4-1.7 1.8-.6.4-1.3.8-2 1-.7.2-1.3.3-1.7.4v.1c.5 0 1 .1 1.7.3.7.2 1.3.5 2 .9.6.5 1.2 1.1 1.7 1.9.5.8.7 2 .7 3.4v11.1c0 .4 0 .9.1 1.4.1.5.2.9.4 1.3s.6.7 1 1c.4.3 1 .4 1.8.4h3.2V63h-5.3c-.6 0-1.4-.2-2.2-.5-.9-.3-1.7-.8-2.5-1.5s-1.4-1.5-2-2.5c-.5-1-.8-2.2-.8-3.6V43.5c0-.9-.2-1.7-.6-2.3-.4-.6-.9-1.1-1.5-1.5-.6-.4-1.2-.6-1.8-.7-.6-.1-1.1-.2-1.5-.2v-5.3zM61.8 38.7c-.4 0-1 .1-1.6.2-.6.1-1.2.4-1.8.7-.6.3-1.1.7-1.5 1.3-.4.5-.6 1.3-.6 2.1v12.1c0 1.4-.3 2.6-.8 3.6s-1.2 1.9-2 2.5c-.8.7-1.6 1.2-2.5 1.5-.9.3-1.6.5-2.2.5h-5.3v-5.3h3.2c.7 0 1.3-.1 1.8-.4.4-.3.8-.6 1-1 .2-.4.4-.9.4-1.3.1-.5.1-.9.1-1.4V42.3c0-1.2.2-2.1.7-2.9.5-.8 1-1.4 1.7-1.8.6-.4 1.3-.8 2-1 .7-.2 1.3-.3 1.7-.4v-.1c-.5 0-1-.1-1.7-.3-.7-.2-1.3-.5-2-.9-.6-.4-1.2-1.1-1.7-1.9-.5-.8-.7-2-.7-3.4V18.5c0-.4 0-.9-.1-1.4-.1-.5-.2-.9-.4-1.3s-.6-.7-1-1c-.4-.3-1-.4-1.8-.4h-3.2V9.1h5.3c.6 0 1.4.2 2.2.5.9.3 1.7.8 2.5 1.5s1.4 1.5 2 2.5c.5 1 .8 2.2.8 3.6v11.6c0 .9.2 1.7.6 2.3.4.6.9 1.1 1.5 1.5.6.4 1.2.6 1.8.7.6.1 1.2.2 1.6.2v5.2z"/></symbol><symbol id="trumbowyg-upload" viewBox="0 0 72 72"><path d="M64 27v28H8V27H0v36h72V27h-8z"/><path d="M32.1 6.7h8v33.6h-8z"/><path d="M48 35.9L36 49.6 24 36h24z"/></symbol></svg>'
      )
    )
    }

    _textarea.trumbowyg({
      btns: [
        // ['viewHTML'],
        // ['formatting'],
         ['strong', 'em'],
        // ['superscript', 'subscript'],
        ['link'],
        // ['insertImage'],
        // 'btnGrp-justify',
        'btnGrp-lists'
        // ['horizontalRule'],
        // ['removeformat'],
        // ['fullscreen']
      ],
      autogrow: true
      // "#{asset_path('/assets/font/icons_trumbowyg.svg')}"
      // /assets/icons_trumbowyg.svg
    });
    

    // _textarea.trumbowyg({
    //   btns: [
    //     // ['viewHTML'],
    //     // ['formatting'],
    //      ['strong', 'em'],
    //     // ['superscript', 'subscript'],
    //     ['link'],
    //     // ['insertImage'],
    //     // 'btnGrp-justify',
    //     'btnGrp-lists'
    //     // ['horizontalRule'],
    //     // ['removeformat'],
    //     // ['fullscreen']
    //   ],
    //   autogrow: true,
    //   svgPath : '/assets/icons_trumbowyg.svg'
    // });



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
