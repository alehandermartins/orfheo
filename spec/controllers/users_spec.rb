describe UsersController do

  before(:each){
    @login_route = '/login/login_attempt'

    @user_hash = {
      email: 'email@test.com',
      password: 'password'
    }

    Services::Users.register @user_hash
    Services::Users.validated_user @user_hash[:validation_code]
  }

  describe 'Access' do

    before(:each){
      @users_route = '/users/'
    }

    it 'redirects the user to the welcome page if not logged in' do
      get @users_route
      expect(last_response.body).to include('Pard.Welcome()')
    end

    it 'redirects the user to the users page if logged in' do
      post @login_route, @user_hash
      get @users_route
      expect(last_response.body).to include('Pard.Users()')
    end
  end

  describe 'Modify password' do

    before(:each){
      @modify_password_route = '/users/modify_password'
      post @login_route, @user_hash
    }

    it 'fails if the password is not valid' do
      post @modify_password_route, {password: 'miau'}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_password')
    end

    it 'changes the old password for the new one' do
      post @modify_password_route, {password: 'new_password'}
      expect(Repos::Users.grab({email: 'email@test.com'})[:password]).to eq('new_password')
      expect(parsed_response['status']).to eq('success')
    end
  end
end
