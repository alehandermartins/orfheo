'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.SpaceSection = function(sectionHeader, sectionContent, profile_id) {
    profile_id = profile_id || Pard.CachedProfiles['my_profiles'][0].profile_id;
    var profile = Pard.ProfileManager.getProfile(profile_id);

    Pard.Widgets.ProfileSectionHeader(sectionHeader, profile);
  }

  ns.Widgets.SpaceSectionContent = function(profile) {  

    var _createdWidget = $('<div>');
    var _multimediaContainer = $('<div>');

    ['category', 'bio'].forEach(function(element) {
      if(profile[element] != null) _createdWidget.append( $('<div>').text(profile[element]));
    });

    var _addressContainer = $('<div>');
    for (var key in profile.address){
      if (profile['address'][key]) _addressContainer.append($('<div>').text(key + ': '+ profile['address'][key]));
    }

    if(profile.video){
      profile.video.forEach(function(video){
        _multimediaContainer.append(video);
      });
    }

    if(profile.image){
      profile.image.forEach(function(image){
        _multimediaContainer.append(image);
      });
    }

    if(profile.audio){
      profile.audio.forEach(function(audio){
        _multimediaContainer.append(audio);
      });
    }

    _createdWidget.append(_addressContainer, _multimediaContainer);

    var _modifyProfile = Pard.Widgets.ModifyProfile(profile);
    var _callButton = Pard.Widgets.CallSpaceButton(profile);
    var _mySpaceCallProposals = Pard.Widgets.MySpaceCallProposals(profile.calls);
    var _multiMediaManager = Pard.Widgets.MultimediaSpaceManager(profile);

    _createdWidget.append(
      _modifyProfile.render(),
      _mySpaceCallProposals.render(), 
      _callButton.render(),
      _multiMediaManager.render()
    );

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

}(Pard || {}));

