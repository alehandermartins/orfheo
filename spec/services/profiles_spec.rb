describe Services::Profiles do

  before(:each){
    @user_id = '3c61cf77-32b0-4df2-9376-0960e64a654a'
    @profile_id = 'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'
    @proposal_id = 'b11000e7-8f02-4542-a1c9-7f7aa18752ce'

    @profile_params = {
      user_id: @user_id,
      profile_id: @profile_id,
      type: 'artist',
      name: 'artist_name',
      city: 'city',
      zip_code: 'zip_code',
      color: 'color',
      profile_picture: 'picture.jpg',
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
      profile_picture: 'picture.jpg',
      bio: 'bio',
      personal_web: 'my_web'
    }

    @proposal_params = {
        profile_id: @profile_id,
        proposal_id: @proposal_id,
        type: 'artist',
        category: 'music',
        title: 'title',
        description: 'description',
        short_description: 'short_description',
        phone: '666999666',
        conditions: true,
        duration: '15',
        availability: 'sun',
        components: 3,
        repeat: true
      }

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
      expect{Services::Profiles.create @profile_params, @user_id}.to raise_error(Pard::Invalid)
    end

    it 'modifies an existing profile' do
      @profile_params[:name] = 'otter_name'
      Services::Profiles.create @profile_params, @user_id

      expect(Repos::Profiles.grab({profile_id: @profile_id}).first).to include({name: 'otter_name'})
    end

    it 'does not modify unexisting fields' do
      @profile_params.delete(:personal_web)
      Services::Profiles.create @profile_params, @user_id
      expect(Repos::Profiles.grab({profile_id: @profile_id}).first).to include({personal_web: 'my_web'})
    end
  end

  describe 'Exists' do

    it 'checks if a profile with a given profile_id exists for a given user' do
      expect(Services::Profiles.exists? :profile_id, @profile_id, @user_id).to eq(false)
      Services::Profiles.create @profile_params, @user_id
      expect(Services::Profiles.exists? :profile_id, @profile_id, @user_id).to eq(true)
    end
  end

  describe 'Get Profiles' do

    it 'returns and empty array if no profiles for a given user' do
      expect(Services::Profiles.get_profiles_for @user_id).to eq([])
    end

    it 'returns the specified profiles for a given user' do
      Services::Profiles.create @profile_params, @user_id

      expect(Services::Profiles.get_profile_for @user_id, @profile_id).to include(
        user_id: @user_id,
        profile_id: @profile_id
      )
    end

    it 'returns all the profiles for a given user' do
      Services::Profiles.create @profile_params, @user_id
      @profile_params.delete(:profile_id)
      @profile_params[:name] = 'otter_name'
      Services::Profiles.create @profile_params, @user_id

      expect(Services::Profiles.get_profiles_for(@user_id).first).to include(
        user_id: @user_id,
        profile_id: @profile_id
      )
      expect(Services::Profiles.get_profiles_for(@user_id)[1]).to include(
        user_id: @user_id,
        name: 'otter_name'
      )
    end

    it 'returns all available profiles with at least one proposal or space profile' do
      Services::Profiles.create @profile_params, @user_id
      @proposal = ArtistProposal.new @proposal_params, @user_id
      @proposal.add
      @profile_params.delete(:profile_id)
      @profile_params[:name] = 'otter_name'
      Services::Profiles.create @profile_params, @user_id
      Services::Profiles.create @space_params, @user_id

      expect(Services::Profiles.get_profiles.size).to eq(2)
    end
  end

  describe 'Add proposal' do

    before(:each){
      Services::Profiles.create @profile_params, @user_id
      @proposal = ArtistProposal.new @proposal_params, @user_id
      @proposal.add
    }

    it 'adds a proposal to the profile' do
      expect(Repos::Profiles.grab({profile_id: @profile_id}).first[:proposals].first).to eq(@proposal.to_h)
    end
  end
end
