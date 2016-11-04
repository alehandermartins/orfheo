'use strict';

Pard.CachedProfiles = [];
Pard.UserStatus = {};
Pard.CachedEvent = [];
Pard.CachedProgram = [];

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


  var _header = Pard.Widgets.LoginHeader();
  var _main = Pard.Widgets.MainLayout(Pard.Widgets.LoginAside, Pard.Widgets.LoginSection);

  var _footer = Pard.Widgets.Footer();
  var _whole = $('<div>').addClass('whole-container');
  
  _whole.append(_header.render(), _main.render().addClass('outsider-main'), _footer.render().addClass('footer-outsider'));
  
  $('body').append(_whole);

  $(document).ready(function(){
    $(document).foundation();
  });
}

Pard.Users = function(profiles){

  console.log(profiles);
  Pard.CachedProfiles = profiles;
  
  var _whole = $('<div>').addClass('whole-container');
  var _header = Pard.Widgets.InsideHeader(Pard.Widgets.UserDropdownMenu().render());
  var _main = Pard.Widgets.MainLayout(Pard.Widgets.UserAside, Pard.Widgets.UserSection);
  var _footer = Pard.Widgets.Footer();

  $(_whole).append(_header.render(), _main.render().addClass('main-welcome-page'), _footer.render());

  // If no profile trigger popup CreateProfile (do not delete!)
  // $(document).ready( function(){
  //   if (profiles.length == 0) Pard.Widgets.CreateProfile().render().trigger('click');
  // }); 

  $('body').append(_whole);

  $(document).ready(function(){$(document).foundation()});
}

Pard.Profile = function(profiles){
  Pard.CachedProfiles  = profiles;
  Pard.UserStatus['status'] = 'owner';

  var _whole = $('<div>').addClass('whole-container');

  var _display = function(){
    var _footer = Pard.Widgets.Footer();      
    var _header = Pard.Widgets.InsideHeader(Pard.Widgets.ProfileDropdownMenu().render());
    var _main = Pard.Widgets.ProfileMainLayout().render().attr({id: 'main-profile-page'});
    _whole.append(_header.render(), _main,  _footer.render());
    $(document).ready(function(){$(document).foundation()});
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
    $(document).ready(function(){$(document).foundation()});
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
     $(document).ready(function(){$(document).foundation()});
  } 

  Pard.Widgets.MultimediaScripts(_display);
  $('body').append(_whole);
}

Pard.EventManager = function(the_event){

  $(window).ready(function(){
    $('body').append(_whole);
    $(document).foundation();
  });

  Pard.CachedEvent = the_event;

  var _whole = $('<div>').addClass('whole-container');
  var _header = Pard.Widgets.InsideHeader(Pard.Widgets.UserDropdownMenu().render());

  var _main = Pard.Widgets.CallMainLayout(the_event);

  var _footer = Pard.Widgets.Footer();
     

  $(_whole).append(_header.render(), _main.render(), _footer.render());

}


Pard.Event = function(the_event, status){
  console.log(the_event);
  console.log(status);
  //Address 
  //http://localhost:3000/event?id=a5bc4203-9379-4de0-856a-55e1e5f3fac6
  Pard.UserStatus['status'] = status;

  Pard.CachedProgram = the_event.program;
  Pard.CachedEvent = the_event;
  var _whole = $('<div>').addClass('whole-container');

  var _footer = Pard.Widgets.Footer();
  if(status == 'visitor') var _header = Pard.Widgets.InsideHeader(Pard.Widgets.ProfileDropdownMenu().render());
  else{var _header = Pard.Widgets.LoginHeader();}
  var _main = Pard.Widgets.MainLayout(Pard.Widgets.EventAside, Pard.Widgets.EventSection);
  _whole.append(_header.render().removeClass('outsider-header'), _main.render().addClass('main-welcome-page'), _footer.render().removeClass('footer-outsider'));


  //CROWDFUNDING MESSAGE
  // var _closeButton = $('<button>').addClass('close-button closeBtn-browser-alert').attr({'type':'button','data-close':''}).append($('<span>').html('&times;').attr('aria-hidden','true'));
  // var _alertText = $('<p>').html('Este evento es gratuito y nadie gana nada, pero sí que tiene gastos y se mantiene solo por donaciones. La tuya también es necesaria: <a href="https://www.goteo.org/project/benimaclet-confusion-festival", target="_blank"> aporta a nuestro crowdfunding</a> ').addClass('text-browser-alert');
  // var _alertContainer = $('<div>').append($('<div>').append(_closeButton,_alertText).addClass('text-button-container-browser-alert')).addClass('crowdfunding-alert callout').attr('data-closable','');
  // $(_whole).prepend(_alertContainer);

  $('body').append(_whole);
  $(document).ready(function(){$(document).foundation()});

}

Pard.Chat = function(){

  var scheme   = "ws://";
  var uri      = scheme + window.document.location.host + "?id=a5bc4203-9379-4de0-856a-55e1e5f3fac6";
  var ws       = new WebSocket(uri);

  var _inputText = $('<input>').attr({'type': 'text', 'placeholder': 'mensaje'});
  var _sendButton = Pard.Widgets.Button('Enviar', function(event) {
    event.preventDefault();
    //var handle = $("#input-handle")[0].value;
    var text   = _inputText.val();
    ws.send(JSON.stringify(text));
  });  
  var _chatText = $('<div>');

  ws.onopen = function()
    {
      // Web Socket is connected, send data using send()
      ws.send("Message to send");
      alert("Message is sent...");
    };

  ws.onmessage = function(message) {
    //var data = JSON.parse(message.data);
    console.log(message);
    //_chatText.append("<div class='panel panel-default'><div class='panel-heading'>" + message.data + "</div><div class='panel-body'>" + message.data + "</div></div>");
    _chatText.append("<div class='panel-body'>" + message.data + "</div></div>");
    _chatText.stop().animate({
      scrollTop: _chatText[0].scrollHeight
    }, 800);
  };

  var _chatSection = function (content) {

    content.empty();

    $(document).ready(function(){$('#main-welcome-page').addClass('main-welcome-page')});

    var _content = content.addClass('welcome-page-section');

    _content.append(_inputText, _sendButton.render(), _chatText);

    return{
      render: function(){
        return _content;
      }
    }
  }

  var _main = Pard.Widgets.MainLayout(Pard.Widgets.LoginAside, _chatSection);
  var _whole = $('<div>').addClass('whole-container');

  var _header = Pard.Widgets.LoginHeader();
  _whole.append(_header.render(), _main.render().addClass('outsider-main'));

  $('body').append(_whole);
  $(document).ready(function(){$(document).foundation()});

}
