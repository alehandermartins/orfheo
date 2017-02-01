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

  let(:feedback){
    {
      from: 'contacter@contact',
      name: 'contacter',
      message: 'message'
    }
  }

  let(:techSupport){
    {
      from: 'contacter@contact',
      name: 'contacter',
      message: 'message',
      subject: 'need_help',
      profile: 'my_profile',
      browser: 'firefox',
      message: 'help'
    }
  }

  let(:business){
    {
      from: 'contacter@contact',
      name: 'contacter',
      message: 'message',
      subject: 'business',
      contact: 'phone',
      phone: '123456789',
      dayAvailability: 'dayAvailability',
      periodAvailability: 'periodAvailability',
      message: 'message'
    }
  }

  let(:welcome_mail){Services::Mails.deliver_mail_to user, :welcome}

  describe 'Delivers mail' do

    it 'renders the receiver email' do
      expect(welcome_mail.to).to eq(['email@test.com'])
    end
  end

  describe 'Welcome mail' do

    it 'renders the subject' do
      expect(welcome_mail.subject).to eq('Bienvenido/a a Orfheo')
    end

    it 'renders the sender' do
      expect(welcome_mail.from).to eq(["no.reply.orfheo@gmail.com"])
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

    it 'renders the sender' do
      expect(event_mail.from).to eq(["no.reply.orfheo@gmail.com"])
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

    it 'renders the sender' do
      expect(password_mail.from).to eq(["no.reply.orfheo@gmail.com"])
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

    it 'renders the sender' do
      expect(rejected_mail.from).to eq(["no.reply.orfheo@gmail.com"])
    end

    it 'assigns the message to the body' do
      expect(rejected_mail.body).to include('Lamentablemente, organizer ha rechazado tu propuesta "title" para el event_name')
    end
  end

  describe 'Feedback' do

    let(:feedback_mail){ Services::Mails.deliver_mail_to user, :feedback, feedback}

    it 'renders the subject' do
      expect(feedback_mail.subject).to eq('feedback')
    end

    it 'renders the sender' do
      expect(feedback_mail.from).to eq(['contacter@contact'])
    end

    it 'assigns the message to the body' do
      expect(feedback_mail.body).to include('<p>Mensaje de contacter</p><p>message</p>')
    end
  end

  describe 'TechSupport' do

    let(:tech_mail){ Services::Mails.deliver_mail_to user, :techSupport, techSupport}

    it 'renders the subject' do
      expect(tech_mail.subject).to eq('techSupport')
    end

    it 'renders the sender' do
      expect(tech_mail.from).to eq(['contacter@contact'])
    end

    it 'assigns the message to the body' do
      expect(tech_mail.body).to include('<p>Mensaje de contacter</p><p>Asunto: need_help</p><p>Perfil: my_profile</p><p>Navegador: firefox</p><p>help</p>')
    end
  end

  describe 'Business' do

    let(:business_mail){ Services::Mails.deliver_mail_to user, :business, business}

    it 'renders the subject' do
      expect(business_mail.subject).to eq('services')
    end

    it 'renders the sender' do
      expect(business_mail.from).to eq(['contacter@contact'])
    end

    it 'assigns the message to the body' do
      expect(business_mail.body).to include('<p>Mensaje de contacter</p><p>Asunto: business</p><p>Tipo de contacto: phone</p><p>Teléfono: 123456789</p><p>Disponibilidad: dayAvailability</p><p>Disponibilidad horaria: periodAvailability</p><p>message</p>')
    end
  end
end
