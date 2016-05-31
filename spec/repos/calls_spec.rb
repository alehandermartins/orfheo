describe Repos::Calls do

  let(:user_id){'45825599-b8cf-499c-825c-a7134a3f1ff0'}
  let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:production_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb80'}
  let(:proposal_id){'b11000e7-8f02-4542-a1c9-7f7aa18752ce'}
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
      category: 'categoty',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      photos: ['picture.jpg', 'otter_picture.jpg'],
      links: 'links',
      duration: 'duration',
      children: 'children',
    }
  }

  let(:otter_proposal){
    {
      profile_id: profile_id,
      proposal_id: 'otter_proposal',
      title: 'otter_title',
      links: [{link: 'web', web_title: 'web_name'},{link: 'otter_web', web_title: 'otter_web_name'}],
      photos: ['otter_photo']
    }
  }

  let(:program){[
      {
        proposal_id: proposal_id,
        program: [{day_time: 'date', place: 'space', proposal_id: 'otter_proposal'}, {day_time: 'anotter_date', place: 'anotter_space', proposal_id: 'anotter_proposal'}] 
      },
      {
        proposal_id: 'otter_proposal',
        program: [{day_time: 'otter_date', place: 'otter_space', proposal_id: proposal_id}] 
      },
    ]}

  let(:call){
    {
      user_id: user_id,
      call_id: call_id
    }
  }

  before(:each){
    Repos::Calls.add(call)
  }

  describe 'Add' do

    it 'registers a new call' do
      saved_entry = @db['calls'].find_one()
      expect(saved_entry).to include({
        'user_id' => user_id,
        'call_id' => call_id,
      })
    end

    it 'retrieves the owner of the call' do
      expect(Repos::Calls.get_call_owner(call_id)).to eq(user_id)
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
  end

  describe 'Push' do

    it 'adds a proposal to the array of proposals' do
      Repos::Calls.add_proposal call_id, proposal

      saved_entry = @db['calls'].find_one()
      expect(saved_entry).to include({
        'user_id' => user_id,
        'call_id' => call_id,
        'proposals' => [Util.stringify_hash(proposal)]
      })
    end
  end

  describe 'Get call' do

    it 'returns the specified calls' do
      call.delete(:_id)
      expect(Repos::Calls.get_call call_id).to eq(call)
    end

    it 'returns the user calls' do
      expect(Repos::Calls.get_user_calls user_id).to eq([call_id])
    end
  end

  describe 'Get proposals' do

    let(:otter_proposal){
      {
        profile_id: profile_id,
        proposal_id: 'otter_proposal',
        title: 'otter_title',
        links: [{link: 'web', web_title: 'web_name'},{link: 'otter_web', web_title: 'otter_web_name'}]
      }
    }

    it 'returns all the proposals for a given profile' do
      Repos::Calls.add({
        user_id: user_id,
        call_id: 'otter'
      })

      Repos::Calls.add_proposal call_id, proposal
      Repos::Calls.add_proposal 'otter', otter_proposal

      expect(Repos::Calls.get_proposals(:profile_proposals, {profile_id: profile_id})).to eq([proposal, otter_proposal])
    end

    it 'returns all the proposals for a given production' do
      Repos::Calls.add({
        user_id: user_id,
        call_id: 'otter'
      })

      Repos::Calls.add_proposal call_id, proposal
      Repos::Calls.add_proposal 'otter', otter_proposal

      expect(Repos::Calls.get_proposals(:production_proposals, {production_id: production_id})).to eq([proposal])
    end

    it 'returns interesting info for a visitor of a profile' do
      Repos::Calls.add({
        user_id: user_id,
        call_id: 'otter'
      })

      Repos::Calls.add_proposal call_id, proposal
      Repos::Calls.add_proposal 'otter', otter_proposal

      expect(Repos::Calls.get_proposals(:otter_profile_proposals, {profile_id: profile_id, type: 'artist'})).to eq(['title', 'otter_title'])
    end

    it 'retrieves a proposal' do
      Repos::Calls.add_proposal call_id, proposal
      expect(Repos::Calls.get_proposals(:proposal, {proposal_id: proposal_id})).to eq(proposal)
    end
    
    it 'retrieves the owner of the proposal' do
      Repos::Calls.add_proposal call_id, proposal
      expect(Repos::Calls.get_proposal_owner proposal_id).to eq(user_id)
    end

    it 'does not include sensitive info' do
      proposal[:email] = 'email'
      Repos::Calls.add_proposal call_id, proposal
      expect(Repos::Calls.get_proposals(:proposal, {proposal_id: proposal_id})).not_to include(email: 'email')
    end
  end

  describe 'Amend' do
    it 'adds some amend to the proposal' do
      Repos::Calls.add_proposal call_id, proposal
      Repos::Calls.amend_proposal proposal_id, 'amend'
      proposal.merge! amend: 'amend'
      expect(Repos::Calls.get_proposals(:profile_proposals, {profile_id: profile_id})).to eq([proposal])
    end
  end

  describe 'Delete' do
    it 'deletes a proposal' do
      Repos::Calls.add_proposal call_id, proposal
      expect(Repos::Calls.get_proposals(:profile_proposals, {profile_id: profile_id})).to eq([proposal])
      Repos::Calls.delete_proposal proposal_id
      expect(Repos::Calls.get_proposals(:profile_proposals, {profile_id: profile_id})).to eq([])
    end

    it 'removes the proposal from programs' do
      Repos::Calls.add_proposal call_id, proposal
      Repos::Calls.add_proposal call_id, otter_proposal
      Repos::Calls.add_program call_id, program
      Repos::Calls.delete_proposal 'otter_proposal'
      proposal.merge! program: [{day_time: 'anotter_date', place: 'anotter_space', proposal_id: 'anotter_proposal'}]
      expect(Repos::Calls.get_proposals(:profile_proposals, {profile_id: profile_id})).to eq([proposal])
    end
  end

  describe 'Program' do

    let(:program){[
      {
        proposal_id: proposal_id,
        program: [{day_time: 'date', place: 'space'}] 
      },
      {
        proposal_id: 'otter_proposal',
        program: [{day_time: 'otter_date', place: 'otter_space'}] 
      },
    ]}

    it 'adds a program to a proposal' do
      Repos::Calls.add_proposal call_id, proposal
      Repos::Calls.add_proposal call_id, otter_proposal
      Repos::Calls.add_program call_id, program
      expect(Repos::Calls.get_proposals(:proposal, {proposal_id: proposal_id})).to include(program: program[0][:program])
      expect(Repos::Calls.get_proposals(:proposal, {proposal_id: 'otter_proposal'})).to include(program: program[1][:program])
    end
  end
end
