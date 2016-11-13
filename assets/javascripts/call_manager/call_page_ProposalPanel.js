'use strict';

(function(ns){
    ns.Widgets = ns.Widgets || {};  


  ns.Widgets.ProposalsPanelContent = function(call) {

    var proposals = Pard.CachedProposals;
  	
    var _createdWidget = $('<div>');

    var _addProposalBox = $('<div>').addClass('add-proposal-box');
    var _whiteListBox = $('<div>').addClass('white-list-box');

    var _addProposalText = $('<p>').text('Añade propuestas a tu convocatoria para que puedas insertarlas en la programación').addClass('initial-text-proposalPanel');
    var _whiteListText = $('<p>').text('Habilita usuarios para que puedan enviar una propuesta en cualquier momento').addClass('initial-text-proposalPanel');

    var _artistIcon = Pard.Widgets.IconManager('artist').render().addClass('create-profile-btn-icon');
    var _spaceIcon = Pard.Widgets.IconManager('space').render().addClass('create-profile-btn-icon');
    var _artistButtonHtml = $('<div>').append(_artistIcon, $('<span>').text('Artista').addClass('create-profile-btn-text'));
    var _spaceButtonHtml = $('<div>').append(_spaceIcon, $('<span>').text('Espacio').addClass('create-profile-btn-text'));


  	var _createSpaceCaller = $('<div>').html(_spaceButtonHtml).addClass('create-space-proposal-call-page-btn');

  	var _createArtistCaller = $('<div>').html(_artistButtonHtml).addClass('create-artist-proposal-call-page-btn');

    var _spacePopup = Pard.Widgets.PopupCreator(_createSpaceCaller, 'Crea un espacio', function(){ return Pard.Widgets.CreateOwnSpaceProposal(call, _spacesList)});

    var _artistPopup = Pard.Widgets.PopupCreator(_createArtistCaller, 'Crea una propuesta artística', function(){ return Pard.Widgets.CreateOwnArtistProposal(call, _artistsList)});

    var _artistsList = $('<ul>').addClass('own-proposals-list').attr('id','artist-list-call-page');
    // .attr({'style':'list-style-type:none'})
    var _spacesList= $('<ul>').addClass('own-proposals-list').attr('id','space-list-call-page');

    var _spacesOwnBox = $('<div>').addClass('ownBox-call-manager');
    var _artistsOwnBox = $('<div>').addClass('ownBox-call-manager');

    // var _artistProposalsList = [];

    proposals.forEach(function(proposal){
      var lastElement = proposal.profile_id.split('-').pop();
      if (lastElement == 'own') {
        var _proposalContainer = $('<li>');
        if (proposal.type == 'artist'){
          var _artistProposal = Pard.Widgets.PrintOwnProposal(proposal, _proposalContainer);
          // _artistProposalsList.push(_artistProposal);
          _artistsList.prepend(_proposalContainer.append(_artistProposal.render()));
          // _artistProposal.setDeleteProposalCallback(_proposalContainer);
        }
        else{
          var _spaceProposal = Pard.Widgets.PrintOwnProposal(proposal, _proposalContainer);
          _spacesList.prepend(_proposalContainer.append(_spaceProposal.render()));
        }
      }
    });

    var _whiteList = Pard.Widgets.WhiteList(call);

    // var _buttons = $('<div>').append(_spacePopup.render(), _artistPopup.render()).addClass('buttonsCOntainer-call-page');
    
    _spacesOwnBox.append(_spacePopup.render().addClass('buttonsCOntainer-call-page'), _spacesList);
    _artistsOwnBox.append(_artistPopup.render().addClass('buttonsCOntainer-call-page'), _artistsList);
    _addProposalBox.append(_addProposalText, _artistsOwnBox, _spacesOwnBox);
    _whiteListBox.append(_whiteListText, _whiteList.render());	
    _createdWidget.append(_addProposalBox, _whiteListBox);

  	return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.PrintOwnProposal = function(proposal, artistProposalContainer){
    var _createdWidget = $('<span>');

    if (proposal['title']) var _namePopupCaller = $('<a>').attr({'href':'#'}).text(proposal['name']+' - ' + proposal['title']);
    else var _namePopupCaller = $('<a>').attr({'href':'#'}).text(proposal['name']);
    
    var _form;

    if (proposal.type == 'artist') {_form = Pard.Forms.ArtistCall(proposal.category);
    }      
    else _form = Pard.Forms.SpaceCall();

    var _popup = Pard.Widgets.PopupCreator(_namePopupCaller, 'conFusión 2016', function(){return Pard.Widgets.PrintOwnProposalMessage(proposal, _form.render(), artistProposalContainer)});

    _createdWidget.append(_popup.render());
    
    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.PrintOwnProposalMessage = function(proposal, form, artistProposalContainer){
    var _createdWidget = $('<div>');

    var _proposalPrinted = Pard.Widgets.PrintProposal(proposal, form).render();

    var _deleteProposalCaller = $('<a>').attr('href','#').text('Elimina esta propuesta').addClass('deleteProfile-caller');

    var closepopup;

    var _deleteProposal = Pard.Widgets.PopupCreator(_deleteProposalCaller, '¿Estás seguro/a?', function(){return Pard.Widgets.DeleteOwnProposalMessage(proposal.proposal_id, closepopup, artistProposalContainer)}, 'alert-container-full');

    _createdWidget.append(_proposalPrinted, _deleteProposal.render());

    return{
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        closepopup = callback;
      }
    }

  }

  ns.Widgets.DeleteOwnProposalMessage = function(proposal_id, closepopup, artistProposalContainer){  
    
    var _createdWidget = $('<div>');
    var _yesBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn confirm-delete-btn').text('Confirma');
    var _noBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn cancel-delete-btn').text('Anula');

    var spinnerDeleteProposal =  new Spinner().spin();

    _yesBtn.click(function(){
      $('body').append(spinnerDeleteProposal.el);
      Pard.Backend.deleteProposal(proposal_id, _deleteProposalCallback);
      // artistProposalContainer.remove();
      // var _proposals = Pard.CachedProposals;
      // var _index;
      // _proposals.some(function(proposal, index){ 
      //   if (proposal.proposal_id == proposal_id ) {
      //     _index = index;
      //     return true;
      //   }
      // });
      // _proposals.splice(_index, 1);
      // Pard.CachedProposals = _proposals;
      // $('#tablePanel').empty();
      // $('#tablePanel').append(Pard.Widgets.TablePanelContent().render());
      // $('#programPanel').empty();
      // Pard.CachedCall.proposals = _proposals;
      // Pard.Widgets.Program = [];
      // Pard.Spaces = [];
      // Pard.ShownSpaces = [];
      // Pard.Artists = {};
      closepopup();
    });

     var _deleteProposalCallback = function(data){
      if (data['status'] == 'success'){
        $.wait(
          '', 
          function(){
            artistProposalContainer.remove();
            var _proposals = Pard.CachedProposals;
            var _index;
            _proposals.some(function(proposal, index){ 
              if (proposal.proposal_id == proposal_id ) {
                _index = index;
                return true;
              }
            });
            _proposals.splice(_index, 1);
            Pard.CachedProposals = _proposals;
            var _indexP = [];
            Pard.CachedCall.program.forEach(function(show, index){
              if (show.participant_proposal_id == proposal_id || show.host_proposal_id == proposal_id) {
                _indexP.push(index);
              }
            });
            _indexP.forEach(function(pos, ind){
              var _currentPos = pos - ind;
              Pard.CachedCall.program.splice(_currentPos,1);
            });
            // var _indexOrder;
            // Pard.CachedCall.order.some(function(space, index){
            //   if (space != proposal_id) {
            //     console.log(space);
            //     _indexOrder = index;
            //     return true;
            //   }
            // });
            // Pard.CachedCall.order.splice(_indexOrder, 1);
            // var _saveProgramCallback = function(data){
            //   console.log(data);
            // }
            // Pard.Backend.program(' ', Pard.CachedCall.program,  Pard.CachedCall.order, _saveProgramCallback);
            // console.log('done');
            $('#tablePanel').empty();
            $('#programPanel').empty();
            Pard.Widgets.Program = [];
            Pard.Spaces = [];
            Pard.ShownSpaces = [];
            Pard.Artists = {}; 
          },
          function(){
            spinnerDeleteProposal.stop();
            Pard.Widgets.Alert('', 'Propuesta eliminada correctamente.');
          }
        )
      }
      else{
        var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
        if (typeof _dataReason == 'object'){
          spinnerDeleteProposal.stop();
          Pard.Widgets.Alert('¡Error!', 'No se ha podido guardar los datos', location.reload());
      }
      else{
        console.log(data.reason);
        spinnerDeleteProposal.stop();
        Pard.Widgets.Alert('', _dataReason, location.reload());
      }
    }
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
          callback()
        });
      }
    }
  }


  ns.Widgets.CreateOwnSpaceProposal = function(call, spacesList){
  	var _createdWidget = $('<div>');

  	var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Crea');
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');
    var _preSelected = 'music';
    var _closepopup = {};

    var user_id = call.user_id;

    _submitForm['call_id'] = call.call_id;

    _submitForm['type'] = 'space';
    _submitForm['category'] = _preSelected;

    var _content = $('<form>').addClass('popup-form');

   	var _fieldset = $('<fieldset>');
   	var _requiredFields = Pard.Forms.CreateSpaceProposal().requiredFields();
    var _form = Pard.Forms.CreateSpaceProposal().render();
    _form['email'].input.setVal('hola@beniconfusionfest.es');
    _form['phone'].input.setVal('000 000 000');
    for(var field in _form){
    	_content.append($('<div>').addClass('callPage-createSpaceProposal'	).append(_form[field]['label'].render().append(_form[field]['input'].render()),_form[field]['helptext'].render()));
    };


    _createdWidget.append(_content, _invalidInput, _submitBtnContainer.append(submitButton));
   
    var _filled = function(){
      var _check = true;
      for(var field in _form){
        if ($.inArray(field, _requiredFields) >= 0 ){
          if(!(_form[field].input.getVal())) {
            _form[field].input.addWarning();
            _invalidInput.text('Por favor, revisa los campos obligatorios.');
            _check = false;
          }
      	}
  		}
      if (_check) _invalidInput.empty();
      return _check;    
    };


    var _getVal = function(url){
      for(var field in _form){
         _submitForm[field] = _form[field].input.getVal();
      };
      return _submitForm;
    }

    var _closepopup = function(){};

    submitButton.on('click',function(){
      if(_filled() == true){
        var spinner =  new Spinner().spin();
      // $.wait(
      //   '', 
      //   function(){
          $('body').append(spinner.el);
          submitButton.attr('disabled',true);
          var _sentProposalEvent = function(data){
            $.wait(
              '', 
              function(){
                Pard.Events.SendOwnProposal(data);
              },
              function(){
                submitButton.attr('disabled',false);
                _closepopup();
                spinner.stop();}
            )
          }
          var _ownProposal = _getVal();
          var uri = Pard.Widgets.RemoveAccents("https://maps.googleapis.com/maps/api/geocode/json?address=" + _ownProposal.address.route + "+" + _ownProposal.address.street_number + "+" + _ownProposal.address.locality + "+" + _ownProposal.address.postal_code + "&key=AIzaSyCimmihWSDJV09dkGVYeD60faKAebhYJXg");
            $.post(uri, function(data){
              if(data.status == "OK" && data.results.length > 0){
                _ownProposal['address']['location'] = data.results[0].geometry.location;
               Pard.Backend.sendOwnProposal(_ownProposal, _sentProposalEvent);
              }
              else {
                spinner.stop();
                submitButton.attr('disabled',false);
                var _content = $('<div>').addClass('very-fast reveal full');
                _content.empty();
                $('body').append(_content);
                var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
                var _closepopupAlert = function(){
                  _popup.close();
                }
                var _message = Pard.Widgets.PopupContent('¡Atencion!', Pard.Widgets.AlertNoMapLocation(_ownProposal, _closepopupAlert, function(){
                    Pard.Backend.sendOwnProposal(_ownProposal,_sentProposalEvent);
                  }));
                _message.setCallback(function(){
                  _content.remove();
                  _popup.close();
                }); 
                _content.append(_message.render());
                _popup.open();

              }
            });
          // },

      }
    });

    // _photos.cloudinary().bind('cloudinarydone', function(e, data){
    //   _url.push(data['result']['public_id']);
    //   if(_url.length >= _photos.dataLength()) _send(_url);
    // });
     

  	return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
      _closepopup = callback;      	
      }
    }  	
  }



  ns.Widgets.CreateOwnArtistProposal = function(call, artistsList){

  	var _createdWidget = $('<div>');

    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Crea');
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');
    var _preSelected = 'music';
    var _closepopup = {};

    var user_id = call.user_id;

   	// var profile_id = profile.profile_id;
    // var _thumbnail = $('<div>');
    // var _url = [];

    // var _folder = user_id + '/' + profile_id + '/photos';
    // var _photos = Pard.Widgets.Cloudinary(_folder, _thumbnail, _url, 4);

    // var _photosLabel = $('<label>').text('Fotos de tu arte (máximo 4, tamaño inferior a 500kb)').css({
    //   'padding-top': '0.5rem'
    // });
    // var _photosContainer = $('<div>').append(_photosLabel,_photos.render(), _thumbnail).css('margin-bottom','1rem');

    // _submitForm['user_id'] = user_id;
    _submitForm['call_id'] = call.call_id;
    // _submitForm['profile_id'] = '26f6fc6d-ac81-451b-bd73-ee035e67538c';
    _submitForm['type'] = 'artist';
    _submitForm['category'] = _preSelected;
    // _submitForm['description'] = '';

    // _submitForm['phone'] = '000000000';
    // _submitForm['email'] = 'email@email.email';
    // _submitForm['conditions'] = "true";
    // _submitForm['repeat'] = "true";
    // _submitForm['waiting_list'] = 'true';
    // _submitForm['city'] = 'vvv';
    // _submitForm['zip_code'] = 000000;
    // _submitForm['description'] = 'bla bla bla';


    var _content = $('<form>').addClass('popup-form');

    var _form = {};
    var _requiredFields = [];

    var _printForm = function(_selected){
    	_content.empty();
	   	var _fieldset = $('<fieldset>');
	   	_requiredFields = Pard.Forms.CreateArtistProposal(_selected).requiredFields();
      _form = Pard.Forms.CreateArtistProposal(_selected).render();
      _form['email'].input.setVal('hola@beniconfusionfest.es');
      _form['phone'].input.setVal('000 000 000');
      for(var field in _form){
      	_content.append($('<div>').addClass('callPage-createArtistProposal'	).append(_form[field]['label'].render().append(_form[field]['input'].render()),_form[field]['helptext'].render()));
      };
      _submitForm['category'] = _selected;
    }
     

    var categorySelectCallback = function(){
      var _selected = $(this).val();
      _printForm(_selected);
    };

    var _categorySelector = Pard.Widgets.OrfheoArtCatSelector(categorySelectCallback);
    // var _nameInput = Pard.Widgets.Input('','text');
    var _categoryLabel = $('<label>').text('Selecciona una categoría *');
    // var _nameLabel = $('<label>').text('Nombre Artístico *');

    var _category = $('<div>').append(_categoryLabel.append(_categorySelector.render())).addClass('popup-categorySelector');

    _createdWidget.append(_category, _content, _invalidInput, _submitBtnContainer.append(submitButton));
    _printForm(_preSelected);
   
    var _filled = function(){
      var _check = true;
      for(var field in _form){
        if ($.inArray(field, _requiredFields) >= 0 ){
          if(!(_form[field].input.getVal())) {
            _form[field].input.addWarning();
            _invalidInput.text('Por favor, revisa los campos obligatorios.');
            _check = false;
          }
      	}
  		}
      if (_check) _invalidInput.empty();
      return _check;    
    };


    var _getVal = function(url){
      for(var field in _form){
         _submitForm[field] = _form[field].input.getVal();
      };
      // _submitForm['photos'] = url;
      return _submitForm;
    }

    // var _send = function(url){
    //   Pard.Backend.sendProposal(_getVal(url), Pard.Events.SendProposal);
    // }

    submitButton.on('click',function(){
      if(_filled() == true){
        var _ownProposal = _getVal();
        Pard.Backend.sendOwnProposal(_ownProposal, Pard.Events.SendOwnProposal);
        // var proposals = Pard.CachedProposals;
        // var _proposalContainer = $('<li>');
        // var _artistProposal = Pard.Widgets.PrintOwnProposal(proposals[proposals.length -1], _proposalContainer);
        // artistsList.prepend(_proposalContainer.append(_artistProposal.render()));
        _closepopup();
      }
    });
    // _photos.cloudinary().bind('cloudinarydone', function(e, data){
    //   _url.push(data['result']['public_id']);
    //   if(_url.length >= _photos.dataLength()) _send(_url);
    // });

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }


  ns.Widgets.WhiteList = function(call){
  	var _createdWidget = $('<div>');
    var _emailsNames = [{id:'', text:''}];
    var _namesList = [];
    var _emailsList = [];
    call.proposals.forEach(function(proposal){
    	var email = {id: proposal.email, text: proposal.email};
    	if($.inArray(proposal.email, _emailsList) < 0) {
    		_emailsNames.push(email);
    		_emailsList.push(proposal.email);
    	}
    	var name = {id: proposal.email, text: proposal['name']};
    	if($.inArray(proposal['name'], _namesList) < 0){
    	  _emailsNames.push(name);
    		_namesList.push(proposal['name']);
    	}
    });

    var _emailNameInput = Pard.Widgets.WhiteListInput(_emailsNames);

    _emailNameInput.setVal(call.whitelist);

		var _submitBtnContainer = $('<div>').addClass('submit-whitelist-call-manager-container');
   	var _submitBtnOuterContainer = $('<div>').addClass('submit-btn-outer-container-call-manager');
   	_submitBtnOuterContainer.append(_submitBtnContainer);
   	var _successBox = $('<span>').attr({id:'successBox-whiteList'});

   	var _submitBtn = Pard.Widgets.Button('Guarda los cambios',
     function(){
      _sendWhiteList();
    });
  
    var _sendWhiteList = function(){
      var _wl = _emailNameInput.getVal();      
      Pard.Backend.whitelist(call.call_id, _wl, Pard.Events.WhiteList);      
    }


	 	_submitBtnContainer.append(_successBox, _submitBtn.render());

    var _emailNameImputRendered = _emailNameInput.render();

    _createdWidget.append(_submitBtnOuterContainer, $('<label>').append(_emailNameImputRendered));

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


}(Pard || {}));
