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

  private

  def check_non_existing call_id
    raise Pard::Invalid::ExistingCall if Services::Calls.exists? call_id
  end

  def check_exists call_id
    raise Pard::Invalid::UnexistingCall unless Services::Calls.exists? call_id
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
end
