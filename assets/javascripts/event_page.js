'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};  

  ns.Widgets.EventAside = function (sectionContainer) {

    var _createdWidget = $('<div>').addClass('aside-container').css('background', 'white');
    
    var _program = $('<div>').addClass('aside-event-nav-btn');
    _program.text('Programa');

    _program.click(function(){
      _contentShowHide('program-event-page');
      $(this).addClass('aside-event-nav-btn-selected');
    });
    var _programContent = $('<div>').attr('id', 'program-event-page');
    _programContent.append(Pard.Widgets.ProgramEventPage().render());
    var _contentShown = _programContent;
    _program.addClass('aside-event-nav-btn-selected');

    var _explore = $('<div>').addClass('aside-event-nav-btn');
    _explore.text('Participantes');
    _explore.click(function(){
      _contentShowHide('participants-event-page');
      $(this).addClass('aside-event-nav-btn-selected');
    });
    _explore.one('click', function(){
    _exploreContent.append(Pard.Widgets.ParticipantEventPage().render());      
    });
    var _exploreContent = $('<div>').attr('id', 'participants-event-page');
    _exploreContent.hide();

    var _info = $('<div>').addClass('aside-event-nav-btn');
    _info.text('Informaciones');
    _info.click(function(){
      _contentShowHide('info-event-page');
      $(this).addClass('aside-event-nav-btn-selected');
    });
    _info.one('click', function(){
    _infoContent.append(Pard.Widgets.EventInfo().render());      
    });
    var _infoContent = $('<div>').attr('id', 'info-event-page');
    _infoContent.hide();


    var _contentShowHide = function(id_selected){
      $('.aside-event-nav-btn-selected').removeClass('aside-event-nav-btn-selected');
      _contentShown.hide();
      // var _selected = '#'+id_selected;
      _contentShown = $('#'+id_selected);
      _contentShown.show();

    }

    var _buttonContainer = $('<div>').addClass('create-profile-container');
    
    var _title = Pard.Widgets.EventTitle();

    _buttonContainer.append( _program, _explore, _info);
    sectionContainer.append(_title, _programContent, _exploreContent, _infoContent).addClass('profiles-user-section-content');
    _createdWidget.append(_buttonContainer);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.ProgramInfo = {};

  ns.Widgets.SpaceMarkerProgram = function(host_name){
    Pard.Backend.searchProgram([host_name], 'a5bc4203-9379-4de0-856a-55e1e5f3fac6', function(data){
      Pard.ProgramInfo.program = data.program;
      Pard.PrintProgram();
    });
  }

  ns.PrintProgram = function(){
    var _program = Pard.ProgramInfo.program;
    var _date = Pard.ProgramInfo.date || '2016-10-15';
    var _searchResult = $('#searchResult');

    _searchResult.empty();
    var _dateBox = $('<div>');
    var _dateLabel = $('<h4>').text(moment(_date).format('DD-MM-YYYY'));
    _dateBox.append(_dateLabel);
    _searchResult.append(_dateBox);
    _program[_date].forEach(function(performance){
      var _performanceBox = $('<div>');
      var _time = moment(performance.time[0], 'x').format('HH:mm') + ' - ' + moment(performance.time[1], 'x').format('HH:mm');
      var _title = performance.title;
      _performanceBox.append(_time, _title);
      _searchResult.append(_performanceBox);
    });

    if(_program[_date].length == 0) {
      var _message = $('<h6>').text('Ningún resultado para esta fecha').css('color','#6f6f6f');
      _searchResult.append(_message);
    }
  }

  ns.Widgets.ProgramEventPage = function(){

    var hosts = [];
    var _data = [];
    var _searchResult = $('<div>').attr('id', 'searchResult');

    Pard.CachedProgram.forEach(function(performance, index){
      if($.inArray(performance.host_proposal_id, hosts) < 0){
        _data.push({
          lat: performance.address.location.lat,
          lon: performance.address.location.lng,
          title: performance.host_name,
          icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + performance.order + '|FE7569|000000',
          html: "<div><b>" + performance.host_name + "</b></div> <button id= 'markerButton'>Ver programa</button>"
        });
        hosts.push(performance.host_proposal_id);
      }
    });

    var _createdWidget = $('<div>');
    var _searchWidget = $('<select>').attr('id', 'searchEngine');

    var _daySelectorContainer = $('<div>').css('width', 150);
    var _daySelector = $('<select>');

    ['2016-10-15', '2016-10-16'].forEach(function(day){
      var date = $('<option>').val(day).text(moment(day).format('DD-MM-YYYY'));
      _daySelector.append(date);
    });

    _daySelectorContainer.append(_daySelector);
    
    _createdWidget.append(_searchWidget, _daySelectorContainer);
    _daySelector.select2({
      minimumResultsForSearch: Infinity,
      allowClear:false,
      templateResult: formatResource
    });

    _daySelector.on('change', function(){
      Pard.ProgramInfo.date = _daySelector.val();
      Pard.PrintProgram();
    });

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

    var _searchCallback = function(spinnerStop){
      tags = [];

      var _dataArray = _searchWidget.select2('data'); 
      _dataArray.forEach(function(tag){
        tags.push(tag.text);
      });
      Pard.Backend.searchProgram(tags, 'a5bc4203-9379-4de0-856a-55e1e5f3fac6', function(data){
        Pard.ProgramInfo.program = data.program;
        Pard.PrintProgram();
      });
      spinnerStop();
    }

    _searchWidget.on('change', function(){
      var spinner =  new Spinner().spin();
      $.wait(
        '', 
        function(){
          _searchResult.empty();  
          _searchResult.append(spinner.el); 
        }, 
        function(){
          _searchCallback(function(){spinner.stop()});
        }
      )
    });

    var map = $('<div>').attr('id', 'gmap');
    map.css({'width': '100%', 'height': '250px'});
    
    $(document).ready(function(){
      var gmap = new Maplace({
        locations: _data,
        controls_type: 'list',
        controls_on_map: false,
        afterOpenInfowindow: function(index, marker, location){
          setTimeout(function(){
            $('#markerButton').on('click', function(){
              console.log(_data[index].title);
            });
          }, 50);
        }
      }).Load();
    });

    
    _createdWidget.append(map, _searchResult);
    _searchWidget.trigger('change');

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }



  ns.Widgets.EventSection = function(content) {

    var _content = content.addClass('user-grid-element-content');
    
    return{
      render: function(){
        return _content;
      }
    }
  }


}(Pard || {}));
