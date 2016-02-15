describe Repos::Calls do

  before(:each){
    @user_id = '3c61cf77-32b0-4df2-9376-0960e64a654a'
    @call_id = 'b5bc4203-9379-4de0-856a-55e1e5f3fac6'
    @profile_id = 'fce01c94-4a2b-49ff-b6b6-dfd53e45bb83'
    @proposal_id = 'b11000e7-8f02-4542-a1c9-7f7aa18752ce'

    @call_params = {
      user_id: @user_id,
      call_id: @call_id,
    }

    @proposal_params = {
      user_id: @user_id,
      profile_id: @profile_id,
      proposal_id: @proposal_id
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

  describe 'Push' do

    it 'adds a proposal to the array of proposals' do


      @otter_params = {
        user_id: 'otter_user',
        profile_id: 'otter_profile',
        proposal_id: 'otter_proposal'
      }

      Repos::Calls.push({call_id:@call_id}, @proposal_params)
      Repos::Calls.push({call_id:@call_id}, @otter_params)

      expect(Repos::Calls.grab({call_id:@call_id}).first).to include(
        proposals: [@proposal_params, @otter_params]
      )
    end
  end
end
