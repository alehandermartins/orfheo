class UsersController < BaseController

  post '/register_attempt' do
    check_params params['email'], params['password']
    fail! if user_exists? params['email']
    register_user params['email'], params['password']
    success
  end

  def check_params email, password
    check_invalid_email email, 'invalid_email'
    check_invalid_password password, 'invalid_password'
  end

  def check_invalid_email email, message
    raise Pard::Invalid.new message if invalid_email? email
  end

  def check_invalid_password password, message
    raise Pard::Invalid.new message if invalid_password? password
  end

  def invalid_email? email
    (email =~ /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i).nil?
  end

  def invalid_password? password
    password.nil? || password.empty? || password.size < 8
  end

  def user_exists? email
    Services::Users.exists? email
  end

  def register_user email, password
    user = {
      email: email,
      password: password,
    }
    Services::Users.register user
  end
end
