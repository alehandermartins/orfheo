'use strict';


(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.CreateProfile = function(){
    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Create profile');
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Crea un perfil', function(){ return Pard.Widgets.CreateProfileMessage()});

   
    return {
      render: function(){
        return _caller;
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

  ns.Widgets.CreateTypeProfile = function(type){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Create profile');
    var _submitBtn = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Crea');
    var _title = {
      artist: 'Perfil de artista',
      space: 'Perfil de espacio'
    }
    var _popup = Pard.Widgets.PopupCreator(_caller, _title[type], function(){ return Pard.Widgets.CreateTypeProfileMessage(type, _submitBtn)});

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.CreateProfileMessage = function(){

    var _createdWidget = $('<div>');

    var _spaceButton = Pard.Widgets.CreateTypeProfile('space').render().text('crea un perfil espacio');
    var _artistButton = Pard.Widgets.CreateTypeProfile('artist').render().text('crea un perfil artista');

    _createdWidget.append(_artistButton, _spaceButton);


    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _spaceButton.on('click',function(){
            callback();
        });
        _artistButton.on('click',function(){
            callback();
        });
      }
    }
  }

  ns.Widgets.CreateTypeProfileMessage = function(type, submitButton){

    var _createdWidget = $('<div>');
    
    var _content = $('<div>');
    // var _btnContainer = $('<div>');
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');
   
    var _profileForm = Pard.Widgets.ProfileForm();

    _content.append(_profileForm.getForm(type))
    _submitBtnContainer.append(submitButton);

    _createdWidget.append(_content,  _invalidInput, _submitBtnContainer);

    
    return {
      render: function(){
        return _createdWidget;
      },
      getVal: function(){
        return _profileForm.getVal();
      },
      setCallback: function(callback){
        submitButton.on('click',function(){
          if(_profileForm.filled(_invalidInput)){
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
      filled: function(_invalidInput){
        return _form[_selected].filled(_invalidInput);
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
      filled: function(_invalidInput){
        var _check = true;
        var _requiredFields = Pard.Forms.BasicArtistForm().requiredFields();
        _requiredFields.forEach(function(field){
          if(!(_form[field].input.getVal())){
            _form[field].input.addWarning();
            _invalidInput.text('Por favor, revisa los campos obligatorios.');
            _check = false;
          } 
        });
        if(_check) _invalidInput.empty();
        return _check;
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
      filled: function(_invalidInput){
        var _check = true;
        var _requiredFields = Pard.Forms.BasicSpaceForm().requiredFields();
        _requiredFields.forEach(function(field){
          if(!(_form[field].input.getVal())){
            console.log(_form[field].input);
            _form[field].input.addWarning();
            _invalidInput.text('Por favor, revisa los campos obligatorios.');
            _check = false;
          } 
        });
        if (_check) _invalidInput.empty();
        return _check;
      }
    }
  }

}(Pard || {}));
