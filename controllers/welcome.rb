class WelcomeController < BaseController

  get '/' do
    redirect '/users/' if session[:identity]
    profiles = get_profiles :all
    erb :welcome, :locals => {:profiles => profiles.to_json}
  end

  private
  def get_profiles method, args = nil
    Services::Profiles.get_profiles method, args
  end
end
