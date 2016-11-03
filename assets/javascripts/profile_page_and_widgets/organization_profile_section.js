'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};
 
  ns.Widgets.OrganizationSection = function(sectionHeader, profile_id) {

    profile_id = profile_id || Pard.CachedProfiles[0].profile_id;
    var profile = Pard.ProfileManager.getProfile(profile_id);
    var userStatus = Pard.UserStatus['status'];
  
    Pard.Widgets.ProfileSectionHeader(sectionHeader, profile);

    var _rgb = Pard.Widgets.IconColor(profile['color']).rgb();
    var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
    $('#main-profile-page').css({'background': _backColor});
  }

  ns.Widgets.OrganizationSectionContent = function(profile){

    var _createdWidget = $('<div>');
    var userStatus = Pard.UserStatus['status'];

    var _infoBoxContainer = Pard.Widgets.SectionBoxContainer('Información', Pard.Widgets.IconManager('information').render().addClass('info-icon-title-box')).render();
    var _infoContentBox = $('<div>').addClass('box-content');
    
    
    var _contact = $('<div>').addClass('information-contact');
    var _bio = $('<div>').addClass('information-bio');  
    if(profile['bio']){     
      _bio.append($('<p>').text(profile['bio']));
    }
    else{
      _bio.append('');
    }

    var _type = $('<p>').addClass('information-contact-text-column type-text-info-box').append($('<span>').text(Pard.Widgets.Dictionary('festival').render()));
    var _typeIcon = Pard.Widgets.IconManager(profile['type']).render().addClass('information-contact-icon-column type-icon-info-box');

    _contact.append($('<div>').append(_typeIcon, _type));

    var _city = $('<div>').append(Pard.Widgets.IconManager('city_artist').render().addClass('information-contact-icon-column'), $('<p>').addClass('information-contact-text-column').append($('<a>').attr({
      href: 'http://maps.google.com/maps?q='+profile['city']+' '+profile['zip_code'],
      target: '_blank'
      }).text(profile['city'])));

    _contact.append(_city);

    if(profile.personal_web){
      _contact.append(Pard.Widgets.PrintWebsList(profile['personal_web']).render());
    };

    $('body').append(_contact);
    _infoContentBox.css('min-height',_contact.height()+24)
    _infoContentBox.append(_bio.prepend(_contact));
    _infoBoxContainer.append(_infoContentBox);
    _createdWidget.append(_infoBoxContainer);
    if(profile.events && profile.events.length){ 
      var _eventBoxContainer = Pard.Widgets.SectionBoxContainer('Eventos', Pard.Widgets.IconManager('proposals').render()).render();
      var _eventBoxContent = $('<div>').addClass('box-content');
      var _event = profile.events[0];
      _event.organizer = profile.name;

      var _eventCard = Pard.Widgets.EventInfoCard(_event);
      _eventBoxContainer.append(_eventBoxContent.append(_eventCard.render()));
      _createdWidget.append(_eventBoxContainer);
      
      //-------------------------------------------------------------------
      // var _searchEngine = Pard.Widgets.SearchEngine('main-profile-page', profile.calls[0].event_id);
      // var _callProposalsTitle = $('<div>').append($('<h5>').text('Descubre los participantes')).addClass('call-proposals-title');
      // _callsBoxContent.append(_callProposalsTitle, _searchEngine.render());
      //--------------------------------------------------------------
    }


    var _callsBoxContainer = Pard.Widgets.SectionBoxContainer('Convocatoria 2016', Pard.Widgets.IconManager('open_call').render()).render();
    var _callsBoxContent = $('<div>').addClass('box-content');

    if(profile.events) profile.events.forEach(function(_event){
      var _callsInfoTitle = $('<p>').text('Convocatoria cerrada.').css('font-weight','bold');
      var _callsInfoText = $('<p>').html('Pronto la programación interactiva.');
      var _callsInfo = $('<div>').append(_callsInfoTitle, _callsInfoText);
      _callsBoxContent.append(_callsInfo);


      if (profile.events && profile.events[0]){
        var _button = $('<button>').html('Envía una propuesta').addClass('signUp-button-welcome-section');
        var _listProfile = function(data){
          if(data['status'] == 'success'){
            var _caller = $('<button>');
            var _popup = Pard.Widgets.PopupCreator(_caller,'Inscribe un perfil ya creado', function(){return Pard.Widgets.ChooseProfileMessage(data.profiles, profile.events[0].event_id, _button)});
            _caller.trigger('click');
          }
          else{
            Pard.Widgets.Alert('Problema en el servidor', _dataReason).render();
          }
        }
        _button.click(function(){
          Pard.Backend.getCallForms(profile.events[0].call_id, function(data){
          var _content = $('<div>').addClass('very-fast reveal full');
          _content.empty();
          $('body').append(_content);
          console.log(data);
          var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
          var _message = Pard.Widgets.PopupContent(profile.events[0].name, Pard.Widgets.FormManager(data.forms.artist));
          _message.setCallback(function(){
            _content.remove();
            _popup.close();
          });
          _content.append(_message.render());
          _popup.open();
          });
          //Pard.Backend.listProfiles(_listProfile);
        });

        
        _eventBoxContent.append($('<p>').append(_button).addClass('callToActionBtn-container-eventCard'));
        // _callsInfo.append(_button);
        // _callsInfoTitle.removeAttr('style');
        // _callsInfoText.empty();
        // _callsInfoText.html('<strong> Sin embargo, la organización te ha habilitado para que puedas enviar propuestas fuera de tiempo.</strong>');
      }
    });

    // _createdWidget.append(_callsBoxContainer.append(_callsBoxContent));

    if (userStatus == 'owner'){
      var _modifyProfile = Pard.Widgets.ModifySectionContent(Pard.Widgets.ModifyProfile(profile).render(), profile['color']);
      _createdWidget.append(_modifyProfile.render());
      if(profile.events) profile.events.forEach(function(_event){
        var _manageCallBtn =  $('<button>').addClass('manage-call-btn').click(function(){location.href = '/event_manager?id='+ _event.event_id}).text('Gestiona convocatoria').attr('type','button');        
        _eventBoxContent.append( $('<p>').append(_manageCallBtn).addClass('callToActionBtn-container-eventCard'));
        // _callsBoxContainer.append( $('<p>').append(_manageCallBtn).addClass('callToActionBtn-container-eventCard'));
      });
    }


    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.FormManager = function(forms){
    var _createdWidget = $('<div>');
    var _categorySelector = $('<select>');
    var _content = $('<div>');

    var _emptyOption = $('<option>').text('Selecciona una categoría');
    _categorySelector.append(_emptyOption);

    for(var field in forms){
      _categorySelector.append($('<option>').text(Pard.Widgets.Dictionary(field).render()).val(field))
    }

    _categorySelector.on('change',function(){
      _content.empty();
      _emptyOption.css('display', 'none');
      _content.append(Pard.Widgets.ArtistCallForm(forms[_categorySelector.val()]).render());
    });

    _createdWidget.append(_categorySelector, _content);

    return{
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        console.log('miau');
      }
    }
  }

  ns.Widgets.ArtistCallForm = function(form){

    var _createdWidget = $('<div>');
    var _formContainer = $('<form>').addClass('popup-form');
    var _message = $('<div>').text('Esta información se mostrará en la página de perfil y podrás modificarla en todo momento sin afectar a tu participación en convocatorias.').addClass('message-form');
    var _invalidInput = $('<div>').addClass('not-filled-text');

    var _form = {};
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Crea');

    var _url = [];
    var _thumbnail = $('<div>');
    var _photos = Pard.Widgets.Cloudinary(form['photos'].folder, _thumbnail, _url, form['photos'].amount);
    var _photosLabel = $('<label>').text(form['photos'].label);
    var _photosContainer = $('<div>').append(_photosLabel,_photos.render(), _thumbnail).css({'margin-bottom':'-1rem'});

    for(var field in form){
      if (field != 'photos'){
        _form[field] = {};
        _form[field]['type'] = form[field].type;
        _form[field]['label'] = Pard.Widgets.InputLabel(form[field].label);
        _form[field]['input'] = window['Pard']['Widgets'][form[field].input].apply(this, form[field].args);
        _form[field]['helptext'] = Pard.Widgets.HelpText(form[field].helptext);
      }
    }    

    for(var field in form){
      if (field == 'photos') _formContainer.append(_photosContainer);
      else if (form[field].input == 'TextAreaCounter'){
        _formContainer.append(
           $('<div>').addClass(form[field].input + '-FormField' + ' call-form-field').append(
              _form[field].label.render(),_form[field].input.render()
            )
        );
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
          _form[field].input.render().multipleSelect();
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
      _submitForm['type'] = 'space';     
      _submitForm['photos'] = url;
      return _submitForm;
    }

    var _send = function(url){
      Pard.Backend.createProfile(_getVal(url), Pard.Events.CreateProfile);
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

    _photos.cloudinary().bind('cloudinarydone', function(e, data){
      _url.push(data['result']['public_id']);
      if(_url.length >= _photos.dataLength()) _send(_url);
    });

    _submitBtnContainer.append(submitButton);

    _formContainer.append(_invalidInput, _submitBtnContainer);
    _createdWidget.append(_message, _formContainer)

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }

  ns.Widgets.CallMessageArtist = function(profile, call_id, callbackSendProposal){
    var _createdWidget = $('<div>');
    var _message = $('<div>').html(
      '<h4 style="font-weight:600; margin: -1rem 0 1rem 0;">conFusión 2016</h4> Este formulario es para enviar tu propuesta al Benimaclet conFusión festival 2016. Tiene dos partes: '
      ).addClass('message-form');

    // la primera recoge los datos que definen tu producción artística, la segunda pide informaciones especificas en relación al festival.

    var _t1 =  $('<h4>').text('I. Tu Arte').addClass('t-artistCall');
    var _t2 =  $('<h4>').text('II. Información particular').addClass('t-artistCall');
    var _m1 = $('<span>').html('Esta información se quedará en tu <strong>portfolio</strong> y se mostrará en tu perfil.').addClass('m-artistCall');
    var _m2 = $('<span>').text('Sólo los organizadores del festival tendrán acceso a estos datos.').addClass('m-artistCall');

    var _part1 = $('<div>').addClass('title-part').append(_t1, _m1);
    var _part2 = $('<div>').addClass('title-part').append($('<span>').append(_t2, _m2));

    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Envía');
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
    var _photos = Pard.Widgets.Cloudinary(_folder, _thumbnail, _url, 4);

    var _photosLabel = $('<label>').text('Fotos de tu arte (máximo 4, tamaño inferior a 500kb)').css({
      'padding-top': '0.5rem'
    });
    var _photosContainer = $('<div>').append(_photosLabel,_photos.render(), _thumbnail).css('margin-bottom','1rem');

    // _submitForm['call_id'] = 'b5bc4203-9379-4de0-856a-55e1e5f3fac6';
    _submitForm['call_id'] = call_id;
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
      var _field = $('<div>').addClass(field+'-ArtistCall'); 
      _field.addClass('field-ArtistCall');
      var _label = _form[field]['label'].render().append(_form[field]['input'].render());
      var _helpText = _form[field]['helptext'].render();
      _field.append(_label, _helpText);
      _fieldsetProductionContent.append(_field);

    });

    _specificCallFields.forEach(function(field){
      var _field = $('<div>').addClass(field+'-ArtistCall'); 
      _field.addClass('field-ArtistCall');
      _fieldsetSpecificCall.append(_field.append(_form[field]['label'].render().append(_form[field]['input'].render()),_form[field]['helptext'].render()));
    });

    _fieldsetProduction.append(_fieldsetProductionContent, _photosContainer);

    _content.append(_fieldsetProduction, _part2, _fieldsetSpecificCall);

    var _labelsCategories = ['Música', 'Artes Escénicas', 'Exposición', 'Poesía',  'Audiovisual', 'Street Art', 'Taller', 'Otros'];
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
      _submitForm['category'] = _selected;
      _createdWidget.append(_category, _content.append(_invalidInput), _submitBtnContainer.append(submitButton));
    };

    var _category = Pard.Widgets.Selector(_labelsCategories, _valuesCategories, categorySelectCallback);

    _category.setClass('category-input');

    var _categoryLabel = $('<label>').text('Selecciona una categoría *')

    var _beCarefullText = $('<p>').text('ATENCIÓN: Una vez enviado, no te será permitido modificar el contenido de este formulario. Por lo tanto, por favor, repasa bien todos sus campos antes de pinchar el boton "Envía".').css({'margin-top':'1rem','margin-bottom':'2rem'});

    _createdWidget.append(_message, _part1,  _categoryLabel.append(_category.render()), _content.append( _beCarefullText),
     _submitBtnContainer.append(submitButton));

    var _filled = function(){
      var _check = _form['conditions'].input.getVal();
      for(var field in _form){
        if ($.inArray(field, _requiredFields) >= 0 ){
          if(!(_form[field].input.getVal())) {
            if (field != 'links' && field != 'personal_web') _form[field].input.addWarning();
            _content.append(_invalidInput),
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
      if (callbackSendProposal) Pard.Backend.sendProposal(_getVal(url), callbackSendProposal);
      else Pard.Backend.sendProposal(_getVal(url), Pard.Events.SendProposal);
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

    _photos.cloudinary().bind('cloudinarydone', function(e, data){
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


  ns.Widgets.EventInfoCard = function(the_event){
    var _createdWidget = $('<div>');
    var _image = $('<div>').addClass('card-container-news eventImage-event-info-card');
    var _logo = $('<a>').append($.cloudinary.image(the_event.img,{ format: 'png', width: 175, height: 228, crop: 'fill', effect: 'saturation:50' })).attr('href','#');
    _image.append(_logo);
    var _popupImg = $.cloudinary.image(the_event.img,{ format: 'jpg',  width: 750, effect: 'saturation:50' });

    var _popupContainer = $('<div>').addClass('fast reveal full');    
    var _outerContainer = $('<div>').addClass('vcenter-outer');
    var _innerContainer = $('<div>').addClass('vcenter-inner');
    var _closeBtn = $('<button>').addClass('close-button small-1 popup-close-btn').attr({type: 'button'});
    _closeBtn.append($('<span>').html('&times;'));
    var _popup = new Foundation.Reveal(_popupContainer, {animationIn: 'fade-in', animationOut: 'fade-out'});
    _closeBtn.click(function(){
      _popup.close();
    });

    var _popupContent = $('<div>').addClass('popup-photo-container').append(_popupImg,_closeBtn);
    _innerContainer.append(_popupContent);
    _popupContainer.append(_outerContainer.append(_innerContainer));

    _logo.one('mouseover', function(){
      $('body').append(_popupContainer)
    });

    _logo.click(function(){
      _popup.open();
    });


    var _infoBox = $('<div>').addClass('info-box-news-welcome-page');
    var _infoTitle = $('<div>').append($('<h4>').append($('<a>').text(the_event.name).attr('href','/event?id='+ the_event.event_id)).addClass('eventName-event-card'));
    var _baseline = $('<div>').append($('<p>').text(the_event.baseline)).addClass('baseline-event-info-card');
    var _eventdays = '';
    var _dayArray = [];
    for (var key in the_event.eventTime) {
      if (key != 'permanent') _dayArray.push(the_event.eventTime[key]);
    };
    if (_dayArray.length == 1){
      _eventdays = moment(new Date(parseInt(_dayArray[0]))).locale('es').format('dddd DD MMMM YYYY');
    }
    else if (_dayArray.length > 1) {
      _eventdays = $('<span>').text(moment(new Date(parseInt(_dayArray[0]))).locale('es').format('DD')+'-'+moment(new Date(parseInt(_dayArray[_dayArray.length-1]))).locale('es').format('DD')+' '+moment(new Date(parseInt(_dayArray[_dayArray.length-1]))).locale('es').format('MMMM YYYY'));
    }

    var _days =  $('<div>').append($('<p>').append(_eventdays).addClass('eventDay-event-info-card'),$('<p>').append('de 11:00 a 14:00 y de 17:00 a 24:00h')).addClass('eventDate-event-info-card');
    var _status = $('<div>').css('margin-bottom','0');
    var _toEventPageBtn = $('<a>').text('¡Programación online!').attr('href','/event?id=' + the_event.event_id).addClass('toEventPageBtn-event-info-card');
    _status.append(_toEventPageBtn);
    _infoBox.append(_infoTitle, _baseline, _days, _status);
    _createdWidget.append(_image, _infoBox);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ChooseProfileMessage = function(profiles, call_id, _button){
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
          var _caller =  Pard.Widgets.ProposalForm(profile.type).render();
          _caller(profile,'',call_id, _callbackSendProposal).render().trigger('click');
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
        var _caller =  Pard.Widgets.ProposalForm(_profile.type).render();
        _caller(_profile,'',call_id, _callbackSendProposal).render().trigger('click');
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



}(Pard || {}));
