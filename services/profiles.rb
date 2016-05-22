require_relative '../lib/profiles/artist_profile'
require_relative '../lib/profiles/space_profile'
require_relative '../lib/productions/artist_production'
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
        Repos::Profiles.update profile.to_h
        profile.uuid
      end

      def modify params, user_id
        profile = PROFILES_MAP[params[:type]].new params, user_id
        raise Pard::Invalid::ExistingProfile unless name_available? profile
        raise Pard::Invalid::Params if profile.wrong_params?
        old_pictures = profile_old_pictures profile.uuid
        Repos::Profiles.update profile.to_h
        Util.destroy_old_pictures old_pictures, profile
        profile.uuid
      end

      def add_production params, user_id
        production = ArtistProduction.new params, user_id
        raise Pard::Invalid::Params if production.wrong_params?
        Repos::Profiles.add_production params[:profile_id], production.to_h
      end

      def modify_production params, user_id
        production = ArtistProduction.new params, user_id
        raise Pard::Invalid::Params if production.wrong_params?
        old_pictures = production_old_pictures production.uuid
        storable_pictures = Services::Calls.proposals_old_pictures production.uuid
        production_photos = production[:photos]
        production_photos = [] if production[:photos].blank? 
        new_pictures = {photos: production_photos}
        storable_pictures.merge!(new_pictures){ |key, a_value, b_value| (a_value || []) + (b_value || [])}
        Repos::Profiles.modify_production production.to_h
        Util.destroy_old_pictures old_pictures, storable_pictures
        production.to_h
      end

      def exists? profile_id
        Repos::Profiles.exists? profile_id
      end

      def production_exists? production_id
        Repos::Profiles.production_exists? production_id
      end

      def get_profiles method, args = nil
        Repos::Profiles.get_profiles method, args
      end

      def get_profile_owner profile_id
        Repos::Profiles.get_profile_owner profile_id
      end

      def get_production_owner production_id
        Repos::Profiles.get_production_owner production_id
      end

      def delete_production production_id
        old_pictures = production_old_pictures production_id
        storable_pictures = Services::Calls.proposals_old_pictures production_id
        Util.destroy_old_pictures old_pictures, storable_pictures 
        Repos::Profiles.delete_production production_id
      end

      def delete_profile profile_id
        profile = Repos::Profiles.get_profiles :profile, {profile_id: profile_id}
        delete_productions profile if profile.has_key? :productions
        delete_proposals profile
        old_pictures = profile_old_pictures profile_id
        Util.destroy_old_pictures old_pictures, {}
        Repos::Profiles.delete_profile profile_id
      end

      def production_old_pictures production_id
        production = Repos::Profiles.get_profiles :production, {production_id: production_id}
        return {} if production.blank?
        [:profile_picture, :photos].map{ |field|
          [field, production[field]]
        }.to_h
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

      def profile_old_pictures profile_id
        profile = Repos::Profiles.get_profiles :profile, {profile_id: profile_id}
        [:profile_picture, :photos].map{ |field|
          [field, profile[field]]
        }.to_h
      end

      def delete_productions profile
        profile[:productions].each{ |production|
          delete_production production[:production_id]
        }
      end

      def delete_proposals profile
        profile[:proposals].each{ |proposal|
          Services::Calls.delete_proposal proposal[:proposal_id]
        }
      end
    end
  end
end
