'use strict';

(function(ns){


  ns.Widgets.CallMainLayout = function(call){
  	var _main = $('<main>').addClass('main-call-page');
    var _mainLarge = $('<section>').addClass('pard-grid call-section');

    var _title = $('<h4>').text('Gestiona la Convocatoria');

    var _tabs = $('<ul>').addClass('menu simple tabs-menu');
  	var _tableTabTitle =	$('<a>').attr({href: "#"}).text('Tabla y Programa');
  	var _tableTab = $('<li>').append(_tableTabTitle);
  	_tableTab.click(function(){
			if(!($('#tablePanel').html())) $('#tablePanel').append(Pard.Widgets.TablePanelContent(call).render());
			$('.tab-selected').removeClass('tab-selected');
			_tableTab.addClass('tab-selected');
			_tabShowHide('tablePanel');
		});

  	var _profilesTabTitle =	$('<a>').attr({href: "#"}).text('Propuestas');
  	var _profilesTab = $('<li>').addClass('tabs-title is-active').append(_profilesTabTitle);
  	_profilesTab.click(function(){
			if(!($('#profilesPanel').html())) $('#profilesPanel').append(Pard.Widgets.ProfilesPanelContent(call).render());
			$('.tab-selected').removeClass('tab-selected');
			_profilesTab.addClass('tab-selected');
			_tabShowHide('profilesPanel');
		});

  		
  	_tabs.append(_tableTab, _profilesTab);

  	var _tabShowHide = function(id_selected){
  		_panelShown.hide();
  		var _selected = '#'+id_selected;
  		_panelShown = $('#'+id_selected);
  		_panelShown.show();
  	}

  	var _tablePanel = $('<div>').attr('id', 'tablePanel');
		var _profilesPanel = $('<div>').attr('id', 'profilesPanel');

		var _panelShown = _tablePanel;

		$(document).ready(function(){
			_tableTabTitle.trigger('click')
		});

    _mainLarge.append(_title, _tabs, _tablePanel, _profilesPanel);
    _main.append(_mainLarge);

  	return {
      render: function(){
        return _main;
      }
    }
  }

  ns.Widgets.TablePanelContent = function(call){

  	var _createdWidget = $('<div>');

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

    _createdWidget.append(_typesSelectorBox, _contentBox);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ProfilesPanelContent = function() {

  	var _createdWidget = $('<div>');

  	_createdWidget.append('aquí se pueden crear propuestas y molaría poder tener la funcion de habilitar un cierto perfil para que pueda enviar una propuesta fuera convocatoria (tipo si te paso el profile_id a este profile, aunque la convocatoria este serrada, le aparece por un tiempo maximo de una semana el boton "envia otra propuesta el conFusion") HABLEMOS DE ESO'); 

  	return {
      render: function(){
        return _createdWidget;
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
    	var _columns = [];
    	_checkBoxes.forEach(function(elem){
    		if (elem[1] === 'program'){
    			_columns.push(elem[1]); 			
    		}
    		else if (elem[0].getVal()) _columns.push(elem[1]);
    	})
    	if (_columns.length) {
     		_outerTableContainer.append(Pard.Widgets.CreateTable(_columns,proposalsSelected, _places).render())
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

  	var _createdWidget = $('<div>');

  	var _tableBox = $('<div>');
 		_tableBox.addClass('table-box-proposal-manager'); 

  	var _tableCreated = $('<table>').addClass('table-proposal');

		var _programArray = [];

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

  		_tableCreated.empty();
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

	  	_tableCreated.append(_titleRow);

			var dayTimeObj = Pard.Widgets.DayTime();
			var _submitBtn = Pard.Widgets.Button('Guarda la programación', function(){_sendProgram();});

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
	  				var _inputProgram = Pard.Widgets.InputProgram(places, dayTimeObj.render(proposal['availability']));
	  				var _showObj = {proposalId: proposal.proposal_id, newProgram: _inputProgram};
	  				if (proposal['program']) _showObj['oldProgram'] = proposal['program'];
	  				_programArray.push(_showObj);
	  				if (proposal[field]) _inputProgram.setVal(proposal['program']);
	  				_col.append(_inputProgram.render());
	  				_createdWidget.append(_submitBtn.render())
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
	  		
	  		_tableCreated.append(_row);
	  	})
	  }

	  _printTable(proposalsSelected);

	  var _sendProgram	= function(){
	  	var _programData = [];
	  	_programArray.forEach(function(inputProgram){
	  		var _showArray = inputProgram['newProgram'].getVal();	
	  		var _data = {proposal_id: inputProgram['proposalId']};
	  		var _program = [];
	  		_showArray.forEach(function(show){
	  			console.log(show);
	  			if (!(inputProgram['oldProgram']) || (inputProgram['oldProgram']['place'] ==! show['place'][0] && inputProgram['oldProgram']['day_time'].getTime() ==! show['day_time'].getTime())){
	  				_program.push({
	  					place: show['place'][0],
	  				 	day_time: show['day_time']
	  				});
	  			}
	  		});
 				_data['program'] = _program;	
				_programData.push(_data);
	  		console.log(_programData);
	  	});
	  }
    
    _createdWidget.prepend(_tableBox.append(_tableCreated));

		return {
      render: function(){
        return _createdWidget;
      }
	   }
  }


  ns.Widgets.DayTime = function(){    

    var _sat = [];
    var _sun = [];

    var _sat10am = new Date (2016,9,15,10,00,00,0);
    var _sat2345pm = new Date (2016,9,15,23,45,00,0);
    var _sund10am = new Date (2016,9,16,10,00,00,0);
    var _sund2345pm = new Date (2016,9,16,23,45,00,0);
    var _satArray = [_sat10am];
    var _sunArray = [_sund10am];

    function addMinutes(date, minutes) {
     return new Date(date.getTime() + minutes*60000);
    }

    while(_satArray[_satArray.length -1].getTime() != _sat2345pm.getTime()){
      _sat.push({id:_satArray.length -1, text:moment(_satArray[_satArray.length -1]).format('dddd, h:mm')+"h"});
      _satArray.push(addMinutes(_satArray[_satArray.length -1], 15));
    }

    while(_sunArray[_sunArray.length -1].getTime() != _sund2345pm.getTime()){
      _sun.push({id:_sunArray.length -1, text:moment(_sunArray[_sunArray.length -1]).format('dddd, h:mm')+"h"});
      _sunArray.push(addMinutes(_sunArray[_sunArray.length -1], 15));
    }

    return {
      render: function(availability){
      	var _dayTime = [{id: '',text: ''},{id:'A lo largo de los dos dias', text: 'A lo largo de los dos dias'}];
      	var _dtArray = [];
      	for (var day in availability){     
      		switch(availability[day]) {
	    			case 'Sat Oct 15 2016 12:00:00 GMT+0200 (CEST)':	
        			_dtArray = _dtArray.concat(_satArray);
        			_dayTime = _dayTime.concat(_sat);
        			break;
				    case 'Sun Oct 16 2016 12:00:00 GMT+0200 (CEST)':
			        _dtArray = _dtArray.concat(_sunArray);
			        _dayTime = _dayTime.concat(_sun);
			        break;
					}
				}
      
        var _createdWidget = {
    			dayTime: _dayTime,
    			dtArray: _dtArray
    		}
        return _createdWidget;
      }
	   }
  }





}(Pard || {}));
