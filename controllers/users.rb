class UsersController < BaseController

  before '/users/*' do
    if !session[:identity] then
      halt erb(:welcome)
    end
  end

  get '/users/' do
    erb(:users)
  end

  post '/users/modify_password' do
    check_invalid_password params['password']
    modify_password params['password']
    success
  end

  private
  def modify_password new_password
    Services::Users.modify_password session[:identity], new_password
  end
end
