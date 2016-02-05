class UsersController < BaseController

  post '/register_attempt' do
    check_params params['email'], params['password']
    fail! if user_exists? params['email']
    register_user params['email'], params['password']
    success
  end

  post '/login' do
    fail! unless user_exists? params['email']
    fail! unless validated? params['email']
    fail! unless correct_password? params['email'], params['password']
    success
  end

  get '/validation/:uuid' do
    redirect to 'localhost:3000' unless check_validation_code params['uuid']
    validate_user params['uuid']
    redirect to  'localhost:3000/users'
  end

  get '/' do
    erb :users
  end


  private
  def check_params email, password
    check_invalid_email email, 'invalid_email'
    check_invalid_password password, 'invalid_password'
  end

  def check_invalid_email email, message
    raise Pard::Invalid.new message if invalid_email? email
  end

  def check_invalid_password password, message
    raise Pard::Invalid.new message if invalid_password? password
  end

  def invalid_email? email
    (email =~ /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i).nil?
  end

  def invalid_password? password
    password.nil? || password.empty? || password.size < 8
  end

  def user_exists? email
    Services::Users.exists? email
  end

  def register_user email, password
    user = {
      email: email,
      password: password,
    }
    Services::Users.register user
  end

  def check_validation_code code
    Services::Users.check_validation_code code
  end

  def validate_user code
    Services::Users.validate_user code
  end

  def validated? email
    Services::Users.validated? email
  end

  def correct_password? email, password
    Services::Users.correct_password? email, password
  end
end
