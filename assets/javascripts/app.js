'use strict';

Pard.Welcome = function(){
  var _createdWidget = Pard.Widgets.Registration().render();
  $("#section_layout").append(_createdWidget);
};
