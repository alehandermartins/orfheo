'use strict';


(function(ns){


  ns.Widgets.ArtistProfile = function(profile, proposals){
    var _createdWidget = $('<div>');
    var _info = $('<div>');

    ['name','city', 'bio', 'personal_web'].forEach( function(element) {
      var _newField = $('<div>').text(profile[element]);
      _info.append(_newField)
    });

    if('profile_picture' in profile){
      var _photo = $.cloudinary.image(profile['profile_picture'][0],
        { format: 'jpg', width: 50, height: 50,
          crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
      _info.append(_photo);
    }

    var _modifyProfile = Pard.Widgets.ModifyProfile(profile).render();
    var _callButton = Pard.Widgets.CallButtonArtist(profile).render();
    var _myProductions = Pard.Widgets.MyArtistProductions(profile).render();
    var _myCallProposals = Pard.Widgets.MyArtistCallProposals(proposals).render();

    _createdWidget.append(_info, _modifyProfile, _callButton, _myProductions, _myCallProposals);

    $(document).ready(function(){
      if (proposals.length == 0) _callButton.trigger('click');
    });

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.CallButtonArtist = function(profile){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Envia una propuesta al conFusión');
    var _submitBtn = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Envia');
    var _popup = Pard.Widgets.PopupCreator(_caller, Pard.Widgets.PopupContent('conFusión', Pard.Widgets.CallMessageArtist(profile, _submitBtn)));

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.CallMessageArtist = function(profile, submitButton){

    var _createdWidget = $('<div>');
    var _submitForm = {};
    var _selected = 'music';

    _submitForm['call_id'] = 'b5bc4203-9379-4de0-856a-55e1e5f3fac6';
    _submitForm['profile_id'] = profile.profile_id;
    _submitForm['type'] = profile.type;
    _submitForm['category'] = _selected;

    var _content = $('<div>');
    var _form = Pard.Forms.ArtistCall(_selected).render();

    for(field in _form){
        _content.append(_form[field].render());
      };
    var _requiredFields = Pard.Forms.ArtistCall(_selected).requiredFields();;

    var _labelsCategories = ['Musica', 'Artes Escenicas', 'Exposición', 'Poesia',  'Audiovisual', 'Street Art', 'Taller', 'Otros'];
    var _valuesCategories = ['music', 'arts', 'expo', 'poetry', 'audiovisual', 'street_art', 'workshop', 'other'];

    var _category = Pard.Widgets.Selector(_labelsCategories, _valuesCategories).render();

    _createdWidget.append(_category, _content, submitButton);

    _category.on('change', function(){
      _selected = $(this).val();
      _content.empty();
      _form = Pard.Forms.ArtistCall(_selected).render();
      _requiredFields = Pard.Forms.ArtistCall(_selected).requiredFields();
      for(field in _form){
        _content.append(_form[field].render());
      };
      _submitForm['category'] = _selected;
      _createdWidget.append(_category, _content, submitButton);
    });

    var _filled = function(){
      for (field in _form){;
        if ($.inArray(field, _requiredFields) >= 0 ){
          if(_form[field].getVal().length == 0) return false;
        }
      }
      return _form['conditions'].getVal();
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
      setCallback: function(callback){
        submitButton.on('click',function(){
          if(_filled() == true){
            Pard.Backend.createProposal(_getVal(), Pard.Events.CreateProposal);
            callback();
          }
        })
      }
    }
  }


  ns.Widgets.MyArtistCallProposals = function(callProposals){
    var _createdWidget = $('<div>');

    callProposals.forEach(function(proposal){
      var _proposalBtn = Pard.Widgets.Button('conFusión -' + proposal['title']);
      _createdWidget.append(Pard.Widgets.PopupCreator(_proposalBtn.render(), Pard.Widgets.PopupContent('conFusión', Pard.Widgets.MyArtistCallProposalMessage(proposal))).render());
    });

    return {
      render: function(){
        return _createdWidget;
      }
    }
  };


  ns.Widgets.MyArtistCallProposalMessage = function(callProposals){

    var _createdWidget = $('<div>');


    var _form = Pard.Forms.ArtistCall(callProposals.category).render();

    for(field in _form){
      if(callProposals[field]) _form[field].setVal(callProposals[field]);
    };

    for(field in _form){
      _createdWidget.append(_form[field].render());
    };

    var _closeBtn = Pard.Widgets.Button('Cierra').render();

    _createdWidget.append(_closeBtn);

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closeBtn.on('click', function(){
          callback();
        })
      }
    }

  }


  ns.Widgets.MyArtistProductions = function(profile){
    var _createdWidget = $('<div>');
    var _content = $('<div>');
    var _proposals = profile.proposals;

    if (_proposals){
      _proposals.forEach(function(proposal){
        _createdWidget.append(Pard.Widgets.Button(proposal['title'], function(){
          _content.empty();
          _content.append(Pard.Widgets.MyArtistProductionsContent(proposal).render());
       }).render());
      });
    }

    _createdWidget.append(_content);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  };


  ns.Widgets.MyArtistProductionsContent = function(proposal){

    var _createdWidget = $('<div>');
    var _infoField = $('<div>');


    for(field in proposal){
      if(proposal[field] != null){
        if(proposal[field].length != 0 && field != 'proposal_id') {
          var _newField = $('<div>').text(field+': '+proposal[field]);
          _createdWidget.append(_newField);
        }
      }
    };

    return {
      render: function(){
        return _createdWidget;
      }
    }

  }




}(Pard || {}));
