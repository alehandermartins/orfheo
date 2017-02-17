'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ModifyProfile = function(profile){

    var _submitBtn = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');
    var _modifyProfilePopup;
    var _createdWidget = $('<button>').addClass('modify-content-button').attr({type: 'button'}).append(Pard.Widgets.IconManager('modify_section_content').render())
      .one('click', function(){
        _modifyProfilePopup = Pard.Widgets.Popup();
      })
      .click(function(){
        _modifyMessage = Pard.Widgets.ModifyProfileMessage(profile, _submitBtn);
        _modifyMessage.setCallback(_modifyProfilePopup.close());
        _modifyProfilePopup.setContent(Pard.t.text('modifyProfile.title'), _modifyMessage.render());
        _modifyProfilePopup.open();
      });

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

    var _confirmPopup = Pard.Widgets.Popup();
    var _deleteMessage = Pard.Widgets.DeleteProfileMessage(profile.profile_id, function(){_confirmPopup.close();});
    _confirmPopup.setContent(Pard.t.text('popup.delete.title'), _deleteMessage.render());
    var _deleteProfile = $('<a>').attr('href','#/').append(Pard.Widgets.IconManager('delete').render().addClass('trash-icon-delete'), Pard.t.text('modifyProfile.delete')).addClass('deleteProfile-caller')
      .click(function(){
        _confirmPopup.open();
      });

    var _closepopup = function(){};

    var _send = function(callbackSent){
      var _formVal = _formWidget.getVal();
      _formVal['profile_id'] = profile.profile_id;
      _formVal['type'] = profile.type;
      _formVal['user_id'] = user_id;
      if (profile['links']) _formVal['links'] = profile.links;
      if (profile['photos']) _formVal['photos'] = profile.photos;
      if (_formVal['address']['location'] && _formVal['address']['location']['lat'] && _formVal['address']['location']['lng']){
         Pard.Backend.modifyProfile(_formVal, Pard.Events.CreateProfile);
         callbackSent();
      }
      else{
        var _content = $('<div>').addClass('very-fast reveal full');
        _content.empty();
        $('body').append(_content);
        var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out',multipleOpened:true});
        var _closepopup2 = function(){
          _popup.close();
        }
        var _message = Pard.Widgets.PopupContent(Pard.t.text('popup.noMapLocation.title'), Pard.Widgets.AlertNoMapLocation(_formVal, _closepopup2, function(){
           Pard.Backend.modifyProfile(_formVal, Pard.Events.CreateProfile);
          _closepopup();
        }));

        _message.setCallback(function(){
          _content.remove();
          _popup.close();
        }); 
        _content.append(_message.render());
        _popup.open();
        callbackSent();
      }
    }

    _formWidget.setSend(_send);
    _createdWidget.append(_formWidget.render(),  _deleteProfile);
    
    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }

  ns.Widgets.DeleteProfileMessage = function(profile_id, closePopup){  
    
    var _createdWidget = $('<div>');
    var _message = $('<p>').text(Pard.t.text('popup.delete.profile'));
    var _yesBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn confirm-delete-btn').text(Pard.t.text('popup.delete.confirm'));
    var _noBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn cancel-delete-btn').text(Pard.t.text('popup.delete.cancel'));

    _yesBtn.click(function(){
      Pard.Backend.deleteProfile(profile_id, Pard.Events.DeleteProfile);
      closePopup();
    });

    _noBtn.click(function(){
      closePopup();
    });

    var _buttonsContainer = $('<div>').addClass('yes-no-button-container');   

    _createdWidget.append(_message,  _buttonsContainer.append(_noBtn, _yesBtn));

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
       
      }
    }
  }
  




}(Pard || {}));
