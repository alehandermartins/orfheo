require 'uuid'
module Services
  class Users
    class << self

      def register user
        user.merge! validation: false
        user.merge! validation_code: SecureRandom.uuid
        deliver_welcome_mail_to user
        Repos::Users.add user
      end

      def deliver_welcome_mail_to user
        Services::Mails.deliver_welcome_mail_to user
      end

      def exists? email
        Repos::Users.exists? email
      end
    end
  end
end
