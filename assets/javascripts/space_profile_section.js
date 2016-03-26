'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.SpaceProfileSectionContent = function(sectionHeader, sectionContent, profile_id) {

    profile_id = profile_id || Pard.CachedProfiles['my_profiles'][0].profile_id;
    var profile = Pard.ProfileManager.getProfile(profile_id);

    sectionContent.empty();

    var _sectionContent = sectionContent.addClass('grid-element-content');
    
    var _multimediaContainer = $('<div>');

    console.log(profile); 

    if (profile.links){
      var _linksArray = Object.keys(profile['links']).map(function(key){return profile['links'][key]});
      _linksArray.forEach(function(obj){
        var _webTitle = $('<div>').text('Titulo link: ' + obj['web_title']);
        var _link = $('<a>').attr({
          href: obj['link'],
          target: '_blank'
        }).text(obj['link']);
        var _multimediaElement = $('<div>').append(_webTitle, _link); 
        _multimediaContainer.append(_multimediaElement);
      }); 
    };

    if('profile_picture' in profile && profile.profile_picture != null){
      var _photo = $.cloudinary.image(profile['profile_picture'][0],
        { format: 'jpg', width: 50, height: 50,
          crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
      _sectionContent.append(_photo);
    }

    ['category', 'bio'].forEach(function(element) {
      if(profile[element] != null) _sectionContent.append( $('<div>').text(profile[element]));
    });

    var _addressContainer = $('<div>');
    for (var key in profile.address){
      if (profile['address'][key]) _addressContainer.append($('<div>').text(key + ': '+ profile['address'][key]));
    }

    _sectionContent.append(_addressContainer, _multimediaContainer);

    if('photos' in profile && profile.photos != null){
      profile.photos.forEach(function(photo){
        var _photo = $.cloudinary.image(photo,
          { format: 'jpg', width: 50, height: 50,
            crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
        _sectionContent.append(_photo);
      });
    }

    console.log(profile.links);
    if('links' in profile && profile.links != null){
      var _id = profile.links[0].link.split('=').pop();
      var _video = $('<iframe>').attr({'src': 'https://www.youtube.com/embed/' + _id});
      _sectionContent.append(_video);
    }

    var _modifyProfile = Pard.Widgets.ModifyProfile(profile);
    var _callButton = Pard.Widgets.CallSpaceButton(profile);
    var _mySpaceCallProposals = Pard.Widgets.MySpaceCallProposals(profile.calls);

    _sectionContent.append(_modifyProfile.render(), _mySpaceCallProposals.render(), _callButton.render());

    return{
      render: function(){
        return _sectionContent;
      }
    }
  }

}(Pard || {}));
