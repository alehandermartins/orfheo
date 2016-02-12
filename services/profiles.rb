module Services
  class Profiles
    class << self

      def create profile, user_id
        profile.merge! user_id: user_id
        profile.merge! profile_id: SecureRandom.uuid
        Repos::Profiles.add profile
        profile[:profile_id]
      end

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

      def modify params, user_id
        profile = get_profile_for user_id, params['profile_id']
        params.each{ |key, value|
          Repos::Profiles.modify({profile_id: params['profile_id']}, {key => value})
        }
      end
    end
  end
end
