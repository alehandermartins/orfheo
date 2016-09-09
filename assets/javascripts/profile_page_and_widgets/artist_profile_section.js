'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

 
  ns.Widgets.ArtistSection = function(sectionHeader, profile_id) {

    profile_id = profile_id || Pard.CachedProfiles[0].profile_id;
    var profile = Pard.ProfileManager.getProfile(profile_id);
    var userStatus = Pard.UserStatus['status'];
   
    Pard.Widgets.ProfileSectionHeader(sectionHeader, profile);

    // if (userStatus == 'owner'){
    //   $(document).ready(function(){
    //     if(profile.proposals == false){
    //       Pard.Widgets.CallArtistButton(profile, '').render().trigger('click');
    //     }
    //   });
    // }

    var _rgb = Pard.Widgets.IconColor(profile['color']).rgb();
    var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
    $('#main-profile-page').css({'background': _backColor});
  }

  ns.Widgets.ArtistSectionContent = function(profile){

    var _createdWidget = $('<div>');
    var userStatus = Pard.UserStatus['status'];

    // if (profile.program && profile.program.length){
    //   _createdWidget.append(Pard.Widgets.ProgramProfile(profile.program,profile.type));
    // }

    var _infoBoxContainer = Pard.Widgets.SectionBoxContainer('Información', Pard.Widgets.IconManager('information').render().addClass('info-icon-title-box')).render();
    var _infoContentBox = $('<div>').addClass('box-content');
    

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

    $('body').append(_contact);
    _infoContentBox.css('min-height',_contact.height()+24)
    _infoContentBox.append(_bio.prepend(_contact));
    _infoBoxContainer.append(_infoContentBox);
    _createdWidget.append(_infoBoxContainer);

    var _proposalsBoxContainer = Pard.Widgets.SectionBoxContainer('Participación en convocatorias', Pard.Widgets.IconManager('proposals').render()).render();    
    var _proposalsBoxContent = $('<div>').addClass('box-content');

    if(profile.proposals && profile.proposals.length){
      if (userStatus != 'owner'){
        var _proposals = profile.proposals;
        var _artistCallProposals = $('<div>');
        var _callName = $('<p>').append('Se ha inscrito en el ',$('<span>').text('Benimaclet conFusión festival 2016').css({'font-weight': 'bold'}),' con:').addClass('activities-box-call-name');

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
      else{
        if(profile.proposals && profile.proposals.length){
          var _myArtistCallProposals = Pard.Widgets.MyArtistCallProposals(profile.proposals);
          // var _callButton = Pard.Widgets.CallArtistButton(profile,'Envía otra propuesta').render().addClass('callButtonArtist-sendOther');
          _proposalsBoxContent.append(_myArtistCallProposals.render());
        }
      }
    }  
    else{
        var _artistCallProposals = $('<div>');
        var _callName = $('<p>').append('Todavía no se ha inscrito en ninguna convocatoria.').addClass('activities-box-call-name');
        _artistCallProposals.append(_callName);
        _proposalsBoxContent.append(_artistCallProposals);
        _proposalsBoxContainer.append(_proposalsBoxContent);
        _createdWidget.append(_proposalsBoxContainer);

      }
      // else{
      //   var _callButton = Pard.Widgets.CallArtistButton(profile,'Envía una propuesta al conFusión 2016').render().addClass('callButtonArtist-sendOther');
      //   _proposalsBoxContent.append(_callButton);
      // }
      _proposalsBoxContainer.append(_proposalsBoxContent);
      _createdWidget.append(_proposalsBoxContainer);

  

    if (userStatus == 'owner'){
      var _modifyProfile = Pard.Widgets.ModifySectionContent(Pard.Widgets.ModifyProfile(profile).render(), profile['color']);
      _createdWidget.append(_modifyProfile.render());
    }

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.MyArtistProductionsContent = function(production_id, profile){

    var profile_color = profile['color'];
    var userStatus = Pard.UserStatus['status'];
    var production = Pard.ProfileManager.getProduction(production_id);
    var _createdWidget = $('<div>');

    var _categoryFields = Pard.Forms.ArtistCall(production.category).productionFields();

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
    
    $('body').append(_addtionalInfo);
    _infoContentBox.css('min-height',_addtionalInfo.height()+24)
    _infoContentBox.append(_info.prepend(_addtionalInfo));
    _infoBoxContainer.append(_infoContentBox);
    _createdWidget.append(_infoBoxContainer);

    if (userStatus == 'owner'){
      var _modifyProduction = Pard.Widgets.ModifySectionContent(Pard.Widgets.ModifyProduction(production).render(), profile_color);
      _createdWidget.append(_modifyProduction.render());
      var _multimediaContainer = Pard.Widgets.MultimediaContent(production);
      _createdWidget.append(_multimediaContainer.render());

    }else{
      if (production['photos'] || production['links']){
        var _multimediaContainer = Pard.Widgets.MultimediaContent(production);
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