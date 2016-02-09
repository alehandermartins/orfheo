require 'pony'
module Services
  class Mails
    class << self

      def deliver_mail_to user, type
        MailBody.render(type, user)
        Pony.mail({
          to: user[:email]
        })
      end
    end

    private
    class MailBody
      class << self

        def render mail_type, user
          MailBody.send(mail_type, user)
        end

        private
        def welcome user
          Pony.options = {
            subject: 'Welcome to pard',
            body: "<a href=\"http://pard.herokuapp.com/login/validate/#{user[:validation_code]}\">Activate Account</a>"
          }
        end

        def forgotten_password user
          Pony.options = {
            subject: 'Forgotten Password',
            body: "<a href=\"http://pard.herokuapp.com/login/validate/#{user[:validation_code]}\">Proceed to your page</a>"
          }
        end
      end
    end
  end
end
