'use strict';

(function(ns){

  ns.Widgets.ProgramManager = function(call){
    var _createdWidget = $('<div>').attr('id', 'programPanel').css({
      'margin-left': 35
    });

    Pard.CachedCall = call;
    
    //Schedule of the event
    var eventTime = call.eventTime;

    //To be included in call Database (if not already)
    // var eventTime = {
    //   '2016-10-15': [['2016-10-15T10:00:00.000Z', '2016-10-15T14:00:00.000Z'], ['2016-10-15T17:00:00.000Z', '2016-10-15T23:00:00.000Z']],
    //   '2016-10-16': [['2016-10-16T10:00:00.000Z', '2016-10-16T14:00:00.000Z'], ['2016-10-16T17:00:00.000Z', '2016-10-16T23:00:00.000Z']]
    // };

    //Object to fill with profile_id (keys) and proposals (values)
    var artists = {};

    //Filling default categories for selectors
    var artistProposals = Pard.Widgets.ArtistProposals();
    var spaceProposals = Pard.Widgets.SpaceProposals();

    //Filling artists, spaces and selector options
    call['proposals'].forEach(function(proposal){
      if (proposal.type == 'artist'){
        artists[proposal.profile_id] = artists[proposal.profile_id] || [];
        artists[proposal.profile_id].push(proposal)
      };
      if (proposal.type == 'space'){
        spaceProposals.push({
          id: proposal.profile_id,
          text: proposal.name
        });
        Pard.Spaces.push(proposal);
      }
    });

    //Filling artist proposals
    Object.keys(artists).forEach(function(profile_id){
      artistProposals.push({
        id: artists[profile_id][0].profile_id,
        text: artists[profile_id][0].name
      });
    });

    //Giving format to selector items
    function formatResource (resource) {
      var _label = $('<span>').text(resource.text);
      if(resource.icon){
        var _icon = Pard.Widgets.IconManager(resource.icon).render();
        _label.append(_icon);
        _icon.css({
          position: 'relative',
          left: '5px',
          top: '5px',
        });
      }
      return _label;
    };

    //Declaring Selectors
    var _daySelector = $('<select>');
    var _lastSelected = Object.keys(eventTime)[0];

    var _spaceSelectorContainer = $('<div>')
    var _spaceSelector = $('<select>');
    var _emptySpace = $('<option>');
    _spaceSelector.append(_emptySpace);

    var _artistSelectorContainer = $('<div>')
    var _artistSelector = $('<select>');
    var _emptyArtist = $('<option>');
    _artistSelector.append(_emptyArtist);

    _spaceSelectorContainer.append(_spaceSelector);
    _artistSelectorContainer.append(_artistSelector);

    //Button for showing hiding artists
    var _showArtists = Pard.Widgets.Button('Ver', function(){
      _artists.toggle('slide', {direction: 'right'}, 500);
      if(_artists.hasClass('is-active')) _artists.removeClass('is-active');
      else{_artists.addClass('is-active');}
    }).render();

    //Selectors CSS
    _daySelector.css({
      'display': 'inline-block',
      'width': 120
    });

    _spaceSelectorContainer.css({
      'margin-left': 50,
      'display': 'inline-block',
      'width': 300
    });
    _artistSelectorContainer.css({
      'margin-left': 50,
      'display': 'inline-block',
      'width': 300
    });
    _showArtists.css({
      'display': 'inline-block',
      'margin-left': 5
    });

    _createdWidget.append(_daySelector, _spaceSelectorContainer, _artistSelectorContainer, _showArtists);

    //Dayselector behaviour
    _daySelector.on('change', function(){
      //Only affects the columns of the shown spaces
      Pard.ShownSpaces.forEach(function(space, index){
        //Hiding timeTable if permanent
        if(_daySelector.val() == 'permanent') _timeTable.hide();
        else{_timeTable.show();}
        //Hiding lastSelection
        space[_lastSelected].hide();
        //Showing new selection (append needed to reorder)
        if (index > 0) Pard.ShownSpaces[index - 1][_daySelector.val()].after(space[_daySelector.val()]);
        space[_daySelector.val()].show();
      });
        //Seting new selection as lastSelection
      _lastSelected = _daySelector.val();
    });

    //SpaceSelector Behaviour
    _spaceSelector.select2({
      placeholder: 'Espacios',
      allowClear: true,
      data: spaceProposals,
      tags: true,
      tokenSeparators: [',', ' '],   
      templateResult: formatResource,
    }).on("select2:select", function(e) {
      var _data = _spaceSelector.select2('data')[0];
      //On every change shown spaces are redefined
      Pard.ShownSpaces = [];
      if(!_data.selected){
        spaces.forEach(function(space){
          space[_lastSelected].hide();
        });
      }
      else{
        var field = 'profile_id';
        if(_data['type'] == 'category') field = 'category';
        Pard.Spaces.forEach(function(space){
          if(space[field] == _data['id']){
            //Showing selected spaces and adding them to shown list
            space[_lastSelected].show();
            Pard.ShownSpaces.push(space);
          }
          else{ space[_lastSelected].hide();}
        });

        //Formatting columns with depending on the amount of shown spaces
        Pard.ColumnWidth = 176; 
        if(Pard.ShownSpaces.length < 4) Pard.ColumnWidth = Pard.ColumnWidth * 4 / Pard.ShownSpaces.length;
        var _keys = Object.keys(eventTime);
        _keys.push('permanent');
        Pard.ShownSpaces.forEach(function(space, index){
          if (index > 0) Pard.ShownSpaces[index - 1][_daySelector.val()].after(space[_daySelector.val()]);
          _keys.forEach(function(date){
            space[date].css({
              'width': Pard.ColumnWidth,
            });
            space[date].find('.programHelper').css({
              'width': Pard.ColumnWidth - 2,
              'left': index * Pard.ColumnWidth + 1
            });
          });
        });
      }
    });

    //Space selector unselecting case (shows all spaces and formats width)
    _spaceSelector.on("select2:unselecting", function(e){
      Pard.ShownSpaces = [];
      Pard.Spaces.forEach(function(space){
        space[_lastSelected].show();
        Pard.ShownSpaces.push(space);
      });
      Pard.ColumnWidth = 176; 
      if(Pard.ShownSpaces.length < 4) Pard.ColumnWidth = Pard.ColumnWidth * 4 / Pard.ShownSpaces.length;
      var _keys = Object.keys(eventTime);
      _keys.push('permanent');
      Pard.ShownSpaces.forEach(function(space, index){
        if (index > 0) Pard.ShownSpaces[index - 1][_daySelector.val()].after(space[_daySelector.val()]);
        space[_lastSelected].css({
        'width': Pard.ColumnWidth,
        });
        space[_lastSelected].find('.programHelper').css({
          'width': Pard.ColumnWidth - 2,
          'left': index * Pard.ColumnWidth + 1
        });
      });
      $(this).select2("val", "");
      e.preventDefault();
    });

    //Artists selector Behaviour
    _artistSelector.select2({
      placeholder: 'Artistas',
      data: artistProposals,
      allowClear: true,
      tags: true,
      tokenSeparators: [',', ' '],   
      templateResult: formatResource,
    }).on("select2:select", function(e) {
      var _data = _artistSelector.select2('data')[0];
      if(!_data.selected){
        Object.keys(artists).forEach(function(profile_id){
          artists[profile_id]['card'].hide();
        });
      }
      //If a category is selected we look into each artist proposal to check if it has any matching proposal
      if(_data['type'] == 'category'){
        Object.keys(artists).forEach(function(profile_id){
          var check = false;
          artists[profile_id].forEach(function(proposal){
            if (proposal.category == _data['id']) check = true;
          });
          if(check == true) artists[profile_id]['card'].show();
          else{artists[profile_id]['card'].hide();}
        });
      }
      //If an artist is selected we desplay it with its proposals opened     
      else{
        artists[_artistSelector.val()]['card'].show();
        artists[_artistSelector.val()]['card'].find('.accordion-item').trigger('click');
        Object.keys(artists).forEach(function(profile_id){
          if(profile_id != _artistSelector.val()) artists[profile_id]['card'].hide();
        });
      }
      //When there is a selection the panel is displayed
      if(!_artists.hasClass('is-active')){
        _artists.addClass('is-active');
        _artists.toggle('slide', {direction: 'right'}, 500);
      }
    });

    //Artist unselecting case (display all)
    _artistSelector.on("select2:unselecting", function(e){
      Object.keys(artists).forEach(function(profile_id){
        artists[profile_id]['card'].show();
      });
      $(this).select2("val", "");
      e.preventDefault();
    });

    var _tableContainer = $('<div>').addClass('tableContainer').css({
      'overflow-x': 'scroll',
      'overflow-y': 'hidden',
      'width': Pard.ColumnWidth * 5,
      'position': 'relative'
    });

    var _table = $('<div>').css({
      'width': 'auto',
      'white-space':'nowrap',
    });

    //Artists panel
    var _artists = $('<ul>').addClass('accordion is-active').attr({'data-accordion':'', 'role': 'tablist'}).css({
      'position': 'absolute',
      'overflow-y': 'scroll',
      'top': 196,
      'left': 751,
      'width': 233,
      'border-width': '1px',
      'border-style': 'solid',
      'height': 562,
      'z-index': 4
    });

    //Last selections (needed for accordion show hide purposes)
    var lastArtist = '';
    var lastaHref = '';

    //Filling the accordion... the classes are giving style from foundation... need to change and redifine (no foundation behaviour)
    Object.keys(artists).forEach(function(profile_id, index){

      var proposal = artists[profile_id][0];
      var container = $('<div>').css({'padding': 0});
      var accordionNav = $('<li>').addClass('accordion-item');
      var aHref = $('<a>').addClass('accordion-title').text(proposal.name);
      var content = $('<div>').addClass('accordion-content').css({'padding': 0});
      artists[profile_id].forEach(function(proposal){
        //Creating cards for each proposal
        content.append(Pard.Widgets.ProposalCard(proposal).render());
      });
      accordionNav.append(aHref);
      container.append(accordionNav, content);

      //Accordion behaviour
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
      artists[profile_id]['card'] = container;
    });

    _createdWidget.append(_artists, _showArtists);

    var _timeTable = $('<div>');

    //Filling the columns for each day we declare a set of space columns. One extra set for permanent
    Object.keys(eventTime).forEach(function(day){

      var date = $('<option>').val(day).text(day);
      //New date for _daySelector 
      _daySelector.append(date);
      
      var start = parseInt(eventTime[day][0][0].split('T')[1].split(':')[0]);
      var lastIndex = eventTime[day].length - 1;
      var end = parseInt(eventTime[day][lastIndex][1].split('T')[1].split(':')[0]);

      //Amount of hours in our day
      var hours = [];
      for (var i = start; i <= end; i++) {
        hours.push(i);
      };

      //Times and lines (This gets redefined each loop... probably not the best place)
      hours.forEach(function(hour, hourIndex){
        var _time = $('<div>').html(hour + ':00').css({
          position: "absolute",
          top: 217 + hourIndex * 40 + "px",
          left: 0
        });
        var _line = $('<hr>').css({
          position: "absolute",
          top: 217 + hourIndex * 40 + "px",
          left: 0,
          width: 927
        });
        _timeTable.append(_time, _line);
        _createdWidget.append(_timeTable);
      });

      //Defining space columns and appending them (they start hidden)
      Pard.Spaces.forEach(function(space){
        _spaceCol = Pard.Widgets.SpaceColumn(space, day, hours).render();
        _table.append(_spaceCol.hide());
        space[day] = _spaceCol;
      });
    });

    //Pemanent option for daySelector
    _daySelector.append($('<option>').val('permanent').text('Permanente'));

    //Defining Permanent columns
    Pard.Spaces.forEach(function(space){
      _spaceCol = Pard.Widgets.PermanentSpaceColumn(space).render();
      _table.append(_spaceCol.hide());
      space['permanent'] = _spaceCol;
    });
    
    //Showing the first day space columns
    Pard.Spaces.forEach(function(space){
      Pard.ShownSpaces.push(space);
      space[Object.keys(eventTime)[0]].show();
    });

    //White extra box to append to the end... to make all columns visible even when accordion is shown
    var _whiteBox = $('<div>').html('&nbsp').css({
      'display': 'inline-block',
      'width': Pard.ColumnWidth,
      'height': 500,
    });
    _table.append(_whiteBox);
    _tableContainer.append(_table);
    _createdWidget.append(_tableContainer);

    //Submit button it justs sends the created program
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

    //Filling the table with existing program from database
    if(call['program']){
      var permanentPerformances = {};
      call['program'].forEach(function(performance){
        //Permanent and non permanent performances are not treated equally
        if (performance.permanent == 'true'){
          permanentPerformances[performance.host_id] = permanentPerformances[performance.host_id] || [];
          permanentPerformances[performance.host_id].push(performance);
        }
        if (performance.permanent == 'false'){
          Pard.Spaces.forEach(function(space, index){
            if(space.proposal_id == performance.host_proposal_id){
              //We get the part where the performances are dropped
              var timeCol = space[performance.date].find('.spaceTime');
              //We get the artist proposal info
              var proposal = Pard.Widgets.GetProposal(performance.participant_proposal_id);

              //We get the beginning of the day in minutes
              var eventTimeArray = eventTime[performance.date][0][0].split('T')[1].split(':');
              var eventMinutes = parseInt(eventTimeArray[0]) * 60 + parseInt(eventTimeArray[1]);

              //We transform the start and end of the performance into pixels using the beginning of the day
              //10 pixels = 15 min 
              var startArray = performance.time[0].split('T')[1].split(':');
              var start = (parseInt(startArray[0]) * 60 + parseInt(startArray[1]) - eventMinutes) / 1.5;
              var endArray = performance.time[1].split('T')[1].split(':');
              var end = (parseInt(endArray[0]) * 60 + parseInt(endArray[1]) - eventMinutes) / 1.5;

              //Info for the card
              proposal['performance_id'] = performance.performance_id;
              proposal['width'] = Pard.ColumnWidth - 2;
              proposal['height'] = (end - start);
              proposal['top'] = start + 41;
              proposal['left'] = index * Pard.ColumnWidth + 1;
              proposal['maxHeight'] = timeCol.height() - start;
              
              //New card
              var newPerformance = Pard.Widgets.ProgramHelper(proposal, performance.host_proposal_id).render();
              timeCol.append(newPerformance);
              performance.card = newPerformance;
              performance.permanent = false;

              Pard.Widgets.Program.push(performance);
            }
          });
        }
      });
      Pard.Spaces.forEach(function(space, index){
        if(permanentPerformances[space.profile_id]){
          var performance_ids = [];
          var newPerformance = {};
          permanentPerformances[space.profile_id].forEach(function(performance){
            //Permanent performances are composed ov several performances with de same performance_id, one for each day
            //Only one card per permanent performance per space
            if($.inArray(performance.performance_id, performance_ids) < 0){
              var timeCol = space['permanent'].find('.spaceTime');
              var proposal = Pard.Widgets.GetProposal(performance.participant_proposal_id);
              
              proposal['performance_id'] = performance.performance_id;
              proposal['height'] = 100;
              proposal['top'] = performance_ids.length * proposal['height'] + 41;
              proposal['left'] = index * Pard.ColumnWidth + 1;

              performance_ids.push(performance.performance_id);

              newPerformance[performance.performance_id] = Pard.Widgets.ProgramPermanentHelper(proposal, performance.host_proposal_id).render();
              timeCol.append(newPerformance[performance.performance_id]);
            }
            //All performances with the same performance_id must point to the same card
            performance.permanent = true;
            performance.card = newPerformance[performance.performance_id];
            Pard.Widgets.Program.push(performance);
          });
        }
      });
    }

  	return {
      render: function(){
        return _createdWidget;
      }
    }
  }
  
}(Pard || {}));
