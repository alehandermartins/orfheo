 'use strict';

(function(ns){
  ns.Widgets.SpaceProgramTable = function(space){
    var _closepopup = {};
    var _createdWidget = $('<div>');
    var call = Pard.CachedCall;
    var program = Pard.Widgets.Program;
    var eventTime = call.eventTime;


    var myPerformances = [];
    var myPermanentPerformances = [];
    program.forEach(function(performance){
      if(performance.host_id == space.profile_id) myPerformances.push(performance);
    });

    var _reorderedProgram = [];

    if (myPerformances) _reorderedProgram = Pard.Widgets.ReorderProgram(myPerformances);
  
    var _infoSpace = space.name.toUpperCase() +' - '+space.address.route+' '+space.address.street_number+' - tel.' + space.phone+ ' ('+space.responsible + ') '+' - correo'+ space.email;

    var _spaceTable = $('<table>').addClass('table_display table-proposal stripe row-border').attr({'cellspacing':"0", 'width':"640px"});

    var _tableBox = $('<div>').addClass('table-space-program');

    var _thead = $('<thead>');
    var _titleRow = $('<tr>');
    // .addClass('title-row-table-proposal');

    var _columnsHeaders = ['time','name','category','title','short_description', 'phone', 'email']

    var _columnsHeadersDictionary = {
      time: 'Horario',
      name:'Artista',
      category: 'Categoría',         
      title: 'Titúlo',
      short_description:'Descripción breve',
      phone: 'Teléfono',
      email: 'Email'
    };

    _columnsHeaders.forEach(function(field, colNum){
      var _titleCol = $('<th>').text(_columnsHeadersDictionary[field]);
      var _class = 'column-'+field;
      // _titleCol.addClass('column-call-manager-table');
      // _titleCol.addClass(_class);
      _titleRow.append(_titleCol);
    });

    _spaceTable.append(_thead.append(_titleRow));

    var _tbody = $('<tbody>');

    console.log(new Date().getTime());

    Object.keys(eventTime).forEach(function(day){
      if (day == 'permanent') return false;
      var _day = new Date(day);
      var _dayRow = $('<tr>'); 
      _columnsHeaders.forEach(function(field){
        var _colClass = 'column-'+field;
        var _col = $('<td>').addClass('column-call-manager-table');
        _col.addClass(_colClass);
        if (field == 'time'){
          _col.append(moment(_day).locale('es').format('dddd').toUpperCase());
        }
        else{
          _col.html('');
        }
        _dayRow.append(_col);
      });
      _tbody.append(_dayRow);
        _reorderedProgram.forEach(function(show){
          var _proposal = Pard.Widgets.GetProposal(show.participant_proposal_id);
          var _row = $('<tr>');
          var _startDate = new Date(parseInt(show['time'][0]));
          var _endDate = new Date(parseInt(show['time'][1]));
          if (moment(_startDate).format('MM-DD-YYYY') == moment(_day).format('MM-DD-YYYY')){
          
          _columnsHeaders.forEach(function(field){
            var _colClass = 'column-'+field;
            var _col = $('<td>').addClass('column-call-manager-table');
            _col.addClass(_colClass);
              if (field == 'time'){
                var _schedule = moment(_startDate).locale("es").format('HH:mm') + '-' + moment(_endDate).locale("es").format('HH:mm');
                _col.append(_schedule);
              }
              if (field == 'name'){
                var _namePopupCaller = $('<a>').attr({'href':'#'}).text(_proposal['name']);
                var _popup = Pard.Widgets.PopupCreator(_namePopupCaller, _proposal.title, function(){ return Pard.Widgets.PerformanceProgram(show)});
               _col.append(_popup.render());
    
              }
              
              else  if (_proposal[field] && field == 'category'){
                _col.html(Pard.Widgets.Dictionary(_proposal[field]).render());
              }
              else{
                _col.html(_proposal[field]);
              }
            // else{
            //   _col.html('');
            // }
            _row.append(_col);
            // _cols.push(_col);
          });
    
          _tbody.append(_row);
          // _matrix.push(_cols);
          // _cols = [];}
        }
    });
    });

    _spaceTable.append(_tbody);


    _createdWidget.append(_infoSpace, _tableBox.append(_spaceTable));

  _spaceTable.DataTable({
        rowReorder: false,
    "language":{
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
    aaSorting: [],
    "paging": false,
    "scrollCollapse": true,
    dom: 'Bfrtip',
    "searching": false,
    buttons: [
      {
        extend: 'excel',
        exportOptions: {
            columns: ':visible'
        },
        filename: 'programa '+space.name

      },
      {
        extend: 'pdf',
        exportOptions: {
            columns: ':visible'
        },
        orientation: 'landscape',
        filename: 'programa '+space.name,
        title: _infoSpace,
        message: 'pippo'

      }
    ]

    });




    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }

}(Pard || {}));