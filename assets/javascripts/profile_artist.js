(function(ns){


  ns.Widgets.ArtistProfile = function(profile){
    var _createdWidget = $('<div>');
    var _info = $('<div>');

    ['name','city', 'bio', 'personal_web'].forEach( function(element) {
      var _newField = $('<div>').text(profile[element]);
      _info.append(_newField)
    });

    var _modifyProfile = Pard.Widgets.ModifyProfile(profile).render();
    var _callButton = Pard.Widgets.CallButtonArtist(profile).render();
    var _myProductions = Pard.Widgets.MyArtistProductions(profile).render();

    _createdWidget.append(_info, _modifyProfile, _callButton, _myProductions);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.CallButtonArtist = function(profile){

    var _createdWidget = $('<div>');

    var _createdButton = Pard.Widgets.Button('Iscribe otra propuesta', function(){
      Pard.Widgets.BootboxAlert('conFusion', Pard.Widgets.CallMessageArtist(profile));
    });

    _createdWidget.append(_createdButton.render());

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.CallMessageArtist = function(profile){

    var _createdWidget = $('<div>');
    var _submitForm = {};
    var _selected = 'music';

    _submitForm['call_id'] = 'b5bc4203-9379-4de0-856a-55e1e5f3fac6';
    _submitForm['profile_id'] = profile.profile_id;
    _submitForm['type'] = profile.type;
    _submitForm['category'] = _selected;

    var _callBycategory = Pard.Forms.ArtistCallByCategory().render();

    var _content = $('<div>');
    var _form = _callBycategory[_selected].render();
    for(field in _form){
        _content.append(_form[field].render());
      };
    var _requiredFields = _callBycategory[_selected].requiredFields();;

    var _labelsCategories = ['Musica', 'Artes Escenicas', 'Exposición', 'Poesia',  'Audiovisual', 'Street Art', 'Taller', 'Otros'];
    var _valuesCategories = ['music', 'arts', 'expo', 'poetry', 'audiovisual', 'street_art', 'workshop', 'other'];

    var _category = Pard.Widgets.Selector(_labelsCategories, _valuesCategories).render();

    _createdWidget.append(_category, _content);

    _category.on('input', function(){
      _selected = $(this).val();
      _content.empty();
      _form = _callBycategory[_selected].render();
      _requiredFields = _callBycategory[_selected].requiredFields();
      for(field in _form){
      _content.append(_form[field].render());
      };
      _submitForm['category'] = _selected;
    });

    _createdWidget.append(_category, _content);

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
      callback: function(){
        if(_filled() == true) Pard.Backend.createProposal(_getVal(), Pard.Events.CreateProposal);
        else{
          return false;
        }
      }
    }
  }


/*  ns.Widgets.MyArtistCallProposals = function(profile){
    var _createdWidget = $('<div>');
    var _proposals = profile.proposals;

    _proposals.forEach(function(proposal){
      _createdWidget.append(Pard.Widgets.Button(proposal['title'], function(){
          Pard.Widgets.BootboxAlert('conFusión', Pard.Widgets.MyArtistCallProposalMessage(proposal));
       }).render());
    });
   
    return {
      render: function(){
        return _createdWidget;
      }
    }
  };


  ns.Widgets.MyArtistCallProposalMessage = function(proposal){
    
    var _createdWidget = $('<div>');
    

    var _form = Pard.Forms.ArtistCallByCategory().render();
    _form = _form[proposal.category].render();

    for(field in _form){
      if(proposal[field]) _form[field].setVal(proposal[field]);
    };

    for(field in _form){
      _createdWidget.append(_form[field].render());
    };

    return {
      render: function(){
        return _createdWidget;
      }
    }

  }*/

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
