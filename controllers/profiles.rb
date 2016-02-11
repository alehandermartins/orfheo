class ProfilesController < UsersController

  post '/users/create_profile' do
    check_type params['type']
    is_possible? params, session[:identity]
    profile_id = create_profile params, session[:identity]
    success({profile_id: profile_id})
  end

  get '/users/profiles/:uuid' do
    halt erb(:users) unless exists? params[:uuid]
    erb(:profile)
  end

  post '/users/profiles/get_profiles' do
    profiles = Services::Profiles.get_profiles_for session[:identity]
    success({profiles: profiles})
  end

  private
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

  def exists? uuid
    Services::Profiles.exists? :profile_id, uuid, session[:identity]
  end
end
