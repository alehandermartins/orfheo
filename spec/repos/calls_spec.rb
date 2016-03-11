describe Repos::Calls do

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
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
      profile_id: profile_id,
      proposal_id: proposal_id,
      category: 'categoty',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      photos: ['picture.jpg', 'otter_picture.jpg'],
      links: 'links',
      duration: 'duration',
      children: 'children'
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
        title: 'otter_title'
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
  end
end
