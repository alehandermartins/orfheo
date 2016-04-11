(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.SearchEngine = function (label) {

    var _createdWidget = $('<div>').addClass('search-engine-container');

    var _profiles = Pard.CachedProfiles['profiles'];

    var _searchTool = $('<div>').addClass('search-tool-container');
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

    _searchResult.append(Pard.Widgets.ProfileCards(_profiles).render());
    _searchTool.append(_searchMessage, Pard.Widgets.Input('Busca aquí','text').render());

    _searchWidget.css('width', '500');


    _createdWidget.append(_searchWidget, _searchResult);

    _searchWidget.select2({
      placeholder: 'Busca',
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
            page: params.page
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
      var tags = {};
      tags['query'] = [];
      _searchWidget.select2('data').forEach(function(tag){
        tags['query'].push(tag.text);
      });
      console.log(_searchWidget.select2('data'));
      Pard.Backend.searchProfiles(tags, function(data){
        _searchResult.empty();
        _searchResult.append(Pard.Widgets.ProfileCards(data.profiles).render());
      });
    });

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

    var _createdWidget =  $('<div>').addClass('row lateral-content-padding');

    profiles.forEach(function(profile){
      _createdWidget.append($('<div>').addClass('columns large-4').append(Pard.Widgets.CreateCard(profile).render().addClass('position-profileCard-login')));
    });

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }



  ns.Widgets.CreateCard = function(profile){

    var _card =$('<a>').attr({href: '/profile?id=' + profile['profile_id']}).addClass('profileCard');
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
    if ('proposals' in profile){
      profile.proposals.forEach(function(proposal){
        if (proposal.category) _categories += Pard.Widgets.Dictionary(proposal.category).render() + ' - ';
      })
    }
    else{ if (profile.category) _categories += Pard.Widgets.Dictionary(profile.category).render() + ' - ';}
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