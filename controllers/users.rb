class UsersController < BaseController

  before '/users/*' do
    puts session[:identity]
    if !session[:identity] then
      redirect '/'
    end
  end

  get '/users/' do
    profiles = Repos::Profiles.get_profiles :user_profiles, {user_id: session[:identity]}
    erb :users, :locals => {:profiles => profiles.to_json}
  end

  post '/users/modify_password' do
    check_invalid_password params[:password]
    modify_password params[:password]
    success
  end

  post '/users/delete_user' do
    Services::Users.delete_user session[:identity]
    session.delete(:identity)
    success
  end

  private
  def modify_password new_password
    Services::Users.modify_password session[:identity], new_password
  end
end
