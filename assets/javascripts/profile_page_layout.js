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

    _createdWidget.append(_buttonContainer, Pard.Widgets.ProfileAsideBar(sectionContent).render());

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ProfileAsideBar = function(sectionContent){

    var _profileNavContent = $('<div>');
    
    var profiles = Pard.CachedProfiles['my_profiles'];

    ProfileNav = function(_profiles, _index, sectionContent){
      _profileNavContent.empty();
      
      var _profileNav = $('<div>').addClass('profile-nav-container');
      var _myOtherProfiles = $('<div>').addClass('other-profiles-nav-container');
      var _productionContent = $('<div>').attr('id','_productionsContent');
  
      var _reorderedProfiles = Pard.Widgets.ReorderArray(_profiles, _index).render();

      history.pushState({},'',_reorderedProfiles[0].profile_id);
      var _rgb = Pard.Widgets.IconColor((_reorderedProfiles[0]['color'])).rgb();
      var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
      $('#main-profile-page').css({'background': _backColor});
      
      _reorderedProfiles.forEach(function(profile, index) {
        if(!(index)){ 
          Pard.Widgets.ProductionsNavigation(profile, sectionContent,_productionContent);
          _profileNav.append(
          Pard.Widgets.ProfilesNavigationSelected(
            profile,function(){
              Pard.Widgets.ProfileSection(profile['type']).render()(sectionContent, profile.profile_id)
            }).render(), _productionContent);
        }
        else { _myOtherProfiles.append(Pard.Widgets.ProfilesNavigationElement(profile, function(){
            Pard.Widgets.ProfileSection(profile['type']).render()(sectionContent, profile.profile_id);
              ProfileNav(_reorderedProfiles, index, sectionContent);
          }).render());
        }
      });
      _profileNavContent.append(_profileNav, _myOtherProfiles);
    }

    ProfileNav(profiles,0,sectionContent);

    return {
      render: function() {
        return _profileNavContent;
      }
    }
  }


   
 
  ns.Widgets.ProfilesNavigationSelected = function(profile, callback){
    var _createdWidget = $('<div>').addClass('profile-selected-container');
    var _profileCircle = $('<div>').addClass('profile-nav-circle-selected').css({'background-color': profile['color']});
    var _name = $('<h6>').addClass('profile-nav-name-selected selected-element').text(profile['name']);
    _name.hover(function(){$(this).addClass('text-link')},function(){$(this).removeClass('text-link')});
    _profileCircle.hover(function(){_name.addClass('text-link')},function(){_name.removeClass('text-link')});
    _name.click(function(){_profileCircle.trigger('click')});
    _profileCircle.click(function(){
      $('.selected-element').removeClass('selected-element');
      _name.addClass('selected-element');
      callback();      
    });
    var _icon = $('<div>').addClass('profile-nav-element-icon').html('P');
    var _colorIcon = Pard.Widgets.IconColor(profile.color).render();
    _icon.css({color: _colorIcon}); 

    _createdWidget.append(_profileCircle.append(_icon), _name);

    return {
      render: function() {
        return _createdWidget;
      }
    } 
  }



  ns.Widgets.ProfilesNavigationElement = function(profile, callback){
    var _createdWidget = $('<div>').addClass('profile-nav-element-container');
    var _profileCircle = $('<div>').addClass('profile-nav-circle').css({'background-color': profile['color']});
    var _name = $('<p>').addClass('profile-nav-element-name').text(profile['name']);
    _name.hover(function(){$(this).addClass('text-link')},function(){$(this).removeClass('text-link')});
    _profileCircle.hover(function(){_name.addClass('text-link')},function(){_name.removeClass('text-link')});
    _name.click(function(){_profileCircle.trigger('click')});
    _profileCircle.click(function(){
      $('.selected-element').removeClass('selected-element');
      _name.addClass('selected-element');
      callback();      
    });
    var _icon = $('<div>').addClass('profile-nav-element-icon').html('P');
    var _colorIcon = Pard.Widgets.IconColor(profile.color).render();
    _icon.css({color: _colorIcon}); 
    
    _createdWidget.append(_profileCircle.append(_icon), _name);

    return {
      render: function() {
        return _createdWidget;
      }
    } 
  }


  ns.Widgets.ProductionsNavigation = function(profile, sectionContent, productionContent){

    productionContent.empty();

    var _proposals = [];

    (profile.proposals) ? productionContent.addClass('productions-content') : productionContent.removeClass('productions-content');
    if (profile.proposals) _proposals = profile.proposals;
    _proposals.forEach(function(proposal, index) {
      var _productionItem = $('<span>');
      var _icon = $('<span>').addClass('material-icons').html('&#xE405;');
      var _title = $('<span>').text(' '+proposal['title']);
      _productionItem.append(_icon, _title).addClass('production-item').click(function(){ 
        $('.selected-element').removeClass('selected-element');
        _title.addClass('selected-element');
        Pard.Widgets.ArtistProductionSectionContent(proposal.proposal_id, sectionContent)});
      _productionItem.hover(function(){_title.addClass('text-link')}, function(){_title.removeClass('text-link ')});
    	 productionContent.append($('<div>').addClass('row productions-list-item').append(_productionItem));
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


  

  
}(Pard || {}));
