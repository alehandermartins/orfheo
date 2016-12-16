'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.SearchEngine = function(main_id, event_id) {

    var _createdWidget = $('<div>').addClass('search-engine-container');
    var _main_id = '#' + main_id;
    var _searchResult = $('<div>').addClass('search-results');
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
    var _noMoreResults = false;

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
        if ($('.whole-container').scrollTop() + $(window).height() + 100 >= ($(_main_id).height() + $('.login-bar').height() + $('.footer-bar').height())){
          if(!_searchWidget.hasClass('active')){
            _searchWidget.addClass('active');
            var spinner =  new Spinner({top: _searchResult.height()}).spin();
            $.wait(
              '', 
              function(){
              if (!(_noMoreResults)) _searchResult.append(spinner.el); 
              }, 
              function(){
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
                  else{
                    _noMoreResults = true;
                  }
                  spinner.stop();
                  _searchWidget.removeClass('active');
                });
              }
            );
          }
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
      'gastronomy':{}, 
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

    if ($(window).width()<640) {
      _searchWidget.on('select2:opening', function(){
        var _distanceInputTop = _searchInput.offset().top;
        var _scroolTop = $('.whole-container').scrollTop();
        var _distanceToDo = _distanceInputTop + _scroolTop - 120; 
        // var _headerHeight = $('header').height();
        // var _distanceToDo = _distanceInputTop + _scroolTop - _headerHeight - 10; 
        $('.whole-container').scrollTop(_distanceToDo);
      });
    }
    
    var _search = function(){

      var spinner =  new Spinner().spin();
      $.wait(
        '', 
        function(){
          _searchResult.empty();  
          if (!(_noMoreResults)) _searchResult.append(spinner.el); 
        }, 
        function(){
          _shown = [];
          tags = [];

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
            if(_shown.length && _toBeShown.length){
              Pard.Widgets.ProfileCards(_toBeShown).render().forEach(
                function(profileCard){
                  _searchResult.append(profileCard);
                }
              )
            }
            else {
              var _message = $('<h6>').text('Ningún resultado').css('color','#6f6f6f');
              _searchResult.append(_message);
              _noMoreResults = true;
            }
          });
          if (_dataArray.length) _printTags(_objDictionary(_dataArray[_dataArray.length-1]['text'], _typeObj));
          else _printTags(_typeObj);
          spinner.stop();
        }
      );
    }


    _searchWidget.on('change', function(){
      _noMoreResults = false;
      _search();
    });


    return{
      render: function(){
        return _createdWidget;
      },
      activate: function(){
        if(_searchWidget.hasClass('active')) _searchWidget.removeClass('active');
      },
      deactivate: function(){
        if(!_searchWidget.hasClass('active')) _searchWidget.addClass('active');
      },
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
    _card.css({'border-color': profile.color});
    _card.hover(
      function(){
        _card.css({
        'box-shadow': '0 0 2px 1px'+ profile.color
      });
      },
      function(){
        _card.css({'border': '2px solid'+profile.color, 
          'box-shadow': '0px 1px 2px 1px rgba(10, 10, 10, 0.2)'
        });
      }
    );
    
    var _photoContainer = $('<div>').addClass('photo-container-card');
    _photoContainer.css({background: profile.color});  

    if (profile.type == 'space' && !(profile.profile_picture)){ 
      if (profile.photos) profile.profile_picture = [profile.photos[0]];
    } 

    if('profile_picture' in profile && profile.profile_picture != null){
      var _photo = $.cloudinary.image(profile['profile_picture'][0],
        { format: 'jpg', width: 170, height: 112,
          crop: 'fill', effect: 'saturation:50' });
      _photoContainer.append(_photo);
    };

    var _circle = $('<div>').addClass('circleProfile position-circleProfile-card').css({background: profile.color});
    var _icon = $('<div>').addClass('icon-profileCircle').html(Pard.Widgets.IconManager(profile.type).render());
    var _colorIcon = Pard.Widgets.IconColor(profile.color).render();
    _icon.css({color: _colorIcon});
    var _profilename = $('<span>').text(profile.name);
    var _name = Pard.Widgets.FitInBox(_profilename, 165, 45).render();
    _name.addClass('name-profileCard');
    var _profilecity;
    if (profile.city) _profilecity = profile.city;
    else _profilecity = profile.address.locality; 
    if (_profilecity.length>28) _profilecity = _profilecity.substring(0,25)+'...';
    var _city = $('<div>').addClass('locality-profileCard').html(_profilecity);
    var _hline = $('<hr>').addClass('hline-profileCard');
    var _category = $('<div>').addClass('category-profileCard');
    var _categories = ''; 
    var _keys = Object.keys(profile);

    if ('productions' in profile){
      var _catArray = [];
      profile.productions.forEach(function(production){
        if (production.category && $.inArray(production.category, _catArray)<0){
          _catArray.push(production.category);
          _categories += Pard.Widgets.Dictionary(production.category).render() + ', ';
        }
      })
    }
    else if (profile.category) {_categories += Pard.Widgets.Dictionary(profile.category).render()+ ', ';;}

    if (_categories.length>28)  _categories = _categories.substring(0,27)+'...';
    else{
      _categories = _categories.substring(0, _categories.length-2)
    }
    _category.html(_categories);
    _circle.append(_icon);
    _card.append(_photoContainer, _circle, _name, _hline, _city, _category);
    
    return {
      render: function(){
        return _card;
      }
    }
  }

  ns.Widgets.EventCard = function(event, owner){
    console.log(owner);
    var _card = $('<div>').addClass('eventCard');
    var _header = $('<div>').addClass('header-eventCard');

    var _name = $('<a>').addClass('name-eventCard').append($('<h6>').text(event.name)).attr({'href':'/event?id='+ event.event_id});
    var _baseline = $('<div>').addClass('baseline-eventCard').text(event.baseline);
    
    var _imgContainer = $('<div>').addClass('imgContainer-eventCard');
    var _img = $.cloudinary.image(event['img'],
        { format: 'jpg', width: 152, height: 200,
          crop: 'fit', effect: 'saturation:50' });
    var _popup;
    _img.one('mouseover', function(){
      var _popupImg = $.cloudinary.image(event.img,{format: 'jpg',  width: 450, effect: 'saturation:50' });
      var _popupWidget = $('<div>').addClass('very-fast reveal full');
      var _outerContainer = $('<div>').addClass('vcenter-outer');
      var _innerContainer = $('<div>').addClass('vcenter-inner');
      var _closeBtn = $('<button>').addClass('close-button small-1 popup-close-btn').attr({type: 'button'});
      _closeBtn.append($('<span>').html('&times;'));
      _popup = new Foundation.Reveal(_popupWidget, {animationIn: 'fade-in', animationOut: 'fade-out'});
      _closeBtn.click(function(){
        _popup.close();
      });
      var _popupContent = $('<div>').addClass('popup-photo-container').append(_popupImg,_closeBtn).css('max-width','450px');
      _innerContainer.append(_popupContent);
      _popupWidget.append(_outerContainer.append(_innerContainer));
      $('body').append(_popupWidget);
    });
    _img.click(function(){
      _popup.open();
    });
    _imgContainer.append(_img);
    
    var _infoContainer = $('<div>').addClass('info-eventCard');
   
    var _organzerIcon = $('<div>').addClass('icon-container')
      .append($('<span>').css({
          'background': '#bebebe'
        }).addClass('circle-eventOrganizer')
    );
    var _organizerText = $('<div>').append($('<span>').text('Organiza '), $('<a>').text(event.organizer).attr('href', '/profile?id='+event.profile_id)).addClass('text-container');
    var _organizer = $('<div>').append(_organzerIcon, _organizerText).addClass('info-element-eventCard');
   
    var _placeIcon = $('<div>').addClass('icon-container').append(Pard.Widgets.IconManager('location').render());
    var _placeText = $('<div>').append($('<a>')
        .attr({
          href: 'http://maps.google.com/maps?q='+event['address']['locality']+' '+event['address']['postal_code'],
          target: '_blank'
        })
        .text(event['address']['locality']))
      .addClass('text-container');
    var _place = $('<div>').append(_placeIcon, _placeText).addClass('info-element-eventCard');
   
    var _dateIcon = $('<div>').addClass('icon-container').append(Pard.Widgets.IconManager('calendar').render());
    var _startDate = new Date(Object.keys(event.eventTime)[0]);
    var _endDate = new Date(Object.keys(event.eventTime)[Object.keys(event.eventTime).length-2]);
    var _dateText = $('<div>').append($('<span>').text(moment(_startDate).locale('es').format('DD')+'-'+moment(_endDate).locale('es').format('DD MMMM YYYY'))).addClass('text-container'); 
    var _date = $('<div>').append(_dateIcon, _dateText).addClass('info-element-eventCard');
    
    var _callIcon = $('<div>').addClass('icon-container').append(Pard.Widgets.IconManager('open_call').render());
    var _callText = $('<div>').addClass('text-container'); 
    var _profileTypes = {
      artist: 'artistas',
      space: 'espacios',
      organization: 'organizaciones'
    }
    var _participants = '';
    Object.keys(event.categories).forEach(function(profileType, i){
      _participants += _profileTypes[profileType];
      if (i == Object.keys(event.categories).length-2) _participants += 'y ';
      else _participants += ', '
    })
    _participants = _participants.substring(0, _participants.length-2);
    var _now = new Date();
    if (_now.getTime()>_endDate.getTime()+ 86400000) {
        _callText.append('Evento terminado')
    }
    else if (event.published){
      var _toEventPageBtn = $('<a>').text('¡Programación online!').attr('href','/event?id='+event.event_id);
      _callText.append(_toEventPageBtn);
    }
    else if (_now.getTime() < parseInt(event.start)){
      _callText.append($('<p>').text('Apertura convocatoria: ',moment(parseInt(parseInt(event.start))).locale('es').format('DD MMMM YYYY')), $('<p>').text('para '+_participants));
    }
    else if (_now.getTime() < parseInt(event.deadline)){
      _callText.append($('<p>').append($('<a>').text('Convocatoria abierta').attr({'href':'/event?id='+ event.event_id}),$('<span>').text(' hasta el '+ moment(parseInt(event.deadline)).locale('es').format('DD-MM-YYYY'))),$('<p>').text('para '+_participants));
    }
    else{
       _callText.append('Convocatoria cerrada');
    }
    var _call = $('<div>').append(_callIcon, _callText).addClass('info-element-eventCard');
    var _conditionIcon = $('<div>').addClass('icon-container').append(Pard.Widgets.IconManager('conditions').render());
    var _conditionText = $('<div>').append($('<a>').text('Bases de participación').attr({'href':event.conditions,'target':'_blank'})).addClass('text-container'); 
    var _conditions = $('<div>').append(_conditionIcon, _conditionText).addClass('info-element-eventCard');

    _infoContainer.append(_organizer, _place, _date, _call, _conditions);

    var _footer = $('<div>').addClass('footer-eventCard');
    var _categories = '';
    for (var cat in event.categories.artist){
      _categories += cat + ', ';
    };
    _categories = _categories.substring(0,_categories.length-2)
    _footer.append($('<p>').append(_categories));

    if (owner){
      var _callIcon = Pard.Widgets.IconManager('open_call').render().addClass('callIcon');
      var _toolIcon = Pard.Widgets.IconManager('tools').render().addClass('toolsIcon');  
      var _manageCallIcon = $('<div>').append(_callIcon, _toolIcon).addClass('manageCallIcon').attr('title','Gestiona convocatoria');
      var _toCallPage = $('<div>').append($('<a>').append(_manageCallIcon).attr('href','/event_manager?id='+event.event_id)).addClass('btn-container');
      var _triangle = $('<div>').addClass('manageCallBtn-eventCard').append();

     _card.append(_triangle,_toCallPage);
    }
    
    _card.append(_header.append(_name, _baseline), _imgContainer, _infoContainer, _footer);

    return _card;  
  }


}(Pard || {}));