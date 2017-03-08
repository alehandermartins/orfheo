'use strict';

(function(ns){
     
ns.Widgets = ns.Widgets || {};

	ns.Widgets.MainServicesPage = function(videoLink){

		var _main = $('<main>').addClass('mainServicesPage');
		var _initialSection = $('<section>');
		var _eventSection = Pard.Widgets.ServiceSection();
		var _callSection = Pard.Widgets.ServiceSection();
		var _managerSection = Pard.Widgets.ServiceSection();
		var _programSection = Pard.Widgets.ServiceSection();
		var _publishSection = Pard.Widgets.ServiceSection();
		var _mobileSection = $('<section>').addClass('serviceSection mobileSectionServicePage');
		var _otherSection = Pard.Widgets.ServiceSection();
		var _videoSection = $('<section>').addClass('serviceSection videoSectionServicePage');
		var _priceSection = $('<section>').addClass('serviceSection priceSectionServicePage');
		var _finalSection = $('<section>').addClass('finalSectionServicePage');

		var _ibackground = $('<div>').addClass('background-initialSection');
		var _contactBtn = $('<button>')
			.attr('type','button')
			.text('Contáctanos')
			.addClass('contactButton-ServicesPage')
			.css('margin-top','1rem')
			.click(function(){
         var _contactPopup = Pard.Widgets.Popup();
        _contactPopup.setContent(Pard.t.text('profile_page.createEventTitle'), Pard.Widgets.EventContact());
        _contactPopup.setCallback(function(){
          setTimeout(function(){
            _contactPopup.destroy();
          }, 500);
        });
        _contactPopup.open();
			});
		var _iText = $('<div>')
			.addClass('text-initialSection')
			.append(
				$('<h3>').text('Together is better'),
				// $('<p>').html('Une a las personas, crea en red con tu comunidad cultural y conéctate con otras.<br> ​Lanza en orfheo la convocatoria artístico-cultural de tu evento.<br> Gestiona con una potente herramienta todos los datos, nunca ha sido igual.'),
				$('<p>').html('Une a las personas, crea en red con tu comunidad cultural y conéctate con otras.<br> ​Lanza en orfheo la convocatoria artístico-cultural de tu evento <br> y gestiona todos tus datos con una nueva y potente herramienta a partir de 29€ al mes.'),
				_contactBtn
			);
		_ibackground.append(_iText);
		_initialSection
			.addClass('initialSectionServicePage')
			.append(
				$('<div>').addClass('pard-grid isContainer')
					.append(_ibackground)
			);

		var serviceText = function(num, title, text){
			var _num = $('<span>').text(num).addClass('numberText')
			var _text = $('<div>')
				.addClass('textContainer')
				.append(
					$('<h3>').append(_num, title),
					$('<p>').text(text)
				)
			return _text;
		}

		// var _eTitle = 'Abre tu evento, <br>más allá de tu evento';
		var _eTitle = 'Expande tu evento <br>más allá de un evento';
		var _eText = 'Abrir tu evento en orfheo significa alimentar y dar valor a tu comunidad más allá de un solo encuentro. Tendrás una página enteramente dedicada. Entrarás en un mundo lleno de nuevas posibilidades cuturales creadas por conexiones, un universo en expansión construido para fomentar al máximo la participación, compartir recursos y llegar a nuevos públicos...'
		// var _eText = 'Abrir tu evento en orfheo significa alimentar y valorizar tu comunidad más allá de un solo encuentro. Significa expandir tus horizontes, crear en red, unir proyectos para una noble causa. Podras abrir un mundo lleno de nuevas posibilidades culturales creadas por conexiones.  Un universo en expansión construido para fomentar al máximo la participación, compartir recursos y llegar a nuevos públicos. Una plataforma para conectar cultura donde la innovación es ‘’social’’.'
		var _eventImage = $('<div>').addClass('eventImageServicePage');
		_eventSection.appendLeft(serviceText(1, _eTitle, _eText));
		_eventSection.appendRight(_eventImage);

		// var _cTitle =  'Lanza con fuerza, <br>tu convocatoria';
		var _cTitle =  'Lanza con fuerza <br>tu convocatoria';
		var _cText = 'Empieza bien con tu formulario personalizado, es el principio de algo grande. Cualquiera puede apuntarse fácilmente a tu convocatoria desde la página de tu evento. Pregunta todo lo quieras. Recibirás todo ya ordenado y organizado automáticamente.'
		// var _cText = 'Empieza bien, desde le principio. Pasa a digital tu formulario personalizado. Este es más que un formulario. Es el principio de algo grande. Un momento mágico en el cual las propuestas pueden empezar a transformar el mundo. Todos pueden apuntarse fácilmente a tu convocatoria directamente en la pagina de tu evento. Pregunta todo lo quieras: lo recibirás ya ordenado y organizado automáticamente.'
		var _callImage = $('<div>').addClass('callImageServicePage');
		if($(window).width()<1024){
			_callSection.appendRight(_callImage);
			_callSection.appendLeft(serviceText(2, _cTitle, _cText));
		} 
		else{
			_callSection.appendLeft(_callImage);
			_callSection.appendRight(serviceText(2, _cTitle, _cText));
		}

		var _mTitle = 'Visualiza y gestiona <br> los datos recibidos';
		var _mText = 'Visualiza, filtra y explora de forma fácil y rápida todas las propuestas recibidas. Navega entre los perfiles y selecciona los participantes. Exporta datos, listados de correo y todo lo que te haga falta con tan solo un "click". Ahorra tiempo, aprovecha la potencia de la información bien organizada, mantén todo bajo control.'
		// var _mText = 'Todo ya esta organizado y ordenado automáticamente. Gestiona las propuestas recibidas de tu evento y contacta las personas. Visualiza, filtra y explora de forma facil y rápida. Navega entre los perfiles y selecciona los participantes. Exporta listados y haz lo que te haga falta en tan solo un click. Toda la potencia de tus informaciones. Aprovecha a lo mejor tu tiempo, todo es mas sencillo, todo bajo control.'
		var _mImage = $('<div>').addClass('managerImageServicePage');
		_managerSection.appendRight(_mImage);
		_managerSection.appendLeft(serviceText(3, _mTitle, _mText));

		var _pTitle = 'Crea el programa,<br> nunca ha sido igual';
		var _pText = ' Construir la programación de tu evento es tan fácil como arrastrar las propuestas en un tablón. Organiza junto a tu equipo y desde cualquier lugar. Todo está sincronizado en tiempo real y rápidamente modificable. Confirma, comenta y descarga el programa en tablas ordenadas.'
		// var _pText = 'L﻿o que heces es especial y merece una atención especial. Crear la programación de tu evento es tan fácil como arrastrar una tarjeta. Organiza junto con tu equipo y  desde cualquier lugar. Todo esta sincronizado en tiempo real, reactivo, eficaz. Sacar el programa en tablas para cada categoría, propuesta o espacio particularmente tan solo un "click". Y otras útiles funciones.'
		var _pImage = $('<div>').addClass('programImageServicePage');
		if($(window).width()<1024){
			_programSection.appendRight(_pImage);
			_programSection.appendLeft(serviceText(4, _pTitle, _pText));
		} 
		else{
			_programSection.appendLeft(_pImage);
			_programSection.appendRight(serviceText(4, _pTitle, _pText));
		}

		var _pshTitle = 'Listo? Publica el programa interactivo';
		var _pshText = 'Publica tu programa interactivo en la página del evento. Permite a tu público encontrar lo que quiera y navegar entre los perfiles de los participantes. Comparte el evento con un link y haz que sea un éxito. '
		var _pshImage = $('<div>').addClass('publishImageServicePage').append(
				$('<a>')
					.attr({'href':"http://www.freepik.com", 'target':'_blank'})
					.text('Designed by Qeaql-studio/Freepik')
					.addClass('quoteComputerImg')
				);
		_publishSection.appendRight(_pshImage);
		_publishSection.appendLeft(serviceText(5, _pshTitle, _pshText));

			var _mobileImg = $('<div>').addClass('mobileImage').append(
				$('<a>')
					.attr({'href':"http://www.freepik.com", 'target':'_blank'})
					.text('Designed by Ydlabs/Freepik')
					.addClass('quotePhoneImg')
				);
		var _mobileImg2 = $('<div>').addClass('mobileImage2');
		var _mobileImg_d = $('<div>').addClass('mobileImage_d');
		var _mobileImg_f = $('<div>').addClass('mobileImage_f');
		var _mobileTitle = 'Sorprende a tu público <br> más que nunca!';
		var _mobileText = 'Orfheo se adapta perfectamente al tamaño móvil, funcionando para ti y para tu público como la guía perfecta durante tu evento. Se pueden filtrar, ordenar y encontrar contenidos por ubicación en el mapa, por horas y días, por tags o por categorías...o todo a la vez.';
		var _mobileText = serviceText(6, _mobileTitle, _mobileText).addClass('mobileText');
		var _phonesImgs = $('<div>').append(
			_mobileImg,
			_mobileImg2,
			_mobileImg_d,
			_mobileImg_f
		) 
		if ($(window).width()>1023) 
			_mobileSection 
			.append(
				$('<div>').addClass('pard-grid')
					.append(
						_phonesImgs,
						_mobileText
					)
			);
		else _mobileSection 
			.append(
				$('<div>').addClass('pard-grid')
					.append(
						_mobileText,
						_phonesImgs.css('text-align','center')
					)
			);


		var _oLSign = $('<h3>').html('+').addClass('sign');
		var _oLTitle = $('<h3>').html('API - Integra en tiempo real lo que quieras, donde quieras');
		var _oLText = $('<p>').html('El servicio API permite recibir y utilizar los datos relativos a tus eventos y convocatorias en todas tus aplicaciones. Cualquier cambio que hagas en orfheo se actualizará de forma automática y simultánea en tu web y app para móviles. Podrás disponer de toda tu información siempre actualizada, dónde y cuándo tú quieras.');
		var _oLeft = $('<div>').append(_oLSign, _oLTitle, _oLText).addClass('otherTextContainer');
		_otherSection.appendLeft(_oLeft);
		var _oRSign = $('<h3>').html('+').addClass('sign');
		var _oRTitle = $('<h3>').html('Servicio de Asesoría Creativa para tu proyecto');
		var _oRText = $('<p>').html('Podrás disfrutar de un seguimiento constante durante todo el proceso de preparación de tu evento y descubrir nuevas estrategias creativas focalizadas en sacar y lograr lo máximo de tu proyecto.');
		var _oRight = $('<div>').append(_oRSign, _oRTitle, _oRText).addClass('otherTextContainer');
		_otherSection.appendRight(_oRight);

		var _video = $('<video>')
			.attr({
				'width':400,
				'controls':'',
				// 'autoplay':''
			})
			.append(
				$('<source>')
					.attr({
						'src':videoLink,
						'type':'video/mp4'
					})
			)
		_videoSection.append(
			_video
		)


		var _contactPriceBtn = $('<button>')
			.attr('type','button')
			.text('Contáctanos')
			.addClass('contactButton-ServicesPage')
			.click(function(){
         var _contactPopup = Pard.Widgets.Popup();
        _contactPopup.setContent(Pard.t.text('profile_page.createEventTitle'), Pard.Widgets.EventContact());
        _contactPopup.setCallback(function(){
          setTimeout(function(){
            _contactPopup.destroy();
          }, 500);
        });
        _contactPopup.open();
			});
		var _priceText = $('<div>')
			.addClass('text-pricingSection')
			.append(
				$('<h3>').text('El precio no es un limite'),
				$('<p>').html('Mediante lo que haces, estás ayudando a construir algo realmente importante,<br>no solamente un gran proyecto, sino también una vibrante comunidad enfocada a una muy noble meta.<br> Queremos que siempre puedas hacerlo y como tú, todos.'),
				$('<h4>')
					.append(
					"A partir de 29 €",
					$('<span>').text(' /mes').addClass('month'))
					.addClass('pricingText'),
				_contactPriceBtn
			);
		_priceSection
			.append(
				$('<div>').addClass('pard-grid')
					.append(_priceText)
			);

		var _finalSectionBack = $('<div>').addClass('finalSectionBackground');
		var _finalText = $('<p>').text('Creemos en universos de creatividad, inclusivos, estimulantes, innovadores, tecnológicos, de integración social y de unión. Creemos en una nueva era, donde el centro sea compartir. Creemos en la interacción y la participación de las personas. Necesitamos acciones colectivas y verdaderos motores para crear una realidad cultural más humana, accesible y cercana. Necesitamos potenciar proyectos, trabajar en red y crecer en comunidad. Soñamos con construir nuevos horizontes sin barreras, un lugar en constante expansión que permita el fácil intercambio de experiencias e información. Hagámoslo posible juntos... ahora...').addClass('finalText')
		_finalSection.append(
			$('<div>').addClass('pard-grid')
					.append(
						_finalSectionBack,
						_finalText
					)
			);

		_main.append(
			_initialSection,
			_eventSection.render().addClass('eventSectionServicePage'),
			_callSection.render().addClass('callSectionServicePage'),
			_managerSection.render().addClass('managerSectionServicePage'),
			_programSection.render().addClass('programSectionServicePage'),
			_publishSection.render().addClass('publishSectionServicePage'),
			_mobileSection,
			_otherSection.render().addClass('otherSectionServicePage'),
			// _videoSection,
			_priceSection,
			_finalSection
		)
		return _main;
	}

	ns.Widgets.ServiceSection = function(){
		
		var _section = $('<section>').addClass('serviceSection');
		var _container = $('<div>').addClass('pard-grid').css('height','100%');
		var _left = $('<div>').addClass('leftServiceSection');
		var _rigth = $('<div>').addClass('rightServiceSection'); 
		_section.append(_container.append(_left, _rigth));

		return{
			render: function(){
				return _section;
			},
			appendLeft: function(content){
				_left.append(content);
			},
			appendRight: function(content){
				_rigth.append(content);
			}
		}
	}

}(Pard || {}));