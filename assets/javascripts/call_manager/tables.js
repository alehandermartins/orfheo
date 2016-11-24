'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ArtistsTable = function(form, interactions) {

    var the_event = Pard.CachedEvent;
    var deleteArtist = interactions.deleteArtist;    

    var _table = $('<table>').addClass('table-proposal stripe row-border ').attr({'cellspacing':"0"}).css({'width':"950px !important"});
    var _tbody = $('<tbody>');

    var _thead = $('<thead>');
    var _titleRow = $('<tr>');
    var _tfoot = $('<tfoot>');
    var _titleRowFoot = $('<tr>');

    // var _orfheoFields = ['rfh','name', 'subcategory','address', 'title','short_description','description','duration','availability','phone','email'];
    // var _shownColumns = ['rfh','name', 'subcategory','address', 'title','short_description','phone','email'];

    var _orfheoFields = ['rfh','name', 'subcategory', 'title','short_description','description','duration','availability','children','phone','email'];
    var _shownColumns = ['rfh','name', 'title','short_description','phone','email'];
    var _notMandatoryFields = ['children', 'duration','availability']

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
      "input" : "Input",
      "args" : [ 
                "", 
                "text"
              ]   
    }

    if (!(form.subcategory)) form.subcategory = {
        "label" : "Categoría en el evento",
        "input" : "Selector",
      }

    var _colPosition = 0;

    _orfheoFields.forEach(function(field){
      if ($.inArray(field, _notMandatoryFields)>-1 && !(form[field])){
        return false;
      }
      else {
        if ($.inArray(field, _shownColumns)<0) _hiddenColumns.push(_colPosition);
        _colPosition += 1;
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
    });

    for (var field in form){
      if ($.isNumeric(field)){
        if ($.inArray(field, _shownColumns)<0) _hiddenColumns.push(_colPosition);
         _colPosition += 1;
        var _label = form[field]['label'];
        var _colTitle = $('<th>').text(_label).addClass('column-call-manager-table');;
        // if (form[field]['input'] == 'Input') _colTitle.addClass('column-'+form[field]['input']+form[field]['args'][1]);
        // else _colTitle.addClass('column-'+form[field]['input']);
        _titleRow.append(_colTitle);
        var _colFoot = $('<th>').addClass('column-call-manager-table column-'+form[field]['input']).text(_label);
        _titleRowFoot.append(_colFoot);
      }
    }

    _table.append(_thead.append(_titleRow));
    _table.append(_tfoot.append(_titleRowFoot));

    _table.append(_tbody);

    var proposalRow = function(artist, proposal){
      var _row = $('<tr>').attr('id', 'proposalRow-'+proposal.proposal_id);
      proposal.name = artist.name;
      proposal.phone = artist.phone;
      proposal.email = artist.email;

      _orfheoFields.forEach(function(field){
        
        if (form[field]){
          var _col = $('<td>').addClass('column-call-manager-table'); 
          if (form[field]['input'] == 'Input') _col.addClass('column-'+form[field]['input']+form[field]['args'][1]);
          else _col.addClass('column-'+form[field]['input']);
          _row.append(_col);
          var _info = '';
          if(field == 'rfh'){
            if (artist.profile_id.indexOf('own')<0) _info = $('<a>').append(Pard.Widgets.IconManager('artist').render()).attr({'href':'/profile?id='+artist.profile_id, 'target':'_blank'});
            else _info = Pard.Widgets.IconManager('artist').render();
          }
          else if (field == 'name'){
            _info = $('<a>').attr({'href':'#'}).text(artist.name);
            _info.on('click', function(){
              var _popupDisplayed = Pard.Widgets.DisplayPopupProposal(proposal, form, 'artist', the_event.name);
              _popupDisplayed.setDeleteProposalCallback(function(data){
                if (data['status'] == 'success'){
                  deleteArtist(artist.profile_id, proposal.proposal_id);
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
      addRow: function(artist, proposal){
        _tbody.append(proposalRow(artist, proposal))
      },
      proposalRow: proposalRow,
      hiddenColumns: _hiddenColumns
    }
  }


    ns.Widgets.PrintTable = function(type, form, interactions) {

    var the_event = Pard.CachedEvent;

    console.log(type)

    var deletePoposal = {
      artist: interactions.deleteArtist,
      space: interactions.deleteSpace
    }    

    var _table = $('<table>').addClass('table-proposal stripe row-border ').attr({'cellspacing':"0"}).css({'width':"950px !important"});
    var _tbody = $('<tbody>');

    var _thead = $('<thead>');
    var _titleRow = $('<tr>');
    var _tfoot = $('<tfoot>');
    var _titleRowFoot = $('<tr>');

    // var _orfheoFields = ['rfh','name', 'subcategory','address', 'title','short_description','description','duration','availability','phone','email'];
    // var _shownColumns = ['rfh','name', 'subcategory','address', 'title','short_description','phone','email'];

    var _orfheoFields = {
      artist: ['rfh','name', 'subcategory', 'title','short_description','description','duration','availability','children','phone','email'],
      space: ['rfh','name', 'subcategory','address', 'description','availability','phone','email']
  };
    var _shownColumns = {
      artist: ['rfh','name', 'title','short_description','phone','email'],
      space: ['rfh','name', 'subcategory','address', 'phone','email']
    }
    var _notMandatoryFields = {
      artist: ['children', 'duration','availability'],
      space: ['availability']
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
      "input" : "Input",
      "args" : [ 
                "", 
                "text"
              ]   
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

    _orfheoFields[type].forEach(function(field){
      if ($.inArray(field, _notMandatoryFields[type])>-1 && !(form[field])){
        return false;
      }
      else {
        if ($.inArray(field, _shownColumns[type])<0) _hiddenColumns.push(_colPosition);
        _colPosition += 1;
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
    });

    for (var field in form){
      if ($.isNumeric(field)){
        if ($.inArray(field, _shownColumns)<0) _hiddenColumns.push(_colPosition);
         _colPosition += 1;
        var _label = form[field]['label'];
        var _colTitle = $('<th>').text(_label).addClass('column-call-manager-table');;
        // if (form[field]['input'] == 'Input') _colTitle.addClass('column-'+form[field]['input']+form[field]['args'][1]);
        // else _colTitle.addClass('column-'+form[field]['input']);
        _titleRow.append(_colTitle);
        var _colFoot = $('<th>').addClass('column-call-manager-table column-'+form[field]['input']).text(_label);
        _titleRowFoot.append(_colFoot);
      }
    }

    _table.append(_thead.append(_titleRow));
    _table.append(_tfoot.append(_titleRowFoot));

    _table.append(_tbody);

    var proposalRow = function(proposal, profile){
      var _row = $('<tr>');
      console.log(proposal);
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


  ns.Widgets.SpacesTable = function(form, interactions) {
    var deleteSpace = interactions.deleteSpace;
    var _hiddenColumns = [];


    var _table = $('<table>').addClass('table-proposal stripe row-border ').attr({'cellspacing':"0", 'width':"950px"});

    var the_event = Pard.CachedEvent;    

    var _tbody = $('<tbody>');

    var _thead = $('<thead>');
    var _titleRow = $('<tr>');
    var _tfoot = $('<tfoot>');
    var _titleRowFoot = $('<tr>');

    var _rfhCol = $('<th>').addClass('column-call-manager-table column-rfh').text('rfh');
    var _nameCol = $('<th>').addClass('column-call-manager-table column-name').text('Nombre');
    var _addressCol = $('<th>').addClass('column-call-manager-table column-address').text('Dirección');
    var _emailCol = $('<th>').addClass('column-call-manager-table column-email').text('Email');
    var _phoneCol = $('<th>').addClass('column-call-manager-table column-phone').text('Teléfono');
    var _rfhFoot = $('<th>').addClass('column-call-manager-table column-rfh').text('rfh');
    var _nameFoot = $('<th>').addClass('column-call-manager-table column-name').text('Nombre');
    var _addressFoot = $('<th>').addClass('column-call-manager-table column-address').text('Dirección');
    var _emailFoot = $('<th>').addClass('column-call-manager-table column-email').text('Email');
    var _phoneFoot = $('<th>').addClass('column-call-manager-table column-phone').text('Teléfono');

    _titleRow.append(_rfhCol);
    _titleRow.append(_nameCol);
    _titleRow.append(_addressCol);
    _titleRow.append(_emailCol);
    _titleRow.append(_phoneCol);
    _titleRowFoot.append(_rfhFoot);
    _titleRowFoot.append(_nameFoot);
    _titleRowFoot.append(_addressFoot);
    _titleRowFoot.append(_emailFoot);
    _titleRowFoot.append(_phoneFoot);

    _table.append(_thead.append(_titleRow));
    _table.append(_tfoot.append(_titleRowFoot));

    _table.append(_tbody);

    var spaceRow = function(space){
      var _row = $('<tr>').attr('id', 'proposalRow-'+space.profile_id);
      var _rfhCol = $('<td>').addClass('column-call-manager-table column-rfh');
      var _nameCol = $('<td>').addClass('column-call-manager-table column-name');
      var _addressCol = $('<td>').addClass('column-call-manager-table column-address');
      var _emailCol = $('<td>').addClass('column-call-manager-table column-email');
      var _phoneCol = $('<th>').addClass('column-call-manager-table column-phone');

      var _icon = $('<a>').append(Pard.Widgets.IconManager('space').render());
      _icon.attr({'href': '/profile?id=' + space.profile_id, 'target':'_blank'});
      var _name = $('<a>').attr({'href':'#'}).text(space.name);
      var _addressText = ' '+ space['address']['route'] + ' ' + space['address']['street_number'];
      if (space['address']['door']) _addressText += ', puerta/piso ' + space['address']['door'];
      _addressText += ', ' + space['address']['locality'];
      var _aStr = space['address']['route'] + ' ' + space['address']['street_number'] + ', ' + space['address']['locality'] + ' ' + space['address']['country'];
      var _address = $('<a>').attr({
        href: 'http://maps.google.com/maps?q=' + _aStr,
        target: '_blank'
      }).text(_addressText);

      _name.on('click', function(){
        // if (!(_forms)) {
        //   Pard.Backend.getCallForms(the_event.call_id, function(data){
        //     _forms = data.forms;
        //     var _popupDisplayed = Pard.Widgets.DisplayPopupProposal(space, _forms['space'][space.form_category], 'space', the_event.name);
        //     _popupDisplayed.setDeleteProposalCallback(function(data){
        //       if (data['status'] == 'success'){
        //         deleteSpace(space.profile_id);
        //       }
        //       else{
        //         Pard.Widgets.Alert('',data.reason);
        //       }
        //     })
        //     _popupDisplayed.open();
        //   });
        // }
        // else{
          var _popupDisplayed = Pard.Widgets.DisplayPopupProposal(space, form, 'space', the_event.name);
          _popupDisplayed.setDeleteProposalCallback(function(data){
            if (data['status'] == 'success'){
              deleteSpace(space.profile_id);
            }
            else{
              Pard.Widgets.Alert('',data.reason);
            }
          });
          _popupDisplayed.open();
        // }
      });
      _rfhCol.append(_icon);
      _nameCol.html(_name);
      _addressCol.append(_address);
      _emailCol.html(space.email);
      _phoneCol.html(space.phone);

      _row.append(_rfhCol, _nameCol, _addressCol, _emailCol, _phoneCol);
      return _row;
    }


    return {
      table: _table,
      addRow: function(space){
        _tbody.append(spaceRow(space));
      },
      spaceRow: spaceRow,
      hiddenColumns: _hiddenColumns
    }
  }

}(Pard || {}));
