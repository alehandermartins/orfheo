'use strict';

(function(ns){

	ns.Widgets.ConFusionEndCall = function(date){

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
    _infoBox.append(_cardContainer);
    if (date) {
    	var _date = $('<div>').append($('<span>').text('16-06-2016').addClass('news-date')).addClass('news-date-container');
    	_infoBox.append(_date);
    }
    _infoBox.append(_infoTitle, _baseline,  _mex);
    _newsConFusionContainer.append(_infoBox);

    return{
    	render: function(){
    		return _newsConFusionContainer;
    	}
    }
	}

	ns.Widgets.OrfheoFirstMessage = function(date){

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
    var _orfheoLogo = $('<div>').addClass('orfheo-logo-card');
    _orfheoCard.append(_orfheoLogo);
    _cardOrfheoContainer.append(_orfheoCard);
    var _infoOrfheoBox = $('<div>').addClass('info-box-news-welcome-page');
    var _infoOrfheoTitle = $('<div>').append($('<h4>').text('Cuida de tu comunidad y tu comunidad cuidará de ti').addClass('info-title-news-user'));
    var _mexOrfheo = $('<div>').append($('<p>').html('Orfheo sigue evolucionando con la intención de permitir a toda la comunidad poder lanzar y gestionar convocatorias, comunicar y crear redes.'), $('<p>').html('NUEVAS FUNCIONALIDADES A PUNTO DE LLEGAR'), $('<p>').html('El proyecto está abierto a cualquier tipo de colaboración. Para más informaciones <a href="mailto:info@orfheo.org">info@orfheo.org</a>.'));
    _infoOrfheoBox.append(_cardOrfheoContainer)
    if (date) {
    	var _dateOrfheo = $('<div>').append($('<span>').text(date).addClass('news-date')).addClass('news-date-container');
    	_infoOrfheoBox.append(_dateOrfheo);
    }
    _infoOrfheoBox.append(_infoOrfheoTitle, _mexOrfheo);
    _newsOrfheoContainer.append(_infoOrfheoBox).css('margin-bottom','-1.5rem');

    return{
    	render: function(){
    		return _newsOrfheoContainer;
    	}
    }
	}

}(Pard || {}));