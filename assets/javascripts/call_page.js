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

    _fields[selected].forEach(function(field){
    	var _checkBox = Pard.Widgets.CheckBox(field,field).render().addClass('checkBox-call-manager')
    	_checkBoxesBox.append(_checkBox);
    });


    _createdWidget.append(_checkBoxesBox, _tableBox);

		return {
      render: function(){
        return _createdWidget;
      }
	   }
  }


}(Pard || {}));
