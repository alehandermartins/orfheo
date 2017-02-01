class WelcomeController < BaseController

  get '/' do
    redirect '/users/' if session[:identity]
    erb :welcome
  end

  post '/feedback' do
		scopify :email, :name, :message 
		check_params! params
		check_invalid_email email
		deliver_feedback_email email, name, message
		success
	end

	post '/techSupport' do
		scopify :email, :name, :subject, :profile, :browser, :message 
		check_params! params
		check_invalid_email email
		deliver_techSupport_email email, name, subject, profile, browser, message
		success
	end

	post '/business' do
		scopify :email, :name, :subject, :contactPhone, :contactHangout, :phone, :dayAvailability, :periodAvailability, :message
		check_params! params
		check_invalid_email email
		deliver_business_email email, name, subject, contactPhone, contactHangout, phone, dayAvailability, periodAvailability, message
		success
	end

	private
	def check_params! params
		raise Pard::Invalid::Params if [:email, :name, :message].any?{|field| params[field].blank?}	
	end

	def deliver_feedback_email email, name, message
		user = {email: 'info@orfheo.org'}
		payload = {from: email, name: name, message: message}
		Services::Mails.deliver_mail_to user, :feedback, payload
	end

	def deliver_techSupport_email email, name, subject, profile, browser, message
		user = {email: 'info@orfheo.org'}
		payload = {from: email, name: name, subject: subject, profile: profile, browser: browser, message: message}
		Services::Mails.deliver_mail_to user, :techSupport, payload
	end

	def deliver_business_email email, name, subject, contactPhone, contactHangout, phone, dayAvailability, periodAvailability, message
		user = {email: 'info@orfheo.org'}
		payload = {from: email, name: name, subject: subject, contactPhone: contactPhone, contactHangout: contactHangout, phone: phone, dayAvailability: dayAvailability, periodAvailability: periodAvailability, message: message}
		Services::Mails.deliver_mail_to user, :business, payload
	end
end

