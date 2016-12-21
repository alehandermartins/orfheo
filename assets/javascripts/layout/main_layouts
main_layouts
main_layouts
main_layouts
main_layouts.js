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
        var _cardCont = $('<div>').addClass('cardCont-cardSlider');
        if (index) _profileCard.attr('href','#');
        else _cardCont.addClass('cardSelected')

        _cardCont.append(_profileCard);
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
        $('.cardSelected a').attr('href','#');
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
      console.log(_nameInput.getVal());
      console.log(_mexInput.getVal());
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
