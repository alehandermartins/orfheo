'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};  

  ns.Widgets.EventAside = function (sectionContainer) {

    var _createdWidget = $('<div>').addClass('aside-container');
    
    var _program = $('<div>').addClass('aside-user-nav-btn');
    _program.text('Programa');

    _program.click(function(){
      _contentShowHide('program-event-page');
      $(this).addClass('aside-user-nav-btn-selected');
    });
    var _programContent = $('<div>').attr('id', 'program-event-page').addClass('profiles-user-section-content');
    _programContent.append(Pard.Widgets.ProgramEventPage().render());
    var _contentShown = _programContent;
    _program.addClass('aside-user-nav-btn-selected');

    var _explore = $('<div>').addClass('aside-user-nav-btn');
    _explore.text('Participantes');
    _explore.click(function(){
      _contentShowHide('participants-event-page');
      $(this).addClass('aside-user-nav-btn-selected');
    });
    _explore.one('click', function(){
    _exploreContent.append(Pard.Widgets.ParticipantEventPage().render());      
    });
    var _exploreContent = $('<div>').attr('id', 'participant-event-page').addClass('profiles-user-section-content');
    _exploreContent.hide();

    // var _news = $('<div>').addClass('aside-user-nav-btn');
    // _news.text('Novedades');
    // _news.click(function(){
    //   _contentShowHide('news-user-page');
    //   $(this).addClass('aside-user-nav-btn-selected');
    // });
    // _news.one('click', function(){
    // _newsContent.append(Pard.Widgets.NewsUserPage().render());      
    // });
    // var _newsContent = $('<div>').attr('id', 'news-user-page');
    // _newsContent.hide();


    var _contentShowHide = function(id_selected){
      $('.aside-user-nav-btn-selected').removeClass('aside-user-nav-btn-selected');
      _contentShown.hide();
      // var _selected = '#'+id_selected;
      _contentShown = $('#'+id_selected);
      _contentShown.show();

    }

    var _buttonContainer = $('<div>').addClass('create-profile-container');
    
    _buttonContainer.append(_program, _explore);
    sectionContainer.append(_programContent, _exploreContent);
    _createdWidget.append(_buttonContainer);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ProgramEventPage = function(){
    var _createdWidget = $('<div>');

   

    _createdWidget.append('program');

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ParticipantEventPage = function(){

    var _createdWidget = $('<div>');

     // var _searchEngine = Pard.Widgets.SearchEngine('main-profile-page', profile.calls[0].event_id);
     //  var _callProposalsTitle = $('<div>').append($('<h5>').text('Descubre los participantes')).addClass('call-proposals-title');
     //  _callsBoxContent.append(_callProposalsTitle, _searchEngine.render());
   
    var _searchEngine = Pard.Widgets.SearchEngine('main-welcome-page').render();

    var _searchTitle = $('<div>').addClass('orfheo-symbol-image-searchEngine');

    _createdWidget.append(_searchTitle, _searchEngine);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  // ns.Widgets.NewsUserPage = function(){

  //   var _createdWidget = $('<div>');

  //   var _newsConFusionContainer = Pard.Widgets.ConFusionEndCall('16-06-2016');

  //   var _newsOrfheoContainer = Pard.Widgets.OrfheoFirstMessage('15-06-2016');

  //   _createdWidget.append(_newsConFusionContainer.render(), _newsOrfheoContainer.render());

  //   return{
  //     render: function(){
  //       return _createdWidget;
  //     }
  //   } 
  // }


  ns.Widgets.EventSection = function(content) {

    var _content = content.addClass('user-grid-element-content');
    
    return{
      render: function(){
        return _content;
      }
    }
  }


}(Pard || {}));
