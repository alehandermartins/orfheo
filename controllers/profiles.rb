class ProfilesController < BaseController

  post '/users/create_profile' do
    check_type params[:type]
    profile_id = create_profile params
    success({profile_id: profile_id})
  end

  post '/users/modify_profile' do
    check_type params[:type]
    check_profile params[:profile_id]
    profile_id = modify_profile params
    success({profile_id: profile_id})
  end

  get '/users/profiles/:uuid' do
    halt erb(:not_found) unless profile_exists? params[:uuid]
    profiles = get_profiles :user_profiles, {user_id: session[:identity]}
    erb :profile, :locals => {:profiles => profiles.to_json}
  end

  post '/users/create_proposal' do
    check_profile params[:profile_id]
    add_proposal params
    success({profile_id: params[:profile_id]})
  end

  post '/users/modify_proposal' do
    check_proposal params[:proposal_id]
    modify_proposal params
    success({profile_id: params[:profile_id]})
  end

  private
  def check_type type
    raise Pard::Invalid::Type unless ['artist', 'space'].include? type
  end

  def create_profile params
    Services::Profiles.create params, session[:identity]
  end

  def modify_profile params
    Services::Profiles.modify params, session[:identity]
  end

  def check_profile profile_id
    raise Pard::Invalid::UnexistingProfile unless profile_exists? profile_id
  end

  def add_proposal params
    Services::Profiles.add_proposal params, session[:identity]
  end

  def check_proposal proposal_id
    raise Pard::Invalid::UnexistingProposal unless proposal_exists? proposal_id
  end

  def modify_proposal params
    Services::Profiles.modify_proposal params, session[:identity]
  end

  def profile_exists? profile_id
    Services::Profiles.exists? profile_id
  end

  def proposal_exists? proposal_id
    Services::Profiles.proposal_exists? proposal_id
  end

  def get_profiles method, args
    Services::Profiles.get_profiles method, args
  end
end
