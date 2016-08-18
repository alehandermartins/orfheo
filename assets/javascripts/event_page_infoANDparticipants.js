'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};  

  ns.Widgets.EventTitle = function(){
    var _createdWidget = $('<div>');

    var _title = $('<h3>').text('Benimaclet conFusión festival III ed.').addClass('title-infoTab-event-page');

    var _line = $('<hr>').css('margin-top','0.75rem');

    return _createdWidget.append(_title, _line);

  }

  ns.Widgets.EventInfo = function(){
  	var _createdWidget = $('<div>');

    // var _title = Pard.Widgets.EventTitle();

    var _header = $('<div>').addClass('header-container-infoTab-event');

    var _whenText = $('<p>').text('15-16 Octubre 2016').addClass('info-text-header-infoTab-event');
    var _when = $('<div>').append(Pard.Widgets.IconManager('clock').render(), _whenText).addClass('element-headerTitle-infoTab-event');
    _when.css({'border-right': '1px solid'});

    var _location = $('<a>').text('Benimaclet, Valencia').attr({
      href: 'https://www.google.es/maps/place/Benimaclet,+Valencia/@39.4862947,-0.373891,14z/data=!3m1!4b1!4m5!3m4!1s0xd6048a769bd2a51:0x868cb4bea88b8f9f!8m2!3d39.4871955!4d-0.3548312',
      target: '_blank'
    });
    var _whereText = $('<p>').append(_location).addClass('info-text-header-infoTab-event');
    var _where = $('<div>').append(Pard.Widgets.IconManager('location').render(), _whereText).addClass('element-headerTitle-infoTab-event');
    _where.css({'border-right': '1px solid'});
    
    var _organizer = $('<a>').text('conFusión').attr({
      href: '/profile?id=' + 'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83',
      target: '_blank'
    });
    var _whoText = $('<p>').append('Organiza ', _organizer).addClass('info-text-header-infoTab-event');
    var _who = $('<div>').append(Pard.Widgets.IconManager('organizer').render(), _whoText).addClass('element-headerTitle-infoTab-event');
    
    _header.append(_when, _where, _who)

    var _textContainer = $('<div>').addClass('textContainer-infoTab-event-page');
    var _baseline = $('<p>').text('Festival gratuito de expresión libre').addClass('baseline-infoTab-event-page');
    var _text = $('<p>').text('Bla bla bla...');
    _textContainer.append(_baseline, _text);

    var _partnersContainer = $('<div>');
    // var _sponsor = $('<div>');
    var _collaborators = $('<div>');
    var _collaboratorsTitle = $('<h4>').text('Colabora:').addClass('title-program-event-page');
    _collaborators.append(_collaboratorsTitle);
    var _collaboratorsArray = [
    {
      name: 'Caixa Fosca',
      link: 'http://www.caixafosca.com/',
      img: 'caixa_fosca_logo_ww7haj'
    },
    {
      name: 'Carlos Antón Varón',
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
    ];
    _collaboratorsArray.forEach(function(collaborator){
      _collaborators.append(Pard.Widgets.PartnerCard(collaborator));
    });

    _partnersContainer.append(_collaborators);
    _createdWidget.append(_header, _textContainer, _partnersContainer);

    return{
      render: function(){
        return _createdWidget;
      }
    } 
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