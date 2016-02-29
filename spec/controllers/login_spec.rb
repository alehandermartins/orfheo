describe LoginController do

  before(:each){
    @register_route = '/login/register_attempt'
    @login_route = '/login/login_attempt'

    @user_hash = {
      email: 'email@test.com',
      password: 'password'
    }
    @user = User.new @user_hash
  }

  describe 'Registration attempt' do

    it 'cannot register a user with no email' do
      post @register_route, {
        email: nil,
        password: 'password'
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_email')
    end

    it 'cannot register a user with no valid email' do
      post @register_route, {
        email: 'invalid',
        password: 'password'
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_email')
    end

    it 'cannot register a user with no password' do
      post @register_route, {
        email: 'email@test.com',
        password: nil
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_password')
    end

    it 'cannot register a user with a password less than 8 characters' do
      post @register_route, {
        email: 'email@test.com',
        password: 'pass'
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_password')
    end

    it 'registers an unactivated user' do
      post @register_route, @user_hash

      expect(Repos::Users.exists?({email:'email@test.com'})).to eq(true)
      expect(parsed_response['status']).to eq('success')
    end

    it 'delivers a welcome mail to the user' do
      expect(Services::Mails).to receive(:deliver_mail_to).with(hash_including(@user_hash), :welcome)

      post @register_route, @user_hash
      expect(parsed_response['status']).to eq('success')
    end

    it 'cannot register a user twice' do
      post @register_route, @user_hash
      post @register_route, @user_hash
      expect(parsed_response['status']).to eq('fail')
    end
  end

  describe 'Validation' do

    before(:each){
      Repos::Users.add @user.to_h
    }

    it 'redirects to registration if the validation code does not exist' do
      validation_route = '/login/validate/otter'
      get validation_route

      expect(last_response.body).to include('Pard.Welcome()')
    end

    it 'validates the user' do
      validation_route = '/login/validate/' + @user[:validation_code]
      get validation_route

      expect(Repos::Users.grab({user_id: @user[:user_id]})[:validation]).to eq(true)
    end

    it 'stores the user identity and redirects to users' do
      validation_route = '/login/validate/' + @user[:validation_code]
      get validation_route

      expect(session[:identity]).to eq(@user[:user_id])
      expect(last_response.location).to eq('http://pard.herokuapp.com/users/')
    end
  end

  describe 'LogIn' do

    it 'fails if the email is not valid' do
      post @login_route, {
        email: 'email',
        password: 'password'
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_email')
    end

    it 'fails if the password is not valid' do
      post @login_route, {
        email: 'email@test.com',
        password: 'miau'
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_password')
    end

    it 'fails if the user does not exist' do
      post @login_route, @user_hash
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_user')
    end

    it 'fails if the user is not validated' do
      Repos::Users.add @user.to_h
      post @login_route, @user_hash

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('not_validated_user')
    end

    it 'fails if the user and the password do not match' do
      Repos::Users.add @user.to_h
      Services::Users.validated_user @user[:validation_code]
      post @login_route, {
        email: 'email@test.com',
        password: 'otter_password'
      }

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('incorrect_password')
    end

    it 'it is successful and stores the user identity' do
      Repos::Users.add @user.to_h
      Services::Users.validated_user @user[:validation_code]
      post @login_route, @user_hash

      expect(session[:identity]).to eq(@user[:user_id])
      expect(parsed_response['status']).to eq('success')
    end
  end

  describe 'Logout' do

    before(:each){
      @logout_route = '/login/logout'
    }

    it 'ends the session' do
      Repos::Users.add @user.to_h
      Services::Users.validated_user @user[:validation_code]
      post @login_route, @user_hash
      post @logout_route
      expect(session[:identity]).to eq(nil)
      expect(parsed_response['status']).to eq('success')
    end
  end

  describe 'Forgotten password' do

    before(:each){
      @forgotten_password_route = '/login/forgotten_password'
    }

    it 'fails if the email is not valid' do
      post @forgotten_password_route, {email:'email@testcom'}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_email')
    end

    it 'fails if the email does not exist' do
      post @forgotten_password_route, {email:'email@test.com'}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_user')
    end

    it 'generates a new validation_code for the user' do
      Repos::Users.add @user.to_h
      Services::Users.validated_user @user[:validation_code]
      post @forgotten_password_route, {email:'email@test.com'}

      user = Repos::Users.grab({email: 'email@test.com'})
      expect(UUID.validate user[:validation_code]).to eq(true)
      expect(user[:validation_code]).not_to eq(@user_hash[:validation_code])
    end

    it 'delivers a password mail to the user' do
      Repos::Users.add @user.to_h
      Services::Users.validated_user @user[:validation_code]

      expect(Services::Mails).to receive(:deliver_mail_to).with(hash_including(@user_hash), :forgotten_password)

      post @forgotten_password_route, {email:'email@test.com'}
      expect(parsed_response['status']).to eq('success')
    end
  end
end
