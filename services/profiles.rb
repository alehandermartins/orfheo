module Services
  class Profiles
    class << self

      def delete_production production_id
        old_pictures = production_old_pictures production_id
        Util.destroy_old_pictures old_pictures, {} 
        Repos::Profiles.delete_production production_id
      end

      def delete_profile profile_id
        profile = Repos::Profiles.get_profile profile_id
        delete_productions profile if profile.has_key? :productions
        old_pictures = get_pictures(profile)
        Util.destroy_old_pictures old_pictures, {}
        Repos::Events.delete_artist_profile profile_id if profile[:type] == 'artist'
        Repos::Events.delete_space_profile profile_id if profile[:type] == 'space'
        Repos::Profiles.delete_profile profile_id
      end

      def profile_old_pictures profile_id
        profile = Repos::Profiles.get_profile profile_id
        get_pictures profile
      end

      def production_old_pictures production_id
        production = Repos::Profiles.get_production production_id
        get_pictures production
      end

      def destroy_old_pictures old_pictures, element
        new_pictures = get_pictures element
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
    end
  end
end
