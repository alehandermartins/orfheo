require_relative '../lib/profiles/artist_profile'
require_relative '../lib/profiles/space_profile'
require_relative '../lib/proposals/artist_proposal'
module Services
  class Profiles
    class << self

      PROFILES_MAP = {
        'artist' => ArtistProfile,
        'space' => SpaceProfile
      }

      def create params, user_id
        profile = PROFILES_MAP[params[:type]].new params, user_id
        raise Pard::Invalid.new 'existing_profile' if profile_exists? profile
        raise Pard::Invalid.new 'invalid_parameters' if profile.wrong_params?
        store profile.to_h
        profile.uuid
      end

      def exists? key, value, user_id
        profiles = Repos::Profiles.grab({user_id: user_id})
        profiles.any?{ |profile|
          profile[key] == value
        }
      end

      def get_profiles
        profiles = Repos::Profiles.grab({})
        profiles.select{ |profile|
          !profile[:proposals].blank?
        }.shuffle
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

      def add_proposal params, user_id
        proposal = ArtistProposal.new params, user_id
        proposal.add
      end

      private
      def profile_exists? profile
        profiles = Repos::Profiles.grab({user_id: profile[:user_id]})
        profiles.any?{ |the_profile|
          (the_profile[:name] == profile[:name] && the_profile[:profile_id] != profile[:profile_id])
        }
      end

      def store profile
        profile.each{ |field, value|
          profile.delete(field) if value.nil?
        }
        Repos::Profiles.update(profile[:profile_id], profile)
      end
    end
  end
end
