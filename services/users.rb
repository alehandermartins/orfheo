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

      def validated_user code
        return false unless UUID.validate code
        return false unless Repos::Users.exists?({validation_code: code})
        validate code
      end

      def validated? email
        user = Repos::Users.grab({email: email})
        user['validation'] == true
      end

      def correct_password? email, password
        user = Repos::Users.grab({email: email})
        user['email'] == email && user['password'] == password
      end

      private
      def deliver_welcome_mail_to user
        Services::Mails.deliver_welcome_mail_to user
      end

      def validate code
        user = Repos::Users.grab({validation_code: code})
        Repos::Users.validate({validation_code: code})
        user['email']
      end
    end
  end
end
