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

    var _address = $('<div>').append(Pard.Widgets.IconManager('city_artist').render().addClass('information-contact-icon-column'), $('<p>').addClass('information-contact-text-column').append($('<a>').attr({
      href: 'http://maps.google.com/maps?q='+profile['address']['locality']+' '+profile['address']['postal_code'],
      target: '_blank'
      }).text(profile['address']['locality'])));

    _contact.append(_address);

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

      var _eventCard = Pard.Widgets.EventInfoCardDistrito(_event);
      _eventBoxContainer.append(_eventBoxContent.append(_eventCard.render()));
      _createdWidget.append(_eventBoxContainer);
    }


    var _callsBoxContainer = Pard.Widgets.SectionBoxContainer('Convocatoria 2016', Pard.Widgets.IconManager('open_call').render()).render();
    var _callsBoxContent = $('<div>').addClass('box-content');

    if(profile.events) profile.events.forEach(function(_event){
      var _callsInfoTitle = $('<p>').text('Convocatoria cerrada.').css('font-weight','bold');
      var _callsInfoText = $('<p>').html('Pronto la programación interactiva.');
      var _callsInfo = $('<div>').append(_callsInfoTitle, _callsInfoText);
      _callsBoxContent.append(_callsInfo);


      // if (profile.events && profile.events[0]){
      //   var _button = $('<button>').html('Envía una propuesta').addClass('signUp-button-welcome-section');
      //   var _listProfile = function(data){
      //     if(data['status'] == 'success'){
      //       var _caller = $('<button>');
      //       var _popup = Pard.Widgets.PopupCreator(_caller,'Inscribe un perfil ya creado', function(){return Pard.Widgets.ChooseProfileMessage(data.profiles, profile.events[0].event_id, _button)});
      //       _caller.trigger('click');
      //     }
      //     else{
      //       Pard.Widgets.Alert('Problema en el servidor', _dataReason).render();
      //     }
      //   }
      //   _button.click(function(){
      //     Pard.Backend.getCallForms(profile.events[0].call_id, function(data){
      //     var _content = $('<div>').addClass('very-fast reveal full');
      //     _content.empty();
      //     $('body').append(_content);
      //     var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
      //     var _message = Pard.Widgets.PopupContent(profile.events[0].name, Pard.Widgets.FormManager(data.forms.artist));
      //     _message.setCallback(function(){
      //       _content.remove();
      //       _popup.close();
      //     });
      //     _content.append(_message.render());
      //     _popup.open();
      //     });
      //     //Pard.Backend.listProfiles(_listProfile);
      //   });

        
      //   _eventBoxContent.append($('<p>').append(_button).addClass('callToActionBtn-container-eventCard'));
      //   // _callsInfo.append(_button);
      //   // _callsInfoTitle.removeAttr('style');
      //   // _callsInfoText.empty();
      //   // _callsInfoText.html('<strong> Sin embargo, la organización te ha habilitado para que puedas enviar propuestas fuera de tiempo.</strong>');
      // }
    });

    // _createdWidget.append(_callsBoxContainer.append(_callsBoxContent));

    if (userStatus == 'owner'){
      var _modifyProfile = Pard.Widgets.ModifySectionContent(Pard.Widgets.ModifyProfile(profile).render(), profile['color']);
      _createdWidget.append(_modifyProfile.render());
      if(profile.events) profile.events.forEach(function(_event){
        var _manageCallBtn =  $('<a>').addClass('navigation-btn-callPage').attr('href','/event_manager?id='+ _event.event_id).text('Gestiona convocatoria');        
        _eventBoxContent.append( $('<p>').append(_manageCallBtn).addClass('toCallPage-container-eventCard'));
      });
    }


    return {
      render: function(){
        return _createdWidget;
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
    var _toEventPageBtn = $('<a>').text('¡Página del evento!').attr('href','/event?id=' + the_event.event_id).addClass('toEventPageBtn-event-info-card');
    _status.append(_toEventPageBtn);
    _infoBox.append(_infoTitle, _baseline, _days, _status);
    _createdWidget.append(_image, _infoBox);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  

}(Pard || {}));
