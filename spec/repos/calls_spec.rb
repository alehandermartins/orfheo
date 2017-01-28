describe Repos::Calls do

  let(:user_id){'45825599-b8cf-499c-825c-a7134a3f1ff0'}
  let(:call_id){'b5bc4203-9379-4de0-856a-55e1e5f3fac6'}

  let(:call){
    {
      user_id: user_id,
      call_id: call_id,
    }
  }

  before(:each){
    @db['calls'].insert_one(call)
  }

  describe 'Exists?' do
    it 'checks if matched element is already in any document' do
      expect(Repos::Calls.exists? call_id).to eq(true)
      expect(Repos::Calls.exists? 'otter').to eq(false)
    end
  end

  describe 'Get forms' do

    it 'returns the specified calls' do
      expect(Repos::Calls.get_forms call_id).to eq({call_id: call_id})
    end
  end
end
