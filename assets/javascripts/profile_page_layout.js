'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ProfileMainLayout = function(profiles){

    var _main = $('<main>');

    var _offCanvasWrapper = $('<div>').addClass('off-canvas-wrapper');
    var _offCanvasInner = $('<div>').addClass('off-canvas-wrapper-inner').attr({'data-off-canvas-wrapper': ''});
    var _offCanvasAside = $('<div>').addClass('off-canvas-grid-aside position-left-grid-aside').attr({id: 'offCanvas-navBar', 'data-off-canvas': ''});

    var _offCanvasSection = $('<div>').addClass('off-canvas-content').attr({'data-off-canvas-content': ''});

    var _mainLarge = $('<section>').addClass('pard-grid');
    var _gridSpacing = $('<div>').addClass('grid-spacing');

    var _aside = $('<nav>').addClass('grid-aside');
    var _asideContent = $('<div>');
    var _section = $('<section>').addClass('grid-section');
    var _sectionContainer = $('<div>').addClass('section-content');
    var _sectionContent = $('<div>').attr('id','_sectionContent');
    var _sectionHeader = $('<div>');

    Pard.Widgets.ProfileSection(profiles[0]['type']).render()(_sectionHeader, _sectionContent);
    Pard.Widgets.ProfileAside(_sectionHeader, _sectionContent, _asideContent);

    _offCanvasSection.append(_sectionContainer.append(_sectionHeader, _sectionContent));

    _offCanvasAside.append(_asideContent);

    _aside.append(_offCanvasAside);
    _section.append(_offCanvasSection);
    _offCanvasInner.append(_aside, _gridSpacing, _section);

    _mainLarge.append(_offCanvasWrapper.append(_offCanvasInner));
    _main.append(_mainLarge);

    return {
      render: function(){
        return _main;
      }
    }
  }


  ns.Widgets.ProfileAside = function (sectionHeader, sectionContent, asideContent) {

    var profiles = Pard.CachedProfiles['my_profiles'];

    asideContent.addClass('aside-container');
    var _buttonContainer = $('<div>').addClass('toUserPage-btn-container');
    var _toUserPageBtn = Pard.Widgets.Button('Página de usuario', function(){
      location.href = /users/});
      
    _toUserPageBtn.setClass('toUserPage-btn');
    _buttonContainer.append(_toUserPageBtn.render());

    var _asideNavContent  = $('<div>');;

    asideContent.append(_buttonContainer, Pard.Widgets.ProfileAsideBar(sectionHeader, sectionContent, _asideNavContent).render());
    
    // console.log(asideContent.html());

    // return{
    //   render: function(){
    //     return _createdWidget;
    //   }
    // }
  }

  ns.Widgets.ProfileAsideBar = function(sectionHeader, sectionContent, asideNavContent){

    asideNavContent.empty();
    var profiles = Pard.CachedProfiles['my_profiles'];

    ProfileNav = function(_profiles, _index, sectionHeader, sectionContent){

      asideNavContent.empty();
      
      var _profileNav = $('<div>').addClass('profile-nav-container').attr('id','_profileNav');
      var _myOtherProfiles = $('<div>').addClass('other-profiles-nav-container');
      var _productionContent = $('<div>').attr('id','_productionsContent');
  
      var _reorderedProfiles = Pard.Widgets.ReorderArray(_profiles, _index).render();

      history.pushState({},'',_reorderedProfiles[0].profile_id);
      var _rgb = Pard.Widgets.IconColor((_reorderedProfiles[0]['color'])).rgb();
      var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
      $('#main-profile-page').css({'background': _backColor});
      
      _reorderedProfiles.forEach(function(profile, index) {
        if(!(index)){ 
          Pard.Widgets.ProductionsNavigation(profile.profile_id, _profileNav, sectionContent,_productionContent);
          
        }
        else { _myOtherProfiles.append(Pard.Widgets.ProfilesNavigationElement(profile, function(){
            Pard.Widgets.ProfileAsideBar(sectionHeader, sectionContent, asideNavContent);
            Pard.Widgets.ProfileSection(profile['type']).render()(sectionHeader, sectionContent, profile.profile_id);
              ProfileNav(_reorderedProfiles, index,sectionHeader, sectionContent);
          }).render());
        }
      });
      asideNavContent.append(_profileNav, _myOtherProfiles);
    }

    ProfileNav(profiles,0,sectionHeader, sectionContent);

    return {
      render: function() {
        return asideNavContent;
      }
    }
  }

  ns.Widgets.ProfilesNavigationSelected = function(profile, callback){

    var _createdWidget = $('<div>').addClass('profile-selected-container');
    var _circleColumn = $('<div>').addClass('icon-column');

    var _profileCircle = $('<div>').addClass('profile-nav-circle-selected').css({'background-color': profile['color']});
    var _nameColumn = $('<div>').addClass('name-column profile-name-column');
    var _name = $('<p>').addClass('profile-nav-name-selected selected-element').text(profile['name']);
    
    _createdWidget.hover(function(){_name.addClass('text-link')},function(){_name.removeClass('text-link')});

    // _name.hover(function(){$(this).addClass('text-link')},function(){$(this).removeClass('text-link')});
    // _profileCircle.hover(function(){_name.addClass('text-link')},function(){_name.removeClass('text-link')});
    // _name.click(function(){_profileCircle.trigger('click')});
    _createdWidget.click(function(){
      $('.selected-element').removeClass('selected-element');
      _name.addClass('selected-element');
      callback();      
    });

    var _icon = $('<div>').addClass('profile-nav-element-icon').append(Pard.Widgets.IconManager(profile['type']).render());
    var _colorIcon = Pard.Widgets.IconColor(profile.color).render();
    _icon.css({color: _colorIcon}); 

    _circleColumn.append($('<div>').addClass('nav-icon-production-container').append(_profileCircle.append(_icon)));
    _nameColumn.append(Pard.Widgets.FitInBox(_name,125,54).render());

    _createdWidget.append(_circleColumn, _nameColumn);

    return {
      render: function() {
        return _createdWidget;
      }
    } 
  }

  ns.Widgets.ProfilesNavigationElement = function(profile, callback){
    var _createdWidget = $('<div>').addClass('nav-list-container');
    var _profileCircle = $('<div>').addClass('profile-nav-circle').css({'background-color': profile['color']});
    var _circleColumn = $('<div>').addClass('icon-column');
    var _nameColumn = $('<div>').addClass('name-column profile-name-column');
    var _name = $('<p>').addClass('profile-nav-name-element').text(profile['name']);
    var _elementContainer = $('<div>').addClass('profile-nav-element-container');
    _elementContainer.hover(function(){_name.addClass('text-link')},function(){_name.removeClass('text-link')});
    _profileCircle.hover(function(){_name.addClass('text-link')},function(){_name.removeClass('text-link')});
    _elementContainer.click(function(){_profileCircle.trigger('click')});
    _profileCircle.click(function(){
      $('.selected-element').removeClass('selected-element');
      _name.addClass('selected-element');
      callback();      
    });
    var _icon = $('<div>').addClass('profile-nav-element-icon').append(Pard.Widgets.IconManager(profile['type']).render());
    var _colorIcon = Pard.Widgets.IconColor(profile.color).render();
    _icon.css({color: _colorIcon}); 
    _circleColumn.append($('<div>').addClass('nav-icon-production-container').append(_profileCircle.append(_icon)));
    _nameColumn.append(Pard.Widgets.FitInBox(_name,125,54).render());
    _createdWidget.append(_elementContainer.append(_circleColumn, _nameColumn));

    return {
      render: function() {
        return _createdWidget;
      }
    } 
  }

  ns.Widgets.ProductionsNavigation = function(profile_id, profileNav, sectionContent, productionContent, selected){

    var profile = Pard.ProfileManager.getProfile(profile_id);
    profileNav.empty();
    sectionContent.empty();
    productionContent.empty();

    var _lastselected = $('<div>');

    var _profileSection = Pard.Widgets.ProfileSectionContent(profile['type']).render()(profile).render();
    if(!selected && !(profile.proposals)){
      var _callButton = Pard.Widgets.CallSpaceButton(profile);
      $(document).ready(function(){_callButton.render().trigger('click')});
    }
    _lastselected = _profileSection;
    sectionContent.append(_profileSection);

    var _navigationSelected = Pard.Widgets.ProfilesNavigationSelected(profile, function(){
      _lastselected.hide();
      _lastselected = _profileSection;
      _profileSection.show();
    });

    profileNav.append(_navigationSelected.render());

    var _proposals = [];

    (profile.proposals) ? productionContent.addClass('nav-list-container') : productionContent.removeClass('nav-list-container');
    if (profile.proposals) _proposals = profile.proposals;
    _proposals.forEach(function(proposal, index){
      var proposal_id = proposal.proposal_id;
      var _myProposal = $('<div>'); 
      _myProposal.append(Pard.Widgets.MyArtistProductionsContent(proposal_id).render());
      sectionContent.append(_myProposal);
      if(selected == proposal_id) _lastselected = _myProposal;
      else{_myProposal.hide();}

      var _productionItem = $('<div>').addClass('production-nav-element-container');
      var _iconColumn = $('<div>').addClass(' icon-column').append($('<div>').addClass('nav-icon-production-container').append($('<div>').addClass('verticalAlign').append(Pard.Widgets.IconManager(proposal['category']).render().css({'text-align': 'center', display:'block'}))));
      var _nameColumn = $('<div>').addClass('name-column');
      var _name = $('<p>').text(proposal['title']).addClass('profile-nav-production-name');
      _productionItem.append(_iconColumn, _nameColumn.append(Pard.Widgets.FitInBox(_name,125,54).render()));
      _name.click(function(){ 
        $('.selected-element').removeClass('selected-element');
        _name.addClass('selected-element');
        _lastselected.hide();
        _myProposal.show();
        _lastselected = _myProposal;
      });
      _name.hover(function(){_name.addClass('text-link')}, function(){_name.removeClass('text-link ')});
      productionContent.append(_productionItem);
    });

    profileNav.append(productionContent);

    return {
      render: function() {
        return  productionContent;
      }
    }
  }


  ns.Widgets.ProfileSection = function(type) {

    var profiles_map = {
      artist: Pard.Widgets.ArtistSection,
      space: Pard.Widgets.SpaceSection
    }

    return {
      render: function( ){
        return profiles_map[type];
      }
    }
  }

  ns.Widgets.ProfileSectionContent = function(type) {

    var profiles_map = {
      artist: Pard.Widgets.ArtistSectionContent,
      space: Pard.Widgets.SpaceSectionContent
    }

    return {
      render: function( ){
        return profiles_map[type];
      }
    }
  }



}(Pard || {}));