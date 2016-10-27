'use strict';

(function(ns){
  ns.Widgets = ns.Widgets || {};  

  ns.Widgets.PermanentPerformanceProgram = function(cardInfo, conflict){
    var _closepopup = {};
    var _createdWidget = $('<div>');
    var eventTime = Pard.CachedEvent.eventTime;
    
    //We get all the performances related to the proposal
    //Sorting them into permanent and non-permanent
    var _performances = [];
    var _performance = {};
    Pard.Widgets.Program.forEach(function(performance){
      if(performance.performance_id == cardInfo.performance_id){
        _performances.push(performance);
        if(performance.date == cardInfo.date) _performance = performance;
      }
    });

    var _checkConflict = function(new_date){
      var _myPerformances = [];
      Pard.Widgets.Program.forEach(function(performance){
        if(performance.date == new_date && performance.participant_proposal_id == cardInfo.participant_proposal_id) _myPerformances.push(performance);
      });
      if(!conflict){
        if (_myPerformances)  _myPerformances = Pard.Widgets.ReorderProgramCrono(_myPerformances);
        _myPerformances.some(function(performance, index){
           var _check = function(){
            for(i = _myPerformances.indexOf(performance) + 1; i < _myPerformances.length; i++){
              if(_myPerformances[i].time[0] < performance.time[1]) return true;
            }
          }
          if(_check()){
            var _content = $('<div>').addClass('very-fast reveal full');
            _content.empty();
            $('body').append(_content);
            cardInfo.profile_id = cardInfo.participant_id;

            var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
            var _message = Pard.Widgets.PopupContent(cardInfo.name, Pard.Widgets.ArtistProgram(cardInfo), 'space-program-popup-call-manager');
            _message.setCallback(function(){
              _closepopup();
              _createdWidget.remove();
            });
            _content.append(_message.render());
            _popup.open();
            return true;
          }
        });
      }
    }
    //Storing dates and places. Necessary since a permanent performance is composed of performances with dates and places
    var dates = [];
    var host_proposal_ids = [];
    _performances.forEach(function(performance){
      dates.push(performance.date);
      host_proposal_ids.push(performance.host_proposal_id);
    });
     
    var _performanceBox = $('<div>');
    var _daySelector = $('<select>');

    //Day selector
    Object.keys(eventTime).forEach(function(day){
      if(day == 'permanent') return false;
      if(day == _performance.date || dates.indexOf(day) < 0){
        var _date = $('<option>').val(day).text(day); 
        _daySelector.append(_date);
      }
    });
    //Is blocked if no options left
    //Unblocks if a date is deleted
    if(_daySelector.children().length <= 1) _daySelector.attr('disabled', true);

    //Space selector
    var _spaceSelector = $('<select>');
    Pard.Spaces.forEach(function(space){
      var spaceOption = $('<option>').val(space.proposal_id).text(space.name); 
      _spaceSelector.append(spaceOption);
    });

    _daySelector.val(_performance.date);
    _spaceSelector.val(_performance.host_proposal_id);

    _daySelector.on('change', function(){
     //Updating day selectors
      dates.splice(dates.indexOf(_performance.date), 1);
      dates.push(_daySelector.val());

      _performance.date = _daySelector.val();
      var dateArray = _performance.date.split('-');
      var start = new Date(_performance.time[0]);
      var end = new Date(_performance.time[1]);

      start.setUTCFullYear(parseInt(dateArray[0]));
      end.setUTCFullYear(parseInt(dateArray[0]));

      start.setUTCMonth(parseInt(dateArray[1] - 1));
      end.setUTCMonth(parseInt(dateArray[1] - 1));

      start.setUTCDate(parseInt(dateArray[2]));
      end.setUTCDate(parseInt(dateArray[2]));

      _performance.time[0] = start.getTime();
      _performance.time[1] = end.getTime();

      _setStartTimes();
      _setEndTimes();
      _checkConflict(_performance.date);
    });

    _spaceSelector.on('change', function(){
      //If no more performances in a place, the card on that place is removed
      host_proposal_ids.splice($.inArray(_performance.host_proposal_id, host_proposal_ids), 1);
      if($.inArray(_performance.host_proposal_id, host_proposal_ids) < 0){
        _performance.card.remove();
        var spacePerformances = [];
        var performance_ids = [_performance.performance_id];
        //Recalculating position of the rest of the elements of the column one a card is destroyed
        Pard.Widgets.Program.forEach(function(performance){
          // spacePerformances = [];
          if(performance.permanent == true){
            if($.inArray(performance.performance_id, performance_ids) < 0 && performance.host_proposal_id == _performance.host_proposal_id){
              performance_ids.push(performance.performance_id);
              spacePerformances.push(performance);
            }
          }
        });
        spacePerformances.forEach(function(spacePerformance, index){
          console.log('first')
          spacePerformance['card'].css({'top': index * Pard.PermanentCardHeight + 41});
        });
      }
      
      var spaceProposal = Pard.Widgets.GetProposal(_spaceSelector.val());
      //If no performances on the new place, a card is created
      if($.inArray(_spaceSelector.val(), host_proposal_ids) < 0){
        Pard.Spaces.forEach(function(space){
          if(space.proposal_id == _spaceSelector.val()){

            var performance_ids = [];
            var position = 41;
            Pard.Widgets.Program.forEach(function(performance){
              if(performance.permanent == true){
                if($.inArray(performance.performance_id, performance_ids) < 0 && performance.host_proposal_id == space.proposal_id){
                  performance_ids.push(performance.performance_id);
                  position += parseInt(performance.card.height());
                }
              }
            });

            _performance.card = Pard.Widgets.ProgramPermanentHelper(cardInfo, _spaceSelector.val()).render();
            var timeCol = space['permanent'].find('.spaceTime');
            _performance.card.css({
              'top': position,
              'left' : Pard.ShownSpaces.indexOf(space) * Pard.ColumnWidth + 1
            });
            timeCol.append(_performance.card);
          }
        });
      }
      //If there is already a card, the changed performance must point to it
      else{
        var _card = {};
        _performances.forEach(function(performance){
          if(performance.host_proposal_id == _spaceSelector.val()) _card = performance.card;
        });
        _performance.card = _card;
      }

      //Updating performance
      _performance.host_id = spaceProposal.profile_id;
      _performance.host_proposal_id = _spaceSelector.val();
      host_proposal_ids.push(_spaceSelector.val());
    });

    var _startTime = $('<select>');
    var _endTime = $('<select>');

    //Same as non-permanent but this time there is no duration involved
    var _setStartTimes = function(){
      _startTime.empty();
      var dayStart = new Date(parseInt(eventTime[_performance.date][0][0]));
      var maxStart = new Date(_performance.time[1]);
      maxStart.setMinutes(maxStart.getMinutes() - 15);

      while(dayStart <= maxStart){
        var hours = dayStart.getHours();
        var minutes = dayStart.getMinutes();
        if(hours < 10) hours = '0' + hours;
        if(minutes < 10) minutes = '0' + minutes;
        var startOption = $('<option>').val(dayStart.getTime()).text(hours + ':' + minutes);
        _startTime.append(startOption);
        dayStart.setMinutes(dayStart.getMinutes() + 15);
      };
      _startTime.val(_performance.time[0]);
    };

    var _setEndTimes = function(){
      _endTime.empty();
    
      var lastIndex = eventTime[_performance.date].length - 1;
      var dayEnd = new Date(parseInt(eventTime[_performance.date][lastIndex][1]));

      var minEnd = new Date(_performance.time[0] + 15 * 60000);

      while(minEnd <= dayEnd){
        var hours = minEnd.getHours();
        var minutes = minEnd.getMinutes();
        if(hours < 10) hours = '0' + hours;
        if(minutes < 10) minutes = '0' + minutes;
        var endOption = $('<option>').val(minEnd.getTime()).text(hours + ':' + minutes);
        _endTime.append(endOption);

        minEnd.setMinutes(minEnd.getMinutes() + 15);
      };
      _endTime.val(_performance.time[1]);
    };

    _setStartTimes();
    _setEndTimes();

    _startTime.on('change', function(){
      _performance['time'][0] = parseInt(_startTime.val());
      _setEndTimes();
      _checkConflict(_performance.date);
    });

    _endTime.on('change', function(){
      _performance['time'][1] = parseInt(_endTime.val());
      _setStartTimes();
      _checkConflict(_performance.date);
    });

    var _removeInputButton = $('<span>').addClass('material-icons add-multimedia-input-button-delete').html('&#xE888');
    _removeInputButton.on('click', function(){
      //Removing all elements from global variables pointing to the deleted performance
      dates.splice(dates.indexOf(_performance.date), 1);
      host_proposal_ids.splice(host_proposal_ids.indexOf(_performance.host_proposal_id), 1);
      _performances.splice(_performances.indexOf(_performance), 1);
      Pard.Widgets.Program.splice(Pard.Widgets.Program.indexOf(_performance), 1);

      _performanceBox.remove();
      //If no more performances in that place, delete the card
      if($.inArray(_performance.host_proposal_id, host_proposal_ids) < 0){
        _performance.card.remove();
        var spacePerformances = [];
        var performance_ids = [_performance.performance_id];
        //Recalculating position of the rest of the elements of the column one a card is destroyed
        Pard.Widgets.Program.forEach(function(performance){
          // spacePerformances = [];
          if(performance.permanent == true){
            if($.inArray(performance.performance_id, performance_ids) < 0 && performance.host_proposal_id == _performance.host_proposal_id){
              performance_ids.push(performance.performance_id);
              spacePerformances.push(performance);
            }
          }
        });
        spacePerformances.forEach(function(spacePerformance, index){
                    console.log('second');

          spacePerformance['card'].css({'top': index * Pard.PermanentCardHeight + 41});
        });
      }
    });
    
    var _confirmedContainer = $('<div>').css('height', 20);
    var _input = $('<input />').attr({ type: 'checkbox'});
    _input.prop('checked', _performance.confirmed);
    var _label = $('<label>').html('Confirmado');
    _label.css('display','inline');
    var _confirmed = $('<div>').append(_input,_label);
    _input.on('change', function(){
      _performances.forEach(function(performance){
        performance.confirmed = _input.is(":checked");
      });
    });
    _confirmed.css('margin-left', 430);
    _confirmedContainer.append(_confirmed);

    var _commentsContainer = $('<div>');
    var _comments = $('<textarea>').attr({placeholder: 'Comentarios:'});
    _comments.on('input', function(){
      _performance['comments'] = _comments.val();
    });
    _comments.val(_performance['comments']);
    _comments.css('width', 530);
    _commentsContainer.append(_comments);

    var _performanceContainer = $('<div>').css('height', 40);
    _performanceContainer.append(_daySelector, _spaceSelector, _startTime, _endTime, _removeInputButton);

    //Selectors CSS
    _daySelector.css({'display': ' inline-block', 'width': '120'});
    _spaceSelector.css({'display': ' inline-block', 'width': '250'});
    _startTime.css({'display': ' inline-block', 'width': '80'});
    _endTime.css({'display': ' inline-block', 'width': '80'});

    _performanceBox.append(_confirmedContainer, _performanceContainer, _commentsContainer);
    _createdWidget.append(_performanceBox);

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = function(){
          _createdWidget.remove();
          callback();
        }
      }
    }
  };


	ns.Widgets.PermanentPerformanceManager = function(cardInfo, conflict){
    var _closepopup = {};
    var _createdWidget = $('<div>');
    var the_event = Pard.CachedEvent;
    var program = Pard.Widgets.Program;
    var eventTime = the_event.eventTime;
    
    //We get all the performances related to the proposal
    //Sorting them into permanent and non-permanent
    var _performances = [];
    program.forEach(function(performance){
      if(performance.participant_proposal_id == cardInfo.participant_proposal_id && performance.permanent == true) _performances.push(performance);
    });

    var _checkConflict = function(new_date){
      var _myPerformances = [];
      Pard.Widgets.Program.forEach(function(performance){
        if(performance.date == new_date && performance.participant_proposal_id == cardInfo.participant_proposal_id) _myPerformances.push(performance);
      });
      if(!conflict){
        if (_myPerformances)  _myPerformances = Pard.Widgets.ReorderProgramCrono(_myPerformances);
        _myPerformances.some(function(performance, index){
           var _check = function(){
            for(i = _myPerformances.indexOf(performance) + 1; i < _myPerformances.length; i++){
              if(_myPerformances[i].time[0] < performance.time[1]) return true;
            }
          }
          if(_check()){
            var _content = $('<div>').addClass('very-fast reveal full');
            _content.empty();
            $('body').append(_content);
            cardInfo.profile_id = cardInfo.participant_id;

            var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
            var _message = Pard.Widgets.PopupContent(cardInfo.name, Pard.Widgets.ArtistProgram(cardInfo), 'space-program-popup-call-manager');
            _message.setCallback(function(){
              _closepopup();
              _createdWidget.remove();
            });
            _content.append(_message.render());
            _popup.open();
            return true;
          }
        });
      }
    }

    //Storing dates and places. Necessary since a permanent performance is composed of performances with dates and places
    var dates = [];
    var host_proposal_ids = [];
    var _checkBoxes = [];

    _performances.forEach(function(performance){
      dates.push(performance.date);
      host_proposal_ids.push(performance.host_proposal_id);
    });

    var _daySelectors = [];
    //Function that sets the dates of all the performances once one is changed
    var _setDates = function(date){
      _daySelectors.forEach(function(daySelector){
        var _date = $('<option>').val(date).text(date); 
        daySelector.append(_date);
        daySelector.attr('disabled', false);
      });  
    };

    _performances.forEach(function(performance){
      var _performanceBox = $('<div>');
      var _daySelector = $('<select>');
      _daySelectors.push(_daySelector);

      //Day selector
      Object.keys(eventTime).forEach(function(day){
        if(day == 'permanent') return false;
        if(day == performance.date || dates.indexOf(day) < 0){
          var _date = $('<option>').val(day).text(day); 
          _daySelector.append(_date);
        }
      });
      //Is blocked if no options left
      //Unblocks if a date is deleted
      if(_daySelector.children().length <= 1) _daySelector.attr('disabled', true);

      //Space selector
      var _spaceSelector = $('<select>');
      Pard.Spaces.forEach(function(space){
        var spaceOption = $('<option>').val(space.proposal_id).text(space.name); 
        _spaceSelector.append(spaceOption);
      });

      _daySelector.val(performance.date);
      _spaceSelector.val(performance.host_proposal_id);

      _daySelector.on('change', function(){
      	//Updating day selectors
        dates.splice(dates.indexOf(performance.date), 1);
        dates.push(_daySelector.val());

        performance.date = _daySelector.val();
        var dateArray = performance.date.split('-');
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

        _setStartTimes();
        _setEndTimes();
        _checkConflict(performance.date);
      });

      _spaceSelector.on('change', function(){
        //If no more performances in a place, the card on that place is removed
        host_proposal_ids.splice($.inArray(performance.host_proposal_id, host_proposal_ids), 1);
        if($.inArray(performance.host_proposal_id, host_proposal_ids) < 0){
          performance.card.remove();
          var spacePerformances = [];
          var performance_ids = [performance.performance_id];
          //Recalculating position of the rest of the elements of the column one a card is destroyed
          Pard.Widgets.Program.forEach(function(show){
            if(show['permanent'] == true){
              if($.inArray(show['performance_id'], performance_ids) < 0 && show['host_proposal_id'] == performance.host_proposal_id){
                performance_ids.push(show['performance_id']);
                spacePerformances.push(show);
              }
            }
          });
          spacePerformances.forEach(function(spacePerformance, index){
            console.log('third')
            spacePerformance['card'].css({'top': index * Pard.PermanentCardHeight + 41});
          });
        }
            
        var spaceProposal = Pard.Widgets.GetProposal(_spaceSelector.val());
        //If no performances on the new place, a card is created
        if($.inArray(_spaceSelector.val(), host_proposal_ids) < 0){
          Pard.Spaces.forEach(function(space){
            if(space.proposal_id == _spaceSelector.val()){

              var performance_ids = [];

              var position = 41;
              Pard.Widgets.Program.forEach(function(performanceProgram){
                if(performanceProgram['permanent'] == true){
                  if($.inArray(performanceProgram['performance_id'], performance_ids) < 0 && performanceProgram['host_proposal_id'] == space.proposal_id){
                    performance_ids.push(performanceProgram['performance_id']);
                    position += parseInt(performanceProgram['card'].height());
                  }
                }
              });

              performance.card = Pard.Widgets.ProgramPermanentHelper(cardInfo, _spaceSelector.val()).render();
              var timeCol = space['permanent'].find('.spaceTime');
              performance.card.css({
                'top': position,
                'left' : Pard.ShownSpaces.indexOf(space) * Pard.ColumnWidth + 1
              });
              timeCol.append(performance.card);
            }
          });
        }
        //If there is already a card, the changed performance must point to it
        else{
          var _card = {};
          _performances.forEach(function(myPerformance){
            if(myPerformance.host_proposal_id == _spaceSelector.val()) _card = myPerformance['card'];
          });
          performance['card'] = _card;
        }

        //Updating performance
        performance.host_id = spaceProposal.profile_id;
        performance.host_proposal_id = _spaceSelector.val();
        host_proposal_ids.push(_spaceSelector.val());
      });

      var _startTime = $('<select>');
      var _endTime = $('<select>');

      //Same as non-permanent but this time there is no duration involved
      var _setStartTimes = function(){
        _startTime.empty();

        var dayStart = new Date(parseInt(eventTime[performance.date][0][0]));
        var maxStart = new Date(performance['time'][1]);
        maxStart.setMinutes(maxStart.getMinutes() - 15);

        while(dayStart <= maxStart){
          var hours = dayStart.getHours();
          var minutes = dayStart.getMinutes();4
          if(hours < 10) hours = '0' + hours;
          if(minutes < 10) minutes = '0' + minutes;
          var startOption = $('<option>').val(dayStart.getTime()).text(hours + ':' + minutes);
          _startTime.append(startOption);
          dayStart.setMinutes(dayStart.getMinutes() + 15);
        };
        _startTime.val(performance['time'][0]);
      };

      var _setEndTimes = function(){
        _endTime.empty();
      
        var lastIndex = eventTime[performance.date].length - 1;
        var dayEnd = new Date(parseInt(eventTime[performance.date][lastIndex][1]));

        var minEnd = new Date(performance['time'][0] + 15 * 60000);

        while(minEnd <= dayEnd){
          var hours = minEnd.getHours();
          var minutes = minEnd.getMinutes();4
          if(hours < 10) hours = '0' + hours;
          if(minutes < 10) minutes = '0' + minutes;
          var endOption = $('<option>').val(minEnd.getTime()).text(hours + ':' + minutes);
          _endTime.append(endOption);

          minEnd.setMinutes(minEnd.getMinutes() + 15);
        };
        _endTime.val(performance['time'][1]);
      };

      _setStartTimes();
      _setEndTimes();

      _startTime.on('change', function(){
        performance['time'][0] = parseInt(_startTime.val());
        _setEndTimes();
        _checkConflict(performance.date);
      });

      _endTime.on('change', function(){
        performance['time'][1] = parseInt(_endTime.val());
        _setStartTimes();
        _checkConflict(performance.date);
      });

      var _removeInputButton = $('<span>').addClass('material-icons add-multimedia-input-button-delete').html('&#xE888');
      _removeInputButton.on('click', function(){
          
      	//Removing all elements from global variables pointing to the deleted performance
        dates.splice(dates.indexOf(performance.date), 1);
        host_proposal_ids.splice(host_proposal_ids.indexOf(performance.host_proposal_id), 1);
        _performances.splice(_performances.indexOf(performance), 1);
        program.splice(Pard.Widgets.Program.indexOf(performance), 1);

        _performanceBox.remove();
        //If no more performances in that place, delete the card
        if($.inArray(performance.host_proposal_id, host_proposal_ids) < 0){
          performance.card.remove();
          var spacePerformances = [];
          var performance_ids = [performance.performance_id];
          //Recalculating position of the rest of the elements of the column one a card is destroyed
          Pard.Widgets.Program.forEach(function(show){
            if(show['permanent'] == true){
              // spacePerformances = [];
              if($.inArray(show['performance_id'], performance_ids) < 0 && show['host_proposal_id'] == performance.host_proposal_id){
                performance_ids.push(show['performance_id']);
                spacePerformances.push(show);
              }
            }
          });
          spacePerformances.forEach(function(spacePerformance, index){
            console.log('last');
            spacePerformance['card'].css({'top': index * Pard.PermanentCardHeight + 41});
          });
        }

        _daySelectors.splice(_daySelectors.indexOf(_daySelector), 1);
        _setDates(performance.date);
      });
        
      var _confirmedContainer = $('<div>').css('height', 20);

      var _input = $('<input />').attr({ type: 'checkbox'});
      _input.prop('checked', performance.confirmed);
      var _label = $('<label>').html('Confirmado');
      _label.css('display','inline');
      var _confirmed = $('<div>').append(_input,_label);
      _checkBoxes.push(_input);

      _input.on('change', function(){
        var _check = false;
        _performances.forEach(function(myPerformance){
          myPerformance.confirmed = _input.is(":checked");
          if (myPerformance.confirmed) _check = true; 
        });
        _checkBoxes.forEach(function(checkbox){
          checkbox.prop('checked', _input.is(':checked'));
        });
        if (_check) _performances[0].card.find('.checker').append(Pard.Widgets.IconManager('done').render())
        else _performances[0].card.find('.checker').empty();
      });
      _confirmed.css('margin-left', 430);
      _confirmedContainer.append(_confirmed);


      var _commentsContainer = $('<div>');
      var _comments = $('<textarea>').attr({placeholder: 'Comentarios:'});
      _comments.on('input', function(){
        performance['comments'] = _comments.val();
        performance.card.find('.commentIcon').empty(); 
        if (performance.comments) performance.card.find('.commentIcon').append(Pard.Widgets.IconManager('comments').render());
      });
      _comments.val(performance['comments']);
      _comments.css('width', 530);
      _commentsContainer.append(_comments);

      var _performanceContainer = $('<div>').css('height', 40);
      _performanceContainer.append(_daySelector, _spaceSelector, _startTime, _endTime, _removeInputButton);

      //Selectors CSS
      _daySelector.css({'display': ' inline-block', 'width': '120'});
      _spaceSelector.css({'display': ' inline-block', 'width': '250'});
      _startTime.css({'display': ' inline-block', 'width': '80'});
      _endTime.css({'display': ' inline-block', 'width': '80'});

      _performanceBox.append(_confirmedContainer, _performanceContainer, _commentsContainer);
      _createdWidget.append(_performanceBox);
    });



    //For each of the performances an input box with all the data is shown
    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = function(){
          _createdWidget.remove();
          callback();
        }
      }
    }
  }

}(Pard || {}));