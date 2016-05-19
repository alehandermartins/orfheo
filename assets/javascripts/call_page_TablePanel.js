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
			if(!($('#profilesPanel').html())) $('#profilesPanel').append(Pard.Widgets.ProposalsPanelContent(call).render());
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

  	var _typesSelectorBox = $('<div>').addClass('types-selector-call-manager');
    var _contentBox = $('<div>');

    var _programAllCheckbox = $('<div>');

    var _types = ['artist', 'space'];  
    var _labelTypes = [];
    _types.forEach(function(type){
    	_labelTypes.push(Pard.Widgets.Dictionary(type).render());
    });

    var _selectorCallback = function(){
    	_contentBox.empty();
    	var _selected = $(this).val();
    	_contentBox.append(Pard.Widgets.CallManagerContent(_selected, _programAllCheckbox).render());
    }

    var _typesSelector = Pard.Widgets.Selector(_labelTypes, _types, _selectorCallback).render();

    var _preSelected = 'artist';

   	_contentBox.append(Pard.Widgets.CallManagerContent(_preSelected, _programAllCheckbox).render());

		_typesSelectorBox.append(_typesSelector);  

    _createdWidget.append(_typesSelectorBox, _programAllCheckbox, _contentBox);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }



  ns.Widgets.CallManagerContent = function(selected, programAllCheckbox){
  	
  	var _createdWidget = $('<div>');

  	var _showHideTable = function(columns, rows){
	   	if (columns.length) _tableBox.addClass('table-box-proposal-manager');
	   	else _tableBox.removeClass('table-box-proposal-manager');
	   	_matrix.forEach(function(row, i){
	   		row.forEach(function(col, j){
	   			if (rows.indexOf(i) > -1 && columns.indexOf(j) > -1) col.show();
	   			else col.hide();
	   		})
	   	})
  	}

    var _outerTableContainer = $('<div>');

   	var _submitBtnOuterContainer = $('<div>').addClass('submit-btn-outer-container-call-manager');

   	var _tableBox = $('<div>');
   	var _table = Pard.Widgets.CreateTable(selected, _submitBtnOuterContainer);

   	var _matrix = _table.getMatrix();

   	var _titleColCallback = function(field){
   		var _proposalsSelectedReordered = Pard.Widgets.Reorder(field, selected).render();
   		_tableBox.empty();
   		_table =  Pard.Widgets.CreateTable(selected, _submitBtnOuterContainer, _proposalsSelectedReordered);
   		_matrix = _table.getMatrix();
   		_tableBox.append(_table.render());
			_showHideTable(_checkBoxesBox.getVal(), _searchInput.getVal());
   		_table.setTitleColCallback(function(field){
   			_titleColCallback(field);
   		});   		
   	}

   	_table.setTitleColCallback(function(field){
   		_titleColCallback(field);
   	});


   	var  _searchInputContainer = $('<div>').addClass('search-input-call-manager-container');

	  var _searchInput = Pard.Widgets.SearchInputCallManager(selected);

	  _searchInput.setCallback(function(){_showHideTable(_checkBoxesBox.getVal(), _searchInput.getVal())});

	  var _checkBoxesBox = Pard.Widgets.PrintCheckBoxes(programAllCheckbox, selected, _submitBtnOuterContainer);

	  _checkBoxesBox.setCallback(function(){_showHideTable(_checkBoxesBox.getVal(), _searchInput.getVal())});

    _createdWidget.append(_checkBoxesBox.render(), _outerTableContainer.append(_searchInputContainer.append(_searchInput.render()), _tableBox.append(_table.render()), _submitBtnOuterContainer));

    _showHideTable([],[]);

    _submitBtnOuterContainer.hide();

		return {
      render: function(){
        return _createdWidget;
      }
	  }
  }


  ns.Widgets.Reorder = function(field, selected){
  	var proposals = Pard.CachedProposals;
  	var _proposalsSelected = [];
  	proposals.forEach(function(proposal){
  		if(proposal.type == selected) _proposalsSelected.push(proposal);
  	})

  	_proposalsSelected.sort(function (a, b) {
  		return a[field].toLowerCase().localeCompare(b[field].toLowerCase());
		});

		return {
			render: function(){
				return _proposalsSelected;
			}
		}
	}


  ns.Widgets.PrintCheckBoxes = function(programAllCheckbox, selected,_submitBtnOuterContainer) {
  	programAllCheckbox.empty();

  	var _checkBoxesBox = $('<div>');
    var _checkBoxes = [];

    var _fields = {
  		space: ['link_orfheo', 'name','category','responsible', 'email', 'phone','address','description', 'own', 'sharing', 'un_wanted','availability','amend'],
  		artist: ['link_orfheo', 'name','category','email', 'phone','title','short_description','description', 'duration','components', 'meters', 'children', 'repeat', 'waiting_list','needs','sharing','availability', 'amend']
  	}

  	var _createTable = function(){};

  	var _getColumns = function(){ 
	  	var _columns = [];
	  	_submitBtnOuterContainer.hide();
			_checkBoxes.forEach(function(elem){
				if (elem[1] === 'program'){
					_columns.push(_fields[selected].length);
					_submitBtnOuterContainer.show(); 			
				}
				else if (elem[0].getVal()) {
					var index = _fields[selected].indexOf(elem[1]);
					_columns.push(index);
				}				
	  	})
	  	return _columns;
	  }


  	var _printCheckBoxes = function(){
  	_checkBoxes = [];
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

    var _allCheckBoxes = Pard.Widgets.CheckBox('Todos los campos','all');
  	var _allCheckBoxesRendered = _allCheckBoxes.render().addClass('checkBox-call-manager');

    _allCheckBoxesRendered.change(function(){
    	_checkBoxesBox.empty();
    	_printCheckBoxes();
    	_programCheckBox.setVal(false);
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
    	_allCheckBoxes.setVal(false);
    	var _val = _programCheckBox.getVal();
    	_checkBoxes.forEach(function(elem){
    		['link_orfheo', 'name', 'title'].forEach(function(field){
    			if (elem[1] == field) elem[0].setVal(_val);
    		}) 
    })
    	if (_val){
	    	_checkBoxes.push([true, 'program']);
    	}
   		_createTable();
    })

    programAllCheckbox.empty();
    programAllCheckbox.append(_allCheckBoxesRendered, _programCheckBoxRendered).addClass('program-all-checkbox-container');

    return {
	  	render: function(){
	  		return _checkBoxesBox;
	  	},
	  	getVal: function(){
	  		return _getColumns();
	  	}, 
	  	setCallback: function(callback){
	    		_createTable = callback;
	    }
  	}
  }


  ns.Widgets.CreateTable = function(selected, _submitBtnOuterContainer, proposalsReordered){

  	_submitBtnOuterContainer.empty();

  	var proposals = Pard.CachedProposals;
  	
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
   		if (!(proposalsReordered) && proposal['type'] == selected) {
   			_proposalsSelected.push(proposal);
   		}
   	});

   	if (proposalsReordered) _proposalsSelected = proposalsReordered

		var dayTimeObj = Pard.Widgets.DayTime();

   	var _submitBtnContainer = $('<div>').addClass('submit-btn-call-manager-container');
   	_submitBtnOuterContainer.append(_submitBtnContainer);
   	var _successBox = $('<span>').attr('id','succes-box-call-manager');

   	var _tableCreated = Pard.Widgets.PrintTable(_proposalsSelected, dayTimeObj, _places, _artists, _programs);

  		_submitBtnContainer.empty()
 			var _submitBtn = Pard.Widgets.Button('Guarda los cambios', function(){
			  var _programArray = _tableCreated.getVal();
 				Pard.Widgets.SendProgram(_programArray, selected);
 			});
 			_submitBtnContainer.append(_successBox, _submitBtn.render());

    return {
    	render: function(){
    		return _tableCreated.render()
    	}, 
    	getMatrix: function(){
    		return _tableCreated.getMatrix();
    	},
    	setTitleColCallback: function(callback){
    		_tableCreated.setTitleColCallback(callback);
    	}
    }

  }


  ns.Widgets.SearchInputCallManager = function(selected){

 	  var proposals = Pard.CachedProposals;

 	  var _searchTags = [{id:'', text:''}];

    var _proposalsSelected = [];

		var _namesAdded = [];
		var _categoryAdded = [];
		var _respAdded = [];
		var _titlesAdded = [];

  	proposals.forEach(function(proposal){
   		if (proposal['type'] == selected) {
   			_proposalsSelected.push(proposal);

  			if ($.inArray(proposal['category'],_categoryAdded) < 0){
  				_searchTags.push({id: proposal['category'], text: Pard.Widgets.Dictionary(proposal['category']).render()});
  				_categoryAdded.push(proposal['category']);
  			}
  			if ($.inArray(proposal['name'],_namesAdded) < 0){
  				_searchTags.push({id: proposal['name'], text: proposal['name']});
  				_namesAdded.push(proposal['name']);
  			}
  			if (selected == 'space' && $.inArray(proposal['responsible'],_respAdded) < 0) {
  				_searchTags.push({id: proposal['responsible'], text: proposal['responsible']});
  				_respAdded.push(proposal['responsible']);
  			}
  			if (selected == 'artist' && $.inArray(proposal['responsible'],_titlesAdded) < 0)  {
  				_searchTags.push({id: proposal['title'], text: proposal['title']});
  				_titlesAdded.push(proposal['title']); 
  			}
   		}
   	});

		var dayTimeObj = Pard.Widgets.DayTime();

	  var _proposalsSearched = _proposalsSelected;

  	var _createdWidget = $('<div>');

   	var _searchInput = $('<select>');

  	_createdWidget.append(_searchInput);

	  _searchInput.select2({
      data: _searchTags,
      multiple:true,
      placeholder: 'Busca',
      tags: true,
      tokenSeparators: [',', ' '],   
    });

	  var _filterPropoposals = function(){
	    var _searchTerms = _searchInput.val();
      if (_searchTerms){
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
	    else{
	    	_proposalsSearched = _proposalsSelected;
	    }
    	var _indexProposal = [0];
	    _proposalsSearched.forEach(function(propSearched){
	    	var position = _proposalsSelected.indexOf(propSearched) +1;
	    	_indexProposal.push(position);
	    });
	    return _indexProposal;
	  }

    return {
    	render: function(){
    		return _createdWidget;
    	},
    	getVal: function(){
    		return _filterPropoposals();
    	}, 
    	setCallback: function(callback){
			 	_searchInput.on('change', function() {
	    		callback();
	    	});
    	}
    }
  }



  ns.Widgets.PrintTable = function(proposalsSelected, dayTimeObj, places, _artists, _programs) {

  	var _fields = {
  		space: ['link_orfheo','name','category','responsible', 'email', 'phone','address','description', 'own', 'sharing', 'un_wanted','availability','amend', 'program'],
  		artist: ['link_orfheo', 'name','category','email', 'phone','title','short_description','description', 'duration','components', 'meters', 'children', 'repeat', 'waiting_list','needs','sharing','availability', 'amend', 'program']
  	}

  	var columns = _fields[proposalsSelected[0].type];

  	var _cols = [];
  	var _matrix = [];

   	var _tableCreated = $('<table>').addClass('table-proposal');
   	var _programArray = [];

   	var reorder = function(colNum){};

   	var _printTable = function(proposalsSelected){
	
  	var _thead = $('<thead>');
  	var _titleRow = $('<tr>').addClass('title-row-table-proposal');

  	columns.forEach(function(field, colNum){
  		if (field == 'link_orfheo'){ 
	  		var _titleText = $('<span>').html('rfh');
	  		var _titleCol = $('<th>').append(_titleText);
	  		_titleRow.append(_titleCol.addClass('icon-column-call-table'));
  		}
  		else{
	  		var _titleText = $('<span>').html(Pard.Widgets.Dictionary(field).render());
	  		var _titleCol = $('<th>').append(_titleText);
	  		if (['availability', 'program'].indexOf(field)<0){
		  		_titleText.click(function(){ 
		  			// var _proposalsReordered = Pard.Widgets.Reorder(_proposalField,field, proposalsSelected).render();
		  			// _tableCreated.empty();
		  			// _printTable(_proposalsReordered);
		  			reorder(field);
		  		});
		  		_titleText.addClass('title-colText-call-manager');
		  		_titleText.append($('<span>').html('&#xE5C5').addClass('material-icons').css('vertical-align','middle'))
		  	}
	  	}
  		_titleRow.append(_titleCol);
  		_cols.push(_titleCol);
  	});

 		_matrix.push(_cols);
 		_cols = [];

  	_tableCreated.append(_thead.append(_titleRow));

  	_programArray = [];
  	var _tbody = $('<tbody>');

  	proposalsSelected.forEach(function(proposal){
  		var _row = $('<tr>');
  		columns.forEach(function(field){
  			var _colClass = 'column-'+field;
  			var _col = $('<td>').addClass('column-call-manager-table')
  			_col.addClass(_colClass);
  			if (field == 'link_orfheo'){
  				var _icon = $('<a>').append(Pard.Widgets.IconManager(proposal['type']).render());
  				_icon.attr({'href': '/profile?id=' + proposal['profile_id'], 'target':'_blank'});
  				_col.append(_icon);
  			}
  			else if (field == 'name'){
  				var _namePopupCaller = $('<a>').attr({'href':'#'}).text(proposal['name']);
  				var _form;
  				if (proposal.type == 'artist') {_form = Pard.Forms.ArtistCall(proposal.category);
  					  	;}			
  				else _form = Pard.Forms.SpaceCall();

				 var _popup = Pard.Widgets.PopupCreator(_namePopupCaller, 'conFusión 2016', function(){return Pard.Widgets.PrintProposalMessage(Pard.Widgets.PrintProposal(proposal, _form.render()))});

				 _col.append(_popup.render());

  			}
  			else if (field == 'address'){
  				var _fieldFormText = ' '+proposal['address']['route']+' '+proposal['address']['street_number'];
    			if (proposal['door']) _fieldFormText += ', puerta/piso '+proposal['door'];
   				_fieldFormText +=', '+proposal['address']['locality'];
   				var _aStr = proposal['address']['route']+' '+proposal['address']['street_number']+', '+proposal['address']['locality']+' '+proposal['address']['country'];
  				var _address = $('<a>').attr({
			      href: 'http://maps.google.com/maps?q='+_aStr,
			      target: '_blank'
			    }).text(_fieldFormText);
				 	_col.append(_address);
  			}
  			else if (field == 'program') {
  				  if (proposal['type'] == 'artist') {
							var _inputProgram = Pard.Widgets.InputArtistProgram(places, dayTimeObj.render(proposal['availability']));
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
  				for (var date in proposal[field]) {
	  				_col.append($('<div>').append(Pard.Widgets.AvailabilityDictionary(proposal[field][date])));
  				}
  			}
  			else	if (proposal[field] && $.inArray(field,['children', 'waiting_list','repeat'])>-1) {
  				if (proposal[field] == 'true') {_col.html('Sí');}
  				else if (proposal[field] == 'false') { _col.html('No');}
  				else { var _col = $('<td>').html(proposal[field]);}
  			}
  			else	if (proposal[field] && field == 'category'){
  				_col.html(Pard.Widgets.Dictionary(proposal[field]).render());
  			}
  			else	if (proposal[field]) {
  				_col.html(proposal[field]);
  			}
  			else{
  				_col.html('');
  			}
  			_row.append(_col);
  			_cols.push(_col);
  		});

  		_tbody.append(_row);
  		_matrix.push(_cols);
  		_cols = [];

  	})

  	_tableCreated.append(_tbody);
  	}

  	_printTable(proposalsSelected);

		return{
			render: function(){
				return _tableCreated;
			},
			getVal: function(){
				return _programArray;
			},
			getMatrix: function(){
				return _matrix;
			},
			setTitleColCallback: function(callback){
				reorder = callback;
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




  ns.Widgets.SendProgram = function (_programArray, selected) {

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
	  		var _showArray = inputProgram['newProgram'].getVal();	
	  		var _place = inputProgram['place'];
  			_showArray.forEach(function(show){
  				var _check = true;
		  		var _data = {};
  				_programData.some(function(dataSaved){
  					if (dataSaved['proposal_id'] == show['proposal_id']){
  							if (show['day_time'] != false) dataSaved['program'].push({	place: _place, 	day_time: show['day_time']});
  							_check = false;
  						return true;
  					}
  				});
  				if (_check && show['day_time'] != false){
	  				_data['proposal_id'] = show['proposal_id'];
	  				var _program = {
	  					place: _place,
	  				 	day_time: show['day_time']
	  				}
	  				_data['program'] = [_program];
	  			}
	  			else if (_check && show['day_time'] == false){
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
		// Pard.Widgets.CreateTable(columns, selected, _tableBox, _submitBtnOuterContainer);	

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
      _sat.push({id:_satArray.length, text:moment(_satArray[_satArray.length -1]).locale("es").format('dddd, HH:mm')+"h"});
      _satArray.push(addMinutes(_satArray[_satArray.length -1], 15));	
    }

    while(_sunArray[_sunArray.length -1].getTime() != _sun2345pm.getTime()){
      _onlySun.push({id:_sunArray.length, text:moment(_sunArray[_sunArray.length -1]).locale("es").format('dddd, HH:mm')+"h"});
      _sunAfterSat.push({id:_sunArray.length + _satArray.length, text:moment(_sunArray[_sunArray.length -1]).locale("es").format('dddd, HH:mm')+"h"});
      _sunArray.push(addMinutes(_sunArray[_sunArray.length -1], 15));
    }

    return {
      render: function(availability){
  	    var _dayTime = [{id: '',text: ''},{id: 0, text: 'Los dos dias'}];
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