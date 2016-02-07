class ProfilesController < BaseController

  post '/profiles/create' do
    check_logged_in
    check_params params
    create_profile params, session[:identity]
    success
  end

  private
  def check_logged_in
    raise Pard::Invalid.new 'not_logged_in' unless session[:identity]
  end

  def check_params params
    raise Pard::Invalid.new 'invalid_fields' unless correct_params? params
  end

  def correct_params? params
    correct_keys?(params) && correct_type?(params['type'])
  end

  def correct_keys? params
    params.keys == ['type', 'name', 'location']
  end

  def correct_type? type
    ['artist', 'space'].include? type
  end

  def create_profile params, user_id
    Services::Profiles.create params, user_id
  end
end
