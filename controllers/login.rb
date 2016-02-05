class LoginController < BaseController

  post '/register_attempt' do
    check_params params['email'], params['password']
    fail! if user_exists? params['email']
    register_user params['email'], params['password']
    success
  end

  post '/login_attempt' do
    fail! unless user_exists? params['email']
    fail! unless validated? params['email']
    fail! unless correct_password? params['email'], params['password']
    session[:identity] = params['email']
    success
  end

  get '/validation/:uuid' do
    username = validated_user params['uuid']
    halt erb(:welcome) unless username
    session[:identity] = username
    redirect to 'localhost:3000/users/place'
  end

  private
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

  def get_user_by code
    Services::Users.get_user_by code
  end

  def validated_user code
    Services::Users.validated_user code
  end

  def validated? email
    Services::Users.validated? email
  end

  def correct_password? email, password
    Services::Users.correct_password? email, password
  end
end
