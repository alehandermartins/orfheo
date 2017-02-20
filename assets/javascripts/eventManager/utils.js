'use strict';

(function(ns){
  ns.Widgets = ns.Widgets || {};  

  ns.ColumnWidth = 176;
  ns.PermanentCardHeight = 42;

  ns.Widgets.GenerateUUID = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  }

  ns.Signature = ns.Widgets.GenerateUUID();

  ns.Widgets.FormatResource = function(resource) {
    var _label = $('<span>').text(resource.text);
    if(resource.icon){
      var _icon = $('<span>')
      if ($.isArray(resource.icon)) 
        resource.icon.forEach(function(icon){
          _icon.append(Pard.Widgets.IconManager(icon).render())
        })
      else _icon = Pard.Widgets.IconManager(resource.icon).render();
      _label.append(_icon);
      _icon.css({
        position: 'relative',
        left: '5px',
        top: '5px',
      });
    }
    return _label;
  }

  ns.Widgets.CategoryColor = function(category){
    var _dictionary = {
      'music': '#3399FF',
      'arts': '#FF62B2',
      'poetry': '#FFFF00',
      'expo': '#66CC00',
      'street_art': '#FF3333',
      'audiovisual': '#C0C0C0',
      'other': '#FF8000',
      'workshop': '#994C00',
      'gastronomy': '#821486'
    }

    return _dictionary[category];
  }

  ns.Widgets.DictionaryColor = function(the_event){
    var spaceCategories = the_event.categories.space; 
    var _dictionaryColor = {};
    var _library = ['rgb(240, 239, 179)','rgb(196, 245, 239)', 'rgb(218, 227, 251)','rgb(238, 212, 246)', 'rgb(198, 128, 93)', 'rgb(147, 135, 219)', 'rgb(154, 219, 135)', 'rgb(135, 191, 219)','rgb(92, 152, 237)', 'rgb(237, 92, 174)'];
    Object.keys(spaceCategories).forEach(function(cat, index){
      if (_library[index]) _dictionaryColor[cat] = _library[index];
      else _dictionaryColor[cat] = '#f6f6f6';
    });
    return _dictionaryColor;
  }

  ns.Widgets.BorderCategoryColor = function(category){
    var _dictionary = {
      'music': 'rgb(6, 105, 204)',
      'arts': 'rgb(150, 6, 171)',
      'poetry': 'rgb(173, 166, 44)',
      'expo': 'rgb(72, 131, 13)',
      'street_art': 'rgb(210, 11, 11)',
      'audiovisual': 'rgb(107, 109, 111)',
      'other': 'rgb(215, 78, 15)',
      'workshop': 'rgb(51, 26, 2)'
    }

    return _dictionary[category];
  }



  ns.Widgets.ReorderProgram = function(performances){
    var _compare = function (a,b) {
      if (a.time[0] < b.time[0]) return -1;
      if (a.time[0] > b.time[0]) return 1;
      if (a.time[0] == b.time[0]){
        if (a.time[1] < b.time[1]) return 1;
        if (a.time[1] > b.time[1]) return -1;
      }
      return 0;
    }
    var performancesNotPermanent = [];
    performances.forEach(function(perform){
      if (perform.permanent == 'false') performancesNotPermanent.push(perform); 
    });
    return performancesNotPermanent.sort(_compare);
  }

  ns.Widgets.ReorderProgramCrono = function(performances){
    var _compare = function (a,b) {
      if(a.permanent == 'true' && b.permanent == 'false' && a.date == b.date) return 1;
      if(a.permanent == 'false' && b.permanent == 'true' && a.date == b.date) return -1;
      if (a.time[0] < b.time[0]) return -1;
      if (a.time[0] > b.time[0]) return 1;
      if (a.time[0] == b.time[0]){
        if (a.time[1] < b.time[1]) return -1;
        if (a.time[1] > b.time[1]) return 1;
      }
      return 0;
    }
    return performances.sort(_compare);
  }

  ns.Widgets.TimeManager = function(eventTime){
    var startHour = 0;
    var endHour = 0;
    var endDate = false;
    Object.keys(eventTime).forEach(function(day, index){
      if(day == 'permanent') return;
      if(index == 0){
        startHour = new Date(parseInt(eventTime[day][0][0])).getHours();
        endHour = new Date(parseInt(eventTime[day][1][1])).getHours();
      }
      var start = new Date(parseInt(eventTime[day][0][0]));
      var end = new Date(parseInt(eventTime[day][1][1]));
      var minHour = start.getHours();
      var maxHour = end.getHours();
      if(end.getMinutes() > 0) maxHour += 1;
      if(minHour < startHour) startHour = minHour;
      if(endDate == false){
        if(start.getDate() != end.getDate()){
          endDate == true;
          endHour = maxHour;
        }
        else{if(maxHour > endHour) endHour = maxHour;}
      }
      if(endDate == true){
        if(maxHour > endHour) endHour = maxHour; 
      }
    });
    
    //Amount of hours in our day
    var hourSpan = endHour - startHour;
    if(endHour < startHour) hourSpan = 24 - startHour + endHour;
    var hours = [];
    if(endHour < startHour){
      for (var i = startHour; i < 24; i++) {hours.push(i);}
      for (var i = 0; i <= endHour; i++) {hours.push(i);}
    }
    else{
      for (var i = startHour; i <= endHour; i++) {hours.push(i);}
    }

    Object.keys(eventTime).forEach(function(day, index){
      if(day == 'permanent') return;
      var tempTime = [];
      tempTime[0] = new Date(parseInt(eventTime[day][0][0]));
      tempTime[0].setHours(startHour);
      tempTime[0].setMinutes(0);
      tempTime[0] = tempTime[0].getTime();
      tempTime[1] = new Date(parseInt(eventTime[day][0][0]));
      tempTime[1].setHours(startHour + hourSpan);
      tempTime[1].setMinutes(0);
      tempTime[1] = tempTime[1].getTime();
      eventTime[day] = [tempTime[0], tempTime[1]];
    });

    return{
      hours: hours,
      eventTime: eventTime
    }
  }
}(Pard || {}));