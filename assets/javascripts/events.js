'use strict';
(function(ns){

  ns.Events = ns.Events || {};

  ns.Events.Register = function(data){
    if (data['status'] == 'success'){
      Pard.Widgets.Alert('','Te hemos enviado un correo.');
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
      console.log(data);
         Pard.Widgets.ArtistProductionSectionContent(data.proposal, data.profile_id, sectionContent);
    }
    else{
      Pard.Widgets.Alert('Error', data.reason);
    }
  }

}(Pard || {}));
