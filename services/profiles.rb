require_relative '../lib/proposals/artist_proposal'
require_relative '../lib/proposals/space_proposal'
module Services
  class Profiles
    class << self

      PROPOSALS_MAP = {
        'artist' => ArtistProposal,
        'space' => SpaceProposal
      }

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

      def add_proposal params, user_id
        proposal = PROPOSALS_MAP[params['type']].new params, user_id
        proposal.add
      end
    end
  end
end
