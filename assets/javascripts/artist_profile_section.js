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

    ['bio', 'personal_web'].forEach(function(element) {
      if(profile[element] != null) _createdWidget.append( $('<div>').text(profile[element]));
    });

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

    // {'border-top:': '65px solid white'}

    _createdWidget.append(_triangle.css({'border-top': '70px solid'+profile['color']}),_modifyProfile.render().css({color: _iconColor}), _myArtistCallProposals.render(), _callButton.render());
    $(document).ready(function(){if (!(profile.proposals)) _callButton.render().trigger('click')});

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
