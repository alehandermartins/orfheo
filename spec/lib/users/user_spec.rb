describe User do

  before(:each){
    @user_id = '5c41cf77-32b0-4df2-9376-0960e64a654a'
    @validation_code = '3c61cf77-32b0-4df2-9376-0960e64a654a'

    @user_hash = {
      email: 'email@test.com',
      password: 'password'
    }

    @user = User.new @user_hash
  }

  describe 'Registration' do

    it 'adds user_id to a user' do
      expect(UUID.validate @user[:user_id]).to eq(true)
    end

    it 'adds validation: false to a user' do
      expect(@user[:validation]).to eq(false)
    end

    it 'adds validation_code: uuid to a user' do
      expect(UUID.validate @user[:validation_code]).to eq(true)
    end
  end
end
