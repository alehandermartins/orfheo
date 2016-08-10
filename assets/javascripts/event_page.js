'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};  

  ns.Widgets.EventAside = function (sectionContainer) {

    var _createdWidget = $('<div>').addClass('aside-container event-page-aside');

    if ($(window).width()>640){
      if (Pard.UserStatus['status'] == 'outsider') Pard.Widgets.Sticker(_createdWidget, 83, 24);
      else if (Pard.UserStatus['status'] == 'visitor') Pard.Widgets.Sticker(_createdWidget, 74, 24);
    }
    // else  Pard.Widgets.Sticker(_createdWidget, 60, 24);
    var _participants;

    var _program = $('<div>').addClass('aside-event-nav-btn');
    _program.text('Programa');

    _program.click(function(){
      if(_participants) _participants.deactivate();
      _participants.deactivate();
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
      if(_participants) _participants.activate();
      _contentShowHide('participants-event-page');
      $(this).addClass('aside-event-nav-btn-selected');
    });
    _explore.one('click', function(){
      _participants = Pard.Widgets.ParticipantEventPage();
      _exploreContent.append(_participants.render());     
    });
    var _exploreContent = $('<div>').attr('id', 'participants-event-page');
    _exploreContent.hide();

    var _info = $('<div>').addClass('aside-event-nav-btn');
    _info.text('Informaciones');
    _info.click(function(){
      if(_participants) _participants.deactivate();
      _contentShowHide('info-event-page');
      $(this).addClass('aside-event-nav-btn-selected');
    });
    _info.one('click', function(){
      if(_participants) _participants.deactivate();
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

    var _dictionary = {
      'Artes Escénicas': 'arts',
      'Audiovisual': 'audiovisual',
      'Exposición':'expo',
      'Música': 'music',
      'Street Art': 'street_art',
      'Taller':'workshop',
      'Otros': 'other',
      'Infantil':'children'
    }

    Object.keys(filters).forEach(function(key){

      var _categoriesLabel = $('<div>').text(_labels[key]).addClass('categories-labels-popup-event-page');
      _createdWidget.append(_categoriesLabel);

      Object.keys(filters[key]).forEach(function(filter){
        // var _filterContainer = $('<div>');
        var _input = $('<input />').attr({ type: 'checkbox'});
        _input.prop('checked', filters[key][filter]);
        _input.on('click',function(event){
              event.stopPropagation();
        });
        _input.on('change', function(){
          filters[key][filter] = _input.is(":checked");
          callback(filters);
        });
        var _label = $('<label>').append(filter,' ',Pard.Widgets.IconManager(_dictionary[filter]).render().addClass('participant-category-icon'));
        _label.css('display','inline');
        var _filter = $('<div>').append(_input,_label).addClass('filter-checkbox-event-page');
        _filter.on('click',function(){
          _input.trigger('click');
        })
        // _filterContainer.append(_filter);
        _createdWidget.append(_filter);
      });
    });

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      },
      checkFilterOn: function(){
        var _checks = [];
        Object.keys(filters).forEach(function(key){
          Object.keys(filters[key]).forEach(function(filter){
            _checks.push(filters[key][filter]);
          });
        });
        if ($.inArray(true,_checks)>-1) return true;
        else return false;
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

    var _data = [];
    var _program;
    var _host;
    var _searchResult = $('<div>').attr('id', 'searchResult');
    var _chooseOrderBox = $('<div>').addClass('choose-order-box');

    var _createdWidget = $('<div>');
    var _searchWidget = $('<select>').attr('id', 'searchEngine');

    var _chooseOrder = $('<select>');
    var _chooseOrderSelect = $('<div>').append(_chooseOrder).addClass('choose-order-select');
    var _chooseText = $('<span>').text('Ordena por');
    _chooseOrderBox.append($('<div>').append(_chooseText, _chooseOrderSelect).css('float','right'));

    var _types = ['Horario', 'Espacio'];  
    var _tagsTypes = [];
    _types.forEach(function(type){
      _tagsTypes.push({id: type, text:type});
    });
    var _printProgramDictionary = {
      'Horario': Pard.PrintProgram,
      'Espacio': Pard.PrintProgramSpaces
      // 'Categoría artistica': Pard.PrintProgram
    }
    var _printProgram = Pard.PrintProgram;
    _chooseOrder.select2({
      data: _tagsTypes,
      minimumResultsForSearch: -1
    }).on('select2:select', function(){
      _printProgram = _printProgramDictionary[_chooseOrder.select2('data')[0].id];
      _search();
    });

    var _daySelectorContainer = $('<div>').addClass('day-selector-container-event-page');
    var _daySelector = $('<select>');

    eventDates.forEach(function(day){
      var _dayText = '';
      if ($(window).width()>640) _dayText = moment(day).locale('es').format('dddd, DD-MMM-YYYY');
      else _dayText = moment(day).locale('es').format(' DD-MMM-YYYY')

      var _date = $('<option>').val(day).text(_dayText);
      _daySelector.append(_date);
    });

    _daySelectorContainer.append(_daySelector);

    var _programNow = $('<button>').html('Ahora').addClass('interaction-btn-event-page');

    var extraDate;
    _programNow.on('click', function(){
      var _date = new Date();
      //var _day = moment(_date).format('YYYY-MM-DD');
      var _day = '2016-10-15';

      if(_programNow.hasClass('active')){
        _programNow.removeClass('active');
        _programNow.html('Ahora');
        _search();
      }
      else{
        _programNow.addClass('active fired');
        // _programNow.html('Todo');
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
      if(_programNow.hasClass('fired')) _search();
      else{
        if(extraDate) extraDate.remove();
        _programNow.removeClass('active');
        _programNow.html('Ahora');
        _search();
      }
    });

    var _filtersButton = $('<button>').html('Filtros').addClass('interaction-btn-event-page');

    _filtersButton.on('click', function(){
      var _content = $('<div>').addClass('very-fast reveal full');
      _content.empty();
      $('body').append(_content);

      var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
      var _filtersWidgets = Pard.Widgets.Filters(_filters, function(filters){_filters = filters;});
      var _message = Pard.Widgets.PopupContent('Selecciona lo que quieres ver', _filtersWidgets);

      _message.setCallback(function(){
        if(_filtersWidgets.checkFilterOn()) _filtersButton.addClass('active');
        else _filtersButton.removeClass('active');
        _content.remove();
        _popup.close();
        _search();
      });

      _content.append(_message.render());
      _popup.open();
    });
    
    var map = $('<div>').attr('id', 'gmap');
    map.css({'width': '100%', 'height': '250px'});
    var gmap;

    var _searchWidgetsContainer = $('<div>').addClass('searchWidgetsContainer-event-page');

    var _goUpBtn = $('<button>').attr('type','button').append(Pard.Widgets.IconManager('circle_arrow_up').render()).addClass('goUpBtn-program-event-page');
    _goUpBtn.hide();
    $('body').append(_goUpBtn);
    _goUpBtn.on('click',function(){
      $('.whole-container').scrollTop(0);
    })
 
      $(window).load(function(){
          if ($(window).width()<1024) {
            _searchWidgetsContainer.css({width: $('#program-event-page').width()});
          }
      })


    if ($(window).width()<640){
      Pard.Widgets.StickAndKickHeader(_searchWidgetsContainer, 442, 0);
      $(window).load(function(){
        $('.whole-container').scroll(function(){
        if (_searchWidgetsContainer.hasClass('position-fixed')){
          if (!(_chooseOrderBox.hasClass('chooseOrderSelect-additional-distance')))_chooseOrderBox.addClass('chooseOrderSelect-additional-distance');
          _goUpBtn.show();
        }
        else {
          _chooseOrderBox.removeClass('chooseOrderSelect-additional-distance');
          _goUpBtn.hide();
        }
        });
      });
    }
    else{
      Pard.Widgets.Sticker(_searchWidgetsContainer, 452, -10);
      $(window).load(function(){
        $('.whole-container').scroll(function(){
        if (_searchWidgetsContainer.hasClass('position-fixed')){
          if (!(_chooseOrderBox.hasClass('chooseOrderSelect-additional-distance')))_chooseOrderBox.addClass('chooseOrderSelect-additional-distance');
          _goUpBtn.show();

        }
        else{ 
          _chooseOrderBox.removeClass('chooseOrderSelect-additional-distance');
          _goUpBtn.hide();
        }
        });
      });
    }

    _searchWidgetsContainer.append($('<div>').append(_searchWidget),$('<div>').append(_daySelectorContainer, _programNow, _filtersButton));
    
    _createdWidget.append(map, _searchWidgetsContainer, _chooseOrderBox, _searchResult);
    
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
        delay: 10,
        positionDropdown: function(forceAbove){
          if (forceAbove) {
            enoughRoomAbove = false;
            enoughRoomBelow = true;
          }
        },
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
      tokenSeparators: [';', '\n', '\t'],   
      templateResult: formatResource,
    }).on("select2:select", function(e) {
      if(_searchWidget.select2('data') != false){
        if(e.params.data.isNew){
          $(this).find('[value="'+e.params.data.id+'"]').replaceWith('<option selected value="'+e.params.data.id+'">'+e.params.data.text+'</option>');
        }
      }
      // $(':focus').blur();
    });

    // _searchWidget.on("select2:unselect",function(event){
    //   if ($(window).width() < 640)  {
    //     $('.whole-container').scrollTop(110); 
    //   }
    // });

    // _searchWidget.on('select2:unselecting',function(){
    //   _searchWidget.one("select2:opening",function(){
    //     $('body').focus();
    //   });
    // });


    var _search = function(){
      // $('body').click()
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

          var _day = _daySelector.val();
          var _time;
          if(_programNow.hasClass('active')){
            var _date = new Date();
            _day = '2016-10-15';
            //_day = moment(_date).format('YYYY-MM-DD');
            //_time = _date.getTime();
            _time = new Date('2016', '09', '15', '18', '23', '01', '123').getTime();
          }

          Pard.Backend.searchProgram('a5bc4203-9379-4de0-856a-55e1e5f3fac6', tags, filters, _day, _time, function(data){
            _program = data.program;
            _data = [];
            var hosts = [];
            var _hostIndex;
            data.program.forEach(function(performance, index){
              var _iconNum = performance.order +1;
              if($.inArray(performance.host_proposal_id, hosts) < 0){
                if(performance.host_name == _host) _hostIndex = _data.length + 1;
                _data.push({
                  lat: performance.address.location.lat,
                  lon: performance.address.location.lng,
                  title: performance.host_name,
                  zoom: 16,
                  icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _iconNum + '|FE7569|000000',
                  html: "<div><b>" + performance.host_name + "</b></div> <div>"+ performance.address.route+"</div>",
                  order: performance.order
                });
                hosts.push(performance.host_proposal_id);
              }
            });
            gmap.SetLocations(_data, true);
            if(_hostIndex) gmap.ViewOnMap(_hostIndex);
            _printProgram(data.program, _host, gmap, _data);
          });
          spinner.stop();
          // $('body').focus();
          _searchWidget.select2("close");
          $(':focus').blur();
          $('body').click();
          if ($(window).width() < 640)  $('.whole-container').scrollTop(110);   

        }
      );
    }

    _searchWidget.on('change', function(){
      _host = '';
      _search();
    });

    _searchWidget.on("select2:opening",function(){
      if ($(window).width() < 640 ) {
        var _distanceInputTop = _searchWidget.offset().top;
        var _scroolTop = $('.whole-container').scrollTop();
        var _headerHeight = $('header').height();
        var _distanceToDo = _distanceInputTop + _scroolTop - _headerHeight - 10; 
        $('.whole-container').scrollTop(_distanceToDo);
      }
    });

    $(document).ready(function(){
      gmap = new Maplace({
        locations: _data,
        map_options: {
          mapTypeControl: false,
        },
        afterShow: function(index, location, marker){
          _host = Pard.Widgets.RemoveAccents(_data[index].title);
          var _iconNum = _data[index].order + 1;
          marker.setIcon('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _iconNum + '|9933FF|000000');
          _printProgram(_program, _host, gmap, _data);
        },
        afterOpenInfowindow: function(index, location, marker){
          var _iconNum = _data[index].order + 1;
          marker.setIcon('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _iconNum + '|9933FF|000000');
        },
        afterCloseClick: function(index){
          _host = '';
          _printProgram(_program, '', gmap, _data);
        },
        afterCloseInfowindow: function(index){
          _host = '';
          _printProgram(_program, '', gmap, _data);
        }
      }).Load();

      var _firstDate = moment(new Date()).format('YYYY-MM-DD');
      if($.inArray(_firstDate, eventDates) >= 0){
        _daySelector.val(_firstDate);
      }
      _daySelector.trigger('change');
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
