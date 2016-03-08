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
      profile_picture: ['picture.jpg'],
      bio: 'bio',
      personal_web: 'my_web'
    }
    Services::Profiles.create @profile_params, @user_id

    @proposal_params = {
      profile_id: @profile_id,
      proposal_id: @proposal_id,
      category: 'category',
      title: 'title',
      description: 'description',
      short_description: 'short_descritpion',
      photos: ['picture.jpg', 'otter_picture.jpg'],
      links: 'links',
      duration: 'duration',
      children: 'children'
    }

    @proposal = ArtistProposal.new @proposal_params, @user_id

  }

  describe 'Initialize' do

    it 'assigns a new proposal_id if the params do not specify any' do
      @proposal_params.delete(:proposal_id)
      proposal = ArtistProposal.new @proposal_params, @user_id

      expect(UUID.validate proposal[:proposal_id]).to eq(true)
    end

    it 'assigns the old profile_id if specified' do
      expect(@proposal[:proposal_id]).to eq(@proposal_id)
    end
  end

  describe 'Checks' do

    it 'if the fundamental fields are not empty' do
      expect(@proposal.wrong_params?).to eq(false)

      @proposal_params[:title] = ''
      proposal = ArtistProposal.new @proposal_params, @user_id

      expect(proposal.wrong_params?).to eq(true)
    end
  end
end
