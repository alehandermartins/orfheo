'use strict';

(function(ns){

  ns.utilsManager = function(the_event) {
    var _createdWidget = $('<div>');
    
    var _whiteListBox = $('<div>').addClass('white-list-box');
    var _whiteList = Pard.Widgets.WhiteList(the_event).render();
    var _whiteListText = $('<p>').text('Habilita usuarios para que puedan enviar una propuesta en cualquier momento').addClass('initial-text-proposalPanel');
    _whiteListBox.append(_whiteListText, _whiteList);
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
          Pard.Widgets.Alert('','Este usuario ya está en la lista.');
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
      placeholder:'Email o Nombre de perfil',
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
