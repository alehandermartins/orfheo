describe Services::Profiles do

  before(:each){
    @user_id = '3c61cf77-32b0-4df2-9376-0960e64a654a'
    @profile_id = 'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'
    @proposal_id = 'b11000e7-8f02-4542-a1c9-7f7aa18752ce'
    @call_id = 'b5bc4203-9379-4de0-856a-55e1e5f3fac6'

    @call_hash = {}

    @profile_params = {
      user_id: @user_id,
      profile_id: @profile_id,
      type: 'artist',
      name: 'artist_name',
      city: 'city',
      zip_code: 'zip_code',
      color: 'color',
      profile_picture: ['profile.jpg'],
      bio: 'bio',
      personal_web: 'my_web'
    }

    @space_params = {
      user_id: @user_id,
      profile_id: 'fce01c94-4a2b-49ff-b6b6-dfd53e45bb85',
      type: 'space',
      name: 'space_name',
      city: 'city',
      address: 'address',
      zip_code: 'zip_code',
      category: 'home',
      profile_picture: ['picture.jpg'],
      photos: ['picture.jpg', 'otter_picture.jpg'],
      bio: 'bio',
      personal_web: 'my_web'
    }

    @proposal_params = {
      profile_id: @profile_id,
      proposal_id: @proposal_id,
      call_id: @call_id,
      type: 'artist',
      category: 'music',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      photos: ['picture.jpg', 'otter_picture.jpg', 'annoter_picture'],
      phone: '666999666',
      conditions: true,
      duration: '15',
      availability: 'sun',
      components: 3,
      repeat: true
    }

    Services::Calls.register @call_hash, @user_id
    @profile = ArtistProfile.new @profile_params, @user_id
    @space_profile = ArtistProfile.new @space_params, @user_id
  }

  describe 'Create' do

    before(:each){
      Services::Profiles.create @profile_params, @user_id
    }

    it 'creates a new profile' do
      expect(Repos::Profiles.grab({profile_id: @profile_id}).first).to include(@profile.to_h)
    end

    it 'checks if the name of a given profile is already in use' do
      @profile_params.delete(:profile_id)
      expect{Services::Profiles.create @profile_params, @user_id}.to raise_error(Pard::Invalid::ExistingProfile)
    end

    it 'checks if the fundamental fields are ok' do
      @profile_params[:name] = '';
      expect{Services::Profiles.create @profile_params, @user_id}.to raise_error(Pard::Invalid::Params)
    end
  end

  describe 'Modify' do

    before(:each){
      Services::Profiles.create @profile_params, @user_id

      @modify_params = {
        profile_id: @profile_id,
        type: 'artist',
        name: 'otter_name',
        city: 'city',
        zip_code: 'zip_code',
        color: 'new_color',
        profile_picture: ['otter.jpg'],
      }
    }

    it 'checks if the profile exists' do
      @modify_params.delete(:profile_id)
      expect{Services::Profiles.modify @modify_params, @user_id}.to raise_error(Pard::Invalid::UnexistingProfile)
    end

    it 'checks if the name of a given profile is already in use' do
      @profile_params.delete(:profile_id)
      @profile_params[:name] = 'otter_name'
      Services::Profiles.create @profile_params, @user_id
      expect{Services::Profiles.modify @modify_params, @user_id}.to raise_error(Pard::Invalid)
    end

    it 'checks if the new fundamental fields are ok' do
      @modify_params[:name] = '';
      expect{Services::Profiles.modify @modify_params, @user_id}.to raise_error(Pard::Invalid)
    end

    it 'deletes old images if changed' do
      cloudinary_params = {
        type: 'upload',
        prefix: @user_id + '/' + @profile_id + '/profile_picture'
      }

      allow(Cloudinary::Api).to receive(:resources).with(cloudinary_params).and_return({'resources' => [{'public_id' => 'picture.jpg'}]})
      expect(Cloudinary::Api).to receive(:delete_resources).with(['picture.jpg'])
      Services::Profiles.modify @modify_params, @user_id
    end
  end

  describe 'Exists' do

    it 'checks if a profile with a given profile_id exists for a given user' do
      expect(Services::Profiles.exists? @profile_id).to eq(false)
      Services::Profiles.create @profile_params, @user_id
      expect(Services::Profiles.exists? @profile_id).to eq(true)
    end
  end

  describe 'Get Profiles' do

    it 'returns and empty array if no profiles for a given user' do
      expect(Services::Profiles.get_profiles_for @user_id).to eq([])
    end

    it 'returns all the profiles for a given user' do
      Services::Profiles.create @profile_params, @user_id
      Services::Calls.add_proposal @proposal_params, @user_id

      @profile_params[:profile_id] = 'otter_profile_id'
      @profile_params[:name] = 'otter_name'
      Services::Profiles.create @profile_params, @user_id

      profiles = Services::Profiles.get_profiles_for(@user_id)
      expect(profiles.first).to include(
        user_id: @user_id,
        profile_id: @profile_id,
        name: 'artist_name'
      )
      expect(profiles.first[:calls].first).to include(
        proposal_id: @proposal_id,
        call_id: @call_id
      )
      expect(profiles[1]).to include(
        user_id: @user_id,
        profile_id: 'otter_profile_id',
        name: 'otter_name'
      )
    end


    it 'returns all the profiles for a given user in a specific order' do
      Services::Profiles.create @profile_params, @user_id
      @profile_params[:profile_id] = 'otter_profile_id'
      @profile_params[:name] = 'otter_name'
      Services::Profiles.create @profile_params, @user_id

      profiles = Services::Profiles.get_profiles_for(@user_id, 'otter_profile_id')

      expect(profiles.first).to include(
        user_id: @user_id,
        profile_id: 'otter_profile_id',
        name: 'otter_name'
      )
      expect(profiles[1]).to include(
        user_id: @user_id,
        profile_id: @profile_id,
        name: 'artist_name'
      )
    end

    it 'returns all available profiles with at least one proposal or space profile' do
      Services::Profiles.create @profile_params, @user_id
      Services::Profiles.add_proposal @proposal_params, @user_id

      @profile_params.delete(:profile_id)
      @profile_params[:name] = 'otter_name'
      Services::Profiles.create @profile_params, @user_id
      Services::Profiles.create @space_params, @user_id

      expect(Services::Profiles.get_profiles.size).to eq(2)
    end

    it 'returns all available profiles with at least one proposal or space profile excluding those of the user' do
      Services::Profiles.create @profile_params, 'otter_user'
      Services::Profiles.add_proposal @proposal_params, 'otter_user'

      @profile_params.delete(:profile_id)
      @profile_params[:name] = 'otter_name'
      Services::Profiles.create @profile_params, @user_id
      Services::Profiles.create @space_params, @user_id

      expect(Services::Profiles.get_profiles_reject_user(@user_id)[:my_profiles].first).to include({user_id: @user_id})
      expect(Services::Profiles.get_profiles_reject_user(@user_id)[:profiles].first).not_to include({user_id: @user_id})
    end
  end

  describe 'Add proposal' do

    before(:each){
      Services::Profiles.create @profile_params, @user_id
    }

    it 'fails if the parameters are wrong' do
      @proposal_params[:title] = ''
      expect{Services::Profiles.add_proposal @proposal_params, @user_id}.to raise_error(Pard::Invalid::Params)
    end

    it 'adds a proposal to the profile' do
      Services::Profiles.add_proposal @proposal_params, @user_id
      expect(Repos::Profiles.grab({profile_id: @profile_id}).first[:proposals].first).to include(proposal_id: @proposal_params[:proposal_id])
    end
  end

  describe 'Modify proposal' do

    before(:each){
      Services::Profiles.create @profile_params, @user_id

      @modify_proposal = {
        profile_id: @profile_id,
        proposal_id: @proposal_id,
        type: 'artist',
        category: 'music',
        title: 'title',
        description: 'description',
        short_description: 'short_description',
        photos: ['picture.jpg'],
        phone: '666999666',
        conditions: true,
        duration: '15',
        availability: 'sun',
        components: 3,
        repeat: true
      }
    }

    it 'fails if the proposal does not exist' do
      expect{Services::Profiles.modify_proposal @modify_proposal, @user_id}.to raise_error(Pard::Invalid::UnexistingProposal)
    end

    it 'fails if the parameters are wrong' do
      Services::Profiles.add_proposal @proposal_params, @user_id
      @modify_proposal[:title] = ''
      expect{Services::Profiles.modify_proposal @modify_proposal, @user_id}.to raise_error(Pard::Invalid::Params)
    end

    it 'deletes old images if changed' do
      Services::Profiles.add_proposal @proposal_params, @user_id
      cloudinary_params = {
        type: 'upload',
        prefix: @user_id + '/' + @profile_id + '/' + @proposal_id + '/photos'
      }

      allow(Cloudinary::Api).to receive(:resources).with(cloudinary_params).and_return({'resources' => [{'public_id' => 'picture.jpg'}, {'public_id' => 'otter_picture.jpg'}, {'public_id' => 'anotter_picture.jpg'}]})
      expect(Cloudinary::Api).to receive(:delete_resources).with(['otter_picture.jpg', 'anotter_picture.jpg'])
      Services::Profiles.modify_proposal @modify_proposal, @user_id
    end
  end
end
