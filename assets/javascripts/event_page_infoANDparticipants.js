'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};  

  ns.Widgets.EventInfo = function(){
  	var _createdWidget = $('<div>');

    var _title = $('<h4>').text('Benimaclet conFusión festival III');

    var _text = $('<p>').text('Bla bla bla...');
   
    _createdWidget.append(_title, _text);

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
   
    var _searchEngine = Pard.Widgets.SearchEngine('main-welcome-page').render();

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