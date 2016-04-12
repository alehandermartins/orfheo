'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

   ns.Widgets.ProfileHeader = function(){
    
    var _createdWidget = $('<header>').addClass('user-bar');
    var _topBar = $('<div>').addClass('top-bar pard-grid clearfix');
    var _container = $('<div>').addClass('pard-header-container');

    var _topContent = $('<div>').addClass('top-header-content');

    var _topBarTitle = $('<div>').addClass('left-user-header-content');
    _topBarTitle.html('<h3><strong>orfheo</strong></h3>');
   
    var _responsiveMenu = $('<div>').addClass('clearfix displayNone-for-large');

    var _elemOffCanvas = $('<span>').addClass('menu-icon-header');
    var _iconOffCanvas = $('<span>').addClass('menu-icon dark').attr({'data-toggle': 'offCanvas-navBar', 'close-on-click': true});
    _elemOffCanvas.append(_iconOffCanvas, ' Menu');

    _responsiveMenu.append(_elemOffCanvas);

    var _topBarRight = $('<div>').addClass('right-user-header-content');

    var _menu = $('<ul>').addClass('menu');
    var _logout = $('<li>').append(Pard.Widgets.Logout().render().attr('href','#'));
    var _modifyPassword = $('<li>').append(Pard.Widgets.ModifyPassword().render().attr('href','#'));
    _menu.append(_modifyPassword, _logout);
    var _menuContainer = $('<ul>').addClass('dropdown menu').attr({'data-dropdown-menu':true, 'data-disable-hover':true,'data-click-open':true});
    var _iconDropdownMenu = $('<li>').append(
      $('<a>').attr('href','#').append(
        $('<span>').html('&#xE8B8;').addClass('material-icons settings-icon-dropdown-menu')
        )
      ,_menu
    );

    _menuContainer.append(_iconDropdownMenu);
     
    _topBarRight.append(_menuContainer);

    _topContent.append(_topBarTitle, _topBarRight);

    _container.append(_topContent, _responsiveMenu);
    _topBar.append(_container);
    _createdWidget.append(_topBar);

    return {
      render: function(){
        return _createdWidget;
      } 
    }
  }

  ns.Widgets.ProfileMainLayout = function(profiles){

    var _rgb = Pard.Widgets.IconColor(profiles[0]['color']).rgb();
    var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
    var _main = $('<main>').css({'background': _backColor});

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

    Pard.Widgets.ProfileSection(profiles[0]['type']).render()(_sectionHeader);
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
    var _toUserPageBtn = Pard.Widgets.Button('Inicio', function(){
      location.href = /users/});
      
    _toUserPageBtn.setClass('toUserPage-btn');
    _buttonContainer.append(_toUserPageBtn.render());

    var _asideNavContent  = $('<div>');;

    asideContent.append(_buttonContainer, Pard.Widgets.ProfileAsideBar(sectionHeader, sectionContent, _asideNavContent).render());
    
  }

  ns.Widgets.ProfileAsideBar = function(sectionHeader, sectionContent, asideNavContent){

    asideNavContent.empty();
    var profiles = Pard.CachedProfiles['my_profiles'];
    var selected = false;
    if(window.location.href.match(/.*&sel=.*/)) selected = window.location.href.split("=").pop();

    ProfileNav = function(_profiles, _index, sectionHeader, sectionContent){

      asideNavContent.empty();
      
      var _profileNav = $('<div>').addClass('profile-nav-container').attr('id','_profileNav');
      var _myOtherProfiles = $('<div>').addClass('other-profiles-nav-container');
      var _productionContent = $('<div>').attr('id','_productionsContent');
  
      var _reorderedProfiles = Pard.Widgets.ReorderArray(_profiles, _index).render();

      history.pushState({},'','profile?id=' + _reorderedProfiles[0].profile_id);
      
      _reorderedProfiles.forEach(function(profile, index) {
        if(!(index)){ 
          Pard.Widgets.ProductionsNavigation(profile.profile_id, _profileNav, sectionContent,_productionContent, selected);
          
        }
        else { _myOtherProfiles.append(Pard.Widgets.ProfilesNavigationElement(profile, function(){
            Pard.Widgets.ProfileAsideBar(sectionHeader, sectionContent, asideNavContent);
            Pard.Widgets.ProfileSection(profile['type']).render()(sectionHeader, profile.profile_id);
              ProfileNav(_reorderedProfiles, index,sectionHeader, sectionContent);
          }).render());
        }
      });
      asideNavContent.append(_profileNav)
      var _messageOther = $('<p>').text('otros perfiles').addClass('message-otherProfile-asideBar');
      if  (_myOtherProfiles.html()) asideNavContent.append(_myOtherProfiles.prepend(_messageOther));
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
    
    _createdWidget.hover(function(){_name.addClass('text-link-profile-nav')},function(){_name.removeClass('text-link-profile-nav')});

    _createdWidget.click(function(){
      $('.selected-element').removeClass('selected-element');
      _name.addClass('selected-element');
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
      $('.selected-element').removeClass('selected-element');
      _name.addClass('selected-element');
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

  ns.Widgets.ProductionsNavigation = function(profile_id, profileNav, sectionContent, productionContent, selected){

    var profile = Pard.ProfileManager.getProfile(profile_id);
    profileNav.empty();
    sectionContent.empty();
    productionContent.empty();

    var _lastselected = $('<div>');

    var _profileSection = Pard.Widgets.ProfileSectionContent(profile['type']).render()(profile).render();

    _lastselected = _profileSection;
    sectionContent.append(_profileSection);
    if(selected) {
      _profileSection.hide();
    }

    var _navigationSelected = Pard.Widgets.ProfilesNavigationSelected(profile, function(){
      _lastselected.hide();
      _lastselected = _profileSection;
      _profileSection.show();
    });

    profileNav.append(_navigationSelected.render());

    var _proposals = [];

    (profile.proposals) ? productionContent.addClass('nav-list-container') : productionContent.removeClass('nav-list-container');
    if (profile.proposals) {
      _proposals = profile.proposals;
      productionContent.append($('<p>').addClass('message-productions-asideBar').text('Portfolio'))  
    }
    _proposals.forEach(function(proposal, index){
      var proposal_id = proposal.proposal_id;
      var _myProposal = $('<div>'); 
      _myProposal.append(Pard.Widgets.MyArtistProductionsContent(proposal_id, profile['color']).render());
      sectionContent.append(_myProposal);
      if(selected == proposal_id) _lastselected = _myProposal;
      else{_myProposal.hide();}

      var _productionItem = $('<div>').addClass('production-nav-element-container');
      var _iconColumn = $('<div>').addClass(' icon-column').append($('<div>').addClass('nav-icon-production-container').append($('<div>').addClass('production-icon-container').append(Pard.Widgets.IconManager(proposal['category']).render().css({'text-align': 'center', display:'block'}))));
      var _nameColumn = $('<div>').addClass('name-column name-column-production-nav');
      var _name = $('<p>').text(proposal['title']).addClass('profile-nav-production-name');
      _productionItem.append(_iconColumn, _nameColumn.append(Pard.Widgets.FitInBox(_name,125,45).render()));
      if(selected == proposal_id) {
        $('.selected-element').removeClass('selected-element');
        _name.addClass('selected-element');
      }
      _name.click(function(){ 
        $('.selected-element').removeClass('selected-element');
        _name.addClass('selected-element');
        _lastselected.hide();
        _myProposal.show();
        _lastselected = _myProposal;
      });
      _name.hover(function(){_name.addClass('text-link-profile-nav')}, function(){_name.removeClass('text-link-profile-nav ')});
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

  ns.Widgets.SectionBoxContainer = function(title, icon){
    var _boxContainer = $('<div>').addClass('section-box-container');
    var _titleContainer = $('<div>').addClass('title-box-container');
    _titleContainer.append($('<div>').append($('<span>').addClass('icon-in-box').append(icon), $('<span>').text(title)));
    _boxContainer.append(_titleContainer);

    return{
      render: function(){
        return _boxContainer;
      }
    }

  }



}(Pard || {}));