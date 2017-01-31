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
            from: "no.reply.orfheo@gmail.com",
            subject: 'Bienvenido/a a Orfheo',
            body: "<p> Bienvenido/a a Orfheo. Activa tu cuenta con el siguiente enlace</p> <p><a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}\">Activa tu cuenta</a> </p>"
          }
        end

        def event user, event
          Pony.options = {
            from: "no.reply.orfheo@gmail.com",
            subject: 'Bienvenido/a a Orfheo',
            body: "<p> Bienvenido/a a Orfheo. Para continuar con la inscripción en el #{event[:event_name]} activa tu cuenta con el siguiente enlace</p> <p><a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}&event_id=#{event[:event_id]}\">Activa tu cuenta</a> </p>"
          }
        end

        def forgotten_password user, payload
          Pony.options = {
            from: "no.reply.orfheo@gmail.com",
            subject: 'Recupera tu cuenta',
            body: "<p> Puedes acceder a tu página de usuario a través del siguiente enlace </p> <p> <a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}\">Accede a tu página</a></p> <p> Este enlace sólo es válido una vez. Si no recuerdas tu contraseña, no olvides definir una nueva una vez dentro. </p>"
          }
        end

        def rejected user, payload
          Pony.options = {
            from: "no.reply.orfheo@gmail.com",
            subject: 'Propuesta rechazada',
            body: "<p> Lamentablemente, #{payload[:organizer]} ha rechazado tu propuesta \"#{payload[:title]}\" para el #{payload[:event_name]}</p> <p><a href=\"http://www.orfheo.org/\">Orfheo</a></p>"
          }
        end

        def new_event user, payload
          Pony.options = {
            from: "no.reply.orfheo@gmail.com",
            subject: 'Convocatoria VII Festival Extramurs Abierta!',
            body: "<p> Orfheo te invita a inscribirte como participante en el VII Distrito 008 Festival Urbano de Extramurs!!!</p><p>Envía tu propuesta antes del 26 de diciembre, te lo ponemos muy fácil.</p><p>Puedes acceder a la convocatoria a través del siguiente link:</p><p><a href=\"http://www.orfheo.org/event?id=a6bc4203-9379-4de0-856a-55e1e5f3fac6\">Orfheo/Extramurs</a></p>"
          }
        end

        def feedback user, payload
          Pony.options = {
            from: payload[:from],
            subject: 'feedback',
            body: "<p>Mensaje de #{payload[:name]}</p><p>#{payload[:message]}</p>"
          }
        end

        def techSupport user, payload
          Pony.options = {
            from: payload[:from],
            subject: 'techSupport',
            body: "<p>Mensaje de #{payload[:name]}</p><p>Asunto: #{payload[:subject]}</p><p>Perfil: #{payload[:profile]}</p><p>Navegador: #{payload[:browser]}</p><p>#{payload[:message]}</p>"
          }
        end

        def business user, payload
          Pony.options = {
            from: payload[:from],
            subject: 'business',
            body: "<p>Mensaje de #{payload[:name]}</p><p>Asunto: #{payload[:subject]}</p><p>Teléfono: #{payload[:phone]}</p><p>Contacto teléfono: #{payload[:contactPhone]}</p><p>Contacto Hangout: #{payload[:contactHangout]}</p><p>Disponibilidad: #{payload[:dayAvailability]}</p><p>Disponibilidad horaria: #{payload[:periodAvailability]}</p><p>#{payload[:message]}</p>"
          }
        end
      end
    end
  end
end
