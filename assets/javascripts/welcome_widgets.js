(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.LoginHeader = function(){
    
    var _createdWidget = $('<header>').addClass('login-bar');
    var _topBar = $('<div>').addClass('top-bar pard-grid clearfix');

    
    var _topBarTitle = $('<div>').addClass('top-bar-title block-for-medium left-bar-content');
    _topBarTitle.html('<h3><strong>orfheo</strong></h3>');
   
    var _responsiveMenu = $('<div>').addClass('clearfix displayNone-for-large');

    var _elemResponsive = $('<span>').addClass('float-right').attr({'data-responsive-toggle':'responsive-menu', 'data-hide-for': 'large'}); 
    var _iconLogin = $('<span>').addClass('menu-icon dark');
    _iconLogin.attr('data-toggle','');
    _elemResponsive.append(_iconLogin,' Log In');

    var _elemOffCanvas = $('<span>').addClass('float-left');
    var _iconOffCanvas = $('<span>').addClass('menu-icon dark').attr({'data-toggle': 'offCanvas-navBar', 'close-on-click': true});
    _elemOffCanvas.append(_iconOffCanvas, ' Menu');

    _responsiveMenu.append(_elemResponsive, _elemOffCanvas);

    var _menuLogin = $('<div>').attr('id','responsive-menu');
    var _topBarRight = $('<div>').addClass('top-bar-right menu right-bar-content');
    var _inputLogin = Pard.Widgets.Login().render();
    
    _topBarRight.append(_inputLogin);
    _menuLogin.append(_topBarRight);

    
    _topBar.append(_topBarTitle, _responsiveMenu, _menuLogin);
    _createdWidget.append(_topBar);


  	return {
  		render: function(){
  			return _createdWidget;
  		} 
  	}
  }

  ns.Widgets.LoginSectionMediumSmallScreen = function(profiles){
  	var _createdWidget = $('<div>').addClass('pard-grid displayNone-for-large');
    
    var _offCanvasWrapper = $('<div>').addClass('off-canvas-wrapper');
    var _offCanvasInner = $('<div>').addClass('off-canvas-wrapper-inner').attr({'data-off-canvas-wrapper': ''});

    var _offCanvasAside = $('<div>').addClass('off-canvas-grid-aside position-left-grid-aside').attr({id: 'offCanvas-navBar', 'data-off-canvas': ''});

    var _offCanvasSection = $('<div>').addClass('off-canvas-content').attr({'data-off-canvas-content': ''});

    var _aside = Pard.Widgets.LoginAside();

    var _section = Pard.Widgets.LoginSection(profiles);

    _offCanvasAside.append(_aside.render());
    _offCanvasSection.append(_section.render());
     
    _offCanvasInner.append(_offCanvasAside, _offCanvasSection);
    _offCanvasWrapper.append(_offCanvasInner);

    _createdWidget.append(_offCanvasWrapper);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  
  }

  ns.Widgets.LoginSectionLargeScreen= function(profiles){
    var _createdWidget = $('<div>').addClass('pard-grid displayNone-for-mediumDown');
    
    var _aside = Pard.Widgets.LoginAside();
    var _gridSpacing = $('<div>').addClass('grid-spacing');
    var _section = Pard.Widgets.LoginSection(profiles);

    _createdWidget.append(_aside.render(), _gridSpacing, _section.render());

    return{
      render: function(){
        return _createdWidget;
      }
    }
  
  }



  ns.Widgets.LoginAside = function () {
    var _createdWidget = $('<nav>').addClass('grid-aside');
    var _asideContent = $('<div>').addClass('grid-element-content signUp').attr('id','signUpBtn');

    Pard.Widgets.Sticker(_asideContent, 100, 24);

    var _signUpMessage =  Pard.Widgets.MboxContent('',Pard.Widgets.Registration().render()).render();    
    var _signUpBtn = Pard.Widgets.MboxCallButton('Regístrate', _signUpMessage);

    var _signUpButton = _signUpBtn.render();
    _signUpButton.addClass('circleSignUp');

    _asideContent.append(_signUpButton);

    _createdWidget.append(_asideContent);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.LoginSection = function (profiles) {
    var _createdWidget = $('<section>').addClass('grid-section');
    var _content = $('<div>').addClass('grid-element-content');
    var _title = $('<div>').addClass('grid-section-contentTitle').html(' <h4> Registrate y entra entra en</br> Benimaclet conFusión festival</h4>');
    var _searchEngine = Pard.Widgets.SearchEngine(profiles);




    _content.append(_title, _searchEngine.render())
    _createdWidget.append(_content);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.SearchEngine = function (profiles) {

    var _createdWidget = $('<div>');

    var _profiles = profiles;

    var _searchTools = $('<div>').addClass('row lateral-content-padding');
    var _searchResult = $('<div>');

    var _filters = $('<div>').addClass('medium-7 columns');
    var _searchByName = $('<div>').addClass('medium-5 columns');
    
    var _selectorsLabel = $('<label>').text('Filtros');
    var _searchByNameLabel = $('<label>').text('Busqueda por nombre');

    var _labelsTypes = ['-Tipo de perfil-', 'Artista', 'Espacio'];
    var _valuesTypes = ['none', 'artist', 'space'];

    var _catSelector = $('<span>');
    var _catSelectorDefault = Pard.Widgets.Selector(['-Categoría-'], ['none']);
    _catSelectorDefault.setClass('filter-select');
    _catSelectorDefault.disable();
    _catSelector.append(_catSelectorDefault.render());

    var _labelsCat ={
      artist: ['-Categoría-', 'Musica', 'Artes Escénicas', 'Exposición', 'Poesia',  'Audiovisual', 'Street Art', 'Taller', 'Otros'],
      space: ['-Categoría-','Asociacion Cultural', 'Local Comercial', 'Espacio Particular']
    }

    var _valuesCat ={
      artist: ['none', 'music', 'arts', 'expo', 'poetry', 'audiovisual', 'street_art', 'workshop', 'other'],
      space: ['none', 'cultural_ass', 'commercial', 'home']
    }

    var TypeCallback = function(){
      var _type = $(this).val();
      if (_type != 'none'){
        var _catSelect = Pard.Widgets.Selector(_labelsCat[_type], _valuesCat[_type], CatCallback);
        _catSelect.setClass('filter-select');
        _catSelector.html(_catSelect.render());
        _profiles = [];
        for (var i=0; i<profiles.length; i++) {
          if (profiles[i].type == _type) _profiles.push(profiles[i]);
        }
        _searchResult.empty();
        _searchResult.append(Pard.Widgets.ProfileCards(_profiles).render()); 
      }
      else{
        _catSelector.html(_catSelectorDefault.render())
        _profiles = profiles;
        _searchResult.empty();
        _searchResult.append(Pard.Widgets.ProfileCards(_profiles).render()); 
        _createdWidget.append(_searchResult);
      }
    }

    var CatCallback = function(){
      var _cat = $(this).val();
      if (_cat != 'none'){
      _profiles = [];
      var _keys =[];
      for (var i=0; i<profiles.length; i++) {
        _keys = Object.keys(profiles[i])
        if ($.inArray('proposals', _keys) >= 0 ){        
          for (var j=0; j<profiles[i].proposals.length; j++){
            if (profiles[i].proposals[j].category == _cat) _profiles.push(profiles[i]);
          }
        }
        else{
          if (profiles[i] .category == _cat) _profiles.push(profiles[i]);
        }
      }
        _searchResult.empty();
        _searchResult.append(Pard.Widgets.ProfileCards(_profiles).render()); 
      }
      else{
        TypeCallbackBound();
      }
    }

    var searchCallback = function(){
      var _input = _textInput.val();
      if (_input != ''){
        _profiles = [];
        for (var i=0; i<profiles.length; i++) {
          if (profiles[i].name == _input) _profiles.push(profiles[i]);        
        }
        _searchResult.empty();
        _searchResult.append(Pard.Widgets.ProfileCards(_profiles).render()); 
      }
      else{
        TypeCallbackBound();
      }
    } 

    var _typesSelector = Pard.Widgets.Selector(_labelsTypes, _valuesTypes, TypeCallback);
    _typesSelector.setClass('filter-select');

    var TypeCallbackBound = TypeCallback.bind(_typesSelector.render());

    var _searchWidget = $('<div>').addClass('ui-widget');
    var _textInput = Pard.Widgets.Input('', 'text');
    _textInput.setClass('search-input');

    var _availableTags = [];

    for (var i=0; i<profiles.length; i++){
      _availableTags[i] = profiles[i].name;
    }

    _textInput = _textInput.render(); 
    _textInput.autocomplete({
      source: _availableTags,
      minLength: 2
    });

    var _searchBtn = Pard.Widgets.Button('&#x0533;',searchCallback);
    _searchBtn.setClass('search-btn');

    _searchResult.append(Pard.Widgets.ProfileCards(_profiles).render());

    _searchWidget.append(_textInput,_searchBtn.render());
    _searchByName.append(_searchByNameLabel, _searchWidget);
    _filters.append(_selectorsLabel,_typesSelector.render(), _catSelector);
    _searchTools.append(_filters, _searchByName);
    _createdWidget.append(_searchTools, _searchResult)

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.ProfileCards = function (profiles) {

    var _createdWidget =  $('<div>').addClass('row lateral-content-padding search-results');

    var createCard = function(profile){
      var _cardContainer = $('<div>').addClass('columns large-4');
      var _card = $('<div>').addClass('profileCard position-profileCard-login');    
      var _circle = $('<div>').addClass('circleProfile position-circleProfile-card');
      var _icon = $('<div>').addClass('icon-profileCircle').html('P');
      var _name = $('<div>').addClass('name-profileCard').html(profile.name);
      var _city = $('<div>').addClass('city-profileCard').html(profile.city);
      var _category = $('<div>').addClass('category-profileCard')
      var _categories = '- ';
      var _keys = Object.keys(profile);
      if ($.inArray('proposals', _keys) >= 0 ){
        for (var j=0; j<profile.proposals.length; j++){
          _categories += Pard.Widgets.Dictionary(profile.proposals[j].category).render() + ' - ';
        }
      }
      else{_categories += Pard.Widgets.Dictionary(profile.category).render() + ' - ';}
      if (_categories.length>26)  _categories = _categories.substring(0,25)+'...';
      _category.html(_categories);
      _circle.append(_icon);
      _card.append(_circle, _name, _city, _category);
      _cardContainer.append(_card);

      _cardContainer.on('click', function(){
        console.log('flag');
      });

      return _cardContainer;
    }

    for (var i=0; i<profiles.length; i++){
      _createdWidget.append(createCard(profiles[i]));
    }

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.Footer = function(){

    var _createdWidget = $('<footer>').addClass('footer-bar');
    // var _contentContainer = $('<div>').addClass('pard-grid');
    // var _leftContent = $('<div>').addClass('left-bar-content').html('left');
    // var _rightContent = $('<div>').addClass('right-bar-content footer-right').html('right');

    // _contentContainer.append(_leftContent,_rightContent);
    // _createdWidget.append(_contentContainer);


    return{
      render: function(){
        return _createdWidget;
      }
    }
  }
 

}(Pard || {}));


