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
        Repos::Users.validate code
      end

      def user_id_for email, password
        user = Repos::Users.grab({email: email})
        raise Pard::Invalid::Password unless (user[:email] == email && user[:password] == password)
        raise Pard::Invalid::Unvalidated unless user[:validation] == true
        user[:user_id]
      end

      def forgotten_password email
        user = Repos::Users.reseted_user email
        Services::Mails.deliver_mail_to user, :forgotten_password
      end

      def modify_password user_id, new_password
        Repos::Users.modify({user_id: user_id}, {password: new_password})
      end

      def delete_user user_id
        profiles = Repos::Profiles.get_profiles :user_profiles, {user_id: user_id}
        profiles.each{ |profile|
          Services::Profiles.delete_profile profile[:profile_id]
        }
        Repos::Users.delete_user user_id
      end
    end
  end
end
