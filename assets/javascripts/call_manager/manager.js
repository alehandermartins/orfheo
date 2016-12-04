'use strict';

(function(ns){
  ns.Widgets = ns.Widgets || {};

  ns.Widgets.Manager = function(the_event, forms){

    var artists = the_event.artists;
    var spaces = the_event.spaces;

    var _main = $('<main>').addClass('main-call-page');
    var _mainLarge = $('<section>').addClass('pard-grid call-section');
    var _navigationContainer = $('<div>').addClass('navigation-container-call-page');
    var _goToEventBtn = $('<a>').attr('href','/event?id='+ the_event.event_id).text('Página evento');
    _goToEventBtn.addClass('toEventPage-btn-callPage');
    var _tabs = $('<ul>').addClass('menu simple tabs-menu switcher-menu-call-page');
    var _title = $('<h4>').text('Gestiona la Convocatoria').css({'margin-top':'1.5rem', 'margin-bottom':'2.5rem'});
    var _panels = $('<div>').css('padding', 0);

    var _programTabTitle =  $('<a>').attr({href: "#"}).text('Programa');
    var _tableTabTitle =  $('<a>').attr({href: "#"}).text('Propuestas');
    // var _proposalsTabTitle =  $('<a>').attr({href: "#"}).text('Propuestas');
    var _utilsTabTitle =  $('<a>').attr({href: "#"}).text('Utiles');

    var _programTab = $('<li>').append(_programTabTitle);
    var _tableTab = $('<li>').append(_tableTabTitle);
    // var _proposalsTab = $('<li>').append(_proposalsTabTitle);
    var _utilsTab = $('<li>').append(_utilsTabTitle);

    var _displayer = Pard.Displayer(the_event, forms);

    var artists = {}
    the_event.artists.forEach(function(artist){
      artists[artist.profile_id] = new Pard.Artist(artist, _displayer);
    });

    var spaces = {}
    the_event.spaces.forEach(function(space){
      spaces[space.profile_id] = new Pard.Space(space, _displayer);
    });

    the_event.artists = artists;
    the_event.spaces = spaces;
    the_event.program = {}

    var _programManager = Pard.ProgramManager(the_event, _displayer);
    var _tableManager = Pard.Widgets.TableManager(the_event, forms, _displayer);
    var _utilsManager = Pard.utilsManager(the_event);

    var _lastSelectedPanel = _tableManager;
    _tableTab.addClass('tab-selected')
    _programTab.on('click', function(){
      if(_lastSelectedPanel != _programManager){
        $('.tab-selected').removeClass('tab-selected');
        _programTab.addClass('tab-selected');
        _lastSelectedPanel.render().hide();
        _programManager.render().show();
        _lastSelectedPanel = _programManager;
      }
    });
    _tableTab.on('click', function(){
      if(_lastSelectedPanel != _tableManager){
        $('.tab-selected').removeClass('tab-selected');
        _tableTab.addClass('tab-selected');
        _lastSelectedPanel.render().hide();
        _tableManager.render().show();
        _lastSelectedPanel = _tableManager;
      }
    });
    _utilsTab.on('click', function(){
      if(_lastSelectedPanel != _utilsManager){
        $('.tab-selected').removeClass('tab-selected');
        _utilsTab.addClass('tab-selected');
        _lastSelectedPanel.render().hide();
        _utilsManager.render().show();
        _lastSelectedPanel = _utilsManager;
      }
    });

    _tabs.append( _tableTab, _programTab, _utilsTab);
    _navigationContainer.append(_goToEventBtn, _tabs);
    _panels.append(_programManager.render().hide(), _tableManager.render(), _utilsManager.render().hide());
    _mainLarge.append(_navigationContainer, _title, _panels);
    _main.append(_mainLarge);

    return {
      render: function(){
        return _main;
      }
    }
  }
}(Pard || {}));
