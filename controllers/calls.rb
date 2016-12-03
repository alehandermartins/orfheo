class CallsController < BaseController

  post '/users/send_artist_proposal' do
    scopify event_id: true, call_id: true, profile_id: true, production_id: true, category: true, form_category: true
    check_event_exists! event_id
    check_call_exists! call_id
    check_profile_ownership profile_id
    check_artist_category! category
    check_deadline! event_id

    if production_id.blank?
      production = Production.new(params, session[:identity])
      params[:production_id] = production[:production_id]
      Repos::Profiles.add_production profile_id, production.to_h
    end

    form = get_artist_form call_id, form_category
    proposal = ArtistProposal.new(params, session[:identity], form)
    Repos::Events.add_artist event_id, proposal.to_h
    success ({proposal: proposal.to_h})
  end

  post '/users/send_space_proposal' do
    scopify event_id: true, call_id: true, profile_id: true, category: true, form_category: true
    check_event_exists! event_id
    check_call_exists! call_id
    check_profile_ownership profile_id
    check_space_category! category
    check_deadline! event_id

    form = get_space_form call_id, form_category
    proposal = SpaceProposal.new(params, session[:identity], form)
    Repos::Events.add_space event_id, proposal.to_h
    success ({proposal: proposal.to_h})
  end

  post '/users/amend_artist_proposal' do
    scopify event_id: true, proposal_id: true, amend: true
    check_event_exists! event_id
    check_deadline! event_id
    check_proposal_exists! proposal_id
    check_artist_proposal_ownership! proposal_id
    Repos::Events.amend_artist proposal_id, amend
    success
  end

  post '/users/amend_space_proposal' do
    scopify event_id: true, proposal_id: true, amend: true
    check_event_exists! event_id
    check_proposal_exists! proposal_id
    check_deadline! event_id
    check_space_proposal_ownership! proposal_id
    Repos::Events.amend_space proposal_id, amend
    success
  end

  post '/users/modify_artist_proposal' do
    scopify event_id: true, call_id: true, profile_id: true, proposal_id: true, category: true, form_category: true
    check_event_ownership! event_id
    check_proposal_exists! proposal_id
    check_call_exists! call_id
    check_artist_category! category

    form = get_artist_form call_id, form_category
    proposal = ArtistOwnProposal.new(params, session[:identity], form) if profile_id.split('-').last == 'own'
    proposal = ArtistProposal.new(params, session[:identity], form) unless profile_id.split('-').last == 'own'
    Repos::Events.modify_artist proposal.to_h
    success
  end

  post '/users/modify_space_proposal' do
    scopify event_id: true, call_id: true, profile_id: true, proposal_id: true, category: true, form_category: true
    check_event_ownership! event_id
    check_proposal_exists! proposal_id
    check_call_exists! call_id
    check_space_category! category

    form = get_space_form call_id, form_category
    proposal = SpaceOwnProposal.new(params, session[:identity], form) if profile_id.split('-').last == 'own'
    proposal = SpaceProposal.new(params, session[:identity], form) unless profile_id.split('-').last == 'own'
    Repos::Events.modify_space proposal.to_h
    success
  end

  post '/users/delete_artist_proposal' do
    scopify event_id: true, proposal_id: true
    check_event_exists! event_id
    check_proposal_exists! proposal_id

    event = Repos::Events.get_event(event_id)
    proposal = Repos::Events.get_artist_proposal(proposal_id)
    check_proposal_access! event[:user_id], proposal[:user_id]
    check_deadline! event_id
    Repos::Events.delete_artist_proposal proposal_id

    send_rejection_mail(event, proposal[:user_id], proposal[:title]) if (session[:identity] == event[:user_id] && session[:identity] != proposal[:user_id])
    success({profile_id: proposal[:profile_id], proposal_id: proposal[:proposal_id]})
  end

  post '/users/delete_space_proposal' do
    scopify event_id: true, proposal_id: true
    check_event_exists! event_id
    check_proposal_exists! proposal_id

    event = Repos::Events.get_event(event_id)
    proposal = Repos::Events.get_space_proposal(proposal_id)
    check_proposal_access! event[:user_id], proposal[:user_id]
    check_deadline! event_id
    Repos::Events.delete_space_proposal proposal_id

    send_rejection_mail(event, proposal[:user_id], proposal[:name]) if (session[:identity] == event[:user_id] && session[:identity] != proposal[:user_id])
    success({profile_id: proposal[:profile_id]})
  end

  post '/users/send_artist_own_proposal' do
    scopify event_id: true, call_id: true, profile_id: true, category: true, form_category: true
    check_event_ownership! event_id
    check_call_exists! call_id
    check_artist_category! category

    form = get_artist_form call_id, form_category
    proposal = ArtistOwnProposal.new(params, session[:identity], form)
    Repos::Events.add_artist event_id, proposal.to_h
    success({artist: proposal.to_h})
  end

  post '/users/send_space_own_proposal' do
    scopify event_id: true, call_id: true, profile_id: true, category: true, form_category: true
    check_event_ownership! event_id
    check_call_exists! call_id
    check_space_category! category

    form = get_space_form call_id, form_category
    proposal = SpaceOwnProposal.new(params, session[:identity], form)
    Repos::Events.add_space event_id, proposal.to_h
    success({space: proposal.to_h})
  end

  post '/users/add_whitelist' do
    scopify event_id: true, whitelist: true
    check_event_ownership! event_id
    list = Util.arrayify_hash whitelist
    Repos::Events.add_whitelist event_id, list
    success
  end

  private
  def check_call_exists! call_id
    raise Pard::Invalid::UnexistingCall unless Repos::Calls.exists? call_id
  end

  def get_artist_form call_id, form_category
    forms = Repos::Calls.get_forms call_id
    categories = forms[:artist].keys
    raise Pard::Invalid::Params unless categories.include? form_category.to_sym
    forms[:artist][form_category.to_sym]
  end

  def get_space_form call_id, form_category
    forms = Repos::Calls.get_forms call_id
    categories = forms[:space].keys
    raise Pard::Invalid::Params unless categories.include? form_category.to_sym
    forms[:space][form_category.to_sym]
  end

  def check_proposal_exists! proposal_id
    raise Pard::Invalid::UnexistingProposal unless Repos::Events.proposal_exists?(proposal_id)
  end

  def check_artist_proposal_ownership! proposal_id
    raise Pard::Invalid::ProposalOwnership unless Repos::Events.get_artist_proposal_owner(proposal_id) == session[:identity]
  end

  def check_space_proposal_ownership! proposal_id
    raise Pard::Invalid::ProposalOwnership unless Repos::Events.get_space_proposal_owner(proposal_id) == session[:identity]
  end

  def check_call_ownership call_id
    check_call_exists! call_id
    raise Pard::Invalid::CallOwnership unless Repos::Calls.get_call_owner(call_id) == session[:identity]
  end

  def check_deadline! event_id
    raise Pard::Invalid::Deadline unless Repos::Events.proposal_on_time?(event_id, session[:identity]) == true
  end

  def check_proposal_access! event_owner, proposal_owner
    raise Pard::Invalid::ProposalOwnership unless event_owner == session[:identity] || proposal_owner == session[:identity]
  end

  def send_rejection_mail event, user_id, title
    user = Repos::Users.grab({user_id: user_id})
    payload = {organizer: event[:organizer], event_name: event[:name], title: title}
    Services::Mails.deliver_mail_to user, :rejected, payload
  end
end
