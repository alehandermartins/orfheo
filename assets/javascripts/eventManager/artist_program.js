'use strict';
 
(function(ns){

  ns.Widgets = ns.Widgets || {};  

  ns.Widgets.ArtistProgram = function(artist, program, _spaces, _program){
    var _closepopup = {};
    var _createdWidget = $('<div>');

    var _columnsHeaders = ['schedule','title','space','address', 'phone', 'email'];

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
        var _titleCol = $('<th>').text(Pard.t.text('dictionary.' + field).capitalize());
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

          _timeCol.append(moment(performance.date).locale(Pard.Options.language()).format('dddd').toUpperCase());
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

          _timeCol.append(Pard.t.text('dictionary.permanent').capitalize());
          _titleCol.append(moment(performance.date).locale(Pard.Options.language()).format('dddd'));
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
          "zeroRecords": Pard.t.text('manager.zeroRecords'),
          "info": "",
          "infoEmpty": Pard.t.text('manager.infoEmpty'),
          "infoFiltered": "(filtered from _MAX_ total records)",
          "search": Pard.t.text('dictionary.search').capitalize(),
          "search": "_INPUT_",
          "searchPlaceholder": Pard.t.text('dictionary.search').capitalize()
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
          extend: 'collection',
          text:  Pard.Widgets.IconManager('export').render().attr('title',Pard.t.text('manager.export')),
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
                filename: Pard.t.text('dictionary.program') + ' ' + artist.name
              },
              {
                extend: 'pdf',
                exportOptions: {
                    columns: ':visible'
                },
                // download: 'open',
                orientation: 'landscape',
                filename: Pard.t.text('dictionary.program') + ' ' + artist.name,
                title: artist.name,
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
      var _schedule = moment(parseInt(show.time[0])).format('HH:mm') + '-' + moment(parseInt(show.time[1])).format('HH:mm');
      var _titleCol = $('<td>').addClass('column-artist-program-call-manager column-title');
      var _namePopupCaller = $('<a>').attr({'href':'#/'}).text(show.title);
      var _nameCol = $('<td>').addClass('column-artist-program-call-manager column-name');
      var _addressCol = $('<td>').addClass('column-artist-program-call-manager column-address');
      var _phoneCol = $('<td>').addClass('column-artist-program-call-manager column-phone');
      var _emailCol = $('<td>').addClass('column-artist-program-call-manager column-email');

      _timeCol.append(_schedule);
      _titleCol.append(_namePopupCaller);
      _nameCol.html(show.host_name);
      _addressCol.html(show.address.route + ' ' + show.address.street_number);
      _phoneCol.html(_spaces[show.host_id].space.phone.value);
      _emailCol.html(_spaces[show.host_id].space.email);

      _namePopupCaller
        .click(function(){
          if (show.permanent == 'true') {
            var artistProgram = Object.keys(program).map(function(performance_id){
              return program[performance_id].show;
            });
            var _externalPerformancesBox = $('<div>').css('padding', 0).addClass('noselect');
            var _performancesPopup = Pard.Widgets.Popup();
            _performancesPopup.setContent(show.title +' (' + show.participant_name + ')', _externalPerformancesBox);
            var _content = _program[show.performance_id].permanentManager(false, true);
            _content.setCallback(function(){
              _performancesPopup.close();
              _printArtistProgram(artist);
              setTimeout(function(){
                _performancesPopup.destroy();
              },500);
            });
            _externalPerformancesBox.append(_content.render());
            _performancesPopup.setCallback(function(){
              _printArtistProgram(artist);
              setTimeout(function(){
                _performancesPopup.destroy();
              },500);
            });
            _performancesPopup.open();
          }
          else  {
            var _popupContent = _program[show.performance_id].manager(false);
            var _performancePopup = Pard.Widgets.Popup();
            _performancePopup.setCallback(function(){
              _printArtistProgram(artist);
              setTimeout(function(){
                _performancePopup.destroy();
              },500);
            });
            _popupContent.setCallback(function(){
              _performancePopup.close();
              _printArtistProgram(artist);
              setTimeout(
                function(){
                  _performancePopup.destroy();
                },500);
            });
            _performancePopup.setContent(show.title +' (' + show.participant_name + ')', _popupContent.render());
            _performancePopup.open();
          }
        })

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