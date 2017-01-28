describe Call do

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:call_id){'b5bc4203-9379-4de0-856a-55e1e5f3fac6'}

  let(:call_params){
    {
      call_id: call_id
    }
  }

  describe 'Initialize' do

    it 'assigns the user_id to the call' do
      call = Call.new call_params, user_id
      expect(call[:user_id]).to eq(user_id)
    end

    it 'assigns the predefined uuid to the call_id' do
      call = Call.new call_params, user_id
      expect(call[:call_id]).to eq(call_id)
    end
  end
end
