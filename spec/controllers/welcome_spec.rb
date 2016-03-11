describe WelcomeController do

  let(:login_route){'/login/login_attempt'}

  let(:user_hash){
    {
      email: 'email@test.com',
      password: 'password'
    }
  }

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:validation_code){'3c61cf77-32b0-4df2-9376-0960e64a654a'}

  let(:user){
    {
      user_id: user_id,
      email: 'email@test.com',
      password: 'password',
      validation: false,
      validation_code: validation_code
    }
  }

  before(:each){
    Repos::Users.add user
    Services::Users.validated_user validation_code
  }

  describe 'Access' do
    it 'redirects to users page if already logged in' do
      post login_route, user_hash
      get '/'
      expect(last_response.location).to eq('http://example.org/users/')
    end

    it 'gets all profiles' do
      expect(Services::Profiles).to receive(:get_profiles).with(:all, nil).and_return([])
      get '/'
    end
  end
end
