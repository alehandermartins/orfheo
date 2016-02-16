describe CallsController do

  before(:each){
    @login_route = '/login/login_attempt'
    @create_call_route = '/users/create_call'
    @user_id = 'email@test.com'
    @call_id = 'b5bc4203-9379-4de0-856a-55e1e5f3fac6'

    @user_hash = {
      email: 'email@test.com',
      password: 'password'
    }

    @call_hash = {}

    Services::Users.register @user_hash
    Services::Users.validated_user @user_hash[:validation_code]
    post @login_route, @user_hash
  }

  describe 'Create' do

    it 'fails if the call already exists' do
      post @create_call_route, {}
      post @create_call_route, {}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('existing_call')
    end

    it 'adds a new a call' do
      post @create_call_route, {}
      expect(parsed_response['status']).to eq('success')
      expect(Repos::Calls.exists?({call_id: @call_id})).to eq(true)
    end
  end

  describe 'Send_proposal' do
    before(:each){
      @send_proposal_route = '/users/send_proposal'

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
      post @create_call_route, {}
    }

    it 'fails if the proposal has the wrong type' do
      @proposal_params[:type] = 'otter'
      post @send_proposal_route, @proposal_params

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_type')
    end

    it 'fails if the proposal category does not match' do
      @proposal_params[:category] = 'otter'
      allow(ArtistForm).to receive(:categories).and_return(['music'])

      post @send_proposal_route, @proposal_params

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_category')
    end

    it 'fails if the proposal does not have the mandatory fields' do
      @proposal_params.delete(:title)
      post @send_proposal_route, @proposal_params

      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_form')
    end

    it 'adds the proposal to the specified call' do
      post @send_proposal_route, @proposal_params
      expect(Repos::Calls.grab({call_id: @call_id}).first[:proposals].first).to include(@proposal.to_h)
    end

    it 'adds the proposal to the user profile' do
      post '/users/update_profile', @profile_params
      post @send_proposal_route, @proposal_params
      expect(Repos::Profiles.grab({profile_id: @profile_id}).first[:proposals].first).to include(@proposal.to_h)
    end
  end
end
