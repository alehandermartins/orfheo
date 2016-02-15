(function(ns){


  ns.Widgets.ArtistProfile = function(profile){
    var _createdWidget = $('<div>');
    var _info = $('<div>');

    ['name','city', 'bio', 'personal_web'].forEach( function(element) {
      var _newField = $('<div>').text(profile[element]);
      _info.append(_newField)
    });

     _modifyProfile = Pard.Widgets.ModifyProfile(profile).render();

    _createdWidget.append(_info, _modifyProfile);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

   ns.Widgets.SpaceProfile = function(profile){
    var _createdWidget = $('<div>');
    var _info = $('<div>');

    ['name','city', 'address', 'category', 'bio', 'personal_web'].forEach( function(element) {
      var _newField = $('<div>').text(profile[element]);
      _info.append(_newField)
    });

    _modifyProfile = Pard.Widgets.ModifyProfile(profile).render();
    _callButton = Pard.Widgets.CallButton(profile).render();

    _createdWidget.append(_info, _modifyProfile, _callButton);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

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

  ns.Widgets.CallButton = function(profile){

    var _createdWidget = $('<div>');

    var _createdButton = Pard.Widgets.Button('Iscribe otra propuesta', function(){
      Pard.Widgets.BootboxAlert('conFusion', Pard.Widgets.CallMessageSpace(profile));
    });

    _createdWidget.append(_createdButton.render());

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.CallMessageSpace= function(profile){

    var _createdWidget = $('<div>');
    var _submitForm = {};
    _submitForm['call_id'] = 'b5bc4203-9379-4de0-856a-55e1e5f3fac6';
    _submitForm['profile_id'] = profile.profile_id;
    _submitForm['type'] = profile.type;

    var _form = Pard.Forms.SpaceCallConfusion().render();
    var _requiredFields = Pard.Forms.SpaceCallConfusion().requiredFields();

    for(field in _form){
      _createdWidget.append(_form[field].render());
    }

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
        if(_filled() == true) Pard.Backend.createProposal(_getVal(), Pard.Events.CreateProposal);
        else{
          return false;
        }
      }
    }
  }

}(Pard || {}));
