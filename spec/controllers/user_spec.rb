describe UsersController do

  describe 'Registration attempt' do

    before(:each){
      @register_route = '/users/register_attempt'

      @user_hash = {
        email: 'email',
        password: 'password'
      }

      @mail = Mail.new do
        to 'email'
        from 'alehander.marti@gmail.com'
        subject 'This is a test email'
        body 'Not much to say here'
      end
    }

    it 'cannot register a user with no email' do
      post @register_route, {
        email: nil,
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

    xit 'cannot register a user twice' do
      post @register_route, @user_hash
      post @register_route, @user_hash
      expect(parsed_response['status']).to eq('fail')
    end

    it 'delivers welcome_email otherwise' do
      expect(Services::Mails).to receive(:deliver_mail)

      post @register_route, @user_hash
      expect(parsed_response['status']).to eq('success')
    end
  end
end
