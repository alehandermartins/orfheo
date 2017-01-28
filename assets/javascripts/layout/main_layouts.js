'use strict';

(function(ns){

     
ns.Widgets = ns.Widgets || {};

  ns.Widgets.MainWelcomePage = function(profilesSection){
    var _main = $('<main>').addClass('mainWelcomePage');

    var _welcomeSection = Pard.Widgets.WelcomeSection().attr('id','welcomeSection').addClass('visible');

    var _profiles= $('<section>')
      .addClass('welcomeSection-layout')
      .attr('id','profilesSection').hide();
    
    var _events = $('<section>')
      .addClass('welcomeSection-layout')
      .attr('id','eventsSection').hide();
    
    var _news = $('<section>')
      .addClass('welcomeSection-layout')
      .attr('id','newsSection').hide();

    _main.append(_welcomeSection, _profiles, _events, _news);

    return {
      render: function(){
        return _main;
      }
    }
  }

  ns.Widgets.MainUserPage = function(profilesSection){
    var _main = $('<main>').addClass('mainUserPage');

    var _initSection = Pard.Widgets.UserInitSection().attr('id','welcomeSection').addClass('visible');

    var _profiles= $('<section>')
      .addClass('welcomeSection-layout')
      .attr('id','profilesSection').hide();
    
    var _events = $('<section>')
      .addClass('welcomeSection-layout')
      .attr('id','eventsSection').hide();
    
    var _news = $('<section>')
      .addClass('welcomeSection-layout')
      .attr('id','newsSection').hide();

    _main.append(_initSection, _profiles, _events, _news);

    return {
      render: function(){
        return _main;
      }
    }
  }


  ns.Widgets.ProfileMainLayout = function(){

    var profiles = Pard.CachedProfiles;
    var userStatus = Pard.UserStatus['status'];

    var _rgb = Pard.Widgets.IconColor(profiles[0]['color']).rgb();
    var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
    var _main = $('<main>').css({'background': _backColor});

    var _offCanvasWrapper = $('<div>').addClass('off-canvas-wrapper');
    var _offCanvasInner = $('<div>').addClass('off-canvas-wrapper-inner').attr({'data-off-canvas-wrapper': ''});
    var _offCanvasAside = $('<div>').addClass('off-canvas-grid-aside position-left-grid-aside').attr({id: 'offCanvas-navBar', 'data-off-canvas': ''});

    var _offCanvasSection = $('<div>').addClass('off-canvas-content').attr({'data-off-canvas-content': ''});

    var _mainLarge = $('<section>').addClass('pard-grid');
    var _gridSpacing = $('<div>').addClass('grid-spacing');

    var _aside = $('<nav>').addClass('grid-aside');
    var _asideContent = $('<div>');
    var _section = $('<section>').addClass('grid-section');
    var _sectionContainer = $('<div>').addClass('section-content');
    var _sectionContent = $('<div>').attr('id','_sectionContent');
    var _sectionHeader = $('<div>');

    Pard.Widgets.ProfileAside(_sectionHeader, _sectionContent, _asideContent);

    _offCanvasSection.append(_sectionContainer.append(_sectionHeader, _sectionContent));
    _offCanvasAside.append(_asideContent);

    _aside.append(_offCanvasAside);
    _section.append(_offCanvasSection);
    _offCanvasInner.append(_aside, _gridSpacing, _section);

    _mainLarge.append(_offCanvasWrapper.append(_offCanvasInner));
    _main.append(_mainLarge);

     if (userStatus == 'outsider') {
        _main.addClass('outsider-main');
     }

    return {
      render: function(){
        return _main;
      }
    }
  }




  ns.Widgets.MainOffCanvasLayout = function(asideContent, sectionContent){

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

    if (Pard.UserStatus['status'] == 'outsider') {
        _main.addClass('outsider-main');
    }

    return {
      render: function(){
        return _main;
      }
    }
  }


}(Pard || {}));
