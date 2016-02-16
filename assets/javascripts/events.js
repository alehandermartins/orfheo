'use strict';
(function(ns){

  ns.Events = ns.Events || {};

  ns.Events.Register = function(data){
    if (data['status'] == 'success'){
      alert('Te hemos enviado un correo.');
    }
    else {
      bootbox.alert({
        title: 'error',
        message: data.reason
      });
    }
  };

  ns.Events.Login = function(data){
    if (data['status'] == 'success'){
      document.location = '/users/';
    }
    else {
      bootbox.alert({
        title: 'error',
        message: data.reason
      });
    }
  };

  ns.Events.Logout = function(data){
    if (data['status'] == 'success'){
      document.location = '/';
    }
    else {
      bootbox.alert({
        title: 'error',
        message: data.reason
      });
    }
  };

  ns.Events.CreateProfile = function(data){
    if (data['status'] == 'success'){
      document.location = '/users/profiles/' + data['profile_id'];
    }
    else{
      bootbox.alert({
        title: 'error',
        message: data.reason
      });
    }
  };


  ns.Events.CreateProposal = function(data){
    if (data['status'] == 'success'){
      console.log('success');
    }
    else{
      bootbox.alert({
        title: 'error',
        message: data.reason
      });
    }
  };


}(Pard || {}));
