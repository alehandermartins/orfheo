class CallsController < BaseController

  post '/users/create_call' do
    scopify call_id: true
    check_non_existing call_id
    register_call params
    success
  end

  post '/users/send_proposal' do
    scopify call_id: true, profile_id: true, production_id: true, type: true
    check_call_exists! call_id
    check_profile_ownership profile_id
    #check_deadline call_id

    proposal_id = SecureRandom.uuid
    proposal = Forms::Proposals.new(params, session[:identity]).create(proposal_id)
    Repos::Calls.add_proposal call_id, proposal

    if production_id.blank? && type == 'artist'
      production = Forms::Productions.new(params, session[:identity]).create(proposal[:production_id])
      Repos::Profiles.add_production profile_id, production
    end

    success ({profile_id: profile_id})
  end

  post '/users/own_proposal' do
    scopify call_id: true
    params[:profile_id] = nil
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

  get '/call' do
    halt erb(:not_found) unless Repos::Calls.exists? params[:id]
    owner = get_call_owner params[:id]
    halt erb(:not_found) unless owner == session[:identity]
    call = get_call params[:id]
    erb :call, :locals => {:call => call.to_json}
  end

  post '/users/program' do
    scopify event_id: true
    check_event_ownership! event_id
    puts params[:program]
    program = Forms::Program.new(params, session[:identity]).create
    Repos::Calls.add_program event_id, program
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

  def check_event_exists! event_id
    raise Pard::Invalid::UnexistingEvent unless Repos::Calls.event_exists? event_id
  end

  def check_proposal_ownership proposal_id
    raise Pard::Invalid::UnexistingProposal unless Repos::Calls.proposal_exists? proposal_id
    raise Pard::Invalid::ProposalOwnership unless Repos::Calls.get_proposal_owner(proposal_id) == session[:identity]
  end

  def check_call_ownership call_id
    check_call_exists! call_id
    raise Pard::Invalid::CallOwnership unless Repos::Calls.get_call_owner(call_id) == session[:identity]
  end

  def check_event_ownership! event_id
    check_event_exists! event_id
    raise Pard::Invalid::EventOwnership unless Repos::Calls.get_event_owner(event_id) == session[:identity]
  end

  def check_deadline call_id
    user_email = Repos::Users.grab({user_id: session[:identity]})[:email]
    raise Pard::Invalid::Deadline unless Repos::Calls.proposal_on_time?(call_id, user_email) == true
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

  def add_program call_id, program
    Repos::Calls.add_program call_id, program
  end
end
