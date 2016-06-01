'use strict';

(function(ns){

  ns.Widgets.ProposalsPanelContent = function(call) {

  	var _createdWidget = $('<div>');

    var _addProposalBox = $('<div>').addClass('add-proposal-box');
    var _whiteListBox = $('<div>').addClass('white-list-box');

    var _addProposalText = $('<p>').text('Añade propuestas a tu convocatoria para que puedas insertarlas en la programación').addClass('initial-text-proposalPanel');
    var _whiteListText = $('<p>').text('Habilita usuarios para que puedan enviar una propuesta en cualquier momento').addClass('initial-text-proposalPanel');

  	var _createSpaceCaller = $('<button>').addClass('create-space-proposal-call-page-btn').attr({type: 'button'}).text('Espacio');

  	var _createArtistCaller = $('<button>').addClass('create-artist-proposal-call-page-btn').attr({type: 'button'}).text('Artista');

    var _spacePopup = Pard.Widgets.PopupCreator(_createSpaceCaller, 'Crea un espacio', function(){ return Pard.Widgets.CreateSpaceProposal(call)});

    var _artistPopup = Pard.Widgets.PopupCreator(_createArtistCaller, 'Crea una propuesta artística', function(){ return Pard.Widgets.CreateArtistProposal(call)});

    var _whiteList = Pard.Widgets.WhiteList(call);

    _addProposalBox.append(_addProposalText, _spacePopup.render(), _artistPopup.render());
    _whiteListBox.append(_whiteListText, _whiteList.render());	
    _createdWidget.append(_addProposalBox, _whiteListBox);

  	return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.CreateSpaceProposal = function(call){
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

    _submitForm['call_id'] = call.call_id;
    // _submitForm['profile_id'] = profile.profile_id; profile_id del organizador
    _submitForm['type'] = 'space';
    _submitForm['category'] = _preSelected;

    // _submitForm['phone'] = '000000000';
    // _submitForm['email'] = 'email@email.email';
    // _submitForm['conditions'] = "true";
    // _submitForm['description'] = 'bla bla bla';
    // _submitForm['responsible'] = 'xyz';


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
      // _submitForm['photos'] = url;
      return _submitForm;
    }

    // var _send = function(url){
    //   Pard.Backend.sendProposal(_getVal(url), Pard.Events.SendProposal);
    // }

    var _closepopup = function(){};

    submitButton.on('click',function(){
      if(_filled() == true){
        Pard.Backend.sendOwnProposal(_getVal(), Pard.Events.SendOwnProposal);
        _closepopup();
        // if(_photos.dataLength() == false) _send(_url);
        // else{
        //   _photos.submit();
        // }
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



  ns.Widgets.CreateArtistProposal = function(call){

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
    _submitForm['description'] = '';

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
     

    var _labelsCategories = ['Música', 'Artes Escénicas', 'Exposición', 'Poesía',  'Audiovisual', 'Street Art', 'Taller', 'Otros'];
    var _valuesCategories = ['music', 'arts', 'expo', 'poetry', 'audiovisual', 'street_art', 'workshop', 'other'];


    var categorySelectCallback = function(){
      var _selected = $(this).val();
      _printForm(_selected);
    };

    var _categorySelector = Pard.Widgets.Selector(_labelsCategories, _valuesCategories, categorySelectCallback);
    // var _nameInput = Pard.Widgets.Input('','text');
    _categorySelector.setClass('category-input');
    var _categoryLabel = $('<label>').text('Selecciona una categoría *');
    // var _nameLabel = $('<label>').text('Nombre Artístico *');

    var _category = $('<div>').append(_categoryLabel.append(_categorySelector.render())).addClass('callPage-categorySelector');

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
              console.log(_form[field].input.getVal())

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
        Pard.Backend.sendOwnProposal(_getVal(), Pard.Events.SendOwnProposal);
        _closepopup();
        // if(_photos.dataLength() == false) _send(_url);
        // else{
        //   _photos.submit();
        // }
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

		var _submitBtnContainer = $('<div>').addClass('submit-btn-call-manager-container');
   	var _submitBtnOuterContainer = $('<div>').addClass('submit-btn-outer-container-call-manager');
   	_submitBtnOuterContainer.append(_submitBtnContainer);
   	var _successBox = $('<span>').attr({id:'successBox-whiteList'});

   	var _submitBtn = Pard.Widgets.Button('Guarda los cambios', function(){console.log(_emailNameInput.getVal())});

	 	_submitBtnContainer.append(_successBox, _submitBtn.render());

    _createdWidget.append(_emailNameInput.render(), _submitBtnOuterContainer);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


}(Pard || {}));
