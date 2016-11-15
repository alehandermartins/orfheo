'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {}; 

  ns.Widgets.MyCallProposals = function(profile){

    var _createdWidget = $('<div>');

    var _eventNames = [];
    var _forms;
    var _callProposals = profile.proposals;
    
    var _listProposals = $('<ul>');

    _callProposals.forEach(function(proposal){
      proposal.name = profile.name
      if ($.inArray(proposal.event_name, _eventNames)<0) {
        var _callName = $('<p>').append('Inscrito en ',$('<span>').text(proposal.event_name).css({'font-weight': 'bold'})).addClass('activities-box-call-name');
        _listProposals = $('<ul>');
        _createdWidget.append(_callName, _listProposals);
      }
      _eventNames.push(proposal.event_name);
      var _caller = $('<a>').attr({href:'#'})
      if (proposal.title) _caller.text(proposal.title);
      else _caller.text('Formulario enviado');
      var _proposalItem = $('<li>').append( _caller);
      _listProposals.append(_proposalItem); 
      _caller.click(function(){
        if (!(_forms)) {
          Pard.Backend.getCallForms(proposal.call_id, function(data){
            _forms = data.forms;
            _displayPopup(proposal, _forms[profile.type][proposal.form_category], proposal.event_name);
          });
        }
        else{
          _displayPopup(proposal, _forms[profile.type][proposal.form_category], profile.type, proposal.event_name);
        }       
      });
    });


    var _displayPopup = function(proposal, form, popupTitle){
      var _content = $('<div>').addClass('very-fast reveal full');
      _content.empty();
      $('body').append(_content);

      var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
      var _message = Pard.Widgets.PopupContent(popupTitle,Pard.Widgets.PrintMyProposal(proposal, form, profile.type, function(){_popup.close()}));
      _message.setCallback(function(){
        _content.remove();
        _popup.close();
      });
      _content.append(_message.render());
      _popup.open();
    }
  
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
    if(_now.getTime() < _deadline.getTime()){
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
              _backendAmendProposal[profileType](proposal.proposal_id, proposal.event_id, _textArea.val(), Pard.Events.AmendProposal);
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
           _backendAmendProposal[profileType](proposal.proposal_id, proposal.event_id, _textArea.val(), Pard.Events.AmendProposal);
           closepopup();
          }
          else _textArea.attr({placeholder: 'Escribe aquí el mensaje que quieres enviar'}).addClass('warning');
        });
        _postData.append(_postDataLabel, _textArea, _sendButton);
      }

      var _deleteProposalCaller = $('<a>').attr('href','#').text('Retira y elimina esta propuesta').addClass('deleteProfile-caller');
      var _deleteProposal = Pard.Widgets.PopupCreator(_deleteProposalCaller, '¿Estás seguro/a?', function(){return Pard.Widgets.DeleteMyProposalMessage(proposal, closepopup)});
      _createdWidget.append(_postData);
      _createdWidget.append(_deleteProposal.render());
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
    console.log(form);
    console.log(proposal);
    var _createdWidget = $('<div>');
    var _orfheoFields = ['name', 'subcategory','phone','email','address', 'title','description','short_description','duration','availability'];

    _orfheoFields.forEach(function(field){
      if (proposal[field]){
        _fieldFormLabel = $('<span>').addClass('myProposals-field-label');
        _fieldFormText = $('<span>');
        _fieldForm = $('<div>').append($('<p>').append(_fieldFormLabel, _fieldFormText)).addClass('proposalFieldPrinted');
        _createdWidget.append(_fieldForm);
        if (field == 'name') {
          _fieldFormLabel.text('Propuesta enviada por:');
          _fieldFormText.text(' ' + proposal['name']).css('font-weight','bold');
        }
        else if (field == 'email') {
          _fieldFormLabel.text('Correo:');
          _fieldFormText .append($('<a>').attr('href','mailto:'+proposal[field]).text(' ' + proposal[field]));
        }
        else if (field == 'phone'){
          _fieldFormLabel.text('Teléfono:');
          _fieldFormText.text(' ' + proposal[field]);
        }
        else if(field == 'address'){
          _fieldFormLabel.text('Dirección: ')
          var _fieldText = $('<a>');
          var _address = ' ';
          if (proposal['address']['route']) _address +=  proposal['address']['route']+ ' ';
          if (proposal['address']['street_number']) _address += ' '+proposal['address']['street_number']+',  ';
          if (proposal['address']['door']) _address += ', puerta/piso '+proposal['address']['door']+',  ';
          _address += proposal['address']['postal_code']+', '+proposal['address']['locality'];
          _fieldText.text(_address).attr({
              href: 'http://maps.google.com/maps?q='+_address,
              target: '_blank'
          })
          _fieldFormText.append(_fieldText);
        }
        else if (field == 'description') {
            _fieldFormLabel.text('Descripción:')
            _fieldFormText.text(' ' + proposal[field]);
            _fieldForm.addClass('proposalFieldPrinted-TextArea');
        }
        else if (field == 'subcategory') {
            _fieldFormLabel.text('Categoría en el evento:');
            _fieldFormText.text(' ' + proposal[field]);
        }
        else if (field == 'availability') {
          _fieldFormLabel.text('Disponibilidad:');
          var _list = $('<ul>');
          proposal[field].forEach(function(val){
            var _dayDate = new Date (val);
            _list.append($('<li>').text(moment(_dayDate).locale('es').format('dddd DD')+' de '+moment(_dayDate).locale('es').format('MMMM YYYY')));
          });  
          _fieldFormText.append(_list);
        }
        else if (form[field]){
          _fieldFormLabel.text(form[field].label+':');
          var _text = ' ' + proposal[field];
          if (field == 'duration' && $.isNumeric(proposal[field])) _text = _text + ' min';
          _fieldFormText.append(_text);
        }
      }
    });

    if (proposal['photos'] || proposal['links']){
      var _multimediaContainer = $('<div>');
      _fieldFormLabel = $('<span>').addClass('myProposals-field-label').text('Multimedias:');
      var _linkPhoto = $('<a>').text(' ver contenidos enviados').attr('href','#')
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
        _fieldFormLabel = $('<span>').addClass('myProposals-field-label');
        _fieldFormText = $('<span>');
        _fieldForm = $('<div>').append($('<p>').append(_fieldFormLabel, _fieldFormText)).addClass('proposalFieldPrinted');
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
          if (proposal[field]) _text = ' Sí';
          else _text = ' No';
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


  ns.Widgets.DisplayPopupProposal = function(proposal, form, popupTitle){
    var _content = $('<div>').addClass('very-fast reveal full');
    _content.empty();
    $('body').append(_content);

    var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
    var _message = Pard.Widgets.PopupContent(popupTitle, Pard.Widgets.PrintProposal(proposal, form));
    _message.setCallback(function(){
      _content.remove();
      _popup.close();
    });
    
    if (proposal.amend){
      var _label = $('<span>').addClass('myProposals-field-label').text('Enmienda:').css('display', 'block');
      var _text = $('<span>').text(' ' + proposal.amend);
      var _element = $('<div>').append($('<p>').append(_label, _text));
      _message.appendToContent(_element);
    }
    _content.append(_message.render());
    _popup.open();
  }


  ns.Widgets.DeleteMyProposalMessage = function(proposal, closepopup){  
    var _createdWidget = $('<div>');
    var _message = $('<p>').text('Confirmando, tu propuesta será retirada de la convocatoria de '+proposal.event_name+ ' y por lo tanto no podrá ser seleccionada.');
    var _yesBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn confirm-delete-btn').text('Confirma');
    var _noBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn cancel-delete-btn').text('Anula');

    _yesBtn.click(function(){
      Pard.Backend.deleteProposal(proposal.proposal_id, proposal.event_id, Pard.Events.DeleteProposal);
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

  