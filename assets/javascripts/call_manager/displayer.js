'use strict';

(function(ns){

  ns.Displayer = function(the_event, forms){

    var event_id = the_event.event_id;
    var call_id = the_event.call_id;
    var eventName = the_event.name;

    var _content = $('<div>').addClass('very-fast reveal full');
    var _popup =  new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
    $(document).ready(function(){
      $('body').append(_content);
    })

    var _displayArtistProgram = function(profile_id){

      var artist = the_event.artists[profile_id].artist;
      var myprogram = the_event.artists[profile_id].program;
      var _message = Pard.Widgets.PopupContent(artist.name, Pard.Widgets.ArtistProgram(artist, myprogram, the_event.spaces, the_event.program), 'space-program-popup-call-manager');
      _message.setCallback(function(){
        _content.empty();
        _popup.close();
      });
      _content.append(_message.render());
      _popup.open();
    }

    var _displaySpaceProgram = function(profile_id){

      var space = the_event.spaces[profile_id].space;
      var myprogram = the_event.spaces[profile_id].program;

      var _message = Pard.Widgets.PopupContent(space.name, Pard.Widgets.SpaceProgram(space, myprogram, the_event.artists, the_event.program), 'space-program-popup-call-manager');
      _message.setCallback(function(){
        _content.empty();
        _popup.close();
      });
      _content.append(_message.render());
      _popup.open();
    }

    var _displayProposal = function(proposal, type){

      var _proposal = $.extend(true, {}, proposal);

      var form = forms[type][_proposal.form_category];

      var _proposalPrinted = Pard.Widgets.PrintProposal(proposal, form);
      var _deleteProposalCaller = $('<a>').attr('href','#').text('Elimina').addClass('deleteProfile-caller').prepend(Pard.Widgets.IconManager('delete').render().addClass('trash-icon-delete'));
      var _modifyProposal = $('<a>').attr('href','#').text('Modifica').addClass('deleteProfile-caller').prepend(Pard.Widgets.IconManager('modify').render().addClass('trash-icon-delete'));

      _deleteProposalCaller.on('click', function(){
        var _deleteContent = $('<div>').addClass('very-fast reveal full');
        _deleteContent.empty();
        $('body').append(_deleteContent);
        var _confirmPopup = new Foundation.Reveal(_deleteContent, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
        var _message = Pard.Widgets.PopupContent('¿Estás seguro/a?',  confirmPopupContent(), 'alert-container-full');
        _message.setCallback(function(){
          _deleteContent.remove();
          _confirmPopup.close();
        });
        _deleteContent.append(_message.render());
        _confirmPopup.open();
      });

      var confirmPopupContent = function(){
        var _createdWidget = $('<div>');
        var _yesBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn confirm-delete-btn').text('Confirma');
        var _noBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn cancel-delete-btn').text('Anula');

        var spinnerDeleteProposal =  new Spinner().spin();
        var _deleteProposalBackend = {
          artist: Pard.Backend.deleteArtistProposal,
          space: Pard.Backend.deleteSpaceProposal
        }

        var _buttonsContainer = $('<div>').addClass('yes-no-button-container');

        _createdWidget.append(_buttonsContainer.append(_noBtn, _yesBtn));

        return {
          render: function(){
            return _createdWidget;
          },
          setCallback: function(callback){
            _noBtn.click(function(){
              callback();
            });
            _yesBtn.click(function(){
              $('body').append(spinnerDeleteProposal.el);
              _deleteProposalBackend[type](_proposal.proposal_id, event_id, function(data){
                deleteCallback(data);
                spinnerDeleteProposal.stop();
                _popup.close();
                _content.empty();
                callback();
              });
            });
          }
        }
      }

      var deleteCallback = function(data){
        if (data['status'] == 'success'){
          if (type == 'artist') Pard.Bus.trigger('deleteArtist', data);
          else if (type == 'space') Pard.Bus.trigger('deleteSpace', data);
          Pard.Widgets.Alert('', 'Propuesta eliminada correctamente.');
        }
        else{
          var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
          if (typeof _dataReason == 'object')
            Pard.Widgets.Alert('¡Error!', 'No se ha podido guardar los datos', location.reload());
          else{
            console.log(data.reason);
            Pard.Widgets.Alert('', _dataReason, location.reload());
          }
        }
      }

      var modifyCallback = function(data){
        if (data['status'] == 'success'){
          if (type == 'artist') Pard.Bus.trigger('modifyArtist', data.proposal);
          else if (type == 'space') Pard.Bus.trigger('modifySpace', data.proposal);
        }
        else{
          var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
          if (typeof _dataReason == 'object')
            Pard.Widgets.Alert('¡Error!', 'No se ha podido guardar los datos', location.reload());
          else{
            console.log(data.reason);
            Pard.Widgets.Alert('', _dataReason);
          }
        }
      };

      // var closepopup = function(){};

      var _modifyProposalBackend = {
        artist: Pard.Backend.modifyArtistProposal,
        space: Pard.Backend.modifySpaceProposal
      }
      _modifyProposal.click(function(){
        _messageProposalPrintedRendered.hide();
        var _formWidget = Pard.Widgets.OwnProposalForm(form, type, _proposal.form_category);
        _formWidget.setVal(_proposal);
        if (proposal.own) _formWidget.disableFields();
      
        _formWidget.showAll();
        _formWidget.setSend(function(stopSpinner){
          var _submitForm = _formWidget.getVal();
          if (proposal.own){
            // _submitForm['name'] = _proposal.name;
            _submitForm['email'] = _proposal.email;
          }
          _submitForm['proposal_id'] = _proposal.proposal_id;
          _submitForm['event_id'] = event_id;
          _submitForm['call_id'] = call_id;
          _submitForm['profile_id'] = _proposal.profile_id; 
          _modifyProposalBackend[type](_submitForm, 
            function(data){
              modifyCallback(data);
              _content.empty();
              if (type == 'space') {
                var _modifiedProposal = data.proposal;
              }
              else {
                var _artist = data.proposal;
                var _modifiedProposal = data.proposal.proposals[0];
                _modifiedProposal.name = _artist.name;
                _modifiedProposal.email = _artist.email;
                _modifiedProposal.profile_id = _artist.profile_id;
              }
              _modifiedProposal.form_category = _modifiedProposal.form_category || Pard.Widgets.Dictionary(_modifiedProposal.category).render();
              _modifiedProposal.subcategory = _modifiedProposal.subcategory || Pard.Widgets.Dictionary(_modifiedProposal.category).render();
              _displayProposal(_modifiedProposal, type);
              stopSpinner();
            }
          );
        });
        var _modifyMessage = Pard.Widgets.PopupContent(eventName, _formWidget);
        _modifyMessage.prependToContent($('<p>').text('Formulario: '+_proposal.form_category).css('margin-bottom','-0.5rem'));
        _modifyMessage.appendToContent(Pard.Widgets.Button(
          'Anula',
          function(){
            _modifyMessageRendered.remove();
            _messageProposalPrintedRendered.show();
          }).render()
          .addClass('cancelBtn-modifyProposalForm')
        );
        _modifyMessage.setCallback(function(){
          _content.empty();
          _popup.close();
        });
        var _modifyMessageRendered = _modifyMessage.render()
        _content.append(_modifyMessageRendered);
      });

      var _messageProposalPrinted = Pard.Widgets.PopupContent(eventName, _proposalPrinted);
      _messageProposalPrinted.setCallback(function(){
        _content.empty();
        _popup.close();
      });

      if (_proposal.amend){
        var _label = $('<span>').addClass('myProposals-field-label').text('Enmienda:').css('display', 'block');
        var _text = $('<span>').text(' ' + _proposal.amend);
        var _element = $('<div>').append($('<p>').append(_label, _text));
        _messageProposalPrinted.appendToContent(_element);
      };

      var _actionBtnContainer = $('<div>').addClass('actionButton-container-popup');
      _actionBtnContainer.append($('<span>').append(_modifyProposal).addClass('element-actionButton'));
      _actionBtnContainer.append($('<span>').append(_deleteProposalCaller).addClass('element-actionButton').css({ 'border-left':'1px solid #bebebe' }));
  
      _messageProposalPrinted.prependToContent(_actionBtnContainer);
      if (_proposal.proposal_id.indexOf("own") >= 0) {
        var _warningOwnText = $('<p>').text('Propuesta creada por los organizadores de la convocatoria');
        _messageProposalPrinted.prependToContent(_warningOwnText);
      }
      var _messageProposalPrintedRendered = _messageProposalPrinted.render();
      _content.append(_messageProposalPrintedRendered);

      _popup.open();
    }

    var _createOwnProposal = function(type, participants){
      var _contentCreateOwn = $('<div>').addClass('very-fast reveal full top-position').attr('id','popupForm');
      $('body').append(_contentCreateOwn);
      var _popup = new Foundation.Reveal(_contentCreateOwn, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});

      var _callbackCreatedProposal = function(data, callback){
        if(data['status'] == 'success') {
          if (Object.keys(data)[1] == 'space') Pard.Bus.trigger('addSpace', data.space);
          else if (Object.keys(data)[1] == 'artist'){Pard.Bus.trigger('addArtist', data.artist);}
          Pard.Widgets.Alert('', 'Propuesta creada correctamente.', _closePopupForm);
          callback();
        }
        else{
          Pard.Widgets.Alert('',Pard.Widgets.Dictionary(data.reason).render());
        }
      }

      var _sendProposal = function(callback){
        var _submitForm = _createOwnProposalWidget.getVal();
        _submitForm['call_id'] = call_id;
        _submitForm['event_id'] = event_id;
        if (type == 'artist') Pard.Backend.sendArtistOwnProposal(_submitForm, function(data){_callbackCreatedProposal(data, callback)});
        else if (type == 'space') Pard.Backend.sendSpaceOwnProposal(_submitForm, function(data){_callbackCreatedProposal(data, callback)});
      };

      _createOwnProposalWidget = Pard.Widgets.CreateOwnProposal(forms[type], type, participants);
      _createOwnProposalWidget.setSend(_sendProposal);
      var _message = Pard.Widgets.PopupContent('Crea y enscribe una propuesta de tipo '+Pard.Widgets.Dictionary(type).render().toLowerCase(), _createOwnProposalWidget);
      _message.setCallback(function(){
        _contentCreateOwn.remove();
        _popup.close();
      });
      _contentCreateOwn.append(_message.render());
      _closePopupForm = function(){
        _popup.close();
        _contentCreateOwn.remove();
      };
      _popup.open();
    }

    return{
      displayProposal: _displayProposal,
      displayArtistProgram: _displayArtistProgram,
      displaySpaceProgram: _displaySpaceProgram,
      createOwnProposal: _createOwnProposal,
      close: function(){
        _popup.close();
      }
    }
  }


}(Pard || {}));
