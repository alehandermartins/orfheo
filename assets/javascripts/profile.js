'use strict';

(function(ns){


  ns.Widgets.ModifyProfile = function(profile){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Modifica el perfil');
    var _submitBtn = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');

    var _popup = Pard.Widgets.PopupCreator(_caller, 'Modifica tus datos', function(){
      return Pard.Widgets.ModifyProfileMessage(profile, _submitBtn);
    });

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ModifyProfileMessage = function(profile, submitButton){

    var _createdWidget = $('<div>');
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');
    var _submitForm = {};
    var _callback = {};
    var _data = [];

    submitButton.on('click',function(){
      if(_filled() == true){
        _callback();
        Pard.Backend.modifyProfile(_getVal(), Pard.Events.CreateProfile);
      }
    });

    var _photo = $.cloudinary.unsigned_upload_tag(
      "kqtqeksl",
      {
        cloud_name: 'hxgvncv7u',
        folder: profile.user_id + '/' + profile.profile_id + '/profile_picture'
      }
    );
    var _thumbnail = $('<div>').addClass('thumbnails');
    var _url = [];

    _photo.fileupload({
      replaceFileInput: false,
      add: function(e, data) {
        var uploadErrors = [];
        var acceptFileTypes = /^image\/(gif|jpe?g|png)$/i;

        if (_data.length >= 1){
          uploadErrors.push('Only one image allowed');
        }
        if(data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
            uploadErrors.push('Not an accepted file type');
        }
        if(data.originalFiles[0]['size'] > 500000) {
            uploadErrors.push('Filesize is too big');
        }
        if(uploadErrors.length > 0) {
            alert(uploadErrors.join("\n"));
        } else {
          var reader = new FileReader(); // instance of the FileReader
          reader.readAsDataURL(data.originalFiles[0]); // read the local file

          _data.push(data);
          reader.onloadend = function(){ // set image data as background of div
            var _container = $('<span>');
            var _img = $('<img>').attr('src', this.result).css({'width':'50px', 'height': '50px'});
            var _icon = $('<span>').addClass('material-icons').html('&#xE888').css({
              'position': 'relative',
              'bottom': '20px',
              'cursor': 'pointer'
            });

            _icon.on('click', function(){
              _data.splice(_data.indexOf(data), 1);
              _container.empty();
            });

            _container.append(_img, _icon);
            $('.thumbnails').append(_container);

          }
          submitButton.off().on('click',function(){
            if(_filled() == true){
              data.submit();
              _callback();
              _data.forEach(function(photo){
                photo.submit();
              });
            }
          });
        }
      }
    });

    _photo.bind('cloudinarydone', function(e, data){
      _url.push(data['result']['public_id']);
      Pard.Backend.modifyProfile(_getVal(), Pard.Events.CreateProfile);
    });

    _createdWidget.append(_photo, _thumbnail);

    _submitForm['profile_id'] = profile.profile_id;
    _submitForm['type'] = profile.type;

    var _form = Pard.Forms.ProfileForms(profile.type).render();
    var _requiredFields = _form.requiredFields();
    _form = _form.render();

    for(var field in _form){
      if(profile[field]) _form[field].input.setVal(profile[field]);
    };

    for(var field in _form){
      _createdWidget.append(_form[field].label.render().append(_form[field].input.render()), _form[field].helptext.render());
    };

    _createdWidget.append(_invalidInput, _submitBtnContainer.append(submitButton));

    var _filled = function(){
      var _check = true;
      for (field in _form){
        if ($.inArray(field, _requiredFields) >= 0){
          if(!(_form[field].input.getVal())) {
            _form[field].input.addWarning();
            _invalidInput.text('Por favor, revisa los campos obligatorios.');
            _check = false;}
        }
      }
      if (_check) _invalidInput.empty();
      return _check;    
    };

    var _getVal = function(){
      for(var field in _form){
         _submitForm[field] = _form[field].input.getVal();
      };
      _submitForm['profile_picture'] = _url;
      return _submitForm;
    }

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _callback = callback;
      }
    }
  }


  ns.Widgets.ToUserPageLink = function(){

      var _createdButton = $('<a>').attr('href','/users/').text('Pagina de usuario')

    return {
      render: function(){
        return _createdButton;
      }
    }
  }


  ns.Widgets.ModifyProduction = function(proposal, profile_id, user_id, sectionContent){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Modifica producción');
    var _submitBtn = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');
    var _popup = Pard.Widgets.PopupCreator(_caller, 'Modifica tu producción', function(){return Pard.Widgets.ModifyProductionMessage(proposal, profile_id, user_id, sectionContent, _submitBtn)});

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.CloudinaryModifyProposal = function(proposal, folder, submitButton, filled, sendproposal){

    var _createdWidget = $('<div>');
    var _data = [];
    var _url = [];
    var _closepopup = {};

    var _photo = $.cloudinary.unsigned_upload_tag(
      "kqtqeksl",
      {
        cloud_name: 'hxgvncv7u',
        folder: folder
      }
    );

    var _thumbnail = $('<div>').addClass('thumbnails');

    _photo.fileupload({
      multiple: true,
      replaceFileInput: false,
      add: function(e, data) {
        var uploadErrors = [];
        var acceptFileTypes = /^image\/(gif|jpe?g|png)$/i;
        _photo.val(null);

        if (_data.length + _url.length >=3){
          uploadErrors.push('Only three images allowed');
        }
        if(data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
            uploadErrors.push('Not an accepted file type');
        }
        if(data.originalFiles[0]['size'] > 100000) {
            uploadErrors.push('Filesize is too big');
        }
        if(uploadErrors.length > 0) {
            alert(uploadErrors.join("\n"));
        } else {
          var reader = new FileReader(); // instance of the FileReader
          reader.readAsDataURL(data.originalFiles[0]); // read the local file

          _data.push(data);
          reader.onloadend = function(){ // set image data as background of div
            var _container = $('<span>');
            var _img = $('<img>').attr('src', this.result).css({'width':'50px', 'height': '50px'});
            var _icon = $('<span>').addClass('material-icons').html('&#xE888').css({
              'position': 'relative',
              'bottom': '20px',
              'cursor': 'pointer'
            });

            _icon.on('click', function(){
              _data.splice(_data.indexOf(data), 1);
              _container.empty();
            });

            _container.append(_img, _icon);
            $('.thumbnails').append(_container);
          }
          submitButton.off().on('click',function(){
            if(filled() == true){
              _closepopup();
              _data.forEach(function(photo){
                photo.submit();
              });
            }
          });
        }
      }
    });

    _photo.bind('cloudinarydone', function(e, data){
      _url.push(data['result']['public_id']);
      if(_url.length >= _data.length){
        sendproposal(_url);
      }
    });

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
          _container.empty();
        });

        _container.append(_previousPhoto, _icon);
        _thumbnail.append(_container);
      });
    }

     submitButton.on('click',function(){
      if(filled() == true){
        console.log(_url);
        _closepopup();
       sendproposal(_url);
      }
    });

    _createdWidget.append(_photo, _thumbnail);

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }

  ns.Widgets.ModifyProductionMessage = function(proposal, profile_id, user_id, sectionContent, submitButton){

    var _createdWidget = $('<div>');
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');

    _submitForm['proposal_id'] = proposal.proposal_id;
    _submitForm['profile_id'] = profile_id;

    var _form = Pard.Forms.ArtisticProduction();
    var _requiredFields = _form.requiredFields();
    _form = _form.render();

    for(var field in _form){
      if(proposal[field]) _form[field]['input'].setVal(proposal[field]);
    };

    var _filled = function(){
      var _check = true;
      for (field in _form){
        if ($.inArray(field, _requiredFields) >= 0){
          if(!(_form[field].input.getVal())) {
            _form[field].input.addWarning();
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

    var _folder = user_id + '/' + profile_id + '/photos';
    var _photos = Pard.Widgets.CloudinaryModifyProposal(proposal, _folder, submitButton, _filled, _send);
    _createdWidget.append(_photos.render());

    for(var field in _form){
      _createdWidget.append(_form[field]['label'].render().append(_form[field]['input'].render()));
    };

    _createdWidget.append(_invalidInput, _submitBtnContainer.append(submitButton));

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _photos.setCallback(callback);
      }
    }
  }



}(Pard || {}));
