'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.PrintTable = function(type, form, displayer) {

    var _form = $.extend(true, {}, form);

    var _table = $('<table>').addClass('table-proposal stripe row-border ').attr({'cellspacing':"0"}).css({
      'margin': '0 auto',
      'width': '100%',
      'clear': 'both',
      'table-layout': 'fixed',
      'word-wrap':'break-word',
    });

    var _tbody = $('<tbody>');

    var _thead = $('<thead>');
    var _titleRow = $('<tr>');
    var _tfoot = $('<tfoot>');
    var _titleRowFoot = $('<tr>');
    // All non numeric field used by orfheo --> vector needed for ordering
    var _orfheoFields = {
      artist: ['type','name', 'subcategory', 'title','short_description','description','duration','availability','children','phone','email'],
      space: ['type','name', 'subcategory','address', 'description','availability','phone','email']
    }
    //Mandatory fields that are not asked in forms
    var _mandatoryFields = {
     artist: ['type', 'name', 'email', 'subcategory'],
     space: ['type', 'name', 'email', 'address', 'description', 'subcategory']
    }
    // The columns I want to see in table as default
    var _shownColumns = {
      artist: ['type','name', 'title','short_description','duration','availability','phone','email'],
      space: ['type','name', 'subcategory','address','availability', 'phone','email']
    }

    var _colPosition = 0;
    var _hiddenColumns = [];
    var _emailColumn;
    var _subcategoryColumn;
    // var _proposalsNumber = 0;

    var _printTitleAndFoot = function(field){
      _form[field] = Pard.Widgets.InfoTab[field] || _form[field];
      var _label = _form[field]['label'];
      var _colTitle = $('<th>').append(_label).addClass('column-call-manager-table');
      if (_form[field]['input'] == 'Input') _colTitle.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
      else _colTitle.addClass('column-'+_form[field]['input']);
      _titleRow.append(_colTitle);
      var _colFoot = $('<th>').addClass('column-call-manager-table').append(_label);
      if (_form[field]['input'] == 'Input') _colFoot.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
      else _colFoot.addClass('column-'+_form[field]['input']);
      _titleRowFoot.append(_colFoot);
    }

    _orfheoFields[type].forEach(function(field, index){
      if (_form[field] || $.inArray(field, _mandatoryFields[type])>-1){
        if ($.inArray(field, _shownColumns[type])<0) _hiddenColumns.push(_colPosition);
        _colPosition += 1;
        if (field == 'email') _emailColumn = index;
        if (field == 'subcategory') _subcategoryColumn = index;
        _printTitleAndFoot(field);
      }
    });

    for (var field in _form){
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
      // _proposalsNumber += 1;
      var _proposal = $.extend(true, {}, proposal);
      _proposal.name = _proposal.name || profile.name;
      _proposal.phone = _proposal.phone || profile.phone;
      _proposal.email = _proposal.email || profile.email;
      _proposal.profile_id = _proposal.profile_id || profile.profile_id;
      _proposal.type = type;
      var _row = $('<tr>');
      if (type == 'artist') _row.attr('id', 'proposalRow-'+proposal.proposal_id);
      if (type == 'space') _row.attr('id', 'proposalRow-'+proposal.profile_id);
      _orfheoFields[type].forEach(function(field){
        if (_form[field] || $.inArray(field, _mandatoryFields[type])>-1){
          var _info = '';
          if(_form[field].info) _info = _form[field].info(_proposal, displayer);
          else _info = _proposal[field];
          var _col = $('<td>').addClass('column-call-manager-table');
          if (_form[field]['input'] == 'Input') _col.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
          else _col.addClass('column-'+_form[field]['input']);
          _row.append(_col.append(_info));
        }
      });

      for (var field in _form){
        if ($.isNumeric(field)){
          var _col = $('<td>').addClass('column-call-manager-table');
          if (_form[field]['input'] == 'Input') _col.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
          else _col.addClass('column-'+_form[field]['input']);
          if (proposal[field]) _col.append(proposal[field]);
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
      hiddenColumns: _hiddenColumns,
      emailColumn: _emailColumn,
      subcategoryColumn: _subcategoryColumn
    }
  }



  ns.Widgets.PrintTableAllProposal = function(displayer){

    var _table = $('<table>').addClass('table-proposal stripe row-border ').attr({'cellspacing':"0"}).css({
      'margin': '0 auto',
      'width': '100%',
      'clear': 'both',
      'table-layout': 'fixed',
      'word-wrap':'break-word',
    });
    var _tbody = $('<tbody>');

    var _thead = $('<thead>');
    var _titleRow = $('<tr>');
    var _tfoot = $('<tfoot>');
    var _titleRowFoot = $('<tr>');

    var _orfheoFields = ['type','name', 'subcategory', 'titleAddress', 'phone','email', 'hiddenType'];

    var _form = {}

    _form.phone ={
      "label": "Teléfono",
      "input" : "InputTel"
    }

    _orfheoFields.forEach(function(field){
      _form[field] = Pard.Widgets.InfoTab[field] || _form[field];
      var _label = _form[field]['label'];
      var _colTitle = $('<th>').append(_label).addClass('column-call-manager-table');
      if (_form[field]['input'] == 'Input') _colTitle.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
      else _colTitle.addClass('column-'+_form[field]['input']);
      _titleRow.append(_colTitle);
      var _colFoot = $('<th>').addClass('column-call-manager-table').append(_label);
      if (_form[field]['input'] == 'Input') _colFoot.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
      else _colFoot.addClass('column-'+_form[field]['input']);
      _titleRowFoot.append(_colFoot);
    });

    _table.append(_thead.append(_titleRow));
    _table.append(_tfoot.append(_titleRowFoot));

    _table.append(_tbody);

    var proposalRow = function(profileType, proposal, profile){
      var _proposal = $.extend(true, {}, proposal);
      _proposal.name = _proposal.name || profile.name;
      _proposal.phone = _proposal.phone || profile.phone;
      _proposal.email = _proposal.email || profile.email;
      _proposal.profile_id = _proposal.profile_id || profile.profile_id;
      _proposal.type = profileType;
      // necesary for proposals conFusion withput form cat
      var _row = $('<tr>');
      if (profileType == 'artist') _row.attr('id', 'proposalRow-'+proposal.proposal_id);
      if (profileType == 'space') _row.attr('id', 'proposalRow-'+proposal.profile_id);
      _orfheoFields.forEach(function(field){
        var _info = '';
        if(_form[field].info) _info = _form[field].info(_proposal, displayer);
        else _info = _proposal[field];
        var _col = $('<td>').addClass('column-call-manager-table');
        if (_form[field]['input'] == 'Input') _col.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
        else _col.addClass('column-'+_form[field]['input']);
        _row.append(_col);
        _col.append(_info);
      });

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



  ns.Widgets.InfoTab = {
    type: {
      info: function(proposal){
        if (proposal.profile_id.indexOf('own')<0) return  $('<a>').append(Pard.Widgets.IconManager(proposal.type).render()).attr({'href':'/profile?id='+proposal.profile_id, 'target':'_blank'});
        else return Pard.Widgets.IconManager(proposal.type).render();
      },
      label: 'rfh',
      input: 'type'
    },
    name:{ 
      info: function(proposal, displayer) { 
        return $('<a>').attr({'href':'#'}).append(proposal.name).on('click', function(){
           displayer.displayProposal(proposal, proposal.type);
        });
      },
      label: 'Nombre',
      input:'Inputtext'
    },
    address:{ 
      info: function(proposal){
        var _address = ' ';
        if (proposal['address']['route']) _address +=  proposal['address']['route']+ ' ';
        if (proposal['address']['street_number']) _address += ' '+proposal['address']['street_number']+',  ';
        if (proposal['address']['door']) _address += ', puerta/piso '+proposal['address']['door']+',  ';
        _address += proposal['address']['postal_code']+', '+proposal['address']['locality'];
        return $('<a>').attr({
          'href':'http://maps.google.com/maps?q='+_address,
          target: '_blank'}).append(_address);
      },
      label: 'Dirección',
      input: 'InputAddress'
    },
    duration: {
      info: function(proposal){
        return proposal['duration']+' min';
      },
      label: 'Duración',
      input: 'Selector'
    },
    availability:{  
      info: function(proposal) {
        var _info = '';
        proposal['availability'].forEach(function(day){
          _info += moment(new Date(day)).locale('es').format('DD MMMM, ');
        });
        return _info.substring(0, _info.length-2);
      },
      label: 'Disponibilidad',
      input: 'MultipleDaysSelector'
    },
    email: {
      label : "Email",
      input : "EmailInput",
    },
    description : {
      label: "Descripción",
      input : "TextArea"
    },
    subcategory : {
      label : "Categoría en el evento",
      input : "Selector"
    },
    titleAddress:{
      info: function(proposal, displayer){
        if (proposal.title) return proposal['title'];
        else if (proposal.address) return Pard.Widgets.InfoTab['address'].info(proposal, displayer);
      },
      label : "Titúlo / Dirección",
      input : "Inputtext"
    },
    hiddenType:{
      info: function(proposal, displayer){
        var types = {
          artist: 'Artistas',
          space: 'Espacios',
          organization: 'Organizaciones'
        }
        return types[proposal.type];
      },
      label:'hiddenType',
      input: 'hiddenType'
    }
  }


}(Pard || {}));
