'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

 
  ns.Widgets.ArtistSection = function(sectionHeader, profile_id) {
    
    profile_id = profile_id || Pard.CachedProfiles['my_profiles'][0].profile_id;
    var profile = Pard.ProfileManager.getProfile(profile_id);
   
    Pard.Widgets.ProfileSectionHeader(sectionHeader, profile);

    $(document).ready(function(){
      if(profile.calls == false){
        Pard.Widgets.CallArtistButton(profile, '').render().trigger('click');
      }
    });

    var _rgb = Pard.Widgets.IconColor(profile['color']).rgb();
    var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
    $('#main-profile-page').css({'background': _backColor});

  }

  ns.Widgets.ArtistSectionContent = function(profile){

    console.log(profile.personal_web)
    var _createdWidget = $('<div>');

    var _infoBoxContainer = Pard.Widgets.SectionBoxContainer('Información', Pard.Widgets.IconManager('information').render().addClass('info-icon-title-box')).render();
    var _infoContentBox = $('<div>').addClass('box-content');
    
    
    var _contact = $('<div>').addClass('information-contact');
    var _bio = $('<div>').addClass('information-bio')
  

    if(profile['bio']){ 
    console.log(profile['bio']) ;   
      _bio.append($('<p>').text(profile['bio']));
    }  


    var _type = $('<p>').addClass('information-contact-text-column type-text-info-box').append($('<span>').text(Pard.Widgets.Dictionary(profile['type']).render()));
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


    _infoContentBox.append(_bio, _contact);
    _infoBoxContainer.append(_infoContentBox);
    _createdWidget.append(_infoBoxContainer);

    var _callsBoxContainer = Pard.Widgets.SectionBoxContainer('Participación en convocatorias', Pard.Widgets.IconManager('calls').render()).render();
    var _callsBoxContent = $('<div>').addClass('box-content');

    if(profile.calls.length){
            console.log(profile);

      var _myArtistCallProposals = Pard.Widgets.MyArtistCallProposals(profile.calls, profile['name']);
      var _callButton = Pard.Widgets.CallArtistButton(profile,'Envía otra propuesta').render().addClass('callButtonArtist-sendOther');
      _callsBoxContent.append(_myArtistCallProposals.render(), _callButton);

    }else{
      var _callButton = Pard.Widgets.CallArtistButton(profile,'Envía una propuesta al conFusión 2016').render().addClass('callButtonArtist-sendOther');
      _callsBoxContent.append(_callButton);
    }

    _callsBoxContainer.append(_callsBoxContent);
    _createdWidget.append(_callsBoxContainer);

    var _modifyProfile = Pard.Widgets.ModifySectionContent(Pard.Widgets.ModifyProfile(profile).render(), profile['color']);

    _createdWidget.append(_modifyProfile.render());

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.MyArtistProductionsContent = function(proposal_id, profile_color){

    var proposal = Pard.ProfileManager.getProposal(proposal_id);


    var _categoryFields = Pard.Forms.ArtistCall(proposal.category).productionFields();
   
    var _createdWidget = $('<div>');

    var _title = $('<div>').addClass('production-title-box').append(
      $('<h4>').text(proposal.title));

    _createdWidget.append(_title);

    var _infoBoxContainer = Pard.Widgets.SectionBoxContainer('Información', Pard.Widgets.IconManager('information').render().addClass('info-icon-title-box')).render();

    var _infoContentBox = $('<div>').addClass('box-content');  
   
    var _info = $('<div>').addClass('information-bio');  
    var _addtionalInfo = $('<div>').addClass('information-contact');

    var _shortDescription = $('<p>').text(proposal.short_description).addClass('short-description-text');  
    _info.append(_shortDescription)
 
    if(proposal['description']){     
      var _description = $('<p>').text(proposal['description']);
      _info.append(_description);
    }


    var _category = $('<p>').addClass('information-contact-text-column').append($('<span>').text(Pard.Widgets.Dictionary(proposal['category']).render()));
    var _categoryIcon = Pard.Widgets.IconManager(proposal.category).render().addClass('information-contact-icon-column');

    _addtionalInfo.append($('<div>').append(_categoryIcon, _category));

        
    if (proposal['duration'] != 'false' && proposal['duration']){
      var _duration = $('<p>').addClass('information-contact-text-column').append($('<span>').text(proposal['duration']+' min'));
      var _durationIcon = Pard.Widgets.IconManager('duration').render().addClass('information-contact-icon-column');
      _addtionalInfo.append($('<div>').append(_durationIcon, _duration));
    }

    console.log(proposal);

    if (proposal['children'] != 'false' && proposal['children']){       
      var _children = $('<p>').addClass('information-contact-text-column').append($('<span>').text('Para niños'));
      var _childrenIcon = Pard.Widgets.IconManager('children').render().addClass('information-contact-icon-column');
      _addtionalInfo.append(_childrenIcon, _children);
    }
    
    _infoContentBox.append(_info, _addtionalInfo);
    _infoBoxContainer.append(_infoContentBox);
    _createdWidget.append(_infoBoxContainer);

    var _modifyProduction = Pard.Widgets.ModifySectionContent(Pard.Widgets.ModifyProduction(proposal).render(), profile_color);
    _createdWidget.append(_modifyProduction.render());
 
    var _multimediaContainer = Pard.Widgets.MultimediaContent(proposal);
    _createdWidget.append(_multimediaContainer.render());

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


}(Pard || {}));
