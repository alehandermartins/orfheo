'use strict';

(function(ns){


  ns.PrintProgram = function(program, host){
    var _searchResult = $('#searchResult');
    // var _searchTagsBox = $('#tagBox');
    // var _searchWidget = $('#searchEngine');

    console.log(program);

    _searchResult.empty();
    var _categories = [];
    program.forEach(function(performance){
      if((host && performance.host_name == host) || !host){
        if($.inArray(performance.participant_category, _categories) < 0) _categories.push(performance.participant_category);
        _searchResult.append(Pard.Widgets.ProgramCard(performance));
      }
    });

    if(program.length == 0) {
      var _message = $('<h6>').text('Ningún resultado para esta fecha').css('color','#6f6f6f');
      _searchResult.append(_message);
    }
  }

  ns.Widgets.ProgramCard = function(performance){
    var _dictionary = {
      music: 'Música',
      arts: 'Escénicas',
      expo: 'Exposición',
      poetry: 'Poesía',
      audiovisual: 'Audiovisual',
      street_art: 'Street Art',
      workshop: 'Taller',
      other: 'Otros',
    }
    var _progCard = $('<div>').addClass('program-card-container');
    var _time = $('<div>').append(moment(performance.time[0], 'x').format('HH:mm') + ' - ' + moment(performance.time[1], 'x').format('HH:mm'));
    var _participantCat = $('<span>').append(Pard.Widgets.IconManager(performance.participant_category).render().addClass('participant-category-icon'), $('<span>').append(_dictionary[performance.participant_category]).addClass('participant-category-text'));
    var _hostNum = $('<p>').text(performance.order).addClass('host-number-program-card');
    var _titleRow = $('<div>');
    var _descriptionRow = $('<div>');
    var _title = $('<span>').text(performance.title).addClass('title-program-card');
    var _participant = $('<a>').text(performance.participant_name);
    if (performance.participant_id.search('own')<0) _participant.addClass('participant-program-card').attr({'href': '/profile?id=' + performance.participant_id, 'target':'_blank'});
    else _participant.addClass('participant-program-card-own').attr({'href': '#'})
    var _host = $('<a>').text(performance.host_name);
    console.log(performance.participant_id.search('own'))
    if(performance.host_id.search('own')<0) _host.addClass('host-program-card').attr({'href': '/profile?id=' + performance.host_id, 'target':'_blank'});
    else _host.addClass('host-program-card-own').attr({'href': '#'});
    var _hostCat = $('<span>').append('('+Pard.Widgets.Dictionary(performance.host_category).render()+')').addClass('host-category-program-card');
    var _shortDescription = performance.short_description;
    
    _titleRow.append($('<p>').append(_title, _participant, ' / ',_host,' ',_hostCat));
    _descriptionRow.append($('<p>').append(_shortDescription).addClass('short-description-program-card'));
    
    var _col1 = $('<div>').addClass('col1-program-card');
    var _col2 = $('<div>').addClass('col2-program-card');
    var _col3 = $('<div>').addClass('col3-program-card');
    _col1.append(_time, _participantCat);
    _col2.append(_hostNum);
    _col3.append(_titleRow, _descriptionRow);
    _progCard.append(_col1, _col2, _col3);

    return _progCard;
  }

}(Pard || {}));
