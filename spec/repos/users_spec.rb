describe Repos::Users do

  before(:each){
      @validation_code = '3c61cf77-32b0-4df2-9376-0960e64a654a'

      @unvalidated_user_hash = {
        email: 'email@test.com',
        password: 'password',
        validation: false,
        validation_code: @validation_code
      }

      Repos::Users.add @unvalidated_user_hash
    }

  describe 'Add' do

    it 'registers an unvalidated user' do
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
    it 'checks if matched element is already in any document' do
      expect(Repos::Users.exists?({email:'email@test.com'})).to eq(true)
      expect(Repos::Users.exists?({email:'otter@test.com'})).to eq(false)
    end
  end

  describe 'Validate' do

    before(:each){
      Repos::Users.validate({validation_code: @validation_code})
    }

    it 'validates a user' do
      saved_entry = @db['users'].find_one()
      expect(saved_entry).to include({
        'email' => 'email@test.com',
        'password' => 'password',
        'validation' => true,
      })
    end

    it 'deletes the validation_code from the saved_entry' do
      saved_entry = @db['users'].find_one()
      expect(saved_entry).not_to include({
        'validation_code' => @validation_code
      })
    end
  end

  describe 'Grab' do

    it 'returns the desired document' do
      Repos::Users.validate({validation_code: @validation_code})

      expect(Repos::Users.grab({email:'email@test.com'})).to include({
        email: 'email@test.com',
        password: 'password',
        validation: true,
      })
    end
  end
end
