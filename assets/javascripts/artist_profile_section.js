'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ProfileSectionHeader = function(sectionHeader, profile){
    sectionHeader.empty();

    var _photoContainer = $('<div>').addClass('section-profilePhoto-container');

    if('profile_image' in profile && profile['profile_image'] != null){
      _photoContainer.append(profile['profile_image']);
    }
    else _photoContainer.css({'background-color': profile.color});

    sectionHeader.append(_photoContainer);

    ['name','city'].forEach(function(element) {
      if(profile[element] != null) sectionHeader.append( $('<div>').text(profile[element]));
    });

    

    $(document).ready(function(){if (!(profile.proposals)) _callButton.render().trigger('click')});
  
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

    var _modifyProfile = Pard.Widgets.ModifyProfile(profile);
    var _callButton = Pard.Widgets.CallButtonArtist(profile);
    var _myArtistCallProposals = Pard.Widgets.MyArtistCallProposals(profile.calls);

    _createdWidget.append(_modifyProfile.render(), _myArtistCallProposals.render(), _callButton.render());
  
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

    if (proposal.photos){
      if('photos' in proposal && proposal.photos != null){
        proposal.photos.forEach(function(photo){
          var _photo = $.cloudinary.image(photo,
            { format: 'jpg', width: 50, height: 50,
              crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
          _createdWidget.append(_photo);
        });
      }
    }
    _createdWidget.append(_title, _description, _shortDescription, _duration, _children, _multimediaContainer);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


}(Pard || {}));
