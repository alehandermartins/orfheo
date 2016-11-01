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

  ns.Widgets.ProfileMainLayout = function(){

    var profiles = Pard.CachedProfiles;
    var userStatus = Pard.UserStatus['status'];

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

    // Pard.Widgets.ProfileSection(profiles[0]['type']).render()(_sectionHeader, profiles[0].profile_id);
    Pard.Widgets.ProfileAside(_sectionHeader, _sectionContent, _asideContent);

    _offCanvasSection.append(_sectionContainer.append(_sectionHeader, _sectionContent));
    _offCanvasAside.append(_asideContent);

    _aside.append(_offCanvasAside);
    _section.append(_offCanvasSection);
    _offCanvasInner.append(_aside, _gridSpacing, _section);

    _mainLarge.append(_offCanvasWrapper.append(_offCanvasInner));
    _main.append(_mainLarge);

     if (userStatus == 'outsider') {
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


  ns.Widgets.ProfileAside = function (sectionHeader, sectionContent, asideContent) {

    asideContent.addClass('aside-container');
    var _buttonContainer = $('<div>');
    var userStatus = Pard.UserStatus['status'];

    if (userStatus == 'outsider'){
      var _signUpButton = Pard.Widgets.SignUpButton().render();
      _signUpButton.addClass('signupButton-Outsider');
      var _innerContainer = $('<div>');
      _innerContainer.append(_signUpButton);
      _innerContainer.addClass('signupButton-container-Outsider');
      _buttonContainer.append(_innerContainer).addClass('outer-signupButton-container-Outsider');
    }
    else{      
      var _toUserPageBtn = Pard.Widgets.Button('Página de usuario', function(){
      location.href = /users/});      
      _toUserPageBtn.setClass('toUserPage-btn');
      _buttonContainer.append(_toUserPageBtn.render());
      _buttonContainer.addClass('toUserPage-btn-container');
    }

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
      _messageOther.text('tus otros perfiles');
    }else{
      _messageOther.text('Otros perfiles del mismo usuario');
    }

    if  (_myOtherProfiles.html()) asideNavContent.append(_myOtherProfiles.prepend(_messageOther));


    return {
      render: function() {
        return asideNavContent;
      }
    }
  }

  ns.Widgets.ProfilesNavigationSelected = function(profile, callback){

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
    console.log(profile);
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

    if ((userStatus == 'owner' && profile.type == 'artist') || (profile.productions && profile.productions.length)) {
      productionContent.addClass('nav-list-container');
      productionContent.append($('<p>').addClass('message-productions-asideBar').text('Portfolio'));
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

    if (userStatus == 'owner' && profile.type == 'artist') {
      var _createProductionItem = $('<div>').addClass('production-nav-element-container');
      var _iconPlusColumn = $('<div>').addClass(' icon-column').append($('<div>').addClass('nav-icon-production-container').append($('<div>').addClass('production-icon-container').append(Pard.Widgets.IconManager('add_circle').render().css({'text-align': 'center', display:'block'}))));
      var _textColumn = $('<div>').addClass('name-column name-column-production-nav');
      var _text = $('<p>').text('Crea un contenido artístico').addClass('profile-nav-production-name');
      _createProductionItem.append(_iconPlusColumn, _textColumn.append(_text));

      var _createProdPopup = Pard.Widgets.PopupCreator(_createProductionItem, 'Crea un contenido artístico', function(){ return Pard.Widgets.CreateNewProductionMessage(profile_id)});
      
      productionContent.append(_createProdPopup.render());
    
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


  ns.Widgets.CreateNewProductionMessage = function(profile_id){
    var _createdWidget = $('<div>');

    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Crea');
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');
    var _preSelected = 'music';
    var _closepopup = {};


    _submitForm['type'] = 'artist';
    _submitForm['category'] = _preSelected;
    _submitForm['profile_id'] = profile_id

    var _content = $('<form>').addClass('popup-form');

    var _form = {};
    var _requiredFields = [];

    var _printForm = function(_selected){
      _content.empty();
      var _fieldset = $('<fieldset>');
      _requiredFields = Pard.Forms.CreateProduction(_selected).requiredFields();
      _form = Pard.Forms.CreateProduction(_selected).render();
      for(var field in _form){
        _content.append($('<div>').addClass('callPage-createArtistProposal' ).append(_form[field]['label'].render().append(_form[field]['input'].render()),_form[field]['helptext'].render()));
      };
      _submitForm['category'] = _selected;
    }

    // var _categorySelector = Pard.Widgets.ArtisticCategorySelector();
    // var categorySelectCallback = function(){
    //   var _selected = _categorySelector.getData();
    //   _printForm(_selected[0].id);
    // };
    // _categorySelector.setCallback(categorySelectCallback);

    var categorySelectCallback = function(){
      var _selected = $(this).val();
      _printForm(_selected);
    };
    var _categorySelector = Pard.Widgets.ArtisticCategoryFoundationSelector(categorySelectCallback);

    var _categoryLabel = $('<label>').text('Selecciona una categoría *');

    var _category = $('<div>').append(_categoryLabel.append(_categorySelector.render())).addClass('popup-categorySelector');

    _createdWidget.append(_category, _content, _invalidInput, _submitBtnContainer.append(submitButton));
    _printForm(_preSelected);
   
    var _filled = function(){
      var _check = true;
      for(var field in _form){
        if ($.inArray(field, _requiredFields) >= 0 ){
          if(!(_form[field].input.getVal())) {
            _form[field].input.addWarning();
            _invalidInput.text('Por favor, revisa los campos obligatorios.');
            _check = false;
          }
        }
      }
      if (_check) _invalidInput.empty();
      return _check;    
    };


    var _getVal = function(url){
      for(var field in _form){
         _submitForm[field] = _form[field].input.getVal();
      };
      return _submitForm;
    }

    var _createNewProdCallback = function(data){
      if (data.status == 'success'){
        Pard.ProfileManager.addProduction(profile_id,data.production);
        Pard.Widgets.ProductionsNavigation(profile_id, $('#_profileNav'), $('#_sectionContent'), data.production.production_id);
        // Pard.Widgets.Alert('','Contenido creado correctamente');
      }
      else{
      Pard.Widgets.Alert('',data.reason);
      }  
    }
 
    submitButton.on('click',function(){
      if(_filled() == true){
        var _newProduction = _getVal();
        console.log(_newProduction);
        Pard.Backend.createProduction(_newProduction, _createNewProdCallback);
        _closepopup();
      }
    });


    return{
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }


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
    _titleContainer.append($('<div>').append($('<span>').addClass('icon-in-box').append(icon), $('<span>').text(title)));
    _boxContainer.append(_titleContainer);

    return{
      render: function(){
        return _boxContainer;
      }
    }

  }



}(Pard || {}));