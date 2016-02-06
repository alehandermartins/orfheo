(function(ns){
	ns.Widgets = ns.Widgets || {};

  
  ns.Widgets.Button = function(label, callback){

    var _createdButton = $('<button>').attr({type:'button'}).text(label).click(callback);

    return {
      render: function(){
        return _createdButton;
      }
    };
  };



  ns.Widgets.TextfieldFormGenerator = function(obj){
    
    var _textfield = $('<textfield>');
    
    for (key in obj){
         _label = $('<label>').append(
         		$('<h4>').text(obj[key].label_h),
            $('<p>').text(obj[key].label_p),
            $('<input>').attr({type:obj[key].type_input, name:obj[key].name_input, placeholder:obj[key].placeholder}).change(obj[key].check)
            );
         
         _textfield.append(_label)
    
    };

    return {
    	render: function ()	{
    		return _textfield;
    	}
    };
  };
	



	ns.Widgets.EmailInputGenerator = function(title,comment,placeholder){
       var email = { 
            label_h:title,
            label_p:comment,
            type_input:"email",
            name_input:"email",
            placeholder:placeholder,
            check: function(obj){
                if($(this).val()){
                    var patt=/[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;
                    if (patt.test($(this).val())){
                    $(this).removeClass('warning');
                    return true;}
                    else{
                    $(this).addClass('warning');
                    return false; };
                    }
                else{
                    $(this).removeClass('warning');
                } 
            }
        }

        return{
            render: function(){
                return email;
            }
        }
    };

  


  ns.Widgets.PasswdInputGenerator = function(title,comment,placeholder){
     var passwd = { 
          label_h:title,
          label_p:comment,
          type_input:"password",
          name_input:"password",
          placeholder:placeholder,
          check: function(obj){
          	if($(this).val()){
              if($(this).val().length < 8){
                  $(this).addClass('warning');
                   return false
              }
              else{$(this).removeClass('warning');
                  return true;   
              }
            }
            else{
                 $(this).removeClass('warning');
            } 
          }
  		}

    return{
       render: function(){
            return passwd;
        }

    }
  };	



	ns.Widgets.Register = function(){	

		var registerFormContent = {
	        email: Pard.Widgets.EmailInputGenerator("Email", "", "Tu email").render(),
	        email_confirmation: Pard.Widgets.EmailInputGenerator ("Email", "", "Confirma tu email").render(),
	        passwd: Pard.Widgets.PasswdInputGenerator("Contraseña", "", "Mínimo 8 caracteres").render()
	    
	   };

		
		var _textfield = Pard.Widgets.TextfieldFormGenerator(registerFormContent).render();

		var _form = $('<form>').append(_textfield);
        
  	$('body').append(_form);

		$('input').eq(3).appendTo($('label').eq(2));
   	$('label').eq(3).remove();
  
		var _inputEmail1 = $('input').eq(2);
		var _inputEmail2 = $('input').eq(3);
		var _inputPasswd = $('input').eq(4);

		var _invalidInput = $('<div>');


   var CheckEqualValue = function (_obj1,_obj2){
			if(_obj1.val() !== _obj2.val()){
				_obj2.addClass('warning');
				return false;
			}
			else{_obj2.removeClass('warning');
				return true;
			}
		};


		var CheckEmail = function(_obj){
	   var patt=/[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;
	   if (patt.test(_obj.val())){
	     _obj.removeClass('warning');
	     return true;}
	   else{
	     _obj.addClass('warning');
	     return false; };
		 };

		
		var CheckPasswd = function(_obj){
			if(_obj.val().length < 8){
			_obj.addClass('warning');
			return false}
		else{_obj.removeClass('warning');
			 return true;	}
		};
		


		_inputEmail1.on('change',function(){
			if($(this).val()){
				if (_inputEmail2.val()){CheckEqualValue($(this),_inputEmail2);}
			}
			else{
				$(this).removeClass('warning');
			}
		});

		_inputEmail2.on("change",function(){
			if($(this).val()){
				if(CheckEmail($(this))){CheckEqualValue(_inputEmail1,$(this));}
			}
			else{$(this).removeClass('warning');
			}
		});



		var Onsubmit = function(){

				var text = '';
			
				if (!CheckEmail(_inputEmail1)){
					text += 'El correo no es valido.' + '<br>';
					};
				
				if (!CheckEqualValue(_inputEmail1,_inputEmail2)){
					text += 'Los campos de correo no coinciden.' + '<br>';};
				
				if (!CheckPasswd(_inputPasswd)) {
					text += 'La contraseña debe tener al menos 8 caracteres.';
				};

				if (text.length === 0){
					_invalidInput.html(text);
					Pard.Backend.register(_inputEmail1.val(), _inputPasswd.val(), Pard.Events.Register());
				}
				else{_invalidInput.html(text);
				}
			};

  	var _submit = Pard.Widgets.Button('join the community', Onsubmit).render();
         
  	$('body').append(_submit, _invalidInput);
    
	};




ns.Widgets.Login = function(){

	var _emailLabel = $('<label>').text('Email');
	var _passwdLabel = $('<label>').text('Contraseña');
	var _inputEmail = $('<input>').attr({type:'email', name:'email', required:''});
	var _inputPasswd = $('<input>').attr({type:'password', name:'passwd', required:''});
	var _submit = $('<button>').attr({type:'button'}).text('Log In');
	var _sendNewPasswd=$('<div>').attr({id:'sNp'}).html('Te has olvidado la contraseña? <a>Te enviamos otra</a>');

	var _email = _emailLabel.append(_inputEmail);
	var _passwd = _passwdLabel.append(_inputPasswd);

 	_fieldset =$('<fieldset>').append(_email,_passwd);

	var _loginForm = $('<form>').attr({id:'loginForm'});
	_loginForm =_loginForm.append(_fieldset,_submit,_sendNewPasswd);


	_submit.on('click',function(){
			Pard.Backend.login(_inputEmail.val(),_inputPasswd.val(),function(){
			if (data.status === "success"){
				console.log('redirect to user page');
			}
			else{alert('el correo no existe');}
		})

  });

	
	_loginForm.find('a').on('click',function(){
		bootbox.alert('New Passwd');
	});

	
	
	return _loginForm;
};



}(Pard || {}));

