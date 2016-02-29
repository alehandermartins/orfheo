class LoginController < BaseController

  post '/register_attempt' do
    check_params params[:email], params[:password]
    check_non_existing_user params[:email]
    register_user params[:email], params[:password]
    success
  end

  get '/validate/:uuid' do
    user_id = validated_user params[:uuid]
    redirect '/' if user_id == false
    session[:identity] = user_id
    #redirect 'http://' + request.host + '/users/'
    redirect 'http://pard.herokuapp.com/users/'
  end

  post '/login_attempt' do
    check_params params[:email], params[:password]
    check_existing_user params[:email]
    user_id = user_id_for params[:email], params[:password]
    session[:identity] = user_id
    success
  end

  post '/logout' do
    session.delete(:identity)
    success
  end

  post '/forgotten_password' do
    check_invalid_email params[:email]
    check_existing_user params[:email]
    send_new_validation_code_to params[:email]
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

  def user_id_for email, password
    Services::Users.user_id_for email, password
  end

  def send_new_validation_code_to email
    Services::Users.forgotten_password email
  end
end
