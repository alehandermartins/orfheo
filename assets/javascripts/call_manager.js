'use strict';

(function(ns){

  ns.Widgets.ProgramManager = function(call){
    var _createdWidget = $('<div>').attr('id', 'programPanel').css({
      'margin-left': 35
    });

    var eventTime = {
      '2016-10-15T00:00:00.000Z': [['2016-10-15T10:00:00.000Z', '2016-10-15T14:00:00.000Z'], ['2016-10-15T17:00:00.000Z', '2016-10-15T23:00:00.000Z']],
      '2016-10-16T00:00:00.000Z': [['2016-10-16T10:00:00.000Z', '2016-10-16T14:00:00.000Z'], ['2016-10-16T17:00:00.000Z', '2016-10-16T23:00:00.000Z']]
    }

    var artists = [];
    var spaces = [];
    var spaceColumns = {};

    call['proposals'].forEach(function(proposal){
      if (proposal.type == 'artist') artists.push(proposal);
      if (proposal.type == 'space') spaces.push(proposal);
    });

    _getProposal = function(proposal_id){
      var result = {};
      call['proposals'].forEach(function(proposal){
        if(proposal.proposal_id == proposal_id) return (result = proposal); 
      });
      return result;
    };

    _getProfileiD = function(proposal_id){
      var profile_id = '';
      call['proposals'].forEach(function(proposal){
        if(proposal.proposal_id == proposal_id) return (profile_id = proposal.profile_id); 
      });
      return profile_id;
    };

    var _tableContainer = $('<div>').addClass('tableContainer').css({
      'overflow-x': 'scroll',
      'overflow-y': 'hidden',
      'width': 176*5,
      'position': 'relative'
    });

    var _table = $('<div>').css({
      'width': 'auto',
      'white-space':'nowrap',
    });

    var _timeTable = $('<div>');
    var _daySelector = $('<select>');

    var _lastSelected = Object.keys(eventTime)[0];;

    _daySelector.on('change', function(){
      spaceColumns[_lastSelected].forEach(function(spaceCol){
        if(_daySelector.val() == 'permanent') _timeTable.hide()
        else{_timeTable.show()}
        spaceCol.hide();
      });
      spaceColumns[_daySelector.val()].forEach(function(spaceCol){
        spaceCol.show();
      });
      _lastSelected = _daySelector.val();
    });

    _createdWidget.append(_daySelector);

    _daySelector.css({
      position: "absolute",
      top: 162,
      left: -140,
      width: 120
    });

    Object.keys(eventTime).forEach(function(day){

      spaceColumns[day] = [];

      var dateText = day.split('T')[0];
      var date = $('<option>').val(day).text(dateText); 
      _daySelector.append(date);
      
      var start = parseInt(eventTime[day][0][0].split('T')[1].split(':')[0]);
      var lastIndex = eventTime[day].length - 1;
      var end = parseInt(eventTime[day][lastIndex][1].split('T')[1].split(':')[0]);

      var hours = [];
      for (var i = start; i <= end; i++) {
        hours.push(i);
      };

      hours.forEach(function(hour, hourIndex){
        var _time = $('<div>').html(hour + ':00').css({
          position: "absolute",
          top: 162 + hourIndex * 40 + "px",
          left: 0
        });
        var _line = $('<hr>').css({
          position: "absolute",
          top: 162 + hourIndex * 40 + "px",
          left: 0,
          width: 932
        });
        _timeTable.append(_time, _line);
        _createdWidget.append(_timeTable);
      });

      spaces.forEach(function(space){

        var _spaceCol = $('<div>').addClass('spaceCol').attr('id', space.proposal_id).css({
          'display': ' inline-block',
          'width': '11rem',
          'border-width': '1px',
          'border-style': 'solid',
        });
        var _spacename = $('<div>').addClass('spaceName').html(space.name).css({
          'background': '#b5cfd2',
          'padding': '8px',
          'border-color': '#999999',
          'height': '40px',
          'cursor': 'pointer'
        });

        Pard.Widgets.PopupCreator(_spacename, 'conFusión 2016', function(){ return Pard.Widgets.MySpaceCallProposalMessage(space)});

        _spaceCol.append(_spacename);

        var _time = $('<div>').addClass('spaceTime').html('&nbsp').css({
          'height': (hours.length - 1) * 40
        });
        _time.droppable({
          accept: function(card){
            if(card.hasClass('proposalCard') || card.hasClass('programHelper')) return true;
          },
          drop: function(event, ui) {

            var position = ui.helper.position().top;
            var colPosition = _time.position().top;

            if(ui.draggable.hasClass('proposalCard')) position -= (_tableContainer.position().top);
            if(position < colPosition) position = colPosition;

            var _offset = (position - colPosition) % 10;
            if(_offset >= 5) position += 10 - _offset;
            if(_offset < 5) position -= _offset;

            var duration = ui.helper.height();
            Pard.Widgets.DraggedPerformance['height'] = duration;
            Pard.Widgets.DraggedPerformance['top'] = position;
            Pard.Widgets.DraggedPerformance['left'] = _time.position().left;
            Pard.Widgets.DraggedPerformance['maxHeight'] = _time.height() - (position - colPosition);

            if(position + duration > colPosition + _time.height()) position = colPosition + _time.height() - duration;

            var performance = Pard.Widgets.DraggedPerformance;
            var eventDate = day.split('T')[0];
            var eventTimeArray = eventTime[day][0][0].split('T')[1].split(':');
            var eventMinutes = parseInt(eventTimeArray[0]) * 60 + parseInt(eventTimeArray[1]);

            var start = (position - 41) * 1.5 + eventMinutes;
            var end = (start + duration * 1.5);
            var startHour = Math.floor(start/60);
            var startMin = start % 60;
            if(startHour < 10) startHour = '0' + startHour;
            if(startMin < 10) startMin = '0' + startMin;
            var endHour = Math.floor(end/60);
            var endMin = end % 60;
            if(endHour < 10) endHour = '0' + endHour;
            if(endMin < 10) endMin = '0' + endMin;
            start = eventDate + 'T' + startHour + ':' + startMin + ':' + '00' + '.000Z';
            end = eventDate + 'T' + endHour + ':' + endMin + ':' + '00' + '.000Z';

            var newPerformance = Pard.Widgets.ProgramHelper(Pard.Widgets.DraggedPerformance, space.proposal_id).render();
            _time.append(newPerformance);

            var performance = {
              performance_id: performance.performance_id,
              participant_id: performance.profile_id,
              participant_proposal_id: performance.proposal_id,
              host_id: space.profile_id,
              host_proposal_id: space.proposal_id,
              date: day,
              permanent: false,
              time: [start, end],
              card: newPerformance
            }

            Pard.Widgets.Program.push(performance);
          }
        });

        _spaceCol.append(_time);

        _spaceCol.draggable({
          containment: '.tableContainer',
          revert: 'invalid',
          axis: 'x',
          handle: '.spaceName',
          helper: function(){ 
            return Pard.Widgets.SpaceHelper(_spaceCol).render();
          },
          start: function(event, ui){
            _spaceCol.addClass('ui-sortable-placeholder');
          },
          drag: function(event, ui){
            var originalPosition = $(this).data("uiDraggable").originalPosition;
            var position = ui.position.left;
            var dayColumns = spaceColumns[day];

            if (position > (originalPosition.left + 88)){
              var index = $.inArray(_spaceCol, dayColumns);
              if(index < dayColumns.length - 1){
                dayColumns[index + 1].after(dayColumns[index]);
                dayColumns[index + 1].find('.programHelper').css({left: dayColumns[index + 1].position().left + 1 + "px"});
                var tempColumn = dayColumns[index + 1];
                dayColumns[index + 1] = dayColumns[index];
                dayColumns[index] = tempColumn;
                $(this).data("uiDraggable").originalPosition = {
                    top : originalPosition.top,
                    left : originalPosition.left + 176
                }
              }
            }
            if (position < (originalPosition.left - 88)){
              var index = $.inArray(_spaceCol, dayColumns);
              if(index > 0){
                dayColumns[index].after(dayColumns[index - 1]);
                dayColumns[index - 1].find('.programHelper').css({left: dayColumns[index - 1].position().left + 1 + "px"});
                var tempColumn = dayColumns[index - 1];
                dayColumns[index - 1] = dayColumns[index];
                dayColumns[index] = tempColumn;
                $(this).data("uiDraggable").originalPosition = {
                    top : originalPosition.top,
                    left : originalPosition.left - 176
                }
              }
            }
          },
          stop:function(event, ui){
            _spaceCol.removeClass('ui-sortable-placeholder');
            _spaceCol.find('.programHelper').css({left: _spaceCol.position().left + 1 + "px"});
          }
        });
        _table.append(_spaceCol.hide());
        spaceColumns[day].push(_spaceCol);
      });
    });

    spaceColumns['permanent'] = [];
    _daySelector.append($('<option>').val('permanent').text('Permanente'));

    spaces.forEach(function(space){
      var _spaceCol = $('<div>').addClass('spaceCol').attr('id', space.proposal_id).css({
        'display': ' inline-block',
        'width': '11rem',
        'border-width': '1px',
        'border-style': 'solid',
      });
      var _spacename = $('<div>').addClass('spaceName').html(space.name).css({
        'background': '#b5cfd2',
        'padding': '8px',
        'border-color': '#999999',
        'height': '40px',
        'cursor': 'pointer'
      });

      _spaceCol.append(_spacename);

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

            if(ui.draggable.hasClass('proposalCard')) position -= (_tableContainer.position().top);
            if(position < colPosition) position = colPosition;

            var _offset = (position - colPosition) % 10;
            if(_offset >= 5) position += 10 - _offset;
            if(_offset < 5) position -= _offset;

            var duration = ui.helper.height();
            position = colPosition;
            Pard.Widgets.Program.forEach(function(performanceProgram){
              if(performanceProgram['host_proposal_id'] == space.proposal_id && performanceProgram['permanent'] == true) position += performanceProgram['card'].height();
            });
            Pard.Widgets.DraggedPerformance['height'] = duration;
            Pard.Widgets.DraggedPerformance['top'] = position;
            Pard.Widgets.DraggedPerformance['left'] = _time.position().left;

            if(position + duration > colPosition + _time.height()) position = colPosition + _time.height() - duration;

            var performance = Pard.Widgets.DraggedPerformance;
            var newPerformance = Pard.Widgets.ProgramPermanentHelper(Pard.Widgets.DraggedPerformance, space.proposal_id).render();
            _time.append(newPerformance);

            var performance = {
              performance_id: performance.performance_id,
              participant_id: performance.profile_id,
              participant_proposal_id: performance.proposal_id,
              host_id: space.profile_id,
              host_proposal_id: space.proposal_id,
              date: Object.keys(eventTime),
              permanent: true,
              time: eventTime,
              card: newPerformance
            }
            Pard.Widgets.Program.push(performance);
          }
        });

      _spaceCol.append(_time);

      _spaceCol.draggable({
        containment: '.tableContainer',
        revert: 'invalid',
        axis: 'x',
        handle: '.spaceName',
        helper: function(){ 
          return Pard.Widgets.SpaceHelper(_spaceCol).render();
        },
        start: function(event, ui){
          _spaceCol.addClass('ui-sortable-placeholder');
        },
        drag: function(event, ui){
          var originalPosition = $(this).data("uiDraggable").originalPosition;
          var position = ui.position.left;
          var dayColumns = spaceColumns['permanent'];

          if (position > (originalPosition.left + 88)){
            var index = $.inArray(_spaceCol, dayColumns);
            if(index < dayColumns.length - 1){
              dayColumns[index + 1].after(dayColumns[index]);
              dayColumns[index + 1].find('.programHelper').css({left: dayColumns[index + 1].position().left + 1 + "px"});
              var tempColumn = dayColumns[index + 1];
              dayColumns[index + 1] = dayColumns[index];
              dayColumns[index] = tempColumn;
              $(this).data("uiDraggable").originalPosition = {
                  top : originalPosition.top,
                  left : originalPosition.left + 176
              }
            }
          }
          if (position < (originalPosition.left - 88)){
            var index = $.inArray(_spaceCol, dayColumns);
            if(index > 0){
              dayColumns[index].after(dayColumns[index - 1]);
              dayColumns[index - 1].find('.programHelper').css({left: dayColumns[index - 1].position().left + 1 + "px"});
              var tempColumn = dayColumns[index - 1];
              dayColumns[index - 1] = dayColumns[index];
              dayColumns[index] = tempColumn;
              $(this).data("uiDraggable").originalPosition = {
                  top : originalPosition.top,
                  left : originalPosition.left - 176
              }
            }
          }
        },
        stop:function(event, ui){
          _spaceCol.removeClass('ui-sortable-placeholder');
          _spaceCol.find('.programHelper').css({left: _spaceCol.position().left + 1 + "px"});
        }
      });
      _table.append(_spaceCol.hide());
      spaceColumns['permanent'].push(_spaceCol);
    });
    
   
    spaceColumns[Object.keys(eventTime)[0]].forEach(function(spaceCol){
      spaceCol.show();
    }); 
    _tableContainer.append(_table);
    _createdWidget.append(_tableContainer);

    _proposalsWidget = $('<div>').css({
      'margin-top': '5px',
      'overflow-x': 'scroll',
      'overflow-y': 'hidden',
      'width': 176*5
    });
    _proposalCards = $('<div>').css({
      'width': 'auto',
      'white-space':'nowrap'
    });

    artists.forEach(function(proposal){
      _proposalCards.append(Pard.Widgets.ProposalCard(proposal).render());
    });

    _proposalsWidget.append(_proposalCards);
    _createdWidget.append(_proposalsWidget);

    var _submitBtn = Pard.Widgets.Button('Guarda los cambios', function(){
      var program = [];
      Object.keys(spaceColumns).forEach(function(date){

        var eventDate = date.split('T')[0];
        var eventTimeArray = eventTime[date][0][0].split('T')[1].split(':');
        var eventMinutes = parseInt(eventTimeArray[0]) * 60 + parseInt(eventTimeArray[1]);
          
        spaceColumns[date].forEach(function(spaceCol){
          Object.keys(spaceCol.find('.programHelper')).forEach(function(key){
            if ($.isNumeric(key)){
              var theEvent = spaceCol.find('.programHelper')[key];
              
              var start = (theEvent.style.top.split('px')[0] - 41) * 1.5 + eventMinutes;
              var end = start + parseInt(theEvent.style.height.split('px')[0]) * 1.5;
              var startHour = Math.floor(start/60);
              var startMin = start % 60;
              if(startMin < 10) startMin = '0' + startMin;
              var endHour = Math.floor(end/60);
              var endMin = end % 60;
              if(endMin < 10) endMin = '0' + endMin;
              start = eventDate + 'T' + startHour + ':' + startMin + ':' + '00' + '.000Z';
              end = eventDate + 'T' + endHour + ':' + endMin + ':' + '00' + '.000Z';

              var performance = {
                participant_id: _getProfileiD(theEvent.id),
                participant_proposal_id: theEvent.id,
                host_id: _getProfileiD(spaceCol.attr('id')),
                host_proposal_id: spaceCol.attr('id'),
                date: date,
                permanent: false,
                time: [start, end]
              }
              program.push(performance);
            }
          });
        });
      });
      
      Pard.Backend.program(' ', program, function(data){
        console.log(data['status']);
      });
    });
    _createdWidget.append(_submitBtn.render());

    // if(call['program']){
    //   call['program'].forEach(function(performance){
    //     spaceColumns[performance.date].forEach(function(spaceCol){
    //       if(spaceCol.attr('id') == performance.host_proposal_id){
    //         var timeCol = spaceCol.find('.spaceTime');
    //         var proposal = _getProposal(performance.participant_proposal_id);

    //         var eventTimeArray = eventTime[performance.date][0][0].split('T')[1].split(':');
    //         var eventMinutes = parseInt(eventTimeArray[0]) * 60 + parseInt(eventTimeArray[1]);

    //         var startArray = performance.time[0].split('T')[1].split(':');
    //         var start = (parseInt(startArray[0]) * 60 + parseInt(startArray[1]) - eventMinutes) / 1.5;
    //         var endArray = performance.time[1].split('T')[1].split(':');
    //         var end = (parseInt(endArray[0]) * 60 + parseInt(endArray[1]) - eventMinutes) / 1.5;

    //         proposal['height'] = (end - start) ;
    //         var newEvent = Pard.Widgets.ProgramHelper(proposal).render();
    //         timeCol.append(newEvent);

    //         newEvent.css({
    //           position: 'absolute',
    //           top: start + 41 + "px",
    //           left: spaceColumns[performance.date].indexOf(spaceCol) * 176 + 1 + "px",
    //         });

    //         newEvent.resizable({
    //           maxWidth: 174,
    //           minWidth: 174,
    //           maxHeight: timeCol.height() - start,
    //           grid: 10
    //         });
    //       }
    //     });
    //   });
    // }

  	return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.DraggedPerformance = {};
  ns.Widgets.Program = [];
  ns.Widgets.CategoryColor = function(category){
    var _dictionary = {
      'music': '#3399FF',
      'arts': '#FF62B2',
      'poetry': '#FFFF66',
      'expo': '#66CC00',
      'street_art': '#FF3333',
      'audiovisual': '#C0C0C0',
      'other': '#FF8000',
      'workshop': '#000000'
    }

    return _dictionary[category];
  };

  ns.Widgets.ProposalCard = function(proposal){

    _generateUUID = function() {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    };
    var performance_id = _generateUUID();


    var _card =$('<span>').addClass('proposalCard');
    _card.draggable({
      revert: 'invalid',
      helper: function(){
        return Pard.Widgets.CardHelper(proposal).render();
      },
      snap: '.spaceTime',
      snapMode: 'inner',
      snapTolerance: 5,
      grid: [ 10, 10 ],
      start: function(event, ui){
        Pard.Widgets.DraggedPerformance = proposal;
        Pard.Widgets.DraggedPerformance['performance_id'] = _generateUUID();
        _card.css({'opacity': '0.4', 'filter': 'alpha(opacity=40)'});
      },
      stop:function(){
        _card.css({'opacity': '1', 'filter': 'alpha(opacity=100)'});
      }
    });

    var color = Pard.Widgets.CategoryColor(proposal.category);
    var _rgb = Pard.Widgets.IconColor(color).rgb();
    _card.css({border: 'solid 3px' + color});
    _card.hover(
      function(){
        $(this).css({
        'box-shadow': '0 0 2px 1px'+ color
        // 'background': 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+'.1'+ ')'
      });
      },
      function(){
        $(this).css({
          'box-shadow': '0px 1px 2px 1px rgba(10, 10, 10, 0.2)'
          // 'background':'white'
        });
      }
    );
    
    var _photoContainer = $('<div>').addClass('photo-container-card');
    _photoContainer.css({background: color});  

    var _circle = $('<div>').addClass('circleProfile position-circleProfile-card').css({background: color});
    var _icon = $('<div>').addClass('icon-profileCircle').html(Pard.Widgets.IconManager(proposal.category).render());
    var _colorIcon = Pard.Widgets.IconColor(color).render();
    _icon.css({color: _colorIcon});
    var _profilename = proposal.name;
    if (_profilename.length>38) _profilename = _profilename.substring(0,35)+'...';
    var _name = $('<div>').addClass('name-profileCard').html(_profilename);

    var _profiletitle = '';
    if (proposal.title) _profiletitle = proposal.title;
    if (_profiletitle.length>24) _profiletitle = _profiletitle.substring(0,21)+'...';
    var _city = $('<div>').addClass('city-profileCard').html(_profiletitle);
    var _category = $('<div>').addClass('category-proposalCard');
    var _categories = '- ';

    if (proposal.category) _categories += Pard.Widgets.Dictionary(proposal.category).render() + ' - ';
    if (_categories.length>26)  _categories = _categories.substring(0,25)+'...';
    _category.html(_categories);
    _circle.append(_icon);

    _card.append(_photoContainer, _circle, _name, _city, _category);

    Pard.Widgets.PopupCreator(_card, 'conFusión 2016', function(){ return Pard.Widgets.MyArtistCallProposalMessage(proposal)});

    return {
      render: function(){
        return _card;
      }
    }
  }

  ns.Widgets.CardHelper = function(proposal){
    var color = Pard.Widgets.CategoryColor(proposal.category);
    var duration = parseInt(proposal.duration)/60 * 40 || 100;
    var _card =$('<div>').css({
      'display': 'inline-block',
      'width': '10.9rem',
      'height': duration,
      'background': color,
      'z-index': 9999
    });

    var _proposalTitle = $('<div>').html(proposal.title);
    _proposalTitle.css({
      'display': 'block',
      'padding-left': '1px',
      'padding-right':'1px',
      'color': 'black',
      'margin-top': (duration/60 * 40)/3 + 'px',
      'text-align':'center',
      'width':'100%',
      'line-height': '1.3rem',
      'height': (duration/60 * 40)/3 + 'px'
    });

    _card.append(_proposalTitle);

    return {
      render: function(){
        return _card;
      }
    }
  }

  ns.Widgets.ProgramHelper = function(performance, space){
    var color = Pard.Widgets.CategoryColor(performance.category);
    var _card =$('<div>').addClass('programHelper').attr('id', performance.performance_id).css({
      'position': 'absolute',
      'top': performance.top,
      'left': performance.left,
      'display': 'inline-block',
      'width': '10.9rem',
      'height': performance.height + 'px',
      'background': color
    });

    var _performanceTitle = $('<div>').html(performance.title);
    _performanceTitle.css({
      'display': 'block',
      'padding-left': '1px',
      'padding-right':'1px',
      'color': 'black',
      'margin-top': performance.height/3 + 'px',
      'text-align':'center',
      'width':'100%',
      'line-height': '1.3rem',
      'height': performance.height/3 + 'px'
    });

    _card.append(_performanceTitle);

    _card.draggable({
      revert: false,
      helper: 'clone',
      grid: [ 10, 10 ],
      start: function(event, ui){
        Pard.Widgets.DraggedPerformance = performance;
        Pard.Widgets.Program.forEach(function(performanceProgram, index){
          if(performanceProgram.performance_id == performance.performance_id) Pard.Widgets.Program.splice(index, 1);
        });
        _card.css({'opacity': '0.4', 'filter': 'alpha(opacity=40)'});
      },
      stop:function(){
        _card.remove();
      }
    });

    _card.resizable({
      maxWidth: 174,
      minWidth: 174,
      maxHeight: performance.maxHeight,
      grid: 10,
      stop: function(event, ui){
        Pard.Widgets.Program.forEach(function(performanceProgram, index){
          if(performanceProgram.performance_id == performance.performance_id){
            var end = new Date(performanceProgram['time'][0]);
            end.setMinutes(end.getMinutes() + ui.size.height * 1.5);
            performanceProgram['time'][1] = end.toISOString();
          }
        });
      }
    });

    Pard.Widgets.PopupCreator(_card, performance.title, function(){ return Pard.Widgets.ProgramHelperPopup(performance, _card)});

    return {
      render: function(){
        return _card;
      }
    }
  }

  ns.Widgets.ProgramPermanentHelper = function(performance, space, top){
    var color = Pard.Widgets.CategoryColor(performance.category);
    var _card =$('<div>').addClass('programHelper').attr('id', performance.performance_id).css({
      'position': 'absolute',
      'top': performance.top,
      'left': performance.left,
      'display': 'inline-block',
      'width': '10.9rem',
      'height': '100px',
      'background': color
    });

    var _performanceTitle = $('<div>').html(performance.title);
    _performanceTitle.css({
      'display': 'block',
      'padding-left': '1px',
      'padding-right':'1px',
      'color': 'black',
      'margin-top': performance.height/3 + 'px',
      'text-align':'center',
      'width':'100%',
      'line-height': '1.3rem',
      'height': performance.height/3 + 'px'
    });

    _card.append(_performanceTitle);
    var top = 0;

    _card.draggable({
      revert: false,
      helper: 'clone',
      grid: [ 10, 10 ],
      start: function(event, ui){
        top = _card.position().top;
        Pard.Widgets.DraggedPerformance = performance;
        Pard.Widgets.Program.forEach(function(performanceProgram, index){
          if(performanceProgram.performance_id == performance.performance_id) Pard.Widgets.Program.splice(index, 1);
        });
        _card.css({'opacity': '0.4', 'filter': 'alpha(opacity=40)'});
      },
      stop:function(){
        _card.remove();
        spacePerformances = []
        Pard.Widgets.Program.forEach(function(performanceProgram){
          if(performanceProgram['host_proposal_id'] == space && performanceProgram['permanent'] == true) spacePerformances.push(performanceProgram);
        });
        spacePerformances.forEach(function(spacePerformance, index){
          spacePerformance['card'].css({'top': index * performance.height + 41});
        });
      }
    });

    Pard.Widgets.PopupCreator(_card, performance.title, function(){ return Pard.Widgets.ProgramHelperPopup(performance, _card)});

    return {
      render: function(){
        return _card;
      }
    }
  }

  ns.Widgets.SpaceHelper = function(spaceCol){
    var _spaceCol = spaceCol.clone();

    _spaceCol.find('.programHelper').css({
      top: '-=' + spaceCol.position().top, 
      left: _spaceCol.position().left + "px"
    });

    return {
      render: function(){
        return _spaceCol;
      }
    }
  }

  ns.Widgets.ProgramHelperPopup = function(proposal, card){
    var _createdWidget = $('<div>');
    var _closepopup = {};

    var _callName = $('<p>').append('Inscrito en ',$('<span>').text('Benimaclet conFusión festival 2016').css({'font-weight': 'bold'}),' con:').addClass('activities-box-call-name');

    _createdWidget.append(_callName);

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  };
}(Pard || {}));




