'use strict';

(function(ns){

     
ns.Widgets = ns.Widgets || {};  

  ns.Widgets.Footer = function(){

    $(document).on('closed.zf.reveal', '[data-reveal]', function() {
      if (!($('.reveal[aria-hidden="false"]').length)){
        $('html').removeClass('overflowHidden');
      }
    });
    $(document).on('open.zf.reveal', function(){
      $('html').addClass('overflowHidden');
    });

    var _createdWidget = $('<footer>').addClass('footer-bar');
    var userStatus = Pard.UserStatus['status'];

    if (userStatus == 'outsider') _createdWidget.addClass('footer-outsider');

    var _grid = $('<div>').addClass('pard-grid');
    var _container= $('<div>').addClass('pard-container-relative');
    var _leftContent = $('<div>').addClass('left-bar-content  footer-left');
    var _rightContent = $('<div>').addClass('right-bar-content footer-right');

    var _leftMenu = $('<ul>').addClass('leftFooter-menu');

    var _langPopup;
    var _languages = $('<a>').attr('href','#/')
      .html('Idiomas')
      .addClass('footer-text-link')
      .one('click',function(){
        var _langMessage = Pard.Widgets.LanguagesMessage().render();
        _langPopup = Pard.Widgets.Popup();
        _langPopup.setContent('', _langMessage);
      })
      .on('click', function(){
        _langPopup.open();
      });

    var _termsAndConditionsPopup;
    var _termsAndConditions = $('<a>').attr('href','#/')
      .html('Condiciones')
      .addClass('footer-text-link')
      .one('click',function(){
        var _termsAndConditionsMessage = Pard.Widgets.TermsAndConditionsMessage().render();
        _termsAndConditionsPopup = Pard.Widgets.Popup();
        _termsAndConditionsPopup.setContent('', _termsAndConditionsMessage);
      })
      .on('click',function(){
        _termsAndConditionsPopup.open();
      });

       
    var _infoPopup;
    var _information = $('<a>').attr('href','#/')
      .html('Proyecto')
      .addClass('footer-text-link')
      .one('click',function(){
        var _infoMessage =  Pard.Widgets.ProjectInfoMessage().render();
        _infoPopup = Pard.Widgets.Popup();
        _infoPopup.setContent('', _infoMessage);
      })
      .on('click',function(){
        _infoPopup.open();
      });

    _leftContent.append(_leftMenu.append($('<li>').append(_information), $('<li>').append(_termsAndConditions), $('<li>').append(_languages)));

    // var _project = $('<span>').text('orfheo proyecto comunitario');
    // var _place = $('<span>').text('Benimaclet, Valencia 2016');
    var _content = $('<div>').addClass('very-fast reveal full');
   
    $(document).ready(function(){
      $('body').append(_content);
    });

    var _rightMenu = $('<ul>').addClass('rightFooter-menu');

    var _contactPopup;
    var _contactaOrfheo = $('<li>').append($('<a>').text('Contacta')
      .attr('href','#/'))
      .one('click',function(){
        _contactPopup =  new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', multipleOpened:true});
      })
      .on('click',function(){
        _content.empty().append(Pard.Widgets.ContactInfo(_contactPopup));
        _contactPopup.open();
      });

    var _collabPopup;
    var _colabInfo;
    var _collabOrfheo = $('<li>').append($('<a>').text('Colabora')
      .attr('href','#/'))
      .one('click',function(){
        _collabPopup =  new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', multipleOpened:true});
        _colabInfo = Pard.Widgets.ColaborationInfo(_collabPopup);
      })
      .on('click',function(){
        _content.empty().append(_colabInfo);
        _collabPopup.open();
      });

    var _servicesPopup;
    var _servicesInfo;
    var _servicesOrfheo = $('<li>').append($('<a>').text('Servicios')
      .attr({
        'href':'#/',
        'id':'servicios'
      }))
      .one('click',function(){
        _servicesPopup =  new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', multipleOpened:true});
        _servicesInfo = Pard.Widgets.ServicesInfo(_servicesPopup);
      })
      .on('click',function(){
        _content.empty().append(_servicesInfo);
        _servicesPopup.open();
      });

    // _rightContent.append(_project, ' | ', _place);
    _rightContent.append(_rightMenu.append(_servicesOrfheo, _collabOrfheo,_contactaOrfheo));

    _container.append(_leftContent,_rightContent);
    _grid.append(_container);
    _createdWidget.append(_grid);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  

}(Pard || {}));
