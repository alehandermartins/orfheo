module Services
  class Users
    class << self

      def register params
        user = User.new params
        Services::Mails.deliver_mail_to user.to_h, :welcome
        Repos::Users.add user.to_h
      end

      def exists? email
        Repos::Users.exists?({email: email})
      end

      def validated_user code
        return false unless UUID.validate code
        return false unless Repos::Users.exists?({validation_code: code})
        validate code
      end

      def user_id_for email, password
        user = Repos::Users.grab({email: email})
        raise Pard::Invalid.new 'incorrect_password' unless (user[:email] == email && user[:password] == password)
        raise Pard::Invalid.new 'not_validated_user' unless user[:validation] == true
        user[:user_id]
      end

      def forgotten_password email
        Repos::Users.modify({email: email}, {validation_code: SecureRandom.uuid})
        user = Repos::Users.grab({email: email})
        Services::Mails.deliver_mail_to user, :forgotten_password
      end

      def modify_password user_id, new_password
        Repos::Users.modify({user_id: user_id}, {password: new_password})
      end

      private
      def validate code
        user = Repos::Users.grab({validation_code: code})
        Repos::Users.validate({validation_code: code})
        user[:user_id]
      end
    end
  end
end
