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
            body: "<p> Bienvenido a Pard, para continuar con la inscripci\xF3n en el conFusi\xF3n activa tu cuenta con el siguiente enlace</p> <p><a href=\"http://pard.herokuapp.com/login/validate/#{user[:validation_code]}\">Activa tu cuenta</a> </p>"
          }
        end

        def forgotten_password user
          Pony.options = {
            subject: 'Forgotten Password',
            body: "<p> Puedes acceder a tu p\xE1gina de usuario a trav\xE9s del siguiente enlace </p> <p> <a href=\"http://pard.herokuapp.com/login/validate/#{user[:validation_code]}\">Accede a tu p\xE1gina</a></p> <p> Este enlace s\xF3lo es v\xE1lido una vez. Recuerda modificar tu contrase\xF1a una vez dentro. </p>"
          }
        end
      end
    end
  end
end
