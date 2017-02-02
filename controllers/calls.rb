class CallsController < BaseController

  post '/users/send_artist_proposal' do
    scopify :event_id, :call_id, :profile_id, :production_id
    check_event_exists! event_id
    check_call_exists! call_id
    check_profile_ownership profile_id

    if production_id.blank?
      production = Production.new(params, session[:identity])
      params[:production_id] = production[:production_id]
      Repos::Profiles.add_production profile_id, production.to_h
    end

    proposal = ArtistProposal.new(session[:identity], event_id, call_id, params)
    Repos::Events.add_artist event_id, proposal.to_h

    message = success({event: 'addArtist', model: proposal.to_h})
    Services::Clients.send_message(event_id, message)
    message
  end

  post '/users/send_space_proposal' do
    scopify :event_id, :call_id, :profile_id
    check_event_exists! event_id
    check_call_exists! call_id
    check_profile_ownership profile_id

    proposal = SpaceProposal.new(session[:identity], event_id, call_id, params)
    Repos::Events.add_space event_id, proposal.to_h

    message = success({event: 'addSpace', model: proposal.to_h})
    Services::Clients.send_message(event_id, message)
    message
  end

  post '/users/amend_artist_proposal' do
    scopify :event_id, :call_id, :proposal_id, :amend
    check_event_exists! event_id
    check_call_exists! call_id
    check_proposal_exists! proposal_id
    old_proposal = Repos::Events.get_artist_proposal(proposal_id)

    check_proposal_ownership! old_proposal[:user_id]
    proposal = ArtistProposal.new(session[:identity], event_id, call_id, old_proposal)
    proposal.amend amend

    Repos::Events.modify_artist proposal.to_h
    success
  end

  post '/users/amend_space_proposal' do
    scopify :event_id, :call_id, :proposal_id, :amend
    check_event_exists! event_id
    check_call_exists! call_id
    check_proposal_exists! proposal_id
    old_proposal = Repos::Events.get_space_proposal(proposal_id)

    check_proposal_ownership! old_proposal[:user_id]
    proposal = SpaceProposal.new(session[:identity], event_id, call_id, old_proposal)
    proposal.amend amend

    Repos::Events.modify_space proposal.to_h
    success
  end

  post '/users/modify_artist_proposal' do
    scopify :event_id, :call_id, :proposal_id
    check_event_ownership! event_id
    check_call_exists! call_id
    check_proposal_exists! proposal_id
    old_proposal = Repos::Events.get_artist_proposal(proposal_id)
    params[:amend] = old_proposal[:amend]

    proposal = ArtistOwnProposal.new(session[:identity], call_id, params) if old_proposal[:own] == true
    proposal = ArtistProposal.new(old_proposal[:user_id], event_id, call_id, params, true) unless old_proposal[:own] == true
    Repos::Events.modify_artist proposal.to_h

    message = success({event: 'modifyArtist', model: proposal.to_h})
    Services::Clients.send_message(event_id, message)
    message
  end

  post '/users/modify_space_proposal' do
    scopify :event_id, :call_id, :profile_id, :proposal_id, :category, :form_category
    check_event_ownership! event_id
    check_call_exists! call_id
    check_proposal_exists! proposal_id
    old_proposal = Repos::Events.get_space_proposal(proposal_id)
    params[:amend] = old_proposal[:amend]

    proposal = SpaceOwnProposal.new(session[:identity], call_id, params) if old_proposal[:own] == true
    proposal = SpaceProposal.new(old_proposal[:user_id], event_id, call_id, params, true) unless old_proposal[:own] == true
    Repos::Events.modify_space proposal.to_h

    message = success({event: 'modifySpace', model: proposal.to_h})
    Services::Clients.send_message(event_id, message)
    message
  end

  post '/users/delete_artist_proposal' do
    scopify :event_id, :proposal_id
    check_event_exists! event_id
    check_proposal_exists! proposal_id

    event = Repos::Events.get_event(event_id)
    proposal = Repos::Events.get_artist_proposal(proposal_id)
    check_proposal_access! event[:user_id], proposal[:user_id]
    
    check_deadline! event, proposal[:email] if session[:identity] != event[:user_id]
    Repos::Events.delete_artist_proposal proposal_id
    send_rejection_mail(event, proposal) if (session[:identity] == event[:user_id] && session[:identity] != proposal[:user_id])

    message = success({event: 'deleteArtist', model: {profile_id: proposal[:profile_id], proposal_id: proposal[:proposal_id]}})
    Services::Clients.send_message(event_id, message)
    message
  end

  post '/users/delete_space_proposal' do
    scopify :event_id, :proposal_id
    check_event_exists! event_id
    check_proposal_exists! proposal_id

    user = Repos::Users.grab({user_id: session[:identity]})
    event = Repos::Events.get_event(event_id)
    proposal = Repos::Events.get_space_proposal(proposal_id)
    check_proposal_access! event[:user_id], proposal[:user_id]

    check_deadline! event, proposal[:email] if session[:identity] != event[:user_id] 
    Repos::Events.delete_space_proposal proposal_id
    send_rejection_mail(event, proposal) if (session[:identity] == event[:user_id] && session[:identity] != proposal[:user_id])
    
    message = success({event: 'deleteSpace', model: {profile_id: proposal[:profile_id]}})
    Services::Clients.send_message(event_id, message)
    message
  end

  post '/users/send_artist_own_proposal' do
    scopify :event_id, :call_id
    check_event_ownership! event_id
    check_call_exists! call_id

    proposal = ArtistOwnProposal.new(session[:identity], call_id, params)
    Repos::Events.add_artist event_id, proposal.to_h
    
    message = success({event: 'addArtist', model: proposal.to_h})
    Services::Clients.send_message(event_id, message)
    message
  end

  post '/users/send_space_own_proposal' do
    scopify :event_id, :call_id
    check_event_ownership! event_id
    check_call_exists! call_id

    proposal = SpaceOwnProposal.new(session[:identity], call_id, params)
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

  private
  def check_call_exists! call_id
    raise Pard::Invalid::UnexistingCall unless Repos::Calls.exists? call_id
  end

  def check_proposal_exists! proposal_id
    raise Pard::Invalid::UnexistingProposal unless Repos::Events.proposal_exists?(proposal_id)
  end

  def check_proposal_access! event_owner, proposal_owner
    raise Pard::Invalid::ProposalOwnership unless event_owner == session[:identity] || proposal_owner == session[:identity]
  end

  def check_proposal_ownership! proposal_owner
    raise Pard::Invalid::ProposalOwnership unless proposal_owner == session[:identity]
  end

  def send_rejection_mail event, proposal
    user = {email: proposal[:email]}
    payload = {organizer: event[:organizer], event_name: event[:name], title: proposal[:title]}
    Services::Mails.deliver_mail_to user, :rejected, payload
  end

  def check_deadline! event, email
    raise Pard::Invalid::Deadline unless on_time?(event, email)
  end

  def on_time? event, email
    return true if event[:whitelist].any?{ |whitelisted| whitelisted[:email] == email }
    event[:start].to_i/1000 < Time.now.to_i && event[:deadline].to_i/1000 > Time.now.to_i
  end
end