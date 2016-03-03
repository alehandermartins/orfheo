(function(ns){


  ns.Widgets.SpaceProfile = function(profile, proposals){
    var _createdWidget = $('<div>');
    var _info = $('<div>');

    ['name','city', 'address', 'category', 'bio', 'personal_web'].forEach( function(element) {
      var _newField = $('<div>').text(profile[element]);
      _info.append(_newField)
    });


    var _modifyProfile = Pard.Widgets.ModifyProfile(profile).render();
    var _callButton = Pard.Widgets.CallSpaceButton(profile).render();
    var _myCallProposals = Pard.Widgets.MySpaceCallProposals(proposals).render();

    _createdWidget.append(_info, _modifyProfile, _callButton, _myCallProposals);

    if (proposals.length == 0) Pard.Widgets.BootboxAlert('conFusion', Pard.Widgets.CallMessageSpace(profile));

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.CallSpaceButton = function(profile){

     var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Envia una propuesta al conFusión');
    var _submitBtn = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Envia');
    var _popup = Pard.Widgets.PopupCreator(_caller, Pard.Widgets.PopupContent('conFusión', Pard.Widgets.CallMessageSpace(profile, _submitBtn)));

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }



  ns.Widgets.CallMessageSpace= function(profile, submitButton){

    var _createdWidget = $('<div>');
    var _submitForm = {};
    _submitForm['call_id'] = 'b5bc4203-9379-4de0-856a-55e1e5f3fac6';
    _submitForm['profile_id'] = profile.profile_id;
    _submitForm['type'] = profile.type;
    _submitForm['category'] = profile.category;

    var _form = Pard.Forms.SpaceCall().render();
    var _requiredFields = Pard.Forms.SpaceCall().requiredFields();

    for(field in _form){
      _createdWidget.append(_form[field].render());
    }

    _createdWidget.append(submitButton);

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


  ns.Widgets.MySpaceCallProposals = function(proposals){
    var _createdWidget = $('<div>');

    
    proposals.forEach(function(proposal){
      _createdWidget.append(Pard.Widgets.MboxCallButton('conFusión', Pard.Widgets.MboxContent('conFusión', Pard.Widgets.MySpaceCallProposalMessage(proposal).render()).render()
      ).render());
    });
   
    return {
      render: function(){
        return _createdWidget;
      }
    }
  };


  ns.Widgets.MySpaceCallProposalMessage = function(proposal){
    
    var _createdWidget = $('<div>');
  
    var _form = Pard.Forms.SpaceCall().render();

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
  }



}(Pard || {}));

