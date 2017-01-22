class ProfilesController < BaseController

  post '/users/check_name' do
    scopify name: true
    status = Repos::Profiles.name_available?(session[:identity], name)
    success({available: status})
  end

  post '/users/create_profile' do
    scopify type: true, name: true
    check_type! type
    name_available? name

    profile = ArtistProfile.new(params, session[:identity]) if type == 'artist'
    profile = SpaceProfile.new(params, session[:identity]) if type == 'space'
    profile = OrganizationProfile.new(params, session[:identity]) if type == 'organization'

    Repos::Profiles.update profile.to_h
    success({profile: profile.to_h})
  end

   post '/users/modify_profile' do
    scopify profile_id: true, type: true, name: true
    check_type! type
    check_profile_ownership profile_id
    name_available? name

    profile = ArtistProfile.new(params, session[:identity]) if type == 'artist'
    profile = SpaceProfile.new(params, session[:identity]) if type == 'space'
    profile = OrganizationProfile.new(params, session[:identity]) if type == 'organization'
    old_pictures = Services::Profiles.profile_old_pictures profile_id
    Repos::Profiles.update profile.to_h
    Services::Profiles.destroy_old_pictures old_pictures, profile.to_h

    Repos::Events.update_artist profile.to_h if type == 'artist'
    Repos::Events.update_space profile.to_h if type == 'space'
    
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
    scopify profile_id: true, category: true
    check_profile_ownership profile_id
    check_artist_category! category

    production = Production.new(params, session[:identity])
    Repos::Profiles.add_production profile_id, production.to_h
    success({production: production.to_h})
  end

  post '/users/modify_production' do
    scopify production_id: true, category: true
    check_production_ownership! production_id
    check_artist_category! category

    production = Production.new(params, session[:identity])
    old_pictures = Services::Profiles.production_old_pictures production_id
    Repos::Profiles.modify_production production.to_h
    Services::Profiles.destroy_old_pictures old_pictures, production
    
    success({production: production.to_h})
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
    profiles = Repos::Profiles.get_profiles :user_profiles, {user_id: session[:identity]}
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
