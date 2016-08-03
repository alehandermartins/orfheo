'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};  

  ns.Widgets.EventAside = function (sectionContainer) {

    var _createdWidget = $('<div>').addClass('aside-container event-page-aside');

    Pard.Widgets.Sticker(_createdWidget, 83, 24)
    
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
      $('.whole-container').scrollTop(0);
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

  // ns.PrintProgram = function(program, host){
  //   var _searchResult = $('#searchResult');
  //   var _searchTagsBox = $('#tagBox');
  //   var _searchWidget = $('#searchEngine');

  //   _searchResult.empty();
  //   var _categories = [];
  //   program.forEach(function(performance){
  //     if((host && performance.host_name == host) || !host){
  //       if($.inArray(performance.participant_category, _categories) < 0) _categories.push(performance.participant_category);
  //       var _performanceBox = $('<div>');
  //       var _time = moment(performance.time[0], 'x').format('HH:mm') + ' - ' + moment(performance.time[1], 'x').format('HH:mm');
  //       var _title = performance.title;
  //       _performanceBox.append(_time, _title);
  //       _searchResult.append(_performanceBox);
  //     }
  //   });

  //   if(program.length == 0) {
  //     var _message = $('<h6>').text('Ningún resultado para esta fecha').css('color','#6f6f6f');
  //     _searchResult.append(_message);
  //   }
  // }

  ns.Widgets.Filters = function(filters, callback){
    var _createdWidget = $('<div>');
    var _closepopup;

    var _labels = {
      'participants': 'Categorias Artísticas',
      'hosts': 'Categorias Espacios',
      'other': 'Otros'
    }

    Object.keys(filters).forEach(function(key){

      var _categoriesLabel = $('<div>').text(_labels[key]);
      _createdWidget.append(_categoriesLabel);

      Object.keys(filters[key]).forEach(function(filter){
        var _filterContainer = $('<div>').css('height', 20);
        var _input = $('<input />').attr({ type: 'checkbox'});
        _input.prop('checked', filters[key][filter]);
        _input.on('change', function(){
          filters[key][filter] = _input.is(":checked");
          callback(filters);
        });
        var _label = $('<label>').html(filter);
        _label.css('display','inline');
        var _filter = $('<div>').append(_input,_label);
        _filterContainer.append(_filter);
        _createdWidget.append(_filterContainer);
      });
    });

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }

  ns.Widgets.ProgramEventPage = function(){
    var eventDates = ['2016-10-15', '2016-10-16'];
    var eventCategories = {
      participants: ['Artes Escénicas', 'Audiovisual', 'Exposición', 'Música', 'Street Art', 'Taller', 'Otros'],
      hosts: ['Asociación Cultural', 'Espacio Exterior', 'Espacio Particular', 'Local Comercial'],
      other: ['Infantil']
    }
    var _filters = {};

    Object.keys(eventCategories).forEach(function(key){
      if(eventCategories[key]) _filters[key] = {};
      eventCategories[key].forEach(function(category){
        _filters[key][category] = false;
      });
    });

    var hosts = [];
    var _data = [];
    var _program = [];
    var _host;
    var _hostIndex;
    var _searchResult = $('<div>').attr('id', 'searchResult');
    var _searchTagsBox = $('<div>').addClass('search-input search-tag-box').attr('id', 'tagBox');

    var _createdWidget = $('<div>');
    var _searchWidget = $('<select>').attr('id', 'searchEngine');

    var _daySelectorContainer = $('<div>').css({
      'width': 150,
      'display': 'inline-block'
    });
    var _daySelector = $('<select>');

    eventDates.forEach(function(day){
      var _date = $('<option>').val(day).text(moment(day).locale('es').format('DD-MMM-YYYY'));
      _daySelector.append(_date);
    });

    _daySelectorContainer.append(_daySelector);

    var _programNow = $('<button>').html('Ahora').css({
      'width': 150,
      'display': 'inline-block',
      'border': 'solid black'
    });

    var extraDate;
    _programNow.on('click', function(){
      var _date = new Date();
      var _day = moment(_date).format('YYYY-MM-DD');
      //var _day = '2016-10-15';

      if(_programNow.hasClass('active')){
        _programNow.removeClass('active');
        _programNow.html('Ahora');
        _search(_daySelector.val());
      }
      else{
        _programNow.addClass('active fired');
        _programNow.html('Todo');
        if($.inArray(_day, eventDates) < 0){
          _daySelector.empty();
          extraDate = $('<option>').val(_day).text(moment(_day).locale('es').format('DD-MMM-YYYY'));
          _daySelector.append(extraDate);
          eventDates.forEach(function(day){
            var _dateOption = $('<option>').val(day).text(moment(day).locale('es').format('DD-MMM-YYYY'));
            _daySelector.append(_dateOption);
          });
        }
        _daySelector.val(_day);
        _daySelector.trigger('change');
        _programNow.removeClass('fired');
      }
    });

    _daySelector.on('change', function(){
      if(_programNow.hasClass('fired')){
        var _date = new Date();
        //var _time = _date.getTime();
        var _time = new Date('2016', '09', '15', '18', '23', '01', '123').getTime();
        _search(_daySelector.val(), _time);
      }
      else{
        if(extraDate) extraDate.remove();
        _programNow.removeClass('active');
        _programNow.html('Ahora');
        _search(_daySelector.val());
      }
    });

    var _filtersButton = $('<button>').html('Filtros').css({
      'width': 150,
      'display': 'inline-block',
      'border': 'solid black'
    });

    _filtersButton.on('click', function(){
      var _content = $('<div>').addClass('very-fast reveal full');
      _content.empty();
      $('body').append(_content);

      var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
      var _message = Pard.Widgets.PopupContent('Selecciona', Pard.Widgets.Filters(_filters, function(filters){_filters = filters;}));

      _message.setCallback(function(){
        _content.remove();
        _popup.close();
        _search(_daySelector.val());
      });

      _content.append(_message.render());
      _popup.open();
    });
    
    var map = $('<div>').attr('id', 'gmap');
    map.css({'width': '100%', 'height': '250px'});
    var gmap;

    var _searchWidgetsContainer = $('<div>').addClass('searchWidgetsContainer-event-page');

    _searchWidgetsContainer.append(_searchWidget, _daySelectorContainer, _programNow, _filtersButton);
    Pard.Widgets.Sticker(_searchWidgetsContainer, 452, 0);
    
    _createdWidget.append(map, _searchWidgetsContainer, _searchTagsBox, _searchResult);
    
    _daySelector.select2({
      minimumResultsForSearch: Infinity,
      allowClear:false,
      templateResult: formatResource
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
          var filters = {};
          Object.keys(_filters).forEach(function(key){
            filters[key] = [];
            Object.keys(_filters[key]).forEach(function(category){
              if(_filters[key][category] == true) filters[key].push(category);
            });
          });
          return {
            query: _query,
            page: params.page,
            event_id: 'a5bc4203-9379-4de0-856a-55e1e5f3fac6',
            filters: filters
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

    var _search = function(date, time){
      var spinner =  new Spinner().spin();
      $.wait(
        '', 
        function(){
          _searchResult.empty();  
          _searchResult.append(spinner.el); 
        }, 
        function(){
          tags = [];
          var _dataArray = _searchWidget.select2('data'); 
          _dataArray.forEach(function(tag){
            if(tag.icon && tag.icon == 'space') _host = tag.text;
            tags.push(tag.text);
          });
          var filters = {};
          Object.keys(_filters).forEach(function(key){
            filters[key] = [];
            Object.keys(_filters[key]).forEach(function(category){
              if(_filters[key][category] == true) filters[key].push(category);
            });
          });
          Pard.Backend.searchProgram('a5bc4203-9379-4de0-856a-55e1e5f3fac6', tags, filters, date, time, function(data){
            _program = data.program;
            _data = [];
            hosts = [];
            data.program.forEach(function(performance, index){
              if($.inArray(performance.host_proposal_id, hosts) < 0){
                if(performance.host_name == _host) _hostIndex = _data.length + 1;
                _data.push({
                  lat: performance.address.location.lat,
                  lon: performance.address.location.lng,
                  title: performance.host_name,
                  zoom: 16,
                  icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + performance.order + '|FE7569|000000',
                  html: "<div><b>" + performance.host_name + "</b></div> <div>"+ performance.address.route+"</div>",
                  order: performance.order
                });
                hosts.push(performance.host_proposal_id);
              }
            });
            gmap.SetLocations(_data, true);
            if(_hostIndex) gmap.ViewOnMap(_hostIndex);
            Pard.PrintProgram(_program, _host, gmap, _data);
          });
          spinner.stop();
        }
      );
    }

    _searchWidget.on('change', function(){
      _search(_daySelector.val());
    });



    $(document).ready(function(){
      gmap = new Maplace({
        locations: _data,
        map_options: {
          mapTypeControl: false,
        },
        afterShow: function(index, location, marker){
          _host = _data[index].title;
          marker.setIcon('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _data[index].order + '|9933FF|000000');
          Pard.PrintProgram(_program, _data[index].title, gmap, _data);
        },
        afterOpenInfowindow: function(index, location, marker){
          marker.setIcon('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _data[index].order + '|9933FF|000000');
        },
        afterCloseClick: function(index){
          _host = '';
          Pard.PrintProgram(_program, '', gmap, _data);
        }
      }).Load();
      _search(_daySelector.val());
    });

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
