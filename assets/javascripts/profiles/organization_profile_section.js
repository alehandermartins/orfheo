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
      _bio.append($('<div>').html(profile['bio']));
    }
    else{
      _bio.append('');
    }

    var _type = $('<p>').addClass('information-contact-text-column type-text-info-box').append($('<span>').text(Pard.Widgets.Dictionary(profile.category).render()));
    var _typeIcon = Pard.Widgets.IconManager(profile['type']).render().addClass('information-contact-icon-column type-icon-info-box');

    _contact.append($('<div>').append(_typeIcon, _type));

    var _location = '';
    if (profile['address']['neighborhood']) _location += profile['address']['neighborhood']+' - ';
    _location += profile['address']['locality'];
    var _address = $('<div>').append(Pard.Widgets.IconManager('city_artist').render().addClass('information-contact-icon-column'), $('<p>').addClass('information-contact-text-column').append($('<a>').attr({
      href: 'http://maps.google.com/maps?q='+profile['address']['locality']+' '+profile['address']['postal_code'],
      target: '_blank'
      }).text(_location)));

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
      _createdWidget.append(_eventBoxContainer.append(_eventBoxContent));
      profile.events.forEach(function(_event){
        var _eventCard = Pard.Widgets.EventCard(_event, (userStatus === 'owner'));
        var _eventCardContainer = $('<div>').append($('<div>').append(_eventCard).addClass('eventCard-container-userPage')).addClass('outer-eventCard-container-userPage')
        _eventBoxContent.append(_eventCardContainer).css('margin-bottom','-1.5rem');;
      });
    }

    var _programBoxContainer = $('<div>').addClass('section-box-container');
    var _titleContainer = $('<div>').addClass('title-box-container');
    _titleContainer.append($('<div>').append($('<span>').addClass('icon-in-box').append(Pard.Widgets.IconManager('current_event').render().css({'font-size':'1.3rem'})), $('<span>').text('Participación en eventos')));
    var _programContent = $('<div>').addClass('box-content');
    _programBoxContainer.append(_titleContainer,_programContent)

    if (profile.program && profile.program.length){
      var _now = new Date();
      profile.program.forEach(function(eventProgram){
        var _dayShow = new Date(eventProgram.date);
        // si ha pasado menos de una semana
        if(_now.getTime() < (_dayShow.getTime()+604800000)){
          _createdWidget.prepend(Pard.Widgets.ProgramProfile(eventProgram,profile.type));
        }
        else{
          _programContent.append(Pard.Widgets.PastEventSpace(eventProgram));
        }
      })
    }

    if (_programContent.html()) _createdWidget.append(_programBoxContainer);


    if (userStatus == 'owner'){
      var _callsBoxContainer = Pard.Widgets.SectionBoxContainer('Participación en convocatorias', Pard.Widgets.IconManager('proposals').render()).render();
      if('proposals' in profile && profile.proposals != false){
        var _callsBoxContent = $('<div>').addClass('box-content');
        var _myCallProposals = Pard.Widgets.MyCallProposals(profile);
            _callsBoxContent.append(_myCallProposals.render()); 
      }
      else{
          var _callsBoxContent = $('<div>').addClass('box-content');
          var _callName = $('<p>').append('No estás inscrito en ninguna convocatoria activa en este periodo.').addClass('activities-box-call-name');
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
