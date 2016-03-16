'use strict';


(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.CreateProfile = function(){
    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Create profile');
    var _submitBtn = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Crea');
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Crea un nuevo perfil', function(){ return Pard.Widgets.CreateProfileMessage(_submitBtn)});

    var _createdWidget = _popup.render();


    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.MyProfiles = function(profiles){

    var _createdWidget = $('<div>');
    profiles.forEach(function(profile){
      _createdWidget.append(Pard.Widgets.CreateCard(profile).render().attr('href', '/users/profiles/' + profile['profile_id']).addClass('myprofile-card-position'))});

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }



    ns.Widgets.CreateProfileMessage = function(submitButton){
    var _createdWidget = $('<div>');
    var _content = $('<div>');
    var _btnContainer = $('<div>');
    var _invalidInput = $('<div>');
    var _fields = {};

    var _profileForm = Pard.Widgets.ProfileForm();

    _artistButton = Pard.Widgets.Button('Artista', function(){
      _content.empty();
      _content.append(_profileForm.getForm('artist'), submitButton);
      if (!(_btnContainer.html())) _btnContainer.append(submitButton);
    });

    _spaceButton = Pard.Widgets.Button('Espacio', function(){
      _content.empty();
      _content.append(_profileForm.getForm('space'))
      if (!(_btnContainer.html())) _btnContainer.append(submitButton);
    });


    _createdWidget.append(_artistButton.render(), _spaceButton.render(), _content, _btnContainer, _invalidInput);


    return {
      render: function(){
        return _createdWidget;
      },
      filled: function(){
        return _profileForm.filled();
      },
      getVal: function(){
        return _profileForm.getVal();
      },
      setCallback: function(callback){
        submitButton.on('click',function(){
          if(_profileForm.filled() == true){
            console.log(_profileForm.getVal());
            Pard.Backend.createProfile(_profileForm.getVal(), Pard.Events.CreateProfile);
            callback();
          }
        });
      }
    }
  }


  ns.Widgets.ProfileForm = function(){

    var _form = {};
    var _selected = 'artist';

    _form['artist'] = Pard.Widgets.ArtistForm();
    _form['space'] = Pard.Widgets.SpaceForm();

    return {
      getForm: function(type){
        _selected = type;
        return _form[type].render();
      },
      getVal: function(){
        return _form[_selected].getVal();
      },
      filled: function(){
        var _event = true;
        var _requiredFields = _form[_selected].requiredFields();
        var _formValue = _form[_selected].getVal();
        _requiredFields.forEach(function(key){
          if(_formValue[key].length == 0) _event = false;
        });
        return _event;
      }
    }
  }

  ns.Widgets.ArtistForm = function(){

    var _createdWidget = $('<div>');

    var _form = Pard.Forms.BasicArtistForm().render();

    for(var field in _form){
      _createdWidget.append(
        _form[field].label.render().append(_form[field].input.render()),
        _form[field].helptext.render()
      )
    }

    return {
      render: function(){
        return _createdWidget;
      },
      getVal: function(){
        var _submitForm = {};
        _submitForm['type'] = 'artist';
        for(var field in _form){
          _submitForm[field] = _form[field].input.getVal();
        }
        return _submitForm;
      },
      requiredFields: function(){
        return  Pard.Forms.BasicArtistForm().requiredFields();
      }
    }
  }


  ns.Widgets.SpaceForm = function(){

    var _createdWidget = $('<div>');

    var _form = Pard.Forms.BasicSpaceForm().render();

    for(var field in _form){
      _createdWidget.append(
        _form[field].label.render().append(_form[field].input.render()),
        _form[field].helptext.render()
      )
    }


    return {
      render: function(){
        return _createdWidget;
      },
      getVal: function(){
        var _submitForm = {};
        _submitForm['type'] = 'space';
        for(var field in _form){
          _submitForm[field] = _form[field].input.getVal();
        }
        return _submitForm;
      },
      requiredFields: function(){
        return  Pard.Forms.BasicSpaceForm().requiredFields();
      }
    }
  }






  // ns.Widgets.CreateProfileMessageOriginal = function(){
  //   _createdWidget = $('<div>');

  //   var _content = $('<div>');
  //   var _invalidInput = $('<div>');
  //   var _fields = {};

  //   var _profileForm = Pard.Widgets.ProfileForm();

  //   _artistButton = Pard.Widgets.Button('Artista', function(){
  //     _content.empty();
  //     _content.append(_profileForm.getForm('artist'));
  //   });

  //   _spaceButton = Pard.Widgets.Button('Espacio', function(){
  //     _content.empty();
  //     _content.append(_profileForm.getForm('space'));
  //   });

  //   _createdWidget.append(_artistButton.render(), _spaceButton.render(), _content, _invalidInput);

  //   return {
  //     render: function(){
  //       return _createdWidget;
  //     },
  //     callback: function(){
  //       if(_profileForm.filled() == true) Pard.Backend.createProfile(_profileForm.getVal(), Pard.Events.CreateProfile);
  //       else{
  //         return false;
  //       }
  //     }
  //   }
  // }

}(Pard || {}));
