class CallsController < BaseController

  post '/users/create_call' do
    check_non_existing params[:call_id]
    register_call params
    success
  end

  post '/users/send_proposal' do
    check_type params[:type]
    check_exists params[:call_id]
    check_profile_ownership params[:profile_id]
    send_proposal params
    success ({profile_id: params[:profile_id]})
  end

  post '/users/amend_proposal' do
    check_proposal_ownership params[:proposal_id]
    amend_proposal params[:proposal_id], params[:amend]
    success
  end

  post '/users/delete_proposal' do
    check_proposal_ownership params[:proposal_id]
    delete_proposal params[:proposal_id]
    success
  end

  get '/call' do
    halt erb(:not_found) unless Services::Calls.exists? params[:id]
    owner = get_call_owner params[:id]
    halt erb(:not_found) unless owner == session[:identity]
    call = get_call params[:id]
    erb :call, :locals => {:call => call.to_json}
  end

  post '/users/program' do
    check_call_ownership params[:call_id]
    add_program params[:call_id], params[:program]
    success
  end


  private
  def check_non_existing call_id
    raise Pard::Invalid::Params unless UUID.validate call_id
    raise Pard::Invalid::ExistingCall if Services::Calls.exists? call_id
  end

  def check_exists call_id
    raise Pard::Invalid::UnexistingCall unless Services::Calls.exists? call_id
  end

  def check_proposal_ownership proposal_id
    raise Pard::Invalid::UnexistingProposal unless Services::Calls.proposal_exists? proposal_id
    raise Pard::Invalid::ProposalOwnership unless Services::Calls.get_proposal_owner(proposal_id) == session[:identity]
  end

  def check_call_ownership call_id
    check_exists call_id
    raise Pard::Invalid::CallOwnership unless Services::Calls.get_call_owner(call_id) == session[:identity]
  end

  def register_call params
    Services::Calls.register(params, session[:identity])
  end

  def check_type type
    raise Pard::Invalid::Type unless ['artist', 'space'].include? type
  end

  def send_proposal params
    Services::Calls.add_proposal params, session[:identity]
  end

  def get_proposal_owner proposal_id
    Services::Calls.get_proposal_owner proposal_id
  end

  def amend_proposal proposal_id, amend
    Services::Calls.amend_proposal proposal_id, amend
  end

  def delete_proposal proposal_id
    Services::Calls.delete_proposal proposal_id
  end

  def get_call_owner call_id
    Services::Calls.get_call_owner call_id
  end

  def get_call call_id
    Services::Calls.get_call call_id
  end

  def add_program call_id, program
    return true if program.blank?
    program = Util.arrayify_hash program
    program.map!{ |proposal|
      {
        proposal_id: proposal[:proposal_id],
        program: Util.arrayify_hash(proposal[:program])
      }
    }
    Repos::Calls.add_program call_id, program
  end
end
