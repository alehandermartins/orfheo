describe Repos::Calls do

  let(:user_id){'45825599-b8cf-499c-825c-a7134a3f1ff0'}
  let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:production_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb80'}
  let(:proposal_id){'b11000e7-8f02-4542-a1c9-7f7aa18752ce'}
  let(:event_id){'a5bc4203-9379-4de0-856a-55e1e5f3fac6'}
  let(:call_id){'b5bc4203-9379-4de0-856a-55e1e5f3fac6'}

  let(:profile){
    {
      user_id: user_id,
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
      user_id: user_id,
      profile_id: profile_id,
      production_id: production_id,
      proposal_id: proposal_id,
      type: 'artist',
      name: 'artist_name',
      category: 'arts',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      photos: ['picture.jpg', 'otter_picture.jpg'],
      links: 'links',
      duration: 'duration',
      children: 'true',
    }
  }

  let(:otter_proposal){
    {
      profile_id: profile_id,
      proposal_id: 'otter_proposal',
      type: 'artist',
      category: 'expo',
      name: 'otter_name',
      title: 'otter_title',
      links: [{link: 'web', web_title: 'web_name'},{link: 'otter_web', web_title: 'otter_web_name'}],
      photos: ['otter_photo']
    }
  }

  let(:anotter_proposal){
    {
      profile_id: profile_id,
      proposal_id: 'anotter_proposal',
      type: 'space',
      category: 'home',
      address: 'space_address',
      name: 'space_name',
      links: [{link: 'web', web_title: 'web_name'},{link: 'otter_web', web_title: 'otter_web_name'}],
      photos: ['otter_photo']
    }
  }

  let(:program){[
    {
      time: ['3', '6'],
      participant_id: profile_id,
      participant_proposal_id: proposal_id,
      host_id: profile_id,
      host_proposal_id: 'anotter_proposal'
    },
    {
      time: ['3', '6'],
      participant_id: profile_id,
      participant_proposal_id: 'otter_proposal',
      host_id: profile_id,
      host_proposal_id: 'anotter_proposal'
    }
  ]}

  let(:order){
    ['anotter_proposal']
  }

  let(:call){
    {
      user_id: user_id,
      profile_id: profile_id,
      event_id: event_id,
      call_id: call_id,
      start: '1462053600',
      deadline: '1466028000',
      whitelist: [],
      order: []
    }
  }

  before(:each){
    Repos::Calls.add(call)
    call.delete(:_id)
  }

  describe 'Add' do

    it 'registers a new call' do
      saved_entry = @db['calls'].find({}).first
      expect(saved_entry).to include({
        'user_id' => user_id,
        'call_id' => call_id,
      })
    end

    it 'retrieves the owner of the call' do
      expect(Repos::Calls.get_call_owner(call_id)).to eq(user_id)
    end

    it 'retrieves the owner of the event' do
      expect(Repos::Calls.get_event_owner(event_id)).to eq(user_id)
    end
  end

  describe 'Exists?' do
    it 'checks if matched element is already in any document' do
      expect(Repos::Calls.exists? call_id).to eq(true)
      expect(Repos::Calls.exists? 'otter').to eq(false)
    end

    it 'checks if matched proposal is already in a call' do
      expect(Repos::Calls.proposal_exists?('otter_proposal')).to eq(false)
      Repos::Calls.add_proposal(call_id, proposal)
      expect(Repos::Calls.proposal_exists?(proposal_id)).to eq(true)
    end

    it 'checks if matched event is already in any document' do
      expect(Repos::Calls.event_exists? event_id).to eq(true)
      expect(Repos::Calls.event_exists? 'otter').to eq(false)
    end
  end

  describe 'Push' do

    it 'adds a proposal to the array of proposals' do
      Repos::Calls.add_proposal call_id, proposal

      saved_entry = @db['calls'].find({}).first
      expect(saved_entry).to include({
        'user_id' => user_id,
        'call_id' => call_id,
        'proposals' => [Util.stringify_hash(proposal)]
      })
    end
  end

  describe 'Proposal on time?' do

    it 'checks whitelist and if a proposal is on time' do
      allow(Time).to receive(:now).and_return(0)
      Repos::Calls.add_whitelist call_id, ['email']
      expect(Repos::Calls.proposal_on_time? call_id, 'otter_email').to eq(false)
      expect(Repos::Calls.proposal_on_time? call_id, 'email').to eq(true)
      allow(Time).to receive(:now).and_return(1462053601)
      expect(Repos::Calls.proposal_on_time? call_id, 'otter_email').to eq(true)
      expect(Repos::Calls.proposal_on_time? call_id, 'email').to eq(true)
    end 
  end

  describe 'Get call' do

    it 'returns the specified calls' do
      call.delete(:_id)
      expect(Repos::Calls.get_call call_id).to eq(call)
    end

    it 'returns the profile calls' do
      call.delete(:_id)
      expect(Repos::Calls.get_calls profile_id).to eq([call])
    end
  end

  describe 'Get proposals' do

    let(:otter_call){
      {
        user_id: user_id,
        profile_id: profile_id,
        call_id: 'otter'
      }
    }

    before(:each){
      Repos::Calls.add otter_call
      otter_call.delete(:_id)
    }

    it 'returns all the proposals for a given profile' do
      Repos::Calls.add_proposal call_id, proposal
      Repos::Calls.add_proposal 'otter', otter_proposal
      results = {
        calls: [call, otter_call],
        proposals: [proposal, otter_proposal],
        program: []
      }
      expect(Repos::Calls.get_proposals(:profile_info, {profile_id: profile_id})).to eq(results)
    end

    it 'returns all the proposals for a given production' do
      Repos::Calls.add_proposal call_id, proposal
      Repos::Calls.add_proposal 'otter', otter_proposal

      expect(Repos::Calls.get_proposals(:production_proposals, {production_id: production_id})).to eq([proposal])
    end

    it 'returns interesting info for a visitor of a profile' do
      Repos::Calls.add_proposal call_id, proposal
      Repos::Calls.add_proposal 'otter', otter_proposal
      call[:whitelist] = false
      otter_call[:whitelist] = false 
      results = {
        calls: [call, otter_call],
        proposals: ['title', 'otter_title'],
        program: []
      }
      expect(Repos::Calls.get_proposals(:otter_profile_info, {profile_id: profile_id})).to eq(results)
    end

    it 'retrieves a proposal' do
      Repos::Calls.add_proposal call_id, proposal
      expect(Repos::Calls.get_proposals(:proposal, {proposal_id: proposal_id})).to eq(proposal)
    end
    
    it 'retrieves the owner of the proposal' do
      Repos::Calls.add_proposal call_id, proposal
      expect(Repos::Calls.get_proposal_owner proposal_id).to eq(user_id)
    end
  end

  describe 'Modify' do

    it 'modifies a proposal' do
      Repos::Calls.add_proposal call_id, proposal
      proposal[:title] = 'otter_title'
      Repos::Calls.modify_proposal proposal
      results = {
        calls: [call],
        proposals: [proposal],
        program: []
      }
      expect(Repos::Calls.get_proposals(:profile_info, {profile_id: profile_id})).to eq(results)
    end

    it 'adds some amend to the proposal' do
      Repos::Calls.add_proposal call_id, proposal
      Repos::Calls.amend_proposal proposal_id, 'amend'
      proposal.merge! amend: 'amend'
      results = {
        calls: [call],
        proposals: [proposal],
        program: []
      }
      expect(Repos::Calls.get_proposals(:profile_info, {profile_id: profile_id})).to eq(results)
    end
  end

  describe 'Delete' do
    it 'deletes a proposal' do
      Repos::Calls.add_proposal call_id, proposal
      expect(Repos::Calls.get_proposals(:profile_info, {profile_id: profile_id})).to eq({calls: [call], proposals: [proposal], program: []})
      Repos::Calls.delete_proposal proposal_id
      expect(Repos::Calls.get_proposals(:profile_info, {profile_id: profile_id})).to eq({calls: [call], proposals: [], program: []})
    end

    it 'removes the proposal from programs' do
      Repos::Calls.add_proposal call_id, proposal
      Repos::Calls.add_proposal call_id, otter_proposal
      Repos::Calls.add_proposal call_id, anotter_proposal
      Repos::Calls.add_program event_id, program, order

      Repos::Calls.delete_proposal 'otter_proposal'
      expect(Repos::Calls.get_call(call_id)[:program]).to eq([{
        time: ['3', '6'],
        participant_id: profile_id,
        participant_proposal_id: proposal_id,
        host_id: profile_id,
        host_proposal_id: 'anotter_proposal'
      }]) 
    end
  end

  describe 'Whitelist' do
    let(:whitelist){
      [
        {
          'email': 'email1'
        },
        {
          'email': 'email2'
        },
        {
          'email': 'email3'
        },
      ]
    }

    it 'Stores the whitelist' do
      expect(Repos::Calls.get_call(call_id)[:whitelist]).to eq([])
      Repos::Calls.add_whitelist call_id, whitelist
      expect(Repos::Calls.get_call(call_id)[:whitelist]).to eq(whitelist)
    end

    it 'Shows if a user is whitelisted or not' do
      Repos::Calls.add_whitelist call_id, whitelist
      call[:whitelist] = false
      results = {
        calls: [call],
        proposals: [],
        program: []
      }
      expect(Repos::Calls.get_proposals(:otter_profile_info, {profile_id: profile_id, requestor: user_id})).to eq(results)
      allow(Repos::Users).to receive(:grab).and_return({email: 'email1'})
      call[:whitelist] = true
      expect(Repos::Calls.get_proposals(:otter_profile_info, {profile_id: profile_id, requestor: user_id})).to eq(results)
    end
  end

  describe 'Program' do

    let(:retrieved_program){
      [
        {
          :time=>["3", "6"],
          :participant_id => profile_id,
          :participant_proposal_id => proposal_id,
          :host_id => profile_id,
          :host_proposal_id => "anotter_proposal",
          :host_name => "space_name",
          :address => "space_address",
          :participant_name => "artist_name",
          :title=>"title",
          :short_description=>"short_description",
          :children=>"true",
          :participant_category=>"arts",
          :host_category=> 'home', 
          :order => 0
        },
        { 
          :time=>["3", "6"],
          :participant_id => profile_id,
          :participant_proposal_id => "otter_proposal",
          :host_id => profile_id,
          :host_proposal_id => "anotter_proposal",
          :host_name => "space_name",
          :address => "space_address",
          :participant_name => "otter_name",
          :title => "otter_title",
          :short_description=> nil,
          :children=> nil,
          :participant_category=> 'expo',
          :host_category => 'home',
          :order => 0
        }
      ]
    }

    before(:each){
      Repos::Calls.add_proposal call_id, proposal
      Repos::Calls.add_proposal call_id, otter_proposal
      Repos::Calls.add_proposal call_id, anotter_proposal
      Repos::Calls.add_program event_id, program, order
    }

    it 'adds a program to a proposal' do
      expect(Repos::Calls.get_call(call_id)[:program]).to eq(program) 
    end

    it 'retrieves the program' do
      expect(Repos::Calls.get_program event_id).to eq(retrieved_program)
    end
  end
end
