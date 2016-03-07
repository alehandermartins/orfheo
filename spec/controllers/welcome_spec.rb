describe WelcomeController do

  before(:each){
    @login_route = '/login/login_attempt'
    @update_profile_route = '/users/create_profile'
    @create_call_route = '/users/create_call'
    @send_proposal_route = '/users/send_proposal'
    @logout_route = '/login/logout'
    @profile_id = 'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'
    @proposal_id = 'b11000e7-8f02-4542-a1c9-7f7aa18752ce'
    @call_id = 'b5bc4203-9379-4de0-856a-55e1e5f3fac6'

    @user_hash = {
      email: 'email@test.com',
      password: 'password'
    }

    @user = User.new @user_hash

    @profile_params = {
      user_id: @user[:user_id],
      profile_id: @profile_id,
      type: 'artist',
      name: 'artist_name',
      city: 'city',
      zip_code: 'zip_code',
      profile_picture: 'picture.jpg',
      bio: 'bio',
      personal_web: 'my_web'
    }

    @proposal_params = {
      profile_id: @profile_id,
      proposal_id: @proposal_id,
      call_id: @call_id,
      type: 'artist',
      category: 'music',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      phone: '666999666',
      conditions: true,
      duration: '15',
      availability: 'sun',
      components: 3,
      repeat: true
    }

    Repos::Users.add @user.to_h
    Services::Users.validated_user @user[:validation_code]
    post @login_route, @user_hash
    post @update_profile_route, @profile_params
    post @create_call_route, {}
    post @logout_route
  }

  describe 'Access' do
    it 'redirects to users page if already logged in' do
      post @login_route, @user_hash
      get '/'
      expect(last_response.location).to eq('http://example.org/users/')
    end
  end

  describe 'Gets all profiles' do

    it 'returns empty array if no proposals' do
      get '/'
      expect(last_response.body).to include('Pard.Welcome([])')
    end

    it 'returns all profiles with at least one proposal' do
      post @login_route, @user_hash
      post @send_proposal_route, @proposal_params
      post @logout_route
      get '/'
      expect(last_response.body).to include('"type":"artist","name":"artist_name"')
      expect(last_response.body).to include('"title":"title","description":"description"')
    end
  end
end
