'use strict';

(function(ns){

	ns.Widgets.PerformanceProgram = function(proposal){
    var _closepopup = {};
    var _createdWidget = $('<div>');
    var call = Pard.CachedCall;
    var program = Pard.Widgets.Program;
    var eventTime = call.eventTime;
    
    //We get all the performances related to the proposal
    //Sorting them into permanent and non-permanent
    var myPerformances = [];
    var myPermanentPerformances = [];
    program.forEach(function(performance){
      if(performance.participant_proposal_id == proposal.proposal_id && performance.permanent == false) myPerformances.push(performance);
      if(performance.participant_proposal_id == proposal.proposal_id && performance.permanent == true) myPermanentPerformances.push(performance);
    });

    //Non-permanet input
    var _performaceInput = function(performance){
      var _performaceBox = $('<div>');
      
      //Day selector
      var _daySelector = $('<select>');
      Object.keys(eventTime).forEach(function(day){
        var date = $('<option>').val(day).text(day); 
        _daySelector.append(date);
      });

      //Space selector
      var _spaceSelector = $('<select>');
      Pard.Spaces.forEach(function(space){
        var spaceOption = $('<option>').val(space.proposal_id).text(space.name); 
        _spaceSelector.append(spaceOption);
      });

      _daySelector.val(performance.date);
      _spaceSelector.val(performance.host_proposal_id);

      //Day selector behaviour
      _daySelector.on('change', function(){
      	//Update on the performance date
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

        Pard.Spaces.forEach(function(space){
          if(space.proposal_id == performance.host_proposal_id){
            var timeCol = space[performance.date].find('.spaceTime');
            timeCol.append(performance['card']);
          }
        });
        _setStartTimes();
        _setEndTimes();
      });
      
      //Space Selector behaviour
      _spaceSelector.on('change', function(){
      	//Update od the performance location
        performance.host_proposal_id = _spaceSelector.val();
        Pard.Spaces.forEach(function(space){
          if(space.proposal_id == performance.host_proposal_id){
            var timeCol = space[performance.date].find('.spaceTime');
            var spaceProposal = Pard.Widgets.GetProposal(_spaceSelector.val());

            performance['card'].css('left', Pard.ShownSpaces.indexOf(space) * 176 + 1);
            timeCol.append(performance['card']);

            performance.host_id = spaceProposal.profile_id;
          }
        });
      });

      var _startTime = $('<select>');
      var _endTime = $('<select>');

      //Filling start options
      var _setStartTimes = function(){
        _startTime.empty();

        var dayStart = new Date(parseInt(eventTime[performance.date][0][0]));
        var lastIndex = eventTime[performance.date].length - 1;
        var dayEnd = new Date(parseInt(eventTime[performance.date][lastIndex][1]));
        
        var start = new Date(performance['time'][0]);
        var end = new Date(performance['time'][1]);
        //Te max value for start is that that puts the end on the limit of the day
        var maxStart = new Date(dayEnd.getTime() - end.getTime() + start.getTime());

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

      //Filling end options
      var _setEndTimes = function(){
        _endTime.empty();
        
        var lastIndex = eventTime[performance.date].length - 1;
        var dayEnd = new Date(parseInt(eventTime[performance.date][lastIndex][1]));

        var start = new Date(performance['time'][0]);
        //The minimum end is the start plus 15 minutes
        var minEnd = new Date(start.getTime() + 15 * 60000);

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
      	//We update start and end and move the card
        var oldStart = performance['time'][0];
        var newStart = parseInt(_startTime.val());
        performance['card'].css({'top': '+=' + (newStart - oldStart) / 90000});
        performance['time'][0] = newStart;
        performance['time'][1] = performance['time'][1] + (newStart - oldStart);
        _setEndTimes();
      });

      _endTime.on('change', function(){
      	//We update the end and resize the card
        var oldEnd = performance['time'][1];
        var newEnd = parseInt(_endTime.val());
        performance['card'].css({'height': '+=' + (newEnd - oldEnd) / 90000});
        performance['time'][1] = newEnd;
        _setStartTimes();
      });

      var _removeInputButton = $('<span>').addClass('material-icons add-multimedia-input-button-delete').html('&#xE888');

      _removeInputButton.on('click', function(){
      	//Removing card and performance from program
        program.splice(Pard.Widgets.Program.indexOf(performance), 1);
        performance['card'].remove();
        _performaceBox.remove();
      });

      //Selectors CSS
      _daySelector.css({'display': ' inline-block', 'width': '120'});
      _spaceSelector.css({'display': ' inline-block', 'width': '250'});
      _startTime.css({'display': ' inline-block', 'width': '80'});
      _endTime.css({'display': ' inline-block', 'width': '80'});

      _performaceBox.append(_daySelector, _spaceSelector, _startTime, _endTime, _removeInputButton);
      _createdWidget.append(_performaceBox);
    };

    //Input for permanent performances
    var _permanentPerformanceInput = function(performances){
      //Storing dates and places. Necessary since a permanent performance is composed of performances with dates and places
      var dates = [];
      var host_proposal_ids = [];
      performances.forEach(function(performance){
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

      performances.forEach(function(performance){
        var _performaceBox = $('<div>');
        var _daySelector = $('<select>');
        _daySelectors.push(_daySelector);

        //Day selector
        Object.keys(eventTime).forEach(function(day){
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
        });

        _spaceSelector.on('change', function(){
          //If no more performances in a place, the card on that place is removed
          host_proposal_ids.splice($.inArray(performance.host_proposal_id, host_proposal_ids), 1);
          if($.inArray(performance.host_proposal_id, host_proposal_ids) < 0) performance.card.remove();
          
          var spaceProposal = Pard.Widgets.GetProposal(_spaceSelector.val());
          //If no performaces on the new place, a card is created
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

                var cardParameters = {
                  'top': position,
                  'left' : Pard.ShownSpaces.indexOf(space) * Pard.ColumnWidth + 1,
                }

                var newPerformance = Pard.Widgets.ProgramPermanentHelper(proposal, _spaceSelector.val(), cardParameters).render();
                              
                var timeCol = space['permanent'].find('.spaceTime');
                timeCol.append(newPerformance);
                performance['card'] = newPerformance;
              }
            });
          }
          //If there is already a card, the changed performace must point to it
          else{
            var _card = {};
            performances.forEach(function(myPerformance){
              if(myPerformance.host_proposal_id == _spaceSelector.val()) _card = myPerformance['card'];
            });
            performance['card'] = _card;
          }

          //Updating performace
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
        });

        _endTime.on('change', function(){
          performance['time'][1] = parseInt(_endTime.val());
          _setStartTimes();
        });

        var _removeInputButton = $('<span>').addClass('material-icons add-multimedia-input-button-delete').html('&#xE888');
        _removeInputButton.on('click', function(){
          
        	//Removing all elements from global variables pointing to the deleted performance
          dates.splice(dates.indexOf(performance.date), 1);
          host_proposal_ids.splice(dates.indexOf(performance.host_proposal_id), 1);
          performances.splice(performances.indexOf(performance), 1);
          program.splice(Pard.Widgets.Program.indexOf(performance), 1);

          _performaceBox.remove();
          //If no more performances in that place, delete the card
          if($.inArray(performance.host_proposal_id, host_proposal_ids) < 0) performance.card.remove();

          _daySelectors.splice(_daySelectors.indexOf(_daySelector), 1);
          _setDates(performance.date);
        });
        
        //CSS
        _daySelector.css({'display': ' inline-block', 'width': '120'});
        _spaceSelector.css({'display': ' inline-block', 'width': '250'});
        _startTime.css({'display': ' inline-block', 'width': '80'});
        _endTime.css({'display': ' inline-block', 'width': '80'});

        _performaceBox.append(_daySelector, _spaceSelector, _startTime, _endTime, _removeInputButton);
        _createdWidget.append(_performaceBox);
      });
    };

    //For each of the performances an input box with all the data is shown
    myPerformances.forEach(function(performance){
      _performaceInput(performance);
    });
    //Different for permanent performances
    _permanentPerformanceInput(myPermanentPerformances);

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