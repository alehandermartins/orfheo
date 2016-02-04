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

  describe 'Validation' do

    before(:each){
      @validation_code = '3c61cf77-32b0-4df2-9376-0960e64a654a'

      @user_hash = {
        email: 'email@test.com',
        password: 'password'
      }

      Services::Users.register @user_hash
      @validation_code = @user_hash[:validation_code]
    }

    it 'checks if the validation code is a valid uuid' do
      expect(Services::Users.check_validation_code @validation_code).to eq(true)
      expect(Services::Users.check_validation_code 'otter_validation_code').to eq(false)
    end

    it 'checks if the validation_code exists in the repo' do
      expect(Services::Users.check_validation_code @validation_code).to eq(true)
      expect(Services::Users.check_validation_code '3c61cf77-32b0-4df2-9376-0960e64a654b').to eq(false)
    end

    it 'validates a user with a validation code' do
      Services::Users.validate_user @validation_code
      expect(Repos::Users.validated?({email: 'email@test.com'})).to eq(true)
    end
  end
end
