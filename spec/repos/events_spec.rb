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

  let(:otter_space){
    {
      user_id: user_id,
      profile_id: 'otter_space_id',
      proposal_id: 'otter_space_proposal_id',
      email: 'email',
      name: 'otter_space_name',
      address: {
        'locality' => 'locality',
        'postal_code' => 'postal_code'
      },
      phone: 'phone',
      category: 'category'
    }
  }

  let(:space_artist){
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
      proposals: [{
      proposal_id: 'space_artist_proposal_id',
      category: 'music',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      duration: 'duration',
      children: 'true'
    }]
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

  let(:otter_performance){
    {
      performance_id: 'otter_performance',
      participant_id: profile_id,
      participant_proposal_id: 'otter_proposal_id',
      host_id: 'otter_space_id',
      host_proposal_id: 'otter_space_proposal_id',
      date: 'date',
      time: 'time',
      permanent: 'false',
      comments: 'comments',
      confirmed: true
    }
  }

  let(:program){
    [performance, otter_performance]
  }

  let(:event){
    {
      user_id: user_id,
      profile_id: profile_id,
      event_id: event_id,
      call_id: call_id,
      name: 'event_name',
      eventTime:{
        '2017-03-30': [],
        '2017-04-29': [],
        '2017-05-29': [],
        'permanent': []
      },
      artists: [],
      spaces: [],
      program: [],
      whitelist: [],
      start: '1462053600',
      deadline: '1466028000',
      published: false
    }
  }

  let(:otter_event){
    {
      user_id: user_id,
      profile_id: profile_id,
      event_id: 'otter_event_id',
      call_id: call_id,
      name: 'event_name',
      eventTime:{
        '2017-03-30': [],
        '2017-04-29': [],
        '2017-05-29': [],
        'permanent': []
      },
      artists: [],
      spaces: [],
      program: [],
      whitelist: [],
      start: '1462053600',
      deadline: '1466028000',
      published: false
    }
  }

  before(:each){
    @db['events'].insert_one(event)
    @db['events'].insert_one(otter_event)
    event.delete(:_id)
  }

  describe 'Add' do

    it 'retrieves the owner of the event' do
      expect(Repos::Events.get_event_owner(event_id)).to eq(user_id)
    end

    it 'retrieves the event' do
      expect(Repos::Events.get_event event_id).to include({
        user_id: user_id,
        event_id: event_id,
      })
    end
  end

  describe 'Exists?' do
    it 'checks if matched element is already in any document' do
      expect(Repos::Events.exists? event_id).to eq(true)
      expect(Repos::Events.exists? 'otter').to eq(false)
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

    # it 'retrieves my artist proposals' do
    #   Repos::Events.add_artist event_id, artist
    #   artist_proposal[:event_id] = event_id
    #   artist_proposal[:event_name] = 'event_name'
    #   artist_proposal[:call_id] = call_id
    #   artist_proposal[:deadline] = event[:deadline]
    #   expect(Repos::Events.my_artist_proposals profile_id).to eq([artist_proposal])
    # end

    # it 'retrieves my space proposals' do
    #   Repos::Events.add_space event_id, space
    #   space[:event_id] = event_id
    #   space[:event_name] = 'event_name'
    #   space[:call_id] = call_id
    #   space[:deadline] = event[:deadline]
    #   expect(Repos::Events.my_space_proposals space_profile_id).to eq([space])
    # end

    # it 'retrieves my program' do
    #   Repos::Events.add_artist event_id, artist
    #   Repos::Events.add_space event_id, space
    #   Repos::Events.add_performance event_id, performance
    #   expect(Repos::Events.my_program(profile_id).first).to include({
    #     event_id: event_id,
    #     event_name: 'event_name',
    #     date: '2017-05-29',
    #     })
    # end
  end

  describe 'Program' do

    it 'saves a program' do
      Repos::Events.save_program event_id,program
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['program']).to eq(Util.stringify_array(program))
    end
  end

  describe 'Modify' do

    before(:each){
      Repos::Events.add_artist event_id, artist
      Repos::Events.add_artist 'otter_event_id', artist
      Repos::Events.add_space event_id, space
      Repos::Events.add_space 'otter_event_id', space
      Repos::Events.add_artist event_id, space_artist
      Repos::Events.add_artist 'otter_event_id', space_artist
    }

    it 'updates an artist' do
      artist[:name] = 'otter_name'
      Repos::Events.update artist
      saved_entry = @db['events'].find({}).map{|event| event}
      expect(saved_entry[0]['artists'].first).to include({
        'user_id' => user_id,
        'profile_id' => profile_id,
        'name' => 'otter_name'
      })
      expect(saved_entry[1]['artists'].first).to include({
        'user_id' => user_id,
        'profile_id' => profile_id,
        'name' => 'otter_name'
      })
    end

    it 'updates an space' do
      space[:name] = 'otter_name'
      Repos::Events.update space
      saved_entry = @db['events'].find({}).map{|event| event}
      expect(saved_entry[0]['spaces'].first).to include({
        'user_id' => user_id,
        'profile_id' => space_profile_id,
        'name' => 'otter_name'
      })
      expect(saved_entry[0]['artists'][1]).to include({
        'user_id' => user_id,
        'profile_id' => space_profile_id,
        'name' => 'otter_name'
      })
      expect(saved_entry[1]['spaces'].first).to include({
        'user_id' => user_id,
        'profile_id' => space_profile_id,
        'name' => 'otter_name'
      })
      expect(saved_entry[1]['artists'][1]).to include({
        'user_id' => user_id,
        'profile_id' => space_profile_id,
        'name' => 'otter_name'
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
      expect(saved_entry['artists'][1]).to include({
        'user_id' => user_id,
        'profile_id' => space_profile_id,
        'phone' => 'otter_phone'
      })
    end

    it 'modifies an artist_space proposal' do
      space_artist[:phone] = 'otter_phone'
      Repos::Events.modify_artist space_artist
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['spaces'].first).to include({
        'user_id' => user_id,
        'profile_id' => space_profile_id,
        'phone' => 'otter_phone'
      })
      expect(saved_entry['artists'][1]).to include({
        'user_id' => user_id,
        'profile_id' => space_profile_id,
        'phone' => 'otter_phone'
      })
    end
  end

  describe 'Delete' do
    before(:each){
      Repos::Events.add_artist event_id, artist
      Repos::Events.add_artist 'otter_event_id', artist
      Repos::Events.add_space event_id, space
      Repos::Events.add_space 'otter_event_id', space
      Repos::Events.add_space event_id, otter_space
      Repos::Events.save_program event_id, program
    }

    it 'deletes an artist proposal' do
      artist_proposal[:proposal_id] = 'otter_proposal_id'
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
      expect(saved_entry['spaces']).to eq([Util.stringify_hash(otter_space)])
    end

    it 'removes the artist_proposal from programs' do
      Repos::Events.delete_artist_proposal proposal_id
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['program']).to eq([Util.stringify_hash(otter_performance)])
      Repos::Events.delete_space_proposal 'otter_space_proposal_id'
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['program']).to eq([])
    end

    it 'removes the space_proposal from programs' do
      artist_proposal[:proposal_id] = 'otter_proposal_id'
      Repos::Events.add_artist event_id, artist
      Repos::Events.delete_space_proposal space_proposal_id
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['program']).to eq([Util.stringify_hash(otter_performance)])
      Repos::Events.delete_artist_proposal 'otter_proposal_id'
      saved_entry = @db['events'].find({}).first
      expect(saved_entry['program']).to eq([])
    end

    it 'turns artist profiles into own if profile is deleted' do
      Repos::Events.delete_profile profile_id
      saved_entry = @db['events'].find({}).map{|event| event}
      expect(saved_entry[0]['artists'].first).to include({"own"=> "true"})
      expect(saved_entry[1]['artists'].first).to include({"own"=> "true"})
    end

    it 'turns space profiles into own if profile is deleted' do
      Repos::Events.add_artist event_id, space_artist
      Repos::Events.delete_profile space_profile_id
      saved_entry = @db['events'].find({}).map{|event| event}
      expect(saved_entry[0]['spaces'].first).to include({"own"=> "true"})
      expect(saved_entry[0]['artists'][1]).to include({"own"=> "true"})
      expect(saved_entry[1]['spaces'].first).to include({"own"=> "true"})
    end
  end

  describe 'Whitelist' do
    it 'Stores the whitelist' do
      expect(Repos::Events.get_event(event_id)[:whitelist]).to eq([])
      Repos::Events.add_whitelist event_id, ['walter@white']
      expect(Repos::Events.get_event(event_id)[:whitelist]).to eq(['walter@white'])
    end
  end

  describe 'Publish' do
    it 'publishes an event' do
      Repos::Events.publish event_id
      expect(Repos::Events.get_event(event_id)[:published]).to eq(true)
    end

    it 'unpublishes an event' do
      Repos::Events.publish event_id
      Repos::Events.publish event_id
      expect(Repos::Events.get_event(event_id)[:published]).to eq(false)
    end
  end
end