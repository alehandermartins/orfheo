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
    // var _languages = $('<button>').attr({'type':'button'})
    //   .html(Pard.t.text('footer.languages.'+Pard.Options.language()))
    //   .addClass('footer-text-link')
    //   .one('click',function(){
    //     var _langMessage = Pard.Widgets.LanguagesMessage().render();
    //     _langPopup = Pard.Widgets.Popup();
    //     _langPopup.setContent('', _langMessage);
    //   })
    //   .on('click', function(){
    //     _langPopup.open();
    //   });
    var _languages = $('<button>').attr({'type':'button'})
      .html(Pard.t.text('footer.languages.'+Pard.Options.language()))
      .addClass('footer-languages-btn')
      .one('click',function(){
        var _langMessage = Pard.Widgets.LanguagesMessage().render();
        _langPopup = Pard.Widgets.Popup();
        _langPopup.setContent('', _langMessage);
      })
      .on('click', function(){
        _langPopup.open();
      });

    if($(window).width()>1024) _languages
      .hover(
        function(){
          _languagesList.addClass('showLangMenu');
          setTimeout(function(){
            if (!_languagesList.hasClass('showLangMenu'))_languagesList.addClass('showLangMenu');
          },500)
        },
        function(){
           setTimeout(function(){
              _languagesList.removeClass('showLangMenu');
            },500)
        }
      );

    // var _languages = $('<li>')
    //   .append(
    //     $('<span>').append(Pard.t.text('footer.languages.'+Pard.Options.language()))
    //     // ,Pard.Widgets.IconManager('arrowDropDown').render()
    //   )
    //   .addClass('footer-languages-btn is-dropdown-submenu-parent')
    
    var _languagesList = $('<div>')
      .addClass('languagesList-footer')
      .hover(
        function(){
          _languagesList.addClass('isOverMenu');
        },
        function(){
           setTimeout(function(){
              _languagesList.removeClass('isOverMenu');
            },500)
        }
      );

    var _availableLangs = $('<ul>').addClass('menu');
    _languagesList.append(_availableLangs);

    Pard.Options.availableLangs().forEach(function(lang){
      var _langItem = $('<li>').append(Pard.t.text('footer.languages.'+lang))
          .click(function(){
             Pard.Options.setLanguage(lang);
          });
      if (lang == Pard.Options.language()) _langItem.css({'font-weight':'bold'})
      _availableLangs
        .append(_langItem);
    });
    
    var _languagesWidget = $('<ul>')
        .append(_languages
        )
        .addClass('dropdown menu')
        .attr({
          'data-dropdown-menu':true,
          // 'data-disable-hover':true,
          'data-click-open':true
        });


    var _termsAndConditionsPopup;
    var _termsAndConditions = $('<button>').attr({'type':'button'})
      .html(Pard.t.text('footer.conditions'))
      .addClass('footer-text-link')
      .one('click',function(){
        _termsAndConditionsPopup = Pard.Widgets.Popup();
        var _termsAndConditionsMessage = Pard.Widgets.TermsAndConditionsMessage(_termsAndConditionsPopup).render();
        _termsAndConditionsPopup.setContent('', _termsAndConditionsMessage);
      })
      .on('click',function(){
        _termsAndConditionsPopup.open();
      });

       
    var _infoPopup;
    var _information = $('<button>').attr({'type':'button', 'id':'projectPopupBtn'})
      .html(Pard.t.text('footer.project'))
      .addClass('footer-text-link')
      .one('click',function(){
        _infoPopup = Pard.Widgets.Popup();
        var _infoMessage =  Pard.Widgets.ProjectInfoMessage(_infoPopup).render();
        _infoPopup.setContent('', _infoMessage);
      })
      .on('click',function(){
        _infoPopup.open();
      });

    _leftContent.append(
      _leftMenu.append(
        $('<li>').append(_languages),
        $('<li>').append(_information), 
        $('<li>').append(_termsAndConditions)
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
      .append($('<button>').text(Pard.t.text('footer.contact'))
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
    var _servicesOrfheo = $('<li>').append($('<a>').text(Pard.t.text('footer.services'))
      .attr({
        'href':'/services',
        'id':'toServicesPage'
      }))

    var _logoFooter = $('<div>').addClass('logoFooter');
    _rightContent.append(
      _rightMenu.append(
        _servicesOrfheo,
        _contactaOrfheo
      )
    );

    _container.append(_leftContent.prepend(_languagesList, _logoFooter), _rightContent);
    _grid.append(_container);
    _createdWidget.append(_innerFooterContainer.append(_grid));

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  

}(Pard || {}));
