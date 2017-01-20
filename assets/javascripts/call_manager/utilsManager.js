'use strict';

(function(ns){

  ns.utilsManager = function(the_event) {
    var _createdWidget = $('<div>');
    
    var _whiteListBox = $('<div>').addClass('white-list-box');
    var _whiteList = Pard.Widgets.WhiteList(the_event);
    var _whiteListText = $('<p>').text('Habilita usuarios para que puedan enviar una propuesta en cualquier momento').addClass('initial-text-proposalPanel');
    _whiteListBox.append(_whiteListText, _whiteList.render());
    _createdWidget.append(_whiteListBox);

    var _qrimg = $.cloudinary.image(the_event.qr,{ format: 'png', width: 80 , effect: 'saturation:50' });
    var _qrText = $('<p>').text('Descarga y difunde el codigo QR de la página de tu evento en orfheo').addClass('initial-text-proposalPanel');
    var _downloadBtn = $('<a>').append(Pard.Widgets.IconManager('export').render())
    .attr({
      'href': _qrimg[0].src,
      'download':'qrCode.png',
      'target':'_blank',
      'title':'Descarga'
    })
    .addClass('iconButton-CallPage dowloadQR-btn');
    var _qrBox = $('<div>').addClass('qr-box');
    _qrBox.append(_qrText, _qrimg, _downloadBtn);
    _createdWidget.append(_qrBox);

   

    return {
      render: function(){
        return _createdWidget;
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

    var _emailNameInput = Pard.Widgets.WhiteListInput(_emailsNames);

    _emailNameInput.setVal(the_event.whitelist);

    var _submitBtnContainer = $('<div>').addClass('submit-whitelist-call-manager-container');
    var _submitBtnOuterContainer = $('<div>').addClass('submit-btn-outer-container-call-manager');
    _submitBtnOuterContainer.append(_submitBtnContainer);
    var _BtnBox = $('<span>');

    var _submitBtn = Pard.Widgets.Button(Pard.Widgets.IconManager('save').render(),
     function(){
      _sendWhiteList();
    })
    .render()
    .addClass('iconButton-CallPage')
    .attr('title','Guarda los cambios');

    var _successIcon = $('<div>').append(Pard.Widgets.IconManager('done').render().addClass('success-icon-check-call-manager'), 'OK').addClass('success-check-call-manager').hide();

    var whiteListSavedCallback = function(data){
      console.log(data);
      if(data['status'] == 'success'){
        _submitBtn.hide();
        _successIcon.show();
        $('.new-input-selected-whitelist').removeClass('new-input-selected-whitelist');
        setTimeout(
          function(){
            _submitBtn.show();
            _successIcon.hide();
          }, 2000);
      }
      else{
        Pard.Widgets.Alert('¡Error!', 'No se ha podido guardar los datos', function(){location.reload();})
      }  
    }

    var _sendWhiteList = function(){
      var _wl = _emailNameInput.getVal();
      Pard.Backend.whitelist(the_event.event_id, _wl, whiteListSavedCallback);
    }

    _submitBtnContainer.append(_BtnBox.append(_submitBtn, _successIcon));

    var _emailNameImputRendered = _emailNameInput.render();

    _createdWidget.append(_submitBtnOuterContainer, $('<label>').append(_emailNameImputRendered));

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.WhiteListInput = function(emailsNames){
    
    var _createdWidget = $('<div>'); 
    var _results = [];
    var _inputs = [];
    var _inputNameEmail = $('<select>');
    var _inputContainer = $('<div>').addClass('input-whiteList-container');

    var _addInputButton = $('<span>').addClass('material-icons add-multimedia-input-button').html('&#xE86C');
    _addInputButton.addClass('add-input-button-enlighted');

    var _emails = [];

    var _addnewInput = function(item, classNewInput){
      if ($.inArray(item.email, _emails)>-1){
        Pard.Widgets.Alert('','Este usuario ya está en la lista.');
        return false;
      }
      else{
        _emails.push(item.email);
        var _container = $('<div>'); 
        var _newInput = Pard.Widgets.Selector([item['name_email']],[item['email']]);      
        _newInput.setClass('add-whiteList-input-field');
        if (classNewInput) _newInput.setClass(classNewInput);

        _newInput.disable();      
        _inputs.push([_newInput]);

        var _removeInputButton = $('<span>').addClass('material-icons add-multimedia-input-button-delete').html('&#xE888');

        _container.append(_newInput.render(),  _removeInputButton);
        _inputAddedContainer.prepend(_container);
        _removeInputButton.on('click', function(){
          var _index = _inputs.indexOf([_newInput]);
          _inputs.splice(_index, 1);
          var _indexR = -1;
          _results.some(function(result, index){            
            if(result.email == _newInput.getVal()){
              _indexR = index;
              return true;
            }
          });             
          if (_indexR > -1){ 
            _results.splice(_indexR, 1);
            _emails.splice(_indexR, 1);
          }
          _container.empty();
        });
        return true;
      }
    }
    
    var _outerListContainer = $('<div>').addClass('whiteListedContainer-call-page');
    var _inputAddedContainer = $('<div>').addClass('innerWhitelistedCont');


    _addInputButton.on('click', function(){
      if (_inputNameEmail.val()){
        var _data = _inputNameEmail.select2('data');
        var _info = {name_email: _data[0].text, email: _data[0].id};
        if (_addnewInput(_info, 'new-input-selected-whitelist')) _results.push(_info);
       _inputNameEmail.select2('val', '');
      }
    });

    _createdWidget.append(_inputContainer.append(_inputNameEmail),_outerListContainer.append(_inputAddedContainer));

    _inputNameEmail.select2({
      placeholder:'Email o Nombre de perfil',
      data: emailsNames,
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



    return {
      render: function(){
 
        return _createdWidget;
      },
      getVal: function(){
        return _results;
      },
      setVal: function(values){
        if(values == null || values == false) return true;
        // values.forEach(function(item){
        for (var item in values){  
          _addnewInput(values[item]);
          _results.push(values[item]);
        };
      }
    }
  }


}(Pard || {}));
