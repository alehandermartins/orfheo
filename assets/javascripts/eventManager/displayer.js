'use strict';

(function(ns){

  ns.Displayer = function(the_event, forms){

    var event_id = the_event.event_id;
    var call_id = the_event.call_id;
    var eventName = the_event.name;
    var _translatorSubC = Pard.UserInfo['texts']['subcategories'];

    var _content = $('<div>').addClass('very-fast reveal full');
    var _popup =  new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', multipleOpened:true, closeOnEsc:false});
    $(document).ready(function(){
      $('body').append(_content);
    })


    var _outerContainer = $('<div>').addClass('vcenter-outer');
    var _container = $('<div>').addClass('vcenter-inner');
    var _popupContent = $('<div>').addClass('popup-container-full');
    var _sectionContainer = $('<section>').addClass('popup-content');
    var _header = $('<div>').addClass('row popup-header');
    var _title = $('<h4>').addClass('small-11 popup-title').append(eventName);
    var _callback = function(){};
    var _closeBtn = $('<button>').addClass('close-button small-1 popup-close-btn').attr({type: 'button'})
      .append($('<span>').html('&times;'));
    _header.append(_title, _closeBtn);
    _popupContent.append(_header, _sectionContainer);
    _container.append(_popupContent)
    _outerContainer.append(_container);


    var _displayArtistProgram = function(profile_id){
      var artist = the_event.artists[profile_id];
      var myprogram = the_event.artists[profile_id].program;

      var _popupTitle = '';
      _popupTitle += the_event.artists[profile_id].artist.name; 
      if (!($.isEmptyObject(myprogram))){
        _popupTitle += ' (';
        var _artistCategories = [];
        for (var performanceId in myprogram){
          _artistCategories.push(_translatorSubC['artist'][artist.proposals[myprogram[performanceId].show.participant_proposal_id].proposal.subcategory]);
        }
        _popupTitle += Pard.Widgets.UniqueArray(_artistCategories).join(', ')+ ')';
      }
      var _message = Pard.Widgets.PopupContent(_popupTitle, Pard.Widgets.ArtistProgram(artist, myprogram, the_event.spaces, the_event.program), 'space-program-popup-call-manager');
      _message.setCallback(function(){
        _popup.close();
        _content.empty();
      });

      _content.click(function(e){
        if ($(e.target).hasClass('vcenter-inner')) {
          _popup.close();
          _content.empty();
        }
      });
      
      _content.append(_message.render());
      _popup.open();
    }

    var _displaySpaceProgram = function(profile_id){

      var space = the_event.spaces[profile_id].space;
      var myprogram = the_event.spaces[profile_id].program;

      var _message = Pard.Widgets.PopupContent(space.name + ' ('+Pard.UserInfo['texts'].subcategories['space'][space.subcategory]+')', Pard.Widgets.SpaceProgram(space, myprogram, the_event.artists, the_event.program), 'space-program-popup-call-manager');
      _message.setCallback(function(){
        _popup.close();
        _content.empty();
      });

      _content.click(function(e){
        if ($(e.target).hasClass('vcenter-inner')) {
          _popup.close();
          _content.empty();
        }
      });

      _content.append(_message.render());
      _popup.open();
    }

    var _cachedList;

    var _displayProposalsList = function(proposal, type, _list){
      _cachedList = _list;
      var _proposalIndex = _list.findIndex(function(el, index){return el.indexOf(proposal.proposal_id)>0 });
      var _display = function(proposalIndex){
        var _nextProposal = _list[proposalIndex].split('_');
        var _profileId = _nextProposal[0];
        var _proposalId = _nextProposal[1];
        var _type = _nextProposal[2];
        _sectionContainer.empty();
        var _displayDict = {
          artist: function(){_displayProposal(the_event[_type+'s'][_profileId]['proposals'][_proposalId]['proposal'], _type)},
          space: function(){_displayProposal(the_event[_type+'s'][_profileId]['space'], _type)}
        }
        _displayDict[_type]();
      };

      var _leftBtn = $('<div>')
        .append(
          $('<div>').append(Pard.Widgets.IconManager('navigation_left').render()).css('position','relative')
        )
        .addClass('leftBtn-listProposal')
        .click(function(){
          _proposalIndex = _proposalIndex - 1
          if (_proposalIndex < 0) _proposalIndex = _list.length-1; 
         _display(_proposalIndex);
        });
      var _rightBtn = $('<div>')
        .append(
          $('<div>').append(Pard.Widgets.IconManager('navigation_right').render().css('position','relative'))
        )
        .addClass('rightBtn-listProposal')
        .click(function(){
          _proposalIndex = _proposalIndex + 1
          if(_proposalIndex == _list.length) _proposalIndex = 0;
          _display(_proposalIndex);         
        });
      _container.append(_leftBtn, _rightBtn);
      _displayProposal(proposal, type);
    }

    
    var _displayProposal = function(proposal, type){

      proposal.proposal_type = type;
      var _proposal = $.extend(true, {}, proposal);

      var form = forms[type][_proposal.form_category];

      var _proposalPrinted = Pard.Widgets.PrintProposal(proposal, form);
      var _deleteProposalCaller = $('<a>').attr('href','#/').append(Pard.Widgets.IconManager('delete').render().addClass('trash-icon-delete'), $('<span>').text(Pard.t.text('dictionary.delete').capitalize())).addClass('deleteProfile-caller');
      var _modifyProposal = $('<a>').attr('href','#/').append(Pard.Widgets.IconManager('modify').render().addClass('trash-icon-delete'), $('<span>').text(Pard.t.text('dictionary.modify').capitalize())).addClass('deleteProfile-caller');

      _deleteProposalCaller.on('click', function(){
        var _deleteContent = $('<div>').addClass('very-fast reveal full');
        _deleteContent.empty();
        $('body').append(_deleteContent);
        var _confirmPopup = new Foundation.Reveal(_deleteContent, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out', multipleOpened:true});
        var _message = Pard.Widgets.PopupContent(Pard.t.text('popup.delete.title'),  confirmPopupContent(), 'alert-container-full');
        _message.setCallback(function(){
          _confirmPopup.close();
          setTimeout(
            function(){
              _deleteContent.remove();
            },500);         
        });

        _deleteContent.click(function(e){
          if ($(e.target).hasClass('vcenter-inner')) {
            _confirmPopup.close();
            setTimeout(
              function(){
                _deleteContent.remove();
              },500);
          }
        });

        _deleteContent.append(_message.render());
        _confirmPopup.open();
      });

      var confirmPopupContent = function(){
        var _createdWidget = $('<div>');
        var _name = _proposal.name;
        var _mex = $('<p>').text(Pard.t.text('manager.proposals.deleteNote', {name: _name}));
        var _yesBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn confirm-delete-btn').text(Pard.t.text('dictionary.confirm').capitalize());
        var _noBtn = $('<button>').attr({'type':'button'}).addClass('pard-btn cancel-delete-btn').text(Pard.t.text('dictionary.cancel').capitalize());

        var spinnerDeleteProposal =  new Spinner().spin();
        var _deleteProposalBackend = {
          artist: Pard.Backend.deleteArtistProposal,
          space: Pard.Backend.deleteSpaceProposal
        }

        var _buttonsContainer = $('<div>').addClass('yes-no-button-container');

        if (!(_proposal.own)) _createdWidget.append(_mex);

        _createdWidget.append(_buttonsContainer.append(_noBtn, _yesBtn));

        return {
          render: function(){
            return _createdWidget;
          },
          setCallback: function(callback){
            _noBtn.click(function(){
              callback();
            });
            _yesBtn.click(function(){
              $('body').append(spinnerDeleteProposal.el);
              _deleteProposalBackend[type](_proposal.proposal_id, event_id, function(data){
                deleteCallback(data);
                spinnerDeleteProposal.stop();
                _popup.close();
                _sectionContainer.empty();
                _container.empty().append(_popupContent);
                _content.empty();
                callback();
              });
            });
          }
        }
      }

      var deleteCallback = function(data){
        if (data['status'] == 'success'){
          Pard.Widgets.TimeOutAlert('', Pard.t.text('manager.proposals.deleteOk'));
        }
        else{
          var _dataReason = Pard.ErrorHandler(data.reason);
          if (typeof _dataReason == 'object')
            Pard.Widgets.Alert(Pard.t.text('error.alert'), Pard.t.text('error.unsaved'), location.reload());
          else{
            console.log(data.reason);
            Pard.Widgets.Alert('', _dataReason, location.reload());
          }
        }
      }

      var modifyCallback = function(data){
        if (data['status'] != 'success'){
          var _dataReason = Pard.ErrorHandler(data.reason);
          if (typeof _dataReason == 'object')
            Pard.Widgets.Alert(Pard.t.text('error.alert'), Pard.t.text('error.unsaved'), location.reload());
          else{
            console.log(data.reason);
            Pard.Widgets.Alert('', _dataReason);
          }
        }
      };

      var _modifyProposalBackend = {
        artist: Pard.Backend.modifyArtistProposal,
        space: Pard.Backend.modifySpaceProposal
      }
      _modifyProposal.click(function(){
        // _messageProposalPrintedRendered.hide();
        var _formWidget = Pard.Widgets.OwnProposalForm(form.blocks, type, _proposal.form_category, (!proposal.own));
        _formWidget.setVal(_proposal);
        if (!proposal.own) _formWidget.disableFields();
      
        _formWidget.showAll();
        _formWidget.setSend(function(stopSpinner){
          var _submitForm = _formWidget.getVal();
          
          _submitForm['proposal_id'] = _proposal.proposal_id;
          _submitForm['event_id'] = event_id;
          _submitForm['call_id'] = call_id;
          _submitForm['profile_id'] = _proposal.profile_id; 
          _modifyProposalBackend[type](_submitForm, 
            function(data){
              if (data.status != 'success'){
                modifyCallback(data);
                stopSpinner();
              }
              else{
                _content.empty();
                if (type == 'space') {
                  var _modifiedProposal = data.model;
                }
                else {
                  var _artist = data.model;
                  var _modifiedProposal = data.model.proposals[0];
                  _modifiedProposal.name = _artist.name;
                  _modifiedProposal.email = _artist.email;
                  _modifiedProposal.profile_id = _artist.profile_id;
                  _modifiedProposal.phone = _artist.phone;
                }
                _content.empty();
                _sectionContainer.empty();
                _container.empty().append(_popupContent);
                _outerContainer.removeClass('displayNone-for-large')
                _displayProposalsList(_modifiedProposal, type, _cachedList);
                stopSpinner();
              }
            }
          );
        });
        var _modifyMessage = Pard.Widgets.PopupContent(eventName, _formWidget);
        _modifyMessage.prependToContent(
          $('<div>').append(
            $('<div>')
              .append(
                $('<button>')
                  .attr('type','button')
                  .append(Pard.Widgets.IconManager('navigation_left').render(), $('<span>').text(' Atrás'))
                  .click(function(){
                    _modifyMessageRendered.remove();
                    _outerContainer.removeClass('displayNone-for-large');
                  })
                  .addClass('back-button')
                )
              .css({
                'position':'relative',
                'height':'1rem'
              }),
            $('<p>')
              .text(Pard.t.text('manager.proposals.modifymex',{type: form.label}))  
          )
         .css('margin-bottom','-.5rem')
        );
        _modifyMessage.appendToContent(Pard.Widgets.Button(
          Pard.t.text('dictionary.cancel').capitalize(),
          function(){
            _modifyMessageRendered.remove();
            _outerContainer.removeClass('displayNone-for-large');
            // _messageProposalPrintedRendered.show();
          }).render()
          .addClass('cancelBtn-modifyProposalForm')
        );
        _modifyMessage.setCallback(function(){
          _content.empty();
          _sectionContainer.empty();
          _container.empty().append(_popupContent);
          _outerContainer.removeClass('displayNone-for-large');
          _popup.close();
        });
        var _modifyMessageRendered = _modifyMessage.render();
        _content.append(_modifyMessageRendered);
      });

      

      // var _messageProposalPrinted = Pard.Widgets.PopupContent(eventName, _proposalPrinted);

      // _messageProposalPrinted.setCallback(function(){
      //   _content.empty();
      //   _popup.close();
      // });

      _sectionContainer.append(_proposalPrinted.render());

      _closeBtn.click(function(){
        _content.empty();
        _container.empty().append(_popupContent);
        _sectionContainer.empty();
        _outerContainer.removeClass('displayNone-for-large');
        _popup.close();
      });

      _content.click(function(e){
        if ($(e.target).hasClass('vcenter-inner')) {
          _content.empty();
          _sectionContainer.empty();
          _container.empty().append(_popupContent);
          _outerContainer.removeClass('displayNone-for-large');
          _popup.close();
        }
      });   

      if (_proposal.amend){
        var _label = $('<span>').addClass('myProposals-field-label').text(Pard.t.text('dictionary.amend').capitalize() + ':').css('display', 'block');
        var _text = $('<span>').text(' ' + _proposal.amend);
        var _element = $('<div>').append($('<p>').append(_label, _text));
        _sectionContainer.append(_element);
      };

      var _actionBtnContainer = $('<div>').addClass('actionButton-container-popup');
      _actionBtnContainer.append($('<span>').append(_modifyProposal).addClass('element-actionButton'));
      _actionBtnContainer.append($('<span>').append(_deleteProposalCaller).addClass('element-actionButton').css({ 'border-left':'1px solid #bebebe' }));
  
      if (_proposal.own) {
        var _warningOwnText = $('<p>').text(Pard.t.text('manager.proposals.organizerProposal')).css('margin-top','1.5rem');
        _sectionContainer.prepend(_warningOwnText);
      }

      _sectionContainer.prepend(_actionBtnContainer);
      
      // var _messageProposalPrintedRendered = _messageProposalPrinted.render();
      
      // _content.append(_messageProposalPrintedRendered);
     
      if (!_content.html()) {
        _content.append(_outerContainer);
        _popup.open();
      }
    }

    var _createOwnProposal = function(type, participants){
      var _contentCreateOwn = $('<div>').addClass('very-fast reveal full top-position').attr('id','popupForm');
      $('body').append(_contentCreateOwn);
      var _popup = new Foundation.Reveal(_contentCreateOwn, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out',  multipleOpened:true});

      var _callbackCreatedProposal = function(data, callback){
        if(data['status'] == 'success') {
          _closePopupForm();
          Pard.Widgets.TimeOutAlert('', Pard.t.text('manager.proposals.createOk'));
          callback();
        }
        else{
          Pard.Widgets.Alert('', Pard.ErrorHandler(data.reason));
          callback();
        }
      }

      var _sendProposal = function(callback){
        var _submitForm = _createOwnProposalWidget.getVal();
        _submitForm['call_id'] = call_id;
        _submitForm['event_id'] = event_id;
        if (type == 'artist') Pard.Backend.sendArtistOwnProposal(_submitForm, function(data){_callbackCreatedProposal(data, callback)});
        else if (type == 'space') Pard.Backend.sendSpaceOwnProposal(_submitForm, function(data){_callbackCreatedProposal(data, callback)});
      };

      _createOwnProposalWidget = Pard.Widgets.CreateOwnProposal(forms[type], type, participants);
      _createOwnProposalWidget.setSend(_sendProposal);
      var _message = Pard.Widgets.PopupContent(Pard.t.text('manager.proposals.createTitle', {type: Pard.t.text('dictionary.' + type).capitalize()}), _createOwnProposalWidget);
      _message.setCallback(function(){
        _popup.close();
        setTimeout(
          function(){
             _contentCreateOwn.remove();
          },500);
      });

      _contentCreateOwn.click(function(e){
        if ($(e.target).hasClass('vcenter-inner')) {
          _popup.close();
          setTimeout(
            function(){
               _contentCreateOwn.remove();
            },500);
          }
      });   

      _contentCreateOwn.append(_message.render());
      _closePopupForm = function(){
        _popup.close();
        setTimeout(
          function(){
             _contentCreateOwn.remove();
          },500);
      };
      _popup.open();
    }

    return{
      displayProposal: _displayProposal,
      displayProposalsList: _displayProposalsList,
      displayArtistProgram: _displayArtistProgram,
      displaySpaceProgram: _displaySpaceProgram,
      createOwnProposal: _createOwnProposal,
      close: function(){
        _popup.close();
      }
    }
  }

}(Pard || {}));
