class CallsController < BaseController

  post '/users/send_artist_proposal' do
    scopify :event_id, :profile_id, :production_id

    if production_id.blank?
      production = Production.new(params, session[:identity])
      params[:production_id] = production[:production_id]
      Repos::Profiles.add_production profile_id, production.to_h
    end

    proposal = ArtistProposal.new(session[:identity], params)
    proposal.create
    Repos::Events.add_artist event_id, proposal.to_h

    message = success({event: 'addArtist', model: proposal.to_h})
    Services::Clients.send_message(event_id, message)
    message
  end

  post '/users/send_space_proposal' do
    scopify :event_id

    proposal = SpaceProposal.new(session[:identity], params)
    proposal.create
    Repos::Events.add_space event_id, proposal.to_h

    message = success({event: 'addSpace', model: proposal.to_h})
    Services::Clients.send_message(event_id, message)
    message
  end

  post '/users/amend_artist_proposal' do
    scopify :event_id

    proposal = ArtistProposal.new(session[:identity], params)
    proposal.amend

    Repos::Events.modify_artist proposal.to_h
    success
  end

  post '/users/amend_space_proposal' do
    scopify :event_id

    proposal = SpaceProposal.new(session[:identity], params)
    proposal.amend

    Repos::Events.modify_space proposal.to_h
    success
  end

  post '/users/modify_artist_proposal' do
    scopify :event_id

    proposal = ArtistProposal.new(session[:identity], params)
    proposal = ArtistOwnProposal.new(session[:identity], params) if proposal.own == true
    proposal.modify
    Repos::Events.modify_artist proposal.to_h

    message = success({event: 'modifyArtist', model: proposal.to_h})
    Services::Clients.send_message(event_id, message)
    message
  end

  post '/users/modify_space_proposal' do
    scopify :event_id

    proposal = SpaceProposal.new(session[:identity], params)
    proposal = SpaceOwnProposal.new(session[:identity], params) if proposal.own == true
    proposal.modify
    Repos::Events.modify_space proposal.to_h

    message = success({event: 'modifySpace', model: proposal.to_h})
    Services::Clients.send_message(event_id, message)
    message
  end

  post '/users/delete_artist_proposal' do
    scopify :proposal_id, :event_id

    proposal = ArtistProposal.new(session[:identity], params)
    proposal.delete

    Repos::Events.delete_artist_proposal proposal_id

    message = success({event: 'deleteArtist', model: {profile_id: proposal[:profile_id], proposal_id: proposal_id}})
    Services::Clients.send_message(event_id, message)
    message
  end

  post '/users/delete_space_proposal' do
    scopify :proposal_id, :event_id

    proposal = SpaceProposal.new(session[:identity], params)
    proposal.delete

    Repos::Events.delete_space_proposal proposal_id

    message = success({event: 'deleteSpace', model: {profile_id: proposal[:profile_id]}})
    Services::Clients.send_message(event_id, message)
    message
  end

  post '/users/send_artist_own_proposal' do
    scopify :event_id

    proposal = ArtistOwnProposal.new(session[:identity], params)
    proposal.create
    Repos::Events.add_artist event_id, proposal.to_h
    
    message = success({event: 'addArtist', model: proposal.to_h})
    Services::Clients.send_message(event_id, message)
    message
  end

  post '/users/send_space_own_proposal' do
    scopify :event_id

    proposal = SpaceOwnProposal.new(session[:identity], params)
    proposal.create
    Repos::Events.add_space event_id, proposal.to_h
    
    message = success({event: 'addSpace', model: proposal.to_h})
    Services::Clients.send_message(event_id, message)
    message
  end

  post '/users/add_whitelist' do
    scopify :event_id
    check_event_ownership! event_id

    whitelist = Whitelist.new(params, event_id)
    Repos::Events.add_whitelist event_id, whitelist.to_a

    message = success({event: 'addWhitelist', model: whitelist.to_a})
    Services::Clients.send_message(event_id, message)
    message
  end

  post '/users/delete_whitelist' do
    scopify :event_id, :email
    check_event_ownership! event_id

    event = Repos::Events.get_event params[:event_id]
    event[:whitelist].reject!{ |participant| participant[:email] ==  email}

    Repos::Events.add_whitelist event_id, event[:whitelist]

    message = success({event: 'addWhitelist', model: event[:whitelist]})
    Services::Clients.send_message(event_id, message)
    message
  end
end