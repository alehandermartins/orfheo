'use strict';

(function(ns){
  ns.Widgets = ns.Widgets || {};

  ns.Widgets.PrintForm = function(form, submitButton){

    var _submitForm = {};
    var _form = {};
    var _url = [];
    var _formContainer = $('<form>').addClass('popup-form');
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');

    var _closepopup = {};
    var _send = function(){};
    var spinner =  new Spinner()

    for(var field in form){
      _form[field] = {};
      _form[field]['type'] = form[field].type;
      if(form[field]['type'] == 'mandatory') _form[field]['label'] = Pard.Widgets.InputLabel(form[field].label+' *');
      else _form[field]['label'] = Pard.Widgets.InputLabel(form[field].label);
      if (form[field]['input']=='CheckBox') {
        form[field].args[0] = form[field].label;
        if (form[field]['type'] == 'mandatory') form[field].args[0] += ' *';
      }
      _form[field]['input'] = window['Pard']['Widgets'][form[field].input].apply(this, form[field].args);
      _form[field]['helptext'] = Pard.Widgets.HelpText(form[field].helptext);

      if (field == 'photos' || field == 'profile_picture'){
        var _thumbnail = $('<div>');
        var _photosLabel = $('<label>').text(form[field].label);
        var _photoWidget = _form[field].input
        var _photos = _photoWidget.getPhotos();
        var _photosContainer = _photoWidget.render().prepend(_photosLabel).css({'margin-bottom':'-1rem'}).addClass('photoContainer');
        if (form[field].helptext) _photosContainer.append(_form[field].helptext.render());
        _photos.cloudinary().bind('cloudinarydone', function(e, data){
          var _url = _photoWidget.getVal();
          console.log(_url);
          _url.push(data['result']['public_id']);
          if(_url.length >= _photos.dataLength()) _send();
        });
      _formContainer.append(_photosContainer);
      }
      else if (form[field].input == 'TextAreaCounter'){
        _formContainer.append(
           $('<div>').addClass(form[field].input + '-FormField' + ' call-form-field '+field+'-FormDiv').append(
              _form[field].label.render(),_form[field].input.render()
            )
        );
      }
      else if (form[field].input == 'CheckBox'){
        var _genericField = $('<div>');
        _formContainer.append(
           _genericField.addClass(form[field].input + '-FormField' + ' call-form-field '+field+'-FormDiv').append(_form[field].input.render()));
        if (form[field]['helptext'].length) {
          var _helptextfield = _form[field].helptext.render();
          _helptextfield.css({'margin-top':'0'});
          _genericField.append(_helptextfield);
        }
      }
      else{
        var _genericField = $('<div>');
        _formContainer.append(
        _genericField.addClass(form[field].input + '-FormField' + ' call-form-field '+field+'-FormDiv').append(
          _form[field].label.render(),
          _form[field].input.render())
        )
        if (form[field]['helptext'].length) _genericField.append(_form[field].helptext.render());
        if(form[field]['input'] == 'MultipleSelector'){
          if (field == 'availability'){
            _form[field].input.render().multipleSelect({      placeholder: "Selecciona una o más opciones",
              selectAllText: "Selecciona todo",
              countSelected: false,
              allSelected: "Disponible todos los días"
            });
          }
          else{
            _form[field].input.render().multipleSelect({      placeholder: "Selecciona una o más opciones",
              selectAll: false,
              countSelected: false,
              allSelected: false
            });
          }
          _form[field].helptext.render().css('margin-top', 5);
        }
      }
    }

    var _filled = function(){
      var _check = true;
      for(var field in _form){
        if(_form[field].type == 'mandatory' && !(_form[field].input.getVal())){
          _form[field].input.addWarning();
          _invalidInput.text('Por favor, revisa los campos obligatorios.');
          _check = false;
        }
      } 
      return _check;
    }

    submitButton.on('click',function(){
      spinner.spin();
      $.wait(
        '',
        function(){ 
          $('body').append(spinner.el);
          submitButton.attr('disabled',true);
          if(_filled() == true){
            if(_photos.dataLength() == false) _send();
            else{
              _photos.submit();
            }
          }
        },
        function(){
          setTimeout(
            function(){
              submitButton.attr('disabled',false);
              spinner.stop(); 
            }, 
            1000
          );
        }
      )
    });
    
    _submitBtnContainer.append(submitButton);
    _formContainer.append(_invalidInput, _submitBtnContainer);

    return {
      render: function(){
        return _formContainer;
      },
      Spinner: function(){
        return spinner;
      },
      setSend: function(send){
        _send = send
      },
      setCallback: function(callback){
        _closepopup = callback;
      },
      getVal: function(){
      for(var field in _form){
         _submitForm[field] = _form[field].input.getVal();
      }
      return _submitForm;
      },
      setVal: function(production){
        for(var field in production){
          if (_form[field]) _form[field].input.setVal(production[field]);
        }
      }
    }
  }

  
  ns.Widgets.AlertNoMapLocation = function(formVal,closepopup,callback){
    var _createdWidget = $('<div>');
    var _text = $('<p>').text('Google no reconoce la dirección que has insertado y por lo tanto no puede ser localizada en ningún mapa.')
    var _goAnywayBtn = Pard.Widgets.Button('Continua igualmente', function(){
      closepopup();
      callback();
    });
    var _tryAgainBtn = Pard.Widgets.Button('Corrige la dirección', function(){
      closepopup();
    });

    var buttonsContainer = $('<div>').addClass('buttons-noMapPopup')
    _createdWidget.append(_text, buttonsContainer.append(_goAnywayBtn.render(), _tryAgainBtn.render()));
    return{
      render: function(){
        return  _createdWidget;
      },
      setCallback: function(){
        // callback();
      }
    }
  }

  
}(Pard || {}));
