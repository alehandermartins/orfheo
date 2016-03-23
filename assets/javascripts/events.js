'use strict';
(function(ns){

  ns.Events = ns.Events || {};

  ns.Events.Register = function(data){
    if (data['status'] == 'success'){
      Pard.Widgets.Alert('','Te hemos enviado por correo un enlace para confirmar tu cuenta y acceder a orfheo.');
    }
    else {
      Pard.Widgets.Alert('Error',data.reason);
    }
  };

  ns.Events.Login = function(data){
    if (data['status'] == 'success'){
      document.location = '/users/';
    }
    else {
      Pard.Widgets.Alert('Error', data.reason);
    }
  };

  ns.Events.Logout = function(data){
    if (data['status'] == 'success'){
      document.location = '/';
    }
    else {
       Pard.Widgets.Alert('Error', data.reason);

    }
  };

  ns.Events.CreateProfile = function(data){
    if (data['status'] == 'success'){
      document.location = '/users/profiles/' + data['profile_id'];
    }
    else{
      Pard.Widgets.Alert('Error', data.reason);
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
      Pard.Widgets.Alert('Error', data.reason);
    }
  };


  ns.Events.ModifyProduction = function(data, sectionContent){
    if (data['status'] == 'success'){
      Pard.ProfileManager.modifyProduction(data.proposal);
      var _profile = Pard.ProfileManager.getProfileFromProposal(data.proposal.proposal_id);
      Pard.Widgets.ArtistProductionSectionContent(data.proposal.proposal_id, sectionContent);
      Pard.Widgets.ProductionsNavigation(_profile, sectionContent, $('#productions-content_id'));
    }
    else{
      Pard.Widgets.Alert('Error', data.reason);
    }
  }

}(Pard || {}));
