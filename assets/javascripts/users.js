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
      _createdWidget.append(Pard.Widgets.CreateCard(profile, function(){location.href='/users/profiles/' + profile['profile_id']}).render().addClass('myprofile-card-position'))});

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.CreateTypeProfile = function(type){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Create profile');
    var _title = {
      artist: 'Perfil de artista',
      space: 'Perfil de espacio'
    }
    var _popup = Pard.Widgets.PopupCreator(_caller, _title[type], function(){ return Pard.Widgets.CreateTypeProfileMessage(type)});

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

  ns.Widgets.CreateTypeProfileMessage = function(type){

    var _createdWidget = $('<div>');

    var _form = {};
    
    _form['artist'] = Pard.Widgets.ArtistForm();
    _form['space'] = Pard.Widgets.SpaceForm();
   
    _createdWidget.append(_form[type].render());
       
    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _form[type].setCallback(callback);
      }
    }
  }

  ns.Widgets.ArtistForm = function(){

    var _createdWidget = $('<div>');
    var _invalidInput = $('<div>').addClass('not-filled-text');

    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Crea');

    var _form = Pard.Forms.BasicArtistForm().render();

    for(var field in _form){
      _createdWidget.append(
        _form[field].label.render().append(_form[field].input.render()),
        _form[field].helptext.render()
      );
    }

    var _filled = function(){
      var _check = true;
      var _requiredFields = Pard.Forms.BasicArtistForm().requiredFields();
      _requiredFields.forEach(function(field){
        if(!(_form[field].input.getVal())){
          _form[field].input.addWarning();
          _invalidInput.text('Por favor, revisa los campos obligatorios.');
          _check = false;
        } 
      });
      return _check;
    }

    var _getVal = function(){
      for(var field in _form){
         _submitForm[field] = _form[field].input.getVal();
      };
      _submitForm['type'] = 'artist';
      return _submitForm;
    }

    var _send = function(){
      Pard.Backend.createProfile(_getVal(), Pard.Events.CreateProfile);
    }

    var _closepopup = {};

    submitButton.on('click',function(){
      if(_filled() == true){
        _closepopup();
        _send();
      }
    });

    _submitBtnContainer.append(submitButton);
    _createdWidget.append(_invalidInput, _submitBtnContainer);

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }


  ns.Widgets.SpaceForm = function(){

    var _createdWidget = $('<div>');
    var _invalidInput = $('<div>').addClass('not-filled-text');

    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Crea');
    var user_id = Pard.ProfileManager.getUserId();

    var _thumbnail = $('<div>');
    var _url = [];

    var _folder = user_id + '/photos';
    var _photos = Pard.Widgets.Cloudinary(_folder, _thumbnail, _url, 3);

    _createdWidget.append(_photos.render(), _thumbnail);

    var _form = Pard.Forms.BasicSpaceForm().render();

    for(var field in _form){
      _createdWidget.append(
        _form[field].label.render().append(_form[field].input.render()),
        _form[field].helptext.render()
      );
    }

    var _filled = function(){
      var _check = true;
      var _requiredFields = Pard.Forms.BasicSpaceForm().requiredFields();
      _requiredFields.forEach(function(field){
        if(!(_form[field].input.getVal())){
          _form[field].input.addWarning();
          _invalidInput.text('Por favor, revisa los campos obligatorios.');
          _check = false;
        } 
      });
      return _check;
    }

    var _getVal = function(url){
      for(var field in _form){
         _submitForm[field] = _form[field].input.getVal();
      };
      _submitForm['photos'] = url;
      _submitForm['type'] = 'space';
      return _submitForm;
    }

    var _send = function(url){
      Pard.Backend.createProfile(_getVal(url), Pard.Events.CreateProfile);
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

    _submitBtnContainer.append(submitButton);
    _createdWidget.append(_invalidInput, _submitBtnContainer);

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
