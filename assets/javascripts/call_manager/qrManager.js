'use strict';

(function(ns){

  ns.qrManager = function(qr) {
    var _createdWidget = $('<div>');
    var _img = $.cloudinary.image(qr,{ format: 'png', width: 350 , effect: 'saturation:50' });
    _createdWidget.append(_img);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

}(Pard || {}));
