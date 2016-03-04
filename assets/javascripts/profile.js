(function(ns){


  ns.Widgets.ModifyProfile = function(profile){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Modifica el perfil');
    var _submitBtn = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('OK');
    var _popup = Pard.Widgets.PopupCreator(_caller, Pard.Widgets.PopupContent('Modifica tus datos', Pard.Widgets.ModifyProfileMessage(profile, _submitBtn)));

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ModifyProfileMessage = function(profile, submitButton){

    var _createdWidget = $('<div>');
    var _submitForm = {};
    var _photo = Pard.Widgets.Cloudinary();

    _createdWidget.append(_photo.render());

    _submitForm['profile_id'] = profile.profile_id;
    _submitForm['type'] = profile.type;

    var _form = Pard.Forms.ProfileForms(profile.type).render();
    var _requiredFields = _form.requiredFields();
    _form = _form.render();

    for(field in _form){
      if(profile[field]) _form[field].setVal(profile[field]);
    };

    for(field in _form){
      _createdWidget.append(_form[field].render());
    };

    _createdWidget.append(submitButton);

    var _filled = function(){
      for (field in _form){
        if ($.inArray(field, _requiredFields) >= 0){
          if(_form[field].getVal().length == 0) return false;
        }
      }
      return true;
    };

    var _getVal = function(){
      for(field in _form){
         _submitForm[field] = _form[field].getVal();
      };
      _submitForm['photo'] = _photo.get_url();
      return _submitForm;
    }

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        submitButton.on('click',function(){
          if(_filled() == true){
            Pard.Backend.createProfile(_getVal(), Pard.Events.CreateProfile);
            callback();
          }
        });
      }
    }
  }



}(Pard || {}));
