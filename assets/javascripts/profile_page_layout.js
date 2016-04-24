'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ProfileDropdownMenu = function(){     

    var _menu = $('<ul>').addClass('menu');

    var _logout = $('<li>').append(Pard.Widgets.Logout().render().attr('href','#'));

    var _modifyPassword = $('<li>').append(Pard.Widgets.ModifyPassword().render().attr('href','#'));


    _menu.append(_modifyPassword,  _logout);
    var _menuContainer = $('<ul>').addClass('dropdown menu').attr({'data-dropdown-menu':true, 'data-disable-hover':true,'data-click-open':true});
    var _iconDropdownMenu = $('<li>').append(
      $('<a>').attr('href','#').append(
        $('<span>').html('&#xE8B8;').addClass('material-icons settings-icon-dropdown-menu')
        )
      ,_menu
    );

    _menuContainer.append(_iconDropdownMenu);

    return {
      render: function(){
        return _menuContainer;
      } 
    }
  }

  ns.Widgets.ProfileMainLayout = function(profiles, out, notLogged){

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

    if (out) Pard.Widgets.ProfileSection(profiles[0]['type']).render()(_sectionHeader, profiles[0].profile_id, profiles[0] );
    else{
      Pard.Widgets.ProfileSection(profiles[0]['type']).render()(_sectionHeader);
    }

    if (out) Pard.Widgets.ProfileAside(_sectionHeader, _sectionContent, _asideContent, profiles, notLogged);
    else{
      Pard.Widgets.ProfileAside(_sectionHeader, _sectionContent, _asideContent);
    }

    _offCanvasSection.append(_sectionContainer.append(_sectionHeader, _sectionContent));

    _offCanvasAside.append(_asideContent);

    _aside.append(_offCanvasAside);
    _section.append(_offCanvasSection);
    _offCanvasInner.append(_aside, _gridSpacing, _section);

    _mainLarge.append(_offCanvasWrapper.append(_offCanvasInner));
    _main.append(_mainLarge);

     if (notLogged) {
        _main.addClass('outsider-main');
       $('.whole-container').on('scroll',function() {
       if ( _main.offset().top < 5){
        $('#register-outsider-header-button').show();        
       }
       else{
        $('#register-outsider-header-button').hide();
       }
      });
     }

    return {
      render: function(){
        return _main;
      }
    }
  }


  ns.Widgets.ProfileAside = function (sectionHeader, sectionContent, asideContent, profilesOut, notLogged) {

    asideContent.addClass('aside-container');

    var _buttonContainer = $('<div>');

    if (notLogged){
      var _signUpButton = Pard.Widgets.SignUpButton().render();
      _signUpButton.addClass('signupButton-Outsider');
      var _innerContainer = $('<div>');
      _innerContainer.append(_signUpButton);
      _innerContainer.addClass('signupButton-container-Outsider');
      _buttonContainer.append(_innerContainer).addClass('outer-signupButton-container-Outsider');
    }
    else{      
      var _toUserPageBtn = Pard.Widgets.Button('Inicio', function(){
      location.href = /users/});      
      _toUserPageBtn.setClass('toUserPage-btn');
      _buttonContainer.append(_toUserPageBtn.render());
      _buttonContainer.addClass('toUserPage-btn-container');
    }

    var _asideNavContent  = $('<div>');

    if (profilesOut) asideContent.append(_buttonContainer, Pard.Widgets.ProfileAsideBar(sectionHeader, sectionContent, _asideNavContent, profilesOut, notLogged).render());
    else{
      asideContent.append(_buttonContainer, Pard.Widgets.ProfileAsideBar(sectionHeader, sectionContent, _asideNavContent).render());
    }
  }

  ns.Widgets.ProfileAsideBar = function(sectionHeader, sectionContent, asideNavContent, profilesOut){

    asideNavContent.empty();

    if (profilesOut) var _profiles = profilesOut;    
    else{
     var _profiles = Pard.CachedProfiles;
    }  
    var selected = false;
    window.location.href.split("=").pop();    
    if(window.location.href.match(/.*&sel=.*/)) selected = window.location.href.split("=").pop();


    ProfileNav = function(_profiles, _index, sectionHeader, sectionContent){

      asideNavContent.empty();
      
      var _profileNav = $('<div>').addClass('profile-nav-container').attr('id','_profileNav');
      var _myOtherProfiles = $('<div>').addClass('other-profiles-nav-container');
      var _productionContent = $('<div>').attr('id','_productionsContent');
  
      var _reorderedProfiles = Pard.Widgets.ReorderArray(_profiles, _index).render();

      history.replaceState({},'','profile?id=' + _reorderedProfiles[0].profile_id);

      _reorderedProfiles.forEach(function(profile, index) {
        if(!(index)){
          if (profilesOut){ 
            Pard.Widgets.ProductionsNavigation(profile.profile_id, _profileNav, sectionContent,_productionContent, selected, profile);
          }
          else{
             Pard.Widgets.ProductionsNavigation(profile.profile_id, _profileNav, sectionContent,_productionContent, selected);
          }                   
        }
        else { 
          if (profilesOut){
            _myOtherProfiles.append(Pard.Widgets.ProfilesNavigationElement(profile, function(){
                Pard.Widgets.ProfileAsideBar(sectionHeader, sectionContent, asideNavContent, profilesOut);
                Pard.Widgets.ProfileSection(profile['type']).render()(sectionHeader, profile.profile_id, profile);
                ProfileNav(_reorderedProfiles, index,sectionHeader, sectionContent);
              }).render()
            );
          }
          else{
            _myOtherProfiles.append(Pard.Widgets.ProfilesNavigationElement(profile, function(){
                Pard.Widgets.ProfileAsideBar(sectionHeader, sectionContent, asideNavContent);
                Pard.Widgets.ProfileSection(profile['type']).render()(sectionHeader, profile.profile_id);
                ProfileNav(_reorderedProfiles, index,sectionHeader, sectionContent);
              }).render()
            );
          }
        }
      });

      asideNavContent.append(_profileNav)
      var _messageOther = $('<p>').addClass('message-otherProfile-asideBar');
      if (profilesOut){
      _messageOther.text('del mismo usuario');
      }
      else{
        _messageOther.text('tus otros perfiles');
      }

      if  (_myOtherProfiles.html()) asideNavContent.append(_myOtherProfiles.prepend(_messageOther));
    }

    ProfileNav(_profiles,0,sectionHeader, sectionContent);

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

  ns.Widgets.ProductionsNavigation = function(profile_id, profileNav, sectionContent, productionContent, selected, profileOut){

    if (profileOut){
      var profile = profileOut;
      var _out = true;
    }
    else{
      var profile = Pard.ProfileManager.getProfile(profile_id);
      _out = false;
    }

    profileNav.empty();
    sectionContent.empty();
    productionContent.empty();

    var _lastselected = $('<div>');

    var _profileSection = Pard.Widgets.ProfileSectionContent(profile['type']).render()(profile, _out).render();

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

    var _productions = [];
    var _shown = [];

    if (profile.productions && profile.productions.length) {
      productionContent.addClass('nav-list-container')
      _productions = profile.productions;
      productionContent.append($('<p>').addClass('message-productions-asideBar').text('Portfolio'))  
    }else{
      productionContent.removeClass('nav-list-container');
    }
    _productions.forEach(function(production, index){
      var production_id = production.production_id;
      var _myProduction = $('<div>');
      
      var _productionItem = $('<div>').addClass('production-nav-element-container');
      var _iconColumn = $('<div>').addClass(' icon-column').append($('<div>').addClass('nav-icon-production-container').append($('<div>').addClass('production-icon-container').append(Pard.Widgets.IconManager(production['category']).render().css({'text-align': 'center', display:'block'}))));
      var _nameColumn = $('<div>').addClass('name-column name-column-production-nav');
      var _name = $('<p>').text(production['title']).addClass('profile-nav-production-name');
      _productionItem.append(_iconColumn, _nameColumn.append(Pard.Widgets.FitInBox(_name,125,45).render()));
      if(selected == production_id) {
        $('.selected-element').removeClass('selected-element');
        _name.addClass('selected-element');
        var _myProduction = $('<div>');
        _myProduction.append(Pard.Widgets.MyArtistProductionsContent(production_id, profile, _out).render());
        sectionContent.append(_myProduction);
        _shown[production_id] = _myProduction;
        _lastselected = _shown[production_id];
      }
      _name.click(function(){
        $('.selected-element').removeClass('selected-element');
        _name.addClass('selected-element');
        _lastselected.hide();

        if(_shown[production_id]){
          _shown[production_id].show();
        }else{
          var _myProduction = $('<div>');
          _myProduction.append(Pard.Widgets.MyArtistProductionsContent(production_id, profile, _out).render());
          sectionContent.append(_myProduction);
          _shown[production_id] = _myProduction;
          FB.XFBML.parse();
          window.instgrm.Embeds.process();
        }
        _lastselected = _shown[production_id];
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