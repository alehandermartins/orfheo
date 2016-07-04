'use strict';

(function(ns){
  ns.Widgets.ProposalCard = function(proposal){
    //UUID generator
    _generateUUID = function() {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    };
    var performance_id = _generateUUID();
    var color = Pard.Widgets.CategoryColor(proposal.category);

    var _card = $('<div>').addClass('proposalCard');

    if($.inArray(Object.keys(Pard.CachedCall.eventTime)[0], proposal.availability) < 0) _card.addClass('artist-not-available-call-manager');
    else{ _card.removeClass('artist-not-available-call-manager'); }

    _card.addClass('proposal-card-container-call-manager');
    var _circleColumn = $('<div>').addClass('icon-column');

    var _profileCircle = $('<div>').addClass('profile-nav-circle-selected').css({'background-color': color});
    var _titleColumn = $('<div>').addClass('name-column profile-name-column');
    var _title = $('<p>').addClass('proposal-title-card-call-manager');
    var _title_text = $('<a>').attr('href','#').text(proposal.title);
    _title.append(_title_text);
    
    var _icon = $('<div>').append(Pard.Widgets.IconManager(proposal.category).render().addClass('profile-nav-element-icon'));
    var _colorIcon = Pard.Widgets.IconColor(color).render();
    _icon.css({color: _colorIcon});

    _circleColumn.append($('<div>').addClass('nav-icon-production-container').append(_profileCircle.append(_icon)));
    _titleColumn.append(Pard.Widgets.FitInBox(_title,125,54).render());

     _card.draggable({
      revert: 'invalid',
      cursor: 'move',
      // cursorAt: { top: 5, right: 15 },
      helper: function(){
        return Pard.Widgets.CardHelper(proposal).render();
      },
      appendTo: '.tableContainer',
      snap: '.spaceTime',
      snapMode: 'inner',
      snapTolerance: 5,
      grid: [ 10, 10 ],
      start: function(event, ui){
        // _title.css('cursor','move');
        // _title_text.css('cursor','move');
        //we assing a UUID to the new performance
        var performance = {
          performance_id: _generateUUID(),
          participant_id: proposal.profile_id,
          participant_proposal_id: proposal.proposal_id,
          title: proposal.title,
          duration: proposal.duration,
          category: proposal.category,
          availability: proposal.availability
        }
        //We store the info to be known by the column it is dropped into
        ui.helper.data('performance', performance);
        //CSS change
        _card.css({'opacity': '0.4', 'filter': 'alpha(opacity=40)', 'z-index': 999999});
        //We hide the accordion
        $('.accordion').toggle('slide', {direction: 'right'}, 500);
      },
      stop:function(){
        //Return to normality
        _card.css({'opacity': '1', 'filter': 'alpha(opacity=100)'});
        $('.accordion').toggle('slide', {direction: 'right'}, 500);
      }
    });

    _card.append(_circleColumn, _titleColumn);

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

    //Proposal form info
    Pard.Widgets.PopupCreator(_title, 'conFusión 2016', function(){ return Pard.Widgets.MyArtistCallProposalMessage(proposal)});

    return {
      render: function(){
        return _card;
      },
      setDay: function(day){
        //Giving background to card if not availabe
        // if(day == 'permanent')_card.css('background', 'none');
        console.log(proposal.availability);
        console.log(day);
        if(day == 'permanent'){
          _card.removeClass('artist-not-available-call-manager');
        }
        else if($.inArray(day, proposal.availability) < 0){
          _card.addClass('artist-not-available-call-manager');
          // _card.css({
          //   'background': 'repeating-linear-gradient(45deg,#606dbc,#606dbc 10px,#465298 10px,#465298 20px)'
          // });
        }
        else{
          _card.removeClass('artist-not-available-call-manager');
        }
      }
    }
  }

  //This is the dragged element when a proposal is dragged from the accordion
  ns.Widgets.CardHelper = function(proposal){
    var color = Pard.Widgets.CategoryColor(proposal.category);
    //Transforming minutes into pixels
    var duration = parseInt(proposal.duration)/60 * 40 || 100;
    //Avoiding to get too long helpers to drag around
    var _width = Pard.ColumnWidth;
    if(_width > 176 * 2) _width = 176 * 2; 
    
    var _card =$('<div>').css({
      'display': 'inline-block',
      'width': _width,
      'height': duration,
      'z-index': 9999,
      'border': '1px solid',
      'border-color':color
    });

    var _title = $('<p>').addClass('proposal-title-card-call-manager').append($('<a>').attr('href','#').text(proposal.title));
    _card.append(Pard.Widgets.FitInBox(_title, Pard.ColumnWidth, duration).render().css({'position': 'absolute'}));

    return {
      render: function(){
        return _card;
      }
    }
  }

  //This is the dragged element once a performance card is in the space columns
  ns.Widgets.ProgramHelper = function(performance){
    var color = Pard.Widgets.CategoryColor(performance.category);
    var _card =$('<div>').addClass('programHelper').css({
      'position': 'absolute',
      'display': 'inline-block',
      'width': Pard.ColumnWidth - 2,
      'background': color,
      'white-space': 'normal'
    });

    var _title = $('<p>').addClass('proposal-title-card-call-manager');
    var _title_text = $('<a>').attr('href','#').text(performance.title);
    _title.append(_title_text);
    _card.append(Pard.Widgets.FitInBox(_title, Pard.ColumnWidth, 40).render().css({'position': 'absolute'}));
    var accordionShown = false;

    _card.draggable({
      revert: false,
      //The helper is himself
      helper: 'clone',
      cursor: 'move', 
      // cursorAt: { top: 5, right: 15 },
      grid: [ 10, 10 ],
      start: function(event, ui){
        // _title.css('cursor','move');
        // _title_text.css('cursor','move');
        //Storing info
        ui.helper.data('dropped', false);
        ui.helper.data('performance', performance);
        //We hide the accordion
        if($('.accordion').hasClass('is-active')){
          accordionShown = true;
          $('.accordion').removeClass('is-active');
          $('.accordion').toggle('slide', {direction: 'right'}, 500);
        }
        _card.css({'opacity': '0.4', 'filter': 'alpha(opacity=40)'});
      },
      stop:function(event, ui){
        //The card and performance is destroyed if dropped out
        if(ui.helper.data('dropped') == false){
          Pard.Widgets.Program.forEach(function(performance, index){
            if(performance.performance_id == proposal.performance_id){
              Pard.Widgets.Program.splice(index, 1);
              _card.remove();
            }
          });
        }
        //Showing the accordion if not hidden
        if(accordionShown == true){
          $('.accordion').addClass('is-active');
          $('.accordion').toggle('slide', {direction: 'right'}, 500);
        }
      }
    });

    _card.resizable({
      maxWidth: Pard.ColumnWidth - 2,
      minWidth: Pard.ColumnWidth - 2,
      grid: 10,
      stop: function(event, ui){
        //Recalculating perfomance new duration
        Pard.Widgets.Program.forEach(function(performance){
          if(performance.performance_id == proposal.performance_id){
            var end = new Date(performance['time'][0]);
            end.setMinutes(end.getMinutes() + ui.size.height * 1.5);
            performance['time'][1] = end.getTime();
          }
        });
      }
    });

    //On click the performance shows its program
    Pard.Widgets.PopupCreator(_title, performance.title, function(){ return Pard.Widgets.PerformanceProgram(performance)});

    return {
      render: function(){
        return _card;
      },
      setParameters: function(top, height, left, maxHeight){
        _card.css({
          'top': position,
          'height': duration,
          'left' : _time.position().left,
        });
        _card.resizable({
          maxHeight: maxHeight
        });
      }
    }
  }

  //This is the dragged element for permanent performances
  ns.Widgets.ProgramPermanentHelper = function(proposal, space, cardParameters){
    var color = Pard.Widgets.CategoryColor(proposal.category);
    var _card =$('<div>').addClass('programHelper').attr('id', proposal.performance_id).css({
      'position': 'absolute',
      'top': cardParameters.top,
      'left': cardParameters.left,
      'display': 'inline-block',
      'width': Pard.ColumnWidth - 2,
      'height': '100px',
      'background': color,
      'white-space': 'normal'
    });

    // _card.on('mousedown',function(){});
    var _title = $('<p>').addClass('proposal-title-card-call-manager');
    var _title_text = $('<a>').attr('href','#').text(proposal.title);
    _title.append(_title_text);
    _card.append(Pard.Widgets.FitInBox(_title, Pard.ColumnWidth, cardParameters.height).render());

    var top = 0;

    _card.draggable({
      revert: false,
      cursor: 'move',
      // cursorAt: { top: 5, right: 15 }, 
      helper: 'clone',
      grid: [ 10, 10 ],
      start: function(event, ui){
        // _title.css('cursor','move');
        // _title_text.css('cursor','move');
        Pard.Widgets.DraggedPerformance = proposal;
        //We search for the performances linked to this one that belong to the same space
        var performances = $.grep(Pard.Widgets.Program, function(performance){
          if(performance.performance_id == proposal.performance_id && performance['host_proposal_id'] == space) return true;
          return false;
        });
        //We store those performances
        Pard.Widgets.DraggedPerformance['performances'] = performances;
        Pard.Widgets.Program = $.grep(Pard.Widgets.Program, function(performance){
          if(performance['performance_id'] == proposal.performance_id && performance['host_proposal_id'] == space) return false;
          return true;
        });
        _card.css({'opacity': '0.4', 'filter': 'alpha(opacity=40)'});
      },
      stop:function(){
        _card.remove();
        var spacePerformances = [];
        var performance_ids = [];
        //Recalculating position of the rest of the elements of the column one a card is destroyed
        Pard.Widgets.Program.forEach(function(performance){
          if(performance['permanent'] == true){
            if($.inArray(performance['performance_id'], performance_ids) < 0 && performance['host_proposal_id'] == space){
              performance_ids.push(performance['performance_id']);
              spacePerformances.push(performance);
            }
          }
        });
        spacePerformances.forEach(function(spacePerformance, index){
          spacePerformance['card'].css({'top': index * 100 + 41});
        });
      }
    });

    Pard.Widgets.PopupCreator(_title, proposal.title, function(){ return Pard.Widgets.PerformanceProgram(proposal)});

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