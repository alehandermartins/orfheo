'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};  

  ns.ConfusionInfo =  {
    name: 'Benimaclet conFusión festival III ed.',
    baseline: 'Festival libre de expresión gratuita',
    eventTime: {
      "2016-10-15": [
          [
              "1476518400000",
              "1476532800000"
          ],
          [
              "1476543600000",
              "1476568800000"
          ]
      ],
      "2016-10-16": [
          [
              "1476604800000",
              "1476705600000"
          ],
          [
              "1476630000000",
              "1476655200000"
          ]
      ],
      "permanent": [
          "11:00",
          "21:00"
      ],
    }, 
    main_img: 'cartel_conFusion_2016_cut_kdyyoj',
    event_id: 'a5bc4203-9379-4de0-856a-55e1e5f3fac6',
    place: 'Benimaclet, Valencia',
    organizer: 'conFusión',
    organizer_id: 'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'
  }


  ns.Widgets.EventTitle = function(){
    var _createdWidget = $('<div>');

    var _title = $('<h3>').text(Pard.ConfusionInfo.name).addClass('title-infoTab-event-page');

    var _line = $('<hr>').css('margin-top','0.75rem');

    return _createdWidget.append(_title, _line);

  }

  ns.Widgets.EventInfo = function(){
  	var _createdWidget = $('<div>');

    // var _title = Pard.Widgets.EventTitle();

    var _header = $('<div>').addClass('header-container-infoTab-event');

    var _whenText = $('<div>').addClass('info-text-header-infoTab-event');
    var _days = $('<p>').html('15-16 Octubre 2016')
    var _time = $('<p>').text('11:00-14:00, 17:00-24:00h').css({'font-size':'14px','margin-top': '0.1rem'});
    _whenText.append(_days,_time);
    var _whenIcon = $('<div>').append(Pard.Widgets.IconManager('clock').render()).addClass('iconContainer-infoHeader-event-page');
    var _when = $('<div>').append(_whenIcon, _whenText).addClass('element-headerTitle-infoTab-event');
    _when.css({'border-right': '1px solid'});
    var _location = $('<a>').text(Pard.ConfusionInfo.place).attr({
      href: 'https://www.google.es/maps/place/Benimaclet,+Valencia/@39.4862947,-0.373891,14z/data=!3m1!4b1!4m5!3m4!1s0xd6048a769bd2a51:0x868cb4bea88b8f9f!8m2!3d39.4871955!4d-0.3548312',
      target: '_blank'
    });
    var _whereText = $('<div>').append($('<p>').append(_location)).addClass('info-text-header-infoTab-event');
    var _where = $('<div>').append($('<div>').append(Pard.Widgets.IconManager('location').render()).addClass('iconContainer-infoHeader-event-page'), _whereText).addClass('element-headerTitle-infoTab-event');
    _where.css({'border-right': '1px solid'});
    
    var _organizer = $('<a>').text(Pard.ConfusionInfo.organizer).attr({
      href: '/profile?id=' + Pard.ConfusionInfo.organizer_id,
      target: '_blank'
    });
    var _whoText = $('<div>').append($('<p>').append('Organiza ', _organizer)).addClass('info-text-header-infoTab-event');
    var _who = $('<div>').append($('<div>').append(Pard.Widgets.IconManager('organizer').render()).addClass('iconContainer-infoHeader-event-page'), _whoText).addClass('element-headerTitle-infoTab-event');
    
    _header.append(_when, _where, _who)

    var _textContainer = $('<div>').addClass('textContainer-infoTab-event-page');
    var _baseline = $('<p>').text(Pard.ConfusionInfo.baseline).addClass('baseline-infoTab-event-page');
    var _textTitle = $('<h4>').text('Características básicas:').addClass('title-program-event-page');
    var _text = $('<div>').append(
      $('<p>').text('El Benimaclet conFusión festivales un acto de unión. Pretende romper con el concepto de público-privado, crear lugares donde compartir con desconocidos y acercarnos entre todos y todas.'),
      $('<p>').text('Cualquiera, a través de una  convocatoria gestionada previamente, puede ofrecer algo propio durante el festival: puede ser su arte, sus conocimientos, su tiempo o también un espacio propio.'),
      $('<p>').text(' Este evento no tiene nigún animo de lucro, es gratuito para todo el publico y se ha organizado gracias a la colaboració de mucha gente. Quiere ser la demostración de que si cada uno comparte lo que tiene y siente, todo empieza a ser posible.'),
      $('<p>').text('Te invitamos a disfrutar, estar, fluir y sentir, sin olvidar, en nigún momento, que no puedes verlo todo.')).addClass('text-event-page-info');
    var _image = $('<div>').append($.cloudinary.image(Pard.ConfusionInfo.main_img,{ format: 'png', width: 330,  effect: 'saturation:50' }).addClass('img-event-info-p')).addClass('image-evet-page-info');
      if ($(window).width() < 640) {
        var _infoContent = $('<div>').append(_text.prepend(_textTitle), _image);
      }
      else{
        var _infoContent = $('<div>').append( _image, _text.prepend(_textTitle));
      }
    _textContainer.append(_baseline, _infoContent);

    var _crowdfundingContainer = $('<div>').addClass('colaborators-container-info-event-page');
    var _crowdfunding = $('<span>').html('<iframe frameborder="0" height="480px" src="//www.goteo.org/widget/project/benimaclet-confusion-festival" width="250px" scrolling="no"></iframe>').addClass('crowdfunding-widget-infoTab-event');
    var _crowdtitle = $('<h4>').text('Financiación:').addClass('title-program-event-page');
    var _crowdText = $('<div>').append($('<p>').text('La organización de un festival de este tipo requiere mucho tiempo y muchos esfuerzos. Lo hacemos prácticamente sin dinero, trabajando como voluntarios 10 meses al año y intentando a reducir los gastos lo más posible. Sin embargo, hay varios que no podemos evitar y que tenemos que cubrir.'),
      $('<p>').text('Sin embargo, hemos decidido crear un evento gratuito sin escoger el camino fácil de encontrar un patrocinador comercial. El conFusión es un proyecto participativo, hecho por y para las personas, basado en el aportar lo que cada uno puede. Es por eso que preferimos financiarnos a través de un crowdfunding y dejar a cada quien decir como colaborar.'));
    if ($(window).width() < 640) {
      _crowdfundingContainer.append(_crowdtitle, _crowdText, $('<div>').append(_crowdfunding).css({'width':'100%', 'position':'relative', 'height':'480px'}));
    }
    else{
      _crowdfundingContainer.append(_crowdfunding, _crowdtitle, _crowdText);
    }
    // var _sponsor = $('<div>');
   
    _createdWidget.append(_header, _textContainer, _crowdfundingContainer);

    return{
      render: function(){
        return _createdWidget;
      }
    } 
  }

  ns.Widgets.PartnerTab = function(){
    var _collaborators = $('<div>').css('margin-top','2.5rem');
    // var _collaboratorsTitle = $('<h4>').text('Colabora:').addClass('title-program-event-page');
    // _collaborators.append(_collaboratorsTitle);
    var _collaboratorsArray = [
    {
      name: 'Caixa Fosca',
      link: 'http://www.caixafosca.com/',
      img: 'caixa_fosca_logo_ww7haj'
    },
    {
      name: 'Carlos Antón Varó',
      link: 'http://www.caranva.com/',
      img: 'logo-caverde_mqzpkq'
    },
    {
      name: 'Benimaclet Entra',
      link: 'http://benimacletentra.org/',
      img: 'BE_bouuxi'
    },
    {
      name: 'Associació de Veïns i Veïnes de Benimaclet',
      link: 'https://avvbenimaclet.wordpress.com/',
      img: 'Asociacion_vecinos_squareLogo_vqxp2t'
    },
    {
      name: '4b',
      link: 'https://www.facebook.com/benimaclet4b/?fref=ts',
      img: 'logo_4b_f57juv'
    },
    {
      name: 'Al Berro Producciones',
      link: 'http://www.alberroproducciones.com/',
      img: 'Logo_AlBerroProducciones_seqhyq'
    },
    {
      name: 'Goatxa',
      link: 'http://www.goatxa.es/',
      img: 'Goatxa_logo_d3fnyt'
    },
    {
      name: 'Coprint',
      link: 'http://coprint.com/',
      img: 'coprint_zst4xw'
    },
    {
      name: 'Chernoville',
      link: 'https://www.facebook.com/ChernovilleStudios/?hc_ref=SEARCH&fref=nf',
      img: 'LOGO_Chernoville_gonlbe'
    },
    {
      name: 'Laboratorio de Fabricación',
      link: 'http://laboratoriodefabricacion.com/',
      img: 'laboratorio_de_fabricacion_oxx5cp'
    },
    {
      name: 'La Cova',
      link: 'https://www.facebook.com/lacuevadebenimaclet/?fref=ts',
      img: 'logo-la-cueva_txluc0'
    },
    {
      name: 'Talk! English Association',
      link: 'http://talkasocia.wixsite.com/valencia',
      img: 'logo_talk_qbvdoe'
    },
    {
      name: 'Escuela Meme',
      link: 'https://www.facebook.com/escuelameme.benimaclet/?fref=ts',
      img: 'logo-meme_xap33x'
    },
    {
      name: 'La Tapadera',
      link: 'http://www.espaciolatapadera.es/',
      img: 'Logo_tapadera_ffx0jb'
    },
    {
      name: 'Asociación de Imagen Experimental',
      link: '',
      img: 'logo_AIE_zw3srs'
    },
    {
      name: 'PICUV',
      link: 'https://www.facebook.com/picuv/?fref=ts',
      img: 'Logo_PICUV_qptegh'
    }
    ];
    _collaboratorsArray.forEach(function(collaborator){
      _collaborators.append(Pard.Widgets.PartnerCard(collaborator));
    });

    return _collaborators;

  }

  ns.Widgets.PartnerCard = function(partner){
    var _partnerCard = $('<div>').addClass('partnerCard-event-page');
    var _image = $('<div>').addClass('partnerImage-event-page');
    var _logo = $('<a>').append($.cloudinary.image(partner.img,{ format: 'png', width: 170 , effect: 'saturation:50' }));
    _image.append(_logo);
    if (partner.link) {
      var _name = $('<div>').append($('<p>').append($('<a>').text(partner.name).attr({'href': partner.link, 'target':'_blank'})).addClass('partnerName-event-page'));
      _logo.attr({'href': partner.link, 'target':'_blank'});
    }
    else {
      var _name = $('<div>').append($('<p>').text(partner.name).addClass('partnerName-event-page'));
      _logo.attr({'href': '#', 'target':'_blank'}).css('cursor','default');
    }
    _partnerCard.append(_image, _name);
    return _partnerCard;
  }


  ns.Widgets.ParticipantEventPage = function(){

    var _createdWidget = $('<div>');
    var _searchEngine = Pard.Widgets.SearchEngine('main-welcome-page', 'a5bc4203-9379-4de0-856a-55e1e5f3fac6');
    _createdWidget.append( _searchEngine.render());

    return{
      render: function(){
        return _createdWidget;
      },
      activate: function(){
        _searchEngine.activate();
      },
      deactivate: function(){
        _searchEngine.deactivate();
      }
    }
  }



 
}(Pard || {}));