describe CallsController do

  let(:login_route){'/login/login_attempt'}
  let(:create_call_route){'/users/create_call'}
  let(:create_profile_route){'/users/create_profile'}
  let(:send_proposal_route){'/users/send_proposal'}
  let(:amend_proposal_route){'/users/amend_proposal'}
  let(:delete_proposal_route){'/users/delete_proposal'}

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
      type: 'artist',
      name: 'artist_name',
      city: 'city',
      zip_code: 'zip_code',
      color: 'color'
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
      links: [{'link'=> 'web', 'web_title'=> 'web_name'},{'link'=> 'otter_web', 'web_title'=> 'otter_web_name'}],
      duration: 'duration',
      children: 'children',
      phone: '666999666',
      sharing: nil,
      needs: nil,
      conditions: 'true',
      waiting_list: nil,
      availability: 'sun',
      components: '3',
      repeat: 'true',
    }
  }

  let(:proposal_model){
    {
      name: 'artist_name',
      city: 'city',
      zip_code: 'zip_code',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      duration: 'duration',
      components: '3',
      availability: 'sun',
      children: 'children',
      links: [{'link'=> 'web', 'web_title'=> 'web_name'},{'link'=> 'otter_web', 'web_title'=> 'otter_web_name'}],
      photos: ['picture.jpg', 'otter_picture.jpg'],
      sharing: nil,
      needs: nil,
      repeat: 'true',
      waiting_list: nil,
      phone: '666999666',
      conditions: 'true',
      user_id: user_id,
      email: 'email@test.com',
      profile_id: profile_id,
      proposal_id: proposal_id,
      production_id: production_id,
      type: :artist,
      category: :music,
      personal_web: nil
    }
  }

  let(:production_model){
    {
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      duration: 'duration',
      components: '3',
      children: 'children',
      links: [{'link'=> 'web', 'web_title'=> 'web_name'},{'link'=> 'otter_web', 'web_title'=> 'otter_web_name'}],
      photos: ['picture.jpg', 'otter_picture.jpg'],
      category: 'music',
      production_id: production_id,
    }
  }

  let(:call){
    {
      call_id: call_id,
      start: '1462053600',
      deadline: '1466028000',
    }
  }

  before(:each){
    Repos::Users.add user
    Services::Users.validated_user validation_code
    Repos::Users.add otter_user
    Services::Users.validated_user otter_validation_code
    post login_route, user_hash
    allow(SecureRandom).to receive(:uuid).and_return(profile_id)
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

    let(:own_proposal){
      {
        profile_id: profile_id,
        call_id: call_id,
        email: 'email',
        name: 'artist_name',
        type: 'artist',
        category: 'music',
        title: 'title',
        description: 'description',
        short_description: 'short_description',
        duration: 'duration',
        children: 'children',
        phone: '666999666',
        availability: 'sun',
        components: '3',
      }
    }

    let(:own_proposal_model){
      {
        user_id: user_id,
        profile_id: profile_id,
        proposal_id: proposal_id,
        email: 'email',
        name: 'artist_name',
        type: :artist,
        category: :music,
        title: 'title',
        description: 'description',
        short_description: 'short_description',
        duration: 'duration',
        children: 'children',
        phone: '666999666',
        availability: 'sun',
        components: '3',
      }
    }

    before(:each){
      post create_call_route, call
      post create_profile_route, profile
      allow(SecureRandom).to receive(:uuid).and_return(proposal_id)
    }

    it 'fails if the proposal has the wrong type' do
      proposal[:type] = 'otter'
      post send_proposal_route, proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_parameters')
    end

    it 'fails if the call does not exist' do
      proposal[:call_id] = 'otter'
      post send_proposal_route, proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_call')
    end

    it 'fails if the profile does not exist' do
      proposal[:profile_id] = 'otter'
      post send_proposal_route, proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_profile')
    end

    it 'fails if not the profile owner' do
      allow(Repos::Profiles).to receive(:get_profile_owner).with(profile_id).and_return('otter')
      post send_proposal_route, proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'sends the proposal' do
      expect(Repos::Calls).to receive(:add_proposal).with(call_id, proposal_model)
      post send_proposal_route, proposal
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['profile_id']).to eq(profile_id)
    end

    it 'adds a new production if non existing' do
      allow(SecureRandom).to receive(:uuid).and_return(production_id)
      expect(Repos::Profiles).to receive(:add_production).with(profile_id, production_model)
      proposal.delete(:production_id)
      post send_proposal_route, proposal
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['profile_id']).to eq(profile_id)
    end

    it 'sends own proposal' do
      expect(Repos::Calls).to receive(:add_proposal).with(call_id, own_proposal_model)
      post '/users/own_proposal', own_proposal
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['call']).to eq(Util.stringify_hash(Repos::Calls.get_call call_id))
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
      proposal_model[:user_id] = 'otter'
      Repos::Calls.add_proposal call_id, proposal_model
      post amend_proposal_route, {proposal_id: proposal_id, amend: 'amend'}

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'amends the proposal' do
      Repos::Calls.add_proposal call_id, proposal_model
      expect(Repos::Calls).to receive(:amend_proposal).with(proposal_id, 'amend')
      
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
      proposal_model[:user_id] = 'otter'
      Repos::Calls.add_proposal call_id, proposal_model
      post delete_proposal_route, {proposal_id: proposal_id}

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'deletes the proposal' do
      allow(Services::Profiles).to receive(:production_old_pictures).with(production_id).and_return({photos: ['photo']})
      Repos::Calls.add_proposal call_id, proposal_model
      post delete_proposal_route, {proposal_id: proposal_id}

      expect(parsed_response['status']).to eq('success')
      post delete_proposal_route, proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_proposal')
    end
  end

  describe 'Access' do

    let(:call_route){'/call?id=' + call_id}

    before(:each){
      post create_profile_route, profile
      post send_proposal_route, proposal
    }

    it 'redirects user to not found page if call does not exist' do
      get call_route
      expect(last_response.body).to include('Not Found')
    end

    it 'redirects user to not found page if not owner of the call' do
      post create_call_route, call
      allow(Repos::Calls).to receive(:get_call_owner).and_return('otter')
      get call_route
      expect(last_response.body).to include('Not Found')
    end

    it 'gets the call of the user' do
      post create_call_route, call
      expect(Repos::Calls).to receive(:get_call).with(call_id)
      get call_route
    end

    it 'redirects user to call page otherwise' do
      post create_call_route, call
      get call_route
      expect(last_response.body).to include('Pard.Call')
    end
  end

  describe 'Whitelist' do
    it 'stores a whitelist' do
      post create_call_route, call
      expect(Repos::Calls).to receive(:add_whitelist).with(call_id, ['otter@otter.com'])
      post '/users/add_whitelist', {call_id: call_id, whitelist: ['otter@otter.com']}
      expect(parsed_response['status']).to eq('success')
    end
  end

  describe 'Program' do
    let(:program_route){'/users/program'}
    let(:program_params){
      {
        call_id: call_id,
        program: [
          {
            proposal_id: proposal_id,
            program: [{day_time: 'date', place: 'space'}]        
          }  
        ]
      }
    }

    before(:each){
      post create_call_route, call
      post create_profile_route, profile
      post send_proposal_route, proposal
    }

    it 'fails if the user does not own the call' do
      allow(Repos::Calls).to receive(:get_call_owner).and_return('otter')
      post program_route, program_params

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'adds the program to the call' do
      expect(Repos::Calls).to receive(:add_program).with(call_id, program_params[:program])
      post program_route, program_params
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['call']).to eq(Util.stringify_hash(Repos::Calls.get_call call_id))
    end
  end
end
