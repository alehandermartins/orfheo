'use strict';

(function(ns){

  ns.Widgets.ProgramManager = function(){
    // Pard.Widgets.Program = [];
    var _createdWidget = $('<div>').attr('id', 'programPanel').addClass('program-panel-call-manager');
   
    var call = Pard.CachedCall;
    //Schedule of the event
    var eventTime = call.eventTime;
    
    //Object to fill with profile_id (keys) and proposals (values)
    var artists = {};

    //Filling default categories for selectors
    var artistProposals = Pard.Widgets.ArtistProposals();
    var spaceProposals = Pard.Widgets.SpaceProposals();

    //Filling artists, spaces and selector options
    call['proposals'].forEach(function(proposal){
      //Formatting availability parameter
      if(proposal.availability && proposal.availability != 'false'){
        var availability = [];
        Object.keys(proposal.availability).forEach(function(index){
          var date = new Date(proposal.availability[index]);
          availability.push(date.toISOString().split('T')[0]);
        });
        proposal.availability = availability;
      }
      else{ proposal.availability = Object.keys(eventTime);}

      if (proposal.type == 'artist'){
        artists[proposal.profile_id] = artists[proposal.profile_id] || [];
        artists[proposal.profile_id].push(proposal)
      };
      if (proposal.type == 'space'){
        Pard.Spaces.push(proposal);
        spaceProposals.push({
          id: proposal.profile_id,
          text: proposal.name
        });
      }
    });

    spaceProposals.push({
      id: 'available',
      text: 'Disponible'
    },
    {
      id: 'unavailable',
      text: 'No disponible'
    });

    //Filling artist proposals
    Object.keys(artists).forEach(function(profile_id){
      artistProposals.push({
        id: artists[profile_id][0].profile_id,
        text: artists[profile_id][0].name
      });
    });

    //Ordering spaces
    var _reorderSpaces = function(a, b){
      if (call.order.indexOf(a.proposal_id) < call.order.indexOf(b.proposal_id)) return -1;
      if (call.order.indexOf(a.proposal_id) > call.order.indexOf(b.proposal_id)) return 1;
      return 0;
    }
    Pard.Spaces.sort(_reorderSpaces);
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
   
    //Button for showing hidding artists
    var _showArtists = $('<button>').attr('type','button').addClass('show-hide-btn-call-manager');
    var _showIcon = Pard.Widgets.IconManager('hide_left_list').render().css('color','#6f6f6f');
    var _hideIcon = Pard.Widgets.IconManager('hide_right_list').render();
    _showArtists.append(_hideIcon);
    _showArtists.on('click', function(){
      _artists.toggle('slide', {direction: 'right'}, 500);
      if(_artists.hasClass('is-active')){ 
        _artists.removeClass('is-active');
        _showArtists.empty();
        _showArtists.append(_showIcon);
      }
      else{
        _artists.addClass('is-active');
        _showArtists.empty();
        _showArtists.append(_hideIcon);
      }
    });

    var _scrollLeftBtn = $('<button>').attr('type','button').append(Pard.Widgets.IconManager('navigation_left').render().addClass('navigation-btn-icon'));
    var _scrollRightBtn = $('<button>').attr('type','button').append(Pard.Widgets.IconManager('navigation_right').render().addClass('navigation-btn-icon'));

    _scrollRightBtn.mousehold(500,function(){
      var _leftPos = _tableContainer.scrollLeft();
      $(_tableContainer).animate({
        scrollLeft: _leftPos + 528
    }, 500);
    });

    _scrollLeftBtn.mousehold(500,function(){
      var _leftPos = _tableContainer.scrollLeft();
      $(_tableContainer).animate({
        scrollLeft: _leftPos - 528
    }, 500);
    });

    var _scrollers = $('<div>').append( _scrollLeftBtn, _scrollRightBtn).addClass('scrollers-call-managers');

    var _selectors = $('<div>').addClass('selectors-call-manager');


     //Declaring Selectors
    var _daySelectorContainer = $('<div>').addClass('day-selector-container-call-manager');
    var _daySelector = $('<select>');
    var _lastSelected = Object.keys(eventTime)[0];

    var _spaceSelectorContainer = $('<div>').addClass('space-selector-container-call-manager');
    var _spaceSelector = $('<select>');
    var _emptySpace = $('<option>');
    _spaceSelector.append(_emptySpace);

    var _artistSelectorContainer = $('<li>').addClass('artists-selector-container-call-manager')
    var _artistSelector = $('<select>');
    var _emptyArtist = $('<option>');
    _artistSelector.append(_emptyArtist);

    _spaceSelectorContainer.append(_spaceSelector);
    _artistSelectorContainer.append(_artistSelector);
    _daySelectorContainer.append(_daySelector);

    _createdWidget.append(_selectors.append(_daySelectorContainer, _spaceSelectorContainer, _showArtists));

    //Dayselector behaviour
    _daySelector.select2({
      // data: spaceProposals,
      minimumResultsForSearch: Infinity,
      // tags: true,
      allowClear:false,
      templateResult: formatResource
    }).on('select2:select', function(){
      //Hiding timeTable if permanent
      if(_daySelector.val() == 'permanent') _timeTable.hide();
      else{_timeTable.show();}
      //Giving css to unavailable proposals
      proposalCards.forEach(function(card){
        card.setDay(_daySelector.val());
      });

      var _spacePerformances = [];
      Pard.Widgets.Program.forEach(function(performance){
        if(performance.permanent == false){
          _spacePerformances[performance.host_proposal_id] = _spacePerformances[performance.host_proposal_id] || {};
          _spacePerformances[performance.host_proposal_id][performance.date] = _spacePerformances[performance.host_proposal_id][performance.date] || [];
          _spacePerformances[performance.host_proposal_id][performance.date].push(performance);
        } 
      });
      //Only affects the columns of the shown spaces
      Pard.ShownSpaces.forEach(function(space, index){
        //Hiding lastSelection
        space[_lastSelected].hide();
        //Showing new selection (append needed to reorder)
        if (index > 0) Pard.ShownSpaces[index - 1][_daySelector.val()].after(space[_daySelector.val()]);
        space[_daySelector.val()].show();
        space[_daySelector.val()].css({
          'width': Pard.ColumnWidth,
        });
        if(_daySelector.val() == 'permanent'){
          space[_daySelector.val()].find('.programHelper').css({
            'width': Pard.ColumnWidth - 2,
            'left': index * Pard.ColumnWidth + 1 
          });
        }
        if(_spacePerformances[space.proposal_id] && _spacePerformances[space.proposal_id][_daySelector.val()]) Pard.Widgets.AlignPerformances(_spacePerformances[space.proposal_id][_daySelector.val()]);
      });
        //Setting new selection as lastSelection
      _lastSelected = _daySelector.val();
    });

    //SpaceSelector Behaviour
    _spaceSelector.select2({
      placeholder: 'Espacios',
      allowClear: true,
      data: spaceProposals,
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
        if (_data.id == 'available' && _daySelector.val() !== 'permanent'){
          Pard.Spaces.forEach(function(space){
            if ($.inArray(_daySelector.val(), space.availability)>-1)  {
              space[_lastSelected].show();
              Pard.ShownSpaces.push(space);
            }
            else{ 
              space[_lastSelected].hide();
            }
          })
        }
        else if (_data.id == 'unavailable' && _daySelector.val() !== 'permanent'){
          Pard.Spaces.forEach(function(space){
            if ($.inArray(_daySelector.val(), space.availability)<0){
                space[_lastSelected].show();
                Pard.ShownSpaces.push(space);
              }
              else{ 
                space[_lastSelected].hide();
              }
            })
          }
        else {
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
        }
        //Formatting columns with depending on the amount of shown spaces
        var _spacePerformances = [];
        Pard.Widgets.Program.forEach(function(performance){
          if(performance.permanent == false){
            _spacePerformances[performance.host_proposal_id] = _spacePerformances[performance.host_proposal_id] || {};
            _spacePerformances[performance.host_proposal_id][performance.date] = _spacePerformances[performance.host_proposal_id][performance.date] || [];
            _spacePerformances[performance.host_proposal_id][performance.date].push(performance);
          } 
        });
        Pard.ColumnWidth = 176; 
        if(Pard.ShownSpaces.length < 4) Pard.ColumnWidth = Pard.ColumnWidth * 4 / Pard.ShownSpaces.length;
        Pard.ShownSpaces.forEach(function(space, index){
          if (index > 0) Pard.ShownSpaces[index - 1][_daySelector.val()].after(space[_daySelector.val()]);
          space[_daySelector.val()].css({
            'width': Pard.ColumnWidth,
          });
          if(_daySelector.val() == 'permanent'){
            space[_daySelector.val()].find('.programHelper').css({
              'width': Pard.ColumnWidth - 2,
              'left': index * Pard.ColumnWidth + 1 
            });
          }
          if(_spacePerformances[space.proposal_id] && _spacePerformances[space.proposal_id][_daySelector.val()]) Pard.Widgets.AlignPerformances(_spacePerformances[space.proposal_id][_daySelector.val()]);
        });
      }
    });

    //Space selector unselecting case (shows all spaces and formats width)
    _spaceSelector.on("select2:unselecting", function(e){
      Pard.ShownSpaces = [];
      _whiteBox.css('background','white');
      Pard.Spaces.forEach(function(space){
        space[_lastSelected].show();
        Pard.ShownSpaces.push(space);
      });
      var _spacePerformances = [];
      Pard.Widgets.Program.forEach(function(performance){
        if(performance.permanent == false){
          _spacePerformances[performance.host_proposal_id] = _spacePerformances[performance.host_proposal_id] || {};
          _spacePerformances[performance.host_proposal_id][performance.date] = _spacePerformances[performance.host_proposal_id][performance.date] || [];
          _spacePerformances[performance.host_proposal_id][performance.date].push(performance);
        } 
      });
      Pard.ColumnWidth = 176; 
      if(Pard.ShownSpaces.length < 4) Pard.ColumnWidth = Pard.ColumnWidth * 4 / Pard.ShownSpaces.length;
      Pard.ShownSpaces.forEach(function(space, index){
        if (index > 0) Pard.ShownSpaces[index - 1][_daySelector.val()].after(space[_daySelector.val()]);
        space[_daySelector.val()].css({
          'width': Pard.ColumnWidth,
        });
        if(_daySelector.val() == 'permanent'){
          space[_daySelector.val()].find('.programHelper').css({
            'width': Pard.ColumnWidth - 2,
            'left': index * Pard.ColumnWidth + 1 
          });
        }
        if(_spacePerformances[space.proposal_id] && _spacePerformances[space.proposal_id][_daySelector.val()]) Pard.Widgets.AlignPerformances(_spacePerformances[space.proposal_id][_daySelector.val()]);
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

    var _tableBox = $('<div>').addClass('table-box-call-manager');

    var _timeTable = $('<div>');
    var _timeTableContainer = $('<div>').addClass('time-table-call-manager');

    var _tableContainer = $('<div>').addClass('tableContainer table-container-call-manager');

    var _table = $('<div>').css({
      'width': '100%',
      'white-space':'nowrap',
    });

    //Artists panel
    var _artists = $('<ul>').addClass('accordion is-active').attr({'data-accordion':'', 'role': 'tablist'}).addClass('artist-accordeon-call-manager');
    var _listContainer = $('<div>').addClass('artist-list-container-call-manager');
    _artists.append(_artistSelectorContainer, _listContainer);
    //Last selections (needed for accordion show hide purposes)
    var lastArtist = '';
    var lastaHref = '';
    //Array of proposal cards
    var proposalCards = [];

    var startTime = new Date().getTime();
    //Filling the accordion... the classes are giving style from foundation... need to change and redifine (no foundation behaviour)
    Object.keys(artists).forEach(function(profile_id, index){

      var proposal = artists[profile_id][0];
      var container = $('<div>').css({'padding': 0});
      var accordionNav = $('<li>').addClass('accordion-item');
      var aHref = $('<a>').addClass('accordion-title').text(proposal.name);
      var _artistMenuDropdown = Pard.Widgets.ArtistDropdownMenu(artists[profile_id][0]).render();
      _artistMenuDropdown.addClass('artists-dropdown-icon-call-manager');
      var content = $('<div>').addClass('accordion-content').css({'padding': 0});
      artists[profile_id].forEach(function(proposal){
        //Creating cards for each proposal
        var proposalCard = Pard.Widgets.ProposalCard(proposal);
        proposalCards.push(proposalCard);
        content.append(proposalCard.render());
        var pep = 'pep';
      });
      accordionNav.append(aHref.append(_artistMenuDropdown));
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
      _listContainer.append(container);
      artists[profile_id]['card'] = container;
    });
    
    var endTime = new Date().getTime();

    var hours = [];

    //console.log((endTime - startTime) /1000);

    //Filling the columns for each day we declare a set of space columns. One extra set for permanent
    Object.keys(eventTime).forEach(function(day, day_number){

      if (day == 'permanent') return false;

      var date = $('<option>').val(day).text(moment(day).format('DD-MM-YYYY'));
      //New date for _daySelector 
      _daySelector.append(date);

      if (day_number == 0) {
        _daySelector.select2('data', {id: day, text: day});
        _daySelector.trigger('change');
      }
      var start = new Date(parseInt(eventTime[day][0][0]));
      var startDate = start.getDate();
      var startHour = start.getHours();
      
      var lastIndex = eventTime[day].length - 1;
      
      var end = new Date(parseInt(eventTime[day][lastIndex][1]));
      var endDate = end.getDate();
      var endHour = end.getHours();

      //Amount of hours in our day
      hours = [];
      if(endDate > startDate){
        for (var i = startHour; i < 24; i++) {
          hours.push(i);
        }
        for (var i = 0; i <= endHour; i++) {
          hours.push(i);
        }
      }
      else{
        for (var i = startHour; i <= endHour; i++) {
          hours.push(i);
        }
      }

      _table.css({
        'height': hours.length*40+2
      });
      _artists.css({
        'height': hours.length*40+2
      });

      //Times and lines (This gets redefined each loop... probably not the best place)
      hours.forEach(function(hour, hourIndex){
        if(hour < 10) hour = '0' + hour;
        var _time = $('<div>').html(hour + ':00').addClass('time-timeTable-call-manager');
        _time.css({top: 28 + hourIndex * 40 + "px"});
        var _line = $('<hr>').addClass('line-timeTable-call-manager')
        _line.css({top: 20 + hourIndex * 40 + "px"});
        _timeTable.append(_time, _line);
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
      _spaceCol = Pard.Widgets.PermanentSpaceColumn(space, hours).render();
      _table.append(_spaceCol.hide());
      space['permanent'] = _spaceCol;
    });
    
    //Showing the first day space columns
    Pard.Spaces.forEach(function(space){
      Pard.ShownSpaces.push(space);
      space[Object.keys(eventTime)[0]].show();
    });

    //White extra box to append to the end... to make all columns visible even when accordion is shown
    var _whiteBox = $('<div>').html('&nbsp').addClass('last-white-column-table-manager');
    _whiteBox.css('width', Pard.ColumnWidth);
    _table.append(_whiteBox);
    _tableContainer.append(_table);

    _tableBox.append(_timeTableContainer.append(_scrollers, _timeTable), _tableContainer, _artists);

    _createdWidget.append(_tableBox);


    //Submit button it justs sends the created program
    var _submitBtn = Pard.Widgets.Button('', function(){
      var program = [];
      var order = [];
      Pard.Widgets.Program.forEach(function(performance, index){
        var _performance = {
          performance_id: performance.performance_id,
          participant_id: performance.participant_id,
          participant_proposal_id: performance.participant_proposal_id,
          host_id: performance.host_id,
          host_proposal_id: performance.host_proposal_id,
          date: performance.date,
          time: performance.time,
          permanent: performance.permanent,
          comments: performance.comments,
          confirmed: performance.confirmed
        }
        program.push(_performance);
      });

      Pard.Spaces.forEach(function(space){
        order.push(space.proposal_id);
      });
      Pard.Backend.program(' ', program, order, Pard.Events.SaveProgram);
    }).render().addClass('submit-program-btn-call-manager');

    _submitBtn.append(Pard.Widgets.IconManager('save').render());

    var _submitBtnContainer = $('<div>').addClass('submit-program-btn-container');
    // var _successBox = $('<span>').attr({id:'succes-box-call-manager'});

    _selectors.append(_submitBtnContainer.append($('<p>').html('Guarda </br>los cambios').addClass('save-text-call-manager'),_submitBtn));

    //Filling the table with existing program from database
    if(call['program']){
      var permanentPerformances = {};
      var scheduledPerformances = {};
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
              var dayStart = parseInt(eventTime[performance.date][0][0]);
              performance.time[0] = parseInt(performance.time[0]);
              performance.time[1] = parseInt(performance.time[1]);
              
              //We transform the start and end of the performance into pixels using the beginning of the day
              //10 pixels = 15 min
              var start = (performance.time[0] - dayStart) / 90000;
              var end = (performance.time[1] - dayStart) / 90000;
              var position = start + 41;
              var duration = (end - start);
              var left = index * Pard.ColumnWidth + 1;
              var maxHeight = timeCol.height() - start;


              //Info for the card
              var _cardInfo = {
                performance_id: performance.performance_id,
                participant_id: proposal.profile_id,
                participant_proposal_id: proposal.proposal_id,
                title: proposal.title,
                duration: proposal.duration,
                category: proposal.category,
                availability: proposal.availability,
                name: proposal.name,
                date: performance.date
              }
              
              //New card
              performance.permanent = false;
              if(performance.confirmed == 'true') performance.confirmed = true;
              if(performance.confirmed == 'false') performance.confirmed = false;
              performance.card = Pard.Widgets.ProgramHelper(_cardInfo, performance.host_proposal_id).render();
              performance.card.css({
                'top': position,
                'height': duration,
                'left' : left
              });
              timeCol.append(performance.card);
              performance.card.resizable({
                maxHeight: maxHeight
              });
              if($.inArray(performance.date, proposal.availability) < 0) performance.card.addClass('artist-not-available-call-manager');
              else{performance.card.removeClass('artist-not-available-call-manager');}
              Pard.Widgets.Program.push(performance);
              scheduledPerformances[performance.host_proposal_id] = scheduledPerformances[performance.host_proposal_id] || {};
              scheduledPerformances[performance.host_proposal_id][performance.date] = scheduledPerformances[performance.host_proposal_id][performance.date] || [];
              scheduledPerformances[performance.host_proposal_id][performance.date].push(performance);
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
              
              //Info for the card
              var _cardInfo = {
                performance_id: performance.performance_id,
                participant_id: proposal.profile_id,
                participant_proposal_id: proposal.proposal_id,
                title: proposal.title,
                duration: proposal.duration,
                category: proposal.category,
                availability: proposal.availability,
                name: proposal.name,
                date: performance.date
              }
              
              newPerformance[performance.performance_id] = Pard.Widgets.ProgramPermanentHelper(_cardInfo, performance.host_proposal_id).render();
              timeCol.append(newPerformance[performance.performance_id]);
              newPerformance[performance.performance_id].css({
                'top': performance_ids.length * Pard.PermanentCardHeight + 41,
                'left' : index * Pard.ColumnWidth + 1,
              });
              performance_ids.push(performance.performance_id);
            }
            //All performances with the same performance_id must point to the same card
            performance.permanent = true;
            if(performance.confirmed == 'true') performance.confirmed = true;
            if(performance.confirmed == 'false') performance.confirmed = false;
            performance.time[0] = parseInt(performance.time[0]);
            performance.time[1] = parseInt(performance.time[1]);
            performance.card = newPerformance[performance.performance_id];
            Pard.Widgets.Program.push(performance);
          });
        }
      });
      Object.keys(scheduledPerformances).forEach(function(host_proposal_id){
        Object.keys(scheduledPerformances[host_proposal_id]).forEach(function(date){
          Pard.Widgets.AlignPerformances(scheduledPerformances[host_proposal_id][date]);
        });
      });
    }

  	return {
      render: function(){
        return _createdWidget;
      }
    }
  }
  
}(Pard || {}));
