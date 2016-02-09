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
            body: "<p> Bienvenido a Pard, para continuar con la inscripci\162n en el conFusi\162n activa tu cuenta con el siguiente enlace</p> <p><a href=\"http://pard.herokuapp.com/login/validate/#{user[:validation_code]}\">Activa tu cuenta</a> </p>"
          }
        end

        def forgotten_password user
          Pony.options = {
            subject: 'Forgotten Password',
            body: "<p> Puedes acceder a tu p\160gina de usuario a trav\130s del siguiente enlace </p> <p> <a href=\"http://pard.herokuapp.com/login/validate/#{user[:validation_code]}\">Accede a tu p\160gina</a></p> <p> Este enlace s\162lo es v\160lido una vez. Recuerda modificar tu contrase\164a una vez dentro. </p>"
          }
        end
      end
    end
  end
end
