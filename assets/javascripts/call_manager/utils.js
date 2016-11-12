'use strict';

(function(ns){
  ns.Widgets = ns.Widgets || {};  

  Pard.Spaces = [];
  Pard.ShownSpaces = [];
  ns.Widgets.Program = [];
  ns.ColumnWidth = 176;
  ns.PermanentCardHeight = 42;

  ns.Widgets.GenerateUUID = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  }

  ns.Widgets.FormatResource = function(resource) {
    var _label = $('<span>').text(resource.text);
    if(resource.icon){
      var _icon = Pard.Widgets.IconManager(resource.icon).render();
      _label.append(_icon);
      _icon.css({
        position: 'relative',
        left: '5px',
        top: '5px',
      });
    }
    return _label;
  }

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
      if (perform.permanent == 'false') performancesNotPermanent.push(perform); 
    });
    return performancesNotPermanent.sort(_compare);
  }

  ns.Widgets.ReorderProgramCrono = function(performances){
    var _compare = function (a,b) {
      if(a.permanent == 'true' && b.permanent == 'false' && a.date == b.date) return 1;
      if(a.permanent == 'false' && b.permanent == 'true' && a.date == b.date) return -1;
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

  ns.Widgets.GetProposal = function(proposal_id){
    result = $.grep(Pard.CachedEvent.artists, function(proposal){
      if(proposal.proposal_id == proposal_id) return true; 
      return false;
    })[0];
    return result;
  }

  ns.Widgets.TimeManager = function(eventTime){
    var startHour = 0;
    var endHour = 0;
    var endDate = false;
    Object.keys(eventTime).forEach(function(day, index){
      if(day == 'permanent') return;
      if(index == 0){
        startHour = new Date(parseInt(eventTime[day][0][0])).getHours();
        endHour = new Date(parseInt(eventTime[day][1][1])).getHours();
      }
      var start = new Date(parseInt(eventTime[day][0][0]));
      var end = new Date(parseInt(eventTime[day][1][1]));
      var minHour = start.getHours();
      var maxHour = end.getHours();
      if(end.getMinutes() > 0) maxHour += 1;
      if(minHour < startHour) startHour = minHour;
      if(endDate == false){
        if(start.getDate() != end.getDate()){
          endDate == true;
          endHour = maxHour;
        }
        else{if(maxHour > endHour) endHour = maxHour;}
      }
      if(endDate == true){
        if(maxHour > endHour) endHour = maxHour; 
      }
    });
    
    //Amount of hours in our day
    var hourSpan = endHour - startHour;
    if(endHour < startHour) hourSpan = 24 - startHour + endHour;
    var hours = [];
    if(endHour < startHour){
      for (var i = startHour; i < 24; i++) {hours.push(i);}
      for (var i = 0; i <= endHour; i++) {hours.push(i);}
    }
    else{
      for (var i = startHour; i <= endHour; i++) {hours.push(i);}
    }

    Object.keys(eventTime).forEach(function(day, index){
      if(day == 'permanent') return;
      var tempTime = [];
      tempTime[0] = new Date(parseInt(eventTime[day][0][0]));
      tempTime[0].setHours(startHour);
      tempTime[0].setMinutes(0);
      tempTime[0] = tempTime[0].getTime();
      tempTime[1] = new Date(parseInt(eventTime[day][0][0]));
      tempTime[1].setHours(startHour + hourSpan);
      tempTime[1].setMinutes(0);
      tempTime[1] = tempTime[1].getTime();
      eventTime[day] = [tempTime[0], tempTime[1]];
    });

    return{
      hours: hours,
      times: eventTime
    }
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

  ns.Widgets.OrderSpace = function(spaceSelector){

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
      var _spaceCard = $('<li>').text(_order + '. ' + space.name).addClass('ui-state-default sortable-space-card').css('background', _dictionaryColor[space.category]).attr('id', space.proposal_id);
      return _spaceCard
    }

    _spaces.forEach(function(space, index){
      _listSortable.append(_printSpaceCard(space, index));
    });

    var _orderButtonsContainer = $('<div>').addClass('order-buttons-container');

    var _orderText = $('<span>').text('Ordena por:');

    var _alphaBtn = Pard.Widgets.Button('A --> Z', function(){
      _listSortable.empty();
      _spaces.sort(function(s1, s2){
        return s1.name.localeCompare(s2.name);
      });
      _spaces.forEach(function(sp, n){
        _listSortable.append(_printSpaceCard(sp, n));
      });
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
                  var program = [];
                  var order = [];
                  Pard.Widgets.Program.forEach(function(performance, index){
                    var _performance = {
                      performance_id: performance.performance_id,
                      participant_id: performance.participant_id,
                      participant_proposal_id: performance.participant_proposal_id,
                      host_id: performance.host_id,
                      host_proposal_id: performance.host_proposal_id,
                      date: performance.date,
                      time: performance.time,
                      permanent: performance.permanent,
                      comments: performance.comments,
                      confirmed: performance.confirmed
                    }
                    program.push(_performance);
                  });

                  Pard.Spaces.forEach(function(space){
                    order.push(space.proposal_id);
                  });
                  // Pard.Backend.program(' ', program, order, Pard.Events.SaveProgram);
                  Pard.CachedCall.program = program;
                  Pard.Spaces = [];
                  Pard.ShownSpaces = [];
                  Pard.Widgets.Program = [];
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

    _orderButtonsContainer.append(_catOrderBtn.render(), _alphaBtn.render(),  _orderText);

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