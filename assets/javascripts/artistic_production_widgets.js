'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};


  ns.Widgets.MultimediaManager = function(proposal_id, sectionContent){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Añade un contenido multimedia');
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Modifica tu producción', function(){return Pard.Widgets.MultimediaManagerMessage(proposal_id, sectionContent)});


    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.MultimediaManagerMessage = function(proposal_id, sectionContent){

    var proposal = Pard.ProfileManager.getProposal(proposal_id);

    var _createdWidget = $('<div>');
    var _formContainer = $('<form>').addClass('popup-form');
    var _message = $('<div>').html(
      'Puedes añadir contenidos multimedía en forma de videos o imagenes desde youtube, vimeo, vine, facebook, pintarest, instagram, flickr... Copia y pega el enlace correspondiente y dale un titúlo.'
      ).addClass('message-form');


    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');

    // var user_id = Pard.ProfileManager.getUserId();
    // var profile_id = Pard.ProfileManager.getProfileId(proposal_id);

    
    // _submitForm['proposal_id'] = proposal.proposal_id;
    // _submitForm['profile_id'] = profile_id;

    // var _form = Pard.Forms.ArtisticProduction();
    // var _requiredFields = [];
    // _form = _form.render();

    // for(var field in _form){
    //   if(proposal[field]) _form[field]['input'].setVal(proposal[field]);
    // };

    var _filled = function(){
      var _check = true;
      //   if(!(_form['links'].input.getVal())) {
      //     _form['links'].input.addWarning();
      //     _invalidInput.text('Por favor, revisa los campos obligatorios.');
      //     _check = false;
      //   }
      // if (_check) _invalidInput.empty();
      return _check;    
    };

    // var _url = [];
    
    // if('photos' in proposal && proposal.photos != null){
    //   proposal.photos.forEach(function(photo){
    //     _url.push(photo);
    //   });
    // }

    var _getVal = function(){
      if (proposal['links']) {
        proposal['links'].push(_inputMultimedia.getVal());
      }
      else {
          var _linksArray = [];
          _linksArray.push(_inputMultimedia.getVal());
          proposal['links'] = _linksArray;
      }  
      return proposal;
    }

    var _send = function(){
      console.log(_getVal());
      Pard.Backend.modifyProduction(_getVal(), function(data){
        Pard.Events.ModifyProduction(data, sectionContent);
      });
    }

   var _inputMultimedia = Pard.Widgets.InputMultimedia();
    _formContainer.append($('<div>').addClass('links-MultimediaManager').append(_inputMultimedia.render()));

    var _closepopup = {};

    submitButton.on('click',function(){
      if(_filled() == true){
        _closepopup();
        _send();
      }
    });

   
    _createdWidget.append(_message, _formContainer, _invalidInput, _submitBtnContainer.append(submitButton));

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
