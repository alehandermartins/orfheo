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


  ns.Widgets.EmailInput = function(title, comment, id, id2, callback){

    var _createdWidget = $('<label>');
    var _title = $('<h4>').text(title);
    var _comment = $('<p>').text(comment);
    var _input = $('<input>').attr('type':'email'});

    _createdWidget.append(_title, _comment, _input);

    _input.on('input',function(){
      var regEx=/[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]/i;
      if(!regEx.test(_input.val())) _input.addClass('warning');
      if(regEx.test(_input.val())) _input.removeClass('warning');
      if (callback) callback(id, id2);
    });

    return {
      render: function(){
        return _createdWidget;
      },
      getVal: function(){
        return _input.val();
      },
      addWarning: function(){
        _input.addClass('warning')
      },
      removeWarning: function(){
        _input.removeClass('warning')
      },
      notReady: function(){
        return (_input.hasClass('warning') || _input.val().length == 0);
      }
    }
  }

  ns.Widgets.PasswordInput = function(title,comment,id){

    var _createdWidget = $('<label>')
    var _title = $('<h4>').text(title);
    var _comment = $('<p>').text(comment);
    var _input = $('<input>').attr('type':'password');

    _createdWidget.append(_title, _comment, _input);

    _input.on('input',function(){
      if(_input.val().length < 8) _input.addClass('warning');
      if(_input.val().length >= 8) _input.removeClass('warning');
    });

    return{
      render: function(){
        return _createdWidget;
      },
      getVal: function(){
        return _input.val();
      },
      notReady: function(){
        return (_input.hasClass('warning') || _input.val().length == 0);
      }
    }
  };

  ns.Widgets.Registration = function(){

    var _createdWidget = $('<form>');
    var _emails = {};

    var _labels = ['Tu email', 'Confirma tu email'];

    ['email', 'emailConf'].forEach(function(id, index){
      _emails[id] = Pard.Widgets.EmailInput('Email', _labels[index], 'email', 'emailConf', function(id, id2){
        if(_emails[id].getVal() != _emails[id2].getVal()) _emails[id2].addWarning();
        if(_emails[id].getVal() == _emails[id2].getVal()) _emails[id2].removeWarning();
      });
    });

    var _password = Pard.Widgets.PasswordInput('Contraseña', 'Mínimo 8 caracteres', 'password');
    var _invalidInput = $('<div>');

    var Onsubmit = function(){
      if(_emails['email'].notReady()) return _invalidInput.text('El correo no es valido.');
      if(_emails['email'].getVal() != _emails['emailConf'].getVal()) return _invalidInput.text('Los campos de correo no coinciden.');
      if(_password.notReady()) return _invalidInput.text('La contraseña debe tener al menos 8 caracteres.');
      Pard.Backend.register(_emails['email'].getVal(), _emails['emailConf'].getVal(), Pard.Events.Register);
    }

    var _submit = Pard.Widgets.Button('join the community', Onsubmit);

    _createdWidget.append(
      _emails['email'].render(),
      _emails['emailConf'].render(),
      _password.render(),
      _invalidInput,
      _submit.render()
    );

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

}(Pard || {}));
