(function(ns){

  ns.Forms = ns.Forms || {};



  ns.Forms.BasicArtistForm = function(){

  	var _form = {};

    _form['name'] = Pard.Widgets.Input('Nombre artistico', 'text');
    _form['city'] = Pard.Widgets.Input('Ciudad', 'text');
    _form['zip_code'] = Pard.Widgets.Input('Codigo postal', 'text');
    _form['color'] = Pard.Widgets.Input('Color', 'color');

    var _requiredFields = ['name', 'city', 'zip_code', 'color'];

    return {
      render: function(){
        return _form;
      },
      requiredFields: function(){
        return _requiredFields;
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
    _form['personal_web'] = Pard.Widgets.Input('Web personal', 'url');
    _form['color'] = Pard.Widgets.Input('Color', 'color');

    var _requiredFields = ['name', 'city', 'address', 'zip_code', 'category', 'color'];

  
    return {
      render: function(){
        return _form;
      },
      requiredFields: function(){
        return _requiredFields;
      }
    }
  }


  ns.Forms.FullArtistForm = function(){

  	var _form = Pard.Forms.BasicArtistForm().render();

    _form['personal_web'] = Pard.Widgets.Input('Web personal', 'text');
    _form['bio'] = Pard.Widgets.TextArea('Bio');
    //_form['fotos'] = Pard.Widgets.Input('Fotos', 'file');

    var _requiredFields = ['name', 'city', 'zip_code', 'color'];

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

    _form['links'] = _form['personal_web'] = Pard.Widgets.Input('Web personal', 'url');
    _form['bio'] = Pard.Widgets.TextArea('Bio');
    //_form['fotos'] = Pard.Widgets.Input('Fotos', 'file');


    var _requiredFields = ['name', 'city', 'address', 'zip_code', 'category'];

    return {
      render: function(){
        return _form;
      },
      requiredFields: function(){
      	return _requiredFields;
      }
    }
  }


  ns.Forms.ProfileForms = function(selected){

	var _forms = { 
		'artist': Pard.Forms.FullArtistForm,
		'space': Pard.Forms.FullSpaceForm
	};

   return {
      render: function(){
        return _forms[selected]();
      }
    }	
  }


  ns.Forms.SpaceCall = function() {

		var _form = {};
    var _labels = ['Ambos dias', 'Sabado', 'Domingo'];
    var _values = ['both', 'sat', 'sun'];

    var _linkToConditions = $('<a>').attr({href: 'http://beniconfusionfest.es/?q=es/page/bases-de-participaci%C3%B3n', target: '_blank'}).text('bases de participación')
    var _conditions = $('<p>').text('Acepto las ').append(_linkToConditions);
    
    _form['description'] = Pard.Widgets.TextArea('Descripcion del espacio disponible');
    _form['availability'] = Pard.Widgets.Selector(_labels, _values);
    _form['own'] = Pard.Widgets.TextArea('Programacion propia');
    _form['sharing'] = Pard.Widgets.TextArea('Materiales a compartir');
    _form['phone'] = Pard.Widgets.Input('Telefono de contacto', 'text');
    _form['conditions'] = Pard.Widgets.CheckBox(_conditions, 'yes_conditions');

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



    ns.Forms.ArtistCallForm = function() {

		var _form = {};
    
    var _labelsCategories = ['Musica', 'Artes Escenicas', 'Exposición', 'Poesia',  'Audiovisual', 'Street Art', 'Taller', 'Otros'];
    var _valuesCategories = ['music', 'arts', 'expo', 'poetry', 'audiovisual', 'street_art', 'workshop', 'other'];
    var _labelsDays = ['Sabado', 'Domingo', 'Ambos dias'];
    var _valuesDays = ['sat', 'sun', 'both'];
    var _labelsTime = ['15 min', '30 min', '45 min', '1 h', '1h 15min', '1h 30 min', '1h 45min', '2 h', '2h 15min', '2h 30min'];
    var _valuesTime = ['15', '30', '45', '60', '75', '90', '105', '120', '135', '150'];

    var _linkToConditions = $('<a>').attr({href: 'http://beniconfusionfest.es/?q=es/page/bases-de-participaci%C3%B3n', target: '_blank'}).text('bases de participación')
    var _conditions = $('<p>').text('Acepto las ').append(_linkToConditions);
           
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
    _form['conditions'] = Pard.Widgets.CheckBox(_conditions, 'yes_conditions');

    return {
      render: function(){
        return _form;
      }
    }	
  }


  ns.Forms.ArtistCall = function(artistCategory){

    var _musicArtsOtherFields = ['title', 'description', 'short_description', 'duration', 'components', 'availability', 'children', 'links', 'sharing', 'needs', 'repeat', 'waiting_list', 'phone', 'conditions'];
    var _poetryWorkshopFields = ['title', 'description', 'short_description', 'duration', 'availability', 'children', 'links', 'sharing', 'needs', 'repeat', 'waiting_list', 'phone', 'conditions'];
    var _audiovisualFields = ['title', 'description', 'short_description', 'duration', 'availability', 'children', 'links', 'sharing', 'needs', 'waiting_list', 'phone',  'conditions'];
    var _streetArtFields = ['title', 'description', 'short_description', 'availability', 'links', 'sharing', 'needs', 'waiting_list', 'phone',  'conditions'];
    var _expoFields = ['title', 'description', 'short_description', 'meters', 'links', 'sharing', 'needs', 'waiting_list', 'phone', 'conditions'];


    var _musicArtsOtherRequired = ['title', 'description', 'short_description', 'duration', 'components', 'availability', 'phone', 'conditions'];
    var _poetryWorkshopRequired = ['title', 'description', 'short_description', 'duration', 'availability', 'phone', 'conditions'];
    var _audiovisualRequired = ['title', 'description', 'short_description', 'duration','availability', 'phone', 'conditions'];
    var _streetArtRequired = ['title', 'description', 'short_description', 'phone', 'conditions'];
    var _expoRequired = ['title', 'description', 'short_description', 'meters', 'phone', 'conditions'];


    var _fields = {
      'music': _musicArtsOtherFields,
      'arts': _musicArtsOtherFields,
      'other': _musicArtsOtherFields,
      'poetry': _poetryWorkshopFields,
      'expo': _expoFields,
      'street_art': _streetArtFields,
      'workshop': _poetryWorkshopFields,
      'audiovisual': _audiovisualFields
    }

    var _requiredFields = {
      'music': _musicArtsOtherRequired,
      'arts': _musicArtsOtherRequired,
      'other': _musicArtsOtherRequired,
      'poetry': _poetryWorkshopRequired,
      'expo': _expoRequired,
      'street_art': _streetArtRequired,
      'workshop': _poetryWorkshopRequired,
      'audiovisual': _audiovisualRequired
    }

    var _form = {};
    var _callBycategory = Pard.Forms.ArtistCallForm().render();

    _fields[artistCategory].forEach(function(_element){
      _form[_element] = _callBycategory[_element];
    });

    var _required = _requiredFields[artistCategory];


    return {
      render: function(){ 
        return _form;
      },
      requiredFields: function(){
        return _required;
      }
    }
  };

}(Pard || {}));