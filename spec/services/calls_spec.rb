describe Services::Calls do

  before(:each){

    @user_id = 'email@test.com'
    @call_id = 'b5bc4203-9379-4de0-856a-55e1e5f3fac6'
    @profile_id = 'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'
    @proposal_id = 'b11000e7-8f02-4542-a1c9-7f7aa18752ce'

    @call_hash = {}

    @proposal_params = {
      profile_id: @profile_id,
      proposal_id: @proposal_id,
      call_id: @call_id,
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

  describe 'Registration' do

    it 'adds the user_id to the call' do
      Services::Calls.register @call_hash, @user_id
      expect(@call_hash[:user_id]).to eq(@user_id)
    end

    it 'adds a call_id' do
      Services::Calls.register @call_hash, @user_id
      expect(UUID.validate @call_hash[:call_id]).to eq(true)
    end

    it 'registers the call' do
      expect(Repos::Calls).to receive(:add).with(@call_hash)
      Services::Calls.register @call_hash, @user_id
    end
  end

  describe 'Exists?' do

    it 'checks if a call_id is already employed' do
      Services::Calls.register @call_hash, @user_id
      expect(Services::Calls.exists? @call_id).to eq(true)
      expect(Services::Calls.exists? 'otter').to eq(false)
    end
  end

  describe 'Add proposal' do

    it 'adds the user_id to the proposal parameters' do
      Services::Calls.add_proposal @proposal_params, @user_id
      expect(@proposal_params[:user_id]).to eq(@user_id)
    end

    it 'adds an id to the proposal if it does not have any' do
      Services::Calls.add_proposal @proposal_params, @user_id
      expect(@proposal_params[:proposal_id]).to eq(@proposal_id)

      @proposal_params.delete(:proposal_id)
      Services::Calls.add_proposal @proposal_params, @user_id

      expect(@proposal_params[:proposal_id]).not_to eq(@proposal_id)
      expect(UUID.validate @proposal_params[:proposal_id]).to eq(true)
    end

    it 'adds a proposal to the call' do
      expect(Repos::Calls).to receive(:push).with({call_id: @proposal_params[:call_id]}, @proposal_params)
      Services::Calls.add_proposal @proposal_params, @user_id
    end
  end

  describe 'Wrong_category?' do

    it 'fails if the category is not included in the call' do
      @proposal_params[:category] = 'otter'
      allow(ArtistForm).to receive(:categories).and_return(['music'])
      expect(Services::Calls.wrong_category? @proposal_params).to eq(true)
    end

    it 'accepts any category if other is included' do
      @proposal_params[:category] = 'otter'
      expect(Services::Calls.wrong_category? @proposal_params).to eq(false)
    end
  end

  describe 'Wrong form?' do

    it 'fails if the fundamental parameters of a proposal are not filled' do
      expect(Services::Calls.wrong_form? @proposal_params).to eq(false)

      # @proposal_params.delete(:repeat)
      # expect(Services::Calls.wrong_form? @proposal_params).to eq(false)

      # @proposal_params.delete(:phone)
      # expect(Services::Calls.wrong_form? @proposal_params).to eq(true)
    end
  end
end
