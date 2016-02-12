describe ProfilesController do

  before(:each){
    @login_route = '/login/login_attempt'
    @create_profile_route = '/users/create_profile'
    @user_id = 'email@test.com'

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

    it 'redirects user to not found page if profile does not exist' do
      get '/users/profiles/artist_name'
      expect(last_response.body).to include('Not Found')
    end

    it 'redirects user to profile page otherwise' do
      Services::Profiles.create @profile_params, @user_id

      get '/users/profiles/' + @profile_params[:profile_id]
      expect(last_response.body).to include('"type":"artist","name":"artist_name')
    end
  end

  describe 'Modify' do

    before(:each){
      @modify_route = '/users/modify_profile'

      Services::Profiles.create @profile_params, 'email@test.com'

      @modified_params = {
        profile_id: @profile_params[:profile_id],
        type: 'artist',
        name: 'otter_artist_name',
        city: 'otter_city',
        zip_code: 'zip_code',
        profile_picture: 'picture.jpg',
        bio: 'bio',
        personal_web: 'my_web'
      }
    }


    it 'fails if the profile does not exist' do
      @modified_params[:profile_id] = 'otter'
      post @modify_route, @modified_params

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('unexisting_profile')
    end

    it 'fails if the values are not correct' do
      @modified_params[:name] = ''
      post @modify_route, @modified_params

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_value')
    end

    it 'modifies the desired parameters' do
      post @modify_route, @modified_params

      expect(Repos::Profiles.grab({user_id: @user_id}).first[:name]).to eq('otter_artist_name')
      expect(Repos::Profiles.grab({user_id: @user_id}).first[:city]).to eq('otter_city')
      expect(parsed_response['status']).to eq('success')
    end
  end
end
