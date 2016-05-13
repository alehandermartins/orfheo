class UsersController < BaseController

  before '/users/*' do
    if !session[:identity] then
      redirect '/'
    end
  end

  get '/users/' do
    profiles = get_profiles :user_profiles, {user_id: session[:identity]}
    calls = get_calls session[:identity]
    erb :users, :locals => {:profiles => profiles.to_json, :calls => calls.to_json}
  end

  post '/users/modify_password' do
    check_invalid_password params[:password]
    modify_password params[:password]
    success
  end

  post '/users/delete_user' do
    delete_user
    session.delete(:identity)
    success
  end

  private
  def get_profiles method, args
    Services::Profiles.get_profiles method, args
  end

  def get_calls user_id
    Repos::Calls.get_user_calls user_id
  end

  def modify_password new_password
    Services::Users.modify_password session[:identity], new_password
  end

  def delete_user
    Services::Users.delete_user session[:identity]
  end
end
