'use strict';

(function(ns){


  ns.PrintProgram = function(program, host, gmap, dataSpaces){

    var _searchResult = $('#searchResult');
    _searchResult.empty();
    var _checkPermanent = true;
    var _checkShow = true;
    program.forEach(function(performance){      
      if((host &&  (Pard.Widgets.RemoveAccents(performance.host_name) == host || performance.host_name == host)) || !host){
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
          var _permanentTitle = $('<div>').append($('<h4>').append('Permanentes a lo largo del día ')).addClass('title-program-event-page').css('margin-bottom','1.5rem');
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
    var _blocksContainer = $('<div>').addClass('blocks-container-prograByspace');
    _searchResult.append(_blocksContainer);

    // var _programReordered = Pard.Widgets.ReorderProgramBySpace(program);
    var _programObj = Pard.Widgets.ReorderProgramBySpace(program);
    var _space = '';
    var _spaceCatCheck = {};

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
      _blocksContainer.append(_block);
      _spaceCatCheck[cat] = true;
    })
    for (var hostSpace in _programObj){
    var _spaceBlock = $('<div>');
    var _showBlock = $('<div>');
    var _permanentBlock = $('<div>');
    Pard.Widgets.ReorderProgramCrono(_programObj[hostSpace]).forEach(function(performance){
      if((host &&  (Pard.Widgets.RemoveAccents(performance.host_name) == host || performance.host_name == host)) || !host){
        if (_spaceCatCheck[performance.host_category]){
          var _spaceCat =  performance.host_category;
          _catBlockObj[performance.host_category].append($('<div>').append($('<h4>').append(Pard.Widgets.Dictionary(_spaceCat).render())).addClass('title-program-event-page'));
          _spaceCatCheck[performance.host_category] = false;
        }
        if (performance.host_name != _space || !_space){
          _space =  performance.host_name;
          var _orderNum = performance.order + 1;
          var _hostNum = $('<a>').attr('href','#').append($('<img>').attr('src', 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _orderNum + '|FE7569|000000'));
          _hostNum.addClass('host-number-program-card');
          var _hostNumX = $('<a>').attr('href','#').append($('<img>').attr('src', 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _orderNum + '|9933FF|000000'),$('<span>').html('&#xE888').addClass('material-icons x-host-number-simbol-programByspace')).css('position','relative');
          var numberClick1Callback = function(){
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
            Pard.PrintProgramSpaces(program, dataSpaces[_index].title, gmap, dataSpaces);
          };
          var numberClick2Callback = function(){
            gmap.CloseInfoWindow();
          };
          _hostNum.click(function(){
            numberClick1Callback();
          });
          _hostNumX.click(function(){
            numberClick2Callback();
          })
          var _nameNumCont = $('<div>').addClass('nameNum-container-program');
          if (host) _nameNumCont.append($('<span>').append(_hostNumX).css('position', 'relative'));
          else _nameNumCont.append($('<span>').append(_hostNum));
          var _spaceName = $('<a>').append($('<h5>').append(_space)).addClass('space-name-title-program');
          if(performance.host_id.search('own')<0) _spaceName.attr({'href': '/profile?id=' + performance.host_id, 'target':'_blank'});
          else _spaceName.attr('href','#').css({'color':'black', 'text-decoration':'underline','cursor':'default'});
          _spaceBlock.append(_nameNumCont.append(_spaceName));
        }
        var _performanceCard = Pard.Widgets.ProgramBySpaceCard(performance, host);
        if (performance.permanent == 'true') _permanentBlock.append(_performanceCard.render());
        else _showBlock.append(_performanceCard.render());
      }
    });
    _catBlockObj[_programObj[hostSpace][0].host_category].append(_spaceBlock);
    _spaceBlock.append(_showBlock, _permanentBlock);
    }

    if(program.length == 0) {
      var _message = $('<h6>').text('Ningún resultado para esta fecha').css('color','#6f6f6f');
      _searchResult.append(_message);
    }
  }

  ns.Widgets.ReorderProgramBySpace= function(program){
    var _prObj = {};
    program.forEach(function(performance){
      if(!(_prObj[performance.order])) _prObj[performance.order] = [performance];
      else _prObj[performance.order].push(performance);
    });
    return _prObj;
    // program.sort(function(show1, show2){
    //   return show1.order - show2.order;
    // });
    // return program;
  }

  ns.Widgets.ProgramBySpaceCard = function(performance, host){
    var _progCard = $('<div>').addClass('programBySpace-card-container');
    var _time = $('<span>').append(moment(performance.time[0], 'x').format('HH:mm') + ' - ' + moment(performance.time[1], 'x').format('HH:mm'));

    var _participantCatIcon = Pard.Widgets.IconManager(performance.participant_category).render().addClass('participant-category-icon');
   
    var _title = $('<span>').text(performance.title).addClass('title-program-card');
    var _participant = $('<a>').text(performance.participant_name);
    if (performance.participant_id.search('own')<0) _participant.addClass('participant-program-card').attr({'href': '/profile?id=' + performance.participant_id, 'target':'_blank'});
    else _participant.addClass('participant-program-card-own').attr({'href': '#'});
   
    var _children = '';
    if (performance.children == 'true') _children = Pard.Widgets.IconManager('children').render().addClass('participant- category-icon icon-children-program'); 
    var _shortDescription = performance.short_description;
  
    if ($(window).width() > 1024){    
      var _row1 = $('<p>');
      var _row2 = $('<p>');
      var _iconContainer = $('<span>').append(_participantCatIcon,  _children).css('margin','0 1rem');
      _row1.append(_time, _iconContainer, _title, _participant);
      _row2.append(_shortDescription);
      _progCard.append(_row1, _row2);
    }
    else{
      var _timePlaceContainer = $('<div>').append(_time.addClass('time-smallScreen-program'), $('<div>').append(_participantCatIcon, _children).addClass('icons-smallScreen-program'));
      var _titleHostContainer = $('<div>').append(_title, ' ',_participant);
      _progCard.append(_timePlaceContainer,_titleHostContainer , _shortDescription);
    }

    return {
      render: function(){
        return _progCard;
      }
    }
  }

  ns.Widgets.ProgramCard = function(performance, host){

    var _progCard = $('<div>').addClass('program-card-container');
    var _time = $('<div>').append(moment(performance.time[0], 'x').format('HH:mm') + ' - ' + moment(performance.time[1], 'x').format('HH:mm'));
    var _participantCatIcon = Pard.Widgets.IconManager(performance.participant_category).render().addClass('participant-category-icon');
    var _orderNum = performance.order +1;
    var _hostNum = $('<a>').attr('href','#').append($('<img>').attr('src', 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _orderNum + '|FE7569|000000'));
    _hostNum.addClass('host-number-program-card');
    var _X = $('<span>').html('&#xE888').addClass('material-icons');
    var _hostNumX = $('<a>').attr('href','#').append($('<img>').attr('src', 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _orderNum + '|9933FF|000000'),_X).css('position','relative');
    // var _hostNum = $('<a>').attr('href','#').append( _orderNum);
    // _hostNum.addClass('host-number-program-card');
    // var _X = $('<span>').html('&#xE888').addClass('material-icons');
    // var _hostNumX = $('<a>').attr('href','#').append(_orderNum,_X).css('position','relative');
    
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
    var _children = $('<span>');
    if (performance.children == 'true') _children = Pard.Widgets.IconManager('children').render().addClass('participant- catagory-icon icon-children-program'); 
    var _shortDescription = performance.short_description;
    
   
    // if ($(window).width() > 1024){
    //   var _titleRow = $('<div>');
    //   var _descriptionRow = $('<div>');
    //   _titleRow.append($('<p>').append(_title, _participant, ' / ',_host));
    //   _descriptionRow.append($('<p>').append(_shortDescription).addClass('short-description-program-card'));
    //   var _col1 = $('<div>').addClass('col1-program-card');
    //   var _col2 = $('<div>').addClass('col2-program-card');
    //   var _col3 = $('<div>').addClass('col3-program-card');
    //   _col1.append(_time, _participantCatIcon.css({'float':'right', 'margin-right':'0.7rem'}),  _children.css({'float':'right', 'margin-right':'0.5rem'}));
    //   _X.addClass('x-host-number-simbol')
    //   if (host) _col2.append($('<span>').append(_hostNumX));
    //   else _col2.append($('<span>').append(_hostNum));
    //   _col3.append(_titleRow, _descriptionRow);
    //   _progCard.append(_col1, _col2, _col3);
    // }
    if ($(window).width() > 1024){
      var _titleRow = $('<div>');
      var _descriptionRow = $('<div>');
      var _spaceRow = $('<div>');
      var _iconContainer = $('<div>').append($('<span>').append(_children.css('margin-right','0.3rem'), _participantCatIcon).css({'float':'right','margin-right':'0.3rem'})).css('height','1.6rem');
      _titleRow.append($('<p>').append(_title, _participant.css('margin-left','0.3rem')));
      _descriptionRow.append($('<p>').append(_shortDescription));
      var _col1 = $('<div>').addClass('col1-program-card');
      var _col2 = $('<div>').addClass('col2-program-card').css('width','38.5rem');
      //var _col3 = $('<div>').addClass('col3-program-card');
      _col1.append(_time,  _iconContainer);
      _X.addClass('x-host-number-simbol');
       // _participantCatIcon.css({'float':'right', 'margin-right':'0.7rem'})      
      if (host) _col1.append($('<div>').append(_hostNumX.css({'float':'right','margin-right':'0.8rem'})).css('height','1.6rem'));
      else _col1.append($('<div>').append(_hostNum.css({'float':'right','margin-right':'0.6rem'})).css('height','1.6rem'));
      _spaceRow.append(_host);
      // _col3.append(_titleRow, _descriptionRow);
      _col2.append( _titleRow, _descriptionRow, _spaceRow);
      _progCard.append(_col1, _col2);
    }
    else{
      var _timePlaceContainer = $('<div>').append(_time.addClass('time-smallScreen-program'));
      _X.addClass('x-host-number-simbol-small');
      if (host) _timePlaceContainer.append(_hostNumX.addClass('hostNum-smallScreen-program'));
      else _timePlaceContainer.append(_hostNum.addClass('hostNum-smallScreen-program'));
      _timePlaceContainer.append($('<div>').append(_participantCatIcon, _children).addClass('icons-smallScreen-program'));
      var _titleHostContainer = $('<div>').append(_title, ' ',_participant,  ' / ', _host);
      _progCard.append(_timePlaceContainer.css('margin-bottom','0.4rem'),_titleHostContainer , _shortDescription);
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
    var _participantCatIcon = Pard.Widgets.IconManager(performance.participant_category).render().addClass('participant-category-icon');
    var _orderNum = performance.order +1;
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
