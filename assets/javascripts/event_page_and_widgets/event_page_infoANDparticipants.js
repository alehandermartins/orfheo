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
    img: 'cartel_conFusion_2016_cut_kdyyoj',
    event_id: 'a5bc4203-9379-4de0-856a-55e1e5f3fac6',
    place: 'Benimaclet, Valencia',
    organizer: 'conFusión',
    profile_id: 'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'
  }


  ns.Widgets.EventTitle = function(){
    var _createdWidget = $('<div>').addClass('title-infoTab-event-page-container');

    var _title = $('<h3>').text(Pard.CachedEvent.name).addClass('title-infoTab-event-page');

    // var _line = $('<hr>').css('margin-top','0.75rem');

    return _createdWidget.append(_title);

  }

   ns.Widgets.EventInfo = function(){

    var _eventInfo = Pard.CachedEvent;

    var _createdWidget = $('<div>');

    // var _title = Pard.Widgets.EventTitle();

    var _header = $('<div>');

    var _daysArray = [];
    var _dateEvent = "";
    
    // for (var day in _eventInfo.eventTime){
    //   if (day != 'permanent') {
    //     var _dayDate = new Date(day);
    //     _daysArray.push(_dayDate);
    //     if (_daysArray.length<2){
    //       _dateEvent = _dateEvent+moment(_dayDate).locale('es').format('D');
    //     }
    //     else if (_dayDate.getMonth() == _daysArray[_daysArray.length-2].getMonth()){
    //       _dateEvent = _dateEvent+'-'+moment(_dayDate).locale('es').format('D');
    //     }
    //     else{
    //       _dateEvent = _dateEvent+' '+moment(_daysArray[_daysArray.length-2]).locale('es').format('MMMM YYYY')+'<br> '+moment(_dayDate).locale('es').format('D');
    //     }
    //   }
    // }

    // _dateEvent = _dateEvent+' '+moment(_daysArray[_daysArray.length-2]).locale('es').format('MMMM YYYY');


    // var _whenText = $('<div>').addClass('info-text-header-infoTab-event');
    // var _days = $('<p>').html(_dateEvent);
    // var _time = $('<p>').text('11:00-14:00, 17:00-24:00h').css({'font-size':'14px','margin-top': '0.1rem'});
    
    // _whenText.append(_days);
    // var _whenIcon = $('<div>').append(Pard.Widgets.IconManager('clock').render()).addClass('iconContainer-infoHeader-event-page');
    // var _when = $('<div>').append(_whenIcon, _whenText).addClass('element-headerTitle-infoTab-event');
    // _when.css({'border-right': '1px solid'});
    // _whenText.append(_days);
    
    var _callText = $('<div>').addClass('info-text-header-infoTab-event');
    var _callIcon = $('<div>').append(Pard.Widgets.IconManager('open_call').render().addClass('bullhorn-icon-event-page')).addClass('iconContainer-infoHeader-event-page');
    var _opening = new Date(parseInt(_eventInfo.start));
    var _closing = new Date(parseInt(_eventInfo.deadline));
    var _now = new Date();
    // if(_now.getTime()<_opening.getTime()){
    //   _callText.append($('<p>').html('Apertura convocatoria '+moment(_opening).locale('es').format('dddd DD MMMM')));
    // }
    // else if(_opening.getTime()<_now.getTime()&& _now.getTime()<_closing.getTime()){
    if(true){
      var _callopened = $('<a>').attr({'href':'#'}).text('Convocatoria abierta');

      var _listProfile = function(data){
          if(data['status'] == 'success'){
            var _caller = $('<button>');
            var _popup = Pard.Widgets.PopupCreator(_caller,'Inscribe un perfil ya creado', function(){return Pard.Widgets.ChooseProfileMessage(data.profiles, _eventInfo, _callopened)});
            _caller.trigger('click');
          }
          else{
            Pard.Widgets.Alert('Problema en el servidor', _dataReason).render();
          }
        }
        Pard.Backend.listProfiles(_listProfile);

        _callopened.click(function(){
          Pard.Backend.getCallForms(_eventInfo.call_id, function(data){
          var _content = $('<div>').addClass('very-fast reveal full');
          _content.empty();
          $('body').append(_content);
          console.log(data);
          var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
          var _message = Pard.Widgets.PopupContent(_eventInfo.name, Pard.Widgets.FormManager(data.forms.artist));
          _message.setCallback(function(){
            _content.remove();
            _popup.close();
          });
          _content.append(_message.render());
          _popup.open();
          });
          //Pard.Backend.listProfiles(_listProfile);
        });
      _callText.append($('<p>').append(_callopened,' hasta ',moment(_closing).locale('es').format('dddd DD/MM') ));
    }
    else if(_now.getTime()>_closing.getTime()){
      _callText.append($('<p>').html('Convocatoria cerrada'));
    }
    var _callStatus = $('<div>').append(_callIcon, _callText).addClass('element-headerTitle-infoTab-event');

    var _location = $('<a>').text(_eventInfo.place);
    if (!($.isEmptyObject(_eventInfo.address))){
      var _aStr = _eventInfo['address']['route']+' '+_eventInfo['address']['street_number']+', '+_eventInfo['address']['locality']+' '+_eventInfo['address']['country'];
      _location.attr({
        href: 'http://maps.google.com/maps?q='+_aStr,
        target: '_blank'
      });
    }
    else{
      _location.attr({
        href: 'https://www.google.es/maps/place/'+_eventInfo.place,
        target: '_blank'
      });
    }
    var _whereText = $('<div>').append($('<p>').append(_location)).addClass('info-text-header-infoTab-event');
    var _where = $('<div>').append($('<div>').append(Pard.Widgets.IconManager('location').render()).addClass('iconContainer-infoHeader-event-page'), _whereText).addClass('element-headerTitle-infoTab-event');
    _where.css({'border-right': '1px solid #bebebe'});
    
    var _organizer = $('<a>').append(Pard.Widgets.FitInBox($('<p>').append('Organiza ', _eventInfo.organizer),181,55).render().text().substring(9));
    _organizer.attr({
      href: '/profile?id=' + _eventInfo.profile_id,
      target: '_blank'
    });
    var _whoText = $('<div>').addClass('info-text-header-infoTab-event').append($('<p>').append('Organiza ', _organizer));
    var _who = $('<div>').append($('<div>').append(Pard.Widgets.IconManager('organizer').render()).addClass('iconContainer-infoHeader-event-page'), _whoText).addClass('element-headerTitle-infoTab-event');
    _who.css({'border-right': '1px solid #bebebe'});

    var _h1 = $('<div>').append(_who, _where, _callStatus);
    var _timeContent= $('<div>').addClass('timeContent-infoTab-event')
    var _h2 = $('<div>').addClass('time-container-eventInfo');
    _h2.append($('<div>').append(Pard.Widgets.IconManager('clock').render().addClass('iconContainer-infoHeader-event-page'), _timeContent));

    for (var day in _eventInfo.eventTime){
      _timeContent.append(' ',day);
    }
    
    _header.append(_h1, _h2);

    var _textContainer = $('<div>').addClass('textContainer-infoTab-event-page');
    var _baseline = $('<p>').text(_eventInfo.baseline).addClass('baseline-infoTab-event-page');
    var _textTitle = $('<h4>').text('Características básicas:').addClass('title-program-event-page');
    var _text = $('<div>').append(
      $('<p>').text('El Benimaclet conFusión festivales un acto de unión. Pretende romper con el concepto de público-privado, crear lugares donde compartir con desconocidos y acercarnos entre todos y todas.'),
      $('<p>').text('Cualquiera, a través de una  convocatoria gestionada previamente, puede ofrecer algo propio durante el festival: puede ser su arte, sus conocimientos, su tiempo o también un espacio propio.'),
      $('<p>').text(' Este evento no tiene nigún animo de lucro, es gratuito para todo el publico y se ha organizado gracias a la colaboració de mucha gente. Quiere ser la demostración de que si cada uno comparte lo que tiene y siente, todo empieza a ser posible.'),
      $('<p>').text('Te invitamos a disfrutar, estar, fluir y sentir, sin olvidar, en nigún momento, que no puedes verlo todo.')).addClass('text-event-page-info');
    var _image = $('<div>').append($.cloudinary.image(_eventInfo.img,{ format: 'png', width: 330,  effect: 'saturation:50' }).addClass('img-event-info-p')).addClass('image-evet-page-info');
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


  ns.Widgets.getCallForms = function(eventInfo){
    Pard.Backend.getCallForms(eventInfo.call_id, function(data){
    var _content = $('<div>').addClass('very-fast reveal full');
    _content.empty();
    $('body').append(_content);
    console.log(data);
    var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
    var _message = Pard.Widgets.PopupContent(eventInfo.name, Pard.Widgets.FormManager(data.forms.artist));
    _message.setCallback(function(){
      _content.remove();
      _popup.close();
    });
    _content.append(_message.render());
    _popup.open();
    });
  };


  // ns.Widgets.EventInfoConFusion = function(){
  // 	var _createdWidget = $('<div>');

  //   // var _title = Pard.Widgets.EventTitle();

  //   var _eventInfo = Pard.ConfusionInfo;

  //   var _header = $('<div>').addClass('header-container-infoTab-event');

  //   var _whenText = $('<div>').addClass('info-text-header-infoTab-event');
  //   var _daysArray = [];
  //   var _dateEvent = "";

  //   var _days = $('<p>').html('15-16 Octubre 2016')
  //   var _time = $('<p>').text('11:00-14:00, 17:00-24:00h').css({'font-size':'14px','margin-top': '0.1rem'});
  //   _whenText.append(_days,_time);
  //   var _whenIcon = $('<div>').append(Pard.Widgets.IconManager('clock').render()).addClass('iconContainer-infoHeader-event-page');
  //   var _when = $('<div>').append(_whenIcon, _whenText).addClass('element-headerTitle-infoTab-event');
  //   _when.css({'border-right': '1px solid'});
  //   var _location = $('<a>').text(_eventInfo.place).attr({
  //     href: 'https://www.google.es/maps/place/Benimaclet,+Valencia/@39.4862947,-0.373891,14z/data=!3m1!4b1!4m5!3m4!1s0xd6048a769bd2a51:0x868cb4bea88b8f9f!8m2!3d39.4871955!4d-0.3548312',
  //     target: '_blank'
  //   });
  //   var _whereText = $('<div>').append($('<p>').append(_location)).addClass('info-text-header-infoTab-event');
  //   var _where = $('<div>').append($('<div>').append(Pard.Widgets.IconManager('location').render()).addClass('iconContainer-infoHeader-event-page'), _whereText).addClass('element-headerTitle-infoTab-event');
  //   _where.css({'border-right': '1px solid'});
    
  //   var _organizer = $('<a>').text(_eventInfo.organizer).attr({
  //     href: '/profile?id=' + _eventInfo.profile_id,
  //     target: '_blank'
  //   });
  //   var _whoText = $('<div>').append($('<p>').append('Organiza ', _organizer)).addClass('info-text-header-infoTab-event');
  //   var _who = $('<div>').append($('<div>').append(Pard.Widgets.IconManager('organizer').render()).addClass('iconContainer-infoHeader-event-page'), _whoText).addClass('element-headerTitle-infoTab-event');
    
  //   _header.append(_when, _where, _who)

  //   var _textContainer = $('<div>').addClass('textContainer-infoTab-event-page');
  //   var _baseline = $('<p>').text(_eventInfo.baseline).addClass('baseline-infoTab-event-page');
  //   var _textTitle = $('<h4>').text('Características básicas:').addClass('title-program-event-page');
  //   var _text = $('<div>').append(
  //     $('<p>').text('El Benimaclet conFusión festivales un acto de unión. Pretende romper con el concepto de público-privado, crear lugares donde compartir con desconocidos y acercarnos entre todos y todas.'),
  //     $('<p>').text('Cualquiera, a través de una  convocatoria gestionada previamente, puede ofrecer algo propio durante el festival: puede ser su arte, sus conocimientos, su tiempo o también un espacio propio.'),
  //     $('<p>').text(' Este evento no tiene nigún animo de lucro, es gratuito para todo el publico y se ha organizado gracias a la colaboració de mucha gente. Quiere ser la demostración de que si cada uno comparte lo que tiene y siente, todo empieza a ser posible.'),
  //     $('<p>').text('Te invitamos a disfrutar, estar, fluir y sentir, sin olvidar, en nigún momento, que no puedes verlo todo.')).addClass('text-event-page-info');
  //   var _image = $('<div>').append($.cloudinary.image(_eventInfo.img,{ format: 'png', width: 330,  effect: 'saturation:50' }).addClass('img-event-info-p')).addClass('image-evet-page-info');
  //     if ($(window).width() < 640) {
  //       var _infoContent = $('<div>').append(_text.prepend(_textTitle), _image);
  //     }
  //     else{
  //       var _infoContent = $('<div>').append( _image, _text.prepend(_textTitle));
  //     }
  //   _textContainer.append(_baseline, _infoContent);

  //   var _crowdfundingContainer = $('<div>').addClass('colaborators-container-info-event-page');
  //   var _crowdfunding = $('<span>').html('<iframe frameborder="0" height="480px" src="//www.goteo.org/widget/project/benimaclet-confusion-festival" width="250px" scrolling="no"></iframe>').addClass('crowdfunding-widget-infoTab-event');
  //   var _crowdtitle = $('<h4>').text('Financiación:').addClass('title-program-event-page');
  //   var _crowdText = $('<div>').append($('<p>').text('La organización de un festival de este tipo requiere mucho tiempo y muchos esfuerzos. Lo hacemos prácticamente sin dinero, trabajando como voluntarios 10 meses al año y intentando a reducir los gastos lo más posible. Sin embargo, hay varios que no podemos evitar y que tenemos que cubrir.'),
  //     $('<p>').text('Sin embargo, hemos decidido crear un evento gratuito sin escoger el camino fácil de encontrar un patrocinador comercial. El conFusión es un proyecto participativo, hecho por y para las personas, basado en el aportar lo que cada uno puede. Es por eso que preferimos financiarnos a través de un crowdfunding y dejar a cada quien decir como colaborar.'));
  //   if ($(window).width() < 640) {
  //     _crowdfundingContainer.append(_crowdtitle, _crowdText, $('<div>').append(_crowdfunding).css({'width':'100%', 'position':'relative', 'height':'480px'}));
  //   }
  //   else{
  //     _crowdfundingContainer.append(_crowdfunding, _crowdtitle, _crowdText);
  //   }
  //   // var _sponsor = $('<div>');
   
  //   _createdWidget.append(_header, _textContainer, _crowdfundingContainer);

  //   return{
  //     render: function(){
  //       return _createdWidget;
  //     }
  //   } 
  // }

  ns.Widgets.PartnerTab = function(partnersArray){
    var _partnerTab = $('<div>').css('margin-top','2.5rem');
    // var _collaboratorsTitle = $('<h4>').text('Colabora:').addClass('title-program-event-page');
    
    partnersArray.forEach(function(partner){
      _partnerTab.append(Pard.Widgets.PartnerCard(partner));
    });

    return _partnerTab;

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
      _logo.css('cursor','default');
    }
    _partnerCard.append(_image, _name);
    return _partnerCard;
  }


  ns.Widgets.ParticipantEventPage = function(event_id){

    var _createdWidget = $('<div>');
    var _searchEngine = Pard.Widgets.SearchEngine('main-welcome-page', event_id);
    // 'a5bc4203-9379-4de0-856a-55e1e5f3fac6'
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