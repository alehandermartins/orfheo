'use strict';


(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.InsideHeader = function(menuContainer){
    var _createdWidget = $('<header>').addClass('user-bar');
    var _topBar = $('<div>').addClass('top-bar pard-grid clearfix');
    var _container = $('<div>').addClass('pard-header-container');

    var _topContent = $('<div>').addClass('top-header-content');

    var _topBarTitle = $('<div>').addClass('left-user-header-content');
    var _logo = $('<div>').addClass('logo-header inside-header-logo');
    _topBarTitle.append(_logo);
    _logo.click(function(){
      location.href = /users/;
    });
   
    var _responsiveMenu = $('<div>').addClass('clearfix displayNone-for-large');

    var _elemOffCanvas = $('<span>').addClass('menu-icon-header');
    var _iconOffCanvas = $('<span>').addClass('menu-icon dark');
    _elemOffCanvas.append(_iconOffCanvas, ' Menu').attr({'data-toggle': 'offCanvas-navBar', 'close-on-click': true}).css('cursor','pointer');

    _responsiveMenu.append(_elemOffCanvas);

    var _topBarRight = $('<div>').addClass('right-user-header-content');

    _topBarRight.append(menuContainer);

    _topContent.append(_topBarTitle, _topBarRight);

    _container.append(_topContent, _responsiveMenu);
    _topBar.append(_container);
    _createdWidget.append(_topBar);

    return {
      render: function(){
        return _createdWidget;
      } 
    }
  }


  ns.Widgets.UserDropdownMenu = function(){     

    var _menu = $('<ul>').addClass('menu');

    var _logout = $('<li>').append(Pard.Widgets.Logout().render().attr('href','#'));

    var _modifyPassword = $('<li>').append(Pard.Widgets.ModifyPassword().render().attr('href','#'));

    var _dCaller = $('<a>').attr('href','#').text('Elimina mi cuenta');
    var _deleteCaller = Pard.Widgets.PopupCreator(_dCaller, '¿Estás seguro/a?', function(){return Pard.Widgets.DeleteUserMessage()});
    var _deleteUser = $('<li>').append(_deleteCaller.render());

		_menu.append(_deleteUser, _modifyPassword,  _logout);
		var _menuContainer = $('<ul>').addClass('dropdown menu').attr({'data-dropdown-menu':true, 'data-disable-hover':true,'data-click-open':true});
		var _iconDropdownMenu = $('<li>').append(
      $('<a>').attr('href','#').append(
        $('<span>').html('&#xE8B8;').addClass('material-icons settings-icon-dropdown-menu')
        )
      ,_menu
    );

    _menuContainer.append(_iconDropdownMenu);

  	return {
  		render: function(){
  			return _menuContainer;
  		} 
  	}
  }


  ns.Widgets.DeleteUserMessage = function(){  
    
    var _createdWidget = $('<div>');
    var _message = $('<p>').text('Confirmando, todos tus datos serán eliminados de orfheo: se cancelarán todos tus perfiles y sus contenidos. Con ello, todas tus inscripciones en convocatorias serán borradas.');
    var _yesBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn confirm-delete-btn').text('Confirma');
    var _noBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn cancel-delete-btn').text('Anula');

    _yesBtn.click(function(){
      Pard.Backend.deleteUser(Pard.Events.DeleteUser);
    });

    var _buttonsContainer = $('<div>').addClass('yes-no-button-container');

    _createdWidget.append(_message,  _buttonsContainer.append(_noBtn, _yesBtn));

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _noBtn.click(function(){
          callback();
        });
        _yesBtn.click(function(){
          callback()
        });
      }
    }
  }
  
  ns.Widgets.UserAside = function (sectionContainer) {

    var _createdWidget = $('<div>').addClass('aside-container');
    
    var _profiles = $('<div>').addClass('aside-user-nav-btn');
    _profiles.text('Tus perfiles');

    _profiles.click(function(){
      _contentShowHide('myprofiles-user-page');
      $(this).addClass('aside-user-nav-btn-selected');
    });
    var _myProfiles = $('<div>').attr('id', 'myprofiles-user-page').addClass('profiles-user-section-content');
    _myProfiles.append(Pard.Widgets.MyProfilesUserPage().render());
    var _contentShown = _myProfiles;
    _profiles.addClass('aside-user-nav-btn-selected');

    var _explore = $('<div>').addClass('aside-user-nav-btn');
    _explore.text('Explora');
    _explore.click(function(){
      _contentShowHide('explore-user-page');
      $(this).addClass('aside-user-nav-btn-selected');
    });
    _explore.one('click', function(){
    _exploreContent.append(Pard.Widgets.ExploreUserPage().render());      
    });
    var _exploreContent = $('<div>').attr('id', 'explore-user-page').addClass('profiles-user-section-content');
    _exploreContent.hide();

    var _news = $('<div>').addClass('aside-user-nav-btn');
    _news.text('Novedades');
    _news.click(function(){
      _contentShowHide('news-user-page');
      $(this).addClass('aside-user-nav-btn-selected');
    });
    _news.one('click', function(){
    _newsContent.append(Pard.Widgets.NewsUserPage().render());      
    });
    var _newsContent = $('<div>').attr('id', 'news-user-page');
    _newsContent.hide();


    var _contentShowHide = function(id_selected){
      $('.aside-user-nav-btn-selected').removeClass('aside-user-nav-btn-selected');
      _contentShown.hide();
      // var _selected = '#'+id_selected;
      _contentShown = $('#'+id_selected);
      _contentShown.show();

    }

    var _buttonContainer = $('<div>').addClass('create-profile-container');
    
    _buttonContainer.append(_profiles, _explore, _news);
    sectionContainer.append(_myProfiles, _exploreContent, _newsContent);
    _createdWidget.append(_buttonContainer);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.MyProfilesUserPage = function(){
    var _createdWidget = $('<div>').addClass('search-results').css('margin-top','0');

    var _myprofiles = Pard.CachedProfiles;

    if (_myprofiles.length > 0){
      _myprofiles.forEach(function(profile){
        var _profileContainer = $('<div>').addClass('card-container position-profileCard-login');
        _createdWidget.append(_profileContainer.append(Pard.Widgets.CreateCard(profile).render()));
      })
    }

    var _createProfileCardContainer = $('<div>').addClass('card-container').css('vertical-align','top');
    var _createProfileCard =$('<a>').attr({href: '#'}).addClass('profileCard position-profileCard-login');
    var _color = '#6f6f6f';
    _createProfileCard.css({border: 'solid 3px'+_color});
    _createProfileCard.hover(
      function(){
        $(this).css({
        'box-shadow': '0 0 2px 1px'+ _color
        // 'background': 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+'.1'+ ')'
      });
      },
      function(){
        $(this).css({
          'box-shadow': '0px 1px 2px 1px rgba(10, 10, 10, 0.2)'
          // 'background':'white'
        });
      }
    );

    _createProfileCard.click(function(){
      var _caller = $('<button>');
      var _popup = Pard.Widgets.PopupCreator(_caller, 'Crea un perfil', function(){ return Pard.Widgets.CreateProfileMessage()});
      _caller.trigger('click');
    });
    _createProfileCardContainer.append(_createProfileCard);
    _createdWidget.append(_createProfileCardContainer);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ExploreUserPage = function(){

    var _createdWidget = $('<div>');
   
    var _searchEngine = Pard.Widgets.SearchEngine('');

    _createdWidget.append(_searchEngine.render());

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.NewsUserPage = function(){

    var _createdWidget = $('<div>');

    var _newsConFusionContainer = $('<div>').addClass('news-box-welcome-page ');
    var _cardContainer = $('<span>').addClass('card-container-news');
    var _profileConfusion = {
      "profile_id" : "fce01c94-4a2b-49ff-b6b6-dfd53e45bb83",
      "name" : "conFusión",
      "city" : "Benimaclet (Valencia)",
      "color" : "#920a0a",
      "type" : "organization",
      "profile_picture" : [ 
          "profile_picture/zwqdpibl1ocxrsozdghp"
      ]
    }   
    _card = Pard.Widgets.CreateCard(_profileConfusion).render();
    _cardContainer.append(_card);
    var _infoBox = $('<div>').addClass('info-box-news-welcome-page');
    var _infoTitle = $('<div>').append($('<h4>').text('Benimaclet conFusión festival III ed.').addClass('info-title-news-user').css('margin-bottom','0'));
    var _baseline = $('<div>').append($('<p>').text('15/16 Octubre 2016 - de 10 a 14 y de 17 a 23 horas'));
    var _mex = $('<div>').append($('<p>').html('CONVOCATORIA CERRADA <br/>Gracias a tod@s l@s que han participado en la convocatoria.'), $('<p>').text('Pronto en orfheo la programación interactiva del evento.').css('margin-bottom','0'));
    var _date = $('<div>').append($('<span>').text('16-06-2016').addClass('news-date')).addClass('news-date-container');
    _infoBox.append(_cardContainer, _date, _infoTitle, _baseline,  _mex);
    _newsConFusionContainer.append(_infoBox);


    var _newsOrfheoContainer = $('<div>').addClass('news-box-welcome-page ');
    var _cardOrfheoContainer = $('<span>').addClass('card-container-news');
    var _orfheoCard =$('<a>').attr({href: '#'}).addClass('profileCard').css('cursor','default');
    var _color = 'rgb(56, 133, 255)';
    _orfheoCard.css({border: 'solid 3px'+_color});
    _orfheoCard.hover(
      function(){
        $(this).css({
        'box-shadow': '0 0 2px 1px'+ _color
        // 'background': 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+'.1'+ ')'
      });
      },
      function(){
        $(this).css({
          'box-shadow': '0px 1px 2px 1px rgba(10, 10, 10, 0.2)'
          // 'background':'white'
        });
      }
    );
    _cardOrfheoContainer.append(_orfheoCard);
    var _infoOrfheoBox = $('<div>').addClass('info-box-news-welcome-page');
    var _infoOrfheoTitle = $('<div>').append($('<h4>').text('Cuida de tu comunidad y tu comunidad cuiderá de ti').addClass('info-title-news-user'));
    var _mexOrfheo = $('<div>').append($('<p>').html('Orfheo sigue evolucionando con la intención de permitir a toda la comunidad poder lanzar y gestionar convocatorias, comunicar y crear redes.'), $('<p>').html('El proyecto está abierto a cualquier tipo de colaboración. Para más informaciones <a href="mailto:info@orfheo.org">info@orfheo.org</a>.'));
    var _dateOrfheo = $('<div>').append($('<span>').text('15-06-2016').addClass('news-date')).addClass('news-date-container');
    _infoOrfheoBox.append(_cardOrfheoContainer, _dateOrfheo, _infoOrfheoTitle, _mexOrfheo);
    _newsOrfheoContainer.append(_infoOrfheoBox).css('margin-bottom','0');

    _createdWidget.append(_newsConFusionContainer, _newsOrfheoContainer);

    return{
      render: function(){
        return _createdWidget;
      }
    } 

  }  


  ns.Widgets.UserSection = function(content) {

    var _content = content.addClass('user-grid-element-content');
    
    return{
      render: function(){
        return _content;
      }
    }
  }


}(Pard || {}));
