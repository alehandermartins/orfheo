'use strict';

(function(ns){

  ns.Backend = (function(){

    var _send = function(url, data, callback){
      $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: data
      })
      .done(function(data) {
        if (callback)
          callback(data);
      })
      .fail(function() {
        console.log("error");
      });
    };

    var _register = function(email, password, callback){
      _send(
        '/users/register_attempt',
        {
          email: email,
          password: password
        },
        callback
      );
    };

    var _login = function(email, password, callback){
      _send(
        '/users/login_attempt',
        {
          email: email,
          password: password
        },
        callback
      );
    };

    return {
      register: _register,
      login: _login
    };
  }());

}(Pard || {}));
