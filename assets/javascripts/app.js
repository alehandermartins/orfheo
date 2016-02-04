'use strict';

Pard.Welcome = function(){

	var _header = document.createElement('header');
	$('body').prepend(_header);
	var _login = Pard.Widgets.Login();
	$('header').append(_login);


	var _register = Pard.Widgets.Register();
	$('#section_layout').append(_register);

};
