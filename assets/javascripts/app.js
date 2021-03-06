'use strict';

Pard.CachedProfiles = [];
Pard.UserStatus = {};
Pard.CachedEvent = [];
Pard.CachedProgram = [];
Pard.CachedProposals = [];

Pard.ProfileManager = {
  getProfile: function(profile_id){
    var profiles = Pard.CachedProfiles;
    var _profile ={};
    profiles.forEach(function(profile){
      if(profile.profile_id == profile_id) _profile = profile;
    });
    return _profile;
  },
  addProduction: function(profile_id, production){
    var profiles = Pard.CachedProfiles;
    profiles.some(function(profile){
      if(profile.profile_id == profile_id) {
        if (profile.productions) profile.productions.push(production);
        else profile['productions'] = [production];
      }
    });
  },
  getProduction: function(production_id){
    var profiles =  Pard.CachedProfiles;
    var _production = {};
    profiles.forEach(function(profile){
      if('productions' in profile){
        profile.productions.forEach(function(production){
          if(production.production_id == production_id) _production = production;
        });
      }
    });
    return _production;
  },
  getProfileId: function(production_id){
    var _profile_id = '';
    Pard.CachedProfiles.forEach(function(profile){
      if('productions' in profile){
        profile.productions.forEach(function(production){
          if(production.production_id == production_id) _profile_id = profile.profile_id;
        });
      }
    });
    return _profile_id;
  },
  getUserId: function(){
    return Pard.CachedProfiles[0].user_id;
  },
  modifyProduction: function(production){
    Pard.CachedProfiles.forEach(function(profile){
      if('productions' in profile){
        profile.productions.forEach(function(prod, index){
          if(prod.production_id == production.production_id){
            for(var field in production){
              prod[field] = production[field];
            }
          }
        });
      }
    });
  }
}

Pard.ProposalsManager = {
  modifyProposals: function(programs){
    programs.forEach(function(program){
      Pard.CachedProposals.some(function(proposal){
        if(proposal['proposal_id'] == program['proposal_id']){
            proposal['program'] = program['program'];
            return true;
        }
      });
    });
  }
}

Pard.Welcome = function(){

  Pard.UserStatus['status'] = 'outsider';

  var _header = Pard.Widgets.NavHeader();
  var _main = Pard.Widgets.MainWelcomePage();

  var _footer = Pard.Widgets.Footer();
  var _whole = $('<div>').addClass('whole-container');

  _whole.append(_header.render(), _main.render().addClass('outsider-main'), _footer.render().addClass('footer-outsider'));

  $('body').append(_whole);

  $(document).ready(function(){
    $(document).foundation();
    $(document).on('closed.zf.reveal', '[data-reveal]', function() {
      if (!($('.reveal[aria-hidden="false"]').length)){
        $('html').removeClass('overflowHidden');
      }
    });
    $(document).on('open.zf.reveal', function(){
      $('html').addClass('overflowHidden');
    });
  });
}


Pard.Users = function(profiles){

  Pard.UserStatus['status'] = 'owner';
  Pard.CachedProfiles = profiles;

  var _header = Pard.Widgets.NavHeader();
  var _main = Pard.Widgets.MainUserPage();

  var _footer = Pard.Widgets.Footer();
  var _whole = $('<div>').addClass('whole-container');

  _whole.append(_header.render(), _main.render(), _footer.render());

  $('body').append(_whole);

  $(document).ready(function(){
    $(document).foundation();
    $(document).on('closed.zf.reveal', '[data-reveal]', function() {
      if (!($('.reveal[aria-hidden="false"]').length)){
        $('html').removeClass('overflowHidden');
      }
    });
    $(document).on('open.zf.reveal', function(){
      $('html').addClass('overflowHidden');
    });
  });
}


Pard.Profile = function(profiles, status){
  Pard.CachedProfiles  = profiles;
  Pard.UserStatus['status'] = status;

  var _whole = $('<div>').addClass('whole-container');

  var _display = function(){
    var _footer = Pard.Widgets.Footer();

    if(status == 'visitor' || status == 'owner')
      var _header = Pard.Widgets.InsideHeader(true);
    else
      var _header = Pard.Widgets.LoginHeader(true);

    var _main = Pard.Widgets.ProfileMainLayout().render().attr({id: 'main-profile-page'});
    _whole.append(_header.render(), _main,  _footer.render());
    $(document).ready(function(){
      $(document).foundation();
      $(document).tooltip({tooltipClass: 'orfheo-tooltip', show:{delay:800}, position:{collision:'fit', my: 'left top+5px'}});
      $(document).on('closed.zf.reveal', '[data-reveal]', function() {
        if (!($('.reveal[aria-hidden="false"]').length)){
          $('html').removeClass('overflowHidden');
        }
      });
      $(document).on('open.zf.reveal', function(){
        $('html').addClass('overflowHidden');
      });
    });
  }

  Pard.Widgets.MultimediaScripts(_display);
  $('body').append(_whole);
};

Pard.EventManager = function(event_id){
  var spinner = new Spinner();
    spinner.spin();
    $('body').append(spinner.el);

  Pard.Backend.eventManager(event_id, function(data){
    var the_event = data.the_event;
    var forms = data.forms;

    var _texts = the_event.texts[Pard.Options.language()]; 
    if(!_texts) {
      _texts = the_event.texts[Object.keys(the_event.texts)[0]];
    }
    Pard.UserInfo['texts'] = _texts;
    var _whole = $('<div>').addClass('whole-container');
    var _header = Pard.Widgets.InsideHeader(false);
    var _main = Pard.Widgets.Manager(the_event, forms);
    var _footer = Pard.Widgets.Footer();

    $(_whole).append(_header.render(), _main.render(), _footer.render());

    $(window).ready(function(){      
      $('body').append(_whole);
      $(document).foundation();
      $(document).tooltip({tooltipClass: 'orfheo-tooltip', show:{delay:800}, position:{collision:'fit', my: 'left top+5px'}});
      $(document).on('closed.zf.reveal', '[data-reveal]', function() {
        if (!($('.reveal[aria-hidden="false"]').length)){
          $('html').removeClass('overflowHidden');
        }
      });
      $(document).on('open.zf.reveal', function(){
        $('html').addClass('overflowHidden');
      });
      Pard.Bus.trigger('setPublishStatus');
      var _arraySections = ['#proposals','#program','#utils'];
      var _uri = new URI(document.location);
      if ($.inArray(_uri.hash(), _arraySections)>-1){
         $(_uri.hash()+'Btn').trigger('click');
        // setTimeout(function(){
        //   console.log($(_uri.hash()+'Btn'))
         
        // },1000)
        
      }
      spinner.stop();
    });
  });
}


Pard.Event = function(the_event, status){
  if (the_event.slug){
    var _dir = /event/+the_event.slug;
    window.history.replaceState( {} , the_event.slug, _dir );
  }
  Pard.UserStatus['status'] = status;
  Pard.CachedProgram = the_event.program;
  Pard.CachedEvent = the_event;
  var _texts = the_event.texts[Pard.Options.language()]; 
  if(!_texts) {
    _texts = the_event.texts[Object.keys(the_event.texts)[0]];
  }
  Pard.UserInfo['texts'] = _texts;

  var _whole = $('<div>').addClass('whole-container');

  var _footer = Pard.Widgets.Footer();
  if(status == 'visitor' || status == 'owner')
    var _header = Pard.Widgets.InsideHeader(true);
  else{
    var _header = Pard.Widgets.LoginHeader(true);
    _header.positionRelative();
  }
  var _main = Pard.Widgets.MainOffCanvasLayout(Pard.Widgets.EventAside, Pard.Widgets.EventSection);
  _whole.append(
    _header.render(), 
    _main.render().removeClass('outsider-main').addClass('inside-main').css('background','#f6f6f6'),
    _footer.render()
  );

  $('body').append(_whole);

  $(document).ready(function(){
    $(document).foundation();
    $(document).tooltip({tooltipClass: 'orfheo-tooltip', show:{delay:800}, position:{collision:'fit', my: 'left top+5px'}});
    $(document).on('closed.zf.reveal', '[data-reveal]', function() {
      if (!($('.reveal[aria-hidden="false"]').length)){
        $('html').removeClass('overflowHidden');
      }
    });
    $(document).on('open.zf.reveal', function(){
      $('html').addClass('overflowHidden');
    });
  });
}

Pard.Services = function(status){

  var _main = Pard.Widgets.MainServicesPage();
  var _footer = Pard.Widgets.Footer().render();

  Pard.UserStatus['status'] = status;
  if(status == 'outsider'){ 
    var _header = Pard.Widgets.LoginHeader();
    _main.addClass('outsider-main');
    _footer.css({
      position:'fixed',
      bottom:'0'
    });
  }
  else{
    var _header = Pard.Widgets.InsideHeader(false);
  }

  var _whole = $('<div>').addClass('whole-container');

  _whole.append(_header.render(), _main, _footer);

  $('body').append(_whole);

  $(document).ready(function(){
    $(document).foundation();
    $(document).on('closed.zf.reveal', '[data-reveal]', function() {
      if (!($('.reveal[aria-hidden="false"]').length)){
        $('html').removeClass('overflowHidden');
      }
    });
    $(document).on('open.zf.reveal', function(){
      $('html').addClass('overflowHidden');
    });
  });

}
