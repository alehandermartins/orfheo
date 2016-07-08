 'use strict';

(function(ns){
  ns.Widgets.SpaceProgramTable = function(space){
    var _closepopup = {};
    var _createdWidget = $('<div>');

    var _columnsHeaders = ['time','name','category','title','short_description', 'phone', 'email']

    var _columnsHeadersDictionary = {
      time: 'Horario',
      name:'Artista',
      category: 'Categoría',         
      title: 'Título',
      short_description:'Descripción breve',
      phone: 'Teléfono',
      email: 'Email'
    };

  var _printSpaceProgram = function(space){

    _createdWidget.empty();

    var call = Pard.CachedCall;
    var program = Pard.Widgets.Program;
    var eventTime = call.eventTime;

    var myPerformances = [];
    var myPermanentPerformances = [];
    program.forEach(function(performance){
      if(performance.host_id == space.profile_id) myPerformances.push(performance);
    });

    var _reorderedProgram = [];

    if (myPerformances) _reorderedProgram = Pard.Widgets.ReorderProgramCrono(myPerformances);
  
    var _infoSpace = space.name.toUpperCase() +' - '+space.address.route+' '+space.address.street_number+' - tel.' + space.phone+ ' ('+space.responsible + ') '+' - correo'+ space.email;

    var _spaceTable = $('<table>').addClass('table_display table-proposal row-border').attr({'cellspacing':"0", 'width':'100%'});

    var _tableBox = $('<div>').addClass('table-space-program');

    var _thead = $('<thead>');
    var _titleRow = $('<tr>');
    // .addClass('title-row-table-proposal');

    _columnsHeaders.forEach(function(field, colNum){
      var _titleCol = $('<th>').text(_columnsHeadersDictionary[field]);
      var _class = 'column-'+field;
      // _titleCol.addClass('column-space-program-call-manager');
      // _titleCol.addClass(_class);
      _titleRow.append(_titleCol);
    });

    _spaceTable.append(_thead.append(_titleRow));

    var _tbody = $('<tbody>');



    Object.keys(eventTime).forEach(function(day){
      if (day == 'permanent') return false;
      var _day = new Date(day);

      var _dayRow = $('<tr>').addClass('day-row-program-table-call-manager'); 
      _columnsHeaders.forEach(function(field){
        var _colClass = 'column-'+field;
        var _col = $('<td>').addClass('column-space-program-call-manager');
        _col.addClass(_colClass);
        if (field == 'time'){
          _col.append(moment(_day).locale('es').format('dddd').toUpperCase());
        }
        else{
          _col.html('');
        }
        _dayRow.append(_col);
      });

      var _permanentRow = $('<tr>').addClass('permanent-row-program-table-call-manager'); 
      _columnsHeaders.forEach(function(field){
        var _colClass = 'column-'+field;
        var _col = $('<td>').addClass('column-space-program-call-manager');
        _col.addClass(_colClass);
        if (field == 'time'){
          _col.append('Permanente');
        }
        else{
          _col.html('');
        }
        _permanentRow.append(_col);
      });

      var _permanents = [];
      var _check = true;

      _reorderedProgram.forEach(function(show){

        var _startDate = new Date(parseInt(show['time'][0]));
        var _endDate = new Date(parseInt(show['time'][1]));
        if (moment(_startDate).format('MM-DD-YYYY') == moment(_day).format('MM-DD-YYYY')){
          if (_check) {
            _tbody.append(_dayRow);
            _check = false;
          }
          if (show.permanent) _permanents.push([show, _startDate, _endDate]);
          else {
            var _row = _printRow(show,_startDate, _endDate);              
            _tbody.append(_row);
          }
        }
      });
      if (_permanents.length) {
        _tbody.append(_permanentRow);
        _permanents.forEach(function(expo){
          var _row = _printRow(expo[0],expo[1], expo[2]);
          _tbody.append(_row);
        })
      }
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
      "bSort": false,
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

    }

    var _printRow = function(show, startDate, endDate){
      var _row = $('<tr>');
      var proposal = Pard.Widgets.GetProposal(show.participant_proposal_id);
      _columnsHeaders.forEach(function(field){
        var _colClass = 'column-'+field;
        var _col = $('<td>').addClass('column-space-program-call-manager');
        _col.addClass(_colClass);
          if (field == 'time'){
            var _schedule = moment(startDate).locale("es").format('HH:mm') + '-' + moment(endDate).locale("es").format('HH:mm');
            _col.append(_schedule);
          }
          if (field == 'name'){
            var _namePopupCaller = $('<a>').attr({'href':'#'}).text(proposal['name']);
            var _popup = Pard.Widgets.PopupCreator(_namePopupCaller, proposal.title, function(){ return Pard.Widgets.PerformanceProgram(show)},'', function(){_printSpaceProgram(space)});
           _col.append(_popup.render());

          }
          
          else  if (proposal[field] && field == 'category'){
            _col.html(Pard.Widgets.Dictionary(proposal[field]).render());
          }
          else{
            _col.html(proposal[field]);
          }
        _row.append(_col);
      });
      return _row;
    }


    _printSpaceProgram(space);

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