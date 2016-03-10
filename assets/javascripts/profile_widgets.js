'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ProfileAside = function (profiles, sectionContent) {

    var _createdWidget =  $('<div>').addClass('aside-container');
    var _buttonContainer = $('<div>');
    var _toUserPageBtn =  Pard.Widgets.ToUserPage().render();
    var _profilesNavigation = $('<div>');
    var _myproductions = $('<div>');
    var _myproductionContent = $('<div>');
    
    _toUserPageBtn.addClass('toUserPage-btn');
    _buttonContainer.append(_toUserPageBtn); 

    _profilesNavigation.append(Pard.Widgets.ProfilesNavigation(profiles, sectionContent, _myproductionContent).render());

    _myproductions.append(Pard.Widgets.ProductionsNavigation(profiles[0], sectionContent, _myproductionContent).render())
    
    _createdWidget.append(_buttonContainer, _profilesNavigation, _myproductions);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ProfilesNavigation = function(profiles, sectionContent, productionContent){
    var _createdWidget = $('<div>');
 
    var profileNavList = function(_profiles, _index){
    	_createdWidget.empty();

    	Pard.Widgets.ProfileSection(_profiles[_index]['type']).render()(Pard.Widgets.ReorderArray(_profiles,_index).render(), sectionContent);
    	Pard.Widgets.ProductionsNavigation(_profiles[_index], sectionContent, productionContent);

      var _profiles = Pard.Widgets.ReorderArray(_profiles, _index).render();

    	_profiles.forEach(function(profile, index) {
    		if(!(index)) _createdWidget.append($('<div>').append($('<a>').text(profile.name)).click(function(){
    				Pard.Widgets.ProfileSection(profile['type']).render()(_profiles, sectionContent)
    				Pard.Widgets.ProductionsNavigation(profile, sectionContent, productionContent);
    			}));
	    	else {_createdWidget.prepend(Pard.Widgets.Button(profile.name, function(){profileNavList(_profiles, index)}).render());
	    	}
	    });
    }

    profiles.forEach(function(profile, index) {
    	if(!(index)) _createdWidget.append($('<div>').append($('<a>').text(profile.name).click(function(){Pard.Widgets.ProfileSection(profile['type']).render()(profiles, sectionContent)})))	;
    	else {_createdWidget.prepend(Pard.Widgets.Button(profile.name, function(){profileNavList(profiles, index)}).render());
    	}
    });

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
    	 productionContent.append($('<div>').append($('<a>').text(proposal['title']).click(function(){Pard.Widgets.ArtistProductionSectionContent(proposal, sectionContent)})));
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
        console.log(profiles_map[type])
        return profiles_map[type];
      }
    }
  }


  ns.Widgets.ArtistProfileSectionContent = function(profiles, sectionContent) {
    

    var profile = profiles[0];

    sectionContent.empty();

    var _sectionContent = sectionContent.addClass('grid-element-content');

  	['name','city', 'bio', 'personal_web'].forEach(function(element) {
      _sectionContent.append( $('<div>').text(profile[element]));
    });

    if('profile_picture' in profile){
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

  ns.Widgets.SpaceProfileSectionContent = function(profiles, sectionContent) {
    
    console.log('SpaceProfileSectionContent');

    var profile = profiles[0];

    sectionContent.empty();

    var _sectionContent = sectionContent.addClass('grid-element-content');

    ['name','city', 'address', 'category', 'bio', 'personal_web'].forEach(function(element) {
      _sectionContent.append( $('<div>').text(profile[element]));
    });

    if('profile_picture' in profile){
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


  ns.Widgets.ArtistProductionSectionContent = function(proposal, sectionContent) {
    
    sectionContent.empty();

    sectionContent.append(Pard.Widgets.MyArtistProductionsContent(proposal).render());

    // return{
    //   render: function(){
    //     return sectionContent;
    //   }
    // }
  }


  
}(Pard || {}));