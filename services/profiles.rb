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
        raise Pard::Invalid::ExistingProfile unless name_available? profile
        raise Pard::Invalid::Params if profile.wrong_params?
        update profile.to_h
        profile.uuid
      end

      def modify params, user_id
        profile = PROFILES_MAP[params[:type]].new params, user_id
        raise Pard::Invalid::ExistingProfile unless name_available? profile
        raise Pard::Invalid::Params if profile.wrong_params?
        destroy_old_pictures profile
        # primero guardo y luego destruyo
        update profile.to_h
        profile.uuid
      end

      def add_proposal params, user_id
        proposal = ArtistProposal.new params, user_id
        raise Pard::Invalid::Params if proposal.wrong_params?
        Repos::Profiles.add_proposal params[:profile_id], proposal.to_h
      end

      def modify_proposal params, user_id
        proposal = ArtistProposal.new params, user_id
        raise Pard::Invalid::Params if proposal.wrong_params?
        destroy_old_pictures proposal
        # primero guardo y luego destruyo
        Repos::Profiles.modify_proposal proposal.to_h
      end

      def exists? profile_id
        Repos::Profiles.exists? profile_id
      end

      def proposal_exists? proposal_id
        Repos::Profiles.proposal_exists? proposal_id
      end

      def get_profiles method, args = nil
        Repos::Profiles.get_profiles method, args
      end

      private
      def name_available? profile
        Repos::Profiles.name_available? profile[:name], profile[:profile_id]
      end

      def update profile
        profile.each{ |field, value|
          profile.delete(field) if value.nil?
        }
        Repos::Profiles.update(profile)
      end

      def destroy_old_pictures element
        #clase element de la que derivan profile y proposal
        folders = element.image_folders
        folders.each{ |folder|
          next if element[folder[:field]].blank?
          public_ids = Cloudinary::Api.resources(type: 'upload', prefix: folder[:address])['resources'].map{ |image| image['public_id']}
          old_images = public_ids.reject { |public_id|
            element[folder[:field]].include? public_id
          }
          Cloudinary::Api.delete_resources(old_images) unless old_images.blank?
        }
      end
    end
  end
end
