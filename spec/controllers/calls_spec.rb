describe CallsController do

  let(:login_route){'/login/login_attempt'}
  let(:logout_route){'/login/logout'}
  let(:create_call_route){'/users/create_call'}
  let(:create_profile_route){'/users/create_profile'}
  let(:send_artist_proposal_route){'/users/send_artist_proposal'}
  let(:send_artist_own_proposal_route){'/users/send_artist_own_proposal'}
  let(:send_space_proposal_route){'/users/send_space_proposal'}
  let(:send_space_own_proposal_route){'/users/send_space_own_proposal'}
  let(:amend_artist_proposal_route){'/users/amend_artist_proposal'}
  let(:amend_space_proposal_route){'/users/amend_space_proposal'}
  let(:modify_artist_proposal_route){'/users/modify_artist_proposal'}
  let(:modify_space_proposal_route){'/users/modify_space_proposal'}
  let(:delete_artist_proposal_route){'/users/delete_artist_proposal'}
  let(:delete_space_proposal_route){'/users/delete_space_proposal'}

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
  let(:space_profile_id){'fce11c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:production_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb80'}
  let(:proposal_id){'b11000e7-8f02-4542-a1c9-7f7aa18752ce'}
  let(:performance_id){'a11000e7-8f02-4542-a1c9-7f7aa18752ce'}
  let(:event_id){'a5bc4203-9379-4de0-856a-55e1e5f3fac6'}
  let(:otter_event_id){'a5bc4203-9379-4de0-856a-56e1e5f3fac6'}
  let(:call_id){'b5bc4203-9379-4de0-856a-55e1e5f3fac6'}

  let(:phone){
    {
      'value' => 'phone',
      'visible' => 'false'
    }
  }

  let(:profile){
    {
      type: 'artist',
      name: 'artist_name',
      address: 'address',
      color: 'color',
      phone: {
        'value' => nil,
        'visible' => false
      }
    }
  }

  let(:artist){
    {
      user_id: user_id,
      profile_id: profile_id,
      email: 'email@test.com',
      name: 'artist_name',
      address: 'address',
      phone: phone,
      type: 'artist',
      proposals: [{
        production_id: production_id,
        proposal_id: production_id,
        category: 'music',
        title: 'title',
        description: 'description',
        short_description: 'short_description',
        duration: 'duration',
        '1': nil,
        '2': 'mandatory',
        form_category: 'music',
        subcategory: 'music',
        amend: 'amend'
      }]
    }
  }

  let(:proposal){
    {
      profile_id: profile_id,
      event_id: otter_event_id,
      call_id: call_id,
      category: 'music',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      duration: 'duration',
      phone: phone,
      form_category: 'music',
      subcategory: 'music',
      '2': 'mandatory',
      amend: 'amend',
      conditions: 'true'
    }
  }

  let(:production){
    {
      production_id: production_id,
      category: 'music',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      duration: 'duration',
      photos: nil,
      links: nil,
      children: nil,
      cache: nil
    }
  }

  let(:artist_own){
    {
      user_id: user_id,
      profile_id: profile_id,
      email: 'email@test.com',
      name: 'artist_name',
      phone: phone,
      type: 'artist',
      own: true,
      proposals: [{
        proposal_id: proposal_id,
        category: 'music',
        title: 'title',
        description: 'description',
        short_description: 'short_description',
        duration: 'duration',
        '1': nil,
        '2': nil,
        form_category: 'music',
        subcategory: 'music',
        own: true
      }]
    }
  }

  let(:artist_own_proposal){
    {
      profile_id: profile_id,
      event_id: event_id,
      call_id: call_id,
      email: 'email@test.com',
      name: 'artist_name',
      category: 'music',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      duration: 'duration',
      phone: phone,
      form_category: 'music',
      subcategory: 'music'
    }
  }
  
  let(:space){
    {
      user_id: user_id,
      profile_id: space_profile_id,
      proposal_id: proposal_id,
      email: 'email@test.com',
      name: 'space_name',
      address: {
        locality: 'locality',
        postal_code: 'postal_code'
      },
      category: 'home',
      phone: phone,
      type: 'space',
      links: nil,
      photos: nil,
      description: nil,
      '1': nil,
      '2': 'mandatory',
      form_category: 'home',
      subcategory: 'home',
      amend: 'amend'
    }
  }  

  let(:space_profile){
    {
      type: 'space',
      profile_id: space_profile_id,
      name: 'space_name',
      address: {
        :locality => 'locality',
        :postal_code => 'postal_code'
      },
      phone: {
        'value' => nil,
        'visible' => false
      },
      category: 'home',
      color: 'color'
    }
  }

  let(:space_proposal){
    {
      user_id: user_id,
      profile_id: space_profile_id,
      event_id: otter_event_id,
      call_id: call_id,
      phone: phone,
      category: 'home',
      form_category: 'home',
      subcategory: 'home',
      '2': 'mandatory',
      amend: 'amend',
      conditions: 'true'
    }
  }

  let(:space_own){
    {
      user_id: user_id,
      profile_id: space_profile_id,
      proposal_id: proposal_id,
      email: 'email@test.com',
      name: 'space_name',
      address: 'address',
      category: 'home',
      phone: phone,
      description: nil,
      '1': nil,
      '2': nil,
      form_category: 'home',
      subcategory: 'home',
      own: true
    }
  }

  let(:space_own_proposal){
    {
      user_id: user_id,
      profile_id: space_profile_id,
      event_id: event_id,
      call_id: call_id,
      email: 'email@test.com',
      name: 'space_name',
      address: 'address',
      phone: phone,
      category: 'home',
      form_category: 'home',
      subcategory: 'home'
    }
  }

  let(:event){
    {
      user_id: user_id,
      profile_id: profile_id,
      event_id: event_id,
      call_id: call_id,
      organizer: 'organizer',
      name: 'event_name',
      artists: [],
      spaces: [],
      program: [],
      whitelist: [],
      start: '1462053600',
      deadline: '1466028000',
    }
  }

  let(:otter_event){
    {
      user_id: otter_user_id,
      profile_id: profile_id,
      event_id: otter_event_id,
      call_id: call_id,
      organizer: 'organizer',
      name: 'event_name',
      artists: [],
      spaces: [],
      program: [],
      whitelist: [],
      start: '1462053600',
      deadline: '1466028000',
    }
  }

  let(:call){
    {
      user_id: user_id,
      call_id: call_id,
      artist: {
        music: {
          title: {type: "mandatory"},
          description: {type: "mandatory"},
          short_description: {type: "mandatory"},
          duration: {type: "mandatory"},
          '1': {type: "optional"},
          '2': {type: "mandatory"}
        }
      },
      space: {
        home: {
          '1': {type: "optional"},
          '2': {type: "mandatory"}
        }
      }
    }
  }

  before(:each){
    Repos::Users.add user
    Services::Users.validated_user validation_code
    Repos::Users.add otter_user
    Services::Users.validated_user otter_validation_code
    @db['events'].insert_one(event)
    @db['events'].insert_one(otter_event)
    @db['calls'].insert_one(call)
    post login_route, user_hash
    allow(SecureRandom).to receive(:uuid).and_return(profile_id)
  }

  describe 'Send_artist_proposal' do

    before(:each){
      post create_profile_route, profile
      allow(SecureRandom).to receive(:uuid).and_return(production_id)
    }

    it 'fails if the event does not exist' do
      proposal[:event_id] = 'otter'
      post send_artist_proposal_route, proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_event')
    end

    it 'fails if the call does not exist' do
      proposal[:call_id] = 'otter'
      post send_artist_proposal_route, proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_call')
    end

    it 'fails if the profile does not exist' do
      proposal[:profile_id] = 'otter'
      post send_artist_proposal_route, proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_profile')
    end

    it 'fails if not the profile owner' do
      post logout_route
      post login_route, otter_user_hash
      post send_artist_proposal_route, proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'fails if wrong category' do
      proposal[:category] = 'otter'
      post send_artist_proposal_route, proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_category')
    end

    it 'fails if the call does not include the form category' do
      proposal[:form_category] = 'arts'
      post send_artist_proposal_route, proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_parameters')
    end

    it 'adds a new production if non existing' do
      expect(Repos::Profiles).to receive(:add_production).with(profile_id, production)
      allow(Time).to receive(:now).and_return(1462054)
      post send_artist_proposal_route, proposal
      expect(parsed_response['status']).to eq('success')
    end

    it 'fails if out of deadline' do
      post send_artist_proposal_route, proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('out_of_time_range')
    end

    it 'fails if it does not include mandatory form fields' do
      allow(Time).to receive(:now).and_return(1462054)
      proposal.delete(:'2')
      post send_artist_proposal_route, proposal
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_parameters')
    end

    it 'does not fail out of deadline if event owner' do
      proposal[:event_id] = event_id
      expect(Repos::Events).to receive(:add_artist).with(event_id, artist)
      post send_artist_proposal_route, proposal
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['model']).to eq(Util.stringify_hash(artist))
    end

    it 'sends the proposal' do
      expect(Repos::Events).to receive(:add_artist).with(otter_event_id, artist)
      allow(Time).to receive(:now).and_return(1462054)
      post send_artist_proposal_route, proposal
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['model']).to eq(Util.stringify_hash(artist))
    end

    it 'adds phone to profile if it has not' do
      profile[:phone] = phone
      expect(Repos::Profiles).to receive(:update).with(hash_including(profile))
      allow(Time).to receive(:now).and_return(1462054)
      post send_artist_proposal_route, proposal
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['model']).to eq(Util.stringify_hash(artist))
    end
  end

  describe 'Sends own artist proposal' do

    before(:each){
      allow(SecureRandom).to receive(:uuid).and_return(proposal_id)
    }

    it 'fails if the event does not exist' do
      artist_own_proposal[:event_id] = 'otter'
      post send_artist_own_proposal_route, artist_own_proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_event')
    end

    it 'fails if the call does not exist' do
      artist_own_proposal[:call_id] = 'otter'
      post send_artist_own_proposal_route, artist_own_proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_call')
    end

    it 'fails if not the event owner' do
      post logout_route
      post login_route, otter_user_hash
      post send_artist_own_proposal_route, artist_own_proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'fails if it does not include mandatory orfheo fields' do
      artist_own_proposal.delete(:title)
      post send_artist_own_proposal_route, artist_own_proposal
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_parameters')
    end

    it 'fails if it does not include profile mandatory orfheo fields' do
      artist_own_proposal.delete(:name)
      post send_artist_own_proposal_route, artist_own_proposal
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_parameters')
    end

    it 'sends own proposal' do
      expect(Repos::Events).to receive(:add_artist).with(event_id, artist_own)
      post send_artist_own_proposal_route, artist_own_proposal
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['model']).to eq(Util.stringify_hash(artist_own))
    end
  end

  describe 'Send_space_proposal' do

    before(:each){
      allow(SecureRandom).to receive(:uuid).and_return(space_profile_id)
      post create_profile_route, space_profile
      allow(SecureRandom).to receive(:uuid).and_return(proposal_id)
    }

    it 'fails if the event does not exist' do
      space_proposal[:event_id] = 'otter'
      post send_space_proposal_route, space_proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_event')
    end

    it 'fails if the call does not exist' do
      space_proposal[:call_id] = 'otter'
      post send_space_proposal_route, space_proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_call')
    end

    it 'fails if the profile does not exist' do
      space_proposal[:profile_id] = 'otter'
      post send_space_proposal_route, space_proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_profile')
    end

    it 'fails if not the profile owner' do
      post logout_route
      post login_route, otter_user_hash
      post send_space_proposal_route, space_proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'fails if wrong category' do
      space_proposal[:category] = 'otter'
      post send_space_proposal_route, space_proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_category')
    end

    it 'fails if the call does not include the form category' do
      space_proposal[:form_category] = 'otter'
      post send_space_proposal_route, space_proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_parameters')
    end

    it 'fails if out of deadline' do
      post send_space_proposal_route, space_proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('out_of_time_range')
    end

    it 'fails if it does not include mandatory form fields' do
      allow(Time).to receive(:now).and_return(1462054)
      space_proposal.delete(:'2')
      post send_space_proposal_route, space_proposal
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_parameters')
    end

    it 'does not fail out of deadline if event owner' do
      space_proposal[:event_id] = event_id
      expect(Repos::Events).to receive(:add_space).with(event_id, space)
      post send_space_proposal_route, space_proposal
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['model']).to eq(Util.stringify_hash(space))
    end

    it 'sends the proposal' do
      expect(Repos::Events).to receive(:add_space).with(otter_event_id, space)
      allow(Time).to receive(:now).and_return(1462054)
      post send_space_proposal_route, space_proposal
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['model']).to eq(Util.stringify_hash(space))
    end

    it 'adds phone to profile if it has not' do
      space_profile[:phone] = phone
      expect(Repos::Profiles).to receive(:update).with(hash_including(space_profile))
      allow(Time).to receive(:now).and_return(1462054)
      post send_space_proposal_route, space_proposal
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['model']).to eq(Util.stringify_hash(space))
    end
  end

  describe 'Sends own space proposal' do

    before(:each){
      allow(SecureRandom).to receive(:uuid).and_return(proposal_id)
    }

    it 'fails if the event does not exist' do
      space_own_proposal[:event_id] = 'otter'
      post send_space_own_proposal_route, space_own_proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_event')
    end

    it 'fails if the call does not exist' do
      space_own_proposal[:call_id] = 'otter'
      post send_space_own_proposal_route, space_own_proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_call')
    end

    it 'fails if not the event owner' do
      post logout_route
      post login_route, otter_user_hash
      post send_space_own_proposal_route, space_own_proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'fails if it does not include profile mandatory orfheo fields' do
      space_own_proposal.delete(:name)
      post send_space_own_proposal_route, space_own_proposal
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_parameters')
    end

    it 'sends own proposal' do
      expect(Repos::Events).to receive(:add_space).with(event_id, space_own)
      post send_space_own_proposal_route, space_own_proposal
      expect(parsed_response['status']).to eq('success')
       expect(parsed_response['model']).to eq(Util.stringify_hash(space_own))
    end
  end

  describe 'Amend_artist_proposal' do

    before(:each){
      post create_profile_route, profile
      artist[:proposals].first[:amend] = 'new_amend'
      artist[:proposals].first[:production_id] = proposal_id
      artist[:proposals].first[:proposal_id] = proposal_id
      artist[:proposals].first[:amend] = 'new_amend'
      allow(SecureRandom).to receive(:uuid).and_return(proposal_id)
    }

    let(:amend){
      {
        event_id: otter_event_id,
        call_id: call_id,
        proposal_id: proposal_id,
        amend: 'new_amend'
      }
    }

    it 'fails if the proposal does not exist' do
      post amend_artist_proposal_route, amend
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_proposal')
    end

    it 'fails if the user is out of time' do
      allow(Time).to receive(:now).and_return(1462054)
      post send_artist_proposal_route, proposal
      allow(Time).to receive(:now).and_return(0)
      post amend_artist_proposal_route, amend

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('out_of_time_range')
    end

    it 'fails if the user does not own the proposal' do
      allow(Time).to receive(:now).and_return(1462054)
      post send_artist_proposal_route, proposal
      post logout_route
      post login_route, otter_user
      post amend_artist_proposal_route, amend
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'amends the proposal' do
      allow(Time).to receive(:now).and_return(1462054)
      post send_artist_proposal_route, proposal
      artist[:phone] = {value: 'phone', visible: 'false'}

      expect(Repos::Events).to receive(:modify_artist).with(artist)
      post amend_artist_proposal_route, amend
      expect(parsed_response['status']).to eq('success')
    end
  end

  describe 'Amend_space_proposal' do

    before(:each){
      allow(SecureRandom).to receive(:uuid).and_return(space_profile_id)
      post create_profile_route, space_profile
      space[:amend] = 'new_amend'
      allow(SecureRandom).to receive(:uuid).and_return(proposal_id)
    }

    let(:amend){
      {
        event_id: otter_event_id,
        call_id: call_id,
        proposal_id: proposal_id,
        amend: 'new_amend'
      }
    }

    it 'fails if the proposal does not exist' do
      post amend_space_proposal_route, amend
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_proposal')
    end

    it 'fails if the user is out of time' do
      allow(Time).to receive(:now).and_return(1462054)
      post send_space_proposal_route, space_proposal
      allow(Time).to receive(:now).and_return(0)
      post amend_space_proposal_route, amend

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('out_of_time_range')
    end

    it 'fails if the user does not own the proposal' do
      allow(Time).to receive(:now).and_return(1462054)
      post send_space_proposal_route, space_proposal
      post logout_route
      post login_route, otter_user
      post amend_space_proposal_route, amend
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'amends the proposal' do
      allow(Time).to receive(:now).and_return(1462054)
      post send_space_proposal_route, space_proposal
      space[:phone] = {value: 'phone', visible: 'false'}

      expect(Repos::Events).to receive(:modify_space).with(space)
      post amend_space_proposal_route, amend
      expect(parsed_response['status']).to eq('success')
    end
  end

  describe 'Modify_artist_proposal' do

    before(:each){
      post create_profile_route, profile
      proposal[:proposal_id] = proposal_id
      artist_own_proposal[:proposal_id] = proposal_id
      artist[:proposals].first[:proposal_id] = proposal_id
      artist[:proposals].first[:production_id] = proposal_id
      artist[:phone] = {value: 'phone', visible: 'false'}
      allow(SecureRandom).to receive(:uuid).and_return(proposal_id)
    }

    it 'fails if the user does not own the event' do
      allow(Time).to receive(:now).and_return(1462054)
      post send_artist_proposal_route, proposal
      post modify_artist_proposal_route, proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'fails if the proposal does not exist' do
      post logout_route
      post login_route, otter_user_hash
      proposal[:proposal_id] = 'otter'
      post modify_artist_proposal_route, proposal
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_proposal')
    end

    it 'modifies the proposal' do
      allow(Time).to receive(:now).and_return(1462054)
      post send_artist_proposal_route, proposal
      post logout_route
      post login_route, otter_user_hash

      expect(Repos::Events).to receive(:modify_artist).with(artist)
      proposal[:title] = 'otter_title'
      artist[:proposals].first[:title] = 'otter_title'
      post modify_artist_proposal_route, proposal
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['model']).to eq(Util.stringify_hash(artist))
    end

    it 'modifies own proposal' do
      allow(SecureRandom).to receive(:uuid).and_return(proposal_id)
      post send_artist_own_proposal_route, artist_own_proposal
      artist_own[:proposals].first[:title] = 'otter_title'
      artist_own_proposal[:title] = 'otter_title'
      expect(Repos::Events).to receive(:modify_artist).with(artist_own)
      post modify_artist_proposal_route, artist_own_proposal
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['model']).to eq(Util.stringify_hash(artist_own))
    end
  end

  describe 'Modify_space_proposal' do

    before(:each){
      allow(SecureRandom).to receive(:uuid).and_return(space_profile_id)
      post create_profile_route, space_profile
      space_proposal[:proposal_id] = proposal_id
      space[:phone] = {value: 'phone', visible: 'false'}
      allow(SecureRandom).to receive(:uuid).and_return(proposal_id)
    }

    it 'fails if the user does not own the event' do
      allow(Time).to receive(:now).and_return(1462054)
      post send_space_proposal_route, space_proposal
      post modify_space_proposal_route, space_proposal

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'fails if the proposal does not exist' do
      post logout_route
      post login_route, otter_user_hash
      space_proposal[:proposal_id] = 'otter'
      post modify_space_proposal_route, space_proposal
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_proposal')
    end

    it 'modifies the proposal' do
      allow(Time).to receive(:now).and_return(1462054)
      post send_space_proposal_route, space_proposal
      post logout_route
      post login_route, otter_user_hash
      expect(Repos::Events).to receive(:modify_space).with(space)
      space_proposal[:'2'] = 'otter'
      space[:'2'] = 'otter'
      post modify_space_proposal_route, space_proposal
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['model']).to eq(Util.stringify_hash(space))
    end

    it 'modifies own proposal' do
      allow(SecureRandom).to receive(:uuid).and_return(proposal_id)
      post send_space_own_proposal_route, space_own_proposal
      space_own[:name] = 'otter'
      space_own_proposal[:name] = 'otter'
      space_own_proposal[:proposal_id] = proposal_id
      expect(Repos::Events).to receive(:modify_space).with(space_own)
      post modify_space_proposal_route, space_own_proposal
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['model']).to eq(Util.stringify_hash(space_own))
    end
  end

  describe 'Delete_artist_proposal' do

    before(:each){
      post create_profile_route, profile
      allow(Time).to receive(:now).and_return(1462054)
      allow(SecureRandom).to receive(:uuid).and_return(proposal_id)
      post send_artist_proposal_route, proposal
    }

    it 'fails if the proposal does not exist' do
      post delete_artist_proposal_route, {event_id: otter_event_id, proposal_id: 'otter'}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_proposal')
    end

    it 'fails if the user is out of time' do
      allow(Time).to receive(:now).and_return(0)
      post delete_artist_proposal_route, {event_id: otter_event_id, proposal_id: proposal_id}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('out_of_time_range')
    end

    it 'allows event owner to delete and delivers rejection mail' do
      allow(Time).to receive(:now).and_return(0)
      post logout_route
      post login_route, otter_user_hash
      expect(Repos::Events).to receive(:delete_artist_proposal).with(proposal_id)
      expect(Services::Mails).to receive(:deliver_mail_to).with({email: 'email@test.com'}, :rejected, {organizer: 'organizer', event_name: 'event_name', title: 'title'})
      post delete_artist_proposal_route, {event_id: otter_event_id, proposal_id: proposal_id}
      expect(parsed_response['status']).to eq('success')
    end

    it 'allows proposal owner to delete and does not deliver rejection mail' do
      allow(Time).to receive(:now).and_return(1462054)
      expect(Repos::Events).to receive(:delete_artist_proposal).with(proposal_id)
      expect(Services::Mails).not_to receive(:deliver_mail_to).with({email: 'email@test.com'}, :rejected, {organizer: 'organizer', event_name: 'event_name', title: 'title'})
      post delete_artist_proposal_route, {event_id: otter_event_id, proposal_id: proposal_id}
      expect(parsed_response['status']).to eq('success')
    end
  end

  describe 'Delete_space_proposal' do

    before(:each){
      allow(SecureRandom).to receive(:uuid).and_return(space_profile_id)
      post create_profile_route, space_profile
      allow(Time).to receive(:now).and_return(1462054)
      allow(SecureRandom).to receive(:uuid).and_return(proposal_id)
      post send_space_proposal_route, space_proposal
    }

    it 'fails if the proposal does not exist' do
      post delete_space_proposal_route, {event_id: otter_event_id, proposal_id: 'otter'}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_proposal')
    end

    it 'fails if the user is out of time' do
      allow(Time).to receive(:now).and_return(0)
      post delete_space_proposal_route, {event_id: otter_event_id, proposal_id: proposal_id}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('out_of_time_range')
    end

    it 'allows event owner to delete and delivers rejection mail' do
      allow(Time).to receive(:now).and_return(0)
      post logout_route
      post login_route, otter_user_hash
      expect(Repos::Events).to receive(:delete_space_proposal).with(proposal_id)
      expect(Services::Mails).to receive(:deliver_mail_to).with({email: 'email@test.com'}, :rejected, {organizer: 'organizer', event_name: 'event_name', title: 'space_name'})
      post delete_space_proposal_route, {event_id: otter_event_id, proposal_id: proposal_id}
      expect(parsed_response['status']).to eq('success')
    end

    it 'allows proposal owner to delete and does not deliver rejection mail' do
      allow(Time).to receive(:now).and_return(1462054)
      expect(Repos::Events).to receive(:delete_space_proposal).with(proposal_id)
      expect(Services::Mails).not_to receive(:deliver_mail_to).with({email: 'email@test.com'}, :rejected, {organizer: 'organizer', event_name: 'event_name', title: 'space_name'})
      post delete_space_proposal_route, {event_id: otter_event_id, proposal_id: proposal_id}
      expect(parsed_response['status']).to eq('success')
    end
  end

  describe 'Whitelist' do

    let(:whitelisted){
      {
        email: 'otter@otter.com', 
        name_email: 'otter@otter.com'
      }
    }

    it 'stores a whitelist' do
      expect(Repos::Events).to receive(:add_whitelist).with(event_id, [whitelisted])
      post '/users/add_whitelist', {event_id: event_id, email: whitelisted[:email], name_email: whitelisted[:name_email]}
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['model']).to eq([Util.stringify_hash(whitelisted)])
    end

    it 'deletes a whitelisted' do
      post '/users/add_whitelist', {event_id: event_id, email: whitelisted[:email], name_email: whitelisted[:name_email]}
      
      expect(Repos::Events).to receive(:add_whitelist).with(event_id, [])
      post '/users/delete_whitelist', {event_id: event_id, email: whitelisted[:email]}
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['model']).to eq([])
    end
  end
end