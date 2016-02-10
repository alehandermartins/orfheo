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
        zip_code: 'otter_zip'
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_value')
    end

    it 'creates the profile otherwise' do
      post @create_profile_route, @profile_params
      expect(Repos::Profiles.exists?({user_id:'email@test.com'})).to eq(true)
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['name']).to eq('artist_name')
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
      post @create_profile_route, @profile_params
      get '/users/profiles/artist_name'
      expect(last_response.body).to include('Pard.Profile()')
    end
  end
end
