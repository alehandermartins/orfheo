'use strict';

(function(ns){

  ns.Backend = (function(){

    var _send = function(url, data, callback){
      $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: data,
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
      if('video' in form) delete(form['video']);
      if('image' in form) delete(form['image']);
      if('audio' in form) delete(form['audio']);
      _send(
        '/users/modify_profile',
        form,
        callback
      );
    };

    var _createCall = function(callback){
      _send(
        '/users/create_call',
        {},
        callback
      );
    };

    var _sendProposal = function(form, callback){
      _send(
        '/users/send_proposal',
        form,
        callback
      );
    };

    var _modifyProduction = function(form, callback){
      if('video' in form) delete(form['video']);
      if('image' in form) delete(form['image']);
      if('audio' in form) delete(form['audio']);
      _send(       
        '/users/modify_production',
        form,
        callback
      );
    };

    var _searchProfiles = function(data, callback){
      _send(       
        '/search/results',
        data,
        callback
      );
    };

    var _deleteProposal = function(proposal_id, callback){
      _send(       
        '/users/delete_proposal',
        {
          proposal_id: proposal_id
        },
        callback
      );
    };

    var _deleteProduction = function(production_id, callback){
      _send(       
        '/users/delete_production',
        {
          production_id: production_id
        },
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
      modifyProfile: _modifyProfile,
      createCall: _createCall,
      sendProposal: _sendProposal,
      modifyProduction: _modifyProduction,
      searchProfiles: _searchProfiles,
      deleteProposal: _deleteProposal,
      deleteProduction: _deleteProduction
    };
  }());

}(Pard || {}));
