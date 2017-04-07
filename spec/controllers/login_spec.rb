describe LoginController do

  let(:register_route){'/login/register'}
  let(:login_route){'/login/login'}
  let(:user_hash){
    {
      email: 'email@test.com',
      password: 'password',
      lang: 'es'
    }
  }

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:validation_code){'3c61cf77-32b0-4df2-9376-0960e64a654a'}
  let(:event_id){'a5bc4203-9379-4de0-856a-55e1e5f3fac6'}

  let(:user){
    {
      user_id: user_id,
      email: 'email@test.com',
      password: 'password',
      lang: 'es',
      validation: false,
      validation_code: validation_code
    }
  }

  describe 'Registration attempt' do

    it 'cannot register a user with no email' do
      post register_route, {
        email: nil,
        password: 'password'
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_email')
    end

    it 'cannot register a user with no valid email' do
      post register_route, {
        email: 'invalid',
        password: 'password'
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_email')
    end

    it 'cannot register a user with no password' do
      post register_route, {
        email: 'email@test.com',
        password: nil
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_password')
    end

    it 'cannot register a user with a password less than 8 characters' do
      post register_route, {
        email: 'email@test.com',
        password: 'pass'
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_password')
    end

    it 'registers an unactivated user' do
      expect(Services::Users).to receive(:register).with(Util.stringify_hash(user_hash))
      post register_route, user_hash
      expect(parsed_response['status']).to eq('success')
    end

    it 'delivers a welcome mail to the user' do
      expect(Services::Mails).to receive(:deliver_mail_to).with(hash_including(user_hash), :welcome)

      post register_route, user_hash
      expect(parsed_response['status']).to eq('success')
    end

    it 'cannot register a user twice' do
      post register_route, user_hash
      post register_route, user_hash
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('already_registered')
    end
  end

  describe 'Validation' do

    let(:validation_route){'/login/validate?id=' + validation_code}

    before(:each){
      Repos::Users.add user
    }

    it 'redirects to registration if the validation code does not exist' do
      get '/login/validate?id=otter'

      expect(last_response.location).to eq('http://example.org/')
    end

    it 'validates the user' do
      expect(Services::Users).to receive(:validated_user).with(validation_code)
      get validation_route
    end

    it 'stores the user identity and redirects to users' do
      get validation_route

      expect(session[:identity]).to eq(user_id)
      expect(last_response.location).to eq('http://www.orfheo.org/users/')
    end

    it 'redirects to event page if event_id is provided' do
      allow(Repos::Events).to receive(:exists?).with(event_id).and_return(true)
      get '/login/validate?id=' + validation_code + '&event_id=' + event_id

      expect(last_response.location).to eq('http://www.orfheo.org/event?id=' + event_id)
    end
  end

  describe 'LogIn' do

    it 'fails if the email is not valid' do
      post login_route, {
        email: 'email',
        password: 'password'
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_email')
    end

    it 'fails if the password is not valid' do
      post login_route, {
        email: 'email@test.com',
        password: 'miau'
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_password')
    end

    it 'fails if the user does not exist' do
      post login_route, user_hash
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_user')
    end

    it 'fails if the user is not validated' do
      Repos::Users.add user
      post login_route, user_hash

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('not_validated_user')
    end

    it 'fails if the user and the password do not match' do
      Repos::Users.add user
      Services::Users.validated_user validation_code
      post login_route, {
        email: 'email@test.com',
        password: 'otter_password'
      }

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('incorrect_password')
    end

    it 'it is successful and stores the user identity' do
      Repos::Users.add user
      Services::Users.validated_user validation_code
      post login_route, user_hash

      expect(session[:identity]).to eq(user_id)
      expect(parsed_response['status']).to eq('success')
    end
  end

  describe 'Logout' do

    let(:logout_route){'/login/logout'}

    it 'ends the session' do
      Repos::Users.add user
      Services::Users.validated_user validation_code
      post login_route, user_hash
      post logout_route
      expect(session[:identity]).to eq(nil)
      expect(parsed_response['status']).to eq('success')
    end
  end

  describe 'Forgotten password' do

    let(:forgotten_password_route){'/login/forgotten_password'}

    it 'fails if the email is not valid' do
      post forgotten_password_route, {email:'email@testcom'}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_email')
    end

    it 'fails if the email does not exist' do
      post forgotten_password_route, {email:'email@test.com'}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_user')
    end

    it 'generates a new validation_code for the user' do
      Repos::Users.add user
      expect(Services::Users).to receive(:forgotten_password).with('email@test.com').and_return(user_id)
      post forgotten_password_route, {email:'email@test.com'}
      expect(parsed_response['status']).to eq('success')
    end

    it 'delivers a password mail to the user' do
      Repos::Users.add user
      Services::Users.validated_user validation_code

      expect(Services::Mails).to receive(:deliver_mail_to).with(hash_including(user_hash), :forgotten_password)

      post forgotten_password_route, {email:'email@test.com'}
      expect(parsed_response['status']).to eq('success')
    end
  end
end
