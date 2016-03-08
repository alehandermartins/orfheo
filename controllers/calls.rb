class CallsController < BaseController

  post '/users/create_call' do
    check_exists
    Services::Calls.register({}, session[:identity])
    success
  end

  post '/users/send_proposal' do
    check_type params[:type]
    check_category params
    check_form params
    Services::Calls.add_proposal params, session[:identity]
    success ({profile_id: params[:profile_id]})
  end

  private
  def check_exists
    raise Pard::Invalid.new 'existing_call' if Services::Calls.exists? 'b5bc4203-9379-4de0-856a-55e1e5f3fac6'
  end

  def check_type type
    raise Pard::Invalid.new 'invalid_type' unless ['artist', 'space'].include? type
  end

  def check_category params
    raise Pard::Invalid.new 'invalid_category' if Services::Calls.wrong_category? params
  end

  def check_form params
    raise Pard::Invalid.new 'invalid_form' if Services::Calls.wrong_form? params
  end
end
