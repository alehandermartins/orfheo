describe ProfilesController do

  before(:each){
    @login_route = '/login/login_attempt'

    @user_hash = {
      email: 'email@test.com',
      password: 'password'
    }

    Services::Users.register @user_hash
    Services::Users.validated_user @user_hash[:validation_code]
  }

  describe 'Create' do

    before(:each){
      @create_profile_route = '/profiles/create'

      @profile_params = {
        type: 'artist',
        name: 'artist_name',
        location: 'location'
      }
    }

    it 'fails if the user is not logged in' do
      post @create_profile_route, @profile_params
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('not_logged_in')
    end

    it 'fails if the fields do not correspond with expected fields' do
      post @login_route, @user_hash
      post @create_profile_route, {}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_fields')
    end

    it 'fails if the type does not do not correspond with expected types' do
      post @login_route, @user_hash
      post @create_profile_route, {
        type: 'otter',
        name: 'otter_name,',
        location: 'otter_location'
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_fields')
    end

    it 'is creates the profile otherwise' do
      post @login_route, @user_hash
      post @create_profile_route, @profile_params
      expect(Repos::Profiles.exists?({user_id:'email@test.com'})).to eq(true)
      expect(parsed_response['status']).to eq('success')
    end
  end
end
