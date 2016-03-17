describe Repos::Profiles do

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:proposal_id){'b11000e7-8f02-4542-a1c9-7f7aa18752ce'}

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

  before(:each){
    Repos::Profiles.update(profile)
    profile.delete(:_id)
  }

  describe 'Create and modify' do

    it 'registers a new profile' do
      saved_entry = @db['profiles'].find_one()
      expect(saved_entry).to include({
        'user_id' => user_id,
        'profile_id' => profile_id,
        'type' => 'artist',
        'name' => 'artist_name',
      })
    end

    it 'modifies a parameter' do
      Repos::Profiles.update({profile_id: profile_id, name: 'otter_name'})
      saved_entry = @db['profiles'].find_one()
      expect(saved_entry).to include({
        'profile_id' => profile_id,
        'name' => 'otter_name'
      })
    end

    it 'checks if a name is availabe' do
      expect(Repos::Profiles.name_available? 'artist_name', 'otter_id').to eq(false)
      expect(Repos::Profiles.name_available? 'otter_name', 'otter_id').to eq(true)
    end
  end

  describe 'Proposals' do

    let(:otter_proposal){
      {
        proposal_id: 'otter_proposal',
        title: 'otter_title'
      }
    }

    let(:modified_proposal){
      {
        proposal_id: proposal_id,
        title: 'otter_title'
      }
    }

    it 'adds a proposal to the array of proposals' do
      Repos::Profiles.add_proposal(profile_id, proposal)

      saved_entry = @db['profiles'].find_one()
      expect(saved_entry).to include({
        'user_id' => user_id,
        'profile_id' => profile_id,
        'type' => 'artist',
        'name' => 'artist_name',
        'proposals' => [Util.stringify_hash(proposal)]
      })
    end

    it 'modifies a proposal' do
      Repos::Profiles.add_proposal(profile_id, proposal)
      Repos::Profiles.add_proposal(profile_id, otter_proposal)
      Repos::Profiles.modify_proposal(modified_proposal)

      saved_entry = @db['profiles'].find_one()
      expect(saved_entry).to include({
        'user_id' => user_id,
        'profile_id' => profile_id,
        'type' => 'artist',
        'name' => 'artist_name',
        'proposals' => [Util.stringify_hash(modified_proposal), Util.stringify_hash(otter_proposal)]
      })
    end
  end

  describe 'Exists?' do
    it 'checks if matched profile is already in any document' do
      expect(Repos::Profiles.exists? profile_id).to eq(true)
      expect(Repos::Profiles.exists? 'otter_profile_id').to eq(false)
    end

    it 'checks if matched proposal is already in a profile' do
      expect(Repos::Profiles.proposal_exists?('otter_proposal')).to eq(false)
      Repos::Profiles.add_proposal(profile_id, proposal)
      expect(Repos::Profiles.proposal_exists?(proposal_id)).to eq(true)
    end
  end

  describe 'Old pictures' do
    it 'gives the stored pictures for profiles' do
      expect(Repos::Profiles.profile_old_pictures profile_id, :profile_picture).to eq(['profile.jpg'])
    end

    it 'gives the stored pictures for proposals' do
      Repos::Profiles.add_proposal(profile_id, proposal)
      expect(Repos::Profiles.proposal_old_pictures proposal_id, :photos).to eq(['picture.jpg', 'otter_picture.jpg'])
    end
  end

  describe 'Get Profiles' do

    let(:my_otter_profile){
      {
        user_id: user_id,
        profile_id: 'my_otter_profile_id',
        type: 'artist',
        name: 'otter_artist_name'
      }
    }

    let(:otter_user_profile){
      {
        user_id: 'otter_user',
        profile_id: 'otter_user_profile_id',
        type: 'space',
        name: 'otter_user_name'
      }
    }

    before(:each){
      Repos::Profiles.add_proposal(profile_id, proposal)
      profile.merge! proposals: [proposal]
      Repos::Profiles.update(my_otter_profile)
      my_otter_profile.delete(:_id)
      Repos::Profiles.update(otter_user_profile)
      otter_user_profile.delete(:_id)
    }

    it 'returns all the space profiles, and artist profiles with at least one proposal' do
      result = Repos::Profiles.get_profiles :all
      expect(result.include? profile).to eq(true)
      expect(result.include? otter_user_profile).to eq(true)
      expect(result.size).to eq(2)
    end

    it 'returns all profiles sorting those of the user' do
      result = Repos::Profiles.get_profiles :all_user_aside, {user_id: user_id}
      expect(result).to eq({
        my_profiles:  [profile, my_otter_profile],
        profiles: [otter_user_profile]
      })
    end

    it 'returns all profiles and those of the user (sorted)' do
      profile.merge! calls: []
      my_otter_profile.merge! calls: []
      result = Repos::Profiles.get_profiles :user_profiles, {user_id: user_id, profile_id: 'my_otter_profile_id'}
      expect(result).to eq([my_otter_profile, profile])
    end
  end
end
