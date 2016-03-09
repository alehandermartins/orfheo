'use strict';



(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ArtistProfileMain = function(profiles){
  	var _createdWidget = $('<div>').append(Pard.Widgets.ArtistMainLargeScreen(profiles).render(), Pard.Widgets.ArtistMainMediumSmallScreen(profiles).render());

  	return{
      render: function(){
        return _createdWidget;
      }
    }

  }

  ns.Widgets.ArtistMainLargeScreen= function(profiles){
    var _createdWidget = $('<main>').addClass('pard-grid displayNone-for-mediumDown');   
    var _gridSpacing = $('<div>').addClass('grid-spacing');
    var _section = $('<section>').addClass('grid-section');
    var _sectionContent = $('<div>').addClass('profile-section-content');

    var _aside = Pard.Widgets.ArtistProfileAside(profiles, _sectionContent);

    _section.append(Pard.Widgets.ArtistProfileSectionContent(profiles[0], _sectionContent).render());

    _createdWidget.append(_aside.render(), _gridSpacing, _section);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ArtistMainMediumSmallScreen = function(profiles){
  	var _createdWidget = $('<main>').addClass('pard-grid displayNone-for-large');
    
    var _offCanvasWrapper = $('<div>').addClass('off-canvas-wrapper');
    var _offCanvasInner = $('<div>').addClass('off-canvas-wrapper-inner').attr({'data-off-canvas-wrapper': ''});

    var _offCanvasAside = $('<div>').addClass('off-canvas-grid-aside position-left-grid-aside').attr({id: 'offCanvas-navBar', 'data-off-canvas': ''});

    var _offCanvasSection = $('<div>').addClass('off-canvas-content').attr({'data-off-canvas-content': ''});

    // var _aside = Pard.Widgets.ArtistProfileAside(myprofiles);

    // var _section = Pard.Widgets.ArtistProfileSection(profiles);

    // _offCanvasAside.append(_aside.render());
    // _offCanvasSection.append(_section.render());
     
    // _offCanvasInner.append(_offCanvasAside, _offCanvasSection);
    // _offCanvasWrapper.append(_offCanvasInner);

    // _createdWidget.append(_offCanvasWrapper);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.ArtistProfileAside = function (profiles, sectionContent) {
    var _createdWidget = $('<nav>').addClass('grid-aside');
    var _asideContent = $('<div>').addClass('aside-container');
    var _buttonContainer = $('<div>');
    var _toUserPageBtn =  Pard.Widgets.ToUserPage().render();
    var _profilesNavigation = $('<div>');
    var _myproductions = $('<div>');
    var _myproductionContent = $('<div>');
    
    _toUserPageBtn.addClass('toUserPage-btn');
    _buttonContainer.append(_toUserPageBtn); 

    _profilesNavigation.append(Pard.Widgets.ProfilesNavigation(profiles, sectionContent, _myproductionContent).render());

    _myproductions.append(Pard.Widgets.ProductionsNavigation(profiles[0], sectionContent, _myproductionContent).render())
    
    _asideContent.append(_buttonContainer, _profilesNavigation, _myproductions);

    _createdWidget.append(_asideContent);

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

    	Pard.Widgets.ArtistProfileSectionContent(_profiles[_index], sectionContent);
    	Pard.Widgets.ProductionsNavigation(_profiles[_index], sectionContent, productionContent);

    	var _part = _profiles.slice(_index);

    	var _rest = _profiles.slice(0, _index);
    	_profiles = _part.concat(_rest);
    	_profiles.forEach(function(profile, index) {
    		if(index === 0) _createdWidget.append($('<div>').append($('<a>').text(profile.name)).click(function(){
    				Pard.Widgets.ArtistProfileSectionContent(_profiles[_index], sectionContent)
    				Pard.Widgets.ProductionsNavigation(_profiles[_index], sectionContent, productionContent);
    			}));
	    	else {_createdWidget.append(Pard.Widgets.Button(profile.name, function(){profileNavList(_profiles, index)}).render());
	    	}
	    });
    }

    profiles.forEach(function(profile, index) {
    	if(index === 0) _createdWidget.append($('<div>').append($('<a>').text(profile.name).click(function(){Pard.Widgets.ArtistProfileSectionContent(profiles[index], sectionContent)})))	;
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


  ns.Widgets.ArtistProfileSectionContent = function(profile, sectionContent) {
    
    sectionContent.empty();

  	['name','city', 'bio', 'personal_web'].forEach(function(element) {
      sectionContent.append( $('<div>').text(profile[element]));
    });

    if('profile_picture' in profile){
      var _photo = $.cloudinary.image(profile['profile_picture'][0],
        { format: 'jpg', width: 50, height: 50,
          crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
      sectionContent.append(_photo);
    }

    var _modifyProfile = Pard.Widgets.ModifyProfile(profile);
    var _callButton = Pard.Widgets.CallButtonArtist(profile);
    var _myArtistCallProposals = Pard.Widgets.MyArtistCallProposals(profile.calls);

    sectionContent.append(_modifyProfile.render(), _myArtistCallProposals.render(), _callButton.render());

    return{
      render: function(){
        return sectionContent;
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