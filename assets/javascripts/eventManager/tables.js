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
      artist: ['profile_id','proposalNumber','type','name', 'subcategory', 'title','short_description','description','duration','availability','children','cache','phone','email','amend'],
      space: ['profile_id','proposalNumber', 'type','name', 'subcategory','address', 'description','availability','phone','email','amend']
    }
    //Mandatory fields that are not asked in forms
    var _mandatoryFields = {
     artist: ['profile_id','proposalNumber', 'type', 'name','phone', 'email', 'subcategory','amend'],
     space: ['profile_id','proposalNumber', 'type', 'name', 'phone','email', 'address', 'description', 'subcategory','amend']
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
    var _tableFields = [];
    var proposalNumber = 0;

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
      _tableFields.push(field);
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
      proposalNumber += 1;
      var _proposal = $.extend(true, {}, proposal);
      if(profile){
        _proposal.name = profile.name;
        _proposal.phone = profile.phone;
        _proposal.email =  profile.email;
        _proposal.profile_id = profile.profile_id;
      }
      _proposal.type = type;
      var _row = $('<tr>');
      if (type == 'artist') _row.attr('id', 'proposalRow-'+proposal.proposal_id);
      if (type == 'space') _row.attr('id', 'proposalRow-'+proposal.profile_id);
      _orfheoFields[type].forEach(function(field){
        if (_form[field] || $.inArray(field, _mandatoryFields[type])>-1){
          var _info = '';
          if(_form[field].info) _info = _form[field].info(_proposal, displayer, proposalNumber);
          else _info = _proposal[field];
          var _col = $('<td>').addClass('column-call-manager-table');
          if (_form[field]['input'] == 'Input') _col.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
          else _col.addClass('column-'+_form[field]['input']);
          _row.append(_col.append(_info));
        }
      });
      var dictionaryCheckBox = {
        false:'No',
        true:'Sí'
      }
      for (var field in _form){
        if ($.isNumeric(field)){
          var _col = $('<td>').addClass('column-call-manager-table');
          if (_form[field]['input'] == 'Input') _col.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
          else _col.addClass('column-'+_form[field]['input']);
          if (proposal[field]){ 
            if(form[field].input == 'CheckBox') _col.append( dictionaryCheckBox[proposal[field]]);
            else if (Array.isArray(proposal[field])) _col.append(proposal[field].join(', '));
            else _col.append(proposal[field]);
          }
          _row.append(_col);
        }
      }

      // var _col = $('<td>')
      //   .addClass('column-call-manager-table column-TextAreaEnriched');
      // if (proposal['amend']) _col.append(proposal['amend']);
      // _row.append(_col);

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
      subcategoryColumn: _subcategoryColumn,
      tableFields: _tableFields
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

    var _orfheoFields = ['profile_id','hiddenType','proposalNumber','type','name', 'subcategory', 'titleAddress', 'phone','email'];

    var _form = {}

    var _subcategoryColumn;
    var _emailColumn;
    var _tableFields = [];
    var proposalNumber = 0;

    _orfheoFields.forEach(function(field, index){
      if(field == 'subcategory') _subcategoryColumn = index; 
      if(field == 'email') _emailColumn = index;
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
      _tableFields.push(field);
    });

    _table.append(_thead.append(_titleRow));
    _table.append(_tfoot.append(_titleRowFoot));
    _table.append(_tbody);

    var proposalRow = function(profileType, proposal, profile){
      proposalNumber += 1;
      var _proposal = $.extend(true, {}, proposal);
      if (profile){
        _proposal.name =  profile.name;
        _proposal.phone = profile.phone;
        _proposal.email =  profile.email;
        _proposal.profile_id =  profile.profile_id;
      }
      _proposal.type = profileType;
      // necesary for proposals conFusion withput form cat
      var _row = $('<tr>');
      if (profileType == 'artist') _row.attr('id', 'proposalRow-'+proposal.proposal_id);
      if (profileType == 'space') _row.attr('id', 'proposalRow-'+proposal.profile_id);
      _orfheoFields.forEach(function(field){
        var _info = '';
        if(_form[field].info) _info = _form[field].info(_proposal, displayer, proposalNumber);
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
      emailColumn: _emailColumn,
      subcategoryColumn: _subcategoryColumn,
      tableFields: _tableFields
    }
  }


  ns.Widgets.InfoTab = {
    amend:{
      info: function(proposal){
        if (proposal.amend) return proposal.amend; 
        else return '';
      },
      label: 'Enmienda',
      input: 'TextAreaEnriched'
    },
    type: {
      info: function(proposal){
        var _dictionary = {
          'artist':'performer',
          'space':'stage'
        }
        if (proposal.own) return Pard.Widgets.IconManager(_dictionary[proposal.type]).render(); 
        else return $('<a>').append(Pard.Widgets.IconManager(_dictionary[proposal.type]).render()).attr({'href':'/profile?id='+proposal.profile_id, 'target':'_blank'});
      },
      label: 'Tipo',
      input: 'type'
    },
    profile_type:{
      info: function(proposal){
        if (proposal.own) return '';
        else return Pard.t.text(proposal.profile_type);
      },
      label: 'Perfil',
      input: 'type'
    },
    name:{ 
      info: function(proposal, displayer) { 
        return $('<a>').attr({'href':'#/'}).append(proposal.name).on('click', function(){
           displayer.displayProposal(proposal, proposal.type);
        });
      },
      label: 'Nombre',
      input:'Inputtext'
    },
    phone:{
      info: function(proposal){
        return proposal.phone.value;
      },
      label: "Teléfono",
      input : "InputTel"
    },
    address:{ 
      info: function(proposal){
        var _address = ' ';
        if (proposal['address']){
          if (proposal['address']['route']) _address +=  proposal['address']['route']+ ' ';
          if (proposal['address']['street_number']) _address += ' '+proposal['address']['street_number']+',  ';
          if (proposal['address']['door']) _address += ', puerta/piso '+proposal['address']['door']+',  ';
          _address += proposal['address']['postal_code']+', '+proposal['address']['locality'];
        }
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
      input : "TextAreaEnriched"
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
    profile_id:{
      info: function(proposal){
        return proposal.own ? proposal.profile_id+'own' : proposal.profile_id+'received'; 
      },
      label:'profile_id',
      input: 'Inputtex'
    },
  proposalNumber:{
    info: function(p, d, proposalNumber){
      return proposalNumber;
    },
    label:'proposalNumber',
    input:'Selector'
  },
  children:{
    info: function(proposal){
      return Pard.Widgets.Dictionary(proposal.children).render();
    },
    label:'Edades público',
    input:'InputChildren'
  }
  }



  ns.Widgets.ProgramTable = function(infoProgram, the_event){

    var _createdWidget = $('<div>');
    var _table = $('<table>').addClass('table-program stripe row-border ').attr({'cellspacing':"0"}).css({
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

    //REMEMBER children ---> publico del espectacúlo

    var _columns = ['cronoOrder','date','time','participant_name','participant_email','participant_subcategory','title','short_description','order','host_name','host_email','host_subcategory','comments','confirmed'];
    var _shownColumns = ['date','time','participant_name','participant_subcategory','title','host_name', 'host_subcategory'];
    var _hiddenColumns = [];
    var _outerTableContainer = $('<div>').css('margin-top','1.85rem');
    var _tableBox = $('<div>').addClass('table-box-call-manager-page');

    _table.append(_thead.append(_titleRow));
    _table.append(_tfoot.append(_titleRowFoot));
    _table.append(_tbody);

    _columns.forEach(function(field, index){
      if ($.inArray(field, _shownColumns) == -1) _hiddenColumns.push(index);
      var _titleCol = $('<th>').addClass('column-call-manager-table column-'+field);
      var _footCol = $('<th>') .addClass('column-call-manager-table column-'+field);
      if (infoProgram[field]) {
        _titleCol.text(infoProgram[field].label);
        _footCol.text(infoProgram[field].label);
      }
      else {
        _titleCol.text(Pard.Widgets.Dictionary(field).render());
        _footCol.text(Pard.Widgets.Dictionary(field).render());
      }
      _titleRow.append(_titleCol);     
      _titleRowFoot.append(_footCol);
    });

     var showRow = function(show){
      var _show = $.extend(true, {}, show);
      var _row = $('<tr>').attr('id', 'programTable-'+show.performance_id);
      _columns.forEach(function(field){
        var _info = '';
        if(infoProgram[field] && infoProgram[field].info) _info = infoProgram[field].info(show);
        else _info = _show[field];
        var _col = $('<td>').addClass('column-call-manager-table');
        _col.addClass('column-'+field);
        _row.append(_col);
        _col.append(_info);
      });

      return _row;
    }
    
    _outerTableContainer.append(_tableBox.append(_table)).css('position','relative');
    _createdWidget.append(_outerTableContainer);

    var _colSelectors = {};

    var _loadSelector = function (colSelector, col) {
      var _colCategry = colSelector.column;
      var _ival = colSelector.select.val();
      colSelector.select = $('<select>').append($('<option>').attr('value','').text(''));
      var _options = [];
      $(_colCategry.header()).empty().text(infoProgram[col].label);
      if (_colCategry.data().unique().length>1){
        var _selectContainer = $('<div>').addClass('select-container-datatableColumn');
        colSelector.select.appendTo(_selectContainer.appendTo($(_colCategry.header())))
          .on( 'change', function () {
            var val = $.fn.dataTable.util.escapeRegex(colSelector.select.val());
            _colCategry.search( val ? '^'+val+'$' : '', true, false ).draw();
          });
        _colCategry.data().unique().each( function ( d, j ) {
            colSelector.select.append( '<option value="'+d+'">'+d+'</option>' );
            _options.push(d);
            if (d == _ival) colSelector.select.val(d);
        } );
        colSelector.select.click(function(e){
          e.stopPropagation();
        });
      }
      colSelector.options = _options;
      colSelector.select.trigger('change');
    }

    var _reloadSelectors = function(){
      Object.keys(_colSelectors).forEach(function(col){
        var _columnData = [];
        _colSelectors[col].column.data().unique().each(function(value){
            typeof value === 'string' ? _columnData.push(value) : false
        });
        if (_columnData.sort().toString() != _colSelectors[col].options.sort().toString()){
          _loadSelector(_colSelectors[col], col);
        }
      })
    }

    for (var id in the_event.program){
      _tbody.append(showRow(the_event.program[id].show))
    }


    var _filtersWidgets = function(colTosearch) {
      var _showCheckbox = $('<input>').attr({ type: 'checkbox', 'value': true})
        .on('change', function(){
          var val = '';
          if (_permanentCheckbox.is(":checked")) _permanentCheckbox.prop("checked", false);
          if(_showCheckbox.is(":checked")) val = 'false';
         colTosearch.search(val).draw(); 
        });
      var _labelShow = $('<label>').html('puntuales').css({'display':'inline', 'cursor':'pointer'})
        .on('click', function(){
          _showCheckbox.prop("checked", !_showCheckbox.prop("checked"));
          _showCheckbox.trigger('change');
        });
      var _permanentCheckbox = $('<input>').attr({ type: 'checkbox', 'value': true})
        .on('change', function(){
          var val = '';
          if(_showCheckbox.is(":checked")) _showCheckbox.prop("checked", false);
          if(_permanentCheckbox.is(':checked')) val = 'true';
          colTosearch.search(val).draw();
        });
      var _labelPermanent = $('<label>').html('permanentes').css({'display':'inline', 'cursor':'pointer'})
        .on('click', function(){
          _permanentCheckbox.prop("checked", !_permanentCheckbox.prop("checked"));
          _permanentCheckbox.trigger('change');
        });
      var _filtersContainer = $('<div>').append(
        $('<span>').append(_showCheckbox, _labelShow), 
        $('<span>').append(_permanentCheckbox, _labelPermanent))
        .addClass('permanetFilters-call-page');
      _outerTableContainer.prepend($('<div>').append(_filtersContainer).css({'position':'relative', 'margin-left':'0.5rem'}));
    }

    var _dataTable = _table.DataTable({
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
      { "visible": false, "targets": _hiddenColumns},
      {'orderable':false, 'targets':[1,2,4,5,7,10,11,13]}
    ],
    "order": [0,'asc'],
    // keys: true,
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'colvis',
        columns: ':gt(0)',
        text: Pard.Widgets.IconManager('visibility').render().attr('title','Muestra/Esconde columnas'),
        className: 'changeColumnsBtn',
        collectionLayout: 'fixed big_layout',
        fade: 200,
        prefixButtons: [{
          extend: 'colvisGroup',
          text: 'Selecciona todo',
          show: ':gt(0):hidden'
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
        text: Pard.Widgets.IconManager('mailinglist').render().attr('title','Crea y copia lista de correos'),
        className: 'mailinglistBtn',
        extend: 'collection',
        collectionLayout: 'button-list',
        autoClose: true,
        fade: 200,
        buttons: [
          {
            text: 'Email artistas',
            action: function(){
              var columnData = _dataTable.column(_columns.indexOf('participant_email'), { search:'applied' }).data().unique();
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
            text: 'Email espacios',
            action: function(){
              var columnData = _dataTable.column(_columns.indexOf('host_email'), { search:'applied' }).data().unique();
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
            text: 'Email artist. y esp.',
            action: function(){
              var columnArtData = _dataTable.column(_columns.indexOf('participant_email'), { search:'applied' }).data().unique();
              var columnEspData = _dataTable.column(_columns.indexOf('host_email'), { search:'applied' }).data().unique();
              var columnData = $.merge(columnArtData, columnEspData).unique();
              var _emailList = '';
              columnData.each(function(email){
                _emailList += email+', ';
              });
              _emailList = _emailList.substring(0,_emailList.length-2)
              Pard.Widgets.CopyToClipboard(_emailList);
              var _copyPopupContent = $('<div>').append($('<div>').html('<strong>Copiados '+columnData.length+' contactos </strong> de correo al portapapeles'), $('<div>').html('(<strong><i>Ctrl+V</i></strong> para pegar)'));
              Pard.Widgets.CopyPopup('Copia correos', _copyPopupContent);
            }
          }
        ]
      },
      {
        extend: 'collection',
        text:  Pard.Widgets.IconManager('export').render().attr('title','Exporta tabla'),
        className: 'ExportCollectionBtn',
        collectionLayout: 'button-list',
        // backgroundClassName: 'ExportCollection-background',
        autoClose: true,
        fade: 200,
        // background: false,
        buttons: [
          {
            extend: 'excel',
            text:'Excel',
            customizeData: function(doc) {
              doc.header.forEach(function(t, i){
                if (t.indexOf('Categoría')>-1) doc.header[i] = 'Categoría'
              });
            },
            exportOptions: {
                columns: ':visible'
            },
            filename: 'Programa'
          },
          {
            extend: 'pdf',
            text:'PDF',
            customize: function(doc) {
              doc.content[1].table.body[0].forEach(function(colTitle){
                if (colTitle.text.indexOf('Categoría')>-1) colTitle.text = 'Categoría';
                else if (colTitle.text.indexOf('Día')>-1) colTitle.text = 'Día';
                colTitle.alignment = 'left';
                colTitle.margin = [2,2,2,2];
              }) 
            },
            exportOptions: {
              columns: ':visible',
            },
            orientation: 'landscape',
            filename: 'Programa'
          },
          {
            extend: 'copy',
            text: 'Copia',
            header: false,
            exportOptions: {
              columns:  ':visible',
            }
          }
        ]
      }
    ],
    initComplete: function () {
      _filtersWidgets(this.api().column(0, { search:'applied' }));
    }
    });

    _colSelectors = {
      confirmed: {
        column: _dataTable.column(_columns.indexOf('confirmed')),
        select: $('<select>').append($('<option>').attr('value','').text('')),
        options: []
      },
      participant_subcategory: {
        column: _dataTable.column(_columns.indexOf('participant_subcategory')),
        select: $('<select>').append($('<option>').attr('value','').text('')),
        options: []
      },
      host_subcategory: {
        column: _dataTable.column(_columns.indexOf('host_subcategory')),
        select: $('<select>').append($('<option>').attr('value','').text('')),
        options: []
      },
      date:{
        column: _dataTable.column(_columns.indexOf('date')),
        select: $('<select>').append($('<option>').attr('value','').text('')),
        options: []
      }
    }

    Object.keys(_colSelectors).forEach(function(col){
      _loadSelector(_colSelectors[col], col);
    });

    var _sortIcon = Pard.Widgets.IconManager('sort').render().addClass('sortIcon');
    var _timeIcon = Pard.Widgets.IconManager('time').render().addClass('timeIcon');
    var _reorderIcon = $('<span>').append(_timeIcon, _sortIcon).addClass('reorderIcon');
    var orderBtn = $('<button>').attr({
      'type':'button',
      'title':'Ordena cronológicamente'
      })
      .append(_reorderIcon)
      .click(function(){
        _dataTable.order([0,'asc']).draw();
      })
    var _orderBtnContainer = $('<div>').addClass('orderBtn-programTable-container').append(orderBtn);
    _outerTableContainer.prepend($('<div>').append(_orderBtnContainer).css('position','relative'));


    Pard.Bus.on('CreatePermanentsTable', function(performances){
      performances.forEach(function(performance){
        var _show = the_event.program[performance.performance_id].show
        _dataTable.row.add(showRow(_show));
      });
      _reloadSelectors();
      _dataTable.order([0,'asc']).draw();
    });

    Pard.Bus.on('ModifyPermanentsTable', function(performances){
      performances.forEach(function(performance){
        var _show = the_event.program[performance.performance_id].show;
        _dataTable.row('#programTable-' + performance.performance_id).remove();
        _dataTable.row.add(showRow(_show));
      })
      _reloadSelectors();
      _dataTable.order([0,'asc']).draw();
    });

    Pard.Bus.on('DestroyPermanentsTable', function(performances){
      performances.forEach(function(performance){
        _dataTable.row('#programTable-' + performance.performance_id).remove();
      });
      _dataTable.order([0,'asc']).draw();
    });

    Pard.Bus.on('orderSpaces', function(){
      _dataTable.clear();
      for (var id in the_event.program){
        _dataTable.row.add(showRow(the_event.program[id].show)); 
      }
      _dataTable.draw();
    });


    return {
      table: _table,
      render: _createdWidget,
      showRow: showRow,
      // loadSelectors: _loadSelectors,
      save: function(show, multipleChanges){
        if (!(multipleChanges)){
          _dataTable.row('#programTable-' + show.performance_id).remove();
          _dataTable.row.add(showRow(show)).order([0,'asc']).draw();
          _reloadSelectors();
        }
      },
      destroy: function(performance_id, multipleChanges){
        if (!(multipleChanges)){
          _dataTable.row('#programTable-' + performance_id).remove().draw();
          _reloadSelectors();
        }
      },
      deleteArtist: function(performancesToDelete){
        performancesToDelete.forEach(function(performance_id){
          _dataTable.row('#programTable-' + performance_id).remove();
        });
        _dataTable.draw(); 
      },
      deleteSpace: function(performancesToDelete){
        performancesToDelete.forEach(function(performance_id){
          _dataTable.row('#programTable-' + performance_id).remove();
        });
        _dataTable.draw();
      },
      modifyArtist:function(performancesToModify){
        performancesToModify.forEach(function(performance_id){
          var _show = the_event.program[performance_id].show;
          _dataTable.row('#programTable-' + performance_id).remove();
          _dataTable.row.add(showRow(_show))
        });
        _dataTable.draw();
      },
      modifySpace: function(performancesToModify){
        performancesToModify.forEach(function(performance_id){
          var _show = the_event.program[performance_id].show;
          _dataTable.row('#programTable-' + performance_id).remove();
          _dataTable.row.add(showRow(_show))
        });
        _dataTable.draw();

      }
    }
  }

  ns.Widgets.ProgramTableInfo = function(the_event, displayer){
    var _cronoOrder = function(show){
      return Object.keys(the_event.eventTime).indexOf(show.date)+show.permanent+show.time[0]+show.time[1];
    } 
    return{
      date: {
        info: function(show){
          return moment(new Date(show['date'])).locale('es').format('DD-MM-YYYY');
        },
        label: 'Día'
      },
      participant_subcategory:{
        label: 'Categoría art.'
      },
      host_subcategory:{
        label: 'Categoría esp.'
      },
      time:{
        info: function(show){
          var start = moment(new Date(show.time[0])).locale('es').format('HH:mm');
          var end = moment(new Date(show.time[1])).locale('es').format('HH:mm');
          return start+'-'+end;
        },
        label:'Horario'
      },
      participant_name:{
        info: function(show){
          return $('<a>').attr('href','#/').text(show.participant_name).click(function(){displayer.displayArtistProgram(show.participant_id)});
        },
        label: 'Artista'
      },
      host_name: {
        info: function(show){
          return $('<a>').attr('href','#/').text(show.host_name).click(function(){displayer.displaySpaceProgram(show.host_id)});
        },
        label:'Espacio'
      },
      order:{
        info: function(show){
          return parseInt(show['order']) + 1;
        },
        label: 'Num. esp.'
      },
      participant_email:{
        label: 'Email artista'
      },
      host_email:{
        label: 'Email espacio'
      },
      cronoOrder:{
        label:'',
        info: function(show){
          return _cronoOrder(show);
        }
      },
      confirmed:{
        label: 'Confirmado',
        info: function(show){
          return  show['confirmed'] == 'true' ? 'Sí' : 'No'
        }
      },
      title: {
        label: 'Título',
        info: function(show){
          var _info = $('<a>').attr('href','#/')
          .text(show['title'])
          .click(function(){
            if (show.permanent == 'true') {
              var artistProgram = the_event.artists[show.participant_id].program;
              var _externalPerformancesBox = $('<div>').css('padding', 0).addClass('noselect');
              var _performancesPopup = Pard.Widgets.Popup();
              _performancesPopup.setContent(show.title +' (' + show.participant_name + ')', _externalPerformancesBox);
              var _content = artistProgram[show.performance_id].permanentManager(true, true);
              _content.setCallback(function(){
                _performancesPopup.close();
                setTimeout(function(){
                  _performancesPopup.destroy();
                },500)
              });
              _externalPerformancesBox.append(_content.render());
              _performancesPopup.open();
            }
            else  {
              var _popupContent = the_event.program[show.performance_id].manager(true);
              var _performancePopup = Pard.Widgets.Popup();
              _popupContent.setCallback(function(){
                _performancePopup.close();
                setTimeout(
                  function(){
                    _performancePopup.destroy();
                  },500)
              });
              _performancePopup.setContent(show.title +' (' + show.participant_name + ')', _popupContent.render())
              _performancePopup.open();
            }
          })
          return _info;
        }
      }
    }
  }

}(Pard || {}));
