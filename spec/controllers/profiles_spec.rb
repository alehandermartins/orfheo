describe ProfilesController do

  before(:each){
    @login_route = '/login/login_attempt'
    @create_profile_route = '/users/create_profile'

    @user_hash = {
      email: 'email@test.com',
      password: 'password'
    }

   @profile_params = {
      type: 'artist',
      name: 'artist_name',
      city: 'city',
      zip_code: 'zip_code'
    }

    Services::Users.register @user_hash
    Services::Users.validated_user @user_hash[:validation_code]
    post @login_route, @user_hash
  }

  describe 'Create' do

    it 'fails if the type does not exist' do
      post @create_profile_route, {}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_type')
    end

    it 'fails if the type does not do not correspond with expected types' do
      post @create_profile_route, {
        type: 'otter',
        name: 'otter_name,',
        zip_code: 'otter_zip'
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_type')
    end

    it 'fails when one of the field values is empty' do
      post @create_profile_route, {
        type: 'artist',
        name: nil,
        city: 'city',
        zip_code: 'otter_zip'
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_value')
    end

    it 'creates the profile otherwise' do
      post @create_profile_route, @profile_params
      expect(Repos::Profiles.exists?({user_id:'email@test.com'})).to eq(true)
      expect(parsed_response['status']).to eq('success')
      expect(UUID.validate parsed_response['profile_id']).to eq(true)
    end

    it 'fails if the profile already exists for that user' do
      post @create_profile_route, @profile_params
      post @create_profile_route, @profile_params
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('existing_profile')
    end
  end

  describe 'Access' do

    it 'redirects user to user page if profile does not exist' do
      get '/users/profiles/artist_name'
      expect(last_response.body).to include('Pard.Users()')
    end

    it 'redirects user to profile page otherwise' do
      Services::Profiles.create @profile_params, 'email@test.com'

      get '/users/profiles/' + @profile_params[:profile_id]
      expect(last_response.body).to include('Pard.Profile()')
    end
  end

  describe 'Get Profiles' do

    before(:each){
      @get_profiles_route = '/users/profiles/get_profiles'

      @otter_params = {
        type: 'artist',
        name: 'otter_name',
        city: 'city',
        zip_code: 'zip_code'
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

    it 'returns and empty array if no profiles for a given user' do
      post @get_profiles_route
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['profiles']).to eq([])
    end

    it 'returns all the profiles for a given user' do
      post @create_profile_route, @profile_params
      post @create_profile_route, @space_params
      post @get_profiles_route

      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['profiles'][0]).to include({
        'type' => 'artist',
        'name' => 'artist_name',
        'city' => 'city',
        'zip_code' => 'zip_code'
      })
      expect(parsed_response['profiles'][1]).to include({
        'type' => 'space',
        'name' => 'space_name',
        'city' => 'city',
        'address' => 'address',
        'zip_code' => 'zip_code',
        'category' => 'home'
      })

    end

    xit 'returns the specified profile' do
      Services::Profiles.create @profile_params, 'email@test.com'
      Services::Profiles.create @space_params, 'email@test.com'

      post '/users/profile/get_profile', {
        uuid: @space_params[:profile_id]
      }
      expect(parsed_response)
    end
  end
end
