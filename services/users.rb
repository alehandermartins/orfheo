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

      def exists? email
        Repos::Users.exists?({email: email})
      end

      def check_validation_code code
        return false unless UUID.validate code
        return false unless Repos::Users.exists?({validation_code: code})
        true
      end

      def validate_user code
        Repos::Users.validate({validation_code: code})
      end

      private
      def deliver_welcome_mail_to user
        Services::Mails.deliver_welcome_mail_to user
      end
    end
  end
end
