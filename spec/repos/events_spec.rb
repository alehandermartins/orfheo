describe Repos::Events do

  let(:user_id){'45825599-b8cf-499c-825c-a7134a3f1ff0'}
  let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:space_profile_id){'spe01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:production_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb80'}
  let(:proposal_id){'b11000e7-8f02-4542-a1c9-7f7aa18752ce'}
  let(:event_id){'a5bc4203-9379-4de0-856a-55e1e5f3fac6'}
  let(:performance_id){'c5bc4203-9379-4de0-856a-55e1e5f3fac6'}
  let(:call_id){'b5bc4203-9379-4de0-856a-55e1e5f3fac6'}

  let(:artist_proposal){
    {
      proposal_id: proposal_id,
      category: 'arts',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      duration: 'duration',
      children: 'true'
    }
  }

  let(:artist){
    {
      user_id: user_id,
      profile_id: profile_id,
      email: 'email',
      name: 'artist_name',
      address: {
        locality: 'locality',
        postal_code: 'postal_code'
      },
      phone: 'phone',
      proposals: [artist_proposal]
    }
  }

  let(:space){
    {
      user_id: user_id,
      profile_id: space_profile_id,
      email: 'email',
      name: 'space_name',
      address: {
        locality: 'locality',
        postal_code: 'postal_code'
      },
      phone: 'phone',
      category: 'category'
    }
  }

  let(:performance){
    {
      performance_id: performance_id,
      participant_id: profile_id,
      participant_proposal_id: proposal_id,
      host_id: space_profile_id,
      date: 'date',
      time: 'time',
      permanent: 'false',
      comments: 'comments',
      confirmed: false
    }
  }

  let(:event){
    {
      user_id: user_id,
      profile_id: profile_id,
      event_id: event_id,
    }
  }

  before(:each){
    Repos::Events.add(event)
    event.delete(:_id)
  }

  describe 'Add' do

    it 'registers a new event' do
      saved_entry = @db['events'].find({}).first
      expect(saved_entry).to include({
        'user_id' => user_id,
        'event_id' => event_id,
      })
    end

    it 'retrieves the owner of the event' do
      expect(Repos::Events.get_event_owner(event_id)).to eq(user_id)
    end
  end

  describe 'Exists?' do
    it 'checks if matched element is already in any document' do
      expect(Repos::Events.exists? event_id).to eq(true)
      expect(Repos::Events.exists? 'otter').to eq(false)
    end

    it 'checks if performers participate in an event' do
      Repos::Events.add_artist event_id, artist
      expect(Repos::Events.performers_participate? event_id, performance).to eq(false)
      Repos::Events.add_space event_id, space
      expect(Repos::Events.performers_participate? event_id, performance).to eq(true)
    end

    it 'checks if performance and performers exist' do
      Repos::Events.add_artist event_id, artist
      expect(Repos::Events.performance_exists? event_id, performance).to eq(false)
      Repos::Events.add_space event_id, space
      expect(Repos::Events.performance_exists? event_id, performance).to eq(false)
      Repos::Events.add_performance event_id, performance
      expect(Repos::Events.performance_exists? event_id, performance).to eq(true)
    end
  end

  describe 'Add participants' do
    
    it 'adds an artist' do
      Repos::Events.add_artist event_id, artist
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['artists'].first).to include({
        'user_id' => user_id,
        'profile_id' => profile_id,
        'proposals' => [Util.stringify_hash(artist_proposal)]
      })
    end

    it 'adds a space' do
      Repos::Events.add_space event_id, space
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['spaces'].first).to include({
        'user_id' => user_id,
        'profile_id' => space_profile_id,
        'category' => 'category'
      })
    end
  end

  describe 'Add proposals' do

    it 'adds a proposal' do
      Repos::Events.add_artist event_id, artist
      Repos::Events.add_artist_proposal event_id, profile_id, artist_proposal
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['artists'].first).to include({
        'user_id' => user_id,
        'profile_id' => profile_id,
        'proposals' => [Util.stringify_hash(artist_proposal), Util.stringify_hash(artist_proposal)]
      })
    end
  end

  describe 'Performaces' do

    it 'adds a performance' do
      Repos::Events.add_performance event_id, performance
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['program'].first).to include(Util.stringify_hash(performance))
    end

    it 'modifies a performance' do
      Repos::Events.add_performance event_id, performance
      performance[:date] = 'otter_date'
      Repos::Events.modify_performance event_id, performance
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['program'].first).to include(Util.stringify_hash(performance))
    end

    it 'deletes a performance' do
      Repos::Events.add_performance event_id, performance
      Repos::Events.delete_performance event_id, performance_id
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['program']).to eq([])
    end
  end
  # describe 'Get call' do

  #   it 'returns the specified calls' do
  #     call.delete(:_id)
  #     expect(Repos::Calls.get_call call_id).to eq(call)
  #   end

  #   it 'returns the profile calls' do
  #     call.delete(:_id)
  #     expect(Repos::Calls.get_calls profile_id).to eq([call])
  #   end
  # end

  # describe 'Get proposals' do

  #   let(:otter_call){
  #     {
  #       user_id: user_id,
  #       profile_id: profile_id,
  #       call_id: 'otter'
  #     }
  #   }

  #   before(:each){
  #     Repos::Calls.add otter_call
  #     otter_call.delete(:_id)
  #   }

  #   it 'returns all the proposals for a given profile' do
  #     Repos::Calls.add_proposal call_id, proposal
  #     Repos::Calls.add_proposal 'otter', otter_proposal
  #     results = {
  #       calls: [call, otter_call],
  #       proposals: [proposal, otter_proposal],
  #       program: []
  #     }
  #     expect(Repos::Calls.get_proposals(:profile_info, {profile_id: profile_id})).to eq(results)
  #   end

  #   it 'returns all the proposals for a given production' do
  #     Repos::Calls.add_proposal call_id, proposal
  #     Repos::Calls.add_proposal 'otter', otter_proposal

  #     expect(Repos::Calls.get_proposals(:production_proposals, {production_id: production_id})).to eq([proposal])
  #   end

  #   it 'returns interesting info for a visitor of a profile' do
  #     Repos::Calls.add_proposal call_id, proposal
  #     Repos::Calls.add_proposal 'otter', otter_proposal
  #     call[:whitelist] = false
  #     otter_call[:whitelist] = false 
  #     results = {
  #       calls: [call, otter_call],
  #       proposals: ['title', 'otter_title'],
  #       program: []
  #     }
  #     expect(Repos::Calls.get_proposals(:otter_profile_info, {profile_id: profile_id})).to eq(results)
  #   end

  #   it 'retrieves a proposal' do
  #     Repos::Calls.add_proposal call_id, proposal
  #     expect(Repos::Calls.get_proposals(:proposal, {proposal_id: proposal_id})).to eq(proposal)
  #   end
    
  #   it 'retrieves the owner of the proposal' do
  #     Repos::Calls.add_proposal call_id, proposal
  #     expect(Repos::Calls.get_proposal_owner proposal_id).to eq(user_id)
  #   end
  # end

  # describe 'Modify' do

  #   it 'modifies a proposal' do
  #     Repos::Calls.add_proposal call_id, proposal
  #     proposal[:title] = 'otter_title'
  #     Repos::Calls.modify_proposal proposal
  #     results = {
  #       calls: [call],
  #       proposals: [proposal],
  #       program: []
  #     }
  #     expect(Repos::Calls.get_proposals(:profile_info, {profile_id: profile_id})).to eq(results)
  #   end

  #   it 'adds some amend to the proposal' do
  #     Repos::Calls.add_proposal call_id, proposal
  #     Repos::Calls.amend_proposal proposal_id, 'amend'
  #     proposal.merge! amend: 'amend'
  #     results = {
  #       calls: [call],
  #       proposals: [proposal],
  #       program: []
  #     }
  #     expect(Repos::Calls.get_proposals(:profile_info, {profile_id: profile_id})).to eq(results)
  #   end
  # end

  # describe 'Delete' do
  #   it 'deletes a proposal' do
  #     Repos::Calls.add_proposal call_id, proposal
  #     expect(Repos::Calls.get_proposals(:profile_info, {profile_id: profile_id})).to eq({calls: [call], proposals: [proposal], program: []})
  #     Repos::Calls.delete_proposal proposal_id
  #     expect(Repos::Calls.get_proposals(:profile_info, {profile_id: profile_id})).to eq({calls: [call], proposals: [], program: []})
  #   end

  #   it 'removes the proposal from programs' do
  #     Repos::Calls.add_proposal call_id, proposal
  #     Repos::Calls.add_proposal call_id, otter_proposal
  #     Repos::Calls.add_proposal call_id, anotter_proposal
  #     Repos::Calls.add_program event_id, program, order

  #     Repos::Calls.delete_proposal 'otter_proposal'
  #     expect(Repos::Calls.get_call(call_id)[:program]).to eq([{
  #       time: ['3', '6'],
  #       participant_id: profile_id,
  #       participant_proposal_id: proposal_id,
  #       host_id: profile_id,
  #       host_proposal_id: 'anotter_proposal'
  #     }]) 
  #   end
  # end

  # describe 'Whitelist' do
  #   let(:whitelist){
  #     [
  #       {
  #         'email': 'email1'
  #       },
  #       {
  #         'email': 'email2'
  #       },
  #       {
  #         'email': 'email3'
  #       },
  #     ]
  #   }

  #   it 'Stores the whitelist' do
  #     expect(Repos::Calls.get_call(call_id)[:whitelist]).to eq([])
  #     Repos::Calls.add_whitelist call_id, whitelist
  #     expect(Repos::Calls.get_call(call_id)[:whitelist]).to eq(whitelist)
  #   end

  #   it 'Shows if a user is whitelisted or not' do
  #     Repos::Calls.add_whitelist call_id, whitelist
  #     call[:whitelist] = false
  #     results = {
  #       calls: [call],
  #       proposals: [],
  #       program: []
  #     }
  #     expect(Repos::Calls.get_proposals(:otter_profile_info, {profile_id: profile_id, requestor: user_id})).to eq(results)
  #     allow(Repos::Users).to receive(:grab).and_return({email: 'email1'})
  #     call[:whitelist] = true
  #     expect(Repos::Calls.get_proposals(:otter_profile_info, {profile_id: profile_id, requestor: user_id})).to eq(results)
  #   end
  # end

  # describe 'Program' do

  #   let(:retrieved_program){
  #     [
  #       {
  #         :time=>["3", "6"],
  #         :participant_id => profile_id,
  #         :participant_proposal_id => proposal_id,
  #         :host_id => profile_id,
  #         :host_proposal_id => "anotter_proposal",
  #         :host_name => "space_name",
  #         :address => "space_address",
  #         :participant_name => "artist_name",
  #         :title=>"title",
  #         :short_description=>"short_description",
  #         :children=>"true",
  #         :participant_category=>"arts",
  #         :host_category=> 'home', 
  #         :order => 0
  #       },
  #       { 
  #         :time=>["3", "6"],
  #         :participant_id => profile_id,
  #         :participant_proposal_id => "otter_proposal",
  #         :host_id => profile_id,
  #         :host_proposal_id => "anotter_proposal",
  #         :host_name => "space_name",
  #         :address => "space_address",
  #         :participant_name => "otter_name",
  #         :title => "otter_title",
  #         :short_description=> nil,
  #         :children=> nil,
  #         :participant_category=> 'expo',
  #         :host_category => 'home',
  #         :order => 0
  #       }
  #     ]
  #   }

  #   before(:each){
  #     Repos::Calls.add_proposal call_id, proposal
  #     Repos::Calls.add_proposal call_id, otter_proposal
  #     Repos::Calls.add_proposal call_id, anotter_proposal
  #     Repos::Calls.add_program event_id, program, order
  #   }

  #   it 'adds a program to a proposal' do
  #     expect(Repos::Calls.get_call(call_id)[:program]).to eq(program) 
  #   end

  #   it 'retrieves the program' do
  #     expect(Repos::Calls.get_program event_id).to eq(retrieved_program)
  #   end
  # end
end
