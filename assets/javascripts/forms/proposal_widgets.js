'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {}; 

  ns.Widgets.MyCallProposals = function(profile){

    var _createdWidget = $('<div>');

    var _eventIDs = [];
    var _forms = {};
    var _callProposals = profile.proposals;
    
    var _listProposals = $('<ul>');

    for(var proposalType in _callProposals){
      _callProposals[proposalType].forEach(function(proposal){
        var _proposalType = proposalType;
        proposal.name = profile.name;
        proposal.phone = profile.phone;
        
        if ($.inArray(proposal.event_id, _eventIDs) < 0) {
          var _callName = $('<p>').append($('<span>').text(proposal.event_name).css({'font-weight': 'bold'})).addClass('activities-box-call-name');
          _listProposals = $('<ul>');
          _createdWidget.append(_callName, _listProposals);
        }
        _eventIDs.push(proposal.event_id);
        var _caller = $('<a>').attr({href:'#/'})
        if (_proposalType == 'artist') _caller.text(proposal.title);
        else _caller.text(Pard.t.text('proposal.sentForm'));
        var _proposalItem = $('<li>').append( _caller);
        _listProposals.append(_proposalItem); 
        var _proposalPopup;
        _caller
          .one('click', function(){
            _proposalPopup = Pard.Widgets.Popup();
            _proposalPopup.setContentClass('proposal-popup')
          })
          .on('click', function(){
            if (!(_forms[proposal.call_id])) {
              Pard.Backend.getCallForms(proposal.call_id, function(data){
                _forms[proposal.call_id] = data.forms;
                _proposalPopup.setContent(
                  proposal.event_name, 
                  Pard.Widgets.PrintMyProposal(
                    proposal,
                    _forms[proposal.call_id][_proposalType][proposal.form_category], 
                    _proposalType, 
                    function(){
                      _proposalPopup.close()
                    }).render());
                _proposalPopup.open();
              });
            }
            else{
              _proposalPopup.setContent(
                proposal.event_name, 
                Pard.Widgets.PrintMyProposal(
                  proposal, 
                  _forms[proposal.call_id][_proposalType][proposal.form_category],
                  _proposalType, 
                  function(){
                    _proposalPopup.close()
                  }).render());
              _proposalPopup.open();
            }       
          })
      });
    }
  
    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.PrintMyProposal = function(proposal, form, proposalType, closepopup){
    var _createdWidget = $('<div>');
    _createdWidget.append(Pard.Widgets.PrintProposal(proposal, form).render());
    if (form.blocks['conditions'] && form.blocks['conditions']['helptext']){
      var _conditionsLink = '<a href="' + form.blocks['conditions']['helptext'] + '" target="_blank">' + Pard.t.text('proposal.terms') + '</a>';
      _createdWidget.append($('<p>').append(Pard.t.text('proposal.termsOk', {link: _conditionsLink, event: proposal.event_name}))); 
    }
    var _deadline = new Date(parseInt(proposal.deadline));
    var _now = new Date();
    if(_now.getTime() < proposal.deadline){
      var _backendAmendProposal = {
        space: Pard.Backend.amendSpaceProposal,
        artist: Pard.Backend.amendArtistProposal
      }
      var _postData = $('<div>').addClass('postData-container');
      var _postDataLabel = $('<p>').addClass('myProposals-field-label').text(Pard.t.text('proposal.amend.helper') + ' ('+ moment(_deadline).locale(Pard.Options.language()).format('DD MMMM YYYY')+')');
      if (proposal.amend){
        var _amendLabel = Pard.t.text('proposal.amend.title');
        _amendFormLabel = $('<span>').text(_amendLabel).addClass('myProposals-field-label');
        var _amendText = $('<div>').append($('<p>').text(proposal['amend']));
        var _modifyAmendButton = $('<button>').attr({type: 'button'}).addClass('send-post-data-btn').text(Pard.t.text('proposal.amend.modify'));
        _modifyAmendButton.click(function(){
          _postData.empty();
          var _textArea = $('<textarea>').attr('rows', 4).val(proposal['amend']);
          var _sendButton = $('<button>').attr({type: 'button'}).addClass('send-post-data-btn').text(Pard.t.text('dictionary.send').capitalize());

          _textArea.on('input', function(){$(this).removeClass('warning')});
          

          _sendButton.click(function(){
            if (_textArea.val()) { 
              _backendAmendProposal[proposalType](proposal.proposal_id, proposal.event_id, proposal.call_id, _textArea.val(), Pard.Events.AmendProposal);
              closepopup();
            }
            else _textArea.attr({placeholder: Pard.t.text('proposal.amend.placeholder')}).addClass('warning');
          });
      
          _postData.append(_postDataLabel, _textArea, _sendButton);
        });
        _postData.append(_postDataLabel, _amendFormLabel,_amendText,_modifyAmendButton);
      }
      else{
        var _textArea = $('<textarea>').attr('rows', 4);
        var _sendButton = $('<button>').attr({type: 'button'}).addClass('send-post-data-btn').text(Pard.t.text('dictionary.send').capitalize());
        _textArea.on('input', function(){$(this).removeClass('warning')});
        _sendButton.click(function(){
          if (_textArea.val()) {
           _backendAmendProposal[proposalType](proposal.proposal_id, proposal.event_id, proposal.call_id, _textArea.val(), Pard.Events.AmendProposal);
           closepopup();
          }
          else _textArea.attr({placeholder: Pard.t.text('proposal.amend.placeholder')}).addClass('warning');
        });
        _postData.append(_postDataLabel, _textArea, _sendButton);
      }

      var _confirmPopup;
      var _deleteProposal = $('<a>').attr('href','#/').text(Pard.t.text('proposal.delete')).addClass('deleteProfile-caller')
        .one('click', function(){
        _confirmPopup = Pard.Widgets.Popup();
        _confirmPopup.setContent(Pard.t.text('popup.delete.title'), Pard.Widgets.DeleteMyProposalMessage(proposal, proposalType, closepopup, function(){_confirmPopup.close();}).render());
        })
        .click(function(){
          _confirmPopup.open();
        });
      _createdWidget.append(_postData);
      _createdWidget.append(_deleteProposal.prepend(Pard.Widgets.IconManager('delete').render().addClass('trash-icon-delete')));
    }


    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
      }
    }
  }


  ns.Widgets.PrintProposal = function(proposal, form){
    var form = $.extend(true, {}, form);  
    var _createdWidget = $('<div>');
    _createdWidget.append($('<div>').addClass('colorLine-myProposal-popup').css('border-color', proposal.event_color));
    var _orfheoFields = ['name', 'phone','email','subcategory', 'address', 'title','short_description','description','duration','availability', 'children', 'cache'];
    var sentProposalField = Pard.Widgets.sentProposalField(proposal, form);
    _orfheoFields.forEach(function(field){
      if (proposal[field]){
        var _fieldFormLabel = $('<span>').addClass('myProposals-field-label');
        var _fieldFormText = $('<span>');
        var _proposalField = sentProposalField[field] || form.blocks[field];
        _proposalField['text'] = _proposalField['text'] || proposal[field];
        _proposalField['label'] = _proposalField['label'] || form.blocks[field]['label'];
        _proposalField['input'] = _proposalField['input'] || '';
        _fieldFormLabel.append(_proposalField['label'],':');
        _fieldFormText.append(' ',_proposalField['text']).addClass('proposalText-'+_proposalField['input']+' proposal-text');
        var _fieldForm = $('<div>').append($('<p>').append(_fieldFormLabel, _fieldFormText)).addClass('proposalFieldPrinted');
        _createdWidget.append(_fieldForm);
      }
    });

    if (proposal['photos'] || proposal['links']){
      var _multimediaContainer = $('<div>');
      _fieldFormLabel = $('<span>').addClass('myProposals-field-label').text(Pard.t.text('proposal.form.multimedia'));
      var _linkPhoto = $('<a>').text(Pard.t.text('proposal.form.seeContents')).attr('href','#/')
      _fieldFormText = $('<span>').append(_linkPhoto);
      _fieldForm = $('<div>').append($('<p>').append(_fieldFormLabel, _fieldFormText)).addClass('proposalFieldPrinted');
      _createdWidget.append(_fieldForm);
      
      _linkPhoto.click(function(){
        if (!(_multimediaContainer.html())){ 
          var _spinner = new Spinner();
           _spinner.spin();
          $('body').append(_spinner.el); 
            Pard.Widgets.MultimediaDisplay(
              proposal, 
              function(multimedia){
                Pard.Widgets.AddMultimediaContent(_multimediaContainer, multimedia);
                _spinner.stop();
              }
            );
        }       
        Pard.Widgets.BigAlert('',_multimediaContainer,'multimedia-popup-bigalert');
      })
    }

    for(var field in proposal){
      if ($.isNumeric(field)){
        var _fieldFormLabel = $('<span>').addClass('myProposals-field-label');
        var _fieldFormText = $('<span>').addClass('proposalText-'+ form.blocks[field]['input']+' proposal-text');
        var _fieldForm = $('<div>').append($('<p>').append(_fieldFormLabel, _fieldFormText)).addClass('proposalFieldPrinted');
        _createdWidget.append(_fieldForm);
        _textLabel = form.blocks[field]['label'];          
        if (_textLabel.indexOf('*')>0) _textLabel = _textLabel.replace(' *','');
        _textLabel += ':';
        _fieldFormLabel.append(_textLabel);
        if (form.blocks[field]['input'] == 'CheckBox'){
          var _text;
          var dictionaryCheckBox = {
            false: Pard.t.text('dictionary.no').capitalize(),
            true: Pard.t.text('dictionary.yes').capitalize()
          }
          _text = ' ' + dictionaryCheckBox[proposal[field]];
          _fieldFormText.append(_text);
        }
        else if(form.blocks[field]['input'] == 'Links'){
          var _text = $('<div>').append($('<a>').text(proposal[field]).attr({'href': proposal[field], 'target': '_blank'}));
          _fieldFormText.append(_text);
        }
        else if(form.blocks[field]['input'] == 'TextAreaEnriched'){
          _fieldFormText.append(proposal[field]);
        }
        else if (form.blocks[field]['input'] == 'Selector'){
          _fieldFormText.append(' ' + form.blocks[field].args[proposal[field]]);
        }
        else if (form.blocks[field]['input'] == 'MultipleSelector' && proposal[field]){
          var _list = $('<ul>');
          proposal[field].forEach(function(val){
          _list.append($('<li>').text(form.blocks[field].args[val]));
          });  
          _fieldFormText.append(_list);
        }
        else _fieldFormText.text(' ' + proposal[field]);  
      }
    }

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
      }
    }
  }


  ns.Widgets.sentProposalField = function(proposal, form){

    var _address = function(){
      var _address = ' ';
      if (proposal['address']){
        if (proposal['address']['route']) _address +=  proposal['address']['route']+ ' ';
        if (proposal['address']['street_number']) _address += ' '+proposal['address']['street_number']+',  ';
        if (proposal['address']['door']) _address += ', ' + Pard.t.text('proposal.form.door') + proposal['address']['door']+',  ';
        _address += proposal['address']['postal_code']+', '+proposal['address']['locality'];
      }
      return _address;
    };

    var _availability = function(){
      var _list = $('<ul>');
      if (proposal['availability']) proposal['availability'].forEach(function(val){
        var _dayDate = new Date (val);
        _list.append($('<li>').text(moment(_dayDate).locale(Pard.Options.language()).format('dddd DD MMMM YYYY')));
      });
      return _list;
    }  

    var _duration = function(){
      if (proposal['duration']){
        if ($.isNumeric(proposal['duration'])) return  proposal['duration'] + ' min';
      else return Pard.t.text('profile_page.production.noDuration');
      }
    }

    var _cache = function(){
      if (proposal.cache) return proposal.cache.value;
    }

    var _name = function(){
      var _nameText;
      if (!proposal.own) _nameText = $('<a>').append(proposal['name']).attr({'href':'/profile?id='+proposal.profile_id,'target':'_blank'});
      else _nameText = proposal['name']; 
      var _nameEl = $('<span>').append(_nameText, $('<div>').append(Pard.t.text('proposal.form.category', {category: form.label})).css('font-size','0.875rem'))
      return _nameEl;
    }

    return {
      'name': {
        label: Pard.t.text('proposal.sentBy'),
        text: _name()
      },
      'email': {
        label: Pard.t.text('dictionary.email').capitalize(),
        text: $('<a>').attr('href','mailto:'+proposal['email']).text(proposal['email'])
      },
      'phone':{
        label: Pard.t.text('dictionary.phone').capitalize(),
        text: proposal.phone.value
      },
      'address': {
        label: Pard.t.text('dictionary.address').capitalize(),
        text: $('<a>').text(_address()).attr({
                href: 'http://maps.google.com/maps?q='+_address(),
                target: '_blank'
              })
      },
      'title': {
        label: Pard.t.text('dictionary.title').capitalize(),
        input: 'Inputtext'
      },
      'description': {
        label: Pard.t.text('dictionary.description').capitalize(),
        input: 'TextAreaEnriched'
      },
      'short_description': {
        label: Pard.t.text('dictionary.short_description').capitalize(),
        input: 'TextAreaEnriched'
      },
      'subcategory': {
        label: Pard.t.text('dictionary.category').capitalize(),
        text: form.blocks.subcategory.args[proposal.subcategory]
      },
      'availability': {
        label: Pard.t.text('dictionary.availability').capitalize(),
        text:  _availability()
      },
      'duration': {
        label: Pard.t.text('proposal.form.duration'),
        text: _duration()
      },
      'cache': {
        label: Pard.t.text('proposal.form.cache'),
        text: _cache()
      },
      'children':{
        label: Pard.t.text('dictionary.audience').capitalize(),
        text: Pard.t.text('widget.inputChildren.' + proposal.children)
      }
    }
  }


  ns.Widgets.AddMultimediaContent =  function(_multimediaContainer, multimedia) {
  
      Pard.Widgets.MultimediaScripts();
      if(multimedia.video != false){
        var _outerVideocontainer = $('<div>');
        var _videoContainer = $('<div>').addClass('video-production-container')

        var _videoTitle = $('<div>').addClass('single-image-container ').append($('<div>').addClass('single-image-content images-title-box').append($('<h6>').text(Pard.t.text('dictionary.videos').capitalize())));
        
        // var _videoTitle = $('<div>').append($('<div>').addClass('video-title-box').append($('<h6>').text('Vídeos')));

        _multimediaContainer.append(_outerVideocontainer);
        multimedia.video.forEach(function(video){
          _videoContainer.prepend($('<div>').addClass('single-video-container').append(video))
        });
        _outerVideocontainer.append(_videoTitle, _videoContainer);
      };

      if(multimedia.audio != false){
        var _outerAudiocontainer = $('<div>');
        var _audioContainer = $('<div>').addClass('image-production-container');
        var _audioTitle = $('<div>').addClass('single-image-container ').append($('<div>').addClass('single-image-content images-title-box').append($('<h6>').text(Pard.t.text('dictionary.audios').capitalize())));
        _multimediaContainer.append(_outerAudiocontainer);
        multimedia.audio.forEach(function(audio){
          _audioContainer.prepend($('<div>').addClass('single-image-container').append($('<div>').addClass('single-image-content').append(audio)));
        });
        _outerAudiocontainer.append(_audioTitle, _audioContainer);

      }

      if(multimedia.image != false){
        var _outerImagescontainer = $('<div>');
        var _imageContainer = $('<div>').addClass('image-production-container');
        var _imageTitle = $('<div>').addClass('single-image-container').append($('<div>').addClass('single-image-content images-title-box').append($('<h6>').text(Pard.t.text('dictionary.images').capitalize())));      
        _multimediaContainer.append(_outerImagescontainer);
        multimedia.image.forEach(function(image){
          _imageContainer.append($('<div>').addClass('single-image-container').append($('<div>').addClass('single-image-content').append(image)));
        });
        _outerImagescontainer.append(_imageTitle, _imageContainer);
      }
    }


  ns.Widgets.DeleteMyProposalMessage = function(proposal, proposalType, closepopup, closeConfirmPopup){  
    var _createdWidget = $('<div>');
    var _message = $('<p>').text(Pard.t.text('proposal.deleteAlert', {event: proposal.event_name}));
    var _yesBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn confirm-delete-btn').text(Pard.t.text('dictionary.confirm').capitalize());
    var _noBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn cancel-delete-btn').text(Pard.t.text('dictionary.cancel').capitalize());

    var _deleteProposalBackend = {
      artist: Pard.Backend.deleteArtistProposal,
      space: Pard.Backend.deleteSpaceProposal
    }    
    _yesBtn.click(function(){
      _deleteProposalBackend[proposalType](proposal.proposal_id, proposal.event_id, Pard.Events.DeleteProposal);
      closepopup();
      closeConfirmPopup();
    });

    _noBtn.click(function(){
      closeConfirmPopup();
    });

    var _buttonsContainer = $('<div>').addClass('yes-no-button-container');

    _createdWidget.append(_message,  _buttonsContainer.append(_noBtn, _yesBtn));

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

}(Pard || {}));

  