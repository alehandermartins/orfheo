'use strict';

(function(ns){

	ns.Program = function(the_event){
		var eventTime = the_event.eventTime;

		var _startHour = parseInt(the_event.eventTime['permanent'][0].split(':')[0]);
    var _startMin = parseInt(the_event.eventTime['permanent'][0].split(':')[1]);
    var _endHour = parseInt(the_event.eventTime['permanent'][1].split(':')[0]);
    var _endMin = parseInt(the_event.eventTime['permanent'][1].split(':')[1]);

    Pard.Bus.on('AddPerformance', function(performance){
      create(performance);
    });

    Pard.Bus.on('ModifyPerformance', function(performance){
      modify(performance);
    });

    var save = function(performance){
      var show = the_event.program[performance.performance_id].show;
      the_event.spaces[show.host_id].addPerformance(the_event.program[performance.performance_id]);
      the_event.artists[show.participant_id].addPerformance(the_event.program[performance.performance_id]);
    }
    
    var create = function(performance){
      performance.performance_id = Pard.Widgets.GenerateUUID();
      if(performance.permanent == 'true') the_event.program[performance.performance_id] = new PermanentPerformance(performance);
      else{the_event.program[performance.performance_id] = new Performance(performance);}
      save(performance);
    }

    var modify = function(performance){
      the_event.spaces[performance.last_host].deletePerformance(performance);
      the_event.program[performance.performance_id].modify(performance);
      save(performance);
    }

    var destroy = function(performance){
      if(the_event.program[performance.performance_id]){
        the_event.spaces[performance.host_id].deletePerformance(performance);
        the_event.artists[performance.participant_id].deletePerformance(performance);
        the_event.program[performance.performance_id].destroy();
        delete the_event.program[performance.performance_id];
      }
    }

		var Performance = function(performance){

      var card =$('<div>').addClass('programHelper');
      var _title = $('<p>').addClass('proposal-title-card-call-manager');
      var _confirmationCheckContainer = $('<span>').addClass('checker');
      var _titleText = $('<a>').attr('href','#');
      var _commentIconContainer = $('<span>').addClass('commentIcon');
      var _titleTextLong, _confirmationCheck, _commentIcon;

      _confirmationCheckContainer.append(_confirmationCheck);
      _commentIconContainer.append(_commentIcon);
      _title.append(_confirmationCheckContainer, _commentIconContainer, _titleText);
      
      _titleText.on('click', function(){
        var _content = $('<div>').addClass('very-fast reveal full');
        _content.empty();
        $('body').append(_content);

        var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
        var _message = Pard.Widgets.PopupContent(performance.title +' (' + performance.participant_name + ')', manager());
        _message.setCallback(function(){
          _content.remove();
          _popup.close();
        });
        _content.append(_message.render());
        _popup.open();
      });

      card.append(_title.css({'position': 'absolute'}));
      card.addClass('dragged-card-call-manager cursor_grab');
      card.mousedown(function(){
      });
      card.mouseup(function(){
        card.removeClass('cursor_move').addClass('cursor_grab');
      });

      card.draggable({
        revert: false,
        helper: 'clone',
        grid: [ 10, 10 ],
        start: function(event, ui){
          card.removeClass('cursor_grab').addClass('cursor_move');
          card.css({'opacity': '0.4'});
          ui.helper.data('dropped', false);
          Pard.Bus.trigger('drag', performance);
        },
        stop:function(event, ui){
          card.removeClass('cursor_move').addClass('cursor_grab');
          card.css({'opacity': '1'});
          if(ui.helper.data('dropped') == false) destroy(performance);
        }
      });

      var fillCard = function(performance){

        var color = Pard.Widgets.CategoryColor(performance.participant_category);

        if(performance.position){
          var start = new Date(parseInt(eventTime[performance.date][0]));
          start.setMinutes(start.getMinutes() + (performance.position - 41) * 1.5);
          var end = new Date(start.getTime());
          end.setMinutes(start.getMinutes() + performance.duration * 1.5);
          performance.time = [start.getTime(), end.getTime()];
        }
        else{
          var dayStart = parseInt(eventTime[performance.date][0]);
          performance.time[0] = parseInt(performance.time[0]);
          performance.time[1] = parseInt(performance.time[1]);
          //10 pixels = 15 min
          var start = (performance.time[0] - dayStart) / 90000;
          var end = (performance.time[1] - dayStart) / 90000;
          performance.position = start + 41;
          performance.duration = (end - start);
        }

        card.css({
          'position': 'absolute',
          'display': 'inline-block',
          'width': Pard.ColumnWidth - 2,
          'top': performance.position,
          'height': performance.duration,
          'background': color,
          'white-space': 'normal',
          'box-shadow': 'inset 0 0 1px '
        });

        _titleTextLong = performance.participant_name + ' - ' + performance.title;
        _titleText.text(Pard.Widgets.CutString(_titleTextLong, 35));
        _confirmationCheck = '';
        if (performance.confirmed == 'true' || performance.confirmed == true) _confirmationCheck = Pard.Widgets.IconManager('done').render();
        if (performance.comments) _commentIconContainer.append(Pard.Widgets.IconManager('comments').render());

        card.resizable({
          resize: function(event, ui) {
            ui.size.width = ui.originalSize.width;
          },
          maxHeight: performance.maxHeight,
          grid: 10,
          stop: function(event, ui){
            var duration = new Date(performance.time[0]);
            duration.setMinutes(duration.getMinutes() + ui.size.height * 1.5);
            performance.time[1] = duration.getTime();
          }
        });

        delete performance.position;
        delete performance.duration;
        delete performance.maxHeight;
      }

      var manager = function(){
        var performanceBox = $('<div>');
        var performanceContainer = $('<div>').css('height', 40);
        var daySelector = $('<select>');
        var spaceSelector = $('<select>');
        var startTime = $('<select>');
        var endTime = $('<select>');
        var removeInputButton = $('<span>').addClass('material-icons add-multimedia-input-button-delete').html('&#xE888');
        var commentsContainer = $('<div>');
        var comments = $('<textarea>').attr({placeholder: 'Comentarios:'});

        var confirmedContainer = $('<div>').css('height', 20);
        var input = $('<input />').attr({type: 'checkbox'});
        var label = $('<label>').html('Confirmado');
        var confirmed = $('<div>').append(input, label);

        daySelector.css({'display': ' inline-block', 'width': '120'});
        spaceSelector.css({'display': ' inline-block', 'width': '250'});
        startTime.css({'display': ' inline-block', 'width': '80'});
        endTime.css({'display': ' inline-block', 'width': '80'});
        confirmed.css('margin-left', 430);
        label.css('display','inline');
        comments.css('width', 530);

        confirmedContainer.append(confirmed);
        commentsContainer.append(comments);
        performanceContainer.append(daySelector, spaceSelector, startTime, endTime, removeInputButton);
        performanceBox.append(confirmedContainer, performanceContainer, commentsContainer);

        Object.keys(eventTime).forEach(function(day){
          if(day == 'permanent') return false;
          var date = $('<option>').val(day).text(day);
          daySelector.append(date);
        });

        Object.keys(the_event.spaces).forEach(function(profile_id){
          var space = the_event.spaces[profile_id].space;
          var spaceOption = $('<option>').val(profile_id).text(space.name);
          spaceSelector.append(spaceOption);
        });

        daySelector.on('change', function(){
          performance.date = daySelector.val();
          var dateArray = daySelector.val().split('-');
          var start = new Date(performance.time[0]);
          var end = new Date(performance.time[1]);

          start.setUTCFullYear(parseInt(dateArray[0]));
          end.setUTCFullYear(parseInt(dateArray[0]));

          start.setUTCMonth(parseInt(dateArray[1] - 1));
          end.setUTCMonth(parseInt(dateArray[1] - 1));

          start.setUTCDate(parseInt(dateArray[2]));
          end.setUTCDate(parseInt(dateArray[2]));

          performance.time[0] = start.getTime();
          performance.time[1] = end.getTime();

          save(performance);
          setStartTimes();
          setEndTimes();
        });

        spaceSelector.on('change', function(){
          performance.host_id = spaceSelector.val();
          save(performance);
        });

        var setStartTimes = function(){
          startTime.empty();

          var dayStart = new Date(parseInt(eventTime[performance.date][0]));
          var dayEnd = new Date(parseInt(eventTime[performance.date][1]));

          var start = new Date(performance.time[0]);
          var end = new Date(performance.time[1]);
          //Te max value for start is that that puts the end on the limit of the day
          var maxStart = new Date(dayEnd.getTime() - end.getTime() + start.getTime());
          while(dayStart <= maxStart){
            var hours = dayStart.getHours();
            var minutes = dayStart.getMinutes();
            if(hours < 10) hours = '0' + hours;
            if(minutes < 10) minutes = '0' + minutes;
            var startOption = $('<option>').val(dayStart.getTime()).text(hours + ':' + minutes);
            startTime.append(startOption);
            dayStart.setMinutes(dayStart.getMinutes() + 15);
          };
          startTime.val(performance.time[0]);
        };

        var setEndTimes = function(){
          endTime.empty();

          var dayEnd = new Date(parseInt(eventTime[performance.date][1]));
          var start = new Date(performance['time'][0]);
          //The minimum end is the start plus 15 minutes
          var minEnd = new Date(start.getTime() + 15 * 60000);

          while(minEnd <= dayEnd){
            var hours = minEnd.getHours();
            var minutes = minEnd.getMinutes();4
            if(hours < 10) hours = '0' + hours;
            if(minutes < 10) minutes = '0' + minutes;
            var endOption = $('<option>').val(minEnd.getTime()).text(hours + ':' + minutes);
            endTime.append(endOption);

            minEnd.setMinutes(minEnd.getMinutes() + 15);
          };
          endTime.val(performance['time'][1]);
        };

        startTime.on('change', function(){
          var oldStart = performance['time'][0];
          var newStart = parseInt(startTime.val());
          card.css({'top': '+=' + (newStart - oldStart) / 90000});
          performance['time'][0] = newStart;
          performance['time'][1] = performance['time'][1] + (newStart - oldStart);
          setEndTimes();
          save(performance);
        });

        endTime.on('change', function(){
          var oldEnd = performance['time'][1];
          var newEnd = parseInt(endTime.val());
          card.css({'height': '+=' + (newEnd - oldEnd) / 90000});
          performance['time'][1] = newEnd;
          setStartTimes();
          save(performance);
        });

        removeInputButton.on('click', function(){
          destroy(performance);
          _closePopup();
        });

        input.on('change', function(){
          performance.confirmed = input.is(":checked");
          if (performance.confirmed) card.find('.checker').append(Pard.Widgets.IconManager('done').render());
          else card.find('.checker').empty();
        });

        comments.on('input', function(){
          performance.comments = comments.val();
          card.find('.commentIcon').empty();
          if (performance.comments) card.find('.commentIcon').append(Pard.Widgets.IconManager('comments').render());
        });

        daySelector.val(performance.date);
        spaceSelector.val(performance.host_id);
        setStartTimes();
        setEndTimes();
        comments.val(performance.comments);
        input.prop('checked', performance.confirmed);

        return {
          render: function(){
            return performanceBox;
          },
          setCallback: function(callback){
            _closePopup = function(){
              performanceBox.remove();
              callback();
            }
          }
        }
      }
        
      var _destroy = function(){
        card.remove();
      }

      var _modify = function(show){
        for(var key in show){
          performance[key] = show[key];  
        }
      	fillCard(performance);
      }

      fillCard(performance);

      return {
        show: performance,
        card: card,
        manager: manager,
        modify: _modify,
        destroy: _destroy
      }
    }

    var PermanentPerformance = function(performance){

      var card = $('<div>').addClass('programHelper');
      var _title = $('<p>').addClass('proposal-title-card-call-manager');
      var _confirmationCheckContainer = $('<span>').addClass('checker');
      var _titleText = $('<a>').attr('href','#');
      var _commentIconContainer = $('<span>').addClass('commentIcon');
      var _titleTextLong, _confirmationCheck, _commentIcon;

      _confirmationCheckContainer.append(_confirmationCheck);
      _commentIconContainer.append(_commentIcon);
      _title.append(_confirmationCheckContainer, _commentIconContainer, _titleText);

      _titleText.on('click', function(){
        var _content = $('<div>').addClass('very-fast reveal full');
        _content.empty();
        $('body').append(_content);

        var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
        var _message = Pard.Widgets.PopupContent(performance.title +' (' + performance.participant_name + ')', PermanentManager());
        _message.setCallback(function(){
          _content.remove();
          _popup.close();
        });
        _content.append(_message.render());
        _popup.open();
      });

      card.append(_title.css({'position': 'absolute'}));
      card.addClass('dragged-card-call-manager cursor_grab');
      card.mousedown(function(){
        card.removeClass('cursor_grab').addClass('cursor_move');
      });
      card.mouseup(function(){
        card.removeClass('cursor_move').addClass('cursor_grab');
      });

      card.draggable({
        revert: false,
        helper: 'clone',
        grid: [ 10, 10 ],
        start: function(event, ui){
          card.removeClass('cursor_grab').addClass('cursor_move');
          card.css({'opacity': '0.4'});
          ui.helper.data('dropped', false);
          Pard.Bus.trigger('drag', performance);
        },
        stop:function(event, ui){
          card.removeClass('cursor_move').addClass('cursor_grab');
          card.css({'opacity': '1'});
          if(ui.helper.data('dropped') == false) destroy(performance);
        }
      });

      card.draggable({
        revert: false,
        helper: 'clone',
        grid: [ 10, 10 ],
        start: function(event, ui){
          card.removeClass('cursor_grab').addClass('cursor_move');
          card.css({'opacity': '0.4'});
          ui.helper.data('dropped', false);
          performance.modifiables = [];
          artistShows().forEach(function(show){
            performance.modifiables.push(show.performance_id);
          });
          Pard.Bus.trigger('drag', performance);
        },
        stop:function(event, ui){
          card.removeClass('cursor_move').addClass('cursor_grab');
          card.css({'opacity': '1'});
          Pard.Bus.trigger('stop');
          if(ui.helper.data('dropped') == false){
            artistShows().forEach(function(show){
              destroy(show);
            }); 
          }
        }
      });

      var artistShows = function(){
        var artistProgram = the_event.artists[performance.participant_id].program;
        var shows = Object.keys(artistProgram).map(function(performance_id){
          return artistProgram[performance_id].show;
        });
        if(!the_event.program[performance.performance_id]) performance.host_id = shows[0].host_id;
        shows = shows.filter(function(show){
          return (show.permanent == 'true' && show.participant_proposal_id == performance.participant_proposal_id && show.host_id == performance.host_id);
        });
        return shows;
      }

      var date = performance.date;
      var start = new Date(date.split('-')[0], date.split('-')[1] -1, date.split('-')[2], _startHour, _startMin);
      var end = new Date(date.split('-')[0], date.split('-')[1] -1, date.split('-')[2], _endHour, _endMin);
      performance.time = [start.getTime(), end.getTime()];

      var fillCard = function(performance){

        performance.time[0] = parseInt(performance.time[0]);
        performance.time[1] = parseInt(performance.time[1]);

        var color = Pard.Widgets.CategoryColor(performance.participant_category);
        card.css({
          'position': 'absolute',
          'display': 'inline-block',
          'width': Pard.ColumnWidth - 2,
          'height': Pard.PermanentCardHeight,
          'background': color,
          'white-space': 'normal',
          'box-shadow': 'inset 0 0 1px '
        });
        
        _titleTextLong = performance.participant_name + ' - ' + performance.title;
        _titleText.text(Pard.Widgets.CutString(_titleTextLong, 35));
        if (performance.confirmed == 'true' || performance.confirmed == true) _confirmationCheck = Pard.Widgets.IconManager('done').render();
        if (performance.comments) _commentIconContainer.append(Pard.Widgets.IconManager('comments').render());
      }
      
      var PermanentManager = function(saveMethod){

        var performancesBox = $('<div>').css('padding', 0);
        var artistProgram = the_event.artists[performance.participant_id].program;
        var shows = Object.keys(artistProgram).map(function(performance_id){
          return artistProgram[performance_id].show;
        });
        shows = shows.filter(function(show){
          return (show.permanent == 'true' && show.participant_proposal_id == performance.participant_proposal_id);
        });
        shows.forEach(function(show){
          performancesBox.append(the_event.program[show.performance_id].manager().render());
        });

        return {
          render: function(){
            return performancesBox;
          },
          setCallback: function(callback){
            _closePopup = function(){
              performancesBox.remove();
              callback();
            }
          }
        }
      }

      var daySelector = $('<select>');
      daySelector.css({'display': ' inline-block', 'width': '120'});

      var shows;
      var _loadDates = function(){
        daySelector.empty();
        daySelector.attr('disabled', false);
        var artistProgram = the_event.artists[performance.participant_id].program;
        shows = Object.keys(artistProgram).map(function(performance_id){
          return artistProgram[performance_id].show;
        });
        shows = shows.filter(function(show){
          return (show.permanent == 'true' && show.participant_proposal_id == performance.participant_proposal_id);
        });
        var dates = shows.map(function(show){
          return show.date;
        });
        Object.keys(eventTime).forEach(function(day){
          if(day == 'permanent') return false;
          if($.inArray(day, dates) < 0 || day == performance.date){
            var date = $('<option>').val(day).text(day);
            daySelector.append(date);
          }
        });
        daySelector.val(performance.date);
        if(daySelector.children().length <= 1) daySelector.attr('disabled', true);
      }

      var manager = function(){
        var performanceBox = $('<div>');
        var performanceContainer = $('<div>').css('height', 40);
        var spaceSelector = $('<select>');
        var startTime = $('<select>');
        var endTime = $('<select>');
        var removeInputButton = $('<span>').addClass('material-icons add-multimedia-input-button-delete').html('&#xE888');
        var commentsContainer = $('<div>');
        var comments = $('<textarea>').attr({placeholder: 'Comentarios:'});

        var confirmedContainer = $('<div>').css('height', 20);
        var input = $('<input />').attr({type: 'checkbox'});
        var label = $('<label>').html('Confirmado');
        var confirmed = $('<div>').append(input, label);

        spaceSelector.css({'display': ' inline-block', 'width': '250'});
        startTime.css({'display': ' inline-block', 'width': '80'});
        endTime.css({'display': ' inline-block', 'width': '80'});
        confirmed.css('margin-left', 430);
        label.css('display','inline');
        comments.css('width', 530);

        confirmedContainer.append(confirmed);
        commentsContainer.append(comments);
        performanceContainer.append(daySelector, spaceSelector, startTime, endTime, removeInputButton);
        performanceBox.append(confirmedContainer, performanceContainer, commentsContainer);

        _loadDates();

        Object.keys(the_event.spaces).forEach(function(profile_id){
        	var space = the_event.spaces[profile_id].space;
          var spaceOption = $('<option>').val(profile_id).text(space.name);
          spaceSelector.append(spaceOption);
        });

        daySelector.on('change', function(){
          performance.date = daySelector.val();
          var dateArray = daySelector.val().split('-');
          var start = new Date(performance.time[0]);
          var end = new Date(performance.time[1]);

          start.setUTCFullYear(parseInt(dateArray[0]));
          end.setUTCFullYear(parseInt(dateArray[0]));

          start.setUTCMonth(parseInt(dateArray[1] - 1));
          end.setUTCMonth(parseInt(dateArray[1] - 1));

          start.setUTCDate(parseInt(dateArray[2]));
          end.setUTCDate(parseInt(dateArray[2]));

          performance.time[0] = start.getTime();
          performance.time[1] = end.getTime();

          save(performance);
          setStartTimes();
          setEndTimes();
          shows.forEach(function(show){
            the_event.program[show.performance_id].loadDates();
          });
        });

        spaceSelector.on('change', function(){
          the_event.spaces[performance.host_id].deletePerformance(performance);
          performance.host_id = spaceSelector.val();
          the_event.spaces[performance.host_id].addPerformance(performance, card);
          if(saveMethod == 'load') the_event.artists[performance.participant_id].loadPerformance(performance);
          else{ the_event.artists[performance.participant_id].addPerformance(performance);}
        });

        var setStartTimes = function(){
          startTime.empty();
          var dayStart = new Date(parseInt(eventTime[performance.date][0]));
          var maxStart = new Date(parseInt(performance.time[1]));
          maxStart.setMinutes(maxStart.getMinutes() - 15);

          while(dayStart <= maxStart){
            var hours = dayStart.getHours();
            var minutes = dayStart.getMinutes();
            if(hours < 10) hours = '0' + hours;
            if(minutes < 10) minutes = '0' + minutes;
            var startOption = $('<option>').val(dayStart.getTime()).text(hours + ':' + minutes);
            startTime.append(startOption);
            dayStart.setMinutes(dayStart.getMinutes() + 15);
          };
          startTime.val(performance.time[0]);
        }

        var setEndTimes = function(){
          endTime.empty();
          var dayEnd = new Date(parseInt(eventTime[performance.date][1]));
          var minEnd = new Date(parseInt(performance.time[0]) + 15 * 60000);

          while(minEnd <= dayEnd){
            var hours = minEnd.getHours();
            var minutes = minEnd.getMinutes();
            if(hours < 10) hours = '0' + hours;
            if(minutes < 10) minutes = '0' + minutes;
            var endOption = $('<option>').val(minEnd.getTime()).text(hours + ':' + minutes);
            endTime.append(endOption);

            minEnd.setMinutes(minEnd.getMinutes() + 15);
          };
          endTime.val(performance.time[1]);
        }


        startTime.on('change', function(){
          performance.time[0] = parseInt(startTime.val());
          setEndTimes();
          the_event.spaces[performance.host_id].addPerformance(performance, card);
          if(saveMethod == 'load') the_event.artists[performance.participant_id].loadPerformance(performance);
          else{ the_event.artists[performance.participant_id].addPerformance(performance);}
        });

        endTime.on('change', function(){
          performance.time[1] = parseInt(endTime.val());
          setStartTimes();
          the_event.spaces[performance.host_id].addPerformance(performance, card);
          if(saveMethod == 'load') the_event.artists[performance.participant_id].loadPerformance(performance);
          else{ the_event.artists[performance.participant_id].addPerformance(performance);}
        });

        removeInputButton.on('click', function(){
          performanceBox.remove();
          shows.splice(shows.indexOf(performance), 1);
          destroy(performance);
          shows.forEach(function(show){
            the_event.program[show.performance_id].loadDates();
          });
        });

        input.on('change', function(){
          performance.confirmed = input.is(":checked");
          if (performance.confirmed) card.find('.checker').append(Pard.Widgets.IconManager('done').render());
          else card.find('.checker').empty();
          the_event.spaces[performance.host_id].addPerformance(performance, card);
          if(saveMethod == 'load') the_event.artists[performance.participant_id].loadPerformance(performance);
          else{ the_event.artists[performance.participant_id].addPerformance(performance);}
        });

        comments.on('input', function(){
          performance.comments = comments.val();
          card.find('.commentIcon').empty();
          if (performance.comments) card.find('.commentIcon').append(Pard.Widgets.IconManager('comments').render());
          the_event.spaces[performance.host_id].addPerformance(performance, card);
          if(saveMethod == 'load') the_event.artists[performance.participant_id].loadPerformance(performance);
          else{ the_event.artists[performance.participant_id].addPerformance(performance);}
        });

        daySelector.val(performance.date);
        spaceSelector.val(performance.host_id);
        setStartTimes();
        setEndTimes();
        comments.val(performance.comments);
        input.prop('checked', performance.confirmed);

        return {
          render: function(){
            return performanceBox;
          },
          setCallback: function(callback){
            _closePopup = function(){
              performanceBox.remove();
              callback();
            }
          }
        }
      }

      var _destroy = function(){
        if(artistShows().length == 0) card.remove();
      }

      var _modify = function(show){
        for(var key in show){
          performance[key] = show[key];  
        }
        fillCard(performance);
      }

      var hostPerformances = Object.keys(the_event.spaces[performance.host_id].program).map(function(performance_id){
        return the_event.spaces[performance.host_id].program[performance_id];
      });

      hostPerformances = hostPerformances.filter(function(hostPerformance){
        return (hostPerformance.show.permanent == 'true' && hostPerformance.show.participant_proposal_id == performance.participant_proposal_id);
      });

      if(hostPerformances.length != 0) card = hostPerformances[0].card;
      
      else fillCard(performance);

      return {
        show: performance,
        card: card,
        manager: manager,
        loadDates: _loadDates,
        modify: _modify,
        destroy: _destroy
      }
    }
	}
}(Pard || {}));