class ProfilesController < UsersController

  post '/users/create_profile' do
    check_type params['type']
    is_possible? params, session[:identity]
    create_profile params, session[:identity]
    success({name: params['name']})
  end

  get '/users/profiles/:name' do
    puts params[:name]
    puts exists? params[:name]
    puts session[:identity]
    halt erb(:users) unless exists? params[:name]
    erb(:profile)
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

  def exists? name
    Services::Profiles.exists? name, session[:identity]
  end
end
