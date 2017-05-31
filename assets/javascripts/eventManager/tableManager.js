'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.TableManager = function(the_event, forms, displayer){
    var artists = the_event.artists;
    var spaces = the_event.spaces;
    var _createdWidget = $('<div>');
    var _own = {
      artists:{},
      spaces:{}
    };

    // OWN PROPOSALS
    var _dictionary = {
      'artist':'performer',
      'space':'stage'
    }
    var _createProposals = {
      artist: function(){
          var _artistIcon = Pard.Widgets.IconManager(_dictionary['artist']).render().addClass('createOwnprofile-btn-icon');
          var _plusA = Pard.Widgets.IconManager('add_circle').render().addClass('plusSymbol-CreateOwnProfile');
          return $('<div>').append(_artistIcon, _plusA).addClass('create-artist-proposal-call-page-btn')
          .attr('title', Pard.t.text('manager.proposals.addArtist'))
          .click(function(){
            _openPopupForm('artist', _own);
          });
        },
      space: function(){
          var _spaceIcon = Pard.Widgets.IconManager(_dictionary['space']).render().addClass('createOwnprofile-btn-icon');
          var _plusS = Pard.Widgets.IconManager('add_circle').render().addClass('plusSymbol-CreateOwnProfile');
          return $('<div>').append(_spaceIcon, _plusS).addClass('create-space-proposal-call-page-btn')
          .attr('title', Pard.t.text('manager.proposals.addSpace'))
          .click(function(){
            _openPopupForm('space', []);
          });
        }
    }
   
    var _createProposalsInnerCont = $('<div>').addClass('innerCreateProposals-Cont');
    var _createProposalsCont = $('<div>').append(_createProposalsInnerCont).addClass('createProposalsContainer-call-page');
    var _openPopupForm = displayer.createOwnProposal;
    var _deleteOwnArtist = function(artist){
      if (_own['artists'][artist.profile_id] && _own['artists'][artist.profile_id].proposals.length == 0){
        delete _own['artists'][artist.profile_id];
      } 
    }
    var _addOwnArtist = function(artist){
      if (_own['artists'][artist.profile_id] && _own['artists'][artist.profile_id].proposals) _own['artists'][artist.profile_id].proposals.push(artist.proposals[0]);
      else _own['artists'][artist.profile_id] = artist;
    }
    var _addOwnSpace = function(space){
      _own['spaces'][space.profile_id] = space;
    }
    var _deleteOwnSpace = function(space){
      delete _own['spaces'][space.profile_id];
    }
    _createdWidget.append(_createProposalsCont);

    // TABLES SELECTOR

    var _typeSelectorBox = $('<div>').addClass('types-selector-call-manager noselect');
    var _typeSelector = $('<select>'); 
    _typeSelectorBox.append(_typeSelector);
    var _formTypes = ['artist','space']
  
    var _dataTables = {};
    var _tablesContainer = {};
    var _selectorOptions = {};
    var _proposalsNumber = {};
    var _subcategorySelector = {};
    var _tags = [];

    _tags.push({
      id: 'allProposals',
      text: Pard.t.text('manager.proposals.allProposals')
    });

    var _typesDictionary = {
      artist: Pard.t.text('manager.proposals.artistProposals'),
      space: Pard.t.text('manager.proposals.spaceProposals')
    }

    _dataTables['allProposals'] = Pard.Widgets.PrintTableAllProposal(displayer, 'allProposals');
    _tablesContainer['allProposals'] = $('<div>').append(_dataTables['allProposals'].table);
    _subcategorySelector['allProposals'] = $('<select>');

    var _iconDictionary = {
      'artist':'performer',
      'space':'stage'
    }

    _formTypes.forEach(function(type){
      if (forms[type]){
        _selectorOptions[type] = [];
        for (var formcat in forms[type]){
          _tablesContainer[formcat] = $('<div>');
          _dataTables[formcat] = Pard.Widgets.PrintTable(type, forms[type][formcat].blocks, displayer, formcat);
          _selectorOptions[type].push({id:formcat, text: forms[type][formcat].label})
          _tablesContainer[formcat].append(_dataTables[formcat].table).hide();
          _proposalsNumber[formcat] = 0;
          _subcategorySelector[formcat] = $('<select>');
        }
        _tags.push({
          text: _typesDictionary[type],
          icon: _iconDictionary[type],
          children: _selectorOptions[type]
        });
        _createProposalsInnerCont.append(_createProposals[type]());
      }
    });  

    //FILL THE TABLES

    Object.keys(spaces).forEach(function(profile_id){
      var proposal = spaces[profile_id].space;
      if (proposal.own) _own['spaces'][profile_id] = spaces[profile_id].space;
      _proposalsNumber[proposal.form_category] = _proposalsNumber[proposal.form_category] + 1 || 1;
      _dataTables[proposal.form_category].addRow(proposal);
      _dataTables['allProposals'].addRow('space', proposal);
    });
    Object.keys(artists).forEach(function(profile_id){
      var profile = artists[profile_id].artist;
      if (profile.own) _own['artists'][profile_id] = the_event.artists[profile_id].artist;
      profile.proposals.forEach(function(proposal){
        _proposalsNumber[proposal.form_category] = _proposalsNumber[proposal.form_category] + 1;
        _dataTables[proposal.form_category].addRow(proposal, profile);
        _dataTables['allProposals'].addRow('artist', proposal, profile);
      });
    });

    //SELECT2 SELECTOR TABLES

    _createdWidget.append(_typeSelectorBox);
    for (var table in _tablesContainer) {
      _createdWidget.append(_tablesContainer[table]);
    }

    var _formatResource = function(resource){
      var _text = resource.text;
      if (_proposalsNumber[resource.id]) _text += ' ('+_proposalsNumber[resource.id]+')';
      var _label = $('<span>').text(_text);
      if(resource.icon){
        var _icon = Pard.Widgets.IconManager(resource.icon).render();
        _label.append(_icon);
        _icon.css({
          position: 'relative',
          left: '5px',
          top: '5px',
        });
      }
      return _label;
    }

    _typeSelector.select2({
      data: _tags,
      templateResult:_formatResource,
      allowClear: true,
       placeholder: {
        id: 'allProposals',
        text: Pard.t.text('manager.proposals.allProposals')
      },
      dropdownCssClass: 'orfheoTableSelector'
    });
    var lastTypeSelected = 'allProposals';
    _typeSelector.on('change', function(){
      var _data = _typeSelector.select2('data')[0];
      if(_data['id'] != lastTypeSelected){
        _tablesContainer[lastTypeSelected].hide();
        _tablesContainer[_data['id']].show();
        lastTypeSelected = _data['id'];
      }
    });
    _typeSelector.on("select2:unselecting", function (e) {
      $(document).tooltip('destroy');
      $('.select2-selection__rendered').removeAttr('title');
      $(document).tooltip({tooltipClass: 'orfheo-tooltip', show:{delay:800}, position:{collision:'fit', my: 'left top+5px'}});
      _typeSelector.on('select2:opening', function(e) {
        e.preventDefault();
      }); 
      setTimeout(function() {
        _typeSelector.off('select2:opening');
      }, 10);
    });


    var _filtersWidgets = function(colTosearch, typeTable) {
      var _ownCheckbox = $('<input>').attr({ type: 'checkbox', 'value': true}).on('change', function(){
            var val = '';
            if (_receivedCheckbox.is(":checked")) _receivedCheckbox.prop("checked", false);
            if(_ownCheckbox.is(":checked")) val = 'own';
           colTosearch.search(val).draw(); 
          });
          var _labelOwn = $('<label>').html(Pard.t.text('manager.proposals.created')).css({'display':'inline', 'cursor':'pointer'}).on('click', function(){
              _ownCheckbox.prop("checked", !_ownCheckbox.prop("checked"));
              _ownCheckbox.trigger('change');
            });
          var _receivedCheckbox = $('<input>').attr({ type: 'checkbox', 'value': true}).on('change', function(){
            var val = '';
            if(_ownCheckbox.is(":checked")) _ownCheckbox.prop("checked", false);
            if(_receivedCheckbox.is(':checked')) val = 'received';
            colTosearch.search(val).draw();
          });
          var _labelReceived = $('<label>').html(Pard.t.text('manager.proposals.received')).css({'display':'inline', 'cursor':'pointer'}).on('click', function(){
              _receivedCheckbox.prop("checked", !_receivedCheckbox.prop("checked"));
              _receivedCheckbox.trigger('change');
            });
          var _filtersContainer = $('<div>').append($('<span>').append(_ownCheckbox, _labelOwn), $('<span>').append(_receivedCheckbox, _labelReceived)).addClass('ownReceivedFilters-call-page');
          _tablesContainer[typeTable].prepend($('<div>').append(_filtersContainer).css({'position':'relative', 'margin-left':'0.5rem'}));
    }

    //DATATABLES

    var _selectCatReload = function(){
      Object.keys(_subcategorySelector).forEach(function(typeTable){
        var _ival = _subcategorySelector[typeTable].val();
        _subcategorySelector[typeTable] = $('<select>').append($('<option>').attr('value','').text(''));
        var _colCategry = _dataTables[typeTable].DataTable.column(_dataTables[typeTable].subcategoryColumn);
        $(_colCategry.header()).empty().text(Pard.t.text('manager.proposals.eventCat'));
        _subcategorySelector[typeTable].on( 'change', function () {
          var val = $.fn.dataTable.util.escapeRegex(
              _subcategorySelector[typeTable].val()
          );
          _colCategry.search( val ? '^'+val+'$' : '', true, false ).draw();
        });
        if (_colCategry.data().unique().length>1){
          var _selectContainer = $('<div>').addClass('select-container-datatableColumn');
          _subcategorySelector[typeTable].appendTo(_selectContainer.appendTo($(_colCategry.header()).text(Pard.t.text('dictionary.category').capitalize()))); 
          _colCategry.data().unique().each( function ( d, j ) {
              _subcategorySelector[typeTable].append( '<option value="'+d+'">'+d+'</option>' )
              if (d == _ival) _subcategorySelector[typeTable].val(d);
          } );
          _subcategorySelector[typeTable].click(function(e){
            e.stopPropagation();
          });
        }
        _subcategorySelector[typeTable].trigger('change');
      })
    }


    $(document).ready(function() {
      Object.keys(_dataTables).forEach(function(typeTable){
        // console.log(_dataTables[typeTable].hiddenColumns);
        
        if (typeTable != 'allProposals'){
          _dataTables[typeTable].DataTable = _dataTables[typeTable].table.DataTable({
            "language":{
              buttons: {
                  copyTitle: Pard.t.text('manager.copy.table'),
                  copyKeys: Pard.t.text('manager.copy.keys'),
                  copySuccess: {
                      _: Pard.t.text('manager.copy.success'),
                      1: Pard.t.text('manager.copy.success1')
                  }
              },
              "lengthMenu": Pard.t.text('manager.copy.results'),
              "zeroRecords": Pard.t.text('manager.zeroRecords'),
              "info": "",
              "infoEmpty": Pard.t.text('manager.infoEmpty'),
              "infoFiltered": "(filtered from _MAX_ total records)",
              "search": Pard.t.text('dictionary.search').capitalize(),
              "search": "_INPUT_",
              "searchPlaceholder": Pard.t.text('dictionary.search').capitalize(),
              "paginate": {
                "first": Pard.t.text('dictionary.first').capitalize(),
                "last": Pard.t.text('dictionary.last').capitalize(),
                "next": Pard.t.text('dictionary.next').capitalize(),
                "previous": Pard.t.text('dictionary.previous').capitalize()
              }
            },
            fixedHeader: {
              header: true
            },
            "autoWidth": false,
            "bAutoWidth": false,
            "scrollX": true,
            "scrollY": "85vh",
            "paging": false,
            "scrollCollapse": true,
            // 'responsive': true,
            // 'colReorder': true,
            "columnDefs": [
              { 
                "visible": false, 
                "targets": _dataTables[typeTable].hiddenColumns
              }
            ],
            "order": [1, 'desc'],
            // keys: true,
            dom: 'Bfrtip',
            buttons: [
              {
                extend: 'colvis',
                columns: ':gt(2)',
                text: Pard.Widgets.IconManager('visibility').render().attr('title', Pard.t.text('manager.proposals.hideShowCol.helper')),
                className: 'changeColumnsBtn',
                collectionLayout: 'fixed big_layout',
                fade: 200,
                prefixButtons: [{
                  extend: 'colvisGroup',
                  text: Pard.t.text('manager.proposals.hideShowCol.selectAll'),
                  show: ':gt(2)'
                },
                {
                  extend: 'colvisGroup',
                  text: Pard.t.text('manager.proposals.hideShowCol.unselect'),
                  hide: ':visible :gt(0)'
                },
                {
                  extend: 'colvisRestore',
                  text: Pard.t.text('manager.proposals.hideShowCol.initial'),
                  show: ':hidden'
                }]
              },
              {
                text: Pard.Widgets.IconManager('mailinglist').render().attr('title', Pard.t.text('manager.copy.helper')),
                className: 'mailinglistBtn',
                action: function(){
                  var columnData = _dataTables[typeTable].DataTable.column(_dataTables[typeTable].emailColumn, { search:'applied' }).data().unique();
                  var _emailList = '';
                  columnData.each(function(email){
                    _emailList += email+', ';
                  });
                  _emailList = _emailList.substring(0,_emailList.length-2)
                  Pard.Widgets.CopyToClipboard(_emailList);
                  var _copyPopupContent = $('<div>').append($('<div>').html(Pard.t.text('manager.copy.mex1', {amount: columnData.length})), $('<div>').html(Pard.t.text('manager.copy.mex2')));
                  Pard.Widgets.CopyPopup(Pard.t.text('manager.copy.title'), _copyPopupContent);
                }
              },
              {
                extend: 'collection',
                text:  Pard.Widgets.IconManager('export').render().attr('title', Pard.t.text('manager.export')),
                className: 'ExportCollectionBtn',
                collectionLayout: 'button-list',
                // backgroundClassName: 'ExportCollection-background',
                autoClose: true,
                fade: 200,
                // background: false,
                buttons: [
                // tablas propuestas por categoria
                  {
                    extend: 'excel',
                    text:'Excel',
                    customizeData: function(doc) {
                      doc.header.forEach(function(t, i){
                        if (t.indexOf(Pard.t.text('dictionary.category').capitalize())>-1) doc.header[i] = Pard.t.text('dictionary.category').capitalize()
                      });
                    },
                    exportOptions: {
                      columns: ':visible :gt(0)'
                    },
                    filename: Pard.t.text('dictionary.table').capitalize() + '-' + typeTable
                  },
                  {
                    extend: 'pdf',
                    text:'PDF',
                    customize: function(doc) {
                      doc.content[1].table.body[0].forEach(function(colTitle){
                        if (colTitle.text.indexOf(Pard.t.text('dictionary.category').capitalize())>-1) colTitle.text = Pard.t.text('dictionary.category').capitalize();
                        colTitle.alignment = 'left';
                        colTitle.margin = [2,2,2,2];
                      }) 
                    },
                    exportOptions: {
                      columns: ':visible :gt(0)',
                    },
                    orientation: 'landscape',
                    filename: Pard.t.text('dictionary.table').capitalize() + '-' + typeTable
                  },
                  {
                    extend: 'copy',
                    text: Pard.t.text('dictionary.copy').capitalize(),
                    header: false,
                    exportOptions: {
                      columns:  ':visible :gt(0)',
                    }
                  }
                ]
              }
            ],
            initComplete: function () {
              _filtersWidgets(this.api().column(0, { search:'applied' }), typeTable);
              var _colCategry = this.api().column(_dataTables[typeTable].subcategoryColumn);
              if (_colCategry.data().unique().length>1){
                var _selectContainer = $('<div>').addClass('select-container-datatableColumn');
                _subcategorySelector[typeTable].append($('<option>').attr('value','').text(''))
                    .appendTo(_selectContainer.appendTo($(_colCategry.header()).text(Pard.t.text('dictionary.category').capitalize())));  
                _colCategry.data().unique().sort().each( function ( d, j ) {
                    _subcategorySelector[typeTable].append( '<option value="'+d+'">'+d+'</option>' )
                } );
                _subcategorySelector[typeTable].on( 'change', function () {
                  var val = $.fn.dataTable.util.escapeRegex(
                      _subcategorySelector[typeTable].val()
                  );
                  _colCategry.search( val ? '^'+val+'$' : '', true, false ).draw();
                });
                _subcategorySelector[typeTable].click(function(e){
                  e.stopPropagation();
                });
              }
            }
          });
          Pard.Widgets.InfoTab[typeTable] = _dataTables[typeTable].DataTable;   
        }
        else{
          _dataTables[typeTable].DataTable = _dataTables[typeTable].table.DataTable({
            "language":{
              buttons: {
                  copyTitle: Pard.t.text('manager.copy.table'),
                  copyKeys: Pard.t.text('manager.copy.keys'),
                  copySuccess: {
                      _: Pard.t.text('manager.copy.success'),
                      1: Pard.t.text('manager.copy.success1')
                  }
              },
              "lengthMenu": Pard.t.text('manager.copy.results'),
              "zeroRecords": Pard.t.text('manager.zeroRecords'),
              "info": "",
              "infoEmpty": Pard.t.text('manager.infoEmpty'),
              "infoFiltered": "(filtered from _MAX_ total records)",
              "search": Pard.t.text('dictionary.search').capitalize(),
              "search": "_INPUT_",
              "searchPlaceholder": Pard.t.text('dictionary.search').capitalize(),
              "paginate": {
                "first": Pard.t.text('dictionary.first').capitalize(),
                "last": Pard.t.text('dictionary.last').capitalize(),
                "next": Pard.t.text('dictionary.next').capitalize(),
                "previous": Pard.t.text('dictionary.previous').capitalize()
              }
            },
            fixedHeader: {
              header: true
            },
            "autoWidth": false,
            "bAutoWidth": false,
            "scrollX": true,
            "scrollY": "85vh",
            "paging": false,
            "scrollCollapse": true,
            "columnDefs": [
              { "visible": false, "targets":[0,1,2]}
            ],
            "order": [2, 'desc'],
            dom: 'Bfrtip',
            buttons: [
              {
                text: Pard.Widgets.IconManager('mailinglist').render().attr('title', Pard.t.text('manager.copy.helper')),
                className: 'mailinglistBtn',
                action: function(){
                  var columnData = _dataTables['allProposals'].DataTable.column(_dataTables['allProposals'].emailColumn, { search:'applied' }).data().unique();
                  var _emailList = '';
                  columnData.each(function(email){
                    _emailList += email+', ';
                  });
                  _emailList = _emailList.substring(0,_emailList.length-2)
                  Pard.Widgets.CopyToClipboard(_emailList);
                  var _copyPopupContent = $('<div>').append($('<div>').html(Pard.t.text('manager.copy.mex1', {amount: columnData.length})), $('<div>').html(Pard.t.text('manager.copy.mex2')));
                  Pard.Widgets.CopyPopup(Pard.t.text('manager.copy.title'), _copyPopupContent);
                }
              },
              {
                extend: 'collection',
                text:  Pard.Widgets.IconManager('export').render().attr('title', Pard.t.text('manager.export')),
                className: 'ExportCollectionBtn',
                autoClose: true,
                fade: 200,
                collectionLayout: 'button-list',
                // background: false,
                buttons: [
                //para exportar tabla con todas las propuestas
                  {
                    extend: 'excel',
                    text:'Excel',
                    customizeData: function(doc) {
                      doc.header.forEach(function(t, i){
                        if (t.indexOf(Pard.t.text('dictionary.category').capitalize())>-1) doc.header[i] = Pard.t.text('dictionary.category').capitalize()
                      });
                    },
                    exportOptions: {
                        columns: ':visible :gt(0)'
                    },
                    filename: Pard.t.text('dictionary.table').capitalize() + '-' + typeTable
                  },
                  {
                    extend: 'pdf',
                    text:'PDF',
                    customize: function(doc) {
                      doc.content[1].table.body[0].forEach(function(colTitle){
                        if (colTitle.text.indexOf(Pard.t.text('dictionary.category').capitalize())>-1) colTitle.text = Pard.t.text('dictionary.category').capitalize();
                        colTitle.alignment = 'left';
                        colTitle.margin = [2,2,2,2];
                      }) 
                    },
                    exportOptions: {
                      columns: ':visible :gt(0)',
                    },
                    orientation: 'landscape',
                    filename: Pard.t.text('dictionary.table').capitalize() + '-' + typeTable
                  },
                  {
                    extend: 'copy',
                    text: Pard.t.text('dictionary.copy').capitalize(),
                    header: false,
                    exportOptions: {
                      columns:  ':visible :gt(0)',
                    }
                  }
                ]
              }
            ],
            initComplete: function () {
              var _colCategry = this.api().column(_dataTables[typeTable].subcategoryColumn);
              if (_colCategry.data().unique().length>1){
                var _selectContainer = $('<div>').addClass('select-container-datatableColumn');
                _subcategorySelector[typeTable].append($('<option>').attr('value','').text(''))
                    .appendTo(_selectContainer.appendTo($(_colCategry.header()).text(Pard.t.text('dictionary.category').capitalize())));  
                _colCategry.data().unique().each( function ( d, j ) {
                    _subcategorySelector[typeTable].append( '<option value="'+d+'">'+d+'</option>' )
                } );
                _subcategorySelector[typeTable].on( 'change', function () {
                  var val = $.fn.dataTable.util.escapeRegex(
                      _subcategorySelector[typeTable].val()
                  );
                  _colCategry.search( val ? '^'+val+'$' : '', true, false ).draw();
                });
                _subcategorySelector[typeTable].click(function(e){
                  e.stopPropagation();
                });
              }

              _filtersWidgets(this.api().column(0, { search:'applied' }), typeTable);

              var colType = this.api().column(1, { search:'applied' });
              var rfhCol = this.api().column(3);
              if (Object.keys(forms).length>1){
                var _selectContainer = $('<div>').addClass('select-container-datatableColumn rfh-selector');
                var selectType = $('<select>')
                  .append(
                    $('<option>').attr('value','').text(''))
                  .appendTo(_selectContainer.appendTo($(rfhCol.header())))
                  .addClass('material-icons');
                var types = {
                  artist: '<span style="font-size:16px" class="material-icons">&#xE029;</span>',
                  space: '<span style="font-size:16px" class="material-icons">&#xE0C8;</span>',
                  // organization: 'Organizaciones'
                }  
                for(var _formType in forms){
                  if (types[_formType])  selectType.append($('<option>').attr('value', _formType).html(types[_formType]));
                };
                selectType.on( 'change', function () {
                  var val =  selectType.val();
                  colType.search(val).draw();
                } );

                selectType.click(function(e){
                  e.stopPropagation();
                });
              }
            }
          });
          Pard.Widgets.InfoTab[typeTable] = _dataTables[typeTable].DataTable;        
        }
      });
    });

    return {
      render: function(){
        return _createdWidget;
      },
      addArtist: function(artist){
        var proposal = artist.proposals[0];
        _dataTables[proposal.form_category].DataTable.row.add(_dataTables[proposal.form_category].proposalRow(proposal, artist)).draw();
        _dataTables['allProposals'].DataTable.row.add(_dataTables['allProposals'].proposalRow('artist', proposal, artist)).draw();
        _proposalsNumber[proposal.form_category] += 1;
        if (artist.own) _addOwnArtist(artist);
        _selectCatReload();
      },
      addSpace: function(space){
        _dataTables[space.form_category].DataTable.row.add(_dataTables[space.form_category].proposalRow(space)).draw();
        _dataTables['allProposals'].DataTable.row.add(_dataTables['allProposals'].proposalRow('space', space)).draw();
        _proposalsNumber[space.form_category] += 1;
        if (space.own) _addOwnSpace(space);
        _selectCatReload();
      },
      deleteArtist: function(artist){
        for (var categoryTable in _dataTables){
          var _row = _dataTables[categoryTable].DataTable.row('#proposalRow-' + artist.proposal_id);
          if (_row && _row.index()>-1) {
            _row.remove().draw();
            if (_proposalsNumber[categoryTable]) _proposalsNumber[categoryTable] = _proposalsNumber[categoryTable] - 1;
          }
        }
        if (_own['artists'][artist.profile_id]) _deleteOwnArtist(artist); 
        _selectCatReload(); 
      },
      deleteSpace: function(space){
        for (var categoryTable in _dataTables){
          var _row = _dataTables[categoryTable].DataTable.row('#proposalRow-' + space.profile_id);
          if (_row && _row.index()>-1) {
            _row.remove().draw();
            if (_proposalsNumber[categoryTable]) _proposalsNumber[categoryTable] = _proposalsNumber[categoryTable] - 1;
          }
        }
        if (_own['spaces'][space.profile_id]) _deleteOwnSpace(space); 
        _selectCatReload();
      },
      modifySpace: function(space){
        for (var categoryTable in _dataTables){
          var _row = _dataTables[categoryTable].DataTable.row('#proposalRow-' + space.profile_id);
          if (_row && _row.index()>-1) {
            _row.remove().draw();
            if (_proposalsNumber[categoryTable]) _proposalsNumber[categoryTable] = _proposalsNumber[categoryTable] - 1;
          }
        }
        _dataTables[space.form_category].DataTable.row.add(_dataTables[space.form_category].proposalRow(space)).order([1,'desc']).draw();
        _dataTables['allProposals'].DataTable.row.add(_dataTables['allProposals'].proposalRow('space', space)).order([2,'desc']).draw();
        _proposalsNumber[space.form_category] += 1;
        _selectCatReload();
      },
      modifyArtist: function(artist){
        var profile = the_event.artists[artist.profile_id].artist;
        profile.proposals.forEach(function(proposal){
          _dataTables['allProposals'].DataTable.row('#proposalRow-' + proposal.proposal_id).remove();
          _dataTables['allProposals'].DataTable.row.add(_dataTables['allProposals'].proposalRow('artist', proposal, profile)).order([2,'desc']).draw();
          _dataTables[proposal.form_category].DataTable.row('#proposalRow-' + proposal.proposal_id).remove();
          _dataTables[proposal.form_category].DataTable.row.add(_dataTables[proposal.form_category].proposalRow(proposal, profile)).order([1,'desc']).draw();
        });
        _selectCatReload();
      }
    }
  }


  ns.Widgets.CopyPopup = function(title, content){
    var _createdWidget = $('<div>').addClass('fast reveal full').css('background','transparent');    
    var _outerContainer = $('<div>').addClass('vcenter-outer');
    var _innerContainer = $('<div>').addClass('vcenter-inner');
    var _popupContent = $('<div>').addClass('dt-button-info');
    var _title = $('<h2>').text(title);
    // var _sectionContainer = $('<div>'); 
    var _closeBtn = $('<button>').addClass('close-button small-1 popup-close-btn').attr({type: 'button'});
    _closeBtn.append($('<span>').html('&times;'));

    var _popup = new Foundation.Reveal(_createdWidget, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', close_on_background_click: true, multipleOpened:true});

    // _sectionContainer.append(_title, content);
    _popupContent.append(_title, content);
    _innerContainer.append(_popupContent);
    _createdWidget.append(_outerContainer.append(_innerContainer));

    $('body').append(_createdWidget);

    _createdWidget.click(function(){_popup.close()});

    _popup.open();
    setTimeout(function(){_popup.close()},2500);
  };

}(Pard || {}));




