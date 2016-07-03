'use strict';

(function(ns){

  ns.Widgets.SpaceProgram = function(space){
    var _closepopup = {};
    var _createdWidget = $('<div>');
    var call = Pard.CachedCall;
    var program = Pard.Widgets.Program;
    var eventTime = call.eventTime;

    var myPerformances = [];
    var myPermanentPerformances = [];
    program.forEach(function(performance){
      if(performance.host_id == space.profile_id && performance.permanent == false) myPerformances.push(performance);
      if(performance.host_id == space.profile_id && performance.permanent == true) myPermanentPerformances.push(performance);
    });

    var _performaceInput = function(performance){
      var _performaceBox = $('<div>');
      var _artistContainer = $('<div>').css('height', 39);
      var _performaceContainer = $('<div>');

      //Artist selector
      var _artistSelector = $('<select>');
      Object.keys(Pard.Artists).forEach(function(artist_id){
        var artistOption = $('<option>').val(artist_id).text(Pard.Artists[artist_id][0].name); 
        _artistSelector.append(artistOption);
      });

      var _proposalSelector = $('<select>');

      var _setProposals = function(){
        _proposalSelector.empty();
        _proposalSelector.attr('disabled', false);
        Pard.Artists[performance.participant_id].forEach(function(proposal){
          console.log(proposal);
          var proposalOption = $('<option>').val(proposal.proposal_id).text(proposal.title); 
          _proposalSelector.append(proposalOption);
        });
        if(_proposalSelector.children().length <= 1) _proposalSelector.attr('disabled', true);
      }
      
      //Day selector
      var _daySelector = $('<select>');
      Object.keys(eventTime).forEach(function(day){
        var date = $('<option>').val(day).text(day); 
        _daySelector.append(date);
      });

      _daySelector.val(performance.date);
      _artistSelector.val(performance.participant_id);
      _setProposals();
      _proposalSelector.val(performance.participant_proposal_id);

      //Day selector behaviour
      _daySelector.on('change', function(){
        //Update od the performance date
        performance.date = _daySelector.val();
        var timeCol = space[performance.date].find('.spaceTime');
        timeCol.append(performance['card']);

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
      
      //Artist Selector behaviour
      _artistSelector.on('change', function(){
        //We destroy the card and add a new proposal card with the first proposal
        //Update the performance participant info
        var proposal = Pard.Artists[_artistSelector.val()][0];
        proposal['performance_id'] = performance.performance_id;

        performance.participant_id = _artistSelector.val();
        performance.participant_proposal_id = proposal.proposal_id;
          
        var timeCol = space[performance.date].find('.spaceTime');
        
        var dayStart = parseInt(eventTime[performance.date][0][0]);
        var start = (performance.time[0] - dayStart) / 90000;
        var duration = parseInt(proposal.duration)/60 * 40 || 100;

        proposal['performance_id'] = performance.performance_id;
        var cardParameters = {
          'top': performance['card'].position().top,
          'height': duration,
          'left' : performance['card'].position().left,
          'maxHeight': timeCol.height() - start,
          'day': performance.date
        }

        var newPerformance = Pard.Widgets.ProgramHelper(proposal, performance.host_proposal_id, cardParameters).render();
        timeCol.append(newPerformance);

        performance['card'].remove();
        performance['card'] = newPerformance;
        var end = new Date(performance.time[0]);
        end.setMinutes(end.getMinutes() + duration * 1.5);
        performance.time[1] = end.getTime();

        _setStartTimes();
        _setEndTimes();
        _setProposals();
      });

      //Proposal selector Behaviour
      _proposalSelector.on('change', function(){
        var proposal = $.grep(Pard.Artists[_artistSelector.val()], function(Artistproposal){
          if(Artistproposal.proposal_id == _proposalSelector.val()) return true;
          return false;
        })[0];
        proposal['performance_id'] = performance.performance_id;
        performance.participant_proposal_id = proposal.proposal_id;
          
        var timeCol = space[performance.date].find('.spaceTime');
        
        var dayStart = parseInt(eventTime[performance.date][0][0]);
        var start = (performance.time[0] - dayStart) / 90000;
        var duration = parseInt(proposal.duration)/60 * 40 || 100;

        proposal['performance_id'] = performance.performance_id;
        var cardParameters = {
          'top': performance['card'].position().top,
          'height': duration,
          'left' : performance['card'].position().left,
          'maxHeight': timeCol.height() - start,
          'day': performance.date
        }

        var newPerformance = Pard.Widgets.ProgramHelper(proposal, performance.host_proposal_id, cardParameters).render();
        timeCol.append(newPerformance);

        performance['card'].remove();
        performance['card'] = newPerformance;
        var end = new Date(performance.time[0]);
        end.setMinutes(end.getMinutes() + duration * 1.5);
        performance.time[1] = end.getTime();

        _setStartTimes();
        _setEndTimes();
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
      _artistSelector.css({'width': '200'});
      
      _daySelector.css({'display': ' inline-block', 'width': '120'});
      _proposalSelector.css({'display': ' inline-block', 'width': '250'});
      _startTime.css({'display': ' inline-block', 'width': '80'});
      _endTime.css({'display': ' inline-block', 'width': '80'});

      _artistContainer.append(_daySelector, _artistSelector);
      _performaceContainer.append(_proposalSelector, _startTime, _endTime, _removeInputButton);
      _performaceBox.append(_artistContainer, _performaceContainer);
      _createdWidget.append(_performaceBox);
    };

    //For each of the performances an input box with all the data is shown
    myPerformances.forEach(function(performance){
      _performaceInput(performance);
    });
    //Different for permanent performances
    //_permanentPerformanceInput(myPermanentPerformances);

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }

}(Pard || {}));