'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ModifyProfile = function(profile){

    var _caller = $('<button>').addClass('modify-content-button').attr({type: 'button'}).append(Pard.Widgets.IconManager('modify_section_content').render());
    var _submitBtn = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');

    var _popup = Pard.Widgets.PopupCreator(_caller, 'Modifica tu perfil', function(){
      return Pard.Widgets.ModifyProfileMessage(profile, _submitBtn);
    });

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.ModifyProfileMessage = function(profile, submitButton){

    var _createdWidget = $('<div>').addClass('modifyProfilePopup modifyProfilePopup-'+profile.type);
    var _form = Pard.Forms.ModifyProfile[profile.type];
    var _submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');
    var _formWidget = Pard.Widgets.PrintForm(_form, _submitButton, profile.type);
    
    var user_id = Pard.ProfileManager.getUserId();
    var profile_id = profile.profile_id;

    _formWidget.setVal(profile); 

     var _deleteProfileCaller = $('<a>').attr('href','#').text('Elimina el perfil').addClass('deleteProfile-caller');

    var _deleteProfile = Pard.Widgets.PopupCreator(_deleteProfileCaller, '¿Estás seguro/a?', function(){return Pard.Widgets.DeleteProfileMessage(profile.profile_id)});

    var _closepopup = function(){};

    var _send = function(){
      var _formVal = _formWidget.getVal();
      _formVal['profile_id'] = profile.profile_id;
      _formVal['type'] = profile.type;
      _formVal['user_id'] = user_id;
      console.log(_formVal);
      if (_formVal['address']['location'] && _formVal['address']['location']['lat'] && _formVal['address']['location']['lng']){
         Pard.Backend.modifyProfile(_formVal, Pard.Events.CreateProfile);
      }
      else{
        var _content = $('<div>').addClass('very-fast reveal full');
        _content.empty();
        $('body').append(_content);
        var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
        var _closepopup2 = function(){
          _popup.close();
        }
        var _message = Pard.Widgets.PopupContent('¡Atencion!', Pard.Widgets.AlertNoMapLocation(_formVal, _closepopup2, function(){
           Pard.Backend.modifyProfile(_formVal, Pard.Events.CreateProfile);
          _closepopup();
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
    _createdWidget.append(_formWidget.render(),  _deleteProfile.render());
    
    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }

  ns.Widgets.DeleteProfileMessage = function(profile_id){  
    
    var _createdWidget = $('<div>');
    var _message = $('<p>').text('Confirmando, tu perfil será eliminado y con ello todos su contenidos. Sin embargo, no se cancelarán las propuestas enviada a convocatorias.');
    var _yesBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn confirm-delete-btn').text('Confirma');
    var _noBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn cancel-delete-btn').text('Anula');

    _yesBtn.click(function(){
      Pard.Backend.deleteProfile(profile_id, Pard.Events.DeleteProfile);
    });

    var _buttonsContainer = $('<div>').addClass('yes-no-button-container');

    _createdWidget.append(_message,  _buttonsContainer.append(_noBtn, _yesBtn));

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _noBtn.click(function(){
          callback();
        });
        _yesBtn.click(function(){
          callback()
        });
      }
    }
  }
  




}(Pard || {}));
