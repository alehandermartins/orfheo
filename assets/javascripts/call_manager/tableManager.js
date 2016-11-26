'use strict';

(function(ns){

  ns.TableManager = function(the_event, forms){

    var artists = the_event.artists;
    var spaces = the_event.spaces;

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


    var spaceRow = function(space){
      var _row = $('<tr>').attr('id', space.profile_id);
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
        var _popupDisplayed = Pard.Widgets.DisplayPopupProposal(space, forms['space'][space.form_category], 'space', the_event.name);
        _popupDisplayed.setDeleteProposalCallback(function(data){
          if (data['status'] == 'success'){
            Pard.Bus.trigger('deleteSpace', {'profile_id': space.profile_id});
          }
          else{
            Pard.Widgets.Alert('',data.reason);
          }
        });
        _popupDisplayed.open();
      });

       _rfhCol.append(_icon);
       _nameCol.html(_name);
       _addressCol.append(_address);
       _emailCol.html(space.email);
       _phoneCol.html(space.phone);
       _row.append(_rfhCol, _nameCol, _addressCol, _emailCol, _phoneCol);
       return _row;
     }

      var proposalRow = function(artist, proposal){

       var _row = $('<tr>').attr('id', proposal.proposal_id);
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
         var _popupDisplayed = Pard.Widgets.DisplayPopupProposal(proposal, forms['artist'][proposal.form_category], 'artist', the_event.name);
         _popupDisplayed.setDeleteProposalCallback(function(data){
          if (data['status'] == 'success'){
            Pard.Bus.trigger('deleteArtist', {'profile_id': artist.profile_id, 'proposal_id': proposal.proposal_id});
          }
          else{
             Pard.Widgets.Alert('',data.reason);
           }
         });
         _popupDisplayed.open();
       });

      _rfhCol.append(_icon);
      _nameCol.html(_name);
      _categoryCol.html(Pard.Widgets.Dictionary(proposal.category).render());
      _titleCol.html(proposal.title);
      _emailCol.html(artist.email);
      _phoneCol.html(artist.phone);

      _row.append(_rfhCol, _nameCol, _categoryCol, _titleCol, _emailCol, _phoneCol);
      return _row;
    }

    spaces.forEach(function(space){
      _dataTables.spaces.tbody.append(spaceRow(space));
    });

    artists.forEach(function(artist){
      artist.proposals.forEach(function(proposal){
        _dataTables.artists.tbody.append(proposalRow(artist, proposal));
      });
    });

    $(document).ready(function() {
       Object.keys(_dataTables).forEach(function(type){
         _dataTables[type].table = _dataTables[type].table.DataTable({
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
        ]
        });
      });
    });
    //_spaceTable.columns.adjust().draw(true);
    _tablesContainer.artists.append(_dataTables.artists.table);
    _tablesContainer.spaces.append(_dataTables.spaces.table);
    _tablesContainer.spaces.hide();
    _createdWidget.append(_typeSelectorBox, _tablesContainer.artists, _tablesContainer.spaces);

    Pard.Bus.on('addArtist', function(artist){
      _dataTables.artists.table.row.add(proposalRow(artist, artist.proposals[0])).draw();
    });

    Pard.Bus.on('addSpace', function(space){
      _dataTables.spaces.table.row.add(spaceRow(space)).draw();
    });

    Pard.Bus.on('deleteArtist', function(artist){
      _dataTables.artists.table.row(document.getElementById(artist.proposal_id)).remove().draw();
    });

    Pard.Bus.on('deleteSpace', function(space){
      _dataTables.spaces.table.row(document.getElementById(space.profile_id)).remove().draw();
    });

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }
}(Pard || {}));
