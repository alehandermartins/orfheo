'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};
 
  ns.Widgets.OrganizationSection = function(sectionHeader, profile_id) {

    profile_id = profile_id || Pard.CachedProfiles[0].profile_id;
    var profile = Pard.ProfileManager.getProfile(profile_id);
    var userStatus = Pard.UserStatus['status'];
   
    Pard.Widgets.ProfileSectionHeader(sectionHeader, profile);

    var _rgb = Pard.Widgets.IconColor(profile['color']).rgb();
    var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
    $('#main-profile-page').css({'background': _backColor});
  }

  ns.Widgets.OrganizationSectionContent = function(profile){
    console.log(profile);

    var _createdWidget = $('<div>');
    var userStatus = Pard.UserStatus['status'];

    var _infoBoxContainer = Pard.Widgets.SectionBoxContainer('Información', Pard.Widgets.IconManager('information').render().addClass('info-icon-title-box')).render();
    var _infoContentBox = $('<div>').addClass('box-content');
    
    
    var _contact = $('<div>').addClass('information-contact');
    var _bio = $('<div>').addClass('information-bio')


    if(profile['bio']){ 
      _bio.append($('<p>').text(profile['bio']));
    }  

    var _type = $('<p>').addClass('information-contact-text-column type-text-info-box').append($('<span>').text(Pard.Widgets.Dictionary('festival').render()));
    var _typeIcon = Pard.Widgets.IconManager(profile['type']).render().addClass('information-contact-icon-column type-icon-info-box');

    _contact.append($('<div>').append(_typeIcon, _type));

    var _city = $('<div>').append(Pard.Widgets.IconManager('city_artist').render().addClass('information-contact-icon-column'), $('<p>').addClass('information-contact-text-column').append($('<a>').attr({
      href: 'http://maps.google.com/maps?q='+profile['city']+' '+profile['zip_code'],
      target: '_blank'
      }).text(profile['city'])));

    _contact.append(_city);

    if(profile.personal_web){
      _contact.append(Pard.Widgets.PrintWebsList(profile['personal_web']).render());
    };


    _infoContentBox.append(_bio, _contact);
    _infoBoxContainer.append(_infoContentBox);
    _createdWidget.append(_infoBoxContainer);

    var _callsBoxContainer = Pard.Widgets.SectionBoxContainer('Convocatoria 2016', Pard.Widgets.IconManager('open_call').render()).render();
    var _callsBoxContent = $('<div>').addClass('box-content');

    if (userStatus != 'owner'){
      if(profile.calls) profile.calls.forEach(function(call){
        var _callsInfoTitle = $('<p>').text('Convocatoria cerrada.').css('font-weight','bold');
        var _callsInfoText = $('<p>').html('Pronto la programación interactiva.');
        // var _participation = $('<p>').append($('<a>').attr({'href': '#', 'target': '_blank' }).text('Bases de participación.'))
       
        // var _signUpMessage =  Pard.Widgets.Registration();    
        // var _caller = $('<button>').attr({type:'button'}).html('Apúntate').addClass('signUp-button-welcome-section');
        // var _popup = Pard.Widgets.PopupCreator(_caller, 'Empieza creando una cuenta', function(){return _signUpMessage});
        var _callsInfo = $('<div>').append(_callsInfoTitle, _callsInfoText);
        _callsBoxContent.append(_callsInfo);

        if (profile.calls && profile.calls[0] && profile.calls[0].whitelist){
          var _button = $('<button>').html('Envía una propuesta').addClass('signUp-button-welcome-section');
          _button.click(function(){
            var _listProfile = function(data){
              if(data['status'] == 'success'){
                var _caller = $('<button>');
                var _popup = Pard.Widgets.PopupCreator(_caller,'Inscribe un perfil ya creado', function(){return Pard.Widgets.ChooseProfileMessage(data.profiles, call.call_id)});
                _caller.trigger('click');
              }
              else{
                Pard.Widgets.Alert('Problema en el servidor', _dataReason).render();
              }
            }
            Pard.Backend.listProfiles(_listProfile);
          })
          _callsInfo.append(_button);
          _callsInfoTitle.removeAttr('style');
          _callsInfoText.empty();
          _callsInfoText.html('<strong> Sin embargo, la organización te ha habilitado para que puedas enviar propuestas fuera de tiempo.</strong>');
        }
      });
    }

    if (userStatus == 'owner'){
      var _modifyProfile = Pard.Widgets.ModifySectionContent(Pard.Widgets.ModifyProfile(profile).render(), profile['color']);
      _createdWidget.append(_modifyProfile.render());
      console.log(profile);
      if(profile.calls) profile.calls.forEach(function(call){


        var _manageCallText = $('<p>').text('Gestiona convocatoria').addClass('manage-call-text');
        var _manageCallBtn =  $('<div>').addClass('manage-call-btn').click(function(){location.href = '/call?id='+ call.call_id});
        var _manageCallBtnText = $('<span>').text('conFusión 2016').addClass('manage-call-btn-text');
        var _manageCallBtnIcon = Pard.Widgets.IconManager('proposals').render().addClass(' create-profile-btn-icon');
        
        _callsBoxContent.append(_manageCallText, _manageCallBtn.append(_manageCallBtnIcon,_manageCallBtnText));
      });
    }


    // if(profile.calls){ 
    //   var _searchEngine = Pard.Widgets.SearchEngine('', profile.calls[0].event_id);
    //   var _callProposalsTitle = $('<div>').append($('<h5>').text('Descubre los participantes')).addClass('call-proposals-title');
    //   _callsBoxContent.append(_callProposalsTitle, _searchEngine.render());
    // }


    _createdWidget.append(_callsBoxContainer.append(_callsBoxContent));


    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.ChooseProfileMessage = function(profiles, call_id){
    var _createdWidget = $('<div>');

    profiles.forEach(function(profile){
      var _cardContainer = $('<div>').addClass('card-container-popup position-profileCard-login');
      var _card = Pard.Widgets.CreateCard(profile).render();
      // var _card = $('<button>').text(profile.name);
      _card.removeAttr('href');
      _card.attr('href','#');
      _card.click(function(){
        if (profile.type == 'space' && profile.proposals && profile.proposals[0]) Pard.Widgets.Alert('Este perfil no puede enviar más propuestas', 'Este espacio ya está apuntado en el conFusión 2016. ');
        else{
          var _caller =  Pard.Widgets.ProposalForm(profile.type).render();
          _caller(profile,'',call_id).render().trigger('click');
        }
      });
      _createdWidget.append(_cardContainer.append(_card));
    });

    _createdWidget.append($('<h4>').text('...o crea e inscribe uno nuevo'));

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(closepopup){
      }
    } 
  }



}(Pard || {}));
