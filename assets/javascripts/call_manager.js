'use strict';

(function(ns){

  ns.Widgets.ProgramManager = function(call){
    var _createdWidget = $('<div>').attr('id', 'programPanel').css({
      'margin-left': 35
    });

    Pard.Widgets.CachedCall = call;
    var eventTime = call.eventTime;
    eventTime = {
      '2016-10-15': [['2016-10-15T10:00:00.000Z', '2016-10-15T14:00:00.000Z'], ['2016-10-15T17:00:00.000Z', '2016-10-15T23:00:00.000Z']],
      '2016-10-16': [['2016-10-16T10:00:00.000Z', '2016-10-16T14:00:00.000Z'], ['2016-10-16T17:00:00.000Z', '2016-10-16T23:00:00.000Z']]
    };

    var artists = [];
    var spaces = [];
    var spaceColumns = {};

    call['proposals'].forEach(function(proposal){
      if (proposal.type == 'artist'){
        artists[proposal.profile_id] = artists[proposal.profile_id] || [];
        artists[proposal.profile_id].push(proposal)
      };
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

    var _artists = $('<ul>').addClass('accordion').attr({'data-accordion':'', 'role': 'tablist'}).css({
      'position': 'absolute',
      'overflow-y': 'scroll',
      'top': 141,
      'left': 751,
      'width': 233,
      'border-width': '1px',
      'border-style': 'solid',
      'height': 562,
      'z-index': 3
    });

    var lastArtist = '';
    var lastaHref = '';

    Object.keys(artists).forEach(function(profile_id, index){

      var proposal = artists[profile_id][0];
      var container = $('<div>').css({'padding': 0});
      var accordionNav = $('<li>').addClass('accordion-item');
      var aHref = $('<a>').addClass('accordion-title').text(proposal.name);
      var content = $('<div>').addClass('accordion-content').css({'padding': 0});
      artists[profile_id].forEach(function(proposal){
        content.append(Pard.Widgets.ProposalCard(proposal).render());
      });
      accordionNav.append(aHref);
      container.append(accordionNav, content);

      accordionNav.on('click', function(){
        if(!lastArtist){
          aHref.addClass('is-active');
          content.slideToggle();
        }
        else{
          if(aHref.hasClass('is-active')){
            content.slideToggle();
            aHref.removeClass('is-active');
          }
          else{
            if(lastArtist != content && lastaHref.hasClass('is-active')){
              lastArtist.slideToggle();
              lastaHref.removeClass('is-active');
            }
            content.slideToggle();
            aHref.addClass('is-active');
          }
        }
        lastArtist = content;
        lastaHref = aHref;
      });
      _artists.append(container);
    });


    var _showArtists = Pard.Widgets.Button('Artistas', function(){
      _artists.toggle('slide', {direction: 'right'}, 500);
    }).render();
    _showArtists.css({'position': 'absolute',
      'top': 141,
      'left': 1000,
    });

    _createdWidget.append(_artists, _showArtists);

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

      var date = $('<option>').val(day).text(day); 
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
          'border-style': 'solid'
        });
        var _spaceHeader = $('<div>').addClass('spaceHeader').css({
          'display': 'inline-block',
          'padding': 0,
          'background-color': '#009999',
          'border-color': '#999999',
          'height': '40px',
          'cursor': 'pointer',
          'text-align': 'center',
          'width': 174
        });

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
          'height': (hours.length - 1) * 40
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

            //Adjusting border
            if(ui.draggable.hasClass('proposalCard')) duration += 2;

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
              host_name: space.name,
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
        'border-style': 'solid'
      });
      var _spacename = $('<div>').addClass('spaceName').css({
        'background': '#b5cfd2',
        'padding': '8px',
        'border-color': '#999999',
        'height': '40px',
        'cursor': 'pointer',
        'text-align': 'center'
      });

      var _title = $('<p>').addClass('profile-nav-name-selected').text(space.name);
      _spacename.append(Pard.Widgets.FitInBox(_title, 176, 40).render());

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

            if(position < colPosition) position = colPosition;

            var _offset = (position - colPosition) % 10;
            if(_offset >= 5) position += 10 - _offset;
            if(_offset < 5) position -= _offset;

            var duration = ui.helper.height();
            if(ui.draggable.hasClass('proposalCard')) duration += 2;

            position = colPosition;
            Pard.Widgets.Program.forEach(function(performanceProgram){
              if(performanceProgram['host_proposal_id'] == space.proposal_id && performanceProgram['permanent'] == true) position += parseInt(performanceProgram['card'].height());
            });

            Pard.Widgets.DraggedPerformance['height'] = duration;
            Pard.Widgets.DraggedPerformance['top'] = position;
            Pard.Widgets.DraggedPerformance['left'] = _time.position().left;

            if(position + duration > colPosition + _time.height()) position = colPosition + _time.height() - duration;

            var performance = Pard.Widgets.DraggedPerformance;
            var newPerformance = Pard.Widgets.ProgramPermanentHelper(Pard.Widgets.DraggedPerformance, space.proposal_id).render();
            _time.append(newPerformance);
            
            var host_id = performance.host_id || [];
            var host_proposal_id = performance.host_proposal_id || [];
            var host_name = performance.host_name || [];
            var date = performance.date || [];
            var time = performance.time || [];
            var card = performance.card || [];
            var last_host = performance.last_host || '';

            Object.keys(eventTime).forEach(function(day){
              if(date.indexOf(day) < 1 ||  host_proposal_id[date.indexOf(day)] == last_host){
                date.push(day);
                host_id.push(space.profile_id);
                host_proposal_id.push(space.proposal_id);
                host_name.push(space.name);
                var last = eventTime[day].length - 1;
                time.push([eventTime[day][0][0], eventTime[day][last][1]]);
                card.push(newPerformance);
              }
            });

            performance.last_host = space.host_proposal_id;

            var performance = {
              performance_id: performance.performance_id,
              participant_id: performance.profile_id,
              participant_proposal_id: performance.proposal_id,
              host_id: host_id,
              host_proposal_id: host_proposal_id,
              host_name: host_name,
              date: date,
              permanent: true,
              time: time,
              card: card
            }
            Pard.Widgets.Program.push(performance);
          }
        });

      _spaceCol.append(_time);

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

    var _submitBtn = Pard.Widgets.Button('Guarda los cambios', function(){
      var program = [];
      Pard.Widgets.Program.forEach(function(performance, index){
        program.push(performance);
        delete program[index].card;
      });
      Pard.Backend.program(' ', Pard.Widgets.Program, function(data){
        console.log(data['status']);
      });
    });
    _createdWidget.append(_submitBtn.render());


    if(call['program']){
      var permanentPerformances = {};
      call['program'].forEach(function(performance){
        if (performance.permanent == 'true'){
          permanentPerformances[performance.host_proposal_id] = permanentPerformances[performance.host_proposal_id] || [];
          permanentPerformances[performance.host_proposal_id].push(performance);
        }
        if (performance.permanent == 'false'){
          spaceColumns[performance.date].forEach(function(spaceCol){
            if(spaceCol.attr('id') == performance.host_proposal_id){
              var timeCol = spaceCol.find('.spaceTime');
              var proposal = _getProposal(performance.participant_proposal_id);

              var eventTimeArray = eventTime[performance.date][0][0].split('T')[1].split(':');
              var eventMinutes = parseInt(eventTimeArray[0]) * 60 + parseInt(eventTimeArray[1]);

              var startArray = performance.time[0].split('T')[1].split(':');
              var start = (parseInt(startArray[0]) * 60 + parseInt(startArray[1]) - eventMinutes) / 1.5;
              var endArray = performance.time[1].split('T')[1].split(':');
              var end = (parseInt(endArray[0]) * 60 + parseInt(endArray[1]) - eventMinutes) / 1.5;

              proposal['performance_id'] = performance.performance_id
              proposal['height'] = (end - start);
              proposal['top'] = start + 41;
              proposal['left'] = spaceColumns[performance.date].indexOf(spaceCol) * 176 + 1;
              proposal['maxHeight'] = timeCol.height() - start;
              
              var newPerformance = Pard.Widgets.ProgramHelper(proposal, performance.host_proposal_id).render();
              timeCol.append(newPerformance);

              performance['card'] = newPerformance;
              Pard.Widgets.Program.push(performance);
            }
          });
        }
      });
      spaceColumns['permanent'].forEach(function(spaceCol){
        if(permanentPerformances[spaceCol.attr('id')]){
          permanentPerformances[spaceCol.attr('id')].forEach(function(performance, index){
            var timeCol = spaceCol.find('.spaceTime');
            var proposal = _getProposal(performance.participant_proposal_id);
            
            proposal['performance_id'] = performance.performance_id;
            proposal['height'] = 100;
            proposal['top'] = index * proposal['height'] + 41;
            proposal['left'] = spaceColumns['permanent'].indexOf(spaceCol) * 176 + 1;
          
            var newPerformance = Pard.Widgets.ProgramPermanentHelper(proposal, performance.host_proposal_id).render();
            timeCol.append(newPerformance);

            performance['permanent'] = true;
            performance['card'] = newPerformance;
            Pard.Widgets.Program.push(performance);
          });
        }
      });
    }

    Pard.Widgets.SpaceColumns = spaceColumns;

  	return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.CachedCall = {};
  ns.Widgets.SpaceColumns = {};
  ns.Widgets.DraggedPerformance = {};
  ns.Widgets.Program = [];
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
    var color = Pard.Widgets.CategoryColor(proposal.category);


    var _card = $('<div>').addClass('proposalCard');
    _card.draggable({
      revert: 'invalid',
      helper: function(){
        return Pard.Widgets.CardHelper(proposal).render();
      },
      appendTo: '.tableContainer',
      snap: '.spaceTime',
      snapMode: 'inner',
      snapTolerance: 5,
      grid: [ 10, 10 ],
      start: function(event, ui){
        var performance = {};
        performance['performance_id'] = _generateUUID();
        for (var field in proposal){ performance[field] = proposal[field] };
        Pard.Widgets.DraggedPerformance = performance;
        _card.css({'opacity': '0.4', 'filter': 'alpha(opacity=40)', 'z-index': 999999});
        $('.accordion').toggle('slide', {direction: 'right'}, 500);
      },
      stop:function(){
        _card.css({'opacity': '1', 'filter': 'alpha(opacity=100)'});
        $('.accordion').toggle('slide', {direction: 'right'}, 500);
      }
    });

    _card.addClass('profile-selected-container');
    var _circleColumn = $('<div>').addClass('icon-column');

    var _profileCircle = $('<div>').addClass('profile-nav-circle-selected').css({'background-color': color});
    var _nameColumn = $('<div>').addClass('name-column profile-name-column');
    var _name = $('<p>').addClass('profile-nav-name-selected').text(proposal.title);
    
    var _icon = $('<div>').append(Pard.Widgets.IconManager(proposal.category).render().addClass('profile-nav-element-icon'));
    var _colorIcon = Pard.Widgets.IconColor(color).render();
    _icon.css({color: _colorIcon});

    _circleColumn.append($('<div>').addClass('nav-icon-production-container').append(_profileCircle.append(_icon)));
    _nameColumn.append(Pard.Widgets.FitInBox(_name,125,54).render());

    _card.append(_circleColumn, _nameColumn);

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
      'z-index': 9999,
      'border': '1px solid',
      'border-color':color
    });

    var _title = $('<p>').addClass('profile-nav-name-selected').text(proposal.title);
    _card.append(Pard.Widgets.FitInBox(_title, 176, duration).render().css({'position': 'absolute'}));

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
      'background': color,
      'white-space': 'normal'
    });

    var _title = $('<p>').addClass('profile-nav-name-selected').text(performance.title);
    _card.append(Pard.Widgets.FitInBox(_title, 176, performance.height - 2).render().css({'position': 'absolute'}));

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
        Pard.Widgets.Program.forEach(function(performanceProgram){
          if(performanceProgram.performance_id == performance.performance_id){
            var end = new Date(performanceProgram['time'][0]);
            end.setMinutes(end.getMinutes() + ui.size.height * 1.5);
            performanceProgram['time'][1] = end.toISOString();
          }
        });
      }
    });

    Pard.Widgets.PopupCreator(_card, performance.title, function(){ return Pard.Widgets.ProgramHelperPopup(performance)});

    return {
      render: function(){
        return _card;
      }
    }
  }

  ns.Widgets.ProgramPermanentHelper = function(performance, space){
    var color = Pard.Widgets.CategoryColor(performance.category);
    var _card =$('<div>').addClass('programHelper').attr('id', performance.performance_id).css({
      'position': 'absolute',
      'top': performance.top,
      'left': performance.left,
      'display': 'inline-block',
      'width': '10.9rem',
      'height': '100px',
      'background': color,
      'white-space': 'normal'
    });

    var _title = $('<p>').addClass('profile-nav-name-selected').text(performance.title);
    _card.append(Pard.Widgets.FitInBox(_title, 176, performance.height).render());

    var top = 0;

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
        spacePerformances = []
        Pard.Widgets.Program.forEach(function(performanceProgram){
          if(performanceProgram['host_proposal_id'] == space && performanceProgram['permanent'] == true) spacePerformances.push(performanceProgram);
        });
        spacePerformances.forEach(function(spacePerformance, index){
          spacePerformance['card'].css({'top': index * performance.height + 41});
        });
      }
    });

    Pard.Widgets.PopupCreator(_card, performance.title, function(){ return Pard.Widgets.ProgramHelperPopup(performance)});

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

  ns.Widgets.ProgramHelperPopup = function(proposal){
    var _closepopup = {};
    var _createdWidget = $('<div>');
    var call = Pard.Widgets.CachedCall;
    var spaces = [];
    var program = Pard.Widgets.Program;
    var spaceColumns = Pard.Widgets.SpaceColumns;

    call['proposals'].forEach(function(proposal){
      if(proposal.type == 'space') spaces.push(proposal);
    });

    _getProposal = function(proposal_id){
      var result = {};
      call['proposals'].forEach(function(proposal){
        if(proposal.proposal_id == proposal_id) return (result = proposal); 
      });
      return result;
    };

    var eventTime = {
      '2016-10-15': [['2016-10-15T10:00:00.000Z', '2016-10-15T14:00:00.000Z'], ['2016-10-15T17:00:00.000Z', '2016-10-15T23:00:00.000Z']],
      '2016-10-16': [['2016-10-16T10:00:00.000Z', '2016-10-16T14:00:00.000Z'], ['2016-10-16T17:00:00.000Z', '2016-10-16T23:00:00.000Z']]
    };
    
    var myPerformances = [];
    program.forEach(function(performance){
      if(performance.participant_proposal_id == proposal.proposal_id) myPerformances.push(performance);
    });

    var _performaceInput = function(performance){
      var _performaceBox = $('<div>');
      
      var _daySelector = $('<select>');
      Object.keys(eventTime).forEach(function(day){
        var date = $('<option>').val(day).text(day); 
        _daySelector.append(date);
      });

      var _spaceSelector = $('<select>');
      spaces.forEach(function(space){
        var spaceOption = $('<option>').val(space.proposal_id).text(space.name); 
        _spaceSelector.append(spaceOption);
      });

      _daySelector.val(performance.date);
      _spaceSelector.val(performance.host_proposal_id);

      _daySelector.on('change', function(){
        performance.date = _daySelector.val();
        performance['card'].remove();
        spaceColumns[performance.date].forEach(function(spaceCol){
          if(spaceCol.attr('id') == performance.host_proposal_id){
            var timeCol = spaceCol.find('.spaceTime');
            var newPerformance = Pard.Widgets.ProgramHelper(proposal, performance.host_proposal_id).render();
            timeCol.append(newPerformance);
            performance['card'] = newPerformance;
          }
        });
      });
      
      _spaceSelector.on('change', function(){
        performance.host_proposal_id = _spaceSelector.val();
        performance['card'].remove();
        spaceColumns[performance.date].forEach(function(spaceCol){
          if(spaceCol.attr('id') == performance.host_proposal_id){
            var timeCol = spaceCol.find('.spaceTime');
            var spaceProposal = _getProposal(_spaceSelector.val());

            performance['host_id'] = spaceProposal.host_id;
            performance['host_name'] = spaceProposal.host_name;
            proposal['left'] = spaceColumns[performance.date].indexOf(spaceCol) * 176 + 1;
            
            var newPerformance = Pard.Widgets.ProgramHelper(proposal, performance.host_proposal_id).render();
            timeCol.append(newPerformance);

            performance['card'] = newPerformance;
          }
        });
      });

      var dayStart = new Date(eventTime[performance.date][0][0]);
      var lastIndex = eventTime[performance.date].length - 1;
      var dayEnd = new Date(eventTime[performance.date][lastIndex][1]);

      var _startTime = $('<select>');
      var _endTime = $('<select>');

      var _setStartTimes = function(){
        _startTime.empty();
        var start = new Date(performance['time'][0]);
        var end = new Date(performance['time'][1]);

        dayStart = new Date(eventTime[performance.date][0][0]);
        var maxStart = new Date(dayEnd.getTime() - end.getTime() + start.getTime());

        while(dayStart <= maxStart){
          var timeVal = dayStart.toISOString();
          var timeArray = timeVal.split('T')[1].split(':');
          var startOption = $('<option>').val(timeVal).text(timeArray[0] + ':' + timeArray[1]);
          _startTime.append(startOption);

          dayStart.setMinutes(dayStart.getMinutes() + 15);
        };

        _startTime.val(performance['time'][0]);
      };

      var _setEndTimes = function(){
        _endTime.empty();
        var start = new Date(performance['time'][0]);
        var minEnd = new Date(start.getTime() + 15 * 60000);
        
        while(minEnd <= dayEnd){
          var timeVal = minEnd.toISOString();
          var timeArray = timeVal.split('T')[1].split(':');
          var endOption = $('<option>').val(timeVal).text(timeArray[0] + ':' + timeArray[1]);
          _endTime.append(endOption);

          minEnd.setMinutes(minEnd.getMinutes() + 15);
        };
        _endTime.val(performance['time'][1]);
      };

      _setStartTimes();
      _setEndTimes();

      _startTime.on('change', function(){
        var oldStart = new Date(performance['time'][0]).getTime();
        var newStart = new Date(_startTime.val()).getTime();
        performance['card'].css({'top': '+=' + (newStart - oldStart) / 90000});
        performance['time'][0] = _startTime.val();
        performance['time'][1] = new Date((new Date(performance['time'][1]).getTime() + (newStart - oldStart))).toISOString();
        _endTime.val(performance['time'][1]);
        _setEndTimes();
      });

      _endTime.on('change', function(){
        var oldEnd = new Date(performance['time'][1]).getTime() / 60000;
        var newEnd = new Date(_endTime.val()).getTime() / 60000;
        performance['card'].css({'height': '+=' + (newEnd - oldEnd) / 1.5});
        performance['time'][1] = _endTime.val();
        _setStartTimes();
      });

      var _removeInputButton = $('<span>').addClass('material-icons add-multimedia-input-button-delete').html('&#xE888');

      _removeInputButton.on('click', function(){
        program.splice(Pard.Widgets.Program.indexOf(performance), 1);
        performance['card'].remove();
        _performaceBox.remove();
      });

      _daySelector.css({'display': ' inline-block', 'width': '120'});
      _spaceSelector.css({'display': ' inline-block', 'width': '250'});
      _startTime.css({'display': ' inline-block', 'width': '80'});
      _endTime.css({'display': ' inline-block', 'width': '80'});

      _performaceBox.append(_daySelector, _spaceSelector, _startTime, _endTime, _removeInputButton);
      _createdWidget.append(_performaceBox);
    };

    var _performacePermanentInput = function(performance){
      console.log(performance);
      var _daySelectors = [];
      var _setDates = function(date){
        _daySelectors.forEach(function(daySelector){
          var _date = $('<option>').val(date).text(date); 
          daySelector.append(_date);
          daySelector.attr('disabled', false);
        });
      };

      performance.date.forEach(function(date, index){

        var _performaceBox = $('<div>');
        var _daySelector = $('<select>');
        _daySelectors.push(_daySelector);

        Object.keys(eventTime).forEach(function(day){
          console.log(performance.date.indexOf(day));
          if(day == date || performance.date.indexOf(day) < 0){
            var _date = $('<option>').val(day).text(day); 
            _daySelector.append(_date);
          }
        });
        if(_daySelector.children().length <= 1) _daySelector.attr('disabled', true);

        var _spaceSelector = $('<select>');
        spaces.forEach(function(space){
          var spaceOption = $('<option>').val(space.proposal_id).text(space.name); 
          _spaceSelector.append(spaceOption);
        });

        _daySelector.val(date);
        _spaceSelector.val(performance.host_proposal_id[index]);

        _daySelector.on('change', function(){
          performance.date[index] = _daySelector.val();
          _setDates(date);
        });

        _spaceSelector.on('change', function(){
          var the_index = performance.date.indexOf(date);
          var spaceProposal = _getProposal(_spaceSelector.val());

          if($.inArray(_spaceSelector.val(), performance.host_proposal_id) < 0){
            spaceColumns['permanent'].forEach(function(spaceCol){
              if(spaceCol.attr('id') == _spaceSelector.val()){
                var timeCol = spaceCol.find('.spaceTime');
                proposal['left'] = spaceColumns['permanent'].indexOf(spaceCol) * 176 + 1;
                
                var newPerformance = Pard.Widgets.ProgramHelper(proposal, performance.host_proposal_id).render();
                timeCol.append(newPerformance);
                performance.card[the_index] = newPerformance;
              }
            });
          }
          var host_proposal_id = performance.host_proposal_id[the_index]; 
          performance.host_proposal_id[the_index] = _spaceSelector.val();
          performance.host_id[the_index] = spaceProposal.host_id;
          performance.host_name[the_index] = spaceProposal.host_name;
          if($.inArray(host_proposal_id, performance.host_proposal_id) < 0) performance.card[the_index].remove();
        });
        
        // var dayStart = new Date(eventTime[performance.date][0][0]);
        // var lastIndex = eventTime[performance.date].length - 1;
        // var dayEnd = new Date(eventTime[performance.date][lastIndex][1]);

        // var _startTime = $('<select>');
        // var _endTime = $('<select>');

        // var _setStartTimes = function(){
        //   _startTime.empty();
        //   var start = new Date(performance['time'][0]);
        //   var end = new Date(performance['time'][1]);

        //   dayStart = new Date(eventTime[performance.date][0][0]);
        //   var maxStart = new Date(dayEnd.getTime() - end.getTime() + start.getTime());

        //   while(dayStart <= maxStart){
        //     var timeVal = dayStart.toISOString();
        //     var timeArray = timeVal.split('T')[1].split(':');
        //     var startOption = $('<option>').val(timeVal).text(timeArray[0] + ':' + timeArray[1]);
        //     _startTime.append(startOption);

        //     dayStart.setMinutes(dayStart.getMinutes() + 15);
        //   };

        //   _startTime.val(performance['time'][0]);
        // };

        // var _setEndTimes = function(){
        //   _endTime.empty();
        //   var start = new Date(performance['time'][0]);
        //   var minEnd = new Date(start.getTime() + 15 * 60000);
          
        //   while(minEnd <= dayEnd){
        //     var timeVal = minEnd.toISOString();
        //     var timeArray = timeVal.split('T')[1].split(':');
        //     var endOption = $('<option>').val(timeVal).text(timeArray[0] + ':' + timeArray[1]);
        //     _endTime.append(endOption);

        //     minEnd.setMinutes(minEnd.getMinutes() + 15);
        //   };
        //   _endTime.val(performance['time'][1]);
        // };

        // _setStartTimes();
        // _setEndTimes();

        // _startTime.on('change', function(){
        //   var oldStart = new Date(performance['time'][0]).getTime();
        //   var newStart = new Date(_startTime.val()).getTime();
        //   performance['card'].css({'top': '+=' + (newStart - oldStart) / 90000});
        //   performance['time'][0] = _startTime.val();
        //   performance['time'][1] = new Date((new Date(performance['time'][1]).getTime() + (newStart - oldStart))).toISOString();
        //   _endTime.val(performance['time'][1]);
        //   _setEndTimes();
        // });

        // _endTime.on('change', function(){
        //   var oldEnd = new Date(performance['time'][1]).getTime() / 60000;
        //   var newEnd = new Date(_endTime.val()).getTime() / 60000;
        //   performance['card'].css({'height': '+=' + (newEnd - oldEnd) / 1.5});
        //   performance['time'][1] = _endTime.val();
        //   _setStartTimes();
        // });

        var _removeInputButton = $('<span>').addClass('material-icons add-multimedia-input-button-delete').html('&#xE888');
        _removeInputButton.on('click', function(){
          //program.splice(Pard.Widgets.Program.indexOf(performance), 1);
          //performance['card'].remove();
          _performaceBox.remove();
          var the_index = performance.date.indexOf(date);
          var host_proposal_id = performance.host_proposal_id[the_index];
          performance.host_proposal_id.splice(the_index, 1);

          if($.inArray(host_proposal_id, performance.host_proposal_id)) performance.card[the_index].remove();

          performance.host_id.splice(the_index, 1);
          performance.host_name.splice(the_index, 1);
          performance.time.splice(the_index, 1);
          performance.card.splice(the_index, 1);
          performance.date.splice(the_index, 1);

          _daySelectors.splice(_daySelectors.indexOf(_daySelector), 1);
          _setDates(date);
        });

        _daySelector.css({'display': ' inline-block', 'width': '120'});
        _spaceSelector.css({'display': ' inline-block', 'width': '250'});
        // _startTime.css({'display': ' inline-block', 'width': '80'});
        // _endTime.css({'display': ' inline-block', 'width': '80'});

        //_performaceBox.append(_daySelector, _spaceSelector, _startTime, _endTime, _removeInputButton);
        _performaceBox.append(_daySelector, _spaceSelector, _removeInputButton);
        _createdWidget.append(_performaceBox);
      });
    };

    myPerformances.forEach(function(performance){
      if (performance.permanent == false) _performaceInput(performance);
      if (performance.permanent == true) _performacePermanentInput(performance);
    });



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
