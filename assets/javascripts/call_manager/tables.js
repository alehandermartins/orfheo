'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ArtistsTable = function(artistForms) {
    

    var _table = $('<table>').addClass('table-proposal stripe row-border ').attr({'cellspacing':"0", 'width':"950px"});
    var _tbody = $('<tbody>');

    var _thead = $('<thead>');
    var _titleRow = $('<tr>');
    var _tfoot = $('<tfoot>');
    var _titleRowFoot = $('<tr>');

    var _rfhCol = $('<th>').addClass('column-call-manager-table column-rfh').text('rfh');
    var _nameCol = $('<th>').addClass('column-call-manager-table column-name').text('Nombre');
    var _categoryCol = $('<th>').addClass('column-call-manager-table column-category').text('Categoría');
    var _titleCol = $('<th>').addClass('column-call-manager-table column-title').text('Título');
    var _emailCol = $('<th>').addClass('column-call-manager-table column-email').text('Email');
    var _phoneCol = $('<th>').addClass('column-call-manager-table column-phone').text('Teléfono');
    var _rfhFoot = $('<th>').addClass('column-call-manager-table column-rfh').text('rfh');
    var _nameFoot = $('<th>').addClass('column-call-manager-table column-name').text('Nombre');
    var _categoryFoot = $('<th>').addClass('column-call-manager-table column-category').text('Categoría');
    var _titleFoot = $('<th>').addClass('column-call-manager-table column-title').text('Título');;
    var _emailFoot = $('<th>').addClass('column-call-manager-table column-email').text('Email');
    var _phoneFoot = $('<th>').addClass('column-call-manager-table column-phone').text('Teléfono');

    _titleRow.append(_rfhCol);
    _titleRow.append(_nameCol);
    _titleRow.append(_categoryCol);
    _titleRow.append(_titleCol);
    _titleRow.append(_emailCol);
    _titleRow.append(_phoneCol);
    _titleRowFoot.append(_rfhFoot);
    _titleRowFoot.append(_nameFoot);
    _titleRowFoot.append(_categoryFoot);
    _titleRowFoot.append(_titleFoot);
    _titleRowFoot.append(_emailFoot);
    _titleRowFoot.append(_phoneFoot);

    _table.append(_thead.append(_titleRow));
    _table.append(_tfoot.append(_titleRowFoot));

    _table.append(_tbody);

    var proposalRow = function(artist, proposal){
      var _row = $('<tr>').attr('id', 'tableRow-'+proposal.proposal_id);
      var _rfhCol = $('<td>').addClass('column-call-manager-table column-rfh');
      var _nameCol = $('<td>').addClass('column-call-manager-table column-name');
      var _categoryCol = $('<th>').addClass('column-call-manager-table column-category').text('Categoría');
      var _titleCol = $('<th>').addClass('column-call-manager-table column-title').text('Título');
      var _emailCol = $('<td>').addClass('column-call-manager-table column-email');
      var _phoneCol = $('<th>').addClass('column-call-manager-table column-phone');

      var _icon = $('<a>').append(Pard.Widgets.IconManager('artist').render());
      _icon.attr({'href': '/profile?id=' + artist.profile_id, 'target':'_blank'});
      var _name = $('<a>').attr({'href':'#'}).text(artist.name);
      proposal.name = artist.name;
      proposal.phone = artist.phone;
      proposal.email = artist.email;
      _name.on('click', function(){
        if (!(_forms)) {
          Pard.Backend.getCallForms(the_event.call_id, function(data){
            _forms = data.forms;
            var _popupDisplayed = Pard.Widgets.DisplayPopupProposal(proposal, _forms['artist'][proposal.form_category], 'artist', the_event.name);
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
        else{
          var _popupDisplayed = Pard.Widgets.DisplayPopupProposal(proposal, _forms['artist'][proposal.form_category], 'artist', the_event.name);
          _popupDisplayed.setDeleteProposalCallback(function(data){
            if (data['status'] == 'success'){
              deleteArtist(artist.profile_id, proposal.proposal_id);
            }
            else{
              Pard.Widgets.Alert('',data.reason);
            }
          });
          _popupDisplayed.open();
        }
      });

      _rfhCol.append(_icon);
      _nameCol.html(_name);
      _categoryCol.html(Pard.Widgets.Dictionary(proposal.category).render());
      _titleCol.html(proposal.title);
      _emailCol.html(artist.email);
      _phoneCol.html(artist.phone);

      _row.append(_rfhCol, _nameCol, _categoryCol, _titleCol, _emailCol, _phoneCol);
      return _row;
    }

    return {
      table: _table,
      addRow: function(artist, proposal){
        _tbody.append(proposalRow(artist, proposal))
      },
      proposalRow: proposalRow
    }
  }

  ns.Widgets.SpacesTable = function() {
    var _table = $('<table>').addClass('table-proposal stripe row-border ').attr({'cellspacing':"0", 'width':"950px"});
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
      var _row = $('<tr>').attr('id', 'tableRow-'+space.profile_id);
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
        if (!(_forms)) {
          Pard.Backend.getCallForms(the_event.call_id, function(data){
            _forms = data.forms;
            var _popupDisplayed = Pard.Widgets.DisplayPopupProposal(space, _forms['space'][space.form_category], 'space', the_event.name);
            _popupDisplayed.setDeleteProposalCallback(function(data){
              if (data['status'] == 'success'){
                deleteSpace(space.profile_id);
              }
              else{
                Pard.Widgets.Alert('',data.reason);
              }
            })
            _popupDisplayed.open();
          });
        }
        else{
          var _popupDisplayed = Pard.Widgets.DisplayPopupProposal(space, _forms['space'][space.form_category], 'space', the_event.name);
          _popupDisplayed.setDeleteProposalCallback(function(data){
            if (data['status'] == 'success'){
              deleteSpace(space.profile_id);
            }
            else{
              Pard.Widgets.Alert('',data.reason);
            }
          });
          _popupDisplayed.open();
        }
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
      spaceRow: spaceRow
    }
  }

}(Pard || {}));
