describe CallsController do

  let(:login_route){'/login/login_attempt'}
  let(:create_call_route){'/users/create_call'}
  let(:send_proposal_route){'/users/send_proposal'}
  let(:amend_proposal_route){'/users/amend_proposal'}
  let(:delete_proposal_route){'/users/delete_proposal'}

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

  let(:proposal){
    {
      profile_id: profile_id,
      proposal_id: proposal_id,
      call_id: call_id,
      type: 'artist',
      category: 'music',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      photos: ['picture.jpg', 'otter_picture.jpg'],
      links: 'links',
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
    {
      call_id: call_id
    }
  }

  before(:each){
    Repos::Users.add user
    Services::Users.validated_user validation_code
    post login_route, user_hash
  }

  describe 'Create' do

    it 'fails if the call already exists' do
      post create_call_route, call
      post create_call_route, call
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('existing_call')
    end

    it 'adds a new a call' do
      expect(Services::Calls).to receive(:register).with(Util.stringify_hash(call), user_id)
      post create_call_route, call
      expect(parsed_response['status']).to eq('success')
    end
  end

  describe 'Send_proposal' do

    before(:each){
      post create_call_route, call
    }

    it 'fails if the proposal has the wrong type' do
      proposal[:type] = 'otter'
      post send_proposal_route, proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_type')
    end

    it 'fails if the call does not exist' do
      proposal[:call_id] = 'otter'
      post send_proposal_route, proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_call')
    end

    it 'sends the proposal' do
      expect(Services::Calls).to receive(:add_proposal).with(Util.stringify_hash(proposal), user_id)
      post send_proposal_route, proposal
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['profile_id']).to eq(profile_id)
    end
  end

  describe 'Amend_proposal' do

    before(:each){
      post create_call_route, call
    }

    it 'fails if the proposal does not exist' do
      post amend_proposal_route, {proposal_id: proposal_id, amend: 'amend'}

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_proposal')
    end

    it 'fails if the user does not own the proposal' do
      proposal[:user_id] = 'otter'
      Repos::Calls.add_proposal call_id, proposal
      post amend_proposal_route, {proposal_id: proposal_id, amend: 'amend'}

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'amends the proposal' do
      proposal[:user_id] = user_id
      Repos::Calls.add_proposal call_id, proposal
      expect(Services::Calls).to receive(:amend_proposal).with(proposal_id, 'amend')
      
      post amend_proposal_route, {proposal_id: proposal_id, amend: 'amend'}
      expect(parsed_response['status']).to eq('success')
    end
  end

  describe 'Delete_proposal' do

    before(:each){
      post create_call_route, call
    }

    it 'fails if the proposal does not exist' do
      post delete_proposal_route, {proposal_id: proposal_id}

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_proposal')
    end

    it 'fails if the user does not own the proposal' do
      proposal[:user_id] = 'otter'
      Repos::Calls.add_proposal call_id, proposal
      post delete_proposal_route, {proposal_id: proposal_id}

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'deletes the proposal' do
      proposal[:user_id] = user_id
      Repos::Calls.add_proposal call_id, proposal
      post delete_proposal_route, {proposal_id: proposal_id}

      expect(parsed_response['status']).to eq('success')
      post delete_proposal_route, proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_proposal')
    end
  end
end
