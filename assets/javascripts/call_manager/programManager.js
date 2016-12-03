'use strict';

(function(ns){

  ns.ProgramManager = function(the_event, displayer){

    var artists = the_event.artists;
    var spaces = the_event.spaces;

    var timeManager = Pard.Widgets.TimeManager(the_event.eventTime);
    var hours = timeManager.hours;
    the_event.eventTime = timeManager.eventTime;
    var eventTime = the_event.eventTime;

    var _program = Pard.Program(the_event);  

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
    var _columnsSpaces = {};

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
      var _emptyColumn = $('<div>').css({
        'display': 'inline-block',
        'width': '11rem',
      });
      _tables[day] = _table;
      if(index == 0) _tableContainer.append(_tables[day]);
      else _tableContainer.append(_tables[day].hide());
    });

    var _selectors = $('<div>').addClass('selectors-call-manager');
    var _buttonsContainer = $('<div>').addClass('buttons-container-call-manager');

    var _toolsContainer = $('<div>').addClass('tools-buttons-container');
    var _submitBtnContainer = $('<div>').addClass('submit-program-btn-container');

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
      Object.keys(artists).forEach(function(profile_id){
        artists[profile_id].setDay(_daySelector.val());
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
        Object.keys(the_event.spaces).forEach(function(profile_id){
          if(the_event.spaces[profile_id].space.category == _data['id']){
            the_event.spaces[profile_id].showColumns();
            _shownSpaces.push(profile_id);
          }
          else{ the_event.spaces[profile_id].hideColumns();}
        });
      }
      else{
        Object.keys(the.event.spaces).forEach(function(profile_id){
          if(profile_id == _spaceSelector.val()){
            the_event.spaces[profile_id].showColumns();
            _shownSpaces.push(profile_id);
          }
          else{the_event.spaces[profile_id].hideColumns();}
        });
      }
      Pard.ColumnWidth = 176;
      if(_shownSpaces.length < 4) Pard.ColumnWidth = Pard.ColumnWidth * 4 / _shownSpaces.length;
      _shownSpaces.forEach(function(profile_id, index){
        var position = Pard.ColumnWidth * index + 1;
        the_event.spaces[profile_id].alignPerformances(position);
      });
    }

    var selectArtists = function(){
      var _data = _artistSelector.select2('data')[0];
      if(_data['type'] == 'category'){
        Object.keys(artists).forEach(function(profile_id){
          if (artists[profile_id].proposals.some(function(proposal){
            return proposal.category == _data['id'];
          })) artists[profile_id].accordion.show();
          else{artists[profile_id].accordion.hide();}
        });
      }
      else{
        Object.keys(artists).forEach(function(profile_id){
          if(profile_id == _artistSelector.val()){
            artists[_artistSelector.val()].accordion.show();
            artists[_artistSelector.val()].accordion.find('.accordion-item').trigger('click');
          }
          else{artists[profile_id].accordion.hide();}
        });
      }
    }

    var _loadSpaceSelector = function(){
      spaceProposals = Pard.Widgets.SpaceProposals();
      Object.keys(the_event.spaces).forEach(function(profile_id){
        spaceProposals.push({
          type: 'profile',
          id: profile_id,
          text: the_event.spaces[profile_id].space.name
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
      Object.keys(artists).forEach(function(profile_id){
        artistProposals.push({
          id: profile_id,
          text: artists[profile_id].name
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
      if(Object.keys(the_event.spaces).length < 4) Pard.ColumnWidth = Pard.ColumnWidth * 4 / Object.keys(the_event.spaces).length;
      Object.keys(the_event.spaces).forEach(function(profile_id, index){
        var position = Pard.ColumnWidth * index + 1;
        the_event.spaces[profile_id].showColumns();
        the_event.spaces[profile_id].alignPerformances(position);
        _shownSpaces.push(profile_id);
      });
      $(this).val("");
      $(this).trigger('change');
      e.preventDefault();
    });

    _artistSelector.on("select2:unselecting", function(e){
      Object.keys(artists).forEach(function(profile_id){
        artists[profile_id].accordion.show();
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

    var _program = {};

    var _performance;
    var lastArtist;
    var _closePopup;

    Pard.Bus.on('drag', function(performance){
      if(_artistsBlock.hasClass('is-active')){
        _artistsBlock.toggle('slide', {direction: 'right'}, 500);
        _artistsBlock.removeClass('is-active');
      }
      _performance = performance;
    });

    Pard.Bus.on('stop', function(performance){
      _artistsBlock.toggle('slide', {direction: 'right'}, 500);
      _artistsBlock.addClass('is-active');
    });

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
        Object.keys(artists).forEach(function(profile_id){
          var proposals = artists[profile_id].proposals;
          var artistProgram = artists[profile_id].program;
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

      _menu.append(_outOfprogramBtn);
      var _menuContainer = $('<ul>').addClass('dropdown menu tools-btn').attr({'data-dropdown-menu':true, 'data-disable-hover':true,'data-click-open':true});
      var _iconDropdownMenu = $('<li>').append(
        $('<button>').attr({'type':'button', 'title':'Menu de herramientas'}).append(
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
    Object.keys(artists).forEach(function(profile_id){
      _artistsList.append(artists[profile_id].accordion);
      var accordionNav = artists[profile_id].accordion.find('.accordion-item');
      var content = artists[profile_id].accordion.find('.accordion-content');
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
      artists[profile_id].setDay(_daySelector.val());
    });

    Object.keys(the_event.spaces).forEach(function(profile_id, index){
      Object.keys(eventTime).forEach(function(day){
        var height = _tables[day].height() - 42;
        the_event.spaces[profile_id].addColumn(day, height);
        _tables[day].append(the_event.spaces[profile_id].columns[day]);
      });
      _shownSpaces.push(profile_id);
    });
    if(_shownSpaces.length > 0 && _shownSpaces.length < 4) Pard.ColumnWidth = Pard.ColumnWidth * 4 / _shownSpaces.length;

    // var _submitBtnText = $('<p>').html('Guarda </br>los cambios').addClass('save-text-call-manager');
    var _submitBtn;
    var _successIcon = $('<span>').append(Pard.Widgets.IconManager('done').render().addClass('success-icon-check-call-manager'), 'OK').addClass('success-check-call-manager');

    var _saveProgramCallback = function(data){
       if(data['status'] == 'success') {
        _submitBtn.hide();
        _successIcon.show();
        setTimeout(function(){
            _successIcon.hide();
            _submitBtn.show();
            _submitBtn.attr('disabled',false).removeClass('disabled-button');
          }, 3000);
      }
      else{
        console.log('error');
        Pard.Widgets.Alert('¡Error!', 'No se ha podido guardar los datos', function(){location.reload();});
      }
    }

    _submitBtn = Pard.Widgets.Button('', function(){
      var program = [];
      _submitBtn.attr('disabled',true).addClass('disabled-button');
      $('div.ui-tooltip').remove();
      Object.keys(_program).forEach(function(performance_id){
        program.push(_program[performance_id].show);
      });

      var order = [];
      spaces.forEach(function(space){
        order.push(space.profile_id);
      });

      Pard.Backend.saveProgram(the_event.event_id, program, order, _saveProgramCallback);
    }).render().addClass('submit-program-btn-call-manager');
    _submitBtn.append(Pard.Widgets.IconManager('save').render()).attr('title','Guarda el programa');
    // _submitBtnContainer.append(_submitBtnText)
    _submitBtnContainer.append(_submitBtn, _successIcon.hide());

    _toolsContainer.append(ToolsDropdownMenu().render());
    _tableBox.append(_timeTableContainer, _tableContainer, _artistsBlock);
    _createdWidget.append(_buttonsContainer.append( _toolsContainer, _submitBtnContainer), _selectors.append(_daySelectorContainer, _spaceSelectorContainer,  _showArtists));
    _createdWidget.append(_tableBox);

    // if(the_event.program){
    //   the_event.program.forEach(function(performance){
    //     if(performance.permanent == 'true') _program[performance.performance_id] = new PermanentPerformance(performance);
    //     else{_program[performance.performance_id] = new Performance(performance);}
    //     _program[performance.performance_id].loadPerformance();
    //   });
    //   Object.keys(the_event.spaces).forEach(function(profile_id, index){
    //     var position = Pard.ColumnWidth * index + 1;
    //     the_event.spaces[profile_id].alignPerformances(position);
    //   });
    // }

    Pard.Bus.on('addArtist', function(artist){
      if(artist.profile_id in artists) artists[artist.profile_id].addProposal(artist.proposals[0]);
      else{artists[artist.profile_id] = new Artist(artist);
        _artistsList.append(artists[artist.profile_id].accordion.foundation());
        artists.push(artist);
        var _id = _artistSelector.val();
         _loadArtistSelector();
        _artistSelector.trigger('reload', [_id]);
      }
    });

    Pard.Bus.on('addSpace', function(space){
      if(!(space.profile_id in _spaces)){
        _spaces[space.profile_id] = new Space(space);
        Object.keys(eventTime).forEach(function(day){
          _spaces[space.profile_id].columns[day].foundation();
        });
        spaces.push(space);
        var _id = _spaceSelector.val();
        _loadSpaceSelector();
        _spaceSelector.trigger('reload', [_id]);
      }
    });

    Pard.Bus.on('deleteArtist', function(artist){
      if(artist.profile_id in artists){
        var artistProgram = artists[artist.profile_id].program;
        Object.keys(artistProgram).forEach(function(performance_id){
          if(artistProgram[performance_id].participant_proposal_id == artist.proposal_id) _program[performance_id].destroy();
        });
        artists[artist.profile_id].deleteProposal(artist.proposal_id);
        var _id = _artistSelector.val();
        _loadArtistSelector();
        _artistSelector.trigger('reload', [_id]);
      }
    });

    Pard.Bus.on('deleteSpace', function(space){
      if(space.profile_id in _spaces){
        spaces = spaces.filter(function(_space){
          return _space.profile_id != space.profile_id;
        });
        Object.keys(eventTime).forEach(function(day){
          spaces[space.profile_id].columns[day].remove();
        });
        Object.keys(_spaces[space.profile_id].program).forEach(function(performance_id){
          _program[performance_id].destroy();
        });
        delete _spaces[space.profile_id];
        var _id = _spaceSelector.val();
        _loadSpaceSelector();
        _spaceSelector.trigger('reload', [_id]);
      }
    });

  	return {
      render: function(){
        return _createdWidget;
      },
      deletePerformance: function(performance_id){
        if(performance_id in _program){
          _program[performance_id].destroy();
        }
      }
    }
  }
}(Pard || {}));
