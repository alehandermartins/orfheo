'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

 
  ns.Widgets.ArtistSection = function(sectionHeader, profile_id, profileOut) {

    if (profileOut) var profile = profileOut; 
      else{
      profile_id = profile_id || Pard.CachedProfiles[0].profile_id;
      var profile = Pard.ProfileManager.getProfile(profile_id);
    }
   
    Pard.Widgets.ProfileSectionHeader(sectionHeader, profile);

    $(document).ready(function(){
      if(profile.proposals == false){
        Pard.Widgets.CallArtistButton(profile, '').render().trigger('click');
      }
    });

    var _rgb = Pard.Widgets.IconColor(profile['color']).rgb();
    var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
    $('#main-profile-page').css({'background': _backColor});

  }

  ns.Widgets.ArtistSectionContent = function(profile, out){

    var _createdWidget = $('<div>');

    var _infoBoxContainer = Pard.Widgets.SectionBoxContainer('Información', Pard.Widgets.IconManager('information').render().addClass('info-icon-title-box')).render();
    var _infoContentBox = $('<div>').addClass('box-content');
    
    
    var _contact = $('<div>').addClass('information-contact');
    var _bio = $('<div>').addClass('information-bio')


    if(profile['bio']){ 
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

    

    if (out){
      if(profile.proposals){
        var _proposalsBoxContainer = Pard.Widgets.SectionBoxContainer('Participación en convocatorias', Pard.Widgets.IconManager('proposals').render()).render();
        var _proposalsBoxContent = $('<div>').addClass('box-content');
        var _proposals = profile.proposals;
        var _artistCallProposals = $('<div>');
        var _callName = $('<p>').append('Inscrito en ',$('<span>').text('Benimaclet conFusión festival 2016').css({'font-weight': 'bold'}),' con:').addClass('activities-box-call-name');

        var _listproposals = $('<ul>');

        _proposals.forEach(function(proposal){
          var _proposalItem = $('<li>').text(proposal);
          _listproposals.append(_proposalItem);
          
        });

        _artistCallProposals.append(_callName, _listproposals);
        _proposalsBoxContent.append(_artistCallProposals);
        _proposalsBoxContainer.append(_proposalsBoxContent);
        _createdWidget.append(_proposalsBoxContainer);
      }
    }
    else{
      var _proposalsBoxContainer = Pard.Widgets.SectionBoxContainer('Participación en convocatorias', Pard.Widgets.IconManager('proposals').render()).render();
      var _proposalsBoxContent = $('<div>').addClass('box-content');
      if(profile.proposals && profile.proposals.length){
        var _myArtistCallProposals = Pard.Widgets.MyArtistCallProposals(profile.proposals);
        var _callButton = Pard.Widgets.CallArtistButton(profile,'Envía otra propuesta').render().addClass('callButtonArtist-sendOther');
        _proposalsBoxContent.append(_myArtistCallProposals.render(), _callButton);
  
      }else{
        var _callButton = Pard.Widgets.CallArtistButton(profile,'Envía una propuesta al conFusión 2016').render().addClass('callButtonArtist-sendOther');
        _proposalsBoxContent.append(_callButton);
      }
      _proposalsBoxContainer.append(_proposalsBoxContent);
      _createdWidget.append(_proposalsBoxContainer);
    }

  

    if (!(out)){
      var _modifyProfile = Pard.Widgets.ModifySectionContent(Pard.Widgets.ModifyProfile(profile).render(), profile['color']);
      _createdWidget.append(_modifyProfile.render());
    }

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.MyArtistProductionsContent = function(production_id, profile, out){

    var profile_color = profile['color'];

    if (out){
      var production = Pard.ProfileManager.getProduction(production_id, [profile]);
    }
    else{
      var production = Pard.ProfileManager.getProduction(production_id);
    }

    var _categoryFields = Pard.Forms.ArtistCall(production.category).productionFields();
   
    var _createdWidget = $('<div>');

    var _title = $('<div>').addClass('production-title-box').append(
      $('<h4>').text(production.title));

    _createdWidget.append(_title);

    var _infoBoxContainer = Pard.Widgets.SectionBoxContainer('Información', Pard.Widgets.IconManager('information').render().addClass('info-icon-title-box')).render();

    var _infoContentBox = $('<div>').addClass('box-content');  
   
    var _info = $('<div>').addClass('information-bio');  
    var _addtionalInfo = $('<div>').addClass('information-contact');

    var _shortDescription = $('<p>').text(production.short_description).addClass('short-description-text');  
    _info.append(_shortDescription)
 
    if(production['description']){     
      var _description = $('<p>').text(production['description']);
      _info.append(_description);
    }


    var _category = $('<p>').addClass('information-contact-text-column').append($('<span>').text(Pard.Widgets.Dictionary(production['category']).render()));
    var _categoryIcon = Pard.Widgets.IconManager(production.category).render().addClass('information-contact-icon-column');

    _addtionalInfo.append($('<div>').append(_categoryIcon, _category));

        
    if (production['duration'] != 'false' && production['duration']){
      var _duration = $('<p>').addClass('information-contact-text-column').append($('<span>').text(production['duration']+' min'));
      var _durationIcon = Pard.Widgets.IconManager('duration').render().addClass('information-contact-icon-column');
      _addtionalInfo.append($('<div>').append(_durationIcon, _duration));
    }

    if (production['children'] != 'false' && production['children']){       
      var _children = $('<p>').addClass('information-contact-text-column').append($('<span>').text('Para niños'));
      var _childrenIcon = Pard.Widgets.IconManager('children').render().addClass('information-contact-icon-column');
      _addtionalInfo.append(_childrenIcon, _children);
    }
    
    _infoContentBox.append(_info, _addtionalInfo);
    _infoBoxContainer.append(_infoContentBox);
    _createdWidget.append(_infoBoxContainer);

    if (!(out)){
      var _modifyProduction = Pard.Widgets.ModifySectionContent(Pard.Widgets.ModifyProduction(production).render(), profile_color);
      _createdWidget.append(_modifyProduction.render());
    }

    if (out){
      if (production.video || production.audio || production.image){
        var _multimediaContainer = Pard.Widgets.MultimediaContent(production, out);
        _createdWidget.append(_multimediaContainer.render());
      }
    }
    else{
    var _multimediaContainer = Pard.Widgets.MultimediaContent(production, out);
    _createdWidget.append(_multimediaContainer.render());
    }

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


}(Pard || {}));
