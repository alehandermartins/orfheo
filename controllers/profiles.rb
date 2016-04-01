class ProfilesController < BaseController

  post '/users/create_profile' do
    check_type params[:type]
    profile_id = create_profile params
    success({profile_id: profile_id})
  end

  post '/users/modify_profile' do
    check_type params[:type]
    check_profile_ownership params[:profile_id]
    profile_id = modify_profile params
    success({profile_id: profile_id})
  end

  get '/profiles/:uuid' do
    halt erb(:not_found) unless profile_exists? params[:uuid]
    owner = get_profile_owner params[:uuid]
    profiles = get_profiles owner, params[:uuid]
    halt erb :outsider, :locals => {:profiles => profiles.to_json} if !session[:identity]
    halt erb :visitor, :locals => {:profiles => profiles.to_json} if owner != session[:identity]
    erb :profile, :locals => {:profiles => profiles.to_json} if owner == session[:identity]
  end

  post '/users/create_proposal' do
    check_profile_ownership params[:profile_id]
    add_proposal params
    success({profile_id: params[:profile_id]})
  end

  post '/users/modify_proposal' do
    check_profile_ownership params[:profile_id]
    check_proposal params[:proposal_id]
    proposal = modify_proposal params
    success({proposal: proposal})
  end

  #poner bangs en excepciones
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

  def check_profile_ownership profile_id
    raise Pard::Invalid::UnexistingProfile unless profile_exists? profile_id
    raise Pard::Invalid::ProfileOwnership unless get_profile_owner(profile_id) == session[:identity]
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

  def get_profiles owner, profile_id
    method = :visit_profiles
    method = :user_profiles if owner == session[:identity]
    Services::Profiles.get_profiles method, {user_id: owner, profile_id: profile_id}
  end

  def get_profile_owner profile_id
    Services::Profiles.get_profile_owner profile_id
  end
end

 #kit = IMGKit.new('https://www.pinterest.com/pinterest/',{width: 1366, height: 768})
    
    #image = kit.to_img
    #file = kit.to_file('thumbnail.jpg')
    #Cloudinary::Uploader.upload(File.open('thumbnail.jpg'), width: 200, height: 200, crop: 'scale')
    #File.delete('thumbnail.jpg')
