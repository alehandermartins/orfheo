(function(ns){

  ns.Forms = ns.Forms || {};



  ns.Forms.BasicArtistForm = function(){

  	var _form = {};

    _form['name'] = Pard.Widgets.Input('Nombre artistico', 'text');
    _form['city'] = Pard.Widgets.Input('Ciudad', 'text');
    _form['zip_code'] = Pard.Widgets.Input('Codigo postal', 'text');

    return {
      render: function(){
        return _form;
      },
      requiredFields: function() {
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
      requiredFields: function() {
      	return Object.keys(_form);
      }
    }
  }


  ns.Forms.FullArtistForm = function(){

  	var _form = Pard.Forms.BasicArtistForm().render();

  	_form['personal_web'] = Pard.Widgets.Input('Web personal', 'text');
    _form['bio'] = Pard.Widgets.TextArea('Bio');
    _form['color'] = Pard.Widgets.Input('Color', 'color');

    var _requiredFields = Pard.Forms.BasicArtistForm().requiredFields();

    return {
      render: function(){
        return _form;
      },
      requiredFields: function(){
      	return _requiredFields;
      }
    }
  }


  ns.Forms.FullSpaceForm = function(){

  	var _form = Pard.Forms.BasicSpaceForm().render();

  	_form['personal_web'] = Pard.Widgets.Input('Web personal', 'text');
    _form['bio'] = Pard.Widgets.TextArea('Bio');
    _form['color'] = Pard.Widgets.Input('Color', 'color');

    var _requiredFields = Pard.Forms.BasicSpaceForm().requiredFields();

    return {
      render: function(){
        return _form;
      },
      requiredFields: function(){
      	return _requiredFields;
      }
    }
  }


  ns.Forms.ProfileForms = function(type){

	var _forms = { 
		'artist': Pard.Forms.FullArtistForm(),
		'space': Pard.Forms.FullSpaceForm()
	};

   return {
      render: function(){
        return _forms[type];
      }
    }	
  }


  ns.Forms.SpaceCallConfusion = function() {

		var _form = {};
    var _labels = ['Sabado', 'Domingo', 'Ambos dias'];
    var _values = ['sat', 'sun', 'both'];

    _form['phone'] = Pard.Widgets.Input('Telefono de contacto', 'text');
    _form['description'] = Pard.Widgets.TextArea('Descripcion del espacio disponible');
    _form['availability'] = Pard.Widgets.Selector(_labels, _values);
    //_form['fotos'] = Pard.Widgets.Input('Codigo postal', 'file');
    _form['links'] = Pard.Widgets.Input('Link', 'text');
    _form['own'] = Pard.Widgets.TextArea('Programacion propia');
    _form['sharing'] = Pard.Widgets.TextArea('Materiales a compartir');

    var _requiredFields = ['phone', 'description']

    return {
      render: function(){
        return _form;
      },
      requiredFields: function(){
      	return _requiredFields;
      }
    }	




  }


  }(Pard || {}));