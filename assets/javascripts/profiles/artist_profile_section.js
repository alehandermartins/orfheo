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

    var _programBoxContainer = $('<div>').addClass('section-box-container');
    // var _toEventPageBtn = $('<a>').text('Programación general').attr('href','/event?id='+program.event_id).addClass('toEventPageBtn-profile-page');
    var _titleContainer = $('<div>').addClass('title-box-container');
    _titleContainer.append($('<div>').append($('<span>').addClass('icon-in-box').append(Pard.Widgets.IconManager('current_event').render().css({'font-size':'1.3rem'})), $('<span>').text(Pard.t.text('profile_page.participation'))));
    var _programContent = $('<div>').addClass('box-content');
    _programBoxContainer.append(_titleContainer,_programContent)

    if (profile.program && profile.program.length){
      var _now = new Date();
      profile.program.forEach(function(eventProgram){
        var _dayShow = new Date(eventProgram.date);
        // si ha pasado un dia hasta las 6h
        if(_now.getTime() < (_dayShow.getTime() + 108000000)){
          _createdWidget.append(Pard.Widgets.ProgramProfile(eventProgram,profile.profile_id));
        }
        else{
          _programContent.append(Pard.Widgets.PastEventArtist(eventProgram));
        }
      })
    }

    var _infoBoxContainer = Pard.Widgets.SectionBoxContainer(Pard.t.text('profile_page.artistBio'), Pard.Widgets.IconManager('information').render().addClass('info-icon-title-box')).render();
    var _infoContentBox = $('<div>').addClass('box-content');
    
    var _contact = $('<div>').addClass('information-contact');
    var _bio = $('<div>').addClass('information-bio');  
    if(profile['bio']){     
      _bio.append($('<div>').html(profile['bio']).addClass('information-info'));
    }
    else{
      _bio.append('');
    }

    var _type = $('<p>').addClass('information-contact-text-column type-text-info-box').append($('<span>').text(Pard.t.text('dictionary.' + profile['type']).capitalize()));
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



    if (userStatus == 'owner'){
      var _proposalsBoxContainer = Pard.Widgets.SectionBoxContainer(Pard.t.text('profile_page.call'), Pard.Widgets.IconManager('open_call').render()).render();    
      var _proposalsBoxContent = $('<div>').addClass('box-content');
    if(profile.proposals && profile.proposals.artist.length){
        var _myCallProposals = Pard.Widgets.MyCallProposals(profile);
        _proposalsBoxContent.append(_myCallProposals.render()); 
      }
      else{
        var _callName = $('<p>').append(Pard.t.text('profile_page.callMex')).addClass('activities-box-call-name');
        _proposalsBoxContent.append(_callName);
      }     
      _proposalsBoxContainer.append(_proposalsBoxContent);
      _createdWidget.append(_proposalsBoxContainer);
  
      var _modifyProfile = Pard.Widgets.ModifySectionContent(Pard.Widgets.ModifyProfile(profile).render(), profile['color']);
      _createdWidget.append(_modifyProfile.render());
    }

   if (_programContent.html()){
      _createdWidget.append(_programBoxContainer);    
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

    // var _categoryFields = Pard.Forms.ArtistCall(production.category).productionFields();

    var _title = $('<div>').addClass('production-title-box').append(
      $('<h4>').text(production.title));

    _createdWidget.append(_title);

    var _infoBoxContainer = Pard.Widgets.SectionBoxContainer(Pard.t.text('profile_page.production.info'), Pard.Widgets.IconManager('information').render().addClass('info-icon-title-box')).render();

    var _infoContentBox = $('<div>').addClass('box-content');  
   
    var _info = $('<div>').addClass('information-bio');  
    var _addtionalInfo = $('<div>').addClass('information-contact');

    var _shortDescription = $('<div>').html(production.short_description).addClass('short-description-text');  
    _info.append(_shortDescription)
 
    if(production['description']){     
      var _description = $('<div>').html(production['description']).addClass('information-info');
      _info.append(_description);
    }

    var _category = $('<p>').addClass('information-contact-text-column').append($('<span>').text(Pard.t.text('categories.' + production['category']).capitalize()));
    var _categoryIcon = Pard.Widgets.IconManager(production.category).render().addClass('information-contact-icon-column');

    _addtionalInfo.append($('<div>').append(_categoryIcon, _category));

        
    if (production['duration'] != 'false' && production['duration']){
      var _durationText;
      if ($.isNumeric(production['duration'])) _durationText = production['duration']+' min';
      else if (production['duration'] == 'none') _durationText = Pard.t.text('profile_page.production.noDuration')
      else _durationText = production['duration'];
      var _duration = $('<p>').addClass('information-contact-text-column').append($('<span>').text(_durationText));
      var _durationIcon = Pard.Widgets.IconManager('duration').render().addClass('information-contact-icon-column');
      _addtionalInfo.append($('<div>').append(_durationIcon, _duration));
    }

    if (production['children']){       
      var _children = $('<p>').addClass('information-contact-text-column');
      if(production['children'] == 'all_public') _children.append($('<span>').text(Pard.t.text('widget.inputChildren.' + production.children)));
      else _children.append($('<span>').text(Pard.t.text('profile_page.production.public') + Pard.t.text('widget.inputChildren.' + production.children)));
      var _childrenIcon = Pard.Widgets.IconManager('children').render().addClass('information-contact-icon-column');
      _addtionalInfo.append(_childrenIcon, _children);
    }

    if(production['cache'] && production['cache'].visible == 'true' && production['cache'].value){
      var _cache = $('<p>').addClass('information-contact-text-column').append($('<span>').text(Pard.t.text('profile_page.production.cache')+production.cache.value));
      var _cacheIcon = Pard.Widgets.IconManager('cache').render().addClass('information-contact-icon-column');
      _addtionalInfo.append(_cacheIcon, _cache);
    }
    
    $('body').append(_addtionalInfo);
    _infoContentBox.css('min-height',_addtionalInfo.height()+24)
    _infoContentBox.append(_info.prepend(_addtionalInfo));
    _infoBoxContainer.append(_infoContentBox);
    _createdWidget.append(_infoBoxContainer);
    Pard.Widgets.MultimediaScripts();
    if (userStatus == 'owner'){
      var _modifyProduction = Pard.Widgets.ModifySectionContent(Pard.Widgets.ModifyProduction(production).render(), profile_color);
      _createdWidget.append(_modifyProduction.render());
      var _multimediaContainer = Pard.Widgets.MultimediaContent(production);
      _createdWidget.append(_multimediaContainer.render());
    }else if (production['photos'] || production['links']){
      var _multimediaContainer = Pard.Widgets.MultimediaContent(production);
      _createdWidget.append(_multimediaContainer.render());
    }
    
    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


}(Pard || {}));
