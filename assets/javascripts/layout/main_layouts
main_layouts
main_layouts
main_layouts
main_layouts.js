'use strict';

(function(ns){

     
ns.Widgets = ns.Widgets || {};

  ns.Widgets.MainWelcomePage = function(){
    var _main = $('<main>').addClass('mainWelcomePage');

    var _welcomeSection = Pard.Widgets.WelcomeSection().attr('id','welcomeSection').addClass('visible');
    var _profiles= $('<section>').attr('id','profilesSection').hide();
    var _events = $('<section>').attr('id','eventsSection').hide();
    var _news = $('<section>').attr('id','newsSection').hide();

    _main.append(_welcomeSection, _profiles, _events, _news);

    return {
      render: function(){
        return _main;
      }
    }
  }

  ns.Widgets.WelcomeSection = function(){

    var _section = $('<section>').addClass('welcomeSection-layout');

    var _entryDiv = $('<div>').addClass('entryDiv');
    var _entryContentContainer = $('<div>').addClass('welcomeSection-container');
    var _entryContent = $('<div>').addClass('entryDiv-content');
    var _logo = $('<a>').attr({
      'href': '#'
    }).append($('<div>').addClass('mainLogo-welcomePage'));
    var _logoBaseline = $('<div>').append($('<p>').text('your cultural community')).addClass('logoBaseline-welcomePage');
    var _logoContainer = $('<div>').append($('<div>').append(_logo, _logoBaseline).addClass('entryLogoContainer')).css({
      'position': 'relative',
      'height': '100px'
    });

    var _cardsContainer = $('<div>')
      .css({
        'position':'relative',
        'height': '250px'
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
      console.log(_toBeShown);
      _toBeShown.forEach(function(profile){
        var _profileCard = Pard.Widgets.CreateCard(profile).render();
        var _cardCont = $('<div>');
        _profileCard.attr('href','#').addClass('carousel');
        _cardCont.append(_profileCard);
        _cardSlider.append(_cardCont);
      });
      var _rgb = Pard.Widgets.IconColor(_toBeShown[0].color).rgb();
      var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
      _entryDiv.css({'background':_backColor});
      $('.slick-center').click(function(){
        window.location.replace('/profile?id='+_toBeShown[0].profile_id)
      });
      // for (var i=0; i<7; i++){
      //   var _profileCard = Pard.Widgets.CreateCard(_toBeShown[i]).render();
      //   var _cardCont = $('<div>');
      //   _cardCont.append(_profileCard);
      //   switch(i){
      //     case 0:
      //       _cardCont.addClass('mainProfileCard-entryDiv');
      //       break;
      //     case 1:
      //     case 2:
      //       _cardCont.addClass('line2ProfileCard-entryDiv');
      //       break;
      //     case 3:
      //     case 4:
      //       _cardCont.addClass('line3ProfileCard-entryDiv');
      //       break;
      //     case 5:
      //     case 6:
      //       _cardCont.addClass('line4ProfileCard-entryDiv');
      //       break;
      //   }
      //   _cardSlider.append(_cardCont);
      // };
      _cardsContainer.append(_cardSlider);
      _cardSlider.slick({
        centerMode: true,
        variableWidth: true,
        centerPadding: '20px',
        slidesToShow: 3,
        arrows:false,
        focusOnSelect:true,
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
        // infinite: true,
        // slidesToShow: 3
      });
      _cardSlider.on('afterChange',function(slick, current_slide){
        var cardSelected = _toBeShown[current_slide['currentSlide']];
        var _rgb = Pard.Widgets.IconColor(cardSelected.color).rgb();
        var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
        _entryDiv.css({'background':_backColor});
        $('.slick-center').click(function(){
          window.location.replace('/profile?id='+cardSelected.profile_id)
        });
      })
    });

    _entryContent.append(_logoContainer, _cardsContainer);
    _entryDiv.append(_entryContentContainer.append(_entryContent));
    
    var _littleTextDiv= $('<div>');
    var _actionDiv = $('<div>');
    var _contactDiv = $('<div>'); 

    var _logo = $('<a>').attr({
      'href': '#'
    }).append($('<div>').addClass('logo-welcomePage'));
    var _logoBaseline = $('<div>').append($('<p>').text('your cultural community')).addClass('logoBaseline-welcomePage');

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
