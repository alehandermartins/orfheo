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
end
