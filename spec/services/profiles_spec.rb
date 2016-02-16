describe Services::Profiles do

  before(:each){
    @user_id = '3c61cf77-32b0-4df2-9376-0960e64a654a'
    @profile_id = 'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'

    @profile_params = {
      user_id: @user_id,
      profile_id: @profile_id,
      type: 'artist',
      name: 'artist_name',
      city: 'city',
      zip_code: 'zip_code',
      profile_picture: 'picture.jpg',
      bio: 'bio',
      personal_we: 'my_web'
    }

    @profile = ArtistProfile.new @profile_params, @user_id
  }

  describe 'Exists' do

    it 'checks if a profile with a given profile_id exists for a given user' do
      expect(Services::Profiles.exists? :profile_id, @profile_id, @user_id).to eq(false)
      @profile.update
      expect(Services::Profiles.exists? :profile_id, @profile_id, @user_id).to eq(true)
    end
  end

  describe 'Get Profiles' do

    it 'returns and empty array if no profiles for a given user' do
      expect(Services::Profiles.get_profiles_for @user_id).to eq([])
    end

    it 'returns the specified profiles for a given user' do
      @profile.update
      @profile_params.delete(:profile_id)
      @profile_params[:name] = 'otter_name'
      expect(Services::Profiles.get_profile_for @user_id, @profile_id).to include(
        user_id: @user_id,
        profile_id: @profile_id
      )
    end

    it 'returns all the profiles for a given user' do
      @profile.update
      @profile_params.delete(:profile_id)
      @profile_params[:name] = 'otter_name'
      profile = ArtistProfile.new @profile_params, @user_id
      profile.update

      expect(Services::Profiles.get_profiles_for(@user_id).first).to include(
        user_id: @user_id,
        profile_id: @profile_id
      )
      expect(Services::Profiles.get_profiles_for(@user_id)[1]).to include(
        user_id: @user_id,
        name: 'otter_name'
      )
    end
  end

  describe 'Add proposal' do

    before(:each){
      @profile.update
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
      @proposal = ArtistProposal.new @profile_params, @user_id
      @proposal.add
    }

    it 'adds a proposal to the profile' do
      expect(Repos::Profiles.grab({profile_id: @profile_id}).first[:proposals].first).to eq(@proposal.to_h)
    end
  end
end
