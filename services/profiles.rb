module Services
  class Profiles
    class << self

      def exists? key, value, user_id
        profiles = Repos::Profiles.grab({user_id: user_id})
        profiles.any?{ |profile|
          profile[key] == value
        }
      end

      def get_profiles_for user_id
      profiles = Repos::Profiles.grab({user_id: user_id})
      end

      def get_profile_for user_id, profile_id
        profiles = get_profiles_for user_id
        profiles.select{ |profile|
          profile[:profile_id] == profile_id
        }.first
      end
    end
  end
end
