(function(ns){
	ns.Widgets = ns.Widgets || {};

	ns.Widgets.Login = function(){
		var _fieldset = $('<fieldset>');
		var _emailLabel = $('<label>').text('Email');
		var _passwdLabel = $('<label>').text('Contraseña');

		var _inputEmail1 = $('<input>').attr({type:'email', name:'email', placeholder:'Tu email', required:''});

		var _inputEmail2 = $('<input>').attr({type:'email', name:'email', placeholder:'Confirma tu email', required:''});
		var _inputPasswd = $('<input>').attr({type:'password', name:'passwd', placeholder:'Escoge una contraseña', required:''});
		var _submit = $('<input>').attr({type:'submit',name:'submit',value:'join the community'});

		function CheckEmail(_obj){
			// var _emailDot=[];
			// var _emailArray =_obj.val().split('@');
			// if (_emailArray.length === 2){
			// var _emailDot = _emailArray[1].split('.')};
			// if(_emailDot.length === 2){
			// 	_obj.removeClass('warning');}
			// 	else{_obj.addClass('warning');};
		};


		function CheckEqualValue(_obj1,_obj2){
			if(_obj1.val() !== _obj2.val()){
				_obj2.addClass('warning');
			}
			else{_obj2.removeClass('warning');}
		};

		_inputEmail1.on("change",function(){
			CheckEmail(_inputEmail1);
			if (_inputEmail2.val()){CheckEqualValue(_inputEmail1,_inputEmail2)}
			});

		_inputEmail2.on("change",function(){
			CheckEmail(_inputEmail2);
			CheckEqualValue(_inputEmail1,_inputEmail2)});

		_inputPasswd.on('change',function(){
			if($(this).val().length<=8){
			$(this).addClass('warning');}
		else{$(this).removeClass('warning');}
		});

		var _email = _emailLabel.append(_inputEmail1, _inputEmail2);
		var _passwd = _passwdLabel.append(_inputPasswd);

 		_fieldset =_fieldset.append(_email,_passwd);
 		var _loginForm = $('<form>').append(_fieldset,_submit);

 		_loginForm.on('submit',function(event){
			if(_inputEmail1.val() === _inputEmail2.val() && _inputEmail1.val() && _inputEmail2.val() && _inputPasswd.val().length >= 8){
				Pard.Backend.register(_inputEmail1.val(), _inputPasswd.val(), alert('Te hemos enviado un correo'));
				}
			else{
				event.preventDefault();

				alert('Controla los campos')}
			});

		return _loginForm;
	}

}(Pard || {}));

