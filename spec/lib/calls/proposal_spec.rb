describe Proposal do

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:production_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb80'}
  let(:call_id){'b5bc4203-9379-4de0-856a-55e1e5f3fac6'}

  let(:proposal_params){
    {
      profile_id: profile_id,
      production_id: production_id,
      call_id: call_id,
      type: 'artist',
      category: 'music',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      photos: ['picture.jpg', 'otter_picture.jpg'],
      links: 'links',
      duration: '15',
      children: 'children',
      phone: '666999666',
      conditions: 'true',
      availability: 'sun',
      components: '3',
      repeat: 'true'
    }
  }

  describe 'Initialize' do

    it 'assigns a new production_id if the params do not specify any' do
      proposal_params.delete(:production_id)
      proposal = Proposal.new proposal_params, user_id

      expect(UUID.validate proposal[:production_id]).to eq(true)
    end

    it 'assigns the old production_id if specified' do
      proposal = Proposal.new proposal_params, user_id
      expect(proposal[:production_id]).to eq(production_id)
    end

    it 'assigns a new proposal_id' do
      proposal = Proposal.new proposal_params, user_id
      expect(UUID.validate proposal[:proposal_id]).to eq(true)
    end
  end

  describe 'Checks' do

    it 'if the category is not valid' do
      proposal_params.delete(:category)
      proposal = Proposal.new proposal_params, user_id
      expect(proposal.wrong_category?).to eq(true)
    end

    it 'if the basic fields are not valid' do
      proposal_params.delete(:profile_id)
      proposal = Proposal.new proposal_params, user_id
      expect(proposal.wrong_params?).to eq(true)
    end

    it 'if the fields for the form are correct' do
      proposal_params.delete(:title)
      proposal = Proposal.new proposal_params, user_id
      expect(proposal.wrong_params?).to eq(true)
    end

    it 'is passes the checks if ok' do
      proposal = Proposal.new proposal_params, user_id
      expect(proposal.wrong_category?).to eq(false)
      expect(proposal.wrong_params?).to eq(false)
    end
  end
end
