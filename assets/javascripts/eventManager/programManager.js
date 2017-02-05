'use strict';

(function(ns){

  ns.ProgramManager = function(the_event, displayer){

    var artists = the_event.artists;
    var spaces = the_event.spaces;
    var order = [];
    var _program = {};

    var timeManager = Pard.Widgets.TimeManager(the_event.eventTime);
    var hours = timeManager.hours;
    the_event.eventTime = timeManager.eventTime;
    var eventTime = the_event.eventTime;

    var _createdWidget = $('<div>').attr('id', 'programPanel').addClass('program-panel-call-manager');
    var _tableBox = $('<div>').addClass('table-box-call-manager');

    var _timeTableContainer = $('<div>').addClass('time-table-call-manager');
    var _tableContainer = $('<div>').addClass('tableContainer table-container-call-manager');
    var _artistsList = $('<ul>').addClass('accordion').attr({'data-accordion':'', 'role': 'tablist'}).attr({'id':'artistAccordeon'});
    var _artistsListContainer =  $('<div>').addClass('artist-list-container-call-manager').css({
      'height':(hours.length -1) * 40
    });
    _artistsListContainer.append(_artistsList);
    var _artistsBlock = $('<div>').addClass('artist-accordeon-call-manager is-active');

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
    _timeTableContainer.append(_scrollers);

    var _tables = {};
    var _lines = [];
    var _linesLength = 885;
    var _columnsSpaces = {};
    var _emptySpaces = {};

    var _timeTable = $('<div>');
    hours.forEach(function(hour, hourIndex){
      if(hour < 10) hour = '0' + hour;
      var _time = $('<div>').html(hour + ':00').addClass('time-timeTable-call-manager');
      _time.css({top: 28 + hourIndex * 40 + "px"});
      var _line = $('<hr>').addClass('line-timeTable-call-manager');
      _line.css({top: 20 + hourIndex * 40 + "px"});
      _lines.push(_line);
      _timeTable.append(_time, _line);
    });
    _timeTableContainer.append(_timeTable);

    Object.keys(eventTime).forEach(function(day, index){
      var _table = $('<div>').css({
        'width': '100%',
        'height': hours.length * 40 + 2,
        'white-space':'nowrap'
      });
      var _emptyColumn = $('<div>').css({
        'display': 'inline-block',
        'width': '11rem'
      });
      _tables[day] = _table;
      _emptySpaces[day] = _emptyColumn;
      if(index == 0) _tableContainer.append(_tables[day]);
      else _tableContainer.append(_tables[day].hide());
    });

    var _selectors = $('<div>').addClass('selectors-call-manager');
    var _buttonsContainer = $('<div>').addClass('buttons-container-call-manager');

    var _toolsContainer = $('<div>').addClass('tools-buttons-container');
    var _submitBtnContainer = $('<div>').addClass('submit-program-btn-container');

    var _daySelectorContainer = $('<div>').addClass('day-selector-container-call-manager');
    var _daySelector = $('<select>');

    var _spaceSelectorContainer = $('<div>').addClass('space-selector-container-call-manager');
    var _spaceSelector = $('<select>');
    var _emptySpace = $('<option>');
    _spaceSelector.append(_emptySpace);

    var _artistSelectorContainer = $('<div>').addClass('artists-selector-container-call-manager');
    var _artistSelector = $('<select>');
    var _emptyArtist = $('<option>');
    _artistSelector.append(_emptyArtist);

    var _showArtists = $('<button>').attr('type','button').addClass('show-hide-btn-call-manager');
    var _showIcon = Pard.Widgets.IconManager('hide_left_list').render().css('color','#6f6f6f');
    var _hideIcon = Pard.Widgets.IconManager('hide_right_list').render();
    _showArtists.append(_hideIcon);

    _daySelectorContainer.append(_daySelector);
    _spaceSelectorContainer.append(_spaceSelector);
    _artistSelectorContainer.append(_artistSelector);

    Object.keys(eventTime).forEach(function(day, day_number){
      if (day == 'permanent') _daySelector.append($('<option>').val(day).text('Permanente'));
      else{
        var date = $('<option>').val(day).text(moment(day).format('DD-MM-YYYY'));
        _daySelector.append(date);
      }
    });

    var _lastSelected = Object.keys(eventTime)[0];
    var artistProposals, spaceProposals;
    var _shownSpaces = [];

    _daySelector.select2({
      dropdownCssClass:'orfheoTableSelector',
      minimumResultsForSearch: Infinity,
      allowClear:false,
      templateResult: Pard.Widgets.FormatResource
    }).on('select2:select', function(){
      //Giving css to unavailable proposals
      Object.keys(artists).forEach(function(profile_id){
        artists[profile_id].setDay(_daySelector.val());
      });
      if(_daySelector.val() == 'permanent') _timeTable.hide();
      else{_timeTable.show();}
      _tables[_lastSelected].hide();
      _tables[_daySelector.val()].show();
      _lastSelected = _daySelector.val();
    });

    var selectSpaces = function(){
      var _data = _spaceSelector.select2('data')[0];
      _shownSpaces = [];
      if(_data['type'] == 'category'){
        order.forEach(function(profile_id){
          if(the_event.spaces[profile_id].space.subcategory == _data['id']){
            the_event.spaces[profile_id].showColumns();
            _shownSpaces.push(profile_id);
          }
          else{ the_event.spaces[profile_id].hideColumns();}
        });
      }
      else{
        order.forEach(function(profile_id){
          if(profile_id == _spaceSelector.val()){
            the_event.spaces[profile_id].showColumns();
            _shownSpaces.push(profile_id);
          }
          else{the_event.spaces[profile_id].hideColumns();}
        });
      }
      Pard.ColumnWidth = 176;
      _linesLength = 885;
      if(_shownSpaces.length <= 4){
        Pard.ColumnWidth = Pard.ColumnWidth * 4 / _shownSpaces.length;
        _linesLength = Pard.ColumnWidth * _shownSpaces.length + 6;
      }
      _lines.forEach(function(line){
        line.css('width', _linesLength);
      });
      _shownSpaces.forEach(function(profile_id, index){
        the_event.spaces[profile_id].alignPerformances(index);
      });
    }

    var selectArtists = function(){
      var _data = _artistSelector.select2('data')[0];
      if(_data['type'] == 'category'){
        Object.keys(artists).forEach(function(profile_id){
          if (artists[profile_id].artist.proposals.some(function(proposal){
            return proposal.subcategory == _data['id'];
          })) artists[profile_id].accordion.show();
          else{artists[profile_id].accordion.hide();}
        });
      }
      else{
        Object.keys(artists).forEach(function(profile_id){
          if(profile_id == _artistSelector.val()){
            artists[_artistSelector.val()].accordion.show();
            artists[_artistSelector.val()].accordion.find('.accordion-item').trigger('click');
          }
          else{artists[profile_id].accordion.hide();}
        });
      }
    }

    var _loadSpaceSelector = function(){
      spaceProposals = [];
      Object.keys(the_event.categories.space).forEach(function(category){
        spaceProposals.push({
          type: 'category',
          id: category,
          text: category
        });
      });
      Object.keys(the_event.spaces).forEach(function(profile_id){
        spaceProposals.push({
          type: 'profile',
          id: profile_id,
          text: the_event.spaces[profile_id].space.name
        });
      });

      _spaceSelector.select2({
        placeholder: 'Espacios',
        allowClear: true,
        data: spaceProposals,
        templateResult: Pard.Widgets.FormatResource,
        dropdownCssClass: 'orfheoTableSelector'
      });
    }

    var _loadArtistSelector = function(){
      artistProposals = [];
      Object.keys(the_event.categories.artist).forEach(function(category){
        artistProposals.push({
          type: 'category',
          id: category,
          icon: the_event.categories.artist[category].icon,
          text: category
        });
      });
      Object.keys(the_event.artists).forEach(function(profile_id){
        artistProposals.push({
          id: profile_id,
          text: the_event.artists[profile_id].artist.name
        });
      });
      _artistSelector.select2({
        placeholder: 'Artistas',
        data: artistProposals,
        allowClear: true,
        templateResult: Pard.Widgets.FormatResource,
        dropdownCssClass:'orfheoTableSelector'
      });
    }

    _spaceSelector.on("select2:select", function(e) {
      selectSpaces();
    });

    _artistSelector.on("select2:select", function(e) {
      selectArtists();
    });

    _spaceSelector.on("select2:unselecting", function(e){
      _shownSpaces = order;
      Pard.ColumnWidth = 176;
      _linesLength = 885;
      if(_shownSpaces.length <= 4){
        Pard.ColumnWidth = Pard.ColumnWidth * 4 / _shownSpaces.length;
        _linesLength = Pard.ColumnWidth * _shownSpaces.length + 6;
      }
      _lines.forEach(function(line){
        line.css('width', _linesLength);
      });
      order.forEach(function(profile_id, index){
        the_event.spaces[profile_id].showColumns();
        the_event.spaces[profile_id].alignPerformances(index);
      });
      $(this).val("");
      $(this).trigger('change');
      e.preventDefault();
    });

    _artistSelector.on("select2:unselecting", function(e){
      Object.keys(artists).forEach(function(profile_id){
        artists[profile_id].accordion.show();
      });
      if(lastArtist && lastArtist.hasClass('is-active')){
        lastArtist.slideToggle();
        lastArtist.removeClass('is-active');
      }
      $(this).val("");
      $(this).trigger('change');
      e.preventDefault();
    });

    _spaceSelector.on('reload', function(e, _id){
      if(!_id) return $(this).trigger('select2:unselecting');
      $(this).val(_id);
      $(this).trigger('select2:select');
    });

    _artistSelector.on('reload', function(e, _id){
      console.log(_id);
      if(!_id) return $(this).trigger('select2:unselecting');
      $(this).val(_id);
      $(this).trigger('select2:select');
    });

    _loadSpaceSelector();
    _loadArtistSelector();

    _showArtists.on('click', function(){
      _artistsBlock.toggle('slide', {direction: 'right'}, 500);
      if(_artistsBlock.hasClass('is-active')){
        _artistsBlock.removeClass('is-active');
        _showArtists.empty();
        _showArtists.append(_showIcon);
      }
      else{
        _artistsBlock.addClass('is-active');
        _showArtists.empty();
        _showArtists.append(_hideIcon);
      }
    });

    var lastArtist;
    var _closePopup = function(){}

    var _sendForm = function(shows){
      return {
        event_id: the_event.event_id,
        program: shows,
        signature: Pard.Signature
      }
    } 

    Pard.Bus.on('spaceDrag', function(drag){
      var index = _shownSpaces.indexOf(drag.space);
      if(drag.direction == 'right' && index < _shownSpaces.length - 1){
        Object.keys(eventTime).forEach(function(date){
          the_event.spaces[_shownSpaces[index + 1]].columns[date].after(the_event.spaces[_shownSpaces[index]].columns[date]);
        });
        the_event.spaces[_shownSpaces[index + 1]].alignPerformances(index);
        the_event.spaces[_shownSpaces[index]].alignPerformances(index + 1);
        _shownSpaces.splice(index + 1, 0, _shownSpaces.splice(index, 1)[0]);
      }

      if(drag.direction == 'left' && index > 0){
        Object.keys(eventTime).forEach(function(date){
          the_event.spaces[_shownSpaces[index]].columns[date].after(the_event.spaces[_shownSpaces[index - 1]].columns[date]);
        });
        the_event.spaces[_shownSpaces[index - 1]].alignPerformances(index);
        the_event.spaces[_shownSpaces[index]].alignPerformances(index - 1);
        _shownSpaces.splice(index - 1, 0, _shownSpaces.splice(index, 1)[0]);
      }
    });
    

    Pard.Bus.on('drag', function(performance){
      if(_artistsBlock.hasClass('is-active')){
        _artistsBlock.toggle('slide', {direction: 'right'}, 500);
        _artistsBlock.removeClass('is-active');
      }
    });

    Pard.Bus.on('stop', function(performance){
      _artistsBlock.toggle('slide', {direction: 'right'}, 500);
      _artistsBlock.addClass('is-active');
    });

    Pard.Bus.on('detachPerformance', function(performance){
      the_event.spaces[performance.host_id].deletePerformance(performance);
    });

    Pard.Bus.on('checkConflicts', function(performance){
      checkConflicts(performance);
    });

    Pard.Bus.on('addPerformances', function(performances){
      performances.forEach(function(performance){
        create(performance);
      });
      if(performances[0].permanent == 'true')
        Pard.Bus.trigger('CreatePermanentsTable', performances);
    });

    Pard.Bus.on('modifyPerformances', function(performances){
      performances.forEach(function(performance){
        modify(performance);
      });
      if(performances[0].permanent == 'true')
        Pard.Bus.trigger('ModifyPermanentsTable', performances);
    });

    Pard.Bus.on('deletePerformances', function(performances){
      performances.forEach(function(performance){
        destroy(performance);
      });
      if(performances[0].permanent == 'true')
        Pard.Bus.trigger('DestroyPermanentsTable', performances);
    });

    var save = function(performance, multipleChanges){
      var show = the_event.program[performance.performance_id].show;
      the_event.spaces[show.host_id].addPerformance(the_event.program[performance.performance_id]);
      the_event.artists[show.participant_id].addPerformance(the_event.program[performance.performance_id]);
      if (_programTable)
        _programTable.save(show, multipleChanges);
    }
    
    var create = function(performance){
      the_event.spaces[performance.host_id].addSpaceInfo(performance);
      the_event.artists[performance.participant_id].addArtistInfo(performance);
      if(performance.permanent == 'true') the_event.program[performance.performance_id] = new PermanentPerformance(performance);
      else{the_event.program[performance.performance_id] = new Performance(performance);}
      if (performance.permanent == 'true') var multipleChanges = true;
      save(performance, multipleChanges);
    }

    var modify = function(performance, multipleChanges){
      var show = the_event.program[performance.performance_id].show;
      the_event.spaces[show.host_id].deletePerformance(show);
      the_event.spaces[performance.host_id].addSpaceInfo(performance);
      the_event.artists[performance.participant_id].addArtistInfo(performance);
      the_event.program[performance.performance_id].modify(performance);
      if (performance.permanent == 'true') multipleChanges = true;
      save(the_event.program[performance.performance_id].show, multipleChanges);      
    }

    var destroy = function(performance, multipleChanges){
      if(the_event.program[performance.performance_id]){
        the_event.spaces[performance.host_id].deletePerformance(performance);
        the_event.artists[performance.participant_id].deletePerformance(performance);
        the_event.program[performance.performance_id].destroy();
        delete the_event.program[performance.performance_id];
        _programTable.destroy(performance.performance_id, multipleChanges);
      }
    }

    var Performance = function(performance){

      var card =$('<div>').addClass('programHelper');
      card.addClass(performance.performance_id);
      var _title = $('<p>').addClass('proposal-title-card-call-manager');
      var _confirmationCheckContainer = $('<span>').addClass('checker');
      var _titleText = $('<a>').attr('href','#/');
      var _commentIconContainer = $('<span>').addClass('commentIcon');
      var _titleTextLong;

      _title.append(_confirmationCheckContainer, _commentIconContainer, _titleText);
      
      _titleText.on('click', function(){
        var _content = $('<div>').addClass('very-fast reveal full');
        _content.empty();
        $('body').append(_content);
        var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', multipleOpened:true});
        _popup.open();
        var _message = Pard.Widgets.PopupContent(performance.title +' (' + performance.participant_name + ')', manager(true));
        _message.setCallback(function(){
          _popup.close();          
          setTimeout(function(){
            _content.remove();
          },500);
        });
        _content.append(_message.render());
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
          if(ui.helper.data('dropped') == false){
            Pard.Backend.deletePerformances(_sendForm([performance]), function(data){
              Pard.Bus.trigger(data.event, data.model);
            });
          }
        }
      });

      var fillCard = function(performance){

        var color = Pard.Widgets.CategoryColor(performance.participant_category);

        var dayStart = parseInt(eventTime[performance.date][0]);
        var height = _tables[performance.date].height() - 42;
        performance.time[0] = parseInt(performance.time[0]);
        performance.time[1] = parseInt(performance.time[1]);
        //10 pixels = 15 min
        var start = (performance.time[0] - dayStart) / 90000;
        var end = (performance.time[1] - dayStart) / 90000;
        performance.position = start + 41;
        performance.duration = (end - start);
        performance.maxHeight = height - performance.position + 41;
        performance.participant_email = the_event.artists[performance.participant_id].artist.email;
        performance.host_email = the_event.spaces[performance.host_id].space.email;

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
        _commentIconContainer.empty();
        _confirmationCheckContainer.empty();
        if (performance.confirmed == 'true' || performance.confirmed == true) _confirmationCheckContainer.append(Pard.Widgets.IconManager('done').render());
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
            Pard.Backend.modifyPerformances(_sendForm([performance]), function(data){
              Pard.Bus.trigger(data.event, data.model);
              checkConflicts(performance);
            });
          }
        });

        delete performance.position;
        delete performance.duration;
        delete performance.maxHeight;
      }

      var manager = function(check){
        var performanceBox = $('<div>').addClass('noselect');
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

        var daySelectorContainer = $('<div>').css({'display': ' inline-block', 'width': '120'}).append(daySelector).addClass('noselect');
        var spaceSelectorContainer = $('<div>').css({'display': ' inline-block', 'width': '250'}).append(spaceSelector).addClass('noselect');
        var startTimeContainer = $('<div>').css({'display': ' inline-block', 'width': '80'}).append(startTime).addClass('noselect');
        var endTimeContainer = $('<div>').css({'display': ' inline-block', 'width': '80'}).append(endTime).addClass('noselect');
        confirmed.css('margin-left', 430);
        label.css('display','inline');
        comments.css('width', 530);
        confirmedContainer.append(confirmed);
        commentsContainer.append(comments);
        performanceContainer.append(daySelectorContainer, spaceSelectorContainer, startTimeContainer, endTimeContainer, removeInputButton);
        performanceBox.append(confirmedContainer, performanceContainer, commentsContainer);

        Object.keys(eventTime).forEach(function(day){
          if(day == 'permanent') return false;
          var _textDay = moment(new Date(day)).locale('es').format('DD-MM-YYYY');
          var date = $('<option>').val(day).text(_textDay);
          daySelector.append(date);
        });

        var spaceOptions = [];

        Object.keys(the_event.spaces).forEach(function(profile_id){
          var space = the_event.spaces[profile_id].space;
          spaceOptions.push({id: profile_id, text:space.name});
        });

        var setStartTimes = function(){
          startTime.empty();

          var dayStart = new Date(parseInt(eventTime[performance.date][0]));
          var dayEnd = new Date(parseInt(eventTime[performance.date][1]));

          var start = new Date(performance.time[0]);
          var end = new Date(performance.time[1]);
          //The max value for start is that that puts the end on the limit of the day
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
          startTime.val(performance.time[0]).trigger('change');
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
          endTime.val(performance['time'][1]).trigger('change');
        };

        spaceSelector.select2({
          data: spaceOptions,
          dropdownCssClass: 'orfheoTableSelector'
        });
        daySelector.select2({
          dropdownCssClass: 'orfheoTableSelector'
        });
        startTime.select2({
          dropdownCssClass: 'orfheoTableSelector'
        });
        endTime.select2({
          dropdownCssClass: 'orfheoTableSelector'
        });

        daySelector.on('select2:select', function(){
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

          setStartTimes();
          setEndTimes();
          Pard.Backend.modifyPerformances(_sendForm([performance]), function(data){
            Pard.Bus.trigger(data.event, data.model);
            if(check) checkConflicts(performance);
          });
        });

        spaceSelector.on('select2:select', function(){
          the_event.spaces[performance.host_id].deletePerformance(performance);
          performance.host_id = spaceSelector.val();
          the_event.spaces[performance.host_id].addSpaceInfo(performance);
          Pard.Backend.modifyPerformances(_sendForm([performance]), function(data){
            Pard.Bus.trigger(data.event, data.model);
            if(check) checkConflicts(performance);
          });
        });

        startTime.on('select2:select', function(){
          var oldStart = performance['time'][0];
          var newStart = parseInt(startTime.val());
          card.css({'top': '+=' + (newStart - oldStart) / 90000});
          performance['time'][0] = newStart;
          performance['time'][1] = performance['time'][1] + (newStart - oldStart);
          setEndTimes();
          Pard.Backend.modifyPerformances(_sendForm([performance]), function(data){
            Pard.Bus.trigger(data.event, data.model);
            if(check) checkConflicts(performance);
          });
        });

        endTime.on('select2:select', function(){
          var oldEnd = performance['time'][1];
          var newEnd = parseInt(endTime.val());
          card.css({'height': '+=' + (newEnd - oldEnd) / 90000});
          performance['time'][1] = newEnd;
          setStartTimes();
          Pard.Backend.modifyPerformances(_sendForm([performance]), function(data){
            Pard.Bus.trigger(data.event, data.model);
            if(check) checkConflicts(performance);
          });
        });

        removeInputButton.on('click', function(){
          Pard.Backend.deletePerformances(_sendForm([performance]), function(data){
            Pard.Bus.trigger(data.event, data.model);
            _closePopup();
          });
        });

        input.on('change', function(){
          performance.confirmed = input.is(":checked");
          if (performance.confirmed) card.find('.checker').append(Pard.Widgets.IconManager('done').render());
          else card.find('.checker').empty();
          Pard.Backend.modifyPerformances(_sendForm([performance]), function(data){
            Pard.Bus.trigger(data.event, data.model);
          });
        });

        comments.on('input', function(){
          performance.comments = comments.val();
          card.find('.commentIcon').empty();
          if (performance.comments) card.find('.commentIcon').append(Pard.Widgets.IconManager('comments').render());
          Pard.Backend.modifyPerformances(_sendForm([performance]), function(data){
            Pard.Bus.trigger(data.event, data.model);
          });
        });

        setStartTimes();
        setEndTimes();
        daySelector.val(performance.date).trigger('change');
        spaceSelector.val(performance.host_id).trigger('change');
        comments.val(performance.comments);

        if (performance.confirmed == 'true') performance.confirmed = true;
        if (performance.confirmed == 'false') performance.confirmed = false;
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
        performance.time[0] = parseInt(performance.time[0]);
        performance.time[1] = parseInt(performance.time[1]);
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

      performance.time[0] = parseInt(performance.time[0]);
      performance.time[1] = parseInt(performance.time[1]);
      performance.participant_email = the_event.artists[performance.participant_id].artist.email;
      performance.host_email = the_event.spaces[performance.host_id].space.email;
      
      var _title = $('<p>').addClass('proposal-title-card-call-manager');
      var _confirmationCheckContainer = $('<span>').addClass('checker');
      var _titleText = $('<a>').attr('href','#/');
      var _commentIconContainer = $('<span>').addClass('commentIcon');
      var _titleTextLong;

      _title.append(_confirmationCheckContainer, _commentIconContainer, _titleText);

      _titleText.on('click', function(){
        var _content = $('<div>').addClass('very-fast reveal full');
        _content.empty();
        $('body').append(_content);
        var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', multipleOpened:true});
        _popup.open();
        var _message = Pard.Widgets.PopupContent(performance.title +' (' + performance.participant_name + ')', PermanentManager(true, true));
        _message.setCallback(function(){
          _popup.close();
          setTimeout(function(){
            _content.remove();
          },500);
        });
        _content.append(_message.render());
      });

      var _card = $('<div>').addClass('programHelper');
      _card.append(_title.css({'position': 'absolute'}));
      _card.addClass('dragged-card-call-manager cursor_grab');
      _card.addClass(performance.performance_id);
      _card.mousedown(function(){
        _card.removeClass('cursor_grab').addClass('cursor_move');
      });
      _card.mouseup(function(){
        _card.removeClass('cursor_move').addClass('cursor_grab');
      });

      _card.draggable({
        revert: false,
        helper: 'clone',
        grid: [ 10, 10 ],
        start: function(event, ui){
          _card.removeClass('cursor_grab').addClass('cursor_move');
          _card.css({'opacity': '0.4'});
          ui.helper.data('dropped', false);
          Pard.Bus.trigger('drag', performance);
          Pard.Bus.trigger('dragPermanents', artistShows());
        },
        stop:function(event, ui){
          _card.removeClass('cursor_move').addClass('cursor_grab');
          _card.css({'opacity': '1'});
          Pard.Bus.trigger('stop');
          if(ui.helper.data('dropped') == false){
            Pard.Backend.deletePerformances(_sendForm(artistShows()), function(data){
              Pard.Bus.trigger(data.event, data.model);
            });
          }
        }
      });
        
      var fillCard = function(performance){
        var color = Pard.Widgets.CategoryColor(performance.participant_category);
        _card.css({
          'position': 'absolute',
          'display': 'inline-block',
          'width': Pard.ColumnWidth - 2,
          'height': Pard.PermanentCardHeight,
          'background': color,
          'white-space': 'normal',
          'box-shadow': 'inset 0 0 1px '
        });
        
        var _titleTextLong = performance.participant_name + ' - ' + performance.title;
        _titleText.text(Pard.Widgets.CutString(_titleTextLong, 35));
        _commentIconContainer.empty();
        _confirmationCheckContainer.empty();
        if (performance.confirmed == 'true' || performance.confirmed == true) _confirmationCheckContainer.append(Pard.Widgets.IconManager('done').render());
        if (performance.comments) _commentIconContainer.append(Pard.Widgets.IconManager('comments').render());
      }
      
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

      var managerBox = function(check){
        var performanceBox = $('<div>').addClass('noselect');
        var performanceContainer = $('<div>').css('height', 40);
        var daySelectorContainer = $('<div>').css({'display': ' inline-block', 'width': '120'}).addClass('noselect');
        var daySelector;
        var spaceSelector = $('<select>');
        var startTime;
        var endTime;
        var removeInputButton = $('<span>').addClass('material-icons add-multimedia-input-button-delete').html('&#xE888');
        var commentsContainer = $('<div>');
        var comments = $('<textarea>').attr({placeholder: 'Comentarios:'});

        var confirmedContainer = $('<div>').css('height', 20);
        var input = $('<input />').attr({type: 'checkbox'});
        var label = $('<label>').html('Confirmado');
        var confirmed = $('<div>').append(input, label);

        var spaceSelectorContainer = $('<div>').css({'display': ' inline-block', 'width': '250'}).append(spaceSelector).addClass('noselect');
        var startTimeContainer = $('<div>').css({'display': ' inline-block', 'width': '80'}).addClass('noselect');
        var endTimeContainer = $('<div>').css({'display': ' inline-block', 'width': '80'}).addClass('noselect');
        confirmed.css('margin-left', 430);
        label.css('display','inline');
        comments.css('width', 530);

        confirmedContainer.append(confirmed);
        commentsContainer.append(comments);
        performanceContainer.append(daySelectorContainer, spaceSelectorContainer, startTimeContainer, endTimeContainer, removeInputButton);
        performanceBox.append(confirmedContainer, performanceContainer, commentsContainer);

        Object.keys(the_event.spaces).forEach(function(profile_id){
          var space = the_event.spaces[profile_id].space;
          var spaceOption = $('<option>').val(profile_id).text(space.name);
          spaceSelector.append(spaceOption);
        });

        var _changeDate = function(new_start, new_end){
          var dateArray = performance.date.split('-');
          var start = new Date(new_start);
          var end = new Date(new_end);

          start.setUTCFullYear(parseInt(dateArray[0]));
          end.setUTCFullYear(parseInt(dateArray[0]));

          start.setUTCMonth(parseInt(dateArray[1] - 1));
          end.setUTCMonth(parseInt(dateArray[1] - 1));

          start.setUTCDate(parseInt(dateArray[2]));
          end.setUTCDate(parseInt(dateArray[2]));

          performance.time[0] = start.getTime();
          performance.time[1] = end.getTime();
          console.log(moment(performance.time[0]).locale('es').format('DD-MM-YYYY'));
          console.log(moment(performance.time[1]).locale('es').format('DD-MM-YYYY'));
          setStartTimes();
          setEndTimes();
        }

        daySelector = $('<select>');
        daySelectorContainer.append(daySelector);
        daySelector.select2({
          dropdownCssClass: 'orfheoTableSelector'
        }).on('select2:select', function(){
          performance.date = daySelector.val();
          _changeDate(performance.time[0], performance.time[1]);
          Pard.Backend.modifyPerformances(_sendForm([performance]), function(data){
            Pard.Bus.trigger(data.event, data.model);
            if(check) checkConflicts(performance);
          });
        });

        daySelector.on('reload', function(e, date){
          daySelector.empty();
          daySelector.select2("enable");
          var artistProgram = the_event.artists[performance.participant_id].program;
          var shows = Object.keys(artistProgram).map(function(performance_id){
            return artistProgram[performance_id].show;
          });
          shows = shows.filter(function(show){
            return (show.permanent == 'true' && show.participant_proposal_id == performance.participant_proposal_id);
          });
          var dates = shows.map(function(show){
            return show.date;
          });

          if($.inArray(date, dates) >= 0) dates.splice(dates.indexOf(date), 1);
          Object.keys(eventTime).forEach(function(day){
            if(day == 'permanent') return false;
            if($.inArray(day, dates) < 0 || day == performance.date){
              var _textDay = moment(new Date(day)).locale('es').format('DD-MM-YYYY');
              var date = $('<option>').val(day).text(_textDay);
              daySelector.append(date);
            }
          });
          daySelector.val(performance.date).trigger('change');
          if(daySelector.children().length <= 1) {
            daySelector.select2("enable",false)
          }
        });

        var _spaceSelect = function(host_id){
          the_event.spaces[performance.host_id].deletePerformance(performance);
          performance.host_id = host_id;
          the_event.spaces[host_id].addSpaceInfo(performance);
        }

        spaceSelector.select2({
          dropdownCssClass: 'orfheoTableSelector'
        })
          .on('select2:select', function(){
            _spaceSelect(spaceSelector.val());
          });

        var setStartTimes = function(){
          startTimeContainer.empty();
          startTime = $('<select>');
          startTimeContainer.append(startTime);
          var dayStart = new Date(parseInt(eventTime[performance.date][0]));
          var maxStart = new Date(parseInt(eventTime[performance.date][1]));
          maxStart.setMinutes(maxStart.getMinutes() - 15);
          var _startOptions = [];
          while(dayStart <= maxStart){
            _startOptions.push({
              id: moment(dayStart).locale('es').format('HH:mm'), 
              text: moment(dayStart).locale('es').format('HH:mm'),
              time:  dayStart.getTime()
            })
            dayStart.setMinutes(dayStart.getMinutes() + 15);
          };
          startTime.select2({
            data: _startOptions,
            dropdownCssClass: 'orfheoTableSelector'
          })
            .on('select2:select', function(){
              performance.time[0] = parseInt(startTime.select2('data')[0].time);
              if (performance.time[0] >= performance.time[1]) {
                performance.time[1] = performance.time[0] + 15 * 60000;
                endTime.val(moment(parseInt(performance.time[1])).locale('es').format('HH:mm'))
                  .trigger('change');
              }
            });

          startTime.on('reload', function(){
            performance.time[0] = parseInt(startTime.select2('data')[0].time);
            startTime.val(moment(performance.time[0]).locale('es').format('HH:mm')).trigger('change');
            if (performance.time[0] >= performance.time[1]) {
              performance.time[1] = performance.time[0] + 15 * 60000;
              endTime.val(moment(parseInt(performance.time[1])).locale('es').format('HH:mm'))
                .trigger('change');
            }
          });
          startTime.val(moment(performance.time[0]).locale('es').format('HH:mm')).trigger('change');
        }

        var setEndTimes = function(){
          endTimeContainer.empty();
          endTime = $('<select>');
          endTimeContainer.append(endTime);
          var dayEnd = new Date(parseInt(eventTime[performance.date][1]));
          var minEnd = new Date(parseInt(eventTime[performance.date][0] + 15 * 60000));
          var _endOptions = [];
          while(minEnd <= dayEnd){
            _endOptions.push({
              time: minEnd.getTime(), 
              id: moment(minEnd).locale('ese').format('HH:mm'),
              text: moment(minEnd).locale('ese').format('HH:mm')
            });
            minEnd.setMinutes(minEnd.getMinutes() + 15);
          };
          endTime.select2({
            data: _endOptions,
            dropdownCssClass: 'orfheoTableSelector'
          })
            .on('select2:select', function(){
              performance.time[1] = parseInt(endTime.select2('data')[0].time);
              if (performance.time[1] <= performance.time[0]) {
                performance.time[0] = performance.time[1] - 15 * 60000;
                startTime.val(moment(parseInt(performance.time[0])).locale('es').format('HH:mm'))
                  .trigger('change');
              }
            });

          endTime.on('reload', function(){
            performance.time[1] = parseInt(endTime.select2('data')[0].time);
            endTime.val(moment(performance.time[1]).locale('es').format('HH:mm')).trigger('change');
            if (performance.time[1] <= performance.time[0]) {
              performance.time[0] = performance.time[1] - 15 * 60000;
              startTime.val(moment(parseInt(performance.time[0])).locale('es').format('HH:mm'))
                .trigger('change');
            }
          });
          endTime.val(moment(parseInt(performance.time[1])).locale('es').format('HH:mm')).trigger('change');
        }

        removeInputButton.on('click', function(){
          performanceBox.remove();
        });

        input.on('change', function(){
          performance.confirmed = input.is(":checked");
          if (performance.confirmed) _card.find('.checker').append(Pard.Widgets.IconManager('done').render());
          else _card.find('.checker').empty();
        });

        comments.on('change', function(){
          performance.comments = comments.val();
          _card.find('.commentIcon').empty();
          if (performance.comments) _card.find('.commentIcon').append(Pard.Widgets.IconManager('comments').render());
          Pard.Backend.modifyPerformances(_sendForm([performance]), function(data){
            Pard.Bus.trigger(data.event, data.model);
          });
        });

        var _endTimeCallback = function(){};
        daySelector.trigger('reload');
        daySelector.val(performance.date).trigger('change');
        spaceSelector.val(performance.host_id).trigger('change');
        setStartTimes();
        setEndTimes();
        comments.val(performance.comments);

        if (performance.confirmed == 'true') performance.confirmed = true;
        if (performance.confirmed == 'false') performance.confirmed = false;
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
          },
          daySelector: daySelector,
          spaceSelector: spaceSelector,
          spaceSelect: _spaceSelect,
          input: input,
          startTime: startTime,
          endTime: endTime, 
          removeInputButton: removeInputButton,
          setEndTimeCallback: function(endTimeCallback){
            _endTimeCallback = endTimeCallback;
          }
        }
      }

      var PermanentManager = function(check, multiple){
        var performancesBox = $('<div>').css({'padding': '0'}).addClass('noselect');
        var _all = $('<button>')
          .append(Pard.Widgets.IconManager('chained').render())
          .attr({'type':'button', 'title':'Encadena los cambios'})
          .addClass('chain-unchain-button')
          .tooltip({tooltipClass: 'orfheo-tooltip', show:{delay:800}, position:{collision:'fit', my: 'left top+5px'}});
        var _managers = {};
        _managers.chained = false;
        _managers.collection = {};
        _all.click(function(){
          if (_managers.chained) {
            _managers.chained = false;
            _all.empty()
              .append(Pard.Widgets.IconManager('chained').render())  
              .tooltip('destroy')
              .attr({'title':'Encadena los cambios'})
              .tooltip({tooltipClass: 'orfheo-tooltip', show:{delay:800}, position:{collision:'fit', my: 'left top+5px'}});
            $('.chain').hide();
          }
          else {
            _managers.chained = true;
            _all.empty()
              .append(Pard.Widgets.IconManager('unchained').render())
              .tooltip('destroy')
              .attr({'title':'Desencadena los cambios'})
              .tooltip({tooltipClass: 'orfheo-tooltip', show:{delay:800}, position:{collision:'fit', my: 'left top+5px'}});
            $('.chain').show();
          }
        });
        var _artistShows = [performance];
        if (multiple){
          performancesBox.css({'margin-top':'1.5rem'});
          performancesBox.append(_all);
         _artistShows = Pard.Widgets.ReorderProgramCrono(artistShows());
        }
        _artistShows.forEach(function(show, index){
          var _manager = the_event.program[show.performance_id].managerBox(check);
          _managers.collection[show.performance_id] = {manager: _manager};

          _manager.daySelector.on('select2:select',function(e, state){
            for (var id in _managers.collection){
              var manager = _managers.collection[id].manager;
              if (_manager != manager){
                manager.daySelector.trigger('reload');
              }
            }
            var _newOrder = Pard.Widgets.ReorderProgramCrono(artistShows());
            _newOrder.forEach(function(show){
              performancesBox.append(_managers.collection[show.performance_id].manager.render());
              performancesBox.append(_managers.collection[show.performance_id].chainIcon);
            });
          });

          _manager.spaceSelector.on('select2:select',function(e, state){
            var shows = [show];
            if (!(state) && _managers.chained){
              var val = _manager.spaceSelector.val();
              for (var id in _managers.collection){
                var manager = _managers.collection[id].manager;
                if (_manager != manager){
                  manager.spaceSelector.val(val)
                    .trigger('change');
                  manager.spaceSelect(val);
                  var _show = the_event.program[id].show;
                  shows.push(_show);
                }
              }
            }
            Pard.Backend.modifyPerformances(_sendForm(shows), function(data){
              Pard.Bus.trigger(data.event, data.model);
              var last_show = data.model.slice(-1).pop();
              if(check) checkConflicts(last_show);
            });
          });

          _manager.startTime.on('select2:select',function(e, state){
            var shows = [show];
            if (!(state) && _managers.chained){
              var val = _manager.startTime.val();
              for (var id in _managers.collection){
                var manager = _managers.collection[id].manager;
                if (_manager != manager){
                  manager.startTime.val(val)
                    .trigger('reload');
                  var _show = the_event.program[id].show;
                  shows.push(_show);              
                }
              }
            }
            Pard.Backend.modifyPerformances(_sendForm(shows), function(data){
              Pard.Bus.trigger(data.event, data.model);
              var last_show = data.model.slice(-1).pop();
              if(check) checkConflicts(last_show);
            });
          });

          _manager.endTime.on('select2:select',function(e, state){
            var shows = [show];
            if (!(state) && _managers.chained){
              var val = _manager.endTime.val();
              for (var id in _managers.collection){
                var manager = _managers.collection[id].manager;
                if (_manager != manager){
                  manager.endTime.val(val)
                    .trigger('reload');
                  var _show = the_event.program[id].show;
                  shows.push(_show);
                }
              }
            }
            Pard.Backend.modifyPerformances(_sendForm(shows), function(data){
              Pard.Bus.trigger(data.event, data.model);
              var last_show = data.model.slice(-1).pop();
              if(check) checkConflicts(last_show);
            });
          });

          _manager.input.click(function(){
            artistShows().forEach(function(show, index){
              var _show = the_event.program[show.performance_id].show;
              var manager = the_event.program[show.performance_id].managerBox(check);
              if(multiple) manager = _managers.collection[show.performance_id].manager;
              manager.input.prop("checked", _manager.input.is(":checked"));
              manager.input.trigger('change');
            });
            Pard.Backend.modifyPerformances(_sendForm(artistShows()), function(data){
              Pard.Bus.trigger(data.event, data.model);
            });
          });

          _manager.removeInputButton.click(function(e, state){
            if (!(state) && _managers.chained){
              Pard.Backend.deletePerformances(_sendForm(artistShows()), function(data){
                Pard.Bus.trigger(data.event, data.model);
                performancesBox.remove();
                _closePopup();
              });
            }
            else{
              Pard.Backend.deletePerformances(_sendForm([show]), function(data){
                Pard.Bus.trigger(data.event, data.model);
                _manager.removeInputButton.trigger('click');
                _managers.collection[show.performance_id].chainIcon.remove();
                delete _managers.collection[show.performance_id];
                for (var id in _managers.collection){
                  var manager = _managers.collection[id].manager;
                  if (_manager != manager){
                    manager.daySelector
                    .trigger('reload', [show.date]);
                  }
                }
                if ($.isEmptyObject(_managers.collection)) _closePopup();
              }); 
            }      
          });
          performancesBox.append(_manager.render());
          var _chainIcon = $('<div>').append(Pard.Widgets.IconManager('chained').render().addClass('chain').hide()).addClass('chain-container');
            _managers.collection[show.performance_id].chainIcon = _chainIcon;
          if(index != _artistShows.length -1)
            performancesBox.append(_chainIcon);
        });

        return {
          render: function(){
            return performancesBox;
          },
          setCallback: function(callback){
            _closePopup = function(){
              callback();
            }
          }
        }
      }

      var _destroy = function(){
        _card.remove();
      }

      var _modify = function(show){
        for(var key in show){
          performance[key] = show[key];  
        }
        performance.time[0] = parseInt(performance.time[0]);
        performance.time[1] = parseInt(performance.time[1]);
        fillCard(performance);
      }

      fillCard(performance);

      return {
        show: performance,
        card: _card,
        manager: PermanentManager,
        managerBox: managerBox,
        modify: _modify,
        destroy: _destroy,
        permanentManager: PermanentManager
      }
    }

    var checkConflicts = function(performance_to_check){
      var _conflictPerformances = [];
      var artistProgram = the_event.artists[performance_to_check.participant_id].program;
      var myPerformances = Object.keys(artistProgram).map(function(performance_id){
        return artistProgram[performance_id].show;
      });

      if (myPerformances) myPerformances = Pard.Widgets.ReorderProgramCrono(myPerformances);
      myPerformances.forEach(function(performance, index){
        for(i = myPerformances.indexOf(performance) + 1; i < myPerformances.length; i++){
          if(performance.permanent == 'true'){
            if(myPerformances[i].participant_proposal_id == performance.participant_proposal_id){
              if(myPerformances[i].time[0] < performance.time[1]){
                _conflictPerformances.push(performance.performance_id);
                _conflictPerformances.push(myPerformances[i].performance_id);
              }
            }
          }
          else if(myPerformances[i].participant_proposal_id == performance.participant_proposal_id && myPerformances[i].permanent == 'true'){
            if(myPerformances[i].time[0] < performance.time[1]){
              _conflictPerformances.push(performance.performance_id);
              _conflictPerformances.push(myPerformances[i].performance_id);
            }
          }
          else if(myPerformances[i].permanent == 'false'){
            if(myPerformances[i].time[0] < performance.time[1]){
              _conflictPerformances.push(performance.performance_id);
              _conflictPerformances.push(myPerformances[i].performance_id);
            }
          }
        }
      });

      if($.inArray(performance_to_check.performance_id, _conflictPerformances) >= 0){
        if(_closePopup) _closePopup();
        displayer.close();
        displayer.displayArtistProgram(performance_to_check.participant_id);
      }
    }

    var ToolsDropdownMenu = function(){
      var _menu = $('<ul>').addClass('menu').css({'min-width': '13rem'});

      var _outOfprogramBtn = $('<li>').text('Propuestas sin programación');
      _outOfprogramBtn.on('click', function(){
        _btn.trigger('click');
        var _content = $('<div>').addClass('very-fast reveal full').css('z-index','100');
        _content.empty();
        $('body').append(_content);
        var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', multipleOpened:true});
        var _message = Pard.Widgets.PopupContent('Propuestas fuera del programa', ArtistOutOfProgram());
        _message.setCallback(function(){
          _popup.close();
          setTimeout(function(){
            _content.remove();
          },500);
        });
        _content.append(_message.render());
        _popup.open();
      });

      var _spaceOutOfprogramBtn = $('<li>').text('Espacios sin programación');
      _spaceOutOfprogramBtn.on('click', function(){
        _btn.trigger('click');
        var _content = $('<div>').addClass('very-fast reveal full').css('z-index','100');
        _content.empty();
        $('body').append(_content);
        var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', multipleOpened:true});
        var _message = Pard.Widgets.PopupContent('Espacios fuera del programa', SpaceOutOfProgram());
        _message.setCallback(function(){
          _popup.close();
          setTimeout(function(){
            _content.remove();
          },500);
        });
        _content.append(_message.render());
        _popup.open();
      });

      
      var _orderSpaceBtn = $('<li>').text('Ordena Espacios');
      _orderSpaceBtn.on('click', function(){
        _btn.trigger('click');
        var _content = $('<div>').addClass('very-fast reveal full');
        _content.empty();
        $('body').append(_content);
        var OrderSpaceWidget = OrderSpace();
        var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', multipleOpened:true});
        var _message = Pard.Widgets.PopupContent('Ordena Espacios', OrderSpaceWidget);
        _message.setCallback(function(){
          var _orderSpaceSpinner = new Spinner().spin();
          $('body').append(_orderSpaceSpinner.el);
          order = OrderSpaceWidget.getList();
          Pard.Backend.saveOrder(the_event.event_id, order, function(){
            _spaceSelector.trigger('select2:unselecting');
            _shownSpaces = order;
            _shownSpaces.forEach(function(profile_id, index){
              if(index == _shownSpaces.length - 1) return;
              Object.keys(eventTime).forEach(function(date){
                the_event.spaces[_shownSpaces[index]].columns[date].after(the_event.spaces[_shownSpaces[index + 1]].columns[date]);
              });
            });
            _shownSpaces.forEach(function(profile_id, index){
              the_event.spaces[profile_id].alignPerformances(index);
            });
            _popup.close();
            setTimeout(function(){
              _content.remove();
              _orderSpaceSpinner.stop();
            },500);
          });
        });
        _content.append(_message.render());
        _popup.open();
      });

      var ArtistOutOfProgram = function(){
        var _createdWidget = $('<div>').addClass('artist-out-of-program-popup-content');
        var columns = ['name', 'title', 'subcategory', 'email'];
        var _tableCreated = $('<table>').addClass('table-proposal stripe row-border artist-out-of-program-table').attr({'cellspacing':"0"}).css({
          'margin': '0 auto',
          'width': '100%',
          'clear': 'both',
          'table-layout': 'fixed',
          'word-wrap':'break-word',
        });

        var _thead = $('<thead>');
        var _titleRow = $('<tr>')
        var _tfoot = $('<tfoot>');
        var _titleRowFoot = $('<tr>');
        columns.forEach(function(field){
          var _titleCol = $('<th>').text(Pard.Widgets.Dictionary(field).render());
          var _titleFoot = $('<th>').text(Pard.Widgets.Dictionary(field).render());
          _titleRow.append(_titleCol);
          _titleRowFoot.append(_titleFoot);
        });
        _tableCreated.append(_thead.append(_titleRow));
        _tableCreated.append(_tfoot.append(_titleRowFoot));

        var _tbody = $('<tbody>');
        Object.keys(artists).forEach(function(profile_id){
          var proposals = artists[profile_id].artist.proposals;
          var artistProgram = artists[profile_id].program;
          var program = Object.keys(artistProgram).map(function(performance_id){
            return artistProgram[performance_id];
          });
          var noSelected = proposals.filter(function(proposal){
            return program.every(function(show){
              return show.participant_proposal_id != proposal.proposal_id;
            });
          });
          noSelected.forEach(function(proposal){
            proposal.type = 'artist';
            proposal.subcategory = proposal.subcategory || Pard.Widgets.Dictionary(proposal.category).render();
            var _row = $('<tr>');
            columns.forEach(function(field){
              var _info;
              if (field == 'name') _info = Pard.Widgets.InfoTab[field].info(proposal, displayer);
              else  _info= proposal[field];
              var _col = $('<td>').append(_info);
              _row.append(_col);
              _tbody.append(_row);
            });
          });
        });

        _tableCreated.append(_tbody);
        _createdWidget.append(_tableCreated);

        var _dataTable;
        _dataTable = _tableCreated.DataTable({
          "language":{
            buttons: {
                copyTitle: 'Copia tabla',
                copyKeys: '<i>ctrl</i> o <i>\u2318</i> + <i>C</i> para copiar los datos de la tabla a tu portapapeles. <br><br>Para anular, haz click en este mensaje o pulsa Esc.',
                copySuccess: {
                    _: '<strong>Copiadas %d filas</strong> de datos al portapapeles',
                    1: '<strong>Copiada 1 file</strong> de datos al portapapeles'
                }
            },
            "lengthMenu": " Resultados por página _MENU_",
            "zeroRecords": "Ningún resultado",
            "info": "",
            "infoEmpty": "Ningúna información disponible",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "search": "Busca",
            "search": "_INPUT_",
            "searchPlaceholder": "Busca"
          },
          fixedHeader: {
            header: true
          },
          "columnDefs": [
            { "visible": false, "targets":[3]}
          ],
          "order": [],
          "scrollY": "85vh",
          "bAutoWidth": false,
          "paging": false,
          "scrollCollapse": true,
          aaSorting: [],
          dom: 'Bfrtip',
          buttons: [
            {
              text: Pard.Widgets.IconManager('mailinglist').render().attr('title','Crea y copia lista de correos'),
              className: 'mailinglistBtn mailNoProgram',
              action: function(){
                var columnData = _dataTable.column(3, { search:'applied' }).data().unique();
                var _emailList = '';
                columnData.each(function(email){
                  _emailList += email+', ';
                });
                _emailList = _emailList.substring(0,_emailList.length-2)
                Pard.Widgets.CopyToClipboard(_emailList);
                var _copyPopupContent = $('<div>').append($('<div>').html('<strong>Copiados '+columnData.length+' contactos </strong> de correo al portapapeles'), $('<div>').html('(<strong><i>Ctrl+V</i></strong> para pegar)'));
                Pard.Widgets.CopyPopup('Copia correos', _copyPopupContent);
              }
            }
          ],
          initComplete: function () {
            var _colCategry = this.api().column(2);
            if (_colCategry.data().unique().length>1){
              var _selectContainer = $('<div>').addClass('select-container-datatableColumn');
              var _selectCat = $('<select>').append($('<option>').attr('value','').text(''))
                  .appendTo(_selectContainer.appendTo($(_colCategry.header()).text('Categoría')));  
              _colCategry.data().unique().sort().each( function ( d, j ) {
                  _selectCat.append( '<option value="'+d+'">'+d+'</option>' )
              } );
              _selectCat.on( 'change', function () {
                var val = $.fn.dataTable.util.escapeRegex(
                    _selectCat.val()
                );
                _colCategry.search( val ? '^'+val+'$' : '', true, false ).draw();
              });
              _selectCat.click(function(e){
                e.stopPropagation();
              });
            }
          }
        });

        return {
          render: function(){
            setTimeout(function(){
              $('.mailNoProgram').attr('title','Crea y copia lista de correos'); 
              console.log( $('.mailNoProgram'))
            },500)
            return _createdWidget;
          },
          setCallback: function(callback){
            callback;
          }
        }
      }

      var SpaceOutOfProgram = function(){
        var _createdWidget = $('<div>').addClass('artist-out-of-program-popup-content');
        var columns = ['name', 'address', 'subcategory', 'email'];
        var _tableCreated = $('<table>').addClass('table-proposal stripe row-border artist-out-of-program-table').attr({'cellspacing':"0"}).css({
          'margin': '0 auto',
          'width': '100%',
          'clear': 'both',
          'table-layout': 'fixed',
          'word-wrap':'break-word',
        });

        var _thead = $('<thead>');
        var _titleRow = $('<tr>')
        var _tfoot = $('<tfoot>');
        var _titleRowFoot = $('<tr>');
        columns.forEach(function(field){
          var _titleCol = $('<th>').text(Pard.Widgets.Dictionary(field).render());
          var _titleFoot = $('<th>').text(Pard.Widgets.Dictionary(field).render());
          _titleRow.append(_titleCol);
          _titleRowFoot.append(_titleFoot);
        });
        _tableCreated.append(_thead.append(_titleRow));
        _tableCreated.append(_tfoot.append(_titleRowFoot));

        var _tbody = $('<tbody>');
        Object.keys(spaces).forEach(function(profile_id){
          var spaceProgram = spaces[profile_id].program;
          var noSelected = [];
          if(Object.keys(spaceProgram).length == 0) noSelected.push(spaces[profile_id].space);
            
          noSelected.forEach(function(proposal){
            proposal.type = 'space';
            proposal.subcategory = proposal.subcategory || Pard.Widgets.Dictionary(proposal.category).render();
            var _row = $('<tr>');
            columns.forEach(function(field){
              var _info;
              if (field == 'name' || field == 'address') _info = Pard.Widgets.InfoTab[field].info(proposal, displayer);
              else  _info= proposal[field];
              var _col = $('<td>').append(_info);
              _row.append(_col);
              _tbody.append(_row);
            });
          });
        });

        _tableCreated.append(_tbody);
        _createdWidget.append(_tableCreated);

        var _dataTable;
        _dataTable = _tableCreated.DataTable({
          "language":{
            buttons: {
                copyTitle: 'Copia tabla',
                copyKeys: '<i>ctrl</i> o <i>\u2318</i> + <i>C</i> para copiar los datos de la tabla a tu portapapeles. <br><br>Para anular, haz click en este mensaje o pulsa Esc.',
                copySuccess: {
                    _: '<strong>Copiadas %d filas</strong> de datos al portapapeles',
                    1: '<strong>Copiada 1 file</strong> de datos al portapapeles'
                }
            },
            "lengthMenu": " Resultados por página _MENU_",
            "zeroRecords": "Ningún resultado",
            "info": "",
            "infoEmpty": "Ningúna información disponible",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "search": "Busca",
            "search": "_INPUT_",
            "searchPlaceholder": "Busca"
          },
          fixedHeader: {
            header: true
          },
          "columnDefs": [
            { "visible": false, "targets":[3]}
          ],
          "order": [],
          "scrollY": "85vh",
          "bAutoWidth": false,
          "paging": false,
          "scrollCollapse": true,
          aaSorting: [],
          dom: 'Bfrtip',
          buttons: [
            {
              text: Pard.Widgets.IconManager('mailinglist').render(),
              className: 'mailinglistBtn mailNoProgram',
              action: function(){
                var columnData = _dataTable.column(3, { search:'applied' }).data().unique();
                var _emailList = '';
                columnData.each(function(email){
                  _emailList += email+', ';
                });
                _emailList = _emailList.substring(0,_emailList.length-2)
                Pard.Widgets.CopyToClipboard(_emailList);
                var _copyPopupContent = $('<div>').append($('<div>').html('<strong>Copiados '+columnData.length+' contactos </strong> de correo al portapapeles'), $('<div>').html('(<strong><i>Ctrl+V</i></strong> para pegar)'));
                Pard.Widgets.CopyPopup('Copia correos', _copyPopupContent);
              }
            }
          ],
          initComplete: function () {
            var _colCategry = this.api().column(2);
            if (_colCategry.data().unique().length>1){
              var _selectContainer = $('<div>').addClass('select-container-datatableColumn');
              var _selectCat = $('<select>').append($('<option>').attr('value','').text(''))
                  .appendTo(_selectContainer.appendTo($(_colCategry.header()).text('Categoría')));  
              _colCategry.data().unique().sort().each( function ( d, j ) {
                  _selectCat.append( '<option value="'+d+'">'+d+'</option>' )
              } );
              _selectCat.on( 'change', function () {
                var val = $.fn.dataTable.util.escapeRegex(
                    _selectCat.val()
                );
                _colCategry.search( val ? '^'+val+'$' : '', true, false ).draw();
              });
              _selectCat.click(function(e){
                e.stopPropagation();
              });
            }
          }
        });

        return {
          render: function(){
            setTimeout(function(){
              $('.mailNoProgram').attr('title','Crea y copia lista de correos'); 
            },500)
            return _createdWidget;
          },
          setCallback: function(callback){
            callback;
          }
        }
      }

      var OrderSpace = function(spaceSelector){
        var _createdWidget = $('<div>');

        var _listSortable = $('<ul>');
        var _orderButtonsContainer = $('<div>').addClass('order-buttons-container');
        var _orderText = $('<span>').text('Ordena por:');

        _listSortable.sortable({
          cursor: "move",
          update: function(){
            order = _listSortable.sortable('toArray');
            order.forEach(function(space_id, index){
              _spaceCards[space_id].index(index);
            });
          }
        });
        _listSortable.disableSelection();

        var _spaceCards = {}

        var _printSpaceCard = function(space, index){
          var _order = index + 1;
          var _spaceCard = $('<li>').text(_order + '. ' + space.name)
          .addClass('ui-state-default sortable-space-card cursor_grab')
          .css('background', _dictionaryColor[space.subcategory])
          .attr('id', space.profile_id)
          .mousedown(function(){
            _spaceCard.removeClass('cursor_grab').addClass('cursor_move');
          })
          .mouseup(function(){
            _spaceCard.removeClass('cursor_move').addClass('cursor_grab');
          });
          return {
            render: function(){
              return _spaceCard;
            },
            index: function(index){
              _spaceCard.text((index + 1) + '. ' + space.name);
            }
          }
        }

        var spaces = order.map(function(profile_id){
          return the_event.spaces[profile_id].space;
        });

        var _dictionaryColor = Pard.Widgets.DictionaryColor(the_event);
        var _catArrays = {};

        spaces.forEach(function(space, index){
          var _spaceCard = _printSpaceCard(space, index);
          _spaceCards[space.profile_id] = _spaceCard;
          _listSortable.append(_spaceCard.render());
          if (!(_catArrays[space.subcategory])) _catArrays[space.subcategory] = [space];
          else _catArrays[space.subcategory].push(space);
        });

        var _alphaBtn = Pard.Widgets.Button('A --> Z', function(){
          _listSortable.empty();
          spaces.sort(function(s1, s2){
            return s1.name.localeCompare(s2.name);
          });
          spaces.forEach(function(space, index){
            _spaceCards[space.profile_id].index(index);
            _listSortable.append(_spaceCards[space.profile_id].render());
          });
        });

        var _catOrderBtn = Pard.Widgets.Button('Categoría', function(){
          _listSortable.empty();
          spaces = [];
          for (var cat in _catArrays){
            spaces = spaces.concat(_catArrays[cat]);
          }
          spaces.forEach(function(space, index){
            _spaceCards[space.profile_id].index(index);
            _listSortable.append(_spaceCards[space.profile_id].render());
          });
        });

        _orderButtonsContainer.append(_orderText, _alphaBtn.render(), _catOrderBtn.render());
        _createdWidget.append(_orderButtonsContainer, _listSortable);

        return {
          render: function(){
            return _createdWidget;
          },
          getList: function(){
            return _listSortable.sortable('toArray');
          },
          setCallback: function(callback){
            _closePopup = callback
          }
        }
      }

      var _publishProgramCallback =  {
        publish: function(data){
          if(data['status'] == 'success') {
            var _mex = $('<div>').html('El programa se ha publicado correctamente en la página de tu evento');
            Pard.Widgets.TimeOutAlert('',_mex);
          }
          else{
            console.log('error');
            Pard.Widgets.Alert('¡Error!', 'No se ha podido ejecutar la acción', function(){location.reload();});
          }
        },
        unpublish: function(data){
          if(data['status'] == 'success') {
            var _mex = $('<div>').html('El programa se ha retirado de la página de tu evento');
            Pard.Widgets.TimeOutAlert('',_mex);
          }
          else{
            console.log('error');
            Pard.Widgets.Alert('¡Error!', 'No se ha podido ejecutar la acción', function(){location.reload();});
          }
        }
      }

      var _publishedBtn = $('<li>');
      var _rgb = Pard.Widgets.IconColor(the_event.color).rgb();
      var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
      var _publishStatus;
      var _setPublishStatus = function(){
        if(the_event.published == true || the_event.published == 'true'){
          _publishStatus = 'unpublish';
          _publishedBtn.text('Retira el programa');
          $('main').css({'background': _backColor});
        }
        else{         
          _publishStatus = 'publish';
          _publishedBtn.text('Publica el programa');
          $('main').css('background','#f6f6f6');
        }
      }
      _setPublishStatus();

      Pard.Bus.on('publishEvent', function(status){
        if(the_event.published != status){
          the_event.published = status;
         _setPublishStatus();
        }
      });

      _publishedBtn.on('click', function(){
        _btn.trigger('click');
        Pard.Backend.publish(the_event.event_id, _publishProgramCallback[_publishStatus]);
      });

      _menu.append(_outOfprogramBtn, _spaceOutOfprogramBtn, _orderSpaceBtn, _publishedBtn);
      var _menuContainer = $('<ul>').addClass('dropdown menu tools-btn').attr({'data-dropdown-menu':true, 'data-disable-hover':true,'data-click-open':true});
      var _btn = $('<button>')
        .attr({'type':'button', 'title':'Menu de herramientas'})
        .append(
          Pard.Widgets.IconManager('tools').render()
        );
      var _iconDropdownMenu = $('<li>').append(
        _btn
        ,_menu
      );
      _menuContainer.append(_iconDropdownMenu);

      return {
        render: function(){
          return _menuContainer;
        }
      }
    }

    var _addAccordion = function(profile_id){
      _artistsList.append(artists[profile_id].accordion);
      var accordionNav = artists[profile_id].accordion.find('.accordion-item');
      var content = artists[profile_id].accordion.find('.accordion-content');
      accordionNav.on('click', function(){
        content.slideToggle();
        if(lastArtist != content){
          content.addClass('is-active');
          $('.selected-accordionItem').removeClass('selected-accordionItem');
          accordionNav.addClass('selected-accordionItem');
          if(lastArtist && lastArtist.hasClass('is-active')){
            lastArtist.slideToggle();
            lastArtist.removeClass('is-active');
          }
        }
        else{
          content.removeClass('is-active');
          $('.selected-accordionItem').removeClass('selected-accordionItem');
        }
        lastArtist = content;
      });
    }

    _artistsBlock.append(_artistSelectorContainer, _artistsListContainer);
    Object.keys(artists).forEach(function(profile_id){
      _addAccordion(profile_id);      
      artists[profile_id].setDay(_daySelector.val());
    });

    Object.keys(the_event.spaces).forEach(function(profile_id, index){
      Object.keys(eventTime).forEach(function(day){
        var height = _tables[day].height() - 42;
        the_event.spaces[profile_id].addColumn(day, height, eventTime[day]);
        _tables[day].append(the_event.spaces[profile_id].columns[day]);
      });
      order.push(profile_id);
      _shownSpaces.push(profile_id);
    });

    Object.keys(_tables).forEach(function(day){
      _tables[day].append(_emptySpaces[day]);
    });
    
    if(_shownSpaces.length > 0 && _shownSpaces.length <= 4){
        Pard.ColumnWidth = Pard.ColumnWidth * 4 / _shownSpaces.length;
        _linesLength = Pard.ColumnWidth * _shownSpaces.length + 6;
      }
    _lines.forEach(function(line){
      line.css('width', _linesLength);
    });
    Object.keys(the_event.spaces).forEach(function(space, index){
      the_event.spaces[space].alignPerformances(index);
    });
   
    if(the_event.program){
      the_event.program.forEach(function(performance){
        if (performance.participant_id.indexOf('-own') > 0) performance.participant_id = performance.participant_id.substring(0 , performance.participant_id.indexOf('-own'));
        if (performance.host_id.indexOf('-own') > 0) performance.host_id = performance.host_id.substring(0 , performance.host_id.indexOf('-own'));
        if(performance.permanent == 'true') _program[performance.performance_id] = new PermanentPerformance(performance);
        else _program[performance.performance_id] = new Performance(performance);
      });
    }

    the_event.program = _program;
    Object.keys(_program).forEach(function(performance_id){
      save(_program[performance_id].show);
    });

    var _managerView = $('<div>');
    var _viewSelected = _managerView;
    var _tableView = $('<div>').hide();
    var _programTable ;
    $(document).ready(function(){
      var infoProgram = Pard.Widgets.ProgramTableInfo(the_event, displayer);
      _programTable = Pard.Widgets.ProgramTable(infoProgram, the_event);
      _tableView.append(_programTable.render);
    })
    var _switcher = $('<div>')
    var _viewSelector = $('<select>');
    var _viewSelectorContainer = $('<div>').addClass('switcherContainer-callPage noselect').append(_viewSelector);
    _switcher.append(_viewSelectorContainer).css('margin-bottom', '0.5rem');
    var _viewTags = [{id:'manager', text:'Herramienta de gestión', view:_managerView},{id:'table',text:'Tabla', view:_tableView}];
    _viewSelector.select2({
      data: _viewTags,
      minimumResultsForSearch: Infinity,
      dropdownCssClass: 'orfheoTableSelector'
    })
    .on('select2:select', function(){
      _viewSelected.hide();
      _viewSelected = _viewSelector.select2('data')[0].view.show();
    });

    _toolsContainer.append(ToolsDropdownMenu().render());
    _tableBox.append(_timeTableContainer, _tableContainer, _artistsBlock);
    _managerView.append( _selectors.append(_daySelectorContainer, _spaceSelectorContainer,  _showArtists));
    _managerView.append(_tableBox);
    var _innerBtnContainer = $('<div>').append(_toolsContainer,_submitBtnContainer).addClass('innerBtnContainer-programManager');
    _buttonsContainer.append(_innerBtnContainer);
    _createdWidget.append(_switcher,_buttonsContainer, _managerView, _tableView)


  	return {
      render: function(){
        return _createdWidget;
      },
      addArtist: function(artist){
        if(the_event.artists[artist.profile_id].artist.proposals.length == 1){
          _addAccordion(artist.profile_id);
          artists[artist.profile_id].accordion.foundation();
        }
        var _id = _artistSelector.val();
        _loadArtistSelector();
        _artistSelector.trigger('reload', [_id]);
        the_event.artists[artist.profile_id].setDay(_daySelector.val());
      },
      addSpace: function(space){
        Object.keys(eventTime).forEach(function(day){
          var height = _tables[day].height() - 42;
          the_event.spaces[space.profile_id].addColumn(day, height, eventTime[day]);
          _emptySpaces[day].before(the_event.spaces[space.profile_id].columns[day]);
          the_event.spaces[space.profile_id].columns[day].foundation();
        });
        order.push(space.profile_id);
        var _id = _spaceSelector.val();
        _loadSpaceSelector();
        _spaceSelector.trigger('reload', [_id]);
      },
      deleteArtist: function(artist){
        var _performancesToDelete = [];
        var artistProgram = the_event.artists[artist.profile_id].program;
        Object.keys(artistProgram).forEach(function(performance_id){
          if(artistProgram[performance_id].show.participant_proposal_id == artist.proposal_id) {
            destroy(artistProgram[performance_id].show, true);
            _performancesToDelete.push(performance_id);
          }
        });
        var _id = _artistSelector.val();
        _loadArtistSelector();
        _artistSelector.trigger('reload', [_id]);
        _programTable.deleteArtist(_performancesToDelete);
      },
      deleteSpace: function(space){
        var _performancesToDelete = [];
        var spaceProgram = the_event.spaces[space.profile_id].program;
        Object.keys(spaceProgram).forEach(function(performance_id){
          if(spaceProgram[performance_id].show.host_id == space.profile_id){
            destroy(spaceProgram[performance_id].show);
            _performancesToDelete.push(performance_id);
          }
        });
        order.splice(order.indexOf(space.profile_id), 1);
        var _id = _spaceSelector.val();
        _loadSpaceSelector();
        _spaceSelector.trigger('reload', [_id]);
        _programTable.deleteSpace(_performancesToDelete);
      },
      modifyArtist: function(artist){
        var _performancesToModify = [];
        var artistProgram = the_event.artists[artist.profile_id].program;
        Object.keys(artistProgram).forEach(function(performance_id){
          modify(artistProgram[performance_id].show, true);
          _performancesToModify.push(performance_id);
        });
        var _id = _artistSelector.val();
        _loadArtistSelector();
        _artistSelector.trigger('reload', [_id]);
        the_event.artists[artist.profile_id].setDay(_daySelector.val());
        _programTable.modifyArtist(_performancesToModify);
      },
      modifySpace: function(space){
        var _performancesToModify = [];
        var spaceProgram = the_event.spaces[space.profile_id].program;
        Object.keys(spaceProgram).forEach(function(performance_id){
          modify(spaceProgram[performance_id].show, true);
          _performancesToModify.push(performance_id);
        });
        var _id = _spaceSelector.val();
        _loadSpaceSelector();
        _spaceSelector.trigger('reload', [_id]);
        _programTable.modifySpace(_performancesToModify);
      }
    }
  }
}(Pard || {}));
