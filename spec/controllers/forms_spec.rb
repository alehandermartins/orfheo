describe FormsController do

  let(:forms_route){'/forms'}

  describe 'Get' do

    it 'fails if the type does not exist' do
      post forms_route, {}
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_type')
    end

    it 'retrieves the correct form' do
      post forms_route, {type: 'create_organization'}
      expect(parsed_response['status']).to eq('success')
      expect(parsed_response['form']).to eq(Util.stringify_hash Forms.get('create_organization'))
    end
  end
end