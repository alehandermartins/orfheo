'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.EventAside = function(sectionContainer) {
    var _createdWidget = $('<div>').addClass('aside-container event-page-aside');
    var _buttonContainer = $('<div>').addClass('create-profile-container');

    if ($(window).width()>640){
      if (Pard.UserStatus['status'] == 'outsider') Pard.Widgets.Sticker(_createdWidget, 28.8, 24);
      else  Pard.Widgets.Sticker(_createdWidget, 28.8, 24);
    }
    // else  Pard.Widgets.Sticker(_createdWidget, 60, 24);

    if (Pard.CachedEvent.program.length){
      var _rgb = Pard.Widgets.IconColor(Pard.CachedEvent.color).rgb();
      var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
      if (Pard.CachedEvent.published == 'true' || Pard.CachedEvent.published == true){
        $(document).ready(function(){
          $('main').css('background', _backColor);
        });
      }
      if (Pard.UserStatus['status'] == 'owner' || Pard.CachedEvent.published == 'true' || Pard.CachedEvent.published == true){
        var _program = $('<div>').addClass('aside-event-nav-btn');
        _program.text(Pard.t.text('event_page.eventAside.program'));
        _program.click(function(){
          if(_participants) _participants.deactivate();
          _contentShowHide('program-event-page');
          $(this).addClass('aside-event-nav-btn-selected');
        });
        var _programContent = $('<div>').attr('id', 'program-event-page');
        _programContent.append(Pard.Widgets.ProgramEventPage().render());
        var _contentShown = _programContent;
        _program.addClass('aside-event-nav-btn-selected');
        _buttonContainer.append(_program);


        var _explore = $('<div>').addClass('aside-event-nav-btn');
        _explore.text(Pard.t.text('event_page.eventAside.community'));
        var _exploreContent = $('<div>').attr('id', 'participants-event-page');
        _exploreContent.hide();
        _explore.click(function(){
          if(_participants) _participants.activate();
          _contentShowHide('participants-event-page');
          $(this).addClass('aside-event-nav-btn-selected');
        });
        var _participants;
        if (_contentShown){
          _explore.one('click', function(){
            _participants = Pard.Widgets.ParticipantEventPage(Pard.CachedEvent.event_id);
            _exploreContent.append(_participants.render());
          });
        }
        else{
          _participants = Pard.Widgets.ParticipantEventPage(Pard.CachedEvent.event_id);
          _exploreContent.append(_participants.render());
          var _contentShown = _exploreContent;
        }
        _buttonContainer.append(_explore);
       }
    }

    var _info = $('<div>').addClass('aside-event-nav-btn');
    _info.text(Pard.t.text('event_page.eventAside.info'));
    var _infoContent = $('<div>').attr('id', 'info-event-page');
    _info.click(function(){
      if(_participants) _participants.deactivate();
      _contentShowHide('info-event-page');
      $(this).addClass('aside-event-nav-btn-selected');
    });
    if (_contentShown){
      _info.one('click', function(){
        if(_participants) _participants.deactivate();
      _infoContent.append(Pard.Widgets.EventInfo().render());
      })
    }
    else var _contentShown = _infoContent.append(Pard.Widgets.EventInfo().render());
    if (!(_program)) _info.addClass('aside-event-nav-btn-selected');
    _buttonContainer.append(_info);


    if (!$.isEmptyObject(Pard.CachedEvent.partners) || Pard.UserStatus['status'] == 'owner'){
      var _partner = $('<div>').addClass('aside-event-nav-btn');
      _partner.text(Pard.t.text('event_page.eventAside.partners'));
      _partner.click(function(){
        if(_participants) _participants.deactivate();
        _contentShowHide('partner-event-page');
        $(this).addClass('aside-event-nav-btn-selected');
      });
      _partner.one('click', function(){
        if(_participants) _participants.deactivate();
      _partnerContent.append(Pard.Widgets.PartnerTab(Pard.CachedEvent.partners));
      });
      var _partnerContent = $('<div>').attr('id', 'partner-event-page');
      _partnerContent.hide();
      _buttonContainer.append(_partner);
    }


    var _contentShowHide = function(id_selected){
      $(window).scrollTop(0);
      $('.aside-event-nav-btn-selected').removeClass('aside-event-nav-btn-selected');
      _contentShown.hide();
      _contentShown = $('#'+id_selected);
      _contentShown.show();
    }

    var _title = Pard.Widgets.EventTitle();

    sectionContainer.append(_title, _programContent, _exploreContent, _infoContent, _partnerContent).addClass('profiles-user-section-content');

    _createdWidget.append(_buttonContainer);

    if (Pard.UserStatus['status'] == 'owner' && Pard.CachedEvent.call_id){
      var _toCallPageBtn = $('<a>').attr('href','/event_manager?id=' + Pard.CachedEvent.event_id).text(Pard.t.text('event_page.eventAside.managerbtn'));
      _toCallPageBtn.addClass('navigation-btn-callPage');
      var _toCallPageBtnContainer = $('<div>').addClass('navigation-outside-event-page');
      var _innerContNav =  $('<div>').addClass('navigation-innerCont-event-page');
      _toCallPageBtnContainer.append(_innerContNav.append(_toCallPageBtn));
      _createdWidget.append(_toCallPageBtnContainer);

      if (Pard.CachedEvent.program.length){
        var _publishBtnCont =  $('<div>').addClass('navigation-innerCont-event-page');
        var _publishedBtn = $('<button>')
          .attr('type','button')
          .addClass('publish_unpublish_btn-eventPage');
        _toCallPageBtnContainer.append(_publishBtnCont.append(_publishedBtn));
        var _publishStatus;
        var _setPublishStatus = function(){
          if(Pard.CachedEvent.published == true || Pard.CachedEvent.published == 'true'){
            _publishStatus = 'unpublish';
            _publishedBtn.text(Pard.t.text('event_page.eventAside.withdrawprog'));
            $('main').css({'background': _backColor});
          }
          else{         
            _publishStatus = 'publish';
            _publishedBtn.text(Pard.t.text('event_page.eventAside.publishprog'));
            $('main').css('background','#f6f6f6');
          }
        }
        _setPublishStatus();
        _publishedBtn.on('click', function(){
          Pard.Backend.publish(Pard.CachedEvent.event_id, _publishProgramCallback[_publishStatus]);
        });
        var _publishProgramCallback =  {
          publish: function(data){
            if(data['status'] == 'success') {
              var _mex = $('<div>').html(Pard.t.text('event_page.eventAside.publishMex'));
              Pard.Widgets.TimeOutAlert('',_mex);
              Pard.CachedEvent.published = true;
              _setPublishStatus();
            }
            else{
              console.log('error');
              Pard.Widgets.Alert(Pard.t.text('error.alert'),Pard.t.text('error.nonExecuted') , function(){location.reload();});
            }
          },
          unpublish: function(data){
            if(data['status'] == 'success') {
              var _mex = $('<div>').html(Pard.t.text('event_page.eventAside.withdrawMex'));
              Pard.Widgets.TimeOutAlert('',_mex);
              Pard.CachedEvent.published = false;
              _setPublishStatus();
            }
            else{
              console.log('error');
              Pard.Widgets.Alert(Pard.t.text('error.alert'), Pard.t.text('error.nonExecuted'), function(){location.reload();});
            }
          }
        }
      }  
    }

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.Filters = function(filters, callback){
    var _createdWidget = $('<div>');
    var _closepopup;
    var the_event = Pard.CachedEvent;
    var _translator = Pard.UserInfo['texts'].subcategories;

    var _labels = {
      'participants': Pard.t.text('event_page.program.filters.participants'),
      'hosts': Pard.t.text('event_page.program.filters.hosts'),
      'other': Pard.t.text('event_page.program.filters.other')
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
        var _label = $('<label>');
        if(key == 'participants') {
          var _icon = $('<span>');
          _icon.append(Pard.Widgets.IconManager(the_event.subcategories.artist[filter].icon).render().addClass('participant-category-icon'));
          _label.append(_translator.artist[filter],' ',_icon);
        }
        else if(key == 'other') {
          _label.append(Pard.t.text('widget.inputChildren.' + filter));
          if (filter == 'baby') _label.append(Pard.Widgets.IconManager('baby').render().addClass('participant-category-icon').css('margin-left','.4rem'))
        }
        else _label.append(_translator.space[filter]); 
        _label.css('display','inline');
        var _filter = $('<div>').append(_input,_label).addClass('filter-checkbox-event-page');
        _filter.on('click',function(){
          _input.trigger('click');
        })
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
    var the_event = Pard.CachedEvent;
    var eventDates = [];
    Object.keys(the_event.eventTime).forEach(function(date){
      if(date == 'permanent') return;
      eventDates.push(date);
    });

    var eventCategories = {
      participants: Object.keys(the_event.subcategories.artist),
      hosts: Object.keys(the_event.subcategories.space),
      other: ['all_public', 'baby', 'family', 'young', 'adults']
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
    var _chooseText = $('<span>').text(Pard.t.text('event_page.program.orderby'));
    _chooseOrderBox.append($('<div>').append(_chooseText, _chooseOrderSelect).css('float','right'));

    var _types = ['event_page.program.hs', 'event_page.program.sp'];
    var _tagsTypes = [];
    _types.forEach(function(type){
      _tagsTypes.push({id: type, text:Pard.t.text(type)});
    });
    var _printProgramDictionary = {
      'event_page.program.hs': Pard.PrintProgram,
      'event_page.program.sp': Pard.PrintProgramSpaces
    }
    var _printProgram = Pard.PrintProgram;
    _chooseOrder.select2({
      data: _tagsTypes,
      minimumResultsForSearch: -1
    }).on('change', function(){
        _searchResult.empty();
        _printProgram = _printProgramDictionary[_chooseOrder.select2('data')[0].id];
        _search();
    });

    var _daySelectorContainer = $('<div>').addClass('day-selector-container-event-page');
    var _daySelector = $('<select>');
    var _allDates = $('<option>').val([]).text(Pard.t.text('event_page.program.all_dates'));
    _daySelector.append(_allDates);

    eventDates.forEach(function(day){
      var _dayText = '';
      if ($(window).width()>640) _dayText = moment(day).locale(Pard.Options.language()).format('dddd, DD-MMM-YYYY');
      else _dayText = moment(day).locale(Pard.Options.language()).format(' DD-MMM-YYYY');

      var _date = $('<option>').val(day).text(_dayText);
      _daySelector.append(_date);
    });

    _daySelectorContainer.append(_daySelector);

    var _programNow = $('<button>').html(Pard.t.text('event_page.program.nowbtn')).addClass('interaction-btn-event-page').attr('type','button');

    var _now = new Date(); 
    var _eventTimeKeys = Object.keys(the_event.eventTime);
    var _eventEndTime = parseInt(the_event.eventTime[_eventTimeKeys[_eventTimeKeys.length-2]][1][1]);
    var _eventStartTime = parseInt(the_event.eventTime[_eventTimeKeys[0]][0][0]);
    if(_now.getTime() >_eventEndTime + 3600000*4 || _eventStartTime > _now.getTime() + 3600000*4) _programNow.attr('disabled',true).addClass('disabled-button');

    var extraDate;
    _programNow.on('click', function(){
      var _date = new Date();
      var _day = moment(_date).format('YYYY-MM-DD');

      if(_programNow.hasClass('active')){
        _programNow.removeClass('active');
        _search();
      }
      else{
        _programNow.addClass('active fired');
        if($.inArray(_day, eventDates) < 0){
          _daySelector.empty();
          _daySelector.append(_allDates);
          extraDate = $('<option>').val(_day).text(moment(_day).locale(Pard.Options.language()).format('DD-MMM-YYYY'));
          _daySelector.append(extraDate);
          eventDates.forEach(function(day){
            var _dateOption = $('<option>').val(day).text(moment(day).locale(Pard.Options.language()).format('DD-MMM-YYYY'));
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
        _search();
      }
    });

    var _filtersButton = $('<button>').html(Pard.t.text('event_page.program.filtersbtn')).addClass('pard-btn interaction-btn-event-page').attr('type','button');

    _filtersButton.on('click', function(){
      var _content = $('<div>').addClass('very-fast reveal full');
      _content.empty();
      $('body').append(_content);

      var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', multipleOpened:true});
      var _filtersWidgets = Pard.Widgets.Filters(_filters, function(filters){_filters = filters;});
      var _message = Pard.Widgets.PopupContent(Pard.t.text('event_page.program.filters.titleText'), _filtersWidgets);

      _message.setCallback(function(){
        if(_filtersWidgets.checkFilterOn()) _filtersButton.addClass('active');
        else _filtersButton.removeClass('active');
        _popup.close();
        _search();
        setTimeout(function(){_content.remove();},500)
      });

      _content.append(_message.render());
      _popup.open();
    });

    var map = $('<div>').attr('id', 'gmap');
    map.css({'width': '100%', 'height': '250px'});
    var gmap;

    var _searchWidgetsContainer = $('<div>').addClass('searchWidgetsContainer-event-page');

    var _goUpBtn = $('<button>').attr('type','button').append(Pard.Widgets.IconManager('circle_arrow_up').render()).addClass('goUpBtn-program-event-page');
    _goUpBtn.addClass('hide-goUpBtn');
    $('body').append(_goUpBtn);
    _goUpBtn.on('click',function(){
      $(window).scrollTop(0);
    })


    if ($(window).width()<640){
      Pard.Widgets.Sticker(_searchWidgetsContainer, 399, 0);
    }
    else {
      Pard.Widgets.Sticker(_searchWidgetsContainer, 399, 0);
    }

    $(window).load(function(){
      if ($(window).width()<1024){
          _searchWidgetsContainer.css({width: $('#program-event-page').width()});
      }
      $(window).scroll(function(){
        if (_searchWidgetsContainer.hasClass('position-fixed')){
          if (!(_chooseOrderBox.hasClass('chooseOrderSelect-additional-distance')))_chooseOrderBox.addClass('chooseOrderSelect-additional-distance');
          if (_goUpBtn.hasClass('hide-goUpBtn')) _goUpBtn.removeClass('hide-goUpBtn');
        }
        else {
          if (_chooseOrderBox.hasClass('chooseOrderSelect-additional-distance')) _chooseOrderBox.removeClass('chooseOrderSelect-additional-distance');
          if (!(_goUpBtn.hasClass('hide-goUpBtn'))) _goUpBtn.addClass('hide-goUpBtn');
        }
      });
    });

    var _sCont = $('<div>');

    _searchWidgetsContainer.append(_sCont.append(_searchWidget),$('<div>').append(_daySelectorContainer, _programNow, _filtersButton));
    _createdWidget.append(
      map, 
     _searchWidgetsContainer, 
      _chooseOrderBox, 
      _searchResult
    );

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
      placeholder: Pard.t.text('widget.search.placeholder'),
      minimumInputLength: 1,
      minimumResultsForSearch: 1,
      // allowClear: true,
      ajax: {
        url: '/search/suggest_program',
        type: 'POST',
        dataType: 'json',
        delay: 100,
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
            event_id: the_event.event_id,
            filters: filters,
            lang: Pard.Options.language()
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
      // tokenSeparators: [';', '\n', '\t'],
      templateResult: formatResource
    }).on("select2:select", function(e) {
      if(_searchWidget.select2('data') != false){
        if(e.params.data.isNew){
          $(this).find('[value="'+e.params.data.id+'"]').replaceWith('<option selected value="'+e.params.data.id+'">'+e.params.data.text+'</option>');
        }
      }
      // $(':focus').blur();
    });

    var _search = function(){
      var spinner =  new Spinner().spin();
      $.wait(
        '',
        function(){
          _searchResult.empty();
          _searchResult.append(spinner.el);
        },
        function(){
          var tags = [];
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
            _day = moment(_date).format('YYYY-MM-DD');
            _time = _date.getTime();
          }

          Pard.Backend.searchProgram(the_event.event_id, tags, filters, _day, _time, function(data){

            _program = data.program;
            _data = [];
            var hosts = [];
            var _hostIndex;
            data.program.forEach(function(performance, index){
              var _iconNum = performance.order +1;
              if($.inArray(performance.host_proposal_id, hosts) < 0){
                if(performance.host_name == _host) _hostIndex = _data.length + 1;
                if(!(performance.address) || !(performance.address.location)){
                  performance.address = performance.address || {};
                  performance.address.location = {
                    lat:'',
                    lng:''
                  };
                  performance.address.route = '¡ERROR EN LA GEOLOCALIZACION DEL ESPACIO!';
                }
                _data.push({
                  lat: performance.address.location.lat,
                  lon: performance.address.location.lng,
                  title: performance.host_name,
                  zoom: 16,
                  icon:'http://www.googlemapsmarkers.com/v1/'+_iconNum+'/FE7569/',
                  // icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _iconNum + '|FE7569|000000',
                  html: "<div><b>" + performance.host_name + "</b> ("+ Pard.t.text('categories.' + performance.host_category) +")</div> <div>"+ performance.address.route+" "+performance.address.street_number+"</div>",
                  order: performance.order
                });
                hosts.push(performance.host_proposal_id);
              }
            });
            gmap.SetLocations(_data, true);
            if(_hostIndex) gmap.ViewOnMap(_hostIndex);
            _printProgram(data.program, _host, gmap, _data);
          });
          _searchWidget.select2("close");
          $(':focus').blur();
          $('body').click();
          if ($(window).width() < 640)  $(window).scrollTop(110);
        }
      );
    }

    _searchWidget.on('change', function(ev){
      _host = '';
      _search();
      ev.stopImmediatePropagation();
    });


    _searchWidget.on('select2:opening',function(){
      if ($(window).width() < 640 ) {
        var _distanceInputTop = _searchWidget.offset().top;
        var _scroolTop = $(window).scrollTop();
        console.log(_distanceInputTop)
        console.log(_scroolTop)

        var _distanceToDo = _distanceInputTop - _scroolTop;
        console.log(_distanceToDo)
        if (_distanceInputTop - _scroolTop > 8) $(window).scrollTop(_distanceInputTop);
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
          // marker.setIcon('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _iconNum + '|9933FF|000000');
          marker.setIcon('http://www.googlemapsmarkers.com/v1/'+_iconNum+'/9933FF/');
          _printProgram(_program, _host, gmap, _data);
        },
        afterOpenInfowindow: function(index, location, marker){
          var _iconNum = _data[index].order + 1;
          // marker.setIcon('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _iconNum + '|9933FF|000000');
          marker.setIcon('http://www.googlemapsmarkers.com/v1/'+_iconNum+'/9933FF/');
        },
        afterCloseClick: function(index){
          _host = '';
          _printProgram(_program, '', gmap, _data);
        }
      }).Load();

      var _firstDate = moment(new Date()).format('YYYY-MM-DD');
      if($.inArray(_firstDate, eventDates) >= 0){
        _daySelector.val(_firstDate);
        _daySelector.trigger('change');
      }
      // ATT!! do not change this part! It is necessary so that searchWidgets (imputText, day selector, order selector) works in mobile phone quickly - This part reproduce the action of opening and closing filters popup
      if ($(window).width() < 640 ) {
        var _contentP = $('<div>').addClass('very-fast reveal full');
        _contentP.empty();
        $('body').append(_contentP);
        var _popup = new Foundation.Reveal(_contentP, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
        var _filtersWidgets = Pard.Widgets.Filters(_filters, function(filters){_filters = filters;});
        var _message = Pard.Widgets.PopupContent(Pard.t.text('event_page.eventAside.titleText'), _filtersWidgets);
        _message.setCallback(function(){
          if(_filtersWidgets.checkFilterOn()) _filtersButton.addClass('active');
          else _filtersButton.removeClass('active');
          _popup.close();
          setTimeout(function(){
            _contentP.remove();
            _popup.destroy();
          },500);
          _search();
        });
        _contentP.append(_message.render());
        _popup.open();
        _popup.close();
        _contentP.remove();
        $('html').removeClass('overflowHidden');
        _search();
      }
      else{
        _search();
      }
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
