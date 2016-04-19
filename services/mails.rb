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
            body: "<p> Bienvenido a Pard, para continuar con la inscripción en el conFusión activa tu cuenta con el siguiente enlace</p> <p><a href=\"http://pard.herokuapp.com/login/validate/#{user[:validation_code]}\">Activa tu cuenta</a> </p>"
          }
        end

        def forgotten_password user
          Pony.options = {
            subject: 'Forgotten Password',
            body: "<p> Puedes acceder a tu página de usuario a través del siguiente enlace </p> <p> <a href=\"http://pard.herokuapp.com/login/validate/#{user[:validation_code]}\">Accede a tu página</a></p> <p> Este enlace sólo es válido una vez. Recuerda modificar tu contraseña una vez dentro. </p>"
          }
        end
      end
    end
  end
end
