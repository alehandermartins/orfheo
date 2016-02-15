describe Repos::Calls do

  before(:each){
    @user_id = '3c61cf77-32b0-4df2-9376-0960e64a654a'
    @call_id = 'b5bc4203-9379-4de0-856a-55e1e5f3fac6'

    @call_params = {
      user_id: @user_id,
      call_id: @call_id,
    }
    Repos::Calls.add(@call_params)
  }

  describe 'Add' do

    it 'registers a new call' do
      saved_entry = @db['calls'].find_one()
      expect(saved_entry).to include({
        'user_id' => @user_id,
        'call_id' => @call_id,
      })
    end
  end

  describe 'Exists?' do
    it 'checks if matched element is already in any document' do
      expect(Repos::Calls.exists?({call_id: @call_id})).to eq(true)
      expect(Repos::Calls.exists?({call_id:'otter'})).to eq(false)
    end
  end

  describe 'Grab' do

    it 'returns the desired document' do
      expect(Repos::Calls.grab({call_id:@call_id}).first).to include({
        user_id: @user_id,
        call_id: @call_id,
      })
    end
  end
end
