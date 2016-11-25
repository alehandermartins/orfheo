'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};


  ns.Widgets.TableManager = function(the_event, interactions){

    // var addArtist = interactions.addArtist;
    // var addSpace = interactions.addSpace;
    
    // var the_event = Pard.CachedEvent;
    var artists = the_event.artists;
    var spaces = the_event.spaces;
    var _createdWidget = $('<div>');
    var _typeSelectorBox = $('<div>').addClass('types-selector-call-manager');
    var _typeSelector = $('<select>'); 
    _typeSelectorBox.append(_typeSelector);
    var _forms;
    var _formTypes = ['artist','space']
  
    var _dataTables = {};
    var _tablesContainer = {};
    var _selectorOptions = {};
    var _tags = [];

    _tags.push({
      id: 'allProposals',
      text: 'Todas las propuestas',
      table: _tablesContainer['allProposals']
    });

    var _typesDictionary = {
      artist: 'Artistas',
      space: 'Espacios' 
    }

    Pard.Backend.getCallForms(the_event.call_id, function(data){
      _forms = data.forms;
      _dataTables['allProposals'] = Pard.Widgets.PrintTableAllProposal(_forms, the_event, interactions);
      _tablesContainer['allProposals'] = $('<div>').append(_dataTables['allProposals'].table);

      _formTypes.forEach(function(type){
        if (_forms[type]){
          // _tablesContainer[type] = $('<div>');
          // _dataTables[type] = {};
          _selectorOptions[type] = [];
          for (var formcat in _forms[type]){
            _tablesContainer[formcat] = $('<div>');
            _dataTables[formcat] = Pard.Widgets.PrintTable(type, _forms[type][formcat], the_event, interactions);
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
        minimumResultsForSearch: Infinity
        // dropdownCssClass: 'orfheoTypeFormSelector'
      });
      var lastTypeSelected = 'allProposals';
      _typeSelector.on('select2:select', function(){
        var _data = _typeSelector.select2('data')[0];
        console.log(_data); 
        if(_data['id'] != lastTypeSelected){
          _tablesContainer[lastTypeSelected].hide();
          _tablesContainer[_data['id']].show();
          lastTypeSelected = _data['id'];
        }
      });

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
              {
                extend: 'colvis',
                text: 'Columnas',
                collectionLayout: 'fixed',
                //  postfixButtons: [  
                //  {
                //   extend: 'colvisRestore',
                //   text: 'Configuración incial',
                //   show: ':hidden'
                // }],
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
              }
                      
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
              {
                extend: 'pdf',
                exportOptions: {
                    columns: ':visible'
                },
                orientation: 'landscape',
                filename: 'Artistas_Espacios'
              }
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
          }
        });
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




