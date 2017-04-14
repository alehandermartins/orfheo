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

    var MultipleDaysSelector = function(block){
      var _formField = $('<div>').addClass('MultipleDaysSelector-FormField call-form-field')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _input = $('<select>').attr("multiple", "multiple")
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)
      var _arrayDays = []
      block.args.forEach(function(value){
        var _newDate = new Date(parseInt(value));
        var _day = moment(_newDate).locale(Pard.Options.language()).format('dddd DD/MM/YYYY')
        _input.append($('<option>').text(_day).val(value))
        _arrayDays.push(moment(_newDate).locale(Pard.Options.language()).format('YYYY-MM-DD'))
      })
      _input.on('change',function(){
        _input.next().find('.ms-choice').removeClass('warning')
      })

      var _options = {
        placeholder: Pard.t.text('widget.availability.placeholder'),
        selectAllText: Pard.t.text('widget.availability.selectAllText'),
        countSelected: false,
        allSelected: Pard.t.text('widget.availability.allSelected')
      }

      _formField.append(_label, _input, _helptext)
      _helptext.css('margin-top', 5)

      return {
        render: function(){
          _input.multipleSelect(_options)
          return _formField
        },
        getVal: function(){
          if(_input.val()){
            return _input.val().map(function(val){
              return moment(new Date(parseInt(val))).locale(Pard.Options.language()).format('YYYY-MM-DD')
            })
          }
        },
        setVal: function(values){
          var _values = []
          values.forEach(function(value){
            var _index = _arrayDays.indexOf(value)
            if (_index>-1) _values.push(block.args[_index])
          })
          _input.multipleSelect("setSelects", _values)
        },
        addWarning: function(){
          _input.next().find('.ms-choice').addClass('warning')
        },
        removeWarning: function(){
          _input.next().find('.ms-choice').removeClass('warning')
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

    var TextAreaEnriched = function(block){
      var _formField = $('<div>').addClass('TextArea-FormField call-form-field')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _input = $('<textarea>').attr({'type': 'text', 'rows': 4})
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)
      var _textAreaContainer = $('<div>')

      _input.on('focus', function(){
        if($(window).width()<1024){
          if ($('.reveal[aria-hidden="false"]').html()){
            var _distanceInputTop = _textarea.offset().top
            var _popupOpened = _textarea.closest('.reveal[aria-hidden="false"]')
            var _scroolTop = _popupOpened.scrollTop()
            var _distanceToDo = _distanceInputTop + _scroolTop - 120 
            _popupOpened.scrollTop(_distanceToDo)
          }
        }
      })

      _textAreaContainer.append(_input).addClass('TextAreaEnrichedContainer');

      if ($('#trumbowyg-icons').html()){}
      else{
        $('body').append($('<div>').css('display','none').attr('id','trumbowyg-icons')
          .append('<svg xmlns="http://www.w3.org/2000/svg"><symbol id="trumbowyg-strong" viewBox="0 0 72 72"><path d="M51.1 37.8c-1.1-1.4-2.5-2.5-4.2-3.3 1.2-.8 2.1-1.8 2.8-3 1-1.6 1.5-3.5 1.5-5.3 0-2-.6-4-1.7-5.8-1.1-1.8-2.8-3.2-4.8-4.1-2-.9-4.6-1.3-7.8-1.3h-16v42h16.3c2.6 0 4.8-.2 6.7-.7 1.9-.5 3.4-1.2 4.7-2.1 1.3-1 2.4-2.4 3.2-4.1.9-1.7 1.3-3.6 1.3-5.7.2-2.5-.5-4.7-2-6.6zM40.8 50.2c-.6.1-1.8.2-3.4.2h-9V38.5h8.3c2.5 0 4.4.2 5.6.6 1.2.4 2 1 2.7 2 .6.9 1 2 1 3.3 0 1.1-.2 2.1-.7 2.9-.5.9-1 1.5-1.7 1.9-.8.4-1.7.8-2.8 1zm2.6-20.4c-.5.7-1.3 1.3-2.5 1.6-.8.3-2.5.4-4.8.4h-7.7V21.6h7.1c1.4 0 2.6 0 3.6.1s1.7.2 2.2.4c1 .3 1.7.8 2.2 1.7.5.9.8 1.8.8 3-.1 1.3-.4 2.2-.9 3z"/></symbol><symbol id="trumbowyg-em" viewBox="0 0 72 72"><path d="M26 57l10.1-42h7.2L33.2 57H26z"/></symbol><symbol id="trumbowyg-fullscreen" viewBox="0 0 72 72"><path d="M25.2 7.1H7.1v17.7l6.7-6.5 10.5 10.5 4.5-4.5-10.4-10.5zM47.2 7.1l6.5 6.7-10.5 10.5 4.5 4.5 10.5-10.4 6.7 6.8V7.1zM47.7 43.2l-4.5 4.5 10.4 10.5-6.8 6.7h18.1V47.2l-6.7 6.5zM24.3 43.2L13.8 53.6l-6.7-6.8v18.1h17.7l-6.5-6.7 10.5-10.5z"/><path fill="currentColor" d="M10.7 28.8h18.1V11.2l-6.6 6.4L11.6 7.1l-4.5 4.5 10.5 10.5zM60.8 28.8l-6.4-6.6 10.5-10.6-4.5-4.5-10.5 10.5-6.7-6.9v18.1zM60.4 64.9l4.5-4.5-10.5-10.5 6.9-6.7H43.2v17.6l6.6-6.4zM11.6 64.9l10.5-10.5 6.7 6.9V43.2H11.1l6.5 6.6L7.1 60.4z"/></symbol><symbol id="trumbowyg-link" viewBox="0 0 72 72"><path d="M30.9 49.1l-6.7 6.7c-.8.8-1.6.9-2.1.9s-1.4-.1-2.1-.9l-5.2-5.2c-1.1-1.1-1.1-3.1 0-4.2l6.1-6.1.2-.2 6.5-6.5c-1.2-.6-2.5-.9-3.8-.9-2.3 0-4.6.9-6.3 2.6L10.8 42c-3.5 3.5-3.5 9.2 0 12.7l5.2 5.2c1.7 1.7 4 2.6 6.3 2.6s4.6-.9 6.3-2.6l6.7-6.7C38 50.5 38.6 46.3 37 43l-6.1 6.1zM38.5 22.7l6.7-6.7c.8-.8 1.6-.9 2.1-.9s1.4.1 2.1.9l5.2 5.2c1.1 1.1 1.1 3.1 0 4.2l-6.1 6.1-.2.2-6.5 6.5c1.2.6 2.5.9 3.8.9 2.3 0 4.6-.9 6.3-2.6l6.7-6.7c3.5-3.5 3.5-9.2 0-12.7l-5.2-5.2c-1.7-1.7-4-2.6-6.3-2.6s-4.6.9-6.3 2.6l-6.7 6.7c-2.7 2.7-3.3 6.9-1.7 10.2l6.1-6.1z"/><path d="M44.1 30.7c.2-.2.4-.6.4-.9 0-.3-.1-.6-.4-.9l-2.3-2.3c-.2-.2-.6-.4-.9-.4-.3 0-.6.1-.9.4L25.8 40.8c-.2.2-.4.6-.4.9 0 .3.1.6.4.9l2.3 2.3c.2.2.6.4.9.4.3 0 .6-.1.9-.4l14.2-14.2z"/></symbol><symbol id="trumbowyg-ordered-list" viewBox="0 0 72 72"><path d="M27 14h36v8H27zM27 50h36v8H27zM27 32h36v8H27zM11.8 15.8V22h1.8v-7.8h-1.5l-2.1 1 .3 1.3zM12.1 38.5l.7-.6c1.1-1 2.1-2.1 2.1-3.4 0-1.4-1-2.4-2.7-2.4-1.1 0-2 .4-2.6.8l.5 1.3c.4-.3 1-.6 1.7-.6.9 0 1.3.5 1.3 1.1 0 .9-.9 1.8-2.6 3.3l-1 .9V40H15v-1.5h-2.9zM13.3 53.9c1-.4 1.4-1 1.4-1.8 0-1.1-.9-1.9-2.6-1.9-1 0-1.9.3-2.4.6l.4 1.3c.3-.2 1-.5 1.6-.5.8 0 1.2.3 1.2.8 0 .7-.8.9-1.4.9h-.7v1.3h.7c.8 0 1.6.3 1.6 1.1 0 .6-.5 1-1.4 1-.7 0-1.5-.3-1.8-.5l-.4 1.4c.5.3 1.3.6 2.3.6 2 0 3.2-1 3.2-2.4 0-1.1-.8-1.8-1.7-1.9z"/></symbol><symbol id="trumbowyg-unordered-list" viewBox="0 0 72 72"><path d="M27 14h36v8H27zM27 50h36v8H27zM9 50h9v8H9zM9 32h9v8H9zM9 14h9v8H9zM27 32h36v8H27z"/></symbol><symbol id="trumbowyg-view-html" viewBox="0 0 72 72"><path fill="none" stroke="currentColor" stroke-width="8" stroke-miterlimit="10" d="M26.9 17.9L9 36.2 26.9 54M45 54l17.9-18.3L45 17.9"/></symbol><symbol id="trumbowyg-base64" viewBox="0 0 72 72"><path d="M64 17v38H8V17h56m8-8H0v54h72V9z"/><path d="M29.9 28.9c-.5-.5-1.1-.8-1.8-.8s-1.4.2-1.9.7c-.5.4-.9 1-1.2 1.6-.3.6-.5 1.3-.6 2.1-.1.7-.2 1.4-.2 1.9l.1.1c.6-.8 1.2-1.4 2-1.8.8-.4 1.7-.5 2.7-.5.9 0 1.8.2 2.6.6.8.4 1.6.9 2.2 1.5.6.6 1 1.3 1.2 2.2.3.8.4 1.6.4 2.5 0 1.1-.2 2.1-.5 3-.3.9-.8 1.7-1.5 2.4-.6.7-1.4 1.2-2.3 1.6-.9.4-1.9.6-3 .6-1.6 0-2.8-.3-3.9-.9-1-.6-1.8-1.4-2.5-2.4-.6-1-1-2.1-1.3-3.4-.2-1.3-.4-2.6-.4-3.9 0-1.3.1-2.6.4-3.8.3-1.3.8-2.4 1.4-3.5.7-1 1.5-1.9 2.5-2.5 1-.6 2.3-1 3.8-1 .9 0 1.7.1 2.5.4.8.3 1.4.6 2 1.1.6.5 1.1 1.1 1.4 1.8.4.7.6 1.5.7 2.5h-4c0-1-.3-1.6-.8-2.1zm-3.5 6.8c-.4.2-.8.5-1 .8-.3.4-.5.8-.6 1.2-.1.5-.2 1-.2 1.5s.1.9.2 1.4c.1.5.4.9.6 1.2.3.4.6.7 1 .9.4.2.9.3 1.4.3.5 0 1-.1 1.3-.3.4-.2.7-.5 1-.9.3-.4.5-.8.6-1.2.1-.5.2-.9.2-1.4 0-.5-.1-1-.2-1.4-.1-.5-.3-.9-.6-1.2-.3-.4-.6-.7-1-.9-.4-.2-.9-.3-1.4-.3-.4 0-.9.1-1.3.3zM36.3 41.3v-3.8l9-12.1H49v12.4h2.7v3.5H49v4.8h-4v-4.8h-8.7zM45 30.7l-5.3 7.2h5.4l-.1-7.2z"/></symbol><symbol id="trumbowyg-create-link" viewBox="0 0 72 72"><path d="M31.1 48.9l-6.7 6.7c-.8.8-1.6.9-2.1.9s-1.4-.1-2.1-.9L15 50.4c-1.1-1.1-1.1-3.1 0-4.2l6.1-6.1.2-.2 6.5-6.5c-1.2-.6-2.5-.9-3.8-.9-2.3 0-4.6.9-6.3 2.6L11 41.8c-3.5 3.5-3.5 9.2 0 12.7l5.2 5.2c1.7 1.7 4 2.6 6.3 2.6s4.6-.9 6.3-2.6l6.7-6.7c2.5-2.6 3.1-6.7 1.5-10l-5.9 5.9zM38.7 22.5l6.7-6.7c.8-.8 1.6-.9 2.1-.9s1.4.1 2.1.9l5.2 5.2c1.1 1.1 1.1 3.1 0 4.2l-6.1 6.1-.2.2L42 38c1.2.6 2.5.9 3.8.9 2.3 0 4.6-.9 6.3-2.6l6.7-6.7c3.5-3.5 3.5-9.2 0-12.7l-5.2-5.2c-1.7-1.7-4-2.6-6.3-2.6s-4.6.9-6.3 2.6l-6.7 6.7c-2.7 2.7-3.3 6.9-1.7 10.2l6.1-6.1c0 .1 0 .1 0 0z"/><path d="M44.2 30.5c.2-.2.4-.6.4-.9 0-.3-.1-.6-.4-.9l-2.3-2.3c-.3-.2-.6-.4-.9-.4-.3 0-.6.1-.9.4L25.9 40.6c-.2.2-.4.6-.4.9 0 .3.1.6.4.9l2.3 2.3c.2.2.6.4.9.4.3 0 .6-.1.9-.4l14.2-14.2zM49.9 55.4h-8.5v-5h8.5v-8.9h5.2v8.9h8.5v5h-8.5v8.9h-5.2v-8.9z"/></symbol><symbol id="trumbowyg-del" viewBox="0 0 72 72"><path d="M45.8 45c0 1-.3 1.9-.9 2.8-.6.9-1.6 1.6-3 2.1s-3.1.8-5 .8c-2.1 0-4-.4-5.7-1.1-1.7-.7-2.9-1.7-3.6-2.7-.8-1.1-1.3-2.6-1.5-4.5l-.1-.8-6.7.6v.9c.1 2.8.9 5.4 2.3 7.6 1.5 2.3 3.5 4 6.1 5.1 2.6 1.1 5.7 1.6 9.4 1.6 2.9 0 5.6-.5 8-1.6 2.4-1.1 4.3-2.7 5.6-4.7 1.3-2 2-4.2 2-6.5 0-1.6-.3-3.1-.9-4.5l-.2-.6H44c0 .1 1.8 2.3 1.8 5.5zM29 28.9c-.8-.8-1.2-1.7-1.2-2.9 0-.7.1-1.3.4-1.9.3-.6.7-1.1 1.4-1.6.6-.5 1.4-.9 2.5-1.1 1.1-.3 2.4-.4 3.9-.4 2.9 0 5 .6 6.3 1.7 1.3 1.1 2.1 2.7 2.4 5.1l.1.9 6.8-.5v-.9c-.1-2.5-.8-4.7-2.1-6.7s-3.2-3.5-5.6-4.5c-2.4-1-5.1-1.5-8.1-1.5-2.8 0-5.3.5-7.6 1.4-2.3 1-4.2 2.4-5.4 4.3-1.2 1.9-1.9 3.9-1.9 6.1 0 1.7.4 3.4 1.2 4.9l.3.5h11.8c-2.3-.9-3.9-1.7-5.2-2.9zm13.3-6.2zM22.7 20.3zM13 34.1h46.1v3.4H13z"/></symbol><symbol id="trumbowyg-unlink" viewBox="0 0 72 72"><path d="M30.9 49.1l-6.7 6.7c-.8.8-1.6.9-2.1.9s-1.4-.1-2.1-.9l-5.2-5.2c-1.1-1.1-1.1-3.1 0-4.2l6.1-6.1.2-.2 6.5-6.5c-1.2-.6-2.5-.9-3.8-.9-2.3 0-4.6.9-6.3 2.6L10.8 42c-3.5 3.5-3.5 9.2 0 12.7l5.2 5.2c1.7 1.7 4 2.6 6.3 2.6s4.6-.9 6.3-2.6l6.7-6.7C38 50.5 38.6 46.3 37 43l-6.1 6.1zM38.5 22.7l6.7-6.7c.8-.8 1.6-.9 2.1-.9s1.4.1 2.1.9l5.2 5.2c1.1 1.1 1.1 3.1 0 4.2l-6.1 6.1-.2.2-6.5 6.5c1.2.6 2.5.9 3.8.9 2.3 0 4.6-.9 6.3-2.6l6.7-6.7c3.5-3.5 3.5-9.2 0-12.7l-5.2-5.2c-1.7-1.7-4-2.6-6.3-2.6s-4.6.9-6.3 2.6l-6.7 6.7c-2.7 2.7-3.3 6.9-1.7 10.2l6.1-6.1z"/><path d="M44.1 30.7c.2-.2.4-.6.4-.9 0-.3-.1-.6-.4-.9l-2.3-2.3c-.2-.2-.6-.4-.9-.4-.3 0-.6.1-.9.4L25.8 40.8c-.2.2-.4.6-.4.9 0 .3.1.6.4.9l2.3 2.3c.2.2.6.4.9.4.3 0 .6-.1.9-.4l14.2-14.2zM41.3 55.8v-5h22.2v5H41.3z"/></symbol><symbol id="trumbowyg-back-color" viewBox="0 0 72 72"><path d="M36.5 22.3l-6.3 18.1H43l-6.3-18.1z"/><path d="M9 8.9v54.2h54.1V8.9H9zm39.9 48.2L45 46H28.2l-3.9 11.1h-7.6L32.8 15h7.8l16.2 42.1h-7.9z"/></symbol></svg>'
          )
        )
      }

      _input.trumbowyg({
        btns: [
          ['strong', 'em'],
          ['link'],
          'btnGrp-lists'
        ],
        autogrow: true
      })
      
      _input.on('tbwchange', function(){
        _createdWidget.removeClass('warning')
      })

      _formField.append(_label, _textAreaContainer, _helptext)

      return {
        render: function(){
          return _formField;
        },
        getVal: function(){
          return _input.trumbowyg('html')
        },
        setVal: function(value){
          _input.trumbowyg('html', value)
        },
        addWarning: function(){
          _textAreaContainer.addClass('warning')
        },
        removeWarning: function(){
          _textAreaContainer.removeClass('warning')
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


    var _printField = function(field){
      _form[field] = {};
      _form[field]['type'] = form[field]['type'];

      var _inputs = {
        'CategorySelector': CategorySelector,
        'SubcategorySelector': SubcategorySelector,
        'Selector': Selector,
        'MultipleSelector': MultipleSelector,
        'MultipleDaysSelector': MultipleDaysSelector,
        'Duration': Duration,
        'Links': Links,
        'CheckBox': CheckBox,
        'Text': Text,
        'TextArea': TextArea,
        'TextAreaEnriched': TextAreaEnriched,
        'TextAreaCounter': TextAreaCounter
      }
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
