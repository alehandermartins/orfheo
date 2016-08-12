'use strict';

(function(ns){
  
  // Pard.CachedCall = {};
  Pard.Spaces = [];
  Pard.ShownSpaces = [];
  ns.Widgets.Program = [];
  ns.ColumnWidth = 176;
  ns.PermanentCardHeight = 40;

  ns.Widgets.CategoryColor = function(category){
    var _dictionary = {
      'music': '#3399FF',
      'arts': '#FF62B2',
      'poetry': '#FFFF00',
      'expo': '#66CC00',
      'street_art': '#FF3333',
      'audiovisual': '#C0C0C0',
      'other': '#FF8000',
      'workshop': '#994C00'
    }

    return _dictionary[category];
  }

  ns.Widgets.BorderCategoryColor = function(category){
    var _dictionary = {
      'music': 'rgb(6, 105, 204)',
      'arts': 'rgb(150, 6, 171)',
      'poetry': 'rgb(173, 166, 44)',
      'expo': 'rgb(72, 131, 13)',
      'street_art': 'rgb(210, 11, 11)',
      'audiovisual': 'rgb(107, 109, 111)',
      'other': 'rgb(215, 78, 15)',
      'workshop': 'rgb(51, 26, 2)'
    }

    return _dictionary[category];
  }



  ns.Widgets.ReorderProgram = function(performances){
    var _compare = function (a,b) {
      if (a.time[0] < b.time[0]) return -1;
      if (a.time[0] > b.time[0]) return 1;
      if (a.time[0] == b.time[0]){
        if (a.time[1] < b.time[1]) return 1;
        if (a.time[1] > b.time[1]) return -1;
      }
      return 0;
    }
    var performancesNotPermanent = [];
    performances.forEach(function(perform){
      if (!(perform.permanent)) performancesNotPermanent.push(perform); 
    });
    return performancesNotPermanent.sort(_compare);
  }

  ns.Widgets.ReorderProgramCrono = function(performances){
    var _compare = function (a,b) {
      if (a.time[0] < b.time[0]) return -1;
      if (a.time[0] > b.time[0]) return 1;
      if (a.time[0] == b.time[0]){
        if (a.time[1] < b.time[1]) return -1;
        if (a.time[1] > b.time[1]) return 1;
      }
      return 0;
    }
    return performances.sort(_compare);
  }

  ns.Widgets.AlignPerformances = function(performances){
    if(performances.length == 0) return false;
    var left = 0;
    Pard.ShownSpaces.forEach(function(space, index){
      if(space.proposal_id == performances[0].host_proposal_id) left = index * Pard.ColumnWidth + 1;
    });
    var _performances = Pard.Widgets.ReorderProgram(performances);
    _firstPerformance = _performances.shift();
    var showStart = [_firstPerformance.time[0]];
    var showEnd = [_firstPerformance.time[1]];
    _firstPerformance.card.css({
      'width': Pard.ColumnWidth - 2,
      'left': left,
      'z-index': 0
    });
    _performances.forEach(function(performance){
      var _cardIndex = 0;
      showEnd.some(function(endTime, index){
        if(performance.time[0] >= endTime){
          _cardIndex = index;
          return true;
        }
        _cardIndex = index + 1;
      });
      if(_cardIndex >= showEnd.length) showEnd.push(performance.time[1]);
      else{ showEnd[_cardIndex] = performance.time[1];}
      performance.card.css({
        'width': (Pard.ColumnWidth - 2) - 10 * _cardIndex,
        'left': left + 10 * _cardIndex,
        'z-index': _cardIndex
      });
      performance.card.resizable({
        maxWidth: (Pard.ColumnWidth - 2) - 10 * _cardIndex,
        minWidth: (Pard.ColumnWidth - 2) - 10 * _cardIndex
      });
    });
  }


  ns.Widgets.SpaceDropdownMenu = function(space){     

    var _menu = $('<ul>').addClass('menu');
    
    var _profileLink = $('<li>');
    var _profileCaller = $('<a>').attr({
      target: 'blank',
      href: '/profile?id=' + space.profile_id
    }).text('Perfil');

    var _programLink = $('<li>');
    var _programCaller = $('<a>').attr('href','#').text('Programa');
    _programCaller.on('click', function(){
      var _content = $('<div>').addClass('very-fast reveal full');
      _content.empty();
      $('body').append(_content);

      var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
      var _popupTitle = space.name + ' ('+Pard.Widgets.Dictionary(space.category).render() +')';
      var _message = Pard.Widgets.PopupContent(_popupTitle, Pard.Widgets.SpaceProgram(space), 'space-program-popup-call-manager');
      _message.setCallback(function(){
        _content.remove();
        _popup.close();
      });
      _content.append(_message.render());
      _popup.open();
    });

    _profileLink.append(_profileCaller);
    _programLink.append(_programCaller);
    _menu.append(_profileLink, _programLink);
    var _menuContainer = $('<ul>').addClass('dropdown menu').attr({'data-dropdown-menu':true, 'data-disable-hover':true,'data-click-open':true});
    var _iconDropdownMenu = $('<li>').append(
      $('<a>').attr('href','#').append(
        $('<span>').html('&#xE8EE').addClass('material-icons settings-icon-dropdown-menu')
        )
      ,_menu
    );

    _menuContainer.append(_iconDropdownMenu);

    return {
      render: function(){
        return _menuContainer;
      } 
    }
  }

   ns.Widgets.ArtistDropdownMenu = function(artist){     

    var _menu = $('<ul>').addClass('menu');
    
    var _profileLink = $('<li>');
    var _profileCaller = $('<a>').attr({
      target: 'blank',
      href: '/profile?id=' + artist.profile_id
    }).text('Perfil');

    var _programLink = $('<li>');
    var _programCaller = $('<a>').attr('href','#').text('Programa');

    _programCaller.on('click', function(){
      var _content = $('<div>').addClass('very-fast reveal full');
      _content.empty();
      $('body').append(_content);

      var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
      var _message = Pard.Widgets.PopupContent(artist.name, Pard.Widgets.ArtistProgram(artist), 'space-program-popup-call-manager');
      _message.setCallback(function(){
        _content.remove();
        _popup.close();
      });
      _content.append(_message.render());
      _popup.open();
    });

    _profileLink.append(_profileCaller);
    _profileLink.click(function(event){
      // prevent accordeon from opening
      event.stopImmediatePropagation();
    });
    _programCaller.click(function(event){
      // prevent accordeon from opening
      event.stopImmediatePropagation();
    });
    _programLink.append(_programCaller);
    _menu.append(_profileLink, _programLink);
    var _menuContainer = $('<ul>').addClass('dropdown menu').attr({'data-dropdown-menu':true, 'data-disable-hover':true,'data-click-open':true});
    var _iconDropdownMenu = $('<li>').append(
      $('<a>').attr('href','#').append(
        $('<span>').html('&#xE8EE').addClass('material-icons settings-icon-dropdown-menu')
        )
      ,_menu
    );

    _menuContainer.append(_iconDropdownMenu);

    return {
      render: function(){
        return _menuContainer;
      } 
    }
  }

  ns.Widgets.GetProposal = function(proposal_id){
    result = $.grep(Pard.CachedCall['proposals'], function(proposal){
      if(proposal.proposal_id == proposal_id) return true; 
      return false;
    })[0];
    return result;
  }

  ns.Widgets.ArtistProposals = function(){
    var artistProposals = [];
    artistProposals.push({
      id: 'music',
      text: 'Música',
      icon: 'music',
      type: 'category'
    });
    artistProposals.push({
      id: 'arts',
      text: 'Artes Escénicas',
      icon: 'arts',
      type: 'category'
    });
    artistProposals.push({
      id: 'workshop',
      text: 'Taller',
      icon: 'workshop',
      type: 'category'
    });
    artistProposals.push({
      id: 'poetry',
      text: 'Poesía',
      icon: 'poetry',
      type: 'category'
    });
    artistProposals.push({
      id: 'expo',
      text: 'Exposición',
      icon: 'expo',
      type: 'category'
    });
    artistProposals.push({
      id: 'street_art',
      text: 'Street Art',
      icon: 'street_art',
      type: 'category'
    });
    artistProposals.push({
      id: 'audiovisual',
      text: 'Audiovisual',
      icon: 'audiovisual',
      type: 'category'
    });
    artistProposals.push({
      id: 'other',
      text: 'Otros',
      icon: 'other',
      type: 'category'
    });

    return artistProposals;
  }

  ns.Widgets.SpaceProposals = function(){
    spaceProposals = [];
    spaceProposals.push({
      id: 'cultural_ass',
      text: 'Asociación cultural',
      type: 'category'
    });
    spaceProposals.push({
      id: 'commercial',
      text: 'Local comercial',
      type: 'category'
    });
    spaceProposals.push({
      id: 'home',
      text: 'Espacio particular',
      type: 'category'
    });
    spaceProposals.push({
      id: 'open_air',
      text: 'Espacio exterior',
      type: 'category'
    });

    return spaceProposals;
  }

  ns.Widgets.OrderSpace = function(){
    var _createdWidget = $('<div>');

    var _spaces = [];
    Pard.Spaces.forEach(function(spa){
      _spaces.push(spa);
    });

    var _dictionaryColor = {
      home: 'rgb(240, 239, 179)',
      commercial: 'rgb(196, 245, 239)',
      open_air: 'rgb(218, 227, 251)',
      cultural_ass: 'rgb(238, 212, 246)'
    }

    var _listSortable = $('<ul>');
    _listSortable.sortable({
        cursor: "move",
      });
    _listSortable.disableSelection();

    var _printSpaceCard = function(space, index){
      var _order = index + 1;
      var _spaceCard = $('<li>').text(_order+'. '+space.name).addClass('ui-state-default sortable-space-card').css('background', _dictionaryColor[space.category]).attr('id', space.proposal_id);
      return _spaceCard
    }

    _spaces.forEach(function(space, index){
      _listSortable.append(_printSpaceCard(space, index));
    });

    var _orderButtonsContainer = $('<div>');

    var _alphaBtn = Pard.Widgets.Button('A --> Z', function(){
      _listSortable.empty();
      _spaces.sort(function(s1, s2){
        return s1.name.localeCompare(s2.name);
      });
      _spaces.forEach(function(sp, n){
        _listSortable.append(_printSpaceCard(sp, n));
      });
      console.log(_spaces);
      console.log(Pard.Spaces);
    });

    var _catOrderBtn = Pard.Widgets.Button('Categoría', function(){
      _listSortable.empty();
      var _catArrays = {
        home: [],
        cultural_ass: [],
        commercial:[],
        open_air:[]     
      }
      _spaces.forEach(function(spa){
        _catArrays[spa.category].push(spa);
      });
      _spaces = [];
      for (var cat in _catArrays){
        _spaces = _spaces.concat(_catArrays[cat]);
      }
      _spaces.forEach(function(sp, n){
        _listSortable.append(_printSpaceCard(sp, n));
      });
    });

    var _closepopup = function(){};

    var _OKbtn = Pard.Widgets.Button('OK', function(){
      Pard.CachedCall.order =  _listSortable.sortable('toArray');
      $('#programPanel').empty();
      Pard.Spaces = [];
      Pard.ShownSpaces = [];
      Pard.Widgets.Program = [];
      var spinner =  new Spinner().spin();
          $.wait(
            '', 
            function(){
              $('body').append(spinner.el);
              _closepopup();
            }, 
            function(){
              setTimeout(function(){
                var _appendAndStopSpinner = function(stopSpinner){ 
                  $('#programPanel').append(Pard.Widgets.ProgramManager().render());
                  stopSpinner();
                }
                _appendAndStopSpinner(function(){
                  spinner.stop();
                  $('#programPanel').foundation();
                });
              },0)
            }
          );

    }).render().addClass('OK-btn-reorderSpace-popup');

    var _OKbtnContainer = $('<div>').addClass('OK-btn-container-popup');
    _OKbtnContainer.append(_OKbtn);

    _orderButtonsContainer.append(_alphaBtn.render(), _catOrderBtn.render());

    _createdWidget.append(_orderButtonsContainer, _listSortable, _OKbtnContainer);
    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;      
      }
    }
  }

}(Pard || {}));