require 'mail'
module Services
  class Mails
    class << self

      def deliver_welcome_mail_to user
        mail = welcome_mail_to user
        deliver mail
      end

      def welcome_mail_to user
        mail = Mail.new do
          to user[:email]
          from 'pard.project@gmail.com'
          subject 'This is a test email'
          body user[:validation_code]
        end
      end

      def deliver mail
        mail.deliver!
      end
    end
  end
end
