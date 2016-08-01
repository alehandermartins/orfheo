'use strict';

(function(ns){

ns.Widgets.ProgramEventPage = function(){

    var hosts = [];
    var _data = [];
    var _program = [];
    var _host;
    var _hostIndex;
    var _searchResult = $('<div>').attr('id', 'searchResult');
    var _searchTagsBox = $('<div>').addClass('search-input search-tag-box').attr('id', 'tagBox');
    var _buttonBox = $('<div>');

    var _createdWidget = $('<div>');
    var _searchWidget = $('<select>').attr('id', 'searchEngine');

    var _daySelectorContainer = $('<div>').css('width', 150);
    var _daySelector = $('<select>');

    ['2016-10-15', '2016-10-16'].forEach(function(day){
      var date = $('<option>').val(day).text(moment(day).locale('es').format('DD-MMM-YYYY'));
      _daySelector.append(date);
    });

    _daySelectorContainer.append(_daySelector);
    
    var map = $('<div>').attr('id', 'gmap');
    map.css({'width': '100%', 'height': '250px'});
    var gmap;

    var _culturalAssObj = {};
    var _commercialObj = {};
    var _homeObj = {};
    var _openAirObj = {};


    var _artisticCatObj = {
      'arts':{},
      'audiovisual':{}, 
      'expo':{}, 
      'music':{},
      'poetry':{}, 
      'street_art':{}, 
      'workshop':{}, 
      'other':{}
    };

    var _spaceCatObj = {
      'cultural_ass':_culturalAssObj,
      'commercial':_commercialObj,
      'home':_homeObj, 
      'open_air':_openAirObj
    };


    var _typeObj = {
      'artist_categories':_artisticCatObj,
      'spaces': _spaceCatObj
    }

    var _typeArray = ['artist_categories', 'spaces'];
    
    var _objDictionary = function(data, obj){
      for (var field in obj) {
        if (data.toUpperCase() == Pard.Widgets.Dictionary(field).render().toUpperCase()) {console.log(field);
          console.log(obj);
          console.log(obj[field]);
          return obj[field];}
        else _objDictionary(data, obj[field]);
      }
    }

    var _printBtnType = function(){
      _buttonBox.empty();
    _typeArray.forEach(function(type){
      var _typebtn = $('<button>').attr('type','button').text(Pard.Widgets.Dictionary(type).render()).addClass('button-event-page-type-tags');
      // var _id = 'tagsContainer-'+type;
      var _typeTagsContainer = $('<div>');
      // .attr('id',_id);
      _searchTagsBox.append(_typeTagsContainer);
      _typeTagsContainer.hide();
      _typebtn.one('click',function(){
        _printTags(_typeObj[type], _typeTagsContainer, type);
      });
      _typebtn.on('click',function(){
          $('.button-activated-event-page').removeClass('button-activated-event-page');
          _typebtn.addClass('button-activated-event-page');
          $('.shown-container').hide().removeClass('shown-container');
          _typeTagsContainer.show().addClass('shown-container');
        // }
      });
      _buttonBox.append(_typebtn);
      if (type == 'artist_categories') _typebtn.trigger('click');
    })
    };


    var _printTagFromObj = function(obj, field, tagsContainer){
      var _typeTag = $('<div>').addClass('suggested-tag-search-engine');
      _typeTag.click(function(){
        var _text = Pard.Widgets.Dictionary(field).render();
        // if (!_text) _text = field;
        var option = new Option(_text, _text, true, true);
        _searchWidget.append(option);
        _searchWidget.trigger('change');
        // _printTags(obj[field], tagsContainer);
      });
      var _icon = Pard.Widgets.IconManager(field).render();
      _icon.addClass('search-tag-icon');
      var _tagSpan = $('<span>').css('vertical-align','middle');
      var _tagText = Pard.Widgets.Dictionary(field).render();
      // if (!(_tagText)) _tagText = field;
      _typeTag.append(_tagSpan.append(_icon, _tagText));
      tagsContainer.append(_typeTag);
    };

    
    var _printTags = function(obj, tagsContainer,type){  
      // if (!obj) _printTags(_typeObj[type], tagsContainer);
      // else  {
        console.log(obj);
      tagsContainer.empty();
      for (var field in obj){
        _printTagFromObj(obj, field, tagsContainer);
      // }
      }
    }

    
    _createdWidget.append(map, _searchWidget, _daySelectorContainer,_buttonBox, _searchTagsBox, _searchResult);
    
    _daySelector.select2({
      minimumResultsForSearch: Infinity,
      allowClear:false,
      templateResult: formatResource
    });

    _daySelector.on('change', function(){
      _data = [];
      hosts = [];
      _program[_daySelector.val()].forEach(function(performance, index){
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
      Pard.PrintProgram(_program, _daySelector.val(), _host);
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
      var tags = [];
      var _dataArray = _searchWidget.select2('data'); 
      _dataArray.forEach(function(tag){
        if(tag.icon && tag.icon == 'space') _host = tag.text;
        tags.push(tag.text);
      });
      // if (!(tags.length)) 
      Pard.Backend.searchProgram(tags, 'a5bc4203-9379-4de0-856a-55e1e5f3fac6', function(data){
          _program = data.program;
          console.log(_program);
          _program[_daySelector.val()].forEach(function(performance){
          _spaceCatObj[performance.host_category][performance.host_name]={};
          })
          _data = [];
          hosts = [];
          data.program[_daySelector.val()].forEach(function(performance, index){
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
          Pard.PrintProgram(_program, _daySelector.val(), _host);

        });
      if (_dataArray.length) _printTags(_objDictionary(_dataArray[_dataArray.length-1]['text'], _typeObj),$('.shown-container'));
      else _printBtnType();
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

    $(document).ready(function(){
      gmap = new Maplace({
        locations: _data,
        controls_type: 'list',
        controls_on_map: false,
        afterShow: function(index, location, marker){
          _host = _data[index].title;
          marker.setIcon('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _data[index].order + '|9933FF|000000');
          Pard.PrintProgram(_program, _daySelector.val(), _data[index].title);
        },
        afterOpenInfowindow: function(index, location, marker){
          marker.setIcon('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + _data[index].order + '|9933FF|000000');
        },
        afterCloseClick: function(index){
          _host = '';
          Pard.PrintProgram(_program, _daySelector.val(), '');
        }
      }).Load();
      _searchWidget.trigger('change');
    });

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }


   ns.PrintProgram = function(program, date, host){
    var _searchResult = $('#searchResult');
   
    // _printTags(_typeObj);

    _searchResult.empty();
    var _categories = [];
    program[date].forEach(function(performance){
      if((host && performance.host_name == host) || !host){
        if($.inArray(performance.participant_category, _categories) < 0) _categories.push(performance.participant_category);
        var _performanceBox = $('<div>');
        var _time = moment(performance.time[0], 'x').format('HH:mm') + ' - ' + moment(performance.time[1], 'x').format('HH:mm');
        var _title = performance.title;
        _performanceBox.append(_time, _title);
        _searchResult.append(_performanceBox);
      }
    });

    if(program[date].length == 0) {
      var _message = $('<h6>').text('Ningún resultado para esta fecha').css('color','#6f6f6f');
      _searchResult.append(_message);
    }
  }

}(Pard || {}));
