describe ProfilesController do

  let(:login_route){'/login/login_attempt'}
  let(:create_profile_route){'/users/create_profile'}
  let(:create_proposal_route){'/users/create_proposal'}


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

  let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:proposal_id){'b11000e7-8f02-4542-a1c9-7f7aa18752ce'}

  let(:profile){
    {
      profile_id: profile_id,
      type: 'artist',
      name: 'artist_name',
      city: 'city',
      zip_code: 'zip_code',
      profile_picture: ['profile.jpg'],
      bio: 'bio',
      personal_web: 'my_web'
    }
  }

  let(:proposal){
    {
      profile_id: profile_id,
      proposal_id: proposal_id,
      category: 'categoty',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      photos: ['picture.jpg', 'otter_picture.jpg'],
      links: 'links',
      duration: 'duration',
      children: 'children'
    }
  }

  before(:each){
    Repos::Users.add user
    Services::Users.validated_user validation_code
    post login_route, user_hash
  }

  describe 'Create' do

    it 'fails if the type does not exist' do
      post create_profile_route, {}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_type')
    end

    it 'fails if the type does not do not correspond with expected types' do
      post create_profile_route, {
        type: 'otter',
        name: 'otter_name,',
        zip_code: 'otter_zip'
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_type')
    end

    it 'fails when one of the fundamental values is empty' do
      post create_profile_route, {
        type: 'artist',
        name: nil,
        city: 'city',
        zip_code: 'otter_zip'
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_parameters')
    end

    it 'creates a profile' do
      expect(Services::Profiles).to receive(:create).with(Util.stringify_hash(profile), user_id).and_return(profile_id)
      post create_profile_route, profile
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['profile_id']).to eq(profile_id)
    end

    it 'fails if a profile with the same name already exists for that user' do
      post create_profile_route, profile
      profile[:profile_id] = 'otter_profil_id'
      post create_profile_route, profile

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('existing_profile')
    end
  end

  describe 'Modify' do

    let(:modify_profile_route){'/users/modify_profile'}

    it 'fails if the type does not exist' do
      post modify_profile_route, {}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_type')
    end

    it 'fails if the profile does not exist' do
      post modify_profile_route, profile
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_profile')
    end

    it 'modifies the desired parameters' do
      post create_profile_route, profile
      cloudinary_params = {
        type: 'upload',
        prefix: user_id + '/' + profile_id + '/profile_picture'
      }
      allow(Cloudinary::Api).to receive(:resources).with(cloudinary_params).and_return({'resources' => [{'public_id' => 'picture.jpg'}]})

      expect(Services::Profiles).to receive(:modify).with(Util.stringify_hash(profile), user_id).and_return(profile_id)
      post modify_profile_route, profile
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['profile_id']).to eq(profile_id)
    end
  end

  describe 'Create Proposals' do

    before(:each){
      post create_profile_route, profile
    }

    it 'fails if the profile does not exist' do
      proposal[:profile_id] = ''
      post create_proposal_route, proposal
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_profile')
    end

    it 'creates a proposal' do
      expect(Services::Profiles).to receive(:add_proposal).with(Util.stringify_hash(proposal), user_id)
      post create_proposal_route, proposal
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['profile_id']).to eq(profile_id)
    end
  end


  describe 'Modify Proposals' do

    let(:modify_proposal_route){'/users/modify_proposal'}

    before(:each){
      post create_profile_route, profile
    }

    it 'fails if the proposal does not exist' do
      post modify_proposal_route, proposal
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_proposal')
    end

    it 'modifies a proposal' do
      post create_proposal_route, proposal
      expect(Services::Profiles).to receive(:modify_proposal).with(Util.stringify_hash(proposal), user_id)

      post modify_proposal_route, proposal
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['profile_id']).to eq(profile_id)
    end
  end

  describe 'Access' do

    let(:profiles_route){'/users/profiles/' + profile_id}

    before(:each){
      post create_profile_route, profile
    }

    it 'redirects user to not found page if profile does not exist' do
      get '/users/profiles/artist_name'
      expect(last_response.body).to include('Not Found')
    end

    it 'gets the profiles of the user' do
      expect(Services::Profiles).to receive(:get_profiles).with(:user_profiles, {user_id: user_id})
      get profiles_route
    end

    it 'redirects user to profile page otherwise' do
      get profiles_route

      expect(last_response.body).to include('Pard.Profile')
    end
  end
end
