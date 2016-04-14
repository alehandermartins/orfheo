'use strict';
(function(ns){

  ns.Events = ns.Events || {};

  ns.Events.Register = function(data){
    if (data['status'] == 'success'){
      Pard.Widgets.Alert('','Te hemos enviado por correo un enlace para confirmar tu cuenta y acceder a orfheo.');
    }
    else {
      if (typeof Pard.Widgets.Dictionary(data.reason).render() == 'object'){
        var _caller = $('<button>');
        var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return Pard.Widgets.Dictionary(data.reason).render()}, 'alert-container-full');
        _caller.trigger('click');
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', Pard.Widgets.Dictionary(data.reason).render());
      }
    }
  };

  ns.Events.Login = function(data){
    if (data['status'] == 'success'){
      document.location = '/users/';
    }
    else {
      if (typeof Pard.Widgets.Dictionary(data.reason).render() == 'object'){
        var _caller = $('<button>');
        var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return Pard.Widgets.Dictionary(data.reason).render()}, 'alert-container-full');
        _caller.trigger('click');
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', Pard.Widgets.Dictionary(data.reason).render());
      }
    };
  };

  ns.Events.Logout = function(data){
    if (data['status'] == 'success'){
      document.location = '/';
    }
    else {
      if (typeof Pard.Widgets.Dictionary(data.reason).render() == 'object'){
        var _caller = $('<button>');
        var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return Pard.Widgets.Dictionary(data.reason).render()}, 'alert-container-full');
        _caller.trigger('click');
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', Pard.Widgets.Dictionary(data.reason).render());
      }
    }
  };

  ns.Events.CreateProfile = function(data){
    if (data['status'] == 'success'){
      document.location = '/profile?id=' + data['profile_id'];
    }
    else{
      if (typeof Pard.Widgets.Dictionary(data.reason).render() == 'object'){
        var _caller = $('<button>');
        var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return Pard.Widgets.Dictionary(data.reason).render()}, 'alert-container-full');
        _caller.trigger('click');
      }
      else{ 
        console.log(data.reason);
        Pard.Widgets.Alert('', Pard.Widgets.Dictionary(data.reason).render());
      }
    }
  };


  ns.Events.SendProposal = function(data){
    if (data['status'] == 'success'){
      Pard.Widgets.Alert('conFusión festival 2016', '¡Te has inscrito correctamente! <p style="font-size: 14px; margin-top:1rem"> Puedes enviar otra propuesta desde el mismo perfil (si artista) o crear y inscribir otros perfiles.</p>',
        function(){
         document.location = '/profile?id=' + data['profile_id'];
        }
      );
    }
    else{
      if (typeof Pard.Widgets.Dictionary(data.reason).render() == 'object'){
        var _caller = $('<button>');
        var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return Pard.Widgets.Dictionary(data.reason).render()}, 'alert-container-full');
        _caller.trigger('click');
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', Pard.Widgets.Dictionary(data.reason).render());
      }
    }
  };

  ns.Events.ModifyProduction = function(data){
    if (data['status'] == 'success'){
      Pard.ProfileManager.modifyProduction(data.production);
      var _profile_id = Pard.ProfileManager.getProfileId(data.production.production_id);
      Pard.Widgets.ProductionsNavigation(_profile_id, $('#_profileNav'), $('#_sectionContent'), $('#_productionsContent'), data.production.production_id);
    }
    else{
      if (typeof Pard.Widgets.Dictionary(data.reason).render() == 'object'){
        var _caller = $('<button>');
        var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return Pard.Widgets.Dictionary(data.reason).render()}, 'alert-container-full');
        _caller.trigger('click');
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', Pard.Widgets.Dictionary(data.reason).render());
      }
    }
  }

  ns.Events.ModifyMultimedia = function(data){
    if (data['status'] == 'success'){
      var profile_id = Pard.ProfileManager.getProfileId(data.production.production_id);
      document.location = '/profile?id=' + profile_id + '&sel=' + data.production.production_id;
    }
    else{
      if (typeof Pard.Widgets.Dictionary(data.reason).render() == 'object'){
        var _caller = $('<button>');
        var _popup = Pard.Widgets.PopupCreator(_caller,'', function(){return Pard.Widgets.Dictionary(data.reason).render()}, 'alert-container-full');
        _caller.trigger('click');
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', Pard.Widgets.Dictionary(data.reason).render());
      }
    }
  }

  ns.Events.DeleteProposal = function(data){
    if (data['status'] == 'success'){
      console.log(data);
        // Pard.Widgets.Alert('', 'Tu propuesta ha sido retirada del Benimaclet conFusión festival 2016.'),
        // function(){
        //  document.location = '/profile?id=' + data['profile_id'];
        // }
    }
     else{
        console.log(data.reason);
    }
  }


}(Pard || {}));
  