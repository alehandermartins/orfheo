'use strict';
(function(ns){
 
  ns.Events = ns.Events || {};

  ns.Events.Register = function(data){
    if (data['status'] == 'success'){
      Pard.Widgets.Alert('', Pard.t.text('signUp.success'));
    }
    else {
      var _dataReason = Pard.ErrorHandler(data.reason);
      if (typeof _dataReason == 'object'){
        var _popup = Pard.Widgets.Popup();
        _dataReason.setCallback(function(){
          _popup.close();
          setTimeout(function(){
            _popup.destroy()
           },500);
        });
        _popup.setContent('', _dataReason.render());
        _popup.setContentClass('alert-container-full');
        _popup.setCallback(function(){
          setTimeout(function(){
          _popup.destroy()
        },500);
        });
        _popup.open();
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', _dataReason);
      }
    }
  };

  ns.Events.Login = function(data){
    if (data['status'] == 'success'){
      Pard.Options.storeLanguage(data.lang);
      location.reload();
    }
    else {
      var _dataReason = Pard.ErrorHandler(data.reason);
      if (typeof  _dataReason == 'object'){
        var _popup = Pard.Widgets.Popup();
        $('body').off('click.zf.dropdown');
        _dataReason.setCallback(function(){
          _popup.close();
          $('#loginDropDown').foundation('close');
          setTimeout(function(){
            _popup.destroy()
           },500);
        });
        _popup.setContent('', _dataReason.render());
        _popup.setContentClass('alert-container-full');
        _popup.setCallback(function(){
          $('#loginDropDown').foundation('close');
          setTimeout(function(){
            $('#loginDropDown').foundation('open');
          },2);
          setTimeout(function(){
          _popup.destroy();
        },500);
        });
        _popup.open();
      }
      else{
        console.log(data.reason);
        $('#loginDropDown').foundation('close');
        Pard.Widgets.Alert('', _dataReason);
      }
    };
  };

  ns.Events.Logout = function(data){
    if (data['status'] == 'success'){
      document.location = '/';
    }
    else {
      var _dataReason = Pard.ErrorHandler(data.reason);
      if (typeof _dataReason == 'object'){
        var _popup = Pard.Widgets.Popup();
        _dataReason.setCallback(function(){
          _popup.close();
          setTimeout(function(){
            _popup.destroy()
           },500);
        });
        _popup.setContent('', _dataReason.render());
        _popup.setContentClass('alert-container-full');
        _popup.setCallback(function(){
          setTimeout(function(){
          _popup.destroy()
        },500);
        });
        _popup.open();
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', _dataReason);
      }
    }
  };

  ns.Events.CreateProfile = function(data){
    console.log(data);
    if (data['status'] == 'success'){
      if (data.profile) document.location = '/profile?id=' + data['profile']['profile_id'];
      else if (data.profile_id) document.location = '/profile?id=' + data['profile_id'];
    }
    else{
      $('.spinner').remove();
      var _dataReason = Pard.ErrorHandler(data.reason);
      if (typeof _dataReason == 'object'){
        var _popup = Pard.Widgets.Popup();
        _dataReason.setCallback(function(){
          _popup.close();
          setTimeout(function(){
            _popup.destroy()
           },500);
        });
        _popup.setContent('', _dataReason.render());
        _popup.setContentClass('alert-container-full');
        _popup.setCallback(function(){
          setTimeout(function(){
          _popup.destroy()
        },500);
        });
        _popup.open();
      }
      else{ 
        console.log(data.reason);
        Pard.Widgets.Alert('', _dataReason);
      }
    }
  };

  ns.Events.ModifyProduction = function(data){
    if (data['status'] == 'success'){
      Pard.ProfileManager.modifyProduction(data.production);
      var _profile_id = Pard.ProfileManager.getProfileId(data.production.production_id);
      Pard.Widgets.ProductionsNavigation(_profile_id, $('#_profileNav'), $('#_sectionContent'), data.production.production_id);
    }
    else{
      var _dataReason = Pard.ErrorHandler(data.reason);
      if (typeof  _dataReason == 'object'){
        var _popup = Pard.Widgets.Popup();
        _dataReason.setCallback(function(){
          _popup.close();
          setTimeout(function(){
            _popup.destroy()
           },500);
        });
        _popup.setContent('', _dataReason.render());
        _popup.setContentClass('alert-container-full');
        _popup.setCallback(function(){
          setTimeout(function(){
          _popup.destroy()
        },500);
        });
        _popup.open();
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('',  _dataReason);
      }
    }
  }

  ns.Events.ModifyMultimedia = function(data){
    if (data['status'] == 'success'){
      var profile_id = Pard.ProfileManager.getProfileId(data.production.production_id);
      document.location = '/profile?id=' + profile_id + '&sel=' + data.production.production_id;
    }
    else{
      var _dataReason = Pard.ErrorHandler(data.reason);
      if (typeof _dataReason == 'object'){
        var _popup = Pard.Widgets.Popup();
        _dataReason.setCallback(function(){
          _popup.close();
          setTimeout(function(){
            _popup.destroy()
           },500);
        });
        _popup.setContent('', _dataReason.render());
        _popup.setContentClass('alert-container-full');
        _popup.setCallback(function(){
          setTimeout(function(){
          _popup.destroy()
        },500);
        });
        _popup.open();
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', _dataReason);
      }
    }
  }

  ns.Events.DeleteProposal = function(data){
    if (data['status'] == 'success'){
      // console.log(data);
      Pard.Widgets.Alert('', Pard.t.text('proposal.deleteOk'), function(){location.reload();})
    }
    else{
      var _dataReason = Pard.ErrorHandler(data.reason);
      if (typeof _dataReason == 'object'){
        var _popup = Pard.Widgets.Popup();
        _dataReason.setCallback(function(){
          _popup.close();
          setTimeout(function(){
            _popup.destroy()
           },500);
        });
        _popup.setContent('', _dataReason.render());
        _popup.setContentClass('alert-container-full');
        _popup.setCallback(function(){
          setTimeout(function(){
          _popup.destroy()
        },500);
        });
        _popup.open();
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', _dataReason);
      }
    }
  }

  ns.Events.DeleteProduction = function(data){
    if (data['status'] == 'success'){
      location.reload();
    }
    else{
      var _dataReason = Pard.ErrorHandler(data.reason);
      if (typeof _dataReason == 'object'){
        var _popup = Pard.Widgets.Popup();
        _dataReason.setCallback(function(){
          _popup.close();
          setTimeout(function(){
            _popup.destroy()
           },500);
        });
        _popup.setContent('', _dataReason.render());
        _popup.setContentClass('alert-container-full');
        _popup.setCallback(function(){
          setTimeout(function(){
          _popup.destroy()
        },500);
        });
        _popup.open();
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', _dataReason);
      }
    }
  }

  ns.Events.DeleteProfile = function(data){
    if (data['status'] == 'success'){
      location.href = '/users/';
    }
    else{
      var _dataReason = Pard.ErrorHandler(data.reason);
      if (typeof _dataReason == 'object'){
        var _popup = Pard.Widgets.Popup();
        _dataReason.setCallback(function(){
          _popup.close();
          setTimeout(function(){
            _popup.destroy()
           },500);
        });
        _popup.setContent('', _dataReason.render());
        _popup.setContentClass('alert-container-full');
        _popup.setCallback(function(){
          setTimeout(function(){
          _popup.destroy()
        },500);
        });
        _popup.open();
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', _dataReason);
      }
    }
  }

  ns.Events.DeleteUser = function(data){
    if (data['status'] == 'success'){
      location.href = '/';
    }
    else{
      var _dataReason = Pard.ErrorHandler(data.reason);
      if (typeof _dataReason == 'object'){
        var _popup = Pard.Widgets.Popup();
        _dataReason.setCallback(function(){
          _popup.close();
          setTimeout(function(){
            _popup.destroy()
           },500);
        });
        _popup.setContent('', _dataReason.render());
        _popup.setContentClass('alert-container-full');
        _popup.setCallback(function(){
          setTimeout(function(){
          _popup.destroy()
        },500);
        });
        _popup.open();
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', _dataReason);
      }
    }
  }

  ns.Events.AmendProposal = function(data){
    if (data['status'] == 'success'){
      Pard.Widgets.TimeOutAlert('', Pard.t.text('proposal.amend'),'', function(){ location.reload(); });
    }
    else{
      console.log(data.reason);
      //Pard.Widgets.Alert('', _dataReason);
    }
  }

  ns.Events.DeleteOwnProposal = function(data){
    console.log(data);
    if (data['status'] == 'success'){
      Pard.Widgets.Alert('', Pard.t.text('manager.proposals.deleteOk'), function(){
        location.reload();
      });
    }
    else{
      var _dataReason = Pard.ErrorHandler(data.reason);
      if (typeof _dataReason == 'object'){
        Pard.Widgets.Alert(Pard.t.text('error.alert'), Pard.t.text('error.unsaved'), location.reload());
      }
      else{
        console.log(data.reason);
        Pard.Widgets.Alert('', _dataReason, location.reload());
      }
    }
  }

  ns.Events.CreateProduction = function(data){
    if(data['status'] == 'success') {
      console.log(data);
      Pard.Widgets.Alert('', Pard.t.text('production.createOk'));
    }else{
      Pard.Widgets.Alert('',data.reason);
    }  
  }

}(Pard || {}));
  