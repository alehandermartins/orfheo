'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};


  ns.Widgets.ModifyProduction = function(proposal_id, sectionContent){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Modifica producción');
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Modifica tu producción', function(){return Pard.Widgets.ModifyProductionMessage(proposal_id, sectionContent)});


    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ModifyProductionMessage = function(proposal_id, sectionContent){

    var proposal = Pard.ProfileManager.getProposal(proposal_id);
   
    if (proposal['links'] != false && proposal['links'] != null){
      var _array = Object.keys(proposal['links']).map(function(key){return proposal['links'][key]});
      proposal['links'] = _array;
    };

    var _createdWidget = $('<div>');
    var _formContainer = $('<form>').addClass('popup-form');
    var _message = $('<div>').html(
      'No se modificará ninguno de los datos que has enviado a la convocatoria del conFusión.'
      ).addClass('message-form');


    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');

    var user_id = Pard.ProfileManager.getUserId();
    var profile_id = Pard.ProfileManager.getProfileId(proposal_id);

    _submitForm['proposal_id'] = proposal.proposal_id;
    _submitForm['profile_id'] = profile_id;

    var _form = Pard.Forms.ModifyProductionForm(proposal['category']);
    var _requiredFields = _form.requiredFields();
    _form = _form.render();

    for(var field in _form){
      if(proposal[field]) _form[field]['input'].setVal(proposal[field]);
    };
    _form['category'].input.disable();

    var _filled = function(){
      var _check = true;
      for (field in _form){
        if ($.inArray(field, _requiredFields) >= 0){
          if(!(_form[field].input.getVal())) {
            if(field != 'links') _form[field].input.addWarning();
            _invalidInput.text('Por favor, revisa los campos obligatorios.');
            _check = false;}
        }
      }
      if (_check) _invalidInput.empty();
      return _check;    
    };

    var _getVal = function(url){
      for(var field in _form){
         _submitForm[field] = _form[field].input.getVal();
      };
      _submitForm['photos'] = url;
      return _submitForm;
    }

    var _send = function(url){
      Pard.Backend.modifyProduction(_getVal(url), function(data){
        Pard.Events.ModifyProduction(data, sectionContent);
      });
    }

    var _thumbnail = $('<div>');
    var _url = [];
    
    if (proposal.photos){
      if('photos' in proposal && proposal.photos != null){
        proposal.photos.forEach(function(photo){
          _url.push(photo);
          var _container = $('<span>');
          var _previousPhoto = $.cloudinary.image(photo,
            { format: 'jpg', width: 50, height: 50,
              crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
          _createdWidget.append(_previousPhoto);
          var _icon = $('<span>').addClass('material-icons').html('&#xE888').css({
            'position': 'relative',
            'bottom': '20px',
            'cursor': 'pointer'
          });

          _icon.on('click', function(){
            _url.splice(_url.indexOf(photo), 1);
            _photos.setUrl(_url);
            _container.empty();
          });

          _container.append(_previousPhoto, _icon);
          _thumbnail.append(_container);
        });
      }
    }

    var _folder = user_id + '/' + profile_id + '/photos';
    var _photos = Pard.Widgets.Cloudinary(_folder, _thumbnail, _url, 3);

    var _photosLabel = $('<label>').text('Fotos de tu arte').css({
      'padding-top': '0.5rem'
    });
    var _photosContainer = $('<div>').append(_photosLabel,_photos.render(), _thumbnail).addClass('photos-modifyProduction');

    for(var field in _form){
      _formContainer.append($('<div>').addClass(field+'-modifyProduction').append(_form[field]['label'].render().append(_form[field]['input'].render())));
    };

    _formContainer.append(_photosContainer);

    var _closepopup = {};

    submitButton.on('click',function(){
      if(_filled() == true){
        _closepopup();
        if(_photos.dataLength() == false) _send(_url);
        else{
          _photos.submit();
        }
      }
    });

    _photos.render().bind('cloudinarydone', function(e, data){
      _url.push(data['result']['public_id']);
      if(_url.length >= _photos.dataLength()) _send(_url);
    });

    _createdWidget.append(_message, _formContainer, _invalidInput, _submitBtnContainer.append(submitButton));

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }



  ns.Widgets.MultimediaManager = function(proposal_id, sectionContent){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Añade un contenido multimedia');
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Modifica tu producción', function(){return Pard.Widgets.MultimediaManagerMessage(proposal_id, sectionContent)});


    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.MultimediaManagerMessage = function(proposal_id, sectionContent){

    var proposal = Pard.ProfileManager.getProposal(proposal_id);
    
    if (proposal['links'] != false && proposal['links'] != null){
      var _array = Object.keys(proposal['links']).map(function(key){return proposal['links'][key]});
      proposal['links'] = _array;
    };

    var _createdWidget = $('<div>');
    var _formContainer = $('<form>').addClass('popup-form');
    var _message = $('<div>').html(
      'Puedes añadir contenidos multimedía en forma de videos o imagenes desde youtube, vimeo, vine, facebook, pintarest, instagram, flickr... Copia y pega el enlace correspondiente y dale un titúlo.'
      ).addClass('message-form');


    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');

    var _send = function(links){
      proposal['links'] = links;
      Pard.Backend.modifyProduction(proposal, function(data){
        Pard.Events.ModifyProduction(data, sectionContent);
      });
    }

   var _inputMultimedia = Pard.Widgets.InputMultimedia();
    _formContainer.append($('<div>').addClass('links-MultimediaManager').append(_inputMultimedia.render()));

    var _closepopup = {};
    var _checkable = ['twitter', 'youtube', 'vimeo', 'flickr', 'soundcloud'];

    submitButton.on('click',function(){
      if(_inputMultimedia.filled()){
        var _inputs = _inputMultimedia.getInputs();
        var _links = _inputMultimedia.getVal();
        var _checkableInputs = [];

        _inputs.forEach(function(input, index){
          if($.inArray(_links[index]['provider'], _checkable) > -1){
            _inputs.splice(_inputs.indexOf(input), 1);
            _checkableInputs.push(input);
          }
        });

        if(_checkableInputs.length == 0){
          _closepopup();
          _send(_links);
        }
        else{
          _checkableInputs.forEach(function(input, index){
            var _check = true;
            var url = input.getVal();
            $.getJSON("https://noembed.com/embed?callback=?",
              {"format": "json", "url": url}, function (data) {
                if ('error' in data){
                  _check = false;
                  input.addWarning();
                }
                if (_check == true && (index + 1) == _checkableInputs.length){
                  _closepopup();
                  _send(_links);
                }
            });
          });
        }
      }
    }); 
   
    _createdWidget.append(_message, _formContainer, _invalidInput, _submitBtnContainer.append(submitButton));

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }

}(Pard || {}));
