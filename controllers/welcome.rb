class WelcomeController < BaseController

  get '/' do
    redirect '/users/' if session[:identity]
    erb :welcome
  end

	post '/contact' do
		scopify email: true, name: true, subject: true, message: true 
		check_params! params
		check_invalid_email email
		deliver_contact_email email, name, subject, message
		success
	end


	private
	def check_params! params
		raise Pard::Invalid::Params if params.any?{|param, value| value.blank?}	
	end

	def deliver_contact_email email, name, subject, message
		user = {email: 'info@orfheo.org'}
		payload = {from: email, name: name, subject: subject, message: message}
		Services::Mails.deliver_mail_to user, :contact, payload
	end
end

