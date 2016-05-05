'use strict';

(function(ns){


  ns.Widgets.CallMainLayout = function(call){
  	var _main = $('<main>').addClass('main-call-page');
    var _mainLarge = $('<section>').addClass('pard-grid call-section');

    var _title = $('<h4>').text('Gestiona la Convocatoria');

    var _typesSelectorBox = $('<div>');
    var _contentBox = $('<div>');

    var _types = ['artist', 'space'];  
    var _labelTypes = [];
    _types.forEach(function(type){
    	_labelTypes.push(Pard.Widgets.Dictionary(type).render());
    });

    var _selectorCallback = function(){
    	_contentBox.empty();
    	var _selected = $(this).val();
    	var _proposalsSelected = [];
    	call['proposals'].forEach(function(proposal){
    		if (proposal['type']==_selected) _proposalsSelected.push(proposal);
    	});
    	_contentBox.append(Pard.Widgets.CallManagerContent(_selected,  _proposalsSelected).render());
    }

    var _typesSelector = Pard.Widgets.Selector(_labelTypes, _types, _selectorCallback).render()

    var _preSelected = 'artist';

    var _proposalsSelected = [];
    call['proposals'].forEach(function(proposal){
    		if (proposal['type']==_preSelected) _proposalsSelected.push(proposal);
    	});
   	_contentBox.append(Pard.Widgets.CallManagerContent(_preSelected,  _proposalsSelected).render());

		_typesSelectorBox.append(_typesSelector);  

    _mainLarge.append(_title, _typesSelectorBox, _contentBox);
    _main.append(_mainLarge);

  	return {
      render: function(){
        return _main;
      }
    }
  }

  ns.Widgets.CallManagerContent = function(selected, proposalsSelected){
 	console.log(proposalsSelected);
  	var _createdWidget = $('<div>');

  	var _fields = {
  		space: ['name','category','responsible', 'email', 'phone','description', 'own', 'sharing', 'un_wanted','availability','amend'],
  		artist: ['name','category','email', 'phone','title','short_description','description', 'duration','components', 'meters', 'children', 'repeat', 'waiting_list','needs','sharing','availability', 'amend']
  	}

    var _checkBoxesBox = $('<div>');
    var _tableBox = $('<div>');

    var _checkBoxes = [];

    var _printTable = function(){

    	_tableBox.empty();
    	var _columns = [];
    	_checkBoxes.forEach(function(elem){
    		if (elem[0].getVal()) _columns.push(elem[1]);
    	})
     	_tableBox.append(Pard.Widgets.CreateTable(_columns,proposalsSelected).render())
    }

    var _allCheckBoxes = Pard.Widgets.CheckBox('Todos los campos','all');
    var _allCheckBoxesRendered = _allCheckBoxes.render();
    _allCheckBoxesRendered.change(function(){
    	_checkBoxesBox.empty();
    	_printCheckBoxes()
    	var _val = _allCheckBoxes.getVal()
    	_checkBoxes.forEach(function(elem){
    			elem[0].setVal(_val);
    	})
    	_printTable();
    })


    var _printCheckBoxes = function(){
	    _fields[selected].forEach(function(field){
	    	var _checkBox = Pard.Widgets.CheckBox(field,field)
	    	_checkBoxes.push([_checkBox,field]);
	    	var _checkBoxRendered = _checkBox.render().addClass('checkBox-call-manager');
	    	_checkBoxRendered.change(function(){
	    		_printTable();
	    	})
	    	_checkBoxesBox.append(_checkBoxRendered);
	    });
	  }

	  _printCheckBoxes();

    // var _createTableBtn = Pard.Widgets.Button('Crea tabla').render();
    // _createTableBtn.click(function(){
    // 	_tableBox.empty();
    // 	var _columns = [];
    // 	_checkBoxes.forEach(function(elem){
    // 		if (elem[0].getVal()) _columns.push(elem[1]);
    // 	})
    //  	_tableBox.append(Pard.Widgets.CreateTable(_columns,proposalsSelected).render())
   	// });



    // var _createTableBtnBox = $('<div>');
    // _createTableBtnBox.append(_createTableBtn);
    // _checkBoxesBox.append(_createTableBtnBox);

    var _outerTableContainer = $('<div>').append(_tableBox.addClass('table-box-proposal-manager'));
    _createdWidget.append(_allCheckBoxesRendered,_checkBoxesBox, _outerTableContainer);

		return {
      render: function(){
        return _createdWidget;
      }
	   }
  }

  ns.Widgets.CreateTable= function(columns, proposalsSelected){

  	var _createdWidget = $('<table>').addClass('table-proposal');

  	var _titleRow = $('<tr>').addClass('title-row-table-proposal');

  	columns.forEach(function(title){
  		var _titleCol = $('<td>').html(title);
  		_titleRow.append(_titleCol);
  	});

  	_createdWidget.append(_titleRow);

  	proposalsSelected.forEach(function(proposal){
  		var _row = $('<tr>');
  		columns.forEach(function(field){
  			if (proposal[field] && field != 'availability') {
  				var _col = $('<td>').html(proposal[field]);
  			}
  			else if (proposal[field] && field == 'availability') {
  				var _col = $('<td>');
  				for (var date in proposal[field]) {
	  				_col.append($('<div>').append(Pard.Widgets.AvailabilityDictionary(proposal[field][date])));
  				}
  			}
  			else{
  				var _col = $('<td>').html('');
  			}
  			_row.append(_col);
  		});
  		_createdWidget.append(_row);
  	})

		return {
      render: function(){
        return _createdWidget;
      }
	   }
  }

}(Pard || {}));
