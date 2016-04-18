class CallsController < BaseController

  post '/users/create_call' do
    check_non_existing params[:call_id]
    register_call params
    success
  end

  post '/users/send_proposal' do
    check_type params[:type]
    check_exists params[:call_id]
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
end
