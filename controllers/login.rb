class LoginController < BaseController

  post '/register' do
    scopify :email, :password, :lang
    check_params email, password
    check_lang! lang
    check_non_existing_user email
    register_user params
    success
  end

  get '/validate' do
    user_id = validated_user params[:id]
    redirect '/' unless user_id
    session[:identity] = user_id
    redirect "http://www.orfheo.org/event?id=#{params[:event_id]}" if Repos::Events.exists? params[:event_id]
    redirect "http://www.orfheo.org/users/"
  end

  post '/login' do
    scopify :email, :password
    check_params email, password
    check_existing_user email
    user = user_for email, password
    session[:identity] = user[:user_id]
    success({lang: user[:lang]})
  end

  post '/logout' do
    session.delete(:identity)
    success
  end

  post '/forgotten_password' do
    scopify :email
    check_invalid_email email
    check_existing_user email
    send_new_validation_code_to email
    success
  end

  private
  def check_params email, password
    check_invalid_email email
    check_invalid_password password
  end

  def check_non_existing_user email
    raise Pard::Invalid::ExistingUser if user_exists? email
  end

  def check_existing_user email
    raise Pard::Invalid::UnexistingUser unless user_exists? email
  end

  def user_exists? email
    Services::Users.exists? email
  end

  def register_user params
    Services::Users.register params
  end

  def validated_user code
    Services::Users.validated_user code
  end

  def user_for email, password
    Services::Users.user_for email, password
  end

  def send_new_validation_code_to email
    Services::Users.forgotten_password email
  end
end
