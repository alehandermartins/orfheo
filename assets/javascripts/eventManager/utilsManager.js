
(function(ns){

  ns.utilsManager = function(the_event) {
    var _createdWidget = $('<div>');
    
    var _whiteListBox = $('<div>').addClass('white-list-box');
    var _whiteList = Pard.Widgets.WhiteList(the_event).render();
    var _whiteListText = $('<p>').text(Pard.t.text('manager.tools.whitelist.title'));
    _whiteListBox.append(_whiteListText, _whiteList);
    _createdWidget.append(_whiteListBox);

    var _qrimg = $.cloudinary.image(the_event.qr,{ format: 'png', width: 80 , effect: 'saturation:50' });
    var _qrText = $('<p>').text(Pard.t.text('manager.tools.qr.title')).addClass('initial-text-proposalPanel');
    var _downloadBtn = $('<a>').append(Pard.Widgets.IconManager('export').render())
    .attr({
      'href': _qrimg[0].src,
      'download':'qrCode.png',
      'target':'_blank',
      'title':Pard.t.text('manager.tools.qr.download')
    })
    .addClass('iconButton-CallPage dowloadQR-btn');
    var _qrBox = $('<div>').addClass('qr-box');
    _qrBox.append(_qrText, _qrimg, _downloadBtn);
    _createdWidget.append(_qrBox);

    var _slug = Pard.Widgets.Slug(the_event.event_id, the_event.slug);
    //_qrBox.append(_slug.render());

     Pard.Bus.on('addWhitelist', function(whitelist){
      the_event.whitelist = whitelist;
      _whiteList.remove();
      _whiteList = Pard.Widgets.WhiteList(the_event).render();
      _whiteListBox.append(_whiteList);
     });

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.Slug = function(event_id, slug){
    var _createdWidget = $('<div>').css({'margin-top': 30})
    var _message = $('<div>').text('Añade una dirección personalizada a tu evento')
    
    var _slugInput = $('<div>')
    var _domain = $('<span>').text('www.orfheo.org/event/')
    var _slug = $('<input>').attr({type: 'text', placeholder: event_id}).css({'display': 'inline-block', 'width': 320})
    var _addInputButton = $('<span>').addClass('material-icons add-multimedia-input-button').html('&#xE86C').css({'position': 'relative'})

    var _error = $('<div>').append($('<p>').text(Pard.t.text('widget.inputName.unavailable'))
        .css({
        'color':'red',
        'font-size':'12px',
        'line-height':'.9rem'
      }))
      .css({
        'margin-bottom':'-.8rem',
      })
      .hide();

    _slug.on('input', function(){
      Pard.Backend.checkSlug(_slug.val(), function(data){
        _slug.removeClass('warning');
        _slug.removeClass('available');
        _error.hide();
        if(data.available == false) {
          _slug.addClass('warning');
          _error.show();
        };
        if(data.available == true) {
          _slug.addClass('available');
          _error.hide();
        }
      })
    })

    _addInputButton.on('click', function(){
      var _confirmation = $('<div>').addClass('very-fast reveal full')
      _confirmation.empty()
      $('body').append(_confirmation)
      var _confirmPopup = new Foundation.Reveal(_confirmation, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', multipleOpened:true})
      var _message = Pard.Widgets.PopupContent(Pard.t.text('popup.delete.title'),  confirmPopupContent(), 'alert-container-full')
      _message.setCallback(function(){
        _confirmPopup.close()
        setTimeout(
          function(){
            _confirmation.remove()
          },500)
      })
        _confirmation.append(_message.render())
        _confirmPopup.open()

      // Pard.Backend.createSlug(_slugInput.val(), event_id, function(data){
      //   if(data.status == 'success'){
      //     Pard.Widgets.TimeOutAlert('', 'Dirección cambiada');
      //   }
      //   else{
      //     Pard.Widgets.Alert(Pard.t.text('error.alert'), Pard.ErrorHandler(data.reason), function(){
      //     });
      //   }
      // }); 
    })

    _slugInput.append(_domain, _slug, _addInputButton)
    _createdWidget.append(_message, _slugInput, _error)

    var confirmPopupContent = function(){
        var _createdWidget = $('<div>')
        var _mex = $('<p>').text('La nueva dirección será: www.orfheo.org/event/' + _slug.val()) 
        var _yesBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn confirm-delete-btn').text(Pard.t.text('dictionary.confirm').capitalize())
        var _noBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn cancel-delete-btn').text(Pard.t.text('dictionary.cancel').capitalize())

        var _warning = $('<div>').text('Esta nueva dirección funcionará paralelamente a la ya existente y no podrá ser eliminada o modificada una vez creada').css(
          {'margin-top': 20, 'color': 'red'}
        )
        var spinnerDeleteProposal =  new Spinner().spin()
        var _deleteProposalBackend = {
          artist: Pard.Backend.deleteArtistProposal,
          space: Pard.Backend.deleteSpaceProposal
        }

        var _buttonsContainer = $('<div>').addClass('yes-no-button-container')

        _createdWidget.append(_mex)
        _createdWidget.append(_buttonsContainer.append(_noBtn, _yesBtn), _warning)

        return {
          render: function(){
            return _createdWidget
          },
          setCallback: function(callback){
            _noBtn.click(function(){
              callback()
            })
            _yesBtn.click(function(){
              // $('body').append(spinnerDeleteProposal.el);
              // _deleteProposalBackend[type](_proposal.proposal_id, event_id, function(data){
              //   deleteCallback(data);
              //   spinnerDeleteProposal.stop();
              //   _popup.close();
              //   _content.empty();
              //   callback();
              // });
            })
          }
        }
      }

    return {
      render: function(){
        return _createdWidget
      }
    }
  }

  ns.Widgets.WhiteList = function(the_event){

    var _createdWidget = $('<div>');
    var _emailsNames = [{id:'', text:''}];
    var _namesList = [];
    var _emailsList = [];

    var _makeList = function(proposal){
      var email = {id: proposal.email, text: proposal.email};
      if($.inArray(proposal.email, _emailsList) < 0) {
        _emailsNames.push(email);
        _emailsList.push(proposal.email);
      }
      var name = {id: proposal.email, text: proposal['name']};
      if($.inArray(proposal['name'], _namesList) < 0){
        _emailsNames.push(name);
        _namesList.push(proposal['name']);
      }
    }

    Object.keys(the_event.artists).forEach(function(profile_id){
      _makeList(the_event.artists[profile_id].artist);
    });

    Object.keys(the_event.spaces).forEach(function(profile_id){
      _makeList(the_event.spaces[profile_id].space);
    });

    var _inputNameEmail = $('<select>');
    var _inputContainer = $('<div>').addClass('input-whiteList-container');

    var _addInputButton = $('<span>').addClass('material-icons add-multimedia-input-button').html('&#xE86C');
    _addInputButton.addClass('add-input-button-enlighted');

    var _outerListContainer = $('<div>').addClass('whiteListedContainer-call-page');
    var _inputAddedContainer = $('<div>').addClass('innerWhitelistedCont');


    var _whiteEmails = [];
    var _addInput = function(item){
      _whiteEmails.push(item.email);
      var _container = $('<div>'); 
      var _newInput = Pard.Widgets.Input('','text');
      _newInput.setVal([item['name_email']]);      
      _newInput.setClass('add-whiteList-input-field');
      _newInput.disable();      
      var _removeInputButton = $('<span>').addClass('material-icons add-multimedia-input-button-delete').html('&#xE888');

      _container.append(_newInput.render(),  _removeInputButton);
      _inputAddedContainer.prepend(_container);
      _removeInputButton.on('click', function(){
        Pard.Backend.deleteWhitelist(the_event.event_id, item.email, function(){
          console.log('deleteWhitelist');
        });
      });
    }

    the_event.whitelist.forEach(function(whitelisted){
      _addInput(whitelisted);
    });

    _addInputButton.on('click', function(){
      if (_inputNameEmail.val()){
        var _data = _inputNameEmail.select2('data');
        var name_email = _data[0].text;
        var email = _data[0].id;
        if ($.inArray(email, _whiteEmails) >= 0 ){
          Pard.Widgets.Alert('',Pard.t.text('manager.tools.whitelist.ontheList'));
          return false;
        }
        Pard.Backend.addWhitelist(the_event.event_id, name_email, email, function(){
          console.log('addWhitelist');
        });
      }
    });

    var _emptyEmail = $('<option>');
    _inputNameEmail.append(_emptyEmail);
    _inputContainer.append(_inputNameEmail),_outerListContainer.append(_inputAddedContainer);

    _inputNameEmail.select2({
      dropdownCssClass:'orfheoTableSelector',
      placeholder: Pard.t.text('manager.tools.whitelist.placeholder'),
      data: _emailsNames,
      allowClear: true,
      tags: true
    });

    _inputNameEmail.on('select2:select',function(){
      if (_inputNameEmail.select2('data')) _addInputButton.trigger('click');
    });

    _inputNameEmail.on('select2:open',function(){
      $('input.select2-search__field').val('');
      _inputNameEmail.val('val','');
      $('span.select2-search.select2-search--dropdown').click(function(){
        $('input.select2-search__field').focus();
      });
      setTimeout(function() {$('input.select2-search__field').focus()},500);
    });

    _inputContainer.append(_inputNameEmail);
    _outerListContainer.append(_inputAddedContainer);
    _createdWidget.append($('<label>').append(_inputContainer, _outerListContainer));

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

}(Pard || {}));
