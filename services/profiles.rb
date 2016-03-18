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
        old_pictures = profile_old_pictures profile
        update profile.to_h
        destroy_old_pictures old_pictures, profile
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
        old_pictures = proposal_old_pictures proposal
        Repos::Profiles.modify_proposal proposal.to_h
        destroy_old_pictures old_pictures, proposal
        proposal.to_h
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

      def profile_old_pictures profile
        fields = profile.image_fields
        fields.map{ |field|
          [field, Repos::Profiles.profile_old_pictures(profile.uuid, field)]
        }.to_h
      end

      def proposal_old_pictures proposal
        fields = proposal.image_fields
        fields.map{ |field|
          [field, Repos::Profiles.proposal_old_pictures(proposal.uuid, field)]
        }.to_h
      end

      def destroy_old_pictures old_pictures, element
        #clase element de la que derivan profile y proposal
        unused_pictures = old_pictures.keys.map{ |field|
          next if old_pictures[field].blank?
          next old_pictures[field] if element[field].blank?
          old_pictures[field].reject{ |picture|
            element[field].include? picture
          }
        }.compact.flatten
        Cloudinary::Api.delete_resources(unused_pictures) unless unused_pictures.blank?
      end
    end
  end
end
