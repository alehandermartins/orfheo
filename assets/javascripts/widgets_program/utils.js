'use strict';

(function(ns){
  
  Pard.CachedCall = {};
  Pard.Spaces = [];
  Pard.ShownSpaces = [];
  Pard.Artists = {};
  ns.Widgets.Program = [];
  ns.ColumnWidth = 176;

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
    return performances.sort(_compare);
  }

  ns.Widgets.AlignPerformances = function(performances, left){
    performances = Pard.Widgets.ReorderProgram(performances);
    _firstPerformance = performances.shift();
    var showStart = [_firstPerformance.time[0]];
    var showEnd = [_firstPerformance.time[1]];
    _firstPerformance.card.css({
      'width': Pard.ColumnWidth - 2,
      'left': left,
      'z-index': 0
    });
    performances.forEach(function(performance){
      var _cardIndex = 0;
      showEnd.some(function(endTime, index){
        if(performance.time[0] >= endTime){
          _cardIndex = index;
          console.log(_cardIndex);
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
    });
  }


  ns.Widgets.SpaceDropdownMenu = function(space){     

    var _menu = $('<ul>').addClass('menu');
    
    var _profileLink = $('<li>');
    var _profileCaller = $('<a>').attr({
      target: 'blank',
      href: '/profile?id=' + space.profile_id
    }).text('Ver perfil');

    var _programLink = $('<li>');
    var _programCaller = $('<a>').attr('href','#').text('Ver programa');
    var _program = Pard.Widgets.PopupCreator(_programCaller, space.name, function(){return Pard.Widgets.SpaceProgram(space)});

    // var _dCaller = $('<a>').attr('href','#').text('Elimina mi cuenta');
    // var _deleteCaller = Pard.Widgets.PopupCreator(_dCaller, '¿Estás seguro/a?', function(){return Pard.Widgets.DeleteUserMessage()});
    // var _deleteUser = $('<li>').append(_deleteCaller.render());

    _profileLink.append(_profileCaller);
    _programLink.append(_program.render());
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
      text: 'Otro',
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
      id: 'street',
      text: 'Espacio exterior',
      type: 'category'
    });

    return spaceProposals;
  }

}(Pard || {}));