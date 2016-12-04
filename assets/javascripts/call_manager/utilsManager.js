'use strict';

(function(ns){

  ns.utilsManager = function(the_event) {
    var _createdWidget = $('<div>');
    var _img = $.cloudinary.image(the_event.qr,{ format: 'png', width: 350 , effect: 'saturation:50' });
    _createdWidget.append(_img);

   
    var _whiteListBox = $('<div>').addClass('white-list-box');
    var _whiteList = Pard.Widgets.WhiteList(the_event);
    var _whiteListText = $('<p>').text('Habilita usuarios para que puedan enviar una propuesta en cualquier momento').addClass('initial-text-proposalPanel');
    _whiteListBox.append(_whiteListText, _whiteList.render());

    _createdWidget.append(_whiteListBox);

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
    .addClass('saveBtn-whitelist')
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


}(Pard || {}));
