'use strict';

(function(ns){

  ns.Widgets.SpaceColumn = function(space, day, hours){
    var eventTime = Pard.CachedCall.eventTime;

    var _spaceCol = $('<div>').addClass('spaceCol').attr('id', space.proposal_id).css({
      'display': ' inline-block',
      'width': '11rem',
      'border': '1px solid'
    });
    //Space header is the handle for dragging space columns
    var _spaceHeader = $('<div>').addClass('spaceHeader space-column-header');

    var _icon = Pard.Widgets.SpaceDropdownMenu(space).render();
    var _menuIcon = $('<div>').append(_icon);
    _menuIcon.css({
      'display': 'inline-block',
      'vertical-align': 'middle',
    });
    _spaceCol.append(_menuIcon);

    var _spacename = $('<div>');
    _spacename.css({
      'display': 'inline-block',
      'vertical-align': 'middle',
      'width': 120,
      'height': 38,
      'white-space': 'normal'
    });

    var _title = $('<p>').addClass('profile-nav-name-selected').text(space.name);
    _spacename.append(Pard.Widgets.FitInBox(_title, 120, 38).render());
    _spaceHeader.append(_spacename, _menuIcon);
    _spaceCol.append(_spaceHeader);

    //Popup showing the space form
    Pard.Widgets.PopupCreator(_spacename, 'conFusión 2016', function(){ return Pard.Widgets.MySpaceCallProposalMessage(space)});

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

        var duration = ui.helper.height();

        //Adjusting border
        if(ui.draggable.hasClass('proposalCard')) duration += 2;

        //Dragged performance stores all the actual dragged card info
        Pard.Widgets.DraggedPerformance['height'] = duration;
        Pard.Widgets.DraggedPerformance['width'] = _time.width();
        Pard.Widgets.DraggedPerformance['top'] = position;
        Pard.Widgets.DraggedPerformance['left'] = _time.position().left;
        Pard.Widgets.DraggedPerformance['maxHeight'] = _time.height() - (position - colPosition);
        Pard.Widgets.DraggedPerformance['day'] = day;
        
        //Obtaining start and end times from position and pixels

        var start = new Date(parseInt(eventTime[day][0][0]));
        start.setMinutes(start.getMinutes() + (position - 41) * 1.5);
        var end = new Date(start.getTime());
        end.setMinutes(start.getMinutes() + duration * 1.5);

        //New performance card
        var newPerformance = Pard.Widgets.ProgramHelper(Pard.Widgets.DraggedPerformance, space.proposal_id).render();
        _time.append(newPerformance);

        //Performance to be stored
        //Each performance has a key(card) that points to the card that represents it
        var performance = {
          performance_id: Pard.Widgets.DraggedPerformance.performance_id,
          participant_id: Pard.Widgets.DraggedPerformance.profile_id,
          participant_proposal_id: Pard.Widgets.DraggedPerformance.proposal_id,
          host_id: space.profile_id,
          host_proposal_id: space.proposal_id,
          date: day,
          permanent: false,
          time: [start.getTime(), end.getTime()],
          card: newPerformance
        }

        //Program to be stored
        Pard.Widgets.Program.push(performance);
      }
    });

    _spaceCol.append(_time);

    //Making columns draggable
    _spaceCol.draggable({
      containment: '.tableContainer',
      revert: 'invalid',
      axis: 'x',
      handle: '.spaceHeader',
      helper: function(){ 
        //Calling the helper to be dragged
        return Pard.Widgets.SpaceHelper(_spaceCol).render();
      },
      start: function(event, ui){
        //Column becomes grey
        _spaceCol.addClass('ui-sortable-placeholder');
      },
      drag: function(event, ui){
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
            Pard.ShownSpaces[index + 1][day].find('.programHelper').css({left: Pard.ShownSpaces[index + 1][day].position().left + 1 + "px"});
            
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
            Pard.ShownSpaces[index - 1][day].find('.programHelper').css({left: Pard.ShownSpaces[index - 1][day].position().left + 1 + "px"});
            
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
        //Column is not grey anymore
        //Repositioning all performances in the new location
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

  ns.Widgets.PermanentSpaceColumn = function(space){
    var eventTime = Pard.CachedCall.eventTime;
    var _spaceCol = $('<div>').addClass('spaceCol').attr('id', space.proposal_id).css({
      'display': ' inline-block',
      'width': '11rem',
      'border-width': '1px',
      'border-style': 'solid'
    });
    var _spaceHeader = $('<div>').addClass('spaceHeader space-column-header');
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

      var _icon = Pard.Widgets.IconManager('menu').render().css({
        'margin-top': 8
      });
      var _menuIcon = $('<div>').append(_icon);
      _menuIcon.css({
        'display': 'inline-block',
        'vertical-align': 'middle',
        'height': 38,
      });
      _spaceCol.append(_menuIcon);

      var _spacename = $('<div>');
      _spacename.css({
        'display': 'inline-block',
        'vertical-align': 'middle',
        'width': 120,
        'height': 38,
        'white-space': 'normal'
      });

      var _title = $('<p>').addClass('profile-nav-name-selected').text(space.name);
      _spacename.append(Pard.Widgets.FitInBox(_title, 120, 38).render());
      _spaceHeader.append(_spacename, _menuIcon);

      Pard.Widgets.PopupCreator(_spacename, 'conFusión 2016', function(){ return Pard.Widgets.MySpaceCallProposalMessage(space)});

      _spaceCol.append(_spaceHeader);

    var _time = $('<div>').addClass('spaceTime').html('&nbsp').css({
      'height': 520
    });
    _time.droppable({
      accept: function(card){
        if(card.hasClass('proposalCard') || card.hasClass('programHelper')) return true;
      },
      drop: function(event, ui) {

        var position = ui.helper.position().top;
        var colPosition = _time.position().top;

        if(position < colPosition) position = colPosition;

        var _offset = (position - colPosition) % 10;
        if(_offset >= 5) position += 10 - _offset;
        if(_offset < 5) position -= _offset;

        var duration = ui.helper.height();

        //Adjusting width
        if(ui.draggable.hasClass('proposalCard')) duration += 2;

        //The initial position for permanent performances is at the top
        position = colPosition;
        if(position + duration > colPosition + _time.height()) position = colPosition + _time.height() - duration;

        //If there are other cards in the column the new card must appear below all of them
        var performance_ids = [];
        Pard.Widgets.Program.forEach(function(performanceProgram){
          if(performanceProgram['permanent'] == true){
            //Since permanent performances are composed of multiple performances we have to check we count only one card per space
            if($.inArray(performanceProgram['performance_id'], performance_ids) < 0 && performanceProgram['host_proposal_id'] == space.proposal_id){
              performance_ids.push(performanceProgram['performance_id']);
              //We increase the position
              position += parseInt(performanceProgram['card'].height());
            }
          }
        });

        Pard.Widgets.DraggedPerformance['height'] = duration;
        Pard.Widgets.DraggedPerformance['top'] = position;
        Pard.Widgets.DraggedPerformance['left'] = _time.position().left;

        var newPerformance = Pard.Widgets.ProgramPermanentHelper(Pard.Widgets.DraggedPerformance, space.proposal_id).render();

        //If we drop a dragged performance we only have to rewrite the space parameters in the program and point the performance to the new card
        if(ui.draggable.hasClass('programHelper')){
          Pard.Widgets.DraggedPerformance['performances'].forEach(function(performanceProgram){
            performanceProgram.host_id = space.profile_id;
            performanceProgram.host_proposal_id = space.proposal_id;
            performanceProgram.card = newPerformance;
            Pard.Widgets.Program.push(performanceProgram);
          });
          //If there is already a card that belongs to this performance we do not create a new one
          if($.inArray(Pard.Widgets.DraggedPerformance['performances'][0].performance_id, performance_ids) < 0) _time.append(newPerformance);
        }
        else{
          //If the performance is new we create a performance with the same performance_id for each day of the event and push them to the program
          _time.append(newPerformance);
          Object.keys(eventTime).forEach(function(date){
            var start = parseInt(eventTime[date][0][0]);
            var lastIndex = eventTime[date].length - 1;
            var end = parseInt(eventTime[date][lastIndex][1]);
            var performance = {
              performance_id: Pard.Widgets.DraggedPerformance.performance_id,
              participant_id: Pard.Widgets.DraggedPerformance.profile_id,
              participant_proposal_id: Pard.Widgets.DraggedPerformance.proposal_id,
              host_id: space.profile_id,
              host_proposal_id: space.proposal_id,
              date: date,
              permanent: true,
              time: [start, end],
              card: newPerformance
            }
            Pard.Widgets.Program.push(performance); 
          });
        }
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
        return Pard.Widgets.SpaceHelper(_spaceCol).render();
      },
      start: function(event, ui){
        _spaceCol.addClass('ui-sortable-placeholder');
      },
      drag: function(event, ui){
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
