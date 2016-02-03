'use strict';

Pard.Welcome = function(){
	//var header=document.createElement('header');
	//$('body').prepend(header);
	var _header = Pard.Widgets.Login();
	$('#section_layout').append(_header);

	// $('header').load("header.html");
	// $('.project_container').html('<h1>New project</h1>');
	// var linkHeader=document.createElement('p');
	// linkHeader.setAttribute("id","link_to_header");
	// linkHeader.innerHTML="click on this <a>link</a>";
	// $('section').prepend(linkHeader);
	// $('#link_to_header a').attr('href','header.html');
};


Pard.Login=function(){
	var newElement='<h3>Log_in</h3>';
$('.project_container').before(newElement);
};
