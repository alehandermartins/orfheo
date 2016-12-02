 'use strict';

(function(ns){
  ns.Widgets = ns.Widgets || {};  

  ns.Widgets.SpaceProgram = function(space, program, _artists, _program){
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

    var _infoSpace = space.address.route+ ' ' + space.address.street_number + ' - tel. ' + space.phone + ' (' + space.responsible + ') '+' - email: '+ space.email;
    var _spaceName = space.name + ' (' + Pard.Widgets.Dictionary(space.category).render() + ')';
    var _infoSpaceBox = $('<div>').addClass('info-box-popup-program');
    _infoSpaceBox.append($('<p>').append(_infoSpace));

    var _printSpaceProgram = function(space){
      var _rowPosition = 1;
      var _dayRowPos = [];
      var _permanentRowPos = [];
      _createdWidget.empty();

      var myPerformances = Object.keys(program).map(function(performance_id){
        return program[performance_id].show;
      });

      if (myPerformances) myPerformances = Pard.Widgets.ReorderProgramCrono(myPerformances);

      var _spaceTable = $('<table>').addClass('table_display table-proposal row-border').attr({'cellspacing':"0", 'width':'100%'});
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

      _spaceTable.append(_thead.append(_titleRow));
      _spaceTable.append(_tfoot.append(_footRow));

      var _tbody = $('<tbody>');
      var lastDate;
      var lastType = 'false';

      myPerformances.forEach(function(performance){
        if(performance.date != lastDate){
          lastType = 'false';
          var _dayRow = $('<tr>').addClass('day-row-program-table-call-manager'); 
          var _timeCol = $('<td>').addClass('column-artist-program-call-manager column-time');
          var _nameCol = $('<td>').addClass('column-artist-program-call-manager column-name');
          var _categoryCol = $('<td>').addClass('column-artist-program-call-manager column-category');
          var _titleCol = $('<td>').addClass('column-artist-program-call-manager column-title');
          var _shortDCol = $('<td>').addClass('column-artist-program-call-manager column-short_description');
          var _phoneCol = $('<td>').addClass('column-artist-program-call-manager column-phone');
          var _emailCol = $('<td>').addClass('column-artist-program-call-manager column-email');

          _timeCol.append(moment(performance.date).locale('es').format('dddd').toUpperCase());
          _titleCol.append(moment(performance.date).locale('es').format('DD-MM-YYYY'));
          _nameCol.html('');
          _categoryCol.html('');
          _shortDCol.html('');
          _phoneCol.html('');
          _emailCol.html('');

          _dayRow.append(_timeCol, _titleCol, _nameCol, _categoryCol, _shortDCol, _phoneCol, _emailCol);
          _tbody.append(_dayRow);
          _dayRowPos.push(_rowPosition);
          _rowPosition = _rowPosition + 1;
        }

        if(performance.permanent == 'true' && lastType == 'false'){
          lastType = 'true';
          var _permanentRow = $('<tr>').addClass('permanent-row-program-table-call-manager');
          var _timeCol = $('<td>').addClass('column-artist-program-call-manager column-time');
          var _nameCol = $('<td>').addClass('column-artist-program-call-manager column-name');
          var _categoryCol = $('<td>').addClass('column-artist-program-call-manager column-category');
          var _titleCol = $('<td>').addClass('column-artist-program-call-manager column-title');
          var _shortDCol = $('<td>').addClass('column-artist-program-call-manager column-short_description');
          var _phoneCol = $('<td>').addClass('column-artist-program-call-manager column-phone');
          var _emailCol = $('<td>').addClass('column-artist-program-call-manager column-email');
          _timeCol.append('Permanente');
          _titleCol.append(moment(performance.date).locale('es').format('dddd'));
          _nameCol.html('');
          _categoryCol.html('');
          _shortDCol.html('');
          _phoneCol.html('');
          _emailCol.html('');

          _permanentRow.append(_timeCol, _titleCol, _nameCol, _categoryCol, _shortDCol, _phoneCol, _emailCol);
          _tbody.append(_permanentRow);
          _permanentRowPos.push(_rowPosition);
          _rowPosition = _rowPosition + 1;
        }

        var _row = _printRow(performance);
        _tbody.append(_row);
        lastDate = performance.date;
        _rowPosition = _rowPosition + 1;
      });

      _spaceTable.append(_tbody);
      _spaceTable.addClass('program-table-popup');
      _createdWidget.append(_infoSpaceBox, _tableBox.append(_spaceTable));

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
          // download: 'open',
          orientation: 'landscape',
          filename: 'programa '+space.name,
          title: _spaceName + ' - Programación conFusión 2016',
          message: '__MESSAGE__',
          footer: true,
          customize: function ( doc ) {
            // doc.styles['table-row'] = {
            //   'font-size': '16px',
            //   'padding': '4px',
            //   'border-top': '1px solid #dedede'
            // }
            doc.content.forEach(function(content) {
            if (content.style == 'message') {
              content.text = _infoSpace;
              content.fontSize = 14;
              content.margin = [0, 0, 0, 20];
            }
            if (content.style == 'title'){
              content.fontSize = 16;
              content.alignment= 'left';
            }
            });
            doc.content[2].layout= 'lightHorizontalLines';
            doc.content[2].table.widths = [ '9%', '15%', '10%', '16%', '25%','10%','15%'];
            doc.content[2].table.body.forEach(function(row, rowNumber){
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
              else if (rowNumber == doc.content[2].table.body.length -1){
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

      var _timeCol = $('<td>').addClass('column-artist-program-call-manager column-time');
      var _schedule = moment(parseInt(show.time[0])).locale("es").format('HH:mm') + '-' + moment(parseInt(show.time[1])).locale("es").format('HH:mm');
      var _nameCol = $('<td>').addClass('column-artist-program-call-manager column-name');
      var _categoryCol = $('<td>').addClass('column-artist-program-call-manager column-category');
      var _titleCol = $('<td>').addClass('column-artist-program-call-manager column-title');
      var _namePopupCaller = $('<a>').attr({'href':'#'}).text(show.title);
      var _shortDCol = $('<td>').addClass('column-artist-program-call-manager column-short_description');
      var _phoneCol = $('<td>').addClass('column-artist-program-call-manager column-phone');
      var _emailCol = $('<td>').addClass('column-artist-program-call-manager column-email');

      _timeCol.append(_schedule);
      _titleCol.append(_namePopupCaller);
      _nameCol.html(show.participant_name);
      _categoryCol.html(Pard.Widgets.Dictionary(show.participant_category).render());
      _shortDCol.html(show.short_description);
      _phoneCol.html(_artists[show.participant_id].artist.phone);
      _emailCol.html(_artists[show.participant_id].artist.email);

      _namePopupCaller.on('click', function(){
        var _content = $('<div>').addClass('very-fast reveal full');
        _content.empty();
        $('body').append(_content);
        var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
        var _message = Pard.Widgets.PopupContent(show.title + ' (' + show.participant_name + ')', _program[show.performance_id].performanceManager());
        _message.setCallback(function(){
          _printSpaceProgram(space, program, _program);
          _content.remove();
          _popup.close();
        });
        _content.append(_message.render());
        _popup.open();
      });

      _row.append(_timeCol, _titleCol, _nameCol, _categoryCol, _shortDCol, _phoneCol, _emailCol);
      
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