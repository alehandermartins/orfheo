'use strict';

(function(ns){

  ns.Widgets.ProgramManager = function(call){
    var _createdWidget = $('<div>').attr('id', 'programPanel').css({'overflow': 'auto'});

    var eventTime = [
      {
        date: '2016-10-15',
        time: [['10:00', '14:00'], ['17:00', '23:00']]
      },
      {
        date: '2016-10-16',
        time: [['10:00', '14:00'], ['17:00', '23:00']]
      }
    ];

    var artists = [];
    var spaces = [];
    var spaceColumns = {};

    call['proposals'].forEach(function(proposal){
      if (proposal.type == 'artist') artists.push(proposal);
      if (proposal.type == 'space') spaces.push(proposal);
    });

    _getProposal = function(proposal_id){
      var result = {};
      call['proposals'].forEach(function(proposal){
        if(proposal.proposal_id == proposal_id) return (result = proposal); 
      });
      return result;
    }

    _getProfileiD = function(proposal_id){
      var profile_id = '';
      call['proposals'].forEach(function(proposal){
        if(proposal.proposal_id == proposal_id) return (profile_id = proposal.profile_id); 
      });
      return profile_id;
    }

    var _tableContainer = $('<div>').addClass('tableContainer').css({
      'overflow-x': 'scroll',
      'overflow-y': 'hidden',
      'width': 176*5,
      'position': 'relative'
    });

    var _table = $('<div>').css({
      'width': 'auto',
      'white-space':'nowrap',
    });

    var _daySelector = $('<select>');
    var _lastSelected = eventTime[0]['date'];
    _daySelector.on('change', function(){
      spaceColumns[_lastSelected].forEach(function(spaceCol){
        spaceCol.hide();
      });
      spaceColumns[_daySelector.val()].forEach(function(spaceCol){
        spaceCol.show();
        _lastSelected = _daySelector.val();
      });
    });

    eventTime.forEach(function(day){
      var date = $('<option>').val(day['date']).text(day['date']); 
      _daySelector.append(date);
      _createdWidget.append(_daySelector);

      _daySelector.css({
        position: "absolute",
        top: 162,
        left: -200,
        width: 120
      });

      spaceColumns[day['date']] = [];

      var start = parseInt(day['time'][0][0].split(':')[0]);
      var lastIndex = day['time'].length - 1;
      var end = parseInt(day['time'][lastIndex][1].split(':')[0]);

      var hours = [];
      for (var i = start; i <= end; i++) {
        hours.push(i);
      }

      hours.forEach(function(hour, hourIndex){
        var _time = $('<div>').html(hour + ':00').css({
          position: "absolute",
          top: 162 + hourIndex * 40 + "px",
          left: -40
        });
        var _line = $('<hr>').css({
          position: "absolute",
          top: 162 + hourIndex * 40 + "px",
          left: -40,
          width: 932
        });
        _createdWidget.append(_time, _line);
      });

      spaces.forEach(function(space){
        var _spaceCol = $('<div>').addClass('spaceCol').attr('id', space.proposal_id).css({
          'display': ' inline-block',
          'width': '11rem',
          'border-width': '1px',
          'border-style': 'solid',
        });
        var _spacename = $('<div>').addClass('spaceName').html(space.name).css({
          'background': '#b5cfd2',
          'padding': '8px',
          'border-color': '#999999',
          'height': '40px',
          'cursor': 'pointer'
        });

        _spaceCol.append(_spacename);

        var _time = $('<div>').addClass('spaceTime').html('&nbsp').css({
          'height': (hours.length - 1) * 40
        });
        _time.droppable({
          accept: function(card){
            if(card.hasClass('proposalCard') || card.hasClass('programHelper')) return true;
          },
          drop: function(event, ui) {

            var position = ui.helper.position().top;
            var colPosition = _time.position().top;

            if(ui.draggable.hasClass('proposalCard')) position -= (_tableContainer.position().top);
            if(position < colPosition) position = colPosition;

            var _offset = (position - colPosition) % 10;
            if(_offset >= 5) position += 10 - _offset;
            if(_offset < 5) position -= _offset;

            var duration = ui.helper.height();
            Pard.Widgets.DraggedProposal['height'] = duration;
            if(position + duration > colPosition + _time.height()) position = colPosition + _time.height() - duration;

            var newEvent = Pard.Widgets.ProgramHelper(Pard.Widgets.DraggedProposal).render();
            _time.append(newEvent);
            newEvent.css({
              position: 'absolute',
              top: position + "px",
              left: _time.position().left + "px",
            });

            newEvent.resizable({
              maxWidth: 174,
              minWidth: 174,
              maxHeight: _time.height() - (position - colPosition),
              grid: 10
            });
          }
        });

        _spaceCol.append(_time);
        

        _spaceCol.draggable({
          containment: '.tableContainer',
          revert: 'invalid',
          axis: 'x',
          handle: '.spaceName',
          helper: function(){ 
            return Pard.Widgets.SpaceHelper(_spaceCol).render();
          },
          start: function(event, ui){
            _spaceCol.addClass('ui-sortable-placeholder');
          },
          drag: function(event, ui){
            var originalPosition = $(this).data("uiDraggable").originalPosition;
            var position = ui.position.left;
            var dayColumns = spaceColumns[day['date']];

            if (position > (originalPosition.left + 88)){
              var index = $.inArray(_spaceCol, dayColumns);
              if(index < dayColumns.length - 1){
                dayColumns[index + 1].after(dayColumns[index]);
                dayColumns[index + 1].find('.programHelper').css({left: dayColumns[index + 1].position().left + 1 + "px"});
                var tempColumn = dayColumns[index + 1];
                dayColumns[index + 1] = dayColumns[index];
                dayColumns[index] = tempColumn;
                $(this).data("uiDraggable").originalPosition = {
                    top : originalPosition.top,
                    left : originalPosition.left + 176
                }
              }
            }
            if (position < (originalPosition.left - 88)){
              var index = $.inArray(_spaceCol, dayColumns);
              if(index > 0){
                dayColumns[index].after(dayColumns[index - 1]);
                dayColumns[index - 1].find('.programHelper').css({left: dayColumns[index - 1].position().left + 1 + "px"});
                var tempColumn = dayColumns[index - 1];
                dayColumns[index - 1] = dayColumns[index];
                dayColumns[index] = tempColumn;
                $(this).data("uiDraggable").originalPosition = {
                    top : originalPosition.top,
                    left : originalPosition.left - 176
                }
              }
            }
          },
          stop:function(event, ui){
            _spaceCol.removeClass('ui-sortable-placeholder');
            _spaceCol.find('.programHelper').css({left: _spaceCol.position().left + 1 + "px"});
          }
        });
        _table.append(_spaceCol.hide());
        spaceColumns[day['date']].push(_spaceCol);
      });
    });
   
    spaceColumns[eventTime[0]['date']].forEach(function(spaceCol){
      spaceCol.show();
    }); 
    _tableContainer.append(_table);
    _createdWidget.append(_tableContainer);

    _proposalsWidget = $('<div>').css({
      'margin-top': '5px',
      'overflow-x': 'scroll',
      'overflow-y': 'hidden',
      'width': 176*5
    });
    _proposalCards = $('<div>').css({
      'width': 'auto',
      'white-space':'nowrap'
    });

    artists.forEach(function(proposal){
      _proposalCards.append(Pard.Widgets.ProposalCard(proposal).render());
    });

    _proposalsWidget.append(_proposalCards);
    _createdWidget.append(_proposalsWidget);

    var _submitBtn = Pard.Widgets.Button('Guarda los cambios', function(){
      var program = [];
      Object.keys(spaceColumns).forEach(function(date){
        spaceColumns[date].forEach(function(spaceCol){
          Object.keys(spaceCol.find('.programHelper')).forEach(function(key){
            if ($.isNumeric(key)){
              var theEvent = spaceCol.find('.programHelper')[key];
              var start = (theEvent.style.top.split('px')[0] - 41);
              var end = start + parseInt(theEvent.style.height.split('px')[0]);
              var performance = {
                participant_id: _getProfileiD(theEvent.id),
                participant_proposal_id: theEvent.id,
                host_id: _getProfileiD(spaceCol.attr('id')),
                host_proposal_id: spaceCol.attr('id'),
                date: date,
                time: [start, end]
              }
              program.push(performance);
            }
          });
        });
      });
      
      Pard.Backend.program(' ', program, function(data){
        console.log(data['status']);
      });
    });
    _createdWidget.append(_submitBtn.render());

    if(call['program']){
      call['program'].forEach(function(performance){
        spaceColumns[performance.date].forEach(function(spaceCol){
          if(spaceCol.attr('id') == performance.host_proposal_id){
            var timeCol = spaceCol.find('.spaceTime');
            var proposal = _getProposal(performance.participant_proposal_id);
            proposal['height'] = performance.time[1] - performance.time[0];
            var newEvent = Pard.Widgets.ProgramHelper(proposal).render();
            timeCol.append(newEvent);
            newEvent.css({
              position: 'absolute',
              top: parseInt(performance.time[0]) + 41 + "px",
              left: spaceColumns[performance.date].indexOf(spaceCol) * 176 + 1 + "px",
            });

            newEvent.resizable({
              maxWidth: 174,
              minWidth: 174,
              maxHeight: timeCol.height() - (performance.time[0]),
              grid: 10
            });
          }
        });
      });
    }

  	return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.DraggedProposal = {};
  ns.Widgets.CategoryColor = function(category){
    var _dictionary = {
      'music': '#3399FF',
      'arts': '#FF62B2',
      'poetry': '#FFFF66',
      'expo': '#66CC00',
      'street_art': '#FF3333',
      'audiovisual': '#C0C0C0',
      'other': '#FF8000',
      'workshop': '#000000'
    }

    return _dictionary[category];
  };

  ns.Widgets.ProposalCard = function(proposal){

    var _card =$('<span>').addClass('proposalCard');
    _card.draggable({
      revert: 'invalid',
      helper: function(){
        return Pard.Widgets.CardHelper(proposal).render();
      },
      snap: '.spaceTime',
      snapMode: 'inner',
      snapTolerance: 5,
      grid: [ 10, 10 ],
      start: function(event, ui){
        Pard.Widgets.DraggedProposal = proposal;
        _card.css({'opacity': '0.4', 'filter': 'alpha(opacity=40)'});
      },
      stop:function(){
        _card.css({'opacity': '1', 'filter': 'alpha(opacity=100)'});
      }
    });

    var color = Pard.Widgets.CategoryColor(proposal.category);
    var _rgb = Pard.Widgets.IconColor(color).rgb();
    _card.css({border: 'solid 3px' + color});
    _card.hover(
      function(){
        $(this).css({
        'box-shadow': '0 0 2px 1px'+ color
        // 'background': 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+'.1'+ ')'
      });
      },
      function(){
        $(this).css({
          'box-shadow': '0px 1px 2px 1px rgba(10, 10, 10, 0.2)'
          // 'background':'white'
        });
      }
    );
    
    var _photoContainer = $('<div>').addClass('photo-container-card');
    _photoContainer.css({background: color});  

    var _circle = $('<div>').addClass('circleProfile position-circleProfile-card').css({background: color});
    var _icon = $('<div>').addClass('icon-profileCircle').html(Pard.Widgets.IconManager(proposal.category).render());
    var _colorIcon = Pard.Widgets.IconColor(color).render();
    _icon.css({color: _colorIcon});
    var _profilename = proposal.name;
    if (_profilename.length>38) _profilename = _profilename.substring(0,35)+'...';
    var _name = $('<div>').addClass('name-profileCard').html(_profilename);

    var _profiletitle = '';
    if (proposal.title) _profiletitle = proposal.title;
    if (_profiletitle.length>24) _profiletitle = _profiletitle.substring(0,21)+'...';
    var _city = $('<div>').addClass('city-profileCard').html(_profiletitle);
    var _category = $('<div>').addClass('category-proposalCard');
    var _categories = '- ';

    if (proposal.category) _categories += Pard.Widgets.Dictionary(proposal.category).render() + ' - ';
    if (_categories.length>26)  _categories = _categories.substring(0,25)+'...';
    _category.html(_categories);
    _circle.append(_icon);

    _card.append(_photoContainer, _circle, _name, _city, _category);
    
    return {
      render: function(){
        return _card;
      }
    }
  }

  ns.Widgets.CardHelper = function(proposal){
    var color = Pard.Widgets.CategoryColor(proposal.category);
    var _card =$('<div>').css({
      'display': 'inline-block',
      'width': '10.9rem',
      'height': (parseInt(proposal.duration)/60 * 40) + 'px',
      'background': color,
      'z-index': 9999
    });

    var _proposalTitle = $('<div>').html(proposal.title);
    _proposalTitle.css({
      'display': 'block',
      'padding-left': '1px',
      'padding-right':'1px',
      'color': 'black',
      'margin-top': (parseInt(proposal.duration)/60 * 40)/3 + 'px',
      'text-align':'center',
      'width':'100%',
      'line-height': '1.3rem',
      'height': (parseInt(proposal.duration)/60 * 40)/3 + 'px'
    });

    _card.append(_proposalTitle);

    return {
      render: function(){
        return _card;
      }
    }
  }

  ns.Widgets.ProgramHelper = function(proposal){
    var color = Pard.Widgets.CategoryColor(proposal.category);
    var _card =$('<div>').addClass('programHelper').attr('id', proposal.proposal_id).css({
      'display': 'inline-block',
      'width': '10.9rem',
      'height': proposal.height + 'px',
      'background': color,
      'z-index': 9999,
    });

    var _proposalTitle = $('<div>').html(proposal.title);
    _proposalTitle.css({
      'display': 'block',
      'padding-left': '1px',
      'padding-right':'1px',
      'color': 'black',
      'margin-top': proposal.height/3 + 'px',
      'text-align':'center',
      'width':'100%',
      'line-height': '1.3rem',
      'height': proposal.height/3 + 'px'
    });

    _card.append(_proposalTitle);

    _card.draggable({
      revert: false,
      helper: 'clone',
      grid: [ 10, 10 ],
      start: function(event, ui){
        Pard.Widgets.DraggedProposal = proposal;
        _card.css({'opacity': '0.4', 'filter': 'alpha(opacity=40)'});
      },
      stop:function(){
        _card.remove();
      }
    });

    return {
      render: function(){
        return _card;
      }
    }
  }

  ns.Widgets.SpaceHelper = function(spaceCol){
    var _spaceCol = spaceCol.clone();

    _spaceCol.find('.programHelper').css({
      top: '-=' + spaceCol.position().top, 
      left: _spaceCol.position().left + "px"
    });

    return {
      render: function(){
        return _spaceCol;
      }
    }
  }
}(Pard || {}));




