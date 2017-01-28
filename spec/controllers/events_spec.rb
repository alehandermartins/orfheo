describe EventsController do

  let(:login_route){'/login/login_attempt'}
  let(:logout_route){'/login/logout'}
  let(:create_event_route){'/users/create_event'}
  let(:create_performance_route){'/users/create_performance'}
  let(:modify_performance_route){'/users/modify_performance'}

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
  let(:proposal_id){'pae01c94-4a2b-49ff-b6b6-dfd53e45bb80'}
  let(:performance_id){'a11000e7-8f02-4542-a1c9-7f7aa18752ce'}
  let(:host_profile_id){'g11000e7-8f02-4542-a1c9-7f7aa18752ce'}
  let(:host_proposal_id){'hce01c94-4a2b-49ff-b6b6-dfd53e45bb80'}
  let(:event_id){'a5bc4203-9379-4de0-856a-55e1e5f3fac6'}

  let(:event){
    {
      name: 'event_name'
    }
  }

  let(:event_model){
    {
      user_id: user_id,
      event_id: event_id
    }
  }

  let(:performance){
    {
      event_id: event_id,
      participant_id: profile_id,
      participant_production_id: production_id,
      participant_proposal_id: proposal_id,
      host_id: host_profile_id,
      host_proposal_id: host_proposal_id,
      date: '2016-15-10',
      time: ['3', '6'],
      permanent: 'false',
      comments: 'comments',
      host_name: 'host_name',
      address: 'host_address',
      participant_name: 'artist_name',
      title: 'title',
      short_description: 'short_description',
      children: 'true',
      participant_category: 'artist_category',
      host_category: 'host_category'
    }
  }

  let(:performance_model){
    {
      performance_id: performance_id,
      participant_id: profile_id,
      participant_proposal_id: proposal_id,
      host_id: host_profile_id,
      host_proposal_id: host_proposal_id,
      date: performance[:date],
      time: performance[:time],
      permanent: performance[:permanent],
      comments: performance[:comments],
      confirmed: false
    }
  }


  before(:each){
    Repos::Users.add user
    Services::Users.validated_user validation_code
    Repos::Users.add otter_user
    Services::Users.validated_user otter_validation_code
    post login_route, user_hash
    allow(SecureRandom).to receive(:uuid).and_return(event_id)
    allow(Repos::Events).to receive(:performers_participate?).and_return(true)
    allow(Repos::Events).to receive(:performance_exists?).with(event_id, performance_model).and_return(true)
  }

  describe 'Retrieve' do

    it 'retrieves all events' do
      expect(Repos::Events).to receive(:get_events)
      post '/events'
      expect(parsed_response['status']).to eq('success')
    end
  end

  describe 'Create_performance' do

    before(:each){
      post create_event_route, event
      allow(SecureRandom).to receive(:uuid).and_return(performance_id)
    }

    it 'fails if the event does not exist' do
      performance[:event_id] = 'otter'
      post create_performance_route, performance

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_event')
    end

    it 'fails if not the event owner' do
      allow(Repos::Events).to receive(:get_event_owner).with(event_id).and_return('otter')
      post create_performance_route, performance

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'stores the performance' do
      expect(Repos::Events).to receive(:add_performance).with(event_id, performance_model)
      post create_performance_route, performance
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['performance_id']).to eq(performance_id)
    end
  end

  describe 'Modify_performance' do

    before(:each){
      post create_event_route, event
      allow(SecureRandom).to receive(:uuid).and_return(performance_id)
      post create_performance_route, performance
      performance[:performance_id] = performance_id
    }

    it 'fails if the event does not exist' do
      performance[:event_id] = 'otter'
      post modify_performance_route, performance

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_event')
    end

    it 'fails if not the event owner' do
      allow(Repos::Events).to receive(:get_event_owner).with(event_id).and_return('otter')
      post modify_performance_route, performance

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'modifies the performance' do
      performance[:date] = 'otter_date'
      performance_model[:date] = performance[:date]
      expect(Repos::Events).to receive(:modify_performance).with(event_id, performance_model)
      post modify_performance_route, performance
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['performance_id']).to eq(performance_id)
    end
  end

  describe 'Delete_performance' do
    let(:delete_performance_route){'/users/delete_performance'}

    before(:each){
      post create_event_route, event
      allow(SecureRandom).to receive(:uuid).and_return(performance_id)
    }

    it 'fails if the user does not own the event' do
      allow(Repos::Events).to receive(:get_event_owner).with(event_id).and_return('otter')
      post delete_performance_route, {event_id: event_id, performance_id: performance_id}

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'deletes the performance' do
      post create_performance_route, performance
      expect(Repos::Events).to receive(:delete_performance).with(event_id, performance_id)
      post delete_performance_route, {event_id: event_id, performance_id: performance_id}
      expect(parsed_response['status']).to eq('success')
    end
  end

  describe 'Retrieves the program' do
    let(:retrieve_program_route){'/event?id=' + event_id}

    it 'retrieves the program' do
      allow(SecureRandom).to receive(:uuid).and_return(event_id)
      post create_event_route, event
      post create_performance_route, performance
      expect(Repos::Events).to receive(:get_program).with(event_id)
      get retrieve_program_route
    end
  end

  describe 'Event Manager' do

    let(:event_route){'/event_manager?id=' + event_id}

    it 'redirects user to not found page if call does not exist' do
      get event_route
      expect(last_response.body).to include('Not Found')
    end

    it 'redirects user to not found page if not owner of the call' do
      post create_event_route, event
      post logout_route
      post login_route, otter_user_hash
      get event_route
      expect(last_response.body).to include('Not Found')
    end

    it 'gets the call of the user' do
      post create_event_route, event
      get event_route
      expect(last_response.body).to include('Pard.EventManager')
    end
  end
end
