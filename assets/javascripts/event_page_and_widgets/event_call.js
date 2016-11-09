'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};  

  ns.Widgets.ListProfiles = function(eventInfo, button){
    return {
      render: function(data){
        if(data['status'] == 'success'){
          var _caller = $('<button>');
          var _popup = Pard.Widgets.PopupCreator(_caller,'Inscribe un perfil ya creado', function(){return Pard.Widgets.ChooseProfileMessage(data.profiles, eventInfo, button)});
          _caller.trigger('click');
        }
        else{
          Pard.Widgets.Alert('Problema en el servidor', _dataReason).render();
        }
      }
    }
  }

  ns.Widgets.ChooseProfileMessage = function(profiles, event_info, _button){

    var _call_id = event_info.call_id;
    var _createdWidget = $('<div>');
    var _closeListProfilePopup = function(){};

    var _callbackSendProposal = function(data){
      if (data['status'] == 'success'){
        var _caller = $('<button>');
        var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return _popupMessageSentProposal(data)});
        _caller.trigger('click');
      }
      else{
        var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
        if (typeof  _dataReason == 'object'){
          var _caller = $('<button>');
          var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return  _dataReason}, 'alert-container-full');
          _caller.trigger('click');
        }
        else{
          var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
          Pard.Widgets.Alert('', _dataReason);
        }
      }
    }

    var _popupMessageSentProposal = function(data){
      var _container = $('<div>')
      var _closepopup = function(){};
      var _message = $('<div>').append($('<h4>').text('¡Genial!').addClass('success-inscription-title'),$('<h5>').text('Te has inscrito correctamente.').css({
        'text-align':'center',
        'margin-bottom': '2rem'
      }));
      var _toProfilePageBtn = Pard.Widgets.Button('Ve a pagína de perfil', function(){
          location.href = '/profile?id=' + data['profile_id'];  
      }).render().addClass('success-inscription-btn');
      var _sendOtherProposal = Pard.Widgets.Button('Envía otra propuesta', function(){
          _closepopup();
          _closeListProfilePopup();
          _button.trigger('click');
      }).render().addClass('success-inscription-btn');
      _container.append(_message, _toProfilePageBtn, _sendOtherProposal);
      return {
        render: function(){
          return _container;
        },
        setCallback: function(callback){
          _closepopup = callback;
        }
      }
    }
              
    profiles.forEach(function(profile){
      var _cardContainer = $('<div>').addClass('card-container-popup position-profileCard-login');
      var _card = Pard.Widgets.CreateCard(profile).render();
      // var _card = $('<button>').text(profile.name);
      _card.removeAttr('href');
      _card.attr('href','#');
      _card.click(function(){
        if (profile.type == 'space' && profile.proposals && profile.proposals[0]) Pard.Widgets.Alert('Este perfil no puede enviar más propuestas', 'Este espacio ya está apuntado en el conFusión 2016. ');
        else{
          Pard.Widgets.GetCallForms(_forms, event_info, profile, _callbackSendProposal);
        }
      });
      _createdWidget.append(_cardContainer.append(_card));
    });

    var _secondTitle = $('<h4>').text('...o crea e inscribe uno nuevo');
    _secondTitle.css({
      'margin-top': '2rem'
    });
    var _createAndInscribeProfile = function(data){
      if (data['status'] == 'success'){
        var _profile = data.profile;
        Pard.Widgets.GetCallForms(_forms, event_info, _profile, _callbackSendProposal); 
      }
      else{
        var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
        if (typeof _dataReason == 'object'){
          var _caller = $('<button>');
          var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return _dataReason}, 'alert-container-full');
          _caller.trigger('click');
        }
        else{ 
          console.log(data.reason);
          Pard.Widgets.Alert('', _dataReason);
        }
      }
    }

    var _createProfileCard;
    var _forms;
    Pard.Backend.getCallForms(event_info.call_id, function(data){
      _forms = data.forms
      console.log(data)
      _createProfileCard = Pard.Widgets.CreateProfileCard(_createAndInscribeProfile, Object.keys(_forms));
      _createdWidget.append(_secondTitle, _createProfileCard.render().addClass('card-container-popup position-profileCard-login'));
    });

    // var _createProfileCard = Pard.Widgets.CreateProfileCard(_createAndInscribeProfile, data);



    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closeListProfilePopup = callback;
      }
    } 
  }



  ns.Widgets.GetCallForms = function(forms, eventInfo, profile, callbackSendProposal){
    var _content = $('<div>').addClass('very-fast reveal full top-position');
    _content.empty();
    $('body').append(_content);
    var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
    var _message = Pard.Widgets.PopupContent(eventInfo.name, Pard.Widgets.FormManager(forms, profile, callbackSendProposal));
    _message.setCallback(function(){
      _content.remove();
      _popup.close();
    });
    _content.append(_message.render());
    _popup.open();
  };


  ns.Widgets.FormManager = function(forms, profile, callbackSendProposal){
    var _createdWidget = $('<div>');
    var _initialMexText = 'Este es el <strong>formulario</strong> para inscribirte en la convocatoria <strong>de '+Pard.CachedEvent.organizer+'</strong> como '+Pard.Widgets.Dictionary(profile.type).render().toLowerCase()+':'
    var _initialMex = $('<h6>').html(_initialMexText).css('margin-bottom','1.5rem');
    _createdWidget.append(_initialMex); 
    var _closepopup = {};
    var _production_id;
    var _typeFormsCatArray = Object.keys(forms);
    if($.inArray(profile.type, _typeFormsCatArray) < 0){
      var _okProfiles = '';
      _typeFormsCatArray.forEach(function(type,index){
        if(type != 'call_id') {
          _okProfiles += ' '+Pard.Widgets.Dictionary(type).render().toLowerCase();
          if (index<_typeFormsCatArray.length-2) _okProfiles+=','; 
          else if (index == _typeFormsCatArray.length-2) _okProfiles+=' y'
        }
      });
      _createdWidget.append($('<p>').text('ATENCIÓN, NO PUEDES CONTINUAR'), $('<p>').html('Esta convocatoría es solo para perfiles de<strong>'+_okProfiles+'</strong>. Selecciona o crea uno de de los tipos aceptados para seguir.').css({'font-size':'1rem'}));
    }
    else{
      var _formTypeConstructor = {
        artist: Pard.Widgets.ArtistCallForm,
        space: Pard.Widgets.ArtistCallForm
      };

      var _outerFormBox = $('<div>');
      var _formTypeSelectorCont = $('<div>');
      var _formTypeOptionsCont = $('<div>');
      var _contentSel = $('<div>');
      var _formTypes = [];
      var _acceptedCategories = [];
      var _formTypeSelector = $('<select>');
      var _emptyOption = $('<option>').text('Selecciona como quieres apuntarte').val('');
      _formTypeSelector.append(_emptyOption);
      
      for (var typeForm in forms[profile.type]){
        _formTypes.push(typeForm);
        _formTypeSelector.append($('<option>').text(typeForm).val(typeForm));
        forms[profile.type][typeForm].category.forEach(function(cat){
          if ($.inArray(cat, _acceptedCategories) == -1) _acceptedCategories.push(cat);
        });
      };  

      _outerFormBox.append(_formTypeSelectorCont.append(_formTypeSelector),_formTypeOptionsCont);

      if(profile.productions && profile.productions.length){
        var _t1 = $('<div>').append($('<h5>').text('apúntate con una propuesta de tu portfolio')).css({
          'margin-top':'1.5rem',
          'margin-bottom':'1rem'
        });
        var _t2 = $('<div>').append($('<h5>').text('...o propón algo nuevo')).css({
          'margin-bottom':'1rem'
        });
        var _prodContainer = $('<div>').addClass('prodContainer-event-page');
        _prodContainer.append(_t1);
        var _compatibleProductions = false;
        profile.productions.forEach(function(production){
          if ($.inArray(production.category, _acceptedCategories)>-1){
            var _prodBtn = $('<div>').addClass('production-nav-element-container production-btn-event-page');
            var _iconColumn = $('<div>').addClass(' icon-column').append($('<div>').addClass('nav-icon-production-container').append($('<div>').addClass('production-icon-container').append(Pard.Widgets.IconManager(production['category']).render().css({'text-align': 'center', display:'block'}))));
            _iconColumn.css({
              'padding':'0.2rem'
            })
            var _nameColumn = $('<div>').addClass('name-column name-column-production-nav').css('margin-top', '-0.4rem');
            var _name = $('<p>').text(production['title']).addClass('profile-nav-production-name');

            _prodBtn.append(_iconColumn, _nameColumn.append(Pard.Widgets.FitInBox(_name,125,45).render()));
            _prodContainer.append(_prodBtn);
            _compatibleProductions = true;
            _prodBtn.click(function(){
              if (_prodBtn.hasClass('content-form-selected')){
                _production_id = false;
                _prodBtn.removeClass('content-form-selected');
                _formTypeSelector.prop('selectedIndex',0);;
                _contentSel.empty();
                _formTypeSelector.show();
                _t2.show();
                _formTypeOptionsCont.empty();
              }
              else{
                _production_id = production.production_id;
                var _catProduction = Pard.Widgets.Dictionary(production.category).render();
                if (false){
                  var _form = _formTypeConstructor[profile.type](forms[profile.type][_catProduction], profile, _catProduction, _production_id, callbackSendProposal);
                  _formTypeSelector.val(_catProduction);
                  _t2.hide();
                  _form.setVal(production);
                  _form.setCallback(function(){
                    _closepopup();
                  });
                  $('.content-form-selected').removeClass('content-form-selected');
                  _prodBtn.addClass('content-form-selected');
                  _contentSel.empty();
                  _contentSel.append(_form.render());
                }
                else{
                  if (_t2) _t2.hide();
                  $('.content-form-selected').removeClass('content-form-selected');
                  _prodBtn.addClass('content-form-selected');
                  var _formTypeOptionsSelector = $('<select>');
                  var _emptyOpt = $('<option>').text('Selecciona como quieres apuntarte').val('');
                  _formTypeOptionsSelector.append(_emptyOpt);
                  for (var typeForm in forms[profile.type]){
                    if( $.inArray(production.category, forms[profile.type][typeForm].category) > -1){ 
                      _formTypeOptionsSelector.append($('<option>').text(typeForm).val(typeForm));
                    }
                  }
                  _formTypeSelector.hide();
                  _contentSel.empty()
                  _formTypeOptionsSelector.on('change', function(){
                    // $('.content-form-selected').removeClass('content-form-selected');
                    // _formTypeSelector.addClass('content-form-selected').css('font-weight','normal');
                    _printForm(_formTypeOptionsSelector, _emptyOpt, production);
                  });
                  _formTypeOptionsCont.append(_formTypeOptionsSelector);
                }
              }
            })
          }
        });
        if (_compatibleProductions) _createdWidget.append(_prodContainer);
      }

      // var _formTypeSelector = $('<select>');

      // var _emptyOption = $('<option>').text('Selecciona para apuntarte como '+Pard.Widgets.Dictionary(profile.type).render().toLowerCase());
      // var _emptyOption = $('<option>').text('Selecciona').val('');
      // _formTypeSelector.append(_emptyOption);

      _formTypeSelector.on('change',function(){
        $('.content-form-selected').removeClass('content-form-selected');
        _formTypeSelector.addClass('content-form-selected').css('font-weight','normal');
        if (_t2) _t2.show();
        _printForm(_formTypeSelector, _emptyOption);
      });

      var _printForm = function(formTypeSelector, emptyOption, production){
        _contentSel.empty();
        emptyOption.css('display', 'none');
        _production_id = false;
        var _typeFormSelected = formTypeSelector.val();
        var _form = _formTypeConstructor[profile.type](forms[profile.type][_typeFormSelected], profile, _typeFormSelected, _production_id, callbackSendProposal);
        _form.setCallback(function(){
          _closepopup();
        });
        if (production) _form.setVal(production); 
        _contentSel.append(_form.render());
        // _contentShowHide('form-from-selector');
      };

      if (profile.category){
        var _profileCategory = Pard.Widgets.Dictionary(profile.category).render();
        if ($.inArray(_profileCategory, _formTypes)>-1){
          _formTypeSelector.val(_profileCategory);
          _formTypeSelector.trigger('change');
          _formTypeSelector.attr('disabled',true);
        }
      }

      _createdWidget.append(_t2, _outerFormBox.append(_contentSel));
    }

    return{
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }

  ns.Widgets.ArtistCallForm = function(form, profile, catSelected, production_id, callbackSendProposal){

    var _createdWidget = $('<div>');
    var _formContainer = $('<form>').addClass('popup-form');

    var _initial_message_spa = $('<div>').append($('<p>').text('Sólo los organizadores tendrán acceso a los siguientes datos').addClass('m-artistCall')).addClass('message-call');
    var _initial_message_art = $('<div>').append($('<p>').html('PARTE I: Esta información se quedará en tu <strong>portfolio</strong> y se mostrará en tu perfil').addClass('m-artistCall')).addClass('message-call');
    var _message_2 = $('<div>').append($('<p>').text('PARTE II: Sólo los organizadores tendrán acceso a los siguientes datos').addClass('m-artistCall')).addClass('message-call');
    var _finalMessage =  $('<p>').html('ATENCIÓN: Una vez enviado, <strong>no te será permitido modificar</strong> el contenido de este formulario. Por lo tanto, por favor, repasa bien todos sus campos antes de pinchar el boton "Envía".').css({'margin-top':'1rem','margin-bottom':'2rem'});
    var _messageDictionary = {
      artist: _initial_message_art,
      space: _initial_message_spa
    }
    var _message_1 = _messageDictionary[profile.type]; 
    var _invalidInput = $('<div>').addClass('not-filled-text');

    _formContainer.append(_message_1);

    var _orfheoCategory;

    var _form = {};
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Envía');

    var _url = [];

    if(form['photos']){
      var _thumbnail = $('<div>');
      var _photos = Pard.Widgets.Cloudinary(form['photos'].folder, _thumbnail, _url, form['photos'].amount);
      var _photosLabel = $('<label>').text(form['photos'].label);
      var _photosContainer = $('<div>').append(_photosLabel,_photos.render(), _thumbnail).css({'margin-bottom':'-1rem'});
    }
    for(var field in form){

      if (field != 'photos' && field != 'category'){
        _form[field] = {};
        _form[field]['type'] = form[field].type;
        if(form[field]['type'] == 'mandatory') _form[field]['label'] = Pard.Widgets.InputLabel(form[field].label+' *');
        else _form[field]['label'] = Pard.Widgets.InputLabel(form[field].label);
        if (form[field]['input']=='CheckBox') {
          form[field].args[0] = form[field].label;
          if (form[field]['type'] == 'mandatory') form[field].args[0] += ' *';
        }
        _form[field]['input'] = window['Pard']['Widgets'][form[field].input].apply(this, form[field].args);
        _form[field]['helptext'] = Pard.Widgets.HelpText(form[field].helptext);
      }
    }    

    for(var field in form){
      if (field == 'photos') {
        _formContainer.append(_photosContainer);
        _formContainer.append(_message_2.css('margin-top','2rem'));
      }
      else if (field == 'category'){
        if (profile.category){
          _orfheoCategory = profile.category;
        }
        else{ 
          if (form[field].length>1){
             _formContainer.append(
             $('<div>').addClass(field + '-FormField' + ' call-form-field').append('Selecciona una categoría artistica *', Pard.Widgets.Selector(form[field],form[field]))
             )
          }
          else{
            _orfheoCategory = form[field][0]; 
          }
        }
      }
      else if (form[field].input == 'TextAreaCounter'){
        _formContainer.append(
           $('<div>').addClass(form[field].input + '-FormField' + ' call-form-field').append(
              _form[field].label.render(),_form[field].input.render()
            )
        );
      }
      else if (form[field].input == 'CheckBox'){
        var _genericField = $('<div>');
        _formContainer.append(
           _genericField.addClass(form[field].input + '-FormField' + ' call-form-field').append(_form[field].input.render()));
        if (form[field]['helptext'].length) {
          if (field == 'conditions') {
            var _helptextfield = $('<p>').append($('<a>').text('(Ver condiciones)').attr({'href':form[field]['helptext'], 'target':'_blank'})).addClass('help-text');
          }
          else {
            var _helptextfield = _form[field].helptext.render();
          }
          _helptextfield.css({'margin-top':'0'});
          _genericField.append(_helptextfield);
        };  
      }
      else{
        var _genericField = $('<div>');
        _formContainer.append(
        _genericField.addClass(form[field].input + '-FormField' + ' call-form-field').append(
          _form[field].label.render(),
          _form[field].input.render())
        )
        if (form[field]['helptext'].length) _genericField.append(_form[field].helptext.render());
        if(form[field]['input'] == 'MultipleSelector'){
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
    }

    var _filled = function(){
      var _check = true;
      for(var field in _form){
        if(_form[field].type == 'mandatory' && !(_form[field].input.getVal())){
          _form[field].input.addWarning();
          _invalidInput.text('Por favor, revisa los campos obligatorios.');
          _check = false;
        }
      } 
      return _check;
    }

    var _getVal = function(url){
      for(var field in _form){
         _submitForm[field] = _form[field].input.getVal();
      };
      _submitForm['call_id'] = Pard.CachedEvent.call_id;
      _submitForm['event_id'] = Pard.CachedEvent.event_id;
      _submitForm['profile_id'] = profile.profile_id;
      _submitForm['type'] = profile.type;
      _submitForm['category'] = _orfheoCategory;
      if (production_id) _submitForm['production_id'] = production_id; 
      if (!(form['subcategory'])) _submitForm['subcategory'] = catSelected;
      if (form['photos']) _submitForm['photos'] = url;
      return _submitForm;
    }

    var _backEndDictionary = {
      artist: Pard.Backend.sendArtistProposal,
      space: Pard.Backend.sendSpaceProposal 
    }

    var _send = function(url){
      console.log(_getVal(url)); 
      _backEndDictionary[profile.type](_getVal(url), callbackSendProposal);
    }

    var _closepopup = {};

    submitButton.on('click',function(){
      if(_filled() == true){
        _closepopup();
        if (!(_photos)) _send();
        else if(_photos.dataLength() == false) _send(_url);
        else{
          _photos.submit();
        }
      }
    });

    if(form['photos']){
      _photos.cloudinary().bind('cloudinarydone', function(e, data){
        _url.push(data['result']['public_id']);
        if(_url.length >= _photos.dataLength()) _send(_url);
      });
    }
    
    _submitBtnContainer.append(submitButton);

    _formContainer.append(_finalMessage, _invalidInput, _submitBtnContainer);
    _createdWidget.append(_formContainer)

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      },
      setVal: function(production){
        for(var field in production){
          if (_form[field] && field != 'photos') _form[field].input.setVal(production[field]);

          if(production.photos && field == 'photos' ){
            production.photos.forEach(function(photo){
              _url.push(photo);
              var _container = $('<span>');
              var _previousPhoto = $.cloudinary.image(photo,
                { format: 'jpg', width: 50, height: 50,
                  crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
              var _icon = $('<span>').addClass('material-icons').html('&#xE888').css({
                'position': 'relative',
                'bottom': '20px',
                'cursor': 'pointer'
              });

              _icon.on('click', function(){
                _url.splice(_url.indexOf(photo), 1);
                _photos.setUrl(_url);
                _container.empty();
              });

              _container.append(_previousPhoto, _icon);
              _thumbnail.append(_container);
            });
          }
        }
      }
    }
  }

  // ns.Widgets.SpaceCallForm = function(form, profile, catSelected, callbackSendProposal){
  //   var _createdWidget = $('<div>');
  //   var _formContainer = $('<form>').addClass('popup-form');

  //   // var _message_1 = $('<div>').append($('<p>').html('PARTE I: Esta información se quedará en tu <strong>portfolio</strong> y se mostrará en tu perfil').addClass('m-artistCall')).addClass('message-call');
  //   var _message_1 = $('<div>').append($('<p>').text('Sólo los organizadores tendrán acceso a los siguientes datos').addClass('m-artistCall')).addClass('message-call');
  //   var _finalMessage =  $('<p>').html('ATENCIÓN: Una vez enviado, <strong>no te será permitido modificar</strong> el contenido de este formulario. Por lo tanto, por favor, repasa bien todos sus campos antes de pinchar el boton "Envía".').css({'margin-top':'1rem','margin-bottom':'2rem'});
  //   var _invalidInput = $('<div>').addClass('not-filled-text');

  //   _formContainer.append(_message_1);

  //   var _form = {};
  //   var _submitForm = {};
  //   var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
  //   var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Crea');

  //   var _url = [];
  //   if(form['photos']){
  //       var _thumbnail = $('<div>');
  //       var _photos = Pard.Widgets.Cloudinary(form['photos'].folder, _thumbnail, _url, form['photos'].amount);
  //       var _photosLabel = $('<label>').text(form['photos'].label);
  //       var _photosContainer = $('<div>').append(_photosLabel,_photos.render(), _thumbnail).css({'margin-bottom':'-1rem'});
  //   }
  //   for(var field in form){
  //     console.log(field);
  //     if (field != 'photos' && field != 'category'){
  //       _form[field] = {};
  //       _form[field]['type'] = form[field].type;
  //       if(form[field]['type'] == 'mandatory') form[field]['label'] = form[field]['label']+' *';
  //       if (form[field]['input']=='CheckBox') form[field].args[0] = form[field].label;
  //       _form[field]['label'] = Pard.Widgets.InputLabel(form[field].label);
  //       _form[field]['input'] = window['Pard']['Widgets'][form[field].input].apply(this, form[field].args);
  //       _form[field]['helptext'] = Pard.Widgets.HelpText(form[field].helptext);
  //     }
  //   }    

  //   for(var field in form){
  //     if (field == 'photos') {
  //       _formContainer.append(_photosContainer);
  //       _formContainer.append(_message_2.css('margin-top','2rem'));
  //     }
  //     else if (form[field].input == 'TextAreaCounter'){
  //       _formContainer.append(
  //          $('<div>').addClass(form[field].input + '-FormField' + ' call-form-field').append(
  //             _form[field].label.render(),_form[field].input.render()
  //           )
  //       );
  //     }
  //     else if (form[field].input == 'CheckBox'){
  //       var _genericField = $('<div>');
  //       _formContainer.append(
  //          _genericField.addClass(form[field].input + '-FormField' + ' call-form-field').append(_form[field].input.render()));
  //         if (form[field]['helptext'].length) {
  //           if (field == 'conditions') {
  //             var _helptextfield = $('<p>').append($('<a>').text('(Ver condiciones)').attr({'href':form[field]['helptext'], 'target':'_blank'})).addClass('help-text');
  //           }
  //           else {
  //             var _helptextfield = _form[field].helptext.render();
  //           }
  //           _helptextfield.css({'margin-top':'0'});
  //           _genericField.append(_helptextfield);
  //         };  
  //     }
  //     else{
  //       var _genericField = $('<div>');
  //       _formContainer.append(
  //       _genericField.addClass(form[field].input + '-FormField' + ' call-form-field').append(
  //         _form[field].label.render(),
  //         _form[field].input.render())
  //       )
  //       if (form[field]['helptext'].length) _genericField.append(_form[field].helptext.render());
  //       if(form[field]['input'] == 'MultipleSelector'){
  //         if (field == 'availability'){
  //           _form[field].input.render().multipleSelect({      placeholder: "Selecciona una o más opciones",
  //             selectAllText: "Selecciona todo",
  //             countSelected: false,
  //             allSelected: "Disponible todos los días"
  //           });
  //         }
  //         else{
  //           _form[field].input.render().multipleSelect({      placeholder: "Selecciona una o más opciones",
  //             selectAll: false,
  //             countSelected: false,
  //             allSelected: false
  //           });
  //         }
  //         _form[field].helptext.render().css('margin-top', 5);
  //       }
  //     }
  //   }

  //   var _filled = function(){
  //     var _check = true;
  //     for(var field in _form){
  //       if(_form[field].type == 'mandatory' && !(_form[field].input.getVal())){
  //         _form[field].input.addWarning();
  //         _invalidInput.text('Por favor, revisa los campos obligatorios.');
  //         _check = false;
  //       }
  //     } 
  //     return _check;
  //   }

  //   var _getVal = function(url){
  //     for(var field in _form){
  //        _submitForm[field] = _form[field].input.getVal();
  //     };
  //     _submitForm['call_id'] = Pard.CachedEvent.call_id;
  //     _submitForm['event_id'] = Pard.CachedEvent.event_id;
  //     _submitForm['profile_id'] = profile.profile_id;
  //     _submitForm['type'] = profile.type;
  //     _submitForm['category'] = catSelected;     
  //     if (form['_photos']) _submitForm['photos'] = url;
  //     return _submitForm;
  //   }

  //   var _send = function(url){
  //     Pard.Backend.sendSpaceProposal(_getVal(url), callbackSendProposal);
  //   }

  //   var _closepopup = {};

  //   submitButton.on('click',function(){
  //     if(_filled() == true){
  //       _closepopup();
  //       if(!_photos || _photos.dataLength() == false){console.log('hep');_send(_url);}
  //       else{
  //         _photos.submit();
  //       }
  //     }
  //   });

  //   if(form['photos']){
  //     _photos.cloudinary().bind('cloudinarydone', function(e, data){
  //       _url.push(data['result']['public_id']);
  //       if(_url.length >= _photos.dataLength()) _send(_url);
  //     });
  //   }

  //   _submitBtnContainer.append(submitButton);

  //   _formContainer.append(_finalMessage, _invalidInput, _submitBtnContainer);
  //   _createdWidget.append(_formContainer)

  //   return {
  //     render: function(){
  //       return _createdWidget;
  //     },
  //     setCallback: function(callback){
  //       _closepopup = callback;
  //     }
  //   }

  // }


}(Pard || {}));
