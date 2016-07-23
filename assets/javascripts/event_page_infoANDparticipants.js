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

    var _title = Pard.Widgets.EventTitle();

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
    _textContainer.append(_baseline, _text)

    _createdWidget.append(_title, _header, _textContainer);

    return{
      render: function(){
        return _createdWidget;
      }
    } 
  }


  ns.Widgets.ParticipantEventPage = function(){

    var _createdWidget = $('<div>');

    var _searchEngine = Pard.Widgets.SearchEngine('main-profile-page');
    
    // var _callProposalsTitle = $('<div>').append($('<h5>').text('Artistas y espacios participantes')).addClass('call-proposals-title');
   
    var _searchEngine = Pard.Widgets.SearchEngine('main-welcome-page', 'a5bc4203-9379-4de0-856a-55e1e5f3fac6').render();

    var _searchTitle = $('<div>').addClass('orfheo-symbol-image-searchEngine');

    _createdWidget.append(_searchTitle, _searchEngine);

    return{
      render: function(){
        console.log(_createdWidget.html());
        return _createdWidget;
      }
    }
  }

}(Pard || {}));