'use strict';

(function(ns){

  ns.Widgets.CallMainLayout = function(call){
  	var _main = $('<main>').addClass('main-call-page');
    var _mainLarge = $('<section>').addClass('pard-grid call-section');

    var _title = $('<h4>').text('Gestiona la Convocatoria').css({'margin-top':'3rem', 'margin-bottom':'3rem'});

    var _tabs = $('<ul>').addClass('menu simple tabs-menu switcher-menu-call-page');
  	var _tableTabTitle =	$('<a>').attr({href: "#"}).text('Tabla y Programa');
  	var _tableTab = $('<li>').append(_tableTabTitle);
  	_tableTab.one('click',function(){
			$('#tablePanel').append(Pard.Widgets.TablePanelContent(call).render());
		});
  	_tableTab.click(function(){
			$('.tab-selected').removeClass('tab-selected');
			$(this).addClass('tab-selected');
			_tabShowHide('tablePanel');
		});

  	var _profilesTabTitle =	$('<a>').attr({href: "#"}).text('Propuestas');
  	var _profilesTab = $('<li>').addClass('tabs-title is-active').append(_profilesTabTitle);
  	_profilesTab.one('click',function(){
			$('#proposalsPanel').append(Pard.Widgets.ProposalsPanelContent(call).render());
		});
		_profilesTab.click(function(){
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
  		_profilesTab,
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

		var _panelShown = _tablePanel;

		$(document).ready(function(){
			_programTabTitle.trigger('click')
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

  	var _createdWidget = $('<div>');

  	var _typesSelectorBox = $('<div>').addClass('types-selector-call-manager');
    var _contentBoxArtists = $('<div>').addClass('content-box-ArtistSpace');

    var _contentBoxSpaces = $('<div>').addClass('content-box-ArtistSpace');

    var _programAllCheckbox = $('<div>');

    var _types = ['artist', 'space'];  
    var _labelTypes = [];
    _types.forEach(function(type){
    	_labelTypes.push(Pard.Widgets.Dictionary(type).render());
    });

    var _cat = {
      space: _contentBoxSpaces,
      artist: _contentBoxArtists
    }

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
                _contentBoxSpaces.append(Pard.Widgets.CallManagerContent('space', _programAllCheckbox).render());
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

    var _typesSelector = Pard.Widgets.Selector(_labelTypes, _types, _selectorCallback).render();

    // var _preSelected = 'artist';

   	// _contentBox.append(Pard.Widgets.CallManagerContent(_preSelected, _programAllCheckbox).render());

    _contentBoxArtists.append(Pard.Widgets.CallManagerContent('artist', _programAllCheckbox).render());

    _contentBoxSpaces.hide();
    var _shown = _contentBoxArtists;

		_typesSelectorBox.append(_typesSelector);  

    _createdWidget.append(_typesSelectorBox, _programAllCheckbox, _contentBoxArtists, _contentBoxSpaces);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }



  ns.Widgets.CallManagerContent = function(selected, programAllCheckbox){
  	
  	var _createdWidget = $('<div>');

  	// var _showHideTable = function(columns, rows){
	  //  	if (columns.length) _tableBox.addClass('table-box-proposal-manager');
	  //  	else _tableBox.removeClass('table-box-proposal-manager');
	  //  	_matrix.forEach(function(row, i){
	  //  		row.forEach(function(col, j){
	  //  			if (rows.indexOf(i) > -1 && columns.indexOf(j) > -1) col.show();
	  //  			// else col.hide();
	  //  		})
	  //  	})
  	// }

    var _outerTableContainer = $('<div>');

   	var _submitBtnOuterContainer = $('<div>').addClass('submit-btn-outer-container-call-manager');

   	var _tableBox = $('<div>');

   	var _table = Pard.Widgets.CreateTable(selected, _submitBtnOuterContainer);
    var _categories = _table.categories();

   // 	var _matrix = _table.getMatrix();

   // 	var  _titleColCallback = function(field, callback){  
   // 		var _proposalsSelectedReordered = Pard.Widgets.Reorder(field, selected).render();
   // 		_table =  Pard.Widgets.CreateTable(selected, _submitBtnOuterContainer, _proposalsSelectedReordered);
   // 		_matrix = _table.getMatrix();
   // 		_tableBox.append(_table.render());
			// _showHideTable(_checkBoxesBox.getVal(), _searchInput.getVal());
   // 		_table.setTitleColCallback(function(field){
   //      var spinner =  new Spinner().spin();
   //      $.wait(
   //        '', 
   //        function(){
   //          _tableBox.empty();  
   //          _tableBox.append(spinner.el); 
   //        }, 
   //        function(){
   //         setTimeout(function(){ _titleColCallback(field, function(){spinner.stop();})},0);
   //        }
   //      )
   //    });
   // 		Pard.CachedProposals = _proposalsSelectedReordered;
   //    callback();

   // 	}


   // 	_table.setTitleColCallback(function(field){
   //    var spinner =  new Spinner().spin();
   //    $.wait(
   //      '', 
   //      function(){
   //        _tableBox.empty();  
   //        _tableBox.append(spinner.el); 
   //      }, 
   //      function(){
   //       setTimeout(function(){ _titleColCallback(field, function(){spinner.stop();})},0);
   //      }
   //    )
   // 	});


   // 	var  _searchInputContainer = $('<div>').addClass('search-input-call-manager-container');

	  // var _searchInput = Pard.Widgets.SearchInputCallManager(selected);

	  // _searchInput.setCallback(function(){
	  // 	_searchInput.updateDatabase();
	  // 	_showHideTable(_checkBoxesBox.getVal(), _searchInput.getVal());
	  // });

	  var _checkBoxesBox = Pard.Widgets.PrintCheckBoxes(programAllCheckbox, selected, _submitBtnOuterContainer, _categories);

	  // _checkBoxesBox.setCallback(function(){
	  // 	_showHideTable(_checkBoxesBox.getVal(), _searchInput.getVal());
	  // });

    var _tableRendered = _table.render();

    _createdWidget.append(_checkBoxesBox.render(), _outerTableContainer.append(_tableBox.append(_tableRendered), _submitBtnOuterContainer));

    // _showHideTable(_checkBoxesBox.getVal(), _searchInput.getVal());

     $(document).ready(function() {

      _checkBoxesBox.setCallback(_tableRendered);
     
    });


    _submitBtnOuterContainer.hide();

		return {
      render: function(){
        return _createdWidget;
      }
	  }
  }


 //  ns.Widgets.Reorder = function(field, selected){
 //  	var proposals = Pard.CachedProposals;
 //  	var _proposalsSelected = [];
 //  	proposals.forEach(function(proposal){
 //  		if(proposal.type == selected) _proposalsSelected.push(proposal);
 //  	})

 //  	_proposalsSelected.sort(function (a, b) {
 //  		if (a[field] && b[field]) return a[field].toLowerCase().localeCompare(b[field].toLowerCase());
 //      else if (!(a[field])) return 1
 //      else if (!(b[field])) return -1
	// 	});

	// 	return {
	// 		render: function(){
	// 			return _proposalsSelected;
	// 		}
	// 	}
	// }


  ns.Widgets.PrintCheckBoxes = function(programAllCheckbox, selected,_submitBtnOuterContainer, categories) {

  	programAllCheckbox.empty();

  	var _checkBoxesBox = $('<div>');
    var _shownColumns = ['link_orfheo','name','category','title','short_description'];
    var _checkBoxesField = [];
    var _checkBoxesRendered = [];

    var _fields = {
  		space: ['link_orfheo', 'name','category','responsible','address','description', 'own', 'sharing', 'un_wanted','availability', 'email', 'phone','amend'],
  		artist: ['link_orfheo', 'name','category','title','short_description','description', 'duration','components', 'meters', 'children', 'repeat', 'waiting_list','needs','sharing','availability','email', 'phone', 'amend']
  	}

  	var _table;

  	// var _getColumns = function(){ 
	  // 	var _columns = [];
	  // 	_submitBtnOuterContainer.hide();
			// _checkBoxes.forEach(function(elem){
			// 	if (elem[1] === 'program'){
			// 		_columns.push(_fields[selected].length);
			// 		_submitBtnOuterContainer.show(); 			
			// 	}
			// 	else if (elem[0].getVal()) {
			// 		var index = _fields[selected].indexOf(elem[1]);
			// 		_columns.push(index);
			// 	}				
	  // 	})
	  // 	return _columns;
	  // }

    var _filterCategory = $('<select>');



  	var _printCheckBoxes = function(columnShown){
      console.log(columnShown)
  	_checkBoxesField = [];
    _fields[selected].forEach(function(field, columnNum){
    	var _checkBox = Pard.Widgets.CheckBox(Pard.Widgets.Dictionary(field).render(),false);
    	// var _checkBoxBox = $('<span>');
    	var _checkBoxRendered = _checkBox.render().addClass('checkBox-call-manager');
      _checkBoxesField.push(field);
    	_checkBoxRendered.click(function(){
        var column = _table.column(columnNum);
        column.visible( _checkBox.getVal() );
        } );
    	if ($.inArray(field,columnShown)>-1) {
        _checkBox.setVal(true);
      }
      else {
        _checkBox.setVal(false);
      };
              if (_table) _table.column(columnNum).visible( _checkBox.getVal() );

    	_checkBox.labelToggle(); 	
    	// _checkBoxRendered.click(function(){  	
    	// 	_checkBoxRendered.trigger('change');
    	// });
    	_checkBoxesBox.append(_checkBoxRendered);

    });
  	}

  	_printCheckBoxes(_shownColumns);

    var _allCheckBoxes = Pard.Widgets.CheckBox('Todos los campos','all');
  	var _allCheckBoxesRendered = _allCheckBoxes.render().addClass('checkBox-call-manager');

    _allCheckBoxesRendered.click(function(){
      var _val = _allCheckBoxes.getVal();
    	_checkBoxesBox.empty();
    	if (_val) _printCheckBoxes(_checkBoxesField);
      else _printCheckBoxes([]);

    	// _programCheckBox.setVal(false);
    	// var _val = _allCheckBoxes.getVal();

     //  console.log(_val);
    	// _checkBoxes.forEach(function(elem,pos){
    	// 		elem.setVal(_val);
     //      _checkBoxesRendered[pos].trigger('click');
    	// })
    });

    _allCheckBoxes.labelToggle(); 	

    // _allCheckBoxesRendered.click(function(){  	
    // 		_allCheckBoxesRendered.trigger('change');
    // 	});

  	// var _programCheckBox = Pard.Widgets.CheckBox('<span style = "color: red; font-size:0.875rem">Programación</span>','program');
   //  var _programCheckBoxRendered = _programCheckBox.render().addClass('checkBox-call-manager');
   //  _programCheckBoxRendered.change(function(){
   //  	_checkBoxesBox.empty();
   //  	_printCheckBoxes();
   //  	_allCheckBoxes.setVal(false);
   //  	var _val = _programCheckBox.getVal();
   //  	_checkBoxes.forEach(function(elem){
   //  		['link_orfheo', 'name', 'title'].forEach(function(field){
   //  			if (elem[1] == field) elem[0].setVal(_val);
   //  		}) 
   //  })
   //  	if (_val){
	  //   	_checkBoxes.push([true, 'program']);
   //  	}
   // 		// _createTable();
   //  });

   //  _programCheckBox.labelToggle(); 	

    // _programCheckBoxRendered.click(function(){  	
    // 		_programCheckBoxRendered.trigger('change');
    // 	});

    programAllCheckbox.empty();
    programAllCheckbox.append(_allCheckBoxesRendered).addClass('program-all-checkbox-container');

    _checkBoxesBox.append(_filterCategory);

    var _searchTags = [{id:'all', 'text':'Todas las categorias'}];
    categories.forEach(function(cat){
      _searchTags.push({id:cat, text: Pard.Widgets.Dictionary(cat).render()});
    });
    
    _filterCategory.select2({
      data: _searchTags,
      // multiple:true,
      // placeholder: 'Busca',
      // tags: true,
      // tokenSeparators: [',', ' '],   
    });

    _filterCategory.on('select2:select',function(){
      var _cat =  _filterCategory.select2('data')[0];
      if (_cat.id == 'all') _table.columns( 2 ).search('').draw();
      else _table.columns( 2 ).search(_cat.text).draw();
    });


    
    return {
	  	render: function(){
	  		return _checkBoxesBox;
	  	},
	  	getVal: function(){
	  		return _getColumns();
	  	}, 
	  	setCallback: function(table){

        var _hiddenColumnsArray=[];
        _fields[selected].forEach(function(field, colNum){
          if($.inArray(field,_shownColumns)<0) _hiddenColumnsArray.push(colNum);
        });
        // _hiddenColumnsArray.push(_fields[selected].length);
        _table = table.DataTable({
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
            }
          },
          {
            extend: 'pdf',
            exportOptions: {
                columns: ':visible'
            },
            orientation: 'landscape'
          }
        ]
        });


        // _fields[selected].forEach(function(field, colNum){
        //   if(field == 'name' || field == 'link_orfheo') _table.column(colNum).visible(true);
        //   else _table.column(colNum).visible(false);
        // });
        // _table.column(_fields[selected].length).visible(false);
        // _table.columns.adjust().draw( true );
	      
      }
  	}
  }




  ns.Widgets.CreateTable = function(selected, _submitBtnOuterContainer, proposalsReordered){

  	_submitBtnOuterContainer.empty();

  	var proposals = Pard.CachedProposals;
  	
  	var _places = [{id:'', text:''}];
  	var _artists = [{id:'', text:''}];
  	// var _programs = [];
    var _proposalsSelected = [];
    var _categories = [];

  	proposals.forEach(function(proposal){
      if ($.inArray(proposal.category, _categories)<0 && proposal.type == selected) _categories.push(proposal.category);
  		if (proposal['type'] == 'space') _places.push({id: proposal['proposal_id'], text: proposal['name'], availability: proposal['availability'], profile_id: proposal['profile_id']});
  		if (proposal['type'] == 'artist') {
  			var _text =  proposal['name'] + ' - ' +  proposal['title'];
				_artists.push({id: proposal['proposal_id'], text: _text, availability: proposal['availability']});
				// if (proposal['program']){
	  	// 		proposal['program']['proposal_id'] = proposal['proposal_id'];
	  	// 		_programs.push(proposal['program']);
				// }
			}
   		if (!(proposalsReordered) && proposal['type'] == selected) {
   			_proposalsSelected.push(proposal);
   		}
   	});

   	if (proposalsReordered) _proposalsSelected = proposalsReordered

		var dayTimeObj = Pard.Widgets.DayTime();

   	// var _submitBtnContainer = $('<div>').addClass('submit-btn-call-manager-container');
   	// _submitBtnOuterContainer.append(_submitBtnContainer);
   	// var _successBox = $('<span>').attr('id','succes-box-call-manager');

   	var _tableCreated = Pard.Widgets.PrintTable(_proposalsSelected, dayTimeObj, _places);

  		// _submitBtnContainer.empty()
 			// var _submitBtn = Pard.Widgets.Button('Guarda los cambios', function(){
			 //  var _programArray = _tableCreated.getVal();
 			// 	Pard.Widgets.SendProgram(_programArray, selected);
 			// });
 			// _submitBtnContainer.append(_successBox, _submitBtn.render());

    return {
    	render: function(){
    		return _tableCreated.render()
    	},
      categories: function(){
        return _categories;
      }
    	// getMatrix: function(){
    	// 	return _tableCreated.getMatrix();
    	// },
    	// setTitleColCallback: function(callback){
    	// 	_tableCreated.setTitleColCallback(callback);
    	// }
    }

  }


  // ns.Widgets.SearchInputCallManager = function(selected){

 	//   var proposals = Pard.CachedProposals;

 	//   var _searchTags = [{id:'', text:''}];

		// var _namesAdded = [];
		// var _categoryAdded = [];
		// var _respAdded = [];
		// var _titlesAdded = [];

  // 	proposals.forEach(function(proposal){
  //  		if (proposal['type'] == selected) {
  //  			// _proposalsSelected.push(proposal);

  // 			if ($.inArray(proposal['category'],_categoryAdded) < 0){
  // 				_searchTags.push({id: proposal['category'], text: Pard.Widgets.Dictionary(proposal['category']).render()});
  // 				_categoryAdded.push(proposal['category']);
  // 			}
  // 			if ($.inArray(proposal['name'],_namesAdded) < 0){
  // 				_searchTags.push({id: proposal['name'], text: proposal['name']});
  // 				_namesAdded.push(proposal['name']);
  // 			}
  // 			if (selected == 'space' && $.inArray(proposal['responsible'],_respAdded) < 0) {
  // 				_searchTags.push({id: proposal['responsible'], text: proposal['responsible']});
  // 				_respAdded.push(proposal['responsible']);
  // 			}
  // 			if (selected == 'artist' && $.inArray(proposal['responsible'],_titlesAdded) < 0)  {
  // 				_searchTags.push({id: proposal['title'], text: proposal['title']});
  // 				_titlesAdded.push(proposal['title']); 
  // 			}
  //  		}
  //  	});

		// var dayTimeObj = Pard.Widgets.DayTime();

	 //  // var _proposalsSearched = _proposalsSelected;

  // 	var _createdWidget = $('<div>');

  //  	var _searchInput = $('<select>');

  // 	_createdWidget.append(_searchInput);

	 //  _searchInput.select2({
  //     data: _searchTags,
  //     multiple:true,
  //     placeholder: 'Busca',
  //     tags: true,
  //     tokenSeparators: [',', ' '],   
  //   });

	 //  var _filterPropoposals = function(){
 	//  	  proposals = Pard.CachedProposals;
	 //    var _proposalsSelected = [];
	 //  	proposals.forEach(function(proposal){
  //  		if (proposal['type'] == selected) {
	 //   			_proposalsSelected.push(proposal);
	 //   		}
  //  		});
	 //    var _searchTerms = _searchInput.val();
  //     if (_searchTerms){
	 //    	var _proposalsSearched = _proposalsSelected;
	 //    	var _oldProposalsSearched = _proposalsSelected;
	 //    	_searchTerms.forEach(function(_searchTerm){
		//     	_oldProposalsSearched = _proposalsSearched;
		//     	_proposalsSearched = [];
	 //      	_oldProposalsSearched.forEach(function(proposal){
  //           if ($.inArray(_searchTerm,_categoryAdded)>-1) {
  //             if  (_searchTerm == proposal['category'] ) _proposalsSearched.push(proposal);
  //           }
		// 				else if (_searchTerm == proposal['name'] || _searchTerm == proposal['responsible'] || _searchTerm == proposal['title']) _proposalsSearched.push(proposal);
		// 				else {
		// 					['title', 'description', 'short_description', 'needs', 'sharing'].some(function(field){ 
		// 						if (proposal[field] && proposal[field].toLowerCase().indexOf(_searchTerm.toLowerCase()) > -1){
		// 							_proposalsSearched.push(proposal);   
		// 							return true;
		// 						}   
		// 					});
	 //      		};
		//     	})
		//     })
	 //    }
	 //    else{
	 //    	_proposalsSearched = _proposalsSelected;
	 //    }
  //   	var _indexProposal = [0];
	 //    _proposalsSearched.forEach(function(propSearched){
	 //    	var position = _proposalsSelected.indexOf(propSearched) +1;
	 //    	_indexProposal.push(position);
	 //    });
	 //    return _indexProposal;
	 //  }

  //   return {
  //   	render: function(){
  //   		return _createdWidget;
  //   	},
  //   	getVal: function(){
  //   		return _filterPropoposals();
  //   	}, 
  //   	setCallback: function(callback){
		// 	 	_searchInput.on('change', function() {
	 //    		callback();
	 //    	});
  //   	},
  //   	updateDatabase: function(){

  //   	}
  //   }
  // }



  ns.Widgets.PrintTable = function(proposalsSelected, dayTimeObj, places, _artists) {

  	var _fields = {
  		space: ['link_orfheo','name','category','responsible','address','description', 'own', 'sharing', 'un_wanted','availability', 'email', 'phone','amend'],
  		artist: ['link_orfheo', 'name','category','title','short_description','description', 'duration','components', 'meters', 'children', 'repeat', 'waiting_list','needs','sharing','availability','email', 'phone', 'amend']
  	}

  	var columns = _fields[proposalsSelected[0].type];

  	// var _cols = [];
  	// var _matrix = [];

   	var _tableCreated = $('<table>').addClass('table-proposal stripe row-border').attr({'cellspacing':"0", 'width':"100%"});
   	// var _programArray = [];

   	var reorder = function(colNum){};

   	var _printTable = function(proposalsSelected){
	
  	var _thead = $('<thead>');
  	var _titleRow = $('<tr>')
    // .addClass('title-row-table-proposal');

  	columns.forEach(function(field, colNum){
  		if (field == 'link_orfheo'){ 
	  		// var _titleText = $('<span>').html('rfh');
	  		// var _titleCol = $('<th>').append(_titleText);
	  		// _titleRow.append(_titleCol.addClass('icon-column-call-table'));
  		  var _titleCol = $('<th>').text('rfh');
        _titleRow.append(_titleCol);
      }
  		else{
	  		// var _titleText = $('<span>').html(Pard.Widgets.Dictionary(field).render());
	  		// var _titleCol = $('<th>').append(_titleText);
        var _titleCol = $('<th>').text(Pard.Widgets.Dictionary(field).render());
	  		// if (['availability', 'program'].indexOf(field)<0){
		  	// 	_titleText.click(function(){ 
		  	// 		// var _proposalsReordered = Pard.Widgets.Reorder(_proposalField,field, proposalsSelected).render();
		  	// 		// _tableCreated.empty();
		  	// 		// _printTable(_proposalsReordered);
		  	// 		reorder(field);
		  	// 	});
		  	// 	_titleText.addClass('title-colText-call-manager');
		  	// 	_titleText.append($('<span>').html('&#xE5C5').addClass('material-icons').css('vertical-align','middle'))
		  	// }
	  	}
      var _class = 'column-'+field;
      _titleCol.addClass('column-call-manager-table');
      _titleCol.addClass(_class);
  		_titleRow.append(_titleCol);
  		// _cols.push(_titleCol);
  	});

 		// _matrix.push(_cols);
 		// _cols = [];

  	_tableCreated.append(_thead.append(_titleRow));


    var _tfoot = $('<tfoot>');
    var _titleRowFoot = $('<tr>')
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
      // _cols.push(_titleCol);
    });

    // _matrix.push(_cols);
    // _cols = [];

    _tableCreated.append(_tfoot.append(_titleRowFoot ));


  	// _programArray = [];
  	var _tbody = $('<tbody>');

  	proposalsSelected.forEach(function(proposal){
  		var _row = $('<tr>');
  		columns.forEach(function(field){
  			// var _colClass = 'column-'+field;
  			var _col = $('<td>').addClass('column-call-manager-table')
  			// _col.addClass(_colClass);
  			if (field == 'link_orfheo'){
  				var _icon = $('<a>').append(Pard.Widgets.IconManager(proposal['type']).render());
  				_icon.attr({'href': '/profile?id=' + proposal['profile_id'], 'target':'_blank'});
  				_col.append(_icon);
  			}
  			// else if (field == 'program') {
				 //  if (proposal['type'] == 'artist') {
					// 	var _inputProgram = Pard.Widgets.InputArtistProgram(places, dayTimeObj.render(proposal['availability']));
					// 	var _showObj = {profile_id: proposal.profile_id, proposal_id: proposal.proposal_id, newProgram: _inputProgram};
					// 	_inputProgram.setEndDayTime(proposal['duration']);
					// 	_programArray.push(_showObj);
					// 	if (proposal['program']) _inputProgram.setVal(proposal['program']);
					// }
				 //  if (proposal['type'] == 'space') {
				 //  	var _inputProgram = Pard.Widgets.InputSpaceProgram(_artists, dayTimeObj.render(proposal['availability']), _programs);
				 //  	// _inputProgram.setEndDayTime();
					// 	var _showObj = {
					// 		place: proposal['name'], 
					// 		proposal_id: proposal['proposal_id'],
     //          profile_id: proposal['profile_id'],
					// 		newProgram: _inputProgram
					// 	};
					// 	_programArray.push(_showObj);
					// 	var _savedProgram = [];	  					
					// 	_programs.forEach(function(program){
					// 		for (var key in program){
					// 			if (program[key]['place'] == proposal['name']){
     //              console.log(new Date(program[key]['starting_day_time']).toISOString());
     //              var starting_day_time = program[key]['starting_day_time']
					// 				_savedProgram.push({
					// 					proposal_id: program['proposal_id'], 
					// 					starting_day_time: new Date(program[key]['starting_day_time']).toISOString(),
					// 					ending_day_time: new Date(program[key]['ending_day_time']).toISOString()
					// 				});
					// 			}
					// 		}
					// 	});
					// 	_inputProgram.setVal(_savedProgram);
				 //  }
					// _col.append(_inputProgram.render());
 				// }
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

    // _tableCreated.append($('<a>').text('showHide').addClass('toggle-visa'),$('<a>').text('showHide1').addClass('toggle-visb'));

   
		return{
			render: function(){
				return _tableCreated;
			}
   //    ,
			// getVal: function(){
			// 	return _programArray;
			// }
   //    ,
			// getMatrix: function(){
			// 	return _matrix;
			// },
			// setTitleColCallback: function(callback){
			// 	reorder = callback;
			// }
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


  			// 	_programData.some(function(dataSaved){
  			// 		if (dataSaved['proposal_id'] == show['proposal_id']){
					// 		dataSaved['program'].push({	
					// 			starting_day_time: show['starting_day_time'], 
					// 			ending_day_time: show['ending_day_time'],
					// 			proposal_id: _artistProposal_id,
     //            profile_id
					// 		});
					// 		_check = false;
  			// 			return true;
  			// 		}
  			// 	});
  			// 	if (_check){
	  		// 		_data['proposal_id'] = show['proposal_id'];
	  		// 		var _program = {
	  		// 		 	starting_day_time: show['starting_day_time'],
					// 		ending_day_time: show['ending_day_time'],
	  		// 		 	proposal_id: _artistProposal_id
	  		// 		}
	  		// 		_data['program'] = [_program];
					// 	_spacesWithprogram.push(show['proposal_id']);
	  		// 	}
					// if (!(jQuery.isEmptyObject(_data))) _programData.push(_data);
  			// });

  
	  	
				// }
		  	// inputProgram['newProgram'].resetModifiedCheck();
	  	// var _dataArtist = {proposal_id: _artistProposal_id};
  		// _showArray.forEach(function(show){
  		// 		_programArtist.push({
  		// 			place: show['place'],
  		// 		 	starting_day_time: show['starting_day_time'],
  		// 		 	ending_day_time: show['ending_day_time'],
  		// 		 	proposal_id: show['proposal_id']
  		// 		});
  		// 	});
 			// 	_dataArtist['program'] = _programArtist;

   	// 		_artistsProgram.push(_dataArtist);

	  	// });

 			// _programData = _programData.concat(_artistsProgram);

	  	// var proposals = Pard.CachedProposals;
		  // 	proposals.forEach(function(proposal){
		  // 		if (proposal.type == 'space' && $.inArray(proposal.proposal_id, _spacesWithprogram)<0){
		  // 			var _data = {};
		  // 			_data['proposal_id'] = proposal['proposal_id'];
				// 		_data['program'] = []; 
				// 		_programData.push(_data); 
		  // 		}
		  // });			

		  // return _programData;
  	
  	// }


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
		// Pard.Widgets.CreateTable(columns, selected, _tableBox, _submitBtnOuterContainer);	

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




