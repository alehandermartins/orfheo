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
		// var _videoSection = $('<section>').addClass('serviceSection videoSectionServicePage');
		var _priceSection = $('<section>').addClass('serviceSection priceSectionServicePage');
		var _finalSection = $('<section>').addClass('finalSectionServicePage');

		var _videoIframe = $('<div>')
			.addClass('video-container')
			.append(
				$('<iframe>')
					.attr({
						'src':'https://www.youtube.com/embed/cdOdDsXSBRw?rel=0&amp;showinfo=0;&autoplay=1',
						'frameborder':'0',
						'allowfullscreen':''
					})
					.css({
						'width':'inherit',
						'height':'inherit'
					})
				)

		var _popupVideoContainer = $('<div>').addClass('very-fast reveal full');
    var _outerContainer = $('<div>').addClass('vcenter-outer');
    var _container = $('<div>').addClass('vcenter-inner');
    var _popupContent = $('<div>')
   	.addClass('video-popup-container'); 

    var _videoPopup = new Foundation.Reveal(_popupVideoContainer, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out',multipleOpened:true});

    var _closeBtn = $('<button>')
	   	.addClass('close-button small-1 close-video-popup')
	   	.attr({'data-close': '', type: 'button', 'aria-label': 'Close alert'})
	   	.append($('<span>').attr('aria-hidden', true).html('&times;'))
	    .click(function(){
	      _videoPopup.close();
	      _videoIframe.remove();
	    });
    
    $(document).keyup(function(e) {
	  	if (e.keyCode === 27) _closeBtn.click();   // esc
		});

    _outerContainer.append(_container.append(_popupContent, _closeBtn));
    _popupVideoContainer.append(_outerContainer);
    $('body').append(_popupVideoContainer);
			
			var _contactBtn = $('<button>')
			.attr('type','button')
			.text(Pard.t.text('services.contact'))
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
			var _video = $('<div>')
				.append(
					// $('<p>').html(' ​Lanza en orfheo la convocatoria artístico-cultural de tu evento <br>y gestiona todos tus datos con una nueva y potente herramienta. <br>'),
					$('<button>')
						.append(
							$('<span>').text('Mira el vídeo demo').css('margin-right','.5rem'),
							Pard.Widgets.IconManager('play_circle').render()
						)
						.addClass('abutton')
						.attr({
							'type':'button'
						})
				)
				.addClass('video-service-page')
				.click(function(){
     			_popupContent.append(_videoIframe);
					_videoPopup.open(); 	
				});
				var _offerPrice = $('<span>').text('14,90 €/mes').addClass('price-initialSectionServicePage');
				var _price = $('<p>').append('Precio: <del style="font-size:14px; margin:0 .1rem 0 1rem"> 59,90 €/mes </del>',_offerPrice).css({'margin':'1rem 0 2rem 0'});
				var _iTitle = $('<h3>')
					.text('Event Manager')
					.css({
						'font-weight':'bold'
					})

				var _scrollDownBtn = $('<div>').append($('<a>').append($('<span>'))).addClass('scrollDown-arrow');

				_initialSection
				.addClass('initialSectionServicePage')
				.append(
					$('<div>')
						.addClass('pard-grid isContainer')
						.append(
								$('<div>').append(Pard.Widgets.IconManager('tools').render()).addClass('call-icon-service-page'),
								_iTitle,
								$('<p>').html('Lanza en orfheo la convocatoria artístico-cultural de tu evento <br>y gestiona todos tus datos con una nueva y potente herramienta.'),
								_price,
								_video,
								_contactBtn,
								_scrollDownBtn
							)
						.css({
							'text-align':'center'
						})					
				);
		
	
		// var _ibackground = $('<div>').addClass('background-initialSection');
		
		// var _iText = $('<div>')
		// 	.addClass('text-initialSection')
		// 	.append(
		// 		$('<h3>').text('Together is better'),
		// 		// $('<p>').html('Une a las personas, crea en red con tu comunidad cultural y conéctate con otras.<br> ​Lanza en orfheo la convocatoria artístico-cultural de tu evento.<br> Gestiona con una potente herramienta todos los datos, nunca ha sido igual.'),
		// 		$('<p>').html(Pard.t.text('services.mex'))
		// 		// _contactBtn
		// 	);
		// _ibackground.append(_iText);
		

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

		var _eTitle = Pard.t.text('services.section1.title');
		var _eText = Pard.t.text('services.section1.mex');
		var _eventImage = $('<div>').addClass('eventImageServicePage');
		_eventSection.appendLeft(serviceText(1, _eTitle, _eText));
		_eventSection.appendRight(_eventImage);

		var _cTitle =  Pard.t.text('services.section2.title');
		var _cText = Pard.t.text('services.section2.mex');
		var _callImage = $('<div>').addClass('callImageServicePage');
		if($(window).width()<1024){
			_callSection.appendRight(_callImage);
			_callSection.appendLeft(serviceText(2, _cTitle, _cText));
		} 
		else{
			_callSection.appendLeft(_callImage);
			_callSection.appendRight(serviceText(2, _cTitle, _cText));
		}

		var _mTitle = Pard.t.text('services.section3.title');
		var _mText = Pard.t.text('services.section3.mex');
		// var _mText = 'Todo ya esta organizado y ordenado automáticamente. Gestiona las propuestas recibidas de tu evento y contacta las personas. Visualiza, filtra y explora de forma facil y rápida. Navega entre los perfiles y selecciona los participantes. Exporta listados y haz lo que te haga falta en tan solo un click. Toda la potencia de tus informaciones. Aprovecha a lo mejor tu tiempo, todo es mas sencillo, todo bajo control.'
		var _mImage = $('<div>').addClass('managerImageServicePage');
		_managerSection.appendRight(_mImage);
		_managerSection.appendLeft(serviceText(3, _mTitle, _mText));



		var _pTitle = Pard.t.text('services.section4.title');
		var _pText = Pard.t.text('services.section4.mex');
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

		var _pshTitle = Pard.t.text('services.section5.title');
		var _pshText = Pard.t.text('services.section5.mex')
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
		var _mobileTitle = Pard.t.text('services.section6.title');
		var _mobileText = Pard.t.text('services.section6.mex');
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
		var _oLTitle = $('<h3>').html(Pard.t.text('services.api.title'));
		var _oLText = $('<p>').html(Pard.t.text('services.api.mex'));
		var _oLeft = $('<div>').append(_oLSign, _oLTitle, _oLText).addClass('otherTextContainer');
		_otherSection.appendLeft(_oLeft);
		var _oRSign = $('<h3>').html('+').addClass('sign');
		var _oRTitle = $('<h3>').html(Pard.t.text('services.counseling.title'));
		var _oRText = $('<p>').html(Pard.t.text('services.counseling.mex'));
		var _oRight = $('<div>').append(_oRSign, _oRTitle, _oRText).addClass('otherTextContainer');
		_otherSection.appendRight(_oRight);


		var _contactPriceBtn = $('<button>')
			.attr('type','button')
			.text(Pard.t.text('services.contact'))
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
				$('<h3>').text(Pard.t.text('services.price.title')),
				$('<p>').html(Pard.t.text('services.price.mex')),
				// $('<h4>')
				// 	.append(
				// 	"A partir de 29 €",
				// 	$('<span>').text(' /mes').addClass('month'))
				// 	.addClass('pricingText'),
				_contactPriceBtn
			);
		_priceSection
			.append(
				$('<div>').addClass('pard-grid')
					.append(_priceText)
			);

		var _finalSectionBack = $('<div>').addClass('finalSectionBackground');
		var _finalText = $('<p>').text(Pard.t.text('services.endMex')).addClass('finalText')
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