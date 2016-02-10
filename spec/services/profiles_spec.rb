describe Services::Profiles do

  before(:each){

    @user_id = '3c61cf77-32b0-4df2-9376-0960e64a654a'

    @profile_params = {
      'type' => 'artist',
      'name' => 'artist_name',
      'location' => 'location',
    }
  }

  describe 'Creation' do

    it 'creates a profile with the id of the user' do
      Services::Profiles.create @profile_params, @user_id
      expect(@profile_params[:user_id]).to eq(@user_id)
    end

    it 'stores the profile in the repo' do
      Services::Profiles.create @profile_params, @user_id
      expect(Repos::Profiles.exists?({user_id: @user_id})).to eq(true)
    end
  end
end
