class WelcomeController < BaseController

#check session, redirect to user page
  get '/' do
    profiles = Services::Profiles.get_profiles
    erb :welcome, :locals => {:profiles => profiles.to_json}
  end

end
