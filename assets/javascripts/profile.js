(function(ns){


  ns.Widgets.ModifyProfile = function(profile){

    var _createdWidget = $('<div>');

    var _createdButton = Pard.Widgets.Button('Modifica tu perfil', function(){
      Pard.Widgets.BootboxAlert('Modifica tus datos', Pard.Widgets.ModifyProfileMessage(profile));
    });

    _createdWidget.append(_createdButton.render());

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ModifyProfileMessage = function(profile){

    var _createdWidget = $('<div>');
    var _submitForm = {};

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
      return _submitForm;
    }

    return {
      render: function(){
        return _createdWidget;
      },
      callback: function(){
        if(_filled() == true) Pard.Backend.createProfile(_getVal(), Pard.Events.CreateProfile);
        else{
          return false;
        }
      }
    }
  }



}(Pard || {}));
