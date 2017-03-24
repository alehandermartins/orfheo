'use strict';

(function(ns){

	ns.Artist = function(artist, displayer){
    var program = {};
    var _proposals = {};

    var Accordion = function(){
      var container = $('<div>').css({'padding': 0});
      var accordionNav = $('<li>').addClass('accordion-item');
      var artistName = $('<a>').attr('href','#/').text(artist.name);
      var aHref = $('<div>').append(artistName).addClass('accordion-title');
      var _artistMenuDropdown = $('<div>').append(ArtistDropdownMenu().render());
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
        },
        modify: function(new_artist){
          artistName.text(new_artist.name);
          Object.keys(_proposals).forEach(function(proposal_id){
            _proposals[proposal_id].modify(new_artist);
          });
        }
      }
    }

    var ProposalCard = function(proposal){
      var card = $('<div>').addClass('proposalCard');
      var color, rgb, colorIcon;

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
      var profileCircle = $('<div>').addClass('profile-nav-circle-selected');
      var titleColumn = $('<div>').addClass('name-column profile-name-column');
      var title = $('<p>').addClass('proposal-title-card-call-manager');
      var titleText = $('<a>').attr('href','#/');
      var _icon = '';
      var icon = $('<div>');
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
        grid: [ 15, 15 ],
        cursor: 'move',
        start: function(event, ui){
          var _performance =  {
            participant_id: artist.profile_id,
            participant_proposal_id: proposal.proposal_id
          }
          Pard.Bus.trigger('drag', _performance);
        },
        stop:function(){
          Pard.Bus.trigger('stop');
        }
      });

      card.append(circleColumn, titleColumn);

      //Needed for displaying info
      proposal.name = artist.name;
      proposal.phone = artist.phone;
      proposal.email = artist.email;
      proposal.profile_id = artist.profile_id;

      titleText.on('click', function(){
      	displayer.displayProposal(proposal, 'artist');
      });

      var _fillCard = function(proposal){
        color = Pard.Widgets.CategoryColor(proposal.category);
        profileCircle.css({'background-color': color});
        titleText.text(Pard.Widgets.CutString(proposal.title, 35));

        _icon = Pard.Widgets.IconManager(proposal.category).render().addClass('profile-nav-element-icon');
        icon.append(_icon);
        colorIcon = Pard.Widgets.IconColor(color).render();
        icon.css({color: colorIcon});

        rgb = Pard.Widgets.IconColor(color).rgb();
        card.css({border: 'solid 2px' + color});
        card.hover(
          function(){
            $(this).css({'box-shadow': '0 0 2px 1px'+ color});
          },
          function(){
            $(this).css({'box-shadow': '0px 1px 2px 1px rgba(10, 10, 10, 0.2)'});
          }
        );
      }

      var _modify = function(new_artist){
        proposal.name = new_artist.name;
        proposal.phone = new_artist.phone;
        proposal.email = new_artist.email;
        proposal.profile_id = new_artist.profile_id;
        
        if(new_artist.proposals){
          var new_proposal = new_artist.proposals[0];
          if(new_proposal.proposal_id == proposal.proposal_id){
            for(var key in new_proposal) proposal[key] = new_proposal[key];
            _fillCard(proposal);
          }
        }
      }

      _fillCard(proposal);

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
        },
        modify: _modify
      }
    }

    var ArtistDropdownMenu = function(){
      var _menu = $('<ul>').addClass('menu');
      var _profileLink = $('<li>');
      var _profileCaller = $('<a>').attr({
        target: 'blank',
        href: '/profile?id=' + artist.profile_id
      }).text(Pard.t.text('dictionary.profile').capitalize());

      var _programLink = $('<li>');
      var _programCaller = $('<a>').attr('href','#/').text(Pard.t.text('dictionary.program').capitalize());

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

    var _accordion = Accordion();

    return{
      artist: artist,
      accordion: _accordion.render(),
      program: program,
      setDay: function(day){
        Object.keys(_proposals).forEach(function(proposal_id){
          _proposals[proposal_id].setDay(day);
        });
      },
      addArtistInfo: function(performance){
        var _proposal = artist.proposals.filter(function(proposal){
          return proposal.proposal_id == performance.participant_proposal_id;
        })[0];
        performance.title = _proposal.title;
        performance.short_description = _proposal.short_description;
        performance.participant_category = _proposal.category;
        performance.participant_subcategory = _proposal.subcategory;
        performance.availability = _proposal.availability;
        performance.participant_name = artist.name;
        performance.participant_email = artist.email;
      },
      addPerformance: function(performance){
        program[performance.show.performance_id] = performance;
      },
      deletePerformance: function(performance){
        delete program[performance.performance_id];
      },
      addProposal: function(proposal){
        // proposals.push(proposal);
        _proposals[proposal.proposal_id] = new ProposalCard(proposal);
        _accordion.addProposal(_proposals[proposal.proposal_id]);
      },
      deleteProposal: function(proposal_id){
        if(proposal_id in _proposals){
          _proposals[proposal_id].render().remove();
          delete _proposals[proposal_id];
          if(Object.keys(_proposals) == 0) _accordion.render().remove();
          artist.proposals = artist.proposals.filter(function(proposal){
            return proposal.proposal_id != proposal_id;
          });
        }
      },
      modify: function(new_artist){
        for(var key in new_artist){
          if (key != 'proposals') artist[key] = new_artist[key];
        }
        if(new_artist.proposals){
          artist.proposals = artist.proposals.filter(function(proposal){
            return proposal.proposal_id != new_artist.proposals[0].proposal_id;
          });
          artist.proposals.push(new_artist.proposals[0]);
        }
        _accordion.modify(new_artist);
      }
    }
  }
}(Pard || {}));