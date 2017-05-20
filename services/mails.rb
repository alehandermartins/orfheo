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
        def footer lang
          foot_note = {
            es: "La información contenida en este email y en sus anexos es confidencial y dirigida exclusivamente para el uso del destinatario. Si usted no es el destinatario, notifíquelo al remitente devolviendo el email y borre el mensaje de su sistema. Cualquier distribución, difusión, copia u otro uso de esta información sin nuestro consentimiento esta estrictamente prohibida. ORFHEO PROJECT S.L. no es responsable de los contenidos de este email, ni de los daños que pudiera sufrir su ordenador causados por virus informáticos contenidos en los anexos del mismo.",
            en: "The information contained in this email and in its annexes is confidential and directed exclusively for the use of the addressee. If you are not the addressee, notify the sender by returning the email and delete the message from your system. Any distribution, dissemination, copying or other use of this information without our consent is strictly prohibited. ORFHEO PROJECT S.L. Is not responsible for the contents of this email, nor for the damages that your computer may suffer caused by computer viruses contained in the annexes of the same.",
            ca: "La informació continguda en aquest email i en els seus annexos és confidencial i dirigida exclusivament per a l'ús del destinatari. Si vostè no és el destinatari, notifiqui-al remitent retornant el correu electrònic i esborri el missatge del seu sistema. Qualsevol distribució, difusió, còpia o un altre ús d'aquesta informació sense el nostre consentiment està estrictament prohibit. ORFHEO PROJECT S.L. no és responsable dels continguts d'aquest email, ni dels danys que pogués patir el seu ordinador causats per virus informàtics continguts en els annexos d'aquest."
          }
          "<div style=\"margin-top:25px\">
            <table border=\"0\" cellpadding=\"2\" cellspacing=\"2\" height=\"72\"
              width=\"605\">
              <tbody>
                <tr>
                  <td valign=\"top\"><a style = \"color:#000000; text-decoration:none\" href=\"http://www.orfheo.org/\"><img moz-do-not-send=\"false\" alt=\"orfheo\" title=\"orfheo\" src=\"https://res.cloudinary.com/hxgvncv7u/image/upload/v1494934211/orfheo_lettering_black_xl_uclayj.png\" style=\"display:block\" border=\"0\" height=\"37\" vspace=\"3\" width=\"119\"><br><font face=\"Arial\"><b> www.orfheo.org</b></font><br></a>
                  </td>
                  <td valign=\"top\">
                    <font style = \"color:#000000\" face=\"Arial\" size=\"-1\">ORFHEO PORJECT S.L.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</font>
                    <br>
                    <font style = \"color:#000000\" face=\"Arial\" size=\"-1\">C/ Nuestra Señora de la Asunción 4 bajo, 46020 Valencia, España</font>
                    <br>
                    <font style = \"color:#000000\" face=\"Arial\">C.I.F: B98911431 <br>
                      <a style = \"color:#000000\" href=\"http://www.facebook.com/orfheo.org\">Facebook</a> |
                      <a style = \"color:#000000\" href=\"http://twitter.com/@orfheo\">Twitter</a> |
                      <a style = \"color:#000000\" href=\"http://www.instagram.com/orfheo_org\">Instagram</a> |
                      <a style = \"color:#000000\" href=\"http://www.linkedin.com/company-beta/11078707\">Linkedin</a>
                    </font>
                  </td>
                </tr>
              </tbody>
            </table>
          <p style=\"color: #6f6f6f; font-size: 9px; margin-top:16px\">" + foot_note[lang] + "</p>
          </div>"
        end

        def welcome user, payload
          options = {
            es: {
              subject: 'Bienvenido/a a Orfheo',
              body: "<p> Bienvenido/a a Orfheo. Activa tu cuenta con el siguiente enlace</p> <p><a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}\">Activa tu cuenta</a> </p>"
            },
            en: {
              subject: 'Welcome to Orfheo',
              body: "<p> Welcome to Orfheo. Activate your account with the following link</p> <p><a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}\">Activate your account</a> </p>"
            },
            ca: {
              subject: 'Benvingut/da a Orfheo',
              body: "<p> Benvingut/da a Orfheo. Activa el teu compte amb el següent enllaç</p> <p><a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}\">Activa el teu compte</a> </p>"
            }
          }
          Pony.options = {
            from: "no.reply.orfheo@gmail.com",
            subject: options[user[:lang].to_sym][:subject],
            body: "<div style = \"color:#000000\">" + options[user[:lang].to_sym][:body] + "</div>"
          }
        end

        def event user, event
          options = {
            es: {
              subject: 'Bienvenido/a a Orfheo',
              body: "<p> Bienvenido/a a Orfheo. Para continuar con la inscripción en el #{event[:event_name]} activa tu cuenta con el siguiente enlace</p> <p><a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}&event_id=#{event[:event_id]}\">Activa tu cuenta</a> </p>"
            },
            en: {
              subject: 'Welcome to Orfheo',
              body: "<p> Welcome to Orfheo. In order to continue with the registration in the #{event[:event_name]} activate your account with the following link</p> <p><a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}&event_id=#{event[:event_id]}\">Activate your account</a> </p>"
            },
            ca: {
              subject: 'Benvingut/da a Orfheo',
              body: "<p> Benvingut/da a Orfheo. Per continuar amb la inscripció en el #{event[:event_name]} activa el teu compte amb el següent enllaç</p> <p><a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}&event_id=#{event[:event_id]}\">Activa el teu compte</a> </p>"
            }
          }
          Pony.options = {
            from: "no.reply.orfheo@gmail.com",
            subject: options[user[:lang].to_sym][:subject],
            body: "<div style = \"color:#000000\">" + options[user[:lang].to_sym][:body] + "</div>"
          }
        end

        def forgotten_password user, payload
          options = {
            es: {
              subject: 'Recupera tu cuenta',
              body: "<p> Puedes acceder a tu página de usuario a través del siguiente enlace </p> <p> <a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}\">Accede a tu página</a></p> <p> Este enlace sólo es válido una vez. Si no recuerdas tu contraseña, no olvides definir una nueva una vez dentro. </p>"
            },
            en: {
              subject: 'Recover your account',
              body: "<p> You can access your user page through the following link </p> <p> <a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}\">Access your page</a></p> <p> This link is only valid once. If you do not remember your password, do not forget to define a new one once inside. </p>"
            },
            ca: {
              subject: 'Recupera el teu compte',
              body: "<p> Pots accedir a la teva pàgina d'usuari mitjançant el següent enllaç </p> <p> <a href=\"http://www.orfheo.org/login/validate?id=#{user[:validation_code]}\">Accedeix a la teva pàgina</a></p> <p> Aquest enllaç només és vàlid un cop. Si no recordes la contrasenya, no oblidis definir una nova un cop dins. </p>"
            },
          }
          Pony.options = {
            from: "no.reply.orfheo@gmail.com",
            subject: options[user[:lang].to_sym][:subject],
            body: "<div style = \"color:#000000\">" + options[user[:lang].to_sym][:body] + "</div>"
          }
        end

        def rejected user, payload
          options = {
            es: {
              subject: 'Propuesta rechazada',
              body: "<p> Lamentablemente, #{payload[:organizer]} ha rechazado tu propuesta \"#{payload[:title]}\" para el #{payload[:event_name]}</p>"
            },
            en: {
              subject: 'Proposal rejected',
              body: "<p> Unfortunately, #{payload[:organizer]} has rejected your proposal \"#{payload[:title]}\" for the #{payload[:event_name]}</p>"
            },
            ca: {
              subject: 'Proposta rebutjada',
              body: "<p> Lamentablement, #{payload[:organizer]} ha rebutjat la teva proposta \"#{payload[:title]}\" per al #{payload[:event_name]}</p>"
            }
          }
          Pony.options = {
            from: "no.reply.orfheo@gmail.com",
            subject: options[user[:lang].to_sym][:subject],
            body: "<div style = \"color:#000000\">" + options[user[:lang].to_sym][:body] + "</div>"
          }
        end

        def new_event user, payload
          options = {
            es: {
              subject: "Convocatoria Benimaclet ConFusión Abierta!",
              body: "<p> Benimaclet ConFusión - IV Edición abre su convocatoria en orfheo!</p><p>Envía tu propuesta antes del 1 de julio.</p><p>Puedes acceder a la convocatoria a través del siguiente link:</p><p><a href=\"http://www.orfheo.org/event?id=a5bc4203-9379-5ee0-856a-55e1e5f3fac6\">Orfheo/ConFusión</a></p>"
            },
            en: {
              subject: "Benimaclet ConFusión Open Call!",
              body: "<p> Benimaclet ConFusión - IV Edition launches its call in orfheo!</p><p>Submit your proposal before July 1st.</p><p>You can access the call through the following link:</p><p><a href=\"http://www.orfheo.org/event?id=a5bc4203-9379-5ee0-856a-55e1e5f3fac6\">Orfheo/ConFusión</a></p>"
            },
            ca: {
              subject: "Convocatòria Benimaclet ConFusión Oberta!",
              body: "<p> Benimaclet Confusió - IV Edició obre la seva convocatòria en orfheo!</p><p>Envia la teva proposta abans de l'1 de juliol.</p><p>Pots accedir a la convocatòria a través del següent link:</p><p><a href=\"http://www.orfheo.org/event?id=a5bc4203-9379-5ee0-856a-55e1e5f3fac6\">Orfheo/ConFusión</a></p>"
            }
          }
          Pony.options = {
            from: "no.reply.orfheo@gmail.com",
            subject: options[user[:lang].to_sym][:subject],
            body: "<div style = \"color:#000000\">" + options[user[:lang].to_sym][:body] + "</div>"
          }
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
