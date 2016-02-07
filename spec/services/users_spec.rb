describe Services::Users do

  before(:each){

    @validation_code = '3c61cf77-32b0-4df2-9376-0960e64a654a'

    @user_hash = {
      email: 'email@test.com',
      password: 'password'
    }
  }

  describe 'Registration' do

    before(:each){

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
      expect(Services::Mails).to receive(:deliver_mail_to).with(@user_hash, :welcome)

      Services::Users.register @user_hash
    end
  end

  describe 'Exists?' do

    it 'checks if an email is already employed by other user' do
      Services::Users.register @user_hash
      expect(Services::Users.exists? 'email@test.com').to eq(true)
      expect(Services::Users.exists? 'otter@test.com').to eq(false)
    end
  end

  describe 'Validation' do

    before(:each){
      Services::Users.register @user_hash
      @validation_code = @user_hash[:validation_code]
    }

    it 'checks if the validation code is a valid uuid' do
      expect(Services::Users.validated_user 'otter_validation_code').to eq(false)
    end

    it 'checks if the validation_code exists in the repo' do
      expect(Services::Users.validated_user '3c61cf77-32b0-4df2-9376-0960e64a654b').to eq(false)
    end

    it 'returns the email of the user' do
      expect(Services::Users.validated_user @validation_code).to eq('email@test.com')
    end

    it 'checks if a user is validated' do
      expect(Services::Users.validated? 'email@test.com').to eq(false)
      Services::Users.validated_user @validation_code
      expect(Services::Users.validated? 'email@test.com').to eq(true)
    end
  end

  describe 'LogIn' do

    before(:each){
      Services::Users.register @user_hash
      Services::Users.validated_user @user_hash[:validation_code]
    }

    it 'checks if the user and password match' do
      expect(Services::Users.correct_password? 'email@test.com', 'password').to eq(true)
      expect(Services::Users.correct_password? 'email@test.com', 'otterpassword').to eq(false)
    end
  end

  describe 'Forgotten password' do

    before(:each){
      Services::Users.register @user_hash
    }

    it 'adds a new validation_code to the user' do
      Services::Users.forgotten_password 'email@test.com'
      user = Repos::Users.grab({email: 'email@test.com'})

      expect(UUID.validate user[:validation_code]).to eq(true)
      expect(user[:validation_code]).not_to eq(@user_hash[:validation_code])
    end

    it 'even if already validated' do
      Services::Users.validated_user @user_hash[:validation_code]
      Services::Users.forgotten_password 'email@test.com'
      user = Repos::Users.grab({email: 'email@test.com'})

      expect(UUID.validate user[:validation_code]).to eq(true)
      expect(user[:validation_code]).not_to eq(@user_hash[:validation_code])
    end

    it 'delivers forgotten_password email' do
      user = {
        email: 'email@test.com',
        password: 'password'
      }
      expect(Services::Mails).to receive(:deliver_mail_to).with(hash_including(user), :forgotten_password)

      Services::Users.forgotten_password 'email@test.com'
    end
  end

  describe 'Modify password' do

    it 'changes the old password for the new one' do
      Services::Users.register @user_hash
      Services::Users.modify_password 'email@test.com', 'new_password'
      expect(Repos::Users.grab({email: 'email@test.com'})[:password]).to eq('new_password')
    end
  end
end
