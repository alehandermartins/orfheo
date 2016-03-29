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
      document.location = '/users/profiles/' + data['profile_id'];
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
      Pard.Widgets.Alert('conFusion festival 2016', '¡Te has inscrito correctamente!',
        function(){
         document.location = '/users/profiles/' + data['profile_id'];
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

  ns.Events.ModifyProduction = function(data, sectionContent){
    if (data['status'] == 'success'){
      Pard.ProfileManager.modifyProduction(data.proposal);
      var _profile_id = Pard.ProfileManager.getProfileId(data.proposal.proposal_id);
      Pard.Widgets.ProductionsNavigation(_profile_id, $('#_profileNav'), sectionContent, $('#_productionsContent'), data.proposal.proposal_id);
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

}(Pard || {}));
