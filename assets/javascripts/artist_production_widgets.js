'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};


  ns.Widgets.ModifyProduction = function(proposal){

    var _caller = $('<button>').addClass('modify-content-button').attr({type: 'button'}).html(Pard.Widgets.IconManager('modify_section_content').render());
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Modifica tu producción', function(){return Pard.Widgets.ModifyProductionMessage(proposal)});

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ModifyProductionMessage = function(proposal){

    if (proposal['links'] != false && proposal['links'] != null){
      var _array = Object.keys(proposal['links']).map(function(key){return proposal['links'][key]});
      proposal['links'] = _array;
    };

    var _createdWidget = $('<div>');
    var _formContainer = $('<form>').addClass('popup-form');
    var _message = $('<div>').html(
      'No se modificará ninguno de los datos que has enviado a la convocatoria del conFusión.'
      ).addClass('message-form');

    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');

    var user_id = Pard.ProfileManager.getUserId();
    var profile_id = Pard.ProfileManager.getProfileId(proposal.proposal_id);

    _submitForm['proposal_id'] = proposal.proposal_id;
    _submitForm['profile_id'] = profile_id;

    var _form = Pard.Forms.ModifyProductionForm(proposal['category']);
    var _requiredFields = _form.requiredFields();
    _form = _form.render();

    for(var field in _form){
      if(proposal[field] && field != 'photos') _form[field]['input'].setVal(proposal[field]);
    };
    _form['category'].input.disable();

    var _filled = function(){
      var _check = true;
      for (field in _form){
        if ($.inArray(field, _requiredFields) >= 0){
          if(!(_form[field].input.getVal())) {
            if(field != 'links') _form[field].input.addWarning();
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
      _submitForm['photos'] = proposal['photos'];
      return _submitForm;
    }

    var _send = function(){
      Pard.Backend.modifyProduction(_getVal(), function(data){
        Pard.Events.ModifyProduction(data);
      });
    }
    
    for(var field in _form){
      if(field != 'links') _formContainer.append($('<div>').addClass(field+'-modifyProduction').append(_form[field]['label'].render().append(_form[field]['input'].render())));
    };

    var _closepopup = {};

    submitButton.on('click',function(){
        _closepopup();
        _send();
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



  ns.Widgets.MultimediaManager = function(proposal){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Añade un contenido multimedia');
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Modifica tu producción', function(){return Pard.Widgets.MultimediaManagerMessage(proposal)});


    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.MultimediaManagerMessage = function(proposal){

    if (proposal['links'] != false && proposal['links'] != null){
      var _array = Object.keys(proposal['links']).map(function(key){return proposal['links'][key]});
      proposal['links'] = _array;
    };

    var _createdWidget = $('<div>');
    var _formContainer = $('<form>').addClass('popup-form');
    var _message = $('<div>').html(
      'Puedes añadir contenidos multimedía en forma de videos o imagenes desde youtube, vimeo, vine, facebook, pintarest, instagram, flickr... Copia y pega el enlace correspondiente y dale un titúlo.'
      ).addClass('message-form');

    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');
    var profile_id = Pard.ProfileManager.getProfileId(proposal.proposal_id);

    _submitForm['proposal_id'] = proposal.proposal_id;
    _submitForm['profile_id'] = profile_id;

    var _thumbnail = $('<div>');
    var _url = [];

    if('photos' in proposal && proposal.photos != null){
      proposal.photos.forEach(function(photo){
        _url.push(photo);
        var _container = $('<span>');
        var _previousPhoto = $.cloudinary.image(photo,
          { format: 'jpg', width: 50, height: 50,
            crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
        console.log(_formContainer);
        var _icon = $('<span>').addClass('material-icons').html('&#xE888').css({
          'position': 'relative',
          'bottom': '20px',
          'cursor': 'pointer'
        });

        _icon.on('click', function(){
          _url.splice(_url.indexOf(photo), 1);
          _photos.setUrl(_url);
          _container.empty();
        });

        _container.append(_previousPhoto, _icon);
        _thumbnail.append(_container);
      });
    }

    Object.keys(proposal).forEach(function(key){
      if(proposal[key]) _submitForm[key] = proposal[key];
    });

    var _folder = 'photos';
    var _photos = Pard.Widgets.Cloudinary(_folder, _thumbnail, _url, 3);

    var _photosContainer = $('<div>').append(_photos.render(), _thumbnail);

    _formContainer.append(_photosContainer);

    var _send = function(photos, links){
      _submitForm['photos'] = photos;
      _submitForm['links'] = links;
      Pard.Backend.modifyProduction(_submitForm, function(data){
        Pard.Events.ModifyMultimedia(data);
      });
    }

   var _inputMultimedia = Pard.Widgets.InputMultimedia();
   _inputMultimedia.setVal(proposal['links']);
    _formContainer.append($('<div>').addClass('links-MultimediaManager').append(_inputMultimedia.render()));

    _createdWidget.append(_message, _formContainer, _invalidInput, _submitBtnContainer.append(submitButton));

    var _closepopup = {};

    submitButton.on('click',function(){
      var _links = _inputMultimedia.getVal();
      _closepopup();

      if(_photos.dataLength() == false){
        _send(_url, _links);
      } 
      else{
        _photos.submit();
      }
    });
   
    _photos.render().bind('cloudinarydone', function(e, data){
      _url.push(data['result']['public_id']);
      if(_url.length >= _photos.dataLength()){
        var _links = _inputMultimedia.getVal();
        _send(_url, _links);
      } 
    });

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }

  ns.Widgets.MultimediaSpaceManager = function(profile){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Añade un contenido multimedia');
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Modifica tu producción', function(){return Pard.Widgets.MultimediaSpaceManagerMessage(profile)});

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.MultimediaSpaceManagerMessage = function(profile){

    if (profile['links'] != false && profile['links'] != null){
      var _array = Object.keys(profile['links']).map(function(key){return profile['links'][key]});
      profile['links'] = _array;
    };

    var _createdWidget = $('<div>');
    var _formContainer = $('<form>').addClass('popup-form');
    var _message = $('<div>').html(
      'Puedes añadir contenidos multimedía en forma de videos o imagenes desde youtube, vimeo, vine, facebook, pintarest, instagram, flickr... Copia y pega el enlace correspondiente y dale un titúlo.'
      ).addClass('message-form');

    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');

    _submitForm['profile_id'] = profile.profile_id;

    var _thumbnail = $('<div>');
    var _url = [];

    if('photos' in profile && profile.photos != null){
      profile.photos.forEach(function(photo){
        _url.push(photo);
        var _container = $('<span>');
        var _previousPhoto = $.cloudinary.image(photo,
          { format: 'jpg', width: 50, height: 50,
            crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
        console.log(_formContainer);
        var _icon = $('<span>').addClass('material-icons').html('&#xE888').css({
          'position': 'relative',
          'bottom': '20px',
          'cursor': 'pointer'
        });

        _icon.on('click', function(){
          _url.splice(_url.indexOf(photo), 1);
          _photos.setUrl(_url);
          _container.empty();
        });

        _container.append(_previousPhoto, _icon);
        _thumbnail.append(_container);
      });
    }

    Object.keys(profile).forEach(function(key){
      if(profile[key]) _submitForm[key] = profile[key];
    });

    var _folder = 'photos';
    var _photos = Pard.Widgets.Cloudinary(_folder, _thumbnail, _url, 3);

    var _photosContainer = $('<div>').append(_photos.render(), _thumbnail);

    _formContainer.append(_photosContainer);

    var _send = function(photos, links){
      _submitForm['photos'] = photos;
      _submitForm['links'] = links;
      console.log(_submitForm);
      Pard.Backend.modifyProfile(_submitForm, Pard.Events.CreateProfile);
    }

   var _inputMultimedia = Pard.Widgets.InputMultimedia();
   _inputMultimedia.setVal(profile['links']);
    _formContainer.append($('<div>').addClass('links-MultimediaManager').append(_inputMultimedia.render()));

    _createdWidget.append(_message, _formContainer, _invalidInput, _submitBtnContainer.append(submitButton));

    var _closepopup = {};

    submitButton.on('click',function(){
      var _links = _inputMultimedia.getVal();
      _closepopup();

      if(_photos.dataLength() == false){
        _send(_url, _links);
      } 
      else{
        _photos.submit();
      }
    });
   
    _photos.render().bind('cloudinarydone', function(e, data){
      _url.push(data['result']['public_id']);
      if(_url.length >= _photos.dataLength()){
        var _links = _inputMultimedia.getVal();
        _send(_url, _links);
      } 
    });

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
