'use strict';

(function(ns){
  ns.Widgets = ns.Widgets || {};

  ns.Widgets.Manager = function(the_event, callForms){

    var artists = the_event.artists;
    var spaces = the_event.spaces;
    var forms = callForms[Pard.UserInfo['lang']] || callForms['es'];

    var _main = $('<main>').addClass('main-call-page');
    var _rgb = Pard.Widgets.IconColor(the_event.color).rgb();
    var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
    if (the_event.published == 'true') _main.css({'background': _backColor});
    var _innerMainContainer = $('<div>').css('width','100vw');
    var _mainLarge = $('<section>').addClass('pard-grid call-section');
    var _navigationContainer = $('<div>').addClass('navigation-container-call-page');
    var _goToEventBtn = $('<a>').attr('href','/event?id='+ the_event.event_id).text('Página evento');
    _goToEventBtn.addClass('toEventPage-btn-callPage');
    var _tabs = $('<ul>').addClass('menu simple tabs-menu switcher-menu-call-page');
    var _title = $('<span>').text('Gestiona').addClass('title-call-page');
    var _panels = $('<div>').css('padding', 0);

    var _programTabTitle =  $('<a>').attr({href: "#"}).text('Programa');
    var _tableTabTitle =  $('<a>').attr({href: "#"}).text('Propuestas');
    var _utilsTabTitle =  $('<a>').attr({href: "#"}).text('Utiles');

    var _programTab = $('<li>').append(_programTabTitle);
    var _tableTab = $('<li>').append(_tableTabTitle);
    var _utilsTab = $('<li>').append(_utilsTabTitle);

    var _displayer = Pard.Displayer(the_event, forms);

    var artists = {}
    the_event.artists.forEach(function(artist){
      artists[artist.profile_id] = new Pard.Artist(artist, _displayer);
    });

    var spaces = {}
    the_event.spaces.forEach(function(space, index){
      space.event_id = the_event.event_id;
      space.index = index;
      spaces[space.profile_id] = new Pard.Space(space, _displayer);
    });

    the_event.artists = artists;
    the_event.spaces = spaces;

    var _programManager = Pard.ProgramManager(the_event, _displayer);
    var _tableManager = Pard.Widgets.TableManager(the_event, forms, _displayer);
    var _utilsManager = Pard.utilsManager(the_event);

    var _lastSelectedPanel = _tableManager;
    _tableTab.addClass('tab-selected');
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
    _navigationContainer.append(_goToEventBtn, _title, _tabs);
    _panels.append(_programManager.render().hide(), _tableManager.render(), _utilsManager.render().hide());
    _mainLarge.append(_navigationContainer, _panels);
    _main.append(_innerMainContainer.append(_mainLarge));

    Pard.Bus.on('addArtist', function(artist){
      if(the_event.artists[artist.profile_id]) the_event.artists[artist.profile_id].addProposal(artist.proposals[0]);
      else the_event.artists[artist.profile_id] = new Pard.Artist(artist, _displayer);
      _programManager.addArtist(artist);
      _tableManager.addArtist(artist);
    });

    Pard.Bus.on('addSpace', function(space){
      var index = Object.keys(the_event.spaces).length;
      space.event_id = the_event.event_id;
      space.index = index;

      the_event.spaces[space.profile_id] = new Pard.Space(space, _displayer);
      _programManager.addSpace(space);
      _tableManager.addSpace(space);
    });

    Pard.Bus.on('deleteArtist', function(artist){
      if(the_event.artists[artist.profile_id]){
        the_event.artists[artist.profile_id].deleteProposal(artist.proposal_id);
        _programManager.deleteArtist(artist);
        _tableManager.deleteArtist(artist);
        if(the_event.artists[artist.profile_id].artist.proposals.length == 0) delete the_event.artists[artist.profile_id];
      }
    });

    Pard.Bus.on('deleteSpace', function(space){
      if(the_event.spaces[space.profile_id]){
        the_event.spaces[space.profile_id].deleteColumns();
        _programManager.deleteSpace(space);
        _tableManager.deleteSpace(space);
        delete the_event.spaces[space.profile_id];
      }
    });

    Pard.Bus.on('modifyArtist', function(artist){
      if(the_event.artists[artist.profile_id]) the_event.artists[artist.profile_id].modify(artist);
      _programManager.modifyArtist(artist);
      _tableManager.modifyArtist(artist);
      if(the_event.spaces[artist.profile_id]){
        var modifiable = {
          email: artist.email,
          name: artist.name,
          phone: artist.phone,
          address: artist.address,
        }
        the_event.spaces[artist.profile_id].modify(modifiable);
        var space = the_event.spaces[artist.profile_id].space;
        _programManager.modifySpace(space);
        _tableManager.modifySpace(space);
      }
    });

    Pard.Bus.on('modifySpace', function(space){
      if(the_event.spaces[space.profile_id]) the_event.spaces[space.profile_id].modify(space);
      _programManager.modifySpace(space);
      _tableManager.modifySpace(space);
      if(the_event.artists[space.profile_id]){
        var modifiable = {
          email: space.email,
          name: space.name,
          phone: space.phone,
          address: space.address,
        }
        the_event.artists[space.profile_id].modify(modifiable);
        var artist = the_event.artists[space.profile_id].artist;
        _programManager.modifyArtist(artist);
        _tableManager.modifyArtist(artist);
      }
    });

    Pard.Bus.on('orderSpaces', function(order){
      order.forEach(function(space_id, index){
        the_event.spaces[space_id].reorder(index);
      });
    });

    var WebSocketManager = function(){

      var scheme = "ws://";
      var uri = scheme + window.document.location.host + "?channel=" + the_event.event_id + "&id=" + Pard.Signature;
      var ws = new WebSocket(uri);

      ws.onmessage = function(message) {
        var data = JSON.parse(message.data);
        if(data.status == 'success')
          Pard.Bus.trigger(data.event, data.model);
      }
    }

    WebSocketManager();

    return {
      render: function(){
        return _main;
      }
    }
  }
}(Pard || {}));
