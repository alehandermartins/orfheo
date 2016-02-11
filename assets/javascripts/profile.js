(function(ns){
  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ArtistProfile = function(profile){
    var _createdWidget = $('<div>');

    var _name = $('<div>').text(profile.name);

    _createdWidget.append(_name);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

}(Pard || {}));
