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

      expect(Repos::Users.exists?({email:'email@test.com'})).to eq(true)
      expect(parsed_response['status']).to eq('success')
    end

    it 'cannot register a user twice' do
      post @register_route, @user_hash
      post @register_route, @user_hash
      expect(parsed_response['status']).to eq('fail')
    end
  end

  describe 'Validation' do

    before(:each){
      @register_route = '/users/register_attempt'
      @validation_route = '/users/validation/3c61cf77-32b0-4df2-9376-0960e64a654a'

      @user_hash = {
        email: 'email@test.com',
        password: 'password'
      }
    }

    it 'redirects to registration if the validation code does not exist' do
      validation_route = '/users/validation/otter'
      get validation_route

      expect(last_response.location).to eq('localhost:3000')
    end

    it 'validates the user otherwise and redirects to users' do
      Services::Users.register @user_hash
      validation_code = @user_hash[:validation_code]
      validation_route = '/users/validation/' + validation_code
      get validation_route

      expect(Repos::Users.validated?({email: 'email@test.com'})).to eq(true)
      expect(last_response.location).to eq('localhost:3000/users')
    end
  end
end
