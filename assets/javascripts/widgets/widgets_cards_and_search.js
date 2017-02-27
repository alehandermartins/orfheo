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

      var  _initialDistanceFromTop = $('.search-engine-container').offset().top;

      $(window).scroll(function(){

        if ($('.search-engine-container').height() - _initialDistanceFromTop - $(window).height() - $(window).scrollTop() <= 50 ){
          console.log('call')
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

    var _searchTagsBoxContainer = $('<div>').addClass('searchTagBox-containerEventPage')
    var _searchTagsBox = $('<div>').addClass('search-tag-box');

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

    var _organizationCatObj = {
      'festival':{},
      'association':{},
      'institution':{},
      'ngo':{},
      'collective':{},
      'interprise':{},
      'foundation':{}
    }

    var _typeObj = {
      'artist': _artisticCatObj, 
      'space': _spaceCatObj, 
      'organization': _organizationCatObj
    };
    
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

    _createdWidget.append(_searchInput, _searchTagsBoxContainer.append(_searchTagsBox), _searchResult);

    _searchWidget.select2({
      placeholder: Pard.t.text('widget.search.placeholder'),
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


    // CODE TO FIX!!!

    // if ($(window).width()<640) {
    //   _searchWidget.on('select2:opening', function(){
    //     var _distanceInputTop = _searchInput.offset().top;
    //     var _scroolTop = $('.whole-container').scrollTop();
    //      var _distanceToDo = _distanceInputTop + _scroolTop - 120;
    //      console.log(_scroolTop);
    //      console.log(_distanceInputTop);
    //      console.log(_distanceToDo);
    //     $('.whole-container').scrollTop(_distanceToDo);
    //   });
    // }

    
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
      _createdWidget.push(
        $('<div>')
          .addClass('card-container')
          .append(Pard.Widgets.CreateCard(profile).render()
            .addClass('position-profileCard-login')
            // .attr({
            //   target: '_blank'
            // })
          )
        );
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
    _card.hover(
      function(){
        _card.css({
          'border': '1px solid'+profile.color,
          'box-shadow': '0 1px 2px 1px '+ profile.color
        });
      },
      function(){
        _card.css({
          'box-shadow': '0px 1px 3px 0px rgba(10, 10, 10, 0.2)',
          'border': '1px solid rgba(10, 10, 10, 0.2)'
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
        { format: 'jpg', width: 174, height: 112,
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

    if (profile.type == 'artist' && 'productions' in profile){
      var _catArray = [];
      profile.productions.forEach(function(production){
        if (production.category && $.inArray(production.category, _catArray)<0){
          _catArray.push(production.category);
          _categories += Pard.Widgets.Dictionary(production.category).render() + ', ';
        }
      })
    }
    else if(profile.category) {_categories += Pard.Widgets.Dictionary(profile.category).render()+ ', ';;}

    if (_categories.length>28)  _categories = _categories.substring(0,25)+'...';
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
    var _texts = event.texts[Pard.UserInfo['lang']]; 
    if(!_texts) {
      _texts = event.texts[Object.keys(the_event.texts)[0]];
    }
    var _translatorSubC = _texts['subcategories'];

    var _card = $('<div>').addClass('eventCard')
      .css({
        'border-left-color': event.color
      });
    var _header = $('<div>').addClass('header-eventCard');

    var _eventName = $('<h6>').text(event.name).addClass('name-eventCard');
    var _eName =  Pard.Widgets.FitInBox(_eventName, 480, 40).render();
    var _name = $('<a>').addClass('name-eventCard').append($('<h6>').append(_eName.text())).attr({'href':'/event?id='+ event.event_id});
    
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
          'background': event.color
        }).addClass('circle-eventOrganizer')
    );
    var _organizerText = $('<div>').append($('<span>').text('Organiza: '), $('<a>').text(event.organizer).attr('href', '/profile?id='+event.profile_id)).addClass('text-container');
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
    event.target.forEach(function(profileType, i){
      _participants += _profileTypes[profileType];
      if (i == event.target.length - 2) _participants += 'y ';
      else _participants += ', '
    })
    _participants = _participants.substring(0, _participants.length - 2);
    var _now = new Date();
    if (_now.getTime()>_endDate.getTime() + 86400000) {
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
    var artistCat = Object.keys(event.texts['es'].subcategories.artist).map(function(cat){
      return event.texts['es'].subcategories.artist[cat]
    })
    artistCat = [].concat.apply([],artistCat);
    _cats = Pard.Widgets.UniqueArray(artistCat).map(function(cat){
      return _translatorSubC['artist'][cat];
    }).join(', ');
    var _catText = $('<div>').text(_cats).addClass('text-container'); 
    var _catIcon = $('<div>').addClass('icon-container').append(Pard.Widgets.IconManager('tags').render().css('font-size','1.3rem'));
    var _categories = $('<div>').append(_catIcon, _catText).addClass('info-element-eventCard');


    _infoContainer.append(_organizer, _place, _date, _call, _categories);

    var _triangle = $('<div>').addClass('manageCallBtn-eventCard')
      .css({
        'border-top-color': event.color
      });
    _card.append(_triangle);
    
    if (owner){
      var _callIcon = Pard.Widgets.IconManager('open_call').render().addClass('callIcon');
      var _toolIcon = Pard.Widgets.IconManager('tools').render().addClass('toolsIcon');  
      var _manageCallIcon = $('<div>').append(_callIcon, _toolIcon).addClass('manageCallIcon').attr('title','Manager del evento');
      var _toCallPage = $('<div>').append($('<a>').append(_manageCallIcon).attr('href','/event_manager?id='+event.event_id)).addClass('btn-container');
     _card.append(_toCallPage);
    }

   _card.append(_toCallPage);
    
    _card.append(_header.append(_name), _imgContainer, _infoContainer);

    return _card;  
  }


  ns.Widgets.NewsCard = function(news){
    var _newsCard  =$('<div>').addClass('newsCard');

    var _image = $('<div>').addClass('imgContainer-newsCard');
    var _img = $.cloudinary.image(news.img,{ format: 'png', width: 228, height: 140, crop: 'fill', effect: 'saturation:50' });
    _image.append(_img);

    var _info = $('<div>').addClass('infoContainer-newCard');
    var _cutTitle = Pard.Widgets.FitInBox($('<span>').append(news.title), 220, 48).render();
    var _title = $('<div>').append(_cutTitle).addClass('title-newsCard');
    var _text = $('<div>').append(news.text).addClass('text-newsCard');
    var _date = $('<div>').append($('<p>').html(moment(new Date(parseInt(news.date))).locale('es').format('DD MMM YYYY'))).addClass('date-newsCard');
    _info.append(_title, _text);
    
    _newsCard.append(_image, _info);

    var _popupNews;
    _image
      .hover(
        function(){
          _title.css('text-decoration','underline');
        },
        function(){
          _title.css('text-decoration','');
        }
      )
      .one('click', function(){
        if (!(_popupNews)){
          _popupNews = _newsPopup(news);
        }
      })
      .click(function(){
        _popupNews.open();
      });
    _title
      .one('click', function(){
        if (!(_popupNews)){
          _popupNews = _newsPopup(news);
        }
      })
      .click(function(){
        _popupNews.open();
      });

    var _textBox = $('<div>').append(
      $('<div>').html(news.title).css('font-weight','bold'),
      $('<div>').append($('<p>').html(news.text)).css('font-size','12px')
      )
      .css({
        'width':'220px'
      });
    $('body').append(_textBox);
    var _height = _textBox.height();
    _textBox.remove();
    if (_height > 93) _newsCard.append(
      $('<div>').addClass('dots-info-newsCard')
        .append($('<button>').attr('type','button').html('&#xE409;').addClass('material-icons'))
        .one('click', function(){
          if(!(_popupNews)) _popupNews = _newsPopup(news); 
        })
        .click(function(){
          _popupNews.open();
        })
      );

    if(news.title.length<29) _title.css('margin-bottom','0.3rem');

    var _publisherName = $('<span>').text(news.publisher).addClass('publisherName-newsCard');
    var _rfh = $('<div>').addClass('rfhLogo-news');
    var _icon = $('<div>').addClass('icon-whoNews');
    var _circle = $('<div>').addClass('whoCircle-news');
    _icon.append(_circle, _rfh);
    var _publisher = $('<div>').append(_icon, _publisherName).addClass('publisher-newsCard');
    var _footerNewsCard = $('<div>').css('position','relative')
      .append(_publisher, _date);

    _newsCard.append(_footerNewsCard);

    var _newsPopup = function(news){

      var _createdWidget = $('<div>').addClass('very-fast reveal full');
      var _popup = new Foundation.Reveal(_createdWidget, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out',multipleOpened:true});

      var _outerContainer = $('<div>').addClass('vcenter-outer');
      var _container = $('<div>').addClass('vcenter-inner');
      var _popupContent = $('<div>');
      _popupContent.addClass('popup-container-full'); 

      var _header = $('<div>').addClass('popup-header');
      var _popupImg = $('<div>').addClass('imagePopup-cardNews')
        .append( $.cloudinary.image(news.img,{ format: 'jpg',  width: 750, height:460, crop: 'fill', effect: 'saturation:50' }));
      var _closeBtn = $('<button>').addClass('close-button small-1 ').attr({'data-close': '', type: 'button', 'aria-label': 'Close alert'});
      _closeBtn.append($('<span>').attr('aria-hidden', true).html('&times;'))
        .click(function(){
          _popup.close();
        });
      _header.append(_popupImg, _closeBtn);

      var _sectionContainer = $('<section>').addClass('popup-content');
      var _popupTitle = $('<h4>').html(news.title).addClass('title-popup-cardNews');
      var _popupText = $('<div>').html(news.text);
      var _popupDate = $('<div>').append($('<p>').html(moment(new Date(parseInt(news.date))).locale('es').format('DD MMM YYYY'))).addClass('popupDate-newsCard');

      var _pupopPublisherName = $('<span>')
        .text(news.publisher)
        // .addClass('publisherNamePopup-newsCard');
      var _rfhPopup = $('<div>').addClass('rfhLogo-newsPopup')
      var _iconPopup = $('<div>')
        .addClass('whoCircle-newsPopup')
        .append(_rfhPopup);
      var _publisherPopup = $('<div>')
        .append(_iconPopup, _pupopPublisherName)
        .addClass('publisher-newsCard');
      var _footerPopup = $('<div>')
        .css({
        'position':'relative',
        'height':'3.5rem'
        })
        .append(_publisherPopup, _popupDate);
      _sectionContainer.append(_popupTitle, _popupText);
      _popupContent.append(_header, _sectionContainer, _footerPopup);
      _outerContainer.append(_container.append(_popupContent));
      _createdWidget.append(_outerContainer);
      $('body').append(_createdWidget);

      return{
        open: function(){
          _popup.open();
        },
        close: function(){
          _popup.close()
        }
      }
    }

    return _newsCard;
  }


}(Pard || {}));