'use strict';



(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.SpaceProfileSectionContent = function(profile, sectionContent) {
    
    sectionContent.empty();

  	['name','city', 'address', 'category', 'bio', 'personal_web'].forEach(function(element) {
      sectionContent.append( $('<div>').text(profile[element]));
    });

    if('profile_picture' in profile){
      var _photo = $.cloudinary.image(profile['profile_picture'][0],
        { format: 'jpg', width: 50, height: 50,
          crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
      sectionContent.append(_photo);
    }

    var _modifyProfile = Pard.Widgets.ModifyProfile(profile);
    var _callButton = Pard.Widgets.CallSpaceButton(profile);
    var _mySpaceCallProposals = Pard.Widgets.MySpaceCallProposals(profile.calls);

    sectionContent.append(_modifyProfile.render(), _mySpaceCallProposals.render(), _callButton.render());

    return{
      render: function(){
        return sectionContent;
      }
    }
  }



}(Pard || {}));