describe ProfilesController do

  let(:login_route){'/login/login_attempt'}
  let(:logout_route){'/login/logout'}
  let(:create_profile_route){'/users/create_profile'}
  let(:create_production_route){'/users/create_production'}
  let(:create_call_route){'/users/create_call'}
  let(:send_proposal_route){'/users/send_proposal'}
  let(:delete_profile_route){'/users/delete_profile'}
  let(:delete_production_route){'/users/delete_production'}

  let(:user_hash){
    {
      email: 'email@test.com',
      password: 'password'
    }
  }

  let(:otter_user_hash){
    {
      email: 'otter@otter.com',
      password: 'otter_password'
    }
  }

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:validation_code){'3c61cf77-32b0-4df2-9376-0960e64a654a'}
  let(:otter_user_id){'8c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:otter_validation_code){'8c61cf77-32b0-4df2-9376-0960e64a654a'}

  let(:user){
    {
      user_id: user_id,
      email: 'email@test.com',
      password: 'password',
      validation: false,
      validation_code: validation_code
    }
  }

  let(:otter_user){
    {
      user_id: otter_user_id,
      email: 'otter@otter.com',
      password: 'otter_password',
      validation: false,
      validation_code: otter_validation_code
    }
  }

  let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:production_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb80'}
  let(:proposal_id){'b11000e7-8f02-4542-a1c9-7f7aa18752ce'}
  let(:call_id){'b5bc4203-9379-4de0-856a-55e1e5f3fac6'}

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

  let(:production){
    {
      profile_id: profile_id,
      production_id: production_id,
      category: 'categoty',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      photos: ['picture.jpg', 'otter_picture.jpg'],
      links: [{link: 'web', web_title: 'web_name'},{link: 'otter_web', web_title: 'otter_web_name'}],
      duration: 'duration',
      children: 'children'
    }
  }

  let(:proposal){
    {
      profile_id: profile_id,
      production_id: production_id,
      call_id: call_id,
      type: 'artist',
      category: 'music',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      photos: ['picture.jpg', 'otter_picture.jpg'],
      links: [{link: 'web', web_title: 'web_name'},{link: 'otter_web', web_title: 'otter_web_name'}],
      duration: '15',
      children: 'children',
      phone: '666999666',
      conditions: 'true',
      availability: 'sun',
      components: '3',
      repeat: 'true'
    }
  }

  let(:call){
    {}
  }

  before(:each){
    Repos::Users.add user
    Services::Users.validated_user validation_code
    Repos::Users.add otter_user
    Services::Users.validated_user otter_validation_code
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
      expect(Services::Profiles).to receive(:modify).with(Util.stringify_hash(profile), user_id).and_return(profile_id)
      post modify_profile_route, profile
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['profile_id']).to eq(profile_id)
    end

    it 'does not allow to modify a profile you don"t own' do
      post create_profile_route, profile
      post logout_route
      post login_route, otter_user_hash
      post modify_profile_route, profile
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end
  end

  describe 'Create productions' do

    before(:each){
      post create_profile_route, profile
    }

    it 'fails if the profile does not exist' do
      production[:profile_id] = ''
      post create_production_route, production
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_profile')
    end

    it 'creates a production' do
      expect(Services::Profiles).to receive(:add_production).with(Util.stringify_hash(production), user_id)
      post create_production_route, production
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['profile_id']).to eq(profile_id)
    end
  end


  describe 'Modify productions' do

    let(:modify_production_route){'/users/modify_production'}

    before(:each){
      post create_profile_route, profile
    }

    it 'fails if the production does not exist' do
      post modify_production_route, production
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_production')
    end

    it 'modifies a production' do
      post create_production_route, production
      expect(Services::Profiles).to receive(:modify_production).with(Util.stringify_hash(production), user_id).and_return(production)

      post modify_production_route, production
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['production']).to eq(Util.stringify_hash(production))
    end

    it 'does not allow to modify a production you don"t own' do
      post create_profile_route, profile
      post create_production_route, production
      post logout_route
      post login_route, otter_user_hash
      post modify_production_route, production
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end
  end

  describe 'Access' do

    let(:profiles_route){'/profile?id=' + profile_id}

    before(:each){
      post create_profile_route, profile
      post create_call_route, call
      post send_proposal_route, proposal
    }

    it 'redirects user to not found page if profile does not exist' do
      get '/profile?id=artist_name'
      expect(last_response.body).to include('Not Found')
    end

    it 'gets the profiles of the user' do
      expect(Services::Profiles).to receive(:get_profiles).with(:user_profiles, {user_id: user_id, profile_id: profile_id})
      get profiles_route
    end

    it 'redirects user to profile page otherwise' do
      get profiles_route
      expect(last_response.body).to include('Pard.Profile')
    end

    it 'redirects user to outsider page if not logged in' do
      post logout_route
      get profiles_route
      expect(last_response.body).to include('Pard.Outsider')
    end

    it 'redirects user to outsider page if not logged in' do
      post logout_route
      post login_route, otter_user_hash
      get profiles_route
      expect(last_response.body).to include('Pard.Visitor')
    end
  end

  describe 'Delete' do

    it 'fails if the profile does not exist' do
      post delete_profile_route, {profile_id: profile_id}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_profile')
    end

    it 'fails if the production does not exist' do
      post create_profile_route, profile
      post delete_production_route, {production_id: production_id}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_production')
    end

    it 'fails if user does not own the profile' do
      post create_profile_route, profile
      post logout_route
      post login_route, otter_user_hash
      post delete_profile_route, {profile_id: profile_id}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'fails if user does not own the production' do
      post create_profile_route, profile
      post create_production_route, production
      post logout_route
      post login_route, otter_user_hash
      post delete_production_route, {production_id: production_id}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'deletes the profile' do
      post create_profile_route, profile
      post delete_profile_route, {profile_id: profile_id}
      expect(parsed_response['status']).to eq('success')
      post delete_profile_route, {profile_id: profile_id}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_profile')
    end

    it 'deletes the production' do
      post create_profile_route, profile
      post create_production_route, production
      post delete_production_route, production
      expect(parsed_response['status']).to eq('success')
      post delete_production_route, {production_id: production_id}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_production')
    end
  end
end
