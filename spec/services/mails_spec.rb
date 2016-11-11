describe Services::Mails do

  let(:user_id){'5c41cf77-32b0-4df2-9376-0960e64a654a'}
  let(:validation_code){'3c61cf77-32b0-4df2-9376-0960e64a654a'}
  let(:event_id){'a5bc4203-9379-4de0-856a-55e1e5f3fac6'}

  let(:user){
    {
      user_id: user_id,
      email: 'email@test.com',
      password: 'password',
      validation: false,
      validation_code: validation_code
    }
  }

  let(:event){
    {
      event_id: event_id,
      event_name: 'event_name'
    }
  }

  let(:rejection){
    {
      organizer: 'organizer',
      title: 'title',
      event_name: 'event_name'
    }
  }

  let(:welcome_mail){Services::Mails.deliver_mail_to user, :welcome}

  describe 'Delivers mail' do

    it 'renders the receiver email' do
      expect(welcome_mail.to).to eq(['email@test.com'])
    end

    it 'renders the sender' do
      expect(welcome_mail.from).to eq(['no.reply.orfheo@gmail.com'])
    end
  end

  describe 'Welcome mail' do

    it 'renders the subject' do
      expect(welcome_mail.subject).to eq('Bienvenido/a a Orfheo')
    end

    it 'assigns the validation code to the body' do
      expect(welcome_mail.body).to include(validation_code)
    end
  end

  describe 'Event mail' do
    let(:event_mail){ Services::Mails.deliver_mail_to user, :event, event}

    it 'renders the subject' do
      expect(event_mail.subject).to eq('Bienvenido/a a Orfheo')
    end

    it 'assigns the validation code and event code to the body' do
      expect(event_mail.body).to include(validation_code + '&event_id=' + event_id)
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

  describe 'Rejected' do

    let(:rejected_mail){ Services::Mails.deliver_mail_to user, :rejected, rejection}

    it 'renders the subject' do
      expect(rejected_mail.subject).to eq('Propuesta rechazada')
    end

    it 'assigns the validation code to the body' do
      expect(rejected_mail.body).to include('Lamentablemente, organizer ha rechazado tu propuesta "title" para el event_name')
    end
  end
end
