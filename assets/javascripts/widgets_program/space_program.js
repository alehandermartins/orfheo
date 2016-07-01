'use strict';

(function(ns){

  ns.Widgets.SpaceProgram = function(profile_id){
    var _closepopup = {};
    var _createdWidget = $('<div>');
    var call = Pard.CachedCall;
    var program = Pard.Widgets.Program;
    var eventTime = call.eventTime;

    var myPerformances = [];
    var myPermanentPerformances = [];
    program.forEach(function(performance){
      if(performance.host_id == profile_id && performance.permanent == false) myPerformances.push(performance);
      if(performance.host_id == profile_id && performance.permanent == true) myPermanentPerformances.push(performance);
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
      Pard.Artists[performance.participant_id].forEach(function(proposal){
        var proposalOption = $('<option>').val(proposal.proposal_id).text(proposal.title); 
        _proposalSelector.append(proposalOption);
      });
      if(_proposalSelector.children().length <= 1) _proposalSelector.attr('disabled', true);
      
      //Day selector
      var _daySelector = $('<select>');
      Object.keys(eventTime).forEach(function(day){
        var date = $('<option>').val(day).text(day); 
        _daySelector.append(date);
      });

      _daySelector.val(performance.date);
      _artistSelector.val(performance.participant_id);
      _proposalSelector.val(performance.participant_proposal_id);

      //Day selector behaviour
      _daySelector.on('change', function(){
        //We destroy the card and add a new card to the new space column
        //Update od the performance date
        performance.date = _daySelector.val();
        performance['card'].remove();
        Pard.Spaces.forEach(function(space){
          if(space.proposal_id == performance.host_proposal_id){
            var timeCol = space[performance.date].find('.spaceTime');
            var newPerformance = Pard.Widgets.ProgramHelper(proposal, performance.host_proposal_id).render();
            timeCol.append(newPerformance);
            performance['card'] = newPerformance;
          }
        });
      });
      
      //Space Selector behaviour
      _artistSelector.on('change', function(){
        //We destroy the card and add a new card to the new space column
        //Update od the performance location
        performance.participant_id = _artistSelector.val();
        performance['card'].remove();
        Pard.Spaces.forEach(function(space){
          if(space.proposal_id == performance.host_proposal_id){
            var timeCol = space[performance.date].find('.spaceTime');
            var spaceProposal = Pard.Widgets.GetProposal(_spaceSelector.val());

            proposal['left'] = Pard.ShownSpaces.indexOf(space) * 176 + 1;
            
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

      //Filling start options
      var _setStartTimes = function(){
        _startTime.empty();
        var start = new Date(performance['time'][0]);
        var end = new Date(performance['time'][1]);

        //Te max value for start is that that puts the end on the limit of the day
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

      //Filling end options
      var _setEndTimes = function(){
        _endTime.empty();
        var start = new Date(performance['time'][0]);
        //The minimum end is the start plus 15 minutes
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
        //We update start and end and move the card
        var oldStart = new Date(performance['time'][0]).getTime();
        var newStart = new Date(_startTime.val()).getTime();
        performance['card'].css({'top': '+=' + (newStart - oldStart) / 90000});
        performance['time'][0] = _startTime.val();
        performance['time'][1] = new Date((new Date(performance['time'][1]).getTime() + (newStart - oldStart))).toISOString();
        _endTime.val(performance['time'][1]);
        _setEndTimes();
      });

      _endTime.on('change', function(){
        //We update the end and resize the card
        var oldEnd = new Date(performance['time'][1]).getTime() / 60000;
        var newEnd = new Date(_endTime.val()).getTime() / 60000;
        performance['card'].css({'height': '+=' + (newEnd - oldEnd) / 1.5});
        performance['time'][1] = _endTime.val();
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