class ProfilesController < BaseController

  post '/users/create_profile' do
    profile_id = SecureRandom.uuid
    name_available? params[:name]

    profile = Forms::Profiles.new(params, session[:identity]).create(profile_id)
    Repos::Profiles.update profile
    success({profile: profile})
  end

   post '/users/modify_profile' do
    scopify profile_id: true
    check_profile_ownership profile_id
    name_available? params[:name]

    profile = Forms::Profiles.new(params, session[:identity]).modify(profile_id)
    old_pictures = Services::Profiles.profile_old_pictures profile_id
    Repos::Profiles.update profile
    Services::Profiles.destroy_profile_old_pictures old_pictures, profile

    proposals = Repos::Calls.get_proposals(:profile_info, {profile_id: profile[:profile_id]})[:proposals]
    proposals.each{ |proposal|
      proposal = Forms::Proposals.new(proposal, session[:identity]).modify(proposal[:proposal_id])
      Repos::Calls.modify_proposal proposal
    }
    
    success({profile_id: profile_id})
  end

  get '/profile' do
    halt erb(:not_found) unless Repos::Profiles.exists? params[:id]
    owner = Repos::Profiles.get_profile_owner params[:id]
    profiles = get_profiles owner, params[:id]
    halt erb :outsider, :locals => {:profiles => profiles.to_json} if !session[:identity]
    halt erb :visitor, :locals => {:profiles => profiles.to_json} if owner != session[:identity]
    erb :profile, :locals => {:profiles => profiles.to_json} if owner == session[:identity]
  end

  post '/users/create_production' do
    scopify profile_id: true
    check_profile_ownership profile_id

    production_id = SecureRandom.uuid
    production = Forms::Productions.new(params, session[:identity]).create(production_id)
    Repos::Profiles.add_production profile_id, production
    success({production: production})
  end

  post '/users/modify_production' do
    scopify production_id: true
    check_production_ownership! production_id

    production = Forms::Productions.new(params, session[:identity]).modify(production_id)
    old_pictures = Services::Profiles.production_old_pictures production_id

    Repos::Profiles.modify_production production
    Services::Profiles.destroy_production_old_pictures old_pictures, production
    
    success({production: production})
  end

  post '/users/delete_production' do
    scopify production_id: true
    check_production_ownership! production_id
    Services::Profiles.delete_production production_id
    success
  end

  post '/users/delete_profile' do
    scopify profile_id: true
    check_profile_ownership profile_id
    Services::Profiles.delete_profile profile_id
    success
  end

  post '/users/list_profiles'do
    profiles = Repos::Profiles.get_profiles :visit_profiles, {user_id: session[:identity]}
    success({profiles: profiles})
  end

  private
  def check_production_ownership! production_id
    raise Pard::Invalid::UnexistingProduction unless Repos::Profiles.production_exists? production_id
    raise Pard::Invalid::ProductionOwnership unless Repos::Profiles.get_production_owner(production_id) == session[:identity]
  end

  def get_profiles owner, profile_id
    method = :visit_profiles
    method = :user_profiles if owner == session[:identity]
    Repos::Profiles.get_profiles method, {user_id: owner, profile_id: profile_id, requester: session[:identity]}
  end

  def name_available? name
    raise Pard::Invalid::ExistingName unless Repos::Profiles.name_available?(session[:identity], name)
  end
end

 #kit = IMGKit.new('https://www.pinterest.com/pinterest/',{width: 1366, height: 768})
    
    #image = kit.to_img
    #file = kit.to_file('thumbnail.jpg')
    #Cloudinary::Uploader.upload(File.open('thumbnail.jpg'), width: 200, height: 200, crop: 'scale')
    #File.delete('thumbnail.jpg')
