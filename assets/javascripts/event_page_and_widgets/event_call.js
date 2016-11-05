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
          Pard.Widgets.GetCallForms(event_info, profile, _callbackSendProposal);
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
        Pard.Widgets.GetCallForms(event_info, _profile, _callbackSendProposal); 
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
    var _createProfileCard = Pard.Widgets.CreateProfileCard(_createAndInscribeProfile);

    _createdWidget.append(_secondTitle, _createProfileCard.render().addClass('card-container-popup position-profileCard-login'));

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closeListProfilePopup = callback;
      }
    } 
  }



  ns.Widgets.GetCallForms = function(eventInfo, profile, callbackSendProposal){
    console.log(profile);
    Pard.Backend.getCallForms(eventInfo.call_id, function(data){
      console.log(data);
    var _content = $('<div>').addClass('very-fast reveal full');
    _content.empty();
    $('body').append(_content);
    console.log(data);
    var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
    var _message = Pard.Widgets.PopupContent(eventInfo.name, Pard.Widgets.FormManager(data.forms, profile, callbackSendProposal));
    _message.setCallback(function(){
      _content.remove();
      _popup.close();
    });
    _content.append(_message.render());
    _popup.open();
    });
  };


  ns.Widgets.FormManager = function(forms, profile, callbackSendProposal){

    var _formTypeConstructor = {
      artist: Pard.Widgets.ArtistCallForm,
      space: Pard.Widgets.SpaceCallForm
    };

    // var _contentShowHide = function(id_selected){
    //   $('.content-form-selected').removeClass('content-form-selected');
    //   _contentShown.hide();
    //   // var _selected = '#'+id_selected;
    //   _contentShown = $('#'+id_selected);
    //   _contentShown.show();
    // }

    var _contentSel = $('<div>').attr('id','form-from-selector');
    // var _contentShown = _contentSel;


    var _createdWidget = $('<div>');

    if(profile.productions && profile.productions.length){
      var _prodContainer = $('<div>').addClass('prodContainer-event-page');
      profile.productions.forEach(function(production){
        var _prodBtn = $('<div>').addClass('production-nav-element-container production-btn-event-page');
        var _iconColumn = $('<div>').addClass(' icon-column').append($('<div>').addClass('nav-icon-production-container').append($('<div>').addClass('production-icon-container').append(Pard.Widgets.IconManager(production['category']).render().css({'text-align': 'center', display:'block'}))));
        _iconColumn.css({
          'padding':'0.2rem'
        })
        var _nameColumn = $('<div>').addClass('name-column name-column-production-nav').css({'height':'2rem'});
        var _name = $('<p>').text(production['title']).addClass('profile-nav-production-name');
        _prodBtn.append(_iconColumn, _nameColumn.append(Pard.Widgets.FitInBox(_name,125,45).render()));
        _prodContainer.append(_prodBtn);
        _prodBtn.click(function(){
          if (_prodBtn.hasClass('content-form-selected')){
            _prodBtn.removeClass('content-form-selected');
            _categorySelector.prop('selectedIndex',0);;
            _contentSel.empty();
          }
          else{
            var _catProduction = production.category;
            var _form = _formTypeConstructor[profile.type](forms[profile.type][_catProduction], profile, _catProduction, callbackSendProposal);
            _categorySelector.val(_catProduction);
            _form.setVal(production);
            _form.setCallback(function(){
              _closepopup();
            });
            _prodBtn.addClass('content-form-selected');
            // var _content = $('<div>').attr('id','form-'+production.production_id);
            // _createdWidget.append(_content.append(_form.render()));
            // _contentShowHide('form-'+production.production_id);
            _contentSel.empty();
            _contentSel.append(_form.render());
          }
        })
      });
      _createdWidget.append(_prodContainer);
    }


    var _categorySelector = $('<select>');

    var _emptyOption = $('<option>').text('Selecciona una categoría');
    _categorySelector.append(_emptyOption);

    for(var field in forms[profile.type]){
      _categorySelector.append($('<option>').text(Pard.Widgets.Dictionary(field).render()).val(field))
    }

    var _closepopup = {};

    _categorySelector.on('change',function(){
      $('.content-form-selected').removeClass('content-form-selected');
      _contentSel.empty();
      _emptyOption.css('display', 'none');
      var _catSelected = _categorySelector.val();
      var _form = _formTypeConstructor[profile.type](forms[profile.type][_catSelected], profile, _catSelected, callbackSendProposal);
      _form.setCallback(function(){
        _closepopup();
      })
      _contentSel.append(_form.render());
      // _contentShowHide('form-from-selector');
    });

    _createdWidget.append(_categorySelector, _contentSel);

    return{
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }

  ns.Widgets.ArtistCallForm = function(form, profile, catSelected, callbackSendProposal){

    var _createdWidget = $('<div>');
    var _formContainer = $('<form>').addClass('popup-form');

    var _message_1 = $('<div>').append($('<p>').html('PARTE I: Esta información se quedará en tu <strong>portfolio</strong> y se mostrará en tu perfil').addClass('m-artistCall')).addClass('message-call');
    var _message_2 = $('<div>').append($('<p>').text('PARTE II: Sólo los organizadores tendrán acceso a los siguientes datos').addClass('m-artistCall')).addClass('message-call');
    var _finalMessage =  $('<p>').html('ATENCIÓN: Una vez enviado, <strong>no te será permitido modificar</strong> el contenido de este formulario. Por lo tanto, por favor, repasa bien todos sus campos antes de pinchar el boton "Envía".').css({'margin-top':'1rem','margin-bottom':'2rem'});
    var _invalidInput = $('<div>').addClass('not-filled-text');

    _formContainer.append(_message_1);

    var _form = {};
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Crea');

    var _url = [];

    if(form['photos']){
      var _thumbnail = $('<div>');
      var _photos = Pard.Widgets.Cloudinary(form['photos'].folder, _thumbnail, _url, form['photos'].amount);
      var _photosLabel = $('<label>').text(form['photos'].label);
      var _photosContainer = $('<div>').append(_photosLabel,_photos.render(), _thumbnail).css({'margin-bottom':'-1rem'});
    }
    for(var field in form){
      if (field != 'photos'){
        _form[field] = {};
        _form[field]['type'] = form[field].type;
        if(form[field]['type'] == 'mandatory')  _form[field]['label'] = Pard.Widgets.InputLabel(form[field].label+' *');
        else _form[field]['label'] = Pard.Widgets.InputLabel(form[field].label);
        if (form[field]['input']=='CheckBox') form[field].args[0] = form[field].label;
        _form[field]['input'] = window['Pard']['Widgets'][form[field].input].apply(this, form[field].args);
        _form[field]['helptext'] = Pard.Widgets.HelpText(form[field].helptext);
      }
    }    

    for(var field in form){
      if (field == 'photos') {
        _formContainer.append(_photosContainer);
        _formContainer.append(_message_2.css('margin-top','2rem'));
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
      _submitForm['category'] = catSelected;
    
      if (form['photos']) _submitForm['photos'] = url;
      return _submitForm;
    }

    var _send = function(url){
      Pard.Backend.sendArtistProposal(_getVal(url), callbackSendProposal);
    }

    var _closepopup = {};

    submitButton.on('click',function(){
      if(_filled() == true){
        _closepopup();
        if(_photos.dataLength() == false) _send(_url);
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

  ns.Widgets.SpaceCallForm = function(form, profile, catSelected, callbackSendProposal){
    var _createdWidget = $('<div>');
    var _formContainer = $('<form>').addClass('popup-form');

    // var _message_1 = $('<div>').append($('<p>').html('PARTE I: Esta información se quedará en tu <strong>portfolio</strong> y se mostrará en tu perfil').addClass('m-artistCall')).addClass('message-call');
    var _message_1 = $('<div>').append($('<p>').text('Sólo los organizadores tendrán acceso a los siguientes datos').addClass('m-artistCall')).addClass('message-call');
    var _finalMessage =  $('<p>').html('ATENCIÓN: Una vez enviado, <strong>no te será permitido modificar</strong> el contenido de este formulario. Por lo tanto, por favor, repasa bien todos sus campos antes de pinchar el boton "Envía".').css({'margin-top':'1rem','margin-bottom':'2rem'});
    var _invalidInput = $('<div>').addClass('not-filled-text');

    _formContainer.append(_message_1);

    var _form = {};
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Crea');

    var _url = [];
    if(form['photos']){
        var _thumbnail = $('<div>');
        var _photos = Pard.Widgets.Cloudinary(form['photos'].folder, _thumbnail, _url, form['photos'].amount);
        var _photosLabel = $('<label>').text(form['photos'].label);
        var _photosContainer = $('<div>').append(_photosLabel,_photos.render(), _thumbnail).css({'margin-bottom':'-1rem'});
    }
    for(var field in form){
      if (field != 'photos'){
        _form[field] = {};
        _form[field]['type'] = form[field].type;
        if(form[field]['type'] == 'mandatory') form[field]['label'] = form[field]['label']+' *';
        if (form[field]['input']=='CheckBox') form[field].args[0] = form[field].label;
        _form[field]['label'] = Pard.Widgets.InputLabel(form[field].label);
        _form[field]['input'] = window['Pard']['Widgets'][form[field].input].apply(this, form[field].args);
        _form[field]['helptext'] = Pard.Widgets.HelpText(form[field].helptext);
      }
    }    

    for(var field in form){
      if (field == 'photos') {
        _formContainer.append(_photosContainer);
        _formContainer.append(_message_2.css('margin-top','2rem'));
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
      _submitForm['category'] = catSelected;     
      if (form['_photos']) _submitForm['photos'] = url;
      return _submitForm;
    }

    var _send = function(url){
      Pard.Backend.sendSpaceProposal(_getVal(url), callbackSendProposal);
    }

    var _closepopup = {};

    submitButton.on('click',function(){
      if(_filled() == true){
        _closepopup();
        if(!_photos || _photos.dataLength() == false){console.log('hep');_send(_url);}
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
      }
    }

  }


}(Pard || {}));
