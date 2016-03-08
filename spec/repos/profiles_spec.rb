describe Repos::Profiles do

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
      profile_picture: ['profile.jpg'],
      bio: 'bio',
      personal_web: 'my_web'
    }

    @proposal_params = {
      user_id: @user_id,
      profile_id: @profile_id,
      proposal_id: @proposal_id,
      category: 'categoty',
      title: 'title',
      description: 'description',
      photos: ['picture.jpg', 'otter_picture.jpg'],
      links: 'links',
      duration: 'duration',
      children: 'children'
    }

    Repos::Profiles.update(@profile_id, @profile_params)
  }

  describe 'Update' do

    it 'registers a new profile' do
      saved_entry = @db['profiles'].find_one()
      expect(saved_entry).to include({
        'user_id' => @user_id,
        'profile_id' => @profile_id,
        'type' => 'artist',
        'name' => 'artist_name',
      })
    end

    it 'modifies a parameter' do
      Repos::Profiles.update(@profile_id, {name: 'otter_name'})
      saved_entry = @db['profiles'].find_one()
      expect(saved_entry).to include({'name' => 'otter_name'})
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
        user_id: @user_id,
        profile_id: @profile_id,
        type: 'artist',
        name: 'artist_name',
      })
    end

     it 'returns an array with all the profiles' do
      Repos::Profiles.update('otter_profile_id', {
        user_id: @user_id,
        profile_id: 'otter_profile_id',
        type: 'space',
        name: 'otter_name',
      })

      expect(Repos::Profiles.grab({user_id:@user_id}).first).to include({
        user_id: @user_id,
        profile_id: @profile_id,
        type: 'artist',
        name: 'artist_name',
      })

      expect(Repos::Profiles.grab({user_id:@user_id})[1]).to include({
        user_id: @user_id,
        profile_id: 'otter_profile_id',
        type: 'space',
        name: 'otter_name',
      })
    end
  end

  describe 'Push' do

    it 'adds a proposal to the array of proposals' do

      @otter_params = {
        user_id: 'otter_user',
        profile_id: 'otter_profile',
        proposal_id: 'otter_proposal'
      }

      Repos::Profiles.push({profile_id:@profile_id}, @proposal_params)
      Repos::Profiles.push({profile_id:@profile_id}, @otter_params)

      expect(Repos::Profiles.grab({profile_id:@profile_id}).first).to include(
        proposals: [@proposal_params, @otter_params]
      )
    end
  end
end
