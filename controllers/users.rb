class UsersController < BaseController

  post '/register_attempt' do
    fail! if invalid_params? params['email'], params['password']
    welcome_mail params['email']
    success
  end

  def invalid_params? email, password
    (invalid_param? email) || (invalid_password? password)
  end

  def invalid_password? password
     (invalid_param? password) || (password.size < 8)
  end

  def invalid_param? param
    param.nil? || param.empty?
  end

  def welcome_mail email
    Services::Mails.deliver_mail email
  end
end
