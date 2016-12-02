'use strict';

(function(ns){

	ns.Artist = function(artist, displayer){
    var program = {};
    var _proposals = {};
    var _conflictContent;

    var Accordion = function(){
      var container = $('<div>').css({'padding': 0});
      var accordionNav = $('<li>').addClass('accordion-item');
      var aHref = $('<div>').append($('<a>').attr('href','#').text(artist.name)).addClass('accordion-title');
      var _artistMenuDropdown = $('<div>').append(ArtistDropdownMenu(artist).render());
      _artistMenuDropdown.addClass('artists-dropdown-icon-call-manager');
      var content = $('<div>').addClass('accordion-content').css({'padding': 0});

      artist.proposals.forEach(function(proposal){
        _proposals[proposal.proposal_id] = new ProposalCard(proposal);
        content.append(_proposals[proposal.proposal_id].render());
      });

      accordionNav.append(aHref,_artistMenuDropdown);
      container.append(accordionNav, content);

      return{
        render: function(){
          return container;
        },
        addProposal: function(proposalCard){
          content.append(proposalCard.render());
        }
      }
    }

    var ProposalCard = function(proposal){
      var card = $('<div>').addClass('proposalCard');
      var color = Pard.Widgets.CategoryColor(proposal.category);

      card.addClass('proposal-card-container-call-manager cursor_grab');
      card.mouseover(function(){
        if (card.hasClass('cursor_move')) card.removeClass('cursor_move').addClass('cursor_grab');
      });
      card.mousedown(function(){
        card.removeClass('cursor_grab').addClass('cursor_move');
      });
      card.mouseup(function(){
        card.removeClass('cursor_move').addClass('cursor_grab');
      });

      var circleColumn = $('<div>').addClass('icon-column');
      var profileCircle = $('<div>').addClass('profile-nav-circle-selected').css({'background-color': color});
      var titleColumn = $('<div>').addClass('name-column profile-name-column');
      var title = $('<p>').addClass('proposal-title-card-call-manager');
      var titleText = $('<a>').attr('href','#').text(Pard.Widgets.CutString(proposal.title, 35));
      var icon = $('<div>').append(Pard.Widgets.IconManager(proposal.category).render().addClass('profile-nav-element-icon'));
      var colorIcon = Pard.Widgets.IconColor(color).render();
      icon.css({color: colorIcon});
      circleColumn.append($('<div>').addClass('nav-icon-production-container').append(profileCircle.append(icon)));
      titleColumn.append(title.append(titleText));

      card.draggable({
        revert: 'invalid',
        helper: function(){
          return Pard.Widgets.CardHelper(proposal).render();
        },
        appendTo: '.tableContainer',
        snap: '.spaceTime',
        snapMode: 'inner',
        snapTolerance: 5,
        grid: [ 10, 10 ],
        cursor: 'move',
        start: function(event, ui){
          var _performance =  {
            participant_id: artist.profile_id,
            participant_proposal_id: proposal.proposal_id,
            title: proposal.title,
            short_description: proposal.short_description,
            participant_category: proposal.category,
            availability: proposal.availability,
            participant_name: artist.name
          }
          Pard.Bus.trigger('drag', _performance);
        },
        stop:function(){
          Pard.Bus.trigger('stop');
        }
      });

      card.append(circleColumn, titleColumn);

      var rgb = Pard.Widgets.IconColor(color).rgb();
      card.css({border: 'solid 2px' + color});
      card.hover(
        function(){
          $(this).css({'box-shadow': '0 0 2px 1px'+ color});
        },
        function(){
          $(this).css({'box-shadow': '0px 1px 2px 1px rgba(10, 10, 10, 0.2)'});
        }
      );

      //Needed for displaying info
      proposal.name = artist.name;
      proposal.phone = artist.phone;
      proposal.email = artist.email;
      //needed for conFusion 2016 proposals
      if (!(proposal.form_category)) proposal.form_category = Pard.Widgets.Dictionary(proposal.category).render();

      titleText.on('click', function(){
      	displayer.displayProposal(proposal, 'artist');
      });

      return {
        render: function(){
          return card;
        },
        setDay: function(day){
          if(day == 'permanent'){
            card.removeClass('artist-not-available-call-manager');
          }
          else if($.inArray(day, proposal.availability) < 0){
            card.addClass('artist-not-available-call-manager');
          }
          else{
            card.removeClass('artist-not-available-call-manager');
          }
        }
      }
    }

    var ArtistDropdownMenu = function(){
      var _menu = $('<ul>').addClass('menu');
      var _profileLink = $('<li>');
      var _profileCaller = $('<a>').attr({
        target: 'blank',
        href: '/profile?id=' + artist.profile_id
      }).text('Perfil');

      var _programLink = $('<li>');
      var _programCaller = $('<a>').attr('href','#').text('Programa');

      _programCaller.on('click', function(){
        displayer.displayArtistProgram(artist.profile_id);
      });

      _profileLink.append(_profileCaller);
      _profileLink.click(function(event){
        event.stopImmediatePropagation();
      });
      _programCaller.click(function(event){
        event.stopImmediatePropagation();
      });

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

    var checkConflicts = function(performance_to_check){
      var _conflictPerformances = [];
      var myPerformances = Object.keys(program).map(function(performance_id){
        return program[performance_id];
      });

      if (myPerformances) myPerformances = Pard.Widgets.ReorderProgramCrono(myPerformances);
      myPerformances.forEach(function(performance, index){
        for(i = myPerformances.indexOf(performance) + 1; i < myPerformances.length; i++){
          if(performance.permanent == 'true'){
            if(myPerformances[i].participant_proposal_id == performance.participant_proposal_id){
              if(myPerformances[i].time[0] < performance.time[1]){
                _conflictPerformances.push(performance);
                _conflictPerformances.push(myPerformances[i]);
              }
            }
          }
          else if(myPerformances[i].participant_proposal_id == performance.participant_proposal_id && myPerformances[i].permanent == 'true'){
            if(myPerformances[i].time[0] < performance.time[1]){
              _conflictPerformances.push(performance);
              _conflictPerformances.push(myPerformances[i]);
            }
          }
          else if(myPerformances[i].permanent == 'false'){
            if(myPerformances[i].time[0] < performance.time[1]){
              _conflictPerformances.push(performance);
              _conflictPerformances.push(myPerformances[i]);
            }
          }
        }
      });
      if($.inArray(performance_to_check, _conflictPerformances) >= 0){
        //Closing active performanceManager
        if(_closePopup) _closePopup();
        _closePopup = function(){
          _conflictContent.remove();
        }
        _conflictContent = $('<div>').addClass('very-fast reveal full');
        _conflictContent.empty();
        $('body').append(_conflictContent);

        var _popup = new Foundation.Reveal(_conflictContent, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
        var _message = Pard.Widgets.PopupContent(artist.name, Pard.Widgets.ArtistProgram(artist, program, _spaces, _program), 'space-program-popup-call-manager');
        _message.setCallback(function(){
          _conflictContent.remove();
          _popup.close();
        });
        _conflictContent.append(_message.render());
        _popup.open();
      }
    }

    var _accordion = Accordion();

    return{
      artist: artist,
      accordion: _accordion.render(),
      proposals: artist.proposals,
      program: program,
      setDay: function(day){
        Object.keys(_proposals).forEach(function(proposal_id){
          _proposals[proposal_id].setDay(day);
        });
      },
      addPerformance: function(performance){
        program[performance.show.performance_id] = performance;
        checkConflicts(performance);
      },
      deletePerformance: function(performance){
        delete program[performance.performance_id];
      },
      loadPerformance: function(performance){
        program[performance.performance_id] = performance;
      },
      addProposal: function(proposal){
        artist.proposals.push(proposal);
        _proposals[proposal.proposal_id] = new ProposalCard(proposal);
        _accordion.addProposal(_proposals[proposal.proposal_id]);
      },
      deleteProposal: function(proposal_id){
        if(proposal_id in _proposals){
          _proposals[proposal_id].render().remove();
          delete _proposals[proposal_id];
          if(Object.keys(_proposals) == 0){
            artists = artists.filter(function(stored_artist){
              return artist.profile_id != stored_artist.profile_id;
            });
            _accordion.render().remove();
            delete _artists[artist.profile_id];
          }
          else{
            artist.proposals.filter(function(proposal){
              return proposal.proposal_id != proposal_id;
            });
          }
        }
      }
    }
  }
}(Pard || {}));