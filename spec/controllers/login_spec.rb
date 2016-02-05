describe LoginController do

  describe 'Registration attempt' do

    before(:each){
      @register_route = '/login/register_attempt'

      @user_hash = {
        email: 'email@test.com',
        password: 'password'
      }
    }

    it 'cannot register a user with no email' do
      post @register_route, {
        email: nil,
        password: 'password'
      }
      expect(parsed_response['status']).to eq('fail')
    end

    it 'cannot register a user with no valid email' do
      post @register_route, {
        email: 'invalid',
        password: 'password'
      }
      expect(parsed_response['status']).to eq('fail')
    end

    it 'cannot register a user with no password' do
      post @register_route, {
        email: 'email',
        password: nil
      }
      expect(parsed_response['status']).to eq('fail')
    end

    it 'cannot register a user with a password less than 8 characters' do
      post @register_route, {
        email: 'email',
        password: 'pass'
      }
      expect(parsed_response['status']).to eq('fail')
    end

    it 'registers an unactivated user' do
      post @register_route, @user_hash

      expect(Repos::Users.exists?({email:'email@test.com'})).to eq(true)
      expect(parsed_response['status']).to eq('success')
    end

    it 'cannot register a user twice' do
      post @register_route, @user_hash
      post @register_route, @user_hash
      expect(parsed_response['status']).to eq('fail')
    end
  end

  describe 'Validation' do

    let(:welcome_view){double 'Welcome View'}
    before(:each){
      @register_route = '/users/register_attempt'
      @validation_route = '/login/validation/3c61cf77-32b0-4df2-9376-0960e64a654a'

      @user_hash = {
        email: 'email@test.com',
        password: 'password'
      }
    }

    xit 'redirects to registration if the validation code does not exist' do
      validation_route = '/login/validation/otter'
      get validation_route

      expect(last_response).to eq('welcome')
    end

    it 'validates the user' do
      Services::Users.register @user_hash
      validation_code = @user_hash[:validation_code]
      validation_route = '/login/validation/' + validation_code
      get validation_route

      expect(Services::Users.validated? 'email@test.com').to eq(true)
    end

    it 'stores the user identity and redirects to users' do
      Services::Users.register @user_hash
      validation_code = @user_hash[:validation_code]
      validation_route = '/login/validation/' + validation_code
      get validation_route

      expect(session[:identity]).to eq('email@test.com')
      expect(last_response.location).to eq('localhost:3000/users/place')
    end
  end

  describe 'LogIn' do
    before(:each){

      @login_route = '/login/login_attempt'

      @user_hash = {
        email: 'email@test.com',
        password: 'password'
      }
    }

    it 'fails if the user does not exist' do
      post @login_route, @user_hash
      expect(parsed_response['status']).to eq('fail')
    end

    it 'fails if the user is not validated' do
      Services::Users.register @user_hash
      post @login_route, @user_hash

      expect(parsed_response['status']).to eq('fail')
    end

    it 'fails if the user and the password do not match' do
      Services::Users.register @user_hash
      validation_code = @user_hash[:validation_code]
      Services::Users.validated_user validation_code
      post @login_route, {
        email: 'email@test.com',
        password: 'otter_password'
      }

      expect(parsed_response['status']).to eq('fail')
    end

    it 'it is successful and stores the user identity' do
      Services::Users.register @user_hash
      validation_code = @user_hash[:validation_code]
      Services::Users.validated_user validation_code
      post @login_route, @user_hash

      expect(session[:identity]).to eq('email@test.com')
      expect(parsed_response['status']).to eq('success')
    end
  end
end
