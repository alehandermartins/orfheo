class ProfilesController < UsersController

  post '/users/create_profile' do
    check_type params['type']
    is_possible? params, session[:identity]
    profile_id = create_profile params, session[:identity]
    success({profile_id: profile_id})
  end

  get '/users/profiles/:uuid' do
    halt erb(:not_found) unless exists? params[:uuid]
    profile = Services::Profiles.get_profile_for session[:identity], params[:uuid]
    erb :profile, :locals => {:profile => profile.to_json}
  end

  post '/users/profiles/modify' do
    check_exists params[:profile_id]
    check_params params
    modify params
    success
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

  def check_exists uuid
    raise Pard::Invalid.new 'unexisting_profile' unless exists? uuid
  end

  def check_params params
    Services::Profiles.check_params params
  end

  def modify params
    Services::Profiles.modify params, session[:identity]
  end
end
