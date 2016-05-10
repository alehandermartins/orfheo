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
    var tw_url = /^(http|https)\:\/\/twitter\.com\/.*/i;
    var yt_url = /^(http|https)\:\/\/www\.youtube\.*/i;
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

  ns.Widgets.InputArtistProgram = function(places, dayTimeObj){

    var _createdWidget = $('<div>'); 
    var _modified = false;
    var _results = [];
    var _inputs = [];
    // var _inputSpace = Pard.Widgets.Input('Espacio','text');
    var _inputSpace = $('<select>');
    var _inputDayTime = $('<select>');

    var _dtArray = dayTimeObj.dtArray;
    var _dayTime = dayTimeObj.dayTime;

    var _addInputButton = $('<span>').addClass('material-icons add-multimedia-input-button').html('&#xE86C');
    _addInputButton.addClass('add-input-button-enlighted')

    var _addnewInput = function(showInfo){
      var _container = $('<div>');
      var _newInputSpace = Pard.Widgets.Input('Espacio','text');
      var _newInputDayTime = Pard.Widgets.Input('Horario','text');
      _newInputDayTime.setClass('add-multimedia-input-field');
      _newInputSpace.setClass('add-multimedia-input-field');
      _newInputSpace.setVal(showInfo['place']);
      if (showInfo['day_time'] == 'both') {_newInputDayTime.setVal('A lo largo de los dos días');}
      else { _newInputDayTime.setVal(moment(showInfo['day_time']).format('dddd, h:mm')+"h")};
      _newInputSpace.setAttr('disabled', true);
      _newInputDayTime.setAttr('disabled', true);
      _inputs.push([_newInputSpace,_newInputDayTime]);

      var _removeInputButton = $('<span>').addClass('material-icons add-multimedia-input-button-delete').html('&#xE888');

      _container.append(_newInputSpace.render(), _newInputDayTime.render(), _removeInputButton);
      _removeInputButton.on('click', function(){
        _modified = true;
        var _index = _inputs.indexOf([_newInputSpace,_newInputDayTime]);
        _inputs.splice(_index, 1);
        _results.splice(_index, 1);
        _container.empty();
      });
      return _container;
    }
    
    var _showsAddedContainer = $('<div>');

    _addInputButton.on('click', function(){
      _modified = true;
      if (_inputSpace.val() && _inputDayTime.val()){
        if (_inputDayTime.val() == 'both'){
        var _show = {place: _inputSpace.val(), day_time: _dtArray[_inputDayTime.val()]}}
        else {
        var _show = {place: _inputSpace.val(), day_time: _dtArray[_inputDayTime.val()]};
        }
        _showsAddedContainer.prepend(_addnewInput(_show));
        _inputSpace.select2('val', '');
        _inputDayTime.select2('val', '');
        _results.push(_show);
      }
      else{
        if (!(_inputSpace.val())) {_inputSpace.addClass('warning');}
        else if (!(_inputDayTime.val())) {_inputDayTime.addClass('warning');}
      }
    });

    _createdWidget.append(_inputSpace, _inputDayTime, _addInputButton,_showsAddedContainer);

    // _inputSpace.select2({
    //     allowClear: true,
    //     data: places,
    //     multiple:true,
    //     maximumSelectionLength: 1,
    //     placeholder: 'Espacio'
    // });

    // _inputDayTime.select2({
    //     allowClear: true,
    //     data: _dayTime,
    //     multiple:true,
    //     maximumSelectionLength: 1,
    //     placeholder: 'Día y hora'
    // });

    return {
      render: function(){
        _inputSpace.select2({
          // allowClear: true,
          data: places,
          multiple:true,
          maximumSelectionLength: 1,
          placeholder: 'Espacio'
        });

        _inputDayTime.select2({
          // allowClear: true,
          data: _dayTime,
          multiple:true,
          maximumSelectionLength: 1,
          placeholder: 'Día y hora'
        });
        return _createdWidget;
      },
      getVal: function(){
        return _results;
      },
      setVal: function(values){
        if(values == null || values == false) return true;
        var _shows = [];
        Object.keys(values).forEach(function(key){
          _shows.push(values[key]);
        });
        _shows.forEach(function(show, index){
          _results.push(show);
          _showsAddedContainer.prepend(_addnewInput(show));
        });
      },
      modifiedCheck: function(){
        return _modified;
      },
      resetModifiedCheck: function(){
        _modified = false;
      }
    }
  }


  ns.Widgets.InputSpaceProgram = function(artists, dayTimeObj, programs){

    var _createdWidget = $('<div>'); 
    var _modified = false;
    var _results = [];
    var _inputs = [];
    // var _inputSpace = Pard.Widgets.Input('Espacio','text');
    var _inputArtist = $('<select>');
    var _inputDayTime = $('<select>');

    var _dtArray = dayTimeObj.dtArray;
    var _dayTime = dayTimeObj.dayTime;

    var _addInputButton = $('<span>').addClass('material-icons add-multimedia-input-button').html('&#xE86C');
    _addInputButton.addClass('add-input-button-enlighted')

    var _addnewInput = function(showInfo){
      var _container = $('<div>');
      var _newInputArtist = Pard.Widgets.Input('Artista','text');
      var _newInputDayTime = Pard.Widgets.Input('Horario','text');
      _newInputDayTime.setClass('add-multimedia-input-field');
      _newInputArtist.setClass('add-multimedia-input-field');
      artists.some(function(artist){
        if (artist['id'] == showInfo['proposal_id']) _newInputArtist.setVal(artist['text']);
      });
      if (showInfo['day_time'] == 'both') {_newInputDayTime.setVal('A lo largo de los dos días');}
      else { _newInputDayTime.setVal(moment(showInfo['day_time']).format('dddd, h:mm')+"h")};
      _newInputArtist.setAttr('disabled', true);
      _newInputDayTime.setAttr('disabled', true);
      _inputs.push([_newInputArtist,_newInputDayTime]);

      var _removeInputButton = $('<span>').addClass('material-icons add-multimedia-input-button-delete').html('&#xE888');

      _container.append(_newInputArtist.render(), _newInputDayTime.render(), _removeInputButton);
      _removeInputButton.on('click', function(){
        _modified = true;
        var _index = _inputs.indexOf([_newInputArtist,_newInputDayTime]);
        _inputs.splice(_index, 1);
        _results.splice(_index, 1);
        _container.empty();
      });
      return _container;
    }
    
    var _showsAddedContainer = $('<div>');

    _addInputButton.on('click', function(){
      _modified = true;
      if (_inputArtist.val() && _inputDayTime.val()){
        if (_inputDayTime.val() == 'both'){
        var _show = {proposal_id: _inputArtist.val(), day_time: _dtArray[_inputDayTime.val()]}}
        else {
        var _show = {proposal_id: _inputArtist.val(), day_time: _dtArray[_inputDayTime.val()]};
        }
        _showsAddedContainer.prepend(_addnewInput(_show));
        _inputArtist.select2('val', '');
        _inputDayTime.select2('val', '');
        _results.push(_show);
      }
      else{
        if (!(_inputArtist.val())) {_inputArtist.addClass('warning');}
        else if (!(_inputDayTime.val())) {_inputDayTime.addClass('warning');}
      }
    });

    _createdWidget.append(_inputArtist, _inputDayTime, _addInputButton,_showsAddedContainer);

    return {
      render: function(){
        _inputArtist.select2({
          // allowClear: true,
          data: artists,
          multiple:true,
          maximumSelectionLength: 1,
          placeholder: 'Artista'
        });

        _inputDayTime.select2({
          // allowClear: true,
          data: _dayTime,
          multiple:true,
          maximumSelectionLength: 1,
          placeholder: 'Día y hora'
        });
        return _createdWidget;
      },
      getVal: function(){
        return _results;
      },
      setVal: function(values){
        if(values == null || values == false) return true;
        var _shows = [];
        Object.keys(values).forEach(function(key){
          _shows.push(values[key]);
        });
        _shows.forEach(function(show){
          _results.push(show);
          _showsAddedContainer.prepend(_addnewInput(show));
        });
      },
      modifiedCheck: function(){
        return _modified;
      },
      resetModifiedCheck: function(){
        _modified = false;
      }
    }
  }

}(Pard || {}));
