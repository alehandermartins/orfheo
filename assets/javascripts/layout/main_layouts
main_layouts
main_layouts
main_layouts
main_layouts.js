'use strict';

(function(ns){

     
ns.Widgets = ns.Widgets || {};

  ns.Widgets.MainWelcomePage = function(){
    var _main = $('<main>').addClass('mainWelcomePage');

    var _welcomeSection = Pard.Widgets.WelcomeSection().attr('id','welcomeSection').addClass('visible');

    var _profiles= $('<section>')
      .append(Pard.Widgets.ProfilesWelcomeSection().render())
      .addClass('welcomeSection-layout')
      .attr('id','profilesSection').hide();
    
    var _events = $('<section>').attr('id','eventsSection').hide();
    
    var _news = $('<section>').attr('id','newsSection').hide();

    _main.append(_welcomeSection, _profiles, _events, _news);

    return {
      render: function(){
        return _main;
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

      $('.whole-container').scroll(function(){
        console.log($('.whole-container').scrollTop());
        console.log($(window).height());
        console.log($('.search-results-WelcomePage').height());
        if ($('.search-results-WelcomePage').height() + 84 +130 - $(window).height() - $('.whole-container').scrollTop() <= 100 ){
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
    var _searchInput = $('<div>').append(_searchWidget).addClass('search-input-WelcomePage');
    _searchInputContainer.append(_searchInput);

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

    _searchInputContainer.append(_searchTagsBox);
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
        'margin-top':'1.5rem'
      });

    var _cardsContainer = $('<div>')
      .css({
        'position':'relative',
        'margin-top':'4rem'
      });
    var _cardSlider = $('<div>').addClass('card-slider');
    var _shown = [];
    Pard.Backend.searchProfiles([], [], '', function(data){
      var _toBeShown = [];
      data.profiles.forEach(function(profile){
        if ($.inArray(profile.profile_id, _shown) == -1) {
          _shown.push(profile.profile_id);
          _toBeShown.push(profile);
        }      
      });
      _toBeShown.forEach(function(profile, index){
        var _profileCard = Pard.Widgets.CreateCard(profile).render().addClass('carousel');
        _profileCard.off('hover');

        var _cardCont = $('<div>').addClass('cardCont-cardSlider');
        if (index) _profileCard.attr('href','#/');
        else _cardCont.addClass('cardSelected');

        _cardCont.append(_profileCard).css({'color': '0 0 2px 1px'+ profile.color});
       _profileCard.off('hover').addClass('profileCard-hoverInherit');

        _cardSlider.append(_cardCont);
      });
      var _rgb = Pard.Widgets.IconColor(_toBeShown[0].color).rgb();
      var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
      var cardSelected = _toBeShown[0];
      _entryDiv.css({'background':_backColor});

      _cardsContainer.append(_cardSlider);
      _cardSlider.slick({
        centerMode: true,
        variableWidth: true,
        centerPadding:  0,
        slidesToShow: 3,
        arrows:false,
        focusOnSelect:true,
        useTransform:false,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '40px',
              slidesToShow: 3
            }
          },
          {
            breakpoint: 480,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '40px',
              slidesToShow: 1
            }
          }
        ]
      });

      _cardSlider.on('afterChange',function(slick, current_slide){
        var cardSelected = _toBeShown[current_slide['currentSlide']];
        $('.cardSelected a').attr('href','#/');
        $('.cardSelected').remove('cardSelected');
        $('.slick-center a').attr('href','/profile?id='+cardSelected.profile_id);
        $('.slick-center').addClass('cardSelected');
        
        var _rgb = Pard.Widgets.IconColor(cardSelected.color).rgb();
        var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
        _entryDiv.css({'background':_backColor});
      });
    });

    _entryContent.append(_logoContainer, _cardsContainer);
    _entryDiv.append(_entryContentContainer.append(_entryContent));
    
    var _littleTextDiv= $('<div>').addClass('littleTextDiv').append(
      $('<div>').append($('<h5>').text('nuevas posibilidades culturales creadas por conexiones y enlaces')).addClass('welcomeSection-container'));


    var _actionDiv = $('<div>').addClass('actionDiv');
    var _actionContainer = $('<div>').addClass('welcomeSection-container');
    var _info1 = $('<div>').addClass('i-container');
    var _info2 = $('<div>').addClass('i-container');
    var _info3 = $('<div>').addClass('i-container');
    var _innerCont = $('<div>').css({'width': '12rem'});
    var _img1 = $('<div>').addClass('img1Box');
    var _img2 = $('<div>').addClass('img2Box');
    var _img3 = $('<div>').addClass('img3Box');
    var _text1 = $('<div>').addClass('txtBox').append($('<p>').text('Aquí y ahora').css('font-weight','bold'), $('<p>').html('Descubre proyecto y déjate </br> conocer por lo que haces').addClass('txt_grey'));
    var _text2 = $('<div>').addClass('txtBox').append($('<p>').text('Toma el control').css('font-weight','bold'), $('<p>').html('Lanza y gestiona </br> tu convocatoria').addClass('txt_grey'));
    var _text3 = $('<div>').addClass('txtBox').append($('<p>').text('Hazlo').css('font-weight','bold'), $('<p>').html('Crea experiencias inolvidables </br> junto con los demás').addClass('txt_grey'));
    _info1.append($('<div>').addClass('innerCont1').append(_img1, _text1));
    _info2.append(_img2, _text2);
    _info3.append($('<div>').addClass('innerCont3').append(_img3, _text3));
    _actionDiv.append(_actionContainer.append(_info1, _info2, _info3));

    var _contactDiv = $('<div>').addClass('contactDiv');
    var _contactContainer = $('<div>').addClass('welcomeSection-container'); 
    var _longText = $('<div>').append(
      $('<p>').html('Un lugar donde colores diferentes encuentran su unidad en la común saturación. </br>Un ecosistema participativo para artistas, organizaciones, gestores culturales e instituciones </br>donde poder crear juntos. </br>Un mecanismo innovador capaz de <strong>informatizar la gestión del sistema artístico-cultural</strong>, y de dar valor a los proyectos mas allá de un solo encuentro. '),
      $('<p>').html('Orfheo se basa en un concepto simple y potente: podemos hacer mas cosas juntos que por separado. </br> Creemos en el poder del compartir, en nuevas fronteras culturales posibles gracias al intercambio.'),
      $('<p>').html('Actuar a nivel local y pensar en red globalmente de forma colaborativa es una oportunidad para compartir recursos, estimular, potenciar y crear nuevas posibilidades y enlaces.'),
      $('<p>').html('<strong>TRABAJA EN RED CON Y PARA TU COMUNIDAD CULTURAL LOCAL </br> CONTACTANOS PARA LANZAR Y GESTIONAR TU CONVOCATORIA</strong>'),
      $('<p>').html('<strong>En orfheo es posible lanzar y gestionar convocatorias artístico-culturales para cualquier proyecto, espacio, iniciativa ciudadana, institución y organización, festival y todo tipo de evento o encuentro.</strong>')
    ).addClass('longText');
    var _logoContact = $('<div>').addClass('logo-contactDiv');
    var _contactForm = $('<div>').addClass('contactForm-container');
    var _form = $('<form>');
    var _nameInput = Pard.Widgets.Input('Nombre','text');
    var _emailInput = Pard.Widgets.Input('Email','text');
    var _subjectInput = Pard.Widgets.Input('Asunto','text');
    var _mexInput = Pard.Widgets.TextArea('Mensaje',6);
    var _submitBtn = Pard.Widgets.Button('Envía', function(){
      Pard.Backend.contact(_nameInput.getVal(), _emailInput.getVal(), _subjectInput.getVal(), _mexInput.getVal(), function(data){
        console.log(data);
        console.log(_nameInput.getVal());
        console.log(_mexInput.getVal());
      });
    });
    _form.append(_nameInput.render(), _emailInput.render(), _subjectInput.render(), _mexInput.render());
    _contactForm.append(_form, _submitBtn.render());

    _contactDiv.append(_contactContainer.append(_logoContact, _longText, _contactForm));

    _section.append(_entryDiv, _littleTextDiv, _actionDiv, _contactDiv);

    return _section;

  }
  

  ns.Widgets.MainLayout = function(asideContent, sectionContent){

    var _main = $('<main>').attr('id','main-welcome-page');

    var _offCanvasWrapper = $('<div>').addClass('off-canvas-wrapper');
    var _offCanvasInner = $('<div>').addClass('off-canvas-wrapper-inner').attr({'data-off-canvas-wrapper': ''});
    var _offCanvasAside = $('<div>').addClass('off-canvas-grid-aside position-left-grid-aside').attr({id: 'offCanvas-navBar', 'data-off-canvas': ''});

    var _offCanvasSection = $('<div>').addClass('off-canvas-content').attr({'data-off-canvas-content': ''});

    var _mainLarge = $('<section>').addClass('pard-grid');
    var _gridSpacing = $('<div>').addClass('grid-spacing');


    var _aside = $('<nav>').addClass('grid-aside');
    var _section = $('<section>').addClass('grid-section');
    var _sectionContainer = $('<div>');

    _offCanvasSection.append(sectionContent(_sectionContainer).render());

    _offCanvasAside.append(asideContent(_sectionContainer).render());

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


}(Pard || {}));
