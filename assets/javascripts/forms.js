(function(ns){

  ns.Forms = ns.Forms || {};


  ns.Forms.BasicArtistForm = function(){

    var _form = {};

    _form['name'] = {
      label: Pard.Widgets.InputLabel('Nombre artistico'),
      input: Pard.Widgets.Input('', 'text'),
      helptext: Pard.Widgets.HelpText('Es el nombre que será asociado con tu perfil de artista.')
    };
    _form['city'] = {
      label: Pard.Widgets.InputLabel('Ciudad'),
      input: Pard.Widgets.Input('', 'text'),
      helptext: Pard.Widgets.HelpText('Indicar tu ciudad hará más facil localizarte para un posibile contacto.')
    };

    _form['zip_code'] = {
      label: Pard.Widgets.InputLabel('Código postal'),
      input: Pard.Widgets.Input('', 'text'),
      helptext: Pard.Widgets.HelpText('Para que aquellos de zona puedan situar tu proyecto en el mapa.')
    };
    _form['color'] = {
      label: Pard.Widgets.InputLabel('Escoge un color'),
      input: Pard.Widgets.Input('', 'color'),
      helptext: Pard.Widgets.HelpText('Es el color personal de tu perfil!')
    };

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

  // ns.Forms.BasicArtistForm = function(){

  // 	var _form = {};

  //   _form['name'] = Pard.Widgets.Input('Nombre artistico', 'text');
  //   _form['city'] = Pard.Widgets.Input('Ciudad', 'text');
  //   _form['zip_code'] = Pard.Widgets.Input('Codigo postal', 'text');
  //   _form['color'] = Pard.Widgets.Input('Color', 'color');

  //   var _requiredFields = ['name', 'city', 'zip_code', 'color'];

  //   return {
  //     render: function(){
  //       return _form;
  //     },
  //     requiredFields: function(){
  //       return _requiredFields;
  //     }
  //   }
  // }

    ns.Forms.BasicSpaceForm = function(){

    var _form = {};

    var _labels = ['Asociacion Cultural', 'Local Comercial', 'Espacio Particular'];
    var _values = ['cultural_ass', 'commercial', 'home'];

    _form['name'] = {
      label: Pard.Widgets.InputLabel('Nombre del espacio'),
      input: Pard.Widgets.Input('', 'text'),
      helptext: Pard.Widgets.HelpText('Es el nombre que será asociado con tu perfil de espacio.')
    };

    _form['address'] ={
      label: Pard.Widgets.InputLabel('Dirección'),
      input: Pard.Widgets.InputAddressSpace('Ej: Carrer de la Murta 13, Valencia'),
      helptext: Pard.Widgets.HelpText('Tu dirección detallada es necesaria para poderte localizar en el mapa.')
    }

    // _form['btn'] = {
    //   label: Pard.Widgets.InputLabel(''),
    //   input: Pard.Widgets.Button('getVal', function(){console.log(_form['address'].input.getVal())}),
    //   helptext: Pard.Widgets.HelpText('')
    // };


    // _form['city'] = {
    //   label: Pard.Widgets.InputLabel('Ciudad'),
    //   input: Pard.Widgets.Input('', 'text'),
    //   helptext: Pard.Widgets.HelpText('')
    // };

    // _form['zip_code'] = {
    //   label: Pard.Widgets.InputLabel('Código postal'),
    //   input: Pard.Widgets.Input('', 'text'),
    //   helptext: Pard.Widgets.HelpText('')
    // };

    _form['category'] = {
      label: Pard.Widgets.InputLabel('Categoría'),
      input: Pard.Widgets.Selector(_labels, _values),
      helptext: Pard.Widgets.HelpText('')
    };

    _form['links'] = {
      label: Pard.Widgets.InputLabel('Web del espacio'),
      input: Pard.Widgets.InputWebs(),
      helptext: Pard.Widgets.HelpText('Añade la web/facebook/blog/etc. de tu espacio y dale un titulo para darla a conocer.')
    };

    _form['color'] = {
      label: Pard.Widgets.InputLabel('Escoge un color'),
      input: Pard.Widgets.Input('', 'color'),
      helptext: Pard.Widgets.HelpText('Es el color personal de tu perfil!')
    };
   
    // var _requiredFields = ['name', 'city', 'address', 'zip_code', 'category', 'color'];

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


  // ns.Forms.BasicSpaceForm = function(){

  // 	var _form = {};

  //   var _labels = ['Asociacion Cultural', 'Local Comercial', 'Espacio Particular'];
  //   var _values = ['cultural_ass', 'commercial', 'home'];

  //   _form['name'] = Pard.Widgets.Input('Nombre espacio', 'text');
  //   _form['city'] = Pard.Widgets.Input('Ciudad', 'text');
  //   _form['address'] = Pard.Widgets.Input('Direccion', 'text');
  //   _form['zip_code'] = Pard.Widgets.Input('Codigo postal', 'text');
  //   _form['category'] = Pard.Widgets.Selector(_labels, _values);
  //   _form['personal_web'] = Pard.Widgets.Input('Web personal', 'url');
  //   _form['color'] = Pard.Widgets.Input('Color', 'color');

  //   var _requiredFields = ['name', 'city', 'address', 'zip_code', 'category', 'color'];


  //   return {
  //     render: function(){
  //       return _form;
  //     },
  //     requiredFields: function(){
  //       return _requiredFields;
  //     }
  //   }
  // }


  ns.Forms.FullArtistForm = function(){


  	var _form = Pard.Forms.BasicArtistForm().render();

    _form['personal_web'] = {
      label: Pard.Widgets.InputLabel('Web personal'),
      input: Pard.Widgets.InputPersonalWeb(),
      helptext: Pard.Widgets.HelpText('Añade un enlace a una web tuya (y dale un titulo) para darla a conocer.')
    };
    _form['bio'] = {
      label: Pard.Widgets.InputLabel('Bio'),
      input: Pard.Widgets.TextArea(''),
      helptext: Pard.Widgets.HelpText('Cualquier cosa que quieras compartir sobre tu vida artistica-cultural.')
    };
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

    // _form['links'] = {
    //   label: Pard.Widgets.InputLabel('Links del espacio'),
    //   input: Pard.Widgets.InputWebs(),
    //   helptext: Pard.Widgets.HelpText('Añade la web/facebook/blog/etc. de tu espacio y dale un titulo para darla a conocer.')
    // };

    // _form['bio'] = Pard.Widgets.TextArea('Bio');

    _form['bio'] = {
      label: Pard.Widgets.InputLabel('Bio'),
      input: Pard.Widgets.TextArea(''),
      helptext: Pard.Widgets.HelpText('Cualquier cosa que quieras compartir sobre tu espacio.')
    };

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

  // ns.Forms.FullSpaceForm = function(){

  //   var _form = Pard.Forms.BasicSpaceForm().render();

  //   _form['links'] = _form['personal_web'] = Pard.Widgets.Input('Web personal', 'url');
  //   _form['bio'] = Pard.Widgets.TextArea('Bio');
  //   //_form['fotos'] = Pard.Widgets.Input('Fotos', 'file');


  //   var _requiredFields = ['name', 'city', 'address', 'zip_code', 'category'];

  //   return {
  //     render: function(){
  //       return _form;
  //     },
  //     requiredFields: function(){
  //       return _requiredFields;
  //     }
  //   }
  // }


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

    _form['responsible'] = {
      label: Pard.Widgets.InputLabel('Nombre del responsable del espacio'),
      input: Pard.Widgets.Input('','text'),
      helptext: Pard.Widgets.HelpText('La persona que se responsabiliza de la colaboración con el festival por la programación y gestión del espacio.')
    };

    _form['description'] = {
      label: Pard.Widgets.InputLabel('Descripcion del espacio disponible y superficies para murales'),
      input: Pard.Widgets.TextArea(''),
      helptext: Pard.Widgets.HelpText('Numero de habitaciones, dimensiones aproximativas, paredes o persianas para intervenciones de arte urbana, etc.')
    };

    // _form['description'] = Pard.Widgets.TextArea('Descripcion del espacio disponible');
    _form['availability'] = {
      label: Pard.Widgets.InputLabel('Disponibilidad'),
      input: Pard.Widgets.InputDate(''),
      // input: Pard.Widgets.Selector(_labels, _values),
      helptext: Pard.Widgets.HelpText('Selecciona los días que quieres compartir tu espacio.')
    }
    
    _form['own'] = {
      label: Pard.Widgets.InputLabel('Programacion propia'), 
      input: Pard.Widgets.TextArea(''),
      helptext:Pard.Widgets.HelpText('Indicar el nombre y los horarios de actuacción de los artistas ya programados. IMPORTANTE: Los artistas también tendrán que apuntarse en la convocatoria y comunicar a través de la misma el espacio donde actuarán.')
    }

    _form['un_wanted'] = {
      label: Pard.Widgets.InputLabel('Preferencias de actividades'), 
      input: Pard.Widgets.TextArea(''),
      helptext:Pard.Widgets.HelpText('Indicar tanto las actividades que NO quieres en tu espacio como las que te gustaría hospedar.')
    }

    _form['sharing'] = {
      label: Pard.Widgets.InputLabel('Materiales a compartir'), 
      input: Pard.Widgets.TextArea(''),
      helptext:Pard.Widgets.HelpText('Material que puedes compartir durante el festival como equipo de sonido, altavoces, material de arte platica, focos de luz...')
    }

    _form['phone'] = {
      label: Pard.Widgets.InputLabel('Telefono de contacto'), 
      input: Pard.Widgets.InputTel(''),
      helptext:Pard.Widgets.HelpText('Este información en ningún momento será publica. Es necesaria para que en caso de necesidad la organización del festival pueda contactar rapidamente contigo.')
    }
    
    _form['conditions'] = {
      label: Pard.Widgets.InputLabel(''), 
      input: Pard.Widgets.CheckBox(_conditions, 'yes_conditions'),
      helptext:Pard.Widgets.HelpText('')
    }

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


  // ns.Forms.SpaceCall = function() {

  //   var _form = {};
  //   var _labels = ['Ambos dias', 'Sabado', 'Domingo'];
  //   var _values = ['both', 'sat', 'sun'];

  //   var _linkToConditions = $('<a>').attr({href: 'http://beniconfusionfest.es/?q=es/page/bases-de-participaci%C3%B3n', target: '_blank'}).text('bases de participación')
  //   var _conditions = $('<p>').text('Acepto las ').append(_linkToConditions);

  //   _form['description'] = Pard.Widgets.TextArea('Descripcion del espacio disponible');
  //   _form['availability'] = Pard.Widgets.Selector(_labels, _values);
  //   _form['own'] = Pard.Widgets.TextArea('Programacion propia');
  //   _form['sharing'] = Pard.Widgets.TextArea('Materiales a compartir');
  //   _form['phone'] = Pard.Widgets.Input('Telefono de contacto', 'text');
  //   _form['conditions'] = Pard.Widgets.CheckBox(_conditions, 'yes_conditions');

  //   var _requiredFields = ['phone', 'description', 'conditions']

  //   return {
  //     render: function(){
  //       return _form;
  //     },
  //     requiredFields: function(){
  //       return _requiredFields;
  //     }
  //   }
  // }




    ns.Forms.ArtistCallForm = function() {

		var _form = {};

    var _labelsCategories = ['Musica', 'Artes Escénicas', 'Exposición', 'Poesía',  'Audiovisual', 'Street Art', 'Taller', 'Otros'];
    var _valuesCategories = ['music', 'arts', 'expo', 'poetry', 'audiovisual', 'street_art', 'workshop', 'other'];
    var _labelsDays = ['Sabado', 'Domingo', 'Ambos dias'];
    var _valuesDays = ['sat', 'sun', 'both'];
    var _labelsTime = ['15 min', '30 min', '45 min', '1 h', '1h 15min', '1h 30 min', '1h 45min', '2 h', '2h 15min', '2h 30min'];
    var _valuesTime = ['15', '30', '45', '60', '75', '90', '105', '120', '135', '150'];

    var _linkToConditions = $('<a>').attr({href: 'http://beniconfusionfest.es/?q=es/page/bases-de-participaci%C3%B3n', target: '_blank'}).text('bases de participación')
    var _conditions = $('<p>').text('Acepto las ').append(_linkToConditions);

    _form['category'] = {
      label: Pard.Widgets.InputLabel('Categoría'), 
      input: Pard.Widgets.Selector(_labelsCategories, _valuesCategories),
      helptext:Pard.Widgets.HelpText('')
    };
    _form['title'] = {
      label: Pard.Widgets.InputLabel('Título de la propuesta artística'),
      input: Pard.Widgets.Input('', 'text'),
      helptext: Pard.Widgets.HelpText('')
    };
    _form['description'] = {
      label: Pard.Widgets.InputLabel('Decripción'),
      input: Pard.Widgets.TextArea(''),
      helptext: Pard.Widgets.HelpText('Cuéntanos en detalle en que constiste tu propuesta.')
    };
    _form['short_description'] = { 
      label: Pard.Widgets.InputLabel('Decripción (muy) breve'),
      input: Pard.Widgets.Input('', 'text').setAttr('maxlength','80'),
      helptext: Pard.Widgets.HelpText('Máximo 80 caracteres! Es la descripción que aparecerá en el programa de mano del festival.')
    };
   	_form['duration'] = {
      label: Pard.Widgets.InputLabel('Duracción del espectaculo'), 
      input: Pard.Widgets.Selector(_labelsTime, _valuesTime),
      helptext: Pard.Widgets.HelpText('')
    };
    _form['components'] = {
      label: Pard.Widgets.InputLabel('Numero de integrantes'),
      input: Pard.Widgets.Input('', 'number').setAttr('min','0'),
      helptext: Pard.Widgets.HelpText('Numero de personas que llevan la actividad/espectaculo.')
    };
    _form['meters'] = {
      label: Pard.Widgets.InputLabel('Espacio necesario para la expo'),
      input: Pard.Widgets.Input('', 'text'),
      helptext: Pard.Widgets.HelpText('Indicar cuantos metros cuadrados (y precisar si verticales o horizontales) se piensan necesitar para exponer.')
    };
    _form['availability'] = {
      label: Pard.Widgets.InputLabel('Disponibilidad'),
      input: Pard.Widgets.InputDate(''),
      helptext: Pard.Widgets.HelpText('Selecciona los días que estás disponible para tu participación en el festival.')
    };
    _form['children'] = {
      label: Pard.Widgets.InputLabel(''),
      input: Pard.Widgets.CheckBox('Actividad para un publico infantil', 'yes_children');
      helptext: Pard.Widgets.HelpText('')
    };
    //_form['fotos'] = Pard.Widgets.Input('fotos', 'file');
    _form['links'] = {
      label: Pard.Widgets.InputLabel('Links a materiales online'),
      input: Pard.Widgets.InputWebs(),
      helptext: Pard.Widgets.HelpText('Añade enlaces a webs/videos/galerías de fotos/blogs/ect. relacionados con tu propuesta y da un titulo cada uno. Este material permitirá dar a conocer tu arte mejor.')
    };
    _form['sharing'] = {
      label: Pard.Widgets.InputLabel('Materiales a compartir'), 
      input: Pard.Widgets.TextArea(''),
      helptext: Pard.Widgets.HelpText('Material que puedes compartir durante el festival, como: equipo de sonido, altavoces, material de arte platica, focos de luz, etc.')
    };
    _form['needs'] = { 
      label: Pard.Widgets.InputLabel('Necesidades'),
      input: Pard.Widgets.TextArea('');
      helptext: Pard.Widgets.HelpText('Indicar si se tienen especiales necesidades técnicas y de espacio. IMPORTANTE: El festival tendrá lugar en espacios no convencionales y que no podrá hacerse cargo del material necesario para cada actuacción.')
    };
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
      label: Pard.Widgets.InputLabel('Telefono de contacto'), 
      input: Pard.Widgets.InputTel(''),
      helptext:Pard.Widgets.HelpText('Este información en ningún momento será publica. Es necesaria para que en caso de necesidad la organización del festival pueda contactar rapidamente contigo.')
    };
    _form['conditions'] = {
      label: Pard.Widgets.InputLabel(''), 
      input: Pard.Widgets.CheckBox(_conditions, 'yes_conditions'),
      helptext:Pard.Widgets.HelpText('')
    };

    return {
      render: function(){
        return _form;
      }
    }
  }

  ns.Forms.ArtisticProduction = function(){
    var _form = {};
    var _productionForm = Pard.Forms.ArtistCallForm().render();
    var _fields =['category', 'title', 'description', 'short_description', 'duration', 'children'];

    _fields.forEach(function(_element){
      _form[_element] = _productionForm[_element];
    });

    var _required = _fields;

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
