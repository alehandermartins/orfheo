describe Services::Profiles do

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:production_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb80'}
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
      color: 'color',
      bio: 'bio',
      personal_web: 'my_web'
    }
  }

  let(:space_profile){
    {
      profile_id: 'fce01c94-4a2b-49ff-b6b6-dfd53e45bb85',
      type: 'space',
      name: 'space_name',
      city: 'city',
      address: 'address',
      zip_code: 'zip_code',
      category: 'home',
      profile_picture: ['picture.jpg'],
      photos: ['space_picture.jpg', 'otter_picture.jpg'],
      bio: 'bio',
      personal_web: 'my_web'
    }
  }

  let(:production){
    {
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

  let(:profile_params){
    profile.merge user_id: user_id
  }

  let(:production_params){
    production.merge profile_id: profile_id
  }

  describe 'Create' do

    it 'fails if the name of a given profile is already in use' do
      Services::Profiles.create profile, user_id
      profile.delete(:profile_id)
      expect{Services::Profiles.create profile, user_id}.to raise_error(Pard::Invalid::ExistingProfile)
    end

    it 'fails if the fundamental fields are wrong' do
      profile[:name] = '';
      expect{Services::Profiles.create profile, user_id}.to raise_error(Pard::Invalid::Params)
    end

    it 'updates the profile' do
      expect(Repos::Profiles).to receive(:update).with(profile_params)
      Services::Profiles.create profile, user_id
    end

    it 'returns the profile_id' do
      expect(Services::Profiles.create profile, user_id).to eq(profile_id)
    end
  end

  describe 'Modify' do

    let(:modified_profile){
      {
        user_id: user_id,
        profile_id: profile_id,
        type: 'artist',
        name: 'otter_name',
        city: 'city',
        zip_code: 'zip_code',
        color: 'new_color',
        profile_picture: ['otter.jpg'],
        bio: 'bio',
        personal_web: 'my_web'
      }
    }

    let(:modified_space_profile){
      {
        profile_id: 'fce01c94-4a2b-49ff-b6b6-dfd53e45bb85',
        type: 'space',
        name: 'space_name',
        city: 'city',
        address: 'address',
        zip_code: 'zip_code',
        category: 'home',
        profile_picture: ['otter.jpg'],
        photos: ['otter_space_picture.jpg', 'otter_picture.jpg'],
        bio: 'bio',
        personal_web: 'my_web'
      }
    }

    before(:each){
      Services::Profiles.create profile, user_id
    }

    it 'fails if the name of a given profile is already in use' do
      profile[:profile_id] = 'otter_profile_id'
      profile[:name] = 'otter_name'

      Services::Profiles.create profile, user_id
      expect{Services::Profiles.modify modified_profile, user_id}.to raise_error(Pard::Invalid::ExistingProfile)
    end

    it 'fails if the fundamental fields are wrong' do
      modified_profile[:name] = '';
      expect{Services::Profiles.modify modified_profile, user_id}.to raise_error(Pard::Invalid::Params)
    end

    it 'deletes old images if changed' do
      Services::Profiles.create space_profile, user_id

      expect(Cloudinary::Api).to receive(:delete_resources).with(['picture.jpg', 'space_picture.jpg'])
      Services::Profiles.modify modified_space_profile, user_id
    end

    it 'updates the profile' do
      expect(Repos::Profiles).to receive(:update).with(modified_profile)
      Services::Profiles.modify modified_profile, user_id
    end

    it 'returns the profile_id' do
      expect(Services::Profiles.modify modified_profile, user_id).to eq(profile_id)
    end
  end

  describe 'Add production' do

    before(:each){
      Services::Profiles.create profile, user_id
    }

    it 'fails if the parameters are wrong' do
      production[:title] = ''
      expect{Services::Profiles.add_production production_params, user_id}.to raise_error(Pard::Invalid::Params)
    end

    it 'adds a production to the profile' do
      expect(Repos::Profiles).to receive(:add_production).with(profile_id, hash_including(production))
      Services::Profiles.add_production production_params, user_id
    end
  end

  describe 'Modify production' do

    let(:modified_production){
      {
        production_id: production_id,
        category: 'categoty',
        title: 'otter_title',
        description: 'description',
        short_description: 'short_description',
        photos: ['picture.jpg'],
        links: 'links',
        duration: 'duration',
        children: 'children'
      }
    }

    let(:modified_production_params){
      modified_production.merge profile_id: profile_id
    }

    before(:each){
      Services::Profiles.create profile, user_id
      production.merge! production_id: production_id
    }

    it 'fails if the parameters are wrong' do
      modified_production[:title] = ''
      expect{Services::Profiles.modify_production modified_production_params, user_id}.to raise_error(Pard::Invalid::Params)
    end

    it 'deletes old images if changed' do
      Repos::Profiles.add_production profile_id, production
      expect(Cloudinary::Api).to receive(:delete_resources).with(['otter_picture.jpg'])
      Services::Profiles.modify_production modified_production_params, user_id
    end

    it 'modifies the fields' do
      Repos::Profiles.add_production profile_id, production
      Services::Profiles.add_production production_params, user_id
      expect(Repos::Profiles).to receive(:modify_production).with(modified_production)
      Services::Profiles.modify_production modified_production_params, user_id
    end
  end

  describe 'Exists' do

    it 'checks if a profile exists' do
      expect(Services::Profiles.exists? profile_id).to eq(false)
      Services::Profiles.create profile, user_id
      expect(Services::Profiles.exists? profile_id).to eq(true)
    end

    it 'checks if a production exists' do
      expect(Services::Profiles.production_exists? production_id).to eq(false)
      Services::Profiles.create profile, user_id
      production.merge! production_id: production_id
      Repos::Profiles.add_production(profile_id, production)
      expect(Services::Profiles.production_exists? production_id).to eq(true)
    end
  end

  describe 'Get Profiles' do

    it 'passes the desired method and arguments to the repo' do
      expect(Repos::Profiles).to receive(:get_profiles).with(:all, nil)
      Services::Profiles.get_profiles :all
    end
  end

  describe 'Get_owner' do
    it 'retrieves the owner of the profile' do
      expect(Repos::Profiles).to receive(:get_profile_owner).with(profile_id)
      Services::Profiles.get_profile_owner profile_id
    end

    it 'retrieves the owner of the production' do
      expect(Repos::Profiles).to receive(:get_production_owner).with(production_id)
      Services::Profiles.get_production_owner production_id
    end
  end

  describe 'Delete' do

    it 'deletes a production but not stored pictures in the proposals' do
      Services::Profiles.create profile, user_id
      production.merge! production_id: production_id
      Repos::Profiles.add_production(profile_id, production)
      allow(Services::Calls).to receive(:proposals_old_pictures).with(production_id).and_return({photos: ['picture.jpg']})
      
      expect(Cloudinary::Api).to receive(:delete_resources).with(['otter_picture.jpg']) 
      expect(Repos::Profiles).to receive(:delete_production).with(production_id)
      Services::Profiles.delete_production production_id
    end

    it 'deletes a profile and its proposals' do
      expect(Repos::Calls).to receive(:delete_profile_proposals).with(profile_id)
      expect(Repos::Profiles).to receive(:delete_profile).with(profile_id)
      Services::Profiles.delete_profile profile_id
    end
  end
end
