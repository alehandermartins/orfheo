class WelcomeController < BaseController

  get '/' do
    redirect '/users/' if session[:identity]
    erb :welcome
  end

  get '/services' do
  	status = :visitor if session[:identity]
    status = :outsider if session[:identity].blank?
    erb :services, :locals => {status: status.to_json}
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
		scopify :email, :name, :subject, :contactPhone, :contactHangout, :phone, :dayAvailabilty, :periodAvailabilty, :links, :message
		check_business_params! params
		check_invalid_email email
		deliver_business_email email, name, subject, contactPhone, contactHangout, phone, dayAvailabilty, periodAvailabilty, links, message
		success
	end

	get '/event/Distrito008' do
		redirect "http://www.orfheo.org/event?id=a6bc4203-9379-4de0-856a-55e1e5f3fac6"
	end

	private
	def check_params! params
		raise Pard::Invalid::Params if [:email, :name, :message].any?{|field| params[field].blank?}	
	end

	def check_business_params! params
		raise Pard::Invalid::Params if [:email, :name, :message, :subject].any?{|field| params[field].blank?}
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

	def deliver_business_email email, name, subject, contactPhone, contactHangout, phone, dayAvailability, periodAvailability, links, message
		user = {email: 'info@orfheo.org'}
		payload = {from: email, name: name, subject: subject, contactPhone: contactPhone, contactHangout: contactHangout, phone: phone, dayAvailability: dayAvailability, periodAvailability: periodAvailability, links: links, message: message}
		Services::Mails.deliver_mail_to user, :business, payload
	end
end

