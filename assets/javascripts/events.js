'use strict';
(function(ns){
 
  ns.Events = ns.Events || {};

  ns.Events.Register = function(data){
    if (data['status'] == 'success'){
      Pard.Widgets.Alert('','Te hemos enviado por correo un enlace para activar tu cuenta y acceder a la convocatoria a través de orfheo.');
    }
    else {
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
      if (typeof _dataReason == 'object'){
        var _caller = $('<button>');
        var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return _dataReason}, 'alert-container-full');
        _caller.trigger('click');
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', _dataReason);
      }
    }
  };

  ns.Events.Login = function(data){
    console.log(data);
    if (data['status'] == 'success'){
      location.reload();
    }
    else {
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
      if (typeof  _dataReason == 'object'){
        var _caller = $('<button>');
        var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return _dataReason}, 'alert-container-full');
        _caller.trigger('click');
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', _dataReason);
      }
    };
  };

  ns.Events.Logout = function(data){
    if (data['status'] == 'success'){
      document.location = '/';
    }
    else {
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
      if (typeof _dataReason == 'object'){
        var _caller = $('<button>');
        var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return _dataReason}, 'alert-container-full');
        _caller.trigger('click');
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', _dataReason);
      }
    }
  };

  ns.Events.CreateProfile = function(data){
    console.log(data);
    if (data['status'] == 'success'){
      if (data.profile) document.location = '/profile?id=' + data['profile']['profile_id'];
      else if (data.profile_id) document.location = '/profile?id=' + data['profile_id'];
    }
    else{
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
      if (typeof _dataReason == 'object'){
        var _caller = $('<button>');
        var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return _dataReason}, 'alert-container-full');
        _caller.trigger('click');
      }
      else{ 
        console.log(data.reason);
        Pard.Widgets.Alert('', _dataReason);
      }
    }
  };


  ns.Events.SendProposal = function(data){
    if (data['status'] == 'success'){
      Pard.Widgets.Alert('', '<h4 style = "color: rgb(76, 182, 50); margin-top: -1rem; text-align: center; font-weight: bold;">¡Genial!</h4><p style = "text-align:center">Te has inscrito correctamente</p> <p style="font-size: 14px; margin-top:1rem; text-align: center;"> Puedes enviar otra propuesta desde el mismo perfil (si eres artista) o crear e inscribir otros perfiles</p><p style="font-size: 14px; text-align: center; font-weight:bold">conFusión festival 2016</p>',
        function(){
         document.location = '/profile?id=' + data['profile_id'];
        }
      );
    }
    else{
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
      if (typeof  _dataReason == 'object'){
        var _caller = $('<button>');
        var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return  _dataReason}, 'alert-container-full');
        _caller.trigger('click');
      }
      else{
        var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
        Pard.Widgets.Alert('', _dataReason);
      }
    }
  };

  ns.Events.ModifyProduction = function(data){
    if (data['status'] == 'success'){
      Pard.ProfileManager.modifyProduction(data.production);
      var _profile_id = Pard.ProfileManager.getProfileId(data.production.production_id);
      Pard.Widgets.ProductionsNavigation(_profile_id, $('#_profileNav'), $('#_sectionContent'), data.production.production_id);
    }
    else{
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
      if (typeof  _dataReason == 'object'){
        var _caller = $('<button>');
        var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return  _dataReason}, 'alert-container-full');
        _caller.trigger('click');
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('',  _dataReason);
      }
    }
  }

  ns.Events.ModifyMultimedia = function(data){
    if (data['status'] == 'success'){
      var profile_id = Pard.ProfileManager.getProfileId(data.production.production_id);
      document.location = '/profile?id=' + profile_id + '&sel=' + data.production.production_id;
    }
    else{
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
      if (typeof _dataReason == 'object'){
        var _caller = $('<button>');
        var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return _dataReason}, 'alert-container-full');
        _caller.trigger('click');
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', _dataReason);
      }
    }
  }

  ns.Events.DeleteProposal = function(data){
    if (data['status'] == 'success'){
      // console.log(data);
      Pard.Widgets.Alert('', 'Tu solicitud de participación en el festival ha sido cancelada correctamente.', function(){location.reload();})
    }
    else{
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
      if (typeof _dataReason == 'object'){
        var _caller = $('<button>');
        var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return _dataReason}, 'alert-container-full');
        _caller.trigger('click');
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', _dataReason);
      }
    }
  }

  ns.Events.DeleteProduction = function(data){
    if (data['status'] == 'success'){
      location.reload();
    }
    else{
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
      if (typeof _dataReason == 'object'){
        var _caller = $('<button>');
        var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return _dataReason}, 'alert-container-full');
        _caller.trigger('click');
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', _dataReason);
      }
    }
  }

  ns.Events.DeleteProfile = function(data){
    if (data['status'] == 'success'){
      location.href = '/users/';
    }
    else{
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
      if (typeof _dataReason == 'object'){
        var _caller = $('<button>');
        var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return _dataReason}, 'alert-container-full');
        _caller.trigger('click');
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', _dataReason);
      }
    }
  }

  ns.Events.DeleteUser = function(data){
    if (data['status'] == 'success'){
      location.href = '/';
    }
    else{
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
      if (typeof _dataReason == 'object'){
        var _caller = $('<button>');
        var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return _dataReason}, 'alert-container-full');
        _caller.trigger('click');
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', _dataReason);
      }
    }
  }

  ns.Events.AmendProposal = function(data){
    if (data['status'] == 'success'){
      Pard.Widgets.Alert('', 'Enmienda enviada correctamente.', function(){ location.reload(); });
    }
    // else{
    //   var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
    //   if (typeof _dataReason == 'object'){
    //     var _caller = $('<button>');
    //     var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return _dataReason}, 'alert-container-full');
    //     _caller.trigger('click');
    //   }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', _dataReason);
      }
    // }
  }

  ns.Events.SaveProgram = function(data){
    $('.save-text-call-manager').empty();
    if(data['status'] == 'success') {
      // $('.save-text-call-manager').append($('<span>').append(Pard.Widgets.IconManager('done').render().addClass('success-icon-check-call-manager'), 'OK').addClass('success-check-call-manager'));
      //   setTimeout(function(){
      //     $('.save-text-call-manager').empty();
      //     $('.save-text-call-manager').html('Guarda </br>los cambios');
      //   }, 3000);
    }
    else{
      console.log('error');
      Pard.Widgets.Alert('¡Error!', 'No se ha podido guardar los datos', function(){location.reload();});
    }  
  }

  ns.Events.SendOwnProposal = function(data){
    if(data['status'] == 'success') {
      console.log(data);
      Pard.CachedProposals = data.call.proposals;
      Pard.CachedCall.proposals= data.call.proposals;
      Pard.Widgets.Program = [];
      Pard.Spaces = [];
      Pard.ShownSpaces = [];
      Pard.Artists = {};
      var _proposal = data.call.proposals[data.call.proposals.length -1];
      var _proposalContainer = $('<li>');
      var _printedProposal = Pard.Widgets.PrintOwnProposal(_proposal, _proposalContainer); 
      if (_proposal.type == 'space') $('#space-list-call-page').prepend(_proposalContainer.append(_printedProposal.render()));
      else $('#artist-list-call-page').prepend(_proposalContainer.append(_printedProposal.render()));
      Pard.Widgets.Alert('', 'Propuesta creada correctamente.');
      $('#tablePanel').empty();
      // $('#tablePanel').append(Pard.Widgets.TablePanelContent().render());
      $('#programPanel').empty();
    }
    else{
      Pard.Widgets.Alert('',data.reason);
      // Pard.Widgets.Alert('¡Error!', 'No se ha podido guardar los datos', function(){location.reload();})
    }  
  }

  ns.Events.DeleteOwnProposal = function(data){
    console.log(data);
    if (data['status'] == 'success'){
      Pard.Widgets.Alert('', 'Propuesta eliminada correctamente.', function(){
        location.reload();
      });
    }
    else{
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
      if (typeof _dataReason == 'object'){
        Pard.Widgets.Alert('¡Error!', 'No se ha podido guardar los datos', location.reload());
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', _dataReason, location.reload());
      }
    }
  }


  ns.Events.WhiteList = function(data){
    console.log(data);
    $('#successBox-whiteList').empty();
    if(data['status'] == 'success'){
      $('#successBox-whiteList').append($('<div>').append(Pard.Widgets.IconManager('done').render().addClass('success-icon-check-call-manager'), 'OK').addClass('success-check-call-manager'));
      $('.new-input-selected-whitelist').removeClass('new-input-selected-whitelist');
      setTimeout(function(){
        $('#successBox-whiteList').empty();
      }, 3000);
    }
    else{
      Pard.Widgets.Alert('¡Error!', 'No se ha podido guardar los datos', function(){location.reload();})
    }  
  }

  ns.Events.CreateProduction = function(data){
    if(data['status'] == 'success') {
      console.log(data);
      Pard.Widgets.Alert('','Contenido creado correctamente');
    }else{
      Pard.Widgets.Alert('',data.reason);
    }  
  }



}(Pard || {}));
  