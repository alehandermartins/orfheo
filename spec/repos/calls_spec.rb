describe Repos::Calls do

  let(:user_id){'45825599-b8cf-499c-825c-a7134a3f1ff0'}
  let(:call_id){'b5bc4203-9379-4de0-856a-55e1e5f3fac6'}

  let(:call){
    {
      user_id: user_id,
      call_id: call_id,
      texts: {
        en: {
          form_categories:{
            "1" => 'music_form',
            "3" => 'arts_form'
          },
          blocks: {
            "1" => 'first_block',
            "2" => 'second_block',
            "3" => 'third_block'
          }
        },
        es: {
          form_categories:{
            "1" => 'formulario_musica',
            "3" => 'formulario_artes'
          },
          blocks: {
            "1" => 'primer_block',
            "2" => 'segundo_block',
            "3" => 'tercer_block'
          }
        } 
      },
      forms: {
        artist: {
          "1" => {
            categories: 'music',
            blocks: ["1","2"]
          },
          "3" => {
            categories: 'arts',
            blocks: ["3"]
          }
        }
      }
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
      expect(Repos::Calls.get_forms call_id, :es).to eq(call)
    end
  end
end
