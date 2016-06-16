'use strict';


(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.CreateProfile = function(){
    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'});
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
      _createdWidget.append($('<div>').addClass('myprofile-card-position').append(Pard.Widgets.CreateCard(profile).render()))});

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.CreateProfileCard = function(callbackEvent){
        console.log(callbackEvent);


    var _createProfileCardContainer = $('<div>').addClass('card-container').css('vertical-align','top');
    var _createProfileCard =$('<a>').attr({href: '#'}).addClass('profileCard position-profileCard-login');
    var _color = '#6f6f6f';
    _createProfileCard.css({border: 'solid 3px'+_color});
    _createProfileCard.hover(
      function(){
        $(this).css({
        'box-shadow': '0 0 2px 1px'+ _color
        // 'background': 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+'.1'+ ')'
      });
      },
      function(){
        $(this).css({
          'box-shadow': '0px 1px 2px 1px rgba(10, 10, 10, 0.2)'
          // 'background':'white'
        });
      }
    );

    var _addCircle = Pard.Widgets.IconManager('add_circle').render().addClass('addCircle-create-profile-card');
    var _text = $('<p>').text('Crea un perfil').addClass('create-profile-card-text');
    _createProfileCard.append(_addCircle, _text)

    _createProfileCard.click(function(){
      var _caller = $('<button>');
      var _popup = Pard.Widgets.PopupCreator(_caller, 'Crea un perfil', function(){ return Pard.Widgets.CreateProfileMessage(callbackEvent)});
      _caller.trigger('click');
    });
    _createProfileCardContainer.append(_createProfileCard);

    return {
      render: function(){
        return _createProfileCardContainer;
      }
    }
  }


  ns.Widgets.CreateProfileMessage = function(callbackEvent){
        console.log(callbackEvent);



    var _createdWidget = $('<div>').css({
      'margin-top': '1.5rem'
    });

    var _spaceButton = Pard.Widgets.CreateTypeProfile('space', callbackEvent).render().addClass('create-space-btn-popup');
    var _artistButton = Pard.Widgets.CreateTypeProfile('artist', callbackEvent).render().addClass('create-artist-btn-popup');
    // var _organizationButton = Pard.Widgets.CreateTypeProfile('organization').render().addClass('create-artist-btn-popup');

    _spaceButton.append($('<p>').text('Alberga eventos').css({
      'margin-top':'0.5rem',
      'margin-bottom': '0'
    }))

    _artistButton.append($('<p>').text('Enseña tu portfolio ').css({
      'margin-top':'0.5rem',
      'margin-bottom': '0'
    }))

    // var _message = $('<div>').addClass('message-form');
    // _message.html('<p> Puedes apuntarte a la convocatoria del conFusión 2016 enviando una o más propuestas como artista o también ofreciendo tu espacio:</p>');

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

  ns.Widgets.CreateTypeProfile = function(type, callbackEvent){
        console.log(callbackEvent);


    var _artistIcon = Pard.Widgets.IconManager('artist').render().addClass('create-profile-btn-icon');
    var _spaceIcon = Pard.Widgets.IconManager('space').render().addClass('create-profile-btn-icon');
    var _organizationIcon = Pard.Widgets.IconManager('organization').render().addClass('create-profile-btn-icon');

    var _artistButtonHtml = $('<div>').append(_artistIcon, $('<span>').text('Artista').addClass('create-profile-btn-text'));
    var _spaceButtonHtml = $('<div>').append(_spaceIcon, $('<span>').text('Espacio').addClass('create-profile-btn-text'));
    var _organizationButtonHtml = $('<div>').append(_organizationIcon, $('<span>').text('Organización').addClass('create-profile-btn-text'));

    var _buttonDesign = {
      artist: _artistButtonHtml,
      space: _spaceButtonHtml,
      organization: _organizationButtonHtml
    }

    var _popupTitle = {
      artist: 'Artista',
      space: 'Espacio',
      organization: 'Organización'
    }

    var _form = {
      artist: 'create_artist',
      space: 'create_space',
      organization: 'create_organization'
    }

    var _caller = $('<div>').html(_buttonDesign[type]);
    
    var _popup = Pard.Widgets.PopupCreator(_caller, _popupTitle[type], function(){ return Pard.Widgets.CreateTypeProfileMessage(type, callbackEvent)});
    //var _popup = Pard.Widgets.PopupForm(_caller, _popupTitle[type], _form[type]);

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.CreateTypeProfileMessage = function(type, callbackEvent){
        console.log(callbackEvent);


    var _createdWidget = $('<div>');

    var _form = {};
    
    _form['artist'] = Pard.Widgets.ArtistForm;
    _form['space'] = Pard.Widgets.SpaceForm;
    _form['organization'] = Pard.Widgets.OrganizationForm;

    var _formExecuted = _form[type](callbackEvent);
   
    _createdWidget.append(_formExecuted.render());
       
    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _formExecuted.setCallback(callback);
      }
    }
  }

  ns.Widgets.ArtistForm = function(callbackEvent){

    var _createdWidget = $('<div>');
    var _message = $('<div>').text('Esta información se mostrará en tu página de perfil, podrás modificarla y te permitirá darte a conocer.').addClass('message-form');
    var _formContainer = $('<form>').addClass('popup-form');  
    var _invalidInput = $('<div>').addClass('not-filled-text');

    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Crea');

    var _form = Pard.Forms.BasicArtistForm().render();

    for(var field in _form){
      _formContainer.append(
        $('<div>').addClass(field+'-ArtistForm').append(_form[field].label.render().append(_form[field].input.render()),
        _form[field].helptext.render())
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
      if (callbackEvent)  Pard.Backend.createProfile(_getVal(), callbackEvent);
      else Pard.Backend.createProfile(_getVal(), Pard.Events.CreateProfile);
    }

    var _closepopup = {};

    submitButton.on('click',function(){
      if(_filled() == true){
        _closepopup();
        _send();
      }
    });

    _submitBtnContainer.append(submitButton);
    _formContainer.append(_invalidInput, _submitBtnContainer);
    _createdWidget.append(_message, _formContainer);

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }

  ns.Widgets.SpaceForm = function(callbackEvent){

    var _createdWidget = $('<div>');
    var _formContainer = $('<form>').addClass('popup-form');
    var _message = $('<div>').text('Esta información se mostrará en la página de perfil de tu espacio y podrás modificarla.').addClass('message-form');
    var _invalidInput = $('<div>').addClass('not-filled-text');

    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Crea');

    var _thumbnail = $('<div>');
    var _url = [];

    var _folder = '/photos';
    var _photos = Pard.Widgets.Cloudinary(_folder, _thumbnail, _url, 4);

    // _formContainer.append(_photos.render(), _thumbnail);

    var _form = Pard.Forms.BasicSpaceForm().render();
    var _photosLabel = $('<label>').text('Fotos del espacio (máximo 4, tamaño inferior a 500kb)');
    var _photosContainer = $('<div>').append(_photosLabel,_photos.render(), _thumbnail).css({'margin-bottom':'1.2rem', 'margin-top':'2rem'});

    for(var field in _form){
      if (field === 'color') _formContainer.append(_photosContainer); 
      _formContainer.append(  $('<div>').addClass(field+'-SpaceForm').append(_form[field].label.render().append(_form[field].input.render()),
        _form[field].helptext.render())
      );
    }

    var _filled = function(){
      var _check = true;
      var _requiredFields = Pard.Forms.BasicSpaceForm().requiredFields();
      _requiredFields.forEach(function(field){
        if(!(_form[field].input.getVal())){
          if(field != 'links' && field != 'personal_web') _form[field].input.addWarning();
          _invalidInput.text('Por favor, revisa los campos obligatorios.');
          _check = false;
        } 
      });
      return _check;
    }

    _submitForm['type'] = 'space';

    var _getVal = function(url){
      for(var field in _form){
         _submitForm[field] = _form[field].input.getVal();
      };
      _submitForm['photos'] = url;      
      return _submitForm;
    }

    var _send = function(url){
      if (callbackEvent)  Pard.Backend.createProfile(_getVal(), callbackEvent);
      else Pard.Backend.createProfile(_getVal(url), Pard.Events.CreateProfile);
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

    _photos.cloudinary().bind('cloudinarydone', function(e, data){
      _url.push(data['result']['public_id']);
      if(_url.length >= _photos.dataLength()) _send(_url);
    });

    _submitBtnContainer.append(submitButton);

    _formContainer.append(_invalidInput, _submitBtnContainer);
    _createdWidget.append(_message, _formContainer)

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }

  ns.Widgets.OrganizationForm = function(callbackEvent){

    var _createdWidget = $('<div>');
    var _message = $('<div>').text('Esta información se mostrará en tu página de perfil').addClass('message-form');
    var _formContainer = $('<form>').addClass('popup-form');  
    var _invalidInput = $('<div>').addClass('not-filled-text');

    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Crea');

    var _form = Pard.Forms.BasicOrganizationForm().render();

    for(var field in _form){
      _formContainer.append(
        $('<div>').addClass(field+'-OrganizationForm').append(_form[field].label.render().append(_form[field].input.render()),
        _form[field].helptext.render())
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
      _submitForm['type'] = 'organization';
      return _submitForm;
    }

    var _send = function(){
      if (callbackEvent)  Pard.Backend.createProfile(_getVal(), callbackEvent);
      else Pard.Backend.createProfile(_getVal(), Pard.Events.CreateProfile);
    }

    var _closepopup = {};

    submitButton.on('click',function(){
      if(_filled() == true){
        _closepopup();
        _send();
      }
    });

    _submitBtnContainer.append(submitButton);
    _formContainer.append(_invalidInput, _submitBtnContainer);
    _createdWidget.append(_message, _formContainer);

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }

  ns.Widgets.ArtistFormBackend = function(form){
    
    var _createdWidget = $('<div>');
    var _message = $('<div>').text('Esta información se mostrará en tu página de perfil, podrás modificarla y te permitirá darte a conocer dentro y fuera del festival.').addClass('message-form');
    var _formContainer = $('<form>').addClass('popup-form');  
    var _invalidInput = $('<div>').addClass('not-filled-text');

    var _form = {};
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Crea');

    for(var field in form){
      _form[field] = {};
      _form[field]['type'] = form[field].type;
      _form[field]['label'] = Pard.Widgets.InputLabel(form[field].label);
      _form[field]['input'] = window['Pard']['Widgets'][form[field].input].apply(this, form[field].args);
      _form[field]['helptext'] = Pard.Widgets.HelpText(form[field].helptext);
    }    

    for(var field in _form){
      _formContainer.append(
        $('<div>').addClass(field+'-ArtistForm').append(
          _form[field].label.render(),
          _form[field].input.render(),
          _form[field].helptext.render()
        )
      );
    }

    var _filled = function(){
      var _check = true;
      for(var field in _form){
        if(_form[field].type == 'mandatory' && !(_form[field].input.getVal())){
          _form[field].input.addWarning();
          _invalidInput.text('Por favor, revisa los campos obligatorios.');
          _check = false;
        }
      } 
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
    _formContainer.append(_invalidInput, _submitBtnContainer);
    _createdWidget.append(_message, _formContainer);

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }


  ns.Widgets.SpaceFormBackend = function(form){

    var _createdWidget = $('<div>');
    var _formContainer = $('<form>').addClass('popup-form');
    var _message = $('<div>').text('Esta información se mostrará en la página de perfil de tu espacio y podrás modificarla en todo momento sin afectar a tu participación en el festival.').addClass('message-form');
    var _invalidInput = $('<div>').addClass('not-filled-text');

    var _form = {};
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Crea');

    var _url = [];
    var _thumbnail = $('<div>');
    var _photos = Pard.Widgets.Cloudinary(form['photos'].folder, _thumbnail, _url, form['photos'].amount);
    var _photosLabel = $('<label>').text(form['photos'].label);
    var _photosContainer = $('<div>').append(_photosLabel,_photos.render(), _thumbnail).css({'margin-bottom':'1.2rem', 'margin-top':'2rem'});

    for(var field in form){
      if (field != 'photos'){
        _form[field] = {};
        _form[field]['type'] = form[field].type;
        _form[field]['label'] = Pard.Widgets.InputLabel(form[field].label);
        _form[field]['input'] = window['Pard']['Widgets'][form[field].input].apply(this, form[field].args);
        _form[field]['helptext'] = Pard.Widgets.HelpText(form[field].helptext);
      }
    }    

    for(var field in form){
      if (field == 'photos') _formContainer.append(_photosContainer);
      else{
        _formContainer.append(
        $('<div>').addClass(field+'-SpaceForm').append(
          _form[field].label.render(),
          _form[field].input.render(),
          _form[field].helptext.render()
        )
      );
      }
    }

    var _filled = function(){
      var _check = true;
      for(var field in _form){
        if(_form[field].type == 'mandatory' && !(_form[field].input.getVal())){
          _form[field].input.addWarning();
          _invalidInput.text('Por favor, revisa los campos obligatorios.');
          _check = false;
        }
      } 
      return _check;
    }

    var _getVal = function(url){
      for(var field in _form){
         _submitForm[field] = _form[field].input.getVal();
      };
      _submitForm['type'] = 'space';     
      _submitForm['photos'] = url;
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

    _photos.cloudinary().bind('cloudinarydone', function(e, data){
      _url.push(data['result']['public_id']);
      if(_url.length >= _photos.dataLength()) _send(_url);
    });

    _submitBtnContainer.append(submitButton);

    _formContainer.append(_invalidInput, _submitBtnContainer);
    _createdWidget.append(_message, _formContainer)

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
