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
    console.log(profile);

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

    if(profile.calls && profile.calls.length){ 
      
      var _eventBoxContainer = Pard.Widgets.SectionBoxContainer('Eventos', Pard.Widgets.IconManager('proposals').render()).render();
      var _eventBoxContent = $('<div>').addClass('box-content');
      var _event = {
        name: 'Benimaclet conFusión festival III ed.',
        baseline: 'Festival libre de expresión gratuita',
        eventTime: profile.calls[0].eventTime,
        main_img: 'conFusion_cartel_1-compressor_aiyrxc',
        event_id: profile.calls[0].event_id
      }
      var _eventCard = Pard.Widgets.EventInfoCard(_event);
      _eventBoxContainer.append(_eventBoxContent.append(_eventCard.render()));

      // _createdWidget.append(_eventBoxContainer);

      
      //-------------------------------------------------------------------
      // var _searchEngine = Pard.Widgets.SearchEngine('main-profile-page', profile.calls[0].event_id);
      // var _callProposalsTitle = $('<div>').append($('<h5>').text('Descubre los participantes')).addClass('call-proposals-title');
      // _callsBoxContent.append(_callProposalsTitle, _searchEngine.render());
      //--------------------------------------------------------------
    }


    var _callsBoxContainer = Pard.Widgets.SectionBoxContainer('Convocatoria 2016', Pard.Widgets.IconManager('open_call').render()).render();
    var _callsBoxContent = $('<div>').addClass('box-content');

      if(profile.calls) profile.calls.forEach(function(call){
        var _callsInfoTitle = $('<p>').text('Convocatoria cerrada.').css('font-weight','bold');
        var _callsInfoText = $('<p>').html('Pronto la programación interactiva.');
      var _callsInfo = $('<div>').append(_callsInfoTitle, _callsInfoText);
       _callsBoxContent.append(_callsInfo);


      if (profile.calls && profile.calls[0] && profile.calls[0].whitelist == true){
        var _button = $('<button>').html('Envía una propuesta').addClass('signUp-button-welcome-section');
        var _listProfile = function(data){
          if(data['status'] == 'success'){
            var _caller = $('<button>');
            var _popup = Pard.Widgets.PopupCreator(_caller,'Inscribe un perfil ya creado', function(){return Pard.Widgets.ChooseProfileMessage(data.profiles, call.call_id, _button)});
            _caller.trigger('click');
          }
          else{
            Pard.Widgets.Alert('Problema en el servidor', _dataReason).render();
          }
        }
        _button.click(function(){
          Pard.Backend.listProfiles(_listProfile);
        })
        // _eventBoxContent.append($('<p>').append(_button).addClass('callToActionBtn-container-eventCard'));
        _callsInfo.append(_button);
        _callsInfoTitle.removeAttr('style');
        _callsInfoText.empty();
        _callsInfoText.html('<strong> Sin embargo, la organización te ha habilitado para que puedas enviar propuestas fuera de tiempo.</strong>');
      }
    });

    _createdWidget.append(_callsBoxContainer.append(_callsBoxContent));

    if (userStatus == 'owner'){
      var _modifyProfile = Pard.Widgets.ModifySectionContent(Pard.Widgets.ModifyProfile(profile).render(), profile['color']);
      _createdWidget.append(_modifyProfile.render());
      if(profile.calls) profile.calls.forEach(function(call){
        var _manageCallBtn =  $('<button>').addClass('manage-call-btn').click(function(){location.href = '/call?id='+ call.call_id}).text('Gestiona convocatoria').attr('type','button');        
        // _eventBoxContent.append( $('<p>').append(_manageCallBtn).addClass('callToActionBtn-container-eventCard'));
        _callsBoxContainer.append( $('<p>').append(_manageCallBtn).addClass('callToActionBtn-container-eventCard'));
      });
    }


    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.EventInfoCard = function(event){
    var _createdWidget = $('<div>');
    var _image = $('<div>').addClass('card-container-news eventImage-event-info-card');
    var _logo = $('<a>').append($.cloudinary.image(event.main_img,{ format: 'png', width: 175, height: 228, crop: 'fill', effect: 'saturation:50' })).attr('href','#');
    _image.append(_logo);
    
    var _popupImg = $.cloudinary.image(event.main_img,{ format: 'jpg',  width: 750, effect: 'saturation:50' });

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
    var _infoTitle = $('<div>').append($('<h4>').append($('<a>').text(event.name).attr('href','/event?id=a5bc4203-9379-4de0-856a-55e1e5f3fac6')).addClass('eventName-event-card'));
    var _baseline = $('<div>').append($('<p>').text(event.baseline)).addClass('baseline-event-info-card');
    var _eventdays = '';
    var _dayArray = [];
    for (var key in event.eventTime) {
      if (key != 'permanent') _dayArray.push(event.eventTime[key]);
    };
    if (_dayArray.length == 1){
      _eventdays = moment(new Date(parseInt(_dayArray[0]))).locale('es').format('dddd DD MMMM YYYY');
    }
    else if (_dayArray.length > 1) {
      _eventdays = $('<span>').text(moment(new Date(parseInt(_dayArray[0]))).locale('es').format('DD')+'-'+moment(new Date(parseInt(_dayArray[_dayArray.length-1]))).locale('es').format('DD')+' '+moment(new Date(parseInt(_dayArray[_dayArray.length-1]))).locale('es').format('MMMM YYYY'));
    }

    var _days =  $('<div>').append($('<p>').append(_eventdays).addClass('eventDay-event-info-card'),$('<p>').append('de 11:00 a 14:00 y de 17:00 a 24:00h')).addClass('eventDate-event-info-card');

    var _status = $('<div>').css('margin-bottom','0');
    var _toEventPageBtn = $('<a>').text('¡Programación online!').attr('href','/event?id=a5bc4203-9379-4de0-856a-55e1e5f3fac6').addClass('toEventPageBtn-event-info-card');
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
