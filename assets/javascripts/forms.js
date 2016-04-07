(function(ns){

  ns.Forms = ns.Forms || {};


  ns.Forms.BasicArtistForm = function(){

    var _form = {};

    _form['name'] = {
      label: Pard.Widgets.InputLabel('Nombre artistico *'),
      input: Pard.Widgets.Input('', 'text'),
      helptext: Pard.Widgets.HelpText('Es el nombre artístico de la persona o del colectivo que quiere participar en el festival.')
    };
    _form['city'] = {
      label: Pard.Widgets.InputLabel('Ciudad *'),
      input: Pard.Widgets.Input('', 'text'),
      helptext: Pard.Widgets.HelpText('Indicar tu ciudad hará más facil localizarte para un posibile contacto.')
    };

    _form['zip_code'] = {
      label: Pard.Widgets.InputLabel('Código postal *'),
      input: Pard.Widgets.Input('', 'text'),
      helptext: Pard.Widgets.HelpText('Para situar tu proyecto artístico en el mapa.')
    };

    _form['personal_web'] = {
      label: Pard.Widgets.InputLabel('Web personal y enlaces a redes sociales'),
      input: Pard.Widgets.InputPersonalWeb(),
      helptext: Pard.Widgets.HelpText('Puedes añadir enlaces tanto a tu webs o blogs personales como a un tus perfiles en redes sociales (enlaces a videos y fotos podrás gestionarlos con el formulario dedicado a tu propuesta artística)')
    };

    _form['color'] = {
      label: Pard.Widgets.InputLabel('Escoge un color'),
      input: Pard.Widgets.Input('', 'color'),
      helptext: Pard.Widgets.HelpText('Es el color personal de tu perfil!')
    };
    _form['color'].input.setClass('color-input');
   

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

    _form['name'] = {
      label: Pard.Widgets.InputLabel('Nombre del espacio *'),
      input: Pard.Widgets.Input('', 'text'),
      helptext: Pard.Widgets.HelpText('Es el nombre que será asociado con tu espacio durante el festival.')
    };

    _form['address'] ={
      label: Pard.Widgets.InputLabel('Dirección *'),
      input: Pard.Widgets.InputAddressSpace('Ej: Carrer de la Murta 13, Valencia'),
      helptext: Pard.Widgets.HelpText('Tu dirección detallada es necesaria para poderte localizar en el mapa.')
    }

    _form['category'] = {
      label: Pard.Widgets.InputLabel('Categoría *'),
      input: Pard.Widgets.Selector(_labels, _values),
      helptext: Pard.Widgets.HelpText('')
    };
    _form['category']['input'].setClass('category-input');

    _form['personal_web'] = {
      label: Pard.Widgets.InputLabel('Web personal y enlaces a redes sociales'),
      input: Pard.Widgets.InputPersonalWeb(),
      helptext: Pard.Widgets.HelpText('Puedes añadir enlaces tanto a tu webs o blogs personales como a un tus perfiles en redes sociales')
    };

    _form['links'] = {
      label: Pard.Widgets.InputLabel('Links a materiales online'),
      input: Pard.Widgets.InputMultimedia(),
      helptext: Pard.Widgets.HelpText('Añade enlaces a videos, fotos y audios desde tus redes sociales.')
    };

    _form['color'] = {
      label: Pard.Widgets.InputLabel('Escoge un color'),
      input: Pard.Widgets.Input('', 'color'),
      helptext: Pard.Widgets.HelpText('Es el color personal de tu perfil!')
    };
    _form['color'].input.setClass('color-input');
   
    var _requiredFields = ['name', 'address', 'category', 'color','links'];

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

    
    _form['bio'] = {
      label: Pard.Widgets.InputLabel('Bio'),
      input: Pard.Widgets.TextArea(''),
      helptext: Pard.Widgets.HelpText('Cualquier cosa que quieras compartir sobre tu vida artistica-cultural.')
    };
    _form['bio']['input'].setAttr('rows', 4);

    //_form['fotos'] = Pard.Widgets.Input('Fotos', 'file');

    var _requiredFields = ['name', 'city', 'zip_code', 'color','personal_web'];
    var  _reorderedForm = {};

    ['name', 'bio',  'city', 'zip_code','personal_web', 'color'].forEach(function(field){
      _reorderedForm[field] = _form[field]; 
    });

    return {
      render: function(){
        return _reorderedForm;
      },
      requiredFields: function(){
      	return _requiredFields;
      }
    }
  }


  ns.Forms.FullSpaceForm = function(){

  	var _form = Pard.Forms.BasicSpaceForm().render();

    _form['bio'] = {
      label: Pard.Widgets.InputLabel('Bio'),
      input: Pard.Widgets.TextArea(''),
      helptext: Pard.Widgets.HelpText('Cualquier cosa que quieras compartir sobre tu espacio.')
    };
    _form['bio']['input'].setAttr('rows', 4);


    //_form['fotos'] = Pard.Widgets.Input('Fotos', 'file');


    var _requiredFields = ['name', 'address', 'category', 'color'];

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

    _form['responsible'] = {
      label: Pard.Widgets.InputLabel('Nombre del responsable del espacio *'),
      input: Pard.Widgets.Input('','text'),
      helptext: Pard.Widgets.HelpText('Indicar la persona que se compromete con el festival para la programación y gestión del espacio.')
    };

    _form['description'] = {
      label: Pard.Widgets.InputLabel('Descripcion del espacio disponible y superficies para murales *'),
      input: Pard.Widgets.TextArea(''),
      helptext: Pard.Widgets.HelpText('Numero de habitaciones, dimensiones aproximativas, paredes o persianas para intervenciones de arte urbana, etc.')
    };

    _form['availability'] = {
      label: Pard.Widgets.InputLabel('Disponibilidad *'),
      input: Pard.Widgets.InputDate(''),
      helptext: Pard.Widgets.HelpText('Selecciona los días que quieres compartir tu espacio.')
    }

    
    _form['own'] = {
      label: Pard.Widgets.InputLabel('Programación propia'), 
      input: Pard.Widgets.TextArea(''),
      helptext:Pard.Widgets.HelpText('Indicar, si se da el caso, el nombre y los horarios de actuacción de los artistas ya programados. IMPORTANTE: Los artistas también tendrán que apuntarse en la convocatoria y comunicar a través de la misma el espacio donde actuarán.')
    }

    _form['un_wanted'] = {
      label: Pard.Widgets.InputLabel('Preferencias de actividades'), 
      input: Pard.Widgets.TextArea(''),
      helptext:Pard.Widgets.HelpText('Indicar tanto las actividades que NO quieres en tu espacio como las que te gustaría hospedar.')
    }

    _form['sharing'] = {
      label: Pard.Widgets.InputLabel('Materiales a compartir'), 
      input: Pard.Widgets.TextArea(''),
      helptext:Pard.Widgets.HelpText('Material que puedes compartir durante el festival como equipo de sonido, altavoces, material de arte plastica, focos de luz...')
    }

    _form['phone'] = {
      label: Pard.Widgets.InputLabel('Teléfono de contacto *'), 
      input: Pard.Widgets.InputTel(''),
      helptext:Pard.Widgets.HelpText('Esta información es necesaria para un eventual contacto por parte de la organización del festival.')
    }
    
    _form['conditions'] = {
      label: Pard.Widgets.InputLabel(''), 
      input: Pard.Widgets.CheckBox(Pard.Forms.Conditions().render(), 'yes_conditions'),
      helptext:Pard.Widgets.HelpText('')
    }

    var _requiredFields = ['phone', 'description', 'conditions', 'responsible', 'availability'];

    return {
      render: function(){
        return _form;
      },
      requiredFields: function(){
      	return _requiredFields;
      }
    }
  }

  ns.Forms.Conditions = function() {

    var _linkToConditions = $('<a>').attr({href: 'http://beniconfusionfest.es/?q=es/page/bases-de-participaci%C3%B3n', target: '_blank'}).text('bases de participación');
    var _conditions = $('<p>').text('He leido y acepto las condiciones en las ').append(_linkToConditions,' del festival *');

    return{
      render: function(){
        return _conditions;
      }, 
      link: function(){
        return _linkToConditions;
      }
    }
  }


  ns.Forms.ArtistCallForm = function() {

		var _form = {};

    var _labelsCategories = ['Musica', 'Artes Escénicas', 'Exposición', 'Poesía',  'Audiovisual', 'Street Art', 'Taller', 'Otros'];
    var _valuesCategories = ['music', 'arts', 'expo', 'poetry', 'audiovisual', 'street_art', 'workshop', 'other'];
    var _labelsDays = ['Sabado', 'Domingo', 'Ambos dias'];
    var _valuesDays = ['sat', 'sun', 'both'];
    var _labelsTime = ['15 min', '30 min', '45 min', '1 h', '1h 15min', '1h 30min', '1h 45min', '2 h', '2h 15min', '2h 30min'];
    var _valuesTime = ['15', '30', '45', '60', '75', '90', '105', '120', '135', '150'];

    _form['category'] = {
      label: Pard.Widgets.InputLabel('Selecciona una categoría *'), 
      input: Pard.Widgets.Selector(_labelsCategories, _valuesCategories),
      helptext:Pard.Widgets.HelpText('')
    };
    _form['category']['input'].setClass('category-input');

    _form['title'] = {
      label: Pard.Widgets.InputLabel('Título de la propuesta artística *'),
      input: Pard.Widgets.Input('', 'text'),
      helptext: Pard.Widgets.HelpText('')
    };
    _form['title']['input'].setClass('title-input');

    _form['description'] = {
      label: Pard.Widgets.InputLabel('Descripción *'),
      input: Pard.Widgets.TextArea(''),
      helptext: Pard.Widgets.HelpText('Cuéntanos en detalle en que constiste tu propuesta.')
    };
    _form['description']['input'].setClass('description-input');
    _form['description']['input'].setAttr('rows', 4);



    
    _form['short_description'] = { 
      label: Pard.Widgets.InputLabel('Descripción (muy) breve *'),
      input: Pard.Widgets.TextAreaCounter('', 80, 'Es la descripción que aparecerá en el programa de mano del festival. Por motivos de espacio en el papel, está limitada a 80 caracteres. Quedan: '),
      helptext: Pard.Widgets.HelpText('')
    };
    _form['short_description']['input'].setClass('short_description-input');
    _form['short_description']['input'].setAttr('rows',1);

   	
    _form['duration'] = {
      label: Pard.Widgets.InputLabel('Duracción del espectacúlo *'), 
      input: Pard.Widgets.Selector(_labelsTime, _valuesTime),
      helptext: Pard.Widgets.HelpText('')
    };
    _form['duration']['input'].setClass('duration-input');

    
    _form['components'] = {
      label: Pard.Widgets.InputLabel('Numero de integrantes *'),
      input: Pard.Widgets.Input('', 'number'),
      helptext: Pard.Widgets.HelpText('Numero de personas que llevan la actividad/espectaculo.')
    };
    _form['components']['input'].setAttr('min','1');
    _form['components']['input'].setClass('components-input');


    _form['meters'] = {
      label: Pard.Widgets.InputLabel('Espacio necesario para la exposición *'),
      input: Pard.Widgets.Input('', 'text'),
      helptext: Pard.Widgets.HelpText('Indicar cuantos metros cuadrados (y precisar si verticales o horizontales) se piensan necesitar para exponer.')
    };
    _form['meters']['input'].setClass('meters-input');

    
    _form['availability'] = {
      label: Pard.Widgets.InputLabel('Disponibilidad *'),
      input: Pard.Widgets.InputDate(''),
      helptext: Pard.Widgets.HelpText('Selecciona los días que estás disponible para tu participación en el festival.')
    };
    // _form['availability']['input'].setClass('availability-input');

    
    _form['children'] = {
      label: Pard.Widgets.InputLabel(''),
      input: Pard.Widgets.CheckBox('Actividad para un publico infantil', 'yes_children'),
      helptext: Pard.Widgets.HelpText('')
    };
    
    //_form['fotos'] = Pard.Widgets.Input('fotos', 'file');
    
    _form['links'] = {
      label: Pard.Widgets.InputLabel('Links a materiales online'),
      input: Pard.Widgets.InputMultimedia(),
      helptext: Pard.Widgets.HelpText('Añade enlaces a videos, fotos o audios desde tus redes sociales. Este material permitirá dar a conocer tu arte mejor.')
    };
    
    
    _form['sharing'] = {
      label: Pard.Widgets.InputLabel('Materiales a compartir'), 
      input: Pard.Widgets.TextArea(''),
      helptext: Pard.Widgets.HelpText('Material que puedes compartir durante el festival, como: equipo de sonido, altavoces, material de arte plastica, focos de luz, etc.')
    };
    _form['sharing']['input'].setClass('sharing-input');

    
    _form['needs'] = { 
      label: Pard.Widgets.InputLabel('Necesidades'),
      input: Pard.Widgets.TextArea(''),
      helptext: Pard.Widgets.HelpText('Indicar si se tienen especiales necesidades técnicas y de espacio. IMPORTANTE: El festival tendrá lugar en espacios no convencionales y que no podrá hacerse cargo del material necesario para cada actuacción.')
    };
    _form['needs']['input'].setClass('needs-input');

    
    _form['repeat'] = {
      label: Pard.Widgets.InputLabel(''),
      input: Pard.Widgets.CheckBox('Si posible, quiero repetir mi actuacción', 'yes_repeat'),
      helptext: Pard.Widgets.HelpText('')
    };
    
    _form['waiting_list'] = {
      label: Pard.Widgets.InputLabel(''),
      input: Pard.Widgets.CheckBox('En la eventualidad, quiero quedarme en la lista de espera', 'yes_waitig_list'),
      helptext: Pard.Widgets.HelpText('')
    };
    
    _form['phone'] = {
      label: Pard.Widgets.InputLabel('Teléfono de contacto *'), 
      input: Pard.Widgets.InputTel(''),
      helptext:Pard.Widgets.HelpText('Esta información es necesaria para un eventual contacto por parte de la organización del festival.')
    };
    // _form['phone']['input'].setClass('phone-input');

    
    _form['conditions'] = {
      label: Pard.Widgets.InputLabel(''), 
      input: Pard.Widgets.CheckBox(Pard.Forms.Conditions().render(), 'yes_conditions'),
      helptext:Pard.Widgets.HelpText('')
    };

    return {
      render: function(){
        return _form;
      }
    }
  }

  ns.Forms.ModifyProductionForm = function(category){
    var _form = {};
    var _productionForm = Pard.Forms.ArtistCallForm().render();
    
    var _productionFields = Pard.Forms.ArtistCall(category).productionFields();

    _form['category'] = {
      label: Pard.Widgets.InputLabel('Categoría *'), 
      input: Pard.Widgets.Selector([Pard.Widgets.Dictionary(category).render()], [category]),
      helptext:Pard.Widgets.HelpText('No se puede modificar')
    };
    _form['category']['input'].setClass('category-input');;

    _productionFields.forEach(function(_element){
      _form[_element] = _productionForm[_element];
    });


    _form['short_description'] = { 
      label: Pard.Widgets.InputLabel('Descripción (muy) breve *'),
      input: Pard.Widgets.TextAreaCounter('', 80, 'Solo 80 caracteres permitidos. Quedan: '),
      helptext: Pard.Widgets.HelpText('')
    };
    _form['short_description']['input'].setClass('short_description-input');
    _form['short_description']['input'].setAttr('rows',1);

    var _required = Pard.Forms.ArtistCall(category).productionRequired();

    return {
      render: function(){
        return _form;
      },
      requiredFields: function(){
        return _required;
      }
    }
  }


  ns.Forms.ArtistCall = function(artistCategory){

    var _musicArtsOtherFields = ['title', 'description', 'short_description', 'duration', 'components', 'availability', 'children', 'links', 'sharing', 'needs', 'repeat', 'waiting_list', 'phone', 'conditions'];
    var _poetryWorkshopFields = ['title', 'description', 'short_description', 'duration', 'availability', 'children', 'links', 'sharing', 'needs', 'repeat', 'waiting_list', 'phone', 'conditions'];
    var _audiovisualFields = ['title', 'description', 'short_description', 'duration', 'availability', 'children', 'links', 'sharing', 'needs', 'waiting_list', 'phone',  'conditions'];
    var _streetArtFields = ['title', 'description', 'short_description', 'availability', 'links', 'sharing', 'needs', 'waiting_list', 'phone',  'conditions'];
    var _expoFields = ['title', 'description', 'short_description', 'meters', 'links', 'sharing', 'needs', 'waiting_list', 'phone', 'conditions'];


    var _musicArtsOtherRequired = ['title', 'description', 'short_description', 'duration', 'components', 'availability', 'phone', 'conditions','links'];
    var _poetryWorkshopRequired = ['title', 'description', 'short_description', 'duration', 'availability', 'phone', 'conditions','links'];
    var _audiovisualRequired = ['title', 'description', 'short_description', 'duration','availability', 'phone', 'conditions','links'];
    var _streetArtRequired = ['title', 'description', 'short_description', 'phone', 'conditions','links'];
    var _expoRequired = ['title', 'description', 'short_description', 'meters', 'phone', 'conditions','links'];

    var _performanceRequired = ['title', 'description', 'short_description', 'links'];
    var _expoStreetArtRequired = ['title', 'description', 'short_description','links'];

    var _performanceProduction = ['title', 'description', 'short_description', 'duration', 'children', 'links'];
    var _expoStreetArtProduction = ['title', 'description', 'short_description', 'links'];
   
    var _musicArtsOtherSpecificCall = ['availability', 'components',  'sharing', 'needs', 'repeat', 'waiting_list', 'phone', 'conditions'];
    var _poetryWorkshopSpecificCall = ['availability', 'sharing', 'needs', 'repeat', 'waiting_list', 'phone', 'conditions'];
    var _audiovisualSpecificCall = ['availability', 'sharing', 'needs', 'waiting_list', 'phone',  'conditions'];
    var _streetArtSpecificCall = ['availability', 'sharing', 'needs', 'waiting_list', 'phone',  'conditions'];
    var _expoSpecificCall = ['meters', 'sharing', 'needs', 'waiting_list', 'phone', 'conditions'];



    var _fields = {
      'music': _musicArtsOtherFields,
      'arts': _musicArtsOtherFields,
      'other': _musicArtsOtherFields,
      'poetry': _poetryWorkshopFields,
      'expo': _expoFields,
      'street_art': _streetArtFields,
      'workshop': _poetryWorkshopFields,
      'audiovisual': _audiovisualFields
    };

    var _requiredFields = {
      'music': _musicArtsOtherRequired,
      'arts': _musicArtsOtherRequired,
      'other': _musicArtsOtherRequired,
      'poetry': _poetryWorkshopRequired,
      'expo': _expoRequired,
      'street_art': _streetArtRequired,
      'workshop': _poetryWorkshopRequired,
      'audiovisual': _audiovisualRequired
    };

    var _productionFields = {
      'music': _performanceProduction,
      'arts': _performanceProduction,
      'other': _performanceProduction,
      'poetry': _performanceProduction,
      'expo': _expoStreetArtProduction,
      'street_art': _expoStreetArtProduction,
      'workshop': _performanceProduction,
      'audiovisual': _performanceProduction
    };

    var _productionRequired={
      'music': _performanceRequired,
      'arts': _performanceRequired,
      'other': _performanceRequired,
      'poetry': _performanceRequired,
      'expo': _expoStreetArtRequired,
      'street_art': _expoStreetArtRequired,
      'workshop': _performanceRequired,
      'audiovisual': _performanceRequired
    };    

     var _specificCallFields ={
      'music': _musicArtsOtherSpecificCall,
      'arts': _musicArtsOtherSpecificCall,
      'other': _musicArtsOtherSpecificCall,
      'poetry': _poetryWorkshopSpecificCall,
      'expo': _expoSpecificCall,
      'street_art': _streetArtSpecificCall,
      'workshop': _poetryWorkshopSpecificCall,
      'audiovisual': _audiovisualSpecificCall
    };

    var _form = {};
    var _callBycategory = Pard.Forms.ArtistCallForm().render();

    _fields[artistCategory].forEach(function(_element){
      _form[_element] = _callBycategory[_element];
    });

    var _required = _requiredFields[artistCategory];
    var _production = _productionFields[artistCategory];
    var _specificCall = _specificCallFields[artistCategory];
    var _productionNecessary = _productionRequired[artistCategory];


    return {
      render: function(){
        return _form;
      },
      requiredFields: function(){
        return _required;
      }, 
      productionFields: function(){
        return _production;
      },
      specificCallFields: function(){
        return _specificCall;
      },
      productionRequired: function(){
        return _productionNecessary;
      }
    }
  };

}(Pard || {}));
