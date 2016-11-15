'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.CallMainLayout = function(call){
  	var _main = $('<main>').addClass('main-call-page');
    var _mainLarge = $('<section>').addClass('pard-grid call-section');

    var _title = $('<h4>').text('Gestiona la Convocatoria').css({'margin-top':'1.5rem', 'margin-bottom':'2.5rem'});

    var _navigationContainer = $('<div>').addClass('navigation-container-call-page');
    var _tabs = $('<ul>').addClass('menu simple tabs-menu switcher-menu-call-page');
  	var _tableTabTitle =	$('<a>').attr({href: "#"}).text('Tabla');

  	var _tableTab = $('<li>').append(_tableTabTitle);
  	_tableTab.on('click',function(){
      if (!($('#tablePanel').html())){
        var spinner =  new Spinner().spin();
        $.wait(
          '',
          function(){
            $('body').append(spinner.el);
          },
          function(){
            setTimeout(function(){
              var _appendAndStopSpinner = function(stopSpinner){
                $('#tablePanel').append(Pard.Widgets.TablePanelContent(call).render());
                stopSpinner();
              }
              _appendAndStopSpinner(function(){
                spinner.stop();
                $('#tablePanel').foundation();
              });
            },0)
          }
        );
      }
			$('.tab-selected').removeClass('tab-selected');
			$(this).addClass('tab-selected');
			_tabShowHide('tablePanel');

		});

  	var _proposalsTabTitle =	$('<a>').attr({href: "#"}).text('Propuestas');
  	var _proposalsTab = $('<li>').addClass('tabs-title is-active').append(_proposalsTabTitle);
    _proposalsTab.attr('id','proposalsTab');
  	_proposalsTab.one('click',function(){
       var spinner =  new Spinner().spin();
        $.wait(
          '',
          function(){
            $('body').append(spinner.el);
          },
          function(){
            setTimeout(function(){
              var _appendAndStopSpinner = function(stopSpinner){
                $('#proposalsPanel').append(Pard.Widgets.ProposalsPanelContent(call).render());
                stopSpinner();
              }
              _appendAndStopSpinner(function(){
                spinner.stop();
                $('#proposalsPanel').foundation();
              });
            },0)
          }
        );

		});
		_proposalsTab.click(function(){
			$('.tab-selected').removeClass('tab-selected');
			$(this).addClass('tab-selected');
			_tabShowHide('proposalsPanel');

		});

    var _programTabTitle =  $('<a>').attr({href: "#"}).text('Programa');
    var _programTab = $('<li>').append(_programTabTitle);
    _programTab.on('click',function(){


      if (!($('#programPanel').html())){
        var spinner =  new Spinner().spin();
          $.wait(
            '',
            function(){
              $('body').append(spinner.el);
            },
            function(){
              setTimeout(function(){
                var _appendAndStopSpinner = function(stopSpinner){
                var startTime = new Date().getTime();

                  $('#programPanel').append(Pard.Widgets.ProgramManager().render());
                  stopSpinner();
                  var endTime = new Date().getTime();
      console.log((endTime - startTime) /1000);
                }
                _appendAndStopSpinner(function(){
                  spinner.stop();
                  $('#programPanel').foundation();
                  $('#artistAccordeon').css({'height':$('.tableContainer').height(), 'max-height':'none'});
                });
              },0)
            }
          );

      }
			$('.tab-selected').removeClass('tab-selected');
			$(this).addClass('tab-selected');
			_tabShowHide('programPanel');

		});

    var _qrTabTitle =  $('<a>').attr({href: "#"}).text('QR');
    var _qrTab = $('<li>').append(_qrTabTitle);
    var _goToEventPage = $('<a>').attr({href: "/event?id="+call.event_id}).text('Página del evento');
    _qrTab.on('click',function(){

      if (!($('#qrPanel').html())){
        var spinner =  new Spinner().spin();
          $.wait(
            '',
            function(){
              $('body').append(spinner.el);
            },
            function(){
              setTimeout(function(){
                var _appendAndStopSpinner = function(stopSpinner){

                 $('#qrPanel').append(Pard.Widgets.QRManager(call.qr).render(), _goToEventPage);
                  stopSpinner();
                }
                _appendAndStopSpinner(function(){
                  spinner.stop();
                  $('#qrPanel').foundation();
                });
              },0)
            }
          );

      }
      $('.tab-selected').removeClass('tab-selected');
      $(this).addClass('tab-selected');
      _tabShowHide('qrPanel');

    });

  	_tabs.append(
  		_tableTab,
  		_proposalsTab,
  		_programTab,
      _qrTab
  	);

  	var _tabShowHide = function(id_selected){
  		_panelShown.hide();
  		_panelShown = $('#'+id_selected);
  		_panelShown.show();

  	}

  	var _tablePanel = $('<div>').attr('id', 'tablePanel').hide();
		var _proposalsPanel = $('<div>').attr('id', 'proposalsPanel').hide();
    var _programPanel = $('<div>').attr('id', 'programPanel').hide();
    var _qrPanel = $('<div>').attr('id', 'qrPanel').hide();

		var _panelShown = _tablePanel;
    // var _panelShown = _programPanel;
    _panelShown.show();

		$(document).ready(function(){
			//_tableTab.trigger('click');
      _programTab.trigger('click')
		});

    var _goToEventBtn = $('<a>').attr('href','/event?id='+call.event_id).text('Página evento');
    _goToEventBtn.addClass('toEventPage-btn-callPage');
    _mainLarge.append( _navigationContainer.append(_goToEventBtn, _tabs), _title, _tablePanel, _proposalsPanel, _programPanel, _qrPanel);
    _main.append(_mainLarge);

  	return {
      render: function(){
        return _main;
      }
    }
  }


  ns.Widgets.TablePanelContent = function(){

    var the_event = Pard.CachedEvent;
    var eventTime = the_event.eventTime;
    var artists = the_event.artists;
    var spaces = the_event.spaces;

  	var _createdWidget = $('<div>').css('position','relative');
  	var _typesSelectorBox = $('<div>').addClass('types-selector-call-manager');
    var _contentBoxArtists = $('<div>').addClass('content-box-ArtistSpace');
    var _contentBoxSpaces = $('<div>').addClass('content-box-ArtistSpace');
    var _contentBoxProgram = $('<div>').addClass('content-box-ArtistSpace');

    var _types = ['artist', 'space' ,'program'];
    var _tagsTypes = [];
    _types.forEach(function(type){
    	_tagsTypes.push({id: type, text:Pard.Widgets.Dictionary(type).render()});
    });

    var _cat = {
      space: _contentBoxSpaces,
      artist: _contentBoxArtists,
      program: _contentBoxProgram
    }

    var proposals = Pard.CachedProposals;

    var _proposalsSelected = {};
    var _categories ={};
    _types.forEach(function(type){
      _categories[type] = [];
      _proposalsSelected[type] = [];
    });

    artists.forEach(function(artist){
      artist.proposals.forEach(function(proposal){
        if ($.inArray(proposal.category, _categories['artist']) < 0) _categories['artist'].push(proposal.category);
        _proposalsSelected['artist'].push(proposal);
      });
    });

    spaces.forEach(function(space){
      if ($.inArray(space.category, _categories['space']) < 0) _categories['space'].push(space.category);
      _proposalsSelected['space'].push(space);
    });

    _showHide = function(selected){
      _shown.hide();
      _shown = _cat[selected];
      _shown.show();
      if (selected == 'space' && !(_contentBoxSpaces.html())){
        var spinner =  new Spinner().spin();
        $.wait(
          '',
          function(){
            _contentBoxSpaces.append(spinner.el);
          },
          function(){
            setTimeout(function(){
              var _appendAndStopSpinner = function(stopSpinner){
                _contentBoxSpaces.append(Pard.Widgets.CallManagerContent(_proposalsSelected['space'], _categories['space']).render());
                stopSpinner();
              }
              _appendAndStopSpinner(function(){spinner.stop()});
            },0)
          }
        );
      }
      if (selected == 'program'){
        _contentBoxProgram.empty();
        var spinner =  new Spinner().spin();
        var _check = false;
        $.wait(
          '',
          function(){
            _contentBoxProgram.append(spinner.el);
            if (!($('#programPanel').html())){
              $('#programPanel').append(Pard.Widgets.ProgramManager().render());
              _check = true;
            }
          },
          function(){
            setTimeout(function(){
              var _appendAndStopSpinner = function(stopSpinner){
                _contentBoxProgram.append(Pard.Widgets.ProgramTableContent(_categories).render());
                stopSpinner();
              }
              _appendAndStopSpinner(function(){spinner.stop()});
              if(_check) $('#programPanel').foundation();
            },0)
          }
        );
      }
    }

    var _selectorCallback = function(){
      var _selected = $(this).val();
      _showHide(_selected);
    }

    var _typesSelector = $('<select>');
    _contentBoxArtists.append(Pard.Widgets.CallManagerContent(_proposalsSelected['artist'], _categories['artist']).render());
    _contentBoxSpaces.hide();
    _contentBoxProgram.hide();
    var _shown = _contentBoxArtists;
		_typesSelectorBox.append(_typesSelector);
    _createdWidget.append(_typesSelectorBox, _contentBoxArtists, _contentBoxSpaces, _contentBoxProgram);

    _typesSelector.select2({
      data: _tagsTypes,
      minimumResultsForSearch: -1
    });

    _typesSelector.on('select2:select', function(){
      var _selected = _typesSelector.select2('data')[0].id;
      _showHide(_selected);
    });

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ProgramTableContent = function(categories){

    var _createdWidget = $('<div>');

    var _checkBoxesBox = $('<div>').css('min-height','7rem');

    var _columns = ['day','time','artist','category','title','short_description','space_number','space','space_category','comments','children','phone','email','confirmed'];
    var _shownColumns = ['day','time','artist','category','title','short_description','space'];

    var _checkBoxes = Pard.Widgets.PrintCheckBoxes(_columns, _shownColumns);


    var _outerTableContainer = $('<div>');

    var _tableBox = $('<div>').addClass('table-box-call-manager-page');

    var _submitBtn = Pard.Widgets.Button('', function(){
      var program = [];
      Pard.Widgets.Program.forEach(function(performance, index){
        var _performance = {
          performance_id: performance.performance_id,
          participant_id: performance.participant_id,
          participant_proposal_id: performance.participant_proposal_id,
          host_id: performance.host_id,
          host_proposal_id: performance.host_proposal_id,
          date: performance.date,
          time: performance.time,
          permanent: performance.permanent,
          comments: performance.comments,
          confirmed: performance.confirmed
        }
        program.push(_performance);
      });

      var order = [];
      Pard.Spaces.forEach(function(space){
        order.push(space.proposal_id);
      });
      console.log(program);
      console.log(order);

      Pard.Backend.program(' ', program, order, Pard.Events.SaveProgram);
    }).render().addClass('submit-program-btn-call-manager');

    _submitBtn.append(Pard.Widgets.IconManager('save').render());

    var _submitBtnContainer = $('<div>').addClass('submit-program-btn-container-tablePanel');
    // var _successBox = $('<span>').attr({id:'succes-box-call-manager'});

    _submitBtnContainer.append($('<p>').html('Guarda </br>los cambios').addClass('save-text-call-manager'),_submitBtn);

    var _filterCategoryContainer = $('<div>').addClass('select-category-container-call-manager');
    var _filterCategory = $('<select>');
    var _searchTags = [{id:'all', 'text':'Todas las categorias'}];
    categories['artist'].forEach(function(cat){
      _searchTags.push({id:cat, text: Pard.Widgets.Dictionary(cat).render(), icon: cat});
    });

    _filterCategoryContainer.append(_filterCategory);


    function formatResource (resource) {
      var _label = $('<span>').text(resource.text);
      if(resource.icon){
        var _icon = Pard.Widgets.IconManager(resource.icon).render();
        _label.append(_icon);
        _icon.css({
          // position: 'relative',
          'margin-left': '0.5rem',
          'vertical-align':'middle'
          // top: '5px'
        });
      }
      return _label;
    };

    _filterCategory.select2({
      data: _searchTags,
      templateResult: formatResource
      // ,templateSelection: formatResource
    });

    var _table = Pard.Widgets.PrintProgramTable(_checkBoxes, _filterCategory, _columns, _shownColumns);

    _filterCategory.on('select2:select',function(){
      var _cat =  _filterCategory.select2('data')[0];
      if (_cat.id == 'all') _table.dataTableCreated().columns( 3 ).search('').draw();
      else _table.dataTableCreated().columns( 3 ).search(_cat.text).draw();
    });

    _checkBoxesBox.append(_checkBoxes.render()).addClass('checkBoxesBox-call-manager-table');
    _outerTableContainer.append(_submitBtnContainer, _tableBox.append(_table.render())).css('position','relative');

    _createdWidget.append(_filterCategoryContainer, _checkBoxesBox,  _outerTableContainer);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.PrintProgramTable = function(checkBoxes, filterCategory, columns, shownColumns){


    var _createdWidget = $('<div>').addClass('program-table-container');

    var _dataTable ;

    var program = [];

    var _searchImputText = '';

    var _printTable = function(){

      if (Pard.Widgets.Program && Pard.Widgets.Program.length) program = Pard.Widgets.Program;
      // else Pard.Widgets.Program = program;
      // var myPermanentPerformances = [];
      // program.forEach(function(performance){
      //   if(performance.participant_id == artist.profile_id) myPerformances.push(performance);
      // });

      var _permanents = [];

      _reorderedProgram = Pard.Widgets.ReorderProgramCrono(program);

      var _tableCreated = $('<table>').addClass('table-proposal stripe row-border program-table').attr({'cellspacing':"0", 'width':"950px"});

      var _thead = $('<thead>');
      var _titleRow = $('<tr>')
      // .addClass('title-row-table-proposal');

      columns.forEach(function(field, colNum){
        if (field == 'email') var _titleCol = $('<th>').text('Email artista');
        else if (field == 'phone') var _titleCol = $('<th>').text('Tél. artista');
        else var _titleCol = $('<th>').text(Pard.Widgets.Dictionary(field).render());
        var _class = 'column-'+field;
        _titleCol.addClass('column-table-program-call-manager');
        _titleCol.addClass(_class);
        _titleRow.append(_titleCol);
      });

      _tableCreated.append(_thead.append(_titleRow));


      var _tfoot = $('<tfoot>');
      // .addClass('tfoot-proposal-table-call-manager');;
      var _titleRowFoot = $('<tr>');
      // .addClass('title-row-table-proposal');

      columns.forEach(function(field, colNum){
        var _titleCol = $('<th>').text(Pard.Widgets.Dictionary(field).render());
        var _class = 'column-'+field;
        _titleCol.addClass('column-table-program-call-manager');
        _titleCol.addClass(_class);
        _titleRowFoot.append(_titleCol);
      });

      _tableCreated.append(_tfoot.append(_titleRowFoot ));

      var _tbody = $('<tbody>');

      _reorderedProgram.forEach(function(performance){

        var spaceProposal = Pard.Widgets.GetProposal(performance.host_proposal_id);
        var spaceNumber;
        Pard.Spaces.some(function(space, index){
          if (space.proposal_id == spaceProposal.proposal_id) {
            spaceNumber = index + 1;
            return true;
          }
        });
        var artistProposal = Pard.Widgets.GetProposal(performance.participant_proposal_id);

        var cardInfo = {
          performance_id: performance.performance_id,
          participant_id: artistProposal.profile_id,
          participant_proposal_id: artistProposal.proposal_id,
          title: artistProposal.title,
          duration: artistProposal.duration,
          category: artistProposal.category,
          availability: artistProposal.availability,
          name: artistProposal.name,
          date: performance.date
        }

        var _row = $('<tr>');
        columns.forEach(function(field){
        var _colClass = 'column-'+field;
          var _col = $('<td>').addClass('column-table-program-call-manager');
          _col.addClass(_colClass);
        if (field == 'day'){
          _col.append(moment(new Date(performance['date'])).locale('es').format('DD-MM-YYYY'));
        }
        else if (field == 'time'){
          _col.append(moment(new Date(parseInt(performance['time'][0]))).locale('es').format('HH:mm')+'-'+moment(new Date (parseInt(performance['time'][1]))).locale('es').format('HH:mm'));
        }
        else if (field == 'space'){
          var _programCaller = $('<a>').attr('href','#').text(spaceProposal['name']);
          _programCaller.on('click', function(){
            _searchImputText = $('.program-table-container .dataTables_filter input').val();
            var _content = $('<div>').addClass('very-fast reveal full');
            _content.empty();
            $('body').append(_content);

            var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
            var _message = Pard.Widgets.PopupContent(spaceProposal.name, Pard.Widgets.SpaceProgram(spaceProposal), 'space-program-popup-call-manager');
            _message.setCallback(function(){
              _popup.close();
              _createdWidget.empty();
              shownColumns = [];
              var _checkedBoxes = checkBoxes.getVal();
              columns.forEach(function(col, index){
                if (_checkedBoxes[index]) shownColumns.push(col);
              });
              _printTable();
            });
            _content.append(_message.render());
            _popup.open();
          });
          _col.append(_programCaller);
        }
        else if (field == 'space_category'){
          _col.append(Pard.Widgets.Dictionary(spaceProposal['category']).render());
        }
         else if (field == 'space_number'){
          _col.append(spaceNumber);
        }
        else if (field == 'artist'){
          var _programCaller = $('<a>').attr('href','#').text(artistProposal['name']);
          _programCaller.on('click', function(){
            _searchImputText = $('.program-table-container .dataTables_filter input').val();
            var _content = $('<div>').addClass('very-fast reveal full');
            _content.empty();
            $('body').append(_content);

            var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
            var _message = Pard.Widgets.PopupContent(artistProposal.name, Pard.Widgets.ArtistProgram(artistProposal), 'space-program-popup-call-manager');
            _message.setCallback(function(){
              _popup.close();
              _createdWidget.empty();
              shownColumns = [];
              var _checkedBoxes = checkBoxes.getVal();
              columns.forEach(function(col, index){
                if (_checkedBoxes[index]) shownColumns.push(col);
              });
              _printTable();
            });
            _content.append(_message.render());
            _popup.open();
          });
          _col.append(_programCaller);
        }
        else if (field == 'title'){
          // var _catIcon =  Pard.Widgets.IconManager(artistProposal['category']).render().css('font-size','13px');
          // var _namePopupCaller = $('<a>').attr({'href':'#'}).append(_catIcon,' ', artistProposal['title']);
          var _namePopupCaller = $('<a>').attr({'href':'#'}).append(artistProposal['title']);
          if (performance.permanent){
              _namePopupCaller.on('click', function(){
                _searchImputText = $('.program-table-container .dataTables_filter input').val();
                var _content = $('<div>').addClass('very-fast reveal full');
                _content.empty();
                $('body').append(_content);

                var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
                var _message = Pard.Widgets.PopupContent(artistProposal.title+' (' + artistProposal.name + ')', Pard.Widgets.PermanentPerformanceProgram(cardInfo, true));
                _message.setCallback(function(){
                  _createdWidget.empty();
                  shownColumns = [];
                  var _checkedBoxes = checkBoxes.getVal();
                  columns.forEach(function(col, index){
                    if (_checkedBoxes[index]) shownColumns.push(col);
                  });
                  _printTable();
                  _popup.close();
                });
                _content.append(_message.render());
                _popup.open();
              });
            }
            else {
              _namePopupCaller.on('click', function(){
              _searchImputText = $('.program-table-container .dataTables_filter input').val();
                var _content = $('<div>').addClass('very-fast reveal full');
                _content.empty();
                $('body').append(_content);

                var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
                var _message = Pard.Widgets.PopupContent(artistProposal.title+' (' + artistProposal.name + ')', Pard.Widgets.PerformanceProgram(cardInfo, true));
                _message.setCallback(function(){
                  _createdWidget.empty();
                   shownColumns = [];
                    var _checkedBoxes = checkBoxes.getVal();
                    columns.forEach(function(col, index){
                      if (_checkedBoxes[index]) shownColumns.push(col);
                    });
                  _printTable();
                  _popup.close();
                });
                _content.append(_message.render());
                _popup.open();
              });
            }
         _col.append(_namePopupCaller);
        }
        else if (field == 'comments'){
          _col.append(performance['comments']);
        }
        else if (field == 'confirmed'){
          var _text;
          if (performance['confirmed']) _text = 'Sí';
          else _text = 'No';
          _col.append(_text);
        }
        else if (field == 'category'){
          _col.append(Pard.Widgets.Dictionary(artistProposal[field]).render());
        }
        else {
          _col.append(artistProposal[field]);
        }
          _row.append(_col);
        });

        if (performance.permanent) _permanents.push(_row);
        else {_tbody.append(_row)}
      });

      if (_permanents.length) {
        var _permanentRow = $('<tr>').addClass('permanent-row-program-table-call-manager');
        columns.forEach(function(field){
          var _colClass = 'column-'+field;
          var _col = $('<td>').addClass('column-space-program-call-manager');
          _col.addClass(_colClass);
          if (field == 'day') _col.append('Permanente');
          else{ _col.html('');}
          _permanentRow.append(_col);
        });
        _tbody.append(_permanentRow);
        _permanents.forEach(function(row){
          _tbody.append(row);
        });
      }
      _tableCreated.append(_tbody);
      _createdWidget.append(_tableCreated);

      var _hiddenColumnsArray=[];
      columns.forEach(function(field, colNum){
        if($.inArray(field,shownColumns)<0) _hiddenColumnsArray.push(colNum);
      });

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
      "columnDefs": [
        { "visible": false, "targets": _hiddenColumnsArray }
      ],
      "scrollX": true,
      "scrollY": "90vh",
      "bAutoWidth": false,
      "paging": false,
      "scrollCollapse": true,
      // 'responsive': true,
      // 'colReorder': true,

      // keys: true,
      // "bSort": false,
      aaSorting: [],
      dom: 'Bfrtip',
      buttons: [
        {
          extend: 'pdf',
          exportOptions: {
              columns: ':visible'
          },
          orientation: 'landscape',
          filename: 'programación_conFusión_2016',
          title: 'Programación conFusión 2016'

        },
        // {
        //     extend: 'copy',
        //     text: 'Copia',
        //     exportOptions: {
        //         columns: ':visible'
        //     }
        // },
        {
          extend: 'excel',
          exportOptions: {
              columns: ':visible'
          },
          filename: 'programación conFusión 2016'

        }
      ]
      });
      filterCategory.trigger('select2:select');
      checkBoxes.setCallback(_dataTable);
      if(_searchImputText) _dataTable.search(_searchImputText).draw();
    }

    _printTable();

    return{
      render: function(){
        return _createdWidget;
      },
      dataTableCreated: function(){
        return _dataTable;
      }
    }
  }



  ns.Widgets.EventManagerContent = function(proposalsSelected, categories){

    var _selected = proposalsSelected[0].type;

    var _shownColumns = {
      space: ['link_orfheo','name','category','address'],
      artist: ['link_orfheo','name','category','title','short_description']
    }

    var _fields = {
      space: ['link_orfheo', 'name','category','responsible','address','description', 'own', 'sharing', 'un_wanted','availability', 'email', 'phone','amend'],
      artist: ['link_orfheo', 'name','category','title','short_description','description', 'duration','components', 'meters', 'children', 'repeat', 'waiting_list','needs','sharing','availability','email', 'phone', 'amend']
    }

    var _titleFile = {
      artist: 'Tabla_artistas',
      space: 'Tabla_espacios'
    }

  	var _createdWidget = $('<div>');

    var _table = Pard.Widgets.PrintTable(proposalsSelected, _fields[_selected]);

    var _outerTableContainer = $('<div>');

    var _filterCategoryContainer = $('<div>').addClass('select-category-container-call-manager');

    var _filterCategory = $('<select>');
     var _searchTags = [{id:'all', 'text':'Todas las categorias'}];
    categories.forEach(function(cat){
      _searchTags.push({id:cat, text: Pard.Widgets.Dictionary(cat).render(), icon: cat});
    });

   	var _tableBox = $('<div>').addClass('table-box-call-manager-page');

	  var _checkBoxesBox = Pard.Widgets.PrintCheckBoxes(_fields[_selected], _shownColumns[_selected]);

    var _tableRendered = _table.render();

    _createdWidget.append(_filterCategoryContainer.append(_filterCategory), _checkBoxesBox.render(), _outerTableContainer.append(_tableBox.append(_tableRendered)));

    function formatResource (resource) {
      var _label = $('<span>').text(resource.text);
      if(resource.icon){
        var _icon = Pard.Widgets.IconManager(resource.icon).render();
        _label.append(_icon);
        _icon.css({
          // position: 'relative',
          'margin-left': '0.5rem',
          'vertical-align':'middle'
          // top: '5px'
        });
      }
      return _label;
    };

    _filterCategory.select2({
      data: _searchTags,
      templateResult: formatResource
      // ,templateSelection: formatResource
    });

    $(document).ready(function() {

      var _hiddenColumnsArray=[];
      _fields[_selected].forEach(function(field, colNum){
        if($.inArray(field,_shownColumns[_selected])<0) _hiddenColumnsArray.push(colNum);
      });
      // _hiddenColumnsArray.push(_fields[selected].length);
      var _dataTable = _tableRendered.DataTable({
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
      "columnDefs": [
        { "visible": false, "targets": _hiddenColumnsArray }
        ],
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
          filename: _titleFile[_selected]

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

      _dataTable.columns.adjust().draw(true);

      _filterCategory.on('select2:select',function(){
      var _cat =  _filterCategory.select2('data')[0];
      if (_cat.id == 'all') _dataTable.columns( 2 ).search('').draw();
      else _dataTable.columns( 2 ).search(_cat.text).draw();
    });

       _checkBoxesBox.setCallback(_dataTable);
    });

		return {
      render: function(){
        return _createdWidget;
      }
	  }
  }


  ns.Widgets.PrintCheckBoxes = function(_fields, _shownColumns) {

    var _createdWidget = $('<div>');

  	var _checkBoxesBox = $('<div>');

    var  _allCheckBoxesBox = $('<div>').addClass('allCheckBoxesBox');

    var _checkBoxesField = [];

  	var _table;

    var _checkBoxesArray = [];

  	var _printCheckBoxes = function(columnShown){
  	_checkBoxesField = [];
    _fields.forEach(function(field, columnNum){
    	var _checkBox = Pard.Widgets.CheckBox(Pard.Widgets.Dictionary(field).render(),false);
      _checkBoxesField.push(field);
    	var _checkBoxRendered = _checkBox.render().addClass('checkBox-call-manager');
    	_checkBoxRendered.click(function(){
        var column = _table.column(columnNum);
        column.visible( _checkBox.getVal() );
        } );
       // _checkBoxesRendered.push(_checkBoxRendered);
       // _checkBoxes.push(_checkBox);
    	if ($.inArray(field,columnShown)>-1) {
        _checkBox.setVal(true);
      }
      else {
        _checkBox.setVal(false);
      };
      if (_table) _table.column(columnNum).visible( _checkBox.getVal() );

    	_checkBox.labelToggle();

    	_checkBoxesBox.append(_checkBoxRendered);

      _checkBoxesArray.push(_checkBox);

    });
  	}

  	_printCheckBoxes(_shownColumns);

    var _allCheckBoxes = Pard.Widgets.CheckBox('Todos los campos','all');
  	var _allCheckBoxesRendered = _allCheckBoxes.render().addClass('checkBox-call-manager');

    _allCheckBoxesRendered.click(function(){
      var spinner =  new Spinner().spin();
      _checkBoxesBox.empty();
        $.wait(
          '',
          function(){
            _checkBoxesBox.append(spinner.el);
          },
          function(){
            setTimeout(function(){
              var _appendAndStopSpinner = function(stopSpinner){
                var _val = _allCheckBoxes.getVal();
                if (_val) _printCheckBoxes(_checkBoxesField);
                else _printCheckBoxes([]);
                stopSpinner();
              }
              _appendAndStopSpinner(function(){spinner.stop()});
            },0)
          }
        )
    });

    _allCheckBoxesBox.append(_allCheckBoxesRendered);
    _allCheckBoxes.labelToggle();

    _createdWidget.append(_allCheckBoxesBox, _checkBoxesBox);

    var _getColumns = function(){
      var _checks = [];
      _checkBoxesArray.forEach(function(ckbx){
       _checks.push(ckbx.getVal());
      })
      return _checks;
    }

    return {
	  	render: function(){
	  		return _createdWidget;
	  	},
	  	getVal: function(){
	  		return _getColumns();
	  	},
	  	setCallback: function(table){
        _table = table;
      }
  	}
  }

  ns.Widgets.PrintTable = function(proposalsSelected, columns) {

   	var _tableCreated = $('<table>').addClass('table-proposal stripe row-border ').attr({'cellspacing':"0", 'width':"950px"});

   	var reorder = function(colNum){};

   	var _printTable = function(proposalsSelected){

    	var _thead = $('<thead>');
    	var _titleRow = $('<tr>')
      // .addClass('title-row-table-proposal');

    	columns.forEach(function(field, colNum){
    		if (field == 'link_orfheo'){
  	 		  var _titleCol = $('<th>').text('rfh');
          _titleRow.append(_titleCol);
        }
    		else{
  	       var _titleCol = $('<th>').text(Pard.Widgets.Dictionary(field).render());
  	 	  	}
        var _class = 'column-'+field;
        _titleCol.addClass('column-call-manager-table');
        _titleCol.addClass(_class);
    		_titleRow.append(_titleCol);
    	});

    	_tableCreated.append(_thead.append(_titleRow));

      var _tfoot = $('<tfoot>');
      // .addClass('tfoot-proposal-table-call-manager');;
      var _titleRowFoot = $('<tr>');
      // .addClass('title-row-table-proposal');

      columns.forEach(function(field, colNum){
        if (field == 'link_orfheo'){
          var _titleCol = $('<th>').text('rfh');
          _titleRow.append(_titleCol);
        }
        else{
          var _titleCol = $('<th>').text(Pard.Widgets.Dictionary(field).render());
        }
        _titleRowFoot.append(_titleCol);
      });

      _tableCreated.append(_tfoot.append(_titleRowFoot ));

  	  var _tbody = $('<tbody>');

    	proposalsSelected.forEach(function(proposal){
    		var _row = $('<tr>');
    		columns.forEach(function(field){
    			var _colClass = 'column-'+field;
    			var _col = $('<td>').addClass('column-call-manager-table')
    			_col.addClass(_colClass);
    			if (field == 'link_orfheo'){
    				var _icon = $('<a>').append(Pard.Widgets.IconManager(proposal['type']).render());
    				_icon.attr({'href': '/profile?id=' + proposal['profile_id'], 'target':'_blank'});
    				_col.append(_icon);
    			}
    			else if (proposal[field]) {
  	  			if (field == 'name'){
  	  				var _namePopupCaller = $('<a>').attr({'href':'#'}).text(proposal['name']);
  	  				var _form;
  	  				if (proposal.type == 'artist')_form = Pard.Forms.ArtistCall(proposal.category);
  	  				else _form = Pard.Forms.SpaceCall();
              _namePopupCaller.on('click', function(){
                var _content = $('<div>').addClass('very-fast reveal full');
                _content.empty();
                $('body').append(_content);

                var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
                var _message = Pard.Widgets.PopupContent(Pard.CachedEvent.name, Pard.Widgets.PrintProposal(proposal, _form.render()));
                _message.setCallback(function(){
                  _content.remove();
                  _popup.close();
                });
                _content.append(_message.render());
                _popup.open();
              });

  					 _col.append(_namePopupCaller);
  	  			}
  	  			else if ( field == 'address'){
  	  				var _fieldFormText = ' '+proposal['address']['route']+' '+proposal['address']['street_number'];
  	    			if (proposal['door']) _fieldFormText += ', puerta/piso '+proposal['door'];
  	   				_fieldFormText +=', '+proposal['address']['locality'];
  	   				var _aStr = proposal['address']['route']+' '+proposal['address']['street_number']+', '+proposal['address']['locality']+' '+proposal['address']['country'];
  	  				var _address = $('<a>').attr({
  				      href: 'http://maps.google.com/maps?q='+_aStr,
  				      target: '_blank'
  				    }).text(_fieldFormText);
  					 	_col.append(_address);
  	  			}
  	  			else if (proposal[field] && field == 'availability') {
  	  				for (var date in proposal[field]) {
  		  				_col.append($('<div>').append(Pard.Widgets.AvailabilityDictionary(proposal[field][date])));
  	  				}
  	  			}
  	  			else	if (proposal[field] && $.inArray(field,['children', 'waiting_list','repeat'])>-1) {
  	  				if (proposal[field] == 'true') {_col.html('Sí');}
  	  				else if (proposal[field] == 'false') { _col.html('No');}
  	  				else { var _col = $('<td>').html(proposal[field]);}
  	  			}
  	  			else	if (proposal[field] && field == 'category'){
  	  				_col.html(Pard.Widgets.Dictionary(proposal[field]).render());
  	  			}
  	  			else{
  	  				_col.html(proposal[field]);
    				}
    			}
    			else{
    				_col.html('');
    			}
    			_row.append(_col);
    		});

    		_tbody.append(_row);

    	})

    	_tableCreated.append(_tbody);
  	}

  	_printTable(proposalsSelected);



		return{
			render: function(){
				return _tableCreated;
			}
		}
	}


}(Pard || {}));




