'use strict';

(function(ns){
     
ns.Widgets = ns.Widgets || {};

	ns.Widgets.MainServicesPage = function(){

		var _main = $('<main>').addClass('mainServicesPage');
		var _initialSection = $('<section>');
		var _eventSection = Pard.Widgets.ServiceSection();
		var _callSection = Pard.Widgets.ServiceSection();
		var _managerSection = Pard.Widgets.ServiceSection();
		var _programSection = Pard.Widgets.ServiceSection();
		var _publishSection = Pard.Widgets.ServiceSection();
		var _mobileSection = $('<section>').addClass('serviceSection mobileSectionServicePage');
		var _otherSection = Pard.Widgets.ServiceSection();
		var _priceSection = $('<section>').addClass('serviceSection priceSectionServicePage');
		var _finalSection = $('<section>').addClass('finalSectionServicePage');

		var _ibackground = $('<div>').addClass('background-initialSection');
		var _contactBtn = $('<button>')
			.attr('type','button')
			.text('Contáctanos')
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
				$('<p>').html('Une a las personas, crea en red con tu comunidad cultural y conéctate con otras.<br> ​Lanza en orfheo la convocatoria artístico-cultural de tu evento.<br> Gestiona con una potente herramienta todos los datos, nunca ha sido igual.'),
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

		var _eTitle = 'Abre tu evento, <br>más allá de tu evento';
		var _eText = 'Abrir tu evento en orfheo significa alimentar y valorizar tu comunidad mas alla de un solo encuentro. Significa expandir tus horizontes, crear en red, unir proyectos para una noble causa. Podras abrir un mundo lleno de nuevas posibilidades culturales creadas por conexiones.  Un universo en expansión construido para fomentar al máximo la participación, compartir recursos y llegar a nuevos públicos. Una plataforma para conectar cultura donde la innovación es ‘’social’’.'
		var _eventImage = $('<div>').addClass('eventImageServicePage');
		_eventSection.appendLeft(serviceText(1, _eTitle, _eText));
		_eventSection.appendRight(_eventImage);

		var _cTitle =  'Lanza con fuerza, <br>tu convocatoria';
		var _cText = 'Empieza bien, desde le principio. Pasa a digital tu formulario personalizado. Este es más que un formulario. Es el principio de algo grande. Un momento mágico en el cual las propuestas pueden empezar a transformar el mundo. Todos pueden apuntarse fácilmente a tu convocatoria directamente en la pagina de tu evento. Pregunta todo lo quieras: lo recibirás ya ordenado y organizado automáticamente.'
		var _callImage = $('<div>').addClass('callImageServicePage');
		_callSection.appendLeft(_callImage);
		_callSection.appendRight(serviceText(2, _cTitle, _cText));

		var _mTitle = 'Visualiza y gestiona los datos recibidos';
		var _mText = 'Todo ya esta organizado y ordenado automáticamente. Gestiona las propuestas recibidas de tu evento y contacta las personas. Visualiza, filtra y explora de forma facil y rápida. Navega entre los perfiles y selecciona los participantes. Exporta listados y haz lo que te haga falta en tan solo un click. Toda la potencia de tus informaciones. Aprovecha a lo mejor tu tiempo, todo es mas sencillo, todo bajo control.'
		var _mImage = $('<div>').addClass('managerImageServicePage');
		_managerSection.appendRight(_mImage);
		_managerSection.appendLeft(serviceText(3, _mTitle, _mText));

		var _pTitle = 'Crea el programa, nunca ha sido igual';
		var _pText = 'L﻿o que heces es especial y merece una atención especial. Crear la programación de tu evento es tan fácil como arrastrar una tarjeta. Organiza junto con tu equipo y  desde cualquier lugar. Todo esta sincronizado en tiempo real, reactivo, eficaz. Sacar el programa en tablas para cada categoría, propuesta o espacio particularmente tan solo un "click". Y otras útiles funciones.'
		var _pImage = $('<div>').addClass('programImageServicePage');
		_programSection.appendLeft(_pImage);
		_programSection.appendRight(serviceText(4, _pTitle, _pText));

		var _pshTitle = 'Listo? Publica el programa interactivo';
		var _pshText = 'Publica con un click tu programa interactivo. No lo compartas solo tu, envíalo a todos. En orfheo todos publicitan todos. Haz que sea un éxito. El programa es totalmente interactivo y permite explorar o encontrar lo que quieras y navegar entre los perfiles de los participantes'
		var _pshImage = $('<div>').addClass('publishImageServicePage');
		_publishSection.appendRight(_pshImage);
		_publishSection.appendLeft(serviceText(5, _pshTitle, _pshText));

		var _mobileImg = $('<div>').addClass('mobileImage');
		var _mobileImg2 = $('<div>').addClass('mobileImage2');
		var _mobileImg_d = $('<div>').addClass('mobileImage_d');
		var _mobileImg_f = $('<div>').addClass('mobileImage_f');
		var _mobileTitle = 'Sorprede tu público más que nunca!';
		var _mobileText = 'Orfheo se adapta perfectamente al tamaño móvil, funcionando para ti y para tu público como la guía perfecta durante tu evento. Se pueden ordenar y encontrar contenidos por el mapa, por horas, días, por tags o filtrando por categorías, o todo, a la vez.';
		var _mobileText = serviceText(6, _mobileTitle, _mobileText).addClass('mobileText');
		_mobileSection 
			.append(
				$('<div>').addClass('pard-grid')
					.append(
						_mobileImg,
						_mobileImg2,
						_mobileImg_d,
						_mobileImg_f,
						_mobileText
					)
			);


		var _oLSign = $('<h3>').html('>').addClass('sign');
		var _oLTitle = $('<h3>').html('API - Integra en tiempo real lo que quieras donde quieras');
		var _oLText = $('<p>').html('El servicio API te permite recibir y utilizar los datos relativos a tus eventos y convocatorias en tu sito web o aplicación para móviles . Cualquier cambio que hagas en orfheo se actualizará de forma automática y simultánea. Podrás disponer de toda tu información siempre actualizada como, donde y cuando tú quieras.');
		var _oLeft = $('<div>').append(_oLSign, _oLTitle, _oLText).addClass('otherTextContainer');
		_otherSection.appendLeft(_oLeft);
		var _oRSign = $('<h3>').html('+').addClass('sign');
		var _oRTitle = $('<h3>').html('Servicio de Asesoria Creativa para tu proyecto');
		var _oRText = $('<p>').html('Podrás aprovechar de un seguimiento constante durante todo el proceso de preparación de tu evento y descubrir nuevas estrategias creativas focalizadas en sacar y lograr el máximo de tu comunidad cultural.');
		var _oRight = $('<div>').append(_oRSign, _oRTitle, _oRText).addClass('otherTextContainer');
		_otherSection.appendRight(_oRight);


		var _contactPriceBtn = $('<button>')
			.attr('type','button')
			.text('Contáctanos')
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
			.addClass('text-initialSection')
			.append(
				$('<h3>').text('El precio? no es un limite'),
				$('<p>').html('Mediante lo que haces, estas ayudando a construir algo realmente importante,<br>no solamente una grande plataforma de conexión de proyectos,<br>sino también una vibrante comunidad enfocada en una muy noble meta.<br>Ahora imagina si todos hicieran lo mismo...'),
				$('<h5>').text('Precio de lanzamiento a partir de 	30€/mes').addClass('pricingText'),
				_contactPriceBtn
			);
		_priceSection
			.append(
				$('<div>').addClass('pard-grid')
					.append(_priceText)
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