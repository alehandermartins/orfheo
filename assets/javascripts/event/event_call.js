'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};  

  ns.Widgets.ListProfiles = function(eventInfo, button){
    return {
      render: function(data){
        if(data['status'] == 'success'){
          var _popup = Pard.Widgets.Popup();
          var _choosePorfileMex = Pard.Widgets.ChooseProfileMessage(data.profiles, eventInfo, button);
          _choosePorfileMex.setCallback(function(){_popup.close()});
          _popup.setContent('', _choosePorfileMex.render());
          _popup.setCallback(function(){
            setTimeout(function(){
              _popup.destroy();
            },500)
          });
          _popup.open();
        }
        else{
          Pard.Widgets.Alert(Pard.t.text('error.serverProblem.title'), _dataReason).render();
        }
      }
    }
  }

  ns.Widgets.ChooseProfileMessage = function(profiles, event_info, _button){

    var _call_id = event_info.call_id;
    var _createdWidget = $('<div>');
    var _closeListProfilePopup = function(){};
    var _allowed = event_info.target.map(function(type){
      return Pard.t.text('dictionary.' + type)
    });
    _createdWidget.append(
      $('<p>').append(Pard.t.text('call.initText', {types: _allowed.join(', ')})),
      $('<h4>').append(Pard.t.text('call.chooseProfile'))
    );

    var _callbackSendProposal = function(data){
      if (data['status'] == 'success'){
        var _sentProposalMex = _popupMessageSentProposal(data);
        _sentProposalMex.setCallback(function(){_popup.close()});
        var _popup = Pard.Widgets.Popup();
        _popup.setContent('',  _sentProposalMex.render());
        _popup.setCallback(function(){
          setTimeout(function(){
            _popup.destroy();
          },500);
        });
        _popup.open();
      }
      else{
        var _dataReason = Pard.ErrorHandler(data.reason);
        if (typeof  _dataReason == 'object'){
          var _popup = Pard.Widgets.Popup();
          _dataReason.setCallback(function(){
            _popup.close();
            setTimeout(function(){
              _popup.destroy();
             },500);
          });
          _popup.setContent('', _dataReason.render());
          _popup.setContentClass('alert-container-full');
          _popup.setCallback(function(){
            setTimeout(function(){
            _popup.destroy();
          },500);
          });
          _popup.open();
        }
        else{
          var _dataReason = Pard.ErrorHandler(data.reason);
          Pard.Widgets.Alert('', _dataReason);
        }
      }
    }

    var _popupMessageSentProposal = function(data){
      var _container = $('<div>');
      var _closepopup = function(){};
      var _message = $('<div>').append($('<h4>').text(Pard.t.text('call.successTitle')).addClass('success-inscription-title'),$('<h5>').text(Pard.t.text('call.succesMex')).css({
        'text-align':'center',
        'margin-bottom': '2rem'
      }));
      var _toProfilePageBtn = Pard.Widgets.Button(Pard.t.text('call.toProfile'), function(){
          location.href = '/profile?id=' + data.model['profile_id'];  
      }).render().addClass('success-inscription-btn');
      var _sendOtherProposal = Pard.Widgets.Button(Pard.t.text('call.sendOther'), function(){
          _closepopup();
          _button.trigger('click');
      }).render().addClass('success-inscription-btn');
      _container.append(_message, _toProfilePageBtn, _sendOtherProposal);
      return {
        render: function(){
          return _container;
        },
        setCallback: function(callback){
          _closepopup = callback;
        }
      }
    }

    profiles.forEach(function(profile){
      var _cardContainer = $('<div>').addClass('card-container-popup position-profileCard-login');
      var _card = Pard.Widgets.CreateCard(profile).render();
      if (event_info.target.indexOf(profile.type)<0) _card.addClass('notAllowedProfile')
      _card.removeAttr('href');
      _card.attr('href','#/');
      _card.click(function(){
        Pard.Widgets.GetCallForms(_callForms, profile, _closeListProfilePopup, _callbackSendProposal);
      });
      _createdWidget.append(_cardContainer.append(_card));
    });

    var _secondTitle = $('<h4>').text(Pard.t.text('call.newProfile'));
    _secondTitle.css({
      'margin-top': '2rem',
      'text-align': 'right'
    });
    var _createAndInscribeProfile = function(data){
      if (data['status'] == 'success'){
        var _profile = data.profile;
        Pard.Widgets.GetCallForms(_callForms, _profile, _closeListProfilePopup, _callbackSendProposal); 
        Pard.Bus.trigger('reloadMenuHeaderDropdown');
      }
      else{
        var _dataReason = Pard.ErrorHandler(data.reason);
        if (typeof _dataReason == 'object'){
          var _popup = Pard.Widgets.Popup();
          _dataReason.setCallback(function(){
            _popup.close();
            setTimeout(function(){
              _popup.destroy();
             },500)
          });
          _popup.setContent('', _dataReason.render());
          _popup.setContentClass('alert-container-full');
          _popup.setCallback(function(){
            setTimeout(function(){
              _popup.destroy();
             },500);
          });
          _popup.open();
        }
        else{ 
          console.log(data.reason);
          Pard.Widgets.Alert('', _dataReason);
        }
      }
    }

    var _createProfileCard;
    var _callForms;
    Pard.Backend.getCallForms(event_info.call_id, function(data){
      _callForms = data.forms;
      _createProfileCard = Pard.Widgets.CreateProfileCard(
        Pard.t.text('call.createProfile.title'),
        Pard.Widgets.CreateProfilePopupEvent(_createAndInscribeProfile)
      ).render();
      var _cardContainer = $('<div>').addClass('card-container-popup position-profileCard-login');
      //var _createProfileCardContainer = $('<div>').append(_createProfileCard).addClass('card-container-popup');
      _cardContainer.append(_createProfileCard);
      _createdWidget.append(_cardContainer.append(_createProfileCard), _secondTitle);
      //_createdWidget.append(_secondTitle, _createProfileCardContainer);
    });

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closeListProfilePopup = callback;
      }
    } 
  }

  ns.Widgets.CreateProfilePopupEvent = function(callbackEvent){
    var _createdWidget = $('<div>').css({
      'margin-top': '1.5rem',
      'text-align': 'center'
    });
    var allowedProfile = Pard.CachedEvent['target'];

    var _spaceButton = Pard.Widgets.CreateTypeProfile('space', callbackEvent).render().addClass('create-space-btn-popup');
    var _artistButton = Pard.Widgets.CreateTypeProfile('artist', callbackEvent).render().addClass('create-artist-btn-popup');
    var _organizationButton = Pard.Widgets.CreateTypeProfile('organization', callbackEvent).render().addClass('create-organization-btn-popup');

    _spaceButton.append(
      $('<p>')
      .html(Pard.t.text('call.createProfile.spaceText'))
      .css({
        'margin-top':'0.5rem',
        'margin-bottom': '0'
      })
    );
    _artistButton.append(
      $('<p>')
        .html(Pard.t.text('call.createProfile.artistText'))
        .css({
          'margin-top':'0.5rem',
          'margin-bottom': '0'
        })
      );
    _organizationButton.append(
      $('<p>')
      .html(Pard.t.text('call.createProfile.organizationText'))
      .css({
        'margin-top':'0.5rem',
        'margin-bottom': '0'
      })
    );

    var _btnObj = {
      artist: _artistButton,
      space: _spaceButton,
      organization: _organizationButton
    }
    
    for (var typeProfile in _btnObj) {
      if (allowedProfile){
        if($.inArray(typeProfile,allowedProfile)>-1) _createdWidget.append(_btnObj[typeProfile]);
      }
      else {_createdWidget.append(_btnObj[typeProfile]);}
    }

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _spaceButton.on('click',function(){
            callback();
        });
        _artistButton.on('click',function(){
            callback();
        });
        _organizationButton.on('click',function(){
          callback();
        });
      }
    }
  }

  ns.Widgets.GetCallForms = function(callForms, profile, closeListProfilePopup, callbackSendProposal){
    var eventInfo = Pard.CachedEvent;
    var _content = $('<div>').addClass('very-fast reveal full top-position').attr('id','popupForm');
    _content.empty();
    $('body').append(_content);
    var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', multipleOpened:true});
    var _message = Pard.Widgets.PopupContent(eventInfo.name, Pard.Widgets.FormManager(callForms, profile, closeListProfilePopup, callbackSendProposal));
    _message.setCallback(function(){
      _popup.close();
      setTimeout(function(){
        _popup.destroy();
        _content.remove();
      },500)
    });
    _content.append(_message.render());
    _popup.open();
  };
 

  ns.Widgets.FormManager = function(forms, profile, closeListProfilePopup, callbackSendProposal){
    var _createdWidget = $('<div>');
    var _typeFormsCatArray = Pard.CachedEvent.target;
    
    if($.inArray(profile.type, _typeFormsCatArray) < 0){
      var _okProfiles = '';
      _typeFormsCatArray.forEach(function(type,index){
        if(type != 'call_id') {
          _okProfiles += ' ' + Pard.t.text('dictionary.' + type);
          if (index<_typeFormsCatArray.length-2) _okProfiles += ','; 
          else if (index == _typeFormsCatArray.length-2) _okProfiles += ' y';
        }
      });
      _createdWidget.append($('<p>').text(Pard.t.text('call.stop.title')), $('<p>').html(Pard.t.text('call.stop.mex1')+_okProfiles+Pard.t.text('call.stop.mex2')).css({'font-size':'1rem'}));
    }
    else{
      closeListProfilePopup();
      var _type;
      var _performerBtn = $('<button>')
        .addClass('choose-type-btn-callEvent')
        .attr('type','button')
        .append(
          Pard.Widgets.IconManager('performer').render().css('vertical-align','middle'),
          $('<span>').text(Pard.t.text('call.form.perfomerbtn')).css('vertical-align','middle'))
        .click(function(){
          $('.active').removeClass('active');
          _performerBtn.addClass('active');
          _type = 'artist';
          loadFormSelector();
        });
      var _alreadyInscribed = false;
      if (profile.proposals && profile.proposals.space && profile.proposals.space.length){
        profile.proposals.space.some(function(proposal){
          if (proposal.event_id == Pard.CachedEvent.event_id) {
            _alreadyInscribed = true;
            return true;
          }
        })
      }
      var _stageBtn = $('<button>')
        .addClass('choose-type-btn-callEvent')
        .attr('type','button')
        .append(
          Pard.Widgets.IconManager('stage').render().css('vertical-align','middle'),
          $('<span>').text(Pard.t.text('call.form.stagebtn')).css('vertical-align','middle'))
        .click(function(){
          if (_alreadyInscribed) {
              Pard.Widgets.Alert(Pard.t.text('call.alreadyInscribed.title'), Pard.t.text('call.alreadyInscribed.mex'));
          }
          else{
            $('.active').removeClass('active');
            _stageBtn.addClass('active');
            _type = 'space';
            loadFormSelector();
          }
        });
      if (_alreadyInscribed) _stageBtn.addClass('disabled-button');  
      var _typeButtons = $('<div>').append(_stageBtn, _performerBtn).css('margin-bottom','2rem');
      var _chooseType = $('<div>').append(
        $('<p>')
          .text(Pard.t.text('call.form.chooseHow')).css('font-size','1rem'),
        _typeButtons);
      var _initialMexText = Pard.t.text('call.form.initMex', {link: '<a href="/profile?id='+profile.profile_id + ', target="_blank">'+ profile.name +'</a>', organizer: Pard.CachedEvent.organizer});
      var _initialMex = $('<p>').html(_initialMexText).css('margin-bottom','1.5rem');

      var _closepopup = {};
      var _production_id;

      var _formTypeConstructor = Pard.Widgets.CallForm;

      var _outerFormBox = $('<div>');
      var _formTypeSelectorCont = $('<div>');
      var _formTypeOptionsCont = $('<div>');
      var _contentSel = $('<div>');
      var _formTypes = [];
      var _acceptedCategories = {
        'artist': Pard.CachedEvent.categories['artist']
      };
      var _formTypeSelector = $('<select>');

      var loadFormSelector = function(){
        _formTypes = [];
        _contentSel.empty();
        _formTypeSelectorCont.empty();
        $('#popupForm').addClass('top-position');
        _formTypeSelector = $('<select>');
        var _emptyOption = $('<option>').text(Pard.t.text('call.form.catPlaceholder')).val('');
        _formTypeSelector.append(_emptyOption);
        var _typeData = [];
        for (var typeForm in forms[_type]){
          _formTypes.push(typeForm);
          var _icon;
          if(_type == 'artist') _icon = Object.keys(forms[_type][typeForm].blocks.category.args);
          _typeData.push({
            id: typeForm,
            icon: _icon,
            text: forms[_type][typeForm].label
          });
        };
        if(_formTypes.length == 1) _printForm(_formTypes[0]);
        else{
          _formTypeSelectorCont.append(_formTypeSelector);
          _formTypeSelector.select2({
            minimumResultsForSearch: Infinity,
            data: _typeData,
            templateResult: Pard.Widgets.FormatResource,
            placeholder: Pard.t.text('call.form.catPlaceholder'),
            dropdownCssClass: 'orfheoTypeFormSelector'
          });
          _formTypeSelector.on('change',function(){
            if (_formTypeSelector.val()){
              $('.xbtn-production-event-page').remove();
              $('#popupForm').removeClass('top-position');
              $('.content-form-selected').removeClass('content-form-selected');
              _formTypeSelector.addClass('content-form-selected').css('font-weight','normal');
              _printForm(_formTypeSelector.val());
            }
          });
        }
        showProductions();
      }

      var _prodContainer = $('<div>')

      _outerFormBox.append(_prodContainer, _formTypeSelectorCont,_formTypeOptionsCont);

      var showProductions = function(){
        _prodContainer.empty();
        if(_type == 'artist' && profile.productions && profile.productions.length){
          var _t1 = $('<div>')
            .append(
              $('<h6>').text(Pard.t.text('call.form.portfolio'))
            )
            .css({
              'margin-top':'1.5rem',
              'margin-bottom':'1rem'
            });
          var _t2 = $('<div>')
            .append(
              $('<h6>').text(Pard.t.text('call.form.newProposal'))
            )
            .css({
              'margin-bottom':'1rem'
            });
          _prodContainer.addClass('prodContainer-event-page');
          _prodContainer.append(_t1);
          var _compatibleProductions = false;
          profile.productions.forEach(function(production){
            if ($.inArray(production.category, _acceptedCategories.artist) >- 1){
              var _prodBtn = $('<div>').addClass('production-nav-element-container production-btn-event-page');
              var _iconColumn = $('<div>')
                .addClass(' icon-column')
                .append(
                  $('<div>').addClass('nav-icon-production-container')
                    .append($('<div>').addClass('production-icon-container')
                      .append(Pard.Widgets.IconManager(production['category']).render().css({'text-align': 'center', display:'block'})
                      )
                    )
                );
              _iconColumn.css({
                'padding':'0.2rem'
              });
              var _nameColumn = $('<div>').addClass('name-column name-column-production-nav').css('margin-top', '-0.4rem');
              var _name = $('<p>').text(production['title']).addClass('profile-nav-production-name');
              _prodBtn.append(
                _iconColumn, 
                _nameColumn.append(Pard.Widgets.FitInBox(_name,125,45).render())
              );
              _prodContainer.append(_prodBtn);
              _compatibleProductions = true;
              _prodBtn.click(function(){
                _contentSel.empty();
                if (_prodBtn.hasClass('content-form-selected')){
                  $('.content-form-selected').removeClass('content-form-selected');
                  $('.xbtn-production-event-page').remove();
                  $('#popupForm').addClass('top-position');
                  _formTypeSelector.show();
                  _formTypeSelector.attr('disabled',false);
                  _production_id = false;
                  _formTypeSelector.val('').trigger('change');
                  _t2.show();
                  loadFormSelector();
                }
                else{
                  var _xbtn = $('<span>').addClass('material-icons xbtn-production-event-page').html('&#xE888');
                  $('.xbtn-production-event-page').remove();                 
                  $('#popupForm').addClass('top-position');
                  $('.content-form-selected').removeClass('content-form-selected');
                  _prodBtn.append(_xbtn);
                    _prodBtn.addClass('content-form-selected');
                  _production_id = production.production_id;
                  var _catProduction = production.category;
                  var formsKey = Object.keys(forms.artist).filter(function(formcat){
                    return $.inArray( _catProduction, Object.keys(forms.artist[formcat].blocks.category.args)) >= 0;
                  });
                  if (formsKey.length == 1){            
                    var _form = _formTypeConstructor(_type, forms[_type][formsKey[0]], profile, formsKey[0], _production_id, callbackSendProposal);
                    _formTypeSelectorCont.empty();
                    _formTypeSelector = $('<select>');
                    var _emptyOption = $('<option>').text(Pard.t.text('call.form.catPlaceholder')).val('');
                    _formTypeSelector.append(_emptyOption);
                    formsKey.forEach(function(typeForm){
                      _formTypes.push(typeForm);
                      _formTypeSelector.append($('<option>').val(typeForm).text(forms.artist[typeForm].label));
                      _formTypeSelectorCont.append(_formTypeSelector);
                      
                    });
                    _formTypeSelector
                      .select2({
                        minimumResultsForSearch: Infinity,
                        dropdownCssClass: 'orfheoTypeFormSelector',
                        placeholder: Pard.t.text('call.form.catPlaceholder')
                      })
                    _formTypeSelector.val(formsKey[0]);
                    _formTypeSelector.trigger('change');
                    _formTypeSelector.attr('disabled',true);
                    _t2.hide();
                    _form.setVal(production);
                    _form.setCallback(function(){
                      _closepopup();
                    });
                    _contentSel.append(_form.render());
                    $('#popupForm').removeClass('top-position');
                  }
                  else if(formsKey.length>1){
                    _t2.hide(); 
                    _formTypeSelectorCont.empty();
                    _formTypeSelector = $('<select>');
                    var _emptyOption = $('<option>').text(Pard.t.text('call.form.catPlaceholder')).val('');
                    _formTypeSelector.append(_emptyOption);
                    formsKey.forEach(function(typeForm){
                      _formTypes.push(typeForm);
                      _formTypeSelector.append($('<option>').text(forms.artist[typeForm].label).val(typeForm));
                      _formTypeSelectorCont.append(_formTypeSelector);
                    });
                    _formTypeSelector
                      .select2({
                        minimumResultsForSearch: Infinity,
                        dropdownCssClass: 'orfheoTypeFormSelector',
                        placeholder: Pard.t.text('call.form.catPlaceholder')
                        // allowClear: true
                      })
                      .on('change',function(){
                        if (_formTypeSelector.val()){
                          $('#popupForm').removeClass('top-position');
                          _formTypeSelector.addClass('content-form-selected').css('font-weight','normal');
                          if (_t2) _t2.show();
                          _printForm(_formTypeSelector.val(), production, _production_id);
                        }
                      });
                  }
                  else{
                    if (_t2) _t2.hide();
                    var _xbtn = $('<span>').addClass('material-icons xbtn-production-event-page').html('&#xE888');
                    _prodBtn.append(_xbtn);
                    var _formTypeOptionsSelector = $('<select>');
                    var _emptyOpt = $('<option>').text(Pard.t.text('call.form.catPlaceholder')).val('');
                    _formTypeOptionsSelector.append(_emptyOpt);
                    for (var typeForm in forms[profile.type]){
                      if( $.inArray(production.category, forms[profile.type][typeForm].category) > -1){ 
                        _formTypeOptionsSelector.append($('<option>').text(typeForm).val(typeForm));
                      }
                    }
                    _formTypeSelector.hide();
                    _formTypeOptionsSelector.on('change', function(){
                      _printForm(_formTypeOptionsSelector.val(), production);
                    });
                    _formTypeOptionsCont.append(_formTypeOptionsSelector);
                    _formTypeOptionsSelector.select2({
                      minimumResultsForSearch: Infinity,
                      dropdownCssClass: 'orfheoTypeFormSelector',
                      placeholder: Pard.t.text('call.form.catPlaceholder')
                      // allowClear: true
                    });

                  }
                }
              })
            }
          });
          if (_compatibleProductions) _prodContainer.append(_t2) ;
        }
      }

      var _printForm = function(_typeFormSelected, production, production_id){
        _contentSel.empty();
        if (production_id) _production_id = production_id;
        else _production_id = false;
        var _form = _formTypeConstructor(_type, forms[_type][_typeFormSelected], profile, _typeFormSelected, _production_id, callbackSendProposal);
        _form.setCallback(function(){
          _closepopup();
        });
        if (production) _form.setVal(production); 
        _contentSel.append(_form.render());
      };

      _createdWidget.append(_initialMex)
      if (profile.type == 'organization' || profile.type == 'space') {
        _createdWidget.append(_chooseType)
      }
      else {
        _type = 'artist';
        loadFormSelector();
      };
      _createdWidget.append(_outerFormBox.append(_contentSel));
    }

    return{
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      }
    }
  }

  ns.Widgets.CallForm = function(type, form, profile, form_category, production_id, callbackSendProposal){

    var _createdWidget = $('<div>');
    var _formContainer = $('<form>').addClass('popup-form');

    var _initial_message_spa = $('<div>').append($('<p>').text(Pard.t.text('call.form.initSpace')).addClass('m-artistCall')).addClass('message-call');
    var _initial_message_art = $('<div>').append($('<p>').html(Pard.t.text('call.form.partI')).addClass('m-artistCall')).addClass('message-call');
    var _message_2 = $('<div>').append($('<p>').text(Pard.t.text('call.form.partII')).addClass('m-artistCall')).addClass('message-call');
    var _finalMessage =  $('<p>').html(Pard.t.text('call.form.finalMex')).css({'margin-top':'1rem','margin-bottom':'2rem'});
    var _messageDictionary = {
      artist: _initial_message_art,
      space: _initial_message_spa
    }

    var _message_1 = _messageDictionary[type]; 
    var _invalidInput = $('<div>').addClass('not-filled-text');

    var _containerOrfheoFields = $('<div>').append(form.helptext, _message_1);
    var _containerCustomFields = $('<div>');
    if (type == 'artist' ) _containerCustomFields.append(_message_2.css('margin-top','3rem'));
    _formContainer.append(_containerOrfheoFields, _containerCustomFields);

    var _orfheoCategory, _subcategory;
    if (type == 'space' && profile.category) _orfheoCategory = profile.category; 
    var _photos;
    var _availability;
    var _children;
    var _conditions;

    var _form = {};
    var _submitForm = {};
    var _submitBtnContainer = $('<div>').addClass('submit-btn-container');
    var submitButton = $('<button>').addClass('submit-button').attr({type: 'button'}).html(Pard.t.text('dictionary.send').capitalize());

    var _phoneField = {
      "type" : "mandatory",
      "label" : Pard.t.text('widget.inputTel.label'),
      "input" : "InputTel",
      "args" : [ 
          ""
      ],
      "helptext" : Pard.t.text('widget.inputTel.helptext')
    }

    var _tempForm = {};
    if(type == 'space'){
      Object.keys(form.blocks).forEach(function(field){
        _tempForm[field] = form.blocks[field];
        if(field == 'subcategory') _tempForm['phone'] = _phoneField;
      });
    }
    if(type == 'artist'){
      Object.keys(form.blocks).forEach(function(field){
        _tempForm[field] = form.blocks[field];
        if(field == 'short_description') _tempForm['phone'] = _phoneField;
      });
    }

    var CategorySelector = function(block){
      var _formField = $('<div>').addClass('CategorySelector-FormField call-form-field')
      var _input = $('<select>')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)

      var catArrayTranslated = Object.keys(block.args).map(function(cat){
        return Pard.t.text('categories.'+ cat)
      })

      Object.keys(block.args).forEach(function(value, index){
        _input.append($('<option>').append(catArrayTranslated[index]).val(value))
      })
      _input.on('change',function(){
        _input.removeClass('warning')
        if(block.args[_input.val()] && block.args[_input.val()].activateOptions){
          Object.keys(block.args[_input.val()].activateOptions).forEach(function(field){
            _form[field].input.reload(block.args[_input.val()].activateOptions[field])
          })
        }
      })
      .one('click',function(){
        _input.removeClass('placeholderSelect')
      })
      
      _formField.append(_label, _input, _helptext)
    
      if(Object.keys(block.args).length > 1 && production_id != false){
        profile.productions.forEach(function(production){
          if(production.production_id == production_id){
            _orfheoCategory = production.category
            _input.val(_orfheoCategory)
          }
        })
      }
      if(Object.keys(block.args).length == 1)
        _orfheoCategory = Object.keys(block.args)[0]

      return {
        render: function(){
          if (Object.keys(block.args).length > 1 && production_id == false)
            return _formField
        },
        getVal: function(){
          return _input.val()
        },
        addWarning: function(){
          _input.addClass('warning')
        },
        removeWarning: function(){
          _input.removeClass('warning')
        },
        setVal: function(value){
          _input.val(value)
        },
        activate: function(){
          if(block.args[_input.val()] && block.args[_input.val()].activateOptions){
            Object.keys(block.args[_input.val()].activateOptions).forEach(function(field){
              _form[field].input.reload(block.args[_input.val()].activateOptions[field])
            });
          }
        }
      }
    }

    var SubcategorySelector = function(block){
      var _formField = $('<div>').addClass('SubcategorySelector-FormField call-form-field')
      var _input = $('<select>')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)

      Object.keys(block.args).forEach(function(value){
        _input.append($('<option>').append(block.args[value]).val(value))
      })

      _input.on('change',function(){
        _input.removeClass('warning')
      })
      .one('click',function(){
        _input.removeClass('placeholderSelect')
      })
      
      _formField.append(_label, _input, _helptext)

      if (Object.keys(block.args).length == 1)
        _subcategory = Object.keys(block.args)[0]

      return {
        render: function(){
          if (Object.keys(block.args).length > 1)
            return _formField
        },
        getVal: function(){
          return _input.val()
        },
        addWarning: function(){
          _input.addClass('warning')
        },
        removeWarning: function(){
          _input.removeClass('warning')
        },
        setVal: function(value){
          _input.val(value)
        }
      }
    }

    var Selector = function(block){
      var _formField = $('<div>').addClass('Selector-FormField call-form-field')
      var _input = $('<select>')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)
      Object.keys(block.args).forEach(function(value){
        _input.append($('<option>').append(block.args[value]).val(value))
      })
      _input.on('change',function(){
        _input.removeClass('warning')
      })
      .one('click',function(){
        _input.removeClass('placeholderSelect')
      })

      _formField.append(_label, _input, _helptext)

      return {
        render: function(){
          return _formField
        },
        getVal: function(){
          return _input.val()
        },
        addWarning: function(){
          _input.addClass('warning')
        },
        removeWarning: function(){
          _input.removeClass('warning')
        },
        setVal: function(value){
          _input.val(value)
        },
        reload: function(new_choices){
          var old_val = _input.val()
          if (new_choices == 'all') new_choices = Object.keys(block.args)
          _input.empty()
          new_choices.forEach(function(value){
            _input.append($('<option>').append(block.args[value]).val(value))
          })
          if($.inArray(old_val, new_choices)){
            _input.val(old_val)
            _input.trigger('change')
          }
        }
      }
    }

    var MultipleSelector = function(block){
      var _formField = $('<div>').addClass('MultipleSelector-FormField call-form-field')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _input = $('<select>').attr("multiple", "multiple")
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)
      Object.keys(block.args).forEach(function(value){
        _input.append($('<option>').text(block.args[value]).val(value))
      })

      _input.on('change',function(){
        _input.next().find('.ms-choice').removeClass('warning')
      })
      var _options = {      
        placeholder: Pard.t.text('widget.multipleSelector.placeholder'),
        selectAll: Pard.t.text('widget.multipleSelector.selectAllText'),
        countSelected: false,
        allSelected: Pard.t.text('widget.multipleSelector.allSelected')
      }

      _formField.append(_label, _input, _helptext)
      _helptext.css('margin-top', 5)

      return {
        render: function(){
          _input.multipleSelect(_options)
          return _formField
        },
        getVal: function(){
          return _input.val()
        },
        setVal: function(values){
          _input.multipleSelect('setSelects', values)
        },
        addWarning: function(){
          _input.next().find('.ms-choice').addClass('warning')
        },
        removeWarning: function(){
          _input.next().find('.ms-choice').removeClass('warning')
        },
        deselectAll: function(){
          _input.multipleSelect("uncheckAll")
        }
      }
    }

    var MultipleDaysSelector = function(block){
      var _formField = $('<div>').addClass('MultipleDaysSelector-FormField call-form-field')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _input = $('<select>').attr("multiple", "multiple")
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)
      var _arrayDays = []
      block.args.forEach(function(value){
        var _newDate = new Date(parseInt(value));
        var _day = moment(_newDate).locale(Pard.Options.language()).format('dddd DD/MM/YYYY')
        _input.append($('<option>').text(_day).val(value))
        _arrayDays.push(moment(_newDate).locale(Pard.Options.language()).format('YYYY-MM-DD'))
      })
      _input.on('change',function(){
        _input.next().find('.ms-choice').removeClass('warning')
      })

      var _options = {
        placeholder: Pard.t.text('widget.availability.placeholder'),
        selectAllText: Pard.t.text('widget.availability.selectAllText'),
        countSelected: false,
        allSelected: Pard.t.text('widget.availability.allSelected')
      }

      _formField.append(_label, _input, _helptext)
      _helptext.css('margin-top', 5)

      return {
        render: function(){
          _input.multipleSelect(_options)
          return _formField
        },
        getVal: function(){
          if(_input.val()){
            return _input.val().map(function(val){
              return moment(new Date(parseInt(val))).locale(Pard.Options.language()).format('YYYY-MM-DD')
            })
          }
        },
        setVal: function(values){
          var _values = []
          values.forEach(function(value){
            var _index = _arrayDays.indexOf(value)
            if (_index>-1) _values.push(block.args[_index])
          })
          _input.multipleSelect("setSelects", _values)
        },
        addWarning: function(){
          _input.next().find('.ms-choice').addClass('warning')
        },
        removeWarning: function(){
          _input.next().find('.ms-choice').removeClass('warning')
        }
      }
    }

    var Duration = function(block){
      var _formField = $('<div>').addClass('Selector-FormField call-form-field')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _input = $('<select>')
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)

      Object.keys(block.args).forEach(function(value){
        _input.append($('<option>').append(block.args[value]).val(value))
      })
      _input.on('change',function(){
        _input.removeClass('warning')
      })
      .one('click',function(){
        _input.removeClass('placeholderSelect')
      })

      _formField.append(_label, _input, _helptext)

      return {
        render: function(){
          return _formField
        },
        getVal: function(){
          return _input.val()
        },
        addWarning: function(){
          _input.addClass('warning')
        },
        removeWarning: function(){
          _input.removeClass('warning')
        },
        setVal: function(value){
          _input.val(value)
        },
        reload: function(new_choices){
          var old_val = _input.val()
          if (new_choices == 'all') new_choices = Object.keys(block.args)
          _input.empty()
          new_choices.forEach(function(value){
            _input.append($('<option>').append(block.args[value]).val(value))
          })
          if($.inArray(old_val, new_choices)){
            _input.val(old_val)
            _input.trigger('change')
          }
        }
      }
    }

    var Links = function(block){
      var _formField = $('<div>').addClass('Input-FormField call-form-field')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _input = $('<input>').attr({'type': 'text'})
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)

      _input.on('input',function(){
        _input.removeClass('warning')
      });

      _input.on('focus', function(){
        if($(window).width()<1024){
          if ($('.reveal[aria-hidden="false"]').html()){
            var _distanceInputTop = _input.offset().top
            var _popupOpened = _input.closest('.reveal[aria-hidden="false"]')
            var _scroolTop = _popupOpened.scrollTop()
            var _distanceToDo = _distanceInputTop + _scroolTop - 120 
            _popupOpened.scrollTop(_distanceToDo)
          }
        }
      })

      _formField.append(_label, _input, _helptext)

      return{
        render: function(){
          return _formField
        },
        getVal: function(){
          return _input.val()
        },
        setVal: function(value){
          _input.val(value)
        },
        addWarning: function(){
          _input.addClass('warning')
        },
        removeWarning: function(){
          _input.removeClass('warning')
        }
      }
    }

    var CheckBox = function(block){
      var _formField = $('<div>').addClass('CheckBox-FormField call-form-field')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _input = $('<input>').attr({type: 'checkbox'})
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)

      _input.on('change', function(){
        _input.removeClass('checkBox-warning')
      })

      _formField.append(_input, _label, _helptext)
      _label.css('display','inline')
      _helptext.css({'margin-top':'0'})

      return {
        render: function(){
          return _formField
        },
        getVal: function(){
          return _input.is(":checked")
        },
        setVal: function(val){
          if (val && val != 'false'){ _input.attr('checked', val)}
          if (val === false){_input.attr('checked', false)}
        },
        addWarning: function(){
          _input.addClass('checkBox-warning')
        },
        removeWarning: function(){
          _input.removeClass('checkBox-warning')
        },
        conditions:function(){
          _helptext.html($('<a>').text('(Ver condiciones)').attr({'href': Pard.CachedEvent.conditions, 'target':'_blank'}))
        }
      }
    }

    var Text = function(block){
      var _formField = $('<div>').addClass('Input-FormField call-form-field')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _input = $('<input>').attr({'type': 'text'})
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)

      _input.on('input',function(){
        _input.removeClass('warning')
      });

      _input.on('focus', function(){
        if($(window).width()<1024){
          if ($('.reveal[aria-hidden="false"]').html()){
            var _distanceInputTop = _input.offset().top
            var _popupOpened = _input.closest('.reveal[aria-hidden="false"]')
            var _scroolTop = _popupOpened.scrollTop()
            var _distanceToDo = _distanceInputTop + _scroolTop - 120 
            _popupOpened.scrollTop(_distanceToDo)
          }
        }
      })

      _formField.append(_label, _input, _helptext)
      _label.css('display','inline')

      return{
        render: function(){
          return _formField
        },
        getVal: function(){
          return _input.val()
        },
        setVal: function(value){
          _input.val(value)
        },
        addWarning: function(){
          _input.addClass('warning')
        },
        removeWarning: function(){
          _input.removeClass('warning')
        }
      }
    }

    var TextArea = function(block){
      var _formField = $('<div>').addClass('TextArea-FormField call-form-field')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _input = $('<textarea>').attr({'type': 'text', 'rows': 4})
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)

      if(block.placeholder)
        _input.attr('placeholder', block.placeholder)

      _input.on('input',function(){
        _input.removeClass('warning')
      });

      _input.on('focus', function(){
        if($(window).width()<1024){
          if ($('.reveal[aria-hidden="false"]').html()){
            var _distanceInputTop = _input.offset().top
            var _popupOpened = _input.closest('.reveal[aria-hidden="false"]')
            var _scroolTop = _popupOpened.scrollTop()
            var _distanceToDo = _distanceInputTop + _scroolTop - 120 
            _popupOpened.scrollTop(_distanceToDo)
          }
        }
      })

      _formField.append(_label, _input, _helptext)
      _label.css('display','inline')

      return{
        render: function(){
          return _formField
        },
        getVal: function(){
          return _input.val()
        },
        setVal: function(value){
          _input.val(value)
        },
        addWarning: function(){
          _input.addClass('warning')
        },
        removeWarning: function(){
          _input.removeClass('warning')
        }
      }
    }

    var TextAreaEnriched = function(block){
      var _formField = $('<div>').addClass('TextArea-FormField call-form-field')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _input = $('<textarea>').attr({'type': 'text', 'rows': 4})
      var _helptext = $('<p>').addClass('help-text').html(block.helptext)
      var _textAreaContainer = $('<div>')

      _input.on('focus', function(){
        if($(window).width()<1024){
          if ($('.reveal[aria-hidden="false"]').html()){
            var _distanceInputTop = _textarea.offset().top
            var _popupOpened = _textarea.closest('.reveal[aria-hidden="false"]')
            var _scroolTop = _popupOpened.scrollTop()
            var _distanceToDo = _distanceInputTop + _scroolTop - 120 
            _popupOpened.scrollTop(_distanceToDo)
          }
        }
      })

      _textAreaContainer.append(_input).addClass('TextAreaEnrichedContainer');

      if ($('#trumbowyg-icons').html()){}
      else{
        $('body').append($('<div>').css('display','none').attr('id','trumbowyg-icons')
          .append('<svg xmlns="http://www.w3.org/2000/svg"><symbol id="trumbowyg-strong" viewBox="0 0 72 72"><path d="M51.1 37.8c-1.1-1.4-2.5-2.5-4.2-3.3 1.2-.8 2.1-1.8 2.8-3 1-1.6 1.5-3.5 1.5-5.3 0-2-.6-4-1.7-5.8-1.1-1.8-2.8-3.2-4.8-4.1-2-.9-4.6-1.3-7.8-1.3h-16v42h16.3c2.6 0 4.8-.2 6.7-.7 1.9-.5 3.4-1.2 4.7-2.1 1.3-1 2.4-2.4 3.2-4.1.9-1.7 1.3-3.6 1.3-5.7.2-2.5-.5-4.7-2-6.6zM40.8 50.2c-.6.1-1.8.2-3.4.2h-9V38.5h8.3c2.5 0 4.4.2 5.6.6 1.2.4 2 1 2.7 2 .6.9 1 2 1 3.3 0 1.1-.2 2.1-.7 2.9-.5.9-1 1.5-1.7 1.9-.8.4-1.7.8-2.8 1zm2.6-20.4c-.5.7-1.3 1.3-2.5 1.6-.8.3-2.5.4-4.8.4h-7.7V21.6h7.1c1.4 0 2.6 0 3.6.1s1.7.2 2.2.4c1 .3 1.7.8 2.2 1.7.5.9.8 1.8.8 3-.1 1.3-.4 2.2-.9 3z"/></symbol><symbol id="trumbowyg-em" viewBox="0 0 72 72"><path d="M26 57l10.1-42h7.2L33.2 57H26z"/></symbol><symbol id="trumbowyg-fullscreen" viewBox="0 0 72 72"><path d="M25.2 7.1H7.1v17.7l6.7-6.5 10.5 10.5 4.5-4.5-10.4-10.5zM47.2 7.1l6.5 6.7-10.5 10.5 4.5 4.5 10.5-10.4 6.7 6.8V7.1zM47.7 43.2l-4.5 4.5 10.4 10.5-6.8 6.7h18.1V47.2l-6.7 6.5zM24.3 43.2L13.8 53.6l-6.7-6.8v18.1h17.7l-6.5-6.7 10.5-10.5z"/><path fill="currentColor" d="M10.7 28.8h18.1V11.2l-6.6 6.4L11.6 7.1l-4.5 4.5 10.5 10.5zM60.8 28.8l-6.4-6.6 10.5-10.6-4.5-4.5-10.5 10.5-6.7-6.9v18.1zM60.4 64.9l4.5-4.5-10.5-10.5 6.9-6.7H43.2v17.6l6.6-6.4zM11.6 64.9l10.5-10.5 6.7 6.9V43.2H11.1l6.5 6.6L7.1 60.4z"/></symbol><symbol id="trumbowyg-link" viewBox="0 0 72 72"><path d="M30.9 49.1l-6.7 6.7c-.8.8-1.6.9-2.1.9s-1.4-.1-2.1-.9l-5.2-5.2c-1.1-1.1-1.1-3.1 0-4.2l6.1-6.1.2-.2 6.5-6.5c-1.2-.6-2.5-.9-3.8-.9-2.3 0-4.6.9-6.3 2.6L10.8 42c-3.5 3.5-3.5 9.2 0 12.7l5.2 5.2c1.7 1.7 4 2.6 6.3 2.6s4.6-.9 6.3-2.6l6.7-6.7C38 50.5 38.6 46.3 37 43l-6.1 6.1zM38.5 22.7l6.7-6.7c.8-.8 1.6-.9 2.1-.9s1.4.1 2.1.9l5.2 5.2c1.1 1.1 1.1 3.1 0 4.2l-6.1 6.1-.2.2-6.5 6.5c1.2.6 2.5.9 3.8.9 2.3 0 4.6-.9 6.3-2.6l6.7-6.7c3.5-3.5 3.5-9.2 0-12.7l-5.2-5.2c-1.7-1.7-4-2.6-6.3-2.6s-4.6.9-6.3 2.6l-6.7 6.7c-2.7 2.7-3.3 6.9-1.7 10.2l6.1-6.1z"/><path d="M44.1 30.7c.2-.2.4-.6.4-.9 0-.3-.1-.6-.4-.9l-2.3-2.3c-.2-.2-.6-.4-.9-.4-.3 0-.6.1-.9.4L25.8 40.8c-.2.2-.4.6-.4.9 0 .3.1.6.4.9l2.3 2.3c.2.2.6.4.9.4.3 0 .6-.1.9-.4l14.2-14.2z"/></symbol><symbol id="trumbowyg-ordered-list" viewBox="0 0 72 72"><path d="M27 14h36v8H27zM27 50h36v8H27zM27 32h36v8H27zM11.8 15.8V22h1.8v-7.8h-1.5l-2.1 1 .3 1.3zM12.1 38.5l.7-.6c1.1-1 2.1-2.1 2.1-3.4 0-1.4-1-2.4-2.7-2.4-1.1 0-2 .4-2.6.8l.5 1.3c.4-.3 1-.6 1.7-.6.9 0 1.3.5 1.3 1.1 0 .9-.9 1.8-2.6 3.3l-1 .9V40H15v-1.5h-2.9zM13.3 53.9c1-.4 1.4-1 1.4-1.8 0-1.1-.9-1.9-2.6-1.9-1 0-1.9.3-2.4.6l.4 1.3c.3-.2 1-.5 1.6-.5.8 0 1.2.3 1.2.8 0 .7-.8.9-1.4.9h-.7v1.3h.7c.8 0 1.6.3 1.6 1.1 0 .6-.5 1-1.4 1-.7 0-1.5-.3-1.8-.5l-.4 1.4c.5.3 1.3.6 2.3.6 2 0 3.2-1 3.2-2.4 0-1.1-.8-1.8-1.7-1.9z"/></symbol><symbol id="trumbowyg-unordered-list" viewBox="0 0 72 72"><path d="M27 14h36v8H27zM27 50h36v8H27zM9 50h9v8H9zM9 32h9v8H9zM9 14h9v8H9zM27 32h36v8H27z"/></symbol><symbol id="trumbowyg-view-html" viewBox="0 0 72 72"><path fill="none" stroke="currentColor" stroke-width="8" stroke-miterlimit="10" d="M26.9 17.9L9 36.2 26.9 54M45 54l17.9-18.3L45 17.9"/></symbol><symbol id="trumbowyg-base64" viewBox="0 0 72 72"><path d="M64 17v38H8V17h56m8-8H0v54h72V9z"/><path d="M29.9 28.9c-.5-.5-1.1-.8-1.8-.8s-1.4.2-1.9.7c-.5.4-.9 1-1.2 1.6-.3.6-.5 1.3-.6 2.1-.1.7-.2 1.4-.2 1.9l.1.1c.6-.8 1.2-1.4 2-1.8.8-.4 1.7-.5 2.7-.5.9 0 1.8.2 2.6.6.8.4 1.6.9 2.2 1.5.6.6 1 1.3 1.2 2.2.3.8.4 1.6.4 2.5 0 1.1-.2 2.1-.5 3-.3.9-.8 1.7-1.5 2.4-.6.7-1.4 1.2-2.3 1.6-.9.4-1.9.6-3 .6-1.6 0-2.8-.3-3.9-.9-1-.6-1.8-1.4-2.5-2.4-.6-1-1-2.1-1.3-3.4-.2-1.3-.4-2.6-.4-3.9 0-1.3.1-2.6.4-3.8.3-1.3.8-2.4 1.4-3.5.7-1 1.5-1.9 2.5-2.5 1-.6 2.3-1 3.8-1 .9 0 1.7.1 2.5.4.8.3 1.4.6 2 1.1.6.5 1.1 1.1 1.4 1.8.4.7.6 1.5.7 2.5h-4c0-1-.3-1.6-.8-2.1zm-3.5 6.8c-.4.2-.8.5-1 .8-.3.4-.5.8-.6 1.2-.1.5-.2 1-.2 1.5s.1.9.2 1.4c.1.5.4.9.6 1.2.3.4.6.7 1 .9.4.2.9.3 1.4.3.5 0 1-.1 1.3-.3.4-.2.7-.5 1-.9.3-.4.5-.8.6-1.2.1-.5.2-.9.2-1.4 0-.5-.1-1-.2-1.4-.1-.5-.3-.9-.6-1.2-.3-.4-.6-.7-1-.9-.4-.2-.9-.3-1.4-.3-.4 0-.9.1-1.3.3zM36.3 41.3v-3.8l9-12.1H49v12.4h2.7v3.5H49v4.8h-4v-4.8h-8.7zM45 30.7l-5.3 7.2h5.4l-.1-7.2z"/></symbol><symbol id="trumbowyg-create-link" viewBox="0 0 72 72"><path d="M31.1 48.9l-6.7 6.7c-.8.8-1.6.9-2.1.9s-1.4-.1-2.1-.9L15 50.4c-1.1-1.1-1.1-3.1 0-4.2l6.1-6.1.2-.2 6.5-6.5c-1.2-.6-2.5-.9-3.8-.9-2.3 0-4.6.9-6.3 2.6L11 41.8c-3.5 3.5-3.5 9.2 0 12.7l5.2 5.2c1.7 1.7 4 2.6 6.3 2.6s4.6-.9 6.3-2.6l6.7-6.7c2.5-2.6 3.1-6.7 1.5-10l-5.9 5.9zM38.7 22.5l6.7-6.7c.8-.8 1.6-.9 2.1-.9s1.4.1 2.1.9l5.2 5.2c1.1 1.1 1.1 3.1 0 4.2l-6.1 6.1-.2.2L42 38c1.2.6 2.5.9 3.8.9 2.3 0 4.6-.9 6.3-2.6l6.7-6.7c3.5-3.5 3.5-9.2 0-12.7l-5.2-5.2c-1.7-1.7-4-2.6-6.3-2.6s-4.6.9-6.3 2.6l-6.7 6.7c-2.7 2.7-3.3 6.9-1.7 10.2l6.1-6.1c0 .1 0 .1 0 0z"/><path d="M44.2 30.5c.2-.2.4-.6.4-.9 0-.3-.1-.6-.4-.9l-2.3-2.3c-.3-.2-.6-.4-.9-.4-.3 0-.6.1-.9.4L25.9 40.6c-.2.2-.4.6-.4.9 0 .3.1.6.4.9l2.3 2.3c.2.2.6.4.9.4.3 0 .6-.1.9-.4l14.2-14.2zM49.9 55.4h-8.5v-5h8.5v-8.9h5.2v8.9h8.5v5h-8.5v8.9h-5.2v-8.9z"/></symbol><symbol id="trumbowyg-del" viewBox="0 0 72 72"><path d="M45.8 45c0 1-.3 1.9-.9 2.8-.6.9-1.6 1.6-3 2.1s-3.1.8-5 .8c-2.1 0-4-.4-5.7-1.1-1.7-.7-2.9-1.7-3.6-2.7-.8-1.1-1.3-2.6-1.5-4.5l-.1-.8-6.7.6v.9c.1 2.8.9 5.4 2.3 7.6 1.5 2.3 3.5 4 6.1 5.1 2.6 1.1 5.7 1.6 9.4 1.6 2.9 0 5.6-.5 8-1.6 2.4-1.1 4.3-2.7 5.6-4.7 1.3-2 2-4.2 2-6.5 0-1.6-.3-3.1-.9-4.5l-.2-.6H44c0 .1 1.8 2.3 1.8 5.5zM29 28.9c-.8-.8-1.2-1.7-1.2-2.9 0-.7.1-1.3.4-1.9.3-.6.7-1.1 1.4-1.6.6-.5 1.4-.9 2.5-1.1 1.1-.3 2.4-.4 3.9-.4 2.9 0 5 .6 6.3 1.7 1.3 1.1 2.1 2.7 2.4 5.1l.1.9 6.8-.5v-.9c-.1-2.5-.8-4.7-2.1-6.7s-3.2-3.5-5.6-4.5c-2.4-1-5.1-1.5-8.1-1.5-2.8 0-5.3.5-7.6 1.4-2.3 1-4.2 2.4-5.4 4.3-1.2 1.9-1.9 3.9-1.9 6.1 0 1.7.4 3.4 1.2 4.9l.3.5h11.8c-2.3-.9-3.9-1.7-5.2-2.9zm13.3-6.2zM22.7 20.3zM13 34.1h46.1v3.4H13z"/></symbol><symbol id="trumbowyg-unlink" viewBox="0 0 72 72"><path d="M30.9 49.1l-6.7 6.7c-.8.8-1.6.9-2.1.9s-1.4-.1-2.1-.9l-5.2-5.2c-1.1-1.1-1.1-3.1 0-4.2l6.1-6.1.2-.2 6.5-6.5c-1.2-.6-2.5-.9-3.8-.9-2.3 0-4.6.9-6.3 2.6L10.8 42c-3.5 3.5-3.5 9.2 0 12.7l5.2 5.2c1.7 1.7 4 2.6 6.3 2.6s4.6-.9 6.3-2.6l6.7-6.7C38 50.5 38.6 46.3 37 43l-6.1 6.1zM38.5 22.7l6.7-6.7c.8-.8 1.6-.9 2.1-.9s1.4.1 2.1.9l5.2 5.2c1.1 1.1 1.1 3.1 0 4.2l-6.1 6.1-.2.2-6.5 6.5c1.2.6 2.5.9 3.8.9 2.3 0 4.6-.9 6.3-2.6l6.7-6.7c3.5-3.5 3.5-9.2 0-12.7l-5.2-5.2c-1.7-1.7-4-2.6-6.3-2.6s-4.6.9-6.3 2.6l-6.7 6.7c-2.7 2.7-3.3 6.9-1.7 10.2l6.1-6.1z"/><path d="M44.1 30.7c.2-.2.4-.6.4-.9 0-.3-.1-.6-.4-.9l-2.3-2.3c-.2-.2-.6-.4-.9-.4-.3 0-.6.1-.9.4L25.8 40.8c-.2.2-.4.6-.4.9 0 .3.1.6.4.9l2.3 2.3c.2.2.6.4.9.4.3 0 .6-.1.9-.4l14.2-14.2zM41.3 55.8v-5h22.2v5H41.3z"/></symbol><symbol id="trumbowyg-back-color" viewBox="0 0 72 72"><path d="M36.5 22.3l-6.3 18.1H43l-6.3-18.1z"/><path d="M9 8.9v54.2h54.1V8.9H9zm39.9 48.2L45 46H28.2l-3.9 11.1h-7.6L32.8 15h7.8l16.2 42.1h-7.9z"/></symbol></svg>'
          )
        )
      }

      _input.trumbowyg({
        btns: [
          ['strong', 'em'],
          ['link'],
          'btnGrp-lists'
        ],
        autogrow: true
      })
      
      _input.on('tbwchange', function(){
        _createdWidget.removeClass('warning')
      })

      _formField.append(_label, _textAreaContainer, _helptext)

      return {
        render: function(){
          return _formField;
        },
        getVal: function(){
          return _input.trumbowyg('html')
        },
        setVal: function(value){
          _input.trumbowyg('html', value)
        },
        addWarning: function(){
          _textAreaContainer.addClass('warning')
        },
        removeWarning: function(){
          _textAreaContainer.removeClass('warning')
        }
      }
    }

    var TextAreaCounter = function(block){
      var _formField = $('<div>').addClass('TextAreaCounter-FormField call-form-field')
      var _label = $('<label>').text(block.label)
      if(block.type == 'mandatory')
        _label.text(block.label + ' *')
      var _input = $('<textarea>').attr({type: 'text', rows: 1, maxlength: block.args}).addClass('short_description-input')
      var _remainingCar = $('<span>').text(block.args).css({display: 'inline', 'font-weight': 600})
      var _helptext = $('<p>').append(block.helptext, _remainingCar,'.').addClass('help-text')
      
      _input.on('input',(function(){
        _input.removeClass('warning')
        _remainingCar.text(block.args - _input.val().length)
      }));

      _formField.append(_label, _input, _helptext)

      return {
        render: function(){
          return _formField
        },
        getVal: function(){
          return _input.val();
        },
        setVal: function(value){
          _input.val(value)
          _remainingCar.text(block.args - _input.val().length)
        },
        addWarning: function(){
          _input.addClass('warning')
        },
        removeWarning: function(){
          _input.removeClass('warning')
        }
      }
    }

    var _blocks = _tempForm;

    Object.keys(_blocks).forEach(function(field){
      _form[field] = {};
      _form[field]['type'] = _blocks[field].type;
      
      var _inputs = {
        'CategorySelector': CategorySelector,
        'SubcategorySelector': SubcategorySelector,
        'Selector': Selector,
        'MultipleSelector': MultipleSelector,
        'MultipleDaysSelector': MultipleDaysSelector,
        'Duration': Duration,
        'Links': Links,
        'CheckBox': CheckBox,
        'Text': Text,
        'TextArea': TextArea,
        'TextAreaEnriched': TextAreaEnriched,
        'TextAreaCounter': TextAreaCounter
      }
      if (_inputs[_blocks[field].input])
        _form[field].input = _inputs[_blocks[field].input](_blocks[field]);
      else{
        _form[field]['label'] = Pard.Widgets.InputLabel(_blocks[field].label);
        if(_form[field].type == 'mandatory') _form[field]['label'] = Pard.Widgets.InputLabel(_blocks[field].label + ' *');
        _form[field].input = window['Pard']['Widgets'][_blocks[field].input].apply(this, _blocks[field].args);
        _form[field]['helptext'] = Pard.Widgets.HelpText(_blocks[field].helptext);
      }
      
      if (_inputs[_blocks[field].input]){
        var _formField = _form[field].input.render();
        if($.isNumeric(field)) _containerCustomFields.append(_formField);
        else if (field != 'availability' && field != 'children' && field != 'conditions') _containerOrfheoFields.append(_formField);
        if (field == 'availability') _availability = _formField;
        if (field == 'conditions'){
          _form[field].input.conditions();
          _conditions = _formField;
        }
      }
      else{
        if (field == 'photos') {
          var _thumbnail = $('<div>');
          var _photosLabel = $('<label>').text(_blocks[field].label);
          var _photoWidget = _form[field].input;
          _photos = _photoWidget.getPhotos();
          var _photosContainer = _photoWidget.render().prepend(_photosLabel).css({'margin-bottom':'-1rem'}).addClass('photoContainer');
          if (_blocks[field].helptext) _photosContainer.append(_form[field].helptext.render());
          _photos.cloudinary().bind('cloudinarydone', function(e, data){
            var _url = _photoWidget.getVal();
            _url.push(data['result']['public_id']);
            if(_url.length >= _photos.dataLength()) _send();
          });
        _containerOrfheoFields.append(_photosContainer);
        }
        else if (field == 'phone'){
          var _helpText = _form[field].helptext.render();
          if(profile.phone.value){
            _form[field].input.setVal(profile.phone);
            _form[field].input.disable();
            _helpText.append($('<span>').html('<br>' + Pard.t.text('widget.inputTel.modify')).css('font-weight','bold'))
          }
          var _formField = $('<div>').addClass(_blocks[field].input + '-FormField' + ' call-form-field').append(
            _form[field].label.render(),
            _form[field].input.render()
          )
          if (_blocks[field]['helptext']) _formField.append(_helpText);
          _containerCustomFields.append(_formField);
        }
        else{
          var _helpText = _form[field].helptext.render();
          var _formField = $('<div>').addClass(_blocks[field].input + '-FormField' + ' call-form-field').append(
            _form[field].label.render(),
            _form[field].input.render()
          )
          if (_blocks[field]['helptext']) _formField.append(_helpText);
          if($.isNumeric(field)) _containerCustomFields.append(_formField);
          else if (field != 'children') _containerOrfheoFields.append(_formField);
          if (field == 'children') _children = _formField;
        }
      }
    });
  
    _containerOrfheoFields.append(_children);
    _containerCustomFields.append(_availability, _conditions);
    if(_form['category'])
      _form['category']['input'].activate();

    var _filled = function(){
      var _check = true;
      for(var field in _form){
        if(_form[field].type == 'mandatory' && field == 'photos' && !(_form[field].input.checkVal())){
          _form[field].input.addWarning();
          _invalidInput.text(Pard.t.text('error.incomplete'));
          _check = false;
        }

        if(_form[field].type == 'mandatory' && !(_form[field].input.getVal()) && field != 'category'){
          _form[field].input.addWarning();
          _invalidInput.text(Pard.t.text('error.incomplete'));
          _check = false;
        }
      } 
      return _check;
    }

    var _getVal = function(){
      for(var field in _form){
         _submitForm[field] = _form[field].input.getVal();
      };
      _submitForm['call_id'] = Pard.CachedEvent.call_id;
      _submitForm['event_id'] = Pard.CachedEvent.event_id;
      _submitForm['profile_id'] = profile.profile_id;
      _submitForm['type'] = type;
      if (_orfheoCategory) _submitForm['category'] = _orfheoCategory;
      _submitForm['form_category'] = form_category;
      if (production_id) _submitForm['production_id'] = production_id; 
      _submitForm['profile_type'] = profile.type; 
      _submitForm['conditions'] = _submitForm['conditions'] || true; 
      return _submitForm;
    }

    var _backEndDictionary = {
      artist: Pard.Backend.sendArtistProposal,
      space: Pard.Backend.sendSpaceProposal 
    }

    var spinner = new Spinner();  
    var _closepopup = {};

    var _send = function(){
      var _submitForm = _getVal();
      _backEndDictionary[type](_submitForm,function(data){
        callbackSendProposal(data); 
        _closepopup();
        spinner.stop();
        submitButton.attr('disabled',false);
      })
    }


    submitButton.on('click',function(){
      spinner.spin();
      $('body').append(spinner.el);
      submitButton.attr('disabled',true);
      if(_filled() == true){
        if(_photos){
          if(_photos.dataLength() == false) _send();
          else{
            _photos.submit();
          }
        }
        else{
          _send();
        }
      }
      else{
        spinner.stop();
        submitButton.attr('disabled',false);
      }
    });
    
    _submitBtnContainer.append(submitButton);

    _formContainer.append(_finalMessage, _invalidInput, _submitBtnContainer);
    _createdWidget.append(_formContainer);

    return {
      render: function(){
        return _createdWidget;
      },
      setCallback: function(callback){
        _closepopup = callback;
      },
      setVal: function(production){
        for(var field in production){
          if (_form[field]) _form[field].input.setVal(production[field]);
        }
      }
    }
  }

}(Pard || {}));
