describe Services::Users do

  describe 'Registration' do

    before(:each){

      @user_hash = {
        email: 'email@test.com',
        password: 'password'
      }

      @mail = Mail.new do
        to 'email'
        from 'alehander.marti@gmail.com'
        subject 'This is a test email'
        body 'Not much to say here'
      end
    }

    it 'adds validation: false to a user' do
      Services::Users.register @user_hash
      expect(@user_hash[:validation]).to eq(false)
    end

    it 'adds validation_code: uuid to a user' do
      Services::Users.register @user_hash
      expect(UUID.validate @user_hash[:validation_code]).to eq(true)
    end

    it 'registers and unvalidated user' do
      expect(Repos::Users).to receive(:add).with(@user_hash)
      Services::Users.register @user_hash
    end

    it 'delivers welcome email' do
      expect(Services::Mails).to receive(:deliver_welcome_mail_to).with(@user_hash)

      Services::Users.register @user_hash
    end
  end

  describe 'Exists?' do

    before(:each){

     @user_hash = {
        email: 'email@test.com',
        password: 'password'
      }
    }

    it 'checks if an email is already employed by other user' do
      Services::Users.register @user_hash
      expect(Services::Users.exists? 'email@test.com').to eq(true)
      expect(Services::Users.exists? 'otter@test.com').to eq(false)
    end
  end
end
