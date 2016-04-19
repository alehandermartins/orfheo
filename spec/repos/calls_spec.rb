describe Repos::Calls do

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
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

  describe 'Find proposals' do

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

      expect(Repos::Calls.get_proposals_for profile_id).to eq([proposal, otter_proposal])
    end

    it 'returns all the proposals for a given production' do
      Repos::Calls.add({
        user_id: user_id,
        call_id: 'otter'
      })

      Repos::Calls.add_proposal call_id, proposal
      Repos::Calls.add_proposal 'otter', otter_proposal

      expect(Repos::Calls.get_proposals_for_production production_id).to eq([proposal])
    end

    it 'returns interesting info for a visitor of a profile' do
      Repos::Calls.add({
        user_id: user_id,
        call_id: 'otter'
      })

      Repos::Calls.add_proposal call_id, proposal
      Repos::Calls.add_proposal 'otter', otter_proposal

      expect(Repos::Calls.get_otter_proposals_for profile_id, 'artist').to eq(['title', 'otter_title'])
    end

    it 'retrieves a proposal' do
      Repos::Calls.add_proposal call_id, proposal
      expect(Repos::Calls.get_proposal proposal_id).to eq(proposal)
    end
    
    it 'retrieves the owner of the proposal' do
      Repos::Calls.add_proposal call_id, proposal
      expect(Repos::Calls.get_proposal_owner proposal_id).to eq(user_id)
    end
  end

  describe 'Proposals old pictures' do
    it 'returns all the proposal pictures for a given production' do
      Repos::Calls.add({
        user_id: user_id,
        call_id: 'otter'
      })

      Repos::Calls.add_proposal call_id, proposal
      otter_proposal.merge! production_id: production_id
      Repos::Calls.add_proposal 'otter', otter_proposal
      expect(Services::Calls.proposals_old_pictures production_id).to eq({photos: ['picture.jpg', 'otter_picture.jpg', 'otter_photo']})
    end
  end
  
  describe 'Amend' do
    it 'adds some amend to the proposal' do
      Repos::Calls.add_proposal call_id, proposal
      Repos::Calls.amend_proposal proposal_id, 'amend'
      proposal.merge! amend: 'amend'
      expect(Repos::Calls.get_proposals_for profile_id).to eq([proposal])
    end
  end

  describe 'Delete' do
    it 'deletes a proposal' do
      Repos::Calls.add_proposal call_id, proposal
      expect(Repos::Calls.get_proposals_for profile_id).to eq([proposal])
      Repos::Calls.delete_proposal proposal_id
      expect(Repos::Calls.get_proposals_for profile_id).to eq([])
    end
  end
end
