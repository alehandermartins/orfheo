'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ProfileAside = function (sectionContent) {

    var profiles = Pard.CachedProfiles['my_profiles'];

    var _createdWidget =  $('<div>').addClass('aside-container');
    var _buttonContainer = $('<div>').addClass('toUserPage-btn-container');
    var _toUserPageBtn =  Pard.Widgets.Button('Página de usuario', function(){
      location.href = /users/});
      
    _toUserPageBtn.setClass('toUserPage-btn');
    _buttonContainer.append(_toUserPageBtn.render());

    _createdWidget.append(_buttonContainer, Pard.Widgets.ProfileNav(sectionContent).render());

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ProfileNav = function(sectionContent){
    var _createdWidget = $('<div>');
    var _profileNav = $('<div>');
    var _productionContent = $('<div>');
    var _myOtherProfiles = $('<div>').addClass('profile-nav-container');

    var profiles = Pard.CachedProfiles['my_profiles'];

    var profileNav = function(_profiles, _index){
      _profileNav.empty();
      _myOtherProfiles.empty();
      _productionContent.empty();

      var _reorderedProfiles = Pard.Widgets.ReorderArray(_profiles, _index).render();

      Pard.Widgets.ProfileSection(_reorderedProfiles[0]['type']).render()(sectionContent, _reorderedProfiles[0].profile_id);
      Pard.Widgets.ProductionsNavigation(_reorderedProfiles[0], sectionContent, _productionContent);

      history.pushState({},'',_reorderedProfiles[0].profile_id);
      var _rgb = Pard.Widgets.IconColor((_reorderedProfiles[0]['color'])).rgb();
      var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
      $('#main-profile-page').css({'background': _backColor});
      
      _reorderedProfiles.forEach(function(profile, index) {
        if(!(index)) _profileNav.append(
          Pard.Widgets.ProfilesNavigationSelected(
            profile,function(){
              Pard.Widgets.ProfileSection(profile['type']).render()(sectionContent, _reorderedProfiles[0].profile_id)}).render(), 
          Pard.Widgets.ProductionsNavigation(profile, sectionContent, _productionContent).render()
        )
        else {_myOtherProfiles.append(Pard.Widgets.ProfilesNavigationElement(profile, function(){profileNav(_reorderedProfiles, index)}).render());
        }
      });
      _createdWidget.append(_profileNav, _myOtherProfiles);

    }

    $(document).ready(function(){
      var _rgb = Pard.Widgets.IconColor((profiles[0]['color'])).rgb();
      var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
      $('#main-profile-page').css({'background': _backColor});
      });

    profiles.forEach(function(profile, index) {
      if(!(index)) _profileNav.append(Pard.Widgets.ProfilesNavigationSelected(profile, function(){Pard.Widgets.ProfileSection(profile['type']).render()(profiles, sectionContent)}).render(), Pard.Widgets.ProductionsNavigation(profile, sectionContent, _productionContent).render());
      else {_myOtherProfiles.append(Pard.Widgets.ProfilesNavigationElement(profile, function(){profileNav(profiles, index)}).render());
      }
    });

    _createdWidget.append(_profileNav, _myOtherProfiles);

    return {
      render: function() {
        return _createdWidget;
      }
    }
  }

 
  ns.Widgets.ProfilesNavigationSelected = function(profile, callback){
    var _createdWidget = $('<div>').addClass('profile-selected-container');
    var _profileCircle = $('<div>').addClass('profile-nav-circle-selected').css({'background-color': profile['color']});
    _profileCircle.click(function(){callback()});
    var _name = $('<h6>').addClass('profile-nav-name-selected').text(profile['name']);
    var _icon = $('<div>').addClass('profile-nav-element-icon').html('P');
    var _colorIcon = Pard.Widgets.IconColor(profile.color).render();
    _icon.css({color: _colorIcon}); 
    
    _createdWidget.append(_profileCircle.append(_icon), _name)

    return {
      render: function() {
        return _createdWidget;
      }
    } 
  }



  ns.Widgets.ProfilesNavigationElement = function(profile, callback){
    var _createdWidget = $('<div>').addClass('profile-nav-element-container');
    var _profileCircle = $('<div>').addClass('profile-nav-circle').css({'background-color': profile['color']});
    _profileCircle.click(function(){callback()});
    var _name = $('<p>').addClass('profile-nav-element-name').text(profile['name']);
    var _icon = $('<div>').addClass('profile-nav-element-icon').html('P');
    var _colorIcon = Pard.Widgets.IconColor(profile.color).render();
    _icon.css({color: _colorIcon}); 
    
    _createdWidget.append(_profileCircle.append(_icon), _name)

    return {
      render: function() {
        return _createdWidget;
      }
    } 
  }


  ns.Widgets.ProductionsNavigation = function(profile, sectionContent, productionContent){

    productionContent.empty();

    var _proposals = [];
    if (profile.proposals) _proposals = profile.proposals;
    _proposals.forEach(function(proposal, index) {
    	 productionContent.append($('<div>').append($('<a>').text(proposal['title']).click(function(){Pard.Widgets.ArtistProductionSectionContent(proposal.proposal_id, sectionContent)})));
    });

    return {
      render: function() {
        return  productionContent;
      }
    }
  }


  ns.Widgets.ProfileSection = function(type) {

    var profiles_map = {
      artist: Pard.Widgets.ArtistProfileSectionContent,
      space: Pard.Widgets.SpaceProfileSectionContent
    }

    return {
      render: function( ){
        return profiles_map[type];
      }
    }
  }


  ns.Widgets.ArtistProfileSectionContent = function(sectionContent, profile_id) {

    profile_id = profile_id || Pard.CachedProfiles['my_profiles'][0].profile_id;
    var profile = Pard.ProfileManager.getProfile(profile_id);

    sectionContent.empty();

    var _sectionContent = sectionContent.addClass('grid-element-content');

     if('profile_picture' in profile && profile.profile_picture != null){
      var _photo = $.cloudinary.image(profile['profile_picture'][0],
        { format: 'jpg', width: 50, height: 50,
          crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
      _sectionContent.append(_photo);
    }

  	['name','city', 'bio', 'personal_web'].forEach(function(element) {
      if(profile[element] != null) _sectionContent.append( $('<div>').text(profile[element]));
    });

    var _modifyProfile = Pard.Widgets.ModifyProfile(profile);
    var _callButton = Pard.Widgets.CallButtonArtist(profile);
    var _myArtistCallProposals = Pard.Widgets.MyArtistCallProposals(profile.calls);

    _sectionContent.append(_modifyProfile.render(), _myArtistCallProposals.render(), _callButton.render());

    return{
      render: function(){
        return _sectionContent;
      }
    }
  }

  ns.Widgets.SpaceProfileSectionContent = function(sectionContent, profile_id) {

    profile_id = profile_id || Pard.CachedProfiles['my_profiles'][0].profile_id;
    var profile = Pard.ProfileManager.getProfile(profile_id);

    sectionContent.empty();

    var _sectionContent = sectionContent.addClass('grid-element-content');

    if('profile_picture' in profile && profile.profile_picture != null){
      var _photo = $.cloudinary.image(profile['profile_picture'][0],
        { format: 'jpg', width: 50, height: 50,
          crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
      _sectionContent.append(_photo);
    }

    ['name','city', 'address', 'category', 'bio', 'personal_web'].forEach(function(element) {
      if(profile[element] != null) _sectionContent.append( $('<div>').text(profile[element]));
    });

    if('photos' in profile && profile.photos != null){
      profile.photos.forEach(function(photo){
        var _photo = $.cloudinary.image(photo,
          { format: 'jpg', width: 50, height: 50,
            crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
        _sectionContent.append(_photo);
      });
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


  ns.Widgets.ArtistProductionSectionContent = function(proposal_id, sectionContent) {

    sectionContent.empty();
    sectionContent.append(Pard.Widgets.MyArtistProductionsContent(proposal_id).render(), Pard.Widgets.ModifyProduction(proposal_id, sectionContent).render());

    // return{
    //   render: function(){
    //     return sectionContent;
    //   }
    // }
  }



}(Pard || {}));
