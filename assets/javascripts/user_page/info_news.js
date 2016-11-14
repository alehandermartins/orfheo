'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.ConfusionInfo = {
    "profile_id" : "fce01c94-4a2b-49ff-b6b6-dfd53e45bb83",
    "organizer": "conFusión",
    "event_id" : "a5bc4203-9379-4de0-856a-55e1e5f3fac6",
    "call_id" : "b5bc4203-9379-4de0-856a-55e1e5f3fac6",
    "name" : "Benimaclet conFusión festival III ed.",
    "baseline" : "Festival libre de expresión gratuita",
    "place": "Benimaclet - Valencia",
    "address":{
      "locality":"Benimaclet - Valencia",
      "postal_code": "46020"
    },
    "img" : "cartel_conFusion_2016_cut_kdyyoj",
    "eventTime" : {
        "2016-10-15" : [ 
            [ 
                "1476518400000", 
                "1476532800000"
            ], 
            [ 
                "1476543600000", 
                "1476568800000"
            ]
        ],
        "2016-10-16" : [ 
            [ 
                "1476604800000", 
                "1476705600000"
            ], 
            [ 
                "1476630000000", 
                "1476655200000"
            ]
        ],
        "permanent" : [ 
            "11:00", 
            "21:00"
        ]
    },
    "start" : "1462053660000",
    "deadline" : "1466027999000",
    "published": true
  }

  ns.DistritoInfo = {
    "profile_id" : "2c303d75-0d9d-4fec-b8c9-d17c7e5283c0",
    "organizer": "Distrito 008",
    "event_id" : "a6bc4203-9379-4de0-856a-55e1e5f3fac6",
    "qr" : "qr_h3ujck",
    "call_id" : "b6bc4203-9379-4de0-856a-55e1e5f3fac6",
    "name" : "VII Distrito 008. Festival Urbano de Extramurs",
    "baseline" : "Somos Barrio / Som Barri",
    "img" : "distrito008_eojj5t",
    "place": "Extramurs - Valencia",
    "address":{
      "locality":"Extramurs - Valencia",
      "postal_code": "46008"
    },
    "eventTime" : {
        "2017-03-30" : [ 
            [ 
                "1490893200000", 
                "1490893200000"
            ], 
            [ 
                "1490905800000", 
                "1490905800000"
            ]
        ],
        "2017-03-31" : [ 
            [ 
                "1490970600000", 
                "1490970600000"
            ], 
            [ 
                "1490997600000", 
                "1490997600000"
            ]
        ],
        "2017-04-01" : [ 
            [ 
                "1491033600000", 
                "1491033600000"
            ], 
            [ 
                "1491084000000", 
                "1491084000000"
            ]
        ],
        "2017-04-02" : [ 
            [ 
                "1491120000000", 
                "1491120000000"
            ], 
            [ 
                "1491170400000", 
                "1491170400000"
            ]
        ],
        "2017-04-07" : [ 
            [ 
                "1491575400000", 
                "1491575400000"
            ], 
            [ 
                "1491602400000", 
                "1491602400000"
            ]
        ],
        "2017-04-08" : [ 
            [ 
                "1491638400000", 
                "1491638400000"
            ], 
            [ 
                "1491688800000", 
                "1491688800000"
            ]
        ],
        "permanent" : [ 
            "17:00", 
            "21:00"
        ]
    },
    "start" : "1479682860000",
    "deadline" : "1482793199000"
  }

  ns.Widgets.ConfusionProgramOnline = function(date){
    var _newsContainer = $('<div>').addClass('news-box-welcome-page');
    
    var _event = Pard.ConfusionInfo;

    var _eventCard = Pard.Widgets.EventInfoCardWU(_event);
    _newsContainer.append(_eventCard.render());

    if (date) {
      var _date = $('<div>').append($('<span>').text(date).addClass('news-date')).css('height','0.5rem');
      _newsContainer.prepend(_date);
    }

    return {
      render: function(){
        return _newsContainer;
      }
    }
  }

  ns.Widgets.Distrito008Call = function(date){
     var _newsContainer = $('<div>').addClass('news-box-welcome-page');
    
    var _event = Pard.DistritoInfo;

    var _eventCard = Pard.Widgets.EventInfoCardDistrito(_event);
    _newsContainer.append(_eventCard.render());

    if (date) {
      var _date = $('<div>').append($('<span>').text(date).addClass('news-date')).css('height','0.5rem');
      _newsContainer.prepend(_date);
    }

    return {
      render: function(){
        return _newsContainer;
      }
    }
  }


  ns.Widgets.EventInfoCardDistrito = function(event){
    var _createdWidget = $('<div>');
    var _image = $('<div>').addClass('card-container-news eventImage-event-info-card');
    var _logo = $('<a>').append($.cloudinary.image(event.img,{ format: 'png', width: 175, height: 228, crop: 'fill', effect: 'saturation:50' })).attr('href','#');
    _image.append(_logo);
    
    var _popupImg = $.cloudinary.image(event.img,{ format: 'jpg',  width: 750, effect: 'saturation:50' });

    var _popupContainer = $('<div>').addClass('fast reveal full');    
    var _outerContainer = $('<div>').addClass('vcenter-outer');
    var _innerContainer = $('<div>').addClass('vcenter-inner');
    

    var _closeBtn = $('<button>').addClass('close-button small-1 popup-close-btn').attr({type: 'button'});
    _closeBtn.append($('<span>').html('&times;'));

    var _popup = new Foundation.Reveal(_popupContainer, {animationIn: 'fade-in', animationOut: 'fade-out'});

    _closeBtn.click(function(){
      _popup.close();
    });

    var _popupContent = $('<div>').addClass('popup-photo-container').append(_popupImg,_closeBtn);

    _innerContainer.append(_popupContent);
    _popupContainer.append(_outerContainer.append(_innerContainer));

    _logo.one('mouseover', function(){
      $('body').append(_popupContainer)
    });

    _logo.click(function(){
      _popup.open();
    });


    var _infoBox = $('<div>').addClass('info-box-news-welcome-page');
    var _infoTitle = $('<div>').append($('<h4>').append($('<a>').text(event.name).attr('href','/event?id='+event.event_id).css({'vertical-align':'0'})).addClass('eventName-event-card'));
    var _baseline = $('<div>').append($('<p>').text(event.baseline)).addClass('baseline-event-info-card').css('font-size','1rem');
    var _organizer = $('<div>').append($('<p>').text('Organiza: ').append($('<a>').text(event.organizer).attr({'href': '/profile?id='+event.organizer_id}))).css({'margin-bottom':'-1rem', 'font-size':'1rem'});
    var _eventdays = '';
    var _dayArray = [];
    for (var key in event.eventTime) {
      if (key != 'permanent') _dayArray.push(event.eventTime[key]);
    };
    if (_dayArray.length == 1){
      _eventdays = moment(new Date(parseInt(_dayArray[0]))).locale('es').format('dddd DD MMMM YYYY');
    }
    else if (_dayArray.length > 1) {
      _eventdays = $('<span>').text(moment(new Date(parseInt(_dayArray[0]))).locale('es').format('DD')+'-'+moment(new Date(parseInt(_dayArray[_dayArray.length-1]))).locale('es').format('DD')+' '+moment(new Date(parseInt(_dayArray[_dayArray.length-1]))).locale('es').format('MMMM YYYY'));
    }

    var _days =  $('<div>').append($('<p>').append(_eventdays).addClass('eventDay-event-info-card'),$('<p>').append('de 10:00 a 24:00h')).addClass('eventDate-event-info-card').css('font-size','1rem');

    var _status = $('<div>').css({'margin-bottom':'0', 'font-size':'1rem','margin-top':'-1rem','width':'32rem'  });
    var _now = new Date();
    if (event.published){
      var _toEventPageBtn = $('<a>').text('¡Programación online!').attr('href','/event?id='+event.event_id).addClass('toEventPageBtn-event-info-card');
        _status.append(_toEventPageBtn);
    }
    else if (_now.getTime() < parseInt(event.start)){
      _status.append('Apertura convocatoria: ',moment(parseInt(event.start)).locale('es').format('DD MMMM 2016'));
    }
    else if (_now.getTime() < parseInt(event.deadline)){
      _status.append($('<p>').text('¡Convocatoria abierta!'),$('<p>').append('Apúntate desde la ', $('<a>').attr('href','/event?id='+event.event_id).text('página del evento')));
    }
    else{
       _status.append('Convocatoria cerrada');
    }

    _infoBox.append(_infoTitle, _baseline,_organizer, _days, _status);

    _createdWidget.append(_image, _infoBox);


    return {
      render: function(){
        return _createdWidget;
      }
    }
  }



  ns.Widgets.EventInfoCardWU = function(event){
    var _createdWidget = $('<div>');
    var _image = $('<div>').addClass('card-container-news eventImage-event-info-card');
    var _logo = $('<a>').append($.cloudinary.image(event.img,{ format: 'png', width: 175, height: 228, crop: 'fill', effect: 'saturation:50' })).attr('href','#');
    _image.append(_logo);
    
    var _popupImg = $.cloudinary.image(event.img,{ format: 'jpg',  width: 750, effect: 'saturation:50' });

    var _popupContainer = $('<div>').addClass('fast reveal full');    
    var _outerContainer = $('<div>').addClass('vcenter-outer');
    var _innerContainer = $('<div>').addClass('vcenter-inner');

    var _closeBtn = $('<button>').addClass('close-button small-1 popup-close-btn').attr({type: 'button'});
    _closeBtn.append($('<span>').html('&times;'));

    var _popup = new Foundation.Reveal(_popupContainer, {animationIn: 'fade-in', animationOut: 'fade-out'});

    _closeBtn.click(function(){
      _popup.close();
    });

    var _popupContent = $('<div>').addClass('popup-photo-container').append(_popupImg,_closeBtn);

    _innerContainer.append(_popupContent);
    _popupContainer.append(_outerContainer.append(_innerContainer));

    _logo.one('mouseover', function(){
      $('body').append(_popupContainer)
    });

    _logo.click(function(){
      _popup.open();
    });


    var _infoBox = $('<div>').addClass('info-box-news-welcome-page');
    var _infoTitle = $('<div>').append($('<h4>').append($('<a>').text(event.name).attr('href','/event?id='+event.event_id).css({'vertical-align':'0'})).addClass('eventName-event-card'));
    var _baseline = $('<div>').append($('<p>').text(event.baseline)).addClass('baseline-event-info-card');
    var _organizer = $('<div>').append($('<p>').text('Organiza: ').append($('<a>').text(event.organizer).attr({'href': '/profile?id='+event.organizer_id}))).css('margin-bottom','-1rem');
    var _eventdays = '';
    var _dayArray = [];
    for (var key in event.eventTime) {
      if (key != 'permanent') _dayArray.push(event.eventTime[key]);
    };
    if (_dayArray.length == 1){
      _eventdays = moment(new Date(parseInt(_dayArray[0]))).locale('es').format('dddd DD MMMM YYYY');
    }
    else if (_dayArray.length > 1) {
      _eventdays = $('<span>').text(moment(new Date(parseInt(_dayArray[0]))).locale('es').format('DD')+'-'+moment(new Date(parseInt(_dayArray[_dayArray.length-1]))).locale('es').format('DD')+' '+moment(new Date(parseInt(_dayArray[_dayArray.length-1]))).locale('es').format('MMMM YYYY'));
    }

    var _days =  $('<div>').append($('<p>').append(_eventdays).addClass('eventDay-event-info-card'),$('<p>').append('de 11:00 a 14:00 y de 17:00 a 24:00h')).addClass('eventDate-event-info-card');

    var _status = $('<div>').css('margin-bottom','0');
    var _toEventPageBtn = $('<a>').text('¡Programación online!').attr('href','/event?id=a5bc4203-9379-4de0-856a-55e1e5f3fac6').addClass('toEventPageBtn-event-info-card');
    _status.append(_toEventPageBtn);

    _infoBox.append(_infoTitle, _baseline,_organizer, _days, _status);

    _createdWidget.append(_image, _infoBox);


    return {
      render: function(){
        return _createdWidget;
      }
    }
  }



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
    var _infoTitle = $('<div>').append($('<h4>').text('Benimaclet conFusión festival III ed.').addClass('info-title-news-user').css({'margin-bottom':'0'}));
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