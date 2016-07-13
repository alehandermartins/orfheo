'use strict';

(function(ns){

  ns.Widgets.SpaceColumn = function(space, day, hours){
    var eventTime = Pard.CachedCall.eventTime;

    var _spaceCol = $('<div>').addClass('spaceCol');
    //_spaceCol.addClass('space-column-call-manager');
    _spaceCol.css({
      'display': ' inline-block',
      'width': '11rem',
      'border': '1px solid'
    });
    //Space header is the handle for dragging space columns
    var _spaceHeader = $('<div>').addClass('spaceHeader space-column-header cursor_grab');

    var _icon = Pard.Widgets.SpaceDropdownMenu(space).render();
    var _menuIcon = $('<div>').append(_icon);
    _menuIcon.css({
      'display': 'inline-block',
      'vertical-align': 'middle',
    });
    _spaceCol.append(_menuIcon);

    var _spacename = $('<div>');
    _spacename.addClass('space-name-container-call-manager');
    // var _title = $('<p>').addClass('space-name-headerTable-call-manager').append($('<a>').text(space.name));   
    var _titleText = $('<a>').attr('href','#');
    _titleText.text(Pard.Widgets.CutString(space.name, 35));
    _spacename.append($('<p>').addClass('space-name-headerTable-call-manager').append(_titleText));
    _spaceHeader.append(_spacename, _menuIcon);
    _spaceCol.append(_spaceHeader);

    _spaceHeader.mousedown(function(){
      _spaceHeader.removeClass('cursor_grab').addClass('cursor_move');
    });
    _spaceHeader.mouseup(function(){
      _spaceHeader.removeClass('cursor_move').addClass('cursor_grab');
    });

    //Popup showing the space form
    _titleText.on('click', function(){
      var _content = $('<div>').addClass('very-fast reveal full');
      _content.empty();
      $('body').append(_content);

      var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
      var _message = Pard.Widgets.PopupContent('conFusión 2016', Pard.Widgets.PrintProposalMessage(Pard.Widgets.PrintProposal(space, Pard.Forms.SpaceCall().render())));
      _message.setCallback(function(){
        _content.remove();
        _popup.close();
      });
      _content.append(_message.render());
      _popup.open();
    });

    //All the performances are dropped in the _time zone
    var _time = $('<div>').addClass('spaceTime').html('&nbsp').css({
      'height': (hours.length - 1) * 40
    });

    //Giving background to space if not availabe
    if($.inArray(day, space.availability) < 0){
      _spaceCol.addClass('space-not-available-call-manager');
    }else{
      _spaceCol.removeClass('space-not-available-call-manager');
    }
    
    _time.droppable({
      //Only accepts elements with these classes
      accept: function(card){
        if(card.hasClass('proposalCard') || card.hasClass('programHelper')) return true;
      },
      //Activated on drop
      drop: function(event, ui) {
        ui.helper.data('dropped', true);
        var position = ui.helper.position().top;
        var colPosition = _time.position().top;

        //If the element is higher, its height is adjusted to the top of the _time zone
        if(position < colPosition) position = colPosition;

        //Adjusting to time line
        var _offset = (position - colPosition) % 10;
        if(_offset >= 5) position += 10 - _offset;
        if(_offset < 5) position -= _offset;

        //If the card is below the drop zone it adjustes to the low end
        if(position + duration > colPosition + _time.height()) position = colPosition + _time.height() - duration;

        //Adjusting height
        var duration = ui.helper.height();
        if(ui.draggable.hasClass('proposalCard')) duration += 2;

        //Obtaining start and end times from position and pixels
        var start = new Date(parseInt(eventTime[day][0][0]));
        start.setMinutes(start.getMinutes() + (position - 41) * 1.5);
        var end = new Date(start.getTime());
        end.setMinutes(start.getMinutes() + duration * 1.5);

        var _cardInfo = ui.helper.data('cardInfo');
        if(ui.draggable.hasClass('proposalCard')){
          _cardInfo.date = day,
          _cardInfo.permanent = false,
          _cardInfo.card = Pard.Widgets.ProgramHelper(ui.helper.data('cardInfo'), space.proposal_id).render();
          _cardInfo.card.css({
            'left' : _time.position().left
          });
          Pard.Widgets.Program.push(_cardInfo);
        }

        var _performance = {};
        var width = Pard.ColumnWidth - 2;
        var left = _time.position().left;

        var _performances = []
        var _oldColumnPerformances = [];
        var _myPerformances = [];
        Pard.Widgets.Program.forEach(function(performance){
          if(performance.performance_id != _cardInfo.performance_id && performance.date == day && performance.host_proposal_id == space.proposal_id && performance.permanent == false) _performances.push(performance);
          if(performance.performance_id != _cardInfo.performance_id && performance.date == day && performance.host_proposal_id == ui.helper.data('host_proposal_id') && performance.permanent == false && ui.draggable.hasClass('programHelper')) _oldColumnPerformances.push(performance);
          if(performance.date == day && performance.participant_proposal_id == ui.helper.data('cardInfo').participant_proposal_id) _myPerformances.push(performance);
          if(performance.date == day && performance.participant_id == ui.helper.data('cardInfo').participant_id && performance.permanent == false) _myPerformances.push(performance);
          if(performance.performance_id == _cardInfo.performance_id){
            _time.append(performance.card);
            performance.host_id = space.profile_id;
            performance.host_proposal_id = space.proposal_id;
            performance.time = [start.getTime(), end.getTime()];
            performance.card.css({
              'top': position,
              'height': duration,
              'left' : left,
              'width': width
            });
            performance.card.resizable({
              maxWidth: width,
              minWidth: width,
              maxHeight: _time.height() - (position - colPosition),
            });
            if($.inArray(day, _cardInfo.availability) < 0) {
              performance.card.addClass('artist-not-available-call-manager');
            }
            else{
              performance.card.removeClass('artist-not-available-call-manager');
              performance.card.css({
                'opacity': '1',
                'filter': 'alpha(opacity=100)'
              });
            }
            _performances.push(performance);
          }
        });
        Pard.Widgets.AlignPerformances(_performances);
        if (_oldColumnPerformances.length > 0 && ui.helper.data('host_proposal_id') != space.proposal_id) Pard.Widgets.AlignPerformances(_oldColumnPerformances);
        ui.helper.data('host_proposal_id', space.proposal_id);
        if (_myPerformances)  _myPerformances = Pard.Widgets.ReorderProgramCrono(_myPerformances);
        _myPerformances.some(function(performance, index){
          var _checkConflict = function(){
            for(i = _myPerformances.indexOf(performance) + 1; i < _myPerformances.length; i++){
              if(_myPerformances[i].time[0] < performance.time[1]) return true;
            }
          }
          if(_checkConflict()){
            var _content = $('<div>').addClass('very-fast reveal full');
            _content.empty();
            $('body').append(_content);
            var _cardInfo = ui.helper.data('cardInfo');
            _cardInfo.profile_id = _cardInfo.participant_id;
            var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
            var _message = Pard.Widgets.PopupContent(_cardInfo.name, Pard.Widgets.ArtistProgram(_cardInfo), 'space-program-popup-call-manager');
            _message.setCallback(function(){
              _content.remove();
            });
            _content.append(_message.render());
            _popup.open();
            return true;
          }
        });
      }
    });

    _spaceCol.append(_time);
    var _oldIndex = 0;
    //Making columns draggable
    _spaceCol.draggable({
      containment: '.tableContainer',
      revert: 'invalid',
      axis: 'x',
      handle: '.spaceHeader',
      helper: function(){ 
        //Calling the helper to be dragged
        return Pard.Widgets.SpaceHelper(space, _spaceCol).render();
      },
      start: function(event, ui){
        //Column becomes grey
        _oldIndex = Pard.ShownSpaces.indexOf(space);
        _spaceCol.addClass('ui-sortable-placeholder');
      },
      drag: function(event, ui){
        _spaceHeader.removeClass('cursor_grab').addClass('cursor_move');
        //We get the original position of the column, necessary for later calculations
        var originalPosition = $(this).data("uiDraggable").originalPosition;
        var position = ui.position.left;

        //If the position of the column increases in more than a half of its with we switch columns
        if (position > (originalPosition.left + Pard.ColumnWidth / 2)){
          var index = Pard.ShownSpaces.indexOf(space);
          if(index < Pard.ShownSpaces.length - 1){
            //Repositioning dragged space after next space
            Pard.ShownSpaces[index + 1][day].after(space[day]);
            //Repositioning all the performances
            Pard.ShownSpaces[index + 1][day].find('.programHelper').css({left: '-=' + Pard.ColumnWidth + "px"});
            
            //Repositioning elements in Pard.Space array (this makes that the changes are persistant even if you use the selectors)
            var spaceIndex = Pard.Spaces.indexOf(space);
            var nextSpaceIndex = Pard.Spaces.indexOf(Pard.ShownSpaces[index + 1]);
            Pard.Spaces.splice(spaceIndex, 1);
            Pard.Spaces.splice(nextSpaceIndex, 0, space);

            //Repositioning elements in ShownSpaces array
            Pard.ShownSpaces.splice(index, 1);
            Pard.ShownSpaces.splice(index + 1, 0, space);

            //Recalculatig original position for the stop animation
            $(this).data("uiDraggable").originalPosition = {
              top : originalPosition.top,
              left : originalPosition.left + Pard.ColumnWidth
            }
          }
        }
        //Same as before but with previous column
        if (position < (originalPosition.left - Pard.ColumnWidth / 2)){
          var index = Pard.ShownSpaces.indexOf(space);
          if(index > 0){
            space[day].after(Pard.ShownSpaces[index - 1][day]);
            Pard.ShownSpaces[index - 1][day].find('.programHelper').css({left: '+=' + Pard.ColumnWidth + "px"});
            
            var spaceIndex = Pard.Spaces.indexOf(space);
            var prevSpaceIndex = Pard.Spaces.indexOf(Pard.ShownSpaces[index - 1]);
            Pard.Spaces.splice(spaceIndex, 1);
            Pard.Spaces.splice(prevSpaceIndex, 0, space);

            Pard.ShownSpaces.splice(index, 1);
            Pard.ShownSpaces.splice(index - 1, 0, space);

            $(this).data("uiDraggable").originalPosition = {
              top : originalPosition.top,
              left : originalPosition.left - Pard.ColumnWidth
            }
          }
        }
      },
      stop:function(event, ui){
        // console.log('cursor');
        _spaceHeader.removeClass('cursor_move').addClass('cursor_grab');
        _spaceHeader.mousedown(function(){
          _spaceHeader.removeClass('cursor_grab').addClass('cursor_move');
        });
        _spaceHeader.mouseup(function(){
          _spaceHeader.removeClass('cursor_move').addClass('cursor_grab');
        });
        //Column is not grey anymore
        //Repositioning all performances in the new location
        var _newIndex = Pard.ShownSpaces.indexOf(space);
        _spaceCol.removeClass('ui-sortable-placeholder');
        _spaceCol.find('.programHelper').css({left: '+=' + ((_newIndex - _oldIndex) * Pard.ColumnWidth) + "px"});
      }
    });

    // var _spaceColContainer = $('<div>').css({'overflow-y':'hidden','display':'inline-block'}).append(_spaceCol);

    return {
      render: function(){
        return _spaceCol;
      }
    }
  }

  ns.Widgets.PermanentSpaceColumn = function(space){
    var eventTime = Pard.CachedCall.eventTime;
    var _spaceCol = $('<div>').addClass('spaceCol').css({
      'display': ' inline-block',
      'width': '11rem',
      'border-width': '1px',
      'border-style': 'solid'
    });
    var _spaceHeader = $('<div>').addClass('spaceHeader space-column-header cursor_grab');
    // .css({
    //     'display': 'inline-block',
    //     'padding': 0,
    //     'background-color': '#009999',
    //     'border-color': '#999999',
    //     'height': '40px',
    //     'cursor': 'pointer',
    //     'text-align': 'center',
    //     'width': '100%'
    //   });

      var _icon = Pard.Widgets.SpaceDropdownMenu(space).render();
      var _menuIcon = $('<div>').append(_icon);
      _menuIcon.css({
        'display': 'inline-block',
        'vertical-align': 'middle',
        'height': 38,
      });
      _spaceCol.append(_menuIcon);

      var _spacename = $('<div>');
      _spacename.addClass('space-name-container-call-manager');
  
      var _titleText = $('<a>').attr('href','#');
      _titleText.text(Pard.Widgets.CutString(space.name, 35));
      _spacename.append($('<p>').addClass('space-name-headerTable-call-manager').append(_titleText));
      _spaceHeader.append(_spacename, _menuIcon);

      _spaceHeader.mousedown(function(){
        _spaceHeader.removeClass('cursor_grab').addClass('cursor_move');
      });
      _spaceHeader.mouseup(function(){
        _spaceHeader.removeClass('cursor_move').addClass('cursor_grab');
      });

      Pard.Widgets.PopupCreator(_titleText, 'conFusión 2016', function(){ return Pard.Widgets.MySpaceCallProposalMessage(space)});

      _spaceCol.append(_spaceHeader);

    var _time = $('<div>').addClass('spaceTime').html('&nbsp').css({
      'height': 560
    });
    _time.droppable({
      accept: function(card){
        if(card.hasClass('proposalCard') || card.hasClass('programHelper')) return true;
      },
      drop: function(event, ui) {
        ui.helper.data('dropped', true);
        var colPosition = _time.position().top;

        //The initial position for permanent performances is at the top
        var position = colPosition;
        var duration = ui.helper.height();
        //Adjusting heigth
        if(ui.draggable.hasClass('proposalCard')) duration += 2;

        //If there are other cards in the column the new card must appear below all of them
        var _performance = ui.helper.data('cardInfo');
        var performance_ids = [];
        var _existingCard = '';
        var _myPerformances = [];
        Pard.Widgets.Program.forEach(function(performance){
          if(performance.participant_proposal_id == _performance.participant_proposal_id) _myPerformances.push(performance);
          if(performance['permanent'] == true){
            if(performance.performance_id == _performance.performance_id && performance['host_proposal_id'] == space.proposal_id) _existingCard = performance.card;
            //Since permanent performances are composed of multiple performances we have to check we count only one card per space
            if($.inArray(performance['performance_id'], performance_ids) < 0 && performance['host_proposal_id'] == space.proposal_id){
              performance_ids.push(performance['performance_id']);
              //We increase the position
              position += parseInt(performance['card'].height());
            }
          }
        });

        if(ui.draggable.hasClass('proposalCard')){
          _performance.card = Pard.Widgets.ProgramPermanentHelper(ui.helper.data('cardInfo'), space.proposal_id).render();
          _performance.card.css({
            'top': position,
            'left' : _time.position().left
          });
          //If the performance is new we create a performance with the same performance_id for each day of the event and push them to the program
          var _startHour = parseInt(eventTime['permanent'][0].split(':')[0]);
          var _startMin = parseInt(eventTime['permanent'][0].split(':')[1]);
          var _endHour = parseInt(eventTime['permanent'][1].split(':')[0]);
          var _endMin = parseInt(eventTime['permanent'][1].split(':')[1]);
          Object.keys(eventTime).forEach(function(date){
            if (date == 'permanent') return false;
            var start = new Date(date.split('-')[0],date.split('-')[1] -1,date.split('-')[2],_startHour, _startMin);
            // start.setHours(_startHour,_startMin);
            start = start.getTime(); 
            // var lastIndex = eventTime[date].length - 1;
            var end = new Date(date.split('-')[0],date.split('-')[1] -1,date.split('-')[2],_endHour, _endMin);
            end = end.getTime();
            var permanentPerformance = {
              performance_id: _performance.performance_id,
              participant_id: _performance.participant_id,
              participant_proposal_id: _performance.participant_proposal_id,
              host_id: space.profile_id,
              host_proposal_id: space.proposal_id,
              date: date,
              permanent: true,
              time: [start, end],
              card: _performance.card
            }
            Pard.Widgets.Program.push(permanentPerformance);
            _myPerformances.push(permanentPerformance);
          });
          _time.append(_performance.card);
        }
        else{
          var host_proposal_id = ui.helper.data('host_proposal_id');
          Pard.Widgets.Program.forEach(function(performance){
            if(performance.performance_id == _performance.performance_id && performance.host_proposal_id == host_proposal_id){
              performance.host_id = space.profile_id;
              performance.host_proposal_id = space.proposal_id;
              //If there is already a card that belongs to this performance we do not create a new one
              if(host_proposal_id == performance.host_proposal_id){
                performance.card.css({
                  'top': position,
                  'left' : _time.position().left,
                  'opacity': '1',
                  'filter': 'alpha(opacity=100)'
                });
              }
              else if(_existingCard != false){
                performance.card.remove();
                performance.card = _existingCard;
              }
              else{
                performance.card.css({
                'top': position,
                'left' : _time.position().left,
                'opacity': '1',
                'filter': 'alpha(opacity=100)'
                });
              }
            }
          });
        }
        ui.helper.data('host_proposal_id', space.proposal_id);
        if (_myPerformances)  _myPerformances = Pard.Widgets.ReorderProgramCrono(_myPerformances);
        _myPerformances.some(function(performance, index){
          var _checkConflict = function(){
            for(i = _myPerformances.indexOf(performance) + 1; i < _myPerformances.length; i++){
              if(_myPerformances[i].time[0] < performance.time[1]) return true;
            }
          }
          if(_checkConflict()){
            var _content = $('<div>').addClass('very-fast reveal full');
            $('body').append(_content);
            _performance.profile_id = _performance.participant_id;
            var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
            var _message = Pard.Widgets.PopupContent(_performance.name, Pard.Widgets.ArtistProgram(_performance), 'space-program-popup-call-manager');
            _message.setCallback(function(){
              _content.remove();
            });
            _content.append(_message.render());
            _popup.open();
            return true;
          }
        });
      }
    });

    _spaceCol.append(_time);
    //Same as regular space columns
    _spaceCol.draggable({
      containment: '.tableContainer',
      revert: 'invalid',
      axis: 'x',
      handle: '.spaceHeader',
      helper: function(){ 
        return Pard.Widgets.SpaceHelper(space, _spaceCol).render();
      },
      start: function(event, ui){
        _spaceHeader.removeClass('cursor_grab').addClass('cursor_move');
      },
      drag: function(event, ui){
        _spaceHeader.css('cursor','move');
        var originalPosition = $(this).data("uiDraggable").originalPosition;
        var position = ui.position.left;

        if (position > (originalPosition.left + Pard.ColumnWidth / 2)){
          var index = Pard.ShownSpaces.indexOf(space);
          if(index < Pard.ShownSpaces.length - 1){
            Pard.ShownSpaces[index + 1]['permanent'].after(space['permanent']);
            Pard.ShownSpaces[index + 1]['permanent'].find('.programHelper').css({left: Pard.ShownSpaces[index + 1]['permanent'].position().left + 1 + "px"});
            
            var spaceIndex = Pard.Spaces.indexOf(space);
            var nextSpaceIndex = Pard.Spaces.indexOf(Pard.ShownSpaces[index + 1]);
            Pard.Spaces.splice(spaceIndex, 1);
            Pard.Spaces.splice(nextSpaceIndex, 0, space);

            Pard.ShownSpaces.splice(index, 1);
            Pard.ShownSpaces.splice(index + 1, 0, space);

            $(this).data("uiDraggable").originalPosition = {
              top : originalPosition.top,
              left : originalPosition.left + Pard.ColumnWidth
            }
          }
        }
        if (position < (originalPosition.left - Pard.ColumnWidth / 2)){
          var index = Pard.ShownSpaces.indexOf(space);
          if(index > 0){
            space['permanent'].after(Pard.ShownSpaces[index - 1]['permanent']);
            Pard.ShownSpaces[index - 1]['permanent'].find('.programHelper').css({left: Pard.ShownSpaces[index - 1]['permanent'].position().left + 1 + "px"});
            
            var spaceIndex = Pard.Spaces.indexOf(space);
            var prevSpaceIndex = Pard.Spaces.indexOf(Pard.ShownSpaces[index - 1]);
            Pard.Spaces.splice(spaceIndex, 1);
            Pard.Spaces.splice(prevSpaceIndex, 0, space);

            Pard.ShownSpaces.splice(index, 1);
            Pard.ShownSpaces.splice(index - 1, 0, space);

            $(this).data("uiDraggable").originalPosition = {
              top : originalPosition.top,
              left : originalPosition.left - Pard.ColumnWidth
            }
          }
        }
      },
      stop:function(event, ui){
        _spaceHeader.removeClass('cursor_move').addClass('cursor_grab');
        _spaceHeader.mousedown(function(){
          _spaceHeader.removeClass('cursor_grab').addClass('cursor_move');
        });
        _spaceHeader.mouseup(function(){
          _spaceHeader.removeClass('cursor_move').addClass('cursor_grab');
        });
        _spaceCol.removeClass('ui-sortable-placeholder');
        _spaceCol.find('.programHelper').css({left: _spaceCol.position().left + 1 + "px"});
      }
    });



    return {
      render: function(){
        return _spaceCol;
      }
    }
  }

}(Pard || {}));
