'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.SignUpButton = function(){
    
    var _signUpPopup; 
    var _signUpPopupMessage;   
    var _signUpButton = $('<button>')
      .attr({type:'button'}).html(Pard.t.text('signUp.btn'))
      .one('click',function(){
        _signUpPopup = Pard.Widgets.Popup();
        _signUpPopupMessage = Pard.Widgets.Registration();
        _signUpPopupMessage.setCallback(function(){
          _signUpPopup.close()});
        _signUpPopup.setContent(Pard.t.text('signUp.popup.title'), _signUpPopupMessage.render())
      })
      .click(function(){
        _signUpPopupMessage.empty();
        _signUpPopup.open();    
      });
    
    return{
      render: function(){
        return _signUpButton;
      }
    }
  }

  ns.Widgets.Registration = function(event_id){

    var _createdWidget = $('<form>').attr('autocomplete','on');
    var _invalidInput = $('<div>').addClass('error-text');

    var _fields = {};

    var _emailLabel = Pard.Widgets.InputLabel(Pard.t.text('signUp.popup.email')).render();
    var _confEmailLabel = $('<label>');
    var _passwdLabel = Pard.Widgets.InputLabel(Pard.t.text('signUp.popup.passwd')).render();    

    var regEx = /[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;
    var _labels = [Pard.t.text('signUp.popup.insertEmail'), Pard.t.text('signUp.popup.confirmEmail'), Pard.t.text('signUp.popup.length')];
    var _types = ['text', 'text', 'password'];

    ['email', 'emailConf', 'password'].forEach(function(id, index){
      _fields[id] = Pard.Widgets.Input(_labels[index], _types[index]
      , function(){
        if (_invalidInput.text()) _checkInput();
        // _invalidInput.text('');
        }
      )}
    );

   var _checkPassword = function(){
        if(_fields['password'].getVal().length < 8){
          _fields['password'].addWarning();
          _invalidInput.text(Pard.t.text('signUp.popup.tooshort'));
        }
        else{
          _fields['password'].removeWarning();
          return true;
        }
    }

    var _checkEqual = function(){ 
        if (_fields['email'].getVal() != _fields['emailConf'].getVal()){
          _fields['emailConf'].addWarning();
          _invalidInput.text(Pard.t.text('signUp.popup.notequal'));
        }
        else{
          _fields['emailConf'].removeWarning();
          return _checkPassword(_invalidInput);
        }
    };

    var _checkInput = function(){
      if(!regEx.test(_fields['email'].getVal())){
        _fields['email'].addWarning();
        _invalidInput.text(Pard.t.text('signUp.popup.format'));
      }else{
        _fields['email'].removeWarning();
        _invalidInput.text('');
        return _checkEqual();
      }
    }

    _fields['button'] = Pard.Widgets.Button(Pard.t.text('signUp.popup.submit'));
    _fields['button'].setClass('signup-form-btn');

    Object.keys(_fields).map(function(field){
      _createdWidget.append(_fields[field].render());
    });

    _emailLabel.append(_fields['email'].render());
    _confEmailLabel.append(_fields['emailConf'].render())
    _passwdLabel.append(_fields['password'].render());

    var _initMex = $('<div>').append($('<p>').html(Pard.t.text('signUp.popup.mex'))).addClass('register-form-init-mex');

    var _termsAndCondtionsPopup;
    var _termsAndCondtions = $('<a>')
      .attr('href','#/')
      .text(Pard.t.text('signUp.popup.conditions'))
      .one('click', function(){
        _termsAndCondtionsPopup = Pard.Widgets.Popup();
        _termsAndCondtionsPopup.setContent('', Pard.Widgets.TermsAndConditionsMessage(_termsAndCondtionsPopup).render())
      })
      .click(function(){
        _termsAndCondtionsPopup.open();
      });

    var _finalMex = $('<div>').append($('<p>').append(Pard.t.text('signUp.popup.conditionText'), _termsAndCondtions, '.')).addClass('register-form-final-mex');

    _createdWidget.append(_initMex, _emailLabel, _confEmailLabel, _passwdLabel, _invalidInput, _fields['button'].render(), _finalMex);

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _fields['button'].render().on('click', function(){
          if (_checkInput()){
            if (event_id){
              Pard.Backend.register(
                _fields['email'].getVal(),
                _fields['password'].getVal(),
                event_id,
                Pard.Events.Register
              );
            } 
            else{
              Pard.Backend.register(
                _fields['email'].getVal(),
                _fields['password'].getVal(),
                '',
                Pard.Events.Register
              );
            }
          callback();
          }
          else {return false};
        })
      },
      empty: function(){
        _fields['email'].setVal('');
        _fields['emailConf'].setVal('');  
        _fields['password'].setVal('');
      }
    }
  }

  ns.Widgets.RecoveryMessage = function(){
    var _createdWidget = $('<div>');
    var regEx = /[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;

    var _emailLabel = Pard.Widgets.InputLabel('Email').render();
    var _email = Pard.Widgets.Input('', 'email');
    var _result = $('<div>').addClass('error-text');
    var _sendButton = Pard.Widgets.Button(Pard.t.text('popup.recover.submit'));
    _sendButton.setClass('recoveryPasswd-popup-button');

    _emailLabel.append(_email.render());         
    
    _createdWidget.append(_emailLabel, _result, _sendButton.render());

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _sendButton.render().on('click', function(){
          _result.empty();
          if(!regEx.test(_email.getVal())) {
            _result.text(Pard.t.text('login.popup.notValidEmail'));
            _email.addWarning();
          }
          else {
            Pard.Backend.passwordRecovery(_email.getVal(), function(data){
              if (data['status'] == 'success'){
                Pard.Widgets.Alert('', Pard.t.text('login.popup.sent'));
                callback();
              }
              else {
                _result.text(Pard.t.text('login.popup.nouser'));
              }
            });
          }
        })
      }
    }
  }


 ns.Widgets.Login = function(){

    var _createdWidget = $('<form>').addClass('input-login').attr({autocomplete:'on'});
    var _emailRecovery = $('<span>').addClass('passwdRecovery');
    var _popup;
    var _caller = $('<a>').attr('href','#/').text(Pard.t.text('login.dropdown.recover'))
      .one('click',function(){
        _popup = Pard.Widgets.Popup();
      })
      .click(function(){
        var _recoveryMex = Pard.Widgets.RecoveryMessage();
        _recoveryMex.setCallback(function(){_popup.close()});
        _popup.setContent(Pard.t.text('popup.recover.title'), _recoveryMex.render());
        _popup.open();
        $('#loginDropDown').foundation('close');
      });
    _emailRecovery.append(_caller);

    var _fields = {};

    var regEx = /[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;
    var _labels = [Pard.t.text('login.dropdown.email'), Pard.t.text('login.dropdown.passwd')];
    var _types = ['email', 'password'];


    _types.forEach(function(id, index){
      _fields[id] = Pard.Widgets.Input(_labels[index], _types[index], function(){

        var _checkPassword = function(){
          if(_fields['password'].getVal().length >= 8) return true;
        }

        var _checkInput = function(){
          if(regEx.test(_fields['email'].getVal())) return _checkPassword();
        }

        if (_checkInput() == true){
          _fields['button'].enable();
        }else{
          _fields['button'].disable();
        }
      });
    });

    _fields['button'] = Pard.Widgets.Button(Pard.t.text('login.dropdown.gobtn'), function(){
      _rememberMe.rememberMe();
      Pard.Backend.login(
        _fields['email'].getVal(),
        _fields['password'].getVal(),
        Pard.Events.Login
      );
    });

    _fields['button'].setClass('login-btn');
    _fields['email'].setClass('input-login-field');
    _fields['password'].setClass('input-login-field');

    var _rememberMe = Pard.Widgets.RememberMe(_fields['email'], _fields['password'], _fields['button']);

    var _emailField = _fields['email'].render().attr({name: 'email'});
    var _passwdField = _fields['password'].render().attr({name:'password'});
    var _btn = _fields['button'].render();

    // Object.keys(_fields).map(function(field){
    //   _createdWidget.append(_fields[field].render().attr({name: field}));
    // });

    _emailField.keypress(function (e) {
      var key = e.which;
      if(key == 13){
        _btn.click();
        return false;  
      }
    });   

    _passwdField.keypress(function (e) {
      var key = e.which;
      if(key == 13){
        _btn.click();
        return false;  
      }
    });   

    _createdWidget.append(_emailField, _passwdField, _btn);

    var _checkBox = _rememberMe.render();

    _createdWidget.append(_checkBox,_emailRecovery);

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  ns.Widgets.RememberMe = function(emailField, passwdField, button){

    var _ckb = $('<input>').attr({type:'checkbox', value:'remember-me'}); 
    var _label = $('<label>').text(Pard.t.text('login.dropdown.rememberme'));
    var _createdWidget = $('<span>').append(_ckb,_label);
    _createdWidget.addClass('rememberMe-ckb');
    var registerInfoStoraged = Pard.Options.register() || {};

    $(function() {
      if (registerInfoStoraged.chkbx && registerInfoStoraged.chkbx != '') {
          _ckb.attr('checked', 'checked');
          emailField.setVal(registerInfoStoraged.usrname);
          passwdField.setVal(registerInfoStoraged.pass);
          button.enable();
      } else {
          _ckb.removeAttr('checked');
          emailField.setVal('');
          passwdField.setVal('');
          button.disable();
      }
    });

    var _rememberMe = function(){
      if (_ckb.is(':checked')) {
            // save username and password
            registerInfoStoraged.usrname = emailField.getVal();
            registerInfoStoraged.pass = passwdField.getVal();
            registerInfoStoraged.chkbx = _ckb.val();
            Pard.Options.setRegister(registerInfoStoraged);
        } else {
            registerInfoStoraged.usrname = '';
            registerInfoStoraged.pass = '';
            registerInfoStoraged.chkbx = '';
            Pard.Options.setRegister(registerInfoStoraged);
        }
    }

    _ckb.click(function() {
      _rememberMe();
    });

    return {
      render: function(){
        return _createdWidget;      
      },
      rememberMe:function(){
        _rememberMe();
      }
    }
  }


  ns.Widgets.LoginEvent = function(event_id){

    var _createdWidget = $('<form>').addClass('input-login').attr({autocomplete:'on'});
    var _emailRecovery = $('<div>').addClass('passwdRecovery-eventLogin');

    var _popup;
    var _caller = $('<a>').attr('href','#/').text(Pard.t.text('login.dropdown.recover'))
      .one('click',function(){
        _popup = Pard.Widgets.Popup();
      })
      .click(function(){
        var _recoveryMex = Pard.Widgets.RecoveryMessage();
        _recoveryMex.setCallback(function(){_popup.close()});
        _popup.setContent(Pard.t.text('popup.recover.title'), _recoveryMex.render());
        _popup.open();
      });
    _emailRecovery.append(_caller);

    var _fields = {};

    var regEx = /[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;
    var _labels = [Pard.t.text('login.dropdown.email'), Pard.t.text('login.dropdown.passwd')];
    var _types = ['email', 'password'];


    _types.forEach(function(id, index){
      _fields[id] = Pard.Widgets.Input(_labels[index], _types[index], function(){

        var _checkPassword = function(){
          if(_fields['password'].getVal().length >= 8) return true;
        }

        var _checkInput = function(){
          if(regEx.test(_fields['email'].getVal())) return _checkPassword();
        }

        if (_checkInput() == true){
          _fields['button'].enable();
        }else{
          _fields['button'].disable();
        }
      });
    });



    _fields['button'] = Pard.Widgets.Button(Pard.t.text('login.dropdown.gobtn'), function(){
      _rememberMe.rememberMe();
      Pard.Backend.login(
        _fields['email'].getVal(),
        _fields['password'].getVal(),
        Pard.Events.Login
      );
    });

    _fields['button'].setClass('login-btn');
    _fields['email'].setClass('input-loginEvent-field');
    _fields['password'].setClass('input-loginEvent-field');

    var _rememberMe = Pard.Widgets.RememberMe(_fields['email'], _fields['password'], _fields['button']);

    Object.keys(_fields).map(function(field){
      _createdWidget.append(_fields[field].render().attr({name: field}));
    });

    // var _tools = $('<div>').addClass('login-header-tools');
    // _tools.append(_rememberMe.render(),_emailRecovery);

    _createdWidget.append(_emailRecovery);

    var _signUpContainer = $('<div>').addClass('signUpCont-eventLogin');
    var _signUpText = $('<h5>').text(Pard.t.text('login.eventPage.nouser')).addClass('signUpText-eventLogin');
    var _signUpPopup;
    var _signUpPopupMessage;
    var _signUpButton = $('<button>')
      .attr({type:'button'})
      .html(Pard.t.text('login.eventPage.signUp'))
      .addClass('signupButton-eventLogin')
      .one('click', function(){
        _signUpPopup = Pard.Widgets.Popup();
        _signUpPopupMessage = Pard.Widgets.Registration(event_id);
        _signUpPopupMessage.setCallback(function(){_signUpPopup.close()});
        _signUpPopup.setContent(Pard.t.text('login.eventPage.signUpTitle'), _signUpPopupMessage.render())
      })
      .click(function(){
        _signUpPopupMessage.empty();
        _signUpPopup.open();
      });   

    _signUpContainer.append(_signUpText,_signUpButton);
    _createdWidget.append(_signUpContainer);

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        callback();
      }
    }
  }


  


}(Pard || {}));

