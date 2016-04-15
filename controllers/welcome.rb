class WelcomeController < BaseController

  get '/' do
    redirect '/users/' if session[:identity]
    erb :welcome
  end
end
