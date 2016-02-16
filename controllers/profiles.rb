class ProfilesController < UsersController

  post '/users/update_profile' do
    check_type params[:type]
    profile = PROFILES_MAP[params[:type]].new params, session[:identity]

    raise Pard::Invalid.new 'existing_profile' if profile.exists?
    raise Pard::Invalid.new 'invalid_parameters' if profile.wrong_params?
    profile.update
    success({profile_id: profile.uuid})
  end

  get '/users/profiles/:uuid' do
    halt erb(:not_found) unless profile_exists? params[:uuid]
    profile = Services::Profiles.get_profile_for session[:identity], params[:uuid]
    proposals = Services::Calls.get_proposals_for params[:uuid]
    erb :profile, :locals => {:profile => profile.to_json, :proposals => proposals.to_json}
  end

  PROFILES_MAP = {
    'artist' => ArtistProfile,
    'space' => SpaceProfile
  }

  private
  def check_type type
    raise Pard::Invalid.new 'invalid_type' unless ['artist', 'space'].include? type
  end

  def profile_exists? profile_id
    Services::Profiles.exists? :profile_id, profile_id , session[:identity]
  end
end
