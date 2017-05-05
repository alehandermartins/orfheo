'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};  

    ns.Widgets.MultipleDaysFormField = function(block){
      var _formField = $('<div>').addClass('MultipleDaysSelector-FormField call-form-field')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory') _label.text(block.label + ' *')
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)
      var _input = Pard.Widgets.MultipleDaysSelector(block.args);
      var _options = {
        placeholder: Pard.t.text('widget.availability.placeholder'),
        selectAllText: Pard.t.text('widget.availability.selectAllText'),
        countSelected: false,
        allSelected: Pard.t.text('widget.availability.allSelected')
      }
      _input.setOptions(_options);
      _helptext.css('margin-top', 5)

      return {
        render: function(){
          var _inputRendered = _input.render();
          if (_inputRendered) return _formField.append(_label, _inputRendered, _helptext);
        },
        getVal: function(){
          return _input.getVal();
        },
        setVal: function(values){
          _input.setVal(values);
        },
        addWarning: function(){
          _input.addWarning();
        },
        removeWarning: function(){
          _input.removeWarning();
        }
      }
    }

  ns.Widgets.TextAreaEnrichedFormField = function(block){
    var _formField = $('<div>').addClass('TextArea-FormField call-form-field')
    var _label = $('<label>').text(block.label)
    if(block.type == 'mandatory')
      _label.text(block.label + ' *')
    var _helptext = $('<p>').addClass('help-text').html(block.helptext)
    var _input = Pard.Widgets.TextAreaEnriched();

    _formField.append(_label, _input.render(), _helptext);

    return {
      render: function(){
        return _formField;
      },
      getVal: function(){
        return _input.getVal();
      },
      setVal: function(value){
        _input.setVal(value);
      },
      addWarning: function(){
        _input.addWarning();
      },
      removeWarning: function(){
        _input.removeWarning();
      }
    }
  }
 
}(Pard || {}));
