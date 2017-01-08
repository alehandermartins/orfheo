'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};


  ns.Widgets.CreateNewProductionMessage = function(profile){
    var _createdWidget = $('<div>').addClass('createProductionForm');
    var _content = $('<div>');
    var _closepopup = function(){};
    var _genericForm = Pard.Forms.Production;

    var _printForm = function(catSelected){
      _content.empty();
      var _fieldsForm = Pard.Forms.FieldsForms(catSelected).createProduction();
      var _form = {};
      _fieldsForm.forEach(function(field){
        _form[field] = _genericForm[field];
      });
      var _submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('Crea');
      var _formWidget = Pard.Widgets.PrintForm(_form, _submitButton);
      var _send = function(stopSpinner){
        var _submittForm;
        _submitForm = _formWidget.getVal();
        _submitForm['type'] = profile.type;
        _submitForm['profile_id'] = profile.profile_id;
        _submitForm['category'] = catSelected;
        Pard.Backend.createProduction(_submitForm, function(data){
          _createNewProdCallback(data);
          _closepopup();
          stopSpinner();
        });
      }
      _formWidget.setSend(_send);    
      _content.append(_formWidget.render());
    }

    var _createNewProdCallback = function(data){
      if (data.status == 'success'){
        Pard.ProfileManager.addProduction(profile.profile_id,data.production);
        Pard.Widgets.ProductionsNavigation(profile.profile_id, $('#_profileNav'), $('#_sectionContent'), data.production.production_id);
      }
      else{
      Pard.Widgets.Alert('',data.reason);
      }  
    }

    var categorySelectCallback = function(){
      var _catSelected = _categorySelector.getVal();
      _printForm(_catSelected);
    };
    var _categorySelector = Pard.Widgets.OrfheoArtCatSelect(categorySelectCallback);
    var _categoryLabel = $('<label>').text('Selecciona una categoría *');
    var _category = $('<div>').append(_categoryLabel.append(_categorySelector.render()));

    _createdWidget.append(_category, _content);

    _printForm('music');

    return{
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }




  ns.Widgets.ModifyProduction = function(production){

    var _popup;
    var _createdWidget = $('<button>').addClass('modify-content-button').attr({type: 'button'}).html(Pard.Widgets.IconManager('modify_section_content').render())
      .one('click', function(){
        _popup = Pard.Widgets.Popup();
      })    
      .click(function(){
        var _content = Pard.Widgets.ModifyProductionMessage(production);
        _content.setCallback(function(){_popup.close()});
        _popup.setContent('Modifica tu proyecto artístico',_content.render());
        _popup.open();
      });
   
    return {
      render: function(){
        return _createdWidget;
      }
    }
  }

  ns.Widgets.ModifyProductionMessage = function(production){

    var _createdWidget = $('<div>').addClass('createProductionForm');
    var _content = $('<div>');
    var _closepopup = function(){};
    var _genericForm = Pard.Forms.Production;

    var _printForm = function(catSelected){
      _content.empty();
      var _catSelector = Pard.Widgets.OrfheoArtCatSelect();
      _catSelector.setVal(catSelected);
      _catSelector.disable();
      var _fieldsForm = Pard.Forms.FieldsForms(catSelected).modifyProduction();
      var _form = {};
      console.log(_fieldsForm);
      _fieldsForm.forEach(function(field){
        _form[field] = _genericForm[field];
      });
      var _submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html('OK');
      var _formWidget = Pard.Widgets.PrintForm(_form, _submitButton);
      var _send = function(stopSpinner){
        console.log(stopSpinner)
        var _submittForm;
        _submitForm = _formWidget.getVal();
        var user_id = Pard.ProfileManager.getUserId();
        var profile_id = Pard.ProfileManager.getProfileId(production.production_id);
        _submitForm['production_id'] = production.production_id;
        _submitForm['profile_id'] = profile_id;
        _submitForm['category'] = catSelected;
        Pard.Backend.modifyProduction(_submitForm, function(data){
          Pard.Events.ModifyProduction(data);
          _closepopup();
          stopSpinner();
        });
      }
      _formWidget.setSend(_send);
      _formWidget.setVal(production); 
      var _categoryLabel = $('<label>').text('Categoría');
      var _category = $('<div>').append(_categoryLabel.append(_catSelector.render()));   
      _content.append(_category, _formWidget.render());
    }

    var _initMex = $('<div>').append($('<p>').html(
        'Con este formularo puedes modificar el contenido de la página de tu proyecto artistico. Los cambios que hagas no afectarán los datos enviados a convocatorias.'
      )).addClass('init-message-form');

    _printForm(production.category);

    var _confirmationPopup; 
    var _deleteProductionMessage = Pard.Widgets.DeleteProductionMessage(production.production_id, _closepopup);
    _deleteProductionMessage.setCallback(function(){_confirmationPopup.close()});
    _confirmationPopup.setContent('¿Estás seguro/a?', _deleteProductionMessage.render());
    var _deleteProduction = $('<a>').attr('href','#/').append(Pard.Widgets.IconManager('delete').render().addClass('trash-icon-delete'), 'Elimina este proyecto artístico').addClass('deleteProfile-caller')
      .one('click', function(){
        _confirmationPopup = Pard.Widgets.Popup();
      })
      .click(function(){
        _confirmationPopup.open();
      });

    _createdWidget.append(_initMex, _content, _deleteProduction);

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }

  ns.Widgets.DeleteProductionMessage = function(production_id, closepopup){ 
    var _closeConfirmationPopup = function(){}
    
    var _createdWidget = $('<div>');
    var _message = $('<p>').text('Confirmando, tu proyecto artístico se eliminará de tu portfolio. Esa acción no afectará a tu inscripción en convocatorias. ');
    var _yesBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn confirm-delete-btn').text('Confirma');
    var _noBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn cancel-delete-btn').text('Anula');

    _yesBtn.click(function(){
      Pard.Backend.deleteProduction(production_id, Pard.Events.DeleteProduction);
      _closeConfirmationPopup();
      closepopup();
    });

    _noBtn.click(function(){
      _closeConfirmationPopup();
    });

    var _buttonsContainer = $('<div>').addClass('yes-no-button-container');

    _createdWidget.append(_message,  _buttonsContainer.append(_noBtn, _yesBtn));

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closeConfirmationPopup = callback;
      }
    }
  }



 

}(Pard || {}));
