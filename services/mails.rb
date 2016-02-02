require 'mail'
module Services
  class Mails
    class << self

      def deliver_mail email
        mail = welcome_mail email
        deliver mail
      end

      def welcome_mail email
        mail = Mail.new do
          to email
          from 'alehander.marti@gmail.com'
          subject 'This is a test email'
          body 'Not much to say here'
        end
      end

      def deliver mail
        mail.deliver!
      end
    end
  end
end
