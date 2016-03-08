class ProfilesController < UsersController

  post '/users/create_profile' do
    check_type params[:type]
    profile_id = Services::Profiles.create params, session[:identity]
    success({profile_id: profile_id})
  end

  post '/users/modify_profile' do
    check_type params[:type]
    profile_id = Services::Profiles.modify params, session[:identity]
    success({profile_id: profile_id})
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
    Services::Profiles.exists? profile_id, session[:identity]
  end
end
