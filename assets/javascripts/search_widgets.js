(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.SearchEngine = function () {

    var _createdWidget = $('<div>');

    var _profiles = Pard.CachedProfiles['profiles'];

    var _searchTools = $('<div>').addClass('row lateral-content-padding');
    var _searchResult = $('<div>');

    var _filters = $('<div>').addClass('medium-7 columns');
    var _searchByName = $('<div>').addClass('medium-5 columns');
    
    var _selectorsLabel = $('<label>').text('Filtros');
    var _searchByNameLabel = $('<label>').text('Busqueda por nombre');

    var _labelsTypes = ['- Tipo de perfil -', 'Artista', 'Espacio'];
    var _valuesTypes = ['none', 'artist', 'space'];

    var _catSelector = $('<span>');
    var _catSelectorDefault = Pard.Widgets.Selector(['- Categoría -'], ['none']);
    _catSelectorDefault.setClass('filter-select');
    _catSelectorDefault.disable();
    _catSelector.append(_catSelectorDefault.render());

    var _labelsCat ={
      artist: ['- Categoría -', 'Musica', 'Artes Escénicas', 'Exposición', 'Poesia',  'Audiovisual', 'Street Art', 'Taller', 'Otros'],
      space: ['- Categoría -','Asociacion Cultural', 'Local Comercial', 'Espacio Particular']
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
        profiles.forEach(function(profile, index){
          if (profile.type === _type) _profiles.push(profile);
        });
        _searchResult.empty();
        _searchResult.append(Pard.Widgets.ProfileCards(_profiles).render()); 
      }
      else{
        _catSelector.html(_catSelectorDefault.render());
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
      profiles.forEach(function(profile, index){
        _keys = Object.keys(profile);
        if ($.inArray('proposals', _keys) >= 0 ){        
          profile.proposals.forEach(function(proposal){
            if (proposal.category === _cat) _profiles.push(profile);
          })
        }
        else{
          if (profile.category === _cat) _profiles.push(profile);
        }
      }); 
        _searchResult.empty();
        _searchResult.append(Pard.Widgets.ProfileCards(_profiles).render()); 
      }
      else{
        TypeCallbackBound();
      }
    }

    var searchCallback = function(textInput){
      var _input = textInput.val();
      if (_input != ''){
        _profiles = [];
        profiles.forEach(function(profile){
          if (profile.name === _input) _profiles.push(profile);        
        });
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

    var _searchWidget = Pard.Widgets.SearchByName(_profiles, searchCallback).render();

    _searchResult.append(Pard.Widgets.ProfileCards(_profiles).render());

    _searchByName.append(_searchByNameLabel, _searchWidget);
    _filters.append(_selectorsLabel,_typesSelector.render(), _catSelector);
    _searchTools.append(_filters, _searchByName);
    _createdWidget.append(_searchTools, _searchResult);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }
  

  ns.Widgets.SearchByName = function(profiles, callback){
    var _searchWidget = $('<div>').addClass('ui-widget');
    var _textInput = Pard.Widgets.Input('', 'text');
    _textInput.setClass('search-input');

    var _availableTags = [];

    profiles.forEach(function(profile, index){
      _availableTags[index] = profile.name;
    });

    _textInput = _textInput.render(); 
    _textInput.autocomplete({
      source: _availableTags,
      minLength: 2
    });

    var _searchBtn = $('<button>').html('&#x0533;').attr({type: 'button'}).click(function(){callback(_textInput)});
    _searchBtn.addClass('search-btn');

    _searchWidget.append(_textInput,_searchBtn);

    return {
      render: function(){
        return _searchWidget;
      }
    }
  }


  ns.Widgets.ProfileCards = function (profiles) {

    var _createdWidget =  $('<div>').addClass('row lateral-content-padding search-results');

    profiles.forEach(function(profile){
      _createdWidget.append($('<div>').addClass('columns large-4').append(Pard.Widgets.CreateCard(profile).render().addClass('position-profileCard-login')));
    });

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }



  ns.Widgets.CreateCard = function(profile, callback){

    var _card =$('<div>').addClass('profileCard');
    _card.css({border: 'solid 3px'+profile.color});
    _card.hover(
      function(){
        $(this).css({'box-shadow': '0 0 6px 1px '+ profile.color});
      },
      function(){
        $(this).css({'box-shadow': '0px 1px 2px 1px rgba(10, 10, 10, 0.2)'});
      }
    );
    
    var _photoContainer = $('<div>').addClass('photo-container-card');
    _photoContainer.css({background: profile.color});  
    var _circle = $('<div>').addClass('circleProfile position-circleProfile-card').css({background: profile.color});
    var _icon = $('<div>').addClass('icon-profileCircle').html('P');
    var _colorIcon = Pard.Widgets.IconColor(profile.color).render();
    _icon.css({color: _colorIcon});
    var _profilename = profile.name;
    if (_profilename.length>38) _profilename = _profilename.substring(0,35)+'...';
    var _name = $('<div>').addClass('name-profileCard').html(_profilename);
    var _profilecity;
    if (profile.city) _profilecity = profile.city;
    else _profilecity = profile.address.locality; 
    if (_profilecity.length>24) _profilecity = _profilecity.substring(0,21)+'...';
    var _city = $('<div>').addClass('city-profileCard').html(_profilecity);
    var _category = $('<div>').addClass('category-profileCard');
    var _categories = '- ';
    var _keys = Object.keys(profile);
    if ($.inArray('proposals', _keys) >= 0 ){
      profile.proposals.forEach(function(proposal){
        _categories += Pard.Widgets.Dictionary(proposal.category).render() + ' - ';
      })
    }
    else{_categories += Pard.Widgets.Dictionary(profile.category).render() + ' - ';}
    if (_categories.length>26)  _categories = _categories.substring(0,25)+'...';
    _category.html(_categories);
    _circle.append(_icon);
    _card.append(_photoContainer, _circle, _name, _city, _category);

    _card.on('click', function(){
      if (callback) callback();
    });

    return {
      render: function(){
        return _card;
      }
    }
  }

}(Pard || {}));