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
        raise Pard::Invalid::ExistingProfile if name_in_use? profile
        raise Pard::Invalid::Params if profile.wrong_params?
        store profile.to_h
        profile.uuid
      end

      def modify params, user_id
        raise Pard::Invalid::UnexistingProfile unless exists?(params[:profile_id], user_id)
        profile = PROFILES_MAP[params[:type]].new params, user_id
        raise Pard::Invalid::ExistingProfile if name_in_use? profile
        raise Pard::Invalid::Params if profile.wrong_params?
        destroy_old_pictures profile
        store profile.to_h
        profile.uuid
      end

      def exists? profile_id, user_id
        Repos::Profiles.exists?({user_id: user_id, profile_id: profile_id})
      end

      def get_profiles
        profiles = Repos::Profiles.grab({})
        profiles.select{ |profile|
          !profile[:proposals].blank? || profile[:type] == 'space'
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
      def name_in_use? profile
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

      def destroy_old_pictures profile
        prefix = profile[:user_id] + profile[:profile_id] + 'profile_picture'
        prefix = '1a441f90-4e22-4d01-b8af-f968958c77b4/df8cf1d4-39ee-427c-b7b2-9e27085c207a/profile_picture'
        images = Cloudinary::Api.resources(type: 'upload', prefix: prefix)['resources'].map{ |image| image['public_id']}
        ap images
      end
    end
  end
end
