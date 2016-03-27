'use strict';


(function(ns){
  ns.Widgets = ns.Widgets || {};


 ns.Widgets.InputTel = function(placeholder){

  	var checkPhone = function(){
  		var okPattern = new RegExp (/\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*/);
      var notPattern = new RegExp (/[a-z]/);
        if ((notPattern.test(_inputTel.getVal())) || !(okPattern.test(_inputTel.getVal()))) {_inputTel.addWarning(); return ''}
        return _inputTel.getVal();
      }

  	var _inputTel = Pard.Widgets.Input(placeholder, 'tel', function(){_inputTel.removeWarning();}, checkPhone);

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
        _inputTel.addWarning();
      },
      removeWarning: function(){
        _inputTel.removeWarning();
      },
      setClass: function(_class){
        _inputTel.setClass(_class);
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
  		dateFormat: 'DD, dd M yyyy',
			multiSeparator: ' - ',
  		multiSelect: 2,
  		defaultStatus: placeholder,
  		defaultDate: null,
  		onSelect:  function(){_datePicker.removeClass('warning')}
  	});

    // _datePicker.addClass('warning');

  	 return{
      render: function(){
        return _datePicker;
      },
      getVal: function(){
        if (_inputDate.getVal()) return _datePicker.datepick('getDate'); return false;
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

    for (var field in _inputForm) _inputForm[field].setClass(field+'-addressForm');

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
      },
      addWarning: function(){
        addressValue();
      }
    }
  }

  

  ns.Widgets.AddWebField = function(inputWeb, entries){
    var _webTitle = Pard.Widgets.Input('Título del enlace. Ej: Sito Web, Facebook, Blog, etc.','text', function(){_webTitle.removeWarning();}, function(){Pard.Widgets.WebFilled({web_title: _webTitle, link: _link})});
    var _link = Pard.Widgets.Input('Copia y pega aquí el enlace correspondiente','url', function(){_link.removeWarning();}, function(){Pard.Widgets.WebFilled({web_title: _webTitle, link: _link})});

    _webTitle.setClass('webTitle-input');
    // _link.setClass('links-input');
    
    var _inputsObj = {
      web_title: _webTitle,
      link: _link
    };

    entries.push(_inputsObj);

    var _deleteBtn = Pard.Widgets.Button('-', function(){
      _webFieldAdded.empty();
      entries.pop();
    });
    _deleteBtn.setClass('minus-inform-btn');

    var _webFieldAdded = $('<div>').append(_inputsObj['web_title'].render(), _inputsObj['link'].render(), _deleteBtn.render());

    inputWeb.append(_webFieldAdded);
    
    return {
      render: function(){
        return entries;
      }
    }
  }

  ns.Widgets.PrintLinksFields = function(inputWeb, entry, _entries){
    var _deleteBtn = Pard.Widgets.Button('-', function(){
      _webFieldAdded.empty();
      var index = _entries.indexOf(entry);
      _entries.splice(index,1);
    });
    _deleteBtn.setClass('minus-inform-btn');

    var _webFieldAdded = $('<div>').append(entry['web_title'].render(), entry['link'].render(), _deleteBtn.render());

    inputWeb.append(_webFieldAdded);
  }

  

  ns.Widgets.InputWebs = function(label1, label2){

    var _webTitle = Pard.Widgets.Input('Título del enlace. Ej: Web Personal, Facebook, etc.','text', function(){_webTitle.removeWarning();}, function(){Pard.Widgets.WebFilled({web_title: _webTitle, link: _link})});
    var _link = Pard.Widgets.Input('Copia y pega aquí el enlace correspondiente','url', function(){_link.removeWarning();}, function(){Pard.Widgets.WebFilled({web_title: _webTitle, link: _link})});

    _webTitle.setClass('webTitle-input');
    // _link.setClass('links-input');

    var _entries= [{
            web_title: _webTitle,
            link: _link
          }];; 

    var _inputWeb = $('<div>').css({
      'min-height': '1rem'
    });
 
    var _addFieldBtn = Pard.Widgets.Button('+', function(){
      _entries = Pard.Widgets.AddWebField(_inputWeb, _entries).render();
    });

    _addFieldBtn.setClass('plus-inform-btn');

    var _deleteBtn = Pard.Widgets.Button('-', function(){
      _webFieldAdded.empty();
      _entries.pop();
    });

    _deleteBtn.setClass('minus-inform-btn');

    return {
      render: function(){
        for (var i=0; i<_entries.length;i++){
          Pard.Widgets.PrintLinksFields(_inputWeb, _entries[i],_entries);
        }

        var _createdWidget = $('<div>').append(_inputWeb,_addFieldBtn.render());
        return _createdWidget;
      },
      getVal: function(){
        var _values = [];
        var _check = true;
        _entries.forEach(function(entry){
          if (Pard.Widgets.WebFilled(entry).finalValue()) _values.push(Pard.Widgets.WebFilled(entry).finalValue());
          if (!(Pard.Widgets.WebFilled(entry).check())) _check = false;
        });
        if (_check) return _values;
        return _check;
      },
      setVal: function(_savedValues){
        var _arrayOfObj = Object.keys(_savedValues).map(function(key){return _savedValues[key]});
        _arrayOfObj.forEach(function(elem,index){
          var _webTitle = Pard.Widgets.Input('Título del enlace. Ej: Web Personal, Facebook, etc.','text', function(){_webTitle.removeWarning();}, function(){Pard.Widgets.WebFilled({web_title: _webTitle, link: _link})});
          var _link = Pard.Widgets.Input('Copia y pega aquí el enlace correspondiente','url', function(){_link.removeWarning();}, function(){Pard.Widgets.WebFilled({web_title: _webTitle, link: _link})});

        _webTitle.setClass('webTitle-input');
  
        _entries.push({
          web_title: _webTitle,
          link: _link
        });

        for(var field in elem) _entries[index][field].setVal(elem[field]);
        })
      }
    }
  }

  

  ns.Widgets.WebFilled = function(element){
    var _finalValue, _check;
    var _val = {}
    for (var key in element) _val[key] = element[key].getVal();
    if ((!(_val['web_title']) && _val['link'])||(_val['web_title'] && !(_val['link']))){
      for (var key in element) {
        if (!(_val[key])) {
          element[key].addWarning();
          _finalValue='';
          _check = false
        }
      }
    }
    if (_val['web_title'] && _val['link'])  {
      _finalValue = _val;
      _check = true;
    }
    if (!(_val['web_title'])&& !(_val['link']) ){
      for (var key in element) {element[key].removeWarning()} 
      _finalValue = '';
      _check = true;
    }

    return{
      finalValue: function(){
        return _finalValue;
      },
      check: function(){
        return _check;
      }
    }
    
  } 

   ns.Widgets.InputPersonalWeb = function(label1, label2){
    var _webTitle = Pard.Widgets.Input(label1,'text', function(){_webTitle.removeWarning();}, function(){Pard.Widgets.WebFilled({web_title: _webTitle, link: _link})});
    var _link = Pard.Widgets.Input('Copia y pega aquí el enlace correspondiente','url', function(){_link.removeWarning();}, function(){Pard.Widgets.WebFilled({web_title: _webTitle, link: _link})});

    _webTitle.setClass('links-input');
    _link.setClass('links-input');

    var _entries = {
            web_title: _webTitle,
            link: _link
          };
 
    var _webField = $('<div>');
    _webField.append(_webTitle.render(), _link.render());
    var _inputWeb = $('<div>').append(_webField);

    var _createdWidget = $('<div>').append(_inputWeb);

    return {
      render: function(){
        return _createdWidget;
      },
      getVal: function(){
        return Pard.Widgets.WebFilled(_entries);
      },
      setVal: function(_val){
        for(var field in _val) {_entries[field] = _val[field];}
      }

    }
  }

  ns.Widgets.InputMultimedia = function(){

    var _createdWidget = $('<div>');    
    var _results = [];
    var _inputs = [];
    _inputs[0] = Pard.Widgets.Input('Copia y pega aquí el enlace correspondiente','url');
    _inputs[0].setClass('multiMedia');
    var _addInputButton = $('<span>').addClass('material-icons').html('&#xE148').css({
      position: 'relative',
      top: '5px',
      left: '5px',
      cursor: 'pointer'
    });

    _addInputButton.on('click', function(){
      var _container = $('<div>');
      var _newInput = Pard.Widgets.Input('Copia y pega aquí el enlace correspondiente','url');
      _newInput.setClass('multiMedia');
      _inputs.push(_newInput);

      var _removeInputButton = $('<span>').addClass('material-icons').html('&#xE888').css({
        position: 'relative',
        top: '5px',
        left: '5px',
        cursor: 'pointer'
      });

      _container.append(_newInput.render().css('width', '550'), _removeInputButton);
      _removeInputButton.on('click', function(){
        _inputs.splice(_inputs.indexOf(_newInput), 1);
        _container.empty();
      });
      _createdWidget.append(_container);
    })

    _createdWidget.append(_inputs[0].render().css('width', '550'), _addInputButton);

    var fb_photos_url = /^(http|https)\:\/\/www\.facebook\.com\/.*\/photos\/.*/i;
    var fb_posts_url = /^(http|https)\:\/\/www\.facebook\.com\/.*\/posts\/.*/i;
    var fb_videos_url = /^(http|https)\:\/\/www\.facebook\.com\/.*\/videos\/.*/i;

    var ig_url = /^(http|https)\:\/\/www\.instagram\..*/i;
    var pt_url = /^(http|https)\:\/\/.*\.pinterest\.com\/pin\//i;
    var vn_url = /^(http|https)\:\/\/vine\..*/i;
    var sp_url = /^(http|https)\:\/\/open\.spotify\..*/i;
    var bc_url = /.*src=\"https:\/\/bandcamp\.com\/EmbeddedPlayer\/.*/i;

    var tw_url = /^(http|https)\:\/\/twitter\.com\/.*/i;
    var yt_url = /^(http|https)\:\/\/www\.youtube\.*/i;
    var vm_url = /^(http|https)\:\/\/vimeo\.*/i;
    var fl_url = /^(http|https)\:\/\/flickr\.*/i;
    var sc_url = /^(http|https)\:\/\/soundcloud\.*/i;

    var _checkUrl = function(input){
      input.removeWarning();
      var url = input.getVal();

      if(url.match(fb_photos_url)) return _composeResults(url, 'facebook', 'image');
      if(url.match(fb_posts_url)) return _composeResults(url, 'facebook', 'image');
      if(url.match(fb_videos_url)) return _composeResults(url, 'facebook', 'video');
      if(url.match(ig_url)) return _composeResults(url, 'instagram', 'image');
      if(url.match(pt_url)) return _composeResults(url, 'pinterest', 'image');
      if(url.match(vn_url)) return _composeResults(url, 'vine', 'video');
      if(url.match(sp_url)) return _composeResults(url, 'spotify', 'audio');
      if(url.match(bc_url)) return _composeResults(url, 'bandcamp', 'audio');
      if(url.match(tw_url)) return _composeResults(url, 'twitter', 'image');
      if(url.match(yt_url)) return _composeResults(url, 'youtube', 'video');
      if(url.match(vm_url)) return _composeResults(url, 'vimeo', 'video');
      if(url.match(fl_url)) return _composeResults(url, 'flickr', 'image');
      if(url.match(sc_url)) return _composeResults(url, 'soundcloud', 'audio');
      
      input.addWarning();
      return false;
    }

    var _composeResults = function(url, provider, type){
      _results.push({url: url, provider: provider, type: type});
      return _results;
    }
 
    return {
      render: function(){
        return _createdWidget;
      },
      filled: function(){
        var _check = true;
        _results = [];
        _inputs.forEach(function(input){
          if(_checkUrl(input) == false) _check = false;
        });
        return _check;
      },
      getInputs: function(){
        return _inputs;
      },
      getVal: function(){
        return _results;
      },
      setVal: function(values){
        values.forEach(function(value){
          _results.push(value);
        });
      }
    }
  }

}(Pard || {}));
