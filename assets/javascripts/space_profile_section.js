'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.SpaceSection = function(sectionHeader,  profile_id) {
    profile_id = profile_id || Pard.CachedProfiles['my_profiles'][0].profile_id;
    var profile = Pard.ProfileManager.getProfile(profile_id);

    Pard.Widgets.ProfileSectionHeader(sectionHeader, profile);

    var _rgb = Pard.Widgets.IconColor(profile['color']).rgb();
    var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
    $('#main-profile-page').css({'background': _backColor});

    if(profile.calls == false){
      $(document).ready(function(){Pard.Widgets.CallSpaceButton('',profile).render().trigger('click')});
    }
  }

  ns.Widgets.SpaceSectionContent = function(profile) {  

    var _createdWidget = $('<div>');

    var _infoBoxContainer = Pard.Widgets.SectionBoxContainer('Informaciones', Pard.Widgets.IconManager('information').render().addClass('info-icon-title-box')).render();
    var _infoContentBox = $('<div>').addClass('box-content');
    
    
    var _contact = $('<div>').addClass('information-contact');
    var _bio = $('<div>').addClass('information-bio')  

    if(profile['bio'] != false){     
      _bio.append($('<p>').text(profile['bio']));
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
  
    _infoContentBox.append(_bio, _contact);
    _infoBoxContainer.append(_infoContentBox);
    _createdWidget.append(_infoBoxContainer);

    var _callsBoxContainer = Pard.Widgets.SectionBoxContainer('Actividades', Pard.Widgets.IconManager('calls').render()).render();
    var _callsBoxContent = $('<div>').addClass('box-content');

    if('calls' in profile && profile.calls != false){
      var _mySpaceCallProposals = Pard.Widgets.MySpaceCallProposals(profile.calls);
      var _callButton = Pard.Widgets.CallSpaceButton(profile,'Envía otra propuesta').render().addClass('callButtonArtist-sendOther');
      _callsBoxContent.append(_mySpaceCallProposals.render(), _callButton);

    }else{
      var _callButton = Pard.Widgets.CallSpaceButton(profile,'Envía una propuesta al conFusión 2016');
      _callsBoxContent.append(_callButton.render());
    }

    _callsBoxContainer.append(_callsBoxContent);
    _createdWidget.append(_callsBoxContainer);
   
    var _modifyProfile = Pard.Widgets.ModifySectionContent(Pard.Widgets.ModifyProfile(profile).render(), profile['color']);

    _createdWidget.append(_modifyProfile.render());


    var _multimediaContainer = Pard.Widgets.MultimediaContent(profile);
    _createdWidget.append(_multimediaContainer.render());


    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


}(Pard || {}));

