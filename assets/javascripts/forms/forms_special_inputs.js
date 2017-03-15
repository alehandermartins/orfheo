'use strict';

(function(ns){
  ns.Widgets = ns.Widgets || {};

  ns.Widgets.UploadPhotos = function(folder, maxNumPhotos){

    var _thumbnail = $('<div>');
    var _url = [];
    var _folder = folder;
    var _photos = Pard.Widgets.Cloudinary(folder, _thumbnail, _url, maxNumPhotos);
    var _photosContainer = $('<div>').append(_photos.render(), _thumbnail);

    return{
       render: function(){
        return _photosContainer;
      },
      getVal: function(){
        return _url;
      },
      setVal: function(photos){
        if (photos && photos != null){
          photos.forEach(function(photo){
            _url.push(photo);
            var _container = $('<span>');
            var _previousPhoto = $.cloudinary.image(photo,
              { format: 'jpg', width: 50, height: 50,
                crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
            _photosContainer.append(_previousPhoto);
            var _icon = $('<span>').addClass('material-icons').html('&#xE888').css({
              'position': 'relative',
              'bottom': '20px',
              'cursor': 'pointer'
            });

            _icon.on('click', function(){
              _url.splice(_url.indexOf(photo), 1);
              _photos.setUrl(_url);
              _container.empty();
            });

            _container.append(_previousPhoto, _icon);
            _thumbnail.append(_container);
          });
        }
      },
      getPhotos: function(){
        return _photos;
      }
    }
  }

  ns.Widgets.InputEmail = function(placeholder){

    var _checkInput = function(){
      if(_input.getVal() && !regEx.test(_input.getVal())){
        _input.addWarning();
        return false;
      }
      else{
        _input.removeWarning();
        return _input.getVal();
      }  
    }
    var _removeWarning = function(){
      _input.removeWarning();
    }

    var regEx = /[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;

    var _input = Pard.Widgets.Input(placeholder, 'text', _removeWarning,_checkInput);
    
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


  ns.Widgets.InputTelContactForm = function(placeholder){

    var checkPhone = function(){
      var okPattern = new RegExp (/\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*/);
      if(_inputTel.getVal()){
        var notPattern = new RegExp (/[a-z]/);
          if ((notPattern.test(_inputTel.getVal())) || !(okPattern.test(_inputTel.getVal()))) {_inputTel.addWarning(); return ''}
        return _inputTel.getVal();
      }
    }

    var _inputTel = Pard.Widgets.Input(placeholder, 'tel', function(){_inputTel.removeWarning()}, checkPhone);

    return{
      render: function(){
        return _inputTel.render();
      },
      getVal: function(){
        return _inputTel.getVal();
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

  ns.Widgets.InputTel = function(placeholder, showTel){

    var _phoneInput = $('<div>');

    var checkPhone = function(){
      var okPattern = new RegExp (/\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*\d\s*/);
      if(_inputTel.getVal()){
        var notPattern = new RegExp (/[a-z]/);
          if ((notPattern.test(_inputTel.getVal())) || !(okPattern.test(_inputTel.getVal()))) {
            _inputTel.addWarning(); 
            return ''
          }
        return {value: _inputTel.getVal(), visible: 'false' };
      }
      return '';
    }

    var _inputTel = Pard.Widgets.Input(placeholder, 'tel', function(){_inputTel.removeWarning()}, checkPhone);
    var _showTel = Pard.Widgets.CheckBox(Pard.t.text('widget.inputTel.show')) 


    return{
      render: function(){
        var _inputTelRendered = _inputTel.render();
        _phoneInput.append(
          _inputTelRendered
        );

        if (showTel === true){
          _phoneInput.append(_showTel.render().addClass('InputPhone-showTel'));
          _inputTelRendered.addClass('InputPhone-InputTel')
        }  
        return _phoneInput;
      },
      getVal: function(){
        if(!showTel){
          if(checkPhone()) {
            return { value: _inputTel.getVal(), visible: 'false'};
          }
          else {
            return false;
          }
        }
        else {
          return { value: _inputTel.getVal(), visible: _showTel.getVal()}
        }
      },
      setVal: function(phone){
        if(phone){
          _inputTel.setVal(phone.value);
          _showTel.setVal(phone.visible);
        }
      },
      addWarning: function(){
        _inputTel.addWarning();
      },
      removeWarning: function(){
        _inputTel.removeWarning();
      },
      setClass: function(_class){
        _inputTel.setClass(_class);
      },
      disable: function(){
        _inputTel.disable();
      },
      enable: function(){
        _inputTel.enable();
      }
    }
  } 

 
  ns.Widgets.InputCache = function(placeholder, showCache){

    var _cacheInput = $('<div>');

    var _inputCache = Pard.Widgets.Input(placeholder, 'text', function(){_inputCache.removeWarning()});
    var _showCache = Pard.Widgets.CheckBox(Pard.t.text('widget.inputCache.show')) 


    return{
      render: function(){
        _cacheInput.append(
          _inputCache.render().addClass('InputCache-InputCache')
        );
        if (showCache == true) _cacheInput.append(_showCache.render().addClass('InputCache-showCache'));
        return _cacheInput;
      },
      getVal: function(){
        if (showCache == true) {
          return { value: _inputCache.getVal(), visible: _showCache.getVal()}
        }
        else{
          return {value: _inputCache.getVal(), visible: 'false'}
        }
      },
      setVal: function(cache){
        if (cache){
          _inputCache.setVal(cache.value);
          _showCache.setVal(cache.visible);
        }
      },
      addWarning: function(){
        _inputCache.addWarning();
      },
      removeWarning: function(){
        _inputCache.removeWarning();
      },
      setClass: function(_class){
        _inputCache.setClass(_class);
      }
    }
  } 

  ns.Widgets.InputChildren = function(){

    var _values = [ 
      'all_public', 
      'baby', 
      'family', 
      'young', 
      'adults'
    ] ;
    var _labels = _values.map(function(val){
      return Pard.t.text('widget.inputChildren.'+val);
    }); 

    var _createdWidget = Pard.Widgets.Selector(_labels, _values);

    return {
      render: function(){
        return _createdWidget.render();
      },
      getVal: function(){
        return _createdWidget.getVal();
      },
      addWarning: function(){
        _createdWidget.addWarning();
      },
      removeWarning: function(){
        _createdWidget.removeWarning();
      },
      setVal: function(value){
        _createdWidget.setVal(value);
      },
      setClass: function(_class){
        _createdWidget.setClass(_class);
      },
      enable: function(){
        _createdWidget.enable();
      },
      disable: function(){
        _createdWidget.disable();
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

  ns.Widgets.MultipleSelector = function(values, callback){
    var _createdWidget = $('<div>');
    var _select = $('<select>').attr("multiple", "multiple");
    values.forEach(function(value, index){
      _select.append($('<option>').text(value).val(value));
    });
    _createdWidget.append(_select);
    _select.on('change',function(){
        _select.next().find('.ms-choice').removeClass('warning');
      if(callback) {
        var boundCallback = callback.bind(_select);
        boundCallback();
      };
    });
    var _options = {      
      placeholder: "Selecciona una o más opciones",
      selectAll: false,
      countSelected: false,
      allSelected: false
    };
    
    return {
      render: function(){
        _select.multipleSelect(_options);
        return _createdWidget;
      },
      setOptions: function(options){
        _options = options;
      },
      getVal: function(){
        return _select.val();
      },
      setVal: function(values){
        _select.multipleSelect('setSelects', values);
      },
      addWarning: function(){
        console.log('warning')
        _select.next().find('.ms-choice').addClass('warning');
      },
      removeWarning: function(){
        _select.next().find('.ms-choice').removeClass('warning');
      },
      setClass: function(_class){
        _createdWidget.addClass(_class);
      },
      deselectAll: function(){
        _select.multipleSelect("uncheckAll")
      },
      enable: function(){
        _select.attr('disabled',false);
      },
      disable: function(){
        _select.attr('disabled',true);
      }
    }
  }

 
  ns.Widgets.MultipleDaysSelector = function(millisecValues, callback){
    var _createdWidget = $('<div>');
    var _select = $('<select>').attr("multiple", "multiple");
    var _arrayDays = [];
    millisecValues.forEach(function(value){
      var _newDate = new Date(parseInt(value));
      var _day = moment(_newDate).locale(Pard.Options.language()).format('dddd DD/MM/YYYY');
      _select.append($('<option>').text(_day).val(value));
      _arrayDays.push(moment(_newDate).locale(Pard.Options.language()).format('YYYY-MM-DD'));
    });
    _createdWidget.append(_select);
    _select.on('change',function(){
        _select.next().find('.ms-choice').removeClass('warning');
      if(callback) {
        var boundCallback = callback.bind(_select);
        boundCallback();
      };
    });
    var _options={};

    return {
      render: function(){
        _select.multipleSelect(_options);
        return _createdWidget;
      },
      setOptions: function(options){
        _options = options;
      },
      getVal: function(){
        if(_select.val()) {
          var _daysArray = [];
          _select.val().forEach(function(val){
            _daysArray.push(moment(new Date(parseInt(val))).locale(Pard.Options.language()).format('YYYY-MM-DD'));
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
        _select.multipleSelect("setSelects", _values);
      },
      addWarning: function(){
        _select.next().find('.ms-choice').addClass('warning');
      },
      removeWarning: function(){
        _select.next().find('.ms-choice').removeClass('warning');
      },
      setClass: function(_class){
        _select.addClass(_class);
      },
      enable: function(){
        _select.attr('disabled',false);
      },
      disable: function(){
        _select.attr('disabled',true);
      }
    }
  }

  ns.Widgets.CategorySelector = function(categories){
    var catArrayTranslated;
    if ($.isArray(categories)){ 
      catArrayTranslated = categories.map(function(cat){
        return Pard.t.text('categories.'+cat);
      })
    }
    else{
      catArrayTranslated = [Pard.t.text('categories.'+categories)];
      categories = [categories];
    }
    var _createdWidget = Pard.Widgets.Selector(catArrayTranslated, categories)

    return {
      render: function(){
        return _createdWidget.render();
      },
      getVal: function(){
        return _createdWidget.getVal();
      },
      addWarning: function(){
        _createdWidget.addWarning();
      },
      removeWarning: function(){
        _createdWidget.removeWarning();
      },
      setVal: function(value){
        _createdWidget.setVal(value);
      },
      setClass: function(_class){
        _createdWidget.setClass(_class);
      },
      enable: function(){
        _createdWidget.enable();
      },
      disable: function(){
        _createdWidget.disable();
      }
    }
  }

  ns.Widgets.SubcategorySelector = function(catArray, type){
    var _translator = Pard.UserInfo['texts'].subcategories[type];
    var catArrayTranslated = catArray.map(function(subcat){
      return _translator[subcat];
    })
    var _createdWidget = Pard.Widgets.Selector(catArrayTranslated, catArray)
    return {
      render: function(){
        return _createdWidget.render();
      },
      getVal: function(){
        return _createdWidget.getVal();
      },
      addWarning: function(){
        _createdWidget.addWarning();
      },
      removeWarning: function(){
        _createdWidget.removeWarning();
      },
      setVal: function(value){
        _createdWidget.setVal(value);
      },
      setClass: function(_class){
        _createdWidget.setClass(_class);
      },
      enable: function(){
        _createdWidget.enable();
      },
      disable: function(){
        _createdWidget.disable();
      }
    }
  }


  ns.Widgets.InputColor = function(){

    var _createdWidget = $('<div>');

    var _colorPicker = $('<input>').attr({'type': 'text', 'value': '#000000'});

    _createdWidget.append(_colorPicker);

     _colorPicker.spectrum({
        chooseText: "OK",
        cancelText: "cancel",
        preferredFormat: "hex",
        move: function(color){
          _colorPicker.val(color);
        }
      });

   return{
      render: function(){
       
        return _createdWidget;
      },
      getVal: function(){
        return _colorPicker.spectrum('get').toHexString(); 
      },
      setVal: function(colorPicked){
        _colorPicker.spectrum({
          color: colorPicked
        });
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

    var _inputForm = {
      locality: Pard.Widgets.Input(Pard.t.text('widget.inputAddressArtist.city'),'text', function(){_inputForm.locality.removeWarning(); addressValue();}),
      postal_code: Pard.Widgets.Input(Pard.t.text('widget.inputAddressArtist.postalCode'),'text', function(){_inputForm.postal_code.removeWarning(); addressValue();}),
      neighborhood: Pard.Widgets.Input(Pard.t.text('widget.inputAddressArtist.neighborhood'), 'text', function(){
        addressValue();
      })
    }
  
    var _addressValues = {};
    var addressValue = function(){
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
        var uri = "https://maps.googleapis.com/maps/api/geocode/json?address="  + _addressValues.locality + '+' + _addressValues.postal_code + "&key=AIzaSyCimmihWSDJV09dkGVYeD60faKAebhYJXg";
        $.get(uri, function(data){
          if(data.status == "OK" && data.results.length > 0){
            _addressValues.location = data.results[0].geometry.location;
          }
          else{
            _addressValues.location ={};
          }
        });
      } 
      else {
        _addressValues = {};
      }
    }

    

    var _placeForm = $('<div>');
    for (var field in _inputForm){
      var _input = _inputForm[field].render();
      _placeForm.append($('<div>').append(_input).addClass(field+'-ArtistForm'));
    };

    return {
      render: function(){
        return _placeForm;
      },
      getVal: function(){
        var _artistAddress;
        if ($.isEmptyObject(_addressValues)) _artistAddress = false;
        else _artistAddress = _addressValues;
        return _artistAddress;
      },
      setVal: function(_val){
        for(var field in _inputForm) {
          _inputForm[field].setVal(_val[field]);
          _addressValues[field] = _val[field];
        }
        _addressValues['location'] = _val['location'];
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
      route: Pard.Widgets.Input(Pard.t.text('widget.inputAddressSpace.street'),'text', function(){_inputForm.route.removeWarning();}, function(){_checkLocation();}),
      street_number: Pard.Widgets.Input(Pard.t.text('widget.inputAddressSpace.number'), 'text', function(){_inputForm.street_number.removeWarning();}, function(){_checkLocation();}),
      door: Pard.Widgets.Input(Pard.t.text('widget.inputAddressSpace.door'), 'text', function(){_inputForm.door.removeWarning();}, function(){_checkLocation();}),
      locality: Pard.Widgets.Input(Pard.t.text('widget.inputAddressSpace.city'),'text', function(){_inputForm.locality.removeWarning();}, function(){_checkLocation();}),
      country: Pard.Widgets.Input(Pard.t.text('widget.inputAddressSpace.state'),'text', function(){_inputForm.country.removeWarning();}, function(){_checkLocation();}),
      postal_code: Pard.Widgets.Input(Pard.t.text('widget.inputAddressSpace.postalCode'),'text', function(){_inputForm.postal_code.removeWarning();}, function(){_checkLocation();} )
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
      _inputPlace.on('focusout', function(){
        _checkLocation();
      });  
    });

    var FillInAddress = function(autocomplete, _inputForm) {
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
      _checkLocation();
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
      });
      if (_check){
        if(_geocod) _addressValues['location'] = _geocod;
        return _addressValues;
      }
      else{
        return _check;
      }
    }
 
    var _placeForm = $('<div>').append(_inputPlace);
    for (var key in _inputForm){_placeForm.append(_inputForm[key].render().attr({disabled: 'true'}))};

    var _mapCheckContainer = $('<div>').css({'margin-bottom':'-2.5rem'});
    // var _seeMapText = $('<a>').text('Comprueba la localización en el mapa').attr('href','#');         
    var _map = $('<div>').attr('id', 'gmapProfile');
    var _errorBox = $('<div>');
    var _geocodCont = $('<div>').addClass('geocod-container-adrees-imput');
    var _mapBox = $('<div>').append(_map, _geocodCont);
    // _mapCheckContainer.append($('<div>').append(_seeMapText).css({'text-align':'right','font-size':'0.8125rem', 'margin-top':'0.4rem'}), _errorBox, _mapBox);
    _mapCheckContainer.append(_errorBox, _mapBox);
    var geomap;
    var _geocod;
    var _check = true;
    var _latField = Pard.Widgets.Input('','text');
    var _lonField = Pard.Widgets.Input('','text');
    var _hereBtn = $('<a>').text(Pard.t.text('widget.inputAddressSpace.insertGeoBtn')).attr('href','#/');

    var _checkLocation = function(location){
      _errorBox.empty()
      var _addressInserted = addressValue();
      if (_addressInserted){
        var _spinnerCheckLocation = new Spinner();
        _spinnerCheckLocation.spin();
        $('body').append(_spinnerCheckLocation.el);
        var uri = Pard.Widgets.RemoveAccents("https://maps.googleapis.com/maps/api/geocode/json?address=" + _addressInserted.route + "+" + _addressInserted.street_number + "+" + _addressInserted.locality + "+" + _addressInserted.postal_code + "&key=AIzaSyCimmihWSDJV09dkGVYeD60faKAebhYJXg");
        var _location;
        $.post(uri, function(data){
          if(data.status == "OK" && data.results.length > 0){
            _geocod = data.results[0].geometry.location;
            _displayMap(_geocod);
          }
          else{
            _errorBox.append($('<p>').text(Pard.t.text('widget.inputAddressSpace.warning')).css({
              'color':'red',
              'margin-bottom':'0'
            }));
            if (_latField && _lonField) {
              _latField.setVal('');
              _lonField.setVal('');
              _hereBtn.trigger('click');
            }          
          }
          _spinnerCheckLocation.stop();
          _addressInserted['location'] = _geocod;
          return _addressInserted;
        });
      }
      else{
        return _addressInserted;
      }
    }

    _placeForm.append(_mapCheckContainer);

    _inputPlace.on('focus', function(){
      if ($('.reveal[aria-hidden="false"]').html() && $(window).width()<1024){
        var _distanceInputTop = _inputPlace.offset().top;
        // var _scroolTop = $('.reveal[aria-hidden="false"]').scrollTop();
        var _popupOpened = _inputPlace.closest('.reveal[aria-hidden="false"]');
        var _scroolTop = _popupOpened.scrollTop();
        var _distanceToDo = _distanceInputTop + _scroolTop - 120; 
        _popupOpened.scrollTop(_distanceToDo);
        // $('.reveal[aria-hidden="false"]').scrollTop(_distanceToDo);
      }
    });

    var _displayMap = function(location){
      _geocod = location;
      if (location){ 
        _map.addClass('map-inputAddressWidgets');
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
          var _latLabel = $('<label>').text(Pard.t.text('dictionary.latitude').capitalize()).append(_latField.render());
          var _lonLabel = $('<label>').text(Pard.t.text('dictionary.longitude').capitalize()).append(_lonField.render());
          var _geoCodText = $('<p>').append(Pard.t.text('widget.inputAddressSpace.insertGeo'), _hereBtn,'.').css({'font-size':'0.875rem','margin-top':'0.4rem'});
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
        _errorBox.append($('<p>').text(Pard.t.text('widget.inputAddressSpace.warning')).css({
          'color':'red',
          'margin-bottom':'0'
        }));
        if (_latField && _lonField) {
          _latField.setVal('');
          _lonField.setVal('');
          _hereBtn.trigger('click');
        }          
      }
    }

    return {
      render: function(){
        return _placeForm;
      },
      getVal: function(){
        // if (!(_geocod)) var _addressSubmitted = _checkLocation();
        var _addressSubmitted = addressValue();
        return _addressSubmitted;
      },
      setVal: function(_val){
        for(var field in _inputForm) {
          _inputForm[field].setAttr('disabled', false);
          _inputForm[field].setVal(_val[field]);
        }
       setTimeout(function(){
          var _location;
          _check = true; 
          _displayMap(_val.location);
        }, 500)
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
    var _input = Pard.Widgets.Input(Pard.t.text('widget.inputWeb.placeholder'),'url',function(){
      _addInputButton.addClass('add-input-button-enlighted')
    });
    _input.setClass('add-multimedia-input-field');
    var _addInputButton = $('<span>').addClass('material-icons add-multimedia-input-button').html('&#xE86C');

    var _addnewInput = function(url){
      var _container = $('<div>');
      var _newInput = Pard.Widgets.Input(Pard.t.text('widget.inputWeb.placeholder'),'url');
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
    var _input = Pard.Widgets.Input(Pard.t.text('widget.inputMultimedia.placeholder'),'url', function(){
      _addInputButton.addClass('add-input-button-enlighted');
      _invalidInput.empty();
    });
    _input.setClass('add-multimedia-input-field');
    var _addInputButton = $('<span>').addClass('material-icons add-multimedia-input-button').html('&#xE86C');

    var _addnewInput = function(url){
      var _container = $('<div>');
      var _newInput = Pard.Widgets.Input(Pard.t.text('widget.inputMultimedia.placeholder'),'url');
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
      _invalidInput.append($('<p>').text(Pard.t.text('widget.inputMultimedia.invalid')).addClass('error-multimedia-text'));
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

  ns.Widgets.InputName = function(){

    var _createdWidget = $('<div>');
    var _input = $('<input>').attr({'type': 'text'});
    var _error = $('<div>').append($('<p>').text(Pard.t.text('widget.inputName.unavailable'))
        .css({
        'color':'red',
        'font-size':'12px',
        'line-height':'.9rem'
      }))
      .css({
        'margin-bottom':'-.8rem',
      })
      .hide();

    _input.on('input', function(){
      Pard.Backend.checkName(_input.val(), function(data){
        _input.removeClass('warning');
        _input.removeClass('available');
        _error.hide();
        if(data.available == false) {
          _input.addClass('warning');
          _error.show();
        };
        if(data.available == true) {
          _input.addClass('available');
          _error.hide();
        }
      })
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

    _createdWidget.append(_input, _error);

    return{
      render: function(){
        return _createdWidget;
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
      },
      enable: function(){
        _input.prop('disabled', false);
      }
    }
  }


}(Pard || {}));
