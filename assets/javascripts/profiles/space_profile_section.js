'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.SpaceSection = function(sectionHeader,  profile_id) {

    var userStatus = Pard.UserStatus['status'];

    profile_id = profile_id || Pard.CachedProfiles[0].profile_id;
    var profile = Pard.ProfileManager.getProfile(profile_id);

    Pard.Widgets.ProfileSectionHeader(sectionHeader, profile);

    var _rgb = Pard.Widgets.IconColor(profile['color']).rgb();
    var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
    $('#main-profile-page').css({'background': _backColor});

    // if(profile.proposals == false && userStatus == 'owner'){
    //   $(document).ready(function(){Pard.Widgets.CallSpaceButton(profile,'').render().trigger('click')});
    // }
  }

  ns.Widgets.SpaceSectionContent = function(profile) {

    var _createdWidget = $('<div>');
    var userStatus = Pard.UserStatus['status'];

    var _infoBoxContainer = Pard.Widgets.SectionBoxContainer(Pard.t.text('profile_page.spaceInfo'), Pard.Widgets.IconManager('information').render().addClass('info-icon-title-box')).render();
    var _infoContentBox = $('<div>').addClass('box-content');
       
    var _contact = $('<div>').addClass('information-contact');
    var _bio = $('<div>').addClass('information-bio')  
    if(profile['bio']){     
      _bio.append($('<div>').html(profile['bio']).addClass('information-info'));
    }
    else if(profile.proposals && profile.proposals[0] && profile.proposals[0]['description']){
        _bio.append($('<div>').html(profile.proposals[0]['description']));
    }
    else if(profile.proposals && profile.proposals[0]){
        _bio.append($('<div>').html(profile.proposals[0]));
    }

    var _type = $('<p>').addClass('information-contact-text-column type-text-info-box').append($('<span>').text(Pard.Widgets.Dictionary(profile['category']).render()));
    var _typeIcon = Pard.Widgets.IconManager(profile['type']).render().addClass('information-contact-icon-column type-icon-info-box');

    _contact.append($('<div>').append(_typeIcon, _type));

    var _address = $('<div>');
    var _addressIcon = Pard.Widgets.IconManager('address_space').render().addClass('information-contact-icon-column');
    var _aStr = profile['address']['route']+' '+profile['address']['street_number']+', '+profile['address']['locality']+' '+profile['address']['country'];
    var _addressText = $('<p>').addClass('information-contact-text-column').append($('<a>').attr({
      href: 'http://maps.google.com/maps?q='+_aStr,
      target: '_blank'
      }).text(profile['address']['route']+' '+profile['address']['street_number']+', '+profile['address']['locality']));

    _contact.append(_address.append(_addressIcon, _addressText));

    if(profile.personal_web){
      _contact.append(Pard.Widgets.PrintWebsList(profile['personal_web']).render());
    }

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
      var _callsBoxContainer = Pard.Widgets.SectionBoxContainer(Pard.t.text('profile_page.call'), Pard.Widgets.IconManager('open_call').render()).render();
      if('proposals' in profile && profile.proposals != false){
        var _callsBoxContent = $('<div>').addClass('box-content');
        var _mySpaceCallProposals = Pard.Widgets.MyCallProposals(profile);
            _callsBoxContent.append(_mySpaceCallProposals.render()); 
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

