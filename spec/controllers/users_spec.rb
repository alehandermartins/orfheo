describe UsersController do

  describe 'Registration attempt' do

    before(:each){
      @register_route = '/users/register_attempt'

      @user_hash = {
        email: 'email@test.com',
        password: 'password'
      }
    }

    it 'cannot register a user with no email' do
      post @register_route, {
        email: nil,
        password: 'password'
      }
      expect(parsed_response['status']).to eq('fail')
    end

    it 'cannot register a user with no valid email' do
      post @register_route, {
        email: 'invalid',
        password: 'password'
      }
      expect(parsed_response['status']).to eq('fail')
    end

    it 'cannot register a user with no password' do
      post @register_route, {
        email: 'email',
        password: nil
      }
      expect(parsed_response['status']).to eq('fail')
    end

    it 'cannot register a user with a password less than 8 characters' do
      post @register_route, {
        email: 'email',
        password: 'pass'
      }
      expect(parsed_response['status']).to eq('fail')
    end

    it 'registers an unactivated user' do
      post @register_route, @user_hash

      expect(Repos::Users.exists? 'email@test.com').to eq(true)
      expect(parsed_response['status']).to eq('success')
    end

    it 'cannot register a user twice' do
      post @register_route, @user_hash
      post @register_route, @user_hash
      expect(parsed_response['status']).to eq('fail')
    end
  end
end
