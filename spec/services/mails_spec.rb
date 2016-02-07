describe Services::Mails do

  describe 'Delivers mail' do
    before(:each){

      @validation_code = '3c61cf77-32b0-4df2-9376-0960e64a654a'

      @unvalidated_user_hash = {
        email: 'email@test.com',
        password: 'password',
        validation: false,
        validation_code: @validation_code
      }

      @mail = Services::Mails.deliver_mail_to @unvalidated_user_hash, :welcome
    }

    it 'renders the receiver email' do
      expect(@mail.to).to eq(['email@test.com'])
    end

    it 'renders the sender' do
      expect(@mail.from).to eq(['pard.project@gmail.com'])
    end
  end

  describe 'Welcome mail' do

    before(:each){

      @validation_code = '3c61cf77-32b0-4df2-9376-0960e64a654a'

      @unvalidated_user_hash = {
        email: 'email@test.com',
        password: 'password',
        validation: false,
        validation_code: @validation_code
      }

      @mail = Services::Mails.deliver_mail_to @unvalidated_user_hash, :welcome
    }

    it 'renders the subject' do
      expect(@mail.subject).to eq('Welcome to pard')
    end

    it 'assigns the validation code to the body' do
      expect(@mail.body).to include(@validation_code)
    end
  end

  describe 'Password mail' do

    before(:each){

      @validation_code = '3c61cf77-32b0-4df2-9376-0960e64a654a'

      @validated_user_hash = {
        email: 'email@test.com',
        password: 'password',
        validation: true,
        validation_code: @validation_code
      }

      @mail = Services::Mails.deliver_mail_to @validated_user_hash, :forgotten_password
    }

    it 'renders the subject' do
      expect(@mail.subject).to eq('Forgotten Password')
    end

    it 'assigns the validation code to the body' do
      expect(@mail.body).to include(@validation_code)
    end
  end
end
