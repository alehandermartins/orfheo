 'use strict';

(function(ns){

  ns.Widgets.SpaceProgram = function(space, callback){
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

    var _infoSpace = space.address.route+' '+space.address.street_number+' - tel. ' + space.phone+ ' ('+space.responsible + ') '+' - email: '+ space.email;

    var _spaceName = space.name + ' ('+Pard.Widgets.Dictionary(space.category).render()+')';

    var _infoSpaceBox = $('<div>').addClass('info-box-popup-program');

    _infoSpaceBox.append($('<p>').append(_infoSpace));

    var _rowPosition = 1;
    var _dayRowPos = [];
    var _permanentRowPos = [];

    var _printSpaceProgram = function(space){
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
        if(performance.host_id == space.profile_id) myPerformances.push(performance);
      });

      var _reorderedProgram = [];

      if (myPerformances) _reorderedProgram = Pard.Widgets.ReorderProgramCrono(myPerformances);

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

      var _tfoot = $('<tfoot>');
      var _footRow = $('<tr>');

      // .addClass('title-row-table-proposal');

      _columnsHeaders.forEach(function(field, colNum){
        var _titleCol = $('<th>');

        if (field == 'email') _titleCol.text('Powered by Orfheo');
        else _titleCol.text('');
        // _titleCol.addClass('column-space-program-call-manager');
        // _titleCol.addClass(_class);
        _footRow.append(_titleCol);
      });

      _spaceTable.append(_tfoot.append(_footRow));

      

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
          else if(field == 'name'){
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
          else if (field == 'name'){
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

    var _printRow = function(show, startDate, endDate){
      var _row = $('<tr>');
      var proposal = Pard.Widgets.GetProposal(show.participant_proposal_id);
      var cardInfo = {
        performance_id: show.performance_id,
        participant_id: proposal.profile_id,
        participant_proposal_id: proposal.proposal_id,
        title: proposal.title,
        duration: proposal.duration,
        category: proposal.category,
        availability: proposal.availability,
        name: proposal.name,
        date: show.date
      }
      _columnsHeaders.forEach(function(field){
        var _colClass = 'column-'+field;
        var _col = $('<td>').addClass('column-space-program-call-manager');
        _col.addClass(_colClass);
          if (field == 'time'){
            var _schedule = moment(startDate).locale("es").format('HH:mm') + '-' + moment(endDate).locale("es").format('HH:mm');
            _col.append(_schedule);
          }
          if (field == 'title'){
            var _namePopupCaller = $('<a>').attr({'href':'#'}).text(proposal['title']);
            if (show.permanent){
              _namePopupCaller.on('click', function(){
                var _content = $('<div>').addClass('very-fast reveal full');
                _content.empty();
                $('body').append(_content);

                var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
                var _message = Pard.Widgets.PopupContent(proposal.title+' (' + proposal.name + ')', Pard.Widgets.PermanentPerformanceProgram(cardInfo));
                _message.setCallback(function(){
                  _printSpaceProgram(space);
                  _content.remove();
                  _popup.close();
                });
                _content.append(_message.render());
                _popup.open();
              });
            }
            else {
              _namePopupCaller.on('click', function(){
                var _content = $('<div>').addClass('very-fast reveal full');
                _content.empty();
                $('body').append(_content);

                var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
                var _message = Pard.Widgets.PopupContent(proposal.title+' (' + proposal.name + ')', Pard.Widgets.PerformanceProgram(cardInfo));
                _message.setCallback(function(){
                  _printSpaceProgram(space);
                  _content.remove();
                  _popup.close();
                });
                _content.append(_message.render());
                _popup.open();
              });
            }
           _col.append(_namePopupCaller);
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