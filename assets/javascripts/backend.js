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
      _send(
        '/users/modify_profile',
        form,
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
      _send(       
        '/users/modify_production',
        form,
        callback
      );
    };

    var _searchProfiles = function(tags, shown, callback){
      _send(       
        '/search/results',
        {
          query: tags,
          shown: shown
        },
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

    var _deleteProfile = function(profile_id, callback){
      _send(       
        '/users/delete_profile',
        {
          profile_id: profile_id
        },
        callback
      );
    };

    var _deleteUser = function(callback){
      _send(       
        '/users/delete_user',
        {},
        callback
      );
    };

    var _amendProposal = function(proposal_id, amend, callback){
      _send(       
        '/users/amend_proposal',
        {
          proposal_id: proposal_id,
          amend: amend
        },
        callback
      );
    };

    var _program = function(call_id, program, callback){
      _send(       
        '/users/program',
        {
          call_id: 'b5bc4203-9379-4de0-856a-55e1e5f3fac6',
          program: program
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
      sendProposal: _sendProposal,
      modifyProduction: _modifyProduction,
      searchProfiles: _searchProfiles,
      deleteProposal: _deleteProposal,
      deleteProduction: _deleteProduction,
      deleteProfile: _deleteProfile,
      deleteUser: _deleteUser,
      amendProposal: _amendProposal,
      program: _program
    };
  }());

}(Pard || {}));
