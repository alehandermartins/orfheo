'use strict';

(function(ns){
     
ns.Widgets = ns.Widgets || {};

  ns.Widgets.NewsWelcomeSection = function(){
    var _createdWidget = $('<div>')
    var _cards = $('<div>').addClass('welcomeSection-container');
    var _searchResult = $('<div>').addClass('search-results-WelcomePage');

    Pard.NewsArray.forEach(function(news){
      var _nwcard = Pard.Widgets.NewsCard(news);
      _searchResult.append(
        $('<div>').append(_nwcard)
          .addClass('newsCard-welcomePage-container')
      );
    });

    _cards.append(_searchResult);

    _createdWidget.append(_cards);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.EventsWelcomeSection = function(){
    var _createdWidget = $('<div>')
    var _cards = $('<div>').addClass('welcomeSection-container');
    var _searchResult = $('<div>').addClass('search-results-WelcomePage');

    var _createdWidget = $('<div>');
    if (Pard.UserStatus['status'] == 'owner') var _myProfilesId = Pard.CachedProfiles.map(function(profile){
      return profile.profile_id
    })
    else var _myProfilesId = [];
    Pard.Backend.events(function(data){   
      var events = data.events;
      events.forEach(function(event){
        var _myEvent = ($.inArray(event.profile_id, _myProfilesId))>-1;
        var _eventCardContainer = $('<div>').append($('<div>').append(Pard.Widgets.EventCard(event, _myEvent)).addClass('eventCard-container-welcomePage')).addClass('outer-eventCard-container-welcomePage');
        _searchResult.prepend(_eventCardContainer);
      })
    }); 

    var _titleEventText = $('<h4>').text('Contáctanos para crear tu evento');
    var _eventText = $('<button>').attr('type','button')
      // .text('¡Hazlo ya!')
      .append(Pard.Widgets.IconManager('navigation_right').render()
        .addClass('navigationIcon-findOutMore'))
      .click(function(){
        $('#contactPopupBtn').trigger('click');
      })
      .addClass('callText-WelcomePage').css('margin-top','0');
    var _textDiv = $('<div>').addClass('littleTextDiv').append(
      $('<div>').append(_titleEventText.append(_eventText)).addClass('welcomeSection-container'));
    _searchResult.css({
      'min-height': 'calc(100vh - 4.5rem - 1.8rem - 7.9rem)'
    })
    _createdWidget.append(_cards.append(_searchResult), _textDiv);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ProfilesWelcomeSection = function(){
    var _createdWidget = $('<div>')
    var _cards = $('<div>').addClass('welcomeSection-container');
    var _searchResult = $('<div>').addClass('search-results-WelcomePage');
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

    Pard.Backend.searchProfiles([], [], '', function(data){
      _toBeShown = [];
      data.profiles.forEach(function(profile){
        if ($.inArray(profile.profile_id, _shown) == -1) {
          _shown.push(profile.profile_id);
          _toBeShown.push(profile);
        }      
      });
      _toBeShown.forEach(function(profile){
        _searchResult.append(
          $('<div>').addClass('card-container-WelcomePage')
            .append(Pard.Widgets.CreateCard(profile).render().addClass('position-profileCard-login')
            .attr({
              target: '_blank'
            })
          )
        );
      });

      $(window).scroll(function(){
        if ($('.search-results-WelcomePage').height() + 84 +130 - $(window).height() - $(window).scrollTop() <= 100 ){
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
                Pard.Backend.searchProfiles(tags, _shown, '', function(data){
                  _toBeShown = [];
                  data.profiles.forEach(function(profile){
                    if ($.inArray(profile.profile_id, _shown) == -1) {
                      _shown.push(profile.profile_id);
                      _toBeShown.push(profile);
                    }      
                  });
                  if (_toBeShown.length) {
                    _toBeShown.forEach(function(profile){
                      _searchResult.append(
                        $('<div>').addClass('card-container-WelcomePage')
                          .append(Pard.Widgets.CreateCard(profile).render().addClass('position-profileCard-login')
                          .attr({
                            target: '_blank'
                          })
                        )
                      );
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

    var _searchInputContainer = $('<div>').addClass('search-input-WelcomePage-Container');
    var _searchIcon = $('<div>').append(Pard.Widgets.IconManager('search').render()).addClass('searchIcon-searchWidget-container');
    // $('<div>').addClass('rfhIcon-searchWidget')).addClass('rfhIcon-searchWidget-container'
    var _cleanIcon = $('<div>')
      .append($('<button>')
        .attr('type','button')
        .addClass('cleanIcon-searchWidget')
        .html('&times;'))
        .click(function(){
          if (_searchWidget.val()) _searchWidget.val('').trigger('change');
        })  
      .addClass('cleanIcon-searchWidget-container');
    var _searchInput = $('<div>').append(_searchWidget, _searchIcon, _cleanIcon).addClass('search-input-WelcomePage');
    _searchInputContainer.append(_searchInput);

    var _searchTagsBox = $('<div>').addClass('search-tag-box');
    var _searchTagsBoxCont = $('<div>').addClass('search-tag-box-container');

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

    _searchInputContainer.append(_searchTagsBoxCont.append(_searchTagsBox));
    _cards.append(_searchResult);

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
            event_id: ''
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
          Pard.Backend.searchProfiles(tags, _shown, '', function(data){
            _toBeShown = [];
            data.profiles.forEach(function(profile){
              if ($.inArray(profile.profile_id, _shown) == -1) {
                _shown.push(profile.profile_id);
                _toBeShown.push(profile);
              }      
            });
            if(_shown.length && _toBeShown.length){
              _toBeShown.forEach(function(profile){
                _searchResult.append(
                  $('<div>').addClass('card-container-WelcomePage')
                    .append(Pard.Widgets.CreateCard(profile).render().addClass('position-profileCard-login')
                    .attr({
                      target: '_blank'
                    })
                  )
                );
              });
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

    _createdWidget.append(_searchInputContainer, _cards);

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



  ns.Widgets.WelcomeSection = function(){

    var _section = $('<section>').addClass('welcomeSection-layout');

    var _entryDiv = $('<div>').addClass('entryDiv');
    var _entryContentContainer = $('<div>').addClass('welcomeSection-container');
    var _entryContent = $('<div>').addClass('entryDiv-content');
    var _logo = $('<span>').append($('<div>').addClass('mainLogo-welcomePage'));
    var _logoBaseline = $('<div>').append($('<p>').text('your cultural community')).addClass('logoBaseline-welcomePage');
    var _logoContainer = $('<div>')
      .append($('<div>')
        .append(_logo, _logoBaseline).addClass('entryLogoContainer')
      )
      .css({
        'position': 'relative',
        'height': '100px',
        'margin-top':'2rem'
      });

    var _signUpBtn = Pard.Widgets.SignUpButton().render().addClass('signUpBtnWelcomePage')

    var _cardsContainer = $('<div>')
      .css({
        'position':'relative',
        'margin-top':'2.5rem',
        'padding-bottom':'1rem'
      });
    var _cardSlider = $('<div>').addClass('card-slider');
    _cardsContainer.append(_cardSlider);

    var _printCarousel = function(profilesArray){
      _cardSlider.empty();
      [10,11,0,1,2].forEach(function(index){
        var profile = profilesArray[index];
        var _profileCard = Pard.Widgets.CreateCard(profile).render()
          .addClass('carousel');
        if(index) _profileCard .click(
          function(){
            _cardSlider.fadeOut(function(){
              var _reorderedProfilesArray = Pard.Widgets.ReorderArray(profilesArray, index).render();
              _printCarousel(_reorderedProfilesArray);
            })
          })
        var _cardCont = $('<div>').addClass('cardCont-cardSlider')
          .append(_profileCard);
        if (index) _profileCard.attr('href','#/');
        if (index == 0) _cardCont.addClass('cardSelected slick-center');
        else if (index == 1 || index == 11) _cardCont.addClass('slick-active');
        else _cardCont.addClass('slick-slide');
        _cardSlider.append(_cardCont);
      });
      var _rgb = Pard.Widgets.IconColor(profilesArray[0].color).rgb();
      var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
      _entryDiv.css({'background':_backColor});
      _cardSlider.fadeIn();
    }

    var _shown = [];

    Pard.Backend.searchProfiles([], [], '', function(data){
      var _profilesArray = [];
      data.profiles.forEach(function(profile){
        if ($.inArray(profile.profile_id, _shown) == -1) {
          _shown.push(profile.profile_id);
          _profilesArray.push(profile);
        }      
      });
      _printCarousel(_profilesArray);
    });

    _entryContent.append(_logoContainer, _signUpBtn,  _cardsContainer);
    _entryDiv.append(_entryContentContainer.append(_entryContent));
    
    var _titleLittleText = $('<h4>').text('Nuevas posibilidades culturales creadas por conexiones y enlaces');
    var _callLittleText = $('<button>').attr('type','button')
      .text('Déjate inspirar')
      .append(Pard.Widgets.IconManager('navigation_right').render()
        .addClass('navigationIcon-findOutMore'))
      .click(function(){
        $('#projectPopupBtn').trigger('click');
      })
      .addClass('callText-WelcomePage');
    var _littleTextDiv= $('<div>').addClass('littleTextDiv').append(
      $('<div>').append(_titleLittleText, _callLittleText).addClass('welcomeSection-container'));

    var _actionDiv = $('<div>').addClass('actionDiv');
    var _actionContainer = $('<div>').addClass('welcomeSection-container');
    var _info1 = $('<div>').addClass('i-container');
    var _info2 = $('<div>').addClass('i-container');
    var _info3 = $('<div>').addClass('i-container');
    var _img1 = $('<div>').addClass('img1Box');
    var _img2 = $('<div>').addClass('img2Box');
    var _img3 = $('<div>').addClass('img3Box');
    var _text1 = $('<div>').addClass('txtBox').append($('<h4>').text('Aquí y ahora'), $('<p>').html('Descubre proyecto y déjate </br> conocer por lo que haces').addClass('txt_grey'));
    var _text2 = $('<div>').addClass('txtBox').append($('<h4>').text('Toma el control'), $('<p>').html('Involucra la comunidad, </br> lanza tu convocatoria').addClass('txt_grey'));
    var _text3 = $('<div>').addClass('txtBox').append($('<h4>').text('Hazlo'), $('<p>').html('Crea experiencias inolvidables </br> junto con los demás').addClass('txt_grey'));
    _info1.append($('<div>').addClass('innerCont1').append(_img1, _text1));
    _info2.append(_img2, _text2);
    _info3.append($('<div>').addClass('innerCont3').append(_img3, _text3));
    _actionDiv.append(_actionContainer.append(_info1, _info2, _info3));

    var _longTextDiv = $('<div>').addClass('littleTextDiv');
    var _longTextContainer = $('<div>').addClass('welcomeSection-container'); 
    var _titleLongText = $('<h4>').html('Une a las personas:</br> Crea en red con tu comunidad cultural');
    var _callLongText = $('<a>').attr('href','/services')
      .text('Lanza y gestiona tu convocatoria en orfheo')
      .append(Pard.Widgets.IconManager('navigation_right').render()
        .addClass('navigationIcon-findOutMore'))
      .click(function(){
        console.log('open popup')
      })
      .addClass('callText-WelcomePage');
    _longTextDiv.append(_longTextContainer.append(_titleLongText, _callLongText));

    var _servicesDiv = $('<div>').addClass('servicesDiv');
    var _logoServices = $('<div>').addClass('logo-services');
    var _servicesInfoContainer = $('<div>').addClass('welcomeSection-container');
    var _callService = $('<div>').addClass('i-container');
    var _iconCallService = $('<div>').append(Pard.Widgets.IconManager('proposals').render());
    // var _callTitle = $('<h4>').text('Involucra la comunidad');
    var _callTitle = $('<h4>').text('Plataforma de gestión');
    var _callTxt = $('<p>').html('Crea un evento,</br> lanza una convocatoria, </br>utiliza la potente herramienta de gestión </br>y publica una programación interactiva');
    _callService.append($('<div>').append(_iconCallService, _callTitle, _callTxt).addClass('callServices-innerCont'));
    var _consulingService = $('<div>').addClass('i-container');
    var _iconConsulingService = $('<div>').append(Pard.Widgets.IconManager('chat_bubble').render());
    var _consulingTitle = $('<h4>').text('Asesoría creativa');
    var _consulingTxt = $('<p>').html('Saca lo mejor de tu proyecto,</br> alimenta tu comunidad </br>y explora nuevas estrategias creativa durante el proceso');
    _consulingService.append($('<div>').append(_iconConsulingService, _consulingTitle, _consulingTxt).addClass('consulingService-innerCont'));
    var _apiService = $('<div>').addClass('i-container');
    var _iconApiService = $('<div>').append(Pard.Widgets.IconManager('sincro').render());
    var _apiTitle = $('<h4>').text('Conexión API');
    var _apiTxt = $('<p>').text('Reenvía los datos de tu evento a tu página web o aplicación móvil y utilízalos siempre actualizados como mejor te convenga');
    _apiService.append($('<div>').append(_iconApiService, _apiTitle, _apiTxt).addClass('apiService-innerCont'));

    var _findOutMoreIcon = Pard.Widgets.IconManager('navigation_right').render().addClass('navigationIcon-findOutMore');
    var _findOutMore = $('<div>')
      .append($('<a>').text('Descubre más').attr('href','/services')  
        .click(function(){
          $('#toServicesPage').trigger('click');
        })
        .append(_findOutMoreIcon)
      )
      .css({
        'text-align':'center',
        'margin-top':'2.5rem'
      })
    _servicesInfoContainer.append(_callService,_consulingService,_apiService, _findOutMore); 
    var _textLogo = $('<div>').text('S e r v i c i o s').addClass('textLogo');
    _servicesDiv.append(_logoServices, _textLogo, _servicesInfoContainer);

    _section.append(_entryDiv,  _longTextDiv, _actionDiv,  _littleTextDiv, _servicesDiv);

    return _section;

  }

  // ns.Widgets.WelcomeSection = function(){

  //   var _section = $('<section>').addClass('welcomeSection-layout');

  //   var _entryDiv = $('<div>').addClass('entryDiv');
  //   var _entryContentContainer = $('<div>').addClass('welcomeSection-container');
  //   var _entryContent = $('<div>').addClass('entryDiv-content');
  //   var _logo = $('<span>').append($('<div>').addClass('mainLogo-welcomePage'));
  //   var _logoBaseline = $('<div>').append($('<p>').text('your cultural community')).addClass('logoBaseline-welcomePage');
  //   var _logoContainer = $('<div>')
  //     .append($('<div>')
  //       .append(_logo, _logoBaseline).addClass('entryLogoContainer')
  //     )
  //     .css({
  //       'position': 'relative',
  //       'height': '100px',
  //       'margin-top':'3.5rem'
  //     });

  //   var _signUpBtn = Pard.Widgets.SignUpButton().render().addClass('signUpBtnWelcomePage')

  //   var _cardsContainer = $('<div>')
  //     .css({
  //       'position':'relative',
  //       'margin-top':'3rem',
  //       'padding-bottom':'1rem'
  //     });
  //   var _cardSlider = $('<div>').addClass('card-slider');
  //   var _shown = [];
  //   Pard.Backend.searchProfiles([], [], '', function(data){
  //     var _toBeShown = [];
  //     data.profiles.forEach(function(profile){
  //       if ($.inArray(profile.profile_id, _shown) == -1) {
  //         _shown.push(profile.profile_id);
  //         _toBeShown.push(profile);
  //       }      
  //     });
  //     _toBeShown.forEach(function(profile, index){
  //       var _profileCard = Pard.Widgets.CreateCard(profile).render().addClass('carousel');
  //       // _profileCard.off( "mouseenter mouseleave");

  //       var _cardCont = $('<div>').addClass('cardCont-cardSlider');
  //       if (index) _profileCard.attr('href','#/');
  //       else _cardCont.addClass('cardSelected');

  //       _cardCont.append(_profileCard).css({'color': profile.color});
  //      _profileCard.addClass('profileCard-hoverInherit');

  //       _cardSlider.append(_cardCont);
  //     });
  //     var _rgb = Pard.Widgets.IconColor(_toBeShown[0].color).rgb();
  //     var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
  //     var cardSelected = _toBeShown[0];
  //     _entryDiv.css({'background':_backColor});

  //     _cardsContainer.append(_cardSlider);
  //     _cardSlider.slick({
  //       draggable: false,
  //       centerMode: true,
  //       variableWidth: true,
  //       centerPadding:  0,
  //       slidesToShow: 3,
  //       arrows:false,
  //       focusOnSelect:true,
  //       useTransform:false,
  //       responsive: [
  //         {
  //           breakpoint: 768,
  //           settings: {
  //             arrows: false,
  //             centerMode: true,
  //             centerPadding: '40px',
  //             slidesToShow: 3
  //           }
  //         },
  //         {
  //           breakpoint: 480,
  //           settings: {
  //             arrows: false,
  //             centerMode: true,
  //             centerPadding: '40px',
  //             slidesToShow: 1
  //           }
  //         }
  //       ]
  //     });

  //     _cardSlider.on('beforeChange', function(slick, currentSlide, nextSlide){
  //       console.log(currentSlide)
  //       console.log(nextSlide)
  //       // $('.slick-center').addClass('mediumCard-slide');
  //     });

  //     _cardSlider.on('afterChange',function(slick, current_slide){
  //       var cardSelected = _toBeShown[current_slide['currentSlide']];
  //       $('.cardSelected a').attr('href','#/');
  //       $('.cardSelected').remove('cardSelected');
  //       $('.slick-center a').attr('href','/profile?id='+cardSelected.profile_id);
  //       $('.slick-center').addClass('cardSelected');
        
  //       var _rgb = Pard.Widgets.IconColor(cardSelected.color).rgb();
  //       var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
  //       _entryDiv.css({'background':_backColor});
  //     });
  //   });

  //   _entryContent.append(_logoContainer, _signUpBtn,  _cardsContainer);
  //   _entryDiv.append(_entryContentContainer.append(_entryContent));
    
  //   var _titleLittleText = $('<h4>').text('Nuevas posibilidades culturales creadas por conexiones y enlaces');
  //   var _callLittleText = $('<a>').attr('href','#/')
  //     .text('Déjate inspirar')
  //     .append(Pard.Widgets.IconManager('navigation_right').render()
  //       .addClass('navigationIcon-findOutMore'))
  //     .click(function(){
  //       console.log('open popup')
  //     })
  //     .addClass('callText-WelcomePage');
  //   var _littleTextDiv= $('<div>').addClass('littleTextDiv').append(
  //     $('<div>').append(_titleLittleText, _callLittleText).addClass('welcomeSection-container'));


  //   var _actionDiv = $('<div>').addClass('actionDiv');
  //   var _actionContainer = $('<div>').addClass('welcomeSection-container');
  //   var _info1 = $('<div>').addClass('i-container');
  //   var _info2 = $('<div>').addClass('i-container');
  //   var _info3 = $('<div>').addClass('i-container');
  //   var _img1 = $('<div>').addClass('img1Box');
  //   var _img2 = $('<div>').addClass('img2Box');
  //   var _img3 = $('<div>').addClass('img3Box');
  //   var _text1 = $('<div>').addClass('txtBox').append($('<h4>').text('Aquí y ahora'), $('<p>').html('Descubre proyecto y déjate </br> conocer por lo que haces').addClass('txt_grey'));
  //   var _text2 = $('<div>').addClass('txtBox').append($('<h4>').text('Toma el control'), $('<p>').html('Lanza y gestiona </br> tu convocatoria').addClass('txt_grey'));
  //   var _text3 = $('<div>').addClass('txtBox').append($('<h4>').text('Hazlo'), $('<p>').html('Crea experiencias inolvidables </br> junto con los demás').addClass('txt_grey'));
  //   _info1.append($('<div>').addClass('innerCont1').append(_img1, _text1));
  //   _info2.append(_img2, _text2);
  //   _info3.append($('<div>').addClass('innerCont3').append(_img3, _text3));
  //   _actionDiv.append(_actionContainer.append(_info1, _info2, _info3));

  //   var _longTextDiv = $('<div>').addClass('littleTextDiv');
  //   var _longTextContainer = $('<div>').addClass('welcomeSection-container'); 
  //   var _titleLongText = $('<h4>').html('Une a las personas:</br> Crea en red con tu comunidad cultural');
  //   var _callLongText = $('<a>').attr('href','#/')
  //     .text('Lanza y gestiona tu convocatoria en orfheo')
  //     .append(Pard.Widgets.IconManager('navigation_right').render()
  //       .addClass('navigationIcon-findOutMore'))
  //     .click(function(){
  //       console.log('open popup')
  //     })
  //     .addClass('callText-WelcomePage');
  //   _longTextDiv.append(_longTextContainer.append(_titleLongText, _callLongText));

  //   var _servicesDiv = $('<div>').addClass('servicesDiv');
  //   var _logoServices = $('<div>').addClass('logo-services');
  //   var _servicesInfoContainer = $('<div>').addClass('welcomeSection-container');
  //   var _callService = $('<div>').addClass('i-container');
  //   var _iconCallService = $('<div>').append(Pard.Widgets.IconManager('proposals').render());
  //   var _callTitle = $('<h4>').text('Involucra la comunidad');
  //   var _callTxt = $('<p>').html('Crea un evento,</br> lanza una convocatoria, </br>utiliza la potente herramienta de gestión </br>y publica una programación interactiva');
  //   _callService.append($('<div>').append(_iconCallService, _callTitle, _callTxt).addClass('callServices-innerCont'));
  //   var _consulingService = $('<div>').addClass('i-container');
  //   var _iconConsulingService = $('<div>').append(Pard.Widgets.IconManager('chat_bubble').render());
  //   var _consulingTitle = $('<h4>').text('Asesoría creativa');
  //   var _consulingTxt = $('<p>').html('Saca lo mejor de tu proyecto,</br> alimenta tu comunidad </br>y explora nuevas estrategias creativa durante el proceso');
  //   _consulingService.append($('<div>').append(_iconConsulingService, _consulingTitle, _consulingTxt).addClass('consulingService-innerCont'));
  //   var _apiService = $('<div>').addClass('i-container');
  //   var _iconApiService = $('<div>').append(Pard.Widgets.IconManager('sincro').render());
  //   var _apiTitle = $('<h4>').text('Conexión API');
  //   var _apiTxt = $('<p>').text('Reenvía los datos de tu evento a tu página web o aplicación móvil y utilízalos siempre actualizados como mejor te convenga');
  //   _apiService.append($('<div>').append(_iconApiService, _apiTitle, _apiTxt).addClass('apiService-innerCont'));

  //   var _findOutMoreIcon = Pard.Widgets.IconManager('navigation_right').render().addClass('navigationIcon-findOutMore');
  //   var _findOutMore = $('<div>')
  //     .append($('<a>').text('Descubre más').attr('href','#/')  
  //       .click(function(){
  //         $('#servicios').trigger('click');
  //       })
  //       .append(_findOutMoreIcon)
  //     )
  //     .css({
  //       'text-align':'center',
  //       'margin-top':'2.5rem'
  //     })
  //   _servicesInfoContainer.append(_callService,_consulingService,_apiService, _findOutMore); 
  //   var _textLogo = $('<div>').text('S e r v i c i o s').addClass('textLogo');
  //   _servicesDiv.append(_logoServices, _textLogo, _servicesInfoContainer);

  //   _section.append(_entryDiv,  _longTextDiv, _actionDiv,  _littleTextDiv, _servicesDiv);

  //   return _section;

  // }
  

}(Pard || {}));