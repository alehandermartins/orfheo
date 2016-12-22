class WelcomeController < BaseController

  get '/' do
    redirect '/users/' if session[:identity]
    erb :welcome
  end

	post '/contact' do
		scopify email: true, name: true, subject: true, messaje: true 
		check_params! params
		check_invalid_email email
		deliver_contact_email email, name, subject, messaje
	end


	private
	def check_params! params
		raise raise Pard::Invalid::Params if params.any? {|param| param.blank?}			
	end

	def deliver_contact_mail email, name, subject, messaje
		#user = {email: 'info@orfheo.org'}
		user = {email: 'alehander.marti@gmail.com'}
		payload = {from: email, name: name, subject: subject, messaje: messaje}
		Services::Mails.deliver_mail_to user, :contact, payload
	end
end

