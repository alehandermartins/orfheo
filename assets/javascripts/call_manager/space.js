'use strict';

(function(ns){

  ns.Space = function(space, displayer){
    var _columns = {};
    var program = {};
    var _performance;

    Pard.Bus.on('drag', function(performance){
      _performance = performance;
    });

    var SpaceColumn = function(day, height){
      var _spaceCol = $('<div>').addClass('spaceCol');
      _spaceCol.css({
        'display': 'inline-block',
        'width': '11rem',
        'border-style': 'solid',
        'border-width': '1px',
        'border-color': 'black'
      });

      var _spaceHeader = $('<div>').addClass('spaceHeader space-column-header cursor_grab');
      var _icon = SpaceDropdownMenu(space).render();
      var _menuIcon = $('<div>').append(_icon);
      _menuIcon.css({
        'display': 'inline-block',
        'vertical-align': 'middle',
      });
      _spaceCol.append(_menuIcon);

      var _spacename = $('<div>');
      _spacename.addClass('space-name-container-call-manager');
      var _titleText = $('<a>').attr('href','#');
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

          var create = function(performance){
            _addSpaceInfo(performance);
            Pard.Bus.trigger('AddPerformance', performance);
          }

          var modify = function(performance){
            _addSpaceInfo(performance);
            Pard.Bus.trigger('ModifyPerformance', performance);
          }

          if(day == 'permanent'){
            _performance.permanent = 'true';
            if(_performance.performance_id) return modify(_performance)
            create(_performance);
          }
          else{
            _performance.permanent = 'false';
            _performance.date = day;
            _performance.position = position;
            _performance.duration = duration;
            _performance.maxHeight = height - position + 41;
            if(_performance.performance_id) return modify(_performance)
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

          //If the position of the column increases in more than a half of its with we switch columns
          if (position > (originalPosition.left + Pard.ColumnWidth / 2)){
            var index = _shownSpaces.indexOf(space);
            if(index < _shownSpaces.length - 1){
              Object.keys(_columns).forEach(function(date){
                _spaces[_shownSpaces[index + 1].profile_id].columns[date].after(_columns[date]);
                _spaces[_shownSpaces[index + 1].profile_id].columns[date].find('.programHelper').css({left: '-=' + Pard.ColumnWidth + "px"});
                _columns[date].find('.programHelper').css({left: '+=' + Pard.ColumnWidth + "px"});
              });

              var spaceIndex = spaces.indexOf(space);
              var nextSpaceIndex = spaces.indexOf(_shownSpaces[index + 1]);
              spaces.splice(spaceIndex, 1);
              spaces.splice(nextSpaceIndex, 0, space);

              //Repositioning elements in ShownSpaces array
              _shownSpaces.splice(index + 1, 0, _shownSpaces.splice(index, 1)[0]);

              //Recalculatig original position for the stop animation
              $(this).data("uiDraggable").originalPosition = {
                top : originalPosition.top,
                left : originalPosition.left + Pard.ColumnWidth
              }
            }
          }
          //Same as before but with previous column
          if (position < (originalPosition.left - Pard.ColumnWidth / 2)){
            var index = _shownSpaces.indexOf(space);
            if(index > 0){
              Object.keys(_columns).forEach(function(date){
                _columns[date].after(_spaces[_shownSpaces[index - 1].profile_id].columns[date]);
                _spaces[_shownSpaces[index - 1].profile_id].columns[date].find('.programHelper').css({left: '+=' + Pard.ColumnWidth + "px"});
                _columns[date].find('.programHelper').css({left: '-=' + Pard.ColumnWidth + "px"});
              });

              var spaceIndex = spaces.indexOf(space);
              var prevSpaceIndex = spaces.indexOf(_shownSpaces[index - 1]);
              spaces.splice(spaceIndex, 1);
              spaces.splice(prevSpaceIndex, 0, space);

              _shownSpaces.splice(index - 1, 0, _shownSpaces.splice(index, 1)[0]);

              $(this).data("uiDraggable").originalPosition = {
                top : originalPosition.top,
                left : originalPosition.left - Pard.ColumnWidth
              }
            }
          }
        },
        stop:function(event, ui){
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

      return {
        render: function(){
          return _spaceCol;
        }
      }
    }

    var SpaceDropdownMenu = function(space){

      var _menu = $('<ul>').addClass('menu');
      var _profileLink = $('<li>');
      var _profileCaller = $('<a>').attr({
        target: 'blank',
        href: '/profile?id=' + space.profile_id
      }).text('Perfil');

      var _programLink = $('<li>');
      var _programCaller = $('<a>').attr('href','#').text('Programa');
      _programCaller.on('click', function(){
        displayer.displaySpaceProgram(space.profile_id);
      });

      _profileLink.append(_profileCaller);
      _programLink.append(_programCaller);
      _menu.append(_profileLink, _programLink);
      var _menuContainer = $('<ul>').addClass('dropdown menu').attr({'data-dropdown-menu':true, 'data-disable-hover':true,'data-click-open':true});
      var _iconDropdownMenu = $('<li>').append(
        $('<a>').attr('href','#').append(
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

    var AlignPerformances = function(left){
      var performances = Object.keys(program).map(function(performance_id){
        return program[performance_id];
      });
      var permanentPerformances = performances.filter(function(performance){
        return performance.permanent == 'true';
      });

      var align = function(){
        performances = Pard.Widgets.ReorderProgram(performances);
        if (performances.length == 0) return;
        performances.forEach(function(performance){
          if(performances.permanent == 'true' && spaceProgram[performance_id].participant_id != performance.participant_id) position += Pard.PermanentCardHeight;
        });
        var firstPerformance = performances.shift();
        var showStart = [firstPerformance.time[0]];
        var showEnd = [firstPerformance.time[1]];
        program[firstPerformance.performance_id].performanceCard().css({
          'width': Pard.ColumnWidth - 2,
          'left': left,
          'z-index': 0
        });

        performances.forEach(function(performance){
          var _cardIndex = 0;
          showEnd.some(function(endTime, index){
            if(performance.time[0] >= endTime){
              _cardIndex = index;
              return true;
            }
            _cardIndex = index + 1;
          });
          if(_cardIndex >= showEnd.length) showEnd.push(performance.time[1]);
          else{ showEnd[_cardIndex] = performance.time[1];}
          program[performance.performance_id].performanceCard().css({
            'width': (Pard.ColumnWidth - 2) - 10 * _cardIndex,
            'left': left + 10 * _cardIndex,
            'z-index': _cardIndex
          });
        });
      }

      var alignPermanent = function(){
        if (permanentPerformances.length == 0) return;
        var position = 41;
        var proposal_ids = [];

        permanentPerformances.forEach(function(performance){
          if($.inArray(performance.participant_proposal_id, proposal_ids) < 0){
            program[performance.performance_id].performanceCard().css({
              'width': (Pard.ColumnWidth - 2),
              'left': left,
              'top': position + (proposal_ids.length * Pard.PermanentCardHeight)
            });
            proposal_ids.push(performance.participant_proposal_id);
          }
        });
      }
      align();
      alignPermanent();
    }

    var _addSpaceInfo = function(performance){
      performance.host_id = space.profile_id;
      performance.host_proposal_id = space.proposal_id;
      performance.host_name = space.name;
      performance.address = space.address;
      performance.host_category = space.category;
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
      addColumn: function(day, height){
        _columns[day] = SpaceColumn(day, height).render();  
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
      alignPerformances: function(position){
        Object.keys(_columns).forEach(function(date){
          _columns[date].css('width', Pard.ColumnWidth);
        });
        AlignPerformances(position);
      },
      addPerformance: function(performance){
        _loadPerformance(performance);
        AlignPerformances(_columns[performance.show.date].position().left + 1);
      },
      deletePerformance: function(show){
        delete program[show.performance_id];
        if(show.permanent == 'true'){
          if(_columns['permanent'].find('.' + show.performance_id).length) {
            _columns['permanent'].find('.' + show.performance_id).detach();
            var myPerformances = Object.keys(program).map(function(performance_id){
              return program[performance_id];
            });
            myPerformances = myPerformances.filter(function(_performance){
              if(_performance.show.permanent == 'true' && _performance.show.participant_proposal_id == show.participant_proposal_id){
                _columns['permanent'].append(_performance.card);
                return;
              }
            });
          }
        }
        AlignPerformances(_columns[show.date].position().left + 1);
      },
      loadPerformance: _loadPerformance
    }
  }
}(Pard || {}));