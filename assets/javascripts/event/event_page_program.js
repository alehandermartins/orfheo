'use strict';

(function(ns){


  ns.PrintProgram = function(program, host, gmap, dataSpaces){
    var _searchResult = $('#searchResult');
    _searchResult.empty();

    var _windowSize; 
    if ($(window).width() > 1024) _windowSize = 'big';
    else _windowSize = 'small';
    var _dayBlock = {};
    var _checkPermanent = {};

    program.forEach(function(performance){      
      if((host &&  (Pard.Widgets.RemoveAccents(performance.host_name) == host || performance.host_name == host)) || !host){
        if (!_dayBlock[performance.date]) {
          _dayBlock[performance.date] = $('<div>');
          var _day = $('<h4>')
            .text(moment(new Date(parseInt(performance.time))).locale(Pard.UserInfo['lang']).format('dddd D'))
            .css({
              'textTransform':'capitalize',
              'color':'#6f6f6f'
            });
          _dayBlock[performance.date].append(_day);
          _checkPermanent[performance.date] = true;
        }
        var _performanceCard = Pard.Widgets.ProgramCard(performance, host, _windowSize);
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
            if ($(window).width()>640) $(window).scrollTop(200);
            else $(window).scrollTop(110);
            Pard.PrintProgram(program, dataSpaces[_index].title, gmap, dataSpaces);
          },
          function(){
            gmap.CloseInfoWindow();
            Pard.PrintProgram(program, '', gmap, dataSpaces);
          });
        if (performance.permanent == 'true' && _checkPermanent[performance.date]) {
          var _permanentTitle = $('<div>').append($('<h5>').append(Pard.t.text('event_page.program.permanents'))).addClass('title-program-event-page').css('margin-bottom','1.5rem');
          _checkPermanent[performance.date] = false;
          _dayBlock[performance.date].append(_permanentTitle);
        }
        _dayBlock[performance.date].append(_performanceCard.render());
      }
    });

    if(program.length == 0) {
      var _message = $('<h6>').text(Pard.t.text('event_page.program.noResults')).css('color','#6f6f6f');
      _searchResult.append(_message);
    }
    else{
      for (var day in _dayBlock){
        _searchResult.append(_dayBlock[day]);
      }
    }
  }

  ns.PrintProgramSpaces = function(program, host, gmap, dataSpaces){
    var _searchResult = $('#searchResult');
    _searchResult.empty();
    var _blocksContainer = $('<div>').addClass('blocks-container-prograByspace');
    _searchResult.append(_blocksContainer);

    var _programObj = Pard.Widgets.ReorderProgramBySpace(program);
    var _space = '';
    var _spaceCatCheck = {};

    var _catBlockObj = {};
    Object.keys(Pard.CachedEvent.subcategories.space).forEach(function(cat){
      var _block = $('<div>').addClass('category-block-program');
      _catBlockObj[cat] = _block;
      _blocksContainer.append(_block);
      _spaceCatCheck[cat] = true;
    })

    var _windowSize; 
    if ($(window).width() > 1024) _windowSize = 'big';
    else _windowSize = 'small';

    for (var hostSpace in _programObj){
      var _spaceBlock = $('<div>');
      var _showBlock = $('<div>');
      var _permanentBlock = $('<div>');
      var _permanentObj={};
      Pard.Widgets.ReorderProgramCrono(_programObj[hostSpace]).forEach(function(performance){
        if((host &&  (Pard.Widgets.RemoveAccents(performance.host_name) == host || performance.host_name == host)) || !host){
          if (_spaceCatCheck[performance.host_subcategory]){
            var _spaceCat =  performance.host_subcategory;
            _catBlockObj[performance.host_subcategory].append($('<div>').append($('<h4>').append(Pard.UserInfo['texts']['subcategories']['space'][_spaceCat])).addClass('title-program-event-page'));
            _spaceCatCheck[performance.host_subcategory] = false;
          }
          if (performance.host_name != _space || !_space){
            _space =  performance.host_name;
            var _orderNum = performance.order + 1;
            // var _hostNum = $('<a>').attr('href','#').append($('<img>').attr('src', 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _orderNum + '|FE7569|000000'));
            var _hostNum = $('<a>').attr('href','#/').append($('<img>').attr('src', 'http://www.googlemapsmarkers.com/v1/'+_orderNum+'/FE7569/'));

          
            _hostNum.addClass('host-number-program-card');
            // var _hostNumX = $('<a>').attr('href','#').append($('<img>').attr('src', 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _orderNum + '|9933FF|000000'),$('<span>').html('&#xE888').addClass('material-icons x-host-number-simbol-programByspace')).css('position','relative');
            var _hostNumX = $('<a>').attr('href','#/').append($('<img>').attr('src', 'http://www.googlemapsmarkers.com/v1/'+_orderNum+'/9933FF/'),$('<span>').html('&#xE888').addClass('material-icons x-host-number-simbol-programByspace')).css('position','relative');            
            var numberClick1Callback = function(){
              var _index;
              dataSpaces.some(function(space, pos){
                if (space.order == performance.order) {
                  _index = pos;
                  return true;
                }
              });
              gmap.ViewOnMap(_index + 1);
              if ($(window).width()>640) $(window).scrollTop(200);
              else $(window).scrollTop(110);
              Pard.PrintProgramSpaces(program, dataSpaces[_index].title, gmap, dataSpaces);
            };
            var numberClick2Callback = function(){
              gmap.CloseInfoWindow();
              Pard.PrintProgramSpaces(program, '', gmap, dataSpaces);
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
            else _spaceName.attr('href','#/').css({'color':'black', 'text-decoration':'underline','cursor':'default'});
            _spaceBlock.append(_nameNumCont.append(_spaceName));
          }
          if (performance.permanent == 'true'){
            if (!_permanentObj[performance.participant_proposal_id]){
              _permanentObj[performance.participant_proposal_id] = Pard.Widgets.ProgramBySpaceCardPerm(performance, host, _windowSize)
              _permanentObj[performance.participant_proposal_id].addDay(performance)
            }
            else{
              _permanentObj[performance.participant_proposal_id].addDay(performance);
            }
          }
          else _showBlock.append(Pard.Widgets.ProgramBySpaceCard(performance, host, _windowSize).render());
      }
      });

      _catBlockObj[_programObj[hostSpace][0].host_subcategory].append(_spaceBlock);
      for (var permanent in _permanentObj){
        _permanentBlock.append(_permanentObj[permanent].render())
      }
      _spaceBlock.append(_showBlock, _permanentBlock);
    }

    if(program.length == 0) {
      var _message = $('<h6>').text(Pard.t.text('event_page.program.noResults')).css('color','#6f6f6f');
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
  }

  ns.Widgets.ProgramBySpaceCardPerm = function(performance, host, size){
    console.log(performance)
    var _progCard = $('<div>').addClass('programBySpace-card-container');
    var _time = $('<span>');
    var _participantCatIcon = Pard.Widgets.IconManager(performance.participant_category).render().addClass('participant-category-icon');
   
    var _title = $('<span>').text(performance.title).addClass('title-program-card');
    var _participant = $('<a>').text(performance.participant_name);
    if (performance.participant_id.search('own')<0) _participant.addClass('participant-program-card').attr({'href': '/profile?id=' + performance.participant_id, 'target':'_blank'});
    else _participant.addClass('participant-program-card-own').attr({'href': '#/'});
   
    var _children = '';
    if (performance.children == 'baby') _children = Pard.Widgets.IconManager('baby').render().addClass('participant- category-icon icon-children-program'); 
    var _shortDescription = performance.short_description;
  
    if (size == 'big'){    
      var _row1 = $('<p>');
      var _row2 = $('<p>');
      var _iconContainer = $('<span>').append(_participantCatIcon,  _children).css('margin','0 1rem');
      _row1.append(_time, _iconContainer, '<br>', _title, _participant);
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
      },
      addDay:function(performance){
        if (_time.html()) _time.append(' / ');
        _time.append(moment(new Date(parseInt(performance.time))).locale(Pard.UserInfo['lang']).format('dddd D').capitalize()+', '+moment(performance.time[0], 'x').format('HH:mm') + ' - ' + moment(performance.time[1], 'x').format('HH:mm'));
      }
    }
  }

  ns.Widgets.ProgramBySpaceCard = function(performance, host, size){
    var _progCard = $('<div>').addClass('programBySpace-card-container');
    var _time = $('<span>').append(moment(new Date(parseInt(performance.time))).locale(Pard.UserInfo['lang']).format('dddd D').capitalize()+', '+moment(performance.time[0], 'x').format('HH:mm') + ' - ' + moment(performance.time[1], 'x').format('HH:mm'));

    var _participantCatIcon = Pard.Widgets.IconManager(performance.participant_category).render().addClass('participant-category-icon');
   
    var _title = $('<span>').text(performance.title).addClass('title-program-card');
    var _participant = $('<a>').text(performance.participant_name);
    if (performance.participant_id.search('own')<0) _participant.addClass('participant-program-card').attr({'href': '/profile?id=' + performance.participant_id, 'target':'_blank'});
    else _participant.addClass('participant-program-card-own').attr({'href': '#/'});
   
    var _children = '';
    if (performance.children == 'baby') _children = Pard.Widgets.IconManager('baby').render().addClass('participant- category-icon icon-children-program'); 
    var _shortDescription = performance.short_description;
  
    if (size == 'big'){    
      var _row1 = $('<p>');
      var _row2 = $('<p>');
      var _iconContainer = $('<span>').append(_participantCatIcon,  _children).css('margin','0 1rem');
      _row1.append(_time, _iconContainer, '<br>', _title, _participant);
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

  ns.Widgets.ProgramCard = function(performance, host, size){

    var _progCard = $('<div>').addClass('program-card-container');
    var _time = $('<div>').append(moment(performance.time[0], 'x').format('HH:mm') + ' - ' + moment(performance.time[1], 'x').format('HH:mm'));
    var _participantCatIcon = Pard.Widgets.IconManager(performance.participant_category).render().addClass('participant-category-icon');
    var _orderNum = performance.order +1;
    // var _hostNum = $('<a>').attr('href','#').append($('<img>').attr('src', 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _orderNum + '|FE7569|000000'));
    var _hostNum = $('<a>').attr('href','#/').append($('<img>').attr('src', 'http://www.googlemapsmarkers.com/v1/'+_orderNum+'/FE7569/'));
    _hostNum.addClass('host-number-program-card');
    var _X = $('<span>').html('&#xE888').addClass('material-icons');
    // var _hostNumX = $('<a>').attr('href','#').append($('<img>').attr('src', 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _orderNum + '|9933FF|000000'),_X).css('position','relative');
    var _hostNumX = $('<a>').attr('href','#/').append($('<img>').attr('src', 'http://www.googlemapsmarkers.com/v1/'+_orderNum+'/9933FF/'),_X).css('position','relative');

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
    else _participant.addClass('participant-program-card-own').attr({'href': '#/'});
    var _host = $('<a>').text(performance.host_name);
    if(performance.host_id.search('own')<0) _host.addClass('host-program-card').attr({'href': '/profile?id=' + performance.host_id, 'target':'_blank'});
    else _host.addClass('host-program-card-own').attr({'href': '#/'});
    var _children = $('<span>');
    if (performance.children == 'baby') _children = Pard.Widgets.IconManager('baby').render().addClass('participant- catagory-icon icon-children-program'); 
    var _shortDescription = performance.short_description;

    if(size == 'big'){
      var _titleRow = $('<div>');
      var _descriptionRow = $('<div>');
      var _spaceRow = $('<div>');
      var _iconContainer = $('<div>').append($('<span>').append(_children.css('margin-right','0.3rem'), _participantCatIcon).css({'float':'right','margin-right':'0.3rem'})).css('height','1.6rem');
      _titleRow.append($('<p>').append(_title, _participant.css('margin-left','0.3rem')));
      _descriptionRow.append($('<p>').append(_shortDescription));
      var _col1 = $('<div>').addClass('col1-program-card');
      var _col2 = $('<div>').addClass('col2-program-card').css('width','38.5rem');
      _col1.append(_time,  _iconContainer);
      _X.addClass('x-host-number-simbol');   
      if (host) _col1.append($('<div>').append(_hostNumX.css({'float':'right','margin-right':'0.8rem'})).css('height','1.6rem'));
      else _col1.append($('<div>').append(_hostNum.css({'float':'right','margin-right':'0.6rem'})).css('height','1.6rem'));
      _spaceRow.append(_host);
      _col2.append( _titleRow, _descriptionRow, _spaceRow);
      _progCard.append(_col1, _col2);
    }
    else{
      var _timeRow = $('<div>').append(_time.addClass('time-smallScreen-program'));
      _X.addClass('x-host-number-simbol-small');
      _timeRow.append($('<div>').append(_participantCatIcon, _children).addClass('icons-smallScreen-program'));
      var _titleRow = $('<div>').append(_title, ' ',_participant);
      var _hostRow = $('<div>');
      _host.css('vertical-align','top');
      if (host) _hostRow.append(_hostNumX.addClass('hostNum-smallScreen-program'),_host);
      else _hostRow.append(_hostNum.addClass('hostNum-smallScreen-program'),_host);
      _progCard.append(_timeRow,_titleRow , _shortDescription,_hostRow);
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

}(Pard || {}));
