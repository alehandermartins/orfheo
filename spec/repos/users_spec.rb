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

      @unvalidated_user_hash = {
        email: 'email@test.com',
        password: 'password',
        validation: false,
        validation_code: '3c61cf77-32b0-4df2-9376-0960e64a654a'
      }
    }

    it 'checks if matched element is already in any document' do

      Repos::Users.add @unvalidated_user_hash

      expect(Repos::Users.exists?({email:'email@test.com'})).to eq(true)
      expect(Repos::Users.exists?({email:'otter@test.com'})).to eq(false)
    end
  end

  describe 'Validate' do

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

    it 'validates a user' do
      Repos::Users.validate({validation_code: @validation_code})
      saved_entry = @db['users'].find_one()
      expect(saved_entry).to include({
        'email' => 'email@test.com',
        'password' => 'password',
        'validation' => true,
      })
    end

    it 'deletes the validation_code from the saved_entry' do
      Repos::Users.validate({validation_code: @validation_code})
      saved_entry = @db['users'].find_one()
      expect(saved_entry).not_to include({
        'validation_code' => @validation_code
      })
    end
  end

  describe 'Grab' do

    before(:each){

      @unvalidated_user_hash = {
        email: 'email@test.com',
        password: 'password',
        validation: false,
        validation_code: @validation_code
      }

      Repos::Users.add @unvalidated_user_hash
      Repos::Users.validate({validation_code: @validation_code})
    }

    it 'returns the desired document' do
      expect(Repos::Users.grab({email:'email@test.com'})).to include({
        'email' => 'email@test.com',
        'password' => 'password',
        'validation' => true,
      })
    end
  end
end
