'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};


  ns.Widgets.TableManager = function(the_event, forms, displayer){
    console.log(forms);
    var artists = the_event.artists;
    var spaces = the_event.spaces;
    var _createdWidget = $('<div>');
    var _typeSelectorBox = $('<div>').addClass('types-selector-call-manager');
    var _typeSelector = $('<select>'); 
    _typeSelectorBox.append(_typeSelector);
    var _formTypes = ['artist','space']
  
    var _dataTables = {};
    var _tablesContainer = {};
    var _selectorOptions = {};
    var _tags = [];

    _tags.push({
      id: 'allProposals',
      text: 'Todas las propuestas'
    });

    var _typesDictionary = {
      artist: 'Artistas',
      space: 'Espacios' 
    }

    _dataTables['allProposals'] = Pard.Widgets.PrintTableAllProposal(displayer);
    _tablesContainer['allProposals'] = $('<div>').append(_dataTables['allProposals'].table);

    _formTypes.forEach(function(type){
      if (forms[type]){
        _selectorOptions[type] = [];
        for (var formcat in forms[type]){
          _tablesContainer[formcat] = $('<div>');
          _dataTables[formcat] = Pard.Widgets.PrintTable(type, forms[type][formcat], displayer);
          _selectorOptions[type].push({id:formcat, text:formcat, table: _dataTables[formcat]})
          _tablesContainer[formcat].append(_dataTables[formcat].table).hide();
        }
        _tags.push({
          text: _typesDictionary[type],
          icon: type,
          children: _selectorOptions[type]
        });
      }
    });  
    
    spaces.forEach(function(proposal){
      var _proposal = $.extend(true, {}, proposal);
      // necesary for proposals conFusion withput form cat
      proposal.form_category = proposal.form_category || Pard.Widgets.Dictionary(proposal.category).render();
      proposal.subcategory = proposal.subcategory || Pard.Widgets.Dictionary(proposal.category).render();
      _proposal.type = 'space';
      _dataTables[proposal.form_category].addRow(proposal);
      _dataTables['allProposals'].addRow('space', proposal);
    });
    artists.forEach(function(profile){
      profile.proposals.forEach(function(proposal){
        proposal.form_category = proposal.form_category || Pard.Widgets.Dictionary(proposal.category).render();
        proposal.subcategory = proposal.subcategory || Pard.Widgets.Dictionary(proposal.category).render();
        _dataTables[proposal.form_category].addRow(proposal, profile);
        _dataTables['allProposals'].addRow('artist', proposal, profile);
      });
    });

    _createdWidget.append(_typeSelectorBox);
    for (var table in _tablesContainer) {
      _createdWidget.append(_tablesContainer[table]);
    }

    _typeSelector.select2({
      data: _tags,
      templateResult: Pard.Widgets.FormatResource,
      allowClear: true,
       placeholder: {
        id: 'allProposals', // the value of the option
        text: 'Todas las propuestas'
      },
      // minimumResultsForSearch: Infinity
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

    $(document).ready(function() {
      // for (var type in _dataTables){ 
      Object.keys(_dataTables).forEach(function(typeTable){
        if (typeTable != 'allProposals'){
          _dataTables[typeTable].table = _dataTables[typeTable].table.DataTable({
          "language":{
            buttons: {
                copyTitle: 'Copia tabla',
                copyKeys: '<i>ctrl</i> o <i>\u2318</i> + <i>C</i> para copiar los datos de la tabla a tu portapapeles. <br><br>Para anular, haz click en este mensaje o pulsa Esc.',
                copySuccess: {
                    _: '<strong>Copiadas %d filas</strong> de datos al portapapeles',
                    1: '<strong>Copiada 1 file</strong> de datos al portapapeles'
                }
            },
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
          "autoWidth": false,
          "bAutoWidth": false,
          "scrollX": true,
          "scrollY": "90vh",
          "paging": false,
          "scrollCollapse": true,
          // 'responsive': true,
          // 'colReorder': true,
          "columnDefs": [
            { "visible": false, "targets": _dataTables[typeTable].hiddenColumns}
            ],
          // keys: true,
          dom: 'Bfrtip',
          buttons: [
            {
              extend: 'colvis',
              text: Pard.Widgets.IconManager('visibility').render(),
              className: 'changeColumnsBtn',
              collectionLayout: 'fixed big_layout',
              fade: 200,
              prefixButtons: [{
                extend: 'colvisGroup',
                text: 'Selecciona todo',
                show: ':hidden'
              },
              {
                extend: 'colvisGroup',
                text: 'Desmarca todo',
                hide: ':visible'
              },
              {
                extend: 'colvisRestore',
                text: 'Configuración incial',
                show: ':hidden'
              }]
            },
            {
              text: Pard.Widgets.IconManager('mailinglist').render(),
              className: 'mailinglistBtn',
              action: function(){
                var columnData = _dataTables[typeTable].table.column(_dataTables[typeTable].emailColumn, { search:'applied' }).data().unique();
                console.log(columnData)
                var _emailList = '';
                columnData.each(function(email){
                  _emailList += email+', ';
                });
                _emailList = _emailList.substring(0,_emailList.length-2)
                Pard.Widgets.CopyToClipboard(_emailList);
                var _copyPopupContent = $('<div>').append($('<div>').html('<strong>Copiados '+columnData.length+' contactos </strong> de correo al portapapeles'), $('<div>').html('(<strong><i>Ctrl+V</i></strong> para pegar)'));
                Pard.Widgets.CopyPopup('Copia correos', _copyPopupContent);
              }
            },
            {
              extend: 'collection',
              text:  Pard.Widgets.IconManager('export').render(),
              className: 'ExportCollectionBtn',
              collectionLayout: 'button-list',
              // backgroundClassName: 'ExportCollection-background',
              autoClose: true,
              fade: 200,
              // background: false,
              buttons: [
                {
                  extend: 'excel',
                  exportOptions: {
                      columns: ':visible'
                  },
                  filename: 'Tabla-'+typeTable
                },
                {
                  extend: 'pdf',
                  exportOptions: {
                      columns: ':visible'
                  },
                  orientation: 'landscape',
                  filename: 'Tabla-'+typeTable
                },
                {
                  extend: 'copy',
                  text: 'Copia',
                  exportOptions: {
                  columns: ':visible'
                }
                }
              ]
            }
          ],
          initComplete: function () {
              this.api().column(_dataTables[typeTable].subcategoryColumn).every(function () {
                var column = this;
                if (column.data().unique().length>1){
                  var _selectContainer = $('<div>').addClass('select-container-datatableColumn');
                  var select = $('<select>').append($('<option>').attr('value','').text(''))
                      .appendTo(_selectContainer.appendTo($(column.header()).text('Categoría')));  
                  column.data().unique().sort().each( function ( d, j ) {
                      select.append( '<option value="'+d+'">'+d+'</option>' )
                  } );
                  select.on( 'change', function () {
                          var val = $.fn.dataTable.util.escapeRegex(
                              select.val()
                          );
                          column
                              .search( val ? '^'+val+'$' : '', true, false )
                              .draw();
                      } );

                  select.click(function(e){
                    e.stopPropagation();
                  });
                }
              });
            }
          });
        }
        else{
          _dataTables[typeTable].table = _dataTables[typeTable].table.DataTable({
          "language":{
            buttons: {
                copyTitle: 'Copia tabla',
                copyKeys: '<i>ctrl</i> o <i>\u2318</i> + <i>C</i> para copiar los datos de la tabla a tu portapapeles. <br><br>Para anular, haz click en este mensaje o pulsa Esc.',
                copySuccess: {
                    _: '<strong>Copiadas %d filas</strong> de datos al portapapeles',
                    1: '<strong>Copiada 1 file</strong> de datos al portapapeles'
                }
            },
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
          "autoWidth": false,
          "bAutoWidth": false,
          "scrollX": true,
          "scrollY": "90vh",
          "paging": false,
          "scrollCollapse": true,
          "columnDefs": [
            { "visible": false, "targets":[6]}
            ],
          dom: 'Bfrtip',
          buttons: [
            {
              text: Pard.Widgets.IconManager('mailinglist').render(),
              className: 'mailinglistBtn',
              action: function(){
                var columnData = _dataTables['allProposals'].table.column(5, { search:'applied' }).data().unique();
                var _emailList = '';
                columnData.each(function(email){
                  _emailList += email+', ';
                });
                _emailList = _emailList.substring(0,_emailList.length-2)
                Pard.Widgets.CopyToClipboard(_emailList);
                var _copyPopupContent = $('<div>').append($('<div>').html('<strong>Copiados '+columnData.length+' contactos </strong> de correo al portapapeles'), $('<div>').html('(<strong><i>Ctrl+V</i></strong> para pegar)'));
                Pard.Widgets.CopyPopup('Copia correos', _copyPopupContent);
              }
            },
            {
              extend: 'collection',
              text:  Pard.Widgets.IconManager('export').render(),
              className: 'ExportCollectionBtn',
              autoClose: true,
              fade: 200,
              collectionLayout: 'button-list',
              // background: false,
              buttons: [
                {
                  extend: 'excel',
                  text:'Exporta Excel',
                  exportOptions: {
                      columns: ':visible'
                  },
                  filename: 'Tabla-'+typeTable
                },
                {
                  extend: 'pdf',
                  text:'Crea PDF',
                  exportOptions: {
                      columns: ':visible'
                  },
                  orientation: 'landscape',
                  filename: 'Tabla-'+typeTable
                },
                {
                  extend: 'copy',
                  text: 'Copia los datos',
                  exportOptions: {
                    columns: ':visible'
                  }
                }
                ]
            }],
            initComplete: function () {
              this.api().columns(2).every(function () {
                var column = this;
                if (column.data().unique().length>1){
                  var _selectContainer = $('<div>').addClass('select-container-datatableColumn');
                  var select = $('<select>').append($('<option>').attr('value','').text(''))
                      .appendTo(_selectContainer.appendTo($(column.header()).text('Categoría')));  
                  column.data().unique().sort().each( function ( d, j ) {
                      select.append( '<option value="'+d+'">'+d+'</option>' )
                  } );
                  select.on( 'change', function () {
                          var val = $.fn.dataTable.util.escapeRegex(
                              select.val()
                          );
                          column
                              .search( val ? '^'+val+'$' : '', true, false )
                              .draw();
                      } );

                  select.click(function(e){
                    e.stopPropagation();
                  });
                }
              });
              var colTosearch = this.api().columns(6, { search:'applied' });
              this.api().columns(0).every(function () {
                var rfhCol = this;
                console.log(colTosearch.data().eq( 0 ).unique().sort());
                if (colTosearch.data().eq( 0 ).unique().length>1){
                  var _selectContainer = $('<div>').addClass('select-container-datatableColumn rfh-selector');
                  var select = $('<select>').append($('<option>').attr('value','').text(''))
                      .appendTo(_selectContainer.appendTo($(rfhCol.header())));  
                  colTosearch.data().eq( 0 ).unique().sort().each( function ( d, j ) {
                      select.append( '<option value="'+d+'">'+d+'</option>' )
                  } );
                  select.on( 'change', function () {
                          var val = $.fn.dataTable.util.escapeRegex(
                              select.val()
                          );
                          colTosearch
                              .search( val ? '^'+val+'$' : '', true, false )
                              .draw();
                      } );

                  select.click(function(e){
                    e.stopPropagation();
                  });
                }
              });
            }
          });
        }
      });
      $('.ExportCollectionBtn').attr('title','Exporta los dato de la tabla')
      $('.mailinglistBtn').attr('title','Copia lista de correos') 
      $('.changeColumnsBtn').attr('title','Muestra/Esconde columnas')
    });
    
    
    Pard.Bus.on('addArtist', function(artist){
      var proposal = artist.proposals[0];
      _dataTables[proposal.form_category].table.row.add(_dataTables[proposal.form_category].proposalRow(proposal, artist)).draw();
      _dataTables['allProposals'].table.row.add(_dataTables['allProposals'].proposalRow('artist', proposal, artist)).draw();
    });
    Pard.Bus.on('addSpace', function(space){
      _dataTables[space.form_category].table.row.add(_dataTables[space.form_category].proposalRow(space)).draw();
      _dataTables['allProposals'].table.row.add(_dataTables['allProposals'].proposalRow('space', space)).draw();
    });
    Pard.Bus.on('deleteArtist', function(artist){
      for (var categoryTable in _dataTables){
        var _row = _dataTables[categoryTable].table.row('#proposalRow-'+artist.proposal_id);
        if (_row && _row.index()>-1) _row.remove().draw();
      }
    });
    Pard.Bus.on('deleteSpace', function(space){
      for (var categoryTable in _dataTables){
        var _row = _dataTables[categoryTable].table.row('#proposalRow-'+space.profile_id);
        if (_row && _row.index()>-1) _row.remove().draw();
      }
    });
    
  
    return {
      render: function(){
        return _createdWidget;
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

    var _popup = new Foundation.Reveal(_createdWidget, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', close_on_background_click: true});

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




