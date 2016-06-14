module Repos
  class Profiles
    class << self

      def for db
        @@profiles_collection = db['profiles']
      end

      def update profile
        @@profiles_collection.update({profile_id: profile[:profile_id]},{
          "$set": profile
        },
        {upsert: true})
      end

      def name_available? name, profile_id
        query = {profile_id: {"$ne": profile_id}, name: name}
        @@profiles_collection.count(query: query) == 0
      end

      def add_production profile_id, production
        @@profiles_collection.update({profile_id: profile_id},{
          "$push": {productions: production}
        })
      end

      def modify_production production
        @@profiles_collection.update({"productions.production_id": production[:production_id]},{
          "$set": {"productions.$": production}
        },
        {upsert: true})
      end

      def exists? profile_id
        return false unless UUID.validate(profile_id)
        @@profiles_collection.count(query: {profile_id: profile_id}) > 0
      end

      def production_exists? production_id
        return false unless UUID.validate(production_id)
        @@profiles_collection.count(query: {"productions.production_id": production_id}) > 0
      end

      def get_profiles method, args = nil
        Scout.get(method, args)
      end

      def get_profile_owner profile_id
        profile = grab({profile_id: profile_id}).first
        profile[:user_id]
      end

      def get_production_owner production_id
        profile = grab({"productions.production_id": production_id}).first
        profile[:user_id]
      end

      def delete_production production_id
        @@profiles_collection.update({ "productions.production_id": production_id },
          {
            "$pull": {'productions': {'production_id' => production_id}}
          }
        )
      end

      def delete_profile profile_id
        @@profiles_collection.remove({profile_id: profile_id})
      end

      private
      def grab query
        results = @@profiles_collection.find(query)
        return [] unless results.count > 0

        results.map { |profile|
         Util.string_keyed_hash_to_symbolized profile
        }
      end

      class Scout < Profiles
        class << self
          def get method, args
            Scout.send(method, args)
          end

          def all args
            grab({}).select{ |profile|
              non_empty_profile? profile
            }.shuffle
          end

          def profile args
            profile = grab({profile_id: args[:profile_id]}).first
            profile.merge! Repos::Calls.get_proposals(:profile_info, {profile_id: args[:profile_id]})
          end

          def production args
            results = grab({ "productions.production_id": args[:production_id]})
            return [] unless results.count > 0
            productions = results.first[:productions]
            the_production = productions.select{ |element| element[:production_id] == args[:production_id] }.first
            Util.string_keyed_hash_to_symbolized the_production
          end

          def user_profiles args
            profiles = grab({user_id: args[:user_id]})
            sort_profiles(profiles, args[:profile_id]) unless args[:profile_id].nil?
            profiles.each{ |profile|
              profile.merge! Repos::Calls.get_proposals(:profile_info, {profile_id: profile[:profile_id]})
            }
          end

          def visit_profiles args
            profiles = grab({user_id: args[:user_id]})
            profiles.each{ |profile|
              profile.merge! Repos::Calls.get_proposals(:otter_profile_info, {profile_id: profile[:profile_id], type: profile[:type]})
            }
            sort_profiles(profiles, args[:profile_id]) unless args[:profile_id].nil?
          end

          def non_empty_profile? profile
            !profile[:productions].blank? || profile[:type] == 'space' || profile[:type] == 'organization'
          end

          def sort_profiles profiles, profile_id
            index = profiles.index{|profile| profile[:profile_id] == profile_id}
            profiles.insert(0, profiles.delete_at(index))
          end
        end
      end
    end
  end
end
