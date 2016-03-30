'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ProfileSectionHeader = function(sectionHeader, profile){
    sectionHeader.empty();

    var _photoContainer = $('<div>').addClass('section-profilePhoto-container');

    if('profile_picture' in profile && profile['profile_picture'] != null){
      var _img = $.cloudinary.image(profile['profile_picture'][0],
      { format: 'jpg', width: 750, height: 220,
      crop: 'fill', effect: 'saturation:50' });
      _photoContainer.append(_img);
    }
    else _photoContainer.css({'background-color': profile.color});

    sectionHeader.append(_photoContainer);

    
    if(profile['name'] != null) sectionHeader.append( $('<div>').addClass('title-profile-section-container').append($('<span>').text(profile['name']).addClass('text-title-profile-section')));
    
    // return {
    //   render: function(){
    //     return _headerProfileSection;
    //   }
    // }
  }

  ns.Widgets.ArtistSection = function(sectionHeader, sectionContent, profile_id) {
    
    profile_id = profile_id || Pard.CachedProfiles['my_profiles'][0].profile_id;
    var profile = Pard.ProfileManager.getProfile(profile_id);
   
    Pard.Widgets.ProfileSectionHeader(sectionHeader, profile);
  }

  ns.Widgets.ArtistSectionContent = function(profile){
    var _createdWidget = $('<div>');

    console.log(profile); 

    var _infoBoxContainer = Pard.Widgets.SectionBoxContainer('Informaciones', Pard.Widgets.IconManager('information').render()).render();
    var _infoContentBox = $('<div>');
    
    
    var _contact = $('<div>').addClass('informations-contact');
    var _bio = $('<div>').addClass('informations-bio')
  

    if(profile['bio'] != null){     
      _bio.append($('<p>').text(profile['bio']));
    }  
   

    if('personal_web' in profile && profile['personal_web'] != null){
      
      var _webArray = Object.keys(profile['personal_web']).map(function(key){return profile['personal_web'][key]});
      var _socialIcons;
      var _socials = $('<span>');
     
      _webArray.forEach(function(elem){
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
          _link.text(_url).addClass('informations-contact-text');
          _contact.append($('<div>').append($('<div>').addClass('informations-contact-icon-column').append(_iconLink), $('<div>').addClass('informations-contact-text-column').append(_link)));
        }
        else{
          var _iconSocial = Pard.Widgets.IconManager('icon_social').render().addClass('icon-in-box');
          var _iconImg = Pard.Widgets.IconManager(elem['provider']).render();
          _iconImg.addClass('social-icon-fa')
          
          var _iconA = $('<a>').attr({
            href: elem['url'],
            target: '_blank'            
          }).append(_iconImg).addClass('informations-contact-text');
          _socials.append(_iconA);
          _socialIcons = $('<div>').append($('<div>').addClass('informations-contact-icon-column').append(_iconSocial), $('<div>').addClass('informations-contact-text-column').append(_socials))
        }
      });
      
      if (_socialIcons)  _contact.append(_socialIcons); 

    };

    var _city = $('<div>').append(Pard.Widgets.IconManager('city_artist').render().addClass('informations-contact-icon-column'), $('<div>').addClass('informations-contact-text-column').append($('<a>').attr({
      href: 'http://maps.google.com/maps?q='+profile['city']+' '+profile['zip_code'],
      target: '_blank'
      }).text(profile['city']).addClass('informations-contact-text')));

    _contact.append(_city);

    _infoContentBox.append(_bio, _contact);
    _infoBoxContainer.append(_infoContentBox);
    _createdWidget.append(_infoBoxContainer);

    var _callsBoxContainer = Pard.Widgets.SectionBoxContainer('Actividades', Pard.Widgets.IconManager('calls').render()).render();
    var _callsBoxContent = $('<div>').addClass('box-content');

    if('calls' in profile && profile.calls != false){
      var _myArtistCallProposals = Pard.Widgets.MyArtistCallProposals(profile.calls);
      var _callButton = Pard.Widgets.CallButtonArtist('Envía otra propuesta',profile).render().addClass('callButtonArtist-sendOther');
      _callsBoxContent.append(_myArtistCallProposals.render(), _callButton);

    }else{
      var _callButton = Pard.Widgets.CallButtonArtist('Envía una propuesta al conFusión 2016',profile);
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

  ns.Widgets.MyArtistProductionsContent = function(proposal_id){

    var proposal = Pard.ProfileManager.getProposal(proposal_id);
    var _createdWidget = $('<div>');

    var _categoryFields = Pard.Forms.ArtistCall(proposal.category).productionFields();

    var _title = $('<div>').text('titulo: ' + proposal.title);
    var _description = $('<div>').text('descripción: ' + proposal.description);    
    var _shortDescription = $('<div>').text('descripción breve: ' + proposal.short_description);

    var _duration = $('<div>');
    var _children = $('<div>');
    var _multimediaContainer = $('<div>'); 

    if (proposal.duration){
      _duration.text('Duracción: ' + proposal.duration);
    };
    if (proposal.children){
      _children.text('Niños: ' + proposal.children);
    };

    if(proposal.video){
      proposal.video.forEach(function(video){
        _multimediaContainer.append(video);
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
    var _multiMediaManager = Pard.Widgets.MultimediaManager(proposal);

    _createdWidget.append(
      _title, 
      _description, 
      _shortDescription, 
      _duration, 
      _children, 
      _multimediaContainer, 
      _modifyProduction.render(), 
      _multiMediaManager.render()
    );

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


}(Pard || {}));
