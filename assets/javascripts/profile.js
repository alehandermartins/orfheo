(function(ns){


  ns.Widgets.ArtistProfile = function(profile){
    var _createdWidget = $('<div>');
    var _info = $('<div>');

    ['name','city', 'bio', 'personal_web'].forEach( function(element) {
      var _newField = $('<div>').text(profile[element]);
      _info.append(_newField)
    });

     _modifyProfile = Pard.Widgets.ModifyProfile(profile).render();
     _callButton = Pard.Widgets.CallButtonArtist(profile).render();

    _createdWidget.append(_info, _modifyProfile, _callButton);

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

  ns.Widgets.CallButtonArtist = function(profile){

    var _createdWidget = $('<div>');

    var _createdButton = Pard.Widgets.Button('Iscribe otra propuesta', function(){
      Pard.Widgets.BootboxAlert('conFusion', Pard.Widgets.CallMessageArtist(profile));
    });

    _createdWidget.append(_createdButton.render());

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.CategoryArtist = function(profile){

    var _createdWidget = $('<div>');

    var _category = Pard.Forms.ArtistCallCategory().render();

    _createdWidget.append(_category.render());


    return {
      render: function(){
        return _createdWidget;
      },
      getVal: function(){
        return _createdWidget.getVal();
      }
    }
  }


  ns.Widgets.CallMessageArtist = function(profile){

    var _createdWidget = $('<div>');
    var _submitForm = {};
    var _selected = 'music';

    _submitForm['call_id'] = 'b5bc4203-9379-4de0-856a-55e1e5f3fac6';
    _submitForm['profile_id'] = profile.profile_id;
    _submitForm['type'] = profile.type;

    _callBycategory = {
      'music': Pard.Forms.MusicArtsOtherCall(),
      'arts': Pard.Forms.MusicArtsOtherCall(),
      'other': Pard.Forms.MusicArtsOtherCall(),
      'poetry': Pard.Forms.PoetryWorkshopCall(),
      'expo': Pard.Forms.ExpoCall(),
      'street_art': Pard.Forms.StreetArtCall(),
      'workshop': Pard.Forms.PoetryWorkshopCall(),
      'audiovisual': Pard.Forms.AudiovisualCall()
    }

    var _content = $('<div>');
    var _form = _callBycategory[_selected].render();
    for(field in _form){
        _content.append(_form[field].render());
      };
    var _requiredFields = _callBycategory[_selected].requiredFields();;

    var _labelsCategories = ['Musica', 'Artes Escenicas', 'Exposición', 'Poesia',  'Audiovisual', 'Street Art', 'Taller', 'Otros'];
    var _valuesCategories = ['music', 'arts', 'expo', 'poetry', 'audiovisual', 'street_art', 'workshop', 'other'];

    var _category = Pard.Widgets.Selector(_labelsCategories, _valuesCategories).render();

    _createdWidget.append(_category, _content);

    _category.on('change', function(){
      _selected = $(this).val();
      _content.empty();
      _form = _callBycategory[_selected].render();
      _requiredFields = _callBycategory[_selected].requiredFields();
      for(field in _form){
      _content.append(_form[field].render());
      };
    });

    _submitForm['category'] = _selected;

    _createdWidget.append(_category, _content);


    var _filled = function(){
      for (field in _form){;
        if ($.inArray(field, _requiredFields) >= 0 ){
          if(_form[field].getVal().length == 0) return false;
        }
      }
      return _form['conditions'].getVal();;
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
