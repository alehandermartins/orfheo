'use strict';

(function(ns){

  ns.Space = function(space, displayer){
    var columns = {};
    var _columns = {};
    var program = {};
    var _performance;
    var last_host;
    var index;

    Pard.Bus.on('drag', function(performance){
      _performance = performance;
    });

    var SpaceColumn = function(day, height, dayTime){
      var _spaceCol = $('<div>').addClass('spaceCol');
      _spaceCol.css({
        'display': 'inline-block',
        'width': '11rem',
        'border-style': 'solid',
        'border-width': '1px',
        'border-color': 'black'
      });

      var _spaceHeader = $('<div>').addClass('spaceHeader space-column-header cursor_grab');
      var _icon = SpaceDropdownMenu().render();
      var _menuIcon = $('<div>').append(_icon);
      _menuIcon.css({
        'display': 'inline-block',
        'vertical-align': 'middle',
      });
      _spaceCol.append(_menuIcon);

      var _spacename = $('<div>');
      _spacename.addClass('space-name-container-call-manager');
      var _titleText = $('<a>').attr('href','#/');
      _titleText.text(Pard.Widgets.CutString(space.name, 35));
      _spacename.append($('<p>').addClass('space-name-headerTable-call-manager').append(_titleText));
      _spaceHeader.append(_spacename, _menuIcon);
      _spaceCol.append(_spaceHeader);

      _spaceHeader.mousedown(function(){
        _spaceHeader.removeClass('cursor_grab').addClass('cursor_move');
      });
      _spaceHeader.mouseup(function(){
        _spaceHeader.removeClass('cursor_move').addClass('cursor_grab');
      });

      //Popup showing the space form
      _titleText.on('click', function(){
        displayer.displayProposal(space, 'space');
      });

      var _time = $('<div>').addClass('spaceTime').html('&nbsp').css({
        'height': height
      });

      //Giving background to space if not availabe
      if( day != 'permanent' && $.inArray(day, space.availability) < 0) _spaceCol.addClass('space-not-available-call-manager');
      else{_spaceCol.removeClass('space-not-available-call-manager');}

      _time.droppable({
        accept: function(card){
          if(card.hasClass('proposalCard') || card.hasClass('programHelper')) return true;
        },
        drop: function(event, ui) {
          ui.helper.data('dropped', true);
          var position = ui.helper.position().top;
          var colPosition = _time.position().top;

          //If the element is higher, its height is adjusted to the top of the _time zone
          if(position < colPosition) position = colPosition;

          //Adjusting to time line
          var _offset = (position - colPosition) % 10;
          if(_offset >= 5) position += 10 - _offset;
          if(_offset < 5) position -= _offset;

          //If the card is below the drop zone it adjustes to the low end
          var duration = ui.helper.height();
          if(position + duration > colPosition + _time.height()) position = colPosition + _time.height() - duration;
          if (_performance.host_id) last_host = (' ' + _performance.host_id).slice(1);

          var create = function(performance){
            performance.last_host = last_host;
            performance.host_id = space.profile_id;
            performance.host_proposal_id = space.proposal_id;
            Pard.Backend.createPerformances(space.event_id, [performance], function(data){
              console.log(data.model);
            });
          }

          var createPermanents = function(performance){
            var _startHour = parseInt(dayTime[0].split(':')[0]);
            var _startMin = parseInt(dayTime[0].split(':')[1]);
            var _endHour = parseInt(dayTime[1].split(':')[0]);
            var _endMin = parseInt(dayTime[1].split(':')[1]);

            var _performances = [];
            var myShows = Object.keys(program).map(function(performance_id){
              return program[performance_id].show;
            });
            myShows = myShows.filter(function(show){
              return (show.permanent == 'true' && show.participant_proposal_id == _performance.participant_proposal_id);
            });
            Object.keys(_columns).forEach(function(date){
              if(date == 'permanent') return;
              if(myShows.every(function(show){
                return show.date != date;
              })){
                var show = {}
                for(var key in performance){
                  show[key] = performance[key];
                }
                show.date = date;
                var start = new Date(date.split('-')[0], date.split('-')[1] -1, date.split('-')[2], _startHour, _startMin);
                var end = new Date(date.split('-')[0], date.split('-')[1] -1, date.split('-')[2], _endHour, _endMin);
                show.time = [start.getTime(), end.getTime()];
                show.last_host = last_host;
                show.host_id = space.profile_id;
                show.host_proposal_id = space.proposal_id;
                _performances.push(show);
              }
            });
            Pard.Backend.createPerformances(space.event_id, _performances, function(data){
              console.log(data.model);
            });
          }

          var modifyPermanents = function(performance){
            performance.modifiables.forEach(function(performance_id){
              show = {'performance_id': performance_id, 'host_id': performance.host_id, 'permanent': 'true'}
              modify(show);
            });
            console.log('modifyPermanents')
            Pard.Bus.trigger('ModifyPermanentsTable', performance);
          }

          var modify = function(performance){
            performance.event_id = space.event_id;
            performance.last_host = last_host;
            performance.host_id = space.profile_id;
            performance.host_proposal_id = space.proposal_id;
            Pard.Backend.modifyPerformances(performance, function(data){
              console.log(data.model);
            });
          }

          if(day == 'permanent'){
            _performance.permanent = 'true';
            if(_performance.performance_id) return modifyPermanents(_performance)
            createPermanents(_performance);
          }
          else{
            _performance.permanent = 'false';
            _performance.date = day;
            var start = new Date(parseInt(dayTime[0]));
            start.setMinutes(start.getMinutes() + (position - 41) * 1.5);
            var end = new Date(start.getTime());
            end.setMinutes(start.getMinutes() + duration * 1.5);
            _performance.time = [start.getTime(), end.getTime()];
            if(_performance.performance_id) return modify(_performance);
            create(_performance);
          }
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
          _spaceHeader.removeClass('cursor_grab').addClass('cursor_move');
          //We get the original position of the column, necessary for later calculations
          var originalPosition = $(this).data("uiDraggable").originalPosition;
          var position = ui.position.left;

          if (position > (originalPosition.left + Pard.ColumnWidth / 2)){
            Pard.Bus.trigger('spaceDrag', {'direction': 'right', 'space': space.profile_id});
            $(this).data("uiDraggable").originalPosition = {
              top : originalPosition.top,
              left : originalPosition.left + Pard.ColumnWidth
            }
          }
          if (position < (originalPosition.left - Pard.ColumnWidth / 2)){
            Pard.Bus.trigger('spaceDrag', {'direction': 'left', 'space': space.profile_id});
            $(this).data("uiDraggable").originalPosition = {
              top : originalPosition.top,
              left : originalPosition.left - Pard.ColumnWidth
            }
          }
        },
        stop: function(event, ui){
          _spaceHeader.removeClass('cursor_move').addClass('cursor_grab');
          _spaceHeader.mousedown(function(){
            _spaceHeader.removeClass('cursor_grab').addClass('cursor_move');
          });
          _spaceHeader.mouseup(function(){
            _spaceHeader.removeClass('cursor_move').addClass('cursor_grab');
          });
          _spaceCol.removeClass('ui-sortable-placeholder');
        }
      });

      var _modify = function(space){
        _titleText.text(Pard.Widgets.CutString(space.name, 35));
        if( day != 'permanent' && $.inArray(day, space.availability) < 0) _spaceCol.addClass('space-not-available-call-manager');
        else{_spaceCol.removeClass('space-not-available-call-manager');}
      }

      return {
        render: function(){
          return _spaceCol;
        },
        modify: _modify
      }
    }

    var SpaceDropdownMenu = function(){

      var _menu = $('<ul>').addClass('menu');
      var _profileLink = $('<li>');
      var _profileCaller = $('<a>').attr({
        target: 'blank',
        href: '/profile?id=' + space.profile_id
      }).text('Perfil');

      var _programLink = $('<li>');
      var _programCaller = $('<a>').attr('href','#/').text('Programa');
      _programCaller.on('click', function(){
        displayer.displaySpaceProgram(space.profile_id);
      });

      _profileLink.append(_profileCaller);
      _programLink.append(_programCaller);
      _menu.append(_profileLink, _programLink);
      var _menuContainer = $('<ul>').addClass('dropdown menu').attr({'data-dropdown-menu':true, 'data-disable-hover':true,'data-click-open':true});
      var _iconDropdownMenu = $('<li>').append(
        $('<a>').attr('href','#/').append(
          $('<span>').html('&#xE8EE').addClass('material-icons settings-icon-dropdown-menu')
          )
        ,_menu
      );

      _menuContainer.append(_iconDropdownMenu);

      return {
        render: function(){
          return _menuContainer;
        }
      }
    }

    var AlignPerformances = function(){
      var left = Pard.ColumnWidth * index + 1;
      var shows = Object.keys(program).map(function(performance_id){
        return program[performance_id].show;
      });
      var permanentShows = shows.filter(function(show){
        return show.permanent == 'true';
      });

      var align = function(){
        shows = Pard.Widgets.ReorderProgram(shows);
        if (shows.length == 0) return;
        shows.forEach(function(performance){
          if(shows.permanent == 'true' && spaceProgram[performance_id].participant_id != performance.participant_id) position += Pard.PermanentCardHeight;
        });
        var firstPerformance = shows.shift();
        var showStart = [firstPerformance.time[0]];
        var showEnd = [firstPerformance.time[1]];
        program[firstPerformance.performance_id].card.css({
          'width': Pard.ColumnWidth - 2,
          'left': left,
          'z-index': 0
        });

        shows.forEach(function(show){
          var _cardIndex = 0;
          showEnd.some(function(endTime, index){
            if(show.time[0] >= endTime){
              _cardIndex = index;
              return true;
            }
            _cardIndex = index + 1;
          });
          if(_cardIndex >= showEnd.length) showEnd.push(show.time[1]);
          else{ showEnd[_cardIndex] = show.time[1];}
          program[show.performance_id].card.css({
            'width': (Pard.ColumnWidth - 2) - 10 * _cardIndex,
            'left': left + 10 * _cardIndex,
            'z-index': _cardIndex
          });
        });
      }

      var alignPermanent = function(){
        if (permanentShows.length == 0) return;
        var position = 41;
        var proposal_ids = [];

        permanentShows.forEach(function(show){
          if($.inArray(show.participant_proposal_id, proposal_ids) < 0){
            program[show.performance_id].card.css({
              'width': (Pard.ColumnWidth - 2),
              'left': left,
              'top': position + (proposal_ids.length * Pard.PermanentCardHeight)
            });
            proposal_ids.push(show.participant_proposal_id);
          }
        });
      }
      align();
      alignPermanent();
    }

    var _loadPerformance = function(performance){
      var show = performance.show;
      if(show.permanent == 'false') _columns[show.date].append(performance.card);
      else{
        if(Object.keys(program).every(function(performance_id){
          return program[performance_id].show.permanent == 'false' || program[performance_id].show.participant_proposal_id != show.participant_proposal_id;
        })){
          _columns['permanent'].append(performance.card);
        }
      }      
      program[show.performance_id] = performance;
    }

    return {
      space: space,
      columns: _columns,
      program: program,
      addColumn: function(day, height, dayTime){
        columns[day] = SpaceColumn(day, height, dayTime);
        _columns[day] = columns[day].render();  
      },
      showColumns: function(){
        Object.keys(_columns).forEach(function(date){
          _columns[date].show();
        });
      },
      hideColumns: function(){
        Object.keys(_columns).forEach(function(date){
          _columns[date].hide();
        });
      },
      deleteColumns: function(){
        Object.keys(_columns).forEach(function(date){
          _columns[date].remove();
        });
      },
      modify: function(new_space){
        for(var key in new_space){
          space[key] = new_space[key];
        }
        Object.keys(_columns).forEach(function(date){
          columns[date].modify(space);
        });
      },
      alignPerformances: function(new_index){
        Object.keys(_columns).forEach(function(date){
          _columns[date].css('width', Pard.ColumnWidth);
        });
        if(new_index !== 'undefined') index = new_index;
        AlignPerformances();
      },
      addSpaceInfo: function(performance){
        performance.event_id = space.event_id;
        performance.last_host = last_host;
        performance.host_email = space.email;
        performance.host_name = space.name;
        performance.address = space.address;
        performance.host_category = space.category;
        performance.host_subcategory = space.subcategory;
      },
      addPerformance: function(performance){
        _loadPerformance(performance);
        AlignPerformances();
      },
      deletePerformance: function(show){
        delete program[show.performance_id];
        if(show.permanent == 'true'){
          if(_columns['permanent'].find('.' + show.performance_id).length) {
            _columns['permanent'].find('.' + show.performance_id).detach();
            var myPerformances = Object.keys(program).map(function(performance_id){
              return program[performance_id].show;
            });
            myPerformances.some(function(_show){
              if(_show.permanent == 'true' && _show.participant_proposal_id == show.participant_proposal_id){
                _columns['permanent'].append(program[_show.performance_id].card);
                return _show.permanent == 'true' && _show.participant_proposal_id == show.participant_proposal_id;
              }
            });
          }
        }
        AlignPerformances();
      },
      loadPerformance: _loadPerformance
    }
  }
}(Pard || {}));