'use strict';
(function(ns){
 
  ns.Events = ns.Events || {};

  ns.Events.Register = function(data){
    if (data['status'] == 'success'){
      Pard.Widgets.Alert('','Te hemos enviado por correo un enlace para activar tu cuenta.');
    }
    else {
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
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
    console.log(data);
    if (data['status'] == 'success'){
      location.reload();
    }
    else {
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
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
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
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
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
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


  ns.Events.SendProposal = function(data){
    if (data['status'] == 'success'){
      Pard.Widgets.Alert('', '<h4 style = "color: rgb(76, 182, 50); margin-top: -1rem; text-align: center; font-weight: bold;">¡Genial!</h4><p style = "text-align:center">Te has inscrito correctamente</p> <p style="font-size: 14px; margin-top:1rem; text-align: center;"> Puedes enviar otra propuesta desde el mismo perfil (si eres artista) o crear e inscribir otros perfiles</p><p style="font-size: 14px; text-align: center; font-weight:bold">conFusión festival 2016</p>',
        function(){
         document.location = '/profile?id=' + data['profile_id'];
        }
      );
    }
    else{
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
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
        var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
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
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
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
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
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
      Pard.Widgets.Alert('', 'Tu solicitud de participación en el festival ha sido cancelada correctamente.', function(){location.reload();})
    }
    else{
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
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
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
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
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
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
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
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
      Pard.Widgets.Alert('', 'Enmienda enviada correctamente.', function(){ location.reload(); });
    }
    else{
      console.log(data.reason);
      Pard.Widgets.Alert('', _dataReason);
    }
  }


  ns.Events.DeleteOwnProposal = function(data){
    console.log(data);
    if (data['status'] == 'success'){
      Pard.Widgets.Alert('', 'Propuesta eliminada correctamente.', function(){
        location.reload();
      });
    }
    else{
      var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
      if (typeof _dataReason == 'object'){
        Pard.Widgets.Alert('¡Error!', 'No se ha podido guardar los datos', location.reload());
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
      Pard.Widgets.Alert('','Contenido creado correctamente');
    }else{
      Pard.Widgets.Alert('',data.reason);
    }  
  }



}(Pard || {}));
  