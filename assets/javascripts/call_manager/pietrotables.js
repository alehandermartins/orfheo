'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.PrintTable = function(type, form, the_event) {

    var _form = $.extend(true, {}, form);
    var deletePoposal = {
      artist: function(artist){Pard.Bus.trigger('deleteArtist', artist)},
      space: function(space){Pard.Bus.trigger('deleteSpace', space)}
    }

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

    var _orfheoFields = {
      artist: ['rfh','name', 'subcategory', 'title','short_description','description','duration','availability','children','phone','email'],
      space: ['rfh','name', 'subcategory','address', 'description','availability','phone','email']
    }
    var _shownColumns = {
      artist: ['rfh','name', 'title','short_description','duration','availability','phone','email'],
      space: ['rfh','name', 'subcategory','address','availability', 'phone','email']
    }

    var _hiddenColumns = [];
    var _additionalMandatoryField = {
     artist: ['rfh', 'name', 'email', 'subcategory'],
     space: ['rfh', 'name', 'email', 'address', 'description', 'subcategory']
    }

    var _colPosition = 0;

    var _printTitleAndFoot = function(field){
      _form[field] = Pard.Widgets.InfoTab[field] || _form[field];
      var _label = _form[field]['label'];
      var _colTitle = $('<th>').text(_label).addClass('column-call-manager-table');
      if (_form[field]['input'] == 'Input') _colTitle.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
      else _colTitle.addClass('column-'+_form[field]['input']);
      _titleRow.append(_colTitle);
      var _colFoot = $('<th>').addClass('column-call-manager-table').text(_label);
      if (_form[field]['input'] == 'Input') _colFoot.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
      else _colFoot.addClass('column-'+_form[field]['input']);
      _titleRowFoot.append(_colFoot);
    }

    _orfheoFields[type].forEach(function(field){
      if (_form[field] || $.inArray(field, _additionalMandatoryField[type])>-1){
        if ($.inArray(field, _shownColumns[type])<0) _hiddenColumns.push(_colPosition);
        _colPosition += 1;
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
      var _row = $('<tr>');
      var proposal = $.extend(true, {}, proposal);
      proposal.name = proposal.name || profile.name;
      proposal.phone = proposal.phone || profile.phone;
      proposal.email = proposal.email || profile.email;
      proposal.profile_id = proposal.profile_id || profile.profile_id;
      proposal.rfh = type;
      _row.attr('id', 'proposalRow-'+proposal.proposal_id);
      //Needed for conFusion 2016
      proposal.subcategory = proposal.subcategory || Pard.Widgets.Dictionary(proposal.category).render();

      _orfheoFields[type].forEach(function(field){
        if (_form[field] || $.inArray(field, _additionalMandatoryField[type])>-1){
          if(_form[field].info) proposal[field] = _form[field].info(proposal, form, the_event);
          var _col = $('<td>').addClass('column-call-manager-table');
          if (_form[field]['input'] == 'Input') _col.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
          else _col.addClass('column-'+_form[field]['input']);
          _row.append(_col);
          _col.append(proposal[field]);
        }
      });

      for (var field in _form){
        if ($.isNumeric(field)){
          var _col = $('<td>').addClass('column-call-manager-table');
          if (_form[field]['input'] == 'Input') _col.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
          else _col.addClass('column-'+_form[field]['input']);
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


  ns.Widgets.InfoTab = {
    rfh: {
      info: function(proposal, form, the_event){
        if (proposal.profile_id.indexOf('own')<0) return  $('<a>').append(Pard.Widgets.IconManager(proposal.rfh).render()).attr({'href':'/profile?id='+proposal.profile_id, 'target':'_blank'});
        else return Pard.Widgets.IconManager(proposal.rfh).render();
      },
      label: 'rfh',
      input: 'rfh'
    },
    name:{ 
      info: function(proposal, form, the_event) { 
        return $('<a>').attr({'href':'#'}).text(proposal.name).on('click', function(){
          var _popupDisplayed = Pard.Widgets.DisplayPopupProposal(proposal, form, proposal.rfh, the_event['name'], the_event['event_id'], the_event['call_id']);
          _popupDisplayed.open();
        });
      },
      label: 'Nombre',
      input:'Inputtext'
    },
    address:{ 
      info: function(proposal, form, the_event){
        var _address = ' ';
        if (proposal['address']['route']) _address +=  proposal['address']['route']+ ' ';
        if (proposal['address']['street_number']) _address += ' '+proposal['address']['street_number']+',  ';
        if (proposal['address']['door']) _address += ', puerta/piso '+proposal['address']['door']+',  ';
        _address += proposal['address']['postal_code']+', '+proposal['address']['locality'];
        return $('<a>').attr({
          'href':'http://maps.google.com/maps?q='+_address,
          target: '_blank'}).text(_address);
      },
      label: 'Dirección',
      input: 'InputAddress'
    },
    duration: {
      info: function(proposal, form, the_event){
        return proposal['duration']+' min';
      },
      label: 'Duración',
      input: 'Selector'
    },
    availability:{  
      info: function(proposal, form, the_event) {
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
      info: function(proposal, form, the_event){
        if (proposal.title) return proposal['title']
        else if (proposal.address) return Pard.Widgets.InfoTab['address'].info(proposal, form, the_event);
      },
      label : "Titúlo / Dirección",
      input : "Inputtext"
    }
  }

  ns.Widgets.PrintTableAllProposal = function(forms, the_event){


    var deletePoposal = {
      artist: function(artist){Pard.Bus.trigger('deleteArtist', artist)},
      space: function(space){Pard.Bus.trigger('deleteSpace', space)}
    }


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

    var _orfheoFields = ['rfh','name', 'subcategory', 'titleAddress', 'phone','email'];

    var _form = {}

    _form.phone ={
      "label": "Teléfono",
      "input" : "InputTel"
    }

    _orfheoFields.forEach(function(field){
      _form[field] = Pard.Widgets.InfoTab[field] || _form[field];
      var _label = _form[field]['label'];
      var _colTitle = $('<th>').text(_label).addClass('column-call-manager-table');
      if (_form[field]['input'] == 'Input') _colTitle.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
      else _colTitle.addClass('column-'+_form[field]['input']);
      _titleRow.append(_colTitle);
      var _colFoot = $('<th>').addClass('column-call-manager-table').text(_label);
      if (_form[field]['input'] == 'Input') _colFoot.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
      else _colFoot.addClass('column-'+_form[field]['input']);
      _titleRowFoot.append(_colFoot);
    });

    _table.append(_thead.append(_titleRow));
    _table.append(_tfoot.append(_titleRowFoot));

    _table.append(_tbody);

    var proposalRow = function(profileType, proposal, profile){
      var _row = $('<tr>');
      var proposal = $.extend(true, {}, proposal);
      proposal.name = proposal.name || profile.name;
      proposal.phone = proposal.phone || profile.phone;
      proposal.email = proposal.email || profile.email;
      proposal.profile_id = proposal.profile_id || profile.profile_id;
      proposal.rfh = profileType;
      _row.attr('id', 'proposalRow-'+proposal.proposal_id);
      //Needed for conFusion 2016
      proposal.subcategory = proposal.subcategory || Pard.Widgets.Dictionary(proposal.category).render();

      _orfheoFields.forEach(function(field){
          if(_form[field].info) proposal[field] = _form[field].info(proposal, forms[profileType][proposal['_form_category']], the_event);
          var _col = $('<td>').addClass('column-call-manager-table');
          if (_form[field]['input'] == 'Input') _col.addClass('column-'+_form[field]['input']+_form[field]['args'][1]);
          else _col.addClass('column-'+_form[field]['input']);
          _row.append(_col);
          _col.append(proposal[field]);
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


}(Pard || {}));
