class WelcomeController < BaseController

  get '/' do
    redirect '/users/' if session[:identity]
    profiles = Services::Profiles.get_profiles
    erb :welcome, :locals => {:profiles => profiles.to_json}
  end
end
