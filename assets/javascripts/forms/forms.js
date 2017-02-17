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
        "label" :  Pard.t.text('createProfile.spaceForm.nameL'),
        "input" : "InputName",
        "args" : [],
        "helptext" : Pard.t.text('createProfile.spaceForm.nameH')
      },
      address:{
        "type" : "mandatory",
        "label" : Pard.t.text('createProfile.spaceForm.addressL'),
        "input" : "InputAddressSpace",
        "args" : [
                  Pard.t.text('createProfile.spaceForm.addressPlaceholder')
                ],
        "helptext" : ""
      },
      category: {
        'type': 'mandatory',
        'label': Pard.t.text('createProfile.spaceForm.catL'),
        'input': 'Selector',
        'args': [
                [Pard.t.text('categories.cultural_ass'), Pard.t.text('categories.commercial'), Pard.t.text('categories.home'), Pard.t.text('categories.open_air')],
                ['cultural_ass', 'commercial', 'home', 'open_air'],
                null,
                Pard.t.text('createProfile.spaceForm.catPlaceholder')
              ] ,
        'helptext':''
      },
      bio:{
        "type" : "mandatory",
        "label" : Pard.t.text('createProfile.spaceForm.bioL'),
        "input" : "TextAreaEnriched",
        "args" : [ 
                  Pard.t.text('createProfile.spaceForm.bioPlaceholder'), 
                  4
                ],
        "helptext" : Pard.t.text('createProfile.spaceForm.bioH')
      },
      phone: {
        "type" : "optional",
        "label" : Pard.t.text('createProfile.spaceForm.phoneL'),
        "input" : "InputTel",
        "args" : ['',true],
        "helptext" : ""
      },
      personal_web:{
        "type" : "optional",
        "label" : Pard.t.text('createProfile.spaceForm.webL'),
        "input" : "InputPersonalWeb",
        "args" : null,
        "helptext" : Pard.t.text('createProfile.spaceForm.webH')
      },
      links : {
        "type": "optional",
        "label": Pard.t.text('createProfile.spaceForm.linksL'),
        "input": "InputMultimedia",
        "args": null,
        "helptext": Pard.t.text('createProfile.spaceForm.linksH')
      },
      photos:{
        "type" : "optional",
        "label" : Pard.t.text('createProfile.spaceForm.photoL'),
        "input" : "UploadPhotos",
        "args" : [ 
                  "/photos", 
                  5
                ],
        "helptext" : Pard.t.text('createProfile.spaceForm.photoH')
      },
      color:{
        "type" : "optional",
        "label" : Pard.t.text('createProfile.artistForm.colorL'),
        "input" : "InputColor",
        "args" : null,
        "helptext" : Pard.t.text('createProfile.artistForm.colorH')
      }
    },
    organization:{
      name: {
        "type" : "mandatory",
        "label" : Pard.t.text('createProfile.organizationForm.nameL'),
        "input" : "Input",
        "input" : "InputName",
        "args" : [],
        "helptext" : Pard.t.text('createProfile.organizationForm.nameH')
      },
      category: {
        'type': 'mandatory',
        'label': Pard.t.text('createProfile.organizationForm.catL'),
        'input': 'Selector',
        'args': [
                [Pard.t.text('categories.festival'), Pard.t.text('categories.association'), Pard.t.text('categories.ngo'), Pard.t.text('categories.federation'), Pard.t.text('categories.collective'), Pard.t.text('categories.interprise'), Pard.t.text('categories.institution'), Pard.t.text('categories.foundation')],
                ['festival', 'association', 'ngo', 'federation','collective', 'interprise', 'institution', 'foundation'],
                null,
                Pard.t.text('createProfile.spaceForm.catPlaceholder')
              ] ,
        'helptext':''
      },
      address:{
        "type" : "mandatory",
        "label" : Pard.t.text('createProfile.organizationForm.addressL'),
        "input" : "InputAddressSpace",
        "args" : [
                  Pard.t.text('createProfile.spaceForm.addressPlaceholder')
                ],
        "helptext" : ""
      },
      bio:{
        "type" : "optional",
        "label" : Pard.t.text('createProfile.organizationForm.bioL'),
        "input" : "TextAreaEnriched",
        "args" : [ 
                  "", 
                  4
                ],
        "helptext" : Pard.t.text('createProfile.organizationForm.bioH')
      },
      phone: {
        "type" : "optional",
        "label" : Pard.t.text('createProfile.spaceForm.phoneL'),
        "input" : "InputTel",
        "args" : ['',true],
        "helptext" : ""
      },
      personal_web:{
        "type" : "optional",
        "label" : Pard.t.text('createProfile.spaceForm.webL'),
        "input" : "InputPersonalWeb",
        "args" : null,
        "helptext" : Pard.t.text('createProfile.spaceForm.webH')
      },
      links : {
        "type": "optional",
        "label": Pard.t.text('createProfile.spaceForm.linksL'),
        "input": "InputMultimedia",
        "args": null,
        "helptext": Pard.t.text('createProfile.spaceForm.linksH')
      },
      photos:{
        "type" : "optional",
        "label" : Pard.t.text('createProfile.spaceForm.photoL'),
        "input" : "UploadPhotos",
        "args" : [ 
                  "/photos", 
                  5
                ],
        "helptext" : Pard.t.text('createProfile.spaceForm.photoH')
      },
      color:{
        "type" : "optional",
        "label" : Pard.t.text('createProfile.artistForm.colorL'),
        "input" : "InputColor",
        "args" : null,
        "helptext" : Pard.t.text('createProfile.artistForm.colorH')
      }
    }
  }


  ns.Forms.ModifyProfile =  {
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
        "label" :  Pard.t.text('createProfile.spaceForm.nameL'),
        "input" : "InputName",
        "args" : [],
        "helptext" : Pard.t.text('createProfile.spaceForm.nameH')
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
      address:{
        "type" : "mandatory",
        "label" : Pard.t.text('createProfile.spaceForm.addressL'),
        "input" : "InputAddressSpace",
        "args" : [
                  Pard.t.text('createProfile.spaceForm.addressPlaceholder')
                ],
        "helptext" : ""
      },
      category: {
        'type': 'mandatory',
        'label': Pard.t.text('createProfile.spaceForm.catL'),
        'input': 'Selector',
        'args': [
                [Pard.t.text('categories.cultural_ass'), Pard.t.text('categories.commercial'), Pard.t.text('categories.home'), Pard.t.text('categories.open_air')],
                ['cultural_ass', 'commercial', 'home', 'open_air'],
                null,
                Pard.t.text('createProfile.spaceForm.catPlaceholder')
              ] ,
        'helptext':''
      },
      bio:{
        "type" : "mandatory",
        "label" : Pard.t.text('createProfile.spaceForm.bioL'),
        "input" : "TextAreaEnriched",
        "args" : [ 
                  Pard.t.text('createProfile.spaceForm.bioPlaceholder'), 
                  4
                ],
        "helptext" : Pard.t.text('createProfile.spaceForm.bioH')
      },
      phone: {
        "type" : "optional",
        "label" : Pard.t.text('createProfile.spaceForm.phoneL'),
        "input" : "InputTel",
        "args" : ['',true],
        "helptext" : ""
      },
      personal_web:{
        "type" : "optional",
        "label" : Pard.t.text('createProfile.spaceForm.webL'),
        "input" : "InputPersonalWeb",
        "args" : null,
        "helptext" : Pard.t.text('createProfile.spaceForm.webH')
      },
      color:{
        "type" : "optional",
        "label" : Pard.t.text('createProfile.artistForm.colorL'),
        "input" : "InputColor",
        "args" : null,
        "helptext" : Pard.t.text('createProfile.artistForm.colorH')
      }
    },
    organization:{
      name: {
        "type" : "mandatory",
        "label" : Pard.t.text('createProfile.organizationForm.nameL'),
        "input" : "Input",
        "input" : "InputName",
        "args" : [],
        "helptext" : Pard.t.text('createProfile.organizationForm.nameH')
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
      category: {
        'type': 'mandatory',
        'label': Pard.t.text('createProfile.organizationForm.catL'),
        'input': 'Selector',
        'args': [
                [Pard.t.text('categories.festival'), Pard.t.text('categories.association'), Pard.t.text('categories.ngo'), Pard.t.text('categories.federation'), Pard.t.text('categories.collective'), Pard.t.text('categories.interprise'), Pard.t.text('categories.institution'), Pard.t.text('categories.foundation')],
                ['festival', 'association', 'ngo', 'federation','collective', 'interprise', 'institution', 'foundation'],
                null,
                Pard.t.text('createProfile.spaceForm.catPlaceholder')
              ] ,
        'helptext':''
      },
      address:{
        "type" : "mandatory",
        "label" : Pard.t.text('createProfile.organizationForm.addressL'),
        "input" : "InputAddressSpace",
        "args" : [
                  Pard.t.text('createProfile.spaceForm.addressPlaceholder')
                ],
        "helptext" : ""
      },
      bio:{
        "type" : "optional",
        "label" : Pard.t.text('createProfile.organizationForm.bioL'),
        "input" : "TextAreaEnriched",
        "args" : [ 
                  "", 
                  4
                ],
        "helptext" : Pard.t.text('createProfile.organizationForm.bioH')
      },
      phone: {
        "type" : "optional",
        "label" : Pard.t.text('createProfile.spaceForm.phoneL'),
        "input" : "InputTel",
        "args" : ['',true],
        "helptext" : ""
      },
      personal_web:{
        "type" : "optional",
        "label" : Pard.t.text('createProfile.spaceForm.webL'),
        "input" : "InputPersonalWeb",
        "args" : null,
        "helptext" : Pard.t.text('createProfile.spaceForm.webH')
      },
      color:{
        "type" : "optional",
        "label" : Pard.t.text('createProfile.artistForm.colorL'),
        "input" : "InputColor",
        "args" : null,
        "helptext" : Pard.t.text('createProfile.artistForm.colorH')
      }
    }
  }
  

  ns.Forms.Proposal = {
    space:{
      name: {
        "type" : "mandatory",
        "label" : Pard.t.text('proposal.form.nameL'),
        "input" : "InputName",
        "args" : [],
        "helptext" : ""
      },
      email: {
        "type" : "mandatory",
        "label" : Pard.t.text('proposal.form.emailL'),
        "input" : "Input",
        "args" : [ 
                  "", 
                  "text"
                ],
        "helptext" : ""
      },
      address:{
        "type" : "mandatory",
        "label" : Pard.t.text('proposal.form.addressL'),
        "input" : "InputAddressSpace",
        "args" : [
                  Pard.t.text('createProfile.spaceForm.addressPlaceholder')
                ],
        "helptext" : ""
      },
      bio:{
        "type" : "mandatory",
        "label" : Pard.t.text('proposal.form.bioL'),
        "input" : "TextAreaEnriched",
        "args" : [ 
                  Pard.t.text('createProfile.spaceForm.bioPlaceholder'), 
                  4
                ],
        "helptext" : ""
      }
    },
    artist: {
      name: {
        "type" : "mandatory",
        "label" : Pard.t.text('proposal.form.nameL'),
        "input" : "InputName",
        "args" : [],
        "helptext" : ""
      },
      email: {
        "type" : "mandatory",
        "label" : Pard.t.text('proposal.form.emailL'),
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
        "label" : Pard.t.text('production.form.titleL'),
        "input" : "Input",
        "args" : ['', 'text'],
        "helptext" : ""
      },
    description: {
      'type':'mandatory',
      'label':Pard.t.text('production.form.descriptionL'),
      'input':'TextAreaEnriched',
      'args':['',4],
      'helptext': Pard.t.text('production.form.descriptionH')
    },
    short_description: { 
      'type':'mandatory',
      'label': Pard.t.text('production.form.short_descriptionL'),
      'input': 'TextAreaCounter',
      'args':['',80,Pard.t.text('production.form.short_descriptionH')],
      'helptext': ''
    },
    duration : {
      "type" : "optional",
      "label" : Pard.t.text('production.form.durationL'),
      "input" : "Selector",
      "args" : [ 
          [   
              Pard.t.text('production.form.noDefinedDuration'),
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
      "label" : Pard.t.text('production.form.childrenL'),
      "input" : "InputChildren",
      "args" : null,
      "helptext" : Pard.t.text('production.form.childrenH')
    }, 
    links : {
        "type" : "optional",
        "label" : Pard.t.text('production.form.linksL'),
        "input" : "InputMultimedia",
        "args" : null,
        "helptext" : Pard.t.text('production.form.linksH')
    },
    photos : {
        "type" : "optional",
        "label" : Pard.t.text('production.form.photoL'),
        "input" : "UploadPhotos",
        "args" : [ 
            "/photos", 
            4
        ],
        "helptext" : ""
    },
    cache:{
      "type" : "optional",
      "label" : Pard.t.text('production.form.cacheL'),
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
