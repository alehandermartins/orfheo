class LoginController < BaseController

  post '/register_attempt' do
    check_params params['email'], params['password']
    check_non_existing_user params['email']
    register_user params['email'], params['password']
    success
  end

  get '/validation/:uuid' do
    username = validated_user params['uuid']
    halt erb(:welcome) unless username
    session[:identity] = username
    redirect to 'localhost:3000/users/place'
  end

  post '/login_attempt' do
    check_params params['email'], params['password']
    check_existing_user params['email']
    is_validated? params['email']
    fail! unless correct_password? params['email'], params['password']
    session[:identity] = params['email']
    success
  end

  post '/logout' do
    session.delete(:identity)
    success
  end

  post '/forgotten_password' do
    check_invalid_email params['email']
    check_existing_user params['email']
    send_new_validation_code_to params['email']
    success
  end

  private
  def check_params email, password
    check_invalid_email email
    check_invalid_password password
  end

  def check_non_existing_user email
    raise Pard::Invalid.new 'already_registered' if user_exists? email
  end

  def check_existing_user email
    raise Pard::Invalid.new 'non_existing_user' unless user_exists? email
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

  def validated_user code
    Services::Users.validated_user code
  end

  def is_validated? email
    raise Pard::Invalid.new 'not_validated_user' unless Services::Users.validated? email
  end

  def correct_password? email, password
    Services::Users.correct_password? email, password
  end

  def send_new_validation_code_to email
    Services::Users.forgotten_password email
  end
end
