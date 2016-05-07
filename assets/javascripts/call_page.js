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
    	_contentBox.append(Pard.Widgets.CallManagerContent(_selected,  call['proposals']).render());
    }

    var _typesSelector = Pard.Widgets.Selector(_labelTypes, _types, _selectorCallback).render().addClass('types-selector-call-manager')

    var _preSelected = 'artist';

   	_contentBox.append(Pard.Widgets.CallManagerContent(_preSelected,  call['proposals']).render());

		_typesSelectorBox.append(_typesSelector);  

    _mainLarge.append(_title, _typesSelectorBox, _contentBox);
    _main.append(_mainLarge);

  	return {
      render: function(){
        return _main;
      }
    }
  }

  ns.Widgets.CallManagerContent = function(selected, proposals){
  	var _createdWidget = $('<div>');

  	var proposalsSelected = [];
  	proposals.forEach(function(proposal){
    		if (proposal['type'] == selected) proposalsSelected.push(proposal);
    	});

  	var _fields = {
  		space: ['name','category','responsible', 'email', 'phone','address','description', 'own', 'sharing', 'un_wanted','availability','amend'],
  		artist: ['name','category','email', 'phone','title','short_description','description', 'duration','components', 'meters', 'children', 'repeat', 'waiting_list','needs','sharing','availability', 'amend']
  	}

  	var _places = [{id:'', text:''}];
  	proposals.forEach(function(proposal){
    		if (proposal['type'] == 'space') _places.push({id: proposal['responsible'], text: proposal['responsible']});
    });

    var _checkBoxesBox = $('<div>');
    var _outerTableContainer = $('<div>');

    var _checkBoxes = [];

    var _createTable = function(){
    	_outerTableContainer.empty();
    	var _tableBox = $('<div>');
    	var _columns = [];
    	_checkBoxes.forEach(function(elem){
    		if (elem[1] === 'program'){
    			_columns.push(elem[1]);
    		}
    		else if (elem[0].getVal()) _columns.push(elem[1]);
    	})
    	if (_columns.length) {
    		_tableBox.addClass('table-box-proposal-manager'); 
     		_outerTableContainer.append(_tableBox.append(Pard.Widgets.CreateTable(_columns,proposalsSelected, _places).render()))
     }
    }

    var _allCheckBoxes = Pard.Widgets.CheckBox('Todos los campos','all');
    var _allCheckBoxesRendered = _allCheckBoxes.render().addClass('checkBox-call-manager');
    _allCheckBoxesRendered.change(function(){
    	_checkBoxesBox.empty();
    	_printCheckBoxes();
    	var _val = _allCheckBoxes.getVal()
    	_checkBoxes.forEach(function(elem){
    			elem[0].setVal(_val);
    	})
    	_createTable();
    })


    var _programCheckBox = Pard.Widgets.CheckBox('<span style = "color: red; font-size:0.875rem">Programación</span>','program');
    var _programCheckBoxRendered = _programCheckBox.render().addClass('checkBox-call-manager');
    _programCheckBoxRendered.change(function(){
    	_checkBoxesBox.empty();
    	_printCheckBoxes();
    	var _val = _programCheckBox.getVal()
    	_checkBoxes.forEach(function(elem){
    		if (elem[1] === 'link_orfheo' || elem[1] === 'name') elem[0].setVal(_val);
    })
    	if (_val){
	    	_checkBoxes.push([true, 'program']);
	    	// _checkBoxes.push([true, 'day_time']);
    	}
    	_createTable();

    })



    var _printCheckBoxes = function(){
    	_checkBoxes = [];
    	var _checkBox = Pard.Widgets.CheckBox('Enlace a perfil','link_orfheo')
	    	_checkBoxes.push([_checkBox,'link_orfheo']);
	    	var _checkBoxRendered = _checkBox.render().addClass('checkBox-call-manager');
	    	_checkBoxRendered.change(function(){
	    		_createTable();
	    	})
	    	_checkBoxesBox.append(_checkBoxRendered);
	    _fields[selected].forEach(function(field){
	    	var _checkBox = Pard.Widgets.CheckBox(Pard.Widgets.Dictionary(field).render(),field)
	    	_checkBoxes.push([_checkBox,field]);
	    	var _checkBoxRendered = _checkBox.render().addClass('checkBox-call-manager');
	    	_checkBoxRendered.change(function(){
	    		_createTable();
	    	})
	    	_checkBoxesBox.append(_checkBoxRendered);
	    });
	  }

	  _printCheckBoxes();
  	
    _createdWidget.append($('<div>').append(_allCheckBoxesRendered, _programCheckBoxRendered).css('margin-bottom','1rem'),_checkBoxesBox, _outerTableContainer);

		return {
      render: function(){
        return _createdWidget;
      }
	   }
  }



  ns.Widgets.CreateTable= function(columns, proposalsSelected, places){

  	var _createdWidget = $('<table>').addClass('table-proposal');

  	var _reorder = function(proposalField, field){
	  	proposalField.sort(function (a, b) {
    		return a.toLowerCase().localeCompare(b.toLowerCase());
			});
	  	var _reordered = [];
	  	proposalField.forEach(function(value){
	  		proposalsSelected.forEach(function(proposal){
		  		if (proposal[field] ==  value && $.inArray(proposal,_reordered)==-1){
						_reordered.push(proposal);
					} 
				})
			})
			return _reordered;
  	}


  	var _printTable = function(proposals){

  		_createdWidget.empty();
	  	var _titleRow = $('<tr>').addClass('title-row-table-proposal');
	  	columns.forEach(function(field){
	  		if (field == 'link_orfheo'){
	  		var _titleText = $('<span>').html('rfh');
	  		var _titleCol = $('<td>').append(_titleText);
	  		_titleRow.append(_titleCol.addClass('icon-column-call-table'));
	  		}
	  		else{
		  		var _titleText = $('<span>').html(Pard.Widgets.Dictionary(field).render());
		  		var _titleCol = $('<td>').append(_titleText);
		  		var _proposalField = [];
		  		if (field != 'availability'){
			  		proposals.forEach(function(proposal){
			  			_proposalField.push(proposal[field]);
			  		});
			  		_titleText.click(function(){ 
			  			var _proposalsReordered = _reorder(_proposalField,field);
			  			_printTable(_proposalsReordered);
			  		});
			  		_titleText.addClass('title-colText-call-manager');
			  		_titleText.append($('<span>').html('&#xE5C5').addClass('material-icons').css('vertical-align','middle'))
			  	}
		  	}
	  		_titleRow.append(_titleCol);
	  	});

	  	_createdWidget.append(_titleRow);

			var dayTimeObj = Pard.Widgets.DayTime().render();

	  	proposals.forEach(function(proposal){
	  		var _row = $('<tr>');
	  		columns.forEach(function(field){
	  			if (field == 'link_orfheo'){
	  				var _icon = $('<a>').append(Pard.Widgets.IconManager(proposal['type']).render());
	  				_icon.attr({'href': '/profile?id=' + proposal['profile_id'], 'target':'_blank'});
	  				_row.prepend($('<td>').append(_icon));
	  			}
	  			else if (field == 'program') {
	  				var _col = $('<td>');
	  				if (proposal[field]) _col.html('program');
	  				_col.append(Pard.Widgets.InputProgram(places, dayTimeObj).render());
		  		}
		  		// else if (field == 'day_time') {
	  			// 	var _col = $('<td>');
	  			// 	if (proposal[field]) _col.html('place');
		  		// }
	  			else if (proposal[field] && field == 'availability') {
	  				var _col = $('<td>');
	  				for (var date in proposal[field]) {
		  				_col.append($('<div>').append(Pard.Widgets.AvailabilityDictionary(proposal[field][date])));
	  				}
	  			}
	  			else	if (proposal[field] && $.inArray(field,['children', 'waiting_list','repeat'])>-1) {
	  				if (proposal[field] == 'true') {var _col = $('<td>').html('Sí');}
	  				else if (proposal[field] == 'false') { var _col = $('<td>').html('No');}
	  				else { var _col = $('<td>').html(proposal[field]);}
	  			}
	  			else	if (proposal[field] && field == 'category'){
	  				var _col = $('<td>').html(Pard.Widgets.Dictionary(proposal[field]).render());
	  			}
	  			else	if (proposal[field]) {
	  				var _col = $('<td>').html(proposal[field]);
	  			}
	  			else{
	  				var _col = $('<td>').html('');
	  			}
	  			_row.append(_col);
	  		});
	  		
	  		_createdWidget.append(_row);
	  	})
	  }

	  _printTable(proposalsSelected);

		return {
      render: function(){
        return _createdWidget;
      }
	   }
  }


  ns.Widgets.DayTime = function(){

   var _dayTime = [{id: '',text: ''},{id:'A lo largo de los dos dias', text: 'A lo largo de los dos dias'}];

    var _sat10am = new Date (2016,9,15,10,00,00,0);
    var _sat2345pm = new Date (2016,9,15,23,45,00,0);
    var _sund10am = new Date (2016,9,16,10,00,00,0);
    var _sund2345pm = new Date (2016,9,16,23,45,00,0);
    var _dtArray = [_sat10am];


    function addMinutes(date, minutes) {
     return new Date(date.getTime() + minutes*60000);
    }


    while(_dtArray[_dtArray.length -1].getTime() != _sat2345pm.getTime()){
      _dayTime.push({id:_dtArray.length -1, text:moment(_dtArray[_dtArray.length -1]).format('dddd, h:mm')+"h"});
      _dtArray.push(addMinutes(_dtArray[_dtArray.length -1], 15));
    }

    _dtArray.push(_sund10am);

    while(_dtArray[_dtArray.length -1].getTime() != _sund2345pm.getTime()){
      _dayTime.push({id:_dtArray.length -1, text:moment(_dtArray[_dtArray.length -1]).format('dddd, h:mm')+"h"});
      _dtArray.push(addMinutes(_dtArray[_dtArray.length -1], 15));
    }

    var _createdWidget = {
    	dayTime: _dayTime,
    	dtArray: _dtArray
    }

    return {
      render: function(){
        return _createdWidget;
      }
	   }
  }





}(Pard || {}));
