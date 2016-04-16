'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {}; 

 ns.Widgets.PrintSentCall = function(proposal, _form, closepopup){

  console.log(proposal)

    var _createdWidget = $('<div>');

    var profile = Pard.ProfileManager.getProfile(proposal.profile_id);


    var _nameLabel = $('<span>').addClass('myProposals-field-label').text('Propuesta enviada por:');
    var _nameText = $('<span>').text(' ' + profile['name']);
    var _name = $('<div>').append($('<p>').append(_nameLabel, _nameText))
    // , $('<p>').text('Formulario enviado para la convocatoria del Benimaclet conFusión festival 2016'));

    _createdWidget.append(_name);

    var _fieldFormLabel, _fieldForm, _textLabel, _proposalField, _fieldFormText;

    if(proposal['category']){
      _textLabel = 'Categoría:';
      _fieldFormLabel = $('<span>').text(_textLabel).addClass('myProposals-field-label');
      _fieldFormText = $('<span>').text(' ' + Pard.Widgets.Dictionary(proposal['category']).render());
      _fieldForm = $('<div>').append($('<p>').append(_fieldFormLabel, _fieldFormText));
      _createdWidget.append(_fieldForm);
    }
    if(profile['address']){
      _textLabel = 'Dirección:';
      _fieldFormLabel = $('<span>').text(_textLabel).addClass('myProposals-field-label');
      var _fieldFormText = $('<span>').append(' ', profile['address']['route'],' ',profile['address']['street_number']);
      if (profile['door']) _fieldFormText.append(', puerta/piso '+profile['door']);
      _fieldFormText.append(', '+profile['address']['locality']);

      _fieldForm = $('<div>').append($('<p>').append(_fieldFormLabel, _fieldFormText));
      _createdWidget.append(_fieldForm);
    }

    for(var field in _form){
      if ($.inArray(field, ['conditions','availability', 'children', 'repeat', 'waiting_list', 'links']) == -1){
        _textLabel = _form[field]['label'].render().text();
        if (_textLabel.indexOf('*')>0) _textLabel = _textLabel.replace(' *','');
        _proposalField = proposal[field];
        _fieldFormLabel = $('<span>').text(_textLabel+':').addClass('myProposals-field-label');
        if ($.inArray(field, ['duration', 'phone', 'components']) == -1) {_fieldFormLabel.css('display', 'block');}       
        if (field == 'duration') _proposalField = ' '+_proposalField+ ' min';
        if (field == 'phone' || field == 'components') _proposalField = ' '+_proposalField;
        _fieldForm = $('<div>').append($('<p>').append(_fieldFormLabel, _proposalField));
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
      if (field == 'children'){
        var _check = ' Sí';
        if (!(proposal[field]) || proposal[field] == 'false') _check = ' No'; 
        _textLabel = 'Actividad para niños:';
        _fieldFormLabel = $('<span>').text(_textLabel)
        _fieldFormLabel.addClass('myProposals-field-label');
        _fieldForm = $('<div>').append($('<p>').append(_fieldFormLabel, _check));
        _createdWidget.append(_fieldForm);
      }
      if (field == 'repeat'){
        var _check = ' Sí';
        if (!(proposal[field]) || proposal[field] == 'false') _check = ' No'; 
        _textLabel = 'Si posible, quiero repetir mi actuacción:';
        _fieldFormLabel = $('<span>').text(_textLabel)
        _fieldFormLabel.addClass('myProposals-field-label');
        _fieldForm = $('<div>').append($('<p>').append(_fieldFormLabel, _check));
        _createdWidget.append(_fieldForm);
      }
      if (field == 'waiting_list'){
        var _check = ' Sí';
        if (!(proposal[field]) || proposal[field] == 'false') _check = ' No'; 
        _textLabel = 'En la eventualidad, quiero quedarme en la lista de espera:';
        _fieldFormLabel = $('<span>').text(_textLabel)
        _fieldFormLabel.addClass('myProposals-field-label');
        _fieldForm = $('<div>').append($('<p>').append(_fieldFormLabel, _check));
        _createdWidget.append(_fieldForm);
      }


    }

    _createdWidget.append($('<p>').append('Has aceptado las condiciones en las ', Pard.Forms.Conditions().link(), ' del Benimaclet conFusión festival')) 


    var _postData = $('<div>').addClass('postData-container');

    if(proposal['amend']){
      var _amendLabel = 'Enmienda:';
      _amendFormLabel = $('<span>').text(_amendLabel).addClass('myProposals-field-label');
      var _amendText = $('<div>').append($('<p>').text(proposal['amend']));
      var _modifyAmendButton = $('<button>').attr({type: 'button'}).addClass('send-post-data-btn').addClass('send-post-data-btn').text('Modifica Enmienda');

      _modifyAmendButton.click(function(){
        _postData.empty();
        var _textArea = $('<textarea>').attr('rows', 4).val(proposal['amend']);
        var _sendButton = $('<button>').attr({type: 'button'}).addClass('send-post-data-btn').text('Envía');

        _textArea.on('input', function(){$(this).removeClass('warning')});

        _sendButton.click(function(){
          if (_textArea.val()) {
            Pard.Backend.amendProposal(proposal.proposal_id, _textArea.val(), Pard.Events.AmendProposal);
            closepopup();
          }
          else _textArea.attr({placeholder: 'Escribe aquí el mensaje que quieres enviar'}).addClass('warning');
        });
    
        _postData.append(_postDataLabel, _textArea, _sendButton);
      });
    
      _postData.append(_amendFormLabel, _amendText, _modifyAmendButton);
      
    }
    else{
      var _postDataLabel = $('<p>').addClass('myProposals-field-label').text('No se permite modificar el formulario enviado, pero, en caso lo necesites, puedes enviar una enmienda antes del cierre de la convocatoria (15 de Junio).');

      var _textArea = $('<textarea>').attr('rows', 4);
      var _sendButton = $('<button>').attr({type: 'button'}).addClass('send-post-data-btn').text('Envía');

      _textArea.on('input', function(){$(this).removeClass('warning')});

      _sendButton.click(function(){
        if (_textArea.val()) {
         Pard.Backend.amendProposal(proposal.proposal_id, _textArea.val(), Pard.Events.AmendProposal);
         closepopup();
        }
        else _textArea.attr({placeholder: 'Escribe aquí el mensaje que quieres enviar'}).addClass('warning');
      });

      _postData.append(_postDataLabel, _textArea, _sendButton);
    }

     var _finalMessage = $('<p>').append('Para cualquier duda o necesidad no te olvides que el equipo de organización del festival está siempre a tu disposición y puedes contactarlo escribiendo a <a href="mailto:contacta@beniconfusionfest.es" target="_top">contacta@beniconfusionfest.es</a>.').addClass('myproposal-final-message');

    var _deleteProposalCaller = $('<a>').attr('href','#').text('Retira y elimina esta propuesta').addClass('deleteProfile-caller');

    var _deleteProposal = Pard.Widgets.PopupCreator(_deleteProposalCaller, '¿Estás seguro/a?', function(){return Pard.Widgets.DeleteProposalMessage(proposal.proposal_id, closepopup)});

    _createdWidget.append(_postData, _finalMessage, _deleteProposal.render());

    // var _closeBtn = Pard.Widgets.Button('Cierra').render().addClass('pard-btn').css('font-size':'14px');
    // _createdWidget.append(_closeBtn);


    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.DeleteProposalMessage = function(proposal_id, closepopup){  
    
    var _createdWidget = $('<div>');
    var _message = $('<p>').text('Confirmando, tu propuesta será retirada de la convocatoria del Benimaclet conFusión festival y no podrá ser parte del evento.');
    var _yesBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn confirm-delete-btn').text('Confirma');
    var _noBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn cancel-delete-btn').text('Anula');

    _yesBtn.click(function(){
      Pard.Backend.deleteProposal(proposal_id, Pard.Events.DeleteProposal);
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

  