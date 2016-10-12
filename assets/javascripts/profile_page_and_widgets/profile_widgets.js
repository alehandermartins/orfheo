'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ProfileSectionHeader = function(sectionHeader, profile){
    sectionHeader.empty();

    var _photoContainer = $('<div>');

    if(profile.profile_picture){
      var _img = $.cloudinary.image(profile['profile_picture'][0],
      { format: 'jpg', width: 750, height: 220,
      crop: 'fill', effect: 'saturation:50' });
      _photoContainer.addClass('section-profilePhoto-container').append(_img);
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
       _personalWebs.append($('<div>').addClass('information-contact-icon-column').append(_iconLink), $('<p>').addClass('information-contact-text-column').append(_link));        
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
    var _toEventPageBtn = $('<a>').text('Programación general').attr('href','/event?id=a5bc4203-9379-4de0-856a-55e1e5f3fac6').addClass('toEventPageBtn-profile-page');
    var _titleContainer = $('<div>').addClass('title-box-container');
    _titleContainer.append($('<div>').append($('<span>').addClass('icon-in-box').append(Pard.Widgets.IconManager('current_event').render().css({'font-size':'1.3rem'})), $('<span>').text('Programación Benimaclet conFusión festival III ed.'), _toEventPageBtn));
    _programBoxContainer.append(_titleContainer);
    var _programContent = $('<div>').addClass('box-content');
    var _day;
    var _permanentBlock;
    var _showBlock;
    Pard.Widgets.ReorderProgramCrono(program).forEach(function(performance){
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

