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

    var _infoBoxContainer = Pard.Widgets.SectionBoxContainer(Pard.t.text('profile_page.organizationInfo'), Pard.Widgets.IconManager('information').render().addClass('info-icon-title-box')).render();
    var _infoContentBox = $('<div>').addClass('box-content');
    
    
    var _contact = $('<div>').addClass('information-contact');
    var _bio = $('<div>').addClass('information-bio');  
    if(profile['bio']){     
      _bio.append($('<div>').html(profile['bio']).addClass('information-info'));
    }
    else{
      _bio.append('');
    }

    var _type = $('<p>').addClass('information-contact-text-column type-text-info-box').append($('<span>').text(Pard.t.text('categories.' + profile.category)));
    var _typeIcon = Pard.Widgets.IconManager(profile['type']).render().addClass('information-contact-icon-column type-icon-info-box');

    _contact.append($('<div>').append(_typeIcon, _type));

    var _location = profile['address']['route']+' '+profile['address']['street_number']+', '+profile['address']['locality'];
    // if (profile['address']['neighborhood']) _location += profile['address']['neighborhood']+' - ';
    // _location += profile['address']['locality'];
    var _aStr = profile['address']['route']+' '+profile['address']['street_number']+', '+profile['address']['locality']+' '+profile['address']['country'];
    var _address = $('<div>').append(Pard.Widgets.IconManager('city_artist').render().addClass('information-contact-icon-column'), $('<p>').addClass('information-contact-text-column').append($('<a>').attr({
      href: 'http://maps.google.com/maps?q='+_aStr,
      target: '_blank'
      }).text(_location)));

    _contact.append(_address);

    if(profile.personal_web){
      _contact.append(Pard.Widgets.PrintWebsList(profile['personal_web']).render());
    };

    if(profile.phone && profile.phone.visible == 'true' && profile.phone.value){
      var _phone = $('<div>');
      var _phoneIcon = Pard.Widgets.IconManager('phone').render().addClass('information-contact-icon-column');
      var _phoneText = $('<p>').addClass('information-contact-text-column type-text-info-box').append(profile.phone.value).css('vertical-align','-0.2rem');
      _contact.append(_phone.append(_phoneIcon, _phoneText));
    }

    $('body').append(_contact);
    _infoContentBox.css('min-height',_contact.height()+24)
    _infoContentBox.append(_bio.prepend(_contact));
    _infoBoxContainer.append(_infoContentBox);
    _createdWidget.append(_infoBoxContainer);
    var _eventBoxContainer = Pard.Widgets.SectionBoxContainer(Pard.t.text('profile_page.events'), Pard.Widgets.IconManager('proposals').render()).render();
    var _eventBoxContent = $('<div>').addClass('box-content').css('min-height','2rem');
    var _createEventBtn = Pard.Widgets.Button(
      Pard.t.text('profile_page.createEventBtn'), 
      function(){
         var _contactPopup = Pard.Widgets.Popup();
        _contactPopup.setContent(Pard.t.text('profile_page.createEventTitle'), Pard.Widgets.EventContact(profile.name));
        _contactPopup.setCallback(function(){
          setTimeout(function(){
            _contactPopup.destroy();
          }, 500);
        });
        _contactPopup.open();
      }
    )
    .render()
    .addClass('createEventBtn-organizationPage');
    if(profile.events && profile.events.length || Pard.UserStatus['status'] == 'owner'){
      if (Pard.UserStatus['status'] == 'owner') _eventBoxContainer.append(_createEventBtn); 
      _createdWidget.append(_eventBoxContainer.append(_eventBoxContent));
      if(profile.events) profile.events.forEach(function(_event){
        var _eventCard = Pard.Widgets.EventCard(_event, (userStatus === 'owner'));
        var _eventCardContainer = $('<div>').append($('<div>').append(_eventCard).addClass('eventCard-container-userPage')).addClass('outer-eventCard-container-userPage');
        _eventBoxContent.append(_eventCardContainer).css('margin-bottom','-1.5rem');
      });
    }

    var _programBoxContainer = $('<div>').addClass('section-box-container');
    var _titleContainer = $('<div>').addClass('title-box-container');
    _titleContainer.append($('<div>').append($('<span>').addClass('icon-in-box').append(Pard.Widgets.IconManager('current_event').render().css({'font-size':'1.3rem'})), $('<span>').text(Pard.t.text('profile_page.participation'))));
    var _programContent = $('<div>').addClass('box-content');
    _programBoxContainer.append(_titleContainer,_programContent)

    if (profile.program && profile.program.length){
      var _now = new Date();
      profile.program.forEach(function(eventProgram){
        var _dayShow = new Date(eventProgram.date);
        // si ha pasado menos de una semana
        if(_now.getTime() < (_dayShow.getTime()+86400000)){
          _createdWidget.prepend(Pard.Widgets.ProgramProfile(eventProgram,profile.profile_id));
        }
        else{
          var _hostedShows = $.extend(true, {}, eventProgram);
          _hostedShows['shows'] = [];
          var _givenShow = $.extend(true, {}, eventProgram);
          _givenShow['shows'] = [];
          eventProgram['shows'].forEach(function(show){
            if (show.host_id == profile.profile_id) _hostedShows['shows'].push(show);
            else _givenShow['shows'].push(show);
          })
          if (_hostedShows['shows'].length) _programContent.append(Pard.Widgets.PastEventSpace(eventProgram));
          if (_givenShow['shows'].length) _programContent.append(Pard.Widgets.PastEventArtist(eventProgram));
        }
      })
    }

    if (_programContent.html()) _createdWidget.append(_programBoxContainer);


    if (userStatus == 'owner'){
      var _callsBoxContainer = Pard.Widgets.SectionBoxContainer(Pard.t.text('profile_page.call'), Pard.Widgets.IconManager('open_call').render()).render();
      if('proposals' in profile && profile.proposals != false){
        var _callsBoxContent = $('<div>').addClass('box-content');
        var _myCallProposals = Pard.Widgets.MyCallProposals(profile);
            _callsBoxContent.append(_myCallProposals.render()); 
      }
      else{
          var _callsBoxContent = $('<div>').addClass('box-content');
          var _callName = $('<p>').append(Pard.t.text('profile_page.callMex')).addClass('activities-box-call-name');
          _callsBoxContent.append(_callName);
      }     
      _callsBoxContainer.append(_callsBoxContent);
      _createdWidget.append(_callsBoxContainer);  

      var _modifyProfile = Pard.Widgets.ModifySectionContent(Pard.Widgets.ModifyProfile(profile).render(), profile['color']);
      _createdWidget.append(_modifyProfile.render());
      var _multimediaContainer = Pard.Widgets.MultimediaContent(profile);
      _createdWidget.append(_multimediaContainer.render());
     }else{
      if (profile['photos'] || profile['links']){        
        var _multimediaContainer = Pard.Widgets.MultimediaContent(profile);
        _createdWidget.append(_multimediaContainer.render());
      }
    }
  


    return {
      render: function(){
        return _createdWidget;
      }
    }
  }



  

}(Pard || {}));
