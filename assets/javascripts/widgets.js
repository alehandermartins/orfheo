(function(ns){
	ns.Widgets = ns.Widgets || {};

	ns.Widgets.Register = function(){


		var _emailLabel = $('<label>').text('Email');
		var _passwdLabel = $('<label>').text('Contraseña');

		var _inputEmail1 = $('<input>').attr({type:'email', id:'emailRegister1', placeholder:'Tu email', required:''});

		var _inputEmail2 = $('<input>').attr({type:'email', id:'emailRegister2', placeholder:'Confirma tu email', required:''});
		var _inputPasswd = $('<input>').attr({type:'password', id:'passwdRegister', placeholder:'Mínimo 8 caracteres', required:''});
		var _submit = $('<input>').attr({type:'submit',id:'submitRegister',value:'join the community'});

		
		function CheckEmail(_obj){
			var _emailDot=[];
			var _emailArray =_obj.val().split('@');
			if (_emailArray.length === 2){
			var _emailDot = _emailArray[1].split('.')};
			if(_emailDot.length === 2){
		 		_obj.removeClass('warning');
		 		return true;}
				else{
					_obj.addClass('warning');
					return false;	};
		};


		function CheckEqualValue(_obj1,_obj2){
			if(_obj1.val() !== _obj2.val()){
				_obj2.addClass('warning');
				return false;
			}
			else{_obj2.removeClass('warning');
			return true;}
		};

		function CheckPasswd(_obj){
			if(_obj.val().length < 8){
			_obj.addClass('warning');
			return false}
		else{_obj.removeClass('warning');
			 return true;	}
		};

		_inputEmail1.on("change",function(){
			if($(this).val()){
			CheckEmail($(this));
			if (_inputEmail2.val()){CheckEqualValue($(this),_inputEmail2);}
		}
		else{
			$(this).removeClass('warning');
			}
		});

		_inputEmail2.on("change",function(){
			if($(this).val()){
			CheckEmail($(this));
			if(CheckEmail($(this))){CheckEqualValue(_inputEmail1,$(this));}}
			else{$(this).removeClass('warning');}
		});

		_inputPasswd.on('change',function(){
			if($(this).val()){CheckPasswd($(this));}
			else{$(this).removeClass('warning');}
		});

		var _email = _emailLabel.append(_inputEmail1, _inputEmail2);
		var _passwd = _passwdLabel.append(_inputPasswd);

 		_fieldset =$('<fieldset>').append(_email,_passwd);
 		var _registerForm = $('<form>').attr('id', 'registerForm');
 		_registerForm = _registerForm.append(_fieldset,_submit);

 		_registerForm.on('submit',function(event){
			if(CheckEqualValue(_inputEmail1,_inputEmail2) && CheckEmail(_inputEmail1) &&  CheckPasswd(_inputPasswd)){
				Pard.Backend.register(_inputEmail1.val(), _inputPasswd.val(), function(data){
					console.log(data.status);
					if (data.status === "success"){
					alert('Te hemos enviado un correo.')}
					else{alert('Usuario ya existente.')};
				});
			}
			else {
				event.preventDefault();
				var text = '';
				if (!CheckEmail(_inputEmail1)){
					text += "El correo no es valido." + "\r\n";
					//alert('El correo insertado no es valido'+"\\n"+"prova");
				};
				if (!CheckEqualValue(_inputEmail1,_inputEmail2)){
					text += 'Los campos de correo no coinciden.' + "\r\n"; };
				if (!CheckPasswd(_inputPasswd)) {
					text += 'La contraseña debe tener al menos 8 caracteres.';};
			alert(text);
			}			
	});

		return _registerForm;
	};




ns.Widgets.Login = function(){
	
	var _emailLabel = $('<label>').text('Email');
	var _passwdLabel = $('<label>').text('Contraseña');
	var _inputEmail = $('<input>').attr({type:'email', name:'email', required:''});
	var _inputPasswd = $('<input>').attr({type:'password', name:'passwd', required:''});
	var _submit = $('<input>').attr({type:'submit',name:'submit',value:'Log In'});

	var _email = _emailLabel.append(_inputEmail);
	var _passwd = _passwdLabel.append(_inputPasswd);

 	_fieldset =$('<fieldset>').append(_email,_passwd);
 
	var _loginForm = $('<form>').attr('id','loginForm');
	_loginForm =_loginForm.append(_fieldset);

	console.log(_loginForm);

	_loginForm.on('submit',function(){
		Pard.Backend.login(_inputEmail.val(),inputPasswd.val(),function(data){
			if (data.status === "success"){
				console.log('redirect to user page');
			}
			else{alert('el correo no existe');}
		})
	});

	return _loginForm;
};



}(Pard || {}));

