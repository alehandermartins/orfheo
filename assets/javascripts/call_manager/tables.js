'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ArtistsTable = function() {
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

    return {
      table: _table,
      tbody: _tbody
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

    return {
      table: _table,
      tbody: _tbody
    }
  }

}(Pard || {}));
