'use strict';

(function(ns){


  ns.PrintProgram = function(program, host, gmap, dataSpaces){

    var _searchResult = $('#searchResult');
    _searchResult.empty();
    var _checkPermanent = true;
    var _checkShow = true;
    program.forEach(function(performance){
      if((host && performance.host_name == host) || !host){
        var _performanceCard = Pard.Widgets.ProgramCard(performance,host);
        _performanceCard.setNumberClickCallback(
          function(){
            var _index;
            dataSpaces.some(function(space, pos){
              if (space.order == performance.order) {
                _index = pos;
                return true;
              }
            });
            gmap.ViewOnMap(_index+1);
            if ($(window).width()>640) $('.whole-container').scrollTop(200);
            else $('.whole-container').scrollTop(110);
            Pard.PrintProgram(program, dataSpaces[_index].title, gmap, dataSpaces);
          },
          function(){
            gmap.CloseInfoWindow();
          });
        if (performance.permanent == 'true' && _checkPermanent) {
          // var _day = $('<span>').text(moment(new Date(parseInt(performance.time))).locale('es').format('dddd DD')).css('textTransform','capitalize')
          var _permanentTitle = $('<div>').append($('<h4>').append('Permanentes a lo largo del día ')).addClass('title-program-event-page');
          _checkPermanent = false;
          _searchResult.append(_permanentTitle);
        }
        _searchResult.append(_performanceCard.render());
      }
    });

    if(program.length == 0) {
      var _message = $('<h6>').text('Ningún resultado para esta fecha').css('color','#6f6f6f');
      _searchResult.append(_message);
    }
  }

  Pard.PrintProgramSpaces = function(program, host, gmap, dataSpaces){
    var _searchResult = $('#searchResult');
    _searchResult.empty();

    var _programReordered = Pard.Widgets.ReorderProgramBySpace(program);
    var _space = '';
    var _spaceCat = '';

    var _spaceCatDictionary = {
      home: 'Espacios Particulares',
      commercial: 'Locales Comerciales',
      cultural_ass: 'Asociaciones Culturales',
      open_air: 'Espacios Exteriores'
    }

    var _catBlockObj = {};
    ['home','cultural_ass','commercial','open_air'].forEach(function(cat){
      var _block = $('<div>').addClass('category-block-program');
      _catBlockObj[cat] = _block;
      _searchResult.append(_block);
    })
    _programReordered.forEach(function(performance){
      if((host && performance.host_name == host) || !host){
        if (performance.host_category != _spaceCat || !_space){
          _spaceCat =  performance.host_category;
          _catBlockObj[performance.host_category].append($('<div>').append($('<h4>').append(Pard.Widgets.Dictionary(_spaceCat).render())).addClass('title-program-event-page'));
        }
        if (performance.host_name != _space || !_space){
          _space =  performance.host_name;
          _catBlockObj[performance.host_category].append($('<div>').append($('<h5>').append(_space)));
        }
        var _performanceCard = Pard.Widgets.ProgramCard(performance, host);
        _performanceCard.setNumberClickCallback(
          function(){
            var _index;
            dataSpaces.some(function(space, pos){
              if (space.order == performance.order) {
                _index = pos;
                return true;
              }
            });
            gmap.ViewOnMap(_index + 1);
            if ($(window).width()>640) $('.whole-container').scrollTop(200);
            else $('.whole-container').scrollTop(110);
            Pard.PrintProgram(program, dataSpaces[_index].title, gmap, dataSpaces);
          },
          function(){
            gmap.CloseInfoWindow();
          });
        _catBlockObj[performance.host_category].append(_performanceCard.render());

      }
    });

    if(program.length == 0) {
      var _message = $('<h6>').text('Ningún resultado para esta fecha').css('color','#6f6f6f');
      _searchResult.append(_message);
    }
  }

  ns.Widgets.ReorderProgramBySpace= function(program){
    program.sort(function(show1, show2){
      return show1.order - show2.order;
    });
    return program;
  }

  ns.Widgets.ProgramCard = function(performance, host){
    // var _dictionary = {
    //   music: 'Música',
    //   arts: 'Escénicas',
    //   expo: 'Exposición',
    //   poetry: 'Poesía',
    //   audiovisual: 'Audiovisual',
    //   street_art: 'Street Art',
    //   workshop: 'Taller',
    //   other: 'Otros',
    // }
    var _progCard = $('<div>').addClass('program-card-container');
    var _time = $('<div>').append(moment(performance.time[0], 'x').format('HH:mm') + ' - ' + moment(performance.time[1], 'x').format('HH:mm'));
    // var _participantCatText = $('<span>').append(_dictionary[performance.participant_category]).addClass('participant-category-text');
    var _participantCatIcon = Pard.Widgets.IconManager(performance.participant_category).render().addClass('participant-category-icon');
    var _orderNum = performance.order +1;
    //var _hostNum = $('<span>').text(_orderNum).addClass('host-number-program-card');
    var _hostNum = $('<a>').attr('href','#').append($('<img>').attr('src', 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _orderNum + '|FE7569|000000'));
    _hostNum.addClass('host-number-program-card');
    var _hostNumX = $('<a>').attr('href','#').append($('<img>').attr('src', 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _orderNum + '|9933FF|000000'),$('<span>').html('&#xE888').addClass('material-icons x-host-number-simbol'));
    var numberClick1Callback;
    var numberClick2Callback;
    _hostNum.click(function(){
      numberClick1Callback();
    });
    _hostNumX.click(function(){
      numberClick2Callback();
    })
    var _title = $('<span>').text(performance.title).addClass('title-program-card');
    var _participant = $('<a>').text(performance.participant_name);
    if (performance.participant_id.search('own')<0) _participant.addClass('participant-program-card').attr({'href': '/profile?id=' + performance.participant_id, 'target':'_blank'});
    else _participant.addClass('participant-program-card-own').attr({'href': '#'});
    var _host = $('<a>').text(performance.host_name);
    if(performance.host_id.search('own')<0) _host.addClass('host-program-card').attr({'href': '/profile?id=' + performance.host_id, 'target':'_blank'});
    else _host.addClass('host-program-card-own').attr({'href': '#'});
    var _children = '';
    if (performance.children == 'true') _children = Pard.Widgets.IconManager('children').render().addClass('participant- catagory-icon icon-children-program'); 
    var _shortDescription = performance.short_description;
    
   
    if ($(window).width() > 1024){
      // var _participantCat = $('<span>').append(_participantCatIcon, _participantCatText);
      var _titleRow = $('<div>');
      var _descriptionRow = $('<div>');
      _titleRow.append($('<p>').append(_title, _participant, ' / ',_host));
      _descriptionRow.append($('<p>').append(_shortDescription).addClass('short-description-program-card'));
      var _col1 = $('<div>').addClass('col1-program-card');
      var _col2 = $('<div>').addClass('col2-program-card');
      var _col3 = $('<div>').addClass('col3-program-card');
      _col1.append(_time, _participantCatIcon,  _children);
      if (host) _col2.append($('<p>').append(_hostNumX));
      else _col2.append($('<p>').append(_hostNum));
      _col3.append(_titleRow, _descriptionRow);
      _progCard.append(_col1, _col2, _col3);
    }
    else{
      var _timePlaceContainer = $('<div>').append(_time.addClass('time-smallScreen-program'), _hostNum.addClass('hostNum-smallScreen-program'), $('<div>').append(_participantCatIcon, _children).addClass('icons-smallScreen-program'));
      // _timePlaceContainer.on('click', function(){
      //   numberClickCallback();
      // });
      var _titleHostContainer = $('<div>').append(_title, ' ',_participant,  ' / ', _host);
      _progCard.append(_timePlaceContainer,_titleHostContainer , _shortDescription);
    }


    return {
      render: function(){
        return _progCard;
      },
      setNumberClickCallback: function(callback1, callback2){
        numberClick1Callback = callback1;
        numberClick2Callback = callback2;
      }
    }
  }

  ns.Widgets.ProgramCardProfile = function(performance, type){

    var _progCard = $('<div>').addClass('program-card-container');
    var _time = $('<div>').append(moment(performance.time[0], 'x').format('HH:mm') + ' - ' + moment(performance.time[1], 'x').format('HH:mm'));
    // var _participantCatText = $('<span>').append(_dictionary[performance.participant_category]).addClass('participant-category-text');
    var _participantCatIcon = Pard.Widgets.IconManager(performance.participant_category).render().addClass('participant-category-icon');
    var _orderNum = performance.order +1;
    //var _hostNum = $('<span>').text(_orderNum).addClass('host-number-program-card');
    var _hostNum = $('<img>').attr('src', 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _orderNum + '|FE7569|000000');
    _hostNum.addClass('host-number-program-card');
    var numberClick1Callback;
    var numberClick2Callback;
    _hostNum.toggle(
      function(){
        numberClick1Callback();
      },
      function(){
        numberClick2Callback();
      });
    var _title = $('<span>').text(performance.title).addClass('title-program-card');
    var _participant = $('<a>').text(performance.participant_name);
    if (performance.participant_id.search('own')<0) _participant.addClass('participant-program-card').attr({'href': '/profile?id=' + performance.participant_id, 'target':'_blank'});
    else _participant.addClass('participant-program-card-own').attr({'href': '#'});
    var _host = $('<a>').text(performance.host_name);
    if(performance.host_id.search('own')<0) _host.addClass('host-program-card').attr({'href': '/profile?id=' + performance.host_id, 'target':'_blank'});
    else _host.addClass('host-program-card-own').attr({'href': '#'});
    var _children = '';
    if (performance.children == 'true') _children = Pard.Widgets.IconManager('children').render().addClass('participant- catagory-icon icon-children-program'); 
     // var _hostCat = $('<span>').append('('+Pard.Widgets.Dictionary(performance.host_category).render()+')').addClass('host-category-program-card');
    var _shortDescription = performance.short_description;
    
   
    // if ($(window).width() > 1024){
      var _titleRow = $('<div>');
      var _hostRow = $('<div>');
      var _descriptionRow = $('<div>');
      _hostRow.append($('<p>').append(_hostNum,_host));
      _titleRow.append(_title);
      _descriptionRow.append($('<p>').append(_shortDescription).addClass('short-description-program-card'));
      var _col1 = $('<div>').addClass('col1-program-card-profile');
      // var _col2 = $('<div>').addClass('col2-program-card');
      var _col2 = $('<div>').addClass('col2-program-card-profile');
      _col1.append(_time);
      _col2.append(_hostRow, _titleRow, _descriptionRow);
      // _col3.append();
      _progCard.append(_col1, _col2);
    // }
    // else{
      // var _timePlaceContainer = $('<div>').append(_time.addClass('time-smallScreen-program'), _hostNum.addClass('hostNum-smallScreen-program'), $('<div>').append(_participantCatIcon, _children).addClass('icons-smallScreen-program'));
      // var _titleHostContainer = $('<div>').append(_title, ' ',_participant,  ' / ', _host);
      // _progCard.append(_timePlaceContainer,_titleHostContainer , _shortDescription);
    // }


    return {
      render: function(){
        return _progCard;
      },
      setNumberClickCallback: function(callback1, callback2){
        numberClick1Callback = callback1;
        numberClick2Callback = callback2;
      }
    }
  }

  

}(Pard || {}));
