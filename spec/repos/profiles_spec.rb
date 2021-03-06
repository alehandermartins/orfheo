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
      phone: {value: 'phone', visible: false},
      address: 'address',
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
      children: 'children',
      cache: {value: 'cache', visible: true}
    }
  }

  before(:each){
    Repos::Profiles.update(profile)
    profile.delete(:_id)
  }

  describe 'Create and modify' do

    it 'registers a new profile' do
      saved_entry = @db['profiles'].find({}).first
      expect(saved_entry).to include({
        'user_id' => user_id,
        'profile_id' => profile_id,
        'type' => 'artist',
        'name' => 'artist_name',
      })
    end

    it 'modifies a parameter' do
      Repos::Profiles.update({profile_id: profile_id, name: 'otter_name'})
      saved_entry = @db['profiles'].find({}).first
      expect(saved_entry).to include({
        'profile_id' => profile_id,
        'name' => 'otter_name'
      })
    end

    it 'checks if a name is availabe' do
      expect(Repos::Profiles.name_available? 'otter_id', 'artist_name').to eq(false)
      expect(Repos::Profiles.name_available? user_id, 'artist_name').to eq(true)
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

      saved_entry = @db['profiles'].find({}).first
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

      saved_entry = @db['profiles'].find({}).first
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
        name: 'otter_artist_name',
        phone: {value: 'otter_phone', visible: true}
      }
    }

    let(:otter_user_profile){
      {
        user_id: 'otter_user',
        profile_id: 'otter_user_profile_id',
        type: 'space',
        name: 'otter_user_name',
        phone: {value: nil, visible: false}
      }
    }

    let(:event){
      {
        artists: [{profile_id: profile_id},{profile_id: 'otter_user_profile_id'}],
        program: [{participant_id: profile_id, host_id: profile_id},{participant_id: 'otter_user_profile_id', host_id: profile_id}]
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
      result = Repos::Profiles.get_profile profile_id
      expect(result).to eq(profile)
    end

    it 'returns header info' do
      result = Repos::Profiles.get_header_info user_id
      expect(result).to eq([
        {
          :profile_id => "fce01c94-4a2b-49ff-b6b6-dfd53e45bb83",
          :name => "artist_name",
          :img => "profile.jpg",
          :color=>nil
       },
       {
          :profile_id => "my_otter_profile_id",
          :name => "otter_artist_name",
          :img => nil,
          :color => nil}
        ])
    end

    it 'returns a specific production' do
      result = Repos::Profiles.get_production production_id
      expect(result).to eq(production)
    end

    it 'returns all the profiles' do
      result = Repos::Profiles.get_all
      profile.delete(:phone)
      otter_user_profile.delete(:phone)
      expect(result.include? profile).to eq(true)
      expect(result.include? my_otter_profile).to eq(true)
      expect(result.include? otter_user_profile).to eq(true)
      expect(result.size).to eq(3)
    end

    it 'returns all profiles and those of the user (sorted)' do
      profile.merge! events: []
      profile.merge! proposals: {artist: [], space: []}
      profile.merge! program: []
      my_otter_profile.merge! events: []
      my_otter_profile.merge! proposals: {artist: [], space: []}
      my_otter_profile.merge! program: []
      result = Repos::Profiles.get_user_profiles user_id, 'my_otter_profile_id'
      expect(result).to eq([my_otter_profile, profile])
    end

    it 'returns all profiles for a visitor' do
      profile.merge! events: []
      profile.merge! program: []
      profile.delete(:phone)
      my_otter_profile.merge! events: []
      my_otter_profile.merge! program: []
      result = Repos::Profiles.get_visitor_profiles user_id, 'my_otter_profile_id'
      expect(result).to eq([my_otter_profile, profile])
    end

    it 'returns all profiles for an event' do
      allow(Repos::Events).to receive(:get_event).with('event_id').and_return(event)
      result = Repos::Profiles.get_event_profiles 'event_id'
      profile.delete(:phone)
      otter_user_profile.delete(:phone)
      expect(result).to include(profile, otter_user_profile)
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