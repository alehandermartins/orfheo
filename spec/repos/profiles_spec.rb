describe Repos::Profiles do

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:production_id){'b11000e7-8f02-4542-a1c9-7f7aa18752ce'}

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

  let(:production){
    {
      production_id: production_id,
      category: 'categoty',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      photos: ['picture.jpg', 'otter_picture.jpg'],
      links: [{link: 'web', web_title: 'web_name'},{link: 'otter_web', web_title: 'otter_web_name'}],
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

  describe 'productions' do

    let(:otter_production){
      {
        production_id: 'otter_production',
        title: 'otter_title'
      }
    }

    let(:modified_production){
      {
        production_id: production_id,
        title: 'otter_title'
      }
    }

    it 'adds a production to the array of productions' do
      Repos::Profiles.add_production(profile_id, production)

      saved_entry = @db['profiles'].find_one()
      expect(saved_entry).to include({
        'user_id' => user_id,
        'profile_id' => profile_id,
        'type' => 'artist',
        'name' => 'artist_name',
        'productions' => [Util.stringify_hash(production)]
      })
    end

    it 'modifies a production' do
      Repos::Profiles.add_production(profile_id, production)
      Repos::Profiles.add_production(profile_id, otter_production)
      Repos::Profiles.modify_production(modified_production)

      saved_entry = @db['profiles'].find_one()
      expect(saved_entry).to include({
        'user_id' => user_id,
        'profile_id' => profile_id,
        'type' => 'artist',
        'name' => 'artist_name',
        'productions' => [Util.stringify_hash(modified_production), Util.stringify_hash(otter_production)]
      })
    end
  end

  describe 'Exists?' do
    it 'checks if matched profile is already in any document' do
      expect(Repos::Profiles.exists? profile_id).to eq(true)
      expect(Repos::Profiles.exists? 'otter_profile_id').to eq(false)
    end

    it 'checks if matched production is already in a profile' do
      expect(Repos::Profiles.production_exists?('otter_production')).to eq(false)
      expect(Repos::Profiles.production_exists?(production_id)).to eq(false)
      Repos::Profiles.add_production(profile_id, production)
      expect(Repos::Profiles.production_exists?(production_id)).to eq(true)
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
      Repos::Profiles.add_production(profile_id, production)
      profile.merge! productions: [production]
      Repos::Profiles.update(my_otter_profile)
      my_otter_profile.delete(:_id)
      Repos::Profiles.update(otter_user_profile)
      otter_user_profile.delete(:_id)
    }

    it 'returns a specific profile' do
      result = Repos::Profiles.get_profiles :profile, {profile_id: profile_id}
      profile.merge! calls: []
      profile.merge! proposals: []
      expect(result).to eq(profile)
    end

    it 'returns a specific production' do
      result = Repos::Profiles.get_profiles :production, {production_id: production_id}
      expect(result).to eq(production)
    end

    it 'returns all the space profiles, and artist profiles with at least one production' do
      result = Repos::Profiles.get_profiles :all
      expect(result.include? profile).to eq(true)
      expect(result.include? otter_user_profile).to eq(true)
      expect(result.size).to eq(2)
    end

    it 'returns all profiles and those of the user (sorted)' do
      profile.merge! proposals: []
      my_otter_profile.merge! proposals: []
      profile.merge! calls: []
      my_otter_profile.merge! calls: []
      result = Repos::Profiles.get_profiles :user_profiles, {user_id: user_id, profile_id: 'my_otter_profile_id'}
      expect(result).to eq([my_otter_profile, profile])
    end

    it 'returns all profiles for a visitor' do
      profile.merge! calls: []
      profile.merge! proposals: []
      my_otter_profile.merge! calls: []
      my_otter_profile.merge! proposals: []
      result = Repos::Profiles.get_profiles :visit_profiles, {user_id: user_id, profile_id: 'my_otter_profile_id'}
      expect(result).to eq([my_otter_profile, profile])
    end
  end

  describe 'Get_owner' do
    it 'retrieves the owner of the profile' do
      expect(Repos::Profiles.get_profile_owner profile_id).to eq(user_id)
    end

    it 'retrieves the owner of the production' do
      Repos::Profiles.add_production(profile_id, production)
      expect(Repos::Profiles.get_production_owner production_id).to eq(user_id)
    end
  end

  describe 'Delete' do
    it 'deletes a production' do
      Repos::Profiles.add_production(profile_id, production)
      expect(Repos::Profiles.production_exists?(production_id)).to eq(true)
      Repos::Profiles.delete_production(production_id)
      expect(Repos::Profiles.production_exists?(production_id)).to eq(false)
    end

    it 'deletes a profile' do
      expect(Repos::Profiles.exists?(profile_id)).to eq(true)
      Repos::Profiles.delete_profile(profile_id)
      expect(Repos::Profiles.exists?(profile_id)).to eq(false)
    end
  end
end
