class ProfilesController < BaseController

  post '/users/create_profile' do
    check_type params[:type]
    profile_id = create_profile params
    success({profile_id: profile_id})
  end

  post '/users/create_artist' do
    form = {
      'artist' => 'create_artist',
      'space' => 'create_space',
      'organization' => 'create_organization'  
    }
    raise Pard::Invalid::Type unless form.keys.include? params[:type]
    profile = create_model params, Forms.get(form[params[:type]])
    Repos::Profiles.add profile, params[:type], session[:identity]
    success
  end

  post '/users/modify_profile' do
    check_type params[:type]
    check_profile_ownership params[:profile_id]
    profile_id = modify_profile params
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
    check_profile_ownership params[:profile_id]
    add_production params
    success({profile_id: params[:profile_id]})
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

  def add_production params
    Services::Profiles.add_production params, session[:identity]
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
