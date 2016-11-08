'use strict';

(function(ns){
  ns.Widgets = ns.Widgets || {};

  ns.Widgets.InputEmail = function(placeholder){

    var _checkInput = function(){
      if(!regEx.test(_input.getVal())){
        _input.addWarning();
        return false;
      }
      else{
        _input.removeWarning();
        return _input.getVal();
      }  
    }

    var regEx = /[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;

    var _input = Pard.Widgets.Input(placeholder, 'text', _checkInput);
    
    return{
      render: function(){
        return _input.render();
      },
      getVal: function(){
        return _checkInput();
      },
      setVal: function(value){
        _input.setVal(value);
      },
      addWarning: function(){
        _input.addWarning();
      },
      removeWarning: function(){
        _input.removeWarning();
      }
    }
  
  }

  ns.Widgets.InputTel = function(placeholder){

  	var checkPhone = function(){
  		var okPattern = new RegExp (/\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*/);
      var notPattern = new RegExp (/[a-z]/);
        if ((notPattern.test(_inputTel.getVal())) || !(okPattern.test(_inputTel.getVal()))) {_inputTel.addWarning(); return ''}
        return _inputTel.getVal();
    }

  	var _inputTel = Pard.Widgets.Input(placeholder, 'tel', function(){_inputTel.removeWarning()}, checkPhone);

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


  ns.Widgets.InputDate = function(placeholder,eventTime){
 	
  	var _inputDate = Pard.Widgets.Input(placeholder,'text');
    var _dateMinMax = [];
    for (var day in eventTime) {
      if (day != 'permanent') _dateMinMax.push(day);
    }

  	var _datePicker = _inputDate.render();
  	_datePicker.datepick({
  		firstDay: 1,
  		minDate: new Date(_dateMinMax[0]),
  		maxDate: new Date(_dateMinMax[_dateMinMax.length -1]),
  		dateFormat: 'DD, dd M yyyy',
			multiSeparator: ' - ',
  		multiSelect: _dateMinMax.length,
  		defaultStatus: placeholder,
  		defaultDate: null,
  		onSelect:  function(){_datePicker.removeClass('warning')}
  	});
 
	 return{
      render: function(){
        return _datePicker;
      },
      getVal: function(){
        if (_inputDate.getVal()){
          var _dateInserted = _datePicker.datepick('getDate');
          var _datesArray = [];
          _dateInserted.forEach(function(selection){
            var day = selection.getDate();
            var monthIndex = selection.getMonth()+1;
            var year = selection.getFullYear();
            _datesArray.push(year+ '-'+monthIndex+'-'+day);
          });
          return _datesArray;
       } 
        return false;
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

  // ns.Widgets.MultipleSelectorDate = function(eventTime, callback){
  //   var _createdWidget = $('<select>').attr("multiple", "multiple");
  //   var _dateMinMax = [];
  //   for (var day in eventTime) {
  //     var _dayHuman = moment(new Date(day)).locale('es').format('dd, DD-MM');
  //     if (day != 'permanent') _dateMinMax.push(_dayHuman);
  //   }
  //   _dateMinMax.forEach(function(value){
  //     _createdWidget.append($('<option>').text(value).val(value));
  //   });
  //    _createdWidget.on('change',function(){
  //       _createdWidget.next().find('.ms-choice').removeClass('warning');
  //     if(callback) {
  //       var boundCallback = callback.bind(_createdWidget);
  //       boundCallback();
  //     };
  //   });


  //   // _createdWidget.css({
  //   //   'width': 300
  //   // });

  //   return {
  //     render: function(){
  //       return _createdWidget;
  //     },
  //     getVal: function(){
  //       return _createdWidget.val();
  //     },
  //     setVal: function(value){
  //       _createdWidget.val(value);
  //     },
  //     addWarning: function(){
  //       _createdWidget.next().find('.ms-choice').addClass('warning');
  //     },
  //     removeWarning: function(){
  //       _createdWidget.next().find('.ms-choice').removeClass('warning');
  //     },
  //     setClass: function(_class){
  //       _createdWidget.addClass(_class);
  //     },
  //     enable: function(){
  //       _createdWidget.attr('disabled',false);
  //     },
  //     disable: function(){
  //       _createdWidget.attr('disabled',true);
  //     }
  //   }
  // }

  ns.Widgets.InputColor = function(){

    var _createdWidget = $('<div>');

    var _colorPicker = $('<input>').attr({'type': 'text', 'value': '#000000'});

    

    _createdWidget.append(_colorPicker);

   return{
      render: function(){
        _colorPicker.spectrum({
          chooseText: "OK",
          cancelText: "cancel",
          preferredFormat: "hex",
          move: function(color){
            _colorPicker.val(color);
          }
        });
        return _createdWidget;
      },
      getVal: function(){
        return _colorPicker.val(); 
      },
      setVal: function(colorPicked){
        _colorPicker.val(colorPicked);
      },
      addWarning: function(){
        _colorPicker.addClass('warning');
      },
      removeWarning: function(){
        _colorPicker.removeClass('warning');
      },
      setClass: function(_class){
        _colorPicker.addClass(_class);
      }
    }
  }

ns.Widgets.InputAddressArtist = function(){
  var componentForm = {
      locality: 'long_name',
      postal_code: 'short_name'
    };

    var _inputForm = {
      locality: Pard.Widgets.Input('Ciudad','text', function(){_inputForm.locality.removeWarning();}),
      postal_code: Pard.Widgets.Input('Código postal','text', function(){_inputForm.postal_code.removeWarning();})
    }

    // for (var field in _inputForm) _inputForm[field].setClass(field+'-artistForm');

      var addressValue = function(){
      var _addressValues = {};
      var _check = true;
      for (var field in _inputForm){
        _addressValues[field] = _inputForm[field].getVal();
      }
      ['locality', 'postal_code'].forEach(function(field){
        if (!(_addressValues[field])) {
          _inputForm[field].addWarning();
          _check = '';
        }
      })
      if (_check){
        // var uri = "https://maps.googleapis.com/maps/api/geocode/json?address=" + _addressValues.route + '+' + _addressValues.street_number + '+' + _addressValues.locality + '+' + _addressValues.postal_code + "&key=AIzaSyCimmihWSDJV09dkGVYeD60faKAebhYJXg";
        // $.get(uri, function(data){
        //   if(data.status == "OK" && data.results.length > 0){
        //     _addressValues.location = data.results[0].geometry.location;
        //   }
        // });
        return _addressValues;
      } 
      return _check;
    }


    var _placeForm = $('<div>');
    for (var field in _inputForm){
      _placeForm.append($('<div>').append(_inputForm[field].render()).addClass(field+'-ArtistForm'));
    };

    return {
      render: function(){
        return _placeForm;
      },
      getVal: function(){
        return addressValue();
      },
      setVal: function(_val){
        for(var field in _inputForm) {
          _inputForm[field].setVal(_val[field]);
        }
      },
      addWarning: function(){
        addressValue();
      }
    }
  }

   
  
ns.Widgets.InputAddressSpace = function(label){
   
    var autocomplete = {};

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

    var _inputPlace = $('<input>').attr({type: 'text', id: 'place_address_autocomplete', placeholder:label}).css('margin-bottom','1rem');

    _inputPlace.one('focus', function(){AutocompleteFunction()});

    var AutocompleteFunction = function(){
      autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('place_address_autocomplete')),
        {types: ['address']});
      autocomplete.addListener('place_changed', function(){FillInAddress(autocomplete, _inputForm)});
    }

    _inputPlace.one('input', function(){  
      for (var component in _inputForm) {
        _inputForm[component].setVal('');
        _inputForm[component].setAttr('disabled', false);
      }  
    });

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
      if(_geocod) _addressValues['location'] = _geocod;
      ['route', 'street_number', 'locality', 'postal_code'].forEach(function(field){
        if (!(_addressValues[field])) {
          _inputForm[field].addWarning();
          _check = '';
        }
      })
      if (_check){
        return _addressValues;
      } 
      return _check;
    }
 
    var _placeForm = $('<div>').append(_inputPlace);
    for (var key in _inputForm){_placeForm.append(_inputForm[key].render().attr({disabled: 'true'}))};

    var _mapCheckContainer = $('<div>').css({'margin-bottom':'-2.5rem'});
    var _seeMapText = $('<a>').text('Comprueba la localización en el mapa').attr('href','#');         
    var _map = $('<div>').attr('id', 'gmapProfile');
    var _errorBox = $('<div>');
    var _geocodCont = $('<div>').addClass('geocod-container-adrees-imput');
    var _mapBox = $('<div>').append(_map, _geocodCont);
    _mapCheckContainer.append($('<div>').append(_seeMapText).css({'text-align':'right','font-size':'0.8125rem', 'margin-top':'0.4rem'}), _errorBox, _mapBox);
    var geomap;
    var _geocod;
    var _check = true;
    var _latField = Pard.Widgets.Input('','text');
    var _lonField = Pard.Widgets.Input('','text');
    var _hereBtn = $('<a>').text('aquí').attr('href','#');

    _seeMapText.on('click',function(){
      _errorBox.empty()
      _mapCheckContainer.append();
      var _addressInserted = addressValue();
      var uri = Pard.Widgets.RemoveAccents("https://maps.googleapis.com/maps/api/geocode/json?address=" + _addressInserted.route + "+" + _addressInserted.street_number + "+" + _addressInserted.locality + "+" + _addressInserted.postal_code + "&key=AIzaSyCimmihWSDJV09dkGVYeD60faKAebhYJXg");
      var _location;
      $.post(uri, function(data){
        if(data.status == "OK" && data.results.length > 0){
          _geocod = data.results[0].geometry.location;
          _map.css({'width': '21rem', 'height': '13rem', 'display':'inline-block'});
          _location = [{lat: _geocod.lat, lon: _geocod.lng, zoom:17}];

          if (_check){ 
            geomap = new Maplace({
              locations: _location,
              map_div: '#gmapProfile',
              map_options: {
                mapTypeControl: false
              }
            }).Load();
            var _geocodField = $('<div>');
            var _latLabel = $('<label>').text('Latitud').append(_latField.render());
            var _lonLabel = $('<label>').text('Longitud').append(_lonField.render());
            var _geoCodText = $('<p>').append('Si la localización no está correcta, inserta manualmente tus coordenadas geográficas y guardala pinchando ', _hereBtn,'.');
            _hereBtn.click(function(){
              _geocod = {lat: _latField.getVal(), lng: _lonField.getVal()};
              _location = [{lat: _geocod.lat, lon: _geocod.lng, zoom:17}];
              geomap.SetLocations(_location, true);
            });
            _geocodCont.append(_latLabel, _lonLabel, _geoCodText)
            _check = false;
          }
          _mapBox.css({'padding-bottom':'2rem', 'margin-top':'0.5rem'})
          _latField.setVal(_geocod.lat);
          _lonField.setVal(_geocod.lng); 
          geomap.SetLocations(_location, true);
        }
        else{
          console.log('e1 ')
          _errorBox.append($('<p>').text('¡Atención! Google no reconoce la dirección insertada: corrígela, si quieres que sea localizada correctamente.').css({
            'color':'red',
            'margin-bottom':'0'
          }));
          if (_latField && _lonField) {
            _latField.setVal('');
            _lonField.setVal('');
            _hereBtn.trigger('click');
          }          
        }
      });
    });

    _placeForm.append(_mapCheckContainer);

    _inputPlace.on('focus', function(){
      if ($('.reveal[aria-hidden="false"]').html() && $(window).width()<1024){
        var _distanceInputTop = _inputPlace.offset().top;
        var _scroolTop = $('.reveal[aria-hidden="false"]').scrollTop();
        var _headerHeight = $('header').height();
        var _distanceToDo = _distanceInputTop + _scroolTop - _headerHeight - 10; 
        $('.reveal[aria-hidden="false"]').scrollTop(_distanceToDo);
      }
    })

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
      },
      getLocation: function(){
        return _geocod;
      }
    }
  }

  
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

      var _removeInputButton = $('<span>').addClass('material-icons add-multimedia-input-button-delete').html('&#xE888');

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
    var ig_url = /.*instagram\..*/i;
    var pt_url = /^(http|https)\:\/\/.*\.pinterest\.com\/.*/i;
    var vn_url = /^(http|https)\:\/\/vine\..*/i;
    var sp_url = /^(http|https)\:\/\/open\.spotify\..*/i;
    var bc_url = /^(http|https)\:\/\/.*\.bandcamp\.com\/.*/i;
    var tw_url = /.*twitter\.com\/.*/i;
    var yt_url = /.*youtube\.*/i;
    var vm_url = /^(http|https)\:\/\/vimeo\.*/i;
    var fl_url = /.*flickr\.*/i;
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
    var _input = Pard.Widgets.Input('Copia y pega aquí el enlace/código correspondiente y dale al botón para validar','url', function(){
      _addInputButton.addClass('add-input-button-enlighted');
      _invalidInput.empty();
    });
    _input.setClass('add-multimedia-input-field');
    var _addInputButton = $('<span>').addClass('material-icons add-multimedia-input-button').html('&#xE86C');

    var _addnewInput = function(url){
      var _container = $('<div>');
      var _newInput = Pard.Widgets.Input('Copia y pega aquí el enlace/código correspondiente y dale al botón para validar','url');
      _newInput.setClass('add-multimedia-input-field');
      _newInput.setVal(url);
      _newInput.setAttr('disabled', true);
      _inputs.push(_newInput);

      var _removeInputButton = $('<span>').addClass('material-icons add-multimedia-input-button-delete').html('&#xE888');

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

    var _linksPermitted = Pard.Widgets.MultimediaAccepted().render();

    _linksPermitted.addClass('links-accepted-caller');

    var _linksPermittedContainer = $('<div>').addClass('links-accepted-container');
    _linksPermittedContainer.append(_linksPermitted); 

    var _invalidInput = $('<div>');

    _createdWidget.append(_linksPermittedContainer, _input.render(), _addInputButton, _invalidInput, _websAddedContainer);

    var fb_photos_url = /^(http|https)\:\/\/www\.facebook\.com\/photo.*/i;
    var fb_photos_2url = /^(http|https)\:\/\/www\.facebook\.com\/.*\/photos.*/i;
    var fb_posts_url = /^(http|https)\:\/\/www\.facebook\.com\/.*\/posts\/.*/i;
    var fb_videos_url = /^(http|https)\:\/\/www\.facebook\.com\/.*\/video.*/i;
    var fb_videos_2url = /^(http|https)\:\/\/www\.facebook\.com\/video.*/i;

    var ig_url = /^(http|https)\:\/\/www\.instagram\..*/i;
    var pt_url = /^(http|https)\:\/\/.*\.pinterest\.com\/pin\//i;
    var vn_url = /^(http|https)\:\/\/vine\..*/i;
    var sp_url = /^(http|https)\:\/\/open\.spotify\.com\/track\/.*/i;
    var sp_2url = /^(http|https)\:\/\/play\.spotify\.com\/track\/.*/i;
    var sp_3url = /^spotify:track:.*/i;
    var bc_url = /.*src=\"(http|https)\:\/\/bandcamp\.com\/EmbeddedPlayer\/.*/i;

    var tw_url = /^(http|https)\:\/\/twitter\.com\/.*/i;
    var yt_url = /^(http|https)\:\/\/www\.youtube\..*/i;
    var vm_url = /^(http|https)\:\/\/vimeo\..*/i;
    var fl_url = /^(http|https)\:\/\/www\.flickr\..*/i;
    var sc_url = /^(http|https)\:\/\/soundcloud\..*/i;

    var _checkUrl = function(input, callback){
      input.removeWarning();
      _invalidInput.empty();
      var url = input.getVal();

      var _composeResults = function(provider, type){
        if(provider == 'spotify'){
          var _id = url.split('track').pop().substring(1);
          url = 'https://open.spotify.com/track/' + _id;
        }
        _results.push({url: url, provider: provider, type: type});
        callback();
        return _results;
      }

      var _callProvider = function(provider, type){
        $.getJSON("https://noembed.com/embed?callback=?",
        {"format": "json", "url": url}, function (data) {
          if ('error' in data) input.addWarning();
          else{
            _composeResults(provider, type);
          }
        });
      }

      if(url.match(fb_photos_url) || url.match(fb_photos_2url)) return _composeResults('facebook', 'image');
      if(url.match(fb_posts_url)) return _composeResults('facebook', 'image');
      if(url.match(fb_videos_url) || url.match(fb_videos_2url)) return _composeResults('facebook', 'video');
      if(url.match(ig_url)) return _composeResults('instagram', 'image');
      if(url.match(pt_url)) return _composeResults('pinterest', 'image');
      if(url.match(vn_url)) return _composeResults('vine', 'video');
      if(url.match(sp_url) || url.match(sp_2url) || url.match(sp_3url)) return _composeResults('spotify', 'audio');
      if(url.match(bc_url)) return _composeResults('bandcamp', 'audio');
      if(url.match(tw_url)) return _callProvider('twitter', 'image');
      if(url.match(yt_url)) return _callProvider('youtube', 'video');
      if(url.match(vm_url)) return _callProvider('vimeo', 'video');
      if(url.match(fl_url)) return _callProvider('flickr', 'image');
      if(url.match(sc_url)) return _callProvider('soundcloud', 'audio');
      
      input.addWarning();
      _invalidInput.append($('<p>').text('Entrada no valida').addClass('error-multimedia-text'));
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

  ns.Widgets.InputArtistProgram = function(places, _dayTime){

    var _createdWidget = $('<div>'); 
    var _results = [];
    var _inputs = [];
    var _inputSpace = $('<select>');
    var _inputSpaceContainer = $('<div>').addClass('inputSpace-container');
    var _inputStartingDayTime = $('<select>').addClass('inputDayTime-select');
    var _inputStartingDayTimeContainer = $('<div>').addClass('inputDayTime-container');
    var _inputEndDayTime = $('<select>').addClass('inputDayTime-select');
    var _inputEndDayTimeContainer = $('<div>').addClass('inputDayTime-container');

    var _addInputButton = $('<span>').addClass('material-icons add-multimedia-input-button').html('&#xE86C');
    _addInputButton.addClass('add-input-button-enlighted');
    var _addInputButtonContainer = $('<span>');

    var _addnewInput = function(showInfo){
      var _container = $('<div>');
      var _newInputSpace = Pard.Widgets.Selector([showInfo['place']], [showInfo['proposal_id']]);   
      var _newInputStartingDayTime;
      var _newInputEndDayTime; 
      if (!(parseInt(showInfo['starting_day_time']))) {
        switch(showInfo['starting_day_time']) {
          case 'permanent':   
            _newInputStartingDayTime = Pard.Widgets.Selector(['Los dos días'],['permanent']);
            _newInputEndDayTime = Pard.Widgets.Selector(['Los dos días'],['permanent']);
          break;
          case 'day_1':
            _newInputStartingDayTime = Pard.Widgets.Selector(['sábado'],['day_1']);
            _newInputEndDayTime = Pard.Widgets.Selector(['sábado'],['day_1']);
          break;
          case 'day_2':
            _newInputStartingDayTime = Pard.Widgets.Selector(['domingo'],['day_2']);
            _newInputEndDayTime = Pard.Widgets.Selector(['domingo'],['day_2']);
          break;              
        }
        
      }
      else { 
        _newInputStartingDayTime = Pard.Widgets.Selector([moment(new Date (parseInt(showInfo['starting_day_time']))).locale("es").format('dddd, HH:mm')+"h"],[showInfo['starting_day_time']]);
        _newInputEndDayTime = Pard.Widgets.Selector([moment(new Date (parseInt(showInfo['ending_day_time']))).locale("es").format('dddd, HH:mm')+"h"],[showInfo['ending_day_time']]);
      };

      _newInputSpace.setClass('add-space-input-field');
      _newInputStartingDayTime.setClass('add-dayTime-input-field');
      _newInputEndDayTime.setClass('add-dayTime-input-field');
      _newInputSpace.disable();
      _newInputStartingDayTime.disable();
      _newInputEndDayTime.disable();

      _inputs.push([_newInputStartingDayTime, _newInputEndDayTime, _newInputSpace]);

      var _removeInputButton = $('<span>').addClass('material-icons add-multimedia-input-button-delete').html('&#xE888');

      _container.append(_newInputStartingDayTime.render(),_newInputEndDayTime.render(), _newInputSpace.render(),  _removeInputButton);

      _removeInputButton.on('click', function(){
        var _index = _inputs.indexOf([_newInputStartingDayTime,_newInputEndDayTime, _newInputSpace]);
        _inputs.splice(_index, 1);

        var _indexR = -1;
        _results.some(function(result, index){

          if(result.proposal_id == _newInputSpace.getVal() && result.starting_day_time.toString() ==  _newInputStartingDayTime.getVal().toString() && result.ending_day_time.toString() ==  _newInputEndDayTime.getVal().toString())
            _indexR = index;
        });     
        if (_indexR > -1){ 
          _results.splice(_indexR, 1);
          _container.empty();
        }             
        $('#succes-box-call-manager').empty();
      });
      return _container;
    }
    
    var _showsAddedContainer = $('<div>');

    var _endDayTime = [{id:'',text:''}];

    _createdWidget.append(_inputStartingDayTimeContainer.append(_inputStartingDayTime), _inputEndDayTimeContainer.append(_inputEndDayTime),_inputSpaceContainer.append(_inputSpace), _addInputButtonContainer.append(_addInputButton),_showsAddedContainer);

    _inputSpace.select2({
      data: places,
      multiple:true,
      maximumSelectionLength: 1,
      placeholder: 'Espacio'
    });
    _inputStartingDayTime.select2({
      data: _dayTime,
      multiple:true,
      maximumSelectionLength: 1,
      placeholder: 'Horario de inicio'
    });
    _inputEndDayTime.select2({
      data: _endDayTime,
      multiple:true,
      maximumSelectionLength: 1,
      placeholder: 'Horario de finalización'
    });


    var _setEndTimeAndPlace = function(duration){
      var _preselectedEnding = {};
      var _endingDayTime = [{id:'',text:''}];   
      if (_inputStartingDayTime.select2('data')[0]){
        var _starting = _inputStartingDayTime.select2('data')[0]['id'];
        if (_starting == "permanent"){
         _endingDayTime = [{id: 'permanent', text: 'Los dos días'}];
         _preselectedEnding = {id: 'permanent', text: 'Los dos días'};
        }
        else if (_starting == "day_1"){
         _endingDayTime = [{id: 'day_1', text: 'sábado'}];
         _preselectedEnding = {id: 'day_1', text: 'sábado'};
        }
        else if (_starting == "day_2"){
         _endingDayTime = [{id: 'day_2', text: 'domingo'}];
         _preselectedEnding = {id: 'day_2', text: 'domingo'};
        }
        else{
          _starting = parseInt(_starting);
          _dayTime.forEach(function(dt){
            if (parseInt(dt['id']) > _starting){
             _endingDayTime.push(dt);
           }
          })
          if (duration && parseInt(_starting)) {
            var _durationMSec = parseInt(duration)*60000;
            _ending = parseInt(_starting) + _durationMSec;
            _preselectedEnding['id'] = _ending;
            _preselectedEnding['text'] = moment(new Date(_ending)).locale("es").format('dddd, HH:mm')+"h";
          }
        }
      }
      var _inputEndDayTime = $('<select>').addClass('inputDayTime-select');
      _inputEndDayTimeContainer.empty();
      _inputEndDayTimeContainer.append(_inputEndDayTime);
      _inputEndDayTime.select2({
        data: _endingDayTime,
        multiple:true,
        maximumSelectionLength: 1,
        placeholder: 'Horario de finalización'
      });

      var _inputSpace = $('<select>');
      _inputSpaceContainer.empty();
      _inputSpaceContainer.append(_inputSpace);
      var _compatibleSpaces = [];
      var _dayDictionary = {
        day_1: 15,
        day_2: 16
      }

      places.forEach(function(place){
        if (place.availability && Object.keys(place.availability).length == 2) _compatibleSpaces.push(place);
        else if (place.availability){
          switch(new Date(place.availability['0']).getDate()) {
            case new Date(_starting).getDate():
              _compatibleSpaces.push(place); //day of the month
            break;
            case _dayDictionary[_starting]:                
              _compatibleSpaces.push(place);
            break;
          }
        }
      });
      _inputSpace.select2({
        data: _compatibleSpaces,
        multiple:true,
        maximumSelectionLength: 1,
        placeholder: 'Espacio'
      });

      if (_preselectedEnding.id){
        var option = new Option(_preselectedEnding.text, _preselectedEnding.id, true, true);
        _inputEndDayTime.append(option);
        _inputEndDayTime.trigger('change');
        // console.log(_inputEndDayTime.select2('data')[0]);

      }

      _addInputButtonContainer.empty();
      var _addInputButton = $('<span>').addClass('material-icons add-multimedia-input-button').html('&#xE86C');
      _addInputButton.addClass('add-input-button-enlighted');
      _addInputButtonContainer.append(_addInputButton);


      var _addShow = function(){
        if (_inputSpace.val() && _inputStartingDayTime.val() && _inputEndDayTime.val()){
          var _data = _inputSpace.select2('data')[0]
          var _show = {
            place: _data['text'], 
            starting_day_time: _inputStartingDayTime.select2('data')[0]['id'],  
            ending_day_time:_inputEndDayTime.select2('data')[0]['id'],
            proposal_id: _data['id'],
            profile_id: _data['profile_id']
          };     
          _showsAddedContainer.prepend(_addnewInput(_show));
          _inputSpace.select2('val', '');
          _inputStartingDayTime.select2('val', '');
          _inputEndDayTime.val('');
          _results.push(_show);
          $('#succes-box-call-manager').empty();
        }
      }

      _addInputButton.on('click', function(){_addShow()});

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
        var _index = [];
        var _bothVal = [];
        values.forEach(function(val, index){
          if (val.starting_day_time == 'permanent'){
            _index.unshift(index);
            _bothVal.push(val);
          }
        })
        if (_index.length) _index.forEach(function(_ind){
          values.splice(_ind, 1)
        });
        values.sort(function(val1, val2){return parseInt(val2.starting_day_time)- parseInt(val1.starting_day_time)});
        if (_index.length) _bothVal.forEach(function(bval){values.push(bval)});
        values.forEach(function(show){
          _results.push(show);
          _showsAddedContainer.prepend(_addnewInput(show));
        });
      }, 
      setEndDayTime: function(duration){
        _inputStartingDayTime.on('change', function(){
          _setEndTimeAndPlace(duration);
        })
      }
    }
  }


  ns.Widgets.InputSpaceProgram = function(artists, _dayTime, programs){

    var _createdWidget = $('<div>'); 
    var _results = [];
    var _inputs = [];
    var _inputArtist = $('<select>');
    var _inputArtistContainer = $('<div>').addClass('inputArtist-container');
    var _inputStartingDayTime = $('<select>');
    var _inputStartingDayTimeContainer = $('<div>').addClass('inputDayTime-container');
    var _inputEndDayTime = $('<select>');
    var _inputEndDayTimeContainer = $('<div>').addClass('inputDayTime-container');

    var _addInputButton = $('<span>').addClass('material-icons add-multimedia-input-button').html('&#xE86C');
    _addInputButton.addClass('add-input-button-enlighted');
    var _addInputButtonContainer = $('<span>');

    var _addnewInput = function(showInfo){
      var _container = $('<div>');
      var _newInputArtist;
      var _newInputStartingDayTime;
      var _newInputEndDayTime;

      artists.some(function(artist){
        if (artist['id'] == showInfo['proposal_id']){ 
           _newInputArtist = Pard.Widgets.Selector([artist['text']],[artist['id']]);
           return true;
        }    
      });
      if (showInfo['starting_day_time'] == 'permanent') {
        _newInputStartingDayTime = Pard.Widgets.Selector(['Los dos días'],['permanent']);
        _newInputEndDayTime = Pard.Widgets.Selector(['Los dos días'],['permanent']);
      }
      else if (showInfo['starting_day_time'] == "day_1"){
        _newInputStartingDayTime =  Pard.Widgets.Selector(['sábado'],['day_1']);
        _newInputEndDayTime = Pard.Widgets.Selector(['sábado'],['day_1']);
      }
      else if (showInfo['starting_day_time'] == "day_2"){
        _newInputStartingDayTime =  Pard.Widgets.Selector(['domingo'],['day_2']);
        _newInputEndDayTime = Pard.Widgets.Selector(['domingo'],['day_2']);
      }
      else { 
        _newInputStartingDayTime = Pard.Widgets.Selector([moment(new Date (parseInt(showInfo['starting_day_time']))).locale("es").format('dddd, HH:mm')+"h"],[showInfo['starting_day_time']]);
        _newInputEndDayTime = Pard.Widgets.Selector([moment(new Date (parseInt(showInfo['ending_day_time']))).locale("es").format('dddd, HH:mm')+"h"],[showInfo['ending_day_time']]);
      };
      _newInputArtist.setClass('add-artist-input-field');
      _newInputStartingDayTime.setClass('add-dayTime-input-field');
      _newInputEndDayTime.setClass('add-dayTime-input-field');
      _newInputArtist.disable();
      _newInputStartingDayTime.disable();
      _newInputEndDayTime.disable();
      _inputs.push([_newInputStartingDayTime,_newInputEndDayTime, _newInputArtist]);

      var _removeInputButton = $('<span>').addClass('material-icons add-multimedia-input-button-delete').html('&#xE888');

      _container.append(_newInputStartingDayTime.render(), _newInputEndDayTime.render(), _newInputArtist.render(),  _removeInputButton);

      _removeInputButton.on('click', function(){
        var _index = _inputs.indexOf([_newInputStartingDayTime, _newInputEndDayTime,  _newInputArtist]);
        var _show = {
          proposal_id: _newInputArtist.getVal(), 
          starting_day_time: false
        };
        _inputs.splice(_index, 1);
        
        var _indexR = -1;
        _results.some(function(result, index){
          if(result.proposal_id == _newInputArtist.getVal() && result.starting_day_time.toString() ==  _newInputStartingDayTime.getVal().toString() && result.ending_day_time.toString() ==  _newInputEndDayTime.getVal().toString()){
            _indexR = index;
            _results.splice(_indexR, 1); 
            _results.push(_show);
            return true;
          }
        });

        _container.empty();
        $('#succes-box-call-manager').empty();
      });
      return _container;
    }
    
    var _showsAddedContainer = $('<div>');

    _createdWidget.append( _inputStartingDayTimeContainer.append(_inputStartingDayTime), _inputEndDayTimeContainer.append(_inputEndDayTime), _inputArtistContainer.append(_inputArtist), _addInputButtonContainer.append(_addInputButton),_showsAddedContainer);

    _inputArtist.select2({
      data: artists,
      multiple:true,
      maximumSelectionLength: 1,
      placeholder: 'Artista'
    });
    _inputStartingDayTime.select2({
      data: _dayTime,
      multiple:true,
      maximumSelectionLength: 1,
      placeholder: 'Día y hora'
    });
    _inputEndDayTime.select2({
      data: _dayTime,
      multiple:true,
      maximumSelectionLength: 1,
      placeholder: 'Día y hora'
    });


   _inputStartingDayTime.on('change', function(){_setEndTimeAndArtists()});

    var _setEndTimeAndArtists =  function(){
      var _endingDayTime = [{id:'',text:''}]; 
      var _preselectedEnding = {};    
      if (_inputStartingDayTime.select2('data')[0]){
        var _starting = _inputStartingDayTime.select2('data')[0]['id'];
        if (_starting == "permanent"){
         _endingDayTime = [{id: 'permanent', text: 'Los dos días'}];
         _preselectedEnding = {id: 'permanent', text: 'Los dos días'};
        }
        else if (_starting == "day_1"){
         _endingDayTime = [{id: 'day_1', text: 'sábado'}];
         _preselectedEnding = {id: 'day_1', text: 'sábado'};
        }
        else if (_starting == "day_2"){
         _endingDayTime = [{id: 'day_2', text: 'domingo'}];
         _preselectedEnding = {id: 'day_2', text: 'domingo'};
        }
        else{
          _starting = parseInt(_starting);
          _dayTime.forEach(function(dt){
            if (parseInt(dt['id']) > _starting){
             _endingDayTime.push(dt);
           }
          })
          // if (duration && parseInt(_starting)) {
          //   var _durationMSec = parseInt(duration)*60000;
          //   _ending = parseInt(_starting) + _durationMSec;
          //   _preselectedEnding['id'] = _ending;
          //   _preselectedEnding['text'] = moment(new Date(_ending)).locale("es").format('dddd, HH:mm')+"h";
          // }
        }
      }
      var _inputEndDayTime = $('<select>').addClass('inputDayTime-select');
      _inputEndDayTimeContainer.empty();
      _inputEndDayTimeContainer.append(_inputEndDayTime);
      _inputEndDayTime.select2({
        data: _endingDayTime,
        multiple:true,
        maximumSelectionLength: 1,
        placeholder: 'Horario de finalización'
      });

      var _inputArtist = $('<select>');
      _inputArtistContainer.empty();
      _inputArtistContainer.append(_inputArtist);
      var _compatibleArtists = [];
      var _dayDictionary = {
        day_1: 15,
        day_2: 16
      }

      artists.forEach(function(artist){
        if (artist.availability && Object.keys(artist.availability).length == 2) _compatibleArtists.push(artist);
        else if (artist.availability){
          switch(new Date(artist.availability['0']).getDate()) {
            case new Date(_starting).getDate():
              _compatibleArtists.push(artist); //day of the month
            break;
            case _dayDictionary[_starting]:                
              _compatibleArtists.push(artist);
            break;
          }
        }
      });
      _inputArtist.select2({
        data: _compatibleArtists,
        multiple:true,
        maximumSelectionLength: 1,
        placeholder: 'Artista'
      });

      if (_preselectedEnding.id){
        var option = new Option(_preselectedEnding.text, _preselectedEnding.id, true, true);
        _inputEndDayTime.append(option);
        _inputEndDayTime.trigger('change');
      }

      _addInputButtonContainer.empty();
      var _addInputButton = $('<span>').addClass('material-icons add-multimedia-input-button').html('&#xE86C');
      _addInputButton.addClass('add-input-button-enlighted');
      _addInputButtonContainer.append(_addInputButton);


      _addInputButton.on('click', function(){ _addShow(); });

      var _addShow = function(){
        if (_inputArtist.val() && _inputStartingDayTime.val() && _inputEndDayTime.val()){
          var _show = {
            proposal_id: _inputArtist.val()[0], 
            starting_day_time: _inputStartingDayTime.select2('data')[0]['id'],
            ending_day_time:  _inputEndDayTime.select2('data')[0]['id']
          };
          _showsAddedContainer.prepend(_addnewInput(_show));
          _inputArtist.select2('val', '');
          _inputStartingDayTime.select2('val', '');
          _inputEndDayTime.val('');
          _results.push(_show);
          $('#succes-box-call-manager').empty();
        }
        else{
          if (!(_inputArtist.val())) {_inputArtist.addClass('warning');}
          else if (!(_inputStartingDayTime.val())) {_inputStartingDayTime.addClass('warning');}
          else if (!(_inputEndDayTime.val())) {_inputEndDayTime.addClass('warning');}
        }
      }
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
        var _index = [];
        var _bothVal = [];
        values.forEach(function(val, index){
          if (val.starting_day_time == 'permanent'){
            _index.unshift(index);
            _bothVal.push(val);
          }
        })
        if (_index.length) _index.forEach(function(_ind){
          values.splice(_ind, 1)
        });
        values.sort(function(val1, val2){return parseInt(val2.starting_day_time)- parseInt(val1.starting_day_time)});
        if (_index.length) _bothVal.forEach(function(bval){values.push(bval)});
        values.forEach(function(show, index){
          _results.push(show);
          _showsAddedContainer.prepend(_addnewInput(show));
        });
      }
      // , 
      // setEndDayTime: function(){}
       
    }
  }


  ns.Widgets.WhiteListInput = function(emailsNames){
    
    var _createdWidget = $('<div>'); 
    var _results = [];
    var _inputs = [];
    var _inputNameEmail = $('<select>');
    var _inputContainer = $('<div>').addClass('input-whiteList-container');

    var _addInputButton = $('<span>').addClass('material-icons add-multimedia-input-button').html('&#xE86C');
    _addInputButton.addClass('add-input-button-enlighted');

    var _emails = [];

    var _addnewInput = function(item, classNewInput){
      if ($.inArray(item.email, _emails)>-1){
        Pard.Widgets.Alert('','Este usuario ya está en la lista.');
        return false;
      }
      else{
        _emails.push(item.email);
        var _container = $('<div>'); 
        var _newInput = Pard.Widgets.Selector([item['name_email']],[item['email']]);      
        _newInput.setClass('add-whiteList-input-field');
        if (classNewInput) _newInput.setClass(classNewInput);

        _newInput.disable();      
        _inputs.push([_newInput]);

        var _removeInputButton = $('<span>').addClass('material-icons add-multimedia-input-button-delete').html('&#xE888');

        _container.append(_newInput.render(),  _removeInputButton);
        _inputAddedContainer.prepend(_container);
        _removeInputButton.on('click', function(){
          var _index = _inputs.indexOf([_newInput]);
          _inputs.splice(_index, 1);
          var _indexR = -1;
          _results.some(function(result, index){            
            if(result.email == _newInput.getVal()){           _indexR = index;
              return true;
            }
          });             
          if (_indexR > -1){ _results.splice(_indexR, 1);}
          _container.empty();
          $('#successBox-whiteList').empty();
        });
        return true;
      }
    }
    
    var _inputAddedContainer = $('<div>').css('margin-top','2.2rem');

    _addInputButton.on('click', function(){
      $('#successBox-whiteList').empty();
      if (_inputNameEmail.val()){
        var _data = _inputNameEmail.select2('data');
        var _info = {name_email: _data[0].text, email: _data[0].id};
        if (_addnewInput(_info, 'new-input-selected-whitelist')) _results.push(_info);
       _inputNameEmail.select2('val', '');
      }
    });

    _createdWidget.append(_inputContainer.append(_inputNameEmail),_inputAddedContainer);

    _inputNameEmail.select2({
      placeholder:'Email o Nombre de perfil',
      data: emailsNames,
      allowClear: true,
      // multiple: true,
      tags: true
      // tokenSeparators: [',', ' '],
      // maximumSelectionLength: 1
    });

    // _addInputButton.hide();

    _inputNameEmail.on('select2:select',function(){
      if (_inputNameEmail.select2('data')) _addInputButton.trigger('click');
    });

    _inputNameEmail.on('select2:open',function(){
      $('input.select2-search__field').val('');
      _inputNameEmail.val('val','');
      $('span.select2-search.select2-search--dropdown').click(function(){
        $('input.select2-search__field').focus();
      });
      setTimeout(function() {$('input.select2-search__field').focus()},500);
    });



    return {
      render: function(){
 
        return _createdWidget;
      },
      getVal: function(){
        return _results;
      },
      setVal: function(values){
        if(values == null || values == false) return true;
        // values.forEach(function(item){
        for (var item in values){  
          _addnewInput(values[item]);
          _results.push(values[item]);
        };
      }
    }
  }

}(Pard || {}));
