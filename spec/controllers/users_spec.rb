describe UsersController do

  before(:each){
    @login_route = '/login/login_attempt'
    @update_profile_route = '/users/update_profile'

    @user_hash = {
      email: 'email@test.com',
      password: 'password'
    }

    Services::Users.register @user_hash
    Services::Users.validated_user @user_hash[:validation_code]
  }

  xdescribe 'Access' do

    before(:each){
      @users_route = '/users/'
      @user_id = 'email@test.com'
      @profile_id = 'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'

      @profile_params = {
        user_id: @user_id,
        profile_id: @profile_id,
        type: 'artist',
        name: 'artist_name',
        city: 'city',
        zip_code: 'zip_code',
        profile_picture: 'picture.jpg',
        bio: 'bio',
        personal_web: 'my_web'
     }

      @space_params = {
        type: 'space',
        name: 'space_name',
        city: 'city',
        address: 'address',
        zip_code: 'zip_code',
        category: 'home'
      }
    }

    it 'redirects the user to the welcome page if not logged in' do
      get @users_route
      expect(last_response.body).to include('Pard.Welcome()')
    end

    it 'redirects the user to the users page if logged in' do
      post @login_route, @user_hash
      get @users_route
      expect(last_response.body).to include('Pard.Users([])')
    end

    it 'returns all the profiles for a given user' do
      post @login_route, @user_hash
      post @update_profile_route, @profile_params

      get @users_route

      expect(last_response.body).to include('"type":"artist","name":"artist_name')
      expect(last_response.body).to include('"type":"space","name":"space_name"')
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
