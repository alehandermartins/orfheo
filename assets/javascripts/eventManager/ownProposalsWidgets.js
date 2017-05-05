'use strict';

(function(ns){
    ns.Widgets = ns.Widgets || {};

  ns.Widgets.CreateOwnProposal = function(forms, proposalType, participants){
    var _createdWidget = $('<div>').addClass('popupOwnProposal');
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
    
    var _printForm = function(formType){
      _contentSel.empty();
      _production_id = false;
      _formWidget = Pard.Widgets.OwnProposalForm(forms[formType].blocks, proposalType, formType);
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
    }

    for (var typeForm in forms){
      _formTypeSelector.append($('<option>').text(forms[typeForm].label).val(typeForm));
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
        _printForm(_formTypeSelector.val());
      }
    });
  
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

    var _note = $('<span>');
    var _phoneField = {
      "type" : "mandatory",
      "label" : Pard.t.text('manager.proposals.phoneL'),
      "input" : "InputTel",
      "args" : [ 
          ""
      ],
      "helptext" : _note
    }

    form['phone'] = _phoneField;

    var CategorySelector = function(block){
      var _formField = $('<div>').addClass('CategorySelector-FormField call-form-field')
      var _input = $('<select>')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)

      var catArrayTranslated = Object.keys(block.args).map(function(cat){
        return Pard.t.text('categories.'+ cat)
      })

      Object.keys(block.args).forEach(function(value, index){
        _input.append($('<option>').append(catArrayTranslated[index]).val(value))
      })
      _input.on('change',function(){
        _input.removeClass('warning')
        if(block.args[_input.val()] && block.args[_input.val()].activateOptions){
          Object.keys(block.args[_input.val()].activateOptions).forEach(function(field){
            _form[field].input.reload(block.args[_input.val()].activateOptions[field])
          })
        }
      })
      .one('click',function(){
        _input.removeClass('placeholderSelect')
      })
      
      _formField.append(_label, _input, _helptext)
    
      if(Object.keys(block.args).length == 1)
        _orfheoCategory = Object.keys(block.args)[0]

      return {
        render: function(){
          if (Object.keys(block.args).length > 1)
            return _formField
        },
        getVal: function(){
          return _input.val()
        },
        addWarning: function(){
          _input.addClass('warning')
        },
        removeWarning: function(){
          _input.removeClass('warning')
        },
        setVal: function(value){
          _input.val(value)
        },
        activate: function(){
          if(block.args[_input.val()] && block.args[_input.val()].activateOptions){
            Object.keys(block.args[_input.val()].activateOptions).forEach(function(field){
              _form[field].input.reload(block.args[_input.val()].activateOptions[field])
            });
          }
        }
      }
    }

    var SubcategorySelector = function(block){
      var _formField = $('<div>').addClass('SubcategorySelector-FormField call-form-field')
      var _input = $('<select>')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)

      Object.keys(block.args).forEach(function(value){
        _input.append($('<option>').append(block.args[value]).val(value))
      })

      _input.on('change',function(){
        _input.removeClass('warning')
      })
      .one('click',function(){
        _input.removeClass('placeholderSelect')
      })
      
      _formField.append(_label, _input, _helptext)

      if (Object.keys(block.args).length == 1)
        _subcategory = Object.keys(block.args)[0]

      return {
        render: function(){
          if (Object.keys(block.args).length > 1)
            return _formField
        },
        getVal: function(){
          return _input.val()
        },
        addWarning: function(){
          _input.addClass('warning')
        },
        removeWarning: function(){
          _input.removeClass('warning')
        },
        setVal: function(value){
          _input.val(value)
        }
      }
    }

    var Selector = function(block){
      var _formField = $('<div>').addClass('Selector-FormField call-form-field')
      var _input = $('<select>')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)
      Object.keys(block.args).forEach(function(value){
        _input.append($('<option>').append(block.args[value]).val(value))
      })
      _input.on('change',function(){
        _input.removeClass('warning')
      })
      .one('click',function(){
        _input.removeClass('placeholderSelect')
      })

      _formField.append(_label, _input, _helptext)

      return {
        render: function(){
          return _formField
        },
        getVal: function(){
          return _input.val()
        },
        addWarning: function(){
          _input.addClass('warning')
        },
        removeWarning: function(){
          _input.removeClass('warning')
        },
        setVal: function(value){
          _input.val(value)
        },
        reload: function(new_choices){
          var old_val = _input.val()
          if (new_choices == 'all') new_choices = Object.keys(block.args)
          _input.empty()
          new_choices.forEach(function(value){
            _input.append($('<option>').append(block.args[value]).val(value))
          })
          if($.inArray(old_val, new_choices)){
            _input.val(old_val)
            _input.trigger('change')
          }
        }
      }
    }

    var MultipleSelector = function(block){
      var _formField = $('<div>').addClass('MultipleSelector-FormField call-form-field')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _input = $('<select>').attr("multiple", "multiple")
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)
      Object.keys(block.args).forEach(function(value){
        _input.append($('<option>').append(block.args[value]).val(value))
      })

      _input.on('change',function(){
        _input.next().find('.ms-choice').removeClass('warning')
      })
      var _options = {      
        placeholder: Pard.t.text('widget.multipleSelector.placeholder'),
        selectAll: Pard.t.text('widget.multipleSelector.selectAllText'),
        countSelected: false,
        allSelected: Pard.t.text('widget.multipleSelector.allSelected')
      }

      _formField.append(_label, _input, _helptext)
      _helptext.css('margin-top', 5)

      return {
        render: function(){
          _input.multipleSelect(_options)
          return _formField
        },
        getVal: function(){
          return _input.val()
        },
        setVal: function(values){
          _input.multipleSelect('setSelects', values)
        },
        addWarning: function(){
          _input.next().find('.ms-choice').addClass('warning')
        },
        removeWarning: function(){
          _input.next().find('.ms-choice').removeClass('warning')
        },
        deselectAll: function(){
          _input.multipleSelect("uncheckAll")
        }
      }
    }

    var Duration = function(block){
      var _formField = $('<div>').addClass('Selector-FormField call-form-field')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _input = $('<select>')
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)

      Object.keys(block.args).forEach(function(value){
        _input.append($('<option>').append(block.args[value]).val(value))
      })
      _input.on('change',function(){
        _input.removeClass('warning')
      })
      .one('click',function(){
        _input.removeClass('placeholderSelect')
      })

      _formField.append(_label, _input, _helptext)

      return {
        render: function(){
          return _formField
        },
        getVal: function(){
          return _input.val()
        },
        addWarning: function(){
          _input.addClass('warning')
        },
        removeWarning: function(){
          _input.removeClass('warning')
        },
        setVal: function(value){
          _input.val(value)
        },
        reload: function(new_choices){
          var old_val = _input.val()
          if (new_choices == 'all') new_choices = Object.keys(block.args)
          _input.empty()
          new_choices.forEach(function(value){
            _input.append($('<option>').append(block.args[value]).val(value))
          })
          if($.inArray(old_val, new_choices)){
            _input.val(old_val)
            _input.trigger('change')
          }
        }
      }
    }

    var Links = function(block){
      var _formField = $('<div>').addClass('Input-FormField call-form-field')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _input = $('<input>').attr({'type': 'text'})
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)

      _input.on('input',function(){
        _input.removeClass('warning')
      });

      _input.on('focus', function(){
        if($(window).width()<1024){
          if ($('.reveal[aria-hidden="false"]').html()){
            var _distanceInputTop = _input.offset().top
            var _popupOpened = _input.closest('.reveal[aria-hidden="false"]')
            var _scroolTop = _popupOpened.scrollTop()
            var _distanceToDo = _distanceInputTop + _scroolTop - 120 
            _popupOpened.scrollTop(_distanceToDo)
          }
        }
      })

      _formField.append(_label, _input, _helptext)

      return{
        render: function(){
          return _formField
        },
        getVal: function(){
          return _input.val()
        },
        setVal: function(value){
          _input.val(value)
        },
        addWarning: function(){
          _input.addClass('warning')
        },
        removeWarning: function(){
          _input.removeClass('warning')
        }
      }
    }

    var CheckBox = function(block){
      var _formField = $('<div>').addClass('CheckBox-FormField call-form-field')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _input = $('<input>').attr({type: 'checkbox'})
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)

      _input.on('change', function(){
        _input.removeClass('checkBox-warning')
      })

      _formField.append(_input, _label, _helptext)
      _label.css('display','inline')
      _helptext.css({'margin-top':'0'})

      return {
        render: function(){
          return _formField
        },
        getVal: function(){
          return _input.is(":checked")
        },
        setVal: function(val){
          if (val && val != 'false'){ _input.attr('checked', val)}
          if (val === false){_input.attr('checked', false)}
        },
        addWarning: function(){
          _input.addClass('checkBox-warning')
        },
        removeWarning: function(){
          _input.removeClass('checkBox-warning')
        },
        conditions:function(){
          _helptext.html($('<a>').text('(Ver condiciones)').attr({'href': Pard.CachedEvent.conditions, 'target':'_blank'}))
        }
      }
    }

    var Text = function(block){
      var _formField = $('<div>').addClass('Input-FormField call-form-field')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _input = $('<input>').attr({'type': 'text'})
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)

      _input.on('input',function(){
        _input.removeClass('warning')
      });

      _input.on('focus', function(){
        if($(window).width()<1024){
          if ($('.reveal[aria-hidden="false"]').html()){
            var _distanceInputTop = _input.offset().top
            var _popupOpened = _input.closest('.reveal[aria-hidden="false"]')
            var _scroolTop = _popupOpened.scrollTop()
            var _distanceToDo = _distanceInputTop + _scroolTop - 120 
            _popupOpened.scrollTop(_distanceToDo)
          }
        }
      })

      _formField.append(_label, _input, _helptext)
      _label.css('display','inline')

      return{
        render: function(){
          return _formField
        },
        getVal: function(){
          return _input.val()
        },
        setVal: function(value){
          _input.val(value)
        },
        addWarning: function(){
          _input.addClass('warning')
        },
        removeWarning: function(){
          _input.removeClass('warning')
        }
      }
    }

    var TextArea = function(block){
      var _formField = $('<div>').addClass('TextArea-FormField call-form-field')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _input = $('<textarea>').attr({'type': 'text', 'rows': 4})
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)

      if(block.placeholder)
        _input.attr('placeholder', block.placeholder)

      _input.on('input',function(){
        _input.removeClass('warning')
      });

      _input.on('focus', function(){
        if($(window).width()<1024){
          if ($('.reveal[aria-hidden="false"]').html()){
            var _distanceInputTop = _input.offset().top
            var _popupOpened = _input.closest('.reveal[aria-hidden="false"]')
            var _scroolTop = _popupOpened.scrollTop()
            var _distanceToDo = _distanceInputTop + _scroolTop - 120 
            _popupOpened.scrollTop(_distanceToDo)
          }
        }
      })

      _formField.append(_label, _input, _helptext)
      _label.css('display','inline')

      return{
        render: function(){
          return _formField
        },
        getVal: function(){
          return _input.val()
        },
        setVal: function(value){
          _input.val(value)
        },
        addWarning: function(){
          _input.addClass('warning')
        },
        removeWarning: function(){
          _input.removeClass('warning')
        }
      }
    }

    

    var TextAreaCounter = function(block){
      var _formField = $('<div>').addClass('TextAreaCounter-FormField call-form-field')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _input = $('<textarea>').attr({type: 'text', rows: 1, maxlength: block.args}).addClass('short_description-input')
      var _remainingCar = $('<span>').text(block.args).css({display: 'inline', 'font-weight': 600})
      var _helptext = $('<p>').append(block.helptext, _remainingCar,'.').addClass('help-text')
      
      _input.on('input',(function(){
        _input.removeClass('warning')
        _remainingCar.text(block.args - _input.val().length)
      }));

      _formField.append(_label, _input, _helptext)

      return {
        render: function(){
          return _formField
        },
        getVal: function(){
          return _input.val();
        },
        setVal: function(value){
          _input.val(value)
          _remainingCar.text(block.args - _input.val().length)
        },
        addWarning: function(){
          _input.addClass('warning')
        },
        removeWarning: function(){
          _input.removeClass('warning')
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

    var _inputs = {
      'CategorySelector': CategorySelector,
      'SubcategorySelector': SubcategorySelector,
      'Selector': Selector,
      'MultipleSelector': MultipleSelector,
      'MultipleDaysSelector': Pard.Widgets.MultipleDaysFormField,
      'Duration': Duration,
      'Links': Links,
      'CheckBox': CheckBox,
      'Text': Text,
      'TextArea': TextArea,
      'TextAreaEnriched': Pard.Widgets.TextAreaEnrichedFormField,
      'TextAreaCounter': TextAreaCounter
    }

    var _printField = function(field){
      _form[field] = {};
      _form[field]['type'] = form[field]['type'];

      if (_inputs[form[field].input])
        _form[field].input = _inputs[form[field].input](form[field]);
      else{
        _form[field]['label'] = Pard.Widgets.InputLabel(form[field].label);
        if(form[field].type == 'mandatory') _form[field]['label'] = Pard.Widgets.InputLabel(form[field].label + ' *');
        _form[field].input = window['Pard']['Widgets'][form[field].input].apply(this, form[field].args);
        _form[field]['helptext'] = Pard.Widgets.HelpText(form[field].helptext);
      } 
      var _formField = $('<div>').addClass(form[field].input + '-FormField' + ' call-form-field');

      switch(field){
        case 'photos':
        case 'links':
        case 'bio':
        case 'conditions': 
          break;
        default:
          if (_inputs[form[field].input])
            var _formField = _form[field].input.render();
          else{
            var _formField = $('<div>').addClass(form[field].input + '-FormField' + ' call-form-field');
            _formField.append( _form[field].label.render(), _form[field].input.render(), _form[field].helptext.render());
          }
          if($.isNumeric(field)) _optionalFields.append(_formField);
          else if ($.inArray(field, _mandatoryFields) < 0) _optionalFields.prepend(_formField);
          else _containerMandatoryFields.append(_formField);
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
