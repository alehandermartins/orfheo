'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ProfileAside = function (sectionContent) {

    var profiles = Pard.CachedProfiles['my_profiles'];

    var _createdWidget =  $('<div>').addClass('aside-container');
    var _buttonContainer = $('<div>').addClass('toUserPage-btn-container');
    var _toUserPageBtn =  Pard.Widgets.Button('Página de usuario', function(){
      location.href = /users/});
    var _profilesNavigation = $('<div>').addClass('profile-nav-container');
    var _myproductions = $('<div>');
    var _myproductionContent = $('<div>');

    _toUserPageBtn.setClass('toUserPage-btn');
    _buttonContainer.append(_toUserPageBtn.render());

    _profilesNavigation.append(Pard.Widgets.ProfilesNavigation(sectionContent, _myproductionContent).render());

    _myproductions.append(Pard.Widgets.ProductionsNavigation(profiles[0], sectionContent, _myproductionContent).render())

    _createdWidget.append(_buttonContainer, _profilesNavigation, _myproductions);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ProfilesNavigation = function(sectionContent, productionContent){
    var _createdWidget = $('<div>');
    var profiles = Pard.CachedProfiles['my_profiles'];

    var profileNavList = function(_profiles, _index){
    	_createdWidget.empty();

      var _reorderedProfiles = Pard.Widgets.ReorderArray(_profiles, _index).render();

    	Pard.Widgets.ProfileSection(_reorderedProfiles[0]['type']).render()(sectionContent, _reorderedProfiles[0].profile_id);
    	Pard.Widgets.ProductionsNavigation(_reorderedProfiles[0], sectionContent, productionContent);

      history.pushState({},'',_reorderedProfiles[0].profile_id);
      var _rgb = Pard.Widgets.IconColor((_reorderedProfiles[0]['color'])).rgb();
      var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.3+')';
      $('#main-profile-page').css({'background': _backColor});
      
    	_reorderedProfiles.forEach(function(profile, index) {
    		if(!(index)) _createdWidget.append(
        Pard.Widgets.ProfilesNavigationSelected(
          profile,function(){
            Pard.Widgets.ProfileSection(profile['type']).render()(sectionContent, _reorderedProfiles[0].profile_id)
    				Pard.Widgets.ProductionsNavigation(profile, sectionContent, productionContent);
    			}
        ).render());
	    	else {_createdWidget.prepend(Pard.Widgets.ProfilesNavigationElement(profile, function(){profileNavList(_reorderedProfiles, index)}).render());
	    	}
	    });
    }

    $(document).ready(function(){
      var _rgb = Pard.Widgets.IconColor((profiles[0]['color'])).rgb();
      var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.3+')';
      $('#main-profile-page').css({'background': _backColor});
      });

    console.log(profiles);

    profiles.forEach(function(profile, index) {
    	if(!(index)) _createdWidget.append(Pard.Widgets.ProfilesNavigationSelected(profile, function(){Pard.Widgets.ProfileSection(profile['type']).render()(profiles, sectionContent)}).render())	;
    	else {_createdWidget.prepend(Pard.Widgets.ProfilesNavigationElement(profile, function(){profileNavList(profiles, index)}).render());
    	}
    });

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

  	['name','city', 'bio', 'personal_web'].forEach(function(element) {
      _sectionContent.append( $('<div>').text(profile[element]));
    });

    if('profile_picture' in profile && profile.profile_picture != null){
      var _photo = $.cloudinary.image(profile['profile_picture'][0],
        { format: 'jpg', width: 50, height: 50,
          crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
      _sectionContent.append(_photo);
    }

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

    ['name','city', 'address', 'category', 'bio', 'personal_web'].forEach(function(element) {
      _sectionContent.append( $('<div>').text(profile[element]));
    });

    if('profile_picture' in profile && profile.profile_picture != null){
      var _photo = $.cloudinary.image(profile['profile_picture'][0],
        { format: 'jpg', width: 50, height: 50,
          crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
      _sectionContent.append(_photo);
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
