describe EventsController do

  let(:login_route){'/login/login_attempt'}
  let(:logout_route){'/login/logout'}
  let(:create_performance_route){'/users/create_performances'}
  let(:modify_performance_route){'/users/modify_performances'}
  let(:delete_performance_route){'/users/delete_performances'}

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
  let(:proposal_id){'pae01c94-4a2b-49ff-b6b6-dfd53e45bb80'}
  let(:performance_id){'a11000e7-8f02-4542-a1c9-7f7aa18752ce'}
  let(:otter_performance_id){'a11000e7-8f02-5542-a1c9-7f7aa18752ce'}
  let(:host_profile_id){'g11000e7-8f02-4542-a1c9-7f7aa18752ce'}
  let(:host_proposal_id){'hce01c94-4a2b-49ff-b6b6-dfd53e45bb80'}
  let(:event_id){'a5bc4203-9379-4de0-856a-55e1e5f3fac6'}

  let(:event){
    {
      event_id: event_id,
      user_id: user_id,
      name: 'event_name',
      artists: [{profile_id: profile_id}],
      spaces: [{profile_id: host_profile_id}],
      program: []
    }
  }

  let(:performance){
    {
      participant_id: profile_id,
      participant_proposal_id: proposal_id,
      host_id: host_profile_id,
      host_proposal_id: host_proposal_id,
      date: '2016-15-10',
      time: ['3', '6'],
      permanent: 'false',
      comments: 'comments',
      confirmed: nil
    }
  }

  let(:otter_performance){
    {
      participant_id: profile_id,
      participant_proposal_id: proposal_id,
      host_id: host_profile_id,
      host_proposal_id: host_proposal_id,
      date: '2016-16-10',
      time: ['5', '7'],
      permanent: 'false',
      comments: 'comments',
      confirmed: nil
    }
  }

  let(:program){[performance, otter_performance]}
  let(:params){{event_id: event_id, program: program}}

  before(:each){
    Repos::Users.add user
    Services::Users.validated_user validation_code
    Repos::Users.add otter_user
    Services::Users.validated_user otter_validation_code
    post login_route, user_hash
    @db['events'].insert_one(event)
    allow(SecureRandom).to receive(:uuid).and_return(performance_id)
  }

  describe 'Retrieve' do

    it 'retrieves all events' do
      expect(Services::Events).to receive(:get_events)
      post '/events'
      expect(parsed_response['status']).to eq('success')
    end
  end

  describe 'Create_performances' do

    let(:program_to_store){
      [{
        performance_id: performance_id,
        participant_id: profile_id,
        participant_proposal_id: proposal_id,
        host_id: host_profile_id,
        host_proposal_id: host_proposal_id,
        date: '2016-15-10',
        time: ['3', '6'],
        permanent: 'false',
        comments: 'comments',
        confirmed: nil
      },
      {
        performance_id: performance_id,
        participant_id: profile_id,
        participant_proposal_id: proposal_id,
        host_id: host_profile_id,
        host_proposal_id: host_proposal_id,
        date: '2016-16-10',
        time: ['5', '7'],
        permanent: 'false',
        comments: 'comments',
        confirmed: nil
      }]
    }

    it 'fails if the event does not exist' do
      params[:event_id] = 'otter'
      post create_performance_route, params

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_event')
    end

    it 'fails if not the event owner' do
      allow(Repos::Events).to receive(:get_event_owner).with(event_id).and_return('otter')
      post create_performance_route, params

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'fails if no participants' do
      allow(Repos::Events).to receive(:get_event).and_return({artists: []})
      post create_performance_route, params

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_parameters')
    end

    it 'fails if missing mandatory fields' do
      performance[:participant_id] = nil
      post create_performance_route, params

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_parameters')
    end

    it 'stores the performance' do
      expect(Repos::Events).to receive(:save_program).with(event_id, program_to_store)
      post create_performance_route, params
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['model']).to eq(Util.stringify_array(program_to_store))
    end
  end

  describe 'Modify_performances' do

    before(:each){
      post create_performance_route, params
      performance[:performance_id] = performance_id
      otter_performance[:performance_id] = performance_id
    }

    it 'fails if the event does not exist' do
      params[:event_id] = 'otter'
      post modify_performance_route, params

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_event')
    end

    it 'fails if not the event owner' do
      allow(Repos::Events).to receive(:get_event_owner).with(event_id).and_return('otter')
      post modify_performance_route, params

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'fails if the performace does not exist' do
      performance[:performance_id] = 'otter'      
      post modify_performance_route, params

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_performance')
    end

    it 'modifies the performance' do
      performance[:date] = 'otter_date'
      expect(Repos::Events).to receive(:save_program).with(event_id, program)
      post modify_performance_route, params
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['model']).to eq(Util.stringify_array(program))
    end
  end

  describe 'Delete_performances' do

    it 'fails if the user does not own the event' do
      allow(Repos::Events).to receive(:get_event_owner).with(event_id).and_return('otter')
      post delete_performance_route, {event_id: event_id, performance_id: performance_id}

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('you_dont_have_permission')
    end

    it 'deletes the performance' do
      post create_performance_route, params
      expect(Repos::Events).to receive(:save_program).with(event_id, [])
      post delete_performance_route, {event_id: event_id, program: { 0 => {performance_id: performance_id}}}
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['model']).to eq(Util.stringify_array([{performance_id: performance_id}]))
    end
  end

  describe 'Access event page' do
    let(:event_route){'/event?id=' + event_id}

    it 'fails if the event does not exist' do
      get '/event?id=otter'
      expect(last_response.body).to include('Not Found')
    end
      
    it 'retrieves the event' do
      post create_performance_route, params
      expect(Services::Events).to receive(:get_event).with(event_id, user_id).and_return({user_id: user_id})
      get event_route
    end
  end

  describe 'Event Manager' do

    let(:manager_route){'/event_manager?id=' + event_id}

    it 'redirects user to not found page if event does not exist' do
      get '/event_manager?id=otter'
      expect(last_response.body).to include('Not Found')
    end

    it 'redirects user to not found page if not owner of the call' do
      post logout_route
      post login_route, otter_user_hash
      get manager_route
      expect(last_response.body).to include('Not Found')
    end

    it 'gets the call of the user' do
      expect(Services::Events).to receive(:get_manager_event).with(event_id).and_return({user_id: user_id, call_id: 'call_id'})
      expect(Repos::Calls).to receive(:get_forms).with('call_id').and_return(true)  
      get manager_route
      expect(last_response.body).to include('Pard.EventManager')
    end
  end
end