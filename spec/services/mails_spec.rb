describe Services::Mails do

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:validation_code){'3c61cf77-32b0-4df2-9376-0960e64a654a'}

  let(:user){
    {
      user_id: user_id,
      email: 'email@test.com',
      password: 'password',
      validation: false,
      validation_code: validation_code
    }
  }

  let(:welcome_mail){Services::Mails.deliver_mail_to user, :welcome}

  describe 'Delivers mail' do

    it 'renders the receiver email' do
      expect(welcome_mail.to).to eq(['email@test.com'])
    end

    it 'renders the sender' do
      expect(welcome_mail.from).to eq(['pard.project@gmail.com'])
    end
  end

  describe 'Welcome mail' do

    it 'renders the subject' do
      expect(welcome_mail.subject).to eq('Bienvenido/a a orfheo')
    end

    it 'assigns the validation code to the body' do
      expect(welcome_mail.body).to include(validation_code)
    end
  end

  describe 'Password mail' do

    let(:password_mail){ Services::Mails.deliver_mail_to user, :forgotten_password}

    it 'renders the subject' do
      expect(password_mail.subject).to eq('Recupera tu cuenta')
    end

    it 'assigns the validation code to the body' do
      expect(password_mail.body).to include(validation_code)
    end
  end
end
