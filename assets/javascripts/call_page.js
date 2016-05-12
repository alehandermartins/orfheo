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
    	_contentBox.append(Pard.Widgets.CallManagerContent(_selected).render());
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


  ns.Widgets.CallManagerContent = function(selected){
  	var _createdWidget = $('<div>');

  	var _fields = {
  		space: ['name','category','responsible', 'email', 'phone','address','description', 'own', 'sharing', 'un_wanted','availability','amend'],
  		artist: ['name','category','email', 'phone','title','short_description','description', 'duration','components', 'meters', 'children', 'repeat', 'waiting_list','needs','sharing','availability', 'amend']
  	}


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
     		_outerTableContainer.append(Pard.Widgets.CreateTable(_columns, selected).render())
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
    		['link_orfheo', 'name', 'title'].forEach(function(field){
    			if (elem[1] == field) elem[0].setVal(_val);
    		}) 
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


  ns.Widgets.CreateTable = function(columns, selected){

  	var proposals = Pard.CachedProposals;

  	var _createdWidget = $('<div>');
  	var _searchTags = [{id:'', text:''}];

  	var _places = [{id:'', text:''}];
  	var _artists = [{id:'', text:''}];
  	var _programs = [];
    var _proposalsSelected = [];

  	proposals.forEach(function(proposal){
  		if (proposal['type'] == 'space') _places.push({id: proposal['name'], text: proposal['name']});
  		if (proposal['type'] == 'artist') {
  			var _text =  proposal['name'] + ' - ' +  proposal['title'];
				_artists.push({id: proposal['proposal_id'], text: _text});
				if (proposal['program']){
	  			proposal['program']['proposal_id'] = proposal['proposal_id'];
	  			_programs.push(proposal['program']);
				}
			}
   		if (proposal['type'] == selected) {
   			_proposalsSelected.push(proposal);
   			var _check = true;
				_searchTags.some(function(tag){
	  		if (proposal['category'] == tag['id']){ 
					_check = false;
					return true;
	  			} 
	  		});
  			if (_check) _searchTags.push({id: proposal['category'], text: Pard.Widgets.Dictionary(proposal['category']).render()});
  			_searchTags.push({id:proposal['name'], text:proposal['name']});
  			if (selected == 'space')  _searchTags.push({id: proposal['responsible'], text: proposal['responsible']});
  			if (selected == 'artist')  _searchTags.push({id: proposal['title'], text: proposal['title']});
   		}
   	});

		var dayTimeObj = Pard.Widgets.DayTime();

  	var _tableBox = $('<div>');
 		_tableBox.attr('id', 'table-box-proposal-manager'); 

   	var _tableCreated = $('<table>').addClass('table-proposal');

   	var _submitBtnContainer = $('<div>');
   	var _successBox = $('<span>').attr('id','succes-box-call-manager');

   	var _searchInput = $('<select>');

   	var _printTable = function(proposalsSelected) {
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
			  		proposalsSelected.forEach(function(proposal){
			  			_proposalField.push(proposal[field]);
			  		});
			  		_titleText.click(function(){ 
			  			var _proposalsReordered = Pard.Widgets.Reorder(_proposalField,field, proposalsSelected).render();
			  			_printTable(_proposalsReordered);
			  		});
			  		_titleText.addClass('title-colText-call-manager');
			  		_titleText.append($('<span>').html('&#xE5C5').addClass('material-icons').css('vertical-align','middle'))
			  	}
		  	}
	  		_titleRow.append(_titleCol);
	  	});

	  	_tableCreated.append(_titleRow);

	  	var _programArray = [];

	  	proposalsSelected.forEach(function(proposal){
	  		var _row = $('<tr>');
	  		columns.forEach(function(field){
	  			if (field == 'link_orfheo'){
	  				var _icon = $('<a>').append(Pard.Widgets.IconManager(proposal['type']).render());
	  				_icon.attr({'href': '/profile?id=' + proposal['profile_id'], 'target':'_blank'});
	  				var _col = $('<td>').append(_icon);
	  			}
	  			else if (field == 'name'){
	  				var _col = $('<td>');
	  				var _namePopupCaller = $('<a>').attr({'href':'#'}).text(proposal['name']);
	  				var _form;
	  				if (selected == 'artists') _form = Pard.Forms.ArtistCall(proposal.category);
	  				else _form = Pard.Forms.SpaceCall();

  				 var _popup = Pard.Widgets.PopupCreator(_namePopupCaller, 'conFusión 2016', function(){return Pard.Widgets.PrintProposalMessage(Pard.Widgets.PrintProposal(proposal, _form.render()))});
  				 _col.append(_popup.render());

	  			}
	  			else if (field == 'program') {
	  				var _col = $('<td>');
	  				  if (proposal['type'] == 'artist') {
								var _inputProgram = Pard.Widgets.InputArtistProgram(_places, dayTimeObj.render(proposal['availability']));
								// _inputProgram.setDayTime(proposal['availability']);
								var _showObj = {proposalId: proposal.proposal_id, newProgram: _inputProgram};
								_programArray.push(_showObj);
								if (proposal['program']) _inputProgram.setVal(proposal['program']);
							}
						  if (proposal['type'] == 'space') {
						  	var _inputProgram = Pard.Widgets.InputSpaceProgram(_artists, dayTimeObj.render(proposal['availability']), _programs);
								var _showObj = {place: proposal['name'], newProgram: _inputProgram};
								_programArray.push(_showObj);
								var _savedProgram = [];	  					
								_programs.forEach(function(program){
									for (var key in program){
										if (program[key]['place'] == proposal['name']){
											_savedProgram.push({proposal_id: program['proposal_id'], day_time: program[key]['day_time']});
										}
									}
								});
								_inputProgram.setVal(_savedProgram);
						  }
						_col.append(_inputProgram.render());
	 				}
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
	  	if ($.inArray('program', columns) >-1) {
	  		_submitBtnContainer.empty()
	 			var _submitBtn = Pard.Widgets.Button('Guarda los cambios', function(){Pard.Widgets.SendProgram(_programArray, selected, columns);});
	 			_submitBtnContainer.append(_successBox, _submitBtn.render());
	 		}
	  }

  	_printTable(_proposalsSelected);
    
    _createdWidget.append(_searchInput, _tableBox.append(_tableCreated), _submitBtnContainer);

    _searchInput.select2({
        data: _searchTags,
        multiple:true,
        placeholder: 'Busca',
        tags: true,
        tokenSeparators: [',', ' '],   
      });

    _searchInput.on('change', function() {
      var _searchTerms = $(this).val();
      if (!(_searchTerms))	var _proposalsSearched = _proposalsSelected;
	    else {
	    	var _proposalsSearched = _proposalsSelected;
	    	var _oldProposalsSearched = _proposalsSelected;
	    	_searchTerms.forEach(function(_searchTerm){
		    	_oldProposalsSearched = _proposalsSearched;
		    	_proposalsSearched = [];
	      	_oldProposalsSearched.forEach(function(proposal){
						if (_searchTerm == proposal['category'] || _searchTerm == proposal['name'] || _searchTerm == proposal['responsible'] || _searchTerm == proposal['title']) _proposalsSearched.push(proposal);
						else {
							['title', 'description', 'short_description', 'needs', 'sharing'].some(function(field){ 
								if (proposal[field] && proposal[field].toLowerCase().indexOf(_searchTerm.toLowerCase()) > -1){
									_proposalsSearched.push(proposal);   
									return true;
								}   
							});
	      		};
		    	})
		    })
	    }
	    _printTable(_proposalsSearched);
    });

   
		return {
      render: function(){
        return _createdWidget;
      }
	  }
  }

  ns.Widgets.PrintProposalMessage = function(message){

  	var _createdWidget = message.render();

		return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
      }
	  }
  }


  ns.Widgets.Reorder = function(proposalField, field, _proposalsSelected){
  	proposalField.sort(function (a, b) {
  		return a.toLowerCase().localeCompare(b.toLowerCase());
		});
  	var _reordered = [];
  	proposalField.forEach(function(value){
  		_proposalsSelected.forEach(function(proposal){
	  		if (proposal[field] ==  value && $.inArray(proposal,_reordered)==-1){
					_reordered.push(proposal);
				} 
			})
		});
		return {
			render: function(){
				return _reordered;
			}
		}
	}


  ns.Widgets.SendProgram = function (_programArray, selected, columns) {

  	var _programData = [];

  	var _saveProgramArtists = function(_programArray) {
  		_programArray.forEach(function(inputProgram){
	  		var _modified = inputProgram['newProgram'].modifiedCheck();
	  		var _showArray = inputProgram['newProgram'].getVal();	
	  		var _data = {proposal_id: inputProgram['proposalId']};
	  		var _program = [];
	  		if (_modified) {
	  			_showArray.forEach(function(show, index){
	  				_program.push({
	  					place: show['place'],
	  				 	day_time: show['day_time']
	  				});
	  			});
	 				_data['program'] = _program;	
					_programData.push(_data);
				}
		  	inputProgram['newProgram'].resetModifiedCheck();
	  	});
	  	return _programData;
  	}


	  var _saveProgramSpaces = function(_programArray){

  		_programArray.forEach(function(inputProgram){
	  		// var _modified = inputProgram['newProgram'].modifiedCheck();
	  		var _showArray = inputProgram['newProgram'].getVal();	
	  		var _place = inputProgram['place'];
  			_showArray.forEach(function(show){
  				var _check = true;
		  		var _data = {};
  				_programData.some(function(dataSaved){
  					if (dataSaved['proposal_id'] == show['proposal_id']){
  					// 	if (show['day_time'] == false) {
  					// 		dataSaved['program'].push(),
  					// 		_check = false;
  					// 	}
  					// 	else{	
  							dataSaved['program'].push({	place: _place, 	day_time: show['day_time']});
  							_check = false;
  						// }
  						return true;
  					}
  				});
  				if (_check && show['day_time']){
	  				_data['proposal_id'] = show['proposal_id'];
	  				var _program = {
	  					place: _place,
	  				 	day_time: show['day_time']
	  				}
	  				_data['program'] = [_program];
	  			}
	  			else if (_check && !(show['day_time'])){
	  				_data['proposal_id'] = show['proposal_id'];
	  				_data['program'] = [];
	  			}
					if (!(jQuery.isEmptyObject(_data))) _programData.push(_data);
  			});			
	  	});
	  	return _programData;
	  }

	  var _programsFunc = {
	  	artist: _saveProgramArtists,
	  	space: _saveProgramSpaces
	  }

		var _programSaved = _programsFunc[selected](_programArray);

		Pard.Backend.program('conFusion', _programSaved, Pard.Events.SaveProgram);

		Pard.ProposalsManager.modifyProposals(_programSaved);
		Pard.Widgets.CreateTable(columns, selected);	

  }
  

  ns.Widgets.DayTime = function(){

    var _sat = [];
    var _onlySun = [];
    var _sunAfterSat = [];

    var _sat10am = new Date (2016,9,15,10,00,00,0);
    var _sat2345pm = new Date (2016,9,15,23,45,00,0);
    var _sun10am = new Date (2016,9,16,10,00,00,0);
    var _sun2345pm = new Date (2016,9,16,23,45,00,0);
    var _satArray = [_sat10am];
    var _sunArray = [_sun10am];


    function addMinutes(date, minutes) {
     return new Date(date.getTime() + minutes*60000);
    }

    while(_satArray[_satArray.length -1].getTime() != _sat2345pm.getTime()){
      _sat.push({id:_satArray.length, text:moment(_satArray[_satArray.length -1]).format('dddd, h:mm')+"h"});
      _satArray.push(addMinutes(_satArray[_satArray.length -1], 15));	
    }

    while(_sunArray[_sunArray.length -1].getTime() != _sun2345pm.getTime()){
      _onlySun.push({id:_sunArray.length, text:moment(_sunArray[_sunArray.length -1]).format('dddd, h:mm')+"h"});
      _sunAfterSat.push({id:_sunArray.length + _satArray.length, text:moment(_sunArray[_sunArray.length -1]).format('dddd, h:mm')+"h"});
      _sunArray.push(addMinutes(_sunArray[_sunArray.length -1], 15));
    }

    return {
      render: function(availability){
  	    var _dayTime = [{id: '',text: ''},{id: 0, text: 'A lo largo de los dos dias'}];
		    var _dtArray = ['both'];
		    var _length = 0;
      	for (var day in availability){
      		_length = _length + 1; 
      	}
      	if (_length == 1){     
          switch(availability[0]) {
            case 'Sat Oct 15 2016 12:00:00 GMT+0200 (CEST)':  
              _dtArray = _dtArray.concat(_satArray);
              _dayTime = _dayTime.concat(_sat);
            break;
            case 'Sun Oct 16 2016 12:00:00 GMT+0200 (CEST)':
              _dtArray = _dtArray.concat(_sunArray);
              _dayTime = _dayTime.concat(_onlySun);
            break;
          }
        }else{
        	_dtArray = _dtArray.concat(_satArray);
        	_dtArray = _dtArray.concat(_sunArray);
          _dayTime = _dayTime.concat(_sat);
          _dayTime = _dayTime.concat(_sunAfterSat);          
        }

        var _dayTimeObj = {
        	dtArray: _dtArray,
        	dayTime: _dayTime
        }  

      	return _dayTimeObj;
      }
	  }
	}






}(Pard || {}));
