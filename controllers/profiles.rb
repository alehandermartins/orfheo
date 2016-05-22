class ProfilesController < BaseController

  post '/users/create_profile' do
    scopify type: true
    check_type type
    profile = create_model params, Forms.create(type)
    profile_id = SecureRandom.uuid

    profile.merge! user_id: session[:identity]
    profile.merge! profile_id: profile_id
    profile.merge! type: type

    Repos::Profiles.update profile
    success({profile_id: profile_id})
  end

   post '/users/modify_profile' do
    scopify type: true, profile_id: true
    check_type type
    check_profile_ownership profile_id

    profile = create_model params, Forms.modify(type)
    old_pictures = profile_old_pictures profile_id

    profile.merge! user_id: session[:identity]
    profile.merge! profile_id: profile_id
    profile.merge! type: type
    
    Repos::Profiles.update profile.to_h
    Util.destroy_old_pictures old_pictures, profile
    success({profile_id: profile_id})
  end

  get '/profile' do
    halt erb(:not_found) unless profile_exists? params[:id]
    owner = get_profile_owner params[:id]
    profiles = get_profiles owner, params[:id]
    halt erb :outsider, :locals => {:profiles => profiles.to_json} if !session[:identity]
    halt erb :visitor, :locals => {:profiles => profiles.to_json} if owner != session[:identity]
    erb :profile, :locals => {:profiles => profiles.to_json} if owner == session[:identity]
  end

  post '/users/create_production' do
    scopify profile_id: true, category: true
    check_category category
    check_profile_ownership profile_id

    production = create_model params, Forms.create(category)
    production_id = SecureRandom.uuid

    production.merge! user_id: session[:identity]
    production.merge! production_id: production_id
    production.merge! category: category

    Repos::Profiles.add_production profile_id, production
    success({profile_id: profile_id})
  end

  post '/users/modify_production' do
    check_production_ownership params[:production_id]
    production = modify_production params
    success({production: production})
  end

  post '/users/delete_production' do
    check_production_ownership params[:production_id]
    delete_production params[:production_id]
    success
  end

  post '/users/delete_profile' do
    check_profile_ownership params[:profile_id]
    delete_profile params[:profile_id]
    success
  end

  #poner bangs en excepciones
  private
  def profile_old_pictures profile_id
    profile = Repos::Profiles.get_profiles :profile, {profile_id: profile_id}
    [:profile_picture, :photos].map{ |field|
      [field, profile[field]]
    }.to_h
  end


  def check_type type
    raise Pard::Invalid::Type unless ['artist', 'space'].include? type
  end

  def create_profile params
    Services::Profiles.create params, session[:identity]
  end

  def modify_profile params
    Services::Profiles.modify params, session[:identity]
  end

  def check_production_ownership production_id
    raise Pard::Invalid::UnexistingProduction unless production_exists? production_id
    raise Pard::Invalid::ProductionOwnership unless get_production_owner(production_id) == session[:identity]
  end

  def modify_production params
    Services::Profiles.modify_production params, session[:identity]
  end

  def production_exists? production_id
    Services::Profiles.production_exists? production_id
  end

  def get_profiles owner, profile_id
    method = :visit_profiles
    method = :user_profiles if owner == session[:identity]
    Services::Profiles.get_profiles method, {user_id: owner, profile_id: profile_id}
  end

  def get_production_owner production_id
    Services::Profiles.get_production_owner production_id
  end

  def delete_production production_id
    Services::Profiles.delete_production production_id
  end

  def delete_profile profile_id
    Services::Profiles.delete_profile profile_id
  end
end

 #kit = IMGKit.new('https://www.pinterest.com/pinterest/',{width: 1366, height: 768})
    
    #image = kit.to_img
    #file = kit.to_file('thumbnail.jpg')
    #Cloudinary::Uploader.upload(File.open('thumbnail.jpg'), width: 200, height: 200, crop: 'scale')
    #File.delete('thumbnail.jpg')
