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
      'margin-top': '2rem'
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
      var _createProfileCardContainer = $('<div>').append(_createProfileCard).addClass('card-container-popup');
      _createdWidget.append(_secondTitle, _createProfileCardContainer);
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
 

  ns.Widgets.FormManager = function(callForms, profile, closeListProfilePopup, callbackSendProposal){
    var forms = callForms[Pard.Options.language()] || callForms['es'];

    var _createdWidget = $('<div>');
    var _typeFormsCatArray = Pard.CachedEvent.target;
    var _translatorFC = Pard.UserInfo['texts'].form_categories;
    
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
            text: _translatorFC[_type][typeForm]
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
            if ($.inArray(production.category, _acceptedCategories.artist)>-1){
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
                  var formsKey = callForms.categories.artist[_catProduction]['forms'];
                  if (formsKey.length == 1){            
                    var _form = _formTypeConstructor(_type, forms[_type][formsKey[0]], profile, formsKey[0], _production_id, callbackSendProposal);
                    _formTypeSelectorCont.empty();
                    _formTypeSelector = $('<select>');
                    var _emptyOption = $('<option>').text(Pard.t.text('call.form.catPlaceholder')).val('');
                    _formTypeSelector.append(_emptyOption);
                    formsKey.forEach(function(typeForm){
                      _formTypes.push(typeForm);
                      _formTypeSelector.append($('<option>').val(typeForm).text(_translatorFC['artist'][typeForm]));
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
                      _formTypeSelector.append($('<option>').text(_translatorFC['artist'][typeForm]).val(typeForm));
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
      "label" : "Teléfono de contacto",
      "input" : "InputTel",
      "args" : [ 
          ""
      ],
      "helptext" : "Esta información es necesaria para un eventual contacto por parte de la organización."
    }

    //Availability should get the dates from the event

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

    var CategorySelector = function(categories){
      var catArrayTranslated;
      catArrayTranslated = Object.keys(categories).map(function(cat){
        return Pard.t.text('categories.'+ cat);
      });

      var _createdWidget = $('<select>');
      var _emptyOption = $('<option>');
      Object.keys(categories).forEach(function(value, index){
        _createdWidget.append($('<option>').append(catArrayTranslated[index]).val(value));
      });
      _createdWidget.on('change',function(){
        _emptyOption.remove();
        _createdWidget.removeClass('warning');
        if(categories[_createdWidget.val()] && categories[_createdWidget.val()].activateOptions){
          Object.keys(categories[_createdWidget.val()].activateOptions).forEach(function(field){
            _form[field].input.reload(categories[_createdWidget.val()].activateOptions[field]);
          });
        }
      })
      .one('click',function(){
        _createdWidget.removeClass('placeholderSelect');
        _emptyOption.empty();
      });

      return {
        render: function(){
          return _createdWidget;
        },
        getVal: function(){
          return _createdWidget.val();
        },
        addWarning: function(){
          _createdWidget.addClass('warning');
        },
        removeWarning: function(){
          _createdWidget.removeClass('warning');
        },
        setVal: function(value){
          _createdWidget.val(value);
        },
        setClass: function(_class){
          _createdWidget.addClass(_class);
        },
        enable: function(){
          _createdWidget.attr('disabled',false);
        },
        disable: function(){
          _createdWidget.attr('disabled',true);
        },
        activate: function(){
          if(categories[_createdWidget.val()] && categories[_createdWidget.val()].activateOptions){
            Object.keys(categories[_createdWidget.val()].activateOptions).forEach(function(field){
              _form[field].input.reload(categories[_createdWidget.val()].activateOptions[field]);
            });
          }
        }
      }
    }

    var Selector = function(choices){

      var _createdWidget = $('<select>');
      var _emptyOption = $('<option>');
      Object.keys(choices).forEach(function(value){
        _createdWidget.append($('<option>').append(choices[value]).val(value));
      });
      _createdWidget.on('change',function(){
        _emptyOption.remove();
        _createdWidget.removeClass('warning');
      })
      .one('click',function(){
        _createdWidget.removeClass('placeholderSelect');
        _emptyOption.empty();
      });

      return {
        render: function(){
          return _createdWidget;
        },
        getVal: function(){
          return _createdWidget.val();
        },
        addWarning: function(){
          _createdWidget.addClass('warning');
        },
        removeWarning: function(){
          _createdWidget.removeClass('warning');
        },
        setVal: function(value){
          _createdWidget.val(value);
        },
        setClass: function(_class){
          _createdWidget.addClass(_class);
        },
        enable: function(){
          _createdWidget.attr('disabled',false);
        },
        disable: function(){
          _createdWidget.attr('disabled',true);
        },
        reload: function(new_choices){
          var old_val = _createdWidget.val();
          if (new_choices == 'all') new_choices = Object.keys(choices);
          _createdWidget.empty();
          new_choices.forEach(function(value){
            _createdWidget.append($('<option>').append(choices[value]).val(value));
          });
          if($.inArray(old_val, new_choices)){
            _createdWidget.val(old_val);
            _createdWidget.trigger('change');
          }
        }
      }
    }

    var MultipleSelector = function(choices){
      var _createdWidget = $('<div>');
      var _select = $('<select>').attr("multiple", "multiple");
      Object.keys(choices).forEach(function(value){
        _select.append($('<option>').text(choices[value]).val(value));
      });
      _createdWidget.append(_select);
      _select.on('change',function(){
        _select.next().find('.ms-choice').removeClass('warning');
      });
      var _options = {      
        placeholder: "Selecciona una o más opciones",
        selectAll: false,
        countSelected: false,
        allSelected: false
      };
      
      return {
        render: function(){
          _select.multipleSelect(_options);
          return _createdWidget;
        },
        setOptions: function(options){
          _options = options;
        },
        getVal: function(){
          return _select.val();
        },
        setVal: function(values){
          _select.multipleSelect('setSelects', values);
        },
        addWarning: function(){
          console.log('warning')
          _select.next().find('.ms-choice').addClass('warning');
        },
        removeWarning: function(){
          _select.next().find('.ms-choice').removeClass('warning');
        },
        setClass: function(_class){
          _createdWidget.addClass(_class);
        },
        deselectAll: function(){
          _select.multipleSelect("uncheckAll")
        },
        enable: function(){
          _select.attr('disabled',false);
        },
        disable: function(){
          _select.attr('disabled',true);
        }
      }
    }

    var Duration = function(choices){

      var _createdWidget = $('<select>');
      var _emptyOption = $('<option>');
      Object.keys(choices).forEach(function(value){
        _createdWidget.append($('<option>').append(choices[value]).val(value));
      });
      _createdWidget.on('change',function(){
        _emptyOption.remove();
        _createdWidget.removeClass('warning');
      })
      .one('click',function(){
        _createdWidget.removeClass('placeholderSelect');
        _emptyOption.empty();
      });

      return {
        render: function(){
          return _createdWidget;
        },
        getVal: function(){
          return _createdWidget.val();
        },
        addWarning: function(){
          _createdWidget.addClass('warning');
        },
        removeWarning: function(){
          _createdWidget.removeClass('warning');
        },
        setVal: function(value){
          _createdWidget.val(value);
        },
        setClass: function(_class){
          _createdWidget.addClass(_class);
        },
        enable: function(){
          _createdWidget.attr('disabled',false);
        },
        disable: function(){
          _createdWidget.attr('disabled',true);
        },
        reload: function(new_choices){
          var old_val = _createdWidget.val();
          if (new_choices == 'all') new_choices = Object.keys(choices);
          _createdWidget.empty();
          new_choices.forEach(function(value){
            _createdWidget.append($('<option>').append(choices[value]).val(value));
          });
          if($.inArray(old_val, new_choices)){
            _createdWidget.val(old_val);
            _createdWidget.trigger('change');
          }
        }
      }
    }

    var Links = function(){

      var _input = $('<input>').attr({'type': 'text'});

      _input.on('input',function(){
        _input.removeClass('warning');
      });

      _input.on('focus', function(){
        if($(window).width()<1024){
          if ($('.reveal[aria-hidden="false"]').html()){
            var _distanceInputTop = _input.offset().top;
            var _popupOpened = _input.closest('.reveal[aria-hidden="false"]');
            var _scroolTop = _popupOpened.scrollTop();
            var _distanceToDo = _distanceInputTop + _scroolTop - 120; 
            _popupOpened.scrollTop(_distanceToDo);
          }
        }
      });

      return{
        render: function(){
          return _input;
        },
        getVal: function(){
          return _input.val();
        },
        setVal: function(value){
          _input.val(value);
        },
        addWarning: function(){
          _input.addClass('warning');
        },
        removeWarning: function(){
          _input.removeClass('warning');
        }
      }
    }

    var _blocks = _tempForm;

    Object.keys(_blocks).forEach(function(field){
      _form[field] = {};
      _form[field]['type'] = _blocks[field].type;
      if(_form[field]['type'] == 'mandatory') _form[field]['label'] = Pard.Widgets.InputLabel(_blocks[field].label+' *');
      else _form[field]['label'] = Pard.Widgets.InputLabel(_blocks[field].label);
      if (_blocks[field]['input']=='CheckBox') {
        _blocks[field].args[0] = _blocks[field].label;
        if (_blocks[field]['type'] == 'mandatory') _blocks[field].args[0] += ' *';
      }

      if(_blocks[field].input == 'CategorySelector' || _blocks[field].input == 'Duration' || _blocks[field].input == 'Links' || _blocks[field].input == 'Selector' || _blocks[field].input == 'MultipleSelector'){
        if(_blocks[field].input == 'CategorySelector') _form[field]['input'] = CategorySelector(_blocks[field].args)
        if(_blocks[field].input == 'Selector') _form[field]['input'] = Selector(_blocks[field].args)
        if(_blocks[field].input == 'MultipleSelector') _form[field]['input'] = MultipleSelector(_blocks[field].args)
        if(_blocks[field].input == 'Duration') _form[field]['input'] = Duration(_blocks[field].args)
        if(_blocks[field].input == 'Links') _form[field]['input'] = Links();
      }
      else{
      _form[field]['input'] = window['Pard']['Widgets'][_blocks[field].input].apply(this, _blocks[field].args);
      }
      _form[field]['helptext'] = Pard.Widgets.HelpText(_blocks[field].helptext);

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
      else if (field == 'category'){
        if (Object.keys(_blocks[field].args).length > 1 && production_id == false){
          var _formField = $('<div>');
          _containerOrfheoFields.append(
          _formField.addClass(_blocks[field].input + '-FormField' + ' call-form-field').append(
            _form[field].label.render(),
            _form[field].input.render())
          )
          if (_blocks[field]['helptext'].length) _formField.append(_form[field].helptext.render());
        }
        else{
          if(production_id != false){
            profile.productions.forEach(function(production){
              if(production.production_id == production_id){
                _orfheoCategory = production.category;
                _form['category'].input.setVal(_orfheoCategory);
              }
            });
          }
          else{
            _orfheoCategory = Object.keys(_blocks[field].args)[0];
          } 
        }
      }
      else if (field == 'subcategory'){
        if ($.isArray(_blocks[field].args[0]) && _blocks[field].args[0].length>1){
          var _formField = $('<div>');
          _containerOrfheoFields.append(
          _formField.addClass(_blocks[field].input + '-FormField' + ' call-form-field').append(
            _form[field].label.render(),
            _form[field].input.render())
          )
          if (_blocks[field]['helptext'].length) _formField.append(_form[field].helptext.render());
        }
        else{
          _subcategory = _blocks[field].args[0][0] || _blocks[field].args; 
        }
      }
      else if (field == 'phone'){
        var _helpText = _form[field].helptext.render();
        if(profile.phone.value){
          _form[field].input.setVal(profile.phone);
          _form[field].input.disable();
          _helpText.append($('<span>').html('<br>Puedes cambiar tu número desde la pagína de tu perfil.').css('font-weight','bold'))
        }
        var _formField = $('<div>').addClass(_blocks[field].input + '-FormField' + ' call-form-field').append(
          _form[field].label.render(),
          _form[field].input.render()
        )
        if (_blocks[field]['helptext'].length) _formField.append(_helpText);
        _containerCustomFields.append(_formField);
      }
      else{
        if (_blocks[field].input == 'TextAreaCounter'){
          var _formField = $('<div>').addClass(_blocks[field].input + '-FormField' + ' call-form-field').append(
            _form[field].label.render(),_form[field].input.render());
        }
        else if (_blocks[field].input == 'CheckBox'){
          var _formField = $('<div>').addClass(_blocks[field].input + '-FormField' + ' call-form-field').append(_form[field].input.render()); 
          if (field == 'conditions'){
            var _helptextfield = $('<p>').append($('<a>').text('(Ver condiciones)').attr({'href': Pard.CachedEvent.conditions, 'target':'_blank'})).addClass('help-text');
            _helptextfield.css({'margin-top':'0'});
            _formField.append(_helptextfield);
          }
          else {
            if (_blocks[field]['helptext'].length){
              var _helptextfield = _form[field].helptext.render();
              _helptextfield.css({'margin-top':'0'});
              _formField.append(_helptextfield);
            }
          }
        }
        else{
          var _helpText = _form[field].helptext.render();
          if (_blocks[field]['input'] == 'TextArea') _form[field]['input'].setAttr('rows', 4);
           if(_blocks[field]['input'] == 'MultipleSelector' || _blocks[field]['input'] == 'MultipleDaysSelector'){
            if (field == 'availability'){
              _form[field].input.setOptions({      
                placeholder: Pard.t.text('widget.availability.placeholder'),
                selectAllText: Pard.t.text('widget.availability.selectAllText'),
                countSelected: false,
                allSelected: Pard.t.text('widget.availability.allSelected')
              });
            }
            _helpText.css('margin-top', 5);
          }
          var _formField = $('<div>').addClass(_blocks[field].input + '-FormField' + ' call-form-field').append(
            _form[field].label.render(),
            _form[field].input.render()
          )
          if (_blocks[field]['helptext'].length) _formField.append(_helpText);
        }
        if($.isNumeric(field)) _containerCustomFields.append(_formField);
        else if (field != 'availability' && field != 'children' && field != 'conditions') _containerOrfheoFields.append(_formField);
        if (field == 'availability') _availability = _formField;
        if (field == 'children') _children = _formField;
        if (field == 'conditions') _conditions = _formField;
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
      // if (!(form['subcategory'])) _submitForm['subcategory'] = form_category;
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
