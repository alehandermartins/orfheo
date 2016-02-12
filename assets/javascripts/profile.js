(function(ns){
  

  ns.Widgets.ArtistProfile = function(profile){
    var _createdWidget = $('<div>');

    ['name','city'].forEach( function(element) {
      var _newField = $('<div>').text(profile[element]);
      _createdWidget.append(_newField)
    });

  
    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

   ns.Widgets.SpaceProfile = function(profile){
    var _createdWidget = $('<div>');
    var _info = $('<div>');

        ['name','city', 'address', 'category'].forEach( function(element) {
      var _newField = $('<div>').text(profile[element]);
      _info.append(_newField)
    });

    _modifyProfile = Pard.Widgets.ModifyProfile(profile).render();

    _createdWidget.append(_info, _modifyProfile)

    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ModifyProfile = function(profile){

    var _createdWidget = $('<div>');

    var _createdButton = Pard.Widgets.Button('Modifica tu perfil', function(){
      Pard.Widgets.BootboxAlert('Modifica tus datos', Pard.Widgets.ModifyProfileMessage(profile));
    });

    _createdWidget.append(_createdButton.render());

    return {
      render: function(){
        return _createdWidget;
      }
    }

  }

  ns.Widgets.Selector = function(labels, values){
    var _createdWidget = $('<select>');
    values.forEach(function(value, index){
      _createdWidget.append($('<option>').text(labels[index]).val(value));
    });

    return {
      render: function(){
        return _createdWidget;
      },
      getVal: function(){
        return _createdWidget.val();
      },
      setVal: function(value){
        _createdWidget.val(value);
      }
    }
  }

  ns.Widgets.TextArea = function(label){
    var _createdWidget = $('<div>'); 
    var _textarea = $('<textarea>').attr({placeholder: label});

    _createdWidget.append(_textarea);
    
    return {
      render: function(){
        return _createdWidget;
      },
      getVal: function(){
        return _textarea.val();
      },
      setVal: function(value){
        _textarea.val(value);
      }
    }
  }  



  ns.Widgets.ModifyProfileMessage = function(profile){

    var _createdWidget = $('<div>');
    
    var _form = {};
    var _fields = ['name', 'city', 'address', 'zip_code', 'category', 'bio'];
    var _labels = ['Asociacion Cultural', 'Local Comercial', 'Espacio Particular'];
    var _values = ['cultural_ass', 'commercial', 'home'];


    _form['name'] = Pard.Widgets.Input('Nombre espacio', 'text');
    _form['city'] = Pard.Widgets.Input('Ciudad', 'text');
    _form['address'] = Pard.Widgets.Input('Direccion', 'text');
    _form['zip_code'] = Pard.Widgets.Input('Codigo postal', 'text');
    _form['category'] = Pard.Widgets.Selector(_labels, _values);
    _form['bio'] = Pard.Widgets.TextArea('Bio');
    
    _fields.forEach(function(field){
      if(profile[field]) _form[field].setVal(profile[field]);
    });

    Object.keys(_form).forEach(function(field){
      _createdWidget.append(_form[field].render());
    });

    var _filled = function(){
      var _check = true;
      Object.keys(_form).forEach(function(field){
        if (field != 'bio'){
         if(_form[field].getVal().length == 0) _check = false;
        }
      });
      return _check;
    }

    var _getVal = function(){
      var _submitForm = {};
      _submitForm['profile_id'] = profile.profile_id;
      _submitForm['type'] = profile.type;    
      _fields.forEach(function(field){
        if(profile[field] != _form[field].getVal()) _submitForm[field] = _form[field].getVal();
      });
     
      return _submitForm;
    }  

    return {
      render: function(){
        return _createdWidget;
      },
       callback: function(){
        var _submitForm = _getVal();
        console.log(_submitForm);
        if(_filled() == true) Pard.Backend.modifyProfile(_submitForm, Pard.Events.CreateProfile);
        else{
          return false;
        }
      }
    }
  }


}(Pard || {}));
