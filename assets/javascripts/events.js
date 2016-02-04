'use strict';
(function(ns){

  ns.Events = ns.Events || {};

  ns.Events.LogIn = function(data){
    if (data['status'] == 'success'){
      console.log('success');
    }
    else {
      bootbox.alert({
        title: 'error',
        message: data.reason
      });
    }
  };
}(Pard || {}));
