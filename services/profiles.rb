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
        old_pictures = profile_old_pictures profile
        Repos::Profiles.update profile.to_h
        destroy_old_pictures old_pictures, profile
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
        old_pictures = production_old_pictures production
        Repos::Profiles.modify_production production.to_h
        destroy_old_pictures old_pictures, production
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

      def production_old_pictures production
        fields = production.image_fields
        fields.map{ |field|
          [field, Repos::Profiles.production_old_pictures(production.uuid, field)]
        }.to_h
      end

      def destroy_old_pictures old_pictures, element
        #clase element de la que derivan profile y production
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
