class ProfilesController < BaseController

  post '/profiles/create' do
    check_logged_in
    check_type params['type']
    is_possible? params, session[:identity]
    create_profile params, session[:identity]
    success
  end

  get '/profiles/:name' do
    erb(:profile)
  end

  private
  def check_logged_in
    raise Pard::Invalid.new 'not_logged_in' unless session[:identity]
  end

  def check_type type
    raise Pard::Invalid.new 'invalid_type' unless invalid_type? type
  end

  def invalid_type? type
    !invalid_param?(type) && ['artist', 'space'].include?(type)
  end

  def is_possible? params, user_id
    Services::Profiles.is_possible? params, session[:identity]
  end

  def create_profile params, user_id
    Services::Profiles.create params, user_id
  end
end
