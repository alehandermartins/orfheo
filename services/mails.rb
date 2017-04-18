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
          options = {
            es: {
              from: "no.reply.orfheo@gmail.com",
              subject: 'Bienvenido/a a Orfheo',
              body: "<p> Bienvenido/a a Orfheo. Activa tu cuenta con el siguiente enlace</p> <p><a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}\">Activa tu cuenta</a> </p>"
            },
            en: {
              from: "no.reply.orfheo@gmail.com",
              subject: 'Welcome to Orfheo',
              body: "<p> Welcome to Orfheo. Activate your account with the following link</p> <p><a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}\">Activate your account</a> </p>"
            },
            ca: {
              from: "no.reply.orfheo@gmail.com",
              subject: 'Benvingut/da a Orfheo',
              body: "<p> Benvingut/da a Orfheo. Activa el teu compte amb el següent enllaç</p> <p><a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}\">Activa el teu compte</a> </p>"
            }
          }
          Pony.options = options[user[:lang].to_sym]
        end

        def event user, event
          options = {
            es: {
              from: "no.reply.orfheo@gmail.com",
              subject: 'Bienvenido/a a Orfheo',
              body: "<p> Bienvenido/a a Orfheo. Para continuar con la inscripción en el #{event[:event_name]} activa tu cuenta con el siguiente enlace</p> <p><a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}&event_id=#{event[:event_id]}\">Activa tu cuenta</a> </p>"
            },
            en: {
              from: "no.reply.orfheo@gmail.com",
              subject: 'Welcome to Orfheo',
              body: "<p> Welcome to Orfheo. In order to continue with the registration in the #{event[:event_name]} activate your account with the following link</p> <p><a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}&event_id=#{event[:event_id]}\">Activate your account</a> </p>"
            },
            ca: {
              from: "no.reply.orfheo@gmail.com",
              subject: 'Benvingut/da a Orfheo',
              body: "<p> Benvingut/da a Orfheo. Per continuar amb la inscripció en el #{event[:event_name]} activa el teu compte amb el següent enllaç</p> <p><a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}&event_id=#{event[:event_id]}\">Activa el teu compte</a> </p>"
            }
          }
          Pony.options = options[user[:lang].to_sym]
        end

        def forgotten_password user, payload
          options = {
            es: {
              from: "no.reply.orfheo@gmail.com",
              subject: 'Recupera tu cuenta',
              body: "<p> Puedes acceder a tu página de usuario a través del siguiente enlace </p> <p> <a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}\">Accede a tu página</a></p> <p> Este enlace sólo es válido una vez. Si no recuerdas tu contraseña, no olvides definir una nueva una vez dentro. </p>"
            },
            en: {
              from: "no.reply.orfheo@gmail.com",
              subject: 'Recover your account',
              body: "<p> You can access your user page through the following link </p> <p> <a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}\">Access your page</a></p> <p> This link is only valid once. If you do not remember your password, do not forget to define a new one once inside. </p>"
            },
            ca: {
              from: "no.reply.orfheo@gmail.com",
              subject: 'Recupera el teu compte',
              body: "<p> Pots accedir a la teva pàgina d'usuari mitjançant el següent enllaç </p> <p> <a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}\">Accedeix a la teva pàgina</a></p> <p> Aquest enllaç només és vàlid un cop. Si no recordes la contrasenya, no oblidis definir una nova un cop dins. </p>"
            },
          }
          Pony.options = options[user[:lang].to_sym]
        end

        def rejected user, payload
          options = {
            es: {
              from: "no.reply.orfheo@gmail.com",
              subject: 'Propuesta rechazada',
              body: "<p> Lamentablemente, #{payload[:organizer]} ha rechazado tu propuesta \"#{payload[:title]}\" para el #{payload[:event_name]}</p> <p><a href=\"http://www.orfheo.org/\">Orfheo</a></p>"
            },
            en: {
              from: "no.reply.orfheo@gmail.com",
              subject: 'Proposal rejected',
              body: "<p> Unfortunately, #{payload[:organizer]} has rejected your proposal \"#{payload[:title]}\" for the #{payload[:event_name]}</p> <p><a href=\"http://www.orfheo.org/\">Orfheo</a></p>"
            },
            ca: {
              from: "no.reply.orfheo@gmail.com",
              subject: 'Proposta rebutjada',
              body: "<p> Lamentablement, #{payload[:organizer]} ha rebutjat la teva proposta \"#{payload[:title]}\" per al #{payload[:event_name]}</p> <p><a href=\"http://www.orfheo.org/\">Orfheo</a></p>"
            }
          }
          Pony.options = options[user[:lang].to_sym]
        end

        def new_event user, payload
          options = {
            es: {
              from: "no.reply.orfheo@gmail.com",
              subject: "Convocatoria Festival FAP (Factoria d'Arts de Patraix) Abierta!",
              body: "<p> Festival FAP (Factoria d'Arts de Patraix) - II Edició abre su convocatoria en orfheo!</p><p>Envía tu propuesta antes del 28 de abril.</p><p>Puedes acceder a la convocatoria a través del siguiente link:</p><p><a href=\"http://www.orfheo.org/event?id=e468f805-e481-4092-8134-066edb6ed000\">Orfheo/FAP</a></p>"
            }
          }
          Pony.options = options[:es]
        end

        def feedback user, payload
          Pony.options = {
            from: payload[:from],
            subject: 'feedback',
            body: "<p><b>Nombre:</b> #{payload[:name]}</p><p><b>Mensaje:</b> #{payload[:message]}</p>"
          }
        end

        def techSupport user, payload
          Pony.options = {
            from: payload[:from],
            subject: 'techSupport: ' + payload[:subject],
            body: "<p><b>Nombre:</b> #{payload[:name]}</p><p><b>Perfil:</b> #{payload[:profile]}</p><p><b>Navegador:</b> #{payload[:browser]}</p><p><b>Mensaje:</b> #{payload[:message]}</p>"
          }
        end

        def business user, payload
          Pony.options = {
            from: payload[:from],
            subject: 'services: ' + payload[:subject],
            body: "<p><b>Nombre:</b> #{payload[:name]}</p><p><b>Teléfono:</b> #{payload[:phone]}</p><p>Contacto teléfono: #{payload[:contactPhone]}</p><p>Contacto Hangout: #{payload[:contactHangout]}</p><p><b>Disponibilidad:</b> #{payload[:dayAvailability]}</p><p><b>Disponibilidad horaria:</b> #{payload[:periodAvailability]}</p><p><b>Links:</b> #{payload[:links]}</p><p><b>Mensaje:</b> #{payload[:message]}</p>"
          }
        end
      end
    end
  end
end
