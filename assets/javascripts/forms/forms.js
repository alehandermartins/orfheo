'use strict';

(function(ns){

  ns.Forms = ns.Forms || {};
 
  ns.Forms.CreateProfile = {
    artist: {
      name: {
        "type" : "mandatory",
        "label" : Pard.t.text('createProfile.artistForm.nameL'),
        "input" : "InputName",
        "args" : [], 
        "helptext" : Pard.t.text('createProfile.artistForm.nameH')
      },
      profile_picture:{
        "type" : "optional",
        "label" : Pard.t.text('createProfile.artistForm.photoL'),
        "input" : "UploadPhotos",
        "args" : [ 
                  "/profile_picture", 
                  1
                ],
        "helptext" : ""
            },
      bio:{
        "type" : "optional",
        "label" : Pard.t.text('createProfile.artistForm.bioL'),
        "input" : "TextAreaEnriched",
        "args" : [ 
                  "", 
                  4
                ],
        "helptext" : Pard.t.text('createProfile.artistForm.bioH')
      },
      address:{
        "type" : "mandatory",
        "label" : Pard.t.text('createProfile.artistForm.addressL'),
        "input" : "InputAddressArtist",
        "args" : null,
        "helptext" : Pard.t.text('createProfile.artistForm.addressH')
      },
      phone: {
        "type" : "optional",
        "label" : Pard.t.text('createProfile.artistForm.phoneL'),
        "input" : "InputTel",
        "args" : ['',true],
        "helptext" : ""
      },
      personal_web:{
        "type" : "optional",
        "label" : Pard.t.text('createProfile.artistForm.webL'),
        "input" : "InputPersonalWeb",
        "args" : null,
        "helptext" : Pard.t.text('createProfile.artistForm.webH')
      },
      color:{
        "type" : "optional",
        "label" : Pard.t.text('createProfile.artistForm.colorL'),
        "input" : "InputColor",
        "args" : null,
        "helptext" : Pard.t.text('createProfile.artistForm.colorH')
      }
    },
    space:{
      name: {
        "type" : "mandatory",
        "label" : "Nombre del espacio",
        "input" : "InputName",
        "args" : [],
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
                ['Asociación Cultural', 'Local Comercial', 'Espacio Particular', 'Espacio Exterior'],
                ['cultural_ass', 'commercial', 'home', 'open_air'],
                null,
                'Selecciona'
              ] ,
        'helptext':''
      },
      bio:{
        "type" : "mandatory",
        "label" : "Descripción / Información",
        "input" : "TextAreaEnriched",
        "args" : [ 
                  'Dimensiones, caracteristicas, actividades que suele hospedar, etc.', 
                  4
                ],
        "helptext" : "Cualquier cosa que quieras compartir sobre tu espacio."
      },
      phone: {
        "type" : "optional",
        "label" : "Numero de teléfono",
        "input" : "InputTel",
        "args" : ['',true],
        "helptext" : ""
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
        "label" : "Nombre de la organización",
        "input" : "Input",
        "input" : "InputName",
        "args" : [],
        "helptext" : "Es el nombre de tu perfil organización."
      },
      category: {
        'type': 'mandatory',
        'label': "Tipo de organización",
        'input': 'Selector',
        'args': [
                ['Festival', 'Asociación', 'ONG', 'Federación','Colectivo', 'Empresa', 'Institución'],
                ['festival', 'association', 'ngo', 'federation','collective', 'interprise', 'institution', 'foundation'],
                null,
                'Selecciona'
              ] ,
        'helptext':''
      },
      // profile_picture:{
      //   "type" : "optional",
      //   "label" : "Foto de perfil (máximo 500kb)",
      //   "input" : "UploadPhotos",
      //   "args" : [ 
      //             "/profile_picture", 
      //             1
      //           ],
      //   "helptext" : ""
      // },
      address:{
        "type" : "mandatory",
        "label" : "Dirección de la sede de la organización",
        "input" : "InputAddressSpace",
        "args" : [
                  'Ej: Carrer de la Murta 13, Valencia'
                ],
        "helptext" : ""
      },
      bio:{
        "type" : "optional",
        "label" : "Información / Proyecto",
        "input" : "TextAreaEnriched",
        "args" : [ 
                  "", 
                  4
                ],
        "helptext" : "Cualquier cosa que quieras compartir sobre la organización."
      },
      phone: {
        "type" : "optional",
        "label" : "Numero de teléfono",
        "input" : "InputTel",
        "args" : ['',true],
        "helptext" : ""
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
        "label" : "Fotos (máximo 5, tamaño inferior a 500kb)",
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
    }
  }


  ns.Forms.ModifyProfile =  {
    artist: {
      name: {
        "type" : "mandatory",
        "label" : "Nombre artistico",
        "input" : "InputName",
        "args" : [],
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
        "input" : "TextAreaEnriched",
        "args" : [ 
                  "", 
                  4
                ],
        "helptext" : "Cualquier cosa que quieras compartir sobre tu vida artística-cultural."
      },
      address:{
        "type" : "mandatory",
        "label" : "Ciudad, Código postal y Barrio",
        "input" : "InputAddressArtist",
        "args" : null,
        "helptext" : "Indicar tu ciudad, barrio y código postal hará más facil localizarte para un posible contacto."
      },
      phone: {
        "type" : "optional",
        "label" : "Numero de teléfono",
        "input" : "InputTel",
        "args" : ['',true],
        "helptext" : ""
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
        "input" : "InputName",
        "args" : [],
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
                ['Asociacion Cultural', 'Local Comercial', 'Espacio Particular', 'Espacio Exterior'],
                ['cultural_ass', 'commercial', 'home', 'open_air']
              ] ,
        'helptext':''
      },
      bio:{
        "type" : "mandatory",
        "label" : "Descripción / Información",
        "input" : "TextAreaEnriched",
        "args" : [ 
                  'Dimensiones, caracteristicas, actividades que suele hospedar, etc.', 
                  4
                ],
        "helptext" : "Cualquier cosa que quieras compartir sobre tu espacio."
      },
      phone: {
        "type" : "optional",
        "label" : "Numero de teléfono",
        "input" : "InputTel",
        "args" : ['',true],
        "helptext" : ""
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
        "label" : "Nombre de la organización",
        "input" : "Input",
        "input" : "InputName",
        "args" : [],
        "helptext" : "Es el nombre de tu perfil organización."
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
      category: {
        'type': 'mandatory',
        'label': "Tipo de organización",
        'input': 'Selector',
        'args': [
                ['Festival', 'Asociación', 'ONG', 'Federación', 'Colectivo', 'Empresa', 'Institución'],
                ['festival', 'association', 'ngo', 'federation','collective', 'interprise', 'institution', 'foundation']
              ] ,
        'helptext':''
      },
      address:{
        "type" : "mandatory",
        "label" : "Dirección de la sede de la organización",
        "input" : "InputAddressSpace",
        "args" : [
                  'Ej: Carrer de la Murta 13, Valencia'
                ],
        "helptext" : ""
      },
      bio:{
        "type" : "optional",
        "label" : "Información / Proyecto",
        "input" : "TextAreaEnriched",
        "args" : [ 
                  "", 
                  4
                ],
        "helptext" : "Cualquier cosa que quieras compartir sobre la organización."
      },
      phone: {
        "type" : "optional",
        "label" : "Numero de teléfono",
        "input" : "InputTel",
        "args" : ['',true],
        "helptext" : ""
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
    }
  }
  

  ns.Forms.Proposal = {
    space:{
      name: {
        "type" : "mandatory",
        "label" : "Nombre",
        "input" : "InputName",
        "args" : [],
        "helptext" : ""
      },
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
        "input" : "TextAreaEnriched",
        "args" : [ 
                  'Dimensiones, caracteristicas, actividades que suele hospedar, etc.', 
                  4
                ],
        "helptext" : ""
      }
    },
    artist: {
      name: {
        "type" : "mandatory",
        "label" : "Nombre",
        "input" : "InputName",
        "args" : [],
        "helptext" : ""
      },
      email: {
        "type" : "mandatory",
        "label" : "Correo",
        "input" : "Input",
        "args" : [ 
                  "", 
                  "text"
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
        "args" : ['', 'text'],
        "helptext" : ""
      },
    description: {
      'type':'mandatory',
      'label':'Descripción',
      'input':'TextAreaEnriched',
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
              "none",
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
      "label" : "Edades público",
      "input" : "InputChildren",
      "args" : null,
      "helptext" : "Indicar a qué tipo de público está dirigida la propuesta."
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
    },
    cache:{
      "type" : "optional",
      "label" : "Caché / Gastos Producción",
      "input" : "InputCache",
      "args" : ['',true],
      "helptext" : ""
    }
  }


  ns.Forms.FieldsForms = function(categorySelected){

    var _createExpoFields = ['title', 'short_description', 'description','links','photos', 'cache'];
    var _createShowFields = ['title', 'short_description', 'description', 'duration', 'children','links','photos', 'cache'];
    var _createStreetArtFields = ['title', 'short_description', 'description','links','photos', 'cache'];
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

    var _modifyExpoFields = ['title', 'short_description', 'description', 'cache'];
    var _modifyShowFields = ['title', 'short_description', 'description', 'duration', 'children', 'cache'];
    var _modifyStreetArtFields = ['title', 'short_description', 'description', 'cache'];
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

    var _createOwnExpoFields = ['name', 'title', 'short_description', 'email', 'phone'];
    var _createOwnShowFields = ['name', 'title', 'short_description', 'duration', 'availability', 'children', 'email', 'phone'];
    var _createOwnStreetArtFields = ['name', 'title', 'short_description', 'availability', 'email', 'phone'];

    var _createOwnProposalFields = {
      'expo': _createOwnExpoFields,
      'music': _createOwnShowFields,
      'arts': _createOwnShowFields,
      'other': _createOwnShowFields,
      'poetry': _createOwnShowFields,
      'street_art': _createOwnStreetArtFields,
      'workshop': _createOwnShowFields,
      'gastronomy': _createOwnShowFields,
      'audiovisual': _createOwnShowFields,
    };

    return {
      createProduction: function(){
        return _createProductionFields[categorySelected];
      },
      modifyProduction: function(){
        return _modifyProductionFields[categorySelected];
      },
      createOwnProposal: function(){
        return _createOwnProposalFields[categorySelected];        
      }
    }    
  }

}(Pard || {}));
