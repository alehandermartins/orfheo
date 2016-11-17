'use strict';

(function(ns){
    ns.Widgets = ns.Widgets || {};  

  ns.Widgets.CreateOwnProposal = function(forms, profileType, callbackCreatedProposal){

    var _createdWidget = $('<div>');
    
    if(!(forms)){

    }
    else{

      var _typeFormsCatArray = Object.keys(forms);   
      var _formConstructor = Pard.Widgets.PrintOwnProposalForm;
      var _formWidget;

      var _outerFormBox = $('<div>');
      var _formTypeSelectorCont = $('<div>');
      var _formTypeOptionsCont = $('<div>');
      var _contentSel = $('<div>');
      var _formTypes = [];
      var _acceptedCategories = [];
      var _formTypeSelector = $('<select>');
      var _emptyOption = $('<option>').text('Selecciona como quieres apuntarte').val('');
      _formTypeSelector.append(_emptyOption);
      
      for (var typeForm in forms){
        _formTypes.push(typeForm);
        _formTypeSelector.append($('<option>').text(typeForm).val(typeForm));
        forms[typeForm].category.args[1].forEach(function(cat){
          if ($.inArray(cat, _acceptedCategories) == -1) _acceptedCategories.push(cat);
        });
      };  

      _outerFormBox.append(_formTypeSelectorCont.append(_formTypeSelector),_formTypeOptionsCont);

      _formTypeSelector.select2({
        minimumResultsForSearch: Infinity,
        dropdownCssClass: 'orfheoTypeFormSelector',
        placeholder: "Selecciona como quieres apuntarte"
        // allowClear: true
      });


      _formTypeSelector.on('change',function(){
        if (_formTypeSelector.val()){
          $('#popupForm').removeClass('top-position');
          // $('.content-form-selected').removeClass('content-form-selected');
          _formTypeSelector.addClass('content-form-selected').css('font-weight','normal');
          // if (_t2) _t2.show();
          _printForm(_formTypeSelector);
        }
      });

      var _printForm = function(formTypeSelector, profile){
        _contentSel.empty();
        _production_id = false;
        var _typeFormSelected = formTypeSelector.val();
        _formWidget = _formConstructor(forms[_typeFormSelected], profileType, _typeFormSelected);
        _formWidget.setCallback(function(){
          _closepopup();
        });
        var _send = function(){
          var _submitForm = _formWidget.getVal();
          if (profileType == 'artist') Pard.Backend.sendArtistOwnProposal(_submitForm,callbackCreatedProposal);
          else if (profileType == 'space') Pard.Backend.sendSpaceOwnProposal(_submitForm,callbackCreatedProposal);
        };
        _formWidget.setSend(_send);
        if (profile) _formWidget.setVal(profile); 
        _contentSel.append(_formWidget.render());
      };



      // if (profile.category){
      //   var _profileCategory = Pard.Widgets.Dictionary(profile.category).render();
      //   if ($.inArray(_profileCategory, _formTypes)>-1){
      //     _formTypeSelector.val(_profileCategory);
      //     _formTypeSelector.trigger('change');
      //     _formTypeSelector.attr('disabled',true);
      //   }
      // }

      _createdWidget.append(_outerFormBox.append(_contentSel));
    } 

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      },
      getVal: function(){
        return _formWidget.getVal();
      }
    }

  }
    
  //   var _createdWidget = $('<div>');

  //   var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Crea');
  //   var _submitForm = {};
  //   var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
  //   var _invalidInput = $('<div>').addClass('not-filled-text');
  //   var _preSelected = 'music';
  //   var _closepopup = {};

  //   var user_id = the_event.user_id;

  //   _submitForm['call_id'] = the_event.call_id;
  //   _submitForm['type'] = 'artist';
  //   _submitForm['category'] = _preSelected;
   
  //   var _content = $('<form>').addClass('popup-form');

  //   var _form = {};
  //   var _requiredFields = [];

  //   var _printForm = function(_selected){
  //     _content.empty();
  //     var _fieldset = $('<fieldset>');
  //     _requiredFields = Pard.Forms.CreateArtistProposal(_selected).requiredFields();
  //     _form = Pard.Forms.CreateArtistProposal(_selected).render();
  //     _form['email'].input.setVal('hola@beniconfusionfest.es');
  //     _form['phone'].input.setVal('000 000 000');
  //     for(var field in _form){
  //       _content.append($('<div>').addClass('callPage-createArtistProposal' ).append(_form[field]['label'].render().append(_form[field]['input'].render()),_form[field]['helptext'].render()));
  //     };
  //     _submitForm['category'] = _selected;
  //   }
     

  //   var categorySelectCallback = function(){
  //     var _selected = $(this).val();
  //     _printForm(_selected);
  //   };

  //   var _categorySelector = Pard.Widgets.OrfheoArtCatSelector(categorySelectCallback);
  //   var _categoryLabel = $('<label>').text('Selecciona una categoría *');

  //   var _category = $('<div>').append(_categoryLabel.append(_categorySelector.render())).addClass('popup-categorySelector');

  //   _createdWidget.append(_category, _content, _invalidInput, _submitBtnContainer.append(submitButton));
  //   _printForm(_preSelected);
   
  //   var _filled = function(){
  //     var _check = true;
  //     for(var field in _form){
  //       if ($.inArray(field, _requiredFields) >= 0 ){
  //         if(!(_form[field].input.getVal())) {
  //           _form[field].input.addWarning();
  //           _invalidInput.text('Por favor, revisa los campos obligatorios.');
  //           _check = false;
  //         }
  //       }
  //     }
  //     if (_check) _invalidInput.empty();
  //     return _check;    
  //   };


  //   var _getVal = function(url){
  //     for(var field in _form){
  //        _submitForm[field] = _form[field].input.getVal();
  //     };
  //     return _submitForm;
  //   }

  //   submitButton.on('click',function(){
  //     if(_filled() == true){
  //       var _ownProposal = _getVal();
  //       Pard.Backend.sendOwnProposal(_ownProposal, Pard.Events.SendOwnProposal);
  //       _closepopup();
  //     }
  //   });
  

  //   return {
  //     render: function(){
  //       return _createdWidget;
  //     },
  //     setCallback: function(callback){
  //       _closepopup = callback;
  //     }
  //   }
  // }

  ns.Widgets.PrintOwnProposalForm = function(form, profileType, formTypeSelected){
    var _mandatoryFields = ['name', 'email', 'phone', 'address', 'title', 'short_description', 'duration', 'availability'];

    var _additionalForm = Pard.Forms.Proposal[profileType];


    // var _orfheoFields = ['name', 'subcategory','phone','email','address', 'title','description','short_description','duration','availability'];
    // if (form['category']['args'][1].length == 1){
    //   var _orfheoFields = Pard.Forms.FieldsForms(form['category']['args'][1]).createOwnProposal();
    // }
    // else{

    // }
    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Crea');

    var _send = function(){};

    var _submitForm = {};
    var _form = {};
    var _url = [];
    var _formContainer = $('<form>').addClass('popup-form');
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');

    var _closepopup = {};
    var spinner =  new Spinner();
    var _photos;
    var _orfheoCategory;
    var _profile_own_id;

    var _displayAllBtn = $('<a>').attr('href','#').text('Todos los campos');
    var _containerMandatoryFields = $('<div>')
    var _containerOptionalFields = $('<div>');
    var _optionalFields = $('<div>').hide();
    _containerOptionalFields.append(_displayAllBtn, _optionalFields);
    _formContainer.append(_containerMandatoryFields, _containerOptionalFields);

    _displayAllBtn.on('click', function(){
      _optionalFields.show();
      _displayAllBtn.remove();
    });

    for (var field in _additionalForm){
      form[field] = _additionalForm[field];
    }

    var _printField = function(field){
      _form[field] = {};
      _form[field]['type'] = form[field].type;
      if($.inArray(field, _mandatoryFields)>-1) _form[field]['label'] = Pard.Widgets.InputLabel(form[field].label+' *');
      else _form[field]['label'] = Pard.Widgets.InputLabel(form[field].label);
      if (form[field]['input']=='CheckBox') {
        form[field].args[0] = form[field].label;
        if (form[field]['type'] == 'mandatory') form[field].args[0] += ' *';
      }
      _form[field]['input'] = window['Pard']['Widgets'][form[field].input].apply(this, form[field].args);
      _form[field]['helptext'] = Pard.Widgets.HelpText(form[field].helptext);

      if (field == 'photos') {
        var _thumbnail = $('<div>');
        var _photosLabel = $('<label>').text(form[field].label);
        var _photoWidget = _form[field].input;
        var _photos = _photoWidget.getPhotos();
        var _photosContainer = _photoWidget.render().prepend(_photosLabel).css({'margin-bottom':'-1rem'}).addClass('photoContainer');
        if (form[field].helptext) _photosContainer.append(_form[field].helptext.render());
        _photos.cloudinary().bind('cloudinarydone', function(e, data){
          var _url = _photoWidget.getVal();
          _url.push(data['result']['public_id']);
          if(_url.length >= _photos.dataLength()) _send();
        });
      _optionalFields.prepend(_photosContainer);
      }
      else if (field == 'category'){
        // if (profile.category){
        //   _orfheoCategory = profile.category;
        // }
        // else{ 
          if (form[field].args[1].length>1){
            var _formField = $('<div>');
            _containerMandatoryFields.append(
            _formField.addClass(form[field].input + '-FormField' + ' call-form-field').append(
              _form[field].label.render(),
              _form[field].input.render())
            )
            if (form[field]['helptext'].length) _formField.append(_form[field].helptext.render());
          }
          else{
            _orfheoCategory = form[field].args[1][0]; 
          }
        // }
      }
      else{
        if (form[field].input == 'TextAreaCounter'){
          var _formField = $('<div>').addClass(form[field].input + '-FormField' + ' call-form-field').append(
                _form[field].label.render(),_form[field].input.render());
        }
        else if (form[field].input == 'CheckBox'){
          var _formField = $('<div>').addClass(form[field].input + '-FormField' + ' call-form-field').append(_form[field].input.render());
          if (form[field]['helptext'].length) {
            if (field == 'conditions') {
              // var _helptextfield = $('<p>').append($('<a>').text('(Ver condiciones)').attr({'href':form[field]['helptext'], 'target':'_blank'})).addClass('help-text');
              return false;
            }
            else {
              var _helptextfield = _form[field].helptext.render();
            }
            _helptextfield.css({'margin-top':'0'});
            _formField.append(_helptextfield);
          }  
        }
        else{
          if (form[field]['input'] == 'TextArea') _form[field]['input'].setAttr('rows', 4);
          var _formField = $('<div>').addClass(form[field].input + '-FormField' + ' call-form-field').append(
            _form[field].label.render(),
            _form[field].input.render()
          )
          if (form[field]['helptext'].length) _formField.append(_form[field].helptext.render());
          if(form[field]['input'] == 'MultipleSelector' || form[field]['input'] == 'MultipleDaysSelector'){
            if (field == 'availability'){
              _form[field].input.render().multipleSelect({      placeholder: "Selecciona una o más opciones",
                selectAllText: "Selecciona todo",
                countSelected: false,
                allSelected: "Disponible todos los días"
              });
            }
            else{
              _form[field].input.render().multipleSelect({      placeholder: "Selecciona una o más opciones",
                selectAll: false,
                countSelected: false,
                allSelected: false
              });
            }
            _form[field].helptext.render().css('margin-top', 5);
          }
        }
        if($.isNumeric(field)) _optionalFields.append(_formField);
        else if ($.inArray(field, _mandatoryFields)<0)_optionalFields.prepend(_formField);
        else _containerMandatoryFields.append(_formField);
      }
    }

    _mandatoryFields.forEach(function(field){
      if ($.inArray(field,Object.keys(form))>-1) _printField(field);
    });

    Object.keys(form).forEach(function(field){
      if ($.inArray(field,_mandatoryFields)<0)  _printField(field);
    });

    // _optionalFields.append(_conditions);


    var _filled = function(){
      var _check = true;
      for(var field in _form){
        if($.inArray(field, _mandatoryFields)>-1 && !(_form[field].input.getVal()) && field != 'category'){
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
      _submitForm['call_id'] = Pard.CachedEvent.call_id;
      _submitForm['event_id'] = Pard.CachedEvent.event_id;
      _submitForm['conditions'] = true;
      _submitForm['type'] = profileType;
      if (!(_submitForm['description']))_submitForm['description'] = '_';
      if (_profile_own_id)  _submitForm['profile_id'] = _profile_own_id;
      if (_orfheoCategory) _submitForm['category'] = _orfheoCategory;
      _submitForm['form_category'] = formTypeSelected;
      if (!(form['subcategory'])) _submitForm['subcategory'] = formTypeSelected;
      return _submitForm;
    }


    submitButton.on('click',function(){
      spinner.spin();
      $.wait(
        '',
        function(){ 
          $('body').append(spinner.el);
          submitButton.attr('disabled',true);
          if(_filled() == true){
            if(_photos){
              if(_photos.dataLength() == false) _send();
              else{
                _photos.submit();
              }
            }
            else{
              _send();
            }
          }
          else(spinner.stop());
        },
        function(){
          setTimeout(
            function(){
              submitButton.attr('disabled',false);
              spinner.stop(); 
            }, 
            1000
          );
        }
      )
    });
    
    _submitBtnContainer.append(submitButton);
    _formContainer.append(_invalidInput, _submitBtnContainer);

    return {
      render: function(){
        return _formContainer;
      },
      Spinner: function(){
        return spinner;
      },
      setSend: function(send){
        _send = send
      },
      setCallback: function(callback){
        _closepopup = callback;
      },
      getVal: function(){
        return _getVal();
      },
      setVal: function(production){
        for(var field in production){
          if (_form[field]) _form[field].input.setVal(production[field]);
        }
      }
    }
  }
    

  // ns.Widgets.PrintOwnProposal = function(proposal, artistProposalContainer){
  //   console.log(proposal);
  //   var _createdWidget = $('<span>');

  //   if (proposal['title']) var _namePopupCaller = $('<a>').attr({'href':'#'}).text(proposal['name']+' - ' + proposal['title']);
  //   else var _namePopupCaller = $('<a>').attr({'href':'#'}).text(proposal['name']);
    
  //   var _form;

  //   if (proposal.type == 'artist') {
  //     _form = Pard.Forms.ArtistCall(proposal.category);
  //   }      
  //   else _form = Pard.Forms.SpaceCall();

  //   var _popup = Pard.Widgets.PopupCreator(_namePopupCaller, Pard.ChachedEvent.name, function(){return Pard.Widgets.PrintOwnProposalMessage(proposal, _form.render(), artistProposalContainer)});

  //   _createdWidget.append(_popup.render());
    
  //   return {
  //     render: function(){
  //       return _createdWidget;
  //     }
  //   }
  // }

  ns.Widgets.PrintOwnProposal = function(proposal, form,proposalContainer){
    var _createdWidget = $('<div>');
    console.log(proposal);
    var _proposalPrinted = Pard.Widgets.PrintProposal(proposal, form[proposal.form_category]).render();

    var _deleteProposalCaller = $('<a>').attr('href','#').text('Elimina esta propuesta').addClass('deleteProfile-caller');

    var closepopup;

    var _deleteProposal = Pard.Widgets.PopupCreator(_deleteProposalCaller, '¿Estás seguro/a?', function(){return Pard.Widgets.DeleteOwnProposalMessage(proposal.proposal_id, closepopup, poposalContainer)}, 'alert-container-full');

    _createdWidget.append(_proposalPrinted, _deleteProposal.render());

    return{
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        closepopup = callback;
      }
    }

  }

  ns.Widgets.DeleteOwnProposalMessage = function(proposal_id, closepopup, artistProposalContainer){  
    
    var _createdWidget = $('<div>');
    var _yesBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn confirm-delete-btn').text('Confirma');
    var _noBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn cancel-delete-btn').text('Anula');

    var spinnerDeleteProposal =  new Spinner().spin();

    _yesBtn.click(function(){
      $('body').append(spinnerDeleteProposal.el);
      Pard.Backend.deleteProposal(proposal_id, _deleteProposalCallback);
      // artistProposalContainer.remove();
      // var _proposals = Pard.CachedProposals;
      // var _index;
      // _proposals.some(function(proposal, index){ 
      //   if (proposal.proposal_id == proposal_id ) {
      //     _index = index;
      //     return true;
      //   }
      // });
      // _proposals.splice(_index, 1);
      // Pard.CachedProposals = _proposals;
      // $('#tablePanel').empty();
      // $('#tablePanel').append(Pard.Widgets.TablePanelContent().render());
      // $('#programPanel').empty();
      // Pard.CachedCall.proposals = _proposals;
      // Pard.Widgets.Program = [];
      // Pard.Spaces = [];
      // Pard.ShownSpaces = [];
      // Pard.Artists = {};
      closepopup();
    });

     var _deleteProposalCallback = function(data){
      if (data['status'] == 'success'){
        $.wait(
          '', 
          function(){
            artistProposalContainer.remove();
            var _proposals = Pard.CachedProposals;
            var _index;
            _proposals.some(function(proposal, index){ 
              if (proposal.proposal_id == proposal_id ) {
                _index = index;
                return true;
              }
            });
            _proposals.splice(_index, 1);
            Pard.CachedProposals = _proposals;
            var _indexP = [];
            Pard.CachedCall.program.forEach(function(show, index){
              if (show.participant_proposal_id == proposal_id || show.host_proposal_id == proposal_id) {
                _indexP.push(index);
              }
            });
            _indexP.forEach(function(pos, ind){
              var _currentPos = pos - ind;
              Pard.CachedCall.program.splice(_currentPos,1);
            });

            $('#tablePanel').empty();
            $('#programPanel').empty();
            Pard.Widgets.Program = [];
            Pard.Spaces = [];
            Pard.ShownSpaces = [];
            Pard.Artists = {}; 
          },
          function(){
            spinnerDeleteProposal.stop();
            Pard.Widgets.Alert('', 'Propuesta eliminada correctamente.');
          }
        )
      }
      else{
        var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
        if (typeof _dataReason == 'object'){
          spinnerDeleteProposal.stop();
          Pard.Widgets.Alert('¡Error!', 'No se ha podido guardar los datos', location.reload());
      }
      else{
        console.log(data.reason);
        spinnerDeleteProposal.stop();
        Pard.Widgets.Alert('', _dataReason, location.reload());
      }
    }
    }

    var _buttonsContainer = $('<div>').addClass('yes-no-button-container');

    _createdWidget.append(_buttonsContainer.append(_noBtn, _yesBtn));

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


  ns.Widgets.WhiteList = function(the_event){
  	var _createdWidget = $('<div>');
    var _emailsNames = [{id:'', text:''}];
    var _namesList = [];
    var _emailsList = [];

    var _makeList = function(proposal){
      var email = {id: proposal.email, text: proposal.email};
      if($.inArray(proposal.email, _emailsList) < 0) {
        _emailsNames.push(email);
        _emailsList.push(proposal.email);
      }
      var name = {id: proposal.email, text: proposal['name']};
      if($.inArray(proposal['name'], _namesList) < 0){
        _emailsNames.push(name);
        _namesList.push(proposal['name']);
      }
    }

    the_event.artists.forEach(function(proposal){
      _makeList(proposal);
    });

    the_event.spaces.forEach(function(proposal){
      _makeList(proposal);
    });

    var _emailNameInput = Pard.Widgets.WhiteListInput(_emailsNames);

    _emailNameInput.setVal(the_event.whitelist);

		var _submitBtnContainer = $('<div>').addClass('submit-whitelist-call-manager-container');
   	var _submitBtnOuterContainer = $('<div>').addClass('submit-btn-outer-container-call-manager');
   	_submitBtnOuterContainer.append(_submitBtnContainer);
   	var _successBox = $('<span>').attr({id:'successBox-whiteList'});

   	var _submitBtn = Pard.Widgets.Button('Guarda los cambios',
     function(){
      _sendWhiteList();
    });
  
    var _sendWhiteList = function(){
      var _wl = _emailNameInput.getVal();      
      Pard.Backend.whitelist(the_event.event_id, _wl, Pard.Events.WhiteList);      
    }

	 	_submitBtnContainer.append(_successBox, _submitBtn.render());

    var _emailNameImputRendered = _emailNameInput.render();

    _createdWidget.append(_submitBtnOuterContainer, $('<label>').append(_emailNameImputRendered));

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


}(Pard || {}));
