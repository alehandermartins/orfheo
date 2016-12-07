'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.PrintTable = function(type, form, displayer) {

    var _form = $.extend(true, {}, form);

    var _table = $('<table>').addClass('table-proposal stripe row-border ').attr({'cellspacing':"0"}).css({
      'margin': '0 auto',
      'width': '100%',
      'clear': 'both',
      'table-layout': 'fixed',
      'word-wrap':'break-word',
    });

    var _tbody = $('<tbody>');

    var _thead = $('<thead>');
    var _titleRow = $('<tr>');
    var _tfoot = $('<tfoot>');
    var _titleRowFoot = $('<tr>');
    // All non numeric field used by orfheo --> vector needed for ordering
    var _orfheoFields = {
      artist: ['proposal_id','type','name', 'subcategory', 'title','short_description','description','duration','availability','children','phone','email'],
      space: ['proposal_id', 'type','name', 'subcategory','address', 'description','availability','phone','email']
    }
    //Mandatory fields that are not asked in forms
    var _mandatoryFields = {
     artist: ['proposal_id', 'type', 'name', 'email', 'subcategory'],
     space: ['proposal_id', 'type', 'name', 'email', 'address', 'description', 'subcategory']
    }
    // The columns I want to see in table as default
    var _shownColumns = {
      artist: ['type','name', 'title','short_description','duration','availability','phone','email'],
      space: ['type','name', 'subcategory','address','availability', 'phone','email']
    }

    var _colPosition = 0;
    var _hiddenColumns = [];
    var _emailColumn;
    var _emailIndex = 0;
    var _subcategoryColumn;
    var _subcategoryIndex = 0;

    var _printTitleAndFoot = function(field){
      _form[field] = Pard.Widgets.InfoTab[field] || _form[field];
      var _label = _form[field]['label'];
      var _colTitle = $('<th>').append(_label).addClass('column-call-manager-table');
      if (_form[field]['input'] == 'Input') _colTitle.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
      else _colTitle.addClass('column-'+_form[field]['input']);
      _titleRow.append(_colTitle);
      var _colFoot = $('<th>').addClass('column-call-manager-table').append(_label);
      if (_form[field]['input'] == 'Input') _colFoot.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
      else _colFoot.addClass('column-'+_form[field]['input']);
      _titleRowFoot.append(_colFoot);
    }

    _orfheoFields[type].forEach(function(field){
      if (_form[field] || $.inArray(field, _mandatoryFields[type])>-1){
        if ($.inArray(field, _shownColumns[type])<0) _hiddenColumns.push(_colPosition);
        _colPosition += 1;
        if (field == 'email') _emailColumn = _emailIndex;
        _emailIndex += 1;
        if (field == 'subcategory') _subcategoryColumn = _subcategoryIndex;
        _subcategoryIndex += 1;
        _printTitleAndFoot(field);
      }
    });

    for (var field in _form){
      if ($.isNumeric(field)){
        _hiddenColumns.push(_colPosition);
        _colPosition += 1;
        _printTitleAndFoot(field);
      }
    }

    _table.append(_thead.append(_titleRow));
    _table.append(_tfoot.append(_titleRowFoot));

    _table.append(_tbody);

    var proposalRow = function(proposal, profile){
      // _proposalsNumber += 1;
      var _proposal = $.extend(true, {}, proposal);
      _proposal.name = _proposal.name || profile.name;
      _proposal.phone = _proposal.phone || profile.phone;
      _proposal.email = _proposal.email || profile.email;
      _proposal.profile_id = _proposal.profile_id || profile.profile_id;
      _proposal.type = type;
      var _row = $('<tr>');
      if (type == 'artist') _row.attr('id', 'proposalRow-'+proposal.proposal_id);
      if (type == 'space') _row.attr('id', 'proposalRow-'+proposal.profile_id);
      _orfheoFields[type].forEach(function(field){
        if (_form[field] || $.inArray(field, _mandatoryFields[type])>-1){
          var _info = '';
          if(_form[field].info) _info = _form[field].info(_proposal, displayer);
          else _info = _proposal[field];
          var _col = $('<td>').addClass('column-call-manager-table');
          if (_form[field]['input'] == 'Input') _col.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
          else _col.addClass('column-'+_form[field]['input']);
          _row.append(_col.append(_info));
        }
      });

      for (var field in _form){
        if ($.isNumeric(field)){
          var _col = $('<td>').addClass('column-call-manager-table');
          if (_form[field]['input'] == 'Input') _col.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
          else _col.addClass('column-'+_form[field]['input']);
          if (proposal[field]) _col.append(proposal[field]);
          _row.append(_col);
        }
      }

      return _row;
    }

    return {
      table: _table,
      addRow: function(proposal, profile){
        _tbody.prepend(proposalRow(proposal, profile))
      },
      proposalRow: proposalRow,
      hiddenColumns: _hiddenColumns,
      emailColumn: _emailColumn,
      subcategoryColumn: _subcategoryColumn
    }
  }



  ns.Widgets.PrintTableAllProposal = function(displayer){

    var _table = $('<table>').addClass('table-proposal stripe row-border ').attr({'cellspacing':"0"}).css({
      'margin': '0 auto',
      'width': '100%',
      'clear': 'both',
      'table-layout': 'fixed',
      'word-wrap':'break-word',
    });
    var _tbody = $('<tbody>');

    var _thead = $('<thead>');
    var _titleRow = $('<tr>');
    var _tfoot = $('<tfoot>');
    var _titleRowFoot = $('<tr>');

    var _orfheoFields = ['proposal_id','hiddenType','type','name', 'subcategory', 'titleAddress', 'phone','email'];

    var _form = {}

    _form.phone ={
      "label": "Teléfono",
      "input" : "InputTel"
    }

    var _subcategoryColumn;

    _orfheoFields.forEach(function(field, index){
      if(field == 'subcategory') _subcategoryColumn = index; 
      _form[field] = Pard.Widgets.InfoTab[field] || _form[field];
      var _label = _form[field]['label'];
      var _colTitle = $('<th>').append(_label).addClass('column-call-manager-table');
      if (_form[field]['input'] == 'Input') _colTitle.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
      else _colTitle.addClass('column-'+_form[field]['input']);
      _titleRow.append(_colTitle);
      var _colFoot = $('<th>').addClass('column-call-manager-table').append(_label);
      if (_form[field]['input'] == 'Input') _colFoot.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
      else _colFoot.addClass('column-'+_form[field]['input']);
      _titleRowFoot.append(_colFoot);
    });

    _table.append(_thead.append(_titleRow));
    _table.append(_tfoot.append(_titleRowFoot));
    _table.append(_tbody);

    var proposalRow = function(profileType, proposal, profile){
      var _proposal = $.extend(true, {}, proposal);
      _proposal.name = _proposal.name || profile.name;
      _proposal.phone = _proposal.phone || profile.phone;
      _proposal.email = _proposal.email || profile.email;
      _proposal.profile_id = _proposal.profile_id || profile.profile_id;
      _proposal.type = profileType;
      // necesary for proposals conFusion withput form cat
      var _row = $('<tr>');
      if (profileType == 'artist') _row.attr('id', 'proposalRow-'+proposal.proposal_id);
      if (profileType == 'space') _row.attr('id', 'proposalRow-'+proposal.profile_id);
      _orfheoFields.forEach(function(field){
        var _info = '';
        if(_form[field].info) _info = _form[field].info(_proposal, displayer);
        else _info = _proposal[field];
        var _col = $('<td>').addClass('column-call-manager-table');
        if (_form[field]['input'] == 'Input') _col.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
        else _col.addClass('column-'+_form[field]['input']);
        _row.append(_col);
        _col.append(_info);
      });

      return _row;
    }

    return {
      table: _table,
      addRow: function(profileType, proposal, profile){
        _tbody.prepend(proposalRow(profileType, proposal, profile))
      },
      proposalRow: proposalRow,
      subcategoryColumn: _subcategoryColumn
    }
  }


  ns.Widgets.InfoTab = {
    type: {
      info: function(proposal){
        if (proposal.profile_id.indexOf('own')<0) return  $('<a>').append(Pard.Widgets.IconManager(proposal.type).render()).attr({'href':'/profile?id='+proposal.profile_id, 'target':'_blank'});
        else return Pard.Widgets.IconManager(proposal.type).render();
      },
      label: 'rfh',
      input: 'type'
    },
    name:{ 
      info: function(proposal, displayer) { 
        return $('<a>').attr({'href':'#'}).append(proposal.name).on('click', function(){
           displayer.displayProposal(proposal, proposal.type);
        });
      },
      label: 'Nombre',
      input:'Inputtext'
    },
    address:{ 
      info: function(proposal){
        var _address = ' ';
        if (proposal['address']['route']) _address +=  proposal['address']['route']+ ' ';
        if (proposal['address']['street_number']) _address += ' '+proposal['address']['street_number']+',  ';
        if (proposal['address']['door']) _address += ', puerta/piso '+proposal['address']['door']+',  ';
        _address += proposal['address']['postal_code']+', '+proposal['address']['locality'];
        return $('<a>').attr({
          'href':'http://maps.google.com/maps?q='+_address,
          target: '_blank'}).append(_address);
      },
      label: 'Dirección',
      input: 'InputAddress'
    },
    duration: {
      info: function(proposal){
        return proposal['duration']+' min';
      },
      label: 'Duración',
      input: 'Selector'
    },
    availability:{  
      info: function(proposal) {
        var _info = '';
        proposal['availability'].forEach(function(day){
          _info += moment(new Date(day)).locale('es').format('DD MMMM, ');
        });
        return _info.substring(0, _info.length-2);
      },
      label: 'Disponibilidad',
      input: 'MultipleDaysSelector'
    },
    email: {
      label : "Email",
      input : "EmailInput",
    },
    description : {
      label: "Descripción",
      input : "TextArea"
    },
    subcategory : {
      label : "Categoría en el evento",
      input : "Selector"
    },
    titleAddress:{
      info: function(proposal, displayer){
        if (proposal.title) return proposal['title'];
        else if (proposal.address) return Pard.Widgets.InfoTab['address'].info(proposal, displayer);
      },
      label : "Título / Dirección",
      input : "Inputtext"
    },
    hiddenType:{
      info: function(proposal){
        return proposal.type; 
      },
      label:'hiddenType',
      input: 'Inputtex'
    },
    proposal_id:{
      info: function(proposal){
        return proposal.proposal_id.indexOf('own')>-1 ? 'own' : 'received'; 
      },
      label:'proposal_id',
      input: 'Inputtex'
    },
  }



  ns.Widgets.ProgramTable = function(program){
    console.log(program);

    var _createdWidget = $('<div>');
    var _table = $('<table>').addClass('table-proposal stripe row-border ').attr({'cellspacing':"0"}).css({
      'margin': '0 auto',
      'width': '100%',
      'clear': 'both',
      'table-layout': 'fixed',
      'word-wrap':'break-word',
    });
    var _tbody = $('<tbody>');

    var _thead = $('<thead>');
    var _titleRow = $('<tr>');
    var _tfoot = $('<tfoot>');
    var _titleRowFoot = $('<tr>');

    var _columns = ['day','time','artist','category','title','short_description','space_number','space','space_category','comments','children','phone','email','confirmed'];
    var _shownColumns = ['day','time','artist','category','title','short_description','space'];
    var _hiddenColumns = [];
    var _outerTableContainer = $('<div>');
    var _tableBox = $('<div>').addClass('table-box-call-manager-page');

    _table.append(_thead.append(_titleRow));
    _table.append(_tfoot.append(_titleRowFoot));
    _table.append(_tbody);


    _columns.forEach(function(field, index){
      if ($.inArray(field, _shownColumns) == -1) _hiddenColumns.push(index);
      var _titleCol = $('<th>')
      if (field == 'email') _titleCol.text('Email artista');
      else if (field == 'phone') _titleCol.text('Tél. artista');
      else var _titleCol = $('<th>').text(Pard.Widgets.Dictionary(field).render());
      _titleCol.addClass('column-table-program-call-manager column-'+field);
      _titleRow.append(_titleCol);
      var _footCol = $('<th>').text(Pard.Widgets.Dictionary(field).render())
      .addClass('column-table-program-call-manager column-'+field);
      _titleRowFoot.append(_footCol);
    });

    _outerTableContainer.append(_tableBox.append(_table)).css('position','relative');
    _createdWidget.append(_outerTableContainer);

    _table = _table.DataTable({
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
    "scrollY": "85vh",
    "paging": false,
    "scrollCollapse": true,
    // 'responsive': true,
    // 'colReorder': true,
    "columnDefs": [
      { "visible": false, "targets": _hiddenColumns}
    ],
    "order": [1,'asc'],
    // keys: true,
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'colvis',
        // columns: ':gt(0)',
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
          var columnData = _table.column(12).data().unique();
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
            filename: 'Programación'
          },
          {
            extend: 'pdf',
            exportOptions: {
                columns: ':visible'
            },
            orientation: 'landscape',
            filename: 'programación',
            title: 'Programación'

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
       var _colCategry = this.api().column(3);
        if (_colCategry.data().unique().length>1){
          var _selectContainer = $('<div>').addClass('select-container-datatableColumn');
          var _selectCat = $('<select>').append($('<option>').attr('value','').text(''))
              .appendTo(_selectContainer.appendTo($(_colCategry.header()).text('Categoría')));  
          _colCategry.data().unique().sort().each( function ( d, j ) {
              _selectCat.append( '<option value="'+d+'">'+d+'</option>' )
          } );
          _selectCat.on( 'change', function () {
            var val = $.fn.dataTable.util.escapeRegex(
                _selectCat.val()
            );
            _colCategry.search( val ? '^'+val+'$' : '', true, false ).draw();
          });
          _selectCat.click(function(e){
            e.stopPropagation();
          });
        }
      }
    });
    

    return {
      table: _createdWidget
    }
  }


}(Pard || {}));
