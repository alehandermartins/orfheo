'use strict';

(function(ns){
  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ContactOrfheoForm = function(){
   
    var _errorBox = $('<p>');
    var _nameInput = Pard.Widgets.Input('Nombre*','text');
    var _emailInput = Pard.Widgets.InputEmail('Email*');
    var _subjectInput = Pard.Widgets.Input('Asunto','text');
    var _profileInput = Pard.Widgets.Input('Nombre de tu perfil en orfheo', 'text');
    var _mexInput = Pard.Widgets.TextArea('Mensaje*',6);
    var _submitBtn = Pard.Widgets.Button('Envía', function(){
      _submitBtn.disable();
      _submitBtn.setClass('disabled-button');
      _errorBox.empty();
      var spinner = new Spinner();
      spinner.spin();
      $('body').append(spinner.el);
      var filled = true;
      [_nameInput, _emailInput,_mexInput].forEach(function(input){
        if (!(input.getVal())){
          input.addWarning();
          filled = false;
        }
      });
      if (filled){
        Pard.Backend.techSupport(_nameInput.getVal(), _emailInput.getVal(), _subjectInput.getVal(), _profileInput.getVal(), '', _mexInput.getVal(), function(data){
          spinner.stop();
          if (data['status'] == 'success'){
            _submitBtnContainer.remove();
            _errorBox
              .empty()
              .css('text-align','right')
              .append(
                Pard.Widgets.IconManager('done').render().addClass('success-icon-check-messageSent'),
                $('<span>').text('Mensaje enviado correctamente. ').css('color','#4cb632'),
                $('<span>').html('<br>Gracias por contactar con nosotros.<br> Te contestaremos cuanto antes :)')
                  .css({
                    'color':'black',
                    'margin-bottom':'1.5rem'
                  })
              )
              .removeClass('error-text');
          }
          else{
            _submitBtn.enable();
            _submitBtn.deleteClass('disabled-button');
            _errorBox
              .empty()
              .append(
                Pard.Widgets.IconManager('attention').render().css({'font-size':'22px','vertical-align':'-.1rem'}),
                $('<span>').html('Mensaje no enviado: <br>'+data.reason)  
              ).addClass('error-text')
          }
        });
      }
      else{
        _submitBtn.enable();
        _submitBtn.deleteClass('disabled-button');
        spinner.stop()
        _errorBox
        .empty()
        .append(
          Pard.Widgets.IconManager('attention').render().css({'font-size':'22px','vertical-align':'-.1rem'}),
          $('<span>').html('Mensaje no enviado:<br> por favor, revisa los campos obligatorios')
        ).addClass('error-text');
      }
    });
    var _submitBtnContainer = $('<span>')
      .append(
        _submitBtn.render().addClass('submit-button')
      )
    var _submitContainer = $('<div>')
      .css({
        'min-height':'3.2rem',
        'position':'relative'
      });
    var _formSupport = $('<div>').addClass('contactForm-container').append(
      $('<form>').append(_nameInput.render(), _emailInput.render(), _subjectInput.render(), _profileInput.render(), _mexInput.render()),
      _submitContainer.append(_errorBox, _submitBtnContainer) 
    )

    return _formSupport;

  }

  ns.Widgets.FeedbackForm = function(){
    var _nameInput = Pard.Widgets.Input('Nombre*','text');
    var _emailInput = Pard.Widgets.InputEmail('Email*');
    var _mexInput = Pard.Widgets.TextArea('Mensaje*',6);
    var _feedbackErrorBox = $('<p>');
    var _feedbackSubmitBtnContainer= $('<div>');
    var _feedBackSubmitBtn = Pard.Widgets.Button('Envía', function(){
      _feedBackSubmitBtn.disable();
      _feedBackSubmitBtn.setClass('disabled-button');
      _feedbackErrorBox.empty();
      var spinner = new Spinner();
      spinner.spin();
      $('body').append(spinner.el);
      var feedbackFormFilled = true;
      [_nameInput, _emailInput, _mexInput].forEach(function(input){
        if (!(input.getVal())){
          input.addWarning();
          feedbackFormFilled = false;
        }
      });
      if (feedbackFormFilled){
        Pard.Backend.feedback(_nameInput.getVal(), _emailInput.getVal(), _mexInput.getVal(), function(data){
          spinner.stop();
          if (data['status'] == 'success'){
           _feedbackSubmitBtnContainer.remove();
            _feedbackErrorBox
              .empty()
              .css('text-align','right')
              .append(
                Pard.Widgets.IconManager('done').render().addClass('success-icon-check-messageSent'),
                $('<span>').text('Mensaje enviado correctamente. ').css('color','#4cb632'),
                $('<span>').html('<br>Gracias por tu opinión :)')
                  .css({
                    'color':'black',
                    'margin-bottom':'1.5rem'
                  })
              )
              .removeClass('error-text');
          }
          else{
            _feedBackSubmitBtn.enable();
            _feedBackSubmitBtn.deleteClass('disabled-button');
            _feedbackErrorBox
              .empty()
              .append(
                Pard.Widgets.IconManager('attention').render().css({'font-size':'22px','vertical-align':'-.1rem'}),
                $('<span>').html('Mensaje no enviado: <br>'+data.reason)  
              ).addClass('error-text')
          }
        });
      }
      else{
        _feedBackSubmitBtn.enable();
        _feedBackSubmitBtn.deleteClass('disabled-button');
        spinner.stop()
        _feedbackErrorBox
        .empty()
        .append(
          Pard.Widgets.IconManager('attention').render().css({'font-size':'22px','vertical-align':'-.1rem'}),
          $('<span>').html('Mensaje no enviado:<br> por favor, revisa los campos obligatorios')
        ).addClass('error-text');
      }
    });
    _feedbackSubmitBtnContainer
      .append(
        _feedBackSubmitBtn.render().addClass('submit-button')
      )
    var _submitContainer = $('<div>')
      .css({
        'min-height':'3.2rem',
        'position':'relative'
      })
      .append(_feedbackErrorBox, _feedbackSubmitBtnContainer)
    var _formFeed = $('<div>')
      .addClass('contactForm-container')
      .append(
        $('<form>').append(_nameInput.render(), _emailInput.render(), _mexInput.render()), 
        _submitContainer.append(_feedbackErrorBox, _submitContainer)
      )

    return _formFeed;
  }


  ns.Widgets.TecnicalSupportForm = function(){
    var _errorBox = $('<p>');
    var _nameInput = Pard.Widgets.Input('Nombre*','text');
    var _emailInput = Pard.Widgets.InputEmail('Email*');
    var _subjectInput = Pard.Widgets.Input('Asunto','text');
    var _profileInput = Pard.Widgets.Input('Nombre de tu perfil en orfheo', 'text');
    // var _browserInput = Pard.Widgets.Input('Navegador que utilizas', 'text');
    var _mexInput = Pard.Widgets.TextArea('Mensaje*',6);
    var _submitBtn = Pard.Widgets.Button('Envía', function(){
      _submitBtn.disable();
      _submitBtn.setClass('disabled-button');
      _errorBox.empty();
      var spinner = new Spinner();
      spinner.spin();
      $('body').append(spinner.el);
      var filled = true;
      [_nameInput, _emailInput,_mexInput].forEach(function(input){
        if (!(input.getVal())){
          input.addWarning();
          filled = false;
        }
      });
      if (filled){
        var _profileName = Pard.UserInfo['userProfiles'] || _profileInput.getVal();
        Pard.Backend.techSupport(_nameInput.getVal(), _emailInput.getVal(), _subjectInput.getVal(), _profileName, Pard.UserInfo['browser'], _mexInput.getVal(), function(data){
          spinner.stop();
          if (data['status'] == 'success'){
            _submitBtnContainer.remove();
            _errorBox
              .empty()
              .css('text-align','right')
              .append(
                Pard.Widgets.IconManager('done').render().addClass('success-icon-check-messageSent'),
                $('<span>').text('Mensaje enviado correctamente. ').css('color','#4cb632'),
                $('<span>').html('<br>Gracias por contactar con nosotros.<br> Te contestaremos cuanto antes :)')
                  .css({
                    'color':'black',
                    'margin-bottom':'1.5rem'
                  })
              )
              .removeClass('error-text');
          }
          else{
            _submitBtn.enable();
            _submitBtn.deleteClass('disabled-button');
            _errorBox
              .empty()
              .append(
                Pard.Widgets.IconManager('attention').render().css({'font-size':'22px','vertical-align':'-.1rem'}),
                $('<span>').html('Mensaje no enviado: <br>'+data.reason)  
              ).addClass('error-text')
          }
        });
      }
      else{
        _submitBtn.enable();
        _submitBtn.deleteClass('disabled-button');
        spinner.stop()
        _errorBox
        .empty()
        .append(
          Pard.Widgets.IconManager('attention').render().css({'font-size':'22px','vertical-align':'-.1rem'}),
          $('<span>').html('Mensaje no enviado:<br> por favor, revisa los campos obligatorios')
        ).addClass('error-text');
      }
    });
    var _submitBtnContainer = $('<span>')
      .append(
        _submitBtn.render().addClass('submit-button')
      )
    var _submitContainer = $('<div>')
      .css({
        'min-height':'3.2rem',
        'position':'relative'
      });
    var _form = $('<form>').append(_nameInput.render(), _emailInput.render());
    if (!Pard.UserInfo['userProfiles']) _form.append(_profileInput.render());
    _form.append(_subjectInput.render(), _mexInput.render()); 
    var _formSupport = $('<div>').addClass('contactForm-container').append(
      _form,
      _submitContainer.append(_errorBox, _submitBtnContainer) 
    )

    return _formSupport;

  }

  ns.Widgets.BusinessForm = function(profileName){
    var _contactForm = $('<div>').addClass('contactForm-container');
    var _form = $('<form>');
    var _errorBox = $('<p>');
    var _errorBoxCont = $('<div>').append(_errorBox);
    var _nameInput = Pard.Widgets.Input('Nombre*','text');
    var _emailInput = Pard.Widgets.InputEmail('Email*');
    var _phoneInput = Pard.Widgets.InputTelContactForm('Numero de teléfono','text');
    var _phoneDayAvailabilty = Pard.Widgets.MultipleSelector(
      ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']);
      _phoneDayAvailabilty.setOptions({
        placeholder: "Selecciona tu disponibilidad durante la semana",
        selectAllText: "Todos los días",
        countSelected: false,
        allSelected: "Disponible todos los días"
      });
    var _phonePeriodAvailabilty = Pard.Widgets.MultipleSelector(
      [' Mañana', 'Tarde']);
    _phonePeriodAvailabilty.setOptions({
        placeholder: "Selecciona tu disponibilidad durante el día",
        selectAllText: "Mañana y tarde",
        countSelected: false,
        allSelected: "Disponible mañana y tarde"
      });
    var _phoneDayAvailabilityCont  = $('<div>').append(_phoneDayAvailabilty.render()).hide().addClass('availabilityContainer');
    var _phonePeriodAvailabiltyCont = $('<div>').append(_phonePeriodAvailabilty.render()).hide().addClass('availabilityContainer');
    var _showHideAvailability = function(){
      if (_checkPhone.getVal() || _checkHangout.getVal()){
        _phoneDayAvailabilityCont.show();
        _phonePeriodAvailabiltyCont.show();
      }else{
        _phoneDayAvailabilty.deselectAll();
        _phonePeriodAvailabilty.deselectAll();
        _phoneDayAvailabilityCont.hide();
        _phonePeriodAvailabiltyCont.hide();
      }
    }
    // var _projectWebInput = Pard.Widgets.InputPersonalWeb();
    var _projectWebInput = Pard.Widgets.Input('Enlace a web/redes sociales de tu proyecto','text');
    var _subjectInput = Pard.Widgets.Input('Asunto*','text');
    var _checkPhone = Pard.Widgets.CheckBox(
      'Quiero ser contactado por teléfono',
      'call_me_please', 
      function(){
      _showHideAvailability();
      }
    );
    var _checkHangout = Pard.Widgets.CheckBox(
      'Quiero una cita por Hangout/Skype',
      'hangout_me_please',
      function(){
        _showHideAvailability();
      }
    );
    var _mexInput = Pard.Widgets.TextArea('Mensaje*',6);
    var businessInputs = {
      'name': _nameInput,
      'email': _emailInput,
      'subject': _subjectInput,
      'contactPhone': _checkPhone,
      'contactHangout': _checkHangout,
      'phone': _phoneInput,
      'dayAvailabilty': _phoneDayAvailabilty,
      'periodAvailabilty': _phonePeriodAvailabilty,
      'message': _mexInput,
      'links': _projectWebInput
    }
    var _submitBtn = Pard.Widgets.Button('Envía', function(){
      _submitBtn.disable();
      _submitBtn.setClass('disabled-button');
      _errorBox.empty();
      var spinner = new Spinner();
      spinner.spin();
      $('body').append(spinner.el);
      var businessForm = {};
      for (var key in businessInputs){
        businessForm[key] = businessInputs[key].getVal();
      }
      if (businessForm['dayAvailabilty']) businessForm['dayAvailabilty'] = businessForm['dayAvailabilty'].join();
      if (businessForm['periodAvailabilty']) businessForm['periodAvailabilty'] = businessForm['periodAvailabilty'].join();
      var filled = true;
      ['name', 'email','subject','message'].forEach(function(field){
        if (!(businessForm[field])){
          businessInputs[field].addWarning();
          filled = false;
        }
      });

      if (filled){
        if (profileName) businessForm['name'] = businessForm['name'] + ' | '+profileName;
        console.log(businessForm);
        Pard.Backend.business(businessForm, function(data){
          console.log(data)
          spinner.stop();
          if (data['status'] == 'success'){
            _submitBtnContainer.remove();
            _errorBox
              .empty()
              .css('text-align','right')
              .append(
                Pard.Widgets.IconManager('done').render().addClass('success-icon-check-messageSent'),
                $('<span>').text('Mensaje enviado correctamente. ').css('color','#4cb632'),
                $('<span>').html('<br>Gracias por contactar con nosotros.<br> Te contestaremos cuanto antes :)')
                  .css({
                    'color':'black',
                    'margin-bottom':'1.5rem'
                  })
              )
              .removeClass('error-text');
          }
          else{
            _submitBtn.enable();
            _submitBtn.deleteClass('disabled-button');
            _errorBox
              .empty()
              .append(
                Pard.Widgets.IconManager('attention').render().css({'font-size':'22px','vertical-align':'-.1rem'}),
                $('<span>').html('Mensaje no enviado: <br>'+data.reason)  
              ).addClass('error-text')
          }
        });
      }
      else{
        _submitBtn.enable();
        _submitBtn.deleteClass('disabled-button');
        spinner.stop()
        _errorBox
        .empty()
        .append(
          Pard.Widgets.IconManager('attention').render().css({'font-size':'22px','vertical-align':'-.1rem'}),
          $('<span>').html('Mensaje no enviado:<br> por favor, revisa los campos obligatorios')
        ).addClass('error-text');
      }
    });
    var _submitBtnContainer = $('<span>')
    	.append(
      	_submitBtn.render().addClass('submit-button')
    	)
    var _submitContainer = $('<div>')
    	.css({
    		'min-height':'3.2rem',
    		'position':'relative'
    	});
    _form.append(
      _nameInput.render(), 
      _emailInput.render(), 
      _phoneInput.render(), 
      _checkPhone.render().addClass('checkBox-contactForm'),
      _checkHangout.render().addClass('checkBox-contactForm'),
      _phoneDayAvailabilityCont, 
      _phonePeriodAvailabiltyCont,
      _projectWebInput.render(),
      _subjectInput.render(), 
      _mexInput.render()
    );
    _contactForm.append(_form, _submitContainer.append(_errorBox, _submitBtnContainer));

    return _contactForm;
  }



}(Pard || {}));