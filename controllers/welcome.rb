class WelcomeController < BaseController

#check session, redirect to user page
  get '/' do
    erb :welcome
  end

end
