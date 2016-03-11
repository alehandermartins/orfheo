describe ArtistProposal do

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:proposal_id){'b11000e7-8f02-4542-a1c9-7f7aa18752ce'}

  let(:proposal_params){
    {
      profile_id: profile_id,
      proposal_id: proposal_id,
      category: 'category',
      title: 'title',
      description: 'description',
      short_description: 'short_descritpion',
      photos: ['picture.jpg', 'otter_picture.jpg'],
      links: 'links',
      duration: 'duration',
      children: 'children'
    }
  }

  describe 'Initialize' do

    it 'assigns a new profile_id if the params do not specify any' do
      proposal_params.delete(:proposal_id)
      proposal = ArtistProposal.new proposal_params, user_id

      expect(UUID.validate proposal[:proposal_id]).to eq(true)
    end

    it 'assigns the old proposal_id if specified' do
      proposal = ArtistProposal.new proposal_params, user_id
      expect(proposal[:proposal_id]).to eq(proposal_id)
    end
  end

  describe 'Checks' do

    it 'if the fundamental fields are not empty' do
      proposal = ArtistProposal.new proposal_params, user_id
      expect(proposal.wrong_params?).to eq(false)

      proposal_params[:title] = ''
      otter_proposal = ArtistProposal.new proposal_params, user_id

      expect(otter_proposal.wrong_params?).to eq(true)
    end
  end
end
