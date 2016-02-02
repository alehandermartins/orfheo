describe Services::Mails do

  describe 'Welcome mail' do

    before(:each){

      @mail_hash = {
        from: ['alehander.marti@gmail.com'],
        subject: 'This is a test email',
        body: 'Not much to say here'
      }

      @mail = Services::Mails.welcome_mail 'email'
    }

    it 'renders the receiver email' do
      expect(@mail.to).to eq(['email'])
    end

    it 'renders the sender email' do
       expect(@mail.from).to eq(@mail_hash[:from])
    end

    it 'renders the subject' do
      expect(@mail.subject).to eql(@mail_hash[:subject])
    end

    it 'assigns the body' do
      expect(@mail.body).to match(@mail_hash[:body])
    end

    it 'composes the mail' do
      expect(Services::Mails.deliver_mail 'email').to eq(@mail)
    end

    it 'delivers the mail' do
      expect(@mail).to receive(:deliver!)
      Services::Mails.deliver @mail
    end
  end
end
