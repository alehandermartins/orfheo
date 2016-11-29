'use strict';

(function(ns){

  ns.Displayer = function(the_event, forms){

    var event_id = the_event.event_id;
    var call_id = the_event.call_id;
    var eventName = the_event.name;

    var _displayProposal = function(proposal, type){

      var form = forms[type][proposal.form_category];

      var _content = $('<div>').addClass('very-fast reveal full');
      _content.empty();
      $('body').append(_content);

      var _mainPopup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
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
              _deleteProposalBackend[type](proposal.proposal_id, event_id, function(data){
                deleteCallback(data);
                spinnerDeleteProposal.stop();
                _mainPopup.close();
                _content.remove()
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
        console.log(data);
        if (data['status'] == 'success'){
          console.log('changed');
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

      var closepopup = function(){};

      var _modifyProposalBackend = {
        artist: Pard.Backend.modifyArtistProposal,
        space: Pard.Backend.modifySpaceProposal
      }
      _modifyProposal.click(function(){
        _content.empty();
        var _formWidget = Pard.Widgets.OwnProposalForm(form, type, proposal.form_category);
        _formWidget.setVal(proposal);
        _formWidget.showAll();
        _formWidget.setSend(function(){
          var _submitForm = _formWidget.getVal();
          _submitForm['proposal_id'] = proposal.proposal_id;
          _submitForm['event_id'] = event_id;
          _submitForm['call_id'] = call_id, 
          _modifyProposalBackend[type](_submitForm, modifyCallback);
        });
        var _message = Pard.Widgets.PopupContent(eventName, _formWidget);
        _message.setCallback(function(){
          _content.remove();
          _mainPopup.close();
        });
        _content.append(_message.render());
      });

      var _message = Pard.Widgets.PopupContent(eventName, _proposalPrinted);
      _message.setCallback(function(){
        _content.remove();
        _mainPopup.close();
      });

      if (proposal.amend){
        var _label = $('<span>').addClass('myProposals-field-label').text('Enmienda:').css('display', 'block');
        var _text = $('<span>').text(' ' + proposal.amend);
        var _element = $('<div>').append($('<p>').append(_label, _text));
        _message.appendToContent(_element);
      };

      var _actionBtnContainer = $('<div>').addClass('actionButton-container-popup');
      // _actionBtnContainer.append(_modifyProposal);
      _actionBtnContainer.append(_deleteProposalCaller);
  
      _message.prependToContent(_actionBtnContainer);
      if (proposal.proposal_id.indexOf("own") >= 0) {
        var _warningOwnText = $('<p>').text('Propuesta creada por los organizadoores de la convocatoria');
        _message.prependToContent(_warningOwnText);
      }
      _content.append(_message.render());

      _mainPopup.open();
    }

    var _createOwnProposal = function(type, participants){
      var _content = $('<div>').addClass('very-fast reveal full top-position').attr('id','popupForm');
      _content.empty();
      $('body').append(_content);
      var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});

      var _callbackCreatedProposal = function(data){
        if(data['status'] == 'success') {
          if (Object.keys(data)[1] == 'space') Pard.Bus.trigger('addSpace', data.space);
          else if (Object.keys(data)[1] == 'artist'){Pard.Bus.trigger('addArtist', data.artist);}
          Pard.Widgets.Alert('', 'Propuesta creada correctamente.', _closePopupForm);
        }
        else{
          Pard.Widgets.Alert('',Pard.Widgets.Dictionary(data.reason).render());
          // Pard.Widgets.Alert('¡Error!', 'No se ha podido guardar los datos', function(){location.reload();})
        }
      }

      var _sendProposal = function(){
        var _submitForm = _createOwnProposalWidget.getVal();
        _submitForm['call_id'] = call_id;
        _submitForm['event_id'] = event_id;
        if (type == 'artist') Pard.Backend.sendArtistOwnProposal(_submitForm, _callbackCreatedProposal);
        else if (type == 'space') Pard.Backend.sendSpaceOwnProposal(_submitForm, _callbackCreatedProposal);
      };

      _createOwnProposalWidget = Pard.Widgets.CreateOwnProposal(forms[type], type, participants);
      _createOwnProposalWidget.setSend(_sendProposal);
      var _message = Pard.Widgets.PopupContent('Crea y enscribe una propuesta de tipo '+Pard.Widgets.Dictionary(type).render().toLowerCase(), _createOwnProposalWidget);
      _message.setCallback(function(){
        _content.remove();
        _popup.close();
      });
      _content.append(_message.render());
      _closePopupForm = function(){
        _popup.close();
        _content.remove();
      };
      _popup.open();
    }

    return{
      displayProposal: _displayProposal,
      createOwnProposal: _createOwnProposal
    }
  }


}(Pard || {}));
