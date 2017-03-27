'use strict';

(function(ns){
    ns.Widgets = ns.Widgets || {};

  ns.Widgets.CreateOwnProposal = function(forms, proposalType, participants){
    var _createdWidget = $('<div>').addClass('popupOwnProposal');
    var _translator = Pard.UserInfo['texts'].form_categories[proposalType];
    var _typeFormsCatArray = Object.keys(forms);
    var _formWidget;
    var _profile_own;
    var _send = function(){};

    var _outerFormBox = $('<div>');
    var _participantsSelectorCont = $('<div>');
    var _participantsSelector = $('<select>');
    var _formTypeSelectorCont = $('<div>');
    var _contentSel = $('<div>');
    var _formTypeSelector = $('<select>');
    var _emptyOption = $('<option>').text('').val('');
    _formTypeSelector.append(_emptyOption);
    var _t1 = $('<p>').text(Pard.t.text('manager.proposals.addAnother')).addClass('t-popupOwn');
    var _t2 = $('<p>').text(Pard.t.text('manager.proposals.orNew')).addClass('t-popupOwn');

    _participantsSelectorCont.append(_t1, _participantsSelector, _t2);
    var _emptyOptionParticpant = {
      name: '',
      email:'',
      phone:''
    };
    var _dataParticipants = [{id:'',text:'', participant: _emptyOptionParticpant}];
    var _ownIds = [];
    for (var _type in participants){
      Object.keys(participants[_type]).forEach(function(key){
        var participant = participants[_type][key];
        if($.inArray(participant.profile_id,_ownIds)<0){
          _ownIds.push(participant.profile_id)
          _dataParticipants.push({
            id: participant.profile_id,
            text: participant.name,
            participant: participant
          })
        }
      });
    }

    var _placeholderParticipantSelector = Pard.t.text('manager.proposals.byName');

    _participantsSelector.select2({
      data: _dataParticipants,
      minimumResultsForSearch: Infinity,
      dropdownCssClass: 'orfheoTypeFormSelector',
      placeholder: _placeholderParticipantSelector,
      allowClear: true
    });

    _participantsSelector.on('change',function(){
      _profile_own = _participantsSelector.select2('data')[0].participant;
      var _valToSet = {
        name:_profile_own.name,
        email:_profile_own.email,
        phone:_profile_own.phone,
        address: _profile_own.address || {},
        type: _profile_own.type || 'space'
      }
      if(_profile_own.profile_id) _t2.text('');
      else {
        _t2.text(Pard.t.text('manager.proposals.orNew'));
        if (_formWidget) _formWidget.enableFields();
      }
      if (_formWidget) _formWidget.setVal(_valToSet);
    });


    for (var typeForm in forms){
      _formTypeSelector.append($('<option>').text(_translator[typeForm]).val(typeForm));
    };

    _outerFormBox.append(_formTypeSelectorCont.append(_formTypeSelector));

    _formTypeSelector.select2({
      minimumResultsForSearch: Infinity,
      dropdownCssClass: 'orfheoTypeFormSelector',
      placeholder: Pard.t.text('manager.proposals.selectCat')
    });

    _formTypeSelector.on('change',function(){
      if (_formTypeSelector.val()){
        $('#popupForm').removeClass('top-position');
        _formTypeSelector.addClass('content-form-selected').css('font-weight','normal');
        _printForm(_formTypeSelector);
      }
    });

    var _printForm = function(formTypeSelector){
      _contentSel.empty();
      _production_id = false;
      var _typeFormSelected = formTypeSelector.val();
      _formWidget = Pard.Widgets.OwnProposalForm(forms[_typeFormSelected].blocks, proposalType, _typeFormSelected);
      _formWidget.setCallback(function(){
        _closepopup();
      });
      _formWidget.setSend(_send);
      if (_profile_own){
        var _valToSet = {
          name:_profile_own.name,
          email:_profile_own.email,
          phone:_profile_own.phone,
          address: _profile_own.address || {},
          type: _profile_own.type || 'space'
        }
        _formWidget.setVal(_valToSet);
        _formWidget.disableFields('own');
      }
      _contentSel.append(_formWidget.render());
    };

    if (Object.keys(participants).length) {
      _createdWidget.append(_participantsSelectorCont);
    }

    _createdWidget.append(_outerFormBox.append(_contentSel));

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      },
      getVal: function(){
        var _submitForm =  _formWidget.getVal();
        if (_profile_own && _profile_own.profile_id)  _submitForm['profile_id'] = _profile_own.profile_id;
        return _submitForm;
      },
      setVal: function(proposal){
        _formWidget.setVal(proposal);
      }, 
      setSend: function(send){
        _send = send;
      }
    }

  }


  ns.Widgets.OwnProposalForm = function(form, proposalType, formTypeSelected, received){
    var _mandatoryFields = ['name', 'email', 'phone', 'address', 'title', 'short_description', 'category', 'subcategory', 'duration', 'availability', 'children'];
    var _additionalForm = Pard.Forms.Proposal[proposalType];
    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');

    var _phoneField = {
      "type" : "mandatory",
      "label" : Pard.t.text('manager.proposals.phoneL'),
      "input" : "InputTel",
      "args" : [ 
          ""
      ],
      "helptext" : ""
    }

    form['phone'] = _phoneField;


    var CategorySelector = function(categories){
      var catArrayTranslated;
      catArrayTranslated = Object.keys(categories).map(function(cat){
        return Pard.t.text('categories.'+ cat);
      });

      var _createdWidget = $('<select>');
      var _emptyOption = $('<option>');
      Object.keys(categories).forEach(function(value, index){
        _createdWidget.append($('<option>').append(catArrayTranslated[index]).val(value));
      });
      _createdWidget.on('change',function(){
        _emptyOption.remove();
        _createdWidget.removeClass('warning');
        if(categories[_createdWidget.val()] && categories[_createdWidget.val()].activateOptions){
          Object.keys(categories[_createdWidget.val()].activateOptions).forEach(function(field){
            _form[field].input.reload(categories[_createdWidget.val()].activateOptions[field]);
          });
        }
      })
      .one('click',function(){
        _createdWidget.removeClass('placeholderSelect');
        _emptyOption.empty();
      });

      return {
        render: function(){
          return _createdWidget;
        },
        getVal: function(){
          return _createdWidget.val();
        },
        addWarning: function(){
          _createdWidget.addClass('warning');
        },
        removeWarning: function(){
          _createdWidget.removeClass('warning');
        },
        setVal: function(value){
          _createdWidget.val(value);
        },
        setClass: function(_class){
          _createdWidget.addClass(_class);
        },
        enable: function(){
          _createdWidget.attr('disabled',false);
        },
        disable: function(){
          _createdWidget.attr('disabled',true);
        },
        activate: function(){
          if(categories[_createdWidget.val()] && categories[_createdWidget.val()].activateOptions){
            Object.keys(categories[_createdWidget.val()].activateOptions).forEach(function(field){
              _form[field].input.reload(categories[_createdWidget.val()].activateOptions[field]);
            });
          }
        }
      }
    }

    var ActivateSelector = function(choices){

      var _createdWidget = $('<select>');
      var _emptyOption = $('<option>');
      Object.keys(choices).forEach(function(value){
        _createdWidget.append($('<option>').append(choices[value]).val(value));
      });
      _createdWidget.on('change',function(){
        _emptyOption.remove();
        _createdWidget.removeClass('warning');
      })
      .one('click',function(){
        _createdWidget.removeClass('placeholderSelect');
        _emptyOption.empty();
      });

      return {
        render: function(){
          return _createdWidget;
        },
        getVal: function(){
          return _createdWidget.val();
        },
        addWarning: function(){
          _createdWidget.addClass('warning');
        },
        removeWarning: function(){
          _createdWidget.removeClass('warning');
        },
        setVal: function(value){
          _createdWidget.val(value);
        },
        setClass: function(_class){
          _createdWidget.addClass(_class);
        },
        enable: function(){
          _createdWidget.attr('disabled',false);
        },
        disable: function(){
          _createdWidget.attr('disabled',true);
        },
        reload: function(new_choices){
          var old_val = _createdWidget.val();
          if (new_choices == 'all') new_choices = Object.keys(choices);
          _createdWidget.empty();
          new_choices.forEach(function(value){
            _createdWidget.append($('<option>').append(choices[value]).val(value));
          });
          if($.inArray(old_val, new_choices)){
            _createdWidget.val(old_val);
            _createdWidget.trigger('change');
          }
        }
      }
    }

    var Duration = function(choices){

      var _createdWidget = $('<select>');
      var _emptyOption = $('<option>');
      Object.keys(choices).forEach(function(value){
        _createdWidget.append($('<option>').append(choices[value]).val(value));
      });
      _createdWidget.on('change',function(){
        _emptyOption.remove();
        _createdWidget.removeClass('warning');
      })
      .one('click',function(){
        _createdWidget.removeClass('placeholderSelect');
        _emptyOption.empty();
      });

      return {
        render: function(){
          return _createdWidget;
        },
        getVal: function(){
          return _createdWidget.val();
        },
        addWarning: function(){
          _createdWidget.addClass('warning');
        },
        removeWarning: function(){
          _createdWidget.removeClass('warning');
        },
        setVal: function(value){
          _createdWidget.val(value);
        },
        setClass: function(_class){
          _createdWidget.addClass(_class);
        },
        enable: function(){
          _createdWidget.attr('disabled',false);
        },
        disable: function(){
          _createdWidget.attr('disabled',true);
        },
        reload: function(new_choices){
          var old_val = _createdWidget.val();
          if (new_choices == 'all') new_choices = Object.keys(choices);
          _createdWidget.empty();
          new_choices.forEach(function(value){
            _createdWidget.append($('<option>').append(choices[value]).val(value));
          });
          if($.inArray(old_val, new_choices)){
            _createdWidget.val(old_val);
            _createdWidget.trigger('change');
          }
        }
      }
    }

    var _send = function(){};

    var _submitForm = {};
    var _form = {};
    var _url = [];
    var _formContainer = $('<form>').addClass('popup-form');
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');

    var _closepopup = {};
    var spinner =  new Spinner();
    // var _photos;
    var _orfheoCategory, _subcategory, _address, _profileType;
    if (proposalType == 'space' && !received){
      _orfheoCategory = 'own';
    }

    var _displayAllBtn = $('<a>').attr('href','#/').text(Pard.t.text('manager.proposals.showFields')).css('font-size','0.75rem');
    var _containerMandatoryFields = $('<div>');
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

    var _note = $('<span>');
    var _submitItems = [];

    var _printField = function(field){
      _form[field] = {};
      _form[field]['type'] = form[field]['type'];
      if($.inArray(field, _mandatoryFields)>-1 || (received && form[field].type == 'mandatory')) _form[field]['label'] = Pard.Widgets.InputLabel(form[field].label+' *');
      else _form[field]['label'] = Pard.Widgets.InputLabel(form[field].label);
      if (form[field]['input']=='CheckBox') {
        form[field].args[0] = form[field].label;
        if (form[field]['type'] == 'mandatory') form[field].args[0] += ' *';
      }

      if(form[field].input == 'CategorySelector' || form[field].input == 'ActivateSelector' || form[field].input == 'Duration'){
        if(form[field].input == 'CategorySelector') _form[field]['input'] = CategorySelector(form[field].args)
        if(form[field].input == 'ActivateSelector') _form[field]['input'] = ActivateSelector(form[field].args)
        if(form[field].input == 'Duration') _form[field]['input'] = Duration(form[field].args)
      }
      else{
      _form[field]['input'] = window['Pard']['Widgets'][form[field].input].apply(this, form[field].args);
      }
      _form[field]['helptext'] = Pard.Widgets.HelpText(form[field].helptext);
      if(form[field].input == 'UploadPhotos' || form[field].input == 'UploadPDF'){
        _submitItems.push(_form[field].input.getPhotos());
      }

      var _formField = $('<div>').addClass(form[field].input + '-FormField' + ' call-form-field');

      switch(field){
        case 'photos':
        case 'links':
        case 'bio':
          break;
        case 'category':
          if (proposalType == 'artist'){
            if (Object.keys(form[field].args).length > 1){
              _containerMandatoryFields.append(
                _formField.append(
                  _form[field].label.render(),
                  _form[field].input.render()
                )
              );
              if (form[field]['helptext'].length) _formField.append(_form[field].helptext.render());
            }
            else{
              _orfheoCategory = Object.keys(form[field])[0];
            }
          }
          break;
        case 'subcategory':
          if ($.isArray(form[field].args[0]) && form[field].args[0].length>1){
            _containerMandatoryFields.append(
              _formField.append(
                _form[field].label.render(),
                _form[field].input.render()
              )
            );
            if (form[field]['helptext'].length) _formField.append(_form[field].helptext.render());
          }
          else{
            if ($.isArray(form[field].args[0])) _subcategory = form[field].args[0][0];
            else _subcategory = form[field].args[0];
          }
          break;
        case 'conditions': 
          return false;
          break;
        default:
          var _input = _form[field].input;
          var _label = _form[field].label.render();
          var _helptext = _form[field].helptext.render();
          if($.isNumeric(field)) _optionalFields.append(_formField);
          else if ($.inArray(field, _mandatoryFields)<0)_optionalFields.prepend(_formField);
          else _containerMandatoryFields.append(_formField);
          var _prepareFormField = function(){
            _formField.append(_label,_input.render());
            if (form[field]['helptext'].length) _formField.append(_helptext);
          }
          switch(form[field].input){
            case 'TextAreaCounter':
              _formField.append(_label,_input.render());
              break;
            case 'CheckBox':
              _formField.append(_input.render());
              if (form[field]['helptext'].length) {
                _helptext.css({'margin-top':'0'});
                _formField.append(_helptext);
              }
              break;
            case 'TextArea':
              _input.setAttr('rows', 4);
              _prepareFormField();
              break;
            case 'MultipleSelector':
            case 'MultipleDaysSelector':
              if (field == 'availability') _input.setOptions({
                    placeholder: Pard.t.text('widget.multipleDaysSelector.placeholder'),
                    selectAllText: Pard.t.text('widget.multipleDaysSelector.selectAll'),
                    countSelected: false,
                    allSelected: Pard.t.text('widget.multipleDaysSelector.alwaysAv')
                  })
              _helptext.css('margin-top', 5);
              _prepareFormField();
              break;
            case 'InputTel':
              _helptext.append(_note); 
              _formField.append(_label,_input.render(), _helptext);
              break;
            default:
              _prepareFormField();
          }
      }
    } 

    _mandatoryFields.forEach(function(field){
      if ($.inArray(field,Object.keys(form))>-1) _printField(field);
    });

    Object.keys(form).forEach(function(field){
      if ($.inArray(field,_mandatoryFields)<0)  _printField(field);
    });

    if(_form['category'])
      _form['category'].input.activate();

    var _filled = function(){
      var _check = true;
      for(var field in _form){
        if (received){
           if ($.isNumeric(field) && _form[field].type == 'mandatory' && !(_form[field].input.getVal())){
            _form[field].input.addWarning();
            _invalidInput.text(Pard.t.text('error.incomplete'));
            _check = false;
          }
        }
        if($.inArray(field, _mandatoryFields)>-1 && !(_form[field].input.getVal()) && field != 'category'){
          _form[field].input.addWarning();
          _invalidInput.text(Pard.t.text('error.incomplete'));
          _check = false;
        }
      }
      return _check;
    }

    var _getVal = function(){
      for(var field in _form){
         _submitForm[field] = _form[field].input.getVal();
      };
      if (_profileType)  _submitForm['type'] = _profileType;
      else _submitForm['type'] = proposalType;
      if (!(_submitForm['description']))_submitForm['description'] = '_';
      if (_orfheoCategory) _submitForm['category'] = _orfheoCategory;
      if (_subcategory) _submitForm['subcategory'] = _subcategory;
      _submitForm['form_category'] = formTypeSelected;
      // if (!(form['subcategory'])) _submitForm['subcategory'] = formTypeSelected;
      if (_address) _submitForm['address'] = _address;
      return _submitForm;
    }


    submitButton.on('click',function(){
      spinner.spin();
      $('body').append(spinner.el);
      submitButton.attr('disabled',true);
      if(_filled() == true){
        _send();
      }
      else{
        spinner.stop();
        submitButton.attr('disabled',false);
      }
    });

    _submitBtnContainer.append(submitButton);
    _formContainer.append(_invalidInput, _submitBtnContainer);

    return {
      render: function(){
        return _formContainer;
      },
      setSend: function(send){
        _send = function(){
          send(function(){
            spinner.stop();
            submitButton.attr('disabled',false);
          });
        }
      },
      setCallback: function(callback){
        _closepopup = callback;
      },
      getVal: function(){
        return _getVal();
      },
      setVal: function(proposal){
        for(var field in proposal){
          if (_form[field]) _form[field].input.setVal(proposal[field]);
        }
        if(proposal.proposal_type == 'space') _orfheoCategory = proposal.category;
        if (proposal.address && !form.address) _address = proposal.address;
        if (proposal.type) _profileType = proposal.type;
      },
      disableFields: function(own){
        _form['email'].input.disable();
        _form['name'].input.disable();
        _form['phone'].input.disable();
        if(!own ) _note.html(Pard.t.text('manager.proposals.modifyNote1')).css('font-weight','bold');
        else _note.html(Pard.t.text('manager.proposals.modifyNote2')).css('font-weight','bold');
       },
      enableFields: function(){
        _form['email'].input.enable();
        _form['name'].input.enable();
        _form['phone'].input.enable();
      },
      showAll: function(){
        _displayAllBtn.trigger('click');
      }
    }
  }

}(Pard || {}));
