'use strict';


(function(ns){

  ns.Widgets = ns.Widgets || {};

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

  ns.Widgets.CreateProfileCard = function(callbackEvent, allowedProfile){

    var _createProfileCard =$('<a>').attr({href: '#/'}).addClass('profileCard');
    var _upperBox = $('<div>').addClass('upperBox-cerateProfileCard');
    var _downBox = $('<div>').addClass('downBox-cerateProfileCard');
    var _color = '#6f6f6f';
    _createProfileCard.css({
      border:'1px solid rgb(206, 206, 206)'
    });
    _createProfileCard.hover(
      function(){
        $(this).css({
        'box-shadow': '0 0 2px 1px'+ _color
      });
      },
      function(){
        $(this).css({
          'box-shadow': '0px 1px 2px 1px rgba(10, 10, 10, 0.2)'
        });
      }
    );

    var _addCircle = Pard.Widgets.IconManager('add_circle').render().addClass('addCircle-create-profile-card');
    var _text = $('<p>').text('Crea un perfil').addClass('create-profile-card-text');
    _createProfileCard.append(_upperBox.append(_addCircle), _downBox.append(_text));

    var _createProfilePopup;
    _createProfileCard
      .one('click', function(){
        _createProfilePopup = Pard.Widgets.Popup();
      })
      .click(function(){
        var _createProfileMex = Pard.Widgets.CreateProfileMessage(callbackEvent, allowedProfile);
        _createProfileMex.setCallback(function(){_createProfilePopup.close()});
        _createProfilePopup.setContent('Crea un perfil', _createProfileMex.render());
        _createProfilePopup.open();
      });
    _createProfileCard;

    return {
      render: function(){
        return _createProfileCard;
      }
    }
  }


  ns.Widgets.CreateProfileMessage = function(callbackEvent, allowedProfile){
     var _createdWidget = $('<div>').css({
      'margin-top': '1.5rem'
    });

    var _spaceButton = Pard.Widgets.CreateTypeProfile('space', callbackEvent).render().addClass('create-space-btn-popup');
    var _artistButton = Pard.Widgets.CreateTypeProfile('artist', callbackEvent).render().addClass('create-artist-btn-popup');
    var _organizationButton = Pard.Widgets.CreateTypeProfile('organization').render().addClass('create-organization-btn-popup');

    _spaceButton.append($('<p>').html('Alberga arte y posiciónate en el mapa de tu ciudad').css({
      'margin-top':'0.5rem',
      'margin-bottom': '0'
    }));
    _artistButton.append($('<p>').html('Enseña tu portfolio <br> y participas en eventos').css({
      'margin-top':'0.5rem',
      'margin-bottom': '0'
    }));
    _organizationButton.append($('<p>').html('Dé a conocer tu proyecto y lanza convocatorias').css({
      'margin-top':'0.5rem',
      'margin-bottom': '0'
    }));

    var _btnObj = {
      artist: _artistButton,
      space: _spaceButton,
      organization: _organizationButton
    }
    
    for (var typeProfile in _btnObj) {
      if (allowedProfile){
        if($.inArray(typeProfile,allowedProfile)>-1) _createdWidget.append(_btnObj[typeProfile]);
      }
      else {_createdWidget.append(_btnObj[typeProfile]);}
    }

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
        _organizationButton.on('click',function(){
          callback();
        });
      }
    }
  }

  ns.Widgets.CreateTypeProfile = function(type, callbackEvent){
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

    var _createTypeProfilePopup;
    var _createdWidget = $('<div>').html(_buttonDesign[type])
      .one('click', function(){
        _createTypeProfilePopup = Pard.Widgets.Popup();
      })
      .click(function(){
        var _createTypeProfileMex =  Pard.Widgets.CreateTypeProfileMessage(type, callbackEvent);
        _createTypeProfileMex.setCallback(
          function(){_createTypeProfilePopup.close();
          setTimeout(function(){
            _createTypeProfilePopup.destroy();
          }, 500)
        });
        _createTypeProfilePopup.setContent(_popupTitle[type], _createTypeProfileMex.render());
        _createTypeProfilePopup.setCallback(function(){
          setTimeout(function(){
            _createTypeProfilePopup.destroy();
          }, 500)
        });
        _createTypeProfilePopup.open();
      });

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.CreateTypeProfileMessage = function(type, callbackEvent){
    var _createdWidget = $('<div>').addClass('createProfilePopup createProfilePopup-'+type);

    var _message = $('<div>').text('Esta información se mostrará en tu página de perfil, podrás modificarla y te permitirá darte a conocer.');

    var _initialMessages = {
      artist: 'Esta información se mostrará en tu página de perfil, podrás modificarla y te permitirá darte a conocer.',
      space: 'Esta información se mostrará en la página de perfil de tu espacio y podrás modificarla.',
      organization: 'Esta información se mostrará en la página de perfil y podrás modificarla.'
    }

    var _message = $('<div>').text(_initialMessages[type]);
    _createdWidget.append(_message);

    var _form = Pard.Forms.CreateProfile[type];
    var _submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Crea');
    var _formWidget = Pard.Widgets.PrintForm(_form, _submitButton, type);

    var _closepopup = function(){};
   
    var _send = function(){
      var _submittedForm;
      _submittedForm = _formWidget.getVal();
      _submittedForm['type'] = type;
      if (_submittedForm['address']['location'] && _submittedForm['address']['location']['lat'] && _submittedForm['address']['location']['lng']){
        if (callbackEvent){
            Pard.Backend.createProfile(_submittedForm, function(data){
              callbackEvent(data);
              _closepopup();
              _formWidget.stopSpinner();
            });
        }
        else {
          Pard.Backend.createProfile(_submittedForm, function(data){
            Pard.Events.CreateProfile(data);
            _formWidget.stopSpinner();
            _submitButton.attr('disabled',false);
          });
        }
      }
      else{
        _formWidget.stopSpinner();
        _submitButton.attr('disabled',false);
        var _content = $('<div>').addClass('very-fast reveal full');
        _content.empty();
        $('body').append(_content);
        var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', multipleOpened:true});
        var _closepopupAlert = function(){
          _popup.close();
        }
        var _message = Pard.Widgets.PopupContent('¡Atencion!', Pard.Widgets.AlertNoMapLocation(_submittedForm, _closepopupAlert, function(){
            if (callbackEvent)  Pard.Backend.createProfile(_submittedForm, function(data){
                callbackEvent(data);
                _closepopup();
                _formWidget.stopSpinner();
              });
            else Pard.Backend.createProfile(_submittedForm, Pard.Events.CreateProfile);
          }));
        _message.setCallback(function(){
          _content.remove();
          _popup.close();
        }); 
        _content.append(_message.render());
        _popup.open();
      }
    }

    _formWidget.setSend(_send);
    _createdWidget.append(_formWidget.render());

    return{
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  } 

}(Pard || {}));
