describe ArtistProfile do

  before(:each){
    @user_id = '3c61cf77-32b0-4df2-9376-0960e64a654a'
    @profile_id = 'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'

    @profile_params = {
      profile_id: @profile_id,
      type: 'artist',
      name: 'artist_name',
      city: 'city',
      zip_code: 'zip_code',
      profile_picture: 'picture.jpg',
      bio: 'bio',
      personal_web: 'my_web'
    }
    @profile = ArtistProfile.new @profile_params, @user_id
    Services::Profiles.create @profile_params, @user_id
  }

  describe 'Initialize' do

    it 'assigns a new profile_id if the params do not specify any' do
      @profile_params.delete(:profile_id)
      profile = ArtistProfile.new @profile_params, @user_id

      expect(UUID.validate profile.uuid).to eq(true)
    end

    it 'assigns the old profile_id if specified' do
      expect(@profile.uuid).to eq(@profile_id)
    end
  end

  describe 'Checks' do

    it 'if the fundamental fields are not empty' do
      expect(@profile.wrong_params?).to eq(false)

      @profile_params[:name] = ''
      profile = ArtistProfile.new @profile_params, @user_id

      expect(profile.wrong_params?).to eq(true)
    end
  end
end
