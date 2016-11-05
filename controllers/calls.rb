class CallsController < BaseController

  post '/users/send_artist_proposal' do
    scopify event_id: true, call_id: true, profile_id: true, production_id: true, category: true
    check_event_exists! event_id
    check_call_exists! call_id
    check_profile_ownership profile_id
    check_category! category
    check_deadline! event_id

    if production_id.blank?
      production = Production.new(params, session[:identity])
      params[:production_id] = production[:production_id]
      Repos::Profiles.add_production profile_id, production.to_h
    end

    form = get_artist_form call_id, category
    proposal = ArtistProposal.new(params, session[:identity], form)
    Repos::Events.add_artist event_id, proposal.to_h
    success ({profile_id: profile_id})
  end

  post '/users/own_proposal' do
    scopify call_id: true
    params[:profile_id] = SecureRandom.uuid + '-own'
    check_call_ownership call_id

    proposal_id = SecureRandom.uuid
    proposal = Forms::Proposals.new(params, session[:identity]).create_own(proposal_id)
    Repos::Calls.add_proposal call_id, proposal
    call = get_call call_id
    success ({call: call})
  end

  post '/users/add_whitelist' do
    scopify call_id: true
    check_call_ownership call_id
    whitelist = Util.arrayify_hash params[:whitelist]
    Repos::Calls.add_whitelist call_id, whitelist
    call = get_call call_id
    success
  end

  post '/users/amend_proposal' do
    scopify proposal_id: true, amend: true
    check_proposal_ownership proposal_id
    Repos::Calls.amend_proposal proposal_id, amend
    success
  end

  post '/users/delete_proposal' do
    scopify proposal_id: true
    check_proposal_ownership proposal_id
    delete_proposal proposal_id
    success
  end

  private
  def check_non_existing call_id
    raise Pard::Invalid::Params unless UUID.validate call_id
    raise Pard::Invalid::ExistingCall if Repos::Calls.exists? call_id
  end

  def check_call_exists! call_id
    raise Pard::Invalid::UnexistingCall unless Repos::Calls.exists? call_id
  end

  def get_artist_form call_id, category
    forms = Repos::Calls.get_forms call_id
    categories = forms[:artist].keys
    raise Pard::Invalid::Params unless categories.include? category.to_sym
    forms[:artist][category.to_sym]
  end

  def check_proposal_ownership proposal_id
    raise Pard::Invalid::UnexistingProposal unless Repos::Calls.proposal_exists? proposal_id
    raise Pard::Invalid::ProposalOwnership unless Repos::Calls.get_proposal_owner(proposal_id) == session[:identity]
  end

  def check_call_ownership call_id
    check_call_exists! call_id
    raise Pard::Invalid::CallOwnership unless Repos::Calls.get_call_owner(call_id) == session[:identity]
  end

  def check_deadline! event_id
    raise Pard::Invalid::Deadline unless Repos::Events.proposal_on_time?(event_id, session[:identity]) == true
  end

  def register_call params
    Services::Calls.register(params, session[:identity])
  end

  def get_proposal_owner proposal_id
    Repos::Calls.get_proposal_owner proposal_id
  end

  def delete_proposal proposal_id
    Services::Calls.delete_proposal proposal_id
  end

  def get_call_owner call_id
    Repos::Calls.get_call_owner call_id
  end

  def get_call call_id
    Repos::Calls.get_call call_id
  end
end
