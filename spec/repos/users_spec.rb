describe Repos::Users do

  describe 'Add' do

    before(:each){
      @validation_code = '3c61cf77-32b0-4df2-9376-0960e64a654a'

      @unvalidated_user_hash = {
        email: 'email@test.com',
        password: 'password',
        validation: false,
        validation_code: @validation_code
      }
    }

    it 'registers an unvalidated user' do

      Repos::Users.add @unvalidated_user_hash

      saved_entry = @db['users'].find_one()
      expect(saved_entry).to include({
        'email' => 'email@test.com',
        'password' => 'password',
        'validation' => false,
        'validation_code' => @validation_code
      })
    end
  end

  describe 'Exists?' do

    before(:each){
      @validation_code = '3c61cf77-32b0-4df2-9376-0960e64a654a'

      @unvalidated_user_hash = {
        email: 'email@test.com',
        password: 'password',
        validation: false,
        validation_code: @validation_code
      }
    }

    it 'checks if the user is already registered' do

      Repos::Users.add @unvalidated_user_hash

      expect(Repos::Users.exists? 'email@test.com').to eq(true)
      expect(Repos::Users.exists? 'otter@test.com').to eq(false)
    end
  end
end
