'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ProfileSectionHeader = function(sectionHeader, profile){
    sectionHeader.empty();

    var _photoContainer = $('<div>');

    if (profile.photos && !(profile.profile_picture)){
      profile.profile_picture = [profile.photos[0]];
      profile.photos.shift();
    }

    var _img;

    if(profile.profile_picture){
      _img = $.cloudinary.image(profile['profile_picture'][0],
      { 
        format: 'jpg', 
        width: 750, 
        height: 220,
        crop: 'fill', 
        effect: 'saturation:50' 
      });
    }

    if (_img && _img[0].naturalHeight){
      _photoContainer.addClass('section-profilePhoto-container').append(_img);
      var _popup
      _img.one('mouseover', function(){
        var _popupImg = $.cloudinary.image(profile['profile_picture'][0],{ format: 'jpg',  width: 750, effect: 'saturation:50' });
        var _popupWidget = $('<div>').addClass('fast reveal full');
        var _outerContainer = $('<div>').addClass('vcenter-outer');
        var _innerContainer = $('<div>').addClass('vcenter-inner');
        var _closeBtn = $('<button>').addClass('close-button small-1 popup-close-btn').attr({type: 'button'});
        _closeBtn.append($('<span>').html('&times;'));
        _popup = new Foundation.Reveal(_popupWidget, {animationIn: 'fade-in', animationOut: 'fade-out'});
        _closeBtn.click(function(){
          _popup.close();
        });
        var _popupContent = $('<div>').addClass('popup-photo-container').append(_popupImg,_closeBtn);
        _innerContainer.append(_popupContent);
        _popupWidget.append(_outerContainer.append(_innerContainer));
        $('body').append(_popupWidget);
      });

      _img.click(function(){
        _popup.open();
      });

      _img.css({cursor:'zoom-in'});
    }
    else _photoContainer.css({'background-color': profile.color}).addClass('section-profilePhoto-container-noPhoto');

    sectionHeader.append(_photoContainer);


    if(profile['name'] != null) sectionHeader.append( $('<div>').addClass('title-profile-section-container').append($('<h3>').text(profile['name']).addClass('text-title-profile-section')));

  }


  ns.Widgets.ModifySectionContent = function (_modifyBtn, profileColor){
    var _createdWidget = $('<div>');

    var _iconColor = Pard.Widgets.IconColor(profileColor).render();

    _modifyBtn.css({color: _iconColor});

    var _triangle = $('<div>').addClass('modify-section-content-button-container');


    var _profileColorRgba = Pard.Widgets.IconColor(profileColor).rgba(0.2);

     _modifyBtn.hover(
      function(){
        _triangle.css({'border-top': '70px solid rgb('+_profileColorRgba[0]+','+_profileColorRgba[1]+','+_profileColorRgba[2]+')'});
      },
      function(){
        _triangle.css({'border-top': '70px solid '+profileColor});
      });

     _createdWidget.append(
      _triangle.css({'border-top': '70px solid '+profileColor}),
      _modifyBtn
    );

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.PrintWebsList = function(personal_webs_obj){

    var _createdWidget = $('<div>');
    var _webArray = Object.keys(personal_webs_obj).map(function(key){return personal_webs_obj[key]});
    var _socialIcons;
    var _personalWebs = $('<div>');
    var _socials = $('<span>');

    _webArray.forEach(function(elem){
      if (elem['provider'] != 'my_web'){
        var _iconSocial = Pard.Widgets.IconManager('icon_social').render().addClass('icon-in-box mySocials-icon-info-box');
        var _iconImg = Pard.Widgets.IconManager(elem['provider']).render();
        _iconImg.addClass('social-icon-fa')
        var _iconA = $('<a>').attr({
          href: elem['url'],
          target: '_blank'
        }).append(_iconImg);
        _socials.append(_iconA);
        _socialIcons = $('<div>').append($('<div>').addClass('information-contact-icon-column').append(_iconSocial), $('<p>').addClass('information-contact-text-column').append(_socials));
      }
      if (elem['provider'] == 'my_web'){
        var _iconLink = Pard.Widgets.IconManager('my_web').render();
        var _url = elem['url'];
        var _link = $('<a>').attr({
          href: elem['url'],
          target: '_blank'
        }).css({
          'word-wrap': 'break-word',
        });
        ['http://', 'https://', 'www.'].forEach(function(string){
          if(_url.indexOf(string) > -1) {
            _url  = _url.substring(string.length);
          }
        })
        _link.text(_url);
       _personalWebs.append($('<div>').append(_iconLink.addClass('information-contact-icon-column'), $('<p>').addClass('information-contact-text-column').append(_link)));
      }
    });

    if (_socialIcons)  _createdWidget.append(_socialIcons);
    if (_personalWebs.html()) _createdWidget.append(_personalWebs);

    return{
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ProgramProfile = function(program, type){
    var _programBoxContainer = $('<div>').addClass('section-box-container');
    var _toEventPageBtn = $('<a>').text('Programación general').attr('href','/event?id='+program.event_id).addClass('toEventPageBtn-profile-page');
    var _titleContainer = $('<div>').addClass('title-box-container');
    _titleContainer.append($('<div>').append($('<span>').addClass('icon-in-box').append(Pard.Widgets.IconManager('current_event').render().css({'font-size':'1.3rem'})), $('<span>').text('Programación'+program.event_name), _toEventPageBtn));
    _programBoxContainer.append(_titleContainer);
    var _programContent = $('<div>').addClass('box-content');
    var _day;
    var _permanentBlock;
    var _showBlock;

    Pard.Widgets.ReorderProgramCrono(program.shows).forEach(function(performance){
      if (!(_day) || _day != moment(performance.time[0], 'x').locale('es').format('dddd DD MMMM')) {
        _dayBlock = $('<div>');
        _showBlock = $('<div>');
        _permanentBlock = $('<div>');
        _day = moment(performance.time[0], 'x').locale('es').format('dddd DD MMMM');
        var _dayTitle = $('<h6>').append(_day).addClass('title-day-profile-programCard').css({'text-transform': 'capitalize'});
        _dayBlock.append(_dayTitle);
        _dayBlock.append(_showBlock,_permanentBlock)
      }
      if (performance.permanent == 'false') _showBlock.append(Pard.Widgets.ProgramCardProfile(performance,type).render());
      else if (performance.permanent == 'true') _permanentBlock.append(Pard.Widgets.ProgramCardProfile(performance,type).render());
      _programContent.append(_dayBlock);
    });
    _programBoxContainer.append(_programContent);

    return _programBoxContainer;

      // VERSION WITH PERMANENT BLOCK SEPARETED
     // var _programBoxContainer = Pard.Widgets.SectionBoxContainer('Programación Benimaclet conFusión festival 2016', Pard.Widgets.IconManager('information').render().addClass('info-icon-title-box')).render();
     //  var _programContent = $('<div>').addClass('box-content');
     //  var _day;
     //  var _permanetDay;
     //  var _showBlock = $('<div>');
     //  var _permanentBlock = $('<div>');
     //  var _permanentObj = {};
     //  var _permanentByDay = {};
     //  Pard.Widgets.ReorderProgramCrono(profile.program).forEach(function(performance){
     //    if( performance.permanent == 'false'){
     //      if (!(_day) || _day != moment(performance.time[0], 'x').locale('es').format('dddd DD MMMM')) {
     //        _day = moment(performance.time[0], 'x').locale('es').format('dddd DD MMMM');
     //        var _dayTitle = $('<h6>').append(_day).addClass('title-day-profile-programCard').css({'text-transform': 'capitalize'});
     //        _showBlock.append(_dayTitle);
     //      }
     //      _showBlock.append(Pard.Widgets.ProgramCardProfile(performance, type).render());
     //    }
     //    else if (performance.permanent == 'true'){
     //      if (_permanentObj[performance.participant_proposal_id]) _permanentObj[performance.participant_proposal_id].push(performance);
     //      else _permanentObj[performance.participant_proposal_id] = [performance];
     //    }
     //  });
     //  for (var proposal in _permanentObj){
     //    var _days = '';
     //    _permanentObj[proposal].forEach(function(expo, index){
     //      if (index == _permanentObj[proposal].length -1 ) _days = _days +'y '+ moment(expo.time[0], 'x').locale('es').format('dddd DD MMMM');
     //      else _days = _days + moment(expo.time[0], 'x').locale('es').format('dddd DD')+' ' ;
     //    })
     //    if (_permanentByDay[_days])  _permanentByDay[_days].push(_permanentObj[proposal][0])
     //    else _permanentByDay[_days] = [(_permanentObj[proposal][0])];
     //  }
     //  for (var days in _permanentByDay){
     //    _permanentBlock.append($('<h6>').append('Permanentes ', days).addClass('title-day-profile-programCard'));
     //    _permanentByDay[days].forEach(function(permanentShow){
     //      _permanentBlock.append(Pard.Widgets.ProgramCardProfile(permanentShow).render());
     //    })
     //  }
     //  _programContent.append(_showBlock,_permanentBlock);
     //  _programBoxContainer.append(_programContent);

  }

  ns.Widgets.PastEventArtist = function(participation, type){

    var _eventName = $('<a>').attr('href','/event?id='+participation.event_id).text(participation.event_name).addClass('eventName-pastEventBlock');
    var _eventProposals = $('<ul>').css({'list-style-type':'none','margin-left':'0.5rem'});
    var _permanentShows = {};
    participation.shows.forEach(function(show, index){
      var _host;
      if (show.host_id.indexOf('own') >-1) _host = $('<span>').text(show.host_name).css('text-decoration','underline');
      else _host = $('<a>').attr('href','/profile?id='+show.host_id).text(show.host_name);
      if(show.permanent == 'true'){
        if (_permanentShows[show.participant_proposal_id]) _permanentShows[show.participant_proposal_id].push(show);
        else _permanentShows[show.participant_proposal_id] = [show];
      }
      else if (index < 1 || show.participant_proposal_id != participation.shows[index-1].participant_proposal_id || show.date != participation.shows[index-1].date){
        var _date = moment(new Date(show.date)).locale('es').format('DD MMMM YYYY');
        var _day = $('<span>').text(_date+':');
        var _title = $('<span>').text(show.title).addClass('title-pastEventBlock');
        var _category = Pard.Widgets.IconManager(show.participant_category).render().addClass('iconCat-pastEventBlock');
        var _place = $('<span>').append(Pard.Widgets.IconManager('space').render().addClass('iconProfile-pastEventBlock'),_host);
        var _proposal = $('<li>').append(_day,' ',_category, _title, ' / ',_place).addClass('proposal-pastEventBlock');
        _eventProposals.append(_proposal);
      }
    });

    if (!($.isEmptyObject(_permanentShows))){
      for (var instalation in _permanentShows){
        var _showArray = _permanentShows[instalation];
        var show = _showArray[0];
        var _host;
        if (show.host_id.indexOf('own') >-1) _host = $('<span>').text(show.host_name).css('text-decoration','underline');
        else _host = $('<a>').attr('href','/profile?id='+show.host_id).text(show.host_name);
        var _init_date = moment(new Date(_showArray[0].date)).locale('es').format('DD MMMM YYYY');
        var _day = $('<span>').append(_init_date);
        if (_showArray.length>1) {
          var _final_date = moment(new Date(_showArray[_showArray.length -1].date)).locale('es').format('DD MMMM YYYY');
          _day.text(_init_date+' - '+_final_date+':');
        }
        else{
          _day.text(_init_date+':')
        }
        var _title = $('<span>').text(show.title).addClass('title-pastEventBlock');
        var _category = Pard.Widgets.IconManager(show.participant_category).render().addClass('iconCat-pastEventBlock');
        var _place = $('<span>').append(Pard.Widgets.IconManager('space').render().addClass('iconProfile-pastEventBlock'), _host);
        var _proposal = $('<li>').append(_day,' ',_category, _title, ' / ',_place).addClass('proposal-pastEventBlock');
        _eventProposals.append(_proposal);
      }
    }

    var _event = $('<div>').append(_eventName,_eventProposals);

    return _event;

  }

  ns.Widgets.PastEventSpace = function(participation){

    var _eventName = $('<a>').attr('href','/event?id='+participation.event_id).text(participation.event_name).addClass('eventName-pastEventBlock');
    var _eventProposals = $('<ul>').css({'list-style-type':'none','margin-left':'0.5rem'});
    var _permanentShows = [];
    var _artistByDay = {};

    participation.shows.forEach(function(show, index){
      if(show.permanent == 'true'){
        _permanentShows.push(show);
      }
      else {
        if (_artistByDay[show.date]) _artistByDay[show.date].push(show);
        else _artistByDay[show.date] = [show];
      }
    });

    if (!($.isEmptyObject(_artistByDay))){
      for (var day in _artistByDay){
        var _artists = $('<span>').append(Pard.Widgets.IconManager('artist').render().addClass('iconProfile-pastEventBlock'));
        var _date = moment(new Date(day)).locale('es').format('DD MMMM YYYY');
        var _day = $('<span>').text(_date+':');
        var _proposal = $('<li>').append(_day,' ',_artists).addClass('proposal-pastEventBlock');
        _eventProposals.append(_proposal);
        _artistByDay[day].forEach(function(show, index){
          var _artistName;
          if (show.participant_id.indexOf('own') >-1) _artistName = $('<span>').text(show.participant_name).css('text-decoration','underline');
          else _artistName = $('<a>').attr('href','/profile?id='+show.participant_id).text(show.participant_name);
          if (index < 1){
            _artists.append(_artistName);
          }
          else if (show.participant_id != participation.shows[index-1].participant_id){
            _artists.append(' - ', _artistName);
          }
        })
      }
    }

    if (_permanentShows.length){
      var _participantsArray = [];
      var _artists = $('<span>').append(Pard.Widgets.IconManager('artist').render().addClass('iconProfile-pastEventBlock'));
      var _id = new Date(_permanentShows[0].date);
      var _fd = new Date(_permanentShows[_permanentShows.length -1].date);
      var _day = $('<span>');
      var _proposal = $('<li>').append(_day,' ',_artists).addClass('proposal-pastEventBlock');
      _eventProposals.append(_proposal);
      _permanentShows.forEach(function(show, index){
        var _nd = new Date(show.date);
        if(_nd.getTime()<_id.getTime()) _id = _nd;
        else if(_nd.getTime()>_fd.getTime()) _fd = _nd;
        var _artistName;
        if (show.participant_id.indexOf('own') >-1) _artistName = $('<span>').text(show.participant_name).css('text-decoration','underline');
        else _artistName = $('<a>').attr('href','/profile?id='+show.participant_id).text(show.participant_name);
        if (index < 1){
            _artists.append(_artistName);
            _participantsArray.push(show.participant_id);
        }
        else if ($.inArray(show.participant_id, _participantsArray)<0){
          _artists.append(' - ', _artistName);
          _participantsArray.push(show.participant_id);
        }
      })
      if (_id.getTime() == _fd.getTime()) _day.append(moment(_id).locale('es').format('DD MMMM YYYY'),':')
      else _day.append(moment(_id).locale('es').format('DD MMMM YYYY'),' - ',moment(_fd).locale('es').format('DD MMMM YYYY'),':');
    }

    var _event = $('<div>').append(_eventName,_eventProposals);

    return _event;

  }

  ns.Widgets.ProgramCardProfile = function(performance, type){

    var _progCard = $('<div>').addClass('program-card-container-profile');
    var _time = $('<div>').append(moment(performance.time[0], 'x').locale('es').format('HH:mm') + ' - ' + moment(performance.time[1], 'x').format('HH:mm')).css('text-transform','capitalize');
    var _participantCatIcon = Pard.Widgets.IconManager(performance.participant_category).render().addClass('participant-category-icon');
    var _orderNum = performance.order +1;

    var _title = $('<span>').text(performance.title).addClass('title-program-card');
    var _host = $('<a>').text(performance.host_name);
    if(performance.host_id.search('own')<0) _host.addClass('host-program-card').attr({'href': '/profile?id=' + performance.host_id});
    else _host.addClass('host-program-card-own').attr({'href': '#'});
    var _participant = $('<a>').text(performance.participant_name);
    if (performance.participant_id.search('own')<0) _participant.addClass('participant-program-card').attr({'href': '/profile?id=' + performance.participant_id});
    else _participant.addClass('participant-program-card-own').attr({'href': '#'});
    var _children = '';
    if (performance.children == 'true') _children = $('<div>').append(Pard.Widgets.IconManager('children').render().addClass('participant- catagory-icon icon-children-program'), 'Infantil');
    var _shortDescription = performance.short_description;

    var _titleRow = $('<div>');
    var _descriptionRow = $('<div>').addClass('descriptionRow-profile-programCard');
    var _hostRow = $('<div>');
    var _participantRow = $('<div>');
    _titleRow.append(_time, _participantCatIcon, Pard.Widgets.Dictionary(performance.participant_category).render(), _children);
    _descriptionRow.append($('<p>').append( _title), $('<p>').append(_shortDescription).addClass('short-description-program-card'));
    _hostRow.append($('<p>').append(Pard.Widgets.IconManager('space').render().addClass('participant-category-icon'), _host));
    _participantRow.append($('<p>').append(Pard.Widgets.IconManager('artist').render().addClass('participant-category-icon'), _participant));
    var _col1 = $('<div>').addClass('col1-program-card-profile');
    var _col2 = $('<div>').addClass('col2-program-card-profile');
    _col1.append(_titleRow);
    _col2.append(_descriptionRow);
    _progCard.append(_col1, _col2);
    if(type == 'artist') _progCard.append(_hostRow);
    else if(type == 'space') _progCard.append(_participantRow);


    return {
      render: function(){
        return _progCard;
      }
    }
  }



}(Pard || {}));

