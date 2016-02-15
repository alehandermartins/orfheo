describe Services::Calls do

  before(:each){

    @user_id = 'email@test.com'
    @call_id = 'b5bc4203-9379-4de0-856a-55e1e5f3fac6'

    @call_hash = {}

  }

  describe 'Registration' do

    it 'adds the user_id to the call' do
      Services::Calls.register @call_hash, @user_id
      expect(@call_hash[:user_id]).to eq(@user_id)
    end

    it 'adds a call_id' do
      Services::Calls.register @call_hash, @user_id
      expect(UUID.validate @call_hash[:call_id]).to eq(true)
    end

    it 'registers the call' do
      expect(Repos::Calls).to receive(:add).with(@call_hash)
      Services::Calls.register @call_hash, @user_id
    end
  end
end
