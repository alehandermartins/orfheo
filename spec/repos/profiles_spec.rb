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

  describe 'Grab' do

    it 'returns the desired document' do
      expect(Repos::Profiles.grab({user_id:@user_id}).first).to include({
        type: 'artist',
        name: 'artist_name',
        location: 'location',
        user_id: @user_id
      })
    end

     it 'returns an array with all the profiles' do
      Repos::Profiles.add({
        type: 'artist',
        name: 'otter_name',
        location: 'location',
        user_id: @user_id
      })

      expect(Repos::Profiles.grab({user_id:@user_id}).first).to include({
        type: 'artist',
        name: 'artist_name',
        location: 'location',
        user_id: @user_id
      })

      expect(Repos::Profiles.grab({user_id:@user_id})[1]).to include({
        type: 'artist',
        name: 'otter_name',
        location: 'location',
        user_id: @user_id
      })
    end
  end

  describe 'Modify' do

    it 'modifies a parameter' do
      Repos::Profiles.modify({profile_id: @profile_params[:profile_id]}, {name: 'otter_name'})
      saved_entry = @db['profiles'].find_one()
      expect(saved_entry).to include({'name' => 'otter_name'})
    end

    it 'adds a field if it does not exist' do
      Repos::Profiles.modify({profile_id: @profile_params[:profile_id]}, {bio: 'bio'})
      saved_entry = @db['profiles'].find_one()
      expect(saved_entry).to include({'bio' => 'bio'})
    end
  end
end
