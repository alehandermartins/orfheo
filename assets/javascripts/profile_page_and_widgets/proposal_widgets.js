'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {}; 

  ns.Widgets.ProposalForm = function(type){
    console.log(type);
    var _proposalForms = {
      artist: Pard.Widgets.CallArtistButton,
      space: Pard.Widgets.CallSpaceButton
    }

    return{
      render: function(){
        return  _proposalForms[type];
      }
    }
  }

  ns.Widgets.PrintMyProposal = function(proposal, form, closepopup){

    var _createdWidget = $('<div>');

    var profile = Pard.ProfileManager.getProfile(proposal.profile_id);


    _createdWidget.append(Pard.Widgets.PrintProposal(proposal, form).render());

    _createdWidget.append($('<p>').append('Has aceptado las condiciones en las bases de participación de la convocatoria de ',proposal.event_name)); 

    var _postData = $('<div>').addClass('postData-container');
    var _deadline = new Date(parseInt(proposal.deadline));

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
    
      _postData.append(_amendFormLabel);
      _postData.append(_amendText);
      _postData.append(_modifyAmendButton);
      
    }
    else{
      var _postDataLabel = $('<p>').addClass('myProposals-field-label').text('No se permite modificar el formulario enviado, pero, en caso lo necesites, puedes enviar una enmienda antes del cierre de la convocatoria ('+ moment(_deadline).locale('es').format('DD MMMM YYYY')+')');

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

    if(proposal['amend']){
      var _amendLabel = 'Enmienda:';
      _amendFormLabel = $('<span>').text(_amendLabel).addClass('myProposals-field-label');
      var _amendText = $('<div>').append($('<p>').text(proposal['amend']));
      var _postData = $('<div>').addClass('postData-container');
      _postData.append(_amendFormLabel, _amendText);
    }

     // var _finalMessage = $('<p>').append('Para cualquier duda o necesidad no te olvides que el equipo de organización del festival está siempre a tu disposición y puedes contactarlo escribiendo a <a href="mailto:contacta@beniconfusionfest.es" target="_top">contacta@beniconfusionfest.es</a>.').addClass('myproposal-final-message');

    var _deleteProposalCaller = $('<a>').attr('href','#').text('Retira y elimina esta propuesta').addClass('deleteProfile-caller');

    var _deleteProposal = Pard.Widgets.PopupCreator(_deleteProposalCaller, '¿Estás seguro/a?', function(){return Pard.Widgets.DeleteProposalMessage(proposal, closepopup)});

    var _now = new Date();
    if(_now.getTime() < _deadline.getTime()){
      _createdWidget.append(_postData);
      _createdWidget.append(_deleteProposal.render());
    }


    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.DisplayPopupProposal = function(proposal, form, popupTitle){
    var _content = $('<div>').addClass('very-fast reveal full');
    _content.empty();
    $('body').append(_content);

    var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
    var _message = Pard.Widgets.PopupContent(popupTitle, Pard.Widgets.PrintProposalMessage(Pard.Widgets.PrintProposal(proposal, form)));
    _message.setCallback(function(){
      _content.remove();
      _popup.close();
    });
    _content.append(_message.render());
    _popup.open();
  }


  ns.Widgets.PrintProposal = function(proposal, form){
    console.log(form);
    console.log(proposal);
    var _createdWidget = $('<div>');
    var _nameLabel = $('<span>').addClass('myProposals-field-label').text('Propuesta enviada por:');
    var _nameText = $('<span>').text(' ' + proposal['name']);
    var _name = $('<div>').append($('<p>').append(_nameLabel, _nameText))
    var _orfheoFields = ['subcategory','phone','email','address'];

    _createdWidget.append(_name);

    var _fieldFormLabel, _fieldForm, _textLabel, _proposalField, _fieldFormText;

    _orfheoFields.forEach(function(field){
      if (field == 'email' && proposal[field]) {
        var _emailLabel = $('<span>').addClass('myProposals-field-label').text('Correo:');
        var _emailText = $('<span>').text(' ' + proposal[field]);
        var _email = $('<div>').append($('<p>').append(_emailLabel, _emailText));
        _createdWidget.append(_email);
      }
      else if (field == 'phone' && proposal[field]){
        var _label = $('<span>').addClass('myProposals-field-label').text('Teléfono:');
        var _text = $('<span>').text(' ' + proposal[field]);
        var _element = $('<div>').append($('<p>').append(_label, _text));
        _createdWidget.append(_element);
      }
      else if(field == 'address' && proposal[field]){
        _textLabel = 'Dirección: ';
        _fieldFormLabel = $('<span>').text(_textLabel).addClass('myProposals-field-label');
        var _fieldFormText = $('<a>');
        var _address = ' ';
        if (proposal['address']['route']) _address +=  proposal['address']['route']+ ' ';
        if (proposal['address']['street_number']) _address += ' '+proposal['address']['street_number']+',  ';
        if (proposal['address']['door']) _address += ', puerta/piso '+proposal['address']['door']+',  ';
        _address += proposal['address']['postal_code']+', '+proposal['address']['locality'];
        _fieldFormText.text(_address).attr({
            href: 'http://maps.google.com/maps?q='+_address,
            target: '_blank'
        })
        _fieldForm = $('<div>').append($('<p>').append(_fieldFormLabel, _fieldFormText));
        _createdWidget.append(_fieldForm);
      }
      else if (form[field] && proposal.field){
        var _label = $('<span>').addClass('myProposals-field-label').text(form[field].label+':');
        var _text = $('<span>').text(' ' + proposal[field]);
        var _element = $('<div>').append($('<p>').append(_label, _text));
        _createdWidget.append(_element);
      }
    });

    for(var field in proposal){
      if ($.inArray(field, $.merge(['profile_id','proposal_id','user_id','call_id','event_id','event_name','deadline','category','conditions','form_category','name','production_id', 'links', 'photos'],_orfheoFields))<0){  
                console.log(field);
        if (field == 'description') {
          var _label = $('<span>').addClass('myProposals-field-label').text('Descripción:').css('display', 'block');
          var _text = $('<span>').text(' ' + proposal[field]);
          var _element = $('<div>').append($('<p>').append(_label, _text));
          _createdWidget.append(_element);
        }
        else {
          _textLabel = form[field]['label'];
          if (_textLabel.indexOf('*')>0) _textLabel = _textLabel.replace(' *','');
          if ($.isArray(proposal[field])){
            _proposalField = ' - '
            proposal[field].forEach(function(item){
              _proposalField = _proposalField + item + ' - ';
            });
          }
          else _proposalField = proposal[field];
          _fieldFormLabel = $('<span>').text(_textLabel+':').addClass('myProposals-field-label');
          if (field != 'duration') {_fieldFormLabel.css('display', 'block')}       
          else {_proposalField = ' '+_proposalField+ ' min';}
          // if (field == 'phone') _proposalField = ' '+_proposalField;
          _fieldForm = $('<div>').append($('<p>').append(_fieldFormLabel, _proposalField));
          _createdWidget.append(_fieldForm);
        }
        // if (field == 'availability'){
        //   _textLabel = form[field]['label'].render().text();
        //   if (_textLabel.indexOf('*')>0) _textLabel = _textLabel.replace(' *','');
        //   _fieldFormLabel = $('<span>').text(_textLabel+': ');
        //   _fieldFormLabel.addClass('myProposals-field-label');
        //   var _availability ='';
        //   _fieldForm = $('<div>').append(_fieldFormLabel);
        //   var _dayList = $('<ul>');
        //   for (var day in proposal[field]) {
        //     _availability = $('<li>').text(Pard.Widgets.AvailabilityDictionary(proposal[field][day]));
        //     _dayList.append(_availability.addClass('avilability-info-text'));
        //   }
        //   _fieldForm.append(_dayList);
        //   _createdWidget.append(_fieldForm);
        // }
      }
    }
    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.DeleteProposalMessage = function(proposal, closepopup){  
    
    var _createdWidget = $('<div>');
    var proposal_id = proposal.proposal_id;
    var _message = $('<p>').text('Confirmando, tu propuesta será retirada de la convocatoria de '+proposal.event_name+ ' y por lo tanto no podrá ser seleccionada.');
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

  