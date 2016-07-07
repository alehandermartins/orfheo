 'use strict';

(function(ns){
  ns.Widgets.SpaceProgramTable = function(space){
    var _closepopup = {};
    var _createdWidget = $('<div>');
    var call = Pard.CachedCall;
    var program = Pard.Widgets.Program;
    var eventTime = call.eventTime;

    var _reorderProgram = Pard.Widgets.ReorderProgram(program);

    var myPerformances = [];
    var myPermanentPerformances = {};
    program.forEach(function(performance){
      if(performance.host_id == space.profile_id && performance.permanent == false) myPerformances.push(performance);
      if(performance.host_id == space.profile_id && performance.permanent == true){
        myPermanentPerformances[performance.performance_id] = myPermanentPerformances[performance.performance_id] || [];
        myPermanentPerformances[performance.performance_id].push(performance);
      } 
    });

    var _infoSpace = space.name.toUpperCase() +' - '+space.address.route+' '+space.address.street_number+' - tel.' + space.phone+ ' ('+space.responsible + ') '+' - correo'+ space.email;
    console.log(_infoSpace);

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

    Object.keys(eventTime).forEach(function(day){
      var _day = new Date(day);
      var _dayRow = $('<tr>'); 
      _columnsHeaders.forEach(function(field){
        var _colClass = 'column-'+field;
        var _col = $('<td>').addClass('column-call-manager-table');
        _col.addClass(_colClass);
        if (field == 'time'){
          _col.append(moment(_day).locale('es').format('dddd'));
        }
        else{
          _col.html('');
        }
        _dayRow.append(_col);
      });
      _tbody.append(_dayRow);
        program.forEach(function(show){
          var _proposal = Pard.Widgets.GetProposal(show.participant_proposal_id);
          console.log(show);
          var _row = $('<tr>');
          var _startDate = new Date(parseInt(show['time'][0]));
          var _endDate = new Date(parseInt(show['time'][1]));
          _columnsHeaders.forEach(function(field){
            var _colClass = 'column-'+field;
            var _col = $('<td>').addClass('column-call-manager-table');
            _col.addClass(_colClass);
              if (field == 'time'){
                var _schedule = moment(_startDate).locale("es").format('dddd, HH:mm') + '-' + moment(_endDate).locale("es").format('HH:mm');
                _col.append(_schedule);
              }
              if (field == 'name'){
                var _namePopupCaller = $('<a>').attr({'href':'#'}).text(_proposal['name']);
               _col.append(_namePopupCaller);
    
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
    });
    });

    _spaceTable.append(_tbody);


    _createdWidget.append(_infoSpace, _tableBox.append(_spaceTable));

  _spaceTable.DataTable({
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