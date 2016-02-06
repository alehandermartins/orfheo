'use strict';
(function(ns){

  ns.Events = ns.Events || {};

  ns.Events.Register = function(data){
    if (data['status'] == 'success'){
      alert('Te hemos enviado un correo.');
    }
    else {
      alert(data.reason);
    }
  };
}(Pard || {}));
