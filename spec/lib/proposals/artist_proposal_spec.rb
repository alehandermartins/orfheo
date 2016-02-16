describe ArtistProposal do

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
      profile_picture: 'picture.jpg',
      bio: 'bio',
      personal_web: 'my_web'
    }
    @profile = ArtistProfile.new @profile_params, @user_id
    @profile.update

    @proposal_params = {
      profile_id: @profile_id,
      proposal_id: @proposal_id,
      category: 'category',
      title: 'title',
      description: 'description',
      short_description: 'short_descritpion',
      links: 'links',
      duration: 'duration',
      children: 'children'
    }

    @proposal = ArtistProposal.new @proposal_params, @user_id

  }

  describe 'Add' do

    it 'adds a proposal to the profile' do
      @proposal.add
      expect(Repos::Profiles.grab({profile_id: @profile_id}).first[:proposals].first).to eq(@proposal.to_h)
    end
  end
end
