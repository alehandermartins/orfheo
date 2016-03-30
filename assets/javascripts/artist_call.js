'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};


  ns.Widgets.CallButtonArtist = function(label,profile){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).text(label);
    var _popup = Pard.Widgets.PopupCreator(_caller, '', function(){
      return Pard.Widgets.CallMessageArtist(profile);
    });

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.CallMessageArtist = function(profile){
    var _createdWidget = $('<div>');
    var _message = $('<div>').html(
      '<h4 style="font-weight:600; margin: -1rem 0 1rem 0;">conFusión 2016</h4> Este formulario es para enviar tu propuesta al Benimaclet conFusión festival 2016. Tiene dos partes: la primera recoge los datos que definen tu producción artística, la segunda pide informaciones especificas en relación al festival.'
      ).addClass('message-form');

    var _t1 =  $('<h4>').text('I. Tu Arte').addClass('t-artistCall');
    var _t2 =  $('<h4>').text('II. Información particular').addClass('t-artistCall');
    var _m1 = $('<span>').text('Esta información se quedará en tu portfolio y se mostrará en tu perfil.').addClass('m-artistCall');
    var _m2 = $('<span>').text('Solo los organizadores del festival tendrán acceso a estos datos.').addClass('m-artistCall');

    var _part1 = $('<div>').addClass('title-part').append(_t1, _m1);

    var _part2 = $('<div>').addClass('title-part').append($('<span>').append(_t2, _m2));
  

    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Envia');
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');
    var _selected = 'music';
    var _closepopup = {};
    
    var user_id = Pard.ProfileManager.getUserId();
    var profile_id = profile.profile_id;
    var _thumbnail = $('<div>');
    var _url = [];

    var _folder = user_id + '/' + profile_id + '/photos';
    var _photos = Pard.Widgets.Cloudinary(_folder, _thumbnail, _url, 3);

    var _photosLabel = $('<label>').text('Fotos de tu arte').css({
      'padding-top': '0.5rem'
    });
    var _photosContainer = $('<div>').append(_photosLabel,_photos.render(), _thumbnail);

    _submitForm['call_id'] = 'b5bc4203-9379-4de0-856a-55e1e5f3fac6';
    _submitForm['profile_id'] = profile.profile_id;
    _submitForm['type'] = profile.type;
    _submitForm['category'] = _selected;

    var _content = $('<form>').addClass('popup-form');
    var _form = Pard.Forms.ArtistCall(_selected).render();

    _form['components']['input'].setAttr('min','1');

    var _fieldsetProduction = $('<fieldset>');
    var _fieldsetProductionContent = $('<div>');
    var _fieldsetSpecificCall = $('<fieldset>');

    var _requiredFields = Pard.Forms.ArtistCall(_selected).requiredFields();
    var _productionFields = Pard.Forms.ArtistCall(_selected).productionFields();
    var _specificCallFields = Pard.Forms.ArtistCall(_selected).specificCallFields();

    _productionFields.forEach(function(field){
      _fieldsetProductionContent.append($('<div>').addClass(field+'-ArtistCall').append(_form[field]['label'].render().append(_form[field]['input'].render()),_form[field]['helptext'].render()));
    });

    _specificCallFields.forEach(function(field){
      _fieldsetSpecificCall.append($('<div>').addClass(field+'-ArtistCall').append(_form[field]['label'].render().append(_form[field]['input'].render()),_form[field]['helptext'].render()));
    });

    _fieldsetProduction.append(_fieldsetProductionContent, _photosContainer);

    _content.append(_fieldsetProduction, _part2, _fieldsetSpecificCall);

    var _labelsCategories = ['Musica', 'Artes Escénicas', 'Exposición', 'Poesia',  'Audiovisual', 'Street Art', 'Taller', 'Otros'];
    var _valuesCategories = ['music', 'arts', 'expo', 'poetry', 'audiovisual', 'street_art', 'workshop', 'other'];
     
    var categorySelectCallback = function(){
      _selected = $(this).val();
      _fieldsetProductionContent.empty();
      _fieldsetSpecificCall.empty();
      _invalidInput.empty();
      _form = Pard.Forms.ArtistCall(_selected).render();
      _requiredFields = Pard.Forms.ArtistCall(_selected).requiredFields();
      _productionFields = Pard.Forms.ArtistCall(_selected).productionFields();
      _specificCallFields = Pard.Forms.ArtistCall(_selected).specificCallFields();
      _productionFields.forEach(function(field){
      _fieldsetProductionContent.append($('<div>').addClass(field+'-ArtistCall').append(_form[field]['label'].render().append(_form[field]['input'].render()),_form[field]['helptext'].render()));
      });
      _specificCallFields.forEach(function(field){
        _fieldsetSpecificCall.append($('<div>').addClass(field+'-ArtistCall').append(_form[field]['label'].render().append(_form[field]['input'].render()),_form[field]['helptext'].render()));
      });
      // _content.append(_fieldsetProduction, _fieldsetSpecificCall) 
      _submitForm['category'] = _selected;
      _createdWidget.append(_category, _content.append(_invalidInput), _submitBtnContainer.append(submitButton));
    };

    var _category = Pard.Widgets.Selector(_labelsCategories, _valuesCategories, categorySelectCallback);

    _category.setClass('category-input');

    var _categoryLabel = $('<label>').text('Selecciona una categoría *')

    _createdWidget.append(_message, _part1,  _categoryLabel.append(_category.render()), _content.append(_invalidInput), _submitBtnContainer.append(submitButton));

    var _filled = function(){
      var _check = _form['conditions'].input.getVal();
      for(var field in _form){
        if ($.inArray(field, _requiredFields) >= 0 ){
          if(!(_form[field].input.getVal())) {
            if (field != 'links' && field != 'personal_web') _form[field].input.addWarning();
            _invalidInput.text('Por favor, revisa los campos obligatorios.');
            _check = false;}
        }
      }
      if (_check) _invalidInput.empty();
      return _check;    
    };

    var _getVal = function(url){
      for(var field in _form){
         _submitForm[field] = _form[field].input.getVal();
      };
      _submitForm['photos'] = url;
      return _submitForm;
    }

    var _send = function(url){
      Pard.Backend.sendProposal(_getVal(url), Pard.Events.SendProposal);
    }

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

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }


  ns.Widgets.MyArtistCallProposals = function(callProposals){
    var _createdWidget = $('<div>');

    var _callName = $('<p>').append('Inscrito en ',$('<span>').text('Benimaclet conFusión festival').css({'font-weight': 'bold'}),' con:').addClass('activities-box-call-name');

    var _listProposals = $('<ul>');

    callProposals.forEach(function(proposal){
      var _caller = $('<a>').attr({href:'#'}).text(proposal['title']);
      
      var _proposalItem = $('<li>').append( Pard.Widgets.PopupCreator(_caller, 'conFusión', function(){ return Pard.Widgets.MyArtistCallProposalMessage(proposal);
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


  ns.Widgets.MyArtistCallProposalMessage = function(callProposals){

    var _createdWidget = $('<div>');

    var _form = Pard.Forms.ArtistCall(callProposals.category).render();

    for(var field in _form){
      if(callProposals[field]) _form[field]['input'].setVal(callProposals[field]);
    };

    for(var field in _form){
      _createdWidget.append(_form[field]['label'].render().append(_form[field]['input'].render()), _form[field]['helptext'].render());
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


}(Pard || {}));
