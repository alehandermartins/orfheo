'use strict';

(function(ns){

  ns.Backend = (function(){
          
    var _send = function(url, data, callback, callbackFail){
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
        $('.spinner').remove();
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
        '/login/register',
        {
          email: email,
          password: password,
          lang: Pard.Options.language(),
          event_id: event_id
        },
        callback
      );
    };

    var _login = function(email, password, callback){
      _send(
        '/login/login',
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

    var _modifyLang = function(lang, callback){
      _send(
        '/modify_lang',
        {
          lang: lang
        },
        callback
      );
    };

    var _createProfile = function(form, callback){
      console.log(form)
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

    var _sendArtistProposal = function(form, callback){
      _send(
        '/users/send_artist_proposal',
        form,
        callback
      );
    };

    var _sendSpaceProposal = function(form, callback){
      _send(
        '/users/send_space_proposal',
        form,
        callback
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

    var _createPerformances = function(form, callback){
      _send(
        '/users/create_performances',
        form,
        callback
      );
    };

    var _modifyPerformances = function(form, callback){
      _send(
        '/users/modify_performances',
        form,
        callback
      );
    };

    var _deletePerformances = function(form, callback){
      _send(
        '/users/delete_performances',
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
          event_id: event_id,
          lang: Pard.Options.language()
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
          time: time,
          lang: Pard.Options.language()
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

    var _amendArtistProposal = function(proposal_id, event_id, call_id, amend, callback){
      _send(
        '/users/amend_artist_proposal',
        {
          proposal_id: proposal_id,
          event_id: event_id,
          call_id: call_id,
          amend: amend
        },
        callback
      );
    };

    var _amendSpaceProposal = function(proposal_id, event_id, call_id, amend, callback){
      _send(
        '/users/amend_space_proposal',
        {
          proposal_id: proposal_id,
          event_id: event_id,
          call_id: call_id,
          amend: amend
        },
        callback
      );
    };

    var _modifyArtistProposal = function(form, callback){
      _send(
        '/users/modify_artist_proposal',
        form,
        callback
      );
    };

    var _modifySpaceProposal = function(form, callback){
      _send(
        '/users/modify_space_proposal',
        form,
        callback
      );
    };

    var _addWhitelist = function(event_id, name_email, email, callback){
      _send(
        '/users/add_whitelist',
        {
          event_id: event_id,
          name_email: name_email,
          email: email
        },
        callback
      );
    };

    var _deleteWhitelist = function(event_id, email, callback){
      _send(
        '/users/delete_whitelist',
        {
          event_id: event_id,
          email: email
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
          call_id: call_id,
          lang: Pard.Options.language()
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

    var _feedback = function(name, email, message, callback){
      _send(
        '/feedback',
        {
          name: name,
          email: email,
          message: message
        },
        callback
      ); 
    }

    var _techSupport = function(name, email, subject, profile, browser, message, callback){
      _send(
        '/techSupport',
        {
          name: name,
          email: email,
          subject: subject,
          profile: profile,
          browser: browser,
          message: message
        },
        callback
      ); 
    }

    var _business = function(form, callback){
      _send(
        '/business',
        form,
        callback
      ); 
    }

    var _header = function(callback){
     _send(
        '/users/header',
        {},
        callback
      ); 
    }

    var _saveOrder = function(event_id, order, callback){
     _send(
        '/users/space_order',
        {
          event_id: event_id,
          order: order
        },
        callback
      ); 
    }

    var _publish = function(event_id, callback){
     _send(
        '/users/publish',
        {
          event_id: event_id
        },
        callback
      ); 
    }

    var _eventManager = function(event_id, callback){
     _send(
        '/users/event_manager',
        {
          event_id: event_id,
          lang: Pard.Options.language()
        },
        callback
      ); 
    }

    var _checkName = function(name, callback){
      _send(
        '/users/check_name',
        {
          name: name
        },
        callback
      ); 
    }

    return {
      register: _register,
      login: _login,
      passwordRecovery: _passwordRecovery,
      logout: _logout,
      modifyPassword: _modifyPassword,
      modifyLang: _modifyLang,
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
      createPerformances: _createPerformances,
      modifyPerformances: _modifyPerformances,
      deletePerformances: _deletePerformances,
      addWhitelist: _addWhitelist,
      deleteWhitelist: _deleteWhitelist,
      saveOrder: _saveOrder,
      publish: _publish,
      eventManager: _eventManager,
      getCallForms: _getCallForms,
      listProfiles: _listProfiles,
      events: _events,
      header: _header,
      checkName: _checkName,
      feedback: _feedback,
      techSupport: _techSupport,
      business: _business
    };
  }());

}(Pard || {}));

