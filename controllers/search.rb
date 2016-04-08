class SearchController < BaseController

  post '/' do
    check_type params[:type]
    profile_id = create_profile params
    success({profile_id: profile_id})
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
