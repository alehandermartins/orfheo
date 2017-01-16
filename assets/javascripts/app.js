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

  var _header = Pard.Widgets.NavLoginHeader();
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

  var _header = Pard.Widgets.NavLoginHeader();
  var _main = Pard.Widgets.MainUserPage();

  var _footer = Pard.Widgets.Footer();
  var _whole = $('<div>').addClass('whole-container');

  _whole.append(_header.render(), _main.render().addClass('outsider-main'), _footer.render());

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


// Pard.Users = function(profiles){

//   console.log(profiles);
//   Pard.CachedProfiles = profiles;
//   Pard.UserStatus['status'] = 'owner';

//   var _whole = $('<div>').addClass('whole-container');
//   var _header = Pard.Widgets.InsideHeader(Pard.Widgets.UserDropdownMenu().render());
//   var _main = Pard.Widgets.MainOffCanvasLayout(Pard.Widgets.UserAside, Pard.Widgets.UserSection);
//   var _footer = Pard.Widgets.Footer();

//   $(_whole).append(_header.render(), _main.render().addClass('main-welcome-page'), _footer.render());

//   $('body').append(_whole);

//   $(document).ready(function(){
//     $(document).foundation();
//     $(document).on('closed.zf.reveal', '[data-reveal]', function() {
//       if (!($('.reveal[aria-hidden="false"]').length)){
//         $('html').removeClass('overflowHidden');
//       }
//     });
//     $(document).on('open.zf.reveal', function(){
//       $('html').addClass('overflowHidden');
//     });
//   });
// }

Pard.Profile = function(profiles){
  Pard.CachedProfiles  = profiles;
  Pard.UserStatus['status'] = 'owner';

  var _whole = $('<div>').addClass('whole-container');

  var _display = function(){
    var _footer = Pard.Widgets.Footer();
    var _header = Pard.Widgets.InsideHeader(Pard.Widgets.ProfileDropdownMenu().render());
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


Pard.Visitor = function(profiles){

  Pard.CachedProfiles  = profiles;
  Pard.UserStatus['status'] = 'visitor';

  var _whole = $('<div>').addClass('whole-container');

  var _display = function(){
    var _footer = Pard.Widgets.Footer();
    var _header = Pard.Widgets.InsideHeader(Pard.Widgets.ProfileDropdownMenu().render());
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


Pard.Outsider = function(profiles){

  Pard.CachedProfiles  = profiles;
  Pard.UserStatus['status'] = 'outsider';

  var _whole = $('<div>').addClass('whole-container');

  var _display = function(){
    var _footer = Pard.Widgets.Footer();
    var _header = Pard.Widgets.LoginHeader();
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
}

Pard.EventManager = function(the_event, forms){

  console.log(the_event);

  var _whole = $('<div>').addClass('whole-container');
  var _header = Pard.Widgets.InsideHeader(Pard.Widgets.UserDropdownMenu().render());
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
  });

}


Pard.Event = function(the_event, status){
  console.log(the_event);

  Pard.UserStatus['status'] = status;

  Pard.CachedProgram = the_event.program;
  Pard.CachedEvent = the_event;
  var _whole = $('<div>').addClass('whole-container');

  var _footer = Pard.Widgets.Footer();
  if(status == 'visitor' || status == 'owner') var _header = Pard.Widgets.InsideHeader(Pard.Widgets.ProfileDropdownMenu().render());
  else{var _header = Pard.Widgets.LoginHeader();}
  var _main = Pard.Widgets.MainOffCanvasLayout(Pard.Widgets.EventAside, Pard.Widgets.EventSection);
  _whole.append(_header.render().removeClass('outsider-header'), _main.render().addClass('main-welcome-page'), _footer.render().removeClass('footer-outsider'));


  //CROWDFUNDING MESSAGE
  // var _closeButton = $('<button>').addClass('close-button closeBtn-browser-alert').attr({'type':'button','data-close':''}).append($('<span>').html('&times;').attr('aria-hidden','true'));
  // var _alertText = $('<p>').html('Este evento es gratuito y nadie gana nada, pero sí que tiene gastos y se mantiene solo por donaciones. La tuya también es necesaria: <a href="https://www.goteo.org/project/benimaclet-confusion-festival", target="_blank"> aporta a nuestro crowdfunding</a> ').addClass('text-browser-alert');
  // var _alertContainer = $('<div>').append($('<div>').append(_closeButton,_alertText).addClass('text-button-container-browser-alert')).addClass('crowdfunding-alert callout').attr('data-closable','');
  // $(_whole).prepend(_alertContainer);

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
