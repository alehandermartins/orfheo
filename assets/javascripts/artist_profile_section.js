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

    if(profile['bio'] != null){
      var _boxContainer = Pard.Widgets.SectionBoxContainer('Informaciones', Pard.Widgets.IconManager('informaciones').render()).render();
      var _contentBox = $('<div>').addClass('box-content');
      var _bio = $('<div>').addClass('informations-bio').text(profile['bio']);
      var _contact = $('<div>').addClass('informations-contact');
      var _city = $('<div>').append(Pard.Widgets.IconManager('city_artist').render().addClass('icon-in-box'), $('<span>').text(profile['city']));

      if(profile['personal_web'] != null){
        
        var _webArray = Object.keys(profile['personal_web']).map(function(key){return profile['personal_web'][key]});
        var _iconSocial;
       
        _webArray.forEach(function(elem){
          if (elem['provider'] == 'my_web'){
            var _iconLink = Pard.Widgets.IconManager('my_web').render().addClass('icon-in-box');
            var _url = elem['url'];
            var _link = $('<a>').attr({
              href: elem['url'],
              target: '_blanck'            
            });
            ['http://', 'https://', 'www.'].forEach(function(string){
              if(_url.indexOf(string) > -1) {
                console.log(_url.indexOf(string));
                _url  = _url.substring(string.length);
              }
            })
            _link.text(_url);
            _contact.append($('<div>').append(_iconLink, _link));
          }
          else{
            var _iconSocial = Pard.Widgets.IconManager('icon_social').render().addClass('icon-in-box');
            var _iconImg = Pard.Widgets.IconManager(elem['provider']).render();
            var _url = elem['url'];
            var _iconLink = $('<a>').attr({
              href: elem['url'],
              target: '_blanck'            
            }).append(_iconImg).addClass('icon-social-in-box');
            _iconSocial.append(_iconLink);
          }
        });
        
        if (_iconSocial)  _contact.append(_iconSocial); 

      };

      _contact.append(_city);

      _contentBox.append(_bio, _contact);
      _boxContainer.append(_contentBox);
      _createdWidget.append(_boxContainer);
    
    }

    var personalWebs;

    // if(profile['personal_web'] != null){
    //   var _boxContainer = Pard.Widgets.SectionBoxContainer('Informaciones').render();
    //   _createdWidget.append(profile[element]);
    // }

    if('personal_web' in profile && profile.personal_web != null){
      var _personal_webs = []
      Object.keys(profile.personal_web).forEach(function(key){
        _personal_webs.push(profile.personal_web[key]);
      });
      _personal_webs.forEach(function(web){
        console.log(web);
      });
    }

    var _modifyProfile = Pard.Widgets.ModifyProfile(profile);
    var _callButton = Pard.Widgets.CallButtonArtist(profile);
    var _myArtistCallProposals = Pard.Widgets.MyArtistCallProposals(profile.calls);

    var _iconColor = Pard.Widgets.IconColor((profile['color'])).render();

    var _triangle = $('<div>').addClass('modify-section-content-button-container');

     _createdWidget.append(
      _triangle.css({'border-top': '70px solid'+profile['color']}),
      _modifyProfile.render().css({color: _iconColor}), 
      _myArtistCallProposals.render(), 
      _callButton.render()
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
