describe Repos::Events do

  let(:user_id){'45825599-b8cf-499c-825c-a7134a3f1ff0'}
  let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:space_profile_id){'spe01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:production_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb80'}
  let(:proposal_id){'b11000e7-8f02-4542-a1c9-7f7aa18752ce'}
  let(:space_proposal_id){'b21000e7-8f02-4542-a1c9-7f7aa18752ce'}
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
      email: 'email@test.com',
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
      proposal_id: space_proposal_id,
      email: 'email',
      name: 'space_name',
      address: {
        'locality' => 'locality',
        'postal_code' => 'postal_code'
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
      host_proposal_id: space_proposal_id,
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
      call_id: call_id,
      name: 'event_name',
      artists: [],
      spaces: [],
      program: [],
      whitelist: [],
      start: '1462053600',
      deadline: '1466028000',
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

    it 'checks if a proposal exists' do
      expect(Repos::Events.proposal_exists? proposal_id).to eq(false)
      expect(Repos::Events.proposal_exists? space_proposal_id).to eq(false)
      Repos::Events.add_artist event_id, artist
      expect(Repos::Events.proposal_exists? proposal_id).to eq(true)
      Repos::Events.add_space event_id, space
      expect(Repos::Events.proposal_exists? space_proposal_id).to eq(true)
    end

    it 'gets the owner of an artist proposal' do
      Repos::Events.add_artist event_id, artist
      expect(Repos::Events.get_artist_proposal_owner proposal_id).to eq(user_id)
    end

    it 'gets the owner of a space proposal' do
      Repos::Events.add_space event_id, space
      expect(Repos::Events.get_space_proposal_owner space_proposal_id).to eq(user_id)
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

    it 'adds a proposal to an exisiting artist' do
      Repos::Events.add_artist event_id, artist
      Repos::Events.add_artist event_id, artist
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['artists'].first).to include({
        'user_id' => user_id,
        'profile_id' => profile_id,
        'proposals' => [Util.stringify_hash(artist_proposal), Util.stringify_hash(artist_proposal)]
      })
    end

    it 'checks deadline' do
      expect(Repos::Events.proposal_on_time? event_id, 'otter').to eq(false)
      allow(Time).to receive(:now).and_return(1462053601)
      expect(Repos::Events.proposal_on_time? event_id, 'otter').to eq(true)
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

    it 'adds a space only once' do
      Repos::Events.add_space event_id, space
      space[:category] == 'otter'
      Repos::Events.add_space event_id, space
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['spaces'].first).to include({
        'user_id' => user_id,
        'profile_id' => space_profile_id,
        'category' => 'category'
      })
    end

    it 'retrieves my artist proposals' do
      Repos::Events.add_artist event_id, artist
      artist_proposal[:event_id] = event_id
      artist_proposal[:event_name] = 'event_name'
      artist_proposal[:call_id] = call_id
      artist_proposal[:deadline] = event[:deadline]
      expect(Repos::Events.my_artist_proposals profile_id).to eq([artist_proposal])
    end

    it 'retrieves my space proposals' do
      Repos::Events.add_space event_id, space
      space[:event_id] = event_id
      space[:event_name] = 'event_name'
      space[:call_id] = call_id
      space[:deadline] = event[:deadline]
      expect(Repos::Events.my_space_proposals space_profile_id).to eq([space])
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

  describe 'Modify' do

    before(:each){
      Repos::Events.add_artist event_id, artist
      Repos::Events.add_space event_id, space
    }

    it 'updates an artist' do
      artist[:name] = 'otter_name'
      Repos::Events.update_artist artist
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['artists'].first).to include({
        'user_id' => user_id,
        'profile_id' => profile_id,
        'name' => 'otter_name'
      })
    end

    it 'updates an space' do
      space[:description] = 'otter_description'
      Repos::Events.update_space space
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['spaces'].first).to include({
        'user_id' => user_id,
        'profile_id' => space_profile_id,
        'description' => 'otter_description'
      })
    end

    it 'modifies an artist proposal' do
      artist_proposal[:title] = 'otter_title'
      Repos::Events.modify_artist artist
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['artists'].first).to include({
        'user_id' => user_id,
        'profile_id' => profile_id,
        'proposals' => [Util.stringify_hash(artist_proposal)]
      })
    end

    it 'modifies a space proposal' do
      space[:phone] = 'otter_phone'
      Repos::Events.modify_space space
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['spaces'].first).to include({
        'user_id' => user_id,
        'profile_id' => space_profile_id,
        'phone' => 'otter_phone'
      })
    end

    it 'adds some amend to the artist proposal' do
      artist[:profile_id] = 'otter'
      Repos::Events.add_artist event_id, artist
      Repos::Events.amend_artist proposal_id, 'amend'
      artist_proposal.merge! amend: 'amend'
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['artists'].first).to include({
        'user_id' => user_id,
        'profile_id' => profile_id,
        'proposals' => [Util.stringify_hash(artist_proposal)]
      })
    end

    it 'adds some amend to the space proposal' do
      Repos::Events.amend_space space_proposal_id, 'amend'
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['spaces'].first).to include({
        'user_id' => user_id,
        'profile_id' => space_profile_id,
        'amend' => 'amend'
      })
    end
  end

  describe 'Whitelist' do
    it 'Stores the whitelist' do
      expect(Repos::Events.get_event(event_id)[:whitelist]).to eq([])
      Repos::Events.add_whitelist event_id, ['walter@white']
      expect(Repos::Events.get_event(event_id)[:whitelist]).to eq(['walter@white'])
    end

    it 'allows whitelisted or owner' do
      expect(Repos::Events.proposal_on_time? event_id, 'otter').to eq(false)
      expect(Repos::Events.proposal_on_time? event_id, user_id).to eq(true)
      Repos::Events.add_whitelist event_id, ['walter@white']
      allow(Repos::Users).to receive(:grab).with({user_id: 'otter_user'}).and_return({email: 'walter@white'})
      expect(Repos::Events.proposal_on_time? event_id, 'otter_user').to eq(true)
    end
  end
  
  describe 'Delete' do
    before(:each){
      Repos::Events.add_artist event_id, artist
      Repos::Events.add_space event_id, space
    }

    it 'deletes an artist proposal' do
      artist_proposal[:proposal_id] = 'otter'
      Repos::Events.add_artist event_id, artist
      Repos::Events.delete_artist_proposal proposal_id
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['artists'].first).to include({
        'user_id' => user_id,
        'profile_id' => profile_id,
        'proposals' => [Util.stringify_hash(artist_proposal)]
      })
    end

    it 'deletes an artist if last proposal' do
      Repos::Events.delete_artist_proposal proposal_id
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['artists']).to eq([])
    end

    it 'deletes a space proposal' do
      Repos::Events.delete_space_proposal space_proposal_id
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['spaces']).to eq([])
    end

    it 'removes the artist_proposal from programs' do
      Repos::Events.add_performance event_id, performance
      Repos::Events.delete_artist_proposal proposal_id
      expect(Repos::Events.get_program(event_id)).to eq([]) 
    end

    it 'removes the space_proposal from programs' do
      Repos::Events.add_performance event_id, performance
      Repos::Events.delete_space_proposal space_proposal_id
      expect(Repos::Events.get_program(event_id)).to eq([]) 
    end
  end


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
