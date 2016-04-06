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

  

  // ns.Widgets.AddWebField = function(inputWeb, entries){
  //   var _webTitle = Pard.Widgets.Input('Título del enlace. Ej: Sito Web, Facebook, Blog, etc.','text', function(){_webTitle.removeWarning();}, function(){Pard.Widgets.WebFilled({web_title: _webTitle, link: _link})});
  //   var _link = Pard.Widgets.Input('Copia y pega aquí el enlace correspondiente y dale al botón para validar','url', function(){_link.removeWarning();}, function(){Pard.Widgets.WebFilled({web_title: _webTitle, link: _link})});

  //   _webTitle.setClass('webTitle-input');
  //   // _link.setClass('links-input');
    
  //   var _inputsObj = {
  //     web_title: _webTitle,
  //     link: _link
  //   };

  //   entries.push(_inputsObj);

  //   var _deleteBtn = Pard.Widgets.Button('-', function(){
  //     _webFieldAdded.empty();
  //     entries.pop();
  //   });
  //   _deleteBtn.setClass('minus-inform-btn');

  //   var _webFieldAdded = $('<div>').append(_inputsObj['web_title'].render(), _inputsObj['link'].render(), _deleteBtn.render());

  //   inputWeb.append(_webFieldAdded);
    
  //   return {
  //     render: function(){
  //       return entries;
  //     }
  //   }
  // }

  // ns.Widgets.PrintLinksFields = function(inputWeb, entry, _entries){
  //   var _deleteBtn = Pard.Widgets.Button('-', function(){
  //     _webFieldAdded.empty();
  //     var index = _entries.indexOf(entry);
  //     _entries.splice(index,1);
  //   });
  //   _deleteBtn.setClass('minus-inform-btn');

  //   var _webFieldAdded = $('<div>').append(entry['web_title'].render(), entry['link'].render(), _deleteBtn.render());

  //   inputWeb.append(_webFieldAdded);
  // }

  

  // ns.Widgets.InputWebs = function(label1, label2){

  //   var _webTitle = Pard.Widgets.Input('Título del enlace. Ej: Web Personal, Facebook, etc.','text', function(){_webTitle.removeWarning();}, function(){Pard.Widgets.WebFilled({web_title: _webTitle, link: _link})});
  //   var _link = Pard.Widgets.Input('Copia y pega aquí el enlace correspondiente','url', function(){_link.removeWarning();}, function(){Pard.Widgets.WebFilled({web_title: _webTitle, link: _link})});

  //   _webTitle.setClass('webTitle-input');
  //   // _link.setClass('links-input');

  //   var _entries= [{
  //           web_title: _webTitle,
  //           link: _link
  //         }];; 

  //   var _inputWeb = $('<div>').css({
  //     'min-height': '1rem'
  //   });
 
  //   var _addFieldBtn = Pard.Widgets.Button('+', function(){
  //     _entries = Pard.Widgets.AddWebField(_inputWeb, _entries).render();
  //   });

  //   _addFieldBtn.setClass('plus-inform-btn');

  //   var _deleteBtn = Pard.Widgets.Button('-', function(){
  //     _webFieldAdded.empty();
  //     _entries.pop();
  //   });

  //   _deleteBtn.setClass('minus-inform-btn');

  //   return {
  //     render: function(){
  //       for (var i=0; i<_entries.length;i++){
  //         Pard.Widgets.PrintLinksFields(_inputWeb, _entries[i],_entries);
  //       }

  //       var _createdWidget = $('<div>').append(_inputWeb,_addFieldBtn.render());
  //       return _createdWidget;
  //     },
  //     getVal: function(){
  //       var _values = [];
  //       var _check = true;
  //       _entries.forEach(function(entry){
  //         if (Pard.Widgets.WebFilled(entry).finalValue()) _values.push(Pard.Widgets.WebFilled(entry).finalValue());
  //         if (!(Pard.Widgets.WebFilled(entry).check())) _check = false;
  //       });
  //       if (_check) return _values;
  //       return _check;
  //     },
  //     setVal: function(_savedValues){
  //       var _arrayOfObj = Object.keys(_savedValues).map(function(key){return _savedValues[key]});
  //       _arrayOfObj.forEach(function(elem,index){
  //         var _webTitle = Pard.Widgets.Input('Título del enlace. Ej: Web Personal, Facebook, etc.','text', function(){_webTitle.removeWarning();}, function(){Pard.Widgets.WebFilled({web_title: _webTitle, link: _link})});
  //         var _link = Pard.Widgets.Input('Copia y pega aquí el enlace correspondiente','url', function(){_link.removeWarning();}, function(){Pard.Widgets.WebFilled({web_title: _webTitle, link: _link})});

  //       _webTitle.setClass('webTitle-input');
  
  //       _entries.push({
  //         web_title: _webTitle,
  //         link: _link
  //       });

  //       for(var field in elem) _entries[index][field].setVal(elem[field]);
  //       })
  //     }
  //   }
  // }

  

  // ns.Widgets.WebFilled = function(element){
  //   var _finalValue, _check;
  //   var _val = {}
  //   for (var key in element) _val[key] = element[key].getVal();
  //   if ((!(_val['web_title']) && _val['link'])||(_val['web_title'] && !(_val['link']))){
  //     for (var key in element) {
  //       if (!(_val[key])) {
  //         element[key].addWarning();
  //         _finalValue='';
  //         _check = false
  //       }
  //     }
  //   }
  //   if (_val['web_title'] && _val['link'])  {
  //     _finalValue = _val;
  //     _check = true;
  //   }
  //   if (!(_val['web_title'])&& !(_val['link']) ){
  //     for (var key in element) {element[key].removeWarning()} 
  //     _finalValue = '';
  //     _check = true;
  //   }

  //   return{
  //     finalValue: function(){
  //       return _finalValue;
  //     },
  //     check: function(){
  //       return _check;
  //     }
  //   }
    
  // }

  ns.Widgets.InputPersonalWeb = function(){

    var _createdWidget = $('<div>');    
    var _results = [];
    var _inputs = [];
    var _input = Pard.Widgets.Input('Copia y pega aquí el enlace correspondiente y dale al botón para validar','url',function(){
      _addInputButton.addClass('add-input-button-enlighted')
    });
    _input.setClass('add-multimedia-input-field');
    var _addInputButton = $('<span>').addClass('material-icons add-multimedia-input-button').html('&#xE86C');

    var _addnewInput = function(url){
      var _container = $('<div>');
      var _newInput = Pard.Widgets.Input('Copia y pega aquí el enlace correspondiente y dale al botón para validar','url');
      _newInput.setClass('add-multimedia-input-field');
      _newInput.setVal(url);
      _newInput.setAttr('disabled', true);
      _inputs.push(_newInput);

      var _removeInputButton = $('<span>').addClass('material-icons add-multimedia-input-button').html('&#xE888');

      _container.append(_newInput.render().addClass('add-multimedia-input-field'), _removeInputButton);
      _removeInputButton.on('click', function(){
        _inputs.splice(_inputs.indexOf(_newInput), 1);
        _container.empty();
      });
      return _container;
    }

    var _websAddedContainer = $('<div>');

    _addInputButton.on('click', function(){
      $(this).removeClass('add-input-button-enlighted');
      if(_checkUrl(_input)){
        _websAddedContainer.prepend(_addnewInput(_input.getVal()));
        _input.setVal('');
      }
    });

    _createdWidget.append(_input.render().addClass('add-multimedia-input-field'), _addInputButton, _websAddedContainer);

    var fb_url = /.*facebook\.com\/.*/i;
    var ig_url = /^(http|https)\:\/\/www\.instagram\..*/i;
    var pt_url = /^(http|https)\:\/\/.*\.pinterest\.com\/.*/i;
    var vn_url = /^(http|https)\:\/\/vine\..*/i;
    var sp_url = /^(http|https)\:\/\/open\.spotify\..*/i;
    var bc_url = /^(http|https)\:\/\/.*\.bandcamp\.com\/.*/i;
    var tw_url = /^(http|https)\:\/\/twitter\.com\/.*/i;
    var yt_url = /^(http|https)\:\/\/www\.youtube\.*/i;
    var vm_url = /^(http|https)\:\/\/vimeo\.*/i;
    var fl_url = /^(http|https)\:\/\/flickr\.*/i;
    var sc_url = /^(http|https)\:\/\/soundcloud\.*/i;

    var _checkUrl = function(input){
      input.removeWarning();
      var url = input.getVal();
      if(url == false) return false;

      if(url.match(fb_url)) return _composeResults(url, 'facebook');
      if(url.match(ig_url)) return _composeResults(url, 'instagram');
      if(url.match(pt_url)) return _composeResults(url, 'pinterest');
      if(url.match(vn_url)) return _composeResults(url, 'vine');
      if(url.match(sp_url)) return _composeResults(url, 'spotify');
      if(url.match(bc_url)) return _composeResults(url, 'bandcamp');
      if(url.match(tw_url)) return _composeResults(url, 'twitter');
      if(url.match(yt_url)) return _composeResults(url, 'youtube');
      if(url.match(vm_url)) return _composeResults(url, 'vimeo');
      if(url.match(fl_url)) return _composeResults(url, 'flickr');
      if(url.match(sc_url)) return _composeResults(url, 'soundcloud');
      return _composeResults(url, 'my_web');
    }

    var _composeResults = function(url, provider, type){
      if(!url.match(/^(http|https)\:\/\/.*/)) url = 'https://' + url;
      _results.push({url: url, provider: provider});
      return _results;
    }

    var _filled = function(){
      var _check = true;
      _results = [];
      _inputs.forEach(function(input){
        if(_checkUrl(input) == false) _check = false;
      });
      return _check;
    }

    return {
      render: function(){
        return _createdWidget;
      },
      filled: function(){
        return _filled();
      },
      getVal: function(){
        if(_filled() != false) return _results;
        return false;
      },
      setVal: function(values){
        if(values == null || values == false) return true;
        var _personal_webs = [];
        Object.keys(values).forEach(function(key){
          _personal_webs.push(values[key]);
        });
        _personal_webs.forEach(function(web, index){
          _websAddedContainer.prepend(_addnewInput(web.url));
        });
      }
    }
  }

  ns.Widgets.InputMultimedia = function(){

    var _createdWidget = $('<div>'); 
    var _results = [];
    var _inputs = [];
    var _input = Pard.Widgets.Input('Copia y pega aquí el enlace correspondiente y dale al botón para validar','url', function(){
      _addInputButton.addClass('add-input-button-enlighted');
    });
    _input.setClass('add-multimedia-input-field');
    var _addInputButton = $('<span>').addClass('material-icons add-multimedia-input-button').html('&#xE86C');

    var _addnewInput = function(url){
      var _container = $('<div>');
      var _newInput = Pard.Widgets.Input('Copia y pega aquí el enlace correspondiente y dale al botón para validar','url');
      _newInput.setClass('add-multimedia-input-field');
      _newInput.setVal(url);
      _newInput.setAttr('disabled', true);
      _inputs.push(_newInput);

      var _removeInputButton = $('<span>').addClass('material-icons add-multimedia-input-button').html('&#xE888');

      _container.append(_newInput.render().addClass('add-multimedia-input-field'), _removeInputButton);
      _removeInputButton.on('click', function(){
        var _index = _inputs.indexOf(_newInput);
        _inputs.splice(_index, 1);
        _results.splice(_index, 1);
        _container.empty();
      });
      return _container;
    }

    var _websAddedContainer = $('<div>');

    _addInputButton.on('click', function(){
      $(this).removeClass('add-input-button-enlighted');
      _checkUrl(_input, function(){
        _websAddedContainer.prepend(_addnewInput(_input.getVal()));
        _input.setVal('');
      });
    });

    _createdWidget.append(_input.render(), _addInputButton, _websAddedContainer);

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

    var _checkUrl = function(input, callback){
      input.removeWarning();
      var url = input.getVal();

      var _composeResults = function(provider, type){
        _results.push({url: url, provider: provider, type: type});
        callback();
        return _results;
      }

      var _callProvider = function(provider, type){
        $.getJSON("https://noembed.com/embed?callback=?",
        {"format": "json", "url": url}, function (data) {
          console.log('flag'+data);
          if ('error' in data) input.addWarning();
          else{
            _composeResults(provider, type);
          }
        });
      }

      if(url.match(fb_photos_url)) return _composeResults('facebook', 'image');
      if(url.match(fb_posts_url)) return _composeResults('facebook', 'image');
      if(url.match(fb_videos_url)) return _composeResults('facebook', 'video');
      if(url.match(ig_url)) return _composeResults('instagram', 'image');
      if(url.match(pt_url)) return _composeResults('pinterest', 'image');
      if(url.match(vn_url)) return _composeResults('vine', 'video');
      if(url.match(sp_url)) return _composeResults('spotify', 'audio');
      if(url.match(bc_url)) return _composeResults('bandcamp', 'audio');
      if(url.match(tw_url)) return _callProvider('twitter', 'image');
      if(url.match(yt_url)) return _callProvider('youtube', 'video');
      if(url.match(vm_url)) return _callProvider('vimeo', 'video');
      if(url.match(fl_url)) return _callProvider('flickr', 'image');
      if(url.match(sc_url)) return _callProvider('soundcloud', 'audio');
      
      input.addWarning();
      return false;
    }

    return {
      render: function(){
        return _createdWidget;
      },
      getVal: function(){
        return _results;
      },
      setVal: function(values){
        if(values == null || values == false) return true;
        var _links = [];
        Object.keys(values).forEach(function(key){
          _links.push(values[key]);
        });
        _links.forEach(function(web, index){
          _results.push(web);
          _websAddedContainer.prepend(_addnewInput(web.url));
        });
      }
    }
  }

}(Pard || {}));
