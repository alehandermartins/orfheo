require 'pony'
module Services
  class Mails
    class << self

      def deliver_mail_to user, type, payload = nil
        MailBody.render(type, user, payload)
        Pony.mail({
          to: user[:email]
        })
      end
    end

    private
    class MailBody
      class << self

        def render mail_type, user, payload
          MailBody.send(mail_type, user, payload)
        end

        private
        def welcome user, payload
          Pony.options = {
            subject: 'Bienvenido/a a Orfheo',
            body: "<p> Bienvenido/a a Orfheo. Activa tu cuenta con el siguiente enlace</p> <p><a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}\">Activa tu cuenta</a> </p>"
          }
        end

        def event user, event
          Pony.options = {
            subject: 'Bienvenido/a a Orfheo',
            body: "<p> Bienvenido/a a Orfheo. Para continuar con la inscripción en el #{event[:event_name]} activa tu cuenta con el siguiente enlace</p> <p><a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}&event_id=#{event[:event_id]}\">Activa tu cuenta</a> </p>"
          }
        end

        def forgotten_password user, payload
          Pony.options = {
            subject: 'Recupera tu cuenta',
            body: "<p> Puedes acceder a tu página de usuario a través del siguiente enlace </p> <p> <a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}\">Accede a tu página</a></p> <p> Este enlace sólo es válido una vez. Si no recuerdas tu contraseña, no olvides definir una nueva una vez dentro. </p>"
          }
        end

        def rejected user, payload
          Pony.options = {
            subject: 'Propuesta rechazada',
            body: "<p> Lamentablemente, #{payload[:organizer]} ha rechazado tu propuesta \"#{payload[:title]}\" para el #{payload[:event_name]}</p> <p><a href=\"http://www.orfheo.org/\">Orfheo</a></p>"
          }
        end
      end
    end
  end
end
