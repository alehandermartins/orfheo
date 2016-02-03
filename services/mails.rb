require 'pony'
module Services
  class Mails
    class << self

      def deliver_welcome_mail_to user
        Pony.mail({
          :to => user[:email],
          :from => 'pard.project@gmail.com',
          :subject => 'Welcome to pard',
          :body => user[:validation_code],
          :via => :smtp,
          :via_options => {
            :address => 'smtp.sendgrid.net',
            :port => '587',
            :domain => 'heroku.com',
            :user_name => 'app47085092@heroku.com',
            :password => 'a9awf3mj5410',
            :authentication => :plain,
            :enable_starttls_auto => true
          }
        })
      end
    end
  end
end
