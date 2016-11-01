'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};


  ns.Widgets.ModifyProduction = function(production){

    var _caller = $('<button>').addClass('modify-content-button').attr({type: 'button'}).html(Pard.Widgets.IconManager('modify_section_content').render());
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Modifica tu proyecto artístico', function(){return Pard.Widgets.ModifyProductionMessage(production)});

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ModifyProductionMessage = function(production){

    if (production['links'] != false && production['links'] != null){
      var _array = Object.keys(production['links']).map(function(key){return production['links'][key]});
      production['links'] = _array;
    };

    var _createdWidget = $('<div>');
    var _formContainer = $('<form>').addClass('popup-form');
    var _initMex = $('<div>').append($('<p>').html(
        'Con este formularo puedes modificar el contenido de la página de tu proyecto artistico. Sin embargo, no se modificará ninguno de los datos que has enviado a convocatorias.'
      )).addClass('init-message-form');

    var _message = $('<div>').append($('<p>').html(
      'IMPORTANTE: Los cambios que hagas a través de este formulario no serán tomados en consideración por parte de la organización del festival.'
      )).addClass('final-message-form-modifyProduction');

    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');

    var user_id = Pard.ProfileManager.getUserId();
    var profile_id = Pard.ProfileManager.getProfileId(production.production_id);

    _submitForm['production_id'] = production.production_id;
    _submitForm['profile_id'] = profile_id;

    var _form = Pard.Forms.ModifyProductionForm(production['category']);
    var _requiredFields = _form.requiredFields();
    _form = _form.render();

    for(var field in _form){
      if(production[field] && field != 'photos') _form[field]['input'].setVal(production[field]);
    };
    _form['category'].input.disable();

    var _filled = function(){
      var _check = true;
      for (var field in _form){
        if ($.inArray(field, _requiredFields) >= 0){
          if(!(_form[field].input.getVal())) {
            if(field != 'links') _form[field].input.addWarning();
            _invalidInput.text('Por favor, revisa los campos obligatorios.');
            _message.css('color','black');
            _check = false;}
        }
      }
      if (_check) _invalidInput.empty();
      return _check;    
    };

    var _getVal = function(){
      for(var field in _form){
         _submitForm[field] = _form[field].input.getVal();

      };
      _submitForm['photos'] = production['photos'];
      return _submitForm;
    }

    var _send = function(){
      console.log(_getVal());
      Pard.Backend.modifyProduction(_getVal(), function(data){
        Pard.Events.ModifyProduction(data);
      });
    }
    
    var _fieldMod;

    for(var field in _form){
      if(field != 'links') {
         _fieldMod = $('<div>').addClass(field+'-modifyProduction').append(_form[field]['label'].render().append(_form[field]['input'].render()));
          if(field != 'category')  _fieldMod.addClass('field-modifyProduction');
        _formContainer.append(_fieldMod);
      }
    };

    var _closepopup = {};

    submitButton.on('click',function(){
        if (_filled()){
        _closepopup();
        _send();}
    });

    var _deleteProductionCaller = $('<a>').attr('href','#').text('Elimina este proyecto artístico').addClass('deleteProfile-caller');

    var _deleteProduction = Pard.Widgets.PopupCreator(_deleteProductionCaller, '¿Estás seguro/a?', function(){return Pard.Widgets.DeleteProductionMessage(production.production_id, _closepopup)});

    _createdWidget.append(_initMex, _formContainer, _message, _invalidInput, _submitBtnContainer.append(submitButton), _deleteProduction.render());

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }

  ns.Widgets.DeleteProductionMessage = function(production_id, closepoup){  
    
    var _createdWidget = $('<div>');
    var _message = $('<p>').text('Confirmando, tu proyecto artístico se eliminará de tu portfolio. Esa acción no afectará a tu inscripción en convocatorias. ');
    var _yesBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn confirm-delete-btn').text('Confirma');
    var _noBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn cancel-delete-btn').text('Anula');

    _yesBtn.click(function(){
      Pard.Backend.deleteProduction(production_id, Pard.Events.DeleteProduction);
        closepopup();
    });

    var _buttonsContainer = $('<div>').addClass('yes-no-button-container');

    _createdWidget.append(_message,  _buttonsContainer.append(_noBtn, _yesBtn));

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _noBtn.click(function(){
          callback();
        });
        _yesBtn.click(function(){
          callback()
        });
      }
    }
  }



 

}(Pard || {}));
