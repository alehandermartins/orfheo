'use strict';

(function(ns){


  ns.Widgets.CallButtonArtist = function(profile){

    var _caller = $('<button>').addClass('pard-btn').attr({type: 'button'}).html('Envia una propuesta al conFusión');
    var _submitBtn = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Envia');
    var _popup = Pard.Widgets.PopupCreator(_caller, 'conFusión', function(){
      return Pard.Widgets.CallMessageArtist(profile, _submitBtn);
    });

    var _createdWidget = _popup.render();

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.CallMessageArtist = function(profile, submitButton){

    var _createdWidget = $('<div>');
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var _invalidInput = $('<div>').addClass('not-filled-text');
    var _selected = 'music';
    var _callback = {};
    var _data = [];

    submitButton.on('click',function(){
      if(_filled() == true){
        _callback();
        Pard.Backend.sendProposal(_getVal(), Pard.Events.SendProposal);
      }
    });

    var _photo = $.cloudinary.unsigned_upload_tag(
      "kqtqeksl",
      {
        cloud_name: 'hxgvncv7u',
        folder: profile.user_id + '/' + profile.profile_id + '/photos'
      }
    );
    var _thumbnail = $('<div>').addClass('thumbnails');
    var _url = [];

    _photo.fileupload({
      multiple: true,
      replaceFileInput: false,
      add: function(e, data) {
        var uploadErrors = [];
        var acceptFileTypes = /^image\/(gif|jpe?g|png)$/i;

        if (_data.length >= 3){
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
            if(_filled() == true){
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
      if(_url.length == _data.length) Pard.Backend.sendProposal(_getVal(), Pard.Events.SendProposal);
    });

    _createdWidget.append(_photo, _thumbnail);

    _submitForm['call_id'] = 'b5bc4203-9379-4de0-856a-55e1e5f3fac6';
    _submitForm['profile_id'] = profile.profile_id;
    _submitForm['type'] = profile.type;
    _submitForm['category'] = _selected;

    var _content = $('<div>');
    var _form = Pard.Forms.ArtistCall(_selected).render();

    _form['components']['input'].setAttr('min','1');

    for(var field in _form){
        _content.append(_form[field]['label'].render().append(_form[field]['input'].render()),_form[field]['helptext'].render());
      };
    var _requiredFields = Pard.Forms.ArtistCall(_selected).requiredFields();

    var _labelsCategories = ['Musica', 'Artes Escenicas', 'Exposición', 'Poesia',  'Audiovisual', 'Street Art', 'Taller', 'Otros'];
    var _valuesCategories = ['music', 'arts', 'expo', 'poetry', 'audiovisual', 'street_art', 'workshop', 'other'];

    var _category = Pard.Widgets.Selector(_labelsCategories, _valuesCategories).render();

    _createdWidget.append(_category, _content, _invalidInput, _submitBtnContainer.append(submitButton));

    _category.on('change', function(){
      _selected = $(this).val();
      _content.empty();
      _form = Pard.Forms.ArtistCall(_selected).render();
      _requiredFields = Pard.Forms.ArtistCall(_selected).requiredFields();
      for(var field in _form){
        _content.append(_form[field]['label'].render().append(_form[field]['input'].render()),_form[field]['helptext'].render());
      };
      _submitForm['category'] = _selected;
      _createdWidget.append(_category, _content, _submitBtnContainer.append(submitButton));
    });

    var _filled = function(){
      var check = _form['conditions'].input.getVal();
      for(var field in _form){
        if ($.inArray(field, _requiredFields) >= 0 ){
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
      _submitForm['photos'] = _url;
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


  ns.Widgets.MyArtistCallProposals = function(callProposals){
    var _createdWidget = $('<div>');

    callProposals.forEach(function(proposal){
      var _proposalBtn = Pard.Widgets.Button('conFusión -' + proposal['title']);
      _createdWidget.append(
        Pard.Widgets.PopupCreator(_proposalBtn.render(), 'conFusión', function(){ return Pard.Widgets.MyArtistCallProposalMessage(proposal);
        }).render());
    });

    return {
      render: function(){
        return _createdWidget;
      }
    }
  };


  ns.Widgets.MyArtistCallProposalMessage = function(callProposals){

    var _createdWidget = $('<div>');

    var _form = Pard.Forms.ArtistCall(callProposals.category).render();

    for(var field in _form){
      if(callProposals[field]) _form[field]['input'].setVal(callProposals[field]);
    };

    for(var field in _form){
      _createdWidget.append(_form[field]['label'].render().append(_form[field]['input'].render()), _form[field]['helptext'].render());
    };

    var _closeBtn = Pard.Widgets.Button('Cierra').render();

    _createdWidget.append(_closeBtn);

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closeBtn.on('click', function(){
          callback();
        })
      }
    }

  }


  ns.Widgets.MyArtistProductions = function(profile){
    var _createdWidget = $('<div>');
    var _content = $('<div>');
    var _proposals = profile.proposals;

    if (_proposals){
      _proposals.forEach(function(proposal){
        _createdWidget.append(Pard.Widgets.Button(proposal['title'], function(){
          _content.empty();
          _content.append(Pard.Widgets.MyArtistProductionsContent(proposal).render());
       }).render());
      });
    }

    _createdWidget.append(_content);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  };


  ns.Widgets.MyArtistProductionsContent = function(proposal){

    var _createdWidget = $('<div>');
    var _infoField = $('<div>');

    for(var field in proposal){
      if(proposal[field] != null){
        if(proposal[field].length != 0 && field != 'proposal_id' && field != 'photos') {
          var _newField = $('<div>').text(field+': '+proposal[field]);
          _createdWidget.append(_newField);
        }
      }
    }
    console.log(proposal);

    if('photos' in proposal && proposal.photos != null){
      proposal.photos.forEach(function(photo){
        var _photo = $.cloudinary.image(photo,
          { format: 'jpg', width: 50, height: 50,
            crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
        _createdWidget.append(_photo);
      });
    }

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

}(Pard || {}));
