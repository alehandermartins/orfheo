module Services
  class Profiles
    class << self

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
        old_pictures = get_pictures(profile)
        Util.destroy_old_pictures old_pictures, {}
        Repos::Profiles.delete_profile profile_id
      end

      def profile_old_pictures profile_id
        profile = Repos::Profiles.get_profiles :profile, {profile_id: profile_id}
        get_pictures profile
      end

      def production_old_pictures production_id
        production = Repos::Profiles.get_profiles :production, {production_id: production_id}
        get_pictures production
      end

      def destroy_profile_old_pictures old_pictures, profile
        new_pictures = get_pictures profile
        Util.destroy_old_pictures old_pictures, new_pictures
      end

      def destroy_production_old_pictures old_pictures, production
        new_pictures = get_pictures production
        storable_pictures = Services::Calls.proposals_old_pictures production[:production_id]
        production_photos = production[:photos]
        production_photos = [] if production[:photos].blank? 
        new_pictures = {photos: production_photos}
        storable_pictures.merge!(new_pictures){ |key, a_value, b_value| (a_value || []) + (b_value || [])}
        Util.destroy_old_pictures old_pictures, new_pictures
      end

      private
      def get_pictures element
        return {} if element.blank?
        [:profile_picture, :photos].map{ |field|
          [field, element[field]]
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
