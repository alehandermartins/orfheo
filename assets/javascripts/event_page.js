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

  ns.Widgets.SpaceMarkerProgram = function(host_proposal_id){
    console.log(host_proposal_id);
  }

  ns.Widgets.ProgramEventPage = function(){

    var hosts = [];
    var data = [];
    var performanceData = [];
    
    Pard.CachedProgram.forEach(function(performance, index){
      performanceData.push({
        id: index,
        text: performance.participant_name
      });
      if($.inArray(performance.host_proposal_id, hosts) < 0){
        data.push({
          lat: performance.address.location.lat,
          lon: performance.address.location.lng,
          title: performance.host_name,
          icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + performance.order + '|FE7569|000000',
          html: "<div><b>" + performance.host_name + "</b></div> <button onclick = \" Pard.Widgets.SpaceMarkerProgram('" + performance.host_proposal_id + "');\">Ver programa</button>"
        });
        hosts.push(performance.host_proposal_id);
      }
    });

    var _createdWidget = $('<div>');
    var _searchWidget = $('<select>').attr('id', 'searchEngine');
    _createdWidget.append(_searchWidget);
    
    function formatResource (resource) {
      if(!resource.id) return resource.text;
      var _label = $('<span>').text(resource.text);
      if(resource.type == 'city') var _icon = Pard.Widgets.IconManager('city_artist').render();
      else { var _icon = Pard.Widgets.IconManager(resource.icon).render();}
      _label.append(_icon);
      _icon.css({
        position: 'relative',
        left: '5px',
        top: '5px',
      });
      return _label;
    };

    _searchWidget.select2({
      placeholder: 'Busca por tags',
      ajax: {
        url: '/search/suggest_program',
        type: 'POST',
        dataType: 'json',
        delay: 250,
        data: function (params) {
          var _query = [];
          _searchWidget.select2('data').forEach(function(element){
            _query.push(element.id);
          });
          _query.push(params.term);
          return {
            query: _query,
            page: params.page,
            event_id: 'a5bc4203-9379-4de0-856a-55e1e5f3fac6'
          };
        },
        processResults: function (data, params) {
          params.page = params.page || 1;
          return {
            results: data.items,
            pagination: {
              more: (params.page * 30) < data.total_count
            }
          };
        }
      },
      multiple: true,
      tags: true,
      tokenSeparators: [',', ' '],   
      templateResult: formatResource,
    }).on("select2:select", function(e) {
      if(_searchWidget.select2('data') != false){
        if(e.params.data.isNew){
          $(this).find('[value="'+e.params.data.id+'"]').replaceWith('<option selected value="'+e.params.data.id+'">'+e.params.data.text+'</option>');
        }
      }
    });

    var map = $('<div>').attr('id', 'gmap');
    map.css({'width': '100%', 'height': '250px'});
    
    $(document).ready(function(){
      new Maplace({
        locations: data,
        controls_type: 'list',
        controls_on_map: false,
      }).Load();
    });
    _createdWidget.append(map);

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
