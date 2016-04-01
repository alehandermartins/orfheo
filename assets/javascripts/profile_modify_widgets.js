'use strict';

(function(ns){


  ns.Widgets.ModifyProfile = function(profile){

    var _caller = $('<button>').addClass('modify-content-button').attr({type: 'button'}).append(Pard.Widgets.IconManager('modify_section_content').render());
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
    var _formContainer = $('<form>').addClass('popup-form');
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');
    var _submitForm = {};

    var user_id = Pard.ProfileManager.getUserId();
    var profile_id = profile.profile_id;

    var _thumbnail = $('<div>');
    var _url = [];

    if(profile.profile_picture){
      profile.profile_picture.forEach(function(photo){
        _url.push(photo);
        var _container = $('<span>');
        var _previousPhoto = $.cloudinary.image(photo,
          { format: 'jpg', width: 50, height: 50,
            crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
        _formContainer.append(_previousPhoto);
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

    var _folder = 'profile_picture';
    var _photos = Pard.Widgets.Cloudinary(_folder, _thumbnail, _url, 1);

    var _photosLabel = $('<label>').text('Foto de perfil').css({
      'padding-top': '0.5rem'
    });
    var _photosContainer = $('<div>').append(_photosLabel,_photos.render(), _thumbnail).addClass('profilePhoto-modifyProfile');

    _submitForm['profile_id'] = profile.profile_id;
    _submitForm['type'] = profile.type;

    var _form = Pard.Forms.ProfileForms(profile.type).render();
    var _requiredFields = _form.requiredFields();
    _form = _form.render();

    for(var field in _form){
      if(profile[field]) _form[field].input.setVal(profile[field]);
    };

    for(var field in _form){
      if (profile.type === 'space'&& field === 'address') _formContainer.append(_photosContainer);
      if (profile.type === 'artist'&& field === 'bio') _formContainer.append(_photosContainer);
      if(field != 'links') _formContainer.append($('<div>').addClass(field+'-modifyProfile').append(_form[field].label.render().append(_form[field].input.render()), _form[field].helptext.render()));
    };

    _createdWidget.append(_formContainer, _invalidInput, _submitBtnContainer.append(submitButton));

    var _filled = function(){
      var _check = true;
      for (field in _form){
        if ($.inArray(field, _requiredFields) >= 0){
          if(!(_form[field].input.getVal())) {
            if(field != 'personal_web') _form[field].input.addWarning();
            _invalidInput.text('Por favor, revisa los campos.');
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
      if(profile.type == 'space'){
        if(profile.photos) _submitForm['photos'] = profile.photos;
      }
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




}(Pard || {}));
