'use strict';

(function(ns){

	ns.Program = function(the_event){
		var eventTime = the_event.eventTime;

		var _startHour = parseInt(the_event.eventTime['permanent'][0].split(':')[0]);
    var _startMin = parseInt(the_event.eventTime['permanent'][0].split(':')[1]);
    var _endHour = parseInt(the_event.eventTime['permanent'][1].split(':')[0]);
    var _endMin = parseInt(the_event.eventTime['permanent'][1].split(':')[1]);

    Pard.Bus.on('AddPerformance', function(performance){
      if(performance.permanent == 'false') return create(performance);
      createPermanents(performance);
    });

    var save = function(performance){
      the_event.spaces[performance.host_id].addPerformance(the_event.program[performance.performance_id]);
      the_event.artists[performance.participant_id].addPerformance(the_event.program[performance.performance_id]);
    }
    
    var create = function(performance){
      performance.performance_id = Pard.Widgets.GenerateUUID();
      if(performance.permanent == 'true') the_event.program[performance.performance_id] = new PermanentPerformance(performance);
      else{the_event.program[performance.performance_id] = new Performance(performance);}
      save(performance);
    }

    var createPermanents = function(performance){
      var myPerformances = Object.keys(the_event.spaces[performance.host_id].program).map(function(performance_id){
        return the_event.spaces[performance.host_id].program[performance_id];
      });
      myPerformances = myPerformances.filter(function(_performance){
        return (_performance.permanent == 'true' && _performance.participant_proposal_id == performance.participant_proposal_id && _performance.host_id == performance.host_id);
      });
      Object.keys(eventTime).forEach(function(date){
        if(date == 'permanent') return false;
        if(myPerformances.every(function(show){
          return show.date != date;
        })){
          var start = new Date(date.split('-')[0],date.split('-')[1] -1,date.split('-')[2],_startHour, _startMin);
          var end = new Date(date.split('-')[0],date.split('-')[1] -1,date.split('-')[2], _endHour, _endMin);
          performance.date = date;
          performance.time = [start.getTime(), end.getTime()];
          var _performance = {};
          Object.keys(performance).forEach(function(key){
            _performance[key] = performance[key];
          });
          create(_performance);
        }
      });
    }

    Pard.Bus.on('ModifyPerformance', function(performance){
      if(performance.permanent == 'false') return modify(performance);
      modifyPermanents(performance);
    });

    var modify = function(performance){
      the_event.program[performance.performance_id].modify(performance);
      save(performance);
    }

    var modifyPermanents = function(performance){
      var artistProgram = artists[performance.participant_id].program;
      var performances = Object.keys(artistProgram).map(function(performance_id){
        return artistProgram[performance_id];
      });
      performances = performances.filter(function(_performance){
        return (_performance.permanent == 'true' && _performance.participant_proposal_id == performance.participant_proposal_id && _performance.host_id == performance.host_id);
      });
      performances.forEach(function(_performance){
        modify(_performance);
      });
    }

    Pard.Bus.on('deletePerformance', function(performance){
      destroy(performance);
    });

    var destroy = function(performance){
      if(the_event.program[performance.performance_id]){
        the_event.spaces[performance.host_id].deletePerformance(performance);
        the_event.artists[performance.participant_id].deletePerformance(performance);
        the_event.program[performance.performance_id].destroy();
        delete the_event.program[performance.performance_id];
      }
    }

    var destroyPermanents = function(performance){
      var artistProgram = the_event.artists[performance.participant_id].program;
      var performances = Object.keys(artistProgram).map(function(performance_id){
        return artistProgram[performance_id];
      });
      performances = performances.filter(function(show){
        return (show.permanent == 'true' && show.participant_proposal_id == performance.participant_proposal_id && show.host_id == performance.host_id);
      });
      performances.forEach(function(show){
        destroy(show);
      }); 
    }
    
		var Performance = function(performance){

      var card =$('<div>').addClass('programHelper');
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

        var _title = $('<p>').addClass('proposal-title-card-call-manager');
        var _titleTextLong = performance.participant_name + ' - ' + performance.title;
        var _titleText = $('<a>').attr('href','#').text(Pard.Widgets.CutString(_titleTextLong, 35));
        var _confirmationCheck = '';
        var _confirmationCheckContainer = $('<span>').addClass('checker');
        if (performance.confirmed == 'true' || performance.confirmed == true) _confirmationCheck = Pard.Widgets.IconManager('done').render();
        _confirmationCheckContainer.append(_confirmationCheck);
        var _commentIcon = '';
        var _commentIconContainer = $('<span>').addClass('commentIcon');
        if (performance.comments) _commentIconContainer.append(Pard.Widgets.IconManager('comments').render());
        _commentIconContainer.append(_commentIcon);
        _title.append(_confirmationCheckContainer, _commentIconContainer, _titleText);
        card.append(_title.css({'position': 'absolute'}));

        card.resizable({
          resize: function(event, ui) {
            ui.size.width = ui.originalSize.width;
          },
          maxHeight: performance.maxHeight,
          grid: 10,
          stop: function(event, ui){
            console.log(performance.time);
            var duration = new Date(performance.time[0]);
            duration.setMinutes(duration.getMinutes() + ui.size.height * 1.5);
            performance.time[1] = duration.getTime();
          }
        });

        _titleText.on('click', function(){
          var _content = $('<div>').addClass('very-fast reveal full');
          _content.empty();
          $('body').append(_content);

          var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
          var _message = Pard.Widgets.PopupContent(performance.title +' (' + performance.participant_name + ')', PerformanceManager(performance, card));
          _message.setCallback(function(){
            _content.remove();
            _popup.close();
          });
          _content.append(_message.render());
          _popup.open();
        });

        delete performance.position;
        delete performance.duration;
        delete performance.maxHeight;
      }
      
      var _destroy = function(){
        card.remove();
      }

      var _modify = function(_performance){
      	performance = _performance;
      	fillCard(performance);
      }

      fillCard(performance);

      return {
        show: performance,
        card: card,
        modify: _modify,
        destroy: _destroy
      }
    }

    var PerformanceManager = function(performance, card){
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

        _savePerformance(performance);
        setStartTimes();
        setEndTimes();
      });

      spaceSelector.on('change', function(){
        performance.host_id = spaceSelector.val();
        _savePerformance(performance);
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
        _savePerformance(performance);
      });

      endTime.on('change', function(){
        var oldEnd = performance['time'][1];
        var newEnd = parseInt(endTime.val());
        card.css({'height': '+=' + (newEnd - oldEnd) / 90000});
        performance['time'][1] = newEnd;
        setStartTimes();
        _savePerformance(performance);
      });

      removeInputButton.on('click', function(){
        destroy(performance);
        _closePopup();
      });

      input.on('change', function(){
        performance.confirmed = input.is(":checked");
        if (performance.confirmed) card.find('.checker').append(Pard.Widgets.IconManager('done').render());
        else card.find('.checker').empty();
        _savePerformance(performance);
      });

      comments.on('input', function(){
        performance.comments = comments.val();
        card.find('.commentIcon').empty();
        if (performance.comments) card.find('.commentIcon').append(Pard.Widgets.IconManager('comments').render());
        _savePerformance(performance);
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

    var PermanentPerformance = function(performance){

      var card =$('<div>').addClass('programHelper');
      card.addClass('dragged-card-call-manager cursor_grab');
      card.addClass(performance.performance_id);
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
          Pard.Bus.trigger('stop');
          if(ui.helper.data('dropped') == false) destroyPermanents(performance);
        }
      });

      var fillCard = function(){

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
        
        var _title = $('<p>').addClass('proposal-title-card-call-manager');
        var _titleTextLong = performance.participant_name + ' - ' + performance.title;
        var _titleText = $('<a>').attr('href','#').text(Pard.Widgets.CutString(_titleTextLong, 35));
        var _confirmationCheck = '';
        var _confirmationCheckContainer = $('<span>').addClass('checker');
        if (performance.confirmed == 'true' || performance.confirmed == true) _confirmationCheck = Pard.Widgets.IconManager('done').render();
        _confirmationCheckContainer.append(_confirmationCheck);
        var _commentIcon = '';
        var _commentIconContainer = $('<span>').addClass('commentIcon');
        if (performance.comments) _commentIconContainer.append(Pard.Widgets.IconManager('comments').render());
        _commentIconContainer.append(_commentIcon);
        _title.append(_confirmationCheckContainer, _commentIconContainer, _titleText);
        card.append(_title.css({'position': 'absolute'}));

        //On click the performance shows its program
        _titleText.on('click', function(){
          var _content = $('<div>').addClass('very-fast reveal full');
          _content.empty();
          $('body').append(_content);

          var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
          var _message = Pard.Widgets.PopupContent(performance.title +' (' + performance.participant_name + ')', Manager());
          _message.setCallback(function(){
            _content.remove();
            _popup.close();
          });
          _content.append(_message.render());
          _popup.open();
        });

        return {
          render: function(){
            return _card;
          }
        }
      }

      var Manager = function(saveMethod){
        var performancesBox = $('<div>').css('padding', 0);
        var artistProgram = the_event.artists[performance.participant_id].program;
        var performances = Object.keys(artistProgram).map(function(performance_id){
          return artistProgram[performance_id];
        });
        performances = performances.filter(function(show){
          return (show.permanent == 'true' && show.participant_proposal_id == performance.participant_proposal_id);
        });
        performances.forEach(function(show){
          performancesBox.append(the_event.program[show.performance_id].performanceManager(saveMethod).render());
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

      var performances;
      var _loadDates = function(){
        daySelector.empty();
        daySelector.attr('disabled', false);
        var artistProgram = the_event.artists[performance.participant_id].program;
        performances = Object.keys(artistProgram).map(function(performance_id){
          return artistProgram[performance_id];
        });
        performances = performances.filter(function(show){
          return (show.permanent == 'true' && show.participant_proposal_id == performance.participant_proposal_id);
        });
        var dates = performances.map(function(show){
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

      var PerformanceManager = function(saveMethod){
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
        	var space = the_event.spaces[profile_id];
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

          the_event.spaces[performance.host_id].addPerformance(performance, card);
          if(saveMethod == 'load') the_event.artists[performance.participant_id].loadPerformance(performance);
          else{ the_event.artists[performance.participant_id].addPerformance(performance);}
          setStartTimes();
          setEndTimes();
          performances.forEach(function(show){
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
          the_event.spaces[performance.host_id].deletePerformance(performance);
          the_event.artists[performance.participant_id].deletePerformance(performance.performance_id);
          card.remove();
          performanceBox.remove();
          delete the_event.program[performance.performance_id];
          performances.splice(performances.indexOf(performance), 1);
          performances.forEach(function(show){
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

      var card = PerformanceCard().render();

      var _loadToPrograms = function(){
        the_event.spaces[performance.host_id].addPerformance(performance, card);
        the_event.artists[performance.participant_id].loadPerformance(performance);
      }

      var _destroy = function(){
        card.remove();
      }

      return {
        card: card,
        destroy: _destroy,
        loadPerformance: _loadToPrograms,
        performanceManager: PerformanceManager,
        loadDates: _loadDates,
        show: performance
      }
    }
	}
}(Pard || {}));