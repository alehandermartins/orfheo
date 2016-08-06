'use strict';

(function(ns){

  ns.Widgets.QRManager = function(qr) {
    var _createdWidget = $('<div>');
    console.log(qr);
    var _img = $.cloudinary.image(qr,{ format: 'png', width: 350 , effect: 'saturation:50' });
    _createdWidget.append(_img);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

}(Pard || {}));
