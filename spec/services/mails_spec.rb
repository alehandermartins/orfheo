describe Services::Mails do

  describe 'Welcome mail' do

    before(:each){
      @validation_code = '3c61cf77-32b0-4df2-9376-0960e64a654a'


      @unvalidated_user_hash = {
        email: 'email@test.com',
        password: 'password',
        validation: false,
        validation_code: @validation_code
      }

      @mail_hash = {
        from: ['pard.project@gmail.com'],
        subject: 'Welcome to pard',
        body: @validation_code
      }

      @mail = Services::Mails.deliver_welcome_mail_to @unvalidated_user_hash
    }

    it 'renders the receiver email' do
      expect(@mail.to).to eq(['email@test.com'])
    end

    it 'renders the sender' do
      expect(@mail.from).to eql(@mail_hash[:from])
    end

    it 'renders the subject' do
      expect(@mail.subject).to eql(@mail_hash[:subject])
    end

    it 'assigns the validation code to the body' do
      expect(@mail.body).to match(@mail_hash[:body])
    end
  end
end
