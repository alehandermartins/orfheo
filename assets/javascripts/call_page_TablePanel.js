'use strict';

(function(ns){

  ns.Widgets.CallMainLayout = function(call){
  	var _main = $('<main>').addClass('main-call-page');
    var _mainLarge = $('<section>').addClass('pard-grid call-section');

    var _title = $('<h4>').text('Gestiona la Convocatoria').css({'margin-top':'3rem', 'margin-bottom':'3rem'});

    var _tabs = $('<ul>').addClass('menu simple tabs-menu switcher-menu-call-page');
  	var _tableTabTitle =	$('<a>').attr({href: "#"}).text('Tabla');
  	var _tableTab = $('<li>').append(_tableTabTitle);
  	_tableTab.one('click',function(){
			$('#tablePanel').append(Pard.Widgets.TablePanelContent(call).render());
		});
  	_tableTab.click(function(){
			$('.tab-selected').removeClass('tab-selected');
			$(this).addClass('tab-selected');
			_tabShowHide('tablePanel');
		});

  	var _proposalsTabTitle =	$('<a>').attr({href: "#"}).text('Propuestas');
  	var _proposalsTab = $('<li>').addClass('tabs-title is-active').append(_proposalsTabTitle);
  	_proposalsTab.one('click',function(){
			$('#proposalsPanel').append(Pard.Widgets.ProposalsPanelContent(call).render());
		});
		_proposalsTab.click(function(){
			$('.tab-selected').removeClass('tab-selected');
			$(this).addClass('tab-selected');
			_tabShowHide('proposalsPanel');
		});
		
    var _programTabTitle =  $('<a>').attr({href: "#"}).text('Programa');
    var _programTab = $('<li>').append(_programTabTitle);
    _programTab.one('click',function(){
			$('#programPanel').append(Pard.Widgets.ProgramManager(call).render());
    });
    _programTab.click(function(){
			$('.tab-selected').removeClass('tab-selected');
			$(this).addClass('tab-selected');
			_tabShowHide('programPanel');
		});
  		
  	_tabs.append(
  		_tableTab, 
  		_proposalsTab,
  		_programTab
  	);

  	var _tabShowHide = function(id_selected){
  		_panelShown.hide();
  		// var _selected = '#'+id_selected;
  		_panelShown = $('#'+id_selected);
  		_panelShown.show();

  	}

  	var _tablePanel = $('<div>').attr('id', 'tablePanel');
		var _proposalsPanel = $('<div>').attr('id', 'proposalsPanel');
    var _programPanel = $('<div>').attr('id', 'programPanel');

		// var _panelShown = _tablePanel;
    var _panelShown = _programPanel;
 

		$(document).ready(function(){
			// _tableTab.trigger('click')
      _programTab.trigger('click')
		});

    _mainLarge.append( _tabs, _title, _tablePanel, _proposalsPanel, _programPanel);
    _main.append(_mainLarge);

  	return {
      render: function(){
        return _main;
      }
    }
  }


  ns.Widgets.TablePanelContent = function(){

  	var _createdWidget = $('<div>').css('position','relative');

  	var _typesSelectorBox = $('<div>').addClass('types-selector-call-manager');
    var _contentBoxArtists = $('<div>').addClass('content-box-ArtistSpace');

    var _contentBoxSpaces = $('<div>').addClass('content-box-ArtistSpace');

    var _types = ['artist', 'space'];  
    var _tagsTypes = [];
    _types.forEach(function(type){
    	_tagsTypes.push({id: type, text:Pard.Widgets.Dictionary(type).render()});
    });

    var _cat = {
      space: _contentBoxSpaces,
      artist: _contentBoxArtists
    }

    var proposals = Pard.CachedProposals;

    var _proposalsSelected = {};
    var _categories ={};
    _types.forEach(function(type){
      _categories[type] = [];
      _proposalsSelected[type] = [];
    });

    proposals.forEach(function(proposal){
      _types.forEach(function(type){
        if (proposal.type == type && $.inArray(proposal.category, _categories[type])<0) _categories[type].push(proposal.category);
        if (proposal.type == type) {
          _proposalsSelected[type].push(proposal);
        }
      })
    });

    _showHide = function(selected){
      _shown.hide();
      _shown = _cat[selected];
      _shown.show();
      if (selected == 'space' && !(_contentBoxSpaces.html())){
        var spinner =  new Spinner().spin();
        $.wait(
          '', 
          function(){
            _contentBoxSpaces.append(spinner.el);
          }, 
          function(){
            setTimeout(function(){
              var _appendAndStopSpinner = function(stopSpinner){ 
                _contentBoxSpaces.append(Pard.Widgets.CallManagerContent(_proposalsSelected['space'], _categories['space']).render());
                stopSpinner();
              }
              _appendAndStopSpinner(function(){spinner.stop()});
            },0)
          }
        );
      }
    }

    var _selectorCallback = function(){
      // _contentBox.empty();
      var _selected = $(this).val();
      _showHide(_selected);
    }

    var _typesSelector = $('<select>');

    _contentBoxArtists.append(Pard.Widgets.CallManagerContent(_proposalsSelected['artist'], _categories['artist']).render());

    _contentBoxSpaces.hide();
    var _shown = _contentBoxArtists;

		_typesSelectorBox.append(_typesSelector);  

    _createdWidget.append(_typesSelectorBox, _contentBoxArtists, _contentBoxSpaces);

    _typesSelector.select2({
      data: _tagsTypes,
      minimumResultsForSearch: -1
    });

    _typesSelector.on('select2:select', function(){
      var _selected = _typesSelector.select2('data')[0].id;
      _showHide(_selected);
      // function(){_selectorCallback()
    });

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }



  ns.Widgets.CallManagerContent = function(proposalsSelected, categories){
  	
    var _selected = proposalsSelected[0].type;

    var _shownColumns = {
      space: ['link_orfheo','name','category','address'],
      artist: ['link_orfheo','name','category','title','short_description']
    }
    // var _checkBoxes = [];
    // var _checkBoxesRendered = [];

    var _fields = {
      space: ['link_orfheo', 'name','category','responsible','address','description', 'own', 'sharing', 'un_wanted','availability', 'email', 'phone','amend'],
      artist: ['link_orfheo', 'name','category','title','short_description','description', 'duration','components', 'meters', 'children', 'repeat', 'waiting_list','needs','sharing','availability','email', 'phone', 'amend']
    }

    var _titleFile = {
      artist: 'Tabla_artistas',
      space: 'Tabla_espacios'
    }

  	var _createdWidget = $('<div>');

    var _table = Pard.Widgets.PrintTable(proposalsSelected, _fields[_selected]);

    var _outerTableContainer = $('<div>');

     var _filterCategoryContainer = $('<div>').addClass('select-category-container-call-manager');

    var _filterCategory = $('<select>');
     var _searchTags = [{id:'all', 'text':'Todas las categorias'}];
    categories.forEach(function(cat){
      _searchTags.push({id:cat, text: Pard.Widgets.Dictionary(cat).render(), icon: cat});
    });  

   	var _tableBox = $('<div>').addClass('table-box-call-manager-page');

	  var _checkBoxesBox = Pard.Widgets.PrintCheckBoxes(_fields[_selected], _shownColumns[_selected]);

    var _tableRendered = _table.render();

    _createdWidget.append(_filterCategoryContainer.append(_filterCategory), _checkBoxesBox.render(), _outerTableContainer.append(_tableBox.append(_tableRendered)));

    function formatResource (resource) {
      var _label = $('<span>').text(resource.text);
      if(resource.icon){
        var _icon = Pard.Widgets.IconManager(resource.icon).render();
        _label.append(_icon);
        _icon.css({
          // position: 'relative',
          'margin-left': '0.5rem',
          'vertical-align':'middle'
          // top: '5px'
        });
      }
      return _label;
    };

    _filterCategory.select2({
      data: _searchTags,
      templateResult: formatResource
      // ,templateSelection: formatResource
    });


    $(document).ready(function() {

      var _hiddenColumnsArray=[];
      _fields[_selected].forEach(function(field, colNum){
        if($.inArray(field,_shownColumns[_selected])<0) _hiddenColumnsArray.push(colNum);
      });
      // _hiddenColumnsArray.push(_fields[selected].length);
      var _dataTable = _tableRendered.DataTable({
        "language":{
        "lengthMenu": " Resultados por página _MENU_",
        "zeroRecords": "Ningún resultado",
        "info": "",
        "infoEmpty": "Ningúna información disponible",
        "infoFiltered": "(filtered from _MAX_ total records)",
        "search": "Busca",
        "paginate": {
          "first":      "Primera",
          "last":       "Última",
          "next":       "Siguiente",
          "previous":   "Anterior"
        },
       "search": "_INPUT_",
        "searchPlaceholder": "Busca"
      },
      fixedHeader: {
        header: true
      },
      "scrollX": true,
      "scrollY": "90vh",
      "paging": false,
      "scrollCollapse": true,
      // 'responsive': true,
      // 'colReorder': true,
      "columnDefs": [
        { "visible": false, "targets": _hiddenColumnsArray }
        ],
      // keys: true,
      dom: 'Bfrtip',
      buttons: [
        {
            extend: 'copy',
            text: 'Copia',
            exportOptions: {
                columns: ':visible'
            }
        },
        {
          extend: 'excel',
          exportOptions: {
              columns: ':visible'
          },
          filename: _titleFile[_selected]

        },
        // {
        //   extend: 'pdf',
        //   exportOptions: {
        //       columns: ':visible'
        //   },
        //   orientation: 'landscape',
        //   filename: _titleFile[_selected]
        // }
        // {
        //   extend: 'print',
        //   text: 'Imprime',
        //   exportOptions: {
        //     modifier: {
        //         page: 'current'
        //     }
        //   },
        //   title: _titleFile[_selected]
        // }
      ]
      });

      // _checkBoxesRendered[0].prop('checked', true)
      // _checkBoxesRendered[0].trigger('click');


      // _fields[selected].forEach(function(field, colNum){
      //   if(field == 'name' || field == 'link_orfheo') _table.column(colNum).visible(true);
      //   else _table.column(colNum).visible(false);
      // });
      // _table.column(_fields[selected].length).visible(false);
      _dataTable.columns.adjust().draw(true);

      _filterCategory.on('select2:select',function(){
      var _cat =  _filterCategory.select2('data')[0];
      if (_cat.id == 'all') _dataTable.columns( 2 ).search('').draw();
      else _dataTable.columns( 2 ).search(_cat.text).draw();
    });

       _checkBoxesBox.setCallback(_dataTable);
    });

		return {
      render: function(){
        return _createdWidget;
      }
	  }
  }


  ns.Widgets.PrintCheckBoxes = function(_fields, _shownColumns) {

    var _createdWidget = $('<div>');

  	var _checkBoxesBox = $('<div>');

    var  _allCheckBoxesBox = $('<div>').addClass('allCheckBoxesBox');

    var _checkBoxesField = [];

  	var _table;

  	var _printCheckBoxes = function(columnShown){
  	_checkBoxesField = [];
    _fields.forEach(function(field, columnNum){
    	var _checkBox = Pard.Widgets.CheckBox(Pard.Widgets.Dictionary(field).render(),false);
      _checkBoxesField.push(field);
    	var _checkBoxRendered = _checkBox.render().addClass('checkBox-call-manager');
    	_checkBoxRendered.click(function(){
        var column = _table.column(columnNum);
        column.visible( _checkBox.getVal() );
        } );
       // _checkBoxesRendered.push(_checkBoxRendered);
       // _checkBoxes.push(_checkBox);
    	if ($.inArray(field,columnShown)>-1) {
        _checkBox.setVal(true);
      }
      else {
        _checkBox.setVal(false);
      };
      if (_table) _table.column(columnNum).visible( _checkBox.getVal() );

    	_checkBox.labelToggle(); 	
    
    	_checkBoxesBox.append(_checkBoxRendered);

    });
  	}

  	_printCheckBoxes(_shownColumns);

    var _allCheckBoxes = Pard.Widgets.CheckBox('Todos los campos','all');
  	var _allCheckBoxesRendered = _allCheckBoxes.render().addClass('checkBox-call-manager');

    _allCheckBoxesRendered.click(function(){
      var spinner =  new Spinner().spin();
      _checkBoxesBox.empty();
        $.wait(
          '', 
          function(){
            _checkBoxesBox.append(spinner.el);
          }, 
          function(){
            setTimeout(function(){
              var _appendAndStopSpinner = function(stopSpinner){ 
                var _val = _allCheckBoxes.getVal();
                if (_val) _printCheckBoxes(_checkBoxesField);
                else _printCheckBoxes([]);
                stopSpinner();    
              }
              _appendAndStopSpinner(function(){spinner.stop()});
            },0)
          }
        )
    });

    _allCheckBoxesBox.append(_allCheckBoxesRendered);
    _allCheckBoxes.labelToggle(); 	

    _createdWidget.append(_allCheckBoxesBox, _checkBoxesBox);
   
    return {
	  	render: function(){
	  		return _createdWidget;
	  	},
	  	// getVal: function(){
	  	// 	return _getColumns();
	  	// }, 
	  	setCallback: function(table){
        _table = table;
	      
      }
  	}
  }


  // // ns.Widgets.SearchInputCallManager = function(selected){

 	// //   var proposals = Pard.CachedProposals;

 	// //   var _searchTags = [{id:'', text:''}];

		// // var _namesAdded = [];
		// // var _categoryAdded = [];
		// // var _respAdded = [];
		// // var _titlesAdded = [];

  // // 	proposals.forEach(function(proposal){
  // //  		if (proposal['type'] == selected) {
  // //  			// _proposalsSelected.push(proposal);

  // // 			if ($.inArray(proposal['category'],_categoryAdded) < 0){
  // // 				_searchTags.push({id: proposal['category'], text: Pard.Widgets.Dictionary(proposal['category']).render()});
  // // 				_categoryAdded.push(proposal['category']);
  // // 			}
  // // 			if ($.inArray(proposal['name'],_namesAdded) < 0){
  // // 				_searchTags.push({id: proposal['name'], text: proposal['name']});
  // // 				_namesAdded.push(proposal['name']);
  // // 			}
  // // 			if (selected == 'space' && $.inArray(proposal['responsible'],_respAdded) < 0) {
  // // 				_searchTags.push({id: proposal['responsible'], text: proposal['responsible']});
  // // 				_respAdded.push(proposal['responsible']);
  // // 			}
  // // 			if (selected == 'artist' && $.inArray(proposal['responsible'],_titlesAdded) < 0)  {
  // // 				_searchTags.push({id: proposal['title'], text: proposal['title']});
  // // 				_titlesAdded.push(proposal['title']); 
  // // 			}
  // //  		}
  // //  	});

		// // var dayTimeObj = Pard.Widgets.DayTime();

	 // //  // var _proposalsSearched = _proposalsSelected;

  // // 	var _createdWidget = $('<div>');

  // //  	var _searchInput = $('<select>');

  // // 	_createdWidget.append(_searchInput);

	 // //  _searchInput.select2({
  // //     data: _searchTags,
  // //     multiple:true,
  // //     placeholder: 'Busca',
  // //     tags: true,
  // //     tokenSeparators: [',', ' '],   
  // //   });

	 // //  var _filterPropoposals = function(){
 	// //  	  proposals = Pard.CachedProposals;
	 // //    var _proposalsSelected = [];
	 // //  	proposals.forEach(function(proposal){
  // //  		if (proposal['type'] == selected) {
	 // //   			_proposalsSelected.push(proposal);
	 // //   		}
  // //  		});
	 // //    var _searchTerms = _searchInput.val();
  // //     if (_searchTerms){
	 // //    	var _proposalsSearched = _proposalsSelected;
	 // //    	var _oldProposalsSearched = _proposalsSelected;
	 // //    	_searchTerms.forEach(function(_searchTerm){
		// //     	_oldProposalsSearched = _proposalsSearched;
		// //     	_proposalsSearched = [];
	 // //      	_oldProposalsSearched.forEach(function(proposal){
  // //           if ($.inArray(_searchTerm,_categoryAdded)>-1) {
  // //             if  (_searchTerm == proposal['category'] ) _proposalsSearched.push(proposal);
  // //           }
		// // 				else if (_searchTerm == proposal['name'] || _searchTerm == proposal['responsible'] || _searchTerm == proposal['title']) _proposalsSearched.push(proposal);
		// // 				else {
		// // 					['title', 'description', 'short_description', 'needs', 'sharing'].some(function(field){ 
		// // 						if (proposal[field] && proposal[field].toLowerCase().indexOf(_searchTerm.toLowerCase()) > -1){
		// // 							_proposalsSearched.push(proposal);   
		// // 							return true;
		// // 						}   
		// // 					});
	 // //      		};
		// //     	})
		// //     })
	 // //    }
	 // //    else{
	 // //    	_proposalsSearched = _proposalsSelected;
	 // //    }
  // //   	var _indexProposal = [0];
	 // //    _proposalsSearched.forEach(function(propSearched){
	 // //    	var position = _proposalsSelected.indexOf(propSearched) +1;
	 // //    	_indexProposal.push(position);
	 // //    });
	 // //    return _indexProposal;
	 // //  }

  // //   return {
  // //   	render: function(){
  // //   		return _createdWidget;
  // //   	},
  // //   	getVal: function(){
  // //   		return _filterPropoposals();
  // //   	}, 
  // //   	setCallback: function(callback){
		// // 	 	_searchInput.on('change', function() {
	 // //    		callback();
	 // //    	});
  // //   	},
  // //   	updateDatabase: function(){

  // //   	}
  // //   }
  // // }



  ns.Widgets.PrintTable = function(proposalsSelected, columns) {

   	var _tableCreated = $('<table>').addClass('table-proposal stripe row-border').attr({'cellspacing':"0", 'width':"950px"});

   	var reorder = function(colNum){};

   	var _printTable = function(proposalsSelected){
	
  	var _thead = $('<thead>');
  	var _titleRow = $('<tr>')
    // .addClass('title-row-table-proposal');

  	columns.forEach(function(field, colNum){
  		if (field == 'link_orfheo'){ 
	 		  var _titleCol = $('<th>').text('rfh');
        _titleRow.append(_titleCol);
      }
  		else{
	       var _titleCol = $('<th>').text(Pard.Widgets.Dictionary(field).render());
	 	  	}
      var _class = 'column-'+field;
      _titleCol.addClass('column-call-manager-table');
      _titleCol.addClass(_class);
  		_titleRow.append(_titleCol);
  	});

  	_tableCreated.append(_thead.append(_titleRow));


    var _tfoot = $('<tfoot>');
    // .addClass('tfoot-proposal-table-call-manager');;
    var _titleRowFoot = $('<tr>');
    // .addClass('title-row-table-proposal');

     columns.forEach(function(field, colNum){
      if (field == 'link_orfheo'){ 
        var _titleCol = $('<th>').text('rfh');
        _titleRow.append(_titleCol);
      }
      else{
        var _titleCol = $('<th>').text(Pard.Widgets.Dictionary(field).render());
      }
      _titleRowFoot.append(_titleCol);
    });

    _tableCreated.append(_tfoot.append(_titleRowFoot ));

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
  			else if (proposal[field]) {
	  			if (field == 'name'){
	  				var _namePopupCaller = $('<a>').attr({'href':'#'}).text(proposal['name']);
	  				var _form;
	  				if (proposal.type == 'artist') {_form = Pard.Forms.ArtistCall(proposal.category);
	  					  	;}			
	  				else _form = Pard.Forms.SpaceCall();

					 var _popup = Pard.Widgets.PopupCreator(_namePopupCaller, 'conFusión 2016', function(){return Pard.Widgets.PrintProposalMessage(Pard.Widgets.PrintProposal(proposal, _form.render()))});

					 _col.append(_popup.render());

	  			}
	  			else if ( field == 'address'){
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
	  			else{
	  				_col.html(proposal[field]);
  				}
  			}
  			else{
  				_col.html('');
  			}
  			_row.append(_col);
  			// _cols.push(_col);
  		});

  		_tbody.append(_row);
  		// _matrix.push(_cols);
  		// _cols = [];

  	})

  	_tableCreated.append(_tbody);
  	}

  	_printTable(proposalsSelected);


   
		return{
			render: function(){
				return _tableCreated;
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

    var call = Pard.CachedCalls;
    var _program = [];

  	var _saveProgramArtists = function(_programArray) {
  		_programArray.forEach(function(inputProgram){
	  		var _showArray = inputProgram['newProgram'].getVal();	
   			var _artistProposal_id = inputProgram['proposal_id'];
        var _artistId = inputProgram['profile_id'];
  			_showArray.forEach(function(show){
		  		var _performance = {};
          // _performance['event_id'] = call['event_id'];
          _performance['time'] = [ show['starting_day_time'], show['ending_day_time']];
          _performance['participant_id'] = _artistId;
          _performance['participant_proposal_id'] = _artistProposal_id;
          if (show['profile_id']) _performance['host_id'] = show['profile_id'];
          else  _performance['host_id'] = null;
          _performance['host_proposal_id'] = show['proposal_id']; 
          _program.push(_performance);
        });
      })
      return _program;
    }

	  var _saveProgramSpaces = function(_programArray){

  		_programArray.forEach(function(inputProgram){
	  		var _showArray = inputProgram['newProgram'].getVal();	
	  		var _place = inputProgram['place'];
	  		var _spaceProposal_id = inputProgram['proposal_id'];
  			_showArray.forEach(function(show){
  				var _check = true;
		  		var _data = {};
  				_programData.some(function(dataSaved){
  					if (dataSaved['proposal_id'] == show['proposal_id']){
  							if (show['starting_day_time'] != false) dataSaved['program'].push({	place: _place, 	
  								starting_day_time: show['starting_day_time'], 
  								ending_day_time: show['ending_day_time'],
  								proposal_id: _spaceProposal_id
  							});
  							_check = false;
  						return true;
  					}
  				});
  				if (_check && show['starting_day_time'] != false){
	  				_data['proposal_id'] = show['proposal_id'];
	  				var _program = {
	  					place: _place,
	  				 	starting_day_time: show['starting_day_time'],
							ending_day_time: show['ending_day_time'],
	  				 	proposal_id: _spaceProposal_id
	  				}
	  				_data['program'] = [_program];
	  			}
	  			else if (_check && show['starting_day_time'] == false){
	  				_data['proposal_id'] = show['proposal_id'];
	  				_data['program'] = [];
	  			}
					if (!(jQuery.isEmptyObject(_data))) _programData.push(_data);
  			});			
	  	

				var _dataSpace = {proposal_id: _spaceProposal_id};
	  		var _programSpace = [];
	  		// if (_modified) {
 	
	  		_showArray.forEach(function(show){
			  	if (show['starting_day_time']){
	  				_programSpace.push({
	  				 	starting_day_time: show['starting_day_time'],
	  				 	ending_day_time: show['ending_day_time'],
	  				 	proposal_id: show['proposal_id']
	  				});
	  			}
	  		});
  			
  			_dataSpace['program'] = _programSpace;

				_programData.push(_dataSpace);

	  	});

	  	return _programData;
	  }

	  var _programsFunc = {
	  	artist: _saveProgramArtists,
	  	space: _saveProgramSpaces
	  }

		var _programSaved = _programsFunc[selected](_programArray);

    console.log(_programSaved);
    console.log(call.event_id);

		Pard.Backend.program(call.event_id, _programSaved, Pard.Events.SaveProgram);

		Pard.ProposalsManager.modifyProposals(_programSaved);	

  }
  

	ns.Widgets.DayTime = function(){

    var _sat = [];
    var _sun = [];
    var _sunAfterSat = [];

    var _sat10am = new Date (2016,9,15,10,00,00,0);
    var _sat2345pm = new Date (2016,9,15,23,45,00,0);
    var _sun10am = new Date (2016,9,16,10,00,00,0);
    var _sun2345pm = new Date (2016,9,16,23,45,00,0);

    _sat10am = _sat10am.getTime();
    _sat2345pm = _sat2345pm.getTime();
    _sun10am = _sun10am.getTime();
    _sun2345pm = _sun2345pm.getTime();

    var _satArray = [_sat10am];
    var _sunArray = [_sun10am];


    function addMinutes(date, minutes) {
     return (date + minutes*60000);
    }



    while(_satArray[_satArray.length -1] != _sat2345pm){
      _sat.push({
      	id:_satArray[_satArray.length -1], 
      	text:moment(new Date (_satArray[_satArray.length -1])).locale("es").format('dddd, HH:mm')+"h"
      });
      _satArray.push(addMinutes(_satArray[_satArray.length -1], 15));	
    }

    while(_sunArray[_sunArray.length -1] != _sun2345pm){
      _sun.push({
      	id: _sunArray[_sunArray.length -1], 
      	text:moment(new Date (_sunArray[_sunArray.length -1])).locale("es").format('dddd, HH:mm')+"h"
      });
      // _sunAfterSat.push({id: _sunArray.length + _satArray.length, text:moment(_sunArray[_sunArray.length -1]).locale("es").format('dddd, HH:mm')+"h"});
      _sunArray.push(addMinutes(_sunArray[_sunArray.length -1], 15));
    }

    return {
      render: function(availability){
  	    var _dayTime = [{id: '',text: ''},{id: 'permanent', text: 'Los dos dias'}];
  	    if (availability){
  		    var _length = 0;
        	for (var day in availability){
        		_length = _length + 1; 
        	}
        	if (_length == 1){     
            switch(new Date(availability[0]).getDate()) {
              case 15:  
              	_dayTime.push({id: 'day_1', text:'sábado'});
                _dayTime = _dayTime.concat(_sat);
              break;
              case 16:
              	_dayTime.push({id: 'day_2', text:'domingo'});         
                _dayTime = _dayTime.concat(_sun);
              break;
            }
          }else{
          	_dayTime.push({id: 'day_1', text:'sábado'});
          	_dayTime.push({id: 'day_2', text:'domingo'});          	
            _dayTime = _dayTime.concat(_sat);
            _dayTime = _dayTime.concat(_sun);          
          }
        }

        // var _dayTimeObj = {
        // 	dtArray: _dtArray,
        // 	dayTime: _dayTime
        // }  

      	return _dayTime;
      }
	  }
	}

}(Pard || {}));




