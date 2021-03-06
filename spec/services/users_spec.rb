describe Services::Users do

  let(:user_hash){
    {
      email: 'email@test.com',
      password: 'password',
      lang: 'en'
    }
  }

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:validation_code){'3c61cf77-32b0-4df2-9376-0960e64a654a'}

  let(:user){
    {
      user_id: user_id,
      email: 'email@test.com',
      password: 'password',
      lang: 'en',
      validation: false,
      validation_code: validation_code
    }
  }

  let(:event){
    {
      event_id: 'event_id',
      event_name: 'event_name'
    }
  }

  describe 'Registration' do

    before(:each){
      allow(SecureRandom).to receive(:uuid).and_return(user_id)
    }

    it 'registers and unvalidated user' do
      expect(Repos::Users).to receive(:add).with(hash_including(user_hash))
      Services::Users.register user_hash
    end

    it 'delivers welcome email' do
      expect(Services::Mails).to receive(:deliver_mail_to).with(hash_including(user_hash), :welcome)
      Services::Users.register user_hash
    end

    it 'delivers event email' do
      user_hash[:event_id] = 'event_id'
      allow(Repos::Events).to receive(:exists?).with('event_id').and_return(true)
      allow(Repos::Events).to receive(:get_event).and_return({name: 'event_name'})
      expect(Services::Mails).to receive(:deliver_mail_to).with(hash_including(password: 'password', email: 'email@test.com'), :event, event)
      Services::Users.register user_hash
    end
  end

  describe 'Exists?' do

    it 'checks if an email is already employed by other user' do
      Services::Users.register user_hash
      expect(Services::Users.exists? 'email@test.com').to eq(true)
      expect(Services::Users.exists? 'otter@test.com').to eq(false)
    end
  end

  describe 'Validation' do

    before(:each){
      Repos::Users.add(user)
    }

    it 'checks if the validation code is a valid uuid' do
      expect(Services::Users.validated_user 'otter_validation_code').to eq(false)
    end

    it 'checks if the validation_code exists in the repo' do
      expect(Services::Users.validated_user 'otter_validation_code').to eq(false)
    end

    it 'returns the uuid of the user' do
      expect(Services::Users.validated_user user[:validation_code]).to eq(user[:user_id])
    end
  end

  describe 'User_for' do

    before(:each){
      Repos::Users.add(user)
    }

    it 'checks if the user and password match' do
      expect{Services::Users.user_for 'email@test.com', 'otterpassword'}.to raise_error(Pard::Invalid::Password)
    end

    it 'checks if a user is validated' do
      expect{Services::Users.user_for user[:email], user[:password]}.to raise_error(Pard::Invalid::Unvalidated)
    end

    it 'returns the uuid of the user' do
      Services::Users.validated_user user[:validation_code]
      user.delete(:validation_code)
      user[:validation] = true
      expect(Services::Users.user_for user[:email], user[:password]).to eq(user)
    end
  end

  describe 'Forgotten password' do

    before(:each){
      Repos::Users.add(user)
    }

    it 'delivers forgotten_password email to user' do
      expect(Services::Mails).to receive(:deliver_mail_to).with(hash_including(user_hash), :forgotten_password)
      Services::Users.forgotten_password 'email@test.com'
    end
  end

  describe 'Modify password' do

    it 'changes the old password for the new one' do
      Repos::Users.add(user)
      Services::Users.modify_password user[:user_id], 'new_password'
      expect(Repos::Users.grab({user_id: user[:user_id]})[:password]).to eq('new_password')
    end
  end

  describe 'Delete' do
    it 'deletes a user' do
      expect(Repos::Profiles).to receive(:get_user_profiles).with(user_id).and_return([{profile_id: 'user_profile'}])
      expect(Services::Profiles).to receive(:delete_profile).with('user_profile').and_return(true)
      expect(Repos::Users).to receive(:delete_user).with(user_id)
      Services::Users.delete_user user_id
    end
  end
end