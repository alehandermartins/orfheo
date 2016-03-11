describe ArtistProfile do

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}

  let(:profile_params){
    {
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

  describe 'Initialize' do

    it 'assigns a new profile_id if the params do not specify any' do
      profile_params.delete(:profile_id)
      profile = ArtistProfile.new profile_params, user_id

      expect(UUID.validate profile.uuid).to eq(true)
    end

    it 'assigns the old profile_id if specified' do
      profile = ArtistProfile.new profile_params, user_id
      expect(profile.uuid).to eq(profile_id)
    end
  end

  describe 'Checks' do

    it 'if the fundamental fields are not empty' do
      profile = ArtistProfile.new profile_params, user_id
      expect(profile.wrong_params?).to eq(false)

      profile_params[:name] = ''
      otter_profile = ArtistProfile.new profile_params, user_id

      expect(otter_profile.wrong_params?).to eq(true)
    end
  end
end
