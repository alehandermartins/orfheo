require_relative './profiles/artist_profile'
require_relative './profiles/space_profile'
module Services
  class Profiles
    class << self

      PROFILES_MAP = {
        'artist' => ArtistProfile,
        'space' => SpaceProfile
      }

      def create profile, user_id
        profile.merge! user_id: user_id
        profile.merge! profile_id: SecureRandom.uuid
        Repos::Profiles.add profile
      end

      def is_possible? params, user_id
        profile = PROFILES_MAP[params['type']]
        check profile, params, user_id
      end

      def check profile, params, user_id
        raise Pard::Invalid.new 'invalid_fields' unless profile.correct_keys? params
        raise Pard::Invalid.new 'invalid_value' unless profile.correct_params? params
        raise Pard::Invalid.new 'existing_profile' if exists? params['name'], user_id
      end

      def exists? name, user_id
        profiles = Repos::Profiles.grab({user_id: user_id})
        profiles.any?{ |profile|
          profile[:name] == name
        }
      end

      def get_profiles_for user_id
        profiles = Repos::Profiles.grab({user_id: user_id})
      end
    end
  end
end
