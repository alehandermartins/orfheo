(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.SearchEngine = function (label, event_id) {

    var _createdWidget = $('<div>').addClass('search-engine-container');

    var _searchResult = $('<div>').addClass('search-results');
    var _searchMessage = $('<div>').append($('<p>').text(label));
    var _searchWidget = $('<select>');


    function formatResource (resource) {
      if(!resource.id) return resource.text;
      var _label = $('<span>').text(resource.text);
      if(resource.type == 'city') var _icon = Pard.Widgets.IconManager('city_artist').render();
      else { var _icon = Pard.Widgets.IconManager(resource.icon).render();}
      _label.append(_icon);
      _icon.css({
        position: 'relative',
        left: '5px',
        top: '5px',
      });
      return _label;
    };

    var _shown = [];
    var tags = [];
    var _toBeShown = [];

    Pard.Backend.searchProfiles([], [], event_id, function(data){
      _toBeShown = [];
      data.profiles.forEach(function(profile){
        if ($.inArray(profile.profile_id, _shown) == -1) {
          _shown.push(profile.profile_id);
          _toBeShown.push(profile);
        }      
      });
      Pard.Widgets.ProfileCards(_toBeShown).render().forEach(function(profileCard){
        _searchResult.append(profileCard);
      });

      $('.whole-container').scroll(function(){
        if ($('.whole-container').scrollTop() + $(window).height() + 100 >= ($('#main-welcome-page').height() + $('.login-bar').height() + $('.footer-bar').height())){
          tags = [];
          _searchWidget.select2('data').forEach(function(tag){
            tags.push(tag.text);
          });
          Pard.Backend.searchProfiles(tags, _shown, event_id, function(data){
            _toBeShown = [];
            data.profiles.forEach(function(profile){
              if ($.inArray(profile.profile_id, _shown) == -1) {
                _shown.push(profile.profile_id);
                _toBeShown.push(profile);
              }      
            });
            if (_toBeShown.length) {
              Pard.Widgets.ProfileCards(_toBeShown).render().forEach(function(profileCard){
                _searchResult.append(profileCard);
              });
            }          
          });
        }
      });
    });

    var _searchInput = $('<div>').addClass('search-input');
    _searchInput.append(_searchWidget);

    var _searchTagsBox = $('<div>').addClass('search-input search-tag-box');

    var _artisticCatObj = {
      'arts':{},
      'audiovisual':{}, 
      'expo':{}, 
      'music':{},
      'poetry':{}, 
      'street_art':{}, 
      'workshop':{}, 
      'other':{}
    };

    var _spaceCatObj = {
      'cultural_ass':{},
      'commercial':{},
      'home':{}, 
      'open_air':{}
    };

    var _typeObj = {
      'artist': _artisticCatObj, 
      'space': _spaceCatObj, 
      'organization': _organizationObj
    };
    
    var _organizationObj = {};

    var _objDictionary = function(data, obj){
      for (var field in obj) {
        if (data.toUpperCase() == Pard.Widgets.Dictionary(field).render().toUpperCase()) {return obj[field];}
        else _objDictionary(Pard.Widgets.Dictionary(field).render(), obj[field]);
      }
    }


    var _printTagFromObj = function(obj, field){
      var _typeTag = $('<div>').addClass('suggested-tag-search-engine');
      _typeTag.click(function(){
        var _text = Pard.Widgets.Dictionary(field).render();
        var option = new Option(_text, _text, true, true);
        _searchWidget.append(option);
        _searchWidget.trigger('change');
        _printTags(obj[field]);
      });
      var _icon = Pard.Widgets.IconManager(field).render();
      _icon.addClass('search-tag-icon');
      var _tagSpan = $('<span>').css('vertical-align','middle');
      _typeTag.append(_tagSpan.append(_icon, Pard.Widgets.Dictionary(field).render()));
      _searchTagsBox.append(_typeTag);
    };
    
    var _printTags = function(obj){   
      _searchTagsBox.empty();   
      for (var field in obj){
        _printTagFromObj(obj, field);
      }
    }

    _printTags(_typeObj);

    _createdWidget.append(_searchInput, _searchTagsBox, _searchResult);

    _searchWidget.select2({
      placeholder: 'Busca por tags',
      ajax: {
        url: '/search/suggest',
        type: 'POST',
        dataType: 'json',
        delay: 250,
        data: function (params) {
          var _query = [];
          _searchWidget.select2('data').forEach(function(element){
            _query.push(element.id);
          });
          _query.push(params.term);
          return {
            query: _query,
            page: params.page,
            event_id: event_id
          };
        },
        processResults: function (data, params) {
          // parse the results into the format expected by Select2
          // since we are using custom formatting functions we do not need to
          // alter the remote JSON data, except to indicate that infinite
          // scrolling can be used
          params.page = params.page || 1;
          return {
            results: data.items,
            pagination: {
              more: (params.page * 30) < data.total_count
            }
          };
        }
      },
      multiple: true,
      tags: true,
      tokenSeparators: [',', ' '],   
      // createTag: function (tag) {
      //   return {
      //       id: tag.term,
      //       text: tag.term,
      //       isNew : true
      //   };
      // },
      templateResult: formatResource,
    }).on("select2:select", function(e) {
      if(_searchWidget.select2('data') != false){
        if(e.params.data.isNew){
          $(this).find('[value="'+e.params.data.id+'"]').replaceWith('<option selected value="'+e.params.data.id+'">'+e.params.data.text+'</option>');
        }
      }
    });


    _searchWidget.on('change', function(){
      _shown = [];
      tags = [];
      _searchResult.empty();
      var _dataArray = _searchWidget.select2('data'); 
      _dataArray.forEach(function(tag){
        tags.push(tag.text);
      });
      Pard.Backend.searchProfiles(tags, _shown, event_id, function(data){
        _toBeShown = [];
        data.profiles.forEach(function(profile){
          if ($.inArray(profile.profile_id, _shown) == -1) {
            _shown.push(profile.profile_id);
            _toBeShown.push(profile);
          }      
        });
        Pard.Widgets.ProfileCards(_toBeShown).render().forEach(function(profileCard){
        _searchResult.append(profileCard);
      })
      });
      if (_dataArray.length) _printTags(_objDictionary(_dataArray[_dataArray.length-1]['text'], _typeObj));
      else _printTags(_typeObj);
    });
    
    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ProfileCards = function (profiles) {

    var _createdWidget =  [];

    profiles.forEach(function(profile){
      _createdWidget.push($('<div>').addClass('card-container').append(Pard.Widgets.CreateCard(profile).render().addClass('position-profileCard-login').attr({
      target: '_blank'
      })));
    });

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }



  ns.Widgets.CreateCard = function(profile){

    var _card =$('<a>').attr({
      href: '/profile?id=' + profile['profile_id']
    }).addClass('profileCard');
    var _rgb = Pard.Widgets.IconColor(profile['color']).rgb();
    _card.css({border: 'solid 3px'+profile.color});
    _card.hover(
      function(){
        $(this).css({
        'box-shadow': '0 0 2px 1px'+ profile.color
        // 'background': 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+'.1'+ ')'
      });
      },
      function(){
        $(this).css({
          'box-shadow': '0px 1px 2px 1px rgba(10, 10, 10, 0.2)'
          // 'background':'white'
        });
      }
    );
    
    var _photoContainer = $('<div>').addClass('photo-container-card');
    _photoContainer.css({background: profile.color});  

    if('profile_picture' in profile && profile.profile_picture != null){
      var _photo = $.cloudinary.image(profile['profile_picture'][0],
        { format: 'jpg', width: 164, height: 60,
          crop: 'fill', effect: 'saturation:50' });
      _photoContainer.append(_photo);
    };

    var _circle = $('<div>').addClass('circleProfile position-circleProfile-card').css({background: profile.color});
    var _icon = $('<div>').addClass('icon-profileCircle').html(Pard.Widgets.IconManager(profile.type).render());
    var _colorIcon = Pard.Widgets.IconColor(profile.color).render();
    _icon.css({color: _colorIcon});
    var _profilename = $('<span>').text(profile.name);
    // if (_profilename.length>38) _profilename = _profilename.substring(0,35)+'...';
    var _name = Pard.Widgets.FitInBox(_profilename, 165, 45).render();
    _name.addClass('name-profileCard');
    var _profilecity;
    if (profile.city) _profilecity = profile.city;
    else _profilecity = profile.address.locality; 
    if (_profilecity.length>24) _profilecity = _profilecity.substring(0,21)+'...';
    var _city = $('<div>').addClass('city-profileCard').html(_profilecity);
    var _category = $('<div>').addClass('category-profileCard');
    var _categories = '- ';
    var _keys = Object.keys(profile);

    if ('productions' in profile){
      var _catArray = [];
      profile.productions.forEach(function(production){
        if (production.category && $.inArray(production.category, _catArray)){
          _catArray.push(production.category);
          _categories += Pard.Widgets.Dictionary(production.category).render() + ' - ';
        }
      })
    }
    else if (profile.category) {_categories += Pard.Widgets.Dictionary(profile.category).render() + ' - ';}
// CONFUSION ----> INFO HARDCODED!!
    else if (profile.profile_id == 'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83') _categories += 'Festival' + ' - '
// TO BE CHANGED WHEN CORGANIZATION CATEGORIES DEFINED

    if (_categories.length>26)  _categories = _categories.substring(0,25)+'...';
    _category.html(_categories);
    _circle.append(_icon);
    _card.append(_photoContainer, _circle, _name, _city, _category);
    
    return {
      render: function(){
        return _card;
      }
    }
  }

}(Pard || {}));