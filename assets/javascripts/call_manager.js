'use strict';

(function(ns){

  ns.Widgets.ProgramManager = function(call){
    var _createdWidget = $('<div>').attr('id', 'programPanel').css({'overflow': 'auto'});

    var artists = [];
    var artistCards = [];
    var spaces = [];
    var spaceColumns = [];

    _getProposal = function(proposal_id){
      var result = {};
      call['proposals'].forEach(function(proposal){
        if(proposal.proposal_id == proposal_id) return (result = proposal); 
      });
      return result;
    }

    call['proposals'].forEach(function(proposal){
      if (proposal.type == 'artist') artists.push(proposal);
      if (proposal.type == 'space') spaces.push(proposal);
    });

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

    ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'].forEach(function(hour, hourIndex){
      var _time = $('<div>').html(hour).css({
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
          'height': '560px'
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

      _table.append(_spaceCol);
      spaceColumns.push(_spaceCol);

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

          if (position > (originalPosition.left + 88)){
            var index = $.inArray(_spaceCol, spaceColumns);
            if(index < spaceColumns.length - 1){
              spaceColumns[index + 1].after(spaceColumns[index]);
              spaceColumns[index + 1].find('.programHelper').css({left: spaceColumns[index + 1].position().left + 1 + "px"});
              var tempColumn = spaceColumns[index + 1];
              spaceColumns[index + 1] = spaceColumns[index];
              spaceColumns[index] = tempColumn;
              $(this).data("uiDraggable").originalPosition = {
                  top : originalPosition.top,
                  left : originalPosition.left + 176
              }
            }
          }
          if (position < (originalPosition.left - 88)){
            var index = $.inArray(_spaceCol, spaceColumns);
            if(index > 0){
              spaceColumns[index].after(spaceColumns[index - 1]);
              spaceColumns[index - 1].find('.programHelper').css({left: spaceColumns[index - 1].position().left + 1 + "px"});
              var tempColumn = spaceColumns[index - 1];
              spaceColumns[index - 1] = spaceColumns[index];
              spaceColumns[index] = tempColumn;
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
      var _artistCard = Pard.Widgets.ProposalCard(proposal).render();
      artistCards.push(_artistCard);
      _proposalCards.append(_artistCard);
    });

    _proposalsWidget.append(_proposalCards);
    _createdWidget.append(_proposalsWidget);

    var _submitBtn = Pard.Widgets.Button('Guarda los cambios', function(){
      var program = [];
      spaceColumns.forEach(function(spaceCol){
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
              time: [start, end]
            }
            program.push(performance);
          }
        });
      });
      Pard.Backend.program(' ', program, function(data){
        console.log(data['status']);
      });
    });
    _createdWidget.append(_submitBtn.render());

    _getProfileiD = function(proposal_id){
      var profile_id = '';
      call['proposals'].forEach(function(proposal){
        if(proposal.proposal_id == proposal_id) return (profile_id = proposal.profile_id); 
      });
      return profile_id;
    }

    if(call['program']){
      spaceColumns.forEach(function(spaceCol){
        call['program'].forEach(function(performance){
          console.log(spaceCol.attr('id'));
          console.log(performance.host_proposal_id);
          if(spaceCol.attr('id') == performance.host_proposal_id){
            var timeCol = spaceCol.find('.spaceTime');
            var proposal = _getProposal(performance.participant_proposal_id);
            proposal['height'] = performance.time[1] - performance.time[0];
            var newEvent = Pard.Widgets.ProgramHelper(proposal).render();
            timeCol.append(newEvent);
            newEvent.css({
              position: 'absolute',
              top: parseInt(performance.time[0]) + 41 + "px",
              left: spaceColumns.indexOf(spaceCol) * 176 + 1 + "px",
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

    // if('profile_picture' in profile && profile.profile_picture != null){
    //   var _photo = $.cloudinary.image(profile['profile_picture'][0],
    //     { format: 'jpg', width: 164, height: 60,
    //       crop: 'fill', effect: 'saturation:50' });
    //   _photoContainer.append(_photo);
    // };

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
    var _keys = Object.keys(proposal);

    if ('productions' in proposal){
      var _catArray = [];
      proposal.productions.forEach(function(production){
        if (production.category && $.inArray(production.category, _catArray)){
          _catArray.push(production.category);
          _categories += Pard.Widgets.Dictionary(production.category).render() + ' - ';
        }
      })
    }
    else{ if (proposal.category) _categories += Pard.Widgets.Dictionary(proposal.category).render() + ' - ';}
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




