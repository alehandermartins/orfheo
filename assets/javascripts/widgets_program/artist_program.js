'use strict';

(function(ns){

  ns.Widgets.ArtistProgram = function(artist){
    console.log(artist);
    var _closepopup = {};
    var _createdWidget = $('<div>');

    var _columnsHeaders = ['time','title','name','address', 'phone', 'email']

    var _columnsHeadersDictionary = {
      time: 'Horario',
      title: 'Título',
      name:'Espacio',
      address:'Dirección',
      phone: 'Teléfono',
      email: 'Email'
    };

    // var _infoSpace = space.address.route+' '+space.address.street_number+' - tel. ' + space.phone+ ' ('+space.responsible + ') '+' - email: '+ space.email;

    var _artistName = artist.name;

    var _infoArtistBox = $('<div>').addClass('info-box-popup-program');

    // _infoArtistBox.append($('<p>').append(_infoSpace));

    var _rowPosition = 1;
    var _dayRowPos = [];
    var _permanentRowPos = [];

    console.log(Pard.Widgets.Program);

    var _printArtistProgram = function(artist){
      _rowPosition = 1;
      _dayRowPos = [];
      _permanentRowPos = [];

      _createdWidget.empty();

      var call = Pard.CachedCall;
      var program = Pard.Widgets.Program;
      var eventTime = call.eventTime;

      var myPerformances = [];
      var myPermanentPerformances = [];
      program.forEach(function(performance){
        if(performance.participant_id == artist.profile_id) myPerformances.push(performance);
      });

      var _reorderedProgram = [];

      if (myPerformances) _reorderedProgram = Pard.Widgets.ReorderProgramCrono(myPerformances);

      var _artistTable = $('<table>').addClass('table_display table-proposal row-border').attr({'cellspacing':"0", 'width':'100%'});

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

      _artistTable.append(_thead.append(_titleRow));

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
          else if(field == 'title'){
            _col.append(moment(_day).locale('es').format('DD-MM-YYYY'));
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
          else if (field == 'title'){
            _col.append(moment(new Date(day)).locale('es').format('dddd'));
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
              _dayRowPos.push(_rowPosition);
              _rowPosition = _rowPosition + 1;
              _check = false;
            }
            if (show.permanent) _permanents.push([show, _startDate, _endDate]);
            else {
              var _row = _printRow(show,_startDate, _endDate);              
              _tbody.append(_row);
              _rowPosition = _rowPosition + 1;
            }
          }
        });
        if (_permanents.length) {
          _tbody.append(_permanentRow);
          _permanentRowPos.push(_rowPosition);
          _rowPosition = _rowPosition + 1;
          _permanents.forEach(function(expo){
            var _row = _printRow(expo[0],expo[1], expo[2]);
            _tbody.append(_row);
            _rowPosition = _rowPosition + 1;

          })
        }
      });

      _artistTable.append(_tbody);
      _artistTable.addClass('program-table-popup');
      _createdWidget.append(_infoArtistBox, _tableBox.append(_artistTable));

      _artistTable.DataTable({
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
          filename: 'programa '+artist.name
        },
        {
          extend: 'pdf',
          exportOptions: {
              columns: ':visible'
          },
          // download: 'open',
          orientation: 'landscape',
          filename: 'programa '+artist.name,
          title: _artistName + ' - Programación conFusión 2016',
          customize: function ( doc ) {
            doc.content.forEach(function(content) {
            if (content.style == 'title'){
              content.fontSize = 16;
              content.alignment= 'left';
            }
            });
            doc.content[1].layout= 'lightHorizontalLines';
            doc.content[1].table.widths = [ '10%', '20%', '18%', '25%','10%','18%'];
            doc.content[1].table.body.forEach(function(row, rowNumber){
              if (rowNumber == 0) {
                row.forEach(function(cell, index){
                  cell.alignment = 'left';
                  cell.bold = true;
                  cell.fillColor = '#ffffff';
                  cell.color = '#000000';
                  cell.margin = [2,2,2,2];
                });
              }  
              else if ($.inArray (rowNumber, _dayRowPos) >-1){ row.forEach(function(cell, index){
                  cell.fillColor = '#6f6f6f';
                  cell.color = '#ffffff';
                  cell.fontSize = 11;
                  cell.bold = true;
                  if (index == 0) cell.margin = [4,2,2,2];
                  else cell.margin = [2,2,2,2];
                });
              }
              else if($.inArray (rowNumber, _permanentRowPos) >-1){ 
                row.forEach(function(cell, index){
                  cell.fillColor = '#dedede';
                  cell.bold = true;
                  cell.bold = true;
                  if (index == 0) cell.margin = [4,2,2,2];
                  else cell.margin = [2,2,2,2];
                });
              }
              else{
                row.forEach(function(cell, index){
                  cell.fillColor = '#ffffff';
                  cell.margin = [2,4,2,4];
                  // cell.cellBorder = '1px solid red';
                });
              }
            });
          }  
        }
        ]
      });
    }

    var _printRow = function(show, startDate, endDate){
      var _row = $('<tr>');
      var spaceProposal = Pard.Widgets.GetProposal(show.host_proposal_id);
      var artistProposal = Pard.Widgets.GetProposal(show.participant_proposal_id);
      _columnsHeaders.forEach(function(field){
        var _colClass = 'column-'+field;
        var _col = $('<td>').addClass('column-artist-program-call-manager');
        _col.addClass(_colClass);
          if (field == 'time'){
            var _schedule = moment(startDate).locale("es").format('HH:mm') + '-' + moment(endDate).locale("es").format('HH:mm');
            _col.append(_schedule);
          }
          if (field == 'title'){
            var _namePopupCaller = $('<a>').attr({'href':'#'}).text(artistProposal['title']);
            if (show.permanent) var _popup = Pard.Widgets.PopupCreator(_namePopupCaller, artistProposal.title, function(){ return Pard.Widgets.PermanentPerformanceProgram(show)},'', function(){_printArtistProgram(artist)});
            else  var _popup = Pard.Widgets.PopupCreator(_namePopupCaller, artistProposal.title, function(){ return Pard.Widgets.PerformanceProgram(show)},'', function(){_printArtistProgram(artist)});
           _col.append(_popup.render());

          }
          
          else  if (field == 'address'){
            _col.html(spaceProposal.address.route+' '+spaceProposal.address.street_number);
          }
          else{
            _col.html(spaceProposal[field]);
          }
        _row.append(_col);
      });
      return _row;
    }


    _printArtistProgram(artist);

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