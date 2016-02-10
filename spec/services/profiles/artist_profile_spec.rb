describe ArtistProfile do

  before(:each){

    @user_id = '3c61cf77-32b0-4df2-9376-0960e64a654a'

    @profile_params = {
      'type' => 'artist',
      'name' => 'artist_name',
      'zip_code' => 'zip_code',
    }
  }

  describe 'Checks' do

    it 'checks if the keys of a profile are correct' do
      expect(ArtistProfile.correct_keys?({'type' => 'artist'})).to eq(false)
      expect(ArtistProfile.correct_keys? @profile_params).to eq(true)
    end

    it 'checks if the values of a profile are correct' do
      expect(ArtistProfile.correct_params?({'type' => 'artist', 'name' => ''})).to eq(false)
      expect(ArtistProfile.correct_params? @profile_params).to eq(true)
    end
  end
end
