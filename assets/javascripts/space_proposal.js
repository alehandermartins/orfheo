'use strict';

(function(ns){



  ns.Widgets.CallSpaceButton = function(profile, label){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).text(label);
    var _popup = Pard.Widgets.PopupCreator(_caller, '', function(){return Pard.Widgets.CallMessageSpace(profile)});

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.CallMessageSpace= function(profile){

    var _createdWidget = $('<div>');
    var _message = $('<div>').html(
      '<h4 style="font-weight:600; margin: -1rem 0 1rem 0;">conFusión 2016</h4> Con este formulario enviarás tu propuesta de participación al Benimaclet conFusión festival 2016. Los datos que recoge serán privados y podrán ser consultados sólo por ti y la organización del festival.'
      ).addClass('message-form');
    var _formContainer = $('<form>').addClass('popup-form');
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');

    _submitForm['call_id'] = 'b5bc4203-9379-4de0-856a-55e1e5f3fac6';

    _submitForm['profile_id'] = profile.profile_id;
    _submitForm['type'] = profile['type'];
    _submitForm['category'] = profile.category;

    var _form = Pard.Forms.SpaceCall().render();
    var _requiredFields = Pard.Forms.SpaceCall().requiredFields();

    for(var field in _form){
      _formContainer.append($('<div>').addClass(field+'-SpaceCall').append(_form[field].label.render().append(_form[field].input.render()),_form[field].helptext.render()));
    }

    var _beCarefullText = $('<p>').text('ATENCIÓN: Una vez enviado, no te será permitido modificar el contenido de este formulario (como mucho, para pequeñas correcciones, podrás enmendarlo). Por lo tanto, por favor, repasa bien todos sus campos antes de pinchar el boton "Envía".').css({'margin-top':'1rem','margin-bottom':'2rem'});


    var _filled = function(){
      var _check = _form['conditions'].input.getVal();
      for(var field in _form){
        if ($.inArray(field, _requiredFields) >= 0 ){
          if(!(_form[field].input.getVal())) {
            _form[field].input.addWarning();
            _formContainer.append(_invalidInput);
            _invalidInput.text('Por favor, revisa los campos obligatorios.');
            _check = false;}
        }
      }
      if (_check) _invalidInput.empty();
      return _check;    
    };

    var _getVal = function(){
      for(var field in _form){
         _submitForm[field] = _form[field].input.getVal();
      };
      return _submitForm;
    }

    var _submitBtn = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Envía');

    _createdWidget.append(_message, _formContainer, _beCarefullText, _submitBtnContainer.append(_submitBtn));

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _submitBtn.on('click',function(){
          if(_filled() == true){ 
            Pard.Backend.sendProposal(_getVal(), Pard.Events.SendProposal); 
            callback();
          }
        })
      }
    }
  }


  ns.Widgets.MySpaceCallProposals = function(callProposals){
    
    var _createdWidget = $('<div>');

    var _callName = $('<p>').append('Inscrito en ',$('<span>').text('Benimaclet conFusión festival 2016').css({'font-weight': 'bold'})).addClass('activities-box-call-name');

    var _listProposals = $('<ul>');

    callProposals.forEach(function(proposal){
      var _caller = $('<a>').attr({href:'#'}).text('Formulario enviado');
      
      var _proposalItem = $('<li>').append( Pard.Widgets.PopupCreator(_caller, 'conFusión 2016', function(){ return Pard.Widgets.MySpaceCallProposalMessage(proposal);
        }).render());
      _listProposals.append(_proposalItem);
        
    });

    _createdWidget.append(_callName, _listProposals);
   
    return {
      render: function(){
        return _createdWidget;
      }
    }
  };


  ns.Widgets.MySpaceCallProposalMessage = function(proposal){
    
    var _createdWidget = $('<div>');
  
    var _form = Pard.Forms.SpaceCall().render();
    // var _sentCall = Pard.Widgets.PrintSentCall(proposal, _form).render();

    // _createdWidget.append(_sentCall);

        var _closepopup = {};


    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
        var _sentCall = Pard.Widgets.PrintSentCall(proposal, _form, _closepopup).render();
        _createdWidget.append(_sentCall); 
        // _closeBtn.on('click', function(){ 
        //   callback(); 
        // })
      }
    }
  }


  

}(Pard || {}));

