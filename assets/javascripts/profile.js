'use strict';

(function(ns){


  ns.Widgets.ModifyProfile = function(profile){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Modifica el perfil');
    var _submitBtn = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');

    var _popup = Pard.Widgets.PopupCreator(_caller, 'Modifica tus datos', function(){
      return Pard.Widgets.ModifyProfileMessage(profile, _submitBtn);
    });

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ModifyProfileMessage = function(profile, submitButton){

    var _createdWidget = $('<div>');
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');
    var _submitForm = {};

    var user_id = Pard.ProfileManager.getUserId();
    var profile_id = profile.profile_id;

    var _thumbnail = $('<div>');
    var _url = [];

    if('profile_picture' in profile && profile.profile_picture != null){
      profile.profile_picture.forEach(function(photo){
        _url.push(photo);
        var _container = $('<span>');
        var _previousPhoto = $.cloudinary.image(photo,
          { format: 'jpg', width: 50, height: 50,
            crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
        _createdWidget.append(_previousPhoto);
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

    var _folder = user_id + '/' + profile_id + '/profile_picture';
    var _photos = Pard.Widgets.Cloudinary(_folder, _thumbnail, _url, 1);

    _createdWidget.append(_photos.render(), _thumbnail);

    _submitForm['profile_id'] = profile.profile_id;
    _submitForm['type'] = profile.type;

    var _form = Pard.Forms.ProfileForms(profile.type).render();
    var _requiredFields = _form.requiredFields();
    _form = _form.render();

    for(var field in _form){
      if(profile[field]) _form[field].input.setVal(profile[field]);
    };

    for(var field in _form){
      _createdWidget.append(_form[field].label.render().append(_form[field].input.render()), _form[field].helptext.render());
    };

    _createdWidget.append(_invalidInput, _submitBtnContainer.append(submitButton));

    var _filled = function(){
      var _check = true;
      for (field in _form){
        if ($.inArray(field, _requiredFields) >= 0){
          if(!(_form[field].input.getVal())) {
            _form[field].input.addWarning();
            _invalidInput.text('Por favor, revisa los campos obligatorios.');
            _check = false;}
        }
      }
      if (_check) _invalidInput.empty();
      return _check;    
    };

    var _getVal = function(url){
      for(var field in _form){
         _submitForm[field] = _form[field].input.getVal();
      };
      _submitForm['profile_picture'] = url;
      return _submitForm;
    }

    var _send = function(url){
      Pard.Backend.modifyProfile(_getVal(url), Pard.Events.CreateProfile);
    }

    var _closepopup = {};

    submitButton.on('click',function(){
      if(_filled() == true){
        _closepopup();
        if(_photos.dataLength() == false) _send(_url);
        else{
          _photos.submit();
        }
      }
    });

    _photos.render().bind('cloudinarydone', function(e, data){
      _url.push(data['result']['public_id']);
      if(_url.length >= _photos.dataLength()) _send(_url);
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


  ns.Widgets.ToUserPageLink = function(){

      var _createdButton = $('<a>').attr('href','/users/').text('Pagina de usuario')

    return {
      render: function(){
        return _createdButton;
      }
    }
  }


  ns.Widgets.ModifyProduction = function(proposal_id, sectionContent){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Modifica producción');
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Modifica tu producción', function(){return Pard.Widgets.ModifyProductionMessage(proposal_id, sectionContent)});

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ModifyProductionMessage = function(proposal_id, sectionContent){

    var proposal = Pard.ProfileManager.getProposal(proposal_id);
    var _createdWidget = $('<div>');

    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');

    var user_id = Pard.ProfileManager.getUserId();
    var profile_id = Pard.ProfileManager.getProfileId(proposal_id);

    _submitForm['proposal_id'] = proposal.proposal_id;
    _submitForm['profile_id'] = profile_id;

    var _form = Pard.Forms.ArtisticProduction();
    var _requiredFields = _form.requiredFields();
    _form = _form.render();

    for(var field in _form){
      if(proposal[field]) _form[field]['input'].setVal(proposal[field]);
    };

    var _filled = function(){
      var _check = true;
      for (field in _form){
        if ($.inArray(field, _requiredFields) >= 0){
          if(!(_form[field].input.getVal())) {
            _form[field].input.addWarning();
            _invalidInput.text('Por favor, revisa los campos obligatorios.');
            _check = false;}
        }
      }
      if (_check) _invalidInput.empty();
      return _check;    
    };

    var _getVal = function(url){
      for(var field in _form){
         _submitForm[field] = _form[field].input.getVal();
      };
      _submitForm['photos'] = url;
      return _submitForm;
    }

    var _send = function(url){
      Pard.Backend.modifyProduction(_getVal(url), function(data){
        Pard.Events.ModifyProduction(data, sectionContent);
      });
    }

    var _thumbnail = $('<div>');
    var _url = [];
    
    if('photos' in proposal && proposal.photos != null){
      proposal.photos.forEach(function(photo){
        _url.push(photo);
        var _container = $('<span>');
        var _previousPhoto = $.cloudinary.image(photo,
          { format: 'jpg', width: 50, height: 50,
            crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
        _createdWidget.append(_previousPhoto);
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

    var _folder = user_id + '/' + profile_id + '/photos';
    var _photos = Pard.Widgets.Cloudinary(_folder, _thumbnail, _url, 3);

    _createdWidget.append(_photos.render(), _thumbnail);

    for(var field in _form){
      _createdWidget.append(_form[field]['label'].render().append(_form[field]['input'].render()));
    };

    var _closepopup = {};

    submitButton.on('click',function(){
      if(_filled() == true){
        _closepopup();
        if(_photos.dataLength() == false) _send(_url);
        else{
          _photos.submit();
        }
      }
    });

    _photos.render().bind('cloudinarydone', function(e, data){
      _url.push(data['result']['public_id']);
      if(_url.length >= _photos.dataLength()) _send(_url);
    });

    _createdWidget.append(_invalidInput, _submitBtnContainer.append(submitButton));

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
