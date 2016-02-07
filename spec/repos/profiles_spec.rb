describe Repos::Profiles do

  before(:each){
    @user_id = '3c61cf77-32b0-4df2-9376-0960e64a654a'

    @profile_params = {
      type: 'artist',
      name: 'artist_name',
      location: 'location',
      user_id: @user_id
    }
    Repos::Profiles.add @profile_params
  }

  describe 'Add' do

    it 'registers a new profile' do
      saved_entry = @db['profiles'].find_one()
      expect(saved_entry).to include({
        'type' => 'artist',
        'name' => 'artist_name',
        'location' => 'location',
        'user_id' => @user_id
      })
    end
  end

  describe 'Exists?' do
    it 'checks if matched element is already in any document' do
      expect(Repos::Profiles.exists?({user_id:@user_id})).to eq(true)
      expect(Repos::Profiles.exists?({user_id:'otter_user_id'})).to eq(false)
    end
  end
end
