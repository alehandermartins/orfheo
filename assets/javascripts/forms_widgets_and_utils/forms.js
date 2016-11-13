'use strict';

(function(ns){

  ns.Forms = ns.Forms || {};
 
  ns.Forms.CreateProfile = {
    artist: {
      name: {
        "type" : "mandatory",
        "label" : "Nombre artistico",
        "input" : "Input",
        "args" : [ 
                  "", 
                  "text"
                ],
        "helptext" : "Es el nombre de tu perfil de artista."
      },
      profile_picture:{
        "type" : "optional",
        "label" : "Foto de perfil (máximo 500kb)",
        "input" : "UploadPhotos",
        "args" : [ 
                  "/profile_picture", 
                  1
                ],
        "helptext" : ""
            },
      bio:{
        "type" : "optional",
        "label" : "Biografía / Información",
        "input" : "TextArea",
        "args" : [ 
                  "", 
                  4
                ],
        "helptext" : "Cualquier cosa que quieras compartir sobre tu vida artística-cultural."
      },
      address:{
        "type" : "mandatory",
        "label" : "Ciudad y Código postal",
        "input" : "InputAddressArtist",
        "args" : null,
        "helptext" : "Indicar tu ciudad y código postal hará más facil localizarte para un posible contacto."
      },
      personal_web:{
        "type" : "optional",
        "label" : "Web personal y enlaces a redes sociales",
        "input" : "InputPersonalWeb",
        "args" : null,
        "helptext" : "Puedes añadir enlaces tanto a tus webs o blogs personales como a tus perfiles en redes sociales (las fotos y vídeos se gestionan junto con tu propuesta artística)."
      },
      color:{
        "type" : "optional",
        "label" : "Escoge un color",
        "input" : "InputColor",
        "args" : null,
        "helptext" : "Es el color personal de tu perfil!"
      }
    },
    space:{
      name: {
        "type" : "mandatory",
        "label" : "Nombre del espacio",
        "input" : "Input",
        "args" : [ 
                  "", 
                  "text"
                ],
        "helptext" : "Es el nombre de tu perfil de espacio."
      },
      address:{
        "type" : "mandatory",
        "label" : "Dirección",
        "input" : "InputAddressSpace",
        "args" : [
                  'Ej: Carrer de la Murta 13, Valencia'
                ],
        "helptext" : ""
      },
      category: {
        'type': 'mandatory',
        'label': "Tipo de espacio",
        'input': 'Selector',
        'args': [
                ['Asociacion Cultural', 'Local Comercial', 'Espacio Particular'],
                ['cultural_ass', 'commercial', 'home']
              ] ,
        'helptext':''
      },
      bio:{
        "type" : "mandatory",
        "label" : "Descripción / Información",
        "input" : "TextArea",
        "args" : [ 
                  'Dimensiones, caracteristicas, actividades que suele hospedar, etc.', 
                  4
                ],
        "helptext" : "Cualquier cosa que quieras compartir sobre tu espacio."
      },
      personal_web:{
        "type" : "optional",
        "label" : "Web personal y enlaces a redes sociales",
        "input" : "InputPersonalWeb",
        "args" : null,
        "helptext" : "Puedes añadir enlaces tanto a tus webs o blogs personales como a tus perfiles en redes sociales."
      },
      links : {
        "type": "optional",
        "label": 'Materiales online',
        "input": "InputMultimedia",
        "args": null,
        "helptext": 'Añade vídeos, fotos y audios desde tus redes sociales.'
      },
      photos:{
        "type" : "optional",
        "label" : "Fotos del espacio (máximo 5, tamaño inferior a 500kb)",
        "input" : "UploadPhotos",
        "args" : [ 
                  "/photos", 
                  5
                ],
        "helptext" : "La primera foto será tu foto de perfil."
      },
      color:{
        "type" : "optional",
        "label" : "Escoge un color",
        "input" : "InputColor",
        "args" : null,
        "helptext" : "Es el color personal de tu perfil!"
      }
    },
    organization:{
      name: {
        "type" : "mandatory",
        "label" : "Nombre artistico",
        "input" : "Input",
        "args" : [ 
                  "", 
                  "text"
                ],
        "helptext" : "Es el nombre de tu perfil de artista."
      },
      profile_picture:{
        "type" : "optional",
        "label" : "Foto de perfil (máximo 500kb)",
        "input" : "UploadPhotos",
        "args" : [ 
                  "/profile_picture", 
                  1
                ],
        "helptext" : ""
            },
      bio:{
        "type" : "optional",
        "label" : "Biografía / Información",
        "input" : "TextArea",
        "args" : [ 
                  "", 
                  4
                ],
        "helptext" : "Cualquier cosa que quieras compartir sobre tu vida artística-cultural."
      },
      address:{
        "type" : "mandatory",
        "label" : "Ciudad y Código postal",
        "input" : "InputAddressArtist",
        "args" : null,
        "helptext" : "Indicar tu ciudad y código postal hará más facil localizarte para un posible contacto."
      },
      personal_web:{
        "type" : "optional",
        "label" : "Web personal y enlaces a redes sociales",
        "input" : "InputPersonalWeb",
        "args" : null,
        "helptext" : "Puedes añadir enlaces tanto a tus webs o blogs personales como a tus perfiles en redes sociales (las fotos y vídeos se gestionan junto con tu propuesta artística)."
      },
      color:{
        "type" : "optional",
        "label" : "Escoge un color",
        "input" : "InputColor",
        "args" : null,
        "helptext" : "Es el color personal de tu perfil!"
      }
    }
  }


  ns.Forms.ModifyProfile =  {
    artist: {
      name: {
        "type" : "mandatory",
        "label" : "Nombre artistico",
        "input" : "Input",
        "args" : [ 
                  "", 
                  "text"
                ],
        "helptext" : "Es el nombre de tu perfil de artista."
      },
      profile_picture:{
        "type" : "optional",
        "label" : "Foto de perfil (máximo 500kb)",
        "input" : "UploadPhotos",
        "args" : [ 
                  "/profile_picture", 
                  1
                ],
        "helptext" : ""
            },
      bio:{
        "type" : "optional",
        "label" : "Biografía / Información",
        "input" : "TextArea",
        "args" : [ 
                  "", 
                  4
                ],
        "helptext" : "Cualquier cosa que quieras compartir sobre tu vida artística-cultural."
      },
      address:{
        "type" : "mandatory",
        "label" : "Ciudad y Código postal",
        "input" : "InputAddressArtist",
        "args" : null,
        "helptext" : "Indicar tu ciudad y código postal hará más facil localizarte para un posible contacto."
      },
      personal_web:{
        "type" : "optional",
        "label" : "Web personal y enlaces a redes sociales",
        "input" : "InputPersonalWeb",
        "args" : null,
        "helptext" : "Puedes añadir enlaces tanto a tus webs o blogs personales como a tus perfiles en redes sociales (las fotos y vídeos se gestionan junto con tu propuesta artística)."
      },
      color:{
        "type" : "optional",
        "label" : "Escoge un color",
        "input" : "InputColor",
        "args" : null,
        "helptext" : "Es el color personal de tu perfil!"
      }
    },
    space:{
      name: {
        "type" : "mandatory",
        "label" : "Nombre del espacio",
        "input" : "Input",
        "args" : [ 
                  "", 
                  "text"
                ],
        "helptext" : "Es el nombre de tu perfil de espacio."
      },
      profile_picture:{
        "type" : "optional",
        "label" : "Foto de perfil (máximo 500kb)",
        "input" : "UploadPhotos",
        "args" : [ 
                  "/profile_picture", 
                  1
                ],
        "helptext" : ""
      },
      address:{
        "type" : "mandatory",
        "label" : "Dirección",
        "input" : "InputAddressSpace",
        "args" : [
                  'Ej: Carrer de la Murta 13, Valencia'
                ],
        "helptext" : ""
      },
      category: {
        'type': 'mandatory',
        'label': "Tipo de espacio",
        'input': 'Selector',
        'args': [
                ['Asociacion Cultural', 'Local Comercial', 'Espacio Particular'],
                ['cultural_ass', 'commercial', 'home']
              ] ,
        'helptext':''
      },
      bio:{
        "type" : "mandatory",
        "label" : "Descripción / Información",
        "input" : "TextArea",
        "args" : [ 
                  'Dimensiones, caracteristicas, actividades que suele hospedar, etc.', 
                  4
                ],
        "helptext" : "Cualquier cosa que quieras compartir sobre tu espacio."
      },
      personal_web:{
        "type" : "optional",
        "label" : "Web personal y enlaces a redes sociales",
        "input" : "InputPersonalWeb",
        "args" : null,
        "helptext" : "Puedes añadir enlaces tanto a tus webs o blogs personales como a tus perfiles en redes sociales."
      },
      color:{
        "type" : "optional",
        "label" : "Escoge un color",
        "input" : "InputColor",
        "args" : null,
        "helptext" : "Es el color personal de tu perfil!"
      }
    },
    organization:{
      name: {
        "type" : "mandatory",
        "label" : "Nombre artistico",
        "input" : "Input",
        "args" : [ 
                  "", 
                  "text"
                ],
        "helptext" : "Es el nombre de tu perfil de artista."
      },
      profile_picture:{
        "type" : "optional",
        "label" : "Foto de perfil (máximo 500kb)",
        "input" : "UploadPhotos",
        "args" : [ 
                  "/profile_picture", 
                  1
                ],
        "helptext" : ""
            },
      bio:{
        "type" : "optional",
        "label" : "Descripción / Información",
        "input" : "TextArea",
        "args" : [ 
                  "", 
                  4
                ],
        "helptext" : "Cualquier cosa que quieras compartir sobre la organización"
      },
      address:{
        "type" : "mandatory",
        "label" : "Ciudad y Código postal",
        "input" : "InputAddressArtist",
        "args" : null,
        "helptext" : "Indicar tu ciudad y código postal hará más facil localizarte para un posible contacto."
      },
      personal_web:{
        "type" : "optional",
        "label" : "Web personal y enlaces a redes sociales",
        "input" : "InputPersonalWeb",
        "args" : null,
        "helptext" : "Puedes añadir enlaces tanto a tus webs o blogs personales como a tus perfiles en redes sociales (las fotos y vídeos se gestionan junto con tu propuesta artística)."
      },
      color:{
        "type" : "optional",
        "label" : "Escoge un color",
        "input" : "InputColor",
        "args" : null,
        "helptext" : "Es el color personal de tu perfil!"
      }
    }
  }
  

  ns.Forms.Proposal = {
    space:{
      email: {
        "type" : "mandatory",
        "label" : "Correo",
        "input" : "Input",
        "args" : [ 
                  "", 
                  "text"
                ],
        "helptext" : ""
      },
      address:{
        "type" : "mandatory",
        "label" : "Dirección",
        "input" : "InputAddressSpace",
        "args" : [
                  'Ej: Carrer de la Murta 13, Valencia'
                ],
        "helptext" : ""
      },
      bio:{
        "type" : "mandatory",
        "label" : "Descripción / Información",
        "input" : "TextArea",
        "args" : [ 
                  'Dimensiones, caracteristicas, actividades que suele hospedar, etc.', 
                  4
                ],
        "helptext" : ""
      }
    }
  }

  ns.Forms.Production ={
    title:{
        "type" : "mandatory",
        "label" : "Título de la propuesta artística",
        "input" : "Input",
        "args" : [ 
                  '', 
                  'text'
                ],
        "helptext" : ""
      },
    description: {
      'type':'mandatory',
      'label':'Descripción',
      'input':'TextArea',
      'args':['',4],
      'helptext': 'Decribe con más detalles tu propuesta artística.'
    },
    short_description: { 
      'type':'mandatory',
      'label':'Descripción (muy) breve',
      'input': 'TextAreaCounter',
      'args':['',80,'Resume tu propuesta artística en máximo 80 caracteres. Quedan:'],
      'helptext': ''
    },
    duration : {
      "type" : "optional",
      "label" : "Duración *",
      "input" : "Selector",
      "args" : [ 
          [   
              "No tiene duración definida",
              "15 min", 
              "30 min", 
              "45 min", 
              "1 h", 
              "1h 15min", 
              "1h 30min", 
              "1h 45min", 
              "2 h", 
              "2h 15min", 
              "2h 30min"
          ], 
          [   
              "None",
              "15", 
              "30", 
              "45", 
              "60", 
              "75", 
              "90", 
              "105", 
              "120", 
              "135", 
              "150"
          ]
      ],
      "helptext" : ""
    },
    children : {
      "type" : "optional",
      "label" : "Para niños",
      "input" : "CheckBox",
      "args" : [ 
          "", 
          "yes_children"
      ],
      "helptext" : "Eligir si la actividad está orientada a un publico infantil."
    }, 
    links : {
        "type" : "optional",
        "label" : "Materiales online",
        "input" : "InputMultimedia",
        "args" : null,
        "helptext" : "Añade vídeos, fotos o audios desde tus redes sociales. Este material permitirá dar a conocer tu arte mejor."
    },
    photos : {
        "type" : "optional",
        "label" : "Fotos de tu arte (máximo 4, tamaño inferior a 500kb)",
        "input" : "UploadPhotos",
        "args" : [ 
            "/photos", 
            4
        ],
        "helptext" : ""
    }
  }


  ns.Forms.FieldsForms = function(categorySelected){

    var _createExpoFields = ['title', 'short_description', 'description','links','photos'];
    var _createShowFields = ['title', 'short_description', 'description', 'duration', 'children','links','photos'];
    var _createStreetArtFields = ['title', 'short_description', 'description','links','photos'];
    var _createProductionFields = {
      'expo': _createExpoFields,
      'music': _createShowFields,
      'arts': _createShowFields,
      'poetry': _createShowFields,
      'street_art': _createStreetArtFields,
      'workshop': _createShowFields,
      'audiovisual': _createShowFields,
      'gastronomy': _createShowFields,
      'other': _createShowFields
    };

    var _modifyExpoFields = ['title', 'short_description', 'description','links','photos'];
    var _modifyShowFields = ['title', 'short_description', 'description', 'duration', 'children','links','photos'];
    var _modifyStreetArtFields = ['title', 'short_description', 'description','links','photos'];
    var _modifyProductionFields = {
      'expo': _modifyExpoFields,
      'music': _modifyShowFields,
      'arts': _modifyShowFields,
      'poetry': _modifyShowFields,
      'street_art': _modifyStreetArtFields,
      'workshop': _modifyShowFields,
      'audiovisual': _modifyShowFields,
      'gastronomy': _modifyShowFields,
      'other': _modifyShowFields
    };

    return {
      createProduction: function(){
        return _createProductionFields[categorySelected];
      },
      modifyProduction: function(){
        return _modifyProductionFields[categorySelected];
      }
    }    

  }

  ns.Forms.CreateArtistProposal = function(categorySelected){
    var _form = {};

    var _labelsTime = ['15 min', '30 min', '45 min', '1 h', '1h 15min', '1h 30min', '1h 45min', '2 h', '2h 15min', '2h 30min'];
    var _valuesTime = ['15', '30', '45', '60', '75', '90', '105', '120', '135', '150'];

    var _expoFields = ['name', 'title', 'short_description', 'email', 'phone'];
    var _showField = ['name', 'title', 'short_description', 'duration', 'availability', 'children', 'email', 'phone'];
    var _streetArtFields = ['name', 'title', 'short_description', 'availability', 'email', 'phone'];

    var _expoRequired = ['name', 'title', 'short_description', 'email', 'phone'];
    var _showRequired = ['name', 'title', 'short_description', 'duration', 'availability', 'email', 'phone'];
    var _streetArtRequired = ['name', 'title', 'short_description', 'availability', 'email', 'phone'];

    var _categoryFields = {
      'expo': _expoFields,
      'music': _showField,
      'arts': _showField,
      'other': _showField,
      'poetry': _showField,
      'street_art': _streetArtFields,
      'workshop': _showField,
      'audiovisual': _showField
    };

    var _required = {
      'expo': _expoRequired,
      'music': _showRequired,
      'arts': _showRequired,
      'other': _showRequired,
      'poetry': _showRequired,
      'street_art': _streetArtRequired,
      'workshop': _showRequired,
      'audiovisual': _showRequired
    };


    _form['name'] = {
      label: Pard.Widgets.InputLabel('Nombre artistico *'),
      input: Pard.Widgets.Input('', 'text'),
      helptext: Pard.Widgets.HelpText('Es el nombre de tu perfil de artista.')
    };

    _form['title'] = {
      label: Pard.Widgets.InputLabel('Título de la propuesta artística *'),
      input: Pard.Widgets.Input('', 'text'),
      helptext: Pard.Widgets.HelpText('')
    };
    _form['title']['input'].setClass('title-input');

    _form['short_description'] = { 
      label: Pard.Widgets.InputLabel('Descripción (muy) breve *'),
      input: Pard.Widgets.TextAreaCounter('', 80, 'Es la descripción que aparecerá en el programa del evento en orfheo. Máximo 80 caracteres. Quedan: '),
      helptext: Pard.Widgets.HelpText('')
    };
    _form['short_description']['input'].setClass('short_description-input');
    _form['short_description']['input'].setAttr('rows',1);

    
    _form['duration'] = {
      label: Pard.Widgets.InputLabel('Duración *'), 
      input: Pard.Widgets.Selector(_labelsTime, _valuesTime),
      helptext: Pard.Widgets.HelpText('')
    };
    _form['duration']['input'].setClass('duration-input');

    // _form['components'] = {
    //   label: Pard.Widgets.InputLabel('Número de integrantes *'),
    //   input: Pard.Widgets.Input('', 'number'),
    //   helptext: Pard.Widgets.HelpText('Número de personas que llevan la actividad/espectáculo.')
    // };
    // _form['components']['input'].setAttr('min','1');
    // _form['components']['input'].setClass('components-input');

    _form['availability'] = {
      label: Pard.Widgets.InputLabel('Disponibilidad *'),
      input: Pard.Widgets.InputDate(''),
      helptext: Pard.Widgets.HelpText('Selecciona los días que de disponibilidad en el evento.')
    };
    // _form['availability']['input'].setClass('availability-input');

    
    _form['children'] = {
      label: Pard.Widgets.InputLabel(''),
      input: Pard.Widgets.CheckBox('Actividad orientada a un público infantil', 'yes_children'),
      helptext: Pard.Widgets.HelpText('')
    };

    _form['phone'] = {
      label: Pard.Widgets.InputLabel('Teléfono de contacto *'), 
      input: Pard.Widgets.InputTel(''),
      helptext:Pard.Widgets.HelpText('Teléfono de la persona responsable.')
    }
    _form['phone']['input'].setClass('phone-input');


    _form['email'] = {
      label: Pard.Widgets.InputLabel('Email de contacto *'), 
      input: Pard.Widgets.InputEmail(''),
      helptext:Pard.Widgets.HelpText('Correo de la  persona responsable.')
    }
    

    var _requiredFields = _required[categorySelected];
    var _formDef = {};

    _categoryFields[categorySelected].forEach(function(field){
      _formDef[field] = _form[field];
    });

    return {
      render: function(){
        return _formDef;
      },
      requiredFields: function(){
        return _requiredFields;
      }
    }
  }


   ns.Forms.CreateSpaceProposal = function(categorySelected){
    var _form = {};

    var _labels = ['Asociacion Cultural', 'Local Comercial', 'Espacio Particular', 'Espacio Exterior'];
    var _values = ['cultural_ass', 'commercial', 'home', 'open_air'];

    _form['name'] = {
      label: Pard.Widgets.InputLabel('Nombre del espacio *'),
      input: Pard.Widgets.Input('', 'text'),
      helptext: Pard.Widgets.HelpText('Es el nombre de tu perfil de espacio.')
    };

    _form['address'] ={
      label: Pard.Widgets.InputLabel('Dirección *'),
      input: Pard.Widgets.InputAddressSpace('Ej: Carrer de la Murta 13, Valencia'),
      helptext: Pard.Widgets.HelpText('')
    }

    _form['category'] = {
      label: Pard.Widgets.InputLabel('Tipo de espacio *'),
      input: Pard.Widgets.Selector(_labels, _values),
      helptext: Pard.Widgets.HelpText('')
    };
    _form['category']['input'].setClass('category-input');

    _form['responsible'] = {
      label: Pard.Widgets.InputLabel('Nombre del responsable del espacio *'),
      input: Pard.Widgets.Input('','text'),
      helptext: Pard.Widgets.HelpText('Indicar la persona que se compromete con la programación y gestión del espacio')
    };


    _form['availability'] = {
      label: Pard.Widgets.InputLabel('Disponibilidad *'),
      input: Pard.Widgets.InputDate(''),
      helptext: Pard.Widgets.HelpText('Selecciona los días de disponibilidad del espacio.')
    }

    _form['phone'] = {
      label: Pard.Widgets.InputLabel('Teléfono de contacto *'), 
      input: Pard.Widgets.InputTel(''),
      helptext:Pard.Widgets.HelpText('Teléfono de la persona responsable.')
    }
    _form['phone']['input'].setClass('phone-input');


    _form['email'] = {
      label: Pard.Widgets.InputLabel('Email de contacto *'), 
      input: Pard.Widgets.InputEmail(''),
      helptext:Pard.Widgets.HelpText('Correo de la  persona responsable.')
    }

    var _requiredFields = ['name', 'address', 'category', 'responsible', 'availability', 'email', 'phone'];


    return {
      render: function(){
        return _form;
      },
      requiredFields: function(){
        return _requiredFields;
      }
    }
  }


  // ns.Forms.ModifyProductionForm = function(category){
  //   var _form = {};
  //   var _productionForm = Pard.Forms.ArtistCallForm().render();
    
  //   var _productionFields = Pard.Forms.ArtistCall(category).productionFields();

  //   _form['category'] = {
  //     label: Pard.Widgets.InputLabel('Categoría *'), 
  //     input: Pard.Widgets.Selector([Pard.Widgets.Dictionary(category).render()], [category]),
  //     helptext:Pard.Widgets.HelpText('No se puede modificar')
  //   };
  //   _form['category']['input'].setClass('category-input');;

  //   _productionFields.forEach(function(_element){
  //     _form[_element] = _productionForm[_element];
  //   });


  //   _form['short_description'] = { 
  //     label: Pard.Widgets.InputLabel('Descripción (muy) breve *'),
  //     input: Pard.Widgets.TextAreaCounter('', 80, 'Sólo 80 caracteres permitidos. Quedan: '),
  //     helptext: Pard.Widgets.HelpText('')
  //   };
  //   _form['short_description']['input'].setClass('short_description-input');
  //   _form['short_description']['input'].setAttr('rows',1);

  //   var _required = Pard.Forms.ArtistCall(category).productionRequired();

  //   return {
  //     render: function(){
  //       return _form;
  //     },
  //     requiredFields: function(){
  //       return _required;
  //     }
  //   }
  // }


  ns.Forms.ArtistCallForm = function() {

    var _form = {};

    var _labelsCategories = ['Música', 'Artes Escénicas', 'Exposición', 'Poesía',  'Audiovisual', 'Street Art', 'Taller', 'Otros'];
    var _valuesCategories = ['music', 'arts', 'expo', 'poetry', 'audiovisual', 'street_art', 'workshop', 'other'];
    // var _labelsDays = ['Sabado', 'Domingo', 'Ambos dias'];
    // var _valuesDays = ['sat', 'sun', 'both'];
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
      input: Pard.Widgets.TextAreaCounter('', 80, 'Es la descripción que aparecerá en el programa del evento en orfheo. Máximo 80 caracteres. Quedan: '),
      helptext: Pard.Widgets.HelpText('')
    };
    _form['short_description']['input'].setClass('short_description-input');
    _form['short_description']['input'].setAttr('rows',1);

    
    _form['duration'] = {
      label: Pard.Widgets.InputLabel('Duración del espectáculo *'), 
      input: Pard.Widgets.Selector(_labelsTime, _valuesTime),
      helptext: Pard.Widgets.HelpText('')
    };
    _form['duration']['input'].setClass('duration-input');

    
    _form['components'] = {
      label: Pard.Widgets.InputLabel('Número de integrantes *'),
      input: Pard.Widgets.Input('', 'number'),
      helptext: Pard.Widgets.HelpText('Número de personas que llevan la actividad/espectáculo.')
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
      helptext: Pard.Widgets.HelpText('Selecciona los días que estás disponible para tu participación en el evento.')
    };
    // _form['availability']['input'].setClass('availability-input');

    
    _form['children'] = {
      label: Pard.Widgets.InputLabel(''),
      input: Pard.Widgets.CheckBox('Actividad orientada a un público infantil', 'yes_children'),
      helptext: Pard.Widgets.HelpText('')
    };
    
    //_form['fotos'] = Pard.Widgets.Input('fotos', 'file');
    
    _form['links'] = {
      label: Pard.Widgets.InputLabel('Materiales online'),
      input: Pard.Widgets.InputMultimedia(),
      helptext: Pard.Widgets.HelpText('Añade vídeos, fotos o audios desde tus redes sociales. Este material permitirá dar a conocer tu arte mejor.')
    };
    
    
    _form['sharing'] = {
      label: Pard.Widgets.InputLabel('Materiales a compartir'), 
      input: Pard.Widgets.TextArea(''),
      helptext: Pard.Widgets.HelpText('Material que puedes compartir durante el evento, como: equipo de sonido, altavoces, material de arte plástico, focos de luz, etc.')
    };
    _form['sharing']['input'].setClass('sharing-input');

    
    _form['needs'] = { 
      label: Pard.Widgets.InputLabel('Necesidades'),
      input: Pard.Widgets.TextArea(''),
      helptext: Pard.Widgets.HelpText('Indicar si se tienen necesidades técnicas especiales y/o de espacio. IMPORTANTE: El evento tendrá lugar en espacios no convencionales y no podrá hacerse cargo del material necesario para cada actuacción.')
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
      helptext:Pard.Widgets.HelpText('Esta información es necesaria para un eventual contacto por parte de la organización.')
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

  


  


  ns.Forms.SpaceCall = function() {

		var _form = {};
    var _labels = ['Ambos dias', 'Sabado', 'Domingo'];
    var _values = ['both', 'sat', 'sun'];

    _form['responsible'] = {
      label: Pard.Widgets.InputLabel('Nombre del responsable del espacio *'),
      input: Pard.Widgets.Input('','text'),
      helptext: Pard.Widgets.HelpText('Indicar la persona que se compromete con la programación y gestión del espacio.')
    };

    _form['description'] = {
      label: Pard.Widgets.InputLabel('Descripción del espacio disponible y superficies para murales *'),
      input: Pard.Widgets.TextArea(''),
      helptext: Pard.Widgets.HelpText('Número de habitaciones, dimensiones aproximadas, paredes o persianas para intervenciones de arte urbano, etc.')
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
      helptext:Pard.Widgets.HelpText('Material que puedes compartir durante el evento como equipo de sonido, altavoces, material de arte plástico, focos de luz...')
    }

    _form['phone'] = {
      label: Pard.Widgets.InputLabel('Teléfono de contacto *'), 
      input: Pard.Widgets.InputTel(''),
      helptext:Pard.Widgets.HelpText('Esta información es necesaria para un eventual contacto por parte de la organización.')
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

    var _linkToConditions = $('<a>').attr({href: 'http://beniconfusionfest.es/es/bases', target: '_blank'}).text('bases de participación');
    var _conditions = $('<span>').text('He leído y acepto las condiciones en las ').append(_linkToConditions,' *');

    return{
      render: function(){
        return _conditions;
      }, 
      link: function(){
        return _linkToConditions;
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
