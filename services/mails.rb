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
            subject: 'Bienvenido/a a orfheo',
            body: "<p> Bienvenido/a a la plataforma para la gestión de la convocatoria del Benimaclet conFusión 2016. Para continuar con la inscripción en el festival activa tu cuenta con el siguiente enlace</p> <p><a href=\"http://www.orfheo.org/login/validate/#{user[:validation_code]}\">Activa tu cuenta</a> </p>"
          }
        end

        def forgotten_password user
          Pony.options = {
            subject: 'Recupera tu cuenta',
            body: "<p> Puedes acceder a tu página de usuario a través del siguiente enlace </p> <p> <a href=\"http://www.orfheo.org/login/validate/#{user[:validation_code]}\">Accede a tu página</a></p> <p> Este enlace sólo es válido una vez. Si no recuerdas tu contraseña, no olvides definir una nueva una vez dentro. </p>"
          }
        end

        def last_two_weeks user
          Pony.options = {
            subject: 'Benimaclet conFusión Festival: Últimas dos semanas para inscribirse',
            body: "<p> Has enviado ya tu propuesta al conFusión Festival? Muchos ya lo han hecho, entra en <a href=\"http://www.orfheo.org\">Orfheo</a>, navega por sus perfiles y descubre a los artistas con los que compartirás escenario!</p> <p> Sólo quedan 15 días para cerrar la convocatoria, asegúrate de enviar tu propuesta a través de tu perfil antes del 15 de junio. Puedes acceder a tu página de usuario a través de este enlace </p> <p><a href=\"http://www.orfheo.org/login/validate/#{user[:validation_code]}\">Accede</a> </p>"
          }
        end
      end
    end
  end
end
