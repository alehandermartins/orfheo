module Repos
  class Profiles
    class << self

      def for db
        @@profiles_collection = db['profiles']
      end

      def exists? profile_id
        return false unless UUID.validate(profile_id)
        @@profiles_collection.count(profile_id: profile_id) > 0
      end

      def production_exists? production_id
        return false unless UUID.validate(production_id)
        @@profiles_collection.count("productions.production_id": production_id) > 0
      end

      def name_available? user_id, name
        name_to_check = name.gsub(/\s+/, "").downcase
        profiles = grab({user_id: {"$ne": user_id}})
        names = profiles.map{|profile| profile[:name].gsub(/\s+/, "").downcase}
        !(names.include? name_to_check)
      end

      def update profile
        @@profiles_collection.update_one({profile_id: profile[:profile_id]},{
          "$set": profile,
        },
        {upsert: true})
      end

      def delete_profile profile_id
        @@profiles_collection.delete_one(profile_id: profile_id)
      end

      def add_production profile_id, production
        @@profiles_collection.update_one({profile_id: profile_id},{
          "$push": {productions: production}
        })
      end

      def modify_production production
        @@profiles_collection.update_one({"productions.production_id": production[:production_id]},{
          "$set": {"productions.$": production}
        },
        {upsert: true})
      end

      def delete_production production_id
        @@profiles_collection.update_one({ "productions.production_id": production_id },
          {
            "$pull": {'productions': {'production_id' => production_id}}
          }
        )
      end

      def get_all
        grab({}, true).shuffle
      end

      def get_profile profile_id
        grab({profile_id: profile_id}).first
      end

      def get_header_info user_id
        profiles = grab({user_id: user_id})
        profiles.map{ |profile|
          profile[:img] = profile[:profile_picture].first unless profile[:profile_picture].blank?
          profile[:img] = profile[:photos].first if profile[:profile_picture].blank? && !profile[:photos].blank?
          header_info profile
        }
      end

      def get_user_profiles user_id, profile_id = nil
        profiles = grab({user_id: user_id})
        sort_profiles(profiles, profile_id) unless profile_id.nil?
        profiles.each{ |profile|
          profile.merge! (Services::Events.get_my_info(profile[:profile_id], profile[:type]))
        }
      end

      def get_visitor_profiles user_id, profile_id = nil
        profiles = grab({user_id: user_id}, true)
        sort_profiles(profiles, profile_id) unless profile_id.nil?
        profiles.each{ |profile|
          profile.merge! (Services::Events.get_my_info(profile[:profile_id], profile[:type]))
          profile.delete(:proposals)
        }
      end

      def get_event_profiles event_id
        event = Repos::Events.get_event event_id
        participant_ids = event[:program].map{ |performance|
          [performance[:participant_id], performance[:host_id]]
        }.flatten.compact.uniq
        grab({profile_id: {"$in": participant_ids}}, true).shuffle
      end

      def get_production production_id
        results = grab({ "productions.production_id": production_id})
        return [] unless results.count > 0
        productions = results.first[:productions]
        the_production = productions.detect{ |element| element[:production_id] == production_id }
        Util.string_keyed_hash_to_symbolized the_production
      end

      def get_profile_owner profile_id
        profile = grab({profile_id: profile_id}).first
        profile[:user_id]
      end

      def get_production_owner production_id
        profile = grab({"productions.production_id": production_id}).first
        profile[:user_id]
      end

      private
      def grab query, filter = false
        results = @@profiles_collection.find(query)
        return [] unless results.count > 0

        results.map { |profile|
          filtered profile if filter == true
          Util.string_keyed_hash_to_symbolized profile
        }
      end

      def filtered profile
        profile.delete(:phone) if profile[:phone][:visible] == false
        return if profile[:productions].blank?
        profile[:productions].each { |production|
          production.delete(:cache) if production[:cache][:visible] == false
        }
      end

      def sort_profiles profiles, profile_id
        index = profiles.index{|profile| profile[:profile_id] == profile_id}
        profiles.insert(0, profiles.delete_at(index))
      end

      def header_info profile
        {
          profile_id: profile[:profile_id],
          name: profile[:name],
          img: profile[:img],
          color: profile[:color]
        }        
      end
    end
  end
end