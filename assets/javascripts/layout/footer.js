'use strict';

(function(ns){

     
ns.Widgets = ns.Widgets || {};  

  ns.Widgets.Footer = function(){

    var _createdWidget = $('<footer>').addClass('footer-bar');
    var userStatus = Pard.UserStatus['status'];
    var _innerFooterContainer = $('<div>').addClass('innerWrapperDiv');

    if (userStatus == 'outsider') _createdWidget.addClass('footer-outsider');

    var _grid = $('<div>').addClass('pard-grid');
    var _container= $('<div>').addClass('pard-container-relative');
    var _leftContent = $('<div>').addClass('footer-left');
    var _rightContent = $('<div>').addClass('footer-right');

    var _leftMenu = $('<ul>').addClass('leftFooter-menu');

    var _langPopup;
    var _languages = $('<button>').attr({'type':'button'})
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
    var _termsAndConditions = $('<button>').attr({'type':'button'})
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
    var _information = $('<button>').attr({'type':'button', 'id':'projectPopupBtn'})
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

    _leftContent.append(
      _leftMenu.append(
        $('<li>').append(_information), 
        $('<li>').append(_termsAndConditions)
        , $('<li>').append(_languages)
      )
    );

    // var _project = $('<span>').text('orfheo proyecto comunitario');
    // var _place = $('<span>').text('Benimaclet, Valencia 2016');
    var _content = $('<div>').addClass('very-fast reveal full');
   
    $(document).ready(function(){
      $('body').append(_content);
    });

    var _rightMenu = $('<ul>').addClass('rightFooter-menu');

    var _contactPopup;
    var _contactaOrfheo = $('<li>')
      .append($('<button>').text('Contacta')
        .attr({'type':'button','id':'contactPopupBtn'})
        .one('click',function(){
          _contactPopup =  new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', multipleOpened:true});
        })
        .on('click',function(){
          _content.empty().append(Pard.Widgets.ContactInfo(_contactPopup));
          _contactPopup.open();
        })
      );

    var _servicesPopup;
    var _servicesInfo;
    var _servicesOrfheo = $('<li>').append($('<a>').text('Servicios')
      .attr({
        'href':'/services',
        'id':'toServicesPage'
      }))

    var _logoFooter = $('<div>').addClass('logoFooter');
    _rightContent.append(
      _rightMenu.append(
        // _servicesOrfheo,
        _contactaOrfheo
      )
    );

    _container.append(_leftContent.prepend(_logoFooter), _rightContent);
    _grid.append(_container);
    _createdWidget.append(_innerFooterContainer.append(_grid));

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  

}(Pard || {}));
