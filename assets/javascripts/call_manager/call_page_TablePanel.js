'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};


  ns.Widgets.TableManager = function(the_event, forms){

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

    _dataTables['allProposals'] = Pard.Widgets.PrintTableAllProposal(forms, the_event);
    _tablesContainer['allProposals'] = $('<div>').append(_dataTables['allProposals'].table);

    _formTypes.forEach(function(type){
      if (forms[type]){
        _selectorOptions[type] = [];
        for (var formcat in forms[type]){
          _tablesContainer[formcat] = $('<div>');
          _dataTables[formcat] = Pard.Widgets.PrintTable(type, forms[type][formcat], the_event);
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
      // necesary for proposals conFusion withput form cat
      if (!(proposal.form_category)) proposal.form_category = Pard.Widgets.Dictionary(proposal.category).render();
      _dataTables[proposal.form_category].addRow(proposal);
      _dataTables['allProposals'].addRow('space', proposal);
    });
    artists.forEach(function(profile){
      profile.proposals.forEach(function(proposal){
        // necesary for proposals conFusion withput form cat
        if (!(proposal.form_category)) proposal.form_category = Pard.Widgets.Dictionary(proposal.category).render();
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
      _typeSelector.on('select2:opening', function(e) {
        e.preventDefault();
      }); 
      setTimeout(function() {
        _typeSelector.off('select2:opening');
      }, 1);
    });

    var _emailWidgetsBtn = $('<button>').append(Pard.Widgets.IconManager('mailinglist').render()).attr('type','button');
    _emailWidgetsBtn.click(function(){
      Pard.Widgets.BigAlert('', Pard.Widgets.MailinglistMaker());
    });

    var _copyEmailBtn = $('<button>').attr('type','button').text('Exporta lista de correos'); 

    _copyEmailBtn.click(function(){
      var columnData = _dataTables['allProposals'].table.column(5, { search:'applied' }).data().unique();
      var _emailList = '';
      console.log(columnData.length);
      columnData.each(function(email){
        _emailList += email+', ';
      });
      _emailList = _emailList.substring(0,_emailList.length-2)
      Pard.Widgets.CopyToClipboard(_emailList);
    });

    _tablesContainer['allProposals'].prepend(_copyEmailBtn);

    $(document).ready(function() {
      // for (var type in _dataTables){ 
      Object.keys(_dataTables).forEach(function(typeTable){
        if (typeTable != 'allProposals'){
          _dataTables[typeTable].table = _dataTables[typeTable].table.DataTable({
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
          // dom: {
          //   collection: {
          //   tag: 'ul',
          //   className: 'dt-button-collection f-dropdown open',
          //   button: {
          //   tag: 'a',
          //   className: 'small'
          //   }
          //   }
          //   },
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
            ]
          });
        }
        else{
          _dataTables[typeTable].table = _dataTables[typeTable].table.DataTable({
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
          "autoWidth": false,
          "bAutoWidth": false,
          "scrollX": true,
          "scrollY": "90vh",
          "paging": false,
          "scrollCollapse": true,
          "columnDefs": [
            { "visible": false, "targets": _dataTables[typeTable].hiddenColumns}
            ],
          dom: 'Bfrtip',
          buttons: [
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
            }]
          });
        }
      });
    });
  

    return {
      render: function(){
        return _createdWidget;
      },
      addArtist: function(artist){
        var proposal = artist.proposals[0];
        _dataTables[proposal.form_category].table.row.add(_dataTables[proposal.form_category].proposalRow(proposal, artist)).draw();
        _dataTables['allProposals'].table.row.add(_dataTables['allProposals'].proposalRow('artist', proposal, artist)).draw();
      },
      addSpace: function(proposal){
        _dataTables[proposal.form_category].table.row.add(_dataTables[proposal.form_category].proposalRow(proposal)).draw();
        _dataTables['allProposals'].table.row.add(_dataTables['allProposals'].proposalRow('space', proposal)).draw();
      },
      deleteArtist: function(proposal_id){
        for (var categoryTable in _dataTables){
          var _row = _dataTables[categoryTable].table.row('#proposalRow-'+proposal_id);
          console.log(_row.index());
          if (_row && _row.index()>-1) _row.remove().draw();
        }
      },
      deleteSpace: function(profile_id){
        for (var categoryTable in _dataTables){
          var _row = _dataTables[categoryTable].table.row('#proposalRow-'+profile_id);
          console.log(_row.index());
          if (_row && _row.index()>-1) _row.remove().draw();
        }
      }
    }
  }



}(Pard || {}));




