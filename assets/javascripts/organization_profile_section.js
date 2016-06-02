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

    var _createdWidget = $('<div>');
    var userStatus = Pard.UserStatus['status'];

    var _infoBoxContainer = Pard.Widgets.SectionBoxContainer('Información', Pard.Widgets.IconManager('information').render().addClass('info-icon-title-box')).render();
    var _infoContentBox = $('<div>').addClass('box-content');
    
    
    var _contact = $('<div>').addClass('information-contact');
    var _bio = $('<div>').addClass('information-bio')


    if(profile['bio']){ 
      _bio.append($('<p>').text(profile['bio']));
    }  

    var _type = $('<p>').addClass('information-contact-text-column type-text-info-box').append($('<span>').text(Pard.Widgets.Dictionary(profile['type']).render()));
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

    if (userStatus != 'owner'){
      var _callsBoxContainer = Pard.Widgets.SectionBoxContainer('Convocatoria 2016', Pard.Widgets.IconManager('open_call').render()).render();
      var _callsBoxContent = $('<div>').addClass('box-content');

      var _callsInfoTitle = $('<p>').text('Abierta hasta el 15 de Junio.').css('font-weight','bold');
      var _callsInfoText = $('<p>').html('Se aceptan todo tipo de propuestas propias y originales de carácter artístico, con un fondo humano y que impulsen valores que fomenten la armonía y convivencia entre las personas (<a href= "http://beniconfusionfest.es/es/bases" target="_blank">bases de participación</a>).');
      // var _participation = $('<p>').append($('<a>').attr({'href': '#', 'target': '_blank' }).text('Bases de participación.'))
      var _signUpMessage =  Pard.Widgets.Registration();    
      var _caller = $('<button>').attr({type:'button'}).html('Apúntate').addClass('signUp-button-welcome-section');
      var _popup = Pard.Widgets.PopupCreator(_caller, 'Empieza creando una cuenta', function(){return _signUpMessage});
      var _signUpButton = _popup.render().addClass('signUpButton-login-section');

      var _callsInfo = $('<div>').append(_callsInfoTitle, _callsInfoText);

      _callsBoxContent.append(_callsInfo,_signUpButton);
      _createdWidget.append(_callsBoxContainer.append(_callsBoxContent));
    }

    if (userStatus == 'owner'){
      var _modifyProfile = Pard.Widgets.ModifySectionContent(Pard.Widgets.ModifyProfile(profile).render(), profile['color']);
      _createdWidget.append(_modifyProfile.render());
      console.log(profile);
      if(profile.calls) profile.calls.forEach(function(call){
        var _callsBoxContainer = Pard.Widgets.SectionBoxContainer('Convocatoria 2016', Pard.Widgets.IconManager('open_call').render()).render();
        var _callsBoxContent = $('<div>').addClass('box-content');

        var _manageCallText = $('<p>').text('Gestiona convocatoria').addClass('create-profile-text').addClass('create-profile-text');
        var _manageCallBtn =  $('<div>').addClass('create-profile-btn').click(function(){location.href = '/call?id='+ call.call_id}).css('padding','0.5rem 0.25rem');
        var _manageCallBtnText = $('<span>').text('conFusión 2016').addClass('create-profile-btn-text');
        var _manageCallBtnIcon = Pard.Widgets.IconManager('proposals').render().addClass(' create-profile-btn-icon');
        
        _callsBoxContent.append(_manageCallText, _manageCallBtn.append(_manageCallBtnIcon,_manageCallBtnText));
        _createdWidget.append(_callsBoxContainer.append(_callsBoxContent));
      });
    }

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }
}(Pard || {}));
