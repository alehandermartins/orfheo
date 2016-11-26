  'use strict';

(function(ns){
  ns.Widgets = ns.Widgets || {};

  ns.Widgets.Manager = function(the_event){

    var artists = the_event.artists;
    var spaces = the_event.spaces;
    var _forms;

    var _main = $('<main>').addClass('main-call-page');
    var _mainLarge = $('<section>').addClass('pard-grid call-section');
    var _navigationContainer = $('<div>').addClass('navigation-container-call-page');
    var _goToEventBtn = $('<a>').attr('href','/event?id='+ the_event.event_id).text('Página evento');
    _goToEventBtn.addClass('toEventPage-btn-callPage');
    var _tabs = $('<ul>').addClass('menu simple tabs-menu switcher-menu-call-page');
    var _title = $('<h4>').text('Gestiona la Convocatoria').css({'margin-top':'1.5rem', 'margin-bottom':'2.5rem'});
    var _panels = $('<div>').css('padding', 0);

    var _programTabTitle =  $('<a>').attr({href: "#"}).text('Programa');
    var _tableTabTitle =  $('<a>').attr({href: "#"}).text('Tabla');
    var _proposalsTabTitle =  $('<a>').attr({href: "#"}).text('Propuestas');
    var _qrTabTitle =  $('<a>').attr({href: "#"}).text('QR');

    var _programTab = $('<li>').append(_programTabTitle);
    var _tableTab = $('<li>').append(_tableTabTitle);
    var _proposalsTab = $('<li>').append(_proposalsTabTitle);
    var _qrTab = $('<li>').append(_qrTabTitle);

    var ProposalsManager = function(){
      var _createdWidget = $('<div>');
      var _addProposalBox = $('<div>').addClass('add-proposal-box');
      var _whiteListBox = $('<div>').addClass('white-list-box');
      var _addProposalText = $('<p>').text('Añade propuestas a tu convocatoria para que puedas insertarlas en la programación').addClass('initial-text-proposalPanel');
      var _whiteListText = $('<p>').text('Habilita usuarios para que puedan enviar una propuesta en cualquier momento').addClass('initial-text-proposalPanel');
      var _artistIcon = Pard.Widgets.IconManager('artist').render().addClass('create-profile-btn-icon');
      var _spaceIcon = Pard.Widgets.IconManager('space').render().addClass('create-profile-btn-icon');
      var _artistButtonHtml = $('<div>').append(_artistIcon, $('<span>').text('Artista').addClass('create-profile-btn-text'));
      var _spaceButtonHtml = $('<div>').append(_spaceIcon, $('<span>').text('Espacio').addClass('create-profile-btn-text'));

      var _createSpaceCaller = $('<div>').html(_spaceButtonHtml).addClass('create-space-proposal-call-page-btn');
      var _createArtistCaller = $('<div>').html(_artistButtonHtml).addClass('create-artist-proposal-call-page-btn');

      var _ownArtists = [];
      var _ownSpaces = [];

      var _artistsContainers = {}
      var _spacesContainers = {}

      var _createOwnProposalWidget;
      var _printedOwnProposal;
      var _closePopupOwnSentProposal = function(){};
      var _callbackOwnPrintedProposal = function(){};
      var _closePopupForm = function(){};

      var _addSpace = function(space){
        _ownSpaces.push(space);
        var _proposalContainer = $('<li>').append(Pard.Widgets.IconManager('space').render()).addClass('own-spaceProposal-container');
        _spacesContainers[space.profile_id] = _proposalContainer;
        var _spaceProposal = _newListedItem(space, space.profile_id, 'space', _proposalContainer);
        _spacesList.prepend(_proposalContainer.append(_spaceProposal));
      }

      var _addArtist = function(artist){
        _artistsContainers[artist.profile_id] = _artistsContainers[artist.profile_id] || {};
        var _proposalContainer = $('<li>');
        var _artistProposal = _newListedItem(artist.proposals[0], artist.profile_id, 'artist', _proposalContainer);
        if(Object.keys(_artistsContainers[artist.profile_id]) != 0){
          _artistsContainers[artist.profile_id].ul.append(_proposalContainer.append(_artistProposal));
        }
        else {
          _ownArtists.push(artist);
          var _artistContainer = $('<li>').append(Pard.Widgets.IconManager('artist').render(),$('<span>').text(artist.name).addClass('artistName')).addClass('own-artistProposals-container');
          var _artistProposalsList = $('<ul>');
          _artistsContainers[artist.profile_id].li = _artistContainer;
          _artistsContainers[artist.profile_id].ul = _artistProposalsList;
          _artistContainer.append(_artistProposalsList);
          _artistsList.prepend(_artistContainer);
          _artistProposalsList.prepend(_artistProposal);
        }
        _artistsContainers[artist.profile_id][artist.proposals[0].proposal_id] = _proposalContainer;
      }

      var _deleteSpace = function(space){
        if (_spacesContainers[space.profile_id]){
          _spacesContainers[space.profile_id].remove();
          delete _spacesContainers[space.profile_id];
        }
      }

      var _deleteArtist = function(artist){
        if (_artistsContainers[artist.profile_id]){
          _artistsContainers[artist.profile_id][artist.proposal_id].remove();
          delete _artistsContainers[artist.profile_id][artist.proposal_id];
          if(Object.keys(_artistsContainers[artist.profile_id]).length == 2){
            _artistsContainers[artist.profile_id].li.remove();
            delete _artistsContainers[artist.profile_id];
            _ownArtists = _ownArtists.filter(function(_artist){
              return artist.profile_id != _artist.profile_id;
            });
          }
        }
      }

      var _callbackCreatedProposal = function(data){
        if(data['status'] == 'success') {
          if (Object.keys(data)[1] == 'space') Pard.Bus.trigger('addSpace', data.space);
          else if (Object.keys(data)[1] == 'artist'){Pard.Bus.trigger('addArtist', data.artist);}
          Pard.Widgets.Alert('', 'Propuesta creada correctamente.', _closePopupForm);
        }
        else{
          Pard.Widgets.Alert('',Pard.Widgets.Dictionary(data.reason).render());
          // Pard.Widgets.Alert('¡Error!', 'No se ha podido guardar los datos', function(){location.reload();})
        }
      }

      var _openPopupForm = function(type, participants){
        var _content = $('<div>').addClass('very-fast reveal full top-position').attr('id','popupForm');
        _content.empty();
        $('body').append(_content);
        var _popup = new Foundation.Reveal(_content, {closeOnClick: true, animationIn: 'fade-in', animationOut: 'fade-out'});
        _createOwnProposalWidget = Pard.Widgets.CreateOwnProposal(_forms[type], type, participants, _callbackCreatedProposal);
        var _message = Pard.Widgets.PopupContent('Crea y enscribe una propuesta de tipo '+Pard.Widgets.Dictionary(type).render().toLowerCase(), _createOwnProposalWidget);
        _message.setCallback(function(){
          _content.remove();
          _popup.close();
        });
        _content.append(_message.render());
        _closePopupForm = function(){_popup.close();};
        _popup.open();
      }

      _createArtistCaller.click(function(){
        if (!(_forms)) Pard.Backend.getCallForms(the_event.call_id, function(data){
          _forms = data.forms;
          _openPopupForm('artist', _ownArtists);
        })
        else _openPopupForm('artist', _ownArtists);
      });

      _createSpaceCaller.click(function(){
        if (!(_forms)) Pard.Backend.getCallForms(the_event.call_id, function(data){
          _forms = data.forms;
          _openPopupForm('space', []);
        })
        else _openPopupForm('space', []);
      });

      var _artistsList = $('<ul>').addClass('own-proposals-list').attr('id','artist-list-call-page');
      var _spacesList= $('<ul>').addClass('own-proposals-list').attr('id','space-list-call-page');

      var _spacesOwnBox = $('<div>').addClass('ownBox-call-manager');
      var _artistsOwnBox = $('<div>').addClass('ownBox-call-manager');

      var _deleteProposalCallback = function(proposal, profile_id, type, proposalContainer, data){
        if (data['status'] == 'success'){
        $.wait(
          '',
          function(){
            if (type == 'artist') deleteArtist({'profile_id': profile_id, 'proposal_id': proposal.proposal_id});
            else if (type == 'space') {deleteSpace({'profile_id': profile_id});}
          },
          function(){
            Pard.Widgets.Alert('', 'Propuesta eliminada correctamente.');
          }
        )
        }
        else{
          var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
          if (typeof _dataReason == 'object'){
            Pard.Widgets.Alert('¡Error!', 'No se ha podido guardar los datos', location.reload());
          }
          else{
            console.log(data.reason);
            Pard.Widgets.Alert('', _dataReason, location.reload());
          }
        }
      }

      var _modifyProposalCallback = function(data){
        console.log(data);
        if (data['status'] == 'success'){
        $.wait(
          '',
          function(){
            if (type == 'artist') console.log('modify');
            else if (type == 'space') console.log('modify');
          },
          function(){
            Pard.Widgets.Alert('', 'Propuesta eliminada correctamente.');
          }
        )
        }
        else{
          var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
          if (typeof _dataReason == 'object'){
            Pard.Widgets.Alert('¡Error!', 'No se ha podido guardar los datos', location.reload());
          }
          else{
            console.log(data.reason);
            Pard.Widgets.Alert('', _dataReason, location.reload());
          }
        }
      }

      var _newListedItem = function(proposal, profile_id, type, proposalContainer){
        var _proposalListed = $('<span>');
        var _namePopupCaller = $('<a>').attr({'href':'#'})
        if (proposal['title'])  _proposalListed.append(Pard.Widgets.IconManager(proposal['category']).render().addClass('artIcon'), _namePopupCaller.text(Pard.Widgets.CutString(proposal['title'],55)).addClass('artTitle'));
        else _namePopupCaller.text(Pard.Widgets.CutString(proposal['name'],55));
        _namePopupCaller.click(function(){
          if (!(_forms)) {
            Pard.Backend.getCallForms(the_event.call_id, function(data){
              _forms = data.forms;
              var _popupDisplayed = Pard.Widgets.DisplayPopupProposal(proposal, _forms[type][proposal.form_category], type, the_event.name);
              _popupDisplayed.setDeleteProposalCallback(function(data){
                _deleteProposalCallback(proposal, profile_id, type, proposalContainer, data);
              });
              _popupDisplayed.setModifyProposalCallback(function(data){
                _modifyProposalCallback(data);
              });
              _popupDisplayed.open();
            })
          }
          else {
            var _popupDisplayed = Pard.Widgets.DisplayPopupProposal(proposal, _forms[type][proposal.form_category], type, the_event.name);
            _popupDisplayed.setDeleteProposalCallback(function( data){
              _deleteProposalCallback(proposal, profile_id, type, proposalContainer, data );
            });
            _popupDisplayed.open();
          }
        })
        _proposalListed.append(_namePopupCaller);
        return _proposalListed;
      }

      artists.forEach(function(artist){
        var lastElement = artist.profile_id.split('-').pop();
        if (lastElement == 'own') {
          _artistsContainers[artist.profile_id] = {};
          _ownArtists.push(artist);
          var _artistContainer = $('<li>').append(Pard.Widgets.IconManager('artist').render(),$('<span>').text(Pard.Widgets.CutString(artist['name'],55)).addClass('artistName')).addClass('own-artistProposals-container');
          var _artistProposalsList = $('<ul>');
          _artistsContainers[artist.profile_id].li = _artistContainer;
          _artistsContainers[artist.profile_id].ul = _artistProposalsList;
          _artistContainer.append(_artistProposalsList);
          _artistsList.prepend(_artistContainer);
          artist.proposals.forEach(function(proposal){
            var _proposalContainer = $('<li>');
            _artistsContainers[artist.profile_id][proposal.proposal_id] = _proposalContainer;
            var _artistProposal = _newListedItem(proposal, artist.profile_id, 'artist', _proposalContainer);
            _artistProposalsList.append(_proposalContainer.append(_artistProposal));
          })
        }
      })

      spaces.forEach(function(space){
        var lastElement = space.profile_id.split('-').pop();
        if (lastElement == 'own') {
          _ownSpaces.push(space);
          var _proposalContainer = $('<li>').append(Pard.Widgets.IconManager('space').render()).addClass('own-spaceProposal-container');
          _spacesContainers[space.profile_id] = _proposalContainer;
          var _spaceProposal = _newListedItem(space, space.profile_id, 'space', _proposalContainer);
          _spacesList.prepend(_proposalContainer.append(_spaceProposal));
        }
      });

      var _whiteList = Pard.Widgets.WhiteList(the_event);
      // var _buttons = $('<div>').append(_spacePopup.render(), _artistPopup.render()).addClass('buttonsCOntainer-call-page');

      _artistsOwnBox.append(_createArtistCaller, _artistsList);
      _spacesOwnBox.append(_createSpaceCaller, _spacesList);
      _addProposalBox.append(_addProposalText, _artistsOwnBox, _spacesOwnBox);
      _whiteListBox.append(_whiteListText, _whiteList.render());
      _createdWidget.append(_addProposalBox, _whiteListBox);

      Pard.Bus.on('addArtist', function(artist){
        _addArtist(artist);
      });

      Pard.Bus.on('addSpace', function(space){
        _addSpace(space);
      });

      Pard.Bus.on('deleteArtist', function(artist){
        _deleteArtist(artist);
      });

      Pard.Bus.on('deleteSpace', function(space){
        _deleteSpace(space);
      });

      return {
        render: function(){
          return _createdWidget;
        }
      }
    }

    var _programManager = Pard.ProgramManager(the_event);
    //var _tableManager = Pard.Widgets.TableManager(the_event, interactions);

    var _tableManager = Pard.TableManager(the_event);
    var _proposalsManager = ProposalsManager();
    var _qrManager = Pard.qrManager(the_event.qr);

    var _lastSelectedPanel = _tableManager;
    _tableTab.addClass('tab-selected')
    _programTab.on('click', function(){
      if(_lastSelectedPanel != _programManager){
        $('.tab-selected').removeClass('tab-selected');
        _programTab.addClass('tab-selected');
        _lastSelectedPanel.render().hide();
        _programManager.render().show();
        _lastSelectedPanel = _programManager;
      }
    });
    _tableTab.on('click', function(){
      if(_lastSelectedPanel != _tableManager){
        $('.tab-selected').removeClass('tab-selected');
        _tableTab.addClass('tab-selected');
        _lastSelectedPanel.render().hide();
        _tableManager.render().show();
        _lastSelectedPanel = _tableManager;
      }
    });
    _proposalsTab.on('click', function(){
      if(_lastSelectedPanel != _proposalsManager){
        $('.tab-selected').removeClass('tab-selected');
        _proposalsTab.addClass('tab-selected');
        _lastSelectedPanel.render().hide();
        _proposalsManager.render().show();
        _lastSelectedPanel = _proposalsManager;
      }
    });
    _qrTab.on('click', function(){
      if(_lastSelectedPanel != _qrManager){
        $('.tab-selected').removeClass('tab-selected');
        _qrTab.addClass('tab-selected');
        _lastSelectedPanel.render().hide();
        _qrManager.render().show();
        _lastSelectedPanel = _qrManager;
      }
    });

    _tabs.append( _tableTab, _proposalsTab, _programTab, _qrTab);
    _navigationContainer.append(_goToEventBtn, _tabs);
    _panels.append(_programManager.render().hide(), _tableManager.render(), _proposalsManager.render().hide(), _qrManager.render().hide());
    _mainLarge.append(_navigationContainer, _title, _panels);
    _main.append(_mainLarge);

    return {
      render: function(){
        return _main;
      }
    }
  }
}(Pard || {}));
