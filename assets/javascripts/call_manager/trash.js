'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

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


   ns.ProposalsManager = function(the_event, displayer){

    var artists = the_event.artists;
    var spaces = the_event.spaces;

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

    var _ownArtists = [];
    var _ownSpaces = [];

    var _artistsContainers = {}
    var _spacesContainers = {}

    var _createOwnProposalWidget;
    var _printedOwnProposal;
    var _closePopupOwnSentProposal = function(){};
    var _callbackOwnPrintedProposal = function(){};
    var _closePopupForm = function(){};

    var _addSpace = function(space){
      _ownSpaces.push(space);
      var _proposalContainer = $('<li>').append(Pard.Widgets.IconManager('space').render()).addClass('own-spaceProposal-container');
      _spacesContainers[space.profile_id] = _proposalContainer;
      var _spaceProposal = _newListedItem(space, space.profile_id, 'space', _proposalContainer);
      _spacesList.prepend(_proposalContainer.append(_spaceProposal));
    }

    var _addArtist = function(artist){
      _artistsContainers[artist.profile_id] = _artistsContainers[artist.profile_id] || {};
      var _proposalContainer = $('<li>');
      var _artistProposal = _newListedItem(artist.proposals[0], artist.profile_id, 'artist', _proposalContainer);
      if(Object.keys(_artistsContainers[artist.profile_id]) != 0){
        _artistsContainers[artist.profile_id].ul.append(_proposalContainer.append(_artistProposal));
      }
      else {
        _ownArtists.push(artist);
        var _artistContainer = $('<li>').append(Pard.Widgets.IconManager('artist').render(),$('<span>').text(artist.name).addClass('artistName')).addClass('own-artistProposals-container');
        var _artistProposalsList = $('<ul>');
        _artistsContainers[artist.profile_id].li = _artistContainer;
        _artistsContainers[artist.profile_id].ul = _artistProposalsList;
        _artistContainer.append(_artistProposalsList);
        _artistsList.prepend(_artistContainer);
        _artistProposalsList.prepend(_artistProposal);
      }
      _artistsContainers[artist.profile_id][artist.proposals[0].proposal_id] = _proposalContainer;
    }

    var _deleteSpace = function(space){
      if (_spacesContainers[space.profile_id]){
        _spacesContainers[space.profile_id].remove();
        delete _spacesContainers[space.profile_id];
      }
    }

    var _deleteArtist = function(artist){
      if (_artistsContainers[artist.profile_id]){
        _artistsContainers[artist.profile_id][artist.proposal_id].remove();
        delete _artistsContainers[artist.profile_id][artist.proposal_id];
        if(Object.keys(_artistsContainers[artist.profile_id]).length == 2){
          _artistsContainers[artist.profile_id].li.remove();
          delete _artistsContainers[artist.profile_id];
          _ownArtists = _ownArtists.filter(function(_artist){
            return artist.profile_id != _artist.profile_id;
          });
        }
      }
    }


    var _openPopupForm = displayer.createOwnProposal;

    _createArtistCaller.click(function(){
      _openPopupForm('artist', _ownArtists);
    });

    _createSpaceCaller.click(function(){
      _openPopupForm('space', []);
    });

    var _artistsList = $('<ul>').addClass('own-proposals-list').attr('id','artist-list-call-page');
    var _spacesList= $('<ul>').addClass('own-proposals-list').attr('id','space-list-call-page');

    var _spacesOwnBox = $('<div>').addClass('ownBox-call-manager');
    var _artistsOwnBox = $('<div>').addClass('ownBox-call-manager');

    var _modifyProposalCallback = function(data){
      if (data['status'] == 'success'){
        if (type == 'artist') console.log('modify');
        else if (type == 'space') console.log('modify');
        Pard.Widgets.Alert('', 'Propuesta eliminada correctamente.');
      }
      else{
        var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
        if (typeof _dataReason == 'object')
          Pard.Widgets.Alert('¡Error!', 'No se ha podido guardar los datos', location.reload());
        else{
          console.log(data.reason);
          Pard.Widgets.Alert('', _dataReason, location.reload());
        }
      }
    }

    var _newListedItem = function(proposal, profile_id, type, proposalContainer){
      var _proposalListed = $('<span>');
      var _namePopupCaller = $('<a>').attr({'href':'#'})
      if (proposal['title'])  _proposalListed.append(Pard.Widgets.IconManager(proposal['category']).render().addClass('artIcon'), _namePopupCaller.text(Pard.Widgets.CutString(proposal['title'],55)).addClass('artTitle'));
      else _namePopupCaller.text(Pard.Widgets.CutString(proposal['name'],55));
      _namePopupCaller.click(function(){
        displayer.displayProposal(proposal, type);
      });
      _proposalListed.append(_namePopupCaller);
      return _proposalListed;
    }

    Object.keys(artists).forEach(function(profile_id){
      var lastElement = profile_id.split('-').pop();
      if (lastElement == 'own') {
        var artist = artists[profile_id].artist;
        _artistsContainers[profile_id] = {};
        _ownArtists.push(artist);
        var _artistContainer = $('<li>').append(Pard.Widgets.IconManager('artist').render(),$('<span>').text(Pard.Widgets.CutString(artist['name'],55)).addClass('artistName')).addClass('own-artistProposals-container');
        var _artistProposalsList = $('<ul>');
        _artistsContainers[profile_id].li = _artistContainer;
        _artistsContainers[profile_id].ul = _artistProposalsList;
        _artistContainer.append(_artistProposalsList);
        _artistsList.prepend(_artistContainer);
        artist.proposals.forEach(function(proposal){
          var _proposalContainer = $('<li>');
          _artistsContainers[profile_id][proposal.proposal_id] = _proposalContainer;
          var _artistProposal = _newListedItem(proposal, profile_id, 'artist', _proposalContainer);
          _artistProposalsList.append(_proposalContainer.append(_artistProposal));
        })
      }
    })

   Object.keys(the_event.spaces).forEach(function(profile_id){
      var lastElement = profile_id.split('-').pop();
      if (lastElement == 'own') {
        var space = the_event.spaces[profile_id].space;
        _ownSpaces.push(space);
        var _proposalContainer = $('<li>').append(Pard.Widgets.IconManager('space').render()).addClass('own-spaceProposal-container');
        _spacesContainers[space.profile_id] = _proposalContainer;
        var _spaceProposal = _newListedItem(space, space.profile_id, 'space', _proposalContainer);
        _spacesList.prepend(_proposalContainer.append(_spaceProposal));
      }
    });

    var _whiteList = Pard.Widgets.WhiteList(the_event);
    // var _buttons = $('<div>').append(_spacePopup.render(), _artistPopup.render()).addClass('buttonsCOntainer-call-page');

    _artistsOwnBox.append(_createArtistCaller, _artistsList);
    _spacesOwnBox.append(_createSpaceCaller, _spacesList);
    _addProposalBox.append(_addProposalText, _artistsOwnBox, _spacesOwnBox);
    _whiteListBox.append(_whiteListText, _whiteList.render());
    _createdWidget.append(_addProposalBox, _whiteListBox);

    Pard.Bus.on('addArtist', function(artist){
      _addArtist(artist);
    });

    Pard.Bus.on('addSpace', function(space){
      _addSpace(space);
    });

    Pard.Bus.on('deleteArtist', function(artist){
      _deleteArtist(artist);
    });

    Pard.Bus.on('deleteSpace', function(space){
      _deleteSpace(space);
    });

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


}(Pard || {}));