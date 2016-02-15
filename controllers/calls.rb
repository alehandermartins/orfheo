class CallsController < BaseController

  post '/users/create_call' do
    check_exists
    Services::Calls.register({}, session[:identity])
    success
  end

  private
  def check_exists
    raise Pard::Invalid.new 'existing_call' if Services::Calls.exists? 'b5bc4203-9379-4de0-856a-55e1e5f3fac6'
  end
end
