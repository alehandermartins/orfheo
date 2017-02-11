'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {}; 

  ns.Widgets.MyCallProposals = function(profile){

    var _createdWidget = $('<div>');

    var _eventNames = [];
    var _forms = {};
    var _callProposals = profile.proposals;
    
    var _listProposals = $('<ul>');

    _callProposals.forEach(function(proposal){
      proposal.name = profile.name;
      
      //necesary for conFusión proposal that do not have form category
      if (!(proposal.form_category)) proposal.form_category = Pard.Widgets.Dictionary(proposal.category).render();

      if ($.inArray(proposal.event_name, _eventNames)<0) {
        var _callName = $('<p>').append('Inscrito en ',$('<span>').text(proposal.event_name).css({'font-weight': 'bold'})).addClass('activities-box-call-name');
        _listProposals = $('<ul>');
        _createdWidget.append(_callName, _listProposals);
      }
      _eventNames.push(proposal.event_name);
      var _caller = $('<a>').attr({href:'#/'})
      if (proposal.title) _caller.text(proposal.title);
      else _caller.text('Formulario enviado');
      var _proposalItem = $('<li>').append( _caller);
      _listProposals.append(_proposalItem); 
      var _proposalPopup;
      _caller
        .one('click', function(){
          _proposalPopup = Pard.Widgets.Popup();
        })
        .on('click', function(){
          if (!(_forms[proposal.call_id])) {
            Pard.Backend.getCallForms(proposal.call_id, function(data){
              _forms[proposal.call_id] = data.forms;
              _proposalPopup.setContent(proposal.event_name, Pard.Widgets.PrintMyProposal(proposal, _forms[proposal.call_id][profile.type][proposal.form_category], profile.type, function(){_proposalPopup.close()}).render());
              _proposalPopup.open();
              
            });
          }
          else{
            _proposalPopup.setContent(proposal.event_name, Pard.Widgets.PrintMyProposal(proposal, _forms[proposal.call_id][profile.type][proposal.form_category], profile.type, function(){_proposalPopup.close()}).render());
            _proposalPopup.open();
            
          }       
        })
    });
  
    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.PrintMyProposal = function(proposal, form, profileType, closepopup){

    var _createdWidget = $('<div>');
    _createdWidget.append(Pard.Widgets.PrintProposal(proposal, form).render());
    if (form['conditions'] && form['conditions']['helptext']){
      var _conditionsLink = $('<a>').attr({'href':form['conditions']['helptext'], 'target':'_blank'}).text('bases de participación');
      _createdWidget.append($('<p>').append('Has aceptado las condiciones en las ',_conditionsLink,' de la convocatoria de ',proposal.event_name)); 
    }
    var _deadline = new Date(parseInt(proposal.deadline));
    var _now = new Date();
    // if(_now.getTime() < _deadline.getTime()){
      if(true){
      var _backendAmendProposal = {
        space: Pard.Backend.amendSpaceProposal,
        artist: Pard.Backend.amendArtistProposal
      }
      var _postData = $('<div>').addClass('postData-container');
      var _postDataLabel = $('<p>').addClass('myProposals-field-label').text('No se permite modificar el formulario enviado, pero, en caso lo necesites, puedes enviar una enmienda antes del cierre de la convocatoria ('+ moment(_deadline).locale('es').format('DD MMMM YYYY')+')');
      if (proposal.amend){
        var _amendLabel = 'Enmienda enviada:';
        _amendFormLabel = $('<span>').text(_amendLabel).addClass('myProposals-field-label');
        var _amendText = $('<div>').append($('<p>').text(proposal['amend']));
        var _modifyAmendButton = $('<button>').attr({type: 'button'}).addClass('send-post-data-btn').text('Modifica Enmienda');
        _modifyAmendButton.click(function(){
          _postData.empty();
          var _textArea = $('<textarea>').attr('rows', 4).val(proposal['amend']);
          var _sendButton = $('<button>').attr({type: 'button'}).addClass('send-post-data-btn').text('Envía');

          _textArea.on('input', function(){$(this).removeClass('warning')});

          _sendButton.click(function(){
            if (_textArea.val()) { 
              _backendAmendProposal[profileType](proposal.proposal_id, proposal.event_id, proposal.call_id, _textArea.val(), Pard.Events.AmendProposal);
              closepopup();
            }
            else _textArea.attr({placeholder: 'Escribe aquí el mensaje que quieres enviar'}).addClass('warning');
          });
      
          _postData.append(_postDataLabel, _textArea, _sendButton);
        });
        _postData.append(_postDataLabel, _amendFormLabel,_amendText,_modifyAmendButton);
      }
      else{
        var _textArea = $('<textarea>').attr('rows', 4);
        var _sendButton = $('<button>').attr({type: 'button'}).addClass('send-post-data-btn').text('Envía');
        _textArea.on('input', function(){$(this).removeClass('warning')});
        _sendButton.click(function(){
          if (_textArea.val()) {
           _backendAmendProposal[profileType](proposal.proposal_id, proposal.event_id, proposal.call_id, _textArea.val(), Pard.Events.AmendProposal);
           closepopup();
          }
          else _textArea.attr({placeholder: 'Escribe aquí el mensaje que quieres enviar'}).addClass('warning');
        });
        _postData.append(_postDataLabel, _textArea, _sendButton);
      }

      var _confirmPopup;
      var _deleteProposal = $('<a>').attr('href','#/').text('Retira y elimina esta propuesta').addClass('deleteProfile-caller')
        .one('click', function(){
        _confirmPopup = Pard.Widgets.Popup();
        _confirmPopup.setContent('¿Estás seguro/a?', Pard.Widgets.DeleteMyProposalMessage(proposal, profileType, closepopup, function(){_confirmPopup.close();}).render());
        })
        .click(function(){
          _confirmPopup.open();
        });
      _createdWidget.append(_postData);
      _createdWidget.append(_deleteProposal.prepend(Pard.Widgets.IconManager('delete').render().addClass('trash-icon-delete')));
    }


    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
      }
    }
  }


  ns.Widgets.PrintProposal = function(proposal, form){
    var form = $.extend(true, {}, form);  
    console.log(proposal)
    var _createdWidget = $('<div>');
    var _orfheoFields = ['name', 'subcategory','phone','email','address', 'title','description','short_description','duration','availability', 'children', 'cache'];
    var sentProposalField = Pard.Widgets.sentProposalField(proposal);
    _orfheoFields.forEach(function(field){
      if (proposal[field]){
        var _fieldFormLabel = $('<span>').addClass('myProposals-field-label');
        var _fieldFormText = $('<span>');
        var _proposalField = sentProposalField[field] || form[field];
        _proposalField['text'] = _proposalField['text'] || proposal[field];
        _proposalField['label'] = _proposalField['label'] || form[field]['label'];
        _proposalField['input'] = _proposalField['input'] || '';
        _fieldFormLabel.append(_proposalField['label'],':');
        _fieldFormText.append(' ',_proposalField['text']).addClass('proposalText-'+_proposalField['input']);
        var _fieldForm = $('<div>').append($('<p>').append(_fieldFormLabel, _fieldFormText)).addClass('proposalFieldPrinted');
        _createdWidget.append(_fieldForm);
      }
    });

    if (proposal['photos'] || proposal['links']){
      var _multimediaContainer = $('<div>');
      _fieldFormLabel = $('<span>').addClass('myProposals-field-label').text('Multimedias:');
      var _linkPhoto = $('<a>').text(' ver contenidos enviados').attr('href','#/')
      _fieldFormText = $('<span>').append(_linkPhoto);
      _fieldForm = $('<div>').append($('<p>').append(_fieldFormLabel, _fieldFormText)).addClass('proposalFieldPrinted');
      _createdWidget.append(_fieldForm);
      Pard.Widgets.MultimediaScripts(function(){});       
      _linkPhoto.click(function(){        
        if (!(_multimediaContainer.html())) Pard.Widgets.MultimediaDisplay(proposal, function(multimedia){Pard.Widgets.AddMultimediaContent(_multimediaContainer, multimedia)});
          Pard.Widgets.BigAlert('',_multimediaContainer,'multimedia-popup-bigalert');
      })
    }

    for(var field in proposal){
      if ($.isNumeric(field)){
        var _fieldFormLabel = $('<span>').addClass('myProposals-field-label');
        var _fieldFormText = $('<span>').addClass('proposalText-'+form[field]['input']);
        var _fieldForm = $('<div>').append($('<p>').append(_fieldFormLabel, _fieldFormText)).addClass('proposalFieldPrinted');
        _createdWidget.append(_fieldForm);
        _textLabel = form[field]['label'];          
        if (_textLabel.indexOf('*')>0) _textLabel = _textLabel.replace(' *','');
        _textLabel += ':';
        _fieldFormLabel.append(_textLabel);
        if ($.isArray(proposal[field])){
          var _list = $('<ul>');
          proposal[field].forEach(function(val){
          _list.append($('<li>').text(val));
          });  
          _fieldFormText.append(_list);
        }
        else if (form[field]['input'] == 'CheckBox'){
          var _text;
          var dictionaryCheckBox = {
            false:' No',
            true:' Sí'
          }
          _text = dictionaryCheckBox[proposal[field]];
          _fieldFormText.append(_text);
        }
        else _fieldFormText.text(' '+proposal[field]);  
      }
    }

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
      }
    }
  }


  ns.Widgets.sentProposalField = function(proposal){

    var _address = function(){
      var _address = ' ';
      if (proposal['address']){
        if (proposal['address']['route']) _address +=  proposal['address']['route']+ ' ';
        if (proposal['address']['street_number']) _address += ' '+proposal['address']['street_number']+',  ';
        if (proposal['address']['door']) _address += ', puerta/piso '+proposal['address']['door']+',  ';
        _address += proposal['address']['postal_code']+', '+proposal['address']['locality'];
      }
      return _address;
    };

    var _availability = function(){
      var _list = $('<ul>');
      if (proposal['availability']) proposal['availability'].forEach(function(val){
        var _dayDate = new Date (val);
        _list.append($('<li>').text(moment(_dayDate).locale('es').format('dddd DD')+' de '+moment(_dayDate).locale('es').format('MMMM YYYY')));
      });
      return _list;
    }  

    var _duration = function(){
      if (proposal['duration'] && $.isNumeric(proposal['duration'])) return  proposal['duration']+' min';
    }

    return {
      'name': {
        label: 'Propuesta enviada por',
        text: $('<span>').append($('<strong>').append(proposal['name']), $('<div>').append(' (formulario: ',proposal['form_category'],')').css('font-size','0.875rem'))
      },
      'email': {
        label: 'Correo',
        text: $('<a>').attr('href','mailto:'+proposal['email']).text(proposal['email'])
      },
      'phone':{
        label: 'Teléfono',
        text: proposal.phone.value
      },
      'address': {
        label: 'Dirección',
        text: $('<a>').text(_address()).attr({
                href: 'http://maps.google.com/maps?q='+_address(),
                target: '_blank'
              })
      },
      'description': {
        label: 'Descripción',
        input: 'TextAreaEnriched'
      },
      'subcategory': {
        label: 'Categoría en el evento'
      },
      'availability': {
        label: 'Disponibilidad',
        text:  _availability()
      },
      'duration': {
        text: _duration()
      }
    }
  }


  ns.Widgets.AddMultimediaContent =  function(_multimediaContainer, multimedia) {

      if(multimedia.video != false){
        var _outerVideocontainer = $('<div>');
        var _videoContainer = $('<div>').addClass('video-production-container')

        var _videoTitle = $('<div>').addClass('single-image-container ').append($('<div>').addClass('single-image-content images-title-box').append($('<h6>').text('Vídeos')));
        
        // var _videoTitle = $('<div>').append($('<div>').addClass('video-title-box').append($('<h6>').text('Vídeos')));

        _multimediaContainer.append(_outerVideocontainer);
        multimedia.video.forEach(function(video){
          _videoContainer.prepend($('<div>').addClass('single-video-container').append(video))
        });
        _outerVideocontainer.append(_videoTitle, _videoContainer);
      };

      if(multimedia.audio != false){
        var _outerAudiocontainer = $('<div>');
        var _audioContainer = $('<div>').addClass('image-production-container');
        var _audioTitle = $('<div>').addClass('single-image-container ').append($('<div>').addClass('single-image-content images-title-box').append($('<h6>').text('Audio')));
        _multimediaContainer.append(_outerAudiocontainer);
        multimedia.audio.forEach(function(audio){
          _audioContainer.prepend($('<div>').addClass('single-image-container').append($('<div>').addClass('single-image-content').append(audio)));
        });
        _outerAudiocontainer.append(_audioTitle, _audioContainer);

      }

      if(multimedia.image != false){
        var _outerImagescontainer = $('<div>');
        var _imageContainer = $('<div>').addClass('image-production-container');
        var _imageTitle = $('<div>').addClass('single-image-container').append($('<div>').addClass('single-image-content images-title-box').append($('<h6>').text('Imágenes')));      
        _multimediaContainer.append(_outerImagescontainer);
        multimedia.image.forEach(function(image){
          _imageContainer.append($('<div>').addClass('single-image-container').append($('<div>').addClass('single-image-content').append(image)));
        });
        _outerImagescontainer.append(_imageTitle, _imageContainer);
      }
      // $(document).ready(function(){
        FB.XFBML.parse();
        window.instgrm.Embeds.process();
        doBuild();
      // });
    }


  

  ns.Widgets.DeleteMyProposalMessage = function(proposal, profileType, closepopup, closeConfirmPopup){  
    var _createdWidget = $('<div>');
    var _message = $('<p>').text('Confirmando, tu propuesta será retirada de la convocatoria de '+proposal.event_name+ ' y por lo tanto no podrá ser seleccionada.');
    var _yesBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn confirm-delete-btn').text('Confirma');
    var _noBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn cancel-delete-btn').text('Anula');

    var _deleteProposalBackend = {
      artist: Pard.Backend.deleteArtistProposal,
      space: Pard.Backend.deleteSpaceProposal
    }    

    _yesBtn.click(function(){
      _deleteProposalBackend[profileType](proposal.proposal_id, proposal.event_id, Pard.Events.DeleteProposal);
      closepopup();
      closeConfirmPopup();
    });

    _noBtn.click(function(){
      closeConfirmPopup();
    });

    var _buttonsContainer = $('<div>').addClass('yes-no-button-container');

    _createdWidget.append(_message,  _buttonsContainer.append(_noBtn, _yesBtn));

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

}(Pard || {}));

  