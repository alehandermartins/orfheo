(function(ns){
  

  ns.Widgets.ArtistProfile = function(profile){
    var _createdWidget = $('<div>');
    var _info = $('<div>');

    ['name','city'].forEach( function(element) {
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

    ['name','city', 'address', 'category'].forEach( function(element) {
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

    _forms = {};
    _forms['artist'] = Pard.Widgets.ArtistForm().objectForm();
    _forms['space'] = Pard.Widgets.SpaceForm().objectForm();
    
    var _createdWidget = $('<div>');

    var _form = _forms[profile.type];
    _form['web_page'] = Pard.Widgets.Input('Web personal', 'text');
    _form['bio'] = Pard.Widgets.TextArea('Bio');
    
    
    for(field in _form){
      if(profile[field]) _form[field].setVal(profile[field]);
    };

    for(field in _form){
      _createdWidget.append(_form[field].render());
    };

    var _filled = function(){
      for (field in _form){
        if (!(field == 'bio' || field == 'web_page')){
          if(_form[field].getVal().length == 0) return false; 
        }
      }
      return true;
    };

    var _getVal = function(){
      var _submitForm = {};
      _submitForm['profile_id'] = profile.profile_id;
      _submitForm['type'] = profile.type;    
      for(field in _form){
        if(profile[field] != _form[field].getVal()) _submitForm[field] = _form[field].getVal();
      };
     
      return _submitForm;
    }  

    return {
      render: function(){
        return _createdWidget;
      },
      callback: function(){
        var _submitForm = _getVal();
        if(_filled() == true) Pard.Backend.modifyProfile(_submitForm, Pard.Events.CreateProfile);
        else{return false; }
      }
    }
  }

 

}(Pard || {}));
