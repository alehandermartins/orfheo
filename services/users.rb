require 'uuid'
module Services
  class Users
    class << self

      def register user
        user.merge! validation: false
        user.merge! validation_code: SecureRandom.uuid
        Services::Mails.deliver_mail_to user, :welcome
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
        user[:validation] == true
      end

      def correct_password? email, password
        user = Repos::Users.grab({email: email})
        user[:email] == email && user[:password] == password
      end

      def forgotten_password email
        Repos::Users.modify({email: email}, {validation_code: SecureRandom.uuid})
        user = Repos::Users.grab({email: email})
        Services::Mails.deliver_mail_to user, :forgotten_password
      end

      def modify_password email, new_password
        Repos::Users.modify({email: email}, {password: new_password})
      end

      private
      def validate code
        user = Repos::Users.grab({validation_code: code})
        Repos::Users.validate({validation_code: code})
        user[:email]
      end
    end
  end
end
