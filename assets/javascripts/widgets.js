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
    
    var _fieldset = $('<fieldset>');
    
    for (key in obj){

    	var _h = $('<h4>').text(obj[key].label_h);
    	var _p = $('<p>').text(obj[key].label_p);
    	var _input = $('<input>').attr({type:obj[key].type_input, name:obj[key].name_input, placeholder:obj[key].placeholder}).change(obj[key].check);

	   	var _label = $('<label>').attr({id:obj[key].label_id}).append(_h,_p,_input); 
     
	     _fieldset.append(_label)
  
    };

    return {
    	render: function ()	{
    		return _fieldset;
    	}
    };
  };
	



	ns.Widgets.EmailInputObj = function(title,comment,placeholder,id){
     var email = { 
          label_h:title,
          label_p:comment,
          type_input:"email",
          name_input:"email",
          placeholder:placeholder,
          label_id: id,
          check: function(){
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
                  return false;
              } 
          }
      }

      return{
          render: function(){
              return email;
          },
          checking: function() {
          	return email.check;
          }
      }
  };

  

  ns.Widgets.PasswdInputObj = function(title,comment,placeholder,id){
   var passwd = { 
        label_h:title,
        label_p:comment,
        type_input:"password",
        name_input:"password",
        placeholder:placeholder,
        label_id: id,
        check: function(){
        	if($(this).val()){
            if($(this).val().length < 8){
                $(this).addClass('warning');
                 return false;
            }
            else{$(this).removeClass('warning');
                return true;   
            }
          }
          else{
               $(this).removeClass('warning');
               return false;
          } 
        }
		}

  	return{
     render: function(){
        return passwd;
      },
      checking: function(){
      	return passwd.check
      }

  	}
  };	


	ns.Widgets.Login = function(){

		var registerFormContent = {
	        email: Pard.Widgets.EmailInputObj("Email", "", "", "emailLogin").render(),
	        passwd: Pard.Widgets.PasswdInputObj("Contraseña", "", "", "passwdLogin").render()
		   };
		   	
		var _fieldset = Pard.Widgets.TextfieldFormGenerator(registerFormContent).render();

		var _invalidInput = $("<div>").html('No te acuerdas la contraseña? <a>Te enviamos otra</a>');

		var _form = $('<form>').append(_fieldset);

	 	$("#header_layout").append(_form);
	        
		var _inputEmail = $('#emailLogin').attr('required', '');
		var _inputPasswd = $('#passwdLogin').attr('required', '');
		
		var _sendNewPasswd=$('<div>').attr({id:'sNp'}).html('Te has olvidado la contraseña? <a>Te enviamos otra</a>');

		var Onsubmit = function(){
				Pard.Backend.login(_inputEmail.val(),_inputPasswd.val(),function(){
				if (data.status === "success"){
					console.log('redirect to user page');
				}
				else{alert('el correo no existe');}
			})

	  };

		var _submit = $('<button>').attr({type:'button'}).text('Log In');
		
		var _submit = Pard.Widgets.Button('Log In', Onsubmit).render();
	       
	  _form.append(_submit, _invalidInput);

	  _form.find('a').on('click',function(){
			bootbox.alert('New Passwd');
		});
		
		return true;

	};



	ns.Widgets.Register = function(){	

		var registerFormContent = {
        email: Pard.Widgets.EmailInputObj("Email", "", "Tu email", "emailRegister").render(),
        email_confirmation: Pard.Widgets.EmailInputObj ("Email", "", "Confirma tu email","emailRegisterConf").render(),
        passwd: Pard.Widgets.PasswdInputObj("Contraseña", "", "Mínimo 8 caracteres", "passwdRegister").render()
	    
	   };

	   	
		var _fieldset = Pard.Widgets.TextfieldFormGenerator(registerFormContent).render();

		var _form = $('<form>').append(_fieldset);
        
  	$("#section_layout").append(_form);

  	var _inputEmail1 = $('#emailRegister input');
		var _inputEmail2 = $('#emailRegisterConf input');
		var _inputPasswd = $('#passwdRegister input');

		$(_inputEmail2).appendTo("#emailRegister");
   	$('#emailRegisterConf').remove();
 
		var _invalidInput = $('<div>');

		_inputEmail1.check = Pard.Widgets.EmailInputObj().checking();
		_inputPasswd.check = Pard.Widgets.PasswdInputObj().checking();

   var CheckEqualValue = function (_obj1,_obj2){
			if(_obj1.val() !== _obj2.val()){
				_obj2.addClass('warning');
				return false;
			}
			else{_obj2.removeClass('warning');
				return true;
			}
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
				if(_inputEmail2.check){CheckEqualValue(_inputEmail1,$(this));}
			}
			else{$(this).removeClass('warning');
			}
		});


		var Onsubmit = function(){
				var text = '';
				if (!_inputEmail1.check()){
					text += 'El correo no es valido.' + '<br>';
					_inputEmail1.addClass('warning');
					};
					if (!CheckEqualValue(_inputEmail1,_inputEmail2)){
					text += 'Los campos de correo no coinciden.' + '<br>';};
				if (!_inputPasswd.check()) {
					text += 'La contraseña debe tener al menos 8 caracteres.';
					_inputPasswd.addClass('warning');
				};
				if (text.length === 0){
					_invalidInput.html(text);
					Pard.Backend.register(_inputEmail1.val(), _inputPasswd.val(), Pard.Events.Register());
				}
				else{_invalidInput.html(text);
				}
			};

  	
  	var _submit = Pard.Widgets.Button('join the community', Onsubmit).render();
         
  	_form.append(_submit, _invalidInput);

  	return true;
 		
	};








}(Pard || {}));

