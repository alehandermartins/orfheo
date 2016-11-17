  'use strict';

(function(ns){
  ns.Widgets = ns.Widgets || {};

  ns.Widgets.Manager = function(the_event){

    var artists = the_event.artists;
    var spaces = the_event.spaces;
    var _forms;

    var _main = $('<main>').addClass('main-call-page');
    var _mainLarge = $('<section>').addClass('pard-grid call-section');
    var _navigationContainer = $('<div>').addClass('navigation-container-call-page');
    var _goToEventBtn = $('<a>').attr('href','/event?id='+ the_event.event_id).text('Página evento');
    _goToEventBtn.addClass('toEventPage-btn-callPage');
    var _tabs = $('<ul>').addClass('menu simple tabs-menu switcher-menu-call-page');
    var _title = $('<h4>').text('Gestiona la Convocatoria').css({'margin-top':'1.5rem', 'margin-bottom':'2.5rem'});
    var _panels = $('<div>').css('padding', 0);

    var _programTabTitle =  $('<a>').attr({href: "#"}).text('Programa');
    var _tableTabTitle =  $('<a>').attr({href: "#"}).text('Tabla');
    var _proposalsTabTitle =  $('<a>').attr({href: "#"}).text('Propuestas');
    var _qrTabTitle =  $('<a>').attr({href: "#"}).text('QR');

    var _programTab = $('<li>').append(_programTabTitle);
    var _tableTab = $('<li>').append(_tableTabTitle);
    var _proposalsTab = $('<li>').append(_proposalsTabTitle);
    var _qrTab = $('<li>').append(_qrTabTitle);

    var timeManager = Pard.Widgets.TimeManager(the_event.eventTime);
    var hours = timeManager.hours;
    var eventTime = timeManager.eventTime;
    var _startHour = parseInt(eventTime['permanent'][0].split(':')[0]);
    var _startMin = parseInt(eventTime['permanent'][0].split(':')[1]);
    var _endHour = parseInt(eventTime['permanent'][1].split(':')[0]);
    var _endMin = parseInt(eventTime['permanent'][1].split(':')[1]);

    var ProgramManager = function(){

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

      var _timeTable = $('<div>');
      hours.forEach(function(hour, hourIndex){
        if(hour < 10) hour = '0' + hour;
        var _time = $('<div>').html(hour + ':00').addClass('time-timeTable-call-manager');
        _time.css({top: 28 + hourIndex * 40 + "px"});
        var _line = $('<hr>').addClass('line-timeTable-call-manager')
        _line.css({top: 20 + hourIndex * 40 + "px"});
        _timeTable.append(_time, _line);
      });
      _timeTableContainer.append(_timeTable);

      Object.keys(eventTime).forEach(function(day, index){
        var _table = $('<div>').css({
          'width': '100%',
          'height': hours.length * 40 + 2,
          'white-space':'nowrap'
        });
        _tables[day] = _table;
        if(index == 0) _tableContainer.append(_tables[day]);
        else{ _tableContainer.append(_tables[day].hide());}
      });

      var _selectors = $('<div>').addClass('selectors-call-manager');
      var _buttonsContainer = $('<div>').addClass('buttons-container-call-manager');

      var _toolsContainer = $('<div>').addClass('tools-buttons-container');
      var _submitBtnContainer = $('<div>').addClass('submit-program-btn-container');
      // _submitBtnContainer.append($('<p>').html('Guarda </br>los cambios').addClass('save-text-call-manager'))
      // _submitBtnContainer.append(_submitBtn);

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
        minimumResultsForSearch: Infinity,
        allowClear:false,
        templateResult: Pard.Widgets.FormatResource
      }).on('select2:select', function(){
        //Giving css to unavailable proposals
        Object.keys(_artists).forEach(function(profile_id){
          _artists[profile_id].setDay(_daySelector.val());
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
          spaces.forEach(function(space){
            if(space.category == _data['id']){
              _spaces[space.profile_id].showColumns();
              _shownSpaces.push(space);
            }
            else{ _spaces[space.profile_id].hideColumns();}
          });
        }
        else{
          spaces.forEach(function(space){
            if(space.profile_id == _spaceSelector.val()){
              _spaces[space.profile_id].showColumns();
              _shownSpaces.push(space);
            }
            else{_spaces[space.profile_id].hideColumns();}
          });
        }
        Pard.ColumnWidth = 176;
        if(_shownSpaces.length < 4) Pard.ColumnWidth = Pard.ColumnWidth * 4 / _shownSpaces.length;
        _shownSpaces.forEach(function(space){
          _spaces[space.profile_id].alignPerformances(_daySelector.val());
        });
      }

      var selectArtists = function(){
        var _data = _artistSelector.select2('data')[0];
        if(_data['type'] == 'category'){
          Object.keys(_artists).forEach(function(profile_id){
            if (_artists[profile_id].proposals.some(function(proposal){
              return proposal.category == _data['id'];
            })) _artists[profile_id].accordion.show();
            else{_artists[profile_id].accordion.hide();}
          });
        }
        else{
          Object.keys(_artists).forEach(function(profile_id){
            if(profile_id == _artistSelector.val()){
              _artists[_artistSelector.val()].accordion.show();
              _artists[_artistSelector.val()].accordion.find('.accordion-item').trigger('click');
            }
            else{_artists[profile_id].accordion.hide();}
          });
        }
      }

      var _loadSpaceSelector = function(){
        spaceProposals = Pard.Widgets.SpaceProposals();
        spaces.forEach(function(space){
          spaceProposals.push({
            type: 'profile',
            id: space.profile_id,
            text: space.name
          });
        });

        _spaceSelector.select2({
          placeholder: 'Espacios',
          allowClear: true,
          data: spaceProposals,
          templateResult: Pard.Widgets.FormatResource,
        });
      }

      var _loadArtistSelector = function(){
        artistProposals = Pard.Widgets.ArtistProposals();
        artists.forEach(function(artist){
          artistProposals.push({
            id: artist.profile_id,
            text: artist.name
          });
        });
        _artistSelector.select2({
          placeholder: 'Artistas',
          data: artistProposals,
          allowClear: true,
          templateResult: Pard.Widgets.FormatResource,
        });
      }

      _spaceSelector.on("select2:select", function(e) {
        selectSpaces();
      });

      _artistSelector.on("select2:select", function(e) {
        selectArtists();
      });

      _spaceSelector.on("select2:unselecting", function(e){
        _shownSpaces = [];
        Pard.ColumnWidth = 176;
        if(spaces.length < 4) Pard.ColumnWidth = Pard.ColumnWidth * 4 / spaces.length;
        spaces.forEach(function(space){
          _spaces[space.profile_id].showColumns();
          _spaces[space.profile_id].alignPerformances(_daySelector.val());
          _shownSpaces.push(space);
        });
        $(this).val("");
        $(this).trigger('change');
        e.preventDefault();
      });

      _artistSelector.on("select2:unselecting", function(e){
        Object.keys(_artists).forEach(function(profile_id){
          _artists[profile_id].accordion.show();
        });
        $(this).val("");
        $(this).trigger('change');
        e.preventDefault();
      });

      _spaceSelector.on('reload', function(e, _id){
        if(!_id) return $(this).trigger('select2:unselecting');
        $(this).val(_id);
        $(this).trigger('change');
      });

      _artistSelector.on('reload', function(e, _id){
        if(!_id) return $(this).trigger('select2:unselecting');
        $(this).val(_id);
        $(this).trigger('change');
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

      var _artists = {};
      var _spaces = {};
      var _program = {};

      var _performance;
      var lastArtist;
      var _closePopup;



      var Artist = function(artist){
        var program = {};
        var _proposals = {};

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

          if($.inArray(Object.keys(the_event.eventTime)[0], proposal.availability) < 0) card.addClass('artist-not-available-call-manager');
          else{ card.removeClass('artist-not-available-call-manager'); }

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
              console.log('heler')
              return Pard.Widgets.CardHelper(proposal).render();
            },
            appendTo: '.tableContainer',
            snap: '.spaceTime',
            snapMode: 'inner',
            snapTolerance: 5,
            grid: [ 10, 10 ],
            cursor: 'move',
            start: function(event, ui){
              _performance = {
                participant_id: artist.profile_id,
                participant_proposal_id: proposal.proposal_id,
                title: proposal.title,
                short_description: proposal.short_description,
                participant_category: proposal.category,
                availability: proposal.availability,
                participant_name: artist.name
              }
              _artistsBlock.toggle('slide', {direction: 'right'}, 500);
            },
            stop:function(){
              _artistsBlock.toggle('slide', {direction: 'right'}, 500);
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
          if (!(proposal.form_category)) proposal.form_category = Pard.Widgets.Dictionary(proposal.category).render()

          //Proposal form info
          titleText.on('click', function(){
          if (!(_forms)) {
              Pard.Backend.getCallForms(the_event.call_id, function(data){
                _forms = data.forms;
                Pard.Widgets.DisplayPopupProposal(proposal, _forms['artist'][proposal.form_category],the_event.name);
              });
            }
            else{
              Pard.Widgets.DisplayPopupProposal(proposal, _forms['artist'][proposal.form_category],the_event.name);
            }
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
            var _content = $('<div>').addClass('very-fast reveal full');
            _content.empty();
            $('body').append(_content);

            var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
            var _message = Pard.Widgets.PopupContent(artist.name, Pard.Widgets.ArtistProgram(artist, program, _spaces, _program), 'space-program-popup-call-manager');
            _message.setCallback(function(){
              _content.remove();
              _popup.close();
            });
            _content.append(_message.render());
            _popup.open();
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
            var _content = $('<div>').addClass('very-fast reveal full');
            _content.empty();
            $('body').append(_content);

            var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
            var _message = Pard.Widgets.PopupContent(artist.name, Pard.Widgets.ArtistProgram(artist, program, _spaces, _program), 'space-program-popup-call-manager');
            _message.setCallback(function(){
              _content.remove();
              _popup.close();
            });
            _content.append(_message.render());
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
            program[performance.performance_id] = performance;
            checkConflicts(performance);
          },
          deletePerformance: function(performance_id){
            delete program[performance_id];
          },
          loadPerformance: function(performance){
            program[performance.performance_id] = performance;
          },
          addProposal: function(proposal){
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

      var Space = function(space){
        var _columns = {};
        var program = {};

        var SpaceColumn = function(day){
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
            if (!(_forms)) {
              Pard.Backend.getCallForms(the_event.call_id, function(data){
                _forms = data.forms;
                Pard.Widgets.DisplayPopupProposal(space, _forms['space'][space.form_category],the_event.name);
              });
            }
            else{
              Pard.Widgets.DisplayPopupProposal(space, _forms['space'][space.form_category],the_event.name);
            }
          });

          var _time = $('<div>').addClass('spaceTime').html('&nbsp').css({
            'height': _tables[day].height() - 42
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


              var destroy = function(performance){
                if(performance.performance_id && _program[performance.performance_id]){
                  _program[performance.performance_id].destroy();
                }
              }

              var create = function(performance){
                if(!performance.performance_id) performance.performance_id = Pard.Widgets.GenerateUUID();
                _addSpaceInfo(performance);
                if(performance.permanent == 'true') _program[performance.performance_id] = new PermanentPerformance(performance);
                else{_program[performance.performance_id] = new Performance(performance);}
                _program[performance.performance_id].addToPrograms();
              }

              if(day == 'permanent'){
                _performance.permanent = 'true';
                if(_performance.performance_id){
                  var artistProgram = _artists[_performance.participant_id].program;
                  var performances = Object.keys(artistProgram).map(function(performance_id){
                    return artistProgram[performance_id];
                  });
                  performances = performances.filter(function(performance){
                    return (performance.permanent == 'true' && performance.participant_proposal_id == _performance.participant_proposal_id && performance.host_id == _performance.host_id);
                  });
                  performances.forEach(function(performance){
                    destroy(performance);
                  });
                  performances.forEach(function(performance){
                    create(performance);
                  });
                }
                else{
                  var myPerformances = Object.keys(program).map(function(performance_id){
                    return program[performance_id];
                  });
                  myPerformances = myPerformances.filter(function(performance){
                    return (performance.permanent == 'true' && performance.participant_proposal_id == _performance.participant_proposal_id && performance.host_id == space.profile_id);
                  });
                  Object.keys(eventTime).forEach(function(date){
                    if(date == 'permanent') return false;
                    if(myPerformances.every(function(show){
                      return show.date != date;
                    })){
                      var start = new Date(date.split('-')[0],date.split('-')[1] -1,date.split('-')[2],_startHour, _startMin);
                      var end = new Date(date.split('-')[0],date.split('-')[1] -1,date.split('-')[2],_endHour, _endMin);
                      _performance.date = date;
                      _performance.time = [start.getTime(), end.getTime()];
                      var performance = {};
                      Object.keys(_performance).forEach(function(key){
                        performance[key] = _performance[key];
                      });
                      create(performance);
                    }
                  });
                }
              }
              else{
                destroy(_performance);
                var start = new Date(parseInt(eventTime[day][0]));
                start.setMinutes(start.getMinutes() + (position - 41) * 1.5);
                var end = new Date(start.getTime());
                end.setMinutes(start.getMinutes() + duration * 1.5);

                _performance.date = day;
                _performance.permanent = 'false';
                _performance.time = [start.getTime(), end.getTime()];
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
                  Object.keys(eventTime).forEach(function(date){
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
                  Object.keys(eventTime).forEach(function(date){
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
            var _content = $('<div>').addClass('very-fast reveal full');
            _content.empty();
            $('body').append(_content);

            var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
            var _popupTitle = space.name + ' ('+Pard.Widgets.Dictionary(space.category).render() +')';
            var _message = Pard.Widgets.PopupContent(_popupTitle, Pard.Widgets.SpaceProgram(space, program, _artists, _program), 'space-program-popup-call-manager');
            _message.setCallback(function(){
              _content.remove();
              _popup.close();
            });
            _content.append(_message.render());
            _popup.open();
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
            _program[firstPerformance.performance_id].performanceCard().css({
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
              _program[performance.performance_id].performanceCard().css({
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
                _program[performance.performance_id].performanceCard().css({
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


        var _loadPerformance = function(performance, programCard){
          if(performance.permanent == 'false') _columns[performance.date].append(programCard);
          else{
            if(Object.keys(program).every(function(performance_id){
              return program[performance_id].permanent == 'false' || program[performance_id].participant_proposal_id != performance.participant_proposal_id;
            })){
              _columns['permanent'].append(programCard);
            }
          }
          program[performance.performance_id] = performance;
        }

        Object.keys(eventTime).forEach(function(day){
          _columns[day] = SpaceColumn(day).render();
          _tables[day].append(_columns[day]);
        });

        return {
          space: space,
          columns: _columns,
          program: program,
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
          alignPerformances: function(day){
            var position = _columns[day].position().left + 1;
            Object.keys(eventTime).forEach(function(date){
              _columns[date].css('width', Pard.ColumnWidth);
            });
            AlignPerformances(position);
          },
          addPerformance: function(performance, programCard){
            _addSpaceInfo(performance);
            _loadPerformance(performance, programCard);
            AlignPerformances(_columns[_daySelector.val()].position().left + 1);
          },
          deletePerformance: function(performance){
            delete program[performance.performance_id];
            if(performance.permanent == 'true'){
              if(_columns['permanent'].find('.' + performance.performance_id).length) {
                _columns['permanent'].find('.' + performance.performance_id).detach();
                var myPerformances = Object.keys(program).map(function(performance_id){
                  return program[performance_id];
                });
                myPerformances = myPerformances.filter(function(show){
                  if(show.permanent == 'true' && show.participant_proposal_id == performance.participant_proposal_id){
                    _columns['permanent'].append(_program[show.performance_id].performanceCard());
                    return;
                  }
                });
              }
            }
            AlignPerformances(_columns[_daySelector.val()].position().left + 1);
          },
          loadPerformance: _loadPerformance
        }
      }

      var Performance = function(performance){

        var PerformanceCard = function(){
          var _createdWidget = $('<div>');
          var color = Pard.Widgets.CategoryColor(performance.participant_category);

          var timeCol = _spaces[performance.host_id].columns[performance.date].find('.spaceTime');
          var dayStart = parseInt(eventTime[performance.date][0]);

          performance.time[0] = parseInt(performance.time[0]);
          performance.time[1] = parseInt(performance.time[1]);

          //10 pixels = 15 min
          var start = (performance.time[0] - dayStart) / 90000;
          var end = (performance.time[1] - dayStart) / 90000;
          var position = start + 41;
          var duration = (end - start);
          var maxHeight = timeCol.height() - start;

          var _card =$('<div>').addClass('programHelper').css({
            'position': 'absolute',
            'display': 'inline-block',
            'width': Pard.ColumnWidth - 2,
            'top': position,
            'height': duration,
            'background': color,
            'white-space': 'normal',
            'box-shadow': 'inset 0 0 1px '
          });
          _card.addClass('dragged-card-call-manager cursor_grab');

          var _title = $('<p>').addClass('proposal-title-card-call-manager');
          var _titleTextLong = performance.participant_name + ' - ' + performance.title;
          var _titleText = $('<a>').attr('href','#').text(Pard.Widgets.CutString(_titleTextLong, 35));
          var _confirmationCheck = '';
          var _confirmationCheckContainer = $('<span>').addClass('checker');
          if (performance.confirmed == 'true' || performance.confirmed == true) _confirmationCheck = Pard.Widgets.IconManager('done').render();
          _confirmationCheckContainer.append(_confirmationCheck);
          var _commentIcon = '';
          var _commentIconContainer = $('<span>').addClass('commentIcon');
          if (performance.comments) _commentIconContainer.append(Pard.Widgets.IconManager('comments').render());
          _commentIconContainer.append(_commentIcon);
          _title.append(_confirmationCheckContainer, _commentIconContainer, _titleText);
          _card.append(_title.css({'position': 'absolute'}));

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
              _performance = performance;
              ui.helper.data('dropped', false);
              if(_artistsBlock.hasClass('is-active')){
                _artistsBlock.toggle('slide', {direction: 'right'}, 500);
                _artistsBlock.removeClass('is-active');
              }
              _card.css({'opacity': '0.4'});
            },
            stop:function(event, ui){
              _card.removeClass('cursor_move').addClass('cursor_grab');
              _artistsBlock.toggle('slide', {direction: 'right'}, 500);
              _artistsBlock.addClass('is-active');
              _card.css({'opacity': '1'});
              //The card and performance is destroyed if dropped out
              if(ui.helper.data('dropped') == false){
                _program[performance.performance_id].destroy();
              }
            }
          });

          _card.resizable({
            resize: function(event, ui) {
              ui.size.width = ui.originalSize.width;
            },
            maxHeight: maxHeight,
            grid: 10,
            stop: function(event, ui){
              var duration = new Date(performance['time'][0]);
              duration.setMinutes(duration.getMinutes() + ui.size.height * 1.5);
              performance['time'][1] = duration.getTime();
              _program[performance.performance_id].addToPrograms();
            }
          });

          //On click the performance shows its program
          _titleText.on('click', function(){
            var _content = $('<div>').addClass('very-fast reveal full');
            _content.empty();
            $('body').append(_content);

            var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
            var _message = Pard.Widgets.PopupContent(performance.title +' (' + performance.participant_name + ')', PerformanceManager());
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

        var PerformanceManager = function(saveMethod){
          if(saveMethod == 'load') _savePerformance = _loadToPrograms;
          else{_savePerformance = _addToPrograms}

          var performanceBox = $('<div>');
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

          daySelector.css({'display': ' inline-block', 'width': '120'});
          spaceSelector.css({'display': ' inline-block', 'width': '250'});
          startTime.css({'display': ' inline-block', 'width': '80'});
          endTime.css({'display': ' inline-block', 'width': '80'});
          confirmed.css('margin-left', 430);
          label.css('display','inline');
          comments.css('width', 530);

          confirmedContainer.append(confirmed);
          commentsContainer.append(comments);
          performanceContainer.append(daySelector, spaceSelector, startTime, endTime, removeInputButton);
          performanceBox.append(confirmedContainer, performanceContainer, commentsContainer);

          Object.keys(eventTime).forEach(function(day){
            if(day == 'permanent') return false;
            var date = $('<option>').val(day).text(day);
            daySelector.append(date);
          });

          spaces.forEach(function(space){
            var spaceOption = $('<option>').val(space.profile_id).text(space.name);
            spaceSelector.append(spaceOption);
          });

          daySelector.on('change', function(){
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

            _savePerformance();
            setStartTimes();
            setEndTimes();
          });

          spaceSelector.on('change', function(){
            _spaces[performance.host_id].deletePerformance(performance);
            performance.host_id = spaceSelector.val();
            _savePerformance();
          });

          var setStartTimes = function(){
            startTime.empty();

            var dayStart = new Date(parseInt(eventTime[performance.date][0]));
            var dayEnd = new Date(parseInt(eventTime[performance.date][1]));

            var start = new Date(performance.time[0]);
            var end = new Date(performance.time[1]);
            //Te max value for start is that that puts the end on the limit of the day
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
            startTime.val(performance.time[0]);
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
            endTime.val(performance['time'][1]);
          };


          startTime.on('change', function(){
            var oldStart = performance['time'][0];
            var newStart = parseInt(startTime.val());
            card.css({'top': '+=' + (newStart - oldStart) / 90000});
            performance['time'][0] = newStart;
            performance['time'][1] = performance['time'][1] + (newStart - oldStart);
            setEndTimes();
            _savePerformance();
          });

          endTime.on('change', function(){
            var oldEnd = performance['time'][1];
            var newEnd = parseInt(endTime.val());
            card.css({'height': '+=' + (newEnd - oldEnd) / 90000});
            performance['time'][1] = newEnd;
            setStartTimes();
            _savePerformance();
          });

          removeInputButton.on('click', function(){
            _destroy();
            _closePopup();
          });

          input.on('change', function(){
            performance.confirmed = input.is(":checked");
            if (performance.confirmed) card.find('.checker').append(Pard.Widgets.IconManager('done').render());
            else card.find('.checker').empty();
            _savePerformance();
          });

          comments.on('input', function(){
            performance.comments = comments.val();
            card.find('.commentIcon').empty();
            if (performance.comments) card.find('.commentIcon').append(Pard.Widgets.IconManager('comments').render());
            _savePerformance();
          });

          daySelector.val(performance.date);
          spaceSelector.val(performance.host_id);
          setStartTimes();
          setEndTimes();
          comments.val(performance.comments);
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

        var card = PerformanceCard().render();

        var _addToPrograms = function(){
          _spaces[performance.host_id].addPerformance(performance, card);
          _artists[performance.participant_id].addPerformance(performance);
        }

        var _loadToPrograms = function(){
          _spaces[performance.host_id].addPerformance(performance, card);
          _artists[performance.participant_id].loadPerformance(performance);
        }

        var _destroy = function(){
          _spaces[performance.host_id].deletePerformance(performance);
          _artists[performance.participant_id].deletePerformance(performance.performance_id);
          card.remove();
          delete _program[performance.performance_id];
        }

        return {
          performanceCard: function(){
            return card;
          },
          addToPrograms: _addToPrograms,
          loadPerformance: _loadToPrograms,
          destroy: _destroy,
          performanceManager: PerformanceManager,
          show: performance
        }
      }

      var PermanentPerformance = function(performance){

        performance.time[0] = parseInt(performance.time[0]);
        performance.time[1] = parseInt(performance.time[1]);

        var PerformanceCard = function(){
          var _createdWidget = $('<div>');
          var color = Pard.Widgets.CategoryColor(performance.participant_category);

          var _card =$('<div>').addClass('programHelper').css({
            'position': 'absolute',
            'display': 'inline-block',
            'width': Pard.ColumnWidth - 2,
            'height': Pard.PermanentCardHeight,
            'background': color,
            'white-space': 'normal',
            'box-shadow': 'inset 0 0 1px '
          });
          _card.addClass('dragged-card-call-manager cursor_grab');
          _card.addClass(performance.performance_id);

          var _title = $('<p>').addClass('proposal-title-card-call-manager');
          var _titleTextLong = performance.participant_name + ' - ' + performance.title;
          var _titleText = $('<a>').attr('href','#').text(Pard.Widgets.CutString(_titleTextLong, 35));
          var _confirmationCheck = '';
          var _confirmationCheckContainer = $('<span>').addClass('checker');
          if (performance.confirmed == 'true' || performance.confirmed == true) _confirmationCheck = Pard.Widgets.IconManager('done').render();
          _confirmationCheckContainer.append(_confirmationCheck);
          var _commentIcon = '';
          var _commentIconContainer = $('<span>').addClass('commentIcon');
          if (performance.comments) _commentIconContainer.append(Pard.Widgets.IconManager('comments').render());
          _commentIconContainer.append(_commentIcon);
          _title.append(_confirmationCheckContainer, _commentIconContainer, _titleText);
          _card.append(_title.css({'position': 'absolute'}));

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
              console.log('start')
              _card.removeClass('cursor_grab').addClass('cursor_move');
              _performance = performance;
              ui.helper.data('dropped', false);
              if(_artistsBlock.hasClass('is-active')){
                _artistsBlock.toggle('slide', {direction: 'right'}, 500);
                _artistsBlock.removeClass('is-active');
              }
              _card.css({'opacity': '0.4'});
            },
            stop:function(event, ui){
              _artistsBlock.toggle('slide', {direction: 'right'}, 500);
              _artistsBlock.addClass('is-active');
              _card.removeClass('cursor_move').addClass('cursor_grab');
              _card.css({'opacity': '1'});
              //The card and performance is destroyed if dropped out
              if(ui.helper.data('dropped') == false){
                var artistProgram = _artists[_performance.participant_id].program;
                var performances = Object.keys(artistProgram).map(function(performance_id){
                  return artistProgram[performance_id];
                });
                performances = performances.filter(function(show){
                  return (show.permanent == 'true' && show.participant_proposal_id == performance.participant_proposal_id && show.host_id == performance.host_id);
                });
                performances.forEach(function(show){
                  _program[show.performance_id].destroy();
                });
              }
            }
          });

          //On click the performance shows its program
          _titleText.on('click', function(){
            var _content = $('<div>').addClass('very-fast reveal full');
            _content.empty();
            $('body').append(_content);

            var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
            var _message = Pard.Widgets.PopupContent(performance.title +' (' + performance.participant_name + ')', Manager());
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

        var Manager = function(saveMethod){
          var performancesBox = $('<div>').css('padding', 0);
          var artistProgram = _artists[performance.participant_id].program;
          var performances = Object.keys(artistProgram).map(function(performance_id){
            return artistProgram[performance_id];
          });
          performances = performances.filter(function(show){
            return (show.permanent == 'true' && show.participant_proposal_id == performance.participant_proposal_id);
          });
          performances.forEach(function(show){
            performancesBox.append(_program[show.performance_id].performanceManager(saveMethod).render());
          });

          return {
            render: function(){
              return performancesBox;
            },
            setCallback: function(callback){
              _closePopup = function(){
                performancesBox.remove();
                callback();
              }
            }
          }
        }

        var daySelector = $('<select>');
        daySelector.css({'display': ' inline-block', 'width': '120'});

        var performances;
        var _loadDates = function(){
          daySelector.empty();
          daySelector.attr('disabled', false);
          var artistProgram = _artists[performance.participant_id].program;
          performances = Object.keys(artistProgram).map(function(performance_id){
            return artistProgram[performance_id];
          });
          performances = performances.filter(function(show){
            return (show.permanent == 'true' && show.participant_proposal_id == performance.participant_proposal_id);
          });
          var dates = performances.map(function(show){
            return show.date;
          });
          Object.keys(eventTime).forEach(function(day){
            if(day == 'permanent') return false;
            if($.inArray(day, dates) < 0 || day == performance.date){
              var date = $('<option>').val(day).text(day);
              daySelector.append(date);
            }
          });
          daySelector.val(performance.date);
          if(daySelector.children().length <= 1) daySelector.attr('disabled', true);
        }

        var PerformanceManager = function(saveMethod){
          var performanceBox = $('<div>');
          var performanceContainer = $('<div>').css('height', 40);
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

          spaceSelector.css({'display': ' inline-block', 'width': '250'});
          startTime.css({'display': ' inline-block', 'width': '80'});
          endTime.css({'display': ' inline-block', 'width': '80'});
          confirmed.css('margin-left', 430);
          label.css('display','inline');
          comments.css('width', 530);

          confirmedContainer.append(confirmed);
          commentsContainer.append(comments);
          performanceContainer.append(daySelector, spaceSelector, startTime, endTime, removeInputButton);
          performanceBox.append(confirmedContainer, performanceContainer, commentsContainer);

          _loadDates();

          spaces.forEach(function(space){
            var spaceOption = $('<option>').val(space.profile_id).text(space.name);
            spaceSelector.append(spaceOption);
          });

          daySelector.on('change', function(){
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

            _spaces[performance.host_id].addPerformance(performance, card);
            if(saveMethod == 'load')_artists[performance.participant_id].loadPerformance(performance);
            else{_artists[performance.participant_id].addPerformance(performance);}
            setStartTimes();
            setEndTimes();
            performances.forEach(function(show){
              _program[show.performance_id].loadDates();
            });
          });

          spaceSelector.on('change', function(){
            _spaces[performance.host_id].deletePerformance(performance);
            performance.host_id = spaceSelector.val();
            _spaces[performance.host_id].addPerformance(performance, card);
            if(saveMethod == 'load')_artists[performance.participant_id].loadPerformance(performance);
            else{_artists[performance.participant_id].addPerformance(performance);}
          });

          var setStartTimes = function(){
            startTime.empty();
            var dayStart = new Date(parseInt(eventTime[performance.date][0]));
            var maxStart = new Date(parseInt(performance.time[1]));
            maxStart.setMinutes(maxStart.getMinutes() - 15);

            while(dayStart <= maxStart){
              var hours = dayStart.getHours();
              var minutes = dayStart.getMinutes();
              if(hours < 10) hours = '0' + hours;
              if(minutes < 10) minutes = '0' + minutes;
              var startOption = $('<option>').val(dayStart.getTime()).text(hours + ':' + minutes);
              startTime.append(startOption);
              dayStart.setMinutes(dayStart.getMinutes() + 15);
            };
            startTime.val(performance.time[0]);
          }

          var setEndTimes = function(){
            endTime.empty();
            var dayEnd = new Date(parseInt(eventTime[performance.date][1]));
            var minEnd = new Date(parseInt(performance.time[0]) + 15 * 60000);

            while(minEnd <= dayEnd){
              var hours = minEnd.getHours();
              var minutes = minEnd.getMinutes();
              if(hours < 10) hours = '0' + hours;
              if(minutes < 10) minutes = '0' + minutes;
              var endOption = $('<option>').val(minEnd.getTime()).text(hours + ':' + minutes);
              endTime.append(endOption);

              minEnd.setMinutes(minEnd.getMinutes() + 15);
            };
            endTime.val(performance.time[1]);
          }


          startTime.on('change', function(){
            performance.time[0] = parseInt(startTime.val());
            setEndTimes();
            _spaces[performance.host_id].addPerformance(performance, card);
            if(saveMethod == 'load')_artists[performance.participant_id].loadPerformance(performance);
            else{_artists[performance.participant_id].addPerformance(performance);}
          });

          endTime.on('change', function(){
            performance.time[1] = parseInt(endTime.val());
            setStartTimes();
            _spaces[performance.host_id].addPerformance(performance, card);
            if(saveMethod == 'load')_artists[performance.participant_id].loadPerformance(performance);
            else{_artists[performance.participant_id].addPerformance(performance);}
          });

          removeInputButton.on('click', function(){
            _spaces[performance.host_id].deletePerformance(performance);
            _artists[performance.participant_id].deletePerformance(performance.performance_id);
            card.remove();
            performanceBox.remove();
            delete _program[performance.performance_id];
            performances.splice(performances.indexOf(performance), 1);
            performances.forEach(function(show){
              _program[show.performance_id].loadDates();
            });
          });

          input.on('change', function(){
            performance.confirmed = input.is(":checked");
            if (performance.confirmed) card.find('.checker').append(Pard.Widgets.IconManager('done').render());
            else card.find('.checker').empty();
            _spaces[performance.host_id].addPerformance(performance, card);
            if(saveMethod == 'load')_artists[performance.participant_id].loadPerformance(performance);
            else{_artists[performance.participant_id].addPerformance(performance);}
          });

          comments.on('input', function(){
            performance.comments = comments.val();
            card.find('.commentIcon').empty();
            if (performance.comments) card.find('.commentIcon').append(Pard.Widgets.IconManager('comments').render());
            _spaces[performance.host_id].addPerformance(performance, card);
            if(saveMethod == 'load')_artists[performance.participant_id].loadPerformance(performance);
            else{_artists[performance.participant_id].addPerformance(performance);}
          });

          daySelector.val(performance.date);
          spaceSelector.val(performance.host_id);
          setStartTimes();
          setEndTimes();
          comments.val(performance.comments);
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

        var card = PerformanceCard().render();

        var _addToPrograms = function(){
          _spaces[performance.host_id].addPerformance(performance, card);
          _artists[performance.participant_id].addPerformance(performance);
        }

        var _loadToPrograms = function(){
          _spaces[performance.host_id].addPerformance(performance, card);
          _artists[performance.participant_id].loadPerformance(performance);
        }

        var _destroy = function(){
          _spaces[performance.host_id].deletePerformance(performance);
          _artists[performance.participant_id].deletePerformance(performance.performance_id);
          card.remove();
          delete _program[performance.performance_id];
        }


        return {
          performanceCard: function(){
            return card;
          },
          addToPrograms: _addToPrograms,
          destroy: _destroy,
          loadPerformance: _loadToPrograms,
          performanceManager: PerformanceManager,
          loadDates: _loadDates,
          show: performance
        }
      }

      var ToolsDropdownMenu = function(){
        var _menu = $('<ul>').addClass('menu');

        var _outOfprogramBtn = $('<li>').text('Artistas sin programación');
        _outOfprogramBtn.on('click', function(){
          var _content = $('<div>').addClass('very-fast reveal full');
          _content.empty();
          $('body').append(_content);
          var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
          var _message = Pard.Widgets.PopupContent('Artistas fuera del programa', ArtistOutOfProgram());
          _message.setCallback(function(){
            _content.remove();
            _popup.close();
          });
          _content.append(_message.render());
          _popup.open();
        });

        var _orderSpaceBtn = $('<li>').text('Ordena Espacios');
        _orderSpaceBtn.on('click', function(){
          var _content = $('<div>').addClass('very-fast reveal full');
          _content.empty();
          $('body').append(_content);
          var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
          var _message = Pard.Widgets.PopupContent('Ordena Espacios', OrderSpace());
          _message.setCallback(function(){
            _content.remove();
            _popup.close();
          });
          _content.append(_message.render());
          _popup.open();
        });

        var ArtistOutOfProgram = function(){
          var _createdWidget = $('<div>').addClass('artist-out-of-program-popup-content');
          var columns = ['name', 'title', 'category'];
          var _tableCreated = $('<table>').addClass('table-proposal stripe row-border artist-out-of-program-table').attr({'cellspacing':"0", 'width':"100%"});
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
          Object.keys(_artists).forEach(function(profile_id){
            var proposals = _artists[profile_id].proposals;
            var artistProgram = _artists[profile_id].program;
            var program = Object.keys(artistProgram).map(function(performance_id){
              return artistProgram[performance_id];
            });
            var noSelected = proposals.filter(function(proposal){
              return program.every(function(show){
                return show.participant_proposal_id != proposal.proposal_id;
              });
            });
            noSelected.forEach(function(proposal){
              var _row = $('<tr>');
              columns.forEach(function(field){
                var _col = $('<td>');
                if (field == 'category')_col.append(Pard.Widgets.Dictionary(proposal[field]).render());
                else {_col.append(proposal[field]);}
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
            "scrollY": "90vh",
            "bAutoWidth": false,
            "paging": false,
            "scrollCollapse": true,
            aaSorting: []
          });

          var _filterCategoryContainer = $('<div>').addClass('select-category-container-artistOutOfProgram');
          var _filterCategory = $('<select>');
          var _searchTags = [{id:'all', 'text':'Todas las categorias'}];
          ['arts', 'audiovisual', 'expo','music', 'street_art','workshop', 'other'].forEach(function(cat){
            _searchTags.push({id:cat, text: Pard.Widgets.Dictionary(cat).render(), icon: cat});
          });

          _filterCategoryContainer.append(_filterCategory);
          _filterCategory.select2({
            data: _searchTags,
            templateResult: Pard.Widgets.FormatResource
          });


          _filterCategory.on('select2:select',function(){
            var _cat =  _filterCategory.select2('data')[0];
            if (_cat.id == 'all') _dataTable.columns( 2 ).search('').draw();
            else _dataTable.columns( 2 ).search(_cat.text).draw();
          });

          _createdWidget.prepend(_filterCategoryContainer);

          return {
            render: function(){
              return _createdWidget;
            },
            setCallback: function(callback){
              callback;
            }
          }
        }

        var OrderSpace = function(spaceSelector){
          var _createdWidget = $('<div>');
          var _dictionaryColor = {
            home: 'rgb(240, 239, 179)',
            commercial: 'rgb(196, 245, 239)',
            open_air: 'rgb(218, 227, 251)',
            cultural_ass: 'rgb(238, 212, 246)'
          }

          var _listSortable = $('<ul>');
          _listSortable.sortable({cursor: "move"});
          _listSortable.disableSelection();

          var _printSpaceCard = function(space, index){
            var _order = index + 1;
            var _spaceCard = $('<li>').text(_order + '. ' + space.name).addClass('ui-state-default sortable-space-card').css('background', _dictionaryColor[space.category]).attr('id', space.profile_id);
            return _spaceCard
          }

          spaces.forEach(function(space, index){
            _listSortable.append(_printSpaceCard(space, index));
          });

          var _orderButtonsContainer = $('<div>').addClass('order-buttons-container');
          var _orderText = $('<span>').text('Ordena por:');

          var _alphaBtn = Pard.Widgets.Button('A --> Z', function(){
            _listSortable.empty();
            spaces.sort(function(s1, s2){
              return s1.name.localeCompare(s2.name);
            });
            spaces.forEach(function(sp, n){
              _listSortable.append(_printSpaceCard(sp, n));
            });
          });

          var _catOrderBtn = Pard.Widgets.Button('Categoría', function(){
            _listSortable.empty();
            var _catArrays = {
              home: [],
              cultural_ass: [],
              commercial:[],
              open_air:[]
            }
            spaces.forEach(function(spa){
              _catArrays[spa.category].push(spa);
            });
            spaces = [];
            for (var cat in _catArrays){
              spaces = spaces.concat(_catArrays[cat]);
            }
            spaces.forEach(function(sp, n){
              _listSortable.append(_printSpaceCard(sp, n));
            });
          });

          var _OKbtn = Pard.Widgets.Button('OK', function(){
            // _shownSpaces = [];
            // var list = _listSortable.sortable('toArray'));
            // spaces.forEach(function(space, index){
            //   _shownSpaces.push(space);
            //   if(index >= spaces.length - 1) return;
            //   Object.keys(eventTime).forEach(function(date){
            //     _spaces[space.profile_id].columns[date].after(_spaces[spaces[(index + 1)].profile_id].columns[date]);
            //   });
            // });
            // spaces.forEach(function(space, index){
            //   _spaces[space.profile_id].alignPerformances(_daySelector.val());
            // });
            // _closePopup();
          });

          var _OKbtnContainer = $('<div>').addClass('OK-btn-container-popup');
          _OKbtnContainer.append(_OKbtn.render());
          _orderButtonsContainer.append(_catOrderBtn.render(), _alphaBtn.render(),  _orderText);
          _createdWidget.append(_orderButtonsContainer, _listSortable, _OKbtnContainer);
          return {
            render: function(){
              return _createdWidget;
            },
            setCallback: function(callback){
              _closePopup = callback
            }
          }
        }

        _menu.append(_outOfprogramBtn, _orderSpaceBtn);
        var _menuContainer = $('<ul>').addClass('dropdown menu tools-btn').attr({'data-dropdown-menu':true, 'data-disable-hover':true,'data-click-open':true});
        var _iconDropdownMenu = $('<li>').append(
          $('<button>').attr('type','button').append(
            Pard.Widgets.IconManager('tools').render()
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

      _artistsBlock.append(_artistSelectorContainer, _artistsListContainer);
      artists.forEach(function(artist){
        _artists[artist.profile_id] = new Artist(artist);
        _artistsList.append(_artists[artist.profile_id].accordion);
      });

      spaces.forEach(function(space){
        _spaces[space.profile_id] = new Space(space);
        _shownSpaces.push(space);
      });
      if(spaces.length > 0 && spaces.length < 4) Pard.ColumnWidth = Pard.ColumnWidth * 4 / spaces.length;

       var _submitBtnText = $('<p>').html('Guarda </br>los cambios').addClass('save-text-call-manager');

      var _submitBtn = Pard.Widgets.Button('', function(){
        var program = [];
        Object.keys(_program).forEach(function(performance_id){
          program.push(_program[performance_id].show);
        });

        var order = [];
        spaces.forEach(function(space){
          order.push(space.profile_id);
        });

        Pard.Backend.saveProgram(the_event.event_id, program, order, Pard.Events.SaveProgram);
      }).render().addClass('submit-program-btn-call-manager');
      _submitBtn.append(Pard.Widgets.IconManager('save').render());
      // _submitBtnContainer.append(_submitBtnText)
      _submitBtnContainer.append(_submitBtn);

       _toolsContainer.append(ToolsDropdownMenu().render());
      _tableBox.append(_timeTableContainer, _tableContainer, _artistsBlock);
      _createdWidget.append(_buttonsContainer.append( _toolsContainer, _submitBtnContainer), _selectors.append(_daySelectorContainer, _spaceSelectorContainer,  _showArtists));
      _createdWidget.append(_tableBox);

      if(the_event.program){
        the_event.program.forEach(function(performance){
          if(performance.permanent == 'true') _program[performance.performance_id] = new PermanentPerformance(performance);
          else{_program[performance.performance_id] = new Performance(performance);}
          _program[performance.performance_id].loadPerformance();
        });
        var align = function(){
          setTimeout(function(){
            if(spaces.length < 2 || _spaces[spaces[1].profile_id].columns[_daySelector.val()].position().left != 0){
              Object.keys(_spaces).forEach(function(profile_id){
                _spaces[profile_id].alignPerformances(_daySelector.val());
              });
            }
            else{align();}
          }, 500);
        }
        align();
      }

    	return {
        render: function(){
          return _createdWidget;
        },
        addArtist: function(artist){
          if(artist.profile_id in _artists) _artists[artist.profile_id].addProposal(artist.proposals[0]);
          else{_artists[artist.profile_id] = new Artist(artist);
            _artistsList.append(_artists[artist.profile_id].accordion);
            artists.push(artist);
            var _id = _artistSelector.val();
             _loadArtistSelector();
            _artistSelector.trigger('reload', [_id]);
          }
        },
        addSpace: function(space){
          if(!(space.profile_id in _spaces)){
            _spaces[space.profile_id] = new Space(space);
            spaces.push(space);
            var _id = _spaceSelector.val();
            _loadSpaceSelector();
            _spaceSelector.trigger('reload', [_id]);
          }
        },
        deleteArtist: function(profile_id, proposal_id){
          if(profile_id in _artists){
            var artistProgram = _artists[profile_id].program;
            Object.keys(artistProgram).forEach(function(performance_id){
              if(artistProgram[performance_id].participant_proposal_id == proposal_id) _program[performance_id].destroy();
            });
            _artists[profile_id].deleteProposal(proposal_id);
            var _id = _artistSelector.val();
            _loadArtistSelector();
            _artistSelector.trigger('reload', [_id]);
          }
        },
        deleteSpace: function(profile_id){
          if(profile_id in _spaces){
            spaces = spaces.filter(function(space){
              return space.profile_id != profile_id;
            });
            Object.keys(eventTime).forEach(function(day){
              _spaces[profile_id].columns[day].remove();
            });
            Object.keys(_spaces[profile_id].program).forEach(function(performance_id){
              _program[performance_id].destroy();
            });
            delete _spaces[profile_id];
            var _id = _spaceSelector.val();
            _loadSpaceSelector();
            _spaceSelector.trigger('reload', [_id]);
          }
        },
        deletePerformance: function(performance_id){
          if(performance_id in _program){
            _program[performance_id].destroy();
          }
        }
      }
    }

    var TableManager = function(){
      var _createdWidget = $('<div>');
      var _typeSelectorBox = $('<div>').addClass('types-selector-call-manager');
      var _typeSelector = $('<select>');

      var _dataTables = {}
      var _tablesContainer = {}

      var _tags = [];
      _tags.push({
        id: 'artists',
        text: 'Artistas',
        icon: 'artist'
      });
      _tags.push({
        id: 'spaces',
        text: 'Espacios',
        icon: 'space',
      });
      _typeSelectorBox.append(_typeSelector);

      _typeSelector.select2({
        data: _tags,
        templateResult: Pard.Widgets.FormatResource,
        minimumResultsForSearch: -1
      });

      var lastTypeSelected = 'artists'
      _typeSelector.on('select2:select', function(){
        var _data = _typeSelector.select2('data')[0];
        if(_data['id'] != lastTypeSelected){
          _tablesContainer[lastTypeSelected].hide();
          _tablesContainer[_data['id']].show();
          lastTypeSelected = _data['id'];
        }
      });

      _tablesContainer.spaces = $('<div>');
      _tablesContainer.artists = $('<div>');
      _dataTables.spaces = Pard.Widgets.SpacesTable();
      _dataTables.artists = Pard.Widgets.ArtistsTable();

      spaces.forEach(function(space){
        var _row = $('<tr>');
        var _rfhCol = $('<td>').addClass('column-call-manager-table column-rfh');
        var _nameCol = $('<td>').addClass('column-call-manager-table column-name');
        var _addressCol = $('<td>').addClass('column-call-manager-table column-address');
        var _emailCol = $('<td>').addClass('column-call-manager-table column-email');
        var _phoneCol = $('<th>').addClass('column-call-manager-table column-phone');

        var _icon = $('<a>').append(Pard.Widgets.IconManager('space').render());
        _icon.attr({'href': '/profile?id=' + space.profile_id, 'target':'_blank'});
        var _name = $('<a>').attr({'href':'#'}).text(space.name);
        var _addressText = ' '+ space['address']['route'] + ' ' + space['address']['street_number'];
        if (space['address']['door']) _addressText += ', puerta/piso ' + space['address']['door'];
        _addressText += ', ' + space['address']['locality'];
        var _aStr = space['address']['route'] + ' ' + space['address']['street_number'] + ', ' + space['address']['locality'] + ' ' + space['address']['country'];
        var _address = $('<a>').attr({
          href: 'http://maps.google.com/maps?q=' + _aStr,
          target: '_blank'
        }).text(_addressText);

        _name.on('click', function(){
          if (!(_forms)) {
            Pard.Backend.getCallForms(the_event.call_id, function(data){
              _forms = data.forms;
              Pard.Widgets.DisplayPopupProposal(space, _forms['space'][space.form_category],the_event.name);
            });
          }
          else{
            Pard.Widgets.DisplayPopupProposal(space, _forms['space'][space.form_category],the_event.name);
          }
        });

        _rfhCol.append(_icon);
        _nameCol.html(_name);
        _addressCol.append(_address);
        _emailCol.html(space.email);
        _phoneCol.html(space.phone);

        _row.append(_rfhCol, _nameCol, _addressCol, _emailCol, _phoneCol);
        _dataTables.spaces.tbody.append(_row);
      });

      artists.forEach(function(artist){
        artist.proposals.forEach(function(proposal){
          var _row = $('<tr>');
          var _rfhCol = $('<td>').addClass('column-call-manager-table column-rfh');
          var _nameCol = $('<td>').addClass('column-call-manager-table column-name');
          var _categoryCol = $('<th>').addClass('column-call-manager-table column-category').text('Categoría');
          var _titleCol = $('<th>').addClass('column-call-manager-table column-title').text('Título');
          var _emailCol = $('<td>').addClass('column-call-manager-table column-email');
          var _phoneCol = $('<th>').addClass('column-call-manager-table column-phone');

          var _icon = $('<a>').append(Pard.Widgets.IconManager('artist').render());
          _icon.attr({'href': '/profile?id=' + artist.profile_id, 'target':'_blank'});
          var _name = $('<a>').attr({'href':'#'}).text(artist.name);
          proposal.name = artist.name;
          proposal.phone = artist.phone;
          proposal.email = artist.email;
          _name.on('click', function(){
            if (!(_forms)) {
              Pard.Backend.getCallForms(the_event.call_id, function(data){
                _forms = data.forms;
                Pard.Widgets.DisplayPopupProposal(proposal, _forms['artist'][proposal.form_category],the_event.name);
              });
            }
            else{
              Pard.Widgets.DisplayPopupProposal(proposal, _forms['artist'][proposal.form_category],the_event.name);
            }
          });

          _rfhCol.append(_icon);
          _nameCol.html(_name);
          _categoryCol.html(Pard.Widgets.Dictionary(proposal.category).render());
          _titleCol.html(proposal.title);
          _emailCol.html(artist.email);
          _phoneCol.html(artist.phone);

          _row.append(_rfhCol, _nameCol, _categoryCol, _titleCol, _emailCol, _phoneCol);
          _dataTables.artists.tbody.append(_row);
        });
      });

      $(document).ready(function() {
        Object.keys(_dataTables).forEach(function(type){
          _dataTables[type].table.DataTable({
            "language":{
            "lengthMenu": " Resultados por página _MENU_",
            "zeroRecords": "Ningún resultado",
            "info": "",
            "infoEmpty": "Ningúna información disponible",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "search": "Busca",
            "paginate": {
              "first":      "Primera",
              "last":       "Última",
              "next":       "Siguiente",
              "previous":   "Anterior"
            },
           "search": "_INPUT_",
            "searchPlaceholder": "Busca"
          },
          fixedHeader: {
            header: true
          },
          "scrollX": true,
          "scrollY": "90vh",
          "paging": false,
          "scrollCollapse": true,
          // 'responsive': true,
          // 'colReorder': true,
          // "columnDefs": [
          //   { "visible": false, "targets": _hiddenColumnsArray }
          //   ],
          // keys: true,
          dom: 'Bfrtip',
          buttons: [
            {
                extend: 'copy',
                text: 'Copia',
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
              extend: 'excel',
              exportOptions: {
                  columns: ':visible'
              },
              filename: 'Tabla_espacios'

            },
            // {
            //   extend: 'pdf',
            //   exportOptions: {
            //       columns: ':visible'
            //   },
            //   orientation: 'landscape',
            //   filename: _titleFile[_selected]
            // }
            // {
            //   extend: 'print',
            //   text: 'Imprime',
            //   exportOptions: {
            //     modifier: {
            //         page: 'current'
            //     }
            //   },
            //   title: _titleFile[_selected]
            // }
          ]
          });
        });
      });
      //_spaceTable.columns.adjust().draw(true);

      _tablesContainer.artists.append(_dataTables.artists.table);
      _tablesContainer.spaces.append(_dataTables.spaces.table);
      _tablesContainer.spaces.hide();
      _createdWidget.append(_typeSelectorBox, _tablesContainer.artists, _tablesContainer.spaces);

      return {
        render: function(){
          return _createdWidget;
        }
      }
    }

    var ProposalsManager = function(){
      var _createdWidget = $('<div>');
      var _addProposalBox = $('<div>').addClass('add-proposal-box');
      var _whiteListBox = $('<div>').addClass('white-list-box');
      var _addProposalText = $('<p>').text('Añade propuestas a tu convocatoria para que puedas insertarlas en la programación').addClass('initial-text-proposalPanel');
      var _whiteListText = $('<p>').text('Habilita usuarios para que puedan enviar una propuesta en cualquier momento').addClass('initial-text-proposalPanel');
      var _artistIcon = Pard.Widgets.IconManager('artist').render().addClass('create-profile-btn-icon');
      var _spaceIcon = Pard.Widgets.IconManager('space').render().addClass('create-profile-btn-icon');
      var _artistButtonHtml = $('<div>').append(_artistIcon, $('<span>').text('Artista').addClass('create-profile-btn-text'));
      var _spaceButtonHtml = $('<div>').append(_spaceIcon, $('<span>').text('Espacio').addClass('create-profile-btn-text'));

      var _createSpaceCaller = $('<div>').html(_spaceButtonHtml).addClass('create-space-proposal-call-page-btn');
      var _createArtistCaller = $('<div>').html(_artistButtonHtml).addClass('create-artist-proposal-call-page-btn');

      var _forms;

      var _callbackCreatedProposal = function(data){
        console.log(data);
        if(data['status'] == 'success') {
          var _proposal = data.call.proposals[data.call.proposals.length -1];
          var _proposalContainer = $('<li>');
          var _printedProposal = Pard.Widgets.PrintOwnProposal(_proposal, _proposalContainer); 
          if (_proposal.type == 'space'){ 
            _spacesList.prepend(_proposalContainer.append(_printedProposal.render()));
            _proposalsManager.addSpace(_proposal)
          }
          else {
            _artistsList.prepend(_proposalContainer.append(_printedProposal.render()));
            _proposalsManager.addArtist(_proposal);
          }
          Pard.Widgets.Alert('', 'Propuesta creada correctamente.');
        }
        else{
          Pard.Widgets.Alert('',data.reason);
          // Pard.Widgets.Alert('¡Error!', 'No se ha podido guardar los datos', function(){location.reload();})
        }  
      }

      var _openPopupForm = function(type){
        var _content = $('<div>').addClass('very-fast reveal full top-position').attr('id','popupForm');
        _content.empty();
        $('body').append(_content);
        var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
        var _message = Pard.Widgets.PopupContent('Crea una propuesta', Pard.Widgets.CreateOwnProposal(_forms[type], type, _callbackCreatedProposal));
        _message.setCallback(function(){
          _content.remove();
          _popup.close();
        });
        _content.append(_message.render());
        _popup.open();
      }

      _createArtistCaller.click(function(){
        if (!(_forms)) Pard.Backend.getCallForms(the_event.call_id, function(data){
          _forms = data.forms;
          _openPopupForm('artist');
        })
        else _openPopupForm('artist');
      });

      _createSpaceCaller.click(function(){
        if (!(_forms)) Pard.Backend.getCallForms(the_event.call_id, function(data){
          _forms = data.forms;
          _openPopupForm('space');
        })
        else _openPopupForm('space');
      });

      var _artistsList = $('<ul>').addClass('own-proposals-list').attr('id','artist-list-call-page');
      var _spacesList= $('<ul>').addClass('own-proposals-list').attr('id','space-list-call-page');

      var _spacesOwnBox = $('<div>').addClass('ownBox-call-manager');
      var _artistsOwnBox = $('<div>').addClass('ownBox-call-manager');

      // var _artistProposalsList = [];

      the_event.artists.forEach(function(proposal){
        var lastElement = proposal.profile_id.split('-').pop();
        if (lastElement == 'own') {
          var _proposalContainer = $('<li>');
          var _artistProposal = Pard.Widgets.PrintOwnProposal(proposal, _proposalContainer);
          // _artistProposalsList.push(_artistProposal);
          _artistsList.prepend(_proposalContainer.append(_artistProposal.render()));
          // _artistProposal.setDeleteProposalCallback(_proposalContainer);
        }
      })
      
      the_event.artists.forEach(function(proposal){
        var lastElement = proposal.profile_id.split('-').pop();
        if (lastElement == 'own') {
          var _proposalContainer = $('<li>');
          var _spaceProposal = Pard.Widgets.PrintOwnProposal(proposal, _proposalContainer);
          _spacesList.prepend(_proposalContainer.append(_spaceProposal.render()));
        }
      });

      var _whiteList = Pard.Widgets.WhiteList(the_event);
      // var _buttons = $('<div>').append(_spacePopup.render(), _artistPopup.render()).addClass('buttonsCOntainer-call-page');

      _artistsOwnBox.append(_createArtistCaller, _artistsList);
      _spacesOwnBox.append(_createSpaceCaller, _spacesList);
      _addProposalBox.append(_addProposalText, _artistsOwnBox, _spacesOwnBox);
      _whiteListBox.append(_whiteListText, _whiteList.render());
      _createdWidget.append(_addProposalBox, _whiteListBox);

      return {
        render: function(){
          return _createdWidget;
        }
      }
    }

    var _programManager = ProgramManager();
    var _tableManager = TableManager();
    var _proposalsManager = ProposalsManager();
    var _qrManager = Pard.Widgets.QRManager(the_event.qr);

    var newArtist = {
      "user_id" : "db3822e5-eb3a-4ebf-81c7-58b245129195",
      "email" : "trencadisx2@gmail.com",
      "profile_id" : "431fe94b-c05d-493a-a40e-f411fd7506cd",
      "name" : "Trencadiss",
      "phone" : "680569013",
      "address" : {
        "locality" : "Barcelona",
        "postal_code" : "08004"
      },
      "proposals" : [
        {
          "production_id" : "f3d62e6f-f68d-4c46-bee9-443e17cd79aa",
          "proposal_id" : "f63f1f4d-fd26-4fe0-a131-4393195d1cd1",
          "category" : "music",
          "title" : "Trencadiss",
          "description" : "Un concierto acústico de nuestras propias canciones y alguna versión. Dos guitarras, dos voces. Dos músicos. \n",
          "short_description" : "Trencadiss. Grupo indie pop rock. Barcelona. Concierto acústico. ",
          "conditions" : "true",
          "children" : "false",
          "sharing" : "dos micrófonos, cables y dos pies de micro",
          "needs" : "Un equipo de voces. ",
          "waiting_list" : "false",
          "duration" : "45",
          "availability" : [
              "2016-10-15"
          ],
          "components" : "2",
          "repeat" : "true"
        }
      ]
    }

    var newArtist2 = {
      "user_id" : "db3822e5-eb3a-4ebf-81c7-58b245129195",
      "email" : "trencadisx2@gmail.com",
      "profile_id" : "431fe94b-c05d-493a-a40e-f411fd7506cd",
      "name" : "Trencadiss",
      "phone" : "680569013",
      "address" : {
        "locality" : "Barcelona",
        "postal_code" : "08004"
      },
      "proposals" : [
        {
          "production_id" : "f3d62e6f-f68d-4c46-bee9-443e17cd79aa",
          "proposal_id" : "f63f1f4d-fd26-4fe0-a131-4393195d1cd2",
          "category" : "music",
          "title" : "Trencadiss",
          "description" : "Un concierto acústico de nuestras propias canciones y alguna versión. Dos guitarras, dos voces. Dos músicos. \n",
          "short_description" : "Trencadiss. Grupo indie pop rock. Barcelona. Concierto acústico. ",
          "conditions" : "true",
          "children" : "false",
          "sharing" : "dos micrófonos, cables y dos pies de micro",
          "needs" : "Un equipo de voces. ",
          "waiting_list" : "false",
          "duration" : "45",
          "availability" : [
              "2016-10-15"
          ],
          "components" : "2",
          "repeat" : "true"
        }
      ]
    }

    var newSpace = {
      "responsible" : "riccardo toto",
      "description" : "- pasillo largo y estrecho donde se puede exponer (15m2)\n- salon con ventanas al patio (8 m2)\n- un patio interior para conciertitos, poesia, teatro.\n",
      "availability" : [
          "2016-10-15",
          "2016-10-16"
      ],
      "phone" : "633753471",
      "sharing" : "un equipo de sonido pequeno, una nevera de bar, escaleras, herramientas, agua, tomas de luz, sillas, una mesa, 2 mesitas, un mueble/barra",
      "own" : "posible infopoint, espacio jolly",
      "un_wanted" : "mejor no hacer actividades y mantener el espacio util para cosas del ultimo momento y para con tranuqilidad ;)",
      "conditions" : null,
      "user_id" : "a6e3b8df-2088-4c4c-a67c-c8939afbeb63",
      "email" : "riccardo.toto@gmail.com",
      "profile_id" : "1074d199-5f90-4530-865a-7289d2e73725",
      "proposal_id" : "fd2727fe-bfb7-4411-aa29-9e4443663d49",
      "category" : "home",
      "address" : {
        "route" : "Carrer de la Mare de Déu de l'Assumpció",
        "street_number" : "4",
        "door" : "b",
        "locality" : "València",
        "country" : "Spain",
        "postal_code" : "46020",
        "location" : {
            "lat" : 39.4863166,
            "lng" : -0.3598083
        }
      },
      "name" : "4b"
    }

    //_programManager.addSpace(newSpace);
    //_programManager.deleteSpace(newSpace.profile_id);
    //_programManager.addArtist(newArtist2);
    //_programManager.deleteArtist(newArtist.profile_id, "f63f1f4d-fd26-4fe0-a131-4393195d1cd1");

    var _lastSelectedPanel = _programManager;
    _programTab.on('click', function(){
      if(_lastSelectedPanel != _programManager){
        _lastSelectedPanel.render().hide();
        _programManager.render().show();
        _lastSelectedPanel = _programManager;
      }
    });
    _tableTab.on('click', function(){
      if(_lastSelectedPanel != _tableManager){
        _lastSelectedPanel.render().hide();
        _tableManager.render().show();
        _lastSelectedPanel = _tableManager;
      }
    });
    _proposalsTab.on('click', function(){
      if(_lastSelectedPanel != _proposalsManager){
        _lastSelectedPanel.render().hide();
        _proposalsManager.render().show();
        _lastSelectedPanel = _proposalsManager;
      }
    });
    _qrTab.on('click', function(){
      if(_lastSelectedPanel != _qrManager){
        _lastSelectedPanel.render().hide();
        _qrManager.render().show();
        _lastSelectedPanel = _qrManager;
      }
    });

    _tabs.append( _tableTab, _proposalsTab, _programTab, _qrTab);
    _navigationContainer.append(_goToEventBtn, _tabs);
    _panels.append(_programManager.render(), _tableManager.render().hide(), _proposalsManager.render().hide(), _qrManager.render().hide());
    _mainLarge.append(_navigationContainer, _title, _panels);
    _main.append(_mainLarge);

    return {
      render: function(){
// <<<<<<< HEAD
//       //add empty column to the end so that artists list does not cover any space
//       Object.keys(eventTime).forEach(function(day){
//         _tables[day].append($('<div>').css({
//           'display': 'inline-block',
//           'width': '11rem',
//         }))
//       });

//       return _createdWidget;
// =======
        return _main;
      }
    }
  }
}(Pard || {}));
