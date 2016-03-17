'use strict';


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

  ns.Widgets.Input = function(label, type, oninputcallback, onchangecallback){

    var _input = $('<input>').attr({'type':type, 'placeholder': label});

    _input.on('input',function(){
      if(oninputcallback) oninputcallback();
    });

    _input.on('change', function(){
    	if(onchangecallback) onchangecallback();
    })

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

    var _helptext = $('<p>').addClass('help-text').text(label);

    return{
      render: function(){
        return _helptext;
      },
      setClass: function(_class){
        _helptext.addClass(_class);
      }
    }
  };

  ns.Widgets.InputTel = function(placeholder){

  	var checkPhone = function(){
  		var okPattern = new RegExp (/\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*/);
      var notPattern = new RegExp (/[a-z]/);
        if ((notPattern.test(_inputTel.getVal())) || !(okPattern.test(_inputTel.getVal()))) {_inputTel.addWarning(); return ''}
        return _inputTel.getVal();
      }

  	var _inputTel = Pard.Widgets.Input(placeholder, 'tel', function(){_inputTel.removeWarning();}, checkPhone)

  	 return{
      render: function(){
        return _inputTel.render();
      },
      getVal: function(){
        return checkPhone();
      },
      setVal: function(value){
        _inputTel.setVal(value);
      },
      addWarning: function(){
        _inputTel.addClass('warning');
      },
      removeWarning: function(){
        _inputTel.removeClass('warning');
      },
      setClass: function(_class){
        _inputTel.addClass(_class);
      }
    }
  }

   ns.Widgets.InputDate = function(placeholder){
 	
  	var _inputDate = Pard.Widgets.Input(placeholder,'text');

  	var _datePicker = _inputDate.render();
  	_datePicker.datepick({
  		firstDay: 1,
  		minDate: new Date(2016, 10 - 1, 15),
  		maxDate: new Date(2016, 10 - 1, 16),
  		dateFormat: 'D dd M yyyy',
  		multiSelect: 2,
  		defaultStatus: placeholder,
  		defaultDate: null,
  		onSelect:  function(){_datePicker.removeClass('warning')}
  	});

  	 return{
      render: function(){
        return _datePicker;
      },
      getVal: function(){
        return _datePicker.datepick('getDate');
      },
      setVal: function(dates){
      	_datePicker.datepick('setDate', dates);
      },
      addWarning: function(){
        _datePicker.addClass('warning');
      },
      removeWarning: function(){
        _datePicker.removeClass('warning');
      },
      setClass: function(_class){
        _datePicker.addClass(_class);
      }
    }
  }



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


  ns.Widgets.InputAddressSpace = function(label){
   
    var autocomplete;

    var componentForm = {
      route: 'long_name',
      street_number: 'short_name',
      locality: 'long_name',
      country: 'long_name',
      postal_code: 'short_name'
    };

    var _inputForm = {
      route: Pard.Widgets.Input('Calle','text', function(){_inputForm.route.removeWarning();}),
      street_number: Pard.Widgets.Input('Numero', 'text', function(){_inputForm.street_number.removeWarning();}),
      door: Pard.Widgets.Input('Piso / Puerta', 'text', function(){_inputForm.door.removeWarning();}),
      locality: Pard.Widgets.Input('Ciudad','text', function(){_inputForm.locality.removeWarning();}),
      country: Pard.Widgets.Input('País','text', function(){_inputForm.country.removeWarning();}),
      postal_code: Pard.Widgets.Input('Código postal','text', function(){_inputForm.postal_code.removeWarning();})
    }

    var _inputPlace = $('<input>').attr({type: 'text', id: 'place_address_autocomplete', placeholder:label});



    _inputPlace.one('focus', function(){AutocompleteFunction()});

    var AutocompleteFunction = function(){
       autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('place_address_autocomplete')),
        {types: ['address']});
      autocomplete.addListener('place_changed', function(){FillInAddress(autocomplete, _inputForm)});
    }

    FillInAddress = function(autocomplete, _inputForm) {
      var place = autocomplete.getPlace();

      for (var component in _inputForm) {
        _inputForm[component].setVal('');
        _inputForm[component].setAttr('disabled', false);
      }  

      if (place.address_components){
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            _inputForm[addressType].setVal(val);
            _inputForm[addressType].removeWarning();
          }
        }
      }
    }

    var addressValue = function(){
      var _addressValues = {};
      var _check = true;
      for (var field in _inputForm){
        _addressValues[field] = _inputForm[field].getVal();
      }
      ['route', 'street_number', 'locality', 'postal_code'].forEach(function(field){
        if (!(_addressValues[field])) {
          _inputForm[field].addWarning();
          _check = '';
        }
      })
      if (_check) return _addressValues;
      return _check;
    }
 
    var _placeForm = $('<div>').append(_inputPlace);
    for (var key in _inputForm){_placeForm.append(_inputForm[key].render().attr({disabled: 'true'}))};

    return {
      render: function(){
        return _placeForm;
      },
      getVal: function(){
        return addressValue();
      },
      setVal: function(_val){
        for(var field in _inputForm) {
        	_inputForm[field].setAttr('disabled', false);
        	_inputForm[field].setVal(_val[field]);
        }
      }
    }
  }

  

  ns.Widgets.AddWebField = function(inputWeb, entries){
    var _webTitle = Pard.Widgets.Input('Título del enlace. Ej: Sito Web, Facebook, Blog, etc.','text', function(){_webTitle.removeWarning();}, function(){Pard.Widgets.WebFilled({web_title: _webTitle, link: _link})});
    var _link = Pard.Widgets.Input('Copia y pega aquí el enlace correspondiente','url', function(){_link.removeWarning();}, function(){Pard.Widgets.WebFilled({web_title: _webTitle, link: _link})});
    
    var _inputsObj = {
      web_title: _webTitle,
      link: _link
    };

    entries.push(_inputsObj);


    var _deleteBtn = Pard.Widgets.Button('-', function(){
      _webFieldAdded.empty();
      entries.pop();
    });

  	var _webFieldAdded = $('<div>').append(_inputsObj['web_title'].render(), _inputsObj['link'].render(), _deleteBtn.render());

  	inputWeb.append(_webFieldAdded);
  	
    return {
      render: function(){
        return entries;
      }
    }
  }

  

  ns.Widgets.InputWebs = function(){

    var _webTitle = Pard.Widgets.Input('Título del enlace. Ej: Web Personal, Facebook, etc.','text', function(){_webTitle.removeWarning();}, function(){Pard.Widgets.WebFilled({web_title: _webTitle, link: _link})});
    var _link = Pard.Widgets.Input('Copia y pega aquí el enlace correspondiente','url', function(){_link.removeWarning();}, function(){Pard.Widgets.WebFilled({web_title: _webTitle, link: _link})});

    var _entries = [{
            web_title: _webTitle,
            link: _link
          }];

    var _inputWeb = $('<div>');
 
    var _addFieldBtn = Pard.Widgets.Button('+', function(){
      _entries = Pard.Widgets.AddWebField(_inputWeb, _entries).render();
    });

    var _deleteBtn = Pard.Widgets.Button('-', function(){
      _webFieldAdded.empty();
      _entries.pop();
    });
  
    var _webField = $('<div>').append(_entries[0]['web_title'].render(), _entries[0]['link'].render());
    _inputWeb.append(_webField);

    for (var i=1; i<_entries.length; i++){
    	var _webFieldAdded = $('<div>').append(_entries[i]['web_title'].render(), _entries[i]['link'].render(), _deleteBtn.render());
    	_inputWeb.append(_webFieldAdded);
  	}

    var _createdWidget = $('<div>').append(_inputWeb,_addFieldBtn.render());

    return {
      render: function(){
        return _createdWidget;
      },
      getVal: function(){
        var _values = [];
        _entries.forEach(function(entry){
          if (Pard.Widgets.WebFilled(entry)) _values.push(Pard.Widgets.WebFilled(entry));
          } 
        )
        return _values;
      },
      setVal: function(_val){
        _val.forEach(function(entry){
        	for(var field in entry) _entries[field] = entry[field];
        })
      }
    }
  }

  

  ns.Widgets.WebFilled = function(element){
      var _val = {}
      for (var key in element) _val[key] = element[key].getVal();
      if ((!(_val['web_title']) && _val['link'])||(_val['web_title'] && !(_val['link']))){
        for (var key in element) {
          if (!(_val[key])) {
            element[key].addWarning();
            return '';
          }
        }
      }
      if (_val['web_title'] && _val['link']) return _val;
      for (var key in element) {element[key].removeWarning()} 
      return '';
  } 


   ns.Widgets.InputPersonalWeb = function(){
    var _webTitle = Pard.Widgets.Input('Título del enlace. Ej: Web Personal, Blog, Facebook, etc.','text', function(){_webTitle.removeWarning();}, function(){Pard.Widgets.WebFilled({web_title: _webTitle, link: _link})});
    var _link = Pard.Widgets.Input('Copia y pega aquí el enlace correspondiente','url', function(){_link.removeWarning();}, function(){Pard.Widgets.WebFilled({web_title: _webTitle, link: _link})});
    var _entries = [{
            web_title: _webTitle,
            link: _link
          }];
 
    var _webField = $('<div>');
    _webField.append(_webTitle.render(), _link.render());
    var _inputWeb = $('<div>').append(_webField);

    var _createdWidget = $('<div>').append(_inputWeb);

    return {
      render: function(){
        return _createdWidget;
      },
      getVal: function(){
        return Pard.Widgets.WebFilled(_entries[0]);
      },
      setVal: function(_val){
        for(var field in _val) {_entries[field] = _val[field];}
      }

    }
  }



}(Pard || {}));
