'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ProfileSectionHeader = function(sectionHeader, profile){
    sectionHeader.empty();

    var _photoContainer = $('<div>');

    if(profile.profile_picture){
      var _img = $.cloudinary.image(profile['profile_picture'][0],
      { format: 'jpg', width: 750, height: 220,
      crop: 'fill', effect: 'saturation:50' });
      _photoContainer.addClass('section-profilePhoto-container').append(_img);
    }
    else _photoContainer.css({'background-color': profile.color}).addClass('section-profilePhoto-container-noPhoto');

    sectionHeader.append(_photoContainer);

    
    if(profile['name'] != null) sectionHeader.append( $('<div>').addClass('title-profile-section-container').append($('<h3>').text(profile['name']).addClass('text-title-profile-section')));
 
  }

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
    var _createdWidget = $('<div>');

    var _infoBoxContainer = Pard.Widgets.SectionBoxContainer('Informaciones', Pard.Widgets.IconManager('information').render()).render();
    var _infoContentBox = $('<div>').addClass('box-content');
    
    
    var _contact = $('<div>').addClass('information-contact');
    var _bio = $('<div>').addClass('information-bio')
  

    if(profile['bio'] != false){     
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

    var _callsBoxContainer = Pard.Widgets.SectionBoxContainer('Actividades', Pard.Widgets.IconManager('calls').render()).render();
    var _callsBoxContent = $('<div>').addClass('box-content');

    if(profile.calls){
      var _myArtistCallProposals = Pard.Widgets.MyArtistCallProposals(profile.calls);
      var _callButton = Pard.Widgets.CallArtistButton(profile,'Envía otra propuesta').render().addClass('callButtonArtist-sendOther');
      _callsBoxContent.append(_myArtistCallProposals.render(), _callButton);

    }else{
      var _callButton = Pard.Widgets.CallArtistButton(profile,'Envía una propuesta al conFusión 2016');
      _callsBoxContent.append(_callButton.render());
    }

    _callsBoxContainer.append(_callsBoxContent);
    _createdWidget.append(_callsBoxContainer);

    var _modifyProfile = Pard.Widgets.ModifyProfile(profile);
  

    var _iconColor = Pard.Widgets.IconColor((profile['color'])).render();

    var _triangle = $('<div>').addClass('modify-section-content-button-container');

     _createdWidget.append(
      _triangle.css({'border-top': '70px solid'+profile['color']}),
      _modifyProfile.render().css({color: _iconColor})
    );

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

   ns.Widgets.PrintWebsList = function(personal_webs_obj){

    var _createdWidget = $('<div>');
    var _webArray = Object.keys(personal_webs_obj).map(function(key){return personal_webs_obj[key]});
    var _socialIcons;
    var _personalWebs = $('<div>');
    var _socials = $('<span>');
   
    _webArray.forEach(function(elem){
      if (elem['provider'] != 'my_web'){
        var _iconSocial = Pard.Widgets.IconManager('icon_social').render().addClass('icon-in-box mySocials-icon-info-box');
        var _iconImg = Pard.Widgets.IconManager(elem['provider']).render();
        _iconImg.addClass('social-icon-fa')        
        var _iconA = $('<a>').attr({
          href: elem['url'],
          target: '_blank'            
        }).append(_iconImg);
        _socials.append(_iconA);
        _socialIcons = $('<div>').append($('<div>').addClass('information-contact-icon-column').append(_iconSocial), $('<p>').addClass('information-contact-text-column').append(_socials));
      }
      if (elem['provider'] == 'my_web'){
        var _iconLink = Pard.Widgets.IconManager('my_web').render();
        var _url = elem['url'];
        var _link = $('<a>').attr({
          href: elem['url'],
          target: '_blank'            
        }).css({
          'word-wrap': 'break-word',
        });
        ['http://', 'https://', 'www.'].forEach(function(string){
          if(_url.indexOf(string) > -1) {
            _url  = _url.substring(string.length);
          }
        })
        _link.text(_url);
       _personalWebs.append($('<div>').addClass('information-contact-icon-column').append(_iconLink), $('<p>').addClass('information-contact-text-column').append(_link));        
      }
    });
    
    if (_socialIcons)  _createdWidget.append(_socialIcons);
    if (_personalWebs.html()) _createdWidget.append(_personalWebs);

    return{
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

    var _infoBoxContainer = Pard.Widgets.SectionBoxContainer('Informaciones', Pard.Widgets.IconManager('information').render()).render();

    var _infoContentBox = $('<div>').addClass('box-content');  
   
    var _info = $('<div>').addClass('information-bio');  
    var _addtionalInfo = $('<div>').addClass('information-contact');

    var _shortDescription = $('<p>').text(proposal.short_description).addClass('short-description-text');  
    _info.append(_shortDescription)
 
    if(proposal['description'] != false){     
      var _description = $('<p>').text(proposal['description']);
      _info.append(_description);
    }


    var _category = $('<p>').addClass('information-contact-text-column').append($('<span>').text(Pard.Widgets.Dictionary(proposal['category']).render()));
    var _categoryIcon = Pard.Widgets.IconManager(proposal.category).render().addClass('information-contact-icon-column');

    _addtionalInfo.append($('<div>').append(_categoryIcon, _category));

        
    if (proposal['duration']){
      var _duration = $('<p>').addClass('information-contact-text-column').append($('<span>').text(proposal['duration']+' min'));
      var _durationIcon = Pard.Widgets.IconManager('duration').render().addClass('information-contact-icon-column');
      _addtionalInfo.append($('<div>').append(_durationIcon, _duration));
    }

    if (proposal['children']){        
      var _children = $('<p>').addClass('information-contact-text-column').append($('<span>').text('Para niños'));
      var _childrenIcon = Pard.Widgets.IconManager('children').render().addClass('information-contact-icon-column');
      _addtionalInfo.append(_childrenIcon, _children);
    }
    
    _infoContentBox.append(_info, _addtionalInfo);
    _infoBoxContainer.append(_infoContentBox);
    _createdWidget.append(_infoBoxContainer);
 
    var _multimediaContainer = $('<div>').addClass('multimedia-container'); 



    if(proposal.video){
      var _videoContainer = $('<div>').addClass('video-production-container')
      _multimediaContainer.append(_videoContainer);
      proposal.video.forEach(function(video, index){
         if (typeof video == 'object'){
           console.log(video['0']);
           console.log(Object.keys(video));
           console.log(video);
         }
        _videoContainer.append($('<div>').addClass('single-video-container').append(video));
      });
    }

    if(proposal.image){
      proposal.image.forEach(function(image){
        _multimediaContainer.append(image);
      });
    }

    if(proposal.audio){
      proposal.audio.forEach(function(audio){
        _multimediaContainer.append(audio);
      });
    }

    var _modifyProduction = Pard.Widgets.ModifyProduction(proposal);

    var _iconColor = Pard.Widgets.IconColor((profile_color)).render();

    var _triangle = $('<div>').addClass('modify-section-content-button-container');

     _createdWidget.append(
      _triangle.css({'border-top': '70px solid'+profile_color}),
      _modifyProduction.render().css({color: _iconColor})
    );

    var _multiMediaManager = Pard.Widgets.MultimediaManager(proposal);

    _createdWidget.append(
      _multimediaContainer, 
      _multiMediaManager.render()
    );

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


}(Pard || {}));
