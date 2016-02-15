(function(ns){

  ns.Forms = ns.Forms || {};

  ns.Forms.BasicArtistForm = function(){

  	var _form = {};

    _form['name'] = Pard.Widgets.Input('Nombre espacio', 'text');
    _form['city'] = Pard.Widgets.Input('Ciudad', 'text');
    _form['zip_code'] = Pard.Widgets.Input('Codigo postal', 'text');

    return {
      render: function(){
        return _form;
      },
      formFields: function() {
      	return Object.keys(_form);
      }
    }
  }


  ns.Forms.BasicSpaceForm = function(){

  	var _form = {};

    var _labels = ['Asociacion Cultural', 'Local Comercial', 'Espacio Particular'];
    var _values = ['cultural_ass', 'commercial', 'home'];

    _form['name'] = Pard.Widgets.Input('Nombre espacio', 'text');
    _form['city'] = Pard.Widgets.Input('Ciudad', 'text');
    _form['address'] = Pard.Widgets.Input('Direccion', 'text');
    _form['zip_code'] = Pard.Widgets.Input('Codigo postal', 'text');
    _form['category'] = Pard.Widgets.Selector(_labels, _values);

   
    return {
      render: function(){
        return _form;
      },
      formFields: function() {
      	return Object.keys(_form);
      }
    }
  }


  }(Pard || {}));