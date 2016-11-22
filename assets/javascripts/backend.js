'use strict';

(function(ns){

  ns.Backend = (function(){

    var _send = function(url, data, callback, callbackFail){
      var _attemps = 0;
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
        if (callbackFail){
          callbackFail();
        }
        else{
          Pard.Widgets.ErrorMessage();
        }
      });
    };

    var _register = function(email, password, event_id, callback){
      _send(
        '/login/register_attempt',
        {
          email: email,
          password: password,
          event_id: event_id
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

    var _sendArtistProposal = function(form, callback, callbackFail){
      _send(
        '/users/send_artist_proposal',
        form,
        callback,
        callbackFail
      );
    };

    var _sendSpaceProposal = function(form, callback,callbackFail){
      _send(
        '/users/send_space_proposal',
        form,
        callback,
        callbackFail
      );
    };

    var _sendArtistOwnProposal = function(form, callback){
      _send(
        '/users/send_artist_own_proposal',
        form,
        callback
      );
    };

    var _sendSpaceOwnProposal = function(form, callback){
      _send(
        '/users/send_space_own_proposal',
        form,
        callback
      );
    };

    var _createProduction = function(form, callback){
      _send(
        '/users/create_production',
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

    var _searchProfiles = function(tags, shown, event_id, callback){
      _send(
        '/search/results',
        {
          query: tags,
          shown: shown,
          event_id: event_id
        },
        callback
      );
    };

    var _searchProgram = function(event_id, tags, filters, date, time, callback){
      _send(
        '/search/results_program',
        {
          event_id: event_id,
          query: tags,
          filters: filters,
          date: date,
          time: time
        },
        callback
      );
    };

    var _searchProgramNow = function(event_id, callback){
      _send(
        '/search/program_now',
        {
          event_id: event_id
        },
        callback
      );
    };

    var _deleteArtistProposal = function(proposal_id, event_id, callback){
      _send(
        '/users/delete_artist_proposal',
        {
          proposal_id: proposal_id,
          event_id: event_id
        },
        callback
      );
    };

    var _deleteSpaceProposal = function(proposal_id, event_id, callback){
      _send(
        '/users/delete_space_proposal',
        {
          proposal_id: proposal_id,
          event_id: event_id
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

    var _amendArtistProposal = function(proposal_id, event_id, amend, callback){
      _send(
        '/users/amend_artist_proposal',
        {
          proposal_id: proposal_id,
          event_id:event_id,
          amend: amend
        },
        callback
      );
    };

    var _amendSpaceProposal = function(proposal_id, event_id, amend, callback){
      _send(
        '/users/amend_space_proposal',
        {
          proposal_id: proposal_id,
          event_id:event_id,
          amend: amend
        },
        callback
      );
    };

    var _modifyArtistProposal = function(event_id, call_id, form, callback){
      form['event_id'] = event_id;
      form['call_id'] = call_id;
      _send(
        '/users/modify_artist_proposal',
        form,
        callback
      );
    };

    var _modifySpaceProposal = function(event_id, call_id, form, callback){
      form['event_id'] = event_id;
      form['call_id'] = call_id;
      _send(
        '/users/modify_space_proposal',
        form,
        callback
      );
    };

    var _whitelist = function(call_id, whitelist, callback){
      _send(
        '/users/add_whitelist',
        {
          event_id: call_id,
          whitelist: whitelist
        },
        callback
      );
    };

    var _saveProgram = function(event_id, program, order, callback){
      _send(
        '/users/save_program',
        {
          event_id: event_id,
          program: program,
          order: order
        },
        callback
      );
    };

    var _getCallForms = function(call_id, callback){
      _send(
        '/forms',
        {
          call_id: call_id
        },
        callback
      );
    };

    var _listProfiles = function(callback){
      _send(
        '/users/list_profiles',
        {},
        callback
      );
    }

    var _events = function(callback){
      _send(
        '/events',
        {},
        callback
      );
    }

    return {
      register: _register,
      login: _login,
      passwordRecovery: _passwordRecovery,
      logout: _logout,
      modifyPassword: _modifyPassword,
      createProfile: _createProfile,
      modifyProfile: _modifyProfile,
      sendArtistProposal: _sendArtistProposal,
      sendSpaceProposal: _sendSpaceProposal,
      sendArtistOwnProposal: _sendArtistOwnProposal,
      sendSpaceOwnProposal: _sendSpaceOwnProposal,
      createProduction: _createProduction,
      modifyProduction: _modifyProduction,
      searchProfiles: _searchProfiles,
      searchProgram: _searchProgram,
      deleteArtistProposal: _deleteArtistProposal,
      deleteSpaceProposal: _deleteSpaceProposal,
      deleteProduction: _deleteProduction,
      deleteProfile: _deleteProfile,
      deleteUser: _deleteUser,
      amendArtistProposal: _amendArtistProposal,
      amendSpaceProposal: _amendSpaceProposal,
      modifyArtistProposal: _modifyArtistProposal,
      modifySpaceProposal: _modifySpaceProposal,
      whitelist: _whitelist,
      saveProgram: _saveProgram,
      getCallForms: _getCallForms,
      listProfiles: _listProfiles,
      events: _events
    };
  }());

}(Pard || {}));

