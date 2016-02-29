class UsersController < BaseController

  before '/users/*' do
    if !session[:identity] then
      redirect '/'
    end
  end

  get '/users/' do
    profiles = Services::Profiles.get_profiles_for session[:identity]
    erb :users, :locals => {:profiles => profiles.to_json}
  end

  post '/users/modify_password' do
    check_invalid_password params[:password]
    modify_password params[:password]
    success
  end

  private
  def modify_password new_password
    Services::Users.modify_password session[:identity], new_password
  end
end
