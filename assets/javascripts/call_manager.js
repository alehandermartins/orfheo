'use strict';

(function(ns){

  ns.Widgets.ProgramManager = function(call){
    var _createdWidget = $('<div>').attr('id', 'programPanel').css({'overflow': 'auto'});

    var artists = [];
    var spaces = [];

    call['proposals'].forEach(function(proposal){
    if (proposal.type == 'artist') artists.push(proposal);
     if (proposal.type == 'space') spaces.push(proposal); 
    });


    var _table = $('<div>').sortable({
      items: '.spaceCol'
    });

    var _timeCol = $('<div>').addClass('timeCol').css({
      'display': 'inline-block',
      'width': '11rem',
      'border-width': '1px',
      'border-style': 'solid',
    });
    var _timename = $('<div>').html('Horas').css({
      'background': '#b5cfd2',
      'padding': '8px',
      'border-color': '#999999'
    });

    var _timeSpan = $('<div>').html('&nbsp').css({
      'padding': '8px',
      'height': '240px'
    });

    _timeCol.append(_timename, _timeSpan);
    _table.append(_timeCol);

    ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00'].forEach(function(hour, hourIndex){
      var _time = $('<div>').html(hour).css({
        position: "absolute",
        top: 190 + hourIndex * 40 + "px",
        left: 20 + "px",
      });
      _timeSpan.append(_time);
    });


    spaces.forEach(function(space, space_index){
      var _spaceCol = $('<div>').addClass('spaceCol').css({
        'display': ' inline-block',
        'width': '11rem',
        'border-width': '1px',
        'border-style': 'solid',
      });
      var _spacename = $('<div>').html(space.name).css({
        'background': '#b5cfd2',
        'padding': '8px',
        'border-color': '#999999',
      });

      _spaceCol.append(_spacename);

        var _time = $('<div>').html('&nbsp').css({
          'padding': '8px',
          'height': '240px'
        });
        _time.droppable({
          drop: function(event, ui) {
            var pos = ui.position;
            var distance = pos.top - _time.position().top;
            var position = pos.top;

            if(pos.top < _time.position().top) position = _time.position().top;
            var steps = Math.floor(distance/40);
            var minsteps = Math.floor((distance%40)/10);

            // console.log(distance);
            // console.log(steps);
            // console.log(minsteps);

            // console.log(pos.top);
            // console.log(_time.position().top);
            // console.log(_time.position().top + steps * 40 + minsteps * 10);

            ui.draggable.trigger({type: 'proposal'});
            if(pos.top + (parseInt(Pard.Widgets.DraggedProposal.duration)/60 * 40) > _time.position().top + 240) position = _time.position().top + 240 - (parseInt(Pard.Widgets.DraggedProposal.duration)/60 * 40);
            var newEvent = Pard.Widgets.ProgramHelper(Pard.Widgets.DraggedProposal).render();
            _time.append(newEvent);
            newEvent.css({
              position: "absolute",
              top: position + "px",
              left: _time.position().left + "px",
            });
          }
        });

        _spaceCol.append(_time);

      
      _table.append(_spaceCol);
    });
   
    _createdWidget.append(_table);

    artists.forEach(function(proposal){
      _createdWidget.append(Pard.Widgets.ProposalCard(proposal).render());
    });

  	return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.DraggedProposal = {};

  ns.Widgets.ProposalCard = function(proposal){

    var _card =$('<span>').addClass('proposalCard').draggable({
      revert: 'invalid',
      helper: function(){
        return Pard.Widgets.CardHelper(proposal).render();
      },
      grid: [ 10, 10 ],
      drag: function(event, ui){
        _card.css({'opacity': '0.4', 'filter': 'alpha(opacity=40)'});
      },
      stop:function(){
        _card.css({'opacity': '1', 'filter': 'alpha(opacity=100)'});
      }
    });

    _card.on('proposal', function(){
      Pard.Widgets.DraggedProposal = proposal;
    });

    var _rgb = Pard.Widgets.IconColor('#00FF00').rgb();
    _card.css({border: 'solid 3px'+'#00FF00'});
    _card.hover(
      function(){
        $(this).css({
        'box-shadow': '0 0 2px 1px'+ '#00FF00'
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
    _photoContainer.css({background: '#00FF00'});  

    // if('profile_picture' in profile && profile.profile_picture != null){
    //   var _photo = $.cloudinary.image(profile['profile_picture'][0],
    //     { format: 'jpg', width: 164, height: 60,
    //       crop: 'fill', effect: 'saturation:50' });
    //   _photoContainer.append(_photo);
    // };

    var _circle = $('<div>').addClass('circleProfile position-circleProfile-card').css({background: '#00FF00'});
    var _icon = $('<div>').addClass('icon-profileCircle').html(Pard.Widgets.IconManager(proposal.type).render());
    var _colorIcon = Pard.Widgets.IconColor('#00FF00').render();
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
    var _card =$('<div>').css({
      'display': 'inline-block',
      'width': '10.9rem',
      'height': (parseInt(proposal.duration)/60 * 40) + 'px',
      'background': '#00FF00',
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

    _card.draggable({
      revert: 'invalid',
      helper: 'clone',
      grid: [ 10, 10 ],
      drag: function(event, ui){
        _card.css({'opacity': '0.4', 'filter': 'alpha(opacity=40)', 'z-index': 9999});
      },
      stop:function(){
        _card.css({'opacity': '1', 'filter': 'alpha(opacity=100)'});
      }
    });

    return {
      render: function(){
        return _card;
      }
    }
  }

  ns.Widgets.ProgramHelper = function(proposal){
    var _card =$('<div>').css({
      'display': 'inline-block',
      'width': '10.9rem',
      'height': (parseInt(proposal.duration)/60 * 40) + 'px',
      'background': '#00FF00',
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

    _card.draggable({
      revert: false,
      helper: 'clone',
      grid: [ 10, 10 ],
      drag: function(event, ui){
        _card.css({'opacity': '0.4', 'filter': 'alpha(opacity=40)'});
      },
      stop:function(){
        _card.remove();
      }
    });

    _card.on('proposal', function(){
      Pard.Widgets.DraggedProposal = proposal;
    });

    return {
      render: function(){
        return _card;
      }
    }
  }

}(Pard || {}));




