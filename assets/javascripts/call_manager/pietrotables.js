'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.PrintTable = function(type, form, the_event, interactions) {

    var form = $.extend(true, {}, form);
    
    var deletePoposal = {
      artist: interactions.deleteArtist,
      space: interactions.deleteSpace
    }

    var _table = $('<table>').addClass('table-proposal stripe row-border ').attr({'cellspacing':"0"}).css({
      'margin': '0 auto',
      'width': '100%',
      'clear': 'both',
      // 'border-collapse': 'collapse',
      'table-layout': 'fixed',
      'word-wrap':'break-word',
    });


    var _tbody = $('<tbody>');

    var _thead = $('<thead>');
    var _titleRow = $('<tr>');
    var _tfoot = $('<tfoot>');
    var _titleRowFoot = $('<tr>');

    var _orfheoFields = {
      artist: ['rfh','name', 'subcategory', 'title','short_description','description','duration','availability','children','phone','email'],
      space: ['rfh','name', 'subcategory','address', 'description','availability','phone','email']
    }
    var _shownColumns = {
      artist: ['rfh','name', 'title','short_description','duration','availability','phone','email'],
      space: ['rfh','name', 'subcategory','address','availability', 'phone','email']
    }

    var _hiddenColumns = [];

    form.rfh = {
      "label" : "rfh",
      "input" : "rfh"
    }
    form.name = {
      "label" : "Nombre",
      "input" : "Input",
      "args" : [
                "",
                "text"
              ]
    }
    form.email = {
      "label" : "Email",
      "input" : "EmailInput",
    }
    if (!(form.address)) form.address ={
      "label": "Dirección",
      "input" : "InputAddress"
    }
    if (!(form.description)) form.description ={
      "label": "Descripción",
      "input" : "TextArea"
    }
    if (!(form.subcategory)) form.subcategory = {
        "label" : "Categoría en el evento",
        "input" : "Selector",
    }

    var _colPosition = 0;

    var _printTitleAndFoot = function(field){
      var _label = form[field]['label'];
      var _colTitle = $('<th>').text(_label).addClass('column-call-manager-table');
      if (form[field]['input'] == 'Input') _colTitle.addClass('column-'+form[field]['input']+form[field]['args'][1]);
      else _colTitle.addClass('column-'+form[field]['input']);
      _titleRow.append(_colTitle);
      var _colFoot = $('<th>').addClass('column-call-manager-table').text(_label);
      if (form[field]['input'] == 'Input') _colFoot.addClass('column-'+form[field]['input']+form[field]['args'][1]);
      else _colFoot.addClass('column-'+form[field]['input']);
      _titleRowFoot.append(_colFoot);
    }

    _orfheoFields[type].forEach(function(field){
      if (form[field]){
        if ($.inArray(field, _shownColumns[type])<0) _hiddenColumns.push(_colPosition);
        _colPosition += 1;
        _printTitleAndFoot(field);
      }
    });

    for (var field in form){
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
      var _row = $('<tr>');
      var proposal = $.extend(true, {}, proposal);
      
      if (profile) {
        proposal.name = profile.name;
        proposal.phone = profile.phone;
        proposal.email = profile.email;
        proposal.profile_id = profile.profile_id;
        _row.attr('id', 'proposalRow-'+proposal.proposal_id);
      }
      else{
        _row.attr('id', 'proposalRow-'+proposal.profile_id);
      }

      //Needed for conFusion 2016
      if (!(proposal.subcategory)) proposal.subcategory = Pard.Widgets.Dictionary(proposal.category).render();

      _orfheoFields[type].forEach(function(field){
        if (form[field]){
          var _col = $('<td>').addClass('column-call-manager-table');
          if (form[field]['input'] == 'Input') _col.addClass('column-'+form[field]['input']+form[field]['args'][1]);
          else _col.addClass('column-'+form[field]['input']);
          _row.append(_col);
          var _info = '';
          if(field == 'rfh'){
            if (proposal.profile_id.indexOf('own')<0) _info = $('<a>').append(Pard.Widgets.IconManager(type).render()).attr({'href':'/profile?id='+proposal.profile_id, 'target':'_blank'});
            else _info = Pard.Widgets.IconManager(type).render();
          }
          else if (field == 'name'){
            _info = $('<a>').attr({'href':'#'}).text(proposal.name);
            _info.on('click', function(){
              var _popupDisplayed = Pard.Widgets.DisplayPopupProposal(proposal, form, type, the_event.name);
              _popupDisplayed.setDeleteProposalCallback(function(data){
                if (data['status'] == 'success'){
                  deletePoposal[type](proposal.profile_id, proposal.proposal_id);
                }
                else{
                  Pard.Widgets.Alert('',data.reason);
                }
              });
              _popupDisplayed.open();
            });
          }
          else if (field == 'address'){
            _info = $('<a>');
            var _address = ' ';
            if (proposal['address']['route']) _address +=  proposal['address']['route']+ ' ';
            if (proposal['address']['street_number']) _address += ' '+proposal['address']['street_number']+',  ';
            if (proposal['address']['door']) _address += ', puerta/piso '+proposal['address']['door']+',  ';
            _address += proposal['address']['postal_code']+', '+proposal['address']['locality'];
            _info.attr({
              'href':'http://maps.google.com/maps?q='+_address,
              target: '_blank'}).text(_address);
          }
          else if (field=='duration') {
            _info = proposal[field]+' min';
          }
          else if (field=='availability') {
            _info = '';
            proposal[field].forEach(function(day){
              _info += moment(new Date(day)).locale('es').format('DD MMMM, ');
            });
            _info = _info.substring(0, _info.length-2);
          }
          else if (proposal[field]) {
            _info = proposal[field];
          }
          _col.append(_info);
        }
      });

      for (var field in form){
        if ($.isNumeric(field)){
          var _col = $('<td>').addClass('column-call-manager-table');
          if (form[field]['input'] == 'Input') _col.addClass('column-'+form[field]['input']+form[field]['args'][1]);
          else _col.addClass('column-'+form[field]['input']);
          if (proposal[field]) _col.text(proposal[field]);
          _row.append(_col);
        }
      }

      return _row;
    }

    return {
      table: _table,
      addRow: function(proposal, profile){
        _tbody.append(proposalRow(proposal, profile))
      },
      proposalRow: proposalRow,
      hiddenColumns: _hiddenColumns
    }
  }

  ns.Widgets.PrintTableAllProposal = function(forms, the_event, interactions){

    var the_event = Pard.CachedEvent;

    var deletePoposal = {
      artist: interactions.deleteArtist,
      space: interactions.deleteSpace
    }

    var _table = $('<table>').addClass('table-proposal stripe row-border ').attr({'cellspacing':"0"}).css({
      'margin': '0 auto',
      'width': '100%',
      'clear': 'both',
      // 'border-collapse': 'collapse',
      'table-layout': 'fixed',
      'word-wrap':'break-word',
    });
    var _tbody = $('<tbody>');

    var _thead = $('<thead>');
    var _titleRow = $('<tr>');
    var _tfoot = $('<tfoot>');
    var _titleRowFoot = $('<tr>');

    var _orfheoFields = ['rfh','name', 'subcategory', 'title', 'phone','email'];
    var _shownColumns = ['rfh','name', 'title','short_description','phone','email']

    var _hiddenColumns = [];

    var form = {}

    form.rfh = {
      "label" : "rfh",
      "input" : "rfh"
    }
    form.name = {
      "label" : "Nombre",
      "input" : "Input",
      "args" : [
                "",
                "text"
              ]
    }
    form.email = {
      "label" : "Email",
      "input" : "EmailInput",
    }
    form.phone ={
      "label": "Teléfono",
      "input" : "InputTel"
    }
    form.title ={
      "label" : "Titúlo de la propuesta",
      "input" : "Input",
      "args" : [
                "",
                "text"
              ]
    }
    form.subcategory = {
        "label" : "Categoría en el evento",
        "input" : "Selector",
      }

    _orfheoFields.forEach(function(field){
      var _label = form[field]['label'];
      var _colTitle = $('<th>').text(_label).addClass('column-call-manager-table');
      if (form[field]['input'] == 'Input') _colTitle.addClass('column-'+form[field]['input']+form[field]['args'][1]);
      else _colTitle.addClass('column-'+form[field]['input']);
      _titleRow.append(_colTitle);
      var _colFoot = $('<th>').addClass('column-call-manager-table').text(_label);
      if (form[field]['input'] == 'Input') _colFoot.addClass('column-'+form[field]['input']+form[field]['args'][1]);
      else _colFoot.addClass('column-'+form[field]['input']);
      _titleRowFoot.append(_colFoot);
    });

    _table.append(_thead.append(_titleRow));
    _table.append(_tfoot.append(_titleRowFoot));

    _table.append(_tbody);

    var proposalRow = function(profileType, proposal, profile){
      var _row = $('<tr>');
      if (profile) {
        proposal.name = profile.name;
        proposal.phone = profile.phone;
        proposal.email = profile.email;
        proposal.profile_id = profile.profile_id;
        _row.attr('id', 'proposalRow-'+proposal.proposal_id);
      }
      else{
        _row.attr('id', 'proposalRow-'+proposal.profile_id);
      }

      //needed for conFusion 2016
      if (!(proposal.subcategory)) proposal.subcategory = Pard.Widgets.Dictionary(proposal.category).render();

      _orfheoFields.forEach(function(field){

        if (form[field]){
          var _col = $('<td>').addClass('column-call-manager-table');
          if (form[field]['input'] == 'Input') _col.addClass('column-'+form[field]['input']+form[field]['args'][1]);
          else _col.addClass('column-'+form[field]['input']);
          _row.append(_col);
          var _info = '';
          if(field == 'rfh'){
            if (proposal.profile_id.indexOf('own')<0) _info = $('<a>').append(Pard.Widgets.IconManager(profileType).render()).attr({'href':'/profile?id='+proposal.profile_id, 'target':'_blank'});
            else _info = Pard.Widgets.IconManager(profileType).render();
          }
          else if (field == 'name'){
            _info = $('<a>').attr({'href':'#'}).text(proposal.name);
            _info.on('click', function(){
              var _popupDisplayed = Pard.Widgets.DisplayPopupProposal(proposal, forms[profileType][proposal.form_category], profileType, the_event.name);
              _popupDisplayed.setDeleteProposalCallback(function(data){
                if (data['status'] == 'success'){
                  deletePoposal[profileType](proposal.profile_id, proposal.proposal_id);
                }
                else{
                  Pard.Widgets.Alert('',data.reason);
                }
              });
              _popupDisplayed.open();
            });
          }
          else if (proposal[field]) {
            _info = proposal[field];
          }
          _col.append(_info);
        }
      });

      for (var field in form){
        if ($.isNumeric(field)){
          var _col = $('<td>').addClass('column-call-manager-table');
          if (form[field]['input'] == 'Input') _col.addClass('column-'+form[field]['input']+form[field]['args'][1]);
          else _col.addClass('column-'+form[field]['input']);
          if (proposal[field]) _col.text(proposal[field]);
          _row.append(_col);
        }
      }

      return _row;
    }

    return {
      table: _table,
      addRow: function(profileType, proposal, profile){
        _tbody.append(proposalRow(profileType, proposal, profile))
      },
      proposalRow: proposalRow
    }
  }


}(Pard || {}));
