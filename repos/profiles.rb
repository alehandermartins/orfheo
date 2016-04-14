module Repos
  class Profiles
    class << self

      def for db
        @@profiles_collection = db['profiles']
      end

      def update fields
        @@profiles_collection.update({profile_id: fields[:profile_id]},{
          "$set": fields
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

      def modify_production fields
        @@profiles_collection.update({"productions.production_id": fields[:production_id]},{
          "$set": {"productions.$": fields}
        },
        {upsert: true})
      end

      def exists? profile_id
        @@profiles_collection.count(query: {profile_id: profile_id}) > 0
      end

      def production_exists? production_id
        @@profiles_collection.count(query: {"productions.production_id": production_id}) > 0
      end

      def profile_old_pictures profile_id, field
        profile = grab({profile_id: profile_id}).first
        return [] unless profile.has_key? field
        profile[field]
      end

      def production_old_pictures production_id, field
        profile = grab({"productions.production_id": production_id}).first
        production = profile[:productions].select{|production| production[:production_id] == production_id}.first
        return [] unless production.has_key? field
        production[field]
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

          def all_user_aside args
            profiles = grab({})
            {
              my_profiles: profiles.select{ |profile| profile[:user_id] == args[:user_id]},
              profiles: profiles.select{ |profile|
                profile[:user_id] != args[:user_id] && non_empty_profile?(profile)
              }.shuffle
            }
          end

          def user_profiles args
            profiles = grab({user_id: args[:user_id]})
            sort_profiles(profiles, args[:profile_id]) unless args[:profile_id].nil?
            profiles.each{ |profile|
              profile.merge! proposals: Services::Calls.get_proposals_for(profile[:profile_id])
            }
          end

          def visit_profiles args
            profiles = grab({user_id: args[:user_id]})
            profiles.each{ |profile|
              profile.merge! proposals: Services::Calls.get_otter_proposals_for(profile[:profile_id], profile[:type])
            }
            sort_profiles(profiles, args[:profile_id]) unless args[:profile_id].nil?
          end

          def non_empty_profile? profile
            !profile[:productions].blank? || profile[:type] == 'space'
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
