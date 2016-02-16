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


  ns.Forms.SpaceCall = function() {

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
    _form['conditions'] = Pard.Widgets.CheckBox('Acepto las bases', 'yes_conditions');

    var _requiredFields = ['phone', 'description', 'conditions']

    return {
      render: function(){
        return _form;
      },
      requiredFields: function(){
      	return _requiredFields;
      }
    }	
  }



    ns.Forms.ArtistCall = function() {

		var _form = {};
    
    var _labelsCategories = ['Musica', 'Artes Escenicas', 'Exposición', 'Poesia',  'Audiovisual', 'Street Art', 'Taller', 'Otros'];
    var _valuesCategories = ['music', 'arts', 'expo', 'poetry', 'audiovisual', 'street_art', 'workshop', 'other'];
    var _labelsDays = ['Sabado', 'Domingo', 'Ambos dias'];
    var _valuesDays = ['sat', 'sun', 'both'];
    var _labelsTime = ['15 min', '30 min', '45 min', '1 h', '1h 15min', '1h 30 min', '1h 45min', '2 h', '2h 15min', '2h 30min'];
    var _valuesTime = ['15', '30', '45', '60', '75', '90', '105', '120', '135', '150'];
           
    _form['category'] = Pard.Widgets.Selector(_labelsCategories, _valuesCategories);
    _form['title'] = Pard.Widgets.Input('Titulo', 'text');
    _form['description'] = Pard.Widgets.TextArea('Descripción');
    _form['short_description']= Pard.Widgets.Input('Breve descripción para el programa', 'text');
   	_form['duration'] = Pard.Widgets.Selector(_labelsTime, _valuesTime); 
    _form['components'] = Pard.Widgets.Input('Numero de integrantes', 'number'); 
    _form['meters'] = Pard.Widgets.Input('Espacio necesario para la expo', 'text');
    _form['availability'] = Pard.Widgets.Selector(_labelsDays, _valuesDays); 
    _form['children'] = Pard.Widgets.CheckBox('Actividad para un publico infantil', 'yes_children');
    //_form['fotos'] = Pard.Widgets.Input('fotos', 'file');
    _form['links'] = Pard.Widgets.Input('Links', 'text');
    _form['sharing'] = Pard.Widgets.TextArea('Materiales a compartir');
    _form['needs'] = Pard.Widgets.TextArea('Necesidades');
    _form['repeat'] = Pard.Widgets.CheckBox('Si posible, quiero repetir mi actuacción', 'yes_repeat');
    _form['waiting_list'] = Pard.Widgets.CheckBox('En la eventualidad, quiero quedarme en la lista de espera', 'yes_waitig_list');
    _form['phone'] = Pard.Widgets.Input('Telefono de contacto', 'text');
    _form['conditions'] = Pard.Widgets.CheckBox('Acepto las bases', 'yes_conditions');

    return {
      render: function(){
        return _form;
      }
    }	
  }

  ns.Forms.ArtistCallByCategory = function(){
  	var _callBycategory = {
      'music': Pard.Forms.MusicArtsOtherCall(),
      'arts': Pard.Forms.MusicArtsOtherCall(),
      'other': Pard.Forms.MusicArtsOtherCall(),
      'poetry': Pard.Forms.PoetryWorkshopCall(),
      'expo': Pard.Forms.ExpoCall(),
      'street_art': Pard.Forms.StreetArtCall(),
      'workshop': Pard.Forms.PoetryWorkshopCall(),
      'audiovisual': Pard.Forms.AudiovisualCall()
    }
    return {
    	render: function(){ 
    		return _callBycategory;
    	}
    }
  };

  ns.Forms.MusicArtsOtherCall = function(){

  	var _form = {};
 
    var _fields = ['title', 'description', 'short_description', 'duration', 'components', 'availability', 'children', 'links', 'sharing', 'needs', 'repeat', 'waiting_list', 'phone', 'conditions'];

     var _artistCall = Pard.Forms.ArtistCall().render();

    _fields.forEach(function(_element){
  		_form[_element] = _artistCall[_element];
  	});

    var _requiredFields = ['title', 'description', 'short_description', 'duration', 'components', 'availability', 'phone', 'conditions'];

    return {
      render: function(){
        return _form;
      },
      requiredFields: function(){
      	return _requiredFields;
      }
    }	
  };


  ns.Forms.PoetryWorkshopCall = function(){

  	var _form = {};
 
    var _fields = ['title', 'description', 'short_description', 'duration', 'availability', 'children', 'links', 'sharing', 'needs', 'repeat', 'waiting_list', 'phone', 'conditions'];

    var _artistCall = Pard.Forms.ArtistCall().render();

    _fields.forEach(function(_element){
  		_form[_element] = _artistCall[_element];
  	});

    var _requiredFields = ['title', 'description', 'short_description', 'duration', 'availability', 'phone', 'conditions'];

    return {
      render: function(){
        return _form;
      },
      requiredFields: function(){
      	return _requiredFields;
      }
    }	
  };


  ns.Forms.AudiovisualCall = function(){

  	var _form = {};

    var _fields = ['title', 'description', 'short_description', 'duration', 'availability', 'children', 'links', 'sharing', 'needs', 'waiting_list', 'phone',  'conditions'];

    var _artistCall = Pard.Forms.ArtistCall().render();


    _fields.forEach(function(_element){
  		_form[_element] = _artistCall[_element];
  	});

    var _requiredFields = ['title', 'description', 'short_description', 'duration', 'phone'];

    return {
      render: function(){
        return _form;
      },
      requiredFields: function(){
      	return _requiredFields;
      }
    }	
  };



  ns.Forms.StreetArtCall = function(){

  	var _form = {};

    var _fields = ['title', 'description', 'short_description', 'availability', 'links', 'sharing', 'needs', 'waiting_list', 'phone',  'conditions'];

    var _artistCall = Pard.Forms.ArtistCall().render();


    _fields.forEach(function(_element){
  		_form[_element] = _artistCall[_element];
  	});


    var _requiredFields = ['title', 'description', 'short_description', 'phone']

    return {
      render: function(){
        return _form;
      },
      requiredFields: function(){
      	return _requiredFields;
      }
    }	
  };


  ns.Forms.ExpoCall = function(){

  	var _form = {};

    var _fields = ['title', 'description', 'short_description', 'meters', 'links', 'sharing', 'needs', 'waiting_list', 'phone', 'conditions'];

    var _artistCall = Pard.Forms.ArtistCall().render();


    _fields.forEach(function(_element){
  		_form[_element] = _artistCall[_element];
  	});


    var _requiredFields = ['title', 'description', 'short_description', 'meters', 'phone']

    return {
      render: function(){
        return _form;
      },
      requiredFields: function(){
      	return _requiredFields;
      }
    }	
  };




  }(Pard || {}));