'use strict';
(function(ns){

  ns.Events = ns.Events || {};

  ns.Events.LogIn = function(data){
    if (data['status'] == 'success'){
      console.log('success');
    }
    else {
      alert(data.reason);
    }
  };
}(Pard || {}));
