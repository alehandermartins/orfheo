describe Services::Calls do

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:profile_id){'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'}
  let(:proposal_id){'b11000e7-8f02-4542-a1c9-7f7aa18752ce'}
  let(:call_id){'b5bc4203-9379-4de0-856a-55e1e5f3fac6'}

  let(:proposal){
    {
      profile_id: profile_id,
      proposal_id: proposal_id,
      call_id: call_id,
      type: 'artist',
      category: 'music',
      title: 'title',
      description: 'description',
      short_description: 'short_description',
      phone: '666999666',
      conditions: true,
      duration: '15',
      availability: 'sun',
      components: 3,
      repeat: true
    }
  }

  let(:call){
    {}
  }

  describe 'Registration' do

    it 'registers the call' do
      expect(Repos::Calls).to receive(:add).with({user_id: user_id, call_id: call_id})
      Services::Calls.register call, user_id
    end
  end

  describe 'Exists?' do

    it 'checks if a call_id is already employed' do
      Services::Calls.register call, user_id
      expect(Services::Calls.exists? call_id).to eq(true)
      expect(Services::Calls.exists? 'otter').to eq(false)
    end
  end

  describe 'Add proposal' do

    let(:profile_proposal){
      proposal.merge user_id: user_id
    }

    it 'fails if the category is wrong' do
      proposal[:category] = ''
      expect{Services::Calls.add_proposal proposal, user_id}.to raise_error(Pard::Invalid::Category)
    end

    it 'fails if the parameters are wrong' do
      proposal[:profile_id] = ''
      expect{Services::Calls.add_proposal proposal, user_id}.to raise_error(Pard::Invalid::Params)
    end

    it 'adds a proposal to the profile' do
      expect(Services::Profiles).to receive(:add_proposal).with(profile_proposal, user_id)
      Services::Calls.add_proposal proposal, user_id
    end

    it 'adds a proposal to the call' do
      expect(Repos::Calls).to receive(:add_proposal).with(call_id, profile_proposal)
      Services::Calls.add_proposal proposal, user_id
    end
  end

  # describe 'Wrong_category?' do

  #   it 'fails if the category is not included in the call' do
  #     @proposal_params[:category] = 'otter'
  #     allow(ArtistForm).to receive(:categories).and_return(['music'])
  #     expect(Services::Calls.wrong_category? @proposal_params).to eq(true)
  #   end

  #   it 'accepts any category if other is included' do
  #     @proposal_params[:category] = 'otter'
  #     expect(Services::Calls.wrong_category? @proposal_params).to eq(false)
  #   end
  # end

  # describe 'Wrong form?' do

  #   it 'fails if the fundamental parameters of a proposal are not filled' do
  #     expect(Services::Calls.wrong_form? @proposal_params).to eq(false)

  #     @proposal_params.delete(:repeat)
  #     expect(Services::Calls.wrong_form? @proposal_params).to eq(false)

  #     @proposal_params.delete(:phone)
  #     expect(Services::Calls.wrong_form? @proposal_params).to eq(true)
  #   end
  # end

  describe 'Get proposal' do

    it 'retrieves the proposals for a given profile' do
      expect(Repos::Calls).to receive(:get_proposals_for).with(profile_id)
      Services::Calls.get_proposals_for profile_id
    end
  end
end
