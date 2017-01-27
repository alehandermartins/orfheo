'use strict';

(function(ns){
    ns.Widgets = ns.Widgets || {};

  ns.Widgets.CreateOwnProposal = function(forms, participantType, participants){

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
    var _t1 = $('<p>').text('Añade otra propuesta a un artista que ya has creado').addClass('t-popupOwn');
    var _t2 = $('<p>').text('...o crea algo nuevo').addClass('t-popupOwn');

    _participantsSelectorCont.append(_t1, _participantsSelector, _t2);
    var _emptyOptionParticpant = {
      name: '',
      email:'',
      phone:''
    };
    var _dataParticipants = [{id:'',text:'', participant: _emptyOptionParticpant}];
    Object.keys(participants).forEach(function(key){
      var participant = participants[key];
      _dataParticipants.push({
        id: participant.profile_id,
        text: participant.name,
        participant: participant
      })
    });

    var _placeholderParticipantSelector = "Selecciona el "+Pard.Widgets.Dictionary(participantType).render();

    _participantsSelector.select2({
      data: _dataParticipants,
      minimumResultsForSearch: Infinity,
      dropdownCssClass: 'orfheoTypeFormSelector',
      placeholder: _placeholderParticipantSelector,
      allowClear: true
    });

    _participantsSelector.on('change',function(){
      _profile_own = _participantsSelector.select2('data')[0].participant;
      if(_profile_own.profile_id) _t2.text('');
      else _t2.text('...o crea algo nuevo');
      if (_formWidget) _formWidget.setVal(_profile_own);
    });


    for (var typeForm in forms){
      _formTypeSelector.append($('<option>').text(typeForm).val(typeForm));
    };

    _outerFormBox.append(_formTypeSelectorCont.append(_formTypeSelector));

    _formTypeSelector.select2({
      minimumResultsForSearch: Infinity,
      dropdownCssClass: 'orfheoTypeFormSelector',
      placeholder: "Selecciona la categoría de la propuesta"
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
      _formWidget = Pard.Widgets.OwnProposalForm(forms[_typeFormSelected], participantType, _typeFormSelected);
      _formWidget.setCallback(function(){
        _closepopup();
      });
      _formWidget.setSend(_send);
      if (_profile_own){
        _formWidget.setVal(_profile_own);
        _formWidget.disableFields();
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


  ns.Widgets.OwnProposalForm = function(form, participantType, formTypeSelected){
    var _mandatoryFields = ['name', 'email', 'phone', 'address', 'title', 'short_description', 'duration', 'availability'];

    var _additionalForm = Pard.Forms.Proposal[participantType];

    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');

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
    var _orfheoCategory;

    var _displayAllBtn = $('<a>').attr('href','#/').text('Muestra todos los campos').css('font-size','0.75rem');
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

      var _formField = $('<div>').addClass(form[field].input + '-FormField' + ' call-form-field');
     
      switch(field){
        case 'photos':
        case 'links':
        case 'bio':
          break;  
        case 'category':
          if (form[field].args[1].length>1){
            _containerMandatoryFields.append(
              _formField.append(
                _form[field].label.render(),
                _form[field].input.render()
              )
            )
            if (form[field]['helptext'].length) _formField.append(_form[field].helptext.render());
          }
          else{
            _orfheoCategory = form[field].args[1][0];
          }
          break;
        case 'conditions': 
          return false;
          break;
        default:
          var _input = _form[field].input.render();
          var _label = _form[field].label.render();
          var _helptext = _form[field].helptext.render();
          if($.isNumeric(field)) _optionalFields.append(_formField);
          else if ($.inArray(field, _mandatoryFields)<0)_optionalFields.prepend(_formField);
          else _containerMandatoryFields.append(_formField);
          var _prepareFormField = function(){
            _formField.append(_label,_input);
            if (form[field]['helptext'].length) _formField.append(_helptext);
          }
          switch(form[field].input){
            case 'TextAreaCounter':
              _formField.append(_label,_input);
              break;
            case 'CheckBox':
              _formField.append(_input);
              if (form[field]['helptext'].length) {
                _helptext.css({'margin-top':'0'});
                _formField.append(_helptext);
              }
              break;
            case 'TextArea':
               _input.attr('rows', 4);
              _prepareFormField();
              break;
            case 'MultipleSelector':
            case 'MultipleDaysSelector':
              _prepareFormField();
              if (field == 'availability') _input.multipleSelect({
                    placeholder: "Selecciona una o más opciones",
                    selectAllText: "Selecciona todo",
                    countSelected: false,
                    allSelected: "Disponible todos los días"
                  });
              else  _input.multipleSelect({
                    placeholder: "Selecciona una o más opciones",
                    selectAll: false,
                    countSelected: false,
                    allSelected: false
                  });
              _helptext.css('margin-top', 5);
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

    var _filled = function(){
      var _check = true;
      for(var field in _form){
        if (field == 'address') console.log(_form[field].input.getVal())
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
      _submitForm['type'] = participantType;
      if (!(_submitForm['description']))_submitForm['description'] = '_';
      if (_orfheoCategory) _submitForm['category'] = _orfheoCategory;
      _submitForm['form_category'] = formTypeSelected;
      if (!(form['subcategory'])) _submitForm['subcategory'] = formTypeSelected;
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
      },
      disableFields: function(){
        // _form['email'].input.setVal('El correo no se puede modificar');
        _form['email'].input.disable()
        // _form['email'].input.setClass('text-warning');
        //_form['name'].input.setVal('El nombre sólo lo puede moficar el relativo perfil desde su página')
        _form['name'].input.disable();
        //_form['name'].input.setClass('text-warning');
      },
      showAll: function(){
        _displayAllBtn.trigger('click');
      }
    }
  }



}(Pard || {}));