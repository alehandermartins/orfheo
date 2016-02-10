describe SpaceProfile do

  before(:each){

    @user_id = '3c61cf77-32b0-4df2-9376-0960e64a654a'

    @profile_params = {
      'type' => 'space',
      'name' => 'space_name',
      'address' => 'space_address',
      'zip_code' => 'zip_code',
    }
  }

  describe 'Checks' do

    it 'checks if the keys of a profile are correct' do
      expect(SpaceProfile.correct_keys?({'type' => 'space'})).to eq(false)
      expect(SpaceProfile.correct_keys? @profile_params).to eq(true)
    end

    it 'checks if the values of a profile are correct' do
      expect(SpaceProfile.correct_values?({'type' => 'space', 'name' => ''})).to eq(false)
      expect(SpaceProfile.correct_keys? @profile_params).to eq(true)
    end
  end
end
