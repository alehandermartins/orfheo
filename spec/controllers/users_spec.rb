describe UsersController do

  let(:login_route){'/login/login_attempt'}
  let(:create_profile_route){'/users/create_profile'}
  let(:delete_user_route){'/users/delete_user'}

  let(:user_hash){
    {
      email: 'email@test.com',
      password: 'password'
    }
  }

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:validation_code){'3c61cf77-32b0-4df2-9376-0960e64a654a'}

  let(:user){
    {
      user_id: user_id,
      email: 'email@test.com',
      password: 'password',
      validation: false,
      validation_code: validation_code
    }
  }

  before(:each){
    Repos::Users.add user
    Services::Users.validated_user validation_code
  }

  describe 'Access' do

    let(:users_route){'/users/'}
    let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}

    let(:profile){
      {
        profile_id: profile_id,
        user_id: user_id,
        type: 'artist',
        name: 'artist_name',
        city: 'city',
        zip_code: 'zip_code',
        profile_picture: ['profile.jpg'],
        bio: 'bio',
        personal_web: 'my_web'
      }
    }

    let(:space_profile){
      {
        type: 'space',
        name: 'space_name',
        city: 'city',
        address: 'address',
        zip_code: 'zip_code',
        category: 'home'
      }
    }

    it 'redirects the user to the welcome page if not logged in' do
      get users_route
      expect(last_response.location).to eq('http://example.org/')
    end

    it 'gets the profiles of the user and other profiles' do
      post login_route, user_hash
      expect(Repos::Profiles).to receive(:get_user_profiles).with(user_id)
      get users_route
    end

    it 'redirects to user page' do
      post login_route, user_hash
      post create_profile_route, profile
      post create_profile_route, space_profile

      get users_route

      expect(last_response.body).to include('Pard.Users')
    end
  end

  describe 'Modify password' do

    let(:modify_password_route){'/users/modify_password'}

    before(:each){
      post login_route, user_hash
    }

    it 'fails if the password is not valid' do
      post modify_password_route, {password: 'miau'}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_password')
    end

    it 'changes the old password for the new one' do
      expect(Services::Users).to receive(:modify_password).with(user_id, 'new_password')
      post modify_password_route, {password: 'new_password'}
      expect(parsed_response['status']).to eq('success')
    end
  end

  describe 'Delete' do
    it 'deletes a user and terminates the session' do
      post login_route, user_hash
      post delete_user_route
      expect(session[:identity]).to eq(nil)
      expect(parsed_response['status']).to eq('success')
      post login_route, user_hash
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_user')
    end
  end
end
