describe FormsController do

  let(:forms_route){'/forms'}
  let(:call_id){'b5bc4203-9379-4de0-856a-55e1e5f3fac6'}

  before(:each){
    @db['calls'].insert_one({
      call_id: call_id
    })
  }

  describe 'Get' do

    it 'fails if the call does not exist' do
      post forms_route, {}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('non_existing_call')
    end

    it 'retrieves the forms' do
      expect(Repos::Calls).to receive(:get_forms).with(call_id).and_return('forms')
      post forms_route, {call_id: call_id}
      expect(parsed_response['status']).to eq('success')
    end
  end
end