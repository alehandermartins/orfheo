'use strict';

(function(ns){


  ns.Widgets.ModifyProfile = function(profile){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Modifica el perfil');
    var _submitBtn = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('OK');
    var _popup = Pard.Widgets.PopupCreator(_caller, Pard.Widgets.PopupContent('Modifica tus datos', Pard.Widgets.ModifyProfileMessage(profile, _submitBtn)));

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ModifyProfileMessage = function(profile, submitButton){

    var _createdWidget = $('<div>');
    var _submitForm = {};
    
    var _photo = Pard.Widgets.Cloudinary(1, profile.user_id + '/' + profile.profile_id + '/profile_picture');

    _createdWidget.append(_photo.render());

    _submitForm['profile_id'] = profile.profile_id;
    _submitForm['type'] = profile.type;

    var _form = Pard.Forms.ProfileForms(profile.type).render();
    var _requiredFields = _form.requiredFields();
    _form = _form.render();

    for(var field in _form){
      if(profile[field]) _form[field].input.setVal(profile[field]);
    };

    for(var field in _form){
      _createdWidget.append(_form[field].label.render().append(_form[field].input.render()), _form[field].helptext.render());
    };

    _createdWidget.append(submitButton);

    var _filled = function(){
      for (field in _form){
        if ($.inArray(field, _requiredFields) >= 0){
          if(!(_form[field].getVal())) return false;
        }
      }
      return true;
    };

    var _getVal = function(){
      for(var field in _form){
         _submitForm[field] = _form[field].getVal();
      };
      if(_photo.get_url()) _submitForm['profile_picture'] = _photo.get_url();
      // .length != 0
      return _submitForm;
    }

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        submitButton.on('click',function(){
          if(_filled() == true){
            Pard.Backend.modifyProfile(_getVal(), Pard.Events.CreateProfile);
            callback();
          }
        });
      }
    }
  }


   ns.Widgets.ToUserPage = function(){

      var _createdButton = $('<a>').attr('href','/users/').text('Pagina de usuario')

    return {
      render: function(){
        return _createdButton;
      }
    }
  }


  ns.Widgets.ModifyProduction = function(proposal){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Modifica producción');
    var _submitBtn = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('OK');
    var _popup = Pard.Widgets.PopupCreator(_caller, Pard.Widgets.PopupContent('Modifica tu producción', Pard.Widgets.ModifyProductionMessage(proposal, _submitBtn)));

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ModifyProductionMessage = function(proposal, submitButton){

    var _createdWidget = $('<div>');
    var _submitForm = {};

    _submitForm['proposal_id'] = proposal.proposal_id;


    var _form = Pard.Forms.ArtisticProduction();
    var _requiredFields = _form.requiredFields();
    _form = _form.render();

    for(var field in _form){
      if(proposal[field]) _form[field].setVal(proposal[field]);
    };

    for(var field in _form){
      _createdWidget.append(_form[field].render());
    };

    _createdWidget.append(submitButton);

    var _filled = function(){
      for (var field in _form){
        if ($.inArray(field, _requiredFields) >= 0){
          if(!(_form[field].getVal())) return false;
        }
      }
      return true;
    };

    var _getVal = function(){
      for(var field in _form){
         _submitForm[field] = _form[field].getVal();
      };
      // if(_photo.get_url().length != 0) _submitForm['proposal_picture'] = _photo.get_url();
      return _submitForm;
    }

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        submitButton.on('click',function(){
          if(_filled() == true){
            Pard.Backend.modifyProduction(_getVal(), Pard.Events.ModifyProduction);
            callback();
          }
        });
      }
    }
  }



}(Pard || {}));
