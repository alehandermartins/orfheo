'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};  

  ns.Widgets.CardHelper = function(proposal){
    var color = Pard.Widgets.CategoryColor(proposal.category);
    var duration = ((parseInt(proposal.duration)/60 * 40) + 2) || Pard.PermanentCardHeight;
    var _width = Pard.ColumnWidth;
    if(_width > 176 * 2) _width = 176 * 2; 

    var _card =$('<div>').addClass('dragging-card-call-manager').css({
      'width': _width,
      'height': duration,
      'border-color':color
    });
    var _title = $('<p>').addClass('proposal-title-card-call-manager').append($('<a>').attr('href','#').text(Pard.Widgets.CutString(proposal.title, 35)).removeClass('cursor_move').addClass('cursor_move'));
    _card.append(_title.css({
      'position': 'absolute',
      })
    );

    return {
      render: function(){
        return _card;
      }
    }
  }

  //This is the dragged element for permanent performances
  ns.Widgets.ProgramPermanentHelper = function(cardInfo, host_proposal_id){
    cardInfo.permanent = true;
    var color = Pard.Widgets.CategoryColor(cardInfo.category);
    // var borderColor = '1px solid '+ Pard.Widgets.BorderCategoryColor(cardInfo.category);
    var _card =$('<div>').addClass('programHelper').css({
      'position': 'absolute',
      'display': 'inline-block',
      'width': Pard.ColumnWidth - 2,
      'height': Pard.PermanentCardHeight,
      'background': color,
      'box-shadow': 'inset 0 0 1px '
      // 'border': borderColor 
    });

    _card.addClass('dragged-card-call-manager cursor_grab');

    // _card.on('mousedown',function(){});
    var _title = $('<p>').addClass('proposal-title-card-call-manager');
    var _titleTextLong = cardInfo.name+' - '+cardInfo.title;
    var _titleText = $('<a>').attr('href','#').text(Pard.Widgets.CutString(_titleTextLong, 35));
    var _confirmationCheck = '';
    var _confirmationCheckContainer = $('<span>').addClass('checker'); 
    if (cardInfo.confirmed=='true' || cardInfo.confirmed==true) _confirmationCheck = Pard.Widgets.IconManager('done').render(); 
    _confirmationCheckContainer.append(_confirmationCheck);
    var _commentIcon = '';
    var _commentIconContainer = $('<span>').addClass('commentIcon'); 
    if (cardInfo.comments) _commentIconContainer.append(Pard.Widgets.IconManager('comments').render()); 
    _commentIconContainer.append(_commentIcon);
    _title.append(_confirmationCheckContainer, _commentIconContainer, _titleText);
    _card.append(_title);

    _card.mousedown(function(){
      _card.removeClass('cursor_grab').addClass('cursor_move');
    });
    _card.mouseup(function(){
      _card.removeClass('cursor_move').addClass('cursor_grab');
    });


    _card.draggable({
      revert: false,
      // cursor: 'move',
      // cursorAt: { top: 5, right: 15 }, 
      helper: 'clone',
      grid: [ 10, 10 ],
      start: function(event, ui){
        // _title.css('cursor','move');
        // _titleText.css('cursor','move');
        ui.helper.data('dropped', false);
        //We store the info
        ui.helper.data('cardInfo', cardInfo);
        ui.helper.data('host_proposal_id', host_proposal_id);
        _card.css({'opacity': '0.4', 'filter': 'alpha(opacity=40)'});
        _card.removeClass('cursor_grab').addClass('cursor_move');
      },
      stop:function(event, ui){
        _card.removeClass('cursor_move').addClass('cursor_grab');
        //The card and performance is destroyed if dropped out
        if(ui.helper.data('dropped') == false){
          var index = Pard.Widgets.Program.length - 1;
          while(index > 0){
            if(Pard.Widgets.Program[index].performance_id == cardInfo.performance_id && Pard.Widgets.Program[index].host_proposal_id == host_proposal_id){
                Pard.Widgets.Program.splice(index, 1);
                _card.remove();
              }
            index -= 1;
          }
        }

        var spacePerformances = [];
        var performance_ids = [];
        //Recalculating position of the rest of the elements of the column one a card is destroyed
        Pard.Widgets.Program.forEach(function(performance){
          if(performance['permanent'] == true){
            if($.inArray(performance['performance_id'], performance_ids) < 0 && performance['host_proposal_id'] == host_proposal_id){
              performance_ids.push(performance['performance_id']);
              spacePerformances.push(performance);
            }
          }
        });
        spacePerformances.forEach(function(spacePerformance, index){
          spacePerformance['card'].css({'top': index * Pard.PermanentCardHeight + 41});
        });
        host_proposal_id = ui.helper.data('host_proposal_id');
      }
    });

    _titleText.on('click', function(){
      var _content = $('<div>').addClass('very-fast reveal full');
      _content.empty();
      $('body').append(_content);

      var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
      var _message = Pard.Widgets.PopupContent(cardInfo.title+' (' + cardInfo.name + ')', Pard.Widgets.PermanentPerformanceManager(cardInfo));
      _message.setCallback(function(){
        _content.remove();
        _popup.close();
      });
      _content.append(_message.render());
      _popup.open();
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
      left: '-=' + (spaceCol.position().left + 1)
    });

    return {
      render: function(){
        return _spaceCol;
      }
    }
  }

}(Pard || {}));