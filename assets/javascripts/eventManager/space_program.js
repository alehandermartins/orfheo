 'use strict';

(function(ns){
  ns.Widgets = ns.Widgets || {};  

  ns.Widgets.SpaceProgram = function(space, program, _artists, _program){
    var _closepopup = {};
    var _createdWidget = $('<div>');

    var _columnsHeaders = ['schedule','artist','category','title','short_description', 'phone', 'email']

    var _infoSpace = space.address.route+ ' ' + space.address.street_number + ' - tel. ' + space.phone.value +' - email: '+ space.email;
    var _spaceName = space.name + ' (' + Pard.UserInfo['texts'].subcategories['space'][space.subcategory] + ')';
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
        var _titleCol = $('<th>').text(Pard.t.text('dictionary.' + field).capitalize());
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

          _timeCol.append(moment(performance.date).locale(Pard.Options.language()).format('dddd').toUpperCase());
          _nameCol.append(moment(performance.date).format('DD-MM-YYYY'));
          _titleCol.html('');
          _categoryCol.html('');
          _shortDCol.html('');
          _phoneCol.html('');
          _emailCol.html('');

          _dayRow.append(_timeCol, _nameCol, _categoryCol, _titleCol, _shortDCol, _phoneCol, _emailCol);
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
          _timeCol.append(Pard.t.text('dictionary.permanent').capitalize());
          _nameCol.append(moment(performance.date).locale(Pard.Options.language()).format('dddd'));
          _titleCol.html('');
          _categoryCol.html('');
          _shortDCol.html('');
          _phoneCol.html('');
          _emailCol.html('');

          _permanentRow.append(_timeCol, _nameCol, _categoryCol, _titleCol, _shortDCol, _phoneCol, _emailCol);
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
          text: Pard.Widgets.IconManager('mailinglist').render().attr('title',Pard.t.text('manager.copy.helper')),
          className: 'mailinglistBtn',
          extend: 'collection',
          collectionLayout: 'button-list',
          autoClose: true,
          fade: 200,
          buttons: [
            {
              text: Pard.t.text('manager.copy.artistEmails'),
              action: function(){
                var columnData = Object.keys(program).map(function(performance_id){
                    return program[performance_id].show.participant_email;
                  });
                var _emailList = '';
                columnData = Pard.Widgets.UniqueArray(columnData); 
                columnData.forEach(function(email){
                  _emailList += email+', ';
                });
                _emailList = _emailList.substring(0,_emailList.length-2)
                Pard.Widgets.CopyToClipboard(_emailList);
                var _copyPopupContent = $('<div>').append($('<div>').html(Pard.t.text('manager.copy.mex1', {amount: columnData.length})), $('<div>').html(Pard.t.text('manager.copy.mex2')));
                Pard.Widgets.CopyPopup(Pard.t.text('manager.copy.title'), _copyPopupContent);
              }
            },
            {
              text: Pard.t.text('manager.copy.allEmails'),
              action: function(){
                var columnData = Object.keys(program).map(function(performance_id){
                    return program[performance_id].show.participant_email;
                  });
                columnData = Pard.Widgets.UniqueArray($.merge([space.email],columnData));
                var _emailList = '';
                columnData.forEach(function(email){
                  _emailList += email+', ';
                });
                _emailList = _emailList.substring(0,_emailList.length-2)
                Pard.Widgets.CopyToClipboard(_emailList);
                var _copyPopupContent = $('<div>').append($('<div>').html(Pard.t.text('manager.copy.mex1', {amount: columnData.length})), $('<div>').html(Pard.t.text('manager.copy.mex2')));
                Pard.Widgets.CopyPopup(Pard.t.text('manager.copy.title'), _copyPopupContent);
              }
            }
          ]
        },
        {
          extend: 'collection',
          text:  Pard.Widgets.IconManager('export').render().attr('title', Pard.t.text('manager.export')),
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
              filename: Pard.t.text('dictionary.program') + ' ' + space.name
            },
            {
              extend: 'pdf',
              exportOptions: {
                  columns: ':visible'
              },
              // download: 'open',
              orientation: 'landscape',
              filename: Pard.t.text('dictionary.program') + ' ' + space.name,
              title: _spaceName,
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
        }
      ]
      });
    }

    var _printRow = function(show){
      var _row = $('<tr>');

      var _timeCol = $('<td>').addClass('column-artist-program-call-manager column-time');
      var _schedule = moment(parseInt(show.time[0])).format('HH:mm') + '-' + moment(parseInt(show.time[1])).format('HH:mm');
      var _nameCol = $('<td>').addClass('column-artist-program-call-manager column-name');
      var _categoryCol = $('<td>').addClass('column-artist-program-call-manager column-category');
      var _titleCol = $('<td>').addClass('column-artist-program-call-manager column-title');
      var _namePopupCaller = $('<a>').attr({'href':'#/'}).text(show.title);
      var _shortDCol = $('<td>').addClass('column-artist-program-call-manager column-short_description');
      var _phoneCol = $('<td>').addClass('column-artist-program-call-manager column-phone');
      var _emailCol = $('<td>').addClass('column-artist-program-call-manager column-email');

      _timeCol.append(_schedule);
      _titleCol.append(_namePopupCaller);
      _nameCol.html(show.participant_name);
      _categoryCol.html(Pard.UserInfo['texts'].subcategories['artist'][show.participant_subcategory]);
      _shortDCol.html(show.short_description);
      _phoneCol.html(_artists[show.participant_id].artist.phone.value);
      _emailCol.html(_artists[show.participant_id].artist.email);

      _namePopupCaller.on('click', function(){
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
              _printSpaceProgram(space);
              setTimeout(function(){                
                _performancesPopup.destroy();                
              },500)
            });
            _externalPerformancesBox.append(_content.render());
            _performancesPopup.setCallback(function(){
              _printSpaceProgram(space);
              setTimeout(function(){
                _performancesPopup.destroy();
              },500)
            });
            _performancesPopup.open();
          }
          else  {
            var _popupContent = _program[show.performance_id].manager(false);
            var _performancePopup = Pard.Widgets.Popup();
            _performancePopup.setCallback(function(){
              _printSpaceProgram(space);
              setTimeout(function(){
                _performancePopup.destroy();
              },500)
            });
            _popupContent.setCallback(function(){
              _performancePopup.close();
              _printSpaceProgram(space);
              setTimeout(
                function(){
                  _performancePopup.destroy();
                },500)
            });
            _performancePopup.setContent(show.title +' (' + show.participant_name + ')', _popupContent.render())
            _performancePopup.open();
          }
      });

      _row.append(_timeCol,  _nameCol, _categoryCol, _titleCol,_shortDCol, _phoneCol, _emailCol);
      
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