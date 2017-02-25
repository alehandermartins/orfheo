'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ProfileAside = function (sectionHeader, sectionContent, asideContent) {

    asideContent.addClass('aside-container');
    var _buttonContainer = $('<div>');
    var userStatus = Pard.UserStatus['status'];

    var _asideNavContent  = $('<div>');
    asideContent.append(_buttonContainer, Pard.Widgets.ProfileAsideBar(sectionHeader, sectionContent, _asideNavContent).render());
  }


  ns.Widgets.ProfileAsideBar = function(sectionHeader, sectionContent, asideNavContent){

    asideNavContent.empty();

    var userStatus = Pard.UserStatus['status'];

    var _profiles = Pard.CachedProfiles;

    var selected = false;
    window.location.href.split("=").pop();    
    if(window.location.href.match(/.*&sel=.*/)) selected = window.location.href.split("=").pop();
      
    var _profileNav = $('<div>').addClass('profile-nav-container').attr('id','_profileNav');
    var _myOtherProfiles = $('<div>').addClass('other-profiles-nav-container');
   
    if (typeof history.pushState != 'undefined') { 
      history.replaceState({},'','profile?id=' + _profiles[0].profile_id);
    }

    _profiles.forEach(function(profile, index) {
      if(index == 0){
        Pard.Widgets.ProfileSection(profile['type']).render()(sectionHeader, profile.profile_id);
        Pard.Widgets.ProductionsNavigation(profile.profile_id, _profileNav, sectionContent, selected);
      }
      else { 
        _myOtherProfiles.append(Pard.Widgets.ProfilesNavigationElement(profile, function(){
              Pard.CachedProfiles = Pard.Widgets.ReorderArray(Pard.CachedProfiles, index).render();
              Pard.Widgets.ProfileAsideBar(sectionHeader, sectionContent, asideNavContent, index);
          }).render()
        );
      }
    });

    asideNavContent.append(_profileNav);
    var _messageOther = $('<p>').addClass('message-otherProfile-asideBar');
    if (userStatus == 'owner'){
      _messageOther.text(Pard.t.text('profile_page.aside.yourOther'));
    }else{
      _messageOther.text(Pard.t.text('profile_page.aside.other'));
    }

    if  (_myOtherProfiles.html()) asideNavContent.append(_myOtherProfiles.prepend(_messageOther));


    return {
      render: function() {
        return asideNavContent;
      }
    }
  }

  ns.Widgets.ProfilesNavigationSelected = function(profile, callback){

    console.log(profile);

    var _createdWidget = $('<div>').addClass('profile-selected-container  selected-element');
    var _circleColumn = $('<div>').addClass('icon-column');

    var _profileCircle = $('<div>').addClass('profile-nav-circle-selected').css({'background-color': profile['color']});
    var _nameColumn = $('<div>').addClass('name-column profile-name-column');
    var _name = $('<p>').addClass('profile-nav-name-selected').text(profile['name']);
    
    _createdWidget.hover(function(){
      _name.addClass('text-link-profile-nav');
      _name.removeClass('text-link-profile-nav');
    });

    _createdWidget.click(function(){
      $('.selected-element').removeClass('selected-element');
      _createdWidget.addClass('selected-element');
      callback();      
    });

    var _icon = $('<div>').append(Pard.Widgets.IconManager(profile['type']).render().addClass('profile-nav-element-icon'));
    var _colorIcon = Pard.Widgets.IconColor(profile['color']).render();
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
    _elementContainer.hover(function(){_name.addClass('text-link-profile-nav')},function(){_name.removeClass('text-link-profile-nav')});
    _profileCircle.hover(function(){_name.addClass('text-link-profile-nav')},function(){_name.removeClass('text-link-profile-nav')});
    _elementContainer.click(function(){_profileCircle.trigger('click')});
    _profileCircle.click(function(){
      // $('.selected-element').removeClass('selected-element');
      // _name.addClass('selected-element');
      callback();      
    });
    var _icon = $('<div>').append(Pard.Widgets.IconManager(profile['type']).render().addClass('profile-nav-element-icon'));
    var _colorIcon = Pard.Widgets.IconColor(profile['color']).render();
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

  ns.Widgets.ProductionsNavigation = function(profile_id, profileNav, sectionContent, selected){

    profileNav.empty();
    sectionContent.empty();

    var profile = Pard.ProfileManager.getProfile(profile_id);
    var userStatus = Pard.UserStatus['status'];

    var productionContent = $('<div>').attr('id','_productionsContent');

    var _lastselected = $('<div>');

    var _profileSection = Pard.Widgets.ProfileSectionContent(profile['type']).render()(profile).render();

    _lastselected = _profileSection;
    sectionContent.append(_profileSection);
    if(selected) {
      _profileSection.hide();
    }else if(profile['type'] == 'space'){
      $(document).ready(function(){
        FB.XFBML.parse();
        window.instgrm.Embeds.process();
        doBuild();
      });
    }

    var _navigationSelected = Pard.Widgets.ProfilesNavigationSelected(profile, function(){
      _lastselected.hide();
      _lastselected = _profileSection;
      _profileSection.show();
    });

    profileNav.append(_navigationSelected.render());
    
    var _productions = [];
    var _shown = [];

    if ((userStatus == 'owner') || (profile.productions && profile.productions.length)) {
      productionContent.addClass('nav-list-container');
      productionContent.append($('<p>').addClass('message-productions-asideBar').text(Pard.t.text('profile_page.aside.portfolio')));
    }
    else{
      productionContent.removeClass('nav-list-container');
    }

    if (profile.productions && profile.productions.length) {
      _productions = profile.productions;
      _productions.forEach(function(production){
        var production_id = production.production_id;
        var _myProduction = $('<div>');
        var _productionItem = $('<div>').addClass('production-nav-element-container');
        var _iconColumn = $('<div>').addClass(' icon-column').append($('<div>').addClass('nav-icon-production-container').append($('<div>').addClass('production-icon-container').append(Pard.Widgets.IconManager(production['category']).render().css({'text-align': 'center', display:'block'}))));
        var _nameColumn = $('<div>').addClass('name-column name-column-production-nav');
        var _name = $('<p>').text(production['title']).addClass('profile-nav-production-name');
        _productionItem.append(_iconColumn, _nameColumn.append(Pard.Widgets.FitInBox(_name,125,45).render()));
        if(selected == production_id) {
          $('.selected-element').removeClass('selected-element');
          _productionItem.addClass('selected-element');
          _myProduction.append(Pard.Widgets.MyArtistProductionsContent(production_id, profile).render());
          sectionContent.append(_myProduction);
          _shown[production_id] = _myProduction;
          _lastselected = _shown[production_id];
          $(document).ready(function(){
            FB.XFBML.parse();
            window.instgrm.Embeds.process();
            doBuild();
          });
        }
        _productionItem.click(function(){
          $('.selected-element').removeClass('selected-element');
          _productionItem.addClass('selected-element');
          _lastselected.hide();

          if(_shown[production_id]){
            _shown[production_id].show();
          }else{
            _myProduction.append(Pard.Widgets.MyArtistProductionsContent(production_id, profile).render());
            sectionContent.append(_myProduction);
            _shown[production_id] = _myProduction;
            $(document).ready(function(){
              FB.XFBML.parse();
              window.instgrm.Embeds.process();
              doBuild();
            });
          }
          _lastselected = _shown[production_id];
        });

        _name.hover(function(){_name.addClass('text-link-profile-nav')}, function(){_name.removeClass('text-link-profile-nav ')});
        productionContent.append(_productionItem);      
      });
    }

    if (userStatus == 'owner') {
      var _createProductionItem = $('<div>').addClass('production-nav-element-container');
      var _iconPlusColumn = $('<div>').addClass(' icon-column').append($('<div>').addClass('nav-icon-production-container').append($('<div>').addClass('production-icon-container').append(Pard.Widgets.IconManager('add_circle').render().css({'text-align': 'center', display:'block'}))));
      var _textColumn = $('<div>').addClass('name-column name-column-production-nav');
      var _text = $('<p>').text(Pard.t.text('production.createTitle')).addClass('profile-nav-production-name');
      _createProductionItem.append(_iconPlusColumn, _textColumn.append(_text));

      var _createProdPopup;
      _createProductionItem
        .one('click', function(){_createProdPopup = Pard.Widgets.Popup()})
        .click(function(){
          var _createProdMessage = Pard.Widgets.CreateNewProductionMessage(profile);
          _createProdMessage.setCallback(function(){_createProdPopup.close()});
          _createProdPopup.setContent(Pard.t.text('production.createTitle'), _createProdMessage.render());
          _createProdPopup.open();
        });

      productionContent.append(_createProductionItem);
    
    }

    profileNav.append(productionContent);

    return {
      render: function() {
        return  productionContent;
      }
    }
  }

  // ns.Widgets.AddProductionToList = function(production, productionContent, _lastselected, selected){
    
  //   var production_id = production.production_id;
  //   var _myProduction = $('<div>');
  //   var _productionItem = $('<div>').addClass('production-nav-element-container');
  //   var _iconColumn = $('<div>').addClass(' icon-column').append($('<div>').addClass('nav-icon-production-container').append($('<div>').addClass('production-icon-container').append(Pard.Widgets.IconManager(production['category']).render().css({'text-align': 'center', display:'block'}))));
  //   var _nameColumn = $('<div>').addClass('name-column name-column-production-nav');
  //   var _name = $('<p>').text(production['title']).addClass('profile-nav-production-name');
  //   _productionItem.append(_iconColumn, _nameColumn.append(Pard.Widgets.FitInBox(_name,125,45).render()));
  //   if(selected == production_id) {
  //     $('.selected-element').removeClass('selected-element');
  //     _productionItem.addClass('selected-element');
  //     _myProduction.append(Pard.Widgets.MyArtistProductionsContent(production_id, profile).render());
  //     sectionContent.append(_myProduction);
  //     _shown[production_id] = _myProduction;
  //     _lastselected = _shown[production_id];
  //     $(document).ready(function(){
  //       FB.XFBML.parse();
  //       window.instgrm.Embeds.process();
  //       doBuild();
  //     });
  //   }
  //   _productionItem.click(function(){
  //     $('.selected-element').removeClass('selected-element');
  //     _productionItem.addClass('selected-element');
  //     _lastselected.hide();

  //     if(_shown[production_id]){
  //       _shown[production_id].show();
  //     }else{
  //       _myProduction.append(Pard.Widgets.MyArtistProductionsContent(production_id, profile).render());
  //       sectionContent.append(_myProduction);
  //       _shown[production_id] = _myProduction;
  //       $(document).ready(function(){
  //         FB.XFBML.parse();
  //         window.instgrm.Embeds.process();
  //         doBuild();
  //       });
  //     }
  //     _lastselected = _shown[production_id];
  //   });

  //   _name.hover(function(){_name.addClass('text-link-profile-nav')}, function(){_name.removeClass('text-link-profile-nav ')});
  //   productionContent.append(_productionItem);

  // }


  ns.Widgets.ProfileSection = function(type) {

    var profiles_map = {
      artist: Pard.Widgets.ArtistSection,
      space: Pard.Widgets.SpaceSection,
      organization: Pard.Widgets.OrganizationSection
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
      space: Pard.Widgets.SpaceSectionContent,
      organization: Pard.Widgets.OrganizationSectionContent
    }

    return {
      render: function( ){
        return profiles_map[type];
      }
    }
  }

  ns.Widgets.SectionBoxContainer = function(title, icon){
    var _boxContainer = $('<div>').addClass('section-box-container');
    var _titleContainer = $('<div>').addClass('title-box-container');
    _titleContainer.append($('<div>').append($('<span>').addClass('icon-in-box').append(icon), $('<span>').html(title)));
    _boxContainer.append(_titleContainer);

    return{
      render: function(){
        return _boxContainer;
      }
    }

  }



}(Pard || {}));