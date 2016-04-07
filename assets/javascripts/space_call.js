'use strict';

(function(ns){



  ns.Widgets.CallSpaceButton = function(profile, label){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).text(label);
    var _submitBtn = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Envía');
    var _popup = Pard.Widgets.PopupCreator(_caller, '', function(){return Pard.Widgets.CallMessageSpace(profile, _submitBtn)});

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.CallMessageSpace= function(profile, submitButton){

    var _createdWidget = $('<div>');
    var _message = $('<div>').html(
      '<h4 style="font-weight:600; margin: -1rem 0 1rem 0;">conFusión 2016</h4> Los datos de este formulario nunca serán públicos y podrán ser consutados solo por parte de la organización del festival.'
      ).addClass('message-form');
    var _formContainer = $('<form>').addClass('popup-form');
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');

    _submitForm['call_id'] = 'b5bc4203-9379-4de0-856a-55e1e5f3fac6';
    _submitForm['profile_id'] = profile.profile_id;
    _submitForm['type'] = profile.type;
    _submitForm['category'] = profile.category;

    var _form = Pard.Forms.SpaceCall().render();
    var _requiredFields = Pard.Forms.SpaceCall().requiredFields();

    for(var field in _form){
      _formContainer.append($('<div>').addClass(field+'-SpaceCall').append(_form[field].label.render().append(_form[field].input.render()),_form[field].helptext.render()));
    }

    _formContainer.append(_invalidInput, _submitBtnContainer.append(submitButton));

    var _filled = function(){
      var _check = _form['conditions'].input.getVal();
      for(var field in _form){
        if ($.inArray(field, _requiredFields) >= 0 ){
          if(!(_form[field].input.getVal())) {
            _form[field].input.addWarning();
            _invalidInput.text('Por favor, revisa los campos obligatorios.');
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
      return _submitForm;
    }

    _createdWidget.append(_message, _formContainer);

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        submitButton.on('click',function(){
          if(_filled() == true){ 
            Pard.Backend.sendProposal(_getVal(), Pard.Events.SendProposal); 
            callback();
          }
        })
      }
    }
  }


  ns.Widgets.MySpaceCallProposals = function(callProposals){
    
    var _createdWidget = $('<div>');

    var _callName = $('<p>').append('Inscrito en ',$('<span>').text('Benimaclet conFusión festival 2016').css({'font-weight': 'bold'})).addClass('activities-box-call-name');

    var _listProposals = $('<ul>');

    callProposals.forEach(function(proposal){
      var _caller = $('<a>').attr({href:'#'}).text('Formulario enviado');
      
      var _proposalItem = $('<li>').append( Pard.Widgets.PopupCreator(_caller, 'conFusión 2016', function(){ return Pard.Widgets.MySpaceCallProposalMessage(proposal);
        }).render());
      _listProposals.append(_proposalItem);
        
    });

    _createdWidget.append(_callName, _listProposals);
   
    return {
      render: function(){
        return _createdWidget;
      }
    }
  };


  ns.Widgets.MySpaceCallProposalMessage = function(proposal){
    
    var _createdWidget = $('<div>');
  
    var _form = Pard.Forms.SpaceCall().render();

    var profile = Pard.ProfileManager.getProfile(proposal.profile_id);
                                    
    // for(var field in _form){
    //   if(proposal[field]) _form[field].input.setVal(proposal[field]);
    // };

    var _message = $('<div>').append($('<p>').text('Propuesta enviada por '+profile['name']+'.'))
    // , $('<p>').text('Formulario enviado para la convocatoria del Benimaclet conFusión festival 2016'));

    _createdWidget.append(_message);

    var _fieldFormLabel, _fieldForm, _textLabel;

    for(var field in _form){
      if (field != 'conditions' && field!='availability'){
        _textLabel = _form[field]['label'].render().text();
        if (_textLabel.indexOf('*')>0) _textLabel = _textLabel.replace(' *','');
        _fieldFormLabel = $('<span>').text(_textLabel+': ')
        _fieldFormLabel.addClass('myProposals-field-label');
        _fieldForm = $('<div>').append($('<p>').append(_fieldFormLabel, proposal[field]));
        _createdWidget.append(_fieldForm);
      }
      if (field == 'availability'){
        _textLabel = _form[field]['label'].render().text();
        if (_textLabel.indexOf('*')>0) _textLabel = _textLabel.replace(' *','');
        _fieldFormLabel = $('<span>').text(_textLabel+': ');
        _fieldFormLabel.addClass('myProposals-field-label');
        var _availability ='';
        _fieldForm = $('<div>').append(_fieldFormLabel);
        var _dayList = $('<ul>');
        for (var day in proposal[field]) {
          _availability = $('<li>').text(Pard.Widgets.AvailabilityDictionary(proposal[field][day]));
          _dayList.append(_availability.addClass('avilability-info-text'));
        }
        _fieldForm.append(_dayList);
        _createdWidget.append(_fieldForm);
      }
    }

    _createdWidget.append($('<p>').append('Has aceptado las condiciones en las ', Pard.Forms.Conditions().link(), ' del Benimaclet conFusión festival.')) 
    

      //  for(var field in _form){
      //   _createdWidget.append(_form[field]['label'].render().append(_form[field]['input'].render()), _form[field]['helptext'].render());
      // };



    var _postData = $('<div>').addClass('postData-container');
    var _postDataLabel = $('<p>').addClass('myProposals-field-label').text('No se permite modificar el formulario enviado, pero, en caso lo necesites, puedes enviar una enmienda antes del cierre de la convocatoria.');
    var _textArea = $('<textarea>').attr('rows', 4);
    var _sendButton = $('<button>').attr({type: 'button'}).addClass('send-post-data-btn').text('Envía');

    _textArea.on('input', function(){$(this).removeClass('warning')});

    _sendButton.click(function(){
      if (_textArea.val()) console.log('send');
      else _textArea.attr({placeholder: 'Escribe aquí el mensaje que quieres enviar'}).addClass('warning');
    });

    var _finalMessage = $('<p>').append('Para cualquier duda o necesidad no te olvides que el equipo de organización del festival está siempre a tu disposición y puedes contactarlo escribiendo a <a href="mailto:contacta@beniconfusionfest.es" target="_top">contacta@beniconfusionfest.es</a>.').addClass('myproposal-final-message');

    _postData.append(_postDataLabel, _textArea, _sendButton);

    _createdWidget.append(_postData, _finalMessage);

    // var _closeBtn = Pard.Widgets.Button('Cierra').render().addClass('pard-btn').css('font-size':'14px');
    // _createdWidget.append(_closeBtn);


    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        // _closeBtn.on('click', function(){ 
        //   callback(); 
        // })
      }
    }
  }


  ns.Widgets.AvailabilityDictionary = function(day){ 
  console.log(day.indexOf('Sat')); 
    if (day.indexOf('Sat') == 0) return 'Sabado 15 de Octubre';
    if (day.indexOf('Sun') == 0) return 'Domingo 16 de Octubre';
  }



}(Pard || {}));

