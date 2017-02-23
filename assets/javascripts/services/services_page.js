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
		var _publicSection = $('<section>').addClass('serviceSection publicSectionServicePage');
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

		var _eNum = $('<span>').text('1').addClass('numberText')
		var _eventText = $('<div>')
			.addClass('textContainer')
			.append(
				$('<h3>').append(_eNum, 'Abre tu evento, <br>más allá de tu evento'),
				$('<p>').text('Abrir tu evento en orfheo significa alimentar y valorizar tu comunidad mas alla de un solo encuentro. Significa expandir tus horizontes, crear en red, unir proyectos para una noble causa. Podras abrir un mundo lleno de nuevas posibilidades culturales creadas por conexiones.  Un universo en expansión construido para fomentar al máximo la participación, compartir recursos y llegar a nuevos públicos. Una plataforma para conectar cultura donde la innovación es ‘’social’’.')
			)
		var _eventImage = $('<div>').addClass('eventImageServicePage');
		_eventSection.appendLeft(_eventText);
		_eventSection.appendRight(_eventImage);

		var _cNum = $('<span>').text('2').addClass('numberText')
		var _callText = $('<div>')
			.addClass('textContainer')
			.append(
				$('<h3>').append(_cNum, 'Lanza con fuerza, <br>tu convocatoria'),
				$('<p>').text('Empieza bien, desde le principio. Pasa a digital tu formulario personalizado. Este es más que un formulario. Es el principio de algo grande. Un momento mágico en el cual las propuestas pueden empezar a transformar el mundo. Todos pueden apuntarse fácilmente a tu convocatoria directamente en la pagina de tu evento. Pregunta todo lo quieras: lo recibirás ya ordenado y organizado automáticamente.')
			)
		var _callImage = $('<div>').addClass('callImageServicePage');
		_callSection.appendLeft(_callImage);
		_callSection.appendRight(_callText);

		_main.append(
			_initialSection,
			_eventSection.render().addClass('eventSectionServicePage'),
			_callSection.render().addClass('callSectionServicePage'),
			_managerSection.render().addClass('managerSectionServicePage'),
			_programSection.render().addClass('programSectionServicePage'),
			_publishSection.render().addClass('publishSectionServicePage'),
			_publicSection,
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