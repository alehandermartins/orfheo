'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};  

  ns.Widgets.ArtistProgram = function(artist, program, _spaces, _program){
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

    var _infoArtistBox = $('<div>').addClass('info-box-popup-program');
    var _conflictPerformances;

    var _printArtistProgram = function(artist){
      var _rowPosition = 1;
      var _dayRowPos = [];
      var _permanentRowPos = [];
      
      _createdWidget.empty();
      _conflictPerformances = [];
      var myPerformances = Object.keys(program).map(function(performance_id){
        return program[performance_id].show;
      });

      if (myPerformances) myPerformances = Pard.Widgets.ReorderProgramCrono(myPerformances);
      myPerformances.forEach(function(performance, index){
        for(i = myPerformances.indexOf(performance) + 1; i < myPerformances.length; i++){
          if(performance.permanent == 'true'){
            if(myPerformances[i].participant_proposal_id == performance.participant_proposal_id){
              if(myPerformances[i].time[0] < performance.time[1]){
                _conflictPerformances.push(performance);
                _conflictPerformances.push(myPerformances[i]);
              }
            }
          }
          else if(myPerformances[i].participant_proposal_id == performance.participant_proposal_id && myPerformances[i].permanent == 'true'){
            if(myPerformances[i].time[0] < performance.time[1]){
              _conflictPerformances.push(performance);
              _conflictPerformances.push(myPerformances[i]);
            }   
          }
          else if(myPerformances[i].permanent == 'false'){
            if(myPerformances[i].time[0] < performance.time[1]){
              _conflictPerformances.push(performance);
              _conflictPerformances.push(myPerformances[i]);
            }
          }
        }
      });

      var _artistTable = $('<table>').addClass('table_display table-proposal row-border').attr({'cellspacing':"0", 'width':'100%'});
      var _tableBox = $('<div>').addClass('table-space-program');
      var _thead = $('<thead>');
      var _titleRow = $('<tr>');
      var _tfoot = $('<tfoot>');
      var _footRow = $('<tr>');

      _columnsHeaders.forEach(function(field){
        var _titleCol = $('<th>').text(_columnsHeadersDictionary[field]);
        var _footCol = $('<th>');
        if (field == 'email') _footCol.text('Powered by Orfheo');
        else{_footCol.text('');}
        _titleRow.append(_titleCol);
        _footRow.append(_footCol);
      });

      _artistTable.append(_thead.append(_titleRow));
      _artistTable.append(_tfoot.append(_footRow));

      var _tbody = $('<tbody>');
      var lastDate;
      var lastType = 'false';

      myPerformances.forEach(function(performance){
        if(performance.date != lastDate){
          lastType = 'false';
          var _dayRow = $('<tr>').addClass('day-row-program-table-call-manager'); 
          var _timeCol = $('<td>').addClass('column-artist-program-call-manager column-time');
          var _titleCol = $('<td>').addClass('column-artist-program-call-manager column-title');
          var _nameCol = $('<td>').addClass('column-artist-program-call-manager column-name');
          var _addressCol = $('<td>').addClass('column-artist-program-call-manager column-address');
          var _phoneCol = $('<td>').addClass('column-artist-program-call-manager column-phone');
          var _emailCol = $('<td>').addClass('column-artist-program-call-manager column-email');

          _timeCol.append(moment(performance.date).locale('es').format('dddd').toUpperCase());
          _titleCol.append(moment(performance.date).locale('es').format('DD-MM-YYYY'));
          _nameCol.html('');
          _addressCol.html('');
          _phoneCol.html('');
          _emailCol.html('');

          _dayRow.append(_timeCol, _titleCol, _nameCol, _addressCol, _phoneCol, _emailCol);
          _tbody.append(_dayRow);
          _dayRowPos.push(_rowPosition);
          _rowPosition = _rowPosition + 1;
        }

        if(performance.permanent == 'true' && lastType == 'false'){
          lastType = 'true';
          var _permanentRow = $('<tr>').addClass('permanent-row-program-table-call-manager');
          var _timeCol = $('<td>').addClass('column-artist-program-call-manager column-time');
          var _titleCol = $('<td>').addClass('column-artist-program-call-manager column-title');
          var _nameCol = $('<td>').addClass('column-artist-program-call-manager column-name');
          var _addressCol = $('<td>').addClass('column-artist-program-call-manager column-address');
          var _phoneCol = $('<td>').addClass('column-artist-program-call-manager column-phone');
          var _emailCol = $('<td>').addClass('column-artist-program-call-manager column-email');

          _timeCol.append('Permanente');
          _titleCol.append(moment(performance.date).locale('es').format('dddd'));
          _nameCol.html('');
          _addressCol.html('');
          _phoneCol.html('');
          _emailCol.html('');

           _permanentRow.append(_timeCol, _titleCol, _nameCol, _addressCol, _phoneCol, _emailCol);
          _tbody.append(_permanentRow);
          _permanentRowPos.push(_rowPosition);
          _rowPosition = _rowPosition + 1;
        }

        var _row = _printRow(performance);
        _tbody.append(_row);
        lastDate = performance.date;
        _rowPosition = _rowPosition + 1;
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
          filename: 'programa '+ artist.name
        },
        {
          extend: 'pdf',
          exportOptions: {
              columns: ':visible'
          },
          // download: 'open',
          orientation: 'landscape',
          filename: 'programa '+ artist.name,
          title: artist.name + ' - Programación conFusión 2016',
          footer: true,
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
              else if (rowNumber == doc.content[1].table.body.length -1){
                row.forEach(function(cell, index){
                  cell.color = '#000000';
                  cell.fillColor = '#ffffff';
                  cell.margin = [0,15,2,2];
                })
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

    var _printRow = function(show){
      var _row = $('<tr>');
      if($.inArray(show, _conflictPerformances) >= 0){
        _row.css({
          'background': '#FBA4A4'
        });
      }

      var _timeCol = $('<td>').addClass('column-artist-program-call-manager column-time');
      var _schedule = moment(parseInt(show.time[0])).locale("es").format('HH:mm') + '-' + moment(parseInt(show.time[1])).locale("es").format('HH:mm');
      var _titleCol = $('<td>').addClass('column-artist-program-call-manager column-title');
      var _namePopupCaller = $('<a>').attr({'href':'#'}).text(show.title);
      var _nameCol = $('<td>').addClass('column-artist-program-call-manager column-name');
      var _addressCol = $('<td>').addClass('column-artist-program-call-manager column-address');
      var _phoneCol = $('<td>').addClass('column-artist-program-call-manager column-phone');
      var _emailCol = $('<td>').addClass('column-artist-program-call-manager column-email');

      _timeCol.append(_schedule);
      _titleCol.append(_namePopupCaller);
      _nameCol.html(show.host_name);
      _addressCol.html(show.address.route + ' ' + show.address.street_number);
      _phoneCol.html(_spaces[show.host_id].space.phone);
      _emailCol.html(_spaces[show.host_id].space.email);

      _namePopupCaller.on('click', function(){
        var _content = $('<div>').addClass('very-fast reveal full');
        _content.empty();
        $('body').append(_content);
        var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
        var _message = Pard.Widgets.PopupContent(show.title + ' (' + artist.name + ')', _program[show.performance_id].manager('load'));
        _message.setCallback(function(){
          _printArtistProgram(artist, program, _program);
          _content.remove();
          _popup.close();
        });
        _content.append(_message.render());
        _popup.open();
      });

      _row.append(_timeCol, _titleCol, _nameCol, _addressCol, _phoneCol, _emailCol);
      
      return _row;
    }


    _printArtistProgram(artist);

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = function(){
          _createdWidget.remove();
          callback();
        }
      }
    }
  }

}(Pard || {}));