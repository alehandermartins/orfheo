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
        '/login/register_attempt',
        {
          email: email,
          password: password
        },
        callback
      );
    };

    var _login = function(email, password, callback){
      _send(
        '/login/login_attempt',
        {
          email: email,
          password: password
        },
        callback
      );
    };

    var _passwordRecovery = function(email, callback){
      _send(
        '/login/forgotten_password',
        {
          email: email
        },
        callback
      );
    };

    var _logout = function(callback){
      _send(
        '/login/logout',
        {},
        callback
      );
    };

    var _modifyPassword = function(password, callback){
      _send(
        '/users/modify_password',
        {
          password: password
        },
        callback
      );
    };

    var _createProfile = function(form, callback){
      _send(
        '/users/create_profile',
        form,
        callback
      );
    };

    var _modifyProfile = function(form, callback){
      console.log(form)
      _send(
        '/users/modify_profile',
        form,
        callback
      );
    };

    return {
      register: _register,
      login: _login,
      passwordRecovery: _passwordRecovery,
      logout: _logout,
      modifyPassword: _modifyPassword,
      createProfile: _createProfile,
      modifyProfile: _modifyProfile
    };
  }());

}(Pard || {}));
