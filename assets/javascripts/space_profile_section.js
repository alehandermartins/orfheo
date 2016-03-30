'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.SpaceSection = function(sectionHeader,  profile_id) {
    profile_id = profile_id || Pard.CachedProfiles['my_profiles'][0].profile_id;
    var profile = Pard.ProfileManager.getProfile(profile_id);

    Pard.Widgets.ProfileSectionHeader(sectionHeader, profile);

    var _rgb = Pard.Widgets.IconColor(profile['color']).rgb();
    var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
    $('#main-profile-page').css({'background': _backColor});

    if(profile.calls == false){
      $(document).ready(function(){Pard.Widgets.CallSpaceButton('',profile).render().trigger('click')});
    }
  }

  ns.Widgets.SpaceSectionContent = function(profile) {  

    console.log(profile); 

    var _createdWidget = $('<div>');

    var _infoBoxContainer = Pard.Widgets.SectionBoxContainer('Informaciones', Pard.Widgets.IconManager('information').render()).render();
    var _infoContentBox = $('<div>');
    
    
    var _contact = $('<div>').addClass('informations-contact');
    var _bio = $('<div>').addClass('informations-bio')
  

    if(profile['bio'] != null){     
      _bio.append($('<p>').text(profile['bio']));
    }  
   

    if('personal_web' in profile && profile['personal_web'] != null){
      
      var _webArray = Object.keys(profile['personal_web']).map(function(key){return profile['personal_web'][key]});
      var _socialIcons;
      var _socials = $('<span>');
     
      _webArray.forEach(function(elem){
        if (elem['provider'] == 'my_web'){
          var _iconLink = Pard.Widgets.IconManager('my_web').render();
          var _url = elem['url'];
          var _link = $('<a>').attr({
            href: elem['url'],
            target: '_blank'            
          }).css({
            'word-wrap': 'break-word',
          });
          ['http://', 'https://', 'www.'].forEach(function(string){
            if(_url.indexOf(string) > -1) {
              _url  = _url.substring(string.length);
            }
          })
          _link.text(_url).addClass('informations-contact-text');
          _contact.append($('<div>').append($('<div>').addClass('informations-contact-icon-column').append(_iconLink), $('<p>').addClass('informations-contact-text-column').append(_link)));
        }
        else{
          var _iconSocial = Pard.Widgets.IconManager('icon_social').render().addClass('icon-in-box');
          var _iconImg = Pard.Widgets.IconManager(elem['provider']).render();
          _iconImg.addClass('social-icon-fa')
          
          var _iconA = $('<a>').attr({
            href: elem['url'],
            target: '_blank'            
          }).append(_iconImg).addClass('informations-contact-text');
          _socials.append(_iconA);
          _socialIcons = $('<div>').append($('<div>').addClass('informations-contact-icon-column').append(_iconSocial), $('<p>').addClass('informations-contact-text-column').append(_socials))
        }
      });
      
      if (_socialIcons)  _contact.append(_socialIcons); 

    };

    var _address = $('<div>');
    var _addressIcon = Pard.Widgets.IconManager('address_space').render().addClass('informations-contact-icon-column');
    var _aStr = profile['address']['route']+' '+profile['address']['street_number']+', '+profile['address']['locality']+' ('+profile['address']['country']+')';
    var _addressText = $('<p>').addClass('informations-contact-text-column').append($('<a>').attr({
      href: 'http://maps.google.com/maps?q='+_aStr,
      target: '_blank'
      }).text(_aStr).addClass('informations-contact-text'));

    _contact.append(_address.append(_addressIcon, _addressText));

    _infoContentBox.append(_bio, _contact);
    _infoBoxContainer.append(_infoContentBox);
    _createdWidget.append(_infoBoxContainer);

    var _callsBoxContainer = Pard.Widgets.SectionBoxContainer('Actividades', Pard.Widgets.IconManager('calls').render()).render();
    var _callsBoxContent = $('<div>').addClass('box-content');

    if('calls' in profile && profile.calls != false){
      var _myArtistCallProposals = Pard.Widgets.MyArtistCallProposals(profile.calls);
      var _callButton = Pard.Widgets.CallArtistButton(profile,'Envía otra propuesta').render().addClass('callButtonArtist-sendOther');
      _callsBoxContent.append(_myArtistCallProposals.render(), _callButton);

    }else{
      var _callButton = Pard.Widgets.CallArtistButton(profile,'Envía una propuesta al conFusión 2016');
      _callsBoxContent.append(_callButton.render());
    }

    _callsBoxContainer.append(_callsBoxContent);
    _createdWidget.append(_callsBoxContainer);


    var _modifyProfile = Pard.Widgets.ModifyProfile(profile);
  

    var _iconColor = Pard.Widgets.IconColor((profile['color'])).render();

    var _triangle = $('<div>').addClass('modify-section-content-button-container');

     _createdWidget.append(
      _triangle.css({'border-top': '70px solid'+profile['color']}),
      _modifyProfile.render().css({color: _iconColor})
    );


    var _multimediaContainer = $('<div>');

    ['category'].forEach(function(element) {
      if(profile[element] != null) _createdWidget.append( $('<div>').text(profile[element]));
    });

    if(profile.video){
      profile.video.forEach(function(video){
        _multimediaContainer.append(video);
      });
    }

    if(profile.image){
      profile.image.forEach(function(image){
        _multimediaContainer.append(image);
      });
    }

    if(profile.audio){
      profile.audio.forEach(function(audio){
        _multimediaContainer.append(audio);
      });
    }

    _createdWidget.append(_multimediaContainer);

    var _modifyProfile = Pard.Widgets.ModifyProfile(profile);
    var _callButton = Pard.Widgets.CallSpaceButton(profile, 'Envía otra propuesta');
    var _mySpaceCallProposals = Pard.Widgets.MySpaceCallProposals(profile.calls);
    var _multiMediaManager = Pard.Widgets.MultimediaSpaceManager(profile);

    _createdWidget.append(
      _modifyProfile.render(),
      _mySpaceCallProposals.render(), 
      _callButton.render(),
      _multiMediaManager.render()
    );

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

}(Pard || {}));

