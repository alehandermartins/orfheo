'use strict';


(function(ns){
  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ModifyPassword = function(){

    var _popup;
    var _createdButton = $('<a>').attr('href','#/').text(Pard.t.text('header.insideDropdown.modifypasswd'))
      .one('click', function(){
        _popup = Pard.Widgets.Popup();
      })
      .click(function(){
        var _modifyPasswMex = Pard.Widgets.ModifyPasswordMessage();
        _modifyPasswMex.setCallback(function(){_popup.close()});
        _popup.setContent(Pard.t.text('popup.modifypasswd.title'),_modifyPasswMex.render());
        _popup.open();
      });
  

    return {
      render: function(){
        return _createdButton;
      }
    }
  }


  ns.Widgets.ModifyPasswordMessage = function(){
    var _createdWidget = $('<div>');
    var _invalidInput = $('<div>').addClass('error-text');

    var _fields = {};

    var _labels = [Pard.t.text('popup.modifypasswd.password'),Pard.t.text('popup.modifypasswd.passwordConf')];
    var _types = ['password', 'passwordConf'];

    _types.forEach(function(id, index){
      _fields[id] = Pard.Widgets.Input(_labels[index], 'password', '', function(){

        var _checkEqual = function(){
          if (_fields['passwordConf'].getVal()){
            if(_fields['password'].getVal() != _fields['passwordConf'].getVal()){
              _fields['passwordConf'].addWarning();
              _invalidInput.text(Pard.t.text('popup.modifypasswd.notequal'));
            }
            else{
              _fields['passwordConf'].removeWarning();
              _invalidInput.empty();
              return true;
            }
          }  
        }

        var _checkInput = function(){
          if(_fields['password'].getVal().length < 8){
            _fields['password'].addWarning();
            _invalidInput.text(Pard.t.text('popup.modifypasswd.tooshort'));
          }
          else{
            _fields['password'].removeWarning();
            _invalidInput.empty();
            return _checkEqual();
          }
        }

        _checkInput();

      });
    });

    _fields['button'] = Pard.Widgets.Button('OK');
    _fields['button'].setClass('recoveryPasswd-popup-button');

     // _fields['button'].disable();

     var _form = $('<form>');

    _types.forEach(function(field){
      _form.append(_fields[field].render());
    });

    _createdWidget.append(_form, _invalidInput, _fields['button'].render());

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _fields['button'].render().on('click', function(){
          if((_fields['password'].getVal() == _fields['passwordConf'].getVal()) && _fields['password'].getVal().length >= 8){
            Pard.Backend.modifyPassword(_fields['password'].getVal(), function(data){
              if (data['status'] == 'success'){
                Pard.Widgets.TimeOutAlert('', Pard.t.text('popup.modifypasswd.success'));
                callback();
              }
              else {
                _invalidInput.text(data.reason);
              }
            });
          }
          else{
            _invalidInput.text(Pard.t.text('popup.modifypasswd.check'));
          }
        });
      }
    }
  }


  ns.Widgets.Logout = function(){

    var _logout = $('<a>').attr('href','#/').text(Pard.t.text('header.insideDropdown.logout')).click(function(){
      Pard.Backend.logout(
        Pard.Events.Logout
      );
    });

    var _createdWidget =_logout;

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }


  
  
}(Pard || {}));