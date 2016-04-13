'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.SpaceSection = function(sectionHeader,  profile_id, profile) {

    var _out = true;

    if (!(profile)) {
      profile_id = profile_id || Pard.CachedProfiles['my_profiles'][0].profile_id;
      var profile = Pard.ProfileManager.getProfile(profile_id);
      _out = false;
    }

    Pard.Widgets.ProfileSectionHeader(sectionHeader, profile);

    var _rgb = Pard.Widgets.IconColor(profile['color']).rgb();
    var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
    $('#main-profile-page').css({'background': _backColor});

    if(profile.calls == false && _out == false){
      $(document).ready(function(){Pard.Widgets.CallSpaceButton('',profile).render().trigger('click')});
    }
  }

  ns.Widgets.SpaceSectionContent = function(profile, out) {  

    var _createdWidget = $('<div>');

    var _infoBoxContainer = Pard.Widgets.SectionBoxContainer('Información', Pard.Widgets.IconManager('information').render().addClass('info-icon-title-box')).render();
    var _infoContentBox = $('<div>').addClass('box-content');
       
    var _contact = $('<div>').addClass('information-contact');
    var _bio = $('<div>').addClass('information-bio')  

    if(profile['bio']){     
      _bio.append($('<p>').text(profile['bio']));
    }else{
      if(profile.calls){
        if (profile.calls[0]['description']) _bio.append($('<p>').text(profile.calls[0]['description']));
      }
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
    if (out){
      if('calls' in profile && profile.calls != false){
        var _callsBoxContainer = Pard.Widgets.SectionBoxContainer('Participación en convocatorias', Pard.Widgets.IconManager('calls').render()).render();
        var _callsBoxContent = $('<div>').addClass('box-content');
        var _callProposals = profile.proposals;
        var _spaceCallProposals = $('<div>');
        var _callName = $('<p>').append('Inscrito en ',$('<span>').text('Benimaclet conFusión festival 2016'));
        _spaceCallProposals.append(_callName);
        _callsBoxContent.append(_spaceCallProposals)
        _callsBoxContainer.append(_callsBoxContent);
        _createdWidget.append(_callsBoxContainer);  
      }     
    }
    else{
      var _callsBoxContainer = Pard.Widgets.SectionBoxContainer('Participación en convocatorias', Pard.Widgets.IconManager('calls').render()).render();
      var _callsBoxContent = $('<div>').addClass('box-content');
      if('calls' in profile && profile.calls != false){
        var _mySpaceCallProposals = Pard.Widgets.MySpaceCallProposals(profile.calls);
        // var _callButton = Pard.Widgets.CallSpaceButton(profile,'Envía otra propuesta').render().addClass('callButtonArtist-sendOther');
        _callsBoxContent.append(_mySpaceCallProposals.render()); 
        // _callsBoxContent.append(_callButton);

      }else{
        var _callButton = Pard.Widgets.CallSpaceButton(profile,'Envía una propuesta al conFusión 2016').render().addClass('callButtonArtist-sendOther');
        _callsBoxContent.append(_callButton);
      }
      _callsBoxContainer.append(_callsBoxContent);
      _createdWidget.append(_callsBoxContainer);  
    }
   
    if (!(out)){
      var _modifyProfile = Pard.Widgets.ModifySectionContent(Pard.Widgets.ModifyProfile(profile).render(), profile['color']);
      _createdWidget.append(_modifyProfile.render());
    }

    if (out){
      if (profile.video || profile.audio || profile.image){
        var _multimediaContainer = Pard.Widgets.MultimediaContent(profile, out);
        _createdWidget.append(_multimediaContainer.render());
      }
    }
    else{
    var _multimediaContainer = Pard.Widgets.MultimediaContent(profile);
    _createdWidget.append(_multimediaContainer.render());
    }


    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


}(Pard || {}));

