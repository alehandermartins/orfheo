describe Services::Profiles do

  before(:each){

    @user_id = '3c61cf77-32b0-4df2-9376-0960e64a654a'

    @profile_params = {
      type: 'artist',
      name: 'artist_name',
      zip_code: 'zip_code',
    }

    @otter_params = {
      type: 'artist',
      name: 'otter_name',
      zip_code: 'zip_code',
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

  describe 'Exists' do

    it 'checks if a profile exists for a given user' do
      expect(Services::Profiles.exists? 'artist_name', @user_id).to eq(false)
      Services::Profiles.create @profile_params, @user_id
      expect(Services::Profiles.exists? 'artist_name', @user_id).to eq(true)
    end

    it 'checks if a profile exists for a given user with many profiles' do
      Services::Profiles.create @profile_params, @user_id
      Services::Profiles.create @otter_params, @user_id
      expect(Services::Profiles.exists? 'artist_name', @user_id).to eq(true)
      expect(Services::Profiles.exists? 'otter_name', @user_id).to eq(true)
    end
  end

  describe 'get_profiles' do

    it 'returns and empty array if no profiles for a given user' do
      expect(Services::Profiles.get_profiles_for @user_id).to eq([])
    end

    it 'returns all the profiles for a given user' do
      Services::Profiles.create @profile_params, @user_id
      Services::Profiles.create @otter_params, @user_id
      expect(Services::Profiles.get_profiles_for @user_id).to eq([@profile_params, @otter_params])
    end
  end
end
