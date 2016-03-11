describe CallProposal do

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:proposal_id){'b11000e7-8f02-4542-a1c9-7f7aa18752ce'}
  let(:call_id){'b5bc4203-9379-4de0-856a-55e1e5f3fac6'}

  let(:callproposal_params){
    {
      profile_id: profile_id,
      proposal_id: proposal_id,
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

    it 'assigns a new proposal_id if the params do not specify any' do
      callproposal_params.delete(:proposal_id)
      callproposal = CallProposal.new callproposal_params, user_id

      expect(UUID.validate callproposal[:proposal_id]).to eq(true)
    end

    it 'assigns the old profile_id if specified' do
      callproposal = CallProposal.new callproposal_params, user_id
      expect(callproposal[:proposal_id]).to eq(proposal_id)
    end
  end

  describe 'Checks' do

    it 'if the category is not valid' do
      callproposal_params.delete(:category)
      callproposal = CallProposal.new callproposal_params, user_id
      expect(callproposal.wrong_category?).to eq(true)
    end

    it 'if the basic fields are not valid' do
      callproposal_params.delete(:profile_id)
      callproposal = CallProposal.new callproposal_params, user_id
      expect(callproposal.wrong_params?).to eq(true)
    end

    it 'if the fields for the form are correct' do
      callproposal_params.delete(:title)
      callproposal = CallProposal.new callproposal_params, user_id
      expect(callproposal.wrong_params?).to eq(true)
    end

    it 'is passes the checks if ok' do
      callproposal = CallProposal.new callproposal_params, user_id
      expect(callproposal.wrong_category?).to eq(false)
      expect(callproposal.wrong_params?).to eq(false)
    end
  end
end
