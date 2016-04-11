'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};


  ns.Widgets.ModifyProduction = function(proposal){

    var _caller = $('<button>').addClass('modify-content-button').attr({type: 'button'}).html(Pard.Widgets.IconManager('modify_section_content').render());
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Modifica tu proyecto artístico', function(){return Pard.Widgets.ModifyProductionMessage(proposal)});

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ModifyProductionMessage = function(proposal){

    if (proposal['links'] != false && proposal['links'] != null){
      var _array = Object.keys(proposal['links']).map(function(key){return proposal['links'][key]});
      proposal['links'] = _array;
    };

    var _createdWidget = $('<div>');
    var _formContainer = $('<form>').addClass('popup-form');
    var _initMex = $('<div>').append($('<p>').html(
        'Con ese formularo puedes modificar el contenido de la página de tu proyecto artistico. Sin embargo, no se modificará ninguno de los datos que has enviado a la convocatoria del Benimaclet conFusión festival.'
      )).addClass('init-message-form');

    var _message = $('<div>').append($('<p>').html(
      'IMPORTANTE: Los cambios que haces a través de este formulario no serán tomados en consideración por parte de la organización del festival.'
      )).addClass('final-message-form');

    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');

    var user_id = Pard.ProfileManager.getUserId();
    var profile_id = Pard.ProfileManager.getProfileId(proposal.proposal_id);

    _submitForm['proposal_id'] = proposal.proposal_id;
    _submitForm['profile_id'] = profile_id;

    var _form = Pard.Forms.ModifyProductionForm(proposal['category']);
    var _requiredFields = _form.requiredFields();
    _form = _form.render();

    for(var field in _form){
      if(proposal[field] && field != 'photos') _form[field]['input'].setVal(proposal[field]);
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
      _submitForm['photos'] = proposal['photos'];
      return _submitForm;
    }

    var _send = function(){
      Pard.Backend.modifyProduction(_getVal(), function(data){
        Pard.Events.ModifyProduction(data);
      });
    }
    
    for(var field in _form){
      if(field != 'links') _formContainer.append($('<div>').addClass(field+'-modifyProduction').append(_form[field]['label'].render().append(_form[field]['input'].render())));
    };

    var _closepopup = {};

    submitButton.on('click',function(){
        if (_filled()){
        _closepopup();
        _send();}
    });

    _createdWidget.append(_initMex, _formContainer, _message, _invalidInput, _submitBtnContainer.append(submitButton));

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }



 

}(Pard || {}));
