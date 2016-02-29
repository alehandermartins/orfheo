describe Services::Users do

  before(:each){

    @user_hash = {
      email: 'email@test.com',
      password: 'password'
    }

    @user = User.new @user_hash
  }

  describe 'Registration' do

    it 'registers and unvalidated user' do
      expect(Repos::Users).to receive(:add).with(hash_including(@user_hash))
      Services::Users.register @user_hash
    end

    it 'delivers welcome email' do
      expect(Services::Mails).to receive(:deliver_mail_to).with(hash_including(@user_hash), :welcome)

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
      Repos::Users.add(@user.to_h)
    }

    it 'checks if the validation code is a valid uuid' do
      expect(Services::Users.validated_user 'otter_validation_code').to eq(false)
    end

    it 'checks if the validation_code exists in the repo' do
      expect(Services::Users.validated_user 'otter_validation_code').to eq(false)
    end

    it 'returns the email of the user' do
      expect(Services::Users.validated_user @user[:validation_code]).to eq(@user[:user_id])
    end
  end

  describe 'LogIn' do

    before(:each){
      Repos::Users.add(@user.to_h)
    }

    it 'checks if the user and password match' do
      expect{Services::Users.user_id_for 'email@test.com', 'otterpassword'}.to raise_error(Pard::Invalid)
    end

    it 'checks if a user is validated' do
      expect{Services::Users.user_id_for 'email@test.com', 'otterpassword'}.to raise_error(Pard::Invalid)

      Services::Users.validated_user @user[:validation_code]
      expect(Services::Users.user_id_for @user[:email], @user[:password]).to eq(@user[:user_id])
    end

  end

  describe 'Forgotten password' do

    before(:each){
      Repos::Users.add(@user.to_h)
    }

    it 'adds a new validation_code to the user' do
      Services::Users.forgotten_password 'email@test.com'
      user = Repos::Users.grab({email: 'email@test.com'})

      expect(UUID.validate user[:validation_code]).to eq(true)
      expect(user[:validation_code]).not_to eq(@user[:validation_code])
    end

    it 'even if already validated' do
      Services::Users.validated_user @user[:validation_code]
      Services::Users.forgotten_password 'email@test.com'
      user = Repos::Users.grab({email: 'email@test.com'})

      expect(UUID.validate user[:validation_code]).to eq(true)
      expect(user[:validation_code]).not_to eq(@user[:validation_code])
    end

    it 'delivers forgotten_password email' do
      expect(Services::Mails).to receive(:deliver_mail_to).with(hash_including(@user_hash), :forgotten_password)

      Services::Users.forgotten_password 'email@test.com'
    end
  end

  describe 'Modify password' do

    it 'changes the old password for the new one' do
      Repos::Users.add(@user.to_h)
      Services::Users.modify_password @user[:user_id], 'new_password'
      expect(Repos::Users.grab({user_id: @user[:user_id]})[:password]).to eq('new_password')
    end
  end
end
