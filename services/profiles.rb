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
        raise Pard::Invalid::UnexistingProfile unless exists?(params[:profile_id])
        profile = PROFILES_MAP[params[:type]].new params, user_id
        raise Pard::Invalid::ExistingProfile if name_in_use? profile
        raise Pard::Invalid::Params if profile.wrong_params?
        destroy_old_pictures profile
        store profile.to_h
        profile.uuid
      end

      def exists? profile_id
        Repos::Profiles.exists?({profile_id: profile_id})
      end

      def get_profiles
        profiles = Repos::Profiles.grab({})
        profiles.select{ |profile|
          !profile[:proposals].blank? || profile[:type] == 'space'
        }.shuffle
      end

      def get_profiles_reject_user user_id
        profiles = get_profiles
        {
          my_profiles: get_profiles_for(user_id),
          profiles: profiles.reject{ |profile| profile[:user_id] == user_id}
        }
      end

      def get_profiles_for user_id
        profiles = Repos::Profiles.grab({user_id: user_id})
      end

      def get_profile_for user_id, profile_id
        profiles = Repos::Profiles.grab({user_id: user_id, profile_id: profile_id}).first
      end

      def add_proposal params, user_id
        proposal = ArtistProposal.new params, user_id
        raise Pard::Invalid::Params if proposal.wrong_params?
        Repos::Profiles.push({profile_id: params[:profile_id]}, proposal.to_h)
      end

      def modify_proposal params, user_id
        raise Pard::Invalid::UnexistingProposal unless proposal_exists?(params[:proposal_id])
        proposal = ArtistProposal.new params, user_id
        raise Pard::Invalid::Params if proposal.wrong_params?
        destroy_old_pictures proposal
        Repos::Profiles.modify_proposal(proposal.to_h)
      end

      private
      def name_in_use? profile
        profiles = Repos::Profiles.grab({user_id: profile[:user_id]})
        profiles.any?{ |the_profile|
          (the_profile[:name] == profile[:name] && the_profile[:profile_id] != profile[:profile_id])
        }
      end

      def proposal_exists? proposal_id
        Repos::Profiles.proposal_exists? proposal_id
      end

      def store profile
        profile.each{ |field, value|
          profile.delete(field) if value.nil?
        }
        Repos::Profiles.update(profile[:profile_id], profile)
      end

      def destroy_old_pictures element
        folders = element.image_folders
        folders.each{ |folder|
          unless element[folder[:field]].blank?
            public_ids = Cloudinary::Api.resources(type: 'upload', prefix: folder[:address])['resources'].map{ |image| image['public_id']}
            old_images = public_ids.reject { |public_id|
              element[folder[:field]].include? public_id
            }
            Cloudinary::Api.delete_resources(old_images) unless old_images.blank?
          end
        }
      end
    end
  end
end
