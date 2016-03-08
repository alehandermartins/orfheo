describe ProfilesController do

  before(:each){
    @login_route = '/login/login_attempt'
    @update_profile_route = '/users/create_profile'
    @modify_profile_route = '/users/modify_profile'
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
      profile_picture: ['picture.jpg'],
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
  }

  describe 'Create' do

    it 'fails if the type does not exist' do
      post @update_profile_route, {}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_type')
    end

    it 'fails if the type does not do not correspond with expected types' do
      post @update_profile_route, {
        type: 'otter',
        name: 'otter_name,',
        zip_code: 'otter_zip'
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_type')
    end

    it 'fails when one of the fundamental values is empty' do
      post @update_profile_route, {
        type: 'artist',
        name: nil,
        city: 'city',
        zip_code: 'otter_zip'
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_parameters')
    end

    it 'creates a profile' do
      post @update_profile_route, @profile_params
      expect(Repos::Profiles.exists?({profile_id: @profile_id})).to eq(true)
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['profile_id']).to eq(@profile_id)
    end

    it 'fails if a profile with the same name already exists for that user' do
      post @update_profile_route, @profile_params
      @profile_params[:profile_id] = 'otter_profil_id'
      post @update_profile_route, @profile_params

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('existing_profile')
    end
  end

  describe 'Modify' do

    it 'modifies the desired parameters' do
      post @update_profile_route, @profile_params
      @profile_params[:name] = 'otter_name'

      cloudinary_params = {
        type: 'upload',
        prefix: @user[:user_id] + '/' + @profile_id + '/profile_picture'
      }

      allow(Cloudinary::Api).to receive(:resources).with(cloudinary_params).and_return({'resources' => [{'public_id' => 'picture.jpg'}]})
      post @modify_profile_route, @profile_params

      expect(Repos::Profiles.grab({profile_id: @profile_id}).first[:name]).to eq('otter_name')
      expect(parsed_response['status']).to eq('success')
    end
  end

  describe 'Proposals' do

    before(:each){
      post @update_profile_route, @profile_params
      @create_proposal_route = '/users/create_proposal'
      @modify_proposal_route = '/users/modify_proposal'
    }

    it 'fails if the profile_id does not exist' do
      @proposal_params[:profile_id] = ''
      post @create_proposal_route, @proposal_params
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_profile')
    end

    it 'adds a proposal to the profile' do
      post @create_proposal_route, @proposal_params
      expect(Repos::Profiles.grab({profile_id: @profile_id}).first[:proposals].first).to include(proposal_id: @proposal_id)
    end

    xit 'modifies a proposal' do
      @proposal_params['title'] = 'otter_title'
      post @modify_proposal_route, @proposal_params
      expect(Repos::Profiles.grab({profile_id: @profile_id}).first[:proposals].first).to include(title: 'otter_title')
    end
  end

  describe 'Access' do

    it 'redirects user to not found page if profile does not exist' do
      get '/users/profiles/artist_name'
      expect(last_response.body).to include('Not Found')
    end

    it 'redirects user to profile page otherwise' do
      post @update_profile_route, @profile_params
      post '/users/create_call', {}
      post '/users/send_proposal', @proposal_params

      get '/users/profiles/' + @profile_id

      expect(last_response.body).to include('"type":"artist","name":"artist_name"')
      expect(last_response.body).to include('"call_id"')
    end
  end
end
