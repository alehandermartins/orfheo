'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.LoginAside = function () {
    var _asideContainer = $('<div>').addClass('aside-container login-aside-container');

    var _info = $('<div>').addClass('aside-text-welcome-page-container');

    _info.append($('<h5>').text('Orfheo es la primera comunidad artístico-cultural donde conocer proyectos, encontrarse y crear juntos experiencias inolvidables')).css('margin-top','0');

    var _signUpButton = Pard.Widgets.SignUpButton().render();
    _signUpButton.addClass('signupButton').css('margin-top','0.5rem');

    var _info2 = $('<div>').addClass('aside-text-welcome-page-container');

    _info2.append($('<p>').html('En la comunidad de orfheo es posible <strong>lanzar y gestionar convocatorias</strong> artístico-culturales para cualquier proyecto, espacio, iniciativa ciudadana, institución y organización, festival y todo tipo de evento o encuentro. Para hacerlo, contacta <a href= "mailto:info@orfheo.org">info@orfheo.org</a>')).css('margin-top','3.5rem');

      _asideContainer.append(_info, _signUpButton, _info2);

    return{
      render: function(){
        return _asideContainer;
      }
    }
  }

  ns.Widgets.LoginSection = function (content) {

    content.empty();

    $(document).ready(function(){$('#main-welcome-page').addClass('main-welcome-page').css({'margin-top':0})});

    var _content = content.addClass('welcome-page-section');

    _content.append(Pard.Widgets.Distrito008Call().render());

    var _searchEngineContainer = $('<div>').addClass('searchBox-welcome-page');

    var _searchEngine = Pard.Widgets.SearchEngine('main-welcome-page');
    var _searchEngineBox = $('<div>').addClass('user-section-content ');
    var _searchTitle = $('<div>').addClass('orfheo-symbol-image-searchEngine');
    _searchEngineBox.append(_searchEngine.render().prepend(_searchTitle));
    _searchEngineContainer.append(_searchEngineBox);

    _content.append(_searchEngineContainer);

    return{
      render: function(){
        return _content;
      }
    }
  }


}(Pard || {}));

