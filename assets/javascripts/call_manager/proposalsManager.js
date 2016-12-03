'use strict';

(function(ns){

  ns.ProposalsManager = function(the_event, displayer){

    var artists = the_event.artists;
    var spaces = the_event.spaces;

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


    var _openPopupForm = displayer.createOwnProposal;

    _createArtistCaller.click(function(){
      _openPopupForm('artist', _ownArtists);
    });

    _createSpaceCaller.click(function(){
      _openPopupForm('space', []);
    });

    var _artistsList = $('<ul>').addClass('own-proposals-list').attr('id','artist-list-call-page');
    var _spacesList= $('<ul>').addClass('own-proposals-list').attr('id','space-list-call-page');

    var _spacesOwnBox = $('<div>').addClass('ownBox-call-manager');
    var _artistsOwnBox = $('<div>').addClass('ownBox-call-manager');

    var _modifyProposalCallback = function(data){
      if (data['status'] == 'success'){
        if (type == 'artist') console.log('modify');
        else if (type == 'space') console.log('modify');
        Pard.Widgets.Alert('', 'Propuesta eliminada correctamente.');
      }
      else{
        var _dataReason = Pard.Widgets.Dictionary(data.reason).render();
        if (typeof _dataReason == 'object')
          Pard.Widgets.Alert('¡Error!', 'No se ha podido guardar los datos', location.reload());
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
        displayer.displayProposal(proposal, type);
      });
      _proposalListed.append(_namePopupCaller);
      return _proposalListed;
    }

    Object.keys(artists).forEach(function(profile_id){
      var lastElement = profile_id.split('-').pop();
      if (lastElement == 'own') {
        var artist = artists[profile_id].artist;
        _artistsContainers[profile_id] = {};
        _ownArtists.push(artist);
        var _artistContainer = $('<li>').append(Pard.Widgets.IconManager('artist').render(),$('<span>').text(Pard.Widgets.CutString(artist['name'],55)).addClass('artistName')).addClass('own-artistProposals-container');
        var _artistProposalsList = $('<ul>');
        _artistsContainers[profile_id].li = _artistContainer;
        _artistsContainers[profile_id].ul = _artistProposalsList;
        _artistContainer.append(_artistProposalsList);
        _artistsList.prepend(_artistContainer);
        artist.proposals.forEach(function(proposal){
          var _proposalContainer = $('<li>');
          _artistsContainers[profile_id][proposal.proposal_id] = _proposalContainer;
          var _artistProposal = _newListedItem(proposal, profile_id, 'artist', _proposalContainer);
          _artistProposalsList.append(_proposalContainer.append(_artistProposal));
        })
      }
    })

   Object.keys(the_event.spaces).forEach(function(profile_id){
      var lastElement = profile_id.split('-').pop();
      if (lastElement == 'own') {
        var space = the_event.spaces[profile_id].space;
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
}(Pard || {}));
